<!--数据库信息页面-->
<template>
  <div class="schema-info dashboard-editor-container">
<!--    <metadata-browse :aSysChildType="aSysChildType" :instanceId="instanceId" ></metadata-browse>-->
    <div class="content-box">
      <div class="left-box">
        <el-card shadow="hover">
          <div class="title">
            <span style="font-size: 14px;">数据库信息</span>
            <el-switch v-model="bShowCode" class="switchStyle"
                       :width="60"
                       active-color="#09e"
                       active-text="代码"
                       inactive-color="#09e"
                       inactive-text="名称">
            </el-switch>
          </div>
          <!--数据库信息过滤区-->
          <div class="schema-filter">
            <el-form :inline="true" :model="schemaFilterForm" class="demo-form-inline">
              <el-form-item label="" style="width: 75px;">
                <el-select class="select" size="small" v-model="schemaFilterForm.sysChildType" placeholder="请选择">
                  <el-option v-for="item in aSysChildType"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" label-width="195px">
                <el-input class="text" size="small" v-model="schemaFilterForm.keyword" placeholder="请输入关键字..."></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="text" size="small" @click="onSchemaSearch" icon="el-icon-search"></el-button>
              </el-form-item>
            </el-form>
          </div>
          <!--数据库信息 的 tree-->
          <div class="md-tree">
            <el-tree v-if="isShowTree"
                     :props="props"
                     :load="loadNode"
                     node-key="id"
                     ref="tree"
                     lazy
                     :highlight-current="true"
                     empty-text="暂无数据"
                     @node-click="handleNodeClick"
                     :render-content="renderContent">
            </el-tree>
            <!--表搜索树结构-->
            <div v-if="isShowTableTree">
              <el-tree
                  :load="loadNode"
                  node-key="id"
                  lazy
                  :props="defaultProps"
                  :highlight-current="true"
                  @node-click="handleNodeTableClick"
                  :render-content="renderContent">
              </el-tree>
            </div>
            <!--字段搜索结构-->
            <div v-if="isShowSearchList" style="font-size: 14px" class="column-class">
              <div v-if="searchListData.length === 0" style="margin-left: 5px">暂无数据</div>
              <div v-for="item in searchListData" @click="getDetails(item)" style="cursor: pointer">
                <span v-if="item.classifierId === 'Column'" class="icon icon-Column"></span>
                <span v-if="item.classifierId === 'SQLIndex'" class="icon icon-SQLIndex"></span>
                <span v-if="item.classifierId === 'View'" class="icon icon-View"></span>
                <span v-if="item.classifierId === 'Procedure'" class="icon icon-Procedure"></span>
                <span v-if="item.classifierId === 'ProcedureColumn'" class="icon icon-ProcedureColumn"></span>
                <span v-if="item.classifierId === 'PrimaryKey'" class="icon icon-PrimaryKey"></span>
                {{bShowCode ? item.code : item.name}}
              </div>
              <!--查看更多-->
              <div v-if="isSearchLastPage" @click="handleSearchListMore" style="cursor: pointer">
                >> 查看更多
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div class="right-box">
        <el-card shadow="hover" class="card-container">
          <div class="no-data" v-if="isShowNoData">
          </div>
          <div class="has-data" v-else="!isShowNoData">
            <div class="title-btn-class" v-if="bShowBtn">
              <el-button type="primary" size="small"  v-permission="'IMPACT_ANALYSIS'" @click="showImpact(sId, sCode)">影响分析</el-button>
              <el-button type="primary" size="small"  v-permission="'LINEAGE_ANALYSIS'" @click="showLineage(sId, sCode)">血统分析</el-button>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="元数据信息" name="1">
                <!-- 折叠面板 -->
                <el-collapse v-model="collapseActiveNames">
                  <el-collapse-item title="基本信息" name="1">
                    <one-column-vertical-table :columnTableData="oBaseInfo.aTableData"
                                               :showelTable="true"></one-column-vertical-table>
                  </el-collapse-item>
                  <el-collapse-item title="属性信息" name="2">
                    <one-column-vertical-table :column-table-data="oAttsinfo.aTableData"
                                               :showelTable="true"></one-column-vertical-table>
                  </el-collapse-item>
                  <!--只有table才显示-->
                  <el-collapse-item title="数据问题" name="3" v-show="isShowDataProblem">
                    <el-table
                        border
                        :data="dataProblemData"
                        style="width: 100%">
                      <el-table-column
                          prop="metaName"
                          label="问题编号">
                      </el-table-column>
                      <el-table-column
                          prop="metaName"
                          label="问题描述">
                      </el-table-column>
                      <el-table-column
                          prop="metaName"
                          label="提交人">
                      </el-table-column>
                      <el-table-column
                          prop="metaName"
                          label="提交时间">
                      </el-table-column>
                    </el-table>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
              <el-tab-pane label="引用标准" name="2" v-if="isShowTwoTabCon">
                <el-card class="card-table">
                  <el-table
                      border
                      :data="oQuote.quoteData"
                      style="width: 100%">
                    <el-table-column
                        prop="metaName"
                        label="标准编号">
                      <template slot-scope="scope"><a class="a-color"> {{scope.row.metaCode}} </a></template>
                    </el-table-column>
                    <el-table-column
                        prop="metaName"
                        label="标准名称">
                    </el-table-column>
                    <el-table-column
                        label="元数据代码">
                      <template slot-scope="scope"><a class="a-color"> {{scope.row.metaCode}} </a></template>
                    </el-table-column>
                    <el-table-column
                        prop="metaName"
                        label="元数据名称">
                    </el-table-column>
                  </el-table>
                </el-card>
                <div style="text-align: center; padding: 10px 0">
                  <el-pagination v-if="oQuote.oPage.total !== 0"
                                 @size-change="handleSizeChange"
                                 @current-change="handleCurrentChange"
                                 :current-page="oQuote.oPage.pageCurrent"
                                 :page-sizes="[10, 20, 30, 40]"
                                 :page-size="oQuote.oPage.pageSize"
                                 layout="total, sizes, prev, pager, next, jumper"
                                 :total="oQuote.oPage.total">
                  </el-pagination>
                </div>
              </el-tab-pane>
              <el-tab-pane label="稽核方法" name="3" v-if="isShowTwoTabCon">
                <el-card class="card-table">
                  <el-table
                      border
                      :data="oAudit.auditData"
                      style="width: 100%">
                    <el-table-column
                        prop="metaName"
                        label="方法编号">
                      <template slot-scope="scope"><a class="a-color"> {{scope.row.metaCode}} </a></template>
                    </el-table-column>
                    <el-table-column
                        prop="metaName"
                        label="方法名称">
                    </el-table-column>
                    <el-table-column
                        prop="metaName"
                        label="方法描述">
                    </el-table-column>
                    <el-table-column
                        label="业务规则编号">
                      <template slot-scope="scope"><a class="a-color"> {{scope.row.metaCode}} </a></template>
                    </el-table-column>
                  </el-table>
                </el-card>
                <div style="text-align: center; padding: 10px 0">
                  <el-pagination v-if="oAudit.oPage.total !== 0"
                                 @size-change="handleSizeChange2"
                                 @current-change="handleCurrentChange2"
                                 :current-page="oAudit.oPage.pageCurrent"
                                 :page-sizes="[10, 20, 30, 40]"
                                 :page-size="oAudit.oPage.pageSize"
                                 layout="total, sizes, prev, pager, next, jumper"
                                 :total="oAudit.oPage.total">
                  </el-pagination>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  import { get, parseAjaxResponse } from '../../../src/utils/request'
  import impactAndLineageDetail from "./impactAndLineageDetail";
  import oneColumnVerticalTable from "./components/oneColumnVerticalTable";

  // import metadataBrowse from "./metadataBrowse";
  export default {
    name: "schemaInfo",
    components: {
      // metadataBrowse,
      impactAndLineageDetail,
      oneColumnVerticalTable
    },
    data() {
      return {
        // 显示模式是否展示代码
        bShowCode: true,
        isShowNoData: true,
        // 数据库过滤信息
        schemaFilterForm: {
          sysChildType: '',
          keyword: ''
        },
        props: {
          label: 'text',
          children: 'children',
          isLeaf: 'isLeaf'
        },
        defaultProps: {
          label: 'code',
          children: 'children',
          isLeaf: 'isLeaf'
        },
        tableTreeData: [],
        searchListData: [],
        isSearchLastPage: false,
        searchCurrentPage: 1,

        resolve: [],

        resolveMore: [],
        isMore: false, // 查看更多 flag
        treeCurrentPage: 1,

        tableTreeCurrentPage: 1,

        isTableMore: false,

        activeName: '1',
        collapseActiveNames: ['1', '2', '3'], // Collapse 折叠面板是否打开
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
        // 数据问题
        dataProblemData: [],
        isShowDataProblem: false, // 数据问题，是否显示

        sNodeType: '',
        sCode: '',
        sId: '',
        classifierId: '',
        bShowBtn: false, // 显示影响分析和血缘分析的按钮与否

        isShowTree: true,
        isShowTableTree: false,
        isShowSearchList: false,

        isShowTwoTabCon: false,

        oQuote: {
          quoteData: [],
          oPage: {
            pageCurrent: 1,
            pageSize: 10,
            total: 0
          }
        },
        oAudit: {
          auditData: [],
          oPage: {
            pageCurrent: 1,
            pageSize: 10,
            total: 0
          }
        },
        instanceId: this.$route.params.id,
        aSysChildType: [],
        bSchemaSearchFlag: false // 是否搜索标志 flag
      }
    },
    methods: {
      showImpact(id, _title) {
        this.$router.push({
          name: 'impactAnalysisCanvas',
          params: {
            id: id,
            _title: _title,
            classifierId: this.classifierId
          }
        })
      },
      showLineage(id, _title) {
        this.$router.push({
          name: 'lineageAnalysisCanvas',
          params: {
            id: id,
            _title: _title,
            classifierId: this.classifierId
          }
        })
      },
      setIsShowAnalysis() {
        if (this.classifierId === 'Table' || this.classifierId === 'Column' || this.classifierId === 'Schema' || this.classifierId === 'View') {
          this.bShowBtn = true
        } else {
          this.bShowBtn = false
        }
      },
      setShowDataProblem() {
        // 只有元数据类型为table，才显示数据问题
        if (this.classifierId === 'Table') {
          this.isShowDataProblem = true
        } else {
          this.isShowDataProblem = false
        }
      },
      setShowTwoTabCon() {
        if (this.classifierId === 'Column' || this.classifierId === 'Table') {
          this.isShowTwoTabCon = true
        } else {
          this.isShowTwoTabCon = false
        }
      },
      // 查询系统下的元模型供下拉框使用  /mm/listSysChildType
      getListSysChildType() {
        get('/mm/listSysChildType', {
          instanceId: this.instanceId // 系统ID
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.aSysChildType = res.data
            }
          })
        })
      },
      // 表树结构点击节点事件
      handleNodeTableClick(data, node, resolve) {
        console.log(`当前节点${node.level}`)
        console.log(`当前节点类别${data.nodeType}`)
        console.log(`当前元数据类型${data.classifierId}`)
        this.classifierId = data.classifierId
        // 只有元数据类型为table，才显示数据问题
        this.setShowDataProblem()
        this.setShowTwoTabCon()
        if (data.nodeType === 'metadata') {
          this.getDetails(data)
        } else { // nodeType节点类型 不是metadata，右侧没有数据
          this.isShowNoData = true
        }
        if (data.code === "查看更多") {
          this.node = node
          this.getTableMoreData(node.parent)
        }
      },
      getDetails(data) {
        this.oBaseInfo.bLoading = true
        this.oAttsinfo.bLoading = true
        // 设置左上角两个btn是否可见
        this.setIsShowAnalysis()
        get('/md/detail/' + data.id).then(res => {
          // 加载loading，可见 true
          this.oBaseInfo.bLoading = true
          this.oAttsinfo.bLoading = true
          parseAjaxResponse(res, () => {
            if (res.code === 10000 && res.success === true) {
              this.isShowNoData = false // 此时有数据，无数据参数，设置为false
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
              this.sId = data.id
              this.oBaseInfo.bLoading = false
              this.oAttsinfo.bLoading = false
              // 属性信息
              if (data.attributes !== undefined) {
                this.oAttsinfo.aTableData = []
                data.attributes.forEach((item, index) => {
                  let objTemp = {}
                  objTemp.key = item.name
                  objTemp.value = item.value
                  this.oAttsinfo.aTableData.push(objTemp)
                })
              }
            }
          })
        })
      },
      // 刷新搜索数据
      refreshData() {
        console.log(this.schemaFilterForm.sysChildType, 'this.schemaFilterForm.sysChildType');
        let arr = ['Column', 'PrimaryKey', 'SQLIndex', 'View', 'Procedure', 'ProcedureColumn'];
        if (arr.indexOf(this.schemaFilterForm.sysChildType) > -1) { // 字段等列表搜索
          this.isShowTree = false;// 树结构隐藏
          this.isShowTableTree = false;// 搜索表tree隐藏
          this.isShowSearchList = true;// 搜索列表显示
          this.searchListData = [];
          this.getSearchData();
        } else if (this.schemaFilterForm.sysChildType === 'Table') { // 表查询
          this.isShowTree = false;
          this.isShowSearchList = false;
          this.isShowTableTree = true;
          this.tableTreeData = [];
          this.getSearchTableData();
        }
      },
      // 表 查看更多
      getTableMoreData(node) {
        console.log(node)
        this.isTableMore = true
        node.parent = {}
        let _node = node.parent
        let params = {
          nodeType: 'metaModel', // 数据库信息搜索时，nodeType固定为metaModel
          systemId: this.instanceId, // 上一个页面跳转过来的系统的id
          classifierId: this.schemaFilterForm.sysChildType, // 元数据类型
          keyword: this.schemaFilterForm.keyword // 搜索的关键字
        }
        if (node.level === 0) {
          this.tableTreeCurrentPage = this.tableTreeCurrentPage + 1
          params.current = this.tableTreeCurrentPage
        }
        // this.loadNode(node, this.resolve)
        get('/md/tree', params).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              if (res.data.length) {
                if (this.isTableMore) { // 拼接数据
                  // _node.data.current = this.treeCurrentPage
                  _node.data = {
                    children: []
                  }
                  let childNodes = node.childNodes
                  childNodes.forEach((item, index) => {
                    if (item.data.code !== "查看更多") {
                      // res.data.splice(index, 0, item.data)
                      _node.data.children.splice(index, 0, item.data)
                    }
                  })
                  this.isTableMore = false
                }
                // 查看更多
                if (res.extras !== undefined) {
                  if (res.extras.hasNextPage) {
                    res.data.push({
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
                this.refreshLazyTree(node, _node.data.children)
              }
            }
          })
        })
      },
      // 表搜索
      getSearchTableData() {
        this.bSchemaSearchFlag = true
        this.loadNode(this.node, this.resolve)
      },
      // 除表外，字段等的搜索
      getSearchData() {
        get('/md/tree', {
          nodeType: 'metaModel', // 数据库信息搜索时，nodeType固定为metaModel
          systemId: this.instanceId, // 上一个页面跳转过来的系统的id
          classifierId: this.schemaFilterForm.sysChildType, // 元数据类型
          keyword: this.schemaFilterForm.keyword, // 搜索的关键字
          current: this.searchCurrentPage
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              console.log(res.data)
              console.log('searchListData')
              // 查看更多
              if (res.extras !== undefined) {
                if (res.extras.hasNextPage) {
                  this.isSearchLastPage = true
                } else {
                  this.isSearchLastPage = false
                }
              }
              this.searchListData = this.searchListData.concat(res.data)
            }
          })
        })
      },
      handleSearchListMore() {
        if (this.isSearchLastPage) {
          this.searchCurrentPage = this.searchCurrentPage + 1
          this.getSearchData()
        }
      },
      // Tree懒加载
      loadNode (node, resolve) {
        this.node = node
        this.resolve = resolve
        if (this.bSchemaSearchFlag) {
          if (node.level === 0) {
            let params = {
              nodeType: 'metaModel', // 数据库信息搜索时，nodeType固定为metaModel
              systemId: this.instanceId, // 上一个页面跳转过来的系统的id
              classifierId: this.schemaFilterForm.sysChildType, // 元数据类型
              keyword: this.schemaFilterForm.keyword // 搜索的关键字
            }
            if (this.isTableMore) {
              this.tableTreeCurrentPage = this.tableTreeCurrentPage + 1
              params.current = this.tableTreeCurrentPage
            } else {
              params.current = 1
            }
            get('/md/tree', params).then((res) => {
              parseAjaxResponse(res, () => {
                if (res.code === 10000) {
                  if (res.data.length) {
                    // 增加current属性
                    res.data.forEach((item, index) => {
                      item.current = 1
                    })
                    console.log(res.data)
                    // 查看更多
                    if (res.extras !== undefined) {
                      if (res.extras.hasNextPage) {
                        res.data.push({
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
                }
              })
            })
          } else {
            this.node = node
            this.resolve = resolve
            let childNodes = this.node.childNodes
            let obj = {
              code: '暂无数据',
              text: '暂无数据',
              isLeaf: true
            }
            childNodes.push(obj)
            return this.resolve(childNodes)

            // get('/md/tree', { //搜索
            //   nodeType: 'metaModel', //数据库信息搜索时，nodeType固定为metaModel
            //   systemId: this.instanceId, // 上一个页面跳转过来的系统的id
            //   classifierId: this.schemaFilterForm.sysChildType, //元数据类型
            //   keyword: this.schemaFilterForm.keyword, //搜索的关键字
            // }).then((res)=>{
            //   console.log(111)
            //   parseAjaxResponse(res, ()=>{
            //     if (res.code === 10000) {
            //       // 查看更多
            //       if(res.extras !== undefined) {
            //         if (res.extras.hasNextPage) {
            //           res.data.push({
            //             id: null,
            //             code: '查看更多',
            //             name: '查看更多',
            //             text: '查看更多',
            //             isLeaf: true
            //           });
            //         }
            //       }
            //       console.log(res.data)
            //       return resolve(res.data)
            //     }
            //   })
            // })
          }
        } else {
          if (node.level === 0) {
            this.node = node
            this.resolve = resolve
            // 查询系统下关联的数据库信息 /md/listSchemaUnderSystemForTree
            get('/md/listSchemaUnderSystemForTree', {
              systemId: this.instanceId // 系统ID
            }).then((res) => {
              parseAjaxResponse(res, () => {
                if (res.code === 10000) {
                  return resolve(res.data)
                }
              })
            })
          } else {
            if (!this.isMore) { // 非查看更多 flag
              this.treeCurrentPage = 1
            }
            let params = {
              nodeType: node.data.nodeType,
              current: this.treeCurrentPage
            }
            if (node.data.nodeType === 'metaModel') {
              params.classifierId = node.data.classifierId
              params.parentId = node.data.parentNodeId
            } else {
              params.id = node.data.id
            }
            if (this.bSchemaSearchFlag) { // 数据库信息搜索时，nodeType固定为metaModel
              params.nodeType = 'metaModel'
              params.systemId = this.instanceId
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
      refreshLazyTree(node, children) {
        var theChildren = node.childNodes
        theChildren.splice(0, theChildren.length)
        node.doCreateChildren(children)
      },
      // 查看更多
      getMoreData(node) {
        this.isMore = true // 查看更多 flag，赋值true
        let _node = node.parent
        if (this.isMore) { // 查看更多 flag
          this.treeCurrentPage = _node.data.current + 1
        } else {
          this.treeCurrentPage = 1
        }
        let params = {
          nodeType: _node.data.nodeType,
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
      // 点击Tree节点
      handleNodeClick (data, node, resolve) {
        console.log(`当前节点${node.level}`)
        console.log(`当前节点类别${data.nodeType}`)
        console.log(`当前元数据类型${data.classifierId}`)
        this.sNodeType = data.nodeType
        this.classifierId = data.classifierId
        // 只有元数据类型为table，才显示数据问题
        this.setShowDataProblem()
        this.setShowTwoTabCon()
        if (data.nodeType === 'metadata') {
          this.getDetails(data)
          // todo 其他接口库  获取引用标准 稽核方法 表格信息
        } else { // nodeType节点类型 不是metadata，右侧没有数据
          this.isShowNoData = true
        }
        if (data.code === "查看更多") {
          this.getMoreData(node)
        }
      },
      onSchemaSearch() {
        // this.loadNode(this.node, this.resolve)
        if (this.schemaFilterForm.keyword) {
          this.refreshData();// 搜索关键字时
        }
        if (!this.schemaFilterForm.sysChildType) {
          // 如果类型为空时，提示选择类型
          this.$message.warning('请选择元数据类型!');
        }
      },

      // 点击tabs
      handleClick(tab, event) {
        console.log(tab)
      },
      handleSizeChange(val) {},
      handleCurrentChange(val) {},

      handleSizeChange2(val) {},
      handleCurrentChange2(val) {}
    },

    mounted () {
    },
    created () {
      this.getListSysChildType()
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "./../../styles/dq/main-card-table.scss";
  @import "../../styles/md/schema-info";

</style>
