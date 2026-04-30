<template>
    <div class="card h-100 shadow-sm border-0">
        <div class="card-header bg-white border-bottom-0 pb-0 fw-bold">
            Engagement Plan Progress
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
                <div class="mb-2"><i class="bi bi-bullseye me-2"></i>Total Action Items <span class="float-end fw-bold text-dark">{{ progressStats.total }}</span></div>
                <div class="mb-2"><i class="bi bi-check-circle me-2 text-success"></i>Completed <span class="float-end fw-bold text-dark">{{ progressStats.completed }}</span></div>
                <div class="mb-2"><i class="bi bi-clock-history me-2 text-warning"></i>In Progress <span class="float-end fw-bold text-dark">{{ progressStats.inProgress }}</span></div>
                <div><i class="bi bi-star me-2 text-secondary"></i>Not Started <span class="float-end fw-bold text-dark">{{ progressStats.notStarted }}</span></div>
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
    const { actionItemList } = storeToRefs(store);

    const progressStats = computed(() => {
        const total = (actionItemList.value || []).length;
        let completed = 0, inProgress = 0, notStarted = 0;

        (actionItemList.value || []).forEach(ai => {
            if (ai.statusApi === 'completed__v') completed++;
            else if (ai.statusApi === 'pending__v') inProgress++;
            else notStarted++;
        });

        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, inProgress, notStarted, pct };
    });
</script>