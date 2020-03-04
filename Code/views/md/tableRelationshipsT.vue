<!--表与表之间关系-->
<template>
  <div class="table-relationships-t dashboard-editor-container">
    <el-card shadow="hover" class="card-container">
      <div class="filter-class">
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline" align="center">
            <el-form-item label="源关键字：" prop="code">
              <el-input clearable v-model="formInline.sourceKeyword" placeholder="请输入..." size="small"></el-input>
            </el-form-item>
            <el-form-item label="目标关键字：" prop="name">
              <el-input clearable v-model="formInline.targetKeyword" placeholder="请输入..." size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch" size="small"> <i class="el-icon-search"></i> 搜索</el-button>
            </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card shadow="hover" class="card-container" style="margin-top: 10px" v-loading="bIsLoading">
      <el-card class="card-table">
        <el-table
            :data="tableData"
            style="width: 100%">
          <el-table-column
              label="源数据库"
              >
            <template slot-scope="scope"><a class="a-color" @click="toMetaDataDetails(scope.row, 'srcDb', 'srcDbId')"> {{scope.row.srcDb}} </a> </template>
          </el-table-column>
          <el-table-column
              label="源表"
              >
            <template slot-scope="scope"><a class="a-color" @click="toMetaDataDetails(scope.row, 'srcTable', 'srcTableId')"> {{scope.row.srcTable}} </a> </template>
          </el-table-column>
          <el-table-column
              label="ETL作业"
              >
            <template slot-scope="scope"><a class="a-color" @click="toMetaDataDetails(scope.row, 'procName', 'procId')"> {{scope.row.procName}} </a> </template>
          </el-table-column>
          <el-table-column
              label="目标数据库"
              >
            <template slot-scope="scope"><a class="a-color" @click="toMetaDataDetails(scope.row, 'tarDb', 'tarDbId')"> {{scope.row.tarDb}} </a> </template>
          </el-table-column>
          <el-table-column
              label="目标表"
              >
            <template slot-scope="scope"><a class="a-color" @click="toMetaDataDetails(scope.row, 'tarTable', 'tarTableId')"> {{scope.row.tarTable}} </a> </template>
          </el-table-column>
          <el-table-column
              label="下站"
              >
            <template slot-scope="scope"><a class="a-color" @click="toFieldRelationshipsT(scope.row, 'srcTable', 'srcTableId')"> <i class="el-icon-bottom"></i> </a> </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div style="text-align: center; padding: 10px 0" v-if="total>0">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { get, parseAjaxResponse } from '../../utils/request'

  export default {
    name: "tableRelationshipsT",
    data() {
      return {
        bIsLoading: true,
        formInline: {
          sourceKeyword: '',
          targetKeyword: ''
        },
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    },
    methods: {
      // 获取表与表之间关系列表数据
      getTableLists() {
        get('/md/listTbl2TblORCol2ColRelation', {
          classifierId: 'Table', // 表:Table， 字段：Column
          // mee2568d5aad43168fa22015c8daf9ab （测试表与表 三农系统）
          // srcId: 'mee2568d5aad43168fa22015c8daf9ab',
          // tarId: "pfdd699b08804b6bb961a30ca51156b5",

          // "o59d9ddfff0842828aeffbf5be01c6bd" (测试字段与字段 -贴源数据层 - 公共代码）
          // srcId: "o59d9ddfff0842828aeffbf5be01c6bd",
          // tarId: "od3421bf4cc94996ad6fd56b7ce15458",

          srcId: this.$route.params.srcId !== undefined ? this.$route.params.srcId : null, // 源ID
          tarId: this.$route.params.tarId !== undefined ? this.$route.params.tarId : null, // 目标ID
          sourceKeyword: this.formInline.sourceKeyword, // 上游关键词
          targetKeyword: this.formInline.targetKeyword, // 下游关键词
          pageCurrent: this.currentPage,
          pageSize: this.pageSize
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.bIsLoading = false
              this.currentPage = res.data.current
              this.total = res.data.total
              this.tableData = res.data.records
            }
          })
        })
      },
      // 搜索
      onSearch() {
        this.handleCurrentChange(1)
      },

      // 跳转到元数据详情页面
      toMetaDataDetails(row, name, strId) {
        console.log(row)
        let classifierId = '';
        if (name === 'srcDb' || name === 'tarDb') { // 源数据库、目标数据库
          classifierId = 'Schema'
        } else if (name === 'srcTable' || name === 'tarTable') { // 源表、目标表
          classifierId = 'Table'
        } else if (name === 'procName') { // ETL作业
          classifierId = 'TableMapping' // 表级映射
        }
        this.$router.push({
          name: 'impactAndLineageDetail',
          params: {
            _title: row[name],
            id: row[strId],
            classifierId: classifierId
          }
        })
      },
      // 跳转到字段与字段之间关系
      toFieldRelationshipsT(row, name, strId) {
        console.log(row)
        this.$router.push({
          name: 'fieldRelationshipsT',
          params: {
            id: row[strId], // 源id
            srcId: row.srcTableId, // 源id
            tarId: row.tarTableId // 目标id
          }
        })
      },

      handleSizeChange(val) {
        this.pageSize = val
        this.getTableLists()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getTableLists()
      }

    },
    created() {
      this.getTableLists()
    },
    mounted() {

    }
  }
</script>


<style lang="scss" scoped>
  //外层card容器样式
  @import './../../styles/dq/main-card-table.scss';

  .table-relationships-t{
    .el-form-item {
      margin-bottom: 0px;
    }


  }


</style>
