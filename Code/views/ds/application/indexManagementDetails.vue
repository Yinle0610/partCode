<!--指标管理 详情页面-->
<template>
  <div class="index-management-details dashboard-editor-container">
    <el-card shadow="hover" class="card-container">
      <div slot="header" class="clearfix card-header">
        <span class="collect"  @click="handleCollect">
          <i v-show="!favorite" class="el-icon-star-off"></i>
          <i v-show="favorite" style="color: rgb(255, 235, 59);" class="el-icon-star-on"></i>
        </span>
        <span class="title"> {{headerTitle}} </span>  <el-tag type="success">{{sStatus}}</el-tag>
        <div class="button-box" style="float: right">
          <el-dropdown @command="handleCommand">
            <el-button type="primary" size="mini" class="btn1">
              <i class="dataTable-icon blood"></i><span class="btn-text">关系</span>
              <!-- <svg-icon icon-class="xian"></svg-icon>
              <svg-icon icon-class="more"></svg-icon> -->
            </el-button>
            <el-dropdown-menu class="detail-drop" slot="dropdown" trigger="click">
              <el-dropdown-item :command="'backward'">参考</el-dropdown-item>
              <el-dropdown-item :command="'forward'">应用</el-dropdown-item>
              <el-dropdown-item :command="'full'">全链</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button type="warning" size="mini" class="btn" @click="toEdit"><svg-icon icon-class="xiugai" ></svg-icon> <span class="btn-text">编辑</span> </el-button> -->
          <!-- <el-button type="danger" size="mini" class="btn add" @click="deleteItem"><svg-icon icon-class="shanchu" ></svg-icon> <span class="btn-text">删除</span> </el-button> -->
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first" class="base-info">
          <el-collapse v-model="aBaseInfoActiveNames" @change="handleChange">
            <el-collapse-item class="title" :title="oBaseInfoData.oBusinessData.sTitle" name="1">
              <div class="content" v-for="item in oBaseInfoData.oBusinessData.aList" :key="item.key">
                <div v-if="item.key !== '技术口径'" >
                  <span class="content-key" >{{ item.key + '：' }}</span> <div class="content-value">{{ item.value }}</div>
                  <div class="clearfix"></div>
                </div>
                <div v-if="item.key === '技术口径'">
                  <span class="content-key" >{{ item.key+ '：' }}</span>
                  <div class="content-value">
                    <div class="tech-caliber">
                      <div v-highlight v-if="oTechCaliberValue !== undefined "><pre><code class='lang-SQL hljs'>{{ oTechCaliberValue }}</code></pre></div>
                    </div>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item class="title" :title="oBaseInfoData.oTechAttr.sTitle" name="2">
              <div class="content" v-for="item in oBaseInfoData.oTechAttr.aList" :key="item.key">
                <div v-if="item.key !== '技术口径'" >
                  <span class="content-key" >{{ item.key + '：' }}</span> <div class="content-value">{{ item.value }}</div>
                  <div class="clearfix"></div>
                </div>
                <div v-if="item.key === '技术口径'">
                  <span class="content-key" >{{ item.key+ '：' }}</span>
                  <div class="content-value">
                    <div class="tech-caliber">
                      <div v-highlight v-if="oTechCaliberValue !== undefined "><pre><code class='lang-SQL hljs'>{{ oTechCaliberValue }}</code></pre></div>
                    </div>
                  </div>
                  <div class="clearfix"></div>
                </div>
