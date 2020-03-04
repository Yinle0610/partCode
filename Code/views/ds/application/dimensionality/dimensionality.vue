<template>
  <div class="dimensionality-container tableNoPadding" @click.capture="clickBox">
    <el-container style="position: relative;">
      <el-aside width="20%" class="leftdiv">
        <!-- 右键弹出框 -->
        <div ref="rightMenu" v-show="showMenu" class="context-menu">
          <el-card>
            <el-row v-show="EditDeltShow" @click.native="getCatalogDetail(false)">详细信息</el-row>
            <el-row v-permission="'DIM_ADD_CATALOG'" @click.native="toAddCatalog">新建目录</el-row>
            <el-row
              v-permission="'DIM_EDIT_CATALOG'"
              v-show="EditDeltShow"
              @click.native="toEditCatalog"
            >修改目录</el-row>
            <el-row
              v-permission="'DIM_DEL_CATALOG'"
              v-show="EditDeltShow"
              @click.native="showDeleteDialog"
            >删除目录</el-row>
            <el-row v-permission="'DIM_ADVANCED_SEARCH'" v-show="EditDeltShow">高级搜索</el-row>
            <el-row v-permission="'DIM_IMPORT'" v-show="EditDeltShow">导入标准</el-row>
            <el-row v-permission="'DIM_EXPORT'" @click.native="exportData">导出标准</el-row>
          </el-card>
        </div>
        <el-card>
          <div class="header">
            <!-- <svg-icon
                  @click.native="openTree"
                  class="openButton"
                  icon-class="icon-collapse"
            ></svg-icon>-->
            <p class="title">目录</p>
            <el-tooltip class="item" effect="dark" content="刷新" placement="top">
              <el-button
                icon="el-icon-refresh"
                size="mini"
                type="text"
                @click="getNewView2"
                :disabled="treeButtom"
                style="color:#606266;"
              ></el-button>
            </el-tooltip>
          </div>
          <div class="tree" v-loading="treeLoading">
            <el-tree
              :props="props"
              accordion
              :load="loadNode"
              node-key="id"
              ref="tree"
              lazy
              :highlight-current="true"
              empty-text="暂无数据"
              @node-click="handleNodeClick"
              @node-expand="handleNodeClick"
              @node-collapse="handleNodeClick"
              :render-content="renderContent"
              :default-expanded-keys="treeDown"
              :default-checked-keys="treeDown"
              @node-contextmenu="handleMouseRight"
              style="font-size:14px"
            ></el-tree>
          </div>
          <div class="footer">
            <p class="title">视图切换</p>
            <el-select v-model="value" placeholder="请选择" size="mini" @change="getNewView">
              <el-option
                v-for="item in viewChange"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </el-card>
      </el-aside>
      <el-aside
        style="background-color:#000;height: calc(100vh - 115px);width: 4px;position: relative;right:5px;opacity:0;"
        @mousedown.native.prevent="dragControllerDiv($event)"
        class="resize"
      ></el-aside>
      <el-main>
        <div class="shadow" v-if="showShadow"></div>
        <el-card shadow="hover" v-show="showComponent==='card' || showComponent==='cardMain'">
          <!-- <el-scrollbar class="page-scroll"> -->
            <div class="card-header">
              <i class="el-icon-location-outline" style="color:#606266;font-size:22px;"></i>
              <el-breadcrumb class="bIcon">
                <el-tooltip
                  placement="top"
                  v-for="( item, index ) in Breadcrumb"
                  :key="index"
                  :disabled="item.isDisabled"
                  :content="item.tipValue"
                >
                  <!-- <div slot="content">{{item.tooltipValue}}</div> -->
                  <el-breadcrumb-item
                    :key="index"
                    @click.native="toClickBreadcrumb(item)"
                  >{{item.name}}</el-breadcrumb-item>
                </el-tooltip>
              </el-breadcrumb>
              <!-- <el-breadcrumb separator="/">
                  <el-breadcrumb-item >全部</el-breadcrumb-item>
                  <el-tooltip placement="top" v-for="(item,index) in treeSelectArr" :key="item.id+index"    :disabled="item.tip?false:true" >
                  <div slot="content"> {{item.tip}} </div>
                  <el-breadcrumb-item  @click.native="treeSkip(item)">{{item.name}}</el-breadcrumb-item>
                  </el-tooltip>
              </el-breadcrumb>-->
              <el-tooltip class="item" effect="dark" content="自定义表头" placement="top">
                <svg-icon
                  @click.native="definitionList"
                  class="definition-list"
                  icon-class="icon-definitionList"
                ></svg-icon>
              </el-tooltip>
            </div>
            <div class="card-button">
              <el-button v-permission="'DIM_ADD'" type="primary" size="mini" class="zengjia" @click="gotoadd">
                <svg-icon icon-class="zengjia"></svg-icon>
                <span class="text">新增</span>
              </el-button>
              <el-button type="primary" size="mini" class="shuaxin" @click="getData(null)">
                <svg-icon icon-class="shuaxin"></svg-icon>
                <span class="text">刷新</span>
              </el-button>
              <el-dropdown @command="handleBlood">
                <el-button
                  class="basic-button fr"
                  style="width: 85px;padding: 6px 7px 7px 25px;top: 7px;"
                  type="primary"
                >
                  <i class="dataTable-icon blood"></i>关系
                </el-button>
                <el-dropdown-menu slot="dropdown" trigger="click"  style="width:85px;text-align:center;">
                  <el-dropdown-item :command="'backward'">参 考</el-dropdown-item>
                  <el-dropdown-item :command="'forward'">应 用</el-dropdown-item>
                  <el-dropdown-item :command="'full'">全 链</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-form style="width:320px;float:right;display:flex;" :inline="true">
                <el-form-item style="width:145px;" class="search-keyword">
                  <el-select v-model="searchKeyWord" placeholder="请选择搜索分类" size="mini">
                    <el-option
                      :label="item.label"
                      :value="item.prop"
                      v-for="item in keyWordList"
                      :key="item.prop"
                      align="center"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="keyWord"
                    placeholder="请输入内容..."
                    size="mini"
                    @keyup.enter.native="goToSearch"
                    clearable
                  >
                    <i slot="suffix" class="el- icon-search" @click="goToSearch"></i>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
            <!-- <el-scrollbar class="page-scroll"> -->
            <div class="card-table" v-loading="tableLoading">
              <el-table
                :data="tableData"
                border
                style="width: 100%"
                size="mini"
                v-if="loading"
                :header-cell-style="{background:'#f8f8f9',color:'#666'}"
                :cell-style="isClass"
                :header-cell-class-name="isClass2"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column
                  :prop="item.prop"
                  :label="item.label"
                  v-for="item in tableHeader2"
                  :align="item.prop==='instanceCode'||item.prop==='string1'||item.prop==='string5'||item.prop==='string2'?'left':null"
                  :key="item.prop"
                  :show-overflow-tooltip="showToolTip"
                  sortable
                  :width="item.prop==='namespace'||item.prop==='instanceName'||item.prop==='string6'?'240':null"
                ></el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="160">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                      <el-button @click="goToSeeDetail(scope.row)" type="text" size="small" >
                        <svg-icon icon-class="preview" class="preview"></svg-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                      <el-button v-permission="'DIM_EDIT'"  @click="handleCommand(scope.row)" type="text" size="small" >
                        <svg-icon icon-class="editor" class="editor"></svg-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="全链分析" placement="bottom">
                        <el-button type="text" @click="handleBlood2('full',scope.row)">
                          <svg-icon icon-class="multilink" class="multilink"></svg-icon>
                        </el-button>
                      </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                      <el-button v-permission="'DIM_DEL'" @click='deleteSome(scope.row)' type="text" size="small" >
                        <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                      </el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- </el-scrollbar>       -->
            <div style="text-align:center;margin-top:15px;">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.current"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total"
              ></el-pagination>
            </div>
          <!-- </el-scrollbar> -->
        </el-card>
        <catalog-detail
          ref="catalogDetail"
          v-show="showComponent==='detail'"
          @showmain="getShowChange"
          @colData="getShowChange2"
        ></catalog-detail>
        <editor-data v-if="showComponent==='editorDetail'" ref="detailModsule" @colse="showComponent='card'"></editor-data>
      </el-main>
    </el-container>
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
        label-width="100px"
        style="margin-top:20px;padding-right:10px;"
      >
        <el-form-item label="目录代码：" prop="menuCode" class="is-required">
          <el-input
            size="small"
            onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
            v-model="baseInfoRuleForm.menuCode"
            placeholder="请输入目录代码..."
            :disabled="!addMenu"
          ></el-input>
        </el-form-item>
        <el-form-item label="目录名称：" prop="cnName" class="is-required">
          <el-input
            size="small"
            onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
            v-model="baseInfoRuleForm.cnName"
            placeholder="请输入目录名称..."
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
    <!-- 删除提示 -->
    <el-dialog :visible.sync="deleteDialog" class="delete-dialog" title="删除提示" width="50%">
      <delete-dialog ref="deleteMenuDialog"></delete-dialog>
      <div class="dialog-btn">
        <el-button type="primary" @click="isDeleteMenu?toDelCatalog():handDel()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 操作弹框 -->
    <el-dialog :visible.sync="addData.addDialog" @close="dialogTitle = ''" class="new-editor-container" :title="dialogTitle" width="50%" >
      <div class="body">
        <add-dimension @hiddenDialog="addData.addDialog = false" ref="addModsule" v-if="dialogTitle==='新增'"></add-dimension>
        <dimension-basic-editor @hiddenDialog="addData.addDialog = false" ref="editModsule" v-else-if="dialogTitle==='编辑'"></dimension-basic-editor>
      </div>
      <div class="dialog-btn">
        <el-button type="primary" @click="handleSure(dialogTitle)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { get, postByJson, post, downloadFile } from "@/utils/request";
