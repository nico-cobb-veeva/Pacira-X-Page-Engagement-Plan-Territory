<template>
    <div class="card h-100 shadow-sm border-0">
        <div class="card-header bg-white border-bottom-0 pb-0 fw-bold">
            {{ $t('EPD_ENGAGEMENT_PLAN_PROGRESS') }}
        </div>
        <div class="card-body d-flex flex-column align-items-center justify-content-center text-muted">
            <!-- SVG Radial Progress Chart -->
            <div class="position-relative mb-3 d-flex align-items-center justify-content-center" style="width: 7.5rem; height: 7.5rem;">
                <svg viewBox="0 0 36 36" class="circular-chart text-success w-100 h-100">
                    <path class="circle-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="#eee" stroke-width="3"/>
                    <path class="circle"
                        :stroke-dasharray="`${progressStats.pct}, 100`"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                </svg>
                <div class="position-absolute fs-4 fw-bold text-dark">{{ progressStats.pct }}%</div>
            </div>
            <div class="w-100 px-3 text-start">
                <div class="mb-2"><i class="bi bi-bullseye me-2"></i>{{ $t('EPD_TOTAL_ACTION_ITEMS') }} <span class="float-end fw-bold text-dark">{{ progressStats.total }}</span></div>
                <div class="mb-2"><i class="bi bi-check-circle me-2 text-success"></i>{{ $t('EPD_COMPLETED') }} <span class="float-end fw-bold text-dark">{{ progressStats.completed }}</span></div>
                <div class="mb-2"><i class="bi bi-clock-history me-2 text-warning"></i>{{ $t('EPD_IN_PROGRESS') }} <span class="float-end fw-bold text-dark">{{ progressStats.inProgress }}</span></div>
                <div><i class="bi bi-star me-2 text-secondary"></i>{{ $t('EPD_NOT_STARTED') }} <span class="float-end fw-bold text-dark">{{ progressStats.notStarted }}</span></div>
            </div>
        </div>
    </div>
</template>

<script setup>
//TODO: come apply veeva messages

    import { computed } from 'vue';
    import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';

    const store = useAppStore();
    const { actionItemList, rawPlans, rawPlanTactics, rawAccountTactics, activeTerritoryAccountIds, selectedPlanTactic } = storeToRefs(store);

    console.log("SELECTED PALN ATCTCI", selectedPlanTactic.value.planTacticName)
    const validAccountTacticIds = computed(() => {
        const activeAccountIdsSet = new Set(activeTerritoryAccountIds.value || []);
        
        const validPlanIds = new Set(
            (rawPlans.value || [])
            .filter(p => activeAccountIdsSet.has(p.account__v))
            .map(p => p.id)
        );

        let filtered = false;
        if (selectedPlanTactic.value.planTacticName !== 'all') {
            filtered = true;
        }

        if (filtered) {
            console.log("SELECTED PALN ATCTCI", selectedPlanTactic.value.planTacticName);
            const validPtIds = new Set(
                (rawPlanTactics.value || [])
                .filter(pt => validPlanIds.has(pt.account_plan__v) && pt.name__v === selectedPlanTactic.value.planTacticName)
                .map(pt => pt.id)
            );

            const validAtIds = new Set(
                (rawAccountTactics.value || [])
                .filter(at => validPtIds.has(at.plan_tactic__v))
                .map(at => at.id)
            );

            return validAtIds;
        }
        else {
            const validPtIds = new Set(
                (rawPlanTactics.value || [])
                .filter(pt => validPlanIds.has(pt.account_plan__v))
                .map(pt => pt.id)
            );

            const validAtIds = new Set(
                (rawAccountTactics.value || [])
                .filter(at => validPtIds.has(at.plan_tactic__v))
                .map(at => at.id)
            );

            return validAtIds;
        }

    });

    const progressStats = computed(() => {
        const filteredItems = (actionItemList.value || []).filter(ai => validAccountTacticIds.value.has(ai.accountTacticId));
        const total = filteredItems.length;
        let completed = 0, inProgress = 0, notStarted = 0;

        filteredItems.forEach(ai => {
            if (ai.statusApi === 'completed__v') completed++;
            else if (ai.statusApi === 'pending__v') inProgress++;
            else notStarted++;
        });

        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, inProgress, notStarted, pct };
    });
</script>

<style scoped>
.circle {
    transition: stroke-dasharray 0.6s ease;
}
</style>