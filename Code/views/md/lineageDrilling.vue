<!-- 血统分析-钻取 -->
<template>
  <div class="lineageDrilling">
    <el-card shadow="hover">
      <div slot="header" style="text-align: left" class="card-container">
        <el-form :model="aLineageSearhForm"  :inline="true" >
          <el-form-item label="当前字段：">
            <el-input  placeholder="请输入关键字" v-model.trim="aLineageSearhForm.currentTable" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="上游字段：">
            <el-input  placeholder="请输入关键字" v-model.trim="aLineageSearhForm.tarTable" size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search"  @click="searchDrillingList" style="padding:7px">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div shadow="hover" class="card-container card-table">
        <div class="card-table" id="lab-table">
          <el-table
              :data="tableData"
              border
              show-header
              size="mini"
              style="width: 100%"
              :header-cell-style="{background:'#f8f8f9',color:'#606266',height:'45px'}">
            <el-table-column
            :show-overflow-tooltip="showToolTip"
                label="当前数据表">
              <template slot-scope="scope">
                <a class="a-color" @click="clickToDetails(scope.row.tarTableId,scope.row.tarTable,scope.row.tarTableClzId)">
                  {{scope.row.tarTable}}
                </a>
              </template>
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='showToolTip'
                prop="tarTablePath"
                label="当前表上下文">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip="showToolTip"
                label="当前字段">
              <template slot-scope="scope">
                <a class="a-color" @click="clickToDetails(scope.row.tarColumnId,scope.row.tarColumn,scope.row.tarColumnClzId)">
                  {{scope.row.tarColumn}}
                </a>
              </template>
            </el-table-column>
             <el-table-column
            :show-overflow-tooltip='showToolTip'
                prop="tarColumnPath"
                label="当前字段上下文">
            </el-table-column>
            <!-- <el-table-column
            :show-overflow-tooltip="showToolTip"
                label="程序名">
              <template slot-scope="scope"><a class="a-color" @click="clickToDetails(scope.row.procId,scope.row.procName,scope.row.procClzId)">
                {{scope.row.procName}} </a></template>
            </el-table-column> -->
            <el-table-column
            :show-overflow-tooltip="showToolTip"
                label="上游数据表">
              <template slot-scope="scope"><a class="a-color" @click="clickToDetails(scope.row.srcTableId,scope.row.srcTable,scope.row.tarTableClzId)">
                {{scope.row.srcTable}} </a></template>
            </el-table-column>
             <el-table-column
            :show-overflow-tooltip='showToolTip'
                prop="srcTablePath"
                label="上游表上下文">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip="showToolTip"
                label="上游字段">
              <template slot-scope="scope"><a class="a-color" @click="clickToDetails(scope.row.srcColumnId,scope.row.srcColumn,scope.row.tarColumnClzId)">
                {{scope.row.srcColumn}} </a></template>
            </el-table-column>
             <el-table-column
            :show-overflow-tooltip='showToolTip'
                prop="srcColumnPath"
                label="上游字段上下文">
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
  name: 'lineageDrilling',
  components: { Pagination },
  data() {
    return {
      aLineageSearhForm: {
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
          _title: title
        }
      })
    },
    getDrillingList() {
      const _this = this;
      get('md/listLineageRelation', {
        pageCurrent: _this.icurrentPage,
        pageSize: _this.ipageSize,
        curDB: _this.tarTableId,
        curTable: _this.aLineageSearhForm.tarTable,
        dsDB: _this.srcTableId,
        dsTable: _this.aLineageSearhForm.currentTable,
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
