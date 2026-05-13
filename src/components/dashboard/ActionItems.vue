<template>
    <div class="card h-100 shadow-sm border-0">
        <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center pb-0">
            <span class="fw-bold">{{ $t('EPD_ACTION_ITEMS') }} ({{ dueSoonActionItems.length }})</span>
            <span class="badge bg-danger rounded-pill"><i class="bi bi-bell-fill me-1"></i>{{ $t('EPD_DUE_IN_30_DAYS') }}</span>
        </div>
        <div class="card-body p-0 mt-2 overflow-auto" style="max-height: 15.625rem;">
            <table class="table table-sm table-striped mb-0" style="font-size: 0.85rem;">
                <thead class="table-light text-muted">
                    <tr>
                        <th class="fw-normal ps-2 border-end">{{ $t('EPD_COL_ACTION_ITEM') }}</th>
                        <th class="fw-normal border-end">{{ $t('EPD_COL_ACCOUNT') }}</th>
                        <th class="fw-normal" :class="{ 'border-end': !isManager }">{{ $t('EPD_COL_DUE_DATE') }}</th>
                        <th class="fw-normal text-center" style="width: 3rem;" v-if="!isManager"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="dueSoonActionItems.length === 0">
                        <td :colspan="isManager ? 3 : 4" class="text-center py-4 text-muted">{{ $t('EPD_NO_ACTION_ITEMS_DUE_SOON') }}</td>
                    </tr>
                    <ActionItemsListItem 
                        v-for="item in dueSoonActionItems" 
                        :key="item.id"
                        :actionItemId="item.id"
                        :actionItemName="item.name"
                        :accountId="item.accountId"
                        :accountName="item.accountName"
                        :dueDate="item.dueDate"
                        :isManager="isManager"
                        @edit="openEditModal(item)"
                    />
                </tbody>
            </table>
        </div>

        <Modal :show="showModal" :title="$t('AM_EDIT_ACTION_ITEM')" :onClose="closeModal" size='lg'>
            <template #modal-content>
                <form>
                    <div class="p-3">
                        <div class="mb-2">
                            <label for="actionItem" class="form-label">{{ $t('AM_COL_ACTION_ITEM') }}</label>
                            <Select label="actionItem" :options="actionItemOptions" v-model="selectedActionItem" :error="showRequiredError && !selectedActionItem" :errorMessage="$t('AM_FIELD_REQUIRED')"/>
                        </div>
                        <div class="mb-2">
                            <label for="dueDate" class="form-label">{{ $t('AM_COL_DUE_DATE') }}</label>
                            <VueDatePicker 
                                v-model="dueDate" 
                                format="MM/dd/yyyy" 
                                :auto-apply="true" 
                                :placeholder="$t('EPD_SELECT_DATE')" 
                                :month-change-on-scroll="false"
                                :enable-time-picker="false"
                                :teleport="true"></VueDatePicker>
                            <div v-if="showRequiredError && !dueDate" class="invalid-feedback d-block">{{ $t('AM_FIELD_REQUIRED') }}</div>
                        </div>
                        <div class="mb-2">
                            <label for="status" class="form-label">{{ $t('AM_COL_STATUS') }}</label>
                            <Select label="status" :options="statusOptions" v-model="selectedStatus"/>
                        </div>
                        <div class="mb-2">
                            <label for="progress" class="form-label">{{ $t('AM_COL_PROGRESS') }}</label>
                            <Select label="progress" :options="progressOptions" v-model="selectedProgress"/>
                        </div>
                    </div>
                </form>
            </template>
            <template #modal-footer>
                <button class="btn btn-md btn-secondary" @click.prevent="closeModal">{{ t('AM_BUTTON_CANCEL') }}</button>
                <button class="btn btn-md btn-success" @click.prevent="handleSave">
                    <span v-show="showLoading == true" class="spinner-border spinner-border-sm me-3" aria-hidden="true"></span>
                    <span role="status">{{ t('AM_BUTTON_SAVE') }}</span>
                </button>
            </template>
        </Modal>
    </div>
</template>

