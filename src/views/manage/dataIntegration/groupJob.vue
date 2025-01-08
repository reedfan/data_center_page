<template>
  <div class="manageMain groupJob" style="flex-direction: row">
    <div style="width: 216px; padding: 10px 24px 10px 0; height: 100%; border-right: 1px solid #e4e6eb">
      <p style="width: 100%; height: 28px; line-height: 28px; border-bottom: 1px solid #e4e6eb; font-size: 12px; text-align: center; color: #333333">任务分组</p>
      <el-dropdown style="width: 100%; margin: 10px auto 0 auto" @command="handleCommand">
        <el-button icon="el-icon-plus" size="mini" style="width: 150px; margin: 0 auto; display: block"> 新建<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="fz">新建分组</el-dropdown-item>
          <el-dropdown-item command="rw">新建任务</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tree style="height: calc(100% - 80px); margin-top: 10px; width: 100%; overflow: hidden auto" node-key="id" ref="treeFZRW" :props="treePropsFZRW" :data="treeFZRWData" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClickFZRW">
        <span slot-scope="{ node, data }">
          <div style="width: 180px; height: 100%; overflow: hidden">
            <i :class="node.level == 1 ? 'el-icon-files' : 'el-icon-position'" style="font-size: 16px; margin-right: 5px; float: left"></i>
            <p style="font-size: 12px; margin: 0; float: left; width: 120px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ node.level == 1 ? data.groupName : data.jobName }}</p>
            <i class="el-icon-edit" @click.stop="node.level == 1 ? seeGroup(data) : seeJob(data)" style="color: #ffffff; margin-right: 10px; font-size: 16px; float: right" v-if="(node.level == 1 && activeGroupId == data.id) || (node.level == 2 && activeJobId == data.id)"></i>
          </div>
        </span>
      </el-tree>
    </div>
    <div style="width: calc(100% - 482px); height: 100%; border-right: 1px solid #e4e6eb; position: relative">
      <div class="main-unit" style="width: 100%; height: 100%; position: relative; overflow: hidden" id="container"></div>
      <div style="width: 220px; height: 40px; padding: 0 20px; position: absolute; top: 0; right: 20px; text-align: right; line-height: 40px; background: #ffffff">
        <el-button type="success" @click="publishJob(jobRow)" style="width: 100px" size="mini" :disabled="buttonLoad" :loading="buttonLoad" v-if="jobRow.status == 0">发布</el-button>
        <el-button @click="unPublishJob(jobRow)" style="width: 100px" size="mini" :disabled="buttonLoad" :loading="buttonLoad" v-if="jobRow.status == 1">取消发布</el-button>
        <el-button type="primary" @click="getGraphData()" style="width: 100px" size="mini" :disabled="buttonLoad" :loading="buttonLoad" v-if="jobRow.id">保存</el-button>
      </div>
    </div>
    <div style="width: 216px; padding: 10px 0 10px 20px; height: 100%" class="no-select" v-show="jobRow.id">
      <el-radio-group v-model="activeName" size="mini" style="margin: 10px">
        <el-radio-button label="sync">传输任务</el-radio-button>
        <el-radio-button label="sql">SQL任务</el-radio-button>
      </el-radio-group>
      <div style="width: 100%; height: calc(100% - 70px); overflow: hidden auto" v-if="activeName == 'sync'">
        <div class="dragUnit" style="width: 100%; height: 36px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in taskList" :key="index" @mousedown="startDragToGraph(item, 'sync', $event)">
          <p style="width: 40px; color: #ffffff; height: 20px; line-height: 20px; margin: 8px 5px 8px 10px; text-align: center; font-size: 14px; border-radius: 2px; background: #409eff; float: left">传输</p>
          <p style="width: 130px; height: 36px; line-height: 36px; font-size: 12px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
            {{ item.taskName }}
          </p>
        </div>
      </div>
      <div style="width: 100%; height: calc(100% - 70px); overflow: hidden auto" v-if="activeName == 'sql'">
        <div class="dragUnit" style="width: 100%; height: 36px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in sqlTaskList" :key="index" @mousedown="startDragToGraph(item, 'sql', $event)">
          <p style="width: 40px; color: #ffffff; height: 20px; line-height: 20px; margin: 8px 5px 8px 10px; text-align: center; font-size: 14px; border-radius: 2px; background: #67c23a; float: left">SQL</p>
          <p style="width: 140px; height: 36px; line-height: 36px; font-size: 14px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
            {{ item.taskName }}
          </p>
        </div>
      </div>
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
        <el-button @click="cancelJob()" style="width: 100px" size="mini" v-if="!addOrModifyJob" type="danger">删 除</el-button>
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
    <el-dialog title="任务详情" :visible.sync="dialogShowTask" class="fullScreenDialog" width="100%">
      <syncTasksDialog v-if="dialogShowTask" :addOrModifyOrCopyTask="addOrModifyOrCopyTask" :taskRow="taskRow" @close="dialogShowTask = false" @getData="getTableBloodData"></syncTasksDialog>
    </el-dialog>
    <el-dialog title="任务详情" :visible.sync="dialogShowTaskSQL" width="900px">
      <offlineTasksDialog v-if="dialogShowTaskSQL" :addOrModifyTask="addOrModifyTaskSQL" :taskRow="taskRowSQL" @close="dialogShowTaskSQL = false" @getData="getTableBloodData"></offlineTasksDialog>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify } from '@/api/common'
