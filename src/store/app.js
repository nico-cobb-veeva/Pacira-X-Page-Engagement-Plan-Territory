import { defineStore } from 'pinia';
import { partitionQuery, getUserDetail, getAccountDetail, getCallInfo, getSentEmailInfo, getSuggestionInfo, getKeyStakeholderInfo, getEventInfo, getChildAccountInfo, getUserTerritoryDetail, getDashboardActionItemsInfo, getEngagementPlanSummaryData } from '@/lib/myInsights/index';
import { getAddress, getPicklistValueLabels, getObjectTypes, getAccountPlans, getPlanTactics, getAccountTactics, getActionItems, getUserTerritory, getAccountTerritories, getActionedSuggestions } from '@/lib/myInsights/query';
import { NO_DATA, DISPLAY_DATE_FORMAT, SYSTEM_DATE_FORMAT, TEAM_EXPAREL, TEAM_IOVERA, TEAM_ZILRETTA, TEAM_OMFS, MANAGER_PROFILES } from '@/lib/helper/constants';
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
        territories: [],
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
        dashboardActionItems: [],
        rawPlans: [],
        rawPlanTactics: [],
        rawAccountTactics: [],
        rawActionItems: [],
        actionedSuggestions: [],
        interactionSummary: {
            totalCalls: 0,
            avgAttendees: 0,
            callsWithMedia: 0,
            mediaUsed: 0,
            totalEmails: 0,
            emailClickRate: 0,
            pendingSuggestions: 0,
            actionedSuggestions: 0
        },
        stakeholders: [],
        childHcpList: [],
        activeTerritoryAccountIds: [],
        allAccountMap: new Map(),
        childHcpMap: new Map(),
        statusMap: new Map(),
        accountTacticMap: new Map(),
        actionItemMap: new Map(),
        progressMap: new Map(),
        roleMap: new Map(),
        priorityMap: new Map(),
        specialtyMap: new Map(),
        userTypeMap: new Map(),
        hcoTypeMap: new Map(),
        activityTypeMap: new Map(),
        doNotCallMap: new Map(),
        eventTypeMap: new Map(),
        selectedDateRange: 90,
        selectedPlanTactic: {planTacticName: 'all'},
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
        accountPlan: (state) => state.acctPlan,
        planTactics: (state) => state.planTacticList,
        accountTacticOptionMap: (state) => state.accountTacticMap,
        actionItemOptionMap: (state) => state.actionItemMap,
        isManager: (state) => MANAGER_PROFILES.includes(state.user.appProfile)
    },
    actions: {
        async loadData(i18n) {
            this.loading = true;
            try {
                // check if online or offline
                this.setIsOnline(Utils.isOnline());

                // Reset state to ensure clean reload
                this.userTypeMap = new Map();
                this.hcoTypeMap = new Map();
                this.activityTypeMap = new Map();
                this.doNotCallMap = new Map();
                this.eventTypeMap = new Map();
                this.statusMap = new Map();
                this.progressMap = new Map();
                this.roleMap = new Map();
                // this.priorityMap = new Map();
                this.specialtyMap = new Map();

                // get picklist values
                // user type
                let picklistResp = await getPicklistValueLabels('user__sys', 'user_type__v');
                if(picklistResp) {
                    this.userTypeMap = new Map(picklistResp);
                }

                // hco type
                picklistResp = await getPicklistValueLabels('account__v', 'net_hco_type__c');
                if(picklistResp) {
                    this.hcoTypeMap = new Map(picklistResp);
                }

                // // product priority
                // picklistResp = await getPicklistValueLabels('account__v', 'pac_exparel_priority__c');
                // if(picklistResp) {
                //     this.priorityMap = new Map(picklistResp);
                // }

                // // account specialty
                // picklistResp = await getPicklistValueLabels('account__v', 'specialty_1__v');
                // if(picklistResp) {
                //     this.specialtyMap = new Map(picklistResp);
                // }

                // // call activity type
                // picklistResp = await getPicklistValueLabels('call2__v', 'activity_type__c');
                // if(picklistResp) {
                //     this.activityTypeMap = new Map(picklistResp);
                // }

                // // do not call banner
                // picklistResp = await getPicklistValueLabels('account__v', 'pacira_do_not_call_banner__c');
                // if(picklistResp) {
                //     this.doNotCallMap = new Map(picklistResp);
                // }

                // // event type
                // picklistResp = await getPicklistValueLabels('medical_event__v', 'event_type__v');
                // if(picklistResp) {
                //     this.eventTypeMap = new Map(picklistResp);
                // }

                // account tactic/action item status picklist
                picklistResp = await getPicklistValueLabels('account_tactic__v', 'account_tactic_status__v');
                if(picklistResp) {
                    this.statusMap = new Map(picklistResp);
                }

                picklistResp = await getPicklistValueLabels('action_item__v', 'pac_progress__c');
                if(picklistResp) {
                    this.progressMap = new Map(picklistResp);
                }

                // // key stakeholder role picklist
                // picklistResp = await getPicklistValueLabels('key_stakeholder__v', 'role__v');
                // if(picklistResp) {
                //     this.roleMap = new Map(picklistResp);
                // }

                // set user
                this.setUser(await getUserDetail(), this.userTypeMap);
                this.setSelectedPlanTactic({ planTacticName: 'all' });
                
                //pass the userID here to query the user_territory
                // set territories
                const isManager = this.isManager;
                const userTerritories = await getUserTerritoryDetail([this.user.id], isManager);
                
                if (isManager && userTerritories && userTerritories.length > 0) {
                    userTerritories.shift();
                }
                
                this.setTerritories(userTerritories);
                if(!this.territory.id && this.territories.length > 0) {
                    this.territory.id = this.territories[0].id;
                    this.territory.name = this.territories[0].name;
                }

                //set territory type
                this.setTerritoryType(this.territory.name);

                if (this.territory.id) {
                    await this.loadTerritoryData(this.territory.id, i18n);
                }

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
        async loadTerritoryData(territoryId, i18n) {
            // Reset territory-dependent state
            this.callList = [];
            this.seList = [];
            // this.medEvtList = [];
            this.suggestionList = [];
            this.planTacticList = [];
            this.acctTacticList = [];
            this.actionItemList = [];
            this.dashboardActionItems = [];
            this.rawPlans = [];
            this.rawPlanTactics = [];
            this.rawAccountTactics = [];
            this.rawActionItems = [];
            this.actionedSuggestions = [];
            // this.stakeholders = [];
            this.childHcpList = [];
            this.activeTerritoryAccountIds = [];
            this.allAccountMap = new Map();
            this.childHcpMap = new Map();
            this.accountTacticMap = new Map();
            this.actionItemMap = new Map();
            this.setSelectedPlanTactic({ planTacticName: 'all' });
            this.interactionSummary = { totalCalls: 0, avgAttendees: 0, callsWithMedia: 0, mediaUsed: 0, totalEmails: 0, emailClickRate: 0, pendingSuggestions: 0, actionedSuggestions: 0 };
            this.acctPlan = { id: '', name: '' };

            // set all account info specifically scoped to context territory
            const acctRespObj = await getAccountDetail([territoryId]);
            let allAcctIds = [];
            let acctList = [];
            let parentAcctList = [];

            if(acctRespObj && acctRespObj.acctList) {
                acctList = acctRespObj.acctList;
                parentAcctList = acctRespObj.parentAcctList || [];
            }

            if(acctList.length > 0) {
                allAcctIds = acctList.map(a => a.id);
                // const addressResp = await partitionQuery(getAddress, allAcctIds);
                this.setAccount(acctList, parentAcctList,this.hcoTypeMap, this.doNotCallMap);
                acctList.forEach(acct => {
                    this.allAccountMap.set(acct.id, { id: acct.id, name: acct.name__v, isPerson: (acct.ispersonaccount__v === 1 || acct.ispersonaccount__v === true) });
                });
            }

            // get calls for current hcos
            this.callList = await partitionQuery(ids => getCallInfo(ids, this.activityTypeMap, this.userTypeMap), allAcctIds);

            // get suggestions, sent email for childs hcps of current hcos
            const childHcpResp = await getChildAccountInfo(allAcctIds);
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
                            { id: ch.id, name: ch.name__v, isPerson: (ch.ispersonaccount__v === 1 || ch.ispersonaccount__v === true) ? true : false });
                    }
                });

                // get sent emails
                const allEmailAcctIds = Array.from(new Set([...allAcctIds, ...Array.from(this.childHcpMap.keys())]));
                this.seList = await partitionQuery(ids => getSentEmailInfo(ids, this.userTypeMap), allEmailAcctIds);

                // get events
                // this.medEvtList = await partitionQuery(ids => getEventInfo(ids, this.eventTypeMap, this.userTypeMap), Array.from(this.childHcpMap.keys()));
            }

            // get suggestions
            // this.setSuggestions(await partitionQuery(ids => getSuggestionInfo(ids, this.allAccountMap), Array.from(this.allAccountMap.keys())));
            this.suggestionList = await getSuggestionInfo(this.allAccountMap);


            // get account plan and associated data
            // account tactic/action item status picklist
            let picklistResp = await getPicklistValueLabels('account_tactic__v', 'account_tactic_status__v');
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

            const epData = await getEngagementPlanSummaryData(allAcctIds, pacTeam);
            if(epData && epData.rawPlans && epData.rawPlans.length > 0) {
                this.rawPlans = epData.rawPlans;
                this.rawPlanTactics = epData.rawPlanTactics;
                this.rawAccountTactics = epData.rawAccountTactics;
                this.rawActionItems = epData.rawActionItems;

                epData.rawPlans.forEach(plan => {
                    if (!this.acctPlan.id) {
                        this.acctPlan.id = plan.id;
                        this.acctPlan.name = plan.name__v;
                    }
                });

                if(epData.rawPlanTactics.length > 0) {
                    let planTacticSet = new Set();
                    let ptMap = new Map();
                    epData.rawPlanTactics.forEach(item => {
                        ptMap.set(item.id, item.name__v);
                        if (!planTacticSet.has(item.name__v)) {
                            planTacticSet.add(item.name__v);
                            // set plan tactics
                            this.planTacticList.push({
                                id: item.id,
                                name: item.name__v
                            });
                        }
                    });

                    if (planTacticSet.has('Facility Level')) {
                        this.setSelectedPlanTactic({ planTacticName: 'Facility Level' });
                    }

                    if(epData.rawAccountTactics.length > 0) {
                        this.setAccountTactics(epData.rawAccountTactics, ptMap);
                        this.setActionItems(epData.rawActionItems, ptMap);
                    }
                }
            }

            // Get Active Territory Accounts for Progress Widgets
            const activeTerritoryResp = await partitionQuery(getAccountTerritories, [territoryId]);
            this.activeTerritoryAccountIds = activeTerritoryResp ? activeTerritoryResp.map(at => at.account__v) : [];

            const activeAccountIdsSet = new Set(this.activeTerritoryAccountIds);
            const epAccountIds = this.rawPlans ? this.rawPlans.filter(p => activeAccountIdsSet.has(p.account__v)).map(p => p.account__v) : [];

            // Get Actioned Suggestions for KPI
            this.actionedSuggestions = await partitionQuery(ids => getActionedSuggestions(ids, [this.user.id], 90), epAccountIds);
            this.updateInteractionSummary(this.selectedDateRange);

            // Get Dashboard Action Items
            const planIds = this.rawPlans ? this.rawPlans.filter(p => activeAccountIdsSet.has(p.account__v)).map(p => p.id) : [];
            if (planIds.length > 0) {
                this.dashboardActionItems = await getDashboardActionItemsInfo(planIds, this.actionItemMap);
            } else {
                this.dashboardActionItems = [];
            }

            /** TRACK EVENT */
            this.trackEvent = true;
        },
        async refreshDashboardActionItems() {
            const activeAccountIdsSet = new Set(this.activeTerritoryAccountIds);
            const planIds = this.rawPlans ? this.rawPlans.filter(p => activeAccountIdsSet.has(p.account__v)).map(p => p.id) : [];
            if (planIds.length > 0) {
                this.dashboardActionItems = await getDashboardActionItemsInfo(planIds, this.actionItemMap);
            } else {
                this.dashboardActionItems = [];
            }
        },
        updateInteractionSummary(days) {
            this.selectedDateRange = days;

            const activeAccountIdsSet = new Set(this.activeTerritoryAccountIds);
            const epAccountIdsSet = new Set(this.rawPlans ? this.rawPlans.filter(p => activeAccountIdsSet.has(p.account__v)).map(p => p.account__v) : []);
            const targetDate = Moment().subtract(days, 'days').startOf('day');

            let totalCalls = 0, totalAttendees = 0, callsWithMedia = 0, mediaUsed = 0;
            (this.callList || []).forEach(c => {
                if (c && epAccountIdsSet.has(c.accountId) && Moment(c.systemDate).isSameOrAfter(targetDate, 'day')) {
                    totalCalls++;
                    totalAttendees += (c.numAttendees || 0);
                    if (c.isCLM) callsWithMedia++;
                    if (c.product && c.product !== NO_DATA) mediaUsed += c.product.split(',').length;
                }
            });

            const avgAttendees = totalCalls > 0 ? Math.round(totalAttendees / totalCalls) : 0;

            let totalEmails = 0, clickedEmails = 0;
            // we are removing the check for accountID due to the EMAIL account being the HCP, while the epACCOUNT is the 
            (this.seList || []).forEach(e => {
                if (e && Moment(e.systemDate).isSameOrAfter(targetDate, 'day')) {
                    totalEmails++;
                    if (e.clicked) clickedEmails++;
                }
            });
            const emailClickRate = totalEmails > 0 ? Math.round((clickedEmails / totalEmails) * 100) : 0;


            let pendingSuggestions = 0;
            // pendingSuggestions = this.suggestionList ? this.suggestionList.length : 0;
            (this.suggestionList || []).forEach(s => {
                if (s && epAccountIdsSet.has(s.accountId)&& Moment(s.postedSystemDate).isSameOrAfter(targetDate, 'day')) {
                    pendingSuggestions++;
                }
            });

            let actionedSuggestions = 0;
            (this.actionedSuggestions || []).forEach(s => {
                if (s && epAccountIdsSet.has(s.accountId) && Moment(s.postedSystemDate).isSameOrAfter(targetDate, 'day')) {
                    actionedSuggestions++;
                }
            });

            this.interactionSummary = { totalCalls, avgAttendees, callsWithMedia, mediaUsed, totalEmails, emailClickRate, pendingSuggestions, actionedSuggestions };
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
        setTerritories(territoryList) {
            if(territoryList?.length) {
                this.territories = territoryList.map(t => ({ id: t.id, name: t.name__v }));
            } else {
                this.territories = [];
            }
        },
        setSelectedPlanTactic(value) {
            this.selectedPlanTactic = value;
        },
        async changeTerritory(territoryId, i18n) {
            const selected = this.territories.find(t => t.id === territoryId);
            if(selected && selected.id !== this.territory.id) {
                this.loading = true;
                try {
                    this.territory.id = selected.id;
                    this.territory.name = selected.name;
                    this.setTerritoryType(this.territory.name);
                    await this.loadTerritoryData(territoryId, i18n);
                } catch (ex) {
                    console.log('Error:: ' + ex);
                    this.notification = { variant: 'error', message: ex.message };
                    this.showNotification = true;
                } finally {
                    this.loading = false;
                }
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
        setAccount(acctList, parentAcctList, hcoTypeMap, doNotCallMap) {
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
                // this.account.address = (addrList && addrList.length > 0 && addrList[0].pcr_full_address_cnx__c) ? addrList[0].pcr_full_address_cnx__c : NO_DATA;
                // this.account.exparelPriority = (acctList[0].pac_exparel_priority__c && priorityMap && priorityMap.has(acctList[0].pac_exparel_priority__c)) ? priorityMap.get(acctList[0].pac_exparel_priority__c) : NO_DATA;
                // this.account.ioveraPriority = (acctList[0].pac_iovera_priority__c && priorityMap && priorityMap.has(acctList[0].pac_iovera_priority__c)) ? priorityMap.get(acctList[0].pac_iovera_priority__c) : NO_DATA
                // this.account.zilrettaPriority = (acctList[0].pac_zilretta_priority__c && priorityMap && priorityMap.has(acctList[0].pac_zilretta_priority__c)) ? priorityMap.get(acctList[0].pac_zilretta_priority__c) : NO_DATA
            }
        },
        setSuggestions(resp) {
            if(resp && resp.length > 0) {
                this.suggestionList = [...resp];
            } else {
                this.suggestionList = [];
            }
        },
        setAccountTactics(resp, ptMap) {
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
                        planTacticId: (ptMap && ptMap.has(item.plan_tactic__v)) ? ptMap.get(item.plan_tactic__v) : item.plan_tactic__v,
                        status: (item.account_tactic_status__v && this.statusMap.has(item.account_tactic_status__v)) ? this.statusMap.get(item.account_tactic_status__v) : NO_DATA,
                        statusApi: (item.account_tactic_status__v) ? item.account_tactic_status__v : '',
                        isMarkedForDelete: isMarkedForDelete
                    };
                }).filter(item => item.isMarkedForDelete === false);
            } else {
                this.acctTacticList = [];
            }
        },
        setActionItems(resp, ptMap) {
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
                        planTacticId: (ptMap && ptMap.has(item.plan_tactic__v)) ? ptMap.get(item.plan_tactic__v) : item.plan_tactic__v,
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
        // setKeyStakeholders(resp) {
        //     if(resp && resp.length > 0) {
        //         this.stakeholders = [...resp];
        //     } else {
        //         this.stakeholders = [];
        //     }
        // },
    }
});