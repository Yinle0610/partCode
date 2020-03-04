<!--元数据查询-->
<template>
  <div class="mateData-container tableNoPadding">
    <el-container>
      <el-aside width="20%" class="leftdiv">
        <el-card class="left_tree">
          <div class="title">
            <span>显示模式</span>
            <el-switch
              v-model="bShowCode"
              :width="60"
              active-color="#09e"
              active-text="代码"
              inactive-color="#09e"
              inactive-text="名称"
            ></el-switch>
          </div>
          <div v-loading="treeLoading" class="treeDiv">
            <el-tree
              accordion
              @node-click="handleNodeClick"
              @node-expand="handleNodeClick"
              node-key="id"
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
            <el-select @change="changeView" v-model="value" placeholder="请选择" size="mini">
              <el-option
                v-for="(item, index) in viewList"
                :key="index"
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
        <el-card v-show="showComponent === 'main'" shadow="hover">
          <div class="shadow" v-if="showShadow"></div>
          <div class="no-data" v-if="sNodeType !== 'metaModel'">
            <svg-icon icon-class="nodata" class="nodata"></svg-icon>
          </div>
          <div v-else>
            <div class="card-button">
              <el-button
                v-permission="'MD_SEARCH_EDIT'"
                @click="handleEdit('main')"
                type="warning"
                size="mini"
                class="xiugai fl"
              >
                <svg-icon icon-class="xiugai"></svg-icon>
                <span class="text">编辑</span>
              </el-button>
              <!-- <el-button @click="handleExoprt" v-if="showExportBtn"  v-permission="'MD_SEARCH_EXPORT'" type="primary" size="mini" class="xiugai">
                <svg-icon icon-class="xiazai"></svg-icon>
                <span class="text">导出</span>
              </el-button>-->
              <el-button type="primary" size="mini" class="shuaxin fl" @click="getAllTableMsg">
                <svg-icon icon-class="shuaxin"></svg-icon>
                <span class="text">刷新</span>
              </el-button>
              <el-dropdown @command="handleBlood" v-if="analyzeBtn">
                <el-button
                  class="meta-btn"
                  style="width: 80px;
                        padding: 0px 15px 0px 25px;
                        height: 30px;"
                  type="primary"
                >
                  <i class="dataTable-icon blood"></i>
                  血缘
                  <!-- <svg-icon icon-class="xian"></svg-icon>
                  <svg-icon icon-class="more"></svg-icon>-->
                </el-button>
                <el-dropdown-menu class="md_search" slot="dropdown" trigger="click">
                  <el-dropdown-item :command="'showImpact'">影响分析</el-dropdown-item>
                  <el-dropdown-item :command="'showLineage'">血统分析</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-form style="width:300px;float:right;">
                <el-form-item style="width:135px;float: left;" class="search-keyword">
                  <el-select v-model="propSearch" placeholder="请选择搜索分类" size="mini">
                    <el-option
                      :label="item.textField"
                      :value="item.valueField"
                      v-for="(item, index) in selectList"
                      :key="index"
                      align="center"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item style="width:160px;float: left;margin-left:5px;">
                  <el-input
                    v-model="keyWord"
                    @keyup.enter.native="handleSearch"
                    placeholder="请输入内容..."
                    onKeypress=" "
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
                :header-cell-style="{background:'#f8f8f9',color:'#666',height:'45px'}"
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
                  :show-overflow-tooltip="showToolTip"
                  :label="item.label"
                >
                  <template
                    slot-scope="scope"
                  >
                  <div v-html="item.prop === 'classifierName' ?`${scope.row[item.prop]}(${scope.row.classifierId})` : scope.row[item.prop]"></div>
                <!-- {{ item.prop === 'classifierName' ?`${scope.row[item.prop]}(${scope.row.classifierId})` : scope.row[item.prop]}} -->
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <!-- <el-button @click="toDetail(scope.row)" type="text">详情</el-button> -->
                    <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                      <el-button @click="toDetail(scope.row)" type="text">
                        <svg-icon icon-class="preview" class="preview"></svg-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="编辑"
                      placement="bottom"
                      :enterable="false"
                      v-permission="'MD_SEARCH_EDIT'"
                    >
                      <el-button type="text" @click="goEdit('main', scope.row)">
                        <svg-icon icon-class="editor" class="editor"></svg-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="影响分析"
                      placement="bottom"
                      :enterable="false"
                      v-if="scope.row.classifierId==='Table'||scope.row.classifierId==='Schema'||scope.row.classifierId==='View'||scope.row.classifierId==='Column'"
                    >
                      <el-button type="text" @click="goToInfluencePage(scope.row)">
                        <svg-icon icon-class="anaalysis2" class="anaalysis2"></svg-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="血统分析"
                      placement="bottom"
                      :enterable="false"
                      v-if="scope.row.classifierId==='Table'||scope.row.classifierId==='Schema'||scope.row.classifierId==='View'||scope.row.classifierId==='Column'"
                    >
                      <el-button type="text" size="small" @click="goToBloodPage(scope.row)">
                        <svg-icon icon-class="blood2" class="blood2"></svg-icon>
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
          </div>
        </el-card>
        <metadata-detail
          ref="metadataDetail"
          @changeShow="showMain"
          v-show="showComponent === 'metadataDetail'"
        ></metadata-detail>
        <div v-show="showComponent === 'metaEdit'" class="meta-edit">
          <meta-edit
            @changeComponentShow="changeComponentShow"
            @changeShow="backChangeShow"
            :formValue="formValue"
          ></meta-edit>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { get, post, parseAjaxResponse } from "@/utils/request";
