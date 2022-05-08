<template>
  <div class="app-container">
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" :page-sizes="[6, 9,12,15]" @pagination="getList" />
  </div>
</template>

<script>
import { getModelList } from '@/api/model'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  directives: { waves },
  components: { Pagination },
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
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getModelList({ id: this.communityId, pageNum: this.listQuery.pageNum, pageSize: this.listQuery.pageSize }).then(response => {
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