<script setup>
//TODO: come apply veeva messages
    import Modal from '@/components/common/BaseModal';
    import Select from '@/components/common/BaseSelect';
    import { computed, ref } from 'vue';
    import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import { updateRecord } from '@/lib/myInsights/query';
    import { safe, isOnline } from '@/lib/helper/commonUtils';
    import ActionItemsListItem from '@/components/dashboard/ActionItemsListItem.vue';
    import Moment from 'moment';
    import { useI18n } from "vue-i18n";
    import { SYSTEM_DATE_FORMAT, DISPLAY_DATE_FORMAT, NO_DATA, NOT_STARTED_STATUS, PENDING_STATUS, COMPLETED_STATUS } from '@/lib/helper/constants';

    //store getters
    const store = useAppStore();
    const { t } = useI18n();
    const { dashboardActionItems, statusMap, progressMap, rawActionItems, actionItemList, actionItemOptionMap, actionItemMap, isManager } = storeToRefs(store);
    const { setNotification, refreshDashboardActionItems } = store;

    //local props
    const showModal = ref(false);
    const showLoading = ref(false);
    const showRequiredError = ref(false);
    const selectedActionItem = ref('');
    const dueDate = ref(null);
    const selectedStatus = ref('');
    const selectedProgress = ref('');
    const recordId = ref(null);
    const parentRecordId = ref(null);

    const dueSoonActionItems = computed(() => {
        const thirtyDaysFromNow = Moment().add(30, 'days').endOf('day');

        return dashboardActionItems.value.filter(item => {
            if (!item.dueDate) return false;
            const dueDate = Moment(item.dueDate);
            return dueDate.isValid() && dueDate.isSameOrBefore(thirtyDaysFromNow, 'day');
        });
    });


    const actionItemOptions = computed(() => {
        let options = [];
        console.log("ACTION ITEM OPTIONS:")
        console.log(actionItemOptionMap.value)
        console.log(actionItemMap);
        if(actionItemOptionMap.value) {
            actionItemOptionMap.value.forEach((value, key) => {
                options.push({ id: key, name: value });
            });
            if(options && options.length > 0) {
                options = options.sort((a, b) => a.name.localeCompare(b.name));
            }
        }
        return options;
    });

    const statusOptions = computed(() => {
        let options = [];
        if(statusMap.value) {
            statusMap.value.forEach((value, key) => {
                options.push({ id: key, name: value });
            });
        }
        return options;
    });

    const progressOptions = computed(() => {
        let options = [];
        if(progressMap.value) {
            progressMap.value.forEach((value, key) => {
                options.push({ id: key, name: value });
            });
        }
        return options;
    });

    const getKeyByValue = (map, targetValue) => {
        if(targetValue) {
            for (const [key, value] of map) {
                if (value === targetValue) {
                    return key;
                }
            }
        }
        return '';
    };

    const openEditModal = (item) => {
        recordId.value = item.id;
        // parentRecordId.value = item.accountTacticId;

        if (rawActionItems.value && rawActionItems.value.length > 0) {
            const rawAi = rawActionItems.value.find(ai => ai.id === item.id);
            if (rawAi) {
                selectedStatus.value = rawAi.action_item_status__v || '';
                selectedProgress.value = rawAi.pac_progress__c || '';
                dueDate.value = rawAi.due_date__v ? Moment(rawAi.due_date__v).format(SYSTEM_DATE_FORMAT) : null;
                parentRecordId.value = rawAi.account_tactic__v;
                selectedActionItem.value = rawAi.pac_action_item__c || getKeyByValue(actionItemOptionMap.value, item.name) || item.name;
            }
        }

        showModal.value = true;
    };

    const closeModal = () => {
        showModal.value = false;
        showLoading.value = false;
        showRequiredError.value = false;
        selectedActionItem.value = '';
        dueDate.value = null;
        selectedStatus.value = '';
        selectedProgress.value = '';
        recordId.value = null;
    };


