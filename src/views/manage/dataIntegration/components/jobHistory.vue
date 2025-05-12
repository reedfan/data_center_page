
<template>
  <div style="width: 100%; height: 100%; overflow: hidden; background: #ffffff; position: relative" class="no-select">
    <div style="width: calc(50% - 1px); height: 100%; position: relative; overflow: hidden; float: left">
      <div style="width: 100%; height: 40px; background: #409eff">
        <p style="width: auto; float: left; height: 40px; font-size: 16px; line-height: 40px; margin: 0 0 0 10px; color: #ffffff">当前版本 V{{ jobRowProp.jobInfoLatestOldVersion }}</p>
      </div>
      <div style="width: 100%; height: calc(100% - 40px)" id="containerNow"></div>
    </div>
    <div style="width: calc(50% - 1px); height: 100%; position: relative; overflow: hidden; float: right">
      <div style="width: 100%; height: 40px; background: #e4e7ed">
        <p style="width: auto; float: left; height: 40px; font-size: 16px; line-height: 40px; margin: 0 0 0 10px; color: #000000">历史版本</p>
        <div style="width: 100px; float: left; margin-left: 10px; margin-top: 4px">
          <el-select v-model="jobVersion" filterable placeholder="请选择" @change="getHistoryData()">
            <el-option :label="'V' + item" v-for="(item, index) in jobRowProp.jobInfoLatestOldVersion - 1" :value="item" :key="index"></el-option>
          </el-select>
        </div>
        <el-button style="float: right; margin-right: 10px; width: 100px; margin-top: 4px" type="primary" size="small" @click="rollBack()">回滚</el-button>
      </div>
      <div style="width: 100%; height: calc(100% - 40px)" id="containerHistory"></div>
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

