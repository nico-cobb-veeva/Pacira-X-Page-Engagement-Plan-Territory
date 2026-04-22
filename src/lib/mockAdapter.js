import * as mockResponse from './mockResponse';
/* eslint no-unused-vars: ["error", { "args": "none" }] */
export const mockAdapter = {
    getDataForCurrentObject(object, field) {
        return Promise.resolve(mockResponse.getDataForCurrentObject[object]);
    },
    getObjectTypes(object) {
        return Promise.resolve(mockResponse.getObjectTypes[object]);
    },
    getPicklistValueLabels(object, field) {
        return Promise.resolve(mockResponse.getPicklistValueLabels);
    },
    viewRecord(queryConfig) {
        return Promise.resolve('success');
    },
    newRecord(queryConfig) {
        return Promise.resolve('success');
    },
    runQuery(queryConfig) {
        return Promise.resolve(mockResponse.runQuery[queryConfig.object]);
    },
    queryRecord(queryConfig) {
        return Promise.resolve(mockResponse.queryRecord[queryConfig.object]);
    },
    getAvailableObjects() {
        return Promise.resolve(mockResponse.getAvailableObjects());
    },
    getObjectMetadata(queryConfig) {
        return Promise.resolve(mockResponse.getObjectMetadata[queryConfig.object]);
    },
    executeSuggestionAction(queryConfig) {
        return Promise.resolve({ 'success': true });
    },
    createRecord(queryConfig) {
        return Promise.resolve({success: true, messageId: 2,data: { id: 'created-new-Record-fakeid' + new Date().toJSON()}});
    },
};