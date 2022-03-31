<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="communityId" placeholder="社区" style="width: 200px;" class="filter-item" value-key="name">
        <el-option v-for="item in communityOptions" :key="item.id" :label="item.name" :value="item.id" style="width: 400px">
          <span style="float: left;">{{ item.name }}</span>
          <span style="float: right;color:#ccc;">{{ item.province }}/{{ item.city }}/{{ item.district }}</span>
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="getCommunityOptions">
        刷新
      </el-button>
      <el-button v-if="listQuery.pageNum === 1" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        推荐器材
      </el-button>
      <el-button v-else v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        换一批
      </el-button>
    </div>
    <el-row v-for="item in list" :key="item">
      <el-col v-for="(o, index) in item" :key="o" :span="6" :offset="index > 0 ? 3 : 0">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="o.picture" class="image">
          <div style="padding: 14px;">
            <span>{{ o.name }}</span>
            <div class="bottom clearfix">
              <el-row>
                <label>型号：</label><span>{{ o.modelNumber }}</span>
              </el-row>
              <el-row>
                <label>规格：</label><span>{{ o.length }}cm*{{ o.wide }}cm*{{ o.high }}cm</span></el-row>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRecommendModel } from '@/api/model'
import { getCommunityList } from '@/api/community'
import waves from '@/directive/waves'

export default {
  directives: { waves },
  data() {
    return {
      list: [],
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 6
      },
      listLoading: false,
      communityId: null,
      communityOptions: []
    }
  },
  created() {
    this.getCommunityOptions()
  },
  methods: {
    handleNextPage() {
      if (this.listQuery.pageSize * this.listQuery.pageNum < this.total) {
        this.listQuery.pageNum = this.listQuery.pageNum + 1
      } else {
        this.$notify({
          title: '错误',
          message: '已经没有器材了',
          type: 'error',
          duration: 2000
        })
      }
    },
    getCommunityOptions() {
      getCommunityList({ userId: this.$store.getters.id }).then(response => {
        const community = response.data.records[0]
        if (community !== null) {
          this.communityOptions = []
          this.communityOptions.push(community)
          this.communityId = community.id
        }
      })
      this.listQuery.pageNum = 1
    },
    getList() {
      this.listLoading = true
      getRecommendModel({ id: this.communityId, pageNum: this.listQuery.pageNum, pageSize: this.listQuery.pageSize }).then(response => {
        this.list = []
        this.total = response.data.total
        for (var i = 0; i < response.data.records.length; i += 3) {
          this.list.push(response.data.records.slice(i, i + 3))
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    }
  }
}
</script>

<style>

</style>
