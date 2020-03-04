<template>
  <!-- 业务术语详情 -->
  <div class="right-basic">
    <div class="professional-title">
      <span class="professional-title-content">
        <span class="tubiao"  @click="handleCollect">
          <i v-show="!favorite" class="el-icon-star-off"></i>
          <i v-show="favorite" style="color: rgb(255, 235, 59);" class="el-icon-star-on"></i>
        </span>
        {{EnName?oDetails.name+' ['+EnName+']':oDetails.name}}
      </span>
      <el-tag size="small" type="success" v-if="oDetails.state">{{oDetails.state}}</el-tag>
      <!-- <el-button
        @click="handleDeleteShow"
        class="basic-button fr"
        style="margin-left:10px;"
        type="danger"
      >
        <i class="dataTable-icon del"></i>删除
      </el-button>
      <el-button @click="handleEdit" class="basic-button fr" style type="warning">
        <i class="dataTable-icon edit"></i>编辑
      </el-button> -->
      <el-dropdown  @command="handleCommand" class="fr">
        <el-button
          class="basic-button fr"
          style="width: 83px;padding-left: 20px;height: 34px;"
          type="primary">
          <i class="dataTable-icon blood"></i>关系
        </el-button>
        <el-dropdown-menu slot="dropdown" trigger="click" style="width:83px;margin-left:3px">
          <el-dropdown-item :command="'backward'">参&nbsp&nbsp&nbsp考</el-dropdown-item>
          <el-dropdown-item :command="'forward'">应&nbsp&nbsp&nbsp用</el-dropdown-item>
          <el-dropdown-item :command="'full'">全&nbsp&nbsp&nbsp链</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="termtabs">
      <el-tabs v-model="activeName"  @tab-click="handleClickTab" >
        <el-tab-pane label="基本信息" name="first">
          <div class="detail-baseinfo">
            <!-- <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="first">
                <div class="code-table">
                  <p v-for="(item,index) in otherInfo" :key="index">
                    <span>{{item.attrName+'：'}}</span>
                    <span>{{item.attrValue}}</span>
                  </p>
                </div>
              </el-collapse-item>
            </el-collapse> -->
            <p v-for="(item,index) in otherInfo" :key="index" class="baseinfo-p">
              <span>{{item.attrName+'：'}}</span>
              <span>{{item.attrValue}}</span>
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="关系信息" name="second">
          <div class="detail-collapse">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="应用" name="first">
                <div class="code-table">
                  <el-table
                    :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    border
                    :default-sort = "{prop: 'relationshipName', order: 'descending'}"
                    style="width: 100%">
                    <el-table-column
                      align="center"
                      sortable
                      prop="relationshipName"
                      label="关系类型"
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column align="center" prop="name" sortable label="标准名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="classifierName" sortable label="标准类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="context" sortable label="上下文路径" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" label="标准代码" sortable show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-button type="text" @click="clicktoInstanceCode(scope.row)">{{ scope.row.code }}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="code-pagination">
                    <el-pagination 
                    background 
                    layout="prev, pager, next" 
                    :total="total"
                    :page-size="ipageSize"
                    @current-change="changePage">
                    </el-pagination>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="认责信息" name="third">
          <el-collapse v-model="confessActiveNames" class="detail-collapse">
            <el-collapse-item title="创建人" name="1">
              <div class="confess-creator" v-for="(item, index) in creatorList" :key="index">
                <svg-icon class="creator-icon" icon-class="see-user"></svg-icon>
                <el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content">
                    <p>部门：{{item.groupname}}</p>
                    <p>工作电话：{{item.workphone}}</p>
                    <p>邮箱:{{item.mail}}</p>
                    <p>手机号:{{item.mobilePhone}}</p>
                  </div>
                  <el-button type="text">{{item.username}}</el-button>
                </el-tooltip>
              </div>
              <div v-if="creatorList.length < 1">暂无数据</div>
            </el-collapse-item>
            <el-collapse-item title="发布人" name="2">
              <div class="confess-creator" v-for="(item, index) in publisher" :key="index">
                <svg-icon class="creator-icon" icon-class="see-user"></svg-icon>
                <el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content">
                    <p>部门：{{item.groupname}}</p>
                    <p>工作电话：{{item.workphone}}</p>
                    <p>邮箱:{{item.mail}}</p>
                    <p>手机号:{{item.mobilePhone}}</p>
                  </div>
                  <el-button type="text">{{item.username}}</el-button>
                </el-tooltip>
              </div>
              <div v-if="publisher.length < 1">暂无数据</div>
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
                    <p>手机号:{{item.mobilePhone}}</p>
                  </div>
                  <el-button type="text">{{item.username}}</el-button>
                </el-tooltip>
                <!-- <svg-icon
                  @click.native="handleClose2(item, '使用人')"
                  class="creator-icon"
                  style="right: -90px;cursor: pointer"
                  icon-class="delete-filter"
                ></svg-icon> -->
              </div>
              <div v-if="userList.length < 1">暂无数据</div>
              <!-- <div @click="addPerson('使用人')" class="confess-creator confess-add">
                <svg-icon class="creator-icon" icon-class="add"></svg-icon>
                <el-button style="color: #666666;" type="text">增加</el-button>
              </div> -->
            </el-collapse-item>
            <el-collapse-item title="归口责任人" name="4">
              <div class="confess-creator" v-for="(item, index) in dutyList" :key="index">
                <svg-icon class="creator-icon" icon-class="see-user"></svg-icon>
                <el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content">
                    <p>部门：{{item.groupname}}</p>
                    <p>工作电话：{{item.workphone}}</p>
                    <p>邮箱:{{item.mail}}</p>
                    <p>手机号:{{item.mobilePhone}}</p>
                  </div>
                  <el-button type="text">{{item.username}}</el-button>
                </el-tooltip>
                <!-- <svg-icon
                  v-if="IsParentIndex"
                  @click.native="handleClose2(item, '责任人')"
                  class="creator-icon"
                  style="right: -90px;cursor: pointer"
                  icon-class="delete-filter"
                ></svg-icon> -->
              </div>
              <!-- <div
                v-if="dutyList.length < 1"
                @click="addPerson('责任人')"
                class="confess-creator confess-add"
              >
                <svg-icon class="creator-icon" icon-class="add"></svg-icon>
                <el-button style="color: #666666;" type="text">增加</el-button>
              </div> -->
              <div v-if="dutyList.length < 1">暂无数据</div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :visible.sync="deleteDialog" class="delete-dialog" title="删除提示" width="50%">
      <delete-dialog ref="deleteMenuDialog"></delete-dialog>
      <div class="dialog-btn">
        <el-button type="primary" @click="handleDelete()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
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
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { get, post } from '@/utils/request'
import { generateLineageTitle } from '@/utils'
import deleteDialog from "../deleteDialog/deleteDialog";
import pinyin from "pinyin";
export default {
  name: "professionalDetail",
  components: {
    deleteDialog
  },
  data() {
    return {
      // 默认当前激活的面板
      activeNames: ["first"],
      oDetails: {
        name: '',
        eName: '',
        abridge: '',
        definition: '',
        state: '',
        ranges: '',
        dataType: '',
        path: ''
      },
      tableData: [],
      // paganation数据
      icurrentPage: 1,
      ipageSize: 10,
      total: 10,
      deleteDialog: false,
      favorite: false,
      EnName: null,
      otherInfo: [],
      activeName: 'first',
      confessActiveNames: ["1", "2", "3", "4"],
      creatorList: [],
      publisher: [],
      userList: [],
      dutyList: [],
      // 新增编辑认责信息
      dialogTableVisible2: false,
      // 是否是根节点数据
      IsParentIndex: null,
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
      filterText: ""
    }
  },
  methods: {
    /*
    认责信息部分
    */
    handleClose(tag) {
      this.wData.filterSponsorArr.splice(
        this.wData.filterSponsorArr.indexOf(tag), 1);
      this.wData.pfilterSponsorArr.splice(
        this.wData.pfilterSponsorArr.indexOf(tag.userId), 1);
    },
    toSearch() {
      // console.log("input");
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
    selectTreeValue(data) {
      // console.log(this.wData.filterSponsorArr);
      // console.log(data);
      // console.log(this.dutyList, "duty");
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
      // console.log(
      //   this.dutyList,
      //   that.wData.filterSponsorArr,
      //   that.wData.pfilterSponsorArr,
      //   "emmm"
      // );
    },
    sure() {
      // console.log(this.dutyList, "sure");
      if (this.userType === "责任人") {
        // console.log(this.wData.filterSponsorArr, "data");
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
    // 认责树 筛选
    filterNode(value, data) {
      // console.log(value, data);
      if (!value) return true;
      return data.userName.indexOf(value) !== -1;
    },
    handleClose2(tag, type) {
      // console.log(tag);
      // console.log(this.dutyList);
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addPerson(item) {
      this.userType = item;
      // console.log(this.wData.pfilterSponsorArr);
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
      this.addNewAccount(item);
      this.dialogTableVisible2 = true;
    },
    // 保存认责信息的新增
    addDutyMsg() {
      // console.log(this.userList, "uselist");
      // console.log(this.dutyList, "dutyList");
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
        instanceId: this.$route.params.id
      };
      post("/ds/application/rule/editAccountability", msg).then(res => {
        // console.log(res);
        if (res.code === 10000 && res.success) {
          this.$message.success(res.message);
          // this.changeDuty = true;
          this.getDetailUsage();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleClickTab() {

    },
    handleBack() {
      // console.log("11111", this.$parent)
      this.$emit("showMainDetItem", "card")
    },
    // 收藏或取消收藏
    handleCollect() {
      this.favorite = !this.favorite;
      if (this.favorite) {
        post("/home/collection/determineDsCollection", {
          instanceId: this.$route.params.id
        }).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        });
      } else {
        get("/home/collection/cancelDsCollection", {
          instanceId: this.$route.params.id
        }).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        });
      }
    },
    clicktoInstanceCode(row) {
      // console.log(row)
      if (row.classifierId === "MasterDataInfoItem") {
        this.$router.push({
          name: 'masterDataDetails',
          params: {
            id: row.id,
            classifierId: row.classifierId,
            _title: row.name,
            headerTitle: row.name
          }
        })
      } else {
        this.$router.push({
          name: 'indexManagementDetails',
          params: {
            id: row.id,
            classifierId: row.classifierId,
            _title: row.name
          }
        })
      }
    },
    handleCommand(command) {
      // console.log("commandcommand", command)
      // console.log("this.$route.params.name", this.$route.params.name)
      this.$router.push({
        name: 'dsLineageAnalysisCanvas',
        params: {
          dataFlowType: command,
          id: this.$route.params.id,
          _title: generateLineageTitle(command, this.$route.params.name)
        }
      })
    },
    handleEdit() {
      let temprow = {
        id: this.$route.params.id,
        _title: this.$route.params.name,
        nodeList: this.$route.params.nodeList
      }
      this.$router.push({
        name: 'professionalTerms'
      })
      this.$emit("handleEdit", temprow)
    },
    // 删除
    handleDeleteShow() {
      this.deleteDialog = true;
      // console.log(this.$refs.deleteMenuDialog)
      this.$nextTick(() => {
        this.$refs.deleteMenuDialog.getAllMsg(this.$route.params.id);
      })
    },
    handleDelete() {
      this.$confirm(
        "您的操作将会永久删除所选业务术语及其相关关系，确定继续吗?",
        "警告",
        {
          confirmButtonText: "继续",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let id = this.$route.params.id
          get('/ds/bizTerm/deleteBatchBuzTerms', { buzTermIds: id }).then(res => {
            if (res.code === 10000 && res.success === true) {
              this.$message.success(res.message)
              this.closeSelectedTag(this.$route)
              // this.$emit("showMainDetItem", "card")
            } else {
              this.$message.error(res.message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // getDetail() {
    //   get('/ds/bizTerm/queryBuzTermDetails', {
    //     buzTermId: this.$route.params.id
    //   }).then(res => {
    //     if (res.code === 10000 && res.success === true) {
    //       this.oDetails.name = res.data.buzTermName
    //       this.oDetails.eName = res.data.buzTermEnName
    //       this.oDetails.state = res.data.publishStatus
    //       this.EnName = res.data.buzTermEnName
    //       this.otherInfo = res.data.basicInfo
    //     } else {
    //       this.$message.error(res.message)
    //     }
    //     console.log(this.EnName, 'EnName')
    //   })
    // },
    getDetailUsage() {
      get('/ds/bizTerm/queryUsageRelations', {
        buzTermId: this.$route.params.id,
        pageCurrent: this.icurrentPage,
        pageSize: this.ipageSize
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getDetailBuzTerm() {
      get('/ds/bizTerm/queryBuzTermDetails', {
        buzTermId: this.$route.params.id
      }).then(res => {
        // console.log("222222", res)
        if (res.code === 10000 && res.success === true) {
          // 初始化时获取基本信息
          this.oDetails.name = res.data.buzTermName
          this.oDetails.eName = res.data.buzTermEnName
          this.oDetails.state = res.data.publishStatus
          this.EnName = res.data.buzTermEnName
          this.otherInfo = res.data.detailInfo
          // 初始化时获取应用信息
          this.tableData = res.data.relationshipInfo.usageInfo.records
          this.total = res.data.relationshipInfo.usageInfo.total
          // 初始化时获取认责信息数据
          this.IsParentIndex = res.data.accusationInfo.supIsParentIndex;
          this.creatorList = res.data.accusationInfo.creator
          this.publisher = res.data.accusationInfo.publisher
          this.userList = res.data.accusationInfo.user.map(item => {
            item.id = item.userId;
            return item;
          });
          this.dutyList = res.data.accusationInfo.prncipal
        } else {
          this.$message.error(res.message)
        }
      })
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          let latestView = null
          views.map(val => {
            if (val.name === 'professionalTerms') {
              latestView = val
            }
          })
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/ds/professionalTerms')
          }
        }
      })
    },
    changePage(value) {
      this.icurrentPage = value
      this.getDetailUsage();
    },
    isFavorite() {
      get('/home/collection/weatherDsCollection', {
        instanceId: this.$route.params.id
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.favorite = res.data
        } else {
          this.$message.error(res.message)
        }
      })
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
      // console.log(this.wData.wKeyword, res, "kwd");
      this.wData.treeSelect = selectArr;
    }
  },
  created() {
    // this.getDetail();
    // this.getDetailUsage();
    this.isFavorite()
    this.getDetailBuzTerm()
  }
};
</script>
<style>
th {
  font-weight: 100;
}
</style>
<style lang="scss" scoped>
@import "./../../../styles/dq/main-card-table.scss";
// $titleSize: 28px;
$titleSize: 20px;
$contentSize: 16px;
$collHeaderSize: 18px;
.right-basic{
  background: #fff;
  padding: 32px 60px;
  height: 100%;
  overflow: auto;
 /deep/ .el-collapse {
    border: unset;
    margin-top: 0px;
  }
  /deep/ .el-collapse-item__header {
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    font-size: 17px;
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
    width: 86px;
    line-height: 36px;
    text-align: center;
    padding: 0px;
    font-size:13px;
  }
  /deep/ .el-tabs__nav-wrap::after {
    background-color: unset;
  }
  /deep/ .el-tabs__content {
    padding: 0 15px;
  }
  /deep/ .el-tabs--top.el-tabs--card>.el-tabs__header .el-tabs__item:nth-child(2){
    padding-left:0px
  }
  /deep/ .el-tabs--top .el-tabs__item.is-top:last-child{
    padding-right:0px
  }
  .detail-return{
    height: 55px;
    padding: 5px 50px;
    border-bottom: 1px solid rgba(228, 228, 228, 1);
    padding-left: 10px;
  }
  .professional-title {
    margin-bottom:10px;
    height: 60px;
    line-height: 55px;
    padding-bottom: 5px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
    .professional-title-content {
      font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC";
      font-weight: 650;
      font-style: normal;
      font-size: $titleSize;
      color: rgba(102, 102, 102, 0.847058823529412);
      line-height: 55px;
      text-align: center;
      .tubiao{
         line-height:26px;
          font-size: 18px;
      }
    }
    .basic-button {
      height: 34px;
      width: 85px;
      padding: 0 15px 0 35px;
      position: relative;
      margin-top:9px
    }
    .dataTable-icon {
      position: absolute;
      display: inline-block;
      width: 22px;
      height: 22px;
      left: 7px;
      top: 4px;
    }
    .blood {
      background: url(../../../../src/assets/images/commonIcon/blood-icon.png)
        no-repeat;
      background-size: 100%;
    }
    .edit {
      background: url(../../../../src/assets/images/commonIcon/edit.png)
        no-repeat;
      background-size: 100%;
    }
    .del {
      background: url(../../../../src/assets/images/commonIcon/del.png)
        no-repeat;
      background-size: 100%;
    }
    .add {
      background: url(../../../../src/assets/images/commonIcon/add.png)
        no-repeat;
      background-size: 100%;
    }
  }
  
  .detail-baseinfo{
    .baseinfo-p{
      overflow:hidden;
      font-size:16px;
      color:#666666;
      margin-bottom:30px
    }
  }
  .termtabs {
    padding: 20px;
    /deep/ .el-collapse {
      border: unset;
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
      height: 46px;
      width: 106px;
      line-height: 46px;
      text-align: center;
      padding: 0px;
      font-size:14px
    }
    /deep/ .el-tabs__nav-wrap::after {
      background-color: unset;
    }
    /deep/ .el-tabs__content {
      padding: 15px;
    }
  }
  .delete-dialog {
  /deep/ .el-dialog__body {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  //对话框上、下分隔线
    /deep/  .el-dialog__header {
          border-bottom: 1px solid #e8ebed;
          .el-dialog__title{
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            color: #17233d;
            font-weight: 700;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
      }
    /deep/ .el-dialog__wrapper {
      .el-dialog {
        .el-dialog__footer {
          border-top: 1px solid #e8ebed;
        }
      }
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
.code-table {
  margin-top: 10px;
  .code-pagination {
    margin-top: 10px;
    text-align: center;
  }
}
</style>