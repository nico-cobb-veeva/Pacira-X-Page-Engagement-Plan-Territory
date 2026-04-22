<template>
  <div
    class="modal fade show"
    tabindex="-1"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
    v-if="show"
    role="dialog"
    aria-modal="true"
    @click.self="onClose"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" :class="modalSizeClass">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" @click="onClose" aria-label="Close"></button>
        </div>
        <div class="modal-body p-0">
          <slot name="modal-content" />
        </div>
        <div class="modal-footer">
          <slot name="modal-footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  show: Boolean,
  title: String,
  size: {
    type: String,
    default: "sm", // sm | md | lg | xl
  },
  type: {
    type: String,
    default: "default", // optional for styling
  },
  onClose: {
    type: Function,
    default: () => {},
  },
});

const modalSizeClass = {
  sm: "modal-sm",
  md: "",
  lg: "modal-lg",
  xl: "modal-xl",
}[props.size] || "";

</script>
<style scoped>
    .modal-body {
        max-height: calc(100vh - 17rem); /* Adjust based on your header/footer height and desired padding */
        overflow-y: visible;
    }
</style>
