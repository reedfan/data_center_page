<template>
  <div class="manageMain selfService" style="flex-direction: row">
    <div style="width: 216px; padding: 10px 24px 10px 0; height: 100%; border-right: 1px solid #e4e6eb">
      <p style="width: 100%; height: 28px; line-height: 28px; border-bottom: 1px solid #e4e6eb; font-size: 12px; text-align: center; color: #333333">文件夹</p>
      <el-dropdown style="width: 100%; margin: 10px auto 0 auto" @command="handleCommand">
        <el-button icon="el-icon-plus" size="mini" style="width: 150px; margin: 0 auto; display: block"> 新建<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="wjj">新建文件夹</el-dropdown-item>
          <el-dropdown-item command="Query">新建Query</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tree v-if="treeWJJShow" style="height: calc(100% - 80px); margin-top: 10px; width: 100%; overflow: hidden auto" :props="treePropsWJJ" :load="loadWJJNode" :expand-on-click-node="false" lazy @node-click="handleNodeClickWJJ">
        <span slot-scope="{ node, data }">
          <div style="width: 180px; height: 100%; overflow: hidden" @contextmenu.prevent="showWJJQueryAction($event, data, node.level)">
            <i :class="node.level == 1 ? 'el-icon-folder-opened' : 'el-icon-document-add'" style="font-size: 16px; margin-right: 5px; float: left"></i>
            <p style="font-size: 12px; margin: 0; float: left; width: 140px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ node.label }}</p>
            <!-- <i class="el-icon-edit" @click.stop="data.level == 1 ? seeWJJ(data) : seeQuery(data)" style="color: #ffffff; margin-right: 10px; font-size: 16px; float: right" v-if="(data.level == 1 && activeFoldId == data.value) || (data.level == 2 && activeFileId == data.value)"></i> -->
          </div>
        </span>
      </el-tree>
    </div>
    <div style="width: calc(100% - 482px); height: 100%; border-right: 1px solid #e4e6eb">
      <div style="width: 100%; height: 50%; margin: 0 auto; position: relative; overflow: hidden" v-show="monacoEditorShow">
        <div style="width: 100%; height: 100%; position: relative; overflow: hidden; margin: 0 auto">
          <div style="height: 39px; width: 100%; border-bottom: 1px solid #e4e6eb">
            <el-tooltip content="运行" placement="bottom" v-if="monacoEditorShow">
              <i class="el-icon-caret-right" style="display: block; float: left; font-size: 26px; margin-top: 7px; margin-left: 10px; color: #0987e5; cursor: pointer" @click="runSql()"> </i>
            </el-tooltip>
            <el-tooltip content="清空" placement="bottom" v-if="monacoEditorShow">
              <i class="el-icon-delete" style="display: block; font-size: 20px; float: left; margin-top: 10px; margin-left: 10px; color: #666666; cursor: pointer" @click="resetSql()"> </i>
            </el-tooltip>
            <el-tooltip content="格式化" placement="bottom" v-if="monacoEditorShow">
              <i class="el-icon-c-scale-to-original" style="display: block; font-size: 20px; float: left; margin-top: 10px; margin-left: 10px; color: #666666; cursor: pointer" @click="formatSql()"> </i>
            </el-tooltip>
            <el-tooltip content="切换主题" placement="bottom" v-if="monacoEditorShow">
              <i class="el-icon-sunrise-1" style="display: block; font-size: 20px; float: left; margin-top: 10px; margin-left: 10px; color: #666666; cursor: pointer" @click="changeTheme()"> </i>
            </el-tooltip>
            <el-tooltip content="Hive配置" placement="bottom" v-if="monacoEditorShow && dataType == 'Hive'">
              <i class="el-icon-setting" style="display: block; font-size: 20px; float: left; margin-top: 10px; margin-left: 10px; color: #666666; cursor: pointer" @click="showHiveConfig()"> </i>
            </el-tooltip>
            <el-tooltip content="保存" placement="bottom" v-if="monacoEditorShow">
              <i class="el-icon-document-checked" style="display: block; font-size: 20px; float: left; margin-top: 10px; margin-left: 10px; color: #0987e5; cursor: pointer" @click="saveQuery()"> </i>
            </el-tooltip>
          </div>
          <div v-if="monacoEditorShow" id="code-editor" ref="code-editor" style="height: calc(100% - 40px); width: 100%; margin-top: 10px"></div>
          <!-- <el-empty style="width: 100%; height: 100%" description=" " v-if="!monacoEditorShow"></el-empty> -->
        </div>
      </div>
      <div style="width: 100%; height: calc(50% - 5px); position: relative; overflow: hidden; margin: 5px auto 0 auto" v-show="monacoEditorShow">
        <div style="width: 100%; height: 100%; margin: 0 auto; position: relative; overflow: hidden">
          <el-tabs style="height: 100%" v-model="bottomTab" class="selfTopTabs" type="border-card">
            <el-tab-pane style="height: 100%" label="运行结果" name="运行结果">
              <el-empty style="width: 100%; height: 100%" description="暂无运行结果" v-show="tableResultList.length == 0"></el-empty>
              <el-tabs v-show="tableResultList.length > 0" v-model="tableResultListTab" style="width: 100%; height: 100%; margin: 0 auto" class="selfBottomTabs" type="border-card" closable @tab-remove="removeTableResultTab">
                <el-tab-pane v-for="(item, index) in tableResultList" :key="index" style="height: 100%" :label="'运行' + item.count" :name="'result' + item.count">
                  <p v-if="!item.loadingResult" class="tableAction" @click="exportTableResultExcel(item.tableResult, '运行' + item.count)">导出Excel</p>
                  <p v-if="!item.loadingResult" class="tableAction" @click="exportTableResultCsv(item.tableResult, '运行' + item.count)">导出Csv</p>
                  <p v-if="!item.loadingResult" class="tableAction" @click="exportTableResultTxt(item.tableResult, '运行' + item.count)">导出Txt</p>
                  <el-table v-loading="item.loadingResult" element-loading-text="数据加载中" :ref="'tableResult' + item.count" :data="item.tableResult">
                    <template v-slot:append>
                      <el-button v-if="item.loadingResult && item.jobId" type="danger" @click="killSparkJob(item)" size="mini" style="position: absolute; top: calc(50% + 45px); left: 50%; transform: translate(-50%, -50%); z-index: 2001"> 结束进程 </el-button>
                    </template>
                    <el-table-column type="index" label="序号" align="center" width="60" fixed="left"> </el-table-column>
                    <el-table-column :prop="item2" :label="item2" min-width="270" align="center" v-for="(item2, index2) in item.columnsResult" :key="index2">
                      <template slot-scope="scope">
                        {{ scope.row[item2] }}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane style="height: 100%" label="运行历史" name="运行历史">
              <div class="tableArea" style="margin-top: 0">
                <el-table v-loading="loadingHistory" element-loading-text="数据加载中" ref="tableHistory" :data="tableHistory" height="100%">
                  <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
                  <el-table-column prop="dataSourceId" label="数据来源" min-width="100" align="left"> </el-table-column>
                  <el-table-column prop="dataSourceType" label="类型" min-width="100" align="left"> </el-table-column>
                  <el-table-column prop="querySql" label="查询语句" width="400" align="left">
                    <template slot-scope="scope">
                      <div style="width: 100%; height: 100%; display: flex; align-items: center">
                        <p style="max-width: 360px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis" :title="scope.row.querySql">{{ scope.row.querySql }}</p>
                        <i class="el-icon-document-copy" style="cursor: pointer; vertical-align: middle; margin-left: 5px" @click="copyText(scope.row.querySql)"></i>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="runStartTime" label="开始时间" min-width="100" align="left"> </el-table-column>
                  <el-table-column prop="costTime" label="运行时长" min-width="100" align="left">
                    <template slot-scope="scope">
                      <template>{{ scope.row.costTime }}s</template>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination :pageSize="queryFormHistorty.pageSize" :pageNum.sync="queryFormHistorty.page" :total="queryFormHistorty.total" :getTableData="getHistoryData"> </pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div style="width: 216px; padding: 10px 0 10px 20px; height: 100%">
      <p style="width: 100%; height: 28px; line-height: 28px; border-bottom: 1px solid #e4e6eb; font-size: 12px; text-align: center; color: #333333">库表信息</p>
      <el-select style="margin-top: 10px" v-model="dataType" filterable placeholder="请选择类型" @change="typeChangeOut()">
        <el-option v-for="(item, index) in dataTypeListOut" v-bind:key="index" :label="item" :value="item"></el-option>
      </el-select>
      <el-select style="margin-top: 10px" v-model="activeSJYId" filterable placeholder="请选择数据源" @change="dataSourceChangeOut()">
        <el-option v-for="(item, index) in dataSourceListOut" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
      </el-select>
      <div style="width: 100%; height: calc(100% - 145px); overflow: hidden auto; margin-top: 10px" v-if="treeTableInSource.length != 0">
        <el-tree :data="treeTableInSource" :props="treeTableInSourceProps">
          <template slot-scope="{ node, data }">
            <span style="font-size: 12px"> <i :class="node.level == 1 ? 'el-icon-coin' : 'el-icon-c-scale-to-original'" style="margin-right: 5px"></i>{{ data.label }} </span>
          </template>
        </el-tree>
      </div>
    </div>

    <el-dialog title="Hive配置" :visible.sync="dialogShowHiveConfig" width="550px">
      <el-form :model="formHiveConfig" ref="formHiveConfig" label-width="150px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="driverMemory(GB)" prop="driverMemory">
                <el-input-number v-model.trim="formHiveConfig.driverMemory" :min="1" :max="4" :step="1" step-strictly size="small"> </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="executorMemory(GB)" prop="executorMemory">
                <el-input-number v-model.trim="formHiveConfig.executorMemory" :min="1" :max="4" :step="1" step-strictly size="small"> </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="executorCores" prop="executorCores">
                <el-input-number v-model.trim="formHiveConfig.executorCores" :min="1" :max="4" :step="1" step-strictly size="small"> </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="appResourcePath" prop="appResourcePath">
                <el-input v-model.trim="formHiveConfig.appResourcePath"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="deployMode" prop="deployMode">
                <el-input v-model.trim="formHiveConfig.deployMode"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="executeMainClass" prop="executeMainClass">
                <el-input v-model.trim="formHiveConfig.executeMainClass"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="formDetectMainClass" prop="formDetectMainClass">
                <el-input v-model.trim="formHiveConfig.formDetectMainClass"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="masterUrl" prop="masterUrl">
                <el-input v-model.trim="formHiveConfig.masterUrl"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="monitorRuleMainClass" prop="monitorRuleMainClass">
                <el-input v-model.trim="formHiveConfig.monitorRuleMainClass"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="queryMainClass" prop="queryMainClass">
                <el-input v-model.trim="formHiveConfig.queryMainClass"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="sparkHomeDir" prop="sparkHomeDir">
                <el-input v-model.trim="formHiveConfig.sparkHomeDir"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="tableCompareMainClass" prop="tableCompareMainClass">
                <el-input v-model.trim="formHiveConfig.tableCompareMainClass"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click=";(dialogShowHiveConfig = false), (isHiveConfig = false)" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" @click=";(dialogShowHiveConfig = false), (isHiveConfig = true)" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleWJJ" :visible.sync="dialogShowWJJ" width="550px">
      <el-form :model="formWJJ" ref="formWJJ" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="文件夹名称" prop="folderName" :required="true">
                <el-input v-model.trim="formWJJ.folderName" autocomplete="off" o> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowWJJ = false" style="width: 100px" size="mini">取 消</el-button>

        <el-button type="primary" v-if="addOrModifyWJJ" @click="addWJJ()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyWJJ" @click="modifyWJJ()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleQuery" :visible.sync="dialogShowQuery" width="550px">
      <el-form :model="formQuery" ref="formQuery" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="Query名称：" :required="true" prop="fileName">
                <el-input v-model.trim="formQuery.fileName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="数据源类型：" :required="true" prop="dataSourceType">
                <el-select v-model="formQuery.dataSourceType" filterable placeholder="请选择类型" @change="typeChange()">
                  <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="数据源：" :required="true" prop="dataSourceInfoId">
                <el-select v-model="formQuery.dataSourceInfoId" filterable placeholder="请选择数据源">
                  <el-option v-for="(item, index) in dataSourceList" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="保存位置：" prop="dataQueryFolderId" :required="true">
                <el-select v-model="formQuery.dataQueryFolderId" filterable placeholder="请选择文件夹">
                  <el-option v-for="(item, index) in listWJJ" v-bind:key="index" :label="item.folderName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowQuery = false" style="width: 100px" size="mini">取 消</el-button>

        <el-button type="primary" v-if="addOrModifyQuery" @click="addQuery()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyQuery" @click="modifyQuery()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
