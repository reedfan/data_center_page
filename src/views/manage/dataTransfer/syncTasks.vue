<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain syncTasks">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <p class="searchLabel" style="width: auto">数据来源类型:</p>
        <div style="width: 13%; height: 42px; float: left; margin: 0 1%">
          <el-select v-model="queryForm.sourceType" filterable placeholder="请选择" @change=";(queryForm.page = 1), getTaskData()">
            <el-option label="全部类型" :value="null"></el-option>
            <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <p class="searchLabel" style="width: auto">数据去向类型:</p>
        <div style="width: 13%; height: 42px; float: left; margin: 0 1%">
          <el-select v-model="queryForm.destType" filterable placeholder="请选择" @change=";(queryForm.page = 1), getTaskData()">
            <el-option label="全部类型" :value="null"></el-option>
            <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-search" @click="getTaskData()">查询</el-button>
        </div>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-plus" @click="newTask()">新建传输任务</el-button>
        </div>
      </div>
    </div>
    <div style="width: calc(100% - 48px); height: calc(100% - 95px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
      <div style="width: 100%; height: 100%" class="main-unit">
        <el-table v-loading="loadingTask" element-loading-text="数据加载中" class="data-table" ref="table" :data="taskData" stripe :height="this.$store.state.globalHeight - 285">
          <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column prop="taskName" label="任务名称" min-width="200" align="left">
            <template slot-scope="scope">
              <div style="width: 100%; height: 100%; display: flex; align-items: center">
                <p style="max-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis" :title="scope.row.taskName">{{ scope.row.taskName }}</p>
                <i class="el-icon-document-copy" style="cursor: pointer; vertical-align: middle; margin-left: 3px" @click="copyText(scope.row.taskName)"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="taskDesc" label="任务描述" min-width="380" align="left" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="owner" label="负责人" min-width="180" align="left"> </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180" align="left"> </el-table-column>

          <el-table-column label="操作" align="center" width="350" fixed="right">
            <template slot-scope="scope">
              <p class="tableAction" @click="runTask(scope.row)">运行</p>
              <p class="tableAction" @click="getTaskRunRecord(scope.row)">运行结果</p>
              <p class="tableAction" @click="seeTask(scope.row)">修改</p>
              <p class="tableActionDanger" @click="cancelTask(scope.row)">删除</p>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pageSize="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getTaskData"> </pagination>
      </div>
    </div>

    <el-dialog :title="titleTask" :visible.sync="dialogShowTask" class="fullScreenDialog" width="100%">
      <syncTasksDialog v-if="dialogShowTask" :addOrModifyTask="addOrModifyTask" :taskRow="taskRow" @close="dialogShowTask = false" @getData="getTaskData"></syncTasksDialog>
    </el-dialog>
    <el-dialog title="运行结果" :visible.sync="dialogShowRunRecord" width="1200px">
      <el-table v-loading="loadingRunRecord" element-loading-text="数据加载中" style="margin: 10px auto" class="data-table" ref="tableRunRecord" :data="tableRunRecord" border stripe height="600">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <!-- <el-table-column prop="jobName" label="任务名称" align="left" min-width="180">
          <template slot-scope="scope">
            <div style="width: 100%; height: 100%; display: flex; align-items: center">
              <p style="max-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis" :title="scope.row.jobName">{{ scope.row.jobName }}</p>
              <i class="el-icon-document-copy" style="cursor: pointer; vertical-align: middle; margin-left: 3px" title="复制jobKey" @click="copyText(scope.row.jobKey)"></i>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="createTime" label="运行时间" min-width="180" align="center"> </el-table-column>
        <el-table-column prop="timeCost" label="所用时间" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="jobStatus" label="状态" align="center" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.jobStatus == '成功'" style="color: #67c23a">成功</span>
            <span v-else-if="scope.row.jobStatus == '失败'" style="color: #f56c6c">失败</span>
            <span v-else-if="scope.row.jobStatus == '部分成功'" style="color: #409eff">部分成功</span>
            <span v-else>{{ scope.row.jobStatus }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" min-width="210" label="读取">
          <el-table-column prop="readSucceedRecords" label="成功" min-width="70" align="center">
            <template slot-scope="scope">
              <span style="color: #67c23a">{{ scope.row.readSucceedRecords }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="readFaildRecords" label="失败" min-width="70" align="center">
            <template slot-scope="scope">
              <span style="color: #f56c6c">{{ scope.row.readFaildRecords }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalReadRecords" label="总计" min-width="70" align="center"> </el-table-column>
        </el-table-column>
        <el-table-column align="center" min-width="210" label="覆写">
          <el-table-column prop="writeSucceedRecords" label="成功 " min-width="70" align="center">
            <template slot-scope="scope">
              <span style="color: #67c23a">{{ scope.row.writeSucceedRecords }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="writeFailedRecords" label="失败" min-width="70" align="center">
            <template slot-scope="scope">
              <span style="color: #f56c6c">{{ scope.row.writeFailedRecords }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="writeReceivedRecords" label="总计" min-width="70" align="center"> </el-table-column>
        </el-table-column> -->
        <el-table-column prop="totalReadRecords" label="读取总条数" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="readFaildRecords" label="读取失败条数" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="writeFailedRecords" label="写入失败的条数" min-width="120" align="center"> </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText, dateFormat } from '@/api/common'
import request from '@/api/request'
import syncTasksDialog from './components/syncTasksDialog.vue'
export default {
  name: 'syncTasks',
  components: {
    pagination,
    syncTasksDialog
  },
  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      queryForm: {
        sourceType: null,
        destType: null,
        pageSize: 10,
        page: 1,
        total: 0
      },
      taskData: [],
      loadingTask: true,

      buttonLoad: false,

      dataTypeList: [],

      dialogShowTask: false,
      addOrModifyTask: true,
      titleTask: '',
      taskRow: '',

      dialogShowRunRecord: false,
      tableRunRecord: [],
      loadingRunRecord: false
    }
  },
  mounted() {
    this.getDataTypeList()
    this.getTaskData()
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
    // 获取数据源类型list
    getDataTypeList() {
      let that = this
      request({ url: '/data_source/type/dest/list', method: 'get', params: {} }).then(res => {
        that.dataTypeList = res.data
      })
    },

    // 获取传输数据
    getTaskData() {
      let that = this
      that.loadingTask = true
      request({ url: '/task_info/list', method: 'get', params: { sourceType: that.queryForm.sourceType, destType: that.queryForm.destType, page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.taskData = res.data.list || []
        that.queryForm.total = res.data.total || 0
        that.loadingTask = false
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 新建任务-打开任务新建表单
    newTask() {
      let that = this
      that.titleTask = '新建任务'
      that.addOrModifyTask = true
      that.taskRow = {}
      that.dialogShowTask = true
    },

    // 运行传输任务
    runTask(row) {
      let that = this
      this.$confirm('是否确定运行[' + row.taskName + ']传输任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request({ url: '/task_info/sync_test', method: 'get', params: { taskInfoId: row.id } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理中'), that.getTaskData())
          })
        })
        .catch(() => {})
    },
    // 查看任务
    seeTask(row) {
      let that = this
      that.titleTask = '修改任务[' + row.taskName + ']'
      that.addOrModifyTask = false
      that.taskRow = row
      that.dialogShowTask = true
    },

    // 删除传输任务
    cancelTask(row) {
      let that = this
      that
        .$confirm('是否确定删除[' + row.taskName + ']传输任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/task_info/delete', method: 'post', data: { id: row.id } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), that.getTaskData())
          })
        })
        .catch(() => {})
    },
    // 获取运行结果
    getTaskRunRecord(row) {
      let that = this
      that.tableRunRecord = []
      that.dialogShowRunRecord = true
      that.loadingRunRecord = true
      that.$nextTick(() => {
        request({ url: '/task_run_record/list', method: 'post', data: { taskId: row.id, jobId: null, jobKey: null, jobName: null, page: 1, pageSize: 10, runDt: null, jobStatusList: [] } }).then(res => {
          that.tableRunRecord = res.data.list || []
          that.loadingRunRecord = false
          setTimeout(() => {
            that.$refs.tableRunRecord.doLayout()
          }, 300)
        })
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
