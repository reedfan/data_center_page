<template>
  <div style="width: 880px; height: auto; overflow: hidden; position: relative; margin-bottom: 20px" class="chatBiDataBox">
    <el-divider content-position="left" v-if="questionInfo">{{ questionInfo }}</el-divider>
    <div style="width: 878px; transition: 0.3s; height: auto; overflow: hidden auto; background: #ffffff; position: relative" v-if="!tableError">
      <div style="width: 878px; height: 40px; text-align: right">
        <div style="width: auto; height: 40px; float: left; margin-left: 20px; margin-top: 8px" v-if="activeChartType == 'pie' && seriesData.length > 1">
          <el-radio-group v-model="pieActive" size="mini" @change="reChartPie()">
            <el-radio-button v-for="(item, index) in seriesData" :label="item.name" :key="index"></el-radio-button>
          </el-radio-group>
        </div>
        <div style="width: auto; height: 40px; float: right">
          <el-popover placement="left" width="400" trigger="click" v-model="chooseTypeShow">
            <div style="width: 100%; height: auto">
              <div style="width: 100%; height: 80px; overflow: hidden">
                <div class="dataIcon typeIcon" :class="activeChartType == 'data' ? 'typeIconActive' : ''" @click="activeChartType = 'data'"></div>
                <div class="lineIcon typeIcon" :class="activeChartType == 'line' ? 'typeIconActive' : ''" @click="activeChartType = 'line'"></div>
                <div class="barIcon typeIcon" :class="activeChartType == 'bar' ? 'typeIconActive' : ''" @click="activeChartType = 'bar'"></div>
                <div class="pieIcon typeIcon" :class="activeChartType == 'pie' ? 'typeIconActive' : ''" @click="activeChartType = 'pie'"></div>
              </div>
            </div>
            <!-- <div style="width: 100%; height: 28px; margin-top: 20px; overflow: hidden; text-align: right">
              <el-button type="info" size="mini" @click="chooseTypeShow = false">取消</el-button>
              <el-button type="primary" size="mini" @click="">确定</el-button>
            </div> -->
            <i class="el-icon-sort" slot="reference" style="color: #2682fa; height: 28px; line-height: 28px; font-size: 26px; cursor: pointer"></i>
          </el-popover>
        </div>
        <div style="width: auto; height: 40px; float: right; margin-right: 10px">
          <el-popover placement="left" width="120" trigger="click">
            <el-button type="primary" size="mini" style="width: 100%; display: block; margin: 0 auto" @click="exportTableExcel()">导出excel</el-button>
            <el-button type="primary" size="mini" style="width: 100%; display: block; margin: 5px auto 0 auto" @click="exportTableTxt()">导出txt</el-button>
            <el-button type="primary" size="mini" style="width: 100%; display: block; margin: 5px auto 0 auto" @click="exportTableCsv()">导出csv</el-button>
            <i class="el-icon-upload2" slot="reference" style="color: #2682fa; height: 28px; line-height: 28px; font-size: 26px; cursor: pointer"></i>
          </el-popover>
        </div>
      </div>
      <el-table ref="table" :data="tableData" max-height="400" border v-loading="tableLoading" v-show="activeChartType == 'data'">
        <el-table-column type="index" label="序号" align="center" width="79"> </el-table-column>
        <el-table-column :prop="item" :label="item" min-width="250" align="center" v-for="(item, index) in Object.keys(tableData[0])" :key="index">
          <template slot-scope="scope">
            {{ scope.row[item] }}
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 878px; height: 400px; margin: 0 auto" :id="'barChart' + boxIndex" v-show="activeChartType == 'bar'"></div>
      <div style="width: 878px; height: 400px; margin: 0 auto" :id="'lineChart' + boxIndex" v-show="activeChartType == 'line'"></div>
      <div style="width: 878px; height: 400px; margin: 0 auto" :id="'pieChart' + boxIndex" v-show="activeChartType == 'pie'"></div>
    </div>
    <el-empty v-if="tableError" description="查询出错"></el-empty>
  </div>
</template>
    
    <script>
