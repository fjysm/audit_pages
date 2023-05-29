<template>
  <div ref="dom" style="width: 100%;height: 100%" className="charts chart-bar" />
</template>

<script>
import * as echarts from 'echarts'
import { on, off } from '../../utils/tools'

export default {
  name: 'StackArea',
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  data() {
    return {
      dom: null,
      option: {
        title: {
          text: this.text
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['准确数量', '反馈数量']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '准确数量',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: []
          },
          {
            name: '反馈数量',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: []
          }
        ]
      }
    }
  },
  watch: {
    value() {
      this.init()
    }
  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
  },
  methods: {
    resize() {
      this.dom.resize()
    },
    init() {
      this.$nextTick(() => {
        let set = new Set()
        this.value.forEach(item => {
          set.add(item.date)
          if (item.type === 'check') {
            this.option.series[1].data.push(item.count)
          } else {
            this.option.series[0].data.push(item.count)
          }
        })
        set.forEach(item => {
          this.option.xAxis[0].data.push(item)
        })
        this.dom = echarts.init(this.$refs.dom)
        this.dom.setOption(this.option)
        on(window, 'resize', this.resize)
      })
    }
  }
}
</script>
