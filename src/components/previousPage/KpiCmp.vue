<template>
    <div class="card">
        <div class="card-body p-2">
            <p class="card-title"><strong>{{ title }}</strong></p>
            <h6 class="text-body-secondary">{{ subTitle }}</h6>
            <h5 class="card-text">{{ value }}</h5>
            <slot name="action" />
        </div>
    </div>
</template>

<script setup>
    // @ is an alias to /src
    import { defineProps } from 'vue';
    
    const props = defineProps({
        title: String,
        subTitle: String,
        value: [String, Number]
    });
</script>
