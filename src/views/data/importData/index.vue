<template>
  <div class="app-container">
    <el-descriptions title="创建信息" column="2">
      <el-descriptions-item label="数据集名称">{{ dataSetInfo.name }}</el-descriptions-item>
      <el-descriptions-item label="类型">{{ dataSetInfo.type }}</el-descriptions-item>
      <el-descriptions-item label="备注">{{ dataSetInfo.comment }}</el-descriptions-item>
      <el-descriptions-item label="导入记录">
        <el-link type="primary" @click="checkHistory">查看导入记录</el-link>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="分类信息" column="2">
      <el-descriptions-item label="数据总量">{{ dataSetInfo.dataCount }}</el-descriptions-item>
      <el-descriptions-item label="未分类">{{ dataSetInfo.unclassifyCount }}</el-descriptions-item>
      <el-descriptions-item label="待分类">{{ dataSetInfo.pendingClassifyCount }}</el-descriptions-item>
      <el-descriptions-item label="已分类">{{ dataSetInfo.classifyCount }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="导入数据" column="2" />
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="导入方式">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-show="showDatasetButton" label="合并数据集">
        <el-select v-model="form.datasetId" placeholder="请选择">
          <el-option
            v-for="item in dataSetList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-show="showUploadButton" label="上传EXCEL文件">
        <el-button @click="uploadFile"><i class="el-icon-upload2" />上传文件</el-button>
      </el-form-item>
      <el-form-item label="是否去重">
        <el-radio-group v-model="duplicateRemoval">
          <el-radio label="true">数据自动去重</el-radio>
          <el-tooltip effect="light" class="item" content="对上传数据，进行重复样本去重" placement="right">
            <i class="iconfont icon-wenhao" style="margin-left: -28px" />
          </el-tooltip>
          <el-radio style="margin-left: 20px" label="false">数据不去重</el-radio>
          <el-tooltip effect="light" class="item" content="保留上传数据中的重复样本" placement="right">
            <i class="iconfont icon-wenhao" style="margin-left: -28px" />
          </el-tooltip>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirmFile">确认并返回</el-button>
      </el-form-item>
    </el-form>
    <upload-file :dialog-visible="showUpload" :type="dataSetInfo.type === '历史数据' ? 'history':'new'" @file="receiveFile" />
    <import-history :data="importHistort" :dialog-visible="showHistory" @confirm="showHistory = false" />
  </div>
</template>
<script>
import axios from 'axios'
import request from '@/utils/request'
import uploadFile from '@/views/data/uploadFile'
import importHistory from '@/views/data/importHistory'
import { Message } from 'element-ui'
export default {
  name: 'ImportData',
  components: { uploadFile, importHistory },
  data() {
    return {
      form: {
        type: ''
      },
      options: [
        {
          value: 'upload',
          label: '上传EXCEL文件'
        }, {
          value: 'merge',
          label: '合并数据集'
        }
      ],
      dataSetInfo: {},
      value: '',
      showUpload: false,
      showHistory: false,
      duplicateRemoval: 'true',
      fileList: [],
      importHistort: [],
      dataSetList: []
    }
  },
  computed: {
    showUploadButton() {
      return this.form.type === 'upload'
    },
    showDatasetButton() {
      return this.form.type === 'merge'
    }
  },
  created() {
    // 获取数据集信息
    const dataSetId = this.$route.query.id
    request({
      url: '/api/dataset/' + dataSetId,
      method: 'get'
    }).then(res => {
      this.dataSetInfo = res.data
      this.getAllDataSet()
    })
  },
  methods: {
    uploadFile() {
      this.showUpload = true
    },
    getAllDataSet() {
      let type
      console.log(this.dataSetInfo.type)
      if (this.dataSetInfo.type === '新增数据') {
        type = 'new'
      } else {
        type = 'history'
      }
      request({
        url: '/api/dataset/getDataSet',
        method: 'post',
        data: { type }
      }).then(res => {
        res.data.forEach(item => {
          const option = {}
          if (this.dataSetInfo.id !== item.id) {
            option.value = item.id
            option.label = item.name
            this.dataSetList.push(option)
          }
        })
      })
    },
    checkHistory() {
      this.showHistory = true
      request({
        url: '/api/importHistory/findPage/' + this.dataSetInfo.id,
        method: 'get'
      }).then(res => {
        this.importHistort = res.data.records
      })
    },
    receiveFile(fileList) {
      this.fileList = fileList
      this.showUpload = false
      Message({
        message: '文件准备就绪',
        type: 'success',
        duration: 5 * 1000
      })
    },
    confirmFile() {
      if (this.showUploadButton) {
        this.postFile()
        this.fileList = []
      } else {
        request({
          url: '/api/auditText/mergeDataSet/' + this.form.datasetId + '/' + this.dataSetInfo.id + '/' + (this.duplicateRemoval === true ? 1 : 0) + '/' + this.$store.state.user.id,
          method: 'get'
        }).then(res => {
          if (res.code === 200) {
            Message({
              message: '数据集合并成功',
              type: 'success',
              duration: 5 * 1000
            })
          }
        })
      }
    },
    mergeDataSet() {

    },
    postFile() {
      const formData = new FormData()
      this.fileList.forEach(f => {
        formData.append('files', f, f.name)
      })
      let url = 'http://localhost:8201/api/auditText/'
      if (this.dataSetInfo.type === '历史数据') {
        url = url + 'uploadHistoryFile/' + this.$route.query.id + '/' + this.$store.state.user.id + '/' + (this.duplicateRemoval === 'true' ? 1 : 0)
      } else {
        url = url + 'uploadNewFile/' + this.$route.query.id + '/' + this.$store.state.user.id + '/' + (this.duplicateRemoval === 'true' ? 1 : 0)
      }
      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log(res)
        const { code } = res.data
        if (code === 200) {
          Message({
            message: '文件上传成功',
            type: 'success',
            duration: 5 * 1000
          })
        }
      }).catch(error => {
        Message({
          message: error,
          type: 'error',
          duration: 5 * 1000
        })
      })
    }

  }
}
</script>

<style scoped>

</style>