import graphNode from './graphNode.vue'
import beginNode from './beginNode.vue'
import endNode from './endNode.vue'
register({
  shape: 'tableNode',
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#E6A23C',
            strokeWidth: 2,
            fill: '#fff'
          }
        }
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#E6A23C',
            strokeWidth: 2,
            fill: '#fff'
          }
        }
      }
    },
    items: [
      {
        group: 'top',
        id: 'top'
      },
      {
        group: 'bottom',
        id: 'bottom'
      }
    ]
  },
  component: graphNode
})
register({
  shape: 'beginNode',
  ports: {
    groups: {
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#E6A23C',
            strokeWidth: 2,
            fill: '#fff'
          }
        }
      }
    },
    items: [
      {
        group: 'bottom',
        id: 'bottom'
      }
    ]
  },
  component: beginNode
})
register({
  shape: 'endNode',
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#E6A23C',
            strokeWidth: 2,
            fill: '#fff'
          }
        }
      }
    },
    items: [
      {
        group: 'top',
        id: 'top'
      }
    ]
  },
  component: endNode
})
export default {
  components: {},
  props: {
    jobRowProp: ''
  },
  data() {
    return {
      rules: {
        test: []
      },
      jobVersion: 1,

      jobRow: '',
      graphHistory: null,
      nodesHistory: [],
      edgesHistory: [],
      graphNow: null,
      nodesNow: [],
      edgesNow: []
    }
  },

  mounted() {
    this.getNowData()
    this.getHistoryData()
  },
  methods: {
    getHistoryData() {
      let that = this
      request({ url: '/job_info/history_version', method: 'get', params: { jobId: that.jobRowProp.id, jobVersion: that.jobVersion } }).then(res => {
        if (res.data) {
          that.getNodesAndEdges(res.data, 'containerHistory', that.nodesHistory, that.edgesHistory, that.graphHistory)
        } else {
          that.$message.error('该版本不存在！')
        }
      })
    },
    getNowData() {
      let that = this
      request({ url: '/job_info/get', method: 'get', params: { id: that.jobRowProp.id } }).then(res => {
        that.getNodesAndEdges(res.data, 'containerNow', that.nodesNow, that.edgesNow, that.graphNow)
      })
    },
    rollBack() {
      let that = this
      that
        .$confirm('是否确认回滚?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/job_info/roll_back', method: 'post', data: { jobId: that.jobRowProp.id, currentVersion: that.jobRowProp.jobInfoLatestOldVersion, rollBackToVersion: that.jobVersion, rollBackBy: that.$store.state.userInfo.account } }).then(res => {
            if (res.success) {
              that.$message.success('回滚成功！')
              that.$emit('close', '')
              that.$emit('refresh', '')
            } else {
              that.$message.error(res.msg)
            }
          })
        })
    },
    // 获取点和线
    getNodesAndEdges(row, containerId, nodes, edges, graph) {
      let that = this

      if (row.graphInfo) {
        nodes = []
        edges = []
        console.log(JSON.parse(row.graphInfo))
        let graphInfo = JSON.parse(row.graphInfo)
        graphInfo.cells.forEach((item, index) => {
          if (item.shape == 'beginNode' || item.shape == 'endNode' || item.shape == 'tableNode') {
            nodes.push(item)
          } else {
            edges.push(item)
          }
        })
      } else {
        nodes = [
          {
            position: {
              x: 100,
              y: 100
            },
            size: {
              width: 300,
              height: 40
            },
            view: 'vue-shape-view',
            shape: 'beginNode',
            ports: {
              groups: {
                bottom: {
                  position: 'bottom',
                  attrs: {
                    circle: {
                      r: 6,
                      magnet: true,
                      stroke: '#E6A23C',
                      strokeWidth: 2,
                      fill: '#fff'
                    }
                  }
                }
              },
              items: [
                {
                  group: 'bottom',
                  id: 'bottom'
                }
              ]
            },
            id: 'beginNode',
            data: {},
            zIndex: 1
          },
          {
            position: {
              x: 100,
              y: 600
            },
            size: {
              width: 300,
              height: 40
            },
            view: 'vue-shape-view',
            shape: 'endNode',
            ports: {
              groups: {
                top: {
                  position: 'top',
                  attrs: {
                    circle: {
                      r: 6,
                      magnet: true,
                      stroke: '#E6A23C',
                      strokeWidth: 2,
                      fill: '#fff'
                    }
                  }
                }
              },
              items: [
                {
                  group: 'top',
                  id: 'top'
                }
              ]
            },
            id: 'endNode',
            data: {},
            zIndex: 1
          }
        ]
        edges = []
      }
      if (graph) {
        graph.dispose()
      }
      setTimeout(() => {
        that.initGraph(containerId, nodes, edges, graph)
      }, 300)
    },
    initGraph(containerId, nodes, edges, graph) {
      let that = this
      graph = new Graph({
        container: document.getElementById(containerId),
        autoResize: true,
        translating: { restrict: true },
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: 'ctrl',
          minScale: 0.5,
          maxScale: 3
        },
        connecting: {
          router: {
            name: 'manhattan',
            args: {
              padding: 1
            }
          },
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
              router: 'metro',
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
            // 不能连接自身
            if (sourceCell === targetCell) {
              return false
            }
            // 只能从 bottom 连接桩开始连接，连接到 top 连接桩
            if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'top') {
              return false
            }
            if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'top') {
              return false
            }

            // 不能重复连线
            const edges = this.getEdges()
            let flag = false
            edges.forEach((edge, index) => {
              if (edge.store.data.source.cell == sourceCell.id && edge.store.data.target.cell == targetCell.id) {
                flag = true
              }
            })
            if (flag) {
              return false
            }
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
      graph.fromJSON({
        nodes: nodes,
        edges: edges
      })
      // 实现画布内容居中
      graph.centerContent()
      // 增加对齐线
      graph.use(
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
      graph.use(
        new Snapline({
          enabled: true
        })
      )

      graph.on('edge:dblclick', ({ e, x, y, edge, view }) => {
        console.log(edge)
        // edge.prop('data', '1111')
        // console.log(edge)
      })
      graph.on('edge:connected', ({ isNew, edge }) => {
        if (isNew) {
          edge.prop('id', edge.store.data.source.cell + '->' + edge.store.data.target.cell)
        }
      })

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
