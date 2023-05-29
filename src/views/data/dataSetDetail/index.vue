<template>
  <div class="app-container">
    <div class="chart">
      <div class="bar">
        <Bar :value="barFirstData" :text="'一级标签top10'" />
      </div>
      <div class="bar">
        <Bar :value="barSecondData" :text="'二级标签top10'" />
      </div>
      <div class="bar">
        <Bar :value="barThirdData" :text="'三级标签top10'" />
      </div>
      <div class="bar">
        <Bar :value="barFouthData" :text="'问题定性top10'" />
      </div>
      <div class="box">
        <Box></Box>
      </div>
    </div>
  </div>
</template>
<script>
import Bar from '@/components/Chart/bar'
import Box from '@/components/Chart/box'
export default {
  name: 'DataSetDetail',
  components: { Bar, Box },
  data() {
    return {
      barFirstData: {
        '财务资产管理': 120,
        '工程财务管理': 200,
        '工程内控管理': 150,
        '工程投资决策': 80,
        '工程项目管理': 70,
        '公务消费管理': 110,
        '合同管理': 130,
        '招标管理': 50,
        '物资管理': 80,
        '营销管理': 160
      },
      barSecondData: {
        '成本管理方面': 110,
        '收入管理方面': 100,
        '资产管理方面': 50,
        '成本管理': 180,
        '资产管理': 170,
        '工程决算管理': 210,
        '立项管理': 90,
        '设计管理': 150,
        '合同签订管理': 90,
        '薪酬管理方面': 170
      },
      barThirdData: {
        '员工配置不合规': 20,
        '师资队伍管理不规范': 70,
        '绩效奖金分配不合规': 50,
        '存在人员混岗问题': 100,
        '瞒报、虚报或错报、漏报职工人数': 50,
        '废旧物资保管不到位': 150,
        '寄存物资管理不到位': 330,
        '电费管理不规范': 150,
        '物资配送管理不到位': 80,
        '电价类别执行不正确': 60
      },
      barFouthData: {
        '超出合同容量用电': 120,
        '应执行未执行峰谷电价': 70,
        '存在超期电能表': 110,
        '人为调整线损指标': 120,
        '营销系统应用权限存在交叉': 150,
        '指定物资供应单位': 180,
        '施工单位不具备相应资质': 40,
        '未履行定标程序': 50,
        '越权组织项目招标': 80,
        '未按要求采用工程量清单招标': 160
      }
    }
  }
}
</script>

<style lang="less" scoped>
.chart{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .bar{
    width: 50%;
    height: 400px;
  }
  .box{
    width: 100%;
    height: 400px;
  }
}
</style>
