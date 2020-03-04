<template>
  <!-- 详情 -->
  <div class='detail-box'>
    <div class="rule-detail">
      <div style="border-bottom: 1px solid #e9e9e9;
        padding: 10px 11px 8px;"><el-button class="edit-back" @click="handleBack">返回</el-button>
      </div>
      <div class="rule-title">
        <!-- {{人均[per_capita]}} -->
        <span class="rule-title_content">
          <img style="width: 21px;height: 21px;" src alt />
          <!-- 人均[per_capita] -->
          <i @click="handleCollect" :style="{color:collect?'rgb(247, 186, 42)':'', cursor: 'pointer',marginRight:'5px'}" :class="[collect? 'el-icon-star-on' : 'el-icon-star-off']"></i>{{`${basicInfo.name}`}}<span v-if='basicInfo.enName'>{{`[${basicInfo.enName}]`}} </span>
        </span>
        <!-- <el-tag>已发布</el-tag> -->
        <el-tag v-if="basicInfo.publishStatus" size="small" type="success">{{basicInfo.publishStatus}}</el-tag>
        <!-- <div slot="header" class="clearfix card-title"> -->
        <div class="fr">
          <el-button
            v-permission="'RULE_DEL'"
            @click="deleteItem"
            class="basic-button fr"
            style="margin-left:10px;"
            type="danger"
          >
            <i class="dataTable-icon del"></i>删除
          </el-button>
          <el-button @click="handleEdit" v-permission="'RULE_EDIT'" class="basic-button fr" style type="warning">
            <i class="dataTable-icon edit"></i>编辑
          </el-button>
          <el-dropdown class="fr" @command="handleBlood">
            <el-button
              class="basic-button fr"
              style="width: 80px;padding: 0px 10px 0 35px;"
              type="primary"
            >
              <i class="dataTable-icon blood"></i>关系
              <!-- <svg-icon icon-class="xian"></svg-icon> -->
              <!-- <svg-icon icon-class="more"></svg-icon> -->
            </el-button>
            <el-dropdown-menu slot="dropdown" trigger="click">
              <el-dropdown-item :command="'backward'">参考</el-dropdown-item>
              <el-dropdown-item :command="'forward'">应用</el-dropdown-item>
              <el-dropdown-item :command="'full'">全链</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="rule-tabs">
        <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
          <div class="basic-content"></div>
          <el-tab-pane label="基本信息" name="first">
            <div class="base-msg">
              <p>
                <span>规则编号：</span>
                <span>{{basicInfo.code?basicInfo.code:"暂无数据"}}</span>
              </p>
              <p>
                <span>上下文路径：</span>
                <!-- <span>{{basicInfo.classifier}}</span> -->
                <span>{{basicInfo.path?basicInfo.path:"暂无数据"}}</span>
              </p>
              <p v-for="(item, index) in basicInfo.dsFeatureColVOS" :key="index">
                <!-- <span v-if="item.attCode === 'PubStatus'">
                  <span class="base-msg_label">{{item.attName}}:</span>
                  <span class="base-msg_content">{{item.attValue?item.attValue:"暂无数据"}}</span>
                </span>-->
                <span
                  :class="[item.attCode === 'Description'?'base-msg_label':'']"
                >{{item.attName}}：</span>
                <span
                  :class="[item.attCode === 'Description'?'base-msg_content':'']"
                >{{item.attValue?item.attValue:"暂无数据"}}</span>
              </p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="关系信息" name="second">
            <el-collapse value="1" class="relationship">
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
              <el-collapse-item title="应用" name="1">
                <div class="code-table">
                  <el-table
                    :header-cell-style="{background:'#f8f8f9',color:'#606266',textAlign: 'left'}"
                    ref="multipleTable"
                    :data="usageTable"
                    tooltip-effect="dark"
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      align="left"
                      prop="relationshipName"
                      label="关系类型"
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column align="left" show-overflow-tooltip prop="name" label="标准名称"></el-table-column>
                    <el-table-column
                      align="left"
                      show-overflow-tooltip
                      prop="classifierName"
                      label="标准类型"
                    ></el-table-column>
                    <el-table-column align="left" show-overflow-tooltip prop="path" label="上下文路径"></el-table-column>
                    <el-table-column align="left" show-overflow-tooltip label="标准代码">
                      <template slot-scope="scope">
                        <el-button @click="toDetail(scope.row)" type="text">{{ scope.row.code }}</el-button>
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
          </el-tab-pane>
          <el-tab-pane label="认责信息" name="third">
            <el-collapse v-model="confessActiveNames" @change="handleChange">
              <el-collapse-item title="创建人" name="1">
                <div class="confess-creator" v-for="(item, index) in creatorList" :key="index">
                  <svg-icon class="creator-icon" icon-class="see-user"></svg-icon>
                  <svg-icon class="creator-icon" icon-class="see-user"></svg-icon>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                      <p>部门：{{item.groupname}}</p>
                      <p>工作电话：{{item.workphone}}</p>
                      <p>邮箱：{{item.mail}}</p>
                      <p>手机号：{{item.mobilephone}}</p>
                    </div>
                    <el-button type="text">{{item.username}}</el-button>
                  </el-tooltip>
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
                </div>
                <div v-if="creatorList.length < 1">暂无数据</div>
                <!-- <div @click="addPerson(creatorList)" class="confess-creator confess-add">
                  <svg-icon class="creator-icon" icon-class="add"></svg-icon>
                  <el-button style="color: #666666;" type="text">增加</el-button>
                </div>-->
              </el-collapse-item>
              <el-collapse-item title="发布人" name="2">
                <div class="confess-creator" v-for="(item, index) in issuerList" :key="index">
                  <svg-icon class="creator-icon" icon-class="see-user"></svg-icon>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                      <p>部门：{{item.groupname}}</p>
                      <p>工作电话：{{item.workphone}}</p>
                      <p>邮箱:{{item.mail}}</p>
                      <p>手机号:{{item.mobilephone}}</p>
                    </div>
                    <el-button type="text">{{item.username}}</el-button>
                  </el-tooltip>
                  <!-- <svg-icon
                    @click.native="deletePerson(item)"
                    class="creator-icon"
                    style="right: -90px;cursor: pointer"
                    icon-class="delete-filter"
                  ></svg-icon>-->
                </div>
                <div v-if="issuerList.length < 1">暂无数据</div>
                <!-- <div @click="addPerson(issuerList)" class="confess-creator confess-add">
                  <svg-icon class="creator-icon" icon-class="add"></svg-icon>
                  <el-button style="color: #666666;" type="text">增加</el-button>
                </div>-->
              </el-collapse-item>
              <el-collapse-item title="使用人" name="3">
                <div class="confess-creator" v-for="(item, index) in userList" :key="index">
                  <svg-icon
                    class="creator-icon"
                    style="height: 22px;width: 22px;"
                    icon-class="see-user"
                  ></svg-icon>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                      <p>部门：{{item.groupname}}</p>
                      <p>工作电话：{{item.workphone}}</p>
                      <p>邮箱:{{item.mail}}</p>
                      <p>手机号:{{item.mobilephone}}</p>
                    </div>

                  <el-button type="text">{{item.username}}</el-button>
                  <!-- <el-button type="text">{{item.username}}</el-button> -->
                  </el-tooltip>
                  <!-- @click.native="deletePerson(item, index)" -->
                  <svg-icon
                    v-permission="'RULE_EDIT'"
                    @click.native="handleClose2(item, '使用人')"
                    class="creator-icon"
                    style="right: -90px;cursor: pointer"
                    icon-class="delete-filter"
                  ></svg-icon>
                </div>
                <div v-permission="'RULE_EDIT'" @click="addPerson('使用人')" class="confess-creator confess-add">
                  <svg-icon class="creator-icon" icon-class="add"></svg-icon>
                  <el-button style="color: #666666;" type="text">增加</el-button>
                </div>
              </el-collapse-item>
              <el-collapse-item title="归口责任人" name="4">
                <div class="confess-creator" v-for="(item, index) in dutyList" :key="index">
                  <svg-icon class="creator-icon" icon-class="see-user"></svg-icon>
                  <el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content">
                      <p>部门：{{item.groupname}}</p>
                      <p>工作电话：{{item.workphone}}</p>
                      <p>邮箱:{{item.mail}}</p>
                      <p>手机号:{{item.mobilephone}}</p>
                  </div>
                  <el-button type="text">{{item.username}}</el-button>
                  </el-tooltip>

                  <!-- <el-button type="text">{{item.username}}</el-button> -->
                  <svg-icon
                    v-if="IsParentIndex"
                    @click.native="handleClose2(item, '责任人')"
                    class="creator-icon"
                    style="right: -90px;cursor: pointer"
                    icon-class="delete-filter"
                  ></svg-icon>
                  <!-- </el-tooltip> -->
                  <!-- <svg-icon
                    @click.native="deletePerson(item)"
                    class="creator-icon"
                    style="right: -90px;cursor: pointer"
                    icon-class="delete-filter"
                  ></svg-icon>-->
                </div>
                <!-- <div v-if="dutyList.length < 1">暂无数据</div> -->
                <div
                  v-if="dutyList.length < 1"
                  @click="addPerson('责任人')"
                  class="confess-creator confess-add"
                >
                  <svg-icon class="creator-icon" icon-class="add"></svg-icon>
                  <el-button style="color: #666666;" type="text">增加</el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 关系信息  新增参考弹窗 -->
    <el-dialog append-to-body :visible.sync="dialogTableVisible" class="relationTip">
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
    </el-dialog>
    <!-- 认责信息  新增弹窗 -->
    <el-dialog
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
      ></el-tree>
      <div class="tree-select-div people" v-if="wData.treeSelect.length>0">
        <div v-for="select in wData.treeSelect" :key="select.userId" class="item">
          <p @click="selectTreeValue(select)">{{select.title}} （{{ select.parent }}）</p>
          <!-- <Icon type="ios-checkmark" color="#1890ff"></Icon> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="deleteDialog" class="delete-dialog" title="删除提示" width="50%">
      <delete-dialog ref="deleteMenuDialog"></delete-dialog>
      <div class="dialog-btn">
        <el-button type="primary" @click="handleDelete()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { get, post } from "@/utils/request";
