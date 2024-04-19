
<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain groupJob">
    <div style="width: 100%; height: calc(100% - 0px); position: relative; overflow: hidden">
      <div class="main-unit" style="width: 100%; height: 100%; position: relative; overflow: hidden" id="container"></div>
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
import graphNodeBloodTable from './graphNodeBloodTable.vue'
register({
  shape: 'bloodNodeTable',
  component: graphNodeBloodTable
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
                r: 6,
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
      nodes: [
        {
          shape: 'bloodNodeTable',
          x: 100,
          y: 40,
          width: 100,
          height: 40,
          id: 1,
          ports: {
            groups: {
              right: {
                position: {
                  name: 'absolute',
                  args: { x: 0, y: 0 }
                },
                attrs: {
                  circle: {
                    r: 6,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 2,
                    fill: '#fff'
                  }
                }
              }
            },
            items: [
              {
                group: 'right',
                args: {
                  x: '60%',
                  y: 0
                },
                id: 'right1'
              },
              {
                group: 'right',
                args: {
                  x: '100%',
                  y: 0
                },
                id: 'right2'
              }
            ]
          }
        },
        { shape: 'bloodNodeTable', x: 200, y: 240, width: 100, height: 40, id: 2 }
      ],
      edges: [
        {
          source: { cell: 1, port: 'right1' },
          target: { cell: 2, port: 'right2' },
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
        }
      ],
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
      portsMaster.items = [
        {
          group: 'temp',
          args: {
            x: 0,
            y: 50
          },
          id: 'masterLeft'
        },
        {
          group: 'temp',
          args: {
            x: '100%',
            y: 50
          },
          id: 'masterRight'
        }
      ]
      request({ url: '/table_field_blood/get', method: 'get', params: { tableName: that.tableName } }).then(res => {
        that.tabelBloodData = res.data

        that.nodes.push({
          shape: 'bloodNodeTable',
          x: 600,
          y: 100,
          width: 300,
          height: 70,
          id: 'master',
          data: { type: 'master', tableName: that.tableName },
          ports: portsMaster
        })
        that.tabelBloodData.fromTableSet.forEach((item, index) => {
          portsPrev.items.push({
            group: 'temp',
            args: {
              x: '100%',
              y: 50 + index * 40
            },
            id: 'prevRight' + index
          })
          that.edges.push({
            source: { cell: 'prev', port: 'prevRight' + index },
            target: { cell: 'master', port: 'masterLeft' },
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
        })
        that.tabelBloodData.toTableSet.forEach((item, index) => {
          portsNext.items.push({
            group: 'temp',
            args: {
              x: 0,
              y: 50 + index * 40
            },
            id: 'nextLeft' + index
          })
          that.edges.push({
            source: { cell: 'master', port: 'masterRight' },
            target: { cell: 'next', port: 'nextLeft' + index },
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
        })
        that.nodes.push({ shape: 'bloodNodeTable', x: 100, y: 100, width: 300, height: 40 * that.tabelBloodData.fromTableSet.length + 30, id: 'prev', data: { type: 'prev', tableNames: that.tabelBloodData.fromTableSet }, ports: portsPrev })
        that.nodes.push({ shape: 'bloodNodeTable', x: 1100, y: 100, width: 300, height: 40 * that.tabelBloodData.toTableSet.length + 30, id: 'next', data: { type: 'next', tableNames: that.tabelBloodData.toTableSet }, ports: portsNext })
        setTimeout(() => {
          that.initGraph()
        }, 300)
      })
    },
    initGraph() {
      let that = this
      that.graph = new Graph({
        container: document.getElementById('container'),
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
