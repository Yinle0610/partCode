<template>
  <div class="my-desktop" ref="myDesktop">
    <div class="fixed-right-btn" ref="fixedRightBtn" @click="openDrawer">
      <i class="el-icon-arrow-left"></i>
    </div>

    <el-drawer :visible.sync="oDrawer.sDrawer" :modal="false" size="240px" id="drawer">
      <div slot="title" style="color: #515a6e;
      font-size: 14px;font-weight: 550;">自定义桌面</div>
      <el-checkbox-group v-model="oDrawer.aCheckedCities" size="mini" style="padding: 0 20px;">
        <transition-group tag="div" class="container">
          <el-checkbox
            v-for="item in oDrawer.aMenus"
            :label="item"
            :key="item"
            border
            style="transition: all linear .5s ;width: 206px;margin-bottom: 8px;height: 32px;padding: 0 10px;line-height: 32px;margin-left: 0;position: relative;"
            draggable="true"
            @dragstart.native="handleDragStart($event, item)"
            @dragover.native.prevent="handleDragOver($event, item)"
            @dragenter.native.prevent="handleDragEnter($event, item)"
            @dragend.native.prevent="handleDragEnd($event, item)"
            class="hover"
          >
            {{item}}
            <i class="el-icon-menu" style="position: absolute;right: 10px;top: 9px;"></i>
          </el-checkbox>
        </transition-group>
      </el-checkbox-group>
      <div style="text-align: center;">
        <el-button style="font-size: 12px;
          padding: 10px 15px;" @click="getoDrawer">保存</el-button>
      </div>
    </el-drawer>
    <el-row :gutter="10">
      <el-col :span="12" v-for="item in myDesktop.aMenus" :key="item.moduleCode">
        <my-work v-if="item.moduleCode=='MY_WORK'&&item.isVisible===1"></my-work>
        <my-matter v-else-if="item.moduleCode=='MY_MATTER'&&item.isVisible===1"></my-matter>
        <my-sub v-else-if="item.moduleCode=='MY_SUB'&&item.isVisible===1"></my-sub>
        <my-kno v-else-if="item.moduleCode=='MY_KNO'&&item.isVisible===1"></my-kno>
        <my-col v-else-if="item.moduleCode=='MY_COL'&&item.isVisible===1"></my-col>
        <sys-anm v-else-if="item.moduleCode=='SYS_ANN'&&item.isVisible===1"></sys-anm>
        <!-- <std-previiew v-else-if="item.moduleCode=='STD_PREVIEW'&&item.isVisible===1"></std-previiew> -->
        <std-distribut v-else-if="item.moduleCode=='STD_DISTRIBUT'&&item.isVisible===1"></std-distribut>
        <kpi-std-distribut v-else-if="item.moduleCode=='KPI_STD_DISTRIBUT'&&item.isVisible===1"></kpi-std-distribut>
        <std-dynamic v-else-if="item.moduleCode=='STD_DYNAMIC'&&item.isVisible===1"></std-dynamic>
        <qut-preview :ybp="false" v-else-if="item.moduleCode=='QUT_PREVIEW'&&item.isVisible===1"></qut-preview>
        <data-que-count v-else-if="item.moduleCode=='DATA_QUE_COUNT'&&item.isVisible===1"></data-que-count>
        <data-que-distribut
          :ybp="false"
          v-else-if="item.moduleCode=='DATA_QUE_DISTRIBUT'&&item.isVisible===1"
        ></data-que-distribut>
        <data-que-rep
          ref="queRep"
          :ybp="false"
          v-else-if="item.moduleCode=='DATA_QUE_REP'&&item.isVisible===1"
        ></data-que-rep>
         <std-overview v-else-if="item.moduleCode=='STD_PREVIEW'&&item.isVisible===1"></std-overview>
         <index-classification v-else-if="item.moduleCode=='INDEX_CLASSIFIER'&&item.isVisible===1"></index-classification>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="10">
      <el-col :span="12" >
        <my-work ></my-work>
        <my-matter></my-matter>
        <my-sub ></my-sub>
        <my-kno ></my-kno>
        <my-col ></my-col>
        <sys-anm></sys-anm>
        <std-previiew></std-previiew>
        <std-distribut></std-distribut>
        <kpi-std-distribut></kpi-std-distribut>
        <std-dynamic></std-dynamic>
        <qut-preview></qut-preview>
        <data-que-count></data-que-count>
        <data-que-distribut></data-que-distribut>
        <data-que-rep></data-que-rep>
      </el-col>
    </el-row>-->
  </div>
</template>

