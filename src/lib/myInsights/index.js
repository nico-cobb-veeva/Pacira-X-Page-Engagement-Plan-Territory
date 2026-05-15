import * as ds from '@/lib/myInsights/query';
import Moment from 'moment';
import { DISPLAY_DATE_FORMAT, SYSTEM_DATE_FORMAT, NO_DATA } from '@/lib/helper/constants';

// partition query
export const partitionQuery = (queryFunction, idList) => {
    const numIds = 2000;
    const deferred = window.Q.defer();

    // break up the idList into an array of lists each with at most numIds length
    let shortIdLists = [];
    for (let i = 0; i * numIds < idList.length; i++) {
        shortIdLists.push(  idList.slice(i * numIds, (i + 1) * numIds)  );
    }

    // For each of the shortened ID lists, run the query promise as part of a Q.all call
    // When all results are completed, the all() call will process an array of the result arrays,
    //      which can be flattened and returned
    window.Q.all(
        shortIdLists.map(list => {
            let innerDefer = window.Q.defer();
            queryFunction(list).then(res => {
                //console.log("Results from a partitioned query...");
                //console.log(res);
                innerDefer.resolve(res);
            })
            return innerDefer.promise;
        })
    ).then(allResults => {
        //console.log("All results from partitioned queries are done, resolving");
        //console.log(allResults.flat());
        deferred.resolve(allResults.flat());
    });

    return deferred.promise;
};

// current user detail
export const getUserDetail = () => {
    return ds.getDataForCurrentObject('user__sys', 'id')
    .then(userId => {
        return ds.getUserInfo([userId]);
    }).then(userResp => {
        return userResp;
    });
};

export const getUserTerritoryDetail = (userId, isManager) => {
    let terrIds = [];
    return ds.getUserTerritory(userId)
    .then(territoryResponse => {
        if (territoryResponse && territoryResponse.length > 0) {
            terrIds = territoryResponse.map(territory => territory.territory__v);
            return ds.getTerritory(terrIds, isManager);
        }
        return [];
    }).then(territoryResp => {
        return territoryResp;
    });
};

// current account detail
export const getAccountDetail = (territoryIds) => {
    let acctResp = [];
    return partitionQuery(ds.getAccountTerritories, territoryIds)
    .then(atResp => {
        let acctIds = [];
        if(atResp && atResp.length > 0) {
            acctIds = atResp.map(at => at.account__v);
        }
        return partitionQuery(ids => ds.getAccountInfo(ids, true), acctIds);
    }).then(aResp => {
        acctResp = aResp ? [...aResp] : [];
        let parentIds = [];
        acctResp.forEach(a => {
            if(a.primary_parent__v) parentIds.push(a.primary_parent__v);
        });
        if (parentIds.length > 0) {
            return partitionQuery(ids => ds.getAccountInfo(ids, true), Array.from(new Set(parentIds)));
        }
        return [];
    }).then(parentResp => {
        return { acctList: acctResp, parentAcctList: parentResp };
    });
};


// get child accounts
export const getChildAccountInfo = (acctIds) => {
    return partitionQuery(ds.getChildAccounts, acctIds)
    .then(chResp => {
        let childAcctIds = [];
        if(chResp && chResp.length > 0) {
            childAcctIds = Array.from(new Set(chResp.map(ch => ch.child_account__v)));
        }
        return childAcctIds.length > 0 ? partitionQuery(ds.getAccountInfo, childAcctIds) : [];
    }).then(acctResp => {
        return acctResp;
    });
};

