<template>
  <div class="standardEx">
    <div class="cardContainerTop">
      <div class="top-left1">
        <el-card shadow="hover">
          <div class="card-top">
            <div class="card-icons-box">
              <img src="./../../assets/images/commonIcon/resourcesDataSheet.png" alt />
              <div class="card-text">
                <span class="card-text1">表执行率</span>
                <span class="card-text2">{{execInfo.tableExeRate}}</span>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="card-body-text">
              <span>总数：{{execInfo.tableTotal}}</span>
              <span>执行数：{{execInfo.tableExecutionNum}}</span>
            </div>
          </div>
        </el-card>
      </div>
      <div class="top-left2">
        <el-card shadow="hover">
          <div class="card-top">
            <div class="card-icons-box">
              <img src="./../../assets/images/commonIcon/resourcesField.png" alt />
              <div class="card-text">
                <span class="card-text1">字段执行率</span>
                <span class="card-text2">{{execInfo.columnExeRate}}</span>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="card-body-text">
              <span>总数：{{execInfo.columnTotal}}</span>
              <span>执行数：{{execInfo.columnExecutionNum}}</span>
            </div>
          </div>
        </el-card>
      </div>
      <div class="top-right">
        <el-card shadow="hover">
          <div class="card-body">
            <el-row class="card-body-box">
              <el-col :span="11">
                <el-form ref="form" label-width="80px">
                  <el-form-item label="元数据代码：">
                    <el-input v-model="formData.mdCodeKey" placeholder="请输入关键字..."></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="11">
                <el-form ref="form" label-width="80px">
                  <el-form-item label="元数据名称：">
                    <el-input v-model="formData.mdNameKey" placeholder="请输入关键字..."></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="11">
                <el-form ref="form" label-width="80px">
                  <el-form-item label="标准代码：">
                    <el-input v-model="formData.dsCodeKey" placeholder="请输入关键字..."></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="11">
                <el-form ref="form" label-width="80px">
                  <el-form-item label="标准名称：">
                    <el-input v-model="formData.dsNameKey" placeholder="请输入关键字..."></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
          <div class="card-button">
            <div class="card-button-box">
              <el-button @click="getTableData" type="primary">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </div>
        </el-card>
      </div>
      <div class="tableContent">
        <el-card shadow="hover">
          <div class="clearfix content-btns" slot="header">
            <el-button v-permission="'MANUAL_MAPPING'" @click="handleMapping" type="primary">
              <i class="manual-mapping"></i>手动映射
            </el-button>
            <el-button v-permission="'BATCH_SCAN'" type="primary" @click="batchScanner">
              <i class="batch-scanning"></i>批量扫描
            </el-button>
          </div>
          <el-table
            border
            class="table-data"
            align="center"
            show-header
            :data="TableData"
            :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
            :default-sort="{prop: 'date', order: 'descending'}"
            style="width: 100%"
          >
            <el-table-column align="center" prop="mdInstanceCode" label="元数据代码">
              <template slot-scope="scope">
                <el-button
                  @click="handleToDetails(scope.row.mdInstanceId, scope.row.mdInstanceCode, scope.row.mdClassifierID, scope.row)"
                  type="text"
                  size="small"
                >{{scope.row.mdInstanceCode}}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="mdInstanceName" label="元数据名称"></el-table-column>
            <el-table-column align="center" prop="mdClassifierName" label="元数据类型">
              <template slot-scope="scope">
                {{scope.row.mdClassifierID}}（{{scope.row.mdClassifierName}}）
              </template>
            </el-table-column>
            <el-table-column align="center" prop="mdParentInstanceCode" label="父类元数据代码">
              <template slot-scope="scope">
                <el-button
                  @click="handleToDetails(scope.row.mdParentInstanceId, scope.row.mdParentInstanceCode, scope.row.mdClassifierID)"
                  type="text"
                  size="small"
                >{{scope.row.mdParentInstanceCode}}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="mdParentInstanceName" label="父类元数据名称"></el-table-column>
            <el-table-column align="center" prop="executionSystemName" label="执行系统名称"></el-table-column>
            <el-table-column align="center" prop="dsInstanceCode" label="标准编号">
              <template slot-scope="scope">
                <el-button
                  @click="handleToSdDetails(scope.row)"
                  type="text"
                  size="small"
                >{{scope.row.dsInstanceCode}}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="dsInstanceName" label="标准名称"></el-table-column>
            <el-table-column v-if="power" align="center" prop="dsInstanceCode" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleDelete(scope.row)" type="text" size="small">
                  <i class="icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div id="divpage" class="div-page mt10">
            <div class="block">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, prev, pager, next,sizes,jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import { get } from "@/utils/request";

