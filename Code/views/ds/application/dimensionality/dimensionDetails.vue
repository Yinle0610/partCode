<template>
  <!-- 详情 -->
  <div class="detailPage">
    <div class="rule-detail">
      <div class="rule-title clearfix">
        <span class="rule-title_content">
          <img style="width: 21px;height: 21px;" src alt />
          <i @click="handleCollect" :style="{color:collect?'rgb(247, 186, 42)':'', cursor: 'pointer',marginRight:'5px'}" :class="[collect? 'el-icon-star-on' : 'el-icon-star-off']"></i>
          {{EName?$route.params._title+' ['+EName+']':$route.params._title}}
        </span>
        <el-tag size="small" type="success" v-if="state">{{state}}</el-tag>
        <div style="float:right">
          <!-- <el-button
          @click="handleDelete"
          class="basic-button fr"
          style="margin-left:10px;"
          type="danger"
        >
          <i class="dataTable-icon del"></i>删除
        </el-button> -->
        <!-- <el-button @click="handleEdit" class="basic-button fr" style type="warning">
          <i class="dataTable-icon edit"></i>编辑
        </el-button> -->
        <el-dropdown class="fr" @command="handleBlood">
          <el-button
            class="basic-button fr"
            style="width: 120px;padding: 0px 10px 0 20px;"
            type="primary"
          >
            <i class="dataTable-icon blood"></i>关系
            <svg-icon icon-class="xian"></svg-icon>
            <svg-icon icon-class="more"></svg-icon>
          </el-button>
          <el-dropdown-menu slot="dropdown" trigger="click">
            <el-dropdown-item :command="'backward'">参考(Reference)</el-dropdown-item>
            <el-dropdown-item :command="'forward'">应用(Usage)</el-dropdown-item>
            <el-dropdown-item :command="'full'">全链(Ref&Usage)</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </div>
        
      </div>
      <div class="rule-tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <div class="basic-content"></div>
          <el-tab-pane label="基本信息" name="first">
            <div class="base-msg">
              <p v-for="val in basicData" :key="val.attrName" v-show="val.hidden!==true">
                <span>{{val.attrName+'：'}}</span>
                <span>{{val.attrValue}}</span>
              </p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="关系信息" name="second">
            <el-collapse v-model="relationActiveNames" @change="handleChange">
              <el-collapse-item title="参考(Reference)" name="1">
                <div class="code-table">
                  <el-table
                    :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                    ref="multipleTable"
                    :data="ReferenceTable.data"
                    tooltip-effect="dark"
                    border
                    style="width: 100%"
                  >
                    <el-table-column  prop="name" label="标准名称" show-overflow-tooltip></el-table-column>
                    <el-table-column  prop="classifierName" label="标准类型" show-overflow-tooltip></el-table-column>
                    <el-table-column  label=" 标准代码" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-button type="text" @click.native="activeName='first'">{{ scope.row.code}}</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column  prop="context" label="上下文路径" show-overflow-tooltip></el-table-column>
                    <el-table-column  prop="relationshipName" label=" 关系类型" show-overflow-tooltip></el-table-column>
                  </el-table>
                  <div class="code-pagination">
                    <el-pagination background layout="prev, pager, next" :total="ReferenceTable.page.total" :page-size.sync="ReferenceTable.page.size"  @current-change="handleCurrentChange4"></el-pagination>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="应用(Usage)" name="2">
                <div class="code-table">
                  <el-table
                    :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                    ref="multipleTable"
                    :data="UsageTable.data"
                    tooltip-effect="dark"
                    border
                    style="width: 100%"
                  >
                    <el-table-column  prop="relationshipName" label="关系类型" show-overflow-tooltip ></el-table-column>
                    <el-table-column  prop="name" label="标准名称" show-overflow-tooltip></el-table-column>
                    <el-table-column  prop="classifierName" label="标准类型"></el-table-column>
                    <el-table-column  prop="context" label="上下文路径" show-overflow-tooltip></el-table-column>
                    <el-table-column  label="标准代码">
                      <template slot-scope="scope">
                        <el-button type="text" @click.native="activeName='first'">{{ scope.row.code}}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="code-pagination">
                    <el-pagination background layout="prev, pager, next" :total="UsageTable.page.total" :page-size.sync="UsageTable.page.size"  @current-change="handleCurrentChange3"></el-pagination>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="认责信息" name="third">
            <el-collapse v-model="confessActiveNames" @change="handleChange">
              <el-collapse-item title="创建人" name="1">
                <business-card :cardList="accusationData.creatorList" v-if="accusationData.creatorList.length>0"></business-card>
                <div v-else style="font-size:13px;padding-left:5px;color:#999;">暂无创建人</div>
              </el-collapse-item>
              <el-collapse-item title="发布人" name="2">
                <business-card :cardList="accusationData.issuerList" v-if="accusationData.issuerList.length>0"></business-card>
                <div v-else style="font-size:13px;padding-left:5px;color:#999;">暂无发布人</div>
              </el-collapse-item>
              <el-collapse-item title="使用人" name="3">
                <business-card :cardList="accusationData.userList" v-if="accusationData.userList.length>0"></business-card>
                <div v-else style="font-size:13px;padding-left:5px;color:#999;">暂无使用人</div>
              </el-collapse-item>
              <el-collapse-item title="归口责任人" name="4">
                <business-card :cardList="accusationData.dutyList" v-if="accusationData.dutyList.length>0"></business-card>
                <div v-else style="font-size:13px;padding-left:5px;color:#999;">暂无责任人</div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="维度值信息" name="fourth">
            <el-collapse v-model="wdzActiveNames" @change="handleChange">
              <el-collapse-item title="维度值列表" name="1">
                <div class="code-table">
                  <el-table
                    :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                    ref="multipleTable"
                    :data="wData.data"
                    tooltip-effect="dark"
                    border
                    style="width: 100%"
                  >
                    <el-table-column  label="维度值代码" prop="valueCode"></el-table-column>
                    <el-table-column  prop="valueDesc" label="维度值描述" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column  prop="effectDate" label=" 生效日期"></el-table-column> -->
                    <!-- <el-table-column  prop="invalidDate" label=" 失效日期"></el-table-column> -->
                  </el-table>
                  <div class="code-pagination">
                    <el-pagination background layout="prev, pager, next" :page-size.sync="wData.page.size" :total="wData.page.total" @current-change="handleCurrentChange"></el-pagination>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="维度值映射关系" name="2">
                <div class="code-table">
                  <el-table
                    :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                    ref="multipleTable"
                    :data="wMData.data"
                    tooltip-effect="dark"
                    border
                    style="width: 100%"
                  >
                    <el-table-column  prop="dimensionValueCode" label="维度值代码" show-overflow-tooltip ></el-table-column>
                    <el-table-column  prop="dimensionValueDesc" label="维度值描述" show-overflow-tooltip></el-table-column>
                    <el-table-column  label="公共代码编号">
                      <template slot-scope="scope">
                        <el-button type="text">{{ scope.row.commonCodeCode }}</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column  prop="commonCodeName" label="公共代码名称" show-overflow-tooltip></el-table-column>
                    <el-table-column  prop="commonCodeValue" label="公共代码取值" show-overflow-tooltip></el-table-column>
                    <el-table-column  prop="commonCodeDesc" label="公共代码取值描述" show-overflow-tooltip></el-table-column>
                  </el-table>
                  <div class="code-pagination">
                    <el-pagination background layout="prev, pager, next" :total="wMData.page.total" :page-size.sync="wMData.page.size"  @current-change="handleCurrentChange2"></el-pagination>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from "@/utils/request";
