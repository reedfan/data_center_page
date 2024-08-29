<template>
  <div class="manageMain dataSource">
    <div class="searchArea">
      <div class="searchFormUnit">
        <p class="searchLabel">运行日期:</p>
        <div class="searchForm" style="width: 150px">
          <el-date-picker v-model="queryForm.runDt" type="date" placeholder="选择日期" value-format="yyyyMMdd" format="yyyy-MM-dd" @change=";(queryForm.pageNum = 1), getSLData()"> </el-date-picker>
        </div>
      </div>
      <div class="searchFormUnit">
        <p class="searchLabel">状态:</p>
        <div class="searchForm" style="width: 280px">
          <el-select v-model="queryForm.jobStatusList" filterable placeholder="请选择" multiple="" @change=";(queryForm.pageNum = 1), getSLData()">
            <el-option label="成功" value="成功"></el-option>
            <el-option label="部分成功" value="部分成功"></el-option>
            <el-option label="失败" value="失败"></el-option>
          </el-select>
        </div>
      </div>
      <div class="searchFormUnit" style="width: 200px; float: right; margin-right: 0">
        <el-input v-model="queryForm.jobName" placeholder="请输入任务名称"> <el-button slot="append" icon="el-icon-search" @click=";(queryForm.pageNum = 1), getSJYData()"></el-button> </el-input>
      </div>
      <div class="searchFormUnit" style="width: 150px; float: right; margin-right: 0">
        <el-input v-model="queryForm.taskName" placeholder="请输入实例名称"> </el-input>
      </div>
    </div>

    <div class="tableArea">
      <el-table v-loading="loadingSL" element-loading-text="数据加载中" ref="table" :data="SLData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="jobName" label="任务名称" min-width="180" align="left">
          <!-- <template slot-scope="scope">
            <div style="width: 100%; height: 100%; display: flex; align-items: center">
              <p @click="" style="max-width: 100px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis" class="tableAction" :title="scope.row.jobName">{{ scope.row.jobName || '-' }}</p>
              <i v-if="scope.row.jobName" class="el-icon-document-copy" style="cursor: pointer; vertical-align: middle" @click="copyText(scope.row.jobName)"></i>
            </div>
          </template> -->
        </el-table-column>
        <el-table-column prop="jobKey" label="jobKey" min-width="180" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="width: 100%; height: 100%; display: flex; align-items: center">
              <p style="max-width: 180px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis" :title="scope.row.jobKey">{{ scope.row.jobKey || '-' }}</p>
              <i v-if="scope.row.jobKey" class="el-icon-document-copy" style="cursor: pointer; vertical-align: middle" @click="copyText(scope.row.jobKey)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="实例名称" min-width="180" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="jobStatus" label="实例状态" min-width="100" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.jobStatus == '成功'" style="color: #67c23a">成功</span>
            <span v-else-if="scope.row.jobStatus == '失败'" style="color: #f56c6c">失败</span>
            <span v-else-if="scope.row.jobStatus == '部分成功'" style="color: #409eff">部分成功</span>
            <span v-else>{{ scope.row.jobStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalReadRecords" label="读取总条数" min-width="120" align="left"> </el-table-column>
        <el-table-column prop="readFaildRecords" label="读取失败条数" min-width="120" align="left"> </el-table-column>
        <el-table-column prop="writeFailedRecords" label="写入失败的条数" min-width="120" align="left"> </el-table-column>
        <el-table-column prop="timeCost" label="执行时长" min-width="80" align="left"> </el-table-column>
        <!-- <el-table-column prop="createTime" label="创建时间" min-width="150" align="center"> </el-table-column> -->
        <el-table-column prop="startTimeStamp" label="开始时间-结束时间" min-width="280" align="left">
          <template slot-scope="scope">
            {{ (scope.row.startTimeStamp || '-') + '  至  ' + (scope.row.endTimeStamp || '-') }}
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getSLData"> </pagination>
    </div>
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
        jobId: null,
        jobName: null,
        jobKey: null,
        jobStatusList: [],
        runDt: null,
        taskId: null,
        taskName: null,
        pageSize: 20,
        page: 1,
        total: 0
      },
      SLData: [],
      loadingSL: true
    }
  },
  mounted() {
    this.getSLData()
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
    getSLData() {
      let that = this
      that.loadingSL = true
      request({
        url: '/task_run_record/list',
        method: 'post',
        data: {
          jobName: that.queryForm.jobName || null,
          taskId: that.queryForm.taskId,
          jobId: that.queryForm.jobId,
          jobKey: that.queryForm.jobKey || null,
          jobStatusList: that.queryForm.jobStatusList,
          runDt: that.queryForm.runDt,
          taskName: that.queryForm.taskName || null,
          page: that.queryForm.page,
          pageSize: that.queryForm.pageSize
        }
      }).then(res => {
        that.SLData = res.data.list || []
        that.queryForm.total = res.data.total || 0
        that.loadingSL = false
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
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