<!--                <span class="content-key" >{{ item.key + '：' }}</span> <span class="content-value">{{ item.value }}</span>-->
<!--                <div class="clearfix"></div>-->
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane label="关系信息" name="second" class="base-info">
          <el-collapse v-model="aRelationInfoActiveNames">
            <el-collapse-item class="title" title="参考(Reference)" name="1">
              <el-card class="card-table">
                <el-table
                    border
                    size="mini"
                    align="left"
                    :data="oRelationInfo.aList"
                    style="width: 100%">
                  <el-table-column prop="relationshipName" label="关系类型" align="left" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="name" label="标准名称" align="left" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="classifierName" label="标准类型" align="left" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="context" label="上下文路径" align="left" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="code" label="标准代码" align="left" width="" show-overflow-tooltip>
                    <template slot-scope="scope"><a class="a-color"> {{scope.row.code}} </a> </template>
                  </el-table-column>
                </el-table>
              </el-card>
              <div style="text-align: center; padding: 10px 0" v-if="oRelationInfo.oPage.total>0">
                <el-pagination
                    @size-change="handleSizeChangeReference"
                    @current-change="handleCurrentChangeReference"
                    :current-page="oRelationInfo.oPage.pageCurrent"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="oRelationInfo.oPage.pageSize"
                    background
                    layout="prev, pager, next"
                    :total="oRelationInfo.oPage.total">
                </el-pagination>
              </div>
            </el-collapse-item>
            <el-collapse-item class="title" title="应用" name="2">
              <el-card class="card-table">
                <el-table
                    border
                    size="mini"
                    align="left"
                    :data="oUsageInfo.aList"
                    style="width: 100%">
                  <el-table-column prop="relationshipName" label="关系类型" align="left" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="name" label="标准名称" align="left" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="classifierName" label="标准类型" align="left" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="context" label="上下文路径" align="left" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="code" label="标准代码" align="left" width="" show-overflow-tooltip>
                    <template slot-scope="scope"><a class="a-color"> {{scope.row.code}} </a> </template>
                  </el-table-column>
                </el-table>
              </el-card>
              <div style="text-align: center; padding: 10px 0" v-if="oUsageInfo.oPage.total>0">
                <el-pagination
                    @size-change="handleSizeChangeUsage"
                    @current-change="handleCurrentChangeUsage"
                    :current-page="oUsageInfo.oPage.pageCurrent"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="oUsageInfo.oPage.pageSize"
                    background
                    layout="prev, pager, next"
                    :total="oUsageInfo.oPage.total">
                </el-pagination>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane label="认责信息" name="third" class="base-info">
          <el-collapse v-model="aAccountableInfoActiveNames">
            <el-collapse-item class="title" title="创建人" name="1">
              <!--引用名片组件-->
              <businessCard v-if="creator.length>0" :cardList="creator"></businessCard>
              <div v-else> 暂无数据 </div>
            </el-collapse-item>
            <el-collapse-item class="title" title="发布人" name="2">
              <businessCard v-if="publisher.length>0" :cardList="publisher"></businessCard>
              <div v-else> 暂无数据 </div>
            </el-collapse-item>
            <el-collapse-item class="title" title="使用人" name="3">
              <businessCard v-if="user.length>0" :cardList="user"></businessCard>
              <div v-else> 暂无数据 </div>
            </el-collapse-item>
            <el-collapse-item class="title" title="归口责任人" name="4">
              <businessCard v-if="prncipal.length>0" :cardList="prncipal"></businessCard>
              <div v-else> 暂无数据 </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 删除提示 -->
    <el-dialog :visible.sync="deleteDialog" class="delete-dialog" title="删除提示" width="50%">
      <delete-dialog ref="deleteMenuDialog"></delete-dialog>
      <div class="dialog-btn">
        <el-button type="primary" @click="toDelete()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import businessCard from "../../common/businessCard";
import { get, post, parseAjaxResponse } from "../../../utils/request";
import { generateLineageTitle } from "@/utils";
import deleteDialog from "../deleteDialog/deleteDialog";
import { loading } from "@/utils/layer";

