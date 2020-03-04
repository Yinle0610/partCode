<!--主数据页面-->
<template>
  <div @click.capture="clickBox" class="master-data tableNoPadding">
    <div class="content-box">
      <!--右键tree节点，显示的菜单box-->
      <el-container>
        <el-aside width="20%" class="leftdiv">
          <div ref="rightMenu" v-show="showMenu" class="context-menu">
            <el-card>
              <el-row v-show="bEditAndDeleteIsShow" @click.native="getCatalogDetail(false, 'card')">详细信息</el-row>
              <el-row v-permission="'MAS_ADD_CATALOG'" @click.native="toAddCatalog(namespace)">新建目录</el-row>
              <el-row
                v-permission="'MAS_EDIT_CATALOG'"
                v-show="bEditAndDeleteIsShow"
                @click.native="toEditCatalog(editMenuId)"
              >修改目录</el-row>
              <el-row
                v-permission="'MAS_DEL_CATALOG'"
                v-show="bEditAndDeleteIsShow"
                @click.native="showDeleteDialog(deleteMenu.id)"
              >删除目录</el-row>
              <el-row v-permission="'MAS_ADVANCED_SEARCH'" v-show="bEditAndDeleteIsShow">高级搜索</el-row>
              <el-row v-permission="'MAS_IMPORT'" v-show="bEditAndDeleteIsShow">导入标准</el-row>
              <el-row v-permission="'MAS_EXPORT'"  @click.native="exportData">导出标准</el-row>
              <el-row v-if="bIsWindowMode" @click.native="toWindowMode">视窗模式</el-row>
            </el-card>
          </div>
          <div class="left-box">
            <el-card shadow="hover">
              <div class="title">
                <!--            <el-tooltip placement="top">-->
                <!--              <div slot="content">折叠/展开</div>-->
                <!--              <svg-icon-->
                <!--                  @click.native="collapseIcon"-->
                <!--                  class="collapse-class"-->
                <!--                  icon-class="icon-collapse"-->
                <!--              ></svg-icon>-->
                <!--            </el-tooltip>-->
                <span>目录</span>
                <el-tooltip placement="top">
                  <div slot="content">刷新</div>
                  <el-button
                    type="text"
                    :disabled="bIsButtonDisabled"
                    @click="refreshBtn"
                    size="small"
                    style="color:#606266;"
                    icon="el-icon-refresh"
                  ></el-button>
                </el-tooltip>
              </div>
              <div v-loading="treeLoading" class="md-tree">
                <el-tree
                  :props="props"
                  accordion
                  :load="loadNode"
                  node-key="id"
                  :default-expanded-keys="aIsExpandedArr"
                  :default-checked-keys="aIsExpandedArr"
                  ref="tree"
                  lazy
                  :highlight-current="true"
                  empty-text="暂无数据"
                  @node-click="handleNodeClick"
                  @node-expand="handleNodeClick"
                  @node-collapse="handleNodeClick"
                  @node-contextmenu="handleContextmenu"
                  :render-content="renderContent"
                ></el-tree>
              </div>
              <div class="view-filter">
                <span class="tl">视图切换</span>
                <el-select v-model="sValue" placeholder="请选择" size="small" @change="changeView">
                  <el-option
                    v-for="item in aViewData"
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
          <div class="shadow" v-if="showShadow"></div>
          <div class="right-box">
            <el-card shadow="hover" v-show="showComponent==='card'|| showComponent==='cardMain'">
              <!-- <el-scrollbar class="page-scroll"> -->
                <div class="tTitle">
                  <i class="bread-icon"></i>
                  <el-breadcrumb class="bIcon">
                    <el-tooltip placement="top" v-for="( item, index ) in Breadcrumb" :key="index"
                      :disabled="item.isDisabled"
                      :content="item.tipValue">
                      <!-- <div slot="content">{{item.tooltipValue}}</div> -->
                      <el-breadcrumb-item :key="index" @click.native="toClickBreadcrumb(item)">{{item.name}}</el-breadcrumb-item>
                    </el-tooltip>
                  </el-breadcrumb>
                  <!--自定义图标-->
                  <el-tooltip placement="top">
                    <div slot="content">自定义表头</div>
                    <svg-icon @click.native="definitionList" class="definition-list" icon-class="icon-definitionList"></svg-icon>
                  </el-tooltip>
                </div>
                <div class="btn-box">
                  <div style="float: left">
                    <el-button v-permission="'MAS_ADD'" type="primary" size="mini" class="btn add" @click="toAdd">
                      <svg-icon icon-class="zengjia"></svg-icon>
                      <span class="btn-text">新增</span>
                    </el-button>
                    <!-- <el-button type="danger" size="mini" class="btn" @click="deleteSome">
                      <svg-icon icon-class="shanchu"></svg-icon>
                      <span class="btn-text">删除</span>
                    </el-button> -->
                    <el-button type="primary" size="mini" class="btn refresh" @click="toRefresh">
                      <svg-icon icon-class="shuaxin"></svg-icon>
                      <span class="btn-text refresh">刷新</span>
                    </el-button>
                    <!-- 血缘分析 按钮 -->
                    <el-dropdown @command="handleBlood">
                      <el-button
                        class="basic-button"
                        style="width: 80px;
                                text-align: center;
                                padding: 0px;
                                height: 30px;
                                padding-left: 10px;"
                        type="primary"
                      >
                        <i class="dataTable-icon blood"></i>关系
                        <!-- <svg-icon icon-class="xian"></svg-icon>
                        <svg-icon icon-class="more"></svg-icon> -->
                      </el-button>
                      <el-dropdown-menu class="master-data_drop" slot="dropdown" trigger="click">
                        <el-dropdown-item :command="'backward'">参考</el-dropdown-item>
                        <el-dropdown-item :command="'forward'">应用</el-dropdown-item>
                        <el-dropdown-item :command="'full'">全链</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <!--<div class="search">
                  关键字：
                  <el-input
                      clearable
                      size="mini"
                      placeholder="请输入内容"
                      v-model="keyWord"
                      @keyup.enter.native="getTableData"
                  >
                    <i slot="suffix" style="cursor: pointer" class="el-input__icon el-icon-search"
                       @click="getTableData"></i>
                  </el-input>
                  </div>-->
                  <el-form style="width:320px;float:right;display:flex; margin-top: -4px;" :inline="true">
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
                        <i slot="suffix" class="el-icon-search" @click="goToSearch"></i>
                      </el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div  class="card-table" v-loading="oMasterData.bLoading">
                  <el-table
                  v-if="!oMasterData.bLoading"
                  border
                  size="mini"
                  align="center"
                  :data="tableData"
                  style="width: 100%;"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="40"></el-table-column>
                  <!--动态表头渲染-->
                  <el-table-column
                    :prop="item.prop"
                    :label="item.label"
                    v-for="item in tableHeader2"
                    :key="item.prop"
                    :show-overflow-tooltip='showToolTip'
                    sortable
                    :width="item.prop==='namespace'?'240':null"
                  ></el-table-column>
                  <!--              <el-table-column prop="code" label="标准代码" align="center" width="" show-overflow-tooltip>-->
                  <!--              </el-table-column>-->
                  <!--              <el-table-column prop="name" label="标准名称" align="center" width="" show-overflow-tooltip>-->
                  <!--              </el-table-column>-->
                  <!--              <el-table-column prop="businessDef" label="业务定义" align="center" width="400" show-overflow-tooltip>-->
                  <!--              </el-table-column>-->
                  <el-table-column label="操作" align="center" fixed="right" width="160">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                        <el-button type="text" @click="toDetails(scope.row)">
                          <svg-icon icon-class="preview" class="preview"></svg-icon>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                        <el-button v-permission="'MAS_EIDT'" type="text" @click="toEdit(scope.row)">
                          <svg-icon icon-class="editor" class="editor"></svg-icon>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="全链分析" placement="bottom">
                        <el-button type="text" @click="handleBlood2('full',scope.row)">
                          <svg-icon icon-class="multilink" class="multilink"></svg-icon>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                        <el-button v-permission="'MAS_DEL'" @click='deleteSome(scope.row)' type="text" size="small" >
                          <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
                </div>

                <div style="text-align: center; padding: 15px 0 15px 0" v-if="oPage.total>0">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="oPage.pageCurrent"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="oPage.pageSize"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="oPage.total"
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
            <window-mode
                ref="windowMode"
                v-if="showComponent==='windowMode'"
                @showmain="getShowChange"
                :windowModeId="windowModeId"
                :windowModeNamespace="windowModeNamespace"
                @getCatalogDetail="getCatalogDetail"
                @toAddCatalog="toAddCatalog"
                @toEditCatalog="toEditCatalog"
                @showDeleteDialog="showDeleteDialog"
            ></window-mode>
            <master-data-detail @toEdit='detailToEdit' @refreshTable="toRefresh" @showDetail='showMasterDetail' ref="masterDetail" v-show="showComponent==='masterDetail'"></master-data-detail>
          </div>
        </el-main>
      </el-container>
      <!--新增目录-->
      <el-dialog
        destroy-on-close
        :visible.sync="bIsCatalogVisible"
        class="to-add-catalog"
        @close="closeCatalogDialog"
        >
        <div v-show="addMenuTitle" slot="title">新建目录</div>
        <div v-show="!addMenuTitle" slot="title">修改目录</div>
        <el-form
          :model="baseInfoRuleForm"
          :rules="baseInfoRules"
          ref="baseInfoRuleForm"
          label-width="110px"
          style="margin-top:20px;"
        >
          <el-form-item label="目录代码：" class="is-required" prop="menuCode">
            <el-input
              :disabled="bIsMenuCodeDisabled"
              size="small"
              onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
              v-model="baseInfoRuleForm.menuCode"
              placeholder="请输入目录代码..."
            ></el-input>
          </el-form-item>
          <el-form-item label="目录名称：" class="is-required" prop="cnName">
            <el-input
              size="small"
              onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
              v-model="baseInfoRuleForm.cnName"
              placeholder="请输入目录名称..."
            ></el-input>
          </el-form-item>
          <!--<el-form-item v-if="catalogMean" label="目录含义：" prop="enName">
            <el-input size="small" v-model="baseInfoRuleForm.enName" placeholder="请输入目录含义..."></el-input>
          </el-form-item>
          <el-form-item v-if="standardShow" label="归属标准：" prop="classify">
            <el-select disabled size="small" v-model="baseInfoRuleForm.classify" placeholder="请选择" @change="classifyListChange">
              <el-option
                  v-for="(item, index) in classifyList"
                  :key="index"
                  :value="item.classifierId"
                  :label="item.classifierName"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <!--选择目录 tree-->
          <el-form-item label="上级目录：" prop="catalog" class="choice-catalog-item is-required">
            <el-select
              size="small"
              :disabled="true"
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
          <!--目录含义。标准类型通过接口动态获取-->
          <!-- <el-form-item
            v-for="(item, index) in editInputList"
            :key="index"
            :label="`${item.name}：`"
          >
            <el-input
              size="small"
              :disabled="item.name.includes('类型')?true:false"
              v-model="baseInfoRuleForm[item.attrStore]"
            ></el-input>
          </el-form-item>-->
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
      <!-- <el-dialog :visible.sync="bIsUserVisible" class="duty-dialog">
        <div slot="title">请选择用户</div>
        <div>
          <div class="tag-box" style>
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
      </el-dialog>-->

      <!-- 删除提示 -->
      <el-dialog :visible.sync="deleteDialog" class="delete-dialog" title="删除提示" width="50%">
        <delete-dialog ref="deleteMenuDialog"></delete-dialog>
        <div class="dialog-btn">
          <el-button type="primary" @click="isDeleteMenu?toDelCatalog():toDelete()">确定</el-button>
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
          <el-button size="small" type="primary" @click="submitEditForm()">确定</el-button>
        </div>
      </el-dialog>

      <!-- 新增，编辑弹窗 -->
      <el-dialog
        :title="masterDataDialogTitle"
        :destroy-on-close="true"
        @close="closemasterDataDialog"
        width="60%"
        :visible.sync="showAddMasterData">
        <master-data-add @hiddenDialog='hiddenDialog' @sendAddInfo='setTreePosition' v-if="masterDataDialogTitle ==='新增'" ref='masterDataAdd'></master-data-add>
        <master-data-edit @hiddenDialog='hiddenDialog' @getEditInfo='handleEdit' v-if="masterDataDialogTitle ==='编辑'" ref='masterDataEdit'></master-data-edit>
        <div class="dialog-btn">
          <el-button type="primary" @click="masterDataDialogTitle==='新增'?toAddMasterData():toEditMasterData()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 元数据信息下的2个table的组件 元数据详情页也会用到
