<template>
  <div class="manageMain APIList">
    <div class="buttonArea">
      <el-button icon="el-icon-plus" type="primary" @click="newAPI()" size="mini">新建API</el-button>
    </div>
    <div class="searchArea">
      <div class="searchFormUnit">
        <p class="searchLabel">API集合:</p>
        <div class="searchForm" style="width: 150px">
          <el-select v-model="queryForm.apiCollectionId" filterable placeholder="请选择" @change=";(queryForm.pageNum = 1), getAPIData()">
            <el-option v-for="(item, index) in apiCollectionList" v-bind:key="index" :label="item.collectionName" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="searchFormUnit">
        <p class="searchLabel">数据源:</p>
        <div class="searchForm" style="width: 100px">
          <el-select v-model="queryForm.dataType" filterable placeholder="请选择" clearable @change="getDataSourceListQuery()">
            <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="searchForm" style="width: 150px">
          <el-select v-model="queryForm.dataSourceId" filterable placeholder="请选择" clearable @change="getTableNameListQuery(), (queryForm.pageNum = 1), getAPIData()">
            <el-option v-for="(item, index) in dataSourceListQuery" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="searchForm" style="width: 150px">
          <el-select v-model="queryForm.apiTableName" filterable placeholder="请选择" clearable @change=";(queryForm.pageNum = 1), getAPIData()">
            <el-option v-for="(item, index) in tableNameListQuery" v-bind:key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="tableArea">
      <el-table v-loading="loadingAPI" element-loading-text="数据加载中" ref="table" :data="APIData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="apiName" label="API名称" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="apiCollectionName" label="API集合" min-width="80" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="apiPath" label="API Path" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="apiMethod" label="请求方式" min-width="60" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="dataSourceName" label="数据源" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="apiTableName" label="表名" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="apiDesc" label="描述" min-width="140" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="250" fixed="right">
          <template slot-scope="scope">
            <p v-if="judgeIfPermit(scope.row) == 0" class="tableAction" @click="applyPermission(scope.row)">申请权限</p>
            <p v-if="judgeIfPermit(scope.row) == 2" class="tableAction disabledTableAction">权限审核中</p>
            <p :class="judgeIfPermit(scope.row) == 1 ? '' : 'disabledTableAction'" class="tableAction" @click="judgeIfPermit(scope.row) == 1 ? showTestAPI(scope.row) : ''">测试</p>
            <!-- <p class="tableAction" @click="showTestAPI(scope.row)">测试</p> -->
            <!-- <p class="tableAction" @click="seeAPI(scope.row)">修改</p> -->
            <p :class="judgeIfPermit(scope.row) == 1 ? '' : 'disabledTableAction'" class="tableAction" @click="judgeIfPermit(scope.row) == 1 ? seeAPI(scope.row) : ''">修改</p>
            <p :class="judgeIfPermit(scope.row) == 1 ? '' : 'disabledTableActionDanger'" class="tableActionDanger" @click="judgeIfPermit(scope.row) == 1 ? cancelAPI(scope.row) : ''">删除</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getAPIData"> </pagination>
    </div>
    <el-dialog :title="titleAPI" :visible.sync="dialogShowAPI" width="1200px">
      <APIDialog v-if="dialogShowAPI" :addOrModifyAPI="addOrModifyAPI" :taskRow="taskRow" @close="dialogShowAPI = false" @getData="getAPIDataAndPermissionList"></APIDialog>
    </el-dialog>

    <el-dialog :title="titleTest" :visible.sync="dialogShowTest" width="900px">
      <div style="width: 100%; height: 500px; margin: 0 auto; overflow: hidden">
        <div style="width: 100%; height: 500px" v-if="stepTest == 1">
          <el-descriptions title="" border style="margin-top: 20px" :column="2">
            <el-descriptions-item label="API名称">{{ tempTestRow.apiName }}</el-descriptions-item>
            <el-descriptions-item label="请求方式">{{ tempTestRow.apiMethod }}</el-descriptions-item>
            <el-descriptions-item label="API Path" :span="2">{{ tempTestRow.apiPath }}</el-descriptions-item>
            <el-descriptions-item label="描述">
              {{ tempTestRow.apiDesc }}
            </el-descriptions-item>
          </el-descriptions>
          <el-form :model="formRequest" ref="formRequest" label-width="15px" :rules="rules" :show-message="false" class="demo-ruleForm" style="margin-top: 10px">
            <el-table class="data-table haveInputTable" ref="requestTable" :data="formRequest.requestTable" stripe :height="300">
              <el-table-column prop="requestParamName" label="参数名称" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-popover placement="top-start" title="描述：" width="200" trigger="hover" :content="scope.row.desc">
                    <span slot="reference">{{ scope.row.requestParamName }}</span>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="requestParamType" label="参数类型" min-width="60" align="center" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="mustHave" label="是否必填" min-width="50" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.mustHave ? '是' : '否' }}
                </template>
              </el-table-column>
              <el-table-column prop="value" label="值" min-width="100" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item label=" " :required="scope.row.mustHave" :prop="'requestTable.' + scope.$index + '.value'" style="margin-bottom: 0">
                    <el-input v-model="scope.row.value" size="small" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
        <div style="width: 100%; height: 500px" v-if="stepTest == 2">
          <div style="margin: 10px auto 0 auto; width: 98%; height: 40px; overflow: hidden">
            <p style="width: calc(100% - 180px); height: 40px; line-height: 40px; font-size: 18px; color: #303133; float: left; overflow: hidden; white-space: nowrap; text-overflow: ellipsis" :title="testResult.config.url">{{ testResult.config.url }}</p>
            <div style="width: auto; height: 40px; float: right; overflow: hidden" v-if="testResult.status && testResult.status == 200">
              <i class="el-icon-success" style="font-size: 24px; color: #409eff; display: block; float: left; margin-top: 8px"> </i>
              <p style="width: auto; height: 40px; line-height: 40px; font-size: 20px; color: #409eff; margin-left: 5px; float: left">请求成功</p>
            </div>
            <div style="width: auto; height: 40px; float: right; overflow: hidden" v-if="testResult.status && testResult.status != 200">
              <i class="el-icon-error" style="font-size: 24px; color: #f56c6c; display: block; float: left; margin-top: 8px"> </i>
              <p style="width: auto; height: 40px; line-height: 40px; font-size: 20px; color: #f56c6c; margin-left: 5px; float: left">请求失败</p>
            </div>
          </div>

          <el-tabs type="border-card" style="width: 98%; height: 396px; margin: 10px auto 0 auto; box-shadow: none; -webkit-box-shadow: none">
            <el-tab-pane label="返回内容" style="height: 100%">
              <el-table v-loading="testResultLoading" element-loading-text="数据加载中" class="data-table" ref="tableResult" :data="testResult.data.data" stripe height="304">
                <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
                <el-table-column :prop="item" :label="item" min-width="150" align="center" v-for="(item, index) in columnsResult" :key="index"> </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="请求参数" style="height: 100%">
              <div v-loading="testResultLoading" style="width: 100%; height: 304px; overflow: hidden auto; margin: 0 auto; border: 1px solid #ebeef5; box-sizing: border-box; border-radius: 4px">
                <el-table class="data-table" ref="requestTable2" :data="formRequest.requestTable" stripe :height="300">
                  <el-table-column prop="requestParamName" label="Key" min-width="100" align="center"> </el-table-column>
                  <el-table-column prop="value" label="Value" min-width="100" align="center" show-overflow-tooltip> </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="响应主体详情" style="height: 100%">
              <div v-loading="testResultLoading" style="width: 100%; height: 304px; overflow: hidden auto; margin: 0 auto; border: 1px solid #ebeef5; box-sizing: border-box; border-radius: 4px">
                <json-viewer :value="testResult.data" :expand-depth="5"></json-viewer>
              </div>
            </el-tab-pane>
            <el-tab-pane label="请求头详情" style="height: 100%">
              <div v-loading="testResultLoading" style="width: 100%; height: 304px; overflow: hidden auto; margin: 0 auto; border: 1px solid #ebeef5; box-sizing: border-box; border-radius: 4px">
                <json-viewer :value="testResult.config.headers" :expand-depth="5"></json-viewer>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowTest = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button @click="stepTest -= 1" v-if="stepTest == 2" style="width: 100px" size="mini">上一步</el-button>
        <el-button type="primary" @click="startTestAPI()" v-if="stepTest == 1" style="width: 100px" size="mini">开始测试</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
