<!--一列标题，一列数据-->
<template>
  <div class="title-table-calss">
    <!-- 1、自定义纵向表格 -->
    <div class="table-tbody" v-if="!showelTable">
      <el-row v-for="(item, index) in columnTableData" :key="index" class="el-row-bottom el-row-enter">
        <el-col :span="5" class="table-title col-class">
          <div class="table-cell">
            {{item.name + ":"}}
          </div>
        </el-col>
        <el-col :span="19" class="col-class">
          <div class="table-cell">
            {{item.value}}
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 2、使用el-table实现纵向表格 （隐藏表头） -->
    <el-table v-else
              :data="columnTableData"
              :show-header="false"
              border
              style="width: 100%">
      <el-table-column
          label=""
          width="200">
        <template slot-scope="scope"> {{scope.row.key + ":"}}</template>
      </el-table-column>
      <el-table-column
          prop="value"
          label="">
        <template slot-scope="scope">
          <a v-if="scope.row.key === '元数据代码'" class="a-color" @click="goMetadataDetails">{{scope.row.value}} </a>
          <span v-else>{{scope.row.value}} </span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: ['columnTableData', 'showelTable'],
    methods: {
      goMetadataDetails () {
        this.$emit('goDetails')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import './../../../styles/dq/main-card-table.scss';
  // 1、自定义纵向表格 样式
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

  // 2、使用el-table实现纵向表格（隐藏表头）  样式
  .title-table-calss /deep/ .el-table__body-wrapper table tbody {
    font-size: 12px;

    tr td div {
      padding: 0 18px;
    }

    tr.el-table__row td:first-child {
      background-color: #f5f7f9;
    }
  }
</style>