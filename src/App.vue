<template>
    <div id="app-main" :class="themeClass" class="bg-light" style="height: 100%;">
        <BaseSpinner v-if="isLoading" size="l" position="middle" />
        <router-view v-else/>
    </div>
</template>

<script setup>
    // @ is an alias to /src
    import BaseSpinner from '@/components/common/BaseSpinner'
    import { onMounted, computed, watch } from 'vue';
    import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import EventBus from '@/customEvent/eventBus';
    import { useI18n } from 'vue-i18n';

    const { t } = useI18n();
    
    const store = useAppStore();

    // Getting data from the store
    const { isLoading, xpageAnalytics } = storeToRefs(store);
    const { loadData } = useAppStore();

    onMounted (() => loadData(t));

    const themeClass = computed(() => ({
        'online-theme': store.isOnline,
        'mobile-theme': !store.isOnline
    }));

    const reportAnalyticsData = () => {
        // log view report action 
        if(typeof window['myAnalytics'] !== 'undefined') {
            EventBus.$emit('TRACK_EVENT', { action: window.myAnalytics.analyticsActions__.reportOpen, detail: '' });
        }
    };

    watch(xpageAnalytics, (newValue, oldValue) => {
        if(oldValue !== newValue && newValue === true) {
            if(typeof window['myAnalytics'] !== 'undefined') {
                // start listening to track event
                EventBus.$on('TRACK_EVENT', eventParams => {
                    console.log('TRACK_EVENT: ', eventParams);
                    window.myAnalytics.analyticsDataSend__(eventParams.action, eventParams.detail);
                });
                // report is loaded, so log view action
                reportAnalyticsData();
            } else {
                // stop listening to track event
                // EventBus.$off('TRACK_EVENT');
            }
        }
    });
</script>

<style>
    body {
        font-family: 'Arial', sans-serif;
        color: #1D1D1D
    }
</style>
