<template>
  <div class="manageMain chatBi" style="background-color: #f5f7f7; min-width: 900px; overflow: hidden; display: block; width: 100%">
    <div style="width: 250px; height: 100%; float: left; margin-left: 0; overflow: hidden; background-color: #ffffff; box-shadow: rgba(0, 0, 0, 0.04) 0px 6px 6px 0px, rgba(0, 0, 0, 0.02) 0px 8px 24px 0px">
      <div style="width: 230px; height: 40px; line-height: 40px; margin: 5px auto">
        <el-button type="primary" icon="el-icon-chat-line-round" style="width: 150px" @click="newChat()">开启新对话</el-button>
      </div>
      <div style="width: 250px; height: calc(100% - 50px); overflow: hidden auto">
        <div v-for="(item, index) in topicList" :key="index" class="topicItem" :class="chatId == item.id ? 'activeTopic' : ''" @click="chooseChat(item)">
          <p>{{ item.chatTopic }}</p>
          <div style="height: 22px; width: 38px; float: right; text-align: right" v-if="chatId == item.id">
            <el-popover placement="right" width="120" trigger="click">
              <el-button type="primary" size="mini" icon="el-icon-edit" style="width: 100%; display: block; margin: 0 auto" @click="reNameTopic(item)">重命名</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" style="width: 100%; display: block; margin: 5px auto 0 auto" @click="deleteTopic(item)">删除</el-button>
              <i class="el-icon-more" slot="reference" style="height: 22px; line-height: 22px; font-size: 12px; cursor: pointer"></i>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <div style="width: calc(100% - 260px); height: 100%; float: right; margin-right: 0">
      <div style="box-sizing: border-box; flex: 1; height: 100%; display: flex; flex-direction: column; padding-bottom: 24px">
        <div style="min-height: 0; flex: 1; overflow: hidden auto" id="scrollDiv">
          <div style="max-width: 896px; margin: 0 auto; height: auto">
            <div v-for="(item, index) in chatList" :key="index">
              <div v-if="item.type == 'robot'" style="display: flex; padding: 16px 0; align-items: flex-start; justify-content: flex-end; position: relative">
                <div class="robotAvator"></div>
                <div style="flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: flex-start">
                  <div style="background-color: #fff; border-radius: 2px 8px 8px 8px; padding: 8px; box-shadow: 0 4px 24px 0 rgba(41, 91, 156, 0.05); display: flex; flex-direction: column">
                    <p v-if="item.content" style="color: #000000; font-size: 14px; text-align: justify; box-sizing: border-box; white-space: pre-wrap; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word; user-select: text">{{ item.content }}<i v-if="item.showLoading" class="el-icon-loading" style="color: #2682fa; font-size: 16px; margin-left: 10px"></i></p>
                    <div v-if="item.sqlInfoList && item.sqlInfoList.length > 0" style="width: 880px; height: auto">
                      <chatBi3DataTable v-for="(item2, index2) in item.sqlInfoList" :key="index + '' + index2" :questionInfo="item2.questionInfo" :boxIndex="index + '' + index2" :sqlStr="item2.sqlStr" :id="item2.id" :sqlResult="item2.sqlResult"></chatBi3DataTable>
                    </div>
                    <chatBi3DataReport v-if="item.analysis" :questionId="item.questionId" :analysis="item.analysis"></chatBi3DataReport>

                    <div v-if="item.mkAndDataList" style="width: 880px; height: auto">
                      <div v-for="(item2, index2) in item.mkAndDataList.list" :key="index + '' + index2" style="width: 880px; height: auto">
                        <chatBi3DataTable v-if="item2.style == 'data'" :boxIndex="index + '' + index2" :sqlResult="item2.content"></chatBi3DataTable>
                        <chatBi3DataReportNoRequest v-if="item2.style == 'md'" :analysis="item2.content"></chatBi3DataReportNoRequest>
                      </div>
                      <div style="width: 880px; height: auto; text-align: right" v-if="item.questionInfo && item.questionInfo.includes('帮我生成一份报告')">
                        <el-button type="primary" size="mini" @click="exportReport()">报告下载</el-button>
                      </div>
                    </div>
                    <div v-if="item.recommendQuestionsList && item.recommendQuestionsList.length > 0" style="width: 880px; height: auto">
                      <p style="color: #999999; font-size: 14px; height: 20px; line-height: 20px; width: 860px; margin: 0 auto">你可能还想问:</p>
                      <div style="width: 860px; height: auto; overflow: hidden; margin: 0 auto">
                        <p v-for="(item2, index2) in item.recommendQuestionsList" :key="index + '' + index2" style="width: auto; float: left; margin-right: 20px; margin-top: 10px; height: 40px; line-height: 40px; cursor: pointer; color: #000000; font-size: 14px; padding: 0 20px; background: #f9f9f9; border-radius: 20px" @click=";(questionInput = item2), sendQuestionPre()">{{ item2 }}</p>
                      </div>
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
            <div style="background-color: #fff; border-radius: 8px; padding: 16px; margin-top: 10px; box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.04), 0 8px 24px 0 rgba(0, 0, 0, 0.02); height: 138px; display: flex; flex-direction: column; position: relative">
              <div style="padding-right: 30px; flex: 1; min-height: 0; display: flex; flex-direction: column; color: rgba(0, 0, 0, 0.65)">
                <el-input class="noBorderTextarea" type="textarea" :autosize="{ minRows: 5, maxRows: 5 }" placeholder="请输入内容" v-model="questionInput" resize="none"> </el-input>
              </div>
              <div style="position: absolute; right: 16px; bottom: 16px; width: 28px; height: 28px; background: #2682fa; border-radius: 8px; cursor: pointer; text-align: center" @click="sendQuestionPre()">
                <i class="el-icon-s-promotion" style="font-size: 20px; color: #ffffff; margin: 4px auto; display: block"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requestAi from '@/api/requestAi'
