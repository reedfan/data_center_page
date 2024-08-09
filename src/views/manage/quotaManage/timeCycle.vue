<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain dataSource">
    <div class="main-unit" style="width: calc(100% - 48px); height: 90px; position: relative; overflow: hidden">
      <div style="width: 96%; height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button icon="el-icon-plus" type="primary" @click="newCycle()">新建周期</el-button>
        </div>
      </div>
    </div>
    <div class="main-unit" style="width: calc(100% - 48px); height: calc(100% - 95px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
      <el-table v-loading="loadingCycle" element-loading-text="数据加载中" class="data-table" ref="table" :data="CycleData" stripe :height="this.$store.state.globalHeight - 285">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="cycleName" label="周期名称" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="cycleFlag" label="周期标识" min-width="80" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="cycleDesc" label="周期说明" min-width="140" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createBy" label="创建人" min-width="60" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="80" align="left" show-overflow-tooltip> </el-table-column>

        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <p class="tableAction" @click="seeCycle(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelCycle(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getCycleData"> </pagination>
    </div>
    <el-dialog :title="titleCycle" :visible.sync="dialogShowCycle" width="550px">
      <el-form :model="formCycle" ref="formCycle" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="周期名称：" :required="true" prop="cycleName">
                <el-input v-model.trim="formCycle.cycleName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="周期标识：" :required="true" prop="cycleFlag">
                <el-input v-model.trim="formCycle.cycleFlag" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" placeholder="仅支持数字、字母、_"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="周期说明：" :required="true" prop="cycleDesc">
                <el-input v-model="formCycle.cycleDesc" autocomplete="off" type="textarea" :autosize="{ minRows: 3, maxRows: 100 }"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowCycle = false" style="width: 120px">取 消</el-button>
        <el-button type="primary" v-if="addOrModifyCycle" @click="addCycle()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyCycle" @click="modifyCycle()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'timeCycle',
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
        pageSize: 10,
        page: 1,
        total: 0
      },
      CycleData: [],
      loadingCycle: true,

      formCycle: {
        cycleFlag: '',
        cycleName: '',
        cycleDesc: ''
      },
      dialogShowCycle: false,
      titleCycle: '',
      addOrModifyCycle: true
    }
  },
  mounted() {
    this.getCycleData()
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
    getCycleData() {
      let that = this
      that.loadingCycle = true
      request({ url: '/data_indicator_cycle/list', method: 'get', params: { page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.CycleData = res.data.list || []
        that.loadingCycle = false
        that.queryForm.total = res.data.total || 0
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 新建API集合
    newCycle() {
      let that = this
      that.addOrModifyCycle = true
      that.dialogShowCycle = true
      that.buttonLoad = false
      that.titleCycle = '新建时间周期信息'
      resetForm('formCycle', that)
      that.formCycle = {
        cycleFlag: '',
        cycleName: '',
        cycleDesc: ''
      }
    },
    // addAPI集合
    addCycle() {
      let that = this
      that.$refs['formCycle'].validate(valid => {
        if (valid) {
          let params = that.formCycle
          params.id = ''
          that.buttonLoad = true
          request({ url: '/data_indicator_cycle/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowCycle = false
                that.getCycleData()
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
    seeCycle(row) {
      let that = this
      that.addOrModifyCycle = false
      that.dialogShowCycle = true
      that.buttonLoad = false
      that.titleCycle = '修改周期信息    [' + row.cycleName + ']'
      resetForm('formCycle', that)
      that.$nextTick(() => {
        that.formCycle = { ...row }
      })
    },
    modifyCycle() {
      let that = this
      that.$refs['formCycle'].validate(valid => {
        if (valid) {
          let params = that.formCycle
          that.buttonLoad = true
          request({ url: '/data_indicator_cycle/update', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowCycle = false
                that.getCycleData()
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
    // 删除时间周期
    cancelCycle(row) {
      let that = this
      that
        .$confirm('是否确定删除[' + row.cycleName + ']时间周期?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/data_indicator_cycle/delete', method: 'post', data: { id: row.id } }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getCycleData()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
