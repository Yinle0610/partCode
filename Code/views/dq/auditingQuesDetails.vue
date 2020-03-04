<!--自动稽核-问题明细-->
<template>
  <div class="auditingQuesDetails dashboard-editor-container">
    <el-card shadow="hover" class="card-container">
      <el-button type="primary" size="small" @click="toExport">导出</el-button>
        <el-card class="card-table">
          <el-table
              :data="tableData"
              style="width: 100%">
            <el-table-column
                prop="issueId"
                label="问题编号"
                width="140">
            </el-table-column>
            <el-table-column
                prop="issueName"
                label="问题名称"
                width="140">
            </el-table-column>
            <el-table-column
                prop="checkDate"
                label="稽核日期"
                width="140">
            </el-table-column>
            <el-table-column
                prop="checkSystem"
                label="稽核系统"
                width="140">
            </el-table-column>
            <el-table-column
                prop="checkSchema"
                label="SCHEMAS"
                width="140">
            </el-table-column>
            <el-table-column
                prop="checkTable"
                label="稽核表"
                width="140"
                :render-header="renderHeader1">
            </el-table-column>
            <el-table-column
                prop="checkColumn"
                label="稽核字段名"
                width="140"
                :render-header="renderHeader2">
            </el-table-column>
            <el-table-column
                prop="columnValue"
                label="稽核字段值"
                :render-header="renderHeader3">
            </el-table-column>
          </el-table>
        </el-card>
        <div style="text-align: center; padding: 10px 0">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="oPage.pageCurrent"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="2"
              layout="total, sizes, prev, pager, next, jumper"
              :total="oPage.total">
          </el-pagination>
        </div>
    </el-card>
  </div>
</template>

<script>
  import { get, parseAjaxResponse } from '../../../src/utils/request'

  export default {
    name: 'auditingQuesDetails',
    components: { },

    data() {
      return {
        tableData: [],
        oPage: {
          pageCurrent: 1,
          pageSize: 10,
          total: 0
        },
        questionId: this.$route.params.questionId,
        kpiId: this.$route.params.kpiId,
        chkDate: this.$route.params.chkDate,
        api: ''
      }
    },
    methods: {
      // 获取自动稽核详情列表信息 /dqms/issuequery/listAutoCheckDetailInfos
      getListAutoCheckDetailInfos() {
        get('/dqms/issuequery/listAutoCheckDetailInfos', {
          questionId: this.questionId, // 问题ID
          pageCurrent: this.oPage.pageCurrent,
          pageSize: this.oPage.pageSize
        }).then((res) => {
          parseAjaxResponse(res, () => {
            console.log(res)
            if (res.code === 10000) {
              this.oPage.pageCurrent = res.data.current
              this.oPage.total = res.data.total
              this.tableData = res.data.records
            }
          })
        })
      },
      // 导出问题明细 /dqms/issuequery/downloadDetail (导出文件)
      getDownloadDetail() {
        this.api = process.env.BASE_API;
        window.location.href = `${this.api}/dqms/issuequery/downloadDetail?chkDate=${this.chkDate}&kpiId=${this.kpiId}&questionId=${this.questionId}`
      },

      // render事件 (elementui 2.4.11以上支持template自定义表头，当前安装版本为2.3，只能使用render-header自定义表头)
      renderHeader1(h, { column }) { // h即为cerateElement的简写
        return (
          <div>
            <span style='margin-right: 3px'>{column.label}</span>
            <el-tooltip
              class='tooltip' effect='dark'
              placement='top' content='数据库中被检查的表名'>
              <i class='el-icon-question'></i>
            </el-tooltip>
          </div>
        )
      },
      renderHeader2(h, { column }) {
        return (
          <div>
            <span style='margin-right: 3px'>{column.label}</span>
            <el-tooltip
              class='tooltip' effect='dark'
              placement='top' content='数据库中被检查的字段名'>
              <i class='el-icon-question'></i>
            </el-tooltip>
          </div>
        )
      },
      renderHeader3(h, { column }) {
        return (
          <div>
            <span style='margin-right: 3px'>{column.label}</span>
            <el-tooltip
              class='tooltip' effect='dark'
              placement='top' content='数据库中检查发现的异常值'>
              <i class='el-icon-question'></i>
            </el-tooltip>
          </div>
        )
      },
      // 导出
      toExport() {
        this.getDownloadDetail()
      },

      handleSizeChange(val) {
        this.oPage.pageSize = val
        this.getListAutoCheckDetailInfos()
      },
      handleCurrentChange(val) {
        this.oPage.pageCurrent = val
        this.getListAutoCheckDetailInfos()
      }

    },
    created() {
      this.getListAutoCheckDetailInfos()
    },
    mounted() {

    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  //外层card容器样式
  @import './../../styles/dq/main-card-table.scss';


</style>