import { loading } from "@/utils/layer";
import { generateLineageTitle } from "@/utils";
import deleteDialog from "../../deleteDialog/deleteDialog";

export default {
  name: "",
  components: {
    deleteDialog
  },
  data() {
    return {
      // 是否被收藏
      collect: false,
      // 是否显示 维度值信息
      wdz: true,
      activeName: "first",
      // 关系默认折叠
      relationActiveNames: ["1", "2", "3", "4"],
      // 认责默认折叠
      confessActiveNames: ["1", "2", "3", "4"],
      // 维度值默认折叠
      wdzActiveNames: ["1", "2"],
      tableData: [
        {
          codeNum: "01",
          codeDesc: "居民身份证",
          codeMean: "居民身份证"
        },
        {
          codeNum: "02",
          codeDesc: "居民身份证",
          codeMean: "居民身份证"
        },
        {
          codeNum: "03",
          codeDesc: "居民身份证",
          codeMean: "居民身份证"
        },
        {
          codeNum: "04",
          codeDesc: "居民身份证",
          codeMean: "居民身份证"
        }
      ],
      // 参考列表
      ReferenceTable: [],
      referCurrent: 1,
      referTotal: 0,
      // 应用列表
      usageTotal: 0,
      usageTable: [],
      usageCurrent: 1,
      // 创建人列表
      creatorList: [],
      // 发布人列表
      issuerList: [],
      // 使用人列表
      userList: [],
      // 责任人列表
      dutyList: [],
      // 页面跳转收到的参数
      params: {},
      basicInfo: {},
      deleteDialog: false,
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
      dialogTableVisible: false,
      treeData: [],
      inputListChange: {},
      oldInputList: "",
      ruleFormChange: 0,
      oldRuleForm: "",
      oldUserList: [],
      selectReferList: [],
      namespace: "",
      changeBasic: true,
      changeDuty: true,
      addNode: false,
      nodeList: [],
      parentId: "",
      sameList: [],
      showSames: false,
      editItem: false,
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
      userType: "",
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
      }
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
    handleCollect() {
      console.log('click')
      if (this.collect) {
        get('/home/collection/cancelDsCollection', {
          instanceId: this.params.id
        }).then(res => {
          console.log(res)
          if (res.code === 10000 && res.success) {
            this.$message.success('取消收藏成功')
          }
          this.getCollect()
        })
      } else {
        post('/home/collection/determineDsCollection', {
          instanceId: this.params.id
        }).then(res => {
          console.log(res)
          if (res.code === 10000 && res.success) {
            this.$message.success('收藏成功')
          }
          this.getCollect()
        })
      }
    },
    // 是否被收藏
    getCollect() {
      get('/home/collection/weatherDsCollection', {
        instanceId: this.params.id
      }).then(res => {
        console.log(res, 'collect')
        this.collect = res.data
      })
    },
    handleClick(val) {
      console.log(val);
      if (val.label === "基本信息") {
        console.log(val.label);
        this.getBasicMsg();
      } else if (val.label === "关系信息") {
        console.log(val.label);
        this.getReferTable();
        this.getUsageTable();
      } else {
        console.log(val.label);
        // 认责信息
        this.getAccountMsg();
      }
    },
    handleChange(val) {
      console.log(val);
    },
    handleBlood(command) {
      this.$router.push({
        name: "dsLineageAnalysisCanvas",
        params: {
          dataFlowType: command,
          id: this.basicInfo.id,
          _title: generateLineageTitle(command, this.basicInfo.name)
        }
      });
    },
    handleEdit() {
      // console.log(this.params)
      // let params = {
      //   msg: this.params.row,
      //   _title: this.params.row.instanceName,
      //   id: this.params.row.instanceId,
      //   type: 'detail'
      // }
      this.params.row.type = 'detail'
      this.$emit('editRule', this.params.row)
      // this.$router.push({
      //   name: "ruleEdit",
      //   params: {
      //     msg: this.params.row,
      //     _title: this.params.row.instanceName,
      //     id: this.params.row.instanceId,
      //     type: 'detail'
      //   }
      // });
    },
    deleteItem() {
      this.deleteDialog = true;
      console.log(this.$refs.deleteMenuDialog)
      this.$nextTick(() => {
        this.$refs.deleteMenuDialog.getAllMsg(this.params.row.instanceId);
      })
    },
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
          console.log(this.params.row.instanceId);
          get("/ds/application/rule/removeRuleInfo", {
            ids: this.params.row.instanceId
          }).then(res => {
            if (res.code === 10000 && res.success && res.success) {
              load.close()
              this.$message.success(res.message);
              this.deleteDialog = false;
              // this.closeNavTag(this.$route);
              this.$emit('refreshTable')
              // this.$router.push({ name: "ruleManagement" });
              this.$emit('showMain')
            } else {
              load.close()
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
    handleBack() {
      this.$emit('showMain')
    },
    // 查询基本信息
    getBasicMsg() {
      get("/ds/application/rule/getRuleInfoDetail", {
        id: this.params.id
      }).then(res => {
        console.log(res);
        // const data = res.data.ds
        this.basicInfo = res.data;
        res.data.dsFeatureColVOS.map(item => {
          // item.dsFeatureColVOS.map(i => {
          if (item.attName === "发布状态") {
            this.basicInfo.publishStatus = item.attValue;
          }
          if (item.attCode === "EnglishName") {
            this.basicInfo.enName = item.attValue ? item.attValue : "";
          }
        });
        // })
      });
    },
    // 获取关系信息   参考列表
    // getReferTable() {
    //   get("/ds/application/rule/listRuleReferenceInfos", {
    //     pageCurrent: this.referCurrent,
    //     pageSize: 10,
    //     ruleId: this.params.id
    //   }).then(res => {
    //     console.log(res);
    //     this.referTotal = res.data.total;
    //     this.ReferenceTable = res.data.records;
    //   });
    // },
    // 参考列表  翻页
    changeReferCurrent(val) {
      this.referCurrent = val;
      this.getReferTable();
    },
    // 获取关系信息   应用列表
    getUsageTable() {
      get("/ds/application/rule/listRuleUsageInfos", {
        pageCurrent: this.usageCurrent,
        pageSize: 10,
        ruleId: this.params.id
      }).then(res => {
        console.log(res, 2);
        this.usageTable = res.data.records;
        this.usageTotal = res.data.total;
      });
    },
    // 应用列表  翻页
    // changeUsageCurrent(val) {
    //   this.usageCurrent = val;
    //   this.getUsageTable();
    // },
    // 获取标准认责信息
    // getAccountMsg() {
    //   post("/ds/application/rule/listAccountability", {
    //     instanceId: this.params.id
    //   }).then(res => {
    //     console.log(res, "000");
    //     const data = res.data;
    //     this.creatorList = data.creator;
    //     this.issuerList = data.publisher;
    //     this.userList = data.user;
    //     this.dutyList = data.prncipal;
    //   });
    // },
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
    // isActive(route) {
    //   return route.path === this.$route.path;
    // },
    getParMsg(val) {
      console.log(val)
      this.activeName = 'first'
      this.params = val;
      this.basicMsg = val.row
      this.getBasicMsg();
      this.getCollect()
    },
    //    dddddddddddddddddddddddddddddddddddddd
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
    // closeNavTag(view) {
    //   this.$store.dispatch("delVisitedViews", view).then(views => {
    //     if (this.isActive(view)) {
    //       const latestView = views.slice(-1)[0];
    //       if (latestView) {
    //         this.$router.push(latestView);
    //       } else {
    //         this.$router.push("professionalTerms");
    //       }
    //     }
    //   });
    // },
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
      let row = item;
      row.instanceName = item.name;
      row.instanceId = item.id;
      this.$router.push({
        name: "ruleDetail",
        params: { id: item.id, _title: item.name, row: item }
      });
    },
    toDetail(item) {
      console.log(item)
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
    // getParMsg(val) {
    //   this.activeName = 'first'
    //   this.basicMsg = val.msg;
    //   // if (val.nodeList) {
    //   //   this.selectClear = true;
    //   //   this.nodeList = val.nodeList;
    //   // }
    //   if (val.nodeList > 1) {
    //     this.selectClear = true;
    //     this.nodeList = val.nodeList;
    //     let len = this.nodeList.length;
    //     console.log(this.nodeList[len - 1]);
    //     this.parentId = this.nodeList[len - 1].id;
    //   }
    //   this.getRuleSelect();
    //   this.getBasicMsg();
    //   this.getReferTable();
    //   this.getAccountMsg();
    //   // 获取应用列表
    //   this.getUsageInfo();
    // },
    getRuleSelect() {
      get("/ds/application/rule/getRuleClassifierInfos").then(res => {
        console.log(res);
        this.ruleTreeData = res.data;
      });
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
    // console.log(this.params, '023333');
    // this.activeName = 'first'
    // this.params = this.params;
    // this.getBasicMsg();
    // this.getCollect()
  },
  created() {
    // this.getCollect()
    // console.log(this.params, '023333');
    // this.params = this.params;
    // this.getBasicMsg();
  }
};
</script>
<style>
th {
  font-weight: 100;
}
</style>
<style lang="scss" scoped>
// $titleSize: 28px;
$titleSize: 18px;
$contentSize: 16px;
$collHeaderSize: 16px;
.detail-box {
  height: calc(100vh - 115px);
  min-height: 100%;
  background: #fff
}
.el-dropdown-menu {
  padding: 0;
}
.rule-detail {
  background: #fff;
  // height: 100%;
  // padding-top: 16px !important;
  padding: 0 10px !important;
  position: relative;
  .rule-title {
    // height: 55px;
    // line-height: 55px;
    // padding-top: 15px;
    padding: 20px;
    padding-bottom: 0;
    overflow: hidden;
    // border-bottom: 1px solid rgba(233, 233, 233, 1);
    .rule-title_content {
      font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC";
      font-weight: 650;
      font-style: normal;
      vertical-align: middle;
      font-size: $titleSize;
      color: rgba(102, 102, 102, 0.847058823529412);
      line-height: 24px;
    }
    /deep/ .el-tag {
      vertical-align: middle;
    }
    .basic-button {
      height: 34px;
      width: 85px;
      padding: 0 15px 0 35px;
      margin: 0 5px;
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
      background: url(../../../../assets/images/commonIcon/blood-icon.png)
        no-repeat;
      background-size: 100%;
    }
    .edit {
      background: url(../../../../assets/images/commonIcon/edit.png)
        no-repeat;
      background-size: 100%;
    }
    .del {
      background: url(../../../../assets/images/commonIcon/del.png)
        no-repeat;
      background-size: 100%;
    }
    .add {
      background: url(../../../../assets/images/commonIcon/add.png)
        no-repeat;
      background-size: 100%;
    }
  }
  .rule-tabs {
    padding: 15px 20px 20px;
    /deep/ .el-collapse {
      border: unset;
      // margin-top: 20px;
    }
    /deep/ .el-collapse-item__header {
      font-family: "PingFangSC-Regular", "PingFang SC";
      font-weight: 400;
      font-style: normal;
      font-size: $collHeaderSize;
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
      padding: 0 20px;
    }
    .base-msg {
      padding-top: 20px;
      p {
        overflow: hidden;
        font-size: $contentSize;
        color: #666666;
        margin-bottom: 40px;
      }
      .base-msg_label {
        width: 60px;
        float: left;
      }
      .base-msg_content {
        display: block;
        float: right;
        width: calc(100% - 60px);
      }
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
.confess-creator {
  // width: 189px;
  width: 130px;
  line-height: 40px;
  height: 40px;
  // height: 58px;
  border: 1px solid rgb(48, 65, 86);
  float: left;
  margin-left: 10px;
  position: relative;
  text-align: center;
  // line-height: 58px;
  padding-left: 10px;
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
  // margin: 0 -20px -20px;
}
.el-dropdown-menu__item {
    padding: 0;
    text-align: center;
    width: 80px;
  }
</style>