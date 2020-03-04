<template>
  <div class="delete-dialog">
    <el-tabs>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="标准信息" name="first">
          <el-table
            :data="standardTableData"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{background:'#f8f8f9',color:'#666'}"
          >
            <el-table-column prop="code" show-overflow-tooltip label="标准代码"></el-table-column>
            <el-table-column prop="name" show-overflow-tooltip label="标准名称"></el-table-column>
            <el-table-column prop="classifierId" show-overflow-tooltip label="类型代码"></el-table-column>
            <el-table-column prop="classifierName" show-overflow-tooltip label="类型名称"></el-table-column>
          </el-table>
          <div class="dialog-page">
            <el-pagination
              @size-change="changeStandardSize"
              @current-change="changeStandardCurrent"
              :current-page="standardCurrent"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="standardSize"
              layout="total, sizes, prev, pager, next, jumper"
              background
              :total="standardTotal"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="combinationShow" label="组合关系" name="second">
          <el-table
            :data="groupTableData"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{background:'#f8f8f9',color:'#666'}"
          >
            <el-table-column prop="childInstanceCode" show-overflow-tooltip label="标准子类代码"></el-table-column>
            <el-table-column prop="childInstanceName" show-overflow-tooltip label="标准子类名称"></el-table-column>
            <el-table-column prop="fatherInstanceCode" show-overflow-tooltip label="标准父类代码"></el-table-column>
            <el-table-column prop="fatherInstanceName" show-overflow-tooltip label="标准父类名称"></el-table-column>
            <el-table-column prop="relationship" show-overflow-tooltip label="关系代码"></el-table-column>
          </el-table>
          <div class="dialog-page">
            <el-pagination
              @size-change="changeGroupSize"
              @current-change="changeGroupCurrent"
              :current-page="groupCurrent"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="groupSize"
              layout="total, sizes, prev, pager, next, jumper"
              background
              :total="groupTotal"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="依赖关系" name="third">
          <el-table
            :data="relyTableData"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{background:'#f8f8f9',color:'#666'}"
          >
            <el-table-column prop="fromInstanceCode" show-overflow-tooltip label="源标准代码"></el-table-column>
            <el-table-column prop="fromInstanceName" show-overflow-tooltip label="源标准名称"></el-table-column>
            <el-table-column prop="toInstanceCode" show-overflow-tooltip label="目标标准代码"></el-table-column>
            <el-table-column prop="toInstanceClassifierName" show-overflow-tooltip label="目标标准名称"></el-table-column>
            <el-table-column prop="relationship" show-overflow-tooltip label="关系代码"></el-table-column>
          </el-table>
          <div class="dialog-page">
            <el-pagination
              @size-change="changeRelySize"
              @current-change="changeRelyCurrent"
              :current-page="relyCurrent"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="relySize"
              layout="total, sizes, prev, pager, next, jumper"
              background
              :total="relyTotal"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-tabs>
  </div>
</template>

<script>
import { get } from "@/utils/request";

export default {
  name: "",
  props: {
    combinationShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeName: "first",
      // 标准表
      standardTableData: [],
      standardCurrent: 1,
      standardSize: 10,
      standardTotal: 0,
      // 组合表
      groupTableData: [],
      groupCurrent: 1,
      groupSize: 10,
      groupTotal: 0,
      // 依赖表数据
      relyTableData: [],
      relyCurrent: 1,
      relySize: 10,
      relyTotal: 0,
      // 父传过来的id
      id: ""
    };
  },
  methods: {
    handleClick() {},
    // 接收父组件传的id  获取所有表格数据
    getAllMsg(id) {
      this.id = id;
      this.getGroupTableData();
      this.getRelyTableData();
      this.getStandardTableData();
      // console.log(id);
      // 组合关系数据
    },
    // 组合关系
    getGroupTableData() {
      get("ds/listAllAffectedCompositionById", {
        current: this.groupCurrent,
        size: this.groupSize,
        instanceIds: this.id
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.groupTableData = res.data.records;
          this.groupTotal = res.data.total;
        }
      });
    },
    // 依赖
    getRelyTableData() {
      get("/ds/listAllAffectedDependencyById", {
        current: this.relyCurrent,
        size: this.relySize,
        instanceIds: this.id
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.relyTableData = res.data.records;
          this.relyTotal = res.data.total;
          res.data.records.map((val, index) => {
            if (val.fromInstanceName !== undefined) {
              this.relyTableData[index].fromInstanceClassifierName =
                val.fromInstanceName;
            }
            if (val.toInstanceName !== undefined) {
              this.relyTableData[index].toInstanceClassifierName =
                val.toInstanceName;
            }
          });
        }
      });
    },
    // 标准
    getStandardTableData() {
      get("/ds/listAllAffectedDataById", {
        current: this.standardCurrent,
        size: this.standardSize,
        instanceIds: this.id
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.standardTableData = res.data.records;
          this.standardTotal = res.data.total;
        }
      });
    },
    // 翻页
    changeRelyCurrent(val) {
      this.relyCurrent = val;
      this.getRelyTableData();
    },
    changeGroupCurrent(val) {
      this.groupCurrent = val;
      this.getGroupTableData();
    },
    changeStandardCurrent(val) {
      this.standardCurrent = val;
      this.getStandardTableData();
    },
    // 展示条数
    changeRelySize(val) {
      this.relyCurrent = 1;
      this.relySize = val;
      this.getRelyTableData();
    },
    changeStandardSize(val) {
      this.standardCurrent = 1;
      this.standardSize = val;
      this.getStandardTableData();
    },
    changeGroupSize(val) {
      this.groupCurrent = 1;
      this.groupSize = val;
      this.getGroupTableData();
    },
    activeFirst() {
      this.activeName = "first";
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
$color-grey-light: #e0e0e0;
.delete-dialog {
  // margin: -30px -20px 0;
  /deep/ .el-tabs__item {
    height: 46px;
    width: 106px;
    line-height: 46px;
    text-align: center;
    padding: 0px;
  }
  /deep/ .el-tabs__nav-wrap::after {
    background-color: unset;
  }
  /deep/ .el-tabs__content {
    padding: 0 15px;
  }
  /deep/ .el-tabs {
    .el-tabs__header {
      margin-left: 15px;
      .el-tabs__nav-wrap::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0 !important;
        z-index: 1;
      }
    }
    .el-tabs__content {
      .relationship {
        .title {
          border-bottom: 1px solid $color-grey-light;
          font-size: 17px;
          padding: 20px 10px;
        }
        .button {
          padding: 10px 10px;
          .el-button--mini {
            font-size: 13px;
            .svg-icon {
              position: relative;
            }
          }
          .zengjia {
            padding: 4px 10px 5.5px 10px;
            .svg-icon {
              width: 15px;
              height: 15px;
              top: 1px;
            }
          }
          .shanchu {
            padding: 4px 10px 6.5px 9px;
            .svg-icon {
              width: 16px;
              height: 16px;
              top: 1px;
            }
          }
        }
        .table {
          margin-top: 15px;
          /deep/ .tableClass {
            border-right: none !important;
          }
        }
      }
      .confess-account {
        .title {
          border-bottom: 1px solid $color-grey-light;
          font-size: 16px;
          padding: 20px 15px;
        }
      }
    }
  }
  .dialog-page {
    text-align: center;
    margin: 20px 0;
  }
}
</style>