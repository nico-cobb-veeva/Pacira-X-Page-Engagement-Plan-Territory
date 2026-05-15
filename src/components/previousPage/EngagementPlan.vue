<template>
	<div class="card">
        <div class="card-header p-0">
        	<nav class="nav nav-pills nav-fill">
			  	<a class="nav-link no-border-radius	" href="javascript:void(0)" :class="{'active': selectedTab === 'engagementPlan'}"><span @click.prevent="handleToggle('engagementPlan')">{{ $t('AM_ENGAGEMENT_PLAN') }}</span></a>
				<a class="nav-link no-border-radius" href="javascript:void(0)" :class="{'active': selectedTab === 'keyStakeholder'}"><span @click.prevent="handleToggle('keyStakeholder')">{{ $t('AM_KEY_STAKEHOLDERS') }}</span></a>
			</nav>
        </div>
        <div class="card-body p-0">
        	<div v-if="selectedTab === 'engagementPlan'" class="p-2">
	        	<div class="d-flex align-items-end">
				  	<div class="px-1 flex-grow-1">
				  		<div class="card px-3 py-2 box-highlight">
				  			<div class="d-flex">
				  				<h6 class="flex-grow-1" style="margin-bottom: 0.3rem;">{{ accountPlan.name }}</h6>
				  				<h6 style="margin-bottom: 0.25rem;">(<strong>{{ progress.completed }}</strong>/<strong>{{ progress.total }}</strong> items)</h6>
				  			</div>
					  		<div class="progress" role="progressbar" :aria-valuenow="progress.pct" aria-valuemin="0" aria-valuemax="100">
							  	<div class="progress-bar bg-success" :style="'width: ' + progress.pct + '%'">{{ progress.pct }}%</div>
							</div>
						</div>
				  	</div>
				  	<div v-if="planTactics?.length > 1 && currTerritoryType.type == TEAM_EXPAREL" class="px-2">
				  		<Select :label="$t('AM_SERVICE_LINE')" :showLabel="true" :options="planTactics" v-model="selectedPlanTactics"/>
				  	</div>
				</div>
				<div class="d-flex align-items-center mt-3 mb-1 p-2 border-bottom border-primary">
					<div class="flex-grow-1 fs-6 fw-bold">
						{{ $t('AM_OBJECTIVES') }} ({{ accountTacticList.length }})
					</div>
					<div class="px-2">
						<Select label="status" :options="objectiveStatusOptions" v-model="selObjectiveStatus"/>
					</div>
					<div>
						<button type="button" class="btn btn-outline-primary btn-sm" @click.prevent="openModal(actionType.NEW_ACCOUNT_TACTIC, item)">{{$t('AM_NEW_OBJECTIVE')}}</button>
					</div>
				</div>
				<div v-if="accountTacticList && accountTacticList.length > 0" class="accordion px-1 my-2 overflow-auto" id="accountTactics" style="height: 287px;">
				  	<div v-for="(item, index) of accountTacticList" class="accordion-item" :key="item.id">
					    <div class="accordion-header">
					    	<div class="btn-icon d-flex justify-content-end align-items-center">
								<div class="btn-group" role="group">
								  	<button type="button" class="btn btn-outline-secondary btn-sm" @click.prevent="openModal(actionType.EDIT_ACCOUNT_TACTIC, item)">{{ $t('AM_BUTTON_EDIT') }}</button>
								  	<button type="button" class="btn btn-outline-secondary btn-sm" @click.prevent="openModal(actionType.DELETE_ACCOUNT_TACTIC, item)">{{ $t('AM_BUTTON_DELETE') }}</button>
								  	<button type="button" class="btn btn-outline-secondary btn-sm" @click.prevent="openModal(actionType.NEW_ACTION_ITEM, item)">{{ $t('AM_NEW_ACTION_ITEM') }}</button>
								</div>
					    	</div>
					      	<button class="accordion-button" :class="{'collapsed': expandRowIndex !== index}" type="button" data-bs-toggle="collapse" :data-bs-target="'#'+item.id" aria-expanded="expandRowIndex === index" :aria-controls="item.id">
					      		<span class="fw-medium">{{ item.name }}</span>
					      			<span class="ms-2">
					      				<i v-if="item.statusApi === COMPLETED_STATUS" class="fas fa-circle-check text-success fa-lg fa-fw"/>
					      				<span v-if="item.statusApi === PENDING_STATUS" class="badge rounded-pill text-bg-secondary">{{ $t('AM_IN_PROGRESS') }}</span>
										<span v-if="accountTacticListUpcomingDue[item.id]" class="text-danger ms-2">Upcoming Due Date: {{ accountTacticListUpcomingDue[item.id] }}</span>
					      			</span>
					      	</button>
					    </div>
					    <div :id="item.id" class="accordion-collapse collapse" :class="{'show': expandRowIndex === index}" data-bs-parent="#accountTactics">
					      	<div class="accordion-body p-0">
					        	<DataTable
				                    v-if="item.actionItems.length > 0"
				                    :columns="columns"
				                    :rows="item.actionItems"
				                    :defaultSortColumnKey="'dueDate'"
				                    :defaultSortColumnDirection="1" 
				   				/>
				                <div v-else class="row px-4 my-3">
				                    {{ $t('AM_NO_RECORDS') }}
				                </div>
					      	</div>
					    </div>
					</div>
				</div>
				<div v-else class="row m-3" style="height: 287px;">
                    {{ $t('AM_NO_RECORDS') }}
                </div>
			</div>
			<div v-else>
				<div class="d-flex justify-content-end py-2 px-2">
					<button type="button" class="btn btn-outline-primary btn-sm" @click.prevent="openModal(actionType.NEW_KEY_STAKEHOLDER, null)">{{ $t('AM_NEW_KEY_STAKEHOLDER') }}</button>
				</div>
				<div class="border-top" style="height: 330px;">
					<DataTable
	                    v-if="currTerritoryType.type == TEAM_OMFS && ksList.length > 0"
	                    :columns="ksColumnsOMFS"
	                    :rows="ksList"
	                    :defaultSortColumnKey="'name'"
	                    :defaultSortColumnDirection="1"
	                    :striped="true"
	   				/>
					<DataTable
	                    v-else-if="(currTerritoryType.type == TEAM_ZILRETTA) && ksList.length > 0"
	                    :columns="ksColumnsZilretta"
	                    :rows="ksList"
	                    :defaultSortColumnKey="'name'"
	                    :defaultSortColumnDirection="1" 
	                    :striped="true"
	   				/>
					<DataTable
	                    v-else-if="ksList.length > 0"
	                    :columns="ksColumns"
	                    :rows="ksList"
	                    :defaultSortColumnKey="'name'"
	                    :defaultSortColumnDirection="1" 
	                    :striped="true"
	   				/>
	   				<div v-else class="row m-3">
	                    {{ $t('AM_NO_RECORDS') }}
	                </div>
	   			</div>
			</div>
	    	<Modal :show="showModal" :title=modalTitle :onClose="closeModal" size='lg'>
	    		<template #modal-content>
	    			<form>
	    				<div v-if="selectedAction === actionType.NEW_ACCOUNT_TACTIC || selectedAction === actionType.EDIT_ACCOUNT_TACTIC" class="p-4">
							<div class="mb-3">
	                            <label for="objective" class="form-label">{{ $t('AM_OBJECTIVE') }}<span class="text-danger">*</span></label>
	                            <Select label="objective" :options="objectiveOptions" v-model="selectedObjective" :error="showRequiredError && !selectedObjective" :errorMessage="$t('AM_FIELD_REQUIRED')"/>
	                        </div>
	                        <div class="mb-3">
	                            <label for="status" class="form-label">{{ $t('AM_COL_STATUS') }}</label>
	                            <Select label="status" :options="statusOptions" v-model="selectedStatus"/>
	                        </div>
						</div>
		    			<div v-else-if="selectedAction === actionType.NEW_ACTION_ITEM" class="p-4">
							<div class="mb-3">
	                            <label for="objective" class="form-label">{{ $t('AM_OBJECTIVE') }}</label>
	                            <Select label="objective" :options="accountTacticList" v-model="selectedObjective" :error="showRequiredError && !selectedObjective" :errorMessage="$t('AM_FIELD_REQUIRED')" :disabled="true"/>
	                        </div>
	                        <div class="mb-3">
	                            <label for="actionItem" class="form-label">{{ $t('AM_COL_ACTION_ITEM') }}<span class="text-danger">*</span></label>
	                            <Select label="actionItem" :options="actionItemOptions" v-model="selectedActionItem" :error="showRequiredError && !selectedActionItem" :errorMessage="$t('AM_FIELD_REQUIRED')"/>
	                        </div>
	                        <div class="mb-3">
	                            <label for="status" class="form-label">{{ $t('AM_COL_DUE_DATE') }}<span class="text-danger">*</span></label>
	                            <VueDatePicker 
	                            	v-model="dueDate" 
	                            	format="MM/dd/yyyy" 
	                            	:auto-apply="true" 
	                            	placeholder="Select date" 
	                            	:month-change-on-scroll="false"
	                            	:enable-time-picker="false"
	                            	:teleport="true"></VueDatePicker>
	                            <div v-if="showRequiredError && !dueDate" class="invalid-feedback d-block">{{ $t('AM_FIELD_REQUIRED') }}</div>
	                        </div>
	                        <div class="mb-3">
	                            <label for="status" class="form-label">{{ $t('AM_COL_STATUS') }}</label>
	                            <Select label="status" :options="statusOptions" v-model="selectedStatus"/>
	                        </div>
	                        <div class="mb-3">
	                            <label for="progress" class="form-label">{{ $t('AM_COL_PROGRESS') }}</label>
	                            <Select label="progress" :options="progressOptions" v-model="selectedProgress"/>
	                        </div>
						</div>
						<div v-else-if="selectedAction === actionType.EDIT_ACTION_ITEM" class="p-4">
							<div class="mb-3">
	                            <label for="actionItem" class="form-label">{{ $t('AM_COL_ACTION_ITEM') }}</label>
	                            <Select label="actionItem" :options="actionItemOptions" v-model="selectedActionItem" :error="showRequiredError && !selectedActionItem" :errorMessage="$t('AM_FIELD_REQUIRED')"/>
	                        </div>
	                        <div class="mb-3">
	                            <label for="status" class="form-label">{{ $t('AM_COL_DUE_DATE') }}</label>
	                            <VueDatePicker 
	                            	v-model="dueDate" 
	                            	format="MM/dd/yyyy" 
	                            	:auto-apply="true" 
	                            	placeholder="Select date" 
	                            	:month-change-on-scroll="false"
	                            	:enable-time-picker="false"
	                            	:teleport="true"></VueDatePicker>
	                            <div v-if="showRequiredError && !dueDate" class="invalid-feedback d-block">{{ $t('AM_FIELD_REQUIRED') }}</div>
	                        </div>
	                        <div class="mb-3">
	                            <label for="status" class="form-label">{{ $t('AM_COL_STATUS') }}</label>
	                            <Select label="status" :options="statusOptions" v-model="selectedStatus"/>
	                        </div>
	                        <div class="mb-3">
	                            <label for="progress" class="form-label">{{ $t('AM_COL_PROGRESS') }}</label>
	                            <Select label="progress" :options="progressOptions" v-model="selectedProgress"/>
	                        </div>
						</div>
						<div 
							v-else-if="selectedAction === actionType.DELETE_ACCOUNT_TACTIC || selectedAction === actionType.DELETE_ACTION_ITEM || selectedAction === actionType.DELETE_KEY_STAKEHOLDER" 
							class="p-4">
							<p>{{ $t('AM_DELETE_PROMPT') }}</p>
						</div>
						<div v-else-if="selectedAction === actionType.NEW_KEY_STAKEHOLDER || selectedAction === actionType.EDIT_KEY_STAKEHOLDER" class="p-4">
							<div class="mb-3">
								<label for="status" class="form-label">{{ $t('AM_CHILD_ACCOUNT') }}</label>
								<VueSelect v-model="selectedHcp" :options="avblChildHcps" placeholder="Select an account"/>
								<div v-if="showRequiredError && !selectedHcp" class="invalid-feedback d-block">{{ $t('AM_FIELD_REQUIRED') }}</div>
							</div>
							<div class="mb-5">
	                            <label for="ksRole" class="form-label">{{ $t('AM_COL_ROLE') }}</label>
	                            <Select label="ksRole" :options="ksRoleOptions" v-model="selectedRole"/>
	                        </div>
						</div>
					</form>
	    		</template>
	    		<template #modal-footer>
	    			<button class="btn btn-md btn-secondary"
	                    @click="closeModal">{{ t('AM_BUTTON_CANCEL') }}
	                </button>
	                <button class="btn btn-md btn-success" @click.prevent="handleSave">
	                    <span v-show="showLoading == true" class="spinner-border spinner-border-sm me-3" aria-hidden="true"></span>
	                    <span v-if="selectedAction === actionType.DELETE_ACCOUNT_TACTIC || selectedAction === actionType.DELETE_ACTION_ITEM || selectedAction === actionType.DELETE_KEY_STAKEHOLDER" role="status">{{ t('AM_BUTTON_OK') }}</span>
	                    <span v-else role="status">{{ t('AM_BUTTON_SAVE') }}</span>
	                </button>
	    		</template>
	    	</Modal>
	    </div>
    </div>
