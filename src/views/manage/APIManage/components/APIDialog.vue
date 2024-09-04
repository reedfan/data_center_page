<template>
  <div style="width: 100%; height: auto; overflow: hidden auto; background: #ffffff; position: relative">
    <el-steps :active="stepAPI" simple style="margin-top: 10px">
      <el-step title="配置API" icon="el-icon-edit-outline"></el-step>
      <el-step title="选择参数" icon="el-icon-folder-checked"></el-step>
      <el-step title="完成" icon="el-icon-s-promotion"></el-step>
    </el-steps>
    <el-form :model="formAPI" ref="formAPI" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" v-show="stepAPI == 1">
      <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
        <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">基础信息</p>
        <div style="width: 100%; height: auto; min-height: 150px; margin-top: 20px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="项目组：" :required="true" prop="projectGroupId">
                <el-select v-model="formAPI.projectGroupId" filterable placeholder="">
                  <el-option v-for="(item, index) in projectGroupList" v-bind:key="index" :label="item.projectGroupName" :value="item.projectGroupId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="API名称：" :required="true" prop="apiName">
                <el-input v-model.trim="formAPI.apiName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求方式：" :required="true" prop="apiMethod">
                <el-select v-model="formAPI.apiMethod" filterable placeholder="">
                  <el-option label="GET" value="GET"></el-option>
                  <el-option label="POST" value="POST"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="API集合：" :required="true" prop="apiCollectionId">
                <el-select
                  v-model="formAPI.apiCollectionId"
                  filterable
                  placeholder=""
                  @change="
                    formAPI.apiCollectionPath = apiCollectionList.filter(s => {
                      return s.id == formAPI.apiCollectionId
                    })[0].collectionPath
                  "
                >
                  <el-option v-for="(item, index) in apiCollectionList" v-bind:key="index" :label="item.collectionName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-show="formAPI.apiCollectionId">
              <el-form-item label="API Path：" :required="true" prop="apiPath">
                <el-input v-model.trim="formAPI.apiPath" autocomplete="off">
                  <template slot="prepend">/api/{{ formAPI.apiCollectionPath }}/</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="API描述：" prop="apiDesc">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 100 }" v-model.trim="formAPI.apiDesc" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
        <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">数据源</p>
        <div style="width: 100%; height: auto; min-height: 100px; margin-top: 20px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="数据源：" :required="true" prop="dataType">
                <el-select v-model="formAPI.dataType" filterable placeholder="请选择类型" @change="dataTypeChange()">
                  <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="" :required="true" prop="dataSourceId" label-width="0">
                <el-select v-model="formAPI.dataSourceId" filterable placeholder="请选择数据源" @change="dataSourceChange()">
                  <el-option v-for="(item, index) in dataSourceList" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="库表选择：" :required="true" prop="dbName">
                <el-select v-model="formAPI.dbName" filterable placeholder="请选择库">
                  <el-option v-for="(item, index) in dbNameList" v-bind:key="index" :label="item.dbName" :value="item.dbName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="" :required="true" prop="tableName" label-width="0">
                <el-select v-model="formAPI.tableName" filterable placeholder="请选择表" @change="tableNameChange()">
                  <el-option v-for="(item, index) in tableNameList" v-bind:key="index" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <el-form :model="formConfig" ref="formConfig" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" v-show="stepAPI == 2">
      <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
        <div style="width: 100%; height: 32px; margin: 0 auto; overflow: hidden">
          <div style="width: auto; height: 32px; float: right; margin: 0">
            <el-button type="primary" @click="showColumns()" size="mini" style="width: 100px">配置</el-button>
          </div>
          <el-dialog title="参数配置" :visible.sync="dialogShowColumns" width="1200px" class="top20VhDialog">
            <div style="width: 100%; height: auto; margin-top: 10px; padding-bottom: 20px">
              <el-table element-loading-text="数据加载中" class="data-table" ref="tableColumns" :data="columnsData" border stripe :max-height="500">
                <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
                <el-table-column prop="columnName" label="字段名称" min-width="120" align="left"> </el-table-column>
                <el-table-column prop="javaType" label="字段类型" min-width="100" align="left"> </el-table-column>
                <el-table-column prop="columnComment" label="字段描述" min-width="250" align="left"> </el-table-column>
                <el-table-column prop="isRequest" label="查询条件" min-width="100" align="center">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.isRequest"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column prop="isResponse" label="返回参数" min-width="100" align="center">
                  <template slot="header" slot-scope="scope"> <el-checkbox v-model="columnsTitleCheck[1]" true-label="1" false-label="0" @change="columnsTitleCheckChange(1, 'isResponse')">返回参数</el-checkbox> </template>
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.isResponse"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column prop="isOrderby" label="排序参数" min-width="100" align="center">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.isOrderby"></el-checkbox>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogShowColumns = false" style="width: 120px">取 消</el-button>
              <el-button type="primary" @click="sureColumns()" style="width: 120px">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <div style="width: 100%; height: auto; margin: 10px auto 0 auto; overflow: hidden">
          <el-collapse v-model="configAcitve" accordion>
            <el-collapse-item title="查询条件" name="查询条件">
              <div style="width: 100%; height: auto; margin: 0 auto">
                <el-table class="data-table" ref="tableRequest" :data="formConfig.requestParameterList" border stripe>
                  <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
                  <el-table-column prop="requestParamName" label="参数名称" align="center" min-width="150"> </el-table-column>
                  <el-table-column prop="requestParamType" label="参数类型" align="center" min-width="150">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.requestParamType" filterable placeholder="">
                        <el-option label="INT" value="INT"></el-option>
                        <el-option label="STRING" value="STRING"></el-option>
                        <el-option label="DOUBLE" value="DOUBLE"></el-option>
                        <el-option label="BOOLEAN" value="BOOLEAN"></el-option>
                        <el-option label="DECIMAL" value="DECIMAL"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="mustHave" label="是否必填" align="center" min-width="150">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.mustHave"></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column prop="defaultValue" label="默认值" align="center" min-width="150">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.defaultValue" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="desc" label="描述" align="center" min-width="250">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.desc" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
            <el-collapse-item title="返回参数" name="返回参数">
              <div style="width: 100%; height: auto; margin: 0 auto">
                <el-table class="data-table" ref="tableResponse" :data="formConfig.responseParameterList" border stripe>
                  <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
                  <el-table-column prop="responseParamName" label="参数名称" align="center" min-width="150"> </el-table-column>
                  <el-table-column prop="responseParamType" label="参数类型" align="center" min-width="150">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.responseParamType" filterable placeholder="">
                        <el-option label="INT" value="INT"></el-option>
                        <el-option label="STRING" value="STRING"></el-option>
                        <el-option label="DOUBLE" value="DOUBLE"></el-option>
                        <el-option label="BOOLEAN" value="BOOLEAN"></el-option>
                        <el-option label="DECIMAL" value="DECIMAL"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="exampleValue" label="示例值" align="center" min-width="150">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.exampleValue" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="desc" label="描述" align="center" min-width="250">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.desc" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
            <el-collapse-item title="排序参数" name="排序参数">
              <div style="width: 100%; height: auto; margin: 0 auto">
                <el-table class="data-table" ref="tableOrderby" :data="formConfig.apiOrderBy" border stripe>
                  <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
                  <el-table-column prop="orderByname" label="参数名称" align="center" min-width="150"> </el-table-column>
                  <el-table-column label="操作" align="center" width="220" fixed="right">
                    <template slot-scope="scope">
                      <p class="tableAction" :class="scope.$index == 0 ? 'disabledTableAction' : ''" @click="scope.$index == 0 ? '' : changeIndexOrderby(scope.$index, scope.$index - 1)">上移</p>
                      <p class="tableAction" :class="scope.$index == formConfig.apiOrderBy.length - 1 ? 'disabledTableAction' : ''" @click="scope.$index == formConfig.apiOrderBy.length - 1 ? '' : changeIndexOrderby(scope.$index, scope.$index + 1)">下移</p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: right; margin-top: 20px">
      <el-button @click="closeDialog" style="width: 120px">取 消</el-button>
      <el-button @click="stepAPI -= 1" v-if="stepAPI == 2" style="width: 120px">上一步</el-button>
      <el-button type="primary" @click="nextStep()" v-if="stepAPI == 1" style="width: 120px">下一步</el-button>
      <el-button type="primary" v-if="addOrModifyAPI && stepAPI == 2" @click="addAPI()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
      <el-button type="primary" v-if="!addOrModifyAPI && stepAPI == 2" @click="modifyAPI()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
    </div>
  </div>
