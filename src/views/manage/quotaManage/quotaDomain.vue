<template>
  <div class="manageMain quotaDomain">
    <div class="buttonArea">
      <el-button icon="el-icon-plus" type="primary" @click="newDomain()" size="mini">新建指标域</el-button>
    </div>

    <div class="tableArea">
      <el-table v-loading="loadingDomain" element-loading-text="数据加载中" ref="table" :data="DomainData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="indicatorDomainName" label="指标域名称" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="indicatorDomainIdentification" label="指标域标识" min-width="80" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createBy" label="创建人" min-width="60" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="80" align="left" show-overflow-tooltip> </el-table-column>

        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <p class="tableAction" @click="seeDomain(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelDomain(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getDomainData"> </pagination>
    </div>
    <el-dialog :title="titleDomain" :visible.sync="dialogShowDomain" width="550px">
      <el-form :model="formDomain" ref="formDomain" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="指标域名称：" :required="true" prop="indicatorDomainName">
                <el-input v-model.trim="formDomain.indicatorDomainName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="指标域标识：" :required="true" prop="indicatorDomainIdentification">
                <el-input v-model.trim="formDomain.indicatorDomainIdentification" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" placeholder="仅支持数字、字母、_"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowDomain = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" v-if="addOrModifyDomain" @click="addDomain()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyDomain" @click="modifyDomain()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'timeDomain',
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
      DomainData: [],
      loadingDomain: true,

      formDomain: {
        indicatorDomainIdentification: '',
        indicatorDomainName: ''
      },
      dialogShowDomain: false,
      titleDomain: '',
      addOrModifyDomain: true
    }
  },
  mounted() {
    this.getDomainData()
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
    getDomainData() {
      let that = this
      that.loadingDomain = true
      request({ url: '/data_indicator_organization/list', method: 'get', params: { page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.DomainData = res.data.list || []
        that.loadingDomain = false
        that.queryForm.total = res.data.total || 0
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 新建API集合
    newDomain() {
      let that = this
      that.addOrModifyDomain = true
      that.dialogShowDomain = true
      that.buttonLoad = false
      that.titleDomain = '新建指标域信息'
      resetForm('formDomain', that)
      that.formDomain = {
        DomainFlag: '',
        DomainName: '',
        DomainDesc: ''
      }
    },
    // addAPI集合
    addDomain() {
      let that = this
      that.$refs['formDomain'].validate(valid => {
        if (valid) {
          let params = that.formDomain
          params.id = ''
          that.buttonLoad = true
          request({ url: '/data_indicator_organization/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowDomain = false
                that.getDomainData()
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
    seeDomain(row) {
      let that = this
      that.addOrModifyDomain = false
      that.dialogShowDomain = true
      that.buttonLoad = false
      that.titleDomain = '修改指标域信息    [' + row.indicatorDomainName + ']'
      resetForm('formDomain', that)
      that.$nextTick(() => {
        that.formDomain = { ...row }
      })
    },
    modifyDomain() {
      let that = this
      that.$refs['formDomain'].validate(valid => {
        if (valid) {
          let params = that.formDomain
          that.buttonLoad = true
          request({ url: '/data_indicator_organization/update', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowDomain = false
                that.getDomainData()
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
    // 删除指标域
    cancelDomain(row) {
      let that = this
      that
        .$confirm('是否确定删除[' + row.indicatorDomainName + ']指标域?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/data_indicator_organization/delete', method: 'post', data: { id: row.id } }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getDomainData()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
