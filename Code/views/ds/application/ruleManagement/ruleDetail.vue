<template>
  <!-- 详情 -->
  <div class="p10">
    <div class="rule-detail">
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
        <!-- <el-button
          @click="deleteItem"
          class="basic-button fr"
          style="margin-left:10px;"
          type="danger"
        >
          <i class="dataTable-icon del"></i>删除
        </el-button>
        <el-button @click="handleEdit" class="basic-button fr" style type="warning">
          <i class="dataTable-icon edit"></i>编辑
        </el-button> -->
        <el-dropdown class="fr" @command="handleBlood">
          <el-button
            class="basic-button fr"
            style="width: 80px;padding: 0px 10px 0 35px;"
            type="primary"
          >
            <i class="dataTable-icon blood"></i>关系
            <!-- <svg-icon icon-class="xian"></svg-icon>
            <svg-icon icon-class="more"></svg-icon> -->
          </el-button>
          <el-dropdown-menu slot="dropdown" trigger="click">
            <el-dropdown-item :command="'backward'">参考</el-dropdown-item>
            <el-dropdown-item :command="'forward'">应用</el-dropdown-item>
            <el-dropdown-item :command="'full'">全链</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="rule-tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
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
            <el-collapse v-model="relationActiveNames" @change="handleChange">
              <!-- <el-collapse-item title="参考(Reference)" name="1">
                <div class="code-table">
                  <el-table
                    :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                    ref="multipleTable"
                    :data="ReferenceTable"
                    tooltip-effect="dark"
                    border
                    style="width: 100%"
                  >
                    <el-table-column show-overflow-tooltip align="center" label="标准名称">
                      <template slot-scope="scope">
                        <el-button type="text">{{ scope.row.name }}</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" show-overflow-tooltip prop="classifierName" label="标准类型"></el-table-column>
                    <el-table-column align="center" show-overflow-tooltip prop="code" label="标准代码"></el-table-column>
                    <el-table-column align="center" show-overflow-tooltip prop="path" label="上下文路径"></el-table-column>
                    <el-table-column align="center" show-overflow-tooltip prop="relationshipName" label="关系类型"></el-table-column>
                  </el-table>
                  <div class="code-pagination">
                    <el-pagination
                      background
                      @current-change="changeReferCurrent"
                      layout="prev, pager, next"
                      :total="referTotal"
                    ></el-pagination>
                  </div>
                </div>
              </el-collapse-item>-->
              <el-collapse-item title="应用" name="2">
                <div class="code-table">
                  <el-table
                    :header-cell-style="{background:'#f8f8f9',color:'#606266',textAlign:'left'}"
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
          </el-tab-pane>
          <el-tab-pane label="认责信息" name="third">
            <el-collapse v-model="confessActiveNames" @change="handleChange">
              <el-collapse-item title="创建人" name="1">
                <div class="confess-creator" v-for="(item, index) in creatorList" :key="index">
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
                </div>
                <div v-if="creatorList.length < 1">暂无数据</div>
              </el-collapse-item>
              <el-collapse-item title="发布人" name="2">
                <div class="confess-creator" v-for="(item, index) in issuerList" :key="index">
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
                </div>
                <div v-if="issuerList.length < 1">暂无数据</div>
              </el-collapse-item>
              <el-collapse-item title="使用人" name="3">
                <div class="confess-creator" v-for="(item, index) in userList" :key="index">
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
                </div>
                <div v-if="userList.length < 1">暂无数据</div>
              </el-collapse-item>
              <el-collapse-item title="归口责任人" name="4">
                <div class="confess-creator" v-for="(item, index) in dutyList" :key="index">
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
                </div>
                <div v-if="dutyList.length < 1">暂无数据</div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
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
      deleteDialog: false
    };
  },
  methods: {
    handleCollect() {
      console.log('click')
      if (this.collect) {
        get('/home/collection/cancelDsCollection', {
          instanceId: this.$route.params.id
        }).then(res => {
          console.log(res)
          if (res.code === 10000 && res.success) {
            this.$message.success('取消收藏成功')
          }
          this.getCollect()
        })
      } else {
        post('/home/collection/determineDsCollection', {
          instanceId: this.$route.params.id
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
        instanceId: this.$route.params.id
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
      // console.log(this.$route.params)
      this.$router.push({
        name: "ruleEdit",
        params: {
          msg: this.$route.params.row,
          _title: this.$route.params.row.instanceName,
          id: this.$route.params.row.instanceId,
          type: 'detail'
        }
      });
    },
    deleteItem() {
      this.deleteDialog = true;
      console.log(this.$refs.deleteMenuDialog)
      this.$nextTick(() => {
        this.$refs.deleteMenuDialog.getAllMsg(this.$route.params.row.instanceId);
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
          console.log(this.$route.params.row.instanceId);
          get("/ds/application/rule/removeRuleInfo", {
            ids: this.$route.params.row.instanceId
          }).then(res => {
            if (res.code === 10000 && res.success && res.success) {
              load.close()
              this.$message.success(res.message);
              this.deleteDialog = false;
              this.closeNavTag(this.$route);
              this.$router.push({ name: "ruleManagement" });
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
    getReferTable() {
      get("/ds/application/rule/listRuleReferenceInfos", {
        pageCurrent: this.referCurrent,
        pageSize: 10,
        ruleId: this.params.id
      }).then(res => {
        console.log(res);
        this.referTotal = res.data.total;
        this.ReferenceTable = res.data.records;
      });
    },
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
    changeUsageCurrent(val) {
      this.usageCurrent = val;
      this.getUsageTable();
    },
    // 获取标准认责信息
    getAccountMsg() {
      post("/ds/application/rule/listAccountability", {
        instanceId: this.params.id
      }).then(res => {
        console.log(res, "000");
        const data = res.data;
        this.creatorList = data.creator;
        this.issuerList = data.publisher;
        this.userList = data.user;
        this.dutyList = data.prncipal;
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
    }
  },
  activated() {
    console.log(this.$route.params, '023333');
    this.activeName = 'first'
    this.params = this.$route.params;
    this.getBasicMsg();
    this.getCollect()
  },
  created() {
    this.getCollect()
    console.log(this.$route.params, '023333');
    this.params = this.$route.params;
    this.getBasicMsg();
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
$titleSize: 20px;
$contentSize: 16px;
$collHeaderSize: 16px;
.rule-detail {
  background: #fff;
  padding: 40px 80px;
  .rule-title {
    height: 55px;
    line-height: 55px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
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
    padding: 35px;
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
