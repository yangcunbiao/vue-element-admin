<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.serialNumber" placeholder="工单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="类型" style="width: 200px;" class="filter-item">
        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" style="width: 200px;" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-if="type === 'myWorkOrder'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180px" align="center" label="工单号">
        <template slot-scope="{row}">
          <span>{{ row.serialNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="社区">
        <template slot-scope="{row}">
          <span>{{ row.community }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型" width="95">
        <template slot-scope="{row}">
          <span>{{ row.type | typeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusColorFilter">
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" effect="plain" @click="handleWatch(row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getWorkOrderList, getWaitHandleWorkOrderList, getMyWorkOrderList } from '@/api/work-order'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  filters: {
    statusColorFilter(status) {
      const statusMap = {
        0: '',
        1: 'danger',
        2: '',
        3: '',
        4: 'success'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        0: '待审核',
        1: '已驳回',
        2: '待修理',
        3: '待购买',
        4: '已完结'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      const typeMap = {
        0: '报修单',
        1: '求购单'
      }
      return typeMap[type]
    }
  },
  props: {
    type: {
      type: String,
      default: 'waitHandle'
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        type: null,
        serialNumber: null,
        title: null,
        status: null
      },
      loading: false,
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
      statusOptions: [
        {
          value: 0,
          label: '待审核'
        },
        {
          value: 1,
          label: '已驳回'
        },
        {
          value: 2,
          label: '待修理'
        },
        {
          value: 3,
          label: '待购买'
        },
        {
          value: 4,
          label: '已完结'
        }
      ]
    }
  },
  watch: {
    type() {
      this.getList()
    }
  },
  mounted() {
    console.log(1)
    this.getList()
  },
  created() {
    this.getList()
  },
  methods: {
    handleWatch(row) {
      console.log(row)
      this.$router.push({ name: 'workOrderDetail', path: '/workOrderDetail', query: { workOrderId: row.id }})
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleCreate() {
      this.$router.push({ name: 'workOrderDetail', path: '/workOrderDetail', query: {}})
    },
    getList() {
      this.loading = true
      if (this.type === 'waitHandle') {
        getWaitHandleWorkOrderList(this.listQuery).then(response => {
          this.list = response.data.records
          this.loading = false
        }).catch(err => {
          console.error(err)
        })
      } else if (this.type === 'all') {
        getWorkOrderList(this.listQuery).then(response => {
          this.list = response.data.records
          this.loading = false
        }).catch(err => {
          console.error(err)
        })
      } else {
        getMyWorkOrderList(this.listQuery).then(response => {
          this.list = response.data.records
          this.loading = false
        }).catch(err => {
          console.error(err)
        })
      }
    }
  }
}
</script>

