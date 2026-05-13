<template>
    <tr>
        <td class="text-wrap ps-2 border-end" style="width: 40%;">{{ actionItemName }}</td>
        <td class="border-end"><a href="#" class="text-decoration-none text-primary" @click.prevent="openAccount">{{ accountName }}</a></td>
        <td :class="{ 'border-end': !isManager }">{{ dueDate }}</td>
        <td class="text-center" v-if="!isManager">
            <font-awesome-icon :icon="faEdit" style="color: rgb(108, 117, 125); cursor: pointer;" @click.prevent="$emit('edit')" />
        </td>
    </tr>
</template>

<script setup>
    import { defineProps, defineEmits } from 'vue';
    import { viewRecord } from '@/lib/myInsights/query';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import { faEdit } from '@fortawesome/free-solid-svg-icons';
    
    const props = defineProps({
        actionItemId: String,
        actionItemName: String,
        accountId: String,
        accountName: String,
        dueDate: String,
        isManager: Boolean
    });

    defineEmits(['edit']);

    const openAccount = () => {
        if (props.accountId) {
            viewRecord('account__v', props.accountId);
        }
    };
</script>