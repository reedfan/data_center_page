<template>
  <div style="width: 100%; height: 100%; overflow: hidden auto" class="manageMain qualityView" ref="qualityView">
    <div class="main-unit" style="width: 100%; height: 70px; position: relative; overflow: hidden">
      <div style="width: 96%; height: 40px; margin: 15px auto 0 auto; overflow: hidden">
        <p class="searchLabel" style="width: auto">数据源类型:</p>
        <div style="width: 13%; height: 40px; float: left; margin: 0 1%">
          <el-select v-model="queryForm.type" filterable placeholder="请选择" @change="">
            <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <el-radio-group v-model="queryForm.date" size="small" style="float: right; margin-top: 5px">
          <el-radio-button label="近7天">近7天</el-radio-button>
          <el-radio-button label="近30天">近30天</el-radio-button>
          <el-radio-button label="近60天">近60天</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div style="width: 100%; height: calc(100% - 75px); overflow: hidden auto; margin-top: 5px">
      <div class="main-unit" style="width: 100%; height: 400px; position: relative; overflow: hidden">
        <div style="width: 98%; height: 40px; margin: 0 auto; overflow: hidden; border-bottom: 1px solid rgba(0, 122, 255, 0.5)">
          <p style="width: auto; height: 40px; line-height: 40px; font-size: 16px; text-align: center; color: #007aff; float: left">表质量平均分</p>
        </div>
        <div style="width: 98%; height: 340px; margin: 10px auto; overflow: hidden">
          <div style="width: 340px; height: 340px; float: left">
            <p style="width: 300px; height: 40px; line-height: 40px; font-size: 14px; text-align: left; color: #007aff; margin: 0 auto">今日表质量平均分</p>
            <div style="width: 280px; height: 260px; margin: 0 auto" id="topChart1"></div>
          </div>
          <div style="width: 340px; height: 340px; float: left; margin-left: 10px">
            <p style="width: 300px; height: 40px; line-height: 40px; font-size: 14px; text-align: left; color: #007aff; margin: 0 auto">检验类型平均分</p>
            <div style="width: 280px; height: 260px; margin: 0 auto" id="topChart2"></div>
          </div>
          <div style="width: 1px; height: 340px; float: left; background-color: rgba(0, 122, 255, 0.3); margin-left: 10px"></div>
          <div style="width: calc(100% - 710px); height: 340px; float: right">
            <p style="width: calc(100% - 40px); height: 40px; line-height: 40px; font-size: 14px; text-align: left; color: #007aff; margin: 0 auto">历史趋势</p>
            <div style="width: calc(100% - 40px); height: 280px; margin: 0 auto" id="topChart3"></div>
          </div>
        </div>
      </div>
      <div class="main-unit" style="width: 100%; height: 400px; position: relative; overflow: hidden; margin-top: 5px">
        <div style="width: 98%; height: 40px; margin: 0 auto; overflow: hidden; border-bottom: 1px solid rgba(0, 122, 255, 0.5)">
          <p style="width: auto; height: 40px; line-height: 40px; font-size: 16px; text-align: center; color: #007aff; float: left">监控配置情况</p>
        </div>
        <div style="width: 98%; height: 340px; margin: 10px auto; overflow: hidden">
          <div style="width: 240px; height: 340px; float: left">
            <div style="width: 200px; height: 300px; margin: 20px auto; overflow: hidden">
              <div style="width: 200px; height: 80px; margin-top: 10px; overflow: hidden" class="jkzl">
                <p style="width: 160px; height: 30px; line-height: 30px; font-size: 18px; text-align: left; color: #ffffff; margin: 5px auto 0 auto">监控总量</p>
                <p style="width: 160px; height: 40px; line-height: 40px; font-size: 36px; text-align: left; color: #ffffff; margin: 0 auto">52</p>
              </div>
              <div style="width: 200px; height: 80px; margin-top: 20px; overflow: hidden" class="xsddjk">
                <p style="width: 160px; height: 30px; line-height: 30px; font-size: 18px; text-align: left; color: #ffffff; margin: 5px auto 0 auto">线上调度监控</p>
                <p style="width: 160px; height: 40px; line-height: 40px; font-size: 36px; text-align: left; color: #ffffff; margin: 0 auto">8</p>
              </div>
              <div style="width: 200px; height: 80px; margin-top: 20px; overflow: hidden" class="bfgl">
                <p style="width: 160px; height: 30px; line-height: 30px; font-size: 18px; text-align: left; color: #ffffff; margin: 5px auto 0 auto">表覆盖量</p>
                <p style="width: 160px; height: 40px; line-height: 40px; font-size: 36px; text-align: left; color: #ffffff; margin: 0 auto">7</p>
              </div>
            </div>
          </div>
          <div style="width: 440px; height: 340px; float: left; margin-left: 10px">
            <div style="width: 400px; height: 300px; margin: 20px auto" id="middleChart2"></div>
          </div>
          <div style="width: 1px; height: 340px; float: left; background-color: rgba(0, 122, 255, 0.3); margin-left: 10px"></div>
          <div style="width: calc(100% - 710px); height: 340px; float: right">
            <p style="width: calc(100% - 40px); height: 40px; line-height: 40px; font-size: 14px; text-align: left; color: #007aff; margin: 0 auto">历史趋势</p>
            <div style="width: calc(100% - 40px); height: 280px; margin: 0 auto" id="middleChart3"></div>
          </div>
        </div>
      </div>
      <div class="main-unit" style="width: 100%; height: 400px; position: relative; overflow: hidden; margin-top: 5px">
        <div style="width: 98%; height: 40px; margin: 0 auto; overflow: hidden; border-bottom: 1px solid rgba(0, 122, 255, 0.5)">
          <p style="width: auto; height: 40px; line-height: 40px; font-size: 16px; text-align: center; color: #007aff; float: left">调度监控执行情况</p>
        </div>
        <div style="width: 98%; height: 340px; margin: 10px auto; overflow: hidden">
          <div style="width: 340px; height: 340px; float: left">
            <div style="width: 300px; height: 300px; margin: 20px auto" id="bottomChart1"></div>
          </div>
          <div style="width: 340px; height: 340px; float: left; margin-left: 10px">
            <div style="width: 300px; height: 300px; margin: 20px auto" id="bottomChart2"></div>
          </div>
          <div style="width: 1px; height: 340px; float: left; background-color: rgba(0, 122, 255, 0.3); margin-left: 10px"></div>
          <div style="width: calc(100% - 710px); height: 340px; float: right">
            <p style="width: calc(100% - 40px); height: 40px; line-height: 40px; font-size: 14px; text-align: left; color: #007aff; margin: 0 auto">历史趋势</p>
            <div style="width: calc(100% - 40px); height: 280px; margin: 0 auto" id="bottomChart3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import resizeDetector from 'element-resize-detector'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'qualityView',
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

      dataTypeList: [],
      queryForm: {
        type: '',
        date: '近7天'
      }
    }
  },
  mounted() {
    this.getDataTypeList()
    setTimeout(() => {
      this.setTopChart1()
      this.setTopChart2()
      this.setTopChart3()
      this.setMiddleChart2()
      this.setMiddleChart3()
      this.setBottomChart1()
      this.setBottomChart2()
      this.setBottomChart3()
      this.reTopChart1()
      this.reTopChart2()
      this.reTopChart3()
      this.reMiddleChart2()
      this.reMiddleChart3()
      this.reBottomChart1()
      this.reBottomChart2()
      this.reBottomChart3()
    }, 100)
    let erd = resizeDetector()
    erd.listenTo(this.$refs.qualityView, () => {
      this.$nextTick(function () {
        this.$echarts.init(document.getElementById('topChart1')).resize()
        this.$echarts.init(document.getElementById('topChart2')).resize()
        this.$echarts.init(document.getElementById('topChart3')).resize()
        this.$echarts.init(document.getElementById('middleChart2')).resize()
        this.$echarts.init(document.getElementById('middleChart3')).resize()
        this.$echarts.init(document.getElementById('bottomChart1')).resize()
        this.$echarts.init(document.getElementById('bottomChart2')).resize()
        this.$echarts.init(document.getElementById('bottomChart3')).resize()
      })
    })
  },
  methods: {
    // 获取数据源类型list
    getDataTypeList() {
      let that = this
      request({ url: '/data_source/type/list', method: 'get', params: {} }).then(res => {
        that.dataTypeList = res.data
        that.queryForm.type = 'Hive'
      })
    },
    setTopChart1() {
      let that = this
      let options = {
        backgroundColor: '#fff',
        tooltip: {
          show: false
        },

        series: [
          {
            name: '内部进度条',
            type: 'gauge',
            radius: '60%',
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [0 / 100, '#468EFD'],
                  [1, '#111F42']
                ],
                width: 8
              }
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            itemStyle: {
              show: false
            },
            detail: {
              formatter: function () {
                return ''
              },
              offsetCenter: [0, 130],
              textStyle: {
                padding: [0, 0, 0, 0],
                fontSize: 20,
                fontWeight: '700',
                color: '#324063'
              }
            },
            title: {
              // 标题
              show: true,
              offsetCenter: [0, 90], // x, y，单位px
              textStyle: {
                color: '#2D99FF',
                fontSize: 30, // 表盘上的标题文字大小
                fontWeight: 700,
                fontFamily: 'PingFangSC'
              }
            },
            data: [],
            pointer: {
              show: true,
              length: '75%',
              radius: '20%',
              width: 10 // 指针粗细
            },
            animationDuration: 4000
          },
          {
            name: '外部刻度',
            type: 'gauge',
            radius: '75%',
            min: 0,
            max: 100,
            splitNumber: 10, // 刻度数量
            startAngle: 225,
            endAngle: -45,
            axisLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: [[1, 'rgba(0,0,0,0)']]
              }
            }, // 仪表盘轴线
            axisLabel: {
              show: true,
              color: '#4d5bd1',
              distance: 20,
              formatter: function (v) {
                switch (v + '') {
                  case '0':
                    return '0'
                  case '10':
                    return '10'
                  case '20':
                    return '20'
                  case '30':
                    return '30'
                  case '40':
                    return '40'
                  case '50':
                    return '50'
                  case '60':
                    return '60'
                  case '70':
                    return '70'
                  case '80':
                    return '80'
                  case '90':
                    return '90'
                  case '100':
                    return '100'
                }
              }
            }, // 刻度标签。
            axisTick: {
              show: true,
              splitNumber: 7,
              lineStyle: {
                color: '#468EFD', // 用颜色渐变函数不起作用
                width: 1
              },
              length: -8
            }, // 刻度样式
            splitLine: {
              show: true,
              length: -20,
              lineStyle: {
                color: '#468EFD' // 用颜色渐变函数不起作用
              }
            }, // 分隔线样式
            detail: {
              show: false
            },
            pointer: {
              show: false
            }
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('topChart1'), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reTopChart1() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('topChart1'), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      option.series[0].axisLine.lineStyle.color = [
        [70 / 100, '#468EFD'],
        [1, '#E4E7ED']
      ]
      option.series[0].data = [
        {
          name: 70,
          value: 70
        }
      ]
      myChart.setOption(option)
    },
    setTopChart2() {
      let that = this
      let options = {
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'item',
          appendToBody: true
        },
        radar: {
          radius: '70%',
          name: {
            textStyle: {
              color: '#468EFD',
              fontSize: 12
            }
          },
          splitArea: {
            areaStyle: {
              color: ['rgba(0, 0, 0, 0)', 'rgba(87, 203, 204, 0.1)', 'rgba(0, 0, 0, 0)', 'rgba(87, 203, 204, 0.1)', 'rgba(0, 0, 0, 0)', 'rgba(87, 203, 204, 0.1)'],
              shadowColor: 'rgba(255, 255, 255, 1)',
              shadowBlur: 40
            }
          },
          indicator: [
            { text: '有效性', max: 100 },
            { text: '完整性', max: 100 },
            { text: '唯一性', max: 100 },
            { text: '准确性', max: 100 },
            { text: '一致性', max: 100 },
            { text: '及时性', max: 100 },
            { text: '其他', max: 100 }
          ]
        },
        series: [
          {
            name: '',
            type: 'radar',
            symbol: 'none',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#468EFD'
                  // shadowColor: '#4BFFFC',
                  // shadowBlur: 10,
                },
                shadowColor: '#468EFD',
                shadowBlur: 10
              }
            },
            areaStyle: {
              normal: {
                // 单项区域填充样式
                color: {
                  type: 'radial',
                  x: 0.5, // 右
                  y: 0.5, // 下
                  r: 1,
                  colorStops: [
                    {
                      offset: 1,
                      color: '#468EFD'
                    },
                    {
                      offset: 0,
                      color: 'rgba(0,0,0,0)'
                    }
                  ],
                  globalCoord: false
                },
                opacity: 0.8 // 区域透明度
              }
            },

            data: []
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('topChart2'), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reTopChart2() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('topChart2'), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      option.series[0].data = [
        {
          name: '检验类型平均分',
          value: [50, 60, 40, 40, 80, 70, 90]
        }
      ]
      myChart.setOption(option)
    },
    setTopChart3() {
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
              fontSize: 16
            }
          },
          axisTick: {
            show: true
          }
        },
        yAxis: {
          min: 0,
          max: 100,
          axisLabel: {
            textStyle: {
              color: '#409eff',
              right: 20,
              fontSize: 16
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
          data: ['表质量平均分'] // 图例的名称数据
        },
        series: [
          {
            name: '表质量平均分',
            type: 'line',
            barWidth: 30,
            symbol: 'circle',
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
                color: '#468EFD',
                borderColor: '#468EFD',
                borderWidth: 1
              }
            },

            data: []
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('topChart3'), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reTopChart3() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('topChart3'), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      option.xAxis[0].data = ['8-9', '8-10', '8-11', '8-12', '8-13', '8-14', '8-15']
      option.series[0].data = [50, 60, 60, 60, 60, 70, 70]
      myChart.setOption(option)
    },
    setMiddleChart2() {
      let that = this
      let options = {
        title: {
          text: '',
          subtext: '配置总量',
          x: 'center',
          y: '30%',
          textStyle: {
            fontSize: 28,
            fontWeight: 'normal',
            color: '#468EFD'
          },
          subtextStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            align: 'center',
            color: '#909399'
          }
        },
        legend: {
          // 图例的设置
          show: true, // 是否显示图例
          bottom: 10,
          left: 'center',
          itemWidth: 12, // 图例标记的图形宽度。
          itemHeight: 8, // 图例标记的图形高度。
          itemGap: 20, // 图例每项之间的间隔。
          textStyle: {
            // 图例文字的样式设置
            fontSize: 12,
            color: '#409eff'
          },
          data: ['准确性校验', '完整性校验', '有效性校验', '唯一性校验', '一致性校验', '及时性校验', '其他'] // 图例的名称数据
        },
        series: [
          {
            type: 'pie',
            radius: ['70%', '50%'],
            center: ['50%', '40%'],
            color: ['#468EFD', '#10DA95', '#FE9715'],
            itemStyle: {
              normal: {
                borderWidth: 5,
                borderColor: '#ffffff'
              }
            }
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('middleChart2'), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reMiddleChart2() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('middleChart2'), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      option.series[0].data = [
        { name: '准确性校验', value: 60 },
        { name: '完整性校验', value: 60 },
        { name: '有效性校验', value: 60 },
        { name: '唯一性校验', value: 60 },
        { name: '一致性校验', value: 60 },
        { name: '及时性校验', value: 40 },
        { name: '其他', value: 40 }
      ]
      option.title[0].text = '380'
      myChart.setOption(option)
    },
    setMiddleChart3() {
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
              fontSize: 16
            }
          },
          axisTick: {
            show: true
          }
        },
        yAxis: {
          min: 0,
          max: 100,
          axisLabel: {
            textStyle: {
              color: '#409eff',
              right: 20,
              fontSize: 16
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
          data: ['线上调度监控', '配置规则总量', '表覆盖量'] // 图例的名称数据
        },
        series: [
          {
            name: '线上调度监控',
            type: 'line',
            barWidth: 30,
            symbol: 'circle',
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
                color: '#468EFD',
                borderColor: '#468EFD',
                borderWidth: 1
              }
            },

            data: []
          },
          {
            name: '配置规则总量',
            type: 'line',
            barWidth: 30,
            symbol: 'circle',
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
                color: '#10DA95',
                borderColor: '#10DA95',
                borderWidth: 1
              }
            },

            data: []
          },
          {
            name: '表覆盖量',
            type: 'line',
            barWidth: 30,
            symbol: 'circle',
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
                color: '#FE9715',
                borderColor: '#FE9715',
                borderWidth: 1
              }
            },

            data: []
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('middleChart3'), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reMiddleChart3() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('middleChart3'), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      option.xAxis[0].data = ['8-9', '8-10', '8-11', '8-12', '8-13', '8-14', '8-15']
      option.series[0].data = [50, 60, 60, 60, 60, 70, 70]
      option.series[1].data = [40, 50, 50, 50, 50, 60, 60]
      option.series[2].data = [30, 40, 40, 40, 40, 50, 50]
      myChart.setOption(option)
    },
    setBottomChart1() {
      let that = this
      let options = {
        title: {
          text: '',
          subtext: '已调度监控总量',
          x: 'center',
          y: '30%',
          textStyle: {
            fontSize: 28,
            fontWeight: 'normal',
            color: '#468EFD'
          },
          subtextStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            align: 'center',
            color: '#909399'
          }
        },
        legend: {
          // 图例的设置
          show: true, // 是否显示图例
          bottom: 10,
          left: 'center',
          itemWidth: 12, // 图例标记的图形宽度。
          itemHeight: 8, // 图例标记的图形高度。
          itemGap: 20, // 图例每项之间的间隔。
          textStyle: {
            // 图例文字的样式设置
            fontSize: 12,
            color: '#409eff'
          },
          data: ['异常监控量', '失败监控量'] // 图例的名称数据
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '35%'],
            center: ['50%', '40%'],
            color: ['#468EFD', '#10DA95', '#FE9715'],
            itemStyle: {
              normal: {
                borderWidth: 5,
                borderColor: '#ffffff'
              }
            }
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('bottomChart1'), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reBottomChart1() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('bottomChart1'), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      option.series[0].data = [
        { name: '异常监控量', value: 80 },
        { name: '失败监控量', value: 40 }
      ]
      option.title[0].text = '120'
      myChart.setOption(option)
    },
    setBottomChart2() {
      let that = this
      let options = {
        title: {
          text: '',
          subtext: '异常总量',
          x: 'center',
          y: '30%',
          textStyle: {
            fontSize: 28,
            fontWeight: 'normal',
            color: '#468EFD'
          },
          subtextStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            align: 'center',
            color: '#909399'
          }
        },
        legend: {
          // 图例的设置
          show: true, // 是否显示图例
          bottom: 10,
          left: 'center',
          itemWidth: 10, // 图例标记的图形宽度。
          itemHeight: 6, // 图例标记的图形高度。
          itemGap: 10, // 图例每项之间的间隔。
          textStyle: {
            // 图例文字的样式设置
            fontSize: 10,
            color: '#409eff'
          },
          data: ['准确性校验', '完整性校验', '有效性校验', '唯一性校验', '一致性校验', '及时性校验', '其他'] // 图例的名称数据
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '35%'],
            center: ['50%', '40%'],
            color: ['#468EFD', '#10DA95', '#FE9715'],
            itemStyle: {
              normal: {
                borderWidth: 5,
                borderColor: '#ffffff'
              }
            }
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('bottomChart2'), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reBottomChart2() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('bottomChart2'), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      option.series[0].data = [
        { name: '准确性校验', value: 60 },
        { name: '完整性校验', value: 60 },
        { name: '有效性校验', value: 60 },
        { name: '唯一性校验', value: 60 },
        { name: '一致性校验', value: 60 },
        { name: '及时性校验', value: 40 },
        { name: '其他', value: 40 }
      ]
      option.title[0].text = '380'
      myChart.setOption(option)
    },
    setBottomChart3() {
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
              fontSize: 16
            }
          },
          axisTick: {
            show: true
          }
        },
        yAxis: {
          min: 0,
          max: 100,
          axisLabel: {
            textStyle: {
              color: '#409eff',
              right: 20,
              fontSize: 16
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
          data: ['异常监控量', '失败监控量', '异常规则总量'] // 图例的名称数据
        },
        series: [
          {
            name: '异常监控量',
            type: 'line',
            barWidth: 30,
            symbol: 'circle',
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
                color: '#468EFD',
                borderColor: '#468EFD',
                borderWidth: 1
              }
            },

            data: []
          },
          {
            name: '失败监控量',
            type: 'line',
            barWidth: 30,
            symbol: 'circle',
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
                color: '#10DA95',
                borderColor: '#10DA95',
                borderWidth: 1
              }
            },

            data: []
          },
          {
            name: '异常规则总量',
            type: 'line',
            barWidth: 30,
            symbol: 'circle',
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
                color: '#FE9715',
                borderColor: '#FE9715',
                borderWidth: 1
              }
            },

            data: []
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('bottomChart3'), null, { devicePixelRatio: 2 })
      myChart.setOption(options)
      myChart.on('click', function (params) {})
    },
    reBottomChart3() {
      let that = this
      let myChart = that.$echarts.init(document.getElementById('bottomChart3'), null, { devicePixelRatio: 2 })
      let option = myChart.getOption()
      option.xAxis[0].data = ['8-9', '8-10', '8-11', '8-12', '8-13', '8-14', '8-15']
      option.series[0].data = [50, 60, 60, 60, 60, 70, 70]
      option.series[1].data = [40, 50, 50, 50, 50, 60, 60]
      option.series[2].data = [30, 40, 40, 40, 40, 50, 50]
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
