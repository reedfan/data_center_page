<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain dataSource">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-plus" @click="newWord()">新建衍生词</el-button>
        </div>
      </div>
    </div>
    <div class="main-unit" style="width: calc(100% - 48px); height: calc(100% - 95px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
      <el-table v-loading="loadingWord" element-loading-text="数据加载中" class="data-table" ref="table" :data="WordData" stripe :height="this.$store.state.globalHeight - 285">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="derivedWordsName" label="衍生词名称" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="derivedWordsFlag" label="衍生词标识" min-width="80" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="derivedWordsStatus" label="状态" min-width="60" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.derivedWordsStatus == 'PUBLISHED'" type="success">已发布</el-tag>
            <el-tag v-if="scope.row.derivedWordsStatus == 'DRAFT'" type="primary">草稿</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="derivedWordsCalculationCaliber" label="计算口径" min-width="140" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createBy" label="创建人" min-width="60" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="80" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <p class="tableAction" @click="publishWord(scope.row)" v-if="scope.row.derivedWordsStatus == 'DRAFT'">发布</p>
            <p class="tableAction" @click="unpublishWord(scope.row)" v-if="scope.row.derivedWordsStatus == 'PUBLISHED'">取消发布</p>
            <p class="tableAction" @click="seeWord(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelWord(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getWordData"> </pagination>
    </div>
    <el-dialog :title="titleWord" :visible.sync="dialogShowWord" width="550px">
      <el-form :model="formWord" ref="formWord" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="衍生词名称：" :required="true" prop="derivedWordsName">
                <el-input v-model.trim="formWord.derivedWordsName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="衍生词标识：" :required="true" prop="derivedWordsFlag">
                <el-input v-model.trim="formWord.derivedWordsFlag" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" placeholder="仅支持数字、字母、_"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="计算口径：" :required="true" prop="derivedWordsCalculationCaliber">
                <el-input v-model.trim="formWord.derivedWordsCalculationCaliber" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowWord = false" style="width: 120px">取 消</el-button>
        <el-button type="primary" v-if="addOrModifyWord" @click="addWord()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyWord" @click="modifyWord()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 120px">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'derivativeWords',
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
      WordData: [],
      loadingWord: true,

      formWord: {
        derivedWordsName: '',
        derivedWordsFlag: '',
        derivedWordsCalculationCaliber: '',
        derivedWordsStatus: ''
      },
      dialogShowWord: false,
      titleWord: '',
      addOrModifyWord: true
    }
  },
  mounted() {
    this.getWordData()
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
    getWordData() {
      let that = this
      that.loadingWord = true
      request({ url: '/data_indicators_calculation_caliber/list', method: 'get', params: { page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.WordData = res.data.list || []
        that.loadingWord = false
        that.queryForm.total = res.data.total || 0
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 新建API集合
    newWord() {
      let that = this
      that.addOrModifyWord = true
      that.dialogShowWord = true
      that.buttonLoad = false
      that.titleWord = '新建衍生词信息'
      resetForm('formWord', that)
      that.formWord = {
        derivedWordsName: '',
        derivedWordsFlag: '',
        derivedWordsCalculationCaliber: '',
        derivedWordsStatus: 'DRAFT'
      }
    },
    // addAPI集合
    addWord() {
      let that = this
      that.$refs['formWord'].validate(valid => {
        if (valid) {
          let params = that.formWord
          params.id = ''
          that.buttonLoad = true
          request({ url: '/data_indicators_calculation_caliber/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowWord = false
                that.getWordData()
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
    seeWord(row) {
      let that = this
      that.addOrModifyWord = false
      that.dialogShowWord = true
      that.buttonLoad = false
      that.titleWord = '修改衍生词信息    [' + row.derivedWordsName + ']'
      resetForm('formWord', that)
      that.$nextTick(() => {
        that.formWord = { ...row }
      })
    },
    modifyWord() {
      let that = this
      that.$refs['formWord'].validate(valid => {
        if (valid) {
          let params = that.formWord
          that.buttonLoad = true
          request({ url: '/data_indicators_calculation_caliber/update', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowWord = false
                that.getWordData()
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
    // 发布衍生词
    publishWord(row) {
      let that = this
      that
        .$confirm('是否确定发布[' + row.derivedWordsName + ']衍生词?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let params = { ...row }
          params.derivedWordsStatus = 'PUBLISHED'
          request({ url: '/data_indicators_calculation_caliber/update', method: 'post', data: { ...params } }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getWordData()
          })
        })
        .catch(() => {})
    },
    // 取消发布衍生词
    unpublishWord(row) {
      let that = this
      that
        .$confirm('是否确定取消发布[' + row.derivedWordsName + ']衍生词?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let params = { ...row }
          params.derivedWordsStatus = 'DRAFT'
          request({ url: '/data_indicators_calculation_caliber/update', method: 'post', data: { ...params } }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getWordData()
          })
        })
        .catch(() => {})
    },
    // 删除衍生词
    cancelWord(row) {
      let that = this
      that
        .$confirm('是否确定删除[' + row.derivedWordsName + ']衍生词?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/data_indicators_calculation_caliber/delete', method: 'post', data: { id: row.id } }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getWordData()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
