<template>
    <div class="card h-100 shadow-sm border-0">
        <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center pb-0">
            <span class="fw-bold">{{ $t('EPD_INTERACTION_SUMMARY') }}</span>
            <select class="form-select form-select-sm" style="width: auto;" v-model="selectedRange" @change="onRangeChange">
                <option :value="30">{{ $t('EPD_30_DAYS') }}</option>
                <option :value="60">{{ $t('EPD_60_DAYS') }}</option>
                <option :value="90">{{ $t('EPD_90_DAYS') }}</option>
            </select>
        </div>
        <div class="card-body">
            <div class="row g-2 h-100">
                <div class="col-6">
                    <InteractionKpi 
                        :title="$t('EPD_TOTAL_ACCOUNT_CALLS')" 
                        :value="interactionSummary.totalCalls" 
                        :subTitle="$t('EPD_AVG_ATTENDEES_PER_CALL') +' ' + interactionSummary.avgAttendees" 
                        barColor="#0dcaf0"
                    />
                </div>
                <div class="col-6">
                    <InteractionKpi 
                        :title="$t('EPD_TOTAL_CALLS_W_MEDIA')" 
                        :value="interactionSummary.callsWithMedia" 
                        :subTitle="$t('EPD_MEDIA_USED') + ' ' +interactionSummary.mediaUsed" 
                        barColor="#adb5bd"
                    />
                </div>
                <div class="col-6">
                    <InteractionKpi 
                        :title="$t('EPD_TOTAL_SENT_EMAILS')" 
                        :value="interactionSummary.totalEmails" 
                        :subTitle="$t('EPD_EMAIL_CLICKED_RATE') + ' ' + interactionSummary.emailClickRate + '%'" 
                        barColor="#ffc107"
                    />
                </div>
                <div class="col-6">
                    <InteractionKpi 
                        :title="$t('EPD_PENDING_SUGGESTIONS')" 
                        :value="interactionSummary.pendingSuggestions" 
                        :subTitle="$t('EPD_TOTAL_ACTIONED') + ' ' + interactionSummary.actionedSuggestions" 
                        barColor="#6f42c1"
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