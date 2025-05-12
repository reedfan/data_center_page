<template>
  <div class="manageMain groupJob" style="flex-direction: row">
    <div style="width: 216px; padding: 10px 24px 10px 0; height: 100%; border-right: 1px solid #e4e6eb">
      <p style="width: 100%; height: 28px; line-height: 28px; border-bottom: 1px solid #e4e6eb; font-size: 12px; text-align: center; color: #333333">任务分组</p>
      <el-dropdown style="width: 100%; margin: 10px auto 0 auto" @command="handleCommand">
        <el-button icon="el-icon-plus" size="mini" style="width: 150px; margin: 0 auto; display: block"> 新建<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="fz">新建分组</el-dropdown-item>
          <el-dropdown-item command="rw">新建任务</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tree style="height: calc(100% - 80px); margin-top: 10px; width: 100%; overflow: hidden auto" node-key="id" ref="treeFZRW" :props="treePropsFZRW" :data="treeFZRWData" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClickFZRW">
        <span slot-scope="{ node, data }">
          <div style="width: 180px; height: 100%; overflow: hidden" @contextmenu.prevent="showGroupJobAction($event, data, node.level)">
            <i :class="node.level == 1 ? 'el-icon-files' : 'el-icon-position'" style="font-size: 16px; margin-right: 5px; float: left"></i>
            <p style="font-size: 12px; margin: 0; float: left; width: 140px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ node.level == 1 ? data.groupName : data.jobName }}</p>
            <!-- <i class="el-icon-edit" @click.stop="node.level == 1 ? seeGroup(data) : seeJob(data)" style="color: #ffffff; margin-right: 10px; font-size: 16px; float: right" v-if="(node.level == 1 && activeGroupId == data.id) || (node.level == 2 && activeJobId == data.id)"></i> -->
          </div>
        </span>
      </el-tree>
    </div>
    <div style="width: calc(100% - 482px); height: 100%; border-right: 1px solid #e4e6eb; position: relative">
      <div class="main-unit" style="width: 100%; height: 100%; position: relative; overflow: hidden" id="container"></div>
      <div style="width: calc(100% - 80px); height: 40px; padding: 0 20px; position: absolute; top: 0; right: 20px; text-align: right; line-height: 40px; background: #ffffff">
        <el-button type="primary" @click="seeJob(jobRow)" style="width: 100px" size="mini" v-if="jobRow.id && jobRow.status == 0">编辑</el-button>
        <el-button type="danger" @click="cancelJob(jobRow)" style="width: 100px" size="mini" v-if="jobRow.id && jobRow.status == 0">删除</el-button>
        <el-button @click="showHistory()" style="width: 100px" size="mini" v-if="jobRow.jobInfoLatestOldVersion && jobRow.status == 0">版本历史</el-button>
        <el-button type="primary" @click="getGraphData()" style="width: 100px" size="mini" :disabled="buttonLoad" :loading="buttonLoad" v-if="jobRow.id && jobRow.status == 0">保存</el-button>
        <el-button type="success" @click="publishJob(jobRow)" style="width: 100px" size="mini" :disabled="buttonLoad" :loading="buttonLoad" v-if="jobRow.status == 0">发布</el-button>
        <el-button @click="unPublishJob(jobRow)" style="width: 100px" size="mini" :disabled="buttonLoad" :loading="buttonLoad" v-if="jobRow.status == 1">取消发布</el-button>
      </div>
    </div>
    <div style="width: 216px; padding: 10px 0 10px 20px; height: 100%" class="no-select" v-show="jobRow.id">
      <el-select v-model="activeName" filterable placeholder="请选择类型">
        <el-option label="任务节点" value="node"></el-option>
        <el-option label="传输任务" value="sync"></el-option>
        <el-option label="SQL任务" value="sql"></el-option>
        <el-option label="质量监控" value="monitor"></el-option>
        <el-option label="形态探查" value="detect"></el-option>
        <el-option label="数据比对" value="compare"></el-option>
      </el-select>
      <div style="width: 100%; height: calc(100% - 50px); overflow: hidden auto; margin-top: 10px" v-if="activeName == 'sync'">
        <div class="dragUnit" style="width: 100%; height: 30px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in syncTaskList" :key="index" @mousedown="startDragToGraphNode('taskNode', $event, item, 'sync')">
          <p style="width: 32px; color: #ffffff; height: 20px; line-height: 20px; margin: 5px 5px 5px 2px; text-align: center; font-size: 10px; border-radius: 2px; background: #409eff; float: left">传输</p>
          <p :title="item.taskName" style="width: 140px; height: 30px; line-height: 30px; font-size: 12px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
            {{ item.taskName }}
          </p>
        </div>
      </div>
      <div style="width: 100%; height: calc(100% - 50px); overflow: hidden auto; margin-top: 10px" v-if="activeName == 'sql'">
        <div class="dragUnit" style="width: 100%; height: 30px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in sqlTaskList" :key="index" @mousedown="startDragToGraphNode('taskNode', $event, item, 'sql')">
          <p style="width: 32px; color: #ffffff; height: 20px; line-height: 20px; margin: 5px 5px 5px 2px; text-align: center; font-size: 10px; border-radius: 2px; background: #67c23a; float: left">SQL</p>
          <p :title="item.taskName" style="width: 140px; height: 30px; line-height: 30px; font-size: 12px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
            {{ item.taskName }}
          </p>
        </div>
      </div>
      <div style="width: 100%; height: calc(100% - 50px); overflow: hidden auto; margin-top: 10px" v-if="activeName == 'monitor'">
        <div class="dragUnit" style="width: 100%; height: 30px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in monitorTaskList" :key="index" @mousedown="startDragToGraphNode('taskNode', $event, item, 'monitor')">
          <p style="width: 32px; color: #ffffff; height: 20px; line-height: 20px; margin: 5px 5px 5px 2px; text-align: center; font-size: 10px; border-radius: 2px; background: #e6a23c; float: left">监控</p>
          <p :title="item.taskName" style="width: 140px; height: 30px; line-height: 30px; font-size: 12px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
            {{ item.taskName }}
          </p>
        </div>
      </div>
      <div style="width: 100%; height: calc(100% - 50px); overflow: hidden auto; margin-top: 10px" v-if="activeName == 'detect'">
        <div class="dragUnit" style="width: 100%; height: 30px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in detectTaskList" :key="index" @mousedown="startDragToGraphNode('taskNode', $event, item, 'detect')">
          <p style="width: 32px; color: #ffffff; height: 20px; line-height: 20px; margin: 5px 5px 5px 2px; text-align: center; font-size: 10px; border-radius: 2px; background: #e6a23c; float: left">探查</p>
          <p :title="item.taskName" style="width: 140px; height: 30px; line-height: 30px; font-size: 12px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
            {{ item.taskName }}
          </p>
        </div>
      </div>
      <div style="width: 100%; height: calc(100% - 50px); overflow: hidden auto; margin-top: 10px" v-if="activeName == 'compare'">
        <div class="dragUnit" style="width: 100%; height: 30px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in compareTaskList" :key="index" @mousedown="startDragToGraphNode('taskNode', $event, item, 'compare')">
          <p style="width: 32px; color: #ffffff; height: 20px; line-height: 20px; margin: 5px 5px 5px 2px; text-align: center; font-size: 10px; border-radius: 2px; background: #e6a23c; float: left">比对</p>
          <p :title="item.taskName" style="width: 140px; height: 30px; line-height: 30px; font-size: 12px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
            {{ item.taskName }}
          </p>
        </div>
      </div>

      <div style="width: 100%; height: calc(100% - 50px); overflow: hidden auto; margin-top: 10px" v-if="activeName == 'node'">
        <div class="dragUnit" style="width: 100%; height: 30px; overflow: hidden; cursor: move; margin-bottom: 5px" @mousedown="startDragToGraphNode('nestedNode', $event, null, null)">
          <p style="width: 32px; color: #ffffff; height: 20px; line-height: 20px; margin: 5px 5px 5px 2px; text-align: center; font-size: 10px; border-radius: 2px; background: #f56c6c; float: left">嵌套</p>
          <p title="嵌套节点" style="width: 140px; height: 30px; line-height: 30px; font-size: 12px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">嵌套节点</p>
        </div>
      </div>
    </div>

    <el-dialog :title="titleGroup" :visible.sync="formShowGroup" width="550px">
      <el-form :model="formGroup" ref="formGroup" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="项目组：" :required="true" prop="projectGroupId">
                <el-select v-model="formGroup.projectGroupId" filterable placeholder="">
                  <el-option v-for="(item, index) in projectGroupList" v-bind:key="index" :label="item.projectGroupName" :value="item.projectGroupId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="分组名称：" :required="true" prop="groupName">
                <el-input v-model.trim="formGroup.groupName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述：" :required="true" prop="groupDesc">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model.trim="formGroup.groupDesc" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShowGroup = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="addOrModifyGroup" @click="addGroup()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="!addOrModifyGroup" @click="modifyGroup()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleJob" :visible.sync="formShowJob" width="550px">
      <el-form :model="formJob" ref="formJob" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="项目组：" :required="true" prop="projectGroupId">
                <el-select v-model="formJob.projectGroupId" filterable placeholder="">
                  <el-option v-for="(item, index) in projectGroupList" v-bind:key="index" :label="item.projectGroupName" :value="item.projectGroupId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务名称：" :required="true" prop="jobName">
                <el-input v-model.trim="formJob.jobName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属分组：" :required="true" prop="jobGroupId">
                <el-select v-model="formJob.jobGroupId" filterable placeholder="">
                  <el-option v-for="(item, index) in groupList" v-bind:key="index" :label="item.groupName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="cron表达式：" :required="true" prop="unixExpression">
                <el-input v-model="formJob.unixExpression" autocomplete="off"> <el-button slot="append" icon="el-icon-edit-outline" @click="showCronAction()"></el-button></el-input>
              </el-form-item>
              <el-dialog title="cron表达式配置" :visible.sync="showCron" width="550px">
                <el-form :model="formCron" ref="formCron" :rules="rules" label-width="100px" :show-message="false" class="demo-ruleForm">
                  <el-form-item label="输入说明：">
                    <p style="background-color: rgba(0, 115, 251, 0.1); width: calc(100% - 30px); height: auto; line-height: 20px; font-size: 12px; text-align: left; padding: 15px; color: #333333">1. 分钟：可输入0～59的整数，以及4种特殊字符：, - * / <br />2. 小时：可输入0～23的整数，以及4种特殊字符：, - * / <br />3. 天：可输入0～31的整数，以及4种特殊字符：, - * / <br />4. 月：可输入1～12的整数或者 JAN-DEC，以及4种特殊字符：, - * / <br />5. 星期：可输入0～7的整数以及4种特殊字符</p>
                  </el-form-item>
                  <el-form-item label="分钟：" prop="minute" :required="true">
                    <el-input v-model="formCron.minute" placeholder="" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="小时：" prop="hour" :required="true">
                    <el-input v-model="formCron.hour" placeholder="" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="天：" prop="day" :required="true">
                    <el-input v-model="formCron.day" placeholder="" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="月：" prop="month" :required="true">
                    <el-input v-model="formCron.month" placeholder="" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="星期：" prop="week" :required="true">
                    <el-input v-model="formCron.week" placeholder="" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="表达式预览：">
                    <p style="background-color: #f3f3f3; width: 100%; height: 32px; line-height: 32px; font-size: 12px; text-align: left; text-indent: 15px; color: #333333">{{ formCron.minute }} {{ formCron.hour }} {{ formCron.day }} {{ formCron.month }} {{ formCron.week }}</p>
                  </el-form-item>
                  <el-form-item label="执行时间预览：" v-if="nextFiveExecutions.length > 0">
                    <p v-for="(item, index) in nextFiveExecutions" :key="index" style="background-color: #f3f3f3; width: 100%; height: 32px; line-height: 32px; font-size: 12px; text-align: left; text-indent: 15px; color: #333333">{{ item }}</p>
                  </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                  <el-button @click="showCron = false" style="width: 100px" size="mini">取 消</el-button>
                  <el-button type="primary" @click="judgeCron()" style="width: 100px" size="mini">校 验</el-button>
                  <el-button type="primary" @click="saveCron()" style="width: 100px" size="mini" v-if="cronTrue">保 存</el-button>
                </div>
              </el-dialog>
            </el-col>

            <el-col :span="24">
              <el-form-item label="描述：" prop="jobDescription">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model.trim="formJob.jobDescription" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShowJob = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="addOrModifyJob" @click="addJob()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
        <el-button type="primary" style="width: 100px" size="mini" v-if="!addOrModifyJob" @click="modifyJob()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="嵌套任务详情" :visible.sync="dialogShowNested" width="1250px">
      <el-form :model="formNested" ref="formNested" label-width="140px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <!-- <el-col :span="24">
              <el-form-item label="nodeId：" :required="true" prop="nodeId">
                <el-input v-model.trim="formNested.nodeId" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="24">
              <el-form-item label="节点名称：" :required="true" prop="nodeName">
                <el-input v-model.trim="formNested.nodeName" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
              <el-form-item label="nodeType：" :required="true" prop="nodeType">
                <el-input v-model.trim="formNested.nodeType" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="nodeTaskDtoList：" :required="true" prop="nodeTaskDtoList">
                <el-input v-model.trim="formNested.nodeTaskDtoList" autocomplete="off"> </el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
        </div>
      </el-form>
      <div style="display: flex; flex-direction: row; width: 100%; height: 500px">
        <div class="main-unit" style="width: calc(100% - 220px); height: 500px; position: relative; overflow: hidden" id="containerInNested"></div>
        <div style="width: 216px; padding: 0 0 10px 20px; height: 100%" class="no-select">
          <el-select v-model="activeNameNested" filterable placeholder="请选择类型">
            <el-option label="传输任务" value="sync"></el-option>
            <el-option label="SQL任务" value="sql"></el-option>
            <el-option label="质量监控" value="monitor"></el-option>
            <el-option label="形态探查" value="detect"></el-option>
            <el-option label="数据比对" value="compare"></el-option>
          </el-select>

          <div style="width: 100%; height: calc(100% - 50px); overflow: hidden auto; margin-top: 10px" v-if="activeNameNested == 'sync'">
            <div class="dragUnit" style="width: 100%; height: 30px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in syncTaskList" :key="index" @mousedown="startDragToGraphInNested(item, 'sync', $event)">
              <p style="width: 32px; color: #ffffff; height: 20px; line-height: 20px; margin: 5px 5px 5px 2px; text-align: center; font-size: 10px; border-radius: 2px; background: #409eff; float: left">传输</p>
              <p :title="item.taskName" style="width: 140px; height: 30px; line-height: 30px; font-size: 12px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                {{ item.taskName }}
              </p>
            </div>
          </div>
          <div style="width: 100%; height: calc(100% - 50px); overflow: hidden auto; margin-top: 10px" v-if="activeNameNested == 'sql'">
            <div class="dragUnit" style="width: 100%; height: 30px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in sqlTaskList" :key="index" @mousedown="startDragToGraphInNested(item, 'sql', $event)">
              <p style="width: 32px; color: #ffffff; height: 20px; line-height: 20px; margin: 5px 5px 5px 2px; text-align: center; font-size: 10px; border-radius: 2px; background: #67c23a; float: left">SQL</p>
              <p :title="item.taskName" style="width: 140px; height: 30px; line-height: 30px; font-size: 12px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                {{ item.taskName }}
              </p>
            </div>
          </div>
          <div style="width: 100%; height: calc(100% - 50px); overflow: hidden auto; margin-top: 10px" v-if="activeNameNested == 'monitor'">
            <div class="dragUnit" style="width: 100%; height: 30px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in monitorTaskList" :key="index" @mousedown="startDragToGraphInNested(item, 'monitor', $event)">
              <p style="width: 32px; color: #ffffff; height: 20px; line-height: 20px; margin: 5px 5px 5px 2px; text-align: center; font-size: 10px; border-radius: 2px; background: #e6a23c; float: left">监控</p>
              <p :title="item.taskName" style="width: 140px; height: 30px; line-height: 30px; font-size: 12px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                {{ item.taskName }}
              </p>
            </div>
          </div>
          <div style="width: 100%; height: calc(100% - 50px); overflow: hidden auto; margin-top: 10px" v-if="activeNameNested == 'detect'">
            <div class="dragUnit" style="width: 100%; height: 30px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in detectTaskList" :key="index" @mousedown="startDragToGraphInNested(item, 'detect', $event)">
              <p style="width: 32px; color: #ffffff; height: 20px; line-height: 20px; margin: 5px 5px 5px 2px; text-align: center; font-size: 10px; border-radius: 2px; background: #e6a23c; float: left">探查</p>
              <p :title="item.taskName" style="width: 140px; height: 30px; line-height: 30px; font-size: 12px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                {{ item.taskName }}
              </p>
            </div>
          </div>
          <div style="width: 100%; height: calc(100% - 50px); overflow: hidden auto; margin-top: 10px" v-if="activeNameNested == 'compare'">
            <div class="dragUnit" style="width: 100%; height: 30px; overflow: hidden; cursor: move; margin-bottom: 5px" v-for="(item, index) in compareTaskList" :key="index" @mousedown="startDragToGraphInNested(item, 'compare', $event)">
              <p style="width: 32px; color: #ffffff; height: 20px; line-height: 20px; margin: 5px 5px 5px 2px; text-align: center; font-size: 10px; border-radius: 2px; background: #e6a23c; float: left">比对</p>
              <p :title="item.taskName" style="width: 140px; height: 30px; line-height: 30px; font-size: 12px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                {{ item.taskName }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowNested = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" style="width: 100px" size="mini" @click="modifyNested()" :disabled="buttonLoad" :loading="buttonLoad">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="任务详情" :visible.sync="dialogShowTask" class="fullScreenDialog" width="100%">
      <syncTasksDialog v-if="dialogShowTask" :addOrModifyOrCopyTask="addOrModifyOrCopyTask" :taskRow="taskRow" @close="dialogShowTask = false" @getData="''"></syncTasksDialog>
    </el-dialog>
    <el-dialog title="任务详情" :visible.sync="dialogShowTaskSQL" width="900px">
      <offlineTasksDialog v-if="dialogShowTaskSQL" :addOrModifyTask="addOrModifyTaskSQL" :taskRow="taskRowSQL" @close="dialogShowTaskSQL = false" @getData="''"></offlineTasksDialog>
    </el-dialog>
    <el-dialog title="版本历史" :visible.sync="dialogShowHistory" class="fullScreenDialog" width="100%">
      <jobHistory v-if="dialogShowHistory" :jobRowProp="jobRow" @close="dialogShowHistory = false" @refresh="refresh"></jobHistory>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText, dateFormat } from '@/api/common'
