<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain syncTasks">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-search" @click="getTaskData()">查询</el-button>
        </div>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button icon="el-icon-plus" type="primary" @click="newTask()">新建离线任务</el-button>
        </div>
      </div>
    </div>
    <div style="width: calc(100% - 48px); height: calc(100% - 95px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
      <div style="width: 100%; height: 100%; float: right" class="main-unit">
        <el-table v-loading="loadingTask" element-loading-text="数据加载中" class="data-table" ref="table" :data="taskData" stripe :height="this.$store.state.globalHeight - 285">
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

          <el-table-column label="操作" align="center" width="330" fixed="right">
            <template slot-scope="scope">
              <p class="tableAction" @click="runTask(scope.row)">运行</p>
              <p class="tableAction" @click="getTaskRunRecord(scope.row)">运行结果</p>
              <p class="tableAction" @click="seeTask(scope.row)">修改</p>
              <p class="tableActionDanger" @click="cancelTask(scope.row)">删除</p>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pageSize="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getTaskData"> </pagination>
      </div>
    </div>

    <el-dialog :title="titleTask" :visible.sync="dialogShowTask" width="900px">
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
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 120px" @click="dialogShowTask = false">取消</el-button>
        <el-button type="primary" style="width: 120px" v-if="addOrModifyTask" :disabled="buttonLoad" :loading="buttonLoad" @click="addTask()">保存</el-button>
        <el-button type="primary" style="width: 120px" v-if="!addOrModifyTask" :disabled="buttonLoad" :loading="buttonLoad" @click="updateTask()">修改</el-button>
      </div>
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
            <span v-else>{{ scope.row.jobStatus }}</span>
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
        <el-table-column prop="totalReadRecords" label="读取总条数" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="readFaildRecords" label="读取失败条数" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="writeFailedRecords" label="写入失败的条数" min-width="120" align="center"> </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
import * as monaco from 'monaco-editor/esm/vs/editor/edcore.main'
import { language } from 'monaco-editor/esm/vs/basic-languages/sql/sql'
import { format } from 'sql-formatter'
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution'
const { keywords } = language
export default {
  name: 'offlineTasks',
  components: {
    pagination
  },
  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      queryForm: {
        pageSize: 10,
        page: 1,
        total: 0
      },
      taskData: [],
      loadingTask: true,

      buttonLoad: false,

      projectGroupList: [],
      dataSourceList: [],
      dialogShowTask: false,
      addOrModifyTask: true,
      titleTask: '',
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
      },

      dialogShowRunRecord: false,
      tableRunRecord: [],
      loadingRunRecord: false
    }
  },
  mounted() {
    this.getDataSourceList()
    this.getProjectGroupList()
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
      that.dialogShowTask = true
      that.addOrModifyTask = true
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
          fontSize: 20, // 文字大小
          autoIndex: true,
          tabCompletion: 'on',
          cursorSmoothCaretAnimation: true,
          formatOnPaste: true,
          mouseWheelZoom: true,
          folding: true, //代码折叠
          autoClosingBrackets: 'always',
          autoClosingOvertype: 'always',
          autoClosingQuotes: 'always',
          automaticLayout: 'always'
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
          Notify('error', '请将红色标注部分填写完整')
        }
      })
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
      request({ url: '/sql_task_info/get_by_id', method: 'get', params: { sqlTaskInfoId: row.id } }).then(res => {
        if (res.code == 200) {
          that.titleTask = '修改任务[' + row.taskName + ']'
          that.dialogShowTask = true
          that.addOrModifyTask = false
          resetForm('formTask', that)
          that.formTask = { ...res.data }
          that.initEditor(res.data.sqlInfo)
        }
      })
    },
    // 修改任务
    updateTask() {
      let that = this
      that.$refs['formTask'].validate(valid => {
        if (valid) {
          let params = that.formTask
          params.sqlInfo = that.monacoEditor.getValue()
          that.buttonLoad = true
          request({ url: '/sql_task_info/update', method: 'post', data: params })
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
          Notify('error', '请将红色标注部分填写完整')
        }
      })
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
      that.tableRunRecord = []
      that.dialogShowRunRecord = true
      that.loadingRunRecord = true
      that.$nextTick(() => {
        request({ url: '/task_run_record/list', method: 'post', data: { taskId: row.id, jobId: null, jobKey: null, jobName: null, page: 1, pageSize: 10, runDt: null, jobStatusList: [] } }).then(res => {
          that.tableRunRecord = res.data.list || []
          that.loadingRunRecord = false
          setTimeout(() => {
            that.$refs.tableRunRecord.doLayout()
          }, 300)
        })
      })
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
