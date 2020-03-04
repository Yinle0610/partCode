<template>
  <div class="mm-left">
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>数据标准</span>
      </div>
      <div>
        <el-input
          @keyup.enter.native="searchMsg"
          @change="searchMsg"
          placeholder="输入关键字进行过滤"
          v-model="kWord"
        >
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-tree
          v-show="!show"
          :style="{height:this.$route.name === 'manualMapping' ?  'calc(100% - 190px)': ''}"
          accordion
          :props="props"
          :load="loadNode"
          node-key="id"
          ref="tree"
          lazy
          :highlight-current="true"
          @node-click="handleNodeClick"
          @node-expand="handleNodeClick"
          @node-collapse="handleNodeClick"
          :render-content="renderContent"
        ></el-tree>
        <el-tree
          v-show="show"
          :style="{height:this.$route.name === 'manualMapping' ?  'calc(100% - 190px)': ''}"
          :props="secondProps"
          ref="treeSecond"
          :highlight-current="true"
          default-expand-all
          :data="treeFilterData"
          @node-click="handleSecondNodeClick"
          :render-content="renderSecondContent"
        ></el-tree>
      </div>
      <div class="left-chose">
        已选择：
        <span :title="choseMsg" class="chose-sty" style @click="toStandardQuery">{{choseMsg}}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
