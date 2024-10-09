<template>
  <div class="manageMain sensitiveType">
    <div class="buttonArea">
      <el-button icon="el-icon-plus" type="primary" @click="newMG()" size="mini">新增敏感类型</el-button>
    </div>

    <div class="tableArea">
      <el-table v-loading="loadingMG" element-loading-text="数据加载中" ref="table" :data="MGData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>

        <el-table-column prop="typeName" label="类型名称" min-width="200" align="left"> </el-table-column>
        <el-table-column prop="createMethod" label="创建方式" min-width="100" align="left"> </el-table-column>
        <el-table-column prop="identifyObject" label="识别对象" min-width="150" align="left"> </el-table-column>
        <el-table-column prop="regularExpression" label="正则表达式" show-overflow-tooltip="" min-width="230" align="left"> </el-table-column>
        <el-table-column prop="securityLevel" label="安全等级" min-width="120" align="left"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="150" align="left"> </el-table-column>
        <el-table-column prop="createBy" label="操作人" min-width="120" align="left"> </el-table-column>
        <el-table-column label="操作" align="center" width="140" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="seeMG(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelMG(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getMGData"> </pagination>
    </div>
    <el-dialog :title="titleMG" :visible.sync="formShowMG" width="530px">
      <el-form :model="formMG" ref="formMG" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 30px 0 10px">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="类型名称：" :required="true" prop="typeName">
                <el-input v-model.trim="formMG.typeName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="创建模式：" :required="true" prop="createMethod">
                <el-select v-model="formMG.createMethod" filterable placeholder="" clearable="">
                  <el-option value="模板" label="模板"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="识别对象：" :required="true" prop="identifyObject">
                <el-select v-model="formMG.identifyObject" filterable placeholder="" clearable="">
                  <el-option value="字段内容" label="字段内容"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="正则表达式：" :required="true" prop="regularExpression">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 100 }" v-model.trim="formMG.regularExpression" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="安全等级：" :required="true" prop="securityLevel">
                <el-input v-model.trim="formMG.securityLevel" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShowMG = false" style="width: 100px" size="mini">取消</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="addOrModifyMG" @click="addMG()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="!addOrModifyMG" @click="modifyMG()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
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
      queryForm: {
        pageSize: 20,
        page: 1,
        total: 0
      },
      MGData: [],
      loadingMG: true,

      formMG: {
        typeName: '',
        createMethod: '模板',
        identifyObject: '字段内容',
        regularExpression: '',
        securityLevel: '-'
      },
      formShowMG: false,
      titleMG: '',

      addOrModifyMG: true
    }
  },
  mounted() {
    this.getMGData()
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
    // 获取权限数据
    getMGData() {
      let that = this
      that.loadingMG = true
      request({ url: '/sensitive_type_info/list', method: 'get', params: { page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.MGData = res.data.list || []
        that.queryForm.total = res.data.total || 0
        that.loadingMG = false
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    updateMG(row, status) {
      let that = this
      that
        .$confirm('是否' + (status ? '启用' : '禁用') + '[' + row.permissionName + ']权限信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/permission/update', method: 'post', data: { id: row.id, permissionState: status } }).then(res => {
            res.code == 200 && Notify('success', res.message || status ? '启用成功' : '禁用成功')
            that.getMGData()
          })
        })
        .catch(() => {})
    },
    // 新建权限
    newMG() {
      let that = this
      that.addOrModifyMG = true
      that.formShowMG = true
      that.buttonLoad = false
      that.titleMG = '新建敏感信息'
      that.$nextTick(() => {
        resetForm('formMG', that)
      })
    },

    // add权限
    addMG() {
      let that = this
      that.$refs['formMG'].validate(valid => {
        if (valid) {
          let params = that.formMG
          that.buttonLoad = true
          request({ url: '/sensitive_type_info/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowMG = false), that.getMGData())
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

    seeMG(row) {
      let that = this
      request({ url: '/sensitive_type_info/get', method: 'get', params: { id: row.id } }).then(res => {
        that.addOrModifyMG = false
        that.formShowMG = true
        that.buttonLoad = false
        that.titleMG = '修改敏感类型信息    [' + row.typeName + ']'
        that.$nextTick(() => {
          that.formMG = res.data
        })
      })
    },
    modifyMG() {
      let that = this
      that.$refs['formMG'].validate(valid => {
        if (valid) {
          let params = that.formMG
          that.buttonLoad = true
          request({ url: '/sensitive_type_info/update', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.formShowMG = false
                that.getMGData()
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

    // 删除修饰词
    cancelMG(row) {
      let that = this
      that
        .$confirm('是否确定删除[' + row.typeName + ']敏感类型?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/sensitive_type_info/delete', method: 'post', data: { id: row.id } }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getMGData()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
