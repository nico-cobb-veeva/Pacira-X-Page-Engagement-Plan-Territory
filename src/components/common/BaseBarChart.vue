<template>
  <v-chart class="chart" :option="option" autoresize :style="{width: data.chartWidth, height: data.chartHeight}"/>
</template>

<script setup>
// @ is an alias to /src
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, defineProps } from 'vue';
import Colors from '@/lib/helper/colors';

const props = defineProps({
  data: {
    type: Object
  },
  options: {
    type: Object
  }
})

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

provide(THEME_KEY, 'light');

const colorPalette = Object.values(Colors);

const option = ref({
  tooltip: {
    // trigger: 'item',
    show: props.options.showTooltip
  },
  legend: {
    data: props.data.series.map(item => item.name)
  },
  series: props.data.series,
  xAxis: {
    type: 'category',
    data: props.data.categories
  },
  yAxis: {
    name: props.options.yAxisName,
    type: 'value',
  },
  color: colorPalette
});
</script>

<style scoped>
</style>
