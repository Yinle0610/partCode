<!-- 日志明细 -->
<template>
  <div class="dashboard-editor-container">
    <el-card shadow="hover" class="card-container">
      <div slot="header" class="clearfix">
        <el-col :span="4"><span>基本信息</span></el-col>
        <el-col :span="20">
          <div class="title-btn-class">
            <el-button class="btn-success" size="small" v-show="status == '正常'">{{status}}</el-button>
            <el-button class="btn-error" size="small" v-show="status == '异常'">{{status}}</el-button>
          </div>
        </el-col>
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

    <el-card shadow="hover" class="card-container" style="margin-top: 5px">
      <div slot="header" class="clearfix">
        <span>维度及指标信息</span>
      </div>
      <twoColumnVerticalTable :columnTableData="dimensionData"></twoColumnVerticalTable>

<!--      <div class="table-tbody">-->
<!--        <el-row v-for="(item, i) in dimensionData" :key="i" class="el-row-bottom el-row-enter">-->
<!--          <el-col :span="12" v-for="(ele, i) in item" :key="i">-->
<!--            <el-col :span="4" class="table-title col-class">-->
<!--              <div class="table-cell">-->
<!--                {{ ele[0].key }}-->
<!--              </div>-->
<!--            </el-col>-->
<!--            <el-col :span="8" class="col-class">-->
<!--              <div class="table-cell">-->
<!--                {{ele[0].value}}-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-col>-->
<!--          <el-col :span="12" v-for="(ele, i) in item" :key="i">-->
<!--            <el-col :span="4" class="table-title col-class">-->
<!--              <div class="table-cell">-->
<!--                {{ ele[1].key }}-->
<!--              </div>-->
<!--            </el-col>-->
<!--            <el-col :span="8" class="col-class">-->
<!--              <div class="table-cell">-->
<!--                {{ ele[1].value }}-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-col>-->

<!--        </el-row>-->
<!--      </div>-->
    </el-card>

    <el-card shadow="hover" class="card-container" style="margin-top: 5px">
      <div slot="header" class="clearfix">
        <span>结果信息</span>
      </div>
      <twoColumnVerticalTable :columnTableData="resData"></twoColumnVerticalTable>
<!--      <div class="table-tbody">-->
<!--        <el-row v-for="(item, i) in resData" :key="i" class="el-row-bottom el-row-enter">-->
<!--          <el-col :span="12" v-for="(ele, i) in item" :key="i">-->
<!--            <el-col :span="4" class="table-title col-class">-->
<!--              <div class="table-cell">-->
<!--                {{ele[0].key}}-->
<!--              </div>-->
<!--            </el-col>-->
<!--            <el-col :span="8" class="col-class">-->
<!--              <div class="table-cell">-->
<!--                {{ele[0].value}}-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-col>-->
<!--          <el-col :span="12" v-for="(ele, i) in item" :key="i">-->
<!--            <el-col :span="4" class="table-title col-class">-->
<!--              <div class="table-cell">-->
<!--                {{ele[1].key}}-->
<!--              </div>-->
<!--            </el-col>-->
<!--            <el-col :span="8" class="col-class">-->
<!--              <div class="table-cell">-->
<!--                {{ele[1].value}}-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-col>-->

<!--        </el-row>-->
<!--      </div>-->
    </el-card>
  </div>
</template>

