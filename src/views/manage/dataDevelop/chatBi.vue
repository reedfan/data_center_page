<template>
  <div class="manageMain chatBi" style="background-color: #f5f7f7; min-width: 900px">
    <div style="box-sizing: border-box; flex: 1; height: 100%; display: flex; flex-direction: column; padding-bottom: 24px">
      <div style="min-height: 0; flex: 1; overflow: hidden auto" id="scrollDiv">
        <div style="max-width: 896px; margin: 0 auto; height: auto">
          <div v-for="(item, index) in chatList" :key="index">
            <div v-if="item.type == 'robot'" style="display: flex; padding: 16px 0; align-items: flex-start; justify-content: flex-end; position: relative">
              <div class="robotAvator" style="width: 36px; height: 36px; border-radius: 18px; position: absolute; left: -45px"></div>
              <div style="flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: flex-start">
                <div style="background-color: #fff; border-radius: 2px 8px 8px 8px; padding: 8px; box-shadow: 0 4px 24px 0 rgba(41, 91, 156, 0.05); display: flex; flex-direction: column">
                  <p style="color: #000000; font-size: 14px; text-align: justify; box-sizing: border-box; white-space: pre-wrap; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word; user-select: text">{{ item.content }}</p>
                  <div v-if="item.boxData" style="width: 860px; height: auto; padding: 10px">
                    <chatBiDataBox :boxData="item.boxData"></chatBiDataBox>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="item.type == 'user'" style="display: flex; padding: 16px 0; align-items: flex-start; justify-content: flex-end">
              <div style="flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: flex-end">
                <div style="background-color: #2682fa; border-radius: 8px 2px 8px 8px; padding: 8px; box-shadow: 0 4px 24px 0 rgba(41, 91, 156, 0.05)">
                  <p style="color: #ffffff; font-size: 14px; text-align: justify; box-sizing: border-box; white-space: pre-wrap; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word; user-select: text">{{ item.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="flex-shrink: 0; padding-top: 16px; position: relative; z-index: 200; display: flex; justify-content: center">
        <div style="max-width: 896px; width: 100%">
          <div style="width: 100%; height: 46px; display: flex; align-items: center; justify-content: space-between">
            <div style="display: flex; align-items: center; flex-direction: row; padding: 9px 16px; background: #ffffff; border-radius: 8px">
              <p style="height: 28px; line-height: 28px; margin: 0; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #999999; font-size: 14px">
                数据源：<span style="color: #000000">{{ dataSourceId ? dataSourceList.find(item => item.id == dataSourceId).sourceName : '暂未选择数据源' }}</span>
              </p>
              <p style="color: #999999; height: 28px; line-height: 28px; font-size: 14px">丨</p>
              <p style="height: 28px; line-height: 28px; margin: 0; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #999999; font-size: 14px">
                表：<span style="color: #000000">{{ chooseTableList.join(',') || '暂未选择任何表' }}</span>
              </p>
              <p style="color: #999999; height: 28px; line-height: 28px; font-size: 14px">丨</p>
              <el-popover placement="top" width="400" trigger="click" v-model="chooseTableShow">
                <p style="width: 100%; height: 28px; line-height: 28px; color: #00000; margin: 0; text-align: left">数据源：</p>
                <el-select v-model="dataSourceId" filterable placeholder="请选择数据源" @change="dataSourceChange()">
                  <el-option v-for="(item, index) in dataSourceList" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
                </el-select>
                <el-table :data="tableList" style="margin-top: 10px" @selection-change="handleSelectionChange" height="200" v-loading="loadingTableList">
                  <el-table-column type="selection" width="55" align="center"></el-table-column>
                  <el-table-column min-width="150" property="tableName" label="表名" align="center" show-overflow-tooltip=""></el-table-column>
                  <el-table-column min-width="60" label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="perviewTabel(scope.row)">预览</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-dialog :title="titlePreview" :visible.sync="dialogShowPreview" width="1400px">
                  <el-table v-loading="loadingColumns" element-loading-text="数据加载中" style="width: 96%; margin: 10px auto 0 auto" class="data-table" ref="tableColumns" :data="columnsData" border stripe :height="440">
                    <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
                    <el-table-column prop="columnName" label="字段名称" min-width="50" align="left" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="columnType" label="字段类型" min-width="50" align="left" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="columnComment" label="字段描述" min-width="100" align="left" show-overflow-tooltip> </el-table-column>
                  </el-table>
                </el-dialog>
                <div style="width: 100%; height: 28px; margin-top: 20px; overflow: hidden; text-align: right">
                  <el-button type="info" size="mini" @click="chooseTableShow = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="sureChooseTable()">确定</el-button>
                </div>
                <p slot="reference" style="color: #2682fa; height: 28px; line-height: 28px; font-size: 14px; cursor: pointer">选择</p>
              </el-popover>
            </div>
            <div style="background-color: #fff; padding: 9px 16px; border-radius: 8px; cursor: pointer">
              <p
                style="color: #000000; height: 28px; line-height: 28px; font-size: 14px; cursor: pointer"
                @click="
                  thinkLoad = fasle
                  chatList = [{ type: 'robot', content: 'Hi，我是ChatBI，我可以根据你的问题，分析数据、生成图表。' }]
                "
              >
                清空会话
              </p>
            </div>
          </div>
          <div style="background-color: #fff; border-radius: 8px; padding: 16px; margin-top: 10px; box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.04), 0 8px 24px 0 rgba(0, 0, 0, 0.02); height: 138px; display: flex; flex-direction: column; position: relative">
            <div style="padding-right: 30px; flex: 1; min-height: 0; display: flex; flex-direction: column; color: rgba(0, 0, 0, 0.65)">
              <el-input class="noBorderTextarea" type="textarea" :autosize="{ minRows: 5, maxRows: 5 }" placeholder="请输入内容" v-model="questionInput" resize="none"> </el-input>
            </div>
            <div style="position: absolute; right: 16px; bottom: 16px; width: 28px; height: 28px; background: #2682fa; border-radius: 8px; cursor: pointer; text-align: center" @click="sendQuestion()">
              <i class="el-icon-s-promotion" style="font-size: 20px; color: #ffffff; margin: 4px auto; display: block"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/api/request'
import { resetForm, Notify, copyText, dateFormat } from '@/api/common'
import chatBiDataBox from './components/chatBiDataBox.vue'
export default {
  name: 'chatBi',
  components: {
    chatBiDataBox
  },
  data() {
    return {
      chooseTableShow: false,
      dataSourceList: [],
      dataSourceId: '',
      selectedTable: [],
      tableList: [],
      loadingTableList: false,

      columnsData: [],
      loadingColumns: false,
      dialogShowPreview: false,
      titlePreview: '',

      chatList: [{ type: 'robot', content: 'Hi，我是ChatBI，我可以根据你的问题，分析数据、生成图表。' }],
      questionInput: '',
      chooseTableList: [],
      thinkLoad: false
    }
  },
  mounted() {
    this.getDataSourceList()
  },
  methods: {
    getDataSourceList() {
      let that = this
      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: 'MySQL', page: 1, pageSize: 1000 } }).then(res => {
        if (res.success) {
          that.dataSourceList = res.data.list || []
        } else {
          that.dataSourceList = []
        }
      })
    },
    dataSourceChange() {
      let that = this
      that.tableList = []
      that.loadingTableList = true
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.dataSourceId } }).then(res => {
        that.loadingTableList = false
        if (res.success) {
          res.data.forEach(item => {
            that.tableList.push({ tableName: item })
          })
        } else {
          that.tableList = []
        }
      })
    },
    perviewTabel(row) {
      let that = this
      that.titlePreview = row.tableName
      that.dialogShowPreview = true
      that.loadingColumns = true
      request({ url: '/data_source/columns', method: 'get', params: { id: that.dataSourceId, table: row.tableName } }).then(res => {
        that.columnsData = res.data || []
        that.loadingColumns = false
        setTimeout(() => {
          that.$refs.tableColumns.doLayout()
        }, 300)
      })
    },
    handleSelectionChange(val) {
      this.selectedTable = val.map(item => item.tableName)
      console.log(this.selectedTable)
    },
    sureChooseTable() {
      this.chooseTableList = this.selectedTable
      this.chooseTableShow = false
    },
    sendQuestion() {
      if (this.questionInput == '') {
        return
      }
      if (this.thinkLoad) {
        return Notify('warning', '正在思考中...')
      }
      if (this.dataSourceId == '') {
        return Notify('warning', '请选择数据源')
      }
      if (this.chooseTableList.length == 0) {
        return Notify('warning', '未选择任何表')
      }
      this.chatList.push({ type: 'user', content: this.questionInput })
      let tempQuestion = this.questionInput
      this.questionInput = ''
      this.questionScrollToBottom()
      this.thinkLoad = true
      this.chatList.push({ type: 'robot', content: '正在思考中...' })
      this.questionScrollToBottom()
      request({ url: '/chat_bi/get_sql', method: 'post', data: { question: tempQuestion, dataSourceId: this.dataSourceId, tableList: this.chooseTableList } }).then(res => {
        this.thinkLoad = false
        if (res.success) {
          if (res.data != 'NULL') {
            request({ url: '/query/result', method: 'post', data: { querySql: res.data, dataSourceInfoId: this.dataSourceId } }).then(res2 => {
              if (res2.data.jsonArray[0]) {
                this.chatList.pop()
                this.chatList.push({ type: 'robot', sql: res.data, boxData: res2.data.jsonArray, content: '查询结果如下' })
                this.questionScrollToBottom()
              } else {
                this.chatList.pop()
                this.chatList.push({ type: 'robot', sql: res.data, boxData: null, content: '查询结果为空' })
                this.questionScrollToBottom()
              }
            })
          } else {
            this.chatList.pop()
            this.chatList.push({ type: 'robot', content: '抱歉，大模型无法理解，请重新提问' })
            this.questionScrollToBottom()
          }
          this.questionScrollToBottom()
        }
      })
    },
    questionScrollToBottom() {
      let tempDiv = document.getElementById('scrollDiv')
      this.$nextTick(() => {
        tempDiv.scrollTop = tempDiv.scrollHeight
      })
    }
  }
}
</script>

<style >
.manageMain.chatBi .noBorderTextarea .el-textarea__inner {
  border: 1px solid transparent;
}
.manageMain.chatBi .robotAvator {
  background-image: url('https://tcbi-1258344699.cos.ap-guangzhou.myqcloud.com/open/tcbi/static/prod/chatbi/1.0/chat-logo.svg');
  background-size: 100% 100%;
}
</style>