import * as monaco from 'monaco-editor'
import { language } from 'monaco-editor/esm/vs/basic-languages/sql/sql'
const { keywords } = language
import { format } from 'sql-formatter'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
export default {
  name: 'selfService',
  components: {
    pagination
  },
  data() {
    return {
      empty: '',
      rules: {
        test: []
      },

      dataType: '',
      activeSJYId: '',
      dataTypeListOut: [],
      dataSourceListOut: [],
      treeTableInSource: [],
      treeTableInSourceProps: {
        children: 'children',
        label: 'label'
      },
      treeWJJShow: true,
      treePropsWJJ: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      activeFoldId: '',
      activeFileId: '',

      buttonLoad: false,

      titleTable: '',
      dialogShowTable: false,
      tableList: [],
      activeTable: '',
      loadingTable: false,
      loadingColumns: false,
      columnsData: [],

      bottomTab: '运行结果',

      cancelJobIds: [],
      tableResultList: [],
      tableResultListTab: '运行1',

      getHiveRecordTimeOut: 0,
      tableHistory: [],
      loadingHistory: false,
      queryFormHistorty: {
        page: 1,
        pageSize: 10,
        total: 0
      },

      // 编辑器实例
      monacoEditor: null,
      monacoEditorShow: false,
      monacoProviderRef: '',
      monacoThemeCount: 0,
      // 补全的数据，建议在编辑器初始化之间就请求回来放好
      sqlTables: {},

      dialogShowHiveConfig: false,
      formHiveConfig: {
        driverMemory: '',
        executorMemory: '',
        executorCores: '',

        appResourcePath: '',
        deployMode: '',
        executeMainClass: '',
        formDetectMainClass: '',
        masterUrl: '',
        monitorRuleMainClass: '',
        queryMainClass: '',
        sparkHomeDir: '',
        tableCompareMainClass: ''
      },
      isHiveConfig: false,

      formWJJ: {
        folderName: ''
      },
      dialogShowWJJ: false,
      titleWJJ: '',
      addOrModifyWJJ: true,

      formQuery: {
        dataSourceType: '',
        dataSourceInfoId: '',
        dataQueryFolderId: '',
        fileName: '',
        querySql: ''
      },
      dialogShowQuery: false,
      titleQuery: '',
      addOrModifyQuery: true,
      listWJJ: [],
      dataTypeList: [],
      dataSourceList: []
    }
  },
  mounted() {
    this.getDataTypeListOut()

    window.onresize = () => {
      return (() => {
        this.$store.state.globalHeight = document.documentElement.clientHeight
        setTimeout(() => {
          this.$refs.tableHistory.doLayout()
        }, 300)
      })()
    }
  },
  beforeDestroy() {
    // 销毁之前把monaco的实例也销毁了，不然会多次注册
    if (this.monacoEditor) {
      this.monacoEditor.dispose()
    }
  },
  methods: {
    loadWJJNode(node, resolve) {
      let that = this
      console.log(node)
      if (node.level === 0) {
        let tempLevel1 = []
        request({ url: '/data_query_folder/list', method: 'get', params: {} }).then(res => {
          res.data.forEach((item, index) => {
            tempLevel1.push({ name: item.folderName, value: item.id, level: 1 })
          })
          return resolve(tempLevel1)
        })
      }
      if (node.level === 1) {
        let tempLevel2 = []
        request({ url: '/data_query_folder/get_by_folder_id', method: 'get', params: { folderId: node.data.value } }).then(res => {
          if (res.data.fileList) {
            res.data.fileList.forEach((item, index) => {
              tempLevel2.push({ name: item.fileName, value: item.id, whole: item, level: 2, children: [], leaf: true })
            })
          }

          return resolve(tempLevel2)
        })
      }
      if (node.level > 1) return resolve([])
    },
    handleNodeClickWJJ(data) {
      let that = this
      if (data.level == 1) {
        that.activeFoldId = data.value
      }
      if (data.level == 2) {
        that.activeFoldId = ''
        that.activeFileId = data.value
        that.activeSJYId = data.whole.dataSourceInfoId
        that.dataType = data.whole.dataSourceType

        request({ url: '/data_query_file/get', method: 'get', params: { id: data.value } }).then(res => {
          that.formQuery.dataSourceInfoId = res.data.dataSourceInfoId
          that.formQuery.dataQueryFolderId = res.data.dataQueryFolderId
          that.formQuery.dataSourceType = res.data.dataSourceType
          that.formQuery.fileName = res.data.fileName
          that.formQuery.id = res.data.id
          that.formQuery.userId = res.data.userId
          that.initEditor(res.data.querySql)
        })
        request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: data.whole.dataSourceType, page: 1, pageSize: 1000 } }).then(res => {
          that.dataSourceListOut = res.data.list || []
        })
        that.getHistoryData()
      }
    },
    // 展示表
    showTable(row) {
      let that = this
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.activeSJYId } }).then(res => {
        if (res.code == 200) {
          that.titleTable = that.activeSJYName
          that.dialogShowTable = true
          that.loadingTable = true
          that.loadingColumns = false
          that.tableList = []
          that.activeTable = ''
          that.columnsData = []
          that.$nextTick(() => {
            that.tableList = res.data || []
            that.loadingTable = false
            that.activeTable = res.data[0] || ''
            that.activeTable && that.getColumns()
          })
        }
      })
    },

    // 根据表获取表头
    getColumns() {
      let that = this
      that.loadingColumns = true
      if (that.activeTable) {
        request({ url: '/data_source/columns', method: 'get', params: { id: that.activeSJYId, table: that.activeTable } }).then(res => {
          that.columnsData = res.data || []
          that.loadingColumns = false
          setTimeout(() => {
            that.$refs.tableColumns.doLayout()
          }, 300)
        })
      }
    },

    // 切换数据来源
    handleTabClick(tab, event) {
      let that = this
      that.initEditor()
      that.getHistoryData()
    },
    // 初始化编辑器
    initEditor(querySql) {
      let that = this
      // if (that.monacoEditor) {
      //   that.monacoEditor.dispose()
      // }
      that.sqlTables = {}
      that.monacoEditorShow = false
      if (that.monacoProviderRef) {
        that.monacoProviderRef.dispose()
      }
      that.treeTableInSource = []
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.activeSJYId } }).then(res => {
        if (res.code == 200) {
          if (res.data) {
            res.data.forEach(item => {
              let temp = { label: item, value: item, children: [] }
              that.sqlTables[item] = []
              request({ url: '/data_source/columns', method: 'get', params: { id: that.activeSJYId, table: item } }).then(res2 => {
                res2.data.forEach(item2 => {
                  that.sqlTables[item].push(item2.columnName)
                  temp.children.push({ label: item2.columnName, value: item2.columnName, columnType: item2.columnType, javaType: item2.javaType })
                })
              })
              that.treeTableInSource.push(temp)
            })
          }
          console.log(that.treeTableInSource)
          that.monacoEditorShow = true
          that.$nextTick(() => {
            that.initAutoCompletion()
            // 初始化编辑器
            that.monacoEditor = monaco.editor.create(document.getElementById('code-editor'), {
              value: querySql, // 初始文字
              language: 'sql', // 语言
              readOnly: false, // 是否只读
              automaticLayout: true, // 自动布局
              theme: 'vs', // vs | hc-black | vs-dark
              minimap: {
                enabled: false // 关闭小地图
              },
              tabSize: 2, // tab缩进长度
              fontSize: 12 // 文字大小
            })
            const self = this
            this.formatProvider = monaco.languages.registerDocumentFormattingEditProvider('sql', {
              provideDocumentFormattingEdits(model) {
                return [
                  {
                    text: self.formatSql(1),
                    range: model.getFullModelRange()
                  }
                ]
              }
            })
          })
        }
      })
    },
    formatSql(needValue) {
      this.clearMistake()
      try {
        this.monacoEditor.setValue(format(this.monacoEditor.getValue(), { language: 'spark', tabWidth: 2, keywordCase: 'upper', linesBetweenQueries: 2 }))
      } catch (e) {
        console.log(e)
        const { message } = e
        const list = message.split(' ')
        const line = list.indexOf('line')
        const column = list.indexOf('column')
        this.markMistake(
          {
            startLineNumber: Number(list[line + 1]),
            endLineNumber: Number(list[line + 1]),
            startColumn: Number(list[column + 1]),
            endColumn: Number(list[column + 1])
          },
          'Error',
          message
        )
      }

      if (needValue) {
        return this.monacoEditor.getValue()
      }
    },
    // 标记错误信息
    markMistake(range, type, message) {
      console.log(message)
      const { startLineNumber, endLineNumber, startColumn, endColumn } = range
      monaco.editor.setModelMarkers(this.monacoEditor.getModel(), 'eslint', [
        {
          startLineNumber,
          endLineNumber,
          startColumn,
          endColumn,
          severity: monaco.MarkerSeverity[type], // type可以是Error,Warning,Info
          message
        }
      ])
    },
    // 清除错误信息
    clearMistake() {
      monaco.editor.setModelMarkers(this.monacoEditor.getModel(), 'eslint', [])
    },
    runSql() {
      let that = this
      console.log()
      that.bottomTab = '运行结果'
      let tempCount = that.tableResultList.length > 0 ? that.tableResultList[that.tableResultList.length - 1].count + 1 : 1
      that.tableResultList.push({
        count: tempCount,
        querySql: that.monacoEditor.getModel().getValueInRange(that.monacoEditor.getSelection()) || that.monacoEditor.getValue(),
        tableResult: [],
        columnsResult: [],
        loadingResult: true,
        jobId: ''
      })
      that.tableResultListTab = 'result' + that.tableResultList[that.tableResultList.length - 1].count
      let params = {
        querySql: that.monacoEditor.getModel().getValueInRange(that.monacoEditor.getSelection()) || that.monacoEditor.getValue(),
        dataSourceInfoId: that.formQuery.dataSourceInfoId
      }
      if (that.dataType == 'Hive' && that.isHiveConfig) {
        params = { ...params, ...that.formHiveConfig }
      }

      request({ url: '/query/result', method: 'post', data: params })
        .then(res => {
          if (res.code == 200) {
            if (that.dataType == 'Hive') {
              that.tableResultList.find(item => item.count == tempCount).jobId = res.data.jobId
              that.getHiveRecordTimeOut = 1000
              // setTimeout(() => {
              //   that.getHiveRecord(res.data.jobId, tempCount)
              // }, 10000)
              that.getHiveRecord(res.data.jobId, tempCount)
            } else {
              that.tableResultList.find(item => item.count == tempCount).loadingResult = false
              that.tableResultList.find(item => item.count == tempCount).tableResult = res.data.jsonArray || []

              if (res.data.jsonArray[0]) {
                that.tableResultList.find(item => item.count == tempCount).columnsResult = Object.keys(res.data.jsonArray[0])
              } else {
                that.tableResultList.find(item => item.count == tempCount).columnsResult = ['-']
              }
              that.getHistoryData()
            }
          } else {
            that.tableResultList.find(item => item.count == tempCount).columnsResult = ['-']
            that.tableResultList.find(item => item.count == tempCount).tableResult = []
            that.tableResultList.find(item => item.count == tempCount).loadingResult = false
          }
        })
        .catch(err => {
          that.tableResultList.find(item => item.count == tempCount).columnsResult = ['-']
          that.tableResultList.find(item => item.count == tempCount).tableResult = []
          that.tableResultList.find(item => item.count == tempCount).loadingResult = false
        })
    },
    resetSql() {
      this.monacoEditor.setValue('')
    },
    changeTheme(theme) {
      let that = this
      that.monacoThemeCount += 1
      if (that.monacoThemeCount % 3 == 0) {
        monaco.editor.setTheme('vs')
      }
      if (that.monacoThemeCount % 3 == 1) {
        monaco.editor.setTheme('hc-black')
      }
      if (that.monacoThemeCount % 3 == 2) {
        monaco.editor.setTheme('vs-dark')
      }
    },
    showHiveConfig() {
      let that = this
      that.dialogShowHiveConfig = true
      resetForm('formHiveConfig', that)
      that.formHiveConfig = {
        driverMemory: 1,
        executorMemory: 1,
        executorCores: 1
      }
    },

    getHiveRecord(jobId, tempCount) {
      let that = this
      console.log(tempCount)
      console.log(that.tableResultList.find(item => item.count == tempCount))
      if (that.cancelJobIds.includes(that.tableResultList.find(item => item.count == tempCount).jobId)) {
        return
      }
      request({ url: '/spark_query_record/get_by_job_id', method: 'get', params: { jobId: jobId } }).then(res => {
        if (res.message == '该任务正在查询中') {
          if (that.getHiveRecordTimeOut < 15000) {
            that.getHiveRecordTimeOut += 2000
          }
          setTimeout(() => {
            that.getHiveRecord(jobId, tempCount)
          }, that.getHiveRecordTimeOut)
        } else {
          that.tableResultList.find(item => item.count == tempCount).tableResult = res.data || []
          that.tableResultList.find(item => item.count == tempCount).loadingResult = false

          if (res.data[0]) {
            that.tableResultList.find(item => item.count == tempCount).columnsResult = Object.keys(res.data[0])
          } else {
            that.tableResultList.find(item => item.count == tempCount).columnsResult = ['-']
          }
          that.getHistoryData()
        }
      })
    },
    exportTableResultExcel(tableData, excelName) {
      const worksheet = XLSX.utils.json_to_sheet(tableData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      XLSX.writeFile(workbook, excelName + '.xlsx')
    },
    exportTableResultCsv(tableData, excelName) {
      const worksheet = XLSX.utils.json_to_sheet(tableData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      XLSX.writeFile(workbook, excelName + '.csv')
    },
    exportTableResultTxt(tableData, excelName) {
      const file = new File([JSON.stringify(tableData)], excelName + '.txt', {
        type: 'text/plain;charset=utf-8'
      })
      saveAs(file)
    },
    killSparkJob(row) {
      let that = this
      that.cancelJobIds.push(row.jobId)
      row.tableResult = []
      row.columnsResult = ['-']
      row.loadingResult = false
      request({ url: '/spark_job/kill', method: 'post', data: { jobId: row.jobId } }).then(res => {
        res.code == 200 && Notify('success', res.message || '处理成功')
      })
    },

    getHistoryData() {
      let that = this
      that.loadinHistory = true
      request({ url: '/query/list', method: 'get', params: { dataSourceId: that.activeSJYId, page: that.queryFormHistorty.page, pageSize: that.queryFormHistorty.pageSize } }).then(res => {
        that.tableHistory = res.data.list || []
        that.queryFormHistorty.total = res.data.total || 0
        that.loadingHistory = false
        setTimeout(() => {
          that.$refs.tableHistory.doLayout()
        }, 300)
      })
    },
    removeTableResultTab(targetName) {
      this.tableResultList = this.tableResultList.filter(item => 'result' + item.count !== targetName)
    },
    // 初始化自动补全
    initAutoCompletion() {
      this.monacoProviderRef = monaco.languages.registerCompletionItemProvider('sql', {
        // 触发提示的字符
        triggerCharacters: ['.', ' ', ...keywords],
        provideCompletionItems: (model, position) => {
          let suggestions = []
          // 行号，列号
          const { lineNumber, column } = position
          // 光标之前的所有字符，即从这一行的 0 到当前的字符
          const textBeforePointer = model.getValueInRange({
            startLineNumber: lineNumber,
            startColumn: 0,
            endLineNumber: lineNumber,
            endColumn: column
          })
          // trim() 取消两边空格，保证拆分出来前后都不是空值
          // \s是指空白，包括空格、换行、tab缩进等所有的空白
          const words = textBeforePointer.trim().split(/\s+/)
          // 最后的一个有效词
          const lastWord = words[words.length - 1]
          if (lastWord.endsWith('.')) {
            // 如果这个词以 . 结尾，那么认为是希望补全表的字段
            // 拿到真实的表名，把 . 去掉
            const tableName = lastWord.slice(0, lastWord.length - 1)
            if (Object.keys(this.sqlTables).includes(tableName)) {
              suggestions = [...this.getFieldsSuggest(tableName)]
            }
          } else if (lastWord === '.') {
            // 如果这个词本身就是一个 . 即点前面是空的，那么什么都不用补全了
            // 按理说这应该是个语法错误
            suggestions = []
          } else {
            // 其他时候都补全表名，以及关键字
            suggestions = [...this.getTableSuggest(), ...this.getKeywordsSuggest()]
          }
          console.log(suggestions)
          return {
            suggestions
          }
        }
      })
    },
    /**
     * @description: 获取关键字的补全列表
     * @tips: CompletionItemKind 的所有枚举可以在monaco.d.ts 文件中找到，有二十多个，取需即可
     */
    getKeywordsSuggest() {
      return keywords.map(key => ({
        label: key, // 显示的名称
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: key // 真实补全的值
      }))
    },

    /**
     * @description: 获取表名的补全列表
     */
    getTableSuggest() {
      console.log(this.sqlTables)
      return Object.keys(this.sqlTables).map(key => ({
        label: key, // 显示的名称
        kind: monaco.languages.CompletionItemKind.Variable,
        insertText: key // 真实补全的值
      }))
    },
    /**
     * @description: 根据表名获取字段补全列表
     * @param {*} tableName
     */
    getFieldsSuggest(tableName) {
      const fields = this.sqlTables[tableName]
      if (!fields) {
        return []
      }
      return fields.map(name => ({
        label: name,
        kind: monaco.languages.CompletionItemKind.Field,
        insertText: name
      }))
    },
    // 复制到剪切板
    copyText(text) {
      copyText(text)
    },
    getListWJJ() {
      let that = this
      request({ url: '/data_query_folder/list', method: 'get', params: {} }).then(res => {
        that.listWJJ = res.data
      })
    },
    getDataTypeList() {
      let that = this
      request({ url: '/data_source/type/self_service/list', method: 'get', params: {} }).then(res => {
        that.dataTypeList = res.data
      })
    },
    getDataTypeListOut() {
      let that = this
      request({ url: '/data_source/type/self_service/list', method: 'get', params: {} }).then(res => {
        that.dataTypeListOut = res.data
      })
    },
    typeChange() {
      let that = this
      that.formQuery.dataSourceInfoId = ''
      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.formQuery.dataSourceType, page: 1, pageSize: 1000 } }).then(res => {
        that.dataSourceList = res.data.list || []
      })
    },
    typeChangeOut() {
      let that = this
      that.activeSJYId = ''
      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.dataType, page: 1, pageSize: 1000 } }).then(res => {
        that.dataSourceListOut = res.data.list || []
      })
    },
    dataSourceChangeOut() {
      let that = this
      that.treeTableInSource = []
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.activeSJYId } }).then(res => {
        if (res.code == 200) {
          if (res.data) {
            res.data.forEach(item => {
              let temp = { label: item, value: item, children: [] }
              request({ url: '/data_source/columns', method: 'get', params: { id: that.activeSJYId, table: item } }).then(res2 => {
                res2.data.forEach(item2 => {
                  temp.children.push({ label: item2.columnName, value: item2.columnName, columnType: item2.columnType, javaType: item2.javaType })
                })
              })
              that.treeTableInSource.push(temp)
            })
          }
        }
      })
    },
    handleCommand(command) {
      let that = this
      if (command == 'wjj') {
        that.addOrModifyWJJ = true
        that.dialogShowWJJ = true
        that.buttonLoad = false
        that.titleWJJ = '新建文件夹信息'
        resetForm('formWJJ', that)
        that.formWJJ = {
          folderName: ''
        }
      } else if (command == 'Query') {
        that.addOrModifyQuery = true
        that.dialogShowQuery = true
        that.getDataTypeList()
        that.getListWJJ()
        that.buttonLoad = false
        that.titleQuery = '新建Query信息'
        resetForm('formQuery', that)
        that.formQuery = {
          dataSourceType: '',
          dataSourceInfoId: '',
          dataQueryFolderId: '',
          fileName: '',
          querySql: ''
        }
      }
    },
    showWJJQueryAction(event, row, level) {
      let that = this
      if (level == 1) {
        that.$contextmenu({
          items: [
            {
              icon: 'el-icon-edit-outline',
              label: '编辑文件夹',
              onClick: () => {
                that.seeWJJ(row)
              }
            },
            {
              icon: 'el-icon-delete',
              label: '删除文件夹',
              onClick: () => {
                that.cancelWJJ(row)
              }
            }
          ],
          event, // 鼠标事件信息
          customClass: 'custom-class', // 自定义菜单样式
          zIndex: 3000, // 菜单的 z-index
          minWidth: 130 // 菜单的最小宽度
        })
      }
      if (level == 2) {
        that.$contextmenu({
          items: [
            {
              icon: 'el-icon-edit-outline',
              label: '编辑Query',
              onClick: () => {
                that.seeQuery(row)
              }
            },
            {
              icon: 'el-icon-delete',
              label: '删除Query',
              onClick: () => {
                that.cancelQuery(row)
              }
            }
          ],
          event, // 鼠标事件信息
          customClass: 'custom-class', // 自定义菜单样式
          zIndex: 3000, // 菜单的 z-index
          minWidth: 130 // 菜单的最小宽度
        })
      }
    },
    addWJJ() {
      let that = this
      that.$refs['formWJJ'].validate(valid => {
        if (valid) {
          let params = that.formWJJ
          params.id = ''
          params.userId = that.$store.state.userInfo.id
          that.buttonLoad = true
          request({ url: '/data_query_folder/add', method: 'post', data: params })
            .then(res => {
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                Notify('success', res.message || '处理成功')
                that.dialogShowWJJ = false
                that.treeWJJShow = false
                setTimeout(() => {
                  that.treeWJJShow = true
                }, 300)
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
    seeWJJ(row) {
      console.log(row)
      let that = this
      that.titleWJJ = '修改文件夹信息    [' + row.name + ']'
      request({ url: '/data_query_folder/get_by_folder_id', method: 'get', params: { folderId: row.value } }).then(res => {
        that.addOrModifyWJJ = false
        that.dialogShowWJJ = true
        that.buttonLoad = false
        resetForm('formWJJ', that)
        that.$nextTick(() => {
          that.formWJJ.folderName = res.data.folderName
          that.formWJJ.id = res.data.id
          that.formWJJ.userId = res.data.userId
        })
      })
    },
    modifyWJJ() {
      let that = this
      that.$refs['formWJJ'].validate(valid => {
        if (valid) {
          let params = that.formWJJ
          that.buttonLoad = true
          request({ url: '/data_query_folder/update', method: 'post', data: params })
            .then(res => {
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                Notify('success', res.message || '处理成功')
                that.dialogShowWJJ = false
                that.treeWJJShow = false
                setTimeout(() => {
                  that.treeWJJShow = true
                }, 300)
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
    cancelWJJ(row) {
      let that = this
      console.log(row)
      that
        .$confirm('是否确定删除[' + row.name + ']文件夹?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/data_query_folder/delete', method: 'post', data: { id: row.value } }).then(res => {
            if (res.code == '200') {
              Notify('success', res.message || '处理成功')
              that.treeWJJShow = false
              setTimeout(() => {
                that.treeWJJShow = true
              }, 300)
            }
          })
        })
        .catch(() => {})
    },

    addQuery() {
      let that = this
      that.$refs['formQuery'].validate(valid => {
        if (valid) {
          let params = that.formQuery
          params.id = ''
          params.userId = that.$store.state.userInfo.id
          that.buttonLoad = true
          request({ url: '/data_query_file/add', method: 'post', data: params })
            .then(res => {
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                Notify('success', res.message || '处理成功')
                that.dialogShowQuery = false
                that.treeWJJShow = false
                setTimeout(() => {
                  that.treeWJJShow = true
                }, 300)
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
    seeQuery(row) {
      console.log(row)
      let that = this
      that.titleQuery = '修改Query信息    [' + row.name + ']'
      request({ url: '/data_query_file/get', method: 'get', params: { id: row.value } }).then(res => {
        that.addOrModifyQuery = false
        that.dialogShowQuery = true
        that.getDataTypeList()
        that.getListWJJ()
        request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: res.data.dataSourceType, page: 1, pageSize: 1000 } }).then(res2 => {
          that.dataSourceList = res2.data.list || []
        })
        that.buttonLoad = false
        resetForm('formQuery', that)
        that.$nextTick(() => {
          that.formQuery.dataSourceInfoId = res.data.dataSourceInfoId
          that.formQuery.dataQueryFolderId = res.data.dataQueryFolderId
          that.formQuery.dataSourceType = res.data.dataSourceType
          that.formQuery.fileName = res.data.fileName
          that.formQuery.id = res.data.id
          that.formQuery.userId = res.data.userId
        })
      })
    },
    modifyQuery() {
      let that = this
      that.$refs['formQuery'].validate(valid => {
        if (valid) {
          let params = that.formQuery
          that.buttonLoad = true
          request({ url: '/data_query_file/update', method: 'post', data: params })
            .then(res => {
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                Notify('success', res.message || '处理成功')
                that.dialogShowQuery = false
                that.treeWJJShow = false
                setTimeout(() => {
                  that.treeWJJShow = true
                }, 300)
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
    cancelQuery(row) {
      let that = this
      that
        .$confirm('是否确定删除[' + row.name + ']Query?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/data_query_file/delete', method: 'post', data: { id: row.value } }).then(res => {
            if (res.code == '200') {
              Notify('success', res.message || '处理成功')
              that.treeWJJShow = false
              setTimeout(() => {
                that.treeWJJShow = true
              }, 300)
            }
          })
        })
        .catch(() => {})
    },
    saveQuery() {
      let that = this
      let params = that.formQuery
      params.querySql = that.monacoEditor.getValue()
      request({ url: '/data_query_file/update', method: 'post', data: params }).then(res => {
        if (res.code == '200') {
          Notify('success', res.message || '处理成功')
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
