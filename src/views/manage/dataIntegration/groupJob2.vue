<template>
  <div class="manageMain groupJob">
    <div class="buttonArea">
      <el-tabs v-model="activeGroupId" @tab-click="handleTabClick" class="groupJobTopTabs">
        <el-tab-pane :key="index" v-for="(item, index) in groupList" :label="item.groupName" :name="item.id + ''">
          <span slot="label">{{ item.groupName }}<i v-if="activeGroupId == item.id" class="el-icon-edit-outline" style="margin-left: 8px" @click="seeGroup()"></i> </span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="buttonArea">
      <el-button icon="el-icon-plus" type="primary" @click="newJob()" size="mini">新增任务</el-button>
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="newGroup()">新建分组</el-button>
    </div>
    <div class="searchArea">
      <div class="searchFormUnit">
        <p class="searchLabel">状态:</p>
        <div class="searchForm" style="width: 100px">
          <el-select v-model="queryForm.status" filterable placeholder="请选择" @change=";(queryForm.pageNum = 1), getDataJob()">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="已发布" value="EFFECTIVE"></el-option>
            <el-option label="未发布" value="NOT_EFFECTIVE"></el-option>
          </el-select>
        </div>
      </div>
    </div>

    <div class="tableArea">
      <el-table v-loading="loadingJob" element-loading-text="数据加载中" ref="table" :data="tableJob" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="jobName" label="任务名称" min-width="100" align="left"> </el-table-column>
        <el-table-column prop="cronExpression" label="表达式" min-width="100" align="left"> </el-table-column>
        <el-table-column label="任务配置" min-width="180" align="left" show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            <template>{{ tranJobTaskInfo(scope.row.jobTaskInfo) }}</template>
          </template> -->
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">已发布</span>
            <span v-if="scope.row.status == 0">未发布</span>
          </template>
        </el-table-column>
        <el-table-column prop="jobDescription" label="描述" min-width="200" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="260" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="publishJob(scope.row)" v-if="scope.row.status == 0">发布</p>
            <p class="tableAction" @click="unPublishJob(scope.row)" v-if="scope.row.status == 1">取消发布</p>
            <p class="tableAction" @click="seeJob(scope.row)">修改</p>
            <p class="tableAction" @click="seeJobConfig(scope.row)">配置</p>
            <p class="tableActionDanger" @click="cancelJob(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.pageNum" :total="queryForm.total" :getTableData="getDataJob"> </pagination>
    </div>

    <el-dialog :title="titleGroup" :visible.sync="formShowGroup" width="550px">
      <el-form :model="formGroup" ref="formGroup" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="项目组：" :required="true" prop="projectGroupId">
                <el-select v-model="formGroup.projectGroupId" filterable placeholder="">
                  <el-option v-for="(item, index) in projectGroupList" v-bind:key="index" :label="item.projectGroupName" :value="item.projectGroupId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="分组名称：" :required="true" prop="groupName">
                <el-input v-model.trim="formGroup.groupName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述：" :required="true" prop="groupDesc">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model.trim="formGroup.groupDesc" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShowGroup = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button @click="cancelGroup()" style="width: 100px" size="mini" v-if="!addOrModifyGroup" type="danger">删 除</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="addOrModifyGroup" @click="addGroup()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="!addOrModifyGroup" @click="modifyGroup()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleJob" :visible.sync="formShowJob" width="550px">
      <el-form :model="formJob" ref="formJob" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="项目组：" :required="true" prop="projectGroupId">
                <el-select v-model="formJob.projectGroupId" filterable placeholder="">
                  <el-option v-for="(item, index) in projectGroupList" v-bind:key="index" :label="item.projectGroupName" :value="item.projectGroupId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务名称：" :required="true" prop="jobName">
                <el-input v-model.trim="formJob.jobName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属分组：" :required="true" prop="jobGroupId">
                <el-select v-model="formJob.jobGroupId" filterable placeholder="">
                  <el-option v-for="(item, index) in groupList" v-bind:key="index" :label="item.groupName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="cron表达式：" :required="true" prop="cronExpression">
                <el-input v-model.trim="formJob.cronExpression" autocomplete="off"> <el-button slot="append" icon="el-icon-edit-outline" @click=";(cronExpression = formJob.cronExpression), (showCron = true)"></el-button></el-input>
              </el-form-item>
              <el-dialog title="cron表达式配置" :visible.sync="showCron">
                <vcrontab @hide="showCron = false" @fill="cronFill" :expression="cronExpression" style="margin-top: 10px" class="vcrontab"></vcrontab>
              </el-dialog>
            </el-col>
            <el-col :span="24" v-if="false">
              <el-form-item label="任务配置：" prop="jobTaskInfoList">
                <el-button style="width: 100%" @click=";(jobTaskInfoList = JSON.parse(JSON.stringify(formJob.jobTaskInfoList.jobTaskInfoList))), (showTaskConfig = true)">配 置</el-button>
              </el-form-item>
            </el-col>

            <el-dialog title="绑定任务配置" :visible.sync="showTaskConfig" width="800px">
              <div style="width: 100%; min-height: 200px; height: auto; text-align: center; max-height: 540px; overflow: hidden auto; padding-bottom: 40px">
                <div style="width: 400px; height: 103px; margin: 0 auto; overflow: hidden; position: relative">
                  <div style="width: 400px; height: 50px; border: 1px solid #0275ff; box-sizing: border-box; border-radius: 4px; margin: 50px auto 0 auto; box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1)">
                    <p style="width: 298px; height: 50px; line-height: 50px; font-size: 20px; color: #0275ff; text-align: center; margin: 0 auto">开始</p>
                  </div>
                </div>
                <div style="width: 400px; height: auto; margin: 0 auto; overflow: hidden; position: relative; cursor: pointer" v-for="(item, index) in jobTaskInfoList" :key="index" class="taskUnit">
                  <i class="el-icon-arrow-down" style="font-size: 20px; position: absolute; top: 10px; left: 190px; color: #909399"></i>
                  <i class="el-icon-arrow-down" style="font-size: 20px; position: absolute; top: 20px; left: 190px; color: #909399"></i>
                  <div style="width: 400px; height: auto; margin: 50px auto 0 auto; border: 1px solid #409eff; box-sizing: border-box; border-radius: 4px; box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1)">
                    <div v-for="(item2, index2) in item" :key="index2" style="width: 400px; height: 50px" :style="index2 == 0 ? '' : 'margin-top:-15px'">
                      <p style="width: 320px; height: 50px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; line-height: 50px; font-size: 20px; text-align: center; margin: 0 auto" :title="getTaskNameById(item2)" :style="item2.includes('data_sync') ? 'color: #409eff' : ' color: #67c23a'">
                        <span style="color: #ffffff; padding: 2px 5px; font-size: 16px; margin-right: 5px; border-radius: 2px" :style="item2.includes('data_sync') ? 'background: #409eff' : 'background: #67c23a'">{{ item2.includes('data_sync') ? '传输' : '离线' }}</span>
                        {{ getTaskNameById(item2) }}
                      </p>
                    </div>
                  </div>

                  <i class="el-icon-arrow-up actionIcon" style="font-size: 20px; position: absolute; top: 52px; left: 10px; color: #0275ff; cursor: pointer" :style="index == 0 ? 'cursor:not-allowed ' : 'cursor: pointer'" @click="index == 0 ? '' : changeIndex(index, index - 1)"></i>
                  <i class="el-icon-arrow-down actionIcon" style="font-size: 20px; position: absolute; top: 78px; left: 10px; color: #0275ff; cursor: pointer" :style="index == jobTaskInfoList.length - 1 ? 'cursor:not-allowed ' : 'cursor: pointer'" @click="index == jobTaskInfoList.length - 1 ? '' : changeIndex(index, index + 1)"></i>
                  <i class="el-icon-close actionIcon" style="font-size: 20px; position: absolute; top: 52px; right: 5px; color: #f56c6c; cursor: pointer" :style="jobTaskInfoList.length == 1 ? 'cursor:not-allowed ' : 'cursor: pointer'" @click="jobTaskInfoList.length == 1 ? '' : jobTaskInfoList.splice(index, 1)"></i>
                  <i class="el-icon-edit-outline actionIcon" style="font-size: 20px; position: absolute; top: 78px; right: 5px; color: #0275ff; cursor: pointer" @click=";(tempIndex = index), (choosedTaskList = item), (editChoosedTask = true), (chooseTaskShow = true)"></i>
                </div>
                <div style="width: 400px; height: 103px; margin: 0 auto; overflow: hidden; position: relative">
                  <i class="el-icon-arrow-down" style="font-size: 20px; position: absolute; top: 10px; left: 190px; color: #909399"></i>
                  <i class="el-icon-arrow-down" style="font-size: 20px; position: absolute; top: 20px; left: 190px; color: #909399"></i>
                  <div style="width: 400px; height: 50px; border: 1px solid #0275ff; box-sizing: border-box; border-radius: 4px; margin: 50px auto 0 auto; box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1); cursor: pointer" @click=";(choosedTaskList = []), (editChoosedTask = false)((chooseTaskShow = true))">
                    <p style="width: 298px; height: 50px; line-height: 50px; font-size: 20px; color: #0275ff; text-align: center; margin: 0 auto">添加节点</p>
                  </div>
                </div>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button @click="showTaskConfig = false" style="width: 100px" size="mini">取 消</el-button>
                <el-button
                  style="width: 100px"
                  size="mini"
                  type="primary"
                  @click="
                    formJob.jobTaskInfoList.jobTaskInfoList = JSON.parse(JSON.stringify(jobTaskInfoList))
                    showTaskConfig = false
                  "
                  >确 定</el-button
                >
              </div>
            </el-dialog>
            <el-col :span="24">
              <el-form-item label="描述：" prop="jobDescription">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model.trim="formJob.jobDescription" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShowJob = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="addOrModifyJob" @click="addJob()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="!addOrModifyJob" @click="modifyJob()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择任务" :visible.sync="chooseTaskShow" width="550px">
      <div style="padding: 0 20px; height: auto; margin-top: 20px">
        <el-select v-model="choosedTaskList" filterable placeholder="" multiple="">
          <el-option-group label="传输任务"> <el-option v-for="(item, index) in taskList" v-bind:key="index" :label="item.taskName" :value="item.id"></el-option></el-option-group>
          <el-option-group label="SQL任务"> <el-option v-for="(item, index) in sqlTaskList" v-bind:key="index" :label="item.taskName" :value="item.id"></el-option></el-option-group>
        </el-select>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="chooseTaskShow = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="!editChoosedTask" @click="jobTaskInfoList.push(choosedTaskList), (chooseTaskShow = false)" :disabled="choosedTaskList.length == 0">确 定</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="editChoosedTask" @click=";(jobTaskInfoList[tempIndex] = choosedTaskList), (chooseTaskShow = false)" :disabled="choosedTaskList.length == 0">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="任务配置" :visible.sync="dialogShowJobConfig" class="fullScreenDialog" width="100%">
      <jobConfigDialog v-if="dialogShowJobConfig" @close="dialogShowJobConfig = false" :jobRow="jobRow" @getData="getGroupList"></jobConfigDialog>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify } from '@/api/common'
