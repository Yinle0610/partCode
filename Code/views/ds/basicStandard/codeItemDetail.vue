<template>
  <div class="right-basic">
    <div style="background: #fff;">
      <div slot="header" class="clearfix card-title">
        <el-button class="back-btn" @click="handleBack">返回</el-button>
      </div>
      <div class="basic-content">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="1">
            <template slot="title">
              <i class="line"></i>基本信息
            </template>
            <div>
              <p>公共代码项代码：{{codeBasicMsg.code}}</p>
              <p>公共代码项名称：{{codeBasicMsg.name}}</p>
              <p v-for="(item , index) in codeBasicMsg.attributes" :key="index">
                <span>{{item.name}}：{{item.value ? item.value : '暂无数据'}}</span>
              </p>
            </div>
          </el-collapse-item>
          <el-collapse-item class="usageCollapse" name="2">
            <template slot="title">
              <i class="line"></i>应用->维度
            </template>
            <div class="code-table">
              <el-table
                :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                border
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column :show-overflow-tooltip='showToolTip' align="center" label="维度代码">
                  <template slot-scope="scope">
                    <el-button
                      @click="toDetails(scope.row)"
                      type="text"
                    >{{ scope.row.toParentInstanceCode }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  :show-overflow-tooltip='showToolTip'
                  align="center"
                  prop="toParentInstanceName"
                  label="维度名称"
                ></el-table-column>
                <el-table-column
                  :show-overflow-tooltip='showToolTip'
                  align="center"
                  prop="toInstanceCode"
                  label="维度值"
                ></el-table-column>
                <el-table-column align="center" :show-overflow-tooltip='showToolTip' prop="toPath" label="上下文路径"> </el-table-column>
                <el-table-column
                  align="center"
                  prop="relationshipName"
                  label="关系类型"
                  :show-overflow-tooltip='showToolTip'
                ></el-table-column>
              </el-table>
              <div class="code-pagination">
                <el-pagination
                  @current-change="changeCurrent"
                  background
                  layout="prev, pager, next"
                  :total="total"
                ></el-pagination>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "@/utils/request";
export default {
  name: "codeItemDetails",
  data() {
    return {
      showToolTip: true,
      activeNames: ["1", "2"],
      searchMsg: "",
      tableData: [],
      codeBasicMsg: [],
      rowMsg: [],
      current: 1,
      total: 0
    };
  },
  methods: {
    // 折叠面板事件
    handleChange(val) {
      console.log(val);
    },
    // 表头选择
    handleSelectionChange(val) {
      console.log(val);
    },
    // 新增代项码信息
    handleCodeMsgAdd() {},
    // 删除代码项信息
    handleCodeMsgDelete() {},
    // 获取代码项表格数据
    getTableMsg() {},
    // 跳到代码详情
    handleBack() {
      this.showToolTip = false
      this.$parent.$parent.$parent.showCommonDetail();
      // this.closeNavTag(this.$route)
    },
    // 关闭nav上的tag路由
    closeNavTag(view) {
      this.$store.dispatch("delVisitedViews", view).then(views => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("professionalTerms");
          }
        }
      });
    },
    // 判断是否为当前页面
    isActive(route) {
      return route.path === this.$route.path;
    },
    // 获取代码详情
    getCodeDetail() {
      get("/ds/public/queryPublicCodeItemDetails", {
        publicCodeItemId: this.rowMsg.instanceId
      }).then(res => {
        console.log(res);
        if (res.code === 10000 && res.success) {
          this.codeBasicMsg = res.data;
        }
      });
    },
    // 获取应用table
    getUsageTable() {
      get("/ds/public/usageRelations", {
        pageCurrent: this.current,
        pageSize: 10,
        publicCodeItemId: this.rowMsg.instanceId
      }).then(res => {
        // console.log(res, 22)
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
    },
    // getRow(row) {
    //   this.rowMsg = row;
    //   this.getUsageTable();
    //   this.getCodeDetail();
    // },
    changeCurrent(val) {
      this.current = val;
      this.getUsageTable();
    },
    // 跳到维度值详情
    toDetails(row) {
      console.log(row)
      this.$router.push({
        name: "dimensionDetails",
        params: { id: row.toInstanceId, _title: row.toInstanceName, detailId: row.toInstanceId }
      });
    },
    getAllMsg(row) {
      this.showToolTip = true
      this.rowMsg = row;
      this.getUsageTable();
      this.getCodeDetail();
    }
  },
  created() {
    // this.rowMsg = this.$route.params.row
    // this.getUsageTable();
    // this.getCodeDetail();
  }
};
</script>

<style lang="scss" scoped>
$titleFontSize: 20px;
$collapseSize: 14px;
.right-basic {
  height: 100%;
  padding: 5px;
  overflow: auto;
}
.right-basic::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}
.right-basic::-webkit-scrollbar-track {
  background: none;
  border-radius: 2px;
}
.right-basic::-webkit-scrollbar-thumb {
  background: rgb(239, 239, 239);
  border-radius: 10px;
}
.right-basic::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
.card-title {
  height: 55px;
  padding: 5px 50px;
  border-bottom: 1px solid rgba(228, 228, 228, 1);
  padding-left: 10px;
  /deep/ .el-button {
    height: 34px;
    padding: 0;
    width: 74px;
  }
}
.card-title-content {
  font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC";
  font-weight: 650;
  font-style: normal;
  font-size: $titleFontSize;
  line-height: 55px;
  color: rgba(51, 51, 51, 0.647058823529412);
  text-align: center;
}
.basic-button {
  height: 34px;
  width: 85px;
  padding: 0 15px 0 35px;
  position: relative;
}
.dataTable-icon {
  position: absolute;
  display: inline-block;
  width: 24px;
  height: 24px;
  left: 7px;
  top: 3px;
}
.basic-content {
  // height: calc(100% - 80px);
  // width: calc(100% - 80px);
  // overflow: auto;
  // position: absolute;
  /deep/ .el-collapse {
    border: unset;
    margin-top: 30px;
  }
  /deep/ .el-collapse-item__header {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    color: #666666;
    padding: 0 20px;
    border-bottom: unset;
    height: 30px;
    font-size: 16px;
    margin-bottom: 10px;
  }
  /deep/ .el-collapse-item__wrap {
    border-bottom: unset;
  }
  /deep/ .el-collapse-item__content {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    font-size: $collapseSize;
    color: #666666;
    padding: 0px 60px 10px;
  }
  .basic-content_button {
    height: 34px;
    width: 85px;
    padding: 0;
    position: relative;
  }
}
.right-code {
  overflow: hidden;
  .code-button {
    float: left;
  }
  .code-search_input {
    float: right;
    /deep/ .el-input__inner {
      height: 38px;
    }
  }
}
.code-table {
  margin-top: 10px;
  .code-pagination {
    margin-top: 10px;
    text-align: center;
  }
}
.usageCollapse {
  /deep/ .el-collapse-item__content {
    padding: 20px;
  }
}
.line {
  height: 100%;
  width: 4px;
  background: #579ef3;
  margin-right: 15px;
}
.back-btn {
  height: 34px;
  padding: 0;
  width: 60px;
}
</style>
