
<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain groupJob">
    <div style="width: 100%; height: calc(100% - 0px); position: relative; overflow: hidden">
      <div class="main-unit" style="width: 100%; height: 100%; position: relative; overflow: hidden" id="container"></div>
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
          <el-form hide-required-asterisk disabled :model="formTask" ref="formTask" label-width="150px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: hidden auto; width: 98%; margin: 0 auto; padding-bottom: 60px">
            <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
              <p style="width: 100%; height: 30px; line-height: 30px; font-size: 16px; text-align: left; border-bottom: 1px solid rgb(0, 122, 255, 0.5); color: #007aff">1.基本信息</p>
              <div style="width: 100%; height: auto; margin: 20px auto 10px auto">
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
                      <el-col :span="12">
                        <el-form-item label="数据源：" :required="true" prop="readerParam.type">
                          <el-select v-model="formTask.readerParam.type" filterable placeholder="请选择类型" @change="typeChangeLeft()">
                            <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="" :required="true" prop="readerParam.dataSourceId" label-width="0">
                          <el-select v-model="formTask.readerParam.dataSourceId" filterable placeholder="请选择数据源" @change="dataSourceChangeLeft()">
                            <el-option v-for="(item, index) in dataSourceListLeft" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="24">
                      <el-col :span="12">
                        <el-form-item label="库表选择：" :required="true" prop="readerParam.dbName">
                          <el-select v-model="formTask.readerParam.dbName" filterable placeholder="请选择库" allow-create>
                            <el-option v-for="(item, index) in dbNameListLeft" v-bind:key="index" :label="item.dbName" :value="item.dbName"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="formTask.readerParam.type != 'MongoDB'">
                        <el-form-item label="" :required="true" prop="readerParam.tableName" label-width="0">
                          <el-select v-model="formTask.readerParam.tableName" filterable placeholder="请选择表" @change="tableNameChangeLeft()" allow-create>
                            <el-option v-for="(item, index) in tableNameListLeft" v-bind:key="index" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="formTask.readerParam.type == 'MongoDB'">
                        <el-form-item label="" :required="true" prop="readerParam.tableName" label-width="0">
                          <el-input v-model.trim="formTask.readerParam.tableName" autocomplete="off" placeholder="请输入表" @change="tableNameChangeLeft()"> </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="24" v-if="formTask.readerParam.type && formTask.readerParam.type != 'Hive' && formTask.readerParam.type != 'MongoDB'">
                      <el-col :span="24">
                        <el-form-item label="where：" prop="readerParam.where">
                          <template slot="label">
                            where：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">请参考对应数据源SQL语法，填写where条件后面的内容（不包括where条件）</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model.trim="formTask.readerParam.where" autocomplete="off" placeholder=""> </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" style="text-align: right; margin-top: -18px" v-if="formTask.readerParam.tableName">
                        <el-button type="primary" @click="showEditWhere()" size="small">编辑where</el-button>
                      </el-col>
                    </el-row>
                    <el-row :gutter="24" v-if="formTask.readerParam.type && formTask.readerParam.type == 'Hive'">
                      <el-col :span="24" v-if="partitionInfoListLeft.length > 0">
                        <el-form-item label="分区：" prop="readerParam.partitionInfoStr">
                          <template slot="label">
                            分区：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">1）动态分区的值可以为来源字段的值或来源数据库的系统函数。 2）分区方式为根据字段内容动态分区时，支持选择来源表字段，会将源端对应字段所在数据行写入到表对应的分区中。示例：选择来源表字段为A，当A字段值为aa时，会将数据写入到对应的aa分区中，当A字段值为bb时，会将数据写入到对应的bb分区中。</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-row v-for="(item, index) in formTask.readerParam.partitionInfoParamList" style="margin-bottom: 5px; text-align: right" :key="index">
                            <el-input style="width: 99%; margin-left: 0.5%" v-model="item.partitionInfoStr" autocomplete="off" placeholder="" disabled>
                              <template slot="prepend">{{ item.partitionFieldName }}</template>
                            </el-input>
                          </el-row>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="defaultFS：" :required="formTask.readerParam.type == 'Hive'" prop="readerParam.defaultFS">
                          <template slot="label">
                            defaultFS：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">Hadoop hdfs文件系统namenode节点地址。格式：hdfs://ip:端口；例如：hdfs://127.0.0.1:9000</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-input v-model.trim="formTask.readerParam.defaultFS" autocomplete="off" placeholder=""> </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="fileType：" :required="formTask.readerParam.type == 'Hive'" prop="readerParam.fileType">
                          <template slot="label">
                            fileType：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">文件的类型，目前只支持用户配置为text或orc。</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-select v-model="formTask.readerParam.fileType" filterable placeholder="">
                            <el-option label="text" value="text"></el-option>
                            <el-option label="orc" value="orc"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="path：" :required="formTask.readerParam.type == 'Hive'" prop="readerParam.path">
                          <template slot="label">
                            path：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">存储到Hadoop hdfs文件系统的路径信息</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-input v-model.trim="formTask.readerParam.path" autocomplete="off" placeholder=""> </el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="fieldDelimiter：" prop="readerParam.fieldDelimiter">
                          <template slot="label">
                            fieldDelimiter：
                            <el-tooltip style="diaplay: inline" effect="light" placement="top">
                              <div slot="content">hdfswriter写入时的字段分隔符,需要用户保证与创建的Hive表的字段分隔符一致，否则无法在Hive表中查到数据</div>
                              <i class="el-icon-magic-stick" />
                            </el-tooltip>
                          </template>
                          <el-input v-model.trim="formTask.readerParam.fieldDelimiter" autocomplete="off" placeholder=""> </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <div style="width: 49%; float: right; height: auto; margin-top: 10px">
                  <p style="width: 100%; height: 30px; line-height: 30px; font-size: 14px; text-align: left; color: #007aff">数据去向</p>
                  <div style="width: 100%; height: auto; border: 1px solid rgb(0, 122, 255, 0.2); box-sizing: border-box; border-radius: 4px; min-height: 100px; padding: 20px">
                    <el-row :gutter="24">
                      <el-col :span="12">
                        <el-form-item label="数据源：" :required="true" prop="writerParam.type">
                          <el-select v-model="formTask.writerParam.type" filterable placeholder="请选择类型" @change="typeChangeRight()">
                            <el-option v-for="(item, index) in dataTypeList" v-bind:key="index" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="" :required="true" prop="writerParam.dataSourceId" label-width="0">
                          <el-select v-model="formTask.writerParam.dataSourceId" filterable placeholder="请选择数据源" @change="dataSourceChangeRight()">
                            <el-option v-for="(item, index) in dataSourceListRight" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="24">
                      <el-col :span="12">
                        <el-form-item label="库表选择：" :required="true" prop="writerParam.dbName">
                          <el-select v-model="formTask.writerParam.dbName" filterable placeholder="请选择库" allow-create>
                            <el-option v-for="(item, index) in dbNameListRight" v-bind:key="index" :label="item.dbName" :value="item.dbName"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="formTask.writerParam.type != 'MongoDB'">
                        <el-form-item label="" :required="true" prop="writerParam.tableName" label-width="0">
                          <el-select v-model="formTask.writerParam.tableName" filterable placeholder="请选择表" @change="tableNameChangeRight()">
                            <el-option v-for="(item, index) in tableNameListRight" v-bind:key="index" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="formTask.writerParam.type == 'MongoDB'">
                        <el-form-item label="" :required="true" prop="writerParam.tableName" label-width="0">
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
                            </el-input>
                          </el-row>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                        <el-form-item label="defaultFS：" :required="formTask.writerParam.type == 'Hive'" prop="writerParam.defaultFS">
                          <template slot="label">
                            defaultFS：
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
                <el-table element-loading-text="数据加载中" empty-text="选择数据来源与去向后，显示字段映射" style="width: 98%; margin: 5px auto" ref="fieldParamList" :data="formTask.fieldParamList" stripe>
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
                            <el-input v-model="scope.row.sourceValue" autocomplete="off" placeholder="" v-show="scope.row.sourceFlag == 'fixed'"> </el-input>
                          </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sourceType" label="字段类型" min-width="50" align="left">
                      <template slot-scope="scope">
                        <el-select v-if="formTask.readerParam.type == 'MongoDB' || scope.row.sourceFlag == 'fixed'" v-model="scope.row.sourceType" filterable placeholder="请选择">
                          <el-option label="Long" value="Long"></el-option>
                          <el-option label="String" value="String"></el-option>
                          <el-option label="Double" value="Double" v-if="scope.row.sourceFlag == 'fixed'"></el-option>
                          <el-option label="Boolean" value="Boolean" v-if="scope.row.sourceFlag == 'fixed'"></el-option>
                          <el-option label="Date" value="Date" v-if="scope.row.sourceFlag == 'fixed'"></el-option>
                        </el-select>
                        <template v-else>{{ scope.row.sourceType }}</template>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sourceComment" label="字段描述" min-width="50" align="left" show-overflow-tooltip> </el-table-column>
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
                    <el-table-column prop="destComment" label="字段描述" min-width="50" align="left" show-overflow-tooltip> </el-table-column>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-form>
        </div>
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

      projectGroupList: [],
      dataTypeList: [],
      dataSourceListLeft: [],
      dbNameListLeft: [],
      tableNameListLeft: [],
      columnsDataLeft: [],
      partitionInfoListLeft: [],
      dataSourceListRight: [],
      dbNameListRight: [],
      tableNameListRight: [],
      columnsDataRight: [],
      partitionInfoListRight: [],
      dialogShowTask: false,
      titleTask: '',
      leftActive: 1,
      formTask: {
        id: '',
        projectGroupId: '',
        taskName: '',
        description: '',
        readerParam: {
          type: '',
          dataSourceId: '',
          dbName: '',
          tableName: '',
          where: '',
          fieldDelimiter: '',
          defaultFS: '',
          fileType: '',
          path: '',

          partitionInfoStr: '',
          partitionInfoParamList: []
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
          defaultFS: '',
          fileType: '',
          fileName: '',
          path: '',
          partitionFieldName: '',
          partitionInfoStr: '',
          partitionInfoParamList: []
        },
        fieldParamList: []
      }
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
            props: { tranId: item.split('*')[1] },
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
            props: { tranId: item.split('*')[1] },
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
      that.graph.on('edge:dblclick', ({ e, x, y, edge, view }) => {
        that.seeTask(edge.store.data.props.tranId)
      })

      // this.graph.on('node:mouseenter', val => {
      //   const container = document.getElementById('container')
      //   const ports = container.querySelectorAll('.x6-port-body')
      //   for (let i = 0, len = ports.length; i < len; i = i + 1) {
      //     ports[i].style.visibility = val ? 'visible' : 'hidden'
      //   }
      // })
    },
    // 查看任务
    seeTask(id) {
      let that = this
      request({ url: '/task_info/get_by_id', method: 'get', params: { id: id } }).then(res => {
        if (res.code == 200) {
          that.titleTask = '任务详情'
          that.leftActive = 1
          that.dialogShowTask = true
          that.dataSourceListLeft = []
          that.dbNameListLeft = []
          that.tableNameListLeft = []
          that.columnsDataLeft = []
          that.partitionInfoListLeft = []
          that.dataSourceListRight = []
          that.dbNameListRight = []
          that.tableNameListRight = []
          that.columnsDataRight = []
          that.partitionInfoListRight = []
          resetForm('formTask', that)
          let temp = { ...JSON.parse(res.data.taskOriginalData) }
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
          request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.formTask.readerParam.type, page: 1, pageSize: 1000 } }).then(res2 => {
            that.dataSourceListLeft = res2.data.list || []
            that.dbNameListLeft = that.dataSourceListLeft.filter(s => {
              return s.id == that.formTask.readerParam.dataSourceId
            })
            request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formTask.readerParam.dataSourceId } }).then(res3 => {
              that.tableNameListLeft = res3.data
              if (that.formTask.readerParam.type == 'Hive') {
                request({ url: '/data_source/hive/column_and_partition', method: 'get', params: { id: that.formTask.readerParam.dataSourceId, table: that.formTask.readerParam.tableName } }).then(res4 => {
                  that.columnsDataLeft = res4.data.columnEntityList || []
                  that.partitionInfoListLeft = res4.data.partitionInfoList || []
                })
              } else {
                request({ url: '/data_source/columns', method: 'get', params: { id: that.formTask.readerParam.dataSourceId, table: that.formTask.readerParam.tableName } }).then(res4 => {
                  that.columnsDataLeft = res4.data || []
                  if (that.formTask.readerParam.type == 'Oracle') {
                    that.columnsDataLeft.forEach((item, index) => {
                      item.columnName = `"${item.columnName}"`
                    })
                  }
                })
              }
            })
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
