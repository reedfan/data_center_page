<template>
  <div style="width: 880px; height: auto; overflow: hidden; position: relative" class="chatBiDataBox">
    <div style="width: 878px; transition: 0.3s; height: 452px; overflow: hidden auto; background: #ffffff; position: relative; border: 1px solid #e1e2e5; border-radius: 8px; box-sizing: border-box">
      <div style="width: 858px; height: 30px; margin: 0; padding: 10px; position: relative; overflow: hidden; text-align: left; background-color: #f5f6fa">
        <i v-if="activeShowType == 'chart'" class="el-icon-notebook-2 changeIcon" :class="activeChartType == 'data' ? 'changeIconActive' : ''" @click="activeChartType = 'data'"></i>
        <i v-if="canChart && activeShowType == 'chart'" class="el-icon-data-analysis changeIcon" :class="activeChartType == 'bar' ? 'changeIconActive' : ''" @click="activeChartType = 'bar'"></i>
        <i v-if="canChart && activeShowType == 'chart'" class="el-icon-data-line changeIcon" :class="activeChartType == 'line' ? 'changeIconActive' : ''" @click="activeChartType = 'line'"></i>
        <i v-if="canChart && activeShowType == 'chart'" class="el-icon-pie-chart changeIcon" :class="activeChartType == 'pie' ? 'changeIconActive' : ''" @click="activeChartType = 'pie'"></i>
        <p v-if="activeShowType == 'report'" style="color: #2c3e50; font-size: 16px; height: 30px; line-height: 30px; margin: 0; width: auto">数据总结</p>
        <p v-if="activeShowType == 'analysis'" style="color: #2c3e50; font-size: 16px; height: 30px; line-height: 30px; margin: 0; width: auto">归因分析</p>
        <div style="position: absolute; height: 30px; overflow: hidden; width: auto; right: 20px; top: 10px; cursor: pointer">
          <p style="float: right; height: 30px; line-height: 30px; margin: 0; color: #2682fa; font-size: 14px; text-align: center; float: left; margin-left: 15px" @click="activeShowType = 'chart'">图表数据</p>
          <p v-if="canReport" style="float: right; height: 30px; line-height: 30px; margin: 0; color: #2682fa; font-size: 14px; text-align: center; float: left; margin-left: 15px" @click="activeShowType = 'report'">数据总结</p>
          <p v-if="canAnalysis" style="float: right; height: 30px; line-height: 30px; margin: 0; color: #2682fa; font-size: 14px; text-align: center; float: left; margin-left: 15px" @click="activeShowType = 'analysis'">归因分析</p>
        </div>
        <!-- <div style="position: absolute; height: 30px; overflow: hidden; width: auto; right: 20px; top: 10px; cursor: pointer" @click="showChart()" v-if="reportShow">
          <p style="float: left; height: 30px; line-height: 30px; margin: 0; color: #2682fa; font-size: 14px; text-align: center">图表数据</p>
          <i class="el-icon-d-arrow-right" style="color: #2682fa; font-size: 14px; margin-left: 3px; margin-top: 8px; float: right"></i>
        </div> -->
      </div>
      <div style="width: 878px; height: 400px; overflow: hidden">
        <div style="width: 878px; transition: 0.3s; height: 400px; overflow: hidden" :style="activeShowType == 'chart' ? 'margin-top:0px;' : 'margin-top:-400px;'">
          <el-table ref="table" :data="boxData" height="400" v-show="activeChartType == 'data'">
            <el-table-column type="index" label="序号" align="center" width="79"> </el-table-column>
            <el-table-column :prop="item" :label="item" min-width="260" align="center" v-for="(item, index) in Object.keys(boxData[0])" :key="index">
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
      activeChartType: 'data',
      activeShowType: 'chart',
      canChart: false,
      xAxisKey: '',
      yAxisKey: '',
      showType: 'chart',
      canReport: false,
      canAnalysis: false,
      analysisText: '',
      reportText: ''
    }
  },
  mounted() {
    console.log(this.boxData)
    console.log(this.boxIndex)
    console.log(this.sql)
    console.log(this.question)
    this.getDetail()
  },
  methods: {
    getDetail() {
      let that = this
      request({ url: '/chat_bi/get', method: 'get', params: { id: that.id } }).then(res => {
        if (res.data.fieldInfo && JSON.parse(res.data.fieldInfo).xAxis && JSON.parse(res.data.fieldInfo).yAxis) {
          that.canChart = true
          that.xAxisKey = JSON.parse(res.data.fieldInfo).xAxis
          that.yAxisKey = JSON.parse(res.data.fieldInfo).yAxis
          setTimeout(() => {
            this.setChartBar()
            this.reChartBar()
            this.setChartLine()
            this.reChartLine()
            this.setChartPie()
            this.reChartPie()
          }, 1000)
        } else {
          that.canChart = false
        }
        if (res.data.reportInfo) {
          that.canReport = true
          that.reportText = res.data.reportInfo
        } else {
          that.canReport = false
          that.reportText = ''
        }
        if (res.data.attributionAnalysis) {
          that.canAnalysis = true
          that.analysisText = res.data.attributionAnalysis
        } else {
          that.canAnalysis = false
          that.analysisText = ''
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
          bottom: '5%',
          top: '13%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: [],
          axisLine: {
            lineStyle: {
              color: '#409eff',
              width: 1 // 这里是坐标轴的宽度,可以去掉
            }
          },
          splitLine: {
            show: false,
            //  改变轴线颜色
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#6E7171'],
              type: 'dotted',
              opacity: 0.2
            }
          },
          axisLabel: {
            textStyle: {
              color: '#409eff',
              fontSize: 14
            }
          },
          axisTick: {
            show: true
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: '#409eff',
              right: 20,
              fontSize: 14
            }
          },

          axisLine: {
            lineStyle: {
              color: '#409eff',
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

          name: '',
          nameTextStyle: {
            fontSize: '14',
            color: '#409eff'
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
            fontSize: 14,
            color: '#409eff'
          },
          data: [] // 图例的名称数据
        },
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: 30,

            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: '#468EFD'
              }
            },
            label: {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#409eff',
                  fontSize: 14
                }
              }
            },
            data: []
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('barChart' + that.boxIndex), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reChartBar() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('barChart' + that.boxIndex), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      let tempXData = []
      let tempData = []
      that.boxData.forEach(element => {
        tempXData.push(element[that.xAxisKey])
        tempData.push(element[that.yAxisKey])
      })
      option.xAxis[0].data = tempXData
      option.series[0].data = tempData
      myChart.setOption(option)
    },
    setChartLine() {
      let that = this
      let options = {
        grid: {
          left: '4%',
          right: '4%',
          bottom: '5%',
          top: '13%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: [],
          axisLine: {
            lineStyle: {
              color: '#409eff',
              width: 1 // 这里是坐标轴的宽度,可以去掉
            }
          },
          splitLine: {
            show: false,
            //  改变轴线颜色
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#6E7171'],
              type: 'dotted',
              opacity: 0.2
            }
          },
          axisLabel: {
            textStyle: {
              color: '#409eff',
              fontSize: 14
            }
          },
          axisTick: {
            show: true
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: '#409eff',
              right: 20,
              fontSize: 14
            }
          },

          axisLine: {
            lineStyle: {
              color: '#409eff',
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

          name: '',
          nameTextStyle: {
            fontSize: '14',
            color: '#409eff'
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
            fontSize: 14,
            color: '#409eff'
          },
          data: [] // 图例的名称数据
        },
        series: [
          {
            name: '',
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
                  color: '#409eff',
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
                color: '#468EFD',
                borderColor: '#468EFD',
                borderWidth: 1
              }
            },

            data: []
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('lineChart' + that.boxIndex), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reChartLine() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('lineChart' + that.boxIndex), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      let tempXData = []
      let tempData = []
      that.boxData.forEach(element => {
        tempXData.push(element[that.xAxisKey])
        tempData.push(element[that.yAxisKey])
      })
      option.xAxis[0].data = tempXData
      option.series[0].data = tempData
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
      that.boxData.forEach(element => {
        temp.push({ name: element[that.xAxisKey], value: element[that.yAxisKey] })
      })
      option.series[0].data = temp

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
  background: #ffffff;
}
</style>