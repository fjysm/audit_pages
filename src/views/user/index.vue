<template>
  <div style="margin: 20px 20px;">
    <el-row style="margin: 20px 0">
      <el-button type="primary" @click="createUser">创建用户</el-button>
    </el-row>
    <MyTable ref="table" :data="list" :config="tableConfig" check :current.sync="current" :size.sync="limit" :total="total">
      <template slot="operate">
        <el-table-column label="操作" width="280" align="center">
          <template v-slot:default="scope">
            <el-link :disabled="scope.row.role === 'admin' " type="primary" @click="editRole(scope.row)">修改用户权限</el-link>
          </template>
        </el-table-column>
      </template>
    </MyTable>
    <el-dialog title="用户信息" :visible.sync="showDialog" width="30%" center>
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.userName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户账号">
          <el-input v-model="form.userAccount" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="sendUserInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MyTable from '../../components/Table'
import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
  name: 'Index',
  components: { MyTable },
  data() {
    return {
      list: [],
      current: 1,
      limit: 10,
      total: 10,
      showDialog: false,
      form: {
        userName: '',
        email: '',
        userAccount: ''
      }
    }
  },
  computed: {
    tableConfig() {
      return [
        {
          prop: 'id',
          label: '用户ID'
        },
        {
          prop: 'userName',
          label: '用户名'
        },
        {
          prop: 'userAccount',
          label: '用户账号'
        },
        {
          prop: 'email',
          label: '用户邮箱'
        },
        {
          prop: 'role',
          label: '用户角色'
        }
      ]
    }
  },
  created() {
    this.getAllUserInfo()
  },
  methods: {
    editRole(user) {
      request({
        url: '/audit/user/editRole',
        method: 'post',
        data: user
      }).then(res => {
        if (res.code === 200) {
          Message({
            message: '权限修改成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.list = []
          this.getAllUserInfo()
        } else {
          Message({
            message: '权限修改失败',
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    getAllUserInfo() {
      const url = '/audit/user/getAllUser/' + this.current + '/' + this.limit
      request({
        url,
        method: 'get'
      }).then(res => {
        const { data } = res
        this.current = data.current
        this.limit = data.size
        this.total = data.total
        data.records.forEach(item => {
          this.list.push(item)
        })
      })
    },
    createUser() {
      this.form.username = ''
      this.form.email = ''
      this.form.userAccount = ''
      this.showDialog = true
    },
    sendUserInfo() {
      request({
        url: '/audit/user/createUser',
        method: 'post',
        data: this.form
      }).then(res => {
        if (res.code === 200) {
          Message({
            message: '用户注册成功',
            type: 'success',
            duration: 5 * 1000
          })
        } else {
          Message({
            message: '用户注册失败',
            type: 'error',
            duration: 5 * 1000
          })
        }
        this.showDialog = false
      })
    }
  }
}
</script>

<style scoped>

</style>
