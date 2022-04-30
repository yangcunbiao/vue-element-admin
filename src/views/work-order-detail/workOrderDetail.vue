<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="90px" style="width: 100%;" min-size="1000px" border fit>
      <el-row>
        <el-col :span="11">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" :disabled="detailType === 'watch'" />
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择类型" :disabled="detailType === 'watch'">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="申请人" prop="applicant">
            <el-input v-model="form.applicant" :disabled="true" style="width:200px;" />
            <el-popover
              placement="right"
              width="400"
              trigger="click"
            >
              <!-- <span>联系电话：{{ form.applicantInfo.mobilePhoneNumber }}</span> -->
              <el-button slot="reference" icon="el-icon-view" circle size="mini" style="border:none;" />
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="社区" prop="community">
            <el-select v-model="form.community" :filterable="true" :remote="true" placeholder="请选择社区" :disabled="true" :remote-method="getCommunityOptions" :loading="loadingCommunity" value-key="name" @change="handleChangeCommunity">
              <el-option v-for="item in communityOptions" :key="item.id" :label="item.name" :value="item" style="width: 400px">
                <span style="float: left;">{{ item.name }}</span>
                <span style="float: right;color:#ccc;">{{ item.province }}/{{ item.city }}/{{ item.district }}</span>
              </el-option>
            </el-select>
            <el-popover
              placement="right"
              width="400"
              trigger="click"
            >
              <span>详细地址：{{ form.community.district }}{{ form.community.detailedAddress }}</span>
              <el-button slot="reference" icon="el-icon-view" circle size="mini" style="border:none;" />
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="器材型号" prop="model">
            <el-select v-model="form.model" :disabled="form.type === 0 || detailType === 'watch'" :filterable="true" :remote="true" placeholder="请输入器材名称或者器材型号" :remote-method="getModelOptions" :loading="loadingModel" value-key="modelNumber" @change="handleChangeModel">
              <el-option v-for="item in modelOptions" :key="item.modelNumber" :label="item.modelNumber" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="器材名称" prop="modelName">
            <el-input v-model="form.modelName" :disabled="true" placeholder="选择型号后自动填写" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item v-if="form.type === 0" label="器材编号" prop="fitnessEquipmentSerialNumber">
            <el-select v-model="form.fitnessEquipmentSerialNumber" :disabled="detailType === 'watch'" :filterable="true" :remote="true" placeholder="请输入器材编号" :remote-method="getFitnessEquipmentOptions" :loading="loadingFitnessEquipment" value-key="serialNumber" @change="handleChangeFitnessEquipment">
              <el-option v-for="item in fitnessEquipmentOptions" :key="item.serialNumber" :label="item.serialNumber" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item v-if="form.type === 0&&((form.status===0&&checkPermission(['admin']))||form.status===2||form.status===4)" label="维修员" prop="repairman">
            <el-select v-model="form.repairman" :disabled="!(form.type === 0&&(form.status===0))" :filterable="true" :remote="true" placeholder="请指派维修员" :remote-method="getRepairmanOptions" :loading="loadingRepairman" value-key="name" @change="handleChangeRepairman">
              <el-option v-for="item in repairmanOptions" :key="item.id" :label="item.name" :value="item" />
            </el-select>
            <el-popover
              v-if="form.repairman != null"
              placement="right"
              width="400"
              trigger="click"
            >
              <!-- <span>联系电话：{{ form.repairman.mobilePhoneNumber }}</span> -->
              <el-button slot="reference" icon="el-icon-view" circle size="mini" style="border:none;" />
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top:50px;">
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            :disabled="detailType === 'watch'"
            type="textarea"
            placeholder="请输入内容"
            maxlength="200"
            show-word-limit
            :rows="5"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item v-if="form.type === 0" label="图片" prop="content">
          <upload :list="form.pictureList" :limit="5" type="image" :disabled="detailType === 'watch'" style="width: 200px;" @change="handleUpload" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-col v-if="detailType === 'create'" :span="2" :offset="11">
          <el-form-item>
            <el-button type="primary" @click="create">
              提交
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2" :offset="10">
          <el-form-item>
            <el-button v-if="detailType === 'watch'&&(form.status==0)" v-permission="['admin']" type="danger" @click="handleCheck(false)">
              驳回
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button v-if="detailType === 'watch'&&(form.status==0)" v-permission="['admin']" type="primary" @click="handleCheck(true)">
              通过
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="detailType === 'watch'&&form.applicantId===currentUserId&&(form.status==2)" :span="2" :offset="10">
          <el-form-item>
            <el-button type="primary" @click="handleDamage">
              报废
            </el-button>
          </el-form-item>
        </el-col>
        <el-col v-if="detailType === 'watch'&&form.applicantId===currentUserId&&(form.status==2||form.status==3)" :span="2">
          <el-form-item>
            <el-button type="primary" @click="handleFinish">
              完成
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getCommunityList } from '@/api/community'
import { getModelList } from '@/api/model'
import { getFitnessEquipmentList } from '@/api/fitness-equipment'
import Upload from '@/views/qiniu/upload.vue'
import { addWorkOrder, getWorkOrderDetail, checkWorkOrder, finishWorkOrder, finishWorkOrderAndDamage } from '@/api/work-order'
import permission from '@/directive/permission/index.js'
import { getRepairman } from '@/api/user'
import checkPermission from '@/utils/permission'

