<template>
  <div class="quality-detail">
    <div class="qd-header">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="检核方法类型：">
          <el-select
            @change="changeType"
            clearable
            v-model="form.checkFunClassId"
            placeholder="请选择"
          >
            <el-option
              v-for="(item ,index) in funcType"
              :key="index"
              :label="item.textField"
              :value="item.valueField"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据源：">
          <el-select
            @change="changeSource"
            clearable
            v-model="form.datasourceCode"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in sourceType"
              :key="index"
              :label="item.textField"
              :value="item.valueField"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检核日期：">
          <el-date-picker
            @change="changeDate"
            value-format="yyyy-MM-dd"
            v-model="form.date"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="qd-table">
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
        border
        style="width: 100%"
      >
        <el-table-column prop="checkFunClassName" label="检核方法类型"></el-table-column>
        <el-table-column prop="dataSourceName" label="数据源"></el-table-column>
        <el-table-column prop="tableName" label="表名"></el-table-column>
        <el-table-column prop="columnName" label="字段名"></el-table-column>
        <el-table-column prop="checkDate" label="检核日期"></el-table-column>
        <el-table-column prop="checkTotal" label="检核总数"></el-table-column>
        <el-table-column prop="issueTotal" label="问题总数"></el-table-column>
        <el-table-column prop="issueRate" label="问题率"></el-table-column>
      </el-table>
    </div>
    <div style="text-align: center;margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.pageCurrent"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { get } from "@/utils/request";
export default {
  name: "qualityDetail",
  data() {
    return {
      form: {
        checkFunClassId: "",
        datasourceCode: "",
        date: "",
        month: "",
        pageCurrent: 1,
        pageSize: 10
      },
      dateTime: "",
      tableData: [],
      pageSize: 10,
      pageCurrent: 1,
      total: 0,
      // 检核方法
      funcType: [],
      // 数据源
      sourceType: []
    };
  },
  methods: {
    // 检核方法类型 改变
    changeType(val) {
      this.form.funcType = val;
      this.getTableData();
    },
    // 数据源 改变
    changeSource(val) {
      this.form.sourceType = val;
      this.getTableData();
    },
    // 检核日期  改变
    changeDate(val) {
      this.form.date = val;
      this.getTableData();
    },
    getTableData() {
      get("/dqms/report/listQualityReportDetail", this.form).then(res => {
        this.total = res.data.total;
        this.tableData = res.data.records;
      });
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.form.pageCurrent = val;
      this.getTableData();
    },
    // 获取检查方法数据源
    getSourceType() {
      get("/dqms/report/listCheckDataSourceType").then(res => {
        this.sourceType = res.data;
      });
    },
    // 获取检核方法类型
    getCheckFunType() {
      get("/dqms/report/listCheckFunType").then(res => {
        this.funcType = res.data;
      });
    }
  },
  created() {
    this.getSourceType();
    this.getCheckFunType();
    this.getTableData();
  }
};
</script>

<style lang="scss" scoped>
.quality-detail {
  padding: 16px;
  margin: 10px;
  background: #fff;
  border-radius: 5px;
  &:hover {
    box-shadow: -1px 1px 10px 1px #ccc;
  }
  .qd-header {
    background: #f8f8f9;
    padding: 10px;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
    /deep/ .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
    /deep/ .el-input__suffix-inner {
      display: block;
    }
  }
  .qd-table {
    margin-top: 10px;
  }
}
</style>