import request from '@/api/request'
import vcrontab from 'vcrontab'
import jobConfigDialog from './components/jobConfigDialog.vue'
import { Graph } from '@antv/x6'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Dnd } from '@antv/x6-plugin-dnd'
import { register, getTeleport } from '@antv/x6-vue-shape'
import { Selection } from '@antv/x6-plugin-selection'
import syncTasksDialog from './../dataIntegration/components/syncTasksDialog.vue'
import offlineTasksDialog from './../dataDevelop/components/offlineTasksDialog.vue'
import graphNode from './components/graphNode.vue'
import beginNode from './components/beginNode.vue'
import endNode from './components/endNode.vue'

register({
  shape: 'tableNode',
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#E6A23C',
            strokeWidth: 2,
            fill: '#fff'
          }
        }
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#E6A23C',
            strokeWidth: 2,
            fill: '#fff'
          }
        }
      }
    },
    items: [
      {
        group: 'top',
        id: 'top'
      },
      {
        group: 'bottom',
        id: 'bottom'
      }
    ]
  },
  component: graphNode
})
register({
  shape: 'beginNode',
  ports: {
    groups: {
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#E6A23C',
            strokeWidth: 2,
            fill: '#fff'
          }
        }
      }
    },
    items: [
      {
        group: 'bottom',
        id: 'bottom'
      }
    ]
  },
  component: beginNode
})
register({
  shape: 'endNode',
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#E6A23C',
            strokeWidth: 2,
            fill: '#fff'
          }
        }
      }
    },
    items: [
      {
        group: 'top',
        id: 'top'
      }
    ]
  },
  component: endNode
})

