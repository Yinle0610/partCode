<template>
  <div class="rule-edit">
    <!-- <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <el-button @click="handleCancel" size="small" style="float: right;">关闭</el-button>
      </div> -->
      <div class="card-body">
        <!-- <el-tabs type="card" v-model="activeName" @tab-click="handleClick"> -->
          <!-- <el-tab-pane label="基本信息" name="first"> -->
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="110px"
              style="width:60%;margin-top:20px;"
              >
              <el-form-item label="规则名称：" class="is-required" prop="instanceName">
                <el-input
                  onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
                  v-model="ruleForm.instanceName"
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
                  @change="changeRuleClassfiy"
                  placeholder="请选择"
                >
                  <el-option :label="classifyOption" :value="classifyValue" style="height: auto">
                    <el-tree
                      style="margin: 0 -20px;"
                      :data="ruleTreeData"
                      node-key="id"
                      ref="tree"
                      :highlight-current="true"
                      :props="defaultProps"
                      accordion
                      :render-content="renderContent"
                      @node-click="nodeClick"
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
            <!-- <div style="text-align:center;border-top:1px solid #EBEEF5;margin-top:50px;">
              <el-button size="small" type="primary" style="margin-top:15px;" @click="handleSave">保存</el-button>
            </div> -->
          <!-- </el-tab-pane> -->
          <!-- <el-tab-pane label="关系信息" name="second"> -->
            <!-- <el-collapse value="1" class="relationship"> -->
              <!-- <el-collapse-item title="参考(Reference)" name="1">
                <div class="button">
                  <el-button
                    type="primary"
                    size="mini"
                    class="zengjia"
                    @click="dialogTableVisible=true;getRelationList()"
                  >
                    <svg-icon icon-class="zengjia"></svg-icon>新增
                  </el-button>
                  <el-button @click="deleteRelation()" type="danger" size="mini" class="shanchu">
                    <svg-icon icon-class="shanchu"></svg-icon>删除
                  </el-button>
                </div>
                <div class="table">
                  <el-table
                    :data="relationData.tableData"
                    border
                    style="width: 100%"
                    size="mini"
                    :header-cell-style="{background:'#f8f8f9',textAlign:'center'}"
                    :cell-style="isClass"
                    :header-cell-class-name="isClass2"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column prop="name" label="标准名称"></el-table-column>
                    <el-table-column prop="classifierName" label="标准类型"></el-table-column>
                    <el-table-column prop="code" label="标准代码"></el-table-column>
                    <el-table-column prop="path" label="上下文路径"></el-table-column>
                    <el-table-column prop="relationshipName" label="关系类型"></el-table-column>
                  </el-table>
                  <el-pagination
                    style="text-align: center;margin-top:15px;"
                    background
                    layout="prev, pager, next"
                    @current-change="changeRelationPage"
                    :total="relationData.total"
                  ></el-pagination>
                </div>
              </el-collapse-item>-->
              <!-- <el-collapse-item title="应用(Usage)" name="1">
                <div class="code-table">
                  <el-table
                    :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                    ref="multipleTable"
                    :data="usageTable"
                    tooltip-effect="dark"
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      align="center"
                      prop="relationshipName"
                      label="关系类型"
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column align="center" show-overflow-tooltip prop="name" label="标准名称"></el-table-column>
                    <el-table-column
                      align="center"
                      show-overflow-tooltip
                      prop="classifierName"
                      label="标准类型"
                    ></el-table-column>
                    <el-table-column align="center" show-overflow-tooltip prop="path" label="上下文路径"></el-table-column>
                    <el-table-column align="center" show-overflow-tooltip label="标准代码">
                      <template slot-scope="scope">
                        <el-button type="text">{{ scope.row.code }}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="code-pagination">
                    <el-pagination
                      background
                      @current-change="changeUsageCurrent"
                      layout="prev, pager, next"
                      :total="usageTotal"
                    ></el-pagination>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane> -->
          <!-- <el-tab-pane label="认责信息" name="third">
            <el-collapse v-model="confessActiveNames" @change="handleChange">
              <el-collapse-item title="创建人" name="1">
                <div class="confess-creator" v-for="(item, index) in creatorList" :key="index">
                  <svg-icon class="creator-icon" icon-class="see-user"></svg-icon> -->
                  <!-- <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                      <p>部门：{{item.groupname}}</p>
                      <p>工作电话：{{item.workphone}}</p>
                      <p>邮箱:{{item.mail}}</p>
                      <p>手机号:{{item.mobilePhone}}</p>
                  </div>-->
                  <!-- <el-button type="text">{{item.username}}</el-button> -->
                  <!-- </el-tooltip> -->
                  <!-- <svg-icon
                    @click.native="deletePerson(item)"
                    class="creator-icon"
                    style="right: -90px;cursor: pointer"
                    icon-class="delete-filter"
                  ></svg-icon>-->
                <!-- </div> -->
                <!-- <div v-if="creatorList.length < 1">暂无数据</div> -->
                <!-- <div @click="addPerson(creatorList)" class="confess-creator confess-add">
                  <svg-icon class="creator-icon" icon-class="add"></svg-icon>
                  <el-button style="color: #666666;" type="text">增加</el-button>
                </div>-->
              <!-- </el-collapse-item>
              <el-collapse-item title="发布人" name="2">
                <div class="confess-creator" v-for="(item, index) in issuerList" :key="index">
                  <svg-icon class="creator-icon" icon-class="see-user"></svg-icon>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                      <p>部门：{{item.groupname}}</p>
                      <p>工作电话：{{item.workphone}}</p>
                      <p>邮箱:{{item.mail}}</p>
                      <p>手机号:{{item.mobilePhone}}</p>
                    </div>
                    <el-button type="text">{{item.username}}</el-button>
                  </el-tooltip> -->
                  <!-- <svg-icon
                    @click.native="deletePerson(item)"
                    class="creator-icon"
                    style="right: -90px;cursor: pointer"
                    icon-class="delete-filter"
                  ></svg-icon>-->
                <!-- </div> -->
                <!-- <div v-if="issuerList.length < 1">暂无数据</div> -->
                <!-- <div @click="addPerson(issuerList)" class="confess-creator confess-add">
                  <svg-icon class="creator-icon" icon-class="add"></svg-icon>
                  <el-button style="color: #666666;" type="text">增加</el-button>
                </div>-->
              <!-- </el-collapse-item>
              <el-collapse-item title="使用人" name="3">
                <div class="confess-creator" v-for="(item, index) in userList" :key="index">
                  <svg-icon
                    class="creator-icon"
                    style="height: 22px;width: 22px;"
                    icon-class="see-user"
                  ></svg-icon> -->
                  <!-- <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                      <p>部门：{{item.groupname}}</p>
                      <p>工作电话：{{item.workphone}}</p>
                      <p>邮箱:{{item.mail}}</p>
                      <p>手机号:{{item.mobilePhone}}</p>
                  </div>-->
                  <!-- <el-button type="text">{{item.username}}</el-button> -->
                  <!-- <el-button type="text">{{item.username}}</el-button> -->
                  <!-- </el-tooltip> -->
                  <!-- @click.native="deletePerson(item, index)" -->
                  <!-- <svg-icon
                    @click.native="handleClose2(item, '使用人')"
                    class="creator-icon"
                    style="right: -90px;cursor: pointer"
                    icon-class="delete-filter"
                  ></svg-icon>
                </div>
                <div @click="addPerson('使用人')" class="confess-creator confess-add">
                  <svg-icon class="creator-icon" icon-class="add"></svg-icon>
                  <el-button style="color: #666666;" type="text">增加</el-button>
                </div>
              </el-collapse-item>
              <el-collapse-item title="归口责任人" name="4">
                <div class="confess-creator" v-for="(item, index) in dutyList" :key="index">
                  <svg-icon class="creator-icon" icon-class="see-user"></svg-icon> -->
                  <!-- <el-tooltip class="item" effect="dark" placement="right"> -->
                  <!-- <div slot="content">
                      <p>部门：{{item.groupname}}</p>
                      <p>工作电话：{{item.workphone}}</p>
                      <p>邮箱:{{item.mail}}</p>
                      <p>手机号:{{item.mobilePhone}}</p>
                  </div>-->
                  <!-- <el-button type="text">{{item.username}}</el-button> -->
                  <!-- <el-button type="text">{{item.username}}</el-button>
                  <svg-icon
                    v-if="IsParentIndex"
                    @click.native="handleClose2(item, '责任人')"
                    class="creator-icon"
                    style="right: -90px;cursor: pointer"
                    icon-class="delete-filter"
                  ></svg-icon> -->
                  <!-- </el-tooltip> -->
                  <!-- <svg-icon
                    @click.native="deletePerson(item)"
                    class="creator-icon"
                    style="right: -90px;cursor: pointer"
                    icon-class="delete-filter"
                  ></svg-icon>-->
                <!-- </div> -->
                <!-- <div v-if="dutyList.length < 1">暂无数据</div> -->
                <!-- <div
                  v-if="dutyList.length < 1"
                  @click="addPerson('责任人')"
                  class="confess-creator confess-add"
                >
                  <svg-icon class="creator-icon" icon-class="add"></svg-icon>
                  <el-button style="color: #666666;" type="text">增加</el-button>
                </div>
              </el-collapse-item> -->
            <!-- </el-collapse> -->
          <!-- </el-tab-pane> -->
        <!-- </el-tabs> -->
      </div>
    <!-- 关系信息  新增参考弹窗 -->
    <!-- <el-dialog append-to-body :visible.sync="dialogTableVisible" class="relationTip">
      <div slot="title">请选择参考来源</div>
      <div>
        <el-form :inline="true">
          <el-col :span="11">
            <el-form-item label="关系类型：" label-width="60px">
              <el-select
                @change="selectRelationType"
                v-model="referSource.type"
                placeholder="请选择"
                size="mini"
                clearable
              >
                <el-option
                  v-for="(item, index) in relationList"
                  :key="index"
                  :value="item.fromClassifierId"
                  :label="item.relationshipName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-left:15px;">
            <el-form-item label="关键字：" label-width="50px" class="input">
              <el-input
                v-model="referSource.keyWord"
                placeholder="请输入标准名称"
                size="mini"
                @keyup.enter.native="getReferSource"
                suffix-icon="el-icon-search"
                onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <el-table
        :data="referSource.tableData"
        border
        size="mini"
        :header-cell-style="{background:'#f8f8f9',textAlign:'center'}"
        :cell-style="referClass"
        @row-click="clickReferTable"
      >
        <el-table-column show-overflow-tooltip prop="code" label="标准代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="标准名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="classifierName" label="标准类型"></el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:30px;">
        <el-pagination
          @current-change="changeReferPage"
          background
          layout="prev, pager, next"
          :total="referSource.total"
        ></el-pagination>
      </div>
      <div style="margin-top:30px;">
        <span style="font-size:13px;">已选择：</span>
        <div v-show="referTag.length > 0">
          <el-tag
            v-for="(item, index) in referTag"
            :key="index"
            v-show="referTag.length > 0"
            @close="closeReferTag(item, index)"
            closable
            effect="plain"
            size="mini"
          >{{item.name}}</el-tag>
        </div>
        <div v-show="referTag.length < 1">暂无数据</div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button @click="addReference" type="primary" size="mini">确定</el-button>
      </div>
    </el-dialog> -->
    <!-- 认责信息  新增弹窗 -->
    <!-- <el-dialog
      append-to-body
      title="请选择用户"
      destroy-on-close
      @close="closeDialog"
      :visible.sync="dialogTableVisible2"
      width="520px"
      class="people-dialog"
      >
      <div slot v-if="wData.filterSponsorArr.length>0" class="tree-slot">
        已选择：
        <el-tag
          v-for="(tag, index) in wData.filterSponsorArr"
          :key="index"
          type="info"
          closable
          @close="handleClose(tag)"
          size="small"
          style="margin-right:5px;"
        >{{tag.username}}</el-tag>
      </div>
      <el-input placeholder="请输入内容" v-model="wData.wKeyword" @input="toSearch" clearable>
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-tree
        class="filter-tree"
        :data="wData.problemTakerData"
        :props="wData.defaultProps"
        ref="tree"
        v-if="wData.treeSelect.length==0"
        node-key="userId"
        @node-click="selectTreeValue"
        style="height: 200px;overflow:auto;margin-top: 15px;margin-left: 10px"
      ></el-tree> -->
      <!-- <div class="tree-select-div people" v-if="wData.treeSelect.length>0"> -->
        <!-- <div v-for="select in wData.treeSelect" :key="select.userId" class="item"> -->
          <!-- <p @click="selectTreeValue(select)">{{select.title}} （{{ select.parent }}）</p> -->
          <!-- <Icon type="ios-checkmark" color="#1890ff"></Icon> -->
        <!-- </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 检测是否同名 -->
    <div class="checkSame">
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
          <el-button type="primary" @click="sureEdit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { get, post, postByJson } from "@/utils/request";
