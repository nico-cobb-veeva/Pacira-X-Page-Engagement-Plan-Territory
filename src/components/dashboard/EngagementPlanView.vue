<template>
    <div class="card shadow-sm border-0 h-100">
        <div class="card-header bg-white d-flex justify-content-between align-items-center border-bottom pb-2 pt-3">
            <span class="fw-bold fs-5"><i class="bi bi-lightning-charge me-2"></i>Engagement Plans ({{ engagementPlans.length }})</span>
            <div class="d-flex">
                <select class="form-select form-select-sm me-2" style="width: auto;" v-model="selectedPlanTactic">
                    <option value="all">All Levels</option>
                    <option v-for="pt in planTacticList" :key="pt.id" :value="pt.id">{{ pt.name }}</option>
                </select>
                <div class="input-group input-group-sm" style="width: 12.5rem;">
                    <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control border-start-0 ps-0" placeholder="Search..." v-model="searchQuery">
                </div>
            </div>
        </div>
        <div class="card-body p-0 table-responsive">
            <table class="table table-hover align-middle mb-0" style="font-size: 0.9rem;">
                <thead class="table-light text-muted small">
                    <tr>
                        <th class="fw-normal py-2 ps-3">ENGAGEMENT PLAN</th>
                        <th class="fw-normal">ACCOUNT</th>
                        <th class="fw-normal"># OBJECTIVES</th>
                        <th class="fw-normal"># ACTION ITEMS</th>
                        <th class="fw-normal" style="min-width: 9.375rem;">PROGRESS</th>
                        <th class="fw-normal text-center">NO ACTIVITIES<br><span style="font-size:0.7rem">(last 30 days)</span></th>
                        <th class="fw-normal text-center">ACHIEVEMENTS<br><span style="font-size:0.7rem">(completed in 15 days)</span></th>
                        <th class="fw-normal text-center">LINK PROFILE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="engagementPlans.length === 0">
                        <td colspan="8" class="text-center py-4 text-muted">No engagement plans found</td>
                    </tr>
                    <tr v-for="plan in engagementPlans" :key="plan.id">
                        <td class="text-primary ps-3">{{ plan.name }}</td>
                        <td class="text-primary">{{ plan.accountName }}</td>
                        <td>{{ plan.numObjectives }}</td>
                        <td>{{ plan.numActionItems }}</td>
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="progress me-2" style="height: 0.5rem; width: 6rem; flex-shrink: 0;">
                                    <div class="progress-bar bg-primary" role="progressbar" :style="{ width: plan.progress + '%' }"></div>
                                </div>
                                <span class="fw-bold me-1 text-end" style="width: 3rem; display: inline-block; white-space: nowrap;">{{ plan.progress }}%</span> 
                                <span class="text-muted small" style="white-space: nowrap;">({{ plan.completedActionItems }}/{{ plan.numActionItems }})</span>
                            </div>
                        </td>
                        <td class="text-center"></td>
                        <td class="text-center">
                            <span v-if="plan.completedActionItems > 0" class="badge bg-success rounded-circle p-2">{{ plan.completedActionItems }}</span>
                        </td>
                        <td class="text-center"><a href="#" class="text-decoration-none">View</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
//TODO: come apply veeva messages
    import { computed, ref, onMounted } from 'vue';
    import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';

    const store = useAppStore();
    const { acctTacticList, actionItemList, planTacticList, currAccount } = storeToRefs(store);

    const selectedPlanTactic = ref('all');
    const searchQuery = ref('');

    const engagementPlans = computed(() => {
        let tactics = acctTacticList.value || [];

        if (selectedPlanTactic.value !== 'all' && selectedPlanTactic.value !== '') {
            tactics = tactics.filter(t => t.planTacticId === selectedPlanTactic.value);
        }

        if (searchQuery.value) {
            const lowerQuery = searchQuery.value.toLowerCase();
            tactics = tactics.filter(t => t.name && t.name.toLowerCase().includes(lowerQuery));
        }

        return tactics.map(tactic => {
            const aiList = (actionItemList.value || []).filter(ai => ai.accountTacticId === tactic.id);
            const totalAi = aiList.length;
            const completedAi = aiList.filter(ai => ai.statusApi === 'completed__v').length;
            const progress = totalAi > 0 ? Math.round((completedAi / totalAi) * 100) : 0;

            return {
                id: tactic.id,
                name: tactic.name,
                accountName: currAccount.value.name || 'Unknown Account',
                numObjectives: 1, // Defaulted to 1 as AccountTactics map to a singular objective in this framework
                numActionItems: totalAi,
                completedActionItems: completedAi,
                progress: progress
            };
        });
    });
</script>