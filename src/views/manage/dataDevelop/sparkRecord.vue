<template>
  <div class="manageMain runRecord">
    <div class="buttonArea" style="text-align: right">
      <el-button @click="getRZData()" size="mini">刷新</el-button>
    </div>
    <div class="searchArea">
      <div class="searchFormUnit">
        <p class="searchLabel">状态:</p>
        <div class="searchForm" style="width: 120px">
          <el-select v-model="queryForm.jobStatus" filterable placeholder="请选择" @change=";(queryForm.pageNum = 1), getRZData()">
            <el-option label="全部状态" :value="null"></el-option>
            <el-option label="已提交" value="已提交"></el-option>
            <el-option label="失败" value="失败"></el-option>
            <el-option label="成功" value="成功"></el-option>
          </el-select>
        </div>
        <p class="searchLabel" style="margin-left: 10px">操作人:</p>
        <div class="searchForm" style="width: 150px">
          <el-input v-model="queryForm.createBy" placeholder="请输入" @change=";(queryForm.pageNum = 1), getRZData()"> </el-input>
        </div>
      </div>
    </div>
    <div class="tableArea">
      <el-table v-loading="loadingRZ" element-loading-text="数据加载中" ref="table" :data="RZData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="jobId" label="jobId" min-width="160" align="left"> </el-table-column>
        <el-table-column prop="jobStatus" label="状态" min-width="120" align="left"> </el-table-column>
        <el-table-column prop="createBy" label="操作人" min-width="150" align="left"> </el-table-column>
        <el-table-column prop="createTime" label="时间" min-width="160" align="left"> </el-table-column>
        <el-table-column prop="querySql" label="执行sql" min-width="460" align="left" show-overflow-tooltip=""> </el-table-column>
      </el-table>
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
        jobStatus: null,
        createBy: '',

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
        url: '/spark_query_record/list',
        method: 'get',
        params: {
          page: that.queryForm.page,
          pageSize: that.queryForm.pageSize,
          jobStatus: that.queryForm.jobStatus,
          createBy: that.queryForm.createBy
        }
      }).then(res => {
        that.RZData = res.data || []
        that.queryForm.total = res.data.length || 0
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
