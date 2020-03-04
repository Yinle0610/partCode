<!--主数据详情页面-->
<template>
  <div class="master-data-details">
    <el-card shadow="hover" class="card-container">
      <div slot="header" class="clearfix card-header">
        <div style="padding: 2px 11px 6px;border-bottom: 1px solid #ebeef5;margin-bottom: 10px;">
          <el-button class="edit-back" @click="handleBack">返回</el-button>
        </div>
        <div style="padding: 0 20px;">
        <span class="collect" @click="handleCollect">
          <i v-show="!favorite" class="el-icon-star-off"></i>
          <i v-show="favorite" style="color: rgb(255, 235, 59);" class="el-icon-star-on"></i>
        </span>
        <span class="title">{{headerTitle}}</span>
        <el-tag type="success">{{sStatus}}</el-tag>
        <div class="button-box" style="float: right">
          <el-dropdown @command="handleCommand">
            <el-button type="primary" size="mini" class="btn1">
              <i class="dataTable-icon blood"></i>
              <span class="btn-text">关系</span>
              <!-- <svg-icon icon-class="xian"></svg-icon> -->
              <!-- <svg-icon icon-class="more"></svg-icon> -->
            </el-button>
            <el-dropdown-menu slot="dropdown" trigger="click">
              <el-dropdown-item :command="'backward'">参考</el-dropdown-item>
              <el-dropdown-item :command="'forward'">应用</el-dropdown-item>
              <el-dropdown-item :command="'full'">全链</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            type="warning"
            v-permission="'MAS_EIDT'"
            size="mini"
            class="btn"
            @click="toEdit"
          >
            <svg-icon icon-class="xiugai"></svg-icon>
            <span class="btn-text">编辑</span>
          </el-button>
          <el-button
            type="danger"
            v-permission="'MAS_DEL'"
            size="mini"
            class="btn add"
            @click="deleteItem"
          >
            <svg-icon icon-class="shanchu"></svg-icon>
            <span class="btn-text">删除</span>
          </el-button>
        </div>
        </div>
      </div>
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first" class="base-info">
          <el-collapse v-model="aBaseInfoActiveNames" @change="handleChange">
            <el-collapse-item class="title" name="1">
              <template slot="title">
                <i class="line"></i>
                {{oBaseInfoData.oBusinessData.sTitle}}
              </template>
              <div
                class="content"
                v-for="item in oBaseInfoData.oBusinessData.aList"
                :key="item.key"
              >
                <span class="content-key">{{ item.key + '：' }}</span>
                <div class="content-value">{{ item.value }}</div>
                <div class="clearfix"></div>
              </div>
            </el-collapse-item>
            <el-collapse-item class="title" name="2">
              <!--技术属性-->
              <template slot="title">
                <i class="line"></i>
                {{oBaseInfoData.oTechAttr.sTitle}}
              </template>
              <div class="content" v-for="item in oBaseInfoData.oTechAttr.aList" :key="item.key">
                <span class="content-key">{{ item.key + '：' }}</span>
                <span class="content-value">{{ item.value }}</span>
                <div class="clearfix"></div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <!-- <el-tab-pane label="关系信息" name="second" class="base-info">
          <el-collapse v-model="aRelationInfoActiveNames">
            <el-collapse-item class="title" title="参考(Reference)" name="1">
              <el-card class="card-table">
                <el-table
                    border
                    size="mini"
                    align="center"
                    :data="oRelationInfo.aList"
                    style="width: 100%">
                  <el-table-column prop="relationshipName" label="关系类型" align="center" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="name" label="标准名称" align="center" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="classifierName" label="标准类型" align="center" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="context" label="上下文路径" align="center" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="code" label="标准代码" align="center" width="" show-overflow-tooltip>
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
            <el-collapse-item class="title" title="应用(Usage)" name="2">
              <el-card class="card-table">
                <el-table
                    border
                    size="mini"
                    align="center"
                    :data="oUsageInfo.aList"
                    style="width: 100%">
                  <el-table-column prop="name" label="标准名称" align="center" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="classifierName" label="标准类型" align="center" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="code" label="标准代码" align="center" width="" show-overflow-tooltip>
                    <template slot-scope="scope"><a class="a-color"> {{scope.row.code}} </a> </template>
                  </el-table-column>
                  <el-table-column prop="context" label="上下文路径" align="center" width="" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="relationshipName" label="关系类型" align="center" width="" show-overflow-tooltip>
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
        </el-tab-pane>-->
        <el-tab-pane label="关系信息" name="second">
          <div class="relationship">
            <el-collapse v-model="aRelationInfoActiveNames">
              <el-collapse-item class="title" title="参考" name="1">
                <!-- <div class="title">参考(Reference)</div> -->
                <div class="button mb10">
                  <!-- <el-button type="primary" v-permission="'MAS_ADD'" size="small" class="zengjia" @click="toAddReference"><svg-icon icon-class="zengjia"></svg-icon>  新增</el-button>
                  <el-button type="danger" v-permission="'MAS_DEL'" size="small" class="shanchu" @click="delReference"><svg-icon icon-class="shanchu"></svg-icon> 删除</el-button>-->
                  <el-tooltip class="item" effect="dark" content="新增" placement="bottom">
                    <el-button
                      v-permission="'MAS_EIDT'"
                      @click="toAddReference"
                      type="text"
                      size="small"
                    >
                      <svg-icon icon-class="addindetail" class="deleteRed"></svg-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                    <el-button
                      v-permission="'MAS_EIDT'"
                      @click="delReference"
                      type="text"
                      size="small"
                    >
                      <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                    </el-button>
                  </el-tooltip>
                </div>
                <div class="table">
                  <el-table
                    :data="relationData.tableData"
                    border
                    style="width: 100%"
                    size="small"
                    :header-cell-style="{background:'#f8f8f9',textAlign:'left'}"
                    
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column prop="name" label="标准名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="classifierName" label="标准类型" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="code" label="标准代码" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <a class="a-color" @click="toDetails(scope.row)">{{scope.row.code}}</a>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="context"
                      label="上下文路径"
                      align="left"
                      width
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column prop="relationshipName" label="关系类型" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
                <div style="text-align:center;margin-top:30px;" v-if="relationData.oPage.total>0">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="relationData.oPage.pageCurrent"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="relationData.oPage.pageSize"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="relationData.oPage.total"
                  ></el-pagination>
                </div>
              </el-collapse-item>
              <el-collapse-item class="title" title="应用" name="2">
                <!-- <el-card class="card-table"> -->
                <el-table
                  border
                  size="mini"
                  align="left"
                  :data="oUsageInfo.aList"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="name"
                    label="标准名称"
                    align="left"
                    width
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="classifierName"
                    label="标准类型"
                    align="left"
                    width
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="code"
                    label="标准代码"
                    align="left"
                    width
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <a class="a-color">{{scope.row.code}}</a>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="context"
                    label="上下文路径"
                    align="left"
                    width
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="relationshipName"
                    label="关系类型"
                    align="left"
                    width
                    show-overflow-tooltip
                  ></el-table-column>
                </el-table>
                <!-- </el-card> -->
                <div style="text-align: center; padding: 10px 0" v-if="oUsageInfo.oPage.total>0">
                  <el-pagination
                    @size-change="handleSizeChangeUsage"
                    @current-change="handleCurrentChangeUsage"
                    :current-page="oUsageInfo.oPage.pageCurrent"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="oUsageInfo.oPage.pageSize"
                    background
                    layout="prev, pager, next"
                    :total="oUsageInfo.oPage.total"
                  ></el-pagination>
                </div>
              </el-collapse-item>
              <!-- <el-collapse-item class="title" title="实施" name="3">
                <div class="button mb10">
                  <el-tooltip class="item" effect="dark" content="新增" placement="bottom">
                    <el-button
                      v-permission="'MAS_EIDT'"
                      @click="addImplement"
                      type="text"
                      size="small"
                    >
                      <svg-icon icon-class="addindetail" class="deleteRed"></svg-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                    <el-button
                      v-permission="'MAS_EIDT'"
                      @click="deleteImplement"
                      type="text"
                      size="small"
                    >
                      <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                    </el-button>
                  </el-tooltip>
                </div>
                <el-table
                  border
                  size="mini"
                  align="center"
                  :data="oImplementInfo.aList"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="name"
                    label="元数据代码"
                    align="center"
                    width
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="classifierName"
                    label="元数据名称"
                    align="center"
                    width
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column
                    prop="code"
                    label="元数据类型"
                    align="center"
                    width
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <a class="a-color">{{scope.row.code}}</a>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="context"
                    label="上下文路径"
                    align="center"
                    width
                    show-overflow-tooltip
                  ></el-table-column>
                </el-table>
                <div
                  style="text-align: center; padding: 10px 0"
                  v-if="oImplementInfo.oPage.total>0"
                >
                  <el-pagination
                    @size-change="handleSizeChangeImplement"
                    @current-change="handleCurrentChangeImplement"
                    :current-page="oImplementInfo.oPage.pageCurrent"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="oImplementInfo.oPage.pageSize"
                    background
                    layout="prev, pager, next"
                    :total="oImplementInfo.oPage.total"
                  ></el-pagination>
                </div>
              </el-collapse-item> -->
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="认责信息" name="third">
          <el-collapse class="confess-account" v-model="confessActiveNames">
            <el-collapse-item title="创建人" name="1">
              <!--引用名片组件-->
              <businessCard v-if="creator.length>0" :cardList="creator"></businessCard>
              <div v-else>暂无数据</div>
            </el-collapse-item>
            <el-collapse-item title="发布人" name="2">
              <businessCard v-if="publisher.length>0" :cardList="publisher"></businessCard>
              <div v-else>暂无数据</div>
            </el-collapse-item>
            <el-collapse-item title="使用人" name="3">
              <!--名片组件 删除和增加-->
              <businessCardEdit
                v-permission="'MAS_EIDT'"
                :cardList="user"
                :oneOrMore="'more'"
                @toDelCard="toDelCard(arguments)"
                @toAddCard="toAddCard('user')"
              ></businessCardEdit>
              <businessCard v-non-permission="'MAS_EIDT'" :cardList="prncipal"></businessCard>
            </el-collapse-item>
            <el-collapse-item title="归口责任人" name="4">
              <businessCardEdit
                v-permission="'MAS_EIDT'"
                :cardList="prncipal"
                :oneOrMore="'one'"
                :isParentNode="isParentNode"
                @toDelCard="toDelCard(arguments)"
                @toAddCard="toAddCard('prncipal')"
                v-if="isParentNode"
              ></businessCardEdit>
              <businessCard v-permission="'MAS_EIDT'" v-else :cardList="prncipal"></businessCard>
              <businessCard v-non-permission="'MAS_EIDT'" :cardList="prncipal"></businessCard>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 关系信息弹窗 -->
    <el-dialog
      append-to-body
      :visible.sync="bReferenceIsVisible"
      class="relationTip"
      @close="closeReFer"
      >
      <div slot="title">请选择参考来源</div>
      <div>
        <el-form :inline="true" align="left">
          <!-- <el-col :span="11"> -->
            <el-form-item label="关系类型：" class="relType">
              <el-select
                @change="selectRelationType"
                v-model="referSource.fromClassifierId"
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
          <!-- </el-col> -->
          <!-- <el-col :span="12" style="margin-left:15px;"> -->
            <el-form-item label="关键字：" class="input">
              <el-input
                v-model="referSource.keyWord"
                placeholder="请输入标准代码/名称"
                size="mini"
                clearable
                @keyup.enter.native="handleCurrentChangeRefer(1)"
              >
                <i
                  slot="suffix"
                  style="cursor: pointer"
                  class="el-input__icon el-icon-search"
                  @click="handleCurrentChangeRefer(1)"
                ></i>
              </el-input>
            </el-form-item>
          <!-- </el-col> -->
        </el-form>
      </div>
      <el-table
        v-loading="referSource.bLoading"
        :data="referSource.tableData"
        border
        size="small"
        :header-cell-style="{background:'#f8f8f9',textAlign:'left'}"
        :cell-style="referClass"
        @row-click="clickReferTable"
      >
        <el-table-column property="code" label="标准代码" show-overflow-tooltip></el-table-column>
        <el-table-column property="name" label="标准名称" show-overflow-tooltip></el-table-column>
        <el-table-column property="classifierName" label="标准类型" show-overflow-tooltip></el-table-column>
      </el-table>
      <div style="text-align:center;margin-top:30px;" v-if="referSource.tableData.length>0">
        <el-pagination
          @size-change="handleSizeChangeRefer"
          @current-change="handleCurrentChangeRefer"
          :current-page="referSource.oPage.pageCurrent"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="referSource.oPage.pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :total="referSource.oPage.total"
        ></el-pagination>
      </div>
      <div style="margin-top:50px;">
        <span style="font-size:13px;">已选择：</span>
        <!--        <el-tag closable effect="plain" size="small">复用维度1</el-tag>-->
        <div v-show="referSource.referTag.length > 0">
          <el-tag
            style="margin-left: 5px;margin-top: 5px;"
            v-for="(item, index) in referSource.referTag"
            :key="index"
            v-show="referSource.referTag.length > 0"
            @close="closeReferTag(item, index)"
            closable
            effect="plain"
            size="mini"
          >{{item.name}}</el-tag>
        </div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary" size="small" @click="toSaveReference">确定</el-button>
      </div>
    </el-dialog>

    <!-- 认责信息  新增弹窗 -->
    <el-dialog append-to-body :visible.sync="bIsUserVisible" class="duty-dialog">
      <div slot="title">请选择用户</div>
      <div>
        <!-- <div class="tag-box" style>
          <span>已选择：</span>
          <el-tag size="small" @close="closeTag(item)" closable type="info"
                  v-for="item in oUser.aChoiceTag"
                  :key="item.userId"
          > {{ item.title }}</el-tag>
        </div>-->
        <div class="tag-box" v-if="oUser.aChoiceTag.length>0&&!whichAccount">
          <span>已选择：</span>
          <el-tag
            size="small"
            @close="closeTag(item)"
            closable
            type="info"
            v-for="item in oUser.aChoiceTag"
            :key="item.userId"
          >{{ item.title }}</el-tag>
        </div>
        <div class="tag-box" v-if="oUser.filterSponsorData&&whichAccount">
          <span>已选择：</span>
          <el-tag
            size="small"
            @close="closeTag(item)"
            closable
            type="info"
          >{{ oUser.filterSponsorData.title }}</el-tag>
        </div>
        <div class="tree-box">
          <el-input
            @input="toSearch"
            v-model="oUser.sKeyword"
            size="small"
            class="tree-box_input"
            placeholder="请输入姓名..."
            suffix-icon="el-icon-search"
            clearable
          ></el-input>
          <!--使用人-->
          <el-tree
            v-if="oUser.treeSelect.length === 0"
            :props="userProps"
            :data="userData"
            ref="tree"
            node-key="userId"
            @node-click="handleTreeNodeClick"
            style="height: 200px;overflow:auto;"
          ></el-tree>
          <!-- 责任人
          <el-tree
              v-if="oUser.treeSelect.length === 0&&!userFlag"
              :props="userProps"
              :data="prncipalData"
              ref="tree"
              node-key="userId"
              @node-click="handleTreeNodeClick"
          ></el-tree>-->
          <!--通过input搜索后，展示的div结构-->
          <div class="tree-select-div people" v-if="oUser.treeSelect.length>0">
            <div v-for="select in oUser.treeSelect" :key="select.userId" class="item">
              <p @click="handleTreeNodeClick(select)">{{select.title}} （ {{ select.parent }} )</p>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary" size="mini" @click="toSaveUser">确定</el-button>
      </div>
    </el-dialog>
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
import businessCard from "../../../../common/businessCard";
// import { get, post, parseAjaxResponse } from '../../../../utils/request'
import { generateLineageTitle } from "@/utils";
import deleteDialog from "../../../deleteDialog/deleteDialog";
import { loading } from "@/utils/layer";
import businessCardEdit from "../../../../common/businessCardEdit";
import opinionInputType from "../../../../common/opinionInputType";
// import opinionInputType from "@/views/common/opinionInputType";
import termsDialog from "../../../../common/termsDialog";
// import bus from '@/utils/bus'
import {
  get,
  post,
  postByJson,
  parseAjaxResponse
} from "../../../../../utils/request";
import pinyin from "pinyin";
export default {
  name: "masterDataDetails",
  components: {
    businessCard,
    deleteDialog,
    businessCardEdit,
    opinionInputType,
    termsDialog
  },
  data() {
    return {
      instanceId: "",
      classifierId: "",
      headerTitle: "",
      params: {},
      // 发布状态
      sStatus: "",
      activeName: "first",
      aBaseInfoActiveNames: ["1", "2", "3"],
      aRelationInfoActiveNames: ["1", "2", "3"],
      aAccountableInfoActiveNames: ["1", "2", "3", "4"],
      //
      oBaseInfoData: {
        oBusinessData: {
          sTitle: "业务属性",
          aList: []
        },
        oTechAttr: {
          sTitle: "技术属性",
          aList: []
        }
      },
      oPage: {
        pageCurrent: 1,
        pageSize: 10,
        total: 0
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
      oImplementInfo: {
        aList: [],
        oPage: {
          pageCurrent: 1,
          pageSize: 10,
          total: 0
        }
      },
      // 创建人列表 （单选，编辑时不可操作此项）
      creator: [
        // {
        //   userName: "林老师",
        //   mobilePhone: "1222233",
        //   email: "100@2222.com"
        // }
      ],
      // 发布人列表 （单选，编辑时不可操作此项）
      publisher: [],
      // 使用人列表 (多选 ， 可编辑)
      user: [],
      // 责任人列表 （单选，编辑时不可操作此项）
      prncipal: [],

      deleteDialog: false,
      favorite: false, // （false 未收藏；true 已收藏）
      relationData: {
        tableData: [],
        oPage: {
          pageCurrent: 1,
          pageSize: 10,
          total: 10
        }
      },
      confessActiveNames: ["1", "2", "3", "4"],
      bReferenceIsVisible: false, // 新增参考来源
      dialogTableVisible3: false,
      // 参考来源弹窗数据
      referSource: {
        fromClassifierId: "",
        relationshipId: "",
        keyWord: "",
        tableData: [],
        bLoading: false,
        referTag: [],
        oPage: {
          pageCurrent: 1,
          pageSize: 10,
          total: 0
        }
      },
      aMaster: [], // 参考来源 - 主数据与主数据
      aBizTerm: [], // 参考来源 - 主数据与业务术语

      relationList: [],
      selectReferenceList: [],

      selectUser: {
        select: [],
        wKeyword: "",
        problemTakerData: [],
        treeSelect: []
      },
      bIsShowCatalogTree: false,
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      bIsToSaveInfoItem: false,
      showSames: false, // 是否显示 相同标准名称 的提示框
      parentId: "",
      isParentNode: false,
      whichAccount: false,
      sameList: [],
      lockObj: {
        lock: false,
        first: true
      },
      eIndex: null, // 记录英文名称对应下标

      // 选择用户对话框是否可见
      bIsUserVisible: false,
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },

      userProps: {
        children: "children",
        label: "title"
        // isLeaf: 'leaf',
      },
      userData: [], // 使用人数据
      userFlag: false,
      prncipalData: [], // 归口责任人数据
      prncipalFlag: false,

      // 使用人数据
      oUser: {
        sKeyword: "", // 使用人input搜索变量
        aChoiceTag: [],
        aChoiceTagId: [],
        filterSponsorData: null,
        pfilterSponsorData: null,
        treeSelect: []
      },
      titleName: "",
      users: "", // array[string]
      prncipals: "", // string

      inputData: [], // 业务属性
      inputData2: [], // 技术属性
      fullPath: {
        name: "",
        id: ""
      },
      // 业务术语id
      buzTermId: "",
      // 业务术语 对话框是否可见
      bIsTermsVisible: false,

      // 标准的英文名属性存放的列名
      sEnName: "",
      // 业务术语影响的属性
      oBizTerm: {
        sCnName: "", // 标准名称
        sEnName: "", // 英文名称
        sBusinessDef: "", // 业务定义
        sDataType: "", // 数据类型
        acronym: "" // 缩写
      },

      // 跳转常量
      toDetailsConst: {
        toBizTerm: "BizTermInfoItem", // 业务术语
        toMasterData: "MasterDataInfoItem", // 主数据
        toIndex: "", // 指标管理
        toDimensionality: "DimentsionInfoItem", // 维度管理
        toPublicCode: "PublicCodeInfoItem" // 公共代码
      },
      eIndex2: null
    };
  },
  computed: {},
  methods: {
    handleBack() {
      this.$emit("showDetail", "cardMain");
    },
    // 获取参考信息 /masterData/listReference
    getListReferenceInfos() {
      // 参考
      get("/masterData/listReference", {
        id: this.instanceId,
        current: this.relationData.oPage.pageCurrent,
        size: this.relationData.oPage.pageSize
      }).then(res => {
        parseAjaxResponse(res, () => {
          // 参考
          this.relationData.tableData = res.data.records;
          this.relationData.oPage.pageCurrent = res.data.current;
          this.relationData.oPage.total = res.data.total;
        });
      });
    },
    // 参考来源-关系类型下拉框  /ds/listUsageRelationshipByToCId 根据目标元模型id获取标准规则可用的关系 供下拉框使用
    getRelationList() {
      get("/ds/listUsageRelationshipByToCId", {
        toClassifierId: this.classifierId
      }).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.relationList = res.data;
          }
        });
      });
    },
    // 参考来源 列表数据
    getReferSource() {
      this.referSource.bLoading = true;
      get("/ds/listReferenceInfo", {
        toInstanceId: this.instanceId,
        keyword: this.referSource.keyWord,
        fromClassifierId: this.referSource.fromClassifierId,
        pageCurrent: this.referSource.oPage.pageCurrent,
        pageSize: this.referSource.oPage.pageSize
      }).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000 && res.success) {
            this.referSource.tableData = res.data.records.map(item => {
              item.click = false;
              // 每一个item数据 增加关系类型字段
              item.relationship = this.referSource.relationshipId;
              return item;
            });
            this.referSource.oPage.total = res.data.total;
            this.referSource.bLoading = false;
          }
        });
      });
    },

    // 获取标准认责信息 /ds/listAccountability
    getListAccountability() {
      post("/ds/listAccountability", {
        instanceId: this.instanceId
      }).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.creator = res.data.creator;
            this.publisher = res.data.publisher;
            this.user = res.data.user;
            this.prncipal = res.data.prncipal;
            this.oUser.aChoiceTag = [];
            this.oUser.aChoiceTagId = [];
            this.user.map(val => {
              let obj = {
                title: val.username,
                userId: val.userId
              };
              this.oUser.aChoiceTag.push(obj);
              this.oUser.aChoiceTagId.push(val.userId);
            });
            this.oUser.filterSponsorData = null;
            this.oUser.pfilterSponsorData = null;
            this.prncipal.map(val => {
              let obj = {
                title: val.username,
                userId: val.userId
              };
              this.oUser.filterSponsorData = obj;
              this.oUser.pfilterSponsorData = obj.userId;
            });
          }
        });
      });
    },
    // 修改标准认责信息 /ds/editAccountability
    getEditAccountability() {
      let users = [];
      this.user.forEach(item => {
        if (item.userId) {
          users.push(item.userId);
        }
      });
      post("/ds/editAccountability", {
        instanceId: this.instanceId,
        users: users.join(",")
        // prncipals: this.prncipal[0].userId //责任人不让修改了
      }).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.$message.success(res.message);
            this.getListAccountability();
          }
        });
      });
    },
    // 获取用户按机构分组 /sys/user/listUserByGroup
    getListUserByGroup() {
      get("/sys/user/listUserByGroup").then(res => {
        parseAjaxResponse(res, () => {
          // console.log('listUserByGroup')
          // console.log(res)
          let resData = res.data;
          // 使用人
          this.userData = resData.map(child => {
            // if(child.users[0].userId !== undefined) {
            return {
              title: child.groupName,
              expand: false,
              // leaf: false,
              children: child.users.map(function(child2) {
                return {
                  title: child2.userName,
                  userId: child2.userId
                };
              })
            };
            // }else{
            //   return {
            //     title: child.groupName,
            //     // leaf: true, //部门下面没有数据，当前部门是叶子节点
            //   }
            // }
          });
          // 责任人
          this.prncipalData = resData.map(child => {
            return {
              title: child.groupName,
              expand: false,
              children: child.users.map(function(child2) {
                return {
                  title: child2.userName,
                  userId: child2.userId
                };
              })
            };
          });
        });
      });
    },
    closeReFer() {
      // 清空
      this.referSource.referTag = [];
      this.referSource.tableData.forEach(i => {
        i.click = false;
      });
    },
    // 选择  关系类型
    selectRelationType(val) {
      console.log(val);
      this.relationList.forEach(item => {
        if (val === item.fromClassifierId) {
          this.referSource.relationshipId = item.relationshipId;
        }
      });
      // 当前页设置为 1
      this.referSource.oPage.pageCurrent = 1;
      this.getReferSource();
    },
    // 跳转到详情页
    toDetails(row) {
      // console.log(row)
      if (row.classifierId === this.toDetailsConst.toBizTerm) {
        // 业务术语
        // 跳转到 业务术语详情
        this.$router.push({
          name: "professionalDetail",
          params: {
            id: row.id,
            _title: row.name,
            name: row.name
          }
        });
      } else if (row.classifierId === this.toDetailsConst.toMasterData) {
        // 主数据
        // 跳转到 主数据详情
        this.$router.push({
          name: "masterDataDetails",
          params: {
            id: row.id,
            classifierId: row.classifierId,
            _title: row.name,
            headerTitle: row.name
          }
        });
      } else if (row.classifierId === this.toDetailsConst.toPublicCode) {
        // 公共代码
        // 跳转到 主数据详情
        this.$router.push({
          name: "commonCode",
          params: {
            id: row.id,
            classifierId: row.classifierId,
            _title: row.name,
            headerTitle: row.name
          }
        });
      }
    },

    handleSizeChange(val) {
      this.relationData.oPage.pageSize = val;
      this.getListReferenceInfos();
    },
    handleCurrentChange(val) {
      this.relationData.oPage.pageCurrent = val;
      this.getListReferenceInfos();
    },

    // 点击参考来源 每一行
    clickReferTable(row, column, event) {
      // 主数据与主数据、主数据与业务术语 单选
      if (this.referSource.fromClassifierId === "MasterDataInfoItem") {
        this.referSource.tableData.map(item => {
          if (item.id === row.id) {
            item.click = true;
          } else {
            item.click = false;
          }
          return item;
        });
        if (!this.aMaster.includes(row)) {
          this.aMaster.splice(0, 1, row);
        }
        let sIndex = null;
        this.referSource.referTag.find((item, index) => {
          if (item.classifierId === "MasterDataInfoItem") {
            sIndex = index;
            return sIndex;
          }
        });
        if (sIndex !== null) {
          this.referSource.referTag.splice(sIndex, 1, this.aMaster[0]);
        } else {
          this.referSource.referTag.push(this.aMaster[0]);
        }
      }
      // 主数据与业务术语 单选
      if (this.referSource.fromClassifierId === "BizTermInfoItem") {
        this.referSource.tableData.map(item => {
          if (item.id === row.id) {
            item.click = true;
          } else {
            item.click = false;
          }
          return item;
        });
        if (!this.aBizTerm.includes(row)) {
          this.aBizTerm.splice(0, 1, row);
        }
        let sIndex = null;
        this.referSource.referTag.find((item, index) => {
          if (item.classifierId === "BizTermInfoItem") {
            sIndex = index;
            return sIndex;
          }
        });
        if (sIndex !== null) {
          this.referSource.referTag.splice(sIndex, 1, this.aBizTerm[0]);
        } else {
          this.referSource.referTag.push(this.aBizTerm[0]);
        }
      }
      // 主数据与公共代码 多选
      if (this.referSource.fromClassifierId === "PublicCodeInfoItem") {
        this.referSource.tableData.map(item => {
          if (item.id === row.id) {
            item.click = true;
          }
          return item;
        });
        let isHas = false;
        this.referSource.referTag.find((item, index) => {
          if (item.id === row.id) {
            isHas = true;
          }
        });
        if (!isHas) {
          this.referSource.referTag.push(row);
        }
      }
    },
    // 参考来源选中，改变背景颜色
    referClass({ row, column, rowIndex, columnIndex }) {
      // console.log(row);
      if (row.click) {
        return "background: #ecf5ff;";
      } else {
        return "";
      }
    },
    // 参考来源 - 删除选中tag
    closeReferTag(item, index) {
      this.referSource.tableData.map(i => {
        if (i.id === item.id) {
          i.click = false;
        }
        return i;
      });
      this.referSource.referTag.splice(index, 1);
    },
    // 参考来源 分页
    handleSizeChangeRefer(val) {
      this.referSource.oPage.pageSize = val;
      this.getReferSource();
    },
    handleCurrentChangeRefer(val) {
      this.referSource.oPage.pageCurrent = val;
      this.getReferSource();
    },

    // 弹出业务术语框
    toTerms() {
      this.bIsTermsVisible = true;
    },
    // 业务术语 - 确定
    toSaveTerms(tagData) {
      console.log(tagData);
      console.log(this.inputData);
      if (tagData !== undefined) {
        this.buzTermId = tagData.id; // 业务术语id
        // INSTANCE_NAME 中文名称
        // STRING_3 英文名称
        // STRING_5 业务定义
        // STRING_8 数据类型
        // STRING_10 取值范围

        // 填充页面数据
        this.inputData.forEach((item, index) => {
          if (item.columnName === this.oBizTerm.sCnName) {
            // 标准中文名称
            item.attrValue = tagData.name;
          } else if (item.columnName === this.sEnName) {
            // 英文名称
            item.attrValue = tagData.code;
          } else if (item.columnName === this.oBizTerm.sBusinessDef) {
            // 业务定义
            item.attrValue = tagData.businessDef;
          } else if (item.columnName === this.oBizTerm.sDataType) {
            // 数据类型
            let key = null;
            tagData.attributes.map((val, k) => {
              if (val.attrStore === "string4") {
                key = k;
              }
            });
            item.attrValue = tagData.attributes[key].value;
          } else if (item.columnName === this.oBizTerm.acronym) {
            let key = null;
            tagData.attributes.map((val, k) => {
              if (val.attrStore === "string3") {
                key = k;
              }
            });
            // console.log(key);
            this.$set(
              this.inputData[index],
              "attrValue",
              tagData.attributes[key].value
            );
            // item.attrValue = tagData.attributes[key].value
          } /* else if (item.columnName === 'STRING_10') { // 取值范围 （不回显了）
              item.attrValue = tagData.attributes[3].value
            }*/
        });
        this.bIsTermsVisible = false;
      } else {
        this.$message.warning("请选择业务术语");
      }
    },
    close() {
      this.bIsTermsVisible = false;
    },

    // isClass({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 0) {
    //     return "text-align:center;border-right:none;";
    //   } else {
    //     return "text-align:center;";
    //   }
    // },
    // isClass2({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 0) {
    //     return "tableClass";
    //   }
    // },
    // 显示选择目录的tree
    toShowCatalogTree() {
      this.bIsShowCatalogTree = !this.bIsShowCatalogTree;
    },

    toAddReference() {
      this.bReferenceIsVisible = true;
      this.getRelationList();
    },
    handleNodeClick(data) {
      // console.log(data);
      this.baseInfoRuleForm.catalog = data.label;
    },

    // 删除用户
    toDelCard(item) {
      // console.log(item)
      let data = item[0];
      let which = item[1];
      if (which === "one") {
        this.oUser.filterSponsorData = null;
        this.oUser.pfilterSponsorData = null;
      } else if (which === "more") {
        this.oUser.aChoiceTag.splice(
          this.oUser.aChoiceTagId.indexOf(data.userId),
          1
        );
        this.oUser.aChoiceTagId.splice(
          this.oUser.aChoiceTagId.indexOf(data.userId),
          1
        );
        // this.accusationData.userList.map((val, index) => {
        //   if (tag.userId === val.userId) {
        //     this.accusationData.userList.splice(index, 1);
        //     return
        //   }
        // })
      }
      this.toSaveUser();
      // this.getEditAccountability()
    },
    toAddCard(str) {
      if (str === "user") {
        // this.userFlag = true
        // this.prncipalFlag = false
        this.whichAccount = false;
      } else if (str === "prncipal") {
        // if (this.prncipal.length === 1) {
        //   this.$message.warning('责任人单选，请删除当前责任人再增加')
        //   return
        // }
        // this.userFlag = false
        // this.prncipalFlag = true
        this.whichAccount = true;
      }
      this.bIsUserVisible = true;
      // this.oUser.aChoiceTag = []
      // this.oUser.aChoiceTagId = []
      // 根据使用人列表，填充选择用户对话框的tag
      // if (this.user.length > 0) {
      //   this.user.forEach((item, index) => {
      //     this.oUser.aChoiceTag.push({
      //       title: item.username,
      //       userId: item.userId
      //     })
      //     this.oUser.aChoiceTagId.push(item.userId)
      //   })
      // }
      // 获取用户
      this.getListUserByGroup();
    },

    // 关闭tags
    closeTag(item) {
      // console.log(item);
      let index = this.oUser.aChoiceTag.indexOf(item);
      this.oUser.aChoiceTag.splice(index, 1);
      this.oUser.aChoiceTagId.splice(index, 1);
    },
    // tree树节点，点击事件
    handleTreeNodeClick(data) {
      // console.log(data)
      const that = this;
      if (data) {
        if (data.userId !== undefined && !this.whichAccount) {
          // 点击parent层，不添加数据
          // 使用人 多选
          if (that.oUser.aChoiceTagId.indexOf(data.userId) === -1) {
            that.oUser.aChoiceTag.push(data);
            that.oUser.aChoiceTagId.push(data.userId);
          }
        } else if (data.userId !== undefined && this.whichAccount) {
          this.oUser.filterSponsorData = data;
          this.oUser.pfilterSponsorData = data.userId;
        }
      }
    },
    // 选择用户 - 确定
    toSaveUser() {
      let params = {
        instanceId: this.instanceId,
        users: this.oUser.aChoiceTagId.join(","),
        prncipals: this.oUser.pfilterSponsorData
      };
      post("/ds/editAccountability", params).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.bIsUserVisible = false;
          this.$message({
            message: res.message,
            type: "success"
          });
          this.getListAccountability();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 删除
    delReference() {
      let list = [];
      if (this.selectReferenceList.length > 0) {
        this.$confirm("确定删除选中数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.selectReferenceList.map(item => {
              list.push(item.id);
            });
            let msg = {
              fromIds: list.join(","),
              toId: this.instanceId
            };
            // 删除参考信息 /ds/removeReferenceInfo
            post("/ds/removeReferenceInfo", msg).then(res => {
              parseAjaxResponse(res, () => {
                if (res.code === 10000 && res.success) {
                  this.$message.success(res.message);
                  this.getListReferenceInfos();
                }
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message.warning("请勾选需要删除的数据");
      }
    },

    toSaveReference() {
      let msg = [];
      this.referSource.referTag.map(item => {
        // console.log(item);
        msg.push({
          fromInstanceClassifierId: item.classifierId, // 源规则类型
          fromInstanceId: item.id, // 源规则id
          relationship: item.relationship, // 关系类型
          toInstanceClassifierId: this.classifierId, // 目标规则类型
          toInstanceId: this.instanceId
        });
      });
      // console.log(msg)
      postByJson("/ds/createReferenceInfo", msg).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000 && res.success) {
            this.$message.success(res.message);
            this.bReferenceIsVisible = false;
            // 清空
            this.referSource.referTag = [];
            this.referSource.tableData.forEach(i => {
              i.click = false;
            });
            // 刷新参考列表
            this.getListReferenceInfos();
          }
        });
      });
    },
    toSearch() {
      // console.log(this.oUser.sKeyword)
      var str;
      var pattern = new RegExp("[\u4E00-\u9FA5]+");
      var pattern2 = new RegExp("[A-Za-z]+");
      if (pattern.test(this.oUser.sKeyword)) {
        str = "中文";
      } else if (pattern2.test(this.oUser.sKeyword)) {
        str = "英文";
      }
      if (str === "英文") {
        this.enSearch();
      } else if (str === "中文") {
        this.cnSearch();
      }
    },
    // 英文搜索
    enSearch() {
      this.oUser.sKeyword = this.oUser.sKeyword.toLowerCase();
      let res = this.userData;
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
      // console.log(res)
      res.map(val => {
        if (this.oUser.sKeyword) {
          if (val.spname.indexOf(this.oUser.sKeyword) !== -1) {
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
          } else if (val.pname.indexOf(this.oUser.sKeyword) !== -1) {
            let bool = false;
            for (let m = 0; m < val.spname.length; m++) {
              if (this.oUser.sKeyword[0] === val.spname[m]) {
                bool = true;
              }
            }
            // console.log(bool)
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
                if (item.pname.indexOf(this.oUser.sKeyword) !== -1) {
                  let bool = false;
                  for (let m = 0; m < item.spname.length; m++) {
                    if (this.oUser.sKeyword[0] === item.spname[m]) {
                      bool = true;
                    }
                  }

                  if (bool) {
                    let n = item;
                    n.parent = val.title;
                    selectArr.push(n);
                  }
                } else if (item.spname.indexOf(this.oUser.sKeyword) !== -1) {
                  let n = item;
                  n.parent = val.title;
                  selectArr.push(n);
                }
              });
            }
          }
        }
      });
      // console.log(selectArr)
      this.oUser.treeSelect = selectArr;
    },
    // 中文搜索
    cnSearch() {
      let selectArr = [];
      let res = this.userData;
      // console.log(res)
      res.map(val => {
        if (this.oUser.sKeyword) {
          if (val.title.indexOf(this.oUser.sKeyword) > -1) {
            for (let i = 0; i < val.children.length; i++) {
              if (val.children[i].title) {
                selectArr.push({
                  title: val.children[i].title,
                  userId: val.children[i].userId,
                  parent: val.title,
                  hasAuthority: val.children[i].hasAuthority
                });
              }
            }
          } else {
            let child = val.children;
            child.map(item => {
              if (item.title && item.title.indexOf(this.oUser.sKeyword) > -1) {
                selectArr.push({
                  title: item["title"],
                  userId: item["userId"],
                  parent: val["title"],
                  hasAuthority: item.hasAuthority
                });
              }
            });
          }
        }
      });
      // console.log(selectArr);
      this.oUser.treeSelect = selectArr;
    },
    // 获取收藏状态
    collectionStatus() {
      get("/home/collection/weatherDsCollection", {
        instanceId: this.instanceId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.favorite = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 收藏或取消收藏
    handleCollect() {
      if (!this.favorite) {
        this.toCollection();
      } else {
        this.cancelCollection();
      }
    },
    // 收藏
    toCollection() {
      post("/home/collection/determineDsCollection", {
        instanceId: this.params.id
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.favorite = !this.favorite;
          this.$message.success("已收藏");
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 取消收藏
    cancelCollection() {
      get("/home/collection/cancelDsCollection", {
        instanceId: this.params.id
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.favorite = !this.favorite;
          this.$message.success("取消收藏");
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取主数据详情信息 /masterData/getMasterDataDetail
    getMasterDataDetail() {
      get("/masterData/getMasterDataDetail", {
        id: this.instanceId
      }).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.oBaseInfoData.oBusinessData.aList = [];
            this.oBaseInfoData.oTechAttr.aList = [];
            // 页面标题
            this.headerTitle = `${res.data.name} (${res.data.enName})`;
            res.data.basicInfo.forEach(item => {
              if (
                item.belongs === "基本属性" ||
                item.belongs === "业务属性" ||
                item.belongs === "管理属性"
              ) {
                this.oBaseInfoData.oBusinessData.sTitle = "业务属性";
                if (item.attrName === "发布状态") {
                  this.sStatus = item.attrValue;
                }
                if (!item.hidden) {
                  // hidden为true的不显示出来 标准ID
                  /* 是否必填、关键属性 数据解析 */
                  if (item.attrValue === "T") {
                    item.attrValue = "是";
                  } else if (item.attrValue === "F") {
                    item.attrValue = "否";
                  }
                  this.oBaseInfoData.oBusinessData.aList.push({
                    key: item.attrName,
                    value: item.attrValue
                  });
                }
              }
              if (item.belongs === "技术属性") {
                this.oBaseInfoData.oTechAttr.sTitle = item.belongs;
                this.oBaseInfoData.oTechAttr.aList.push({
                  key: item.attrName,
                  value: item.attrValue
                });
              }
            });
          }
        });
      });
    },
    // 获取应用信息 /masterData/listUsage
    getListUsageInfos() {
      // 应用
      get("/masterData/listUsage", {
        id: this.instanceId,
        current: this.oUsageInfo.oPage.pageCurrent,
        size: this.oUsageInfo.oPage.pageSize
      }).then(res => {
        parseAjaxResponse(res, () => {
          // 应用
          this.oUsageInfo.aList = res.data.records;
          this.oUsageInfo.oPage.pageCurrent = res.data.current;
          this.oUsageInfo.oPage.total = res.data.total;
        });
      });
    },
    // 编辑
    toEdit() {
      let params = {
        id: this.instanceId,
        classifierId: this.classifierId,
        _title: this.headerTitle
      };
      this.$emit("toEdit", params);
      // this.$router.push({
      //   name: 'masterDataEdit',
      //   params: {
      //     id: this.instanceId,
      //     classifierId: this.classifierId,
      //     _title: this.headerTitle
      //   }
      // })
    },
    /* 关闭tag*/
    isActive(route) {
      return route.path === this.$route.path;
    },
    closeSelectedTag(view) {
      this.$store.dispatch("delVisitedViews", view).then(views => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push(this.$route.path);
          }
        }
      });
    },
    // 删除
    deleteItem() {
      this.deleteDialog = true;
      console.log(this.$refs.deleteMenuDialog);
      this.$nextTick(() => {
        this.$refs.deleteMenuDialog.getAllMsg(this.instanceId);
      });
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
          post("/masterData/removeMasterData", {
            instanceIds: this.instanceId
          }).then(res => {
            parseAjaxResponse(
              res,
              () => {
                if (res.code === 10000) {
                  load.close();
                  this.$message.success("删除成功");
                  this.deleteDialog = false;
                  // 关闭当前页面
                  // this.closeSelectedTag(this.$route)
                  // 跳转到主数据入口页面
                  // this.$router.push({ name: "masterData" });
                  this.$emit("refreshTable");
                  this.$emit("showDetail", "cardMain");
                }
              },
              () => {
                load.close();
              }
            );
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSelectionChange(val) {
      this.selectReferenceList = val;
    },
    handleClick(tab, event) {
      if (tab.name === "second") {
        // 关系信息
        this.getListReferenceInfos();
        this.getListUsageInfos();
      } else if (tab.name === "third") {
        // 认责信息
        this.getListAccountability();
      }
    },
    handleChange(val) {
      console.log(val);
    },

    handleSizeChangeReference(val) {
      this.oRelationInfo.oPage.pageSize = val;
      this.getListReferenceInfos();
    },
    handleCurrentChangeReference(val) {
      this.oRelationInfo.oPage.pageCurrent = val;
      this.getListReferenceInfos();
    },
    handleSizeChangeUsage(val) {
      this.oUsageInfo.oPage.pageSize = val;
      this.getListUsageInfos();
    },
    handleCurrentChangeUsage(val) {
      this.oUsageInfo.oPage.pageCurrent = val;
      this.getListUsageInfos();
    },
    handleSizeChangeoImplement(val) {
      this.ooImplementInfo.oPage.pageSize = val;
      this.getListoImplementInfos();
    },
    handleCurrentChangeoImplement(val) {
      this.ooImplementInfo.oPage.pageCurrent = val;
      this.getListoImplementInfos();
    },
    handleCommand(command) {
      this.$router.push({
        name: "dsLineageAnalysisCanvas",
        params: {
          dataFlowType: command,
          id: this.instanceId,
          _title: generateLineageTitle(command, this.headerTitle)
        }
      });
    },
    // 获取标准的英文名属性存放的列名 /dsm/getEnNameStoreColumn
    getEnNameStoreColumn() {
      get("/dsm/getEnNameStoreColumn", {
        classifierId: this.classifierId // 数据标准类型
      }).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.sEnName = res.data;
          }
        });
      });
    },
    // 获取业务术语影响的属性 /dsm/listBizTermInfoItemAttrStoreColumn
    getListBizTermInfoItemAttrStoreColumn() {
      get("/dsm/listBizTermInfoItemAttrStoreColumn", {
        classifierId: this.classifierId // 数据标准类型
      }).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            res.data.forEach((item, index) => {
              if (item.attStore === "INSTANCE_NAME") {
                this.oBizTerm.sCnName = item.attStore;
              } else if (item.attStore === "STRING_3") {
                this.oBizTerm.sEnName = item.attStore;
              } else if (item.attStore === "STRING_5") {
                this.oBizTerm.sBusinessDef = item.attStore;
              } else if (item.attStore === "STRING_8") {
                this.oBizTerm.sDataType = item.attStore;
              } else if (item.attStore === "STRING_9") {
                this.oBizTerm.acronym = item.attStore;
              }
            });
          }
        });
      });
    },
    // 实施
    // 新增
    addImplement() {},
    // 删除
    deleteImplement() {},
    getParMsg(val) {
      if (val) {
        this.params = val;
        this.instanceId = val.id;
        this.classifierId = val.classifierId;
        this.headerTitle = val.headerTitle;
      }
      this.activeName = "first";
      this.aBaseInfoActiveNames = ["1", "2", "3"];
      this.aRelationInfoActiveNames = ["1", "2", "3"];
      this.aAccountableInfoActiveNames = ["1", "2", "3", "4"];
      this.confessActiveNames = ["1", "2", "3", "4"];
      this.getMasterDataDetail();
      this.collectionStatus();
      this.getEnNameStoreColumn();
      this.getListBizTermInfoItemAttrStoreColumn();
      this.$emit("showDetail", "masterDetail");
    }
  },
  created() {
    // this.getMasterDataDetail()
    // this.collectionStatus()
  }
};
</script>

