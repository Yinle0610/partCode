<template>
  <div class="metadata-browse tableNoPadding">
    <div class="content-box">
      <!-- <el-container>
      <el-main>-->
      <div v-show="showComponent === 'main'" class="right-box">
        <el-card shadow="hover">
          <!-- <div v-if="sNodeType !== 'metadata'" class="no-data"></div>-->
          <div v-if="!bShowEdit&&!bshowDeltail">
            <div class="card-header">
              <el-button size="small" @click="toChangeParentShow">返回</el-button>
            </div>
            <!-- <i class="el-icon-location-outline"></i>
                  <el-breadcrumb separator="/">
                    <el-breadcrumb-item
                      v-for="(item, index) in Breadcrumb"
                      :key="index"
                      @click.native="toClickBreadcrumb(item)"
                    >{{item.text ? item.text : item.name}}</el-breadcrumb-item>
            </el-breadcrumb>-->
            <!-- </div> -->
            <div class="card-button">
              <el-button
                @click="goEdit('main')"
                type="warning"
                size="mini"
                class="xiugai"
                v-permission="'MD_SEARCH_EDIT'"
              >
                <svg-icon icon-class="xiugai"></svg-icon>
                <span class="text">编辑</span>
              </el-button>
              <!-- <el-button @click="handleExoprt" v-if="showExportBtn" v-permission="'MD_EXPORT'" type="primary" size="mini" class="xiugai">
                    <svg-icon icon-class="xiazai"></svg-icon>
                    <span class="text">导出</span>
              </el-button>-->
              <el-dropdown @command="handleBlood" v-if="bShowBtn" v-permission="'MD_ANALYSIS'">
                <el-button
                  class="basic-button"
                  style="width: 80px;
                      padding: 0px 15px 0px 25px;
                      height: 30px;"
                  type="primary"
                >
                  <i class="dataTable-icon blood"></i>血缘
                  <!-- <svg-icon icon-class="xian"></svg-icon>
                  <svg-icon icon-class="more"></svg-icon> -->
                </el-button>
                <el-dropdown-menu slot="dropdown" trigger="click" class="metadataAnalyze">
                  <el-dropdown-item :command="'anaalysis'">影响分析</el-dropdown-item>
                  <el-dropdown-item :command="'blood'">血统分析</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <el-tabs v-model="sActiveTab" @tab-click="tabClick" style="margin-top:15px;">
              <el-tab-pane label="元数据信息" name="first">
                <div class="metadata-info">
                  <metadataInfo :oBaseInfo="oBaseInfo" :oAttsinfo="oAttsinfo"></metadataInfo>
                </div>
              </el-tab-pane>
              <el-tab-pane
                v-for="(item,index) in aTabsTitle"
                :label="showTabName(item)"
                :key="index"
                :classifierId="item.classifierId"
                :relateType="item.relateType"
              >
                <div
                  v-if="title.id !== 'metaInfo'&&title.id !== 'relateTable'&&title.id !== 'relateColumn'"
                  class="md-content"
                >
                  <div class="child-search clearfix">
                    <el-form style="float:right;" inline>
                      <el-form-item class="search-keyword" style="margin-right:10px;">
                        <el-select
                          v-model="searchForm.propSearch"
                          placeholder="请选择搜索分类"
                          size="small"
                        >
                          <el-option
                            :label="item.label"
                            :value="item.prop"
                            v-for="item in selectList"
                            :key="item.prop"
                            align="center"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item style="margin-right:0px;">
                        <el-input
                          v-model="searchForm.keyword"
                          @keyup.enter.native="handleSearch"
                          placeholder="请输入内容..."
                          onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
                          size="small"
                          clearable
                        >
                          <i slot="suffix" class="el-icon-search" @click="handleSearch"></i>
                        </el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div class="card-table" v-loading="searchForm.bLoading">
                    <el-table
                      border
                      show-header
                      :data="aRelationTableData"
                      :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                      :cell-style="{padding:'0'}"
                      style="width: 100%"
                      v-if="!searchForm.bLoading"
                      class="tableScorll"
                    >
                      <el-table-column
                        v-for="item in aRelationTableHeaders"
                        sortable
                        :prop="item.prop === 'instanceCode'?'instanceCode':item.prop"
                        :show-overflow-tooltip="item.label==='存储过程内容'&&showToolTip?false:true"
                        :key="item.prop"
                        :label="item.label"
                        :width="item.label==='存储过程内容'?560:''"
                      >
                        <template slot-scope="scope">
                          <a
                            class="a-color"
                            v-if="item.prop === 'instanceCode'"
                            @click="clickToMetaDetails(scope.row.instanceId, scope.row.classifierId, scope.row.instanceName)"
                          >{{scope.row.instanceCode}}</a>
                          <p
                            v-else-if="item.label==='存储过程内容'"
                            class="overHidden"
                          >{{scope.row[item.prop]}}</p>
                          <p v-else v-html="scope.row[item.prop]"></p>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" align="center" width="160">
                        <template slot-scope="scope">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="详情"
                            placement="bottom"
                            :enterable="false"
                          >
                            <el-button type="text" @click="goDetail(scope.row)">
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
                            v-permission="'MD_ANALYSIS'"
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
                            v-permission="'MD_ANALYSIS'"
                            v-if="scope.row.classifierId==='Table'||scope.row.classifierId==='Schema'||scope.row.classifierId==='View'||scope.row.classifierId==='Column'"
                          >
                            <el-button type="text" size="small" @click="goToAncestryPage(scope.row)">
                              <svg-icon icon-class="blood2" class="blood2"></svg-icon>
                            </el-button>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div style="text-align: center;margin-top:8px;">
                    <el-pagination
                      background
                      v-show="searchForm.total>0"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="searchForm.current"
                      :page-sizes="[10, 20, 30, 40]"
                      :page-size="searchForm.size"
                      layout="total, sizes, prev, pager, next"
                      :total="searchForm.total"
                    ></el-pagination>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <!-- 详情 -->
          <div v-if="bshowDeltail" class="deltail-box">
            <div class="deltail-header">
              <el-button size="small" @click="bshowDeltail=false">返回</el-button>
            </div>
            <div class="deltail-body clearfix">
              <div class="card-button">
                <el-button
                  @click="goEdit('bshowDeltail')"
                  type="warning"
                  size="mini"
                  class="xiugai"
                  v-permission="'MD_SEARCH_EDIT'"
                >
                  <svg-icon icon-class="xiugai"></svg-icon>
                  <span class="text">编辑</span>
                </el-button>
                <el-dropdown
                  @command="handleBlood2"
                  v-if="this.detailClassifier==='Table'||this.detailClassifier==='Schema'||this.detailClassifier==='View'||this.detailClassifier==='Column'"
                  v-permission="'MD_ANALYSIS'"
                >
                  <el-button
                    class="basic-button"
                    style="width: 80px;
                          padding: 0px 15px 0px 25px;
                          height: 30px;"
                    type="primary"
                  >
                    <i class="dataTable-icon blood"></i>血缘
                    <!-- <svg-icon icon-class="xian"></svg-icon>
                    <svg-icon icon-class="more"></svg-icon> -->
                  </el-button>
                  <el-dropdown-menu slot="dropdown" trigger="click" class="metadataAnalyze">
                    <el-dropdown-item :command="'anaalysis'">影响分析</el-dropdown-item>
                    <el-dropdown-item :command="'blood'">血统分析</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <div v-show="detailClassifier === 'Table'" class="quality-rate">
                  <span class="quality-rate_label">质量评分：</span>
                  <el-rate v-model="qualityValue" disabled text-color="#ff9900"></el-rate>
                </div>
              </div>
              <div class="deltail-list">
                <el-tabs v-model="sActiveTab2" @tab-click="tabClick2" style="margin-top:15px;">
                  <el-tab-pane label="元数据信息" name="first">
                    <div class="metadata-info">
                      <metadataInfo :oBaseInfo="oBaseInfo2" :oAttsinfo="oAttsinfo2"></metadataInfo>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane
                    v-for="(item, index) in aTabsTitle2"
                    :label="showTabName(item)"
                    :key="index"
                    :classifierId="item.classifierId"
                    :relateType="item.relateType"
                  >
                    <div
                      v-if="title.id !== 'metaInfo'&&title.id !== 'relateTable'&&title.id !== 'relateColumn'"
                      class="md-content"
                    >
                      <div class="child-search clearfix">
                        <el-form style="float:right;" inline>
                          <el-form-item class="search-keyword" style="margin-right:10px;">
                            <el-select
                              v-model="searchForm2.propSearch"
                              placeholder="请选择搜索分类"
                              size="small"
                            >
                              <el-option
                                :label="item.label"
                                :value="item.prop"
                                v-for="item in selectList"
                                :key="item.prop"
                                align="center"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item style="margin-right:0px;">
                            <el-input
                              v-model="searchForm2.keyword"
                              @keyup.enter.native="handleSearch2"
                              placeholder="请输入内容..."
                              onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
                              size="small"
                              clearable
                            >
                              <i slot="suffix" class="el-icon-search" @click="handleSearch2"></i>
                            </el-input>
                          </el-form-item>
                        </el-form>
                      </div>
                      <div class="card-table" v-loading="searchForm2.bLoading">
                        <el-table
                          border
                          show-header
                          :data="aRelationTableData2"
                          :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                          :cell-style="{padding:'0'}"
                          style="width: 100%"
                          v-if="!searchForm2.bLoading"
                          class="tableScorll"
                        >
                          <el-table-column
                            v-for="item in aRelationTableHeaders2"
                            sortable
                            :prop="item.prop === 'instanceCode'?'instanceCode':item.prop"
                            :show-overflow-tooltip="item.label==='存储过程内容'&&showToolTip?false:true"
                            :key="item.prop"
                            :label="item.label"
                            :width="item.label==='存储过程内容'?560:''"
                          >
                            <template slot-scope="scope">
                              <a
                                class="a-color"
                                v-if="item.prop === 'instanceCode'"
                                @click="clickToMetaDetails(scope.row.instanceId, scope.row.classifierId, scope.row.instanceName)"
                              >{{scope.row.instanceCode}}</a>
                              <p
                                v-else-if="item.label==='存储过程内容'"
                                class="overHidden"
                              >{{scope.row[item.prop]}}</p>
                              <p v-else v-html="scope.row[item.prop]"></p>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                      <div style="text-align: center;margin-top:8px;">
                        <el-pagination
                          background
                          v-show="searchForm2.total>0"
                          @size-change="handleSizeChange2"
                          @current-change="handleCurrentChange2"
                          :current-page="searchForm2.current"
                          :page-sizes="[10, 20, 30, 40]"
                          :page-size="searchForm2.size"
                          layout="total, sizes, prev, pager, next"
                          :total="searchForm2.total"
                        ></el-pagination>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div v-show="showComponent === 'metaEdit'" class="meta-edit">
        <meta-edit
          @changeComponentShow="changeComponentShow"
          @changeShow="backChangeShow"
          :formValue="formValue"
        ></meta-edit>
      </div>
      <!-- </el-main> -->
      <!-- </el-container> -->
    </div>
  </div>