import request from '@/api/request'
import vcrontab from 'vcrontab'
import jobConfigDialog from './components/jobConfigDialog.vue'
export default {
  name: 'groupJob',
  components: {
    pagination,
    vcrontab,
    jobConfigDialog
  },
  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      buttonLoad: false,
      groupList: [],
      taskList: [],
      sqlTaskList: [],
      activeGroup: {},
      activeGroupId: '',
      isEditGroup: false,
      formGroup: {
        groupName: '',
        groupDesc: '',
        projectGroupId: ''
      },
      formShowGroup: false,
      titleGroup: '',
      addOrModifyGroup: true,

      queryForm: {
        status: null,
        pageSize: 20,
        pageNum: 1,
        totla: 0
      },
      tableJob: [],
      loadingJob: false,
      formJob: {
        projectGroupId: '',
        jobName: '',
        jobGroupId: '',
        jobGroupName: '',
        cronExpression: '',
        jobDescription: '',
        jobTaskInfoList: { jobTaskInfoList: [] }
      },
      jobTaskInfoList: [],
      formShowJob: false,
      titleJob: '',
      addOrModifyJob: true,
      showCron: false,
      cronExpression: '',
      showTaskConfig: false,

      chooseTaskShow: false,
      choosedTaskList: [],
      editChoosedTask: false,
      tempIndex: '',

      projectGroupList: [],

      dialogShowJobConfig: false,
      jobRow: ''
    }
  },
  mounted() {
    this.getProjectGroupList()
    this.getGroupList()
    this.getTaskList()
    this.getSqlTaskList()
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
    // 获取项目组list
    getProjectGroupList() {
      let that = this
      request({ url: '/project_group_permission/user_info_id', method: 'get', params: { userInfoId: that.$store.state.userInfo.id } }).then(res => {
        that.projectGroupList = res.data
      })
    },
    // 获取group列表
    getGroupList() {
      let that = this
      request({ url: '/job_group_info/get', method: 'get', params: {} }).then(res => {
        that.groupList = res.data
        that.activeGroup = res.data[0] ? res.data[0] : ''
        that.activeGroupId = res.data[0] ? res.data[0].id + '' : ''
        that.getDataJob()
      })
    },
    handleTabClick(tab, event) {
      let that = this
      that.activeGroup = that.groupList.filter(s => {
        return s.id == that.activeGroupId
      })[0]
      that.getDataJob()
      console.log(that.activeGroup)
    },
    // 获取jobTaskInfoList
    getTaskList() {
      let that = this
      request({ url: '/task_info/list', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.taskList = []
        res.data.list.forEach((item, index) => {
          that.taskList.push({ taskName: item.taskName, id: 'data_sync_task-{' + item.id + '}' })
        })
      })
    },
    // 获取sqlTaskList
    getSqlTaskList() {
      let that = this
      request({ url: '/sql_task_info/list', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.sqlTaskList = []
        res.data.list.forEach((item, index) => {
          that.sqlTaskList.push({ taskName: item.taskName, id: 'sql_task-{' + item.id + '}' })
        })
      })
    },
    // 获取job列表
    getDataJob() {
      let that = this
      that.loadingJob = true
      request({ url: '/job_info/list', method: 'get', params: { status: that.queryForm.status, jobGroupName: that.activeGroup.groupName } }).then(res => {
        that.tableJob = res.data.list || []
        // that.tableJob.forEach((item, index) => {
        //   item.jobTaskInfo = JSON.parse(item.jobTaskInfo).jobTaskInfoList
        // })
        that.queryForm.total = res.data.total
        that.loadingJob = false
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },

    // 新建分组
    newGroup() {
      let that = this
      that.addOrModifyGroup = true
      that.formShowGroup = true
      that.buttonLoad = false
      that.titleGroup = '新建分组信息'
      resetForm('formGroup', that)
    },
    // add分组
    addGroup() {
      let that = this
      that.$refs['formGroup'].validate(valid => {
        if (valid) {
          let params = that.formGroup
          that.buttonLoad = true
          request({ url: '/job_group_info/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowGroup = false), that.getGroupList())
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
            })
            .catch(() => {
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
            })
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    seeGroup() {
      let that = this
      that.addOrModifyGroup = false
      that.formShowGroup = true
      that.buttonLoad = false
      that.titleGroup = '修改分组信息    [' + that.activeGroup.groupName + ']'
      that.$nextTick(() => {
        that.formGroup = JSON.parse(JSON.stringify(that.activeGroup))
      })
    },
    // 修改数据源信息
    modifyGroup() {
      let that = this
      that.$refs['formGroup'].validate(valid => {
        if (valid) {
          let params = that.formGroup
          that.buttonLoad = true
          request({ url: '/job_group_info/update', method: 'post', data: params })
            .then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowGroup = false), that.getGroupList())
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
            })
            .catch(() => {
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
            })
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    cancelGroup() {
      let that = this
      this.$confirm('是否删除[' + that.activeGroup.groupName + ']分组信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request({ url: '/job_group_info/delete', method: 'post', data: { id: that.formGroup.id } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowGroup = false), that.getGroupList())
          })
        })
        .catch(() => {})
    },
    // 新建任务
    newJob() {
      let that = this
      that.addOrModifyJob = true
      that.formShowJob = true
      that.buttonLoad = false
      that.titleJob = '新建任务信息'
      resetForm('formJob', that)
      that.formJob.jobTaskInfoList = { jobTaskInfoList: [] }
      that.formJob.jobGroupId = that.activeGroup.id
      that.formJob.id = null
    },
    // add任务
    addJob() {
      let that = this
      that.$refs['formJob'].validate(valid => {
        if (valid) {
          let params = that.formJob
          params.jobGroupName = that.groupList.filter(s => {
            return s.id == that.formJob.jobGroupId
          })[0].groupName
          that.buttonLoad = true
          request({ url: '/job_info/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.formShowJob = false
                that.getDataJob()
              }
            })
            .catch(() => {
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
            })
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    // 查看单个数据源信息
    seeJob(row) {
      let that = this
      that.addOrModifyJob = false
      that.formShowJob = true
      that.buttonLoad = false
      that.titleJob = '修改任务信息    [' + row.jobName + ']'
      that.$nextTick(() => {
        resetForm('formJob', that)
        that.formJob = { ...row }
      })
      // let params = {}
      // request({ url: '/auditRobot/users/' + row.id, method: 'get', params: params }).then(res => {
      //   that.addOrModifySJY = false
      //   that.formShowSJY = true
      //   that.buttonLoad = false
      //   that.titleSJY = '修改用户信息    [' + row.name + ']'
      //   resetForm('formSJY', that)
      //   that.$nextTick(() => {
      //     that.formSJY = res.data
      //   })
      // })
    },
    // 修改数据源信息
    modifyJob() {
      let that = this
      that.$refs['formJob'].validate(valid => {
        if (valid) {
          let params = that.formJob
          params.jobGroupName = that.groupList.filter(s => {
            return s.id == that.formJob.jobGroupId
          })[0].groupName
          that.buttonLoad = true
          request({ url: '/job_info/update', method: 'post', data: params })
            .then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowJob = false), that.getDataJob())
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
            })
            .catch(() => {
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
            })
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    cancelJob(row) {
      let that = this
      that
        .$confirm('是否删除[' + row.jobName + ']任务信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/job_info/delete', method: 'post', data: { id: row.id } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), that.getDataJob())
          })
        })
        .catch(() => {})
    },
    // 发布
    publishJob(row) {
      let that = this
      that
        .$confirm('是否发布[' + row.jobName + ']任务信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/job_info/update_job_status', method: 'post', data: { id: row.id, status: 'EFFECTIVE' } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), that.getDataJob())
          })
        })
        .catch(() => {})
    },
    // 取消发布
    unPublishJob(row) {
      let that = this
      that
        .$confirm('是否取消发布[' + row.jobName + ']任务信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/job_info/update_job_status', method: 'post', data: { id: row.id, status: 'NOT_EFFECTIVE' } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), that.getDataJob())
          })
        })
        .catch(() => {})
    },
    // 绑定任务id转换为任务名称
    tranJobTaskInfo(jobTaskInfo) {
      let that = this
      let tempArr = []
      let allTaskList = that.taskList.concat(that.sqlTaskList)
      jobTaskInfo.forEach((item, index) => {
        let tempArr2 = []
        item.forEach((item2, index2) => {
          let temp = allTaskList.filter(s => {
            return s.id == item2
          })
          if (temp[0]) {
            tempArr2.push(temp[0].taskName)
          } else {
            tempArr2.push('-')
          }
        })
        tempArr.push(tempArr2.join('+'))
      })
      return tempArr.join('>>>')
    },
    // 绑定任务详情-根据任务id显示任务名称
    getTaskNameById(id) {
      let that = this
      if (id.includes('data_sync')) {
        let temp = that.taskList.filter(s => {
          return s.id == id
        })
        if (temp[0]) {
          return temp[0].taskName
        } else {
          return '-'
        }
      } else if (id.includes('sql')) {
        let temp = that.sqlTaskList.filter(s => {
          return s.id == id
        })
        if (temp[0]) {
          return temp[0].taskName
        } else {
          return '-'
        }
      }
    },
    // 绑定任务详情-调换顺序
    changeIndex(index, nextIndex) {
      let that = this
      let temp = that.jobTaskInfoList[index]
      that.jobTaskInfoList[index] = that.jobTaskInfoList[nextIndex]
      that.jobTaskInfoList[nextIndex] = temp
      that.$forceUpdate()
    },

    // cron表达式
    cronFill(value) {
      this.formJob.cronExpression = value
    },
    // job配置
    seeJobConfig(row) {
      let that = this
      that.jobRow = row
      that.dialogShowJobConfig = true
    }
  }
}
</script>

<style scoped>
</style>