import { get } from "@/utils/request";
export default {
  name: "left",
  data() {
    return {
      filterText: "",
      treeList: [],
      props: {
        label: "instanceName",
        children: "children",
        isLeaf: "isLeaf"
      },
      secondProps: {
        label: "instanceName",
        children: "childItem"
      },
      nodeId: 0,
      sNodeId: 0,
      choseMsg: "",
      Breadcrumb: [],
      add: true,
      typeId: "",
      treeFilterData: [],
      kWord: ""
    };
  },
  methods: {
    searchMsg() {
      get("/ds/fuzzySearchTreeInfo", {
        keyword: this.kWord
      }).then(res => {
        this.treeFilterData = res.data;
      });
    },
    // 点击搜索后的tree
    handleSecondNodeClick(node, a, b) {
      this.Breadcrumb = [];
      switch (a.level) {
        case 1:
          this.Breadcrumb.push(a.data.instanceName);
          break;
        case 2:
          this.Breadcrumb.push(a.parent.data.instanceName);
          this.Breadcrumb.push(a.data.instanceName);
          break;
        case 3:
          this.Breadcrumb.push(a.parent.parent.data.instanceName);
          this.Breadcrumb.push(a.parent.data.instanceName);
          this.Breadcrumb.push(a.data.instanceName);
          break;
        case 4:
          this.Breadcrumb.push(a.parent.parent.parent.data.instanceName);
          this.Breadcrumb.push(a.parent.parent.data.instanceName);
          this.Breadcrumb.push(a.parent.data.instanceName);
          this.Breadcrumb.push(a.data.instanceName);
          break;
        case 5:
          this.Breadcrumb.push(a.parent.parent.parent.parent.data.instanceName);
          this.Breadcrumb.push(a.parent.parent.parent.data.instanceName);
          this.Breadcrumb.push(a.parent.parent.data.instanceName);
          this.Breadcrumb.push(a.parent.data.instanceName);
          this.Breadcrumb.push(a.data.instanceName);
          break;
      }
      this.$emit("sendBreadcrumb", this.Breadcrumb);
      this.$emit("sendInstanceId", {
        standardId: node.instanceId,
        standardTypeId: this.typeId
      });
      if (node.childItem.length === 0) {
        this.choseMsg = node.instanceName;
        this.choseId = node.instanceId;
        this.choseCode = node.instanceCode;
        this.$emit("getChoseMsg", node);
        this.$emit("showDetail", node);
      } else {
        this.$emit("changeDetailShow", {
          display: false,
          id: node.instanceId,
          classifierId: this.typeId
        });
      }
    },
    handleNodeClick(node, a, b) {
      let len = this.Breadcrumb.length - 1;
      if (a.level === 1) {
        this.Breadcrumb = [];
        this.add = true;
        this.Breadcrumb.push(node.instanceName);
        if (node.classifierId === "CommonCodeDataStandard") {
          this.typeId = "CommonCodeInfoItem";
        } else {
          this.typeId = "";
        }
      } else {
        // 无子节点  第一次点击
        if (node.leafCount === 0 && this.add) {
          this.add = false;
          this.Breadcrumb.push(node.instanceName);
        } else if (node.leafCount > 0) {
          // 有子节点
          this.add = true;
          this.Breadcrumb.splice(a.level - 1, len);
          this.Breadcrumb.push(node.instanceName);
        } else {
          // 无字节点  不是第一次点
          this.Breadcrumb.splice(this.Breadcrumb.length - 1, 1);
          this.Breadcrumb.push(node.instanceName);
          this.$emit("changeDetailShow", {
            display: true,
            id: node.instanceId,
            classifierId: this.typeId
          });
        }
      }
      this.$emit("sendBreadcrumb", this.Breadcrumb);
      this.$emit("sendInstanceId", {
        standardId: node.instanceId,
        standardTypeId: this.typeId
      });
      if (node.leafCount === 0) {
        this.choseMsg = node.instanceName;
        this.choseId = node.instanceId;
        this.choseCode = node.instanceCode;
        this.$emit("getChoseMsg", node);
        this.$emit("showDetail", node);
      } else {
        this.$emit("changeDetailShow", {
          display: false,
          id: node.instanceId,
          classifierId: this.typeId
        });
      }
    },
    // 自定义tree 图标 文字
    renderSecondContent(h, params) {
      let sText = params.data.instanceName;
      let iconType = "";
      if (params.data.childItem.length > 0) {
        iconType = "icon icon-folder";
      } else {
        iconType = "icon icon-idcard";
      }
      return h(
        "span",
        {
          class: "tree-node"
        },
        [
          h("div", {
            class: iconType,
            style: {
              marginRight: "4px"
            }
          }),
          h("span", sText)
        ]
      );
    },
    renderContent(h, params) {
      let sText = params.data.instanceName;
      let iconType = "";
      if (params.data.leafCount > 0) {
        iconType = "icon icon-folder";
      } else {
        iconType = "icon icon-idcard";
      }
      return h(
        "span",
        {
          class: "tree-node"
        },
        [
          h("div", {
            class: iconType,
            style: {
              marginRight: "4px"
            }
          }),
          h("span", sText)
        ]
      );
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.instanceName.indexOf(value) !== -1;
    },
    // tree懒加载
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.node = node;
        this.resolve = resolve;
        get("/ds/listTreeInfo", {
          nodeId: this.sNodeId
        }).then(res => {
          if (res.code === 10000 && res.success === true) {
            res.data.map(item => {
              if (item.leafCount === 0) {
                item.isLeaf = true;
              } else {
                item.isLeaf = false;
              }
              return item;
            });
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        let params = {
          nodeId: node.data.instanceId
        };
        get("/ds/listTreeInfo", params).then(res => {
          if (res.code === 10000 && res.success === true) {
            res.data.map(item => {
              if (item.leafCount === 0) {
                item.isLeaf = true;
              } else {
                item.isLeaf = false;
              }
              return item;
            });
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    // 跳转---标准查询
    toStandardQuery() {
      this.$router.push({
        name: "standardDetails",
        params: {
          id: this.choseId,
          _title: this.choseCode
        }
      });
    },
    clearChose() {
      this.choseId = "";
      this.choseCode = "";
      this.choseMsg = "";
      this.$emit("getChoseMsg", "");
    }
  },
  computed: {
    show() {
      if (this.kWord === "") {
        return false;
      } else {
        return true;
      }
    }
  },
  created() {}
};
</script>

<style lang='scss'>
@import "../../../styles/treeIcon.scss";
.mm-left {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 320px;
  height: calc(100% - 82px);
  margin-right: 10px;
  .el-card {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .title {
      font-size: 16px;
      border-bottom: 1px solid #e8eaec;
      padding: 0 10px 10px 10px;
      font-weight: bold;
      margin-top: 7px;
      margin-bottom: 10px;
    }
  }
  .el-tree {
    position: relative;
    cursor: default;
    background: #fff;
    color: #606266;
    position: absolute;
    top: 140px;
    right: 0px;
    left: 0;
    padding: 0 16px;
    height: calc(100% - 167px);
    overflow-y: auto;
    font-size: 14px;
  }
  .left-chose {
    position: absolute;
    font-size: 16px;
    line-height: 46px;
    font-weight: bold;
    color: #7e7e7e;
    bottom: 0;
    left: 0;
    padding: 0 16px;
    width: 100%;
    border-top: 1px solid #ebeef5;
    span {
      color: #2d8cf0;
      cursor: pointer;
      width: 210px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      float: right;
    }
  }
}
</style>