// import { generateLineageTitle } from "@/utils";
import { loading } from "@/utils/layer";
import draggable from "vuedraggable";
import deleteDialog from "../ds/deleteDialog/deleteDialog";
import catalogDetail from "../common/catalogDetail";
import metadataDetail from "./metaDataSearchDetail";
import metaEdit from "./metadataBrowse/editDialog";

export default {
  name: "metadataSearch",
  components: {
    draggable,
    metadataDetail,
    deleteDialog,
    catalogDetail,
    metaEdit
  },
  data() {
    return {
      showShadow: false,
      // 是否显示 svg的血统分析图， false 默认不显示
      bSvgLineageIsShow: false,
      // svg item id
      sSvgItemId: null,
      oSvgItemObj: {
        id: '',
        code: '',
        classifierId: ''
      },

      // tree 部分的变量
      treeParams: {
        classifierId: "", // 元模型ID
        nearestRootId: "", // 最近的根节点ID
        nearestRootType: "", // 最近的根节点类型
        nodeId: this.nodeId, // 树节点Id
        nodeType: this.nodeType, // 节点类型
        viewId: "" // 视图ID
      },
      // 下拉搜索条件
      selectList: [],
      sNodeType: "",
      // 展示的组件
      showComponent: "metaEdit",
      // 显示模式是否展示代码
      bShowCode: true,
      treeLoading: true,
      // 表格数据加载过渡
      tableLoading: true,
      textarea: "",
      headerList: [
        {
          label: "元数据代码",
          prop: "code"
        },
        {
          label: "元数据名称",
          prop: "name"
        },
        {
          label: "元数据类型",
          prop: "classifierName"
        },
        {
          label: "上下文路径",
          prop: "context"
        }
      ],
      deleteDialog: false,
      // 搜索分类
      propSearch: "",
      // 右侧规则列表
      tableData: [],
      // 搜索关键字
      keyWord: "",
      keyword: "",
      total: 0,
      pageSize: 30,
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
      // 编辑显示
      bShowEdit: true,
      // 修改form表单
      oEditForm: {
        sType: "",
        sCode: "",
        sName: ""
      },
      // 修改form表单-验证
      rulesEdit: {
        sName: [
          { required: true, message: "请输入元数据名称", trigger: "blur" }
        ]
      },
      title: "编辑",
      aAddName: [],
      // 父节点路径信息
      aPath: [],
      // 当前新增的classifierId
      classifierId: "",
      // 当前新增的classifierName
      classifierName: "",
      // 当前选中的Tree节点classifierId
      sCurrentClassId: "",
      // 详情跳编辑返回时返回详情的判断
      showType: "",
      viewId: "",
      nodeData: "",
      // 传给编辑组件的参数
      formValue: null,
      // 树节点类型
      detailClassifier: "",
      analyzeBtn: false,
      SchemaId: "",
      // 导出按钮
      showExportBtn: true,
      showToolTip: true,
      treeData: null
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
    // 根据 EDGS的 metadataId查询 SVG itemId /md/asg/findItemId
    getSVGItemId (id) {
      get('/md/asg/findItemId', {
        metadataId: id
      }).then((res) => {
        parseAjaxResponse(res, () => {
          console.log(res, 'svg res')
          if (res.code === 10000 && res.success === true) {
            if (res.data) { // instanceId 对应 svg 有item id
              this.sSvgItemId = res.data
              this.bSvgLineageIsShow = true
            } else { // instanceId 对应 svg 无item id
              this.sSvgItemId = null
              this.bSvgLineageIsShow = false
            }
          }
        })
      })
    },

    resetTable() {
      this.pageCurrent = 1;
      this.pageSize = 30;
      this.keyword = "";
      this.propSearch = "";
    },
    // 详情页编辑事件
    showEdit(item, type) {
      this.selectArr = [];
      this.selectArr.push(item);
      this.showType = type;
      // this.showComponent = "metaEdit";
      this.handleEdit(type);
    },
    // 导出
    handleExoprt() {
      // downloadFile('/md/downTableUnderSchema', { instanceId: this.SchemaId })
      let load = loading("正在导出,请稍候...");
      downloadFile(
        "/md/downTableUnderSchema",
        { instanceId: this.SchemaId },
        () => {
          load.close();
        },
        () => {
          load.close();
        }
      );
    },
    // 获取表格数据
    getAllTableMsg() {
      // if (this.menuClassifierId !== "") {
      this.tableLoading = true;
      // console.log(this.menuClassifierId, 2);
      this.tableData = [];
      let params = {
        classifierId: this.nodeData.code, // Schema Table View
        nearestRootId: this.nodeData.nearestRootId,
        nearestRootIdType: this.nodeData.nearestRootType,
        pageCurrent: this.pageCurrent,
        pageSize: this.pageSize,
        keyword: this.keyword,
        keyname: this.propSearch
      };
      get("/md/listMdInfosByMetaModel", params).then(res => {
        // console.log(res.data)
        this.tableLoading = false;
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.selectList = res.extras.heard;
      });
    },
    // 搜索
    handleSearch() {
      this.keyword = this.keyWord;
      this.pageCurrent = 1;
      this.pageSize = 30;
      if (this.propSearch !== "") {
        this.getAllTableMsg();
      } else {
        this.$message.warning("请选择搜索分类！");
      }
    },
    // 头部 血缘分析
    handleBlood(command) {
      if (this.selectArr.length === 1) {
        let msg = this.selectArr[0];
        console.log(msg, '2222 msg');
        // 调用获取 SVG item id 的接口
        get('/md/asg/findItemId', {
          metadataId: msg.id
        }).then((res) => {
          parseAjaxResponse(res, () => {
            console.log(res, 'svg res')
            if (res.code === 10000 && res.success === true) {
              if (res.data) { // instanceId 对应 svg 有item id
                this.sSvgItemId = res.data
                this.bSvgLineageIsShow = true
              } else { // instanceId 对应 svg 无item id
                this.sSvgItemId = null
                this.bSvgLineageIsShow = false
              }
              if (this.sSvgItemId === null) {
                // 显示 EDGS 的 血缘分析图
                if (command === "showImpact") {
                  // console.log(this.selectArr)
                  this.showShadow = true
                  this.$router.push({
                    name: "impactAnalysisCanvas",
                    params: {
                      id: msg.id,
                      _title: msg.code,
                      classifierId: msg.classifierId,
                      bSvgLineageIsShow: this.bSvgLineageIsShow
                    }
                  });
                } else if (command === "showLineage") {
                  this.showShadow = true
                  this.$router.push({
                    name: "lineageAnalysisCanvas",
                    params: {
                      id: msg.id,
                      _title: msg.code,
                      classifierId: msg.classifierId,
                      bSvgLineageIsShow: this.bSvgLineageIsShow
                    }
                  });
                }
              } else {
                // 显示 svg 的 血缘分析图
                if (command === "showImpact") {
                  // console.log(this.selectArr)
                  this.$router.push({
                    name: "impactAnalysisCanvas",
                    params: {
                      id: this.sSvgItemId,
                      _title: msg.code,
                      classifierId: msg.classifierId,
                      bSvgLineageIsShow: this.bSvgLineageIsShow
                    }
                  });
                } else if (command === "showLineage") {
                  this.$router.push({
                    name: "lineageAnalysisCanvas",
                    params: {
                      id: this.sSvgItemId,
                      _title: msg.code,
                      classifierId: msg.classifierId,
                      bSvgLineageIsShow: this.bSvgLineageIsShow
                    }
                  });
                }
              }
            }
          })
        })
        // if (command === "showImpact") {
        //   // console.log(this.selectArr)
        //   this.$router.push({
        //     name: "impactAnalysisCanvas",
        //     params: {
        //       id: msg.id,
        //       _title: msg.code,
        //       classifierId: msg.classifierId
        //     }
        //   });
        // } else if (command === "showLineage") {
        //   this.$router.push({
        //     name: "lineageAnalysisCanvas",
        //     params: {
        //       id: msg.id,
        //       _title: msg.code,
        //       classifierId: msg.classifierId
        //     }
        //   });
        // }
      } else {
        this.$message.warning("请选择一条元数据!");
      }
    },
    // // 点击 table 中的 影响分析
    goToInfluencePage (item) {
      // 调用获取 SVG item id 的接口
      get('/md/asg/findItemId', {
        metadataId: item.id
      }).then((res) => {
        parseAjaxResponse(res, () => {
          console.log(res, 'svg res')
          if (res.code === 10000 && res.success === true) {
            if (res.data) { // instanceId 对应 svg 有item id
              this.sSvgItemId = res.data
              this.bSvgLineageIsShow = true
            } else { // instanceId 对应 svg 无item id
              this.sSvgItemId = null
              this.bSvgLineageIsShow = false
            }
            // svg 血缘分析图 需要的参数
            this.oSvgItemObj = {
              id: this.sSvgItemId,
              code: item.code,
              classifierId: item.classifierId
            }
            if (this.sSvgItemId === null) {
              // 显示 EDGS 的 血缘分析图
              this.goInfluence(item)
            } else {
              // 显示 svg 的 血缘分析图
              this.goInfluence(this.oSvgItemObj);
            }
          }
        })
      })
    },
    goInfluence(item) {
      this.showShadow = true
      this.$router.push({
        name: "impactAnalysisCanvas",
        params: {
          id: item.id,
          _title: item.code,
          classifierId: item.classifierId,
          bSvgLineageIsShow: this.bSvgLineageIsShow
        }
      });
    },
    // 点击 table 中的 血统分析
    goToBloodPage(item) {
      // 调用获取 SVG item id 的接口
      get('/md/asg/findItemId', {
        metadataId: item.id
      }).then((res) => {
        parseAjaxResponse(res, () => {
          console.log(res, 'svg res')
          if (res.code === 10000 && res.success === true) {
            if (res.data) { // instanceId 对应 svg 有item id
              this.sSvgItemId = res.data
              this.bSvgLineageIsShow = true
            } else { // instanceId 对应 svg 无item id
              this.sSvgItemId = null
              this.bSvgLineageIsShow = false
            }
            // svg 血缘分析图 需要的参数
            this.oSvgItemObj = {
              id: this.sSvgItemId,
              code: item.code,
              classifierId: item.classifierId
            }
            if (this.sSvgItemId === null) {
              // 显示 EDGS 的 血缘分析图
              this.goBlood(item)
            } else {
              // 显示 svg 的 血缘分析图
              this.goBlood(this.oSvgItemObj);
            }
          }
        })
      })
    },
    goBlood(item) {
      this.showShadow = true
      this.$router.push({
        name: "lineageAnalysisCanvas",
        params: {
          id: item.id,
          _title: item.code,
          classifierId: item.classifierId,
          bSvgLineageIsShow: this.bSvgLineageIsShow
        }
      });
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getAllTableMsg();
    },
    handleSizeChange(val) {
      this.pageCurrent = 1;
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
    // 视图切换 触发事件
    changeView(val) {
      console.log(this.firstNode, "fristNode");
      console.log(val);
      this.resetTreeParams();
      this.viewId = val;
      this.treeParams.viewId = val;
      this.treeParams.nodeType = "view";
      this.firstNode.childNodes = [];
      this.loadNode(this.firstNode, this.firstResolve);
    },
    // 跳到详情页
    toDetail(item) {
      console.log(item, 'toDetail 333');
      // item.nodeType = this.treeData.nodeType
      console.log(this.treeData);
      this.showComponent = "metadataDetail";
      this.$refs.metadataDetail.handleNodeClick(item);
      // 调用获取 SVG item id 的接口
      this.$refs.metadataDetail.getSVGItemId(item.id);

      // this.selectArr = [];
      // this.$refs.SelectTable.clearSelection();
      // console.log(item);
      // this.showComponent = "metadataDetail";
      // this.$refs.metadataDetail.getAllMsg(
      //   item.id,
      //   item.code,
      //   item.classifierId,
      //   item
      // );
    },
    // 展示主页面
    showMain(val) {
      this.getAllTableMsg();
      console.log(val, "aa");
      this.showComponent = "main";
    },
    resetTreeParams() {
      this.treeParams = {
        classifierId: "", // 元模型ID
        nearestRootId: "", // 最近的根节点ID
        nearestRootType: "", // 最近的根节点类型
        nodeId: "", // 树节点Id
        nodeType: "", // 节点类型
        viewId: "" // 视图ID
      };
    },
    // 懒加载树
    loadNode(node, resolve) {
      console.log(node, "000");
      this.node = node;
      if (node.data) {
        this.resetTreeParams();
        if (node.data.nodeType === "view") {
          this.treeParams.viewId = node.data.id;
          this.treeParams.nodeType = node.data.nodeType;
        } else if (node.data.nodeType === "folder") {
          this.treeParams.viewId = this.viewId;
          this.treeParams.nodeType = node.data.nodeType;
          this.treeParams.nodeId = node.data.id;
        } else if (node.data.nodeType === "metaModel") {
          // this.treeParams.parentModelCode = node.data.parentId
          if (node.parent.data && node.parent.data.nodeType === "metaModel") {
            this.treeParams.parentModelCode = node.parent.data.code;
          }
          this.treeParams.nodeType = node.data.nodeType;
          this.treeParams.nearestRootId = node.data.nearestRootId;
          this.treeParams.nearestRootType = node.data.nearestRootType;
          this.treeParams.classifierId = node.data.code;
        } else {
          this.treeParams.nodeType = node.data.nodeType;
          this.treeParams.nodeId = node.data.id;
        }
      }
      this.resolve = resolve;
      if (node.level === 0) {
        console.log("level 0");
        this.firstNode = node;
        this.firstResolve = resolve;
        //  获取视图下拉
        if (this.viewId === "") {
          get("/md/listOwnViewsForSelect").then(response => {
            console.log(response, "view");
            this.viewList = response.data;
            let str = JSON.stringify(response.data);
            if (str.includes("true")) {
              response.data.map(item => {
                if (item.defaultShow) {
                  this.value = item.name;
                  this.treeParams.viewId = item.id;
                  this.treeParams.nodeType = "view";
                }
              });
            } else {
              response.data.map(item => {
                console.log(item);
                if (item.name === "系统视图" || item.id === "0") {
                  this.value = item.name;
                  this.treeParams.viewId = item.id;
                  this.treeParams.nodeType = "view";
                }
              });
            }
            // this.treeParams = Object.assign({}, this.treeParams);
            get("/md/listTree", this.treeParams).then(res => {
              if (res.code === 10000 && res.success && res.success === true) {
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
          });
        } else {
          get("/md/listTree", this.treeParams).then(res => {
            if (res.code === 10000 && res.success && res.success === true) {
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
      } else {
        console.log("level !0");
        get("/md/listTree", this.treeParams).then(res => {
          if (res.success && res.code === 10000 && res.success) {
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
    // 自定义tree 图标 文字
    renderContent(h, params) {
      let sText = params.data.name;
      let iconType = "";
      if (params.data.nodeType === "metadata") {
        iconType = "icon icon-" + params.data.classifierId;
        sText = this.bShowCode === true ? params.data.code : params.data.name;
      } else if (params.data.nodeType === "metaModel") {
        // sText = this.bShowCode === true ? params.data.code : params.data.name;
        // iconType = "icon icon-" + params.data.code;
        sText =
          this.bShowCode === true
            ? params.data.classifierId
              ? params.data.classifierId
              : params.data.code
            : params.data.name;
        if (params.data.classifierId === "Database" || params.data.classifierId === "Schema") {
          iconType = "icon icon-metaModel";
        } else {
          iconType = "icon icon-" + params.data.code;
        }
      } else {
        iconType = "icon icon-" + params.data.nodeType;
      }
      if (params.data.nodeType === "class") {
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
              float: "left"
            }
          }),
          h("span", sText)
        ]
      );
      // },
      // 获取视图切换下拉
      // getViewList() {
      //   this.treeLoading = true;
      //   get("/md/listOwnViewsForSelect").then(res => {
      //     console.log(res, "view");
      //     this.viewList = res.data;
      //     let str = JSON.stringify(res.data);
      //     if (str.includes("true")) {
      //       console.log(str);
      //       res.data.map(item => {
      //         console.log(item);
      //         if (item.defaultShow) {
      //           this.value = item.name;
      //           this.treeParams.viewId = item.id;
      //           this.treeParams.nodeType = "view";
      //         }
      //       });
      //     } else {
      //       this.value = "系统视图";
      //     }
      //     setTimeout(() => {
      //       this.firstNode.childNodes = [];
      //       this.loadNode(this.firstNode, this.firstResolve);
      //       this.treeLoading = false;
      //     }, 500);
      //   });
    },
    /**  tree  树操作    **/
    handleNodeClick(data, node, component) {
      console.log(data.code);
      console.log(data.nodeType, '11111');
      this.treeData = data;
      // console.log(node)
      if (data.code === "Schema") {
        this.showExportBtn = true;
        this.SchemaId = data.id;
      } else {
        this.showExportBtn = false;
      }
      if (data.nodeType === "metaModel") {
        if (
          data.code === "Table" ||
          data.code === "Schema" ||
          data.code === "View" ||
          data.code === "Column"
        ) {
          this.analyzeBtn = true;
        } else {
          this.analyzeBtn = false;
        }
      } else {
        this.analyzeBtn = false;
      }
      if (data.nodeType === "view") {
        this.viewId = data.id;
      }
      this.showComponent = "main";
      this.resetTable();
      console.log(data);
      this.nodeData = data;
      this.sNodeType = data.nodeType;
      if (data.nodeType === "metaModel") {
        this.getAllTableMsg();
      } else {
        this.tableData = [];
      }
      if (this.aPath.length === 0) {
        this.aPath.push(data.name);
      } else {
        let hasNane = false;
        this.aPath.forEach(i => {
          if (i === data.name) {
            hasNane = true;
          }
        });
        if (hasNane === false) {
          this.aPath.push(data.name);
        }
      }
    },
    //   xz
    // 点击返回按钮
    goReturn() {
      if (this.showType) {
        this.showComponent = this.showType;
      } else {
        this.showComponent = "main";
      }
      this.bShowEdit = false;
      this.showType = "";
      if (this.title === "新增") {
        this.$refs["oAddForm"].resetFields();
      } else {
        this.$refs["oEditForm"].resetFields();
      }
    },
    // 点击保存按钮
    goSave() {
      this.$refs.oEditForm.validate(valid => {
        if (valid) {
          // this.save('editMetadata')
          let params = {
            FROM_CLASSIFIER_ID: this.sCurrentClassId
          };
          params.instanceCode = this.oEditForm.sCode;
          params.instanceName = this.oEditForm.sName;
          params.instanceId = this.sCurrentId;
          params.classifierId = this.selectArr[0].classifierId;
          if (this.aAddName.length !== 0) {
            this.aAddName.forEach(i => {
              if (i.datatypeId === "time") {
                i.value = i.value.Format("yyyy-MM-dd");
              }
              params[i.attStore] = i.value;
            });
          }
          console.log(params);
          post("/md/editMetadata", params).then(res => {
            if (res.code === 10000 && res.success === true) {
              this.$message.success(res.message);
              this.node.childNodes = [];
              this.loadNode(this.node, this.resolve);
              this.sNodeType = "";
              this.bShowEdit = false;
              this.bAdd = true;
              this.aPath = [];
              this.sCurrentId = "";
              this.sCurrentClassId = "";
              // this.showComponent = 'main'
              if (this.showType) {
                let item = this.selectArr[0];
                console.log(this.selectArr);
                this.$refs.metadataDetail.getAllMsg(
                  item.id,
                  item.code,

                  item.classifierId,
                  item
                );
                this.showComponent = this.showType;
              } else {
                this.showComponent = "main";
              }
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          this.$message.error("请按以下规则填写信息");
        }
      });
    },
    goEdit(val, item) {
      // console.log(val, item, '55')
      this.selectArr = [];
      this.selectArr.push(item);
      this.handleEdit(val);
    },
    // 编辑
    handleEdit(type) {
      console.log(type);
      console.log(this.selectArr);
      if (this.selectArr.length === 1) {
        this.sCurrentId = this.selectArr[0].id;
        get("/md/getMetadataWhenEdit/" + this.selectArr[0].id).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.showComponent = "metaEdit";
            this.formValue = res.data;
            this.formValue.type = type;
            console.log(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        this.$message.warning("请选择一条元数据进行编辑！");
      }
    },
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
    // 编辑保存后  组件显示隐藏
    changeComponentShow(val) {
      this.selectArr = [];
      if (val === "main") {
        this.getAllTableMsg();
      } else if (val === "metadataDetail") {
        this.$refs.metadataDetail.getMsg();
      }
    },
    backChangeShow(val) {
      this.showComponent = val;
      // this.selectArr = []
    }
  },
  activated() {
    this.showShadow = false
  },
  created() {
    this.showShadow = false
    this.showComponent = "main";
    // this.getViewList();
    if (this.$route.params.classifierId !== undefined) {
      this.showCommonDetail();
      this.$nextTick(() => {
        this.$refs.commonDetail.getAllMsg(this.$route.params.id);
      });
    }
  }
};
</script>

<style lang="scss">
/* @import "../../../../styles/treeIcon.scss"; */
@import "../../styles/switch";
/* @import "../../../../styles/treeIconScoped"; */
</style>
<style lang="scss" scoped>
//外层card容器样式;
@import "./../../styles/dq/main-card-table.scss";
@import "./../../styles/treeIconScoped";
@import "./../../styles/switch";
$color-grey-light: #e0e0e0;
$border: #ebeef5;
.el-main {
  overflow: hidden;
}
.mateData-container {
  padding: 15px;
  height: 100%;
  .resize:hover {
    cursor: e-resize;
  }
  /deep/ .el-table {
    font-size: 12px;
    height: 100%;
    .preview,
    .blood2,
    .anaalysis2,
    .editor {
      width: 22px;
      height: 22px;
    }
  }
  /deep/ .tree-node {
    line-height: 20px;
    overflow: hidden;
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
    // .header {
    //   border-bottom: 1px solid $color-grey-light;
    //   display: flex;
    //   position: relative;
    //   height: 35px;
    //   padding: 4px 0 8px;
    .title {
      position: relative;
      font-size: 16px;
      border-bottom: 1px solid $border;
      padding: 0 10px 10px 10px;
      font-weight: bold;
      line-height: 26px;
      .el-switch {
        position: absolute;
        right: 10px;
        top: 0px;
        .el-switch__label--left {
          left: 26px;
        }
        .el-switch__label--right {
          left: 0;
        }
      }
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
    // }
    .footer {
      position: absolute;
      // bottom: 15px;
      bottom: 3px;
      border-top: 1px solid $color-grey-light;
      display: flex;
      width: calc(100% - 20px);
      padding-top: 10px;
      background: #fff;
      .title {
        margin: 0;
        border: unset;
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
  .nodata {
    width: 200px;
    height: 200px;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
  }
  .el-card {
    height: calc(100vh - 115px);
    .el-card__body {
      .card-header {
        display: flex;
        border-bottom: 1px solid $color-grey-light;
        padding: 4px 0 8px;
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
          bottom: 3px;
          margin-right: 6px;
        }
        .el-breadcrumb {
          font-size: 16px;
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
      .no-data {
        width: 100%;
        height: 100%;
      }
      .card-button {
        // margin-left: 20px;
        // margin-top: 15px;
        /deep/ .el-form-item__label {
          line-height: 30px;
        }
        /deep/ .el-form-item__content {
          line-height: 30px;
        }
        .el-dropdown {
          margin: 0 10px;
          // bottom: 3px;
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
        height: calc(100% - 90px);
        margin-top: 20px;
        /deep/ .tableClass {
          border-right: none !important;
        }
        /deep/ .preview {
          width: 22px;
          height: 22px;
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
}
// .el-dropdown-menu.el-popper {
//   // padding: 6px 0;
//   .el-dropdown-menu__item {
//     line-height: 32px !important;
//     padding: 0px 15px !important;
//     margin: 0 !important;
//     height: 32px !important;
//   }
// }
.tree-box {
  margin-top: 5px;
}
.tag-box {
  line-height: 32px;
}
.meta-btn {
  height: 34px;
  width: 85px;
  padding: 0 15px 0 35px;
  position: relative;
  span {
    display: block;
    padding-left: 20px;
  }
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
  background: url(../../../src/assets/images/commonIcon/blood-icon.png)
    no-repeat;
  background-size: 100%;
  display: block;
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
.left_tree /deep/ .el-switch__label--left {
  left: 25px;
}
.left_tree /deep/ .el-switch__label--right {
  left: -2px;
}

.meta-edit {
  padding: 18px;
  position: relative;
  height: calc(100vh - 120px);
  .edit-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $border;
    padding-bottom: 10px;
    span {
      display: inline-block;
    }
    div {
      display: inline-block;
    }
  }
  .md-form {
    margin-top: 15px;
    width: 100%;
    height: calc(100vh - 230px);
    overflow-y: auto;
  }
  .md-fotter {
    border-top: 1px solid $border;
    position: absolute;
    bottom: 0;
    width: 100%;
    font-size: 14px;
    background: #fff;
    padding: 15px 10px;
    color: #515a6e;
  }
}
/deep/ .el-dialog__wrapper .el-dialog {
  width: 50%;
}
/deep/ .pathBottom {
  bottom: -57px !important;
}
.md_search {
  .el-dropdown-menu__item {
    padding: 0;
    text-align: center;
    width: 80px;
  }
}
</style>
