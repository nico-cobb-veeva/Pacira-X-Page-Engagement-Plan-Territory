<template>
    <div class="card shadow-sm border-0 h-100">
        <div class="card-header bg-white d-flex justify-content-between align-items-center border-bottom pb-2 pt-3">
            <span class="fw-bold fs-5"><i class="bi bi-lightning-charge me-2"></i>{{ $t('EPD_ENGAGEMENT_PLANS') }} ({{ engagementPlans.length }})</span>
            <div class="d-flex">
                <select v-if="planTacticList.length > 1" class="form-select form-select-sm me-2" style="width: auto;" v-model="selectedPlanTactic.planTacticName">
                    <option value="all">{{ $t('EPD_ALL_LEVELS') }}</option>
                    <option v-for="pt in planTacticList" :key="pt.id" :value="pt.name">{{ pt.name }}</option>
                </select>
                <div class="input-group input-group-sm" style="width: 12.5rem;">
                    <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control border-start-0 ps-0" :placeholder="$t('EPD_SEARCH')" v-model="searchQuery">
                </div>
            </div>
        </div>
        <div class="card-body p-0 table-responsive">
            <table class="table table-striped align-middle mb-0" style="font-size: 0.9rem;">
                <thead class="table-light text-muted small">
                    <tr>
                        <th class="fw-normal py-2 ps-3 border-end">{{ $t('EPD_COL_ENGAGEMENT_PLAN') }}</th>
                        <th class="fw-normal border-end">{{ $t('EPD_COL_ACCOUNT') }}</th>
                        <th class="fw-normal text-nowrap border-end">{{ $t('EPD_COL_NUM_OBJECTIVES') }}</th>
                        <th class="fw-normal text-nowrap border-end">{{ $t('EPD_COL_NUM_ACTION_ITEMS') }}</th>
                        <th class="fw-normal border-end" style="min-width: 9.375rem;">{{ $t('EPD_COL_PROGRESS') }}</th>
                        <th class="fw-normal text-center border-end">{{ $t('EPD_COL_NO_ACTIVITIES') }}<br><span style="font-size:0.7rem">({{ $t('EPD_LAST_30_DAYS') }})</span></th>
                        <th class="fw-normal text-center border-end">{{ $t('EPD_COL_ACHIEVEMENTS') }}<br><span style="font-size:0.7rem">({{ $t('EPD_COMPLETED_IN_15_DAYS') }})</span></th>
                        <th class="fw-normal text-center">{{ $t('EPD_COL_LKA_PROFILE') }}<br><span style="font-size:0.7rem">({{ $t('EPD_IF_AVAILABLE') }})</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isLoading">
                        <td colspan="8" class="text-center py-4 text-muted">
                            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {{ $t('EPD_LOADING_ENGAGEMENT_PLANS') }}
                        </td>
                    </tr>
                    <tr v-else-if="engagementPlans.length === 0">
                        <td colspan="8" class="text-center py-4 text-muted">{{ $t('EPD_NO_ENGAGEMENT_PLANS_FOUND') }}</td>
                    </tr>
                    <EngagementPlanViewListItem 
                        v-else
                        v-for="plan in engagementPlans" 
                        :key="plan.accountPlan.id"
                        :accountPlan="plan.accountPlan"
                        :account="plan.account"
                        :planTactic="plan.planTactic"
                        :accountName="plan.accountName"
                        :numObjectives="plan.numObjectives"
                        :numActionItems="plan.numActionItems"
                        :completedActionItems="plan.completedActionItems"
                        :progress="plan.progress"
                        :noActivity="plan.noActivity"
                        :recentAchievements="plan.recentAchievements"
                    />
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
//TODO: come apply veeva messages
    import { computed, ref } from 'vue';
    import Moment from 'moment';
    import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import { defineProps } from "vue";

    import EngagementPlanViewListItem from '@/components/dashboard/EngagementPlanViewListItem.vue';

    const props = defineProps({

    });

    const store = useAppStore();
    const { planTacticList, rawPlans, rawPlanTactics, rawAccountTactics, rawActionItems, allAccountMap, isLoading, activeTerritoryAccountIds, selectedPlanTactic } = storeToRefs(store);

    const searchQuery = ref('');

    const engagementPlans = computed(() => {
        const results = [];
        const sq = searchQuery.value.toLowerCase();
        const activeAccountIdsSet = new Set(activeTerritoryAccountIds.value || []);
        const thirtyDaysAgo = Moment().subtract(30, 'days').startOf('day');
        const fifteenDaysAgo = Moment().subtract(15, 'days').startOf('day');

        (rawPlans.value || []).forEach(plan => {
            if (!activeAccountIdsSet.has(plan.account__v)) {
                return;
            }

            const account = allAccountMap.value.get(plan.account__v);
            const accountName = account ? account.name : 'Unknown Account';

            if (sq) {
                const pName = plan.name__v ? plan.name__v.toLowerCase() : '';
                const aName = accountName.toLowerCase();
                if (!pName.includes(sq) && !aName.includes(sq)) {
                    return;
                }
            }

            const myPlanTactics = (rawPlanTactics.value || []).filter(pt => pt.account_plan__v === plan.id);
            const myPtIds = myPlanTactics.map(pt => pt.id);

            let myAccountTactics = (rawAccountTactics.value || []).filter(at => 
                myPtIds.includes(at.plan_tactic__v) && 
                at.pac_objective_marked_for_delete__c !== 1 && 
                at.pac_objective_marked_for_delete__c !== true
            );

            if (selectedPlanTactic.value.planTacticName !== 'all') {
                const matchingPtIds = myPlanTactics
                    .filter(pt => pt.name__v === selectedPlanTactic.value.planTacticName)
                    .map(pt => pt.id);
                    
                myAccountTactics = myAccountTactics.filter(at => matchingPtIds.includes(at.plan_tactic__v));
            }

            const myAtIds = myAccountTactics.map(at => at.id);

            const myActionItems = (rawActionItems.value || []).filter(ai => 
                myAtIds.includes(ai.account_tactic__v) && 
                ai.pac_action_item_marked_for_delete__c !== 1 && 
                ai.pac_action_item_marked_for_delete__c !== true
            );

            const hasRecentActivity = myActionItems.some(ai => {
                const activityDate = ai.modified_date__v
                return activityDate && Moment(activityDate).isValid() && Moment(activityDate).isSameOrAfter(thirtyDaysAgo, 'day');
            });

            const recentAchievements = myActionItems.filter(ai => {
                const modDate = ai.modified_date__v;
                return ai.action_item_status__v === 'completed__v' && 
                       modDate && Moment(modDate).isValid() && 
                       Moment(modDate).isSameOrAfter(fifteenDaysAgo, 'day');
            }).length;

            const numObjectives = myAccountTactics.length;
            const numActionItems = myActionItems.length;
            const completedActionItems = myActionItems.filter(ai => ai.action_item_status__v === 'completed__v').length;
            const progress = numActionItems > 0 ? Math.round((completedActionItems / numActionItems) * 100) : 0;

            results.push({
                accountPlan: plan,
                account: account || {},
                planTactic: selectedPlanTactic.value.planTacticName,
                accountName: accountName,
                numObjectives,
                numActionItems,
                completedActionItems,
                progress,
                noActivity: !hasRecentActivity,
                recentAchievements
            });
        });

        return results;
    });
</script>