<script>
  import { get, parseAjaxResponse } from '../../../src/utils/request'
  import twoColumnVerticalTable from "../md/components/twoColumnVerticalTable";
  import oneColumnVerticalTable from "../md/components/oneColumnVerticalTable";

  export default {
    name: 'auditDetails',
    components: {
      oneColumnVerticalTable, twoColumnVerticalTable
    },
    data() {
      return {
        checkName: this.$route.params.checkName !== undefined ? this.$route.params.checkName : '', // 稽核名称
        logDateTime: this.$route.params.logDateTime !== undefined ? this.$route.params.logDateTime : '', // 日志时间(yyyy-MM-dd HH:mm:ss)
        status: '正常',
        baseData: [
          { 'key': '稽核名称', 'value': 123 },
          { 'key': '稽核批次', 'value': 222 },
          { 'key': '稽核源头系统', 'value': 222 },
          { 'key': '稽核目标系统', 'value': 2222 },
          { 'key': '日志插入时间', 'value': 2222 }
        ],
        dimensionData: [
          { 'key': '稽核维度1:', 'value': '11' },
          { 'key': '稽核维度2:', 'value': '11' },
          { 'key': '稽核维度3:', 'value': '11' },
          { 'key': '稽核维度4:', 'value': '11' },
          { 'key': '稽核指标1:', 'value': '22' },
          { 'key': '稽核指标2:', 'value': '22' },
          { 'key': '稽核指标3:', 'value': '22' },
          { 'key': '稽核指标4:', 'value': '22' }
        ],
        resData: [
          { 'key': '源头系统结果1:', 'value': '11' },
          { 'key': '源头系统结果2:', 'value': '11' },
          { 'key': '源头系统结果3:', 'value': '11' },
          { 'key': '源头系统结果4:', 'value': '11' },
          { 'key': '目标系统结果1:', 'value': '22' },
          { 'key': '目标系统结果2:', 'value': '22' },
          { 'key': '目标系统结果3:', 'value': '22' },
          { 'key': '目标系统结果4:', 'value': '22' }
        ]
      }
    },
    methods: {
      // 获取ETL稽核详情信息  /dqms/etlmonitor/getETLCheckDetailInfo
      getETLCheckDetailInfo() {
        get('/dqms/etlmonitor/getETLCheckDetailInfo', {
          checkName: this.checkName, // 稽核名称
          logDateTime: this.logDateTime // 日志时间(yyyy-MM-dd HH:mm:ss)
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.baseData = [
                { 'key': '稽核名称', 'value': 'res.data' },
                { 'key': '稽核批次', 'value': 'res.data' },
                { 'key': '稽核源头系统', 'value': 'res.data' },
                { 'key': '稽核目标系统', 'value': 'res.data' },
                { 'key': '日志插入时间', 'value': 'res.data' }
              ]
              // 维度及指标信息 todo

              // 结果信息 todo
            }
          })
        })
      },
      dimensionDataFn() { // 维度及指标信息
        for (let i = 1; i < 9; i++) {
          this.dimensionData.push({
            "key": "稽核维度" + i, "value": "resData['AUDIT_IDX_'+i]"
          });
        }
        for (let i = 1; i < 9; i++) {
          this.dimensionData.push({
            "key": "稽核指标" + i, "value2": "resData['AUDIT_MEASURE_'+i]"
          })
        }
        console.log(111)
        console.log(this.dimensionData)
      },
      resDataFn() { // 结果信息
        for (let i = 1; i < 9; i++) {
          this.resData.push({
            "key": "源头系统结果" + i, "value": "resData['AUDIT_SRC_VAL_'+i]"
          });
        }
        for (let i = 1; i < 9; i++) {
          this.resData.push({
            "key": "目标系统结果" + i, "value2": "resData['AUDIT_TRG_VAL_'+i]"
          });
        }
      }

    },
    created() {
      // this.dimensionDataFn()
      // this.resDataFn()
      this.getETLCheckDetailInfo()
    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>
  //外层card容器样式
  @import './../../styles/dq/main-card-table.scss';

  .title-btn-class {
    float: right;

    .btn-success {
      color: #fff;
      background-color: #19be6b;
      border-color: #19be6b;
    }

    .btn-error {
      color: #fff;
      background-color: #ed4014;
      border-color: #ed4014;
    }
  }

  .table-tbody {
    color: #515a6e;
    font-size: 12px;
    border: 1px solid #e8eaec;
    border-bottom: none;

    .el-row-bottom {
      border-bottom: 1px solid #e8eaec;
    }

    .el-row-enter:hover {
      background-color: #F5F8FB;

      .table-cell {
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

    .table-title.col-class {
      border-right: 1px solid #e8eaec;
    }

    .col-class {
      min-width: 0;
      height: 48px;
      text-align: left;
      text-overflow: ellipsis;
      vertical-align: middle;
    }


  }

</style>
