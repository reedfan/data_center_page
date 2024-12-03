
<template>
  <div style="width: 100%; height: 100%; overflow: hidden; background: #ffffff; position: relative">
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
        <div style="width: 100%; height: 60px; position: absolute; top: 0; right: 20px; text-align: right; line-height: 60px">
          <el-button type="danger" @click="deleteGraphData()" size="mini">删除选中节点</el-button>
          <el-button type="primary" @click="getGraphData()" size="mini">保存</el-button>
        </div>
      </div>
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
  data() {
    return {
      rules: {
        test: []
      },
      activeName: 'sync',
      graph: null,

      taskList: [],
      sqlTaskList: [],

      dataType: '',
      dataSourceId: '',
      dbName: '',
      tableName: '',

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
      tempEdge: {}
    }
  },

  mounted() {
    this.getTaskList()
    this.getSqlTaskList()
    setTimeout(() => {
      this.initGraph()
    }, 300)
  },
  methods: {
    // 获取jobTaskInfoList
    getTaskList() {
      let that = this
      request({ url: '/task_info/list', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.taskList = []
        res.data.list.forEach((item, index) => {
          that.taskList.push({ taskName: item.taskName, id: 'data_sync_task-{' + item.id + '}' })
        })
      })
    },
    // 获取sqlTaskList
    getSqlTaskList() {
      let that = this
      request({ url: '/sql_task_info/list', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.sqlTaskList = []
        res.data.list.forEach((item, index) => {
          that.sqlTaskList.push({ taskName: item.taskName, id: 'sql_task-{' + item.id + '}' })
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
            let flag = false
            edges.forEach(edge => {
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
          edge.prop('id', edge.store.data.source.cell + '-' + edge.store.data.target.cell)
        }
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
      let that = this
      let node = that.graph.createNode({
        shape: 'tableNode',
        // 自己设置拖拽元素的具体属性，此处不赘述
        // width: 200, // 节点的宽度
        // height: 40, // 节点的高度
        id: item.id,
        data: { row: { ...item, taskType: type } }
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
      console.log(this.graph)
      console.log(this.graph.getSelectedCells())
      console.log(this.graph.toJSON())
    },
    deleteGraphData() {
      let that = this
      const cells = that.graph.getSelectedCells()
      console.log(cells)
      if (cells.length) {
        console.log(cells)
        let flag = false
        cells.forEach(item => {
          if (item.id === 'beginNode') {
            Notify('error', '请不要删除开始节点')
            flag = true
          }
          if (item.id === 'endNode') {
            Notify('error', '请不要删除结束节点')
            flag = true
          }
        })
        if (!flag) {
          this.graph.removeCells(cells)
        }
      } else {
        Notify('warning', '未选择任何节点')
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