/*
		showRequiredError.value = false;
		if(selectedAction.value) {
			let configObject = {
			    object: "",
			    fields: {}
			};
			let actionItemsToUpdate = [], mode = '';
------------------
				case actionType.EDIT_ACTION_ITEM:
					if(!safe(selectedActionItem.value) || !safe(dueDate.value)) {
						showRequiredError.value = true
					} else {
						showRequiredError.value = false;
						showLoading.value = true;
						// prepare query config for action item
						configObject.object = 'action_item__v';
						configObject.fields = {
							name__v: actionItemOptionMap.value.get(selectedActionItem.value),
							pac_action_item__c: selectedActionItem.value,
							account_tactic__v: parentRecordId.value,
							account_plan__v: accountPlan.value.id,
							pac_progress__c: selectedProgress.value,
							due_date__v: (dueDate.value != null) ? Moment(dueDate.value).format(SYSTEM_DATE_FORMAT) : null,
							completed_date__v: (selectedStatus.value && selectedStatus.value === COMPLETED_STATUS) ? Moment().format(SYSTEM_DATE_FORMAT) : null,
							action_item_status__v: selectedStatus.value
						};
					}
					break;
------------------
			if(showRequiredError.value === false) {
				let dmlError = false;
				if(recordId.value !== null) {
					updateRecord(configObject.object, recordId.value, configObject.fields)
			        .then(resp => {
			        	console.log('Update ', configObject.object, ': ',  resp);
						if((!isOnline() && resp.success) || (isOnline() && resp.id)) {
			        		// refresh data
			        		refreshData();
				        } else if(resp && resp.success === false) {
				        	showNotification('error', resp.message);
				        }
			        });
				} else {
					createRecord(configObject)
			        .then(resp => {
			            console.log('Create ', configObject, ': ',  resp);
			            if((!isOnline() && resp.success) || (isOnline() && resp.id)) {
			        		// refresh data
			        		refreshData();
				        } else if(resp && resp.success === false) {
				        	showNotification('error', resp.message);
				        }
			        });
				}
			}
*/

    const handleSave = async () => {
        showRequiredError.value = false;
        let configObject = {
            object: "",
            fields: {}
        };
        if (!safe(selectedActionItem.value) || !safe(dueDate.value)) {
            showRequiredError.value = true;
        } else {
            showRequiredError.value = false;
            showLoading.value = true;
            // prepare query config for action item
            configObject.object = 'action_item__v';
            configObject.fields = {
                name__v: actionItemOptionMap.value.get(selectedActionItem.value),
                pac_action_item__c: selectedActionItem.value,
                pac_progress__c: selectedProgress.value,
                due_date__v: (dueDate.value != null) ? Moment(dueDate.value).format(SYSTEM_DATE_FORMAT) : null,
                completed_date__v: (selectedStatus.value && selectedStatus.value === COMPLETED_STATUS) ? Moment().format(SYSTEM_DATE_FORMAT) : null,
                action_item_status__v: selectedStatus.value
            };
        }

        if(showRequiredError.value === false) {
            if(recordId.value !== null) {
                updateRecord(configObject.object, recordId.value, configObject.fields)
                .then(async resp => {
                    console.log('Update ', configObject.object, ': ',  resp);
                    if((!isOnline() && resp.success) || (isOnline() && resp.id)) {
                        // Manually patch rawActionItems to keep EngagementPlanView in sync
                        const rawAi = rawActionItems.value.find(ai => ai.id === recordId.value);
                        if (rawAi) Object.assign(rawAi, configObject.fields);
                        
                        // Manually patch actionItemList to keep EngagementPlanProgress in sync
                        const ai = actionItemList.value.find(ai => ai.id === recordId.value);
                        if (ai) {
                            ai.name = configObject.fields.name__v;
                            ai.actionItem = configObject.fields.pac_action_item__c;
                            ai.statusApi = configObject.fields.action_item_status__v;
                            ai.status = statusMap.value.has(ai.statusApi) ? statusMap.value.get(ai.statusApi) : NO_DATA;
                            ai.dueDateSystem = configObject.fields.due_date__v;
                            ai.dueDate = configObject.fields.due_date__v ? Moment(configObject.fields.due_date__v).format(DISPLAY_DATE_FORMAT) : NO_DATA;
                            ai.completedDate = configObject.fields.completed_date__v ? Moment(configObject.fields.completed_date__v).format(DISPLAY_DATE_FORMAT) : NO_DATA;
                            ai.progress = configObject.fields.pac_progress__c;
                        }
                        
                        await refreshDashboardActionItems();
                        const message = t('AM_UPDATE_SUCCESS_MSG');
                        closeModal();
                        showNotification('success', message);
                    } else if(resp && resp.success === false) {
                        showNotification('error', resp.message);
                    }
                });
            } else {
                // Creation is not possible from this dashboard widget
            }
        }
    };

    // handles display of success/error message
	const showNotification = (variant, message) => {
		setNotification({
        	show: true,
        	variant: variant,
        	message: message
        });
        // hide notification automatically
        setTimeout(() => {
        	hideNotification()
        }, 6000);
	};

	// handles removal of success message
	const hideNotification = () => {
		setNotification({ 
            show: false,
            variant: '',
            message: '' 
        });
	};
</script>

<style scoped>
	.no-border-radius {
		border-top-right-radius: 0 !important;
  		border-bottom-right-radius: 0 !important;
  		border-top-left-radius: 0 !important;
  		border-bottom-left-radius: 0 !important;
	}
	.nav-pills .nav-link.active, .nav-pills .show>.nav-link {
    	background-color: #2e5daa;
    }

	.action-item-button {
		padding: 0rem 0rem 0rem 3rem
	}
	.accordion-button::after {
		order: -1;
		margin-left: 0;
		margin-right: 0.75rem;
	}
	.box-highlight {
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
	}

	thead th {
		position: sticky;
		top: 0;
		z-index: 1;
		background-color: #f8f9fa; /* Ensure solid background so rows don't show through */
		box-shadow: 0 2px 0 0 #dee2e6; /* Matches the vertical border color for a seamless look */
		border-bottom: none !important; /* Removes native table border */
		border-right-color: #dee2e6 !important; /* Fixes Bootstrap .table-light border-end color */
    }
</style>