<style lang="scss" scoped>
//外层card容器样式
@import "src/styles/dq/main-card-table.scss";
$collapse-font-size: 18px;
$collapse-header-size: 16px;
.mb10 {
  margin-bottom: 10px;
}
.master-data-details {
  height: 100%;
  .card-container {
    // padding: 20px 60px;
    padding: 16px;
    padding-top: 9px;
    overflow: auto;
    .button {
      /deep/ .el-button {
        padding: 0;
      }
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
      // border-bottom: 1px solid #EBEEF5;
      margin-bottom: 10px;
    }
    /deep/ .el-collapse {
      border: unset;
    }
    /deep/ .el-collapse-item__wrap {
      border: unset;
    }
    .line {
      height: 100%;
      width: 4px;
      background: #579ef3;
      margin-right: 15px;
    }
    /deep/ .el-card__header {
      padding: 0;
      border: unset;
    }
    /deep/ .el-card__body {
      padding: 10px 0;
    }
    /deep/ .el-tab__item {
      height: 36px;
      width: 90px;
      line-height: 36px;
      text-align: center;
      padding: 0px !important;
    }
    .card-header {
      padding-top: 0;
      /*收藏*/
      .collect {
        line-height: 26px;
        font-size: 18px;
      }
      .title {
        font-family: "PingFangSC-Semibold", "PingFang SC Semibold",
          "PingFang SC";
        font-weight: bold;
        font-style: normal;
        font-size: 18px;
        color: rgba(102, 102, 102, 0.847059);
        line-height: 24px;
        margin-right: 16px;
      }
      .el-tag {
        height: 24px;
        line-height: 24px;
      }
      .button-box {
        .el-button + .el-button {
          margin-left: 1px;
        }
        .el-button {
          margin-right: 5px;
        }
        //按钮组样式 公共样式
        .btn {
          width: 85px;
          height: 34px;
          padding: 0px 13px;
          .svg-icon {
            width: 24px;
            height: 24px;
            top: 4px;
            position: relative;
          }
          .btn-text {
            font-size: 15px;
            line-height: 32px;
          }
        }
        //血统分析
        .btn1 {
          width: 80px;
          text-align: center;
          padding: 0px;
          height: 34px;
          .dataTable-icon {
            position: absolute;
            display: inline-block;
            width: 24px;
            height: 24px;
            left: 7px;
            top: 5px;
          }
          .blood {
            background: url("../../../../../../src/assets/images/commonIcon/blood-icon.png")
              no-repeat;
            background-size: 100%;
          }
          height: 34px;
          // padding: 0px 10px;
          .svg-icon:nth-of-type(1) {
            width: 20px;
            height: 20px;
            top: 3px;
            position: relative;
          }
          .svg-icon:nth-of-type(2) {
            width: 13px;
            height: 16px;
            top: 1px;
            position: relative;
          }
          .btn-text {
            font-size: 15px;
            line-height: 32px;
            padding-left: 18px;
          }
        }
        //新增图标大小
        .btn.add {
          .svg-icon {
            width: 20px;
            height: 20px;
            top: 2px;
            position: relative;
          }
        }
      }
    }

    /deep/ .el-card__body {
      .el-tabs__header {
        .el-tabs__nav-scroll {
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
      /deep/ .el-tabs__content {
        .base-info {
          .el-collapse {
            border: unset;
            margin-top: 20px;
            // .el-collapse-item__header{
            //   font-size: $collapse-font-size;
            //   color: #666666;
            //   padding: 0 20px;
            //   border-bottom: 1px solid rgba(233, 233, 233, 1);
            // }
            /deep/ .el-collapse-item__wrap {
              border-bottom: unset;
            }
          }

          /deep/ .title {
            .el-collapse-item__header {
              //   font-size: $collapse-font-size;
              color: #666666;
              padding: 0 20px;
              //   border-bottom: 1px solid rgba(233, 233, 233, 1);
            }
            /deep/ .el-collapse-item__content {
              font-family: "PingFangSC-Regular", "PingFang SC";
              font-weight: 400;
              font-style: normal;
              font-size: 14px;
              color: #666666;
              // padding: 20px 60px;
              overflow: hidden;
              padding: 20px 30px;
            }
            .content {
              margin-bottom: 10px;
              .content-key {
                float: left;
              }
              .content-value {
                float: left;
                // width: 800px;
                .el-card {
                  background: #f8f8f8;
                  margin-top: 5px;
                  code {
                    background: #f8f8f8;
                    padding: 0px;
                    margin-bottom: -52px;
                    margin-top: -20px;
                  }
                }
              }
              .clearfix {
                clear: both;
              }
            }
          }
        }
      }
    }
  }

  .delete-dialog {
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
  .dialog-btn {
    text-align: center;
    border-top: 1px solid #e8ebed;
    padding-top: 10px;
    .el-button {
      padding: 10px 20px;
    }
  }
  .relationship, .confess-account {
    padding: 0 15px;
    /deep/ .el-collapse-item__header {
      border-bottom: 1px solid #EBEEF5;
    }
  }
}
.deleteRed {
  width: 25px;
  height: 25px;
}
.relationTip /deep/ {
  .el-dialog__header {
    border-bottom: 1px solid #e8ebed;
  }
}
.duty-dialog /deep/ {
  .el-dialog__header {
    border-bottom: 1px solid #e8ebed;
  }
}
.relType /deep/ {
  width: 50%;
  .el-form-item__content {
    width: calc(100% - 65px);
  }
  .el-select {
    width: 100%;
  }
}
.el-dropdown-menu__item {
  padding: 0;
  text-align: center;
  width: 80px;
}
</style>
