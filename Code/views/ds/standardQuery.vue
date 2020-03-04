<template>
  <div class="data-resource dashboard-editor-container">
    <el-card shadow="hover" class="card-container">
      <el-row v-loading="oStandardsView.bLoading" class="standard-box">
        <el-col
          :span="6"
          class="sv-item"
          v-for="(item, index) in oStandardsView.aConent"
          :key="index"
          @click.native="index > 0 ?clickTopTitle(item): ''"
          :style="{cursor: index > 0 ? 'pointer' : ''}"
        >
          <div class="sv-item-top">
            <img :src="item.sImgSrc" alt />
            <div class="sv-item-top-text">
              <span class="title">{{item.name}}</span>
              <span class="num">{{item.nTotal}}</span>
            </div>
          </div>
          <div class="sv-item-bottom">
            <div class="sc-b-cell">
              <span>
                <span class="icon-greenCircle"></span>
                已发布
              </span>
              <span class="green-color">{{item.nPublished}}</span>
            </div>
            <div class="sc-b-cell">
              <span>
                <span class="icon-orangeCircle"></span>
                待发布
              </span>
              <span class="orange-color">{{item.nReleased}}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <div ref="contentBox" id="contentBox" class="standard-list">
      <left-part
        ref="left"
        @sendBreadcrumb="getBreadcrumb"
        @sendInstanceId="getInstanceId"
        @changeDetailShow="changeDetailShow"
        @showDetail="choseLastChild"
      ></left-part>
      <div class="right-box">
        <el-card shadow="hover">
          <div class="no-data" v-show="isShow">
            <img src="../../../static/images/standard-default.png" alt />
          </div>
          <div class="data" v-show="!isShow">
            <div class="tTitle">
              <i class="bread-icon"></i>
              <el-breadcrumb class="bIcon" v-if="wBread.whichBread=='bIcon'">
                <el-breadcrumb-item
                  v-for="( item, index ) in wBread.breadcrumb"
                  :key="index"
                >{{item}}</el-breadcrumb-item>
              </el-breadcrumb>
              <el-input
                v-show="!deatilShow"
                placeholder="请输入内容"
                v-model="wKeyword"
                @keyup.enter.native="getTableData"
              >
                <i slot="suffix" class="el-input__icon el-icon-search" @click="getTableData"></i>
              </el-input>
            </div>
            <el-table
              v-show="!deatilShow"
              :data="tableData"
              border
              style="width: 100%;margin-top: 10px;"
              height="calc(100vh - 350px)"
            >
              <el-table-column prop="classifierName" label="标准类型" width="120"></el-table-column>
              <el-table-column prop="code" label="标准代码" width="120">
                <template slot-scope="scope">
                  <el-button
                    @click="handleClickCode(scope.row)"
                    type="text"
                    size="small"
                  >{{scope.row.code}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="cnName" label="中文名称" width="120"></el-table-column>
              <el-table-column prop="enName" label="英文名称" width="120"></el-table-column>
              <el-table-column prop="address" label="标准别名" width="120"></el-table-column>
              <el-table-column prop="zip" label="引用标准名称" width="120"></el-table-column>
              <el-table-column prop="zip" label="值域/引用代码" width="120"></el-table-column>
              <el-table-column prop="zip" label="信息细类" width="120"></el-table-column>
              <el-table-column prop="zip" label="制定依据" width="120"></el-table-column>
              <el-table-column prop="zip" label="引用标准编号" width="120"></el-table-column>
              <el-table-column prop="zip" label="英文缩写" width="120"></el-table-column>
              <el-table-column prop="zip" label="业务规则" width="120"></el-table-column>
              <el-table-column prop="businessDef" label="业务定义" width="120"></el-table-column>
              <el-table-column prop="zip" label="最后维护人" width="120"></el-table-column>
              <el-table-column prop="zip" label="质量检查编号" width="120"></el-table-column>
              <el-table-column prop="zip" label="校验规则" width="120"></el-table-column>
              <el-table-column prop="zip" label="发布状态" width="120"></el-table-column>
              <el-table-column prop="zip" label="数据管理部门" width="120"></el-table-column>
              <el-table-column prop="createTime" label="生效日期" width="120"></el-table-column>
              <el-table-column prop="zip" label="失效日期" width="120"></el-table-column>
              <el-table-column prop="zip" label="脱敏算法" width="120"></el-table-column>
              <el-table-column prop="zip" label="脱敏场景" width="120"></el-table-column>
              <el-table-column prop="zip" label="安全等级" width="120"></el-table-column>
              <el-table-column prop="zip" label="数据长度" width="120"></el-table-column>
              <el-table-column prop="zip" label="代码编码规则" width="120"></el-table-column>
              <el-table-column prop="zip" label="数据类型" width="120"></el-table-column>
              <el-table-column prop="zip" label="数据类型描述" width="120"></el-table-column>
              <el-table-column prop="zip" label="数据格式" width="120"></el-table-column>
              <el-table-column prop="zip" label="常用度量单位" width="120"></el-table-column>
              <el-table-column prop="zip" label="数据精度" width="120"></el-table-column>
            </el-table>
            <el-pagination
              v-show="!deatilShow"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </el-card>
        <standard-detail v-show="deatilShow" ref="detail"></standard-detail>
      </div>
    </div>
  </div>
</template>
<script>
import leftPart from "./standardExcute/leftPart";
import StandardsView from "@/components/Standards/StandardsView";
import standardDetail from "./standardDetails";
import { get } from "@/utils/request";
export default {
  name: "standard",
  components: {
    leftPart,
    StandardsView,
    standardDetail
  },
  data() {
    return {
      wKeyword: "",
      tableHeight: '180px',
      // isshow: true,
      wBread: {
        whichBread: "bIcon",
        breadcrumb: []
      },
      oStandardsView: {
        bLoading: true,
        aConent: [
          {
            name: "标准总数",
            sImgSrc: require("@/assets/images/commonIcon/totalStandard.png"),
            nTotal: 0,
            nPublished: 0,
            nReleased: 0,
            id: ""
          },
          {
            name: "基础类标准",
            sImgSrc: require("@/assets/images/commonIcon/basicClassStandards.png"),
            nTotal: 0,
            nPublished: 0,
            nReleased: 0,
            id: ""
          },
          {
            name: "指标类标准",
            sImgSrc: require("@/assets/images/commonIcon/lndicatorClassCriteria.png"),
            nTotal: 0,
            nPublished: 0,
            nReleased: 0,
            id: ""
          },
          {
            name: "代码类标准",
            sImgSrc: require("@/assets/images/commonIcon/commonCodeClass.png"),
            nTotal: 0,
            nPublished: 0,
            nReleased: 0,
            id: ""
          }
        ]
      },
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      standardId: "",
      standardTypeId: "",
      choseId: "",
      // 显示隐藏 详情
      deatilShow: false
    };
  },
  methods: {
    // 点击最后一层
    choseLastChild(node) {
      console.log(node);
      this.deatilShow = true;
      this.choseId = node.instanceId;
      this.$refs.detail.getDisId(this.choseId);
      this.$nextTick(() => {
        this.$refs.detail.getMsg();
        this.$refs.detail.getReferenceInfos();
      });
    },
    // 点击头部三个总类
    clickTopTitle(item) {
      console.log(item);
      this.standardTypeId = item.id;
      this.standardId = "";
      this.wBread.breadcrumb = [item.name];
      this.getTableData();
    },
    // 获取头部四个card数据
    getStandardsView() {
      this.$store.dispatch("StandardsView").then(res => {
        if (res.code === 10000 && res.success === true) {
          console.log(res);
          const data = res.data;
          this.oStandardsView.aConent[0].nTotal = data[0].amount;
          this.oStandardsView.aConent[0].nPublished = data[0].published;
          this.oStandardsView.aConent[0].nReleased = data[0].unPublished;
          this.oStandardsView.aConent[2].id =
            data[1].classId === "IndexInfoItem" ? "IndexDataStandard" : "";
          this.oStandardsView.aConent[3].id =
            data[3].classId === "CommonCodeInfoItem"
              ? "CommonCodeDataStandard"
              : "";
          this.oStandardsView.aConent[1].id =
            data[2].classId === "InfoItem" ? "BaseDatastandard" : "";
          this.oStandardsView.aConent[2].nTotal = data[1].amount;
          this.oStandardsView.aConent[2].nPublished = data[1].published;
          this.oStandardsView.aConent[2].nReleased = data[1].unPublished;
          this.oStandardsView.aConent[1].nTotal = data[2].amount;
          this.oStandardsView.aConent[1].nPublished = data[2].published;
          this.oStandardsView.aConent[1].nReleased = data[2].unPublished;
          this.oStandardsView.aConent[3].nTotal = data[3].amount;
          this.oStandardsView.aConent[3].nPublished = data[3].published;
          this.oStandardsView.aConent[3].nReleased = data[3].unPublished;
          this.oStandardsView.bLoading = false;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 查询表格信息
    getTableData() {
      get("/ds/search", {
        addAttr: false, // 是否查询标准的属性
        current: this.currentPage, // 当前页
        keyword: this.wKeyword, // 关键字
        size: this.pageSize, //  pageSize
        standardId: this.standardId, // 标准的ID
        standardTypeId: this.standardTypeId // 标准类型的id
      }).then(res => {
        // console.log(res)
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
    },
    handleClickCode(val) {
      console.log(val.classifierId);
      this.choseId = val.id;
      this.$refs.detail.getDisId(this.choseId);
      this.$nextTick(() => {
        this.$refs.detail.getMsg(val.id);
        this.$refs.detail.getReferenceInfos(val.id);
        this.$refs.detail.getClassifierId(val.classifierId);
      });

      // 显示详情组件
      this.deatilShow = true;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
    getBreadcrumb(val) {
      // this.isShow = false
      this.wBread.breadcrumb = val;
    },
    getInstanceId(val) {
      this.standardId = val.standardId;
      this.standardTypeId = "";
      this.getTableData();
    },
    // 详情是否展示
    changeDetailShow(val) {
      // console.log(val)
      this.$refs.detail.handleClick("close");
      // if (val.id) {
      //   // this.choseId = val.id
      //   this.$refs.detail.getMsg();
      //   this.$refs.detail.getReferenceInfos(val.id);
      //   this.$refs.detail.getClassifierId(val.classifierId);
      // }
      // console.log(this.deatilShow, val.display);
      if (val.display && this.deatilShow) {
        this.deatilShow = true;
        this.choseId = val.id;
        this.$refs.detail.getDisId(this.choseId);

        this.$nextTick(() => {
          this.$refs.detail.getClassifierId(val.classifierId);
        });
      } else {
        this.deatilShow = false;
      }
    }
  },
  computed: {
    isShow: function() {
      if (this.wBread.breadcrumb.length > 0) {
        return 0;
      } else {
        return 1;
      }
    }
  },
  mounted() {
  },
  created() {
    this.getStandardsView();
    this.getTableData();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
@import "../../styles/variables";
@import "../../styles/treeIcon";
@import "./../../styles/dq/main-card-table.scss";
.standard-box {
  .sv-item {
    position: relative;
    border: 1px solid #e9e9e9;
    width: 24%;
    margin-right: 1%;
  }
  .sv-item-top {
    position: relative;
    text-align: center;
    padding: 10px 0;
    margin: 0 20px;
    border-bottom: 1px solid #e9e9e9;
    img {
      display: inline-block;
      width: 40px;
      height: 40px;
    }
    .sv-item-top-text {
      display: inline-block;
      vertical-align: top;
      margin-left: 16%;
      .title {
        display: block;
        font-size: 14px;
        color: #666;
      }
      .num {
        display: block;
        font-size: 24px;
        color: #333;
        line-height: 24px;
      }
    }
  }
  .sv-item-bottom {
    .sc-b-cell {
      display: inline-block;
      width: 48%;
      text-align: center;
      line-height: 30px;
      font-size: 12px;
      color: #888;
      .icon-orangeCircle {
        position: relative;
        left: -3px;
        top: -2px;
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: orange;
      }
      .orange-color {
        color: orange;
      }
      .icon-greenCircle {
        position: relative;
        left: -3px;
        top: -2px;
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: green;
      }
      .green-color {
        color: green;
      }
    }
  }

  .standard-item-box {
    border: 1px solid $border;
    width: 100%;
    padding: 0 20px;
    margin-top: 0;
    cursor: pointer;
    .standard-item-top-box {
      position: relative;
      text-align: center;
      padding: 10px 0;
      margin: 0 20px;
      border-bottom: 1px solid $border;
      img {
        display: inline-block;
        width: 40px;
        height: 40px;
      }
      .standard-item-top-text {
        display: inline-block;
        vertical-align: top;
        margin-left: 16%;
        span {
          display: block;
        }
        .text {
          font-size: 14px;
          color: #666;
        }
        .num {
          font-size: 24px;
          color: #333;
          line-height: 24px;
        }
      }
    }
    .standard-item-bottom-box {
      display: flex;
      p {
        width: 50%;
        position: relative;
        text-align: center;
        font-size: 12px;
        color: #888;
        line-height: 30px;
        margin: 0;
        i {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 100%;
          margin-right: 2px;
        }
      }
      .standard-item-bottom-left {
        i {
          background: green;
        }
        .num {
          color: green;
        }
      }
      .standard-item-bottom-right {
        i {
          background: orange;
        }
        .num {
          color: orange;
        }
      }
    }
  }
}
.data-resource {
  .card-container {
    .el-card__body {
      padding: 10px 0 10px 1% !important;
      .el-col {
        width: 24%;
        margin-right: 1%;
      }
      .el-col:nth-of-type(4) {
        // padding-right: 15px !important;
      }
    }
  }
}

.standard-list {
  position: relative;
  width: 100%;
  height: calc(100vh - 230px);
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  .right-box {
    position: absolute;
    width: calc(100% - 325px);
    left: 325px;
    top: 0px;
    height: 100%;
    overflow-y: hidden;
    .el-tabs {
      margin-top: 40px;
      padding: 10px;
    }
    .el-card {
      height: 100%;
      position: absolute;
      left: 0px;
      top: 0px;
      bottom: 0px;
      width: 100%;
      .no-data {
        width: 100%;
        height: 100%;
        text-align: center;
        position: relative;
        padding: 30px;
        top: 16%;
        img {
          width: 90%;
          height: auto;
        }
      }
      .data {
        .tTitle {
          position: relative;
          height: 38px;
          border-bottom: 1px solid #e9e9e9;
          z-index: 100;
          .bread-icon {
            position: absolute;
            display: inline-block;
            top: 4px;
            left: 0;
            width: 20px;
            height: 20px;
            background: url(./../../assets/images/commonIcon/bread-icon.png) no-repeat;
            background-size: 100%;
          }
          .el-breadcrumb {
            position: absolute;
            left: 28px;
            font-size: 12px;
            line-height: 22px;
            top: 10px;
            .el-breadcrumb__inner {
              color: #999;
            }
          }
          .el-input {
            width: 220px;
            height: 32px;
            position: absolute;
            right: 0;
            .el-input__inner {
              height: 32px;
              line-height: 32px;
            }
            .el-input__icon {
              line-height: 32px;
            }
          }
        }
      }
      .el-pagination {
        margin-top: 10px;
        text-align: center;
      }
    }
    .el-tabs__content {
      position: absolute;
      width: 100%;
      left: 1px;
      /* top: 52px; */
      padding: 0px 15px;
      height: calc(100% - 52px);
      overflow-y: auto;
    }
    .el-collapse {
      border-top: unset;
      border-bottom: unset;
    }
  }
  .mm-left {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 320px;
    height: 100%;
    margin-right: 5px;
    .el-card__header {
      display: none;
    }
    .el-tree {
      cursor: default;
      background: #fff;
      color: #606266;
      position: absolute;
      top: 70px;
      right: 0px;
      left: 0;
      padding: 0 16px;
      height: calc(100% - 80px);
      overflow-y: auto;
    }
    .left-chose {
      display: none;
    }
  }
  /deep/ .el-collapse-item__wrap:last-child {
    border-bottom: unset;
  }
}
</style>
