<template>
  <div style="width: 100%; height: 100%; overflow: hidden; background: #ffffff; position: relative" class="syncTasksDialog">
    <!-- 左侧步骤指示 -->
    <div style="width: calc(100% - 60px); height: 60px; margin: 20px auto 0 auto">
      <div style="height: 60px; width: 100%">
        <el-steps :active="leftActive">
          <el-step title="基本信息"></el-step>
          <el-step title="数据来源与去向"></el-step>
          <el-step title="字段映射"></el-step>
          <el-step title="确定"></el-step>
        </el-steps>
      </div>
    </div>
    <!-- 表单主体 -->
    <div style="width: 100%; height: calc(100% - 90px); overflow: hidden auto; margin-top: 10px" id="scroll-container">
      <el-form :model="formTask" ref="formTask" label-width="150px" :rules="rules" :show-message="false" class="demo-ruleForm" style="height: auto; overflow: hidden auto; width: calc(100% - 60px); margin: 0 auto; padding-bottom: 60px">
        <div style="width: 100%; height: auto; margin: 10px auto 0 auto">
          <p style="width: 100%; height: 30px; line-height: 30px; font-size: 14px; text-align: left; border-bottom: 1px solid #c0c4cc; color: #1d2129">1.基本信息</p>
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
          <p style="width: 100%; height: 30px; line-height: 30px; font-size: 14px; text-align: left; border-bottom: 1px solid #c0c4cc; color: #1d2129">2.数据来源与去向</p>
          <div style="width: 98%; height: auto; overflow: hidden; margin: 0 auto">
            <div style="width: 49%; float: left; height: auto; margin-top: 15px">
              <p style="width: 80px; height: 26px; line-height: 26px; font-size: 12px; text-align: center; color: #1d2129; background-color: #eff1f6">数据来源</p>
              <div style="width: 100%; height: auto; border: 4px solid #eff1f6; box-sizing: border-box; min-height: 100px; padding: 20px">
                <el-row :gutter="24">
                  <el-col :span="12" :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                    <el-form-item label="类型：" :required="true" prop="readerParam.type" label-width="100px">
                      <el-select v-model="formTask.readerParam.type" filterable placeholder="请选择类型" @change="typeChangeLeft()">
                        <el-option v-for="(item, index) in dataTypeListSource" v-bind:key="index" :label="item" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                    <el-form-item label="数据源：" :required="true" prop="readerParam.dataSourceId" label-width="100px">
                      <el-select v-model="formTask.readerParam.dataSourceId" filterable placeholder="请选择数据源" @change="dataSourceChangeLeft()">
                        <el-option v-for="(item, index) in dataSourceListLeft" v-bind:key="index" :label="item.sourceName" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24" v-if="formTask.readerParam.type && formTask.readerParam.type != 'FTP'">
                  <el-col :span="12" :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                    <el-form-item label="库选择：" :required="formTask.readerParam.type != 'FTP'" prop="readerParam.dbName" label-width="100px">
                      <el-select v-model="formTask.readerParam.dbName" filterable placeholder="请选择库" allow-create>
                        <el-option v-for="(item, index) in dbNameListLeft" v-bind:key="index" :label="item.dbName" :value="item.dbName"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" :xs="24" :sm="24" :md="24" :lg="24" :xl="12" v-if="formTask.readerParam.type != 'MongoDB'">
                    <el-form-item label="表选择：" :required="formTask.readerParam.type != 'FTP'" prop="readerParam.tableName" label-width="100px">
                      <el-select v-model="formTask.readerParam.tableName" filterable placeholder="请选择表" @change="tableNameChangeLeft()" allow-create>
                        <el-option v-for="(item, index) in tableNameListLeft" v-bind:key="index" :label="item" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" :xs="24" :sm="24" :md="24" :lg="24" :xl="12" v-if="formTask.readerParam.type == 'MongoDB'">
                    <el-form-item label="表选择：" :required="formTask.readerParam.type != 'FTP'" prop="readerParam.tableName" label-width="100px">
                      <el-input v-model.trim="formTask.readerParam.tableName" autocomplete="off" placeholder="请输入表" @change="tableNameChangeLeft()"> </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24" v-if="formTask.readerParam.type == 'MySQL' || formTask.readerParam.type == 'SqlServer' || formTask.readerParam.type == 'ClickHouse' || formTask.readerParam.type == 'Oracle' || formTask.readerParam.type == 'DM'">
                  <el-col :span="24">
                    <el-form-item label="where：" prop="readerParam.where">
                      <template slot="label">
                        where：
                        <el-tooltip effect="light" placement="top">
                          <div slot="content">请参考对应数据源SQL语法，填写where条件后面的内容（不包括where条件）</div>
                          <i class="el-icon-magic-stick" />
                        </el-tooltip>
                      </template>
                      <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model.trim="formTask.readerParam.where" autocomplete="off" placeholder=""> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" style="text-align: right; margin-top: -5px" v-if="formTask.readerParam.tableName">
                    <el-button type="text" icon="el-icon-edit" @click="showEditWhere()" size="mini">编辑where</el-button>
                  </el-col>
                </el-row>
                <el-row :gutter="24" v-if="formTask.readerParam.type == 'Hive'">
                  <el-col :span="24" v-if="partitionInfoListLeft.length > 0">
                    <el-form-item label="分区：" prop="readerParam.partitionInfoStr">
                      <template slot="label">
                        分区：
                        <el-tooltip effect="light" placement="top">
                          <div slot="content">1）动态分区的值可以为来源字段的值或来源数据库的系统函数。 2）分区方式为根据字段内容动态分区时，支持选择来源表字段，会将源端对应字段所在数据行写入到表对应的分区中。示例：选择来源表字段为A，当A字段值为aa时，会将数据写入到对应的aa分区中，当A字段值为bb时，会将数据写入到对应的bb分区中。</div>
                          <i class="el-icon-magic-stick" />
                        </el-tooltip>
                      </template>
                      <el-row v-for="(item, index) in formTask.readerParam.partitionInfoParamList" style="margin-bottom: 5px; text-align: right" :key="index">
                        <el-input style="width: 99%; margin-left: 0.5%" v-model="item.partitionInfoStr" autocomplete="off" placeholder="" disabled>
                          <template slot="prepend">{{ item.partitionFieldName }}</template>
                          <template slot="append">
                            <el-button @click="showPartitionLeft(index)">编 辑</el-button>
                          </template>
                        </el-input>
                      </el-row>
                      <el-button type="text" icon="el-icon-circle-plus-outline" style="float: right" @click="formTask.readerParam.partitionInfoParamList.push({ partitionFieldName: '', partitionInfoStr: '', sort: formTask.readerParam.partitionInfoParamList.length + 1, type: '' })" size="mini">添加分区</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                    <el-form-item label="defaultFS：" :required="formTask.readerParam.type == 'Hive'" prop="readerParam.defaultFS">
                      <template slot="label">
                        defaultFS：
                        <el-tooltip effect="light" placement="top">
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
                        <el-tooltip effect="light" placement="top">
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
                        <el-tooltip effect="light" placement="top">
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
                        <el-tooltip effect="light" placement="top">
                          <div slot="content">hdfswriter写入时的字段分隔符,需要用户保证与创建的Hive表的字段分隔符一致，否则无法在Hive表中查到数据</div>
                          <i class="el-icon-magic-stick" />
                        </el-tooltip>
                      </template>
                      <el-input v-model.trim="formTask.readerParam.fieldDelimiter" autocomplete="off" placeholder=""> </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24" v-if="formTask.readerParam.type == 'FTP'">
                  <el-col :span="24">
                    <el-form-item label="路径：" prop="readerParam.path" :required="formTask.readerParam.type == 'FTP'">
                      <el-input v-model.trim="formTask.readerParam.path" autocomplete="off" placeholder="">
                        <template slot="append">
                          <el-button @click="showPathDetail()">选择路径</el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="服务器协议：" prop="readerParam.protocol" :required="formTask.readerParam.type == 'FTP'">
                      <template slot="label">
                        服务器协议：
                        <el-tooltip effect="light" placement="top">
                          <div slot="content">ftp服务器协议，目前支持传输协议有ftp和sftp。</div>
                          <i class="el-icon-magic-stick" />
                        </el-tooltip>
                      </template>
                      <el-select v-model="formTask.readerParam.protocol" filterable placeholder="">
                        <el-option label="ftp" value="ftp"></el-option>
                        <el-option label="sftp" value="sftp"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="列分隔符：" prop="readerParam.fieldDelimiter" :required="formTask.readerParam.type == 'FTP'">
                      <el-input v-model.trim="formTask.readerParam.fieldDelimiter" autocomplete="off" placeholder="" @change="ftpPathChangeLeft"> </el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="编码格式：" prop="readerParam.encoding" :required="formTask.readerParam.type == 'FTP'">
                      <el-select v-model="formTask.readerParam.encoding" filterable placeholder="">
                        <el-option label="UTF-8" value="UTF-8"></el-option>
                        <el-option label="GBK" value="GBK"></el-option>
                        <el-option label="GB18030-2022" value="GB18030-2022"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="首行为标题：" prop="readerParam.skipHeader" :required="formTask.readerParam.type == 'FTP'">
                      <el-radio-group v-model="formTask.readerParam.skipHeader" @change="ftpPathChangeLeft">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                      </el-radio-group>
                      <!-- <el-button style="margin-left: 20px" type="text" :disabled="!formTask.readerParam.fieldDelimiter" @click="getDetailDataLeft">数据预览</el-button> -->
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div style="width: 49%; float: right; height: auto; margin-top: 15px">
              <p style="width: 80px; height: 26px; line-height: 26px; font-size: 12px; text-align: center; color: #1d2129; background-color: #eff1f6">数据去向</p>
              <div style="width: 100%; height: auto; border: 4px solid #eff1f6; box-sizing: border-box; min-height: 100px; padding: 20px">
                <el-row :gutter="24">
                  <el-col :span="12" :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                    <el-form-item label="类型：" :required="true" prop="writerParam.type" label-width="100px">
                      <el-select v-model="formTask.writerParam.type" filterable placeholder="请选择类型" @change="typeChangeRight()">
                        <el-option v-for="(item, index) in dataTypeListDest" v-bind:key="index" :label="item" :value="item"></el-option>
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
                <el-row :gutter="24" v-if="formTask.writerParam.type">
                  <el-col :span="12" :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                    <el-form-item label="库选择：" :required="true" prop="writerParam.dbName" label-width="100px">
                      <el-select v-model="formTask.writerParam.dbName" filterable placeholder="请选择库" allow-create>
                        <el-option v-for="(item, index) in dbNameListRight" v-bind:key="index" :label="item.dbName" :value="item.dbName"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" :xs="24" :sm="24" :md="24" :lg="24" :xl="12" v-if="formTask.writerParam.type != 'MongoDB'">
                    <el-form-item label="表选择：" :required="true" prop="writerParam.tableName" label-width="100px">
                      <el-select v-model="formTask.writerParam.tableName" filterable placeholder="请选择表" @change="tableNameChangeRight()">
                        <el-option v-for="(item, index) in tableNameListRight" v-bind:key="index" :label="item" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" :xs="24" :sm="24" :md="24" :lg="24" :xl="12" v-if="formTask.writerParam.type == 'MongoDB'">
                    <el-form-item label="表选择：" :required="true" prop="writerParam.tableName" label-width="100px">
                      <el-input v-model.trim="formTask.writerParam.tableName" autocomplete="off" placeholder="请输入表" @change="tableNameChangeRight()"> </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="24" v-if="formTask.writerParam.type == 'MySQL' || formTask.writerParam.type == 'SqlServer' || formTask.writerParam.type == 'ClickHouse' || formTask.writerParam.type == 'Oracle' || formTask.writerParam.type == 'DM'">
                  <el-col :span="24">
                    <el-form-item label="preSql：" prop="writerParam.preSql">
                      <template slot="label">
                        preSql：
                        <el-tooltip effect="light" placement="top">
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
                        <el-tooltip effect="light" placement="top">
                          <div slot="content">导入数据后执行的SQL语句，例如加上某一个时间戳；多条SQL语句使用分号(;)分隔</div>
                          <i class="el-icon-magic-stick" />
                        </el-tooltip>
                      </template>
                      <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 100 }" v-model="formTask.writerParam.postSql" autocomplete="off" placeholder=""> </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24" v-if="formTask.writerParam.type == 'Hive'">
                  <el-col :span="24" v-if="partitionInfoListRight.length > 0">
                    <el-form-item label="分区：" prop="writerParam.partitionInfoStr">
                      <template slot="label">
                        分区：
                        <el-tooltip effect="light" placement="top">
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
                      <el-button type="text" icon="el-icon-circle-plus-outline" style="float: right" @click="formTask.writerParam.partitionInfoParamList.push({ partitionFieldName: '', partitionInfoStr: '', sort: formTask.writerParam.partitionInfoParamList.length + 1, type: '' })" size="mini">添加分区</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" v-show="false">
                    <el-form-item label="defaultFS：" :required="formTask.writerParam.type == 'Hive'" prop="writerParam.defaultFS">
                      <template slot="label">
                        defaultFS：
                        <el-tooltip effect="light" placement="top">
                          <div slot="content">Hadoop hdfs文件系统namenode节点地址。格式：hdfs://ip:端口；例如：hdfs://127.0.0.1:9000</div>
                          <i class="el-icon-magic-stick" />
                        </el-tooltip>
                      </template>
                      <el-input v-model.trim="formTask.writerParam.defaultFS" autocomplete="off" placeholder=""> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" v-show="false">
                    <el-form-item label="fileType：" :required="formTask.writerParam.type == 'Hive'" prop="writerParam.fileType">
                      <template slot="label">
                        fileType：
                        <el-tooltip effect="light" placement="top">
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
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" v-show="false">
                    <el-form-item label="path：" :required="formTask.writerParam.type == 'Hive'" prop="writerParam.path">
                      <template slot="label">
                        path：
                        <el-tooltip effect="light" placement="top">
                          <div slot="content">存储到Hadoop hdfs文件系统的路径信息</div>
                          <i class="el-icon-magic-stick" />
                        </el-tooltip>
                      </template>
                      <el-input v-model.trim="formTask.writerParam.path" autocomplete="off" placeholder=""> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" v-show="false">
                    <el-form-item label="fileName：" :required="formTask.writerParam.type == 'Hive'" prop="writerParam.fileName">
                      <template slot="label">
                        fileName：
                        <el-tooltip effect="light" placement="top">
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
                        <el-tooltip effect="light" placement="top">
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
                        <el-tooltip effect="light" placement="top">
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
          <p style="width: 100%; height: 30px; line-height: 30px; font-size: 14px; text-align: left; border-bottom: 1px solid #c0c4cc; color: #1d2129">3.字段映射</p>
          <div style="width: 100%; height: auto; min-height: 300px">
            <div style="text-align: left; margin: 10px auto 10px auto; width: 98%; height: 30px">
              <!-- <el-radio-group v-model="generateType" size="small" @change="generateFieldParamList()">
                    <el-radio-button label="name">同名映射</el-radio-button>
                    <el-radio-button label="line">同行映射</el-radio-button>
                  </el-radio-group> -->
              <el-button type="text" @click=";(generateType = 'name'), generateFieldParamList()" v-if="formTask.fieldParamList.length > 0">同名映射</el-button>
              <el-button type="text" @click=";(generateType = 'line'), generateFieldParamList()" v-if="formTask.fieldParamList.length > 0">同行映射</el-button>
            </div>
            <el-table v-loading="fieldParamListLoading" element-loading-text="数据加载中" empty-text="选择数据来源与去向后，显示字段映射" style="width: 98%; margin: 5px auto" ref="fieldParamList" :data="formTask.fieldParamList" stripe>
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
    <!-- 底部按钮 -->
    <div style="width: 100%; height: 50px; position: absolute; right: 0; bottom: 0; z-index: 10; border-top: 1px solid #e5e7ec; background: #ffffff">
      <div style="width: auto; height: 40px; float: right; margin: 10px 10px">
        <el-button type="primary" style="width: 80px" v-if="addOrModifyOrCopyTask == 'add'" :disabled="buttonLoad" :loading="buttonLoad" @click="addTask()" size="mini">保存</el-button>
        <el-button type="primary" style="width: 80px" v-if="addOrModifyOrCopyTask == 'modify'" :disabled="buttonLoad" :loading="buttonLoad" @click="updateTask()" size="mini">修改</el-button>
        <el-button type="primary" style="width: 80px" v-if="addOrModifyOrCopyTask == 'copy'" :disabled="buttonLoad" :loading="buttonLoad" @click="copyTask()" size="mini">复制</el-button>
      </div>
      <div style="width: auto; height: 40px; float: right; margin: 10px 10px">
        <el-button style="width: 80px" @click="closeDialog" size="mini">取消</el-button>
      </div>
    </div>
    <!-- 编辑where弹框 -->
    <el-dialog title="编辑where" :visible.sync="dialogShowEditWhere" width="800px">
      <el-form :model="formEditWhere" ref="formEditWhere" :rules="rules" :show-message="false" class="demo-ruleForm">
        <el-row :gutter="24" v-for="(item, index) in formEditWhere.whereList" :key="index">
          <el-col :span="7">
            <el-form-item label="" :required="true" :prop="'whereList.' + index + '.column'" label-width="0">
              <el-select v-model="item.column" filterable placeholder="请选择" @change="columnChange(item)">
                <el-option v-for="(item, index) in columnsDataLeft" v-bind:key="index" :label="item.columnName" :value="item.columnName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" :required="true" :prop="'whereList.' + index + '.flag'" label-width="0">
              <el-select v-model="item.flag" filterable placeholder="请选择">
                <el-option label="=" value="="></el-option>
                <el-option v-if="item.type == 'int'" label=">" value=">"></el-option>
                <el-option v-if="item.type == 'int'" label="<" value="<"></el-option>
                <el-option v-if="item.type == 'int'" label=">=" value=">="></el-option>
                <el-option v-if="item.type == 'int'" label="<=" value="<="></el-option>
                <el-option label="!=" value="!="></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="" :required="true" :prop="'whereList.' + index + '.value'" label-width="0">
              <el-input v-model="item.value" autocomplete="off" placeholder="请输入"><el-button slot="append" icon="el-icon-edit-outline" @click="showWhereValueEdit(index)"></el-button> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="text" style="color: #fc4b4b" @click="formEditWhere.whereList.splice(index, 1)">删除</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24" style="text-align: left">
            <el-button type="text" icon="el-icon-circle-plus-outline" @click="formEditWhere.whereList.push({ column: '', flag: '', value: '' })" style="width: 100px" size="mini">添加</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowEditWhere = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" @click="editWhere" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑WhereValue弹框 -->
    <el-dialog title="编辑WhereValue" :visible.sync="dialogShowEditWhereValue" width="500px">
      <el-form :model="formWhereValueEdit" ref="formWhereValueEdit" :rules="rules" label-width="120px" :show-message="false" class="demo-ruleForm">
        <el-form-item label="类型：" prop="type">
          <el-radio-group v-model="formWhereValueEdit.type" size="mini">
            <el-radio-button label="date">时间</el-radio-button>
            <el-radio-button label="dynamics">动态变量</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间格式：" :required="formWhereValueEdit.type == 'date'" prop="dateFormat" v-show="formWhereValueEdit.type == 'date'">
          <el-select v-model="formWhereValueEdit.dateFormat" filterable placeholder="" clearable="">
            <el-option value="YYYYmmdd" label="yyyyMMdd"></el-option>
            <el-option value="YYYY-mm-dd" label="yyyy-MM-dd"></el-option>
            <el-option value="YYYY:mm:dd" label="yyyy:MM:dd"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间：" :required="!formWhereValueEdit.type == 'date'" prop="date" v-show="formWhereValueEdit.type == 'date'">
          <el-date-picker v-model="formWhereValueEdit.date" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"> </el-date-picker>
        </el-form-item>
        <el-form-item label="动态变量：" :required="formWhereValueEdit.dynamicsOrStatic" prop="dynamicsStr1" v-show="formWhereValueEdit.type == 'dynamics'">
          <el-input placeholder="" v-model="formWhereValueEdit.dynamicsStr1" oninput="value=value.replace(/[^\d]/g,'')">
            <template slot="append">.days.ago</template>
          </el-input>
        </el-form-item>
        <el-form-item label="时间格式：" :required="formWhereValueEdit.dynamicsOrStatic" prop="dynamicsStr2" v-show="formWhereValueEdit.type == 'dynamics'">
          <el-select v-model="formWhereValueEdit.dynamicsStr2" filterable placeholder="" clearable="">
            <el-option value="yyyyMMdd$end$" label="yyyyMMdd"></el-option>
            <el-option value="yyyy-MM-dd$end$" label="yyyy-MM-dd"></el-option>
            <el-option value="yyyy:MM:dd$end$" label="yyyy:MM:dd"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowEditWhereValue = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" @click="editWhereValue" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑右侧分区弹框 -->
    <el-dialog title="编辑分区" :visible.sync="dialogShowEditPartitionRight" width="500px">
      <el-form :model="formPartitionRight" ref="formPartitionRight" :rules="rules" label-width="120px" :show-message="false" class="demo-ruleForm">
        <el-form-item label="分区名称：" prop="partitionFieldName" :required="true">
          <el-select v-model="formPartitionRight.partitionFieldName" placeholder="" @change="partitionFieldNameChangeRight">
            <el-option v-for="(item, index) in partitionInfoListRight" :label="item.columnName" :value="item.columnName" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型：" prop="type" :required="true">
          <el-input v-model="formPartitionRight.type" placeholder="" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort" :required="true">
          <el-input-number style="width: 100%" v-model="formPartitionRight.sort" placeholder="" autocomplete="off" size="small"></el-input-number>
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
        <el-button @click="dialogShowEditPartitionRight = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="danger" @click="formTask.writerParam.partitionInfoParamList.splice(formPartitionRightIndex, 1), (dialogShowEditPartitionRight = false)" style="width: 100px" size="mini">删 除</el-button>
        <el-button type="primary" @click="editPartitionRight" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑左侧分区弹框 -->
    <el-dialog title="编辑分区" :visible.sync="dialogShowEditPartitionLeft" width="500px">
      <el-form :model="formPartitionLeft" ref="formPartitionLeft" :rules="rules" label-width="120px" :show-message="false" class="demo-ruleForm">
        <el-form-item label="分区名称：" prop="partitionFieldName" :required="true">
          <el-select v-model="formPartitionLeft.partitionFieldName" placeholder="" @change="partitionFieldNameChangeLeft">
            <el-option v-for="(item, index) in partitionInfoListLeft" :label="item.columnName" :value="item.columnName" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型：" prop="type" :required="true">
          <el-input v-model="formPartitionLeft.type" placeholder="" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort" :required="true">
          <el-input-number style="width: 100%" v-model="formPartitionLeft.sort" placeholder="" autocomplete="off" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="变量类型：" prop="dynamicsOrStatic">
          <el-switch v-model="formPartitionLeft.dynamicsOrStatic" inactive-color="#13ce66" active-text="动态变量" inactive-text="静态变量"> </el-switch>
        </el-form-item>
        <el-form-item label="静态变量：" :required="!formPartitionLeft.dynamicsOrStatic" prop="staticStr" v-show="!formPartitionLeft.dynamicsOrStatic">
          <el-input v-model="formPartitionLeft.staticStr" placeholder="" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="动态变量：" :required="formPartitionLeft.dynamicsOrStatic" prop="dynamicsStr1" v-show="formPartitionLeft.dynamicsOrStatic">
          <el-input placeholder="" v-model="formPartitionLeft.dynamicsStr1" oninput="value=value.replace(/[^\d]/g,'')">
            <template slot="append">.days.ago</template>
          </el-input>
          <!-- <el-select v-model="formPartitionLeft.dynamicsStr1" filterable placeholder="" clearable="">
            <el-option value="$start$1_days_before_" label="1.days.ago"></el-option>
            <el-option value="$start$2_days_before_" label="2.days.ago"></el-option>
            <el-option value="$start$3_days_before_" label="3.days.ago"></el-option>
            <el-option value="$start$5_days_before_" label="5.days.ago"></el-option>
            <el-option value="$start$7_days_before_" label="7.days.ago"></el-option>
            <el-option value="$start$10_days_before_" label="10.days.ago"></el-option>
            <el-option value="$start$30_days_before_" label="30.days.ago"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="时间格式：" :required="formPartitionLeft.dynamicsOrStatic" prop="dynamicsStr2" v-show="formPartitionLeft.dynamicsOrStatic">
          <el-select v-model="formPartitionLeft.dynamicsStr2" filterable placeholder="" clearable="">
            <el-option value="yyyyMMdd$end$" label="yyyyMMdd"></el-option>
            <el-option value="yyyy-MM-dd$end$" label="yyyy-MM-dd"></el-option>
            <el-option value="yyyy:MM:dd$end$" label="yyyy:MM:dd"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowEditPartitionLeft = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="danger" @click="formTask.readerParam.partitionInfoParamList.splice(formPartitionLeftIndex, 1), (dialogShowEditPartitionLeft = false)" style="width: 100px" size="mini">删 除</el-button>
        <el-button type="primary" @click="editPartitionLeft" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑路径信息弹框 -->
    <el-dialog title="路径信息" :visible.sync="dialogShowPathDetail" width="430px">
      <div style="height: 40px; line-height: 40px; width: 96%; margin: 10px auto 0 auto; font-size: 18px">
        <el-link type="warning" style="height: 40px; line-height: 40px; font-size: 18px" icon="el-icon-folder-opened" @click="refreshFile()"> </el-link>
        <template v-for="(item, index) in pathList">
          <el-link type="info" style="height: 40px; line-height: 40px; font-size: 12px; text-align: center; width: 20px" disabled>></el-link>
          <el-link type="warning" style="height: 40px; line-height: 40px; font-size: 18px" @click="fileCrumbClick(item, index)">{{ item }}</el-link>
        </template>
      </div>
      <div style="width: 96%; height: 400px; overflow: hidden auto; margin: 0 auto 10px auto; padding-bottom: 20px; border: 1px solid rgba(0, 0, 0, 0)" v-loading="loadingPathDetail">
        <!-- <el-tooltip class="item" effect="light" :content="'大小：' + item.fileSize + '           日期：' + item.createTime" placement="top-start"> -->
        <div style="width: 100%; height: 40px; margin-bottom: 2px; cursor: pointer; overflow: hidden" @click="item.dir ? nextFile(item) : chooseFile(item)" v-for="(item, index) in fileList" :key="index">
          <i style="width: 20px; height: 20px; margin: 10px auto; display: block; float: left; margin-left: 10px" :class="item.dir ? 'iconDir' : 'iconFile'"></i>
          <p style="float: left; height: 40px; line-height: 40px; width: 350px; margin-left: 10px; text-align: left; font-size: 18px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ item.fileName }}</p>
        </div>
        <!-- </el-tooltip> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/request'
