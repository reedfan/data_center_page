<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain syncTasks">
    <div class="main-unit" style="width: 100%; height: 90px; position: relative; overflow: hidden">
      <div style="width: calc(100% - 48px); height: 42px; margin: 24px auto 0 auto; overflow: hidden">
        <p class="searchLabel" style="width: auto">数据去向类型:</p>
        <div style="width: 13%; height: 42px; float: left; margin: 0 1%">
          <el-select v-model="queryForm.destType" filterable placeholder="请选择" @change=";(queryForm.page = 1), getTaskData()">
            <el-option label="全部类型" :value="null"></el-option>
            <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button type="primary" icon="el-icon-search" @click="getTaskData()">查询</el-button>
        </div>
        <div style="width: auto; height: 42px; float: left; margin: 0 1%">
          <el-button icon="el-icon-plus" type="primary" @click="newTask()">新建数据导入任务</el-button>
        </div>
      </div>
    </div>
    <div style="width: calc(100% - 48px); height: calc(100% - 95px); position: relative; overflow: hidden; margin: 5px auto 0 auto">
      <div style="width: 100%; height: 100%; float: right" class="main-unit">
        <el-table v-loading="loadingTask" element-loading-text="数据加载中" class="data-table" ref="table" :data="taskData" stripe :height="this.$store.state.globalHeight - 285">
          <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
          <el-table-column prop="taskName" label="任务名称" min-width="200" align="left">
            <template slot-scope="scope">
              <div style="width: 100%; height: 100%; display: flex; align-items: center">
                <p style="max-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis" :title="scope.row.taskName">{{ scope.row.taskName }}</p>
                <i class="el-icon-document-copy" style="cursor: pointer; vertical-align: middle; margin-left: 3px" @click="copyText(scope.row.taskName)"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="taskDesc" label="任务描述" min-width="380" align="left" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="owner" label="负责人" min-width="180" align="left"> </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180" align="left"> </el-table-column>

          <el-table-column label="操作" align="center" width="340" fixed="right">
            <template slot-scope="scope">
              <p class="tableAction" @click="runTask(scope.row)">运行</p>
              <p class="tableAction" @click="getTaskRunRecord(scope.row)">运行结果</p>
              <p class="tableAction" @click="seeTask(scope.row)">修改</p>
              <p class="tableActionDanger" @click="cancelTask(scope.row)">删除</p>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pageSize.sync="queryForm.pageSize" :pageNum.sync="queryForm.page" :total="queryForm.total" :getTableData="getTaskData"> </pagination>
      </div>
    </div>

    <el-dialog :title="titleTask" :visible.sync="dialogShowTask" class="fullScreenDialog" width="100%">
      <div style="width: 100%; height: 100%; overflow: hidden; background: #e5e7ec; position: relative">
        <div style="width: 200px; height: 100%; float: left; background: #ffffff">
          <div style="height: calc(100% - 40px); width: 150px; margin: 20px 0 0 40px">
            <el-steps direction="vertical" :active="leftActive">
              <el-step title="基本信息"></el-step>
              <el-step title="数据来源与去向"></el-step>
              <el-step title="字段映射"></el-step>
              <el-step title="确定"></el-step>
            </el-steps>
          </div>
        </div>
        <div style="width: calc(100% - 205px); height: 100%; overflow: hidden auto; float: right; background: #ffffff" id="scroll-container">
          <el-form :model="formTask" ref="formTask" label-width="150px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: hidden auto; width: 98%; margin: 0 auto; padding-bottom: 60px">
            <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
              <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">1.基本信息</p>
              <div style="width: 100%; height: auto; margin: 20px auto 10px auto">
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="项目组：" :required="true" prop="projectGroupId">
                      <el-select v-model="formTask.projectGroupId" filterable placeholder="">
                        <el-option v-for="(item, index) in projectGroupList" v-bind:key="index" :label="item.projectGroupName" :value="item.projectGroupId"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="任务名称：" :required="true" prop="taskName">
                      <el-input v-model.trim="formTask.taskName" autocomplete="off"> </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="描述：" prop="description">
                      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 100 }" v-model.trim="formTask.description" autocomplete="off"> </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div style="width: 100%; height: auto; margin: 0 auto">
              <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">2.数据来源与去向</p>
              <div style="width: 96%; height: auto; overflow: hidden; margin: 0 auto">
                <div style="width: 49%; float: left; height: auto; margin: 10px auto">
                  <p style="width: 100%; height: 30px; line-height: 30px; font-size: 14px; text-align: left; color: #007aff">数据来源</p>
                  <div style="width: 100%; height: auto; border: 1px solid rgb(0, 122, 255, 0.2); box-sizing: border-box; border-radius: 4px; min-height: 100px; padding: 20px">
                    <el-row :gutter="24">
                      <el-col :span="formTask.readerParam.path ? 24 : 12">
                        <el-form-item label="上传文件：" :required="true" prop="readerParam.path">
                          <el-input v-model="formTask.readerParam.path" autocomplete="off" placeholder="" disabled @change="getColumnsDataLeft">
                            <el-upload slot="append" class="upload-demo" action="#" :http-request="upload" ref="my-upload" accept=".txt,.csv" :before-upload="beforeUpload" :limit="1">
                              <el-button type="primary" icon="el-icon-upload2">上传</el-button>
                            </el-upload>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="24" v-if="formTask.readerParam.path">
                      <el-col :span="24">
                        <el-form-item label="列分隔符：" prop="readerParam.fieldDelimiter" :required="formTask.readerParam.path != ''">
                          <el-input v-model.trim="formTask.readerParam.fieldDelimiter" autocomplete="off" placeholder="" @change="getColumnsDataLeft"> </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="24" v-if="formTask.readerParam.path">
                      <el-col :span="12">
                        <el-form-item label="编码格式：" prop="readerParam.encoding" :required="formTask.readerParam.path != ''">
                          <el-select v-model="formTask.readerParam.encoding" filterable placeholder="">
                            <el-option label="UTF-8" value="UTF-8"></el-option>
                            <el-option label="GBK" value="GBK"></el-option>
                            <el-option label="GB18030-2022" value="GB18030-2022"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="24" v-if="formTask.readerParam.path">
                      <el-col :span="24">
                        <el-form-item label="首行为标题：" prop="readerParam.skipHeader" :required="formTask.readerParam.path != ''">
                          <el-radio-group v-model="formTask.readerParam.skipHeader" @change="getColumnsDataLeft">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                          </el-radio-group>
                          <el-button style="margin-left: 20px" type="text" :disabled="!formTask.readerParam.fieldDelimiter" @click="getDetailDataLeft">数据预览</el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <div style="width: 49%; float: right; height: auto; margin-top: 10px">
                  <p style="width: 100%; height: 30px; line-height: 30px; font-size: 14px; text-align: left; color: #007aff">数据去向</p>
                  <div style="width: 100%; height: auto; border: 1px solid rgb(0, 122, 255, 0.2); box-sizing: border-box; border-radius: 4px; min-height: 100px; padding: 20px">
                    <el-row :gutter="24">
                      <el-col :span="12" :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="类型：" :required="true" prop="writerParam.type" label-width="100px">
                          <el-select v-model="formTask.writerParam.type" filterable placeholder="请选择类型" @change="typeChangeRight()">
                            <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="数据源：" :required="true" prop="writerParam.dataSourceId" label-width="100px">
                          <el-select v-model="formTask.writerParam.dataSourceId" filterable placeholder="请选择数据源" @change="dataSourceChangeRight()">
                            <el-option v-for="(item, index) in dataSourceListRight" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="24">
                      <el-col :span="12" :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="库选择：" :required="true" prop="writerParam.dbName" label-width="100px">
                          <el-select v-model="formTask.writerParam.dbName" filterable placeholder="请选择库" allow-create>
                            <el-option v-for="(item, index) in dbNameListRight" v-bind:key="index" :label="item.dbName" :value="item.dbName"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="formTask.writerParam.type != 'MongoDB'" :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="表选择：" :required="true" prop="writerParam.tableName" label-width="100px">
                          <el-select v-model="formTask.writerParam.tableName" filterable placeholder="请选择表" @change="tableNameChangeRight()">
                            <el-option v-for="(item, index) in tableNameListRight" v-bind:key="index" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="formTask.writerParam.type == 'MongoDB'" :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="表选择：" :required="true" prop="writerParam.tableName" label-width="100px">
                          <el-input v-model.trim="formTask.writerParam.tableName" autocomplete="off" placeholder="请输入表" @change="tableNameChangeRight()"> </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="24" v-if="formTask.writerParam.type && formTask.writerParam.type != 'Hive' && formTask.writerParam.type != 'MongoDB'">
                      <el-col :span="24">
                        <el-form-item label="preSql：" prop="writerParam.preSql">
                          <template slot="label">
                            preSql：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">导入数据前执行的SQL语句，例如清除旧数据；目前向导模式最多允许执行五条SQL语句，多条SQL语句使用分号(;)分隔</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model="formTask.writerParam.preSql" autocomplete="off" placeholder=""> </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="postSql：" prop="writerParam.postSql">
                          <template slot="label">
                            postSql：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">导入数据后执行的SQL语句，例如加上某一个时间戳；多条SQL语句使用分号(;)分隔</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model="formTask.writerParam.postSql" autocomplete="off" placeholder=""> </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="24" v-if="formTask.writerParam.type && formTask.writerParam.type == 'Hive'">
                      <el-col :span="24" v-if="partitionInfoListRight.length > 0">
                        <el-form-item label="分区：" prop="writerParam.partitionInfoStr">
                          <template slot="label">
                            分区：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">1）动态分区的值可以为来源字段的值或来源数据库的系统函数。 2）分区方式为根据字段内容动态分区时，支持选择来源表字段，会将源端对应字段所在数据行写入到表对应的分区中。示例：选择来源表字段为A，当A字段值为aa时，会将数据写入到对应的aa分区中，当A字段值为bb时，会将数据写入到对应的bb分区中。</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-row v-for="(item, index) in formTask.writerParam.partitionInfoParamList" style="margin-bottom: 5px; text-align: right" :key="index">
                            <el-input style="width: 99%; margin-left: 0.5%" v-model="item.partitionInfoStr" autocomplete="off" placeholder="" disabled>
                              <template slot="prepend">{{ item.partitionFieldName }}</template>
                              <template slot="append">
                                <el-button @click="showPartitionRight(index)">编 辑</el-button>
                              </template>
                            </el-input>
                          </el-row>
                          <el-button type="primary" style="float: right" @click="formTask.writerParam.partitionInfoParamList.push({ partitionFieldName: '', partitionInfoStr: '', sort: formTask.writerParam.partitionInfoParamList.length + 1, type: '' })" size="small">添加分区</el-button>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="defaultFS：" :required="formTask.writerParam.type == 'Hive'" prop="writerParam.defaultFS">
                          <template slot="label">
                            defaultFS:
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">Hadoop hdfs文件系统namenode节点地址。格式：hdfs://ip:端口；例如：hdfs://127.0.0.1:9000</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-input v-model.trim="formTask.writerParam.defaultFS" autocomplete="off" placeholder=""> </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="fileType：" :required="formTask.writerParam.type == 'Hive'" prop="writerParam.fileType">
                          <template slot="label">
                            fileType：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">文件的类型，目前只支持用户配置为text或orc。</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-select v-model="formTask.writerParam.fileType" filterable placeholder="">
                            <el-option label="text" value="text"></el-option>
                            <el-option label="orc" value="orc"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="path：" :required="formTask.writerParam.type == 'Hive'" prop="writerParam.path">
                          <template slot="label">
                            path：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">存储到Hadoop hdfs文件系统的路径信息</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-input v-model.trim="formTask.writerParam.path" autocomplete="off" placeholder=""> </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="fileName：" :required="formTask.writerParam.type == 'Hive'" prop="writerParam.fileName">
                          <template slot="label">
                            fileName：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">fileName</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-input v-model.trim="formTask.writerParam.fileName" autocomplete="off" placeholder=""> </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="writeMode：" :required="formTask.writerParam.type == 'Hive'" prop="writerParam.writeMode">
                          <template slot="label">
                            writeMode：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">hdfswriter写入前数据清理处理模式： append，写入前不做任何处理，DataX hdfswriter直接使用filename写入，并保证文件名不冲突。 nonConflict，如果目录下有fileName前缀的文件，直接报错。 truncate，如果目录下有fileName前缀的文件，先删除后写入。</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-select v-model="formTask.writerParam.writeMode" filterable placeholder="">
                            <el-option label="append" value="append"></el-option>
                            <el-option label="nonConflict" value="nonConflict"></el-option>
                            <el-option label=" truncate" value=" truncate"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="fieldDelimiter：" prop="writerParam.fieldDelimiter">
                          <template slot="label">
                            fieldDelimiter：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">hdfswriter写入时的字段分隔符,需要用户保证与创建的Hive表的字段分隔符一致，否则无法在Hive表中查到数据</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-input v-model.trim="formTask.writerParam.fieldDelimiter" autocomplete="off" placeholder=""> </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
            <div style="width: 100%; height: auto; margin: 0 auto">
              <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">3.字段映射</p>
              <div style="width: 100%; height: auto; min-height: 300px">
                <div style="text-align: left; margin: 10px auto 0 auto; width: 98%; height: 30px">
                  <!-- <el-radio-group v-model="generateType" size="small" @change="generateFieldParamList()">
                    <el-radio-button label="name">同名映射</el-radio-button>
                    <el-radio-button label="line">同行映射</el-radio-button>
                  </el-radio-group> -->
                  <el-button type="text" @click=";(generateType = 'name'), generateFieldParamList()">同名映射</el-button>
                  <el-button type="text" @click=";(generateType = 'line'), generateFieldParamList()">同行映射</el-button>
                </div>
                <el-table v-loading="fieldParamListLoading" element-loading-text="数据加载中" empty-text="选择数据来源与去向后，显示字段映射" style="width: 98%; margin: 5px auto" class="data-table" ref="fieldParamList" :data="formTask.fieldParamList" border stripe>
                  <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
                  <el-table-column align="center" min-width="200" label="来源">
                    <el-table-column prop="sourceName" label="来源表字段 " min-width="100" align="left">
                      <template slot-scope="scope">
                        <el-row>
                          <el-col :span="7">
                            <el-select v-model="scope.row.sourceFlag" filterable placeholder="请选择" @change="sourceFlagChange(scope.row)">
                              <el-option label="字段" value="field"></el-option>
                              <el-option label="固定值" value="fixed"></el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="16" :offset="1">
                            <el-select v-model="scope.row.sourceName" filterable placeholder="请选择" @change="sourceNameChange(scope.row)" v-show="scope.row.sourceFlag == 'field'">
                              <el-option v-for="(item, index) in columnsDataLeft" v-bind:key="index" :label="item.columnName" :value="item.columnName"></el-option>
                            </el-select>
                            <el-input v-model.trim="scope.row.sourceValue" autocomplete="off" placeholder="" v-show="scope.row.sourceFlag == 'fixed'"> </el-input>
                          </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sourceType" label="字段类型" min-width="100" align="left">
                      <template slot-scope="scope" v-if="scope.row.sourceFlag == 'field' && scope.row.sourceName">
                        <el-row style="width: 100%; line-height: 42px" :gutter="10">
                          <el-col :span="scope.row.sourceType == 'date' ? 10 : 24">
                            <el-select v-model="scope.row.sourceType" filterable placeholder="请选择" @change="sourceTypeChange(scope.row)">
                              <el-option label="string" value="string"></el-option>
                              <el-option label="long" value="long"></el-option>
                              <el-option label="boolean" value="boolean"></el-option>
                              <el-option label="double" value="double"></el-option>
                              <el-option label="date" value="date"></el-option> </el-select
                          ></el-col>
                          <el-col :span="14" v-if="scope.row.sourceType == 'date'"
                            ><el-input v-model="scope.row.format" autocomplete="off" placeholder="日期格式"> <template slot="prepend">日期格式</template></el-input></el-col
                          >
                        </el-row>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column prop="sourceComment" label="字段描述" min-width="50" align="left"> </el-table-column> -->
                  </el-table-column>
                  <el-table-column align="center" min-width="150" label="去向">
                    <el-table-column prop="destName" label="去向表字段 " min-width="50" align="left"> </el-table-column>
                    <el-table-column prop="destType" label="字段类型" min-width="50" align="left">
                      <template slot-scope="scope">
                        <el-select v-if="formTask.writerParam.type == 'MongoDB'" v-model="scope.row.destType" filterable placeholder="请选择">
                          <el-option label="Long" value="Long"></el-option>
                          <el-option label="String" value="String"></el-option>
                        </el-select>
                        <template v-else>{{ scope.row.destType }}</template>
                      </template>
                    </el-table-column>
                    <el-table-column prop="destComment" label="字段描述" min-width="50" align="left"> </el-table-column>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="120">
                    <template slot-scope="scope">
                      <p class="tableActionDanger" :class="formTask.fieldParamList.length == '1' ? 'disabledTableActionDanger' : ''" @click="formTask.fieldParamList.length == '1' ? '' : formTask.fieldParamList.splice(scope.$index, 1)">删除</p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-form>
        </div>
        <div style="width: calc(100% - 205px); height: 60px; position: absolute; right: 0; bottom: 0; z-index: 10; border-top: 1px solid #e5e7ec; background: #ffffff">
          <div style="width: auto; height: 40px; float: right; margin: 10px 2%">
            <el-button type="primary" style="width: 120px" v-if="addOrModifyTask" :disabled="buttonLoad" :loading="buttonLoad" @click="addTask()">保存</el-button>
            <el-button type="primary" style="width: 120px" v-if="!addOrModifyTask" :disabled="buttonLoad" :loading="buttonLoad" @click="updateTask()">修改</el-button>
          </div>
          <div style="width: auto; height: 40px; float: right; margin: 10px">
            <el-button style="width: 120px" @click="dialogShowTask = false">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="运行结果" :visible.sync="dialogShowRunRecord" width="1200px">
      <el-table v-loading="loadingRunRecord" element-loading-text="数据加载中" style="margin: 10px auto" class="data-table" ref="tableRunRecord" :data="tableRunRecord" border stripe height="600">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <!-- <el-table-column prop="jobName" label="任务名称" align="left" min-width="180">
          <template slot-scope="scope">
            <div style="width: 100%; height: 100%; display: flex; align-items: center">
              <p style="max-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis" :title="scope.row.jobName">{{ scope.row.jobName }}</p>
              <i class="el-icon-document-copy" style="cursor: pointer; vertical-align: middle; margin-left: 3px" title="复制jobKey" @click="copyText(scope.row.jobKey)"></i>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="createTime" label="运行时间" min-width="180" align="center"> </el-table-column>
        <el-table-column prop="timeCost" label="所用时间" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="jobStatus" label="状态" align="center" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.jobStatus == '成功'" style="color: #67c23a">成功</span>
            <span v-else-if="scope.row.jobStatus == '失败'" style="color: #f56c6c">失败</span>
            <span v-else-if="scope.row.jobStatus == '部分成功'" style="color: #409eff">部分成功</span>
            <span v-else>{{ scope.row.jobStatus }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" min-width="210" label="读取">
          <el-table-column prop="readSucceedRecords" label="成功" min-width="70" align="center">
            <template slot-scope="scope">
              <span style="color: #67c23a">{{ scope.row.readSucceedRecords }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="readFaildRecords" label="失败" min-width="70" align="center">
            <template slot-scope="scope">
              <span style="color: #f56c6c">{{ scope.row.readFaildRecords }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalReadRecords" label="总计" min-width="70" align="center"> </el-table-column>
        </el-table-column>
        <el-table-column align="center" min-width="210" label="覆写">
          <el-table-column prop="writeSucceedRecords" label="成功 " min-width="70" align="center">
            <template slot-scope="scope">
              <span style="color: #67c23a">{{ scope.row.writeSucceedRecords }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="writeFailedRecords" label="失败" min-width="70" align="center">
            <template slot-scope="scope">
              <span style="color: #f56c6c">{{ scope.row.writeFailedRecords }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="writeReceivedRecords" label="总计" min-width="70" align="center"> </el-table-column>
        </el-table-column> -->
        <el-table-column prop="totalReadRecords" label="读取总条数" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="readFaildRecords" label="读取失败条数" min-width="120" align="center"> </el-table-column>
        <el-table-column prop="writeFailedRecords" label="写入失败的条数" min-width="120" align="center"> </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="编辑分区" :visible.sync="dialogShowEditPartitionRight" width="500px">
      <el-form :model="formPartitionRight" ref="formPartitionRight" :rules="rules" label-width="120px" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: auto; margin-top: 20px; padding: 0 50px 0 30px">
        <el-form-item label="分区名称：" prop="partitionFieldName" :required="true">
          <el-select v-model="formPartitionRight.partitionFieldName" placeholder="" @change="partitionFieldNameChangeRight">
            <el-option v-for="(item, index) in partitionInfoListRight" :label="item.columnName" :value="item.columnName" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型：" prop="type" :required="true">
          <el-input v-model="formPartitionRight.type" placeholder="" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort" :required="true">
          <el-input-number style="width: 100%" v-model="formPartitionRight.sort" placeholder="" autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="变量类型：" prop="dynamicsOrStatic">
          <el-switch v-model="formPartitionRight.dynamicsOrStatic" inactive-color="#13ce66" active-text="动态变量" inactive-text="静态变量"> </el-switch>
        </el-form-item>
        <el-form-item label="静态变量：" :required="!formPartitionRight.dynamicsOrStatic" prop="staticStr" v-show="!formPartitionRight.dynamicsOrStatic">
          <el-input v-model="formPartitionRight.staticStr" placeholder="" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="动态变量：" :required="formPartitionRight.dynamicsOrStatic" prop="dynamicsStr1" v-show="formPartitionRight.dynamicsOrStatic">
          <el-input placeholder="" v-model="formPartitionRight.dynamicsStr1" oninput="value=value.replace(/[^\d]/g,'')">
            <template slot="append">.days.ago</template>
          </el-input>
          <!-- <el-select v-model="formPartitionRight.dynamicsStr1" filterable placeholder="" clearable="">
            <el-option value="$start$1_days_before_" label="1.days.ago"></el-option>
            <el-option value="$start$2_days_before_" label="2.days.ago"></el-option>
            <el-option value="$start$3_days_before_" label="3.days.ago"></el-option>
            <el-option value="$start$5_days_before_" label="5.days.ago"></el-option>
            <el-option value="$start$7_days_before_" label="7.days.ago"></el-option>
            <el-option value="$start$10_days_before_" label="10.days.ago"></el-option>
            <el-option value="$start$30_days_before_" label="30.days.ago"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="时间格式：" :required="formPartitionRight.dynamicsOrStatic" prop="dynamicsStr2" v-show="formPartitionRight.dynamicsOrStatic">
          <el-select v-model="formPartitionRight.dynamicsStr2" filterable placeholder="" clearable="">
            <el-option value="yyyyMMdd$end$" label="yyyyMMdd"></el-option>
            <el-option value="yyyy-MM-dd$end$" label="yyyy-MM-dd"></el-option>
            <el-option value="yyyy:MM:dd$end$" label="yyyy:MM:dd"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowEditPartitionRight = false" style="width: 120px">取 消</el-button>
        <el-button type="danger" @click="formTask.writerParam.partitionInfoParamList.splice(formPartitionRightIndex, 1), (dialogShowEditPartitionRight = false)" style="width: 120px">删 除</el-button>
        <el-button type="primary" @click="editPartitionRight" style="width: 120px">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 数据预览 -->
    <el-dialog title="数据预览" :visible.sync="dialogShowDataLeft" width="1200px">
      <div style="width: 100%; height: auto; padding: 20px 0">
        <el-table element-loading-text="数据加载中" class="data-table" ref="tableDataLeft" :data="detailDataLeft" border stripe height="500">
          <el-table-column :prop="item" :label="item" min-width="100" align="center" v-for="(item, index) in titleDataLeft" :key="index"> </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/subUnit/Pagination/index'
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
// import uploadRequest from '@/api/uploadRequest'
export default {
  name: 'syncTasks',
  components: {
    pagination
  },
  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      queryForm: {
        sourceType: 'TxtFile',
        destType: null,
        pageSize: 10,
        page: 1,
        total: 0
      },
      taskData: [],
      loadingTask: true,

      buttonLoad: false,

      projectGroupList: [],
      dataTypeList: [],
      columnsDataLeft: [],
      dataSourceListRight: [],
      dbNameListRight: [],
      tableNameListRight: [],
      columnsDataRight: [],
      partitionInfoListRight: [],
      dialogShowTask: false,
      addOrModifyTask: true,
      titleTask: '',
      leftActive: 1,
      formTask: {
        taskName: '',
        description: '',
        readerParam: {
          type: 'TxtFile',
          dataSourceId: '',
          dbName: '',
          tableName: '',
          fieldDelimiter: ',',
          defaultFS: '',
          fileType: '',
          path: '',
          encoding: 'UTF-8',
          skipHeader: true
        },
        writerParam: {
          type: '',
          dataSourceId: '',
          dbName: '',
          tableName: '',
          preSql: '',
          postSql: '',
          writeMode: '',
          fieldDelimiter: '',
          efaultFS: '',
          fileType: '',
          fileName: '',
          path: '',
          partitionFieldName: '',
          partitionInfoStr: '',
          partitionInfoParamList: []
        },
        fieldParamList: []
      },
      generateType: 'name',
      fieldParamListLoading: false,

      dialogShowEditPartitionRight: false,
      formPartitionRightIndex: 0,
      formPartitionRight: {
        partitionFieldName: '',
        sort: '',
        type: '',
        dynamicsOrStatic: true,
        dynamicsStr1: '',
        dynamicsStr2: '',
        staticStr: ''
      },

      dialogShowRunRecord: false,
      tableRunRecord: [],
      loadingRunRecord: false,

      dialogShowDataLeft: false,
      detailDataLeft: [],
      titleDataLeft: []
    }
  },
  mounted() {
    this.getDataTypeList()
    this.getProjectGroupList()
    this.getTaskData()
    window.onresize = () => {
      return (() => {
        this.$store.state.globalHeight = document.documentElement.clientHeight
        setTimeout(() => {
          this.$refs.table.doLayout()
        }, 300)
      })()
    }
  },
  methods: {
    // 获取数据源类型list
    getDataTypeList() {
      let that = this
      request({ url: '/data_source/type/list', method: 'get', params: {} }).then(res => {
        that.dataTypeList = res.data
      })
    },
    // 获取项目组list
    getProjectGroupList() {
      let that = this
      request({ url: '/project_group_permission/user_info_id', method: 'get', params: { userInfoId: that.$store.state.userInfo.id } }).then(res => {
        that.projectGroupList = res.data
      })
    },
    // 获取数据源数据
    getTaskData() {
      let that = this
      that.loadingTask = true
      request({ url: '/task_info/list', method: 'get', params: { sourceType: that.queryForm.sourceType, destType: that.queryForm.destType, page: that.queryForm.page, pageSize: that.queryForm.pageSize } }).then(res => {
        that.taskData = res.data.list || []
        that.queryForm.total = res.data.total || 0
        that.loadingTask = false
        setTimeout(() => {
          that.$refs.table.doLayout()
        }, 300)
      })
    },
    // 新建任务-打开任务新建表单
    newTask() {
      let that = this
      that.titleTask = '新建任务'
      that.leftActive = 1
      that.dialogShowTask = true
      that.columnsDataLeft = []
      that.dataSourceListRight = []
      that.dbNameListRight = []
      that.tableNameListRight = []
      that.columnsDataRight = []
      that.partitionInfoListRight = []
      resetForm('formTask', that)
      that.formTask = {
        taskName: '',
        description: '',
        readerParam: {
          type: 'TxtFile',
          dataSourceId: '',
          dbName: '',
          tableName: '',
          fieldDelimiter: ',',
          defaultFS: '',
          fileType: '',
          path: '',
          encoding: 'UTF-8',
          skipHeader: true
        },
        writerParam: {
          type: '',
          dataSourceId: '',
          dbName: '',
          tableName: '',
          preSql: '',
          postSql: '',
          writeMode: '',
          fieldDelimiter: '',
          efaultFS: '',
          fileType: '',
          fileName: '',
          path: '',
          partitionFieldName: '',
          partitionInfoStr: '',
          partitionInfoParamList: []
        },
        fieldParamList: []
      }
      that.$nextTick(() => {
        that.addScrollListener()
        setTimeout(() => {
          that.$refs.fieldParamList.doLayout()
        }, 300)
      })
    },
    upload(options) {
      let file = options.file
      const formData = new FormData()
      formData.append('file', file)
      request({
        url: '/file/upload',
        method: 'post',
        data: formData
      })
        .then(res => {
          if (res.code == 200) {
            Notify('success', '上传成功')
            this.formTask.readerParam.path = res.data
            this.$refs['my-upload'].clearFiles()
            this.getColumnsDataLeft()
          } else {
            Notify('error', '上传失败')
          }
        })
        .catch(() => {
          this.$refs['my-upload'].clearFiles()
        })
      return false
    },
    beforeUpload(file) {
      let isLt200M = file.size / 1024 / 1024 < 200
      if (!isLt200M) {
        Notify('error', '[' + file.name + '] 大小超过200MB ')
      }
      return isLt200M
    },
    // 获取数据预览
    getDetailDataLeft() {
      let that = this
      that.detailDataLeft = []
      that.titleDataLeft = []
      request({ url: '/file/read_lines', method: 'get', params: { path: that.formTask.readerParam.path, fieldDelimiter: that.formTask.readerParam.fieldDelimiter, lineNumber: 50 } }).then(res => {
        if (that.formTask.readerParam.skipHeader) {
          that.titleDataLeft = res.data[0]
          res.data.forEach((item1, index1) => {
            if (index1 > 0) {
              let temp = {}
              res.data[0].forEach((item2, index2) => {
                temp[item2] = item1[index2]
              })
              that.detailDataLeft.push(temp)
            }
          })
          that.dialogShowDataLeft = true
          setTimeout(() => {
            that.$refs.tableDataLeft.doLayout()
          }, 300)
        } else {
          res.data[0].forEach((item, index) => {
            that.titleDataLeft.push('column' + (index + 1))
          })
          res.data.forEach((item1, index1) => {
            let temp = {}
            that.titleDataLeft.forEach((item2, index2) => {
              temp[item2] = item1[index2]
            })
            that.detailDataLeft.push(temp)
          })
          that.dialogShowDataLeft = true
          setTimeout(() => {
            that.$refs.tableDataLeft.doLayout()
          }, 300)
        }
      })
    },
    // 获取左侧表头
    getColumnsDataLeft() {
      let that = this
      that.columnsDataLeft = []
      request({ url: '/file/read_first_line', method: 'get', params: { path: that.formTask.readerParam.path, fieldDelimiter: that.formTask.readerParam.fieldDelimiter } }).then(res => {
        if (that.formTask.readerParam.skipHeader) {
          res.data.forEach((item, index) => {
            that.columnsDataLeft.push({ columnName: item, columnComment: '-', columnType: 'string', columnIndex: index, format: '' })
          })
        } else {
          res.data.forEach((item, index) => {
            that.columnsDataLeft.push({ columnName: 'column' + (index + 1), columnComment: '-', columnType: 'string', columnIndex: index, format: '' })
          })
        }
        that.generateFieldParamList()
      })
    },
    // 右侧数据源类型change
    typeChangeRight() {
      let that = this
      that.dataSourceListRight = []
      that.dbNameListRight = []
      that.tableNameListRight = []
      that.formTask.writerParam.dataSourceId = ''
      that.formTask.writerParam.dbName = ''
      that.formTask.writerParam.tableName = ''
      that.formTask.writerParam.preSql = ''
      that.formTask.writerParam.postSql = ''
      that.formTask.writerParam.writeMode = ''
      that.formTask.writerParam.fieldDelimiter = ''
      that.formTask.writerParam.defaultFS = ''
      that.formTask.writerParam.fileType = ''
      that.formTask.writerParam.fileName = ''
      that.formTask.writerParam.path = ''

      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.formTask.writerParam.type, page: 1, pageSize: 1000 } }).then(res => {
        that.dataSourceListRight = res.data.list || []
      })
    },
    // 右侧数据源change
    dataSourceChangeRight() {
      let that = this
      that.dbNameListRight = that.dataSourceListRight.filter(s => {
        return s.id == that.formTask.writerParam.dataSourceId
      })
      that.tableNameListRight = []
      that.formTask.writerParam.dbName = that.dbNameListRight[0].dbName
      that.formTask.writerParam.tableName = ''
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formTask.writerParam.dataSourceId } }).then(res => {
        that.tableNameListRight = res.data
      })
    },
    // 右侧表change
    tableNameChangeRight() {
      let that = this
      that.columnsDataRight = []

      if (that.formTask.writerParam.type == 'Hive') {
        that.formTask.writerParam.fieldDelimiter = ''
        that.formTask.writerParam.path = ''
        that.formTask.writerParam.fileType = ''
        that.formTask.writerParam.defaultFS = ''
        that.formTask.writerParam.fileName = that.formTask.writerParam.tableName
        that.formTask.writerParam.writeMode = 'append'
        that.formTask.writerParam.partitionInfoParamList = []
        request({ url: '/data_source/hive/origin_info', method: 'get', params: { id: that.formTask.writerParam.dataSourceId, table: that.formTask.writerParam.tableName } }).then(res2 => {
          that.formTask.writerParam.fileType = res2.data.outputFormat || ''
          that.formTask.writerParam.fieldDelimiter = res2.data.fieldDelim || ''
          that.formTask.writerParam.path = res2.data.location || ''
          that.formTask.writerParam.defaultFS = res2.data.defaultFS || ''
        })
        request({ url: '/data_source/hive/column_and_partition', method: 'get', params: { id: that.formTask.writerParam.dataSourceId, table: that.formTask.writerParam.tableName } }).then(res => {
          that.columnsDataRight = res.data.columnEntityList || []
          that.partitionInfoListRight = res.data.partitionInfoList || []
          if (that.partitionInfoListRight.length > 0) {
            that.formTask.writerParam.partitionFieldName = that.partitionInfoListRight[0].columnName
          }
          that.formTask.writerParam.partitionInfoStr = ''
          that.generateFieldParamList()
        })
      } else {
        request({ url: '/data_source/columns', method: 'get', params: { id: that.formTask.writerParam.dataSourceId, table: that.formTask.writerParam.tableName } }).then(res => {
          that.columnsDataRight = res.data || []
          if (that.formTask.writerParam.type == 'Oracle') {
            that.columnsDataRight.forEach((item, index) => {
              item.columnName = `"${item.columnName}"`
            })
          }
          that.generateFieldParamList()
        })
      }
    },
    // 左侧右侧表名确定生成字段映射
    generateFieldParamList() {
      let that = this
      that.formTask.fieldParamList = []
      that.fieldParamListLoading = true
      if (that.columnsDataLeft.length > 0 && that.columnsDataRight.length > 0) {
        if (that.generateType == 'name') {
          that.columnsDataRight.forEach((item, index) => {
            let temp = that.columnsDataLeft.filter(s => {
              return s.columnName.toLowerCase() == item.columnName.toLowerCase()
            })
            if (temp[0]) {
              that.formTask.fieldParamList.push({ sourceFlag: 'field', sourceValue: null, destComment: item.columnComment || null, destName: item.columnName || null, destType: item.columnType || null, destIndex: item.columnIndex || 0, sourceComment: temp[0].columnComment || null, sourceName: temp[0].columnName || null, sourceType: temp[0].columnType || null, sourceIndex: temp[0].columnIndex || 0, format: '' })
            } else {
              that.formTask.fieldParamList.push({ sourceFlag: 'field', sourceValue: null, destComment: item.columnComment || null, destName: item.columnName || null, destType: item.columnType || null, destIndex: item.columnIndex || 0, sourceComment: null, sourceName: null, sourceType: null, sourceIndex: 0, format: '' })
            }
          })
        }
        if (that.generateType == 'line') {
          that.columnsDataRight.forEach((item, index) => {
            if (that.columnsDataLeft[index]) {
              that.formTask.fieldParamList.push({ sourceFlag: 'field', sourceValue: null, destComment: item.columnComment || null, destName: item.columnName || null, destType: item.columnType || null, destIndex: item.columnIndex || 0, sourceComment: that.columnsDataLeft[index].columnComment || null, sourceName: that.columnsDataLeft[index].columnName || null, sourceType: that.columnsDataLeft[index].columnType || null, sourceIndex: that.columnsDataLeft[index].columnIndex || 0, format: '' })
            } else {
              that.formTask.fieldParamList.push({ sourceFlag: 'field', sourceValue: null, destComment: item.columnComment || null, destName: item.columnName || null, destType: item.columnType || null, destIndex: item.columnIndex || 0, sourceComment: null, sourceName: null, sourceType: null, sourceIndex: 0, format: '' })
            }
          })
        }
      }
      console.log(that.formTask.fieldParamList)
      that.fieldParamListLoading = false
      setTimeout(() => {
        that.$refs.fieldParamList.doLayout()
      }, 300)
    },
    // 字段映射sourceFlag改变
    sourceFlagChange(row) {
      if (row.sourceFlag == 'field') {
        let temp = this.columnsDataLeft.filter(s => {
          return s.columnName == row.sourceName
        })
        row.sourceType = temp[0].columnType
        row.sourceComment = temp[0].columnComment
        row.sourceIndex = temp[0].columnIndex
      }
      if (row.sourceFlag == 'fixed') {
        row.sourceType = ''
        row.sourceComment = ''
        row.sourceIndex = ''
      }
    },
    // 字段映射sourceName改变
    sourceNameChange(row) {
      let that = this
      let temp = that.columnsDataLeft.filter(s => {
        return s.columnName == row.sourceName
      })
      row.sourceType = temp[0].columnType
      row.sourceComment = temp[0].columnComment
      row.sourceIndex = temp[0].columnIndex
    },
    // 字段映射sourceType改变
    sourceTypeChange(row) {
      if (row.sourceType == 'date') {
        row.format = 'yyyy.MM.dd'
      } else {
        row.format = ''
      }
    },
    // 数据去向Hive 分区编辑
    showPartitionRight(index) {
      this.dialogShowEditPartitionRight = true
      this.formPartitionRightIndex = index
      resetForm('formPartitionRight', this)
      this.formPartitionRight = {
        partitionFieldName: this.formTask.writerParam.partitionInfoParamList[index].partitionFieldName,
        sort: this.formTask.writerParam.partitionInfoParamList[index].sort,
        type: this.formTask.writerParam.partitionInfoParamList[index].type,
        dynamicsOrStatic: true,
        dynamicsStr: '',
        staticStr1: '',
        staticStr2: ''
      }
    },
    partitionFieldNameChangeRight() {
      this.formPartitionRight.type = this.partitionInfoListRight.filter(s => {
        return s.columnName == this.formPartitionRight.partitionFieldName
      })[0].columnType
    },
    editPartitionRight() {
      this.$refs['formPartitionRight'].validate(valid => {
        if (valid) {
          if (this.formPartitionRight.dynamicsOrStatic) {
            this.formTask.writerParam.partitionInfoParamList[this.formPartitionRightIndex].partitionInfoStr = '$start$' + this.formPartitionRight.dynamicsStr1 + '_days_before_' + this.formPartitionRight.dynamicsStr2
            // this.formTask.writerParam.partitionInfoStr = this.partitionInfoListRight[0].columnName + '=$start$' + this.formPartitionRight.dynamicsStr1 + '_days_before_' + this.formPartitionRight.dynamicsStr2
          } else {
            this.formTask.writerParam.partitionInfoParamList[this.formPartitionRightIndex].partitionInfoStr = this.formPartitionRight.staticStr
          }
          this.formTask.writerParam.partitionInfoParamList[this.formPartitionRightIndex].partitionFieldName = this.formPartitionRight.partitionFieldName
          this.formTask.writerParam.partitionInfoParamList[this.formPartitionRightIndex].type = this.formPartitionRight.type
          this.formTask.writerParam.partitionInfoParamList[this.formPartitionRightIndex].sort = this.formPartitionRight.sort
          this.dialogShowEditPartitionRight = false
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    // 保存任务
    addTask() {
      let that = this
      that.$refs['formTask'].validate(valid => {
        if (valid) {
          let tempCount = 0
          that.formTask.fieldParamList.forEach((item, index) => {
            if (item.sourceFlag == 'field') {
              if (item.sourceName) {
                tempCount += 1
              }
              item.sourceValue = null
            }
            if (item.sourceFlag == 'fixed') {
              if (item.sourceValue) {
                tempCount += 1
              }
              item.sourceName = null
            }
          })
          if (tempCount > 0) {
            let params = that.formTask
            params.id = null
            params.updateRequest = false
            that.buttonLoad = true
            request({ url: '/data_sync/add', method: 'post', data: params })
              .then(res => {
                res.code == 200 && Notify('success', res.message || '处理成功')
                setTimeout(() => {
                  that.buttonLoad = false
                }, 300)
                if (res.code == '200') {
                  that.dialogShowTask = false
                  that.getTaskData()
                }
              })
              .catch(() => {
                setTimeout(() => {
                  that.buttonLoad = false
                }, 300)
              })
          } else {
            Notify('error', '请至少选择一行映射！')
          }
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    // 查看任务
    seeTask(row) {
      let that = this
      request({ url: '/task_info/get_by_id', method: 'get', params: { id: row.id } }).then(res => {
        if (res.code == 200) {
          that.titleTask = '修改任务[' + row.taskName + ']'
          that.leftActive = 1
          that.dialogShowTask = true
          that.addOrModifyTask = false
          that.dataSourceListRight = []
          that.dbNameListRight = []
          that.tableNameListRight = []
          that.columnsDataRight = []
          resetForm('formTask', that)
          let temp = { ...JSON.parse(res.data.taskOriginalData) }
          console.log(temp.fieldParamList)
          temp.fieldParamList.forEach((item, index) => {
            if (item.sourceName && !item.sourceValue) {
              item.sourceFlag = 'field'
            }
            if (!item.sourceName && item.sourceValue) {
              item.sourceFlag = 'fixed'
            }
          })
          that.formTask = { ...temp }
          that.formTask.id = res.data.id
          that.columnsDataLeft = []
          request({ url: '/file/read_first_line', method: 'get', params: { path: that.formTask.readerParam.path, fieldDelimiter: that.formTask.readerParam.fieldDelimiter } }).then(res2 => {
            if (that.formTask.readerParam.skipHeader) {
              res2.data.forEach((item, index) => {
                that.columnsDataLeft.push({ columnName: item, columnComment: '-', columnType: 'string', columnIndex: index, format: '' })
              })
            } else {
              res2.data.forEach((item, index) => {
                that.columnsDataLeft.push({ columnName: 'column' + (index + 1), columnComment: '-', columnType: 'string', columnIndex: index, format: '' })
              })
            }
          })
          request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.formTask.writerParam.type, page: 1, pageSize: 1000 } }).then(res2 => {
            that.dataSourceListRight = res2.data.list || []
            that.dbNameListRight = that.dataSourceListRight.filter(s => {
              return s.id == that.formTask.writerParam.dataSourceId
            })
            request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formTask.writerParam.dataSourceId } }).then(res3 => {
              that.tableNameListRight = res3.data
              if (that.formTask.writerParam.type == 'Hive') {
                request({ url: '/data_source/hive/column_and_partition', method: 'get', params: { id: that.formTask.writerParam.dataSourceId, table: that.formTask.writerParam.tableName } }).then(res4 => {
                  that.columnsDataRight = res4.data.columnEntityList || []
                  that.partitionInfoListRight = res4.data.partitionInfoList || []
                })
              } else {
                request({ url: '/data_source/columns', method: 'get', params: { id: that.formTask.writerParam.dataSourceId, table: that.formTask.writerParam.tableName } }).then(res4 => {
                  that.columnsDataRight = res4.data || []
                  if (that.formTask.writerParam.type == 'Oracle') {
                    that.columnsDataRight.forEach((item, index) => {
                      item.columnName = `"${item.columnName}"`
                    })
                  }
                })
              }
            })
          })
          that.$nextTick(() => {
            that.addScrollListener()
            setTimeout(() => {
              that.$refs.fieldParamList.doLayout()
            }, 300)
          })
        }
      })
    },
    // 修改任务
    updateTask() {
      let that = this
      that.$refs['formTask'].validate(valid => {
        if (valid) {
          let tempCount = 0
          that.formTask.fieldParamList.forEach((item, index) => {
            if (item.sourceFlag == 'field') {
              if (item.sourceName) {
                tempCount += 1
              }
              item.sourceValue = null
            }
            if (item.sourceFlag == 'fixed') {
              if (item.sourceValue) {
                tempCount += 1
              }
              item.sourceName = null
            }
          })
          if (tempCount > 0) {
            let params = that.formTask
            params.updateRequest = true
            that.buttonLoad = true
            request({ url: '/data_sync/add', method: 'post', data: params })
              .then(res => {
                res.code == 200 && Notify('success', res.message || '处理成功')
                setTimeout(() => {
                  that.buttonLoad = false
                }, 300)
                if (res.code == '200') {
                  that.dialogShowTask = false
                  that.getTaskData()
                }
              })
              .catch(() => {
                setTimeout(() => {
                  that.buttonLoad = false
                }, 300)
              })
          } else {
            Notify('error', '请至少选择一行映射！')
          }
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    // 运行传输任务
    runTask(row) {
      let that = this
      this.$confirm('是否确定运行[' + row.taskName + ']数据导入任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request({ url: '/task_info/sync_test', method: 'get', params: { taskInfoId: row.id } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理中'), that.getTaskData())
          })
        })
        .catch(() => {})
    },
    // 获取运行结果
    getTaskRunRecord(row) {
      let that = this
      that.dialogShowRunRecord = true
      that.loadingRunRecord = true
      that.$nextTick(() => {
        request({ url: '/task_run_record/list', method: 'post', data: { taskId: row.id, jobId: null, jobKey: null, jobName: null, page: 1, pageSize: 10, runDt: null, jobStatusList: [] } }).then(res => {
          that.tableRunRecord = res.data.list || []
          that.loadingRunRecord = false
          setTimeout(() => {
            that.$refs.tableRunRecord.doLayout()
          }, 300)
        })
      })
    },
    // 删除传输任务
    cancelTask(row) {
      let that = this
      this.$confirm('是否确定删除[' + row.taskName + ']数据导入任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

        .then(() => {
          request({ url: '/task_info/delete', method: 'post', data: { id: row.id } }).then(res => {
            res.code == 200 && (Notify('success', res.message || '处理成功'), that.getTaskData())
          })
        })
        .catch(() => {})
    },

    // 状态树状态
    addScrollListener() {
      let that = this
      let el = document.querySelector('#scroll-container')
      el.addEventListener('scroll', function () {
        let scrollTop = el.scrollTop
        switch (true) {
          case scrollTop < 100:
            that.leftActive = 1
            break
          case scrollTop > 100 && scrollTop < el.childNodes[0].childNodes[2].offsetTop:
            that.leftActive = 2
            break
          case scrollTop > el.childNodes[0].childNodes[2].offsetTop && scrollTop < el.childNodes[0].childNodes[4].offsetTop:
            that.leftActive = 3
            break
        }
      })
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
