<template>
  <div class="app-container">
    <MyTable ref="table" :data="textList" :config="textTableConfig" check :current.sync="current" :size.sync="limit" :total="total" >
    </MyTable>
  </div>
</template>

<script>
import MyTable from '../../components/Table'
import request from '@/utils/request'
export default {
  name: 'Index',
  components: { MyTable },
  data() {
    return {
      class_id: '',
      textList: [
        {
          text: '未按计划实施且资金超计划，本项目实际工作内容为安装xxx区xx千伏电杆及配电装置标识牌xxxx块，与计划内容不符，项目实际发生成本xx.x万元，超计划x.x万元'
        },
        {
          text: '个别项目销项未报市公司批准。xx公司xxx年电能表推广应用（新装）项目计划资金xx万元，未经市公司批准对项目进行销项。'
        },
        {
          text: '项目实施未建立过程资料，费用发生无资料支撑。项目发生费用全部由各供电所员工通过代开发票报出。按照运维检修部提供的电子版安装明细，发生xx.xx万元标识牌购买费用（xx.x元/块），安装费x.xx万元（x.x元/块），剩余为开票税金。本项目未进行标识牌采购的非招标，无费用审批，无收发货记录等，也无项目实施过程资料，项目管理不到位。'
        }
      ],
      current: 1,
      total: 0,
      limit: 10
    }
  },
  created() {
    this.class_id = this.$route.query.id
    request({
      url: '/api/auditText/getAllLabelAuditText/' + this.class_id + '/' + this.current + '/' + this.limit,
      method: 'get'
    }).then(res => {
      this.textList = []
      this.total = res.data.total
      this.textList = res.data.records
    })
  },
  computed: {
    textTableConfig() {
      return [
        {
          prop: 'text',
          label: '审计文本'
        }
      ]
    }
  },
  methods: {
    check() {
      this.$router.push('/classifyResultCheck/index')
    }
  }
}
</script>

<style scoped>

</style>
