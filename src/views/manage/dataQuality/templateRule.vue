<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain dataSource">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <p class="searchLabel" style="width: auto">适用表类型:</p>
        <div style="width: 13%; height: 42px; float: left; margin: 0 1%">
          <el-select v-model="queryForm.ruleTableType" filterable placeholder="请选择" @change=";(queryForm.page = 1), getruleData()">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="mysql" value="mysql"></el-option>
            <el-option label="oracle" value="oracle"></el-option>
            <el-option label="hive" value="hive"></el-option>
            <el-option label="dm" value="dm"></el-option>
          </el-select>
        </div>
        <p class="searchLabel" style="width: auto">数据类型:</p>
        <div style="width: 13%; height: 42px; float: left; margin: 0 1%">
          <el-select v-model="queryForm.ruleDataType" filterable placeholder="请选择" @change=";(queryForm.page = 1), getruleData()">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="CHARACTER" value="CHARACTER"></el-option>
            <el-option label="NUMERICAL" value="NUMERICAL"></el-option>
            <el-option label="TABLE" value="TABLE"></el-option>
          </el-select>
        </div>
        <p class="searchLabel" style="width: auto">适用表类型:</p>
        <div style="width: 13%; height: 42px; float: left; margin: 0 1%">
          <el-select v-model="queryForm.ruleCheckType" filterable placeholder="请选择" @change=";(queryForm.page = 1), getruleData()">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="准确性校验" value="准确性校验"></el-option>
            <el-option label="完整性校验" value="完整性校验"></el-option>
            <el-option label="唯一性校验" value="唯一性校验"></el-option>
            <el-option label="有效性校验" value="有效性校验"></el-option>
          </el-select>
        </div>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-search" @click="getruleData()">查询</el-button>
        </div>
        <!-- <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-plus" @click="">新建规则模板</el-button>
        </div> -->
      </div>
    </div>
    <div class="main-unit" style="width: calc(100% - 48px); height: calc(100% - 95px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
      <el-table v-loading="loadingRule" element-loading-text="数据加载中" class="data-table" ref="table" :data="ruleData" stripe :height="this.$store.state.globalHeight - 285">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="ruleName" label="规则名称" min-width="200" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <p @click="scope.row.ruleName && showRuleDetail(scope.row)" class="tableLink" :title="scope.row.ruleName">{{ scope.row.ruleName || '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="ruleCheckType" label="校验类型" min-width="140" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="ruleDataType" label="数据类型" min-width="140" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="ruleTableType" label="适用数据表类型" min-width="140" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="ruleDesc" label="描述" min-width="320" align="left" show-overflow-tooltip> </el-table-column>
        <!-- <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="seeRule(scope.row)">修改</p>
            <p class="tableAction" @click="cancelRule(scope.row)" style="color: #ff9900">删除</p>
          </template>
        </el-table-column> -->
      </el-table>
      <pagination :pageSize="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getruleData"> </pagination>
    </div>
    <el-dialog :title="titleRule" :visible.sync="dialogShowRule" width="550px">
      <el-form :model="formRule" ref="formRule" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="集合名称：" :required="true" prop="RuleionName">
                <el-input v-model.trim="formRule.RuleionName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="集合path：" :required="true" prop="RuleionPath">
                <el-input v-model.trim="formRule.RuleionPath" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" placeholder="仅支持数字、字母、_"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述：" :required="true" prop="RuleionDesc">
                <el-input v-model.trim="formRule.RuleionDesc" autocomplete="off" type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowRule = false" style="width: 120px">取 消</el-button>
        <el-button type="primary" v-if="addOrModifyRule" @click="addRule()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyRule" @click="modifyRule()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleRuleDetail" :visible.sync="dialogShowRuleDetail" width="650px">
      <el-descriptions title="" border :column="1" style="margin: 10px auto; width: 98%; padding-bottom: 20px">
        <el-descriptions-item label="模板名称">{{ ruleDetail.ruleName }}</el-descriptions-item>
        <el-descriptions-item label="校验类型">{{ ruleDetail.ruleCheckType }}</el-descriptions-item>
        <el-descriptions-item label="数据类型">{{ ruleDetail.ruleDataType }}</el-descriptions-item>
        <el-descriptions-item label="适用数据表类型">{{ ruleDetail.ruleTableType }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ ruleDetail.ruleDesc }}</el-descriptions-item>
        <el-descriptions-item label="运行语句">
          <div v-highlight style="width: 400px" v-if="sqlShow">
            <pre>
          <code class="sql" style="flex-wrap: wrap;display: flex;"  >
           {{ruleDetail.ruleSql }}
          </code>
       </pre>
          </div></el-descriptions-item
        >
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'templateRule',
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
        ruleTableType: null,
        ruleDataType: null,
        ruleCheckType: null,
        pageSize: 10,
        page: 1,
        total: 0
      },
      ruleData: [],
      loadingRule: true,

      formRule: {
        RuleionName: '',
        RuleionPath: '',
        RuleionDesc: ''
      },
      dialogShowRule: false,
      titleRule: '',
      addOrModifyRule: true,

      dialogShowRuleDetail: false,
      ruleDetail: {},
      sqlShow: true,
      titleRuleDetail: ''
    }
  },
  mounted() {
    this.getruleData()
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
    // 获取API集合数据
    getruleData() {
      let that = this
      that.loadingRule = true
      request({ url: '/template_rule/list', method: 'post', data: { ruleTableType: that.queryForm.ruleTableType, ruleDataType: that.queryForm.ruleDataType, ruleCheckType: that.queryForm.ruleCheckType, page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.ruleData = res.data.list || []
        that.loadingRule = false
        that.queryForm.total = res.data.total || 0
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    showRuleDetail(row) {
      let that = this
      that.ruleDetail = { ...row }
      that.titleRuleDetail = '规则模板详情    [' + row.ruleName + ']'
      that.dialogShowRuleDetail = true
      that.sqlShow = false
      setTimeout(() => {
        that.sqlShow = true
      }, 0)
    },
    // 新建数据源
    newRule() {
      let that = this
      that.addOrModifyRule = true
      that.dialogShowRule = true
      that.buttonLoad = false
      that.titleRule = '新建规则模板信息'
      resetForm('formRule', that)
    },
    // add数据源
    addRule() {
      let that = this
      that.$refs['formRule'].validate(valid => {
        if (valid) {
          let params = that.formRule
          // params.id = ''
          that.buttonLoad = true
          request({ url: '/auto_api/Ruleion/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowRule = false
                that.getruleData()
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
    seeRule(row) {
      let that = this
      request({ url: '/auto_api/Ruleion/get_by_id', method: 'get', params: { id: row.id } }).then(res => {
        that.addOrModifyRule = false
        that.dialogShowRule = true
        that.buttonLoad = false
        that.titleRule = '修改规则模板信息    [' + row.ruleName + ']'
        resetForm('formRule', that)
        that.$nextTick(() => {
          that.formRule = res.data
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
