<!--新增物理表、修改（共用一个页面）-->
<template>
  <div class="new-physical-model dashboard-editor-container">
    <el-card shadow="hover" class="card-container">
        <el-button type="primary" size="small" class="save" @click="toSaveModel">保存</el-button>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <el-form ref="formRules" :model="form" :rules="formRules" label-width="120px" style="width: 500px">
              <el-form-item label="数据库："  prop="sourceId">
                <el-select style="width: 234px" size="small" v-model="form.sourceId" placeholder="请选择" @change="baseInfoSchemaChange">
<!--                  <el-option label="请选择" value=""></el-option>-->
                  <el-option
                      v-for="item in aSchemaLists"
                      :key="item.sourceId"
                      :label="item.sourceName+'('+item.dbType+')'"
                      :value="item.sourceId"></el-option>
                </el-select>
                <el-tooltip @click.native="addDataSource" class="tooltip item" effect="dark" content="点击新增数据库" placement="top">
                  <i class="bubble-icon"></i>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="层次：" prop="levelId">
                <el-select style="width: 234px" size="small" v-model="form.levelId" placeholder="请选择">
<!--                  <el-option label="请选择" value=""></el-option>-->
                  <el-option
                      v-for="item in aLevelLists"
                      :key="item.levelId"
                      :label="item.levelName"
                      :value="item.levelId"></el-option>
                </el-select>
                <el-tooltip @click.native="addThemeOrLevel('层次')" class="tooltip item" effect="dark" content="点击新增数层次" placement="top">
                  <i class="bubble-icon"></i>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="主题："  prop="subjectId">
                <el-select style="width: 234px" size="small" v-model="form.subjectId" placeholder="请选择">
