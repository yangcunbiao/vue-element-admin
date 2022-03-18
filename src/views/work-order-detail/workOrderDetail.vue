<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="90px" style="width: 100%;" min-size="1000px" border fit>
      <el-row>
        <el-col span="11">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" />
          </el-form-item>
        </el-col>
        <el-col span="11" offset="2">
          <el-form-item label="社区" prop="community">
            <el-select v-model="form.community" :filterable="true" :remote="true" placeholder="请输入小区名" :remote-method="getCommunityOptions" :loading="loadingCommunity" value-key="name" :disabled="dialogStatus === 'update'" @change="handleChangeCommunity">
              <el-option v-for="item in communityOptions" :key="item.id" :label="item.name" :value="item" style="width: 400px">
                <span style="float: left;">{{ item.name }}</span>
                <span style="float: right;color:#ccc;">{{ item.province }}/{{ item.city }}/{{ item.district }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="11">
          <el-form-item label="器材型号" prop="model">
            <el-select v-model="form.model" :filterable="true" :remote="true" placeholder="请输入器材名称或者器材型号" :remote-method="getModelOptions" :loading="loadingModel" value-key="modelNumber" :disabled="dialogStatus === 'update'" @change="handleChangeModel">
              <el-option v-for="item in modelOptions" :key="item.modelNumber" :label="item.modelNumber" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="11" offset="2">
          <el-form-item label="器材名称" prop="modelName">
            <el-input v-model="form.modelName" :disabled="true" placeholder="选择型号后自动填写" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getCommunityList } from '@/api/community'
import { getModelList } from '@/api/model'

export default {
  data() {
    return {
      form: {
        id: null,
        title: null,
        content: null,
        communityId: null,
        fitnessEquipmentSerialNumber: null,
        applicantId: null,
        repairmanId: null,
        modelId: null,
        type: null,
        community: null,
        model: null,
        modelName: null,
        modelNumber: null
      },
      rules: {},
      communityOptions: null,
      loadingCommunity: false,
      modelOptions: [],
      loadingModel: false
    }
  },
  methods: {
    handleChangeCommunity(value) {
      console.log(value)
      this.temp.communityId = value.id
    },
    handleChangeModel(value) {
      console.log(value)
      this.form.modelName = value.name
      this.form.modelId = value.id
      this.form.modelNumber = value.modelNumber
    },
    getCommunityOptions(keyword) {
      if (keyword !== '') {
        this.loadingCommunity = true
        getCommunityList({ name: keyword }).then(response => {
          this.communityOptions = response.data.records
          this.loadingCommunity = false
        })
      } else {
        this.communityOptions = []
      }
    },
    getModelOptions(keyword) {
      if (keyword !== '') {
        this.loadingModel = true
        getModelList({ modelNumber: keyword, name: keyword }).then(response => {
          this.modelOptions = response.data.records
          console.log(response.data.records)
          this.loadingModel = false
        })
      } else {
        this.modelOptions = []
      }
    }
  }
}
</script>

<style>
</style>
