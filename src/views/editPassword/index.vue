<template>
  <div class="dashboard-container">
    <el-form style="margin-top: 20px" ref="form" :model="form" label-width="100px" status-icon :rules="rules" >
      <el-form-item label="原始密码" prop="oldpassword">
        <el-input  v-model="form.oldpassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newpassword">
        <el-input v-model="form.newpassword"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmpassword">
        <el-input v-model="form.confirmpassword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import request from "@/utils/request";
import {Message} from "element-ui";

export default {
  name: 'EditPassword',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.confirmpassword !== '') {
          this.$refs.form.validateField('confirmpassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newpassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        oldpassword: '',
        newpassword: '',
        confirmpassword: ''
      },
      rules: {
        oldpassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, message: '长度不少于6', trigger: 'blur' }
        ],
        newpassword: [
          { validator: validatePass, trigger: 'blur' },
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '长度不少于6', trigger: 'blur' }
        ],
        confirmpassword: [
          { validator: validatePass2, trigger: 'blur' },
          { required: true, message: '请确认新密码', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          request({
            url: '/audit/user/EditPassword',
            method: 'post',
            data: {
              id: this.$store.state.user.id,
              password: this.form.oldpassword,
              newPassword: this.form.newpassword
            }
          }).then(res => {
            if (res.code === 200) {
              Message({
                message: '密码修改成功',
                type: 'success',
                duration: 5 * 1000
              })
            }
          })
        } else {
          this.resetForm('form')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss">
.el-input {
  width: 35%;
}
</style>

