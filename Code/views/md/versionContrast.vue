<template>
  <!-- 比对 -->
  <div class="version-contrast tableNoPadding">
      <div class="version-contrast_header">
        <el-button @click="handleBack" class="edit-back">返回</el-button>
      </div>
      <div class="version mb20">
        <div class="right-title">
          <i class="line"></i>基本信息
        </div>
        <div class="metadata-table" v-loading="tableLoading">
          <el-table
            size="small"
            :data="basicTableList"
            style="width: 100%;margin-bottom: 20px;"
            :show-header="false"
            :row-style="rowStyle"

            border>
            <el-table-column
              prop="title"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="oldVal"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="newVal"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="version mb20">
        <div class="right-title">
          <i class="line"></i>属性信息
        </div>
        <div class="metadata-table" v-loading="tableLoading">
          <el-table
            size="small"
            :data="featList"
            style="width: 100%;margin-bottom: 20px;"
            :show-header="false"
            :row-style="rowStyle"
            border>
            <el-table-column
              prop="attName"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="attValue"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="compareValue"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="version mb20">
        <div class="right-title">
          <i class="line"></i>下级信息（汇总）
        </div>
        <div class="metadata-table" v-loading="tableLoading">
          <el-table
            size="small"
            :data="lowerTableList"
            style="width: 100%;margin-bottom: 20px;"
            :show-header="false"
            :row-style="rowStyle"
            border>
            <el-table-column
              prop="classifierName"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="count"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="newCount"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
      </div>
  </div>
</template>

<script>
// import { get, parseAjaxResponse } from "@/utils/request";
export default {
  name: "",
  // props: {
  //   basicTableList: {
  //     type: Array,
  //     default: []
  //   },
  //   featList: {
  //     type: Array,
  //     default: []
  //   }
  // },
  // watch: {
  //   basicTableList: {
  //     handler(newVal, oldVal) {
  //       console.log(this.basicTableList, 'basicTableList')
  //       cnosole.log('223')
  //     },
  //     deep: true
  //   },
  //   featList: {
  //     handler(newVal, oldVal) {
  //       cnosole.log('224')
  //       console.log(this.featList, 'featList')
  //     },
  //     deep: true
  //   }
  // },
  data() {
    return {
      basicLoading: true,
      basicMsg: {},
      lowerTableList: [], // 下级信息汇总列表
      basicTableList: [], // 基本信息列表
      featList: [], // 属性信息列表
      tableLoading: true // 表格加载
    };
  },
  methods: {
    getAllMsg(item) {
      console.log(item, '55')
      this.basicTableList = item.basicTableList
      this.featList = item.featList
      this.lowerTableList = item.lowerTableList
      this.tableLoading = false
    },
    handleBack() {
      this.$emit("backDetail")
      // this.tableLoading = true
    },
    rowStyle({ row, rowIndex }) {
      // console.log(row, rowIndex)
      if (row.different) {
        return "color: red"
      }
      if (rowIndex === 0) {
        return "background: rgb(252, 252, 252)"
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.version-contrast {
  width: 100%;
  height: calc(100vh - 84px);
  .preview {
    height: 22px;
    width: 22px;
  }
  /deep/ .el-select__caret {
    height: 28px;
  }
}
.card-box {
  overflow: auto;
  height: 100%;
  &::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }
  &::-webkit-scrollbar-track {
    background: none;
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgb(239, 239, 239);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #bfbfbf;
  }
  .version {
    margin-bottom: 20px;
    .version-box {
      padding: 0 40px;
      li {
        list-style-type: none;
        margin-bottom: 30px;
        color: #666666;
      }
      .demo-versionForm {
        width: 80%;
      }
    }
    .metadata-table {
      padding: 0 120px;
      .el-form-item {
        margin-bottom: 10px;
      }
    }
  }
  .version-contrast_header {
    padding: 0 0px 15px 5px;
    border-bottom: 1px solid #EBEEF5;
    margin-bottom: 20px;
  }
}
.right-title {
  font-family: "PingFangSC-Regular", "PingFang SC";
  font-weight: 400;
  height: 30px;
  line-height: 30px;
  font-style: normal;
  font-size: 16px;
  color: #666666;
  border-bottom: unset;
  margin-bottom: 20px;
  padding: 0 15px;
  .line {
    height: 100%;
    width: 4px;
    float: left;
    display: block;
    background: #579ef3;
    margin-right: 15px;
  }
}
.secondPart {
  margin-bottom: 10px;
}
</style>