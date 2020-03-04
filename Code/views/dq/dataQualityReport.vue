<template>
  <div class="dqReporthole">
    <!-- 质量报告 -->
    <el-card class="box-card export-header">
      <div class="btn-box">
        <span class="btn-label">年月：</span>
        <el-select v-model="date">
          <el-option v-for="(item, index) in datalist" :key="index" :label="item" :value="item"></el-option>
        </el-select>
        <el-button @click="handelSearch" type="primary">
          <i class="el-icon-search"></i>查询
        </el-button>
        <el-button @click="htmlpdf" type="primary" style="padding: 3px 13px 8px;">
          <svg-icon icon-class="xiazai" style="width:18px;height:18px;position: relative;top: 2px;"></svg-icon> 导出
        </el-button>
      </div>
    </el-card>

    <el-card id="export" class="box-card export-content">
      <div id="load" align="center">下载中...</div>

      <div slot="header" class="clearfix">
        <h1>数据质量报告({{rate.year}}年{{rate.month}}月)</h1>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        <div class="export-content-date">报告时间：{{formatUnixtimestamp()}}</div>
      </div>
      <div class="export-content-item">
        <div class="first-part">
          <h3>
            <img src="./../../assets/images/commonIcon/qualityReport_1.png" alt="图" />
            数据质量检核问题趋势
          </h3>
          <!-- <p>2019年09月份数据质量检核任务执行0次，其中问题0次，数据质量问题发生率为.00%。 同比上升 0.00% ， 环比上升 0.00% 。 总共检核数据0条，问题数据0条，问题数据比例为0.00%， 同比上升 0.00% ， 环比上升 0.00%</p> -->
          <p slot="title" style="padding-right: 10px;padding-left: 10px;">
            {{years}}年{{month}}月份数据质量检核任务执行{{ perform }}次，其中问题{{ problem }}次，数据质量问题发生率为{{ happen }}%。
            <span
              v-if="problemWith > 0 "
            >
              同比上升
              <span style="color:red">{{ problemWith }}%</span>
            </span>
            <span v-if="problemWith == 0 ">同比上升 {{ problemWith }}%</span>
            <span v-if="problemWith < 0 ">
              同比下降
              <span style="color:green">{{ - problemWith }}%</span>
            </span>，
            <span v-if="problemRing > 0 ">
              环比上升
              <span style="color:red">{{ problemRing }}%</span>
            </span>
            <span v-if="problemRing == 0 ">环比上升 {{ problemRing }}%</span>
            <span v-if="problemRing < 0 ">
              环比下降
              <span style="color:green">{{ - problemRing }}%</span>
            </span>
            。
            总共检核数据{{ CheckData }}条，问题数据{{ ProblemData }}条，问题数据比例为{{ ProblemDataScale }}%，
            <span
              v-if="checkWith > 0 "
            >
              同比上升
              <span style="color:red">{{ checkWith }}%</span>
            </span>
            <span v-if="checkWith == 0 ">同比上升 {{ checkWith }}%</span>
            <span v-if="checkWith < 0 ">
              同比下降
              <span style="color:green">{{ - checkWith }}%</span>
            </span>，
            <span v-if="checkRing > 0 ">
              环比上升
              <span style="color:red">{{ checkRing }}%</span>
            </span>
            <span v-if="checkRing == 0 ">环比上升 {{ checkRing }}%</span>
            <span v-if="checkRing < 0 ">
              环比下降
              <span style="color:green">{{ - checkRing }}%</span>
            </span>。
          </p>
          <category ref="first" style="width: 50%;float:left" :value="option1"></category>
          <el-table
            style="width: 50%;float:right"
            :data="sumlist"
            border
            :header-cell-style="{background:'#3e90f7',color:'#fff'}"
          >
            <el-table-column prop="classify" label="年月" width></el-table-column>
            <el-table-column prop="times" label="检核次数" width></el-table-column>
            <el-table-column prop="quesnum" label="发现问题"></el-table-column>
            <el-table-column prop="selsum" label="检核数据量"></el-table-column>
            <el-table-column prop="quessum" label="问题数据量">
              <template slot-scope="scope">
                <el-button @click="toQualityDetail(scope.row)" type="text">{{scope.row.quessum}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="first-part">
          <h3>
            <img src="./../../assets/images/commonIcon/qualityReport_2.png" alt="图" />
            数据质量检核问题趋势
          </h3>
          <p>{{years}}年{{month}}月份已发现的数据质量问题按检核方法分类的分布情况如下：</p>
          <category ref="second" style="width: 50%;float:left" :value="option2"></category>
          <el-table
            style="width: 50%;float:right"
            :data="typelist"
            border
            :header-cell-style="{background:'#3e90f7',color:'#fff'}"
          >
            <el-table-column prop="classify" label="方法类型" width></el-table-column>
            <el-table-column prop="times" label="检核次数" width></el-table-column>
            <el-table-column prop="quesnum" label="发现问题"></el-table-column>
            <el-table-column prop="selsum" label="检核数据量"></el-table-column>
            <el-table-column prop="quessum" label="问题数据量">
              <template slot-scope="scope">
                <el-button @click="toQualityDetail(scope.row)" type="text">{{scope.row.quessum}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="first-part">
          <h3>
            <img src="./../../assets/images/commonIcon/qualityReport_3.png" alt="图" />
            数据质量问题分类情况
          </h3>
          <p>{{years}}年{{month}}月份已发现的数据质量问题按检核方法分类的分布情况如下：</p>
          <category ref="third" style="width: 50%;float:left" :h="400" :value="option3"></category>
          <el-table
            style="width: 50%;float:right"
            :data="syslist"
            border
            :header-cell-style="{background:'#3e90f7',color:'#fff',height: '24px'}"
          >
            <el-table-column prop="classify" label="数据源名称" width></el-table-column>
            <el-table-column prop="times" label="检核次数" width></el-table-column>
            <el-table-column prop="quesnum" label="发现问题"></el-table-column>
            <el-table-column prop="selsum" label="检核数据量"></el-table-column>
            <el-table-column prop="quessum" label="问题数据量">
              <template slot-scope="scope">
                <el-button @click="toQualityDetail(scope.row)" type="text">{{scope.row.quessum}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import html2canvas from "html2canvas";
import JsPdf from "jspdf";
import category from "./charts/category";
import { get } from "@/utils/request";
export default {
  name: "dataQualityReport",
  components: {
    category
  },
  data() {
    return {
      date: "",
      datalist: [],
      tableData1: [],
      option1: {
        tooltip: { trigger: "axis" },
        color: ["#5BA0F7", "#50B757"],
        grid: { left: "3%", right: "5%", bottom: "3%", containLabel: true },
        xAxis: { type: "category", boundaryGap: false, data: [] },
        yAxis: { type: "value" },
        series: [
          { name: "检核次数", type: "line", data: [] },
          { name: "发现问题", type: "line", data: [] }
        ]
      },
      option2: {
        tooltip: {
          trigger: "axis",
          formatter: "方法类型：{b} <br/>问题数：{c}"
        },
        xAxis: { type: "category", data: [] },
        yAxis: { type: "value" },
        series: [{ type: "bar", itemStyle: { color: "#5BA0F7" }, data: [] }]
      },
      option3: {
        tooltip: {
          trigger: "item",
          formatter: "数据源：{b} <br/>问题数：{c} ({d}%)"
        },
        legend: { show: false },
        series: [
          {
            type: "pie",
            center: ["50%", "70%"],
            radius: ["0%", "65%"],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "top",
                  formatter: "{b}\n{d}%({c})"
                }
              }
            },
            data: []
          }
        ]
      },
      reportList: "",
      rate: "",
      sumlist: [],
      syslist: [],
      typelist: [],
      ReportTime: "",
      years: "",
      month: "",
      CheckData: "",
      ProblemData: "",
      ProblemDataScal: "",
      checkProblemData: "",
      questionClassData: "",
      distributionData: "",
      ProblemDataScale: "",
      reportNum: 0,
      perform: "",
      problem: "",
      happen: "",
      problemWith: "",
      problemRing: "",
      checkWith: "",
      checkRing: ""
    };
  },
  methods: {
    // 日期下拉
    getTime() {
      get("/dqms/report/time").then(res => {
        // console.log(res);
        this.datalist = res.data;
      });
    },
    // 报告时间
    formatUnixtimestamp() {
      let unixtimestamp = new Date();
      let year = 1900 + unixtimestamp.getYear();
      let month = "0" + (unixtimestamp.getMonth() + 1);
      let date = "0" + unixtimestamp.getDate();
      let hour = "0" + unixtimestamp.getHours();
      let minute = "0" + unixtimestamp.getMinutes();
      return (
        year +
        "-" +
        month.substring(month.length - 2, month.length) +
        "-" +
        date.substring(date.length - 2, date.length) +
        " " +
        hour.substring(hour.length - 2, hour.length) +
        ":" +
        minute.substring(minute.length - 2, minute.length)
      );
    },
    handelSearch() {
      this.getReportList();
    },
    // 获取报告信息
    getReportList() {
      get("/dqms/report/sendPostUrl", {
        time: this.date
      }).then(res => {
        // console.log(JSON.parse(res.data));
        if (res.code === 10000 && res.success) {
          let reportList = JSON.parse(res.data).data;
          this.rate = reportList.rate;
          this.sumlist = reportList.sumlist;
          this.syslist = reportList.syslist;
          this.typelist = reportList.typelist;

          this.ReportTime = this.formatUnixtimestamp();
          // console.log(this.ReportTime);
          this.years = "";
          this.month = "";
          this.CheckData = "";
          this.ProblemData = "";
          this.ProblemDataScal = "";
          this.perform = "";
          this.problem = "";
          this.happen = "";
          this.problemWith = "";
          this.problemRing = "";
          this.problemWith = "";
          this.problemRing = "";
          this.checkProblemData = "";
          this.questionClassData = "";
          this.distributionData = "";
          // let clientList = [];
          this.years = this.rate.year;
          this.month = this.rate.month;
          this.CheckData = this.rate.datasum;
          this.ProblemData = this.rate.dataques;
          this.ProblemDataScale = parseFloat(this.rate.dataquesrate).toFixed(2);
          this.perform = this.rate.kpisum;
          this.problem = this.rate.kpiques;
          this.happen = this.rate.kpiquesrate;
          this.problemWith = parseFloat(this.rate.kpiquesratesep).toFixed(2);
          this.problemRing = parseFloat(this.rate.kpiquesratebas).toFixed(2);
          this.checkWith = parseFloat(this.rate.dataquesratesep).toFixed(2);
          this.checkRing = parseFloat(this.rate.dataquesratebas).toFixed(2);

          var classifys = [];
          var selsums = [];
          var quessums = [];
          var timesData = [];
          var quesnumData = [];
          for (let i = 0; i < this.sumlist.length; i++) {
            var j = this.sumlist.length - i - 1;
            classifys[i] = this.sumlist[j].classify;
            selsums[i] = this.sumlist[j].selsum;
            quessums[i] = this.sumlist[j].quessum;
            timesData[i] = this.sumlist[j].times;
            quesnumData[i] = this.sumlist[j].quesnum;
          }

          var typelists = [];
          var typelist_name = [];
          for (let i = 0; i < this.typelist.length; i++) {
            typelists[i] = this.typelist[i].quesnum;
            typelist_name[i] = this.typelist[i].classify;
          }

          var syslists = [];
          for (let i = 0; i < this.syslist.length; i++) {
            var quesnum = this.syslist[i].quesnum;
            if (
              this.syslist[i].quesnum === "" ||
              this.syslist[i].quesnum === null ||
              this.syslist[i].quesnum === undefined
            ) {
              quesnum = 0;
            }
            syslists[i] = this.evil(
              "(" +
                "{name:'" +
                this.syslist[i].classify +
                "',value:" +
                quesnum +
                "}" +
                ")"
            );
          }

          this.option1 = {
            tooltip: { trigger: "axis" },
            color: ["#5BA0F7", "#50B757"],
            grid: { left: "3%", right: "5%", bottom: "3%", containLabel: true },
            xAxis: { type: "category", boundaryGap: false, data: classifys },
            yAxis: { type: "value" },
            series: [
              { name: "检核次数", type: "line", data: timesData, smooth: true },
              {
                name: "发现问题",
                type: "line",
                data: quesnumData,
                smooth: true
              }
            ]
          };
          this.option2 = {
            color: ["#3398DB"],
            tooltip: {
              trigger: "axis",
              formatter: "方法类型：{b} <br/>问题数：{c}"
            },
            xAxis: { type: "category", data: typelist_name },
            yAxis: { type: "value" },
            series: [
              { type: "bar", itemStyle: { color: "#5BA0F7" }, data: typelists }
            ]
          };

          this.option3 = {
            tooltip: {
              trigger: "item",
              formatter: "数据源：{b} <br/>问题数：{c} ({d}%)"
            },
            legend: { show: false, data: syslists },
            series: [
              {
                type: "pie",
                center: ["50%", "55%"],
                radius: ["0%", "75%"],
                avoidLabelOverlap: true,
                label: {
                  normal: {
                    show: true
                  }
                },
                labelLine: {
                  normal: {
                    show: true
                  }
                },
                // color : [ 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple' ],
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: "top",
                      formatter: "{b}\n{d}%({c})"
                    }
                  }
                },
                data: syslists
              }
            ]
          };
          this.$nextTick(() => {
            // console.log(this.$refs);
            if (this.$refs.first) {
              this.$refs.first.drawEchart();
              this.$refs.second.drawEchart();
              this.$refs.third.drawEchart();
            }
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getYearMonth() {
      var unixtimestamp = new Date();
      var year = 1900 + unixtimestamp.getYear();
      var month = unixtimestamp.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      return year + "-" + month;
    },
    evil(fn) {
      let Fn = Function; // 一个变量指向Function，防止有些前端编译工具报错
      return new Fn("return " + fn)();
    },
    // 转PDF下载
    htmlpdf() {
      html2canvas(document.querySelector("#export")).then(function(canvas) {
        document.getElementById("load").innerHTML = "下载中";
        document.getElementById("load").style.display = "block";
        // 元素id为exportContent
        var imgData = canvas.toDataURL("image/jpeg");
        var img = new Image();
        img.src = imgData;
        var contentWidth = canvas.width;
        var contentHeight = canvas.height;
        var pageHeight = (contentWidth / 592.28) * 841.89;
        var leftHeight = contentHeight;
        var position = 0;
        var imgWidth = 595.28;
        var imgHeight = (592.28 / contentWidth) * contentHeight;
        var pageData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new JsPdf("p", "pt", "a4");
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, "PNG", 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            pdf.addImage(pageData, "PNG", 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            if (leftHeight > 0) {
              pdf.addPage();
            }
          }
        }
        let time = function() {
          let unixtimestamp = new Date();
          let year = 1900 + unixtimestamp.getYear();
          let month = "0" + (unixtimestamp.getMonth() + 1);
          let date = "0" + unixtimestamp.getDate();
          let hour = "0" + unixtimestamp.getHours();
          let minute = "0" + unixtimestamp.getMinutes();
          return (
            year +
            "-" +
            month.substring(month.length - 2, month.length) +
            "-" +
            date.substring(date.length - 2, date.length) +
            " " +
            hour.substring(hour.length - 2, hour.length) +
            ":" +
            minute.substring(minute.length - 2, minute.length)
          );
        };
        var report = time() + "数据质量报告编号:001";
        pdf.save(report + ".pdf");
        document.getElementById("load").style.display = "none";
      });
    },
    // 跳转详情
    toQualityDetail(row) {
      this.$router.push({
        path: "qualityDetail",
        params: row
      });
    }
  },
  mounted() {
    this.getReportList();
  },
  created() {
    this.date = this.getYearMonth();
    this.getTime();
  }
};
</script>
<style lang="scss" scoped>
#load {
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  filter: alpha(opacity=60);
  background-color: #e6e6e6;
  z-index: 1002;
  left: 0px;
  display: none;
  font-weight: bold;
  font-size: 20px;
  opacity: 0.5;
  -moz-opacity: 0.5;
  padding-top: 100px;
  color: #000;
}
.dqReporthole {
  padding: 10px;
  font-size: 12px;
  /deep/ .el-card__body {
    overflow: hidden;
    background: #fff;
  }
  /deep/ .el-input__icon {
    line-height: 32px;
    height: 32px;
  }
  .btn-box /deep/ {
    float: right;
    .btn-label {
      width: 90px;
      text-align: right;
      vertical-align: middle;
      // float: left;
      display: inline-block;
      font-size: 12px;
      color: #515a6e;
      line-height: 1;
      padding: 10px 12px 10px 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    .el-input__inner {
      height: 32px;
      width: 110px;
    }
    .el-button {
      padding: 6px 15px 6px;
      margin-left: 10px;
      span {
        height: 18px;
        display: block;
        line-height: 18px;
        font-size: 12px;
        i {
          margin-right: 5px;
        }
      }
    }
  }
  .export-content {
    margin-top: 5px;
    background: #fff;
    color: #515a6e;
    /deep/ .el-card__header {
      padding: 16px;
      background: #fff;
    }
    h1 {
      text-align: center;
      margin: 0;
      color: #515a6e;
    }
    .export-content-date {
      padding-left: 8px;
      padding-right: 8px;
      font-size: 8px;
    }
    .export-content-item {
      font-size: 14px;
      .first-part {
        overflow: hidden;
        /deep/ .el-table th {
          padding: 0;
          text-align: center;
          font-size: 12px;
        }
        /deep/ .el-table td {
          padding: 0;
          text-align: center;
          font-size: 12px;
        }
      }
      h3 {
        img {
          width: 16px;
          height: 16px;
          margin-right: 10px;
          display: block;
          float: left;
        }
      }
    }
  }
}
</style>