</template>

<script>
// 元数据信息下的2个table的组件 元数据详情页也会用到
import MetadataInfo from "@/components/Metadata/MetadataInfo";
import { mapGetters } from "vuex";
import { get, post, parseAjaxResponse, downloadFile } from "@/utils/request";
import { loading } from "@/utils/layer";
import DataList from "@/components/Metadata/DataList";
import Pagination from "@/components/Pagination";
import MetadataInfoList from "./metadataSearch/metaCollapse";
import metaEdit from "./metadataBrowse/editDialog";

export default {
  name: "metadataBrowse",
  components: {
    MetadataInfo,
    DataList,
    Pagination,
    MetadataInfoList,
    metaEdit
  },
  data() {
    return {
      // 是否显示 svg的血统分析图， false 默认不显示
      bSvgLineageIsShow: false,
      // svg item id
      sSvgItemId: null,
      sSvgItemId2: null,
      oSvgItemObj: {
        id: '',
        code: '',
        classifierId: ''
      },

      // 显示的组件
      showComponent: "main",
      // 质量评分
      qualityValue: 3.6,
      Breadcrumb: [{ name: "全部", isDisabled: true }], // 右侧面包屑数组
      // 显示模式是否展示代码
      bShowCode: true,
      // 搜索框数据
      sKeyword: "",
      // 视图切换下拉框数据
      aViewData: [],
      // 视图切换下拉框选中项
      sViewId: null,
      props: {
        label: "text",
        children: "children",
        isLeaf: "isLeaf"
      },
      // 是否显示新增或修改的form表单
      bShowEdit: false,
      // 详情页是否显示
      bshowDeltail: false,
      // tabs当前选中项
      sActiveTab: "first",
      sActiveTab2: "first",
      // 新增按钮的下拉框数据
      aMetaDataType: [],
      // 元数据信息-基本信息
      oBaseInfo: {
        aTableData: [],
        bLoading: false
      },
      oBaseInfo2: {
        aTableData: [],
        bLoading: false
      },
      // 元数据信息-属性信息
      oAttsinfo: {
        aTableData: [],
        bLoading: false
      },
      // 元数据信息-属性信息
      oAttsinfo2: {
        aTableData: [],
        bLoading: false
      },
      // 元数据信息-属性信息
      childInfos: {
        aTableData: [],
        bLoading: true
      },
      // 元数据信息-属性信息
      childInfos1: {
        aTableData: [],
        bLoading: true
      },
      // 元数据信息-属性信息
      problems: {
        aTableData: [],
        bLoading: true
      },
      // 元数据信息-属性信息
      problems1: {
        aTableData: [],
        bLoading: true
      },
      // 元数据信息-属性信息
      relStandards: {
        aTableData: [],
        bLoading: true
      },
      // 元数据信息-属性信息
      relStandards1: {
        aTableData: [],
        bLoading: true
      },
      // 新增form表单
      oAddForm: {
        sType: "",
        sCode: "",
        sName: ""
      },
      // 新增form表单-验证
      rulesAdd: {
        sCode: [
          { required: true, message: "请输入元数据代码：", trigger: "blur" }
        ],
        sName: [
          { required: true, message: "请输入元数据名称：", trigger: "blur" }
        ]
      },
      // 修改form表单
      oEditForm: {
        sType: "",
        sCode: "",
        sName: ""
      },
      // 修改form表单-验证
      rulesEdit: {
        sName: [
          { required: true, message: "请输入元数据名称：", trigger: "blur" }
        ]
      },
      node: [],
      resolve: [],
      isMore: false, // 查看更多 flag
      treeCurrentPage: 1,
      // 当前选中的Tree节点数据类型
      sNodeType: "",
      // tabs标题数据
      aTabsTitle: [],
      aTabsTitle2: [],
      // 当前选中的Tree节点id
      sCurrentId: "",
      // 查看详情时的classifierId
      sCurrentClassId: "",
      // 除元数据信息以外的选项列表数据
      oList: {
        bLoading: false,
        aList: [],
        iCurrentPage: 1,
        iCurrentSize: 10,
        iTotal: 0
      },
      // 除元数据信息以外的当前选中的标题类型
      sTabClassifierId: "",
      // 新增或修改title
      title: "新增",
      // 是否是新增form表单
      bAdd: true,
      // 新增或修改Form表单里的属性数据
      aAddName: [],
      // 父节点路径信息
      aPath: [],
      // 当前选中的Tree节点classifierId
      // 详情记录
      detailClassifier: null,
      detailId: null,
      detailItem: null,
      // 当前元数据的code
      sCode: "",
      // 是否显示血统分析等按钮
      bShowBtn: false,
      // 相关表和相关字段
      idTabAndCol: "",
      classifierIdTabAndCol: "",
      keyWordTabAndCol: "",
      aRelationTableData: [],
      aRelationTableData2: [],
      aRelationTableData1: [],
      aRelationTableHeaders: [],
      aRelationTableHeaders2: [],
      searchForm: {
        // 当前元数据数据
        classifierId: "",
        relateType: "",
        roleId: "",
        total: 0,
        current: 1,
        size: 30,
        keyword: "",
        bLoading: false,
        propSearch: null
      },
      searchForm2: {
        // 相关元数据数据
        classifierId: "",
        relateType: "",
        roleId: "",
        total: 0,
        current: 1,
        size: 30,
        keyword: "",
        bLoading: false,
        propSearch: null
      },
      oRelationTablePagination: {
        total: 0,
        icurrentPage: 1,
        ipageSize: 30
      },
      aRelationFiledData: [],
      aRelationFiledHeaders: [],
      oRelationColumnPagination: {
        total: 0,
        icurrentPage: 1,
        ipageSize: 30
      },
      isShowRelationColumnTab: "",
      isShowRelationTableTab: "",
      selectList: [
        {
          prop: "name",
          label: "元数据名称"
        },
        {
          prop: "code",
          label: "元数据代码"
        }
      ],
      // 传给编辑组件的参数
      formValue: null,
      nData: "",
      firstNode: [],
      aIsExpandedArr: [],
      type: "",
      row: "",
      // 导出按钮
      showExportBtn: true,
      SchemaId: "",
      showToolTip: true,
      count: 0,
      showToopTip: true
    };
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
    getSVGItemId2(id) {
      get('/md/asg/findItemId', {
        metadataId: id
      }).then((res) => {
        parseAjaxResponse(res, () => {
          console.log(res, 'svg res')
          if (res.code === 10000 && res.success === true) {
            if (res.data) { // instanceId 对应 svg 有item id
              this.sSvgItemId2 = res.data
              this.bSvgLineageIsShow = true
            } else { // instanceId 对应 svg 无item id
              this.sSvgItemId2 = null
              this.bSvgLineageIsShow = false
            }
          }
        })
      })
    },
    toChangeParentShow() {
      this.bshowDeltail = false;
      this.$emit("changeShow", "main");
    },
    // 左边拖拽事件
    dragControllerDiv(e) {
      let width = document.getElementsByClassName("el-container")[0]
        .clientWidth;
      let remove = document.getElementsByClassName("resize");
      let c = e.clientX - remove[0].offsetLeft;
      let left = document.getElementsByClassName("leftdiv");
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
    // 面包屑点击事件
    toClickBreadcrumb(item) {
      // console.log(this.firstNode)
      this.searchNode(this.firstNode, item.id);
      if (item.notetype === "view") {
        this.nodeId = "";
      } else {
        this.nodeId = item.id;
      }
      this.getTableDataList();
      this.aIsExpandedArr = [];
      this.aIsExpandedArr.push(item.id);
      // 设置默认节点高亮
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
    refreshLazyTree(node) {
      console.log(node, "66");
      let params = {};
      if (node.data) {
        params = {
          nodeType: node.data.nodeType,
          viewId: this.sViewId,
          current: this.treeCurrentPage
        };
        if (node.data.nodeType === "metaModel") {
          params.classifierId = node.data.classifierId;
          params.parentId = node.data.parentNodeId;
        } else {
          params.id = node.data.id;
        }
      } else {
        params = {
          viewId: this.sViewId
        };
      }
      get("/md/tree", params).then(res => {
        if (res.success && res.code === 10000 && res.success) {
          const list = res.data.map(item => {
            item.isLeaf = item.leaf;
            return item;
          });
          node.childNodes = [];
          node.doCreateChildren(list);
          // this.$nextTick(() => {
          if (this.noSonTree) {
            // console.log('setHightLight')
            // this.aIsExpandedArr = [];
            // this.aIsExpandedArr.push(this.noSonTree.data.id);
            // 设置默认节点高亮
            this.$refs.tree.setCurrentKey(this.noSonTree.data.id);
          } else {
            // this.aIsExpandedArr = [];
            // this.aIsExpandedArr.push(node.data.id);
            // 设置默认节点高亮
            this.$refs.tree.setCurrentKey(node.data.id);
          }
          // });
        }
      });
      //   console.log(res)
      // }
    },
    // 元数据编辑
    handleEdit() {},
    // 当前血缘点击时间
    handleBlood(command) {
      if (command === "anaalysis") {
        if (this.sSvgItemId === null) {
          // 显示 EDGS 的 血缘分析图
          this.goInfluence(this.sCurrentId, this.sCode);
        } else {
          // 显示 svg 的 血缘分析图
          this.goInfluence(this.sSvgItemId, this.sCode);
        }
      } else if (command === "blood") {
        if (this.sSvgItemId === null) {
          // 显示 EDGS 的 血缘分析图
          this.goAncestry(this.sCurrentId, this.sCode);
        } else {
          // 显示 svg 的 血缘分析图
          this.goAncestry(this.sSvgItemId, this.sCode)
        }
      }
    },
    // 相关血缘点击事件
    // handleBlood2(command) {
    //   if (command === "anaalysis") {
    //     this.goInfluence2(this.detailItem);
    //   } else if (command === "blood") {
    //     this.goAncestry2(this.detailItem);
    //   }
    // },
    handleBlood2(command) {
      // svg 血缘分析图 需要的参数
      this.oSvgItemObj = {
        instanceId: this.sSvgItemId2,
        instanceCode: this.detailItem.instanceCode,
        classifierId: this.detailItem.classifierId
      }

      if (command === "anaalysis") {
        if (this.sSvgItemId2 === null) {
          // 显示 EDGS 的 血缘分析图
          this.goInfluence2(this.detailItem);
        } else {
          // 显示 svg 的 血缘分析图
          this.goInfluence2(this.oSvgItemObj);
        }
      } else if (command === "blood") {
        if (this.sSvgItemId2 === null) {
          // 显示 EDGS 的 血缘分析图
          this.goAncestry2(this.detailItem);
        } else {
          this.goAncestry2(this.oSvgItemObj);
        }
      }
    },
    // 搜索
    handleSearch() {
      this.searchForm.bLoading = true;
      this.searchForm.total = 0;
      this.searchForm.current = 1;
      this.getTableDataList();
    },
    // 搜索
    handleSearch2() {
      this.searchForm2.bLoading = true;
      this.searchForm2.total = 0;
      this.searchForm2.current = 1;
      this.getTableDataList2();
    },
    // 获取元数据详情信息的接口
    getMsg(data) {
      get("/md/detail/" + data.instanceId).then(res => {
        if (res.code === 10000 && res.success === true) {
          const data = res.data;
          this.oBaseInfo2.aTableData = [
            {
              key: "元数据代码:",
              value: data.code
            },
            {
              key: "元数据名称:",
              value: data.name
            },
            {
              key: "元数据类型:",
              value: data.classifierName
            },
            {
              key: "上下文路径:",
              value: data.path
            },
            {
              key: "生效时间:",
              value: data.startTime
            }
          ];
          // this.sCode = data.code;
          this.oBaseInfo2.bLoading = false;
          this.oAttsinfo2.aTableData = data.attributes;
          this.oAttsinfo2.bLoading = false;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 用于动态tab头添加相关字样
    showTabName(item) {
      let relateType = item.relateType;
      let classifierName = item.classifierName;
      if (relateType === "Dep") {
        classifierName = "相关的" + classifierName;
      }
      return classifierName;
    },
    // 相关表和相关字段
    clickToMetaDetails(id, classifierId, title) {
      if (title.includes("(")) {
        title = title.substring(0, title.indexOf("("));
      }
      this.$router.push({
        name: "impactAndLineageDetail",
        params: {
          id: id,
          classifierId: classifierId,
          _title: title
        }
      });
    },
    // getRelationTableDataList() {
    //   const _this = this;
    //   get("/md/relate/info", {
    //     relateClassifierId: "Table",
    //     instanceId: _this.idTabAndCol,
    //     relateType: "Dep",
    //     classifierId: _this.classifierIdTabAndCol,
    //     pageCurrent: _this.oRelationTablePagination.icurrentPage,
    //     pageSize: _this.oRelationTablePagination.ipageSize,
    //     keyword: _this.keyWordTabAndCol
    //   }).then(res => {
    //     if (res.code === 10000 && res.success === true) {
    //       _this.oRelationTablePagination.total = res.data.total;
    //       _this.aRelationTableData1 = res.data.records;
    //       _this.aRelationTableHeaders = res.extras.headers;
    //       if (_this.aRelationTableData1 !== []) {
    //         _this.isShowRelationTableTab = true;
    //       }
    //     } else {
    //       _this.$message.error(res.message);
    //     }
    //   });
    // },

    // 相关字段
    // getRelationColumnDataList() {
    //   const _this = this;
    //   get("/md/relate/info", {
    //     relateClassifierId: "Column",
    //     instanceId: _this.idTabAndCol,
    //     relateType: "Dep",
    //     classifierId: _this.classifierIdTabAndCol,
    //     pageCurrent: _this.oRelationColumnPagination.icurrentPage,
    //     pageSize: _this.oRelationColumnPagination.ipageSize,
    //     keyword: _this.keyWordTabAndCol
    //   }).then(res => {
    //     if (res.code === 10000 && res.success === true) {
    //       _this.oRelationColumnPagination.total = res.data.total;
    //       _this.aRelationFiledData = res.data.records;
    //       _this.aRelationFiledHeaders = res.extras.headers;
    //       if (_this.aRelationFiledData !== []) {
    //         _this.isShowRelationColumnTab = true;
    //       }
    //     } else {
    //       _this.$message.error(res.message);
    //     }
    //   });
    // },
    // 获取视图切换下拉框数据
    getView() {
      get("/md/listOwnViewsForSelect").then(res => {
        if (res.code === 10000 && res.success === true) {
          this.aViewData = res.data;
          res.data.map((val, index) => {
            if (val.defaultShow) {
              this.sViewId = val.id;
            } else if (index === res.data.length - 1) {
              this.sViewId = "0";
            }
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // Tree懒加载
    loadNode(node, resolve) {
      if (this.sViewId === null) {
        get("/md/listOwnViewsForSelect").then(res => {
          if (res.code === 10000 && res.success === true) {
            this.aViewData = res.data;
            res.data.map((val, index) => {
              if (val.defaultShow) {
                this.sViewId = val.id;
              }
            });
            this.sViewId = this.sViewId === null ? "0" : this.sViewId;
            console.log(this.sViewId);
            if (node.level === 0) {
              this.firstNode = node;
              this.node = node;
              this.resolve = resolve;
              get("/md/tree", {
                viewId: this.sViewId
              }).then(res => {
                if (res.code === 10000 && res.success === true) {
                  return resolve(res.data);
                } else {
                  this.$message.error(res.message);
                }
              });
            } else {
              if (!this.isMore) {
                // 非查看更多 flag
                this.treeCurrentPage = 1;
              }
              let params = {
                nodeType: node.data.nodeType,
                viewId: this.sViewId,
                current: this.treeCurrentPage
              };
              if (node.data.nodeType === "metaModel") {
                params.classifierId = node.data.classifierId;
                params.parentId = node.data.parentNodeId;
              } else {
                params.id = node.data.id;
              }
              get("/md/tree", params).then(res => {
                if (res.code === 10000 && res.success === true) {
                  let resData = res.data;
                  if (resData.length) {
                    // 增加current属性
                    resData.forEach((item, index) => {
                      item.current = 1;
                    });
                    // 查看更多
                    if (res.extras !== undefined) {
                      if (res.extras.hasNextPage) {
                        resData.push({
                          id: null,
                          code: "查看更多",
                          name: "查看更多",
                          text: "查看更多",
                          isLeaf: true
                        });
                      }
                    }
                  }
                  return resolve(res.data);
                } else {
                  this.$message.error(res.message);
                }
              });
            }
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        if (node.level === 0) {
          this.firstNode = node;
          this.node = node;
          this.resolve = resolve;
          get("/md/tree", {
            viewId: this.sViewId
          }).then(res => {
            if (res.code === 10000 && res.success === true) {
              return resolve(res.data);
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          if (!this.isMore) {
            // 非查看更多 flag
            this.treeCurrentPage = 1;
          }
          let params = {
            nodeType: node.data.nodeType,
            viewId: this.sViewId,
            current: this.treeCurrentPage
          };
          if (node.data.nodeType === "metaModel") {
            params.classifierId = node.data.classifierId;
            params.parentId = node.data.parentNodeId;
          } else {
            params.id = node.data.id;
          }
          get("/md/tree", params).then(res => {
            if (res.code === 10000 && res.success === true) {
              let resData = res.data;
              if (resData.length) {
                // 增加current属性
                resData.forEach((item, index) => {
                  item.current = 1;
                });
                // 查看更多
                if (res.extras !== undefined) {
                  if (res.extras.hasNextPage) {
                    resData.push({
                      id: null,
                      code: "查看更多",
                      name: "查看更多",
                      text: "查看更多",
                      isLeaf: true
                    });
                  }
                }
              }
              return resolve(res.data);
            } else {
              this.$message.error(res.message);
            }
          });
        }
      }
    },
    renderContent(h, params) {
      let sText = params.data.text;
      let iconType = "";
      if (params.data.nodeType === "metadata") {
        sText = this.bShowCode === true ? params.data.code : params.data.text;
        iconType = "icon icon-" + params.data.classifierId;
      } else if (params.data.nodeType === "metaModel") {
        // console.log(params.data.classifierId, 'metaModel')
        sText =
          this.bShowCode === true
            ? params.data.classifierId
              ? params.data.classifierId
              : params.data.code
            : params.data.text;
        if (params.data.classifierId === "Database") {
          iconType = "icon icon-metaModel";
        } else {
          iconType = "icon icon-" + params.data.classifierId;
        }
      } else {
        iconType = "icon icon-" + params.data.nodeType;
      }
      if (params.data.nodeType === "view") {
        iconType = "icon icon-view";
      }
      if (params.data.code === "查看更多") {
        iconType = "icon icon-more";
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
                marginRight: "4px"
              }
            },
            params.data.text === "查看更多" ? "<<" : ""
          ),
          h("span", sText)
        ]
      );
    },
    // 视图切换
    changeView() {
      this.node.childNodes = [];
      this.loadNode(this.node, this.resolve);
      this.sNodeType = "";
      this.bShowEdit = false;
    },
    // 搜索并跳转元数据查询页面
    goQueryPage() {
      this.$router.push({
        name: "metaQuery",
        query: { keyword: this.sKeyword }
      });
    },
    // 查看更多
    getMoreData(node) {
      // console.log(node)
      this.isMore = true; // 查看更多 flag，赋值true
      let _node = node.parent;
      if (this.isMore) {
        // 查看更多 flag
        this.treeCurrentPage = _node.data.current + 1;
      } else {
        this.treeCurrentPage = 1;
      }
      let params = {
        nodeType: _node.data.nodeType,
        viewId: this.sViewId,
        current: this.treeCurrentPage
      };
      if (_node.data.nodeType === "metaModel") {
        params.classifierId = _node.data.classifierId;
        params.parentId = _node.data.parentNodeId;
      } else {
        params.id = _node.data.id;
      }
      get("/md/tree", params).then(res => {
        if (res.code === 10000 && res.success === true) {
          let resData = res.data;
          if (resData.length) {
            if (this.isMore) {
              // 拼接数据
              _node.data.current = this.treeCurrentPage;
              _node.data.children = [];
              let childNodes = _node.childNodes;
              childNodes.forEach((item, index) => {
                if (item.data.code !== "查看更多") {
                  // res.data.splice(index, 0, item.data)
                  _node.data.children.splice(index, 0, item.data);
                }
              });
              this.isMore = false;
            }
            // 查看更多
            if (res.extras !== undefined) {
              if (res.extras.hasNextPage) {
                resData.push({
                  id: null,
                  code: "查看更多",
                  name: "查看更多",
                  text: "查看更多",
                  isLeaf: true
                });
              }
            }
            let len = _node.data.children.length;
            res.data.forEach((item, index) => {
              _node.data.children.splice(len + index, 0, item);
            });
            this.refreshTree(_node, _node.data.children);
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    refreshTree(node, children) {
      var theChildren = node.childNodes;
      theChildren.splice(0, theChildren.length);
      node.doCreateChildren(children);
    },
    // 获取元数据的所有子元数据类型
    getChildClassifiers(id, classifierId) {
      get("/md/relate/classifiers", {
        instanceId: id,
        classifierId: classifierId
      }).then(res => {
        parseAjaxResponse(res, () => {
          this.aTabsTitle = res.data;
          // this.getRelationTableDataList();
          // this.getRelationColumnDataList();
        });
      });
    },
    getChildClassifiers2(id, classifierId) {
      get("/md/relate/classifiers", {
        instanceId: id,
        classifierId: classifierId
      }).then(res => {
        parseAjaxResponse(res, () => {
          this.aTabsTitle2 = res.data;
          // this.getRelationTableDataList();
          // this.getRelationColumnDataList();
        });
      });
    },
    getTableDataList() {
      if (this.searchForm.classifierId === undefined) {
        return;
      }
      let params = {};
      if (this.searchForm.propSearch) {
        params = {
          relateClassifierId: this.searchForm.classifierId,
          relateType: this.searchForm.relateType,
          roleId: this.searchForm.roleId,
          instanceId: this.sCurrentId,
          classifierId: this.sCurrentClassId,
          pageCurrent: this.searchForm.current,
          pageSize: this.searchForm.size
        };
        if (this.searchForm.propSearch === "code") {
          params.code = this.searchForm.keyword;
        } else {
          params.name = this.searchForm.keyword;
        }
      } else {
        params = {
          relateClassifierId: this.searchForm.classifierId,
          relateType: this.searchForm.relateType,
          roleId: this.searchForm.roleId,
          instanceId: this.sCurrentId,
          classifierId: this.sCurrentClassId,
          pageCurrent: this.searchForm.current,
          pageSize: this.searchForm.size,
          keyword: this.searchForm.keyword
        };
      }

      get("/md/relate/info", params).then(res => {
        parseAjaxResponse(res, () => {
          this.searchForm.total = res.data.total;
          this.aRelationTableData = res.data.records;
          this.aRelationTableHeaders = res.extras.headers;
        });
        this.searchForm.bLoading = false;
      });
    },
    getTableDataList2() {
      if (this.searchForm2.classifierId === undefined) {
        return;
      }
      let params = {};
      if (this.searchForm2.propSearch) {
        params = {
          relateClassifierId: this.searchForm2.classifierId,
          relateType: this.searchForm2.relateType,
          roleId: this.searchForm2.roleId,
          instanceId: this.detailId,
          classifierId: this.detailClassifier,
          pageCurrent: this.searchForm2.current,
          pageSize: this.searchForm2.size
        };
        if (this.searchForm2.propSearch === "code") {
          params.code = this.searchForm2.keyword;
        } else {
          params.name = this.searchForm2.keyword;
        }
      } else {
        params = {
          relateClassifierId: this.searchForm2.classifierId,
          relateType: this.searchForm2.relateType,
          roleId: this.searchForm2.roleId,
          instanceId: this.detailId,
          classifierId: this.detailClassifier,
          pageCurrent: this.searchForm2.current,
          pageSize: this.searchForm2.size,
          keyword: this.searchForm2.keyword
        };
      }

      get("/md/relate/info", params).then(res => {
        parseAjaxResponse(res, () => {
          this.searchForm2.total = res.data.total;
          this.aRelationTableData2 = res.data.records;
          this.aRelationTableHeaders2 = res.extras.headers;
        });
        this.searchForm2.bLoading = false;
      });
    },
    // 点击Tree节点
    handleNodeClick(data) {
      console.log(data);
      // console.log(node)
      console.log(data.classifierId);
      var count = ++this.count;
      if (data.classifierId === "Schema") {
        this.showExportBtn = true;
        this.SchemaId = data.id;
      } else {
        this.showExportBtn = false;
      }
      this.nData = data;
      this.sNodeType = data.nodeType;
      this.bshowDeltail = false;
      // if (data.nodeType === "metadata") {
      this.bShowEdit = false;
      this.sActiveTab = "first";
      this.sActiveTab2 = "first";
      this.oBaseInfo.bLoading = true;
      this.oAttsinfo.bLoading = true;
      this.searchForm.propSearch = null;
      this.searchForm.keyword = null;
      this.sCurrentId = data.id;
      this.sCurrentClassId = data.classifierId;
      let classifierArr = ["Schema", "Table", "Column", "View"];
      if (classifierArr.indexOf(data.classifierId) > -1) {
        this.bShowBtn = true;
      } else {
        this.bShowBtn = false;
      }
      get("/md/detail/" + data.id).then(res => {
        // console.log(count, this.count, 'count')
        if (res.code === 10000 && res.success === true) {
          if (count === this.count) {
            const data = res.data;
            this.oBaseInfo.aTableData = [
              {
                key: "元数据代码:",
                value: data.code
              },
              {
                key: "元数据名称:",
                value: data.name
              },
              {
                key: "元数据类型:",
                value: data.classifierName
              },
              {
                key: "上下文路径:",
                value: data.path
              },
              {
                key: "生效时间:",
                value: data.startTime
              }
            ];
            this.sCode = data.code;
            this.oBaseInfo.bLoading = false;
            this.oAttsinfo.aTableData = data.attributes;
            this.oAttsinfo.bLoading = false;
          }
        } else {
          this.$message.error(res.message);
        }
      });
      // this.getMsg();
      // get('/mm/listMetaModelExistMetadataForSelect', {
      //   parentId: data.id
      // }).then(res => {
      //   if (res.code === 10000 && res.success === true) {
      //     this.aTabsTitle = [{ id: 'metaInfo', name: '元数据信息' }]
      //     if (node.data.classifierId === "SQLIndex" || node.data.classifierId === "PrimaryKey") {
      //       this.classifierIdTabAndCol = node.data.classifierId
      //       this.idTabAndCol = node.data.id
      //       // let obj = {}
      //       // obj.id = "relateTable"
      //       // obj.name = '相关表'
      //       // this.aTabsTitle.push(obj)
      //       let obj1 = {}
      //       obj1.id = "relateColumn"
      //       obj1.name = '相关字段'
      //       this.aTabsTitle.push(obj1)
      //       this.getRelationTableDataList();
      //       this.getRelationColumnDataList();
      //     }
      //     this.aTabsTitle = this.aTabsTitle.concat(res.data)
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
      this.getChildClassifiers(data.id, data.classifierId);
      get("/mm/listCompositeMetaModelForSelect", {
        classifierId: data.classifierId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.aMetaDataType = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
      // }
      if (this.aPath.length === 0) {
        this.aPath.push(data.text);
      } else {
        let hasNane = false;
        this.aPath.forEach(i => {
          if (i === data.text) {
            hasNane = true;
          }
        });
        if (hasNane === false) {
          this.aPath.push(data.text);
        }
      }
      // if (data.code === "查看更多") {
      //   this.getMoreData(node);
      // }
      // data.level = node.level;
      // let len = this.Breadcrumb.length;
      // // if (len > 1) {
      // this.Breadcrumb.map((item, index) => {
      //   if (item.level === node.level) {
      //     console.log("level");
      //     this.Breadcrumb.splice(index, len);
      //   }
      // });
      // if (!this.Breadcrumb.includes(data)) {
      //   this.Breadcrumb.push(data);
      // }
      // }
    },
    // 点击修改按钮
    goEdit(type, row) {
      //  有 row 时是表格点击的编辑
      //  type === 'main' 时  为入口页进入的编辑页
      //  type === 'bshowDeltail'  为详情页进入的编辑页
      this.type = type;
      this.row = row;
      let params = {};
      if (row) {
        params = row;
        params.id = row.instanceId;
      } else if (type === "bshowDeltail") {
        console.log(this.detailId);
        params.id = this.detailId;
      } else {
        params = this.nData;
      }
      console.log(params);
      // 根据 id 查询编辑页数据
      get("/md/getMetadataWhenEdit/" + params.id).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.showComponent = "metaEdit";
          if (type === "main" && !row) {
            this.sActiveTab = "first";
          }
          this.formValue = res.data;
          this.formValue.type = type;
          console.log(res.data);
        } else {
          this.$message.error(res.message);
        }
      });
      // if (type === 'metadata-info') {
      //   this.sActiveTab = 'first'
      // }
      // this.aAddName = []
      // get('/md/detail/' + this.sCurrentId).then(res => {
      //   if (res.code === 10000 && res.success === true) {
      //     this.aAddName = res.data.attributes
      //     const instance = res.data
      //     this.oEditForm.sType = instance.classifierName + '(' + instance.classifierId + ')'
      //     this.oEditForm.sCode = instance.code
      //     this.oEditForm.sName = instance.name
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
      // this.title = '修改'
      // this.bAdd = false
      // this.bShowEdit = true
    },
    // 导出
    handleExoprt() {
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
    // 点击Tabs标签切换
    tabClick(tab, event) {
      console.log(this.sActiveTab);
      console.log(tab.$attrs);
      this.searchForm.bLoading = true;
      this.searchForm.classifierId = tab.$attrs.classifierId;
      this.searchForm.relateType = tab.$attrs.relateType;
      // this.searchForm.roleId = tab.$attrs.roleId;
      this.searchForm.total = 0;
      this.searchForm.current = 1;
      this.getTableDataList();
      this.searchForm.propSearch = null;
      this.searchForm.keyword = null;
    },
    tabClick2(tab, event) {
      console.log(this.sActiveTab);
      this.searchForm2.bLoading = true;
      this.searchForm2.classifierId = tab.$attrs.classifierId;
      this.searchForm2.relateType = tab.$attrs.relateType;
      // this.searchForm2.roleId = tab.$attrs.roleId;
      this.searchForm2.total = 0;
      this.searchForm2.current = 1;
      this.getTableDataList2();
      this.searchForm2.propSearch = null;
      this.searchForm2.keyword = null;
    },
    // 获取Tabs除原数据信息选项以外列表
    getList() {
      this.oList.bLoading = true;
      get("/md/search", {
        classifierId: this.sTabClassifierId,
        parentId: this.sCurrentId,
        current: this.oList.iCurrentPage,
        size: this.oList.iCurrentSize
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          const data = res.data;
          this.oList.aList = data.records;
          this.oList.iTotal = data.total;
          this.oList.bLoading = false;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 修改列表一页数据大小
    handleSizeChange(value) {
      this.searchForm.size = value;
      this.getTableDataList();
    },
    handleSizeChange2(value) {
      this.searchForm2.size = value;
      this.getTableDataList2();
    },
    // 跳转列表页面
    handleCurrentChange(value) {
      this.searchForm.current = value;
      this.getTableDataList();
    },
    // 跳转列表页面
    handleCurrentChange2(value) {
      this.searchForm2.current = value;
      this.getTableDataList2();
    },
    // 点击返回按钮
    goReturn() {
      this.bShowEdit = false;
      if (this.title === "新增") {
        this.$refs["oAddForm"].resetFields();
      } else {
        this.$refs["oEditForm"].resetFields();
      }
    },
    // 点击保存按钮
    goSave() {
      if (this.title === "新增") {
        this.$refs.oAddForm.validate(valid => {
          if (valid) {
            this.save("createMetadata");
          } else {
            this.$message.error("请按以下规则填写信息");
          }
        });
      } else {
        this.$refs.oEditForm.validate(valid => {
          if (valid) {
            this.save("editMetadata");
          } else {
            this.$message.error("请按以下规则填写信息1");
          }
        });
      }
    },
    save(url) {
      let params = {
        FROM_CLASSIFIER_ID: this.sCurrentClassId
      };
      if (url === "createMetadata") {
        params.instanceCode = this.oAddForm.sCode;
        params.instanceName = this.oAddForm.sName;
        params.classifierName = this.classifierName;
        params.classifierId = this.classifierId;
        params.parentId = this.sCurrentId;
      }
      if (url === "editMetadata") {
        params.instanceCode = this.oEditForm.sCode;
        params.instanceName = this.oEditForm.sName;
        params.instanceId = this.sCurrentId;
        params.classifierId = this.sCurrentClassId;
      }
      if (this.aAddName.length !== 0) {
        this.aAddName.forEach(i => {
          if (i.datatypeId === "time") {
            i.value = i.value.Format("yyyy-MM-dd");
          }
          params[i.attStore] = i.value;
        });
      }
      post("/md/" + url, params).then(res => {
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
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 点击跳转详情页
    goDetail(item) {
      this.bshowDeltail = true;
      this.detailItem = item;
      this.detailClassifier = item.classifierId;
      this.detailId = item.instanceId;
      this.oBaseInfo2.bLoading = true;
      this.oAttsinfo2.bLoading = true;
      this.getChildClassifiers2(this.detailId, this.detailClassifier);
      this.getMsg(item);

      console.log(item, '555')
      console.log(this.detailId, '555')
      // 调用获取 SVG item id 的接口
      this.getSVGItemId2(this.detailId)
    },
    // 点击影响分析
    goInfluence(id, title) {
      this.$router.push({
        name: "impactAnalysisCanvas",
        params: {
          id: id,
          _title: title,
          classifierId: this.sCurrentClassId,
          bSvgLineageIsShow: this.bSvgLineageIsShow
        }
      });
    },
    // 点击 table 中的 影响分析
    goToInfluencePage(item) {
      // 调用获取 SVG item id 的接口
      get('/md/asg/findItemId', {
        metadataId: item.instanceId
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
              instanceId: this.sSvgItemId,
              instanceCode: item.instanceCode,
              classifierId: item.classifierId
            }
            if (this.sSvgItemId === null) {
              // 显示 EDGS 的 血缘分析图
              this.goInfluence2(item)
            } else {
              // 显示 svg 的 血缘分析图
              this.goInfluence2(this.oSvgItemObj);
            }
          }
        })
      })
    },
    goInfluence2(item) {
      this.$router.push({
        name: "impactAnalysisCanvas",
        params: {
          id: item.instanceId,
          _title: item.instanceCode,
          classifierId: item.classifierId,
          bSvgLineageIsShow: this.bSvgLineageIsShow
        }
      });
    },
    // 点击血统分析
    goAncestry(id, title) {
      this.$router.push({
        name: "lineageAnalysisCanvas",
        params: {
          id: id,
          _title: title,
          classifierId: this.sCurrentClassId,
          bSvgLineageIsShow: this.bSvgLineageIsShow
        }
      });
    },
    //  点击 table 中的 血统分析
    goToAncestryPage (item) {
      // 调用获取 SVG item id 的接口
      get('/md/asg/findItemId', {
        metadataId: item.instanceId
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
              instanceId: this.sSvgItemId,
              instanceCode: item.instanceCode,
              classifierId: item.classifierId
            }
            if (this.sSvgItemId === null) {
              // 显示 EDGS 的 血缘分析图
              this.goAncestry2(item)
            } else {
              // 显示 svg 的 血缘分析图
              this.goAncestry2(this.oSvgItemObj);
            }
          }
        })
      })
    },
    goAncestry2(item) {
      this.$router.push({
        name: "lineageAnalysisCanvas",
        params: {
          id: item.instanceId,
          _title: item.instanceCode,
          classifierId: item.classifierId,
          bSvgLineageIsShow: this.bSvgLineageIsShow
        }
      });
    },
    getMsg2(id) {
      get("/md/detail/" + id).then(res => {
        if (res.code === 10000 && res.success === true) {
          const data = res.data;
          this.oBaseInfo.aTableData = [
            {
              key: "元数据代码:",
              value: data.code
            },
            {
              key: "元数据名称:",
              value: data.name
            },
            {
              key: "元数据类型:",
              value: data.classifierName
            },
            {
              key: "上下文路径:",
              value: data.path
            },
            {
              key: "生效时间:",
              value: data.startTime
            }
          ];
          // this.sCode = data.code;
          this.oBaseInfo.bLoading = false;
          this.oAttsinfo.aTableData = data.attributes;
          this.oAttsinfo.bLoading = false;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 编辑保存后  组件显示隐藏
    changeComponentShow(val) {
      this.selectArr = [];
      console.log(val, "save");
      if (val === "main") {
        //  编辑保存  返回的入口页
        if (this.row) {
          // 表格编辑事件
          this.getTableDataList();
          this.searchForm.bLoading = false;
          this.searchForm2.bLoading = false;
        } else {
          // 头部的编辑事件
          this.getMsg2(this.nData.id);
          this.searchForm.bLoading = false;
          this.searchForm2.bLoading = false;
        }
        // console.log(this.nData)
        // let params = {
        //   instanceId: this.nData.id
        // }
        // this.oBaseInfo2 = ''
        // this.oAttsinfo2 = ''
        // this.getMsg(params)
      } else if (val === "bshowDeltail") {
        // 编辑保存  返回的详情页
        console.log("edit");
        // this.$refs.metadataDetail.getMsg();
        this.getMsg(this.detailItem);
        this.getTableDataList();
        this.searchForm.bLoading = false;
        this.searchForm2.bLoading = false;
      }
    },
    backChangeShow(val) {
      if (val === "bshowDeltail") {
        // 返回的详情页
        this.bshowDeltail = true;
        // this.getMsg(this.detailItem);
        this.showComponent = "main";
      } else {
        // 返回的入口页
        this.showComponent = val;
        this.getTableDataList();
      }
      this.oBaseInfo.bLoading = false;
      this.oAttsinfo.bLoading = false;
      this.oBaseInfo2.bLoading = false;
      this.oAttsinfo2.bLoading = false;
    }
  },
  computed: {
    ...mapGetters(["roles"])
  },
  mounted() {},
  created() {
    this.showToolTip = true;
    // this.getView();
  },
  activated() {
    this.showToolTip = true;
  },
  deactivated() {
    this.showToolTip = false;
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "../../styles/treeIcon";
@import "../../styles/variables";
@import "../../styles/switch";
$color-grey-light: #e0e0e0;
.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.metadata-browse {
  //数据库信息过滤区
  .el-form--inline .el-form-item {
    margin-right: -4px;
    margin-bottom: 15px;
    // margin-top: 15px;
  }
  .schema-filter {
    /deep/ .select {
      .el-input {
        input {
          -moz-border-radius-topright: 0px;
          -moz-border-radius-bottomright: 0px;
          background-color: #f8f8f9;
        }
      }
    }
    /deep/ .text input {
      border-radius: 0px;
      border-left: none;
      border-right: none;
    }
    button {
      height: 32px;
      background-color: #f8f8f9;
    }
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
    .left-box {
      height: 100%;
      .el-card {
        height: 100%;
        .el-card__body {
          padding: 20px;
          position: relative;
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
          .md-filter {
            margin: 10px;
            .el-input__prefix {
              cursor: pointer;
            }
          }
          .md-tree::-webkit-scrollbar {
            width: 5px;
            height: 10px;
          }
          .md-tree::-webkit-scrollbar-track {
            background: none;
            border-radius: 2px;
          }
          .md-tree::-webkit-scrollbar-thumb {
            background: rgb(239, 239, 239);
            border-radius: 10px;
          }
          .md-tree::-webkit-scrollbar-thumb:hover {
            background: #bfbfbf;
          }
          .md-tree {
            height: calc(100vh - 270px);
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
      width: 100%;
      .el-card {
        width: 100%;
        height: 100%;
        .el-card__body {
          padding: 16px !important;
          position: relative;
          .card-header {
            border-bottom: 1px solid #ebeef5;
            padding-bottom: 12px;
            // display: flex;
            // border-bottom: 1px solid $color-grey-light;
            // padding: 4px 0 8px;
            // padding-right: 35px;
            // position: relative;
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
              font-size: 12px;
              line-height: 22px;
              /deep/ .el-breadcrumb__inner {
                color: #409eff;
                cursor: pointer;
              }
            }
          }
          .no-data {
            width: 500px;
            height: 457px;
            background: url("./../../assets/images/commonIcon/no-data.png")
              no-repeat;
            background-size: 500px 457px;
            margin: 30px auto;
          }
          .card-button {
            margin-top: 15px;
            .el-dropdown {
              margin: 0 10px;
              position: relative;
              bottom: 3px;
            }
            .el-button--mini {
              font-size: 13px;
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
            }
          }
          .edit-box {
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
              padding: 15px 10px;
              color: #515a6e;
            }
          }
          .el-tabs {
            /deep/ .el-tabs__nav-wrap::after {
              background-color: unset;
            }
            .metadata-info {
              overflow-y: auto;
              height: calc(100vh - 300px);
            }
            .metadata-info::-webkit-scrollbar {
              width: 5px;
              height: 10px;
            }
            .metadata-info::-webkit-scrollbar-track {
              background: none;
              border-radius: 2px;
            }
            .metadata-info::-webkit-scrollbar-thumb {
              background: rgb(239, 239, 239);
              border-radius: 10px;
            }
            .metadata-info::-webkit-scrollbar-thumb:hover {
              background: #bfbfbf;
            }
            /deep/ .el-tabs__item {
              height: 46px;
              width: 100px;
              line-height: 46px;
              text-align: center;
              padding: 0px;
            }
            /deep/ .el-tabs__header {
              margin: 0 0 6px;
            }
          }
          .md-content {
            .card-table {
              height: calc(100vh - 380px);
              .el-table__body-wrapper {
                overflow: auto;
                height: calc(100% - 84px);
              }
            }
          }
        }
      }
    }
    .deltail-box {
      .deltail-header {
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 10px;
      }
      .deltail-body {
        .deltail-list {
          height: calc(100vh - 230px);
          width: 100%;
        }
        .quality-rate {
          float: right;
          height: 34px;
          line-height: 34px;
          display: flex;
        }
        .quality-rate /deep/ .el-rate {
          // float: right;
          height: 34px;
          line-height: 42px;
        }
        /deep/ .el-collapse {
          border-top: none;
          border-bottom: none;
        }
        /deep/ .el-collapse-item__header {
          font-family: "PingFangSC-Regular", "PingFang SC";
          font-weight: 400;
          font-style: normal;
          font-size: 18px;
          color: #666666;
          width: 100%;
          border-bottom: 1px solid rgba(233, 233, 233, 1);
        }
        /deep/ .el-collapse-item__wrap {
          border-bottom: unset;
        }
        /deep/ .el-collapse-item__content {
          font-family: "PingFangSC-Regular", "PingFang SC";
          font-weight: 400;
          font-style: normal;
          font-size: 16px;
          color: #666666;
          // padding: 20px 60px;
          padding: 20px 0px;
        }
      }
    }
  }
  /deep/ .el-collapse-item__header {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    font-size: 18px;
    color: #666666;
    // padding: 0 20px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  /deep/ .el-collapse-item__wrap {
    border-bottom: unset;
  }
  /deep/ .el-collapse-item__content {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    color: #666666;
    // padding: 20px 60px;
    padding: 20px 0px;
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
  .child-search {
    text-align: right;
    margin-bottom: 10px;
    .el-form-item {
      margin-bottom: 0px;
    }
    /deep/.el-input__inner {
      width: 200px;
    }
  }
  //表格中a标签颜色
  .a-color {
    color: #2d8cf0;
    //font-weight: bold;
  }
  .clearfix:after {
    /*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .clearfix {
    *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
  }
}
.metadataAnalyze {
  // width: 120px;
  padding: 0;
}
.overHidden {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.tableScorll {
  /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 5px;
    height: 10px;
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
.edit-box {
  .el-tabs__content {
    height: calc(100% - 100px) !important;
  }
}
.meta-edit {
  padding: 18px;
  position: relative;
  width: 100%;
  // height: calc(100vh - 120px);
  background: #fff;
  height: calc(100vh - 104px);
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
}
.metadata-browse {
  /deep/ .pathBottom {
    bottom: -42px !important;
  }
  /deep/ .el-tabs__content {
    height: calc(100% - 115px) !important;
  }
}
.metadataAnalyze {
  .el-dropdown-menu__item {
    padding: 0;
    text-align: center;
    width: 80px;
  }
}
</style>