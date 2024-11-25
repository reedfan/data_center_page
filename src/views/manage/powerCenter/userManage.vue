<template>
  <div class="manageMain userManage">
    <div class="buttonArea">
      <el-button icon="el-icon-plus" type="primary" @click="newYH()" size="mini">新建普通用户</el-button>
      <el-button icon="el-icon-plus" type="primary" @click="newYHA()" size="mini">新建admin用户</el-button>
    </div>
    <div class="tableArea">
      <el-table v-loading="loadingYH" element-loading-text="数据加载中" ref="table" :data="YHData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="account" label="账号" min-width="120" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="fullName" label="真实姓名" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="150" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="150" align="left"> </el-table-column>
        <el-table-column prop="adminInfo" label="类型" min-width="150" align="left">
          <template slot-scope="scope">
            <p v-if="!scope.row.adminInfo">用户</p>
            <p v-if="scope.row.adminInfo">管理员</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" v-if="!scope.row.available" @click="updateYH(scope.row, true)">启用</p>
            <p class="tableActionDanger" v-if="scope.row.available" @click="updateYH(scope.row, false)">禁用</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getYHData"> </pagination>
    </div>
    <el-dialog :title="titleYH" :visible.sync="formShowYH" width="530px">
      <el-form :model="formYH" ref="formYH" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="账号名称：" :required="true" prop="account">
                <el-input v-model.trim="formYH.account" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="密码：" :required="true" prop="password">
                <el-input v-model.trim="formYH.password" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="真实姓名：" :required="true" prop="fullName">
                <el-input v-model.trim="formYH.fullName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="手机号：" :required="true" prop="phone">
                <el-input v-model.trim="formYH.phone" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="邮箱：" :required="true" prop="email">
                <el-input v-model.trim="formYH.email" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="提醒邮箱：" :required="true" prop="alarmEmail">
                <el-input v-model.trim="formYH.alarmEmail" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShowYH = false" style="width: 100px" size="mini">取消</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="addOrModifyYH" @click="addYH()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="!addOrModifyYH" @click="modifyYH()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleYHA" :visible.sync="formShowYHA" width="530px">
      <el-form :model="formYHA" ref="formYHA" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="账号名称：" :required="true" prop="account">
                <el-input v-model.trim="formYHA.account" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="密码：" :required="true" prop="password">
                <el-input v-model.trim="formYHA.password" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="真实姓名：" :required="true" prop="fullName">
                <el-input v-model.trim="formYHA.fullName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="手机号：" :required="true" prop="phone">
                <el-input v-model.trim="formYHA.phone" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="邮箱：" :required="true" prop="email">
                <el-input v-model.trim="formYHA.email" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="提醒邮箱：" :required="true" prop="alarmEmail">
                <el-input v-model.trim="formYHA.alarmEmail" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShowYHA = false" style="width: 100px" size="mini">取消</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="addOrModifyYHA" @click="addYHA()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="!addOrModifyYHA" @click="modifyYHA()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
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
      YHData: [],
      loadingYH: true,

      formYH: {
        account: '',
        alarmEmail: '',
        email: '',
        fullName: '',
        password: '',
        phone: ''
      },
      formShowYH: false,
      titleYH: '',
      addOrModifyYH: true,
      formYHA: {
        account: '',
        alarmEmail: '',
        email: '',
        fullName: '',
        password: '',
        phone: ''
      },
      formShowYHA: false,
      titleYHA: '',
      addOrModifyYHA: true
    }
  },
  mounted() {
    this.getYHData()
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
    checkPassword(rule, value, callback) {
      var s_1_1 = '`1234567890-='
      var s_1_2 = 'qwertyuiop[]\\'
      var s_1_3 = "asdfghjkl;'"
      var s_1_4 = 'zxcvbnm,./'
      var s_2_1 = '`1234567890-='
      var s_2_2 = 'QWERTYUIOP[]\\'
      var s_2_3 = "ASDFGHJKL;'"
      var s_2_4 = 'ZXCVBNM,./'
      var s_3_1 = '~!@#$%^&*()_+'
      var s_3_2 = 'QWERTYUIOP{}|'
      var s_3_3 = 'ASDFGHJKL:"'
      var s_3_4 = 'ZXCVBNM<>?'
      var boolean = true

      for (var n = 0; n < value.length - 2; n++) {
        var char = value[n] + value[n + 1] + value[n + 2]
        if (s_1_1.indexOf(char) >= 0 || s_1_2.indexOf(char) >= 0 || s_1_3.indexOf(char) >= 0 || s_1_4.indexOf(char) >= 0 || s_2_1.indexOf(char) >= 0 || s_2_2.indexOf(char) >= 0 || s_2_3.indexOf(char) >= 0 || s_2_4.indexOf(char) >= 0 || s_3_1.indexOf(char) >= 0 || s_3_2.indexOf(char) >= 0 || s_3_3.indexOf(char) >= 0 || s_3_4.indexOf(char) >= 0) {
          boolean = false
          break
        }
      }
      console.log(boolean)
      if (boolean == true) {
        callback()
      }
      callback(new Error('密码中键盘顺序字符不得超过三个,请重新输入'))
    },

    // 获取用户数据
    getYHData() {
      let that = this
      that.loadingYH = true
      request({ url: '/admin/list', method: 'get', params: { page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.YHData = res.data.list || []
        that.queryForm.total = res.data.total || 0
        that.loadingYH = false
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 新建用户
    newYH() {
      let that = this
      that.addOrModifyYH = true
      that.formShowYH = true
      that.buttonLoad = false
      that.titleYH = '新建用户信息'
      that.$nextTick(() => {
        resetForm('formYH', that)
      })
    },

    // add用户
    addYH() {
      let that = this
      that.$refs['formYH'].validate(valid => {
        if (valid) {
          let regex4 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
          if (!regex4.test(that.formYH.password)) {
            return Notify('error', '密码应该是数字、大小写字母、特殊字符的8位组合,请重新输入！')
          }
          let params = that.formYH
          params.adminInfo = false
          that.buttonLoad = true
          request({ url: 'admin/user/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowYH = false), that.getYHData())
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
    // 新建用户
    newYHA() {
      let that = this
      that.addOrModifyYHA = true
      that.formShowYHA = true
      that.buttonLoad = false
      that.titleYHA = '新建admin用户信息'
      that.$nextTick(() => {
        resetForm('formYHA', that)
      })
    },

    // add用户
    addYHA() {
      let that = this
      that.$refs['formYHA'].validate(valid => {
        if (valid) {
          let regex4 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
          if (!regex4.test(that.formYHA.password)) {
            return Notify('error', '密码应该是数字、大小写字母、特殊字符的8位组合,请重新输入！')
          }

          let params = that.formYHA
          params.adminInfo = true
          that.buttonLoad = true
          request({ url: 'admin/user/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowYHA = false), that.getYHData())
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
    updateYH(row, status) {
      let that = this
      that
        .$confirm('是否' + (status ? '启用' : '禁用') + '[' + row.account + ']账号?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/admin/user/forbid', method: 'post', data: { id: row.id, available: status } }).then(res => {
            res.code == 200 && Notify('success', res.message || status ? '启用成功' : '禁用成功')
            that.getYHData()
          })
        })
        .catch(() => {})
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