export default {
  components: { Upload },
  directives: { permission },
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
        modelNumber: null,
        pictureList: [],
        applicant: null,
        applicantInfo: null,
        status: null,
        repairman: null
      },
      pass: false,
      rules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        fitnessEquipmentSerialNumber: [{ required: true, message: '请选择器材', trigger: 'blur' }],
        type: [{ required: true, message: '请选择工单类型', trigger: 'blur' }],
        applicant: [{ required: true, message: '', trigger: 'blur' }],
        community: [{ required: true, message: '请刷新或联系管理员绑定社区', trigger: 'blur' }],
        model: [{ required: true, message: '请选择器材', trigger: 'blur' }],
        modelName: [{ required: true, message: '请选择器材', trigger: 'blur' }],
        content: [{ required: true, message: '请填写内容', trigger: 'blur' }],
        repairman: [{ required: false, validator: (rule, value, callback) => {
          console.log(value)
          if (this.pass && value == null) {
            return callback(new Error('请选择维修员'))
          }
          return callback()
        } }]
      },
      buyRules: {

      },
      repairRules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        fitnessEquipmentSerialNumber: [{ required: true, message: '请选择器材', trigger: 'blur' }],
        type: [{ required: true, message: '请选择工单类型', trigger: 'blur' }],
        applicant: [{ required: true, message: '', trigger: 'blur' }],
        community: [{ required: true, message: '请联系管理员绑定社区', trigger: 'blur' }],
        model: [{ required: true, message: '请选择器材', trigger: 'blur' }]
      },
      communityOptions: [],
      loadingCommunity: false,
      modelOptions: [],
      loadingModel: false,
      fitnessEquipmentOptions: [],
      loadingFitnessEquipment: false,
      typeOptions: [
        {
          value: 0,
          label: '报修单'
        },
        {
          value: 1,
          label: '求购单'
        }
      ],
      detailType: null,
      currentUserId: this.$store.getters.id,
      repairmanOptions: [],
      loadingRepairman: false
    }
  },
  mounted() {
    if (this.$route.query.workOrderId != null) {
      this.edit(this.$route.query.workOrderId)
    } else {
      this.add()
    }
  },
  methods: {
    checkPermission,
    handleDamage() {
      finishWorkOrderAndDamage(this.form.id).then(() => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        this.edit(this.form.id)
        this.$forceUpdate()
      })
    },
    handleChangeRepairman(value) {
      this.form.repairman = value
      this.form.repairmanId = value.id
    },
    getRepairmanOptions(keyword) {
      if (keyword !== '') {
        this.loadingRepairman = true
        getRepairman(keyword).then(response => {
          this.repairmanOptions = response.data
          this.loadingRepairman = false
        })
      } else {
        this.repairmanOptions = []
        this.loadingRepairman = false
      }
    },
    handleFinish() {
      finishWorkOrder(this.form.id).then(() => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        this.edit(this.form.id)
        this.$forceUpdate()
        console.log(this.form, this.detailType)
      })
    },
    handleCheck(result) {
      this.pass = result
      this.$refs['form'].validate((valid) => {
        if (valid) {
          checkWorkOrder({ id: this.form.id, pass: result, repairmanId: this.form.repairmanId, auditorId: this.$store.getters.id }).then(response => {
            this.$notify({
              title: '成功',
              message: '审核成功',
              type: 'success',
              duration: 2000
            })
            // this.$router.push({ name: 'workOrderDetail', path: '/workOrderDetail', query: { workOrderId: this.form.id }})
            this.edit(this.form.id)
            this.$forceUpdate()
          })
        }
      })
    },
    edit(id) {
      this.detailType = 'watch'
      getWorkOrderDetail(id).then(response => {
        // this.form = Object.assign({}, response.data)
        this.form = response.data
        this.form.applicantInfo = this.form.applicant
        this.form.applicantId = this.form.applicant.id
        this.form.applicant = this.form.applicant.name
        this.modelOptions = []
        this.modelOptions.push(this.form.model)
        this.form.modelName = this.form.model.name
        this.communityOptions = []
        this.communityOptions.push(this.form.community)
        if (this.form.repairman != null) {
          this.form.repairmanId = this.form.repairman.id
          this.repairmanOptions = []
          this.repairmanOptions.push(this.form.repairman)
        }
        if (this.form.fitnessEquipment != null) {
          this.form.fitnessEquipmentSerialNumber = this.form.fitnessEquipment.serialNumber
          this.fitnessEquipmentOptions = []
          this.fitnessEquipmentOptions.push(this.form.fitnessEquipment)
        }
        console.log(this.form)
        const pictureList = this.form.pictureList
        if (this.form.pictureList != null && this.form.pictureList.length > 0) {
          this.form.pictureList = []
          for (var u of pictureList) {
            this.form.pictureList.push({ url: u, response: { data: u }})
          }
        }
      })
    },
    create() {
      this.$refs['form'].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.form.pictureList = this.form.pictureList.map(item => (item.response.data))
          console.log(this.form)
          this.form.applicantId = this.$store.getters.id
          this.form.status = 0
          addWorkOrder(this.form).then(response => {
            this.edit(response.data)
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$router.push({ name: 'workOrderDetail', path: '/workOrderDetail', query: { workOrderId: response.data }})
            this.edit(response.data)
            this.$forceUpdate()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    handleUpload(data) {
      this.form.pictureList = data
      console.log(data)
    },
    handleChangeFitnessEquipment(value) {
      console.log(value)
      this.form.fitnessEquipmentSerialNumber = value.serialNumber
      this.form.modelName = value.modelName
      this.form.modelNumber = value.modelNumber
      this.form.modelId = value.modelId
      this.form.model = { id: value.modelId, name: value.modelName, modelNumber: value.modelNumber }
      this.modelOptions = []
      this.modelOptions.push(this.form.model)
    },
    getFitnessEquipmentOptions(keyword) {
      if (keyword !== '') {
        this.loadingFitnessEquipment = true
        getFitnessEquipmentList({ serialNumber: keyword, communityId: this.form.communityId }).then(response => {
          this.fitnessEquipmentOptions = response.data.records
          this.loadingFitnessEquipment = false
        })
      } else {
        this.fitnessEquipmentOptions = []
        this.loadingFitnessEquipment = false
      }
    },
    handleChangeCommunity(value) {
      console.log(value)
      this.form.communityId = value.id
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
        this.loadingCommunity = false
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
        this.loadingModel = false
      }
    },
    add() {
      this.form.applicantId = this.$store.getters.id
      this.form.applicant = this.$store.getters.name
      this.detailType = 'create'
      getCommunityList({ userId: this.$store.getters.id }).then(response => {
        const community = response.data.records[0]
        this.form.community = community
        this.form.communityId = community.id
        this.communityOptions = [community]
      })
    }
  }
}
</script>

<style>
</style>
