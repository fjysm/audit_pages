<template>
  <div class="app-container">
    <el-row style="margin-bottom: 20px">
      <el-button type="primary" @click="createDataSet">创建数据集</el-button>
      <el-input v-model="searchText" style="margin-left: 80%" placeholder="输入数据集名称" class="input-with-select">
        <el-button slot="append" @click="search" icon="el-icon-search" />
      </el-input>
    </el-row>
    <MyTable ref="table" :data="list" :config="tableConfig" :current.sync="current" :size.sync="limit" :total="total" index check @updateSize="updateLimit" @updateCurrent="updateCurrent">
      <template slot="operate">
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="importData(scope.row.id)">导入</el-link>
<!--            <el-link style="margin-left: 20px" type="primary" @click="checkDataDetail">详情</el-link>-->
            <el-link style="margin-left: 20px" type="primary" @click="deleteDataset(scope.row.id)">删除</el-link>
          </template>
        </el-table-column>
      </template>
    </MyTable>
    <el-dialog width="30%" title="创建数据集" :visible.sync="addDialog">
      <el-form ref="form" :model="addForm" label-width="100px">
        <el-form-item label="数据集名称">
          <el-input v-model="addForm.name" placeholder="限制50个字符内" />
        </el-form-item>
        <el-form-item label="分类类型">
          <el-radio-group v-model="addForm.type">
            <el-radio label="history">历史数据</el-radio>
            <el-radio label="new">新增数据</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.comment" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import { Message, MessageBox } from 'element-ui'
import MyTable from '../../../components/Table'
export default {
  name: 'Overview',
  components: { MyTable },
  data() {
    return {
      addDialog: false,
      total: 0,
      current: 1,
      limit: 10,
      list: [],
      // 搜索关键字
      searchText: '',
      addForm: {
        name: '',
        type: '',
        comment: ''
      }
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
    createDataSet() {
      this.addDialog = true
    },
    // 创建数据集
    confirm() {
      request({
        url: '/api/dataset/createDataSet',
        method: 'post',
        data: this.addForm
      }).then(res => {
        const { code } = res
        if (code === 200) {
          Message({
            message: '数据集创建成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getDataset(this.current, this.limit, '')
        } else {
          Message({
            message: '数据集创建失败',
            type: 'error',
            duration: 5 * 1000
          })
        }
        this.addDialog = false
        Object.keys(this.addForm).forEach((key) => {
          this.addForm[key] = ''
        })
      })
    },
    // 取消创建
    cancel() {
      this.addDialog = false
      Object.keys(this.addForm).forEach((key) => {
        this.addForm[key] = ''
      })
    },
    // 搜索数据集
    search() {
      this.getDataset(1, this.limit, this.searchText)
      this.searchText = ''
    },
    importData(id) {
      this.$router.push({ path: '/importData/index', query: { id }})
    },
    checkDataDetail() {
      this.$router.push('/checkDataDetail/index')
    },
    // 获取数据集信息
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
    // 删除数据集
    deleteDataset(id) {
      MessageBox.confirm('你确认删除此数据集？删除后数据将不可恢复', '数据集删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/dataset/' + id,
          method: 'delete'
        }).then(res => {
          const { code } = res
          if (code === 200) {
            Message({
              message: '删除成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.getDataset(this.current, this.limit, '')
          } else {
            Message({
              message: '删除失败',
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
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
    }
  }
}
</script>

<style scoped>
.el-input-group {
  width: 16%;
}
</style>
