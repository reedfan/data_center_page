<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain dataSource">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 25px auto 0 auto; overflow: hidden">
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-search" @click=";(queryForm.pageNum = 1), getRZData()">查询</el-button>
        </div>
      </div>
    </div>
    <div class="main-unit" style="width: calc(100% - 48px); height: calc(100% - 85px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
      <el-table v-loading="loadingRZ" element-loading-text="数据加载中" class="data-table" ref="table" :data="RZData" stripe :height="this.$store.state.globalHeight - 285">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="id" label="ID" min-width="160" align="left"> </el-table-column>
        <el-table-column prop="errorMsg" label="日志信息" min-width="760" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createTime" label="时间" min-width="150" align="left"> </el-table-column>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="showRZDetail(scope.row)">详情</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getRZData"> </pagination>
    </div>
    <el-dialog :title="titleRZDetail" :visible.sync="dialogShowRZDetail" width="800px">
      <div style="width: 100%; height: auto; padding: 20px 0">
        <p style="font-size: 14px; color: #333333; line-height: 20px">{{ RZDetail }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'caseList',
  components: {
    pagination
  },
  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      buttonLoad: false,

      dataTypeList: [],
      queryForm: {
        pageSize: 10,
        page: 1,
        total: 0
      },
      RZData: [],
      loadingRZ: true,

      dialogShowRZDetail: false,
      titleRZDetail: '',
      RZDetail: ''
    }
  },
  mounted() {
    this.getRZData()
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
    // 获取数据源数据
    getRZData() {
      let that = this
      that.loadingRZ = true
      request({
        url: '/log_msg/list',
        method: 'get',
        params: {
          page: that.queryForm.page,
          pageSize: that.queryForm.pageSize
        }
      }).then(res => {
        that.RZData = res.data.list || []
        that.queryForm.total = res.data.total || 0
        that.loadingRZ = false
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 展示实例详情
    showRZDetail(row) {
      let that = this
      that.dialogShowRZDetail = true
      that.titleRZDetail = '日志详情    [' + row.id + ']'
      that.$nextTick(() => {
        that.RZDetail = row.errorMsg
      })
    },

    // 复制到剪切板
    copyText(text) {
      copyText(text)
    }
  }
}
</script>

<style scoped>
</style>
