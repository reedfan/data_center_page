<template>
  <div class="manageMain udfStudio">
    <div class="buttonArea">
      <el-button icon="el-icon-plus" type="primary" @click="newUdf()" size="mini">新建函数</el-button>
    </div>

    <div class="tableArea">
      <el-table v-loading="loadingUdf" element-loading-text="数据加载中" ref="table" :data="UdfData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="functionName" label="函数名称" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="functionNameEn" label="函数英文名称" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="instruction" label="描述" min-width="180" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createBy" label="创建人" min-width="60" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="80" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <p class="tableAction" @click="seeUdf(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelUdf(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="titleUdf" :visible.sync="dialogShowUdf" width="550px">
      <el-form :model="formUdf" ref="formUdf" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="函数名称" :required="true" prop="functionName">
                <el-input v-model.trim="formUdf.functionName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="函数英文名称" :required="true" prop="functionNameEn">
                <el-input v-model.trim="formUdf.functionNameEn" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述" :required="true" prop="instruction">
                <el-input v-model.trim="formUdf.instruction" autocomplete="off" type="textarea" :autosize="{ minRows: 3, maxRows: 100 }"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowUdf = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" v-if="addOrModifyUdf" @click="addUdf()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyUdf" @click="modifyUdf()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'decorationUdfs',
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
      UdfData: [],
      loadingUdf: true,

      formUdf: {
        functionName: '',
        functionNameEn: '',
        instruction: ''
      },
      dialogShowUdf: false,
      titleUdf: '',
      addOrModifyUdf: true
    }
  },
  mounted() {
    this.getUdfData()
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
    // 获取UDF数据
    getUdfData() {
      let that = this
      that.loadingUdf = true
      request({ url: '/udf_function/list', method: 'get', params: {} }).then(res => {
        that.UdfData = res.data || []
        that.loadingUdf = false
        that.queryForm.total = res.data.length || 0
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },

    // 新建UDF
    newUdf() {
      let that = this
      that.addOrModifyUdf = true
      that.dialogShowUdf = true
      that.buttonLoad = false
      that.titleUdf = '新建函数信息'
      resetForm('formUdf', that)
      that.formUdf = {
        functionName: '',
        functionNameEn: '',
        instruction: ''
      }
    },
    // addUDF
    addUdf() {
      let that = this
      that.$refs['formUdf'].validate(valid => {
        if (valid) {
          let params = that.formUdf
          params.id = ''
          that.buttonLoad = true
          request({ url: '/udf_function/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowUdf = false
                that.getUdfData()
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
    seeUdf(row) {
      let that = this
      that.addOrModifyUdf = false
      that.dialogShowUdf = true
      that.buttonLoad = false
      that.titleUdf = '修改函数信息    [' + row.functionName + ']'
      that.$nextTick(() => {
        that.formUdf = { ...row }
      })
    },
    modifyUdf() {
      let that = this
      that.$refs['formUdf'].validate(valid => {
        if (valid) {
          let params = that.formUdf
          that.buttonLoad = true
          request({ url: '/udf_function/update', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowUdf = false
                that.getUdfData()
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

    // 删除UDF
    cancelUdf(row) {
      let that = this
      that
        .$confirm('是否确定删除[' + row.functionName + ']函数?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/udf_function/delete', method: 'post', data: { id: row.id } }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getUdfData()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