// get call info
export const getCallInfo = (acctIds, activityTypeMap, userTypeMap) => {
    let calls = [], ownerIds = [], callIds = [], ownerMap = new Map(), childCallMap = new Map();
    return ds.getSubmittedCalls(acctIds)
    .then(callResp => {
        if(callResp && callResp.length > 0) {
            callResp.forEach(c => {
                ownerIds.push(c.ownerid__v);
                callIds.push(c.id);
                calls.push(c);
            });
        }
        return ds.getChildSubmittedCalls(callIds);
    }).then(childCallResp => {
        if(childCallResp && childCallResp.length > 0) {
            childCallResp.forEach(c => {
                if(!childCallMap.has(c.parent_call__v)) {
                    childCallMap.set(c.parent_call__v, []);
                } 
                childCallMap.get(c.parent_call__v).push(c.id);
            });
        }
        return ds.getUserInfo(ownerIds);
    }).then(userResp => {
        if(userResp && userResp.length > 0) {
            userResp.forEach(u => {
                if(!ownerMap.has(u.id)) {
                    ownerMap.set(u.id, u);
                }
            });
        }
        return processCallResponse(calls, ownerMap, activityTypeMap, userTypeMap, childCallMap);
    });
};
const processCallResponse = (calls, ownerMap, activityTypeMap, userTypeMap, childCallMap) => {
    let retList = [];
    if(calls && calls.length > 0) {
        retList = calls.map(c => {
            // activity type
            let desc = NO_DATA;
            if(activityTypeMap && activityTypeMap.has(c.activity_type__c)) {
                desc = activityTypeMap.get(c.activity_type__c);
            }

            // owner detail
            let userName = '', userType = '';
            if(ownerMap && ownerMap.has(c.ownerid__v)) {
                const owner = ownerMap.get(c.ownerid__v);
                userName = owner.name__v;
                userType = (userTypeMap && userTypeMap.has(owner.user_type__v)) ? userTypeMap.get(owner.user_type__v) : '';
            }

            return {
                id: c.id,
                linkObject: 'call2__v',
                accountId: c.account__v,
                product: (c.detailed_products__v) ? c.detailed_products__v : NO_DATA,
                description: desc, 
                isCLM: ((typeof c.clm__v === 'number' && c.clm__v === 1) || (typeof c.clm__v === 'boolean' && c.clm__v === true)) ? true : false,
                numAttendees: (childCallMap.has(c.id)) ? (childCallMap.get(c.id)).length : 0,
                ownerId: c.ownerid__v,
                ownerName: userName,
                ownerType: userType,
                displayDate: Moment(c.call_date__v).format(DISPLAY_DATE_FORMAT),
                systemDate: Moment(c.call_date__v).format(SYSTEM_DATE_FORMAT)
            };
        });
    }
    return retList;
};

// get email info
export const getSentEmailInfo = (acctIds, userTypeMap) => {
    let sentEmails = [];
    return ds.getSentEmails(acctIds)
    .then(seResp => {
        if(seResp && seResp.length > 0) {
            sentEmails = [...seResp];
        }
        return processEmailResponse(sentEmails);
    });
};
const processEmailResponse = (sentEmails) => {
    let retList = [];
    if(sentEmails && sentEmails.length > 0) {
        retList = sentEmails.map(se => {
            // activity type
            let desc = NO_DATA;
            if(se.subject__v) {
                desc = se.subject__v;
            }

            return {
                id: se.id,
                linkObject: 'sent_email__v',
                accountId: se.account__v,
                product: (se.product_display__v) ? se.product_display__v : NO_DATA,
                description: desc, 
                clicked: ((typeof se.opened__v === 'number' && se.opened__v === 1) || (typeof se.opened__v === 'boolean' && se.opened__v === true)) ? true : false,
                lastClicked: (se.last_click_date__v) ? Moment(se.last_click_date__v).format(DISPLAY_DATE_FORMAT) : NO_DATA,
                displayDate: Moment(se.email_sent_date__v).format(DISPLAY_DATE_FORMAT),
                systemDate: Moment(se.email_sent_date__v).format(SYSTEM_DATE_FORMAT)
            };
        });
    }
    return retList;
};

