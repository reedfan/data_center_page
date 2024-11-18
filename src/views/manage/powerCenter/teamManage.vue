<template>
  <div class="manageMain teamManage">
    <div class="buttonArea">
      <el-button icon="el-icon-plus" type="primary" @click="newXMZ()" size="mini">新建项目组</el-button>
    </div>

    <div class="tableArea">
      <el-table v-loading="loadingXMZ" element-loading-text="数据加载中" ref="table" :data="XMZData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>

        <el-table-column prop="projectGroupName" label="项目组名称" min-width="250" align="left"> </el-table-column>
        <el-table-column prop="projectGroupHivePath" label="HivePath" min-width="200" align="left"> </el-table-column>
        <el-table-column prop="projectGroupHiveDataBase" label="HiveDataBase" min-width="200" align="left"> </el-table-column>
        <el-table-column prop="projectGroupDesc" label="描述" min-width="300" align="left" show-overflow-tooltip=""> </el-table-column>
        <el-table-column prop="createBy" label="创建人" min-width="130" align="left"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="150" align="left"> </el-table-column>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="showAddUser(scope.row)">添加成员</p>
            <p class="tableAction" @click="showUser(scope.row)">查看成员</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getXMZData"> </pagination>
    </div>
    <el-dialog :title="titleXMZ" :visible.sync="formShowXMZ" width="530px">
      <el-form :model="formXMZ" ref="formXMZ" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="负责人：" :required="true" prop="projectGroupOwnerId">
                <!-- <el-input v-model.trim="formXMZ.projectGroupOwnerId" autocomplete="off"> </el-input> -->
                <!-- <el-autocomplete v-model="formXMZ.projectGroupOwnerId" :fetch-suggestions="queryUser" placeholder="" autocomplete="off"></el-autocomplete> -->
                <el-select v-model="formXMZ.projectGroupOwnerId" filterable remote reserve-keyword placeholder="" :remote-method="queryUser" :loading="loadingUser" loading-text="请输入用户名邮箱手机号等">
                  <el-option v-for="item in userList" :key="item.id" :label="item.account + '(' + item.fullName + ')'" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="名称：" :required="true" prop="projectGroupName">
                <el-input v-model.trim="formXMZ.projectGroupName" @change="formXMZ.projectGroupHiveDataBase = formXMZ.projectGroupName" oninput="value=value.replace(/[^\w_]/g,'')" placeholder="仅支持数字、字母、_" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="HiveDataBase：" :required="true" prop="projectGroupHiveDataBase">
                <el-input v-model.trim="formXMZ.projectGroupHiveDataBase" oninput="value=value.replace(/[^\w_]/g,'')" placeholder="仅支持数字、字母、_" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="HivePath：" :required="true" prop="projectGroupHivePath">
                <el-input v-model.trim="formXMZ.projectGroupHivePath" oninput="value=value.replace(/[^\w_/]/g,'')" placeholder="仅支持数字、字母、_和 /" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述：" :required="true" prop="projectGroupDesc">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model.trim="formXMZ.projectGroupDesc" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShowXMZ = false" style="width: 100px" size="mini">取消</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="addOrModifyXMZ" @click="addXMZ()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="!addOrModifyXMZ" @click="modifyXMZ()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加成员" :visible.sync="formShowTJCY" width="530px">
      <el-form :model="formTJCY" ref="formTJCY" label-width="100px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="成员：" :required="true" prop="userInfoId">
                <el-select v-model="formTJCY.userInfoId" filterable remote reserve-keyword placeholder="" :remote-method="queryUser" :loading="loadingUser" loading-text="请输入用户名邮箱手机号等">
                  <el-option v-for="item in userList" :key="item.id" :label="item.account + '(' + item.fullName + ')'" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShowTJCY = false" style="width: 100px" size="mini">取消</el-button>
        <el-button type="primary" style="width: 100px" size="mini" @click="addUserToProjectGroup()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="项目组成员" :visible.sync="dialogShowUser" width="1200px">
      <el-table v-loading="loadingUser" element-loading-text="数据加载中" style="margin: 10px auto" class="data-table" ref="tableUser" :data="tableUser" border stripe height="600">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>

        <el-table-column prop="account" label="账号" min-width="180" align="center"> </el-table-column>
        <el-table-column prop="fullName" label="真实姓名" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" min-width="100"> </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="120" align="center"> </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'projectGroup',
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
      XMZData: [],
      loadingXMZ: true,

      userList: [],
      loadingUser: true,

      formXMZ: {
        projectGroupOwnerId: '',
        projectGroupName: '',
        projectGroupHivePath: '',
        projectGroupHiveDataBase: '',
        projectGroupDesc: ''
      },
      formShowXMZ: false,
      titleXMZ: '',
      addOrModifyXMZ: true,

      formTJCY: {
        userInfoId: '',
        projectGroupId: ''
      },
      formShowTJCY: false,

      dialogShowUser: false,
      tableUser: [],
      loadingUser: false
    }
  },
  mounted() {
    this.getXMZData()
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
    // 获取用户数据
    getXMZData() {
      let that = this
      that.loadingXMZ = true
      request({ url: '/project_group_info/list', method: 'get', params: { page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.XMZData = res.data.list || []
        that.queryForm.total = res.data.total || 0
        that.loadingXMZ = false
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 新建用户
    newXMZ() {
      let that = this
      that.addOrModifyXMZ = true
      that.formShowXMZ = true
      that.buttonLoad = false
      that.titleXMZ = '新建项目组信息'
      that.userList = []
      that.$nextTick(() => {
        resetForm('formXMZ', that)
      })
    },

    // add用户
    addXMZ() {
      let that = this
      that.$refs['formXMZ'].validate(valid => {
        if (valid) {
          let params = that.formXMZ
          that.buttonLoad = true
          request({ url: '/project_group_info/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowXMZ = false))
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
    queryUser(queryString) {
      let that = this
      that.loadingUser = true
      request({ url: '/user/info', method: 'get', params: { searchParam: queryString } }).then(res => {
        if (res.data) {
          that.userList = [res.data]
        } else {
          that.userList = []
        }
        that.loadingUser = false
      })
    },
    showAddUser(row) {
      let that = this
      that.formShowTJCY = true
      that.buttonLoad = false
      that.userList = []
      that.loadingUser = true
      that.formTJCY.projectGroupId = row.id
      that.formTJCY.projectGroupName = row.projectGroupName
      that.formTJCY.userInfoId = ''
    },
    addUserToProjectGroup() {
      let that = this
      that.$refs['formTJCY'].validate(valid => {
        if (valid) {
          let params = that.formTJCY
          that.buttonLoad = true
          params.projectGroupPermissionState = true
          request({ url: '/project_group_permission/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowTJCY = false))
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
    showUser(row) {
      let that = this
      that.tableUser = []
      that.dialogShowUser = true
      that.loadingUser = true
      that.$nextTick(() => {
        request({ url: '/project_group_permission/member', method: 'get', params: { projectGroupId: row.id, page: 1, pageSize: 1000 } }).then(res => {
          that.tableUser = res.data || []
          that.loadingUser = false
          setTimeout(() => {
            that.$refs.tableUser.doLayout()
          }, 300)
        })
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
