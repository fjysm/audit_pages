<template>
  <el-dialog
    title="数据导入记录"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="handleClose"
  >
    <MyTable ref="table" :data="data" :config="tableConfig" :page="false" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="confirm">我知道了</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MyTable from '../../../components/Table'
export default {
  name: 'ImportHistory',
  components: { MyTable },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    }
  },
  data() {
    return {
      historyList: []
    }
  },
  computed: {
    tableConfig() {
      return [
        {
          prop: 'id',
          label: '导入任务id'
        },
        {
          prop: 'importType',
          label: '导入方式'
        },
        {
          prop: 'dataCount',
          label: '数据量'
        },
        {
          prop: 'userName',
          label: '创建人'
        },
        {
          prop: 'createTime',
          label: '开始时间'
        }
      ]
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style scoped>

</style>
