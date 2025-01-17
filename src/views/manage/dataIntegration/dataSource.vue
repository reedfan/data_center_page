<template>
  <div class="manageMain dataSource">
    <div class="buttonArea">
      <el-button icon="el-icon-plus" type="primary" @click="newSJY()" size="mini">登记数据源</el-button>
    </div>
    <div class="searchArea">
      <div class="searchFormUnit">
        <p class="searchLabel">数据源类型:</p>
        <div class="searchForm" style="width: 100px">
          <el-select v-model="queryForm.type" filterable placeholder="请选择" @change=";(queryForm.pageNum = 1), getSJYData()">
            <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
      </div>
      <div class="searchFormUnit" style="width: 300px; float: right; margin-right: 0">
        <el-input v-model="queryForm.sourceName" placeholder="请输入数据源名称"> <el-button slot="append" icon="el-icon-search" @click=";(queryForm.pageNum = 1), getSJYData()"></el-button> </el-input>
      </div>
    </div>
    <div class="tableArea">
      <el-table v-loading="loadingSJY" element-loading-text="数据加载中" ref="table" :data="SJYData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <!-- <el-table-column prop="id" label="数据源ID" min-width="80" align="center"> </el-table-column> -->
        <el-table-column prop="dbType" label="数据源类型" min-width="120" align="left">
          <template slot-scope="scope">
            <i :class="'icon' + scope.row.dbType"></i>
            <p style="display: inline-block; vertical-align: middle; margin-left: 3px">{{ scope.row.dbType }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="scourceName" label="数据源名称" min-width="250" align="left">
          <template slot-scope="scope">
            <div style="width: 100%; height: 100%; display: flex; align-items: center">
              <p style="max-width: 210px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin: 0" :title="scope.row.sourceName">{{ scope.row.sourceName }}</p>
              <i class="el-icon-document-copy" style="cursor: pointer; vertical-align: middle; margin-left: 8px" @click="copyText(scope.row.sourceName)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dbName" label="库名称" min-width="250" align="left" v-if="queryForm.type != 'FTP'">
          <template slot-scope="scope">
            <div style="width: 100%; height: 100%; display: flex; align-items: center">
              <p v-if="scope.row.dbType != 'MongoDB'" @click="showTable(scope.row)" style="max-width: 160px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin: 0" class="tableLink" :title="scope.row.dbName">{{ scope.row.dbName }}</p>
              <p v-else style="max-width: 210px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin: 0" :title="scope.row.dbName">{{ scope.row.dbName }}</p>
              <i class="el-icon-document-copy" style="cursor: pointer; vertical-align: middle; margin-left: 8px" @click="copyText(scope.row.dbName)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="测试连接" min-width="130" align="center">
          <template slot-scope="scope">
            <span style="color: #67c23a" v-if="scope.row.status">连接成功</span>
            <span style="color: #fc4b4b" v-if="!scope.row.status">连接失败</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="dbIp" label="IP" min-width="160" align="center"> </el-table-column>
        <el-table-column prop="dbPort" label="Port" min-width="120" align="center"> </el-table-column> -->
        <el-table-column prop="owner" label="负责人" min-width="130" align="center"> </el-table-column>
        <!-- <el-table-column prop="version" label="版本" min-width="100" align="center"> </el-table-column> -->
        <el-table-column prop="createTime" label="创建时间" min-width="180" align="center"> </el-table-column>
        <!-- <el-table-column prop="updateTime" label="修改时间" min-width="180" align="center"> </el-table-column> -->
        <el-table-column label="操作" align="center" width="220" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="seeSJY(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelSJY(scope.row)">删除</p>
            <p class="tableAction" v-if="scope.row.status" @click="seeReference(scope.row)">引用详情</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getSJYData"> </pagination>
    </div>
    <el-dialog :title="titleSJY" :visible.sync="formShowSJY" width="530px">
      <el-form :model="formSJY" ref="formSJY" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="项目组：" :required="true" prop="projectGroupId">
                <el-select v-model="formSJY.projectGroupId" filterable placeholder="">
                  <el-option v-for="(item, index) in projectGroupList" v-bind:key="index" :label="item.projectGroupName" :value="item.projectGroupId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="数据源类型：" :required="true" prop="dbType">
                <el-select v-model="formSJY.dbType" filterable placeholder="">
                  <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="数据源名称：" :required="true" prop="sourceName">
                <el-input v-model.trim="formSJY.sourceName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-show="formSJY.dbType != 'FTP'">
              <el-form-item label="库名称：" :required="formSJY.dbType != 'FTP'" prop="dbName">
                <el-input v-model.trim="formSJY.dbName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24" v-show="formSJY.dbType == 'Hive'">
              <el-form-item label="defaultFS：" :required="formSJY.dbType == 'Hive'" prop="defaultFS">
                <el-input v-model.trim="formSJY.defaultFS" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="24">
              <el-form-item label="IP：" :required="true" prop="dbIp">
                <el-input v-model.trim="formSJY.dbIp" oninput="value=value.replace(/[^\w.]/g,'')" placeholder="仅支持数字、字母、." autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Port：" :required="true" prop="dbPort">
                <el-input v-model.trim="formSJY.dbPort" oninput="value=value.replace(/[^\w:]/g,'')" placeholder="仅支持数字、字母、:" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-show="addOrModifySJY || !formSJY.status">
              <el-form-item label="用户名：" prop="dbUser" :required="addOrModifySJY || !formSJY.status">
                <el-input v-model.trim="formSJY.dbUser" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-show="addOrModifySJY || !formSJY.status">
              <el-form-item label="密码：" prop="dbPassword" :required="addOrModifySJY || !formSJY.status">
                <el-input v-model.trim="formSJY.dbPassword" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShowSJY = false" style="width: 100px" size="mini">取消</el-button>
        <el-button type="primary" style="width: 100px" size="mini" @click="connectTest()" :disabled="buttonLoad" :loading="buttonLoad">测试连接</el-button>
        <!-- <el-button type="primary" style="width: 100px" size="mini" v-if="addOrModifySJY && connectSuccessSJY" @click="addSJY(true)" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="!addOrModifySJY && connectSuccessSJY" @click="modifySJY(true)" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button> -->
      </div>
    </el-dialog>
    <el-dialog :title="titleTable" :visible.sync="dialogShowTable" width="1400px">
      <div style="width: 100%; height: 500px; background: #e6eaef; overflow: hidden">
        <div style="width: 240px; height: 100%; background: #ffffff; float: left; overflow-x: hidden; overflow-y: auto" v-loading="loadingTable">
          <div class="leftChooseIn">
            <div class="chooseUnit" v-for="(item, index) in tableList" :key="index" :class="activeTable == item ? 'active' : 'notActive'">
              <i :class="activeTable == item ? 'el-icon-right active' : 'notActive'"></i>
              <p :title="item" @click=";(activeTable = item), getColumns()">{{ item }}</p>
            </div>
            <p style="width: 100%; height: 40px; line-height: 40px; margin: 260px auto; text-align: center; color: #909399" v-if="!loadingTable && (tableList.length == 0 || !tableList)">暂无数据</p>
          </div>
        </div>
        <div style="width: calc(100% - 245px); height: 100%; background: #ffffff; float: right">
          <p style="width: 96%; margin: 10px auto 0 auto; height: 30px; line-height: 30px; font-size: 18px; text-align: left; color: #333333">{{ activeTable }}</p>
          <el-table v-loading="loadingColumns" element-loading-text="数据加载中" style="width: 96%; margin: 10px auto 0 auto" class="data-table" ref="tableColumns" :data="columnsData" border stripe :height="440">
            <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
            <el-table-column prop="columnName" label="字段名称" min-width="50" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="columnType" label="字段类型" min-width="50" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="columnComment" label="字段描述" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <el-dialog :title="titleReference" :visible.sync="dialogShowReference" width="1030px">
      <el-tabs type="border-card" style="height: 100%; margin: 20px auto" v-model="tabValueReference" v-loading="loadingReference" element-loading-text="数据加载中">
        <el-tab-pane label="数据同步" style="height: 100%" name="数据同步">
          <el-table ref="tableReference" :data="referenceData.taskInfoList" max-height="500px">
            <el-table-column prop="taskName" label="任务名称" min-width="300" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="owner" label="负责人" min-width="180" align="left"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" align="left"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="离线开发" style="height: 100%" name="离线开发">
          <el-table ref="tableReference" :data="referenceData.sqlTaskInfoList" max-height="500px">
            <el-table-column prop="taskName" label="任务名称" min-width="300" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="createBy" label="创建人" min-width="180" align="left"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" align="left"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="质量监控" style="height: 100%" name="质量监控">
          <el-table ref="tableReference" :data="referenceData.monitorRuleTableList" max-height="500px">
            <el-table-column prop="monitorName" label="监控名称" min-width="280" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="tableName" label="监控对象" min-width="220" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="createdBy" label="监控负责人" min-width="180" align="left"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" align="left"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="形态探查" style="height: 100%" name="形态探查">
          <el-table ref="tableReference" :data="referenceData.formDetectList" max-height="500px">
            <el-table-column prop="taskName" label="任务名称" min-width="300" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="tableName" label="探查对象" min-width="180" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="createBy" label="任务负责人" min-width="160" align="left"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" align="left"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="数据比对" style="height: 100%" name="数据比对">
          <el-table ref="tableReference" :data="referenceData.tableCompareInfoList" max-height="500px">
            <el-table-column prop="dataCompareName" label="任务名称" min-width="300" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="leftTableName" label="源表" min-width="120" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="rightTableName" label="比对表" min-width="120" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="createBy" label="任务负责人" min-width="160" align="left"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" align="left"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="API" style="height: 100%" name="API">
          <el-table ref="tableReference" :data="referenceData.autoApiInfoList" max-height="500px">
            <el-table-column prop="apiName" label="API名称" min-width="250" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="apiPath" label="API Path" min-width="150" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="apiMethod" label="请求方式" min-width="120" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="apiTableName" label="表名" min-width="130" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="createdBy" label="创建人" min-width="130" align="left"> </el-table-column>
            <el-table-column prop="createdTime" label="创建时间" min-width="130" align="left"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="数据表" style="height: 100%" name="数据表">
          <el-table ref="tableReference" :data="referenceData.newTableRecordList" max-height="500px">
            <el-table-column prop="tableName" label="表名称" min-width="250" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="topicName" label="主题" min-width="120" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="layerName" label="分层" min-width="130" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="createBy" label="创建人" min-width="130" align="left"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="130" align="left"> </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'dataSource',
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
      queryForm: {
        sourceName: '',
        type: '',
        pageSize: 20,
        page: 1,
        total: 0
      },
      SJYData: [],
      loadingSJY: true,

      formSJY: {
        projectGroupId: '',
        dbType: '',
        sourceName: '',
        dbName: '',
        dbIp: '',
        dbPort: '',
        dbUser: '',
        dbPassword: ''
        // defaultFS: ''
      },
      formShowSJY: false,
      titleSJY: '',

      addOrModifySJY: true,

      tempRow: '',
      titleTable: '',
      dialogShowTable: false,
      tableList: [],
      activeTable: '',
      loadingTable: false,
      loadingColumns: false,
      columnsData: [],

      projectGroupList: [],

      dialogShowReference: false,
      titleReference: '',
      tabValueReference: '数据同步',
      loadingReference: false,
      referenceData: {}
    }
  },
  mounted() {
    this.getProjectGroupList()

    this.getDataTypeList()

    window.onresize = () => {
      return (() => {
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
        that.queryForm.type = res.data[0] || ''
        that.getSJYData()
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
    getSJYData() {
      let that = this
      that.loadingSJY = true
      request({ url: '/data_source/get_all_data_source_by_type', method: 'get', params: { type: that.queryForm.type, sourceName: that.queryForm.sourceName, page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.SJYData = res.data.list || []
        that.queryForm.total = res.data.total || 0
        that.loadingSJY = false
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 新建数据源
    newSJY() {
      let that = this
      that.addOrModifySJY = true
      that.formShowSJY = true
      that.buttonLoad = false

      that.titleSJY = '登记数据源信息'
      that.$nextTick(() => {
        resetForm('formSJY', that)
        that.formSJY = {
          projectGroupId: '',
          dbType: '',
          sourceName: '',
          dbName: '',
          dbIp: '',
          dbPort: '',
          dbUser: '',
          dbPassword: ''
        }
      })
    },
    // 测试连接
    connectTest() {
      let that = this
      that.$refs['formSJY'].validate(valid => {
        if (valid) {
          that.buttonLoad = true
          request({
            url: '/data_source/connection_test',
            method: 'get',
            params: {
              projectGroupId: that.formSJY.projectGroupId,
              dbType: that.formSJY.dbType,
              sourceName: that.formSJY.sourceName,
              dbName: that.formSJY.dbName,
              ip: that.formSJY.dbIp,
              port: parseInt(that.formSJY.dbPort),
              userName: that.formSJY.dbUser,
              password: that.formSJY.dbPassword
            }
          }).then(res => {
            if (res.code == 200) {
              Notify('success', res.message || '连接成功')
              that
                .$confirm('连接成功,是否保存数据源？', '提示', {
                  confirmButtonText: '保存',
                  cancelButtonText: '取消',
                  type: 'success'
                })
                .then(() => {
                  if (that.addOrModifySJY) {
                    that.addSJY(true)
                  } else {
                    that.modifySJY(true)
                  }
                })
                .catch(() => {})
            }
            if (res.code == 500) {
              that
                .$confirm('连接失败,是否暂存数据源？', '提示', {
                  confirmButtonText: '暂存',
                  cancelButtonText: '取消',
                  type: 'error'
                })
                .then(() => {
                  if (that.addOrModifySJY) {
                    that.addSJY(false)
                  } else {
                    that.modifySJY(false)
                  }
                })
                .catch(() => {})
            }
          })
          setTimeout(() => {
            that.buttonLoad = false
          }, 300)
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    // add数据源
    addSJY(status) {
      let that = this
      that.$refs['formSJY'].validate(valid => {
        if (valid) {
          let params = that.formSJY
          // params.id = ''
          params.dbPort = parseInt(that.formSJY.dbPort)
          params.status = status
          that.buttonLoad = true
          request({ url: '/data_source/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowSJY = false), that.getSJYData())
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
    // 查看单个数据源信息
    seeSJY(row) {
      let that = this

      // that.addOrModifySJY = false
      // that.formShowSJY = true
      // that.buttonLoad = false
      // that.titleSJY = '修改数据源信息    [' + row.sourceName + ']'
      // resetForm('formSJY', that)
      // that.$nextTick(() => {
      //   that.formSJY = { ...row }
      // })
      request({ url: '/data_source/get_all_data_source_by_id', method: 'get', params: { id: row.id } }).then(res => {
        if (res.code == 200) {
          that.addOrModifySJY = false
          that.formShowSJY = true
          that.buttonLoad = false
          that.titleSJY = '修改数据源信息    [' + row.sourceName + ']'
          resetForm('formSJY', that)
          that.$nextTick(() => {
            that.formSJY = { ...res.data }
          })
        }
      })
    },
    // 修改数据源信息
    modifySJY(status) {
      let that = this
      that.$refs['formSJY'].validate(valid => {
        if (valid) {
          that.buttonLoad = true
          setTimeout(() => {
            that.buttonLoad = false
          }, 300)
          let params = that.formSJY
          params.status = status
          that.buttonLoad = true
          request({ url: '/data_source/update', method: 'post', data: params }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowSJY = false), that.getSJYData())
            setTimeout(() => {
              that.buttonLoad = false
            }, 300)
          })
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    cancelSJY(row) {
      let that = this
      that
        .$confirm('是否删除[' + row.sourceName + ']数据源信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let params = {
            id: row.id
          }
          request({ url: '/data_source/delete', method: 'post', data: params }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), that.getSJYData())
          })
        })
        .catch(() => {})
    },
    // 展示表
    showTable(row) {
      let that = this
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: row.id } }).then(res => {
        if (res.code == 200) {
          that.tempRow = row
          that.titleTable = row.dbName
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
        request({ url: '/data_source/columns', method: 'get', params: { id: that.tempRow.id, table: that.activeTable } }).then(res => {
          that.columnsData = res.data || []
          that.loadingColumns = false
          setTimeout(() => {
            that.$refs.tableColumns.doLayout()
          }, 300)
        })
      }
    },
    // 引用详情
    seeReference(row) {
      let that = this
      that.titleReference = '引用详情[' + row.sourceName + ']'
      that.dialogShowReference = true
      that.loadingReference = true
      request({ url: '/data_source/get_reference_details', method: 'get', params: { id: row.id } }).then(res => {
        that.referenceData = res.data
        that.loadingReference = false
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
