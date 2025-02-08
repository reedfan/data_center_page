<template>
  <div style="width: 100%; height: 100vh; overflow: hidden auto; background: rgb(229, 231, 236)">
    <div style="width: 98%; height: 120px; margin: 20px auto 0 auto; background: #ffffff">
      <div style="width: 140px; height: 80px; float: left; margin-top: 20px; margin-left: 20px; border-radius: 5px" class="IconHive"></div>
      <div style="width: auto; height: 80px; float: left; margin-top: 20px; margin-left: 20px">
        <p style="width: auto; height: 40px; line-height: 40px; font-size: 26px">{{ tableDetail.hiveTableBasicInfoDto.tableName }}</p>

        <div style="width: auto; height: 40px; overflow: hidden">
          <p style="width: auto; height: 40px; line-height: 40px; font-size: 16px; color: #666666; float: left">创建人：{{ tableDetail.hiveTableBasicInfoDto.createBy }} <span style="margin-left: 10px"></span>技术负责人：{{ tableDetail.hiveTableBasicInfoDto.technicalOwner }} <span style="margin-left: 10px"></span>业务负责人：{{ tableDetail.hiveTableBasicInfoDto.businessOwner }}</p>
          <p style="float: left; margin-left: 20px; height: 40px; line-height: 40px; color: #1e69ff; cursor: pointer" @click="showTableDDL">查看DDL</p>
          <p style="float: left; margin-left: 20px; height: 40px; line-height: 40px; color: #1e69ff; cursor: pointer" @click="showTableSelect">查看select语句</p>
        </div>
      </div>
    </div>
    <div style="width: 98%; height: calc(100% - 160px); position: relative; overflow: hidden; margin: 5px auto 0 auto" v-loading="tableDetailLoading">
      <el-tabs type="border-card" style="height: 100%" v-model="tabValue">
        <el-tab-pane label="描述信息" style="height: 100%" name="描述信息">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="1.基本信息" name="1">
              <div style="width: 100%; height: auto; margin: 0 auto" v-loading="tableDetailLoading">
                <el-descriptions title="" border style="margin-top: 0px" :column="2" :labelStyle="{ width: '150px' }">
                  <el-descriptions-item label="表名" :span="2">{{ tableDetail.hiveTableBasicInfoDto.tableName }}</el-descriptions-item>
                  <el-descriptions-item label="数据源">{{ tableDetail.hiveTableBasicInfoDto.dataSourceName }}</el-descriptions-item>
                  <el-descriptions-item label="库名">{{ tableDetail.hiveTableBasicInfoDto.dbName }}</el-descriptions-item>
                  <el-descriptions-item label="分层">{{ tableDetail.hiveTableBasicInfoDto.layerName }}</el-descriptions-item>
                  <el-descriptions-item label="主题">{{ tableDetail.hiveTableBasicInfoDto.topicName }}</el-descriptions-item>
                  <el-descriptions-item label="创建人">{{ tableDetail.hiveTableBasicInfoDto.createBy }}</el-descriptions-item>
                  <el-descriptions-item label="创建时间">{{ tableDetail.hiveTableBasicInfoDto.createTime }}</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-collapse-item>
            <el-collapse-item title="2.元数据信息" name="2">
              <div style="width: 100%; height: auto; margin: 0 auto" v-loading="tableDetailLoading">
                <el-descriptions title="" border style="margin-top: 0px" :column="2" :labelStyle="{ width: '150px' }">
                  <el-descriptions-item label="路径" :span="2">{{ tableDetail.hiveMetaDataInfoDto.location }}</el-descriptions-item>
                  <el-descriptions-item label="物理存储量">{{ (tableDetail.hiveMetaDataInfoDto.directorySize / 1024).toFixed(2) }}Kb</el-descriptions-item>
                  <el-descriptions-item label=" 文件数">{{ tableDetail.hiveMetaDataInfoDto.directoryFileNum }}</el-descriptions-item>
                  <el-descriptions-item label="位置">{{ tableDetail.hiveMetaDataInfoDto.defaultFS }}</el-descriptions-item>
                  <el-descriptions-item label="分隔符">{{ tableDetail.hiveMetaDataInfoDto.fieldDelim }}</el-descriptions-item>
                  <el-descriptions-item label="inputFormat">{{ tableDetail.hiveMetaDataInfoDto.inputFormat }}</el-descriptions-item>
                  <el-descriptions-item label="outputFormat">{{ tableDetail.hiveMetaDataInfoDto.outputFormat }}</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-collapse-item>
            <el-collapse-item title="3.表字段信息" name="3">
              <div style="width: 98%; height: auto; margin: 0 auto" v-loading="tableDetailLoading">
                <p style="width: 100%; height: 30px; line-height: 30px; font-size: 14px; text-align: left; color: #007aff">非分区字段</p>
                <el-table class="data-table" ref="table" :data="tableDetail.columnInfoDto.columnEntityList" border stripe :max-height="300">
                  <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
                  <el-table-column prop="columnName" label="字段名称" min-width="200" align="center"> </el-table-column>
                  <el-table-column prop="columnType" label="字段类型" min-width="120" align="center"> </el-table-column>
                  <el-table-column prop="columnComment" label="描述" min-width="300" align="center"> </el-table-column>
                </el-table>
                <p style="width: 100%; height: 30px; line-height: 30px; font-size: 14px; text-align: left; color: #007aff; margin-top: 10px">分区字段</p>
                <el-table class="data-table" ref="table" :data="tableDetail.columnInfoDto.partitionInfoList" border stripe :max-height="300">
                  <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
                  <el-table-column prop="columnName" label="字段名称" min-width="200" align="center"> </el-table-column>
                  <el-table-column prop="columnType" label="字段类型" min-width="120" align="center"> </el-table-column>
                  <el-table-column prop="columnComment" label="描述" min-width="300" align="center"> </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane label="数据预览" name="数据预览">
          <el-table class="data-table" ref="table" :data="exampleTable" border stripe>
            <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
            <template v-if="exampleTable[0]">
              <el-table-column :prop="item" :label="item" min-width="100" align="center" v-for="(item, index) in Object.keys(exampleTable[0])" :key="index"> </el-table-column>
            </template>
            <template v-else>
              <el-table-column prop="" label="-" min-width="100" align="center"> </el-table-column>
            </template>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="表血缘" style="height: 100%" lazy name="表血缘">
          <graphBloodTable v-if="tabValue == '表血缘'" :tableName="tableDetail.hiveTableBasicInfoDto.dbName + '.' + tableDetail.hiveTableBasicInfoDto.tableName"></graphBloodTable>
        </el-tab-pane>
        <el-tab-pane label="字段血缘" style="height: 100%" lazy name="字段血缘">
          <graphBloodField v-if="tabValue == '字段血缘'" :tableName="tableDetail.hiveTableBasicInfoDto.dbName + '.' + tableDetail.hiveTableBasicInfoDto.tableName"></graphBloodField>
        </el-tab-pane>
        <el-tab-pane label="脱敏规则" name="脱敏规则">
          <el-table class="data-table" ref="table" :data="desensitizationData" border stripe>
            <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
            <el-table-column prop="fieldName" label="字段名称" min-width="100" align="center"> </el-table-column>
            <el-table-column prop="desensitizationType" label="脱敏规则" min-width="100" align="center"> </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="DDL" :visible.sync="dialogShowTableDDL" width="800px">
      <div id="code-editor-ddl" ref="code-editor-ddl" v-loading="ddlLoading" style="height: 600px; width: 100%; margin-top: 10px; border: 1px solid #dcdfe6; box-sizing: border-box"></div>
      <div style="width: 100%; height: 20px"></div>
    </el-dialog>
    <el-dialog title="select语句" :visible.sync="dialogShowTableSelect" width="800px">
      <div id="code-editor-select" ref="code-editor-select" v-loading="selectLoading" style="height: 300px; width: 100%; margin-top: 10px; border: 1px solid #dcdfe6; box-sizing: border-box"></div>
      <div style="width: 100%; height: 20px"></div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/request'
