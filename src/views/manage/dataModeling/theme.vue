<template>
  <div class="manageMain theme" style="flex-direction: row">
    <div style="width: 216px; padding: 10px 24px 10px 0; height: 100%; border-right: 1px solid #e4e6eb">
      <p style="width: 100%; height: 28px; line-height: 28px; border-bottom: 1px solid #e4e6eb; font-size: 12px; text-align: center; color: #333333">主题信息</p>
      <el-tree style="height: calc(100% - 80px); margin-top: 10px; width: 100%; overflow: hidden auto" :data="treeTheme" node-key="id" :default-expanded-keys="expandKeysTheme" :props="treePropsTheme" ref="treeRef" :expand-on-click-node="false" @node-click="handleNodeClickTheme"> </el-tree>
    </div>
    <div style="width: calc(100% - 241px); height: 100%; border-right: 1px solid #e4e6eb; padding: 0 10px; display: flex; flex: 1; flex-direction: column">
      <div class="buttonArea">
        <el-button type="primary" icon="el-icon-plus" @click="newTheme()" size="mini">新建主题</el-button>
      </div>
      <div class="tableArea">
        <el-table v-loading="loadingTheme" element-loading-text="数据加载中" ref="table" :data="themeData" height="100%">
          <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column prop="topicName" label="主题名称" min-width="200" align="left"> </el-table-column>
          <el-table-column prop="topicNameEn" label="英文缩写" min-width="200" align="left"> </el-table-column>
          <el-table-column prop="level" label="类型" min-width="100" align="left">
            <template slot-scope="scope">
              {{ scope.row.level == 2 ? '父主题' : scope.row.level == 3 ? '子主题' : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="parent" label="父主题" min-width="100" align="left"> </el-table-column>

          <el-table-column label="操作" align="center" width="140" fixed="right">
            <template slot-scope="scope">
              <p class="tableAction" @click="seeTheme(scope.row)">修改</p>
              <p class="tableActionDanger" @click="cancelTheme(scope.row)">删除</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="titleTheme" :visible.sync="formShowTheme" width="550px">
      <el-form :model="formTheme" ref="formTheme" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row style="text-align: right; padding-bottom: 20px" v-if="addOrModifyTheme">
            <el-radio-group v-model="parentOrChild" size="small">
              <el-radio-button label="parent">父主题</el-radio-button>
              <el-radio-button label="child">子主题</el-radio-button>
            </el-radio-group>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24" v-if="parentOrChild == 'child'">
              <el-form-item label="父主题：" :required="parentOrChild == 'child'" prop="parentId">
                <el-select v-model="formTheme.parentId" filterable placeholder="" :disabled="!addOrModifyTheme">
                  <el-option v-for="(item, index) in treeTheme[0].children" v-bind:key="index" :label="item.topicName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="主题名称：" :required="true" prop="topicName">
                <el-input v-model.trim="formTheme.topicName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="英文缩写：" :required="true" prop="topicNameEn">
                <el-input v-model.trim="formTheme.topicNameEn" oninput="value=value.replace(/[^\w_]/g,'')" placeholder="仅支持数字、字母、_" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShowTheme = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" v-if="addOrModifyTheme" @click="addTheme()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
        <el-button type="primary" v-if="!addOrModifyTheme" @click="modifyTheme()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'theme',
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

      treeTheme: [{ level: 1, topicName: '全部', topicNameEn: 'all', id: 0 }],
      treePropsTheme: {
        label: 'topicName',
        value: 'id',
        children: 'children'
      },
      expandKeysTheme: [],

      parentOrChild: 'parent',
      formTheme: {
        parentId: '',
        topicName: '',
        topicNameEn: ''
      },
      themeData: [],
      loadingTheme: false,
      formShowTheme: false,
      titleTheme: '',
      addOrModifyTheme: true,

      horizontal: false, // 横版 竖版
      collapsable: true, // 子节点是否可折叠的
      expandAll: true // 是否全部展开
    }
  },
  directives: {
    drag: {
      // 指令的定义
      bind: function (el) {
        const odiv = el // 获取当前元素
        odiv.onmousedown = e => {
          // 算出鼠标相对元素的位置
          const disX = e.clientX - odiv.offsetLeft
          const disY = e.clientY - odiv.offsetTop

          document.onmousemove = e => {
            // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            const left = e.clientX - disX
            const top = e.clientY - disY
            // 移动当前元素
            odiv.style.left = left + 'px'
            odiv.style.top = top - 100 + 'px'
          }
          document.onmouseup = e => {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  mounted() {
    this.getTreeTheme()
  },
  methods: {
    // 获取主题树数据
    getTreeTheme() {
      let that = this
      that.loadingTheme = true
      request({ url: '/datawarehouseTopic/getTreeList', method: 'post', data: {} }).then(res => {
        that.expandKeysTheme = [0]
        that.themeData = []
        res.data.forEach((item, index) => {
          ;(item.level = 2), (item.parent = '-')
          that.themeData.push({ ...item })
          if (item.childList) {
            item.children = item.childList
            item.children.forEach((item2, index2) => {
              item2.level = 3
              item2.parent = item.topicName
              that.themeData.push({ ...item2 })
            })
          } else {
            item.children = null
          }
          that.expandKeysTheme.push(item.id)
        })
        that.treeTheme = [
          {
            level: 1,
            topicName: '全部',
            id: 0,
            topicNameEn: 'all',
            children: res.data
          }
        ]
        console.log(that.treeTheme)
        that.loadingTheme = false
        setTimeout(() => {
          that.$refs.treeRef.setCurrentKey('0')
        }, 100)
      })
    },
    handleNodeClickTheme(data) {
      console.log(data)
      let that = this
      that.themeData = []
      if (data.level == 1) {
        data.children.forEach((item, index) => {
          that.themeData.push({ ...item })
          if (item.children) {
            item.children.forEach((item2, index2) => {
              that.themeData.push({ ...item2 })
            })
          }
        })
      }
      if (data.level == 2) {
        that.themeData.push({ ...data })
        data.children.forEach((item, index) => {
          that.themeData.push({ ...item })
        })
      }
      if (data.level == 3) {
        that.themeData.push({ ...data })
      }
    },
    // 新建主题
    newTheme() {
      let that = this
      that.addOrModifyTheme = true
      that.formShowTheme = true
      that.buttonLoad = false
      that.titleTheme = '新建主题信息'
      resetForm('formTheme', that)
      that.formTheme.parentId = ''
    },
    // add主题
    addTheme() {
      let that = this
      that.$refs['formTheme'].validate(valid => {
        if (valid) {
          let params = { ...that.formTheme }
          // params.id = ''
          if (that.parentOrChild == 'parent') {
            params.parentId = null
          }
          that.buttonLoad = true
          request({ url: '/datawarehouseTopic/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.formShowTheme = false
                that.getTreeTheme()
              }
            })
            .catch(() => {
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
            })
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    seeTheme(row) {
      let that = this
      request({ url: '/datawarehouseTopic/getOneDataTopic', method: 'get', params: { id: row.id } }).then(res => {
        that.addOrModifyTheme = false
        that.formShowTheme = true
        that.buttonLoad = false
        that.titleTheme = '修改主题信息    [' + row.topicName + ']'
        resetForm('formTheme', that)
        if (res.data.parentId == 0) {
          that.parentOrChild = 'parent'
        } else {
          that.parentOrChild = 'child'
        }
        that.$nextTick(() => {
          that.formTheme = res.data
        })
      })
    },
    modifyTheme() {
      let that = this
      that.$refs['formTheme'].validate(valid => {
        if (valid) {
          let params = { ...that.formTheme }
          that.buttonLoad = true
          request({ url: '/datawarehouseTopic/updateDataTopic', method: 'post', data: params })
            .then(res => {
              res.code == 200 && Notify('success', res.message || '处理成功')

              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                that.formShowTheme = false
                that.getTreeTheme()
              }
            })
            .catch(() => {
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
            })
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    cancelTheme(row) {
      let that = this
      this.$confirm('是否删除[' + row.topicName + ']主题信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {}
          params.id = row.id
          request({
            url: '/datawarehouseTopic/deleteDataTopic',
            method: 'POST',
            data: params
          }).then(res => {
            res.code == 200 && Notify('success', res.message || '处理成功')
            that.getTreeTheme()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style >
@import '../../../assets/orgTree/orgTree.css';
</style>