import requestAi from '@/api/requestAi'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
export default {
  name: 'chatBiDataBox',
  props: {
    questionInfo: '',
    id: '',
    sqlStr: null,
    sqlResult: null,
    boxIndex: null
  },
  data() {
    return {
      activeChartType: 'data',
      tableData: [{ '-': '-' }],
      tableLoading: true,
      chooseTypeShow: false,
      tableError: false,
      xAxisList: [],
      xAxisEnum: '',
      yAxisEnum: [],
      xAxisData: [],
      seriesData: [],
      pieActive: ''
    }
  },
  mounted() {
    this.setChartBar()
    this.setChartLine()
    this.setChartPie()
    if (this.sqlResult) {
      if (this.sqlResult == '查询出错') {
        this.tableError = true
        this.tableLoading = false
        return
      }
      let resData = JSON.parse(this.sqlResult)
      let rows = resData.slice(1).map(row => {
        const obj = {}
        row.forEach((item, index) => {
          obj[resData[0][index]] = item
        })
        return obj
      })
      this.xAxisList = resData[0]
      this.xAxisEnum = resData[0][0]
      this.yAxisEnum = resData[0].slice(1)

      console.log(rows)
      console.log(this.xAxisList)
      console.log(this.xAxisEnum)
      console.log(this.yAxisEnum)

      this.tableData = rows
      this.reChartAll(resData[0].length > 2)
      this.tableLoading = false
    } else {
      this.getData()
    }
  },
  methods: {
    getData() {
      let that = this
      that.tableLoading = true
      requestAi({ url: '/chat_bi/sql_result', method: 'get', params: { id: that.id } }).then(res => {
        if (res.data) {
          if (res.data == '查询出错') {
            that.tableError = true
            that.tableLoading = false
          } else {
            let resData = JSON.parse(res.data)
            console.log(resData)
            if (resData && resData[0]) {
              that.xAxisList = resData[0]
              that.xAxisEnum = resData[0][0]
              that.yAxisEnum = resData[0].slice(1)
              let rows = resData.slice(1).map(row => {
                const obj = {}
                row.forEach((item, index) => {
                  obj[resData[0][index]] = item
                })
                return obj
              })
              console.log(rows)
              console.log(that.xAxisList)
              console.log(that.xAxisEnum)
              console.log(that.yAxisEnum)

              that.tableData = rows
              that.reChartAll(resData[0].length > 2)
              that.tableLoading = false
            }
          }
        } else {
          setTimeout(() => {
            that.getData()
          }, 1000)
        }
      })
    },
    reChartAll(flag) {
      let that = this
      if (flag) {
        // requestAi({ url: '/chat_bi/field_info', method: 'get', params: { id: that.id } }).then(res => {
        //   if (res.data) {
        //     let resData = JSON.parse(res.data)
        //     console.log(resData)
        //     that.xAxisData = resData.xAxis.data
        //     that.seriesData = resData.series
        //     that.pieActive = that.seriesData[0].name
        //     console.log(that.xAxisData)
        //     console.log(that.seriesData)
        //     that.reChartBar()
        //     that.reChartLine()
        //     that.reChartPie()
        //   }
        // })
        that.xAxisData = []
        that.tableData.forEach(item => {
          console.log(item)
          that.xAxisData.push(item[that.xAxisEnum] + ' ' + item[that.yAxisEnum[0]])
        })
        that.seriesData = []
        that.yAxisEnum.forEach((item, index) => {
          let seriesItem = { name: item, data: [] }
          that.tableData.forEach(row => {
            seriesItem.data.push(row[item])
          })
          if (index > 0) {
            that.seriesData.push(seriesItem)
          }
        })
        that.pieActive = that.seriesData[0].name
        console.log(that.xAxisData)
        console.log(that.seriesData)
        that.reChartBar()
        that.reChartLine()
        that.reChartPie()
      } else {
        that.xAxisData = []
        that.tableData.forEach(item => {
          that.xAxisData.push(item[that.xAxisEnum])
        })
        that.seriesData = []
        that.yAxisEnum.forEach(item => {
          let seriesItem = { name: item, data: [] }
          that.tableData.forEach(row => {
            seriesItem.data.push(row[item])
          })
          that.seriesData.push(seriesItem)
        })
        that.pieActive = that.seriesData[0].name
        console.log(that.xAxisData)
        console.log(that.seriesData)
        that.reChartBar()
        that.reChartLine()
        that.reChartPie()
      }
    },
    setChartBar() {
      let that = this
      let options = {
        toolbox: {
          show: true,
          right: 50,
          feature: {
            saveAsImage: { show: true }
          }
        },
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
          right: 100,
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
      if (that.xAxisData.length * that.seriesData.length < 13) {
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
        toolbox: {
          show: true,
          right: 50,
          feature: {
            saveAsImage: { show: true }
          }
        },
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
          right: 100,
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

      if (that.xAxisData.length * that.seriesData.length < 13) {
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
        toolbox: {
          show: true,
          right: 50,
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          // 图例的设置
          show: true, // 是否显示图例
          top: 'center',
          orient: 'vertical',
          right: 100,
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
                // formatter: '{c|{b}:{c}}\n{hr|}\n{d|{d}%}',
                formatter: '{c|{c}}\n{hr|}\n{d|{d}%}',
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
                    color: '#12EABE',
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
      let tempSeriesData = that.seriesData.filter(item => {
        return item.name == that.pieActive
      })
      console.log(tempSeriesData)
      tempSeriesData[0].data.forEach((item, index) => {
        temp.push({ name: that.xAxisData[index], value: item })
      })
      option.series[0].data = temp
      option.series[0].name = tempSeriesData[0].name
      myChart.setOption(option)
    },
    exportTableExcel() {
      const worksheet = XLSX.utils.json_to_sheet(this.tableData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      XLSX.writeFile(workbook, (this.questionInfo || '表格数据') + '.xlsx')
    },
    exportTableCsv() {
      const worksheet = XLSX.utils.json_to_sheet(this.tableData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      XLSX.writeFile(workbook, (this.questionInfo || '表格数据') + '.csv')
    },
    exportTableTxt(t) {
      const file = new File([JSON.stringify(this.tableData)], (this.questionInfo || '表格数据') + '.txt', {
        type: 'text/plain;charset=utf-8'
      })
      saveAs(file)
    }
  }
}
</script>
    
    <style>
.typeIcon {
  padding: 10px;
  width: 60px;
  height: 60px;
  float: left;
  margin-left: 20px;
  cursor: pointer;
  border-radius: 4px;
}
.typeIcon:nth-child(1) {
  margin-left: 10px;
}
.typeIcon.typeIconActive,
.typeIcon:hover {
  background-color: rgba(38, 130, 250, 0.2);
}
.chatBiDataBox .el-table th.el-table__cell {
  background: rgb(38, 130, 250);
  color: #ffffff;
}
</style>