import { resetForm, Notify, copyText, dateFormat } from '@/api/common'

export default {
  name: 'syncTasksDialog',

  props: {
    addOrModifyOrCopyTask: '',
    taskRow: ''
  },
  data() {
    return {
      rules: {
        test: []
      },
      buttonLoad: false,
      projectGroupList: [],
      dataTypeListSource: [],
      dataTypeListDest: [],
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
          fieldDelimiter: ',',
          defaultFS: '',
          fileType: '',
          path: '',
          encoding: 'UTF-8',
          skipHeader: true,
          protocol: 'ftp',
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
      },
      generateType: 'name',
      fieldParamListLoading: false,

      dialogShowEditWhere: false,
      formEditWhere: {
        whereList: [{ column: '', flag: '', value: '', type: '' }]
      },
      tempWhereValueIndex: '',
      dialogShowEditWhereValue: false,
      formWhereValueEdit: {
        type: 'date',
        dynamicsStr1: '',
        dynamicsStr2: '',
        date: '',
        dateFormat: ''
      },

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
      dialogShowEditPartitionLeft: false,
      formPartitionLeftIndex: 0,
      formPartitionLeft: {
        partitionFieldName: '',
        sort: '',
        type: '',
        dynamicsOrStatic: true,
        dynamicsStr1: '',
        dynamicsStr2: '',
        staticStr: ''
      },

      dialogShowPathDetail: false,
      loadingPathDetail: false,
      pathList: [],
      fileList: []
    }
  },
  mounted() {
    this.getDataTypeList()
    this.getProjectGroupList()
    this.init()
  },
  methods: {
    // 获取数据源类型list
    getDataTypeList() {
      let that = this
      request({ url: '/data_source/type/source/list', method: 'get', params: {} }).then(res => {
        that.dataTypeListSource = res.data
      })
      request({ url: '/data_source/type/dest/list', method: 'get', params: {} }).then(res => {
        that.dataTypeListDest = res.data
      })
    },
    // 获取项目组list
    getProjectGroupList() {
      let that = this
      request({ url: '/project_group_permission/user_info_id', method: 'get', params: { userInfoId: that.$store.state.userInfo.id } }).then(res => {
        that.projectGroupList = res.data
      })
    },
    init() {
      let that = this
      if (that.addOrModifyOrCopyTask == 'add') {
        that.leftActive = 1
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
        that.formTask = {
          id: '',
          taskName: '',
          projectGroupId: '',
          description: '',
          readerParam: {
            type: '',
            dataSourceId: '',
            dbName: '',
            tableName: '',
            where: '',
            fieldDelimiter: ',',
            defaultFS: '',
            fileType: '',
            path: '',
            encoding: 'UTF-8',
            skipHeader: true,
            protocol: 'ftp',
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

        that.$nextTick(() => {
          that.addScrollListener()
          setTimeout(() => {
            that.$refs.fieldParamList.doLayout()
          }, 300)
        })
      } else if (that.addOrModifyOrCopyTask == 'modify' || that.addOrModifyOrCopyTask == 'copy') {
        let that = this
        request({ url: '/task_info/get_by_id', method: 'get', params: { id: that.taskRow.id } }).then(res => {
          if (res.code == 200) {
            that.leftActive = 1
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
            console.log(temp)
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
              if (that.formTask.readerParam.type == 'FTP') {
                request({ url: '/ftp/file/read_first_line', method: 'get', params: { id: that.formTask.readerParam.dataSourceId, path: that.formTask.readerParam.path, fieldDelimiter: that.formTask.readerParam.fieldDelimiter } }).then(res3 => {
                  if (that.formTask.readerParam.skipHeader) {
                    res3.data.forEach((item, index) => {
                      that.columnsDataLeft.push({ columnName: item, columnComment: '-', columnType: 'string', columnIndex: index, format: '' })
                    })
                  } else {
                    res3.data.forEach((item, index) => {
                      that.columnsDataLeft.push({ columnName: 'column' + (index + 1), columnComment: '-', columnType: 'string', columnIndex: index, format: '' })
                    })
                  }
                })
              } else {
                request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formTask.readerParam.dataSourceId } }).then(res3 => {
                  that.tableNameListLeft = res3.data
                  if (that.formTask.readerParam.type == 'Hive') {
                    request({ url: '/data_source/hive/column_and_partition', method: 'get', params: { id: that.formTask.readerParam.dataSourceId, table: that.formTask.readerParam.tableName } }).then(res4 => {
                      that.columnsDataLeft = res4.data.columnEntityList || []
                      that.partitionInfoListLeft = res4.data.partitionInfoList || []
                    })
                  }
                  request({ url: '/data_source/columns', method: 'get', params: { id: that.formTask.readerParam.dataSourceId, table: that.formTask.readerParam.tableName } }).then(res4 => {
                    that.columnsDataLeft = res4.data || []
                    if (that.formTask.readerParam.type == 'Oracle') {
                      that.columnsDataLeft.forEach((item, index) => {
                        item.columnName = `"${item.columnName}"`
                      })
                    }
                  })
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
      }
    },
    // 状态树状态
    addScrollListener() {
      let that = this
      let el = document.querySelector('#scroll-container')
      el.addEventListener('scroll', function () {
        let scrollTop = el.scrollTop
        switch (true) {
          case scrollTop < 100:
            that.leftActive = 2
            break
          case scrollTop > 100 && scrollTop < el.childNodes[0].childNodes[2].offsetTop:
            that.leftActive = 3
            break
          case scrollTop > el.childNodes[0].childNodes[2].offsetTop && scrollTop < el.childNodes[0].childNodes[4].offsetTop:
            that.leftActive = 4
            break
        }
      })
    },
    // 左侧数据源类型change
    typeChangeLeft() {
      let that = this
      that.dataSourceListLeft = []
      that.dbNameListLeft = []
      that.tableNameListLeft = []
      that.formTask.readerParam.dataSourceId = ''
      that.formTask.readerParam.dbName = ''
      that.formTask.readerParam.tableName = ''
      that.formTask.readerParam.fieldDelimiter = ''
      that.formTask.readerParam.defaultFS = ''
      that.formTask.readerParam.fileType = ''
      that.formTask.readerParam.path = ''
      if (that.formTask.readerParam.type == 'FTP') {
        that.formTask.readerParam.fieldDelimiter = ','
      }
      request({ url: '/data_source/get_data_source_by_type', method: 'get', params: { type: that.formTask.readerParam.type, page: 1, pageSize: 1000 } }).then(res => {
        that.dataSourceListLeft = res.data.list || []
      })
    },
    // 左侧数据源change
    dataSourceChangeLeft() {
      let that = this
      if (that.formTask.readerParam.type == 'FTP') {
        return
      }
      that.dbNameListLeft = that.dataSourceListLeft.filter(s => {
        return s.id == that.formTask.readerParam.dataSourceId
      })
      that.tableNameListLeft = []
      that.formTask.readerParam.dbName = that.dbNameListLeft[0].dbName
      that.formTask.readerParam.tableName = ''
      request({ url: '/data_source/get_table_list_by_source_id', method: 'get', params: { id: that.formTask.readerParam.dataSourceId } }).then(res => {
        that.tableNameListLeft = res.data
      })
    },
    // 左侧表change
    tableNameChangeLeft() {
      let that = this
      that.columnsDataLeft = []

      if (that.formTask.readerParam.type == 'Hive') {
        that.formTask.readerParam.fieldDelimiter = ''
        that.formTask.readerParam.path = ''
        that.formTask.readerParam.defaultFS = ''
        that.formTask.readerParam.fileType = ''
        that.formTask.readerParam.partitionInfoParamList = []
        request({ url: '/data_source/hive/origin_info', method: 'get', params: { id: that.formTask.readerParam.dataSourceId, table: that.formTask.readerParam.tableName } }).then(res2 => {
          that.formTask.readerParam.fileType = res2.data.inputFormat || ''
          that.formTask.readerParam.fieldDelimiter = res2.data.fieldDelim || ','
          that.formTask.readerParam.path = res2.data.location || ''
          that.formTask.readerParam.defaultFS = res2.data.defaultFS || ''
        })
        request({ url: '/data_source/hive/column_and_partition', method: 'get', params: { id: that.formTask.readerParam.dataSourceId, table: that.formTask.readerParam.tableName } }).then(res => {
          that.columnsDataLeft = res.data.columnEntityList || []
          that.partitionInfoListLeft = res.data.partitionInfoList || []

          that.formTask.readerParam.partitionInfoStr = ''
          that.generateFieldParamList()
        })
      } else {
        request({ url: '/data_source/columns', method: 'get', params: { id: that.formTask.readerParam.dataSourceId, table: that.formTask.readerParam.tableName } }).then(res => {
          that.columnsDataLeft = res.data || []
          if (that.formTask.readerParam.type == 'Oracle') {
            that.columnsDataLeft.forEach((item, index) => {
              item.columnName = `"${item.columnName}"`
            })
          }
          that.generateFieldParamList()
        })
      }
    },
    // 左侧FTP路径change
    ftpPathChangeLeft() {
      let that = this
      that.columnsDataLeft = []
      request({ url: '/ftp/file/read_first_line', method: 'get', params: { id: that.formTask.readerParam.dataSourceId, path: that.formTask.readerParam.path, fieldDelimiter: that.formTask.readerParam.fieldDelimiter } }).then(res => {
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
    showPathDetail() {
      let that = this
      if (!that.formTask.readerParam.dataSourceId) {
        return Notify('warning', '请先选择数据源')
      }
      that.pathList = []
      that.fileList = []
      that.dialogShowPathDetail = true
      that.loadingPathDetail = true
      request({ url: '/ftp/file/get_dic_files', method: 'get', params: { id: that.formTask.readerParam.dataSourceId, path: '/' } }).then(res => {
        that.fileList = res.data.filter(s => {
          return s.fileName != '.' && s.fileName != '..'
        })
        that.fileList = that.fileList.sort((a, b) => b.dir - a.dir)
        that.loadingPathDetail = false
      })
    },

    refreshFile() {
      let that = this
      that.loadingPathDetail = true
      request({ url: '/ftp/file/get_dic_files', method: 'get', params: { id: that.formTask.readerParam.dataSourceId, path: '/' } }).then(res => {
        that.pathList = []
        that.fileList = res.data.filter(s => {
          return s.fileName != '.' && s.fileName != '..'
        })
        that.fileList = that.fileList.sort((a, b) => b.dir - a.dir)
        that.loadingPathDetail = false
      })
    },
    fileCrumbClick(item, index) {
      let that = this
      that.loadingPathDetail = true
      that.pathList.splice(index + 1, that.pathList.length)
      request({ url: '/ftp/file/get_dic_files', method: 'get', params: { id: that.formTask.readerParam.dataSourceId, path: '/' + that.pathList.join('/') } }).then(res => {
        that.fileList = res.data.filter(s => {
          return s.fileName != '.' && s.fileName != '..'
        })
        that.fileList = that.fileList.sort((a, b) => b.dir - a.dir)
        that.loadingPathDetail = false
      })
    },
    nextFile(item) {
      let that = this
      that.loadingPathDetail = true
      that.pathList.push(item.fileName)
      request({ url: '/ftp/file/get_dic_files', method: 'get', params: { id: that.formTask.readerParam.dataSourceId, path: '/' + that.pathList.join('/') } }).then(res => {
        that.fileList = res.data.filter(s => {
          return s.fileName != '.' && s.fileName != '..'
        })
        that.fileList = that.fileList.sort((a, b) => b.dir - a.dir)
        that.loadingPathDetail = false
      })
    },
    chooseFile(item) {
      let that = this
      that
        .$confirm('是否确定选择该文件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          if (that.pathList.length > 0) {
            that.formTask.readerParam.path = '/' + that.pathList.join('/') + '/' + item.fileName
          } else {
            that.formTask.readerParam.path = '/' + item.fileName
          }

          that.dialogShowPathDetail = false
          that.ftpPathChangeLeft()
        })
        .catch(() => {})
    },
    // 显示编辑where表单
    showEditWhere() {
      let that = this
      that.formEditWhere.whereList = []
      if (that.formTask.readerParam.where) {
        let arr = that.formTask.readerParam.where.split(' and ')
        arr.forEach((item, index) => {
          let temp = that.columnsDataLeft.filter(s => {
            return s.columnName == item.split(' ')[0]
          })
          if (temp[0]) {
            if (temp[0].columnType.includes('CHAR') || temp[0].columnType.includes('string') || temp[0].columnType.includes('char') || temp[0].columnType.includes('STRING')) {
              let reg = new RegExp("'", 'g')
              that.formEditWhere.whereList.push({ column: item.split(' ')[0], flag: item.split(' ')[1], value: item.split(' ')[2].replace(reg, ''), type: 'string' })
            } else {
              that.formEditWhere.whereList.push({ column: item.split(' ')[0], flag: item.split(' ')[1], value: item.split(' ')[2], type: 'int' })
            }
          }
        })
      } else {
        that.formEditWhere.whereList = [{ column: '', flag: '', value: '' }]
      }
      that.dialogShowEditWhere = true
    },
    columnChange(item) {
      let that = this
      let temp = that.columnsDataLeft.filter(s => {
        return s.columnName == item.column
      })
      if (temp[0].columnType.includes('CHAR') || temp[0].columnType.includes('string') || temp[0].columnType.includes('char') || temp[0].columnType.includes('STRING')) {
        item.type = 'string'
      } else {
        item.type = 'int'
      }
    },
    // 编辑where
    editWhere() {
      let that = this
      that.$refs['formEditWhere'].validate(valid => {
        if (valid) {
          let temp = []
          that.formEditWhere.whereList.forEach((item, index) => {
            if (item.type == 'string') {
              temp.push(item.column + ' ' + item.flag + ' ' + "'" + item.value + "'")
            } else {
              temp.push(item.column + ' ' + item.flag + ' ' + item.value)
            }
          })
          that.formTask.readerParam.where = temp.join(' and ')
          that.dialogShowEditWhere = false
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    showWhereValueEdit(index) {
      let that = this
      that.tempWhereValueIndex = index
      that.dialogShowEditWhereValue = true
      that.formWhereValueEdit = {
        type: 'date',
        dynamicsStr1: '',
        dynamicsStr2: '',
        date: '',
        dateFormat: ''
      }
    },
    editWhereValue() {
      let that = this
      that.$refs['formWhereValueEdit'].validate(valid => {
        if (valid) {
          if (that.formWhereValueEdit.type == 'date') {
            that.formEditWhere.whereList[that.tempWhereValueIndex].value = dateFormat(that.formWhereValueEdit.dateFormat, that.formWhereValueEdit.date)
          }
          if (that.formWhereValueEdit.type == 'dynamics') {
            that.formEditWhere.whereList[that.tempWhereValueIndex].value = '$start$' + that.formWhereValueEdit.dynamicsStr1 + '_days_before_' + that.formWhereValueEdit.dynamicsStr2
          }
          that.dialogShowEditWhereValue = false
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
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
              that.formTask.fieldParamList.push({ sourceFlag: 'field', sourceValue: null, destComment: item.columnComment || null, destName: item.columnName || null, destType: item.columnType || null, destIndex: item.columnIndex || 0, sourceComment: temp[0].columnComment || null, sourceName: temp[0].columnName || null, sourceType: temp[0].columnType || null, sourceIndex: temp[0].columnIndex || 0 })
            } else {
              that.formTask.fieldParamList.push({ sourceFlag: 'field', sourceValue: null, destComment: item.columnComment || null, destName: item.columnName || null, destType: item.columnType || null, destIndex: item.columnIndex || 0, sourceComment: null, sourceName: null, sourceType: null, sourceIndex: 0 })
            }
          })
        }
        if (that.generateType == 'line') {
          that.columnsDataRight.forEach((item, index) => {
            if (that.columnsDataLeft[index]) {
              that.formTask.fieldParamList.push({ sourceFlag: 'field', sourceValue: null, destComment: item.columnComment || null, destName: item.columnName || null, destType: item.columnType || null, destIndex: item.columnIndex || 0, sourceComment: that.columnsDataLeft[index].columnComment || null, sourceName: that.columnsDataLeft[index].columnName || null, sourceType: that.columnsDataLeft[index].columnType || null, sourceIndex: that.columnsDataLeft[index].columnIndex || 0 })
            } else {
              that.formTask.fieldParamList.push({ sourceFlag: 'field', sourceValue: null, destComment: item.columnComment || null, destName: item.columnName || null, destType: item.columnType || null, destIndex: item.columnIndex || 0, sourceComment: null, sourceName: null, sourceType: null, sourceIndex: 0 })
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
        row.sourceType = 'String'
        row.sourceComment = null
        row.sourceIndex = null
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
    // 数据来源Hive 分区编辑
    showPartitionLeft(index) {
      this.dialogShowEditPartitionLeft = true
      this.formPartitionLeftIndex = index
      resetForm('formPartitionLeft', this)
      this.formPartitionLeft = {
        partitionFieldName: this.formTask.readerParam.partitionInfoParamList[index].partitionFieldName,
        sort: this.formTask.readerParam.partitionInfoParamList[index].sort,
        type: this.formTask.readerParam.partitionInfoParamList[index].type,
        dynamicsOrStatic: true,
        dynamicsStr: '',
        staticStr1: '',
        staticStr2: ''
      }
    },
    partitionFieldNameChangeLeft() {
      this.formPartitionLeft.type = this.partitionInfoListLeft.filter(s => {
        return s.columnName == this.formPartitionLeft.partitionFieldName
      })[0].columnType
    },
    editPartitionLeft() {
      this.$refs['formPartitionLeft'].validate(valid => {
        if (valid) {
          if (this.formPartitionLeft.dynamicsOrStatic) {
            this.formTask.readerParam.partitionInfoParamList[this.formPartitionLeftIndex].partitionInfoStr = '$start$' + this.formPartitionLeft.dynamicsStr1 + '_days_before_' + this.formPartitionLeft.dynamicsStr2
          } else {
            this.formTask.readerParam.partitionInfoParamList[this.formPartitionLeftIndex].partitionInfoStr = this.formPartitionLeft.staticStr
          }
          this.formTask.readerParam.partitionInfoParamList[this.formPartitionLeftIndex].partitionFieldName = this.formPartitionLeft.partitionFieldName
          this.formTask.readerParam.partitionInfoParamList[this.formPartitionLeftIndex].type = this.formPartitionLeft.type
          this.formTask.readerParam.partitionInfoParamList[this.formPartitionLeftIndex].sort = this.formPartitionLeft.sort
          this.dialogShowEditPartitionLeft = false
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
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
          } else {
            Notify('error', '请至少选择一行映射！')
          }
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    },
    closeDialog() {
      this.$emit('close', '')
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
                  that.$emit('close', '')
                  that.$emit('getData', '')
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
    // 保存任务
    copyTask() {
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
          } else {
            Notify('error', '请至少选择一行映射！')
          }
        } else {
          Notify('error', '请将红色标注部分填写完整')
        }
      })
    }
  }
}
</script>
<style  scoped>
</style>