import * as monaco from 'monaco-editor'
import { language } from 'monaco-editor/esm/vs/basic-languages/sql/sql'
import graphBloodTable from './components/graphBloodTable.vue'
import graphBloodField from './components/graphBloodField.vue'
const { keywords } = language
export default {
  name: 'tableDetail',
  components: {
    graphBloodTable,
    graphBloodField
  },
  data() {
    return {
      activeNames: ['1', '2', '3'],
      tabValue: '描述信息',
      tableDetail: {
        hiveTableBasicInfoDto: {
          tableName: '-',
          createBy: '-',
          technicalOwner: '-',
          businessOwner: '-'
        },
        hiveMetaDataInfoDto: {},
        columnInfoDto: {
          columnEntityList: []
        }
      },
      tableDetailLoading: true,
      exampleTable: [],
      exampleTableLoading: true,
      dialogShowTableDDL: false,
      ddlLoading: true,
      dialogShowTableSelect: false,
      selectLoading: true,

      monacoEditorDDL: null,
      monacoEditorSelect: null,

      desensitizationData: []
    }
  },
  mounted() {
    this.$store.state.userInfo = { id: this.$route.query.userInfoId }
    console.log(this.$store.state)
    console.log(this.$route.query.id)
    this.getTableDetail()
    this.getExampleTable()
    this.getDesensitizationRecord()
  },
  methods: {
    getTableDetail() {
      let that = this
      that.tableDetailLoading = true
      request({ url: '/table/get', method: 'get', params: { tableId: that.$route.query.id } }).then(res => {
        that.tableDetail = res.data
        that.tableDetailLoading = false
      })
    },
    // 根据表获取脱敏规则
    getDesensitizationRecord() {
      let that = this
      request({ url: '/desensitization_record_info/get_by_param', method: 'get', params: { dataSourceInfoId: that.$route.query.dataSourceId, tableName: that.$route.query.tableName } }).then(res => {
        that.desensitizationData = res.data || []
      })
    },
    getExampleTable() {
      let that = this
      that.exampleTableLoading = true
      request({ url: '/table/get/data_example_str', method: 'get', params: { tableId: that.$route.query.id } }).then(res => {
        that.exampleTable = res.data
        that.exampleTableLoading = false
      })
    },
    showTableDDL() {
      let that = this
      that.dialogShowTableDDL = true
      that.ddlLoading = true

      if (that.monacoEditorDDL) {
        that.monacoEditorDDL.dispose()
      }
      that.$nextTick(() => {
        that.monacoEditorDDL = monaco.editor.create(document.getElementById('code-editor-ddl'), {
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
        request({ url: '/table/get/ddl_str', method: 'get', params: { tableId: that.$route.query.id } }).then(res => {
          that.monacoEditorDDL.setValue(res.data)
          that.ddlLoading = false
        })
      })
    },
    showTableSelect() {
      let that = this
      that.dialogShowTableSelect = true
      that.selectLoading = true
      if (that.monacoEditorSelect) {
        that.monacoEditorSelect.dispose()
      }
      that.$nextTick(() => {
        that.monacoEditorSelect = monaco.editor.create(document.getElementById('code-editor-select'), {
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
        request({ url: '/table/get/select_str', method: 'get', params: { tableId: that.$route.query.id } }).then(res => {
          that.monacoEditorSelect.setValue(res.data)
          that.selectLoading = false
        })
      })
    }
  }
}
</script>

<style>
</style>
