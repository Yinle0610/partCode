<template>
  <div class="p10 version-detail tableNoPadding">
    <el-card ref="versioCcontrast" v-if="contrastShow" class="card-box" shadow="hover">
      <version-contrast
        ref="contrast"
        :basicTableList="basicTableList"
        :featList="featList"
        @backDetail="getChildFunc"
      ></version-contrast>
    </el-card>
    <el-card ref="versionDetail" v-else class="card-box" shadow="hover">
      <div class="version-detail_header">
        <el-button @click="handleBack" class="edit-back">返回</el-button>
      </div>
      <div class="version mb20">
        <div class="right-title">
          <i class="line"></i>版本信息
        </div>
        <div class="version-box" v-loading="basicLoading">
          <li>版本编号：{{basicMsg.verName?basicMsg.verName:''}}</li>
          <li>是否基线：{{basicMsg.verType ? basicMsg.verType === '1' ? '是' : '否':''}}</li>
          <li>版本描述：{{basicMsg.verDesc?basicMsg.verDesc:''}}</li>
        </div>
      </div>
      <div class="version">
        <div class="right-title secondPart">
          <i class="line"></i>元数据信息
        </div>
        <div class="metadata-table">
          <div style="overflow: hidden">
            <el-form style="float:right;">
              <el-form-item
                label="元数据类型："
                label-width="100px"
                style="width:230px;float: left;"
                class="search-keyword"
              >
                <el-select
                  v-model="versionForm.propSearch"
                  @change="handleSearch"
                  placeholder="请选择"
                  size="mini"
                  clearable
                >
                  <el-option
                    :label="item.classifierName"
                    :value="item.classifierId"
                    v-for="item in selectList"
                    :key="item.classifierId"
                    align="center"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="width:200px;float: left;margin-left:5px;">
                <el-input
                  v-model.trim="versionForm.keyword"
                  @keyup.enter.native="handleSearch"
                  placeholder="元数据名称/元数据代码"
                  size="mini"
                >
                  <i slot="suffix" class="el-icon-search" @click="handleSearch"></i>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <div v-loading="tableLoading">
            <el-table
              size="small"
              :data="tableData"
              border
              :header-cell-style="{'background': '#f8f8f9', 'color': '#606266'}"
            >
              <el-table-column show-overflow-tooltip prop="code" label="元数据代码"></el-table-column>
              <el-table-column show-overflow-tooltip prop="name" label="元数据名称"></el-table-column>
              <el-table-column show-overflow-tooltip prop="classifierName" label="元数据类型"></el-table-column>
              <el-table-column show-overflow-tooltip prop="path" label="上下文路径"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="详情"
                    placement="bottom"
                    :enterable="false"
                  >
                    <el-button type="text" @click="goDetail(scope.row)">
                      <svg-icon icon-class="preview" class="preview"></svg-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="比对"
                    placement="bottom"
                    :enterable="false"
                  >
                    <el-button @click="handleContrast(scope.row)" class="add-btn" type="text">
                      <svg-icon icon-class="contrast2" class="preview"></svg-icon>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align: center;margin-top: 10px;">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageCurrent"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { get, parseAjaxResponse } from "@/utils/request";
