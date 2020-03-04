<!--一列标题，一列数据-->
<template>
  <div class="table-tbody">
    <el-row v-for="index in rowCount" :key="index" class="el-row-bottom el-row-enter">
      <el-col :span="12">
        <el-col :span="4" class="table-title col-class">
          <div class="table-cell">
            {{columnTableData[index-1].key}}
          </div>
        </el-col>
        <el-col :span="8" class="col-class">
          <div class="table-cell">
            {{columnTableData[index-1].value}}
          </div>
        </el-col>
      </el-col>
      <el-col :span="12">
        <el-col :span="4" class="table-title col-class">
          <div class="table-cell">
            {{columnTableData[rowCount+index-1] !== undefined ? columnTableData[rowCount+index-1].key : ''}}
          </div>
        </el-col>
        <el-col :span="8" class="col-class">
          <div class="table-cell">
            {{columnTableData[rowCount+index-1] !== undefined ? columnTableData[rowCount+index-1].value : ''}}
          </div>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: ['columnTableData'],
    computed: {
      rowCount: function() {
        if (this.columnTableData.length !== undefined) {
          return Math.ceil(this.columnTableData.length / 2)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .table-tbody {
    color: #515a6e;
    font-size: 12px;
    border: 1px solid #e8eaec;
    border-bottom: none;

    .el-row-bottom {
      border-bottom: 1px solid #e8eaec;
    }

    .el-row-enter:hover {
      background-color: #F5F8FB;

      .table-cell {
        background-color: #F5F8FB;
      }
    }

    .table-title {
      background-color: #f5f7f9;
      width: 200px;
    }

    .table-cell {
      padding-left: 18px;
      padding-right: 18px;
      overflow: hidden;
      line-height: 48px;
      text-overflow: ellipsis;
      white-space: normal;
      word-break: break-all;
    }

    .table-title.col-class {
      border-right: 1px solid #e8eaec;
    }

    .col-class {
      min-width: 0;
      height: 48px;
      text-align: left;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
  }
</style>