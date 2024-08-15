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
      <div class="searchFormUnit" style="width: 300px; float: right">
        <el-input v-model="queryForm.name" placeholder="请输入搜索文字"> <el-button slot="append" icon="el-icon-search" @click=";(queryForm.pageNum = 1), getSJYData()"></el-button> </el-input>
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
        <!-- <el-table-column prop="dbIp" label="IP" min-width="160" align="center"> </el-table-column>
        <el-table-column prop="dbPort" label="Port" min-width="120" align="center"> </el-table-column> -->
        <el-table-column prop="owner" label="负责人" min-width="130" align="center"> </el-table-column>
        <!-- <el-table-column prop="version" label="版本" min-width="100" align="center"> </el-table-column> -->
        <el-table-column prop="createTime" label="创建时间" min-width="180" align="center"> </el-table-column>
        <!-- <el-table-column prop="updateTime" label="修改时间" min-width="180" align="center"> </el-table-column> -->
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="seeSJY(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelSJY(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getSJYData"> </pagination>
    </div>
    <el-dialog :title="titleSJY" :visible.sync="formShowSJY" width="530px">
      <el-form :model="formSJY" ref="formSJY" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 30px 0 10px">
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
                <el-select v-model="formSJY.dbType" filterable placeholder="" :disabled="!addOrModifySJY">
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
                <el-input v-model.trim="formSJY.dbName" autocomplete="off" :disabled="!addOrModifySJY"> </el-input>
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
            <el-col :span="24" v-show="addOrModifySJY">
              <el-form-item label="用户名：" prop="dbUser">
                <el-input v-model.trim="formSJY.dbUser" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-show="addOrModifySJY">
              <el-form-item label="密码：" prop="dbPassword">
                <el-input v-model.trim="formSJY.dbPassword" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShowSJY = false" style="width: 120px">取消</el-button>
        <el-button type="primary" style="width: 120px" v-if="!connectSuccessSJY" @click="connectTest()" :disabled="buttonLoad" :loading="buttonLoad">测试连接</el-button>
        <el-button type="primary" style="width: 120px" v-if="addOrModifySJY && connectSuccessSJY" @click="addSJY()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
        <el-button type="primary" style="width: 120px" v-if="!addOrModifySJY && connectSuccessSJY" @click="modifySJY()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
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
        name: '',
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
      connectSuccessSJY: false,

      tempRow: '',
      titleTable: '',
      dialogShowTable: false,
      tableList: [],
      activeTable: '',
      loadingTable: false,
      loadingColumns: false,
      columnsData: [],

      projectGroupList: []
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
      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.queryForm.type, page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
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
      that.connectSuccessSJY = false
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
            res.code == 200 && (Notify('success', res.message || '连接成功'), (that.connectSuccessSJY = true))
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
    addSJY() {
      let that = this
      that.$refs['formSJY'].validate(valid => {
        if (valid) {
          let params = that.formSJY
          // params.id = ''
          params.dbPort = parseInt(that.formSJY.dbPort)
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
      that.connectSuccessSJY = true
      request({ url: '/data_source/get_data_source_by_id', method: 'get', params: { id: row.id } }).then(res => {
        if (res.code == 200) {
          that.addOrModifySJY = false
          that.formShowSJY = true
          that.buttonLoad = false
          that.titleSJY = '修改数据源信息    [' + row.sourceName + ']'
          resetForm('formSJY', that)
          that.$nextTick(() => {
            that.formSJY = res.data
          })
        }
      })
    },
    // 修改数据源信息
    modifySJY() {
      let that = this
      that.$refs['formSJY'].validate(valid => {
        if (valid) {
          that.buttonLoad = true
          setTimeout(() => {
            that.buttonLoad = false
          }, 300)
          let params = that.formSJY
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
      this.$confirm('是否删除[' + row.sourceName + ']数据源信息?', '提示', {
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

    // 复制到剪切板
    copyText(text) {
      copyText(text)
    }
  }
}
</script>

<style scoped>
</style>
