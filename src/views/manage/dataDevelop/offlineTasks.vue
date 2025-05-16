<template>
  <div class="manageMain syncTasks">
    <div class="buttonArea">
      <el-button type="primary" icon="el-icon-plus" @click="newTask()" size="mini">新建离线任务</el-button>
    </div>

    <div class="tableArea">
      <el-table v-loading="loadingTask" element-loading-text="数据加载中" ref="table" :data="taskData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="taskName" label="任务名称" min-width="300" align="left">
          <template slot-scope="scope">
            <div style="width: 100%; height: 100%; display: flex; align-items: center">
              <p style="max-width: 320px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis" :title="scope.row.taskName">{{ scope.row.taskName }}</p>
              <i class="el-icon-document-copy" style="cursor: pointer; vertical-align: middle; margin-left: 3px" @click="copyText(scope.row.taskName)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="taskDesc" label="任务描述" min-width="480" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createBy" label="创建人" min-width="180" align="left"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" align="left"> </el-table-column>

        <el-table-column label="操作" align="center" width="220" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="runTask(scope.row)">运行</p>
            <p class="tableAction" @click="getTaskRunRecord(scope.row)">运行结果</p>
            <el-dropdown class="dropdownInTable" trigger="click">
              <span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right"></i> </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <p class="tableAction tableActionInDropdown" @click="seeTask(scope.row)">修改</p>
                  <p class="tableActionDanger tableActionInDropdown" @click="cancelTask(scope.row)">删除</p>
                  <p class="tableAction tableActionInDropdown" @click="seeReference(scope.row)">引用详情</p>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getTaskData"> </pagination>
    </div>

    <el-dialog :title="titleTask" :visible.sync="dialogShowTask" width="900px">
      <offlineTasksDialog v-if="dialogShowTask" :addOrModifyTask="addOrModifyTask" :taskRow="taskRow" @close="dialogShowTask = false" @getData="getTaskData"></offlineTasksDialog>
      <!-- <div style="width: 100%; height: auto; overflow: hidden auto; background: #ffffff; position: relative">
        <el-form :model="formTask" ref="formTask" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: hidden auto; width: 98%; margin: 20px auto; padding: 0 30px 0 10px">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="项目组：" :required="true" prop="projectGroupId">
                <el-select v-model="formTask.projectGroupId" filterable placeholder="请选择项目组">
                  <el-option v-for="(item, index) in projectGroupList" v-bind:key="index" :label="item.projectGroupName" :value="item.projectGroupId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="数据源：" :required="true" prop="dataSourceId">
                <el-select v-model="formTask.dataSourceId" filterable placeholder="请选择数据源">
                  <el-option v-for="(item, index) in dataSourceList" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="任务名称：" :required="true" prop="taskName">
                <el-input v-model.trim="formTask.taskName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="描述：" prop="taskDesc">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 100 }" v-model.trim="formTask.taskDesc" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24" style="">
              <p style="width: calc(100% - 120px); margin-left: 120px; margin-top: 0; text-align: right; text-indent: 10px; line-height: 30px; height: 30px; background: #f4f4f5; color: #909399; border-radius: 4px">
                sql中的动态日期需使用以下格式(点击选择展开选项)：
                <el-popover placement="top" width="360" v-model="editPartitionShow" style="margin-right: 20px">
                  <el-form :model="formPartition" ref="formPartition" :rules="rules" label-width="120px" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
                    <el-form-item label="时间：" :required="true" prop="dynamicsStr1">
                      <el-select v-model="formPartition.dynamicsStr1" filterable placeholder="" clearable="">
                        <el-option value="$start$1_days_before_" label="1.days.ago"></el-option>
                        <el-option value="$start$2_days_before_" label="2.days.ago"></el-option>
                        <el-option value="$start$3_days_before_" label="3.days.ago"></el-option>
                        <el-option value="$start$5_days_before_" label="5.days.ago"></el-option>
                        <el-option value="$start$7_days_before_" label="7.days.ago"></el-option>
                        <el-option value="$start$10_days_before_" label="10.days.ago"></el-option>
                        <el-option value="$start$30_days_before_" label="30.days.ago"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="时间格式：" :required="true" prop="dynamicsStr2">
                      <el-select v-model="formPartition.dynamicsStr2" filterable placeholder="" clearable="">
                        <el-option value="yyyyMMdd$end$" label="yyyyMMdd"></el-option>
                        <el-option value="yyyy-MM-dd$end$" label="yyyy-MM-dd"></el-option>
                        <el-option value="yyyy:MM:dd$end$" label="yyyy:MM:dd"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="editPartitionShow = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="editPartition()">确定</el-button>
                  </div>
                  <el-button type="text" style="padding: 0" slot="reference">选择</el-button>
                </el-popover>
              </p>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="sql：" prop="sqlInfo">
                <div id="code-editor" ref="code-editor" style="height: 250px; width: 100%; margin-top: 10px; border: 1px solid #dcdfe6; box-sizing: border-box"></div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 100px" size="mini" @click="dialogShowTask = false">取消</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="addOrModifyTask" :disabled="buttonLoad" :loading="buttonLoad" @click="addTask()">保存</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="!addOrModifyTask" :disabled="buttonLoad" :loading="buttonLoad" @click="updateTask()">修改</el-button>
      </div> -->
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
        <el-table-column prop="timeCost" label="所用时间(s)" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="jobStatus" label="状态" align="center" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.jobStatus == '成功'" style="color: #67c23a">成功</span>
            <span v-else-if="scope.row.jobStatus == '失败'" style="color: #f56c6c">失败</span>
            <span v-else-if="scope.row.jobStatus == '部分成功'" style="color: #409eff">部分成功</span>
            <span v-else-if="scope.row.jobStatus == '已提交'" style="color: #409eff">已提交</span>
            <span v-else>{{ scope.row.jobStatus }}</span>
            <i class="el-icon-close" v-if="scope.row.jobStatus == '已提交'" style="color: #f56c6c; cursor: pointer" @click="killSparkJob(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="seeLog(scope.row)">日志</p>
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
        <!-- <el-table-column prop="totalReadRecords" label="读取总条数" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="readFaildRecords" label="读取失败条数" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="writeFailedRecords" label="写入失败的条数" min-width="120" align="center"> </el-table-column> -->
      </el-table>
    </el-dialog>
    <el-dialog title="引用详情" :visible.sync="dialogShowReference" width="1000px">
      <div style="width: calc(100% - 40px); height: auto; margin: 20px auto">
        <div style="width: 100%; height: auto; overflow: hidden">
          <p style="color: #1d2129; font-size: 14px; height: 30px; line-height: 30px; margin: 0; width: 120px; float: left; text-align: right">离线任务名称：</p>
          <p style="color: #525866; font-size: 14px; height: 30px; line-height: 30px; margin: 0; float: right; width: calc(100% - 125px)">{{ referenceTaskName }}</p>
        </div>
        <div style="width: 100%; height: auto; overflow: hidden; margin-top: 30px">
          <p style="color: #1d2129; font-size: 14px; height: 30px; line-height: 30px; margin: 0; width: 120px; overflow: hidden; float: left; text-align: right">引用的任务：</p>
          <el-table v-loading="loadingReference" element-loading-text="数据加载中" ref="tableReference" :data="referenceData" border style="float: right; width: calc(100% - 125px)">
            <el-table-column prop="jobName" label="所属任务" min-width="200" align="center">
              <template slot-scope="scope">
                <div style="width: 100%; height: 100%; display: flex; align-items: left">
                  <p @click="gotoGroupJob(scope.row)" style="width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin: 0" class="tableLink" :title="scope.row.jobName">{{ scope.row.jobName }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="creator" label="创建人" min-width="120" align="center"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="120" align="center"> </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="日志" :visible.sync="dialogShowLog" width="1200px">
      <div style="width: 100%; height: 400px; overflow: auto" v-loading="loadingLog">
        <p style="width: 100%; height: auto; white-space: break-spaces; font-size: 14px; line-height: 20px">{{ logData }}</p>
        <el-empty v-if="logData == ''" description="暂无日志"></el-empty>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
import offlineTasksDialog from './components/offlineTasksDialog.vue'

export default {
  name: 'offlineTasks',
  components: {
    pagination,
    offlineTasksDialog
  },
  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      queryForm: {
        pageSize: 20,
        page: 1,
        total: 0
      },
      taskData: [],
      loadingTask: true,
      dialogShowTask: false,
      buttonLoad: false,
      taskRow: '',
      titleTask: '',
      dialogShowRunRecord: false,
      tableRunRecord: [],
      loadingRunRecord: false,

      dialogShowReference: false,
      referenceData: [],
      loadingReference: false,
      referenceTaskName: '',

      dialogShowLog: false,
      loadingLog: false,
      logData: ''
    }
  },
  mounted() {
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
    // 获取数据源数据
    getTaskData() {
      let that = this
      that.loadingTask = true
      request({ url: '/sql_task_info/list', method: 'get', params: { page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
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
      this.$confirm('是否确定运行[' + row.taskName + ']SQL任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request({ url: '/sql_task_info/run', method: 'post', data: { id: row.id } }).then(res => {
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
          request({ url: '/sql_task_info/delete', method: 'post', data: { id: row.id } }).then(res => {
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
        request({ url: '/spark_query_record/get_by_task_id', method: 'get', params: { id: row.id } }).then(res => {
          that.tableRunRecord = res.data || []
          that.loadingRunRecord = false
          setTimeout(() => {
            that.$refs.tableRunRecord.doLayout()
          }, 300)
        })
      })
    },
    killSparkJob(row) {
      let that = this
      that
        .$confirm('是否确定结束该进程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/spark_query_record/kill', method: 'post', data: { jobId: row.jobId } }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getTaskRunRecord(that.taskRow)
          })
        })
        .catch(() => {})
    },
    seeLog(row) {
      let that = this
      that.logData = ''
      that.dialogShowLog = true
      that.loadingLog = true
      that.$nextTick(() => {
        request({ url: '/spark_query_record/get_job_log', method: 'get', params: { id: row.jobId } }).then(res => {
          that.logData = res.data || ''
          that.loadingLog = false
        })
      })
    },
    // 引用详情
    seeReference(row) {
      let that = this
      that.referenceTaskName = row.taskName
      that.referenceData = []
      that.dialogShowReference = true
      that.loadingReference = true
      that.$nextTick(() => {
        request({ url: '/sql_task_info/get_reference_details', method: 'get', params: { sqlTaskInfoId: row.id } }).then(res => {
          that.referenceData = res.data || []
          that.loadingReference = false
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
