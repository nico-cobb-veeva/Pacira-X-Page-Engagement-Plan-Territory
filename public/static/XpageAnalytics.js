var myAnalytics = (function() {

	'use strict';

    /**
    * Object to store the data 
    */
    const analyticsData__ = {
        userId: '',
        htmlId: '',
        date: '',
        isOnline: '',
        device: '', 
        action: '',
        actionDetail: '',
        excludedUsers: [],
        availableObjects: {},
        configLoaded: false,
        relatedAccount: ''
    }

    let _veevaUtils = null;
    if(window && window.VeevaUtilities) {
        _veevaUtils = new window.VeevaUtilities();
    }

    let myMethods = {};

    /**
    * These are the predefiend paramters for Actions which we can pass to analyticsDataSend__()
    * Not mandatory to use, but makes reporting more consistent and can be extended with new properties
    */
    myMethods.analyticsActions__ = {
        reportOpen: 'X-Page Viewed',
        filter: 'Applied Filter',
        viewRecord: 'Viewed Record',
        newRecord: 'New Record',
        createRecord: 'Created Record',
        updateRecord: 'Updated Record',
        suggestionAction: 'Suggestion Actioned',
        tableSort: 'Applied Table Sort'
    };

    /**
    * These are the predefiend paramters for Action Detail which we can pass to analyticsDataSend__()
    * Not mandatory to use, but makes reporting more consistent and can be extended with new properties
    */
    myMethods.analyticsActionDetail__ = {
        productFilter: 'Product Filter',
        dateFilter: 'Date Filter',
        resetFilter: 'Reset Filter',
        priorityFilter: 'Suggestion Priority Filter',
        suggestionComplete: 'Marked as Complete',
        suggestionDismiss: 'Dismissed',
        scheduleCall: 'Scheduled Call',
        sendEmail: 'Sent Email',
        suggestionDefault: 'Default Action'
    };

    /**
    * This function creates a new record in MyInsights_Analytics__c object
    * @param {String} reportAction as action, e.g. 'analyticsActions__.smartlink' if we want to capture a smart link usage
    * @param {String} detail as action detail, e.g. 'analyticsActions__.slViewAccount' to capture the smart link type
    */
    myMethods.analyticsDataSend__ = async function (reportAction = '', detail = '') {
        try {

            if(isObjectEmpty(analyticsData__.availableObjects)) {
                analyticsData__.availableObjects = (await getAvailableObjects__()).data;
            }
            
            if(analyticsData__.availableObjects.xpage_analytics__c) {
                analyticsData__.action = reportAction;
                analyticsData__.actionDetail = detail;

                if(analyticsData__.userId === '') {
                    analyticsData__.userId = (await getCurrentUserId__()).user__sys.id;
                }
                if(analyticsData__.htmlId === '') {
                    analyticsData__.htmlId = (await getCurrentHTMLRecordId__()).html_report__v.id;
                }
                if(analyticsData__.relatedAccount === '') {
                    try {
                        analyticsData__.relatedAccount = (await getCurrentAccountId__()).account__v.id;
                    } catch {
                        console.log('No account in context: Related Account will not be populated')
                    }
                }
                
                const ret = await insertRecord__(analyticsData__);
                console.log('analyticsDataSend__ ret: ', ret);
            }
        } catch(err) {
            console.warn('analyticsDataSend__ ERROR:', err)
        }
    }

    function insertRecord__(data) {
        const queryConfig = {
            object: 'xpage_analytics__c',
            fields: { 
                'user__c': data.userId,
                'related_account__c': data.relatedAccount,
                'date__c': formatDate(new Date()),
                'is_online__c': isOnline(),
                'html_report__c': data.htmlId,
                'device__c': navigator?.userAgentData?.platform || navigator?.platform || 'unknown',
                'action__c': data.action,
                'action_detail__c': data.actionDetail
            }
        };
        return ds.createRecord(queryConfig);
    }

    function getCurrentUserId__() {
        return ds.getDataForCurrentObject('user__sys', 'id');
    }

    function getCurrentAccountId__() {
        return ds.getDataForCurrentObject('account__v', 'id');
    }

    function getCurrentHTMLRecordId__() {
        return ds.getDataForCurrentObject('html_report__v', 'id');
    }

    function getAvailableObjects__() {
        return ds.getAvailableObjects();
    }

    function isObjectEmpty(obj) {
        for(const key in obj) {
            if(Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        
        return true;
    }

    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    }

    function isOnline(){
        if(_veevaUtils === null) {
            return false;
        }
        return _veevaUtils.isOnline();
    }

	return myMethods;
})();