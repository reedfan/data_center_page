<template>
  <div class="manageMain runRecord">
    <div class="buttonArea" style="text-align: right">
      <el-button @click="getRZData()" size="mini">刷新</el-button>
    </div>
    <div class="tableArea">
      <el-table v-loading="loadingRZ" element-loading-text="数据加载中" ref="table" :data="RZData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="operationName" label="操作类型" min-width="160" align="left"> </el-table-column>
        <el-table-column prop="updateBy" label="操作人" min-width="150" align="left"> </el-table-column>
        <el-table-column prop="updateTime" label="时间" min-width="150" align="left"> </el-table-column>
        <el-table-column prop="updateContent" label="日志信息" width="660" align="left">
          <template slot-scope="scope">
            <p style="width: 560px; float: left">{{ scope.row.updateContent }}</p>
            <p style="float: left" class="tableAction" @click="showRZDetail(scope.row)">详情</p>
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
  name: 'runRecord',
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
        pageSize: 20,
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
        url: '/update_record/list',
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
      that.titleRZDetail = '日志详情'
      that.$nextTick(() => {
        that.RZDetail = row.updateContent
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