// get event info
export const getEventInfo = (hcpIds, eventTypeMap, userTypeMap) => {
    let eventIdSet = new Set(), eventList = [], ownerIds = [], ownerMap = new Map();
    return ds.getEventAttendees(hcpIds)
    .then(attendeeResp => {
        if(attendeeResp && attendeeResp.length > 0) {
            eventIdSet = new Set(attendeeResp.map(a => a.medical_event__v));
        }
        return ds.getMedicalEvents(Array.from(eventIdSet));
    }).then(eventResp => {
        if(eventResp && eventResp.length > 0) {
            eventResp.forEach(evt => {
                eventList.push(evt);
                ownerIds.push(evt.ownerid__v);
            });
        }
        return ds.getUserInfo(ownerIds);
    }).then(userResp => {
        if(userResp && userResp.length > 0) {
            userResp.forEach(u => {
                if(!ownerMap.has(u.id)) {
                    ownerMap.set(u.id, u);
                }
            });
        }
        return processEventResponse(eventList, eventTypeMap, ownerMap, userTypeMap);
    });
};

const processEventResponse = (events, eventTypeMap, ownerMap, userTypeMap) => {
    let retList = [];
    if(events && events.length > 0) {
        retList = events.map(evt => {
            // owner detail
            let userName = '', userType = '';
            if(ownerMap && ownerMap.has(evt.ownerid__v)) {
                const owner = ownerMap.get(evt.ownerid__v);
                userName = owner.name__v;
                userType = (userTypeMap && userTypeMap.has(owner.user_type__v)) ? userTypeMap.get(owner.user_type__v) : '';
            }

            return {
                id: evt.id,
                linkObject: 'medical_event__v',
                product: (evt.event_type__v && eventTypeMap.has(evt.event_type__v)) ? eventTypeMap.get(evt.event_type__v) : NO_DATA,
                description: evt.name__v, 
                ownerId: evt.ownerid__v,
                ownerName: userName,
                ownerType: userType,
                displayDate: Moment(evt.start_date__v).format(DISPLAY_DATE_FORMAT),
                systemDate: Moment(evt.start_date__v).format(SYSTEM_DATE_FORMAT)
            }
        })
    }
    return retList;
}

// get suggestion info
export const getSuggestionInfo = (accountMap) => {
    return ds.getSuggestions()
    .then(suggResp => {
        console.log("response:", suggResp);
        console.log("accountMap:", accountMap);
        return processSuggestionResponse(suggResp, accountMap);
    });
};

const processSuggestionResponse = (suggestions, accountMap) => {
    const suggestionTypes = ['call__v', 'email__v', 'insight__v'];
    let retList = [];
    if(suggestions && suggestions.length > 0) {
        retList = suggestions.filter(item => suggestionTypes.includes(item.record_type_name__v) && accountMap && accountMap.has(item.account__v)).map(s => {
            const today = Moment().format(SYSTEM_DATE_FORMAT);
            const threeDaysAgo = Moment().subtract(3, 'days').format(SYSTEM_DATE_FORMAT);
            const postedSystemDate = Moment(s.posted_date__v).format(SYSTEM_DATE_FORMAT);
            const expirationSystemDate = Moment(s.expiration_date__v).format(SYSTEM_DATE_FORMAT);
            const acctObj = (accountMap && accountMap.has(s.account__v)) ? accountMap.get(s.account__v) : null;
            return {
                id: s.id,
                title: s.title__v,
                reason: s.reason__v,
                priority: s.priority__v,
                objectTypeName: (s.record_type_name__v) ? s.record_type_name__v : '',
                accountId: s.account__v,
                accountName: (acctObj) ? acctObj.name : '',
                isPerson: (acctObj) ? acctObj.isPerson : false,
                displayDismiss: ((typeof s.display_dismiss__v === 'number' && s.display_dismiss__v === 1) || (typeof s.display_dismiss__v === 'boolean' && s.display_dismiss__v === true)) ? true : false,
                displayComplete: ((typeof s.display_mark_as_complete__v === 'number' && s.display_mark_as_complete__v === 1) || (typeof s.display_mark_as_complete__v === 'boolean' && s.display_mark_as_complete__v === true)) ? true : false,
                postedDate: Moment(s.posted_date__v).format(DISPLAY_DATE_FORMAT),
                postedSystemDate: postedSystemDate,
                expirationDate: Moment(s.expiration_date__v).format(DISPLAY_DATE_FORMAT),
                isPastDue: (s.record_type_name__v && s.record_type_name__v !== 'insight__v') ? Moment(expirationSystemDate).isBetween(threeDaysAgo, today, 'days', '[]') : false,
                isNew: Moment(postedSystemDate).isBetween(threeDaysAgo, today, 'days', '[]')
            }
        }).sort((a, b) => (b.priority && 1) - (a.priority && 1) || b.priority.localeCompare(a.priority));
    }
    return retList;
};

