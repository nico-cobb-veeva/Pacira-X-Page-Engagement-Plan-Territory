<template>
    <div class="container-fluid py-3 px-3 bg-light" style="min-height: 100vh;">
        
        <!-- Top controls -->
        <div class="row mb-3">
            <div class="col d-flex justify-content-end align-items-center">
                <template v-if="isManager">
                    <span class="me-2 fw-bold text-secondary">{{ $t('EPD_TERRITORY') }}</span>
                    <select class="form-select form-select-sm me-3" style="width: auto;" v-model="selectedTerritoryId" @change="handleTerritoryChange">
                        <option v-for="terr in territories" :key="terr.id" :value="terr.id">{{ terr.name }}</option>
                    </select>
                </template>
                <button class="btn btn-sm btn-outline-primary" @click.prevent="handleRefresh">
                    <i class="bi bi-arrow-clockwise me-1"></i> {{ $t('EPD_REFRESH') }}
                </button>
            </div>
        </div>

        <!-- Top Widget Row -->
        <div class="row gx-3 mb-3">
            <!-- Engagement Plan Progress -->
            <div class="col-lg-3 col-md-12 mb-3 mb-lg-0">
                <EngagementPlanProgress />
            </div>
            <!-- Interaction Summary -->
            <div class="col-lg-5 col-md-12 mb-3 mb-lg-0">
                <InteractionSummary />
            </div>
            <!-- Action Items -->
            <div class="col-lg-4 col-md-12 mb-3 mb-lg-0">
                <ActionItems />
            </div>
        </div>

        <!-- Bottom View Row -->
        <div class="row gx-3">
            <div class="col-12">
                <EngagementPlanView />
            </div>
        </div>

    </div>
</template>

<script setup>
    import { ref, watch } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import EngagementPlanProgress from '@/components/dashboard/EngagementPlanProgress.vue';
    import InteractionSummary from '@/components/dashboard/InteractionSummary.vue';
    import ActionItems from '@/components/dashboard/ActionItems.vue';
    import EngagementPlanView from '@/components/dashboard/EngagementPlanView.vue';

    const store = useAppStore();
    const { t } = useI18n();
    const { territories, territory, isManager } = storeToRefs(store);

    const selectedTerritoryId = ref('');

    watch(() => territory.value.id, (newVal) => {
        if (newVal) {
            selectedTerritoryId.value = newVal;
        }
    }, { immediate: true });

    const handleTerritoryChange = () => {
        store.changeTerritory(selectedTerritoryId.value, t);
    };

    const handleRefresh = async () => {
        if (!territory.value.id) return;
        
        store.loading = true;
        try {
            await store.loadTerritoryData(territory.value.id, t);
        } catch (ex) {
            console.log('Error:: ' + ex);
            store.setNotification({ show: true, variant: 'error', message: ex.message });
        } finally {
            store.loading = false;
        }
    };
</script>

<style>
</style>
