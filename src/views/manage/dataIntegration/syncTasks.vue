<template>
  <div class="manageMain syncTasks" style="flex-direction: row">
    <div style="width: 100%; height: 100%; border-right: 1px solid #e4e6eb; padding: 0 10px; display: flex; flex: 1; flex-direction: column">
      <div class="buttonArea">
        <el-button type="primary" icon="el-icon-plus" @click="newTask()" size="mini">新建传输任务</el-button>
        <div style="width: auto; height: 36px; line-height: 36px; float: right; margin-top: 12px">
          <el-tabs v-model="queryForm.publishOnline" @tab-click="publishOnlineClick" type="card">
            <el-tab-pane label="任务管理" name="任务管理"></el-tab-pane>
            <el-tab-pane label="线上任务" name="线上任务"></el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div class="searchArea" style="margin-top: 5px">
        <div class="searchFormUnit">
          <p class="searchLabel">数据来源类型:</p>
          <div class="searchForm" style="width: 100px">
            <el-select v-model="queryForm.sourceType" filterable placeholder="请选择" @change=";(queryForm.page = 1), getTaskData()">
              <el-option label="全部类型" :value="null"></el-option>
              <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
            </el-select>
          </div>
        </div>
        <div class="searchFormUnit">
          <p class="searchLabel">数据去向类型:</p>
          <div class="searchForm" style="width: 100px">
            <el-select v-model="queryForm.destType" filterable placeholder="请选择" @change=";(queryForm.page = 1), getTaskData()">
              <el-option label="全部类型" :value="null"></el-option>
              <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
            </el-select>
          </div>
        </div>
        <div class="searchFormUnit">
          <p class="searchLabel">负责人:</p>
          <div class="searchForm" style="width: 100px">
            <el-select v-model="queryForm.owner" filterable placeholder="请选择" @change=";(queryForm.page = 1), getTaskData()">
              <el-option v-for="(item, index) in userList" :key="index" :label="item.fullName" :value="item.fullName" />
            </el-select>
          </div>
        </div>
        <div class="searchFormUnit">
          <el-button
            type="text"
            size="small"
            @click="
              reset()
              getTaskData()
            "
            >重置</el-button
          >
        </div>
        <div class="searchFormUnit" style="width: auto; float: right; margin-right: 0">
          <el-button icon="el-icon-refresh" size="small" @click="getTaskData()"></el-button>
        </div>
        <div class="searchFormUnit" style="width: 300px; float: right; margin-right: 10px">
          <el-input v-model="queryForm.taskName" placeholder="请输入任务名称"> <el-button slot="append" icon="el-icon-search" @click=";(queryForm.pageNum = 1), getTaskData()"></el-button> </el-input>
        </div>
      </div>

      <div class="tableArea">
        <el-table v-loading="loadingTask" element-loading-text="数据加载中" ref="table" :data="taskData" height="100%">
          <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column prop="taskName" label="任务名称" min-width="200" align="left">
            <template slot-scope="scope">
              <div style="width: 100%; height: 100%; display: flex; align-items: center">
                <p style="max-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis" :title="scope.row.taskName">{{ scope.row.taskName }}</p>
                <i class="el-icon-document-copy" style="cursor: pointer; vertical-align: middle; margin-left: 3px" @click="copyText(scope.row.taskName)"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="taskRunLatestStatus" label="试运行状态" min-width="150" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.taskRunLatestStatus == '成功'" style="color: #67c23a">成功</span>
              <span v-else-if="scope.row.taskRunLatestStatus == '失败'" style="color: #f56c6c">失败</span>
              <span v-else-if="scope.row.taskRunLatestStatus == '部分成功'" style="color: #409eff">部分成功</span>
              <span v-else-if="scope.row.taskRunLatestStatus == '已提交'">已提交</span>
              <i class="el-icon-tickets" style="cursor: pointer; vertical-align: middle; margin-left: 3px" @click="showLog(scope.row.taskRunLatestId)"></i>
            </template>
          </el-table-column>
          <el-table-column prop="sourceType" label="数据来源类型" min-width="120" align="left"> </el-table-column>
          <el-table-column prop="sourceDataSourceName" label="来源信息" min-width="220" align="left" show-overflow-tooltip>
            <tempalte slot-scope="scope"> {{ scope.row.sourceDataSourceName }}.{{ scope.row.sourceTableName }} </tempalte>
          </el-table-column>
          <el-table-column prop="destType" label="数据去向类型" min-width="120" align="left"> </el-table-column>
          <el-table-column prop="destDataSourceName" label="去向信息" min-width="220" align="left" show-overflow-tooltip>
            <tempalte slot-scope="scope"> {{ scope.row.destDataSourceName }}.{{ scope.row.destTableName }} </tempalte>
          </el-table-column>
          <el-table-column prop="owner" label="负责人" min-width="100" align="left"> </el-table-column>
          <el-table-column v-if="queryForm.publishOnline == '任务管理'" prop="createTime" label="创建时间" min-width="180" align="left"> </el-table-column>
          <el-table-column v-if="queryForm.publishOnline == '线上任务'" prop="createTime" label="上次提交时间" min-width="180" align="left"> </el-table-column>
          <!-- <el-table-column prop="taskDesc" label="任务描述" min-width="380" align="left" show-overflow-tooltip> </el-table-column> -->
          <el-table-column label="操作" align="center" width="200" fixed="right">
            <template slot-scope="scope">
              <tempalte v-if="!scope.row.publishOnline">
                <p class="tableAction" @click="seeTask(scope.row)">修改</p>
                <p class="tableAction" @click="runTask(scope.row)">运行</p>
                <el-dropdown class="dropdownInTable" trigger="click">
                  <span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right"></i> </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <p class="tableAction tableActionInDropdown" @click="copyTask(scope.row)">复制</p>
                      <p class="tableActionDanger tableActionInDropdown" @click="cancelTask(scope.row)">删除</p>
                      <p class="tableAction tableActionInDropdown" @click="getTaskRunRecord(scope.row)">运行结果</p>
                      <p class="tableAction tableActionInDropdown" @click="publish(scope.row)">提交上线</p>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </tempalte>
              <tempalte v-if="scope.row.publishOnline">
                <p class="tableAction" @click="seeReference(scope.row)">引用详情</p>
                <p class="tableAction" @click="">调度记录</p>
                <p class="tableActionDanger" @click="unPublish(scope.row)">下线</p>
              </tempalte>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getTaskData"> </pagination>
      </div>
    </div>

    <el-dialog :title="titleTask" :visible.sync="dialogShowTask" class="fullScreenDialog fullScreenDialogAbsolute" width="100%">
      <syncTasksDialog v-if="dialogShowTask" :addOrModifyOrCopyTask="addOrModifyOrCopyTask" :taskRow="taskRow" @close="dialogShowTask = false" @getData="getTaskData"></syncTasksDialog>
    </el-dialog>
    <el-dialog title="运行结果" :visible.sync="dialogShowRunRecord" width="1200px">
      <el-table v-loading="loadingRunRecord" element-loading-text="数据加载中" style="margin: 10px auto" class="data-table" ref="tableRunRecord" :data="tableRunRecord" border height="600">
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
            <span v-else-if="scope.row.jobStatus == '已提交'">已提交</span>
            <p v-if="scope.row.jobStatus == '已提交'" class="tableActionDanger" @click="killJob(scope.row)">结束</p>
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
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="showLog(scope.row.jobId)">日志</p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="日志" :visible.sync="dialogShowLog" class="fullScreenDialog" width="100%">
      <div style="width: 100%; height: 100%; font-size: 14px; color: #525866; overflow: auto; line-height: 22px">
        <p style="white-space: pre; margin: 0; text-align: left" v-for="(item, index) in logs" :key="index" :style="item.includes('ERROR') ? 'color:#F56C6C;' : item.includes('WARN') ? 'color:#E6A23C;' : ''">{{ item }}</p>
      </div>
    </el-dialog>
    <el-dialog title="引用详情" :visible.sync="dialogShowReference" width="1000px">
      <div style="width: calc(100% - 40px); height: auto; margin: 20px auto">
        <div style="width: 100%; height: auto; overflow: hidden">
          <p style="color: #1d2129; font-size: 14px; height: 30px; line-height: 30px; margin: 0; width: 140px; float: left; text-align: right">数据同步任务名称：</p>
          <p style="color: #525866; font-size: 14px; height: 30px; line-height: 30px; margin: 0; float: right; width: calc(100% - 145px)">{{ referenceTaskName }}</p>
        </div>
        <div style="width: 100%; height: auto; overflow: hidden; margin-top: 30px">
          <p style="color: #1d2129; font-size: 14px; height: 30px; line-height: 30px; margin: 0; width: 140px; overflow: hidden; float: left; text-align: right">引用的任务：</p>
          <el-table v-loading="loadingReference" element-loading-text="数据加载中" ref="tableReference" :data="referenceData" border style="float: right; width: calc(100% - 145px)">
            <el-table-column prop="jobName" label="所属任务" min-width="200" align="left">
              <template slot-scope="scope">
                <div style="width: 100%; height: 100%; display: flex; align-items: left">
                  <p @click="gotoGroupJob(scope.row)" style="width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin: 0" class="tableLink" :title="scope.row.jobName">{{ scope.row.jobName }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="creator" label="创建人" min-width="120" align="left"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="120" align="left"> </el-table-column>
          </el-table>
        </div>
      </div>
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
      treePropsSJY: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      expandKeysSJY: ['all'],
      queryForm: {
        publishOnline: '任务管理',
        owner: '',
        taskName: '',
        sourceType: null,
        destType: null,
        pageSize: 20,
        page: 1,
        total: 0
      },
      userList: [],
      taskData: [],
      loadingTask: true,

      buttonLoad: false,

      dataTypeList: [],

      dialogShowTask: false,
      addOrModifyOrCopyTask: '',
      titleTask: '',
      taskRow: '',

      dialogShowRunRecord: false,
      tableRunRecord: [],
      loadingRunRecord: false,

      dialogShowLog: false,
      logData: [],
      logs: [],
      loadingLog: false,

      dialogShowReference: false,
      referenceData: [],
      loadingReference: false,
      referenceTaskName: ''
    }
  },
  mounted() {
    this.getUserList()
    this.getDataTypeList()
    this.getTaskData()
    window.onresize = () => {
      return (() => {
        setTimeout(() => {
          this.$refs.table.doLayout()
        }, 300)
      })()
    }
  },
  methods: {
    getUserList() {
      let that = this
      request({ url: '/admin/list', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.userList = res.data.list || []
      })
    },
    publishOnlineClick(tab, event) {
      let that = this
      that.queryForm.page = 1
      that.getTaskData()
    },
    // 获取数据源类型list
    getDataTypeList() {
      let that = this
      request({ url: '/data_source/type/dest/list', method: 'get', params: {} }).then(res => {
        that.dataTypeList = res.data
      })
    },
    reset() {
      let that = this
      that.queryForm.owner = ''
      that.queryForm.taskName = ''
      that.queryForm.sourceType = null
      that.queryForm.destType = null
    },
    // 获取传输数据
    getTaskData() {
      let that = this

      that.loadingTask = true
      request({ url: '/task_info/list', method: 'get', params: { owner: that.queryForm.owner, taskName: that.queryForm.taskName, publishOnline: that.queryForm.publishOnline == '线上任务', sourceType: that.queryForm.sourceType, destType: that.queryForm.destType, page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
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
      that.addOrModifyOrCopyTask = 'add'
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
      that.addOrModifyOrCopyTask = 'modify'
      that.taskRow = row
      that.dialogShowTask = true
    },
    copyTask(row) {
      let that = this
      that.titleTask = '复制任务'
      that.addOrModifyOrCopyTask = 'copy'
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
      that.taskRow = row
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
    // 获取日志
    showLog(jobId) {
      let that = this
      that.logData = ''
      that.dialogShowLog = true
      that.loadingLog = true
      that.$nextTick(() => {
        request({ url: '/task_info/sync_log', method: 'get', params: { jobId: jobId } }).then(res => {
          that.logData = res.data || ''
          that.logs = that.logData.logContent.split(/(?=\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3})/).filter(entry => entry.trim() !== '')
          that.loadingLog = false
        })
      })
    },
    // 结束进程
    killJob(row) {
      let that = this
      that
        .$confirm('是否确定结束该任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/task_info/kill_job', method: 'post', params: { deleteByLongldParam: row.id } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), that.getTaskRunRecord(that.taskRow))
          })
        })
        .catch(() => {})
    },
    // 引用详情
    seeReference(row) {
      let that = this
      that.referenceTaskName = row.taskName
      that.referenceData = []
      that.dialogShowReference = true
      that.loadingReference = true
      that.$nextTick(() => {
        request({ url: '/task_info/get_reference_details', method: 'get', params: { taskInfoId: row.id } }).then(res => {
          that.referenceData = res.data || []
          that.loadingReference = false
        })
      })
    },
    publish(row) {
      let that = this
      that
        .$confirm('是否确定提交上线[' + row.taskName + ']传输任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/task_info/publish_online_job', method: 'post', data: { id: row.id, publishOnline: true } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), that.getTaskData())
          })
        })
    },
    unPublish(row) {
      let that = this
      that
        .$confirm('是否确定下线[' + row.taskName + ']传输任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/task_info/publish_online_job', method: 'post', data: { id: row.id, publishOnline: false } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), that.getTaskData())
          })
        })
    },
    gotoGroupJob(row) {
      let that = this
      that.$router.push({ path: '/dataIntegration/groupJob', query: { activeJobId: row.id } })
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
