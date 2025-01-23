<template>
  <div class="manageMain standardDictionary">
    <div class="buttonArea">
      <el-button icon="el-icon-plus" type="primary" @click="newDict()" size="mini">添加字典</el-button>
    </div>
    <div class="tableArea">
      <el-table v-loading="loadingDict" element-loading-text="数据加载中" ref="table" :data="DictData" height="100%">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="name" label="字典名称" min-width="200" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="nameEn" label="英文名称" min-width="200" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="version" label="版本" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="classificationName" label="分类" min-width="140" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="type" label="类型" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createBy" label="创建人" min-width="60" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <p class="tableAction" @click="seeDict(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelDict(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getDictData"> </pagination>
    </div>
    <el-dialog :title="titleDict" :visible.sync="dialogShowDict" width="850px">
      <el-form :model="formDict" ref="formDict" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="字典名称" :required="true" prop="name">
                <el-input v-model.trim="formDict.name" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="英文名称" :required="true" prop="nameEn">
                <el-input v-model.trim="formDict.nameEn" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="版本" :required="true" prop="version">
                <el-input v-model.trim="formDict.version" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="字典项：" prop="valueList">
                <div style="width: 100%; height: auto; min-height: 60px; margin-top: 10px">
                  <el-table border :data="formDict.valueList" class="data-table" ref="valueList" stripe :max-height="250">
                    <el-table-column prop="code" label="代码" min-width="60" align="center">
                      <template slot-scope="scope">
                        <el-form-item label=" " :required="true" :prop="'valueList.' + scope.$index + '.code'" style="margin-bottom: 0" label-width="30px">
                          <el-input v-model="scope.row.code" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="codeDesc" label="代码描述" min-width="80" align="center">
                      <template slot-scope="scope">
                        <el-form-item label=" " :required="true" :prop="'valueList.' + scope.$index + '.codeDesc'" style="margin-bottom: 0" label-width="30px">
                          <el-input v-model.number="scope.row.codeDesc" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="80" align="center">
                      <template slot-scope="scope">
                        <el-form-item label="" :prop="'valueList.' + scope.$index + '.remark'" style="margin-bottom: 0" label-width="1px">
                          <el-input v-model.number="scope.row.remark" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100">
                      <template slot-scope="scope">
                        <p class="tableActionDanger" :class="formDict.valueList.length == '1' ? 'disabledTableActionDanger' : ''" @click="formDict.valueList.length == '1' ? '' : formDict.valueList.splice(scope.$index, 1)">删除</p>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="width: 100%; height: auto; text-align: right; margin-top: 5px">
                    <el-button type="primary" @click="formDict.valueList.push({ code: '', codeDesc: '', remark: '' })" size="mini" style="width: 100px">添加</el-button>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowDict = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" v-if="addOrModifyDict" @click="addDict()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyDict" @click="modifyDict()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'standardDictionary',
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
      DictData: [],
      loadingDict: true,

      formDict: {
        name: '',
        nameEn: '',
        status: '',
        type: '',
        valueList: [{ code: '', codeDesc: '', remark: '' }]
      },
      dialogShowDict: false,
      titleDict: '',
      addOrModifyDict: true
    }
  },
  mounted() {
    this.getDictData()
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
    getDictData() {
      let that = this
      that.loadingDict = true
      request({ url: '/dictionary_info/list', method: 'get', params: { page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.DictData = res.data.list || []
        that.loadingDict = false
        that.queryForm.total = res.data.total || 0
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },

    // 新建API集合
    newDict() {
      let that = this
      that.addOrModifyDict = true
      that.dialogShowDict = true
      that.buttonLoad = false
      that.titleDict = '新建字典信息'
      resetForm('formDict', that)
      that.formDict = {
        name: '',
        nameEn: '',
        status: '新增',
        version: '1.0.0',
        type: '标准字典',
        valueList: [{ code: '', codeDesc: '', remark: '' }]
      }
    },
    // addAPI集合
    addDict() {
      let that = this
      that.$refs['formDict'].validate(valid => {
        if (valid) {
          let params = that.formDict
          params.id = ''
          that.buttonLoad = true
          request({ url: '/dictionary_info/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowDict = false
                that.getDictData()
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
    seeDict(row) {
      let that = this
      that.addOrModifyDict = false
      that.dialogShowDict = true
      that.buttonLoad = false
      that.titleDict = '修改字典信息    [' + row.name + ']'
      request({ url: '/dictionary_info/get', method: 'get', params: { id: row.id } }).then(res => {
        that.$nextTick(() => {
          that.formDict = { ...res.data }
          that.formDict.valueList = JSON.parse(res.data.value)
        })
      })
    },
    modifyDict() {
      let that = this
      that.$refs['formDict'].validate(valid => {
        if (valid) {
          let params = that.formDict
          that.buttonLoad = true
          request({ url: '/dictionary_info/update', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.dialogShowDict = false
                that.getDictData()
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

    // 删除修饰词
    cancelDict(row) {
      let that = this
      that
        .$confirm('是否确定删除[' + row.name + ']字典?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/dictionary_info/delete', method: 'post', data: { id: row.id } }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getDictData()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
