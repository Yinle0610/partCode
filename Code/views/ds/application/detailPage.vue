<template>
  <!-- 详情 -->
  <div class="p10">
    <div class="rule-detail">
      <div class="rule-title">
        <!-- {{人均[per_capita]}} -->
        <span class="rule-title_content">
          <img style="width: 21px;height: 21px;" src alt />
          人均[per_capita]
        </span>
        <el-tag>已发布</el-tag>
        <!-- <div slot="header" class="clearfix card-title"> -->
        <el-button
          @click="handleDelete"
          class="basic-button fr"
          style="margin-left:10px;"
          type="danger"
        >
          <i class="dataTable-icon del"></i>删除
        </el-button>
        <el-button @click="handleEdit" class="basic-button fr" style type="warning">
          <i class="dataTable-icon edit"></i>编辑
        </el-button>
        <el-dropdown class="fr">
          <el-button
            class="basic-button fr"
            style="width: 140px;padding: 0px 10px 0 35px;"
            type="primary"
            @click="handleBlood"
          >
            <i class="dataTable-icon blood"></i>血缘分析
            <svg-icon icon-class="xian"></svg-icon>
            <svg-icon icon-class="more"></svg-icon>
          </el-button>
          <el-dropdown-menu slot="dropdown" trigger="click">
            <el-dropdown-item>参考(Reference)</el-dropdown-item>
            <el-dropdown-item>应用(Usage)</el-dropdown-item>
            <el-dropdown-item>全链(Ref&Usage)</el-dropdown-item>
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
                <span>rule10009</span>
              </p>
              <p>
                <span>规则分类：</span>
                <span>平均统计</span>
              </p>
              <p>
                <span class="base-msg_label">规则描述：</span>
                <span class="base-msg_content">
                  指按每人数计算的平均值，计算方法为：一段统计期内指标的总和/平均人数，如：
                  近三个月营业员人均业务量=近三个月总业务量/营业员平均数。
                </span>
              </p>
              <p>
                <span>创建时间：</span>
                <span>2019-03-15 12:00:00</span>
              </p>
              <p>
                <span>创建人：</span>
                <span>林松
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content"><p>电话：123456</p><p>email：232333@123.com</p></div>
                  <i class="el-icon-info" style="color: #5cb6ff;margin-left: 8px;"></i>
                  </el-tooltip>
                  </span>
              </p>
              <p>
                <span>最后更新时间：</span>
                <span>2019-03-15 12:00:00</span>
              </p>
              <p>
                <span>最后更新人：</span>
                <span>陆烟华</span>
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
                    :data="ReferenceTable"
                    tooltip-effect="dark"
                    border
                    style="width: 100%"
                  >
                    <el-table-column align="center" label="标准名称">
                      <template slot-scope="scope">
                        <el-button type="text">{{ scope.row.codeNum }}</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="codeDesc" label="标准类型"></el-table-column>
                    <el-table-column align="center" prop="codeMean" label=" 标准代码"></el-table-column>
                    <el-table-column align="center" prop="codeMean" label=" 关系类型"></el-table-column>
                  </el-table>
                  <div class="code-pagination">
                    <el-pagination background layout="prev, pager, next" :total="50"></el-pagination>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="应用(Usage)" name="2">
                <div class="code-table">
                  <el-table
                    :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      align="center"
                      prop="codeMean"
                      label="关系类型"
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column align="center" prop="codeDesc" label="标准名称"></el-table-column>
                    <el-table-column align="center" prop="codeDesc" label="标准类型"></el-table-column>

                    <el-table-column align="center" label="标准代码">
                      <template slot-scope="scope">
                        <el-button type="text">{{ scope.row.codeNum }}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="code-pagination">
                    <el-pagination background layout="prev, pager, next" :total="50"></el-pagination>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="认责信息" name="third">
            <el-collapse v-model="confessActiveNames" @change="handleChange">
              <el-collapse-item title="创建人" name="1">
                <div class="confess-creator" v-for="(item, index) in creatorList" :key="index">
                  <svg-icon
                    class="creator-icon"
                    style="height: 33px;width: 33px;"
                    icon-class="see-user"
                  ></svg-icon>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                      <p>email:{{item.email}}</p>
                      <p>电话:{{item.tele}}</p>
                    </div>
                    <el-button type="text">{{item.name}}</el-button>
                  </el-tooltip>
                </div>
              </el-collapse-item>
              <el-collapse-item title="发布人" name="2">
                <div class="confess-creator" v-for="(item, index) in issuerList" :key="index">
                  <svg-icon
                    class="creator-icon"
                    style="height: 33px;width: 33px;"
                    icon-class="see-user"
                  ></svg-icon>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                      <p>email:{{item.email}}</p>
                      <p>电话:{{item.tele}}</p>
                    </div>
                    <el-button type="text">{{item.name}}</el-button>
                  </el-tooltip>
                </div>
              </el-collapse-item>
              <el-collapse-item title="使用人" name="3">
                <div class="confess-creator" v-for="(item, index) in userList" :key="index">
                  <svg-icon
                    class="creator-icon"
                    style="height: 33px;width: 33px;"
                    icon-class="see-user"
                  ></svg-icon>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                      <p>email:{{item.email}}</p>
                      <p>电话:{{item.tele}}</p>
                    </div>
                    <el-button type="text">{{item.name}}</el-button>
                  </el-tooltip>
                </div>
              </el-collapse-item>
              <el-collapse-item title="归口责任人" name="4">
                <div class="confess-creator" v-for="(item, index) in dutyList" :key="index">
                  <svg-icon
                    class="creator-icon"
                    style="height: 33px;width: 33px;"
                    icon-class="see-user"
                  ></svg-icon>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                      <p>email:{{item.email}}</p>
                      <p>电话:{{item.tele}}</p>
                    </div>
                    <el-button type="text">{{item.name}}</el-button>
                  </el-tooltip>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane v-if="wdz" label="维度值信息" name="fourth">
            <el-collapse v-model="wdzActiveNames" @change="handleChange">
              <el-collapse-item title="维度值列表" name="1">
                <div class="code-table">
                  <el-table
                    :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                    ref="multipleTable"
                    :data="ReferenceTable"
                    tooltip-effect="dark"
                    border
                    style="width: 100%"
                  >
                    <el-table-column align="center" label="维度值代码">
                      <template slot-scope="scope">
                        <el-button type="text">{{ scope.row.codeNum }}</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="codeDesc" label="维度值描述"></el-table-column>
                    <el-table-column align="center" prop="codeMean" label=" 生效日期"></el-table-column>
                    <el-table-column align="center" prop="codeMean" label=" 失效日期"></el-table-column>
                  </el-table>
                  <div class="code-pagination">
                    <el-pagination background layout="prev, pager, next" :total="50"></el-pagination>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="维度值映射关系" name="2">
                <div class="code-table">
                  <el-table
                    :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      align="center"
                      prop="codeMean"
                      label="维度值代码"
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column align="center" prop="codeDesc" label="维度值描述"></el-table-column>
                    <el-table-column align="center" prop="codeDesc" label="公共代码编号">
                      <template slot-scope="scope">
                        <el-button type="text">{{ scope.row.codeNum }}</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="codeNum" label="公共代码名称"></el-table-column>
                    <el-table-column align="center" prop="codeNum" label="公共代码取值"></el-table-column>
                  </el-table>
                  <div class="code-pagination">
                    <el-pagination background layout="prev, pager, next" :total="50"></el-pagination>
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
export default {
  name: "",
  data() {
    return {
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
      // 创建人列表
      creatorList: [
        {
          name: "林老师",
          tele: "1222233",
          email: "100@2222.com"
        },
        {
          name: "wang老师",
          tele: "1222233",
          email: "100@2222.com"
        }
      ],
      // 发布人列表
      issuerList: [
        {
          name: "林老师",
          tele: "1222233",
          email: "100@2222.com"
        },
        {
          name: "wang老师",
          tele: "1222233",
          email: "100@2222.com"
        },
        {
          name: "竺老师",
          tele: "1222233",
          email: "100@2222.com"
        }
      ],
      // 使用人列表
      userList: [
        {
          name: "林老师",
          tele: "1222233",
          email: "100@2222.com"
        }
      ],
      // 责任人列表
      dutyList: [
        {
          name: "wang老师",
          tele: "1222233",
          email: "100@2222.com"
        }
      ]
    };
  },
  methods: {
    handleClick(val) {
      console.log(val);
    },
    handleChange(val) {
      console.log(val);
    },
    handleBlood() {},
    handleEdit() {},
    handleDelete() {}
  },
  created() {}
};
</script>
<style>
th {
  font-weight: 100;
}
</style>
<style lang="scss" scoped>
$titleSize: 28px;
$contentSize: 16px;
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
      font-size: $titleSize;
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
  .rule-tabs {
    padding: 35px;
    /deep/ .el-collapse {
      border: unset;
      margin-top: 20px;
    }
    /deep/ .el-collapse-item__header {
      font-family: "PingFangSC-Regular", "PingFang SC";
      font-weight: 400;
      font-style: normal;
      font-size: 20px;
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