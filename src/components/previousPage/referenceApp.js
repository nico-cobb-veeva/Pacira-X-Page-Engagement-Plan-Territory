import { defineStore } from 'pinia';
import { partitionQuery, getUserDetail } from '@/lib/myInsights/index';
import { getAccounts, getAddress, getSubmittedCalls, getChildAccounts, getPicklistValueLabels, getObjectTypes } from '@/lib/myInsights/query';
import { NO_DATA, DISPLAY_DATE_FORMAT, SYSTEM_DATE_FORMAT } from '@/lib/helper/constants';
import * as Utils from '@/lib/helper/commonUtils';
import Moment from 'moment';

export const useAppStore = defineStore('app', {
    state: () => ({
        isOnline: false,
        loading: true,
        showNotification: false,
        notification: { variant: '', message: '' },
        user: { id: '', appProfile: '' },
        hcps: [],
        hcos: [],
        addressMap: new Map(),
        callMap: new Map,
        priorityMap: new Map(),
        titleMap: new Map(),
        specialtyMap: new Map(),
        objTypeMap: new Map()
    }),
    getters: {
        isUserOnline: (state) => state.isOnline,
        isLoading: (state) => state.loading,
        hasNotification: (state) => state.showNotification,
        getNotification: (state) => state.notification,
        personAccounts: (state) => state.hcps,
        businessAccounts: (state) => state.hcos,
        accountAddrMap: (state) => state.addressMap,
        accountCallMap: (state) => state.callMap,
        productPriorityMap: (state) => state.priorityMap,
        businessTitleMap: (state) => state.titleMap,
        primarySpecialtyMap: (state) => state.specialtyMap,
        currentUser: (state) => state.user,
        callObjectTypeMap: (state) => state.objTypeMap
    },
    actions: {
        async loadData() {
            try {
                // check if online or offline
                this.setIsOnline(Utils.isOnline());

                // set user
                this.setUser(await getUserDetail());

                // get call object types
                const objTypeResp = await getObjectTypes('call2__v');
                if(objTypeResp && objTypeResp.length > 0) {
                    objTypeResp.forEach(obj => {
                        if(!this.objTypeMap.has(obj.name)) {
                            this.objTypeMap.set(obj.name, obj.id);
                        }
                    });
                }

                // get picklist values
                const priorityResp = await getPicklistValueLabels('account__v', 'pac_exparel_priority__c');
                if(priorityResp) {
                    this.priorityMap = new Map(priorityResp);
                }

                const titleResp = await getPicklistValueLabels('account__v', 'business_title__c');
                if(titleResp) {
                    this.titleMap = new Map(titleResp);
                }

                const specialtyResp = await getPicklistValueLabels('account__v', 'specialty_1__v');
                if(specialtyResp) {
                    this.specialtyMap = new Map(specialtyResp);
                }

                // get accounts
                const acctResp = await getAccounts();
                let allAccountIds = [], hcoIdSet = new Set();
                if(acctResp && acctResp.length > 0) {
                    acctResp.forEach(a => {
                        let isPerson = false;
                        if(this.isOnline) {
                            if(a.ispersonaccount__v === true) {
                                isPerson = true;
                            }
                        } else {
                            if(a.ispersonaccount__v === 1) {
                                isPerson = true;
                            }
                        }

                        allAccountIds.push(a.id);
                        if(a.primary_parent__v) {
                            hcoIdSet.add(a.primary_parent__v);
                        }

                        if(isPerson) {
                            if(a.primary_parent__v) {
                                this.hcps.push(a);
                            }
                        } else {
                            this.hcos.push(a);
                        }
                    });
                }

                // get primary address
                const addressResp = await partitionQuery(getAddress, allAccountIds);
                if(addressResp && addressResp.length > 0) {
                    addressResp.forEach(addr => {
                        if(addr.account__v && !this.addressMap.has(addr.account__v)) {
                            const stateVal = Utils.capitalizeWords(addr.state_province__v).toUpperCase();
                            //const countryVal = Utils.capitalizeWords(addr.country__v).toUpperCase();

                            this.addressMap.set(addr.account__v, {
                                id: addr.id,
                                addrRaw: addr,
                                formattedAddress: Utils.formatAddress(
                                    addr.name__v, 
                                    addr.street_address_2_cda__v, 
                                    addr.city_cda__v, 
                                    stateVal, 
                                    addr.postal_code_cda__v,
                                    'United States'),
                                city: Utils.safe(addr.city_cda__v),
                                state: stateVal
                            });
                        }
                    });
                }

                // get submitted calls for hco's
                const callResp = await partitionQuery(getSubmittedCalls, allAccountIds);
                if(callResp && callResp.length > 0) {
                    callResp.forEach(c => {
                        if(!this.callMap.has(c.account__v)) {
                            this.callMap.set(c.account__v, [c]);
                        } else {
                            this.callMap.get(c.account__v).push(c);
                        }
                    });
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
        updateAttendee(acctId, clearAll) {
            if(acctId) {
                const acctObj = this.hcps.find(a => a.id === acctId);
                if(acctObj) {
                    if(acctObj.isSelected) {
                        acctObj.isSelected = !acctObj.isSelected;
                    } else {
                        acctObj['isSelected'] = true;
                    }
                }
            } else if(clearAll === true) {
                this.hcps.filter(a => a.isSelected === true).forEach(a => {
                    a.isSelected = false;
                });
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
        setUser(userList) {
            if(userList?.length) {
                this.user.id = userList[0].id;
                this.user.appProfile = userList[0].profile_name__v;
            }
        }
    }
});