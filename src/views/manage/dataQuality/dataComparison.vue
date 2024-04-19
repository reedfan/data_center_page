<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain tableExploration">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <!-- <p class="searchLabel" style="width: auto">任务名称:</p>
        <div style="width: 13%; height: 42px; float: left; margin: 0 1%">
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
        <el-table-column prop="dataCompareName" label="任务名称" min-width="180" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="leftTableName" label="源表" min-width="80" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="rightTableName" label="比对表" min-width="80" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createBy" label="任务负责人" min-width="60" align="center"> </el-table-column>
        <el-table-column prop="status" label="任务状态" min-width="60" align="center">
          <template slot-scope="scope">
            <span style="color: #67c23a" v-if="scope.row.status == 'SUCCESS'">成功</span>
            <span style="color: #e6a23c" v-else-if="scope.row.status == 'RUNNING'">运行中</span>
            <span style="color: #f56c6c" v-else-if="scope.row.status == 'FAIL'">失败</span>
            <span v-else>{{ scope.row.status || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dataCompareDesc" label="描述" min-width="230" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="360" fixed="right">
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
        <el-step title="设置比对对象" icon="el-icon-edit-outline"></el-step>
        <el-step title="设置规则" icon="el-icon-folder-checked"></el-step>
        <el-step title="完成" icon="el-icon-s-promotion"></el-step>
      </el-steps>
      <el-form :model="formTask" ref="formTask" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" v-show="stepTask == 1">
        <div style="width: 100%; height: auto; margin: 10px auto 0 auto; overflow: hidden">
          <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">比对对象</p>
          <div style="width: 96%; height: auto; min-height: 150px; margin: 20px auto 0 auto">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="类型：" :required="true" prop="dataType">
                  <el-select disabled v-model="formTask.dataType" filterable placeholder="请选择类型" @change="dataTypeChange()">
                    <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数据源：" :required="true" prop="dataSourceId">
                  <el-select v-model="formTask.dataSourceId" filterable placeholder="请选择数据源" @change="dataSourceChange()">
                    <el-option v-for="(item, index) in dataSourceList" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24" v-show="false">
              <el-col :span="12">
                <el-form-item label="库：" :required="true" prop="dbName">
                  <el-select v-model="formTask.dbName" filterable placeholder="请选择库">
                    <el-option v-for="(item, index) in dbNameList" v-bind:key="index" :label="item.dbName" :value="item.dbName"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="源表：" :required="true" prop="leftTableName">
                  <el-select v-model="formTask.leftTableName" filterable placeholder="请选择表" @change="tableNameChangeLeft()">
                    <el-option v-for="(item, index) in tableNameList" v-bind:key="index" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="比对表：" :required="true" prop="rightTableName">
                  <el-select v-model="formTask.rightTableName" filterable placeholder="请选择表" @change="tableNameChangeRight()">
                    <el-option v-for="(item, index) in tableNameList" v-bind:key="index" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="源表where：" prop="leftFilterCondition">
                  <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model.trim="formTask.leftFilterCondition" autocomplete="off" placeholder=""> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="比对表where：" prop="rightFilterCondition">
                  <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model.trim="formTask.rightFilterCondition" autocomplete="off" placeholder=""> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12" style="text-align: right; margin-top: -18px" v-if="formTask.leftTableName">
                <el-button type="primary" @click="showEditWhere('leftFilterCondition')" size="small">编辑where</el-button>
              </el-col>
              <el-col :span="12" style="text-align: right; margin-top: -18px" v-if="formTask.rightTableName">
                <el-button type="primary" @click="showEditWhere('rightFilterCondition')" size="small">编辑where</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
          <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">基础信息</p>
          <div style="width: 96%; height: auto; min-height: 150px; margin: 20px auto 0 auto">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="任务名称：" :required="true" prop="dataCompareName">
                  <el-input v-model.trim="formTask.dataCompareName" autocomplete="off"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="描述：" prop="dataCompareDesc">
                  <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 100 }" v-model.trim="formTask.dataCompareDesc" autocomplete="off"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>

      <div style="width: 100%; height: auto; margin: 10px auto 0 auto" v-show="stepTask == 2">
        <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">比对字段</p>
        <el-table element-loading-text="数据加载中" class="data-table" ref="tableColumns" :data="compareFieldInfoParamList" border stripe :max-height="400" style="margin-top: 20px">
          <el-table-column prop="checked" label="字段比对" width="125" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked[0]" true-label="1" false-label="0" @change="checkedChange(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="checked" label="主键比对" width="125" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked[1]" true-label="1" false-label="0" @change="primartKeyChange(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="leftField" label="源表字段" min-width="120" align="left"> </el-table-column>
          <el-table-column prop="rightField" label="比对表字段" min-width="100" align="left">
            <template slot-scope="scope">
              <el-select v-model="scope.row.rightField" filterable placeholder="请选择" clearable>
                <el-option v-for="(item, index) in columnsDataRight" v-bind:key="index" :label="item.columnName" :value="item.columnName"></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowTask = false" style="width: 120px">取 消</el-button>
        <el-button @click="stepTask -= 1" v-if="stepTask == 2" style="width: 120px">上一步</el-button>
        <el-button type="primary" @click="nextStep()" v-if="stepTask == 1" style="width: 120px">下一步</el-button>
        <el-button type="primary" v-if="addOrModifyTask && stepTask == 2" @click="addTask()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyTask && stepTask == 2" @click="modifyTask()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑where" :visible.sync="dialogShowEditWhere" width="800px">
      <el-form :model="formEditWhere" ref="formEditWhere" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <el-row :gutter="24" v-for="(item, index) in formEditWhere.whereList" :key="index">
          <el-col :span="9">
            <el-form-item label="" :required="true" :prop="'whereList.' + index + '.column'" label-width="0">
              <el-select v-model="item.column" filterable placeholder="请选择" @change="columnChange(item, formEditWhere.type)">
                <el-option v-for="(item, index) in tableColumnsDataLeft" v-if="formEditWhere.type == 'leftFilterCondition'" v-bind:key="index" :label="item.columnName" :value="item.columnName"></el-option>
                <el-option v-for="(item, index) in tableColumnsDataRight" v-if="formEditWhere.type == 'rightFilterCondition'" v-bind:key="index" :label="item.columnName" :value="item.columnName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" :required="true" :prop="'whereList.' + index + '.flag'" label-width="0">
              <el-select v-model="item.flag" filterable placeholder="请选择">
                <el-option label="=" value="="></el-option>
                <el-option v-if="item.type == 'int'" label=">" value=">"></el-option>
                <el-option v-if="item.type == 'int'" label="<" value="<"></el-option>
                <el-option v-if="item.type == 'int'" label=">=" value=">="></el-option>
                <el-option v-if="item.type == 'int'" label="<=" value="<="></el-option>
                <el-option label="!=" value="!="></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" :required="true" :prop="'whereList.' + index + '.value'" label-width="0">
              <el-input v-model="item.value" autocomplete="off" placeholder="请输入"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" @click="formEditWhere.whereList.splice(index, 1)">删除</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24" style="text-align: left">
            <el-button type="primary" @click="formEditWhere.whereList.push({ column: '', flag: '', value: '' })" size="small" style="width: 100px">添加</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowEditWhere = false" style="width: 120px">取 消</el-button>
        <el-button type="primary" @click="editWhere(formEditWhere.type)" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleCase" :visible.sync="dialogShowCase" width="1200px">
      <div style="width: 100%; height: auto; padding: 20px 0">
        <el-table class="data-table" ref="tableCase" :data="tableCase" border stripe max-height="500">
          <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
          <!-- <el-table-column prop="id" label="实例ID" min-width="100" align="center"> </el-table-column> -->
          <el-table-column prop="leftTableCount" label="源表记录数" min-width="140" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="rightTableCount" label="比对表记录数" min-width="140" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="differentCount" label="字段内容不一致数" min-width="120" align="center"> </el-table-column>
          <el-table-column prop="runState" label="实例状态" min-width="120" align="center">
            <template slot-scope="scope">
              <span style="color: #67c23a" v-if="scope.row.runState == 'SUCCESS'">成功</span>
              <span style="color: #e6a23c" v-else-if="scope.row.runState == 'RUNNING'">运行中</span>
              <el-popover placement="top-start" v-else-if="scope.row.runState == 'FAIL'" title="失败日志" width="200" trigger="hover" :content="scope.row.errMsg">
                <el-button type="text" slot="reference" style="color: #f56c6c; padding: 0">失败</el-button>
              </el-popover>
              <span v-else>{{ scope.row.runState || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="操作时间" min-width="180" align="center"> </el-table-column>
          <el-table-column prop="createBy" label="操作人" min-width="180" align="center"> </el-table-column>
          <!-- <el-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <p v-if="scope.row.runState == 'SUCCESS'" class="tableAction" @click="showCaseDetail(scope.row)">运行结果</p>
            </template>
          </el-table-column> -->
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
  name: 'dataComparison',
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
        dataType: '',
        dbName: '',
        id: null,
        dataSourceId: 0,
        leftTableName: '',
        rightTableName: '',
        leftFilterCondition: '',
        rightFilterCondition: '',
        dataCompareDesc: '',
        dataCompareName: ''
      },
      columnsDataLeft: [],
      columnsDataRight: [],
      tableColumnsDataLeft: [],
      tableColumnsDataRight: [],
      compareFieldInfoParamList: [],

      dialogShowEditWhere: false,
      formEditWhere: {
        type: 'leftFilterCondition',
        whereList: [{ column: '', flag: '', value: '', type: '' }]
      },

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
      request({ url: '/table_compare/list', method: 'get', params: { status: that.queryForm.taskStatus, page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
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
      that.titleTask = '新建数据比对任务信息'
      that.tableNameList = []
      resetForm('formTask', that)
    },
    // 数据源类型change
    dataTypeChange() {
      let that = this
      that.dataSourceList = []
      that.dbNameList = []
      that.tableNameList = []
      that.formTask.dataSourceId = ''
      that.formTask.dbName = ''
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
      that.columnsDataLeft = []
      that.tableColumnsDataLeft = []
      that.columnsDataRight = []
      that.tableColumnsDataRight = []
      that.formTask.dbName = that.dbNameList[0].dbName
      that.formTask.leftTableName = ''
      that.formTask.rightTableName = ''
      that.formTask.leftFilterCondition = ''
      that.formTask.rightFilterCondition = ''
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formTask.dataSourceId } }).then(res => {
        that.tableNameList = res.data
      })
    },
    // 表changeLeft
    tableNameChangeLeft() {
      let that = this
      that.formTask.dataCompareName = dateFormat('YYYYmmddHHMMSS', new Date()) + `比对${that.formTask.leftTableName}和${that.formTask.rightTableName}`
      that.columnsDataLeft = []
      that.tableColumnsDataLeft = []
      that.formTask.leftFilterCondition = ''
      request({ url: '/data_source/columns', method: 'get', params: { id: that.formTask.dataSourceId, table: that.formTask.leftTableName } }).then(res => {
        if (res.data) {
          that.columnsDataLeft = res.data
          res.data.forEach((item, index) => {
            that.tableColumnsDataLeft.push({ columnName: that.formTask.leftTableName + '.' + item.columnName, columnType: item.columnType, javaType: item.javaType })
          })
        }
      })
    },
    // 表changeRight
    tableNameChangeRight() {
      let that = this
      that.formTask.dataCompareName = dateFormat('YYYYmmddHHMMSS', new Date()) + `比对${that.formTask.leftTableName}和${that.formTask.rightTableName}`
      that.columnsDataRight = []
      that.tableColumnsDataRight = []
      that.formTask.rightFilterCondition = ''
      request({ url: '/data_source/columns', method: 'get', params: { id: that.formTask.dataSourceId, table: that.formTask.rightTableName } }).then(res => {
        if (res.data) {
          that.columnsDataRight = res.data
          res.data.forEach((item, index) => {
            that.tableColumnsDataRight.push({ columnName: that.formTask.rightTableName + '.' + item.columnName, columnType: item.columnType, javaType: item.javaType })
          })
        }
      })
    },
    // 显示编辑where表单
    showEditWhere(type) {
      let that = this
      that.formEditWhere.whereList = []
      that.formEditWhere.type = type
      if (that.formTask[type]) {
        let arr = that.formTask[type].split(' and ')
        arr.forEach((item, index) => {
          let temp = []
          if (type == 'leftFilterCondition') {
            temp = that.tableColumnsDataLeft.filter(s => {
              return s.columnName == item.split(' ')[0]
            })
          }
          if (type == 'rightFilterCondition') {
            temp = that.tableColumnsDataRight.filter(s => {
              return s.columnName == item.split(' ')[0]
            })
          }
          if (temp[0]) {
            if (temp[0].columnType.includes('CHAR') || temp[0].columnType.includes('string') || temp[0].columnType.includes('char') || temp[0].columnType.includes('STRING')) {
              let reg = new RegExp("'", 'g')
              that.formEditWhere.whereList.push({ column: item.split(' ')[0], flag: item.split(' ')[1], value: item.split(' ')[2].replace(reg, ''), type: 'string' })
            } else {
              that.formEditWhere.whereList.push({ column: item.split(' ')[0], flag: item.split(' ')[1], value: item.split(' ')[2], type: 'int' })
            }
          }
        })
      } else {
        that.formEditWhere.whereList = [{ column: '', flag: '', value: '' }]
      }
      that.dialogShowEditWhere = true
    },
    columnChange(item, type) {
      let that = this
      let temp = []
      if (type == 'leftFilterCondition') {
        temp = that.tableColumnsDataLeft.filter(s => {
          return s.columnName == item.column
        })
      }
      if (type == 'rightFilterCondition') {
        temp = that.tableColumnsDataRight.filter(s => {
          return s.columnName == item.column
        })
      }
      if (temp[0].columnType.includes('CHAR') || temp[0].columnType.includes('string') || temp[0].columnType.includes('char') || temp[0].columnType.includes('STRING')) {
        item.type = 'string'
      } else {
        item.type = 'int'
      }
    },
    // 编辑where
    editWhere(type) {
      let that = this
      that.$refs['formEditWhere'].validate(valid => {
        if (valid) {
          let temp = []
          that.formEditWhere.whereList.forEach((item, index) => {
            if (item.type == 'string') {
              temp.push(item.column + ' ' + item.flag + ' ' + "'" + item.value + "'")
            } else {
              temp.push(item.column + ' ' + item.flag + ' ' + item.value)
            }
          })
          that.formTask[type] = temp.join(' and ')
          that.dialogShowEditWhere = false
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    // 下一步
    nextStep() {
      let that = this
      if (that.stepTask == 1) {
        that.$refs['formTask'].validate(valid => {
          if (valid) {
            that.stepTask += 1
            if (that.addOrModifyTask) {
              that.generateField()
            }
          } else {
            Notify('error', '请将红色标注部分填写完整')
          }
        })
      }
    },
    generateField() {
      let that = this
      that.compareFieldInfoParamList = []
      that.columnsDataLeft.forEach((item, index) => {
        if (that.columnsDataRight[index]) {
          that.compareFieldInfoParamList.push({ leftField: item.columnName, rightField: that.columnsDataRight[index].columnName, checked: ['1', '0'] })
        } else {
          that.compareFieldInfoParamList.push({ leftField: item.columnName, rightField: '', checked: ['0', '0'] })
        }
      })
    },
    // 主键勾选change
    primartKeyChange(row) {
      if (row.checked[1] == '1') {
        row.checked[0] = '0'
      }
    },
    // 勾选change
    checkedChange(row) {
      if (row.checked[0] == '1') {
        row.checked[1] = '0'
      }
    },

    // Task新增
    addTask() {
      let that = this
      let { dataType, dbName, ...params } = that.formTask
      params.primaryKeyInfo = { compareFieldInfoParamList: [] }
      params.compareFieldInfoList = { compareFieldInfoParamList: [] }
      let temp = []
      that.compareFieldInfoParamList.forEach((item, index) => {
        if ((item.checked[0] == '1' || item.checked[1] == '1') && item.rightField == '') {
          temp.push(item.leftField)
        }
        if (item.checked[0] == '1') {
          params.compareFieldInfoList.compareFieldInfoParamList.push({ leftField: item.leftField, rightField: item.rightField })
        }
        if (item.checked[1] == '1') {
          params.primaryKeyInfo.compareFieldInfoParamList.push({ leftField: item.leftField, rightField: item.rightField })
        }
      })
      if (temp.length == 0) {
        if (params.primaryKeyInfo.compareFieldInfoParamList.length > 0) {
          params.id = null
          params.update = false
          that.buttonLoad = true
          request({ url: '/table_compare/add', method: 'post', data: params })
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
        } else {
          Notify('error', '请至少选择一个主键字段！')
        }
      } else {
        Notify('error', '请为源表字段[' + temp.join(',') + ']选择对应比对表字段！')
      }
    },
    modifyTask() {
      let that = this
      let { dataType, dbName, ...params } = that.formTask
      params.primaryKeyInfo = { compareFieldInfoParamList: [] }
      params.compareFieldInfoList = { compareFieldInfoParamList: [] }
      let temp = []
      that.compareFieldInfoParamList.forEach((item, index) => {
        if ((item.checked[0] == '1' || item.checked[1] == '1') && item.rightField == '') {
          temp.push(item.leftField)
        }
        if (item.checked[0] == '1') {
          params.compareFieldInfoList.compareFieldInfoParamList.push({ leftField: item.leftField, rightField: item.rightField })
        }
        if (item.checked[1] == '1') {
          params.primaryKeyInfo.compareFieldInfoParamList.push({ leftField: item.leftField, rightField: item.rightField })
        }
      })
      if (temp.length == 0) {
        if (params.primaryKeyInfo.compareFieldInfoParamList.length > 0) {
          params.update = true
          that.buttonLoad = true
          request({ url: '/table_compare/add', method: 'post', data: params })
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
        } else {
          Notify('error', '请至少选择一个主键字段！')
        }
      } else {
        Notify('error', '请为源表字段[' + temp.join(',') + ']选择对应比对表字段！')
      }
    },
    // Task回显
    seeTask(row) {
      let that = this
      that.addOrModifyTask = false
      that.stepTask = 1
      that.dialogShowTask = true
      that.buttonLoad = false
      that.compareFieldInfoParamList = []
      that.titleTask = '修改数据比对任务信息    [' + row.dataCompareName + ']'
      resetForm('formTask', that)
      that.$nextTick(() => {
        let tempRow = { ...row }
        that.formTask.id = tempRow.id
        that.formTask.dataCompareName = tempRow.dataCompareName
        that.formTask.dataCompareDesc = tempRow.dataCompareDesc
        that.formTask.leftFilterCondition = tempRow.leftFilterCondition
        that.formTask.rightFilterCondition = tempRow.rightFilterCondition
        that.formTask.dataType = 'Hive'
        that.formTask.dataSourceId = tempRow.dataSourceId
        that.dbNameList = that.dataSourceList.filter(s => {
          return s.id == that.formTask.dataSourceId
        })
        that.formTask.dbName = that.dbNameList[0].dbName
        that.tableNameList = []
        that.formTask.leftTableName = tempRow.leftTableName
        that.formTask.rightTableName = tempRow.rightTableName
        that.columnsDataLeft = []
        that.tableColumnsDataLeft = []
        request({ url: '/data_source/columns', method: 'get', params: { id: that.formTask.dataSourceId, table: that.formTask.leftTableName } }).then(res => {
          if (res.data) {
            that.columnsDataLeft = res.data
            res.data.forEach((item, index) => {
              that.tableColumnsDataLeft.push({ columnName: that.formTask.leftTableName + '.' + item.columnName, columnType: item.columnType, javaType: item.javaType })
            })
          }
          that.columnsDataRight = []
          that.tableColumnsDataRight = []
          request({ url: '/data_source/columns', method: 'get', params: { id: that.formTask.dataSourceId, table: that.formTask.rightTableName } }).then(res => {
            if (res.data) {
              that.columnsDataRight = res.data
              res.data.forEach((item, index) => {
                that.tableColumnsDataRight.push({ columnName: that.formTask.rightTableName + '.' + item.columnName, columnType: item.columnType, javaType: item.javaType })
              })
            }
            that.columnsDataLeft.forEach((item, index) => {
              that.compareFieldInfoParamList.push({ leftField: item.columnName, rightField: '', checked: ['0', '0'] })
            })
            JSON.parse(row.primaryKeyInfo).compareFieldInfoParamList.forEach((item, index) => {
              that.compareFieldInfoParamList.forEach((item2, index2) => {
                if (item.leftField == item2.leftField) {
                  item2.rightField = item.rightField
                  item2.checked = ['0', '1']
                }
              })
            })
            JSON.parse(row.compareFieldInfo).compareFieldInfoParamList.forEach((item, index) => {
              that.compareFieldInfoParamList.forEach((item2, index2) => {
                if (item.leftField == item2.leftField) {
                  item2.rightField = item.rightField
                  item2.checked = ['1', '0']
                }
              })
            })
          })
        })
        // that.formConfig.columnsData = []
        // JSON.parse(row.taskJson).list.forEach((item, index) => {
        //   that.formConfig.columnsData.push({ columnName: item.fieldName, javaType: item.fieldType, columnComment: item.fieldDesc, checkList: item.content.split('') })
        // })
        // that.columnsTitleCheck = ['0', '0', '0', '0', '0', '0']
        // console.log(that.formConfig.columnsData)
        request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formTask.dataSourceId } }).then(res => {
          that.tableNameList = res.data
        })
      })
    },
    showCaseList(row) {
      let that = this
      that.dialogShowCase = true
      that.titleCase = '实例列表    [' + row.dataCompareName + ']'
      request({ url: '/table_compare/result/list', method: 'get', params: { tableCompareInfoId: row.id, page: 1, pageSize: 10000 } }).then(res => {
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
    runTask(row) {
      let that = this
      this.$confirm('是否运行[' + row.taskName + ']数据比对任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request({ url: '/table_compare/run', method: 'post', data: { id: row.id } }).then(res => {
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
