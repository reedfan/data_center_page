<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain dataSource">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <p class="searchLabel" style="width: auto">数据源类型:</p>
        <div style="width: 13%; height: 42px; float: left; margin: 0 1%">
          <el-select v-model="queryForm.type" filterable placeholder="请选择" @change=";(queryForm.pageNum = 1), getSJYData()">
            <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-search" @click=";(queryForm.pageNum = 1), getSJYData()">查询</el-button>
        </div>
      </div>
    </div>
    <div class="main-unit" style="width: calc(100% - 48px); height: calc(100% - 95px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
      <el-table v-loading="loadingSJY" element-loading-text="数据加载中" class="data-table" ref="table" :data="SJYData" stripe :height="this.$store.state.globalHeight - 285">
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
        <el-table-column prop="dbName" label="库名称" min-width="250" align="left">
          <template slot-scope="scope">
            <div style="width: 100%; height: 100%; display: flex; align-items: center">
              <p style="max-width: 210px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin: 0" :title="scope.row.dbName">{{ scope.row.dbName }}</p>
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
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="showTable(scope.row)">脱敏设置</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getSJYData"> </pagination>
    </div>

    <el-dialog :title="titleTable" :visible.sync="dialogShowTable" width="1400px">
      <div style="width: 100%; height: 500px; background: #e6eaef; overflow: hidden">
        <div style="width: 240px; height: 100%; background: #ffffff; float: left; overflow-x: hidden; overflow-y: auto" v-loading="loadingTable">
          <div class="leftChooseIn">
            <div class="chooseUnit" v-for="(item, index) in tableList" :key="index" :class="activeTable == item ? 'active' : 'notActive'">
              <i :class="activeTable == item ? 'el-icon-right active' : 'notActive'"></i>
              <p :title="item" @click=";(activeTable = item), getDesensitizationRecord()">{{ item }}</p>
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
            <el-table-column prop="sourceName" label="脱敏规则" min-width="150" align="left">
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="14">
                    <el-select v-model="scope.row.desensitizationType" filterable placeholder="请选择">
                      <el-option v-for="(item, index) in desensitizationList" :label="item.desensitizationType" :value="item.desensitizationType" :key="index"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="9" :offset="1">
                    <p class="tableAction" @click="addDesensitizationRecord(scope.row)">绑 定</p>
                    <p class="tableActionDanger" @click="cancelDesensitizationRecord(scope.row)">解 绑</p>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
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
        type: '',
        pageSize: 10,
        page: 1,
        total: 0
      },
      SJYData: [],
      loadingSJY: true,

      tempRow: '',
      titleTable: '',
      dialogShowTable: false,
      tableList: [],
      activeTable: '',
      loadingTable: false,
      loadingColumns: false,
      columnsData: [],
      desensitizationData: [],

      desensitizationList: []
    }
  },
  mounted() {
    this.getDesensitizationList()
    this.getDataTypeList()

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
    getDataTypeList() {
      let that = this
      request({ url: '/data_source/type/list', method: 'get', params: {} }).then(res => {
        that.dataTypeList = res.data
        that.queryForm.type = res.data[0] || ''
        that.getSJYData()
      })
    },

    // 获取脱敏规则list
    getDesensitizationList() {
      let that = this
      request({ url: '/desensitization_info/list', method: 'get', params: {} }).then(res => {
        that.desensitizationList = res.data
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
            that.activeTable && that.getDesensitizationRecord()
          })
        }
      })
    },
    // 根据表获取脱敏规则
    getDesensitizationRecord() {
      let that = this
      request({ url: '/desensitization_record_info/get_by_param', method: 'get', params: { dataSourceInfoId: that.tempRow.id, tableName: that.activeTable } }).then(res => {
        that.desensitizationData = res.data || []
        that.getColumns()
      })
    },
    // 根据表获取表头
    getColumns() {
      let that = this
      that.loadingColumns = true
      if (that.activeTable) {
        request({ url: '/data_source/columns', method: 'get', params: { id: that.tempRow.id, table: that.activeTable } }).then(res => {
          that.columnsData = []
          if (res.data) {
            res.data.forEach(x1 => {
              x1.desensitizationType = ''
              x1.desensitizationId = ''
              that.desensitizationData.forEach(x2 => {
                if (x1.columnName == x2.fieldName) {
                  x1.desensitizationType = x2.desensitizationType
                  x1.desensitizationId = x2.id
                }
              })
              that.columnsData.push(x1)
            })
          }
          console.log(that.columnsData)
          that.loadingColumns = false
          setTimeout(() => {
            that.$refs.tableColumns.doLayout()
          }, 300)
        })
      }
    },

    // 为表字段增加脱敏规则
    addDesensitizationRecord(row) {
      let that = this
      request({ url: '/desensitization_record_info/add', method: 'post', data: { dataSourceId: that.tempRow.id, tableName: that.activeTable, fieldName: row.columnName, desensitizationType: row.desensitizationType } }).then(res => {
        res.code == 200 && (Notify('success', res.message || '处理成功'), that.getDesensitizationRecord())
      })
    },

    // 为表字段解除脱敏规则
    cancelDesensitizationRecord(row) {
      let that = this
      request({ url: '/desensitization_record_info/delete', method: 'post', data: { id: row.desensitizationId } }).then(res => {
        res.code == 200 && (Notify('success', res.message || '处理成功'), that.getDesensitizationRecord())
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
