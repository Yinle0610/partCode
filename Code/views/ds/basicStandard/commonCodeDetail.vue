<template>
  <div class="code-detail right-basic">
    <div style="height: 100%;background:#fff;">
      <div slot="header" class="clearfix card-title">
        <el-button class="back-btn" @click="handleBack">返回</el-button>
        <el-button
          @click="deleteItem"
          class="basic-button fr"
          style="margin-left:10px;"
          type="danger"
        >
          <i class="dataTable-icon del"></i>删除
        </el-button>
        <el-button @click="handleEdit" class="basic-button fr" style type="warning">
          <i class="dataTable-icon edit"></i>编辑
        </el-button>
        <el-dropdown class="fr" @command="handleBlood">
          <el-button
            class="basic-button fr"
            style="width: 85px;
                  padding: 0px 10px 0px 25px;"
            type="primary"
          >
            <i class="dataTable-icon blood"></i>关系
            <!-- <svg-icon icon-class="xian"></svg-icon>
            <svg-icon icon-class="more"></svg-icon>-->
          </el-button>
          <el-dropdown-menu slot="dropdown" trigger="click">
            <el-dropdown-item :command="'backward'">参考</el-dropdown-item>
            <el-dropdown-item :command="'forward'">应用</el-dropdown-item>
            <el-dropdown-item :command="'full'">全链</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div style="height: 100%;">
        <div class="basic-content">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1">
              <template slot="title">
                <i class="line"></i>基本信息
              </template>
              <div>
                <p>公共代码编号：{{basicMsg.code}}</p>
                <p>公共代码名称：{{basicMsg.name}}</p>
                <p v-for="(item, index) in basicMsg.attributes" :key="index">
                  <span>{{item.name}}：{{item.value ? item.value : '暂无数据'}}</span>
                </p>
              </div>
            </el-collapse-item>
            <el-collapse-item name="2">
              <template slot="title">
                <i class="line"></i>代码项信息
              </template>
              <div class="right-code">
                <div class="code-button">
                  <el-dropdown @command="handleCodeMsgAdd">
                    <el-button type="primary" class="basic-button">
                      <i class="dataTable-icon add"></i>新增
                    </el-button>
                    <el-dropdown-menu slot="dropdown" trigger="click" class="editorSe">
                      <el-dropdown-item :command="'addOne'">逐条添加</el-dropdown-item>
                      <el-dropdown-item :command="'addSome'">批量导入</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-button @click="deleteCodeItem" type="danger" class="basic-button">
                    <i class="dataTable-icon del"></i>删除
                  </el-button>
                </div>
                <div class="code-search_input">
                  <el-form style="width:300px;float:right;">
                    <el-form-item style="width:135px;float: left;" class="search-keyword">
                      <el-select clearable v-model="propSearch" placeholder="请选择搜索分类" size="mini">
                        <el-option
                          :label="item.title"
                          :value="item.selectVal"
                          v-for="item in addCodeForm"
                          :key="item.key"
                          align="left"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item style="width:160px;float: left;margin-left:5px;">
                      <el-input
                        v-model.trim="keyword"
                        @keyup.enter.native="handleSearch"
                        placeholder="请输入内容..."
                        size="mini"
                        clearable
                      >
                        <i slot="suffix" class="el-icon-search" @click="handleSearch"></i>
                      </el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="code-table">
                <el-table
                  :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                  ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  border
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column
                    :show-overflow-tooltip="showToolTip"
                    align="left"
                    type="selection"
                  ></el-table-column>
                  <el-table-column
                    v-for="(item, index) in addCodeForm"
                    :key="index"
                    sortable
                    :show-overflow-tooltip="showToolTip"
                    align="left"
                    :prop="item.key"
                    :label="item.title"
                  >
                    <template slot-scope="scope">
                      <el-button
                        v-if="item.key==='string3'"
                        @click="toDetails(scope.row)"
                        type="text"
                      >{{scope.row[item.key]}}</el-button>
                      <span v-else>{{scope.row[item.key]}}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="code-pagination">
                  <el-pagination
                    @current-change="handleCurrentChange"
                    background
                    layout="prev, pager, next"
                    :total="total"
                  ></el-pagination>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item class="usageCollapse" name="3">
              <template slot="title">
                <i class="line"></i>应用
              </template>
              <div class="code-table">
                <el-table
                  :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                  ref="multipleTable"
                  :data="usageTableData"
                  tooltip-effect="dark"
                  border
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column
                    sortable
                    :show-overflow-tooltip="showToolTip"
                    align="left"
                    label="标准名称"
                    prop="toInstanceName"
                  >
                    <!-- <template slot-scope="scope">
                      <el-button
                        @click="goDetail(scope.row)"
                        type="text"
                      >{{ scope.row.toInstanceName }}</el-button>
                    </template> -->
                  </el-table-column>
                  <el-table-column
                    :show-overflow-tooltip="showToolTip"
                    sortable
                    align="left"
                    prop="toInstanceClassifierName"
                    label="标准类型"
                  ></el-table-column>
                  <el-table-column
                    :show-overflow-tooltip="showToolTip"
                    align="left"
                    prop="toInstanceCode"
                    sortable
                    label="标准代码"
                  >
                    <template slot-scope="scope">
                      <el-button
                        @click="goDetail(scope.row)"
                        type="text"
                      >{{ scope.row.toInstanceCode }}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="left"
                    :show-overflow-tooltip="showToolTip"
                    prop="toPath"
                    label="上下文路径"
                  ></el-table-column>
                  <el-table-column
                    align="left"
                    prop="relationshipName"
                    sortable
                    label="关系类型"
                    :show-overflow-tooltip="showToolTip"
                  ></el-table-column>
                </el-table>
                <div class="code-pagination">
                  <el-pagination
                    @current-change="changeUsageCurrent"
                    background
                    layout="prev, pager, next"
                    :total="usageTotal"
                  ></el-pagination>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog
      title="批量导入"
      @close="clearDialog"
      :destroy-on-close="true"
      class="addSomDialog"
      width="70%"
      :visible.sync="addSomeDialog"
    >
      <div class="overflow">
        <div class="addSome-left">
          <div class="overflow mb10">
            <span class="addSome-title">原始输入区：</span>
            <span class="fr">
              分隔符：
              <el-input style="width: 100px;" placeholder="请输入" v-model="separator"></el-input>
            </span>
          </div>
          <el-input
            type="textarea"
            :rows="20"
            placeholder="1.请输入要批量导入的内容,每个代码项独占一行
