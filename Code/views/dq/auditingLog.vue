<!--ETL稽核监控-->
<template>
  <div class="auditingQuesDetails dashboard-editor-container">
    <el-card shadow="hover" class="card-container" style="margin-bottom: 10px; font-size: 14px">
      <div class="card-title">
        <i class="icon-custom-summaryInformation"></i><span>今日稽核结果</span>
      </div>
      <el-row style="margin-top: 10px;">
        <el-col :span="4" class="information">
          <span class="instrumentPanel">
            <span class="instrumentPanelSpan">
              <img src="./../../assets/images/icon-auditlog01.png" alt="">
            </span>
            <span class="instrumentPanelText">
              <span class="instrumentPanelTextSpan1">正常率</span>
              <span class="instrumentPanelTextSpan2">{{oTodayCheckInfo.normalRate}}</span>
            </span>
          </span>
        </el-col>
        <el-col :span="4" class="information">
          <span class="instrumentPanel">
            <span class="instrumentPanelSpan">
              <img src="./../../assets/images/icon-auditlog02.png" alt="">
            </span>
            <span class="instrumentPanelText">
              <span class="instrumentPanelTextSpan1">稽核次数</span>
              <span class="instrumentPanelTextSpan2">{{oTodayCheckInfo.checkNum}}</span>
            </span>
          </span>
        </el-col>
        <el-col :span="4" class="information">
          <span class="instrumentPanel">
            <span class="instrumentPanelSpan">
              <img src="./../../assets/images/icon-auditlog03.png" alt="">
            </span>
            <span class="instrumentPanelText">
              <span class="instrumentPanelTextSpan1">正常数</span>
              <span class="instrumentPanelTextSpan2">{{oTodayCheckInfo.normalNum}}</span>
            </span>
          </span>
        </el-col>
        <el-col :span="4" class="information">
          <span class="instrumentPanel">
            <span class="instrumentPanelSpan">
              <img src="./../../assets/images/icon-auditlog04.png" alt="">
            </span>
            <span class="instrumentPanelText">
              <span class="instrumentPanelTextSpan1">异常数</span>
              <span class="instrumentPanelTextSpan2">{{oTodayCheckInfo.unusualNum}}</span>
            </span>
          </span>
        </el-col>
        <el-col :span="4" class="information">
          <span class="instrumentPanel">
            <span class="instrumentPanelSpan">
              <img src="./../../assets/images/icon-auditlog05.png" alt="">
            </span>
            <span class="instrumentPanelText">
              <span class="instrumentPanelTextSpan1">目标表数量</span>
              <span class="instrumentPanelTextSpan2">{{oTodayCheckInfo.tableNum}}</span>
            </span>
          </span>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="hover" class="card-container">
      <el-row>
        <el-col :span="10">
          <el-radio-group size="small" v-model="focusRadio" @change="clickGroupRadio">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button :label="1">正常</el-radio-button>
            <el-radio-button :label="2">异常</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="14">
          <div style="float: right;min-width:476px">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="日志时间：">
                <el-date-picker size="small"
                                v-model="formInline.logDateList"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" class="btn-class" @click="handleCurrentChange(1)">确定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <div class="divider"></div>
      <el-card class="card-table">
        <el-table
            :data="tableData"
            border
            style="width: 100%">
          <el-table-column
              label="稽核名称"
              width="248">
            <template slot-scope="scope"><a class="a-color" @click="auditNameClick(scope.row)">{{scope.row.checkName }}</a></template>
          </el-table-column>
          <el-table-column
              prop="originSystem"
              label="源头系统"
              width="248">
          </el-table-column>
          <el-table-column
              prop="system"
              label="目标系统"
              width="248">
          </el-table-column>
          <el-table-column
              prop="status"
              label="状态"
              width="248">
          </el-table-column>
          <el-table-column
              prop="logDateTime"
              label="日志时间">
          </el-table-column>
        </el-table>
      </el-card>

      <div style="text-align: center; padding: 10px 0">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="oPage.pageCurrent"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="oPage.pageSize"
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
    name: 'auditingLog',
    data() {
      return {
        tableData: [
          { id: 1, checkName: 'AUDIT_B03_TRADEACCO_REG_21', originSystem: 'BDW', system: 'BDW', status: '正常', logDateTime: '2019-01-16 11:00:55' },
          { id: 2, checkName: 'AUDIT_B03_TRADEACCO_REG_22', originSystem: 'BDW2', system: 'BDW2', status: '正常', logDateTime: '2019-01-17 11:00:55' }
        ],
        currentPage: 1,
        total: 10,
        oPage: {
          pageCurrent: 1,
          pageSize: 10,
          total: 0
        },
        formInline: {
          logDateList: []
        },
        focusRadio: '',
        // 今日稽核结果
        oTodayCheckInfo: {
          checkNum: '',
          normalNum: '',
          normalRate: "",
          tableNum: '',
          unusualNum: '0'
        }

      }
    },
    methods: {
      // 获取今日稽核结果信息  /dqms/etlmonitor/getTodayCheckInfo
      getTodayCheckInfo() {
        get('/dqms/etlmonitor/getTodayCheckInfo').then((res) => {
          parseAjaxResponse(res, () => {
            console.log(res)
            if (res.code === 10000) {
              this.oTodayCheckInfo = res.data
            }
          })
        })
      },
      // 分页获取稽核信息列表  /dqms/etlmonitor/listETLCheckInfos
      getListETLCheckInfos() {
        get('/dqms/etlmonitor/listETLCheckInfos', {
          startDate: this.formInline.logDateList[0] !== null ? this.formInline.logDateList[0] : '', // 开始日期(yyyy-MM-dd)
          endDate: this.formInline.logDateList[1] !== null ? this.formInline.logDateList[1] : '', // 结束日期(yyyy-MM-dd)
          status: this.focusRadio, // 状态(1:正常;2:异常)
          pageCurrent: this.oPage.pageCurrent,
          pageSize: this.oPage.pageSize
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.oPage.pageCurrent = res.data.current
              this.oPage.total = res.data.total
              // this.tableData = res.data.records
            }
          })
        })
      },
      auditNameClick(row) {
        this.$router.push({
          name: 'auditDetails',
          params: {
            id: row.id,
            checkName: row.checkName,
            logDateTime: row.logDateTime
          }
        })
      },
      clickGroupRadio(val) {
        this.focusRadio = val
        this.getListETLCheckInfos()
      },
      handleSizeChange(val) {
        this.oPage.pageSize = val
        this.getListETLCheckInfos()
      },
      handleCurrentChange(val) {
        this.oPage.pageCurrent = val
        this.getListETLCheckInfos()
      }

    },
    created() {
      this.getTodayCheckInfo()
      this.getListETLCheckInfos()
    },
    mounted() {

    }
  }
