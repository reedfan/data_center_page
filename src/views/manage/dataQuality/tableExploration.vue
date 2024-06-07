<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain tableExploration">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <!-- <p class="searchLabel" style="width: auto">任务名称:</p>
        <div style="width: 13%; height: 40px; float: left; margin: 0 1%">
          <el-input v-model.trim="queryForm.taskName" autocomplete="off" placeholder="请输入任务名称"></el-input>
        </div> -->
        <p class="searchLabel" style="width: auto">状态:</p>
        <div style="width: 17%; height: 42px; float: left; margin: 0 1%">
          <el-select v-model="queryForm.taskStatus" filterable placeholder="请选择" @change=";(queryForm.pageNum = 1), getTaskData()">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="成功" value="SUCCESS"></el-option>
            <el-option label="运行中" value="RUNNING"></el-option>
            <el-option label="失败" value="FAIL"></el-option>
          </el-select>
        </div>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-search" @click="getTaskData()">查询</el-button>
        </div>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-plus" @click="newTask()">新建任务</el-button>
        </div>
      </div>
    </div>
    <div class="main-unit" style="width: calc(100% - 48px); height: calc(100% - 95px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
      <el-table v-loading="loadingTask" element-loading-text="数据加载中" class="data-table" ref="table" :data="TaskData" stripe :height="this.$store.state.globalHeight - 285">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="taskName" label="任务名称" min-width="180" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="tableName" label="探查对象" min-width="80" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createBy" label="任务负责人" min-width="60" align="center"> </el-table-column>
        <el-table-column prop="status" label="任务状态" min-width="60" align="center">
          <template slot-scope="scope">
            <span style="color: #67c23a" v-if="scope.row.status == 'SUCCESS'">成功</span>
            <span style="color: #e6a23c" v-else-if="scope.row.status == 'RUNNING'">运行中</span>
            <span style="color: #f56c6c" v-else-if="scope.row.status == 'FAIL'">失败</span>
            <span v-else>{{ scope.row.status || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskDesc" label="描述" min-width="230" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="350" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="showCaseList(scope.row)">实例列表</p>
            <p class="tableAction" @click="runTask(scope.row)">运行</p>
            <p class="tableAction" @click="seeTask(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelTask(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getTaskData"> </pagination>
    </div>
    <el-dialog :title="titleTask" :visible.sync="dialogShowTask" width="1200px">
      <el-steps :active="stepTask" simple style="margin-top: 10px">
        <el-step title="设置探查对象" icon="el-icon-edit-outline"></el-step>
        <el-step title="设置规则" icon="el-icon-folder-checked"></el-step>
        <el-step title="完成" icon="el-icon-s-promotion"></el-step>
      </el-steps>
      <el-form :model="formTask" ref="formTask" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" v-show="stepTask == 1">
        <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
          <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">探查对象</p>
          <div style="width: 100%; height: auto; min-height: 150px; margin-top: 20px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="数据源：" :required="true" prop="dataType">
                  <el-select disabled v-model="formTask.dataType" filterable placeholder="请选择类型" @change="dataTypeChange()">
                    <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" :required="true" prop="dataSourceId" label-width="0">
                  <el-select v-model="formTask.dataSourceId" filterable placeholder="请选择数据源" @change="dataSourceChange()">
                    <el-option v-for="(item, index) in dataSourceList" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="库表选择：" :required="true" prop="dbName">
                  <el-select v-model="formTask.dbName" filterable placeholder="请选择库">
                    <el-option v-for="(item, index) in dbNameList" v-bind:key="index" :label="item.dbName" :value="item.dbName"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" :required="true" prop="tableName" label-width="0">
                  <el-select v-model="formTask.tableName" filterable placeholder="请选择表" @change="tableNameChange()">
                    <el-option v-for="(item, index) in tableNameList" v-bind:key="index" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
          <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">基础信息</p>
          <div style="width: 100%; height: auto; min-height: 150px; margin-top: 20px">
            <el-row :gutter="24">
              <el-col :span="12">
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
          </div>
        </div>
      </el-form>
      <el-form :model="formConfig" ref="formConfig" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" v-show="stepTask == 2">
        <!-- <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
          <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">主键探查</p>
          <div style="width: 100%; height: auto; min-height: 60px; margin-top: 20px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="主键：" prop="primaryKeys">
                  <el-select v-model="formConfig.primaryKeys" filterable placeholder="请选择" multiple>
                    <el-option v-for="(item, index) in formConfig.columnsData" :label="item.columnName" :value="item.columnName" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div> -->
        <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
          <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">字段探查</p>
          <el-table element-loading-text="数据加载中" class="data-table" ref="tableColumns" :data="formConfig.columnsData" stripe :max-height="400" style="margin-top: 20px">
            <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
            <el-table-column prop="columnName" label="字段名称" min-width="120" align="left"> </el-table-column>
            <el-table-column prop="javaType" label="字段类型" min-width="100" align="left"> </el-table-column>
            <el-table-column prop="columnComment" label="字段描述" min-width="150" align="left" show-overflow-tooltip=""> </el-table-column>

            <el-table-column prop="columnComment" label="去重后总量" min-width="100" align="center">
              <template slot="header" slot-scope="scope">
                <el-checkbox v-model="columnsTitleCheck[0]" true-label="1" false-label="0" @change="columnsTitleCheckChange(0)">去重后总量</el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checkList[0]" true-label="1" false-label="0"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="columnComment" label="空值/空串比例" min-width="120" align="center">
              <template slot="header" slot-scope="scope"> <el-checkbox v-model="columnsTitleCheck[1]" true-label="1" false-label="0" @change="columnsTitleCheckChange(1)">空值/空串比例</el-checkbox> </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checkList[1]" true-label="1" false-label="0"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="columnComment" label="最大长度" min-width="100" align="center">
              <template slot="header" slot-scope="scope"> <el-checkbox v-model="columnsTitleCheck[2]" true-label="1" false-label="0" @change="columnsTitleCheckChange(2)">最大长度</el-checkbox> </template>
              <template slot-scope="scope">
                <el-checkbox :disabled="scope.row.javaType !== 'STRING'" v-model="scope.row.checkList[2]" true-label="1" false-label="0"></el-checkbox>
              </template>
            </el-table-column>

            <el-table-column prop="columnComment" label="最小长度" min-width="100" align="center">
              <template slot="header" slot-scope="scope"> <el-checkbox v-model="columnsTitleCheck[3]" true-label="1" false-label="0" @change="columnsTitleCheckChange(3)">最小长度</el-checkbox> </template>
              <template slot-scope="scope">
                <el-checkbox :disabled="scope.row.javaType !== 'STRING'" v-model="scope.row.checkList[3]" true-label="1" false-label="0"></el-checkbox>
              </template>
            </el-table-column>

            <el-table-column prop="columnComment" label="最大值" min-width="100" align="center">
              <template slot="header" slot-scope="scope"> <el-checkbox v-model="columnsTitleCheck[4]" true-label="1" false-label="0" @change="columnsTitleCheckChange(4)">最大值</el-checkbox> </template>
              <template slot-scope="scope">
                <el-checkbox :disabled="scope.row.javaType == 'STRING'" v-model="scope.row.checkList[4]" true-label="1" false-label="0"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="columnComment" label="最小值" min-width="100" align="center">
              <template slot="header" slot-scope="scope"> <el-checkbox v-model="columnsTitleCheck[5]" true-label="1" false-label="0" @change="columnsTitleCheckChange(5)">最小值</el-checkbox> </template>
              <template slot-scope="scope">
                <el-checkbox :disabled="scope.row.javaType == 'STRING'" v-model="scope.row.checkList[5]" true-label="1" false-label="0"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowTask = false" style="width: 120px">取 消</el-button>
        <el-button @click="stepTask -= 1" v-if="stepTask == 2" style="width: 120px">上一步</el-button>
        <el-button type="primary" @click="nextStep()" v-if="stepTask == 1" style="width: 120px">下一步</el-button>
        <el-button type="primary" v-if="addOrModifyTask && stepTask == 2" @click="addTask()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyTask && stepTask == 2" @click="modifyTask()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleCase" :visible.sync="dialogShowCase" width="1200px">
      <div style="width: 100%; height: auto; padding: 20px 0">
        <el-table class="data-table" ref="tableCase" :data="tableCase" border stripe max-height="500">
          <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
          <!-- <el-table-column prop="id" label="实例ID" min-width="100" align="center"> </el-table-column> -->
          <el-table-column prop="taskName" label="任务名称" min-width="280" align="left" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="detectTable" label="探查对象" min-width="140" align="left" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="operateBy" label="任务负责人" min-width="120" align="center"> </el-table-column>
          <el-table-column prop="runState" label="实例状态" min-width="120" align="center">
            <template slot-scope="scope">
              <span style="color: #67c23a" v-if="scope.row.runState == 'SUCCESS'">成功</span>
              <span style="color: #e6a23c" v-else-if="scope.row.runState == 'RUNNING'">运行中</span>
              <span style="color: #f56c6c" v-else-if="scope.row.runState == 'FAIL'">失败</span>
              <span v-else>{{ scope.row.runState || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" min-width="180" align="center"> </el-table-column>
          <el-table-column prop="endTime" label="结束时间" min-width="180" align="center"> </el-table-column>
          <el-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <p v-if="scope.row.runState == 'SUCCESS'" class="tableAction" @click="showCaseDetail(scope.row)">运行结果</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="运行结果" :visible.sync="dialogShowCaseDetail" width="1200px">
      <div style="width: 100%; height: auto; padding: 20px 0">
        <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">探查对象</p>
        <el-descriptions title="" border :column="1" style="margin: 10px auto 0 auto; width: 98%">
          <el-descriptions-item label="库表名称">{{ rowCase.taskName }}</el-descriptions-item>
          <el-descriptions-item label="探查对象">{{ rowCase.detectTable }}</el-descriptions-item>
        </el-descriptions>
        <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff; margin-top: 10px">表级探查结果</p>
        <el-descriptions title="" border direction="vertical" :column="4" style="margin: 10px auto 0 auto; width: 98%">
          <el-descriptions-item label="总记录数">-</el-descriptions-item>
          <el-descriptions-item label="主键去重记录数">-</el-descriptions-item>
          <el-descriptions-item label="结论" :span="2">-</el-descriptions-item>
        </el-descriptions>
        <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff; margin-top: 10px">字段常规探查</p>
        <el-table class="data-table" ref="tableCaseDetail" :data="tableCaseDetail" border style="margin: 10px auto 0 auto; width: 98%" stripe max-height="300">
          <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column prop="columnName" label="字段名称" min-width="120" align="left"> </el-table-column>
          <el-table-column prop="javaType" label="字段类型" min-width="100" align="left"> </el-table-column>
          <el-table-column prop="columnComment" label="字段描述" min-width="150" align="left" show-overflow-tooltip=""> </el-table-column>
          <el-table-column prop="x" label="去重后总量" min-width="100" align="center">
            <template slot-scope="scope">{{ tableCaseAll['total_' + scope.row.columnName] || '-' }}</template></el-table-column
          >

          <el-table-column prop="x" label="空值/空串比例" min-width="120" align="center">
            <template slot-scope="scope">{{ tableCaseAll['null_count_' + scope.row.columnName] || '-' }}</template></el-table-column
          >
          <el-table-column prop="x" label="最大长度" min-width="100" align="center">
            <template slot-scope="scope">{{ tableCaseAll['max_length_' + scope.row.columnName] || '-' }}</template></el-table-column
          >

          <el-table-column prop="x" label="最小长度" min-width="100" align="center">
            <template slot-scope="scope">{{ tableCaseAll['min_length_' + scope.row.columnName] || '-' }}</template></el-table-column
          >
          <el-table-column prop="x" label="最大值" min-width="100" align="center">
            <template slot-scope="scope">{{ tableCaseAll['max_' + scope.row.columnName] || '-' }}</template></el-table-column
          >

          <el-table-column prop="x" label="最小值" min-width="100" align="center">
            <template slot-scope="scope">{{ tableCaseAll['min_' + scope.row.columnName] || '-' }}</template></el-table-column
          >
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText, dateFormat } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'tableExploration',
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

      queryForm: {
        taskStatus: null,
        pageSize: 10,
        page: 1,
        total: 0
      },
      TaskData: [],
      loadingTask: true,

      dialogShowTask: false,
      titleTask: '',
      addOrModifyTask: true,
      stepTask: 1,
      dataTypeList: [],
      dataSourceList: [],
      dbNameList: [],
      tableNameList: [],
      formTask: {
        taskName: '',
        taskDesc: '',

        dataType: '',
        dataSourceId: '',
        dbName: '',
        tableName: ''
      },
      formConfig: {
        primaryKeys: [],
        columnsData: []
      },
      columnsTitleCheck: [0, 0, 0, 0, 0, 0],

      dialogShowCase: false,
      titleCase: '',
      tableCase: [],

      dialogShowCaseDetail: false,
      rowCase: '',
      tableCaseDetail: [],
      tableCaseAll: ''
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
      request({ url: '/data_source/type/list', method: 'get', params: {} }).then(res => {
        that.dataTypeList = res.data
        that.formTask.dataType = 'Hive'
        that.dataTypeChange()
      })
    },

    getTaskData() {
      let that = this
      that.loadingTask = true
      request({ url: '/formDetect/getFormDetectPage', method: 'get', params: { status: that.queryForm.taskStatus, page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.TaskData = res.data.list || []
        that.loadingTask = false
        that.queryForm.total = res.data.total
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 新建探查任务
    newTask() {
      let that = this
      that.addOrModifyTask = true
      that.stepTask = 1
      that.dialogShowTask = true
      that.buttonLoad = false
      that.titleTask = '新建形态探查任务信息'
      that.tableNameList = []
      resetForm('formTask', that)
      resetForm('formConfig', that)
      that.formConfig = {
        primaryKeys: [],
        columnsData: []
      }
    },
    // 数据源类型change
    dataTypeChange() {
      let that = this
      that.dataSourceList = []
      that.dbNameList = []
      that.tableNameList = []
      that.formTask.dataSourceId = ''
      that.formTask.dbName = ''
      that.formTask.tableName = ''
      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.formTask.dataType, page: 1, pageSize: 1000 } }).then(res => {
        that.dataSourceList = res.data.list || []
      })
    },
    // 数据源change
    dataSourceChange() {
      let that = this
      that.dbNameList = that.dataSourceList.filter(s => {
        return s.id == that.formTask.dataSourceId
      })
      that.tableNameList = []
      that.formTask.tableName = ''
      that.formTask.dbName = that.dbNameList[0].dbName
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formTask.dataSourceId } }).then(res => {
        that.tableNameList = res.data
      })
    },
    // 表change
    tableNameChange() {
      let that = this
      that.formTask.taskName = dateFormat('YYYYmmddHHMMSS', new Date()) + `探查${that.formTask.dataType}.${that.formTask.dbName}.${that.formTask.tableName}`
      that.formConfig.columnsData = []
      request({ url: '/data_source/columns', method: 'get', params: { id: that.formTask.dataSourceId, table: that.formTask.tableName } }).then(res => {
        let temp = []
        that.columnsTitleCheck = ['0', '1', '1', '1', '1', '1']
        if (res.data) {
          res.data.forEach((item, index) => {
            if (item.javaType == 'STRING') {
              temp.push({ ...item, checkList: ['0', '1', '1', '1', '0', '0'] })
            } else {
              temp.push({ ...item, checkList: ['0', '1', '0', '0', '1', '1'] })
            }
          })
        }
        that.formConfig.columnsData = temp
      })
    },

    // 下一步
    nextStep() {
      let that = this
      if (that.stepTask == 1) {
        that.$refs['formTask'].validate(valid => {
          if (valid) {
            that.stepTask += 1
          } else {
            Notify('error', '请将红色标注部分填写完整')
          }
        })
      }
    },
    columnsTitleCheckChange(i) {
      let that = this
      that.formConfig.columnsData.forEach((item, index) => {
        if (that.columnsTitleCheck[i] == '1') {
          if (i == 2 || i == 3) {
            if (item.javaType == 'STRING') {
              item.checkList[i] = '1'
            } else {
              item.checkList[i] = '0'
            }
          } else if (i == 4 || i == 5) {
            if (item.javaType != 'STRING') {
              item.checkList[i] = '1'
            } else {
              item.checkList[i] = '0'
            }
          } else {
            item.checkList[i] = '1'
          }

          item.checkList = JSON.parse(JSON.stringify(item.checkList))
        } else {
          item.checkList[i] = '0'
          item.checkList = JSON.parse(JSON.stringify(item.checkList))
        }
      })
    },
    // Task新增
    addTask() {
      let that = this
      let tempList = []
      that.formConfig.columnsData.forEach((item, index) => {
        tempList.push({ content: item.checkList.join(''), fieldName: item.columnName, fieldType: item.javaType, fieldDesc: item.columnComment })
      })
      let { dataType, dbName, ...params } = that.formTask
      params.formDetectFieldParam = {}
      params.formDetectFieldParam.list = tempList
      params.primaryKeyStr = that.formConfig.primaryKeys.join(',')
      params.id = null
      params.update = false
      that.buttonLoad = true
      request({ url: '/formDetect/add', method: 'post', data: params })
        .then(res => {
          res.code == 200 && Notify('success', res.message || '处理成功')
          setTimeout(() => {
            that.buttonLoad = false
          }, 300)
          if (res.code == '200') {
            that.dialogShowTask = false
            that.getTaskData()
          }
        })
        .catch(() => {
          setTimeout(() => {
            that.buttonLoad = false
          }, 300)
        })
    },
    modifyTask() {
      let that = this
      let tempList = []
      that.formConfig.columnsData.forEach((item, index) => {
        tempList.push({ content: item.checkList.join(''), fieldName: item.columnName, fieldType: item.javaType, fieldDesc: item.columnComment })
      })
      let { dataType, dbName, ...params } = that.formTask
      params.formDetectFieldParam = {}
      params.formDetectFieldParam.list = tempList
      params.primaryKeyStr = that.formConfig.primaryKeys.join(',')
      params.update = true
      that.buttonLoad = true
      request({ url: '/formDetect/add', method: 'post', data: params })
        .then(res => {
          res.code == 200 && Notify('success', res.message || '处理成功')
          setTimeout(() => {
            that.buttonLoad = false
          }, 300)
          if (res.code == '200') {
            that.dialogShowTask = false
            that.getTaskData()
          }
        })
        .catch(() => {
          setTimeout(() => {
            that.buttonLoad = false
          }, 300)
        })
    },
    // Task回显
    seeTask(row) {
      let that = this
      that.addOrModifyTask = false
      that.stepTask = 1
      that.dialogShowTask = true
      that.buttonLoad = false
      that.titleTask = '修改形态探查任务信息    [' + row.taskName + ']'
      resetForm('formTask', that)
      resetForm('formConfig', that)
      that.$nextTick(() => {
        let tempRow = { ...row }
        that.formTask.id = tempRow.id
        that.formTask.taskName = tempRow.taskName
        that.formTask.taskDesc = tempRow.taskDesc
        that.formTask.dataType = 'Hive'
        that.formTask.dataSourceId = tempRow.dataSourceId
        that.dbNameList = that.dataSourceList.filter(s => {
          return s.id == that.formTask.dataSourceId
        })
        that.formTask.dbName = that.dbNameList[0].dbName
        that.tableNameList = []
        that.formTask.tableName = tempRow.tableName
        that.formConfig.primaryKeys = tempRow.primaryKeyStr ? tempRow.primaryKeyStr.split(',') : []
        that.formConfig.columnsData = []
        JSON.parse(row.taskJson).list.forEach((item, index) => {
          that.formConfig.columnsData.push({ columnName: item.fieldName, javaType: item.fieldType, columnComment: item.fieldDesc, checkList: item.content.split('') })
        })
        that.columnsTitleCheck = ['0', '0', '0', '0', '0', '0']
        console.log(that.formConfig.columnsData)
        request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formTask.dataSourceId } }).then(res => {
          that.tableNameList = res.data
        })
      })

      // let that = this
      // request({ url: '/auto_api/get_by_id', method: 'get', params: { id: row.id } }).then(res => {
      //   that.addOrModifyTask = false
      //   that.stepTask = 1
      //   that.dialogShowTask = true
      //   that.buttonLoad = false
      //   that.titleTask = '修改形态探查任务信息    [' + row.apiName + ']'
      //   resetForm('formTask', that)
      //   resetForm('formConfig', that)
      //   that.formConfig = {
      //     apiOrderBy: [],
      //     requestParameterList: [],
      //     responseParameterList: []
      //   }
      //   that.$nextTick(() => {
      //     that.formTask.apiName = res.data.apiName
      //     that.formTask.apiCollectionId = res.data.apiCollectionId
      //     that.formTask.apiPath = res.data.apiPath.split('/')[3]
      //     that.formTask.apiCollectionPath = res.data.apiPath.split('/')[2]
      //     that.formTask.apiMethod = res.data.apiMethod
      //     that.formTask.apiDesc = res.data.apiDesc
      //     that.formTask.pageInfo = res.data.pageInfo
      //     that.formTask.pageSizeInfo = res.data.pageSizeInfo
      //     that.formConfig = {
      //       apiOrderBy: [],
      //       requestParameterList: res.data.requestParameterList,
      //       responseParameterList: res.data.responseParameterList
      //     }
      //     res.data.apiOrderBy.forEach(item => {
      //       that.formConfig.apiOrderBy.push({ orderByname: item })
      //     })
      //     that.formTask.dataType = 'MySQL'
      //     that.formTask.dataSourceId = res.data.dataSourceId
      //     request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.formTask.dataType } }).then(res2 => {
      //       that.dataSourceList = res2.data || []
      //       that.dbNameList = that.dataSourceList.filter(s => {
      //         return s.id == that.formTask.dataSourceId
      //       })
      //       that.formTask.dbName = that.dbNameList[0].dbName
      //       request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formTask.dataSourceId } }).then(res3 => {
      //         that.tableNameList = res3.data
      //         that.formTask.tableName = res.data.apiTableName
      //         request({ url: '/data_source/columns', method: 'get', params: { id: that.formTask.dataSourceId, table: that.formTask.tableName } }).then(res4 => {
      //           let temp = []
      //           if (res4.data) {
      //             res4.data.forEach((item, index) => {
      //               temp.push({ ...item, isRequest: false, isResponse: false, isOrderby: false })
      //             })
      //           }
      //           that.columnsData = temp
      //         })
      //       })
      //     })
      //   })
      // })
    },
    showCaseList(row) {
      let that = this
      that.dialogShowCase = true
      that.titleCase = '实例列表    [' + row.taskName + ']'
      request({ url: '/formDetect/getFormDetectRecordPage', method: 'get', params: { taskId: row.id, page: 1, pageSize: 10000 } }).then(res => {
        that.tableCase = res.data.list || []
        that.queryForm.total = res.data.total
        that.tableCaseDetail = []
        JSON.parse(row.taskJson).list.forEach((item, index) => {
          that.tableCaseDetail.push({ columnName: item.fieldName, javaType: item.fieldType, columnComment: item.fieldDesc })
        })
        setTimeout(() => {
          that.$refs.tableCase.doLayout()
        }, 300)
      })
    },
    showCaseDetail(row) {
      let that = this
      that.dialogShowCaseDetail = true
      that.$nextTick(() => {
        that.rowCase = { ...row }
        that.tableCaseAll = JSON.parse(row.recordJson)[0]
        for (let key in that.tableCaseAll) {
          if (that.tableCaseAll[key] == 0) {
            that.tableCaseAll[key] = '0'
          }
        }
        setTimeout(() => {
          that.$refs.tableCaseDetail.doLayout()
        }, 300)
      })
    },
    // 删除任务
    cancelTask(row) {
      let that = this
      that
        .$confirm('是否确定删除[' + row.taskName + ']形态探查任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/formDetect/delete', method: 'post', data: { id: row.id } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), that.getTaskData())
          })
        })
        .catch(() => {})
    },
    runTask(row) {
      let that = this
      this.$confirm('是否运行[' + row.taskName + ']形态探查任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request({ url: '/formDetect/run', method: 'post', data: { formDetectId: row.id } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '运行中'), that.getTaskData())
          })
        })
        .catch(() => {})
    }
    // runTask(row) {
    //   let that = this
    //   let loading = that.$loading({
    //     lock: true,
    //     text: '运行中,请稍候...',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   })
    //   request({ url: '/formDetect/run', method: 'post', data: { formDetectId: row.id } }).then(res => {
    //     loading.close()
    //     that.tableCaseDetail = []
    //     row.formDetectFieldParam.list.forEach((item, index) => {
    //       that.tableCaseDetail.push({ columnName: item.fieldName, javaType: item.fieldType, columnComment: item.fieldDesc })
    //     })
    //     that.tableCaseAll = res.data[0]
    //     for (let key in that.tableCaseAll) {
    //       if (that.tableCaseAll[key] == 0) {
    //         that.tableCaseAll[key] = '0'
    //       }
    //     }
    //     that.dialogShowCaseDetail = true
    //     setTimeout(() => {
    //       that.$refs.tableCaseDetail.doLayout()
    //     }, 300)
    //   })
    // }
  }
}
</script>

<style scoped>
</style>