import request from '@/api/request'
import cronParser from 'cron-parser'
import { Graph } from '@antv/x6'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Dnd } from '@antv/x6-plugin-dnd'
import { register, getTeleport } from '@antv/x6-vue-shape'
import { Selection } from '@antv/x6-plugin-selection'
import syncTasksDialog from './../dataIntegration/components/syncTasksDialog.vue'
import offlineTasksDialog from './../dataDevelop/components/offlineTasksDialog.vue'
import jobHistory from './../dataIntegration/components/jobHistory.vue'
import taskNodeIn from './nodeComponents/taskNodeIn.vue'
import taskNode from './nodeComponents/taskNode.vue'
import beginNode from './nodeComponents/beginNode.vue'
import endNode from './nodeComponents/endNode.vue'
import nestedNode from './nodeComponents/nestedNode.vue'
register({
  shape: 'taskNode',
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
  component: taskNode
})
register({
  shape: 'taskNodeIn',
  component: taskNodeIn
})
register({
  shape: 'nestedNode',
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
  component: nestedNode
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
  name: 'groupJob',
  components: {
    pagination,
    syncTasksDialog,
    offlineTasksDialog,
    jobHistory
  },
  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      buttonLoad: false,
      treeFZRWData: [],
      treePropsFZRW: {
        label: 'label',
        children: 'children',
        isLeaf: 'leaf'
      },
      activeJobId: '',
      jobRow: '',
      activeGroupId: '',

      graph: null,
      graphInNested: null,
      groupList: [],
      syncTaskList: [],
      sqlTaskList: [],
      monitorTaskList: [],
      detectTaskList: [],
      compareTaskList: [],

      formGroup: {
        groupName: '',
        groupDesc: '',
        projectGroupId: ''
      },
      formShowGroup: false,
      titleGroup: '',
      addOrModifyGroup: true,

      formJob: {
        projectGroupId: '',
        jobName: '',
        jobGroupId: '',
        jobGroupName: '',
        unixExpression: '',
        jobDescription: '',
        jobTaskInfoList: { jobTaskInfoList: [] }
      },
      jobTaskInfoList: [],
      formShowJob: false,
      titleJob: '',
      addOrModifyJob: true,
      showCron: false,
      formCron: {
        minute: '',
        hour: '',
        day: '',
        month: '',
        week: ''
      },
      nextFiveExecutions: [],
      cronTrue: false,

      projectGroupList: [],

      nodes: [
        {
          shape: 'beginNode',
          x: 100,
          y: 100,
          width: 300,
          height: 70,
          id: 'beginNode',
          data: {
            nodeName: 'beginNode',
            nodeId: 'beginNode',
            nodeType: 'beginNode',
            nodeTaskDtoList: []
          }
        },
        {
          shape: 'endNode',
          x: 100,
          y: 600,
          width: 300,
          height: 70,
          id: 'endNode',
          data: {
            nodeName: 'endNode',
            nodeId: 'endNode',
            nodeType: 'endNode',
            nodeTaskDtoList: []
          }
        }
      ],
      edges: [],
      tempEdge: {},
      tempNode: {},

      activeName: 'node',

      dialogShowTask: false,
      addOrModifyOrCopyTask: '',
      taskRow: '',

      addOrModifyTaskSQL: false,
      taskRowSQL: '',
      dialogShowTaskSQL: false,

      dialogShowHistory: false,

      dialogShowNested: false,
      activeNameNested: 'sync',
      nestedNodeRow: '',
      formNested: {
        nodeName: '',
        nodeId: '',
        nodeType: '',
        nodeTaskDtoList: []
      }
    }
  },
  mounted() {
    this.getTreeFZRWData()
    this.getSyncTaskList()
    this.getSqlTaskList()
    this.getMonitorTaskList()
    this.getDetectTaskList()
    this.getCompareTaskList()
    this.getProjectGroupList()
    this.getGroupList()
    if (this.$route.query.activeJobId) {
      this.activeJobId = this.$route.query.activeJobId
      request({ url: '/job_info/get', method: 'get', params: { id: this.activeJobId } }).then(res2 => {
        this.getNodesAndEdges(res2.data)
      })
    }
  },
  methods: {
    getTreeFZRWData() {
      let that = this
      that.treeFZRWData = []
      request({ url: '/job_group_info/tree_list', method: 'get', params: {} }).then(res => {
        res.data.forEach((item, index) => {
          that.treeFZRWData.push({ ...item.label, children: item.children })
        })
        setTimeout(() => {
          that.$refs.treeFZRW.setCurrentKey(that.activeGroupId || that.activeJobId)
        }, 300)
      })
    },

    handleNodeClickFZRW(data, node) {
      console.log(data)
      console.log(node)
      let that = this
      if (node.level == 1) {
        that.activeGroupId = data.id
      }
      if (node.level == 2) {
        that.activeGroupId = ''
        that.activeJobId = data.id
        request({ url: '/job_info/get', method: 'get', params: { id: data.id } }).then(res => {
          that.getNodesAndEdges(res.data)
        })
      }
    },
    refresh() {
      let that = this
      request({ url: '/job_info/get', method: 'get', params: { id: that.activeJobId } }).then(res => {
        that.getNodesAndEdges(res.data)
      })
    },
    handleCommand(command) {
      let that = this
      if (command == 'fz') {
        that.newGroup()
      } else if (command == 'rw') {
        that.newJob()
      }
    },
    getProjectGroupList() {
      let that = this
      request({ url: '/project_group_permission/user_info_id', method: 'get', params: { userInfoId: that.$store.state.userInfo.id } }).then(res => {
        that.projectGroupList = res.data
      })
    },
    // 获取group列表
    getGroupList() {
      let that = this
      request({ url: '/job_group_info/get', method: 'get', params: {} }).then(res => {
        that.groupList = res.data
      })
    },
    // 获取jobTaskInfoList
    getSyncTaskList() {
      let that = this
      request({ url: '/task_info/list', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.syncTaskList = []
        res.data.list.forEach((item, index) => {
          that.syncTaskList.push({ taskName: item.taskName, id: 'data_sync_task-{' + item.id + '}', realId: item.id })
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
    // 获取monitorTaskList
    getMonitorTaskList() {
      let that = this
      request({ url: '/monitor/list', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.monitorTaskList = []
        res.data.list.forEach((item, index) => {
          that.monitorTaskList.push({ taskName: item.monitorName, id: 'monitor_task-{' + item.id + '}', realId: item.id })
        })
      })
    },
    // 获取detectTaskList
    getDetectTaskList() {
      let that = this
      request({ url: '/formDetect/getFormDetectPage', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.detectTaskList = []
        res.data.list.forEach((item, index) => {
          that.detectTaskList.push({ taskName: item.taskName, id: 'form_detect_task-{' + item.id + '}', realId: item.id })
        })
      })
    },
    // 获取compareTaskList
    getCompareTaskList() {
      let that = this
      request({ url: '/table_compare/list', method: 'get', params: { page: 1, pageSize: 10000 } }).then(res => {
        that.compareTaskList = []
        res.data.list.forEach((item, index) => {
          that.compareTaskList.push({ taskName: item.dataCompareName, id: 'table_compare_task-{' + item.id + '}', realId: item.id })
        })
      })
    },
    showGroupJobAction(event, row, level) {
      let that = this
      if (level == 1) {
        that.$contextmenu({
          items: [
            {
              icon: 'el-icon-edit-outline',
              label: '编辑分组',
              onClick: () => {
                that.seeGroup(row)
              }
            },
            {
              icon: 'el-icon-delete',
              label: '删除分组',
              onClick: () => {
                that.cancelGroup(row)
              }
            }
          ],
          event, // 鼠标事件信息
          customClass: 'custom-class', // 自定义菜单样式
          zIndex: 3000, // 菜单的 z-index
          minWidth: 130 // 菜单的最小宽度
        })
      }
      if (level == 2 && row.status == 0) {
        that.$contextmenu({
          items: [
            {
              icon: 'el-icon-edit-outline',
              label: '编辑任务',
              onClick: () => {
                that.seeJob(row)
              }
            },
            {
              icon: 'el-icon-delete',
              label: '删除任务',
              onClick: () => {
                that.cancelJob(row)
              }
            }
          ],
          event, // 鼠标事件信息
          customClass: 'custom-class', // 自定义菜单样式
          zIndex: 3000, // 菜单的 z-index
          minWidth: 130 // 菜单的最小宽度
        })
      }
    },
    // 新建分组
    newGroup() {
      let that = this
      that.addOrModifyGroup = true
      that.formShowGroup = true
      that.buttonLoad = false
      that.titleGroup = '新建分组信息'
      resetForm('formGroup', that)
    },
    // add分组
    addGroup() {
      let that = this
      that.$refs['formGroup'].validate(valid => {
        if (valid) {
          let params = that.formGroup
          that.buttonLoad = true
          request({ url: '/job_group_info/add', method: 'post', data: params })
            .then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowGroup = false), that.getTreeFZRWData())
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
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
    seeGroup(row) {
      let that = this
      that.addOrModifyGroup = false
      that.formShowGroup = true
      that.buttonLoad = false
      that.titleGroup = '修改分组信息    [' + row.groupName + ']'
      that.$nextTick(() => {
        that.formGroup = JSON.parse(JSON.stringify(row))
      })
    },
    // 修改数据源信息
    modifyGroup() {
      let that = this
      that.$refs['formGroup'].validate(valid => {
        if (valid) {
          let params = {}
          params.id = that.formGroup.id
          params.jobDescription = that.formGroup.groupDesc
          params.jobGroupName = that.formGroup.groupName
          params.projectGroupId = that.formGroup.projectGroupId
          that.buttonLoad = true
          request({ url: '/job_group_info/update', method: 'post', data: params })
            .then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowGroup = false), that.getTreeFZRWData())
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
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
    cancelGroup(row) {
      let that = this
      this.$confirm('是否删除[' + row.groupName + ']分组信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request({ url: '/job_group_info/delete', method: 'post', data: { id: row.id } }).then(res => {
            if (res.code == 200) {
              Notify('success', res.message || '处理成功'), that.getTreeFZRWData()
            }
          })
        })
        .catch(() => {})
    },
    // 新建任务
    newJob() {
      let that = this
      that.addOrModifyJob = true
      that.formShowJob = true
      that.buttonLoad = false
      that.titleJob = '新建任务信息'
      resetForm('formJob', that)
      that.getGroupList()
      that.formJob = {
        projectGroupId: '',
        jobName: '',
        jobGroupId: '',
        jobGroupName: '',
        unixExpression: '',
        jobDescription: '',
        jobTaskInfoList: { jobTaskInfoList: [] }
      }
    },
    // add任务
    addJob() {
      let that = this
      that.$refs['formJob'].validate(valid => {
        if (valid) {
          let params = that.formJob
          params.jobGroupName = that.groupList.filter(s => {
            return s.id == that.formJob.jobGroupId
          })[0].groupName
          that.buttonLoad = true
          // params.nodeDto={}
          request({ url: '/job_info/add', method: 'post', data: params })
            .then(res => {
              if (res.code == '200') {
                Notify('success', res.message || '处理成功')
                that.formShowJob = false
                that.getTreeFZRWData()
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
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    // 查看单个数据源信息
    seeJob(row) {
      let that = this
      that.addOrModifyJob = false
      that.formShowJob = true
      that.buttonLoad = false
      that.titleJob = '修改任务信息    [' + row.jobName + ']'
      that.getGroupList()
      that.$nextTick(() => {
        resetForm('formJob', that)
        that.formJob = { ...row }
      })
    },
    // 修改数据源信息
    modifyJob() {
      let that = this
      that.$refs['formJob'].validate(valid => {
        if (valid) {
          let params = that.formJob
          params.jobGroupName = that.groupList.filter(s => {
            return s.id == that.formJob.jobGroupId
          })[0].groupName
          that.buttonLoad = true
          request({ url: '/job_info/update', method: 'post', data: params })
            .then(res => {
              res.code == 200 && (Notify('success', res.message || '处理成功'), (that.formShowJob = false), that.getTreeFZRWData())
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
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
    cancelJob(row) {
      let that = this
      that
        .$confirm('是否删除[' + row.jobName + ']任务信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/job_info/delete', method: 'post', data: { id: row.id } }).then(res => {
            if (res.code == 200) {
              Notify('success', res.message || '处理成功')
              that.getTreeFZRWData()
            }
          })
        })
        .catch(() => {})
    },
    showCronAction() {
      let that = this
      that.formCron.minute = that.formJob.unixExpression.split(' ')[0] || '*'
      that.formCron.hour = that.formJob.unixExpression.split(' ')[1] || '*'
      that.formCron.day = that.formJob.unixExpression.split(' ')[2] || '*'
      that.formCron.month = that.formJob.unixExpression.split(' ')[3] || '*'
      that.formCron.week = that.formJob.unixExpression.split(' ')[4] || '*'
      that.showCron = true
    },
    judgeCron() {
      let that = this
      that.$refs['formCron'].validate(valid => {
        if (valid) {
          const now = new Date()
          let unixExpression = ''
          unixExpression = that.formCron.minute + ' ' + that.formCron.hour + ' ' + that.formCron.day + ' ' + that.formCron.month + ' ' + that.formCron.week
          let interval = null
          try {
            // interval = cronParser.parseExpression(unixExpression, { currentDate: now, tz: 'local' })
            interval = cronParser.parseExpression(unixExpression)
          } catch (error) {
            Notify('error', 'cron表达式格式错误')
            that.nextFiveExecutions = []
            that.cronTrue = false
            return
          }
          that.nextFiveExecutions = [] // 初始化数组存储接下来的五次执行时间
          for (let i = 1; i <= 5; i++) {
            // 循环计算接下来的五次执行时间
            const nextTime = dateFormat('YYYY-mm-dd HH:MM:SS', new Date(interval.next().toDate())) // 获取下一次执行的时间
            that.nextFiveExecutions.push(nextTime) // 添加到数组中
          }
          that.cronTrue = true
          Notify('success', 'cron表达式格式正确')
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    saveCron() {
      let that = this
      that.$refs['formCron'].validate(valid => {
        if (valid) {
          that.formJob.unixExpression = that.formCron.minute + ' ' + that.formCron.hour + ' ' + that.formCron.day + ' ' + that.formCron.month + ' ' + that.formCron.week
          that.showCron = false
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    // 发布
    publishJob(row) {
      let that = this
      that
        .$confirm('是否发布[' + row.jobName + ']任务信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/job_info/update_job_status', method: 'post', data: { id: row.id, status: 'EFFECTIVE' } }).then(res => {
            if (res.code == 200) {
              Notify('success', res.message || '处理成功')
              request({ url: '/job_info/get', method: 'get', params: { id: row.id } }).then(res2 => {
                that.getNodesAndEdges(res2.data)
              })
            }
          })
        })
        .catch(() => {})
    },
    // 取消发布
    unPublishJob(row) {
      let that = this
      that
        .$confirm('是否取消发布[' + row.jobName + ']任务信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          request({ url: '/job_info/update_job_status', method: 'post', data: { id: row.id, status: 'NOT_EFFECTIVE' } }).then(res => {
            if (res.code == 200) {
              Notify('success', res.message || '处理成功')
              request({ url: '/job_info/get', method: 'get', params: { id: row.id } }).then(res2 => {
                that.getNodesAndEdges(res2.data)
              })
            }
          })
        })
        .catch(() => {})
    },

    // 获取点和线
    getNodesAndEdges(row) {
      let that = this
      that.jobRow = row
      if (that.jobRow.graphInfo) {
        that.nodes = []
        that.edges = []
        console.log(JSON.parse(that.jobRow.graphInfo))
        let graphInfo = JSON.parse(that.jobRow.graphInfo)
        graphInfo.cells.forEach((item, index) => {
          if (item.shape == 'beginNode' || item.shape == 'endNode' || item.shape == 'jobNode') {
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
            id: 1,
            data: {
              nodeName: 'beginNode',
              nodeId: 1,
              nodeType: 'beginNode',
              nodeTaskDtoList: []
            },
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
            id: 2,
            data: {
              nodeName: 'endNode',
              nodeId: 2,
              nodeType: 'endNode',
              nodeTaskDtoList: []
            },
            zIndex: 1
          }
        ]
        that.edges = []
      }
      if (that.graph) {
        that.graph.dispose()
      }
      setTimeout(() => {
        that.initGraph()
      }, 300)
      console.log(that.nodes)
    },
    initGraph() {
      let that = this
      that.graph = new Graph({
        container: document.getElementById('container'),
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
        if (node.id == '1' || node.id == '2') {
          return
        }
        if (node.store.data.data.nodeType == 'nestedNode') {
          that.$contextmenu({
            items: [
              {
                icon: 'el-icon-edit-outline',
                label: '编辑',
                onClick: () => {
                  that.seeNestedNodeForm(node)
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
        } else {
          that.$contextmenu({
            items: [
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
        }
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
    startDragToGraphNode(type, e, item, taskType) {
      console.log(item)
      let that = this
      if (item) {
        let temp = Date.now()
        let node = that.graph.createNode({
          shape: type,
          id: temp,
          data: { nodeId: temp, nodeType: 'taskNode', nodeName: item.taskName, nodeTaskDtoList: [{ taskId: item.realId, taskName: item.taskName, taskType: taskType }] }
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
      } else {
        let temp = Date.now()
        let node = that.graph.createNode({
          shape: type,
          id: temp,
          data: { nodeId: temp, nodeType: 'nestedNode', nodeName: temp, nodeTaskDtoList: '' }
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
      }
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
        const allPaths = findAllPaths(graph, '1', '2')
        console.log(allPaths)
        // 将所有路径转换为字符串并输出
        const pathStrings = allPaths.map(path => path.join('-'))
        console.log(pathStrings)
        let nodes2 = {}
        let edges2 = []
        that.graph.toJSON().cells.forEach(cell => {
          if (cell.shape === 'edge') {
            edges2.push(cell)
          } else {
            nodes2[cell.id] = { ...cell.data, preNodeIdList: that.getPreNodes(cell.id), nextNodeIdList: that.getNextNodes(cell.id), children: [] }
          }
        })
        // 构建树形结构
        edges2.forEach(edge => {
          const sourceId = edge.source.cell
          const targetId = edge.target.cell
          if (nodes2[sourceId] && nodes2[targetId]) {
            nodes2[sourceId].children.push(nodes2[targetId])
          }
        })
        console.log('nodes', [nodes2['1']])

        that.buttonLoad = true
        let params = { ...that.jobRow }
        params.graphInfo = JSON.stringify(that.graph.toJSON())
        params.nodeDto = nodes2['1']
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

    getPreNodes(nodeId) {
      let that = this
      let preNodes = []
      let edges = []
      let nodes = []
      that.graph.toJSON().cells.forEach(cell => {
        if (cell.shape === 'edge') {
          edges.push(cell)
        } else {
          nodes.push(cell)
        }
      })
      edges.forEach(edge => {
        if (edge.target.cell == nodeId) {
          console.log('edge', edge)
          preNodes.push(edge.source.cell)
        }
      })
      return preNodes
    },
    getNextNodes(nodeId) {
      let that = this
      let nextNodes = []
      let edges = []
      let nodes = []
      that.graph.toJSON().cells.forEach(cell => {
        if (cell.shape === 'edge') {
          edges.push(cell)
        } else {
          nodes.push(cell)
        }
      })
      edges.forEach(edge => {
        if (edge.source.cell == nodeId) {
          nextNodes.push(edge.target.cell)
        }
      })
      return nextNodes
    },
    deleteGraphCell(cell) {
      if (cell.id == '1') {
        Notify('error', '请不要删除开始节点')
        return
      }
      if (cell.id == '2') {
        Notify('error', '请不要删除结束节点')
        return
      }
      console.log(cell)
      this.graph.removeCells([cell])
    },

    // 查看嵌套节点
    seeNestedNodeForm(node) {
      console.log(node)
      let that = this
      that.nestedNodeRow = node
      that.formNested = { ...node.store.data.data }
      that.dialogShowNested = true
      let nodes = []
      if (node.store.data.data.nodeTaskDtoListGraphInfo) {
        console.log(JSON.parse(that.jobRow.graphInfo))
        let graphInfo = JSON.parse(node.store.data.data.nodeTaskDtoListGraphInfo)
        graphInfo.cells.forEach((item, index) => {
          nodes.push(item)
        })
      }
      if (that.graphInNested) {
        that.graphInNested.dispose()
      }
      setTimeout(() => {
        that.initGraphInNested(nodes)
      }, 300)
    },
    initGraphInNested(nodes) {
      let that = this
      that.graphInNested = new Graph({
        container: document.getElementById('containerInNested'),
        autoResize: true,
        translating: { restrict: true },
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: 'ctrl',
          minScale: 0.5,
          maxScale: 3
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
          }
          // 连接桩吸附连线时在连接桩外围围渲染一个包围框
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
      that.graphInNested.fromJSON({
        nodes: nodes,
        edges: []
      })
      // 实现画布内容居中
      that.graphInNested.centerContent()
      // 增加对齐线
      that.graphInNested.use(
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
      that.graphInNested.use(
        new Snapline({
          enabled: true
        })
      )

      that.graphInNested.on('node:contextmenu', ({ e, x, y, node, view }) => {
        let event = e.originalEvent
        console.log(e)
        console.log(x)
        console.log(y)
        console.log(node)
        console.log(view)

        that.$contextmenu({
          items: [
            {
              icon: 'el-icon-delete',
              label: '删除',
              onClick: () => {
                that.deleteGraphCellInNested(node)
              }
            }
          ],
          event, // 鼠标事件信息
          customClass: 'custom-class', // 自定义菜单样式
          zIndex: 3000, // 菜单的 z-index
          minWidth: 230 // 菜单的最小宽度
        })
      })
    },
    startDragToGraphInNested(item, type, e) {
      console.log(item)
      let that = this
      let node = that.graphInNested.createNode({
        shape: 'taskNodeIn',
        // 自己设置拖拽元素的具体属性，此处不赘述
        // width: 200, // 节点的宽度
        // height: 40, // 节点的高度
        id: item.id,
        data: { ...item, taskType: type }
      })
      const dnd = new Dnd({
        getDragNode: node => node.clone({ keepId: true }),
        getDropNode: node => node.clone({ keepId: true }),
        target: that.graphInNested,
        validateNode: () => {
          // console.log('成功拖拽至目标画布')
        }
      })
      dnd.start(node, e)
    },
    deleteGraphCellInNested(cell) {
      console.log(cell)
      this.graphInNested.removeCells([cell])
    },
    modifyNested() {
      let that = this
      console.log(JSON.stringify(that.graphInNested.toJSON()))
      that.formNested.nodeTaskDtoList = []
      that.graphInNested.toJSON().cells.forEach(x => {
        if (x.shape == 'taskNodeIn') {
          that.formNested.nodeTaskDtoList.push({ taskId: x.data.realId, taskName: x.data.taskName, taskType: x.data.taskType })
        }
      })
      that.formNested.nodeTaskDtoListGraphInfo = JSON.stringify(that.graphInNested.toJSON())
      console.log(that.nestedNodeRow)
      that.nestedNodeRow.prop('data', that.formNested)
      that.dialogShowNested = false
    },
    showHistory() {
      let that = this
      that.dialogShowHistory = true
      // request({ url: '/job_info/history_version', method: 'get', params: { jobId: that.jobRow.id, jobVersion: that.jobRow.jobInfoLatestOldVersion } }).then(res => {})
    }
  }
}
</script>

<style scoped>
</style>
