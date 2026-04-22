import { defineStore } from 'pinia';
import { partitionQuery, getUserDetail, getAccountDetail, getCallInfo, getSentEmailInfo, getSuggestionInfo, getKeyStakeholderInfo, getEventInfo, getChildAccountInfo, getUserTerritoryDetail } from '@/lib/myInsights/index';
import { getAvailableObjects, getAddress, getPicklistValueLabels, getObjectTypes, getAccountPlan, getPlanTactics, getAccountTactics, getActionItems, getUserTerritory } from '@/lib/myInsights/query';
import { NO_DATA, DISPLAY_DATE_FORMAT, SYSTEM_DATE_FORMAT, TEAM_EXPAREL, TEAM_IOVERA, TEAM_ZILRETTA, TEAM_OMFS } from '@/lib/helper/constants';
import * as Utils from '@/lib/helper/commonUtils';
import Moment from 'moment';

export const useAppStore = defineStore('app', {
    state: () => ({
        isOnline: false,
        loading: true,
        showNotification: false,
        notification: { variant: '', message: '' },
        user: { id: '', appProfile: '', userType: '' },
        account: { id: '', name: '', paciraEmail: '', primaryEmail: '', secondaryEmail: '', hcoType: '', parentId: '', parentName: '',  idnName: '', gpoName: '', phoneNo: '',
                website: '', address: '', productPromoRestrictions: '', sampleRestrictions: '', doNotCall: '' },
        territory: {id: '', name: ''},
        territoryType: {type: ''},
        callList: [],
        seList: [], 
        medEvtList: [],
        suggestionList: [],
        acctPlan: { id: '', name: '' },
        planTacticList: [],
        acctTacticList: [],
        actionItemList: [],
        stakeholders: [],
        childHcpList: [],
        allAccountMap: new Map(),
        childHcpMap: new Map(),
        statusMap: new Map(),
        accountTacticMap: new Map(),
        actionItemMap: new Map(),
        progressMap: new Map(),
        roleMap: new Map(),
        priorityMap: new Map(),
        specialtyMap: new Map(),
        selectedDateRange: 'ninetyDays',
        trackEvent: false
    }),
    getters: {
        isUserOnline: (state) => state.isOnline,
        isLoading: (state) => state.loading,
        hasNotification: (state) => state.showNotification,
        getNotification: (state) => state.notification,
        currUser: (state) => state.user,
        currAccount: (state) => state.account,
        currTerritory: (state) => state.territory,
    },
    actions: {
        async loadData(i18n) {
            try {
                // check if online or offline
                this.setIsOnline(Utils.isOnline());

                // get available Objects
                const availableObjects = await getAvailableObjects();
                console.log('Available Objects:', availableObjects);

                // get picklist values
                let userTypeMap, hcoTypeMap, priorityMap, specialtyMap, activityTypeyMap, doNotCallMap;

                // user type
                let picklistResp = await getPicklistValueLabels('user__sys', 'user_type__v');
                if(picklistResp) {
                    userTypeMap = new Map(picklistResp);
                }

                // hco type
                picklistResp = await getPicklistValueLabels('account__v', 'net_hco_type__c');
                if(picklistResp) {
                    hcoTypeMap = new Map(picklistResp);
                }

                // product priority
                picklistResp = await getPicklistValueLabels('account__v', 'pac_exparel_priority__c');
                if(picklistResp) {
                    this.priorityMap = new Map(picklistResp);
                }

                // account specialty
                picklistResp = await getPicklistValueLabels('account__v', 'specialty_1__v');
                if(picklistResp) {
                    this.specialtyMap = new Map(picklistResp);
                }

                // call activity type
                picklistResp = await getPicklistValueLabels('call2__v', 'activity_type__c');
                if(picklistResp) {
                    activityTypeyMap = new Map(picklistResp);
                }

                // do not call banner
                picklistResp = await getPicklistValueLabels('account__v', 'pacira_do_not_call_banner__c');
                if(picklistResp) {
                    doNotCallMap = new Map(picklistResp);
                }

                // set user
                this.setUser(await getUserDetail(), userTypeMap);
                
                //pass the userID here to query the user_territory
                // set territory
                this.setTerritory(await getUserTerritoryDetail([this.user.id]));

                //set territory type
                this.setTerritoryType(this.territory.name);

                // set current account info
                const acctRespObj = await getAccountDetail();
                if(acctRespObj && acctRespObj.acctList.length > 0) {
                    const addressResp = await getAddress([acctRespObj.acctList[0].id]);
                    this.setAccount(acctRespObj.acctList, acctRespObj.parentAcctList, addressResp, hcoTypeMap, this.priorityMap, doNotCallMap);
                    this.allAccountMap.set(this.account.id, { name: this.account.name, isPerson: this.account.isPerson });
                }

                // get calls for current hco
                this.callList = await getCallInfo([this.account.id], activityTypeyMap, userTypeMap);

                // get suggestions, sent email for childs hcps of current hco
                const childHcpResp = await getChildAccountInfo([this.account.id]);
                if(childHcpResp && childHcpResp.length > 0) {
                    childHcpResp.forEach(ch => {
                        this.childHcpList.push({
                            id: ch.id,
                            name: ch.name__v,
                            label: ch.name__v,
                            value: ch.id
                        });

                        if(!this.childHcpMap.has(ch.id)) {
                            this.childHcpMap.set(ch.id, ch.name__v);
                            this.allAccountMap.set(ch.id, 
                                { name: ch.name__v, isPerson: (ch.ispersonaccount__v === 1 || ch.ispersonaccount__v === true) ? true : false });
                        }
                    });

                    // get sent emails
                    this.seList = await getSentEmailInfo(Array.from(this.childHcpMap.keys()), userTypeMap);

                    // get events
                    // event type picklist
                    if(availableObjects && availableObjects.medical_event__v && availableObjects.event_attendee__v) {
                        let eventTypeMap = new Map();
                        picklistResp = await getPicklistValueLabels('medical_event__v', 'event_type__v');
                        if(picklistResp) {
                            eventTypeMap = new Map(picklistResp);
                        }
                        this.medEvtList = await getEventInfo(Array.from(this.childHcpMap.keys()), eventTypeMap, userTypeMap);
                    }
                }

                // get suggestions
                this.setSuggestions(await getSuggestionInfo(this.allAccountMap, [this.user.id]));

                if(availableObjects && availableObjects.account_plan__v && availableObjects.plan_tactic__v && availableObjects.account_tactic__v 
                    && availableObjects.action_item__v) {
                    // get account plan and associated data
                    // account tactic/action item status picklist
                    picklistResp = await getPicklistValueLabels('account_tactic__v', 'account_tactic_status__v');
                    if(picklistResp) {
                        this.statusMap = new Map(picklistResp);
                    }
                    // account tactic objective picklist
                    picklistResp = await getPicklistValueLabels('account_tactic__v', 'pac_objective__c');
                    if(picklistResp) {
                        let selectedObjectives = "";
                        if (this.territoryType.type === TEAM_EXPAREL) {
                            selectedObjectives = i18n('AM_EXPAREL_OBJECTIVES');
                        } else if (this.territoryType.type === TEAM_ZILRETTA) {
                            selectedObjectives = i18n('AM_ZILRETTA_OBJECTIVES');
                        } else if (this.territoryType.type === TEAM_OMFS) {
                            selectedObjectives = i18n('AM_OMFS_OBJECTIVES');
                        } else if (this.territoryType.type === TEAM_IOVERA) {
                            selectedObjectives = i18n('AM_IOVERA_OBJECTIVES');
                        }

                        const splitObjectives = selectedObjectives.split(';');
                        const objectiveSet = new Set(splitObjectives);
                        picklistResp.forEach(item => {
                            if (objectiveSet.has(item[0])) {
                                this.accountTacticMap.set(item[0], item[1]);
                            }
                        });
                    }
                    // action item picklist
                    picklistResp = await getPicklistValueLabels('action_item__v', 'pac_action_item__c');
                    if(picklistResp) {
                        let selectedActionItems = "";
                        if (this.territoryType.type === TEAM_EXPAREL) {
                            selectedActionItems = i18n('AM_EXPAREL_ACTION_ITEMS');
                        } else if (this.territoryType.type === TEAM_ZILRETTA) {
                            selectedActionItems = i18n('AM_ZILRETTA_ACTION_ITEMS');
                        } else if (this.territoryType.type === TEAM_OMFS) {
                            selectedActionItems = i18n('AM_OMFS_ACTION_ITEMS');
                        } else if (this.territoryType.type === TEAM_IOVERA) {
                            selectedActionItems = i18n('AM_IOVERA_ACTION_ITEMS');
                        }

                        const splitActionItems = selectedActionItems.split(';');
                        const actionItemsSet = new Set(splitActionItems);
                        picklistResp.forEach(item => {
                            if (actionItemsSet.has(item[0])) {
                                this.actionItemMap.set(item[0], item[1]);
                            }
                        });
                    }

                    picklistResp = await getPicklistValueLabels('action_item__v', 'pac_progress__c');
                    if(picklistResp) {
                        this.progressMap = new Map(picklistResp);
                    }

                    // key stakeholder role picklist
                    picklistResp = await getPicklistValueLabels('key_stakeholder__v', 'role__v');
                    if(picklistResp) {
                        this.roleMap = new Map(picklistResp);
                    }

                    let pacTeam = '';
                    if (this.territoryType.type === TEAM_EXPAREL) {
                        pacTeam = 'exparel_core__c';
                    } else if (this.territoryType.type === TEAM_ZILRETTA) {
                        pacTeam = 'zilretta__c';
                    } else if (this.territoryType.type === TEAM_OMFS) {
                        pacTeam = 'omfs__c';
                    } else if (this.territoryType.type === TEAM_IOVERA) {
                        pacTeam = 'iovera__c';
                    }
                    const acctPlanResp = await getAccountPlan(this.account.id, pacTeam);
                    if(acctPlanResp && acctPlanResp.length > 0) {
                        this.acctPlan.id = acctPlanResp[0].id;
                        this.acctPlan.name = acctPlanResp[0].name__v;

                        // get plan tactics
                        const ptResp = await getPlanTactics(this.acctPlan.id);
                        if(ptResp && ptResp.length > 0) {
                            let planTacticIds = [];
                            ptResp.forEach(item => {
                                planTacticIds.push(item.id);

                                // set plan tactics
                                this.planTacticList.push({
                                    id: item.id,
                                    name: item.name__v
                                });
                            });

                            // get account tactics
                            const acctTacticResp = await getAccountTactics(planTacticIds);
                            if(acctTacticResp && acctTacticResp.length > 0) {
                                let acctTacticIds = acctTacticResp.map(item => item.id);
                                this.setAccountTactics(acctTacticResp);

                                // get action items
                                this.setActionItems(await getActionItems(acctTacticIds));
                            }
                        }

                        if(availableObjects.key_stakeholder__v) {
                            this.setKeyStakeholders(await getKeyStakeholderInfo(this.acctPlan.id));
                        }
                    }
                }

                /** TRACK EVENT */
                this.trackEvent = true;
            } catch (ex) {
                console.log('Error:: ' + ex);
                this.notification = {
                    variant: 'error',
                    message: ex.message
                };
                this.showNotification = true;
            } finally {
                this.loading = false;
            }
        },
        setIsOnline(isOnline){
            this.isOnline = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') 
                            ? false
                            : isOnline;
        },
        setNotification({ show, variant, message }) {
            this.showNotification = show;
            this.notification.variant = variant;
            this.notification.message = message;
        },
        setUser(userList, userTypeMap) {
            if(userList?.length) {
                this.user.id = userList[0].id;
                this.user.appProfile = userList[0].profile_name__v
                this.user.userType = (userTypeMap && userTypeMap.has(userList[0].user_type__v)) ? userTypeMap.get(userList[0].user_type__v) : '';
            }
        },
        setTerritory(territoryList) {
            if(territoryList?.length) {
                this.territory.id = territoryList[0].id;
                this.territory.name = territoryList[0].name__v;
            }
        },
        setTerritoryType(territoryName) {
            if(territoryName) {
                if(territoryName[0].toUpperCase().includes(TEAM_EXPAREL.toUpperCase())) {
                    this.territoryType.type = TEAM_EXPAREL;
                } else if(territoryName[0].toUpperCase().includes(TEAM_IOVERA.toUpperCase())) {
                    this.territoryType.type = TEAM_IOVERA;
                } else if(territoryName[0].toUpperCase().includes(TEAM_ZILRETTA.toUpperCase())) {
                    this.territoryType.type = TEAM_ZILRETTA;
                } else if(territoryName[0].toUpperCase().includes(TEAM_OMFS.toUpperCase())) {
                    this.territoryType.type = TEAM_OMFS;
                } else {
                    this.territoryType.type = '';
                }
            }
        },
        setAccount(acctList, parentAcctList, addrList, hcoTypeMap, priorityMap, doNotCallMap) {
            if(acctList?.length) {
                this.account.id = acctList[0].id;
                this.account.name = acctList[0].name__v;
                this.account.isPerson = (acctList[0].ispersonaccount__v === 1 || acctList[0].ispersonaccount__v === true) ? true : false;
                this.account.hcoType = (acctList[0].net_hco_type__c && hcoTypeMap && hcoTypeMap.has(acctList[0].net_hco_type__c)) ? hcoTypeMap.get(acctList[0].net_hco_type__c) : NO_DATA;
                this.account.parentId = (parentAcctList && parentAcctList.length > 0) ? parentAcctList[0].id : '',
                this.account.parentName = (acctList[0].pacira_primary_parent_name__c) ? acctList[0].pacira_primary_parent_name__c : NO_DATA;
                this.account.idnName = (acctList[0].pacira_idn__c) ? acctList[0].pacira_idn__c : NO_DATA;
                this.account.gpoName = /*(acctList[0].primary_gpo__c) ? acctList[0].primary_gpo__c :*/ NO_DATA;
                this.account.phoneNo = (acctList[0].office_phone_cda__v) ? acctList[0].office_phone_cda__v : NO_DATA;
                this.account.website = (acctList[0].website_cda__v) ? acctList[0].website_cda__v : NO_DATA;
                this.account.paciraEmail = (acctList[0].pacira_email__c) ? acctList[0].pacira_email__c : NO_DATA;
                this.account.primaryEmail = (acctList[0].primary_email_cda__v) ? acctList[0].primary_email_cda__v : NO_DATA;
                this.account.secondaryEmail = (acctList[0].secondary_email__c) ? acctList[0].secondary_email__c : NO_DATA;
                // this.account.productPromoRestrictions = (acctList[0].pac_prod_restr__c) ? acctList[0].pac_prod_restr__c : NO_DATA;
                // this.account.sampleRestrictions = (acctList[0].pac_sample_restr__c) ? acctList[0].pac_sample_restr__c : NO_DATA;
                this.account.doNotCall = (acctList[0].pacira_do_not_call_banner__c && doNotCallMap && doNotCallMap.has(acctList[0].pacira_do_not_call_banner__c)) ? doNotCallMap.get(acctList[0].pacira_do_not_call_banner__c) : NO_DATA;
                this.account.address = (addrList && addrList.length > 0 && addrList[0].pcr_full_address_cnx__c) ? addrList[0].pcr_full_address_cnx__c : NO_DATA;
                this.account.exparelPriority = (acctList[0].pac_exparel_priority__c && priorityMap && priorityMap.has(acctList[0].pac_exparel_priority__c)) ? priorityMap.get(acctList[0].pac_exparel_priority__c) : NO_DATA;
                this.account.ioveraPriority = (acctList[0].pac_iovera_priority__c && priorityMap && priorityMap.has(acctList[0].pac_iovera_priority__c)) ? priorityMap.get(acctList[0].pac_iovera_priority__c) : NO_DATA
                this.account.zilrettaPriority = (acctList[0].pac_zilretta_priority__c && priorityMap && priorityMap.has(acctList[0].pac_zilretta_priority__c)) ? priorityMap.get(acctList[0].pac_zilretta_priority__c) : NO_DATA
            }
        },
        setSuggestions(resp) {
            if(resp && resp.length > 0) {
                this.suggestionList = [...resp];
            } else {
                this.suggestionList = [];
            }
        },
        setAccountTactics(resp) {
            if(resp && resp.length > 0) {
                this.acctTacticList = resp.map(item => {
                    let isMarkedForDelete = false;
                    if((typeof item.pac_objective_marked_for_delete__c === 'number' && item.pac_objective_marked_for_delete__c === 1) 
                        || (typeof item.pac_objective_marked_for_delete__c === 'boolean' && item.pac_objective_marked_for_delete__c === true)) {
                        isMarkedForDelete = true;
                    }
                    return {
                        id: item.id,
                        name: item.name__v,
                        objective: item.pac_objective__c,
                        planTacticId: item.plan_tactic__v,
                        status: (item.account_tactic_status__v && this.statusMap.has(item.account_tactic_status__v)) ? this.statusMap.get(item.account_tactic_status__v) : NO_DATA,
                        statusApi: (item.account_tactic_status__v) ? item.account_tactic_status__v : '',
                        isMarkedForDelete: isMarkedForDelete
                    };
                }).filter(item => item.isMarkedForDelete === false);
            } else {
                this.acctTacticList = [];
            }
        },
        setActionItems(resp) {
            if(resp && resp.length > 0) {
                this.actionItemList = resp.map(item => {
                    let isMarkedForDelete = false;
                    if((typeof item.pac_action_item_marked_for_delete__c === 'number' && item.pac_action_item_marked_for_delete__c === 1) 
                        || (typeof item.pac_action_item_marked_for_delete__c === 'boolean' && item.pac_action_item_marked_for_delete__c === true)) {
                        isMarkedForDelete = true;
                    }
                    return {
                        id: item.id,
                        name: item.name__v,
                        actionItem: item.pac_action_item__c,
                        accountTacticId: item.account_tactic__v,
                        planTacticId: item.plan_tactic__v,
                        statusApi: (item.action_item_status__v) ? item.action_item_status__v : '',
                        status: (item.action_item_status__v && this.statusMap.has(item.action_item_status__v)) ? this.statusMap.get(item.action_item_status__v) : NO_DATA,
                        dueDateSystem: (item.due_date__v) ? Moment(item.due_date__v).format(SYSTEM_DATE_FORMAT) : null,
                        dueDate: (item.due_date__v) ? Moment(item.due_date__v).format(DISPLAY_DATE_FORMAT) : NO_DATA,
                        completedDate: (item.completed_date__v) ? Moment(item.completed_date__v).format(DISPLAY_DATE_FORMAT) : NO_DATA,
                        progress: item.pac_progress__c ? item.pac_progress__c : '',
                        isMarkedForDelete: isMarkedForDelete
                    };
                }).filter(item => item.isMarkedForDelete === false);
            } else {
                this.actionItemList = [];
            }
        },
        setKeyStakeholders(resp) {
            if(resp && resp.length > 0) {
                this.stakeholders = [...resp];
            } else {
                this.stakeholders = [];
            }
        },
    }
});