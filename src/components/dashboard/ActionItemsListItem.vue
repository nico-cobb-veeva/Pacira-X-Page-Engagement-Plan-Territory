<template>
    <tr>
        <td class="text-wrap" style="width: 40%;"><a href="#" class="text-decoration-none text-primary" @click.prevent="openActionItem">{{ actionItemName }}</a></td>
        <td><a href="#" class="text-decoration-none text-primary" @click.prevent="openAccount">{{ accountName }}</a></td>
        <td>{{ dueDate }}</td>
    </tr>
</template>

<script setup>
    import { defineProps } from 'vue';
    import { viewRecord } from '@/lib/myInsights/query';
    
    const props = defineProps({
        actionItemId: String,
        actionItemName: String,
        accountId: String,
        accountName: String,
        dueDate: String
    });

    const openActionItem = () => {
        if (props.actionItemId) {
            viewRecord('action_item__v', props.actionItemId);
        }
    };

    const openAccount = () => {
        if (props.accountId) {
            viewRecord('account__v', props.accountId);
        }
    };
</script>