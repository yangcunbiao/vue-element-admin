/* eslint-disable no-unused-vars */
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.account" placeholder="账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
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
    >
      <el-table-column :label="$t('table.id')" type="index" align="center" width="50" />
      <el-table-column label="账号" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" min-width="70px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mobilePhoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="70px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdatePassword(row)">
            修改密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="账号" prop="account">
          <el-input v-model="temp.account" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="密码" prop="password">
          <el-input v-model="temp.password" show-password />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="确认密码" prop="confirmPassword">
          <el-input v-model="temp.confirmPassword" show-password />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobilePhoneNumber">
          <el-input v-model="temp.mobilePhoneNumber" type="tel" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" type="email" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="temp.roles" multiple placeholder="请选择角色">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像" prop="picture">
          <upload ref="upload" :list="temp.pictureList" :limit="1" type="image" @change="handleUpload" @notify="uploadNotify" />
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

    <el-dialog :visible.sync="dialogPvVisible" title="修改密码">
      <el-form ref="passwordForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="账号" prop="account">
          <el-input v-model="temp.account" :disabled="true" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="temp.confirmPassword" show-password />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="updatePassword()">
          {{ $t('table.confirm') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, addUser, updateUser, checkAccount } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Upload from '@/views/qiniu/upload.vue'

export default {
  name: 'ManageUser',
  components: { Pagination, Upload },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }

  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        account: undefined,
        name: undefined
      },
      showReviewer: false,
      temp: {
        id: undefined,
        account: undefined,
        name: undefined,
        mobilePhoneNumber: undefined,
        email: undefined,
        roles: [],
        pictureList: [],
        avatar: undefined,
        password: null,
        confirmPassword: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: '请填写名字', trigger: 'change' }],
        account: [{ required: true, message: '请填写账号', trigger: 'blur' }, { required: true, validator: (rule, value, callback) => {
          checkAccount(value).then(response => {
            if (response.data === true) {
              return callback(new Error('账号已存在'))
            } else {
              return callback()
            }
          })
        }, trigger: 'blur' }],
        mobilePhoneNumber: [{ required: true, message: '请填写电话号码', trigger: 'change' }, { required: true, pattern: /^1[34578]\d{9}$/, message: '请填写正确的手机号码', trigger: 'blur' }],
        roles: [{ required: true, message: '至少选择一个角色', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: (rule, value, callback) => {
          console.log(this.temp.password)
          if (value === '') {
            return callback(new Error('请再次输入密码'))
          } else if (value === this.temp.password) {
            return callback()
          } else {
            return callback(new Error('两次输入的密码不一致请重新输入'))
          }
        }, trigger: 'blur' }]
      },
      rulesPassword: {
        account: [{ required: true, message: '请填写账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: (rule, value, callback) => {
          console.log(this.temp.password)
          if (value === '') {
            return callback(new Error('请再次输入密码'))
          } else if (value === this.temp.password) {
            return callback()
          } else {
            return callback(new Error('两次输入的密码不一致请重新输入'))
          }
        }, trigger: 'blur' }]
      },
      rulesUpdate: {
        account: [{ required: true, message: '请填写账号', trigger: 'blur' }],
        name: [{ required: true, message: '请填写名字', trigger: 'change' }],
        mobilePhoneNumber: [{ required: true, message: '请填写电话号码', trigger: 'change' }, { required: true, pattern: /^1[34578]\d{9}$/, message: '请填写正确的手机号码', trigger: 'blur' }],
        roles: [{ required: true, message: '至少选择一个角色', trigger: 'change' }]
      },
      rulesCreate: {
        name: [{ required: true, message: '请填写名字', trigger: 'change' }],
        account: [{ required: true, message: '请填写账号', trigger: 'blur' }, { required: true, validator: (rule, value, callback) => {
          checkAccount(value).then(response => {
            if (response.data === true) {
              return callback(new Error('账号已存在'))
            } else {
              return callback()
            }
          })
        }, trigger: 'blur' }],
        mobilePhoneNumber: [{ required: true, message: '请填写电话号码', trigger: 'change' }, { required: true, pattern: /^1[34578]\d{9}$/, message: '请填写正确的手机号码', trigger: 'blur' }],
        roles: [{ required: true, message: '至少选择一个角色', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: (rule, value, callback) => {
          console.log(this.temp.password)
          if (value === '') {
            return callback(new Error('请再次输入密码'))
          } else if (value === this.temp.password) {
            return callback()
          } else {
            return callback(new Error('两次输入的密码不一致请重新输入'))
          }
        }, trigger: 'blur' }]
      },
      roleOptions: [
        {
          value: 'admin',
          label: '管理员'
        },
        {
          value: 'repairMan',
          label: '维修员'
        },
        {
          value: 'property',
          label: '物业'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    updatePassword() {
      console.log(this.$refs.passwordForm)
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData).then(() => {
            this.dialogPvVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdatePassword(row) {
      this.temp = {}
      this.temp.account = row.account
      this.temp.id = row.id
      this.rules = this.rulesPassword
      this.dialogPvVisible = true
      this.$nextTick(() => {
        this.$refs['passwordForm'].clearValidate()
      })
    },
    uploadNotify(result) {
      this.$notify(result)
    },
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
        picture: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.rules = this.rulesCreate
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      if (this.temp.pictureList != null && this.temp.pictureList.length > 0) {
        this.temp.picture = this.temp.pictureList[0].response.data
        this.temp.avatar = this.temp.picture
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addUser(this.temp).then(() => {
            this.list.unshift(this.temp)
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
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.temp.picture = this.temp.avatar
      if (this.temp.avatar != null) {
        this.temp.pictureList = [{ url: this.temp.avatar, response: { data: this.temp.avatar }}]
      }
      this.rules = this.rulesUpdate
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      if (this.temp.pictureList != null && this.temp.pictureList.length > 0) {
        this.temp.picture = this.temp.pictureList[0].response.data
        this.temp.avatar = this.temp.picture
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpload(data) {
      this.temp.pictureList = data
    }
  }
}
</script>
