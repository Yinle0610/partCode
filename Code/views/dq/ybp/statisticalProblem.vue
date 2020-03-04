<template>
  <div class="hole">
    <div class="header">
      <p class="quesbtnTab">
        <span>
          <img src="./../../../assets/images/commonIcon/icon-title-change.png" alt />
          {{radioType}}问题统计
        </span>
        <span class="btn-group">
          <el-radio-group @change="changeRadio" v-model="radio1">
            <el-radio-button label="手工提交"></el-radio-button>
            <el-radio-button label="自动稽核"></el-radio-button>
          </el-radio-group>
        </span>
      </p>
    </div>
    <div class="hole-content">
      <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column property="date" label>
          <template slot-scope="scope">
            <span
              v-if="radio1 === '手工提交'"
              :style="{color: scope.row.name === 'newRegister' ? '#faad14':scope.row.name === 'resolved' ? '#52c41a':'#f5222d'}"
            >{{ scope.row.name ==='resolved'?'已解决': scope.row.name ==='newRegister'? '新登记' :'处理中'}}</span>
            <span
              v-else
              :style="{color: scope.row.name === 'unAccepted' ? '#faad14':scope.row.name === 'hasAccepted' ? '#52c41a':'#f5222d'}"
            >{{ scope.row.name ==='unAccepted'?'未受理': scope.row.name ==='hasAccepted'? '已受理' :'已忽略'}}</span>
          </template>
        </el-table-column>
        <el-table-column property="numOnMonth" label="当月">
          <template slot-scope="scope">
            <el-button @click="handleManualMonth(scope.row)" type="text">{{scope.row.numOnMonth}}</el-button>
          </template>
        </el-table-column>
        <el-table-column property="numOnYear" label="当年">
          <template slot-scope="scope">
            <el-button @click="handleManualYear(scope.row)" type="text">{{scope.row.numOnYear}}</el-button>
          </template>
        </el-table-column>
        <el-table-column property="total" label="历史累计">
          <template slot-scope="scope">
            <el-button @click="toProSearch(scope.row)" type="text">{{scope.row.total}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-table
        v-show="radio1 === '自动稽核'"
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column property="date" label width="120">
          <template slot-scope="scope">
            <span
              :style="{color: scope.row.name === 'unAccepted' ? '#faad14':scope.row.name === 'hasAccepted' ? '#52c41a':'#f5222d'}"
            >{{ scope.row.name ==='unAccepted'?'未受理': scope.row.name ==='hasAccepted'? '已受理' :'已忽略'}}</span>
          </template>
        </el-table-column>
        <el-table-column property="numOnMonth" label="当月" width="120">
          <template slot-scope="scope">
            <el-button @click="toProSearch(scope.row)" type="text">{{scope.row.numOnMonth}}</el-button>
          </template>
        </el-table-column>
        <el-table-column property="numOnYear" label="当年" width="120">
          <template slot-scope="scope">
            <el-button @click="toProSearch(scope.row)" type="text">{{scope.row.numOnYear}}</el-button>
          </template>
        </el-table-column>
        <el-table-column property="total" label="历史累计">
          <template slot-scope="scope">
            <el-button @click="toProSearch(scope.row)" type="text">{{scope.row.total}}</el-button>
          </template>
        </el-table-column>
      </el-table>-->
    </div>
  </div>
</template>

<script>
import { get } from "@/utils/request";
export default {
  data() {
    return {
      tableData: [],
      manualTable: {},
      auditTable: {},
      radio1: "手工提交",
      radioType: "手工",
      activeName: "0",
      status: [],
      endTime: "",
      startTime: ""
    };
  },
  methods: {
    changeRadio(val) {
      if (val === "自动稽核") {
        this.radioType = "稽核";
        this.activeName = "1";
        this.handleAuditIssue();
      } else {
        this.activeName = "0";
        this.radioType = "手工";
        this.handleManualIssue();
      }
    },
    getList() {
      get("/dq/dashboard/auditIssueStatistic").then(res => {
        console.log(res);
        this.manualTable = res.data.manualIssue;
        this.auditTable = res.data.auditIssue;
        this.handleManualIssue();
      });
    },
    handleAuditIssue() {
      this.tableData = [];
      for (let a in this.auditTable) {
        console.log(a, this.auditTable[a]);
        this.tableData.push({
          name: a,
          numOnMonth: this.auditTable[a].numOnMonth,
          numOnYear: this.auditTable[a].numOnYear,
          total: this.auditTable[a].total
        });
      }
    },
    handleManualIssue() {
      this.tableData = [];
      for (let a in this.manualTable) {
        console.log(a, this.manualTable[a]);
        this.tableData.push({
          name: a,
          numOnMonth: this.manualTable[a].numOnMonth,
          numOnYear: this.manualTable[a].numOnYear,
          total: this.manualTable[a].total
        });
      }
    },
    toProSearch(item) {
      this.status = [];
      if (this.activeName === "0") {
        switch (item.name) {
          // 新登记
          case "newRegister":
            this.status = [];
            break;
          // 已解决
          case "resolved":
            this.status = ["3", "4", "5"];
            break;
          // 处理中
          case "unResolved":
            this.status = ["0", "1", "2", "6"];
            break;
        }
      } else {
        switch (item.name) {
          // 已受理
          case "hasAccepted":
            this.status = ["1"];
            break;
          // 已忽略
          case "hasIgnored":
            this.status = ["2"];
            break;
          // 未受理
          case "unAccepted":
            this.status = ["0"];
            break;
        }
      }
      this.$router.push({
        name: "problemQuery",
        params: {
          activeName: this.activeName,
          status: this.status,
          endTime: this.endTime,
          startTime: this.startTime
        }
      });
    },
    //  当月  问题统计
    handleManualMonth(val) {
      //  获取开始时间和结束时间
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      this.startTime = year + "-" + month + "-" + "01";
      this.endTime = this.getNowFormatDate();
      this.toProSearch(val);
    },

    //  当年   问题统计
    handleManualYear(val) {
      console.log(val);
      //  获取开始时间和结束时间
      let date = new Date();
      let year = date.getFullYear();
      this.startTime = year + "-01-01";
      this.endTime = this.getNowFormatDate();
      this.toProSearch(val);
    },
    //  获取当前时间，格式YYYY-MM-DD
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
  },
  created() {
    this.getList();
    console.log(this.radio1);
  }
};
</script>

<style lang="scss" scoped>
p {
  display: inline-block;
  width: 100%;
  height: 28px;
  line-height: 32px;
  font-size: 14px;
  color: #17233d;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  padding: 0;
}
img {
  width: 12px;
  display: inline-block;
  width: 12px;
  height: 12px;
  position: relative;
  top: 2px;
  margin-right: 6px;
}
.hole {
  background: #fff;
  border-radius: 4px;
  .header {
    padding: 3px 2px;
    margin: 0 14px;
    border-bottom: 1px solid #e8eaec;
    .quesbtnTab /deep/ {
      .btn-group {
        float: right;
        display: inline-block;
        height: 100%;
        line-height: 28px;
      }
      .el-radio-group {
        // margin-top: -5px;
      }
      .el-radio-button__inner {
        padding: 4px 20px;
      }
    }
  }
  .hole-content {
    padding: 0 14px;
  }
}
</style>