import { generateLineageTitle } from "@/utils"
import { loading } from "@/utils/layer";
import businessCard from "@/views/common/businessCard";
export default {
  name: "dimensionDetails",
  components: {
    businessCard
  },
  data() {
    return {
      // 是否被收藏
      collect: false,
      EName: null,
      state: null,
      activeName: "first",
      // 关系默认折叠
      relationActiveNames: ["1", "2", "3", "4"],
      // 认责默认折叠
      confessActiveNames: ["1", "2", "3", "4"],
      // 维度值默认折叠
      wdzActiveNames: ["1", "2"],
      selectId: null,
      // 关系信息-参考列表
      ReferenceTable: {
        page: {
          current: 1,
          size: null,
          total: 0
        },
        data: []
      },
      // 关系信息-应用列表
      UsageTable: {
        page: {
          current: 1,
          size: null,
          total: 0
        },
        data: []
      },
      // 维度值信息-维度值列表
      wData: {
        page: {
          current: 1,
          size: null,
          total: 0
        },
        data: []
      },
      // 维度值信息-维度值映射列表
      wMData: {
        page: {
          current: 1,
          size: null,
          total: 0
        },
        data: []
      },
      // 认责信息
      accusationData: {
        // 创建人列表
        creatorList: [],
        // 发布人列表
        issuerList: [],
        // 使用人列表
        userList: [],
        // 责任人列表
        dutyList: []
      },
      basicData: [],
      dimensionId: '',
      dimensionName: ''
    };
  },
  methods: {
    handleCollect() {
      // console.log('click')
      if (this.collect) {
        get('/home/collection/cancelDsCollection', {
          instanceId: this.$route.params.detailId
        }).then(res => {
          // console.log(res)
          if (res.code === 10000 && res.success) {
            this.$message.success('取消收藏成功')
          }
          this.getCollect()
        })
      } else {
        post('/home/collection/determineDsCollection', {
          instanceId: this.$route.params.detailId
        }).then(res => {
          // console.log(res)
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
        instanceId: this.$route.params.detailId
      }).then(res => {
        // console.log(res, 'collect')
        this.collect = res.data
      })
    },
    handleClick(val) {
      console.log(val);
    },
    handleChange(val) {
      console.log(val);
    },
    handleCurrentChange(val) {
      this.wData.page.current = val;
      this.wGetData();
    },
    handleCurrentChange2(val) {
      this.wMData.page.current = val;
      this.wGetDataN();
    },
    handleCurrentChange3(val) {
      this.UsageTable.page.current = val;
      this.gGetData('usageInfos');
    },
    handleCurrentChange4(val) {
      this.ReferenceTable.page.current = val;
      this.gGetData();
    },
    handleBlood(command) {
      this.$router.push({
        name: 'dsLineageAnalysisCanvas',
        params: {
          dataFlowType: command,
          id: this.dimensionId,
          _title: generateLineageTitle(command, this.dimensionName)
        }
      })
    },
    handleEdit() {
      this.$router.push({
        name: 'editorData',
        params: {
          _title: this.$route.params.row.instanceName,
          id: this.selectId,
          detailId: this.selectId,
          msg: this.$route.params.row,
          detailType: 'detail'
        }
      })
    },
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
            this.$router.push('/ds/applicationStandard/dimensionality/dimensionality')
          }
        }
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
          get('/ds/application/dimension/removeDimensions', {
            instanceIds: this.selectId
          }).then(res => {
            if (res.code === 10000 && res.success) {
              load.close()
              this.$message({
                message: res.message,
                type: 'success'
              });
              this.closeSelectedTag(this.$route)
            } else {
              load.close()
              this.$message.error(res.message);
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
    getData() {
      get('/ds/application/dimension/getDimensionDetailInfos', {
        dimensionId: this.selectId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          console.log(res)
          let data = res.data;
          this.accusationData = {
            creatorList: data.accusationInfos.creator,
            issuerList: data.accusationInfos.publisher,
            userList: data.accusationInfos.user,
            dutyList: data.accusationInfos.prncipal
          }
          this.accusationData.creatorList.map(val => {
            val.name = val.userName;
            val.tele = val.mobilePhone;
          })
          this.accusationData.issuerList.map(val => {
            val.name = val.userName;
            val.tele = val.mobilePhone;
          })
          this.accusationData.userList.map(val => {
            val.name = val.userName;
            val.tele = val.mobilePhone;
          })
          this.accusationData.dutyList.map(val => {
            val.name = val.userName;
            val.tele = val.mobilePhone;
          })
          this.EName = data.dimensionEnName;
          this.basicData = data.basicInfo;
          this.wData.data = data.dimensionValueInfos.dimensionValues.records;
          this.wData.page.total = data.dimensionValueInfos.dimensionValues.total;
          this.wData.page.size = data.dimensionValueInfos.dimensionValues.size;
          this.wMData.data = data.dimensionValueInfos.mappingInfos.records;
          this.wMData.page.total = data.dimensionValueInfos.mappingInfos.total;
          this.wMData.page.size = data.dimensionValueInfos.mappingInfos.size;
          this.ReferenceTable.data = data.relationship.referenceInfos.records;
          this.ReferenceTable.page.total = data.relationship.referenceInfos.total;
          this.ReferenceTable.page.size = data.relationship.referenceInfos.size;
          this.UsageTable.data = data.relationship.usageInfos.records;
          this.UsageTable.page.total = data.relationship.usageInfos.total;
          this.UsageTable.page.size = data.relationship.usageInfos.size;
          this.dimensionId = data.dimensionId
          this.dimensionName = data.dimensionName
          this.basicData.map(val => {
            if (val.attrName === '发布状态') {
              this.state = val.attrValue
            }
          })
        } else {
          this.$message.error(res.message);
        }
      })
    },
    wGetData() {
      if (this.selectId) {
        // 维度值
        let params = {
          dimensionId: this.selectId,
          pageCurrent: this.wData.page.current,
          pageSize: this.wData.page.size
        }
        get('/ds/application/dimension/listDimensionValueInfos', params).then(res => {
          if (res.code === 10000 && res.success) {
            this.wData.data = res.data.records;
            this.wData.page.total = res.data.total;
          } else {
            this.$message.error(res.message);
          }
        })
      }
    },
    wGetDataN() {
      if (this.selectId) {
        // 维度值映射
        let yparams = {
          dimensionId: this.selectId,
          pageCurrent: this.wMData.current,
          pageSize: this.wMData.pageSize
        }
        get('/ds/application/dimension/listDimensionValueMappingInfos', yparams).then(res => {
          if (res.code === 10000 && res.success) {
            this.wMData.data = res.data.records;
            this.wMData.page.total = res.data.total;
          } else {
            this.$message.error(res.message);
          }
        })
      }
    },
    // 关系信息
    gGetData(type) {
      if (type === 'usageInfos') {
        // 应用表
        let yParams = {
          dimensionId: this.selectId,
          pageCurrent: this.ReferenceTable.page.current,
          pageSize: this.ReferenceTable.page.size
        }
        get('/ds/application/dimension/listDimensionUsageInfos', yParams).then(res => {
          if (res.code === 10000 && res.success) {
            this.UsageTable.page.total = res.data.total;
            this.UsageTable.data = res.data.records;
          } else {
            this.$message.error(res.message);
          }
        })
      } else {
        // 参考表
        let cParams = {
          dimensionId: this.selectId,
          pageCurrent: this.ReferenceTable.page.current,
          pageSize: this.ReferenceTable.page.size
        }
        get('/ds/application/dimension/listDimensionReferenceInfos', cParams).then(res => {
          if (res.code === 10000 && res.success) {
            this.ReferenceTable.page.total = res.data.total;
            this.ReferenceTable.data = res.data.records;
          } else {
            this.$message.error(res.message);
          }
        })
      }
    }
  },
  activated() {
    this.selectId = this.$route.params.detailId;
    // console.log(7777)
    this.getData();
    this.getCollect()
  },
  created() {
    this.getCollect()
    console.log(this.$route.params);
    this.selectId = this.$route.params.detailId;
    this.getData();
    // this.wGetData();
    // this.gGetData();
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
$titleSizebig: 26px;
$collHeaderSize: 16px;
$contentSize: 16px;
.rule-detail {
  background: #fff;
  padding: 40px 80px;
  .rule-title {
    // height: 55px;
    line-height: 55px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
    
    .rule-title_content {
      margin-left: 20px;
      font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC";
      font-weight: 650;
      font-style: normal;
      font-size: 22px;
      color: rgba(102, 102, 102, 0.847058823529412);
      line-height: 24px;
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
      background: url(../../../../../src/assets/images/commonIcon/blood-icon.png)
        no-repeat;
      background-size: 100%;
    }
    .edit {
      background: url(../../../../../src/assets/images/commonIcon/edit.png)
        no-repeat;
      background-size: 100%;
    }
    .del {
      background: url(../../../../../src/assets/images/commonIcon/del.png)
        no-repeat;
      background-size: 100%;
    }
    .add {
      background: url(../../../../../src/assets/images/commonIcon/add.png)
        no-repeat;
      background-size: 100%;
    }
  }
  .clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
  }
  .clearfix{
    *zoom: 1;/*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
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
      padding: 15px;
    }
    .base-msg {
      p {
        overflow: hidden;
        font-size: $contentSize;
        color: #666666;
        margin-bottom: 40px;
      }
      .base-msg_content {
        display: block;
        float: right;
        width: calc(100% - 80px);
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
  width: 189px;
  height: 58px;
  border: 1px solid rgb(48, 65, 86);
  float: left;
  margin-left: 10px;
  position: relative;
  text-align: center;
  line-height: 58px;
  padding-left: 20px;
  .creator-icon {
    height: 33px;
    width: 33px;
    display: block;
    line-height: 55px;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 20px;
  }
}
</style>
