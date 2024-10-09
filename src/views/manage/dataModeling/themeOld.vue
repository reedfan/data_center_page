<template>
  <div class="manageMain theme">
    <div class="buttonArea">
      <el-button type="primary" icon="el-icon-plus" @click="newTheme()" size="mini">新建主题</el-button>
    </div>
    <div class="searchArea">
      <div class="searchFormUnit" style="width: 300px; float: right">
        <el-input v-model="queryNameTheme" placeholder="请输入主题名称"> <el-button slot="append" icon="el-icon-search" @click="getTreeTheme()"></el-button> </el-input>
      </div>
    </div>

    <div class="tableArea">
      <vue2-org-tree v-drag id="orgTree" :data="treeTheme" :horizontal="horizontal" :collapsable="collapsable" :render-content="renderContent" ref="treeDom" @on-expand="onExpand" @on-node-click="onNodeClick" />
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
                  <el-option v-for="(item, index) in treeTheme.children" v-bind:key="index" :label="item.topicName" :value="item.id"></el-option>
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
      queryNameTheme: '',
      treeTheme: { level: 1, topicName: '', topicNameEn: 'all' },
      loadingTreeTheme: false,

      parentOrChild: 'parent',
      formTheme: {
        parentId: '',
        topicName: '',
        topicNameEn: ''
      },

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
      that.loadingTreeTheme = true
      request({ url: '/datawarehouseTopic/getTreeList', method: 'post', data: {} }).then(res => {
        that.loadingTreeTheme = false
        res.data.forEach((item, index) => {
          item.level = 2
          if (item.childList) {
            item.children = item.childList
            item.children.forEach((item2, index2) => {
              item2.level = 3
            })
          } else {
            item.children = null
          }
        })
        that.treeTheme = {
          level: 1,
          topicName: '',
          topicNameEn: 'all',
          children: res.data
        }
        that.expandAllAction()
      })
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
    seeTheme(node, row) {
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
    cancelTheme(node, row) {
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
    },

    renderContent(h, data) {
      return (
        <div style={'width: ' + (data.topicName.length * 14 + 70) + 'px;height: auto;box-sizing: border-box'} class={'level' + data.level + ' ' + 'labelContent'}>
          <div style="width: auto;height: 30px;overflow:hidden">
            <p style={'width: auto;height: 30px;line-height: 30px;font-size: 14px;margin:0;color:#ffffff;margin-left:10px;margin-right:0px;' + (data.level != 1 ? 'float:left' : 'margin: 0 auto')}>{data.topicName}</p>
            <i class="el-icon-close actionIcon1" onClick={v => this.cancelTheme(v, data)} style={'cursor: pointer;float:right;margin-right:10px;color:#ffffff;font-size:16px;margin-top:7px;' + (data.level != 1 ? '' : 'display:none')}></i>
            <i class="el-icon-edit actionIcon2" onClick={v => this.seeTheme(v, data)} style={'cursor: pointer;float:right;margin-right:5px;color:#ffffff;font-size:16px;margin-top:7px;' + (data.level != 1 ? '' : 'display:none')}></i>
          </div>
          <div style={'width:auto;overflow:hidden;' + (data.level != 1 ? 'height:30px' : 'height:0px')}>
            <p style={'width: ' + (data.topicName.length * 14 + 50) + 'px;height: 30px;line-height:30px;font-size: 14px;margin:0;float:left;;margin-left:10px;margin-right:10px;text-align:left;overflow:hidden;white-space:nowrap;text-overflow:ellipsis'}>缩写:{data.topicNameEn}</p>
          </div>
        </div>
      )
    },

    onClick(v, data) {},
    dialogclicks(item) {},
    onerror(v, data) {
      console.log(data)
      this.deleteNode(data.id, this.treeTheme)
    },
    onExpand(e, data) {
      let that = this
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.children) {
          that.collapse(data.children)
        }
      } else {
        that.$set(data, 'expand', true)
      }
    },
    onNodeClick(e, data) {},
    collapse(list) {
      let that = this
      list.forEach(function (child) {
        if (child.expand) {
          child.expand = false
        }
        child.children && that.collapse(child.children)
      })
    },
    expandAllAction() {
      let that = this
      that.collapsable = true
      that.toggleExpand(that.treeTheme, that.expandAll)
    },
    toggleExpand(data, val) {
      let that = this
      if (Array.isArray(data)) {
        data.forEach(function (item) {
          that.$set(item, 'expand', val)
          if (item.children) {
            that.toggleExpand(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          that.toggleExpand(data.children, val)
        }
      }
    }
  }
}
</script>

<style >
@import '../../../assets/orgTree/orgTree.css';
</style>
