<template>
  <div class="upload-container">
    <el-upload
      ref="upload"
      :multiple="true"
      :auto-upload="true"
      list-type="picture-card"
      :headers="headers"
      :file-list="list"
      :before-upload="beforeUpload"
      :action="uploadAction"
      :limit="limit"
      :before-remove="beforeRemove"
      :on-success="handleUpLoad"
      :disabled="disabled"
      :class="{disabled:isMax}"
      :on-remove="afterRemove"
    >
      <i slot="default" class="el-icon-plus" />
      <div slot="file" slot-scope="{file}">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
        >
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :modal="false">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from '@/api/qiniu'
// 获取七牛token 后端通过Access Key,Secret Key,bucket等生成token
// 七牛官方sdk https://developer.qiniu.com/sdk#official-sdk
import { getToken } from '@/utils/auth'

const FILE_TYPE_IMG = 'image'
const FILE_TYPE_ALL = 'all'
export default {
  name: 'Upload',
  props: {
    fileType: {
      type: String,
      required: false,
      default: FILE_TYPE_ALL
    },
    limit: {
      type: Number,
      required: false,
      default: 1
    },
    list: {
      type: Array,
      required: false,
      default: () => { return [] }
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      uploadAction: '/ycb/upload/uploadFile',
      image_uri: [],
      headers: {},
      dialogVisible: false,
      dialogImageUrl: String,
      isMax: false
    }
  },
  watch: {
    list() {
      console.log('change')
      this.checkIsMax()
    }
  },
  mounted() {
    const token = getToken()
    this.headers = { 'Authorization': token }
    this.checkIsMax()
  },
  methods: {
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList
      const index = fileList.findIndex(fileItem => {
        return fileItem.url === file.url
      })
      console.log(this.list)
      fileList.splice(index, 1)
      const fileList1 = this.$refs.upload.uploadFiles
      const index1 = fileList1.findIndex(fileItem => {
        return fileItem.url === file.url
      })
      fileList1.splice(index1, 1)
      const index2 = this.list.findIndex(fileItem => {
        return fileItem.url === file.url
      })
      this.list.splice(index2, 1)
      this.checkIsMax()
    },
    afterRemove(file, fileList) {
      this.$emit('notify', {
        title: '成功',
        message: '成功删除图片',
        type: 'success',
        duration: 2000
      })
    },
    checkIsMax() {
      // || this.$refs.upload.fileList.length >= this.limit || this.$refs.upload.uploadFiles.length >= this.limit
      if (this.list.length >= this.limit || this.disabled === true) {
        this.isMax = true
      } else {
        this.isMax = false
      }
    },
    handleChange(file, fileList) {
      // || this.list.length >= this.limit || this.$refs.upload.fileList.length >= this.limit || this.$refs.upload.uploadFiles.length >= this.limit
      this.checkIsMax()
    },
    beforeUpload(file) {
      var fileType = file.type
      return new Promise((resolve, reject) => {
        if (this.fileType === FILE_TYPE_IMG) {
          if (fileType.indexOf('image') < 0) {
            this.$emit('notify', {
              title: '错误',
              message: '请上传图片',
              type: 'error',
              duration: 2000
            })
            reject(false)
          }
        }
        resolve(true)
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`)
      console.log(1)
      return true
    },
    handleUpLoad(response, file, fileList) {
      this.$emit('change', fileList)
      this.$emit('notify', {
        title: '成功',
        message: '上传成功',
        type: 'success',
        duration: 2000
      })
      this.checkIsMax()
    }
  }
}

</script>
<style>
.disabled .el-upload--picture-card{
    display: none
}
</style>
