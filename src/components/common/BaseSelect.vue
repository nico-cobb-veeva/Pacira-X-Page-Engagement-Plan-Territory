<template>
    <div>
        <label v-if="showLabel && label" :for="id" class="form-label">
            {{ label }}
            <span v-if="isRequired" class="text-danger">*</span>
        </label>

        <select
            :id="id"
            class="form-select form-select-sm border-secondary" :class="{'form-select-lg': size=='lg', 'form-select-md': size=='md'}"
            v-model="model"
            :aria-label="label || 'Select input'"
            :required="isRequired"
            :disabled="disabled">
            <option value="" disabled>{{ placeholder }}</option>
            <option
                v-for="option in options"
                :key="option.id"
                :value="option.id">
                {{ option.name }}
            </option>
        </select>
        <div v-if="error" class="invalid-feedback d-block">{{ errorMessage }}</div>
    </div>
</template>

<script setup>
    import { defineModel, defineProps } from 'vue';
    const model = defineModel()

    const props = defineProps({
        label: String,
        showLabel: {
            type: Boolean,
            default: false,
        },
        options: {
            type: Array,
            required: true,
        },
        isRequired: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: 'Please select',
        },
        error: {
            type: Boolean,
            default: false,
        },
        errorMessage: {
            type: String,
            default: 'This field is required.',
        },
        size: {
            type: String,
            default: 'sm'   // sm, md, lg
        },
        disabled: {
            type: Boolean,
            default: false,
        }
    });

    const id = props.label?.toLowerCase().replace(/\s+/g, '-') || 'select-field'
</script>