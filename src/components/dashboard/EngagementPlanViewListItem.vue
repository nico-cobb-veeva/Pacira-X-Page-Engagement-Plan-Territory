<template>
    <tr>
        <td class="ps-3 border-end">{{ accountPlan.name__v }}</td>
        <td class="border-end"><a href="#" class="text-decoration-none text-primary" @click.prevent="openAccount">{{ accountName }}</a></td>
        <td class="border-end">{{ numObjectives }}</td>
        <td class="border-end">{{ numActionItems }}</td>
        <td class="border-end">
            <div class="d-flex align-items-center">
                <div class="progress me-2 flex-grow-1" style="height: 0.5rem; min-width: 6rem;">
                    <div class="progress-bar bg-primary" role="progressbar" :style="{ width: progress + '%' }"></div>
                </div>
                <div class="d-flex align-items-center justify-content-end" style="width: 6.5rem; flex-shrink: 0;">
                    <span class="fw-bold me-1 text-end" style="width: 3rem; display: inline-block; white-space: nowrap;">{{ progress }}%</span> 
                    <span class="text-muted small text-start" style="width: 3rem; display: inline-block; white-space: nowrap;">({{ completedActionItems }}/{{ numActionItems }})</span>
                </div>
            </div>
        </td>
        <td class="text-center border-end">
            <i v-if="noActivity" class="bi bi-check-circle-fill text-danger fs-5"></i>
        </td>
        <td class="text-center border-end">
            <span v-if="recentAchievements > 0" class="badge bg-success rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 28px; height: 28px;">{{ recentAchievements }}</span>
        </td>
        <td class="text-center"><a href="#" class="text-decoration-none" @click.prevent="openLKA">View</a></td>
    </tr>
</template>

<script setup>
    import { defineProps } from 'vue';
    import { viewRecord } from '@/lib/myInsights/query';

    const props = defineProps({
        accountPlan: {
            type: Object,
            required: true
        },
        account: {
            type: Object,
            required: true
        },
        planTactic: {
            type: String,
            required: true
        },
        accountName: {
            type: String,
            required: true
        },
        numObjectives: {
            type: Number,
            required: true
        },
        numActionItems: {
            type: Number,
            required: true
        },
        completedActionItems: {
            type: Number,
            required: true
        },
        progress: {
            type: Number,
            required: true
        },
        noActivity: {
            type: Boolean,
            required: true
        },
        recentAchievements: {
            type: Number,
            required: true
        }
    });

    const openAccount = () => {
        console.log('openAccount');
        console.log("account", props.account, "account.id", props.account.id);
        if (props.account && props.account.id) {
            viewRecord('account__v', props.account.id);
        }
    };

    const openLKA = () => {
        console.log('openLKA');
        if (props.account && props.account.id) {
            viewRecord('account__v', props.account.id, "Link Key Accounts HCO__institution__v");
        }
    };
</script>