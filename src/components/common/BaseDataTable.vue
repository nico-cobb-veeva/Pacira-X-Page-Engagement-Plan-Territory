<template>
  <div :class="themeClass" style="height: 100%;">
    <div class="table_container" :style="tableContainerStyle">
      <table class="table table-light" :class="tableClasses">
        <thead>
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key" 
              scope="col" 
              class="align-middle sticky-header"
              @click="column?.isSortable ? sortBy(column.key) : null"
              :style="{ width: column?.width || 'auto' }"
            >
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  {{ column?.label || '' }}
                </div>
                <div class="flex-shrink-0 ms-1">
                  <span v-if="column?.isSortable" class="sort-icon">
                    <FontAwesomeIcon 
                      v-if="sortColumnKey === column.key"
                      :icon="sortDirection === 1 ? faSortUp : faSortDown"
                      color="#848484" 
                    />
                    <FontAwesomeIcon 
                      v-else
                      :icon="faSort" 
                      color="#d4d1d0"
                    />
                  </span>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, index) in isLoading ? [null, null, null] : sortedRows" :key="index">
            <tr>
              <td 
                v-for="column in columns" 
                :key="column.key+index" 
                class="align-middle placeholder-glow"
              >
                <span v-if="isLoading" class="placeholder col-4"></span>
                <div v-else-if="row" :class="getRowContentClasses(row[column.key])">
                  <span v-if="row[column.key]?.iconsStart"  class="me-2 no-wrap">
                    <span v-for="(icon, iconIndex) of row[column.key].iconsStart" :key="icon.icon">
                      <span :class="iconIndex !== 0 && 'ms-2'">
                        <FontAwesomeIcon 
                          :icon="icon.icon" 
                          :color="icon.color ?? '#808080'"
                          :size="icon.size ?? 'sm'"
                        />
                      </span>
                    </span>
                  </span>
                  <span v-if="hasDeepLink(row[column.key])">
                    <a href="#" @click="viewRecord(row[column.key].deepLinkObject, row[column.key].deepLinkId)">
                      {{ row[column.key]?.display }}
                    </a>
                  </span>
                  <span v-else-if="row[column.key]?.vhtml">
                    <div v-html="row[column.key]?.vhtml"></div>
                  </span>
                  <span v-else :style="{ color: row[column.key]?.displayColor }">
                    {{ row[column.key]?.display || '' }}
                  </span>
                  <span v-if="row[column.key]?.iconsEnd"  class="ps-2 no-wrap" >
                    <span v-for="(icon, iconIndex) of row[column.key].iconsEnd" :key="icon.icon" class="ps-2" :class="[row[column.key].iconsEnd.length-1 !== iconIndex && 'border-end border-secondary']">
                      <!-- On a mobile device, @touchstart sets the button to an active state, allowing the opacity to apply -->
                      <button
                        v-if="icon.iconCallback"  
                        type="button" 
                        class="btn btn-icon p-0 border-0" 
                        :class="[row[column.key].iconsEnd.length-1 !== iconIndex && 'me-2']"
                        @click="onIconClick(icon.iconCallback, icon.iconCallbackArgs)"
                        @touchstart="noop"
                      >
                        <FontAwesomeIcon 
                          :icon="icon.icon" 
                          :color="icon.color ?? '#808080'"
                          :size="icon.size ?? 'sm'"
                        />
                      </button>
                      <span v-else :class="row[column.key].iconsEnd.length-1 !== iconIndex && 'me-2'">
                        <FontAwesomeIcon 
                          :icon="icon.icon" 
                          :color="icon.color ?? '#808080'"
                          :size="icon.size ?? 'sm'"
                        />
                      </span>
                    </span>
                  </span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, defineEmits } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSortUp, faSortDown, faSort } from '@fortawesome/free-solid-svg-icons'
import { viewRecord } from '@/lib/myInsights/query';
import { useAppStore } from "@/store/app";

const store = useAppStore();

const props = defineProps({
  name: String,
  isLoading: {
    type: Boolean,
    default: false
  },
  striped: {
    type: Boolean,
    default: false
  },
  bordered: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Array,
    default: () => []
  },
  rows: {
    type: Array,
    default: () => []
  },
  defaultSortColumnKey: {
    type: String,
    default: null
  },
  defaultSortColumnDirection: {
    type: Number,
    default: null
  },
  maxHeight: {
    type: String,
    default: '100%'
  },
  maxWidth: {
    type: String,
    default: '100%'
  }
});