export default {
  name: 'groupJob',
  components: {
    pagination,
    vcrontab,
    jobConfigDialog,
    syncTasksDialog,
    offlineTasksDialog
  },
  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      buttonLoad: false,

      treeFZRWData: [],
      treePropsFZRW: {
        label: 'label',
        children: 'children',
        isLeaf: 'leaf'
      },
      activeJobId: '',
      activeGroupId: '',

      activeName: 'sync',
      graph: null,
      groupList: [],
      taskList: [],
      sqlTaskList: [],

      formGroup: {
        groupName: '',
        groupDesc: '',
        projectGroupId: ''
      },
      formShowGroup: false,
      titleGroup: '',
      addOrModifyGroup: true,

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
      jobRow: '',

      nodes: [
        {
          shape: 'beginNode',
          x: 100,
          y: 100,
          width: 300,
          height: 70,
          id: 'beginNode',
          data: {}
        },
        {
          shape: 'endNode',
          x: 100,
          y: 600,
          width: 300,
          height: 70,
          id: 'endNode',
          data: {}
        }
      ],
      edges: [],
      tempEdge: {},
      tempNode: {},

      dialogShowTask: false,
      addOrModifyOrCopyTask: '',
      taskRow: '',

      addOrModifyTaskSQL: false,
      taskRowSQL: '',
      dialogShowTaskSQL: false
    }
  },
  mounted() {
    this.getTreeFZRWData()
    this.getTaskList()
    this.getSqlTaskList()
    this.getProjectGroupList()
    this.getGroupList()
    if (this.$route.query.activeJobId) {
      this.activeJobId = this.$route.query.activeJobId
      request({ url: '/job_info/get', method: 'get', params: { id: this.activeJobId } }).then(res2 => {
        this.getNodesAndEdges(res2.data)
      })
    }
  },
  methods: {
    getTreeFZRWData() {
      let that = this
      that.treeFZRWData = []
      request({ url: '/job_group_info/tree_list', method: 'get', params: {} }).then(res => {
        res.data.forEach((item, index) => {
          that.treeFZRWData.push({ ...item.label, children: item.children })
        })

        setTimeout(() => {
          that.$refs.treeFZRW.setCurrentKey(that.activeGroupId || that.activeJobId)
        }, 300)
      })
    },
    loadFZRWNode(node, resolve) {
      let that = this
      console.log(node)
      if (node.level === 0) {
        let tempLevel1 = []
        request({ url: '/job_group_info/get', method: 'get', params: {} }).then(res => {
          res.data.forEach((item, index) => {
            tempLevel1.push({ name: item.groupName, value: item.id, whole: item, level: 1 })
          })
          return resolve(tempLevel1)
        })
      }
      if (node.level === 1) {
        let tempLevel2 = []
        request({ url: '/job_info/list', method: 'get', params: { jobGroupName: node.data.name } }).then(res => {
          if (res.data.list) {
            res.data.list.forEach((item, index) => {
              tempLevel2.push({ name: item.jobName, value: item.id, whole: item, level: 2, children: [], leaf: true })
            })
          }

          return resolve(tempLevel2)
        })
      }
      if (node.level > 1) return resolve([])
    },
    handleNodeClickFZRW(data, node) {
      console.log(data)
      console.log(node)
      let that = this
      if (node.level == 1) {
        that.activeGroupId = data.id
      }
      if (node.level == 2) {
        that.activeGroupId = ''
        that.activeJobId = data.id
        request({ url: '/job_info/get', method: 'get', params: { id: data.id } }).then(res => {
          that.getNodesAndEdges(res.data)
        })
      }
    },
    handleCommand(command) {
      let that = this
      if (command == 'fz') {
        that.newGroup()
      } else if (command == 'rw') {
        that.newJob()
      }
    },
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
      })
    },
    // 获取jobTaskInfoList
    getTaskList() {
      let that = this
      request({ url: '/task_info/list', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.taskList = []
        res.data.list.forEach((item, index) => {
          that.taskList.push({ taskName: item.taskName, id: 'data_sync_task-{' + item.id + '}', realId: item.id })
        })
      })
    },
    // 获取sqlTaskList
    getSqlTaskList() {
      let that = this
      request({ url: '/sql_task_info/list', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.sqlTaskList = []
        res.data.list.forEach((item, index) => {
          that.sqlTaskList.push({ taskName: item.taskName, id: 'sql_task-{' + item.id + '}', realId: item.id })
        })
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
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowGroup = false), that.getTreeFZRWData())
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
    seeGroup(row) {
      let that = this
      that.addOrModifyGroup = false
      that.formShowGroup = true
      that.buttonLoad = false
      that.titleGroup = '修改分组信息    [' + row.groupName + ']'
      that.$nextTick(() => {
        that.formGroup = JSON.parse(JSON.stringify(row))
      })
    },
    // 修改数据源信息
    modifyGroup() {
      let that = this
      that.$refs['formGroup'].validate(valid => {
        if (valid) {
          let params = {}
          params.id = that.formGroup.id
          params.jobDescription = that.formGroup.groupDesc
          params.jobGroupName = that.formGroup.groupName
          params.projectGroupId = that.formGroup.projectGroupId
          that.buttonLoad = true
          request({ url: '/job_group_info/update', method: 'post', data: params })
            .then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowGroup = false), that.getTreeFZRWData())
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
      this.$confirm('是否删除[' + that.formGroup.groupName + ']分组信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request({ url: '/job_group_info/delete', method: 'post', data: { id: that.formGroup.id } }).then(res => {
            if (res.code == 200) {
              Notify('success', res.message || '处理成功'), (that.formShowGroup = false), that.getTreeFZRWData()
            }
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
      that.getGroupList()
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
              if (res.code == '200') {
                Notify('success', res.message || '处理成功')
                that.formShowJob = false
                that.getTreeFZRWData()
              }
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
    // 查看单个数据源信息
    seeJob(row) {
      let that = this
      that.addOrModifyJob = false
      that.formShowJob = true
      that.buttonLoad = false
      that.titleJob = '修改任务信息    [' + row.jobName + ']'
      that.getGroupList()
      that.$nextTick(() => {
        resetForm('formJob', that)
        that.formJob = { ...row }
      })
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
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowJob = false), that.getTreeFZRWData())
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
    cancelJob() {
      let that = this
      that
        .$confirm('是否删除[' + that.formJob.jobName + ']任务信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/job_info/delete', method: 'post', data: { id: that.formJob.id } }).then(res => {
            if (res.code == 200) {
              Notify('success', res.message || '处理成功')
              that.formShowJob = false
              that.getTreeFZRWData()
            }
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
            if (res.code == 200) {
              Notify('success', res.message || '处理成功')
              request({ url: '/job_info/get', method: 'get', params: { id: row.id } }).then(res2 => {
                that.getNodesAndEdges(res2.data)
              })
            }
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
            if (res.code == 200) {
              Notify('success', res.message || '处理成功')
              request({ url: '/job_info/get', method: 'get', params: { id: row.id } }).then(res2 => {
                that.getNodesAndEdges(res2.data)
              })
            }
          })
        })
        .catch(() => {})
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
    },
    // 获取点和线
    getNodesAndEdges(row) {
      let that = this
      that.jobRow = row
      if (that.jobRow.graphInfo) {
        that.nodes = []
        that.edges = []
        console.log(JSON.parse(that.jobRow.graphInfo))
        let graphInfo = JSON.parse(that.jobRow.graphInfo)
        graphInfo.cells.forEach((item, index) => {
          if (item.shape == 'beginNode' || item.shape == 'endNode' || item.shape == 'tableNode') {
            that.nodes.push(item)
          } else {
            that.edges.push(item)
          }
        })
      } else {
        that.nodes = [
          {
            position: {
              x: 100,
              y: 100
            },
            size: {
              width: 300,
              height: 40
            },
            view: 'vue-shape-view',
            shape: 'beginNode',
            ports: {
              groups: {
                bottom: {
                  position: 'bottom',
                  attrs: {
                    circle: {
                      r: 6,
                      magnet: true,
                      stroke: '#E6A23C',
                      strokeWidth: 2,
                      fill: '#fff'
                    }
                  }
                }
              },
              items: [
                {
                  group: 'bottom',
                  id: 'bottom'
                }
              ]
            },
            id: 'beginNode',
            data: {},
            zIndex: 1
          },
          {
            position: {
              x: 100,
              y: 600
            },
            size: {
              width: 300,
              height: 40
            },
            view: 'vue-shape-view',
            shape: 'endNode',
            ports: {
              groups: {
                top: {
                  position: 'top',
                  attrs: {
                    circle: {
                      r: 6,
                      magnet: true,
                      stroke: '#E6A23C',
                      strokeWidth: 2,
                      fill: '#fff'
                    }
                  }
                }
              },
              items: [
                {
                  group: 'top',
                  id: 'top'
                }
              ]
            },
            id: 'endNode',
            data: {},
            zIndex: 1
          }
        ]
        that.edges = []
      }
      if (that.graph) {
        that.graph.dispose()
      }
      setTimeout(() => {
        that.initGraph()
      }, 300)
      console.log(that.nodes)
    },
    initGraph() {
      let that = this
      that.graph = new Graph({
        container: document.getElementById('container'),
        // autoResize: true,
        translating: { restrict: true },
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: 'ctrl',
          minScale: 0.5,
          maxScale: 3
        },
        connecting: {
          router: {
            name: 'manhattan',
            args: {
              padding: 1
            }
          },
          connector: {
            name: 'rounded',
            args: {
              radius: 8
            }
          },
          anchor: 'center',
          connectionPoint: 'anchor',
          allowBlank: false,
          snap: {
            radius: 20
          },
          createEdge() {
            return this.createEdge({
              router: 'metro',
              attrs: {
                line: {
                  stroke: '#A2B1C3',
                  strokeWidth: 2,
                  targetMarker: {
                    name: 'block',
                    width: 12,
                    height: 8
                  }
                }
              },
              zIndex: 0
            })
          },
          validateConnection({ sourceCell, targetCell, sourceMagnet, targetMagnet }) {
            // 不能连接自身
            if (sourceCell === targetCell) {
              return false
            }
            // 只能从 bottom 连接桩开始连接，连接到 top 连接桩
            if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'top') {
              return false
            }
            if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'top') {
              return false
            }

            // 不能重复连线
            const edges = this.getEdges()
            let flag = false
            edges.forEach((edge, index) => {
              if (edge.store.data.source.cell == sourceCell.id && edge.store.data.target.cell == targetCell.id) {
                flag = true
              }
            })
            if (flag) {
              return false
            }
            // const portId = targetMagnet.getAttribute('port')
            // if (edges.find(edge => edge.getTargetPortId() === portId)) {
            //   return false
            // }

            return true
          }
        },
        highlighting: {
          // 连接桩可以被连接时在连接桩外围围渲染一个包围框
          magnetAvailable: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#A4DEB1',
                strokeWidth: 4
              }
            }
          },
          // 连接桩吸附连线时在连接桩外围围渲染一个包围框
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#31d0c6',
                strokeWidth: 4
              }
            }
          }
        },
        selecting: {
          enabled: true,
          rubberband: true,
          showNodeSelectionBox: true
        },
        snapline: true,
        keyboard: true,
        clipboard: true,

        background: {
          color: '#ffffff'
        },
        // 网格线设置
        grid: {
          visible: true,
          type: 'doubleMesh',
          args: [
            {
              color: '#eee', // 主网格线颜色
              thickness: 1 // 主网格线宽度
            },
            {
              color: '#ddd', // 次网格线颜色
              thickness: 1, // 次网格线宽度
              factor: 4 // 主次网格线间隔
            }
          ]
        },

        panning: {
          enabled: true,
          // 触发键盘事件进行平移：'alt' | 'ctrl' | 'meta' | 'shift'
          modifiers: [],
          // 触发鼠标事件进行平移：'leftMouseDown' | 'rightMouseDown' | 'mouseWheel'
          eventTypes: ['leftMouseDown']
        }
      })
      // // 渲染节点和边
      that.graph.fromJSON({
        nodes: that.nodes,
        edges: that.edges
      })
      // 实现画布内容居中
      that.graph.centerContent()
      // 增加对齐线
      that.graph.use(
        new Selection({
          enabled: true,
          multiple: true,
          rubberband: false,
          movable: false,
          showNodeSelectionBox: true,
          showEdgeSelectionBox: true,
          pointerEvents: 'none'
        })
      )
      that.graph.use(
        new Snapline({
          enabled: true
        })
      )

      that.graph.on('edge:dblclick', ({ e, x, y, edge, view }) => {
        console.log(edge)
        // edge.prop('data', '1111')
        // console.log(edge)
      })
      that.graph.on('edge:connected', ({ isNew, edge }) => {
        if (isNew) {
          edge.prop('id', edge.store.data.source.cell + '->' + edge.store.data.target.cell)
        }
      })
      that.graph.on('node:contextmenu', ({ e, x, y, node, view }) => {
        let event = e.originalEvent
        console.log(e)
        console.log(x)
        console.log(y)
        console.log(node)
        console.log(view)
        if (node.id == 'beginNode' || node.id == 'endNode') {
          return
        }

        that.$contextmenu({
          items: [
            {
              icon: 'el-icon-view',
              label: '查看详情',
              onClick: () => {
                that.seeTask(node)
              }
            },
            {
              icon: 'el-icon-delete',
              label: '删除',
              onClick: () => {
                that.deleteGraphCell(node)
              }
            }
          ],
          event, // 鼠标事件信息
          customClass: 'custom-class', // 自定义菜单样式
          zIndex: 3000, // 菜单的 z-index
          minWidth: 230 // 菜单的最小宽度
        })
      })
      that.graph.on('edge:contextmenu', ({ e, x, y, edge, view }) => {
        let event = e.originalEvent
        console.log(e)
        console.log(x)
        console.log(y)
        console.log(edge)
        console.log(view)
        that.$contextmenu({
          items: [
            {
              icon: 'el-icon-delete',
              label: '删除',
              onClick: () => {
                that.deleteGraphCell(edge)
              }
            }
          ],
          event, // 鼠标事件信息
          customClass: 'custom-class', // 自定义菜单样式
          zIndex: 3000, // 菜单的 z-index
          minWidth: 230 // 菜单的最小宽度
        })
      })

      // this.graph.on('node:mouseenter', val => {
      //   const container = document.getElementById('container')
      //   const ports = container.querySelectorAll('.x6-port-body')
      //   for (let i = 0, len = ports.length; i < len; i = i + 1) {
      //     ports[i].style.visibility = val ? 'visible' : 'hidden'
      //   }
      // })
    },
    startDragToGraph(item, type, e) {
      console.log(item)
      let that = this
      let node = that.graph.createNode({
        shape: 'tableNode',
        // 自己设置拖拽元素的具体属性，此处不赘述
        // width: 200, // 节点的宽度
        // height: 40, // 节点的高度
        id: item.id,
        data: { ...item, taskType: type }
      })
      const dnd = new Dnd({
        getDragNode: node => node.clone({ keepId: true }),
        getDropNode: node => node.clone({ keepId: true }),
        target: that.graph,
        validateNode: () => {
          // console.log('成功拖拽至目标画布')
        }
      })
      dnd.start(node, e)
    },
    getGraphData() {
      let that = this
      console.log(that.graph)
      console.log(that.graph.getSelectedCells())
      console.log(that.graph.toJSON())
      let edges = []
      that.graph.toJSON().cells.forEach(x => {
        if (x.shape == 'edge') {
          edges.push(x.id)
        }
      })
      console.log(edges)
      const graph = {}
      edges.forEach(edge => {
        const [start, end] = edge.split('->')
        if (!graph[start]) {
          graph[start] = []
        }
        graph[start].push(end)
      })
      // 深度优先搜索函数
      function findAllPaths(graph, start, end) {
        let paths = []
        let stack = [{ node: start, path: [start] }]

        while (stack.length > 0) {
          let { node, path } = stack.pop()

          if (node === end) {
            paths.push(path)
          } else {
            for (let neighbor of graph[node]) {
              if (!path.includes(neighbor)) {
                stack.push({ node: neighbor, path: [...path, neighbor] })
              }
            }
          }
        }
        return paths
      }

      // 从起始节点 'a' 开始搜索
      try {
        const allPaths = findAllPaths(graph, 'beginNode', 'endNode')
        console.log(allPaths)
        // 将所有路径转换为字符串并输出
        const pathStrings = allPaths.map(path => path.join('-'))
        console.log(pathStrings)
        that.buttonLoad = true
        let params = { ...that.jobRow }
        params.graphInfo = JSON.stringify(that.graph.toJSON())
        params.jobTaskInfo = JSON.stringify({ jobTaskInfoList: allPaths })
        request({ url: '/job_info/update', method: 'post', data: params })
          .then(res => {
            if (res.code == '200') {
              Notify('success', res.message || '处理成功')
              that.$emit('close', '')
              that.$emit('getData', '')
            }
            setTimeout(() => {
              that.buttonLoad = false
            }, 300)
          })
          .catch(() => {
            setTimeout(() => {
              that.buttonLoad = false
            }, 300)
          })
      } catch (e) {
        console.log(e)
        Notify('error', '流程图有误(必须从开始节点到结束节点)！')
      }
    },
    deleteGraphCell(cell) {
      if (cell.id == 'beginNode') {
        Notify('error', '请不要删除开始节点')
        return
      }
      if (cell.id == 'endNode') {
        Notify('error', '请不要删除结束节点')
        return
      }
      console.log(cell)
      this.graph.removeCells([cell])
    },

    // 查看任务
    seeTask(node) {
      console.log(node)
      let that = this
      if (node.store.data.data.taskType == 'sync') {
        that.addOrModifyOrCopyTask = 'modify'
        that.taskRow = { id: node.store.data.data.realId }
        that.dialogShowTask = true
      } else if (node.store.data.data.taskType == 'sql') {
        that.addOrModifyTaskSQL = false
        that.taskRowSQL = { id: node.store.data.data.realId }
        that.dialogShowTaskSQL = true
      }
    }
  }
}
</script>

<style scoped>
</style>
