<template>
<div class="file-content">
  <div class="name">{{fileName}}</div>
  <span class="delete"><i class="el-icon-delete" @click="deleteFile"></i></span>
</div>
</template>

<script>
export default {
  name: 'FileItem',
  props: {
    fileName: {
      type: String,
      default: ''
    }
  },
  methods: {
    deleteFile() {
      this.$emit('deleteFile', this.fileName)
    }
  }
}
</script>

<style scoped>
.file-content {
  width: 50%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  padding: 20px;
}
.name {
  width: 90%;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.delete:hover{
  color: #20a0ff;
}
</style>
