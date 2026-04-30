<template>
    <div class="card h-100 shadow-sm border-0">
        <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center pb-0">
            <span class="fw-bold">Action Items ({{ dashboardActionItems.length }})</span>
            <span v-if="hasItemsDueSoon" class="badge bg-danger rounded-pill"><i class="bi bi-bell-fill me-1"></i>Due in 30 days</span>
        </div>
        <div class="card-body p-0 mt-2 overflow-auto" style="max-height: 15.625rem;">
            <table class="table table-sm table-hover mb-0" style="font-size: 0.85rem;">
                <thead class="table-light text-muted">
                    <tr>
                        <th class="fw-normal">ACTION ITEM</th>
                        <th class="fw-normal">ACCOUNT</th>
                        <th class="fw-normal">ASSIGNEE</th>
                        <th class="fw-normal">DUE DATE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="dashboardActionItems.length === 0">
                        <td colspan="4" class="text-center py-4 text-muted">No action items due soon</td>
                    </tr>
                    <ActionItemsListItem 
                        v-for="item in dashboardActionItems" 
                        :key="item.id"
                        :actionItemName="item.name"
                        :accountName="item.accountName"
                        :assignee="item.assignee"
                        :dueDate="item.dueDate"
                    />
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
//TODO: come apply veeva messages
    import { computed } from 'vue';
    import ActionItemsListItem from '@/components/dashboard/ActionItemsListItem.vue';
    import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import Moment from 'moment';

    const store = useAppStore();
    const { dashboardActionItems } = storeToRefs(store);

    const hasItemsDueSoon = computed(() => {
        const today = Moment().startOf('day');
        const thirtyDaysFromNow = Moment().add(30, 'days').endOf('day');

        return dashboardActionItems.value.some(item => {
            if (!item.dueDate) return false;
            const dueDate = Moment(item.dueDate);
            return dueDate.isValid() && dueDate.isBetween(today, thirtyDaysFromNow, 'day', '[]');
        });
    });
</script>