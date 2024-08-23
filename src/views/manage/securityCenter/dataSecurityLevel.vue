<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain securityLevel">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <!-- <i style="width: 3px; height: 18px; background: #007aff; float: left; margin-top: 12px"></i>
        <p class="searchLabel" style="width: auto; font-weight: 500; font-size: 20px; margin-left: 6px">安全等级:</p> -->
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-search" @click="getDataLevel()">查询</el-button>
        </div>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button icon="el-icon-plus" type="primary" @click="newLevel()">新建安全等级</el-button>
        </div>
      </div>
    </div>
    <div class="main-unit" style="width: calc(100% - 48px); height: calc(100% - 95px); position: relative; overflow: hidden auto; margin: 5px auto 0 auto">
      <div class="levelUnit" v-for="(item, index) in dataLevel" :key="index">
        <div class="imgUnit">
          <el-image style="width: 100% height: 100%" :src="item.levelImg"></el-image>
        </div>
        <div class="textUnit">
          <p>{{ item.securityLevel }}</p>
          <p>描述：{{ item.levelDesc }}</p>
          <p>操作人：{{ item.createBy }} &nbsp;&nbsp;&nbsp;&nbsp;更新时间：{{ item.createTime }}</p>
        </div>
        <i class="el-icon-edit" @click="seeLevel(item)"></i>
        <i class="el-icon-close" @click="cancelLevel(item)"></i>
      </div>
      <el-empty style="width: 100%; height: 100%" description="暂无数据" v-if="dataLevel.length == 0"></el-empty>
    </div>

    <el-dialog :title="titleLevel" :visible.sync="formShowLevel" width="550px">
      <el-form :model="formLevel" ref="formLevel" label-width="140px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="安全等级名称：" :required="true" prop="securityLevel">
                <el-input v-model.trim="formLevel.securityLevel" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="等级图片：" :required="true" prop="levelImg">
                <el-input v-model="formLevel.levelImg" autocomplete="off" placeholder="" disabled>
                  <el-upload slot="append" class="upload-demo" action="#" :http-request="upload" ref="my-upload" accept=".png,.jpg,.jpeg" :before-upload="beforeUpload" :limit="1">
                    <el-button type="primary" icon="el-icon-upload2">上传</el-button>
                  </el-upload>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述：" :required="true" prop="levelDesc">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model.trim="formLevel.levelDesc" autocomplete="off" maxlength="100" show-word-limit> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShowLevel = false" style="width: 120px">取 消</el-button>
        <el-button type="primary" v-if="addOrModifyLevel" @click="addLevel()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyLevel" @click="modifyLevel()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { resetForm, Notify, uploadUrl } from '@/api/common'
import request from '@/api/request'

export default {
  name: 'level',

  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      queryForm: {
        pageSize: 10,
        page: 1,
        total: 0
      },

      buttonLoad: false,
      loadingLevel: false,
      dataLevel: [],

      formLevel: {
        securityLevel: '',
        levelImg: '',
        levelDesc: ''
      },

      formShowLevel: false,
      titleLevel: '',
      addOrModifyLevel: true,
      uploadUrl: uploadUrl()
    }
  },
  mounted() {
    this.getDataLevel()
  },
  methods: {
    // 获取分层数据
    getDataLevel() {
      let that = this
      that.loadingLevel = true
      request({ url: '/security_level_info/list', method: 'get', params: {} }).then(res => {
        that.dataLevel = res.data || []
        that.loadingLevel = false
      })
    },
    // 新建分层
    newLevel() {
      let that = this
      that.addOrModifyLevel = true
      that.formShowLevel = true
      that.buttonLoad = false
      that.titleLevel = '新建安全等级信息'
      resetForm('formLevel', that)
    },
    // add分层
    addLevel() {
      let that = this
      that.$refs['formLevel'].validate(valid => {
        if (valid) {
          let params = { ...that.formLevel }
          that.buttonLoad = true
          request({ url: '/security_level_info/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.formShowLevel = false
                that.getDataLevel()
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
    seeLevel(row) {
      let that = this
      request({ url: '/security_level_info/get', method: 'get', params: { id: row.id } }).then(res => {
        that.addOrModifyLevel = false
        that.formShowLevel = true
        that.buttonLoad = false
        that.titleLevel = '修改安全等级信息    [' + row.securityLevel + ']'
        resetForm('formLevel', that)
        if (res.data.parentId == 0) {
          that.parentOrChild = 'parent'
        } else {
          that.parentOrChild = 'child'
        }
        that.$nextTick(() => {
          that.formLevel = res.data
        })
      })
    },
    modifyLevel() {
      let that = this
      that.$refs['formLevel'].validate(valid => {
        if (valid) {
          let params = { ...that.formLevel }
          that.buttonLoad = true
          request({ url: '/security_level_info/update', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.formShowLevel = false
                that.getDataLevel()
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
    cancelLevel(row) {
      let that = this
      this.$confirm('是否删除[' + row.securityLevel + ']安全等级信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {}
          params.id = row.id
          request({
            url: '/security_level_info/delete',
            method: 'POST',
            data: params
          }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getDataLevel()
          })
        })
        .catch(() => {})
    },
    upload(options) {
      let file = options.file
      const formData = new FormData()
      formData.append('file', file)
      request({
        url: '/file/upload',
        method: 'post',
        data: formData
      })
        .then(res => {
          if (res.code == 200) {
            Notify('success', '上传成功')
            this.formLevel.levelImg = res.data
            this.$refs['my-upload'].clearFiles()
          } else {
            Notify('error', '上传失败')
          }
        })
        .catch(() => {
          this.$refs['my-upload'].clearFiles()
        })
      return false
    },
    beforeUpload(file) {
      let isLt200M = file.size / 1024 / 1024 < 200
      if (!isLt200M) {
        Notify('error', '[' + file.name + '] 大小超过200MB ')
      }
      return isLt200M
    }
  }
}
</script>

<style scoped>
</style>
