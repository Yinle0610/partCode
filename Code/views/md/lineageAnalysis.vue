<!-- 血缘分析 -->
<template>
  <div class="lineageAnalysis" style="padding:10px;">
    <el-card shadow="hover">
      <div class="card-container" slot="header">
       <el-form :model="aImpactSearhForm"  :inline="true">
          <el-form-item label="当前数据库：">
            <el-select v-model="aImpactSearhForm.currentDataBase" placeholder="请选择" size="mini" style="width:120px" @change="searchLineageAnalysisList" clearable>
              <el-option v-for="(item,index) in dataBaseList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="当前数据表：">
            <el-input  placeholder="请输入关键字" v-model.trim="aImpactSearhForm.currentTable" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="上游数据库：">
            <el-select v-model="aImpactSearhForm.tarDataBase" placeholder="请选择" size="mini" style="width:120px" @change="searchLineageAnalysisList" clearable>
              <el-option v-for="(item,index) in dataBaseList2" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上游数据表：">
            <el-input  placeholder="请输入关键字" v-model.trim="aImpactSearhForm.tarTable" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search"  @click="searchLineageAnalysisList" style="padding:7px">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="card-container card-table" id="lab-table">
        <div class="card-table">
          <el-table
              :data="tableData"
              border
              show-header
              size="mini"
              style="width: 100%"
              :header-cell-style="{background:'#f8f8f9',color:'#606266',height:'45px'}">
            <el-table-column
            :show-overflow-tooltip='showToolTip'
                label="当前数据库">
              <template slot-scope="scope">
                <a class="a-color" @click="clickToDetails(scope.row.tarDbId,scope.row.tarDb,scope.row.tarDbClzId)">
                {{scope.row.tarDb}}
                </a>
              </template>
            </el-table-column>
             <el-table-column
            :show-overflow-tooltip='showToolTip'
                prop="tarDbPath"
                label="当前库上下文">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='showToolTip'
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
            <!-- <el-table-column
            :show-overflow-tooltip='showToolTip'
                label="程序名">
              <template slot-scope="scope"><a class="a-color" @click="clickToDetails(scope.row.procId,scope.row.procName,scope.row.procClzId)">
                {{scope.row.procName}} </a></template>
            </el-table-column> -->
            <el-table-column
            :show-overflow-tooltip='showToolTip'
                label="上游数据库">
              <template slot-scope="scope"><a class="a-color" @click="clickToDetails(scope.row.srcDbId,scope.row.srcDb,scope.row.srcDbClzId)">
                {{scope.row.srcDb}} </a></template>
            </el-table-column>
             <el-table-column
            :show-overflow-tooltip='showToolTip'
                prop="srcDbPath"
                label="上游库上下文">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='showToolTip'
                label="上游数据表">
              <template slot-scope="scope"><a class="a-color" @click="clickToDetails(scope.row.srcTableId,scope.row.srcTable,scope.row.srcTableClzId)">
                {{scope.row.srcTable}} </a></template>
            </el-table-column>
             <el-table-column
            :show-overflow-tooltip='showToolTip'
                prop="srcTablePath"
                label="上游表上下文">
            </el-table-column>
            <el-table-column
             align="center"
              width='140px'
                label="操作">
              <template slot-scope="scope">
                <el-tooltip  effect="dark" content="血统分析" placement="top" > 
                  <!-- <el-dropdown @command="handleBlood" v-permission="'LINEAGE_ANALYSIS'" placement='bottom-start'>
                    <el-button  type="text" size="small" style="margin:0 20px;">
                      <svg-icon icon-class="lineageAnalysis" class="lineageAnalysis"></svg-icon>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" trigger="click" class="handleBlood">
                      <el-dropdown-item :command="composeValue('EDGS',scope.row)">EDGS</el-dropdown-item>
                      <el-dropdown-item :command="composeValue('ASG',scope.row)">ASG</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown> -->
                  <el-button  type="text" size="small"  @click="handleBlood(scope.row)">
                    <svg-icon icon-class="lineageAnalysis" class="lineageAnalysis"></svg-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="钻取" placement="top">
                  <el-button  @click='clickToDrilling(scope.row,scope.$index)' type="text" size="small">
                    <svg-icon icon-class="drilling" class="drilling"></svg-icon>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="text-align: right">
          <pagination v-show="total>0" :total="total" :page.sync="icurrentPage"   :limit.sync="ipageSize" @pagination="getLineageAnalysisList" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { get } from '@/utils/request'
import Pagination from '@/components/Pagination'
export default {
  name: 'lineageAnalysis',
  components: { Pagination },
  data() {
    return {
      aImpactSearhForm: {
        currentDataBase: '',
        currentTable: '',
        tarDataBase: '',
        tarTable: ''
      },
      dataBaseList2: [],
      dataBaseList: [],
      tableData: [

      ],
      sTableOrColumn: "Table",
      icurrentPage: 1,
      ipageSize: 10,
      total: 10,
      showToolTip: true
    }
  },
  methods: {
    // composeValue(item, row) {
    //   return {
    //     'button': item,
    //     'row': row
    //   }
    // },
    handleBlood(row) {
      this.showLineage(row.tarTableId, row.tarTable, row.tarTableClzId)
    },
    showLineage(tarTableId, tarTable, tarTableClzId) {
      this.$router.push({
        name: 'lineageAnalysisCanvas',
        params: {
          id: tarTableId,
          _title: tarTable,
          classifierId: tarTableClzId
        }
      })
    },
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
    clickToDrilling(row, index) {
      this.$router.push({
        name: 'lineageDrilling',
        params: {
          id: index,
          _title: row.srcTable,
          srcTableId: row.srcTableId,
          tarTableId: row.tarTableId
        }
      })
    },
    getLineageAnalysisList() {
      const _this = this;
      get('md/listLineageRelation', {
        pageCurrent: _this.icurrentPage,
        pageSize: _this.ipageSize,
        classifierId: _this.sTableOrColumn,
        curDB: _this.aImpactSearhForm.currentDataBase,
        curTable: _this.aImpactSearhForm.currentTable,
        dsDB: _this.aImpactSearhForm.tarDataBase,
        dsTable: _this.aImpactSearhForm.tarTable
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
    searchLineageAnalysisList() {
      this.icurrentPage = 1
      this.getLineageAnalysisList()
    },
    getDataBaseList() {
      const _this = this;
      get('/md/getSchemaWithUpTbl').then(res => {
        if (res.code === 10000 && res.success === true) {
          _this.dataBaseList = res.data
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    getDataBaseList2() {
      const _this = this;
      get('/md/getSchemaWithDownTbl').then(res => {
        if (res.code === 10000 && res.success === true) {
          _this.dataBaseList2 = res.data
        } else {
          _this.$message.error(res.message)
        }
      })
    }
  },
  mounted() {
  },
  created() {
    this.showToolTip = true
    this.getLineageAnalysisList();
    this.getDataBaseList()
    this.getDataBaseList2()
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
  .card-table{
    .lineageAnalysis,.drilling{
            width:22px;
            height:22px;
      }
    /deep/ .el-button+.el-button{
        margin-left: 10px;
      }
  }
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
 .handleBlood{
  width:80px!important;
}
</style>
