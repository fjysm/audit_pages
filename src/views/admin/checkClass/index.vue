<template>
  <div class="app-container">
    <el-row style="margin: 20px 0">
      <el-input style="width: 20%"   placeholder="输入关键字" v-model="keyWord" class="input-with-select">
        <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-row>
    <MyTable ref="table" :data="textList" :config="textTableConfig" check :current.sync="current" :size.sync="limit" :total="total" >
      <template slot="operate">
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-link @click="check(scope.row.id)" type="primary">查看</el-link>
          </template>
        </el-table-column>
      </template>
    </MyTable>
  </div>
</template>

<script>
import MyTable from '../../../components/Table'
import request from '@/utils/request'
export default {
  name: 'Index',
  components: { MyTable },
  data() {
    return {
      textList: [
        {
          text: '未按计划实施且资金超计划，本项目实际工作内容为安装xx片区xx千伏电杆及配电装置标识牌xxxxx块，与计划内容不符，项目实际发生成本xx.x万元，超计划x.x万元'
        },
        {
          text: '个别项目销项未报市公司批准。xx公司xxxx年电能表推广应用（新装）项目计划资金xx万元，未经市公司批准对项目进行销项。'
        },
        {
          text: '项目实施未建立过程资料，费用发生无资料支撑。项目发生费用全部由各供电所员工通过代开发票报出。按照运维检修部提供的电子版安装明细，发生xx.xx万元标识牌购买费用（xx.x元/块），安装费x.xx万元（x.x元/块），剩余为开票税金。本项目未进行标识牌采购的非招标，无费用审批，无收发货记录等，也无项目实施过程资料，项目管理不到位。'
        }
      ],
      limit: 10,
      current: 1,
      total: 0,
      keyWord: ''
    }
  },
  created() {
    this.getCheckText(1, 10, '')
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
    check(id) {
      this.$router.push({ path: '/classifyResultCheck/index', query: { id }})
    },
    getCheckText(current, limit, keyword) {
      request({
        url: '/api/auditText/getCheckAuditText/' + '/' + current + '/' + limit,
        method: 'post',
        data: { keyWord: keyword }
      }).then(res => {
        this.textList = []
        this.total = res.data.total
        this.textList = res.data.records
      })
    },
    search() {
      this.getCheckText(1, 10, this.keyWord)
    }
  }
}
</script>

<style scoped>

</style>
