/* eslint-disable no-unused-vars */
import * as Utils from '@/lib/helper/commonUtils';
import { mockAdapter } from '@/lib/mockAdapter';
import { SYSTEM_DATE_FORMAT } from '@/lib/helper/constants';
import Moment from 'moment';

// promise global variable
const $q = window.Q;

// data service global variable
const ds = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? mockAdapter : window.ds;

// get user language
export const getUserLocale = () => {
    const deferred = $q.defer();
    ds.getDataForCurrentObject('user__sys', 'locale_code__v')
    .then(result => {
        deferred.resolve(result.user__sys.locale_code__v);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get data for current object in context
export const getDataForCurrentObject = (sObject, field) => {
    const deferred = $q.defer();
    ds.getDataForCurrentObject(sObject, field)
    .then(result => {
        deferred.resolve(result[sObject][field]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get available object
export const getAvailableObjects = () => {
    const deferred = $q.defer();
    ds.getAvailableObjects()
    .then(result => {
        deferred.resolve(result.data);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get picklist values
export const getPicklistValueLabels = (object, field) => {
    const deferred = $q.defer();
    ds.getPicklistValueLabels(object, field, false).then(result => {
        console.log('getPicklistValueLabels()', result[object]);
        if(result && result[object] && result[object][field] && (result[object][field]).length > 0) {
            deferred.resolve(result[object][field].map(obj => [obj.name, obj.label]));
        } else {
            deferred.resolve(null);
        }
    }, err => {
        console.log('Error getPicklistValueLabels ', err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get user detail
export const getUserInfo = (userIds) => {
    const deferred = $q.defer();
    const queryConfig = {
        object: 'user__sys',
        fields: ['id', 'name__v', 'profile_name__v', 'user_type__v'],
        where: 'id IN ' + Utils.getInStatementArray(userIds),
        sort: ['name__v ASC']
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getUserInfo()', result[queryConfig.object]);
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
}
//query user_territory object directly first
export const getTerritory = (territoryIds, isManager = false) => {
    const deferred = $q.defer();

    let whereClause = '';
    if(isManager) {
        whereClause = 'id IN ' + Utils.getInStatementArray(territoryIds) + ' OR parent_territory__v IN ' + Utils.getInStatementArray(territoryIds);
    } else {
        whereClause = 'id IN ' + Utils.getInStatementArray(territoryIds);
    }
    
    const queryConfig = {
        object: 'territory__v',
        fields: ['id', 'name__v'],
        where: whereClause,
        sort: ['name__v ASC']
    }
        ds.queryRecord(queryConfig).then(result => {
        console.log('getTerritory()', result[queryConfig.object]);
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
}

//from getCurrentData i can get userID
export const getUserTerritory = (userIds) => {
    const deferred = $q.defer();
    console.log("sup getUserTerritory");
    console.log("userID" + Utils.getInStatementArray(userIds));
    const queryConfig = {
        object: 'user_territory__v',
        fields: ['territory__v'],
        where: 'user__v IN ' + Utils.getInStatementArray(userIds),
        sort: ['name__v ASC']
    }
    console.log(queryConfig);
    ds.queryRecord(queryConfig).then(result => {
        console.log('getUserTerritory()', result[queryConfig.object]);
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
}

// get account territories
export const getAccountTerritories = (territoryIds) => {
    const deferred = $q.defer();
    const queryConfig = {
        object: 'account_territory__v',
        fields: ['account__v'],
        where: `territory__v IN ${Utils.getInStatementArray(territoryIds)}`
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getAccountTerritories()', result ? result[queryConfig.object] : []);
        let data = result && result[queryConfig.object] ? result[queryConfig.object] : [];
        deferred.resolve(data);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

//get account detail
export const getAccountInfo = (acctIds, isHcoOnly = false) => {
    const deferred = $q.defer();
    let whereClause = 'id IN ' + Utils.getInStatementArray(acctIds);
    if (isHcoOnly) {
        whereClause += ' AND ispersonaccount__v = false';
    }

    const queryConfig = {
        object: 'account__v',
        fields: ['id', 'name__v', 'ispersonaccount__v', 'pac_exparel_priority__c', 'pacira_primary_parent_name__c', 
                    'primary_parent__v', 'pac_iovera_priority__c', 'pac_zilretta_priority__c', 'net_hco_type__c', 'pacira_idn__c', 
                    'pacira_do_not_call_banner__c', 'website_cda__v', 'office_phone_cda__v', 'pacira_email__c', 'email_cda__v', 'secondary_email__c'],
        where: whereClause,
        sort: ['name__v ASC']
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getAccountInfo()', result[queryConfig.object]);
        let data = result[queryConfig.object] || [];
        if (isHcoOnly) {
            data = data.filter(item => item.ispersonaccount__v === false || item.ispersonaccount__v === 0);
        }
        deferred.resolve(data);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
}

//get primary addresses
export const getAddress = (acctIds) => {
    const queryConfig = {
        object: 'address__v',
        fields: ['id', 'account__v', 'name__v', 'street_address_2_cda__v', 'city_cda__v', 'state_province__v', 'postal_code_cda__v', 'country__v', 
                    'pcr_full_address_cnx__c'],
        where: 'account__v IN ' + Utils.getInStatementArray(acctIds) +
               ' AND inactive__v = false' +
               ' AND primary_cda__v = true'
    };
    const deferred = $q.defer();
    ds.queryRecord(queryConfig).then(result => {
        console.log('getAddress()', result[queryConfig.object]);
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise; 
};

// get calls
export const getSubmittedCalls = (acctIds, daysAgo = 90) => {
    const targetDate = Moment().subtract(daysAgo, "days").format(SYSTEM_DATE_FORMAT);
    const deferred = $q.defer();
    const queryConfig = {
        object: 'call2__v',
        fields: ['id', 'account__v', 'clm__v', 'call_date__v', 'ownerid__v', 'detailed_products__v', 'activity_type__c'],
        where: `account__v IN ${Utils.getInStatementArray(acctIds)}
               AND call2_status__v IN  ${Utils.getInStatementArray(['submitted__v'])}
               AND call_date__v >= '${targetDate}'`,
        sort: ['call_datetime__v DESC']
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getSubmittedCalls()', result[queryConfig.object]);
        let data = result[queryConfig.object] || [];
        data = data.filter(item => Moment(item.call_date__v).isSameOrAfter(targetDate, 'day'));
        deferred.resolve(data);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get child calls for a given group calls
export const getChildSubmittedCalls = (callIds, daysAgo = 90) => {
    const targetDate = Moment().subtract(daysAgo, "days").format(SYSTEM_DATE_FORMAT);
    const deferred = $q.defer();
    const queryConfig = {
        object: 'call2__v',
        fields: ['id', 'parent_call__v'],
        where: `parent_call__v IN ${Utils.getInStatementArray(callIds)}
               AND call2_status__v IN  ${Utils.getInStatementArray(['submitted__v'])}
               AND call_date__v >= '${targetDate}'`
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getChildSubmittedCalls()', result[queryConfig.object]);
        let data = result[queryConfig.object] || [];
        data = data.filter(item => Moment(item.call_date__v).isSameOrAfter(targetDate, 'day'));
        deferred.resolve(data);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get sent email
export const getSentEmails = (acctIds, daysAgo = 90) => {
    const targetDate = Moment().subtract(daysAgo, "days").format(SYSTEM_DATE_FORMAT);
    const deferred = $q.defer();
    const queryConfig = {
        object: 'sent_email__v',
        fields: ['id', 'account__v', 'subject__v', 'email_sent_date__v', 'opened__v', 'last_click_date__v', 'product_display__v'],
        where: `account__v IN ${Utils.getInStatementArray(acctIds)}
               AND sent_email_status__v IN  ${Utils.getInStatementArray(['sent__v', 'delivered__v'])}
               AND email_sent_date__v >= '${targetDate}'`,
        sort: ['email_sent_date__v DESC']
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getSentEmails()', result[queryConfig.object]);
        let data = result[queryConfig.object] || [];
        data = data.filter(item => Moment(item.email_sent_date__v).isSameOrAfter(targetDate, 'day'));
        deferred.resolve(data);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get event attendees
export const getEventAttendees = (acctIds) => {
    const date90DaysAgo = Moment().subtract(90, "days").format(SYSTEM_DATE_FORMAT);
    const deferred = $q.defer();
    const queryConfig = {
        object: 'event_attendee__v',
        fields: ['id', 'medical_event__v'],
        where: `account__v IN ${Utils.getInStatementArray(acctIds)} 
                AND event_attendee_status__v IN ${Utils.getInStatementArray(['attended__v', 'signed__v', 'registered__c', 'accepted__v', 'invited__v'])} 
                AND start_date__v >= '${date90DaysAgo}'`,
        sort: ['name__v ASC']
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getEventAttendees()', result[queryConfig.object]);
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get event attendees
export const getMedicalEvents = (eventIds) => {
    const date90DaysAgo = Moment().subtract(90, "days").format(SYSTEM_DATE_FORMAT);
    const deferred = $q.defer();
    const queryConfig = {
        object: 'medical_event__v',
        fields: ['id', 'name__v', 'ownerid__v', 'event_type__v', 'start_date__v'],
        where: `id IN ${Utils.getInStatementArray(eventIds)} AND start_date__v >= '${date90DaysAgo}'`,
        sort: ['start_date__v DESC']
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getMedicalEvents()', result[queryConfig.object]);
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

/*
export const getSubmittedCalls = (acctIds, daysAgo = 90) => {
    const targetDate = Moment().subtract(daysAgo, "days").format(SYSTEM_DATE_FORMAT);
    const deferred = $q.defer();
    const queryConfig = {
        object: 'call2__v',
        fields: ['id', 'account__v', 'clm__v', 'call_date__v', 'ownerid__v', 'detailed_products__v', 'activity_type__c'],
        where: `account__v IN ${Utils.getInStatementArray(acctIds)}
               AND call2_status__v IN  ${Utils.getInStatementArray(['submitted__v'])}
               AND call_date__v >= '${targetDate}'`,
        sort: ['call_datetime__v DESC']
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getSubmittedCalls()', result[queryConfig.object]);
        let data = result[queryConfig.object] || [];
        data = data.filter(item => Moment(item.call_date__v).isSameOrAfter(targetDate, 'day'));
        deferred.resolve(data);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};



        where = `dismissed__v = 0
                AND marked_as_complete__v = 0
                AND actioned__v = 0
                AND no_homepage__v = 0
                AND expiration_date__v >= ${today}
                AND posted_date__v >= ${targetDate}`


                LOOKING FOR SUGGESTIONS FROM ACCOUNT:
                V4TZZ0000JHCYP7
*/


// get suggestions
export const getSuggestions = (daysAgo = 90) => {
    const today = Moment().format(SYSTEM_DATE_FORMAT);
    const targetDate = Moment().subtract(daysAgo, "days").format(SYSTEM_DATE_FORMAT);
    // const deferred = $q.defer();

    let where = '';
    if(Utils.isOnline()){
        where = `(dismissed__v = null OR dismissed__v = 0)
                AND (marked_as_complete__v = null OR marked_as_complete__v = 0)
                AND (actioned__v = null OR actioned__v = 0)
                AND (no_homepage__v = null OR no_homepage__v = false)
                AND expiration_date__v >= '${today}'
                AND posted_date__v >= '${targetDate}'`
    } else {
        where = `(dismissed__v = null OR dismissed__v = 0)
                AND (marked_as_complete__v = null OR marked_as_complete__v = 0)
                AND (actioned__v = null OR actioned__v = 0)
                AND (no_homepage__v = null OR no_homepage__v = false)
                AND expiration_date__v >= '${today}'
                AND posted_date__v >= '${targetDate}'`
    }
    const deferred = $q.defer();
    /*
                fields: [
                'id', 
                'account__v', 
                'display_dismiss__v',
                'display_mark_as_complete__v',
                'posted_date__v',
                'priority__v',
                'reason__v',
                'record_type_name__v',
                'title__v',
                'expiration_date__v',
            ],
            */
    const queryConfig = {
        object: 'suggestion__v',
        fields: ['id', 'account__v', 'posted_date__v', 'expiration_date__v', 'record_type_name__v', 'title__v', 'reason__v', 'display_dismiss__v', 'display_mark_as_complete__v', 'priority__v'],
        where: where,
        sort: ['posted_date__v DESC']
    };
    console.log(where);
    ds.queryRecord(queryConfig).then(result => {
        console.log('getSuggestions()', result[queryConfig.object]);
        let data = result[queryConfig.object] || [];
        data = data.filter(item => Moment(item.posted_date__v).isSameOrAfter(targetDate, 'day'));
        deferred.resolve(data);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get actioned suggestions
export const getActionedSuggestions = (acctIds, ownerIds, daysAgo = 90) => {
    const targetDate = Moment().subtract(daysAgo, "days").format(SYSTEM_DATE_FORMAT);

    let where = '';
    if(Utils.isOnline()){
        where = `account__v IN ${Utils.getInStatementArray(acctIds)}
                AND actioned__v = true
                AND posted_date__v >= ${targetDate}`
    } else {
        where = `ownerid__v IN ${Utils.getInStatementArray(ownerIds)}
            AND account__v IN ${Utils.getInStatementArray(acctIds)}
            AND actioned__v = 1
            AND posted_date__v >= ${targetDate}`   
    }

    const deferred = $q.defer();
    const queryConfig = {
        object: 'suggestion__v',
        fields: ['id', 'account__v', 'posted_date__v', 'expiration_date__v', 'record_type_name__v', 'title__v', 'reason__v', 'display_dismiss__v', 'display_mark_as_complete__v', 'priority__v'],
        where: where,
        sort: ['posted_date__v DESC']
    };

    ds.queryRecord(queryConfig).then(result => {
        console.log('getActionedSuggestions()', result[queryConfig.object]);
        let data = result[queryConfig.object] || [];
        data = data.filter(item => Moment(item.posted_date__v).isSameOrAfter(targetDate, 'day'));
        deferred.resolve(data);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// child accounts
export const getChildAccounts = (acctIds) => {
    const deferred = $q.defer();
    const queryConfig = {
        object: 'child_account__v',
        fields: ['child_account__v'],
        where: 'parent_account__v IN ' + Utils.getInStatementArray(acctIds) +
                ' AND status__v = \'active__v\''
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getChildAccounts()', result[queryConfig.object]);
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get account plan
export const getAccountPlans = (acctIds, pacTeam) => {
    const deferred = $q.defer();
    const queryConfig = {
        object: 'account_plan__v',
        fields: ['id', 'name__v', 'account__v'],
        where: `account__v IN ${Utils.getInStatementArray(acctIds)} AND pac_team__c = '${pacTeam}'`,
        sort: ['end_date__v DESC']
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getAccountPlan()', result[queryConfig.object]);
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get plan tactic
export const getPlanTactics = (acctPlanIds) => {
    const deferred = $q.defer();
    const queryConfig = {
        object: 'plan_tactic__v',
        fields: ['id', 'name__v', 'account_plan__v'],
        where: 'account_plan__v IN ' + Utils.getInStatementArray(acctPlanIds),
        sort: ['name__v ASC']
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getPlanTactics()', result[queryConfig.object]);
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get account tactic
export const getAccountTactics = (planTacticIds) => {
    const deferred = $q.defer();
    const queryConfig = {
        object: 'account_tactic__v',
        fields: ['id', 'name__v', 'pac_objective__c', 'plan_tactic__v', 'account_tactic_status__v', 'pac_objective_marked_for_delete__c'],
        where: 'plan_tactic__v IN ' + Utils.getInStatementArray(planTacticIds),
        sort: ['name__v ASC']
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getAccountTactics()', result[queryConfig.object]);
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get account tactic
export const getAccountTacticByMobileId = (mobileId) => {
    const deferred = $q.defer();
    const queryConfig = {
        object: 'account_tactic__v',
        fields: ['id'],
        where: 'mobile_id__v IN ' + Utils.getInStatementArray([mobileId])
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getAccountTacticByMobileId()', result[queryConfig.object]);
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get account tactic
export const getActionItems = (acctTacticIds) => {
    const deferred = $q.defer();
    const queryConfig = {
        object: 'action_item__v',
        fields: ['id', 'name__v', 'pac_action_item__c', 'account_tactic__v', 'plan_tactic__v', 'action_item_status__v', 'due_date__v', 
                    'completed_date__v', 'pac_progress__c', 'pac_action_item_marked_for_delete__c', 'modified_date__v'],
        where: 'account_tactic__v IN ' + Utils.getInStatementArray(acctTacticIds),
        sort: ['due_date__v ASC']
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getActionItems()', result[queryConfig.object]);
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get dashboard action items
export const getDashboardActionItems = (planIds) => {
    const in30Days = Moment().add(30, "days").format(SYSTEM_DATE_FORMAT);
    const deferred = $q.defer();
    const queryConfig = {
        object: 'action_item__v',
        fields: ['id', 'name__v', 'pac_action_item__c', 'account_plan__v', 'ownerid__v', 'due_date__v', 'action_item_status__v', 'pac_action_item_marked_for_delete__c'],
        where: `account_plan__v IN ${Utils.getInStatementArray(planIds)}
                AND action_item_status__v != 'completed__v'
                AND due_date__v <= '${in30Days}'`,
        sort: ['due_date__v ASC']
    };
    ds.queryRecord(queryConfig).then(result => {
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get account plans by ids
export const getAccountPlansByIds = (planIds) => {
    const deferred = $q.defer();
    const queryConfig = {
        object: 'account_plan__v',
        fields: ['id', 'account__v'],
        where: `id IN ${Utils.getInStatementArray(planIds)}`
    };
    ds.queryRecord(queryConfig).then(result => {
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get key stakeholders
export const getKeyStakeholders = (acctPlanIds) => {
    const deferred = $q.defer();
    const queryConfig = {
        object: 'key_stakeholder__v',
        fields: ['id', 'key_stakeholder__v', 'role__v', 'pac_key_stakeholder_marked_for_delete__c', 'account_plan__v'],
        where: 'account_plan__v IN ' + Utils.getInStatementArray(acctPlanIds) +
                ' AND key_stakeholder__v != null',
        sort: ['name__v ASC']
    };
    ds.queryRecord(queryConfig).then(result => {
        console.log('getKeyStakeholders()', result[queryConfig.object]);
        deferred.resolve(result[queryConfig.object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// get veeva messages
export const getVeevaMessage = (language) => {
    const deferred = $q.defer();
    const queryConfig = {
        object: 'message__v',
        fields: ['name__v', 'text__v'],
        where: 'category__v IN (\'Account_Management\', \'Engagement_Plan_Dashboard\')'
    };
    ds.queryRecord(queryConfig).then(result => {
        deferred.resolve(Utils.arrayToObject(result.message__v, 'name__v', 'text__v'));
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// suggestion action
export const executeSuggestionAction = (suggestionId, actionType) => {
    const deferred = $q.defer();
    ds.executeSuggestionAction(suggestionId, actionType)
    .then(result => {
        deferred.resolve(result);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

// deep link for record detail view
export const viewRecord = (sObject, recordId, extId = null) => {
    const deferred = $q.defer();
    let deepLink = {
        object: sObject,
        fields: { id: recordId },
    };

    if(extId) {
        deepLink = {
            object: sObject,
            fields: { id: recordId },
            target: { external_id__v: extId}
        };
    }
    ds.viewRecord(deepLink).then(resp => {
        deferred.resolve(resp);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
}

// create record
export const createRecord = (configObject) => {
    const deferred = $q.defer();
    ds.createRecord(configObject).then(result => {
        deferred.resolve(result);
    }, err => {
        console.log(err);
        deferred.resolve(err);
    });
    return deferred.promise;
};

// update record
export const updateRecord = (objectName, recordId, fields) => {
    const deferred = $q.defer();
    const configObj = {
        object: objectName,
        id: recordId,
        fields: fields
    };
    ds.updateRecord(configObj).then(resp => {
        // console.log(resp);
        deferred.resolve(resp);
    }, err => {
        console.log(err);
        deferred.resolve(err);
    });
    return deferred.promise;
};

// new record
export const newRecord = (configObject) => {
    const deferred = $q.defer();
    ds.newRecord(configObject).then(result => {
        deferred.resolve(result);
    }, err => {
        console.log(err);
        deferred.reject(err);
    });
    return deferred.promise;
};

// Returns an array of object types for a given object name
// ex: [{label: 'Professional', name: 'professional__v', id: 'OOT00000000V301', isActive: true}]
export const getObjectTypes = (object) => {
    const deferred = $q.defer();
    ds.getObjectTypes(object, false).then(result => {
        console.log('getObjectTypes', result)
        deferred.resolve(result[object]);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
}