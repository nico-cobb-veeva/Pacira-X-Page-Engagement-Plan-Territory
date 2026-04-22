<template>
  <div v-show="props.show" class="position-fixed top-0 start-50 translate-middle-x p-2" style="z-index: 1055">
    <div
      class="toast show align-items-center text-white border-0"
      role="status"
      :class="{ 'bg-danger': isError, 'bg-success': isSuccess, 'bg-warning': isWarning, 'bg-primary': !isError && !isSuccess && !isWarning }"
    >
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <FontAwesomeIcon v-if="isError" :icon="faExclamationTriangle" />
          <FontAwesomeIcon v-else-if="isWarning" :icon="faExclamationTriangle" />
          <FontAwesomeIcon v-else-if="isSuccess" :icon="faCheck" />
          <FontAwesomeIcon v-else :icon="faInfoCircle" />
          <span>{{ props.data.message }}</span>
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          @click="close"
          aria-label="Close"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
    // @ is an alias to /src
    import { computed, defineProps } from 'vue';
    import { useAppStore } from '@/store/app';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import { faCheck, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
    
    const { setNotification } = useAppStore();

    const props = defineProps({
      data: { type: Object, required: true },
      show: { type: Boolean, required: true }
    });

    const isError = computed(() => props.data.variant === 'error');
    const isWarning = computed(() => props.data.variant === 'warning');
    const isSuccess = computed(() => props.data.variant === 'success');

    // methods
    const close = () => {
        setNotification({ 
            show: false,
            variant: '',
            message: '' 
        });
    };

</script>
