<template>
  <div class="manageMain operationView manageMainNoBack" ref="operationView">
    <div class="main-unit" style="width: 100%; height: 626px; margin: 0 auto; position: relative; overflow: hidden; box-shadow: 0px 4px 8px 0px rgba(140, 140, 216, 0.1); border-radius: 6px; background: #ffffff">
      <div style="width: calc(100% - 48px); height: 46px; margin: 10px auto 0 auto; overflow: hidden">
        <p style="width: auto; height: 20px; line-height: 20px; margin-top: 9px; font-size: 16px; text-indent: 5px; text-align: center; color: #333333; float: left; border-left: 3px solid #007aff">实例运行概况</p>
        <div style="width: 150px; height: 45px; float: right">
          <el-radio-group v-model="onlyJobRunRecord" @change="getTaskRunInfo" size="mini">
            <el-radio-button :label="false">实例</el-radio-button>
            <el-radio-button :label="true">任务</el-radio-button>
          </el-radio-group>
        </div>
        <div style="width: 300px; height: 45px; float: right; margin-right: 40px">
          <el-date-picker @change="getTaskRunInfo" :unlink-panels="true" style="float: right; border-radius: 4px" value-format="yyyyMMdd" format="yyyy-MM-dd" v-model="runDate" type="daterange" :clearable="false" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
        </div>
      </div>
      <div style="width: calc(100% - 48px); height: 135px; margin: 10px auto; display: flex; justify-content: space-between">
        <div class="topDataUnit">
          <div>
            <p>{{ taskRunInfo.totalJobs }}</p>
          </div>
          <p>总任务数</p>
        </div>
        <div class="topDataUnit">
          <div :style="taskRunInfo.successList.length > 0 && 'cursor: pointer'" @click="taskRunInfo.successList.length > 0 && showTaskRunInfoDetail(taskRunInfo.successList, '成功实例数')">
            <p>{{ taskRunInfo.successList.length }}</p>
            <i v-if="taskRunInfo.successList.length > 0" class="el-icon-arrow-right"></i>
          </div>
          <p>成功实例数</p>
        </div>
        <div class="topDataUnit">
          <div :style="taskRunInfo.failedList.length > 0 && 'cursor: pointer'" @click="taskRunInfo.failedList.length > 0 && showTaskRunInfoDetail(taskRunInfo.failedList, '失败实例数')">
            <p>{{ taskRunInfo.failedList.length }}</p>
            <i v-if="taskRunInfo.failedList.length > 0" class="el-icon-arrow-right"></i>
          </div>
          <p>失败实例数</p>
        </div>
        <div class="topDataUnit">
          <div :style="taskRunInfo.runningList.length > 0 && 'cursor: pointer'" @click="taskRunInfo.runningList.length > 0 && showTaskRunInfoDetail(taskRunInfo.runningList, '正在运行实例数')">
            <p>{{ taskRunInfo.runningList.length }}</p>
            <i v-if="taskRunInfo.runningList.length > 0" class="el-icon-arrow-right"></i>
          </div>
          <p>正在运行实例数</p>
        </div>
        <div class="topDataUnit">
          <div :style="taskRunInfo.partiallySucceedList.length > 0 && 'cursor: pointer'" @click="taskRunInfo.partiallySucceedList.length > 0 && showTaskRunInfoDetail(taskRunInfo.partiallySucceedList, '部分成功实例数')">
            <p>{{ taskRunInfo.partiallySucceedList.length }}</p>
            <i v-if="taskRunInfo.partiallySucceedList.length > 0" class="el-icon-arrow-right"></i>
          </div>
          <p>部分成功实例数</p>
        </div>
      </div>
      <!-- <div style="width: 98%; height: 90px; margin: 0 auto; display: flex; justify-content: space-between">
        <div class="topDataUnit">
          <p>调度任务数</p>
          <div>
            <p>32</p>
          </div>
        </div>
        <div class="topDataUnit">
          <p>总任务数</p>
          <div>
            <p>71</p>
          </div>
        </div>
        <div class="topDataUnit">
          <p>计划执行实例数</p>
          <div>
            <p>28</p>
          </div>
        </div>
        <div class="topDataUnit">
          <p>失败实例数</p>
          <div style="cursor: pointer" @click="">
            <p>22</p>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="topDataUnit">
          <p>失败实例未处理数</p>
          <div style="cursor: pointer" @click="">
            <p style="color: #f56c6c">10</p>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div> -->
      <div style="width: calc(100% - 48px); height: 400px; margin: 20px auto" id="topChart"></div>
    </div>
    <div class="main-unit" style="width: 100%; height: auto; position: relative; overflow: hidden; margin-top: 13px; box-shadow: 0px 4px 8px 0px rgba(140, 140, 216, 0.1); border-radius: 6px; background: #ffffff">
      <div style="width: calc(100% - 48px); height: 46px; margin: 10px auto 0 auto; overflow: hidden">
        <p style="width: auto; height: 20px; line-height: 20px; margin-top: 9px; font-size: 16px; text-indent: 5px; text-align: center; color: #333333; float: left; border-left: 3px solid #007aff">任务出错排行</p>
        <!-- <el-radio-group v-model="middleDay" size="small" style="float: right; margin-top: 5px">
          <el-radio-button label="近30天">近30天</el-radio-button>
          <el-radio-button label="近60天">近60天</el-radio-button>
        </el-radio-group> -->
      </div>
      <el-table style="width: calc(100% - 48px); margin: 10px auto" v-loading="tableLoading" element-loading-text="数据加载中" class="data-table" ref="tableMiddle" :data="taskRunInfo.commonTaskInfoFailedDtoList" stripe max-height="500">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="taskName" label="任务名称" min-width="120" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="taskRunRecordInfoCount" label="出错次数" min-width="80" align="left"> </el-table-column>
        <el-table-column prop="owner" label="负责人" min-width="100" align="left"> </el-table-column>
        <el-table-column prop="taskDesc" label="描述" min-width="200" align="left" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <p class="tableAction" @click="showTaskRunInfoDetail(scope.row.taskRunRecordInfoList, scope.row.taskName + '任务详情')">详情</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="main-unit" style="width: 100%; height: auto; position: relative; overflow: hidden; margin-top: 13px; box-shadow: 0px 4px 8px 0px rgba(140, 140, 216, 0.1); border-radius: 6px; background: #ffffff">
      <!-- <div style="width: 98%; height: 50px; margin: 10px auto 0 auto; overflow: hidden">
        <el-radio-group v-model="bottomDay" size="small" style="float: right; margin-top: 15px">
          <el-radio-button label="今天">今天</el-radio-button>
          <el-radio-button label="昨天">昨天</el-radio-button>
        </el-radio-group>
      </div> -->
      <el-tabs style="width: calc(100% - 48px); margin: 0 auto" class="operationViewBottomTabs">
        <el-tab-pane label="实时耗时排行">
          <el-table style="width: 100%; margin: 10px auto" v-loading="tableLoading" element-loading-text="数据加载中" class="data-table" ref="tableBottom1" :data="taskRunInfo.sortedTaskRunRecordInfoList" stripe max-height="500">
            <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
            <el-table-column prop="taskName" label="任务名称" min-width="120" align="left" show-overflow-tooltip>
              <template slot-scope="scope">
                <template v-if="scope.row.taskName"> <span style="padding: 3px 8px; background: #67c23a; color: #ffffff; border-radius: 3px; font-size: 12px; margin-right: 5px">实例</span>{{ scope.row.taskName }} </template>
                <template v-else><span style="padding: 3px 8px; background: #409eff; color: #ffffff; border-radius: 3px; font-size: 12px; margin-right: 5px">任务</span> {{ scope.row.jobName }}</template>
              </template>
            </el-table-column>
            <el-table-column prop="jobKey" label="jobKey" min-width="100" align="left"> </el-table-column>
            <el-table-column prop="startTimeStamp" label="开始时间" min-width="100" align="left"> </el-table-column>
            <el-table-column prop="endTimeStamp" label="结束时间" min-width="100" align="left"> </el-table-column>
            <el-table-column prop="timeCost" label="执行时长(s)" min-width="100" align="left"> </el-table-column>
            <!-- <el-table-column label="操作" align="center" width="120" fixed="right">
              <template slot-scope="scope">
                <p class="tableAction" @click="">详情</p>
              </template>
            </el-table-column> -->
          </el-table>
        </el-tab-pane>
        <!-- <el-tab-pane label="节点耗时排行">
          <el-table style="width: 98%; margin: 10px auto" v-loading="tableLoading" element-loading-text="数据加载中" class="data-table" ref="tableBottom2" :data="taskRunInfo.sortedTaskRunRecordInfoList" stripe max-height="500">
            <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
            <el-table-column prop="slId" label="实例ID" min-width="80" align="left"> </el-table-column>
            <el-table-column prop="rwmc" label="节点名称" min-width="120" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="fzr" label="负责人" min-width="100" align="left"> </el-table-column>
            <el-table-column prop="kssj" label="开始时间" min-width="100" align="left"> </el-table-column>
            <el-table-column prop="jssj" label="结束时间" min-width="100" align="left"> </el-table-column>
            <el-table-column prop="zxsc" label="执行时长" min-width="100" align="left"> </el-table-column>
           
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="调度延迟排行">
          <el-table style="width: 98%; margin: 10px auto" v-loading="tableLoading" element-loading-text="数据加载中" class="data-table" ref="tableBottom3" :data="taskRunInfo.sortedTaskRunRecordInfoList" stripe max-height="500">
            <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
            <el-table-column prop="slId" label="实例ID" min-width="80" align="left"> </el-table-column>
            <el-table-column prop="rwmc" label="任务名称" min-width="120" align="left" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="fzr" label="负责人" min-width="100" align="left"> </el-table-column>
            <el-table-column prop="kssj" label="计划执行时间" min-width="100" align="left"> </el-table-column>
            <el-table-column prop="jssj" label="开始执行时间" min-width="100" align="left"> </el-table-column>
            <el-table-column prop="zxsc" label="延迟时长" min-width="100" align="left"> </el-table-column>
          
          </el-table>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <el-dialog :title="titleRunRecordDetail" :visible.sync="dialogShowRunRecordDetail" width="1200px">
      <el-table element-loading-text="数据加载中" style="margin: 10px auto" class="data-table" ref="tableRunRecordDetail" :data="tableRunRecordDetail" border stripe height="600">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="taskName" label="任务名称" min-width="190" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.taskName"> <span style="padding: 3px 8px; background: #67c23a; color: #ffffff; border-radius: 3px; font-size: 12px; margin-right: 5px">实例</span>{{ scope.row.taskName }} </template>
            <template v-else> <span style="padding: 3px 8px; background: #409eff; color: #ffffff; border-radius: 3px; font-size: 12px; margin-right: 5px">任务</span> {{ scope.row.jobName }}</template>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="jobName" label="任务名称" align="left" min-width="180">
          <template slot-scope="scope">
            <div style="width: 100%; height: 100%; display: flex; align-items: center">
              <p style="max-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis" :title="scope.row.jobName">{{ scope.row.jobName }}</p>
              <i class="el-icon-document-copy" style="cursor: pointer; vertical-align: middle; margin-left: 3px" title="复制jobKey" @click="copyText(scope.row.jobKey)"></i>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="createTime" label="运行时间" min-width="180" align="center"> </el-table-column>
        <el-table-column prop="timeCost" label="所用时间(s)" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="jobStatus" label="状态" align="center" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.jobStatus == '成功'" style="color: #67c23a">成功</span>
            <span v-else-if="scope.row.jobStatus == '失败'" style="color: #f56c6c">失败</span>
            <span v-else-if="scope.row.jobStatus == '部分成功'" style="color: #409eff">部分成功</span>
            <span v-else>{{ scope.row.jobStatus }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" min-width="210" label="读取">
          <el-table-column prop="readSucceedRecords" label="成功" min-width="70" align="center">
            <template slot-scope="scope">
              <span style="color: #67c23a">{{ scope.row.readSucceedRecords }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="readFaildRecords" label="失败" min-width="70" align="center">
            <template slot-scope="scope">
              <span style="color: #f56c6c">{{ scope.row.readFaildRecords }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalReadRecords" label="总计" min-width="70" align="center"> </el-table-column>
        </el-table-column>
        <el-table-column align="center" min-width="210" label="覆写">
          <el-table-column prop="writeSucceedRecords" label="成功 " min-width="70" align="center">
            <template slot-scope="scope">
              <span style="color: #67c23a">{{ scope.row.writeSucceedRecords }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="writeFailedRecords" label="失败" min-width="70" align="center">
            <template slot-scope="scope">
              <span style="color: #f56c6c">{{ scope.row.writeFailedRecords }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="writeReceivedRecords" label="总计" min-width="70" align="center"> </el-table-column>
        </el-table-column> -->
        <el-table-column prop="totalReadRecords" label="读取总条数" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="readFaildRecords" label="读取失败条数" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="writeFailedRecords" label="写入失败条数" min-width="120" align="center"> </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import resizeDetector from 'element-resize-detector'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'operationView',
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

      runDate: [],
      onlyJobRunRecord: true,
      taskRunInfo: {
        totalJobs: 0,
        failedList: [],
        partiallySucceedList: [],
        runningList: [],
        successList: [],
        commonTaskInfoFailedDtoList: [],
        sortedTaskRunRecordInfoList: [],
        hourToCountDtoList: []
      },
      dialogShowRunRecordDetail: false,
      tableRunRecordDetail: [],
      titleRunRecordDetail: '',

      middleDay: '近30天',

      tableLoading: true,

      bottomDay: '今天'
    }
  },
  mounted() {
    let y2 = new Date().getFullYear()
    let m2 = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1
    let d2 = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
    let y1 = new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).getFullYear()
    let m1 = new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).getMonth() + 1 < 10 ? '0' + (new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).getMonth() + 1) : new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).getMonth() + 1
    let d1 = new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).getDate() < 10 ? '0' + new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).getDate() : new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).getDate()
    this.runDate = [y1 + '' + m1 + '' + d1, y2 + '' + m2 + '' + d2]
    this.getTaskRunInfo()
    setTimeout(() => {
      this.setTopChart()
    }, 100)
    let erd = resizeDetector()
    erd.listenTo(this.$refs.operationView, () => {
      this.$nextTick(function () {
        this.$echarts.init(document.getElementById('topChart')).resize()
        setTimeout(() => {
          this.$refs.tableMiddle.doLayout()
          this.$refs.tableBottom1.doLayout()
          // this.$refs.tableBottom2.doLayout()
          // this.$refs.tableBottom3.doLayout()
        }, 300)
      })
    })
  },
  methods: {
    getTaskRunInfo() {
      let that = this
      that.tableLoading = true
      request({ url: '/task_run_record/list', method: 'get', params: { runDtStart: that.runDate[0], runDtEnd: that.runDate[1], onlyJobRunRecord: that.onlyJobRunRecord } }).then(res => {
        if (res.data) {
          that.taskRunInfo.totalJobs = res.data.totalJobs || 0
          that.taskRunInfo.failedList = res.data.failedList || []
          that.taskRunInfo.partiallySucceedList = res.data.partiallySucceedList || []
          that.taskRunInfo.runningList = res.data.runningList || []
          that.taskRunInfo.successList = res.data.successList || []
          that.taskRunInfo.commonTaskInfoFailedDtoList = res.data.commonTaskInfoFailedDtoList || []
          that.taskRunInfo.sortedTaskRunRecordInfoList = res.data.sortedTaskRunRecordInfoList || []
          that.taskRunInfo.hourToCountDtoList = res.data.hourToCountDtoList || []
        } else {
          that.taskRunInfo = {
            totalJobs: 0,
            failedList: [],
            partiallySucceedList: [],
            runningList: [],
            successList: [],
            commonTaskInfoFailedDtoList: [],
            sortedTaskRunRecordInfoList: [],
            hourToCountDtoList: []
          }
        }
        that.tableLoading = false
        setTimeout(() => {
          that.$refs.tableMiddle.doLayout()
          that.$refs.tableBottom1.doLayout()
          // that.$refs.tableBottom2.doLayout()
          // that.$refs.tableBottom3.doLayout()
          that.reTopChart()
        }, 300)
      })
    },
    showTaskRunInfoDetail(list, title) {
      let that = this
      that.tableRunRecordDetail = list
      that.titleRunRecordDetail = title
      that.dialogShowRunRecordDetail = true
      setTimeout(() => {
        that.$refs.tableRunRecordDetail.doLayout()
      }, 300)
    },

    setTopChart() {
      let that = this
      let options = {
        grid: {
          left: '4%',
          right: '4%',
          bottom: '18%',
          top: '13%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: [],
          axisLine: {
            lineStyle: {
              color: '#EDEDEF',
              width: 1 // 这里是坐标轴的宽度,可以去掉
            }
          },
          splitLine: {
            show: false,
            //  改变轴线颜色
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#EDEDEF'],
              type: 'dotted',
              opacity: 0.2
            }
          },
          axisLabel: {
            textStyle: {
              color: '#333333',
              fontSize: 14
            }
          },
          axisTick: {
            show: true
          }
        },
        yAxis: [
          {
            axisLabel: {
              textStyle: {
                color: '#333333',
                right: 20,
                fontSize: 14
              }
            },

            axisLine: {
              lineStyle: {
                color: '#EDEDEF',
                width: 1 // 这里是坐标轴的宽度,可以去掉
              }
            },
            splitLine: {
              show: false,
              //  改变轴线颜色
              lineStyle: {
                // 使用深浅的间隔色
                color: ['#6E7171'],
                opacity: 0.2
              }
            },

            name: '未完成任务数',
            nameTextStyle: {
              fontSize: '14',
              color: '#333333'
            },

            type: 'value'
          },
          {
            min: 0,
            max: 100,
            axisLabel: {
              formatter: '{value} %',
              textStyle: {
                color: '#333333',
                right: 20,
                fontSize: 14
              }
            },

            axisLine: {
              lineStyle: {
                color: '#EDEDEF',
                width: 1 // 这里是坐标轴的宽度,可以去掉
              }
            },
            splitLine: {
              show: false,
              //  改变轴线颜色
              lineStyle: {
                // 使用深浅的间隔色
                color: ['#6E7171'],
                opacity: 0.2
              }
            },

            name: '完成率',
            nameTextStyle: {
              fontSize: '14',
              color: '#333333'
            },

            type: 'value',
            scale: true
          }
        ],
        tooltip: {
          confine: true,
          trigger: 'axis'
        },
        legend: {
          // 图例的设置
          show: true, // 是否显示图例
          bottom: 20,
          right: 'center',
          itemWidth: 15, // 图例标记的图形宽度。
          itemHeight: 12, // 图例标记的图形高度。
          itemGap: 20, // 图例每项之间的间隔。
          textStyle: {
            // 图例文字的样式设置
            fontSize: 16,
            color: '#333333'
          },
          data: ['未完成任务数', '完成率', '近七天完成率平均值'] // 图例的名称数据
        },
        series: [
          {
            name: '未完成任务数',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              color: '#409eff',
              barBorderRadius: [5, 5, 0, 0]
            },

            data: []
          },
          {
            name: '完成率',
            type: 'line',
            barWidth: 30,
            symbol: 'circle',
            smooth: true,
            symbolSize: 3,
            yAxisIndex: 1,
            showSymbol: true,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(252, 155, 1, 1)',
                borderColor: 'rgba(252, 155, 1, 0.6)',
                borderWidth: 1
              }
            },

            data: []
          },
          {
            name: '近七天完成率平均值',
            type: 'line',
            barWidth: 30,
            symbol: 'circle',
            yAxisIndex: 1,
            smooth: true,
            symbolSize: 3,
            showSymbol: true,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(3, 216, 143, 1)',
                borderColor: 'rgba(3, 216, 143, 0.6)',
                borderWidth: 1
              }
            },

            data: []
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('topChart'), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reTopChart() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('topChart'), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      let data1 = []
      let data2 = []
      let data3 = []
      let data4 = []
      that.taskRunInfo.hourToCountDtoList.forEach((item, index) => {
        // data1.push(item.hourInfo)
        data1.push(item.hourInfo.slice(item.hourInfo.indexOf(':') + 1, item.hourInfo.length) + ':00')
        data2.push(item.count)
      })
      option.xAxis[0].data = data1
      option.series[0].data = data2
      option.series[1].data = data3
      option.series[2].data = data4

      myChart.setOption(option)
    },
    // 复制到剪切板
    copyText(text) {
      copyText(text)
    }
  }
}
</script>

<style scoped>
</style>
