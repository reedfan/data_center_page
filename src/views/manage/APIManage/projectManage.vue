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
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <p class="tableAction" @click="seeProject(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelProject(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="titleProject" :visible.sync="dialogShowProject" width="550px">
      <el-form :model="formProject" ref="formProject" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
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
      addOrModifyProject: true
    }
  },
  mounted() {
    this.getDataProject()
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
      request({ url: '/project_info/list', method: 'get', params: {} }).then(res => {
        that.dataProject = res.data || []
        that.loadingProject = false
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
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
          request({ url: '/project_info/delete', method: 'post', data: { id: row.id } }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getDataProject()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
