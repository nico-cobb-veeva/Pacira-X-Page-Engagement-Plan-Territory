<template>
  <div
    class="d-flex justify-content-center py-2"
    :class="spinnerContainerClasses"
    style="min-height: inherit; height: 100%; width: 100%"
  >
    <div class="spinner-border" :class="spinnerClasses" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script setup>
// @ is an alias to /src
import { defineProps, computed } from "vue";


const props = defineProps({
  size: {
    type: String,
    default: 'm'
  },
  color: {
    type: String,
    default: 'secondary'
  },
  position: {
    type: String,
    default: 'middle'
  }
});

const sizeMap = {
  s: "spinner-border-sm",
  m: "spinner-border-m",
  l: "spinner-border-l",
  xl: "spinner-border-xl",
}

const colorMap = {
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-success",
  danger: "text-danger",
  warning: "text-warning",
  info: "text-info",
  light: "text-light",
  dark: "text-dark",
}

const spinnerClasses = computed(() => [
  sizeMap[props.size] || '',
  colorMap[props.color] || '',
])

const positionMap = {
  top: 'align-items-start',
  middle: 'align-items-center',
}

const spinnerContainerClasses = computed(() => {
  return positionMap[props.position] || positionMap.middle
})

</script>

<style scoped>
.spinner-border-m {
  width: 2rem;
  height: 2rem;
  border-width: 0.25em;
}

.spinner-border-l {
  width: 3rem;
  height: 3rem;
  border-width: 0.3em;
}

.spinner-border-xl {
  width: 4rem;
  height: 4rem;
  border-width: 0.4em;
}
</style>
