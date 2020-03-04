<!--标准详情页面-->
<template>
  <div class="standard-details dashboard-editor-container">
    <el-card shadow="hover" class="card-container">
      <!--收藏-->
      <!-- <div
        v-show="false"
        class="sq-collect"
        :class="[this.$route.params.id?'':'re-position']"
        @click="handleCollect"
      >
        <i
          :class="{'el-icon-star-off': true, 'star-on': flagCollect}"
          style="width: 20px; height: 20px"
        ></i>
        <span>{{flagCollect?'已收藏':'收藏'}}</span>
      </div>-->
      <!-- detailData.CLASSIFIER_ID!='CommonCodeInfoItem'  -->
      <div>
        <div
          :style="{pointerEvents:(Collodisabled?'none':'')}"
          v-if="!classifierId"
          class="sq-collect"
          :class="[this.$route.params.id?'':'re-position']"
          @click="handleCollect"
        >
          <i
            :class="{'el-icon-star-off': true, 'star-on': flagCollect}"
            style="width: 20px; height: 20px"
          ></i>
          <span>{{flagCollect?'已收藏':'收藏'}}</span>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="标准信息" name="1">
            <!-- 折叠面板 -->
            <el-collapse
              style="border: unset;"
              v-model="collapseActiveNames"
              @change="handleChange"
            >
              <el-collapse-item title="概要信息" name="1">
                <one-column-vertical-table :columnTableData="baseInfoData" :showelTable="true"></one-column-vertical-table>
              </el-collapse-item>
              <el-collapse-item title="基本属性" name="2">
                <one-column-vertical-table :column-table-data="arrtTableData" :showelTable="true"></one-column-vertical-table>
              </el-collapse-item>
              <el-collapse-item title="业务属性" name="3">
                <one-column-vertical-table
                  :column-table-data="businessTableData"
                  :showelTable="true"
                ></one-column-vertical-table>
              </el-collapse-item>
              <el-collapse-item title="管理属性" name="4">
                <one-column-vertical-table :column-table-data="manageTableData" :showelTable="true"></one-column-vertical-table>
              </el-collapse-item>
              <el-collapse-item style="padding-bottom: 100px;" title="技术属性" name="5">
                <one-column-vertical-table :column-table-data="tecTableData" :showelTable="true"></one-column-vertical-table>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="代码项" name="Code" v-if="classifierId">
            <div>
              <div slot="header" class="clearfix total">
                <span>总数:{{codeTotal}}</span>
                <el-input @keyup.enter.native="getCodeTable" placeholder="请输入" v-model="keyMsg">
                  <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </div>
              <el-table border :data="codeTableData" style="width: 100%">
                <el-table-column prop="codeValue" label="公共代码项取值"></el-table-column>
                <el-table-column prop="codeName" label="公共代码项名称"></el-table-column>
              </el-table>
              <div style="text-align: center; padding:10px 0 100px;">
                <el-pagination
                  @size-change="handleCodeSizeChange"
                  @current-change="handleCodeCurrentChange"
                  :current-page="codeCurrentPage"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="codePageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="codeTotal"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="引用信息" name="Schema" v-if="bIsQuoteVisible">
            <!-- <el-card class="card-table"> -->
            <div>
              <div slot="header" class="clearfix total">
                <span>总数:{{infoTotal}}</span>
              </div>
              <el-table border :data="quoteTableData" style="width: 100%">
                <el-table-column label="元数据代码">
                  <template slot-scope="scope">
                    <a
                      class="a-color"
                      @click="toMetaDataDetails(scope.row,scope.row.instanceId, scope.row.insClassifierId, scope.row.instanceCode)"
                    >{{scope.row.instanceCode}}</a>
                  </template>
                </el-table-column>
                <el-table-column prop="instanceName" label="元数据名称"></el-table-column>
                <el-table-column label="父类元数据代码">
                  <template slot-scope="scope">
                    <a
                      class="a-color"
                      @click="toMetaDataDetails(scope.row,scope.row.pInstanceId, scope.row.pInsClassifierId, scope.row.pInstanceCode)"
                    >{{scope.row.pInstanceCode}}</a>
                  </template>
                </el-table-column>
                <el-table-column prop="pInstanceName" label="父类元数据名称"></el-table-column>
                <el-table-column prop="belongSystem" label="所属系统"></el-table-column>
              </el-table>
              <div style="text-align: center;  padding:10px 0 100px;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="infoTotal"
                ></el-pagination>
              </div>
              <!-- </el-card> -->
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import oneColumnVerticalTable from "../md/components/oneColumnVerticalTable";
import { get } from "@/utils/request";
export default {
  components: { oneColumnVerticalTable },
  // props: {
  //   dsInstanceId: {type: String , default: ''}
  // },
  data() {
    return {
      keyMsg: "",
      flagCollect: false, // 收藏
      activeName: "1",
      bIsQuoteVisible: true,
      classifierId: false,
      collapseActiveNames: ["1", "2", "3", "4", "5"], // Collapse 折叠面板是否打开
      // 代码项
      codeTotal: 0,
      codeTableData: [],
      codeCurrentPage: 1,
      codePageSize: 10,
      quoteTableData: [],
      // 概要信息
      baseInfoData: [
        // { key: "元数据代码:", value: "instanceCode" },
        // { key: "元数据名称:", value: "instanceName" },
        // { key: "上下文路径:", value: "namespace" },
        // { key: "生效时间:", value: "startTime" }
      ],
      // 基本属性
      arrtTableData: [],
      // 业务属性
      businessTableData: [],
      // 管理属性
      manageTableData: [],
      // 技术属性
      tecTableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 10,
      infoTotal: 0,
      dsInstanceId: "",
      // 禁用收藏
      Collodisabled: false
    };
  },
  methods: {
    // 标准查询页 传参
    getDisId(id) {
      this.dsInstanceId = id;
      this.Collodisabled = true;
    },
    // 切换tab
    handleClick(val) {
      val === "close"
        ? (this.collapseActiveNames = ["1", "2", "3", "4", "5"])
        : "";
      this.pageSize = 10;
      this.codePageSize = 10;
      this.codeCurrentPage = 1;
      this.currentPage = 1;
    },
    handleChange(val) {},
    // 收藏
    handleCollect() {
      if (!this.flagCollect) {
        get("/ds/collectStandard", {
          standardId: this.dsInstanceId
        }).then(res => {
          if (res.code === 10000 && res.success) {
            this.$message.success(res.message);
            this.flagCollect = !this.flagCollect;
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        get("/ds/cancelCollectStandard", {
          standardId: this.dsInstanceId
        }).then(res => {
          if (res.code === 10000 && res.success) {
            this.flagCollect = !this.flagCollect;

            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        });
      }
      // get("/home/collection/cancelDsCollection", {
      //   colId: this.dsInstanceId
      // }).then(res => {
      //   if (res.code === 10000 && res.success) {
      //     this.$message.success(res.message);
      //   } else {
      //     this.$message.error(res.message);
      //   }
      // });
    },
    // 跳转到元数据详情
    toMetaDataDetails(row, id, classifierId, title) {
      console.log(row, id, classifierId, title);
      this.$router.push({
        name: "impactAndLineageDetail",
        params: {
          id: id,
          classifierId: classifierId,
          _title: title
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getReferenceInfos();
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getReferenceInfos();
    },
    handleCodeSizeChange(val) {
      this.codePageSize = val;
      this.getCodeTable();
    },
    handleCodeCurrentChange(val) {
      this.codeCurrentPage = val;
      this.getCodeTable();
    },
    // 获取标准信息内容
    getMsg(val) {
      console.log(this.dsInstanceId, "dsInstanceId");
      get(`/ds/details/${this.dsInstanceId}`).then(res => {
        console.log(res, "001");
        if (res.code === 10000 && res.success) {
          this.flagCollect = res.data.favorite;
          const data = res.data;
          this.baseInfoData = [
            { key: "元数据代码:", value: data.code },
            { key: "元数据名称:", value: data.cnName },
            { key: "上下文路径:", value: "namespace" },
            { key: "生效时间:", value: data.createTime }
          ];
          data.attributes.map(item => {
            switch (item.attrGroup) {
              case "基本属性":
                this.arrtTableData.push({ key: item.name, value: item.value });
                break;
              case "业务属性":
                this.businessTableData.push({
                  key: item.name,
                  value: item.value
                });
                break;
              case "技术属性":
                this.tecTableData.push({ key: item.name, value: item.value });
                break;
              case "管理属性":
                this.manageTableData.push({
                  key: item.name,
                  value: item.value
                });
                break;
            }
          });
          console.log(res, 22);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取引用信息
    getReferenceInfos() {
      get("/ds/listDsReferenceInfos", {
        dsInstanceId: this.dsInstanceId,
        pageCurrent: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.infoTotal = res.data.total;
          this.quoteTableData = res.data.records;
        }
        console.log(res, 111);
      });
    },
    // 代码项
    getCodeTable() {
      get("/ds/listDsRefCodeIndexInfos", {
        dsInstanceId: this.dsInstanceId,
        keyword: this.keyMsg,
        pageCurrent: this.codeCurrentPage,
        pageSize: this.codePageSize
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.codeTableData = res.data.records;
          this.codeTotal = res.data.total;
          this.keyMsg = "";
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 接收tree传过来的 类型
    getClassifierId(val) {
      if (val === "CommonCodeInfoItem") {
        this.classifierId = true;
        this.getCodeTable();
      } else {
        this.classifierId = false;
        this.Collodisabled = true;
      }
    }
  },
  mounted() {},
  created() {
    if (this.$route.params.classifierId === "CommonCodeInfoItem") {
      this.classifierId = true;
    }
    if (this.$route.params.id) {
      this.dsInstanceId = this.$route.params.id;
      this.getMsg();
      this.getReferenceInfos();
      this.getCodeTable();
    }
  }
};
</script>


<style lang="scss" scoped>
//外层card容器样式
@import "./../../styles/dq/main-card-table.scss";
.re-position {
  top: 80px !important;
}
.standard-details {
  //收藏
  .sq-collect {
    font-size: 14px;
    position: absolute;
    right: 30px;
    top: 35px;
    height: 30px;
    text-align: right;
    cursor: pointer;
    display: inline-block;
    z-index: 8;
    .star-on {
      display: inline-block;
      color: #f4ea29;
    }
  }
  .total {
    border-bottom: 1px solid #dcdee2;
    margin-bottom: 10px;
    // line-height: 40px;
    height: 40px;
    padding: 0 15px;
    font-size: 14px;
    .el-input {
      width: 200px;
      height: 32px;
      float: right;

      input {
        height: 32px;
      }
    }
    /deep/ .el-input__inner {
      height: 32px;
    }
    /deep/ .el-input__icon {
      line-height: 32px;
    }
  }
  /deep/ .el-collapse-item__wrap {
    border-bottom: unset;
  }
}
</style>
