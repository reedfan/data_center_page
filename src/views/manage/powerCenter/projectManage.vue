<template>
  <div class="manageMain derivativeProjects">
    <div class="buttonArea">
      <el-button icon="el-icon-plus" type="primary" @click="newProject()" size="mini">新建项目</el-button>
    </div>

    <div class="tableArea">
      <el-table v-loading="loadingProject" element-loading-text="数据加载中" ref="table" :data="dataProject" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="projectName" label="项目名称" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="projectDesc" label="项目描述" min-width="280" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createBy" label="创建人" min-width="60" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="80" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="340">
          <template slot-scope="scope">
            <p class="tableAction" @click="seeProject(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelProject(scope.row)">删除</p>
            <p class="tableAction" @click="showOwner(scope.row)">成员管理</p>
            <p class="tableAction" @click="showAPI(scope.row)">已关联API</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="titleProject" :visible.sync="dialogShowProject" width="550px">
      <el-form :model="formProject" ref="formProject" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="项目名称：" :required="true" prop="projectName">
                <el-input v-model.trim="formProject.projectName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="项目描述" :required="true" prop="projectDesc">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 100 }" v-model.trim="formProject.projectDesc" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowProject = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" v-if="addOrModifyProject" @click="addProject()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyProject" @click="modifyProject()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="成员管理" :visible.sync="dialogShowOwner" width="850px">
      <el-form :model="formOwner" ref="formOwner" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="20">
              <el-form-item label="选择成员：" :required="true" prop="ownerId">
                <el-select v-model="formOwner.ownerId" placeholder="" filterable>
                  <el-option v-for="(item, index) in userList" :key="index" :label="item.account + '[' + item.fullName + ']'" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" style="width: 100px" @click="addOwner"> 添加 </el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <el-table v-loading="loadingOwner" element-loading-text="数据加载中" ref="tableOwner" :data="ownerList" style="width: 98%; margin: 20px auto">
        <el-table-column prop="projectOwner" label="账号" min-width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ tranUser(scope.row).account }}
          </template>
        </el-table-column>
        <el-table-column prop="projectOwner" label="真实姓名" min-width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ tranUser(scope.row).fullName }}
          </template>
        </el-table-column>
        <el-table-column prop="projectOwner" label="手机号" min-width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ tranUser(scope.row).phone }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <p class="tableActionDanger" @click="cancelOwner(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="已关联的API" :visible.sync="dialogShowAPI" width="950px">
      <el-table v-loading="loadingAPI" element-loading-text="数据加载中" ref="tableAPI" :data="APIList" style="width: 98%; margin: 20px auto">
        <el-table-column prop="apiName" label="API名称" min-width="150" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="apiPath" label="API Path" min-width="150" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="apiMethod" label="请求方式" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createdBy" label="创建人" min-width="150" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createdTime" label="创建时间" min-width="150" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="apiDesc" label="描述" min-width="200" align="center" show-overflow-tooltip> </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'projectManage',
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

      dataProject: [],
      loadingProject: true,

      formProject: {
        derivedProjectsName: '',
        derivedProjectsFlag: '',
        derivedProjectsCalculationCaliber: '',
        derivedProjectsStatus: ''
      },
      dialogShowProject: false,
      titleProject: '',
      addOrModifyProject: true,

      dialogShowOwner: false,
      formOwner: {
        ownerId: '',
        projectId: ''
      },
      ownerList: [],
      loadingOwner: false,
      userList: [],

      dialogShowAPI: false,
      APIList: [],
      loadingAPI: false
    }
  },
  mounted() {
    this.getDataProject()
    this.getUserList()
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
    // 获取项目数据
    getDataProject() {
      let that = this
      that.loadingProject = true
      request({ url: '/project_info/get_by_user_id', method: 'get', params: { userId: that.$store.state.userInfo.id } }).then(res => {
        that.dataProject = res.data || []
        that.loadingProject = false
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    getUserList() {
      let that = this
      request({ url: '/admin/list', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.userList = res.data.list || []
      })
    },
    // 新建项目
    newProject() {
      let that = this
      that.addOrModifyProject = true
      that.dialogShowProject = true
      that.buttonLoad = false
      that.titleProject = '新建项目信息'
      resetForm('formProject', that)
      that.formProject = {
        derivedProjectsName: '',
        derivedProjectsFlag: '',
        derivedProjectsCalculationCaliber: '',
        derivedProjectsStatus: 'DRAFT'
      }
    },
    // add项目
    addProject() {
      let that = this
      that.$refs['formProject'].validate(valid => {
        if (valid) {
          let params = that.formProject
          params.projectOwner = that.$store.state.userInfo.id
          params.id = ''
          that.buttonLoad = true
          request({ url: '/project_info/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowProject = false
                that.getDataProject()
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
    seeProject(row) {
      let that = this
      that.addOrModifyProject = false
      that.dialogShowProject = true
      that.buttonLoad = false
      that.titleProject = '修改项目信息    [' + row.projectName + ']'
      resetForm('formProject', that)
      that.$nextTick(() => {
        that.formProject = { ...row }
      })
    },
    modifyProject() {
      let that = this
      that.$refs['formProject'].validate(valid => {
        if (valid) {
          let params = that.formProject
          that.buttonLoad = true
          request({ url: '/project_info/update', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowProject = false
                that.getDataProject()
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

    // 删除项目
    cancelProject(row) {
      let that = this
      that
        .$confirm('是否确定删除[' + row.projectName + ']项目?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/project_info/delete', method: 'post', data: { projectId: row.projectId } }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getDataProject()
          })
        })
        .catch(() => {})
    },
    showOwner(row) {
      let that = this
      that.dialogShowOwner = true
      that.buttonLoad = false
      resetForm('formOwner', that)
      that.formOwner.projectId = row.projectId
      that.getOwner(row.projectId)
    },
    getOwner(projectId) {
      let that = this
      that.loadingOwner = true
      request({ url: '/project_info/get_by_project_id', method: 'get', params: { projectId: projectId } }).then(res => {
        that.ownerList = res.data || []
        that.loadingOwner = false
        setTimeout(() => {
          that.$refs.tableOwner.doLayout()
        }, 300)
      })
    },
    addOwner() {
      let that = this
      that.$refs['formOwner'].validate(valid => {
        if (valid) {
          let params = {}
          params.projectId = that.formOwner.projectId
          params.userSet = [that.formOwner.ownerId]
          that.buttonLoad = true
          request({ url: '/project_info/append_user', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.getOwner(that.formOwner.projectId)
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
    cancelOwner(row) {
      let that = this
      that
        .$confirm('是否确定删除该成员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/project_info/reduce_user', method: 'post', data: { projectId: that.formOwner.projectId, userSet: [row.projectOwner] } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), that.getOwner(that.formOwner.projectId))
          })
        })
        .catch(() => {})
    },
    tranUser(row) {
      let that = this
      let user = that.userList.find(item => item.id == row.projectOwner)
      return user || {}
    },
    showAPI(row) {
      let that = this
      that.dialogShowAPI = true
      that.loadingAPI = true
      request({ url: '/project_info/get_auto_api_info_by_project_id', method: 'get', params: { projectId: row.projectId } }).then(res => {
        that.APIList = res.data.bindAutoApiInfoList || []
        that.loadingAPI = false
        setTimeout(() => {
          that.$refs.tableAPI.doLayout()
        }, 300)
      })
    }
  }
}
</script>

<style scoped>
</style>
