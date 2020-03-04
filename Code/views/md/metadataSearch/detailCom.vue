<template>
  <div class="metadataDetail">
    <div style="height: 100%;background:#fff;">
      <div slot="header" class="clearfix card-title">
        <div class="header-btn">
          <el-button class="back-btn" @click="handleBack"><&nbsp;返回</el-button>
        </div>
      </div>
      <!-- 头部按钮 -->
      <div class="btn-group">
        <el-button
          v-permission="'MD_SEARCH_EDIT'"
          style="margin-right: 10px;"
          @click="handleEdit"
          class="basic-button fl"
          type="warning"
        >
          <i class="dataTable-icon edit"></i>编辑
        </el-button>
        <!-- <el-button
          @click="deleteItem"
          class="basic-button fl"
          style="margin:0 10px;"
          type="danger"
        >
          <i class="dataTable-icon del"></i>删除
        </el-button>-->
        <el-dropdown v-if="showAnalyzeBtn" class="fl" @command="handleBlood">
          <el-button
            class="basic-button fr"
            style="width: 100px;padding: 0;padding-left: 28px"
            type="primary"
          >
            <i class="dataTable-icon blood"></i>
            <span>血缘</span>
            <svg-icon icon-class="xian"></svg-icon>
            <svg-icon icon-class="more"></svg-icon>
          </el-button>
          <el-dropdown-menu slot="dropdown" trigger="click">
            <el-dropdown-item :command="'showImpact'">影响分析</el-dropdown-item>
            <el-dropdown-item :command="'showLineage'">血统分析</el-dropdown-item>
            <!-- <el-dropdown-item :command="'full'">全链(Ref&Usage)</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
        <div v-show="classifierId === 'Table'" class="quality-rate">
          <span class="quality-rate_label">质量评分：</span>
          <el-rate v-model="qualityValue" disabled text-color="#ff9900"></el-rate>
        </div>
      </div>
      <!-- 详细信息部分 -->
      <!-- <div style="height: 100%;padding: 0 20px;">
        <div class="basic-content">
          <metadata-info
            :instanceId="instanceId"
            :oBaseInfo="oBaseInfo"
            :oAttsinfo="oAttsinfo"
            :childInfos="childInfos"
            :problems="problems"
            :relStandards="relStandards"
          ></metadata-info>
        </div>
      </div>-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="元数据信息" name="first">
          <div class="metadata-info">
            <metadataInfo :oBaseInfo="oBaseInfo" :oAttsinfo="oAttsinfo"></metadataInfo>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-for="(item, index) in tabLists"
          :key="index"
          :item="item"
          :classifierId="item.classifierId"
          :relateType="item.relateType"
          :roleId="item.roleId"
          :num="index"
          :label="showTabName(item)"
        >
          <el-table
            border
            show-header
            :data="item.tableData"
            :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
            :cell-style="{padding:'0'}"
            style="width: 100%"
          >
            <el-table-column
              v-for="(i, num) in item.tableHeader"
              sortable
              :prop="i.prop === 'instanceCode'?'instanceCode':i.prop"
              :show-overflow-tooltip="i.label==='存储过程内容'?false:true"
              :key="num"
              :label="i.label"
              :width="i.label==='存储过程内容'?560:''"
            >
              <template slot-scope="scope">
                <a
                  class="a-color"
                  v-if="i.prop === 'instanceCode'"
                  @click="clickToMetaDetails(scope.row.instanceId, scope.row.classifierId, scope.row.instanceName)"
                >{{scope.row.instanceCode}}</a>
                <p
                  v-else
                  :class="i.label==='存储过程内容'?'overHidden':''"
                >{{scope.row[i.prop]}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160">
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
                  content="编辑"
                  placement="bottom"
                  :enterable="false"
                  v-permission="'MD_EDIT'"
                >
                  <el-button type="text" @click="goEdit('main', scope.row)">
                    <svg-icon icon-class="editor" class="editor"></svg-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="影响分析"
                  placement="bottom"
                  :enterable="false"
                  v-permission="'MD_ANALYSIS'"
                  v-if="scope.row.classifierId==='Table'||scope.row.classifierId==='Schema'||scope.row.classifierId==='View'||scope.row.classifierId==='Column'"
                >
                  <el-button type="text" @click="goInfluence2(scope.row)">
                    <svg-icon icon-class="anaalysis2" class="anaalysis2"></svg-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="血统分析"
                  placement="bottom"
                  :enterable="false"
                  v-permission="'MD_ANALYSIS'"
                  v-if="scope.row.classifierId==='Table'||scope.row.classifierId==='Schema'||scope.row.classifierId==='View'||scope.row.classifierId==='Column'"
                >
                  <el-button type="text" size="small" @click="goAncestry2(scope.row)">
                    <svg-icon icon-class="blood2" class="blood2"></svg-icon>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { get, parseAjaxResponse } from "@/utils/request";
import deleteDialog from "./../../ds/deleteDialog/deleteDialog";
import MetadataInfo from "./metaCollapse";
export default {
  name: "",
  components: {
    deleteDialog,
    MetadataInfo
  },
  data() {
    return {
      // 质量评分
      qualityValue: 3.6,
      // 元数据Id
      instanceId: "",
      // 元数据编码
      code: "",
      // 元数据类型
      classifierId: "",
      // 传过来的表格行信息
      metaItem: "",
      // 元数据信息-基本信息
      oBaseInfo: {
        aTableData: [],
        bLoading: true
      },
      // 元数据信息-属性信息
      oAttsinfo: {
        aTableData: [],
        bLoading: true
      },
      // 元数据信息-属性信息
      childInfos: {
        aTableData: [],
        bLoading: true
      },
      // 元数据信息-属性信息
      problems: {
        aTableData: [],
        bLoading: true
      },
      // 元数据信息-属性信息
      relStandards: {
        aTableData: [],
        bLoading: true
      },
      showAnalyzeBtn: false,
      tabLists: [],
      activeName: ""
    };
  },
  watch: {},
  methods: {
    handleClick(tab, $event) {
      console.log(tab.$attrs);
      console.log(tab, $event);
      let item = tab.$attrs;
      let params = {
        instanceId: this.instanceId,
        relateClassifierId: item.classifierId,
        relateType: item.relateType ? item.relateType : "",
        roleId: item.roleId ? item.roleId : "",
        code: "",
        keyword: "",
        pageCurrent: "",
        pageSize: ""
      };
      get("/md/relate/info", params).then(res => {
        parseAjaxResponse(res, () => {
          this.tabLists[item.num].tableHeader = res.extras.headers;
          this.tabLists[item.num].tableData = res.data.records;
          this.tabLists[item.num].total = res.data.total;
        });
      });
    },
    // 返回
    handleBack() {
      this.$parent.$parent.$parent.showMain("main");
    },
    // 编辑元数据
    handleEdit() {
      // this.$parent.$parent.$parent.showEdit(this.metaItem, 'metadataDetail')
      this.$parent.$parent.$parent.showEdit(this.metaItem, "metadataDetail");
    },
    // 删除元数据
    deleteItem() {},
    handleBlood(command) {
      console.log(command);
      if (command === "showImpact") {
        this.$router.push({
          name: "impactAnalysisCanvas",
          params: {
            id: this.instanceId,
            _title: this.code,
            classifierId: this.classifierId
          }
        });
      } else if (command === "showLineage") {
        this.$router.push({
          name: "lineageAnalysisCanvas",
          params: {
            id: this.instanceId,
            _title: this.code,
            classifierId: this.classifierId
          }
        });
      }
    },
    getAllMsg(id, code, classifierId, metaItem) {
      this.instanceId = id;
      this.code = code;
      let arr = ["Table", "Schema", "View", "Column"];
      this.showAnalyzeBtn = arr.includes(classifierId);
      this.classifierId = classifierId;
      this.metaItem = metaItem;
      this.getMsg();
    },
    getMsg() {
      this.oBaseInfo.bLoading = true;
      this.oAttsinfo.bLoading = true;
      this.childInfos.bLoading = true;
      this.problems.bLoading = true;
      this.relStandards.bLoading = true;
      get("/md/detail/" + this.instanceId).then(res => {
        console.log(res.data, "resdata");
        if (res.code === 10000 && res.success === true) {
          const data = res.data;
          //   // 属性信息
          let attrInfos = data.attributes;
          //   // 子类信息
          let childInfos = data.relateMetadataList;
          //   // 数据问题
          let problems = data.problems;
          //   // 标准数据
          let relStandards = data.relStandards.records;
          this.oBaseInfo.aTableData = [
            {
              key: "元数据代码:",
              value: res.data.code
            },
            {
              key: "元数据名称:",
              value: res.data.name
            },
            {
              key: "元数据类型:",
              value: res.data.classifierName
            },
            {
              key: "上下文路径:",
              value: res.data.path
            },
            {
              key: "生效时间:",
              value: res.data.startTime
            }
          ];
          this.sCode = data.code;
          this.oBaseInfo.bLoading = false;
          this.oAttsinfo.aTableData = attrInfos;
          this.oAttsinfo.bLoading = false;
          this.childInfos = {
            aTableData: childInfos,
            bLoading: false
          };
          console.log(problems, "problems");
          this.problems.aTableData = problems;
          this.problems.bLoading = false;
          this.relStandards = {
            aTableData: relStandards,
            bLoading: false
          };
        } else {
          //   this.$message.error(res.message)
        }
      });
      this.getTabs();
    },
    getTabs() {
      get("/md/relate/classifiers", {
        instanceId: this.instanceId,
        classifierId: this.classifierId
      }).then(res => {
        parseAjaxResponse(res, () => {
          console.log(res.data, "000");
          this.tabLists = res.data.map(item => {
            item.tableHeader = [];
            item.tableData = [];
            item.total = [];
            return item;
          });
        });
      });
    },
    // 点击tab页获取对应数据
    getTabsData() {
      get("/md/relate/info", {}).then(res => {
        parseAjaxResponse(res, () => {
          console.log(res.data, "msg");
        });
      });
    },
    // 用于动态tab头添加相关字样
    showTabName(item) {
      let relateType = item.relateType;
      let classifierName = item.classifierName;
      if (relateType === "Dep") {
        classifierName = "相关的" + classifierName;
      }
      return classifierName;
    },
    // 点击跳转详情页
    goDetail(item) {
      // this.bshowDeltail = true;
      // this.detailItem = item;
      // this.detailClassifier = item.classifierId;
      // this.detailId = item.instanceId;
      // this.oBaseInfo2.bLoading = true;
      // this.oAttsinfo2.bLoading = true;
      // this.getChildClassifiers2(this.detailId, this.detailClassifier);
      // this.getMsg(item);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dropdown-menu .el-dropdown-menu__item {
  margin: 0 !important;
  line-height: 32px !important;
  padding: 0 10px !important;
  height: 32px !important;
}
.metadataDetail {
  height: 100%;
  padding: 5px;
  overflow: auto;
  /deep/ .el-dialog__header {
    border-bottom: 1px solid rgba(228, 228, 228, 1);
    font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC";
    height: 55px;
    color: rgba(51, 51, 51, 0.647058823529412);
    font-weight: 650;
    line-height: 55px;
    padding: 0 20px;
    .el-dialog__title {
      color: inherit;
    }
  }
  /deep/ .el-rate__item {
    vertical-align: unset;
  }
  .dialog_button {
    text-align: center;
    margin: 0 -20px;
    border-top: 1px solid rgba(228, 228, 228, 1);
    padding-top: 20px;
    margin-top: 50px;
  }
  .btn-group {
    overflow: hidden;
    padding: 10px 20px;
    .quality-rate {
      float: right;
      height: 34px;
      line-height: 34px;
      .quality-rate_label {
        float: left;
      }
    }
    .quality-rate >>> .el-rate {
      float: right;
      height: 34px;
      line-height: 34px;
    }
  }
}
.metadataDetail::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}
.metadataDetail::-webkit-scrollbar-track {
  background: none;
  border-radius: 2px;
}
.metadataDetail::-webkit-scrollbar-thumb {
  background: rgb(239, 239, 239);
  border-radius: 10px;
}
.metadataDetail::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
.card-title {
  height: 55px;
  padding: 10px 20px;
  .header-btn {
    border-bottom: 1px solid #e4e4e4;
    padding-bottom: 10px;
  }
}
.card-title-content {
  font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC";
  font-weight: 650;
  font-style: normal;
  font-size: 20px;
  line-height: 55px;
  color: rgba(51, 51, 51, 0.647058823529412);
  text-align: center;
}
.basic-button {
  height: 34px;
  width: 85px;
  padding: 0 15px 0 35px;
  position: relative;
}
.dataTable-icon {
  position: absolute;
  display: inline-block;
  width: 24px;
  height: 24px;
  left: 7px;
  top: 3px;
}
.blood {
  background: url(../../../../src/assets/images/commonIcon/blood-icon.png)
    no-repeat;
  background-size: 100%;
}
.edit {
  background: url(../../../../src/assets/images/commonIcon/edit.png) no-repeat;
  background-size: 100%;
}
.del {
  background: url(../../../../src/assets/images/commonIcon/del.png) no-repeat;
  background-size: 100%;
}
.add {
  background: url(../../../../src/assets/images/commonIcon/add.png) no-repeat;
  background-size: 100%;
}
.basic-content {
  height: calc(100% - 80px);
  // width: calc(100% - 80px);
  // overflow: auto;
  // position: absolute;
  /deep/ .el-collapse {
    border: unset;
    // margin-top: 30px;
  }
  /deep/ .el-collapse-item__header {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
    color: #666666;
    // padding: 0 20px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  /deep/ .el-collapse-item__wrap {
    border-bottom: unset;
  }
  /deep/ .el-collapse-item__content {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    color: #666666;
    // padding: 20px 60px;
    padding: 20px 0px;
  }
  .basic-content_button {
    height: 34px;
    width: 85px;
    padding: 0;
    position: relative;
  }
}
.right-code {
  overflow: hidden;
  .code-button {
    float: left;
  }
  .code-search_input {
    float: right;
    /deep/ .el-input__inner {
      height: 38px;
    }
  }
}
.code-table {
  margin-top: 10px;
  .code-pagination {
    margin-top: 10px;
    text-align: center;
  }
}
.back-btn {
  height: 34px;
  padding: 0;
  width: 74px;
}
.delete-dialog {
  /deep/ .el-dialog__body {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
}
.dialog-btn {
  text-align: center;
  border-top: 1px solid #e8ebed;
  padding: 10px;
}
.addSome-left {
  width: 48%;
  float: left;
  /deep/ .el-textarea__inner {
    min-height: 540px !important;
  }
}
.addSome-title {
  float: left;
  height: 40px;
  line-height: 40px;
}
.overflow {
  overflow: hidden;
}
.addSome-right {
  width: 48%;
  float: right;
}
.addSomDialog {
  // width: 80%;
  /deep/ .el-dialog__body {
    overflow: hidden;
  }
}
.mb10 {
  margin-bottom: 10px;
}
.el-dropdown-menu {
  padding: 0;
}
/deep/ .el-dropdown-menu__item {
  margin: 0;
  line-height: 24px;
  padding: 0 10px;
}
.el-tabs {
  padding: 10px 20px;
}
.metadataDetail /deep/ {
  .el-tabs__item {
    height: 46px;
    width: 100px;
    line-height: 46px;
    text-align: center;
    padding: 0px;
  }
}
</style>