2.输入格式为[代码项取值+分隔符+代码项名称]
3.举例(逗号分隔符)如下：
1,小学
2,初中
3,高中
4,中专"
            v-model="textarea"
          ></el-input>
        </div>
        <div class="addSome-right">
          <div class="addSome-title mb10">预览区：</div>
          <el-table
            :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
            ref="multipleTable"
            :data="addSomeTableData"
            tooltip-effect="dark"
            border
            style="width: 100%"
          >
            <el-table-column
              v-for="(item, index) in addCodeForm"
              :key="index"
              sortable
              :show-overflow-tooltip="showToolTip"
              align="left"
              :prop="item.key"
              :label="item.title"
            ></el-table-column>
          </el-table>
          <el-pagination
            class="mt10 text-center"
            background
            @current-change="handleAddSomeCurrentChange"
            layout="prev, pager, next, total"
            :total="addSomeTotal"
          ></el-pagination>
        </div>
      </div>
      <div class="dialog_button" style="text-align: center;">
        <el-button type="primary" :disabled="addSomeBtn" @click="addSome">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="新增代码项"
      @close="clearDialog"
      :destroy-on-close="true"
      :visible.sync="addDialog"
    >
      <el-form
        :model="addForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item
          v-if="codeNumInput"
          prop="codeNum"
          class="is-required"
          :key="codeNumInput.columnName"
          :label="`${codeNumInput.attrName}：`"
        >
          <el-input :placeholder="`请输入${codeNumInput.attrName}`" v-model.trim="addForm.codeNum"></el-input>
        </el-form-item>
        <dynamic-input
          @changeInputValue="changeInputValue"
          v-for="(item, index) in dynamicInput"
          :key="index"
          :bindItem="item"
        ></dynamic-input>
      </el-form>
      <div class="dialog_button" style="text-align: center;">
        <el-button type="primary" :disabled="addOne" @click="submitForm('ruleForm')">立即创建</el-button>
      </div>
    </el-dialog>
    <!-- 编辑公共代码 -->
    <el-dialog
      title="编辑公共代码"
      @close="clearEditDialog"
      :destroy-on-close="true"
      :visible.sync="editDialog"
    >
      <el-form
        :model="editCodeForm"
        :rules="editRules"
        ref="editRuleForm"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item
          v-for="(item, index) in addInput"
          :key="index"
          :label="item.label"
          :prop="item.key"
        >
          <el-input v-if="item.type === 'textfield'" v-model="editCodeForm[item.key]"></el-input>
          <el-select
            v-if="item.type==='treedirectory'"
            ref="nameSpaceSelect"
            class="ruleClassifying"
            clearable
            style="width: 100%;"
            v-model="editCodeForm.namespace"
            placeholder="请选择"
          >
            <el-option :value="classifyValue" style="height: auto">
              <el-tree
                accordion
                style="margin: 0 -20px;"
                :data="data"
                @node-click="nodeClick"
                :props="defaultProps"
                :highlight-current="true"
                :render-content="renderAddContent"
              ></el-tree>
            </el-option>
          </el-select>
          <el-input
            v-if="item.type === 'textarea'"
            type="textarea"
            v-model="editCodeForm[item.key]"
          ></el-input>
          <el-select
            v-if="item.type === 'combobox'"
            v-model="editCodeForm[item.key]"
            placeholder="请选择状态"
          >
            <el-option
              v-for="(item, index) in item.dropList"
              :key="index"
              :label="item.textField"
              :value="item.valueField"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog_button" style="text-align: center;">
        <el-button type="primary" @click="submitEditForm('editRuleForm')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 删除提示 -->
    <el-dialog :visible.sync="deleteDialog" class="delete-dialog" title="删除提示" width="50%">
      <delete-dialog ref="deleteMenuDialog" :combinationShow="combinationShow"></delete-dialog>
      <div class="dialog-btn">
        <el-button type="primary" @click="handleDelete">确定</el-button>
      </div>
    </el-dialog>
    <!-- 名字校验 -->
    <div class="checkSame">
      <el-dialog title="提示" :visible.sync="showSames">
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
          <el-button type="primary" @click="sendFinalItem">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { get, post, postByJson } from "@/utils/request";
