<!-- 影响分析-钻取 -->
<template>
  <div class="analysisImpactDrilling">
    <el-card shadow="hover">
      <div slot="header"  class="card-container" style="text-align:left">
        <el-form :model="aImpactSearhForm"  :inline="true">
          <el-form-item label="当前字段：" >
            <el-input  placeholder="请输入当前字段" v-model.trim="aImpactSearhForm.currentTable" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="下游字段：">
            <el-input  placeholder="请输入下游字段" v-model.trim="aImpactSearhForm.tarTable" size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search"  @click="searchDrillingList" style="padding:7px">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="card-container card-table">
        <div class="card-table" id="lab-table">
          <el-table
              :data="tableData"
              border
              show-header
              size="mini"
              style="width: 100%"
              :header-cell-style="{background:'#f8f8f9',color:'#606266',height:'45px'}">
            <el-table-column
            :show-overflow-tooltip='showToolTip'
                label="当前数据表">
              <template slot-scope="scope">
                <a class="a-color" @click="clickToDetails(scope.row.srcTableId,scope.row.srcTable,scope.row.srcTableClzId)">
                  {{scope.row.srcTable}}
                </a>
              </template>
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='showToolTip'
                prop="srcTablePath"
                label="当前表上下文">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='showToolTip'
                label="当前字段">
              <template slot-scope="scope">
                <a class="a-color" @click="clickToDetails(scope.row.srcColumnId,scope.row.srcColumn,scope.row.srcColumnClzId)">
                  {{scope.row.srcColumn}}
                </a>
              </template>
            </el-table-column>
             <el-table-column
            :show-overflow-tooltip='showToolTip'
                prop="srcColumnPath"
                label="当前字段上下文">
            </el-table-column>
            <!-- <el-table-column
            :show-overflow-tooltip='showToolTip'
                label="程序名">
              <template slot-scope="scope"><a class="a-color" @click="clickToDetails(scope.row.procId,scope.row.procName,scope.row.procClzId)">
                {{scope.row.procName}} </a></template>
            </el-table-column> -->
            <el-table-column
            :show-overflow-tooltip='showToolTip'
                label="下游数据表">
              <template slot-scope="scope"><a class="a-color" @click="clickToDetails(scope.row.tarTableId,scope.row.tarTable,scope.row.tarTableClzId)">
                {{scope.row.tarTable}} </a></template>
            </el-table-column>
             <el-table-column
            :show-overflow-tooltip='showToolTip'
                prop="tarTablePath"
                label="下游表上下文">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='showToolTip'
                label="下游字段">
              <template slot-scope="scope"><a class="a-color" @click="clickToDetails(scope.row.tarColumnId,scope.row.tarColumn,scope.row.tarColumnClzId)">
                {{scope.row.tarColumn}} </a></template>
            </el-table-column>
             <el-table-column
            :show-overflow-tooltip='showToolTip'
                prop="tarColumnPath"
                label="下游字段上下文">
            </el-table-column>
          </el-table>
        </div>
        <div style="text-align: right">
          <pagination  :total="total" :page.sync="icurrentPage"  :limit.sync="ipageSize" @pagination="getDrillingList" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { get } from '@/utils/request'
import Pagination from '@/components/Pagination'
export default {
  name: 'impactAnalysisDrilling',
  components: { Pagination },
  data() {
    return {
      aImpactSearhForm: {
        currentTable: '',
        tarTable: ''
      },
      tableData: [],
      icurrentPage: 1,
      ipageSize: 10,
      total: 10,
      srcTableId: this.$route.params.srcTableId,
      tarTableId: this.$route.params.tarTableId,
      showToolTip: true
    }
  },
  methods: {
    clickToDetails(id, title, classifierId) {
      this.$router.push({
        name: 'impactAndLineageDetail',
        params: {
          id: id,
          classifierId: classifierId,
          _title: title,
          type: "Proc"
        }
      })
    },
    getDrillingList() {
      const _this = this;
      get('md/listImpactRelation', {
        pageCurrent: _this.icurrentPage,
        pageSize: _this.ipageSize,
        curDB: _this.srcTableId,
        curTable: _this.aImpactSearhForm.currentTable,
        dsDB: _this.tarTableId,
        dsTable: _this.aImpactSearhForm.tarTable,
        classifierId: "Column",
        srcTableId: _this.srcTableId,
        tarTableId: _this.tarTableId
      }).then(res => {
        // console.log(222, res)
        if (res.code === 10000 && res.success === true) {
          _this.total = res.data.total
          _this.tableData = res.data.records
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    searchDrillingList() {
      this.icurrentPage = 1
      this.getDrillingList()
    }
  },
  mounted() {
  },
  created() {
    this.showToolTip = true
    this.getDrillingList();
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

  .el-form-item {
    margin-bottom: 0px;
  }

  //form表单，label字体
  .el-form .el-form-item /deep/ .el-form-item__label {
    font-size: 12px;
    font-weight: normal;
    color: #515a6e;
  }
  /deep/ .el-table th{
    text-align:center;
    font-weight:normal
  }
   .pagination-container{
   margin-top:10px
 }
</style>
