<template>
    <article :class="themeClass" class="card" style="height: calc(100% - 0.5rem); width: 300px;">
      <div class="card-header">
        <header class="card-title">
              <div class="card-title-icon_container">
                <span class="card-title-icon_wrapper">
                    <FontAwesomeIcon :icon="props.data.icon" class="card-title-icon" />
                </span>
          </div>
          <h2 class="card-title-text">
            <span v-html="data.header" />
          </h2>

        </header>
      </div>
  
      <div v-for="(row, ind) in props.data.body" :key="ind" class="card-body" style="border-top: 1px solid #ddd; padding: 0.5rem;">
        <div style="display: flex; align-items: center;">
            <div v-if="showIndex" style="margin-right: 0.5rem; font-weight: bold;">
                {{ ind + 1 }}.
            </div>

            <div v-if="row.icon" style="flex: 1; white-space: normal;">
                <strong>{{ row.name }}:</strong> 
                <FontAwesomeIcon 
                    :icon="row.icon" 
                    :color="row.iconColor ?? '#808080'"
                    :size="row.size ?? 'sm'"
                />            
            </div>
            <div v-else style="flex: 1; white-space: normal;">
                <strong>{{ row.name }}:</strong> 
                {{ row.value }}
            </div>
        </div>
    </div>
    </article>
  </template>
  
  <script setup>
  // @ is an alias to /src
  import { computed, defineProps } from 'vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { useAppStore } from "@/store/modules/app";

  const store = useAppStore();

  
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
  
  const showIndex = computed(() => {
    if (typeof props.data.showIndex !== 'undefined') return props.data.showIndex;
    return Array.isArray(props.data.body) && props.data.body.length > 1;
  });

  const themeClass = computed(() => ({
  'online-theme': store.isOnline,
  'mobile-theme': !store.isOnline
    }));

  </script>
  <style scoped>
  .table_container {
    overflow: auto;
  }
  table {
    margin: 0
  }
  .online-theme table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 12px;
    --bs-table-color: #212529;
  }
.card-header {
  padding: 7px 7px;
  font-size: 1rem;
  border-bottom: none;
}
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}
.card-title-icon_container {
  height: 1.5rem;
  width: 1.5rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-body {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 12px;
  --bs-table-color: #212529;
}
</style>
  