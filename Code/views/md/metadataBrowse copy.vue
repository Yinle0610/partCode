<template>
  <div class="metadata-browse">
    <div class="content-box">
      <el-container>
        <el-aside width="20%" class="leftdiv">
          <div class="left-box">
            <el-card shadow="hover">
              <div class="title">
                <span>显示模式</span>
                <el-switch v-model="bShowCode"
                          :width="60"
                          active-color="#09e"
                          active-text="代码"
                          inactive-color="#09e"
                          inactive-text="名称">
                </el-switch>
              </div>
              <!--元数据浏览过滤区-->
              <div class="md-filter">
                <el-input placeholder="请输入内容"
                          v-model="sKeyword"
                          v-permission="'MD_SCAN'"
                          @keyup.enter.native="goQueryPage">
                  <i slot="prefix"
                    class="el-input__icon el-icon-search"
                    @click="goQueryPage"></i>
                </el-input>
              </div>
              <div class="md-tree">
                <el-tree :props="props"
                        accordion
                        :load="loadNode"
                        node-key="id"
                        ref="tree"
                        lazy
                        :highlight-current="true"
                        empty-text="暂无数据"
                        @node-click="handleNodeClick"
                        :render-content="renderContent">
                </el-tree>
              </div>
              <div class="view-filter">
                <span class="tl">视图切换</span>
                <el-select v-model="sViewId"
                          placeholder="请选择"
                          size="small"
                          @change="changeView">
                  <el-option v-for="item in aViewData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-card>
          </div>
        </el-aside>
        <el-aside style="background-color:#000;position:relative;height:100%;width: 4px;opacity:0;" @mousedown.native.prevent="dragControllerDiv($event)" class="resize" >
        </el-aside>
        <el-main>
          <div class="right-box">
            <el-card shadow="hover">
              <div v-if="sNodeType !== 'metadata'"
                  class="no-data">
              </div>
              <div v-if="sNodeType === 'metadata' && !bShowEdit">
                <div v-if="bShowBtn"
                    class="action-box">
                  <el-button type="primary"
                            v-permission="'IMPACT_ANALYSIS'"
                            size="mini"
                            @click="goInfluence">影响分析</el-button>
                  <el-button type="primary"
                            v-permission="'LINEAGE_ANALYSIS'"
                            size="mini"
                            @click="goAncestry">血统分析</el-button>
                </div>
                <el-tabs v-model="sActiveTab"
                        @tab-click="tabClick">
                  <el-tab-pane v-for="title in aTabsTitle"
                              :label="title.name"
                              :key="title.id"
                              :name="title.id">
                    <div v-if="title.id === 'metaInfo'"
                        class="md-content">
                      <div class="md-action">
                        <el-dropdown v-if="aMetaDataType.length"
                                    @command="goAdd">
                          <el-button type="success"
                                    size="small"
                                    v-permission="'MD_CREATE'"
                                    class="dropdow-btn"><i class="add-icon"></i>
                            新增<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in aMetaDataType"
                                              :key="item.id"
                                              :command="item">{{item.name + '(' + item.id + ')'}}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                        <el-button type="warning"
                                  size="small"
                                  class="edit-btn"
                                  v-permission="'MD_EDIT'"
                                  @click="goEdit"><i class="el-icon-edit"></i>修改</el-button>
                        <!-- <el-button type="danger"
                                  size="small"
                                  class="edit-btn"><i class="el-icon-delete"></i>删除</el-button> -->
                      </div>
                      <metadata-info :oBaseInfo="oBaseInfo"
                                    :oAttsinfo="oAttsinfo"></metadata-info>
                    </div>

                    <div v-if="title.id !== 'metaInfo'&&title.id !== 'relateTable'&&title.id !== 'relateColumn'"
                        class="md-content">
                      <data-list :oList="oList"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                @go-detail="goDetail"></data-list>
                    </div>
                    <!-- 当是索引或者主键时显示相关表和相关字段 -->
                    <!-- 相关表 -->
                    <div v-if="title.id==='relateTable' && isShowRelationTableTab"
                        class="md-content">
                      <div id="relation-table">
                        <div class="child-search">
                          <el-input v-model.trim="keyWordTabAndCol" placeholder="搜索" size="small" @keyup.enter.native="getRelationTableDataList"></el-input>
                        </div>
                        <el-table
                          border
                          show-header
                          :data="aRelationTableData1"
                          :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                          style="width: 100%">
                          <el-table-column v-for="item in aRelationTableHeaders"
                                           show-overflow-tooltip
                                           :key="item.prop"
                                           :label="item.label">
                            <template slot-scope="scope">
                              <a class="a-color" v-if="item.prop === 'instanceCode'"
                                 @click="clickToMetaDetails(scope.row.instanceId, scope.row.classifierId, scope.row.instanceName)">
                                {{scope.row.instanceCode}}
                              </a>
                              <span v-else>{{scope.row[item.prop]}}</span>
                            </template>
                          </el-table-column>
                        </el-table>
                        <div>
                          <pagination v-show="oRelationTablePagination.total>0" :total="oRelationTablePagination.total" :page.sync="oRelationTablePagination.icurrentPage"   :limit.sync="oRelationTablePagination.ipageSize" @pagination="getRelationTableDataList" />
                        </div>
                      </div>
                    </div>
                    <!-- 相关字段 -->
                    <div v-if="title.id==='relateColumn' && isShowRelationColumnTab"
                        class="md-content">
                      <div id="relation-filed">
                        <div class="child-search">
                          <el-input v-model.trim="keyWordTabAndCol" placeholder="搜索" size="small" @keyup.enter.native="getRelationColumnDataList"></el-input>
                        </div>
                        <el-table
                          border
                          show-header
                          :data="aRelationFiledData"
                          :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                          style="width: 100%">
                          <el-table-column v-for="item in aRelationFiledHeaders"
                                           show-overflow-tooltip
                                           :key="item.prop"
                                           :label="item.label">
                            <template slot-scope="scope">
                              <a class="a-color" v-if="item.prop === 'instanceCode'"
                                 @click="clickToMetaDetails(scope.row.instanceId, scope.row.classifierId, scope.row.instanceName)">
                                {{scope.row.instanceCode}}
                              </a>
                              <span v-else>{{scope.row[item.prop]}}</span>
                            </template>
                          </el-table-column>
                        </el-table>
                        <div style="text-align: right">
                          <pagination v-show="oRelationColumnPagination.total>0" :total="oRelationColumnPagination.total" :page.sync="oRelationColumnPagination.icurrentPage"   :limit.sync="oRelationColumnPagination.ipageSize" @pagination="getRelationColumnDataList" />
                        </div>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <div v-if="bShowEdit"
                  class="edit-box">
                <div class="edit-header">
                  <span>{{title}}</span>
                  <div>
                    <el-button size="small"
                              @click="goReturn">返回</el-button>
                    <el-button type="primary"
                              size="small"
                              @click="goSave">保存</el-button>
                  </div>
                </div>
                <div class="md-form">
                  <!-- 新增 -->
                  <el-form v-if="bAdd"
                          :model="oAddForm"
                          :rules="rulesAdd"
                          ref="oAddForm"
                          label-width="130px"
                          class="add-form"
                          size="small">
                    <el-form-item label="元数据类型：">
                      <el-select v-model="oAddForm.sType"
                                :disabled="true">
                        <el-option label="区域一"
                                  value="shanghai"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="元数据代码："
                                  prop="sCode">
                      <el-input v-model="oAddForm.sCode"
                                style="width: 300px;"
                                placeholder="请输入元数据代码"></el-input>
                    </el-form-item>
                    <el-form-item label="元数据名称："
                                  prop="sName">
                      <el-input v-model="oAddForm.sName"
                                style="width: 300px;"
                                placeholder="请输入元数据名称"></el-input>
                    </el-form-item>
                    <div v-if="aAddName.length">
                      <div v-for="(item, index) in aAddName"
                          :key="index">
                        <el-form-item v-if="item.dataTypeId==='string' || item.dataTypeId==='integer'"
                                      :label="item.name + '：'">
                          <el-input v-model="item.value"
                                    style="width: 300px;"
                                    :placeholder="'请输入' + item.name"></el-input>
                        </el-form-item>
                        <el-form-item v-if="item.dataTypeId==='time'"
                                      :label="item.name + '：'">
                          <el-date-picker v-model="item.value"
                                          type="date"
                                          placeholder="请选择日期"
                                          style="width: 300px;"></el-date-picker>
                        </el-form-item>
                        <el-form-item v-if="item.dataTypeId==='boolean'"
                                      :label="item.name + '：'">
                          <el-select v-model="item.value">
                            <el-option label="是"
                                      value="true"></el-option>
                            <el-option label="否"
                                      value="false"></el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </div>
                  </el-form>
                  <!-- 修改 -->
                  <el-form v-if="!bAdd"
                          :model="oEditForm"
                          :rules="rulesEdit"
                          ref="oEditForm"
                          label-width="120px"
                          class="add-form"
                          size="small">
                    <el-form-item label="元数据类型：">
                      <el-select v-model="oEditForm.sType"
                                :disabled="true">
                        <el-option label="区域一"
                                  value="shanghai"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="元数据代码：">
                      <el-input v-model="oEditForm.sCode"
                                style="width: 300px;"
                                :disabled="true"
                                placeholder="请输入元数据代码"></el-input>
                    </el-form-item>
                    <el-form-item label="元数据名称："
                                  prop="sName">
                      <el-input v-model="oEditForm.sName"
                                style="width: 300px;"
                                placeholder="请输入元数据名称"></el-input>
                    </el-form-item>
                    <div v-if="aAddName.length">
                      <div v-for="(item, index) in aAddName"
                          :key="index">
                        <el-form-item v-if="item.dataTypeId==='string' || item.dataTypeId==='integer'"
                                      :label="item.name + '：'">
                          <el-input v-model="item.value"
                                    style="width: 300px;"
                                    :placeholder="'请输入' + item.name"></el-input>
                        </el-form-item>
                        <el-form-item v-if="item.dataTypeId==='time'"
                                      :label="item.name + '：'">
                          <el-date-picker v-model="item.value"
                                          type="date"
                                          placeholder="请选择日期"
                                          style="width: 300px;"></el-date-picker>
                        </el-form-item>
                        <el-form-item v-if="item.dataTypeId==='boolean'"
                                      :label="item.name + '：'">
                          <el-select v-model="item.value">
                            <el-option label="是"
                                      value="Y"></el-option>
                            <el-option label="否"
                                      value="N"></el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </div>
                  </el-form>
                </div>
                <div class="md-fotter">父节点路径信息：/{{aPath.join('/')}}</div>
              </div>
            </el-card>
          </div>
        </el-main>
      </el-container>


    </div>
  </div>
