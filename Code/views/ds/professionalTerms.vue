<!--业务术语页面-->
<template>
  <div class="professionalTerms-box tableNoPadding" @click.capture="clickBox">
    <div class="content-box">
      <el-container>
        <el-aside width="20%" class="leftdiv">
          <!--右键tree节点，显示的菜单box-->
          <div class="context-menu" ref="rightMenu" v-show="showMenu">
            <el-card>
              <el-row v-show="EditDeltShow" @click.native="getCatalogDetail(false)">详细信息</el-row>
              <el-row v-permission="'TERM_ADD_CATALOG'" @click.native="toAddCatalog">新建目录</el-row>
              <el-row
                v-permission="'TERM_EDIT_CATALOG'"
                v-show="EditDeltShow"
                @click.native="toEditCatalog"
              >修改目录</el-row>
              <el-row
                v-permission="'TERM_DEL_CATALOG'"
                v-show="EditDeltShow"
                @click.native="showDeleteDialog"
              >删除目录</el-row>
              <el-row v-permission="'TERM_ADVANCED_SEARCH'" v-show="EditDeltShow">高级搜索</el-row>
              <el-row v-permission="'TERM_IMPORT'" v-show="EditDeltShow">导入标准</el-row>
              <el-row v-permission="'TERM_EXPORT'" v-show="EditDeltShow">导出标准</el-row>
            </el-card>
          </div>
          <div class="left-box">
            <el-card shadow="hover">
              <div class="title">
                <span>目录</span>
                <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                  <el-button size="small" type="text" :loading="refreshload" icon="el-icon-refresh" @click="refreshTree(node)" style="color:#606266;font-size:20px;"></el-button>
                </el-tooltip>
              </div>
              <div class="md-tree" v-loading="treeLoading">
                <el-tree
                  :props="defaultProps"
                  accordion
                  :load="loadNode"
                  node-key="id"
                  :default-expanded-keys="aIsExpandedArr"
                  :default-checked-keys="aIsExpandedArr"
                  ref="tree"
                  lazy
                  highlight-current
                  empty-text="暂无数据"
                  @node-click="handleNodeClick"
                  @node-expand="handleNodeClick"
                  @node-collapse="handleNodeClick"
                  @node-contextmenu="handleMouseRight"
                  :render-content="renderContent"
                ></el-tree>
              </div>
              <div class="view-filter">
                <span class="tl">视图切换</span>
                <el-select v-model="sViewId" placeholder="请选择" size="small" @change="changeView" style="width:120px">
                  <el-option
                    v-for="item in aViewDataList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </el-card>
          </div>
        </el-aside>
        <el-aside
          style="background-color:#000;position:relative;height:100%;width: 4px;opacity:0;"
          @mousedown.native.prevent="dragControllerDiv($event)"
          class="resize"
        ></el-aside>
        <el-main>
          <div class="right-box">
            <el-card shadow="hover" v-show="showComponent==='card' || showComponent==='cardMain'">
              <div>
                <div class="tTitle">
                  <i class="bread-icon"></i>
                  <el-breadcrumb class="bIcon">
                    <el-tooltip
                      placement="top"
                      v-for="( item, index ) in Breadcrumb"
                      :key="index"
                      :disabled="item.isDisabled"
                      :content="item.tipValue"
                    >
                      <el-breadcrumb-item
                        :key="index"
                        @click.native="toClickBreadcrumb(item)"
                      >{{item.name}}</el-breadcrumb-item>
                    </el-tooltip>
                  </el-breadcrumb>
                  <el-tooltip class="item" effect="dark" content="自定义表头" placement="top">
                    <svg-icon
                      @click.native="definitionList"
                      class="definition-list"
                      icon-class="icon-definitionList"
                    ></svg-icon>
                  </el-tooltip>
                </div>
                <el-row>
                  <el-col :span="12">
                    <div class="btn-box">
                      <el-button type="primary" size="mini" class="btn add" @click="goAdd()">
                        <svg-icon icon-class="zengjia"></svg-icon>
                        <span class="btn-text">新增</span>
                      </el-button>
                      <el-button type="primary" size="mini" class="btn" @click="refreshData()">
                        <svg-icon icon-class="shuaxin"></svg-icon>
                        <span class="btn-text">刷新</span>
                      </el-button>
                      <el-dropdown @command="handleCommand" class="blood-ana">
                        <el-button
                          class="btn"
                          style="width: 76px;padding-left: 20px;height: 31px;"
                          type="primary"
                        >
                          <i class="dataTable-icon blood"></i>
                          <span class="btn-text">关系</span>
                        </el-button>
                        <el-dropdown-menu slot="dropdown" trigger="click" style="width: 76px;text-align:center;">
                          <el-dropdown-item :command="'backward'">参 考</el-dropdown-item>
                          <el-dropdown-item :command="'forward'">应 用</el-dropdown-item>
                          <el-dropdown-item :command="'full'">全 链</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="search">
                      <el-form :model="searchForm" label-width="10" inline size="mini">
                        <el-form-item label class="select-box">
                          <el-select
                            v-model="searchForm.isPublish"
                            size="mini"
                            placeholder="请选择搜索分类"
                          >
                            <el-option
                              v-for="(item,index) in isPublishStateList"
                              :key="index"
                              :label="item.label"
                              :value="item.prop"
                              align="center"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label>
                          <el-input
                            placeholder="请输入..."
                            clearable
                            v-model.trim="searchForm.keyword"
                            @keyup.enter.native="searchTableList"
                          >
                            <i
                              slot="suffix"
                              class="el-input__icon el-icon-search"
                              @click="searchTableList"
                            ></i>
                          </el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                  </el-col>
                </el-row>
                <div class="table-box" v-loading="tableLoading" >
                  <el-table
                    ref="table"
                    border
                    size="mini"
                    :data="tableData"
                    style="width: 100%;"
                    v-if="!tableLoading">
                    <el-table-column type="selection" width="40"></el-table-column>
                    <el-table-column
                      :prop="item.prop"
                      :label="item.label"
                      v-for="item in tableHeader2"
                      :key="item.prop"
                      sortable
                      :show-overflow-tooltip='showToolTip'
                      :width="item.prop==='namespace'?'240':null"
                    ></el-table-column>
                    <el-table-column label="操作" align="center" fixed="right" width="160">
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                          <el-button   
                          type="text"
                          @click="goDetail(scope.row)"
                          size="mini"
                          class="table-bt-box">
                          <svg-icon icon-class="preview" class="preview"></svg-icon>
                        </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                          <el-button   
                          type="text"
                          v-permission="'TERM_EDIT_TERMITEM'"
                          @click="clickeEit(scope.row)"
                          size="mini"
                          class="table-bt-box">
                          <svg-icon icon-class="editor" class="editor"></svg-icon>
                          </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="全链分析" placement="bottom">
                          <el-button v-permission="'MAS_EIDT_MASITEM'" type="text" @click="handleBlood2('full',scope.row)">
                            <svg-icon icon-class="multilink" class="multilink"></svg-icon>
                          </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                          <el-button @click='deleteDataShow(scope.row)' type="text" size="small" >
                            <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                          </el-button>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div style="text-align: center; padding: 20px 0 10px 0" v-if="total>0">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="icurrentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="ipageSize"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                  ></el-pagination>
                </div>
              </div>
            </el-card>
            <term-Detail :paramss="paramsForDetail" v-if="showComponent==='detailItem'" ref="itemDetail"
              @showMainDetItem="getShowChange" @handleEdit="goEdit"
            ></term-Detail>
            <catalog-detail
              ref="catalogDetail"
              v-show="showComponent==='detail'"
              @showmain="getShowChange"
              @colData="getShowChange2"
            ></catalog-detail>
          </div>
        </el-main>
      </el-container>
    </div>
    <div class="cata-dialog">
      <!--新增目录-->
      <el-dialog
        destroy-on-close
        @close="closeCatalogDialog"
        :visible.sync="bIsCatalogVisible"
        class="to-add-catalog"
      >
        <div v-show="addMenu" slot="title">新建目录</div>
        <div v-show="!addMenu" slot="title">修改目录</div>
        <el-form
          :model="baseInfoRuleForm"
          :rules="baseInfoRules"
          ref="baseInfoRuleForm"
          label-width="120px"
          style="margin-top:20px;"
        >
          <el-form-item label="目录代码：" class="is-required" prop="menuCode">
            <el-input
              :disabled="isCodeInput"
              size="small"
              v-model.trim="baseInfoRuleForm.menuCode"
              placeholder="请输入目录代码..."
            ></el-input>
          </el-form-item>
          <el-form-item label="目录名称：" class="is-required" prop="cnName">
            <el-input
              size="small"
              v-model.trim="baseInfoRuleForm.cnName"
              placeholder="请输入目录中文名称..."
            ></el-input>
          </el-form-item>
          <!--选择目录 tree-->
          <el-form-item label="上级目录：" prop="catalog" class="choice-catalog-item is-required">
            <el-select
              :disabled="true"
              ref="classifySelect"
              class="ruleClassifying"
              clearable
              style="width: 100%;"
              v-model="baseInfoRuleForm.catalog"
              placeholder="请选择"
            >
              <el-option :label="classifyOption" :value="classifyValue" style="height: auto">
                <el-tree
                  v-if="bIsShowCatalogTree"
                  :data="data"
                  :props="defaultProps"
                  :highlight-current="true"
                  @node-click="handleCatalogNodeClick"
                ></el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :prop="item.nullable?'':item.attrStore"
            v-for="(item, index) in editInputList"
            :key="index"
            :class="[item.nullable?'':'is-required']"
            :label="`${item.name}：`"
          >
            <el-select
              style="width: 100%;"
              v-if="item.columnType === 'combobox'"
              :disabled="item.onlyRead"
              v-model="baseInfoRuleForm[item.attrStore]"
            >
              <el-option
                v-for="(val, num) in item.selectList"
                :key="num"
                :label="val.textField"
                :value="val.valueField"
              ></el-option>
            </el-select>
            <el-input
              v-else-if="item.columnType === 'textfield'"
              :disabled="item.onlyRead"
              v-model="baseInfoRuleForm[item.attrStore]"
            ></el-input>
          </el-form-item>
          <el-form-item label="归口责任部门：" class="is-required" prop="selectGroup2">
            <el-select
              style="width: 100%;"
              v-model="catalogData.selectGroup"
              filterable
              :filter-method="dataFilter"
              @change="getGroupList"
            >
              <el-option
                v-for="(val, num) in catalogData.groupList"
                :key="num"
                :label="val.groupName"
                :value="val.groupId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归口责任人：" class="is-required" prop="selectUser2">
            <el-select
              style="width: 100%;"
              v-model="catalogData.selectUser"
              filterable
              :filter-method="dataFilter2"
              @visible-change="getUserList"
              @change="getUserList2"
            >
              <el-option
                v-for="(val, num) in catalogData.userList"
                :key="num"
                :label="val.userName"
                :value="val.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align:center;">
          <el-button type="primary" size="mini" @click="toSaveCatalog">确定</el-button>
        </div>
      </el-dialog>
      <!--选择用户-->
      <el-dialog :visible.sync="bIsUserVisible" class="duty-dialog">
        <div slot="title">请选择用户</div>
        <div>
          <div class="tag-box" style="margin-bottom:10px">
            <span>已选择：</span>
            <el-tag
              style="margn-right: 5px;"
              @close="closeTag"
              closable
              type="info"
              v-if="userTagList.username"
            >{{userTagList.username}}</el-tag>
          </div>
          <div class="tree-box">
            <el-input
              size="small"
              class="tree-box_input"
              placeholder="请输入姓名..."
              suffix-icon="el-icon-search"
            ></el-input>
            <el-tree
              style="height: 200px;overflow:auto;"
              :highlight-current="true"
              empty-text="暂无数据"
              :props="userProps"
              :data="userTree"
              @node-click="handleUserNodeClick"
            ></el-tree>
          </div>
        </div>
        <div slot="footer" style="text-align:center;">
          <el-button type="primary" size="mini" @click="toSaveUser">确定</el-button>
        </div>
      </el-dialog>
      <!-- 自定义列表 -->
      <el-dialog
        title="自定义列表"
        @close="clearEditDialog"
        :destroy-on-close="true"
        width="300px"
        :visible.sync="definitionListDialog"
        class="selfTable"
      >
        <div class="definition">
          <el-checkbox-group v-model="tableHeader" size="mini" style="padding: 0 20px;">
            <transition-group tag="div" class="table-container">
              <el-checkbox
                v-for="item in tableHeaderAll"
                :label="item"
                :key="item"
                border
                style="transition: all linear .5s ;width: 206px;margin-bottom: 8px;height: 32px;padding: 0 10px;line-height: 32px;margin-left: 0;position: relative;"
                draggable="true"
                @dragstart.native="handleDragStart($event, item)"
                @dragover.native.prevent="handleDragOver($event, item)"
                @dragenter.native.prevent="handleDragEnter($event, item)"
                @dragend.native.prevent="handleDragEnd($event, item)"
                class="hover boxcheck"
              >
                {{item}}
                <i class="el-icon-menu" style="position: absolute;right: 10px;top: 9px;"></i>
              </el-checkbox>
            </transition-group>
          </el-checkbox-group>
        </div>
        <div class="dialog_button" style="text-align: center;margin-top:8px;" slot="footer">
          <el-button type="primary" @click="submitEditForm()">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="deleteDialog" class="delete-dialog" title="删除提示" width="50%">
        <delete-dialog ref="deleteMenuDialog"></delete-dialog>
        <div class="dialog-btn">
          <el-button type="primary" @click="isDeleteMenu?toDelCatalog():deleteData()">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="addItemDialog" class="addItemDialog-dialog" :title="addOrEditDioTitle" width="50%" @close="closeAddDialog">
        <div class="card-body">
          <el-collapse v-model="aBaseInfoActiveNames">
            <el-collapse-item class="title terms" name="1">
              <template slot="title">
                <i class="line"></i>业务属性
              </template>
              <div class="form-body">
                <el-form :model="ruleForm2"  ref="ruleForm" label-width="130px"  v-if="addItemDialogform">
                  <opinion-input-type @hiddenDialog="addItemDialog = false" v-for=" (val,index) in inputData" :key="val.columnName" :inputItem="inputData[index]" :ref="'input_'+val.columnName" :oldName=oldCnName v-show="val.hidden!==true"  @childSaveSure="childSaveSure"  @hasNoRepeat="hasNoRepeatFc"  @childCancelSure="childCancelSure">
                  </opinion-input-type>
                </el-form>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="dialog-btn">
          <el-button type="primary" size="mini" :disabled="isSaveBtdis" @click="addOrEditDioTitle==='新增'?getInputData('ruleForm'):getEditInputData('ruleForm')">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 元数据信息下的2个table的组件 元数据详情页也会用到