<!--                  <el-option label="请选择" value=""></el-option>-->
                  <el-option
                      v-for="item in aSubjectLists"
                      :key="item.subjectId"
                      :label="item.subjectName"
                      :value="item.subjectId"></el-option>
                </el-select>
                <el-tooltip @click.native="addThemeOrLevel('主题')"  class="tooltip item" effect="dark" content="点击新增主题" placement="top">
                  <i class="bubble-icon"></i>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="物理表英文名：" prop="tableEnName">
                <el-input size="small" v-model="form.tableEnName"></el-input>
              </el-form-item>
              <el-form-item label="物理表中文名：" prop="tableCnName">
                <el-input size="small" v-model="form.tableCnName"></el-input>
              </el-form-item>

              <div v-if="dataBaseType">
                <el-form-item label="存储格式：" prop="storageFormat">
                  <el-select style="width: 234px" size="small" v-model="form.storageFormat" placeholder="请选择">
                    <el-option
                        v-for="item in aStorageFormatLists"
                        :key="item.valueField"
                        :label="item.textField"
                        :value="item.valueField"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否压缩：">
                  <el-select style="width: 234px" size="small" v-model="form.isCompress" placeholder="请选择">
                    <el-option
                        v-for="item in aIsCompressLists"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分桶字段：">
                  <el-input size="small" v-model="form.bucketsColumn"></el-input>
                </el-form-item>
                <el-form-item label="分桶数：">
                  <el-input-number style="width: 80px" size="small" v-model="form.bucketsNum" controls-position="right" @change="bucketsNumChange" :min="0">
                  </el-input-number>
                </el-form-item>
                <el-form-item label="分区字段：">
                  <el-input size="small" v-model="form.partitionColumn"></el-input>
                </el-form-item>
                <el-form-item label="分区范围：">
                  <el-input size="small" v-model="form.partitionRange"></el-input>
                </el-form-item>
              </div>

              <el-form-item label="说明：">
                <el-input size="small" type="textarea" :rows="5" v-model="form.description"></el-input>
              </el-form-item>
              <el-form-item v-if="isEdit === 1" label="状态：">
                <el-select disabled style="width: 234px" size="small" v-model="form.status" placeholder="请选择">
                  <el-option
                      v-for="item in statusList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="字段信息" name="second" :disabled="bFieldInfoIsDisabled">
            <!--box组-->
            <div class="btn-box">
              <el-button size="small" type="primary" @click="addField"> <i class="btn-box-icon add"></i>新增字段</el-button>
            </div>
            <el-card class="card-table">
              <el-form  :model="tableFromData" :rules="columnMapMust"  ref="columnMapMust">
              <el-table
                  :data="tableFromData.columnMap"
                  style="width: 100%">
                <el-table-column
                    align="center"
                    type="index"
                    label="序号"
                    width="60">
                </el-table-column>
                <el-table-column
                    label="字段中文名"
                    align="center">
                  <template slot-scope="scope">
                    <el-form-item>
                    <el-input size="small" v-model="scope.row.columnCnName" @change="handleChange(scope, 'columnCnName')"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="参考标准"
                    align="center">
                  <template slot-scope="scope">
                    <el-form-item>
                    <el-button v-if="scope.row.refStandardId === undefined||scope.row.refStandardId === ''"  @click="openTree(scope)" size="small" class="btn-dashed"> <i class="el-icon-plus"></i> 增加</el-button>
                    <el-tag v-else  closable  @click="gorefStandardDetail(scope.row)"  @close="closeTag(scope)"
                    style="cursor:pointer"> {{ scope.row.refStandardCode }} </el-tag>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                    label="字段英文名"
                    min-width="120px"
                    align="center">
                  <template slot-scope="scope">
                    <!-- <el-input size="small" v-model="scope.row.columnEnName" @change="handleChange(scope, 'columnEnName')" @blur="columnEnNameBlur(scope.row)">
                    </el-input> -->
                    <el-form-item :prop="'columnMap.' + scope.$index + '.columnEnName'"
            	          :rules="columnMapMust.columnEnName">
                      <el-input size="small" v-model="scope.row.columnEnName" @change="handleChange(scope, 'columnEnName')" @blur="columnEnNameBlur(scope.row)">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                    label="字段类型"
                    align="center">
                  <template slot-scope="scope">
                    <el-form-item  :prop="'columnMap.' + scope.$index + '.typeCode'"
            	          :rules="columnMapMust.typeCode">
                    <el-select size="small" v-model="scope.row.typeCode" placeholder="请选择" @change="handleChange(scope, 'typeCode')">
                      <!-- <el-option label="请选择" value=""></el-option> -->
                      <el-option
                          v-for="item in aFieldTypeLists"
                          :key="item.typeId"
                          :label="item.typeName"
                          :value="item.typeId"></el-option>
                    </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                    label="长度"
                    align="center"
                    width="90">
                  <template slot-scope="scope">
                    <el-form-item>
                    <el-input-number style="width: 80px" size="small" v-model="scope.row.length" controls-position="right" @change="handleChange(scope, 'length')" :min="0"></el-input-number>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                    label="精度"
                    align="center"
                    width="90">
                  <template slot-scope="scope">
                    <el-form-item>
                    <el-input-number style="width: 80px" size="small" v-model="scope.row.precision" controls-position="right" @change="handleChange(scope, 'precision')" :min="0"></el-input-number>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                    label="是否主键"
                    align="center"
                    width="90">
                  <template slot-scope="scope"> 
                    <el-form-item>
                    <el-checkbox v-model="scope.row.isPk" @change="handleChange(scope, 'isPk')"></el-checkbox> 
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                    label="是否可空"
                    align="center"
                    width="90">
                  <template slot-scope="scope"> 
                    <el-form-item>
                    <el-checkbox v-model="scope.row.isNull" @change="handleChange(scope, 'isNull')"></el-checkbox> 
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="默认值"
                    align="center">
                  <template slot-scope="scope">
                    <el-form-item>
                    <el-input size="small" v-model="scope.row.defaultValue" @change="handleChange(scope, 'defaultValue')"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="描述"
                    align="center">
                  <template slot-scope="scope">
                    <el-form-item>
                    <el-input size="small" v-model="scope.row.description" @change="handleChange(scope, 'description')"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="110">
                  <template slot-scope="scope">
                    <div class="operation-icon">
                      <i class="el-icon-arrow-up" @click="sortUp(scope)"></i>
                      <i class="el-icon-arrow-down" @click="sortDown(scope)"></i>
                      <i class="el-icon-delete" @click="toDelField(scope)"></i>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              </el-form>
            </el-card>
          </el-tab-pane>
        </el-tabs>
    </el-card>

    <!--新增数据库-->
    <el-dialog title="新增数据库" :visible.sync="bDataSourceVisible">
      <el-tabs v-model="addDataSrcActiveName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-form :model="addDataSourceForm" :rules="rulesDataSource" ref="rulesDataSource">
            <el-form-item prop="sourceName" label="数据源名称：" :label-width="dataSourceWidth">
              <el-input style="width: 388px" size="small" v-model="addDataSourceForm.sourceName" autocomplete="off" placeholder="请输入数据源名称"></el-input>
            </el-form-item>
            <el-form-item label="数据源描述：" :label-width="dataSourceWidth">
              <el-input style="width: 388px"  size="small" type="textarea" :rows="5"  v-model="addDataSourceForm.sourceDesc" autocomplete="off" placeholder="请输入数据源描述"></el-input>
            </el-form-item>
            <el-form-item prop="sourceType" label="数据源类型：" :label-width="dataSourceWidth">
              <el-select size="small" v-model="addDataSourceForm.sourceType" placeholder="请选择" @change="typeChange">
                <el-option
                    v-for="item in sourceTypes"
                    :key="item.val"
                    :label="item.name"
                    :value="item.val"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="dbType" label="数据库类型：" :label-width="dataSourceWidth">
              <el-select size="small" v-model="addDataSourceForm.dbType" placeholder="请选择" @change="schemaChange">
                <el-option
                    v-for="item in baseTypes"
                    :key="item.valueField"
                    :label="item.textField"
                    :value="item.valueField"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="参数信息" name="second" :disabled="bIsSelectSourceType">
          <!--有必填项的参数信息-->
          <el-form v-show="isMustFill" :model="argumentMessage" :rules="argumentRuleValidate" ref="argumentRuleValidate" label-width="100px" inline>
            <el-form-item :label="hostName + '：'" prop="host">
              <el-input size="small" v-model="argumentMessage.host" style="width: 350px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="端口：" label-width="60" prop="port">
              <el-input size="small" v-model="argumentMessage.port" style="width: 80px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-show="hostName === '服务器地址'" :label="schemaName + '：'" prop="schema">
              <el-input size="small" v-model="argumentMessage.schema" style="width: 504px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-show="hostName === '主机'" label="数据库：" prop="schema">
              <el-input size="small" v-model="argumentMessage.schema" style="width: 350px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-if="hostName === '主机'" label="" label-width="0" prop="connType">
              <el-select size="small" v-model="argumentMessage.connType" placeholder="请选择" style="width: 140px;">
                <el-option v-for="item in links" :key="item.ID" :value="item.ID"> {{item.NAME}} </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户名：" prop="username">
              <el-input size="small" v-model="argumentMessage.username" style="width: 195px;" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input size="small" v-model="argumentMessage.password" type="password" style="width: 195px;" placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-form>
          <!--无必填项的参数信息-->
          <el-form v-show="!isMustFill" :model="argumentMessage1" ref="noMustFill" label-width="100px" inline>
            <el-form-item :label="hostName + '：'" >
              <el-input size="small" v-model="argumentMessage1.host" style="width: 350px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="端口：" label-width="60">
              <el-input size="small" v-model="argumentMessage1.port" style="width: 80px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-show="hostName === '服务器地址'" :label="schemaName + '：'" >
              <el-input size="small" v-model="argumentMessage1.schema" style="width: 504px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-show="hostName === '主机'" label="数据库：" >
              <el-input size="small" v-model="argumentMessage1.schema" style="width: 350px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-if="hostName === '主机'" label="" label-width="0" >
              <el-select size="small" v-model="argumentMessage1.connType" placeholder="请选择" style="width: 140px;">
                <el-option v-for="item in links" :key="item.ID" :value="item.ID"> {{item.NAME}} </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户名：" >
              <el-input size="small" v-model="argumentMessage1.username" style="width: 195px;" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码：" >
              <el-input size="small" v-model="argumentMessage1.password" type="password" style="width: 195px;" placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-form>
          <div v-if="isMustFill" class="test-box">
            <el-button size="small" type="success" @click="goTest"><i class="btn-box-icon test"></i>连接测试</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button size="small" type="primary" @click="saveDataSource">确 定</el-button>
        <el-button size="small" @click="bDataSourceVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--新增层次-->
    <el-dialog  title="新增层次" :visible.sync="bLevelVisible">
      <el-form :model="addLevelForm" :rules="rulesLevel" ref="addLevelForm">
        <el-form-item prop="code" label="层次代码：" :label-width="dataSourceWidth">
          <el-input style="width: 388px" size="small" v-model="addLevelForm.code" autocomplete="off" placeholder="请输入层次代码"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="层次名称：" :label-width="dataSourceWidth">
          <el-input style="width: 388px" size="small" v-model="addLevelForm.name" autocomplete="off" placeholder="请输入层次名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button size="small" type="primary" @click="saveLevelOrTheme('level')" :disabled="saveBtnIsDisabled">保 存</el-button>
        <el-button size="small" @click="bLevelVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--新增主题-->
    <el-dialog title="新增主题" :visible.sync="bThemeVisible">
      <el-form :model="addThemeForm" :rules="rulesTheme" ref="addThemeForm">
        <el-form-item prop="code" label="主题代码：" :label-width="dataSourceWidth">
          <el-input style="width: 388px" size="small" v-model="addThemeForm.code" autocomplete="off" placeholder="请输入主题代码"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="主题名称：" :label-width="dataSourceWidth">
          <el-input style="width: 388px" size="small" v-model="addThemeForm.name" autocomplete="off" placeholder="请输入主题名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button size="small" type="primary" @click="saveLevelOrTheme('subject')" :disabled="saveBtnIsDisabled">保 存</el-button>
        <el-button size="small" @click="bThemeVisible = false">取 消</el-button>
      </div>
    </el-dialog>
      <!--参考标准-->
    <!-- <el-dialog title="参考标准" :visible.sync="bShowTree">
      <el-input v-model="filterText" class="iptSearch" size="small" placeHolder="请输入" suffix-icon="el-icon-search"></el-input>
      <el-tree
          accordion
          :props="props"
          :load="loadNode"
          :filter-node-method="filterNode"
          node-key="id"
          ref="tree"
          lazy
          :highlight-current="true"
          empty-text="暂无数据"
          @node-click="handleNodeClick"
          @node-expand="handleNodeClick"
          @node-collapse="handleNodeClick"
          :render-content="renderContent"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer" align="center">
        <el-row class="choice-box">
          <el-col :span="20">
            <div><span>已选择：</span> <span class="content" @click="toStandardDetailsPage"> {{referenceData.choiceTreeNodeText}} </span> </div>
          </el-col>
          <el-col :span="4">
            <el-button size="small" type="primary" @click="saveTree">保 存</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog> -->
    <!--参考标准-->
    <el-dialog title="参考标准" :visible.sync="bShowTree">
      <div style="float:right;">
        <el-form inline>
          <el-form-item label="目录：" label-width="70px">
            <el-select
              clearable
              @clear="masterDataCatClear()"
              v-model="searchForm.masterDataCat"
              placeholder="请选择主数据目录"
              size='mini'
              style="width: 100%;"
            >
              <el-option :value="optionValue" style="height: auto" class="onlyOption reMd-tree">
                <el-tree :props="defaultProps"
                         :data="masterTreeData"
                         style="margin: 0 -20px;"
                          accordion
                          node-key="id"
                          ref="treeMD"
                          :highlight-current="true"
                          empty-text="暂无数据"
                          :render-content="renderContent"
                          @node-click="handleMDNodeClick">
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-right: 7px;" label="关键字：" label-width="70px">
            <el-input v-model="searchForm.masterDataKey"
                      placeholder="请输入主数据名称..." size="mini" clearable
                      @keyup.enter.native="getMDInfo"
            ><i slot="suffix" style="cursor: pointer" class="el-input__icon el-icon-search" @click="getMDInfo"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="masterDataSelect.tableData" border size="mini" :header-cell-style="{background:'#f8f8f9'}" :highlight-current-row="currentRowFlag" @row-click="clickMDTable">
        <el-table-column prop="name" label="名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="define" label="业务定义"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="context" label="上下文路径" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:30px;" v-if="masterDataSelect.tableData.length>0">
        <el-pagination
            @size-change="handleSizeChangeMD"
            @current-change="handleCurrentChangeMD"
            :current-page="masterDataSelect.oPage.pageCurrent"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="masterDataSelect.oPage.pageSize"
            background
            layout="total, sizes, prev, pager, next"
            :total="masterDataSelect.oPage.total">
        </el-pagination>
      </div>
      <div style="margin-top:50px;">
        <span style="font-size:13px;">已选择：</span>
        <div style="display: inline-block;" v-show="masterDataSelect.tagList.length > 0">
          <el-tag style="margin-left: 5px;margin-top: 5px;cursor:pointer"
                  v-for="(item, index) in masterDataSelect.tagList"
                  :key="index"
                  v-show="masterDataSelect.tagList.length > 0"
                  @close="closeMDTag(item, index)"
                  closable
                  effect="plain"
                  size="mini"
                  @click="goMDDetail(item)"
          >{{item.name}}</el-tag>
        </div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary" size="small" @click="saveTree">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { get, parseAjaxResponse, post, postByJson } from '../../utils/request'

  export default {
    name: 'newPhysicalModel',
    data() {
      return {
        // 修改后的参考标准相关数据
        optionValue: '',
        defaultProps: {
          label: 'nodeName',
          children: 'childNodes'
        },
        masterTreeData: [],
        searchForm: {
          masterDataCat: '',
          masterDataCatId: '',
          masterDataKey: ''
        },

        masterDataSelect: {
          tableData: [],
          oPage: {
            pageCurrent: 1,
            pageSize: 10,
            total: 10
          },
          tagList: []
        },
        currentRowFlag: true,
        // 提交按钮，是否禁用
        saveBtnIsDisabled: false, // false 非禁用
        // 树形控件props
        filterText: "",
        referenceData: {
          choiceTreeNodeText: '',
          instanceId: '',
          instanceCode: '',
          instanceEnName: '',
          instanceCnName: '',
          index: '',
          classifierId: '',
          description: ''
        },
        props: {
          label: "instanceName",
          children: "children",
          isLeaf: "isLeaf"
        },
        nodeId: 0,
        sNodeId: 0,
        activeName: 'first',
        addDataSrcActiveName: 'first', // 新增数据库对话框，显示哪一个tabs标签
        form: {
          sourceId: '',
          subjectId: '',
          levelId: '',
          tableEnName: '',
          tableCnName: '',
          description: '',
          status: '',
          // 可变部分（后面加入）
          storageFormat: '',
          isCompress: '',
          bucketsColumn: '',
          bucketsNum: '',
          partitionColumn: '',
          partitionRange: ''
        },
        // 加入部分
        aStorageFormatLists: [],
        aIsCompressLists: [
          {
            "label": "是",
            "value": "1"
          },
          {
            "label": "否",
            "value": "0"
          }
        ],
        dataBaseType: false, // 数据库类型
        aSchemaLists: [], // 数据库
        aLevelLists: [], // 层次
        aSubjectLists: [], // 主题
        modelId: this.$route.params.id,
        // 状态
        statusList: [{ id: '0', name: '未发布' }, { id: '1', name: '已发布' }],
        isEdit: this.$route.params.isEditNum,

        addDataSourceForm: {
          sourceName: '',
          sourceDesc: '',
          dbType: '',
          sourceType: '' // 数据源类型
        },
        tableData: [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }],
        // 字段类型
        aFieldTypeLists: [],
        // 长度，精度
        length: 0,
        length2: 0,
        addLevelForm: {
          code: '',
          name: ''
        },
        addThemeForm: {
          code: '',
          name: ''
        },
        bFieldInfoIsDisabled: true, // 初始化时，字段信息的tab不显示（只有在数据库的下拉框选择值时，才显示）
        // 对话框是否可见
        bDataSourceVisible: false,
        bLevelVisible: false,
        bThemeVisible: false,
        bShowTree: false, // 参考标准对话框是否显示
        dataSourceWidth: '100px',

        // 字段信息
        columnInfos: [],
        tableFromData: {
          columnMap: [
            {
              columnCnName: '',
              columnEnName: '',
              defaultValue: '',
              description: '',
              isPk: false,
              isNull: false,
              length: 0,
              precision: 0,
              refStandardId: '',
              typeCode: '',
              refStandardCode: ''
            }
          ]
        },
        temporary: [
          {
            columnCnName: '',
            refStandardId: '',
            columnEnName: '',
            typeCode: '',
            length: 0,
            precision: 0,
            isPk: false,
            isNull: false,
            defaultValue: '',
            description: '',
            refStandardCode: ''
          }
        ],
        /* 新增数据库 - 参数信息*/
        num: {
          num1: 0,
          num2: 0
        },
        hostName: null,
        schemaName: null,
        schemaTypeName: null,
        sourceTypes: [{ name: '真实', val: '1' }, { name: '虚拟', val: '0' }], // 数据源类型
        baseTypes: [], // 数据库类型
        isMustFill: true,
        isTest: false, // 是否已有连接测试
        isTestSuccess: false, // 是否测试成功

        bIsSelectSourceType: true, // 初始化时，参数信息的tab不显示
        argumentMessage: {// 必填参数信息
          host: null,
          port: null,
          schema: null,
          connType: null,
          username: null,
          password: null
        },
        argumentMessage1: {// 非必填参数信息
          host: null,
          port: null,
          schema: null,
          connType: null,
          username: null,
          password: null
        },
        argumentRuleValidate: {// 必填参数信息表单验证
          host: [
            { required: true, message: '请填写地址', trigger: 'blur' }
          ],
          port: [
            { required: true, message: '请填写端口', trigger: 'blur' }
          ],
          schema: [
            { required: true, message: '请填写数据库', trigger: 'blur' }
          ],
          connType: [
            { required: true, message: '请选择数据库', trigger: 'change' }
          ],
          username: [
            { required: true, message: '请填写用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' }
          ]
        },
        links: [{ NAME: 'SID', ID: 'SID' }, { NAME: 'Service Name', ID: 'Service Name' }],

        rulesDataSource: {
          sourceName: [
            { required: true, message: '请输入数据源名称', trigger: 'blur' }
          ],
          sourceType: [
            { required: true, message: '请选择数据源类型', trigger: 'change' }
          ],
          dbType: [
            { required: true, message: '请选择数据库类型', trigger: 'change' }
          ]
        },
        rulesLevel: {
          code: [
            { required: true, message: '请输入层次代码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入层次名称', trigger: 'blur' }
          ]
        },
        rulesTheme: {
          code: [
            { required: true, message: '请输入主题代码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入主题名称', trigger: 'blur' }
          ]
        },
        formRules: {
          sourceId: [
            { required: true, message: '请选择数据库', trigger: 'change' }
          ],
          levelId: [
            { required: true, message: '请选择层次', trigger: 'change' }
          ],
          subjectId: [
            { required: true, message: '请选择主题', trigger: 'change' }
          ],
          tableCnName: [
            { required: true, message: '请输入物理表英文名', trigger: 'blur' }
          ],
          tableEnName: [
            { required: true, message: '请输入物理表中文名', trigger: 'blur' }
          ]
        },
        lastFormsourceType: '', // 上一次的数据库类型，切换的数据库和原数据库类型不一致则清空字段信息
        columnMapMust: {
          columnEnName: [
            { required: true, message: '请输入字段英文名', trigger: 'blur' }
          ],
          typeCode: [{ required: true, message: '请选择类型', trigger: 'change' }]
        }
      }
    },
    watch: {
      // 监听数据库下拉框值的变化，显示字段信息的tab
      'form.sourceId': function (val) {
        console.log(val)
        this.bFieldInfoIsDisabled = false // 属性disabled的值为false时，显示字段信息的tab
      },
      // 监听数据库类型下拉框值的变化，显示参数信息的tab
      num: {
        handler: function (val) {
          console.log(val)
          if (val.num1 > 0 && val.num2 > 0) {
            this.bIsSelectSourceType = false;
          }
        },
        deep: true
      },
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },

    methods: {
      renderContent(h, params) {
        // console.log("111", params)
        let sText = params.data.nodeName;
        // let iconType = "icon icon-Context"
        let iconType = "icon icon-" + params.data.classifierId;
        // if (params.data.notetype === "metadata") {
        // // sText = this.bShowCode === true ? params.data.code : params.data.name
        //   iconType = "icon icon-" + params.data.classifierId;
        // } else {
        //   iconType = "icon icon-" + params.data.notetype;
        // }
        if (params.data.entity === "T") {
          iconType = "icon icon-Entity";
        }
        // if (params.data.nodeName === "主数据标准") {
        //   iconType = "icon icon-Parent_MasterData"
        // }
        return h(
          "span",
          {
            class: "tree-node"
          },
          [
            h(
              "span",
              {
                class: iconType,
                style: {
                  marginRight: "4px",
                  width: "16px",
                  height: "16px",
                  backgroundSize: "16px 16px"
                }
              },
              params.data.text === "查看更多" ? "<<" : ""
            ),
            h("span", sText)
          ]
        );
      },
      // 参考标准修改后的相关函数
      masterDataCatClear() {
        this.searchForm.masterDataCatId = ""
        this.getMDInfo()
      },
      handleMDNodeClick(data, node, resolve) {
        console.log("data, node, resolve", data, node, resolve)
        this.searchForm.masterDataCat = data.nodeName
        this.searchForm.masterDataCatId = data.nodeId
        this.getMDInfo()
      },
      // 获取主数据目录树数据
      getMasterTreeData() {
        get('/mod/model/listRefStandardDirs').then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.masterTreeData = res.data
            }
          })
        })
      },
      getMDInfo() {
        let pamars = {
          dirId: this.searchForm.masterDataCatId,
          keyword: this.searchForm.masterDataKey,
          pageCurrent: this.masterDataSelect.oPage.pageCurrent,
          pageSize: this.masterDataSelect.oPage.pageSize
        }
        get('/mod/model/listRefStandards', pamars).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.masterDataSelect.tableData = res.data.records
              this.masterDataSelect.oPage.total = res.data.total
            }
          })
        })
      },
      clickMDTable(row) {
        this.currentRowFlag = true
        if (!this.masterDataSelect.tagList.includes(row)) {
          this.masterDataSelect.tagList.splice(0, 1, row);
        }
        this.referenceData.choiceTreeNodeText = row.name
        this.referenceData.instanceId = row.id
        this.referenceData.instanceCode = row.code
        this.referenceData.instanceEnName = row.acronym
        this.referenceData.instanceCnName = row.name
        this.referenceData.classifierId = row.classifierId
        this.referenceData.description = row.name
      },
      closeMDTag(item, index) {
        this.currentRowFlag = false
        this.masterDataSelect.tagList.splice(index, 1);
        this.referenceData.choiceTreeNodeText = ""
        this.referenceData.instanceId = ""
        this.referenceData.instanceCode = ""
        this.referenceData.instanceEnName = ""
        this.referenceData.instanceCnName = ""
        this.referenceData.classifierId = ""
        this.referenceData.description = ""
      },
      handleSizeChangeMD(val) {
        this.masterDataSelect.oPage.pageSize = val
        this.getMDInfo()
      },
      handleCurrentChangeMD(val) {
        this.masterDataSelect.oPage.pageCurrent = val
        this.getMDInfo()
      },
      goMDDetail (item) {
        this.$router.push({
          name: "masterDataDetails",
          params: {
            id: item.id,
            classifierId: item.classifierId,
            _title: item.name,
            headerTitle: item.name
          }
        });
      },

      gorefStandardDetail(row) {
        this.$router.push({
          name: "masterDataDetails",
          params: {
            id: row.refStandardId,
            classifierId: row.refStandardClassifierId,
            _title: row.refStandardName,
            headerTitle: row.refStandardName
          }
        });
      },
      // 分桶数change
      bucketsNumChange(value) {
        console.log("bucketsNumChange", value, this.form.bucketsNum)
      },
      isActive(route) {
        return route.path === this.$route.path
      },
      closeSelectedTag(view) {
        this.$store.dispatch('delVisitedViews', view).then((views) => {
          if (this.isActive(view)) {
            let latestView = null
            views.map(val => {
              if (val.name === 'physicalModel') {
                latestView = val
              }
            })
            if (latestView) {
              this.$router.push(latestView)
            } else {
              this.$router.push('/model/physicalModel')
            }
          }
        })
      },
      // 获取Hive数据库的存储格式
      getListHiveStorageFormats() {
        get('/mod/model/listHiveStorageFormats').then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.aStorageFormatLists = res.data
            }
          })
        })
      },
      // 获取数据库下拉列表信息  /mod/model/listAllDatasource todo 数据库、层次、主题，其他页面也在使用，可以使用vuex状态管理
      getListAllDatasource() {
        get('/mod/model/listAllDatasource', {}).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.aSchemaLists = res.data
            }
          })
        })
      },
      // 获取层次下拉列表信息 /mod/model/listAllLevel
      getListAllLevel() {
        get('/mod/model/listAllLevel', {}).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.aLevelLists = res.data
            }
          })
        })
      },
      // 获取主题下拉列表信息 /mod/model/listAllSubject
      getListAllSubject() {
        get('/mod/model/listAllSubject', {}).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.aSubjectLists = res.data
            }
          })
        })
      },
      // 获取数据库类型  /sys/datasource/listDataSourceTypes
      getListDataSourceTypes() {
        get('/sys/datasource/listDataSourceTypes').then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.baseTypes = res.data
            }
          })
        })
      },
      // 字段信息 - 获取字段类型列表 /mod/model/listColumnTypes
      getListColumnTypes() {
        get('/mod/model/listColumnTypes', {
          sourceId: this.form.sourceId // 数据源ID
        }).then((res) => {
          console.log(res)
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.aFieldTypeLists = res.data
            }
          })
        })
      },
      // 获取模型详情
      getModelDetails() {
        get('/mod/model/getModelDetailInfo', {
          modelId: this.$route.params.id // 模型ID
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.form.sourceId = res.data.sourceId
              this.form.subjectId = res.data.subjectId
              this.form.levelId = res.data.levelId
              this.form.tableEnName = res.data.tableEnName
              this.form.tableCnName = res.data.tableCnName
              this.form.description = res.data.description
              this.form.status = res.data.status
              this.tableFromData.columnMap = res.data.columnInfos.records
              this.tableFromData.columnMap.map(item => {
                if (item.isNull === "0") {
                  item.isNull = false
                } else {
                  item.isNull = true
                }
                if (item.isPk === "0") {
                  item.isPk = false
                } else {
                  item.isPk = true
                }
              })
              this.temporary = res.data.columnInfos.records
              this.total = this.columnInfos.total
              this.getListColumnTypes()
              // 根据数据库ID找数据库类型
              this.aSchemaLists.map(item => {
                if (item.sourceId === res.data.sourceId) {
                  this.lastFormsourceType = item.dbType
                }
              })
              // this.aSchemaLists.map(item => {
              //   if (item.sourceId === res.data.sourceId) {
              //     this.dataBaseType = item.dbType
              //   }
              // })
              // if (this.columnInfos.records.length > 0) {
              //   this.total = this.columnInfos.total
              // }
              if (res.data.exts.length > 0) {
                this.dataBaseType = true
                this.formRules.storageFormat = [
                  { required: true, message: "请选择存储格式", trigger: "change" }
                ];
                res.data.exts.map((item, index) => {
                  if (item.extKey === "BUCKET_COLUMN") {
                    this.form.bucketsColumn = item.extValue
                  }
                  if (item.extKey === "STORAGE_FORMAT") {
                    this.form.storageFormat = item.extValue
                  }
                  if (item.extKey === "IS_COMPRESS") {
                    this.form.isCompress = item.extValue
                  }
                  if (item.extKey === "BUCKET_NUMBER") {
                    this.form.bucketsNum = item.extValue
                  }
                  if (item.extKey === "PARTITION_COLUMN") {
                    this.form.partitionColumn = item.extValue
                  }
                  if (item.extKey === "PARTITION_SCOPE") {
                    this.form.partitionRange = item.extValue
                  }
                })
              } else {
                this.dataBaseType = false
              }
            }
          })
        })
      },

      // 新增物理表  /mod/model/createModel
      postCreateModel() {
        this.$refs.formRules.validate(valid => {
          if (valid) {
            let columnInfos = this.tableFromData.columnMap.map((item, index) => {
              item.length = item.length !== undefined ? item.length + '' : ''
              item.precision = item.precision !== undefined ? item.precision + '' : ''
              item.isPk = item.isPk === false ? "0" : "1"
              item.isNull = item.isNull === false ? "0" : "1"
              item.orderNo = index + 1
              return item
            })
            let exts = [
              {
                "extKey": "STORAGE_FORMAT",
                "extValue": this.form.storageFormat
              },
              {
                "extKey": "IS_COMPRESS",
                "extValue": this.form.isCompress
              },
              {
                "extKey": "BUCKET_COLUMN",
                "extValue": this.form.bucketsColumn
              },
              {
                "extKey": "BUCKET_NUMBER",
                "extValue": this.form.bucketsNum
              },
              {
                "extKey": "PARTITION_COLUMN",
                "extValue": this.form.partitionColumn
              },
              {
                "extKey": "PARTITION_SCOPE",
                "extValue": this.form.partitionRange
              }
            ]
            let pamaras = {
              columnInfos: columnInfos,
              sourceId: this.form.sourceId, // 数据源ID
              levelId: this.form.levelId, // 层次ID
              subjectId: this.form.subjectId, // 主题ID subjectId
              tableEnName: this.form.tableEnName, // 物理表英文名
              tableCnName: this.form.tableCnName, // 物理表中文名
              description: this.form.description // 说明
            }
            if (this.dataBaseType) {
              pamaras.exts = exts
            }
  
            this.$refs.columnMapMust.validate(valid => {
              if (valid) {
                postByJson('/mod/model/createModel', pamaras).then((res) => {
                  parseAjaxResponse(res, () => {
                    if (res.code === 10000) {
                      this.$message.success(res.message)
                      this.closeSelectedTag(this.$route)
                    }
                  })
                })
              } else {
                this.$message.warning("请填写字段必填信息")
                this.activeName = "second"
              }
            })
          } else {
            this.$message.warning("请填写基本信息必填项")
            this.activeName = "first"
          }
        })
      },
      // 修改物理表 /mod/model/editModel
      postEditModel() {
        this.$refs.formRules.validate(valid => {
          if (valid) {
            let columnInfos = this.tableFromData.columnMap.map((item, index) => {
              item.length = item.length !== undefined ? item.length + '' : ''
              item.precision = item.precision !== undefined ? item.precision + '' : ''
              item.isPk = item.isPk === false ? "0" : "1"
              item.isNull = item.isNull === false ? "0" : "1"
              item.orderNo = index + 1
              return item
            })
            // console.log("this.modelId", this.modelId)
            let pamaras = {
              columnInfos: columnInfos,
              sourceId: this.form.sourceId, // 数据源ID
              levelId: this.form.levelId, // 层次ID
              subjectId: this.form.subjectId, // 主题ID subjectId
              tableEnName: this.form.tableEnName, // 物理表英文名
              tableCnName: this.form.tableCnName, // 物理表中文名
              description: this.form.description, // 说明
              modelId: this.modelId
            }
            let exts = []
            if (this.dataBaseType) {
              exts = [
                {
                  "extKey": "STORAGE_FORMAT",
                  "extValue": this.form.storageFormat
                },
                {
                  "extKey": "IS_COMPRESS",
                  "extValue": this.form.isCompress
                },
                {
                  "extKey": "BUCKET_COLUMN",
                  "extValue": this.form.bucketsColumn
                },
                {
                  "extKey": "BUCKET_NUMBER",
                  "extValue": this.form.bucketsNum
                },
                {
                  "extKey": "PARTITION_COLUMN",
                  "extValue": this.form.partitionColumn
                },
                {
                  "extKey": "PARTITION_SCOPE",
                  "extValue": this.form.partitionRange
                }
              ]
            }
            pamaras.exts = exts
  
            this.$refs.columnMapMust.validate(valid => {
              if (valid) {
                postByJson('/mod/model/editModel', pamaras).then((res) => {
                  parseAjaxResponse(res, () => {
                    if (res.code === 10000) {
                      this.$message.success(res.message)
                      this.closeSelectedTag(this.$route)
                    }
                  })
                })
              } else {
                this.$message.warning("请填写字段必填信息")
                this.activeName = "second"
              }
            })
          } else {
            this.$message.warning("请填写基本信息必填项")
            this.activeName = "first"
          }
        })
      },
      // 测试连接
      goTest() {
        get("/sys/datasource/testConnection", {
          connType: this.argumentMessage.connType, // 连接类型
          dbType: this.addDataSourceForm.dbType, // DB类型
          host: this.argumentMessage.host, // 主机
          password: this.argumentMessage.password, // 密码
          port: this.argumentMessage.port, // 端口
          schema: this.argumentMessage.schema, // 数据库
          username: this.argumentMessage.username // 用户名
        }).then(res => {
          if (res.code === 10000) {
            if (res.data) {
              this.$message.success("测试连接成功");
              this.isTestSuccess = true
              this.isTest = true
            } else {
              this.$message.error("测试连接失败");
              this.isTestSuccess = false
              this.isTest = true
            }
          } else {
            this.$message.error(res.message);
            this.isTestSuccess = false
            this.isTest = true
          }
        });
      },
      // 新建数据源接口 /sys/datasource/createDataSourceInfos
      postCreateDataSourceInfos() {
        this.$refs.rulesDataSource.validate(valid => {
          if (valid) {
            if (this.isMustFill) {
              this.$refs.argumentRuleValidate.validate(valid => {
                if (valid) {
                  let params = []
                  let { entries } = Object;
                  for (let [key, value] of entries(this.argumentMessage)) {
                    let obj = {
                      paramName: '',
                      paramValue: ''
                    }
                    obj.paramName = key
                    obj.paramValue = value
                    params.push(obj)
                  }
                  if (this.isTest && this.isTestSuccess) {
                    this.saveSource(params)
                  } else {
                    this.$message.warning("真实数据源请先测试连接!");
                  }
                } else {
                  this.addDataSrcActiveName = "second";
                  this.$message.warning("请填写必填项!");
                }
              })
            } else {
              let params = []
              let { entries } = Object;
              for (let [key, value] of entries(this.argumentMessage1)) {
                let obj = {
                  paramName: '',
                  paramValue: ''
                }
                obj.paramName = key
                obj.paramValue = value
                params.push(obj)
              }
              this.saveSource(params)
            }
          } else {
            this.addDataSrcActiveName = "first";
            this.$message.warning("请填写必填项!");
          }
        })
      },
      saveSource(params) {
        postByJson('/sys/datasource/createDataSourceInfos', {
          dbType: this.addDataSourceForm.dbType,
          params: params,
          sourceDesc: this.addDataSourceForm.sourceDesc,
          sourceId: null,
          sourceName: this.addDataSourceForm.sourceName,
          sourceType: this.addDataSourceForm.sourceType
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.bDataSourceVisible = false
              this.$message.success(res.message)
              this.getListAllDatasource() // (刷新) 获取数据库下拉列表信息
            }
          })
        })
      },
  
      //   let params = []
      //   let { entries } = Object;
      //   for (let [key, value] of entries(this.argumentMessage)) {
      //     let obj = {
      //       paramName: '',
      //       paramValue: ''
      //     }
      //     obj.paramName = key
      //     obj.paramValue = value
      //     params.push(obj)
      //   }
      //   postByJson('/sys/datasource/createDataSourceInfos', {
      //     dbType: this.addDataSourceForm.dbType,
      //     params: params,
      //     sourceDesc: this.addDataSourceForm.sourceDesc,
      //     sourceId: null,
      //     sourceName: this.addDataSourceForm.sourceName,
      //     sourceType: this.addDataSourceForm.sourceType
      //   }).then((res) => {
      //     parseAjaxResponse(res, () => {
      //       if (res.code === 10000) {
      //         this.bDataSourceVisible = false
      //         this.$message.success(res.message)
      //         this.getListAllDatasource() // (刷新) 获取数据库下拉列表信息
      //       }
      //     })
      //   })
      // },

      // 新增层次接口
      getCreateLevel() {
        post('/mod/level/createLevel', {
          levelId: null,
          levelCode: this.addLevelForm.code,
          levelName: this.addLevelForm.name
        }).then((res) => {
          if (res.code === 10000) {
            this.$message.success(res.message)
            this.getListAllLevel() // 获取层次下拉列表信息
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 新增主题接口
      getCreateSubject() {
        post('/mod/subject/createSubject', {
          subjectId: null,
          subjectCode: this.addThemeForm.code,
          subjectName: this.addThemeForm.name
        }).then((res) => {
          console.log(res)
          if (res.code === 10000) {
            this.$message.success(res.message)
            this.getListAllSubject() // 获取主题下拉列表信息
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 新增数据源 - 保存按钮
      saveDataSource() {
        this.postCreateDataSourceInfos()
        // this.bDataSourceVisible = false
      },
      // 新增层次、主题 - 保存按钮
      saveLevelOrTheme(str) {
        if (str === 'level') {
          this.$refs['addLevelForm'].validate((valid) => {
            if (valid) {
              // 调用新增层次接口
              this.getCreateLevel()
              this.bLevelVisible = false
              // 为提交按钮，设置disabled状态: true禁用
              this.saveBtnIsDisabled = true
            } else {
              this.$message.warning('请按规则填写信息')
              return false;
            }
          });
        } else if (str === 'subject') {
          this.$refs['addThemeForm'].validate((valid) => {
            if (valid) {
              // 调用新增主题接口
              this.getCreateSubject()
              this.bThemeVisible = false
              // 为提交按钮，设置disabled状态: true禁用
              this.saveBtnIsDisabled = true
            } else {
              this.$message.warning('请按规则填写信息')
              return false;
            }
          });
        }
      },

      // 基本信息-数据库下拉框值改变
      baseInfoSchemaChange(val) {
        this.getListColumnTypes()
        this.aSchemaLists.map(item => {
          if (item.sourceId === val) {
            if (item.dbType === "CDH(HIVE)" || item.dbType === "TDH") {
              this.dataBaseType = true
              this.formRules.storageFormat = [
                { required: true, message: "请选择存储格式", trigger: "change" }
              ];
            } else {
              this.dataBaseType = false
            }
            // 如果修改的时候切换的数据库和原数据库类型不一致则清空字段信息
            if (item.dbType === this.lastFormsourceType) {
              this.lastFormsourceType = item.dbType
            } else {
              // this.$message.warning('已切换至不同类型数据库，需重新填写字段信息')
              this.tableFromData.columnMap = [
                {
                  columnCnName: '',
                  columnEnName: '',
                  defaultValue: '',
                  description: '',
                  isPk: false,
                  isNull: false,
                  length: 0,
                  precision: 0,
                  refStandardId: '',
                  typeCode: '',
                  refStandardCode: ''
                }
              ]
              this.temporary = [
                {
                  columnCnName: '',
                  refStandardId: '',
                  columnEnName: '',
                  typeCode: '',
                  length: 0,
                  precision: 0,
                  isPk: false,
                  isNull: false,
                  defaultValue: '',
                  description: '',
                  refStandardCode: ''
                }
              ]
              this.lastFormsourceType = item.dbType
            }
          }
        })
      },
      /* 字段信息 值改变时监听函数 */
      handleClick(tab, event) {
        console.log(tab, event);
      },
      // 字段中文名/字段英文名/字段类型/长度/精度/是否主键/是否可空/默认值/描述 改变
      handleChange(scope, str) {
        // console.log(scope);
        // console.log(str);
        let index = scope.$index
        this.temporary[index][str] = scope.row[str]
        // console.log(this.temporary);
      },
      // 字段英文名不能为空
      columnEnNameBlur(row) {
        if (row.columnEnName === '') {
          this.$message.warning('字段英文名不能为空')
        }
      },

      // 数据源类型 改变
      typeChange(val) {
        // console.log(val);
        this.num.num1 += 1;
        this.isMustFill = val === '1';
        // this.$refs['argumentRuleValidate'].resetFields();
        // this.$refs['noMustFill'].resetFields();
      },
      // 数据库类型 改变
      schemaChange(arg) {
        if (this.bDataSourceVisible === true) {
          this.num.num2 += 1;
          this.hostName = arg === 'ORACLE' ? '主机' : '服务器地址';
          this.schemaName = arg === 'SQL_SERVER' ? '数据库/模式' : '数据库';
          this.schemaTypeName = arg;
        }
        // this.$refs['argumentRuleValidate'].resetFields();
        // this.$refs['noMustFill'].resetFields();
      },
      // 新增数据库
      addDataSource() {
        // 打开数据库对话框
        this.bDataSourceVisible = true
        this.isTest = false // 是否已有连接测试
        this.isTestSuccess = false // 是否测试成功
      },
      // 新增层次/主题
      addThemeOrLevel(name) {
        if (name === '层次') {
          // 为提交按钮，设置disabled状态: false非禁用
          this.saveBtnIsDisabled = false
          this.bLevelVisible = true // 打开层次对话框
          // 清空表单数据
          if (this.$refs['addLevelForm'] !== undefined) {
            this.$refs['addLevelForm'].resetFields();
          }
        } else if (name === '主题') {
          // 为提交按钮，设置disabled状态: false非禁用
          this.saveBtnIsDisabled = false
          // 打开主题对话框
          this.bThemeVisible = true
          // 清空表单数据
          if (this.$refs['addThemeForm'] !== undefined) {
            this.$refs['addThemeForm'].resetFields();
          }
        }
      },
      // 新增字段
      addField() {
        // 增加表格行数 - 通过改变数据实现
        let temporary = JSON.parse(JSON.stringify(this.temporary));
        console.log("temporary1111", temporary)
        let item = {
          columnCnName: '',
          refStandardId: '',
          columnEnName: '',
          typeCode: '',
          length: 0,
          precision: 0,
          isPk: false,
          isNull: false,
          defaultValue: '',
          description: '',
          refStandardCode: ''
        }
        temporary.push(item)
        this.tableFromData.columnMap = temporary
        this.temporary = temporary
      },
      // 字段行 - 向上移动
      sortUp(scope) {
        let index = scope.$index
        if (index > 0) {
          let tem = this.temporary[index - 1];
          Vue.set(this.temporary, index, tem);
          Vue.set(this.temporary, index - 1, scope.row);
          this.tableFromData.columnMap = this.temporary;
        } else {
          this.$message.warning('已经是最上了');
        }
      },
      // 字段行 - 向下移动
      sortDown(scope) {
        let index = scope.$index
        if (index < this.tableFromData.columnMap.length - 1) {
          let tem = this.temporary[index + 1];
          Vue.set(this.temporary, index, tem);
          Vue.set(this.temporary, index + 1, scope.row);
          this.tableFromData.columnMap = this.temporary;
        } else {
          this.$message.warning('已经是最下了');
        }
      },
      // 删除字段
      toDelField(scope) {
        let index = scope.$index
        this.temporary.splice(index, 1);
        this.tableFromData.columnMap = this.temporary;
      },
      // 打开参考标准对话框
      openTree(scope) {
        console.log(scope)
        this.referenceData.index = scope.$index
        this.getMasterTreeData()
        this.getMDInfo()
        this.bShowTree = true
        // refStandardId 参考标准ID
      },
      // // tree节点点击
      // handleNodeClick(node) {
      //   console.log("handleNodeClick", node)
      //   if (node.leafCount === 0) {
      //     this.referenceData.choiceTreeNodeText = node.instanceName
      //     this.referenceData.instanceId = node.instanceId
      //     this.referenceData.instanceCode = node.instanceCode
      //     this.referenceData.instanceEnName = node.instanceEnName
      //     this.referenceData.instanceCnName = node.instanceName
      //     this.referenceData.classifierId = node.classifierId
      //   }
      // },
      // renderContent(h, params) {
      //   let sText = params.data.nodeName;
      //   let iconType = "";
      //   if (params.data.leafCount > 0) {
      //     iconType = "icon icon-folder";
      //   } else {
      //     iconType = "icon icon-idcard";
      //   }
      //   return h(
      //     "span",
      //     {
      //       class: "tree-node"
      //     },
      //     [
      //       h("div", {
      //         class: iconType,
      //         style: {
      //           marginRight: "4px"
      //         }
      //       }),
      //       h("span", sText)
      //     ]
      //   );
      // },
      // tree过滤
      filterNode(value, data) {
        if (!value) return true;
        return data.instanceName.indexOf(value) !== -1;
      },
      // tree懒加载
      // loadNode(node, resolve) {
      //   if (node.level === 0) {
      //     this.node = node;
      //     this.resolve = resolve;
      //     get("/ds/listTreeInfo", {
      //       nodeId: this.sNodeId
      //     }).then(res => {
      //       if (res.code === 10000 && res.success === true) {
      //         // 判断是否是最后节点
      //         let data = res.data
      //         if (data.length) {
      //           for (let i = 0; i < data.length; i++) {
      //             data[i]['isLeaf'] = ''
      //             if (data[i]['leafCount'] === 0) {
      //               data[i]['isLeaf'] = true
      //             }
      //           }
      //         }
      //         return resolve(res.data);
      //       } else {
      //         this.$message.error(res.message);
      //       }
      //     });
      //   } else {
      //     let params = {
      //       nodeId: node.data.instanceId
      //     };
      //     get("/ds/listTreeInfo", params).then(res => {
      //       if (res.code === 10000 && res.success === true) {
      //         // 判断是否是最后节点
      //         let data = res.data
      //         if (data.length) {
      //           for (let i = 0; i < data.length; i++) {
      //             data[i]['isLeaf'] = ''
      //             if (data[i]['leafCount'] === 0) {
      //               data[i]['isLeaf'] = true
      //             }
      //           }
      //         }
      //         return resolve(res.data);
      //       } else {
      //         this.$message.error(res.message);
      //       }
      //     });
      //   }
      // },
      // 跳转到标准详情页面
      // toStandardDetailsPage() {
      //   this.bShowTree = true // 参考标准tree 不关闭
      //   let params = {
      //     id: this.referenceData.instanceId,
      //     _title: this.referenceData.instanceCnName,
      //     name: this.referenceData.instanceCnName
      //   }
      //   if (this.referenceData.classifierId.includes("BizTermInfoItem")) {
      //     this.$router.push({
      //       name: "professionalDetail",
      //       params: params
      //     })
      //   }
      //   if (this.referenceData.classifierId.includes("CalculateIndexInfoItem") || this.referenceData.classifierId.includes("Parent_RuleIndex") || this.referenceData.classifierId.includes("BaseIndexInfoItem") || this.referenceData.classifierId.includes("DeriveIndexInfoItem")) {
      //     this.$router.push({
      //       name: "indexManagementDetails",
      //       params: {
      //         id: this.referenceData.instanceId,
      //         classifierId: this.referenceData.classifierId,
      //         _title: this.referenceData.instanceCnName
      //       }
      //     })
      //   }
      //   if (this.referenceData.classifierId.includes("RuleInfoItem")) {
      //     this.$router.push({
      //       name: "ruleDetail",
      //       params: { id: this.referenceData.instanceId,
      //         _title: this.referenceData.instanceCnName, row: '' }
      //     });
      //   }
      //   if (this.referenceData.classifierId.includes("DimentsionItem")) {
      //     this.$router.push({
      //       name: "dimensionDetails",
      //       params: {
      //         id: this.referenceData.instanceCnName,
      //         _title: this.referenceData.instanceCnName,
      //         detailId: this.referenceData.instanceId,
      //         row: ""
      //       }
      //     });
      //   }
      //   if (this.referenceData.classifierId.includes("MasterDataInfoItem")) {
      //     this.$router.push({
      //       name: "masterDataDetails",
      //       params: {
      //         id: this.referenceData.instanceId,
      //         classifierId: this.referenceData.classifierId,
      //         _title: this.referenceData.instanceCnName,
      //         headerTitle: this.referenceData.instanceCnName
      //       }
      //     });
      //   }
      // },
      // tree 参考标准 - 保存
      saveTree() {
        this.bShowTree = false
        let index = this.referenceData.index
        this.tableFromData.columnMap[index].columnCnName = this.referenceData.instanceCnName;
        this.temporary[index].columnCnName = this.referenceData.instanceCnName;
        this.tableFromData.columnMap[index].refStandardId = this.referenceData.instanceId;
        this.temporary[index].refStandardId = this.referenceData.instanceId;
        this.tableFromData.columnMap[index].refStandardCode = this.referenceData.instanceCode;
        this.temporary[index].refStandardCode = this.referenceData.instanceCode;
        this.tableFromData.columnMap[index].columnEnName = this.referenceData.instanceEnName;
        this.temporary[index].columnEnName = this.referenceData.instanceEnName;
        this.tableFromData.columnMap[index].description = this.referenceData.description;
        this.temporary[index].description = this.referenceData.description;
        this.closeMDTag("", 0)
      },
      // 关闭参考标准 tag
      closeTag(scope) {
        // 清空 字段中文名、字段英文名、参考标准code值
        let index = scope.$index
        this.tableFromData.columnMap[index].columnCnName = '';
        this.temporary[index].columnCnName = '';
        this.tableFromData.columnMap[index].refStandardId = '';
        this.temporary[index].refStandardId = '';
        this.tableFromData.columnMap[index].columnEnName = '';
        this.temporary[index].columnEnName = '';
        this.tableFromData.columnMap[index].refStandardCode = '';
        this.temporary[index].refStandardCode = '';
      },

      // 保存
      toSaveModel() {
        if (this.modelId === 0) {
          this.postCreateModel()
        } else {
          this.postEditModel()
        }
      }
    },
    created() {
      this.getListAllDatasource()
      this.getListAllLevel()
      this.getListAllSubject()
      this.getListDataSourceTypes()
      this.getListHiveStorageFormats()
      if (this.$route.params.id !== 0) {
        this.getModelDetails() // 修改时，获取物理表详情
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "../../styles/treeIcon";
   .reMd-tree {
            .el-tree-node__content {
              height: 30px;
              line-height: 30px;
              font-size: 14px;
            }
            .tree-node .icon {
              display: inline-block;
              position: relative;
              top: 4px;
              margin-right: 4px;
            }
            .tree-node .icon-more {
              position: relative;
              left: 1px;
              top: -1px;
            }
          }
  .onlyOption{
    font-weight: 500!important;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  // @import "../../styles/treeIcon";
  //外层card容器样式
  @import './../../styles/dq/main-card-table.scss';

  .new-physical-model{
    //保存按钮
    .save{
      position: absolute;
      top: 25px;
      right: 28px;
      z-index: 10; //不加的话，hover时按钮没有颜色变化
    }

    //tooltip样式
    .tooltip{
      position: absolute;
      top: 9px;
      margin-left: 10px;
      cursor: pointer;
    }

    .bubble-icon{
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url(../../../src/assets/images/commonIcon/tip.png) no-repeat;
      background-size: 100%;
    }

    //box组的样式
    .btn-box {
      /*border-bottom: 1px solid #e8eaec;*/
      /*padding-bottom: 20px;*/
    }
    .btn-box button {
      position: relative;
      padding-left: 35px;
      margin-right: 8px;
    }
    .btn-box .btn-box-icon {
      position: absolute;
      display: inline-block;
      width: 20px;
      height: 20px;
      left: 10px;
      top: 6px;
    }
    .btn-box .add {
      background: url(../../../src/assets/images/commonIcon/add.png) no-repeat;
      background-size: 100%;
    }

    //表格中-参考标准样式
    .btn-dashed {
      /*color: #515a6e;*/
      background-color: #fff;
      border-color: #dcdee2;
      border-style: dashed;
    }
    .btn-dashed:hover{
      border-color: #409EFF;
    }
    .el-button--small.btn-dashed{
      padding: 5px 9px;
    }

    //表格中操作图标
    .operation-icon{
      i{
        font-size: 20px;
        cursor: pointer;
      }
    }

    //参考标准搜索框
    .iptSearch{
      /deep/ .el-icon-search{
        cursor: pointer;
      }
    }

    //已选择box
    .choice-box{
      text-align: left;
      line-height: 32px;
      color: #7e7e7e;
      font-size: 16px;
      font-weight: bold;
      .content{
        color: #2d8cf0;;
        cursor: pointer;
      }
      button{
        float: right;
      }
    }

    //参数信息
    /deep/ .el-dialog__wrapper .el-dialog{
      width: 660px;
    }
    .test-box {
      text-align: center;
      margin-top: 90px;
    }
    .test-box button {
      position: relative;
      padding-left: 35px;
    }
    .test-box .test {
      background: url(../../../src/assets/images/commonIcon/link-test.png) no-repeat;
      background-size: 100%;
    }
    .test-box .btn-box-icon {
      position: absolute;
      display: inline-block;
      width: 19px;
      height: 19px;
      left: 10px;
      top: 5px;
    }

    // //参考信息 tree
    // /deep/ .tree-node .icon {
    //   display: inline-block;
    //   position: relative;
    //   top: 0px;
    //   margin-right: 4px;
    // }
    // /deep/ .tree-node .icon-folder {
    //   position: relative;
    //   display: block;
    //   float: left;
    //   width: 16px;
    //   height: 16px;
    //   background: url("/src/icons/commonIcon/icon-file.png") no-repeat;
    //   background-size: 100% 100%;
    // }
  }
</style>
