
<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain groupJob">
    <div style="width: 100%; height: calc(100% - 0px); position: relative; overflow: hidden">
      <div class="main-unit" style="width: 100%; height: 100%; position: relative; overflow: hidden" id="containerField"></div>
    </div>
  </div>
</template>

<script>
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
import { Graph } from '@antv/x6'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Dnd } from '@antv/x6-plugin-dnd'
import { register, getTeleport } from '@antv/x6-vue-shape'
import { Selection } from '@antv/x6-plugin-selection'
import graphNodeBloodField from './graphNodeBloodField.vue'
register({
  shape: 'bloodNodeField',
  component: graphNodeBloodField
})
export default {
  props: {
    tableName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rules: {
        test: []
      },
      ports: {
        groups: {
          temp: {
            position: {
              name: 'absolute',
              args: { x: 0, y: 0 }
            },
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 2,
                fill: '#fff'
              }
            }
          }
        },
        items: []
      },
      graph: null,
      tabelBloodData: '',

      nodes: [],
      edges: [],
      tempEdge: {},

      dialogShowConnect: false,
      addOrEditConnect: true,
      formConnect: {
        connectType: '',
        connectList: [{ source: '', target: '' }]
      },
      tableNameLeft: '',
      columnsDataLeft: [],
      tableNameRight: '',
      columnsDataRight: []
    }
  },
  mounted() {
    this.getTableBloodData()
  },
  methods: {
    getGraphData() {
      console.log(this.graph.getSelectedCells())
      console.log(this.graph.toJSON())
    },
    getTableBloodData() {
      let that = this
      that.nodes = []
      that.edges = []
      let portsMaster = JSON.parse(JSON.stringify(that.ports))
      let portsPrev = JSON.parse(JSON.stringify(that.ports))
      let portsNext = JSON.parse(JSON.stringify(that.ports))
      let fieldsMaster = [{ tableName: that.tableName, fields: [] }]
      let fieldsPrev = []
      let fieldsNext = []
      request({ url: '/table_field_blood/get', method: 'get', params: { tableName: that.tableName } }).then(res => {
        // that.tabelBloodData = {
        //   fromTableSet: ['A', 'B', 'C', 'D'],
        //   toTableSet: ['X', 'Y', 'Z'],
        //   tableFieldBloodDtoList: [
        //     {
        //       fieldStr: 'field1',
        //       fromFieldBloodDtoList: [
        //         { fieldStr: 'field1Prev1', tableStr: 'A' },
        //         { fieldStr: 'field1Prev2', tableStr: 'B' },
        //         { fieldStr: 'field1Prev3', tableStr: 'C' },
        //         { fieldStr: 'field1Prev4', tableStr: 'D' }
        //       ],
        //       toFieldBloodDtoList: [
        //         { fieldStr: 'field1Next1', tableStr: 'X' },
        //         { fieldStr: 'field1Next2', tableStr: 'Y' },
        //         { fieldStr: 'field1Next3', tableStr: 'Z' }
        //       ]
        //     },
        //     {
        //       fieldStr: 'field2',
        //       fromFieldBloodDtoList: [{ fieldStr: 'field2Prev1', tableStr: 'A' }],
        //       toFieldBloodDtoList: [
        //         { fieldStr: 'field2Next1', tableStr: 'X' },

        //         { fieldStr: 'field2Next3', tableStr: 'Z' }
        //       ]
        //     }
        //   ]
        // }
        that.tabelBloodData = res.data
        that.tabelBloodData.fromTableSet.forEach((item, index) => {
          fieldsPrev.push({ ...item, fields: [] })
        })
        that.tabelBloodData.toTableSet.forEach((item, index) => {
          fieldsNext.push({ ...item, fields: [] })
        })
        that.tabelBloodData.tableFieldBloodDtoList.forEach((item, index) => {
          portsMaster.items.push({
            group: 'temp',
            args: {
              x: 0,
              y: 91 + index * 41
            },
            id: item.fieldStr + 'left'
          })
          portsMaster.items.push({
            group: 'temp',
            args: {
              x: '100%',
              y: 91 + index * 41
            },
            id: item.fieldStr + 'right'
          })
          fieldsMaster[0].fields.push(item.fieldStr)
          fieldsPrev.forEach((item2, index2) => {
            if (item.fromFieldBloodDtoList) {
              item.fromFieldBloodDtoList.forEach((item3, index3) => {
                if (item3.tableStr == item2.tableName && item3.jobId == item2.sourceId) {
                  if (item3.fieldStr != 'null') {
                    if (!item2.fields.includes(item3.fieldStr + '-' + item3.jobId)) {
                      item2.fields.push(item3.fieldStr + '-' + item3.jobId)
                    }
                  }
                }
              })
            }
          })
          fieldsNext.forEach((item2, index2) => {
            if (item.toFieldBloodDtoList) {
              item.toFieldBloodDtoList.forEach((item3, index3) => {
                if (item3.tableStr == item2.tableName && item3.jobId == item2.sourceId) {
                  if (item3.fieldStr != 'null') {
                    if (!item2.fields.includes(item3.fieldStr + '-' + item3.jobId)) {
                      item2.fields.push(item3.fieldStr + '-' + item3.jobId)
                    }
                  }
                }
              })
            }
          })
        })
        let prevY = 50
        fieldsPrev.forEach((item, index) => {
          item.fields.forEach((item2, index2) => {
            prevY += 41
            portsPrev.items.push({
              group: 'temp',
              args: {
                x: '100%',
                y: prevY
              },
              id: 'prev-' + item.tableName + item.sourceId + '-' + item2
            })
          })
          prevY += 41
        })
        let nextY = 50

        fieldsNext.forEach((item, index) => {
          item.fields.forEach((item2, index2) => {
            nextY += 41
            portsNext.items.push({
              group: 'temp',
              args: {
                x: 0,
                y: nextY
              },
              id: 'next-' + item.tableName + item.sourceId + '-' + item2
            })
          })
          nextY += 41
        })

        that.nodes.push({
          shape: 'bloodNodeField',
          x: 600,
          y: 100,
          width: 300,
          height: 41 * fieldsMaster[0].fields.length + 70,
          id: 'master',
          data: { type: 'master', fieldsArr: fieldsMaster },
          ports: portsMaster
        })
        that.nodes.push({ shape: 'bloodNodeField', x: 100, y: 100, width: 300, height: prevY - 20, id: 'prev', data: { type: 'prev', fieldsArr: fieldsPrev }, ports: portsPrev })
        that.nodes.push({ shape: 'bloodNodeField', x: 1100, y: 100, width: 300, height: nextY - 20, id: 'next', data: { type: 'next', fieldsArr: fieldsNext }, ports: portsNext })

        that.tabelBloodData.tableFieldBloodDtoList.forEach((item, index) => {
          if (item.fromFieldBloodDtoList) {
            item.fromFieldBloodDtoList.forEach((item2, index2) => {
              fieldsPrev.forEach((item3, index3) => {
                if (item2.tableStr == item3.tableName && item2.jobId == item3.sourceId) {
                  if (item2.fieldStr != 'null') {
                    that.edges.push({
                      source: { cell: 'prev', port: 'prev-' + item3.tableName + item3.sourceId + '-' + item2.fieldStr + '-' + item2.jobId },
                      target: { cell: 'master', port: item.fieldStr + 'left' },
                      attrs: {
                        line: {
                          stroke: '#A2B1C3',
                          strokeWidth: 2,
                          targetMarker: {
                            name: 'block',
                            width: 12,
                            height: 8
                          }
                        }
                      }
                    })
                  }
                }
              })
            })
          }
          if (item.toFieldBloodDtoList) {
            item.toFieldBloodDtoList.forEach((item2, index2) => {
              fieldsNext.forEach((item3, index3) => {
                if (item2.tableStr == item3.tableName && item2.jobId == item3.sourceId) {
                  if (item2.fieldStr != 'null') {
                    that.edges.push({
                      source: { cell: 'master', port: item.fieldStr + 'right' },
                      target: { cell: 'next', port: 'next-' + item3.tableName + item3.sourceId + '-' + item2.fieldStr + '-' + item2.jobId },
                      attrs: {
                        line: {
                          stroke: '#A2B1C3',
                          strokeWidth: 2,
                          targetMarker: {
                            name: 'block',
                            width: 12,
                            height: 8
                          }
                        }
                      }
                    })
                  }
                }
              })
            })
          }
        })
        // console.log(that.nodes)
        // console.log(that.edges)
        that.edges.forEach(x => {
          //console.log(x.source.port + '>>>' + x.target.port)
        })
        that.nodes.forEach(x => {
          x.ports.items.forEach(y => {
            console.log(y.id)
          })
        })
        setTimeout(() => {
          that.initGraph()
        }, 300)
      })
    },
    initGraph() {
      let that = this
      that.graph = new Graph({
        container: document.getElementById('containerField'),
        // autoResize: true,
        translating: { restrict: true },
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: 'ctrl',
          minScale: 0.5,
          maxScale: 3
        },
        connecting: {
          // router: {
          //   name: 'manhattan',
          //   args: {
          //     padding: 1
          //   }
          // },
          connector: {
            name: 'rounded',
            args: {
              radius: 8
            }
          },
          anchor: 'center',
          connectionPoint: 'anchor',
          allowBlank: false,
          snap: {
            radius: 20
          },
          createEdge() {
            return this.createEdge({
              attrs: {
                line: {
                  stroke: '#A2B1C3',
                  strokeWidth: 2,
                  targetMarker: {
                    name: 'block',
                    width: 12,
                    height: 8
                  }
                }
              },
              zIndex: 0
            })
          },
          validateConnection({ sourceCell, targetCell, sourceMagnet, targetMagnet }) {
            return false
            // // 不能连接自身
            // if (sourceCell === targetCell) {
            //   return false
            // }

            // // 不能重复连线
            // const edges = this.getEdges()
            // const portId = targetMagnet.getAttribute('port')
            // if (edges.find(edge => edge.getTargetPortId() === portId)) {
            //   return false
            // }

            return true
          }
        },
        highlighting: {
          // 连接桩可以被连接时在连接桩外围围渲染一个包围框
          magnetAvailable: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#A4DEB1',
                strokeWidth: 4
              }
            }
          },
          // 连接桩吸附连线时在连接桩外围围渲染一个包围框
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#31d0c6',
                strokeWidth: 4
              }
            }
          }
        },
        selecting: {
          enabled: true,
          rubberband: true,
          showNodeSelectionBox: true
        },
        snapline: true,
        keyboard: true,
        clipboard: true,

        background: {
          color: '#ffffff'
        },
        // 网格线设置
        grid: {
          visible: true,
          type: 'doubleMesh',
          args: [
            {
              color: '#eee', // 主网格线颜色
              thickness: 1 // 主网格线宽度
            },
            {
              color: '#ddd', // 次网格线颜色
              thickness: 1, // 次网格线宽度
              factor: 4 // 主次网格线间隔
            }
          ]
        },

        panning: {
          enabled: true,
          // 触发键盘事件进行平移：'alt' | 'ctrl' | 'meta' | 'shift'
          modifiers: [],
          // 触发鼠标事件进行平移：'leftMouseDown' | 'rightMouseDown' | 'mouseWheel'
          eventTypes: ['leftMouseDown']
        }
      })
      // // 渲染节点和边
      that.graph.fromJSON({
        nodes: that.nodes,
        edges: that.edges
      })
      // 实现画布内容居中
      that.graph.centerContent()
      // 增加对齐线
      that.graph.use(
        new Selection({
          enabled: true,
          multiple: true,
          rubberband: false,
          movable: false,
          showNodeSelectionBox: true,
          showEdgeSelectionBox: true,
          pointerEvents: 'none'
        })
      )
      that.graph.use(
        new Snapline({
          enabled: true
        })
      )

      // this.graph.on('node:mouseenter', val => {
      //   const container = document.getElementById('container')
      //   const ports = container.querySelectorAll('.x6-port-body')
      //   for (let i = 0, len = ports.length; i < len; i = i + 1) {
      //     ports[i].style.visibility = val ? 'visible' : 'hidden'
      //   }
      // })
    }
  }
}
</script>
<style scoped>
.dragUnit:hover {
  background: #eef0f1;
  opacity: 0.8;
}
/deep/.connectRadioGroup .el-radio-button__inner {
  padding: 3px 0px 6px 0px;
  width: 80px;
}
/deep/.connectRadioGroup .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: rgba(245, 248, 255, 1);
  color: #606266;
}
</style>
