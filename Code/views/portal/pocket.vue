<template>
  <!-- 我的收藏 -->
  <div style="padding:13px;">
    <el-card shadow="hover" class="pocket-container">
      <el-tabs v-model="wPocket.activeName" @tab-click="handleClick">
        <el-tab-pane :label="`数据标准(${dsTotal})`" name="first">
          <el-table
            :data="tableDataDs"
            style="width: 100%"
            :header-cell-style="{background:'#f8f8f9'}"
            v-loading="wPocket.bLoading"
            size="mini"
          >
            <el-table-column prop="instanceCode" label="标准编号">
              <!-- <template slot-scope="scope">
                <el-button @click="toDetails(scope.row)" type="text">{{scope.row.instanceCode}}</el-button>
              </template> -->
            </el-table-column>
            <el-table-column :show-overflow-tooltip='showToolTip' prop="instanceName" label="标准名称"></el-table-column>
            <el-table-column :show-overflow-tooltip='showToolTip' prop="classifierName" label="标准类别"></el-table-column>
            <el-table-column :show-overflow-tooltip='showToolTip' prop="path" label="上下文路径">
              <!-- <template slot-scope="scope">
                <span class="line4">{{scope.row.businessDef}}</span>
              </template> -->
            </el-table-column>
            <el-table-column :show-overflow-tooltip='showToolTip' prop="collectTime" label="收藏时间"></el-table-column>
            <el-table-column prop="stdStatus" label="标准状态">
              <template slot-scope="scope">
                <el-tag class="pocket-tags">{{scope.row.stdStatus}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remindWay2" label="操作" align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                  <el-button @click="todetail(scope.row)" type="text" size="small" >
                    <svg-icon icon-class="preview" class="preview"></svg-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="取消收藏" placement="bottom">
                  <el-button  @click='cancelDsCollection(scope.row)' type="text" size="small" >
                    <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                  </el-button>
                </el-tooltip>
                <!-- <el-button @click="cancelDsCollection(scope.row)" type="text">取消收藏</el-button>
                <el-button @click="todetail(scope.row)" type="text">详情</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="`知识文档(${docTotal})`" name="second">
          <el-table
            :data="tableDataDoc"
            style="width: 100%"
            :header-cell-style="{background:'#f8f8f9'}"
            v-loading="wPocket.bLoading"
            size="mini"
          >
            <el-table-column prop="title" label="文档标题" width="280">
              <template slot-scope="scope">
                <el-button @click="toDocDetails(scope.row)" type="text">{{scope.row.title}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="creatorName" label="作者" width="260"></el-table-column>
            <el-table-column prop="createDate" label="发布时间"></el-table-column>
            <el-table-column prop="collectionDate" label="收藏时间"></el-table-column>
            <el-table-column prop="status" label="文档状态">
              <template slot-scope="scope">
                <el-tag
                class="pocket-tags"
                  :type="scope.row.status === 0? 'success' :'warning'"
                >{{scope.row.status === 0 ? "已发布" : "已删除"}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remindWay2" label="操作" align="center">
              <template slot-scope="scope" >
                <el-tooltip class="item" effect="dark" content="取消收藏" placement="bottom">
                  <el-button  @click='cancelKnoCollection(scope.row)' type="text" size="small" >
                    <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                  </el-button>
                </el-tooltip>
                <!-- <el-button @click="cancelKnoCollection(scope.row)" type="text">取消收藏</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageCurrent"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="text-align:center;margin-top:15px;"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import { get } from "@/utils/request";
export default {
  name: 'MY_POCKET',
  data() {
    return {
      wPocket: {
        bLoading: false,
        activeName: "first"
      },
      tableData: [],
      dsKeyWord: "",
      docKeyWord: "",
      pageCurrent: 1,
      pageSize: 10,
      total: 0,
      docTotal: 0,
      dsTotal: 0,
      tableDataDs: [],
      tableDataDoc: [],
      showToolTip: true
    };
  },
  methods: {
    // toDetails(row) {
    //   console.log(row);

    //   this.$router.push({
    //     name: "standardDetails",
    //     params: {
    //       id: row.instanceId,
    //       _title: row.instanceCode
    //     }
    //   });
    // },
    toDocDetails(row) {
      console.log(row);
      this.$router.push({
        name: "knoDetail",
        params: { docId: row.docId, spaceType: row.spaceType, privilege: row.privilege, isControlEdit: true }
      });
    },
    handleClick(val) {
      if (val.name === "first") {
        this.total = this.dsTotal;
      } else {
        this.total = this.docTotal;
      }
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    // 获取我的收藏 数据标准
    getMyCollectDs() {
      get("/home/collection/listMyCollectDs", {
        keyword: this.dsKeyWord,
        pageCurrent: this.pageCurrent,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.tableDataDs = res.data.records;
          this.dsTotal = res.data.total;
          this.total = res.data.total;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取我的收藏 知识文档
    getMyCollectKnoDoc() {
      get("/home/collection/listMyCollectKnoDoc", {
        keyword: this.docKeyWord,
        pageCurrent: this.pageCurrent,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.tableDataDoc = res.data.records;
          this.docTotal = res.data.total;
          this.total = res.data.total;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    todetail(item) {
      console.log(item)
      if (item.classifierId === "RuleInfoItem") { // 规则
        this.$router.push({
          name: 'ruleDetail',
          params: {
            id: item.instanceId,
            row: item,
            _title: item.instanceName
          }
        })
      } else if (item.classifierId === "DimentsionInfoItem") { // 维度
        this.$router.push({
          name: 'dimensionDetails',
          params: {
            id: item.instanceName,
            detailId: item.instanceId,
            _title: item.instanceName,
            row: item
          }
        })
      } else if (item.classifierId === "BaseIndexInfoItem" || item.classifierId === "DeriveIndexInfoItem" || item.classifierId === "CalculateIndexInfoItem" || item.classifierId === "RuleIndexInfoItem") {
        // 指标
        this.$router.push({
          name: "indexManagementDetails",
          params: {
            id: item.instanceId,
            classifierId: item.classifierId,
            _title: item.instanceName
          }
        });
      } else if (item.classifierId === "MasterDataInfoItem") { // 主数据
        this.$router.push({
          name: "masterDataDetails",
          params: {
            id: item.instanceId,
            classifierId: item.classifierId,
            _title: item.instanceName,
            headerTitle: item.instanceName
          }
        });
      } else if (item.classifierId === 'PublicCodeInfoItem') { // 公共代码
        this.$router.push({
          name: 'commonCode',
          params: {
            classifierId: item.classifierId,
            id: item.instanceId
          }
        })
      } else if (item.classifierId === "BizTermInfoItem") {
        this.$router.push({
          name: "professionalDetail",
          params: {
            id: item.instanceId,
            _title: item.instanceName,
            name: item.instanceName
          }
        })
      } else {
        console.log(item.classifierId)
      }
    },
    // 取消数据标准  收藏
    cancelDsCollection(item) {
      console.log(item)
      get("/home/collection/cancelDsCollection", {
        instanceId: item.instanceId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.$message.success(res.message);
          this.getMyCollectDs();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 取消知识文档  收藏
    cancelKnoCollection(item) {
      get("/home/collection/cancelKnoCollection", {
        colId: item.collectionId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.$message.success(res.message);
          this.getMyCollectKnoDoc();
        } else {
          this.$message.error(res.message);
        }
      });
    }
  },
  created() {
    this.showToolTip = true
    this.getMyCollectDs();
    this.getMyCollectKnoDoc();
  },
  activated() {
    this.showToolTip = true
    this.getMyCollectDs();
    this.getMyCollectKnoDoc();
  },
  deactivated() {
    this.showToolTip = false
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
@import "../../styles/variables";
@import "../../styles/treeIcon";
@import "src/styles/dq/main-card-table.scss";
.pocket-container {
  .item{
    .preview,.deleteRed{
      width:22px;
      height:22px;
    }
  }
  .el-card__body {
    padding: 20px 15px;
    .el-tabs {
      .el-tabs__active-bar {
        width: 85px;
      }
      .el-tabs__item {
        width: 108px;
        text-align: center;
      }
      .el-tabs__content {
        #pane-second {
        }
      }
    }
  }
}
.pocket-tags {
  // display: inline-block;
  // height: 22px;
  // line-height: 22px;
  // margin: 2px 4px 2px 0;
  // padding: 0 8px;
  // border: 1px solid #e8eaec;
  // border-radius: 3px;
  // background: #f7f7f7;
  // font-size: 12px;
  // vertical-align: middle;
  // opacity: 1;
  // overflow: hidden;
  // cursor: pointer;
  height: 22px;
  line-height: 22px;
}
.line4 {
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