</template>
    
    <script>
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'APIDialog',
  props: {
    addOrModifyAPI: '',
    taskRow: ''
  },
  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      buttonLoad: false,

      stepAPI: 1,
      apiCollectionList: [],
      dataTypeList: [],
      dataSourceList: [],
      dbNameList: [],
      tableNameList: [],
      columnsData: [],
      dialogShowColumns: false,
      formAPI: {
        projectGroupId: '',
        apiName: '',
        apiCollectionId: '',
        apiCollectionPath: '',
        apiPath: '',
        apiMethod: '',
        apiDesc: '',

        dataType: '',
        dataSourceId: '',
        dbName: '',
        tableName: '',

        page: 1,
        pageSize: 10
      },
      configAcitve: '查询条件',
      formConfig: {
        apiOrderBy: [],
        requestParameterList: [],
        responseParameterList: []
      },
      columnsTitleCheck: [0, 0, 0],
      projectGroupList: []
    }
  },
  mounted() {
    this.getProjectGroupList()
    this.getDataTypeList()
    this.getApiCollectionList()
    this.init()
  },
  methods: {
    // 获取项目组list
    getProjectGroupList() {
      let that = this
      request({ url: '/project_group_permission/user_info_id', method: 'get', params: { userInfoId: that.$store.state.userInfo.id } }).then(res => {
        that.projectGroupList = res.data
      })
    },
    // 获取数据源类型list
    getDataTypeList() {
      let that = this
      request({ url: '/data_source/type/api/list', method: 'get', params: {} }).then(res => {
        that.dataTypeList = res.data
      })
    },
    // 获取API集合list
    getApiCollectionList() {
      let that = this
      request({ url: '/auto_api/collection/list', method: 'get', params: {} }).then(res => {
        that.apiCollectionList = res.data
      })
    },
    init() {
      let that = this
      if (that.addOrModifyAPI) {
        that.stepAPI = 1
        that.buttonLoad = false
        resetForm('formAPI', that)
        resetForm('formConfig', that)
        that.formAPI.apiCollectionPath = '-'
        that.formConfig = {
          apiOrderBy: [],
          requestParameterList: [],
          responseParameterList: []
        }
      } else if (!that.addOrModifyTask) {
        request({ url: '/auto_api/get_by_id', method: 'get', params: { id: that.taskRow.id } }).then(res => {
          if (res.code == 200) {
            that.stepAPI = 1
            that.buttonLoad = false
            resetForm('formAPI', that)
            resetForm('formConfig', that)
            that.formConfig = {
              apiOrderBy: [],
              requestParameterList: [],
              responseParameterList: []
            }
            that.$nextTick(() => {
              that.formAPI.projectGroupId = res.data.projectGroupId
              that.formAPI.id = res.data.id
              that.formAPI.apiName = res.data.apiName
              that.formAPI.apiCollectionId = res.data.apiCollectionId
              that.formAPI.apiPath = res.data.apiPath.split('/')[3]
              that.formAPI.apiCollectionPath = res.data.apiPath.split('/')[2]
              that.formAPI.apiMethod = res.data.apiMethod
              that.formAPI.apiDesc = res.data.apiDesc
              that.formAPI.page = res.data.page
              that.formAPI.pageSize = res.data.pageSize
              that.formConfig = {
                apiOrderBy: [],
                requestParameterList: res.data.requestParameterList,
                responseParameterList: res.data.responseParameterList
              }
              if (res.data.apiOrderBy) {
                res.data.apiOrderBy.forEach(item => {
                  that.formConfig.apiOrderBy.push({ orderByname: item })
                })
              }
              that.formAPI.dataType = 'MySQL'
              that.formAPI.dataSourceId = res.data.dataSourceId
              request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.formAPI.dataType, page: 1, pageSize: 1000 } }).then(res2 => {
                that.dataSourceList = res2.data.list || []
                that.dbNameList = that.dataSourceList.filter(s => {
                  return s.id == that.formAPI.dataSourceId
                })
                that.formAPI.dbName = that.dbNameList[0].dbName
                request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formAPI.dataSourceId } }).then(res3 => {
                  that.tableNameList = res3.data
                  that.formAPI.tableName = res.data.apiTableName
                  request({ url: '/data_source/columns', method: 'get', params: { id: that.formAPI.dataSourceId, table: that.formAPI.tableName } }).then(res4 => {
                    let temp = []
                    if (res4.data) {
                      res4.data.forEach((item, index) => {
                        temp.push({ ...item, isRequest: false, isResponse: false, isOrderby: false })
                      })
                    }
                    that.columnsData = temp
                  })
                })
              })
            })
          }
        })
      }
    },
    // 数据源类型change
    dataTypeChange() {
      let that = this
      that.dataSourceList = []
      that.dbNameList = []
      that.tableNameList = []
      that.formAPI.dataSourceId = ''
      that.formAPI.dbName = ''
      that.formAPI.tableName = ''
      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.formAPI.dataType, page: 1, pageSize: 1000 } }).then(res => {
        that.dataSourceList = res.data.list || []
      })
    },
    // 数据源change
    dataSourceChange() {
      let that = this
      that.dbNameList = that.dataSourceList.filter(s => {
        return s.id == that.formAPI.dataSourceId
      })
      that.tableNameList = []
      that.formAPI.tableName = ''
      that.formAPI.dbName = that.dbNameList[0].dbName
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formAPI.dataSourceId } }).then(res => {
        that.tableNameList = res.data
      })
    },
    // 表change
    tableNameChange() {
      let that = this
      that.columnsData = []
      request({ url: '/data_source/columns', method: 'get', params: { id: that.formAPI.dataSourceId, table: that.formAPI.tableName } }).then(res => {
        let temp = []
        if (res.data) {
          res.data.forEach((item, index) => {
            temp.push({ ...item, isRequest: false, isResponse: false, isOrderby: false })
          })
        }
        that.columnsData = temp
      })
    },
    // API新增
    addAPI() {
      let that = this
      that.formAPI.apiOrderBy = []
      that.formConfig.apiOrderBy.forEach(item => {
        that.formAPI.apiOrderBy.push(item.orderByname)
      })
      that.formAPI.requestParameterList = that.formConfig.requestParameterList
      that.formAPI.responseParameterList = that.formConfig.responseParameterList
      let { dataType, dbName, ...params } = that.formAPI
      params.id = null
      params.update = false
      params.permissionInfo = {
        permissionName: '/api/' + that.formAPI.apiCollectionPath + '/' + that.formAPI.apiPath,
        permissionTopic: 'API_INFO',
        permissionState: true
      }
      that.buttonLoad = true
      request({ url: '/auto_api/add', method: 'post', data: params })
        .then(res => {
          setTimeout(() => {
            that.buttonLoad = false
          }, 300)
          if (res.code == '200') {
            Notify('success', res.message || '处理成功')
            that.dialogShowAPI = false
            that.$emit('close', '')
            that.$emit('getData', '')
          }
        })
        .catch(() => {
          setTimeout(() => {
            that.buttonLoad = false
          }, 300)
        })
    },
    modifyAPI() {
      let that = this
      that.formAPI.apiOrderBy = []
      that.formConfig.apiOrderBy.forEach(item => {
        that.formAPI.apiOrderBy.push(item.orderByname)
      })
      that.formAPI.requestParameterList = that.formConfig.requestParameterList
      that.formAPI.responseParameterList = that.formConfig.responseParameterList
      let { dataType, dbName, ...params } = that.formAPI
      params.update = true
      that.buttonLoad = true
      request({ url: '/auto_api/add', method: 'post', data: params })
        .then(res => {
          setTimeout(() => {
            that.buttonLoad = false
          }, 300)
          if (res.code == '200') {
            Notify('success', res.message || '处理成功')
            that.dialogShowAPI = false
            that.$emit('close', '')
            that.$emit('getData', '')
          }
        })
        .catch(() => {
          setTimeout(() => {
            that.buttonLoad = false
          }, 300)
        })
    },
    // 展示columns配置
    showColumns() {
      let that = this
      that.dialogShowColumns = true
      that.columnsTitleCheck = [0, 0, 0]
      that.columnsData.forEach((item, index) => {
        item.isRequest = false
        item.isResponse = false
        item.isOrderby = false
      })
    },
    // columns配置确定
    sureColumns() {
      let that = this
      that.formConfig.requestParameterList = []
      that.formConfig.responseParameterList = []
      that.formConfig.apiOrderBy = []
      that.columnsData.forEach(item => {
        if (item.isRequest) {
          that.formConfig.requestParameterList.push({ requestParamName: item.columnName, requestParamType: item.javaType, desc: item.columnComment, mustHave: false, defaultValue: '' })
        }
        if (item.isResponse) {
          that.formConfig.responseParameterList.push({ responseParamName: item.columnName, responseParamType: item.javaType, desc: item.columnComment, exampleValue: '' })
        }
        if (item.isOrderby) {
          that.formConfig.apiOrderBy.push({ orderByname: item.columnName })
        }
      })
      setTimeout(() => {
        that.$refs.tableRequest.doLayout()
        that.$refs.tableResponse.doLayout()
        that.$refs.tableOrderby.doLayout()
      }, 300)
      that.dialogShowColumns = false
    },
    // 排序参数 调换顺序
    changeIndexOrderby(index, nextIndex) {
      let that = this
      let temp = that.formConfig.apiOrderBy[index].orderByname
      that.formConfig.apiOrderBy[index].orderByname = that.formConfig.apiOrderBy[nextIndex].orderByname
      that.formConfig.apiOrderBy[nextIndex].orderByname = temp
    },
    // 下一步
    nextStep() {
      let that = this
      if (that.stepAPI == 1) {
        that.$refs['formAPI'].validate(valid => {
          if (valid) {
            that.stepAPI += 1
          } else {
            Notify('error', '请将红色标注部分填写完整')
          }
        })
      }
    },
    columnsTitleCheckChange(i, x) {
      let that = this
      that.columnsData.forEach((item, index) => {
        if (that.columnsTitleCheck[i] == '1') {
          item[x] = true
        } else {
          item[x] = false
        }
      })
    },
    closeDialog() {
      this.$emit('close', '')
    }
  }
}
</script>
    
    <style>
</style>