<template >
  <div class="app-container">
    <MyTable ref="table" :data="list" :config="tableConfig" :current.sync="current" :size.sync="limit" :total="total" index check>
      <template slot="operate">
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-link @click="labelManage" type="primary">标签管理</el-link>
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
  name: 'Libary',
  components: { MyTable },
  data() {
    return {
      list: [
        {
          name: '一级标签',
          describe: '',
          createDate: '2022-12-01',
          updateDate: '2022-12-01'
        },
        {
          name: '二级标签',
          describe: '',
          createDate: '2022-12-01',
          updateDate: '2022-12-01'
        },
        {
          name: '三级标签',
          describe: '',
          createDate: '2022-12-01',
          updateDate: '2022-12-01'
        },
        {
          name: '四级标签',
          describe: '',
          createDate: '2022-12-01',
          updateDate: '2022-12-01'
        }
      ]
    }
  },
  computed: {
    tableConfig() {
      return [
        {
          prop: 'name',
          label: '标签名称'
        },
        {
          prop: 'describe',
          label: '标签描述'
        },
        {
          prop: 'createDate',
          label: '创建时间'
        },
        {
          prop: 'updateDate',
          label: '更新时间'
        }
      ]
    }
  },
  methods: {
    labelManage() {
      this.$router.push('/labelManage/index')
    }
  }
}
</script>

<style scoped>

</style>
