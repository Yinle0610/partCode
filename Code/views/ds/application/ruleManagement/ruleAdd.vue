<template>
  <div class="rule-add">
    <!-- <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <el-button size="small" @click="handleCancel" style="float: right;">取消</el-button>
        <el-button
          @click="handleSave"
          size="small"
          type="primary"
          :disabled="saveBtn"
          style="float: right;margin-right:8px;"
        >保存</el-button>
      </div> -->
      <div class="card-body">
        <!-- <el-collapse v-model="activeName">
          <el-collapse-item name="first">
            <template slot="title">
              <i class="line"></i>基本信息
            </template> -->
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="110px"
              style="width:70%;margin-top:20px;"
            >
              <el-form-item label="规则名称：" class="is-required" prop="instanceName">
                <el-input
                  v-model.trim="ruleForm.instanceName"
                  placeholder="请输入规则中文名称..."
                ></el-input>
              </el-form-item>
              <el-form-item label="规则分类：" prop="namespace">
                <el-select
                  ref="classifySelect"
                  class="ruleClassifying"
                  clearable
                  style="width: 100%;"
                  v-model="ruleForm.namespace"
                  placeholder="请选择"
                  @clear="handleClear"
                >
                  <el-option :value="classifyValue" style="height: auto">
                    <el-tree
                      accordion
                      style="margin: 0 -20px;"
                      :data="data"
                      @node-click="nodeClick"
                      :props="defaultProps"
                      :highlight-current="true"
                      :default-expand-all="defaultExpand"
                      :render-content="renderContent"
                    ></el-tree>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                v-for="(item, index) in inputList"
                :key="index"
                :label="`${item.attName}：`"
                :class="[item.nullable?'':'is-required']"
                :prop="item.nullable?'':item.attStore"
              >
                <el-select
                  v-if="item.columnType === 'combobox'"
                  v-model="ruleForm[item.attStore]"
                  placeholder="请选择"
                >
                  <el-option v-for="(val, num) in item.selectList" :key="num" :label="val.textField" :value="val.valueField"></el-option>
                </el-select>
                <el-input
                  v-else-if="item.columnType === 'textfield'"
                  type="textarea"
                  v-model.trim="ruleForm[item.attStore]"
                ></el-input>
                <el-input v-else v-model="ruleForm[item.attStore]"></el-input>
              </el-form-item>
            </el-form>
          <!-- </el-collapse-item>
        </el-collapse> -->
      </div>
      <el-dialog append-to-body title="提示" :visible.sync="showSames">
        <template slot="title">
          <i class="el-icon-info" style="color: rgb(92,182,255); margin-right: 5px;"></i>提示
        </template>
        <p>在以下目录下发现相同标准名称：</p>
        <ul class="dialog-ul">
          <li v-for="(item, index) in sameList" :key="index">
            {{item.path}}
            <el-button @click="toSeeDetail(item)" type="text">查看</el-button>
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showSames = false">取 消</el-button>
          <el-button type="primary" @click="sureAdd">确 定</el-button>
        </span>
      </el-dialog>
    <!-- </el-card> -->
  </div>
</template>

