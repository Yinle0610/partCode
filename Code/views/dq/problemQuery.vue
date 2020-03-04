<template>
  <div class="problemQuery dashboard-editor-container">
    <el-card shadow="hover" class="card-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="手工提交" name="0" v-loading="bIsLoading">
          <!--手工提交 - 过滤条件-->
          <div class="tab-filter">
            <el-form
              :inline="true"
              :model="handFormInline"
              class="demo-form-inline problem-margin-left"
            >
              <el-form-item label="问题编号：">
                <el-input
                  style="width: 150px"
                  v-model="handFormInline.queIdKey"
                  placeholder="请输入问题编号"
                  size="small"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="提交日期：">
                <el-date-picker
                  size="small"
                  v-model="handFormInline.submitDate"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="问题描述：">
                <el-input v-model="handFormInline.descKey" placeholder="请输入问题关键字" size="small" clearable></el-input>
              </el-form-item>
              <el-form-item label="问题等级：">
                <el-select
                  style="width: 150px"
                  v-model="handFormInline.queLevel"
                  size="small" clearable
                  placeholder="请选择"
                  @change="manualHandleCurrentChange(1)"
                >
                  <el-option
                    v-for="item in questionLevelList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="提交人：">
                <el-input
                  v-model="handFormInline.regUserNameKey"
                  placeholder="请输入提交人用户名"
                  size="small"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="问题状态：">
                <el-select
                  v-model="handFormInline.status"
                  size="small"
                  multiple clearable
                  placeholder="请选择"
                  @change="handStatusChange"
                >
                  <el-option
                    v-for="item in manualStatusList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search"  @click="onHandSubmit" style="padding:7px">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!--手工提交 - 表格数据-->
          <el-card class="card-table">
            <el-table :data="manualTableData" style="width: 100%">
              <el-table-column label="问题编号" width="180">
                <template slot-scope="scope">
                  <a class="a-color" @click="clickToDetailsProblem(scope.row)">{{scope.row.queId}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="queDesc" label="问题描述" width="180"></el-table-column>
              <el-table-column prop="queLevel" label="问题等级"></el-table-column>
              <el-table-column prop="registerUserName" label="提交人"></el-table-column>
              <el-table-column prop="registerDate" label="提交时间" width="150px"></el-table-column>
              <el-table-column prop="queStatus" label="处理状态"></el-table-column>
            </el-table>
          </el-card>
          <div style="text-align: center; padding: 10px 0">
            <el-pagination
              @size-change="manualHandleSizeChange"
              @current-change="manualHandleCurrentChange"
              :current-page="oHandIssue.pageCurrent"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="oHandIssue.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="oHandIssue.total"
            ></el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="自动稽核" name="1">
          <!--自动稽核 - 过滤条件-->
          <div class="tab-filter">
            <el-form
              :inline="true"
              :model="autoFormInline"
              class="demo-form-inline problem-margin-left"
            >
              <el-form-item label="稽核日期：">
                <el-date-picker
                  size="small"
                  v-model="autoFormInline.auditDate"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label>
                <el-input
                  v-model="autoFormInline.keyword"
                  placeholder="请输入检核方法名称..."
                  size="small"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="问题状态：">
                <el-select
                  v-model="autoFormInline.autoStatus"
                  size="small"
                  multiple
                  placeholder="请选择"
                  @change="autoStatusChange"
                >
                  <el-option
                    v-for="item in autoStatusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search"  @click="onAutoSubmit" style="padding:7px">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!--自动稽核 - 表格数据-->
          <el-card class="card-table">
            <el-table :data="autoTableData" style="width: 100%">
              <el-table-column prop="kpiId" label="检核方法编号" width="150"></el-table-column>
              <el-table-column prop="kpiName" label="检核方法名称"></el-table-column>
              <el-table-column prop="checkDate" label="稽核时间"></el-table-column>
              <el-table-column prop="checkCnStatus" label="处理状态" width="150px"></el-table-column>
              <el-table-column prop="checkTotle" label="稽核总数"></el-table-column>
              <el-table-column prop="queNum" label="问题总数"></el-table-column>
              <el-table-column prop="issusRate" label="问题率"></el-table-column>
              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="明细" placement="bottom">
                    <el-button @click="clickToQuesDetails(scope.row)" type="text" size="small" >
                      <svg-icon icon-class="preview" class="preview"></svg-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="SQL" placement="bottom">
                    <el-button @click="clickToSeeSql(scope.row)" type="text" size="small" v-if="scope.row.kpisSql">
                      <svg-icon icon-class="code" class="code"></svg-icon>
                    </el-button>
                    <el-button type="text" size="small" v-else 
                              style="color:#999;font-size:16px;position:relative;bottom:4px;">无</el-button>
                  </el-tooltip>
                  <!-- <el-button size="small" disabled>无</el-button> -->
                  <!-- <el-button @click="clickToQuesDetails(scope.row)" type="primary" size="small">明细</el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <div style="text-align: center; padding: 10px 0">
            <el-pagination
              @size-change="autoHandleSizeChange"
              @current-change="autoHandleCurrentChange"
              :current-page="oAutoIssue.pageCurrent"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="oAutoIssue.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="oAutoIssue.total"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
import { get, parseAjaxResponse } from "../../../src/utils/request";

export default {
  name: 'problemQuery',
  data() {
    return {
      bIsLoading: true,
      activeName: "0", // Tag标签 (0-手工提交，1-自动稽核)
      handFormInline: {
        queIdKey: "", // 问题编号
        submitDate: [],
        descKey: "", // 问题描述
        queLevel: "", // 问题等级(1:紧急;2:一般;3:重要)
        regUserNameKey: "", // 提交人
        status: [] // 问题状态(0:已提交;1:已受理;2:解决中;3:已解决;4:已关闭;5:已驳回;6:待确认;)
      },
      autoFormInline: {
        auditDate: [], // 稽核日期
        keyword: "",
        autoStatus: [] // 问题状态
      },
      questionLevelList: [
        // 问题等级
        { id: 1, label: "紧急", value: "1" },
        { id: 2, label: "一般", value: "2" },
        { id: 3, label: "重要", value: "3" }
      ],
      manualStatusList: [
        { id: 0, label: "已提交", value: "0" },
        { id: 1, label: "已受理", value: "1" },
        { id: 2, label: "解决中", value: "2" },
        { id: 3, label: "已解决", value: "3" },
        { id: 4, label: "已关闭", value: "4" },
        { id: 5, label: "已驳回", value: "5" },
        { id: 6, label: "待确认", value: "6" }
      ],
      autoStatusList: [
        { id: 0, label: "未受理", value: "0" },
        { id: 1, label: "已受理", value: "1" },
        { id: 2, label: "忽略", value: "2" }
      ],
      submitDate: [], // 手工 - 提交日期
      manualTableData: [
        //   {
        //   queId: 123333,
        //   registerDate: '2016-05-02',
        //   queDesc: 'qdw',
        //   registerUserName: '王小虎',
        //   queLevel: '紧急'
        // }, {
        //   queId: 234,
        //   registerDate: '2016-05-04',
        //   queDesc: 'www',
        //   registerUserName: '王小虎',
        //   queLevel: '紧急'
        // }
      ],

      questionStatus: 0, // 问题状态
      autoTableData: [
        // { id: 1, KPI_ID: 'D0001', KPI_NAME: '“基金产品简称”长度必须大于等于2', CHECK_DATE: '2019-01-19 06:44:30', QUE_TYPE_CN: '未受理', SEL_SUM: '36', QUES_SUM: '36', QUE_RATE: '100.00%' },
        // { id: 2, KPI_ID: 'D0002', KPI_NAME: '“基金托管人”不能为空\t\n', CHECK_DATE: '2019-01-19 06:41:00', QUE_TYPE_CN: '未受理', SEL_SUM: '34', QUES_SUM: '34', QUE_RATE: '100.00%' },
        // { id: 3, KPI_ID: 'D0003', KPI_NAME: '“基金运作方式”不能为空', CHECK_DATE: '2019-01-19 06:36:00', QUE_TYPE_CN: '未受理', SEL_SUM: '9853', QUES_SUM: '1484', QUE_RATE: '15.07%' }
      ],

      // 手工提交 page分页
      oHandIssue: {
        pageCurrent: 1,
        pageSize: 10,
        total: 0
      },
      // 自动稽核 page分页
      oAutoIssue: {
        pageCurrent: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  methods: {
    // 获取默认Tab /dqms/issuequery/getDefaultTab
    getProblemQueryDefaultTabs() {
      get("/dqms/issuequery/getDefaultTab").then(res => {
        parseAjaxResponse(res, () => {
          console.log(res);
          if (res.code === 10000) {
            this.activeName = res.data.defaultView;
            if (this.activeName === "0") {
              // 手工提交
              this.getListHandIssue(); // 手工提交列表信息
            } else if (this.activeName === "1") {
              this.getListAutoIssue(); // 自动稽核列表信息
            }
          }
        });
      });
    },
    // 分页获取自动稽核信息 /dqms/issuequery/listAutoIssueInfos  todo 自动稽核列表 -操作列 按钮“无”的显示情况
    getListAutoIssue() {
      get("/dqms/issuequery/listAutoIssueInfos", {
        startDate:
          this.autoFormInline.auditDate[0] !== null
            ? this.autoFormInline.auditDate[0]
            : "", // 稽核开始日期(yyyy-MM-dd)
        endDate:
          this.autoFormInline.auditDate[1] !== null
            ? this.autoFormInline.auditDate[1]
            : "", // 稽核结束日期(yyyy-MM-dd)
        checkNameKey: this.autoFormInline.keyword, // 问题关键字
        status: this.autoFormInline.autoStatus.join(","), // array[string]  问题状态(0:未受理;1:已受理;2:忽略;)
        pageCurrent: this.oAutoIssue.pageCurrent,
        pageSize: this.oAutoIssue.pageSize
      }).then(res => {
        parseAjaxResponse(res, () => {
          console.log(res);
          if (res.code === 10000) {
            this.bIsLoading = false;
            this.oAutoIssue.pageCurrent = res.data.current;
            this.oAutoIssue.total = res.data.total;
            this.autoTableData = res.data.records;
          }
        });
      });
    },
    // 分页获取手工问题信息 /dg/issue/listHandIssueInfos
    getListHandIssue() {
      get("/dg/issue/listHandIssueInfos", {
        queIdKey: this.handFormInline.queIdKey, // 问题编号
        startDate:
          this.handFormInline.submitDate !== null
            ? this.handFormInline.submitDate[0]
            : "",
        endDate:
          this.handFormInline.submitDate !== null
            ? this.handFormInline.submitDate[1]
            : "",
        descKey: this.handFormInline.descKey, // 问题描述
        queLevel: this.handFormInline.queLevel, // 问题等级(1:紧急;2:一般;3:重要)
        regUserNameKey: this.handFormInline.regUserNameKey, // 提交人
        status: this.handFormInline.status.join(","), // 问题状态(0:已提交;1:已受理;2:解决中;3:已解决;4:已关闭;5:已驳回;6:待确认;)
        pageCurrent: this.oHandIssue.pageCurrent,
        pageSize: this.oHandIssue.pageSize
      }).then(res => {
        parseAjaxResponse(res, () => {
          console.log(res);
          if (res.code === 10000) {
            this.bIsLoading = false;
            this.oHandIssue.pageCurrent = res.data.current;
            this.oHandIssue.total = res.data.total;
            this.manualTableData = res.data.records;
          }
        });
      });
    },
    // 点击tab切换
    handleClick(tab, event) {
      this.bIsLoading = true;
      if (tab.name === "0") {
        // 手工提交
        this.getListHandIssue(); // 手工提交列表信息
      } else if (tab.name === "1") {
        this.getListAutoIssue(); // 自动稽核列表信息
      }
    },

    onHandSubmit() {
      this.manualHandleCurrentChange(1);
    },
    handStatusChange() {
      this.manualHandleCurrentChange(1);
    },
    manualHandleSizeChange(val) {
      this.oHandIssue.pageSize = val;
      this.getListHandIssue();
    },
    manualHandleCurrentChange(val) {
      this.oHandIssue.pageCurrent = val;
      this.getListHandIssue();
    },
    onAutoSubmit() {
      this.autoHandleCurrentChange(1);
    },
    autoStatusChange() {
      console.log(this.autoFormInline.autoStatus);
      this.autoHandleCurrentChange(1);
    },
    autoHandleSizeChange(val) {
      this.oAutoIssue.pageSize = val;
      this.getListAutoIssue();
    },
    autoHandleCurrentChange(val) {
      this.oAutoIssue.pageCurrent = val;
      this.getListAutoIssue();
    },
    // 跳转到 '问题详情' 页面
    clickToDetailsProblem(row) {
      console.log(row)
      let params = null;
      get('home/matter/queryDetailParams?questionId=' + row.queId).then(res => {
        params = res.data;
        this.$router.push({ name: 'particulars', query: {
          bid: params.businessId, type: params.caseStatus === '已关闭' ? '已关闭' : params.noteMessage, pid: params.processId
        }})
      })
    },
    // 跳转到 自动稽核-问题明细页面
    clickToQuesDetails(row) {
      this.$router.push({
        name: "auditingQuesDetails",
        params: {
          id: row.queId,
          questionId: row.queId,
          kpiId: row.kpiId,
          chkDate: row.checkDate
        }
      });
    },
    clickToSeeSql(item) {
      this.$alert(item.kpisSql, 'SQL', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          });
        }
      });
    }
  },
  created() {
    console.log(this.$route.params);
    if (this.$route.params.activeName) {
      let params = this.$route.params;
      // this.$route.params.activeName === 0
      if (params.activeName === "0") {
        this.activeName = "0";
        this.handFormInline.status = params.status;
        this.handFormInline.submitDate[0] = params.startTime
          ? params.startTime
          : "";
        this.handFormInline.submitDate[1] = params.endTime
          ? params.endTime
          : "";
        this.getListHandIssue();
      } else {
        this.activeName = "1";
        this.autoFormInline.autoStatus = params.status;
        this.autoFormInline.auditDate[0] = params.startTime
          ? params.startTime
          : "";
        this.autoFormInline.auditDate[1] = params.endTime ? params.endTime : "";
        this.getListAutoIssue();
      }
    } else {
      this.getProblemQueryDefaultTabs();
    }
  },
  mounted() {}
};
</script>


<style lang="scss" scoped>
//外层card容器样式
@import "./../../styles/dq/main-card-table.scss";

.tab-filter {
  background: #f8f8f9;
  padding: 10px 0;
}
.problem-margin-left {
  margin-left: 10px;
}
.tab-filter .el-form .el-form-item {
  margin-bottom: 6px;
}
//tab过滤区域-字体大小和颜色
.tab-filter .el-form .el-form-item /deep/ .el-form-item__label {
  font-size: 13px;
  color: #333;
  font-weight: normal;
}
.item{
  .preview,.code{
    width:22px;
    height:22px;
  }
}
</style>
