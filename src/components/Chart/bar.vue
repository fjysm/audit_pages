<template>
  <div ref="dom" style="width: 100%;height: 100%" class="charts chart-bar" />
</template>

<script>
import * as echarts from 'echarts'
import { on, off } from '../../utils/tools'
export default {
  name: 'ChartBar',
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  data() {
    return {
      dom: null
    }
  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
  },
  watch: {
    value() {
      this.init()
    }
  },
  methods: {
    resize() {
      this.dom.resize()
    },
    init() {
      const xAxisData = Object.keys(this.value)
      const seriesData = Object.values(this.value)
      const option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: seriesData,
          type: 'bar'
        }]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    }
  }
}
</script>
