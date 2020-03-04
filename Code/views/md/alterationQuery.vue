<template>
  <div class="industryVoc-box">
    <div class="content-box" v-if='!isAddorDel'>
      <div class="top-box">
        <el-form :model="searchForm"  ref="ruleForm"  inline>
          <el-form-item label="父节点：">
            <el-select clearable @clear="parentNodeClear()" v-model="searchForm.parentNode" placeholder="请选择" size='mini'>
              <el-option :value="optionValue" style="height: auto" class="fontwight">
                <el-tree :props="defaultProps"
                        accordion
                        style="margin: 0 -20px;"
                        :load="loadNode"
                        node-key="id"
                        ref="tree"
                        lazy
                        :highlight-current="true"
                        empty-text="暂无数据"
                        @node-click="handleNodeClick">
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="元数据类型: " >
            <el-select v-model="searchForm.matedataType" placeholder="请选择" size='mini'
             @clear="matadataTypeClear()"
             clearable>
                <!-- <el-option :label="item.label" :value="item.value" v-for="(item,index) in matedataTypeList" :key="index"></el-option> -->
                <el-option :value="optionValue" style="height: auto" class="fontwight">
                  <el-tree :props="props"
                        style="margin: 0 -20px;"
                          accordion
                          node-key="id"
                          ref="tree1"
                          :data="matedataTypeList"
                          :highlight-current="true"
                          empty-text="暂无数据"
                          @node-click="handleNodeClickType">
                  </el-tree>
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="变更类型: ">
            <el-select v-model="searchForm.alteractionType" placeholder="请选择" size='mini' clearable>
              <el-option :label="item.label" :value="item.value" v-for="(item,index) in alteractionTypeList" :key="index" class="fontwight">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="变更日期：">
            <el-date-picker
              size="mini"
              v-model="searchForm.alteractionDate"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              unlink-panels
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" size="mini" style="dispay:inline" @click="searchTableList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box tablePadding">
        <el-table v-if="!isAddorDel" ref="table" key="table1" :data="tableData" border
          show-header size="mini" style="width: 100%;" :default-sort = "{prop: 'classifierId', order: 'descending'}"
          :header-cell-style="{background:'#f8f8f9'}">
          <el-table-column label="元数据类型代码" align="center" sortable :show-overflow-tooltip="showToolTip" prop="classifierId">
          </el-table-column>
          <el-table-column label="元数据类型名称" align="center" :show-overflow-tooltip="showToolTip" sortable prop="classifierName">
          </el-table-column>
          <el-table-column label="变更类型" sortable :show-overflow-tooltip="showToolTip" align="center" prop="alterationType">
            <template slot-scope="scope">
              <span v-if="scope.row.alterationType === '0'">新增</span>
              <span v-if="scope.row.alterationType === '1'">删除</span>
              <span v-if="scope.row.alterationType === '2'">修改</span>
            </template>
          </el-table-column>
          <el-table-column label="变更统计" sortable :show-overflow-tooltip="showToolTip" align="center" prop="alterationCount">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center" class="bb">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom" :enterable="false">
                <el-button type="text" @click="goDetail(scope.row)">
                  <svg-icon icon-class="preview" style=" width: 22px;height: 22px;"></svg-icon>
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div id="paganation" style="text-align:center">
        <pagination  :total="total" :page.sync="icurrentPage"  :limit.sync="ipageSize" @pagination="queryTableList" />
      </div>
    </div>
    <div class="content-box" v-else>
      <div class="top-box">
        <el-button size="mini" icon="el-icon-arrow-left" class="topbutton" @click="returnAlteraction">返回</el-button>
      </div>
      <div class="table-box">
        <div class="tableserch">
          <el-form :model="searchAddOrDelForm"  ref="ruleForm"  inline>
            <el-form-item label="变更日期：">
              <el-date-picker size="mini" v-model="searchAddOrDelForm.alteractionDate" type="daterange"
                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                value-format="yyyy-MM-dd" unlink-panels>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="变更类型: ">
              <el-select v-model="searchAddOrDelForm.alterationType" placeholder="请选择" size='mini' clearable>
                <el-option :label="item.label" :value="item.value" v-for="(item,index) in alteractionTypeList" :key="index" class="fontwight">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="元数据类型: " >
              <el-select v-model="searchAddOrDelForm.matedataType" placeholder="请选择" size='mini'
                @clear="matadataTypeClear2()" clearable>
                  <el-option :value="optionValue" style="height: auto" class="fontwight">
                    <el-tree :props="props"
                          style="margin: 0 -20px;"
                            accordion
                            node-key="id"
                            ref="tree1"
                            :data="matedataTypeList"
                            :highlight-current="true"
                            empty-text="暂无数据"
                            @node-click="handleNodeClickType">
                    </el-tree>
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="元数据代码：">
              <el-input placeholder="请输入..." clearable size="mini" v-model.trim="searchAddOrDelForm.keyword" @keyup.enter.native="queryAddOrDelList">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="queryAddOrDelList"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" icon="el-icon-search" size="mini" style="dispay:inline" @click="searchTableList2">查询</el-button>
            </el-form-item>
          </el-form>
          <!-- <span>元数据代码：</span>
          <el-input
              placeholder="请输入..."
              clearable
              size="mini"
              v-model.trim="searchAddOrDelForm.keyword"
              @keyup.enter.native="queryAddOrDelList"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="queryAddOrDelList"></i>
          </el-input> -->
        </div>
        <el-table
         v-if="isAddorDel"
          ref="table2"
          key="table2"
          :data="tableData2"
          border
          show-header
          size="mini"
          style="width: 100%;"
          :header-cell-style="{background:'#f8f8f9'}">
          <el-table-column
            label="变更类型"
            sortable
            :show-overflow-tooltip="showToolTip"
            align="center">
            <template slot-scope="scope">
              <a class="a-color" @click="clickToAlter(scope.row)" v-if="scope.row.alterationType==='2'">
                <span>修改</span>
              </a>
              <a class="a-color" @click="clickToDetails(scope.row)" v-if="scope.row.alterationType==='0'&&!scope.row.isDelete">
                <span>新增</span>
              </a>
              <a class="a-color" @click="clickToDelDetails(scope.row)" v-if="scope.row.alterationType==='0'&&scope.row.isDelete">
                <span>新增</span>
              </a>
              <a class="a-color" @click="clickToDelDetails(scope.row)" v-if="scope.row.alterationType==='1'">
                <span>删除</span>
              </a>
            </template>
          </el-table-column>
          <el-table-column
            label="元数据类型"
            align="center"
            sortable
            :show-overflow-tooltip="showToolTip"
          >
            <template slot-scope="scope">
                 {{scope.row.classifierId}}({{scope.row.classifierName}})
            </template>
          </el-table-column>
          <el-table-column
            label="变更元数据代码"
            sortable
            min-width="100"
            :show-overflow-tooltip="showToolTip"
            align="center">
            <template slot-scope="scope">
              <a class="a-color" @click="clickToDetails(scope.row)" v-if="scope.row.alterationType!=='1'&&!scope.row.isDelete">
              {{scope.row.alterationInstanceCode}} 
              </a>
              <a class="a-color" @click="clickToDelDetails(scope.row)"  v-else>
              {{scope.row.alterationInstanceCode}} 
              </a>
            </template>
          </el-table-column>
          <el-table-column
            label="变更元数据名称"
            sortable
            min-width="100"
            :show-overflow-tooltip="showToolTip"
            align="center"
            prop="alterationInstanceName">
          </el-table-column>
          <el-table-column
            label="变更时间"
            sortable
            :show-overflow-tooltip="showToolTip"
            align="center"
            prop="alterationDate">
          </el-table-column>
          <el-table-column
            label="变更人/采集人"
            min-width="100"
            sortable
            :show-overflow-tooltip="showToolTip"
            align="center"
            prop="userName">
          </el-table-column>
          <el-table-column
            label="变更方式"
            sortable
            :show-overflow-tooltip="showToolTip"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.alterationStyle === '0'">web界面操作</span>
              <span v-if="scope.row.alterationStyle === '1'">自动采集</span>
              <span v-if="scope.row.alterationStyle === '2'">手动采集</span>
            </template>
          </el-table-column>
          <el-table-column
            label="数据源名称"
            sortable
            :show-overflow-tooltip="showToolTip"
            align="center"
            prop="datasourceName">
          </el-table-column>
          <el-table-column
            label="上下文路径"
            sortable
            :show-overflow-tooltip="showToolTip"
            align="center"
            prop="path">
          </el-table-column>
        </el-table>
      </div>
      <div id="paganation" style="text-align:center">
        <pagination  :total="total2" :page.sync="icurrentPage2"  :limit.sync="ipageSize2" @pagination="queryAddOrDelList" />
      </div>
    </div>
    <el-dialog :visible.sync="alterDialog" class="alter-dialog" title="元数据差异">
      <el-table
        ref="table3"
        key="table3"
        :data="tableData3"
        border
        show-header
        size="mini"
        style="width: 100%;"
        :header-cell-style="{background:'#f8f8f9'}">
        <el-table-column
          label="属性"
          align="center"
          prop="attName">
        </el-table-column>
        <el-table-column
          label="修改前"
          align="center"
          prop="oldValue">
        </el-table-column>
        <el-table-column
          label="修改后"
          align="center"
          prop="newValue">
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="primary" @click="close()" size="mini" >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { get } from '@/utils/request'
export default{
  components: { Pagination },
  name: 'alterationQuery',
  data() {
    return {
      isAddorDel: false,
      // 搜索
      searchForm: {
        parentNode: '',
        parentNodeId: '',
        matedataType: '',
        matedataTypeId: '',
        alteractionType: '',
        alteractionDate: []
      },
      // tree
      optionValue: '',
      treeData: [],
      defaultProps: {
        label: 'text',
        children: 'children',
        isLeaf: 'isLeaf'
      },
      props: {
        label: 'name',
        children: 'packageVOList'
      },
      matedataTypeList: [],
      alteractionTypeList: [
        {
          value: '0',
          label: '新增'
        },
        {
          value: '2',
          label: '修改'
        },
        {
          value: '1',
          label: '删除'
        }
      ],
      // Table
      tableData: [],
      // paganation数据
      icurrentPage: 1,
      ipageSize: 10,
      total: 10,
      // 新增、修改或删除详情页面
      searchAddOrDelForm: {
        keyword: '',
        matedataType: '',
        matedataTypeId: '',
        alterationType: '',
        alteractionDate: []
      },
      tableData2: [],
      icurrentPage2: 1,
      ipageSize2: 10,
      total2: 10,
      // 元数据差异对话框
      alterDialog: false,
      tableData3: [],
      classifierId: "",
      alterationType: "",
      showToolTip: true
    }
  },
  methods: {
    // strtotime(strtime) {
    //   let strtime1 = strtime.substring(0, 19);
    //   let strtime2 = strtime1.replace(/-/g, '/');
    //   let strtime3 = new Date(strtime2);
    //   let strtime4 = strtime3.getTime()
    //   return strtime4;
    // },
    matadataTypeClear() {
      this.searchForm.matedataTypeId = ""
    },
    matadataTypeClear2() {
      this.searchAddOrDelForm.matedataTypeId = ""
    },
    parentNodeClear() {
      this.searchForm.parentNodeId = ""
    },
    // 懒加载父节点下拉列表
    loadNode (node, resolve) {
      console.log("loadNode (node, resolve) ", node, resolve)
      if (node.level === 0) {
        get('/md/listAlterationinfoTree').then(res => {
          if (res.code === 10000 && res.success === true) {
            return resolve(res.data)
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        let params = {
          nodeType: node.data.nodeType,
          classifierId: node.data.classifierId
        }
        if (node.data.nodeType === 'metaModel') {
          params.parentId = node.data.parentNodeId
        } else {
          params.id = node.data.id
        }
        get('/md/listAlterationinfoTree', params).then(res => {
          if (res.code === 10000 && res.success === true) {
            return resolve(res.data)
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },

    // 点击树节点
    handleNodeClick(data, node, resolve) {
      // console.log("handleNodeClick (data, node, resolve)", data, node, resolve)
      this.searchForm.parentNode = node.data.text
      if (node.data.nodeType === 'metaModel') {
        this.searchForm.parentNodeId = node.data.parentNodeId
      } else {
        this.searchForm.parentNodeId = node.data.id
      }
    },
    // 搜索
    searchTableList() {
      this.icurrentPage = 1
      this.queryTableList()
    },
    searchTableList2() {
      this.icurrentPage2 = 1
      this.queryAddOrDelList()
    },
    // 列表查询
    queryTableList() {
      let params = {
        pageCurrent: this.icurrentPage,
        pageSize: this.ipageSize,
        id: this.searchForm.parentNodeId,
        classifierId: this.searchForm.matedataTypeId,
        alterationType: this.searchForm.alteractionType
      }
      console.log("this.searchForm.alteractionDate", this.searchForm.alteractionDate)
      if (this.searchForm.alteractionDate) {
        // debugger
        params.startDate = this.searchForm.alteractionDate[0]
        params.endDate = this.searchForm.alteractionDate[1]
      }
      console.log("queryTableList--params", params)
      get('/md/listAlteration', params).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 元数据类型
    getListAlterationinType() {
      get('/md/listAlterationinfoPackage').then(res => {
        if (res.code === 10000 && res.success === true) {
          this.matedataTypeList = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleNodeClickType(data, node, resolve) {
      // console.log("handleNodeClick (data, node, resolve)", data, node, resolve)
      if (node.childNodes.length === 0) {
        this.searchForm.matedataType = node.data.name
        this.searchForm.matedataTypeId = node.data.id
      }
    },
    goDetail(row) {
      this.isAddorDel = true
      this.searchAddOrDelForm.alterationType = row.alterationType
      this.searchAddOrDelForm.alteractionDate = this.searchForm.alteractionDate
      this.searchAddOrDelForm.matedataType = row.classifierName
      this.searchAddOrDelForm.matedataId = row.classifierId
      console.log(this.searchAddOrDelForm)
      this.queryAddOrDelList()
    },
    // 新增、修改或删除详情页面
    // 新增、修改或删除详情页面查询列表
    queryAddOrDelList() {
      let params = {
        pageCurrent: this.icurrentPage2,
        pageSize: this.ipageSize2,
        id: this.searchForm.parentNodeId,
        instanceCode: this.searchAddOrDelForm.keyword,
        classifierId: this.searchAddOrDelForm.matedataId,
        alterationType: this.searchAddOrDelForm.alterationType
      }
      if (this.searchAddOrDelForm.alteractionDate) {
        // debugger
        params.startDate = this.searchAddOrDelForm.alteractionDate[0]
        params.endDate = this.searchAddOrDelForm.alteractionDate[1]
      }
      get('/md/listInfoByAlterationType', params).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.tableData2 = res.data.records
          this.total2 = res.data.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 返回
    returnAlteraction() {
      this.isAddorDel = false
    },
    clickToDetails(row) {
      this.$router.push({
        name: 'impactAndLineageDetail',
        params: {
          id: row.instanceId,
          classifierId: row.classifierId,
          _title: row.alterationInstanceName
        }
      })
    },
    clickToDelDetails(row) {
      this.$router.push({
        name: 'impactAndLineageDetail',
        params: {
          id: row.instanceId,
          classifierIdDel: row.classifierId,
          startTime: row.startTime,
          _title: row.alterationInstanceName
        }
      })
    },
    clickToAlter(row) {
      this.alterDialog = true
      let params = {
        instanceId: row.instanceId, // 元数据id
        oldStartTime: row.oldStartTime,
        startTime: row.startTime
      }
      get('/md/listAlterationDefWhenMod', params).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.tableData3 = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 点击确定关闭对话框
    close() {
      this.alterDialog = false
    }
  },
  activated() {
    this.showToolTip = true
  },
  deactivated() {
    this.showToolTip = false
  },
  created() {
    this.showToolTip = true
    var day2 = new Date();
    day2.setTime(day2.getTime());
    let month = day2.getMonth() + 1
    let s2 = day2.getFullYear() + "-" + (month > 10 ? month : "0" + month) + "-" + (day2.getDate() > 10 ? day2.getDate() : '0' + day2.getDate());
    console.log(s2, 's2')
    this.$set(this.searchForm.alteractionDate, 0, s2)
    this.$set(this.searchForm.alteractionDate, 1, s2)
    this.queryTableList();
    this.getListAlterationinType()
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/dq/main-card-table.scss";
.industryVoc-box{
  background-color:#fff;
  margin:10px;
  .tablePadding{
    /deep/ .el-table--mini td{
      padding:0px!important;
    }
  }
  //content的样式
  .content-box{
    padding:30px 50px 30px 50px;
     .top-box{
      width:100%;
      margin-bottom:20px;
      border-bottom: 1px solid #e8ebed;
      /deep/ .el-input{
        width:135px
      }
      .topbutton{
        margin-bottom: 10px
      }
    }
    .tableserch{
      // float:right;
      margin-bottom:10px;
      // width:260px;
      font-size:12px;
      /deep/ .el-input {
        width:150px;
        display: inline-block
      }
    }
  }
  .alter-dialog{
    /deep/ .el-dialog__footer{
      text-align:center;
      padding:10px 20px
    }
  }
}
/deep/ .el-tree-node__label{
    font-size:12px!important
}
/deep/ .el-select-dropdown__item{
  font-size:12px
}
.fontwight{
  font-weight:500!important;
  font-size:12px!important
}
</style>