import { get, post, postByJson } from "@/utils/request";
import { generateLineageTitle } from "@/utils";
import deleteDialog from "@/views/ds/deleteDialog/deleteDialog";
import pinyin from "pinyin";
import catalogDetail from "./../common/catalogDetail";
import { loading } from "@/utils/layer";
import opinionInputType from "@/views/ds/professional/opinionInputType";
import termDetail from "@/views/ds/professional/termDetail";
import bus from '@/utils/bus'
export default {
  name: "professionalTerms",
  components: {
    deleteDialog,
    catalogDetail,
    opinionInputType,
    termDetail
  },
  data() {
    var validateDuty = (rule, value, callback) => {
      // console.log("rule, value, callback", rule, value, callback);
      if (this.dutyUserId === "") {
        callback(new Error("请选择责任人!"));
      } else {
        callback();
      }
    };
    var validateMenuCode = (rule, value, callback) => {
      if (this.addMenu) {
        let reg = /^\d{2,}$/;
        let len = value.length;
        let test = reg.test(value);
        // console.log(value.length);
        if (test && len === 2) {
          get("/ds/selectCatalogueInstanceCodeExist", {
            instanceCode: value,
            parentId: this.sendInstanceId
          }).then(res => {
            // console.log(res);
            if (res.code === 10000 && res.success) {
              if (!res.data) {
                callback(new Error("目录代码重复，请修改!"));
              } else {
                callback();
              }
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          callback(new Error("只允许两位阿拉伯数字!"));
        }
      } else {
        callback();
      }
    };
    var validateGroup = (rule, value, callback) => {
      if (this.baseInfoRuleForm.selectGroup2 === null) {
        callback(new Error("请选择归口责任部门"));
      } else {
        callback();
      }
    };
    var validateUser = (rule, value, callback) => {
      if (this.baseInfoRuleForm.selectUser2 === null) {
        callback(new Error("请选择归口责任人"));
      } else {
        callback();
      }
    };
    return {
      deleteDialog: false,
      ifCurrentNode: true, // 目录详情显示时，做增删改操作，判断是否为当前节点
      showComponent: "card",
      aIsExpandedArr: [], // 默认展开节点数组
      sNodeType: "", // 当前选中的Tree节点数据类型
      aViewDataList: [], // 视图切换选择项下拉列表
      sViewId: "", //  视图切换选择项
      Breadcrumb: [{ name: "全部", isDisabled: true }], // 面包屑数据
      setBreadList: [{ name: "全部", isDisabled: true }],
      treeNodeArr: [],
      sTooltipValue: "", // 提示
      // 搜索
      searchForm: {
        keyword: "",
        isPublish: ""
      },
      // 树
      treeLoading: true,
      data: [],
      nodeFirst: [],
      resolveFirst: [],
      node: [],
      resolve: [],
      defaultProps: {
        label: "name",
        children: "children",
        isLeaf: "leaf"
      },

      isPublishStateList: [],
      // 删除
      tableChecked: [], // 存储所选中的id
      tableData: [],
      // paganation数据
      icurrentPage: 1,
      ipageSize: 30,
      total: 10,
      isFirst: true,
      instanceId: "", // 存储点击时的nodeId

      removeData: {}, // 右键时data数据
      deleteMenu: {}, // 右键时data数据
      namespace: "", // 右键时data数据
      // 根节点路径为空时  默认右键获取的路径
      parentName: "",
      // 右键目录ID
      editMenuId: "",
      userTagList: {}, // 责任人tag列表
      dutyUserId: "", // 责任人Id
      showMenu: false, // 是否显示右键菜单
      EditDeltShow: false,
      // 新增目录
      addMenu: false, // 是否为  新增目录
      getEditList: [], // 修改目录-getCatlogDetail数据
      classifierId: "BizTermInfoItem",
      classifierName: "",
      bIsCatalogVisible: false, // 是否显示新增或修改对话框

      baseInfoRuleForm: {
        menuCode: "",
        cnName: "",
        enName: "",
        classify: "",
        type: "",
        catalog: "请选择...",
        type2: "",
        type3: "",
        type4: "",
        format: "",
        string1: "",
        string2: "",
        string3: "",
        string4: "",
        string5: "",
        string6: "",
        string7: "",
        string8: "",
        string9: "",
        selectGroup2: null,
        selectUser2: null
      },
      catalogData: {
        groupList: [],
        groupListCopy: [],
        userList: [],
        userListCopy: [],
        selectGroup: null,
        selectGroup2: null,
        selectUser: null,
        selectUser2: null
      },
      classifyOption: "",
      classifyValue: "",

      baseInfoRules: {
        cnName: [
          { required: true, message: "请输入目录名称", trigger: "blur" }
        ],
        menuCode: [{ validator: validateMenuCode, trigger: "blur" }],
        enName: [
          { required: true, message: "请输入目录含义", trigger: "blur" }
        ],
        classify: [
          { required: true, message: "请选择归属标准", trigger: "change" }
        ],
        duty: [{ validator: validateDuty, trigger: "change" }],
        selectGroup2: [{ validator: validateGroup, trigger: "blur" }],
        selectUser2: [{ validator: validateUser, trigger: "blur" }]
      },
      // 归属标准  和  含义  显示隐藏
      catalogMean: false,
      standardShow: false,
      // 归属标准下拉数据
      classifyList: [],
      addInputList: [], // 获取非固定输入框数据

      // 选择用户
      bIsUserVisible: false,
      userProps: {
        children: "users",
        label: "userName"
      },
      userTree: [],
      bIsShowCatalogTree: false,
      // 右键操作目录时判断是否有子节点
      nodeIsLeaf: "",
      clickNode: "",
      noSonTree: "",

      // 自定义列
      tableHeader2: [], // 选中表头
      tableHeaderAll: [], // 表头全部参数
      definitionListDialog: false,
      tableHeader: [],
      definitionDataList: [],
      moveElement: null, // 移动的元素
      moveIndex: null,
      moveIndex2: null,
      loading: true,
      isDeleteMenu: "", // 判断是否是删除菜单
      editInputList: [],
      isCodeInput: false,
      pushAddCatalog: "",
      sendInstanceId: "",
      classifyName: "",
      value: '',
      toAddMsg: {
        namespace: "",
        namespaceCN: "",
        node: []
      },
      tableLoading: true,
      selectItem: '', // 删除的当条信息
      // 视图id
      viewId: '',
      showToolTip: true,

      // 新增信息项相关数据
      addItemDialog: false, // 打开新增dialog
      addItemDialogform: false,
      ruleForm2: {
        INSTANCE_NAME: "",
        INSTANCE_CODE: "",
        PARENT_ID: "",
        STRING_1: "",
        STRING_3: "",
        STRING_4: "",
        STRING_5: "",
        STRING_2: ""
      },
      inputData: [],
      firstClassifierID: '',
      addNode: false,
      addItem: false,
      isSaveBtdis: false,
      hasNoRepeat: false,
      nodeList: [],
      aBaseInfoActiveNames: ["1"],

      // 编辑相关数据
      addOrEditDioTitle: '新增',
      oldCnName: '',
      parentId: '',
      editRow: null, // 编辑时存储当前行的row
      // 详情
      paramsForDetail: {}, // 详情组件所需参数
      refreshload: false,

      count: 0 // tree多次点击时数据覆盖问题解决
    };
  },
  watch: {
    showMenu: {
      handler(newValue, oldValue) {
        if (!newValue) {
          this.ifCurrentNode = true;
        }
      },
      deep: true // 只要当obj中的值改变就会触发这个函数且,newValue,oldValue两个参数值相同;/
    }
  },
  methods: {
    closeAddDialog() {
      this.addItemDialog = false
      this.addItemDialogform = false
    },
    searchTableList() {
      this.icurrentPage = 1
      this.queryTableList()
    },
    // 组件接收返回按钮
    getShowChange(val) {
      this.showComponent = val;
      this.queryTableList()
    },
    getShowChange2(val) {
      // if (this.node.parent.data.classifierId.includes("Parent")) {
      this.node.parent.childNodes.map(item => {
        item.expanded = false;
      });
      // }
      this.aIsExpandedArr = [];
      if (this.node.namespace !== val.namespace) {
        let pathName = val.path;
        pathName = pathName.substring(
          pathName.indexOf(this.node.data.name) + this.node.data.name.length + 1
        );
        let arr = pathName.split("/");
        this.node.data.level = this.node.level;
        this.Breadcrumb.map((item, index) => {
          // console.log(item.level, this.node.data.level);
          if (item.level === this.node.data.level) {
            this.Breadcrumb.splice(index, this.Breadcrumb.length);
          }
        });
        get(`/ds/details/${this.node.data.id}`).then(res => {
          if (res.code === 10000 && res.success) {
            res.data.attributes.map(i => {
              if (i.attrCode === "Tag") {
                this.node.data.tipValue = i.value;
                this.node.data.isDisabled = false;
                if (!this.Breadcrumb.includes(this.node)) {
                  this.Breadcrumb.push(this.node.data);
                  // this.instanceId = this.node.data.id;
                  // this.icurrentPage = 1
                  // this.ipageSize = 10
                  // this.queryTableList()
                  this.getActiveNode(this.node, arr, val);
                } else {
                  this.getActiveNode(this.node, arr, val);
                }
              }
            });
          }
        });
      }
    },
    getActiveNode(node, arr, item) {
      // console.log(node, arr, item);
      if (node.childNodes.length > 0) {
        node.childNodes.map((val, index) => {
          if (val.data.name === arr[0]) {
            val.expanded = false;
            this.aIsExpandedArr = [];
            this.aIsExpandedArr.push(val.data.id);
            this.$refs.tree.setCurrentKey(val.data.id);
            this.resetTable(val.data.id);
            // console.log(val, val.data.name, arr);
            val.data.level = val.level;
            get(`/ds/details/${val.data.id}`).then(res => {
              if (res.code === 10000 && res.success) {
                res.data.attributes.map(i => {
                  if (i.attrCode === "Tag") {
                    val.data.tipValue = i.value;
                    val.data.isDisabled = false;
                    if (!this.Breadcrumb.includes(val)) {
                      this.Breadcrumb.push(val.data);
                    }
                    arr.splice(0, 1);
                    // console.log(arr);
                    if (arr.length > 0) {
                      this.getActiveNode(val, arr);
                    }
                  }
                });
              }
            });
          }
        });
      } else {
        // console.log("un");
        if (!node.isLeaf) {
          // console.log("un", "noleaf");
          this.aIsExpandedArr.push(node.data.id);
          this.$refs.tree.setCurrentKey(node.data.id);
          this.resetTable(node.data.id);
          const that = this;
          var timer = setInterval(function() {
            if (node.childNodes.length > 0) {
              that.getActiveNode(node, arr, item);
              clearInterval(timer);
            }
          }, 50);
        }
      }
    },
    resetTable(val) {
      this.instanceId = val;
      this.searchForm.keyword = "";
      this.keyword = "";
      this.ipageSize = 30;
      this.icurrentPage = 1;
      this.queryTableList();
    },
    getCatalogDetail(type = false) {
      if (!type) {
        this.showComponent = "detail";
      }
      this.showMenu = false;
      get("/ds/getCatlogDetail", { id: this.editMenuId }).then(res => {
        let data = res.data;
        let dataList = {};
        let basic = {}; // 基本信息
        let duty = {}; // 认责信息
        let obj1 = {
          code: data.dataStandardVO.code,
          name: data.dataStandardVO.name,
          path: data.parentPathCn
        };
        if (data.user) {
          duty.user = data.user.username;
        }
        if (data.group) {
          duty.group = data.group.groupName;
        }

        basic.fixed = obj1;
        basic.traversal = data.dataStandardVO.attributes;
        dataList.basic = basic;
        dataList.duty = duty;
        // console.log(dataList);
        this.$refs.catalogDetail.dataList = dataList;
        this.$refs.catalogDetail.instanceId = this.editMenuId;
        // console.log(this.$refs.catalogDetail.dataList);
      });
    },
    // 左边拖拽事件
    dragControllerDiv(e) {
      let width = document.getElementsByClassName("el-container")[0]
        .clientWidth;
      let remove = document.getElementsByClassName("resize");
      let c = e.clientX - remove[0].offsetLeft;
      let left = document.getElementsByClassName("leftdiv");
      let newWidth = null;
      // console.log(e, remove, left, width);
      document.onmousemove = ev => {
        ev.preventDefault();
        // console.log(ev);
        let ex = ev.clientX - c;
        newWidth = (ex / width) * 100;
        // console.log(newWidth);
        newWidth = newWidth > 45 ? 45 : newWidth < 15 ? 15 : newWidth;
        left[0].style.width = newWidth.toFixed(2) + "%";
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
        // resize.releaseCapture && resize.releaseCapture()
      };
    },
    clearEditDialog() {},
    // 调整自定义桌面位置
    handleDragStart(even, item) {
      this.moveElement = item;
      // console.log("handleDragStart", even, item)
    },
    handleDragOver(even, item) {
      // console.log("handleDragOver", even, item)
      even.dataTransfer.dropEffect = "move";
    },
    handleDragEnter(even, item) {
      // console.log("handleDragEnter", even, item)
      even.dataTransfer.effectAllowed = "move";
      if (item === this.moveElement) {
        return;
      }
      const newItems = [...this.tableHeaderAll];
      this.moveIndex = newItems.indexOf(this.moveElement);
      this.moveIndex2 = newItems.indexOf(item);
      newItems.splice(
        this.moveIndex2,
        0,
        ...newItems.splice(this.moveIndex, 1)
      );
      this.tableHeaderAll = newItems;
      var a = document.getElementsByClassName("boxcheck");
      a[this.moveIndex].style.boxShadow = "0 1px 6px rgba(0,0,0,.2)";
      // console.log("handleDragEnter---a", a)
      for (let i = 0; i < a.length; i++) {
        var ab = a[i].classList;
        for (let j = 0; j < ab.length; j++) {
          if (ab[j] === "hover") {
            // console.log("handleDragEnter---ab[j]", a[i].classList)
            a[i].classList.remove("hover");
          }
        }
      }
    },
    handleDragEnd(even, item) {
      this.moveElement = null;
      var a = document.getElementsByClassName("boxcheck");
      a[this.moveIndex2].style.boxShadow = "none";
      for (let i = 0; i < a.length; i++) {
        a[i].classList.add("hover");
      }
    },
    submitEditForm() {
      let newSelectArr = [];
      this.tableHeaderAll.map(val => {
        if (this.tableHeader.indexOf(val) > -1) {
          newSelectArr.push(val);
        }
      });
      let arr = [];
      newSelectArr.map(val => {
        this.definitionDataList.map(val2 => {
          if (val2.label === val) {
            arr.push(val2.prop);
          }
        });
      });
      // console.log('/ds/saveQueryHeaders', arr)
      post("/ds/saveQueryHeaders", {
        classifierId: this.classifierId,
        headers: arr.join(",")
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.definitionListDialog = false;
          this.loading = false;
          this.$message({
            message: res.message,
            type: "success"
          });
          this.icurrentPage = 1;
          this.queryTableList();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 自定义列函数
    definitionList() {
      this.definitionListDialog = true;
      this.getAllHeader();
    },
    definitionChange(item, index) {
      // console.log(" definitionChange(item, index)", item, index);
      this.tableHeader[index].checked = !this.tableHeader[index].checked;
    },

    /**  鼠标右键 */
    handleMouseRight(event, data, node, component) {
      // console.log('handleMouseRight,event, data, node, component', event, data, node, component)

      if (data.classifierId) {
        if (data.classifierId.indexOf("Parent") !== -1) {
          // this.classifierName = data.name;
          this.classifyName = data.name;
        }
      }
      this.node = node;
      this.nodeIsLeaf = node.isLeaf;
      this.removeData = data;
      this.deleteMenu = data;
      this.namespace = data.namespace;
      this.parentName = data.name;
      if (data.id === this.editMenuId) {
        this.ifCurrentNode = true;
      } else {
        this.ifCurrentNode = false;
        this.showComponent = "card";
      }
      this.editMenuId = data.id;
      this.sendInstanceId = data.id;
      let contextMenu = this.$refs.rightMenu; // 右键菜单 div元素
      // 判断是否是根或者挂载点  来觉得是否显示 右键新增菜单
      if (data.classifierId) {
        if (
          data.classifierId === "Context" ||
          data.classifierId.includes("Parent")
        ) {
          this.showMenu = true;
        } else {
          this.showMenu = false;
        }

        if (data.classifierId.includes("Parent")) {
          this.EditDeltShow = false;
        } else {
          this.EditDeltShow = true;
        }
      } else {
        this.showMenu = false;
      }
      contextMenu.style.left = event.offsetX + 75 + "px";
      contextMenu.style.top = event.clientY - 70 + "px";
      // console.log(contextMenu, "contextMenu");
    },
    // 新增目录
    toAddCatalog() {
      this.addMenu = true;
      this.bIsCatalogVisible = true;
      this.getListFeature();
      // 根据namespace获取上下文路径
      this.getPath();
      this.showMenu = false;
      this.isCodeInput = false;
      this.toAddUserShow(); // 获取部门列表
    },
    // 获取非固定输入框
    getListFeature() {
      get("/ds/listFeatureByClassifierId", {
        classifierId: "Context"
      }).then(res => {
        if (res.code === 10000 && res.success) {
          // console.log("获取非固定输入框", res);
          this.editInputList = [];
          this.catalogMean = false;
          this.standardShow = false;
          this.addInputList = res.data;
          res.data.map(item => {
            item.attrStore = item.attStore;
            if (item.columnType === "combobox") {
              get("/ds/listStandardAttrComboboxInfos", {
                columnTypeValue: item.datatypeId
              }).then(res => {
                // console.log(res, "99");
                item.selectList = res.data;
                if (
                  item.attrCode === "Standard_type" ||
                item.attCode === "Standard_type"
                ) {
                  this.classifyList.map(item1 => {
                    // console.log(item);
                    if (item1.classifierName === this.classifyName) {
                      this.classifierId = item1.classifierId;
                      this.classifierName = item1.classifierName;
                      this.baseInfoRuleForm[item.attrStore] = item1.classifierName;
                    }
                  })
                }
                this.editInputList.push(item);
                if (!item.nullable) {
                  this.baseInfoRules[item.attStore] = [
                    {
                      required: true,
                      message: `请选择${item.attName}`,
                      trigger: "change"
                    }
                  ];
                }
              });
            } else {
              this.editInputList.push(item);
              if (!item.nullable) {
                this.baseInfoRules[item.attStore] = [
                  {
                    required: true,
                    message: `请输入${item.attName}`,
                    trigger: "blur"
                  }
                ];
              }
            }
            return item;
          });
          if (this.addMenu) {
            this.getListClassifier2();
          } else {
            this.getListClassifier();
          }
          // console.log(this.editInputList, "list");
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取上级目录
    getPath(val) {
      // console.log(this.toAddMsg, "this.toAddMsg.namespace");
      get("/ds/getStandardContext", {
        isContainRoot: true,
        isContainIndex: false,
        namespace: val === "add" ? this.toAddMsg.namespace : this.namespace
      }).then(res => {
        // console.log("/ds/getStandardContext", res);
        if (res.code === 10000 && res.success) {
          if (val === "add") {
            this.toAddMsg.namespaceCN = res.data;
            this.nodeList = this.Breadcrumb
            this.addOrEditDioTitle = "新增"
            this.$nextTick(() => {
              this.getAddType()
            });
            // this.$router.push({
            //   name: "professionalAdd",
            //   params: {
            //     msg: this.toAddMsg,
            //     nodeList: this.Breadcrumb
            //   }
            // });
          } else {
            this.baseInfoRuleForm.catalog =
              res.data === "" ? this.parentName : res.data;
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 新增信息项相关方法
    // 动态获取新增表单项并且将当前节点路径带入
    getAddType() {
      get('/ds/bizTerm/getBuzTermAttrInfos').then(res => {
        if (res.code === 10000 && res.success) {
          this.inputData = res.data;
          // console.log("this.ruleForm2[val.columnName]---res.data", res.data)
          this.inputData.map((val, index) => {
            if (val.columnName === 'PARENT_ID') {
              let msg = this.toAddMsg
              // console.log("this.ruleForm2[val.columnName]---msg", msg)
              this.$set(this.inputData[index], 'attrValuName', msg.namespaceCN)
              this.$set(this.inputData[index], 'attrValuNamespace', msg.namespace)
              this.$set(this.inputData[index], 'nodeList', this.Breadcrumb)
            }
            bus.$on(val.columnName, (e) => {
              this.ruleForm2[val.columnName] = e
            // console.log("this.ruleForm2[val.columnName]", this.ruleForm2[val.columnName])
            })
          })
          this.$nextTick(() => {
            this.addItemDialogform = true
          });
        } else {
          this.addItemDialogform = true
        }
      })
    },
    // 保存新增信息项
    getInputData(formName) {
      this.isSaveBtdis = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addItem = true
          if (this.hasNoRepeat) {
            this.addItem = true
            this.saveSure()
          }
        } else {
          this.$message.error("请按照提示输入");
          this.isSaveBtdis = false
          this.addItem = false
          return false;
        }
      });
    },
    hasNoRepeatFc(val) {
      this.hasNoRepeat = val
    },
    saveSure() {
      // console.log("11111", this.addItem)
      if (this.addItem) {
        let params = {}
        this.inputData.map(val => {
          let columnName = this.underlineToHump(val.columnName)
          params[columnName] = this.$refs['input_' + val.columnName][0].inputData
        })
        // this.getInputData = true
        post('/ds/bizTerm/addBuzTerm', params).then(val => {
          if (val.code === 10000 & val.success) {
            this.isSaveBtdis = false
            this.addItem = false
            // this.getInputData = false
            this.$message({
              message: val.message,
              type: 'success'
            });
            this.addItemDialog = false
            this.addItemDialogform = false
            this.setTree()
            // this.closeSelectedTag(this.$route)
            // this.$router.push({
            //   name: "professionalTerms",
            //   params: {
            //     nodeList: this.nodeList,
            //     addNode: this.addNode
            //   }
            // });
          } else {
            this.isSaveBtdis = false
            this.addItem = false
            // this.getInputData = false
            this.$message.error(val.message);
          }
        })
      }
      this.isSaveBtdis = false
    },
    childSaveSure() {
      // console.log("1111", "childSaveSure")
      if (this.addOrEditDioTitle === '新增') {
        // console.log("1111", "saveSure")
        this.saveSure()
      } else {
        this.saveEditSure()
      }
    },
    childCancelSure() {
      this.addItem = false
      this.isSaveBtdis = false
    },
    underlineToHump(str) {
      // 先转小写
      let strs = str.toLowerCase();
      // 以下滑线分割字符串
      strs = strs.split("_");
      // 将第二个字符开始后面的字符首字母都大写
      for (var i = 1; i < strs.length; i++) {
        if (strs[i] !== undefined) { strs[i] = strs[i].substr(0, 1).toUpperCase() + strs[i].substr(1); }
      }
      // 组装字符串
      let res = "";
      for (var j = 0; j < strs.length; j++) { res += strs[j]; }
      return res;
    },

    // 获取标准类型下拉框数据
    getListClassifier() {
      // console.log(this.addMenu)
      get("/ds/application/rule/listClassifier").then(res => {
        this.classifyList = res.data;
        res.data.map(item => {
          // console.log(item);
          if (item.classifierName === this.classifyName) {
            this.classifierId = item.classifierId;
            this.classifierName = item.classifierName;
            // if (this.classifierName) {
            this.editInputList.map(i => {
              // console.log(i, "03");
              if (
                i.attrCode === "Standard_type" ||
                i.attCode === "Standard_type"
              ) {
                this.baseInfoRuleForm[i.attrStore] = item.classifierName;
                // console.log(item.classifierName, "Name", i);
              }
            });
          }
        });
        // console.log(this.baseInfoRuleForm);
      });
    },
    getListClassifier2() {
      // console.log(this.addMenu)
      get("/ds/application/rule/listClassifier").then(res => {
        this.classifyList = res.data;
        res.data.map(item => {
          // console.log(item);
          if (item.classifierName === this.classifyName) {
            this.classifierId = item.classifierId;
            this.classifierName = item.classifierName;
            // if (this.classifierName) {
            this.editInputList.map(i => {
              // console.log(i, "03");
              if (
                i.attrCode === "Standard_type" ||
                i.attCode === "Standard_type"
              ) {
                this.baseInfoRuleForm[i.attrStore] = item.classifierName;
                // console.log(item.classifierName, "Name", i);
              }
              if (i.attCode === 'Is_Entity' || i.attrCode === 'Is_Entity') {
                this.$set(
                  this.baseInfoRuleForm,
                  i.attrStore,
                  'F'
                );
              }
            });
            // }
          }
        });
        // console.log(this.baseInfoRuleForm);
      });
    },
    // 自定义表头时获取相关数据
    getAllHeader() {
      get("/ds/listQueryHeaders/" + this.classifierId).then(res => {
        if (res.code === 10000 && res.success) {
          this.definitionDataList = res.data;
          this.tableHeader = [];
          this.tableHeaderAll = [];
          this.definitionDataList.map(val => {
            if (val.checked && val.checked === true) {
              this.tableHeader.push(val.label);
            }
            this.tableHeaderAll.push(val.label);
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 关闭目录新增编辑弹窗时触发
    closeCatalogDialog() {
      for (let a in this.baseInfoRuleForm) {
        this.baseInfoRuleForm[a] = "";
      }
      this.catalogData = {
        groupList: [],
        groupListCopy: [],
        userList: [],
        userListCopy: [],
        selectGroup: null,
        selectGroup2: null,
        selectUser: null,
        selectUser2: null
      };
    },
    // 关闭tags
    // closeTag() {
    //   this.userTagList = {};
    //   this.dutyUserId = "";
    // },
    getGroupList(val) {
      this.catalogData.selectUser = null;
      this.catalogData.selectUser2 = null;
      this.catalogData.userList = null;
      this.catalogData.userListCopy = null;
      this.catalogData.selectGroup2 = val;
      this.baseInfoRuleForm.selectGroup2 = val;
      this.baseInfoRuleForm.selectUser2 = null;
      if (this.catalogData.selectGroup) {
        var pattern = new RegExp("[\u4E00-\u9FA5]+");
        var pattern2 = new RegExp(/^(?=.*\d.*\b)/);
        if (
          !pattern.test(this.catalogData.selectGroup) &&
          pattern2.test(this.catalogData.selectGroup) &&
          this.catalogData.selectGroup.length === 32
        ) {
          // 获取用户列表
          get(
            `sys/user/listUserInGroup?groupId=${this.catalogData.selectGroup}`
          ).then(res => {
            if (res.code === 10000 && res.success) {
              this.catalogData.userList = [];
              this.catalogData.userListCopy = [];
              if (res.data.length > 0) {
                res.data.map(val => {
                  let pname = pinyin(val.userName, {
                    style: pinyin.STYLE_NORMAL, // 设置拼音风格
                    heteronym: true
                  });
                  let newpname = "";
                  pname.map(val2 => {
                    if (val2.length > 1) {
                      newpname += val2[0];
                    } else {
                      newpname += val2;
                    }
                  });
                  let spname = pinyin(val.userName, {
                    style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
                    heteronym: true
                  });
                  let newspname = "";
                  spname.map(val2 => {
                    if (val2.length > 1) {
                      newspname += val2[0];
                    } else {
                      newspname += val2;
                    }
                  });
                  let obj = {
                    userId: val.userId,
                    userName: val.userName,
                    pname: newpname,
                    spname: newspname
                  };
                  this.catalogData.userList.push(obj);
                  this.catalogData.userListCopy.push(obj);
                });
              }
              // console.log(
              //   this.catalogData.userList,
              //   this.catalogData.userListCopy,
              //   2222
              // );
            } else {
              this.$message.warning("请先选择部门！");
            }
          });
        }
      }
    },
    getUserList2(val) {
      this.baseInfoRuleForm.selectUser2 = val;
      this.catalogData.selectUser2 = val;
    },
    getUserList(val) {
      // console.log(val);
      if (val) {
        if (this.catalogData.selectGroup) {
          var pattern = new RegExp("[\u4E00-\u9FA5]+");
          var pattern2 = new RegExp(/^(?=.*\d.*\b)/);
          if (
            pattern.test(this.catalogData.selectGroup) ||
            !pattern2.test(this.catalogData.selectGroup) ||
            this.catalogData.selectGroup.length !== 32
          ) {
            this.$message.warning("请先选择部门！");
          }
        } else {
          this.$message.warning("请先选择部门！");
        }
      }
    },
    // 选择用户
    toAddUserShow() {
      get("/sys/user/listUserByGroup").then(res => {
        // const that = this;
        if (res.code === 10000 && res.success) {
          this.catalogData.groupList = [];
          this.catalogData.groupListCopy = [];
          if (res.data.length > 0) {
            res.data.map(val => {
              let pname = pinyin(val.groupName, {
                style: pinyin.STYLE_NORMAL, // 设置拼音风格
                heteronym: true
              });
              let newpname = "";
              pname.map(val2 => {
                if (val2.length > 1) {
                  newpname += val2[0];
                } else {
                  newpname += val2;
                }
              });
              let spname = pinyin(val.groupName, {
                style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
                heteronym: true
              });
              let newspname = "";
              spname.map(val2 => {
                if (val2.length > 1) {
                  newspname += val2[0];
                } else {
                  newspname += val2;
                }
              });
              let obj = {
                groupId: val.groupId,
                groupName: val.groupName,
                pname: newpname,
                spname: newspname
              };
              this.catalogData.groupList.push(obj);
              this.catalogData.groupListCopy.push(obj);
            });
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    dataFilter(val) {
      this.catalogData.selectUser = null;
      this.catalogData.selectUser2 = null;
      this.catalogData.userList = null;
      this.catalogData.userListCopy = null;
      this.catalogData.selectGroup = val;
      this.catalogData.selectGroup2 = null;
      var str;
      var pattern = new RegExp("[\u4E00-\u9FA5]+");
      var pattern2 = new RegExp("[A-Za-z]+");
      if (pattern.test(val)) {
        str = "中文";
      } else if (pattern2.test(val)) {
        str = "英文";
      }
      if (str === "英文") {
        this.eSearch(val, "group");
      } else if (str === "中文") {
        this.showTree(val, "group");
      } else {
        this.catalogData.groupList = this.catalogData.groupListCopy;
      }
    },
    dataFilter2(val) {
      this.catalogData.selectUser = val;
      var str;
      var pattern = new RegExp("[\u4E00-\u9FA5]+");
      var pattern2 = new RegExp("[A-Za-z]+");
      if (pattern.test(val)) {
        str = "中文";
      } else if (pattern2.test(val)) {
        str = "英文";
      }
      if (str === "英文") {
        this.eSearch(val, "user");
      } else if (str === "中文") {
        this.showTree(val, "user");
      } else {
        this.catalogData.userList = this.catalogData.userListCopy;
      }
    },
    showTree(val, type) {
      if (val) {
        if (type === "group") {
          this.catalogData.groupList = this.catalogData.groupListCopy.filter(
            item => {
              if (item.groupName.indexOf(val) > -1) {
                return true;
              }
            }
          );
        } else if (type === "user") {
          this.catalogData.userList = this.catalogData.userListCopy.filter(
            item => {
              if (item.userName.indexOf(val) > -1) {
                return true;
              }
            }
          );
        }
      }
    },
    eSearch(val, type) {
      if (val) {
        if (type === "group") {
          this.catalogData.groupList = this.catalogData.groupListCopy.filter(
            item => {
              if (item.spname.indexOf(val) > -1) {
                return true;
              } else if (item.pname.indexOf(val) > -1) {
                let bool = false;
                for (let m = 0; m < item.spname.length; m++) {
                  if (val[0] === item.spname[m]) {
                    bool = true;
                  }
                }
                if (bool) {
                  return true;
                }
              }
            }
          );
        } else if (type === "user") {
          this.catalogData.userList = this.catalogData.userListCopy.filter(
            item => {
              if (item.spname.indexOf(val) > -1) {
                return true;
              } else if (item.pname.indexOf(val) > -1) {
                let bool = false;
                for (let m = 0; m < item.spname.length; m++) {
                  if (val[0] === item.spname[m]) {
                    bool = true;
                  }
                }
                if (bool) {
                  return true;
                }
              }
            }
          );
        }
      }
    },
    // 认责信息树
    // getDutyTree() {
    //   get("/sys/user/listUserByGroup").then(res => {
    //     // console.log(res, "22");
    //     this.userTree = res.data.map(item => {
    //       item.userName = item.groupName;
    //       return item;
    //     });
    //   });
    // },
    // 新增目录 - 确定
    toSaveCatalog() {
      if (this.baseInfoRuleForm.selectGroup2 === "") {
        this.baseInfoRuleForm.selectGroup2 = null;
        // console.log(
        //   this.baseInfoRuleForm.selectGroup2,
        //   "this.baseInfoRuleForm.selectGroup2"
        // );
      }
      if (this.baseInfoRuleForm.selectUser2 === "") {
        this.baseInfoRuleForm.selectUser2 = null;
      }
      this.$refs["baseInfoRuleForm"].validate(valid => {
        if (valid) {
          if (this.addMenu) {
            // 新增
            let attr = [];
            // console.log(this.addInputList, 0);
            let msg = {
              dataStandardVO: {
                // id: this.sendInstanceId, // 目录节点id
                parentId: this.sendInstanceId, // 目录节点id
                code: this.baseInfoRuleForm.menuCode, // 目录代码
                name: this.baseInfoRuleForm.cnName, // 名称
                attributes: []
              },
              parentPathCn: this.deleteMenu.name, // 上级目录cn
              parentPathEn: this.deleteMenu.namespace, // 上级目录en
              user: {
                userId: this.catalogData.selectUser
              },
              group: {
                groupId: this.catalogData.selectGroup
              }
            };
            this.editInputList.map(item => {
              // console.log(item);
              for (let a in this.baseInfoRuleForm) {
                if (item.attrStore === a) {
                  if (item.attCode === "Standard_type") {
                    attr.push({ attrStore: a, value: this.classifierId });
                  } else {
                    attr.push({
                      attrStore: a,
                      value: this.baseInfoRuleForm[a]
                    });
                  }
                }
              }
            });
            msg.dataStandardVO.attributes = attr;
            // console.log("新增目录参数", msg);
            postByJson("/ds/saveCatalogue", msg).then(res => {
              // console.log(res, "01");
              if (res.code === 10000 && res.success) {
                this.$message.success(res.message);
                this.bIsCatalogVisible = false;
                // 没有子节点  新增 删除后刷新父节点
                if (this.nodeIsLeaf) {
                  this.refreshLazyTree(this.node.parent);
                } else {
                  this.refreshLazyTree(this.node);
                }
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            // 编辑
            // console.log(this.getEditList, 1)
            // console.log(this.baseInfoRuleForm, 2)
            let attr = [];
            let msg = {
              dataStandardVO: {
                id: this.sendInstanceId, // 目录节点id
                code: this.baseInfoRuleForm.menuCode, // 目录代码
                name: this.baseInfoRuleForm.cnName, // 名称
                attributes: []
              },
              parentPathCn: this.getEditList.parentPathCn, // 上级目录cn
              parentPathEn: this.getEditList.parentPathEn, // 上级目录en
              user: {
                userId: this.catalogData.selectUser
                // userId: this.wData.userTag.userId
              },
              group: {
                groupId: this.catalogData.selectGroup
              }
            };
            this.editInputList.map(item => {
              for (let a in this.baseInfoRuleForm) {
                if (item.attrStore === a) {
                  if (item.attCode === "Standard_type") {
                    attr.push({ attrStore: a, value: this.classifierId });
                  } else {
                    attr.push({
                      attrStore: a,
                      value: this.baseInfoRuleForm[a]
                    });
                  }
                }
              }
            });
            msg.dataStandardVO.attributes = attr;
            // console.log("编辑目录参数", msg);
            postByJson("/ds/saveCatalogue", msg).then(res => {
              // console.log(res, "01");
              if (res.code === 10000 && res.success) {
                this.refreshLazyTree(this.node.parent);
                this.$message.success(res.message);
                this.bIsCatalogVisible = false;
                if (this.ifCurrentNode) {
                  this.getCatalogDetail(true);
                }
              } else {
                this.$message.error(res.message);
              }
            });
          }
        } else {
          // console.log("error");
          // this.$message.error("请填写必填项！");
          return false;
        }
      });
    },
    // 责任人 tree点击
    handleUserNodeClick(node, data, component) {
      // console.log(node);
      // console.log(data);
      if (!node.groupName) {
        this.userTagList = { id: node.userId, username: node.userName };
      }
      // console.log(this.userTagList, 1);
    },
    // 选择用户 - 确定
    toSaveUser() {
      this.bIsUserVisible = false;
      this.dutyUserId = this.userTagList.id;
    },
    // 判断鼠标点击 显示隐藏 tree的目录
    clickBox(e) {
      // console.log(this.$refs.rightMenu.contains(e.target), e.target, '判断鼠标点击')
      if (!this.$refs.rightMenu.contains(e.target)) {
        this.showMenu = false;
      }
    },
    // 修改目录
    toEditCatalog() {
      this.showMenu = false;
      this.addMenu = false;
      this.isCodeInput = true;
      this.toAddUserShow(); // 获取部门列表
      get("/ds/getCatlogDetail", {
        id: this.editMenuId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          // console.log("修改目录-getCatlogDetail", res.data)
          this.editInputList = [];
          this.getEditList = res.data;
          res.data.dataStandardVO.attributes.map(item => {
            // console.log(item);
            if (item.columnType === "combobox") {
              get("/ds/listStandardAttrComboboxInfos", {
                columnTypeValue: item.datatypeId
              }).then(res => {
                // console.log(res, "96");
                item.selectList = res.data;
                if (
                  item.attrCode === "Standard_type" ||
                item.attCode === "Standard_type"
                ) {
                  this.classifyList.map(item1 => {
                    // console.log(item);
                    if (item1.classifierName === this.classifyName) {
                      this.classifierId = item1.classifierId;
                      this.classifierName = item1.classifierName;
                      this.baseInfoRuleForm[item.attrStore] = item1.classifierName;
                    }
                  })
                }
                this.editInputList.push(item);
              });
            } else {
              this.editInputList.push(item);
            }
            this.baseInfoRuleForm[item.attrStore] = item.value;
          });
          this.baseInfoRuleForm.menuCode = res.data.dataStandardVO.code;
          this.baseInfoRuleForm.cnName = res.data.dataStandardVO.name;
          if (res.data.group) {
            this.baseInfoRuleForm.selectGroup2 = res.data.group.groupName;
            this.baseInfoRuleForm.selectUser2 = res.data.user.username;
          } else {
            this.baseInfoRuleForm.selectGroup2 = null;
            this.baseInfoRuleForm.selectUser2 = null;
          }
          this.baseInfoRuleForm.catalog = res.data.parentPathCn;
          this.namespace = res.data.parentPathEn;
          this.sendInstanceId = res.data.dataStandardVO.id;
          let EditMsg = res.data;
          // if (EditMsg.belongCn) {
          //   this.standardShow = true;
          //   this.getListClassifier();
          // }
          this.getListClassifier();
          if (EditMsg.purport) {
            this.catalogMean = true;
          }
          this.bIsCatalogVisible = true;
          if (res.data.group) {
            this.catalogData.selectGroup = res.data.group.groupId;
            get(
              `sys/user/listUserInGroup?groupId=${this.catalogData.selectGroup}`
            ).then(res2 => {
              if (res2.code === 10000 && res2.success) {
                // this.catalogData.userList = res2.data;
                this.catalogData.userList = [];
                this.catalogData.userListCopy = [];
                if (res2.data.length > 0) {
                  res2.data.map(val => {
                    let pname = pinyin(val.userName, {
                      style: pinyin.STYLE_NORMAL, // 设置拼音风格
                      heteronym: true
                    });
                    let newpname = "";
                    pname.map(val2 => {
                      if (val2.length > 1) {
                        newpname += val2[0];
                      } else {
                        newpname += val2;
                      }
                    });
                    let spname = pinyin(val.userName, {
                      style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
                      heteronym: true
                    });
                    let newspname = "";
                    spname.map(val2 => {
                      if (val2.length > 1) {
                        newspname += val2[0];
                      } else {
                        newspname += val2;
                      }
                    });
                    let obj = {
                      userId: val.userId,
                      userName: val.userName,
                      pname: newpname,
                      spname: newspname
                    };
                    this.catalogData.userList.push(obj);
                    this.catalogData.userListCopy.push(obj);
                  });
                }
                // console.log(
                //   this.catalogData.userList,
                //   this.catalogData.userListCopy,
                //   2222
                // );
                if (res.data.user) {
                  this.catalogData.selectUser = res.data.user.userId;
                } else {
                  this.catalogData.selectUser = null;
                  this.catalogData.selectUser2 = null;
                }
                // console.log(this.catalogData.selectUser)
              }
            });
          } else {
            this.catalogData.selectGroup = null;
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 删除目录
    showDeleteDialog() {
      this.isDeleteMenu = true;
      this.showMenu = false;
      this.deleteDialog = true;
      this.$nextTick(() => {
        this.$refs.deleteMenuDialog.getAllMsg(this.deleteMenu.id);
      });
    },
    toDelCatalog() {
      this.showMenu = false;
      this.$confirm(
        "您的操作将会永久删除所选标准及其相关关系，确定继续吗?",
        "警告",
        {
          confirmButtonText: "继续",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const load = loading("删除中...");
          get("/ds/removeCatalogue", {
            id: this.deleteMenu.id
          }).then(res => {
            if (res.code === 10000 && res.success) {
              this.$message.success("删除成功!");
              load.close()
              this.Breadcrumb.map((item, index) => {
                if (item.id === this.node.data.id) {
                  this.Breadcrumb.splice(index, this.Breadcrumb.length);
                }
              });
              if (this.node.parent.childNodes.length > 1) {
                this.refreshLazyTree(this.node.parent);
              } else {
                this.refreshLazyTree(this.node.parent.parent);
              }
              this.instanceId = this.node.parent.data.id
              this.searchForm = {
                keyword: "",
                isPublish: ""
              }
              this.icurrentPage = 1;
              this.queryTableList();
              this.deleteDialog = false;
            } else {
              this.$message.error(res.message);
              load.close()
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    refreshLazyTree(node) {
      let params = {
        nodeId: node.data.id,
        nodeType: node.data.notetype
      };
      // console.log("refreshLazyTree--params", params)
      get("/ds/bizTerm/listBuzTermTree", params).then(res => {
        if (res.success && res.code === 10000 && res.success) {
          // console.log("refreshLazyTree--res", res)
          const list = res.data.map(item => {
            item.isLeaf = item.leaf;
            return item;
          });
          node.childNodes = [];
          node.doCreateChildren(list);
          this.$nextTick(() => {
            if (this.noSonTree) {
              this.aIsExpandedArr = [];
              this.aIsExpandedArr.push(this.noSonTree.data.uuid);
              // 设置默认节点高亮
              this.$refs.tree.setCurrentKey(this.noSonTree.data.id);
            }
          })
        }
      });
    },
    // 点击面包屑，定位到树tree节点展开
    toClickBreadcrumb(item) {
      // console.log("点击面包屑，定位到树tree节点展开", item)
      this.searchNode(this.nodeFirst, item.id)
      this.aIsExpandedArr = [];
      this.aIsExpandedArr.push(item.id);
      // 设置默认节点高亮
      this.$refs.tree.setCurrentKey(item.id);
      // 同时更新信息项列表数据
      if (item.notetype === "metadata") {
        // 元数据类型为metadata时，查询右侧信息项列表
        this.instanceId = item.id;
        // 获取右侧主数据信息项的列表
      } else {
        this.instanceId = "";
      }
      this.searchForm = {
        keyword: "",
        isPublish: ""
      }
      this.icurrentPage = 1;
      this.queryTableList();
      let len = this.Breadcrumb.length - 1;
      this.Breadcrumb.map((val, index) => {
        if (val.level === item.level && val.id === item.id) {
          this.Breadcrumb.splice(index + 1, len);
        }
      });
    },
    searchNode(node, id) {
      // console.log(node)
      node.childNodes.map(item => {
        // console.log(item.data.id, id)
        if (item.data.id === id) {
          this.noSonTree = ""
          this.refreshLazyTree(item);
          setTimeout(() => {
            this.$refs.tree.setCurrentKey(item.data.id);
          }, 500);
          return
        } else {
          this.searchNode(item, id)
        }
      })
    },
    // handleSelectionChange(val) {
    //   console.log(val);
    //   // this.multipleSelection = val;
    // },

    // 获取登录用户的所有视图
    getView() {
      get("/ds/listAllViews").then(res => {
        // console.log("获取登录用户的所有视图", res)
        if (res.code === 10000 && res.success === true) {
          this.aViewDataList = res.data;
          let isDefultShowFlag = false;
          res.data.find((item, index) => {
            if (item.defultShow) {
              // 如果defultShow有为true的，则视图默认显示此数据，没有则默认显示系统视图
              this.sViewId = item.id;
              this.value = item.name;
              isDefultShowFlag = true;
              this.viewId = item.id
              return;
            }
          });
          if (!isDefultShowFlag) {
            // defultShow没有为true的，默认显示系统视图
            res.data.forEach((item, index) => {
              if (item.id === "0") {
                // 显示系统视图
                this.value = item.name;
                this.sViewId = item.id;
                this.viewId = item.id
              }
            });
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },

    refreshTree(node) {
      this.refreshload = true
      if (this.clickNode !== "") {
        this.refreshLazyTree(this.clickNode);
        this.instanceId = this.clickNode.data.id;
        this.aIsExpandedArr = [];
        this.aIsExpandedArr.push(this.clickNode.data.id);
        this.$refs.tree.setCurrentKey(this.clickNode.data.id);
      } else {
        this.instanceId = "";
      }
      this.searchForm = {
        keyword: "",
        isPublish: ""
      }
      this.icurrentPage = 1;
      this.queryTableList();
      this.$nextTick(() => {
        this.refreshload = false
      });
    },
    // Tree懒加载 - 获取主数据层级关系树结构 /masterData/dsMDTree
    loadNode(node, resolve) {
      this.node = node;
      this.resolve = resolve;
      // console.log("111111111", node, resolve)
      if (node.level === 0) {
        this.nodeFirst = node;
        this.resolveFirst = resolve;
        get("/ds/bizTerm/listBuzTermTree", {
          // 初始化页面的tree时，id和nodeType都为空
          nodeId: this.sViewId,
          nodeType: this.sNodeType
        }).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.treeLoading = false;
            res.data.map(item => {
              item.isLeaf = item.leaf;
              return item;
            });
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        let params = {
          nodeId: node.data.id,
          nodeType: node.data.notetype
        };
        get("/ds/bizTerm/listBuzTermTree", params).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.treeLoading = false;
            res.data.map(item => {
              item.isLeaf = item.leaf;
              return item;
            });
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    renderContent(h, params) {
      // console.log("renderContent:params", params)
      let sText = params.data.name;
      let iconType = "";
      if (params.data.notetype === "metadata") {
        iconType = "icon icon-" + params.data.classifierId;
      } else {
        iconType = "icon icon-" + params.data.notetype;
      }
      if (params.data.notetype === "class") {
        iconType = "icon icon-" + params.data.classifierId;
      }
      if (params.data.isEntity === "是" || params.data.isEntity === "T") {
        iconType = "icon icon-Entity";
      }
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
    // 视图切换
    changeView(val) {
      this.instanceId = "";
      // 信息项数据
      this.treeLoading = true;
      this.searchForm = {
        keyword: "",
        isPublish: ""
      }
      this.viewId = val
      this.Breadcrumb = [{ name: "全部", isDisabled: true }]
      this.icurrentPage = 1;
      this.queryTableList();
      if (val === "") {
        // 点击层级关系旁边的 刷新按钮时
        this.getView();
      }
      this.sViewId = val;
      // console.log("this.nodeFirst, this.resolveFirst", this.nodeFirst, this.resolveFirst)
      this.nodeFirst.childNodes = [];
      this.sNodeType = "view"; // 切换视图时，查询层级关系的tree时，nodeType传值 ’view‘
      // console.log("this.nodeFirst, this.resolveFirst2", this.nodeFirst, this.resolveFirst)
      this.loadNode(this.nodeFirst, this.resolveFirst);
    },
    // 点击Tree节点
    handleNodeClick(data, node, resolve) {
      var count = ++this.count;
      this.$refs.tree.setCurrentKey(data.id);
      if (data.namespace) {
        this.toAddMsg.namespace = data.namespace;
        this.toAddMsg.data = node;
      } else {
        this.toAddMsg.namespace = "";
        this.toAddMsg.data = "";
      }
      node.childNodes.map(item => {
        item.expanded = false;
      });
      this.searchForm = {
        keyword: "",
        isPublish: ""
      }
      // console.log("点击Tree节点,data, node, resolve", data, node, resolve);
      console.log(`当前node的层级：${node.level}`)
      if (data.classifierId) {
        if (data.classifierId.indexOf("Parent") !== -1) {
          // this.classifierName = data.name;
          this.classifyName = data.name;
        }
      }
      this.clickNode = node;
      this.node = node;
      this.noSonTree = node;
      if (data.id !== this.editMenuId) {
        this.showComponent = "card";
      }

      this.aIsExpandedArr = [];
      this.clickNode = node;
      this.node = node;
      data.level = node.level;
      // this.node = node;
      if (data.id !== this.editMenuId) {
        this.showComponent = "card";
      }
      let len = this.Breadcrumb.length - 1;
      if (this.Breadcrumb.length > 1) {
        this.Breadcrumb.map((item, index) => {
          if (item.level === node.level) {
            // console.log("level");
            this.Breadcrumb.splice(index, len);
          }
        });
        if (node.isLeaf) {
          this.refreshLazyTree(node.parent);
        }
        this.noSonTree = node;
      }

      if (data.classifierId === "Context") {
        get(`/ds/details/${data.id}`).then(res => {
          if (res.code === 10000 && res.success) {
            res.data.attributes.map(i => {
              if (i.attrCode === "Tag") {
                data.tipValue = i.value;
                data.isDisabled = false;
                data.level = node.level;
                if (!this.Breadcrumb.includes(data)) {
                  this.Breadcrumb.push(data);
                }
              }
            });
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        data.tipValue = "";
        data.isDisabled = true;
        this.Breadcrumb.push(data);
      }

      this.sNodeType = data.notetype;
      if (data.notetype === "metadata") {
        // 元数据类型为metadata时，查询右侧信息项列表
        this.instanceId = data.id;
        // 获取右侧主数据信息项的列表
        this.icurrentPage = 1;
        // this.queryTableList();

        this.tableLoading = true;
        let params = {
          current: this.icurrentPage,
          size: this.ipageSize,
          ancestorId: this.instanceId,
          classifierId: this.classifierId,
          keyword: this.searchForm.keyword,
          prop: this.searchForm.keyword === "" ? "" : this.searchForm.isPublish
        };
        get("/ds/customSearch", params).then(res => {
          console.log(count, this.count, 'count')
          if (res.code === 10000) {
            if (count === this.count) {
              this.tableData = res.data.records;
              this.total = res.data.total;
              this.tableHeader2 = res.extras.headers;
              this.tableLoading = false;
            }
          }
        });
      }
    },

    getShow(arr) {
      // console.log(arr, 33)
      if (arr !== undefined) {
        arr.expanded = false;
        arr.childNodes.map(val => {
          if (val.expanded === true) {
            val.expanded = false;
            this.getShow(val);
          }
        });
      }
    },
    // 修改列表一页数据大小
    handleSizeChange(value) {
      this.ipageSize = value;
      this.queryTableList();
    },
    handleCurrentChange(value) {
      this.icurrentPage = value;
      this.queryTableList();
    },
    // 刷新表格
    refreshData() {
      this.searchForm.keyword = "";
      this.searchForm.isPublish = "";
      this.icurrentPage = 1;
      this.queryTableList();
    },
    getAddCatalog() {
      get("/ds/getStandardContext", {
        namespace: this.node.data.namespace
      }).then(res => {
        // console.log("获取上级目录", res);
        if (res.code === 10000 && res.success) {
          this.pushAddCatalog = res.data;
          // console.log("获取上级目录 this.pushAddCatalog1", this.pushAddCatalog);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 跳转到新增页面
    goAdd() {
      this.oldCnName = ""
      // console.log(this.node)
      if (this.node.data) {
        // 用户视图  data有数据
        if (this.node.data.notetype !== 'view') {
          this.getPath("add");
          this.addItemDialog = true
        } else {
          // 点击view层  node.data有数据 nodetype等于view
          this.$message.warning("请选择挂载目录！")
        }
      } else if (this.node.childNodes[0].data.notetype !== 'view') {
        // 刚进入系统视图时  node的data为undefined childnodes[0]的data.notetype等于view
        this.getPath("add");
        this.addItemDialog = true
      } else {
        this.$message.warning("请选择挂载目录！")
      }
      // if (this.node.data && this.node.data.notetype !== "view") {
      //   this.getPath("add");
      // } else {
      //   this.$message.error("请勿直接在视图下新建信息项！");
      // }
    },
    // 编辑时判断是否选中一条数据
    clickeEit(row) {
      // this.goEdit(selectRow[0].instanceId, selectRow[0].instanceName);
      this.goEdit(row);
    },
    // 跳转到编辑页面
    goEdit(row) {
      this.oldCnName = ""
      this.addOrEditDioTitle = "编辑"
      this.editRow = row
      // console.log("11113", this.addItemDialog)
      this.getEditType(row)
      this.addItemDialog = true
      // this.$router.push({
      //   name: "professionalEdit",
      //   params: {
      //     id: row.instanceId,
      //     _title: row.instanceName,
      //     nodeList: this.Breadcrumb
      //   }
      // });
    },

    getEditType(row) {
      // console.log("1111", this.addItemDialog)
      // console.log("00000", row)
      get('/ds/bizTerm/getBuzTermAttrInfos', {
        buzTermId: row.instanceId
      }).then(res => {
        if (res.code === 10000 && res.success) {
        // console.log("12", this.addItemDialog)
          this.inputData = res.data;
          // console.log("this.ruleForm2[val.columnName]---res.data", res.data)
          this.inputData.map((val, index) => {
            if (val.columnName) {
              this.ruleForm2[val.columnName] = val.attrValue;
              this.oldCnName = this.ruleForm2["INSTANCE_NAME"]
              if (val.columnName === "SUP_ID") { // 获取parentId
                this.parentId = val.attrValue
              }
              // bus.$emit("oldCnName", this.oldCnName)
              bus.$on(val.columnName, (e) => {
                // console.log("eeeeeeeee", val.columnName, e)
                this.ruleForm2[val.columnName] = e
                // console.log("that.ruleForm2[val.columnName]", that.ruleForm2[val.columnName])
              })
            }
          })
          this.inputData.map((val, index) => {
            if (val.columnName === "PARENT_ID") { // 获取parentId(PARENT_ID或INSTANCE_NAME)
              this.$set(this.inputData[index], 'attrValueId', this.parentId)
              this.$set(this.inputData[index], 'instanceId', row.instanceId)
            }
          })
          this.$nextTick(() => {
            this.addItemDialogform = true
          });
        } else {
          this.addItemDialogform = true
        }
        // console.log("this.inputData---", this.inputData)
      })
    },
    getEditInputData(formName) {
      this.isSaveBtdis = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addItem = true
          if (this.hasNoRepeat) {
            this.addItem = true
            this.saveEditSure()
          }
        } else {
          this.$message.error("请按照提示输入");
          this.addItem = false
          this.isSaveBtdis = false
          return false;
        }
      });
    },
    saveEditSure() {
      // console.log("111saveEditSure", this.editRow)
      if (this.addItem) {
        let params = { instanceId: this.editRow.instanceId }
        this.inputData.map(val => {
          let columnName = this.underlineToHump(val.columnName)
          params[columnName] = this.$refs['input_' + val.columnName][0].inputData
        })
        post('/ds/bizTerm/updateBuzTerm', params).then(val => {
          if (val.code === 10000 & val.success) {
            this.isSaveBtdis = false
            this.addItem = false
            this.$message({
              message: val.message,
              type: 'success'
            });
            this.addItemDialog = false
            this.addItemDialogform = false
            this.setTree()
            // this.closeSelectedTag(this.$route)
            // this.$router.push({
            //   name: "professionalTerms",
            //   params: {
            //     nodeList: this.nodeList,
            //     addNode: this.addNode
            //   }
            // });
          } else {
            this.isSaveBtdis = false
            this.addItem = false
            this.$message.error(val.message);
          }
        })
      }
      // this.isSaveBtdis = false
    },
    // 跳转到详情页面
    goDetail(row) {
      this.showComponent = "detailItem";
      this.paramsForDetail = {
        id: row.instanceId,
        _title: row.instanceName,
        name: row.instanceName,
        nodeList: this.Breadcrumb,
        row: row
      }
    },
    // 删除
    deleteDataShow(item) {
      this.selectItem = item;
      this.isDeleteMenu = false;
      // let _this = this;
      // let selectRow = _this.$refs.table.selection;
      // let len = selectRow.length;
      if (item) {
        this.showMenu = false;
        this.deleteDialog = true;
        let idArr = [];
        idArr.push(item.instanceId);
        this.$nextTick(() => {
          this.$refs.deleteMenuDialog.activeFirst();
          this.$refs.deleteMenuDialog.getAllMsg(idArr.join(","));
        });
      }
    },
    deleteData() {
      // let _this = this;
      this.$confirm(
        "您的操作将会永久删除所选业务术语及其相关关系，确定继续吗?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        const load = loading("删除中...");
        let ids = [];
        ids.push(this.selectItem.instanceId);
        get("/ds/bizTerm/deleteBatchBuzTerms", { buzTermIds: ids.join(",") }).then(
          res => {
            if (res.code === 10000 && res.success === true) {
              this.$message.success(res.message);
              load.close()
              this.deleteDialog = false;
              this.icurrentPage = 1;
              this.searchForm = {
                keyword: "",
                isPublish: ""
              }
              this.queryTableList();
            } else {
              this.$message.error(res.message);
              load.close()
            }
          }
        );
      });
    },
    // 关系列表
    queryTableList() {
      // console.log("queryTableList()", this.classifierId)
      let count = ++this.count
      this.tableLoading = true;
      if (this.classifierId === "") {
        let className = "";
        get("/ds/bizTerm/listBuzTermTree").then(res => {
          get("/ds/application/rule/listClassifier").then(res => {
            this.classifyList = res.data;
            this.classifyList.map(val => {
              if (val.classifierName === className) {
                this.classifierId = val.classifierId;
              }
            });
            this.getSearchList();
            let params = {
              current: this.icurrentPage,
              size: this.ipageSize,
              ancestorId: this.instanceId,
              classifierId: "BizTermInfoItem",
              keyword: this.searchForm.keyword,
              prop:
                this.searchForm.keyword === "" ? "" : this.searchForm.isPublish
            };
            get("/ds/customSearch", params).then(res => {
              if (res.code === 10000) {
                if (count === this.count) {
                  this.tableData = res.data.records;
                  this.total = res.data.total;
                  this.tableHeader2 = res.extras.headers;
                  this.tableLoading = false;
                }
              }
            });
          });
        });
      } else {
        let params = {
          current: this.icurrentPage,
          size: this.ipageSize,
          ancestorId: this.instanceId,
          classifierId: this.classifierId,
          keyword: this.searchForm.keyword,
          prop: this.searchForm.keyword === "" ? "" : this.searchForm.isPublish
        };
        get("/ds/customSearch", params).then(res => {
          if (res.code === 10000) {
            this.tableData = res.data.records;
            this.total = res.data.total;
            this.tableHeader2 = res.extras.headers;
            this.tableLoading = false;
          }
        });
        this.getSearchList();
      }
    },
    // 获取标准属性下拉框值
    getSearchList() {
      get("/ds/listCustomSearchLabels", {
        classifierId: "BizTermInfoItem"
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.isPublishStateList = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },

    // 跳转到血缘分析
    handleCommand(command) {
      // console.log("commandcommand", command)
      // console.log("this.$route.params.name", this.$route.params.name)
      let _this = this;
      let selectRow = _this.$refs.table.selection;
      let len = selectRow.length;
      if (len !== 1) {
        _this.$message.warning("请选中一条数据");
        return;
      } else {
        this.$router.push({
          name: "dsLineageAnalysisCanvas",
          params: {
            dataFlowType: command,
            id: selectRow[0].instanceId,
            _title: generateLineageTitle(command, selectRow[0].instanceName)
          }
        });
      }
    },
    handleBlood2(command, obj) {
      this.$router.push({
        name: "dsLineageAnalysisCanvas",
        params: {
          dataFlowType: command,
          id: obj.instanceId,
          _title: generateLineageTitle(
            command,
            obj.instanceName
          )
        }
      });
    },
    // 新增界面跳转  面包屑设置
    setBreadcrumb(val) {
      if (val.data.id) {
        get(`/ds/details/${val.data.id}`).then(res => {
          if (res.code === 10000 && res.success) {
            res.data.attributes.map(i => {
              if (i.attrCode === "Tag") {
                val.data.tipValue = i.value;
                val.data.isDisabled = false;
                this.setBreadList.splice(1, 0, val.data);
                // 新增的tree不是懒加载
                // 没有挂载点 规则
              }
            });
            if (this.viewId === '0') {
              // console.log(this.nodeFirst, 'nodeFirst')
              if (val.parent.data.length > 0) {
                let viewNode = this.nodeFirst.childNodes[0].data;
                viewNode.isDisabled = true;
                viewNode.tipValue = "";
                viewNode.level = this.nodeFirst.childNodes[0].level;
                this.setBreadList.splice(1, 0, viewNode);
                let node = this.nodeFirst.childNodes[0].childNodes[0].data;
                node.isDisabled = true;
                node.tipValue = "";
                node.level = this.nodeFirst.childNodes[0].childNodes[0].level;
                this.setBreadList.splice(2, 0, node);
              } else {
                this.setBreadcrumb(val.parent, 1);
              }
            } else {
              if (val.parent.data.length > 0) {
                let node = this.nodeFirst.childNodes[0].data;
                node.isDisabled = true;
                node.tipValue = "";
                node.level = this.nodeFirst.childNodes[0].level;
                this.setBreadList.splice(1, 0, node);
              } else {
                this.setBreadcrumb(val.parent, 1);
              }
            }
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    // 新增或者编辑返回后树和面包屑定位
    setTree() {
      this.showToolTip = true
      // console.log(this.nodeFirst)
      if (this.nodeList && this.addNode) {
        // console.log("this.nodeList && this.addNode", this.nodeList, this.addNode)
        // 再次新增规则   且  挂载点（路径）改变了
        let nodeList = this.nodeList;
        // console.log(nodeList, "nodeList");
        //  为系统视图  挂载点规则上还有一个规则目录
        if (this.viewId === '0') {
          nodeList.map(item => {
            item.data.level = item.level + 2
            return item
          })
          // console.log(this.nodeFirst);
          // 关闭所有展开的子节点
          this.nodeFirst.childNodes[0].childNodes[0].childNodes.map(item => {
            item.expanded = false;
          });
          // toAddMsg 是后面再次新增规则跳转传参
          this.toAddMsg.node = nodeList[nodeList.length - 1];
          this.toAddMsg.namespace = nodeList[nodeList.length - 1].data.namespace;
          // 展开第一个父节点 规则
          this.aIsExpandedArr = [];
          this.aIsExpandedArr.push(this.nodeFirst.childNodes[0].data.id);
          this.nodeId = this.nodeFirst.childNodes[0].data.id;
          this.instanceId = this.nodeFirst.childNodes[0].data.id;
          // 设置高亮
          this.$refs.tree.setCurrentKey(this.nodeFirst.childNodes[0].data.id);
          // 懒加载树  获取childNodes数据需要一定时间
          setTimeout(() => {
          // 重新设置展开节点 挂载点规则
            this.aIsExpandedArr = [];
            this.aIsExpandedArr.push(
              this.nodeFirst.childNodes[0].childNodes[0].data.id
            );
            // 通过绑定的node-key  依次展开节点 并设置高亮
            nodeList.map((item, index) => {
              setTimeout(() => {
                this.aIsExpandedArr = [];
                this.aIsExpandedArr.push(item.data.id);
                this.nodeId = item.data.id;
                this.instanceId = item.data.id;
                this.$refs.tree.setCurrentKey(item.data.id);
              }, index * 500);
            });
          }, 500);
        } else {
          nodeList.map(item => {
            item.data.level = item.level + 1
            return item
          })
          // 非系统视图   挂载点规则为最上层节点
          this.toAddMsg.node = nodeList[nodeList.length - 1];
          this.toAddMsg.namespace = nodeList[nodeList.length - 1].data.namespace;
          let node = this.nodeFirst.childNodes[0];
          this.refreshLazyTree(node);
          nodeList.map((item, index) => {
            setTimeout(() => {
              this.aIsExpandedArr = [];
              this.aIsExpandedArr.push(item.data.id);
              this.nodeId = item.data.id;
              this.instanceId = item.data.id;
              this.$refs.tree.setCurrentKey(item.data.id);
            }, index * 500);
          });
        }
        // 当前节点id   用来获取table数据
        this.nodeId = nodeList[nodeList.length - 1].data.id;
        this.instanceId = nodeList[nodeList.length - 1].data.id;
        // 获取table数据
        this.queryTableList();
        // 重置面包屑
        this.Breadcrumb = [{ name: "全部", isDisabled: true }];
        this.setBreadList = [{ name: "全部", isDisabled: true }];
        // 调用方法 处理面包屑的赋值
        this.setBreadcrumb(nodeList[nodeList.length - 1]);
        this.Breadcrumb = this.setBreadList;
      } else if (this.nodeList && !this.addNode) {
      // 再次新增规则   且  挂载没变
        // this.Breadcrumb = this.nodeList;
        this.queryTableList();
      } else {
      // 未新增规则
        this.queryTableList();
      }
    },
    getClassifierBef() {
      get("/ds/application/rule/listClassifier").then(res => {
        this.classifyList = res.data;
      })
    }
  },
  // activated() {
  //   this.showToolTip = true
  //   console.log(this.nodeFirst)
  //   if (this.nodeList && this.addNode) {
  //     console.log("this.nodeList && this.addNode", this.nodeList, this.addNode)
  //     // 再次新增规则   且  挂载点（路径）改变了
  //     let nodeList = this.nodeList;
  //     console.log(nodeList, "nodeList");
  //     //  为系统视图  挂载点规则上还有一个规则目录
  //     if (this.viewId === '0') {
  //       nodeList.map(item => {
  //         item.data.level = item.level + 2
  //         return item
  //       })
  //       console.log(this.nodeFirst);
  //       // 关闭所有展开的子节点
  //       this.nodeFirst.childNodes[0].childNodes[0].childNodes.map(item => {
  //         item.expanded = false;
  //       });
  //       // toAddMsg 是后面再次新增规则跳转传参
  //       this.toAddMsg.node = nodeList[nodeList.length - 1];
  //       this.toAddMsg.namespace = nodeList[nodeList.length - 1].data.namespace;
  //       // 展开第一个父节点 规则
  //       this.aIsExpandedArr = [];
  //       this.aIsExpandedArr.push(this.nodeFirst.childNodes[0].data.id);
  //       this.nodeId = this.nodeFirst.childNodes[0].data.id;
  //       this.instanceId = this.nodeFirst.childNodes[0].data.id;
  //       // 设置高亮
  //       this.$refs.tree.setCurrentKey(this.nodeFirst.childNodes[0].data.id);
  //       // 懒加载树  获取childNodes数据需要一定时间
  //       setTimeout(() => {
  //         // 重新设置展开节点 挂载点规则
  //         this.aIsExpandedArr = [];
  //         this.aIsExpandedArr.push(
  //           this.nodeFirst.childNodes[0].childNodes[0].data.id
  //         );
  //         // 通过绑定的node-key  依次展开节点 并设置高亮
  //         nodeList.map((item, index) => {
  //           setTimeout(() => {
  //             this.aIsExpandedArr = [];
  //             this.aIsExpandedArr.push(item.data.id);
  //             this.nodeId = item.data.id;
  //             this.instanceId = item.data.id;
  //             this.$refs.tree.setCurrentKey(item.data.id);
  //           }, index * 500);
  //         });
  //       }, 500);
  //     } else {
  //       nodeList.map(item => {
  //         item.data.level = item.level + 1
  //         return item
  //       })
  //       // 非系统视图   挂载点规则为最上层节点
  //       this.toAddMsg.node = nodeList[nodeList.length - 1];
  //       this.toAddMsg.namespace = nodeList[nodeList.length - 1].data.namespace;
  //       let node = this.nodeFirst.childNodes[0];
  //       this.refreshLazyTree(node);
  //       nodeList.map((item, index) => {
  //         setTimeout(() => {
  //           this.aIsExpandedArr = [];
  //           this.aIsExpandedArr.push(item.data.id);
  //           this.nodeId = item.data.id;
  //           this.instanceId = item.data.id;
  //           this.$refs.tree.setCurrentKey(item.data.id);
  //         }, index * 500);
  //       });
  //     }
  //     // 当前节点id   用来获取table数据
  //     this.nodeId = nodeList[nodeList.length - 1].data.id;
  //     this.instanceId = nodeList[nodeList.length - 1].data.id;
  //     // 获取table数据
  //     this.queryTableList();
  //     // 重置面包屑
  //     this.Breadcrumb = [{ name: "全部", isDisabled: true }];
  //     this.setBreadList = [{ name: "全部", isDisabled: true }];
  //     // 调用方法 处理面包屑的赋值
  //     this.setBreadcrumb(nodeList[nodeList.length - 1]);
  //     this.Breadcrumb = this.setBreadList;
  //   } else if (this.nodeList && !this.addNode) {
  //     // 再次新增规则   且  挂载没变
  //     this.Breadcrumb = this.nodeList;
  //     this.queryTableList();
  //   } else {
  //     // 未新增规则
  //     this.queryTableList();
  //   }
  // },
  deactivated() {
    // this.showToolTip = false
  },
  created() {
    this.getListFeature();
    this.queryTableList();
    this.getView();
    this.getClassifierBef()
  },
  mounted() {
    // 新增时当路径改变时接收数据
    bus.$on('getNodeArr', (msg) => {
      if (msg === this.Breadcrumb) {
        this.addNode = false
      } else {
        this.addNode = true
        this.nodeList = msg
      }
    })
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "../../styles/treeIcon";
@import "../../styles/variables";
.professionalTerms-box {
  .table-box {
    overflow-y: auto;
    width: 100%;
    height: calc(100vh - 305px);
    margin-top:10px;
    .preview,.deleteRed,.editor,.multilink{
      width:22px;
      height:22px;
    }
  }
  /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 5px;
    height: 7px;
  }
  /deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
    background: none;
    border-radius: 2px;
  }
  /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background: rgb(239, 239, 239);
    border-radius: 10px;
  }
  /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
    background: #bfbfbf;
  }
  .table-box::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }
  .table-box::-webkit-scrollbar-track {
    background: none;
    border-radius: 2px;
  }
  .table-box::-webkit-scrollbar-thumb {
    background: rgb(239, 239, 239);
    border-radius: 10px;
  }
  .table-box::-webkit-scrollbar-thumb:hover {
    background: #bfbfbf;
  }
  //表格表头背景颜色
  .el-table thead tr th {
    background-color: #f8f8f9;
    div.cell {
      color: #666666;
    }
  }
  //去掉多选框右边的border
  .el-table thead tr th:first-child,
  .el-table tr td:first-child {
    border-right: none;
  }
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
  top: 0;
  left: 0;
  bottom: 0;
  background-color: $page-bg;
  .content-box {
    position: absolute;
    width: 100%;
    height: calc(100vh - 84px);
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
    .el-container {
      padding: 10px;
    }
    .el-main {
      margin-left: 10px;
      padding: 0;
    }
    .resize {
      right: 5px;
    }
    .resize:hover {
      cursor: e-resize;
    }
    //tree 右键菜单
    .context-menu {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 10;
      font-size: 14px;
      // display:none;
      .el-card {
        .el-card__body {
          padding: 0px;
        }
        .el-row {
          padding: 10px 15px 10px;
          font-size: 12px;
          cursor: pointer;
        }
        .el-row:hover {
          background-color: #f8f8f9;
        }
      }
    }
    .left-box {
      height: 100%;
      .el-card {
        height: 100%;
        .el-card__body {
          padding: 16px;
          position: relative;
          .title {
            font-family: "PingFangSC-Regular", "PingFang SC";
            font-weight: 400;
            font-style: normal;
            position: relative;
            font-size: 16px;
            border-bottom: 1px solid $border;
            padding: 0 10px 10px 10px;
            font-weight: bold;
            line-height: 26px;
            button {
              float: right;
              width: 36px;
              height: 30px;
              i::before {
                font-size: 18px;
                position: relative;
                top: -4px;
                left: -7px;
              }
            }
            .isfolding {
              float: left;
              width: 40px;
              height: 30px;
            }
          }
          .md-tree {
            height: calc(100vh - 210px);
            margin-top:10px;
            overflow-y: auto;
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

          .md-tree::-webkit-scrollbar {
            width: 5px;
            height: 10px;
          }
          .md-tree::-webkit-scrollbar-track {
            background: rgb(239, 239, 239);
            border-radius: 2px;
          }
          .md-tree::-webkit-scrollbar-thumb {
            background: #bfbfbf;
            border-radius: 10px;
          }
          .md-tree::-webkit-scrollbar-thumb:hover {
            background: #999;
          }

          .view-filter {
            position: relative;
            font-size: 16px;
            border-top: 1px solid $border;
            padding: 10px 10px 0 10px;
            font-weight: bold;
            .tl {
              line-height: 36px;
            }
            .el-select {
              position: absolute;
              right: 0;
              width: 150px;
              font-weight: normal;
            }
          }
        }
      }
    }
    .right-box {
      flex: 1;
      position: relative;
      height: 100%;
      .el-card {
        width: 100%;
        height: 100%;
        .el-card__body {
          padding: 16px;
          position: relative;
          .no-data {
            width: 500px;
            height: 457px;
            background: url("../../assets/images/commonIcon/no-data.png")
              no-repeat;
            background-size: 500px 457px;
            margin: 30px auto;
          }
          .tTitle {
            position: relative;
            height: 38px;
            border-bottom: 1px solid #e9e9e9;
            margin-bottom: 20px;
            .bread-icon {
              position: absolute;
              display: inline-block;
              top: 9px;
              left: 0;
              width: 20px;
              height: 20px;
              background: url("../../assets/images/commonIcon/bread-icon.png")
                no-repeat;
              background-size: 100%;
            }
            .el-breadcrumb {
              position: absolute;
              left: 28px;
              font-size: 12px;
              top: 10px;
              line-height: 22px;
              .el-breadcrumb__inner {
                color: #409eff;
                cursor: pointer;
              }
            }
            .definition-list {
              width: 35px;
              height: 25px;
              position: absolute;
              right: 0;
              cursor: pointer;
            }
            .el-input {
              width: 220px;
              height: 32px;
              position: absolute;
              right: 0;
              .el-input__inner {
                height: 32px;
                line-height: 32px;
              }
              .el-input__icon {
                line-height: 32px;
              }
            }
            /deep/ .el-breadcrumb{
              height:18px;
              line-height:18px;
              text-align: center
            }
          }
          .btn-box {
            .el-button + .el-button {
              margin-left: 5px;
            }
            .blood-ana {
              display: inline-block;
              margin-left: 5px;
            }
            .dataTable-icon {
              position: absolute;
              display: inline-block;
              width: 18px;
              height: 18px;
              left: 8px;
              top: 6px;
            }
            .blood {
              background: url(../../../src/assets/images/commonIcon/blood-icon.png)
                no-repeat;
              background-size: 100%;
            }
            //按钮组样式 公共样式
            .btn {
              width: 67px;
              height: 30px;
              padding: 3px 9px 7px 8px;
              .svg-icon {
                width: 18px;
                height: 18px;
                top: 3px;
                position: relative;
              }
              .btn-text {
                font-size: 13px;
                line-height: 24px;
              }
            }
            //新增图标大小
            .btn.add {
              .svg-icon {
                width: 16px;
                height: 16px;
                top: 2px;
                position: relative;
              }
            }
          }
          .search {
            float: right;
            font-size: 12px;
            .el-form-item__label {
              font-size: 12px;
              line-height: 32px;
              padding-right: 2px;
            }
            .select-box {
              margin-right: 10px;
              .el-input {
                width: 140px;
              }
            }
            .el-input {
              width: 180px;
              height: 32px;
              .el-input__inner {
                height: 32px;
                line-height: 32px;
              }
              .el-input__icon {
                line-height: 32px;
              }
            }
          }
          .table-bt-box .el-button {
            font-size: 12px;
          }
        }
      }
    }
  }
  .cata-dialog,
  .delete-dialog {
    //对话框上、下分隔线
    /deep/ .el-dialog__wrapper {
      .el-dialog {
        border-radius: 5px;
        .el-dialog__header {
          border-bottom: 1px solid #e8ebed;
          .el-dialog__title {
            height: 20px;
            line-height: 20px;
            // font-size: 14px;
            color: #818181;
            font-weight: 700;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    /deep/ .el-dialog__wrapper {
      .el-dialog {
        .el-dialog__footer {
          border-top: 1px solid #e8ebed;
        }
      }
    }

    //form表单label标签的字体大小
    .el-form /deep/ .el-form-item {
      .el-form-item__label {
        font-size: 12px;
        color:#515a6e;
        font-weight:normal;
        padding-right: 5px;
      }
    }
  }
  /deep/ .el-table__fixed-right{
    height:100%!important;
  }
}
.definition {
  padding-left: 20px;
  .el-checkbox__label {
    display: block;
    float: right;
    padding: 0;
    width: calc(100% - 25px);
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    line-height: 32px;
  }
  .el-checkbox.is-bordered.el-checkbox--mini .el-checkbox__label {
    line-height: 32px;
  }
  .el-checkbox {
    width: 200px;
    margin: 0 0 10px 0 !important;
  }
}
.selfTable {
  /deep/ .el-dialog__footer {
    padding: 3px 20px 13px;
  }
  /deep/ .el-dialog__body {
    padding: 20px 12px 16px 12px;
  }
}
.delete-dialog {
  /deep/ .el-dialog__body {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
}
.addItemDialog-dialog{
   /deep/ .el-dialog__body {
    padding: 20px 15px 0 10px;
  }
  .form-body{
    width:550px;
    margin-left:5px
  }
.el-collapse {
      border: unset;
      // margin-top: 20px;
      .el-collapse-item__header {
        font-size: 14px;
        color: #666666;
        padding: 0 20px;
        margin-bottom: 10px;
        border-bottom: 0px solid rgba(233, 233, 233, 1);
      }
      /deep/ .el-collapse-item__wrap {
        border-bottom: unset;
      }
      /deep/ .el-collapse-item__content {
        font-family: "PingFangSC-Regular", "PingFang SC";
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        color: #666666;
        // padding: 20px 60px;
        overflow: hidden;
        padding: 10px 20px;
      }
  }
  .line {
    height: 70%;
    width: 4px;
    background: #579ef3;
    margin-right: 15px;
  }
}
.dialog-btn {
  text-align: center;
  border-top: 1px solid #e8ebed;
  padding: 10px;
  // margin: 0 -20px -20px;
}
</style>
