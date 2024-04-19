<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain dataSource">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-plus" @click="newWord()">新建修饰词</el-button>
        </div>
      </div>
    </div>
    <div class="main-unit" style="width: calc(100% - 48px); height: calc(100% - 95px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
      <el-table v-loading="loadingWord" element-loading-text="数据加载中" class="data-table" ref="table" :data="WordData" stripe :height="this.$store.state.globalHeight - 285">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="modifiersType" label="修饰词类型" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="modifiersName" label="修饰词" min-width="80" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ generateModifiersName(scope.row.modifiersName) }}
          </template>
        </el-table-column>
        <el-table-column prop="modifiersDesc" label="描述" min-width="140" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createBy" label="创建人" min-width="60" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="80" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <p class="tableAction" @click="seeWord(scope.row)">修改</p>
            <p class="tableActionDanger" @click="cancelWord(scope.row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageSize="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getWordData"> </pagination>
    </div>
    <el-dialog :title="titleWord" :visible.sync="dialogShowWord" width="750px">
      <el-form :model="formWord" ref="formWord" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="修饰词类型：" :required="true" prop="modifiersType">
                <el-input v-model.trim="formWord.modifiersType" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="修饰词描述：" :required="true" prop="modifiersDesc">
                <el-input v-model.trim="formWord.modifiersDesc" autocomplete="off" type="textarea" :autosize="{ minRows: 3, maxRows: 100 }"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="修饰词：" prop="modifiersDtoList">
                <div style="width: 100%; height: auto; min-height: 60px; margin-top: 10px">
                  <el-table border :data="formWord.modifiersDtoList" class="data-table" ref="modifiersDtoList" stripe :max-height="250">
                    <el-table-column prop="modifiersName" label="修饰词名称" min-width="60" align="center">
                      <template slot-scope="scope">
                        <el-form-item label=" " :required="true" :prop="'modifiersDtoList.' + scope.$index + '.modifiersName'" style="margin-bottom: 0" label-width="30px">
                          <el-input v-model="scope.row.modifiersName" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="englishLogo" label="英文标识" min-width="60" align="center">
                      <template slot-scope="scope">
                        <el-form-item label=" " :required="true" :prop="'modifiersDtoList.' + scope.$index + '.englishLogo'" style="margin-bottom: 0" label-width="30px">
                          <el-input v-model.number="scope.row.englishLogo" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100">
                      <template slot-scope="scope">
                        <p class="tableActionDanger" :class="formWord.modifiersDtoList.length == '1' ? 'disabledTableActionDanger' : ''" @click="formWord.modifiersDtoList.length == '1' ? '' : formWord.modifiersDtoList.splice(scope.$index, 1)">删除</p>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="width: 100%; height: auto; text-align: right; margin-top: 5px">
                    <el-button type="primary" @click="formWord.modifiersDtoList.push({ englishLogo: '', modifiersName: '' })" size="medium" style="width: 100px">添加</el-button>
                  </div>
                </div>
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
  name: 'decorationWords',
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
        modifiersType: '',
        modifiersDtoList: [{ englishLogo: '', modifiersName: '' }],
        modifiersDesc: ''
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
      request({ url: '/data_indicator_modifiers/list', method: 'get', params: { page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.WordData = res.data.list || []
        that.loadingWord = false
        that.queryForm.total = res.data.total || 0
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    generateModifiersName(list) {
      let temp = []
      JSON.parse(list).forEach(item => {
        temp.push(item.modifiersName + '-' + item.englishLogo)
      })
      return temp.join('、')
    },
    // 新建API集合
    newWord() {
      let that = this
      that.addOrModifyWord = true
      that.dialogShowWord = true
      that.buttonLoad = false
      that.titleWord = '新建修饰词信息'
      resetForm('formWord', that)
      that.formWord = {
        modifiersType: '',
        modifiersDtoList: [{ englishLogo: '', modifiersName: '' }],
        modifiersDesc: ''
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
          request({ url: '/data_indicator_modifiers/add', method: 'post', data: params })
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
      that.titleWord = '修改修饰词信息    [' + row.modifiersType + ']'
      that.$nextTick(() => {
        that.formWord = { ...row }
        that.formWord.modifiersDtoList = JSON.parse(row.modifiersName)
      })
    },
    modifyWord() {
      let that = this
      that.$refs['formWord'].validate(valid => {
        if (valid) {
          let params = that.formWord
          that.buttonLoad = true
          request({ url: '/data_indicator_modifiers/update', method: 'post', data: params })
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

    // 删除修饰词
    cancelWord(row) {
      let that = this
      that
        .$confirm('是否确定删除[' + row.modifiersType + ']修饰词?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/data_indicator_modifiers/delete', method: 'post', data: { id: row.id } }).then(res => {
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