import addDimension from "./addDimension";
import dimensionBasicEditor from "./dimensionBasicEditor";
import editorData from "./editorData";
import { generateLineageTitle } from "@/utils";
import pinyin from "pinyin";
import { loading, loadingStandard } from "@/utils/layer";
import deleteDialog from "../../deleteDialog/deleteDialog";
import bus from "@/utils/bus";
import catalogDetail from "./../../../common/catalogDetail";
export default {
  name: "dimensionality",
  components: {
    deleteDialog,
    catalogDetail,
    addDimension,
    dimensionBasicEditor,
    editorData
  },
  data() {
    // var validateDuty = (rule, value, callback) => {
    //   console.log(value);
    //   if (this.wData.userTag === null) {
    //     callback(new Error("请选择责任人"));
    //   } else {
    //     callback();
    //   }
    // };
    var validateMenuCode = (rule, value, callback) => {
      if (this.addMenu) {
        let reg = /^\d{2,}$/;
        let len = value.length;
        let test = reg.test(value);
        console.log(value.length);
        if (test && len === 2) {
          get("/ds/selectCatalogueInstanceCodeExist", {
            instanceCode: value,
            parentId: this.sendInstanceId
          }).then(res => {
            console.log(res);
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
      console.log(this.baseInfoRuleForm, "rule");
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
      tableLoading: true,
      showShadow: false,
      deleteDialog: false,
      showComponent: "card",
      treeLoading: true,
      ifCurrentNode: true, // 目录详情显示时，做增删改操作，判断是否为当前节点
      // 删除提示组件展示
      keyWordList: [],
      searchKeyWord: null,
      keyWord: null,
      nodeText: null,
      lastNode: null, // 记录上一次点击的节点
      viewChange: [],
      whichView: "0",
      classifyData: [],
      type: [],
      state: [],
      tableData: [],
      tableHeader: [],
      page: {
        current: 1,
        pageSize: 30,
        total: 1
      },
      selectArr: [],
      treeSelectArr: [],
      treeNodeArr: [],
      treeDown: [],
      isFirst: true,
      node: null,
      nodeFirst: null,
      resolve: null,
      props: {
        label: "name",
        children: "classifierName",
        isLeaf: "leaf"
      },
      treePassVal: {
        nodeId: null,
        nodeType: null
      },
      showMenu: false,
      EditDeltShow: false,
      namespace: "",
      parentName: "",
      editMenuId: "",
      addMenu: true,
      bIsCatalogVisible: false,
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
      multipleSelection: [],
      baseInfoRules: {
        cnName: [
          { required: true, message: "请输入中文名称", trigger: "blur" }
        ],
        menuCode: [{ validator: validateMenuCode, trigger: "blur" }],
        enName: [
          { required: true, message: "请输入目录含义", trigger: "blur" }
        ],
        classify: [{ required: true, message: "请选择类型", trigger: "blur" }],
        // duty: [{ validator: validateDuty, trigger: "blur" }],
        selectGroup2: [{ validator: validateGroup, trigger: "blur" }],
        selectUser2: [{ validator: validateUser, trigger: "blur" }]
      },
      // 归属标准  和  含义  显示隐藏
      catalogMean: false,
      standardShow: false,
      classifyOption: "",
      classifyValue: "",
      bIsShowCatalogTree: false,
      bIsUserVisible: false,
      wData: {
        wKeyword: "",
        problemTakerData: [],
        treeSelect: [],
        defaultProps: {
          children: "children",
          label: "title",
          isLeaf: "isLeaf"
        },
        filterSponsorName: null,
        userTag: "",
        closable: true
      },
      catalogData: {
        groupList: [],
        groupListCopy: [],
        userList: [],
        userListCopy: [],
        selectGroup2: null,
        selectUser: null,
        selectGroup: null,
        selectUser2: null
      },
      addInputList: [],
      classifyList: [],
      // 右键操作目录时判断是否有子节点
      nodeIsLeaf: "",
      definitionListDialog: false, // 自定义表头弹出框显示隐藏
      definitionDataList: [],
      selectClassfierName: null, // 新建目录时，归属标准设置默认选项
      tableHeader2: [], // 选中表头
      tableHeaderAll: [], // 表头全部参数
      moveElement: null, // 移动的元素
      moveIndex: null,
      moveIndex2: null,
      loading: true,
      classifierId: "DimentsionInfoItem",
      classiferPath: null,
      classifierName: null,
      treeButtom: false, // 树刷新按钮防止连续点击重复请求,
      checkNodeId: null,
      value: "",
      checkNamespace: {
        name: null,
        namespace: null
      },
      parentNodeId: null,
      isDeleteMenu: false,
      editInputList: [],
      sendInstanceId: "",
      nodeList: [],
      Breadcrumb: [{ name: "全部", isDisabled: true }],
      setBreadList: [{ name: "全部", isDisabled: true }],
      toAddMsg: {
        namespace: "",
        namespaceCN: "",
        node: []
      },
      nodeId: "",
      selectItem: '', // 删除的当条信息
      exportId: '',
      viewId: '',
      showToolTip: true,
      addData: {
        addDialog: false, // 新增弹框变量
        routerData: null
      },
      editData: {
        routerData: null
      },
      dialogTitle: null,
      count: 0
    };
  },
  watch: {
    // bIsCatalogVisible(val) {
    //   if (val === false) {
    //     this.baseInfoRuleForm.cnName = null;
    //     this.baseInfoRuleForm.enName = null;
    //     this.baseInfoRuleForm.classify = null;
    //     this.wData.userTag = null;
    //     this.baseInfoRuleForm.catalog = null;
    //     this.baseInfoRuleForm.menuCode = null;
    //   }
    // }
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
    // 导出标准
    exportData() {
      let load = loadingStandard('正在导出,请稍候...')
      downloadFile('/ds/application/dimension/downDimension', {
        instanceId: this.exportId
      }, () => {
        load.close()
        this.showMenu = false
      }, () => {
        load.close()
      })
    },
    // 组件接收返回按钮
    getShowChange(val) {
      this.showComponent = val;
    },
    getShowChange2(val) {
      // if (this.node.parent.data.classifierId.includes("Parent")) {
      this.node.parent.childNodes.map(item => {
        item.expanded = false;
      });
      // }
      this.treeDown = [];
      if (this.node.namespace !== val.namespace) {
        let pathName = val.path;
        pathName = pathName.substring(
          pathName.indexOf(this.node.data.name) + this.node.data.name.length + 1
        );
        let arr = pathName.split("/");
        this.node.data.level = this.node.level;
        this.Breadcrumb.map((item, index) => {
          console.log(item.level, this.node.data.level);
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
      console.log(node, arr, item);
      if (node.childNodes.length > 0) {
        node.childNodes.map((val, index) => {
          if (val.data.name === arr[0]) {
            val.expanded = false;
            this.treeDown = [];
            this.treeDown.push(val.data.id);
            this.$refs.tree.setCurrentKey(val.data.id);
            this.resetTable(val.data.id);
            console.log(val, val.data.name, arr);
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
                    console.log(arr);
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
        if (!node.isLeaf) {
          this.treeDown.push(node.data.id);
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
      this.keyWord = "";
      this.searchKeyWord = "";
      this.page.pageSize = 30;
      this.page.current = 1;
      this.getData(val);
    },
    getCatalogDetail(type) {
      console.log(type)
      if (!type) {
        this.showComponent = "detail";
        console.log(this.showComponent, 'this.showComponent')
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
        console.log(dataList);
        this.$refs.catalogDetail.dataList = dataList;
        this.$refs.catalogDetail.instanceId = this.editMenuId;
        console.log(this.$refs.catalogDetail.dataList);
      });
    },
    // 跳到新增页
    gotoadd() {
      console.log(this.node)
      this.dialogTitle = "新增"
      if (this.node.data) {
        // 用户视图  data有数据
        if (this.node.data.notetype !== 'view') {
          this.getPath("add");
        } else {
          // 点击view层  node.data有数据 nodetype等于view
          this.$message.warning("请选择挂载目录！")
        }
      } else if (this.node.childNodes[0].data.notetype !== 'view') {
        // 刚进入系统视图时  node的data为undefined childnodes[0]的data.notetype等于view
        this.getPath("add");
      } else {
        this.$message.warning("请选择挂载目录！")
      }
      // if (this.node.data && this.node.data.notetype !== "view") {
      //   this.getPath("add");
      // } else {
      //   this.$message.error("请选择挂载目录！");
      // }
      // this.$router.push({
      //   name: "addDimension",
      //   params: {
      //     namespace: this.checkNamespace.namespace,

      //     name: this.checkNamespace.name
      //   }
      // });
      console.log(this.checkNamespace.namespace, this.checkNamespace.name);
    },
    dragControllerDiv(e) {
      let width = document.getElementsByClassName("el-container")[0]
        .clientWidth;
      let left = document.getElementsByClassName("leftdiv");
      let c = e.clientX - left[0].clientWidth;
      let newWidth = null;
      document.onmousemove = ev => {
        ev.preventDefault();
        console.log(ev);
        let ex = ev.clientX - c;
        newWidth = (ex / width) * 100;
        console.log(newWidth);
        newWidth = newWidth > 45 ? 45 : newWidth < 15 ? 15 : newWidth;
        left[0].style.width = newWidth.toFixed(2) + "%";
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
        // resize.releaseCapture && resize.releaseCapture()
      };
    },
    // 树展开收起方法
    openTree() {},
    // 调整自定义桌面位置
    handleDragStart(even, item) {
      this.moveElement = item;
      console.log(this.moveElement);
    },
    handleDragOver(even, item) {
      // console.log(even)
      even.dataTransfer.dropEffect = "move";
    },
    handleDragEnter(even, item) {
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
      // console.log(a)
      a[this.moveIndex].style.boxShadow = "0 1px 6px rgba(0,0,0,.2)";
      for (let i = 0; i < a.length; i++) {
        var ab = a[i].classList;
        for (let j = 0; j < ab.length; j++) {
          if (ab[j] === "hover") {
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
          this.getData();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    deleteSome(item) {
      this.selectItem = item;
      this.isDeleteMenu = false;
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
    // 删除目录
    showDeleteDialog() {
      this.showMenu = false;
      this.isDeleteMenu = true;
      this.deleteDialog = true;
      this.$nextTick(() => {
        console.log(this.deleteMenu.id);
        this.$refs.deleteMenuDialog.activeFirst();
        this.$refs.deleteMenuDialog.getAllMsg(this.deleteMenu.id);
      });
    },
    clearEditDialog() {},
    handleClose() {
      this.wData.filterSponsorName = null;
    },
    handleBlood(command) {
      if (this.selectArr.length > 1 || this.selectArr.length < 1) {
        this.$message({
          message: "请选择一条数据",
          type: "warning"
        });
      } else {
        this.showShadow = true
        this.$router.push({
          name: "dsLineageAnalysisCanvas",
          params: {
            dataFlowType: command,
            id: this.selectArr[0].instanceId,
            _title: generateLineageTitle(
              command,
              this.selectArr[0].instanceName
            )
          }
        });
      }
    },
    handleBlood2(command, obj) {
      this.showShadow = true
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
    // 跳转至编辑页
    handleCommand(item) {
      // let name
      this.dialogTitle = '编辑';
      this.addData.addDialog = true;
      // this.tableData.map(val => {
      //   if (val.instanceId === item.instanceId) {
      //     name = val.instanceName;
      //   }
      // });
      this.editData.routerData = {
        detailId: item.instanceId,
        nodeList1: this.Breadcrumb,
        msg: item
      }
      this.$nextTick(() => {
        this.$refs.editModsule.createdMess(this.editData.routerData)
      })
      // this.$router.push({
      //   name: "editorData",
      //   params: {
      //     _title: name,
      //     id: name,
      //     detailId: item.instanceId,
      //     nodeList2: this.Breadcrumb,
      //     msg: item
      //   }
      // });
    },
    /**  鼠标右键 */
    handleMouseRight(event, data, node, component) {
      if (
        this.selectClassfierName === null &&
        data.classifierId.indexOf("Parent") !== -1
      ) {
        this.selectClassfierName = data.name;
      }
      this.node = node;
      this.nodeIsLeaf = node.isLeaf;
      this.removeData = data;
      this.deleteMenu = data;
      console.log(data, this.node, "222");
      this.sendInstanceId = data.id;
      this.namespace = data.namespace;
      this.parentName = data.name;
      if (data.id === this.editMenuId) {
        this.ifCurrentNode = true;
      } else {
        this.ifCurrentNode = false;
        this.showComponent = "card";
      }
      this.editMenuId = data.id;
      this.exportId = data.id;
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
      console.log(event.offsetX);
      contextMenu.style.width = "80px";
      contextMenu.style.marginLeft = "55%";
      contextMenu.style.top = event.clientY - 85 + "px";
    },
    // 判断鼠标点击 显示隐藏 tree的目录
    clickBox(e) {
      // console.log(this.$refs.rightMenu.contains);
      if (this.$refs.rightMenu.contains !== undefined && !this.$refs.rightMenu.contains(e.target)) {
        this.showMenu = false;
      }
    },
    // 自定义表头点击事件
    definitionList() {
      this.definitionListDialog = true;
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
      // this.getListClassifier();
    },
    closeTag() {
      this.wData.userTag = null;
    },
    toAddCatalog() {
      this.showMenu = false;
      this.addMenu = true;
      // this.bIsCatalogVisible = true;
      this.getListClassifier2();
      // this.getListFeature();
      // 根据namespace获取上下文路径
      this.getPath();

      this.toAddUserShow(); // 获取部门列表
    },

    // 获取非固定输入框
    getListFeature() {
      get("/ds/listFeatureByClassifierId", {
        classifierId: "Context"
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.editInputList = [];
          this.catalogMean = false;
          this.standardShow = false;
          res.data.map(item => {
            item.attrStore = item.attStore;
            if (item.columnType === "combobox") {
              get("/ds/listStandardAttrComboboxInfos", {
                columnTypeValue: item.datatypeId
              }).then(res => {
                console.log(res, "99");
                item.selectList = res.data;
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
        } else {
          this.$message.error(res.message);
        }
        console.log(this.baseInfoRules, "basic");
      });
    },
    // 获取归属标准下拉框数据
    getListClassifier2() {
      // const that = this;
      get("/ds/application/rule/listClassifier").then(res => {
        this.classifyList = res.data;
        console.log(this.selectClassfierName, "pppp");
        this.classifyList.map(val => {
          if (val.classifierName === this.selectClassfierName) {
            this.classifierId = val.classifierId;
            this.classifierName = val.classifierName;
            console.log(this.editInputList, 6);
            this.editInputList.map(i => {
              console.log(i, "03");
              if (
                i.attCode === "Standard_type" ||
                i.attrCode === "Standard_type"
              ) {
                this.$set(
                  this.baseInfoRuleForm,
                  i.attrStore,
                  val.classifierName
                );
              }
              if (i.attCode === 'Is_Entity' || i.attrCode === 'Is_Entity') {
                this.$set(
                  this.baseInfoRuleForm,
                  i.attrStore,
                  'F'
                );
              }
            });
            this.bIsCatalogVisible = true;
          }
        });
        this.getListFeature();
      });
    },
    getListClassifier() {
      // const that = this;
      get("/ds/application/rule/listClassifier").then(res => {
        this.classifyList = res.data;
        console.log(this.selectClassfierName, "pppp");
        this.classifyList.map(val => {
          if (val.classifierName === this.selectClassfierName) {
            this.classifierId = val.classifierId;
            this.classifierName = val.classifierName;
            console.log(this.editInputList, 6);
            this.editInputList.map(i => {
              console.log(i, "03");
              if (
                i.attCode === "Standard_type" ||
                i.attrCode === "Standard_type"
              ) {
                this.$set(
                  this.baseInfoRuleForm,
                  i.attrStore,
                  val.classifierName
                );
              }
            });
            this.bIsCatalogVisible = true;
          }
        });
      });
    },
    // 归属标准选择
    // selectClassify(val) {
    //   console.log(val);
    //   this.classifierId = val;
    //   this.classifyList.map(item => {
    //     console.log(item);
    //     if (item.classifierId === val) {
    //       console.log(item.classifierId);
    //       this.classifierName = item.classifierName;
    //     }
    //   });
    //   // console.log(this.baseInfoRuleForm.classify);
    // },
    // 获取上级目录
    // getPath() {
    //   get("/ds/getStandardContext", {
    //     namespace: this.namespace
    //   }).then(res => {
    //     // console.log(res)
    //     this.baseInfoRuleForm.catalog =
    //       res.data === "" ? this.parentName : res.data;
    //   });
    // },
    getPath(val) {
      console.log(val === "add", "dididi");
      get("/ds/getStandardContext", {
        namespace: val === "add" ? this.toAddMsg.namespace : this.namespace,
        isContainRoot: true,
        isContainIndex: false
      }).then(res => {
        console.log(res);
        if (res.code === 10000 && res.success) {
          if (val === "add") {
            this.addData.addDialog = true
            console.log(res.data, this.toAddMsg.namespace, 'res')
            this.toAddMsg.namespaceCN = res.data;
            let nodeList = this.Breadcrumb
            if (this.Breadcrumb.length === 1) {
              let node = this.nodeFirst.childNodes[0].data
              node.tipValue = "";
              node.isDisabled = true;
              nodeList.push(node)
            }
            this.addData.routerData = {
              msg: this.toAddMsg,
              nodeList: nodeList
            }
            this.$nextTick(() => {
              this.$refs.addModsule.getParMsg(this.addData.routerData)
            })
            // this.$router.push({
            //   name: "addDimension",
            //   params: {
            //     msg: this.toAddMsg,
            //     nodeList: nodeList
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
    // 修改目录
    toEditCatalog() {
      this.showMenu = false;
      this.addMenu = false;
      this.toAddUserShow(); // 获取部门列表
      get("/ds/getCatlogDetail", {
        id: this.editMenuId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.editInputList = [];
          this.getEditList = res.data;
          res.data.dataStandardVO.attributes.map(item => {
            console.log(item);
            if (item.columnType === "combobox") {
              get("/ds/listStandardAttrComboboxInfos", {
                columnTypeValue: item.datatypeId
              }).then(res => {
                console.log(res, "96");
                item.selectList = res.data;
                this.editInputList.push(item);
              });
            } else {
              this.editInputList.push(item);
            }
            this.baseInfoRuleForm[item.attrStore] = item.value;
          });
          this.baseInfoRuleForm.menuCode = res.data.dataStandardVO.code;
          this.baseInfoRuleForm.cnName = res.data.dataStandardVO.name;
          this.baseInfoRuleForm.catalog = res.data.parentPathCn;
          this.namespace = res.data.parentPathEn;
          if (res.data.group) {
            this.baseInfoRuleForm.selectGroup2 = res.data.group.groupName;
            this.baseInfoRuleForm.selectUser2 = res.data.user.username;
          } else {
            this.baseInfoRuleForm.selectGroup2 = null;
            this.baseInfoRuleForm.selectUser2 = null;
          }
          this.sendInstanceId = res.data.dataStandardVO.id;
          console.log(this.baseInfoRuleForm, 6);

          let EditMsg = res.data;
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
                console.log(
                  this.catalogData.userList,
                  this.catalogData.userListCopy,
                  2222
                );
                if (res.data.user) {
                  this.catalogData.selectUser = res.data.user.userId;
                } else {
                  this.catalogData.selectUser = null;
                }
                console.log(this.catalogData.selectUser);
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
    toDelCatalog() {
      this.showMenu = false;
      this.$confirm(
        "您的操作将会永久删除所选标准及其相关关系,确定继续吗?",
        "警告",

        {
          confirmButtonText: "确定",
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
              this.deleteDialog = false;
              this.keyWord = null;
              this.page.current = 1;
              this.getData(this.node.parent.data.id);
              this.$refs.tree.setCurrentKey(this.node.parent.data.id);
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
              // this.node
              // console.log(this.treeNodeArr.indexOf(this.node));
              // this.treeNodeArr.map((val, index) => {
              //   console.log(val.data, this.node.data);
              //   if (
              //     val.data.id === this.node.data.id &&
              //     val.data.namespace === this.node.data.namespace &&
              //     val.data.parentId === this.node.data.parentId
              //   ) {
              //     this.treeSelectArr = this.treeSelectArr.slice(0, index);
              //     this.treeNodeArr = this.treeNodeArr.slice(0, index);
              //   }
              // });
            } else {
              load.close()
              this.$message.error(res.message);
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
    // 关闭目录新增编辑弹窗时触发
    closeCatalogDialog() {
      for (let a in this.baseInfoRuleForm) {
        this.baseInfoRuleForm[a] = "";
      }
      // this.userTagList = {};
      this.catalogData = {
        groupList: [],
        groupListCopy: [],
        userList: [],
        userListCopy: [],
        selectGroup2: null,
        selectUser: null,
        selectGroup: null,
        selectUser2: null
      };
    },
    // 新增目录 - 确定
    toSaveCatalog() {
      // 新增
      if (this.baseInfoRuleForm.selectGroup2 === "") {
        this.baseInfoRuleForm.selectGroup2 = null;
        console.log(
          this.baseInfoRuleForm.selectGroup2,
          "this.baseInfoRuleForm.selectGroup2"
        );
      }
      if (this.baseInfoRuleForm.selectUser2 === "") {
        this.baseInfoRuleForm.selectUser2 = null;
      }
      this.$refs["baseInfoRuleForm"].validate(valid => {
        if (valid) {
          if (this.addMenu) {
            // console.log(this.addInputList, 0);
            let attr = [];
            let msg = {
              dataStandardVO: {
                parentId: this.sendInstanceId, // 目录节点id
                code: this.baseInfoRuleForm.menuCode, // 目录代码
                name: this.baseInfoRuleForm.cnName, // 名称
                attributes: []
              },
              parentPathCn: this.deleteMenu.name, // 上级目录cn
              parentPathEn: this.deleteMenu.namespace, // 上级目录en
              user: {
                userId: this.catalogData.selectUser
                // userId: this.wData.userTag.userId
              },
              group: {
                groupId: this.catalogData.selectGroup
              }
            };
            this.editInputList.map(item => {
              console.log(item);
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
            console.log(msg);
            postByJson("/ds/saveCatalogue", msg).then(res => {
              // console.log(res, "01");
              if (res.code === 10000 && res.success) {
                // console.log(this.node)
                // this.refreshLazyTree(this.node);
                this.$message.success(res.message);
                console.log(this.nodeIsLeaf);
                this.catalogData.selectUser = null;
                this.catalogData.selectGroup = null;
                this.bIsCatalogVisible = false;
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
            postByJson("/ds/saveCatalogue", msg).then(res => {
              console.log(res, "01");
              // this.refreshData(this.node.parent, this.resolve)
              if (res.code === 10000 && res.success) {
                this.$message.success(res.message);
                this.dutyUserId = "";
                this.bIsCatalogVisible = false;
                if (this.nodeIsLeaf) {
                  // this.changeView("");
                  this.refreshLazyTree(this.node.parent);
                } else {
                  this.refreshLazyTree(this.node);
                }
                if (this.ifCurrentNode) {
                  this.getCatalogDetail(true);
                }
              } else {
                this.$message.error(res.message);
              }
            });
          }
          // this.updateChildren(this.node)
        } else {
          // this.$message.error("请填写必填项！");
          return false;
        }
      });
    },
    refreshLazyTree(node) {
      // console.log(node, '66')
      // this.treeLoading = true;
      let params = {};
      if (node.data) {
        params = {
          nodeId: node.data.id,
          nodeType: node.data.notetype
        };
      } else {
        params = {
          nodeId: "",
          nodeType: ""
        };
      }
      get("/ds/application/dimension/listDimensionTree", params).then(res => {
        if (res.success && res.code === 10000 && res.success) {
          const list = res.data;
          node.childNodes = [];
          node.doCreateChildren(list);
          if (this.noSonTree) {
            // console.log('setHightLight')
            // this.treeDown = [];
            // this.treeDown.push(this.noSonTree.data.id);
            // 设置默认节点高亮
            this.$refs.tree.setCurrentKey(this.noSonTree.data.id);
          } else {
            // this.treeDown = [];
            // this.treeDown.push(node.data.id);
            // 设置默认节点高亮
            this.$refs.tree.setCurrentKey(node.data.id);
          }
        }
        this.treeButtom = false;
        this.treeLoading = false;
      });
      //   console.log(res)
      // }
    },
    treeSkip(item) {
      console.log(item);
      this.treePassVal.nodeId = item.id;
      this.getData(item.id);
      this.treeDown = [];
      this.treeDown.push(item.id);
      // 设置默认节点高亮
      console.log(this.$refs.tree);
      this.$refs.tree.setCurrentKey(item.id);
    },
    selectTreeValue(data) {
      const that = this;
      if (data) {
        if (data.hasOwnProperty("children")) {
          data.selected = false;
        } else {
          if (data.userId !== undefined) {
            // 单选
            // 问题发起人
            // if (that.wData.pfilterSponsorArr.indexOf(data.userId) === -1) {
            // that.wData.filterSponsorArr.push(data);
            // that.wData.pfilterSponsorArr.push(data.userId);
            that.wData.filterSponsorName = data;
            // }
          }
        }
      } else {
        this.wData.wKeyword = "";
      }
    },
    sure() {
      this.bIsUserVisible = false;
      this.wData.userTag = this.wData.filterSponsorName;
    },
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
        if (!pattern.test(this.catalogData.selectGroup) && pattern2.test(this.catalogData.selectGroup) && this.catalogData.selectGroup.length === 32) {
          // 获取用户列表
          get(`sys/user/listUserInGroup?groupId=${this.catalogData.selectGroup}`).then(res => {
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
              console.log(
                this.catalogData.userList,
                this.catalogData.userListCopy,
                2222
              );
            } else {
              this.$message.warning("请先选择部门！");
            }
          });
        }
      }
    },
    getUserList(val) {
      console.log(val);
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
    getUserList2(val) {
      this.catalogData.selectUser2 = val;
      this.baseInfoRuleForm.selectUser2 = val;
    },
    // 获取分组列表
    toAddUserShow() {
      // this.bIsUserVisible = true;
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
          // console.log(this.catalogData.groupList, 'this.catalogData.groupList')
          // let resData = res.data;
          // that.wData.problemTakerData = resData.map(child => {
          //   if (child.users.length > 0 && child.users[0].userId !== undefined) {
          //     return {
          //       title: child.groupName,
          //       isLeaf: false,
          //       children: child.users.map(function (child2) {
          //         return {
          //           title: child2.userName,
          //           userId: child2.userId
          //         }
          //       })
          //     }
          //   } else {
          //     return {
          //       title: child.groupName,
          //       isLeaf: true,
          //       children: []
          //     }
          //   }
          // });
          // console.log(that.wData.problemTakerData)
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 选择用户 - 确定
    toSaveUser() {
      this.bIsUserVisible = false;
    },
    dataFilter(val) {
      this.catalogData.selectUser = null;
      this.catalogData.userList = null;
      this.catalogData.userListCopy = null;
      this.catalogData.selectGroup = val;
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
    handDel() {
      if (this.selectItem) {
        this.$confirm(
          `您的操作将会永久删除选中信息项，
          确定继续吗?`,
          "警告",
          {
            confirmButtonText: "继续",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            const load = loading("删除中...")
            let arr = [];
            arr.push(this.selectItem.instanceId)
            // this.selectArr.map(val => {
            //   arr.push(val.instanceId);
            // });
            get("/ds/application/dimension/removeDimensions", {
              instanceIds: arr.join(",")
            }).then(res => {
              if (res.code === 10000 && res.success) {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                load.close()
                this.getData(this.checkNodeId);
                this.deleteDialog = false;
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
            load.close()
          });
      } else {
        this.$message({
          message: "请选择您要删除的数据",
          type: "warning"
        });
      }
    },
    handleNodeClick(data, node, item) {
      this.tableLoading = true
      this.$refs.tree.setCurrentKey(data.id);
      if (data.namespace) {
        this.toAddMsg.namespace = data.namespace;
        this.toAddMsg.data = node;
      } else {
        this.toAddMsg.namespace = "";
        this.toAddMsg.data = "";
      }
      // console.log(node, data)
      node.childNodes.map(item => {
        item.expanded = false;
      });
      this.treeDown = [];
      if (data.classifierId) {
        if (data.classifierId.indexOf("Parent") !== -1) {
          this.selectClassfierName = data.name;
          if (this.checkNamespace.namespace && this.checkNamespace.name) {
            this.checkNamespace = {
              name: null,
              namespace: null
            };
          }
        } else {
          this.checkNamespace.namespace = data.namespace;
          get("/ds/getStandardContext?namespace=" + data.namespace).then(
            res => {
              if (res.code === 10000) {
                this.checkNamespace.name = res.data;
                // console.log(this.checkNamespace, 'oooo')
              }
            }
          );
        }
      }
      if (data.id !== this.editMenuId) {
        this.showComponent = "card";
      }
      if (data.notetype === "metadata") {
        this.checkNodeId = data.id;
        this.page.current = 1;
        this.keyWord = null;
        // console.log(this.lastNode.data, node.data, this.lastNode && this.lastNode.data !== node.data)
        if (this.lastNode && this.lastNode !== node) {
          this.getData(data.id);
        } else if (this.lastNode === null) {
          this.getData(data.id);
        }
      } else {
        this.parentNodeId = data.id;
      }

      this.treeDown = [];
      this.clickNode = node;
      this.node = node;
      this.nodeText = node;
      data.level = node.level;
      // this.node = node;
      if (data.id !== this.editMenuId) {
        this.showComponent = "card";
      }
      let len = this.Breadcrumb.length - 1;
      if (this.Breadcrumb.length > 1) {
        this.Breadcrumb.map((item, index) => {
          console.log(item, "222");
          console.log(node, "222");
          if (item.level === node.level) {
            console.log("level");
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
      this.lastNode = node;
      // let itemdata = {
      //   name: data.name,
      //   keyLevel: node.level,
      //   type: data.classifierId,
      //   uuid: data.uuid,
      //   id: data.id
      // };
      // // console.log(data.classifierId, itemdata)
      // if (data.classifierId === "Context") {
      //   get("/ds/details/" + data.id).then(res => {
      //     if (res.code === 10000) {
      //       res.data.attributes.forEach((item, index) => {
      //         if (item.attrCode === "Tag") {
      //           itemdata.tip = item.value;
      //         }
      //       });
      //     }
      //     if (node !== this.nodeText) {
      //       if (this.treeSelectArr.length > 0) {
      //         this.treeSelectArr.map((val, index) => {
      //           if (val.keyLevel === node.level) {
      //             this.treeSelectArr = this.treeSelectArr.slice(0, index);
      //             // console.log(this.nodeText, 'arr1')
      //             this.getShow(this.treeNodeArr[index]);
      //             this.treeNodeArr = this.treeNodeArr.slice(0, index);
      //             return;
      //           }
      //         });
      //         this.treeSelectArr.push(itemdata);
      //         this.treeNodeArr.push(node);
      //       } else {
      //         this.treeSelectArr.push(itemdata);
      //         this.treeNodeArr.push(node);
      //       }
      //       this.nodeText = node;
      //       // console.log(this.nodeText, 'arr')
      //     }
      //   });
      // } else {
      //   if (node !== this.nodeText) {
      //     if (this.treeSelectArr.length > 0) {
      //       this.treeSelectArr.map((val, index) => {
      //         if (val.keyLevel === node.level) {
      //           this.treeSelectArr = this.treeSelectArr.slice(0, index);
      //           // console.log(this.nodeText, 'arr1')
      //           this.getShow(this.treeNodeArr[index]);
      //           this.treeNodeArr = this.treeNodeArr.slice(0, index);
      //           return;
      //         }
      //       });
      //       this.treeSelectArr.push(itemdata);
      //       this.treeNodeArr.push(node);
      //     } else {
      //       this.treeSelectArr.push(itemdata);
      //       this.treeNodeArr.push(node);
      //     }
      //     this.nodeText = node;
      //     // console.log(this.nodeText, 'arr')
      //   }
      // }

      // if (this.nodeText.expanded === true) {
      //   this.nodeText.expanded = false;
      // }
    },
    getShow(arr) {
      // console.log(arr, 33)
      arr.expanded = false;
      arr.childNodes.map(val => {
        if (val.expanded === true) {
          val.expanded = false;
          this.getShow(val);
        }
      });
    },
    loadNode(node, resolve) {
      this.node = node;
      // console.log(node, resolve);
      if (node.level === 0 || this.isFirst) {
        this.nodeFirst = node;
        this.resolve = resolve;
        get(
          "/ds/application/dimension/listDimensionTree",
          this.treePassVal
        ).then(res => {
          this.treeButtom = false;
          if (res.code === 10000 && res.success === true) {
            if (res.data[0].classifierId) {
              this.namespace = res.data[0].namespace
              this.toAddMsg.namespace = res.data[0].namespace;
              this.toAddMsg.node = res.data[0];
            }
            this.treeLoading = false
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
        });

        this.isFirst = false;
      } else {
        let params = {
          nodeId: node.data.id,
          nodeType: node.data.notetype
        };
        get("/ds/application/dimension/listDimensionTree", params).then(res => {
          this.treeButtom = false;
          if (res.code === 10000 && res.success === true) {
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    renderContent(h, params) {
      // console.log(h, params)
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
          h("div", {
            class: iconType,
            style: {
              marginRight: "4px",
              display: "inline-block",
              backgroundSize: "15px 15px",
              width: "15px",
              height: "15px"
            }
          }),
          h("span", sText)
        ]
      );
    },
    getNewView2() {
      if (this.nodeText === null) {
        this.treeButtom = true;
        this.treeDown = [];
        this.getNewView();
      } else {
        this.treeButtom = true;
        this.refreshLazyTree(this.nodeText);
      }
    },
    // 视图切换
    getNewView(val) {
      this.treeLoading = true;
      this.viewChange.map(item => {
        if (parseInt(item.id) === val) {
          this.value = item.id;
        }
      });
      this.Breadcrumb = [{ name: "全部", isDisabled: true }]
      this.viewId = val
      // this.treeSelectArr = [];
      // this.treeNodeArr = [];
      // this.sele;
      // this.treePassVal.nodeId = this.whichView;
      this.treePassVal.nodeId = val;
      this.treePassVal.nodeType = "view";
      this.isFirst = true;
      this.nodeFirst.childNodes = [];
      this.loadNode(this.nodeFirst, this.resolve);
    },
    handleCurrentChange(val) {
      this.page.current = val;
      let key;
      this.keyWord === null ? (key = null) : (key = this.keyWord);
      this.getData(this.checkNodeId, key);
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getData();
    },
    handleSelectionChange(val) {
      this.selectArr = val;
      console.log(val)
      // if (val.length > 0) {
      //   val.map(res => {
      //     this.selectArr.push(res.id)
      //   })
      // }
    },
    isClass({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column)
      if (columnIndex === 0) {
        return "border-right:none;";
      }
    },
    isClass2({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "tableClass";
      }
    },
    getData(id = null, keyWord = null) {
      let count = ++this.count;
      let params = {
        current: this.page.current,
        size: this.page.pageSize,
        ancestorId: id,
        classifierId: this.classifierId,
        keyword: keyWord,
        prop: keyWord === null ? null : this.searchKeyWord
      };
      get("/ds/customSearch", params).then(res => {
        if (res.code === 10000) {
          if (count === this.count) {
            this.tableData = res.data.records;
            this.page.total = res.data.total;
            this.tableHeader2 = res.extras.headers;
            this.loading = true;
            this.tableLoading = false
          }
        }
      });
      this.getSearchList();
    },

    getView() {
      console.log("getview");
      get("/ds/listAllViews").then(res => {
        if (res.code === 10000 && res.success) {
          this.viewChange = res.data;
          let str = JSON.stringify(res.data);
          if (str.includes("true")) {
            res.data.map(item => {
              if (item.defultShow) {
                this.value = item.id;
                this.viewId = item.id
                // this.nodeId = item.id;
              }
            });
          } else {
            res.data.map(item => {
              if (item.id === '0') {
                this.value = item.id;
                this.viewId = item.id
                // this.nodeId = item.id;
              }
            });
          }
        }
        //   console.log(this.viewChange, '1212')

        //   this.viewChange.map(val => {
        //     if (val.defultShow === true) {
        //       this.value = val.name;
        //       console.log(val, '000')
        //       this.whichView = val.id;
        //       return;
        //     }
        //   });
        // } else {
        //   this.value = "系统视图";
        //   console.log(val, 'shitu')
        //   this.$message.error(res.message);
        // }
      });
    },
    // 到详情
    goToSeeDetail(item) {
      this.showComponent = 'editorDetail'
      let params = {
        detailId: item.instanceId,
        nodeList1: this.Breadcrumb,
        msg: item
      }
      this.$nextTick(() => {
        this.$refs.detailModsule.createdMess(params);
      })

      // this.$router.push({
      //   name: "editorData",
      //   params: {
      //     _title: name,
      //     id: name,
      //     detailId: item.instanceId,
      //     nodeList2: this.Breadcrumb,
      //     msg: item
      //   }
      // });
      // this.$router.push({
      //   name: "dimensionDetails",
      //   params: { id: item.instanceName, _title: item.instanceName, detailId: item.instanceId, row: item }
      // });
      // }
    },
    // 搜索框事件
    goToSearch() {
      if (this.searchKeyWord !== null && this.keyWord !== null) {
        this.page.current = 1;
        this.getData(null, this.keyWord);
      } else if (this.searchKeyWord === null) {
        this.$message({
          message: "请选择搜索类别",
          type: "warning"
        });
      } else if (this.keyWord === null) {
        this.$message({
          message: "请输入搜索关键字",
          type: "warning"
        });
      }
    },
    getSearchList() {
      get("/ds/listCustomSearchLabels", {
        classifierId: this.classifierId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.keyWordList = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getRefresh() {},
    // 点击面包屑，定位到树tree节点展开
    toClickBreadcrumb(item) {
      // console.log(item, "iii");
      // console.log(this.Breadcrumb, "iii");
      this.searchNode(this.nodeFirst, item.id)
      let nodeId = "";
      if (item.notetype === "view") {
        nodeId = "";
      } else {
        nodeId = item.id;
      }
      this.getData(nodeId);
      this.treeDown = [];
      this.treeDown.push(item.id);
      // 设置默认节点高亮
      // this.$refs.tree.setCurrentKey(item.id);
      let len = this.Breadcrumb.length - 1;
      // let node = null;
      this.Breadcrumb.map((val, index) => {
        if (val.level === item.level && val.id === item.id) {
          this.Breadcrumb.splice(index + 1, len);
          // node = this.treeNodeArr[index];
        }
      });
      // console.log(this.nodeFirst)

      // this.refreshLazyTree(node);
    },
    // 新增界面跳转  面包屑设置
    setBreadcrumb(val) {
      console.log(val);
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
              console.log(this.nodeFirst, "nodeFirst");
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
    searchNode(node, id) {
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
    handleSure(type) {
      console.log(type)
      if (type === '新增') {
        this.$refs.addModsule.getInputData('ruleForm');
      } else if (type === '编辑') {
        console.log(this.$refs.editModsule)
        this.$refs.editModsule.getInputData();
      }
    },
    setTreePosition(val) {
      this.addData.addDialog = false;
      console.log(val, 'val')
      if (val.keyword === null) {
        this.keyWord = null;
      }
      if (val.nodeList && val.addNode) {
      // 再次新增规则   且  挂载点（路径）改变了
        let nodeList = val.nodeList;
        console.log(nodeList, "nodeList");
        //  为系统视图  挂载点规则上还有一个规则目录
        if (this.viewId === '0') {
          nodeList.map(item => {
            item.data.level = item.level + 1;
            return item;
          });
          console.log(this.nodeFirst);
          // 关闭所有展开的子节点
          this.nodeFirst.childNodes[0].childNodes[0].childNodes.map(item => {
            item.expanded = false;
          });
          // toAddMsg 是后面再次新增规则跳转传参
          this.toAddMsg.node = nodeList[nodeList.length - 1];
          this.toAddMsg.namespace = nodeList[nodeList.length - 1].data.namespace;
          // 展开第一个父节点 规则
          this.treeDown = [];
          this.treeDown.push(this.nodeFirst.childNodes[0].data.id);
          this.nodeId = this.nodeFirst.childNodes[0].data.id;
          // 设置高亮
          this.$refs.tree.setCurrentKey(this.nodeFirst.childNodes[0].data.id);
          // 懒加载树  获取childNodes数据需要一定时间
          setTimeout(() => {
          // 重新设置展开节点 挂载点规则
            this.treeDown = [];
            this.treeDown.push(
              this.nodeFirst.childNodes[0].childNodes[0].data.id
            );
            // 通过绑定的node-key  依次展开节点 并设置高亮
            nodeList.map((item, index) => {
              setTimeout(() => {
                this.treeDown = [];
                this.treeDown.push(item.data.id);
                this.nodeId = item.data.id;
                this.$refs.tree.setCurrentKey(item.data.id);
              }, index * 500);
            });
          }, 500);
        } else {
          nodeList.map(item => {
            item.data.level = item.level;
            return item;
          });
          // 非系统视图   挂载点规则为最上层节点
          this.toAddMsg.node = nodeList[nodeList.length - 1];
          this.toAddMsg.namespace = nodeList[nodeList.length - 1].data.namespace;
          let node = this.nodeFirst.childNodes[0];
          this.refreshLazyTree(node);
          nodeList.map((item, index) => {
            setTimeout(() => {
              this.treeDown = [];
              this.treeDown.push(item.data.id);
              this.nodeId = item.data.id;
              this.$refs.tree.setCurrentKey(item.data.id);
            }, index * 500);
          });
        }
        // 当前节点id   用来获取table数据
        this.nodeId = nodeList[nodeList.length - 1].data.id;
        // 获取table数据
        this.page.current = 1;
        this.getData(this.nodeId);
        // 重置面包屑
        this.Breadcrumb = [{ name: "全部", isDisabled: true }];
        this.setBreadList = [{ name: "全部", isDisabled: true }];
        // 调用方法 处理面包屑的赋值
        this.setBreadcrumb(nodeList[nodeList.length - 1]);
        this.Breadcrumb = this.setBreadList;
      } else if (val.nodeList && !val.addNode) {
      // 再次新增规则   且  挂载没变
        this.Breadcrumb = val.nodeList;
        let nodeList = val.nodeList;
        console.log(this.Breadcrumb);
        console.log(this.Breadcrumb);
        this.$refs.tree.setCurrentKey(
          this.Breadcrumb[this.Breadcrumb.length - 1].id
        );
        this.nodeId = nodeList[nodeList.length - 1].id;
        this.page.current = 1;
        this.getData(this.nodeId);
      } else {
      // 未新增规则
        this.getData();
      }
    }
  },
  activated() {
    this.showShadow = false
    // if (this.$route.params.keyword === null) {
    //   this.keyWord = null;
    // }
    // if (this.$route.params.nodeList && this.$route.params.addNode) {
    //   // 再次新增规则   且  挂载点（路径）改变了
    //   let nodeList = this.$route.params.nodeList;
    //   console.log(nodeList, "nodeList");
    //   //  为系统视图  挂载点规则上还有一个规则目录
    //   if (this.viewId === '0') {
    //     nodeList.map(item => {
    //       item.data.level = item.level + 1;
    //       return item;
    //     });
    //     console.log(this.nodeFirst);
    //     // 关闭所有展开的子节点
    //     this.nodeFirst.childNodes[0].childNodes[0].childNodes.map(item => {
    //       item.expanded = false;
    //     });
    //     // toAddMsg 是后面再次新增规则跳转传参
    //     this.toAddMsg.node = nodeList[nodeList.length - 1];
    //     this.toAddMsg.namespace = nodeList[nodeList.length - 1].data.namespace;
    //     // 展开第一个父节点 规则
    //     this.treeDown = [];
    //     this.treeDown.push(this.nodeFirst.childNodes[0].data.id);
    //     this.nodeId = this.nodeFirst.childNodes[0].data.id;
    //     // 设置高亮
    //     this.$refs.tree.setCurrentKey(this.nodeFirst.childNodes[0].data.id);
    //     // 懒加载树  获取childNodes数据需要一定时间
    //     setTimeout(() => {
    //       // 重新设置展开节点 挂载点规则
    //       this.treeDown = [];
    //       this.treeDown.push(
    //         this.nodeFirst.childNodes[0].childNodes[0].data.id
    //       );
    //       // 通过绑定的node-key  依次展开节点 并设置高亮
    //       nodeList.map((item, index) => {
    //         setTimeout(() => {
    //           this.treeDown = [];
    //           this.treeDown.push(item.data.id);
    //           this.nodeId = item.data.id;
    //           this.$refs.tree.setCurrentKey(item.data.id);
    //         }, index * 500);
    //       });
    //     }, 500);
    //   } else {
    //     nodeList.map(item => {
    //       item.data.level = item.level;
    //       return item;
    //     });
    //     // 非系统视图   挂载点规则为最上层节点
    //     this.toAddMsg.node = nodeList[nodeList.length - 1];
    //     this.toAddMsg.namespace = nodeList[nodeList.length - 1].data.namespace;
    //     let node = this.nodeFirst.childNodes[0];
    //     this.refreshLazyTree(node);
    //     nodeList.map((item, index) => {
    //       setTimeout(() => {
    //         this.treeDown = [];
    //         this.treeDown.push(item.data.id);
    //         this.nodeId = item.data.id;
    //         this.$refs.tree.setCurrentKey(item.data.id);
    //       }, index * 500);
    //     });
    //   }
    //   // 当前节点id   用来获取table数据
    //   this.nodeId = nodeList[nodeList.length - 1].data.id;
    //   // 获取table数据
    //   this.page.current = 1;
    //   this.getData(this.nodeId);
    //   // 重置面包屑
    //   this.Breadcrumb = [{ name: "全部", isDisabled: true }];
    //   this.setBreadList = [{ name: "全部", isDisabled: true }];
    //   // 调用方法 处理面包屑的赋值
    //   this.setBreadcrumb(nodeList[nodeList.length - 1]);
    //   this.Breadcrumb = this.setBreadList;
    // } else if (this.$route.params.nodeList && !this.$route.params.addNode) {
    //   // 再次新增规则   且  挂载没变
    //   this.Breadcrumb = this.$route.params.nodeList;
    //   let nodeList = this.$route.params.nodeList;
    //   console.log(this.Breadcrumb);
    //   console.log(this.Breadcrumb);
    //   this.$refs.tree.setCurrentKey(
    //     this.Breadcrumb[this.Breadcrumb.length - 1].id
    //   );
    //   this.nodeId = nodeList[nodeList.length - 1].id;
    //   this.page.current = 1;
    //   this.getData(this.nodeId);
    // } else {
    //   // 未新增规则
    //   this.getData();
    // }
  },
  created() {
    this.getListFeature();
    this.getView();
    this.getData();
    bus.$on("namespace", e => {
      console.log(e);
    });
  }
};
</script>
<style lang="scss" scoped>
//外层card容器样式
@import "./../../../../styles/dq/main-card-table.scss";
@import "../../../../styles/treeIconScoped";
$color-grey-light: #e0e0e0;

.dimensionality-container {
  padding: 15px;
  height: 100%;
  /deep/ .el-main ::-webkit-scrollbar {
  width: 5px;
  height: 7px;
  }
  /deep/ .el-main ::-webkit-scrollbar-track {
    background: none;
    border-radius: 2px;
  }
  /deep/ .el-main ::-webkit-scrollbar-thumb {
    background: rgb(239, 239, 239);
    border-radius: 10px;
  }
  /deep/ .el-main ::-webkit-scrollbar-thumb:hover {
    background: #bfbfbf;
  }
  .openButton {
    width: 22px;
    height: 22px;
    position: relative;
    bottom: 3px;
  }
  .resize:hover {
    cursor: e-resize;
  }
  .el-aside {
    height: 100%;
    position: relative;
    .el-card {
      height: calc(100vh - 115px);
      /deep/ .el-card__body {
        padding: 25px 10px !important;
        position: relative;
        height: 100%;
      }
    }
    .header {
      border-bottom: 1px solid $color-grey-light;
      display: flex;
      position: relative;
      .title {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
        color: rgb(126, 123, 123);
        padding-bottom: 8px;
        padding-left: 10px;
      }
      .el-button {
        position: absolute;
        right: 0;
        bottom: 6px;
        padding: 3px 8px;
        /deep/ .el-icon-refresh {
          font-size: 18px !important;
        }
      }
    }
    .tree {
      margin-top: 15px;
      height: calc(100% - 80px);
      overflow-y: auto;
    }
    .tree::-webkit-scrollbar {
      width: 5px;
      height: 10px;
    }
    .tree::-webkit-scrollbar-track {
      background: none;
      border-radius: 2px;
    }
    .tree::-webkit-scrollbar-thumb {
      background: rgb(239, 239, 239);
      border-radius: 10px;
    }
    .tree::-webkit-scrollbar-thumb:hover {
      background: #bfbfbf;
    }
    .footer {
      position: absolute;
      bottom: 15px;
      border-top: 1px solid $color-grey-light;
      display: flex;
      width: calc(100% - 20px);
      padding-top: 10px;
      .title {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
        color: rgb(126, 123, 123);
        padding-left: 10px;
      }
      .el-select {
        position: absolute;
        right: 10px;
        top: 6px;
        width: 55%;
      }
    }
  }
  .el-main {
    padding: 0;
    margin-left: 10px;
    height: calc(100vh - 115px);
    .el-card {
      height: calc(100vh - 115px);
      /deep/ .el-card__body {
        height: calc(100vh - 115px);
        padding-right: 10px;
        .page-scroll {
          height: 100%;
          .el-scrollbar__wrap {
            overflow-x: hidden;
          }
        }
        .card-header {
          display: flex;
          border-bottom: 1px solid $color-grey-light;
          padding: 4px 0 5px;
          .el-icon-location-outline {
            font-size: 22px;
            position: relative;
            bottom: 3px;
            margin-right: 6px;
          }
          .definition-list {
            width: 23px;
            height: 23px;
            position: absolute;
            right: 10px;
            cursor: pointer;
          }
          .el-breadcrumb {
            font-size: 12px;
            line-height: 18px;
            /deep/ .el-breadcrumb__inner {
              color: #409eff;
              cursor: pointer;
            }
          }
        }
        .card-button {
          // margin-left: 20px;
          margin-top: 15px;
          .basic-button {
            position: relative;
          }
          .blood {
            background: url(../../../../../src/assets/images/commonIcon/blood-icon.png)
              no-repeat;
            background-size: 100%;
          }
          .dataTable-icon {
            position: absolute;
            display: inline-block;
            width: 24px;
            height: 24px;
            left: 7px;
            top: 3px;
          }
          .el-dropdown {
            margin: 0 10px;
          }
          .el-button--mini {
            font-size: 13px;
            padding: 4px 8px;
            .svg-icon,
            .text {
              position: relative;
            }
            .text {
              margin-left: 3px;
              bottom: 3px;
            }
          }
          .yulan {
            .svg-icon {
              width: 18px;
              height: 18px;
            }
          }
          .zengjia {
            padding: 6px 7px 5px;
            .svg-icon {
              width: 16px;
              height: 16px;
            }
            .text {
              bottom: 1px;
            }
          }
          .xiugai {
            padding: 2.5px 7px 5.5px 6px;
            .svg-icon {
              width: 20px;
              height: 20px;
              top: 1px;
            }
            .text {
              bottom: 2px;
              margin-left: 0;
            }
          }
          .shanchu {
            .svg-icon {
              width: 18px;
              height: 18px;
            }
          }
          .shuaxin {
            .svg-icon {
              width: 18px;
              height: 18px;
            }
          }
          .xiazai {
            .svg-icon {
              width: 18px;
              height: 18px;
            }
          }
          .shangchuan {
            .svg-icon {
              width: 18px;
              height: 18px;
            }
          }
        }
        .card-table {
          overflow-y: auto;
          width: 100%;
          height: calc(100% - 150px);
          margin-top: 20px;
          .preview,.deleteRed,.editor,.multilink{
            width:22px;
            height:22px;
          }
          .el-button+.el-button{
            margin-left: 5px;
          }
          /deep/ .tableClass {
            border-right: none !important;
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
        }
        .card-table::-webkit-scrollbar {
          width: 5px;
          height: 10px;
        }
        .card-table::-webkit-scrollbar-track {
          background: none;
          border-radius: 2px;
        }
        .card-table::-webkit-scrollbar-thumb {
          background: rgb(239, 239, 239);
          border-radius: 10px;
        }
        .card-table::-webkit-scrollbar-thumb:hover {
          background: #bfbfbf;
        }
      }
    }
  }
  .picker-date {
    width: 180px;
  }
  .context-menu {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
    font-size: 14px;
    // display: none;
    /deep/ .el-card {
      height: auto;
      /deep/ .el-card__body {
        padding: 0px !important;
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
  .delete-dialog {
    /deep/ .el-dialog__body {
      padding: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
    .dialog-btn {
    text-align: center;
    border-top: 1px solid #e8ebed;
    padding: 10px;
  }
  }
  /deep/ .el-table__fixed-right{
    height:100%!important;
  }
  /deep/ .el-dialog{
    margin-bottom: 20px;
  }
  .new-editor-container{
    /deep/ .el-dialog__header .el-dialog__title{
      color:#818181;
      font-size: 16px;
    }
    /deep/ .el-dialog__body {
      padding: 0 12px;
    }
    .dialog-btn {
      text-align: center;
      border-top: 1px solid #e8ebed;
      padding: 10px;
    }
  }
  /deep/ .dialog-ul {
      padding: 0;
      margin: 0;
      li {
        list-style-type: none;
      }
      .el-button {
        margin-left: 10px;
      }
    }
}
.el-dropdown-menu.el-popper {
  padding: 6px 0;
  .el-dropdown-menu__item {
    line-height: 30px;
    padding: 0 15px;
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
.editorSe {
  .el-dropdown-menu__item {
    padding: 0 10px !important;
    text-align: center;
  }
}
.to-add-catalog {
  .el-dialog {
    margin-top: 8vh !important;
  }
}
</style>
<style lang="scss">
@import "../../../../styles/exportData";
</style>