<script>
import StandardsView from "@/components/Standards/StandardsView";
import { mapGetters } from "vuex";
// import echarts from "echarts";
import { get, postByJson } from "@/utils/request";
import MyWork from "@/views/desktop/mywork";
import MyKno from "@/views/desktop/mykno";
import MyMatter from "@/views/desktop/mymatter";
import MySub from "@/views/desktop/mysub";
import MyCol from "@/views/desktop/mycol";
import SysAnm from "@/views/desktop/sysanm";
import StdPreviiew from "@/views/desktop/stdpreview";
import StdDistribut from "@/views/desktop/stddistribut";
import KpiStdDistribut from "@/views/desktop/KpiStdDistribut";
import StdDynamic from "@/views/desktop/StdDynamic";
import QutPreview from "@/views/desktop/QutPreview";
import DataQueCount from "@/views/desktop/DataQueCount";
import DataQueDistribut from "@/views/desktop/DataQueDistribut";
import DataQueRep from "@/views/desktop/DataQueRep";
import StdOverview from "@/views/desktop/StdOverview";
import IndexClassification from "@/views/desktop/IndexClassification";

export default {
  name: "DASHBOARD",
  components: {
    StandardsView,
    MyWork,
    MyKno,
    MyMatter,
    MySub,
    MyCol,
    SysAnm,
    StdPreviiew,
    StdDistribut,
    KpiStdDistribut,
    StdDynamic,
    QutPreview,
    DataQueCount,
    DataQueDistribut,
    DataQueRep,
    StdOverview,
    IndexClassification
  },
  data() {
    return {
      // 我的订阅
      oMyOrder: {
        sFilter: "week", // 筛选
        aTableData: [], // table数据
        bLoading: true, // table loading
        pageCurrent: 1,
        pageSize: 5,
        iTotal: 0
      },
      // 质量概况
      oQuanProfile: {
        sFilter: "totle"
      },
      // 标准概览
      oStandardsView: {
        bLoading: true,
        aConent: [
          {
            name: "标准总数",
            sImgSrc: "./../../assets/images/commonIcon/totalStandard.png",
            nTotal: 0,
            nPublished: 0,
            nReleased: 0
          },
          {
            name: "基础类标准",
            sImgSrc: "./../../assets/images/commonIcon/basicClassStandards.png",
            nTotal: 0,
            nPublished: 0,
            nReleased: 0
          },
          {
            name: "指标类标准",
            sImgSrc:
              "./../../assets/images/commonIcon/lndicatorClassCriteria.png",
            nTotal: 0,
            nPublished: 0,
            nReleased: 0
          },
          {
            name: "代码类标准",
            sImgSrc: "./../../assets/images/commonIcon/commonCodeClass.png",
            nTotal: 0,
            nPublished: 0,
            nReleased: 0
          }
        ]
      },

      // 我的知识
      oMyKnowledge: {
        sFilter: "publish",
        bLoading: true,
        aTableData: [],
        iPublish: 0,
        iDraft: 0,
        iCollect: 0,
        iTotal: 0,
        pageCurrent: 1,
        pageSize: 3
      },
      // 我的事项
      oMyMatter: {
        sFilter: "待办",
        bLoading: false,
        aTableData: []
      },
      // 我的收藏
      oMyCollect: {
        sFilter: "kno",
        bLoading: true,
        aTableData: [],
        pageCurrent: 1,
        pageSize: 6,
        iTotal: 0
      },
      // 系统公告
      oSysNotice: {
        bLoading: false,
        aTableData: []
      },
      // 我的工作
      oMyJob: {
        sFilter: "week",
        // 下拉框
        aActivityNames: [
          {
            label: "数据问题质量管理",
            value: "0"
          }
        ],
        sDataId: "" // 下拉框 选中项id
      },
      // 标准动态
      oStandardDynamics: {
        bLoading: false,
        aTableData: []
      },
      // 数据问题统计
      oDataProblemStatistics: {
        bManualLoading: false, // 手动提交
        aManualTable: [
          {
            name: "新登记",
            month: "0",
            year: "1",
            totle: "4"
          },
          {
            name: "已解决",
            month: "0",
            year: "1",
            totle: "4"
          },
          {
            name: "处理中",
            month: "0",
            year: "1",
            totle: "4"
          }
        ],
        bAutomaticLoading: false, // 自动稽核
        aAutomaticTable: [
          {
            name: "未受理",
            month: "0",
            year: "1",
            totle: "4"
          },
          {
            name: "已受理",
            month: "0",
            year: "1",
            totle: "4"
          },
          {
            name: "已忽略",
            month: "0",
            year: "1",
            totle: "4"
          }
        ]
      },
      // 数据问题系统分布
      oDataProblemSysScatter: {
        sFilter: "系统",
        sTimeFilter: ""
      },
      // 自定义桌面
      oDrawer: {
        sDrawer: false,
        aCheckedCities: [],
        aMenus: []
      },
      // 我的桌面显示
      myDesktop: {
        aMenus: [],
        moveElement: "",
        moveIndex: "",
        moveIndex2: ""
      }
    };
  },
  methods: {
    goMyOrderDetail(data) {},
    goMyKnowledgeDetail(data) {},
    goMyMatterDetail(data) {},
    goMyCollectDetail(data) {},
    goSysNoticeDetail(dta) {},
    goStandardDynamicsDetail(data) {},
    // 数据问题统计字体颜色
    tableColor(params) {
      if (params.rowIndex === 0 && params.columnIndex === 0) {
        return "color: #faad14";
      } else if (params.rowIndex === 1 && params.columnIndex === 0) {
        return "color: #52c41a";
      } else if (params.rowIndex === 2 && params.columnIndex === 0) {
        return "color: #f5222d";
      }
    },

    openDrawer() {
      this.oDrawer.sDrawer = true;
      this.$refs.fixedRightBtn.style.display = "none";
    },
    // 保存自定义桌面
    getoDrawer() {
      const that = this;
      that.myDesktop.aMenus.map(function(val) {
        if (that.oDrawer.aCheckedCities.indexOf(val.moduleName) === -1) {
          val.isVisible = 0;
        } else {
          val.isVisible = 1;
        }
        let k = that.oDrawer.aMenus.indexOf(val.moduleName);
        val.moduleOrder = k + 1;
      });
      var data = [];
      this.myDesktop.aMenus.map(function(val, index) {
        var obj = {};
        for (let key in val) {
          obj[key] = val[key];
        }
        data.push(obj);
      });
      postByJson("/home/portal/saveMyDeskConfig", data).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.oDrawer.sDrawer = false;
          that.getMyDesktopSettings();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 调整自定义桌面位置
    handleDragStart(even, item) {
      this.myDesktop.moveElement = item;
    },
    handleDragOver(even, item) {
      even.dataTransfer.dropEffect = "move";
    },
    handleDragEnter(even, item) {
      even.dataTransfer.effectAllowed = "move";
      if (item === this.myDesktop.moveElement) {
        return;
      }
      const newItems = [...this.oDrawer.aMenus];
      this.myDesktop.moveIndex = newItems.indexOf(this.myDesktop.moveElement);
      this.myDesktop.moveIndex2 = newItems.indexOf(item);
      newItems.splice(
        this.myDesktop.moveIndex2,
        0,
        ...newItems.splice(this.myDesktop.moveIndex, 1)
      );
      this.oDrawer.aMenus = newItems;
      var a = document.getElementsByClassName("el-checkbox");
      a[this.myDesktop.moveIndex].style.boxShadow = "0 1px 6px rgba(0,0,0,.2)";
      for (let i = 0; i < 14; i++) {
        var ab = a[i].classList;
        for (let j = 0; j < ab.length; j++) {
          if (ab[j] === "hover") {
            a[i].classList.remove("hover");
          }
        }
      }
    },
    handleDragEnd(even, item) {
      this.myDesktop.moveElement = null;
      var a = document.getElementsByClassName("el-checkbox");
      a[this.myDesktop.moveIndex2].style.boxShadow = "none";
      for (let i = 0; i < 14; i++) {
        a[i].classList.add("hover");
      }
    },
    // 获取标准概览
    getStandardsView() {
      this.$store.dispatch("StandardsView").then(res => {
        console.log(res.data);
        if (res.code === 10000 && res.success === true) {
          const data = res.data;
          let dataArr = data.map(item => ({
            nTotal: item.amount,
            nPublished: item.published,
            nReleased: item.unPublished
          }))
          this.oStandardsView.aConent[0] = Object.assign({}, this.oStandardsView.aConent[0], dataArr[0] || {})
          this.oStandardsView.aConent[2] = Object.assign({}, this.oStandardsView.aConent[2], dataArr[1] || {})
          this.oStandardsView.aConent[1] = Object.assign({}, this.oStandardsView.aConent[1], dataArr[2] || {})
          this.oStandardsView.aConent[3] = Object.assign({}, this.oStandardsView.aConent[3], dataArr[3] || {})
          this.oStandardsView.bLoading = false;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取我的订阅
    // getMyOrder() {
    //   get("/home/portal/listMyDataSub", {
    //     pageCurrent: this.oMyOrder.pageCurrent,
    //     pageSize: this.oMyOrder.pageSize,
    //     scope: this.oMyOrder.sFilter
    //   }).then(res => {
    //     console.log(res.data);
    //     if (res.code === 10000 && res.success === true) {
    //       const data = res.data;
    //       this.oMyOrder.aTableData = data.records;
    //       this.oMyOrder.iTotal = data.total;
    //       this.oMyOrder.bLoading = false;
    //     } else {
    //       this.$message.error(res.message);
    //     }
    //   });
    // },
    // myOrderChangePage(value) {
    //   this.oMyOrder.pageCurrent = value;
    //   this.oMyOrder.bLoading = true;
    //   this.getMyOrder();
    // },
    // myOrderChangeFilter(value) {
    //   this.oMyOrder.sFilter = value;
    //   this.oMyOrder.pageCurrent = 1;
    //   this.oMyOrder.bLoading = true;
    //   this.getMyOrder();
    // },
    // 获取我的收藏
    getMyCollect() {
      get("/home/portal/listMyCollection", {
        pageCurrent: this.oMyCollect.pageCurrent,
        pageSize: this.oMyCollect.pageSize,
        scope: this.oMyCollect.sFilter
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          const data = res.data.knoInfos;
          this.oMyCollect.aTableData = data.records;
          this.oMyCollect.iTotal = data.total;
          this.oMyCollect.bLoading = false;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    myCollectChangeFilter(value) {
      this.oMyCollect.sFilter = value;
      this.oMyCollect.pageCurrent = 1;
      this.oMyCollect.bLoading = true;
      this.getMyCollect();
    },
    myCollectChangePage(value) {
      this.oMyCollect.pageCurrent = value;
      this.oMyCollect.bLoading = true;
      this.getMyCollect();
    },
    getMyDesktopSettings() {
      const that = this;
      get("/home/portal/listMyDeskConfigInfo").then(res => {
        if (res.code === 10000 && res.success === true) {
          this.myDesktop.aMenus = res.data;
          this.oDrawer.aCheckedCities = [];
          this.oDrawer.aMenus = [];
          this.myDesktop.aMenus.map(function(val) {
            if (val.isVisible === 1) {
              that.oDrawer.aCheckedCities.push(val.moduleName);
            }
            that.oDrawer.aMenus.push(val.moduleName);
          });
        }
      });
    },
    // 获取我的知识
    getMyKnowledge() {
      get("/home/portal/listMyKnowledge", {
        pageCurrent: this.oMyKnowledge.pageCurrent,
        pageSize: this.oMyKnowledge.pageSize,
        scope: this.oMyKnowledge.sFilter
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          const data = res.data;
          this.oMyKnowledge.iPublish = data.knoCountInfo.pubTotal;
          this.oMyKnowledge.iDraft = data.knoCountInfo.draftTotal;
          this.oMyKnowledge.iCollect = data.knoCountInfo.colTotal;
          this.oMyKnowledge.aTableData =
            data[this.oMyKnowledge.sFilter + "Infos"].records;
          this.oMyKnowledge.iTotal =
            data[this.oMyKnowledge.sFilter + "Infos"].total;
          this.oMyKnowledge.bLoading = false;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    myKnowledgeChangeFilter(value) {
      this.oMyKnowledge.sFilter = value;
      this.oMyKnowledge.pageCurrent = 1;
      this.oMyKnowledge.bLoading = true;
      this.getMyKnowledge();
    },
    myKnowledgeChangePage(value) {
      this.oMyKnowledge.pageCurrent = value;
      this.oMyKnowledge.bLoading = true;
      this.getMyKnowledge();
    }
  },
  computed: {
    ...mapGetters(["roles"])
  },
  mounted() {
    // this.getEcharts()
    const _this = this;
    this.$refs.myDesktop.addEventListener("mousemove", function(e) {
      let oBtn = _this.$refs.fixedRightBtn;
      let myDesktop = _this.$refs.myDesktop;
      if (myDesktop) {
        let sWidth = myDesktop.clientWidth;
        if (parseInt(e.clientX) - parseInt(sWidth) > 0) {
          oBtn.style.display = "block";
        }
        if (parseInt(sWidth * 0.6) - parseInt(e.clientX) > 0) {
          oBtn.style.display = "none";
        }
      }
    });
  },
  created() {
    this.getStandardsView();
    // this.getMyOrder();
    this.getMyCollect();
    this.getMyKnowledge();
    this.getMyDesktopSettings();
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
        padding: 10px 10%;
        margin: 15px 0;
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

   // 标准概览(新)
  .quan-profile-conent-std {
    margin: 0 15px;
    padding: 30px 10px 0px 10px;
    .quan-profile-item-box {
      display: flex;
      padding: 30px 10px 30px 10px;
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