import pinyin from "pinyin";
export default {
  props: {
    refreshDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const checkInstanceName = (rule, value, callback) => {
      if (this.ruleForm.instanceName === "") {
        callback(new Error("请输入规则名称"));
      } else {
        let params = {
          instanceId: this.basicMsg.instanceId,
          instanceName: this.ruleForm.instanceName,
          parentId: this.parentId
        };
        get("/ds/application/rule/checkStandardNameIsExist", params).then(
          res => {
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
      // 是否是根节点数据
      IsParentIndex: null,
      dialogTableVisible2: false,
      wData: {
        wKeyword: "",
        problemTakerData: [],
        treeSelect: [],
        defaultProps: {
          children: "children",
          label: "title",
          isLeaf: "isLeaf"
        },
        filterSponsorArr: [],
        pfilterSponsorArr: [],
        porSou: [],
        porLevel: [],
        closable: true
      },
      filterText: "",
      // 应用
      usageTable: [],
      userType: "",
      usageTotal: 0,
      activeName: "first",
      mineStatus: "",
      mineStatusValue: [],
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1"
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      ruleTreeData: [],
      defaultProps: {
        children: "childNodes",
        label: "nodeName"
      },
      dialogTableVisible: false,
      ruleForm: {
        instanceName: "",
        namespace: ""
      },
      rules: {
        instanceName: [{ validator: checkInstanceName, trigger: "blur" }],
        namespace: [
          { required: true, message: "请选择规则分类", trigger: "blur" }
        ]
      },
      relationData: {
        tableData: [],
        total: 0
      },
      // 参考来源弹窗数据
      referSource: {
        type: "",
        keyWord: "",
        pageCurrent: 1,
        total: 0,
        tableData: []
      },
      relationList: [],
      // 认责默认折叠
      confessActiveNames: ["1", "2", "3", "4"],
      // 创建人
      creatorList: [],
      // 发布人列表
      issuerList: [],
      // 使用人列表
      userList: [],
      // 责任人列表
      dutyList: [],
      dutyDialog: false,
      tagList: [],
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      selectValue: [],
      classifyOption: "",
      classifyValue: "",
      // 基本信息
      basicMsg: {},
      // 输入框
      inputList: [],
      referTag: [],
      defaultTreeProps: {
        children: "users",
        label: "userName"
      },
      treeData: [],
      inputListChange: {},
      oldInputList: "",
      ruleFormChange: 0,
      oldRuleForm: "",
      oldUserList: [],
      selectReferList: [],
      namespace: "",
      usageCurrent: 1,
      changeBasic: true,
      changeDuty: true,
      addNode: false,
      nodeList: [],
      parentId: "",
      sameList: [],
      showSames: false,
      editItem: false
    };
  },
  methods: {
    sure() {
      console.log(this.dutyList, "sure");
      if (this.userType === "责任人") {
        console.log(this.wData.filterSponsorArr, "data");
        this.dutyList = this.wData.filterSponsorArr;
      } else {
        let arr = JSON.parse(JSON.stringify(this.wData.filterSponsorArr));
        arr.map((val, index) => {
          let data = {
            username: val.title ? val.title : val.username,
            userId: val.userId
          };
          this.userList[index] = data;
        });
      }
      this.addDutyMsg();
      this.dialogTableVisible2 = false;
    },
    // 认责树 筛选
    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.userName.indexOf(value) !== -1;
    },
    handleNodeClick(node) {
      if (!node.groupName) {
        let add = true;
        this.userList.map((item, index) => {
          if (item.username === node.userName) {
            add = false;
          }
        });
        if (add) {
          this.userList.push({ id: node.userId, username: node.userName });
        }
      }
      console.log(this.userList, 1);
    },
    changeRuleClassfiy(val) {
      console.log(val);
    },
    handleSave() {
      console.log(this.inputList);
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.editItem = true;
          if (this.sameList.length > 0) {
            this.showSames = true;
          } else {
            this.showSames = false
            this.sureEdit()
          }
        } else {
          return false;
        }
      });
    },
    handleClick(val) {
      console.log(val);
      if (val.label === "基本信息") {
        console.log(val.label);
      } else if (val.label === "关系信息") {
        console.log(val.label);
      } else {
        console.log(val.label);
        // 认责信息
      }
    },
    handleSelectionChange(val) {
      console.log(val);
      this.selectReferList = val;
    },
    isClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "text-align:center;border-right:none;";
      } else {
        return "text-align:center;";
      }
    },

    isClass2({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "tableClass";
      }
    },
    handleChange() {},
    /*
    --------------------------------------------------------------
    --------------------------------------------------------------
    ------------------------基本信息 部分--------------------------
    --------------------------------------------------------------
    --------------------------------------------------------------
    */
    // 获取基本信息  编辑输入框
    getBasicMsg() {
      get("/ds/application/rule/getRuleInfoDetail", {
        id: this.basicMsg.instanceId
      }).then(res => {
        console.log(res, "0003");
        this.parentId = res.data.parentId
        // this.oldInputList = JSON.stringify(res.data);
        this.inputList = [];
        this.ruleForm.instanceName = res.data.name;
        this.ruleForm.namespace = res.data.path ? res.data.path : "";
        res.data.dsFeatureColVOS.map(item => {
          this.ruleForm[item.attStore] = item.attValue
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
        })
        this.ruleForm = Object.assign({}, this.ruleForm)
        // this.oldRuleForm = JSON.stringify(this.ruleForm);
        this.namespace = res.data.namespace;
      });
    },
    // 获取规则分类列表
    getRuleSelect() {
      get("/ds/application/rule/getRuleClassifierInfos").then(res => {
        console.log(res);
        this.ruleTreeData = res.data;
      });
    },
    //  发送修改后的基本信息给后端
    sendSaveMsg() {
      let sendMsg = {};
      for (let val in this.ruleForm) {
        sendMsg[val] = this.ruleForm[val]
      }
      sendMsg.namespace = this.namespace;
      sendMsg.instanceId = this.basicMsg.instanceId;
      sendMsg.classifierId = this.basicMsg.classifierId;
      sendMsg.instanceCode = this.basicMsg.instanceCode;
      console.log(sendMsg, 2);
      post("/ds/application/rule/editRuleInfo", sendMsg).then(res => {
        console.log(res);
        if (res.code === 10000 && res.success) {
          this.changeBasic = true;
          if (this.changeBasic && this.changeDuty) {
            this.$message.success(res.message);
            // this.closeNavTag(this.$route);
            console.log(this.refreshDetail)
            if (this.refreshDetail) {
              this.$emit('refreshDetail')
              // this.$route.params.row = this.$route.params.msg;
              // this.$router.push({
              //   name: "ruleDetail",
              //   params: this.$route.params
              // });
            } else {
              // this.$router.push({
              //   name: "ruleManagement",
              //   params: {
              //     nodeList: this.nodeList,
              //     addNode: this.addNode
              //   }
              // });
              let params = {
                nodeList: this.nodeList,
                addNode: this.addNode
              }
              console.log(params, 'params')
              // this.$parent.setTreePosition(params)
              this.$parent.$parent.setTreePosition(params)
            }
          }
        } else {
          this.$message.error(res.message);
        }
      });
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
    /*
    --------------------------------------------------------------
    --------------------------------------------------------------
    ------------------------关系信息 部分--------------------------
    --------------------------------------------------------------
    --------------------------------------------------------------
    */
    // 获取关系信息   参考列表
    getReferTable() {
      get("/ds/application/rule/listRuleReferenceInfos", {
        pageCurrent: this.relationData.pageCurrent,
        pageSize: 10,
        ruleId: this.basicMsg.instanceId
      }).then(res => {
        console.log(res);
        this.relationData.total = res.data.total;
        // this.ReferenceTable = res.data.records;
        this.relationData.tableData = res.data.records;
      });
    },
    changeRelationPage(val) {
      this.relationData.pageCurrent = val;
      this.getReferTable();
    },
    // 删除来源
    deleteRelation() {
      let list = [];
      this.selectReferList.map(item => {
        list.push(item.id);
      });
      let msg = {
        fromId: list.join(","),
        toId: this.basicMsg.instanceId
      };
      post("/ds/application/rule/removeRuleReferenceInfo", msg).then(res => {
        console.log(res);
        if (res.code === 10000 && res.success) {
          this.$message.success(res.message);
          this.getReferTable();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 新增参考来源
    addReference() {
      console.log(this.referTag);
      let msg = [];
      this.referTag.map(item => {
        console.log(item);
        msg.push({
          fromInstanceClassifierId: item.classifierId, // 源规则类型
          fromInstanceId: item.id, // 源规则id
          relationship: this.referSource.type, // 关系类型
          toInstanceClassifierId: this.basicMsg.classifierId, // 目标规则类型
          toInstanceId: this.basicMsg.instanceId
        });
      });
      postByJson("/ds/createReferenceInfo", msg).then(res => {
        console.log(res);
        if (res.code === 10000 && res.success) {
          this.$message.success(res.message);
          this.dialogTableVisible = false;
          this.getReferTable();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 参考来源  关系类型下拉框
    getRelationList() {
      get("/ds/application/rule/listRuleUsageRelationship").then(res => {
        console.log(res);
        this.relationList = res.data;
      });
    },
    // 选择  关系类型
    selectRelationType(val) {
      console.log(val);
      console.log(this.referSource.type);
      this.getReferSource();
    },
    // 参考来源 翻页
    changeReferPage(val) {
      this.referSource.pageCurrent = val;
      this.getReferSource();
    },
    // 参考来源 列表数据
    getReferSource() {
      get("/ds/application/rule/listRuleReferenceInfo", {
        keyword: this.referSource.keyWord,
        pageCurrent: this.referSource.pageCurrent,
        pageSize: 10,
        fromClassifierId: this.referSource.type
      }).then(res => {
        console.log(res);
        if (res.code === 10000 && res.success) {
          this.referSource.tableData = res.data.records.map(item => {
            item.click = false;
            return item;
          });
          this.referSource.total = res.data.total;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 选择参考
    clickReferTable(row, column, event) {
      console.log(row, "001");
      console.log(column, "001");
      console.log(event, "001");
      // this.referSource.tableData.map(item)
      // row.click = true
      this.referSource.tableData.map(item => {
        if (item.id === row.id) {
          item.click = true;
        }
        // else {
        //   item.click = false;
        // }
        return item;
      });

      if (this.referTag.includes(row)) {
        console.log("已存在");
      } else {
        console.log("不存在");

        this.referTag.push(row);
      }
      console.log(this.referTag);
    },
    // 选中变色  未选中则无反应
    referClass({ row, column, rowIndex, columnIndex }) {
      console.log(row);
      if (row.click) {
        return "background: #ecf5ff;";
      } else {
        return "";
      }
    },
    // 删除选中tag
    closeReferTag(item, index) {
      this.referSource.tableData.map(i => {
        console.log(i === item);
        if (i === item) {
          i.click = false;
        }
        return i;
      });
      this.referTag.splice(index, 1);
    },

    //  应用
    changeUsageCurrent(val) {
      this.usageCurrent = val;
      this.getUsageInfo();
    },
    getUsageInfo() {
      get("/ds/application/rule/listRuleUsageInfos", {
        pageCurrent: this.usageCurrent,
        pageSize: 10,
        ruleId: this.basicMsg.instanceId
      }).then(res => {
        console.log(res);
        this.usageTable = res.data.records;
        this.usageTotal = res.data.total;
      });
    },
    /*
    --------------------------------------------------------------
    --------------------------------------------------------------
    ------------------------认责信息 部分--------------------------
    --------------------------------------------------------------
    --------------------------------------------------------------
    */
    // 获取标准认责信息
    getAccountMsg() {
      post("/ds/application/rule/listAccountability", {
        instanceId: this.basicMsg.instanceId
      }).then(res => {
        console.log(res, "000");
        this.IsParentIndex = res.data.supIsParentIndex;
        const data = res.data;
        this.creatorList = data.creator;
        this.issuerList = data.publisher;
        this.userList = data.user.map(item => {
          item.id = item.userId;
          return item;
        });
        this.oldUserList = JSON.stringify(data.user);
        this.dutyList = data.prncipal;
        this.oldDutyList = JSON.stringify(data.prncipal);
      });
    },
    // // 修改认责信息
    // editAccount() {
    //   get("/ds/application/rule/editAccountability", {
    //     instanceId: this.basicMsg.id,
    //     prncipals: "", // 归口责任人
    //     users: "" // 使用人
    //   }).then(res => {
    //     console.log(res);
    //   });
    // },
    // 删除角色
    deletePerson(item, index) {
      // this.$confirm("是否确认删除?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      this.userList.splice(index, 1);
      // this.$message({
      //   type: "success",
      //   message: "删除成功!"
      // });
      // })
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "已取消删除"
      //   });
      // });
    },
    handleClose(tag) {
      this.wData.filterSponsorArr.splice(
        this.wData.filterSponsorArr.indexOf(tag),
        1
      );
      this.wData.pfilterSponsorArr.splice(
        this.wData.pfilterSponsorArr.indexOf(tag.userId),
        1
      );
    },
    handleClose2(tag, type) {
      console.log(tag);
      console.log(this.dutyList);
      this.$confirm(`是否确定删除该${type}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (type === "责任人") {
            this.dutyList = [];
            this.wData.pfilterSponsorArr = [];
            this.wData.filterSponsorArr = [];
          } else if (type === "使用人") {
            let list = JSON.stringify(this.userList);
            this.wData.filterSponsorArr = JSON.parse(list);
            this.wData.filterSponsorArr.splice(
              this.wData.filterSponsorArr.indexOf(tag),
              1
            );
            this.wData.pfilterSponsorArr.splice(
              this.wData.pfilterSponsorArr.indexOf(tag.userId),
              1
            );
            this.userList.map((val, index) => {
              if (tag.userId === val.userId) {
                this.userList.splice(index, 1);
              }
            });
          }
          this.addDutyMsg();
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 增加角色
    addPerson(item) {
      this.userType = item;
      console.log(this.wData.pfilterSponsorArr);
      if (item === "责任人") {
        let list = JSON.stringify(this.dutyList);
        this.wData.filterSponsorArr = JSON.parse(list);
        this.wData.pfilterSponsorArr = [];
        if (this.dutyList.length > 0) {
          this.dutyList.map(item => {
            this.wData.pfilterSponsorArr.push(item.userId);
          });
        }
      } else if (item === "使用人") {
        let list = JSON.stringify(this.userList);
        this.wData.filterSponsorArr = JSON.parse(list);
        // this.wData.filterSponsorArr = this.userList
        this.wData.pfilterSponsorArr = [];
        if (this.userList.length > 0) {
          this.userList.map(item => {
            this.wData.pfilterSponsorArr.push(item.userId);
          });
        }
      }
      // console.log(item);
      // this.getDutyTree();
      this.addNewAccount(item);
      this.dialogTableVisible2 = true;
    },
    // 关闭tags
    closeTag(index) {
      console.log(index);
      this.userList.splice(index, 1);
    },
    handleDutyAdd() {
      this.filterText = "";
      this.dutyDialog = false;
    },
    // 点击节点
    nodeClick(data, node, component) {
      // console.log(data)
      // console.log(node)
      if (this.selectClear) {
        this.nodeList = [];
        this.selectClear = false;
      }
      this.parentId = data.nodeId;
      this.addNode = true;
      node.data.id = node.data.nodeId;
      node.data.name = node.data.nodeName;
      node.data.notetype = "metadata";
      // if (this.$route.params.nodeList)
      if (this.nodeList.length > 0) {
        this.nodeList.map((item, index) => {
          if (item.level === node.level) {
            this.nodeList.splice(index, this.nodeList.length);
          }
        });
      }
      this.nodeList.push(node);
      this.namespace = data.namespace;
      this.ruleForm.namespace = data.nameContext;
      if (node.isLeaf) {
        this.$refs.classifySelect.blur();
      }
    },
    // 认责信息树
    getDutyTree() {
      get("/sys/user/listUserByGroup").then(res => {
        console.log(res, "22");
        this.treeData = res.data.map(item => {
          item.userName = item.groupName;
          console.log(item.users[0].userId);
          if (item.users.length > 0 && item.users[0].userId !== undefined) {
            return item;
          } else {
            item.users = [];
            return item;
          }
        });
      });
    },
    // 保存认责信息的新增
    addDutyMsg() {
      console.log(this.userList, "uselist");
      console.log(this.dutyList, "dutyList");
      let userIds = [];
      this.userList.map(item => {
        userIds.push(item.userId);
      });
      let dutyIds = [];
      this.dutyList.map(item => {
        dutyIds.push(item.userId);
      });
      let msg = {
        users: userIds.toString(),
        prncipals: dutyIds.toString(),
        instanceId: this.basicMsg.instanceId
      };
      post("/ds/application/rule/editAccountability", msg).then(res => {
        console.log(res);
        if (res.code === 10000 && res.success) {
          this.$message.success(res.message);
          // this.changeDuty = true;
          this.getAccountMsg();
          // if (this.changeBasic && this.changeDuty) {
          //   this.$message.success("保存成功！");
          //   this.closeNavTag(this.$route);
          //   if (this.$route.params.type === 'detail') {
          //     this.$route.params.row = this.$route.params.msg
          //     this.$router.push({ name: "ruleDetail", params: this.$route.params })
          //   } else {
          //     this.$router.push({ name: "ruleManagement" });
          //   }
          // }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleCancel() {
      // this.closeNavTag(this.$route);
      if (this.$route.params.type === "detail") {
        this.$route.params.row = this.$route.params.msg;
        this.$router.push({ name: "ruleDetail", params: this.$route.params });
      } else {
        this.$router.push({ name: "ruleManagement" });
      }
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
    toSearch() {
      console.log("input");
      var str;
      var pattern = new RegExp("[\u4E00-\u9FA5]+");
      var pattern2 = new RegExp("[A-Za-z]+");
      if (pattern.test(this.wData.wKeyword)) {
        str = "中文";
      } else if (pattern2.test(this.wData.wKeyword)) {
        str = "英文";
      }
      // console.log(str)
      if (str === "英文") {
        this.eSearch();
      } else if (str === "中文") {
        this.showTree();
      }
    },
    showTree() {
      let selectArr = [];
      let res = this.wData.problemTakerData;
      res.map(val => {
        if (this.wData.wKeyword) {
          if (val.title.indexOf(this.wData.wKeyword) > -1) {
            for (let i = 0; i < val.children.length; i++) {
              if (val.children[i].title) {
                selectArr.push({
                  title: val.children[i].title,
                  userId: val.children[i].userId,
                  parent: val.title
                });
              }
            }
          } else {
            let child = val.children;
            child.map(item => {
              if (item.title && item.title.indexOf(this.wData.wKeyword) > -1) {
                selectArr.push({
                  title: item["title"],
                  userId: item["userId"],
                  parent: val["title"]
                });
              }
            });
          }
        }
      });
      this.wData.treeSelect = selectArr;
      // this.problemTakerData = selectArr;
    },
    // 认责保存
    saveAccusationData() {
      console.log(this.userList);
      let arr = [];
      this.userList.map(val => {
        arr.push(val.userId);
      });
      let params = {
        instanceId: this.selectId,
        users: arr.join(",")
      };
      post("/ds/editAccountability", params).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.$message({
            message: res.message,
            type: "success"
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    eSearch() {
      this.wData.wKeyword = this.wData.wKeyword.toLowerCase();
      let res = this.wData.problemTakerData;
      let selectArr = [];
      res.map(val => {
        let pname = pinyin(val.title, {
          style: pinyin.STYLE_NORMAL, // 设置拼音风格
          heteronym: true
        });
        let newpname = "";
        pname.map(val2 => {
          if (val2.length > 1) {
            newpname += val2[0];
          } else {
            newpname += val2;
          }
        });
        val.pname = newpname;
        let spname = pinyin(val.title, {
          style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
          heteronym: true
        });
        let newspname = "";
        spname.map(val3 => {
          if (val3.length > 1) {
            newspname += val3[0];
          } else {
            newspname += val3;
          }
        });
        val.spname = newspname;
        for (let i = 0; i < val.children.length; i++) {
          if (val.children[i]) {
            let pname = pinyin(val.children[i].title, {
              style: pinyin.STYLE_NORMAL, // 设置拼音风格
              heteronym: true
            });
            let newpname = "";
            pname.map(val2 => {
              if (val2.length > 1) {
                newpname += val2[0];
              } else {
                newpname += val2;
              }
            });
            val.children[i].pname = newpname;
            let spname = pinyin(val.children[i].title, {
              style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
              heteronym: true
            });
            let newspname = "";
            spname.map(val3 => {
              if (val3.length > 1) {
                newspname += val3[0];
              } else {
                newspname += val3;
              }
            });
            val.children[i].spname = newspname;
          }
        }
      });
      res.map(val => {
        if (this.wData.wKeyword) {
          if (val.spname.indexOf(this.wData.wKeyword) !== -1) {
            if (
              val.children.length > 0 &&
              val.children[0].title !== undefined
            ) {
              for (let i = 0; i < val.children.length; i++) {
                let n = val.children[i];
                n.parent = val.title;
                selectArr.push(n);
              }
            }
          } else if (val.pname.indexOf(this.wData.wKeyword) !== -1) {
            let bool = false;
            for (let m = 0; m < val.spname.length; m++) {
              if (this.wData.wKeyword[0] === val.spname[m]) {
                bool = true;
              }
            }
            if (
              val.children.length > 0 &&
              val.children[0].title !== undefined &&
              bool
            ) {
              for (let i = 0; i < val.children.length; i++) {
                let n = val.children[i];
                n.parent = val.title;
                selectArr.push(n);
              }
            }
          } else {
            if (
              val.children.length > 0 &&
              val.children[0].title !== undefined
            ) {
              val.children.map(item => {
                if (item.pname.indexOf(this.wData.wKeyword) !== -1) {
                  let bool = false;
                  for (let m = 0; m < item.spname.length; m++) {
                    if (this.wData.wKeyword[0] === item.spname[m]) {
                      bool = true;
                    }
                  }

                  if (bool) {
                    let n = item;
                    n.parent = val.title;
                    selectArr.push(n);
                  }
                } else if (item.spname.indexOf(this.wData.wKeyword) !== -1) {
                  let n = item;
                  n.parent = val.title;
                  selectArr.push(n);
                }
              });
            }
          }
        }
      });
      console.log(this.wData.wKeyword, res, "kwd");
      this.wData.treeSelect = selectArr;
    },
    selectTreeValue(data) {
      console.log(this.wData.filterSponsorArr);
      console.log(data);
      console.log(this.dutyList, "duty");
      const that = this;
      if (data) {
        data.username = data.title;
        if (data.hasOwnProperty("children")) {
          data.selected = false;
        } else {
          if (data.userId !== undefined) {
            // 多选
            // 问题发起人
            if (this.userType === "责任人") {
              // this.dutyList = []
              that.wData.filterSponsorArr = [data];
              that.wData.pfilterSponsorArr = [data.userId];
              // this.dutyList = data
            } else if (this.userType === "使用人") {
              if (that.wData.pfilterSponsorArr.indexOf(data.userId) === -1) {
                that.wData.filterSponsorArr.push(data);
                that.wData.pfilterSponsorArr.push(data.userId);
              }
              // this.userList = that.wData.filterSponsorArr
            }
          }
        }
      } else {
        this.wData.wKeyword = "";
      }
      console.log(
        this.dutyList,
        that.wData.filterSponsorArr,
        that.wData.pfilterSponsorArr,
        "emmm"
      );
    },
    // 获取认责信息-用户分组列表
    addNewAccount(type) {
      if (type === "使用人" || type === "责任人") {
        this.dialogTableVisible2 = true;
        get("/sys/user/listUserByGroup").then(res => {
          const that = this;
          if (res.code === 10000 && res.success) {
            let resData = res.data;
            that.wData.problemTakerData = resData.map(child => {
              if (
                child.users.length > 0 &&
                child.users[0].userId !== undefined
              ) {
                return {
                  title: child.groupName,
                  isLeaf: false,
                  children: child.users.map(function(child2) {
                    return {
                      title: child2.userName,
                      userId: child2.userId
                    };
                  })
                };
              } else {
                return {
                  title: child.groupName,
                  isLeaf: true,
                  children: []
                };
              }
            });
          } else {
            this.$message.error(res.message);
          }
        });
      } else if (type === "创建人" || type === "发布人") {
        this.$message({
          message: "暂无法添加" + type,
          type: "warning"
        });
      }
    },
    closeDialog() {
      this.wData.wKeyword = "";
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
    sureEdit() {
      // 如果是保存触发的校验
      // 弹窗确定时才进行保存
      if (this.editItem) {
        this.sendSaveMsg();
      }
      this.showSames = false;
      this.editItem = false;
    },
    getParMsg(val) {
      this.basicMsg = val.msg;
      // if (val.nodeList) {
      //   this.selectClear = true;
      //   this.nodeList = val.nodeList;
      // }
      if (val.nodeList > 1) {
        this.selectClear = true;
        this.nodeList = val.nodeList;
        let len = this.nodeList.length;
        console.log(this.nodeList[len - 1]);
        this.parentId = this.nodeList[len - 1].id;
      }
      this.getRuleSelect();
      this.getBasicMsg();
      this.getReferTable();
      this.getAccountMsg();
      // 获取应用列表
      this.getUsageInfo();
    }
  },
  watch: {
    // inputList: {
    //   handler(newVal, oldVal) {
    //     console.log(newVal, oldVal, "deep");
    //     this.changeInputList = newVal;
    //     // this.inputListChange ++
    //   },
    //   deep: true
    // },
    ruleForm: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal, "deep2");
        this.ruleFormChange++;
      },
      deep: true
    },
    filterText(val) {
      this.$refs.dutyUserTree.filter(val);
    },
    "wData.wKeyword"(val) {
      if (val === "") {
        this.wData.treeSelect = [];
      }
    }
  },
  activated() {
    // this.basicMsg = this.$route.params.msg;
    // if (this.$route.params.nodeList) {
    //   this.selectClear = true;
    //   this.nodeList = this.$route.params.nodeList;
    // }
    // this.getRuleSelect();
    // this.getBasicMsg();
    // this.getReferTable();
    // this.getAccountMsg();
    // // 获取应用列表
    // this.getUsageInfo();
  },
  created() {
    // console.log(this.$route.params, "params");
    // this.basicMsg = this.$route.params.msg;
    // if (this.$route.params.nodeList > 1) {
    //   this.selectClear = true;
    //   this.nodeList = this.$route.params.nodeList;
    //   let len = this.nodeList.length;
    //   console.log(this.nodeList[len - 1]);
    //   this.parentId = this.nodeList[len - 1].id;
    // }
    // this.getRuleSelect();
    // this.getBasicMsg();
    // this.getReferTable();
    // this.getAccountMsg();
    // // 获取应用列表
    // this.getUsageInfo();
  }
};
</script>
<style lang="scss" scoped>
//外层card容器样式
@import "./../../../../styles/dq/main-card-table.scss";
@import "../../../../styles/treeIconScoped";
$color-grey-light: #e0e0e0;
$collapse-header-size: 18px;
.rule-edit {
  padding: 12px;
  /deep/ .el-collapse {
    border: unset;
    margin-top: 20px;
  }
  /deep/ .el-collapse-item__header {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    font-size: $collapse-header-size;
    color: #666666;
    padding: 0 20px;
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
    overflow: hidden;
    padding: 20px;
  }
  /deep/ .el-tabs__item {
    height: 36px;
    width: 90px;
    line-height: 36px;
    text-align: center;
    padding: 0px !important;
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
  .relationTip {
    .el-dialog__header {
      padding: 20px 25px 10px;
      div {
        font-weight: 600;
        color: #666;
      }
    }
    /deep/ .el-dialog__body {
      padding: 30px 20px 15px !important;
      .el-form-item {
        margin-right: 0px;
        margin-bottom: 15px;
        .el-form-item__label {
          padding-right: 0px;
        }
        .el-form-item__content {
          width: 72%;
        }
      }
      .el-form-item.input {
        .el-form-item__content {
          width: 78%;
        }
      }
    }
  }
  .duty-dialog {
    /deep/ .el-dialog__body {
      padding: 30px 20px 10px;
    }
    .tag-box {
      font-size: 16px;
      padding: 0 15px;
      margin-bottom: 10px;
    }
    .tree-box {
      border: 1px solid rgba(233, 233, 233, 1);
      padding: 15px 40px;
      .tree-box_input {
        margin-bottom: 10px;
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
.code-table {
  margin-top: 10px;
  .code-pagination {
    margin-top: 10px;
    text-align: center;
  }
}

.rule-edit {
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
</style>