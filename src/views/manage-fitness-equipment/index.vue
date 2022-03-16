/* eslint-disable no-unused-vars */
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="器材名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.modelNumber" placeholder="器材型号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      min-size="1000px"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('table.id')" type="index" align="center" width="50" />
      <el-table-column label="器材编号" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.serialNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="器材名称" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="器材编号" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.modelNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="社区" width="70px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.communityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="70px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="安装时间" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.gmtCreate|formatTimer }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleDetail(row)">
            详情
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item v-if="dialogStatus === 'update'" label="器材编号" prop="serialNumber">
          <el-input v-model="temp.serialNumber" :disabled="true" />
        </el-form-item>
        <el-form-item label="器材名称" prop="modelName">
          <el-input v-model="temp.modelName" :disabled="true" placeholder="选择型号后自动填写" />
        </el-form-item>
        <el-form-item label="型号" prop="modelNumber">
          <el-select v-model="temp.model" :filterable="true" :remote="true" placeholder="请输入器材名称或者器材型号" :remote-method="getModelOptions" :loading="loadingModel" value-key="modelNumber" :disabled="dialogStatus === 'update'" @change="handleChangeModel">
            <el-option v-for="item in modelOptions" :key="item.modelNumber" :label="item.modelNumber" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="社区" prop="communityName">
          <el-select v-model="temp.community" :filterable="true" :remote="true" placeholder="请输入小区名" :remote-method="getCommunityOptions" :loading="loadingCommunity" value-key="name" :disabled="dialogStatus === 'update'" @change="handleChangeCommunity">
            <el-option v-for="item in communityOptions" :key="item.id" :label="item.name" :value="item" style="width: 400px">
              <span style="float: left;">{{ item.name }}</span>
              <span style="float: right;color:#ccc;">{{ item.province }}/{{ item.city }}/{{ item.district }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'update'" label="状态" prop="status">
          <el-select v-model="temp.status">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="picture">
          <upload :list="temp.pictureList" :limit="3" type="image" :disabled="dialogStatus === 'update'" @change="handleUpload" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="详情" width="80%">
      <el-descriptions title="器材信息" label-width="100px" style="width: 80%; margin-left:50px;" label-position="left">
        <el-descriptions-item label="器材编号">{{ fitnessEquipmentDetail.serialNumber }}</el-descriptions-item>
        <el-descriptions-item label="器材名称">{{ fitnessEquipmentDetail.modelName }}</el-descriptions-item>
        <el-descriptions-item label="器材型号">{{ fitnessEquipmentDetail.modelNumber }}</el-descriptions-item>
        <el-descriptions-item label="社区">{{ fitnessEquipmentDetail.communityName }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ fitnessEquipmentDetail.province }}{{ fitnessEquipmentDetail.city }}{{ fitnessEquipmentDetail.district }}{{ fitnessEquipmentDetail.detailedAddress }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag size="small" :type="fitnessEquipmentDetail.status | statusFilter">{{ fitnessEquipmentDetail.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="fitnessEquipmentDetail.pictureList != null&&fitnessEquipmentDetail.pictureList.length > 0" label="图片">
          <el-image v-for="item in fitnessEquipmentDetail.pictureList" :key="item" style="width:50px;height:50px" :src="item" :preview-src-list="fitnessEquipmentDetail.pictureList" />
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { getFitnessEquipmentList, addFitnessEquipment, getFitnessEquipmentDetail, updateFitnessEquipment, deleteFitnessEquipment } from '@/api/fitness-equipment'
import { getModelList } from '@/api/model'
import { getCommunityList } from '@/api/community'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Upload from '@/views/qiniu/upload.vue'

export default {
  name: 'ComplexTable',
  components: { Pagination, Upload },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        正常: 'success',
        损坏: 'warning',
        报废: 'danger'
      }
      return statusMap[status]
    },
    formatTimer: function(value) {
      const date = new Date(value)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + MM + '-' + d
    }

  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        modelNumber: undefined,
        name: undefined
      },
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      temp: {
        id: undefined,
        serialNumber: undefined,
        model: undefined,
        modelNumber: undefined,
        modelName: undefined,
        modelId: undefined,
        pictureList: [],
        communityName: undefined,
        status: undefined,
        gmtCreate: undefined,
        district: undefined,
        detailedAddress: undefined,
        community: undefined,
        communityId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加',
        detail: '详情'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: '请填写名字', trigger: 'change' }],
        modelNumber: [{ required: true, message: '请填写型号', trigger: 'change' }],
        modelName: [{ required: true, message: '请填写器材名称', trigger: 'change' }]
      },
      downloadLoading: false,
      modelOptions: [],
      loadingModel: false,
      communityOptions: [],
      loadingCommunity: false,
      statusOptions: [{
        value: '0',
        label: '正常'
      }, {
        value: '1',
        label: '损坏'
      }, {
        value: '2',
        label: '报废'
      }],
      fitnessEquipmentDetail: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleChange(value) {
      console.log(value)
    },
    handleDetail(row) {
      console.log(row)
      getFitnessEquipmentDetail(row.id).then(response => {
        this.fitnessEquipmentDetail = response.data
        this.dialogPvVisible = true
      }).catch(err => {
        console.log(err)
      })
      console.log(this.fitnessEquipmentDetail)
    },
    handleChangeCommunity(value) {
      console.log(value)
      this.temp.communityId = value.id
    },
    getCommunityOptions(keyword) {
      if (keyword !== '') {
        this.loadingCommunity = true
        getCommunityList({ name: keyword }).then(response => {
          this.communityOptions = response.data.records
          console.log(response.data.records)
          this.loadingCommunity = false
        })
      } else {
        this.communityOptions = []
      }
    },
    handleChangeModel(value) {
      console.log(value)
      this.temp.modelName = value.name
      this.temp.modelId = value.id
      this.temp.modelNumber = value.modelNumber
    },
    getList() {
      this.listLoading = true
      getFitnessEquipmentList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
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
        this.options = []
      }
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: '',
        type: '',
        pictureList: [],
        picture: undefined,
        modelOptions: [],
        loadingModel: false,
        communityOptions: [],
        loadingCommunity: false
      }
    },
    handleCreate() {
      this.resetTemp()
      this.modelOptions = []
      this.communityOptions = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.pictureList = this.temp.pictureList.map(item => (item.response.data))
          addFitnessEquipment(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.modelOptions = []
      this.communityOptions = []
      this.temp.timestamp = new Date(this.temp.timestamp)
      if (row.pictureList != null && row.pictureList.length > 0) {
        this.temp.pictureList = []
        for (var u of row.pictureList) {
          this.temp.pictureList.push({ url: u, response: { data: u }})
        }
      }
      this.temp.model = { id: 1, name: row.modelName, modelNumber: row.modelNumber }
      this.modelOptions.push(this.temp.model)
      this.temp.community = { id: 1, name: row.communityName }
      this.communityOptions.push(this.temp.community)
      console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = { id: this.temp.id, status: this.temp.status }
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateFitnessEquipment(tempData).then(() => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteFitnessEquipment(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch(err => {
        console.error(err)
      })
      this.getList()
    },
    handleUpload(data) {
      this.temp.pictureList = data
      console.log(data)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
