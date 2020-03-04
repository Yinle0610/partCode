<!--元数据详情-->
<template>
  <div class="auditingQuesDetails dashboard-editor-container">
    <el-card shadow="hover" class="card-container">
      <div class="title-btn-class" v-if="showDataFlowBtn">
        <el-button type="primary" size="small" v-permission="'IMPACT_ANALYSIS'" @click="showImpact(instanceId, instanceCode)">影响分析</el-button>
        <el-button type="primary" size="small" v-permission="'LINEAGE_ANALYSIS'" @click="showLineage(instanceId, instanceCode)">血统分析</el-button>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="元数据信息" name="1">
          <!-- 折叠面板 -->
          <el-collapse v-model="collapseActiveNames" @change="handleChange">
            <el-collapse-item title="基本信息" name="1">
              <one-column-vertical-table :columnTableData="baseTableData"
                                         :showelTable="true"></one-column-vertical-table>
            </el-collapse-item>
            <el-collapse-item title="属性信息" name="2">
              <one-column-vertical-table :column-table-data="arrtTableData"
                                         :showelTable="true"></one-column-vertical-table>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane label="库" name="Schema" v-if="isSchemaVisible">
          <el-row>
            <el-col :offset="19" :span="5">
              <el-input clearable size="small" placeHolder="搜索" v-model="searchKeyWord"
                        @keyup.enter.native="searchDataByKeyword('Schema')"></el-input>
            </el-col>
          </el-row>
          <el-card class="card-table">
            <el-table
                border
                :data="schemaTableData"
                style="width: 100%">
              <el-table-column
                  prop="metaName"
                  label="元数据名称">
              </el-table-column>
              <el-table-column
                  label="元数据代码">
                <template slot-scope="scope"><a class="a-color"> {{scope.row.metaCode}} </a></template>
              </el-table-column>
            </el-table>
          </el-card>
          <div style="text-align: center; padding: 10px 0">
            <el-pagination v-if="total !== 0"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="[10, 20, 30, 40]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="转换" name="Transformer" v-if="isTransferVisible">
          <el-row>
            <el-col :offset="19" :span="5">
              <el-input clearable size="small" placeHolder="搜索" v-model="searchKeyWord"
                        @keyup.enter.native="searchDataByKeyword('Transformer')"></el-input>
            </el-col>
          </el-row>
          <el-card class="card-table">
            <el-table
                border
                :data="transformerTableData"
                style="width: 100%">
              <el-table-column
                  prop="metaName"
                  label="元数据名称"
                  width="200">
              </el-table-column>
              <el-table-column
                  label="元数据代码"
                  width="200">
                <template slot-scope="scope"><a class="a-color"> {{scope.row.metaCode}} </a></template>
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="作者"
                  width="200">
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="编写日期"
                  width="200">
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="版权声明"
                  width="200">
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="代码路径"
                  width="200">
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="所属公司"
                  width="200">
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="简述"
                  width="200">
              </el-table-column>
            </el-table>
          </el-card>
          <div style="text-align: center; padding: 10px 0">
            <el-pagination v-if="total !== 0"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="[10, 20, 30, 40]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="目录" name="Catalog" v-if="oCatalog.isCatalogVisible">
          <el-row>
            <el-col :offset="19" :span="5">
              <el-input clearable size="small" placeHolder="搜索" v-model="searchKeyWord"
                        @keyup.enter.native="searchDataByKeyword('Catalog')"></el-input>
            </el-col>
          </el-row>
          <el-card class="card-table">
            <el-table
                border
                :data="oCatalog.catalogTableData"
                style="width: 100%">
              <el-table-column
                  prop="metaName"
                  label="元数据名称">
              </el-table-column>
              <el-table-column
                  label="元数据代码">
                <template slot-scope="scope"><a class="a-color"> {{scope.row.metaCode}} </a></template>
              </el-table-column>
              <el-table-column
                  prop="att1"
                  label="默认校检名称"
                  width="200">
              </el-table-column>
              <el-table-column
                  prop="att2"
                  label="默认字符集名"
                  width="200">
              </el-table-column>
            </el-table>
          </el-card>
          <div style="text-align: center; padding: 10px 0">
            <el-pagination v-if="total !== 0"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="[10, 20, 30, 40]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="系统层次" name="SystemLevel" v-if="oSystemLevel.isSystemLevelVisible">
          <el-row>
            <el-col :offset="19" :span="5">
              <el-input clearable size="small" placeHolder="搜索" v-model="searchKeyWord"
                        @keyup.enter.native="searchDataByKeyword('SystemLevel')"></el-input>
            </el-col>
          </el-row>
          <el-card class="card-table">
            <el-table
                border
                :data="oSystemLevel.systemLevelTableData"
                style="width: 100%">
              <el-table-column
                  prop="metaName"
                  label="元数据名称">
              </el-table-column>
              <el-table-column
                  label="元数据代码">
                <template slot-scope="scope"><a class="a-color"> {{scope.row.metaCode}} </a></template>
              </el-table-column>
            </el-table>
          </el-card>
          <div style="text-align: center; padding: 10px 0">
            <el-pagination v-if="total !== 0"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="[10, 20, 30, 40]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="存储过程参数" name="ProcedureColumn" v-if="oProcedureColumn.isProcedureColumnVisible">
          <el-row>
            <el-col :offset="19" :span="5">
              <el-input clearable size="small" placeHolder="搜索" v-model="searchKeyWord"
                        @keyup.enter.native="searchDataByKeyword('ProcedureColumn')"></el-input>
            </el-col>
          </el-row>
          <el-card class="card-table">
            <el-table
                border
                :data="oProcedureColumn.procedureColumnTableData"
                style="width: 100%">
              <el-table-column
                  prop="metaName"
                  label="元数据名称">
              </el-table-column>
              <el-table-column
                  label="元数据代码">
                <template slot-scope="scope"><a class="a-color"> {{scope.row.metaCode}} </a></template>
              </el-table-column>
            </el-table>
          </el-card>
          <div style="text-align: center; padding: 10px 0">
            <el-pagination v-if="total !== 0"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="[10, 20, 30, 40]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="系统" name="System" v-if="oSystem.isSystemVisible">
          <el-row>
            <el-col :offset="19" :span="5">
              <el-input clearable size="small" placeHolder="搜索" v-model="searchKeyWord"
                        @keyup.enter.native="searchDataByKeyword('System')"></el-input>
            </el-col>
          </el-row>
          <el-card class="card-table">
            <el-table
                border
                :data="oSystem.systemTableData"
                style="width: 100%">
              <el-table-column
                  prop="metaName"
                  label="元数据名称">
              </el-table-column>
              <el-table-column
                  label="元数据代码">
                <template slot-scope="scope"><a class="a-color"> {{scope.row.metaCode}} </a></template>
              </el-table-column>
            </el-table>
          </el-card>
          <div style="text-align: center; padding: 10px 0">
            <el-pagination v-if="total !== 0"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="[10, 20, 30, 40]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import oneColumnVerticalTable from './components/oneColumnVerticalTable'
  import twoColumnVerticalTable from './components/twoColumnVerticalTable'
  import { searchMetaDataDetails, getChildClassifierOfMetaData, getChildOfMetaData } from '@/api/metaData/index'

  export default {
    name: 'summaryDepositDate',
    components: { oneColumnVerticalTable, twoColumnVerticalTable },
    data() {
      return {
        editableTabs: [{
          title: 'Tab 1',
          name: '1'
        }, {
          title: 'Tab 2',
          name: '2'
        }],

        activeName: '1',
        collapseActiveNames: ['1', '2'], // Collapse 折叠面板是否打开
        // 基本信息-表格数据
        baseTableData: [],
        arrtTableData: [], // 属性信息
        total: 0,
        currentPage: 1,
        pageSize: 10,
        sTabName: '', // tab标签的name

        schemaTableData: [], // 库的表格数据
        isSchemaVisible: false,
        totalSchema: 10,
        currentPageSchema: 1,

        transformerTableData: [], // 转换的表格数据
        isTransferVisible: false,
        totalTransformer: 10,
        currentPageTransformer: 1,

        oCatalog: {
          catalogTableData: [], // 目录的表格数据
          isCatalogVisible: false
        },
        oSystemLevel: {
          systemLevelTableData: [], // 系统层次的表格数据
          isSystemLevelVisible: false
        },
        oProcedureColumn: { // 存储过程参数
          procedureColumnTableData: [], // 存储过程参数的表格数据
          isProcedureColumnVisible: false
        },
        oSystem: { // 系统层次
          systemTableData: [], // 系统层次的表格数据
          isSystemVisible: false
        },

        instanceId: this.$route.params.id, // 元数据id
        classifierId: '',
        instanceCode: '',

        query: {
          classifierId: '', // 元数据类型id (必传)
          instanceId: '' // 元数据id (必传)
        },
        querySchemaChild: { // 元数据的子元数据-查询参数
          relateClassifierId: '',
          instanceId: '',
          keyword: '',
          pageCurrent: this.currentPage, // 当前页
          pageSize: this.pageSize // 一页最多显示记录数
        },
        queryTransferChild: { // 元数据的子元数据-查询参数
          relateClassifierId: '',
          instanceId: '',
          keyword: '',
          pageCurrent: this.currentPage, // 当前页
          pageSize: this.pageSize // 一页最多显示记录数
        },
        queryCatalogChild: { // 元数据的子元数据-查询参数
          relateClassifierId: '',
          instanceId: '',
          keyword: '',
          pageCurrent: this.currentPage, // 当前页
          pageSize: this.pageSize // 一页最多显示记录数
        },
        querySystemLevelChild: { // 元数据的子元数据-查询参数
          relateClassifierId: '',
          instanceId: '',
          keyword: '',
          pageCurrent: this.currentPage, // 当前页
          pageSize: this.pageSize // 一页最多显示记录数
        },
        queryProcedureColumnChild: { // 元数据的子元数据-查询参数
          relateClassifierId: '',
          instanceId: '',
          keyword: '',
          pageCurrent: this.currentPage, // 当前页
          pageSize: this.pageSize // 一页最多显示记录数
        },
        querySystemChild: { // 元数据的子元数据-查询参数
          relateClassifierId: '',
          instanceId: '',
          keyword: '',
          pageCurrent: this.currentPage, // 当前页
          pageSize: this.pageSize // 一页最多显示记录数
        },

        childInfoTabs: [], // tabs 标签数数组数据
        searchKeyWord: '',
        // 搜索flag
        searchFlagSchema: true,
        searchFlagTransformer: true,
        searchFlagCatalog: true,
        searchFlagSystemLevel: true,
        searchFlagProcedureColumn: true,
        searchFlagSystem: true,

        showDataFlowBtnClassifierIds: ['Schema', 'Table', 'Column']
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
      // 元数据详情信息
      metaDataDetails() {
        const id = this.$route.params.id
        searchMetaDataDetails(id).then((res) => {
          if (res.code === 10000) {
            // 基本信息
            this.baseTableData = [
              { key: '元数据代码', value: res.data.code },
              { key: '元数据名称', value: res.data.name },
              { key: '元数据类型', value: res.data.classifierName + '(' + res.data.classifierId + ')' },
              { key: '上下文路径', value: res.data.path },
              { key: '生效时间', value: res.data.startTime }
            ]
            this.classifierId = res.data.classifierId
            this.instanceCode = res.data.code
            const aAttrData = res.data.attributes // 属性信息
            aAttrData.forEach((item) => {
              const obj = {}
              obj.key = item.name
              obj.value = item.value !== undefined ? item.value : ''
              this.arrtTableData.push(obj)
            })
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 获取元数据的所有子元数据类型
      childClassifierOfMetaData() {
        this.query.instanceId = this.$route.params.id
        this.query.classifierId = this.$route.params.classifierId !== undefined ? this.$route.params.classifierId : null
        getChildClassifierOfMetaData(this.query).then((res) => {
          if (res.code === 10000) {
            this.childInfoTabs = res.data
            if (this.childInfoTabs !== undefined) {
              this.childInfoTabs.find((item) => {
                if (item.classifierId === 'Schema') {
                  this.isSchemaVisible = true
                  return
                }
              })
              this.childInfoTabs.find((item) => {
                if (item.classifierId === 'Transformer') {
                  this.isTransferVisible = true
                  return
                }
              })
              this.childInfoTabs.find((item) => {
                if (item.classifierId === 'Catalog') {
                  this.oCatalog.isCatalogVisible = true
                  return
                }
              })
              this.childInfoTabs.find((item) => {
                if (item.classifierId === 'SystemLevel') {
                  this.oSystemLevel.isSystemLevelVisible = true
                  return
                }
              })
              this.childInfoTabs.find((item) => {
                if (item.classifierId === 'ProcedureColumn') {
                  this.oProcedureColumn.isProcedureColumnVisible = true
                  return
                }
              })
              this.childInfoTabs.find((item) => {
                if (item.classifierId === 'System') {
                  this.oSystem.isSystemVisible = true
                  return
                }
              })
            }
          } else {
            this.$message.error(res.message)
          }
        })
      },
      /* 元数据的子元数据*/
      queryChildData1(classifierId) {
        // 库
        if (this.searchFlagSchema && this.isSchemaVisible) {
          getChildOfMetaData({
            classifierId: classifierId, // 元数据类型ID
            relateClassifierId: 'Schema', // 关联的元数据类型ID
            instanceId: this.instanceId,
            keyword: this.searchKeyWord,
            pageCurrent: this.currentPage, // 当前页
            pageSize: this.pageSize // 一页最多显示记录数
          }).then((res) => {
            if (res.code === 10000) {
              this.total = res.data.total
              this.currentPage = res.data.pageCurrent
              this.schemaTableData = res.data.tableData
            } else {
              this.$message.error(res.message)
            }
          })
        }
      },
      queryChildData2(classifierId) {
        // 转换
        if (this.searchFlagTransformer && this.isTransferVisible) {
          getChildOfMetaData({
            classifierId: classifierId, // 元数据类型ID
            relateClassifierId: 'Transformer',
            instanceId: this.instanceId,
            keyword: this.searchKeyWord,
            pageCurrent: this.currentPage, // 当前页
            pageSize: this.pageSize // 一页最多显示记录数
          }).then((res) => {
            if (res.code === 10000) {
              this.total = res.data.total
              this.currentPage = res.data.pageCurrent
              this.transformerTableData = res.data.tableData
            } else {
              this.$message.error(res.message)
            }
          })
        }
      },
      queryChildData3(classifierId) {
        // 目录
        if (this.oCatalog.isCatalogVisible) {
          getChildOfMetaData({
            classifierId: classifierId, // 元数据类型ID
            relateClassifierId: 'Catalog',
            instanceId: this.instanceId,
            keyword: this.searchKeyWord,
            pageCurrent: this.currentPage, // 当前页
            pageSize: this.pageSize // 一页最多显示记录数
          }).then((res) => {
            if (res.code === 10000) {
              this.total = res.data.total
              this.currentPage = res.data.pageCurrent
              this.oCatalog.catalogTableData = res.data.tableData
            } else {
              this.$message.error(res.message)
            }
          })
        }
      },
      queryChildData4(classifierId) {
        // 系统层次
        if (this.oSystemLevel.isSystemLevelVisible) {
          getChildOfMetaData({
            classifierId: classifierId, // 元数据类型ID
            relateClassifierId: 'SystemLevel',
            instanceId: this.instanceId,
            keyword: this.searchKeyWord,
            pageCurrent: this.currentPage, // 当前页
            pageSize: this.pageSize // 一页最多显示记录数
          }).then((res) => {
            if (res.code === 10000) {
              this.total = res.data.total
              this.currentPage = res.data.pageCurrent
              this.oSystemLevel.systemLevelTableData = res.data.tableData
            } else {
              this.$message.error(res.message)
            }
          })
        }
      },
      queryChildData5(classifierId) {
        // 存储过程
        if (this.oProcedureColumn.isProcedureColumnVisible) {
          getChildOfMetaData({
            classifierId: classifierId, // 元数据类型ID
            relateClassifierId: 'ProcedureColumn',
            instanceId: this.instanceId,
            keyword: this.searchKeyWord,
            pageCurrent: this.currentPage, // 当前页
            pageSize: this.pageSize // 一页最多显示记录数
          }).then((res) => {
            if (res.code === 10000) {
              this.total = res.data.total
              this.currentPage = res.data.pageCurrent
              this.oProcedureColumn.procedureColumnTableData = res.data.tableData
            } else {
              this.$message.error(res.message)
            }
          })
        }
      },
      queryChildData6(classifierId) {
        // 系统
        if (this.oSystem.isSystemVisible) {
          getChildOfMetaData({
            classifierId: classifierId, // 元数据类型ID
            relateClassifierId: 'System',
            instanceId: this.instanceId,
            keyword: this.searchKeyWord,
            pageCurrent: this.currentPage, // 当前页
            pageSize: this.pageSize // 一页最多显示记录数
          }).then((res) => {
            if (res.code === 10000) {
              this.total = res.data.total
              this.currentPage = res.data.pageCurrent
              this.oSystem.systemTableData = res.data.tableData
            } else {
              this.$message.error(res.message)
            }
          })
        }
      },
      // 搜索
      searchDataByKeyword(name) {
        if (name === "Schema") {
          this.searchFlagSchema = true
          this.searchFlagTransformer = false
          this.searchFlagCatalog = false
          this.searchFlagSystemLevel = false
          this.searchFlagProcedureColumn = false
          this.searchFlagSystem = false
        } else if (name === "Transformer") {
          this.searchFlagSchema = false
          this.searchFlagTransformer = true
          this.searchFlagCatalog = false
          this.searchFlagSystemLevel = false
          this.searchFlagProcedureColumn = false
          this.searchFlagSystem = false
        } else if (name === "Catalog") {
          this.searchFlagSchema = false
          this.searchFlagTransformer = false
          this.searchFlagCatalog = true
          this.searchFlagSystemLevel = false
          this.searchFlagProcedureColumn = false
          this.searchFlagSystem = false
        } else if (name === "SystemLevel") {
          this.searchFlagSchema = false
          this.searchFlagTransformer = false
          this.searchFlagCatalog = false
          this.searchFlagSystemLevel = true
          this.searchFlagProcedureColumn = false
          this.searchFlagSystem = false
        } else if (name === "ProcedureColumn") {
          this.searchFlagSchema = false
          this.searchFlagTransformer = false
          this.searchFlagCatalog = false
          this.searchFlagSystemLevel = false
          this.searchFlagProcedureColumn = true
          this.searchFlagSystem = false
        } else if (name === "System") {
          this.searchFlagSchema = false
          this.searchFlagTransformer = false
          this.searchFlagCatalog = false
          this.searchFlagSystemLevel = false
          this.searchFlagProcedureColumn = false
          this.searchFlagSystem = true
        }
        // 查询对应表格数据
        this.getWhichQuery()
        // 清空搜索框
        this.searchKeyWord = ""
      },
      searchDataTransformer() {
        this.searchFlagSchema = false
        this.searchFlagTransformer = true
        this.getWhichQuery()
        // 清空搜索框
        this.searchKeyWord = ""
      },

      getWhichQuery() {
        let classifierId = this.$route.params.classifierId !== undefined ? this.$route.params.classifierId : null
        if (this.sTabName === "Schema") {
          this.queryChildData1(classifierId)
        } else if (this.sTabName === "Transformer") {
          this.queryChildData2(classifierId)
        } else if (this.sTabName === "Catalog") {
          this.queryChildData3(classifierId)
        } else if (this.sTabName === "SystemLevel") {
          this.queryChildData4(classifierId)
        } else if (this.sTabName === "ProcedureColumn") {
          this.queryChildData5(classifierId)
        } else if (this.sTabName === "System") {
          this.queryChildData6(classifierId)
        }
      },
      // 点击tabs时，调用接口
      handleClick(tab, event) {
        this.sTabName = tab.name
        this.currentPage = 1
        this.pageSize = 10
        this.getWhichQuery()
      },
      handleChange(val) {
        // console.log(val);
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getWhichQuery()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getWhichQuery()
      }

    },
    created() {
      this.metaDataDetails()
      this.childClassifierOfMetaData()
    },
    computed: {
      showDataFlowBtn() {
        if (this.showDataFlowBtnClassifierIds.includes(this.classifierId)) {
          return true
        } else {
          return false
        }
      }
    },
    mounted() {

    }
  }
</script>


<style lang="scss" scoped>
  //外层card容器样式
  @import './../../styles/dq/main-card-table.scss';

  .title-btn-class {
    position: absolute;
    right: 10px;
    top: 20px;
    display: flex;
    z-index: 9999;
    margin-right: 10px;
  }
</style>
