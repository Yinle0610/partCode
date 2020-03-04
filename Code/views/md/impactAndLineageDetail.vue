<!-- 影响分析详情 -->
<template>
  <div class="impactAndLineageDetail">
    <el-card shadow="hover" class="card-container">
      <div class="title-btn-class">
<!--        <el-dropdown @command="handleAffect" v-if='isShowAnalysis' v-permission="'IMPACT_ANALYSIS'" style="margin-right:10px;">-->
<!--            <el-button type="primary" size="small">影响分析</el-button>-->
<!--            <el-dropdown-menu slot="dropdown" trigger="click" class="handleAffect">-->
<!--              <el-dropdown-item :command="'EDGS'">EDGS</el-dropdown-item>-->
<!--              <el-dropdown-item :command="'ASG'">ASG</el-dropdown-item>-->
<!--            </el-dropdown-menu>-->
<!--        </el-dropdown>-->
<!--        <el-dropdown @command="handleBlood" v-if='isShowAnalysis' v-permission="'LINEAGE_ANALYSIS'">-->
<!--            <el-button type="primary" size="small">血统分析</el-button>-->
<!--            <el-dropdown-menu slot="dropdown" trigger="click" class="handleBlood">-->
<!--              <el-dropdown-item :command="'EDGS'">EDGS</el-dropdown-item>-->
<!--              <el-dropdown-item :command="'ASG'">ASG</el-dropdown-item>-->
<!--            </el-dropdown-menu>-->
<!--        </el-dropdown>-->
           <el-button type="primary" size="small"  v-if='isShowNewAnalysis' @click="showNewDataLineage(id, code)">新数据血缘</el-button>
           <el-button type="primary" size="small"  v-if='isShowAnalysis' v-permission="'IMPACT_ANALYSIS'" @click="sSvgItemId === null ? showImpact(id, code) : showSvgImpact(sSvgItemId, code)">影响分析</el-button>
           <el-button type="primary" size="small"  v-if='isShowAnalysis' v-permission="'LINEAGE_ANALYSIS'" @click="sSvgItemId === null ? showLineage(id, code) : showSvgLineage(sSvgItemId, code)">血统分析</el-button>
      </div>
        <el-tabs v-model="activeName"  @tab-click="fromVersion?hanldeVersionTabsClick($event):handleTabsClick($event)">
          <el-tab-pane label="元数据信息" name="first">
            <div class="metadata-info">
             <metadataInfo :oBaseInfo="oBaseInfoData" :oAttsinfo="oAttsinfoData"></metadataInfo>
            </div>
          </el-tab-pane>
          <el-tab-pane v-for="item in aHeaders" :label="showTabName(item)" :key="item.classifierId" :classifierId="item.classifierId"
                       :relateType="item.relateType">
            <div v-loading="tableLoading">
              <div class="child-search">
                <el-input v-model.trim="searchForm.keyword" placeholder="搜索" size="small" @keyup.enter.native="searchRelateMetadata"></el-input>
              </div>
              <el-table
                border
                show-header
                :data="aRelationTableData"
                :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                style="width: 100%">
                <el-table-column v-for="val in aRelationTableHeaders"
                                 :show-overflow-tooltip='showToolTip'
                                 :key="val.prop"
                                 :label="val.label">
                  <template slot-scope="scope">
                    <a class="a-color" v-if="val.prop === 'instanceCode'"
                       @click="clickToMetaDetails(scope.row.instanceId, scope.row.classifierId, scope.row.instanceName)">
                      {{scope.row.instanceCode}}
                    </a>
                    <span v-else-if="item.showHtml" v-html="scope.row[val.prop]"></span>
                    <span v-else>{{scope.row[val.prop]}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right">
                <el-pagination
                  background
                  v-show="searchForm.total>0"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="searchForm.current"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="searchForm.size"
                  layout="total, sizes, prev, pager, next"
                  :total="searchForm.total">
                </el-pagination>
              </div>
            </div>
          </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import metadataInfo from '@/components/Metadata/MetadataInfo.vue'
import { get, parseAjaxResponse } from '@/utils/request'
export default {
  name: 'impactAndLineageDetail',
  components: { metadataInfo },
  data() {
    return {
      tableLoading: false, // 表格加载
      verId: '', // 当前元数据的版本号
      fromVersion: false, // 是否从版本详情界面的元数据跳转过来
      activeName: "first",
      activeNames: "1",
      isShowTableTab: false,
      isShowSQLIndexTab: false,
      isShowPrimaryKeyTab: false,
      isShowColumnTab: false,
      isShowColumnMappingTab: false,
      isShowRelationTableTab: false,
      isShowRelationColumnTab: false,
      isShowStoreProcedureTab: false,
      canShowAnalysisClassifierIds: [],
      canShowNewAnalysisClassifierIds: [],
      isShowNewAnalysis: false,
      isShowAnalysis: false, // 显示影响分析和血缘分析的按钮与否
      oBaseInfoData: {
        aTableData: [
        ],
        bLoading: false
      },
      oAttsinfoData: {
        aTableData: [
        ],
        bLoading: false
      },
      aRelationFiledData: [],
      aPrimaryKeyData: [],
      aFiledData: [],
      aRelationTableData: [],
      aRelationTableHeaders: [],
      aHeaders: [],
      aColumnMappingData: [],
      aSerchIndexData: [],
      aStoreProcedureData: [],
      childInfo: {},
      id: this.$route.params.id,
      classifierId: this.$route.params.classifierId,
      code: '',
      dataType: this.$route.params.type,
      classifierIdForMata: "",
      searchForm: {
        classifierId: '',
        relateType: '',
        total: 0,
        current: 1,
        size: 10,
        keyword: ''
      },
      showToolTip: true,
      // svg item id
      sSvgItemId: null
    }
  },
  methods: {
    // 根据 EDGS的 metadataId查询 SVG itemId /md/asg/findItemId
    getSVGItemId () {
      get('/md/asg/findItemId', {
        metadataId: this.id
        // metadataId: '0b5b5d5a4e3f4e3795f2f3c094e079be'
      }).then((res) => {
        parseAjaxResponse(res, () => {
          console.log(res)
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

    handleAffect(command) {
      console.log(command)
      if (command === 'EDGS') {
        this.showImpact(this.id, this.code)
      } else if (command === 'ASG') {
        this.$router.push({
          name: 'impactAnaalysisASG',
          params: {
            id: this.id,
            _title: this.code,
            classifierId: this.classifierId
          }
        })
      }
    },
    handleBlood(command) {
      console.log(command)
      if (command === 'EDGS') {
        this.showLineage(this.id, this.code)
      } else if (command === 'ASG') {
        this.$router.push({
          name: 'impactBloodASG',
          params: {
            id: this.id,
            _title: this.code,
            classifierId: this.classifierId
          }
        })
      }
    },
    showTabName(item) {
      console.log(item, 'stbnm')
      let relateType = item.relateType
      let classifierName = item.classifierName
      if (relateType === 'Dep') {
        classifierName = '相关的' + classifierName
        item.showHtml = true
      }
      return classifierName
    },
    showImpact(id, _title) {
      this.$router.push({
        name: 'impactAnalysisCanvas',
        params: {
          id: id,
          _title: _title,
          classifierId: this.classifierId,
          bSvgLineageIsShow: this.bSvgLineageIsShow
        }
      })
    },
    showLineage(id, _title) {
      this.$router.push({
        name: 'lineageAnalysisCanvas',
        params: {
          id: id,
          _title: _title,
          classifierId: this.classifierId,
          bSvgLineageIsShow: this.bSvgLineageIsShow
        }
      })
    },
    // svg 的 影响分析和 血统分析
    showSvgImpact(itemId, _title) {
      this.$router.push({
        name: 'impactAnalysisCanvas',
        params: {
          id: itemId,
          _title: _title,
          classifierId: this.classifierId,
          bSvgLineageIsShow: this.bSvgLineageIsShow
        }
      })
    },
    showSvgLineage(itemId, _title) {
      this.$router.push({
        name: 'lineageAnalysisCanvas',
        params: {
          id: itemId,
          _title: _title,
          classifierId: this.classifierId,
          bSvgLineageIsShow: this.bSvgLineageIsShow
        }
      })
    },
    showNewDataLineage(id, _title) {
      this.$router.push({
        name: 'dataLineageCanvas',
        params: {
          id: id,
          _title: _title,
          classifierId: this.classifierId
        }
      })
    },
    clickToMetaDetails(id, classifierId, title) {
      if (this.$route.params.verId) {
        this.$router.push({
          name: "impactAndLineageDetail", // '元数据'详情页
          params: {
            _title: title,
            id: id,
            classifierId: classifierId,
            verId: this.$route.params.verId,
            from: "version"
          }
        });
      } else {
        this.$router.push({
          name: 'impactAndLineageDetail',
          params: {
            id: id,
            classifierId: classifierId,
            _title: title
          }
        })
      }
    },
    // 获取元数据的所有子元数据类型
    getChildClassifiers() {
      get('/md/relate/classifiers', {
        instanceId: this.id,
        classifierId: this.classifierId
      }).then(res => {
        parseAjaxResponse(res, () => {
          this.aHeaders = res.data
        })
      })
    },
    // 从版本详情过来   展示旧的元数据详情
    versionMetadataInfoList() {
      const _this = this;
      get("/mdVersion/queryVersionMetadata", {
        instanceId: _this.id,
        verId: _this.$route.params.verId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          console.log(res)
          _this.oBaseInfoData.aTableData = [
            {
              "key": "元数据代码:",
              "value": res.data.instanceCode
            },
            {
              "key": "元数据名称:",
              "value": res.data.instanceName
            },
            {
              "key": "元数据类型:",
              "value": res.data.classifierName + '(' + res.data.classifierId + ')'
            },
            {
              "key": "上下文路径:",
              "value": res.data.path
            },
            {
              "key": "生效时间:",
              "value": res.data.startTime
            }
          ]
          _this.code = res.data.instanceCode
          _this.oAttsinfoData.aTableData = res.data.attributeVOS
          // let verId = res.data.versionDefine.verId
          this.verId = res.data.versionDefine.verId
          get("/mdVersion/queryVersionClassifier", {
            verId: this.verId,
            instanceId: this.id
          }).then(res => {
            parseAjaxResponse(res, () => {
              console.log(res, "select");
              this.aHeaders = res.data;
            });
          });
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    // 从版本过来  点击切换tabs
    hanldeVersionTabsClick(tab, event) {
      console.log(tab)
      this.searchForm.classifierId = tab.$attrs.classifierId
      // this.searchForm.relateType = tab.$attrs.relateType
      this.searchForm.total = 0
      this.searchForm.current = 1
      this.getVersionTableData()
    },
    getVersionTableData() {
      console.log('gettable')
      this.tableLoading = true
      console.log(this.searchForm.classifierId)
      // let params = {
      //   classifierId: this.searchForm.classifierId,
      //   current: this.searchForm.current,
      //   keyword: this.searchForm.keyword,
      //   size: this.searchForm.size,
      //   verId: this.verId
      // }
      // for (let i in)
      get('/mdVersion/queryMDClassifierPage', {
        classifierId: this.searchForm.classifierId,
        current: this.searchForm.current,
        keyword: this.searchForm.keyword ? this.searchForm.keyword : null,
        size: this.searchForm.size,
        verId: this.verId,
        instanceId: this.id
      }).then(res => {
        parseAjaxResponse(res, () => {
          console.log(res)
          this.searchForm.total = res.data.total
          // this.aRelationTableData = res.data.records
          this.aRelationTableHeaders = res.extras.headers
          if (this.searchForm.classifierId === 'Column') {
            this.aRelationTableHeaders.unshift({ label: '元数据代码', prop: "instanceCode" })
            this.aRelationTableHeaders.unshift({ label: '元数据名称', prop: "instanceName" })
          }
          const data = res.data.records
          let list = []
          data.map((item, index) => {
            list.push({})
            if (this.searchForm.classifierId === 'Column') {
              list[index]['instanceName'] = item.name
              list[index]['instanceCode'] = item.code
              list[index]['instanceId'] = item.id
            }
            item.attributes.map(val => {
              let code = val.attCode
              let value = val.value ? val.value : ''
              // list.push({ code: value })
              list[index][code] = value
            })
          })
          console.log(list)
          this.aRelationTableData = list
          this.tableLoading = false
        })
      })
    },
    getMetadataInfoList() {
      const _this = this;
      get('md/detail/' + _this.id).then(res => {
        if (res.code === 10000 && res.success === true) {
          _this.oBaseInfoData.aTableData = [
            {
              "key": "元数据代码:",
              "value": res.data.code
            },
            {
              "key": "元数据名称:",
              "value": res.data.name
            },
            {
              "key": "元数据类型:",
              "value": res.data.classifierName + '(' + res.data.classifierId + ')'
            },
            {
              "key": "上下文路径:",
              "value": res.data.path
            },
            {
              "key": "生效时间:",
              "value": res.data.startTime
            }
          ]
          _this.code = res.data.code
          _this.oAttsinfoData.aTableData = res.data.attributes
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    // 变更删除时查询元数据信息
    getMetadataInfoListDel() {
      const _this = this;
      let params = {
        startTime: this.$route.params.startTime,
        instanceId: this.$route.params.id
      }
      get('/md/getAlterationInfoWhenDel', params).then(res => {
        if (res.code === 10000 && res.success === true) {
          _this.oBaseInfoData.aTableData = [
            {
              "key": "元数据代码:",
              "value": res.data.code
            },
            {
              "key": "元数据名称:",
              "value": res.data.name
            },
            {
              "key": "元数据类型:",
              "value": res.data.classifierName + '(' + res.data.classifierId + ')'
            },
            {
              "key": "上下文路径:",
              "value": res.data.path
            },
            {
              "key": "生效时间:",
              "value": res.data.startTime
            }
          ]
          _this.code = res.data.code
          _this.oAttsinfoData.aTableData = res.data.attributes
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    getTableDataList() {
      if (this.searchForm.classifierId === undefined) {
        return
      }
      get('/md/relate/info', {
        relateClassifierId: this.searchForm.classifierId,
        relateType: this.searchForm.relateType,
        instanceId: this.id,
        classifierId: this.classifierId,
        pageCurrent: this.searchForm.current,
        pageSize: this.searchForm.size,
        keyword: this.searchForm.keyword
      }).then(res => {
        parseAjaxResponse(res, () => {
          this.searchForm.total = res.data.total
          this.aRelationTableData = res.data.records
          this.aRelationTableHeaders = res.extras.headers
          this.tableLoading = false
        })
      })
    },
    handleSizeChange(val) {
      this.searchForm.current = 1
      this.searchForm.size = val
      this.fromVersion ? this.getVersionTableData() : this.getTableDataList()
    },
    handleCurrentChange(val) {
      this.searchForm.current = val
      this.fromVersion ? this.getVersionTableData() : this.getTableDataList()
    },
    searchRelateMetadata() {
      this.searchForm.total = 0
      this.searchForm.current = 1
      this.fromVersion ? this.getVersionTableData() : this.getTableDataList()
    },
    // 点击tab时触发的函数
    handleTabsClick(tab, event) {
      this.searchForm.classifierId = tab.$attrs.classifierId
      this.searchForm.relateType = tab.$attrs.relateType
      this.searchForm.total = 0
      this.searchForm.current = 1
      this.getTableDataList()
    },
    setIsShowAnalysis() {
      if (this.canShowAnalysisClassifierIds.includes(this.classifierId)) {
        this.isShowAnalysis = true
      }
      if (this.canShowNewAnalysisClassifierIds.includes(this.classifierId)) {
        this.isShowNewAnalysis = true;
      }
    }
  },
  mounted() {
  },
  created() {
    // 根据instanceID，获取 svg item id
    this.getSVGItemId()

    this.canShowAnalysisClassifierIds = [
      'Table',
      'Column',
      'Schema'
    ];
    this.canShowNewAnalysisClassifierIds = [
      'Table',
      'View',
      'Column',
      'Transformation',
      'TransformationMap'
    ];
    this.showToolTip = true
    if (this.$route.params.verId) {
      this.setIsShowAnalysis()
      this.versionMetadataInfoList();
      this.fromVersion = true
      // this.getVersionChildClassifiers();
    } else {
      this.fromVersion = false
      if (this.$route.params.classifierId) {
        this.setIsShowAnalysis()
        this.getMetadataInfoList();
        this.getChildClassifiers();
      } else if (this.$route.params.classifierIdDel || this.$route.params.startTime) {
        this.getMetadataInfoListDel();
      }
    }
  },
  activated() {
    this.showToolTip = true
  },
  deactivated() {
    this.showToolTip = false
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
    z-index: 100;
    margin-right: 10px;
  }
.el-collapse-item__header{
  border-bottom:1px solid red
}
.el-table{
  font-size: 12px
}
</style>
<style>
.child-search .el-input__inner {
    width:200px;
  }
.child-search{
  text-align: right;
  margin-bottom: 10px;
}
.handleAffect,.handleBlood{
  width:80px!important;
}
</style>
