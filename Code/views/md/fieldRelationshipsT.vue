<!--字段与字段之间关系-->
<template>
  <div class="fieldRelationshipsT dashboard-editor-container">
    <el-card shadow="hover" class="card-container" v-loading="bIsLoading">
      <el-card class="card-table">
        <el-table
            :data="tableData"
            style="width: 100%">
          <el-table-column
              label="源表">
            <template slot-scope="scope"><a class="a-color" @click="toMetaDataDetails(scope.row, 'srcTable', 'srcTableId')"> {{scope.row.srcTable}} </a> </template>
          </el-table-column>
          <el-table-column
              label="源字段">
            <template slot-scope="scope"><a class="a-color" @click="toMetaDataDetails(scope.row, 'srcColumn', 'srcColumnId')"> {{scope.row.srcColumn}} </a> </template>
          </el-table-column>
          <el-table-column
              label="ETL作业">
            <template slot-scope="scope"><a class="a-color" @click="toMetaDataDetails(scope.row, 'procName', 'procId')"> {{scope.row.procName}} </a> </template>
          </el-table-column>
          <el-table-column
              prop="questionDes"
              label="目标表"
              >
            <template slot-scope="scope"><a class="a-color" @click="toMetaDataDetails(scope.row, 'tarTable', 'tarTableId')"> {{scope.row.tarTable}} </a> </template>
          </el-table-column>
          <el-table-column
              prop="questionDes"
              label="目标字段">
            <template slot-scope="scope"><a class="a-color" @click="toMetaDataDetails(scope.row, 'tarColumn', 'tarColumnId')"> {{scope.row.tarColumn}} </a> </template>
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
    name: 'fieldRelationshipsT',
    data() {
      return {
        bIsLoading: true,
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
          classifierId: 'Column', // 表:Table， 字段：Column
          srcId: this.$route.params.srcId !== undefined ? this.$route.params.srcId : null, // 源ID
          tarId: this.$route.params.tarId !== undefined ? this.$route.params.tarId : null, // 目标ID
          // sourceKeyword: this.formInline.sourceKeyword, // 上游关键词
          // targetKeyword: this.formInline.targetKeyword, //下游关键词
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
      // 跳转到元数据详情页面
      toMetaDataDetails(row, name, strId) {
        let classifierId = '';
        if (name === 'srcTable' || name === 'tarTable') { // 源表、目标表
          classifierId = 'Table'
        } else if (name === 'srcColumn' || name === 'tarColumn') { // 源字段、目标字段
          classifierId = 'Column'
        } else if (name === 'procName') { // ETL作业
          classifierId = 'ColumnMapping' // 字段级映射
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
  .fieldRelationshipsT{

  }

</style>