// get suggestion info
export const getKeyStakeholderInfo = (acctPlanIds) => {
    let accountMap = new Map(), callMap = new Map(), sentEmailMap = new Map(), addrMap = new Map(), ksList = [], accountIds = [];
    return ds.getKeyStakeholders(acctPlanIds)
    .then(ksResp => {
        if(ksResp && ksResp.length > 0) {
            ksResp.forEach(ks => {
                let isMarkedForDelete = false;
                if(ks.key_stakeholder__v) {
                    if((typeof ks.pac_key_stakeholder_marked_for_delete__c === 'number' && ks.pac_key_stakeholder_marked_for_delete__c === 1) 
                        || (typeof ks.pac_key_stakeholder_marked_for_delete__c === 'boolean' && ks.pac_key_stakeholder_marked_for_delete__c === true)) 
                    {
                        isMarkedForDelete = true;
                    }
                    if(isMarkedForDelete === false) {
                        ksList.push(ks);
                        accountIds.push(ks.key_stakeholder__v);
                    }
                }
            });
        }
        return ds.getAccountInfo(accountIds);
    }).then(acctResp => {
        if(acctResp && acctResp.length > 0) {
            acctResp.forEach(a => {
               if(!accountMap.has(a.id)) {
                    accountMap.set(a.id, a);
                }
            });
        }
        return ds.getSubmittedCalls(accountIds);
    }).then(callResp => {
        if(callResp && callResp.length > 0) {
            callResp.forEach(c => {
                if(!callMap.has(c.account__v)) {
                    callMap.set(c.account__v, c);
                }
            });
        }
        return ds.getSentEmails(accountIds);
    }).then(seResp => {
        if(seResp && seResp.length > 0) {
            seResp.forEach(se => {
                if(!sentEmailMap.has(se.account__v)) {
                    sentEmailMap.set(se.account__v, se);
                }
            });
        }
        return ds.getAddress(accountIds);
    }).then(addrResp => {
        if(addrResp && addrResp.length > 0) {
            addrResp.forEach(a => {
                if(!addrMap.has(a.account__v)) {
                    addrMap.set(a.account__v, a);
                }
            });
        }
        return processKeyStakeholderResponse(ksList, accountMap, callMap, sentEmailMap, addrMap);
    });
};

const processKeyStakeholderResponse = (keyStakeholders, accountMap, callMap, sentEmailMap, addressMap) => {
    console.log("entering key stakeholder process");
    console.log(keyStakeholders);
    console.log(accountMap);
    console.log(callMap);
    console.log(sentEmailMap);
    console.log(addressMap);
    let retList = [];
    if(keyStakeholders && keyStakeholders.length > 0) {
        keyStakeholders.map(ks => {
            let hasEmail = false;
            if (accountMap.has(ks.key_stakeholder__v)) {
                const accountObject = accountMap.get(ks.key_stakeholder__v);
                if (accountObject) {
                    if (accountObject.pacira_email__c || accountObject.email_cda__v || accountObject.secondary_email__c) {
                        hasEmail = true;
                    }
                } 
            }
            retList.push({
                id: ks.id,
                accountId: ks.key_stakeholder__v,
                role: ks.role__v, 
                account: (accountMap.has(ks.key_stakeholder__v)) ? accountMap.get(ks.key_stakeholder__v) : null,
                call: (callMap.has(ks.key_stakeholder__v)) ? callMap.get(ks.key_stakeholder__v) : null,
                sentEmail: (sentEmailMap.has(ks.key_stakeholder__v)) ? sentEmailMap.get(ks.key_stakeholder__v) : null,
                address: (addressMap.has(ks.key_stakeholder__v)) ? addressMap.get(ks.key_stakeholder__v) : null,
                hasEmail: hasEmail,
            });
        });
    }
    return retList;
};

