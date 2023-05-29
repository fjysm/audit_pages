<template>
  <div class="app-container">
    <el-row style="margin-bottom: 20px">
      <el-button type="primary" @click="addClass">添加标签</el-button>
      <el-button @click="deleteBatchClass">批量删除</el-button>
      <el-input v-model="keyword" style="margin-left: 70%" placeholder="输入标签名称" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search" />
      </el-input>
    </el-row>
    <MyTable ref="table" :data="list" :config="tableConfig" :current.sync="current" :size.sync="limit" :total="total" check @updateSize="updateLimit" @updateCurrent="updateCurrent">
      <template slot="percent">
        <el-table-column label="数据占比" width="380" align="center">
          <template slot-scope="scope">
            <el-progress :text-inside="true" :stroke-width="26" :percentage="scope.row.ratio*100" />
          </template>
        </el-table-column>
      </template>
      <template slot="operate">
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="edit(scope.row)">编辑</el-link>
            <el-link style="margin-left: 20px" type="primary" @click="deleteClass(scope.row)">删除</el-link>
            <el-link style="margin-left: 20px" type="primary" @click="checkText(scope.row.id)">查看</el-link>
          </template>
        </el-table-column>
      </template>
    </MyTable>
    <el-dialog :title="title" :visible.sync="showDialog" width="30%" center>
      <el-form :model="form" label-width="80px">
        <el-form-item label="一级标签">
          <el-input v-model="form.firstClass" autocomplete="off" />
        </el-form-item>
        <el-form-item label="二级标签">
          <el-input v-model="form.secondClass" autocomplete="off" />
        </el-form-item>
        <el-form-item label="三级标签">
          <el-input v-model="form.thirdClass" autocomplete="off" />
        </el-form-item>
        <el-form-item label="四级标签">
          <el-input v-model="form.fourClass" autocomplete="off" />
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
import MyTable from '../../../components/Table'
import request from '@/utils/request'
import { Message, MessageBox } from 'element-ui'
export default {
  name: 'LabelManage',
  components: { MyTable },
  data() {
    return {
      list: [],
      // 表格配置
      current: 1,
      limit: 10,
      total: 0,
      keyword: '',
      showDialog: false,
      form: {
        firstClass: '',
        secondClass: '',
        thirdClass: '',
        fourClass: ''
      },
      operateStatus: 'add'
    }
  },
  computed: {
    tableConfig() {
      return [
        {
          prop: 'firstClass',
          label: '一级标签'
        },
        {
          prop: 'secondClass',
          label: '二级标签'
        },
        {
          prop: 'thirdClass',
          label: '三级标签'
        },
        {
          prop: 'fourClass',
          label: '四级标签'
        }
      ]
    },
    title() {
      return this.operateStatus === 'add' ? '添加标签' : '编辑标签'
    }
  },
  created() {
    this.getLabel(this.current, this.limit, '')
  },
  methods: {
    search() {
      this.getLabel(1, this.limit, this.keyword)
    },
    // 打开对话框
    addClass() {
      this.operateStatus = 'add'
      Object.keys(this.form).forEach((key) => {
        this.form[key] = ''
      })
      this.showDialog = true
    },
    edit(row) {
      this.form.firstClass = row.firstClass
      this.form.secondClass = row.secondClass
      this.form.thirdClass = row.thirdClass
      this.form.fourClass = row.fourClass
      this.form.id = row.id
      this.operateStatus = 'edit'
      this.showDialog = true
    },
    cancel() {
      this.showDialog = false
    },
    confirm() {
      if (this.operateStatus === 'add') {
        this.createClass()
      } else {
        this.editClass()
      }
    },
    deleteClass(row) {
      MessageBox.confirm('确认删除此标签？删除后数据将不可恢复', '标签删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/class/deleteClass/' + row.id,
          method: 'post'
        }).then(res => {
          const { code } = res
          if (code === 200) {
            Message({
              message: '删除成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.getLabel(this.current, this.limit, '')
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
    deleteBatchClass() {
      console.log(this.$refs.table.checkRows)
      const ids = []
      this.$refs.table.checkRows.forEach(item => {
        ids.push(item.id)
      })
      MessageBox.confirm('确认删除这些标签？删除后数据将不可恢复', '标签删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/class/deleteBatchClass',
          method: 'post',
          data: ids
        }).then(res => {
          const { code } = res
          if (code === 200) {
            Message({
              message: '删除成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.getLabel(this.current, this.limit, '')
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
    // 向接口发送新增数据
    createClass() {
      request({
        url: '/api/class/createClass',
        method: 'post',
        data: this.form
      }).then(res => {
        const { code } = res
        if (code === 200) {
          Message({
            message: '标签创建成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getLabel(1, this.limit, '')
        } else {
          Message({
            message: '标签创建失败',
            type: 'error',
            duration: 5 * 1000
          })
        }
        this.showDialog = false
      })
    },
    // 向接口发送编辑数据
    editClass() {
      request({
        url: '/api/class/editClass',
        method: 'post',
        data: this.form
      }).then(res => {
        const { code } = res
        if (code === 200) {
          Message({
            message: '标签编辑成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getLabel(1, this.limit, '')
        } else {
          Message({
            message: '标签编辑失败',
            type: 'error',
            duration: 5 * 1000
          })
        }
        this.showDialog = false
      })
    },
    getLabel(current, limit, keyword) {
      request({
        url: '/api/class/findPage/' + current + '/' + limit,
        method: 'post',
        data: { classKeyWords: keyword }
      }).then(res => {
        this.total = res.data.total
        this.list = []
        res.data.records.forEach(item => {
          item.percent = item.count
          this.list.push(item)
        })
      })
    },
    checkText(id) {
      this.$router.push({ path: '/checkText/index', query: { id }})
    },
    // 表格中数据量变动
    updateLimit(val) {
      this.limit = val
      this.getLabel(this.current, this.limit, '')
    },
    // 表格中页数变动
    updateCurrent(val) {
      this.current = val
      this.getLabel(this.current, this.limit, '')
    }
  }
}
</script>

<style scoped>
.el-input-group {
  width: 14%;
}
</style>