import { get, post, postByJson, parseAjaxResponse, downloadFile } from "@/utils/request";
import { generateLineageTitle } from "@/utils";
import deleteDialog from "../../deleteDialog/deleteDialog";
import pinyin from "pinyin";
import catalogDetail from "./../../../common/catalogDetail";
import windowMode from "../../../common/windowMode";
import { loadingStandard, loading } from '@/utils/layer'
import masterDataAdd from './masterDataAdd'
import masterDataEdit from './masterDataEdit'
import masterDataDetail from './components/masterDataDetails'
export default {
  name: "masterData",
  components: {
    deleteDialog,
    catalogDetail,
    windowMode,
    masterDataAdd,
    masterDataEdit,
    masterDataDetail
  },
  data() {
    var validateMenuCode = (rule, value, callback) => {
      if (this.addMenuTitle) {
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
        callback()
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
      showShadow: false,
      count: 0,
      masterDataDialogTitle: '新增',
      showAddMasterData: false,
      keyWordList: [],
      searchKeyWord: null,
      deleteDialog: false,
      isDeleteMenu: false,
      showComponent: "card",
      windowModeDetailToMain: false,
      windowModeDeleteCatalog: false,
      windowModeDeleteId: null,
      windowModeId: null,
      windowModeNamespace: "",
      sVal: "",
      goPageStr: '',

      tableHeader: [],
      definitionListDialog: false, // 自定义表头弹出框显示隐藏
      definitionDataList: [],
      selectClassfierName: null, // 新建目录时，归属标准设置默认选项
      tableHeader2: [], // 选中表头
      tableHeaderAll: [], // 表头全部参数
      moveElement: null, // 移动的元素
      moveIndex: null,
      moveIndex2: null,
      ifCurrentNode: true, // 目录详情显示时，做增删改操作，判断是否为当前节点
      /* 右键菜单 - 目录相关参数*/
      showMenu: false,
      removeData: {},
      // 右键时tree数据
      deleteMenu: {},
      namespace: "",
      // 根节点路径为空时  默认右键获取的路径
      parentName: "",
      // 右键目录ID
      editMenuId: "",
      // 右键- 修改、删除目录是否显示
      bEditAndDeleteIsShow: false,
      // 右键 - 是否是 视窗模式
      bIsWindowMode: false,
      // 是否为  新增目录标题
      addMenuTitle: false,
      // 归属标准下拉数据
      classifyList: [],
      classifyOption: "",
      classifyValue: "",
      userTagList: {},
      getEditList: [],
      // 归属标准  和  目录含义  显示隐藏
      catalogMean: false,
      standardShow: false,

      // 当前选中的Tree节点id
      instanceId: "",
      bIsUserVisible: false, // 选择用户 是否可见
      bIsCatalogVisible: false, // 新建目录 是否可见
      bIsMenuCodeDisabled: false, // 目录代码 是否 可编辑
      baseInfoRuleForm: {
        menuCode: "",
        cnName: "",
        enName: "",
        classify: "",
        catalog: "请选择...",
        // 责任人id
        dutyUserId: "",
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
        selectUser: null
      },
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
        catalog: [
          { required: true, message: "请选择上级目录", trigger: "blur" }
        ],
        selectGroup2: [{ validator: validateGroup, trigger: "blur" }],
        selectUser2: [{ validator: validateUser, trigger: "blur" }]
      },
      bIsDutyUserIdShow: false,

      bIsShowCatalogTree: false,
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      userProps: {
        children: "users",
        label: "userName"
      },
      userTree: [],
      // 面包屑
      // breadcrumb: [
      //   { value: "全部", keyLevel: 0, tooltipValue: "", isDisabled: true }
      // ],
      Breadcrumb: [{ name: "全部", isDisabled: true }],
      setBreadList: [{ name: "全部", isDisabled: true }],
      treeNodeArr: [],
      sTooltipValue: "",
      keyWord: "",
      oMasterData: {
        aTableData: [],
        bLoading: false
      },
      tableData: [],
      oPage: {
        pageCurrent: 1,
        pageSize: 30,
        total: 0
      },
      multipleSelection: [],

      // 显示模式是否展示代码
      bShowCode: true,
      // 搜索框数据
      sKeyword: "",
      // 视图切换下拉框数据
      aViewData: [],
      // 视图切换下拉框选中项
      sViewId: "",
      sValue: "",
      props: {
        label: "name",
        children: "children",
        isLeaf: "leaf"
      },
      aIsExpandedArr: [],
      node: [],
      clickNode: null,
      nodeText: [],
      nodeFirst: [],
      resolve: [],
      // 当前选中的Tree节点数据类型
      sNodeType: "",
      treeLoading: true,
      // 层架关系旁边的 刷新按钮，是否失效
      bIsButtonDisabled: false,

      // 当前新增的classifierId
      classifierId: "",
      // 当前新增的classifierName
      classifierName: "",
      // 当前元数据的code
      sCode: "",
      // 右键操作目录时判断是否有子节点
      nodeIsLeaf: "",
      bIsNodeExpanded: null,
      bIsNodeExpandedId: "",

      // 拼接 - 归属标准id
      classifyNameId: "",
      // 目录含义、标准类型
      editInputList: [],
      sendInstanceId: "",
      toAddMsg: {
        namespace: "",
        namespaceCN: "",
        node: []
      },
      value: "",
      nodeId: "",
      selectItem: '', // 删除的当条信息
      exportId: '',
      // 视图id
      viewId: '',
      showToolTip: true,
      fromDetail: false
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
    hiddenDialog() {
      this.showAddMasterData = false
    },
    showMasterDetail(val) {
      this.showComponent = val
    },
    handleEdit() {
      this.showAddMasterData = false
      this.getInfoItem()
      if (this.fromDetail) {
        this.$refs.masterDetail.getParMsg()
      }
    },
    setTreePosition(val) {
      this.showAddMasterData = false
      // 清空搜索框内容
      this.keyWord = ""
      console.log(this.nodeFirst);
      console.log(this.value, "view");
      if (val.nodeList && val.addNode) {
        // 再次新增规则   且  挂载点（路径）改变了
        let nodeList = val.nodeList;
        console.log(nodeList, "nodeList");
        //  为系统视图  挂载点规则上还有一个规则目录
        if (this.viewId === '0') {
          nodeList.map(item => {
            item.data.level = item.level + 2;
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
          this.aIsExpandedArr = [];
          this.aIsExpandedArr.push(this.nodeFirst.childNodes[0].data.id);
          this.nodeId = this.nodeFirst.childNodes[0].data.id;
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
                this.$refs.tree.setCurrentKey(item.data.id);
              }, index * 500);
            });
          }, 500);
        } else {
          nodeList.map(item => {
            item.data.level = item.level + 1;
            return item;
          });
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
              this.$refs.tree.setCurrentKey(item.data.id);
            }, index * 500);
          });
        }
        // 当前节点id   用来获取table数据
        this.nodeId = nodeList[nodeList.length - 1].data.id;
        this.instanceId = this.nodeId
        // 获取table信息项数据
        this.setCurrentPageToOne();
        // 重置面包屑
        this.Breadcrumb = [{ name: "全部", isDisabled: true }];
        this.setBreadList = [{ name: "全部", isDisabled: true }];
        // 调用方法 处理面包屑的赋值
        this.setBreadcrumb(nodeList[nodeList.length - 1]);
        this.Breadcrumb = this.setBreadList;
      } else if (val.nodeList && !val.addNode) {
        // 再次新增规则   且  挂载没变
        this.Breadcrumb = val.nodeList;
        console.log(this.Breadcrumb);
        console.log(this.Breadcrumb);
        this.$refs.tree.setCurrentKey(
          this.Breadcrumb[this.Breadcrumb.length - 1].id
        );
      } else {
        // 未新增
        this.setCurrentPageToOne();
      }
    },
    closemasterDataDialog() {
      console.log('000')
      this.fromDetail = false
      this.masterDataDialogTitle = ''
    },
    toAddMasterData() {
      this.$nextTick(() => {
        this.$refs.masterDataAdd.toSave()
      })
      // this.showAddMasterData = false
    },
    toEditMasterData() {
      // this.showAddMasterData = false
      this.$nextTick(() => {
        this.$refs.masterDataEdit.toSave()
      })
    },
    // 视窗模式
    toWindowMode() {
      this.showMenu = false; // box不显示
      this.showComponent = 'windowMode'
    },
    exportData() {
      let load = loadingStandard('正在导出,请稍候...')
      downloadFile('/masterData/downMasterDataAndCode', {
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
      console.log(val)
      console.log(this.goPageStr)
      if (val === 'card' && this.goPageStr === 'windowMode') {
        this.showComponent = 'windowMode';
        this.goPageStr = "card"
      } else {
        this.showComponent = val;
      }

      if (val === 'cardMain' && this.goPageStr === 'windowMode') {
        this.windowModeDetailToMain = true
      } else {
        this.windowModeDetailToMain = false
      }
    },
    getShowChange2(val) {
      if (this.windowModeDetailToMain) {
        this.node = this.nodeFirst
      }
      console.log(this.node.parent, 'this.node')

      // if (this.node.parent.data.classifierId.includes("Parent")) {
      if (this.node.parent !== null) {
        this.node.parent.childNodes.map(item => {
          item.expanded = false;
        });
      } else { // tree的第一个节点
        this.node.childNodes.map(item => {
          item.expanded = false;
          item.childNodes.map(item => {
            if (item.expanded) { // 节点状态 已展开
              item.expanded = false;
            }
          })
        });
      }
      // }
      this.aIsExpandedArr = [];
      if (this.node.data === undefined) { // tree的第一个node (windowMode 视窗模式的情况)
        this.node = this.node.childNodes[0]
      }
      if (this.node.namespace !== val.namespace) {
        let pathName = val.path;
        pathName = pathName.substring(
          pathName.indexOf(this.node.data.name) + this.node.data.name.length + 1
        );
        let arr = pathName.split("/");
        this.node.data.level = this.node.level;
        this.Breadcrumb.map((item, index) => {
          console.log(item.level, this.node.data.level);
          if (item.level !== undefined) {
            if (item.level === this.node.data.level) {
              this.Breadcrumb.splice(index, this.Breadcrumb.length);
            }
          }
        });
        let paramsId = ""
        if (this.windowModeDeleteCatalog) { // 视窗模式 - 右键 - 删除目录时
          paramsId = this.windowModeDeleteParentId
        } else {
          paramsId = this.node.data.id
        }
        get(`/ds/details/${paramsId}`).then(res => {
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
            if (res.data.attributes.length === 0) { // 无标记时
              console.log("修改目录 无标记时")
              if (!this.Breadcrumb.includes(this.node)) {
                this.Breadcrumb.push(this.node.data);
                this.getActiveNode(this.node, arr, val);
              } else {
                this.getActiveNode(this.node, arr, val);
              }
            }
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
            this.aIsExpandedArr = [];
            this.aIsExpandedArr.push(val.data.id);
            this.$refs.tree.setCurrentKey(val.data.id);

            if (this.windowModeDetailToMain && val.data.id !== this.windowModeDeleteId) {
              console.log(val, 'val val')
              this.refreshLazyTree(val); // 刷新 - 当前节点tree数据
              setTimeout(() => {
                console.log(val.data, "setTimeout")
                this.$refs.tree.setCurrentKey(val.data.id);
              }, 1000)
            }

            this.resetTable(val.data.id);
            console.log(val, val.data.name, arr);
            console.log(arr, 'arr');
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
          } else if (arr[0] === "") { // arr=[""] 为空， 视窗模式 - 在Parent 节点下 新建目录
            if (this.windowModeDetailToMain) {
              this.refreshLazyTree(this.node); // 刷新 - 当前节点tree数据
            }
          }
        });
      } else {
        console.log("un");
        if (!node.isLeaf) {
          console.log("un", "noleaf");
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
      this.keyword = "";
      this.searchKeyWord = "";
      this.oPage.pageSize = 30;
      this.oPage.pageCurrent = 1;
      this.getInfoItem();
    },
    getCatalogDetail(type, goPageStr, selectId) {
      // console.log(type)
      // console.log(goPageStr)
      // console.log(selectId)
      if (selectId) {
        this.editMenuId = selectId
      }
      this.goPageStr = goPageStr

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
        console.log(dataList);
        this.$refs.catalogDetail.dataList = dataList;
        this.$refs.catalogDetail.instanceId = this.editMenuId;
        console.log(this.$refs.catalogDetail.dataList);
      });
    },
    // 左边拖拽事件
    dragControllerDiv(e) {
      let width = document.getElementsByClassName("el-container")[0]
        .clientWidth;
      let remove = document.getElementsByClassName("resize");
      let left = document.getElementsByClassName("leftdiv");
      let c = e.clientX - left[0].clientWidth;

      let newWidth = null;
      console.log(e, remove, left, width);
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
    // 层级关系 - 展开/折叠
    collapseIcon() {},
    // 自定义表头点击事件
    definitionList() {
      this.definitionListDialog = true;
      this.getListClassifier();
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
        classifierId: this.classifyNameId,
        headers: arr.join(",")
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.definitionListDialog = false;
          this.loading = false;
          this.$message({
            message: res.message,
            type: "success"
          });
          this.setCurrentPageToOne();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    clearEditDialog() {},

    // 搜索框事件
    goToSearch() {
      if (this.searchKeyWord !== null && this.keyWord !== null) {
        this.setCurrentPageToOne();
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
        classifierId: this.classifyNameId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.keyWordList = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },

    /* 调整自定义列表CheckBox位置 -- 开始 */
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
    /* 调整自定义列表CheckBox位置 -- 结束 */

    // 头部 血缘分析
    handleBlood(command) {
      if (this.multipleSelection.length === 1) {
        this.showShadow = true
        this.$router.push({
          name: "dsLineageAnalysisCanvas",
          params: {
            dataFlowType: command,
            id: this.multipleSelection[0].instanceId,
            _title: generateLineageTitle(
              command,
              this.multipleSelection[0].instanceName
            )
          }
        });
      } else {
        this.$message.warning("请选择一条数据!");
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
    refreshBtn() {
      this.bIsButtonDisabled = true; // 刷新按钮 失效
      if (this.clickNode === null) {
        this.changeView();
      } else {
        console.log("refreshLazyTree");
        this.refreshLazyTree(this.clickNode);
      }
    },
    // 新增目录
    toAddCatalog(namespace, windowModeFlag) {
      this.bIsMenuCodeDisabled = false; // 目录代码 可编辑
      this.showMenu = false;
      this.addMenuTitle = true;
      this.bIsCatalogVisible = true;

      // 接收 组件windowMode 视窗模式 传过来的参数
      this.namespace = namespace
      this.windowModeDetailToMain = windowModeFlag
      console.log(windowModeFlag, 'windowModeFlag')

      this.getListClassifier()
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
          // console.log(res);
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
          /* this.addInputList = res.data;
            this.addInputList.map(item => {
              if (item.attCode === "Tag") {
                this.catalogMean = true;
              }
              if (item.attName === "标准类型") {
                this.standardShow = true;
              }
            });*/
          // this.getListClassifier();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取上级目录
    getPath(val) {
      get("/ds/getStandardContext", {
        namespace: val === "add" ? this.toAddMsg.namespace : this.namespace,
        isContainRoot: true,
        isContainIndex: false
      }).then(res => {
        if (res.code === 10000 && res.success) {
          if (val === "add") {
            this.toAddMsg.namespaceCN = res.data;
            this.showAddMasterData = true
            let params = {
              id: 0,
              msg: this.toAddMsg
            }
            this.$nextTick(() => {
              // // console.log(this.$refs.ruleAdd)
              this.$refs.masterDataAdd.getParMsg(params)
            })
            // this.$router.push({
            //   name: "masterDataAdd",
            //   params: {
            //     id: 0,
            //     msg: this.toAddMsg
            //   }
            // });
          } else {
            this.baseInfoRuleForm.catalog =
              res.data === "" ? this.parentName : res.data;

            // 视窗模式 数据设置
            if (this.windowModeDetailToMain) {
              this.sVal = {
                namespace: this.namespace,
                path: res.data
              }
            }
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取归属标准下拉框数据
    getListClassifier() {
      get("/ds/application/rule/listClassifier").then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.classifyList = res.data;
            // 根据懒加载的node 的data 获取 信息项的classifierId
            // if (this.classifyNameId === "") {
            //   if (this.nodeFirst.childNodes[0].data.classifierId.indexOf('Parent') !== -1) {
            //     this.classifyNameId = this.nodeFirst.childNodes[0].data.classifierId.split('_')[1];
            //     this.classifyNameId = `${this.classifyNameId}InfoItem`
            //   }
            // }
            // 获取自定义列表数据
            if (this.definitionListDialog === true) {
              get("/ds/listQueryHeaders/" + this.classifyNameId).then(res => {
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
            } else {
              // 归属标准 默认显示
              res.data.map(item => {
                if (item.classifierId === this.classifyNameId) {
                  // 归属标准Id
                  // this.baseInfoRuleForm.classify = item.classifierName
                  this.classifierId = item.classifierId;
                  this.classifierName = item.classifierName;
                  console.log(this.editInputList, 6);
                  this.editInputList.map(i => {
                    // console.log(i,'03')
                    if (
                      i.attCode === "Standard_type" ||
                      i.attrCode === "Standard_type"
                    ) {
                      this.$set(
                        this.baseInfoRuleForm,
                        i.attrStore,
                        item.classifierName
                      );
                    }
                    if (this.addMenuTitle && i.attCode === 'Is_Entity' || this.addMenuTitle && i.attrCode === 'Is_Entity') {
                      this.$set(
                        this.baseInfoRuleForm,
                        i.attrStore,
                        'F'
                      );
                    }
                  });
                }
              });
            }
          }
        });
        // this.getListFeature();
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
        selectGroup2: null,
        selectUser: null,
        selectGroup: null,
        selectUser2: null
      };
    },
    handleUserNodeClick(node, data, component) {
      console.log(node);
      console.log(data);
      if (!node.groupName) {
        this.userTagList = { id: node.userId, username: node.userName };
      }
      console.log(this.userTagList, 1);
    },
    classifyListChange(val) {
      this.classifierId = val;
      this.classifyList.map(item => {
        if (item.classifierId === val) {
          this.classifierName = item.classifierName;
        }
      });
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
      if (this.addMenuTitle) {
        // if (
        //   this.baseInfoRuleForm.dutyUserId === "" ||
        //   this.baseInfoRuleForm.dutyUserId === ""
        // ) {
        //   this.bIsDutyUserIdShow = true;
        // } else {
        //   this.bIsDutyUserIdShow = false;
        // }
        this.$refs.baseInfoRuleForm.validate(valid => {
          if (valid) {
            let attr = [];
            let msg = {
              dataStandardVO: {
                parentId: this.sendInstanceId, // 目录节点id
                code: this.baseInfoRuleForm.menuCode, // 目录代码
                name: this.baseInfoRuleForm.cnName, // 名称
                attributes: []
              },
              parentPathEn: this.namespace, // 上级目录en
              purport: this.baseInfoRuleForm.enName, // 含义
              user: {
                userId: this.catalogData.selectUser
              },
              group: {
                groupId: this.catalogData.selectGroup
              }
              // user: {
              //   userId: this.baseInfoRuleForm.dutyUserId
              // }
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
            console.log(msg);
            postByJson("/ds/saveCatalogue", msg).then(res => {
              if (res.code === 10000 && res.success) {
                this.bIsCatalogVisible = false;
                this.$refs["baseInfoRuleForm"].resetFields();

                console.log(this.windowModeDetailToMain)
                if (this.windowModeDetailToMain) { // windowMode 视窗模式 新建目录的情况
                  this.getShowChange2(this.sVal)
                  // 刷新 视窗模式 - 画布数据
                  this.$refs.windowMode.queryDiagramData()
                } else { // 点击tree节点时 - 新建目录的情况
                  // 没有子节点  新增时-刷新整个树
                  if (this.nodeIsLeaf) {
                    this.refreshLazyTree(this.node.parent);
                  } else {
                    this.refreshLazyTree(this.node);
                  }
                }

                this.$message.success(res.message);
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            return false;
          }
        });
      } else {
        // 编辑
        // if (
        //   this.baseInfoRuleForm.dutyUserId === "" ||
        //   this.baseInfoRuleForm.dutyUserId === ""
        // ) {
        //   this.bIsDutyUserIdShow = true;
        // } else {
        //   this.bIsDutyUserIdShow = false;
        // }
        this.$refs.baseInfoRuleForm.validate(valid => {
          if (valid) {
            // console.log(this.getEditList, 1)
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
              // user: {
              //   userId: this.dutyUserId
              // }
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
            console.log(msg);
            postByJson("/ds/saveCatalogue", msg).then(res => {
              if (res.code === 10000 && res.success) {
                this.bIsCatalogVisible = false;
                if (this.ifCurrentNode) {
                  this.getCatalogDetail(true);
                }

                if (this.windowModeDetailToMain) { // windowMode 视窗模式 修改目录的情况
                  this.getShowChange2(this.sVal)
                  // 刷新 视窗模式 - 画布数据
                  this.$refs.windowMode.queryDiagramData()
                } else { // 在节点上 - 修改目录的情况
                  this.refreshLazyTree(this.node.parent);
                }

                this.$message.success(res.message);
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            return false;
          }
        });
      }
    },

    refreshLazyTree(node) {
      this.treeLoading = true;
      let params = {};
      if (node.data) {
        params = {
          id: node.data.id,
          nodeType: node.data.notetype
        };
      } else {
        params = {
          id: "",
          nodeType: ""
        };
      }
      get("/masterData/dsMDTree", params).then(res => {
        if (res.success && res.code === 10000 && res.success) {
          this.treeLoading = false;
          this.bIsButtonDisabled = false; // 刷新按钮 不失效
          const list = res.data.map(item => {
            item.isLeaf = item.leaf;
            return item;
          });
          node.childNodes = [];
          node.doCreateChildren(list);
          if (this.noSonTree) {
            // 设置默认节点高亮
            this.$refs.tree.setCurrentKey(this.noSonTree.data.id);
          } else {
            // 设置默认节点高亮
            this.$refs.tree.setCurrentKey(node.data.id);
          }
        }
      });
    },
    // 修改目录
    toEditCatalog(selectedId, namespace, windowModeFlag) {
      this.bIsMenuCodeDisabled = true; // 目录代码 不可编辑
      this.showMenu = false;
      this.addMenuTitle = false;

      // 接收 组件windowMode 视窗模式 传过来的参数
      this.namespace = namespace
      this.windowModeDetailToMain = windowModeFlag

      this.toAddUserShow(); // 获取部门列表
      get("/ds/getCatlogDetail", {
        id: selectedId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          // this.editInputList = [];
          this.getEditList = res.data;
          this.classifierId = res.data.belongEn;
          this.classifierName = res.data.belongCn;
          res.data.dataStandardVO.attributes.map(item => {
            console.log(item);
            if (item.columnType === "combobox") {
              get("/ds/listStandardAttrComboboxInfos", {
                columnTypeValue: item.datatypeId
              }).then(res => {
                console.log(res, "96");
                item.selectList = res.data;
                // this.editInputList.push(item);
                this.editInputList[item.attrStore] = item.value
              });
            } else {
              // this.editInputList.push(item);
              this.editInputList[item.attrStore] = item.value
            }
            this.baseInfoRuleForm[item.attrStore] = item.value;
          });
          this.baseInfoRuleForm.menuCode = res.data.dataStandardVO.code;
          this.baseInfoRuleForm.cnName = res.data.dataStandardVO.name;
          this.baseInfoRuleForm.catalog = res.data.parentPathCn;

          // 视窗模式 数据设置
          if (this.windowModeDetailToMain) {
            this.sVal = {
              namespace: this.namespace,
              path: this.baseInfoRuleForm.catalog
            }
          }

          if (res.data.group) {
            this.baseInfoRuleForm.selectGroup2 = res.data.group.groupName;
            this.baseInfoRuleForm.selectUser2 = res.data.user.username;
          } else {
            this.baseInfoRuleForm.selectGroup2 = null;
            this.baseInfoRuleForm.selectUser2 = null;
          }
          this.namespace = res.data.parentPathEn;
          this.sendInstanceId = res.data.dataStandardVO.id;
          console.log(this.baseInfoRuleForm, 6);

          let EditMsg = res.data;
          // if (EditMsg.belongCn) {
          //   this.standardShow = true;
          this.getListClassifier();
          // }
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
                  this.catalogData.selectUser2 = null;
                }
                console.log(this.catalogData.selectUser);
              }
            });
          } else {
            this.catalogData.selectGroup = null;
          }
          // this.baseInfoRuleForm = {
          //   cnName: EditMsg.name, // 名称
          //   enName: EditMsg.purport, // 含义
          //   classify: EditMsg.belongCn, // 归属标准
          //   catalog: EditMsg.parentPathCn // 上级目录
          // };
          // if (res.data.user.username) {
          //   this.userTagList = res.data.user;
          //   this.baseInfoRuleForm.dutyUserId = this.userTagList.userId;
          // } else {
          //   this.userTagList = {};
          //   this.baseInfoRuleForm.dutyUserId = "";
          // }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 删除目录
    showDeleteDialog(deleteId, namespace, windowModeFlag, windowModeDeleteCatalog, windowModeDeleteParentId) {
      // 接收 组件windowMode 视窗模式 传过来的参数
      this.namespace = namespace
      this.windowModeDetailToMain = windowModeFlag
      this.windowModeDeleteCatalog = windowModeDeleteCatalog
      if (this.windowModeDetailToMain) { // 视窗模式
        this.getPath()
      }
      if (this.windowModeDeleteCatalog) { // 视窗模式 - 右键 - 删除目录时，保存parentId
        this.windowModeDeleteParentId = windowModeDeleteParentId
        this.windowModeDeleteId = deleteId
      }

      this.isDeleteMenu = true;
      this.showMenu = false;
      this.deleteDialog = true;
      this.$nextTick(() => {
        this.$refs.deleteMenuDialog.activeFirst();
        this.$refs.deleteMenuDialog.getAllMsg(deleteId !== null ? deleteId : this.deleteMenu.id);
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
            id: this.windowModeDeleteId !== null ? this.windowModeDeleteId : this.deleteMenu.id
          }).then(res => {
            if (res.code === 10000 && res.success) {
              this.$message.success("删除成功!");
              this.deleteDialog = false;
              load.close()
              this.Breadcrumb.map((item, index) => {
                if (item.id === this.node.data.id) {
                  this.Breadcrumb.splice(index, this.Breadcrumb.length);
                }
              });

              if (this.windowModeDetailToMain) { // windowMode 视窗模式 删除目录的情况
                console.log(this.sVal, 'this.sVal')

                this.getShowChange2(this.sVal)
                // 刷新 视窗模式 - 画布数据
                this.$refs.windowMode.queryDiagramData()
              } else {
                if (this.node.parent.childNodes.length > 1) {
                  this.refreshLazyTree(this.node.parent);
                } else {
                  this.refreshLazyTree(this.node.parent.parent);
                }
                // 刷新信息项表格数据，高亮当前节点的父节点
                this.instanceId = this.node.parent.data.id
                this.setCurrentPageToOne()
                setTimeout(() => {
                  this.$refs.tree.setCurrentKey(this.node.parent.data.id)
                }, 1000)
              }
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
    handleCatalogNodeClick(data) {
      console.log(data);
      this.baseInfoRuleForm.catalog = data.label;
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
    getUserList2(val) {
      this.baseInfoRuleForm.selectUser2 = val;
      this.catalogData.selectUser2 = val;
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
    // 选择用户 - 确定
    // toSaveUser() {
    //   this.bIsUserVisible = false;
    //   this.baseInfoRuleForm.dutyUserId = this.userTagList.id;

    // if (
    //   this.baseInfoRuleForm.dutyUserId === "" ||
    //   this.baseInfoRuleForm.dutyUserId === ""
    // ) {
    //   this.bIsDutyUserIdShow = true;
    // } else {
    //   this.bIsDutyUserIdShow = false;
    // }
    // },
    // 关闭tags
    closeTag(item) {
      this.userTagList = {};
      this.baseInfoRuleForm.dutyUserId = "";
    },

    toDetails(row) {
      console.log(row);
      let params = {
        id: row.instanceId,
        classifierId: row.classifierId,
        _title: row.name,
        headerTitle: row.name
      }
      this.$nextTick(() => {
        this.$refs.masterDetail.getParMsg(params)
      })
      // this.$router.push({
      //   name: "masterDataDetails",
      //   params: {
      //     id: row.instanceId,
      //     classifierId: row.classifierId,
      //     _title: row.name,
      //     headerTitle: row.name
      //   }
      // });
    },
    // 点击面包屑，定位到树tree节点展开
    toClickBreadcrumb(item) {
      this.searchNode(this.nodeFirst, item.id)
      console.log(item);
      this.aIsExpandedArr = [];
      this.aIsExpandedArr.push(item.id);
      // 设置默认节点高亮
      this.$refs.tree.setCurrentKey(item.id);
      // 同时更新信息项列表数据
      if (item.notetype === "metadata") {
        // 元数据类型为nodetype时，查询右侧信息项列表
        this.instanceId = item.id;
        // 获取右侧主数据信息项的列表
      } else {
        this.instanceId = ""
      }
      this.setCurrentPageToOne();
      let len = this.Breadcrumb.length - 1;
      this.Breadcrumb.map((val, index) => {
        if (val.level === item.level && val.id === item.id) {
          this.Breadcrumb.splice(index + 1, len);
        }
      });
    },
    searchNode(node, id) {
      console.log(node)
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
    // 跳转到新增页面
    toAdd() {
      // console.log(this.node, 'toAdd')
      this.masterDataDialogTitle = '新增'
      if (this.node.data) {
        // 用户视图 data有数据
        if (this.node.data.notetype !== 'view') {
          this.getPath("add");
        } else {
          // 点击view层 node.data 有数据 nodetype等于view
          this.$message.warning("请选择挂载目录！")
        }
      } else if (this.node.childNodes[0].data.notetype !== 'view') {
        // 刚进入系统视图时 node的data为undefined childnodes[0]的data.notetype等于view
        this.getPath("add");
      } else {
        this.$message.warning("请选择挂载目录！")
      }
    },
    // toEdit() {
    //   let len = this.multipleSelection.length;
    //   if (len === 0) {
    //     this.$message.warning("请勾选一条数据");
    //   } else {
    //     if (len > 1) {
    //       this.$message.warning("请勾选一条数据");
    //     } else {
    //       // 0<len<=1
    //       console.log(this.multipleSelection[0]);
    //       let id = this.multipleSelection[0].instanceId;
    //       let classifierId = this.multipleSelection[0].classifierId;
    //       let name = this.multipleSelection[0].name;
    //       this.$router.push({
    //         name: "masterDataEdit",
    //         params: {
    //           id: id,
    //           classifierId: classifierId,
    //           titleName: name,
    //           _title: name
    //         }
    //       });
    //     }
    //   }
    // },
    detailToEdit(val) {
      this.masterDataDialogTitle = '编辑'
      this.fromDetail = true
      this.showAddMasterData = true
      this.$nextTick(() => {
        // // console.log(this.$refs.ruleAdd)
        this.$refs.masterDataEdit.getParMsg(val)
      })
    },
    toEdit(row) {
      this.masterDataDialogTitle = '编辑'
      this.showAddMasterData = true
      let params = {
        id: row.instanceId,
        classifierId: row.classifierId,
        titleName: row.name,
        _title: row.name
      }
      this.$nextTick(() => {
        // // console.log(this.$refs.ruleAdd)
        this.$refs.masterDataEdit.getParMsg(params)
      })
      // this.$router.push({
      //   name: "masterDataEdit",
      //   params: {
      //     id: row.instanceId,
      //     classifierId: row.classifierId,
      //     titleName: row.name,
      //     _title: row.name
      //   }
      // });
    },

    deleteSome(item) {
      this.selectItem = item;
      this.isDeleteMenu = false;
      if (item) {
        this.showMenu = false;
        this.deleteDialog = true;
        let idArr = [];
        // this.multipleSelection.map(item => {
        idArr.push(item.instanceId);
        // });
        this.$nextTick(() => {
          this.$refs.deleteMenuDialog.activeFirst();
          this.$refs.deleteMenuDialog.getAllMsg(idArr.join(","));
        });
      }
      //  else {
      //   this.$message.warning("请至少选择一条数据!");
      // }
    },

    // 删除主数据 - 标准信息项
    toDelete() {
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
          let ids = [];
          // this.multipleSelection.map((item, index) => {
          ids.push(this.selectItem.instanceId);
          // });
          this.getRemoveMasterData(ids);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 刷新信息项
    toRefresh() {
      // this.instanceId = "";
      this.keyWord = "";
      this.setCurrentPageToOne();
    },
    // 搜索
    getTableData() {
      this.handleCurrentChange(1);
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },

    // 获取登录用户的所有视图
    getView() {
      get("/ds/listAllViews").then(res => {
        if (res.code === 10000 && res.success === true) {
          this.aViewData = res.data;

          let str = JSON.stringify(res.data);
          if (str.includes("true")) {
            res.data.map(item => {
              if (item.defultShow) {
                this.value = item.name;
                this.viewId = item.id;
              }
            });
          } else {
            res.data.map(item => {
              if (item.id === '0') {
                this.value = item.name;
                this.viewId = item.id;
              }
            });
          }

          let isDefultShowFlag = false;
          res.data.find((item, index) => {
            if (item.defultShow) {
              // 如果defultShow有为true的，则视图默认显示此数据，没有则默认显示系统视图
              this.sValue = item.id;
              isDefultShowFlag = true;
              return;
            }
          });
          if (!isDefultShowFlag) {
            // defultShow没有为true的，默认显示系统视图
            res.data.forEach((item, index) => {
              if (item.id === "0") {
                // 显示系统视图
                this.sValue = item.id;
              }
            });
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取信息项时，当前页设置为1
    setCurrentPageToOne() {
      this.oPage.pageCurrent = 1; // 当前页设置为1
      // 获取右侧主数据信息项的列表
      this.getInfoItem();
    },

    // 数据标准搜索 /masterData/mdSearch
    getInfoItem() {
      this.oMasterData.bLoading = true;
      console.log(this.classifyNameId, "this.classifyNameId");
      if (this.classifyNameId === "") {
        this.classifyNameId = "MasterDataInfoItem";
        // let classId = "";
        // get("/masterData/dsMDTree").then(res => {
        //   if (res.data[0].classifierId) {
        //     classId = res.data[0].classifierId;
        //     if (classId.indexOf("Parent") !== -1) {
        //       classId = classId.split("_")[1]; // MasterData
        //     }
        //     get("/ds/application/rule/listClassifier").then(res => {
        //       this.classifyList = res.data;
        //       this.classifyList.map(val => {
        //         if (val.classifierId.includes(classId)) {
        //           this.classifyNameId = val.classifierId;
        //         }
        //       });
        //       this.getSearchList();
        //       let params = {
        //         current: this.oPage.pageCurrent, // 当前页
        //         size: this.oPage.pageSize, // 每页显示的记录数
        //         ancestorId: this.instanceId,
        //         classifierId: this.classifyNameId,
        //         keyword:
        //           this.keyWord === null ? this.keyWord : this.keyWord.trim(),
        //         prop: this.keyWord === null ? null : this.searchKeyWord
        //       };
        //       get("/ds/customSearch", params).then(res => {
        //         if (res.code === 10000) {
        //           this.oPage.pageCurrent = res.data.current;
        //           this.oPage.total = res.data.total;
        //           this.oMasterData.aTableData = res.data.records;
        //           this.oMasterData.bLoading = false;
        //           this.tableHeader2 = res.extras.headers;
        //         }
        //       });
        //     });
        //   }
        // });
      } /* else {*/
      var count = ++this.count
      let params = {
        current: this.oPage.pageCurrent, // 当前页
        size: this.oPage.pageSize, // 每页显示的记录数
        ancestorId: this.instanceId,
        classifierId: this.classifyNameId,
        keyword: this.keyWord === null ? this.keyWord : this.keyWord.trim(),
        prop: this.keyWord === null ? null : this.searchKeyWord
      };
      get("/ds/customSearch", params).then(res => {
        if (res.code === 10000) {
          if (count === this.count) {
            this.tableData = res.data.records;
            this.oPage.pageCurrent = res.data.current;
            this.oPage.total = res.data.total;
            this.oMasterData.bLoading = false;
            this.tableHeader2 = res.extras.headers;
            console.log(this.tableHeader2)
          }
        }
      });
      this.getSearchList();
      // }
    },
    // 获取标准详情（用来获取面包屑tooltip的显示内容-标记） /ds/details/{standardId}
    getStandardDetails(standardId) {
      get("/ds/details/" + standardId).then(res => {
        parseAjaxResponse(res, () => {
          console.log(res);
          if (res.code === 10000) {
            res.data.attributes.forEach((item, index) => {
              if (item.attrCode === "Tag") {
                this.sTooltipValue = item.value;
              }
            });
          }
        });
      });
    },
    // 删除主数据标准  /masterData/removeMasterData
    getRemoveMasterData(ids) {
      const load = loading("删除中...");
      post("/masterData/removeMasterData", {
        instanceIds: ids.join(",")
      }).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            load.close()
            this.$message.success("删除成功!");
            this.deleteDialog = false;
            this.setCurrentPageToOne();
          }
        });
      }).catch(() => {
        load.close()
        this.deleteDialog = false;
      })
    },

    // Tree懒加载 - 获取主数据层级关系树结构 /masterData/dsMDTree
    loadNode(node, resolve) {
      this.node = node;
      if (node.level === 0) {
        this.nodeFirst = node;
        this.resolve = resolve;
        get("/masterData/dsMDTree", {
          // 初始化页面的tree时，id和nodeType都为空
          id: this.sViewId,
          nodeType: this.sNodeType
        }).then(res => {
          console.log(res.data)
          console.log(res.data[0])
          if (res.code === 10000 && res.success === true) {
            // 新增-信息项时 选择目录-默认值
            if (res.data[0] && res.data[0].classifierId) {
              this.namespace = res.data[0].namespace
              this.toAddMsg.namespace = res.data[0].namespace;
              this.toAddMsg.node = res.data[0];
            }

            this.treeLoading = false;
            this.bIsButtonDisabled = false; // 刷新按钮 不失效
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        let params = {
          id: node.data.id,
          nodeType: node.data.notetype
        };
        get("/masterData/dsMDTree", params).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.treeLoading = false;
            this.bIsButtonDisabled = false; // 刷新按钮 不失效
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    renderContent(h, params) {
      let sText = params.data.name;
      let iconType = "";
      if (params.data.notetype === "metadata") {
        // sText = this.bShowCode === true ? params.data.code : params.data.name
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
      this.aViewData.map(item => {
        if (parseInt(item.id) === val) {
          this.value = item.name; // 保存当前是什么视图
        }
      });
      this.Breadcrumb = [{ name: "全部", isDisabled: true }]
      this.viewId = val
      this.instanceId = "";
      // 信息项数据
      this.setCurrentPageToOne();

      // 切换视图时，清空面包屑数组数据 - （除了 第一个数据 '全部' 除外）
      this.Breadcrumb.splice(1, this.Breadcrumb.length - 1)
      this.setBreadList.splice(1, this.Breadcrumb.length - 1)

      this.sViewId = val !== undefined ? val : this.sViewId;
      this.treeLoading = true;
      this.nodeFirst.childNodes = [];
      this.node.childNodes = [];
      this.sNodeType = "view"; // 切换视图时，查询层级关系的tree时，nodeType传值 ’view‘
      this.loadNode(this.nodeFirst, this.resolve);
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

    // 点击Tree节点
    handleNodeClick(data, node, resolve) {
      // this.$refs.tree.setCurrentKey(data.id);
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
      // console.log(data, 'data')
      // console.log(node, 'node')
      // console.log(`当前node的层级：${node.level}`)
      this.toAddMsg.namespace = data.namespace;
      this.toAddMsg.node = node;
      // 拼接-归档标准id
      if (data.classifierId) {
        if (data.classifierId.includes("Parent")) {
          this.classifyNameId = data.classifierId.split("_")[1];
          this.classifyNameId = `${this.classifyNameId}InfoItem`;
          // console.log(this.classifyNameId, 'this.classifyNameId')
        }
      }

      this.node = node;
      if (data.id !== this.editMenuId) {
        this.showComponent = "card";
      }
      // 面包屑数组数据
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
      // let itemdata = {
      //   id: data.id,
      //   keyLevel: node.level,
      //   type: data.classifierId,
      //   notetype: data.notetype,
      //   value: data.name,
      //   tooltipValue: "",
      //   isDisabled: true,
      //   uuid: data.uuid
      // };
      // if (data.classifierId === "Context") {
      //   get("/ds/details/" + data.id).then(res => {
      //     if (res.code === 10000) {
      //       res.data.attributes.forEach((item, index) => {
      //         if (item.attrCode === "Tag") {
      //           itemdata.tooltipValue = item.value;
      //           itemdata.isDisabled = false;
      //         }
      //       });
      //     }
      //     if (node !== this.nodeText) {
      //       if (this.breadcrumb.length > 1) {
      //         this.breadcrumb.map((val, index) => {
      //           if (val.keyLevel === node.level) {
      //             this.breadcrumb = this.breadcrumb.slice(0, index);
      //             // console.log(this.nodeText, 'arr1')
      //             this.getShow(this.treeNodeArr[index]);
      //             this.treeNodeArr = this.treeNodeArr.slice(0, index);
      //             return;
      //           }
      //         });
      //         this.breadcrumb.push(itemdata);
      //         this.treeNodeArr.push(node);
      //       } else {
      //         this.breadcrumb.push(itemdata);
      //         this.treeNodeArr.push(node);
      //       }
      //       this.nodeText = node;
      //       // console.log(this.nodeText, 'arr')
      //     }
      //   });
      // } else {
      //   if (node !== this.nodeText) {
      //     if (this.breadcrumb.length > 1) {
      //       this.breadcrumb.map((val, index) => {
      //         if (val.keyLevel === node.level) {
      //           this.breadcrumb = this.breadcrumb.slice(0, index);
      //           this.getShow(this.treeNodeArr[index]);
      //           this.treeNodeArr = this.treeNodeArr.slice(0, index);
      //           return;
      //         }
      //       });
      //       this.breadcrumb.push(itemdata);
      //       this.treeNodeArr.push(node);
      //     } else {
      //       this.breadcrumb.push(itemdata);
      //       this.treeNodeArr.push(node);
      //     }
      //     this.nodeText = node;
      //   }
      // }

      // 面包屑数组数据
      // if (this.breadcrumb.length === 1) {
      //   this.breadcrumb.push({
      //     id: data.id,
      //     notetype: data.notetype,
      //     value: data.name,
      //     tooltipValue: this.sTooltipValue,
      //     isDisabled: true,
      //     level: node.level,
      //     uuid: data.uuid
      //   })
      // } else {
      //   let bIsAddToBread = true
      //   let sIndex = ''
      //   let len = this.breadcrumb.length - 1;
      //   this.breadcrumb.map((item, index) => {
      //     if (item.level === node.level) {
      //       bIsAddToBread = false
      //       sIndex = index
      //       /* 其他节点收起来*/
      //       console.log(node.childNodes)
      //       this.getShow(node.childNodes)
      //     }
      //   })
      //   if (bIsAddToBread) {
      //     // 只有classifierId为"Context"时，才有标记
      //     this.sTooltipValue = ''
      //     if (data.classifierId === 'Context') {
      //       // 获取标记
      //       // this.getStandardDetails(data.id)
      //       get('/ds/details/' + data.id).then((res) => {
      //         parseAjaxResponse(res, () => {
      //           console.log(res)
      //           if (res.code === 10000) {
      //             res.data.attributes.forEach((item, index) => {
      //               if (item.name === '标记') {
      //                 this.sTooltipValue = item.value
      //                 let isPushToBreadcrumb = true
      //                 this.breadcrumb.find((item, index) => {
      //                   if (item.uuid === data.uuid) {
      //                     isPushToBreadcrumb = false
      //                   }
      //                 })
      //                 if (isPushToBreadcrumb) {
      //                   this.breadcrumb.push({
      //                     id: data.id,
      //                     notetype: data.notetype,
      //                     value: data.name,
      //                     tooltipValue: this.sTooltipValue,
      //                     level: node.level,
      //                     uuid: data.uuid
      //                   })
      //                 }
      //               }
      //             })
      //           }
      //         })
      //       })
      //     } else {
      //       this.breadcrumb.push({
      //         id: data.id,
      //         notetype: data.notetype,
      //         value: data.name,
      //         tooltipValue: this.sTooltipValue,
      //         isDisabled: true,
      //         level: node.level,
      //         uuid: data.uuid
      //       })
      //     }
      //   } else {
      //     // 只有classifierId为"Context"时，才有标记
      //     this.sTooltipValue = ''
      //     if (data.classifierId === 'Context') {
      //       // 获取标记
      //       get('/ds/details/' + data.id).then((res) => {
      //         parseAjaxResponse(res, () => {
      //           console.log(res)
      //           if (res.code === 10000) {
      //             res.data.attributes.forEach((item, index) => {
      //               if (item.name === '标记') {
      //                 this.sTooltipValue = item.value
      //                 this.breadcrumb.splice(sIndex, len, {
      //                   id: data.id,
      //                   notetype: data.notetype,
      //                   value: data.name,
      //                   tooltipValue: this.sTooltipValue,
      //                   level: node.level,
      //                   uuid: data.uuid
      //                 })
      //               }
      //             })
      //           }
      //         })
      //       })
      //     } else {
      //       this.breadcrumb.splice(sIndex, len, {
      //         id: data.id,
      //         notetype: data.notetype,
      //         value: data.name,
      //         tooltipValue: this.sTooltipValue,
      //         isDisabled: true,
      //         level: node.level,
      //         uuid: data.uuid
      //       })
      //     }
      //   }
      // }

      // console.log(data.notetype)
      this.sNodeType = data.notetype;
      if (data.notetype === "metadata") {
        // 元数据类型为nodetype时，查询右侧信息项列表
        this.instanceId = data.id;
        // 获取右侧主数据信息项的列表
        this.setCurrentPageToOne();
      }
    },
    // 判断鼠标点击 显示隐藏 tree的目录
    clickBox(e) {
      // console.log(e.target);
      // console.log(this.$refs.rightMenu.contains(e.target));
      if (!this.$refs.rightMenu.contains(e.target)) {
        this.showMenu = false;
      }
    },
    // tree 右键菜单
    handleContextmenu(event, data, node, component) {
      // console.log(node, "right-node");
      console.log(data, "right-data");
      // 拼接-归档标准id
      if (data.classifierId) {
        if (data.classifierId.includes("Parent")) {
          // 视窗模式-需要的node Id
          this.windowModeId = data.id
          this.windowModeNamespace = data.namespace
          console.log(this.windowModeId, "this.windowModeId");
          this.classifyNameId = data.classifierId.split("_")[1];
          this.classifyNameId = `${this.classifyNameId}InfoItem`;
          // console.log(this.classifyNameId, 'this.classifyNameId')
        }
      }

      // 判断是否有子节点  没有新增或删除时就刷新整个目录
      this.nodeIsLeaf = node.isLeaf;
      this.bIsNodeExpanded = node.expanded;
      this.bIsNodeExpandedId = data.id;

      this.node = node;
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
      this.exportId = data.id;
      this.sendInstanceId = data.id;

      // 判断是否是根或者挂载点，来决定是否显示-右键新增box
      if (data.notetype === "metadata") {
        // 判断是否是元数据类型
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
            this.bEditAndDeleteIsShow = false;
            this.bIsWindowMode = true;
          } else {
            this.bEditAndDeleteIsShow = true;
            this.bIsWindowMode = false;
          }
        } else {
          this.showMenu = false;
        }
      }

      let contextMenu = document.getElementsByClassName("context-menu")[0]; // 右键菜单 div元素
      // contextMenu.style.display = 'block'
      contextMenu.style.left = event.offsetX + 25 + "px";
      contextMenu.style.top = event.clientY - 70 + "px";
    },
    // 修改列表一页数据大小
    handleSizeChange(value) {
      this.oPage.pageSize = value;
      this.setCurrentPageToOne();
    },
    handleCurrentChange(value) {
      this.oPage.pageCurrent = value;
      this.getInfoItem();
    },

    // 新增界面跳转  面包屑设置
    setBreadcrumb(val) {
      // console.log(val);
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
    }
  },
  computed: {},
  mounted() {},

  // 组件激活时调用
  activated() {
    this.showShadow = false
    // 清空搜索框内容
    this.keyWord = ""

    console.log(this.nodeFirst);
    console.log(this.value, "view");
    if (this.$route.params.nodeList && this.$route.params.addNode) {
      // 再次新增规则   且  挂载点（路径）改变了
      let nodeList = this.$route.params.nodeList;
      console.log(nodeList, "nodeList");
      //  为系统视图  挂载点规则上还有一个规则目录
      if (this.viewId === '0') {
        nodeList.map(item => {
          item.data.level = item.level + 2;
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
        this.aIsExpandedArr = [];
        this.aIsExpandedArr.push(this.nodeFirst.childNodes[0].data.id);
        this.nodeId = this.nodeFirst.childNodes[0].data.id;
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
              this.$refs.tree.setCurrentKey(item.data.id);
            }, index * 500);
          });
        }, 500);
      } else {
        nodeList.map(item => {
          item.data.level = item.level + 1;
          return item;
        });
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
            this.$refs.tree.setCurrentKey(item.data.id);
          }, index * 500);
        });
      }
      // 当前节点id   用来获取table数据
      this.nodeId = nodeList[nodeList.length - 1].data.id;
      this.instanceId = this.nodeId
      // 获取table信息项数据
      this.setCurrentPageToOne();
      // 重置面包屑
      this.Breadcrumb = [{ name: "全部", isDisabled: true }];
      this.setBreadList = [{ name: "全部", isDisabled: true }];
      // 调用方法 处理面包屑的赋值
      this.setBreadcrumb(nodeList[nodeList.length - 1]);
      this.Breadcrumb = this.setBreadList;
    } else if (this.$route.params.nodeList && !this.$route.params.addNode) {
      // 再次新增规则   且  挂载没变
      this.Breadcrumb = this.$route.params.nodeList;
      console.log(this.Breadcrumb);
      console.log(this.Breadcrumb);
      this.$refs.tree.setCurrentKey(
        this.Breadcrumb[this.Breadcrumb.length - 1].id
      );
    } else {
      // 未新增
      this.setCurrentPageToOne();
    }
  },
  created() {
    this.getListFeature();
    this.setCurrentPageToOne();
    this.getView();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "../../../../styles/treeIcon";
@import "../../../../styles/variables";

.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.master_loading .el-loading-spinner .el-loading-text{
    color:red;
    font-size:18px
  }
.master-data {
  /deep/ .el-dialog__body{
    padding: 10px;
  }
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
  .el-dialog__header {
    border-bottom: 1px solid #e8ebed;
  }
  //表格表头背景颜色
  .el-table thead tr th {
    background-color: #f8f8f9;

    div.cell {
      color: #515a6e;
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
      /*display:none;*/
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
            padding: 5px 0px 5px 0px;
            font-weight: bold;
            line-height: 26px;
            color: #7e7b7b;

            .collapse-class {
              width: 23px;
              height: 23px;
              cursor: pointer;
              vertical-align: -6px;
            }

            button {
              float: right;
              width: 36px;
              height: 26px;

              i::before {
                font-size: 18px;
                position: relative;
                top: -6px;
                left: -7px;
              }
            }
          }

          .md-tree {
            height: calc(100vh - 215px);
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

          .view-filter {
            position: relative;
            font-size: 16px;
            border-top: 1px solid $border;
            padding: 10px 10px;
            font-weight: bold;
            color: #7e7b7b;
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

        // .el-card__body > div {
        //   height: 100%;
        // }

        .el-card__body {
          padding: 15px 20px 20px 20px;
          position: relative;
          height: 100%;
        //   .page-scroll {
        //   height: 100%;
        //   .el-scrollbar__wrap {
        //     overflow-x: hidden;
        //   }
        // }
          .el-table {
            .preview,.deleteRed,.editor,.multilink{
            width:22px;
            height:22px;
          }
          .el-button+.el-button{
            margin-left: 5px;
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

          .no-data {
            width: 500px;
            height: 457px;
            background: url("./../../../../assets/images/commonIcon/no-data.png")
              no-repeat;
            background-size: 500px 457px;
            margin: 30px auto;
          }

          .tTitle {
            position: relative;
            height: 38px;
            border-bottom: 1px solid #e9e9e9;
            z-index: 10;
            margin-bottom: 20px;
            margin-right: 10px;

            .bread-icon {
              position: absolute;
              display: inline-block;
              top: 9px;
              left: 0;
              width: 20px;
              height: 20px;
              background: url(./../../../../assets/images/commonIcon/bread-icon.png)
                no-repeat;
              background-size: 100%;
            }

            //自定义图标样式
            .definition-list {
              width: 23px;
              height: 23px;
              position: absolute;
              right: 10px;
              cursor: pointer;
            }

            .el-breadcrumb {
              position: absolute;
              left: 28px;
              font-size: 12px;
              top: 9px;
              line-height: 20px;
              .el-breadcrumb__inner {
                color: #409eff;
                cursor: pointer;
              }
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
          }
          .card-table{
            overflow-y: scroll;
            width: 100%;
            height: calc(100% - 150px);
            margin-top: 10px;
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
          .btn-box {
            overflow: hidden;
            margin-right: 10px;
            .el-button + .el-button {
              margin-left: 5px;
            }

            //按钮组样式 公共样式
            .btn {
              width: 66px;
              height: 30px;
              padding: 0px 7px;

              .svg-icon {
                width: 16px;
                height: 16px;
                top: 0px;
                position: relative;
              }

              .btn-text {
                font-size: 14px;
                line-height: 28px;
              }
              // 刷新文字
              .btn-text.refresh {
                margin-left: -2px;
              }
            }

            //新增图标大小
            .btn.add {
              .svg-icon {
                width: 16px;
                height: 16px;
                top: 1px;
                position: relative;
              }
            }

            //编辑图标大小
            .btn.edit {
              .svg-icon {
                width: 20px;
                height: 20px;
                top: 2px;
                position: relative;
              }
            }

            //刷新图标大小
            .btn.refresh {
              .svg-icon {
                width: 20px;
                height: 20px;
                top: 3px;
                left: -2px;
                position: relative;
              }
            }

            // 血缘分析按钮
            .basic-button {
              height: 34px;
              width: 85px;
              padding: 0 15px 0 35px;
              position: relative;
              margin-left: 5px;
            }
            .dataTable-icon {
              position: absolute;
              display: inline-block;
              width: 20px;
              height: 20px;
              left: 7px;
              top: 3px;
            }
            .blood {
              background: url(../../../../../src/assets/images/commonIcon/blood-icon.png)
                no-repeat;
              background-size: 100%;
            }
          }

          .search {
            float: right;
            font-size: 12px;

            .el-input {
              width: 180px;
              height: 28px;

              .el-input__inner {
                height: 28px;
                line-height: 28px;
              }

              .el-input__icon {
                line-height: 28px;
              }
            }
          }
        }
      }
    }
  }

  .to-add-catalog,
  .duty-dialog {
    /*对话框上、下分隔线*/
    .el-dialog {
      border-radius: 5px;
      width: 535px;

      .el-dialog__header {
        border-bottom: 1px solid #e8ebed;

        .el-dialog__title {
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: #17233d;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .el-dialog {
      .el-dialog__footer {
        border-top: 1px solid #e8ebed;
      }
    }

    //表单label 字体
    .el-form .el-form-item {
      margin-bottom: 15px;

      .el-form-item__label {
        font-size: 12px;
        padding-right: 5px;
        color: #515a6e;
        font-weight: normal;
      }
    }
  }

  /*新建目录*/
  .to-add-catalog {
    /* 责任人 * 样式 */
    .dutyUserClass {
      .el-form-item__label::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
      }
    }

    .el-dialog {
      .el-dialog__body {
        padding: 0px 40px;

        //责任人 增加 border虚线
        .add-class {
          border: 1px dashed #dcdfe6;
        }
      }
    }

    //选择目录 字段样式
    .choice-catalog-item {
      .choice-catalog {
        position: relative;
        border: 1px solid #dcdfe6;
        height: 32px;
        width: 100%;
        line-height: 32px;
        padding: 0px 5px;
        border-radius: 5px;
        margin-top: 4px;

        span {
          float: left;

          i {
            float: right;
            position: absolute;
            top: 9px;
            right: 10px;
          }
        }
      }

      .el-tree {
        top: -15px;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        padding: 10px;
      }
    }
  }

  /*选择用户*/
  .duty-dialog {
    .el-dialog__body {
      padding: 30px 20px 10px;
    }

    .tag-box {
      font-size: 16px;
      padding: 0 15px;
      margin-bottom: 10px;
    }

    .tree-box {
      border: 1px solid rgba(233, 233, 233, 1);
      padding: 15px 40px;

      .tree-box_input {
        margin-bottom: 10px;
      }
    }
  }

  // 删除- 表格对话框
  .delete-dialog {
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
  .dialog-btn {
    text-align: center;
    border-top: 1px solid #e8ebed;
    padding: 0;
    padding-top: 10px;
    .el-button {
      padding: 10px 20px;
    }
  }

  //自定义列表
  .definition {
    padding-left: 20px;
    .el-checkbox__label {
      margin-top: 10px;
      display: block;
      float: right;
      padding: 0;
      width: calc(100% - 25px);
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
    }
    /*自定义表格 - 文字上下居中 */
    .el-checkbox.is-bordered.el-checkbox--mini .el-checkbox__label {
      line-height: 12px;
    }
    .el-checkbox {
      width: 200px;
      margin: 0 0 10px 0 !important;
    }
  }
  .selfTable {
    .el-dialog__footer {
      padding: 3px 20px 13px;
    }
    .el-dialog__body {
      padding: 20px 12px 16px 12px;
    }
  }
  .btn-box {
    .el-form-item {
      margin-bottom: 0px;
    }
  }
  /deep/ .el-table__fixed-right{
    height:100%!important;
  }
}
.to-add-catalog {
  .el-dialog {
    margin-top: 8vh !important;
  }
}
.el-dialog__title {
  font-size: 16px;
  color: #818181;
  font-weight: 700;
}
.master-data_drop {
  padding: 0;
  .el-dropdown-menu__item {
    padding: 0;
    text-align: center;
    width: 80px;
  }
}
</style>
