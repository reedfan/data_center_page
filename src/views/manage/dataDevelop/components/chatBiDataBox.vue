<template>
  <div style="width: 880px; height: auto; overflow: hidden; position: relative" class="chatBiDataBox">
    <p v-if="improvementReminderText" style="width: 880px; color: #ff0000; font-size: 14px; height: auto; line-height: 20px; margin: 10px auto">{{ improvementReminderText }}</p>

    <div style="width: 878px; transition: 0.3s; height: 452px; overflow: hidden auto; background: #ffffff; position: relative; border: 1px solid #e1e2e5; border-radius: 8px; box-sizing: border-box">
      <div style="width: 858px; height: 30px; margin: 0; padding: 10px; position: relative; overflow: hidden; text-align: left; background-color: rgba(245, 246, 250, 0.6)">
        <i v-if="activeShowType == 'chart'" class="el-icon-notebook-2 changeIcon" :class="activeChartType == 'data' ? 'changeIconActive' : ''" @click="activeChartType = 'data'"></i>
        <i v-if="canChart && activeShowType == 'chart'" class="el-icon-data-analysis changeIcon" :class="activeChartType == 'bar' ? 'changeIconActive' : ''" @click="activeChartType = 'bar'"></i>
        <i v-if="canChart && activeShowType == 'chart'" class="el-icon-data-line changeIcon" :class="activeChartType == 'line' ? 'changeIconActive' : ''" @click="activeChartType = 'line'"></i>
        <i v-if="canChart && activeShowType == 'chart' && seriesData.length == 1" class="el-icon-pie-chart changeIcon" :class="activeChartType == 'pie' ? 'changeIconActive' : ''" @click="activeChartType = 'pie'"></i>
        <p v-if="activeShowType == 'report'" style="color: #2c3e50; font-size: 16px; height: 30px; line-height: 30px; margin: 0; width: auto">数据总结</p>
        <p v-if="activeShowType == 'analysis'" style="color: #2c3e50; font-size: 16px; height: 30px; line-height: 30px; margin: 0; width: auto">归因分析</p>
        <div style="position: absolute; height: 30px; overflow: hidden; width: auto; right: 20px; top: 10px; cursor: pointer">
          <el-button type="text" @click="activeShowType = 'chart'" style="padding: 7px">图表数据</el-button>
          <el-button :disabled="reportText == ''" v-loading="loadReport" type="text" @click="activeShowType = 'report'" style="padding: 7px">数据总结</el-button>
          <el-button :disabled="analysisText == ''" v-loading="loadAnalysis" type="text" @click="activeShowType = 'analysis'" style="padding: 7px">归因分析</el-button>
        </div>
      </div>
      <div style="width: 878px; height: 400px; overflow: hidden">
        <div style="width: 878px; transition: 0.3s; height: 400px; overflow: hidden" :style="activeShowType == 'chart' ? 'margin-top:0px;' : 'margin-top:-400px;'">
          <el-table ref="table" :data="boxData" height="400" v-show="activeChartType == 'data'" border>
            <el-table-column type="index" label="序号" align="center" width="79"> </el-table-column>
            <el-table-column :prop="item" :label="item" min-width="250" align="center" v-for="(item, index) in Object.keys(boxData[0])" :key="index">
              <template slot-scope="scope">
                {{ scope.row[item] }}
              </template>
            </el-table-column>
          </el-table>
          <div style="width: 878px; height: 400px; margin: 0 auto" :id="'barChart' + boxIndex" v-show="activeChartType == 'bar'"></div>
          <div style="width: 878px; height: 400px; margin: 0 auto" :id="'lineChart' + boxIndex" v-show="activeChartType == 'line'"></div>
          <div style="width: 878px; height: 400px; margin: 0 auto" :id="'pieChart' + boxIndex" v-show="activeChartType == 'pie'"></div>
        </div>
        <div style="width: 878px; transition: 0.3s; overflow: hidden auto" :style="activeShowType == 'report' ? 'height: 400px;' : 'height: 0px;'">
          <p style="min-height: 400px; padding: 8px; color: #000000; font-size: 14px; text-align: justify; box-sizing: border-box; white-space: pre-wrap; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word; user-select: text">
            {{ reportText }}
          </p>
        </div>
        <div style="width: 878px; transition: 0.3s; overflow: hidden auto" :style="activeShowType == 'analysis' ? 'height: 400px;' : 'height: 0px;'">
          <p style="min-height: 400px; padding: 8px; color: #000000; font-size: 14px; text-align: justify; box-sizing: border-box; white-space: pre-wrap; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word; user-select: text">
            {{ analysisText }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
    
    <script>
import request from '@/api/request'
export default {
  name: 'chatBiDataBox',
  props: {
    id: null,
    boxData: {},
    boxIndex: null,
    sql: null,
    question: null
  },
  data() {
    return {
      requestTimeOut: 0,
      activeChartType: 'data',
      activeShowType: 'chart',
      canChart: false,
      xAxisData: '',
      seriesData: '',
      showType: 'chart',
      loadReport: true,
      loadAnalysis: true,
      analysisText: '',
      reportText: '',
      improvementReminderText: ''
    }
  },
  mounted() {
    console.log(this.boxData)
    console.log(this.boxIndex)
    console.log(this.sql)
    console.log(this.question)
    this.setChartBar()
    this.setChartLine()
    this.setChartPie()
    this.getDetail()
  },
  methods: {
    getDetail() {
      let that = this
      that.requestTimeOut += 1
      if (that.requestTimeOut > 30 || that.improvementReminderText) {
        that.loadAnalysis = false
        that.loadReport = false
        return
      }
      request({ url: '/chat_bi/get', method: 'get', params: { id: that.id } }).then(res => {
        if (res.data.fieldInfo && JSON.parse(res.data.fieldInfo).xAxis && JSON.parse(res.data.fieldInfo).series) {
          that.canChart = true
          that.xAxisData = JSON.parse(res.data.fieldInfo).xAxis
          that.seriesData = JSON.parse(res.data.fieldInfo).series
          setTimeout(() => {
            that.reChartBar()
            that.reChartLine()
            if (that.seriesData.length == 1) {
              that.reChartPie()
            }
          }, 1000)
        } else {
          that.canChart = false
        }
        if (res.data.reportInfo) {
          that.loadReport = false
          that.reportText = res.data.reportInfo
        } else {
          that.loadReport = true
          that.reportText = ''
        }
        if (res.data.attributionAnalysis) {
          that.loadAnalysis = false
          that.analysisText = res.data.attributionAnalysis
        } else {
          that.loadAnalysis = true
          that.analysisText = ''
        }
        if (res.data.improvementReminder) {
          that.improvementReminderText = res.data.improvementReminder
        }
        if (!(res.data.reportInfo && res.data.fieldInfo && res.data.attributionAnalysis)) {
          setTimeout(() => {
            that.getDetail()
          }, 1000)
        }
      })
    },

    setChartBar() {
      let that = this
      let options = {
        grid: {
          left: '4%',
          right: '4%',
          bottom: '8%',
          top: '13%',
          containLabel: true
        },
        dataZoom: [
          {
            show: true,
            height: 12,
            xAxisIndex: [0],
            bottom: '3%',
            start: 0,
            end: 100,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#666666'
            },
            textStyle: {
              color: '#fff'
            },
            borderColor: '#90979c'
          }
        ],

        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: [],
          axisLine: {
            lineStyle: {
              color: '#666666',
              width: 1 // 这里是坐标轴的宽度,可以去掉
            }
          },
          splitLine: {
            show: false,
            //  改变轴线颜色
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#666666'],
              type: 'dotted',
              opacity: 0.2
            }
          },
          axisLabel: {
            textStyle: {
              color: '#666666',
              fontSize: 12
            }
          },
          axisTick: {
            show: true
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: '#666666',
              right: 20,
              fontSize: 12
            }
          },

          axisLine: {
            lineStyle: {
              color: '#666666',
              width: 1 // 这里是坐标轴的宽度,可以去掉
            }
          },
          splitLine: {
            show: false,
            //  改变轴线颜色
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#666666'],
              opacity: 0.2
            }
          },
          name: '',
          nameTextStyle: {
            fontSize: '14',
            color: '#666666'
          },

          type: 'value',
          scale: true
        },
        tooltip: {
          confine: true,
          trigger: 'axis'
        },
        legend: {
          // 图例的设置
          show: true, // 是否显示图例
          top: 10,
          right: 10,
          itemWidth: 15, // 图例标记的图形宽度。
          itemHeight: 12, // 图例标记的图形高度。
          itemGap: 20, // 图例每项之间的间隔。
          textStyle: {
            // 图例文字的样式设置
            fontSize: 12,
            color: '#409eff'
          }
        },
        series: []
      }
      let myChart = this.$echarts.init(document.getElementById('barChart' + that.boxIndex), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reChartBar() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('barChart' + that.boxIndex), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      let color = ['#468EFD', '#10DA95', '#FE9715', '#00FFFF', '#44EAB1', '#7BDD43', '#FEBE12', '#EBEC2F', '#FA3E5F', '#6635EF', '#FFAFDA']
      option.xAxis[0].data = that.xAxisData
      option.series = []
      that.seriesData.forEach((item, index) => {
        option.series.push({
          name: item.name,
          type: 'bar',
          barWidth: 30,
          itemStyle: {
            normal: {
              barBorderRadius: [5, 5, 0, 0],
              color: color[index % 11]
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top',
              textStyle: {
                color: color[index % 11],
                fontSize: 14
              }
            }
          },
          data: item.data
        })
      })
      if (that.xAxisData.length < 13) {
        option.dataZoom[0].show = false
      } else {
        option.dataZoom[0].show = true
        option.dataZoom[0].start = 0
        option.dataZoom[0].end = Math.min(100, 100 * (13 / (that.xAxisData.length * that.seriesData.length)))
      }

      myChart.setOption(option)
    },
    setChartLine() {
      let that = this
      let options = {
        grid: {
          left: '4%',
          right: '4%',
          bottom: '8%',
          top: '13%',
          containLabel: true
        },
        dataZoom: [
          {
            show: true,
            height: 12,
            xAxisIndex: [0],
            bottom: '3%',
            start: 0,
            end: 100,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#666666'
            },
            textStyle: {
              color: '#fff'
            },
            borderColor: '#90979c'
          }
        ],

        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: [],
          axisLine: {
            lineStyle: {
              color: '#666666',
              width: 1 // 这里是坐标轴的宽度,可以去掉
            }
          },
          splitLine: {
            show: false,
            //  改变轴线颜色
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#666666'],
              type: 'dotted',
              opacity: 0.2
            }
          },
          axisLabel: {
            textStyle: {
              color: '#666666',
              fontSize: 12
            }
          },
          axisTick: {
            show: true
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: '#666666',
              right: 20,
              fontSize: 12
            }
          },

          axisLine: {
            lineStyle: {
              color: '#666666',
              width: 1 // 这里是坐标轴的宽度,可以去掉
            }
          },
          splitLine: {
            show: false,
            //  改变轴线颜色
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#666666'],
              opacity: 0.2
            }
          },
          name: '',
          nameTextStyle: {
            fontSize: '14',
            color: '#666666'
          },

          type: 'value',
          scale: true
        },
        tooltip: {
          confine: true,
          trigger: 'axis'
        },
        legend: {
          // 图例的设置
          show: true, // 是否显示图例
          top: 10,
          right: 10,
          itemWidth: 15, // 图例标记的图形宽度。
          itemHeight: 12, // 图例标记的图形高度。
          itemGap: 20, // 图例每项之间的间隔。
          textStyle: {
            // 图例文字的样式设置
            fontSize: 12,
            color: '#409eff'
          }
        },
        series: []
      }
      let myChart = this.$echarts.init(document.getElementById('lineChart' + that.boxIndex), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reChartLine() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('lineChart' + that.boxIndex), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      option.xAxis[0].data = that.xAxisData
      option.series = []
      let color = ['#468EFD', '#10DA95', '#FE9715', '#00FFFF', '#44EAB1', '#7BDD43', '#FEBE12', '#EBEC2F', '#FA3E5F', '#6635EF', '#FFAFDA']
      that.seriesData.forEach((item, index) => {
        option.series.push({
          name: item.name,
          type: 'line',
          barWidth: 30,
          symbol: 'circle',
          smooth: true,
          symbolSize: 5,
          showSymbol: true,
          label: {
            normal: {
              show: true,
              position: 'top',
              textStyle: {
                color: color[index % 11],
                fontSize: 16
              }
            }
          },
          lineStyle: {
            normal: {
              width: 2
            }
          },
          itemStyle: {
            normal: {
              color: color[index % 11],
              borderColor: color[index % 11],
              borderWidth: 1
            }
          },

          data: item.data
        })
      })

      if (that.xAxisData.length < 13) {
        option.dataZoom[0].show = false
        option.dataZoom[0].show = false
      } else {
        option.dataZoom[0].show = true
        option.dataZoom[0].start = 0
        option.dataZoom[0].end = Math.min(100, 100 * (13 / (that.xAxisData.length * that.seriesData.length)))
      }

      myChart.setOption(option)
    },
    setChartPie() {
      let that = this
      let options = {
        legend: {
          // 图例的设置
          show: true, // 是否显示图例
          top: 'center',
          orient: 'vertical',
          right: 30,
          itemWidth: 12, // 图例标记的图形宽度。
          itemHeight: 8, // 图例标记的图形高度。
          itemGap: 20, // 图例每项之间的间隔。
          textStyle: {
            // 图例文字的样式设置
            fontSize: 12,
            color: '#409eff'
          }
        },
        series: [
          {
            data: [],
            type: 'pie',
            avoidLabelOverlap: true,
            radius: ['0%', '50%'],
            center: ['40%', '50%'],
            color: ['#468EFD', '#10DA95', '#FE9715', '#00FFFF', '#44EAB1', '#7BDD43', '#FEBE12', '#EBEC2F', '#FA3E5F', '#6635EF', '#FFAFDA'],
            itemStyle: {
              normal: {
                borderWidth: 2,
                borderColor: '#ffffff'
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: 20,
                length2: 40,
                lineStyle: {
                  width: 1
                }
              }
            },
            label: {
              normal: {
                formatter: '{c|{b}:{c}}\n{hr|}\n{d|{d}%}',
                rich: {
                  b: {
                    fontSize: 20,
                    color: '#12EABE',
                    align: 'left',
                    padding: 4
                  },
                  hr: {
                    borderColor: '#12EABE',
                    width: '100%',
                    borderWidth: 1,
                    height: 0
                  },
                  d: {
                    fontSize: 14,
                    color: '#409eff',
                    align: 'left',
                    padding: 4
                  },
                  c: {
                    fontSize: 14,
                    color: '#409eff',
                    align: 'left',
                    padding: 4
                  }
                }
              }
            }
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('pieChart' + that.boxIndex), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reChartPie() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('pieChart' + that.boxIndex), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      let temp = []
      that.seriesData[0].data.forEach((item, index) => {
        temp.push({ name: that.xAxisData[index], value: item })
      })
      option.series[0].data = temp
      option.series[0].name = that.seriesData[0].name
      myChart.setOption(option)
    }
  }
}
</script>
    
    <style>
.chatBiDataBox .changeIcon {
  font-size: 20px;
  margin-right: 5px;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}
.chatBiDataBox .changeIcon.changeIconActive {
  color: rgb(38, 130, 250);
  background: #ffffff;
}
.chatBiDataBox .el-table th.el-table__cell {
  background: rgb(38, 130, 250);
  color: #ffffff;
}
.chatBiDataBox .el-loading-spinner .circular {
  height: 30px;
  width: 30px;
}
.chatBiDataBox .el-loading-spinner {
  top: 0;
  margin-top: 0;
}
</style>