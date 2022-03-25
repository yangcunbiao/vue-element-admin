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
  </div>
</template>

<script>
import { getRecommendModel } from '@/api/model'

export default {
  data() {
    return {
      list: [],
      total: null,
      listLoading: false,
      communityId: null
    }
  },
  method: {
    getList() {
      this.listLoading = true
      getRecommendModel(this.communityId).then(response => {
        this.list = []
        for (var i = 0; i < response.data.length; i += 3) {
          this.list.push(response.data.slice(i, i + 3))
        }
        // this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>

<style>

</style>
