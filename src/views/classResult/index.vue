<template>
  <div class="app-container">
    <div class="text">
      <div class="displayText">
        {{ auditText }}
      </div>
    </div>
    <div class="result">
      <span>分类结果</span>
      <el-row style="margin: 20px 0">
        <el-button type="primary" @click="editClass">修改分类结果</el-button>
      </el-row>
      <MyTable ref="table" :data="classDealList" :config="classDealTableConfig" :page="false">
        <template slot="operate">
          <el-table-column label="操作" width="280" align="center">
            <template slot-scope="scope">
              <el-link style="margin-left: 10px" type="primary" @click="confirmLabel(scope.row.id)">确认</el-link>
              <el-link style="margin-left: 10px" type="primary" @click="checkText(scope.row.id)">查看</el-link>
            </template>
          </el-table-column>
        </template>
      </MyTable>
    </div>
    <el-dialog
      title="修改分类结果"
      :visible.sync="dialogVisible"
      width="30%"
      center
      :before-close="handleClose"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="一级标签">
          <el-autocomplete
            v-model="form.firstClass"
            :fetch-suggestions="firstClassQuerySearch"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="二级标签">
          <el-autocomplete
            v-model="form.secondClass"
            :fetch-suggestions="secondClassQuerySearch"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="三级标签">
          <el-autocomplete
            v-model="form.thirdClass"
            :fetch-suggestions="thirdClassQuerySearch"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="四级标签">
          <el-autocomplete
            v-model="form.fourClass"
            :fetch-suggestions="fourClassQuerySearch"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClassResult">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import MyTable from '../../components/Table'
import request from '@/utils/request'
import { Message } from 'element-ui'
import { mapState } from 'vuex'
export default {
  name: 'Index',
  components: { MyTable },
  data() {
    return {
      text_id: 0,
      auditText: '',
      dialogVisible: false,
      classList: [],
      firstClass: [],
      secondClass: [],
      thirdClass: [],
      fourClass: [],
      state2: '',
      form: {
        firstClass: '',
        secondClass: '',
        thirdClass: '',
        fourClass: ''
      },
      classDealList: [
        {
          firstClass: '工程项目管理',
          secondClass: '立项管理',
          thirdClass: '项目投资计划调整未按规定程序审批',
          problemDefine: '项目实施与投资计划内容不符，未按规定履行备案或审批手续',
          recommend: '80%'
        },
        {
          firstClass: '工程项目管理',
          secondClass: '立项管理',
          thirdClass: '项目投资计划调整未按规定程序审批',
          problemDefine: '项目超计划投资或建设规模，未按规定履行备案或审批手续',
          recommend: '70%'
        },
        {
          firstClass: '工程项目管理',
          secondClass: '立项管理',
          thirdClass: '（无计划）提前实施项目',
          problemDefine: '（无计划）提前实施项目',
          recommend: '50%'
        }
      ]
    }
  },
  computed: {
    classDealTableConfig() {
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
          label: '问题定性'
        },
        {
          prop: 'recommand',
          label: '推荐度'
        }
      ]
    },
    ...mapState('user', ['id'])
  },
  watch: {
    'form.firstClass': function(newVal, oldVal) {
      this.form.secondClass = ''
      const set = new Set()
      this.classList.forEach(item => {
        if (item.firstClass === newVal) {
          set.add(item.secondClass)
        }
      })
      this.secondClass = []
      set.forEach(item => {
        this.secondClass.push({ 'value': item })
      })
    },
    'form.secondClass': function(newVal, oldVal) {
      this.form.thirdClass = ''
      const set = new Set()
      this.classList.forEach(item => {
        if (item.secondClass === newVal) {
          set.add(item.thirdClass)
        }
      })
      this.thirdClass = []
      set.forEach(item => {
        this.thirdClass.push({ 'value': item })
      })
    },
    'form.thirdClass': function(newVal, oldVal) {
      this.form.fourClass = ''
      const set = new Set()
      this.classList.forEach(item => {
        if (item.thirdClass === newVal) {
          set.add(item.fourClass)
        }
      })
      this.fourClass = []
      set.forEach(item => {
        this.fourClass.push({ 'value': item })
      })
    }
  },
  created() {
    this.text_id = this.$route.query.id
    this.getClassResult(this.text_id)
    this.loadAll()
  },
  methods: {

    firstClassQuerySearch(queryString, cb) {
      var restaurants = this.firstClass
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    secondClassQuerySearch(queryString, cb) {
      var restaurants = this.secondClass
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    thirdClassQuerySearch(queryString, cb) {
      var restaurants = this.thirdClass
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    fourClassQuerySearch(queryString, cb) {
      var restaurants = this.fourClass
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    confirmLabel(id) {
      request({
        url: '/api/auditText/confirmLabel/' + this.text_id + '/' + id,
        method: 'get'
      }).then(res => {
        const { code } = res
        if (code === 200) {
          Message({
            message: '提交成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.$router.push('/classify/classify')
        } else {
          Message({
            message: '提交失败',
            type: 'success',
            duration: 5 * 1000
          })
        }
      })
    },
    loadAll() {
      request({
        url: '/api/class/getAllClass',
        method: 'get'
      }).then(res => {
        const { code } = res
        const set = new Set()
        if (code === 200) {
          this.classList = res.data
          res.data.forEach(item => {
            set.add(item.firstClass)
          })
          set.forEach(item => {
            this.firstClass.push({ 'value': item })
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
    checkText(id) {
      this.$router.push({ path: '/checkText/index', query: { id }})
    },
    editClass() {
      this.dialogVisible = true
      this.form.firstClass = ''
      this.form.secondClass = ''
      this.form.fourClass = ''
    },
    editClassResult() {
      if (this.form.firstClass === '' || this.form.secondClass === '' && this.form.thirdClass === '' || this.form.fourClass === '') {
        Message({
          message: '请选择完所有标签，在提交',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      let classID
      this.classList.forEach(item => {
        if (item.firstClass === this.form.firstClass && item.secondClass === this.form.secondClass && item.thirdClass === this.form.thirdClass && item.fourClass === this.form.fourClass) {
          classID = item.id
        }
      })
      request({
        url: '/api/classText/editClass/' + this.text_id + '/' + classID,
        method: 'get'
      }).then(res => {
        const { code } = res
        this.dialogVisible = false
        if (code === 200) {
          Message({
            message: '反馈成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.$router.push('/classify/classify')
        } else {
          Message({
            message: 'error',
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    getClassResult(id) {
      request({
        url: '/api/classText/' + id,
        method: 'get'
      }).then(res => {
        const { code } = res
        if (code === 200) {
          this.auditText = res.data.auditText
          this.classDealList = res.data.classResult
        } else {
          Message({
            message: 'error',
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
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
.el-autocomplete {
  width: 100%;
}
</style>