import deleteDialog from "../deleteDialog/deleteDialog";
import { generateLineageTitle } from "@/utils";
import { loading } from "@/utils/layer";
import dynamicInput from "./dynamicInput";
export default {
  name: "",
  components: {
    deleteDialog,
    dynamicInput
  },
  data() {
    var validateCodeNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入公共代码项取值!"));
      } else {
        let reg = /^[0-9a-zA-Z]+$/;
        let test = reg.test(value);
        console.log(test);
        get("/ds/public/queryExistSamePublicCodeItemVal", {
          newValue: value,
          publicCodeInfoItemId: this.commonCodeItemId
        }).then(res => {
          console.log(res);
          // if(res.data)
          if (res.code === 10000 && res.success) {
            if (res.data) {
              // this.$message.error('取值重复')
              callback(new Error("公共代码项取值重复，请修改!"));
            } else {
              if (test) {
                callback();
              } else {
                callback(
                  new Error("只允许英文字母或阿拉伯数字，不允许输入中文!")
                );
              }
            }
          } else {
            this.$message.error(res.message);
          }
        });
      }
    };
    // 校验名称是否重复
    const checkInstanceName = (rule, value, callback) => {
      if (this.editCodeForm.instanceName === "") {
        callback(new Error(`请输入${this.name_label}`));
      } else {
        let params = {
          instanceId: this.commonCodeItemId,
          instanceName: this.editCodeForm.instanceName,
          parentId: this.parentId
        };
        get("/ds/public/checkStandardNameIsExist", params).then(res => {
          console.log(res);
          if (res.code === 10000 && res.success) {
            if (res.data.length > 0) {
              // 不同目录下有重名的
              this.showSames = true;
              this.sameList = res.data;
              callback();
            } else {
              // 无重复
              this.showSames = false;
              this.sameList = [];
              callback();
            }
          } else {
            // 相同目录下有重名的
            callback(new Error(res.message));
          }
        });
      }
    };
    return {
      checkName: checkInstanceName,
      addOne: false,
      addSomeBtn: false,
      separator: "-",
      addSomeDialog: false,
      deleteDialog: false,
      tableHeaders: [],
      loading: false,
      choseCode: false,
      activeNames: ["1", "2", "3"],
      keyword: "",
      basicMsg: {},
      tableData: [],
      data: [],
      addSomeTableData: [],
      allAddSomeTableData: [],
      addForm: {
        // codeNum: "",
        codeNum: "",
        // codeMean: "",
        // codeName: "",
        instanceName: "",
        string1: "",
        string2: "",
        string3: "",
        string4: "",
        string5: "",
        string6: "",
        string7: "",
        string8: "",
        string9: "",
        string10: "",
        string11: "",
        string12: ""
      },
      addSomeTotal: 0,
      rules: {
        codeNum: [{ validator: validateCodeNum, trigger: "blur" }],
        codeMean: [
          { required: true, message: "请输入公共代码项含义", trigger: "blur" }
        ],
        codeName: [
          { required: true, message: "请输入公共代码项名称", trigger: "blur" }
        ]
        // instanceName
      },
      editDialog: false,
      editCodeForm: {
        parentId: "",
        instanceName: "",
        string1: "",
        string2: "",
        string3: "",
        string4: "",
        string5: "",
        string6: "",
        namespace: ""
      },
      editRules: {
        namespace: [
          { required: true, message: "请选择公共代码分类", trigger: "change" }
        ]
      },
      addDialog: false,
      total: 0,
      pageCurrent: 1,
      selectList: [], // 表头选择列表
      commonCodeItemId: "",
      defaultProps: {
        children: "childNodes",
        label: "nodeName"
      },
      namespace: "",
      classifyValue: "",
      StatusList: [], // 状态下拉数据
      addCodeForm: [],
      addCodeRule: {},
      codeAddInput: [],
      // 应用列表
      usageTableData: [],
      usageCurrent: 1,
      usageTotal: 0,
      deleteCodeMsg: false,
      addInput: [],
      oldNameSpace: "",
      CodeName: "",
      eKey: "",
      combinationShow: true,
      propSearch: "",
      textarea: "",
      addSomePageSize: 10,
      dynamicInput: null,
      codeNumInput: null,
      parentId: "",
      showSames: false,
      sameList: [],
      showToolTip: true
    };
  },
  watch: {
    separator() {
      if (this.separator === ",") {
        this.separator = "，";
      }
    },
    textarea() {
      this.allAddSomeTableData = [];
      this.addSomeTableData = [];
      this.addSomeTotal = 0;
      var s = this.textarea.split("\n");
      let dot = /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\，|\‘|\’|\；|\？|\“|\、|\。|\！|\【|\】]/g;
      let newText = null;
      let msg = [];
      let sendMsg = [];
      if (this.textarea !== "") {
        newText = s.map(item => {
          return item
            .trim()
            .replace(/\s+/g, this.separator ? this.separator : "，")
            .replace(dot, this.separator ? this.separator : "，");
        });
        newText.map(item => {
          if (item !== "") {
            msg.push(item.split(this.separator ? this.separator : "，"));
          }
        });
        msg.map(i => {
          let arr = {};
          arr.parentId = this.commonCodeItemId;
          this.addCodeForm.map((item, index) => {
            arr[item.key] = i[index];
          });
          sendMsg.push(arr);
        });
        this.textarea = newText.toString().replace(/,/g, "\n");
        this.allAddSomeTableData = sendMsg;
        this.addSomeTotal = sendMsg.length;
        if (sendMsg.length < 11) {
          this.addSomeTableData = sendMsg;
        } else {
          this.handleAddSomeCurrentChange(1);
        }
      }
    }
  },
  methods: {
    changeInputValue(val1, val2) {
      console.log("fz");
      console.log(val1, val2);
      this.addForm[val1] = val2;
    },
    addSome() {
      this.addSomeBtn = true;
      postByJson(
        "/ds/public/addBatchPublicCodeItems",
        this.allAddSomeTableData
      ).then(res => {
        // console.log(res, 'dididididi')
        if (res.code === 10000 && res.success) {
          this.$message.success(res.message);
          this.addSomeBtn = false;
          this.getAllTableMsg();
          this.addSomeTableData = [];
          this.allAddSomeTableData = [];
          this.addSomeDialog = false;
        } else {
          this.addSomeBtn = false;
          this.$message.error(res.message);
        }
      });
    },
    handleAddSomeCurrentChange(index) {
      var _start = (index - 1) * this.addSomePageSize;
      var _end = index * this.addSomePageSize;
      this.addSomeTableData = this.allAddSomeTableData.slice(_start, _end);
    },
    handleSearch() {
      if (this.propSearch !== "") {
        this.pageCurrent = 1;
        this.getAllTableMsg();
      } else {
        this.$message.warning("请选择搜索类别");
      }
    },
    // 下拉数据
    getSearchSelect() {
      get("/ds/listCustomSearchLabels", {
        classifierId: "PublicCodeItem"
      }).then(res => {
        console.log(res.data);
        if (res.code === 10000 && res.success) {
          this.selectList = res.data;
        }
      });
    },
    handleBack() {
      this.showToolTip = false;
      this.$parent.$parent.$parent.showMain("main");
    },
    deleteItem() {
      if (this.commonCodeItemId) {
        this.combinationShow = true;
        this.deleteCodeMsg = false;
        this.deleteDialog = true;
        this.$nextTick(() => {
          this.$refs.deleteMenuDialog.activeFirst();
          this.$refs.deleteMenuDialog.getAllMsg(this.commonCodeItemId);
        });
      } else {
        this.$message.error("所传目标id为空, 请检查是否有数据!");
      }
    },
    // 头部删除
    handleDelete() {
      this.$confirm(
        "您的操作将会永久删除所选标准及其相关关系，确定继续吗?",
        "警告",
        {
          confirmButtonText: "继续",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const load = loading("删除中...");
          if (this.deleteCodeMsg) {
            get("/ds/public/deleteBatchPublicCodeItems", {
              publicCodeItemIds: this.sendId
            }).then(res => {
              if (res.success && res.code === 10000) {
                this.$message({
                  type: "success",
                  message: res.message
                });
                load.close();
                this.deleteDialog = false;
                this.getAllTableMsg();
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            get("/ds/public/deletePublicCodeInfoItems", {
              ids: this.commonCodeItemId
            }).then(res => {
              if (res.code === 10000 && res.success) {
                this.$message({
                  type: "success",
                  message: res.message
                });
                load.close();
                this.deleteDialog = false;
                this.$parent.$parent.$parent.showMain("main");
                this.$parent.$parent.$parent.getAllTableMsg();
              } else {
                this.$message.error(res.message);
              }
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          load.close();
        });
    },
    // 头部编辑
    handleEdit() {
      this.getInputList();
      this.getClassify();
      this.editDialog = true;
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate(valid => {
        console.log("111");
        if (valid) {
          this.addItem = true;
          console.log("jiaoyan");
          if (this.sameList.length > 0) {
            this.showSames = true;
          } else {
            this.showSames = false;
            this.sendFinalItem();
          }
        } else {
          return false;
        }
      });
    },
    sendFinalItem() {
      if (this.addItem) {
        const capitalize = ([first, ...rest], lowerRest = false) =>
          first.toUpperCase() +
          (lowerRest ? rest.join("").toLowerCase() : rest.join(""));
        let msg = {};
        this.inputList.map(item => {
          let name = item.columnName.toLowerCase();
          let index = name.indexOf("_");
          let val = name
            .substr(0, index)
            .concat(capitalize(name.substr(index + 1, name.length)));
          msg[val] = this.editCodeForm[val];
          if (
            item.columnType === "treedirectory" &&
            item.attrName.includes("分类")
          ) {
            msg[val] = this.editNameSpace;
          }
        });
        console.log(msg);
        msg.parentId = this.namespace;
        this.$refs[formName].validate(valid => {
          if (valid) {
            msg.instanceId = this.commonCodeItemId;
            post("/ds/public/updatePublicCodeInfoItem", msg).then(res => {
              if (res.code === 10000 && res.success) {
                this.clearEditDialog();
                this.editDialog = false;
                this.getBasicMsg();
                this.$parent.$parent.$parent.getAllTableMsg();
                this.$message.success(res.message);
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            this.$message.error("请输入必填项！");
            return false;
          }
        });
      }
      this.showSames = false;
      this.addItem = false;
    },
    // 头部 血缘分析
    handleBlood(command) {
      this.$router.push({
        name: "dsLineageAnalysisCanvas",
        params: {
          dataFlowType: command,
          id: this.commonCodeItemId,
          _title: generateLineageTitle(command, this.basicMsg.name)
        }
      });
    },
    // 折叠面板事件
    handleChange(val) {
      console.log(val);
    },
    // 表头选择
    handleSelectionChange(val) {
      console.log(val);
      this.selectList = val;
    },
    // 新增代项码信息
    handleCodeMsgAdd(command) {
      if (command === "addSome") {
        // this.handleCommand();
        this.addSomeDialog = true;
      } else if (command === "addOne") {
        this.addDialog = true;
        // this.handleCommand('fourth');
      }
    },
    clearDialog() {
      this.addForm.codeMean = "";
      this.addForm.codeNum = "";
      this.addForm.codeName = "";
      this.textarea = "";
    },
    clearEditDialog() {
      for (let i in this.editCodeForm) {
        this.editCodeForm[i] = "";
      }
    },
    // 新增提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addOne = true;
          console.log(this.addForm, "666");
          console.log(this.addCodeForm);
          let msg = {};
          for (let a in this.addForm) {
            if (this.addForm[a]) {
              msg[a] = this.addForm[a];
            }
          }
          this.addCodeForm.map(item => {
            item.title.includes("取值")
              ? (msg[item.key] = this.addForm.codeNum)
              : "";
          });
          msg.parentId = this.commonCodeItemId;
          console.log(msg);
          post("/ds/public/addPublicCodeItem", msg).then(res => {
            if (res.code === 10000 && res.success) {
              this.addDialog = false;
              this.loading = false;
              this.$message.success(res.message);
              this.clearDialog();
              this.addOne = false;
              this.getAllTableMsg();
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteCodeItem() {
      console.log(this.selectList);
      if (this.selectList.length > 0) {
        this.deleteCodeMsg = true;
        this.deleteDialog = true;
        let params = [];
        this.combinationShow = false;
        this.selectList.map(item => {
          params.push(item.instanceId);
          // console.log(item.id)
        });
        this.sendId = params.toString();
        this.$nextTick(() => {
          this.$refs.deleteMenuDialog.activeFirst();
          this.$refs.deleteMenuDialog.getAllMsg(this.sendId);
        });
      } else {
        this.$message.error("请选择要删除的数据！");
      }
    },
    // 批量删除代码项信息
    handleCodeMsgDelete() {
      this.$confirm(
        "您的操作将会永久删除所选标准及其相关关系，确定继续吗?",
        "警告",
        {
          confirmButtonText: "继续",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          get("/ds/public/deleteBatchPublicCodeItems", {
            publicCodeItemIds: this.sendId
          }).then(res => {
            if (res.success && res.code === 10000) {
              this.$message({
                type: "success",
                message: res.message
              });
              this.getAllTableMsg();
            } else {
              this.$message.error(res.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 获取基本信息
    getBasicMsg() {
      this.loading = true;
      console.log(this.commonCodeItemId);
      get("/ds/public/queryPublicCodeInfoItemDetails", {
        publicCodeInfoItemId: this.commonCodeItemId
      }).then(res => {
        console.log(res);
        if (res.code === 10000 && res.success) {
          this.basicMsg = res.data;
          setTimeout(() => {
            this.loading = false;
          }, 500);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getAllTableMsg();
    },
    // 获取代码项表格数据
    getAllTableMsg() {
      this.loading = true;
      console.log(this.commonCodeItemId);
      get("/ds/public/queryPublicCodeItems", {
        publicCodeInfoItemId: this.commonCodeItemId, // 元数据ID
        keyword: this.keyword, // 关键字
        pageCurrent: this.pageCurrent, // 页码
        pageSize: 10, // 显示条数
        prop: this.propSearch
      }).then(res => {
        console.log(res);
        if (res.code === 10000 && res.success) {
          setTimeout(() => {
            this.loading = false;
          }, 500);
          // const data = res.data.records;
          this.tableData = res.data.records;
          // data.map((item, index) => {
          //   item.attributes.map(i => {
          //     if (i.name === "含义") {
          //       this.tableData[index].desc = i.value ? i.value : "";
          //     } else if (i.name === "公共代码项取值") {
          //       this.tableData[index].num = i.value ? i.value : "";
          //     }
          //   });
          // });
          this.total = res.data.total;
        }
      });
    },
    // getAllTableMsg() {
    //   // if (this.menuClassifierId !== "") {
    //   // this.tableLoading = true;
    //   // console.log(this.menuClassifierId, 2);
    //   // this.tableData = [];
    //   get("/ds/customSearch", {
    //     ancestorId: this.nodeId,
    //     classifierId: "PublicCodeItem",
    //     current: this.pageCurrent,
    //     size: this.pageSize,
    //     keyword: this.keyword,
    //     prop: this.propSearch
    //   }).then(res => {
    //     console.log(res, "123");
    //     if (res.code === 10000 && res.success) {
    //       this.tableLoading = false;
    //       this.tableHeaders = res.extras.headers;
    //       this.tableData = res.data.records;
    //       this.total = res.data.total;
    //     }
    //   });
    //   // }
    // },
    // 跳到代码详情
    toDetails(row) {
      this.$parent.$parent.$parent.showItemDetail(row);
      // this.$router.push({
      //   name: "codeItemDetail",
      //   params: {
      //     row: row,
      //     id: row.id,
      //     _title: row.name
      //   }
      // });
    },
    goDetail(item) {
      console.log(item);
      if (item.toInstanceClassifierId === "MasterDataInfoItem") {
        // 跳转主数据详情
        this.$router.push({
          name: "masterDataDetails",
          params: {
            id: item.toInstanceId,
            classifierId: item.toInstanceClassifierId,
            _title: item.toInstanceName,
            headerTitle: item.toInstanceName
          }
        });
      } else {
        // 跳转维度详情
        this.$router.push({
          name: "dimensionDetails",
          params: {
            id: item.toInstanceName,
            _title: item.toInstanceName,
            detailId: item.toInstanceId,
            row: item
          }
        });
      }
    },
    changeShow() {
      this.choseCode = true;
      this.activeNames = ["1", "2", "3"];
    },
    // 获取新增动态输入框
    getInputList() {
      this.addInput = [];
      get("/ds/public/getPublicCodeInfoItemAttrInfos", {
        publicCodeInfoItemId: this.commonCodeItemId
      }).then(res => {
        console.log(res, "inputList");
        this.inputList = res.data;
        let changeList = JSON.stringify(res.data);
        const capitalize = ([first, ...rest], lowerRest = false) =>
          first.toUpperCase() +
          (lowerRest ? rest.join("").toLowerCase() : rest.join(""));
        this.inputList.map(item => {
          let name = item.columnName.toLowerCase();
          let index = name.indexOf("_");
          let val = name
            .substr(0, index)
            .concat(capitalize(name.substr(index + 1, name.length)));
          if (item.columnType === "combobox") {
            if (!item.nullable) {
              this.editRules[val] = [
                {
                  required: true,
                  message: `请选择${item.attrName}`,
                  trigger: "change"
                }
              ];
            }
            get("/ds/listStandardAttrComboboxInfos", {
              columnTypeValue: item.columnTypeValue
            }).then(res => {
              item.dropList = res.data;
              console.log(item, "5");
              this.addInput.push({
                label: item.attrName,
                key: val,
                type: item.columnType,
                nullable: item.nullable,
                value: item.attrValue ? item.attrValue : "",
                dropList: item.dropList
              });
              this.$nextTick(() => {
                this.addInput.map(item => {
                  console.log(item.label);
                  if (item.label === "发布状态") {
                    console.log(item.key, item.value);
                    this.editCodeForm[item.key] = item.value;
                  }
                });
              });
            });
          } else if (item.columnType === "treedirectory") {
            if (!item.nullable) {
              this.editRules.namespace = [
                {
                  required: true,
                  message: `请选择${item.attrName}`,
                  trigger: "change"
                }
              ];
            }
            this.addInput.push({
              label: item.attrName,
              key: "namespace",
              type: item.columnType,
              nullable: item.nullable,
              value: item.attrValue ? item.attrValue : this.oldNameSpace
            });
          } else if (item.columnName === "SUP_ID") {
            this.parentId = item.attrValue;
          } else {
            if (!item.nullable) {
              if (
                item.columnName === "INSTANCE_NAME" ||
                item.columnName === "instanceName"
              ) {
                this.editRules[val] = [
                  { validator: this.checkName, trigger: "blur" }
                ];
                this.name_label = item.attrName;
              } else {
                this.editRules[val] = [
                  {
                    required: true,
                    message: `请输入${item.attrName}`,
                    trigger: "blur"
                  }
                ];
              }
            }
            this.addInput.push({
              label: item.attrName,
              key: val,
              type: item.columnType,
              nullable: item.nullable,
              value: item.attrValue ? item.attrValue : ""
            });
          }
          // if (item.attrName.includes("英文")) {
          //   console.log(item)
          //   this.eKey = val
          //   this.editCodeForm[val] = item.attrValue
          // }
          // return item;
        });
        console.log(this.addInput);
        console.log(this.eKey);
        this.$nextTick(() => {
          this.addInput.map(item => {
            console.log(item.label);
            // if (item.label === "发布状态") {
            //   console.log(item.key, item.value);
            // }
            this.editCodeForm[item.key] = item.value;
          });
        });
        // this.inputList.map(i => {
        //   if (i.attrName.includes("英文")) {
        //     let name = i.columnName.toLowerCase();
        //     let index = name.indexOf("_");
        //     let val = name
        //     .substr(0, index)
        //     .concat(capitalize(name.substr(index + 1, name.length)));
        //     this.eKey = val
        //   }
        // })

        let getKey = JSON.parse(changeList);
        getKey.map(a => {
          if (a.attrName.includes("英文名称")) {
            let b = a.columnName.toLowerCase();
            let index = name.indexOf("_");
            // let val = name.substr(0, index).concat(capitalize(name.substr(index + 1, name.length)));
            this.eKey = b
              .substr(0, index)
              .concat(capitalize(b.substr(index + 1, b.length)));
          }
        });
        // console.log(this.eKey, '6666')
        // console.log(this.editCodeForm, "223");
        // console.log(this.addInput, "223");
      });
    },
    // 公共代码分类
    getClassify() {
      get("/ds/public/getPublicCodeClassifierInfos").then(res => {
        console.log(res);
        this.data = res.data;
      });
    },
    // 点击节点
    nodeClick(data, node, component) {
      console.log(data);
      console.log(node);
      this.parentId = data.nodeId;
      this.namespace = data.nodeId;
      this.editCodeForm.namespace = data.nameContext;
      if (node.isLeaf) {
        console.log(this.$refs);
        this.$refs.nameSpaceSelect[0].blur();
      }
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
    getStatusList() {
      get("/ds/listStandardAttrComboboxInfos", {
        columnTypeValue: "StdStatusCd"
      }).then(res => {
        console.log(res, "select");
        this.StatusList = res.data;
      });
    },
    // 获取编辑代码信息项  必须输入框数据
    getEssentialInput() {
      get("ds/public/getPublicCodeInfoItemMustInfos").then(res => {});
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
    // 获取代码项新增输入框
    getAttrInfo() {
      get("/ds/public/getPublicCodeItemAttrInfos").then(res => {
        console.log(res, "222");
        this.codeAddInput = res.data;
        this.codeAddInput.map((item, index) => {
          if (item.attrName.includes("取值")) {
            this.codeNumInput = item;
          }
        });
        const capitalize = ([first, ...rest], lowerRest = false) =>
          first.toUpperCase() +
          (lowerRest ? rest.join("").toLowerCase() : rest.join(""));
        this.dynamicInput = this.codeAddInput.map(item => {
          let name = item.columnName.toLowerCase();
          let index = name.indexOf("_");
          let val = name
            .substr(0, index)
            .concat(capitalize(name.substr(index + 1, name.length)));
          this.addCodeForm.push({
            key: val,
            title: item.attrName,
            selectVal: item.columnName
          });
          item.key = val;
          return item;
        });
        // this.codeNumInput = JSON.parse(data).map((item, index) => {
        //     if (item.attrName.includes('取值')) {
        //       return item
        //     }
        // })
        console.log(this.codeNumInput, 6);
      });
      console.log(this.addCodeForm);
      console.log(this.dynamicInput, 5);
      console.log(this.addCodeRule);
    },
    // 应用翻页
    changeUsageCurrent(val) {
      this.usageCurrent = val;
      this.getUsageTable();
    },
    // 获取应用表格数据
    getUsageTable() {
      get("/ds/public/publicCodeInfoItemUsageRelations", {
        pageCurrent: this.usageCurrent,
        pageSize: 10,
        publicCodeInfoItemId: this.commonCodeItemId
      }).then(res => {
        // console.log(res,6)
        if (res.code === 10000 && res.success) {
          this.usageTableData = res.data.records;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 自定义tree 图标 文字
    renderAddContent(h, params) {
      let sText = params.data.nodeName;
      let iconType = "icon icon-folder";
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
    // suolve( str,sub_length ){
    //     var temp1 = str.replace(/[^\x00-\xff]/g,"**");//  精髓
    //     var temp2 = temp1.substring(0,sub_length);
    //     //  找出有多少个*
    //     var x_length = temp2.split("\*").length - 1 ;
    //     var hanzi_num = x_length /2 ;
    //     sub_length = sub_length - hanzi_num ;// 实际需要sub的长度是总长度-汉字长度
    //     var res = str.substring(0,sub_length);
    //     if(sub_length < str.length ){
    //        var end =res+"……" ;
    //     }else{
    //        var end = res ;
    //     }
    //        return end ;
    // },
    getAllMsg(id) {
      this.showToolTip = true;
      this.addCodeForm = [];
      this.commonCodeItemId = id;
      this.getBasicMsg();
      // this.getAllTableMsg();
      this.getSearchSelect();
      this.getAllTableMsg();
      this.getClassify();
      this.getStatusList();
      this.getAttrInfo();
      this.getUsageTable();
      this.changeShow();
    },
    getUnHanZi(str) {
      // let unHanzi = str.replace(/[\u4e00-\u9fa5|,]+/,',')
      // console.log(unHanzi)
      if (str !== null && str !== "") {
        var reg = /[\u4e00-\u9fa5]/g;
        let dot = /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g;
        return str.replace(reg, "").replace(dot, "");
      } else {
        return "";
      }
    },
    getHanZi(str) {
      // /[^\u4e00-\u9fa5|,]
      if (str !== null && str !== "") {
        var reg = /[^\u4e00-\u9fa5]/g;
        return str.replace(reg, "");
      } else {
        return "";
      }
    },
    toSeeDetail(item) {
      this.getAllMsg(item.id);
      this.showSames = false;
      this.editDialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.right-basic {
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
  .dialog_button {
    text-align: center;
    margin: 0 -20px;
    border-top: 1px solid rgba(228, 228, 228, 1);
    padding-top: 20px;
    margin-top: 50px;
  }
}
.right-basic::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}
.right-basic::-webkit-scrollbar-track {
  background: none;
  border-radius: 2px;
}
.right-basic::-webkit-scrollbar-thumb {
  background: rgb(239, 239, 239);
  border-radius: 10px;
}
.right-basic::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
.card-title {
  height: 55px;
  padding: 5px 50px;
  border-bottom: 1px solid rgba(228, 228, 228, 1);
  padding-left: 10px;
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
  background: url(../../../assets/images/commonIcon/blood-icon.png) no-repeat;
  background-size: 100%;
}
.edit {
  background: url(../../../assets/images/commonIcon/edit.png) no-repeat;
  background-size: 100%;
}
.del {
  background: url(../../../assets/images/commonIcon/del.png) no-repeat;
  background-size: 100%;
}
.add {
  background: url(../../../assets/images/commonIcon/add.png) no-repeat;
  background-size: 100%;
}
.basic-content {
  height: calc(100% - 80px);
  // width: calc(100% - 80px);
  // overflow: auto;
  // position: absolute;
  /deep/ .el-collapse {
    border: unset;
    margin-top: 30px;
  }
  /deep/ .el-collapse-item__header {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    margin-bottom: 10px;
    height: 30px;
    color: #666666;
    padding: 0 20px;
    border-bottom: unset;
  }
  /deep/ .el-collapse-item__wrap {
    border-bottom: unset;
  }
  /deep/ .el-collapse-item__content {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: #666666;
    padding: 0px 60px 10px;
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
    /deep/ .el-form-item {
      margin-bottom: 0;
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
  width: 60px;
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
.code-detail {
  .checkSame /deep/ {
    .el-dialog__wrapper .el-dialog .el-dialog__header {
      border: unset !important;
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
.el-dropdown-menu__item {
  padding: 0;
  text-align: center;
  width: 80px;
}
.line {
  height: 100%;
  width: 4px;
  background: #579ef3;
  margin-right: 15px;
}
</style>
