<template>
  <div class="app-container">
    <div ref="chartsDOM" style="width:1000px;height:1000px" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  name: 'CreateDataSet',
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  mounted() {
    // 初始化统计图对象
    var myChart = echarts.init(this.$refs['chartsDOM'])
    // 显示加载动画
    myChart.showLoading()
    axios.get('https://geo.datav.aliyun.com/areas_v3/bound/500000_full.json')
      .then(res => {
        myChart.hideLoading()
        echarts.registerMap('CQ', res.data)
        var option = {
          series: [
            {
              name: '重庆地图',
              type: 'map',
              map: 'CQ',
              label: {
                show: true
              }
            }
          ]
        }
        myChart.setOption(option)
      })
  }
}
</script>

<style scoped>
.el-input {
  width: 35%;
}
</style>
