<template>
  <div class="app-container" >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="'未分类（'+dataSetInfo.unclassifyCount+'）'" name="noLabel" />
      <el-tab-pane :label="'待分类（'+dataSetInfo.pendingClassifyCount+'）'" name="dealLabel" />
      <el-tab-pane :label="'已分类（'+dataSetInfo.classifyCount+'）'" name="Label" />
    </el-tabs>
    <div v-if="activeName==='dealLabel'" >
      <div class="result">
        <el-row style="margin: 20px 0">
          <el-input v-model="keyWord" style="width: 20%" placeholder="输入关键字" class="input-with-select">
            <el-button slot="append" @click="search" icon="el-icon-search" />
          </el-input>
        </el-row>
        <MyTable ref="table" :data="list" :config="textTableConfig" :current.sync="current" :size.sync="limit" :total="total">
          <template slot="operate">
            <el-table-column label="操作" width="280" align="center">
              <template slot-scope="scope">
                <el-link style="margin-left: 10px" type="primary" @click="check(scope.row.id)">查看分类结果</el-link>
              </template>
            </el-table-column>
          </template>
        </MyTable>
      </div>
    </div>
    <div v-else-if="activeName==='noLabel'" v-loading="loading">
      <el-row style="margin: 20px 0">
        <el-button type="primary" @click="batchClassify">批量分类</el-button>
        <el-input v-model="keyWord" style="width: 20%;margin-left: 70%"  placeholder="输入关键字" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search" />
        </el-input>
      </el-row>
      <MyTable ref="table" :data="list" :config="textTableConfig" check :current.sync="current" :size.sync="limit" :total="total" @updateSize="updateLimit" @updateCurrent="updateCurrent">
        <template slot="operate">
          <el-table-column label="操作" width="280" align="center">
            <template slot-scope="scope">
              <el-link type="primary" @click="classify(scope.row)">分类</el-link>
            </template>
          </el-table-column>
        </template>
      </MyTable>
    </div>
    <div v-else>
      <el-row style="margin: 20px 0">
        <el-input v-model="keyWord" style="width: 20%"  placeholder="输入关键字" class="input-with-select">
          <el-button slot="append" @click="search" icon="el-icon-search" />
        </el-input>
      </el-row>
      <MyTable ref="table" :data="classList" :config="classTableConfig" :current.sync="current" :size.sync="limit" :total="total" />
    </div>
  </div>
</template>

<script>
import MyTable from '../../components/Table'
import request from '@/utils/request'
import { Message } from 'element-ui'
import axios from 'axios'
export default {
  name: 'ClassifyDetail',
  components: { MyTable },
  data() {
    return {
      // 表格信息
      loading: false,
      current: 1,
      limit: 10,
      total: 0,
      list: [],
      classList: [],
      activeName: 'noLabel',
      dataSetInfo: {},
      keyWord: ''
    }
  },
  computed: {
    textTableConfig() {
      if (this.dataSetInfo.type === '历史数据') {
        return [
          {
            prop: 'problem_range',
            label: '问题范围'
          },
          {
            prop: 'problem_class',
            label: '问题分类'
          },
          {
            prop: 'problem_specific',
            label: '问题定性'
          },
          {
            prop: 'text',
            label: '审计文本'
          }
        ]
      } else {
        return [
          {
            prop: 'text',
            label: '审计文本'
          }
        ]
      }
    },
    classTableConfig() {
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
        },
        {
          prop: 'auditText',
          label: '审计文本'
        }
      ]
    }
  },
  watch: {
    activeName(newName, oldName) {
      if (newName === 'dealLabel') {
        this.getAuditText(1, 10, '', 'getPendingClassifyText')
        this.keyWord = ''
      }
      if (newName === 'Label') {
        this.getAuditText(1, 10, '', 'getClassifyText')
        this.keyWord = ''
      }
      if (newName === 'noLabel') {
        this.getAuditText(1, 10, '', 'getUnClassifyText')
        this.keyWord = ''
      }
    }
  },
  created() {
    // 获取数据集信息
    this.dataSetInfo = this.$route.query.datasetInfo
    this.getAuditText(this.current, this.limit, '', 'getUnClassifyText')
  },
  methods: {
    getDataSetInfo() {
      // 获取数据集信息
      const dataSetId = this.dataSetInfo.id
      request({
        url: '/api/dataset/' + dataSetId,
        method: 'get'
      }).then(res => {
        this.dataSetInfo = res.data
      })
    },
    // 跳转至查看分类结果页面
    check(id) {
      this.$router.push({ path: '/classifyResult/index', query: { id }})
    },
    getAuditText(current, limit, searchText, url) {
      request({
        url: '/api/auditText/' + url + '/' + this.dataSetInfo.id + '/' + current + '/' + limit,
        method: 'post',
        data: { keyWord: searchText }
      }).then(res => {
        const { code } = res
        if (code === 200) {
          if (url === 'getClassifyText') {
            this.classList = []
            this.total = res.data.total
            this.classList = res.data.records
          } else {
            this.list = []
            this.total = res.data.total
            if (this.dataSetInfo.type !== '历史数据') {
              this.list = res.data.records
            } else {
              res.data.records.forEach(item => {
                item.problem_range = item.text.split(' ')[0]
                item.problem_class = item.text.split(' ')[1]
                item.problem_specific = item.text.split(' ')[2]
                item.text = item.text.split(' ')[3]
                this.list.push(item)
              })
            }
          }
        } else {
          Message({
            message: 'error',
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    classify(row) {
      this.loading = true
      console.log(row)
      const data = {}
      let url = 'http://127.0.0.1:9020/'
      if (this.dataSetInfo.type === '新增数据') {
        url = url + 'new'
        data.question = row.text
      } else {
        url = url + 'history'
        data.firstClass = row.problem_range
        data.secondClass = row.problem_class
        data.thirdClass = row.problem_specific
      }
      console.log(data)
      axios.post(url, data)
        .then(res => {
          request({
            url: '/api/auditText/classify/' + row.id + '/' + this.dataSetInfo.id,
            method: 'post',
            data: { classList: res.data }
          }).then(serRes => {
            this.loading = false
            this.getAuditText(1, 10, '', 'getUnClassifyText')
            if (serRes.code === 200) {
              this.getDataSetInfo()
              Message({
                message: '分类成功',
                type: 'success',
                duration: 5 * 1000
              })
            }
          })
        })
    },
    batchClassify() {
      this.$refs.table.checkRows.forEach(item => {
        this.classify(item)
      })
    },
    search() {
      if (this.activeName === 'dealLabel') {
        this.getAuditText(1, 10, this.keyWord, 'getPendingClassifyText')
      }
      if (this.activeName === 'Label') {
        this.getAuditText(1, 10, this.keyWord, 'getClassifyText')
      }
      if (this.activeName === 'noLabel') {
        this.getAuditText(1, 10, this.keyWord, 'getUnClassifyText')
      }
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
.text {
  width: 100%;
  height: 300px;
  border: 1px #666 dashed;
}
.operate {
  height: 50px;
  background-color: #f4f6f7;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}
.displayText{
  color: #606266;
  padding: 20px 60px;
}
.result {
  margin-top: 30px;
}
</style>
