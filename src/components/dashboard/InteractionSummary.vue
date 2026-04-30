<template>
    <div class="card h-100 shadow-sm border-0">
        <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center pb-0">
            <span class="fw-bold">Interaction Summary</span>
            <select class="form-select form-select-sm" style="width: auto;" v-model="selectedRange" @change="onRangeChange">
                <option :value="30">30 Days</option>
                <option :value="60">60 Days</option>
                <option :value="90">90 Days</option>
            </select>
        </div>
        <div class="card-body">
            <div class="row g-2 h-100">
                <div class="col-6">
                    <InteractionKpi 
                        title="Total Account Calls" 
                        :value="interactionSummary.totalCalls" 
                        :subTitle="'Avg. Attendees per call: ' + interactionSummary.avgAttendees" 
                    />
                </div>
                <div class="col-6">
                    <InteractionKpi 
                        title="Total Calls w/ Media" 
                        :value="interactionSummary.callsWithMedia" 
                        :subTitle="'# Media used: ' + interactionSummary.mediaUsed" 
                    />
                </div>
                <div class="col-6">
                    <InteractionKpi 
                        title="Total Sent Emails" 
                        :value="interactionSummary.totalEmails" 
                        :subTitle="'Email Clicked Rate: ' + interactionSummary.emailClickRate + '%'" 
                    />
                </div>
                <div class="col-6">
                    <InteractionKpi 
                        title="Pending Suggestions" 
                        :value="interactionSummary.pendingSuggestions" 
                        :subTitle="'Total Actioned: ' + interactionSummary.actionedSuggestions" 
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch } from 'vue';
    import InteractionKpi from '@/components/dashboard/InteractionKpi.vue';
    import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';

    const store = useAppStore();
    const { interactionSummary, selectedDateRange } = storeToRefs(store);

    const selectedRange = ref(selectedDateRange.value);

    watch(selectedDateRange, (newVal) => {
        selectedRange.value = newVal;
    });

    const onRangeChange = () => {
        store.updateInteractionSummary(Number(selectedRange.value));
    };
</script>