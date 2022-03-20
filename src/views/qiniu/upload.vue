<template>
  <div class="upload-container">
    <el-upload
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
      uploadAction: '/upload/uploadFile',
      image_uri: [],
      headers: {},
      dialogVisible: false,
      dialogImageUrl: String
    }
  },
  mounted() {
    const token = getToken()
    this.headers = { 'Authorization': token }
  },
  methods: {
    beforeUpload(file) {
      var fileType = file.type
      return new Promise((resolve, reject) => {
        if (this.fileType === FILE_TYPE_IMG) {
          if (fileType.indexOf('image') < 0) {
            this.$notify({
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
    },
    handleUpLoad(response, file, fileList) {
      this.$emit('change', fileList)
    }
  }
}

</script>