</template>

<script setup>
	// @ is an alias to /src
    import Select from '@/components/common/BaseSelect';
    import Modal from '@/components/common/BaseModal';
    import DataTable from '@/components/common/BaseDataTable';
	import { computed, ref, onMounted, h } from 'vue';
    import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import { useI18n } from "vue-i18n";
    import { faEdit, faTrash, faHandshake, faEnvelope, faCircle } from '@fortawesome/free-solid-svg-icons';
    import { createRecord, updateRecord, getActionItems, getAccountTactics, newRecord, getAccountTacticByMobileId } from '@/lib/myInsights/query';
    import { getKeyStakeholderInfo } from '@/lib/myInsights/index';
    import { NO_DATA, DISPLAY_DATE_FORMAT, SYSTEM_DATE_FORMAT, NOT_STARTED_STATUS, PENDING_STATUS, COMPLETED_STATUS, TEAM_OMFS, TEAM_EXPAREL, TEAM_ZILRETTA} from '@/lib/helper/constants';
    import { capitalizeWords, safe } from '@/lib/helper/commonUtils';
    import VueSelect from "vue3-select-component";
    import Moment from 'moment';

    // i18n ref
    const { t } = useI18n(); 
    const defaultTab = t('AM_DEFAULT_TAB'); 

    /** store getters */
    const { currUser,currTerritoryType, accountPlan, planTactics, accountTactics, actionItems, accountTacticOptionMap, actionItemOptionMap, statusOptionMap,
    		keyStakeholders, accountSpecialtyMap, accountPriorityMap, ksRoleMap, childHcps, progressOptionMap } = storeToRefs(useAppStore());
    const { setSuggestions, setAccountTactics, setActionItems, setKeyStakeholders, setNotification } = useAppStore();

    // local props
	const selectedTab = ref(defaultTab);
	const selectedPlanTactics = ref('');
	const showModal = ref(false);
	const showLoading = ref(false);
	const selectedAction = ref('');
	const selectedObjective = ref('');
	const selectedStatus = ref('');
	const selectedActionItem = ref('');
	const recordId = ref(null);
	const parentRecordId = ref(null);
	const modalTitle = ref('');
	const dueDate = ref();
	const selectedHcp = ref('');
	const selectedRole = ref('');
	const selectedProgress = ref('');
	const showRequiredError = ref(false);
	const selObjectiveStatus = ref(PENDING_STATUS);

	// columns for the attendee selection list view
    const columns = [
        { key: 'name', label: t('AM_COL_ACTION_ITEM'), isSortable: true, width: '44%' },
        { key: 'status', label: t('AM_COL_STATUS'), isSortable: true, width: '14%' },
        { key: 'dueDate', label: t('AM_COL_DUE_DATE'), isSortable: true, width: '14%' },
        { key: 'completedDate', label: t('AM_COL_COMPLETED_DATE'), isSortable: true, width: '14%' },
        { key: 'progress', label: t('AM_COL_PROGRESS'), isSortable: true, width: '8%' },
        { key: 'action', label: t('AM_COL_ACTIONS'), isSortable: false, width: '6%' }
    ];
    // columns for the key stakeholder list view
    const ksColumns = [
        { key: 'name', label: t('AM_COL_NAME'), isSortable: true, width: '13%' },
        { key: 'role', label: t('AM_COL_ROLE'), isSortable: true, width: '13%' },
        { key: 'specialty', label: t('AM_COL_SPECIALTY'), isSortable: true, width: '14%' },
		{ key: 'email', label: t('AM_COL_EMAIL'), isSortable: true, width: '9%' },
        { key: 'exparelPriority', label: t('AM_COL_EXPAREL_PRIORITY'), isSortable: true, width: '10%' },
        { key: 'city', label: t('AM_COL_CITY'), isSortable: true, width: '8%' },
        { key: 'state', label: t('AM_COL_STATE'), isSortable: true, width: '8%' },
        { key: 'lastCallDate', label: t('AM_COL_LAST_CALL_DATE'), isSortable: true, width: '9%' },
        { key: 'lastEmailDate', label: t('AM_COL_LAST_EMAIL_DATE'), isSortable: true, width: '10%' },
        { key: 'action', label: t('AM_COL_ACTIONS'), isSortable: false, width: '6%' }
    ];
	const ksColumnsZilretta = [
        { key: 'name', label: t('AM_COL_NAME'), isSortable: true, width: '13%' },
        { key: 'role', label: t('AM_COL_ROLE'), isSortable: true, width: '13%' },
        { key: 'specialty', label: t('AM_COL_SPECIALTY'), isSortable: true, width: '14%' },
		{ key: 'email', label: t('AM_COL_EMAIL'), isSortable: true, width: '9%' },
        { key: 'zilrettaPriority', label: t('AM_COL_ZILRETTA_PRIORITY'), isSortable: true, width: '10%' },
        { key: 'city', label: t('AM_COL_CITY'), isSortable: true, width: '8%' },
        { key: 'state', label: t('AM_COL_STATE'), isSortable: true, width: '8%' },
        { key: 'lastCallDate', label: t('AM_COL_LAST_CALL_DATE'), isSortable: true, width: '9%' },
        { key: 'lastEmailDate', label: t('AM_COL_LAST_EMAIL_DATE'), isSortable: true, width: '10%' },
        { key: 'action', label: t('AM_COL_ACTIONS'), isSortable: false, width: '6%' }
	];
	const ksColumnsOMFS = [
        { key: 'name', label: t('AM_COL_NAME'), isSortable: true, width: '16%' },
        { key: 'role', label: t('AM_COL_ROLE'), isSortable: true, width: '16%' },
        { key: 'email', label: t('AM_COL_EMAIL'), isSortable: true, width: '10%' },
        { key: 'exparelPriority', label: t('AM_COL_EXPAREL_PRIORITY'), isSortable: true, width: '12%' },
        { key: 'city', label: t('AM_COL_CITY'), isSortable: true, width: '8%' },
        { key: 'state', label: t('AM_COL_STATE'), isSortable: true, width: '8%' },
        { key: 'lastCallDate', label: t('AM_COL_LAST_CALL_DATE'), isSortable: true, width: '12%' },
        { key: 'lastEmailDate', label: t('AM_COL_LAST_EMAIL_DATE'), isSortable: true, width: '12%' },
        { key: 'action', label: t('AM_COL_ACTIONS'), isSortable: false, width: '6%' }
	]

    // various user actions
    const actionType = {
    	NEW_ACCOUNT_TACTIC: 'newAccountTactic',
    	EDIT_ACCOUNT_TACTIC: 'editAccountTactic',
    	DELETE_ACCOUNT_TACTIC: 'deleteAccountTactic',
    	NEW_ACTION_ITEM: 'newActionItem',
    	EDIT_ACTION_ITEM: 'editActionItem',
    	DELETE_ACTION_ITEM: 'deleteActionItem',
    	NEW_KEY_STAKEHOLDER: 'newKeyStakeholder',
    	EDIT_KEY_STAKEHOLDER: 'editKeyStakeholder',
    	DELETE_KEY_STAKEHOLDER: 'deleteKeyStakeholder',
    	NEW_CALL: 'newCall',
    	NEW_EMAIL: 'newEmail'
    }

	onMounted(() => {
		// set the default selection for plan tactics i.e. facility-level
		if(planTactics.value && planTactics.value.length) {
			let hasFacilityLevel = false;
			planTactics.value.forEach(pt => {
				if(pt.name === 'Facility Level') {
					selectedPlanTactics.value = pt.id;
					hasFacilityLevel = true;
				}
			});
			// if no Facility Level Plan Tactic then default it to 1
			if(safe(planTactics.value) && !hasFacilityLevel) {
				selectedPlanTactics.value = planTactics.value[0].id;
			}
		}
	});

	/** computed properties */
	// computes the progress percentage for a given service line
	const progress = computed(() => {
		let retObj = { pct: 0, total: 0, completed: 0 };

		if(accountTactics.value && accountTactics.value.length > 0) {
			const tempList = accountTactics.value.filter(at => at.planTacticId === selectedPlanTactics.value);
			if(tempList && tempList.length > 0) {
				tempList.forEach(item => {
					if(actionItems.value && actionItems.value.length > 0) {
						actionItems.value.filter(ai => ai.accountTacticId === item.id).forEach(a => {
							retObj.total++;
							if(a.statusApi === COMPLETED_STATUS) {
								retObj.completed += 1;
							}
						});
					}
				});
				if(retObj.completed > 0) {
					retObj.pct = Math.round(retObj.completed * 100/retObj.total);
				}
			}
		}
		return retObj;
	});

	// prepares account tactic list and associated action items
	const accountTacticList = computed(() => {
		let retList = [];
		if(accountTactics.value && accountTactics.value.length > 0) {
			// filter the account tactics for the selected plan tactic
			let tempList = [];
			if(selObjectiveStatus.value && selObjectiveStatus.value === PENDING_STATUS) {
				tempList = accountTactics.value.filter(at => at.planTacticId === selectedPlanTactics.value 
															&& (at.statusApi === PENDING_STATUS || at.statusApi === NOT_STARTED_STATUS));
			} else if(selObjectiveStatus.value && selObjectiveStatus.value === COMPLETED_STATUS) {
				tempList = accountTactics.value.filter(at => at.planTacticId === selectedPlanTactics.value && at.statusApi === COMPLETED_STATUS);
			} else {
				tempList = accountTactics.value.filter(at => at.planTacticId === selectedPlanTactics.value);
			}
			retList = tempList.map(item => {
				// prepare the action items for a given account tactic
				let tempActionItems = [];
				if(actionItems.value && actionItems.value.length > 0) {
                    actionItems.value.filter(ai => ai.accountTacticId === item.id).forEach(item => {
                    	let progressColor = '#dddbda';
                    	if(item.progress !== '') {
                    		if(item.progress === 'green__c') {
                    			progressColor = '#34A853';
                    		} else if(item.progress === 'yellow__c') {
                    			progressColor = '#FBBC05';
                    		} else if(item.progress === 'red__c') {
                    			progressColor = '#EA4335';
                    		}
                    	}
                        tempActionItems.push({
                            id: {
                                display: item.id,
                                value: item.id
                            },
                            name: {
                                display: item.name,
                                value: item.name
                            },
                            status: {
                                display: item.status,
                                value: item.statusApi
                            },
                            dueDate: {
                                display: item.dueDate,
                                value: item.dueDateSystem
                            },
                            completedDate: {
                                display: item.completedDate,
                                value: item.completedDate
                            },
                            progress: {
                                display: '',
                                value: item.progress,
                                iconsEnd: [{
		                            icon: faCircle,
		                            size: 'lg',
		                            color: progressColor
		                        }]
                            },
                            action: {
		                        display: '',
		                        value: '',
		                        iconsEnd: [{
		                            icon: faEdit,
		                            color: 'rgb(108, 117, 125)',
		                            iconCallback: () => openModal(actionType.EDIT_ACTION_ITEM, item)
		                        }, {
		                            icon: faTrash,
		                            color: 'rgb(108, 117, 125)',
		                            iconCallback: () => openModal(actionType.DELETE_ACTION_ITEM, item)
		                        }]
		                    }
                        });
                    });
				}

				return {
					id: item.id,
                    name: item.name,
                    objective: item.objective,
                    planTacticId: item.planTacticId,
                    statusApi: item.statusApi,
                    actionItems: tempActionItems
				};
			});
		}
		return retList;
	});

	const accountTacticListUpcomingDue = computed(() => {
		let upcomingDatesMap = {};
		if (accountTacticList.value && accountTacticList.value.length > 0) {
			for (let i = 0; i < accountTacticList.value.length; i++) {
				let tactic = accountTacticList.value[i];
				let nearestDate = null;
				let nearestMoment = null;
				if (tactic.actionItems && tactic.actionItems.length > 0) {
					for (let j = 0; j < tactic.actionItems.length; j++) {
						let actionItem = tactic.actionItems[j];
						if (actionItem.status.value === COMPLETED_STATUS) continue;
						let dueDateValue = actionItem.dueDate.value;
						if (dueDateValue && dueDateValue !== '') {
							let dueDateMoment = Moment(dueDateValue, SYSTEM_DATE_FORMAT);
							let diffDays = dueDateMoment.diff(Moment().startOf('day'), 'days');
							if (diffDays >= 0 && diffDays <= 7) {
								if (!nearestMoment || dueDateMoment.isBefore(nearestMoment)) {
									nearestMoment = dueDateMoment;
									nearestDate = actionItem.dueDate.display;
								}
							}
						}
					}
				}
				if (nearestDate) {
					upcomingDatesMap[tactic.id] = nearestDate;
				}
			}
		}
		return upcomingDatesMap;
	});

	// options for account tactic i.e. objective dropdown
    const objectiveOptions = computed(() => {
    	let options = [];
    	if(accountTacticOptionMap.value) {
    		accountTacticOptionMap.value.forEach((value, key) => {
  				options.push({ id: key, name: value });
			});
			// sort by name ascending
			if(options && options.length > 0) {
				options = options.sort((a, b) => a.name.localeCompare(b.name));
			}
    	}
    	return options;
    });

    // options for objective status dropdown
    const objectiveStatusOptions = computed(() => {
    	let options = [{ id: '#', name: 'Status (All)' }];
    	if(statusOptionMap.value) {
    		statusOptionMap.value.forEach((value, key) => {
    			if(key === PENDING_STATUS || key === COMPLETED_STATUS) {
  					options.push({ id: key, name: value });
  				}
			});
    	}
    	return options;
    });

    // options for status dropdown
    const statusOptions = computed(() => {
    	let options = [];
    	if(statusOptionMap.value) {
    		statusOptionMap.value.forEach((value, key) => {
  				options.push({ id: key, name: value });
			});
    	}
    	return options;
    });

    // options for action item dropdown
    const actionItemOptions = computed(() => {
    	let options = [];
    	if(actionItemOptionMap.value) {
    		actionItemOptionMap.value.forEach((value, key) => {
  				options.push({ id: key, name: value });
			});
			// sort by name ascending
			if(options && options.length > 0) {
				options = options.sort((a, b) => a.name.localeCompare(b.name));
			}
    	}
    	return options;
    });

    // options for progress dropdown
    const progressOptions = computed(() => {
    	let options = [];
    	if(progressOptionMap.value) {
    		progressOptionMap.value.forEach((value, key) => {
  				options.push({ id: key, name: value });
			});
    	}
    	return options;
    });

    // options for key stakeholder role dropdown
    const ksRoleOptions = computed(() => {
    	let options = [];
    	if(ksRoleMap.value) {
    		ksRoleMap.value.forEach((value, key) => {
  				options.push({ id: key, name: value });
			});

			// sort by name ascending
			if(options && options.length > 0) {
				options = options.sort((a, b) => a.name.localeCompare(b.name));
			}
    	}
    	return options;
    });

    // finds the first index for an accordion to expand
    const expandRowIndex = computed(() => {
    	let retVal = 0;
    	if(accountTacticList.value && accountTacticList.value.length > 0) {
    		for (let i = 0; i < accountTacticList.value.length; i++) {
    			if(accountTacticList.value[i].statusApi === PENDING_STATUS) {
    				retVal = i;
    				break;
    			}
    		}
    	}
    	return retVal;
    });

    // key stakeholder list
    const ksList = computed(() => {
    	let retList = [];
    	if(keyStakeholders.value && keyStakeholders.value.length > 0) {
    		keyStakeholders.value.filter(item => item.account != null).map(ks => {
    			// account info
	            let specialty = NO_DATA, exparelPriority = NO_DATA, zilrettaPriority = NO_DATA, ioveraPriority = NO_DATA;
	            if(ks.account) {
	                if(ks.account.specialty_1__v && accountSpecialtyMap.value.has(ks.account.specialty_1__v)) {
	                    specialty = accountSpecialtyMap.value.get(ks.account.specialty_1__v);
	                }
	                if(ks.account.pac_exparel_priority__c && accountPriorityMap.value.has(ks.account.pac_exparel_priority__c)) {
	                    exparelPriority = accountPriorityMap.value.get(ks.account.pac_exparel_priority__c);
	                }
	                if(ks.account.pac_zilretta_priority__c && accountPriorityMap.value.has(ks.account.pac_zilretta_priority__c)) {
	                    zilrettaPriority = accountPriorityMap.value.get(ks.account.pac_zilretta_priority__c);
	                }
	                if(ks.account.pac_iovera_priority__c && accountPriorityMap.value.has(ks.account.pac_iovera_priority__c)) {
	                    ioveraPriority = accountPriorityMap.value.get(ks.account.pac_iovera_priority__c);
	                }
	            }

	            // call info
	            let callId = '', callDate = '';
	            if(ks.call) {
	            	callId = ks.call.id;
                    callDate = ks.call.call_date__v;
                }

	            // sent email info
	            let sentEmailId = '', sentEmailDate = '';
	            if(ks.sentEmail) {
                    sentEmailId = ks.sentEmail.id;
                    sentEmailDate = ks.sentEmail.email_sent_date__v;
                }

	            // address info
	            let city = NO_DATA, state = NO_DATA;
	            if(ks.address) {
	            	city = ks.address.city_cda__v;
	            	state = capitalizeWords(ks.address.state_province__v).toUpperCase();
	            }

				// email info
				let email = NO_DATA;
				let emailColor = '';
				if(ks.hasEmail) {
					email = "Yes";
					emailColor = 'green';
				} else {
					email = "No";
					emailColor = 'red';
				}


	            retList.push({
	                name: {
	                    display: ks.account.name__v,
	                    value: ks.account.name__v,
	                    deepLinkObject: 'account__v',
	                    deepLinkId: ks.account.id
	                },
					email: {
						display: email,
						value: email,
						displayColor: emailColor
					},
	                specialty: {
	                    display: specialty,
	                    value: specialty
	                },
	                role: {
	                    display: (ks.role && ksRoleMap.value.has(ks.role)) ? ksRoleMap.value.get(ks.role) : NO_DATA,
	                    value: ks.role
	                },
	                exparelPriority: {
	                    display: exparelPriority,
	                    value: exparelPriority
	                },
	                zilrettaPriority: {
	                    display: zilrettaPriority,
	                    value: zilrettaPriority
	                },
	                ioveraPriority: {
	                    display: ioveraPriority,
	                    value: ioveraPriority
	                },
	                city: {
	                    display: city,
	                    value: city
	                },
	                state: {
	                    display: state,
	                    value: state
	                },
	                lastCallDate: {
	                    display: (callDate !== '') ? Moment(callDate).format(DISPLAY_DATE_FORMAT) : NO_DATA,
	                    value: (callDate !== '') ? Moment(callDate).format(SYSTEM_DATE_FORMAT) : NO_DATA,
	                    deepLinkObject: 'call2__v',
	                    deepLinkId: callId
	                },
	                lastEmailDate: {
	                    display: (sentEmailDate !== '') ? Moment(sentEmailDate).format(DISPLAY_DATE_FORMAT) : NO_DATA,
	                    value: (sentEmailDate !== '') ? Moment(sentEmailDate).format(SYSTEM_DATE_FORMAT) : NO_DATA,
	                    deepLinkObject: 'sent_email__v',
	                    deepLinkId: sentEmailId
	                },
	                action: {
	                    display: '',
	                    value: '',
	                    iconsEnd: [/*{
	                        icon: faHandshake,
	                        color: 'rgb(108, 117, 125)',
	                        iconCallback: () => createNew('call2__v', ks.account.id)
	                    },*/ {
	                        icon: faEnvelope,
	                        color: 'rgb(108, 117, 125)',
	                        iconCallback: () => createNew('sent_email__v', ks.account.id)
	                    }, {
	                        icon: faEdit,
	                        color: 'rgb(108, 117, 125)',
	                        iconCallback: () => openModal(actionType.EDIT_KEY_STAKEHOLDER, ks)
	                    }, {
	                        icon: faTrash,
	                        color: 'rgb(108, 117, 125)',
	                        iconCallback: () => openModal(actionType.DELETE_KEY_STAKEHOLDER, ks)
	                    }]
	                }
	            });
	        });
    	}
    	return retList;
    });
	
	// returns child hcps who are not key stakeholders
	const avblChildHcps = computed(() => {
		let retList = [];
		if(childHcps.value && childHcps.value.length > 0) {
			let existingAccountIds = [];
			if(keyStakeholders.value && keyStakeholders.value.length > 0) {
				existingAccountIds = keyStakeholders.value.map(ks => ks.accountId);
			}

			if(existingAccountIds.length > 0) {
				retList = childHcps.value.filter(a => !existingAccountIds.includes(a.id));
			} else {
				retList = [...childHcps.value];
			}
		}
		return retList;
	});

	/** methods */
	const handleToggle = (tabName) => {
		selectedTab.value = tabName;
	};

	// handler to show modal
	const openModal = (action, data) => {
		selectedAction.value = action;

		// prepare data for modal specific to action type
		switch(action) {
			case actionType.NEW_ACCOUNT_TACTIC:
				modalTitle.value = t('AM_NEW_ACCOUNT_TACTIC');
				parentRecordId.value = selectedPlanTactics.value;
				break;
			case actionType.EDIT_ACCOUNT_TACTIC:
				modalTitle.value = t('AM_EDIT_ACCOUNT_TACTIC');
				recordId.value = data.id;
				parentRecordId.value = data.planTacticId;
				selectedObjective.value = (data.objective) ? data.objective : getKeyByValue(accountTacticOptionMap.value, data.name);
				selectedStatus.value = data.statusApi;
				break;
			case actionType.DELETE_ACCOUNT_TACTIC:
				modalTitle.value = t('AM_DELETE_ACCOUNT_TACTIC');
				recordId.value = data.id;
				break;
			case actionType.NEW_ACTION_ITEM:
				modalTitle.value = t('AM_NEW_ACTION_ITEM');
				if (data && data.id) {
					selectedObjective.value = data.id;
				}
				break;
			case actionType.EDIT_ACTION_ITEM:
				modalTitle.value = t('AM_EDIT_ACTION_ITEM');
				recordId.value = data.id;
				parentRecordId.value = data.accountTacticId;
				selectedActionItem.value = (data.actionItem) ? data.actionItem : getKeyByValue(actionItemOptionMap.value, data.name);
				selectedProgress.value = data.progress;
				dueDate.value = data.dueDateSystem;
				selectedStatus.value = data.statusApi;
				break;
			case actionType.DELETE_ACTION_ITEM:
				modalTitle.value = t('AM_DELETE_ACTION_ITEM');
				recordId.value = data.id;
				break;
			case actionType.NEW_KEY_STAKEHOLDER:
				modalTitle.value = t('AM_NEW_KEY_STAKEHOLDER');
				break;
			case actionType.EDIT_KEY_STAKEHOLDER:
				modalTitle.value = t('AM_EDIT_KEY_STAKEHOLDER');
				recordId.value = data.id;
				selectedHcp.value = data.accountId;
				selectedRole.value = data.role;
				break;
			case actionType.DELETE_KEY_STAKEHOLDER:
				modalTitle.value = t('AM_DELETE_KEY_STAKEHOLDER');
				recordId.value = data.id;
				break;
			default: 
				break;
		}
		showModal.value = true;
	};

	// handler for save action
	const handleSave = async () => {
		showRequiredError.value = false;
		if(selectedAction.value) {
			let configObject = {
			    object: "",
			    fields: {}
			};
			let actionItemsToUpdate = [], mode = '';
			switch(selectedAction.value) {
				case actionType.NEW_ACCOUNT_TACTIC:
					if(!safe(selectedObjective.value)) {
						showRequiredError.value = true
					} else {
						showRequiredError.value = false;
						showLoading.value = true;
						// prepare query config for account tactic
						configObject.object = 'account_tactic__v';
						configObject.fields = {
							name__v: accountTacticOptionMap.value.get(selectedObjective.value),
							pac_objective__c: selectedObjective.value,
							plan_tactic__v: parentRecordId.value,
							account_plan__v: accountPlan.value.id,
							account_tactic_status__v: (selectedStatus.value) ? selectedStatus.value : NOT_STARTED_STATUS
						};
					}
					break;
				case actionType.EDIT_ACCOUNT_TACTIC:
					if(!safe(selectedObjective.value) ) {
						showRequiredError.value = true
					} else {
						showRequiredError.value = false;
						showLoading.value = true;
						// prepare query config for account tactic
						configObject.object = 'account_tactic__v';
						configObject.fields = {
							name__v: accountTacticOptionMap.value.get(selectedObjective.value),
							pac_objective__c: selectedObjective.value,
							plan_tactic__v: selectedPlanTactics.value,
							account_plan__v: accountPlan.value.id,
							account_tactic_status__v: selectedStatus.value
						};
					}
					break;
				case actionType.DELETE_ACCOUNT_TACTIC:
					showLoading.value = true;
					configObject.object = 'account_tactic__v';
					configObject.fields = {
						pac_objective_marked_for_delete__c: true
					}

					// delete all the associated action items
					if(actionItems.value && actionItems.value.length > 0) {
						mode = 'delete';
						actionItemsToUpdate = actionItems.value.filter(ai => ai.accountTacticId === recordId.value).map(item => item.id);
					}
					break;
				case actionType.NEW_ACTION_ITEM:
					if(!safe(selectedActionItem.value) || !safe(dueDate.value)) {
						showRequiredError.value = true
					} else {
						showRequiredError.value = false;
						showLoading.value = true;
						// check if the objective id is still a mobile id
						let accountTacticId = ''
						if(selectedObjective.value && selectedObjective.value.includes('-')) {
							await getAccountTacticByMobileId(selectedObjective.value).then(resp => {
								if(resp?.length > 0) {
									accountTacticId = resp[0].id;
								}
							});
						} else {
							accountTacticId = selectedObjective.value;
						}

						// prepare query config for action item
						configObject.object = 'action_item__v';
						configObject.fields = {
							name__v: actionItemOptionMap.value.get(selectedActionItem.value),
							pac_action_item__c: selectedActionItem.value,
							account_tactic__v: accountTacticId,
							plan_tactic__v: selectedPlanTactics.value,
							account_plan__v: accountPlan.value.id,
							pac_progress__c: selectedProgress.value,
							due_date__v: (dueDate.value != null) ? Moment(dueDate.value).format(SYSTEM_DATE_FORMAT) : null,
							action_item_status__v: (selectedStatus.value) ? selectedStatus.value : NOT_STARTED_STATUS,
							completed_date__v: (selectedStatus.value && selectedStatus.value === COMPLETED_STATUS) ? Moment().format(SYSTEM_DATE_FORMAT) : null
						};
					}
					break;
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
				case actionType.DELETE_ACTION_ITEM:
					showLoading.value = true;
					configObject.object = 'action_item__v';
					configObject.fields = {
						pac_action_item_marked_for_delete__c: true
					}
					break;
				case actionType.NEW_KEY_STAKEHOLDER:
				case actionType.EDIT_KEY_STAKEHOLDER:
					if(!safe(selectedHcp.value)) {
						showRequiredError.value = true
					} else {
						showRequiredError.value = false;
						showLoading.value = true;
						// get the selected hcp name
						let hcpName = '';
						const hcpObj = childHcps.value.find(a => a.id === selectedHcp.value)
						if(hcpObj) {
							hcpName = hcpObj.name;
						}

						// prepare query config for account tactic
						configObject.object = 'key_stakeholder__v';
						configObject.fields = {
							key_stakeholder__v: selectedHcp.value,
							account_plan__v: accountPlan.value.id,
							role__v: selectedRole.value
						};
					}
					break;
				case actionType.DELETE_KEY_STAKEHOLDER:
					showLoading.value = true;
					configObject.object = 'key_stakeholder__v';
					configObject.fields = {
						pac_key_stakeholder_marked_for_delete__c: true
					}
					break;
				default:
					break;
			}
			if(showRequiredError.value === false) {
				let dmlError = false;
				if(recordId.value !== null) {
					updateRecord(configObject.object, recordId.value, configObject.fields)
			        .then(resp => {
			        	console.log('Update ', configObject.object, ': ',  resp);
			        	if(resp && resp.success === true) {
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
			            if(resp && resp.success === true) {
			        		// refresh data
			        		refreshData();
				        } else if(resp && resp.success === false) {
				        	showNotification('error', resp.message);
				        }
			        });
				}
			}
		}
	};

	const createNew = (objectName, accountId) => {
		const configObject = {
		    object: objectName,
		    fields: {
		        account__v: accountId
		    }
		};
		return newRecord(configObject)
		.then(resp => {
			console.log(resp);
		})
	};

	const refreshData = () => {
		if(selectedTab.value === 'engagementPlan') {
			const planTacticIds = planTactics.value.map(item => item.id);
			getAccountTactics(planTacticIds)
			.then(atResp => {
				let accountTacticIds = [];
				if(atResp && atResp.length > 0) {
					setAccountTactics(atResp);
					accountTacticIds = atResp.map(at => at.id);
					console.log('Account Tactic IDS', accountTacticIds)
				}
				return getActionItems(accountTacticIds);
			}).then(aiResp => {
				setActionItems(aiResp);
				const message = (recordId.value !== null) ? t('AM_UPDATE_SUCCESS_MSG') : t('AM_CREATE_SUCCESS_MSG');
				closeModal();
	            showNotification('success', message);
			});
		} else if(selectedTab.value === 'keyStakeholder') {
			getKeyStakeholderInfo(accountPlan.value.id)
			.then(resp => {
				setKeyStakeholders(resp);
	            closeModal();
	            const message = (recordId.value !== null) ? t('AM_UPDATE_SUCCESS_MSG') : t('AM_CREATE_SUCCESS_MSG');
	            showNotification('success', message);
			});
		}
	}

	// handler to close modal
	const closeModal = () => {
		showLoading.value = false;
		showModal.value = false;
		resetProps();
	};

	const resetProps = () => {
		selectedAction.value = '';
		modalTitle.value = '';
		recordId.value = null;
		parentRecordId.value = null;
		selectedObjective.value = '';
		selectedStatus.value = '';
		selectedActionItem.value = '';
		selectedHcp.value = '';
		selectedRole.value = '';
		dueDate.value = null;
		selectedProgress.value = '';
		showRequiredError.value = false;
	}

	// returns the key for a given value of map
	const getKeyByValue = (map, targetValue) => {
		if(targetValue) {
		  	for (const [key, value] of map) {
		    	if (value === targetValue) {
		      		return key;
		    	}
		  	}
		}
	  	return ''; // Value not found
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
    .accordion-header {
 		position: relative;
	}
    .accordion-button {
    	padding: 0.75rem 1rem;
   	}
   	.accordion-header .btn-icon {
		position: absolute;
		right: 0.6rem;
		z-index: 999;
		top: 0.5rem;
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
</style>
