<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="社区名字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <!-- <router-link
        tag="a"
        target="_blank"
        :push="{ name: 'workOrderDetail', path:'/workOrderDetail', query: {} }"
      >
      </router-link> -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <!-- </router-link> -->
    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
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
  </div>
</template>

<script>
import { getWorkOrderList, getWaitHandleWorkOrderList, getMyWorkOrderList } from '@/api/work-order'

export default {
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
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        type: null
      },
      loading: false
    }
  },
  watch: {
    type() {
      this.getList()
    }
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

