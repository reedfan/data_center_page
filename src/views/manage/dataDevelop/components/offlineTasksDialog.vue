<template>
  <div style="width: 100%; height: auto; overflow: hidden auto; background: #ffffff; position: relative">
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
    <div slot="footer" class="dialog-footer" style="text-align: right">
      <el-button style="width: 100px" size="mini" @click="closeDialog">取消</el-button>
      <el-button type="primary" style="width: 100px" size="mini" v-if="addOrModifyTask" :disabled="buttonLoad" :loading="buttonLoad" @click="addTask()">保存</el-button>
      <el-button type="primary" style="width: 100px" size="mini" v-if="!addOrModifyTask" :disabled="buttonLoad" :loading="buttonLoad" @click="updateTask()">修改</el-button>
    </div>
  </div>
</template>
    
    <script>
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
import * as monaco from 'monaco-editor/esm/vs/editor/edcore.main'
import { language } from 'monaco-editor/esm/vs/basic-languages/sql/sql'
import { format } from 'sql-formatter'
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution'
const { keywords } = language
export default {
  name: 'offlineTasks',
  props: {
    addOrModifyTask: '',
    taskRow: ''
  },
  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      buttonLoad: false,
      projectGroupList: [],
      dataSourceList: [],
      dialogShowTask: false,

      formTask: {
        id: '',
        projectGroupId: '',
        taskName: '',
        taskDesc: '',
        dataSourceId: '',
        sqlInfo: ''
      },

      editPartitionShow: false,
      formPartition: {
        dynamicsStr1: '',
        dynamicsStr2: ''
      }
    }
  },
  mounted() {
    this.getDataSourceList()
    this.getProjectGroupList()
    this.init()
  },
  methods: {
    // 获取数据源类型list
    getDataSourceList() {
      let that = this
      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: 'Hive', page: 1, pageSize: 1000 } }).then(res => {
        that.dataSourceList = res.data.list || []
      })
    },
    // 获取项目组list
    getProjectGroupList() {
      let that = this
      request({ url: '/project_group_permission/user_info_id', method: 'get', params: { userInfoId: that.$store.state.userInfo.id } }).then(res => {
        that.projectGroupList = res.data
      })
    },
    init() {
      let that = this
      if (that.addOrModifyTask) {
        resetForm('formTask', that)
        that.formTask = {
          id: '',
          projectGroupId: '',
          taskName: '',
          taskDesc: '',
          dataSourceId: '',
          sqlInfo: ''
        }
        that.initEditor()
      } else if (!that.addOrModifyTask) {
        request({ url: '/sql_task_info/get_by_id', method: 'get', params: { sqlTaskInfoId: that.taskRow.id } }).then(res => {
          if (res.code == 200) {
            resetForm('formTask', that)
            that.formTask = { ...res.data }
            that.initEditor(res.data.sqlInfo)
          }
        })
      }
    },
    // 保存任务
    addTask() {
      let that = this
      that.$refs['formTask'].validate(valid => {
        if (valid) {
          let params = that.formTask
          params.id = null
          params.sqlInfo = that.monacoEditor.getValue()
          that.buttonLoad = true
          request({ url: '/sql_task_info/add', method: 'post', data: params })
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
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    updateTask() {
      let that = this
      that.$refs['formTask'].validate(valid => {
        if (valid) {
          let params = that.formTask
          params.sqlInfo = that.monacoEditor.getValue()
          that.buttonLoad = true
          request({ url: '/sql_task_info/update', method: 'post', data: params })
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
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    initEditor(value) {
      let that = this
      if (that.monacoEditor) {
        that.monacoEditor.dispose()
      }
      that.$nextTick(() => {
        // 初始化编辑器
        that.monacoEditor = monaco.editor.create(document.getElementById('code-editor'), {
          value: value, // 初始文字
          language: 'sql', // 语言
          readOnly: false, // 是否只读
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
    editPartition() {
      this.$refs['formPartition'].validate(valid => {
        if (valid) {
          this.copyText(this.formPartition.dynamicsStr1 + this.formPartition.dynamicsStr2)
          this.editPartitionShow = false
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    closeDialog() {
      this.$emit('close', '')
    },
    // 复制到剪切板
    copyText(text) {
      copyText(text)
    }
  }
}
</script>
    
    <style>
</style>