import versionContrast from "./versionContrast";
export default {
  name: "",
  components: {
    versionContrast
  },
  data() {
    return {
      // 比对是否展示
      contrastShow: false,
      basicLoading: true,
      tableLoading: true,
      basicMsg: {},
      versionForm: {
        keyword: "", // 关键字
        propSearch: "" // 搜索类型
      },
      tableData: [],
      selectList: [], // 类型下拉数据
      pageCurrent: 1,
      pageSize: 10,
      total: 0,
      sureSearch: true,
      basicTableList: [],
      featList: [],
      searched: false // 是否查询了，避免未查询翻页时把查询条件带上
    };
  },
  watch: {
    versionForm: {
      handler(newVal, oldVal) {
        console.log('change')
        this.searched = false;
      },
      deep: true
    }
  },
  methods: {
    handleBack() {
      this.$router.push({
        name: "versionManagement"
      });
    },
    // 搜索
    handleSearch() {
      if (this.versionForm.propSearch) {
        this.pageCurrent = 1;
        this.searched = true;
        this.getTableData();
      } else {
        this.$message.warning("请选择搜索的元数据类型！");
      }
    },
    // 初次进来获取所有展示数据
    getAllMsg() {
      get("/mdVersion/versionDetail", {
        verId: this.verId
      }).then(res => {
        parseAjaxResponse(res, () => {
          this.basicMsg = res.data;
          this.basicLoading = false;
          let records = res.data.instances;
          this.total = records.total;
          this.tableData = records.records;
          this.tableLoading = false;
        });
      });
      get("/mdVersion/queryVersionClassifier", {
        verId: this.verId
      }).then(res => {
        parseAjaxResponse(res, () => {
          this.selectList = res.data;
        });
      });
    },
    handleSizeChange(val) {
      this.pageCurrent = 1;
      this.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getTableData();
    },
    getTableData() {
      let params = {};
      if (this.searched) {
        params = {
          classifierId: this.versionForm.propSearch
            ? this.versionForm.propSearch
            : null,
          current: this.pageCurrent,
          keyword: this.versionForm.keyword ? this.versionForm.keyword : null,
          size: this.pageSize,
          verId: this.verId
        };
      } else {
        params = {
          classifierId: this.versionForm.propSearch
            ? this.versionForm.propSearch
            : null,
          current: this.pageCurrent,
          size: this.pageSize,
          verId: this.verId
        };
      }
      this.tableLoading = true;
      get("/mdVersion/queryMDClassifierVersion", params).then(res => {
        parseAjaxResponse(res, () => {
          this.tableData = res.data.records.map(item => {
            return item.metadataVO;
          });
          this.tableLoading = false;
          this.total = res.data.total;
        });
      });
    },
    // 详情页跳转
    goDetail(item) {
      console.log(item);
      // get("/mdVersion/queryVersionMetadata", {
      //   instanceId: item.id,
      //   verId: this.basicMsg.verId
      // }).then(res => {
      //   parseAjaxResponse(res, () => {
      //     // console.log(res, "详情");
      //     let msg = res.data;
      this.$router.push({
        name: "impactAndLineageDetail", // '元数据'详情页
        params: {
          _title: item.name,
          id: item.id,
          classifierId: item.classifierId,
          verId: this.basicMsg.verId,
          from: "version"
        }
      });
      //   });
      // });
    },
    // 比对
    handleContrast(item) {
      console.log(item);
      this.contrastShow = true;
      let params = {
        instanceId: item.id,
        oldVerId: this.basicMsg.verId
      };
      get("/mdVersion/comparisonVersionMetadata", params).then(res => {
        parseAjaxResponse(res, () => {
          let basicTableList = [
            {
              title: "版本说明",
              newVal: "最新元数据",
              oldVal: this.basicMsg.verName
            },
            {
              title: "元数据代码",
              newVal: "",
              oldVal: ""
            },
            {
              title: "元数据类型",
              newVal: "",
              oldVal: ""
            },
            {
              title: "元数据名称",
              newVal: "",
              oldVal: ""
            },
            {
              title: "上下文路径",
              newVal: "",
              oldVal: ""
            }
          ];
          res.data.baseList.map(item => {
            // 比对   基本信息数据
            switch (item.code) {
              case "instanceCode":
                basicTableList.map(i => {
                  if (i.title === "元数据代码") {
                    i.newVal = item.newValue;
                    i.oldVal = item.oldValue;
                    i.different = item.different;
                    return i;
                  }
                });
                break;
              case "instanceName":
                basicTableList.map(i => {
                  if (i.title === "元数据名称") {
                    i.newVal = item.newValue;
                    i.oldVal = item.oldValue;
                    i.different = item.different;
                    return i;
                  }
                });
                break;
              case "path":
                basicTableList.map(i => {
                  if (i.title === "上下文路径") {
                    i.newVal = item.newValue;
                    i.oldVal = item.oldValue;
                    i.different = item.different;
                    return i;
                  }
                });
                break;
              case "classifierId":
                basicTableList.map(i => {
                  if (i.title === "元数据类型") {
                    i.newVal = item.newValue;
                    i.oldVal = item.oldValue;
                    i.different = item.different;
                    return i;
                  }
                });
                break;
            }
          });
          // 比对的基础信息
          this.basicTableList = basicTableList;
          // 比对的属性信息
          this.featList = res.data.featList;
          this.featList.unshift({
            attName: "版本说明",
            compareValue: "最新元数据",
            attValue: this.basicMsg.verName
          });
          // 总汇
          let oldLowerTableList = [];
          let newLowerTableList = [];
          // 旧的数据  传 instanceId  verId
          get("/mdVersion/versionSummary", {
            verId: this.basicMsg.verId,
            instanceId: item.id
          }).then(res => {
            parseAjaxResponse(res, () => {
              console.log(res);
              oldLowerTableList = res.data;
              // 最新数据  传 instanceId
              get("/mdVersion/versionSummary", {
                instanceId: item.id,
                verId: null
              }).then(res => {
                parseAjaxResponse(res, () => {
                  console.log(res);
                  newLowerTableList = res.data;
                  if (newLowerTableList.length > 0) {
                    newLowerTableList.map(newVal => {
                      oldLowerTableList.map(oldVal => {
                        if (newVal.classifierId === oldVal.classifierId) {
                          oldVal.oldCount = newVal.count;
                          oldVal.different = true;
                          return oldVal;
                        }
                      });
                    });
                  } else {
                    oldLowerTableList.map(oldVal => {
                      oldVal.different = false;
                      oldVal.newCount = oldVal.count;
                      return oldVal;
                    });
                  }
                  console.log(oldLowerTableList, "oldLowerTableList");
                  oldLowerTableList.unshift({
                    classifierName: "版本说明",
                    newCount: "最新元数据",
                    count: this.basicMsg.verName
                  });
                  this.$nextTick(() => {
                    let params = {
                      basicTableList: this.basicTableList,
                      featList: this.featList,
                      lowerTableList: oldLowerTableList
                    };
                    // 滚动条滑动到顶部
                    let material = this.$refs.versioCcontrast.$el;
                    material.scrollTo({
                      top: 0,
                      behavior: "smooth" // 平滑滚动
                    });
                    this.$refs.contrast.getAllMsg(params, this.basicMsg);
                  });
                });
              });
            });
          });
        });
      });
    },
    getChildFunc() {
      this.contrastShow = false;
      this.$nextTick(() => {
        // 滚动条滑动到顶部
        let material = this.$refs.versionDetail.$el;
        material.scrollTo({
          top: 0,
          behavior: "smooth" // 平滑滚动
        });
      });
    }
  },
  activated() {
    // this.verId = this.$route.params.id ? this.$route.params.id : "";
    // this.getAllMsg();
  },
  created() {
    this.verId = this.$route.params.id ? this.$route.params.id : "";
    this.getAllMsg();
  }
};
</script>

<style lang="scss" scoped>
.version-detail {
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
      padding: 0 25px;
      .el-form-item {
        margin-bottom: 10px;
      }
    }
  }
  .version-detail_header {
    padding: 0 0px 15px 5px;
    border-bottom: 1px solid #ebeef5;
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