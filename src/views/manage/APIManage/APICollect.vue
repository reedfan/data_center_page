<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain dataSource">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-plus" @click="newCollect()">新建API集合</el-button>
        </div>
      </div>
    </div>
    <div class="main-unit" style="width: calc(100% - 48px); height: calc(100% - 95px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
      <el-table v-loading="loadingCollect" element-loading-text="数据加载中" class="data-table" ref="table" :data="CollectData" stripe :height="this.$store.state.globalHeight - 285">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="collectionName" label="集合名称" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="collectionPath" label="集合path" min-width="80" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createBy" label="创建人" min-width="60" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="80" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="collectionDesc" label="描述" min-width="140" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="seeCollect(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelCollect(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getCollectData"> </pagination>
    </div>
    <el-dialog :title="titleCollect" :visible.sync="dialogShowCollect" width="550px">
      <el-form :model="formCollect" ref="formCollect" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="集合名称：" :required="true" prop="collectionName">
                <el-input v-model.trim="formCollect.collectionName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="集合path：" :required="true" prop="collectionPath">
                <el-input v-model.trim="formCollect.collectionPath" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" placeholder="仅支持数字、字母、_"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述：" :required="true" prop="collectionDesc">
                <el-input v-model.trim="formCollect.collectionDesc" autocomplete="off" type="textarea" :autosize="{ minRows: 3, maxRows: 100 }"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowCollect = false" style="width: 120px">取 消</el-button>
        <el-button type="primary" v-if="addOrModifyCollect" @click="addCollect()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyCollect" @click="modifyCollect()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'APICollect',
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
      CollectData: [],
      loadingCollect: true,

      formCollect: {
        collectionName: '',
        collectionPath: '',
        collectionDesc: ''
      },
      dialogShowCollect: false,
      titleCollect: '',
      addOrModifyCollect: true
    }
  },
  mounted() {
    this.getCollectData()
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
    getCollectData() {
      let that = this
      that.loadingCollect = true
      request({ url: '/auto_api/collection/list', method: 'get', params: {} }).then(res => {
        that.CollectData = res.data || []
        that.loadingCollect = false
        that.queryForm.total = res.data ? res.data.length : 0
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 新建API集合
    newCollect() {
      let that = this
      that.addOrModifyCollect = true
      that.dialogShowCollect = true
      that.buttonLoad = false
      that.titleCollect = '新建集合信息'
      resetForm('formCollect', that)
    },
    // addAPI集合
    addCollect() {
      let that = this
      that.$refs['formCollect'].validate(valid => {
        if (valid) {
          let params = that.formCollect
          // params.id = ''
          that.buttonLoad = true
          request({ url: '/auto_api/collection/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowCollect = false
                that.getCollectData()
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
    seeCollect(row) {
      let that = this
      request({ url: '/auto_api/collection/get_by_id', method: 'get', params: { id: row.id } }).then(res => {
        that.addOrModifyCollect = false
        that.dialogShowCollect = true
        that.buttonLoad = false
        that.titleCollect = '修改集合信息    [' + row.collectionName + ']'
        resetForm('formCollect', that)
        that.$nextTick(() => {
          that.formCollect = res.data
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