</script>


<style lang="scss" scoped>
  //外层card容器样式
  @import './../../styles/dq/main-card-table.scss';


  .card-title {
    /*position: relative;*/
    width: 100%;
    border-bottom: 1px solid #e8eaec;
    padding-bottom: 10px;
    .icon-custom-summaryInformation{
      position: relative;
      top: 2px;
      margin-right: 8px;
      display: inline-block;
      width: 16px;
      height: 16px;
      background: url('../../assets/images/summaryInformation.png') no-repeat;
      background-size: 100% 100%;
    }
  }

  .information {
    height: 100%;
    width: 19%;
    margin-left: 0.5%;
    margin-right: 0.5%;
    padding: 15px;
    border: 1px solid #e9e9e9;
  }
  .instrumentPanel {
    width: 100%;
    display: flex;
    text-align: center;
    .instrumentPanelSpan {
      width: 40%;
      padding: 2%;
      display: inline-block;
    }
  }
  .instrumentPanelSpan>img {
    width: 50px;
    height: 50px;
  }
  .instrumentPanelText {
    width: 60%;
    padding: 2%;
    display: inline-block;
    .instrumentPanelTextSpan1 {
      color: #666;
      font-size: 14px;
      display: block;
      text-align: center;
    }
    .instrumentPanelTextSpan2 {
      color: #333;
      font-size: 20px;
      display: block;
      padding-top: 5%;
      text-align: center;
    }
  }

  //分隔线
  .divider {
    margin: 10px 0;
    border-bottom: 1px solid #e8ebed;
  }
  .a-color{
    color: #2d8cf0;
  }

  .el-form-item {
     margin-bottom: 0;
  }
  .el-form--inline .el-form-item {
    margin-right: 0;
  }

.auditingQuesDetails /deep/{
  .el-radio-button--small .el-radio-button__inner {
    padding: 11px 10px;
    font-size: 10px;
  }
}
</style>
