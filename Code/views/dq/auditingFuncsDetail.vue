<!--稽核方法详情 - 检核表 -->
<template>
  <div class="dashboard-editor-container">
    <el-card shadow="hover" class="card-container">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <oneColumnVerticalTable :columnTableData="baseData" :showelTable="true"></oneColumnVerticalTable>
<!--      <div class="table-tbody">-->
<!--        <el-row v-for="(item, i) in baseData" :key="i" class="el-row-bottom el-row-enter">-->
<!--          <el-col :span="5" class="table-title col-class">-->
<!--            <div class="table-cell">-->
<!--              {{item.key}}-->
<!--            </div>-->
<!--          </el-col>-->
<!--          <el-col :span="19" class="col-class">-->
<!--            <div class="table-cell">-->
<!--              {{item.value}}-->
<!--            </div>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--      </div>-->
    </el-card>

    <el-card shadow="hover" style="margin-top: 5px">
      <div slot="header" class="clearfix">
        <span>详细信息</span>
      </div>
      <oneColumnVerticalTable :columnTableData="detailData" :showelTable="true"></oneColumnVerticalTable>
<!--      <div class="table-tbody">-->
<!--        <el-row v-for="(item, i) in detailData" :key="i" class="el-row-bottom el-row-enter">-->
<!--          <el-col :span="5" class="table-title col-class">-->
<!--            <div class="table-cell">-->
<!--              {{item.key}}-->
<!--            </div>-->
<!--          </el-col>-->
<!--          <el-col :span="19" class="col-class">-->
<!--            <div class="table-cell">-->
<!--              {{item.value}}-->
<!--            </div>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--      </div>-->
    </el-card>
  </div>
</template>

<script>
  import oneColumnVerticalTable from "../md/components/oneColumnVerticalTable";
  import { get, parseAjaxResponse } from '../../../src/utils/request'

  export default {
    name: 'auditingFuncsDetail',
    components: {
      oneColumnVerticalTable
    },

    data() {
      return {
        baseTitles: [
          {
            key: 'key',
            width: 200,
            className: 'tableTitle'
          },
          {
            key: 'value'
          }
        ],
        baseData: [
          // { 'key': '检核方法ID:', 'value': 123 },
          // { 'key': '检核方法名称:', 'value': 222 },
          // { 'key': '检核方法描述:', 'value': 222 },
          // { 'key': '度量规则分类:', 'value': 2222 },
          // { 'key': '度量规则名称:', 'value': 2222 },
          // { 'key': '检核方法大类:', 'value': 2222 },
          // { 'key': '检核方法小类:', 'value': 222222 },
          // { 'key': '创建人:', 'value': 222222 },
          // { 'key': '创建时间:', 'value': 222222 }
        ],
        detailData: [
          // { 'key': '检核系统:', 'value': 11 },
          // { 'key': '检核系统代码:', 'value': 22 },
          // { 'key': '检核Schema:', 'value': 33 },
          // { 'key': '检核表:', 'value': 44 },
          // { 'key': '检核字段:', 'value': 55 },
          // { 'key': '方法执行SQL:', 'value': 66 }
        ],
        classId: this.$route.params.classId !== undefined ? this.$route.params.classId : '', // 方法种类ID
        functionId: this.$route.params.functionId !== undefined ? this.$route.params.functionId : '', // 检核方法ID
        tableType: this.$route.params.tableType !== undefined ? this.$route.params.tableType : '' // 表类型 (1:主表 2：副表)
      }
    },
    methods: {
      // 获取稽核方法的详情信息  /dqms/checkfunction/getKpiFunctionDetailInfo
      getKpiFunctionDetail() {
        get('/dqms/checkfunction/getKpiFunctionDetailInfo', {
          classId: this.classId, // 方法种类ID
          functionId: this.functionId, // 检核方法ID
          tableType: this.tableType // 表类型 (1:主表 2：副表)
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.baseData = [
                { 'key': '检核方法ID', 'value': res.data.functionId },
                { 'key': '检核方法名称', 'value': res.data.functionName },
                { 'key': '检核方法描述', 'value': res.data.functionDesc },
                { 'key': '度量规则分类', 'value': res.data.ruleType },
                { 'key': '度量规则名称', 'value': res.data.ruleName },
                { 'key': '检核方法大类', 'value': res.data.majorClass },
                { 'key': '检核方法小类', 'value': res.data.smallClass },
                { 'key': '创建人', 'value': res.data.creaUser.userName },
                { 'key': '创建时间', 'value': res.data.createDate }
              ]
              this.detailData = [
                { 'key': '检核系统', 'value': res.data.systemName },
                { 'key': '检核系统代码', 'value': res.data.systemCode },
                { 'key': '检核Schema', 'value': res.data.checkSchema },
                { 'key': '检核表', 'value': res.data.checkTable	 },
                { 'key': '检核字段', 'value': res.data.checkColumn },
                { 'key': '方法执行SQL', 'value': res.data.executionSQL }
              ]
            }
          })
        })
      }
    },
    created() {
      this.getKpiFunctionDetail()
    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>
  //外层card容器样式
  @import './../../styles/dq/main-card-table.scss';


  .table-tbody{
    color: #515a6e;
    font-size: 12px;
    border: 1px solid #e8eaec;
    border-bottom: none;
    .el-row-bottom{
      border-bottom: 1px solid #e8eaec;
    }
    .el-row-enter:hover{
      background-color: #F5F8FB;
      .table-cell{
        background-color: #F5F8FB;
      }
    }
    .table-title {
      background-color: #f5f7f9;
      width: 200px;
    }
    .table-cell {
      padding-left: 18px;
      padding-right: 18px;
      overflow: hidden;
      line-height: 48px;
      text-overflow: ellipsis;
      white-space: normal;
      word-break: break-all;
    }
    .table-title.col-class{
      border-right: 1px solid #e8eaec;
    }
    .col-class{
      min-width: 0;
      height: 48px;
      text-align: left;
      text-overflow: ellipsis;
      vertical-align: middle;
    }


  }

</style>
