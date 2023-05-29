<template>
  <div class="app-container">
    <MyTable ref="table" :data="list" :config="tableConfig" :current.sync="current" :size.sync="limit" :total="total" index check @updateSize="updateLimit" @updateCurrent="updateCurrent">
      <template slot="operate">
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="selectDataset(scope.row)">在线分类</el-link>
          </template>
        </el-table-column>
      </template>
    </MyTable>
  </div>
</template>

<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
import MyTable from '@/components/Table'
export default {
  name: 'Classify',
  components: { MyTable },
  data() {
    return {
      total: 0,
      current: 1,
      limit: 10,
      list: []
    }
  },
  created() {
    this.getDataset(this.current, this.limit, '')
  },
  computed: {
    tableConfig() {
      return [
        {
          prop: 'name',
          label: '数据集名称'
        },
        {
          prop: 'type',
          label: '数据类型'
        },
        {
          prop: 'dataCount',
          label: '数据量'
        },
        {
          prop: 'unclassifyCount',
          label: '未分类数量'
        },
        {
          prop: 'pendingClassifyCount',
          label: '待分类数量'
        },
        {
          prop: 'classifyCount',
          label: '已分类数量'
        },
        {
          prop: 'status',
          label: '分类状态（已分类数量/数据量）'
        },
        {
          prop: 'comment',
          label: '备注'
        }
      ]
    }
  },
  methods: {
    getDataset(current, limit, searchText) {
      request({
        url: '/api/dataset/findPage/' + current + '/' + limit,
        method: 'post',
        data: { dataSetName: searchText }
      }).then(res => {
        const { code } = res
        if (code === 200) {
          this.list = []
          this.total = res.data.total
          res.data.records.forEach(item => {
            item.status = '' + ((item.classifyCount / (item.dataCount === 0 ? 1 : item.dataCount)).toFixed(3) * 100).toFixed(2) + '%'
            if (item.type === 'history') {
              item.type = '历史数据'
            } else {
              item.type = '新增数据'
            }
            this.list.push(item)
          })
        } else {
          Message({
            message: 'error',
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    // 表格中数据量变动
    updateLimit(val) {
      this.limit = val
      this.getDataset(this.current, this.limit, '')
    },
    // 表格中页数变动
    updateCurrent(val) {
      this.current = val
      this.getDataset(this.current, this.limit, '')
    },
    selectDataset(datasetInfo) {
      this.$router.push({ path: '/classifyDetail/index', query: { datasetInfo }})
    }
  }
}
</script>

<style scoped>
.app-container {
  height: 100%;
  width: 100%;
}
.el-select {
  width: 300px;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.img {
  width: 160px;
  height: 160px;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
