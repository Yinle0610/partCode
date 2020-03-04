<template>
  <div class="table">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="工单类型:">
            <el-select v-model="form.category" placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="工单状态:">
            <el-select v-model="form.caseStatus" placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="我的角色:">
            <el-select v-model="form.userRole" placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开始日期:">
            <el-date-picker @change="changeDate" v-model="form.time" type="daterange"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="工单名称:">
            <el-input v-model="form.caseName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary">查询</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="TableData"
      border
      show-header
      :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
      style="width: 100%"
    >
      <el-table-column sortable prop="caseName" label="工单名称"></el-table-column>
      <el-table-column sortable prop="taskName" label="任务名称"></el-table-column>
      <el-table-column sortable prop="categoryName" label="工单类型"></el-table-column>
      <el-table-column sortable prop="userRole" label="我的角色">
        <!-- <template slot-scope="scope">
          <div v-for="(item, index) in [scope.row.labelNames] " :key="index">{{item}}</div>
        </template>-->
      </el-table-column>
      <el-table-column sortable prop="taskTime" label="流转日期"></el-table-column>
      <el-table-column sortable prop="createTime" label="开始日期"></el-table-column>
      <el-table-column sortable prop="endTime" label="截止日期"></el-table-column>
      <el-table-column prop="caseStatus" label="工单状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span>编辑</span>
          <span>查看</span>
          <span>明细</span>
          <span>撤回</span>
          <!-- <el-button @click="handleClick(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="handleDelete(scope.row.docId)" type="primary" size="small">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div id="kno-pag" style="text-align: center;padding-top: 10px;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, prev, pager, next,sizes,jumper"
        :total="iTotalPage"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { get } from "@/utils/request";
export default {
  name: "",
  data() {
    return {
      TableData: [
        {
          action: "string",
          businessId: "string",
          caseId: "string",
          caseName: "string",
          caseStatus: "string",
          categoryName: "string",
          closeTime: "string",
          createTime: "string",
          endTime: "string",
          notMyTask: "string",
          noteMessage: "string",
          processId: "string",
          rollBack: true,
          taskId: "string",
          taskName: "string",
          userRole: "string"
        }
      ],
      form: {
        category: "",
        caseStatus: "",
        userRole: "",
        caseName: "",
        time: ""
      },
      currentPage: 1,
      pageSize: 10,
      iTotalPage: 0
    };
  },
  methods: {
    changeDate(val) {
      console.log(val)
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    getTableList() {
      get("/home/matter/queryTaskList", {
        caseName: this.form.caseName,
        caseStatus: this.form.caseStatus,
        category: this.form.category,
        firstTime: "",
        pageCurrent: this.currentPage,
        pageSize: this.pageSize,
        secondTime: "",
        userRole: this.form.userRole
      }).then(res => {
        console.log(res);
      });
    }
  },
  created() {
    this.getTableList();
  }
};
</script>

<style lang='scss'>
.table /deep/ {
  .el-date-editor {
    width: 100%;
  }
  .el-input__inner {
    // display: block;
    // height: 30px; sortable
    // line-height: 30px;
    // font-size: 12px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    // padding-left: 8px;
    // padding-right: 24px;
    // width: 100%;;
  }
}
</style>