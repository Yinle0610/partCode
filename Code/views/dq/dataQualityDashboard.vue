<template>
  <div class="my-desktop" style="padding:10px">
    <el-row :gutter="10">
      <el-col :span="12">
        <!-- 质量概况 -->
        <qut-preview :ybp="true"></qut-preview>
      </el-col>
      <el-col :span="12">
        <div style="height: 370px; margin-top: 10px; background: #fff;">
          <!-- 稽核统计 -->
          <statistical-problem></statistical-problem>
        </div>
      </el-col>
      <el-col :span="12">
        <!-- 上报情况 -->
        <data-que-rep :ybp="true"></data-que-rep>
      </el-col>
      <el-col :span="12">
        <!-- 分布情况 -->
        <data-que-distribut :ybp="true"></data-que-distribut>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import DataQueRep from "@/views/desktop/DataQueRep";
import DataQueDistribut from "@/views/desktop/DataQueDistribut";
import QutPreview from "@/views/desktop/QutPreview";
import statisticalProblem from "./ybp/statisticalProblem";
import { get } from "@/utils/request";
export default {
  name: 'dataQualityDashboard',
  components: {
    DataQueRep,
    DataQueDistribut,
    QutPreview,
    statisticalProblem
  },
  data() {
    return {};
  },
  methods: {
    // 稽核问题统计
    getIssueStatistic() {
      get("/dq/dashboard/auditIssueStatistic").then(res => {
        console.log(res);
      });
    }
  },
  created() {
    // this.getIssueStatistic()
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "../../styles/variables";

$titlt-color: #999;
$rate-color: #388dfa;
$font-blue: #2d8cf0;
$div-border: #0096fa;
$fixed-btn: #888;

.my-desktop {
  padding: 0 10px 10px 10px;
  background-color: $page-bg;

  // 公共样式
  .el-card {
    height: 370px;
    margin-top: 10px;
    .el-card__header {
      padding: 5px 15px;
      .big-title {
        color: $card-title;
        font-size: 14px;
        font-weight: 700;
        line-height: 28px;
      }
    }
    .el-card__body {
      padding: 10px 0;
    }
    .el-pagination {
      text-align: center;
      margin-top: 10px;
    }
    .radio-box {
      padding: 0 15px 10px 15px;
    }
  }
  .title {
    font-size: 14px;
    color: $titlt-color;
  }
  .rate {
    font-size: 18px;
    color: $rate-color;
    font-weight: bold;
    margin-top: 10px;
  }

  // 表格基本样式
  .table-box {
    margin: 0 15px;
    overflow-y: auto;
    border: 1px solid $border;
    .table-header-bg {
      background-color: $table-column-bg;
    }
    .el-table {
      th {
        padding: 4px 0;
      }
    }
  }

  // 标准概览
  .standard-conent-box {
    padding: 0 30px 15px 30px;
  }

  // 质量概况 我的工作
  .quan-profile-conent-box {
    margin: 0 15px;
    padding: 50px 0;
    border-top: 1px solid $border;
    .quan-profile-item-box {
      display: flex;
      padding: 15px 0;
      -ms-flex-item-align: center;
      justify-content: center;
      border-bottom: 1px solid $border;
      border-right: 1px solid $border;
      cursor: pointer;
      img {
        display: inline-block;
        width: 50px;
        height: 50px;
      }
      p {
        margin: 5px 0 0 10px;
        text-align: center;
        vertical-align: top;
        span {
          display: block;
        }
      }
    }
    .el-col-8:nth-child(3),
    .el-col-8:nth-child(6) {
      border-right-width: 0;
    }
    .el-col-8:nth-child(4),
    .el-col-8:nth-child(5),
    .el-col-8:nth-child(6) {
      border-bottom-width: 0;
    }
  }
  // 我的工作 下拉框
  .my-job-select {
    .el-input--medium .el-input__inner {
      height: 26px;
      line-height: 26px;
    }
  }

  // 我的知识
  .my-knowledge-top-box {
    padding-bottom: 10px;
    border-bottom: 1px solid $border;
    .el-col {
      text-align: center;
      display: flex;
      padding: 10px 0;
      justify-content: center;
      img {
        display: inline-block;
        width: 50px;
        height: 50px;
        margin-right: 15px;
      }
      p {
        margin: 0;
        span {
          display: block;
        }
      }
    }
  }

  // 我的事项
  .my-matter-box {
    .el-radio-group {
      position: relative;
      .el-badge {
        position: absolute;
        z-index: 99;
      }
    }
    .el-radio-group .el-radio-button:nth-child(3) {
      .el-radio-button__inner {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }

  // 我的收藏
  .my-collect-box {
    .el-radio-button__inner {
      font-size: 12px;
      padding: 6px 12px;
    }
  }

  // 数据问题统计
  .data-problem-statistics {
    .table-color {
      color: $font-blue;
    }
  }

  // 数据问题系统分布
  .data-problem-sys-scatter-box {
    .radio-box {
      display: flex;
      justify-content: space-between;
      .see-more {
        font-size: 12px;
        color: $font-blue;
        cursor: pointer;
        line-height: 28px;
      }
    }
    .data-problem-box {
      padding: 0 30px;
      .data-problem-item-box {
        border-top: 2px solid $div-border;
        padding: 10px 15%;
        margin: 20px 0;
        position: relative;
        p {
          font-size: 14px;
        }
        div {
          width: 50%;
          span {
            display: block;
          }
          .data-problem-text {
            font-size: 12px;
          }
          .data-problem-rate {
            font-size: 20px;
          }
        }
        .el-progress--circle {
          position: absolute;
          right: 15%;
          top: 32px;
          width: 40px;
          height: 40px;
        }
      }
    }
  }

  // 右边悬浮固定按钮
  .fixed-right-btn {
    position: fixed;
    top: 50%;
    right: -30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    margin-top: -20px;
    cursor: pointer;
    z-index: 100;
    display: none;
    .el-icon-arrow-left {
      font-size: 26px;
      color: $fixed-btn;
      position: relative;
      top: 17px;
      left: 3px;
    }
  }
}
//右边自定义桌面
//抽屉样式
#drawer /deep/ .el-drawer__container {
  .el-drawer .el-drawer__header {
    margin-bottom: 20px;
  }
  .el-drawer__body {
    .el-checkbox-group {
      .el-checkbox {
        transition: all linear 0.3s;
        cursor: move;
      }
    }
  }
  .el-drawer__body {
    .el-checkbox-group {
      .el-checkbox.hover:hover {
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
