<template>
  <div class="manageMain manageMainNoBack level">
    <!-- <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <i style="width: 3px; height: 18px; background: #007aff; float: left; margin-top: 12px"></i>
        <p class="searchLabel" style="width: auto; font-weight: 500; font-size: 20px; margin-left: 6px">系统分层:</p>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button icon="el-icon-plus" type="primary" @click="newLevel()">新建分层</el-button>
        </div>
      </div>
    </div> -->
    <div style="width: 100%; height: 100%; overflow: hidden auto">
      <div style="width: 100%; height: auto; position: relative; border-radius: 1.5px; overflow: hidden; margin: 5px auto 0 auto; background: #ffffff; padding: 14px 6px 25px 6px">
        <p style="width: auto; font-size: 14px; height: 20px; line-height: 20px; margin-left: 10px">系统分层</p>
        <el-row :gutter="20" style="width: 100%; margin: 6px auto 0 auto" v-loading="loadingLevel">
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="{ span: '4-8' }" v-for="(item, index) in dataLevel" :key="index">
            <div class="levelUnit">
              <p>{{ item.layerName }}-{{ item.layerFlag }}</p>
              <p>{{ item.layerDesc }}</p>
              <p class="tableAction" @click="seeLevel(item)">编辑</p>
              <p class="tableActionDanger" @click="cancelLevel(item)">删除</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="width: 100%; height: auto; position: relative; border-radius: 1.5px; margin: 15px auto 0 auto; background: #ffffff; padding: 14px 6px 25px 6px">
        <p style="width: auto; font-size: 14px; height: 20px; line-height: 20px; margin-left: 10px">自定义分层</p>
        <el-row :gutter="20" style="width: 100%; margin: 6px auto 0 auto" v-loading="loadingLevel">
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="{ span: '4-8' }">
            <div class="addLevelUnit" @click="newLevel()">
              <i class="el-icon-plus"></i>
              <p>新建自定义分层</p>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="{ span: '4-8' }" v-for="(item, index) in dataLevel" :key="index">
            <div class="levelUnit">
              <p>{{ item.layerName }}-{{ item.layerFlag }}</p>
              <p>{{ item.layerDesc }}</p>
              <p class="tableAction" @click="seeLevel(item)">编辑</p>
              <p class="tableActionDanger" @click="cancelLevel(item)">删除</p>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="{ span: '4-8' }" v-for="(item, index) in dataLevel" :key="index">
            <div class="levelUnit">
              <p>{{ item.layerName }}-{{ item.layerFlag }}</p>
              <p>{{ item.layerDesc }}</p>
              <p class="tableAction" @click="seeLevel(item)">编辑</p>
              <p class="tableActionDanger" @click="cancelLevel(item)">删除</p>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="{ span: '4-8' }" v-for="(item, index) in dataLevel" :key="index">
            <div class="levelUnit">
              <p>{{ item.layerName }}-{{ item.layerFlag }}</p>
              <p>{{ item.layerDesc }}</p>
              <p class="tableAction" @click="seeLevel(item)">编辑</p>
              <p class="tableActionDanger" @click="cancelLevel(item)">删除</p>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="{ span: '4-8' }" v-for="(item, index) in dataLevel" :key="index">
            <div class="levelUnit">
              <p>{{ item.layerName }}-{{ item.layerFlag }}</p>
              <p>{{ item.layerDesc }}</p>
              <p class="tableAction" @click="seeLevel(item)">编辑</p>
              <p class="tableActionDanger" @click="cancelLevel(item)">删除</p>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="{ span: '4-8' }" v-for="(item, index) in dataLevel" :key="index">
            <div class="levelUnit">
              <p>{{ item.layerName }}-{{ item.layerFlag }}</p>
              <p>{{ item.layerDesc }}</p>
              <p class="tableAction" @click="seeLevel(item)">编辑</p>
              <p class="tableActionDanger" @click="cancelLevel(item)">删除</p>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="{ span: '4-8' }" v-for="(item, index) in dataLevel" :key="index">
            <div class="levelUnit">
              <p>{{ item.layerName }}-{{ item.layerFlag }}</p>
              <p>{{ item.layerDesc }}</p>
              <p class="tableAction" @click="seeLevel(item)">编辑</p>
              <p class="tableActionDanger" @click="cancelLevel(item)">删除</p>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="{ span: '4-8' }" v-for="(item, index) in dataLevel" :key="index">
            <div class="levelUnit">
              <p>{{ item.layerName }}-{{ item.layerFlag }}</p>
              <p>{{ item.layerDesc }}</p>
              <p class="tableAction" @click="seeLevel(item)">编辑</p>
              <p class="tableActionDanger" @click="cancelLevel(item)">删除</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-dialog :title="titleLevel" :visible.sync="formShowLevel" width="550px">
      <el-form :model="formLevel" ref="formLevel" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="分层名称：" :required="true" prop="layerName">
                <el-input v-model.trim="formLevel.layerName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="英文标识：" :required="true" prop="layerFlag">
                <el-input v-model.trim="formLevel.layerFlag" oninput="value=value.replace(/[^\w_]/g,'')" placeholder="仅支持数字、字母、_" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述：" :required="true" prop="layerDesc">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model.trim="formLevel.layerDesc" autocomplete="off"> </el-input>
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
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'level',
  components: {
    pagination
  },
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
        layerName: '',
        layerFlag: '',
        layerDesc: ''
      },

      formShowLevel: false,
      titleLevel: '',
      addOrModifyLevel: true
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
      request({ url: '/datawarehouseLayer/getList', method: 'post', params: { page: 1, pageSize: 1000 } }).then(res => {
        that.dataLevel = res.data.list || []
        that.queryForm.total = res.data.total || 0
        that.loadingLevel = false
      })
    },
    // 新建分层
    newLevel() {
      let that = this
      that.addOrModifyLevel = true
      that.formShowLevel = true
      that.buttonLoad = false
      that.titleLevel = '新建分层信息'
      resetForm('formLevel', that)
    },
    // add分层
    addLevel() {
      let that = this
      that.$refs['formLevel'].validate(valid => {
        if (valid) {
          let params = { ...that.formLevel }
          that.buttonLoad = true
          request({ url: '/datawarehouseLayer/add', method: 'post', data: params })
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
      request({ url: '/datawarehouseLayer/getOneDataLayer', method: 'get', params: { id: row.id } }).then(res => {
        that.addOrModifyLevel = false
        that.formShowLevel = true
        that.buttonLoad = false
        that.titleLevel = '修改分层信息    [' + row.layerName + ']'
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
          request({ url: '/datawarehouseLayer/updateDataLayer', method: 'post', data: params })
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
      this.$confirm('是否删除[' + row.layerName + ']分层信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {}
          params.id = row.id
          request({
            url: '/datawarehouseLayer/deleteDataLayer',
            method: 'POST',
            data: params
          }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getDataLevel()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
