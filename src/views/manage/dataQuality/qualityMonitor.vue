<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain tableExploration">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <p class="searchLabel" style="width: auto">监控名称:</p>
        <div style="width: 13%; height: 42px; float: left; margin: 0 1%">
          <el-input v-model.trim="queryForm.monitorName" autocomplete="off" placeholder="请输入监控名称"></el-input>
        </div>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-search" @click="getTaskData()">查询</el-button>
        </div>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-plus" @click="newTask()">新建监控</el-button>
        </div>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-document" @click="$router.push('/dataQuality/runRecord')">运行日志</el-button>
        </div>
      </div>
    </div>
    <div class="main-unit" style="width: calc(100% - 48px); height: calc(100% - 95px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
      <el-table v-loading="loadingTask" element-loading-text="数据加载中" class="data-table" ref="table" :data="TaskData" stripe :height="this.$store.state.globalHeight - 285">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="monitorName" label="监控名称" min-width="180" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="tcdx" label="监控对象" min-width="120" align="left" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.dbType + '.' + scope.row.dbName + '.' + scope.row.tableName }}</template>
        </el-table-column>
        <el-table-column prop="createdBy" label="监控负责人" min-width="60" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="100" align="center"> </el-table-column>
        <el-table-column label="操作" align="center" width="380" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="showCaseList(scope.row)">实例列表</p>
            <p class="tableAction" @click="runTask(scope.row)">运行</p>
            <p class="tableAction" @click="seeTask(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelTask(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getTaskData"> </pagination>
    </div>
    <el-dialog :title="titleTask" :visible.sync="dialogShowTask" width="1200px">
      <el-steps :active="stepTask" simple style="margin-top: 10px">
        <el-step title="设置监控对象" icon="el-icon-edit-outline"></el-step>
        <el-step title="设置规则" icon="el-icon-folder-checked"></el-step>
        <el-step title="完成" icon="el-icon-s-promotion"></el-step>
      </el-steps>
      <el-form :model="formTask" ref="formTask" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" v-show="stepTask == 1">
        <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
          <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">监控对象</p>
          <div style="width: 100%; height: auto; min-height: 150px; margin-top: 20px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="数据源：" :required="true" prop="dbType">
                  <el-select v-model="formTask.dbType" filterable placeholder="请选择类型" @change="dbTypeChange()">
                    <el-option v-for="(item, index) in dbTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" :required="true" prop="dataSourceId" label-width="0">
                  <el-select v-model="formTask.dataSourceId" filterable placeholder="请选择数据源" @change="dataSourceChange()">
                    <el-option v-for="(item, index) in dataSourceList" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="库表选择：" :required="true" prop="dbName">
                  <el-select v-model="formTask.dbName" filterable placeholder="请选择库">
                    <el-option v-for="(item, index) in dbNameList" v-bind:key="index" :label="item.dbName" :value="item.dbName"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" :required="true" prop="tableName" label-width="0">
                  <el-select v-model="formTask.tableName" filterable placeholder="请选择表" @change="tableNameChange()">
                    <el-option v-for="(item, index) in tableNameList" v-bind:key="index" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
          <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">基础信息</p>
          <div style="width: 100%; height: auto; min-height: 150px; margin-top: 20px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="监控名称：" :required="true" prop="monitorName">
                  <el-input v-model.trim="formTask.monitorName" autocomplete="off"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="描述：" prop="monitorDesc">
                  <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 100 }" v-model.trim="formTask.monitorDesc" autocomplete="off"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <el-form :model="formConfig" ref="formConfig" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" v-show="stepTask == 2">
        <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
          <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">设置规则</p>

          <el-table element-loading-text="数据加载中" class="data-table" ref="tableRules" :data="formConfig.rulesData" :key="Math.random()" border stripe :max-height="500" style="margin-top: 20px">
            <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
            <el-table-column prop="monitorType" label="规则类型" min-width="100" align="center"> </el-table-column>
            <el-table-column prop="monitorCode" label="规则模板" min-width="100" align="center"> </el-table-column>
            <el-table-column prop="columnName" label="监控字段" min-width="100" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.monitorType == '字段级'">
                  <template
                    v-if="
                      columnsData.filter(s => {
                        return s.columnName == scope.row.columnName
                      }).length == 0
                    "
                  >
                    <el-popover placement="top" trigger="hover" :content="'警告：' + formTask.tableName + ' 表中不存在 ' + scope.row.columnName + ' 字段!'">
                      <el-button slot="reference" type="text" style="color: red; padding: 0">{{ scope.row.columnName }}</el-button>
                    </el-popover></template
                  >
                  <template v-else> {{ scope.row.columnName }}</template>
                </template>
                <template v-else>-</template>
              </template>
            </el-table-column>
            <el-table-column prop="columnName" label="期望行数" min-width="100" align="center">
              <template slot-scope="scope">
                <template>{{ scope.row.expectRuleHitFlag + scope.row.expectRuleHitCount }}</template>
              </template>
            </el-table-column>
            <el-table-column prop="columnName" label="期望比率" min-width="100" align="center">
              <template slot-scope="scope">
                <template>{{ scope.row.expectRuleHitRateFlag + scope.row.expectRuleHitRate }}%</template>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200" fixed="right">
              <template slot-scope="scope">
                <p class="tableAction" @click="seeRule(scope.row, scope.$index)">编辑</p>
                <p class="tableActionDanger" @click="deleteRule(scope.row, scope.$index)">删除</p>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 10px; width: 100%; height: 40px; text-align: left">
            <el-button type="primary" @click="newRule" size="small">新建规则</el-button>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowTask = false" style="width: 120px">取 消</el-button>
        <el-button @click="stepTask -= 1" v-if="stepTask == 2" style="width: 120px">上一步</el-button>
        <el-button type="primary" @click="nextStep()" v-if="stepTask == 1" style="width: 120px">下一步</el-button>
        <el-button type="primary" v-if="addOrModifyTask && stepTask == 2" @click="addTask()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyTask && stepTask == 2" @click="modifyTask()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleRule" :visible.sync="dialogShowRule" width="800px">
      <el-form :model="formRule" ref="formRule" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="规则类型：" :required="true" prop="monitorType">
              <el-radio-group v-model="formRule.monitorType" size="small" @change="ruleTypeChange()">
                <el-radio-button label="字段级">字段级</el-radio-button>
                <el-radio-button label="表级">表级</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24" v-show="formRule.monitorType == '字段级'">
          <el-col :span="24">
            <el-form-item label="字段名：" :required="formRule.monitorType == '字段级'" prop="columnName">
              <el-select
                v-model="formRule.columnName"
                filterable
                placeholder="请选择字段名"
                @change="
                  ;(formRule.ruleModel = []),
                    (formRule.ruleSql = ''),
                    (formRule.columnType = columnsData.filter(s => {
                      return s.columnName == formRule.columnName
                    })[0].javaType)
                "
              >
                <el-option v-for="(item, index) in columnsData" v-bind:key="index" :label="item.columnName" :value="item.columnName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" v-if="formRule.monitorType == '字段级'" v-show="formRule.columnName">
          <el-col :span="24">
            <el-form-item label="规则模板：" :required="formRule.monitorType == '字段级'" prop="ruleModel">
              <el-cascader ref="ruleModelCascader" @change="ruleModelChange" v-model="formRule.ruleModel" filterable placeholder="请选择规则模板" :options="formRule.columnType == 'STRING' ? ruleModelOptionsString : ruleModelOptionsInt" show-all-levels> </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" v-if="formRule.monitorType == '表级'">
          <el-col :span="24">
            <el-form-item label="规则模板：" :required="formRule.monitorType == '表级'" prop="ruleModel">
              <el-cascader ref="ruleModelCascader" @change="ruleModelChange" v-model="formRule.ruleModel" filterable placeholder="请选择规则模板" :options="ruleModelOptionsTable" show-all-levels> </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24" v-show="formRule.ruleModel[0] == '准确性校验' && formRule.ruleModel[1] == '固定值'">
          <el-col :span="12">
            <el-form-item label="规则阈值：" :required="formRule.ruleModel[0] == '准确性校验' && formRule.ruleModel[1] == '固定值'" prop="runSqlFlag">
              <el-select v-model="formRule.runSqlFlag" filterable placeholder="" @change="ruleModelChange">
                <el-option label="=" value="="></el-option>
                <el-option label=">" value=">"></el-option>
                <el-option label="<" value="<"></el-option>
                <el-option label="≥" value="≥"></el-option>
                <el-option label="≤" value="≤"></el-option>
                <el-option label="≠" value="≠"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" :required="formRule.ruleModel[0] == '准确性校验' && formRule.ruleModel[1] == '固定值'" prop="runSqlValue" label-width="0">
              <el-input v-model.trim="formRule.runSqlValue" @change="ruleModelChange" autocomplete="off" oninput="value=value.replace(/[^\d.]/g,'')"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" v-show="formRule.ruleModel[0] == '唯一性校验' && formRule.ruleModel[1] == '主键唯一性'">
          <el-col :span="24">
            <el-form-item label="主键：" prop="primaryKey" :required="formRule.ruleModel[0] == '唯一性校验' && formRule.ruleModel[1] == '主键唯一性'">
              <el-select v-model="formRule.primaryKey" filterable placeholder="请选择" multiple @change="ruleModelChange">
                <el-option v-for="(item, index) in columnsData" :label="item.columnName" :value="item.columnName" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24" v-show="formRule.ruleSql">
            <el-form-item label="SQL预览：">
              <div v-highlight v-if="SQLShow">
                <pre>
          <code class="sql" style="flex-wrap: wrap;display: flex;"  >
           {{formRule.ruleSql }}
          </code>
       </pre>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" v-show="formRule.ruleSql">
          <el-col :span="12">
            <el-form-item label="期望行数：" :required="true" prop="expectRuleHitFlag">
              <el-select v-model="formRule.expectRuleHitFlag" filterable placeholder="">
                <el-option label="=" value="="></el-option>
                <el-option label=">" value=">"></el-option>
                <el-option label="<" value="<"></el-option>
                <el-option label="≥" value="≥"></el-option>
                <el-option label="≤" value="≤"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" :required="true" prop="expectRuleHitCount" label-width="0">
              <el-input v-model.trim="formRule.expectRuleHitCount" autocomplete="off" oninput="value=value.replace(/[^\d]/g,'')"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" v-show="formRule.ruleSql">
          <el-col :span="12">
            <el-form-item label="期望比率：" :required="true" prop="expectRuleHitRateFlag">
              <el-select v-model="formRule.expectRuleHitRateFlag" filterable placeholder="">
                <el-option label="=" value="="></el-option>
                <el-option label=">" value=">"></el-option>
                <el-option label="<" value="<"></el-option>
                <el-option label="≥" value="≥"></el-option>
                <el-option label="≤" value="≤"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" :required="true" prop="expectRuleHitRate" label-width="0">
              <el-input v-model.trim="formRule.expectRuleHitRate" autocomplete="off" oninput="value=value.replace(/[^\d.]/g,'')"> <template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowRule = false" style="width: 120px">取 消</el-button>
        <el-button type="primary" v-if="addOrModifyRule" @click="addRule()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyRule" @click="modifyRule()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleCase" :visible.sync="dialogShowCase" width="1200px">
      <div style="width: 100%; height: auto; padding: 20px 0">
        <el-table class="data-table" ref="tableCase" :data="tableCase" border stripe max-height="500">
          <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column prop="monitorName" label="任务名称" min-width="120" align="left"> </el-table-column>
          <el-table-column prop="id" label="ID" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="jobId" label="jobId" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="150" align="center"> </el-table-column>
          <el-table-column prop="createBy" label="创建人" min-width="150" align="center"> </el-table-column>
          <el-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <p class="tableAction" @click="showCaseDetail(scope.row)">运行结果</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :title="titleCaseDetail" :visible.sync="dialogShowCaseDetail" width="1200px">
      <div style="width: 100%; height: auto; padding: 20px 0">
        <el-table class="data-table" ref="tableCaseDetail" :data="tableCaseDetail" border stripe max-height="500">
          <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column prop="id" label="ID" min-width="100" align="center"> </el-table-column>
          <el-table-column prop="columnName" label="字段名称" min-width="120" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="monitorType" label="规则类型" min-width="100" align="center"> </el-table-column>
          <el-table-column prop="monitorCode" label="规则模板" min-width="100" align="center"> </el-table-column>
          <el-table-column prop="totalCount" label="totalCount" min-width="120" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="runResult" label="runResult" min-width="120" align="center"> </el-table-column>
          <el-table-column prop="jobId" label="jobId" min-width="180" align="center"> </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText, dateFormat } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'qualityMonitor',
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

      queryForm: {
        monitorName: '',
        pageSize: 10,
        page: 1,
        total: 0
      },
      TaskData: [],
      loadingTask: true,

      dialogShowTask: false,
      titleTask: '',
      addOrModifyTask: true,
      stepTask: 1,
      dbTypeList: [],
      dataSourceList: [],
      dbNameList: [],
      tableNameList: [],
      formTask: {
        monitorName: null,
        monitorDesc: '',

        dbType: '',
        dataSourceId: '',
        dbName: '',
        tableName: ''
      },
      columnsData: [],
      formConfig: {
        rulesData: []
      },
      dialogShowRule: false,
      titleRule: '',
      rulesDataIndex: '',
      addOrModifyRule: true,
      formRule: {
        monitorType: '字段级',
        columnName: '',
        columnType: '',
        ruleModel: [],
        ruleSql: '',
        runSqlFlag: '',
        runSqlValue: '',
        primaryKey: [],
        expectRuleHitFlag: '',
        expectRuleHitCount: '',
        expectRuleHitRateFlag: '',
        expectRuleHitRate: ''
      },
      SQLShow: true,
      ruleModelOptionsString: [
        {
          value: '完整性校验',
          label: '完整性校验',
          children: [
            {
              value: '非空',
              label: '非空',
              SQL: 'SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` is  not null'
            },
            {
              value: '空值',
              label: '空值',
              SQL: 'SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` is  null'
            },
            {
              value: '空或NULL',
              label: '空或NULL',
              SQL: 'SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` is  null or length(`COLUMNNAME`) = 0'
            },
            {
              value: '空或NULL或NULL字符串',
              label: '空或NULL或NULL字符串',
              SQL: 'SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` is  null or length(`COLUMNNAME`) = 0 or lower(`COLUMNNAME`) = "null"'
            },
            {
              value: '非空非NULL',
              label: '非空非NULL',
              SQL: 'SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` is  not null and length(`COLUMNNAME`) > 0'
            },
            {
              value: '非空非NULL且不等于NULL字符串',
              label: '非空非NULL且不等于NULL字符串',
              SQL: 'SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` is  not null and length(`COLUMNNAME`) > 0 and lower(`COLUMNNAME`)<> "null"'
            }
          ]
        },
        {
          value: '有效性校验',
          label: '有效性校验',
          children: [
            {
              value: '有效IP',
              label: '有效IP',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^(([0-9]{1}|[1-9][0-9]{1}|1[0-9]{2}|2[0-4]{1}[0-9]{1}|25[0-5]{1}).){3}([0-9]{1}|[1-9][0-9]{1}|1[0-9]{2}|2[0-4]{1}[0-9]{1}|25[0-5]{1})$'"
            },
            {
              value: '有效经度',
              label: '有效经度',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^(([0-9]{1})|([1-9]{1}[0-9]{1})|(1[0-7]{1}[0-9]{1})(.[0-9]+)?)|(180(.0+)?)$'"
            },
            {
              value: '有效纬度',
              label: '有效纬度',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^(([0-9]{1})|([1-8]{1}[0-9]{1})(.[0-9]+)?)|(90(.0+)?)$'"
            },
            {
              value: '邮箱地址合法性',
              label: '邮箱地址合法性',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?.)+[a-z]{2,}$'"
            },
            {
              value: '中国邮编格式校验',
              label: '中国邮编格式校验',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^[0-9]{6}$'"
            },
            {
              value: '手机号格式校验',
              label: '手机号格式校验',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^1(3[0-9]|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])[0-9]{8}$'"
            },
            {
              value: '身份证格式校验',
              label: '身份证格式校验',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^[1-9][0-9]{5}(18|19|([23]d))[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{3}[0-9Xx]$'"
            },
            {
              value: '银行卡号格式校验',
              label: '银行卡号格式校验',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^[1-9][0-9]{15}$'"
            },
            {
              value: '固定电话格式校验',
              label: '固定电话格式校验',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^(0[0-9]{2,3}-)?[0-9]{7,8}(-[0-9]{1,6})?$'"
            },
            {
              value: '统一社会信用代码格式校验',
              label: '统一社会信用代码格式校验',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^([0-9A-HJ-NPQRTUWXY]{2}[0-9]{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9][0-9]{14})$'"
            },
            {
              value: '外国人居留证格式校验',
              label: '外国人居留证格式校验',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^[A-Z]{3}[0-9]{12}$'"
            },
            {
              value: '护照格式校验',
              label: '护照格式校验',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^([EK][0-9]{8}|(SE|DE|PE|MA)[0-9]{7})$'"
            },
            {
              value: '常规车牌号格式校验',
              label: '常规车牌号格式校验',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^[京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][0-9ABCDEFGHJKLNMPQRSTUVWXYZ]{5}$'"
            },
            {
              value: '新能源车牌号格式校验',
              label: '新能源车牌号格式校验',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^[京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][1-9DF][1-9ABCDEFGHJKLMNPQRSTUVWXYZ][0-9]{3}[1-9DF]$'"
            },
            {
              value: '美国邮政编码格式校验',
              label: '美国邮政编码格式校验',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^[0-9]{5}(-[0-9]{4})?$'"
            },
            {
              value: 'MAC地址格式校验',
              label: 'MAC地址格式校验',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '^[0-9A-F]{2}(-[0-9A-F]{2}){5}$'"
            },
            {
              value: 'URL地址格式校验',
              label: 'URL地址格式校验',
              SQL: "SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` rlike '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'"
            }
          ]
        },
        {
          value: '唯一性校验',
          label: '唯一性校验',
          children: [
            {
              value: '唯一性',
              label: '唯一性',
              SQL: 'SELECT SUM(ALIAS_NAME_cnt) as dqRowCount,COUNT(*) as ALIAS_NAME from (select COLUMNNAME, COUNT(*) as ALIAS_NAME_cnt from `DBNAME`.`TABLENAME`  group by COLUMNNAME) t'
            }
          ]
        }
      ],
      ruleModelOptionsInt: [
        {
          value: '准确性校验',
          label: '准确性校验',
          children: [
            {
              value: '固定值',
              label: '固定值',
              SQL: 'SELECT COUNT(`COLUMNNAME`) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` RUNSQLFLAG RUNSQLVALUE'
            }
          ]
        },
        {
          value: '完整性校验',
          label: '完整性校验',
          children: [
            {
              value: '非空',
              label: '非空',
              SQL: 'SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` is  not null'
            },
            {
              value: '空值',
              label: '空值',
              SQL: 'SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME` where `COLUMNNAME` is  null'
            }
          ]
        },
        {
          value: '唯一性校验',
          label: '唯一性校验',
          children: [
            {
              value: '唯一性',
              label: '唯一性',
              SQL: 'SELECT SUM(ALIAS_NAME_cnt) as dqRowCount,COUNT(*) as ALIAS_NAME from (select name, COUNT(*) as ALIAS_NAME_cnt from `DBNAME`.`TABLENAME`  group by COLUMNNAME) t'
            }
          ]
        }
      ],
      ruleModelOptionsTable: [
        {
          value: '准确性校验',
          label: '准确性校验',
          children: [
            {
              value: '表行数',
              label: '表行数',
              SQL: 'SELECT COUNT(*) as ALIAS_NAME from `DBNAME`.`TABLENAME`'
            }
          ]
        },

        {
          value: '唯一性校验',
          label: '唯一性校验',
          children: [
            {
              value: '主键唯一性',
              label: '主键唯一性',
              SQL: 'SELECT SUM(ALIAS_NAME_cnt) as dqRowCount,COUNT(*) as ALIAS_NAME from (select PRIMARYKEY, COUNT(*) as ALIAS_NAME_cnt from `DBNAME`.`TABLENAME`  group by PRIMARYKEY) t'
            }
          ]
        }
      ],

      dialogShowCase: false,
      titleCase: '',
      tableCase: [],

      dialogShowCaseDetail: false,
      titleCaseDetail: '',
      tableCaseDetail: []
    }
  },
  mounted() {
    this.getdbTypeList()
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
    getdbTypeList() {
      let that = this
      request({ url: '/data_source/type/list', method: 'get', params: {} }).then(res => {
        that.dbTypeList = res.data
      })
    },

    getTaskData() {
      let that = this
      that.loadingTask = true
      request({ url: '/monitor/list', method: 'get', params: { page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.TaskData = res.data.list || []
        that.loadingTask = false
        that.queryForm.total = res.data.total
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 新建探查任务
    newTask() {
      let that = this
      that.addOrModifyTask = true
      that.stepTask = 1
      that.dialogShowTask = true
      that.buttonLoad = false
      that.titleTask = '新建质量监控任务信息'
      that.dataSourceList = []
      that.dbNameList = []
      that.tableNameList = []
      resetForm('formTask', that)
      resetForm('formConfig', that)
      that.formConfig = {
        rulesData: []
      }
    },
    // 数据源类型change
    dbTypeChange() {
      let that = this
      that.dataSourceList = []
      that.dbNameList = []
      that.tableNameList = []
      that.formTask.dataSourceId = ''
      that.formTask.dbName = ''
      that.formTask.tableName = ''
      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.formTask.dbType, page: 1, pageSize: 1000 } }).then(res => {
        that.dataSourceList = res.data.list || []
      })
    },
    // 数据源change
    dataSourceChange() {
      let that = this
      that.dbNameList = that.dataSourceList.filter(s => {
        return s.id == that.formTask.dataSourceId
      })
      that.tableNameList = []
      that.formTask.tableName = ''
      that.formTask.dbName = that.dbNameList[0].dbName
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formTask.dataSourceId } }).then(res => {
        that.tableNameList = res.data
      })
    },
    // 表change
    tableNameChange() {
      let that = this
      that.formTask.monitorName = dateFormat('YYYYmmddHHMMSS', new Date()) + `监控${that.formTask.dbType}.${that.formTask.dbName}.${that.formTask.tableName}`
      that.columnsData = []
      request({ url: '/data_source/columns', method: 'get', params: { id: that.formTask.dataSourceId, table: that.formTask.tableName } }).then(res => {
        that.columnsData = res.data
        // that.formConfig.rulesData = []
      })
    },

    // 下一步
    nextStep() {
      let that = this
      if (that.stepTask == 1) {
        that.$refs['formTask'].validate(valid => {
          if (valid) {
            that.stepTask += 1
          } else {
            Notify('error', '请将红色标注部分填写完整')
          }
        })
      }
    },
    // Task新增
    addTask() {
      let that = this
      let params = { ...that.formTask }
      params.list = that.formConfig.rulesData
      params.id = null
      params.update = false
      that.buttonLoad = true
      request({ url: '/monitor/add', method: 'post', data: params })
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
    },
    modifyTask() {
      let that = this
      let params = { ...that.formTask }
      params.list = that.formConfig.rulesData
      params.update = true
      that.buttonLoad = true
      request({ url: '/monitor/add', method: 'post', data: params })
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
    },
    // Task回显
    seeTask(row) {
      let that = this
      request({ url: '/monitor/get', method: 'get', params: { id: row.id } }).then(res => {
        that.addOrModifyTask = false
        that.stepTask = 1
        that.dialogShowTask = true
        that.buttonLoad = false
        that.titleTask = '修改质量监控任务信息    [' + row.monitorName + ']'
        resetForm('formTask', that)
        resetForm('formConfig', that)
        that.formConfig = {
          rulesData: []
        }
        that.$nextTick(() => {
          that.formTask.id = res.data.id
          that.formTask.monitorName = res.data.monitorName
          that.formTask.monitorDesc = res.data.monitorDesc
          that.formTask.dbType = res.data.dbType
          that.formTask.dataSourceId = res.data.dataSourceId
          that.formTask.dbName = res.data.dbName
          that.formTask.tableName = res.data.tableName
          that.formConfig.rulesData = res.data.list
          request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.formTask.dbType, page: 1, pageSize: 1000 } }).then(res1 => {
            that.dataSourceList = res1.data.list || []
            that.dbNameList = that.dataSourceList.filter(s => {
              return s.id == that.formTask.dataSourceId
            })
            request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formTask.dataSourceId } }).then(res2 => {
              that.tableNameList = res2.data
              request({ url: '/data_source/columns', method: 'get', params: { id: that.formTask.dataSourceId, table: that.formTask.tableName } }).then(res3 => {
                that.columnsData = res3.data
              })
            })
          })
        })
      })
    },
    newRule() {
      let that = this
      that.addOrModifyRule = true
      that.dialogShowRule = true
      that.buttonLoad = false
      that.titleRule = '新建规则信息'
      resetForm('formRule', that)
      that.formRule = {
        monitorType: '字段级',
        columnName: '',
        columnType: '',
        ruleModel: [],
        ruleSql: '',
        runSqlFlag: '',
        runSqlValue: '',
        primaryKey: [],
        expectRuleHitFlag: '',
        expectRuleHitCount: '',
        expectRuleHitRateFlag: '',
        expectRuleHitRate: ''
      }
      that.formRule.ruleModel = []
      that.formRule.ruleSql = ''
      that.SQLShow = false
      setTimeout(() => {
        that.SQLShow = true
      }, 0)
    },

    addRule() {
      let that = this
      that.$refs['formRule'].validate(valid => {
        if (valid) {
          that.buttonLoad = true
          let rulesData = { ...that.formRule }
          rulesData.monitorCode = rulesData.ruleModel.join('/')
          rulesData.dataSourceId = that.formTask.dataSourceId
          if (rulesData.ruleModel[0] == '唯一性校验' && rulesData.ruleModel[1] == '主键唯一性') {
            rulesData.columnName = rulesData.primaryKey.join(',')
          }
          that.formConfig.rulesData.push({ ...rulesData })
          that.dialogShowRule = false
          setTimeout(() => {
            that.buttonLoad = false
          }, 300)
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },

    seeRule(row, rowIndex) {
      let that = this
      that.addOrModifyRule = false
      that.dialogShowRule = true
      that.rulesDataIndex = rowIndex
      that.buttonLoad = false
      that.titleRule = '修改规则信息'
      resetForm('formRule', that)
      that.formRule = { ...row }
      that.formRule.ruleModel = that.formRule.monitorCode.split('/')
      if (that.formRule.ruleModel[0] == '唯一性校验' && that.formRule.ruleModel[1] == '主键唯一性') {
        that.formRule.primaryKey = that.formRule.columnName.split(',')
      }
      that.SQLShow = false
      setTimeout(() => {
        that.SQLShow = true
      }, 0)
    },
    deleteRule(row, rowIndex) {
      let that = this
      that
        .$confirm('是否确定删除该规则?删除将无法恢复！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          if (row.id) {
            request({ url: '/monitor/monitor_rule/delete', method: 'post', data: { id: row.id } }).then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), that.formConfig.rulesData.splice(rowIndex, 1))
            })
          } else {
            Notify('success', '处理成功')
            that.formConfig.rulesData.splice(rowIndex, 1)
          }
        })
        .catch(() => {})
    },
    modifyRule() {
      let that = this
      that.$refs['formRule'].validate(valid => {
        if (valid) {
          that.buttonLoad = true
          let rulesData = { ...that.formRule }
          rulesData.monitorCode = rulesData.ruleModel.join('/')
          rulesData.dataSourceId = that.formTask.dataSourceId

          if (rulesData.ruleModel[0] == '唯一性校验' && rulesData.ruleModel[1] == '主键唯一性') {
            rulesData.columnName = rulesData.primaryKey.join(',')
          }
          that.formConfig.rulesData[that.rulesDataIndex] = { ...rulesData }

          that.dialogShowRule = false

          setTimeout(() => {
            that.buttonLoad = false
          }, 300)
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    ruleTypeChange() {
      let that = this
      that.formRule.columnName = ''
      that.formRule.columnType = ''
      that.formRule.ruleModel = []
      that.formRule.ruleSql = ''
      that.formRule.runSqlValue = ''
      that.formRule.runSqlFlag = ''
      that.formRule.primaryKey = []
      that.formRule.expectRuleHitFlag = ''
      that.formRule.expectRuleHitCount = ''
      that.formRule.expectRuleHitRateFlag = ''
      that.formRule.expectRuleHitRate = ''
      that.SQLShow = false
      setTimeout(() => {
        that.SQLShow = true
      }, 0)
    },
    ruleModelChange() {
      let that = this
      that.SQLShow = false
      let SQL = that.$refs['ruleModelCascader'].getCheckedNodes()[0].data.SQL
      that.formRule.ruleSql = SQL.replaceAll('DBNAME', that.formTask.dbName).replaceAll('TABLENAME', that.formTask.tableName).replaceAll('COLUMNNAME', that.formRule.columnName)
      if (that.formRule.ruleModel[0] == '准确性校验' && that.formRule.ruleModel[1] == '固定值') {
        that.formRule.ruleSql = that.formRule.ruleSql.replaceAll('RUNSQLFLAG', that.formRule.runSqlFlag).replaceAll('RUNSQLVALUE', that.formRule.runSqlValue)
      }
      if (that.formRule.ruleModel[0] == '唯一性校验' && that.formRule.ruleModel[1] == '主键唯一性') {
        that.formRule.ruleSql = that.formRule.ruleSql.replaceAll('PRIMARYKEY', that.formRule.primaryKey.join(','))
      }
      setTimeout(() => {
        that.SQLShow = true
      }, 0)
    },
    runTask(row) {
      let that = this
      this.$confirm('是否运行[' + row.monitorName + ']质量监控任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request({ url: '/monitor/run', method: 'post', params: { id: row.id } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '运行中'), that.getTaskData())
          })
        })
        .catch(() => {})
    },
    showCaseList(row) {
      let that = this
      that.dialogShowCase = true
      that.titleCase = '实例列表    [' + row.monitorName + ']'
      request({ url: '/monitor/run_record/get', method: 'get', params: { id: row.id, page: 1, pageSize: 10000 } }).then(res => {
        that.tableCase = res.data.list || []
        that.queryForm.total = res.data.total
        that.tableCaseDetail = []
        JSON.parse(row.taskJson).list.forEach((item, index) => {
          that.tableCaseDetail.push({ columnName: item.fieldName, javaType: item.fieldType, columnComment: item.fieldDesc })
        })
        setTimeout(() => {
          that.$refs.tableCase.doLayout()
        }, 300)
      })
    },
    // 删除监控任务
    cancelTask(row) {
      let that = this
      that
        .$confirm('是否确定删除[' + row.monitorName + ']质量监控?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/monitor/monitor_rule_table/delete', method: 'post', data: { id: row.id } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), that.getTaskData())
          })
        })
        .catch(() => {})
    },
    // 展示实例详情
    showCaseDetail(row) {
      let that = this
      that.dialogShowCaseDetail = true
      that.titleCaseDetail = '运行结果    [' + row.jobId + ']'
      that.$nextTick(() => {
        that.tableCaseDetail = row.monitorRunResultList
        setTimeout(() => {
          that.$refs.tableCaseDetail.doLayout()
        }, 300)
      })
    }
  }
}
</script>

<style scoped>
</style>
