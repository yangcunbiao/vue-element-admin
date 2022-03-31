<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card" @tab-click="handleClick">
      <el-tab-pane key="all" v-permission="['admin']" label="全部工单" name="all">
        <tab-pane v-if="activeName=='all'" ref="all" type="all" />
      </el-tab-pane>
      <el-tab-pane key="waitHandle" label="待处理工单" name="waitHandle">
        <tab-pane v-if="activeName=='waitHandle'" ref="waitHandle" type="waitHandle" />
      </el-tab-pane>
      <el-tab-pane key="myWorkOrder" label="我的工单" name="myWorkOrder">
        <tab-pane v-if="activeName=='myWorkOrder'" ref="myWorkOrder" v-permission="['pro']" type="myWorkOrder" />
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
    handleClick(tab, event) {
      // console.log(this.$refs)
      // console.log(this.$refs[this.activeName])
      // console.log(tab.$children[0])
      // tab.$children[0].getList()
      // this.$refs[this.activeName].getList()
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