</template>

<script>
  // 元数据信息下的2个table的组件 元数据详情页也会用到
  import MetadataInfo from '@/components/Metadata/MetadataInfo'
  import { mapGetters } from 'vuex'
  import { get, post } from '@/utils/request'
  import DataList from '@/components/Metadata/DataList'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'metadataBrowse',
    components: { MetadataInfo, DataList, Pagination },
    data () {
      return {
        // 显示模式是否展示代码
        bShowCode: true,
        // 搜索框数据
        sKeyword: '',
        // 视图切换下拉框数据
        aViewData: [],
        // 视图切换下拉框选中项
        sViewId: '',
        props: {
          label: 'text',
          children: 'children',
          isLeaf: 'isLeaf'
        },
        // 是否显示新增或修改的form表单
        bShowEdit: false,
        // tabs当前选中项
        sActiveTab: 'metaInfo',
        // 新增按钮的下拉框数据
        aMetaDataType: [],
        // 元数据信息-基本信息
        oBaseInfo: {
          aTableData: [],
          bLoading: false
        },
        // 元数据信息-属性信息
        oAttsinfo: {
          aTableData: [],
          bLoading: false
        },
        // 新增form表单
        oAddForm: {
          sType: '',
          sCode: '',
          sName: ''
        },
        // 新增form表单-验证
        rulesAdd: {
          sCode: [{ required: true, message: '请输入元数据代码：', trigger: 'blur' }],
          sName: [{ required: true, message: '请输入元数据名称：', trigger: 'blur' }]
        },
        // 修改form表单
        oEditForm: {
          sType: '',
          sCode: '',
          sName: ''
        },
        // 修改form表单-验证
        rulesEdit: {
          sName: [{ required: true, message: '请输入元数据名称：', trigger: 'blur' }]
        },
        node: [],
        resolve: [],
        isMore: false, // 查看更多 flag
        treeCurrentPage: 1,
        // 当前选中的Tree节点数据类型
        sNodeType: '',
        // tabs标题数据
        aTabsTitle: [],
        // 当前选中的Tree节点id
        sCurrentId: '',
        // 除元数据信息以外的选项列表数据
        oList: {
          bLoading: false,
          aList: [],
          iCurrentPage: 1,
          iCurrentSize: 10,
          iTotal: 0
        },
        // 除元数据信息以外的当前选中的标题类型
        sTabClassifierId: '',
        // 新增或修改title
        title: '新增',
        // 是否是新增form表单
        bAdd: true,
        // 新增或修改Form表单里的属性数据
        aAddName: [],
        // 父节点路径信息
        aPath: [],
        // 当前新增的classifierId
        classifierId: '',
        // 当前新增的classifierName
        classifierName: '',
        // 当前选中的Tree节点classifierId
        sCurrentClassId: '',
        // 当前元数据的code
        sCode: '',
        // 是否显示血统分析等按钮
        bShowBtn: false,
        // 相关表和相关字段
        idTabAndCol: '',
        classifierIdTabAndCol: '',
        keyWordTabAndCol: '',

        aRelationTableData1: [],
        aRelationTableHeaders: [],
        oRelationTablePagination: {
          total: 0,
          icurrentPage: 1,
          ipageSize: 10
        },
        aRelationFiledData: [],
        aRelationFiledHeaders: [],
        oRelationColumnPagination: {
          total: 0,
          icurrentPage: 1,
          ipageSize: 10
        },
        isShowRelationColumnTab: '',
        isShowRelationTableTab: ''
      }
    },
    methods: {
      // 左边拖拽事件
      dragControllerDiv(e) {
        let width = document.getElementsByClassName('el-container')[0].clientWidth;
        let remove = document.getElementsByClassName('resize');
        let c = e.clientX - remove[0].offsetLeft;
        let left = document.getElementsByClassName('leftdiv');
        let newWidth = null;
        console.log(e, remove, left, width)
        document.onmousemove = (ev) => {
          ev.preventDefault()
          console.log(ev)
          let ex = ev.clientX - c;
          newWidth = ex / width * 100;
          console.log(newWidth)
          newWidth = newWidth > 45 ? 45 : newWidth < 15 ? 15 : newWidth
          left[0].style.width = newWidth.toFixed(2) + '%'
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
        // resize.releaseCapture && resize.releaseCapture()
        }
      },
      // 相关表和相关字段
      clickToMetaDetails(id, classifierId, title) {
        this.$router.push({
          name: 'impactAndLineageDetail',
          params: {
            id: id,
            classifierId: classifierId,
            _title: title
          }
        })
      },
      getRelationTableDataList() {
        const _this = this;
        get('/md/relate/info', {
          relateClassifierId: "Table",
          instanceId: _this.idTabAndCol,
          relateType: 'Dep',
          classifierId: _this.classifierIdTabAndCol,
          pageCurrent: _this.oRelationTablePagination.icurrentPage,
          pageSize: _this.oRelationTablePagination.ipageSize,
          keyword: _this.keyWordTabAndCol
        }).then(res => {
          if (res.code === 10000 && res.success === true) {
            _this.oRelationTablePagination.total = res.data.total
            _this.aRelationTableData1 = res.data.records
            _this.aRelationTableHeaders = res.extras.headers
            if (_this.aRelationTableData1 !== []) {
              _this.isShowRelationTableTab = true
            }
          } else {
            _this.$message.error(res.message)
          }
        })
      },

      // 相关字段
      getRelationColumnDataList() {
        const _this = this;
        get('/md/relate/info', {
          relateClassifierId: "Column",
          instanceId: _this.idTabAndCol,
          relateType: 'Dep',
          classifierId: _this.classifierIdTabAndCol,
          pageCurrent: _this.oRelationColumnPagination.icurrentPage,
          pageSize: _this.oRelationColumnPagination.ipageSize,
          keyword: _this.keyWordTabAndCol
        }).then(res => {
          if (res.code === 10000 && res.success === true) {
            _this.oRelationColumnPagination.total = res.data.total
            _this.aRelationFiledData = res.data.records
            _this.aRelationFiledHeaders = res.extras.headers
            if (_this.aRelationFiledData !== []) {
              _this.isShowRelationColumnTab = true
            }
          } else {
            _this.$message.error(res.message)
          }
        })
      },
      // 获取视图切换下拉框数据
      getView () {
        get('/md/listOwnViewsForSelect').then(res => {
          if (res.code === 10000 && res.success === true) {
            this.aViewData = res.data
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // Tree懒加载
      loadNode (node, resolve) {
        if (node.level === 0) {
          this.node = node
          this.resolve = resolve
          get('/md/tree', {
            viewId: this.sViewId
          }).then(res => {
            if (res.code === 10000 && res.success === true) {
              return resolve(res.data)
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          if (!this.isMore) { // 非查看更多 flag
            this.treeCurrentPage = 1
          }
          let params = {
            nodeType: node.data.nodeType,
            viewId: this.sViewId,
            current: this.treeCurrentPage
          }
          if (node.data.nodeType === 'metaModel') {
            params.classifierId = node.data.classifierId
            params.parentId = node.data.parentNodeId
          } else {
            params.id = node.data.id
          }
          get('/md/tree', params).then(res => {
            if (res.code === 10000 && res.success === true) {
              let resData = res.data
              if (resData.length) {
                // 增加current属性
                resData.forEach((item, index) => {
                  item.current = 1
                })
                // 查看更多
                if (res.extras !== undefined) {
                  if (res.extras.hasNextPage) {
                    resData.push({
                      id: null,
                      code: '查看更多',
                      name: '查看更多',
                      text: '查看更多',
                      isLeaf: true
                    });
                  }
                }
              }
              return resolve(res.data)
            } else {
              this.$message.error(res.message)
            }
          })
        }
      },
      renderContent (h, params) {
        let sText = params.data.text
        let iconType = ''
        if (params.data.nodeType === 'metadata') {
          sText = this.bShowCode === true ? params.data.code : params.data.text
          iconType = 'icon icon-' + params.data.classifierId
        } else {
          iconType = 'icon icon-' + params.data.nodeType
        }
        if (params.data.nodeType === 'view') {
          iconType = 'icon icon-view'
        }
        if (params.data.code === '查看更多') {
          iconType = 'icon icon-more'
        }
        return h('span',
          {
            class: 'tree-node'
          },
          [
            h('span', {
              class: iconType,
              style: {
                marginRight: '4px'
              }
            }, params.data.text === '查看更多' ? '<<' : ''),
            h('span', sText)
          ]
        );
      },
      // 视图切换
      changeView () {
        this.node.childNodes = []
        this.loadNode(this.node, this.resolve)
        this.sNodeType = ''
        this.bShowEdit = false
      },
      // 搜索并跳转元数据查询页面
      goQueryPage () {
        this.$router.push({ name: 'metaQuery', query: { keyword: this.sKeyword }})
      },
      // 查看更多
      getMoreData(node) {
        // console.log(node)
        this.isMore = true // 查看更多 flag，赋值true
        let _node = node.parent
        if (this.isMore) { // 查看更多 flag
          this.treeCurrentPage = _node.data.current + 1
        } else {
          this.treeCurrentPage = 1
        }
        let params = {
          nodeType: _node.data.nodeType,
          viewId: this.sViewId,
          current: this.treeCurrentPage
        }
        if (_node.data.nodeType === 'metaModel') {
          params.classifierId = _node.data.classifierId
          params.parentId = _node.data.parentNodeId
        } else {
          params.id = _node.data.id
        }
        get('/md/tree', params).then(res => {
          if (res.code === 10000 && res.success === true) {
            let resData = res.data
            if (resData.length) {
              if (this.isMore) { // 拼接数据
                _node.data.current = this.treeCurrentPage
                _node.data.children = []
                let childNodes = _node.childNodes
                childNodes.forEach((item, index) => {
                  if (item.data.code !== "查看更多") {
                    // res.data.splice(index, 0, item.data)
                    _node.data.children.splice(index, 0, item.data)
                  }
                })
                this.isMore = false
              }
              // 查看更多
              if (res.extras !== undefined) {
                if (res.extras.hasNextPage) {
                  resData.push({
                    id: null,
                    code: '查看更多',
                    name: '查看更多',
                    text: '查看更多',
                    isLeaf: true
                  });
                }
              }
              let len = _node.data.children.length;
              res.data.forEach((item, index) => {
                _node.data.children.splice(len + index, 0, item)
              })
              this.refreshLazyTree(_node, _node.data.children)
            }
          } else {
            this.$message.error(res.message)
          }
        })
      },
      refreshLazyTree(node, children) {
        var theChildren = node.childNodes
        theChildren.splice(0, theChildren.length)
        node.doCreateChildren(children)
      },
      // 点击Tree节点
      handleNodeClick (data, node, resolve) {
        // console.log("handleNodeClick (data, node, resolve)", data, node, resolve)
        this.sNodeType = data.nodeType
        if (data.nodeType === 'metadata') {
          this.bShowEdit = false
          this.sActiveTab = 'metaInfo'
          this.oBaseInfo.bLoading = true
          this.oAttsinfo.bLoading = true
          this.sCurrentId = data.id
          this.sCurrentClassId = data.classifierId
          let classifierArr = ['Schema', 'Table', 'Column', 'View'];
          if (classifierArr.indexOf(data.classifierId) > -1) {
            this.bShowBtn = true
          } else {
            this.bShowBtn = false
          }
          get('/md/detail/' + data.id).then(res => {
            if (res.code === 10000 && res.success === true) {
              const data = res.data
              this.oBaseInfo.aTableData = [
                {
                  key: '元数据代码:', value: data.code
                }, {
                  key: '元数据名称:', value: data.name
                }, {
                  key: '元数据类型:', value: data.classifierName
                }, {
                  key: '上下文路径:', value: data.path
                }, {
                  key: '生效时间:', value: data.startTime
                }
              ]
              this.sCode = data.code
              this.oBaseInfo.bLoading = false
              this.oAttsinfo.aTableData = data.attributes
              this.oAttsinfo.bLoading = false
            } else {
              this.$message.error(res.message)
            }
          })
          get('/mm/listMetaModelExistMetadataForSelect', {
            parentId: data.id
          }).then(res => {
            if (res.code === 10000 && res.success === true) {
              this.aTabsTitle = [{ id: 'metaInfo', name: '元数据信息' }]
              if (node.data.classifierId === "SQLIndex" || node.data.classifierId === "PrimaryKey") {
                this.classifierIdTabAndCol = node.data.classifierId
                this.idTabAndCol = node.data.id
                // let obj = {}
                // obj.id = "relateTable"
                // obj.name = '相关表'
                // this.aTabsTitle.push(obj)
                let obj1 = {}
                obj1.id = "relateColumn"
                obj1.name = '相关字段'
                this.aTabsTitle.push(obj1)
                this.getRelationTableDataList();
                this.getRelationColumnDataList();
              }
              this.aTabsTitle = this.aTabsTitle.concat(res.data)
            } else {
              this.$message.error(res.message)
            }
          })
          get('/mm/listCompositeMetaModelForSelect', {
            classifierId: data.classifierId
          }).then(res => {
            if (res.code === 10000 && res.success === true) {
              this.aMetaDataType = res.data
            } else {
              this.$message.error(res.message)
            }
          })
        }
        if (this.aPath.length === 0) {
          this.aPath.push(data.text)
        } else {
          let hasNane = false
          this.aPath.forEach(i => {
            if (i === data.text) {
              hasNane = true
            }
          })
          if (hasNane === false) {
            this.aPath.push(data.text)
          }
        }
        if (data.code === "查看更多") {
          this.getMoreData(node)
        }
      },
      // 点击新增按钮下拉框选项
      goAdd (data) {
        this.title = '新增'
        this.oAddForm.sType = data.name + '(' + data.id + ')'
        this.classifierName = data.name
        this.classifierId = data.id
        this.bAdd = true
        this.aAddName = []
        post('/md/listAttrByClassifierId', {
          classifierId: data.id
        }).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.aAddName = res.data
          } else {
            this.$message.error(res.message)
          }
        })
        this.bShowEdit = true
      },
      // 点击修改按钮
      goEdit () {
        this.aAddName = []
        get('/md/detail/' + this.sCurrentId).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.aAddName = res.data.attributes
            const instance = res.data
            this.oEditForm.sType = instance.classifierName + '(' + instance.classifierId + ')'
            this.oEditForm.sCode = instance.code
            this.oEditForm.sName = instance.name
          } else {
            this.$message.error(res.message)
          }
        })
        this.title = '修改'
        this.bAdd = false
        this.bShowEdit = true
      },
      // 点击Tabs标签切换
      tabClick (data) {
        // console.log("tabClick (data)", data)
        if (data.name === "relateTable") {
          this.classifierIdForMata = 'Table'
        }
        if (data.name === "relateColumn") {
          this.classifierIdForMata = 'Column'
        }
        this.sTabClassifierId = data.name
        this.oList.iCurrentPage = 1
        this.getList()
      },
      // 获取Tabs除原数据信息选项以外列表
      getList () {
        this.oList.bLoading = true
        get('/md/search', {
          classifierId: this.sTabClassifierId,
          parentId: this.sCurrentId,
          current: this.oList.iCurrentPage,
          size: this.oList.iCurrentSize
        }).then(res => {
          if (res.code === 10000 && res.success === true) {
            const data = res.data
            this.oList.aList = data.records
            this.oList.iTotal = data.total
            this.oList.bLoading = false
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 修改列表一页数据大小
      handleSizeChange (value) {
        this.oList.iCurrentSize = value
        this.getList()
      },
      // 跳转列表页面
      handleCurrentChange (value) {
        this.oList.iCurrentPage = value
        this.getList()
      },
      // 点击返回按钮
      goReturn () {
        this.bShowEdit = false
        if (this.title === '新增') {
          this.$refs['oAddForm'].resetFields()
        } else {
          this.$refs['oEditForm'].resetFields()
        }
      },
      // 点击保存按钮
      goSave () {
        if (this.title === '新增') {
          this.$refs.oAddForm.validate(valid => {
            if (valid) {
              this.save('createMetadata')
            } else {
              this.$message.error('请按以下规则填写信息')
            }
          })
        } else {
          this.$refs.oEditForm.validate(valid => {
            if (valid) {
              this.save('editMetadata')
            } else {
              this.$message.error('请按以下规则填写信息1')
            }
          })
        }
      },
      save (url) {
        let params = {
          FROM_CLASSIFIER_ID: this.sCurrentClassId
        }
        if (url === 'createMetadata') {
          params.instanceCode = this.oAddForm.sCode
          params.instanceName = this.oAddForm.sName
          params.classifierName = this.classifierName
          params.classifierId = this.classifierId
          params.parentId = this.sCurrentId
        }
        if (url === 'editMetadata') {
          params.instanceCode = this.oEditForm.sCode
          params.instanceName = this.oEditForm.sName
          params.instanceId = this.sCurrentId
          params.classifierId = this.sCurrentClassId
        }
        if (this.aAddName.length !== 0) {
          this.aAddName.forEach(i => {
            if (i.datatypeId === 'time') {
              i.value = (i.value).Format('yyyy-MM-dd')
            }
            params[i.attStore] = i.value
          })
        }
        post('/md/' + url, params).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.$message.success(res.message)
            this.node.childNodes = []
            this.loadNode(this.node, this.resolve)
            this.sNodeType = ''
            this.bShowEdit = false
            this.bAdd = true
            this.aPath = []
            this.sCurrentId = ''
            this.sCurrentClassId = ''
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 点击跳转详情页
      goDetail (item) {
        // console.log(item)
        this.$router.push({
          name: 'impactAndLineageDetail', // '元数据'详情页
          params: {
            _title: item.name,
            id: item.id,
            classifierId: item.classifierId
          }
        })
      },
      // 点击影响分析
      goInfluence () {
        this.$router.push({
          name: 'impactAnalysisCanvas',
          params: {
            id: this.sCurrentId,
            _title: this.sCode,
            classifierId: this.sCurrentClassId
          }
        })
      },
      // 点击血统分析
      goAncestry () {
        this.$router.push({
          name: 'lineageAnalysisCanvas',
          params: {
            id: this.sCurrentId,
            _title: this.sCode,
            classifierId: this.sCurrentClassId
          }
        })
      }
    },
    computed: {
      ...mapGetters(['roles'])
    },
    mounted () {
    },
    created () {
      this.getView()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "../../styles/treeIcon";
  @import "../../styles/variables";
  @import "../../styles/switch";

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
      margin-top: 15px;
    }
    .schema-filter{
      /deep/ .select{
        .el-input{
          input{
            -moz-border-radius-topright: 0px;
            -moz-border-radius-bottomright: 0px;
            background-color: #f8f8f9;
          }
        }
      }
      /deep/ .text input{
        border-radius: 0px;
        border-left: none;
        border-right: none;
      }
      button{
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
      .el-container{
        padding: 10px;
      }
      .el-aside{

      }
      .el-main{
        margin-left:10px;
        padding:0;
      }
      .resize{
        right:5px;
      }
      .resize:hover{
      cursor:e-resize;
      }
      .left-box {
        height: 100%;
        .el-card {
          height: 100%;
          .el-card__body {
            padding: 16px;
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
            .md-tree::-webkit-scrollbar{
              width:5px;
              height:10px;
            }
            .md-tree::-webkit-scrollbar-track{
              background: none;
              border-radius:2px;
            }
            .md-tree::-webkit-scrollbar-thumb{
              background: rgb(239, 239, 239);
              border-radius:10px;
            }
            .md-tree::-webkit-scrollbar-thumb:hover{
              background:#bfbfbf;
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
        .el-card {
          width: 100%;
          height: 100%;
          .el-card__body {
            padding: 16px;
            position: relative;
            .no-data {
              width: 500px;
              height: 457px;
              background: url("./../../assets/images/commonIcon/no-data.png") no-repeat;
              background-size: 500px 457px;
              margin: 30px auto;
            }
            .action-box {
              position: absolute;
              display: inline-block;
              right: 16px;
              z-index: 99;
              .el-button {
                cursor: pointer;
              }
            }
            .md-content {
              width: 100%;
              height: calc(100vh - 190px);
              overflow-y: auto;
              .md-action {
                display: flex;
                align-items: center;
                padding-bottom: 10px;
                border-bottom: 1px solid $border;
                .dropdow-btn {
                  padding-left: 35px;
                  margin-right: 10px;
                  .add-icon {
                    position: absolute;
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    left: 8px;
                    top: 6px;
                    background: url("./../../assets/images/commonIcon/add.png") no-repeat;
                    background-size: 100%;
                  }
                }
                .edit-btn {
                  padding: 7px 15px;
                  i {
                    font-size: 16px;
                    padding-right: 8px;
                  }
                }
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
          }
        }
      }
    }
        /deep/ .el-table{
      font-size: 12px
    }
    .child-search {
      text-align: right;
      margin-bottom: 10px;
    /deep/.el-input__inner {
    width:200px;
    }
 }
  //表格中a标签颜色
  .a-color {
    color: #2d8cf0;
    //font-weight: bold;
  }
}
</style>