export default {
  data() {
    return {
      execInfo: {},
      formData: {
        dsCodeKey: "",
        dsNameKey: "",
        mdCodeKey: "",
        mdNameKey: ""
      },
      TableData: [],
      power: false,
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    // 左上 获取表、字段执行率详情
    getExecinfo() {
      get("/ds/execution/getExecutionCountInfo").then(res => {
        console.log(res);
        this.execInfo = res.data;
      });
    },
    // 手动映射
    handleMapping() {
      this.$router.push({ name: "manualMapping" });
    },
    // 获取table数据
    getTableData() {
      get("/ds/execution/listStandardMappingInfo", {
        dsCodeKey: this.formData.dsCodeKey,
        dsNameKey: this.formData.dsNameKey,
        mdCodeKey: this.formData.mdCodeKey,
        mdNameKey: this.formData.mdNameKey,
        pageCurrent: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res.data);
        this.TableData = res.data.records;
        this.total = res.data.total;
      });
    },
    // pagesize 改变展示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
    // 重置查询框内容
    reset() {
      for (let val in this.formData) {
        this.formData[val] = "";
      }
      this.getTableData();
    },
    // 批量扫描
    batchScanner() {
      get("/ds/execution/batchScanner").then(res => {
        console.log(res);
        if (res.code === 10000 && res.success) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 跳去详情页(id, title)
    handleToDetails(id, title, classifierId, row) {
      console.log(id, title, classifierId, row);
      this.$router.push({
        name: "impactAndLineageDetail",
        params: {
          id: id,
          classifierId: classifierId,
          _title: title
        }
      });
    },
    // 跳转详情页
    handleToSdDetails(row) {
      // console.log(row);
      this.$router.push({
        name: "standardDetails",
        params: {
          id: row.dsInstanceId,
          _title: row.dsInstanceCode
        }
      });
    },
    // 删除
    handleDelete(item) {
      console.log(item);
      get("/ds/execution/removeMappingInfo", {
        mappingId: item.mappingId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.$message.success(res.message);
          this.getTableData();
        } else {
          this.$message.error(res.message);
        }
      });
    }
  },
  created() {
    this.getExecinfo();
    this.getTableData();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "./../../styles/dq/main-card-table.scss";
.standardEx {
  padding: 16px;
  .cardContainerTop /deep/ {
    .top-left1,
    .top-left2,
    .top-right {
      display: inline-block;
    }
    .top-left1 {
      width: 20%;
      .el-card__body {
        padding: 0;
        .card-top {
          width: 100%;
          border-bottom: 1px solid #e8eaec;
          padding: 16px;
          line-height: 1;
          .card-icons-box {
            position: relative;
            height: 70px;
            text-align: center;
            img {
              width: 64px;
              height: 64px;
              display: inline-block;
              padding-top: 10px;
            }
            .card-text {
              display: inline-block;
              text-align: center;
              vertical-align: top;
              padding-top: 14px;
              margin-left: 20px;
              span {
                display: block;
              }
              .card-text1 {
                color: #666;
              }
              .card-text2 {
                font-size: 22px;
                color: #333;
                font-weight: bold;
                line-height: 40px;
              }
            }
          }
        }
        .card-body {
          padding: 18px;
          .card-body-text {
            display: flex;
            span {
              flex: 1;
              font-size: 12px;
              text-align: center;
            }
          }
        }
      }
    }
    .top-left2 {
      width: 20%;
      margin-left: 10px;
      .el-card__body {
        padding: 0;
        .card-top {
          width: 100%;
          border-bottom: 1px solid #e8eaec;
          padding: 16px;
          line-height: 1;
          .card-icons-box {
            position: relative;
            height: 70px;
            text-align: center;
            img {
              width: 64px;
              height: 64px;
              display: inline-block;
              padding-top: 10px;
            }
            .card-text {
              display: inline-block;
              text-align: center;
              vertical-align: top;
              padding-top: 14px;
              margin-left: 20px;
              span {
                display: block;
              }
              .card-text1 {
                color: #666;
              }
              .card-text2 {
                font-size: 22px;
                color: #333;
                font-weight: bold;
                line-height: 40px;
              }
            }
          }
        }
        .card-body {
          padding: 18px;
          .card-body-text {
            display: flex;
            span {
              flex: 1;
              font-size: 12px;
              text-align: center;
            }
          }
        }
      }
    }
    .top-right {
      margin-left: 10px;
      width: calc(60% - 30px);
      .el-card__body {
        padding: 0;
        .card-body {
          width: 100%;
          border-bottom: 1px solid #e8eaec;
          .card-body-box {
            padding: 10px 12px;
            .el-col {
              margin-left: 20px;
              .el-form {
                .el-form-item {
                  margin-bottom: 0;
                  .el-form-item__label {
                    width: 96px !important;
                  }
                  .el-input {
                    width: 92%;
                    .el-input__inner {
                      height: 32px;
                    }
                  }
                }
              }
            }
          }
        }
        .card-button {
          padding: 5px;
          text-align: center;
          .card-button-box {
            .el-button.el-button--primary {
              font-size: 12px;
              padding: 10px 18px;
            }
          }
        }
      }
    }
  }
  .tableContent {
    .content-btns /deep/ {
      .el-button {
        padding: 9px 20px;
        position: relative;
        span {
          padding-left: 10px;
        }
        i {
          position: absolute;
          display: inline-block;
          width: 20px;
          height: 20px;
          left: 5px;
          top: 4px;
          z-index: 999;
        }
        .manual-mapping {
          background: url("../../../static/images/manual-mapping.png");
          background-size: 100%;
        }
        .batch-scanning {
          background: url("../../../static/images/batch-scanning.png");
          background-size: 100%;
        }
      }
    }
    .table-data {
      .icon-delete {
        background: url("../../../static/images/icon-matter-delete.png");
        width: 20px;
        height: 20px;
        display: inline-block;
        background-size: 20px 20px;
        cursor: pointer;
      }
      .el-button {
        white-space: unset;
      }
    }
  }
}
</style>
