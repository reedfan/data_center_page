
  <template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain groupJob">
    <div style="width: 100%; height: calc(100% - 0px); position: relative; overflow: hidden">
      <div style="width: 250px; height: 100%; float: left" class="main-unit">
        <el-descriptions title="" direction="vertical" :column="1" border>
          <el-descriptions-item label="类型">
            <el-select v-model="dataType" filterable placeholder="请选择类型" @change="typeChange()">
              <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="数据源">
            <el-select v-model="dataSourceId" filterable placeholder="请选择数据源" @change="dataSourceChange()">
              <el-option v-for="(item, index) in dataSourceList" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="库">
            <el-select v-model="dbName" filterable placeholder="请选择库" allow-create>
              <el-option v-for="(item, index) in dbNameList" v-bind:key="index" :label="item.dbName" :value="item.dbName"></el-option>
            </el-select>
          </el-descriptions-item>
        </el-descriptions>
        <div style="width: 100%; height: calc(100% - 360px); overflow: hidden auto">
          <div class="dragUnit" style="width: 100%; height: 36px; overflow: hidden; cursor: move; margin-top: 5px" v-for="(item, index) in tableNameList" :key="index" @mousedown="startDragToGraph(item, $event)">
            <i class="el-icon-document-copy" style="font-size: 16px; color: #606266; display: block; float: left; margin-top: 10px; margin-left: 10px"></i>
            <p style="width: 180px; height: 36px; line-height: 36px; font-size: 14px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
              {{ item }}
            </p>
          </div>
        </div>
      </div>
      <div style="width: calc(100% - 255px); height: 100%; float: right; position: relative">
        <div class="main-unit" style="width: 100%; height: 100%; position: relative; overflow: hidden" id="container"></div>
        <div style="width: 100%; height: 60px; position: absolute; top: 0; right: 0; text-align: right; line-height: 60px">
          <el-button type="primary" @click="getGraphData()">getJson</el-button>
          <el-button type="danger" @click="deleteGraphData()">delete</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="字段关联" :visible.sync="dialogShowConnect" width="700px" @close="rejectConnect">
      <el-form :model="formConnect" ref="formConnect" :rules="rules" label-width="120px" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <el-form-item label="关联方式：" prop="connectType" :required="true">
          <el-radio-group v-model="formConnect.connectType" class="connectRadioGroup">
            <el-radio-button label="内部">
              <p style="height: 32px; line-height: 32px; width: auto">内部</p>
              <svg fill="none" version="1.1" width="32" height="20" viewBox="0 0 32 20" render="[object Object]">
                <g>
                  <g><path d="M16,18C18.51806,16.1115,20,13.1476,20,10C20,6.85243,18.51806,3.88854,16,2.00000109316C13.48194,3.88854,12,6.85243,12,10C12.000000000000002,13.1476,13.48194,16.1115,16,18Z" fill-rule="evenodd" fill="#1890FF" fill-opacity="1"></path></g>
                  <g><path d="M17.4989,16.6158C19.0555,14.8528,20,12.5367,20,10C20,7.46331,19.0555,5.14722,17.4989,3.38424Q18.2233,2.89106,19.0552,2.56169Q20.4741,2,22,2Q23.5259,2,24.9448,2.56169Q26.4853,3.17157,27.6569,4.34315Q28.8284,5.51472,29.4383,7.05524Q30,8.47405,30,10Q30,11.5259,29.4383,12.9448Q28.8284,14.4853,27.6569,15.6569Q26.4853,16.8284,24.9448,17.4383Q23.5259,18,22,18Q20.4741,18,19.0552,17.4383Q18.2233,17.1089,17.4989,16.6158ZM16,18.0007C14.3287,19.2561,12.2512,20,10,20C4.47715,20,0,15.5228,0,10C0,4.47715,4.47715,0,10,0C12.2512,0,14.3287,0.74389,16,1.99927C17.6713,0.74389,19.7488,0,22,0C27.5228,0,32,4.47715,32,10C32,15.5228,27.5228,20,22,20C19.7488,20,17.6713,19.2561,16,18.0007ZM14.5011,16.6158Q13.7767,17.1089,12.9448,17.4383Q11.5259,18,10,18Q8.47405,18,7.05524,17.4383Q5.51472,16.8284,4.34315,15.6569Q3.17157,14.4853,2.56169,12.9448Q2,11.5259,2,10Q2,8.47405,2.56169,7.05524Q3.17157,5.51472,4.34315,4.34315Q5.51472,3.17157,7.05524,2.56169Q8.47405,2,10,2Q11.5259,2,12.9448,2.56169Q13.7767,2.89106,14.5011,3.38424C12.9445,5.14722,12,7.46331,12,10C12,12.5367,12.9445,14.8528,14.5011,16.6158ZM16,15.2922Q15.0789,14.2511,14.5617,12.9448Q14,11.5259,14,10Q14,8.47405,14.5617,7.05524Q15.0789,5.74885,16,4.70779Q16.9211,5.74886,17.4383,7.05524Q18,8.47405,18,10Q18,11.5259,17.4383,12.9448Q16.9211,14.2511,16,15.2922Z" fill-rule="evenodd" fill="#1E69FF" fill-opacity="1"></path></g>
                </g>
              </svg>
            </el-radio-button>
            <el-radio-button label="左侧">
              <p style="height: 32px; line-height: 32px; width: auto">左侧</p>
              <svg fill="none" version="1.1" width="32" height="20" viewBox="0 0 32 20" render="[object Object]">
                <g>
                  <g>
                    <ellipse cx="10" cy="10" rx="10" ry="10" fill="#1890FF" fill-opacity="1"></ellipse>
                    <ellipse cx="10" cy="10" rx="9" ry="9" fill-opacity="0" stroke-opacity="1" stroke="#1E69FF" fill="none" stroke-width="2"></ellipse>
                  </g>
                  <g><ellipse cx="22" cy="10" rx="9" ry="9" fill-opacity="0" stroke-opacity="1" stroke="#1E69FF" fill="none" stroke-width="2"></ellipse></g>
                </g>
              </svg>
            </el-radio-button>
            <el-radio-button label="右侧">
              <p style="height: 32px; line-height: 32px; width: auto">右侧</p>
              <svg fill="none" version="1.1" width="32" height="20" viewBox="0 0 32 20" render="[object Object]">
                <g>
                  <g>
                    <ellipse cx="22" cy="10" rx="10" ry="10" fill="#1890FF" fill-opacity="1"></ellipse>
                    <ellipse cx="22" cy="10" rx="9" ry="9" fill-opacity="0" stroke-opacity="1" stroke="#1E69FF" fill="none" stroke-width="2"></ellipse>
                  </g>
                  <g><ellipse cx="10" cy="10" rx="9" ry="9" fill-opacity="0" stroke-opacity="1" stroke="#1E69FF" fill="none" stroke-width="2"></ellipse></g>
                </g>
              </svg>
            </el-radio-button>
            <el-radio-button label="完全外部">
              <p style="height: 32px; line-height: 32px; width: auto">完全外部</p>
              <svg fill="none" version="1.1" width="32" height="20" viewBox="0 0 32 20" render="[object Object]">
                <g>
                  <g><ellipse cx="10" cy="10" rx="10" ry="10" fill="#1890FF" fill-opacity="1"></ellipse></g>
                  <g><ellipse cx="22" cy="10" rx="10" ry="10" fill="#1890FF" fill-opacity="1"></ellipse></g>
                  <g><path d="M17.4989,16.6158C19.0555,14.8528,20,12.5367,20,10C20,7.46331,19.0555,5.14722,17.4989,3.38424Q18.2233,2.89106,19.0552,2.56169Q20.4741,2,22,2Q23.5259,2,24.9448,2.56169Q26.4853,3.17157,27.6569,4.34315Q28.8284,5.51472,29.4383,7.05524Q30,8.47405,30,10Q30,11.5259,29.4383,12.9448Q28.8284,14.4853,27.6569,15.6569Q26.4853,16.8284,24.9448,17.4383Q23.5259,18,22,18Q20.4741,18,19.0552,17.4383Q18.2233,17.1089,17.4989,16.6158ZM16,18.0007C14.3287,19.2561,12.2512,20,10,20C4.47715,20,0,15.5228,0,10C0,4.47715,4.47715,0,10,0C12.2512,0,14.3287,0.74389,16,1.99927C17.6713,0.74389,19.7488,0,22,0C27.5228,0,32,4.47715,32,10C32,15.5228,27.5228,20,22,20C19.7488,20,17.6713,19.2561,16,18.0007ZM14.5011,16.6158Q13.7767,17.1089,12.9448,17.4383Q11.5259,18,10,18Q8.47405,18,7.05524,17.4383Q5.51472,16.8284,4.34315,15.6569Q3.17157,14.4853,2.56169,12.9448Q2,11.5259,2,10Q2,8.47405,2.56169,7.05524Q3.17157,5.51472,4.34315,4.34315Q5.51472,3.17157,7.05524,2.56169Q8.47405,2,10,2Q11.5259,2,12.9448,2.56169Q13.7767,2.89106,14.5011,3.38424C12.9445,5.14722,12,7.46331,12,10C12,12.5367,12.9445,14.8528,14.5011,16.6158ZM16,15.2922Q15.0789,14.2511,14.5617,12.9448Q14,11.5259,14,10Q14,8.47405,14.5617,7.05524Q15.0789,5.74885,16,4.70779Q16.9211,5.74886,17.4383,7.05524Q18,8.47405,18,10Q18,11.5259,17.4383,12.9448Q16.9211,14.2511,16,15.2922Z" fill-rule="evenodd" fill="#1E69FF" fill-opacity="1"></path></g>
                </g>
              </svg>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="关联条件：" prop="connectList" :required="true">
          <div style="width: 100%; height: auto; min-height: 60px; margin-top: 10px">
            <el-table border :data="formConnect.connectList" class="data-table" ref="connectList" stripe :max-height="250">
              <el-table-column prop="source" :label="tableNameLeft" min-width="60" align="center">
                <template slot-scope="scope">
                  <el-form-item label=" " :required="true" :prop="'connectList.' + scope.$index + '.source'" style="margin-bottom: 0" label-width="30px">
                    <el-select v-model="scope.row.source" filterable placeholder="" clearable="">
                      <el-option :value="item.columnName" :label="item.columnName" v-for="(item, index) in columnsDataLeft" :key="index" :disabled="disabledJudgeLeft(item.columnName)"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="target" :label="tableNameRight" min-width="60" align="center">
                <template slot-scope="scope">
                  <el-form-item label=" " :required="true" :prop="'connectList.' + scope.$index + '.target'" style="margin-bottom: 0" label-width="30px">
                    <el-select v-model="scope.row.target" filterable placeholder="" clearable="">
                      <el-option :value="item.columnName" :label="item.columnName" v-for="(item, index) in columnsDataRight" :key="index" :disabled="disabledJudgeRight(item.columnName)"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <p class="tableAction" :class="formConnect.connectList.length == '1' ? 'disabledTableAction' : ''" @click="formConnect.connectList.length == '1' ? '' : formConnect.connectList.splice(scope.$index, 1)" style="color: #ff9900">删除</p>
                </template>
              </el-table-column>
            </el-table>
            <div style="width: 100%; height: auto; text-align: right; margin-top: 5px">
              <el-button type="primary" @click="formConnect.connectList.push({ source: '', target: '' })" size="medium" style="width: 100px">添加</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectConnect()">取消</el-button>
        <el-button type="primary" @click="sureConnect()">确 定</el-button>
      </div>
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
import graphNode from './components/graphNode.vue'
register({
  shape: 'tableNode',
  ports: {
    groups: {
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 2,
            fill: '#fff'
          }
        }
      },
      left: {
        position: 'left',
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
        id: 'right'
      },
      {
        group: 'left',
        id: 'left'
      }
    ]
  },
  component: graphNode
})
export default {
  data() {
    return {
      rules: {
        test: []
      },
      graph: null,
      dataTypeList: [],
      dataSourceList: [],
      dbNameList: [],
      tableNameList: [],
      dataType: '',
      dataSourceId: '',
      dbName: '',
      tableName: '',

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
    this.getDataTypeList()
    setTimeout(() => {
      this.initGraph()
    }, 300)
  },
  methods: {
    // 获取数据源类型list
    getDataTypeList() {
      let that = this
      request({ url: '/data_source/type/dest/list', method: 'get', params: {} }).then(res => {
        that.dataTypeList = res.data
      })
    },
    typeChange() {
      let that = this
      that.dataSourceList = []
      that.dataSourceId = ''
      that.dbNameList = []
      that.dbName = ''
      that.tableNameList = []
      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.dataType, page: 1, pageSize: 1000 } }).then(res => {
        that.dataSourceList = res.data.list || []
      })
    },
    dataSourceChange() {
      let that = this
      that.dbNameList = that.dataSourceList.filter(s => {
        return s.id == that.dataSourceId
      })
      that.tableNameList = []
      that.dbName = that.dbNameList[0].dbName
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.dataSourceId } }).then(res => {
        that.tableNameList = res.data
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

      that.graph.on('edge:dblclick', ({ e, x, y, edge, view }) => {
        console.log(edge)
        that.tempEdge = edge
        that.showConnectEdit()
        // edge.prop('data', '1111')
        // console.log(edge)
      })
      that.graph.on('edge:connected', ({ isNew, edge }) => {
        if (isNew) {
          that.tempEdge = edge
          that.showConnect()
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
    startDragToGraph(item, e) {
      let that = this
      let node = that.graph.createNode({
        shape: 'tableNode',
        // 自己设置拖拽元素的具体属性，此处不赘述
        // width: 200, // 节点的宽度
        // height: 40, // 节点的高度
        id: item,
        data: { tableName: item, dataSourceId: that.dataSourceId }
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
        this.graph.removeCells(cells)
      }
    },
    showConnect() {
      let that = this
      that.addOrEditConnect = true
      that.dialogShowConnect = true
      that.formConnect = {
        connectType: '',
        connectList: [{ source: '', target: '' }]
      }
      that.tableNameLeft = that.tempEdge.getSourceCell().store.data.data.tableName
      that.tableNameRight = that.tempEdge.getTargetCell().store.data.data.tableName
      request({ url: '/data_source/columns', method: 'get', params: { id: that.tempEdge.getSourceCell().store.data.data.dataSourceId, table: that.tempEdge.getSourceCell().store.data.data.tableName } }).then(res => {
        that.columnsDataLeft = res.data || []
        console.log(that.columnsDataLeft)
      })
      request({ url: '/data_source/columns', method: 'get', params: { id: that.tempEdge.getTargetCell().store.data.data.dataSourceId, table: that.tempEdge.getTargetCell().store.data.data.tableName } }).then(res => {
        that.columnsDataRight = res.data || []
        console.log(that.columnsDataRight)
      })
    },
    showConnectEdit() {
      let that = this
      console.log(that.tempEdge)
      that.addOrEditConnect = false
      that.dialogShowConnect = true
      that.formConnect = JSON.parse(JSON.stringify(that.tempEdge.store.data.form))
      that.tableNameLeft = that.tempEdge.getSourceCell().store.data.data.tableName
      that.tableNameRight = that.tempEdge.getTargetCell().store.data.data.tableName
      request({ url: '/data_source/columns', method: 'get', params: { id: that.tempEdge.getSourceCell().store.data.data.dataSourceId, table: that.tempEdge.getSourceCell().store.data.data.tableName } }).then(res => {
        that.columnsDataLeft = res.data || []
        console.log(that.columnsDataLeft)
      })
      request({ url: '/data_source/columns', method: 'get', params: { id: that.tempEdge.getTargetCell().store.data.data.dataSourceId, table: that.tempEdge.getTargetCell().store.data.data.tableName } }).then(res => {
        that.columnsDataRight = res.data || []
        console.log(that.columnsDataRight)
      })
    },
    disabledJudgeLeft(columnName) {
      let that = this
      let temp = []
      if (that.formConnect.connectList) {
        that.formConnect.connectList.forEach((item, index) => {
          temp.push(item.source)
        })
      }
      return temp.includes(columnName)
    },
    disabledJudgeRight(columnName) {
      let that = this
      let temp = []
      if (that.formConnect.connectList) {
        that.formConnect.connectList.forEach((item, index) => {
          temp.push(item.target)
        })
      }
      return temp.includes(columnName)
    },
    rejectConnect() {
      let that = this
      that.dialogShowConnect = false
      if (that.addOrEditConnect) {
        that.graph.removeCells([that.tempEdge])
      }
      that.tempEdge = {}
    },
    sureConnect() {
      let that = this
      that.$refs['formConnect'].validate(valid => {
        if (valid) {
          that.tempEdge.prop('id', that.tempEdge.store.data.source.cell + '-' + that.tempEdge.store.data.target.cell)
          that.tempEdge.prop('form', that.formConnect)
          that.dialogShowConnect = false
          that.tempEdge = {}
        } else {
          if (!that.formConnect.connectType) {
            Notify('error', '请选择关联方式')
          } else {
            Notify('error', '请将红色标注部分填写完整')
          }
        }
      })
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
