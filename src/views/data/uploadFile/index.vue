<template>
  <el-dialog
    :title="uploadTitle"
    :visible.sync="dialogVisible"
    width="35%"
    :before-close="handleClose"
    center
  >
    <div v-if="showFileList">
      <p>1. {{fileExplain}}，每行是一组样本，首行为表头默认将被忽略，每组数据文本内容的字符数不超过512个字符（包括中英文、数字、符号等），超出的字符可正常保存，但可能无法参与训练。详见
        <el-link type="primary" @click="downLoadFile">数据样例</el-link>
        <br>
        2. 文件类型支持xlsx格式，单次上传限制10个文件；文件格式示意图如下：
      </p>
      <img class="img" src="../../../assets/img/uploadExcel.png">
    </div>
    <div v-else class="file-list">
      <FileItem v-for="file in fileList" :key="file.size" :file-name="file.name" @deleteFile="deleteFile" />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="startUpload" @click="uploadFile">开始上传</el-button>
      <el-button @click="selectFile">添加文件</el-button>
      <input id="inputfile" multiple type="file" accept=".xlsx, .xls" style="display: none;" @change="onSelect">
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import FileItem from '@/components/FileItem'
export default {
  name: 'UploadFile',
  components: { FileItem },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'new'
    }
  },
  data() {
    return {
      showFileList: true,
      startUpload: true,
      fileList: []
    }
  },
  computed: {
    uploadTitle() {
      return this.type === 'new' ? '上传新增电力审计问题' : '上传历史电力审计问题'
    },
    fileExplain() {
      return this.type === 'new' ? '使用第一列作为审计问题事实描述' : '使用第一列作为审计问题事实描述，第二列为问题范围，第三列为问题分类，第四列为问题定性'
    }
  },
  methods: {
    selectFile() {
      const file = document.getElementById('inputfile')
      file.click()
    },
    onSelect(e) {
      this.showFileList = false
      const fileButton = e.target
      this.startUpload = false
      this.fileList.push(fileButton.files[0])
      console.log(e)
    },
    deleteFile(fileName) {
      this.fileList.forEach((item, i) => {
        if (item.name === fileName) {
          this.fileList.splice(i, 1)
        }
      })
    },
    // 上传文件
    uploadFile() {
      this.$emit('file', this.fileList)
    },
    // 下载样例数据
    downLoadFile() {
      axios({
        url: 'http://localhost:8201/api/dataset/download' + this.type,
        method: 'GET',
        responseType: 'blob'
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'example.xlsx')
        document.body.appendChild(link)
        link.click()
      })
    }
  }
}
</script>

<style scoped>
.img {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}
.file-list {
  height: 312px;
  border: 1px dashed #eee;
  background-color: #f7f7f7;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
</style>
