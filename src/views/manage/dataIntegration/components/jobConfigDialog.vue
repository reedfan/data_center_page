
<template>
  <div style="width: 100%; height: 100%; overflow: hidden; background: #ffffff; position: relative" class="no-select">
    <div style="width: 100%; height: calc(100% - 0px); position: relative; overflow: hidden">
      <div style="width: 250px; height: 100%; float: left" class="main-unit">
        <el-radio-group v-model="activeName" size="mini" style="margin: 10px">
          <el-radio-button label="sync">传输任务</el-radio-button>
          <el-radio-button label="sql">SQL任务</el-radio-button>
        </el-radio-group>
        <div style="width: 100%; height: calc(100% - 70px); overflow: hidden auto" v-if="activeName == 'sync'">
          <div class="dragUnit" style="width: 100%; height: 36px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in taskList" :key="index" @mousedown="startDragToGraph(item, 'sync', $event)">
            <p style="width: 40px; color: #ffffff; height: 20px; line-height: 20px; margin: 8px 5px 8px 10px; text-align: center; font-size: 14px; border-radius: 2px; background: #409eff; float: left">传输</p>
            <p style="width: 160px; height: 36px; line-height: 36px; font-size: 14px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
              {{ item.taskName }}
            </p>
          </div>
        </div>
        <div style="width: 100%; height: calc(100% - 70px); overflow: hidden auto" v-if="activeName == 'sql'">
          <div class="dragUnit" style="width: 100%; height: 36px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in sqlTaskList" :key="index" @mousedown="startDragToGraph(item, 'sql', $event)">
            <p style="width: 40px; color: #ffffff; height: 20px; line-height: 20px; margin: 8px 5px 8px 10px; text-align: center; font-size: 14px; border-radius: 2px; background: #67c23a; float: left">SQL</p>
            <p style="width: 180px; height: 36px; line-height: 36px; font-size: 14px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
              {{ item.taskName }}
            </p>
          </div>
        </div>
      </div>
      <div style="width: calc(100% - 255px); height: 100%; float: right; position: relative">
        <div class="main-unit" style="width: 100%; height: 100%; position: relative; overflow: hidden" id="container"></div>
        <div style="width: 200px; height: 60px; position: absolute; top: 0; right: 20px; text-align: right; line-height: 60px">
          <el-button type="primary" @click="getGraphData()" size="mini" :disabled="buttonLoad" :loading="buttonLoad">保存</el-button>
        </div>
      </div>
    </div>

    <el-dialog title="任务详情" :visible.sync="dialogShowTask" class="fullScreenDialog" width="100%">
      <syncTasksDialog v-if="dialogShowTask" :addOrModifyOrCopyTask="addOrModifyOrCopyTask" :taskRow="taskRow" @close="dialogShowTask = false" @getData="getTableBloodData"></syncTasksDialog>
    </el-dialog>
    <el-dialog title="任务详情" :visible.sync="dialogShowTaskSQL" width="900px">
      <offlineTasksDialog v-if="dialogShowTaskSQL" :addOrModifyTask="addOrModifyTaskSQL" :taskRow="taskRowSQL" @close="dialogShowTaskSQL = false" @getData="getTableBloodData"></offlineTasksDialog>
    </el-dialog>
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
import syncTasksDialog from './../../dataIntegration/components/syncTasksDialog.vue'
import offlineTasksDialog from './../../dataDevelop/components/offlineTasksDialog.vue'
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
  components: {
    syncTasksDialog,
    offlineTasksDialog
  },
  props: {
    jobRow: ''
  },
  data() {
    return {
      rules: {
        test: []
      },
      activeName: 'sync',
      graph: null,

      taskList: [],
      sqlTaskList: [],

      nodes: [
        {
          shape: 'beginNode',
          x: 100,
          y: 100,
          width: 300,
          height: 70,
          id: 'beginNode',
          data: {}
        },
        {
          shape: 'endNode',
          x: 100,
          y: 600,
          width: 300,
          height: 70,
          id: 'endNode',
          data: {}
        }
      ],
      edges: [],
      tempEdge: {},
      tempNode: {},

      dialogShowTask: false,
      addOrModifyOrCopyTask: '',
      taskRow: '',

      addOrModifyTaskSQL: false,
      taskRowSQL: '',
      dialogShowTaskSQL: false,
      buttonLoad: false
    }
  },

  mounted() {
    this.getTaskList()
    this.getSqlTaskList()
    this.getNodesAndEdges()
  },
  methods: {
    // 获取点和线
    getNodesAndEdges() {
      let that = this
      console.log(that.jobRow)
      if (that.jobRow.graphInfo) {
        console.log(JSON.parse(that.jobRow.graphInfo))
        let graphInfo = JSON.parse(that.jobRow.graphInfo)
        graphInfo.cells.forEach((item, index) => {
          if (item.shape == 'beginNode' || item.shape == 'endNode' || item.shape == 'tableNode') {
            that.nodes.push(item)
          } else {
            that.edges.push(item)
          }
        })
      } else {
        that.nodes = [
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
      }

      setTimeout(() => {
        that.initGraph()
      }, 300)
      console.log(that.nodes)
    },
    // 获取jobTaskInfoList
    getTaskList() {
      let that = this
      request({ url: '/task_info/list', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.taskList = []
        res.data.list.forEach((item, index) => {
          that.taskList.push({ taskName: item.taskName, id: 'data_sync_task-{' + item.id + '}', realId: item.id })
        })
      })
    },
    // 获取sqlTaskList
    getSqlTaskList() {
      let that = this
      request({ url: '/sql_task_info/list', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.sqlTaskList = []
        res.data.list.forEach((item, index) => {
          that.sqlTaskList.push({ taskName: item.taskName, id: 'sql_task-{' + item.id + '}', realId: item.id })
        })
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
            console.log(edges)
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

      that.graph.on('edge:dblclick', ({ e, x, y, edge, view }) => {
        console.log(edge)
        // edge.prop('data', '1111')
        // console.log(edge)
      })
      that.graph.on('edge:connected', ({ isNew, edge }) => {
        if (isNew) {
          edge.prop('id', edge.store.data.source.cell + '->' + edge.store.data.target.cell)
        }
      })
      that.graph.on('node:contextmenu', ({ e, x, y, node, view }) => {
        let event = e.originalEvent
        console.log(e)
        console.log(x)
        console.log(y)
        console.log(node)
        console.log(view)
        if (node.id == 'beginNode' || node.id == 'endNode') {
          return
        }

        that.$contextmenu({
          items: [
            {
              icon: 'el-icon-view',
              label: '查看详情',
              onClick: () => {
                that.seeTask(node)
              }
            },
            {
              icon: 'el-icon-delete',
              label: '删除',
              onClick: () => {
                that.deleteGraphCell(node)
              }
            }
          ],
          event, // 鼠标事件信息
          customClass: 'custom-class', // 自定义菜单样式
          zIndex: 3000, // 菜单的 z-index
          minWidth: 230 // 菜单的最小宽度
        })
      })
      that.graph.on('edge:contextmenu', ({ e, x, y, edge, view }) => {
        let event = e.originalEvent
        console.log(e)
        console.log(x)
        console.log(y)
        console.log(edge)
        console.log(view)
        that.$contextmenu({
          items: [
            {
              icon: 'el-icon-delete',
              label: '删除',
              onClick: () => {
                that.deleteGraphCell(edge)
              }
            }
          ],
          event, // 鼠标事件信息
          customClass: 'custom-class', // 自定义菜单样式
          zIndex: 3000, // 菜单的 z-index
          minWidth: 230 // 菜单的最小宽度
        })
      })

      // this.graph.on('node:mouseenter', val => {
      //   const container = document.getElementById('container')
      //   const ports = container.querySelectorAll('.x6-port-body')
      //   for (let i = 0, len = ports.length; i < len; i = i + 1) {
      //     ports[i].style.visibility = val ? 'visible' : 'hidden'
      //   }
      // })
    },
    startDragToGraph(item, type, e) {
      console.log(item)
      let that = this
      let node = that.graph.createNode({
        shape: 'tableNode',
        // 自己设置拖拽元素的具体属性，此处不赘述
        // width: 200, // 节点的宽度
        // height: 40, // 节点的高度
        id: item.id,
        data: { ...item, taskType: type }
      })
      const dnd = new Dnd({
        getDragNode: node => node.clone({ keepId: true }),
        getDropNode: node => node.clone({ keepId: true }),
        target: that.graph,
        validateNode: () => {
          // console.log('成功拖拽至目标画布')
        }
      })
      dnd.start(node, e)
    },
    getGraphData() {
      let that = this
      console.log(that.graph)
      console.log(that.graph.getSelectedCells())
      console.log(that.graph.toJSON())
      let edges = []
      that.graph.toJSON().cells.forEach(x => {
        if (x.shape == 'edge') {
          edges.push(x.id)
        }
      })
      console.log(edges)
      const graph = {}
      edges.forEach(edge => {
        const [start, end] = edge.split('->')
        if (!graph[start]) {
          graph[start] = []
        }
        graph[start].push(end)
      })
      // 深度优先搜索函数
      function findAllPaths(graph, start, end) {
        let paths = []
        let stack = [{ node: start, path: [start] }]

        while (stack.length > 0) {
          let { node, path } = stack.pop()

          if (node === end) {
            paths.push(path)
          } else {
            for (let neighbor of graph[node]) {
              if (!path.includes(neighbor)) {
                stack.push({ node: neighbor, path: [...path, neighbor] })
              }
            }
          }
        }
        return paths
      }

      // 从起始节点 'a' 开始搜索
      try {
        const allPaths = findAllPaths(graph, 'beginNode', 'endNode')
        console.log(allPaths)
        // 将所有路径转换为字符串并输出
        const pathStrings = allPaths.map(path => path.join('-'))
        console.log(pathStrings)
        that.buttonLoad = true
        let params = that.jobRow
        params.graphInfo = JSON.stringify(that.graph.toJSON())
        params.jobTaskInfo = JSON.stringify({ jobTaskInfoList: allPaths })
        request({ url: '/job_info/update', method: 'post', data: params })
          .then(res => {
            if (res.code == '200') {
              Notify('success', res.message || '处理成功')
              that.$emit('close', '')
              that.$emit('getData', '')
            }
            setTimeout(() => {
              that.buttonLoad = false
            }, 300)
          })
          .catch(() => {
            setTimeout(() => {
              that.buttonLoad = false
            }, 300)
          })
      } catch (e) {
        console.log(e)
        Notify('error', '流程图有误(必须从开始节点到结束节点)！')
      }
    },
    deleteGraphCell(cell) {
      if (cell.id == 'beginNode') {
        Notify('error', '请不要删除开始节点')
        return
      }
      if (cell.id == 'endNode') {
        Notify('error', '请不要删除结束节点')
        return
      }
      console.log(cell)
      this.graph.removeCells([cell])
    },

    // 查看任务
    seeTask(node) {
      console.log(node)
      let that = this
      if (node.store.data.data.taskType == 'sync') {
        that.addOrModifyOrCopyTask = 'modify'
        that.taskRow = { id: node.store.data.data.realId }
        that.dialogShowTask = true
      } else if (node.store.data.data.taskType == 'sql') {
        that.addOrModifyTaskSQL = false
        that.taskRowSQL = { id: node.store.data.data.realId }
        that.dialogShowTaskSQL = true
      }
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
