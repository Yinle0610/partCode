<template>
  <div @click.capture="clickBox" class="commonCode tableNoPadding">
    <el-container>
      <el-aside width="20%" class="leftdiv">
        <!-- 右键弹出框 -->
        <div ref="rightMenu" v-show="showMenu" class="context-menu">
          <el-card>
            <el-row v-show="EditDeltShow" @click.native="getCatalogDetail(false)">详细信息</el-row>
            <el-row v-permission="'COM_ADD_CATALOG'" @click.native="toAddCatalog">新建目录</el-row>
            <el-row
              v-permission="'COM_EDIT_CATALOG'"
              v-show="EditDeltShow"
              @click.native="toEditCatalog"
            >修改目录</el-row>
            <el-row
              v-permission="'COM_DEL_CATALOG'"
              v-show="EditDeltShow"
              @click.native="showDeleteDialog"
            >删除目录</el-row>
            <el-row v-permission="'COM_ADVANCED_SEARCH'" v-show="EditDeltShow">高级搜索</el-row>
            <el-row v-permission="'COM_IMPORT'" v-show="EditDeltShow">导入标准</el-row>
            <el-row v-permission="'COM_EXPORT'" @click.native="exportData">导出标准</el-row>
          </el-card>
        </div>
        <el-card class="left_tree">
          <div class="header">
            <p class="title">目录</p>
            <el-tooltip class="item" effect="dark" content="刷新" placement="top">
              <el-button style="color:#606266;"
                    icon="el-icon-refresh" type="text" @click="handleRefresh" size="mini"></el-button>
            </el-tooltip>
          </div>

          <div v-loading="treeLoading" class="treeDiv">
            <el-tree
              accordion
              @node-contextmenu="handleMouseRight"
              @node-click="handleNodeClick"
              node-key="id"
              :default-expanded-keys="aIsExpandedArr"
              :default-checked-keys="aIsExpandedArr"
              :props="viewProps"
              ref="tree"
              :highlight-current="true"
              :render-content="renderContent"
              :load="loadNode"
              lazy
            ></el-tree>
          </div>
          <div class="footer">
            <p class="title">视图切换</p>
            <el-select @change="changeView" v-model.trim="value" placeholder="请选择" size="mini">
              <el-option
                v-for="item in viewList"
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
        <el-card
          v-show="showComponent === 'main'||showComponent==='card' || showComponent==='cardMain'"
          shadow="hover"
        >
          <div class="card-header">
            <i class="el-icon-location-outline"></i>
            <el-breadcrumb separator="/">
              <el-tooltip
                placement="top"
                v-for="( item, index ) in Breadcrumb"
                :key="index"
                :disabled="item.isDisabled"
              >
                <div slot="content">{{item.tipValue}}</div>
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
          <div class="card-button">
            <el-button @click="handleAdd" type="primary" size="mini" class="zengjia fl">
              <svg-icon icon-class="zengjia"></svg-icon>
              <span class="text">新增</span>
            </el-button>
            <!-- <el-button @click="handleEdit" type="warning" size="mini" class="xiugai fl">
              <svg-icon icon-class="xiugai"></svg-icon>
              <span class="text">编辑</span>
            </el-button>-->
            <!-- <el-button @click="deleteSome" type="danger" size="mini" class="shanchu fl">
              <svg-icon icon-class="shanchu"></svg-icon>
              <span class="text">删除</span>
            </el-button>-->
            <el-button type="primary" size="mini" class="shuaxin fl" @click="getAllTableMsg">
              <svg-icon icon-class="shuaxin"></svg-icon>
              <span class="text">刷新</span>
            </el-button>
            <el-dropdown @command="handleBlood">
              <el-button
                class="basic-button"
                style="width: 80px;
                      padding: 0px 15px 0px 25px;
                      height: 30px;"
                type="primary"
              >
                <i class="dataTable-icon blood"></i>关系
                <!-- <svg-icon icon-class="xian"></svg-icon>
                <svg-icon icon-class="more"></svg-icon> -->
              </el-button>
              <el-dropdown-menu slot="dropdown" trigger="click">
                <el-dropdown-item :command="'backward'">参考</el-dropdown-item>
                <el-dropdown-item :command="'forward'">应用</el-dropdown-item>
                <el-dropdown-item :command="'full'">全链</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-form style="width:300px;float:right;">
              <el-form-item style="width:135px;float: left;" class="search-keyword">
                <el-select v-model.trim="propSearch" placeholder="请选择搜索分类" size="mini">
                  <el-option
                    :label="item.label"
                    :value="item.prop"
                    v-for="item in selectList"
                    :key="item.prop"
                    align="center"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="width:160px;float: left;margin-left:5px;">
                <el-input
                  v-model.trim.trim="keyword"
                  @keyup.enter.native="handleSearch"
                  placeholder="请输入内容..."
                  size="mini"
                  clearable
                >
                  <i slot="suffix" class="el-icon-search" @click="handleSearch"></i>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="card-table" v-loading="tableLoading">
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              size="mini"
              ref="SelectTable"
              :header-cell-style="{background:'#f8f8f9',color:'#666'}"
              :cell-style="isClass"
              :header-cell-class-name="isClass2"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column
                v-for="(item, index) in headerList"
                sortable
                :key="index"
                :prop="item.prop"
                :show-overflow-tooltip='showToolTip'
                :label="item.label"
                :align="item.prop==='instanceCode'?'left':null"
                :width="item.prop==='namespace'||item.prop==='instanceName'?'260':null"
              ></el-table-column>
              <el-table-column label="操作" align="center" fixed="right" width="160">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                    <el-button @click="toDetail(scope.row)" type="text">
                      <svg-icon icon-class="preview" class="preview"></svg-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                    <el-button v-permission="'COM_EDIT'" @click="toEdit(scope.row)" type="text">
                      <svg-icon icon-class="editor" class="editor"></svg-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="全链分析" placement="bottom">
                    <el-button type="text" @click="handleBlood2('full',scope.row)">
                      <svg-icon icon-class="multilink" class="multilink"></svg-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                    <el-button
                      v-permission="'COM_DEL'"
                      @click="deleteSome(scope.row)"
                      type="text"
                      size="small"
                    >
                      <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="text-align:center;margin-top:15px;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageCurrent"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </el-card>
        <item-detail ref="itemDetail" v-show="showComponent === 'itemDetail'"></item-detail>
        <common-detail ref="commonDetail" v-show="showComponent === 'commonDetail'"></common-detail>
        <catalog-detail
          ref="catalogDetail"
          v-show="showComponent==='detail'"
          @showmain="getShowChange"
          @colData="getShowChange2"
        ></catalog-detail>
      </el-main>
    </el-container>

    <!--新增目录-->
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
        label-width="110px"
        style="margin-top:20px;"
      >
        <el-form-item label="目录代码：" class="is-required" prop="menuCode">
          <el-input
            size="small"
            :disabled="!addMenu"
            v-model.trim.trim="baseInfoRuleForm.menuCode"
            placeholder="请输入目录代码..."
          ></el-input>
        </el-form-item>
        <el-form-item label="目录名称：" class="is-required" prop="cnName">
          <el-input
            size="small"
            v-model.trim.trim="baseInfoRuleForm.cnName"
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
            v-model.trim="baseInfoRuleForm.catalog"
            placeholder="请选择"
          >
            <el-option :label="classifyOption" :value="classifyValue" style="height: auto">
              <el-tree
                v-if="bIsShowCatalogTree"
                :data="data"
                :props="ClassifyProps"
                :highlight-current="true"
                @node-click="handleCatalogNodeClick"
              ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-for="(item, index) in editInputList" :key="index" :label="`${item.name}：`">
          <el-input
            :disabled="item.name.includes('类型')?true:false"
            v-model.trim="baseInfoRuleForm[item.attrStore]"
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
            v-model.trim="baseInfoRuleForm[item.attrStore]"
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
            v-model.trim="baseInfoRuleForm[item.attrStore]"
          ></el-input>
        </el-form-item>
        <el-form-item label="归口责任部门：" class="is-required" prop="selectGroup2">
          <el-select
            style="width: 100%;"
            v-model.trim="catalogData.selectGroup"
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
            v-model.trim="catalogData.selectUser"
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
            v-model.trim="filterText"
            suffix-icon="el-icon-search"
            clearable
          ></el-input>
          <el-tree
            style="height: 200px;margin-top: 10px;overflow:auto;"
            :highlight-current="true"
            empty-text="暂无数据"
            :props="userProps"
            :data="userTree"
            ref="dutyUserTree"
            @node-click="handleUserNodeClick"
            :filter-node-method="filterNode"
          ></el-tree>
        </div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary" size="mini" @click="toSaveUser">确定</el-button>
      </div>
    </el-dialog>-->
    <!-- 新增代码项 -->
    <el-dialog
      :title="dialogTitle"
      @close="clearEditDialog"
      :destroy-on-close="true"
      :visible.sync="editDialog"
    >
      <el-form
        :model="editCodeForm"
        :rules="editRules"
        ref="editRuleForm"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item
          v-for="(item, index) in addInput"
          :key="index"
          :label="item.label"
          :prop="item.key"
        >
          <el-input v-if="item.type === 'textfield'" v-model.trim="editCodeForm[item.key]"></el-input>
          <el-select
            v-else-if="item.type==='treedirectory'"
            ref="classifySelect"
            class="ruleClassifying"
            clearable
            style="width: 100%;"
            v-model.trim="editCodeForm.namespace"
            placeholder="请选择"
          >
            <el-option :value="classifyValue" style="height: auto">
              <el-tree
                accordion
                style="margin: 0 -20px;"
                :data="data"
                @node-click="nodeClick"
                :props="defaultProps"
                :highlight-current="true"
                :render-content="renderAddContent"
              ></el-tree>
            </el-option>
          </el-select>
          <el-input
            v-else-if="item.type === 'textarea'"
            type="textarea"
            v-model.trim="editCodeForm[item.key]"
          ></el-input>
          <el-select
            v-else-if="item.type === 'combobox'"
            v-model.trim="editCodeForm[item.key]"
            placeholder="请选择状态"
          >
            <el-option
              v-for="(item, index) in item.dropList"
              :key="index"
              :label="item.textField"
              :value="item.valueField"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog_button" style="text-align: center;">
        <el-button type="primary" :disabled="addBtn" @click="submitEditForm('editRuleForm')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 自定义列表 -->
    <el-dialog
      title="自定义列表"
      :destroy-on-close="true"
      @close="closeDrageList"
      width="250px"
      :visible.sync="definitionListDialog"
    >
      <div class="definition">
        <draggable v-model.trim="tableHeader " @update="datadragEnd" :options="{animation:200}">
          <el-checkbox
            @change="definitionChange(item, index)"
            v-for="(item, index) in tableHeader"
            :value="item.checked"
            :label="item.label"
            :key="index"
            border
          ></el-checkbox>
        </draggable>
      </div>
      <div class="dialog_button" style="text-align: center;">
        <el-button type="primary" @click="submitTableHeaderChange">确定</el-button>
      </div>
    </el-dialog>
    <!-- 删除提示 -->
    <el-dialog :visible.sync="deleteDialog" class="delete-dialog" title="删除提示" width="50%">
      <delete-dialog ref="deleteMenuDialog"></delete-dialog>
      <div class="dialog-btn">
        <el-button type="primary" @click="isDeleteMenu?toDelCatalog():handleDelete()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 名字校验 -->
    <div class="checkSame">
      <el-dialog title="提示" :visible.sync="showSames">
        <template slot="title">
          <i class="el-icon-info" style="color: rgb(92,182,255); margin-right: 5px;"></i>提示
        </template>
        <p>在以下目录下发现相同标准名称：</p>
        <ul class="dialog-ul">
          <li v-for="(item, index) in sameList" :key="index">
            {{item.path}}
            <el-button @click="toSeeDetail(item)" type="text">查看</el-button>
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showSames = false">取 消</el-button>
          <el-button type="primary" @click="sendFinalItem">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { get, postByJson, post, downloadFile } from "@/utils/request";