<script>
import { get, post } from "@/utils/request";
export default {
  props: {
    ruleMSg: Object
  },
  data() {
    const checkInstanceName = (rule, value, callback) => {
      if (this.ruleForm.instanceName === "") {
        callback(new Error("请输入规则名称"));
      } else {
        let params = {
          instanceName: this.ruleForm.instanceName,
          parentId: this.parentId
        };
        get("/ds/application/rule/checkStandardNameIsExist", params).then(
          res => {
            console.log(res);
            // this.addItem = false
            if (res.code === 10000 && res.success) {
              if (res.data.length > 0) {
                // 不同目录下有重名的
                this.showSames = true;
                this.sameList = res.data;
                callback();
              } else {
                // 无重复
                this.showSames = false;
                this.sameList = []
                callback();
              }
            } else {
              // 相同目录下有重名的
              callback(new Error(res.message));
            }
          }
        );
      }
    };
    return {
      showSames: false,
      // 防止连续点击保存按钮
      saveBtn: false,
      activeName: "first",
      data: [],
      defaultProps: {
        children: "childNodes",
        label: "nodeName"
      },
      ruleForm: {
        instanceName: "", //  规则名称
        namespace: "" //  规则分类
      },
      rules: {
        instanceName: [{ validator: checkInstanceName, trigger: "blur" }],
        // eName: [{ required: true, message: "请选择规则分类", trigger: "blur" }],
        namespace: [
          { required: true, message: "请选择规则分类", trigger: "blur" }
        ]
      },
      inputList: [],
      classifyValue: "",
      namespace: "",
      enKey: "",
      ruleName: "",
      sendNode: null,
      firstNode: null,
      nodeList: [],
      defaultExpand: false,
      selectClear: false,
      addNode: false,
      parentId: "",
      sameList: [],
      addItem: false
    };
  },
  watch: {
    ruleForm: {
      handler: function(val, oldVal) {
        // console.log(val)
        // this.inputItem = val
        // this.inputData = this.inputItem.attrValue;
        this.ruleName = this.ruleForm.instanceName;
      },
      deep: true
    },
    ruleName() {
      console.log("cange");
      get("/ds/bizTerm/queryHomologousEnVocabularies", {
        cnTerm: this.ruleName
      }).then(res => {
        // console.log(res,"30")
        console.log(this.enKey);
        this.ruleForm[this.enKey] = res.data[0];
        console.log(this.ruleForm);
      });
    },
    ruleMSg: {
      handler: function(val, oldVal) {
        // this.ruleName = this.ruleForm.instanceName;
        console.log(val, oldVal, 'ruleMSg')
      },
      deep: true
    }
  },
  methods: {
    getParMsg(val) {
      // this.getRuleSelect();
      // this.getBasicMsg();
      let msg = val.msg;
      console.log(msg, "mg");
      console.log(val, "par");
      if (val.msg.node.data) {
        this.parentId = val.msg.node.data.id;
      }
      if (msg) {
        this.namespace = msg.namespace;
        this.ruleForm.namespace = msg.namespaceCN;
        // this.nodeList = msg.node
        this.nodeList = val.nodeList;
        console.log(val);
        this.selectClear = true;
      }
    },
    handleCancel() {
      console.log(this.nodeList);
      this.closeNavTag(this.$route);
      this.$router.push({ name: "ruleManagement" });
      // this.$router.push({
      //           name: "ruleManagement",
      //           params: { node: this.sendNode, firstNode: this.firstNode, nodeList: this.nodeList }
      //         });
    },
    // 获取规则分类列表
    getRuleSelect() {
      get("/ds/application/rule/getRuleClassifierInfos").then(res => {
        console.log(res, "data");
        this.data = res.data;
      });
    },
    // 点击节点
    nodeClick(data, node, component) {
      if (this.selectClear) {
        this.nodeList = [];
        this.selectClear = false;
      }
      this.parentId = data.nodeId;
      this.addNode = true;
      console.log(data);
      console.log(node, "node");
      node.data.id = node.data.nodeId;
      node.data.name = node.data.nodeName;
      node.data.notetype = "metadata";
      this.nodeList.push(node);
      if (node.level === 1) {
        this.firstNode = node;
      }
      this.sendNode = node;
      this.namespace = data.namespace;
      this.ruleForm.namespace = data.nameContext;
      if (node.isLeaf) {
        this.$refs.classifySelect.blur();
      }
    },
    // 获取基本信息  编辑输入框
    getBasicMsg() {
      get("/ds/application/rule/listFeatureByClassifierId").then(res => {
        console.log(res, "111");
        this.inputList = [];
        this.ruleForm.name = res.data.name;
        res.data.map(item => {
          if (item.attCode === "EnglishName") {
            this.enKey = item.attStore;
          }
          this.ruleForm[item.attStore] = ''
          if (item.columnType === "combobox") {
            get("/ds/listStandardAttrComboboxInfos", {
              columnTypeValue: item.datatypeId
            }).then(res => {
              console.log(res, "99");
              item.selectList = res.data;
              this.inputList.push(item);
              if (!item.nullable) {
                this.rules[item.attStore] = [
                  {
                    required: true,
                    message: `请选择${item.attName}`,
                    trigger: "change"
                  }
                ];
              }
              res.data.map((i, index) => {
                if (i.textField === '待发布') {
                  this.ruleForm[item.attStore] = i.valueField
                }
              })
            });
          } else {
            this.inputList.push(item);
            if (!item.nullable) {
              this.rules[item.attStore] = [
                {
                  required: true,
                  message: `请输入${item.attName}`,
                  trigger: "blur"
                }
              ];
            }
          }
        });
        // this.rules = Object.assign({}, this.rules)
        this.ruleForm = Object.assign({}, this.ruleForm)
      });
    },
    // 保存
    handleSave() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.addItem = true;
          if (this.sameList.length > 0) {
            this.showSames = true;
          } else {
            this.showSames = false
            this.sureAdd()
          }
        } else {
          return false;
        }
      });
    },
    // 发送保存请求
    sendSaveMsg() {
      this.saveBtn = true;
      let sendMsg = {};
      for (let a in this.ruleForm) {
        if (this.ruleForm[a]) {
          console.log(a, this.ruleForm[a]);
          sendMsg[a] = this.ruleForm[a];
        }
      }
      sendMsg.namespace = this.namespace;
      post("/ds/application/rule/createRuleBaseInfo", sendMsg).then(res => {
        if (res.code === 10000 && res.success) {
          // console.log(res)
          this.$message.success(res.message);
          // this.closeNavTag(this.$route);
          // this.saveBtn = false;
          let params = {
            nodeList: this.nodeList,
            addNode: this.addNode
          }
          this.$parent.$parent.setTreePosition(params)

          // this.$router.push({
          //   name: "ruleManagement",
          //   params: {
          //     // node: this.sendNode,
          //     // firstNode: this.firstNode,
          //     nodeList: this.nodeList,
          //     addNode: this.addNode
          //   }
          // });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 关闭nav上的tag路由
    closeNavTag(view) {
      this.$store.dispatch("delVisitedViews", view).then(views => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("professionalTerms");
          }
        }
      });
    },
    // 判断是否为当前页面
    isActive(route) {
      return route.path === this.$route.path;
    },
    // 自定义tree 图标 文字
    renderContent(h, params) {
      // console.log(params);
      let sText = params.data.nodeName;
      let iconType = "icon icon-folder";
      // if (params.data.notetype === "metadata") {
      //   iconType = "icon icon-" + params.data.classifierId;
      // } else {
      //   iconType = "icon icon-" + params.data.notetype;
      // }
      // if (params.data.notetype === "class") {
      //   iconType = "icon icon-" + params.data.classifierId;
      // }
      return h(
        "span",
        {
          class: "tree-node"
        },
        [
          h("div", {
            class: iconType,
            style: {
              marginRight: "4px",
              display: "inline-block",
              backgroundSize: "15px 15px",
              width: "15px",
              height: "15px",
              float: "unset",
              fontWeight: "unset"
            }
          }),
          h("span", sText)
        ]
      );
    },
    handleClear() {
      this.nodeList = [];
    },
    // 详情
    toSeeDetail(item) {
      this.showSames = false
      this.$emit('hiddenDialog')
      let row = item;
      row.instanceName = item.name;
      row.instanceId = item.id;
      this.$router.push({
        name: "ruleDetail",
        params: { id: item.id, _title: item.name, row: item }
      });
    },
    // 确定新增
    sureAdd() {
      if (this.addItem) {
        this.sendSaveMsg();
      }
      this.showSames = false;
      this.addItem = false;
    }
  },
  created() {
    this.getRuleSelect();
    this.getBasicMsg();
    // let msg = this.$route.params.msg;
    // console.log(msg, "mg");
    // console.log(this.$route.params, "par");
    // if (this.$route.params.msg.node.data) {
    //   this.parentId = this.$route.params.msg.node.data.id;
    // }
    // if (msg) {
    //   this.namespace = msg.namespace;
    //   this.ruleForm.namespace = msg.namespaceCN;
    //   // this.nodeList = msg.node
    //   this.nodeList = this.$route.params.nodeList;
    //   console.log(this.$route.params);
    //   this.selectClear = true;
    // }
  }
};
</script>
<style lang="scss" scoped>
//外层card容器样式
@import "./../../../../styles/dq/main-card-table.scss";
@import "../../../../styles/treeIconScoped";
$color-grey-light: #e0e0e0;
$collapse-header-size: 14px;
.rule-add {
  padding: 12px;
  /deep/ .el-collapse {
    border: unset;
    margin-top: 20px;
  }
  /deep/ .el-collapse-item__header {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    height: 30px;
    font-style: normal;
    font-size: $collapse-header-size;
    color: #666666;
    // padding: 0 20px;
    border-bottom: unset;
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
    overflow: hidden;
    padding: 0 40px;
  }
  /deep/ .el-tabs__item {
    height: 46px;
    width: 106px;
    line-height: 46px;
    text-align: center;
    padding: 0px;
  }
  /deep/ .el-tabs__nav-wrap::after {
    background-color: unset;
  }
  /deep/ .el-tabs__content {
    padding: 0 15px;
  }
  .el-card {
    padding: 25px 60px;
    /deep/ .el-card__header {
      padding: 20px 20px 12px 20px;
    }
    /deep/ .el-card__body {
      .card-body {
        .el-tabs {
          .el-tabs__header {
            margin-left: 15px;
            .el-tabs__nav-wrap::after {
              content: "";
              position: absolute;
              left: 0;
              bottom: 0;
              width: 100%;
              height: 0 !important;
              z-index: 1;
            }
          }
          .el-tabs__content {
            .relationship {
              .title {
                border-bottom: 1px solid $color-grey-light;
                font-size: 17px;
                padding: 20px 10px;
              }
              .button {
                padding: 10px 10px;
                .el-button--mini {
                  font-size: 13px;
                  .svg-icon {
                    position: relative;
                  }
                }
                .zengjia {
                  padding: 4px 10px 5.5px 10px;
                  .svg-icon {
                    width: 15px;
                    height: 15px;
                    top: 1px;
                  }
                }
                .shanchu {
                  padding: 4px 10px 6.5px 9px;
                  .svg-icon {
                    width: 16px;
                    height: 16px;
                    top: 1px;
                  }
                }
              }
              .table {
                margin-top: 15px;
                /deep/ .tableClass {
                  border-right: none !important;
                }
              }
            }
            .confess-account {
              .title {
                border-bottom: 1px solid $color-grey-light;
                font-size: 16px;
                padding: 20px 15px;
              }
              .found {
              }
            }
          }
        }
      }
      .ruleClassifying {
        /deep/ .el-select-dropdown__item {
          padding: 0;
        }
      }
    }
    .ruleClassifying {
      /deep/ .el-select-dropdown__item {
        padding: 0;
      }
    }
  }
}
.editor {
  .el-tooltip__popper {
    max-width: 360px;
  }
}
.confess-add {
  cursor: pointer;
}
.confess-creator {
  // width: 189px;
  // height: 58px;
  width: 130px;
  line-height: 40px;
  height: 40px;
  border: 1px solid rgb(48, 65, 86);
  float: left;
  margin-left: 10px;
  position: relative;
  text-align: center;
  padding-left: 10px;
  /deep/ .el-button {
    // font-size: 18px;
    margin-top: -2px;
    width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
  }
  .creator-icon {
    height: 22px;
    width: 22px;
    display: block;
    line-height: 55px;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 10px;
  }
}

.el-select-dropdown__item.selected {
  font-weight: unset;
}
.rule-add /deep/ {
  .el-dialog__wrapper .el-dialog .el-dialog__header {
    border: unset !important;
  }
  .el-dialog__wrapper .el-dialog .el-dialog__body {
    padding: 10px;
  }
  .el-dialog__wrapper .el-dialog .el-dialog__footer {
    text-align: center;
    padding: 20px;
    border: unset !important;
  }
  .el-dialog__body {
    padding: 0 20px;
  }
}
.dialog-ul {
  padding: 0;
  margin: 0;
  li {
    list-style-type: none;
  }
  .el-button {
    margin-left: 10px;
  }
}
.line {
  height: 100%;
  width: 4px;
  background: #579ef3;
  margin-right: 15px;
}
</style>