import apiTestRequest from '@/api/apiTestRequest'
import APIDialog from './components/APIDialog.vue'
export default {
  name: 'APIList',
  components: {
    pagination,
    APIDialog
  },
  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      buttonLoad: false,
      dataTypeList: [],
      apiCollectionList: [],
      queryForm: {
        apiCollectionId: null,
        dataType: null,
        dataSourceId: null,
        apiTableName: null,
        pageSize: 20,
        page: 1,
        total: 0
      },
      dataSourceListQuery: [],
      tableNameListQuery: [],
      APIData: [],
      loadingAPI: true,
      permissionList: [],

      dialogShowAPI: false,
      titleAPI: '',
      taskRow: '',

      titleTest: '',
      tempTestRow: '',
      formRequest: {
        requestTable: []
      },
      stepTest: 1,
      dialogShowTest: false,
      testResultLoading: false,
      testResult: { config: { headers: {} }, data: {}, status: null },
      columnsResult: ['-'],

      columnsTitleCheck: [0, 0, 0],

      projectGroupList: []
    }
  },
  mounted() {
    this.getProjectGroupList()
    this.getDataTypeList()
    this.getApiCollectionList()
    this.getAPIData()
    this.getPermissionList()
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
    // 获取数据源list
    getDataSourceListQuery() {
      let that = this
      that.queryForm.dataSourceId = null
      that.queryForm.apiTableName = null
      that.dataSourceListQuery = []
      that.tableNameListQuery = []
      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.queryForm.dataType, page: 1, pageSize: 1000 } }).then(res => {
        that.dataSourceListQuery = res.data.list || []
      })
    },
    // 获取表名list
    getTableNameListQuery() {
      let that = this
      that.queryForm.apiTableName = null
      that.tableNameListQuery = []
      if (that.queryForm.dataSourceId) {
        request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.queryForm.dataSourceId } }).then(res => {
          that.tableNameListQuery = res.data
        })
      }
    },
    getAPIDataAndPermissionList() {
      let that = this
      that.getAPIData()
      that.getPermissionList()
    },
    // 获取数据源数据
    getAPIData() {
      let that = this
      that.loadingAPI = true
      request({ url: '/auto_api/list', method: 'post', data: { apiCollectionId: that.queryForm.apiCollectionId, dataSourceId: that.queryForm.dataSourceId || null, apiTableName: that.queryForm.apiTableName || null, page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.APIData = res.data.list || []
        that.loadingAPI = false
        that.queryForm.total = res.data.total || 0
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 获取权限下apiList
    getPermissionList() {
      let that = this
      request({ url: '/permission/list', method: 'get', params: {} }).then(res => {
        that.permissionList = res.data
      })
    },
    // 判断是否有权限 0为没有权限 1为有权限 2为权限正在申请中
    judgeIfPermit(row) {
      let that = this
      let temp = that.permissionList.filter(s => {
        return s.permissionName == row.apiPath
      })
      if (temp[0]) {
        if (temp[0].permissionState) {
          return 1
        } else {
          return 2
        }
      } else {
        return 0
      }
    },
    // 申请权限
    applyPermission(row) {
      let that = this
      request({ url: '/permission/add', method: 'post', data: { permissionName: row.apiPath, permissionTopic: 'API_INFO' } }).then(res => {
        res.code == 200 && (Notify('success', res.message || '处理中'), that.getAPIData(), that.getPermissionList())
      })
    },
    // 新建API
    newAPI() {
      let that = this
      that.addOrModifyAPI = true
      that.titleAPI = '新建API信息'
      that.taskRow = {}
      that.dialogShowAPI = true
    },

    // API回显
    seeAPI(row) {
      let that = this
      that.addOrModifyAPI = false
      that.titleAPI = '修改API信息    [' + row.apiName + ']'
      that.taskRow = { ...row }
      that.dialogShowAPI = true
    },

    showTestAPI(row) {
      let that = this
      that.titleTest = 'API测试    [' + row.apiName + ']'
      that.dialogShowTest = true
      that.stepTest = 1
      that.$nextTick(() => {
        that.testResult = { config: { headers: {} }, data: {}, status: null }
        that.formRequest.requestTable = []
        that.tempTestRow = { ...row }
        that.tempTestRow.requestParameterList.forEach(item => {
          that.formRequest.requestTable.push({ requestParamName: item.requestParamName, requestParamType: item.requestParamType, mustHave: item.mustHave, value: item.defaultValue, desc: item.desc })
        })
        that.formRequest.requestTable.push({ requestParamName: 'page', requestParamType: 'INT', mustHave: true, value: that.tempTestRow.page || 1, desc: '分页页号' })
        that.formRequest.requestTable.push({ requestParamName: 'pageSize', requestParamType: 'INT', mustHave: true, value: that.tempTestRow.pageSize || 10, desc: '分页大小' })
      })
    },
    startTestAPI() {
      let that = this
      that.$refs['formRequest'].validate(valid => {
        if (valid) {
          that.testResult = { config: { headers: {} }, data: {}, status: null }
          that.testResultLoading = true
          let params = {}
          that.formRequest.requestTable.forEach(item => {
            params[item.requestParamName] = item.value
          })
          let temp = that.permissionList.filter(s => {
            return s.permissionName == that.tempTestRow.apiPath
          })
          apiTestRequest({ url: that.tempTestRow.apiPath, method: that.tempTestRow.apiMethod, params: that.tempTestRow.apiMethod == 'GET' ? params : null, data: that.tempTestRow.apiMethod == 'POST' ? params : null, headers: temp[0] ? { apiKey: temp[0].permissionKey } : {} }).then(res => {
            if (res.data.code == 200) {
              that.testResultLoading = false
              that.testResult = res
              if (res.data.data && res.data.data[0]) {
                that.columnsResult = Object.keys(res.data.data[0])
              } else {
                that.columnsResult = ['-']
              }
              that.stepTest = 2
              setTimeout(() => {
                that.$refs.tableResult.doLayout()
              }, 300)
            } else {
              Notify('error', res.data.message)
            }
          })
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    cancelAPI(row) {
      let that = this
      this.$confirm('是否删除[' + row.apiName + ']API信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            id: row.id
          }
          request({ url: '/auto_api/delete', method: 'post', data: params }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), that.getAPIData())
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
