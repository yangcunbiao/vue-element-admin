<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key" @tab-click="handleClick">
        <keep-alive>
          <tab-pane v-if="activeName==item.key" ref="tabPane" :type="item.key" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from './components/TabPane'

export default {
  name: 'Tab',
  components: { TabPane },
  data() {
    return {
      tabMapOptions: [
        { label: '全部工单', key: 'all' },
        { label: '待处理工单', key: 'waitHandle' },
        { label: '我的工单', key: 'myWorkOrder' }
      ],
      activeName: 'waitHandle'
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    handleClick(val) {
      console.log(val)
      val.getList()
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