import { resetForm, Notify, copyText, dateFormat } from '@/api/common'
import chatBi3DataTable from './components/chatBi3DataTable.vue'
import chatBi3DataReport from './components/chatBi3DataReport.vue'
import chatBi3DataReportNoRequest from './components/chatBi3DataReportNoRequest.vue'
export default {
  name: 'chatBi',
  components: {
    chatBi3DataTable,
    chatBi3DataReport,
    chatBi3DataReportNoRequest
  },
  data() {
    return {
      topicList: [],
      firstQuestion: false,
      chatId: null,
      questionId: null,
      chatList: [],
      questionInput: '',
      thinkLoad: false
    }
  },
  mounted() {
    this.getTopicList(true)
  },
  methods: {
    getTopicList(flag) {
      requestAi({ url: '/chat_bi/topic_list', method: 'get' }).then(res => {
        if (res.success) {
          this.topicList = res.data
          if (this.topicList.length > 0) {
            this.chatId = this.topicList[0].id
            if (flag) {
              this.firstQuestion = false
              this.getChatList()
            }
          } else {
            this.firstQuestion = true
            this.getChatId()
            this.chatList = [
              {
                type: 'robot',
                content: 'Hi，我是ChatBI，我可以根据你的问题，分析数据、生成图表和报告。'
              }
            ]
          }
        } else {
          this.topicList = []
        }
      })
    },
    reNameTopic(item) {
      let that = this
      that
        .$prompt('请输入新的会话名称', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S+/
        })
        .then(({ value }) => {
          requestAi({ url: '/chat_bi/update_topic', method: 'post', data: { id: item.id, topicName: value } }).then(res => {
            if (res.success) {
              requestAi({ url: '/chat_bi/topic_list', method: 'get' }).then(res2 => {
                if (res2.success) {
                  that.topicList = res2.data
                }
              })
            } else {
              Notify('error', res.message)
            }
          })
        })
    },
    deleteTopic(item) {
      let that = this
      that
        .$confirm('此操作将永久删除该会话, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          requestAi({ url: '/chat_bi/delete_by_id', method: 'post', data: { id: item.id } }).then(res => {
            if (res.success) {
              that.getTopicList(true)
            }
          })
        })
    },
    chooseChat(item) {
      this.chatId = item.id
      this.firstQuestion = false
      this.getChatList()
    },
    getChatList() {
      requestAi({ url: '/chat_bi/one_topic', method: 'get', params: { chatId: this.chatId } }).then(res => {
        if (res.success) {
          this.chatList = [
            {
              type: 'robot',
              content: 'Hi，我是ChatBI，我可以根据你的问题，分析数据、生成图表和报告。'
            }
          ]
          res.data.forEach(item => {
            this.chatList.push({ type: 'user', content: item.questionInfo })
            if (item.answer) {
              this.chatList.push({ type: 'robot', questionId: null, content: item.answer, questionInfo: item.questionInfo, showLoading: false, recommendQuestionsList: item.recommendQuestionsList || [] })
              this.thinkLoad = false
            }
            if (item.sqlInfoList) {
              if (this.isJSON(item.reportInfo)) {
                this.chatList.push({ type: 'robot', content: '查询结果如下：', questionId: null, questionInfo: item.questionInfo, sqlInfoList: item.sqlInfoList, mkAndDataList: JSON.parse(item.reportInfo), recommendQuestionsList: item.recommendQuestionsList || [] })
              } else {
                this.chatList.push({ type: 'robot', content: '查询结果如下：', questionId: null, questionInfo: item.questionInfo, sqlInfoList: item.sqlInfoList, analysis: item.reportInfo, recommendQuestionsList: item.recommendQuestionsList || [] })
              }
              this.thinkLoad = false
            }
          })
          console.log(this.chatList)
          this.questionScrollToBottom()
        } else {
          this.chatList = [
            {
              type: 'robot',
              content: 'Hi，我是ChatBI，我可以根据你的问题，分析数据、生成图表和报告。'
            }
          ]
        }
      })
    },
    newChat() {
      this.firstQuestion = true
      this.getChatId()
      this.chatList = [
        {
          type: 'robot',
          content: 'Hi，我是ChatBI，我可以根据你的问题，分析数据、生成图表和报告。'
        }
      ]
    },
    getChatId() {
      requestAi({ url: '/chat_bi/get_id', method: 'get' }).then(res => {
        if (res.success) {
          this.chatId = res.data
        } else {
          this.chatId = new Date().getTime()
        }
      })
    },
    sendQuestionPre() {
      if (this.questionInput == '') {
        return
      }
      if (this.thinkLoad) {
        return Notify('warning', '正在思考中...')
      }
      if (this.chatList.length > 10) {
        this.$confirm('会话内容过多，大模型思考需要更长时间，建议开启新对话', '提示', {
          confirmButtonText: '开启新对话',
          cancelButtonText: '仍然继续',
          type: 'warning'
        })
          .then(() => {
            this.newChat()
          })
          .catch(() => {
            this.sendQuestion()
          })
      } else {
        this.sendQuestion()
      }
    },
    sendQuestion() {
      requestAi({ url: '/chat_bi/get_id', method: 'get' }).then(res => {
        let tempQuestionId = ''
        if (res.success) {
          tempQuestionId = res.data
        } else {
          tempQuestionId = new Date().getTime()
        }
        let tempQuestion = this.questionInput
        this.questionInput = ''
        this.chatList.push({ type: 'user', questionId: tempQuestionId, content: tempQuestion })
        this.questionScrollToBottom()
        this.thinkLoad = true
        this.chatList.push({ type: 'robot', content: '正在思考中...', showLoading: true })
        this.questionScrollToBottom()
        requestAi({ url: '/chat_bi/problem_disassembly', method: 'post', data: { questionId: tempQuestionId, chatId: this.chatId, question: tempQuestion, firstQuestion: this.firstQuestion } }).then(res2 => {
          if (this.firstQuestion) {
            this.getTopicList(false)
          }
          this.firstQuestion = false
          if (res2.data && res2.data.answer) {
            this.chatList.pop()
            if (this.isJSON(res2.data.answer)) {
              this.chatList.push({ type: 'robot', content: '查询结果如下：', questionId: tempQuestionId, questionInfo: tempQuestion, mkAndDataList: JSON.parse(res2.data.answer), recommendQuestionsList: res2.data.recommendQuestionsList || [] })
            } else {
              this.chatList.push({ type: 'robot', questionId: tempQuestionId, questionInfo: tempQuestion, content: res2.data.answer, showLoading: false, recommendQuestionsList: res2.data.recommendQuestionsList || [] })
            }
            this.thinkLoad = false
            this.questionScrollToBottom()
          }
          if (res2.data && res2.data.sqlInfoList) {
            this.chatList.pop()
            this.chatList.push({ type: 'robot', content: '查询结果如下：', questionId: tempQuestionId, questionInfo: tempQuestion, sqlInfoList: res2.data.sqlInfoList, analysis: '-', recommendQuestionsList: res2.data.recommendQuestionsList || [] })
            this.thinkLoad = false
          }
        })
      })
    },

    questionScrollToBottom() {
      let tempDiv = document.getElementById('scrollDiv')
      setTimeout(() => {
        tempDiv.scrollTop = tempDiv.scrollHeight
      }, 300)
    },
    isJSON(str) {
      try {
        const obj = JSON.parse(str)
        if (obj && typeof obj === 'object') {
          return true
        }
      } catch (e) {
        // 捕获到错误，但不是因为JSON格式问题（例如，不是SyntaxError），则返回false
        if (e instanceof SyntaxError) {
          return false
        }
        // 如果不是SyntaxError，可能是其他类型的错误，可以选择抛出或处理
        throw e // 或者 return false;
      }
      return false // 如果try中没有抛出异常，但不是有效的JSON对象，则返回false
    },
    exportReport() {
      window.open('http://api.junereed.online:8100/file_center/file/1749456696069/data.docx')
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
  width: 30px;
  height: 30px;
  border-radius: 1px;
  position: absolute;
  top: 18px;
  left: -40px;
}
.manageMain.chatBi .topicItem {
  width: 220px;
  height: 22px;
  margin: 10px auto;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  color: rgb(0, 0, 0);
  background: #f2eaea9c;
}
.manageMain.chatBi .topicItem:hover,
.manageMain.chatBi .topicItem.activeTopic {
  background: rgb(38, 130, 250);
  color: #ffffff;
}
.manageMain.chatBi .topicItem p {
  width: 180px;
  float: left;
  height: 22px;
  line-height: 22px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
}
</style>
