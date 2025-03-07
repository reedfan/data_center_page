<template>
  <div class="manageMain table">
    <div class="buttonArea">
      <el-button type="primary" icon="el-icon-plus" @click="newTable()" size="mini">新建表</el-button>
    </div>
    <div class="searchArea">
      <div class="searchFormUnit">
        <p class="searchLabel">分层:</p>
        <div class="searchForm" style="width: 120px">
          <el-select v-model="queryForm.layerId" filterable placeholder="请选择" @change=";(queryForm.pageNum = 1), getTableData()">
            <el-option label="全部分层" :value="null"></el-option>
            <el-option v-for="(item, index) in levelList" v-bind:key="index" :label="item.layerName + '-' + item.layerFlag" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>

      <div class="searchFormUnit" style="width: 300px; float: right">
        <el-input v-model="queryForm.tableName" placeholder="请输入表名"> <el-button slot="append" icon="el-icon-search" @click=";(queryForm.pageNum = 1), getTableData()"></el-button> </el-input>
      </div>
    </div>
    <div class="searchArea">
      <el-tabs v-model="activeThemeId" @tab-click="handleTabClick" class="tableTopTabs">
        <el-tab-pane :key="index" v-for="(item, index) in treeTheme" :label="item.topicName" :name="item.id + ''">
          <span slot="label">{{ item.topicName }}<i v-if="item.id" :class="activeThemeId == item.id ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" style="margin-left: 8px; font-size: 14px"></i> </span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="searchArea" v-if="treeThemeChild.length > 0">
      <el-tabs v-model="activeThemeChildId" @tab-click="handleTabClickChild" class="tableChildTopTabs">
        <el-tab-pane :key="index" v-for="(item, index) in treeThemeChild" :label="item.topicName" :name="item.id + ''">
          <span slot="label">{{ item.topicName }}</span>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- <div style="width: 280px; height: 100%; float: left" class="main-unit">
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
      </div> -->
    <div class="tableArea">
      <el-table v-loading="loadingTable" element-loading-text="数据加载中" ref="table" :data="tableData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="tableName" label="表名称" min-width="280" align="center">
          <template slot-scope="scope">
            <p class="tableLink" :title="scope.row.tableName" @click="gotoTableDetail(scope.row)">{{ scope.row.tableName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="topicName" label="主题" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="layerName" label="分层" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="createBy" label="创建人" min-width="100" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" align="center"> </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" content="收藏" placement="top-start" v-if="!scope.row.collectFlag">
              <i class="el-icon-star-off" style="font-size: 14px; cursor: pointer" @click="collectTable(scope.row)"></i>
            </el-tooltip>
            <el-tooltip class="item" content="取消收藏" placement="top-start" v-if="scope.row.collectFlag">
              <i class="el-icon-star-on" style="font-size: 16px; cursor: pointer; color: #e6a23c" @click="unCollectTable(scope.row)"></i>
            </el-tooltip>
            <p class="tableAction" @click="showTableDetail(scope.row)">详情</p>
            <p class="tableAction" @click="seeTable(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelTable(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getTableData"> </pagination>
    </div>

    <el-dialog :title="titleTable" :visible.sync="dialogShowTable" width="1200px">
      <el-steps :active="stepTable" simple style="margin-top: 10px">
        <el-step title="表信息" icon="el-icon-edit-outline"></el-step>
        <el-step title="基础属性及字段" icon="el-icon-folder-checked"></el-step>
        <el-step title="完成" icon="el-icon-s-promotion"></el-step>
      </el-steps>
      <el-form :model="formTable" ref="formTable" v-loading="formTableLoading" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="margin-top: 20px" v-show="stepTable == 1">
        <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">表基础信息</p>
        <div style="width: 100%; height: auto; min-height: 150px; margin-top: 20px">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="类型：" prop="type" label-width="120px" :required="true">
                <el-select v-model="formTable.type" filterable placeholder="请选择类型" @change="getDataSourceList()" disabled>
                  <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据源：" :required="true" prop="dataSourceId" label-width="120px">
                <el-select v-model="formTable.dataSourceId" filterable placeholder="请选择数据源" @change="dataSourceChange(), generateSql()">
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
              <el-form-item label="主题归属：" :required="true" prop="topicId" label-width="120px">
                <el-cascader ref="topicCascader" @change="topicChange" v-model="formTable.topicId" :show-all-levels="false" :options="treeThemeForm" placeholder="请选择主题归属" :props="{ children: 'childList', value: 'id', label: 'topicName', checkStrictly: true, emitPath: false }"> </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <!-- <el-col :span="12">
              <el-form-item label="库名称：" :required="true" prop="dbName" label-width="120px">
                <el-input v-model.trim="formTable.dbName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="9" style="padding-right: 1px">
              <el-form-item label="表名称：" :required="true" prop="tableName2" label-width="120px">
                <el-input v-model.trim="formTable.tableName2" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" placeholder="仅支持数字、字母、_" @change="generateSql()">
                  <template slot="prepend">{{ formTable.tableName1 }}</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="padding-left: 1px">
              <el-form-item label="" :required="true" prop="tableName3" label-width="0px">
                <el-select v-model="formTable.tableName3" placeholder="" filterable @change="generateSql()">
                  <el-option label="df-每日全量" value="_df" />
                  <el-option label="di-每日增量" value="_di" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="表中文名称：" :required="true" prop="tableNameCN" label-width="120px">
                <el-input v-model.trim="formTable.tableNameCN" autocomplete="off" @change="generateSql()"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div style="width: 100%; height: auto; margin: 10px auto" v-show="stepTable == 2">
        <el-row>
          <el-radio-group v-model="sqlOrTabel" size="small">
            <el-radio-button label="table"> 表 格 </el-radio-button>
            <el-radio-button label="sql"> S Q L </el-radio-button>
          </el-radio-group>
        </el-row>
        <el-form v-show="sqlOrTabel == 'table'" :model="formConfig" ref="formConfig" label-width="15px" :rules="rules" :show-message="false" class="demo-ruleForm">
          <div style="width: 100%; height: auto; margin: 10px auto 0 auto; position: relative">
            <p style="width: 100%; height: 40px; line-height: 40px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">非分区字段</p>
            <div style="width: 100%; height: 30px; text-align: right; position: absolute; z-index: 2; top: 8px; right: 0">
              <el-button type="primary" @click="addColumn" size="mini">添加字段</el-button>
            </div>
            <div style="width: 100%; height: auto; min-height: 60px; margin-top: 10px">
              <el-table border :data="formConfig.tableColumnInfoList" class="data-table" ref="tableColumnInfoList" stripe :max-height="250">
                <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
                <el-table-column prop="columnName" label="字段名" min-width="100" align="left">
                  <template slot-scope="scope">
                    <el-form-item label=" " :required="true" :prop="'tableColumnInfoList.' + scope.$index + '.columnName'" style="margin-bottom: 0">
                      <el-input v-model="scope.row.columnName" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="columnType" label="数据类型" min-width="100" align="left">
                  <template slot-scope="scope">
                    <el-form-item label=" " :required="true" :prop="'tableColumnInfoList.' + scope.$index + '.columnType'" style="margin-bottom: 0">
                      <el-select v-model="scope.row.columnType" placeholder="数据类型" filterable>
                        <el-option v-for="(item, index) in tableTypeList" :key="index" :label="item" :value="item" />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="columnComment" label="注释" min-width="180" align="left">
                  <template slot-scope="scope">
                    <el-form-item label="" :prop="'tableColumnInfoList.' + scope.$index + '.columnComment'" style="margin-bottom: 0" label-width="0">
                      <el-input v-model.number="scope.row.columnComment" type="textarea" :autosize="{ minRows: 1, maxRows: 100 }" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <p class="tableActionDanger" :class="formConfig.tableColumnInfoList.length == '1' ? 'disabledTableActionDanger' : ''" @click="formConfig.tableColumnInfoList.length == '1' ? '' : deleteColumn(scope.$index)">删除</p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div style="width: 100%; height: auto; margin: 10px auto 0 auto; position: relative">
            <p style="width: 100%; height: 40px; line-height: 40px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">分区字段</p>
            <div v-if="formConfig.tablePartitionInfoList.length == 0" style="width: 100%; height: 30px; text-align: right; position: absolute; z-index: 2; top: 8px; right: 0">
              <el-button type="primary" :disabled="!addOrModifyTable" @click="addColumnPartition" size="mini">添加字段</el-button>
            </div>
            <div style="width: 100%; height: auto; min-height: 60px; margin-top: 10px">
              <el-table :data="formConfig.tablePartitionInfoList" class="data-table" ref="tablePartitionInfoList" stripe :max-height="250">
                <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
                <el-table-column prop="columnName" label="字段名" min-width="100" align="left">
                  <template slot-scope="scope">
                    <el-form-item label=" " :required="true" :prop="'tablePartitionInfoList.' + scope.$index + '.columnName'" style="margin-bottom: 0">
                      <el-input :disabled="!addOrModifyTable" v-model="scope.row.columnName" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="columnType" label="数据类型" min-width="100" align="left">
                  <template slot-scope="scope">
                    <el-form-item label=" " :required="true" :prop="'tablePartitionInfoList.' + scope.$index + '.columnType'" style="margin-bottom: 0">
                      <el-select :disabled="!addOrModifyTable" v-model="scope.row.columnType" placeholder="数据类型" filterable>
                        <el-option v-for="(item, index) in tableTypeList" :key="index" :label="item" :value="item" />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="columnComment" label="注释" min-width="180" align="left">
                  <template slot-scope="scope">
                    <el-form-item label="" :prop="'tablePartitionInfoList.' + scope.$index + '.columnComment'" style="margin-bottom: 0" label-width="0">
                      <el-input :disabled="!addOrModifyTable" v-model.number="scope.row.columnComment" type="textarea" :autosize="{ minRows: 1, maxRows: 100 }" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <p class="tableActionDanger" :class="!addOrModifyTable ? 'disabledTableActionDanger' : ''" @click="!addOrModifyTable ? '' : deleteColumnPartition(scope.$index)">删除</p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div style="width: 100%; height: auto; margin: 10px auto 0 auto; position: relative">
            <p style="width: 100%; height: 40px; line-height: 40px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">基础属性设置</p>
            <div style="width: 96%; height: auto; min-height: 60px; margin: 10px auto 0 auto">
              <el-row :gutter="24" style="overflow: hidden; height: 42px">
                <el-col :span="8">
                  <el-form-item label="生命周期：" prop="isForever" label-width="120px" :required="true">
                    <el-switch v-model="formConfig.isForever" active-color="#13ce66" inactive-color="#ff4949" active-text="永久" inactive-text="非永久"> </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="周期天数：" :required="!formConfig.isForever" prop="retentionDays" label-width="120px" v-show="!formConfig.isForever">
                    <el-input v-model.trim="formConfig.retentionDays" autocomplete="off" oninput="value=value.replace(/[^\d]/g,'')" placeholder=""> <template slot="append">天</template> </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="分割符：" prop="formatDelimited" label-width="120px" :required="true">
                    <el-input v-model.trim="formConfig.formatDelimited" autocomplete="off" placeholder=""> </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24" style="height: 42px; overflow: hidden">
                <el-col :span="8">
                  <el-form-item label="存储格式：" prop="storedAs" label-width="120px" :required="true">
                    <el-radio-group v-model="formConfig.storedAs" @change="formConfig.compressMethod = formConfig.storedAs == 'orc' ? 'SNAPPY' : null">
                      <el-radio label="textfile">TextFile</el-radio>
                      <el-radio label="orc">ORC</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="压缩方式：" prop="compressMethod" label-width="120px" :required="formConfig.storedAs == 'orc'" v-show="formConfig.storedAs == 'orc'">
                    <el-radio-group v-model="formConfig.compressMethod">
                      <el-radio label="SNAPPY">SNAPPY</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
        <el-row :gutter="24" v-show="sqlOrTabel == 'sql'">
          <el-col :span="24">
            <div id="code-editor" ref="code-editor" style="height: 400px; width: 100%; margin-top: 10px; border: 1px solid #dcdfe6; box-sizing: border-box"></div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer" v-show="!formTableLoading">
        <el-button @click="dialogShowTable = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button @click="stepTable -= 1" v-if="stepTable == 2" style="width: 100px" size="mini">上一步</el-button>
        <el-button type="primary" @click="nextStep()" v-if="stepTable == 1" style="width: 100px" size="mini">下一步</el-button>
        <el-button type="primary" v-if="addOrModifyTable && stepTable == 2" @click="addTable()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyTable && stepTable == 2" @click="modifyTable()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleTableDetail" :visible.sync="dialogShowTableDetail" width="1000px">
      <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
        <el-collapse accordion v-model="activeNameTableDetail">
          <el-collapse-item title="1.基本信息" name="1">
            <div style="width: 100%; height: auto; margin: 0 auto" v-loading="tableDetailLoading">
              <el-descriptions title="" border style="margin-top: 0px" :column="2">
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
              <el-descriptions title="" border style="margin-top: 0px" :column="2">
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

      treeTheme: [],
      treeThemeChild: [],
      activeThemeId: 'null',
      activeThemeChildId: null,
      treeThemeForm: [],

      queryForm: {
        layerId: null,
        topicId: null,
        topicParentId: null,
        tableName: null,
        pageSize: 20,
        page: 1,
        total: 0
      },
      tableData: [],
      loadingTable: true,

      dialogShowTable: false,
      titleTable: '',
      formTableLoading: false,
      stepTable: 1,
      addOrModifyTable: true,
      dataTypeList: [],
      dataSourceList: [],
      formTable: {
        id: '',
        type: '',
        dataSourceId: '',
        dbName: '',
        tableName1: '',
        tableName2: '',
        tableName3: '',
        tableNameCN: '',
        layerId: '',
        layerName: '',
        topicId: '',
        topicParentId: '',
        topicName: ''
      },
      sqlOrTabel: 'table',
      formConfig: {
        tableColumnInfoList: [{ columnName: '', columnType: '', columnComment: '' }],
        tablePartitionInfoList: [],
        storedAs: 'textfile',
        compressMethod: '',
        isForever: true,
        retentionDays: '',
        formatDelimited: ''
      },
      levelList: '',
      tempSql: '',

      dialogShowTableDetail: false,
      titleTableDetail: '',
      activeNameTableDetail: ['1'],
      tableDetail: {
        hiveTableBasicInfoDto: {},
        hiveMetaDataInfoDto: {},
        columnInfoDto: {
          columnEntityList: []
        }
      },
      tableDetailLoading: true,
      // tableTypeList: ['bigint', 'binary', 'bit', 'blob', 'blob data type', 'boolean', 'char', 'char byte', 'date', 'datetime', 'dec', 'decimal', 'double', 'double precision', 'enum', 'float', 'int', 'integer', 'longblob', 'longtext', 'mediumblob', 'mediumint', 'mediumtext', 'set data type', 'smallint', 'text', 'time', 'timestamp', 'tinyblob', 'tinyint', 'tinytext', 'varbinary', 'varchar', 'year data type'],
      tableTypeList: ['string', 'double', 'int'],
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
      request({ url: '/table/list', method: 'get', params: { tableName: that.queryForm.tableName || null, layerId: that.queryForm.layerId, topicId: that.queryForm.topicId, topicParentId: that.queryForm.topicParentId, page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.tableData = res.data.list || []
        that.queryForm.total = res.data.total
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
        that.levelList = res.data.list || []
      })
    },
    // 获取主题树数据
    getTreeTheme() {
      let that = this
      that.loadingTreeTheme = true
      request({ url: '/datawarehouseTopic/getTreeList', method: 'post', data: {} }).then(res => {
        that.treeTheme = [{ topicName: '全部主题', id: null, childList: [] }].concat(res.data || [])
        that.treeThemeForm = res.data || []
      })
    },
    // 主题树点击
    handleTabClick(tab, event) {
      let that = this
      if (that.activeThemeId != 'null') {
        let temp = that.treeTheme.filter(s => {
          return s.id == that.activeThemeId
        })[0]
        that.queryForm.topicParentId = temp.id
        that.queryForm.topicId = null
        that.activeThemeChildId = null
        that.treeThemeChild = temp.childList
      } else {
        that.treeThemeChild = []
        that.queryForm.topicParentId = null
        that.queryForm.topicId = null
        that.activeThemeChildId = null
      }
      that.queryForm.pageNum = 1
      that.getTableData()
    },
    // 主题树点击
    handleTabClickChild(tab, event) {
      let that = this
      let temp = that.treeThemeChild.filter(s => {
        return s.id == that.activeThemeChildId
      })[0]
      that.queryForm.topicId = temp.id
      that.queryForm.topicParentId = temp.parentId
      that.queryForm.pageNum = 1
      that.getTableData()
    },

    // 新建表
    newTable() {
      let that = this
      that.addOrModifyTable = true
      that.formTableLoading = false
      that.dialogShowTable = true
      that.dataSourceList = []
      that.buttonLoad = false
      that.titleTable = '新建表信息'
      that.stepTable = 1
      resetForm('formTable', that)
      that.formTable = {
        id: '',
        type: '',
        dataSourceId: '',
        dbName: '',
        tableName1: '',
        tableName2: '',
        tableName3: '',
        tableNameCN: '',
        layerId: '',
        layerName: '',
        topicId: '',
        topicParentId: '',
        topicName: ''
      }
      resetForm('formConfig', that)
      ;(that.formConfig = {
        tableColumnInfoList: [{ columnName: '', columnType: '', columnComment: '' }],
        tablePartitionInfoList: [],
        storedAs: 'textfile',
        compressMethod: '',
        isForever: true,
        retentionDays: '',
        formatDelimited: ''
      }),
        that.initEditor()
      that.formTable.type = 'Hive'
      that.getDataSourceList()
    },
    // 初始化编辑器
    initEditor() {
      let that = this
      if (that.monacoEditor) {
        that.monacoEditor.dispose()
      }

      that.$nextTick(() => {
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
    // 左侧数据源change
    dataSourceChange() {
      let that = this
      that.formTable.dbName = that.dataSourceList.filter(s => {
        return s.id == that.formTable.dataSourceId
      })[0].dbName
    },

    // 表分层change
    layerChange() {
      let that = this
      let temp = that.levelList.filter(s => {
        return s.id == that.formTable.layerId
      })
      that.formTable.layerName = temp[0].layerFlag
      that.generateTableName()
    },
    // 主题归属change
    topicChange(val) {
      let that = this
      console.log(val)
      that.formTable.topicId = val
      that.formTable.topicName = that.$refs['topicCascader'].getCheckedNodes()[0].data.topicName
      that.formTable.topicParentId = that.$refs['topicCascader'].getCheckedNodes()[0].data.parentId
      that.generateTableName(that.$refs['topicCascader'].getCheckedNodes()[0].data.topicNameEn)
    },
    // 生成表名
    generateTableName(topicNameEn) {
      let that = this
      if (that.formTable.layerName && that.formTable.topicId) {
        that.formTable.tableName1 = that.formTable.layerName + '_' + topicNameEn + '_'
      }
    },
    // 生成默认SQL
    generateSql() {
      let that = this
      if (that.formTable.dbName && that.formTable.tableName2 && that.formTable.tableName3 && that.formTable.tableNameCN) {
        that.tempSql = 'CREATE TABLE `' + that.formTable.dbName + '`.`' + that.formTable.tableName1 + that.formTable.tableName2 + that.formTable.tableName3 + "`(\n \n) \nCOMMENT '" + that.formTable.tableNameCN + "' \nPARTITIONED BY(\n \n) \nROW FORMAT DELIMITED FIELDS TERMINATED BY ',' \nSTORED AS TEXTFILE \nTBLPROPERTIES (\n'table.creator'='" + that.$store.state.userInfo.account + "'\n)"
      }
    },
    // 下一步
    nextStep() {
      let that = this
      if (that.stepTable == 1) {
        that.$refs['formTable'].validate(valid => {
          if (valid) {
            let reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
            if (reg.test(that.formTable.tableName2)) {
              that.stepTable += 1
              that.monacoEditor.setValue(that.tempSql)
            } else {
              Notify('warning', '请输入符合规范的表名称！')
            }
          } else {
            Notify('error', '请将红色标注部分填写完整')
          }
        })
      }
    },
    // 增加列
    addColumn() {
      let that = this
      that.formConfig.tableColumnInfoList.push({ columnName: '', columnType: '', columnComment: '' })
      that.$nextTick(() => {
        that.$refs.tableColumnInfoList.bodyWrapper.scrollTop = that.$refs.tableColumnInfoList.bodyWrapper.scrollHeight
      })
    },
    // 删除列
    deleteColumn(index) {
      let that = this
      console.log(that.formConfig.tableColumnInfoList)
      that.formConfig.tableColumnInfoList.splice(index, 1)
    },
    // 增加列
    addColumnPartition() {
      let that = this
      that.formConfig.tablePartitionInfoList.push({ columnName: '', columnType: '', columnComment: '' })
    },
    // 删除列
    deleteColumnPartition(index) {
      let that = this
      that.formConfig.tablePartitionInfoList.splice(index, 1)
    },
    // 添加表
    addTable() {
      let that = this
      // that.formTable.sql = that.monacoEditor.getValue().replace(/\n/g, '')
      // that.formTable.sql = that.monacoEditor.getValue()
      if (that.sqlOrTabel == 'sql') {
        if (!that.monacoEditor.getValue()) {
          return Notify('error', '请填写SQL语句！')
        }
        let params = { ...that.formTable }
        params.id = null
        params.tableName = that.formTable.tableName1 + that.formTable.tableName2 + that.formTable.tableName3
        params.sql = that.monacoEditor.getValue()
        that.buttonLoad = true
        request({ url: '/table/new', method: 'post', data: params })
          .then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), (that.dialogShowTable = false), that.getTableData())
            setTimeout(() => {
              that.buttonLoad = false
            }, 300)
          })
          .catch(() => {
            setTimeout(() => {
              that.buttonLoad = false
            }, 300)
          })
      }
      if (that.sqlOrTabel == 'table') {
        that.$refs['formConfig'].validate(valid => {
          if (valid) {
            let notValidColumnName = []
            let reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
            that.formConfig.tableColumnInfoList.forEach(x => {
              if (!reg.test(x.columnName)) {
                notValidColumnName.push(x.columnName)
              }
            })
            that.formConfig.tablePartitionInfoList.forEach(x => {
              if (!reg.test(x.columnName)) {
                notValidColumnName.push(x.columnName)
              }
            })
            if (notValidColumnName.length > 0) {
              return Notify('warning', '请输入符合规范的表字段名称！[' + notValidColumnName.join(',') + ']')
            }
            let params = { ...that.formTable }
            params.id = null
            params.tableName = that.formTable.tableName1 + that.formTable.tableName2 + that.formTable.tableName3
            !that.formConfig.isForever && (params.retentionDays = that.formConfig.retentionDays)
            params.tableColumnInfoList = that.formConfig.tableColumnInfoList
            params.tablePartitionInfoList = that.formConfig.tablePartitionInfoList
            params.formatDelimited = that.formConfig.formatDelimited
            params.storedAs = that.formConfig.storedAs
            that.formConfig.storedAs == 'orc' && (params.compressMethod = that.formConfig.compressMethod)
            that.buttonLoad = true
            request({ url: '/table/new', method: 'post', data: params })
              .then(res => {
                res.code == 200 && (Notify('success', res.message || '处理成功'), (that.dialogShowTable = false), that.getTableData())
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
      }
    },
    seeTable(row) {
      let that = this
      that.formTableLoading = true
      that.addOrModifyTable = false
      that.dialogShowTable = true
      that.tempSql = ''
      that.buttonLoad = false
      that.titleTable = '修改表[' + row.tableName + ']'
      that.stepTable = 1
      resetForm('formTable', that)

      resetForm('formConfig', that)
      ;(that.formConfig = {
        tableColumnInfoList: [{ columnName: '', columnType: '', columnComment: '' }],
        tablePartitionInfoList: [],
        storedAs: 'textfile',
        compressMethod: '',
        isForever: true,
        retentionDays: '',
        formatDelimited: ''
      }),
        that.initEditor()
      that.formTable.type = 'Hive'
      that.getDataSourceList()
      request({ url: '/table/get', method: 'get', params: { tableId: row.id } }).then(res => {
        that.formTableLoading = false
        that.formTable = { type: 'Hive', tableName1: '', tableName2: '', tableName3: '', tableNameCN: row.tableNameCn, dataSourceId: row.dataSourceId, ...res.data.hiveTableBasicInfoDto }
        that.generateTableName()
        that.formTable.tableName3 = ''
        if (that.formTable.tableName.substring(that.formTable.tableName.length - 3, that.formTable.tableName.length) == '_df' || that.formTable.tableName.substring(that.formTable.tableName.length - 3, that.formTable.tableName.length) == '_di') {
          that.formTable.tableName3 = that.formTable.tableName.substring(that.formTable.tableName.length - 3, that.formTable.tableName.length)
        }
        that.formTable.tableName2 = that.formTable.tableName.substring(that.formTable.tableName1.length, that.formTable.tableName.length - that.formTable.tableName3.length)
        that.formConfig.tableColumnInfoList = JSON.parse(JSON.stringify(res.data.columnInfoDto.columnEntityList))
        that.formConfig.tablePartitionInfoList = res.data.columnInfoDto.partitionInfoList ? JSON.parse(JSON.stringify(res.data.columnInfoDto.partitionInfoList)) : []
        that.formConfig.formatDelimited = res.data.hiveMetaDataInfoDto.fieldDelim
      })
    },
    // 修改表
    modifyTable() {
      let that = this
      // that.formTable.sql = that.monacoEditor.getValue().replace(/\n/g, '')
      // that.formTable.sql = that.monacoEditor.getValue()
      if (that.sqlOrTabel == 'sql') {
        if (!that.monacoEditor.getValue()) {
          return Notify('error', '请填写SQL语句！')
        }
        let params = { ...that.formTable }
        params.tableName = that.formTable.tableName1 + that.formTable.tableName2 + that.formTable.tableName3
        params.sql = that.monacoEditor.getValue()
        that.buttonLoad = true
        request({ url: '/table/update', method: 'post', data: params })
          .then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), (that.dialogShowTable = false), that.getTableData())
            setTimeout(() => {
              that.buttonLoad = false
            }, 300)
          })
          .catch(() => {
            setTimeout(() => {
              that.buttonLoad = false
            }, 300)
          })
      }
      if (that.sqlOrTabel == 'table') {
        that.$refs['formConfig'].validate(valid => {
          if (valid) {
            let notValidColumnName = []
            let reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
            that.formConfig.tableColumnInfoList.forEach(x => {
              if (!reg.test(x.columnName)) {
                notValidColumnName.push(x.columnName)
              }
            })
            that.formConfig.tablePartitionInfoList.forEach(x => {
              if (!reg.test(x.columnName)) {
                notValidColumnName.push(x.columnName)
              }
            })
            if (notValidColumnName.length > 0) {
              return Notify('warning', '请输入符合规范的表字段名称！[' + notValidColumnName.join(',') + ']')
            }
            let params = { ...that.formTable }
            params.tableName = that.formTable.tableName1 + that.formTable.tableName2 + that.formTable.tableName3
            !that.formConfig.isForever && (params.retentionDays = that.formConfig.retentionDays)
            params.tableColumnInfoList = that.formConfig.tableColumnInfoList
            params.tablePartitionInfoList = that.formConfig.tablePartitionInfoList
            params.formatDelimited = that.formConfig.formatDelimited
            params.storedAs = that.formConfig.storedAs
            that.formConfig.storedAs == 'orc' && (params.compressMethod = that.formConfig.compressMethod)
            that.buttonLoad = true
            request({ url: '/table/update', method: 'post', data: params })
              .then(res => {
                res.code == 200 && (Notify('success', res.message || '处理成功'), (that.dialogShowTable = false), that.getTableData())
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
      }
    },
    // 删除表
    cancelTable(row) {
      let that = this
      that
        .$confirm('是否确定删除[' + row.tableName + ']数据表?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/table/delete', method: 'post', data: { id: row.id } }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getTableData()
          })
        })
        .catch(() => {})
    },
    // 收藏表
    collectTable(row) {
      let that = this
      request({ url: '/table/add_collect_table', method: 'get', params: { tableName: row.tableName } }).then(res => {
        res.code == 200 && Notify('success', res.message || '处理成功')
        that.getTableData()
      })
    },
    // 取消收藏表
    unCollectTable(row) {
      let that = this
      request({ url: '/table/cancel_collect_table', method: 'get', params: { tableName: row.tableName } }).then(res => {
        res.code == 200 && Notify('success', res.message || '处理成功')
        that.getTableData()
      })
    },
    // 表详情
    showTableDetail(row) {
      let that = this
      that.dialogShowTableDetail = true
      that.titleTableDetail = row.tableName
      that.tableDetailLoading = true
      request({ url: '/table/get', method: 'get', params: { dataSourceId: row.dataSourceId, tableName: row.tableName } }).then(res => {
        that.tableDetail = res.data
        that.tableDetailLoading = false
      })
    },
    // 跳转表详情
    gotoTableDetail(row) {
      window.open(window.location.href.substring(0, window.location.href.length - this.$route.path.length) + '/tableDetail?type=Hive' + '&dataSourceId=' + row.dataSourceId + '&tableName=' + row.tableName + '&userInfoId=' + this.$store.state.userInfo.id)
    }
  }
}
</script>

<style scoped>
</style>