// get engagement plan summary
export const getEngagementPlanSummaryData = (acctIds, pacTeam) => {
    let rawPlans = [], rawPlanTactics = [], rawAccountTactics = [], rawActionItems = [];
    return partitionQuery(ids => ds.getAccountPlans(ids, pacTeam), acctIds)
    .then(plans => {
        if (plans && plans.length > 0) {
            rawPlans = plans;
            return partitionQuery(ds.getPlanTactics, rawPlans.map(p => p.id));
        }
        return window.Q.resolve([]);
    })
    .then(ptResp => {
        if (ptResp && ptResp.length > 0) {
            rawPlanTactics = ptResp;
            return partitionQuery(ds.getAccountTactics, rawPlanTactics.map(pt => pt.id));
        }
        return window.Q.resolve([]);
    })
    .then(atResp => {
        if (atResp && atResp.length > 0) {
            rawAccountTactics = atResp;
            return partitionQuery(ds.getActionItems, rawAccountTactics.map(at => at.id));
        }
        return window.Q.resolve([]);
    })
    .then(aiResp => {
        if (aiResp && aiResp.length > 0) {
            rawActionItems = aiResp;
        }
        return { rawPlans, rawPlanTactics, rawAccountTactics, rawActionItems };
    });
};

// get action items info for dashboard
export const getDashboardActionItemsInfo = (planIds, actionItemMap) => {
    let actionItems = [], foundPlanIds = [];
    let planMap = new Map(), accountMap = new Map();

    return partitionQuery(ds.getDashboardActionItems, planIds)
    .then(aiResp => {
        if(aiResp && aiResp.length > 0) {
            aiResp.forEach(ai => {
                let isMarkedForDelete = false;
                if((typeof ai.pac_action_item_marked_for_delete__c === 'number' && ai.pac_action_item_marked_for_delete__c === 1) 
                    || (typeof ai.pac_action_item_marked_for_delete__c === 'boolean' && ai.pac_action_item_marked_for_delete__c === true)) {
                    isMarkedForDelete = true;
                }
                if(isMarkedForDelete === false) {
                    actionItems.push(ai);
                    if(ai.account_plan__v) foundPlanIds.push(ai.account_plan__v);
                }
            });
        }
        return foundPlanIds.length > 0 ? partitionQuery(ds.getAccountPlansByIds, Array.from(new Set(foundPlanIds))) : window.Q.resolve([]);
    }).then(planResp => {
        let acctIds = [];
        if(planResp && planResp.length > 0) {
            planResp.forEach(p => {
                planMap.set(p.id, p.account__v);
                if(p.account__v) acctIds.push(p.account__v);
            });
        }
        return acctIds.length > 0 ? partitionQuery(ds.getAccountInfo, Array.from(new Set(acctIds))) : window.Q.resolve([]);
    }).then(acctResp => {
        if(acctResp && acctResp.length > 0) {
            acctResp.forEach(a => accountMap.set(a.id, a.name__v));
        }
        return actionItems.map(ai => {
            const acctId = planMap.get(ai.account_plan__v);
            let itemName = ai.name__v;
            if(ai.pac_action_item__c && actionItemMap && actionItemMap.has(ai.pac_action_item__c)) {
                itemName = actionItemMap.get(ai.pac_action_item__c);
            }
            return {
                id: ai.id,
                name: itemName,
                accountId: acctId,
                accountName: (acctId && accountMap.has(acctId)) ? accountMap.get(acctId) : NO_DATA,
                dueDate: (ai.due_date__v) ? Moment(ai.due_date__v).format(DISPLAY_DATE_FORMAT) : NO_DATA
            };
        });
    });
};
