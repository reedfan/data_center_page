<template>
  <div class="manageMain desensitizationRule">
    <div class="tableArea" style="margin-top: 10px">
      <el-table v-loading="loadingTMGZ" element-loading-text="数据加载中" ref="table" :data="TMGZData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="desensitizationName" label="规则名称" min-width="250" align="left"> </el-table-column>
        <el-table-column prop="desensitizationType" label="规则类型" min-width="130" align="left"> </el-table-column>
        <el-table-column prop="desensitizationDesc" label="描述" min-width="250" align="left"> </el-table-column>
        <el-table-column prop="createBy" label="操作人" min-width="130" align="left"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" align="left"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'dataSource',

  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      TMGZData: []
    }
  },
  mounted() {
    this.getTMGZData()
    window.onresize = () => {
      return (() => {
        this.$store.state.globalHeight = document.documentElement.clientHeight
        setTimeout(() => {
          this.$refs.table.doLayout()
        }, 300)
      })()
    }
  },
  methods: {
    // 获取权限数据
    getTMGZData() {
      let that = this
      that.loadingTMGZ = true
      request({ url: '/desensitization_info/list', method: 'get', params: {} }).then(res => {
        that.TMGZData = res.data || []
        that.loadingTMGZ = false
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    }
  }
}
</script>

<style scoped>
</style>
