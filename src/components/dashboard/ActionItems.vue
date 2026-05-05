<template>
    <div class="card h-100 shadow-sm border-0">
        <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center pb-0">
            <span class="fw-bold">Action Items ({{ dueSoonActionItems.length }})</span>
            <span class="badge bg-danger rounded-pill"><i class="bi bi-bell-fill me-1"></i>Due in 30 days</span>
        </div>
        <div class="card-body p-0 mt-2 overflow-auto" style="max-height: 15.625rem;">
            <table class="table table-sm table-hover mb-0" style="font-size: 0.85rem;">
                <thead class="table-light text-muted">
                    <tr>
                        <th class="fw-normal">ACTION ITEM</th>
                        <th class="fw-normal">ACCOUNT</th>
                        <th class="fw-normal">DUE DATE</th>
                        <th class="fw-normal text-center" style="width: 3rem;"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="dueSoonActionItems.length === 0">
                        <td colspan="4" class="text-center py-4 text-muted">No action items due soon</td>
                    </tr>
                    <ActionItemsListItem 
                        v-for="item in dueSoonActionItems" 
                        :key="item.id"
                        :actionItemId="item.id"
                        :actionItemName="item.name"
                        :accountId="item.accountId"
                        :accountName="item.accountName"
                        :dueDate="item.dueDate"
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
                                placeholder="Select date" 
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
    import { computed, ref } from 'vue';
    import ActionItemsListItem from '@/components/dashboard/ActionItemsListItem.vue';
    import Modal from '@/components/common/BaseModal';
    import Select from '@/components/common/BaseSelect';
    import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import Moment from 'moment';
    import { useI18n } from "vue-i18n";
    import { SYSTEM_DATE_FORMAT } from '@/lib/helper/constants';

    const store = useAppStore();
    const { t } = useI18n();
    const { dashboardActionItems, actionItemMap, statusMap, progressMap, rawActionItems } = storeToRefs(store);

    const dueSoonActionItems = computed(() => {
        const thirtyDaysFromNow = Moment().add(30, 'days').endOf('day');

        return dashboardActionItems.value.filter(item => {
            if (!item.dueDate) return false;
            const dueDate = Moment(item.dueDate);
            return dueDate.isValid() && dueDate.isSameOrBefore(thirtyDaysFromNow, 'day');
        });
    });

    const showModal = ref(false);
    const showLoading = ref(false);
    const showRequiredError = ref(false);

    const selectedActionItem = ref('');
    const dueDate = ref(null);
    const selectedStatus = ref('');
    const selectedProgress = ref('');
    const recordId = ref(null);

    const actionItemOptions = computed(() => {
        let options = [];
        if(actionItemMap.value) {
            actionItemMap.value.forEach((value, key) => {
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
        selectedActionItem.value = getKeyByValue(actionItemMap.value, item.name) || item.name;

        if (rawActionItems.value && rawActionItems.value.length > 0) {
            const rawAi = rawActionItems.value.find(ai => ai.id === item.id);
            if (rawAi) {
                selectedStatus.value = rawAi.action_item_status__v || '';
                selectedProgress.value = rawAi.pac_progress__c || '';
                dueDate.value = rawAi.due_date__v ? Moment(rawAi.due_date__v).format(SYSTEM_DATE_FORMAT) : null;
                selectedActionItem.value = rawAi.pac_action_item__c || getKeyByValue(actionItemMap.value, item.name) || item.name;
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

    const handleSave = () => {
        // Save functionality to be implemented
    };
</script>