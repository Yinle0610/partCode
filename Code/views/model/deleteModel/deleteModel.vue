<template>
  <div class="delete-model">
    <el-tabs>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="主题信息" name="first" v-if="subjectShow">
          <el-table
            :data="subjectTableData"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{background:'#f8f8f9',color:'#666'}"
          >
            <el-table-column prop="subjectCode" show-overflow-tooltip label="主题代码"></el-table-column>
            <el-table-column prop="subjectName" show-overflow-tooltip label="主题名称"></el-table-column>
            <el-table-column prop="creator" show-overflow-tooltip label="创建人"></el-table-column>
            <el-table-column prop="createDate" show-overflow-tooltip label="创建时间"></el-table-column>
          </el-table>
          <div class="dialog-page">
            <el-pagination
              @size-change="changeSubjectSize"
              @current-change="changeSubjectCurrent"
              :current-page="subjectCurrent"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="subjectSize"
              layout="total, sizes, prev, pager, next, jumper"
              background
              :total="subjectTotal"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="层次信息" name="first" v-if="!subjectShow">
          <el-table
            :data="aLevelTableData"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{background:'#f8f8f9',color:'#666'}"
          >
            <el-table-column prop="levelCode" show-overflow-tooltip label="层次代码"></el-table-column>
            <el-table-column prop="levelName" show-overflow-tooltip label="层次名称"></el-table-column>
            <el-table-column prop="creator" show-overflow-tooltip label="创建人"></el-table-column>
            <el-table-column prop="createDate" show-overflow-tooltip label="创建时间"></el-table-column>
          </el-table>
          <div class="dialog-page">
            <el-pagination
              @size-change="changeLevelSize"
              @current-change="changeLevelCurrent"
              :current-page="levelCurrent"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="levelSize"
              layout="total, sizes, prev, pager, next, jumper"
              background
              :total="levelTotal"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane  label="物理模型" name="second">
          <el-table
            :data="physicalTableData"
            border
            style="width: 100%"
            size="mini"
            :header-cell-style="{background:'#f8f8f9',color:'#666'}"
          >
            <el-table-column prop="tableCnName" show-overflow-tooltip label="表中文名"></el-table-column>
            <el-table-column prop="tableEnName" show-overflow-tooltip label="表英文名"></el-table-column>
            <el-table-column prop="datasourceName" show-overflow-tooltip label="关联数据源"></el-table-column>
            <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"></el-table-column>
          </el-table>
          <div class="dialog-page">
            <el-pagination
              @size-change="changePhysicalSize"
              @current-change="changePhysicalCurrent"
              :current-page="physicalCurrent"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="physicalSize"
              layout="total, sizes, prev, pager, next, jumper"
              background
              :total="physicalTotal"
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
  name: "deletemodel",
  props: {
    subjectShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isSubjectShow: this.subjectShow,
      activeName: "first",
      // 主题表
      subjectTableData: [],
      subjectCurrent: 1,
      subjectSize: 10,
      subjectTotal: 0,
      // 层次表
      aLevelTableData: [],
      levelCurrent: 1,
      levelSize: 10,
      levelTotal: 0,
      // 物理模型表
      physicalTableData: [],
      physicalCurrent: 1,
      physicalSize: 10,
      physicalTotal: 0,
      // 父传过来的id
      id: ""
    };
  },
  methods: {
    handleClick() {},
    // 接收父组件传的id  获取所有表格数据
    getAllMsg(id) {
      this.id = id;
      if (this.isSubjectShow) {
        this.getPhysicalTableData();
        this.getSubjectTableData();
      } else {
        this.getPhysicalTableData();
        this.getLevelTableData();
      }
    },

    // 查询每个主题/层次下面的所有模型
    getPhysicalTableData() {
      if (this.isSubjectShow) {
        get("/mod/subject/listModelsBySubIds", {
          pageCurrent: this.physicalCurrent,
          pageSize: this.physicalSize,
          subjectIds: this.id
        }).then(res => {
          if (res.code === 10000 && res.success) {
            this.physicalTableData = res.data.records;
            this.physicalTotal = res.data.total;
          }
        });
      } else {
        get("/mod/level/listModelsByLevelIds", {
          pageCurrent: this.physicalCurrent,
          pageSize: this.physicalSize,
          levelIds: this.id
        }).then(res => {
          if (res.code === 10000 && res.success) {
            this.physicalTableData = res.data.records;
            this.physicalTotal = res.data.total;
          }
        });
      }
    },
    // 根据ID串返回所有主题
    getSubjectTableData() {
      get("/mod/subject/listSubjectsBySubIds", {
        pageCurrent: this.subjectCurrent,
        pageSize: this.subjectSize,
        subjectIds: this.id
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.subjectTableData = res.data.records;
          this.subjectTotal = res.data.total;
        }
      });
    },
    // 根据ID串返回所有层次
    getLevelTableData() {
      get("/mod/level/listLevelsByLevelIds", {
        pageCurrent: this.subjectCurrent,
        pageSize: this.subjectSize,
        levelIds: this.id
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.aLevelTableData = res.data.records;
          this.levelTotal = res.data.total;
        }
      });
    },
    // 翻页
    changePhysicalCurrent(val) {
      this.physicalCurrent = val;
      this.getPhysicalTableData();
    },
    changeSubjectCurrent(val) {
      this.subjectCurrent = val;
      this.getSubjectTableData();
    },
    changeLevelCurrent(val) {
      this.levelCurrent = val;
      this.getLevelTableData();
    },
    // 展示条数
    changePhysicalSize(val) {
      this.physicalCurrent = 1;
      this.physicalSize = val;
      this.getPhysicalTableData();
    },
    changeSubjectSize(val) {
      this.subjectCurrent = 1;
      this.subjectSize = val;
      this.getSubjectTableData();
    },
    changeLevelSize(val) {
      this.levelCurrent = 1;
      this.levelSize = val;
      this.getLevelTableData();
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
.delete-model {
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