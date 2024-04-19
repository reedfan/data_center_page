<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain table">
    <div style="width: 100%; height: calc(100% - 0px); position: relative; overflow: hidden">
      <div style="width: 280px; height: 100%; float: left" class="main-unit">
        <div style="width: 96%; height: 40px; position: relative; overflow: hidden; margin: 10px auto 0 auto">
          <el-input v-model.trim="queryNameTheme" autocomplete="off" placeholder="请输入主题名称"> <el-button slot="append" icon="el-icon-search"></el-button></el-input>
        </div>
        <div style="width: 280px; height: calc(100% - 70px); overflow: hidden auto; margin-top: 10px">
          <el-tree :data="treeTheme" ref="treeTheme" v-loading="loadingTreeTheme" :props="{ children: 'childList' }" node-key="id" :highlight-current="false" :expand-on-click-node="false" style="height: 100%" @node-click="treeThemeClick" default-expand-all element-loading-text="数据加载中">
            <div slot-scope="{ data }" style="height: 26px; width: 100%; overflow: hidden; margin-left: -10px">
              <i :class="data.icon" style="float: left; font-size: 16px; margin-top: 5px"></i>
              <p style="float: left; margin-left: 4px; height: 26px; line-height: 26px; overflow: hidden; max-width: 160px; text-overflow: ellipsis; white-space: nowrap; display: inline-block">{{ data.topicName }}</p>
            </div>
          </el-tree>
        </div>
      </div>
      <div style="width: calc(100% - 285px); height: 100%; float: right">
        <div class="main-unit" style="width: 100%; height: 70px; position: relative; overflow: hidden">
          <div style="width: 96%; height: 40px; margin: 15px auto 0 auto; overflow: hidden">
            <p class="searchLabel" style="width: auto">分层:</p>
            <div style="width: 15%; height: 40px; float: left; margin: 0 1%">
              <el-select v-model="queryForm.layerId" filterable placeholder="请选择" @change=";(queryForm.pageNum = 1), getTableData()">
                <el-option label="全部" :value="empty"></el-option>
                <el-option v-for="(item, index) in levelList" v-bind:key="index" :label="item.layerName + '-' + item.layerFlag" :value="item.id"></el-option>
              </el-select>
            </div>
            <div style="width: auto; height: 40px; float: left; margin: 0 1%">
              <el-button type="primary" icon="el-icon-search" @click=";(queryForm.pageNum = 1), getTableData()">查询</el-button>
            </div>
            <div style="width: auto; height: 40px; float: left; margin: 0 1%">
              <el-button type="primary" @click="newTable()">新建表</el-button>
            </div>
          </div>
        </div>
        <div class="main-unit" style="width: 100%; height: calc(100% - 75px); position: relative; overflow: hidden; margin-top: 5px">
          <el-table v-loading="loadingTable" element-loading-text="数据加载中" class="data-table" ref="table" :data="tableData" border stripe :height="this.$store.state.globalHeight - 265">
            <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
            <el-table-column prop="tableName" label="表名称" min-width="280" align="center"> </el-table-column>
            <el-table-column prop="topicName" label="主题" min-width="120" align="center"> </el-table-column>
            <el-table-column prop="layerName" label="分层" min-width="120" align="center"> </el-table-column>
            <el-table-column prop="createBy" label="创建人" min-width="100" align="center"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" align="center"> </el-table-column>
            <el-table-column label="操作" align="center" width="180" fixed="right">
              <template slot-scope="scope">
                <p class="tableAction" @click="">修改</p>
                <p class="tableAction" @click="" style="color: #ff9900">删除</p>
              </template>
            </el-table-column>
          </el-table>
          <pagination :pageSize="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getTableData"> </pagination>
        </div>
      </div>
    </div>
    <el-dialog :title="titleTable" :visible.sync="dialogShowTable" width="1300px">
      <el-form :model="formTable" ref="formTable" label-width="15px" :rules="rules" :show-message="false" class="demo-ruleForm" style="margin-top: 20px">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="数据源：" prop="type" label-width="120px" :required="true">
              <el-select v-model="formTable.type" filterable placeholder="请选择类型" @change="getDataSourceList()">
                <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" :required="true" prop="dataSourceId" label-width="0">
              <el-select v-model="formTable.dataSourceId" filterable placeholder="请选择数据源">
                <el-option v-for="(item, index) in dataSourceList" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="表分层：" :required="true" prop="layerId" label-width="120px">
              <el-select v-model="formTable.layerId" filterable placeholder="请选择表分层" @change="layerChange()">
                <el-option v-for="(item, index) in levelList" v-bind:key="index" :label="item.layerName + '-' + item.layerFlag" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主题归属：" :required="true" prop="topicIds" label-width="120px">
              <el-cascader ref="topicCascader" @change="topicChange" v-model="formTable.topicIds" :show-all-levels="false" :options="treeThemeForm" placeholder="请选择主题归属" :props="{ children: 'childList', value: 'id', label: 'topicName' }"> </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="表名称：" :required="true" prop="tableName" label-width="120px">
              <el-input v-model.trim="formTable.tableName" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" placeholder="仅支持数字、字母、_"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-radio-group v-model="sqlOrTabel" size="small">
            <el-radio-button label="table">表格</el-radio-button>
            <el-radio-button label="sql">SQL</el-radio-button>
          </el-radio-group>
        </el-row>
        <el-table v-if="sqlOrTabel == 'table'" border :data="formTable.tableColumnInfoList" style="margin-top: 10px" class="data-table" ref="tableColumnInfoList" stripe :max-height="400">
          <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column prop="column" label="字段名" min-width="100" align="left">
            <template slot-scope="scope">
              <el-form-item label=" " :required="true" :prop="'tableColumnInfoList.' + scope.$index + '.column'" style="margin-bottom: 0">
                <el-input v-model="scope.row.column" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="数据类型" min-width="100" align="left">
            <template slot-scope="scope">
              <el-form-item label=" " :required="true" :prop="'tableColumnInfoList.' + scope.$index + '.type'" style="margin-bottom: 0">
                <el-select v-model="scope.row.type" placeholder="数据类型" filterable @change="typeChange(scope.row, scope.$index)">
                  <el-option v-for="(item, index) in tableTypeList" :key="index" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="length" label="长度" min-width="80" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.type == 'text' || scope.row.type == 'tinytext' || scope.row.type == 'mediumtext' || scope.row.type == 'longtext'">-</template>
              <el-form-item v-else label=" " :required="true" :prop="'tableColumnInfoList.' + scope.$index + '.length'" style="margin-bottom: 0">
                <el-input-number v-model="scope.row.length" :min="1" :max="1000" style="width: 100%" size="small"></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="decimalDigits" label="浮点长度" min-width="80" align="center">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.type == 'decimal' || scope.row.type == 'float' || scope.row.type == 'double'" label=" " :required="true" :prop="'tableColumnInfoList.' + scope.$index + '.decimalDigits'" style="margin-bottom: 0">
                <el-input-number v-model="scope.row.decimalDigits" :min="0" :max="1000" style="width: 100%" size="small"></el-input-number>
              </el-form-item>
              <template v-else>-</template>
            </template>
          </el-table-column>
          <el-table-column prop="primaryKey" label="主键" min-width="40" align="center">
            <template slot-scope="scope">
              <el-form-item label="" :prop="'tableColumnInfoList.' + scope.$index + '.primaryKey'" style="margin-bottom: 0" label-width="0">
                <el-checkbox v-model="scope.row.primaryKey" :disabled="scope.row.primaryKey" @change="primartKeyChange(scope.$index)">是</el-checkbox>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="notNull" label="非空" min-width="40" align="center">
            <template slot-scope="scope">
              <el-form-item label="" :prop="'tableColumnInfoList.' + scope.$index + '.notNull'" style="margin-bottom: 0" label-width="0">
                <el-checkbox v-model="scope.row.notNull">是</el-checkbox>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="autoIncrement" label="自动递增" min-width="50" align="center">
            <template slot-scope="scope">
              <el-form-item label="" :prop="'tableColumnInfoList.' + scope.$index + '.autoIncrement'" style="margin-bottom: 0" label-width="0">
                <el-checkbox v-model="scope.row.autoIncrement" :disabled="scope.row.type != 'int' && scope.row.type != 'bigint' && scope.row.type != 'integer' && scope.row.type != 'tinyint' && scope.row.type != 'mediumint' && scope.row.type != 'smallint'">是</el-checkbox>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="注释" min-width="80" align="left">
            <template slot-scope="scope">
              <el-form-item label="" :prop="'tableColumnInfoList.' + scope.$index + '.comment'" style="margin-bottom: 0" label-width="0">
                <el-input v-model.number="scope.row.comment" type="textarea" :autosize="{ minRows: 1, maxRows: 100 }" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <p class="tableAction" :class="formTable.tableColumnInfoList.length == '1' ? 'disabledTableAction' : ''" @click="formTable.tableColumnInfoList.length == '1' ? '' : deleteColumn(scope.row.index)" style="color: #ff9900">删除</p>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div v-if="sqlOrTabel == 'table'" style="margin-top: 10px; width: 100%; height: 40px; text-align: left">
        <el-button type="primary" @click="addColumn" size="small">添加字段</el-button>
      </div>
      <div v-show="sqlOrTabel == 'sql'" id="code-editor" ref="code-editor" style="height: 400px; width: 100%; margin-top: 10px; border: 1px solid #dcdfe6; box-sizing: border-box"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowTable = false">取消</el-button>
        <el-button type="primary" v-if="addOrModifyTable" @click="addTable()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyTable" @click="modifyTable()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify } from '@/api/common'
