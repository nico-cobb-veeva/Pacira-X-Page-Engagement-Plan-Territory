<template>
    <tr>
        <td class="text-primary text-wrap" style="width: 40%;">{{ actionItemName }}</td>
        <td class="text-primary">{{ accountName }}</td>
        <td>{{ assignee }}</td>
        <td>{{ dueDate }}</td>
    </tr>
</template>

<script setup>
    import { defineProps } from 'vue';
    
    const props = defineProps({
        actionItemName: String,
        accountName: String,
        assignee: String,
        dueDate: String
    });
</script>