import { generateLineageTitle } from "@/utils";
import codeItemDetail from "./codeItemDetail";
import commonCodeDetail from "./commonCodeDetail";
import { loading, loadingStandard } from "@/utils/layer";
import draggable from "vuedraggable";
import deleteDialog from "../deleteDialog/deleteDialog";
import pinyin from "pinyin";
import catalogDetail from "./../../common/catalogDetail";
export default {
  components: {
    itemDetail: codeItemDetail,
    commonDetail: commonCodeDetail,
    draggable,
    deleteDialog,
    catalogDetail
  },
  data() {
    var validateDuty = (rule, value, callback) => {
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
    // 校验名称是否重复
    const checkInstanceName = (rule, value, callback) => {
      if (this.editCodeForm.instanceName === "") {
        callback(new Error(`请输入${this.name_label}`));
      } else {
        let params = {
          instanceId: this.sendInstanceId,
          instanceName: this.editCodeForm.instanceName,
          parentId: this.parentId
        };
        get("/ds/public/checkStandardNameIsExist", params).then(res => {
          console.log(res);
          if (res.code === 10000 && res.success) {
            if (res.data.length > 0) {
              // 不同目录下有重名的
              this.showSames = true;
              this.sameList = res.data;
              callback();
            } else {
              // 无重复
              this.showSames = false;
              this.sameList = []
              callback();
            }
          } else {
            // 相同目录下有重名的
            callback(new Error(res.message));
          }
        });
      }
    };
    return {
      checkName: checkInstanceName,
      textarea: "",
      headerList: [],
      deleteDialog: false,
      inputDate: null,
      // 组件展示
      showComponent: "main",
      ifCurrentNode: true, // 目录详情显示时，做增删改操作，判断是否为当前节点
      // 自定义列表 弹窗
      definitionListDialog: false,
      tableHeader: [],
      filterText: "",
      dialogTitle: "新增公共代码",
      aIsExpandedArr: [],
      treeLoading: true,
      // 新增目录
      // addMenu: true,
      bIsCatalogVisible: false,
      baseInfoRuleForm: {
        menuCode: "",
        cnName: "",
        enName: "",
        classify: "",
        type: "",
        catalog: "请选择...",
        // type2: "",
        // type3: "",
        // type4: "",
        // format: "",
        // string1: "",
        // string2: "",
        // string3: "",
        // string4: "",
        // string5: "",
        // string6: "",
        // string7: "",
        // string8: "",
        // string9: "",
        selectGroup2: null,
        selectUser2: null
      },
      classifyProps: {
        children: "childNodes",
        label: "nodeName"
      },
      StatusList: [],
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
      // 选择用户
      bIsUserVisible: false,
      userProps: {
        children: "users",
        label: "userName"
      },
      defaultProps: {
        children: "childNodes",
        label: "nodeName"
      },
      userTree: [],
      data: [],
      bIsShowCatalogTree: false,

      dimensionalityData: {
        classify: null,
        type: null,
        state: null,
        date: null,
        name: null
      },
      viewChange: [],
      classifyData: [],
      type: [],
      state: [],
      // 右侧规则列表
      tableData: [],
      keyword: "",
      total: 0,
      pageSize: 10,
      pageCurrent: 1,
      selectArr: [],
      // 视图选择
      value: "",
      viewList: [],
      // el-tree
      viewProps: {
        label: "name",
        children: "childNodes",
        isLeaf: "isLeaf"
      },
      nodeType: "",
      add: true,
      Breadcrumb: [{ name: "全部", isDisabled: true }],
      nodeId: "",
      showMenu: false,
      EditDeltShow: false,
      // 显示模式是否展示代码
      bShowCode: true,
      namespace: "",
      // 根节点路径为空时  默认右键获取的路径
      parentName: "",
      // 归属标准下拉数据
      classifyList: [],
      // 归属标准  和  含义  显示隐藏
      catalogMean: false,
      standardShow: false,
      // 右键目录ID
      editMenuId: "",
      userTagList: {},
      // 右键时tree数据
      deleteMenu: {},
      // 是否为  新增目录
      addMenu: false,
      nodeIsLeaf: "",
      getEditList: [],
      classifierName: "",
      classifierId: "",
      // 责任人id
      dutyUserId: "",
      resolve: [],
      node: [],
      removeData: {},
      editDialog: false,
      editCodeForm: {
        parentId: "",
        instanceName: "",
        string1: "",
        string2: "",
        string3: "",
        string4: "",
        string5: "",
        string6: "",
        namespace: "",
        Textfield: ""
      },
      editRules: {
        namespace: [
          { required: true, message: "请选择公共代码分类", trigger: "change" }
        ]
      },
      editNameSpace: "",
      clickNode: "",
      noSonTree: "",
      classifyName: "",
      // 动态input
      addInput: [],
      tableLoading: true,
      isDeleteMenu: false,
      changeHeader: false,
      propSearch: "",
      selectList: [],
      oldNameSpace: "",
      CodeName: "",
      eKey: "",
      en_name: "",
      editInputList: [],
      sendInstanceId: "",
      addBtn: false,
      menuName: "",
      selectItem: "", // 删除的当条信息
      exportId: "",
      name_label: "",
      parentId: "",
      sameList: [],
      showSames: false,
      addItem: false,
      showToolTip: true,
      showShadow: false,
      count: 0
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
    },
    dimensionalityData: {
      handler(newValue, oldValue) {
        this.getData();
      },
      deep: true // 只要当obj中的值改变就会触发这个函数且,newValue,oldValue两个参数值相同;/
    },
    filterText(val) {
      this.$refs.dutyUserTree.filter(val);
    },
    editCodeForm: {
      handler(newValue, oldValue) {
        // this.getData();
        this.CodeName = this.editCodeForm.instanceName;
      },
      deep: true // 只要当obj中的值改变就会触发这个函数且,newValue,oldValue两个参数值相同;/
    },
    CodeName() {
      get("/ds/bizTerm/queryHomologousEnVocabularies", {
        cnTerm: this.CodeName
      }).then(res => {
        if (res.data[0] === "") {
          this.editCodeForm[this.eKey] = this.en_name;
        } else {
          this.editCodeForm[this.eKey] = res.data[0];
        }
      });
    }
  },
  methods: {
    // 导出标准
    exportData() {
      let load = loadingStandard("正在导出,请稍候...");
      downloadFile(
        "/ds/public/downPublicCode",
        {
          instanceId: this.exportId
        },
        () => {
          load.close();
          this.showMenu = false
        },
        () => {
          load.close();
        }
      );
    },
    // 组件接收返回按钮
    getShowChange(val) {
      this.showComponent = val;
    },
    getShowChange2(val) {
      if (this.node.parent.data.classifierId.includes("Parent")) {
        this.node.parent.childNodes.map(item => {
          item.expanded = false;
        });
      }
      this.aIsExpandedArr = [];
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
            this.aIsExpandedArr = [];
            this.aIsExpandedArr.push(val.data.id);
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
      this.nodeId = val;
      this.keyword = "";
      this.propSearch = "";
      this.pageCurrent = 1;
      this.pageSize = 30;
      this.getAllTableMsg();
    },
    getCatalogDetail(type) {
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
    // 左侧栏拖拽
    dragControllerDiv(e) {
      let width = document.getElementsByClassName("el-container")[0]
        .clientWidth;
      // let remove = document.getElementsByClassName("resize");
      let left = document.getElementsByClassName("leftdiv");
      let c = e.clientX - left[0].clientWidth;
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
    handleSearch() {
      if (this.propSearch !== "") {
        this.pageCurrent = 1;
        this.getAllTableMsg();
      } else {
        this.$message.warning("请选择搜索类别");
      }
    },
    closeDrageList() {
      if (this.changeHeader) {
        console.log(this.tableHeader, 5);
        let arr = [];
        this.tableHeader.map(item => {
          if (item.checked) {
            arr.push(item.prop);
          }
        });
        post("/ds/saveQueryHeaders", {
          classifierId: "PublicCodeInfoItem",
          headers: arr.join(",")
        }).then(res => {
          if (res.code === 10000 && res.success) {
            this.$message.success(res.message);
            this.resetTable(this.nodeId);
            // this.getAllTableMsg();
            this.getAllHeader();
            this.getSearchSelect();
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        this.tableHeader = JSON.parse(this.olderHeader);
      }
    },
    submitTableHeaderChange() {
      this.changeHeader = true;
      this.definitionListDialog = false;
    },
    // 获取表格所有数据
    getAllHeader() {
      get(`/ds/listQueryHeaders/PublicCodeInfoItem`).then(res => {
        console.log(res, "22");
        const data = res.data.map(item => {
          if (!item.checked) {
            // } else {
            item.checked = false;
          }
          return item;
        });
        this.tableHeader = data;
        this.olderHeader = JSON.stringify(data);
      });
    },
    getAllTableMsg() {
      let count = ++this.count
      // if (this.menuClassifierId !== "") {
      this.tableLoading = true;
      // console.log(this.menuClassifierId, 2);
      this.tableData = [];
      get("/ds/customSearch", {
        ancestorId: this.nodeId,
        classifierId: "PublicCodeInfoItem",
        current: this.pageCurrent,
        size: this.pageSize,
        keyword: this.keyword,
        prop: this.propSearch
      }).then(res => {
        console.log(res, 0);
        if (res.code === 10000 && res.success) {
          if (count === this.count) {
            this.tableLoading = false;
            this.headerList = res.extras.headers;
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
        }
      });
      // }
    },
    async datadragEnd(evt) {
      evt.preventDefault();
      let arr = this.tableHeader;
      let newArr = await arr.map((item, i) => {
        return {
          sort_order: i,
          value: item.value,
          checked: item.checked
        };
      });
      this.newTableHeader = newArr;
      console.log(newArr);
    },
    definitionChange(item, index) {
      // console.log(val, index)
      this.tableHeader[index].checked = !this.tableHeader[index].checked;
    },
    definitionList() {
      this.definitionListDialog = true;
      this.changeHeader = false;
      // console.log("1233");
    },
    // 头部 血缘分析
    handleBlood(command) {
      console.log(this.selectArr[0]);
      if (this.selectArr.length === 1) {
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
      } else {
        this.$message.warning("请选择一个公共代码!");
      }
    },
    handleBlood2(command, obj) {
      this.showShadow = true
      this.$router.push({
        name: "dsLineageAnalysisCanvas",
        params: {
          dataFlowType: command,
          id: obj.instanceId,
          _title: generateLineageTitle(command, obj.instanceName)
        }
      });
    },
    handleRefresh() {
      if (this.clickNode !== "") {
        this.refreshLazyTree(this.clickNode);
        console.log(this.clickNode);
        this.nodeId = this.clickNode.data.id;
        this.aIsExpandedArr = [];
        this.aIsExpandedArr.push(this.clickNode.data.id);
        this.$refs.tree.setCurrentKey(this.clickNode.data.id);
      } else {
        this.nodeId = "";
      }
      this.getAllTableMsg();
    },
    // 认责树 筛选
    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.userName.indexOf(value) !== -1;
    },
    // 关键字搜索
    searchTableMsg() {
      this.pageCurrent = 1;
      this.getAllTableMsg();
    },
    // 公共代码分类
    getClassify() {
      get("/ds/public/getPublicCodeClassifierInfos").then(res => {
        console.log(res, "data");
        this.data = res.data;
      });
    },
    // 点击节点
    nodeClick(data, node, component) {
      console.log(data, 1);
      console.log(node, 2);
      this.editNameSpace = data.nodeId;
      this.parentId = data.nodeId;
      console.log(this.editNameSpace, 3);
      this.editCodeForm.namespace = data.nameContext;
      if (node.isLeaf) {
        console.log(this.$refs);
        console.log(this.$refs.classifySelect);
        this.$nextTick(() => {
          console.log(this.$refs.classifySelect[0]);
          this.$refs.classifySelect[0].blur();
        });
      }
    },
    // 自定义tree 图标 文字
    renderAddContent(h, params) {
      let sText = params.data.nodeName;
      let iconType = "icon icon-folder";
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
              height: "15px",
              float: "unset",
              fontWeight: "unset"
            }
          }),
          h("span", sText)
        ]
      );
    },
    // 获取新增动态输入框
    getInputList() {
      this.addInput = [];
      get("/ds/public/getPublicCodeInfoItemAttrInfos", {
        publicCodeInfoItemId:
          this.selectArr.length === 1 ? this.selectArr[0].instanceId : ""
      }).then(res => {
        console.log(res, "inputList");
        this.inputList = res.data;
        let changeList = JSON.stringify(res.data);
        const capitalize = ([first, ...rest], lowerRest = false) =>
          first.toUpperCase() +
          (lowerRest ? rest.join("").toLowerCase() : rest.join(""));
        this.inputList.map(item => {
          let name = item.columnName.toLowerCase();
          let index = name.indexOf("_");
          let val = name
            .substr(0, index)
            .concat(capitalize(name.substr(index + 1, name.length)));
          if (item.columnType === "combobox") {
            if (!item.nullable) {
              this.editRules[val] = [
                {
                  required: true,
                  message: `请选择${item.attrName}`,
                  trigger: "change"
                }
              ];
            }
            get("/ds/listStandardAttrComboboxInfos", {
              columnTypeValue: item.columnTypeValue
            }).then(res => {
              item.dropList = res.data;
              console.log(item, "5");
              this.addInput.push({
                label: item.attrName,
                key: val,
                type: item.columnType,
                nullable: item.nullable,
                value: item.attrValue ? item.attrValue : "",
                dropList: item.dropList
              });
              this.$nextTick(() => {
                this.addInput.map(i => {
                  console.log(i, 'addinput')
                  if (i.key === 'string2') {
                    if (i.value) {
                      this.editCodeForm[i.key] = i.value;
                    } else {
                      res.data.map(val => {
                        if (val.textField === '待发布') {
                          this.editCodeForm[i.key] = val.valueField;
                        }
                      })
                    }
                  }
                });
              });
            });
          } else if (item.columnType === "treedirectory") {
            if (!item.nullable) {
              this.editRules.namespace = [
                {
                  required: true,
                  message: `请选择${item.attrName}`,
                  trigger: "change"
                }
              ];
            }
            this.addInput.push({
              label: item.attrName,
              key: "namespace",
              type: item.columnType,
              nullable: item.nullable,
              value: item.attrValue ? item.attrValue : this.oldNameSpace
            });
          } else if (item.columnName === 'SUP_ID') {
            this.parentId = item.attrValue
          } else {
            if (!item.nullable) {
              console.log(item);
              if (
                item.columnName === "INSTANCE_NAME" ||
                item.columnName === "instanceName"
              ) {
                this.editRules[val] = [
                  { validator: this.checkName, trigger: "blur" }
                ];
                this.name_label = item.attrName;
              } else {
                this.editRules[val] = [
                  {
                    required: true,
                    message: `请输入${item.attrName}`,
                    trigger: "blur"
                  }
                ];
              }
            }
            this.addInput.push({
              label: item.attrName,
              key: val,
              type: item.columnType,
              nullable: item.nullable,
              value: item.attrValue ? item.attrValue : ""
            });
          }
        });
        this.editRules = Object.assign({}, this.editRules);
        console.log(this.editCodeForm, "editData0");
        console.log(this.addInput, "1122");
        // console.log(this.eKey);
        this.$nextTick(() => {
          this.addInput.map(item => {
            this.editCodeForm[item.key] = item.value;
          });
          console.log(this.editCodeForm, "editData");
        });
        this.CodeName = this.editCodeForm.instanceName;
        let getKey = JSON.parse(changeList);
        getKey.map(a => {
          if (a.attrName.includes("英文名称")) {
            console.log(a);
            this.en_name = a.attrValue;
            let b = a.columnName.toLowerCase();
            let index = b.indexOf("_");
            this.eKey = b
              .substr(0, index)
              .concat(capitalize(b.substr(index + 1, b.length)));
          }
        });
      });
    },
    // 获取状态下拉数据
    getStatusList() {
      get("/ds/listStandardAttrComboboxInfos", {
        columnTypeValue: "StdStatusCd"
      }).then(res => {
        console.log(res, "select");
        this.StatusList = res.data;
      });
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addItem = true;
          console.log("jiaoyan");
          if (this.sameList.length > 0) {
            this.showSames = true;
          } else {
            this.showSames = false
            this.sendFinalItem()
          }
        } else {
          return false;
        }
      });
    },
    sendFinalItem() {
      if (this.addItem) {
        const capitalize = ([first, ...rest], lowerRest = false) =>
          first.toUpperCase() +
          (lowerRest ? rest.join("").toLowerCase() : rest.join(""));
        let msg = {};
        this.inputList.map(item => {
          let name = item.columnName.toLowerCase();
          let index = name.indexOf("_");
          let val = name
            .substr(0, index)
            .concat(capitalize(name.substr(index + 1, name.length)));
          msg[val] = this.editCodeForm[val];
          if (
            item.columnType === "treedirectory" &&
            item.attrName.includes("分类")
          ) {
            msg[val] = this.editNameSpace;
          }
        });
        this.pageCurrent = 1;
        this.keyword = "";
        this.propSearch = "";
        this.pageSize = 30;
        this.addBtn = true;
        if (this.dialogTitle === "新增公共代码") {
          post("/ds/public/addPublicCodeInfoItem", msg).then(res => {
            if (res.code === 10000 && res.success) {
              this.clearEditDialog();
              this.editDialog = false;
              this.addBtn = false;
              this.getAllTableMsg();
              this.$message.success(res.message);
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          msg.instanceId = this.selectArr[0].instanceId;
          post("/ds/public/updatePublicCodeInfoItem", msg).then(res => {
            if (res.code === 10000 && res.success) {
              this.clearEditDialog();
              this.editDialog = false;
              this.addBtn = false;
              this.getAllTableMsg();
              this.$message.success(res.message);
            } else {
              this.$message.error(res.message);
            }
          });
        }
      }
      this.showSames = false;
      this.addItem = false;
    },
    clearEditDialog() {
      for (let i in this.editCodeForm) {
        this.editCodeForm[i] = "";
      }
    },
    // 点击面包屑，定位到树tree节点展开
    toClickBreadcrumb(item) {
      this.searchNode(this.firstNode, item.id);
      if (item.notetype === "view") {
        this.nodeId = "";
      } else {
        this.nodeId = item.id;
      }
      this.getAllTableMsg();
      this.aIsExpandedArr = [];
      this.aIsExpandedArr.push(item.id);
      console.log(this.aIsExpandedArr);
      // 设置默认节点高亮
      console.log(this.$refs.tree);
      // this.$refs.tree.setCurrentKey(item.id);
      let len = this.Breadcrumb.length - 1;
      this.Breadcrumb.map((val, index) => {
        if (val.level === item.level && val.id === item.id) {
          this.Breadcrumb.splice(index + 1, len);
        }
      });
    },
    searchNode(node, id) {
      console.log(node);
      node.childNodes.map(item => {
        // console.log(item.data.id, id)
        if (item.data.id === id) {
          this.noSonTree = "";
          this.refreshLazyTree(item);
          setTimeout(() => {
            this.$refs.tree.setCurrentKey(item.data.id);
          }, 500);
          return;
        } else {
          this.searchNode(item, id);
        }
      });
    },
    // 跳转至新增
    handleAdd() {
      // this.dialogTitle = "新增公共代码";
      // this.getClassify();
      // this.selectArr = [];
      // this.getInputList();
      // this.sendInstanceId = "";
      // this.editDialog = true;
      // this.masterDataDialogTitle = '新增'
      if (this.node.data) {
        // 用户视图 data有数据
        if (this.node.data.notetype !== 'view') {
          // this.getPath("add");
          this.dialogTitle = "新增公共代码";
          this.getClassify();
          this.selectArr = [];
          this.getInputList();
          this.sendInstanceId = "";
          this.editDialog = true;
          this.masterDataDialogTitle = '新增'
        } else {
          // 点击view层 node.data 有数据 nodetype等于view
          this.$message.warning("请选择挂载目录！")
        }
      } else if (this.node.childNodes[0].data.notetype !== 'view') {
        // 刚进入系统视图时 node的data为undefined childnodes[0]的data.notetype等于view
        // this.getPath("add");
        this.dialogTitle = "新增公共代码";
        this.getClassify();
        this.selectArr = [];
        this.getInputList();
        this.sendInstanceId = "";
        this.editDialog = true;
        this.masterDataDialogTitle = '新增'
      } else {
        this.$message.warning("请选择挂载目录！")
      }
      // this.$router.push({
      //   name: "ruleAdd"
      // });
    },
    // 跳转编辑页
    toEdit(item) {
      this.sendInstanceId = item.instanceId;
      console.log(item);
      this.dialogTitle = "编辑公共代码";
      this.selectArr = [item];
      this.getInputList();
      this.editDialog = true;
    },
    // handleEdit() {
    //   if (this.selectArr.length === 1) {
    //     this.dialogTitle = "编辑公共代码";
    //     this.getInputList();
    //     this.editDialog = true;
    //   } else {
    //     this.$message.error("请选择一个公共代码信息项！");
    //   }
    // },
    deleteSome(item) {
      this.selectItem = item;
      this.isDeleteMenu = false;
      // console.log(this.selectArr);
      if (item) {
        this.showMenu = false;
        this.deleteDialog = true;
        let idArr = [];
        // this.selectArr.map(item => {
        idArr.push(item.instanceId);
        // });
        this.$nextTick(() => {
          this.$refs.deleteMenuDialog.activeFirst();

          this.$refs.deleteMenuDialog.getAllMsg(idArr.join(","));
        });
      }
      // else {
      //   this.$message.warning("请至少选择一个公共代码信息项!");
      // }
    },
    // 批量删除规则
    handleDelete() {
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
          let idArr = [];
          // this.selectArr.map(item => {
          idArr.push(this.selectItem.instanceId);
          // });
          get("/ds/public/deletePublicCodeInfoItems", {
            ids: idArr.join(",")
          }).then(res => {
            if (res.code === 10000 && res.success && res.success) {
              this.$message.success(res.message);
              load.close();
              // this.getTableData();
              this.pageCurrent = 1;
              this.pageSize = 30;
              this.keyword = "";
              this.propSearch = "";
              this.getAllTableMsg();
              this.deleteDialog = false;
            } else {
              load.close();
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
    // 批量删除规则
    // handleDelete() {
    //   if (this.selectArr.length > 0) {
    //     this.$confirm("是否确定删除?", "提示", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     })
    //       .then(() => {
    //         let idArr = [];
    //         this.selectArr.map(item => {
    //           idArr.push(item.id);
    //         });
    //         get("/ds/application/rule/removeRuleInfo", {
    //           ids: idArr.join(",")
    //         }).then(res => {
    //           if (res.code === 10000 && res.success && res.success) {
    //             this.$message.success(res.message);
    //             this.getAllTableMsg();
    //           } else {
    //             this.$message.error(res.message);
    //           }
    //         });
    //       })
    //       .catch(() => {
    //         this.$message({
    //           type: "info",
    //           message: "已取消删除"
    //         });
    //       });
    //   } else {
    //     this.$message.warning("请选择一个规则!");
    //   }
    // },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getAllTableMsg();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAllTableMsg();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.selectArr = val;
    },
    isClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "border-right:none;";
      }
    },
    isClass2({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "tableClass";
      }
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
    // 视图切换 触发事件
    changeView(val) {
      console.log(val);
      this.nodeId = "";
      this.getAllTableMsg();
      this.nodeId = val;
      this.treeLoading = true;
      this.node.childNodes = [];
      this.firstNode.childNodes = [];
      this.nodeType = "view";
      this.bShowEdit = false;
      this.loadNode(this.firstNode, this.firstResolve);
    },
    // 获取表格数据
    // getAllTableMsg() {
    //   this.tableData = [];
    //   get("/ds/public/queryPublicCodeInfoItems", {
    //     keyword: this.keyword,
    //     pageCurrent: this.pageCurrent,
    //     nodeId: this.nodeId,
    //     pageSize: this.pageSize
    //   }).then(res => {
    //     console.log(res);
    //     if (res.success && res.code === 10000 && res.success) {
    //       this.total = res.data.total;
    //       this.tableData = res.data.records;
    //       for (let i = 0; i < this.tableData.length; i++) {
    //         this.tableData[i].attributes.map(item => {
    //           if (item.name === "英文名称") {
    //             this.tableData[i].enName = item.value;
    //           }
    //           if (item.name.includes("状态")) {
    //             this.tableData[i].status = item.value;
    //           }
    //         });
    //       }
    //     } else {
    //       this.$message.error(res.message);
    //     }
    //   });
    // },
    // 跳到详情页
    toDetail(item) {
      this.selectArr = [];
      this.$refs.SelectTable.clearSelection();
      // console.log(this.selectArr)
      this.showComponent = "commonDetail";
      this.$refs.commonDetail.getAllMsg(item.instanceId);
      // console.log(item, "di");
      // this.$router.push({
      //   name: "commonCodeDetail",
      //   params: { row: item, id: item.id, _title: item.name }
      // });
    },
    // 展示主页面
    showMain(val) {
      this.showComponent = "main";
    },
    // 公告代码信息项详情
    showItemDetail(val) {
      this.$refs.itemDetail.getAllMsg(val);
      this.showComponent = "itemDetail";
    },
    // 公共代码详情
    showCommonDetail(msg) {
      this.showComponent = "commonDetail";
    },
    // 懒加载树
    loadNode(node, resolve) {
      this.node = node;
      this.resolve = resolve;
      console.log(node, "22");
      if (node.level === 0) {
        this.firstNode = node;
        this.firstResolve = resolve;
        get("/ds/public/listPublicCodeTree", {
          nodeId: this.nodeId,
          nodeType: this.nodeType
        }).then(res => {
          if (res.code === 10000 && res.success && res.success === true) {
            this.treeLoading = false;
            console.log(res, 6);
            if (res.data.length > 0) {
              if (res.data[0].classifierId) {
                this.menuClassifierId = res.data[0].classifierId;
                this.nodeId = res.data[0].id;
              } else {
                this.nodeId = "";
                this.menuClassifierId = "";
              }
              this.namespace = res.data[0].namespace;
              this.$nextTick(() => {
                // this.editCodeForm.namespace = res.data[0].name;
                console.log(this.data, "888");
                if (this.data.length > 0) {
                  this.data.map(a => {
                    console.log(a, "aaa");
                    if (a.nodeName === res.data[0].name) {
                      this.editCodeForm.namespace = a.nameContext;
                      this.oldNameSpace = a.nameContext;
                      this.parentId = a.nodeId;
                    } else {
                      this.editCodeForm.namespace = `/${res.data[0].name}`;
                      this.oldNameSpace = `/${res.data[0].name}`;
                      this.parentId = res.data[0].nodeId;
                    }
                  });
                } else {
                  this.editCodeForm.namespace = `/${res.data[0].name}`;
                  this.oldNameSpace = `/${res.data[0].name}`;
                }
                this.editNameSpace = res.data[0].id;
                this.menuName = res.data[0].name;
              });
            }
            this.resetTable(this.nodeId);
            // this.getAllTableMsg();
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
        get("/ds/public/listPublicCodeTree", params).then(res => {
          if (res.success && res.code === 10000 && res.success) {
            // this.node.childNodes = []
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
    refreshLazyTree(node) {
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
      get("/ds/public/listPublicCodeTree", params).then(res => {
        if (res.success && res.code === 10000 && res.success) {
          // this.node.childNodes = []
          const list = res.data.map(item => {
            item.isLeaf = item.leaf;
            return item;
          });
          node.childNodes = [];
          node.doCreateChildren(list);
          this.$nextTick(() => {
            if (this.noSonTree.data) {
              this.aIsExpandedArr = [];
              this.aIsExpandedArr.push(this.noSonTree.data.id);
              // 设置默认节点高亮
              this.$refs.tree.setCurrentKey(this.noSonTree.data.id);
            }
          });
        }
      });
      //   console.log(res)
      // }
    },
    // 自定义tree 图标 文字
    renderContent(h, params) {
      // console.log(params);
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
    // 获取视图切换下拉
    getViewList() {
      get("/ds/application/rule/listAllViews").then(res => {
        this.viewList = res.data;
        let str = JSON.stringify(res.data);
        if (str.includes("true")) {
          res.data.map(item => {
            if (item.defultShow) {
              this.value = item.id;
              // this.nodeId = item.id;
            }
          });
        } else {
          res.data.map(item => {
            if (item.id === "0") {
              this.value = item.id;
            }
          });
          // this.value = "系统视图";
        }
      });
    },
    /**  tree  树操作    **/
    handleNodeClick(node, a, b) {
      console.log(this.firstNode, "first");
      this.keyword = "";
      this.propSearch = "";
      console.log(node, a);
      this.parentId = node.id;
      get("/ds/getStandardContext", {
        isContainRoot: true,
        isContainIndex: false,
        namespace: node.namespace
      }).then(res => {
        console.log(res.data, "resdata");
        if (res.data) {
          console.log(res);
          this.editCodeForm.namespace = res.data;
          this.oldNameSpace = res.data;
        } else {
          this.editCodeForm.namespace = `/${this.menuName}`;
          this.oldNameSpace = `/${this.menuName}`;
          console.log("nono");
        }
        //  else {
        //   // this.editCodeForm.namespace = this.firstNode.data.name ? `/${this.firstNode.data.name}` : `/${this.firstNode.children[0].data.name}`
        //   // this.oldNameSpace = this.firstNode.data.name ? `/${this.firstNode.data.name}` : `/${this.firstNode.children[0].data.name}`;
        //   console.log(this.firstNode.data === undefined, 'firstNode.data')
        // }
      });
      console.log(node, "66");
      console.log(a, "99");
      a.childNodes.map(item => {
        item.expanded = false;
      });
      // if(node.data.namespace) {
      //   this.toAddMsg.namespace = node.data.namespace
      //   this.toAddMsg.node = a
      // }
      this.pageCurrent = 1;
      this.aIsExpandedArr = [];
      this.showComponent = "main";
      this.clickNode = a;
      this.nodeId = node.id;
      if (a.id !== this.editMenuId) {
        this.showComponent = "card";
      }
      console.log(this.data, "data222");
      // this.editCodeForm.namespace = node.name;
      // if (this.data.length > 0) {
      //   // this.getChildNameSpace(this.data, node.name)
      //   this.data.map(item => {
      //     console.log(item, 'item', node.name)
      //     if (item.nodeName === node.name) {
      //       this.editCodeForm.namespace = item.nameContext;
      //       this.oldNameSpace = item.nameContext;
      //     } else {
      //       // if ()
      //       this.editCodeForm.namespace = `/${node.name}`;
      //       this.oldNameSpace = `/${node.name}`;
      //     }
      //   });
      // } else {
      //   this.editCodeForm.namespace = `/${node.name}`;
      //   this.oldNameSpace = `/${node.name}`;
      // }

      // this.oldNameSpace = node.name;
      if (a.data.notetype === "view") {
        this.nodeId = "";
      } else {
        this.nodeId = node.id;
      }
      this.editNameSpace = node.id;
      node.level = a.level;
      // console.log("click");
      if (node.classifierId) {
        this.menuClassifierId = node.classifierId;
        this.tableData = [];
        this.resetTable(this.nodeId);
        // this.getAllTableMsg();
        if (node.classifierId.includes("Parent")) {
          this.classifyName = node.name;
        }
      }
      let len = this.Breadcrumb.length - 1;
      if (this.Breadcrumb.length > 1) {
        this.Breadcrumb.map((item, index) => {
          // console.log(item, "222");
          // console.log(a, "222");
          if (item.level === a.level) {
            // console.log("level");
            this.Breadcrumb.splice(index, len);
          }
        });
        if (a.isLeaf) {
          this.refreshLazyTree(a.parent);
        }
        this.noSonTree = a;
      }

      if (node.classifierId === "Context") {
        get(`/ds/details/${node.id}`).then(res => {
          if (res.code === 10000 && res.success) {
            res.data.attributes.map(i => {
              if (i.attrCode === "Tag") {
                node.tipValue = i.value;
                node.isDisabled = false;
                node.level = a.level;
                if (!this.Breadcrumb.includes(node)) {
                  this.Breadcrumb.push(node);
                }
              }
            });
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        node.tipValue = "";
        node.isDisabled = true;
        this.Breadcrumb.push(node);
      }

      if (node.notetype === "metadata") {
        // 元数据类型为nodetype时，查询右侧信息项列表
        this.instanceId = node.id;
        // 获取右侧主数据信息项的列表
        this.resetTable(this.nodeId);
        // this.getAllTableMsg();
      }
      // console.log(this.Breadcrumb, 0);
    },
    // getChildNameSpace(child, name) {
    //   // if (child.length > 0) {
    //   console.log('continue')
    //   this.editCodeForm.namespace = ''
    //   this.oldNameSpace = ''
    //   child.map(item => {
    //     if (item.CodeName === name) {
    //       this.editCodeForm.namespace = item.nameContext;
    //       this.oldNameSpace = item.nameContext;
    //       return
    //     }
    //   })
    //   if (this.editCodeForm.namespace !== '' && child.childNodes.length > 0) {
    //     this.getChildNameSpace(child.childNodes, name)
    //   }
    // },
    /**  鼠标右键 */
    handleMouseRight(event, data, node, component) {
      if (data.classifierId) {
        if (data.classifierId.includes("Parent")) {
          this.classifyName = data.name;
        }
      }
      // console.log(node, "right");
      this.node = node;
      this.nodeIsLeaf = node.isLeaf;
      this.removeData = data;
      this.deleteMenu = data;
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
      contextMenu.style.left = event.offsetX + 75 + "px";
      contextMenu.style.top = event.clientY - 70 + "px";
    },
    // 新增目录 点击事件
    toAddCatalog() {
      this.showMenu = false;
      this.addMenu = true;
      this.bIsCatalogVisible = true;
      // 根据namespace获取上下文路径
      this.getPath();
      this.getListClassifier();
      this.toAddUserShow(); // 获取部门列表
    },
    // 获取非固定输入框
    getListFeature() {
      get("/ds/listFeatureByClassifierId", {
        classifierId: "Context"
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.editInputList = [];
          // this.baseInfoRuleForm[item.attStore] = ''
          // console.log(res, "aaa");
          this.catalogMean = false;
          this.standardShow = false;
          res.data.map(item => {
            if (item.attCode === 'Is_Entity') {
              this.baseInfoRuleForm[item.attStore] = 'F'
            } else {
              this.baseInfoRuleForm[item.attStore] = ''
            }
            item.attrStore = item.attStore;
            if (item.columnType === "combobox") {
              get("/ds/listStandardAttrComboboxInfos", {
                columnTypeValue: item.datatypeId
              }).then(res => {
                // console.log(res, "000", item);
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
          this.baseInfoRuleForm = Object.assign({}, this.baseInfoRuleForm);
          // this.getListClassifier();
          this.getListClassifier2();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取上级目录
    getPath() {
      get("/ds/getStandardContext", {
        isContainRoot: true,
        namespace: this.namespace
      }).then(res => {
        // console.log(res);
        if (res.code === 10000 && res.success) {
          this.baseInfoRuleForm.catalog =
            res.data === "" ? this.parentName : res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取归属标准下拉框数据
    getListClassifier() {
      get("/ds/application/rule/listClassifier").then(res => {
        this.classifyList = res.data;
        res.data.map(item => {
          // console.log(item);
          if (item.classifierName === this.classifyName) {
            // console.log(this.classifyName);
            // this.baseInfoRuleForm.classify = item.classifierName;
            this.classifierId = item.classifierId;
            this.classifierName = item.classifierName;
            // this.baseInfoRuleForm
            // console.log(this.editInputList, 6);
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
              if (i.attCode === 'Is_Entity' || i.attrCode === 'Is_Entity') {
                this.$set(
                  this.baseInfoRuleForm,
                  i.attrStore,
                  'F'
                );
              }
            });
          }
        });
        // this.getListFeature()
        // console.log(this.baseInfoRuleForm, "111");
      });
    },
    getListClassifier2() {
      get("/ds/application/rule/listClassifier").then(res => {
        console.log(res, "bbb");
        this.classifyList = res.data;
        res.data.map(item => {
          console.log(item, "item");
          if (item.classifierName === this.classifyName) {
            console.log(item.classifierName, "00");
            // this.baseInfoRuleForm.classify = item.classifierName;
            this.classifierId = item.classifierId;
            this.classifierName = item.classifierName;
            // this.baseInfoRuleForm
            console.log(this.editInputList, 6);
            this.editInputList.map(i => {
              console.log(i, "03");
              if (
                i.attrCode === "Standard_type" ||
                i.attCode === "Standard_type"
              ) {
                // this.baseInfoRuleForm[i.attrStore] = item.classifierName
                this.$set(
                  this.baseInfoRuleForm,
                  i.attrStore,
                  item.classifierName
                );
                console.log(item.classifierName, "name");
              }
            });
          }
        });
        // this.editInputList = [];
        // this.getListFeature()
        // this.bIsCatalogVisible = true;
        console.log(this.baseInfoRuleForm, "base");
      });
    },
    // 归属标准选择
    selectClassify(val) {
      // console.log(val);
      this.classifierId = val;
      this.classifyList.map(item => {
        // console.log(item);
        if (item.classifierId === val) {
          // console.log(item.classifierId);
          this.classifierName = item.classifierName;
        }
      });
      // console.log(this.baseInfoRuleForm.classify);
    },
    // 修改目录
    toEditCatalog() {
      this.showMenu = false;
      this.addMenu = false;
      this.toAddUserShow();
      get("/ds/getCatlogDetail", {
        id: this.editMenuId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.editInputList = [];
          this.getEditList = res.data;
          console.log(res, "666");
          // this.getListClassifier()
          // this.classifierId = res.data.belongEn;
          // this.classifierName = res.data.belongCn;
          res.data.dataStandardVO.attributes.map(item => {
            console.log(item);
            if (item.columnType === "combobox") {
              get("/ds/listStandardAttrComboboxInfos", {
                columnTypeValue: item.datatypeId
              }).then(res => {
                console.log(res, "96");
                item.selectList = res.data;
                this.editInputList.push(item);
                res.data.map(item => {
                  console.log(item, "000");
                  console.log(this.classifyName);
                  if (item.textField === this.classifyName) {
                    this.classifierId = item.valueField;
                    this.classifierName = item.textField;
                    this.editInputList.map(i => {
                      console.log(i, "03");
                      if (
                        i.attrCode === "Standard_type" ||
                        i.attCode === "Standard_type"
                      ) {
                        // this.baseInfoRuleForm[i.attrStore] = item.classifierName
                        this.$set(
                          this.baseInfoRuleForm,
                          i.attrStore,
                          item.textField
                        );
                        console.log(this.classifierName, "name");
                      }
                    });
                  }
                });
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
          this.sendInstanceId = res.data.dataStandardVO.id;
          if (res.data.group) {
            this.baseInfoRuleForm.selectGroup2 = res.data.group.groupName;
            this.baseInfoRuleForm.selectUser2 = res.data.user.username;
          } else {
            this.baseInfoRuleForm.selectGroup2 = null;
            this.baseInfoRuleForm.selectUser2 = null;
          }
          // this.baseInfoRules.menuCode = []
          console.log(this.baseInfoRuleForm, 6);
          // this.baseInfoRuleForm.cnName = res.data.dataStandardVO.name
          // this.baseInfoRuleForm.cnName = res.data.dataStandardVO.name
          let EditMsg = res.data;
          this.$nextTick(() => {
            console.log(this.editInputList, "inputList");
            this.editInputList.map(item => {
              console.log(item);
            });
          });
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
                // console.log(this.catalogData.selectUser)
              }
            });
          } else {
            this.catalogData.selectGroup = null;
          }
          // if (res.data.user.username) {
          //   this.userTagList = res.data.user;
          //   this.dutyUserId = this.userTagList.userId;
          // } else {
          //   this.userTagList = {};
          //   this.dutyUserId = "";
          // }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 删除目录
    // 删除目录
    showDeleteDialog() {
      this.isDeleteMenu = true;
      this.showMenu = false;
      this.deleteDialog = true;
      this.$nextTick(() => {
        this.$refs.deleteMenuDialog.activeFirst();
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
              load.close();
              this.$message.success("删除成功!");
              this.showComponent = "main";
              this.handleRefresh();
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
              setTimeout(() => {
                this.$refs.tree.setCurrentKey(this.node.parent.data.id);
                console.log(this.node.parent.data, "deletePar");
                this.nodeId = this.node.parent.data.id;
                this.editNameSpace = this.node.parent.data.id;
                this.oldNameSpace = `/${this.node.parent.data.name}`;
                this.editCodeForm.namespace = `/${this.node.parent.data.name}`;
                // this.getAllTableMsg()
                this.resetTable(this.nodeId);
              }, 500);
              this.deleteDialog = false;
            } else {
              this.$message.error(res.message);
            }
          });
        })
        .catch(() => {
          load.close();
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 显示选择目录的tree
    toShowCatalogTree() {
      this.bIsShowCatalogTree = !this.bIsShowCatalogTree;
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
    //     console.log(res, "22");
    //     this.userTree = res.data.map(item => {
    //       item.userName = item.groupName;
    //       console.log(item.users[0].userId);
    //       if (item.users.length > 0 && item.users[0].userId !== undefined) {
    //         return item;
    //       } else {
    //         item.users = [];
    //         return item;
    //       }
    //     });
    //   });
    // },
    // 选择用户 - 确定
    // toSaveUser() {
    //   this.filterText = "";
    //   this.bIsUserVisible = false;
    //   console.log(this.userTagList);
    //   if (this.userTagList.id) {
    //     this.dutyUserId = this.userTagList.id;
    //   }
    //   this.$refs["baseInfoRuleForm"].validate(valid => {});
    // },

    // 关闭tags
    // closeTag() {
    //   this.userTagList = {};
    //   this.dutyUserId = "";
    //   // console.log(item);
    // },
    // 新增目录 - 确定
    toSaveCatalog() {
      // console.log(this.editInputList);
      // console.log(this.baseInfoRuleForm);
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
            // console.log(msg);
            postByJson("/ds/saveCatalogue", msg).then(res => {
              if (res.code === 10000 && res.success) {
                this.$message.success(res.message);
                this.bIsCatalogVisible = false;
                // 没有子节点  新增 删除刷新整个树
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
            console.log(this.editInputList);
            console.log(this.baseInfoRuleForm);
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
            // console.log(msg);
            postByJson("/ds/saveCatalogue", msg).then(res => {
              if (res.code === 10000 && res.success) {
                this.refreshLazyTree(this.node.parent);
                this.$message.success(res.message);
                this.dutyUserId = "";
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
          return false;
          // this.$message.error("请填写必填项！");
        }
      });
    },
    // 判断鼠标点击 显示隐藏 tree的目录
    clickBox(e) {
      if (!this.$refs.rightMenu.contains(e.target)) {
        this.showMenu = false;
      }
    },
    // 责任人 tree点击
    handleUserNodeClick(node, data, component) {
      console.log(node);
      console.log(data);
      if (!node.groupName) {
        this.userTagList = { id: node.userId, username: node.userName };
      }
      console.log(this.userTagList, 1);
    },
    // 下拉数据
    getSearchSelect() {
      get("/ds/listCustomSearchLabels", {
        classifierId: "PublicCodeInfoItem"
      }).then(res => {
        console.log(res.data);
        if (res.code === 10000 && res.success) {
          this.selectList = res.data;
        }
      });
    },
    // 跳转详情
    toSeeDetail(item) {
      console.log(item);
      this.selectArr = [];
      this.$refs.SelectTable.clearSelection();
      // console.log(this.selectArr)
      this.showComponent = "commonDetail";
      this.$refs.commonDetail.getAllMsg(item.id);
      this.showSames = false;
      this.editDialog = false;
      // this
    }
  },
  activated() {
    this.getAllTableMsg();
    this.showShadow = false
  },
  created() {
    this.getListFeature();
    this.showComponent = "main";
    this.getAllTableMsg();
    // this.getTableAllMsg()
    this.getViewList();
    this.getAllHeader();
    this.getSearchSelect();
    this.getClassify();
    if (this.$route.params.classifierId !== undefined) {
      this.showCommonDetail();
      this.$nextTick(() => {
        this.$refs.commonDetail.getAllMsg(this.$route.params.id);
      });
    }
  }
};
</script>

<style>
/* @import "../../../../styles/treeIcon.scss"; */
/* @import "../../../../styles/treeIconScoped"; */
</style>
<style lang="scss" scoped>
//外层card容器样式;
@import "./../../../styles/dq/main-card-table.scss";
@import "../../../styles/treeIconScoped";
$color-grey-light: #e0e0e0;
.el-main {
  overflow: hidden;
}
.commonCode {
  padding: 15px;
  height: 100%;
  .resize:hover {
    cursor: e-resize;
  }
  // tree 鼠标右键弹出框
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
  .treeDiv {
    width: 100%;
    padding: 15px 0;
    height: calc(100% - 80px);
    overflow-y: auto;
  }
  .treeDiv::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }
  .treeDiv::-webkit-scrollbar-track {
    background: none;
    border-radius: 2px;
  }
  .treeDiv::-webkit-scrollbar-thumb {
    background: rgb(239, 239, 239);
    border-radius: 10px;
  }
  .treeDiv::-webkit-scrollbar-thumb:hover {
    background: #bfbfbf;
  }
  /deep/ .el-card__body {
    padding: 25px 10px !important;
    position: relative;
    height: 100%;
  }
  .left_tree {
    height: 100%;
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
      height: 35px;
      padding: 4px 0 8px;
      .title {
        margin: 0;
        font-size: 16px;
        line-height: 23px;
        font-weight: 700;
        color: rgb(126, 123, 123);
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
    .footer {
      position: absolute;
      bottom: 15px;
      border-top: 1px solid $color-grey-light;
      display: flex;
      width: calc(100% - 20px);
      padding-top: 10px;
      background: #fff;
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
      }
    }
  }
  .el-main {
    padding: 0;
    border: 1px solid #ebeef5;
    margin-left: 10px;
    background: #fff;
    height: calc(100vh - 115px);
  }
  .el-card {
    height: calc(100vh - 115px);
    .el-card__body {
      .card-header {
        display: flex;
        border-bottom: 1px solid $color-grey-light;
        // padding: 4px 0 8px;
        padding: 3px 0 8px;
        padding-right: 35px;
        position: relative;
        .definition-list {
          width: 35px;
          height: 25px;
          position: absolute;
          right: 0;
          cursor: pointer;
        }
        .el-icon-location-outline {
          font-size: 22px;
          position: relative;
          // bottom: 3px;
          margin-right: 6px;
        }
        .el-breadcrumb {
          font-size: 12px;
          line-height: 22px;
          /deep/ .el-breadcrumb__inner {
            color: #409eff;
            cursor: pointer;
          }
        }
        // .dimensionality-form{
        //     .el-form-item{
        //         margin-right:8px;
        //         margin-bottom:0;
        //         /deep/ .el-form-item__label{
        //             padding-right:5px;
        //         }
        //     }
        // }
      }
      .card-button {
        // margin-left: 20px;
        margin-top: 15px;
        /deep/ .el-form-item__label {
          line-height: 30px;
        }
        /deep/ .el-form-item__content {
          line-height: 30px;
        }
        .el-dropdown {
          margin: 0 10px;
        }
        .el-button--mini {
          font-size: 13px;
          // padding: 4px 8px;
          padding: 0px 8px;
          height: 30px;
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
          // padding: 6px 7px 5px;
          .svg-icon {
            width: 16px;
            height: 16px;
          }
          .text {
            bottom: 1px;
          }
        }
        .xiugai {
          // padding: 2.5px 6px 5.5px;
          .svg-icon:nth-of-type(1) {
            width: 20px;
            height: 20px;
            top: 1px;
          }
          .svg-icon:nth-of-type(2) {
            width: 12px;
            height: 16px;
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
          .text {
            margin-top: 6px;
            float: right;
          }
        }
        .shuaxin {
          .svg-icon {
            width: 18px;
            height: 18px;
          }
          .text {
            margin-top: 6px;
            float: right;
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
        .preview,
        .deleteRed,
        .editor,
        .multilink {
          width: 22px;
          height: 22px;
        }
        .el-button + .el-button {
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
  .picker-date {
    width: 180px;
  }
  /deep/ .el-table__fixed-right{
    height:100%!important;
  }
}
.el-dropdown-menu.el-popper {
  padding: 6px 0;
  .el-dropdown-menu__item {
    line-height: 30px;
    padding: 0 15px;
  }
}
.tree-box {
  margin-top: 5px;
}
.tag-box {
  line-height: 32px;
}
.basic-button {
  height: 34px;
  width: 85px;
  padding: 0 15px 0 35px;
  position: relative;
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
  background: url(../../../assets/images/commonIcon/blood-icon.png)
    no-repeat;
  background-size: 100%;
}
.definition {
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
.delete-dialog {
  /deep/ .el-dialog__body {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
}
.dialog-btn {
  text-align: center;
  border-top: 1px solid #e8ebed;
  padding: 10px;
}
.el-dropdown-menu {
  padding: 0;
}
.commonCode {
  .checkSame /deep/ {
    .el-dialog__wrapper .el-dialog .el-dialog__header {
      border: unset !important;
    }
    .el-dialog__wrapper .el-dialog .el-dialog__footer {
      text-align: center;
      padding: 20px;
      border: unset !important;
    }
    .el-dialog__body {
      padding: 0 20px;
    }
  }
}
.dialog-ul {
  padding: 0;
  margin: 0;
  li {
    list-style-type: none;
  }
  .el-button {
    margin-left: 10px;
  }
}
.el-dropdown-menu__item {
  padding: 0;
  text-align: center;
  width: 80px;
}
</style>

<style lang="scss">
@import "../../../styles/exportData";
</style>
