<template>
    <div class="p-3 border rounded bg-light h-100">
        <div class="text-muted small">{{ title }}</div>
        <div class="fs-3 fw-bold">{{ value }}</div>
        <div class="text-muted" style="font-size: 0.75rem;">{{ subTitle }}</div>
    </div>
</template>

<script setup>
    import { defineProps } from 'vue';
    
    const props = defineProps({
        title: String,
        subTitle: String,
        value: [String, Number]
    });
</script>