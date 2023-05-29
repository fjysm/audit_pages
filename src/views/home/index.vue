<template>
  <div class="dashboard-container">
    <div class="card">
      <IconCard v-for="item in cardList" :key="item.color" :num="item.num" :text="item.text" :background="item.color" />
    </div>
    <div class="chart1">
      <div class="pie">
        <Pie :value="pieData" :text="'各供电局审计文本占比'" />
      </div>
      <div class="bar">
        <Bar :value="barData" :text="'每天新增文本'" />
      </div>
    </div>
    <div class="chart2" style="width: 100%;height: 400px">
      <StackArea :text="'审计文本分类准确数量和反馈数量'" :value="stackData" />
    </div>
  </div>
</template>

<script>
import IconCard from '@/components/IconCard'
import Pie from '@/components/Chart/pie'
import Bar from '@/components/Chart/bar'
import StackArea from '@/components/Chart/stackArea'
import request from '@/utils/request'
export default {
  name: 'Home',
  components: { IconCard, Pie, Bar, StackArea },
  data() {
    return {
      cardList: [
        {
          color: '#19be6b',
          num: '800',
          text: '未分类文本'
        },
        {
          color: '#ed3f14',
          num: '300',
          text: '待分类文本'
        },
        {
          color: '#ff9900',
          num: '300',
          text: '已分类文本'
        },
        {
          color: '#9a66e4',
          num: '70%',
          text: '准确率'
        }
      ],
      pieData: [],
      barData: {},
      stackData: []
    }
  },
  created() {
    this.getClasCount()
    this.getDataCountByDay()
    this.countByDayAndClassifyType()
    this.getAccurate()
    this.getCompany()
  },
  methods: {
    getClasCount() {
      request({
        url: '/api/dataset/getClasscount',
        method: 'get'
      }).then(res => {
        this.cardList[0].num = res.data.unClassifyCount
        this.cardList[1].num = res.data.pendingClassifyCount
        this.cardList[2].num = res.data.classifyCount
      })
    },
    getDataCountByDay() {
      request({
        url: '/api/auditText/getDataCountByDay',
        method: 'get'
      }).then(res => {
        this.barData = {}
        res.data.forEach(item => {
          this.barData[item.date] = item.count
        })
      })
    },
    countByDayAndClassifyType() {
      request({
        url: '/api/auditText/countByDayAndClassifyType',
        method: 'get'
      }).then(res => {
        this.stackData = res.data
      })
    },
    getAccurate() {
      request({
        url: '/api/auditText/getAccurate',
        method: 'get'
      }).then(res => {
        this.cardList[3].num = parseFloat(res.data) * 100 + '%'
      })
    },
    getCompany() {
      request({
        url: '/api/auditText/getCompany',
        method: 'get'
      }).then(res => {
        res.data.forEach(item => {
          const data = {}
          data.value = item.count
          data.name = item.company
          this.pieData.push(data)
        })
      })
    }

  }

}
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin: 30px 30px;
}
.chart1 {
  width: 100%;
  height: 300px;
  margin: 30px 30px;
  display: flex;
  flex-wrap: nowrap;
  .pie{
    width: 40%;
    height: 100%;
  }
  .bar{
    width: 60%;
    height: 100%;
  }
}
</style>