import request from '@/api/request'
import * as monaco from 'monaco-editor'
import { language } from 'monaco-editor/esm/vs/basic-languages/sql/sql'
const { keywords } = language
export default {
  name: 'dataTable',
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
      queryNameTheme: '',
      treeTheme: [],
      treeThemeForm: [],
      loadingTreeTheme: false,

      queryForm: {
        layerId: '',
        topicId: '',
        topicParentId: '',
        pageSize: 10,
        page: 1,
        total: 0
      },
      tableData: [],
      loadingTable: true,

      dialogShowTable: false,
      titleTable: '',
      addOrModifyTable: true,
      dataTypeList: [],
      dataSourceList: [],
      formTable: {
        type: '',
        dataSourceId: '',
        tableName: '',
        layerId: '',
        layerName: '',
        topicIds: [],
        topicId: '',
        topicName: '',
        sql: '',
        tableColumnInfoList: []
      },
      sqlOrTabel: 'table',
      levelList: '',
      tableTypeList: ['bigint', 'binary', 'bit', 'blob', 'blob data type', 'boolean', 'char', 'char byte', 'date', 'datetime', 'dec', 'decimal', 'double', 'double precision', 'enum', 'float', 'int', 'integer', 'longblob', 'longtext', 'mediumblob', 'mediumint', 'mediumtext', 'set data type', 'smallint', 'text', 'time', 'timestamp', 'tinyblob', 'tinyint', 'tinytext', 'varbinary', 'varchar', 'year data type'],
      // 编辑器实例
      monacoEditor: null
    }
  },
  mounted() {
    this.getTreeTheme()
    this.getDataTypeList()
    this.getLevelList()
    this.getTableData()
    window.onresize = () => {
      return (() => {
        this.$store.state.globalHeight = document.documentElement.clientHeight
        setTimeout(() => {
          this.$refs.table.doLayout()
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
    getTableData() {
      let that = this
      that.loadingTable = true
      request({ url: '/table/list', method: 'get', params: { layerId: that.queryForm.layerId, topicId: that.queryForm.topicId, topicParentId: that.queryForm.topicParentId, page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.tableData = res.data || []
        that.queryForm.total = res.data ? res.data.length : 0
        that.loadingTable = false
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 获取分层list
    getLevelList() {
      let that = this
      request({ url: '/datawarehouseLayer/getList', method: 'post', data: {} }).then(res => {
        that.levelList = res.data.reverse() || []
      })
    },
    // 获取主题树数据
    getTreeTheme() {
      let that = this
      that.loadingTreeTheme = true
      request({ url: '/datawarehouseTopic/getTreeList', method: 'post', data: {} }).then(res => {
        that.treeTheme = [{ topicName: '全部主题', id: '', childList: [] }].concat(res.data || [])
        that.treeThemeForm = res.data || []
        that.loadingTreeTheme = false
        setTimeout(() => {
          that.$refs.treeTheme.setCurrentKey('')
        }, 0)
      })
    },
    // 树形控件点击
    treeThemeClick(node) {
      let that = this
      if (node.parentId) {
        that.queryForm.topicId = node.id
        that.queryForm.topicParentId = node.parentId
      } else {
        that.queryForm.topicParentId = node.id
        that.queryForm.topicId = ''
      }
      that.queryForm.pageNum = 1
      that.getTableData()
    },
    // 新建表
    newTable() {
      let that = this
      that.addOrModifyTable = true
      that.dialogShowTable = true
      that.dataSourceList = []
      that.buttonLoad = false
      that.titleTable = '新建表信息'
      resetForm('formTable', that)
      ;(that.formTable.tableColumnInfoList = [
        {
          column: '',
          type: '',
          length: 1,
          notNull: false,
          autoIncrement: false,
          decimalDigits: null,
          primaryKey: false,
          comment: ''
        }
      ]),
        that.initEditor()
    },
    // 初始化编辑器
    initEditor() {
      let that = this
      if (that.monacoEditor) {
        that.monacoEditor.dispose()
      }

      that.$nextTick(() => {
        that.initAutoCompletion()
        // 初始化编辑器
        that.monacoEditor = monaco.editor.create(document.getElementById('code-editor'), {
          value: '', // 初始文字
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
      })
    },
    // 增加列
    addColumn() {
      let that = this
      that.formTable.tableColumnInfoList.push({
        column: '',
        type: '',
        length: 1,
        decimalDigits: null,
        notNull: false,
        autoIncrement: false,
        primaryKey: false,
        comment: ''
      })
      that.$nextTick(() => {
        that.$refs.tableColumnInfoList.bodyWrapper.scrollTop = that.$refs.tableColumnInfoList.bodyWrapper.scrollHeight
      })
    },
    // 删除列
    deleteColumn(index) {
      let that = this
      that.formTable.tableColumnInfoList.splice(index, 1)
    },

    // 获取数据源类型list
    getDataTypeList() {
      let that = this
      request({ url: '/data_source/type/list', method: 'get', params: {} }).then(res => {
        that.dataTypeList = res.data
      })
    },
    // 数据源类型change
    getDataSourceList() {
      let that = this
      that.dataSourceList = []
      that.formTable.dataSourceId = ''
      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.formTable.type, page: 1, pageSize: 1000 } }).then(res => {
        that.dataSourceList = res.data.list || []
      })
    },
    // 主键唯一控制
    primartKeyChange(rowIndex) {
      let that = this
      that.formTable.tableColumnInfoList.forEach((item, index) => {
        if (index == rowIndex) {
          item.primaryKey = true
        } else {
          item.primaryKey = false
        }
      })
    },
    // 自动递增控制
    typeChange(row, rowIndex) {
      let that = this
      if (row.type != 'int' && row.type != 'bigint' && row.type != 'integer' && row.type != 'tinyint' && row.type != 'mediumint' && row.type != 'smallint') {
        that.formTable.tableColumnInfoList[rowIndex].autoIncrement = false
      }
      if (row.type == 'decimal' || row.type == 'float' || row.type == 'double') {
        that.formTable.tableColumnInfoList[rowIndex].decimalDigits = 1
      } else {
        that.formTable.tableColumnInfoList[rowIndex].decimalDigits = null
      }
      if (row.type == 'text' || row.type == 'tinytext' || row.type == 'mediumtext' || row.type == 'longtext') {
        that.formTable.tableColumnInfoList[rowIndex].length = null
      } else {
        that.formTable.tableColumnInfoList[rowIndex].length = 1
      }
    },
    // 表分层change
    layerChange() {
      let that = this
      let temp = that.levelList.filter(s => {
        return s.id == that.formTable.layerId
      })
      that.formTable.layerName = temp[0].layerName
    },
    // 主题归属change
    topicChange(val) {
      let that = this
      that.formTable.topicId = that.$refs['topicCascader'].getCheckedNodes()[0].value
      that.formTable.topicName = that.$refs['topicCascader'].getCheckedNodes()[0].label
    },
    // 添加表
    addTable() {
      let that = this
      if (that.sqlOrTabel == 'sql') {
        that.formTable.tableColumnInfoList = []
        that.formTable.sql = that.monacoEditor.getValue()
      }
      if (that.sqlOrTabel == 'table') {
        that.formTable.sql = ''
      }
      console.log(that.formTable)
      that.$refs['formTable'].validate(valid => {
        if (valid) {
          let params = { ...that.formTable }
          that.buttonLoad = true
          request({ url: '/table/new', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowTable = false
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

    //  获取编辑器中填写的值
    getValue() {
      return this.monacoEditor.getValue()
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
    }
  }
}
</script>

<style scoped>
</style>
