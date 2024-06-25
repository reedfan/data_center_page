<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain selfService manageMainNoBack">
    <div class="main-unit" style="width: 100%; height: 50%; margin: 0 auto; position: relative; overflow: hidden; box-shadow: 0px 4px 8px 0px rgba(140, 140, 216, 0.1); border-radius: 6px; background: #ffffff">
      <div class="main-unit" style="width: calc(100% - 48px); height: 64px; margin: 0 auto; position: relative; overflow: hidden; border-bottom: 1px solid #ececec">
        <div style="width: 350px; height: 42px; margin-right: 24px; margin-top: 14px; float: left; overflow: hidden">
          <p class="searchLabel" style="width: auto; margin: 0 auto; text-align: center; margin-left: 5%">类型:</p>
          <div style="width: 50%; height: 40px; float: left; margin: 0 1% 0 2%">
            <el-select v-model="dataType" filterable placeholder="请选择" @change="getSJYList()">
              <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
            </el-select>
          </div>
          <p class="searchLabel" style="width: 22%; margin: 0 auto; text-align: center; margin-left: 5%; float: right">数据来源:</p>
        </div>
        <div style="width: calc(100% - 398px); height: 50px; margin-right: 24px; margin-top: 10px; float: right; overflow: hidden">
          <el-tabs v-model="activeSJYId" @tab-click="handleTabClick" class="selfServiceTopTabs">
            <el-tab-pane :key="index" v-for="(item, index) in SJYList" :label="item.dbName" :name="item.id + ''">
              <span slot="label">{{ item.dbName }}<i v-if="activeSJYId == item.id" class="el-icon-menu" style="margin-left: 8px" @click="showTable(item)"></i> </span>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div style="width: calc(100% - 48px); height: calc(100% - 70px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
        <div class="main-unit" style="width: 100%; height: 100%; position: relative; overflow: hidden">
          <div v-if="monacoEditorShow" id="code-editor" ref="code-editor" style="height: calc(100% - 10px); width: 100%; margin-top: 10px"></div>
          <div v-if="monacoEditorShow" style="width: auto; height: 40px; position: absolute; left: 20px; bottom: 20px">
            <el-button type="primary" icon="el-icon-video-play" @click="runSql()">运行</el-button>
          </div>
          <el-empty style="width: 100%; height: 100%" description=" " v-if="!monacoEditorShow"></el-empty>
        </div>
      </div>
    </div>
    <div class="main-unit" style="width: 100%; height: calc(50% - 5px); position: relative; overflow: hidden; margin: 5px auto 0 auto; box-shadow: 0px 4px 8px 0px rgba(140, 140, 216, 0.1); border-radius: 6px; background: #ffffff">
      <div class="main-unit" style="width: calc(100% - 48px); height: 100%; margin: 0 auto; position: relative; overflow: hidden">
        <el-tabs style="height: 100%" v-model="bottomTab">
          <el-tab-pane label="运行结果" name="运行结果">
            <el-table v-loading="loadingResult" element-loading-text="数据加载中" class="data-table" ref="tableResult" :data="tableResult" border stripe :height="($store.state.globalHeight - 115) / 2 - 85">
              <el-table-column type="index" label="序号" align="center" width="60" fixed="left"> </el-table-column>
              <el-table-column :prop="item" :label="item" min-width="250" align="center" v-for="(item, index) in columnsResult" :key="index">
                <template slot-scope="scope">
                  {{ scope.row[item] }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="运行历史" name="运行历史">
            <el-table v-loading="loadingHistory" element-loading-text="数据加载中" class="data-table" ref="tableHistory" :data="tableHistory" border stripe :height="($store.state.globalHeight - 115) / 2 - 145">
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
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog :title="titleTable" :visible.sync="dialogShowTable" width="1200px">
      <div style="width: 100%; height: 500px; background: #e6eaef; overflow: hidden">
        <div style="width: 240px; height: 100%; background: #ffffff; float: left; overflow-x: hidden; overflow-y: auto">
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
      buttonLoad: false,
      dataTypeList: [],
      dataType: '',
      loadingSJY: false,
      SJYList: [],
      activeSJYId: '',
      titleTable: '',
      dialogShowTable: false,
      tableList: [],
      activeTable: '',
      loadingColumns: false,
      columnsData: [],

      bottomTab: '运行结果',

      tableResult: [],
      columnsResult: ['-'],
      loadingResult: false,
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
      // 补全的数据，建议在编辑器初始化之间就请求回来放好
      sqlTables: {}
    }
  },
  mounted() {
    this.getDataTypeList()
    this.getHistoryData()
    window.onresize = () => {
      return (() => {
        this.$store.state.globalHeight = document.documentElement.clientHeight
        setTimeout(() => {
          this.$refs.tableResult.doLayout()
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
    // 展示表
    showTable(row) {
      let that = this
      that.titleTable = row.dbName
      that.dialogShowTable = true
      that.loadingTable = false
      that.tableList = []
      that.activeTable = ''
      that.columnsData = []
      that.$nextTick(() => {
        that.getTableList()
      })
    },
    // 获取表list
    getTableList() {
      let that = this
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.activeSJYId } }).then(res => {
        that.tableList = res.data || []
        that.activeTable = res.data[0] || ''
        that.activeTable && that.getColumns()
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
    handleTabClick(tab, event) {
      let that = this
      that.initEditor()
      that.getHistoryData()
    },
    // 初始化编辑器
    initEditor() {
      let that = this
      // if (that.monacoEditor) {
      //   that.monacoEditor.dispose()
      // }
      that.sqlTables = {}
      that.monacoEditorShow = false
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.activeSJYId } }).then(res => {
        if (res.code == 200) {
          let tempValue = 'SELECT * FROM '
          if (res.data) {
            res.data.forEach(item => {
              that.sqlTables[item] = []
            })
            tempValue = `SELECT * FROM ${res.data[0]}`
          }
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
              fontSize: 20 // 文字大小
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
      console.log(needValue)
      this.clearMistake()
      try {
        this.monacoEditor.setValue(format(this.monacoEditor.getValue()))
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
      that.loadingResult = true
      request({ url: '/query/result', method: 'get', params: { querySql: that.monacoEditor.getValue(), dataSourceInfoId: that.activeSJYId } })
        .then(res => {
          if (res.code == 200) {
            that.tableResult = res.data || []
            that.loadingResult = false
            if (res.data[0]) {
              that.columnsResult = Object.keys(res.data[0])
            } else {
              that.columnsResult = ['-']
            }
            that.getHistoryData()
            setTimeout(() => {
              that.$refs.tableResult.doLayout()
            }, 300)
          } else {
            that.columnsResult = ['-']
            that.tableResult = []
            that.loadingResult = false
          }
        })
        .catch(err => {
          that.columnsResult = ['-']
          that.tableResult = []
          that.loadingResult = false
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

    // 初始化自动补全
    initAutoCompletion() {
      monaco.languages.registerCompletionItemProvider('sql', {
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