export default {
  name: "indexManagementDetails",
  components: {
    businessCard,
    deleteDialog
  },
  data() {
    return {
      instanceId: this.$route.params.id,
      classifierId: this.$route.params.classifierId,
      headerTitle: '',
      // headerTitle: '交易量[trading_volume]',
      // 发布状态
      sStatus: '',
      activeName: 'first',
      aBaseInfoActiveNames: ['1', '2'],
      aRelationInfoActiveNames: ['1', '2'],
      aAccountableInfoActiveNames: ['1', '2', '3', '4'],
      //
      oBaseInfoData: {
        oBusinessData: {
          sTitle: '业务属性',
          aList: []
        },
        oTechAttr: {
          sTitle: '技术属性',
          aList: []
        }
      },
      oRelationInfo: {
        aList: [],
        oPage: {
          pageCurrent: 1,
          pageSize: 10,
          total: 0
        }
      },
      oUsageInfo: {
        aList: [],
        oPage: {
          pageCurrent: 1,
          pageSize: 10,
          total: 0
        }
      },
      // 创建人列表 （单选，编辑时不可操作此项）
      creator: [],
      // 发布人列表 （单选，编辑时不可操作此项）
      publisher: [],
      // 使用人列表 (多选 ， 可编辑)
      user: [],
      // 责任人列表 （单选，编辑时不可操作此项）
      prncipal: [],

      deleteDialog: false,
      favorite: false // （false 未收藏；true 已收藏）
    };
  },
  computed: {
    oTechCaliberValue: function () {
      let sqlData = ''
      this.oBaseInfoData.oTechAttr.aList.forEach((item) => {
        if (item.key === '技术口径') {
          sqlData = item.value
        }
      })
      if (sqlData !== "" && sqlData !== undefined) {
        sqlData = sqlData.replace(/\\n/g, '\r\n');
        sqlData = sqlData.replace(/\#\*\&/g, '\r\n');
        return sqlData
      } else {
        return sqlData
      }
    }
  },
  methods: {
    // 获取收藏状态
    collectionStatus() {
      get('/home/collection/weatherDsCollection', {
        instanceId: this.instanceId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.favorite = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 收藏或取消收藏
    handleCollect() {
      if (!this.favorite) {
        this.toCollection()
      } else {
        this.cancelCollection()
      }
    },
    // 收藏
    toCollection() {
      post("/home/collection/determineDsCollection", {
        instanceId: this.$route.params.id
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.favorite = !this.favorite;
          this.$message.success("已收藏")
        } else {
          this.$message.error(res.message)
        }
      });
    },
    // 取消收藏
    cancelCollection() {
      get("/home/collection/cancelDsCollection", {
        instanceId: this.$route.params.id
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.favorite = !this.favorite;
          this.$message.success('取消收藏')
        } else {
          this.$message.error(res.message)
        }
      });
    },
    // 根据指标ID获取指标详情信息 /ds/application/index/getDetailInfos
    getIndexDetailInfos() {
      get('/ds/application/index/getDetailInfos', {
        indexId: this.instanceId
      }).then((res) => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.oBaseInfoData.oBusinessData.aList = []
            this.oBaseInfoData.oTechAttr.aList = []
            // 页面标题
            this.headerTitle = `${res.data.indexName} (${res.data.indexEnName})`
            res.data.basicInfo.forEach((item) => {
              if (item.belongs === '基本属性' || item.belongs === '业务属性' || item.belongs === '管理属性') {
                this.oBaseInfoData.oBusinessData.sTitle = '业务属性'
                if (item.attrName === '发布状态') {
                  this.sStatus = item.attrValue
                }
                if (!item.hidden) { // hidden为true的不显示出来
                  // 指标类型 显示成中文
                  if (item.columnName === 'INDEX_TYPE') {
                    if (item.attrValue === 'BaseIndexInfoItem') {
                      item.attrValue = '基础指标'
                    } else if (item.attrValue === 'CalculateIndexInfoItem') {
                      item.attrValue = '计算指标'
                    } else if (item.attrValue === 'DeriveIndexInfoItem') {
                      item.attrValue = '衍生指标'
                    } else if (item.attrValue === 'RuleIndexInfoItem') {
                      item.attrValue = '规则指标'
                    }
                  }
                  this.oBaseInfoData.oBusinessData.aList.push(
                    { key: item.attrName, value: item.attrValue }
                  )
                }
              }
              if (item.belongs === '技术属性') {
                this.oBaseInfoData.oTechAttr.sTitle = '技术属性'
                this.oBaseInfoData.oTechAttr.aList.push(
                  { key: item.attrName, value: item.attrValue }
                )
              }
            })
            // console.log(this.oBaseInfoData.oBusinessData.aList)
            console.log(this.oBaseInfoData.oTechAttr.aList, 'oTechAttr')

            // 认责信息
            this.creator = res.data.accusationInfos.creator
            this.publisher = res.data.accusationInfos.publisher
            this.user = res.data.accusationInfos.user
            this.prncipal = res.data.accusationInfos.prncipal
          }
        })
      })
    },
    // 分页获取指标关系信息--参考列表信息 /ds/application/index/listReferenceInfos
    getIndexListReferenceInfos() { // 参考
      get('/ds/application/index/listReferenceInfos', {
        indexId: this.instanceId,
        pageCurrent: this.oRelationInfo.oPage.pageCurrent,
        pageSize: this.oRelationInfo.oPage.pageSize
      }).then((res) => {
        parseAjaxResponse(res, () => {
          // 参考
          this.oRelationInfo.aList = res.data.records
          this.oRelationInfo.oPage.pageCurrent = res.data.current
          this.oRelationInfo.oPage.total = res.data.total
        })
      })
    },
    // 分页获取指标关系信息--应用列表信息 /ds/application/index/listUsageInfos
    getIndexListUsageInfos() { // 应用
      get('/ds/application/index/listUsageInfos', {
        indexId: this.instanceId,
        pageCurrent: this.oUsageInfo.oPage.pageCurrent,
        pageSize: this.oUsageInfo.oPage.pageSize
      }).then((res) => {
        parseAjaxResponse(res, () => {
          // 应用
          this.oUsageInfo.aList = res.data.records
          this.oUsageInfo.oPage.pageCurrent = res.data.current
          this.oUsageInfo.oPage.total = res.data.total
        })
      })
    },
    // 获取标准认责信息 /ds/listAccountability
    getListAccountability() {
      post('/ds/listAccountability', {
        instanceId: this.instanceId
      }).then((res) => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.creator = res.data.creator
            this.publisher = res.data.publisher
            this.user = res.data.user
            this.prncipal = res.data.prncipal
          }
        })
      })
    },

    // 编辑
    toEdit() {
      console.log(this.classifierId)
      this.$router.push({
        name: 'indexManagementEdit',
        params: {
          id: this.instanceId,
          classifierId: this.classifierId,
          _title: this.headerTitle
        }
      })
    },
    /* 关闭tag*/
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push(this.$route.path)
          }
        }
      })
    },

    // 删除
    deleteItem() {
      this.deleteDialog = true;
      console.log(this.$refs.deleteMenuDialog)
      this.$nextTick(() => {
        this.$refs.deleteMenuDialog.getAllMsg(this.instanceId);
      })
    },
    toDelete() {
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
          post('/ds/application/index/removeIndex', {
            instanceIds: this.instanceId
          }).then((res) => {
            parseAjaxResponse(res, () => {
              if (res.code === 10000) {
                load.close()
                this.$message.success("删除成功")
                this.deleteDialog = false;
                // 关闭当前页面
                this.closeSelectedTag(this.$route)
                // 跳转到指标入口页面
                this.$router.push({ name: "indexManagement" });
              }
            }, () => {
              load.close()
            })
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleClick(tab, event) {
      if (tab.name === 'second') { // 关系信息
        this.getIndexListReferenceInfos()
        this.getIndexListUsageInfos()
      } else if (tab.name === 'third') { // 认责信息
        // this.getListAccountability()
      }
    },
    handleChange(val) {
      console.log(val);
    },

    handleSizeChangeReference(val) {
      this.oRelationInfo.oPage.pageSize = val
    },
    handleCurrentChangeReference(val) {
      this.oRelationInfo.oPage.pageCurrent = val
    },
    handleSizeChangeUsage(val) {
      this.oUsageInfo.oPage.pageSize = val
    },
    handleCurrentChangeUsage(val) {
      this.oUsageInfo.oPage.pageCurrent = val
    },
    handleCommand(command) {
      this.$router.push({
        name: 'dsLineageAnalysisCanvas',
        params: {
          dataFlowType: command,
          id: this.instanceId,
          _title: generateLineageTitle(command, this.headerTitle)
        }
      })
    }
  },
  created() {
    this.getIndexDetailInfos()
    this.collectionStatus()
  }
}
</script>

<style lang="scss" scoped>
  //外层card容器样式
  @import 'src/styles/dq/main-card-table.scss';
  $collapse-font-size: 18px;
  .index-management-details{
    .card-container{
      padding: 20px 60px;
      .card-header{
        /*收藏*/
        .collect{
          line-height:26px;
          font-size: 18px;
        }
        .title{
          font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC";
          font-weight: bold;
          font-style: normal;
          font-size: 28px;
          color: rgba(102, 102, 102, 0.847059);
          line-height: 24px;
          margin-right: 16px;
        }
        .el-tag{
          height: 24px;
          line-height: 24px;
        }
        .button-box{
          .el-button+.el-button {
            margin-left: 1px;
          }
          .el-button{
            margin-right: 5px;
          }
          //按钮组样式 公共样式
          .btn{
            width: 85px;
            height: 34px;
            padding: 0px 13px;
            .svg-icon{
              width: 24px;
              height: 24px;
              top: 4px;
              position: relative;
            }
            .btn-text{
              font-size: 15px;
              line-height: 32px;
            }
          }
          //血统分析
          .btn1{
            width: 85px;
            height: 34px;
            padding: 0px 10px 0px 20px;
            .dataTable-icon{
              position: absolute;
              display: inline-block;
              width: 24px;
              height: 24px;
              left: 7px;
              top: 5px;
            }
            .blood {
              background: url('../../../../src/assets/images/commonIcon/blood-icon.png') no-repeat;
              background-size: 100%;
            }
            height: 34px;
            padding: 0px 10px;
            .svg-icon:nth-of-type(1){
              width:20px;
              height:20px;
              top:3px;
              position: relative;
            }
            .svg-icon:nth-of-type(2){
              width:13px;
              height:16px;
              top:1px;
              position: relative;
            }
            .btn-text{
              font-size: 15px;
              line-height: 32px;
              padding-left: 18px;
            }
          }
          //新增图标大小
          .btn.add{
            .svg-icon{
              width: 20px;
              height: 20px;
              top: 2px;
              position: relative;
            }
          }
        }
      }

      /deep/ .el-card.tech-caliber{
        overflow: scroll;
      }

      /deep/ .el-card__body{
        .el-tabs__header{
          .el-tabs__nav-scroll{

          }
          /*margin-left:15px;*/
          .el-tabs__nav-wrap::after {
            background-color: #fff;
          }
          .el-tabs__item {
            /*height: 46px;*/
            /*width: 106px;*/
            /*line-height: 46px;*/
            /*text-align: center;*/
            /*padding: 0px;*/
          }
        }
        /deep/ .el-tabs__content{
          .base-info{
            .el-collapse{
              border: unset;
              margin-top: 20px;
              .el-collapse-item__header{
                font-size: $collapse-font-size;
                color: #666666;
                padding: 0 20px;
                border-bottom: 1px solid rgba(233, 233, 233, 1);
              }
              /deep/ .el-collapse-item__wrap {
                border-bottom: unset;
              }
            }

            /deep/ .title{
              .el-collapse-item__header{
                font-size: $collapse-font-size;
                color: #666666;
                padding: 0 20px;
                border-bottom: 1px solid rgba(233, 233, 233, 1);
              }
              /deep/ .el-collapse-item__content {
                font-family: "PingFangSC-Regular", "PingFang SC";
                font-weight: 400;
                font-style: normal;
                font-size: 14px;
                color: #666666;
                // padding: 20px 60px;
                overflow: hidden;
                padding: 20px;
              }
              .content{
                margin-bottom: 10px;
                .content-key{
                  float: left;
                }
                .content-value{
                  float: left;
                  width: 800px;
                  .el-card{
                    background: #F8F8F8;
                    margin-top: 5px;
                    code{
                      background: #F8F8F8;
                      padding: 0px;
                      margin-bottom: -52px;
                      margin-top: -20px;
                    }
                  }
                }
                .clearfix{
                  clear: both;
                }
              }
            }
          }
        }
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

  }
.detail-drop {
  padding: 0;
  /deep/ .el-dropdown-menu__item {
    width: 85px;
    padding: 0;
    text-align: center;
  }
}
</style>
