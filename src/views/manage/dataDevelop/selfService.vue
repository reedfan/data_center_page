<template>
  <div class="manageMain selfService" style="flex-direction: row">
    <div style="width: 216px; padding: 10px 24px 10px 0; height: 100%; border-right: 1px solid #e4e6eb">
      <p style="width: 100%; height: 28px; line-height: 28px; border-bottom: 1px solid #e4e6eb; font-size: 12px; text-align: center; color: #333333">库表信息</p>
      <!-- <el-select v-model="dataType" filterable placeholder="请选择数据源类型" @change="getSJYList()" style="margin-top: 10px">
        <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
      </el-select> -->
      <el-tree style="height: calc(100% - 80px); margin-top: 10px; width: 100%; overflow: hidden auto" :props="treePropsSJY" :load="loadSJYNode" :expand-on-click-node="false" lazy @node-click="handleNodeClickSJY"> </el-tree>
    </div>
    <div style="width: calc(100% - 241px); height: 100%; border-right: 1px solid #e4e6eb">
      <div style="width: 100%; height: 50%; margin: 0 auto; position: relative; overflow: hidden">
        <div style="width: 100%; height: 100%; position: relative; overflow: hidden; margin: 0 auto">
          <div style="height: 39px; width: 100%; border-bottom: 1px solid #e4e6eb">
            <el-tooltip :content="loadingResult ? '正在运行' : '运行'" placement="bottom" v-if="monacoEditorShow">
              <i v-if="!loadingResult" class="el-icon-caret-right" style="display: block; float: left; font-size: 26px; margin-top: 7px; margin-left: 10px; color: #0987e5; cursor: pointer" @click="runSql()"> </i>
              <i v-if="loadingResult" class="el-icon-loading" style="display: block; float: left; font-size: 20px; margin-top: 10px; margin-left: 10px; color: #666666"> </i>
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
            <p v-if="monacoEditorShow" style="width: auto; height: 39px; line-height: 39px; margin-right: 10px; float: right; font-size: 12px; color: #333333">{{ activeSJYName }} <span style="margin-left: 5px; cursor: pointer; color: #0987e5" @click="showTable()">详情</span></p>
          </div>
          <div v-if="monacoEditorShow" id="code-editor" ref="code-editor" style="height: calc(100% - 40px); width: 100%; margin-top: 10px"></div>

          <el-empty style="width: 100%; height: 100%" description=" " v-if="!monacoEditorShow"></el-empty>
        </div>
      </div>
      <div style="width: 100%; height: calc(50% - 5px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
        <div style="width: 100%; height: 100%; margin: 0 auto; position: relative; overflow: hidden">
          <el-tabs style="height: 100%" v-model="bottomTab" class="selfTopTabs" type="border-card">
            <el-tab-pane style="height: 100%" label="运行结果" name="运行结果">
              <el-empty style="width: 100%; height: 100%" description="暂无运行结果" v-if="tableResultList.length == 0"></el-empty>
              <el-tabs v-if="tableResultList.length > 0" v-model="tableResultListTab" style="width: 100%; height: 100%; margin: 0 auto" class="selfBottomTabs" type="border-card" closable @tab-remove="removeTableResultTab">
                <el-tab-pane v-for="(item, index) in tableResultList" :key="index" style="height: 100%" :label="'运行' + item.count" :name="'result' + item.count">
                  <el-table v-loading="item.loadingResult" element-loading-text="数据加载中" :ref="'tableResult' + (index + 1)" :data="item.tableResult" height="100%">
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

    <el-dialog :title="titleTable" :visible.sync="dialogShowTable" width="1200px">
      <div style="width: 100%; height: 500px; background: #e6eaef; overflow: hidden">
        <div style="width: 240px; height: 100%; background: #ffffff; float: left; overflow-x: hidden; overflow-y: auto" v-loading="loadingTable">
          <div class="leftChooseIn">
            <div class="chooseUnit" v-for="(item, index) in tableList" :key="index" :class="activeTable == item ? 'active' : 'notActive'">
              <i :class="activeTable == item ? 'el-icon-right active' : 'notActive'"></i>
              <p :title="item" @click=";(activeTable = item), getColumns()">{{ item }}</p>
              <i v-show="activeTable == item" class="el-icon-document-copy" @click="copyText(item)"></i>
            </div>
            <p style="width: 100%; height: 40px; line-height: 40px; margin: 260px auto; text-align: center; color: #909399" v-if="tableList.length == 0 || !tableList">暂无数据</p>
          </div>
        </div>
        <div style="width: calc(100% - 245px); height: 100%; background: #ffffff; float: right">
          <p style="width: 96%; margin: 10px auto 0 auto; height: 30px; line-height: 30px; font-size: 18px; text-align: left; color: #333333">{{ activeTable }}</p>
          <el-table v-loading="loadingColumns" element-loading-text="数据加载中" style="width: 96%; margin: 10px auto 0 auto" class="data-table" ref="tableColumns" :data="columnsData" border stripe :height="440">
            <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
            <el-table-column prop="columnName" label="字段名称" min-width="50" align="left">
              <template slot-scope="scope">
                <div style="width: 100%; height: 100%; display: flex; align-items: center">
                  <p style="max-width: 180px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis" :title="scope.row.columnName">{{ scope.row.columnName }}</p>
                  <i class="el-icon-document-copy" style="cursor: pointer; vertical-align: middle; margin-left: 5px" @click="copyText(scope.row.columnName)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="columnType" label="字段类型" min-width="50" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="columnComment" label="字段描述" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

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
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click=";(dialogShowHiveConfig = false), (isHiveConfig = false)" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" @click=";(dialogShowHiveConfig = false), (isHiveConfig = true)" style="width: 100px" size="mini">确 定</el-button>
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
      treePropsSJY: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      buttonLoad: false,
      dataTypeList: [],
      dataType: '',
      loadingSJY: false,
      SJYList: [],
      activeSJYId: '',
      activeSJYName: '',
      titleTable: '',
      dialogShowTable: false,
      tableList: [],
      activeTable: '',
      loadingTable: false,
      loadingColumns: false,
      columnsData: [],

      bottomTab: '运行结果',
      hiveJobId: '',
      loadingResult: false,
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
        executorCores: ''
      },
      isHiveConfig: false
    }
  },
  mounted() {
    // this.getDataTypeList()

    // this.getHistoryData()
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
    // 获取数据源类型list
    getDataTypeList() {
      let that = this
      request({ url: '/data_source/type/self_service/list', method: 'get', params: {} }).then(res => {
        that.dataTypeList = res.data
        that.dataType = res.data[0] || ''
        that.getSJYList()
      })
    },
    // 获取数据源List
    getSJYList() {
      let that = this
      that.loadingSJY = true
      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.dataType, page: 1, pageSize: 10000 } }).then(res => {
        that.SJYList = res.data.list || []
        if (res.data.list[0]) {
          that.activeSJYId = res.data.list[0].id + ''
          that.initEditor()
          that.getHistoryData()
        }
        that.loadingSJY = false
      })
    },
    loadSJYNode(node, resolve) {
      let that = this
      console.log(node)
      if (node.level === 0) {
        let tempLevel1 = []
        request({ url: '/data_source/type/self_service/list', method: 'get', params: {} }).then(res => {
          res.data.forEach((item, index) => {
            tempLevel1.push({ name: item, value: item, level: 1 })
          })
          return resolve(tempLevel1)
        })
      }
      if (node.level === 1) {
        let tempLevel2 = []
        request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: node.data.value, page: 1, pageSize: 10000 } }).then(res => {
          res.data.list.forEach((item, index) => {
            tempLevel2.push({ name: item.dbName, value: item.id, type: node.data.name, level: 2 })
          })
          return resolve(tempLevel2)
        })
      }
      if (node.level === 2) {
        let tempLevel3 = []
        request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: node.data.value } }).then(res => {
          if (res.code == 200) {
            res.data.forEach((item, index) => {
              tempLevel3.push({ name: item, value: item, sjyId: node.data.value, type: node.data.type, sjyName: node.data.name, children: [], leaf: true, level: 3 })
            })
          }
          return resolve(tempLevel3)
        })
      }
      if (node.level > 2) return resolve([])
    },
    handleNodeClickSJY(data) {
      let that = this
      if (data.level == 2) {
        that.activeSJYId = data.value
        that.dataType = data.type
        that.activeSJYName = data.name
        that.initEditor()
        that.getHistoryData()
      }
      if (data.level == 3) {
        that.activeSJYId = data.sjyId
        that.dataType = data.type
        that.activeSJYName = data.sjyName
        that.initEditor(data.value)
        that.getHistoryData()
      }
      resetForm('formHiveConfig', that)
      that.formHiveConfig = {
        driverMemory: '',
        executorMemory: '',
        executorCores: ''
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
    initEditor(tableName) {
      let that = this
      // if (that.monacoEditor) {
      //   that.monacoEditor.dispose()
      // }
      that.sqlTables = {}
      that.monacoEditorShow = false
      if (that.monacoProviderRef) {
        that.monacoProviderRef.dispose()
      }
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.activeSJYId } }).then(res => {
        if (res.code == 200) {
          let tempValue = 'SELECT * FROM '
          if (res.data) {
            res.data.forEach(item => {
              that.sqlTables[item] = []
              request({ url: '/data_source/columns', method: 'get', params: { id: that.activeSJYId, table: item } }).then(res2 => {
                res2.data.forEach(item2 => {
                  that.sqlTables[item].push(item2.columnName)
                })
              })
            })
            tempValue = `SELECT * FROM ${tableName || res.data[0]}`
          }
          console.log(that.sqlTables)
          that.monacoEditorShow = true
          that.$nextTick(() => {
            that.initAutoCompletion()
            // 初始化编辑器
            that.monacoEditor = monaco.editor.create(document.getElementById('code-editor'), {
              value: tempValue, // 初始文字
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
      that.bottomTab = '运行结果'
      that.tableResultList.push({
        count: that.tableResultList.length > 0 ? that.tableResultList[that.tableResultList.length - 1].count + 1 : 1,
        querySql: that.monacoEditor.getValue(),
        tableResult: [],
        columnsResult: [],
        loadingResult: true
      })
      that.tableResultListTab = 'result' + that.tableResultList[that.tableResultList.length - 1].count
      that.loadingResult = true
      let params = {
        querySql: that.monacoEditor.getValue(),
        dataSourceInfoId: that.activeSJYId
      }
      if (that.dataType == 'Hive' && that.isHiveConfig) {
        params = { ...params, ...that.formHiveConfig }
      }
      request({ url: '/query/result', method: 'post', data: params })
        .then(res => {
          if (res.code == 200) {
            if (that.dataType == 'Hive') {
              that.hiveJobId = res.data
              that.getHiveRecordTimeOut = 1000
              that.getHiveRecord(res.data)
            } else {
              that.tableResultList[that.tableResultList.length - 1].tableResult = res.data || []
              that.tableResultList[that.tableResultList.length - 1].loadingResult = false
              that.loadingResult = false
              if (res.data[0]) {
                that.tableResultList[that.tableResultList.length - 1].columnsResult = Object.keys(res.data[0])
              } else {
                that.tableResultList[that.tableResultList.length - 1].columnsResult = ['-']
              }
              that.getHistoryData()
            }
          } else {
            that.tableResultList[that.tableResultList.length - 1].columnsResult = ['-']
            that.tableResultList[that.tableResultList.length - 1].tableResult = []
            that.tableResultList[that.tableResultList.length - 1].loadingResult = false
          }
        })
        .catch(err => {
          that.columnsResult = ['-']
          that.tableResult = []
          that.loadingResult = false
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

    getHiveRecord(jobId) {
      let that = this
      that.loadingResult = true
      request({ url: '/spark_query_record/get_by_job_id', method: 'get', params: { jobId: jobId } }).then(res => {
        if (res.message == '该任务正在查询中') {
          if (that.getHiveRecordTimeOut < 15000) {
            that.getHiveRecordTimeOut += 2000
          }
          setTimeout(() => {
            that.getHiveRecord(jobId)
          }, that.getHiveRecordTimeOut)
        } else {
          that.tableResultList[that.tableResultList.length - 1].tableResult = res.data || []
          that.tableResultList[that.tableResultList.length - 1].loadingResult = false
          that.loadingResult = false
          if (res.data[0]) {
            that.tableResultList[that.tableResultList.length - 1].columnsResult = Object.keys(res.data[0])
          } else {
            that.tableResultList[that.tableResultList.length - 1].columnsResult = ['-']
          }
          that.getHistoryData()
        }
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
    }
  }
}
</script>

<style scoped>
</style>