const sortColumnKey = ref(props.defaultSortColumnKey);
const sortDirection = ref(props.defaultSortColumnDirection || 1);  // 1 for ascending, -1 for descending

const sortBy = (columnKey) => {
  if (sortColumnKey.value === columnKey) {
    sortDirection.value = -sortDirection.value; 
  } else {
    sortColumnKey.value = columnKey;
    sortDirection.value = 1;
  }
};

const sortedRows = computed(() => {
  return [...props.rows].sort((a, b) => {
    let aValue = a[sortColumnKey.value]?.value ?? ''; 
    let bValue = b[sortColumnKey.value]?.value ?? '';

    const isDate = Date.parse(aValue) && Date.parse(bValue);

    if (isDate) {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    return aValue > bValue ? sortDirection.value : (aValue < bValue ? -sortDirection.value : 0);
  });
});

const emit = defineEmits(['iconClick'])


const onIconClick = (iconCallback, iconCallbackArgs) => {
  emit('iconClick', iconCallback(iconCallbackArgs))
}

/* -------- HELPER METHODS -------- */

const hasDeepLink = (cell) => cell?.deepLinkObject && cell?.deepLinkId;

/* -------- STYLING -------- */

const tableContainerStyle = computed(() => ({
  "max-height": props.maxHeight,
  "max-width": props.maxWidth
}));

const themeClass = computed(() => ({
  'online-theme': store.isOnline,
  'mobile-theme': !store.isOnline
}));

const tableClasses = computed(() => ({
  'table-striped': props.striped,
  'table-bordered border-secondary-subtle': props.bordered,
  'table-custom': true
}));

const getRowContentClasses = (cell) => {
  return {
    'd-flex': true,
    'align-items-center': true,
    'justify-content-start': cell?.alignContent === 'start' ? true : false,
    'justify-content-center': cell?.alignContent === 'center' ? true : false,
    'justify-content-end': cell?.alignContent === 'end' ? true : false,
  }
}

</script>

<style scoped>
.table_container {
  width: 100%;
  border-collapse: collapse;
  overflow-y: auto;
}
table {
  margin: 0
}
.sticky-header {
    position: sticky;
    top: 0;
    background-color: #f8f9fa; /* Example background color */
    z-index: 1; /* Ensures header stays on top of content */
}

.online-theme table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 12px;
  --bs-table-color: #212529;
}

.mobile-theme table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  --bs-table-color: #333333;
}

.mobile-theme thead th {
    color: var(--Primary-brandDarkBlue-Sapphire, #004c93);
    fill: var(--Primary-brandDarkBlue-Sapphire, #004c93);
    font-size: .8125rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -.01rem;
    padding: 0 0.7rem;
}

.mobile-theme thead tr {
    height: 2.5rem;
    padding: 0 1rem;
    /* background: var(--Secondary-header-Ghost, #f2f6f9); */
}

.mobile-theme tbody td {
    height: 2.5rem;
    padding: 0.25rem 0.7rem;
    /* background: var(--Secondary-header-Ghost, #f2f6f9); */
}

.mobile-theme td:first-child, thead th:first-child, .online-theme td:first-child, thead th:first-child {
    border-left: 3px solid #001639;
}

.mobile-theme .table-striped td:first-child, thead th:first-child, .online-theme .table-striped td:first-child, thead th:first-child {
    border-left: 0;
}

.mobile-theme thead th, .online-theme thead th {
  background-color: #f5f6f7 !important;
}

.table-hover tbody tr:hover {
  --bs-table-hover-bg: rgba(254, 172, 49, 0.1); /* Matches Vault CRM Tables */
}
thead th {
  cursor: pointer;
}
th {
    top: 0;
    z-index: 2;
    position: sticky;
    background-color: white;
}
.sort-icon .faSort {
  visibility: hidden;
  opacity: 0;
}
.sort-icon .visible-icon {
  visibility: visible !important;
  opacity: 1;
}
.hidden-icon {
  visibility: hidden;
  opacity: 0;
}
th:hover .hidden-icon {
  visibility: visible;
  opacity: 1;
  transition: opacity .4s ease;
}
a {
  color: #0176d3;
  text-decoration: none;
  -webkit-transition: color 0.1s linear;
  transition: color 0.1s linear;
}
a:hover, a:focus {
  text-decoration: underline;
  color: #014486;
}
.no-wrap {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.btn-light {
  background-color: transparent;
}
.btn:active {
  opacity: 0.2;
}
.btn {
  transition: opacity 0.2s ease;
}
.align-middle {
  vertical-align: middle
}
.table > :not(caption) > * > * {
  background-color: #fff !important;
}
</style>