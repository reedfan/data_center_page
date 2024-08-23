<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain dataSource">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-search" @click=";(queryForm.pageNum = 1), getTMGZData()">查询</el-button>
        </div>
      </div>
    </div>
    <div class="main-unit" style="width: calc(100% - 48px); height: calc(100% - 95px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
      <el-table v-loading="loadingTMGZ" element-loading-text="数据加载中" class="data-table" ref="table" :data="TMGZData" stripe :height="this.$store.state.globalHeight - 315">
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
