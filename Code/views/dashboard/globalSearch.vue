<template>
  <div class="globalHole">
    <el-container class="globalHole-container">
      <el-aside width="185px">
        <el-card shadow="hover">
          <el-tabs tab-position="left" class="tab-change" :stretch="true"
              v-model="activeName"
              @tab-click="handleClick">
            <el-tab-pane v-for="(item ,index) in list" :key="index" label="元数据" :name="item.name">
              <span class="global-slot" slot="label">
                  <i :class="item.class"></i>
                  <span>{{item.title}}({{item.total?item.total:0}})</span>
                </span>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-aside>
      <el-main>
        <el-card shadow="hover">
          <el-tabs
              class="global-ul"
              :stretch="true"
              v-model="activeName"
              @tab-click="handleClick"
            >
              <el-tab-pane v-for="(item ,index) in list" :key="index" label="元数据" :name="item.name">
                <span class="global-slot" slot="label">
                  <i :class="item.class"></i>
                  <span>{{item.title}}({{item.total?item.total:0}})</span>
                </span>
                <div class="search-box">
                  <div>关键字：【{{keyword}}】的搜索结果如下</div>
                  <!-- 元数据搜索 -->
                  <el-form :inline="true" :model="firstSearchList" size="mini" class="form-box" v-if="item.name==='first'">
                    <el-form-item label="元数据类型：">
                      <el-select v-model="firstSearchList.type" placeholder="请选择" clearable @change="handeSelectChange" class="option-box">
                        <el-option :label="v.name+' '+v.id" :value="v.id" v-for="v in item.searchList" :key="v.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="元数据代码：">
                      <el-input v-model="firstSearchList.code" placeholder="请输入搜索关键字..." clearable></el-input>
                    </el-form-item>
                    <el-form-item label="元数据名称：">
                      <el-input v-model="firstSearchList.name" placeholder="请输入搜索关键字..." clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit(item.type)">搜索</el-button>
                    </el-form-item>
                  </el-form>
                  <!-- 数据标准搜索 -->
                  <el-form :inline="true" :model="secondSearchList" size="mini" class="form-box" v-if="item.name==='second'">
                    <el-form-item label="标准类型：">
                      <el-select v-model="secondSearchList.type" placeholder="请选择" clearable @change="handeSelectChange2">
                        <el-option :label="v.name+' '+v.id" :value="v.id" v-for="v in item.searchList" :key="v.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="标准编号：">
                      <el-input v-model="secondSearchList.code" placeholder="请输入搜索关键字..." clearable></el-input>
                    </el-form-item>
                    <el-form-item label="标准名称：">
                      <el-input v-model="secondSearchList.name" placeholder="请输入搜索关键字..." clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit(item.type)">搜索</el-button>
                    </el-form-item>
                  </el-form>
                  <!-- 业务规则搜索 -->
                  <el-form :inline="true" :model="thirdSearchList" size="mini" class="form-box" v-if="item.name==='third'">
                    <el-form-item label="规则类型：">
                      <el-select v-model="thirdSearchList.type" placeholder="请选择" clearable @change="handeSelectChange3">
                        <el-option :label="v.dictName" :value="v.dictCode" v-for="v in item.searchList" :key="v.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="规则名称：">
                      <el-input v-model="thirdSearchList.name" placeholder="请输入搜索关键字..." clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit(item.type)">搜索</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="global-ul-style">
                  <!-- 元数据 -->
                  <ul v-if="item.records.total > 0 && item.name==='first'">
                    <li
                      v-for="(i , num) in item.records.records"
                      @click="clickToMetaDataDetails(i)"
                      :key="num"
                    >
                      <div>
                        <div class="img">{{i.classifierId}}</div>
                        <div class="right-part">
                          <div class="title">
                            {{i.code}}
                            <span>（{{i.name}}）</span>
                          </div>
                          <div class="text text-ellipsis">
                            <span
                              style="margin-left:0;"
                              class="text-item"
                            >元数据类型：{{i.classifierName}}（{{i.classifierId}}）</span>
                            <span>|</span>
                            <span class="text-item">上下文路径：{{i.path}}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <!-- 数据标准 -->
                  <ul v-if="item.records.total > 0 && item.name==='second'">
                    <li
                      @click="handleToSdDetails(i)"
                      v-for="(i , num) in item.records.records"
                      :key="num"
                    >
                      <div>
                        <div class="img">{{i.classifierId}}</div>
                        <div class="img biao">{{i.classifierName[0]}}</div>
                        <div class="right-part">
                          <div class="title">
                            {{i.name}}
                            <span>（{{i.code}}）</span>
                            <el-tag type="success"
                            >{{i.classifierName}}</el-tag>
                            <!-- <el-tag
                              effect="plain"
                              v-if="i.classifierId==='CommonCodeInfoItem'"
                              style="color:purple;border-color:purple;"
                            >{{i.classifierName}}</el-tag>
                            <el-tag
                              effect="plain"
                              v-if="i.classifierId==='IndexInfoItem'"
                              style="color:blue;border-color:blue;"
                            >{{i.classifierName}}</el-tag> -->
                          </div>
                          <!-- <div
                            v-if="i.businessDef"
                            class="text text-ellipsis"
                          >业务定义：{{i.businessDef}}</div> -->
                          <div class="text text-ellipsis">上下文路径：{{i.path}}</div>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <!-- 业务规则 -->
                  <ul v-if="item.records.total > 0  && item.name==='third'">
                    <li v-for="(i , num) in item.records.records" :key="num">
                      <div>
                        <div v-if="item.name==='third'" class="img ye">业</div>
                        <div class="right-part">
                          <div class="title">
                            <span
                              style="color: #2b85e4;cursor: pointer;"
                              @click="getRulesForm(i)"
                            >{{i.ruleName}}</span>
                            <el-tag type="success" effect="plain">{{i.dimension}}</el-tag>
                          </div>
                          <div class="text">
                            <span class="text-item">数据项：{{i.checkDateItem}}</span> |
                            <span class="text-item">
                              关联标准：
                              <span
                                class="blue-color"
                                @click="contactStandard(i)"
                              >{{(i.isRelStandard > 0)? '是' : '否'}}</span>
                            </span> |
                            <span class="text-item">
                              是否关联稽核方法：
                              <span
                                class="blue-color"
                                @click="auditingMethod(i)"
                              >{{(i.isRelFun > 0) ? '是' : '否'}}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <!-- 知识文档 -->
                  <ul v-if="item.records.total > 0 && item.name==='fouth'">
                    <li v-for="(i , num) in item.records.records" :key="num">
                      <div>
                        <div class="img">{{i.classifierId}}</div>
                        <div v-if="item.name==='second'" class="img biao">标</div>
                        <div v-if="item.name==='third'" class="img ye">业</div>

                        <div class="right-part">
                          <div class="title">
                            {{i.code}}
                            <span>（{{i.name}}）</span>
                            <div class="right-tags" v-if="item.name==='second'">
                              <el-tag
                                effect="plain"
                                v-if="item.classifierId==='InfoItem'"
                                style="color:green;border-color:green;"
                              >{{item.classifierName}}</el-tag>
                              <el-tag
                                effect="plain"
                                v-if="item.classifierId==='CommonCodeInfoItem'"
                                style="color:purple;border-color:purple;"
                              >{{item.classifierName}}</el-tag>
                              <el-tag
                                effect="plain"
                                v-if="item.classifierId==='IndexInfoItem'"
                                style="color:blue;border-color:blue;"
                              >{{item.classifierName}}</el-tag>
                            </div>
                          </div>
                          <div class="text text-ellipsis">
                            <span style="margin-left:0;" class="text-item">元数据类型：字段（Column）</span>
                            <span>|</span>
                            <span
                              class="text-item"
                            >上下文路径：/信息系统元数据/BDW/BDW.PROC_B02_ACCT_PROD_WD_D1中间表， BDW.BDW.PROC_B02_ACCT_PROD_VAL_METRICS_D1中间表/一级科目代码</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <ul style="text-align: center;margin:20px 0;" v-if="item.total === 0">暂无数据</ul>
                </div>
                <div style="text-align: center;padding:18px 0">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageCurrent"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="item.total"
                  ></el-pagination>
                </div>
              </el-tab-pane>
            </el-tabs>
        </el-card>
      </el-main>
    </el-container>
    <div class="global-content">
      <!-- 详情弹窗 -->
      <el-dialog
        class="globalSearch-el-form"
        title="详情"
        width="800"
        :visible.sync="dialogFormVisible"
      >
        <el-form label-position="right" :model="formItem" label-width="120px">
          <el-form-item label="规则名称：">
            <el-input v-model="formItem.ruleName" placeholder="这里是规则名称" readonly></el-input>
          </el-form-item>
          <el-form-item label="信息项：">
            <el-input v-model="formItem.infoItem" placeholder="这里是信息项内容" readonly></el-input>
          </el-form-item>
          <el-form-item label="质量维度：">
            <el-input v-model="formItem.dimension" placeholder="这里是质量维度" readonly></el-input>
          </el-form-item>
          <el-form-item label="数据质量需求：">
            <el-input
              v-model="formItem.demand"
              type="textarea"
              :autosize="{minRows: 3}"
              placeholder="这里是数据质量需求"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="数据质量描述：">
            <el-input
              v-model="formItem.qualityDesc"
              type="textarea"
              :autosize="{minRows: 3}"
              placeholder="这里是数据质量描述"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="影响描述：">
            <el-input
              v-model="formItem.effectDesc"
              type="textarea"
              :autosize="{minRows: 3}"
              placeholder="这里是影响描述"
              readonly
            ></el-input>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
          style="border-top: 1px solid #e8eaec;padding: 12px 18px 12px 18px;"
        >
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 关联标准列表、关联稽核方法列表 -->
      <el-dialog
        class="globalSearch-el-form"
        :visible.sync="tableDialog"
        :title="modalData.title"
        :styles="{top: '20px'}"
        width="800px"
      >
        <div>
          <el-table
            :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
            style="width: 100%"
            border
            :data="modalData.data"
          >
            <template v-for="(item) in modalData.titleData">
              <el-table-column
                v-if="item.label === '稽核方法编号'"
                :prop="item.name"
                :label="item.label"
                :key="item.classId"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="clickToAuditFuncsDetails(scope.row)"
                  >{{scope.row.functionId}}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                v-else-if="item.label === 'SQL'"
                :prop="item.name"
                :label="item.label"
                :key="item.classId"
              >
                <template slot-scope="scope">
                  <el-button
                    :disabled="!scope.row.executionSQL"
                    @click="clickToAuditFuncsDetails(scope.row)"
                  >{{scope.row.executionSQL ? scope.row.executionSQL :'无'}}</el-button>
                </template>
              </el-table-column>
              <el-table-column v-else :prop="item.name" :label="item.label" :key="item.classId"></el-table-column>
            </template>
          </el-table>
          <!-- <el-table :columns="modalData.titleData" :data="modalData.data"></el-table> -->
          <div style="text-align: center;margin-top: 15px;">
            <el-pagination
              @size-change="handleModalDataSizeChange"
              @current-change="handleModalDataCurrentChange"
              :current-page="modalData.page.pageCurrent"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="modalData.page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="modalData.page.totalCount"
            ></el-pagination>
          </div>
        </div>
        <div slot="footer"></div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { get } from "@/utils/request";
export default {
  name: "globalSearch",
  data() {
    return {
      dialogFormVisible: false,
      tableDialog: false,
      activeName: "first",
      firstSearchList: {
        type: null,
        code: null,
        name: null
      },
      secondSearchList: {
        type: null,
        code: null,
        name: null
      },
      thirdSearchList: {
        type: null,
        name: null
      },
      list: [
        {
          type: 1,
          name: "first",
          title: "元数据",
          records: {},
          searchList: [],
          total: 0,
          class: "tab-first-icon"
        },
        {
          type: 2,
          name: "second",
          title: "数据标准",
          records: {},
          searchList: [],
          total: 0,
          class: "tab-second-icon"
        },
        {
          type: 3,
          name: "third",
          title: "业务规则",
          records: {},
          searchList: [],
          total: 0,
          class: "tab-third-icon"
        },
        {
          type: 4,
          title: "知识文档",
          name: "fouth",
          records: {},
          total: 0,
          class: "tab-fouth-icon"
        }
      ],
      pageCurrent: 1,
      pageSize: 10,
      total: 0,
      keyword: "",
      type: "",
      formItem: {
        demand: "", // 数据质量需求

        dimension: "", // 质量维度

        effectDesc: "", // 影响描述

        infoItem: "", // 信息项

        qualityDesc: "", // 数据质量描述

        ruleName: "" // 规则名称
      },
      modalData: {
        title: "",
        page: {
          //  分页大小
          pageSize: 10,
          //  当前页
          pageCurrent: 1,
          //  总数
          totalCount: 0
        },
        titleData: [],
        data: []
      },
      auditID: "",
      // 跳转常量
      toDetailsConst: {
        toBizTerm: "BizTermInfoItem", // 业务术语
        toMasterData: "MasterDataInfoItem", // 主数据
        /* 指标管理*/
        toBaseIndex: "BaseIndexInfoItem", // 基础指标
        toCalculateIndex: "CalculateIndexInfoItem", // 计算指标
        toDeriveIndex: "DeriveIndexInfoItem", // 衍生指标
        toRuleIndex: "RuleIndexInfoItem", // 规则指标

        toDimensionality: "DimentsionInfoItem", // 维度管理
        toPublicCode: "PublicCodeInfoItem", // 公共代码
        toRulePage: "RuleInfoItem", // 规则管理

        toRule: "Parent_Rule", // 规则管理
        torule: "Parent_RuleIndex" // 规则管理
      }
    };
  },
  methods: {
    // 搜索按钮
    onSubmit(type) {
      this.getNewData(type);
    },
    handeSelectChange(val) {
      console.log(val)
      this.firstSearchList.type = val;
      this.getNewData(1)
    },
    handeSelectChange2(val) {
      console.log(val)
      this.secondSearchList.type = val;
      this.getNewData(2)
    },
    handeSelectChange3(val) {
      console.log(val)
      this.thirdSearchList.type = val;
      this.getNewData(3)
    },
    handleModalDataSizeChange(val) {
      this.modalData.page.pageSize = val;
      if (this.modalData.title === "关联标准列表") {
        this.getContactStandard();
      } else {
        this.getAuditingMethod();
      }
    },
    handleModalDataCurrentChange(val) {
      this.modalData.page.pageCurrent = val;
      if (this.modalData.title === "关联标准列表") {
        this.getContactStandard();
      } else {
        this.getAuditingMethod();
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.globalSearch();
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      let type = null;
      type = this.activeName === 'first' ? 1 : this.activeName === 'second' ? 2 : this.activeName === 'third' ? 3 : this.activeName === 'fouth' ? 4 : null
      this.getNewData(type);
    },
    handleClick(tab, event) {
      this.pageSize = 10;
      this.pageCurrent = 1;
      let type = this.activeName === 'first' ? 1 : this.activeName === 'second' ? 2 : this.activeName === 'third' ? 3 : this.activeName === 'fouth' ? 4 : null
      this.getNewData(type);
      // console.log(tab, event)
    },
    // setItem(index) {
    //   this.$refs.carousel.setActiveItem(index);
    // },
    getNewData(type) {
      let params = null;
      if (type === 1) {
        params = {
          type: type,
          classifier: this.firstSearchList.type,
          keyword: this.keyword,
          pageCurrent: this.pageCurrent,
          pageSize: this.pageSize,
          code: this.firstSearchList.code,
          name: this.firstSearchList.name
        }
      } else if (type === 2) {
        params = {
          type: type,
          classifier: this.secondSearchList.type,
          keyword: this.keyword,
          pageCurrent: this.pageCurrent,
          pageSize: this.pageSize,
          code: this.secondSearchList.code,
          name: this.secondSearchList.name
        }
      } else if (type === 3) {
        params = {
          type: type,
          classifier: this.thirdSearchList.type,
          keyword: this.keyword,
          pageCurrent: this.pageCurrent,
          pageSize: this.pageSize,
          name: this.thirdSearchList.name
        }
      }
      get('/home/portal/globalSearch', params).then(res => {
        this.list.map(item => {
          if (item.type === type) {
            switch (item.type) {
              case 1:
                item.records = res.data.metadataVOS;
                item.total = res.data.metadataVOS.total;
                return item;
              case 2:
                item.records = res.data.dataStandardVOs;
                item.total = res.data.dataStandardVOs.total;
                return item;
              case 3:
                item.records = res.data.checkRuleItemVOs;
                item.total = res.data.checkRuleItemVOs.total;
                return item;
              default:
                if (res.data.length > 0) {
                  item.records = res.data.checkRuleItemVOs;
                  item.total = res.data.checkRuleItemVOs.total;
                } else {
                  item.records = {};
                  item.total = 0;
                }
                return item;
            }
          }
        })
      })
    },
    globalSearch() {
      this.firstSearchList = {
        type: null,
        code: null,
        name: null
      }
      this.secondSearchList = {
        type: null,
        code: null,
        name: null
      }
      this.thirdSearchList = {
        type: null,
        name: null
      }
      this.list.map(item => {
        get("/home/portal/globalSearch", {
          keyword: this.keyword,
          pageCurrent: this.pageCurrent,
          pageSize: this.pageSize,
          type: item.type // 查询对象类别，1：元数据，2：数据标准，3：业务规则，4：知识文档
        }).then(res => {
          switch (item.type) {
            case 1:
              item.records = res.data.metadataVOS;
              item.total = res.data.metadataVOS.total;
              return item;
            case 2:
              item.records = res.data.dataStandardVOs;
              item.total = res.data.dataStandardVOs.total;
              return item;
            case 3:
              item.records = res.data.checkRuleItemVOs;
              item.total = res.data.checkRuleItemVOs.total;
              return item;
            default:
              if (res.data.length > 0) {
                item.records = res.data.checkRuleItemVOs;
                item.total = res.data.checkRuleItemVOs.total;
              } else {
                item.records = {};
                item.total = 0;
              }
              return item;
          }
          // item.records = res.data
          // item.total = res.data.total
          // return item
        });
      });
    },
    // 获取下拉框内容
    getSelectList() {
      // 元数据
      this.list.map(val => {
        let url
        if (val.title === '元数据') {
          url = '/mm/listMetaModelExistMetadataForSelect'
        } else if (val.title === '数据标准') {
          url = '/ds/selectClassifierExistMetadata'
        } else if (val.title === '业务规则') {
          url = '/sys/dict/listByCode?keyword=BASISCLASS'
        }
        if (val.title !== '知识文档') {
          get(url).then(res => {
            if (res.code === 10000) {
              val.searchList = res.data
            }
          })
        }
      })
    },
    //  关联标准
    contactStandard(item) {
      this.tableDialog = true;
      this.auditID = item.ruleId;
      this.modalData = {
        title: "关联标准列表",
        page: {
          //  分页大小
          pageSize: 10,
          //  当前页
          pageCurrent: 1,
          //  总数
          totalCount: 0
        },
        titleData: [],
        data: []
      };
      this.getContactStandard(item.ruleId);
    },
    //  获取关联标准列表
    getContactStandard(id) {
      get("/dqms/checkrule/listRelStandardInfos", {
        pageCurrent: this.modalData.page.pageCurrent,
        pageSize: this.modalData.page.pageSize,
        ruleId: this.auditID
      }).then(res => {
        this.modalData.page.totalCount = 0;
        this.modalData.titleData = [
          {
            name: "standardId",
            label: "标准编号"
          },
          {
            name: "standardName",
            label: "标准名称"
          },
          {
            name: "context",
            label: "路径"
          }
        ];
        if (res.data) {
          this.modalData.data = res.data.records;
          this.modalData.page.totalCount = res.data.total;
        }
      });
    },
    // 是否关联稽核列表
    auditingMethod(item) {
      this.tableDialog = true;
      this.auditID = item.ruleId;
      this.modalData = {
        title: "关联稽核方法列表",
        page: {
          //  分页大小
          pageSize: 10,
          //  当前页
          pageCurrent: 1,
          //  总数
          totalCount: 0
        },
        titleData: [],
        data: []
      };
      this.getAuditingMethod(item.ruleId);
    },
    // 获取稽核列表
    getAuditingMethod(id) {
      get("/dqms/checkrule/listRelFunctionInfos", {
        pageCurrent: this.modalData.page.pageCurrent,
        pageSize: this.modalData.page.pageSize,
        ruleId: this.auditID
      }).then(res => {
        this.modalData.page.totalCount = 0;
        this.modalData.titleData = [
          {
            name: "functionId",
            label: "稽核方法编号"
          },
          {
            name: "functionName",
            label: "稽核方法名称"
          },
          {
            name: "functionDesc",
            label: "稽核方法描述"
          },
          {
            name: "belongSystem",
            label: "系统名"
          },
          {
            name: "tableName",
            label: "表名"
          },
          {
            name: "executionSQL",
            label: "SQL"
          }
        ];
        this.modalData.data = res.data.records;
        this.modalData.page.totalCount = res.data.total;
      });
    },
    // 稽核规则弹窗信息
    getRulesForm(item) {
      get("/dqms/checkrule/getCheckDetailInfo", {
        ruleId: item.ruleId
      }).then(res => {
        this.formItem = res.data;
        this.dialogFormVisible = true;
      });
    },
    // 跳转稽核详情页
    clickToAuditFuncsDetails(row) {
      this.$router.push({
        name: "auditingFuncsDetail",
        params: { id: row.id }
      });
    },
    // 跳转到元数据详情信息页面
    clickToMetaDataDetails(row) {
      this.$router.push({
        name: "impactAndLineageDetail",
        params: {
          id: row.id,
          _title: row.name,
          classifierId: row.classifierId // 元数据类型ID
        }
      });
    },
    // 跳到标准查询页面
    handleToSdDetails(row) {
      console.log(row);
      if (row.classifierId === this.toDetailsConst.toBizTerm) { // 业务术语
        // 跳转到 业务术语详情
        this.$router.push({
          name: "professionalDetail",
          params: {
            id: row.id,
            _title: row.name,
            name: row.name
          }
        });
      } else if (row.classifierId === this.toDetailsConst.toMasterData) { // 主数据
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
      } else if (row.classifierId === this.toDetailsConst.toPublicCode) { // 公共代码
        // 跳转到 公共代码详情
        this.$router.push({
          name: "commonCode",
          params: {
            id: row.id,
            classifierId: row.classifierId,
            _title: row.name,
            headerTitle: row.name
          }
        });
      } else if (row.classifierId === this.toDetailsConst.toRulePage) { // 规则管理
        // 跳转到 规则管理详情
        this.$router.push({
          name: "ruleDetail",
          params: {
            id: row.id,
            _title: row.name,
            row: row
          }
        });
      } else if (row.classifierId === this.toDetailsConst.toDimensionality) { // 维度管理
        // 跳转到 维度管理详情
        this.$router.push({
          name: "dimensionDetails",
          params: {
            id: row.name,
            detailId: row.id,
            _title: row.name
          }
        });
      } else if (row.classifierId === this.toDetailsConst.toBaseIndex ||
        row.classifierId === this.toDetailsConst.toCalculateIndex ||
        row.classifierId === this.toDetailsConst.toDeriveIndex ||
        row.classifierId === this.toDetailsConst.toRuleIndex) { // 指标管理
        // 跳转到 指标管理详情
        this.$router.push({
          name: "indexManagementDetails",
          params: {
            id: row.id,
            classifierId: row.classifierId,
            _title: row.name,
            headerTitle: row.name
          }
        });
      } /* else if (
        row.classifierId === this.toDetailsConst.toRule ||
        row.classifierId === this.toDetailsConst.torule
      ) {
        // 规则
        row.instanceId = row.id;
        row.instanceName = row.name;
        this.$router.push({
          name: "ruleDetail",
          params: {
            id: row.id,
            classifierId: row.classifierId,
            _title: row.name,
            headerTitle: row.name,
            row: row
          }
        });
      }*/
    }
  },
  computed: {
    words() {
      return this.$store.getters.globalSearch;
    }
  },
  watch: {
    words(val, oldVal) {
      this.keyword = val;
      this.globalSearch();
    }
  },
  created() {
    this.keyword = this.$store.getters.globalSearch;
    this.globalSearch();
    this.getSelectList();
  }
};
</script>

<style lang="scss" scoped>
.globalHole {
  .globalHole-container{
    height: calc(100vh - 115px);
    .el-aside{
      margin-right:10px;
      height: 100%;
      .el-card{
        height: 100%;
        /deep/ .el-card__body{
          padding: 25px 10px!important;
          position: relative;
          height: 100%;
        }
      }
      .tab-change{
        /deep/ .el-tabs__nav-wrap::after{
          background-color:unset;
        }
        /deep/ .el-tabs__nav{
          #tab-first,#tab-second,#tab-third,#tab-fouth{
            height:42px;
            text-align: left;
          }
        }
        .tab-first-icon {
          background: url("../../../src/assets/images/commonIcon/tab_metaData.png")
            no-repeat;
          background-size: 100% 100%;
        }
        .tab-second-icon {
          background: url("../../../src/assets/images/commonIcon/tab_img2.png")
            no-repeat;
          background-size: 100% 100%;
        }
        .tab-third-icon {
          background: url("../../../src/assets/images/commonIcon/tab_img3.png")
            no-repeat;
          background-size: 100% 100%;
        }
        .tab-fouth-icon {
          background: url("../../../src/assets/images/commonIcon/tab_img4.png")
            no-repeat;
          background-size: 100% 100%;
        }
        /deep/ .global-slot {
        i {
          width: 14px;
          height: 14px;
          margin-right: 8px;
          display: inline-block;
          position: relative;
          top: 2px;
        }
      }
      }
    }
    .el-main{
      padding:0;
      height:100%;
      /deep/ .el-card__body::-webkit-scrollbar{
        width:5px;
        height:10px;
      }
      /deep/ .el-card__body::-webkit-scrollbar-track{
        background: none;
        border-radius:2px;
      }
      /deep/ .el-card__body::-webkit-scrollbar-thumb{
        background: rgb(239, 239, 239);
        border-radius:10px;
      }
      /deep/ .el-card__body::-webkit-scrollbar-thumb:hover{
        background:#bfbfbf;
      }
      .el-card{
        height: 100%;
        padding:5px 8px;
        /deep/ .el-card__body{
          padding: 30px 30px!important;
          position: relative;
          height: 100%;
          overflow-y: auto;
          .search-box{
            padding:0 15px;
            color:#333;
            font-size: 17px;
            .form-box{
              margin-top:20px;
              label{
                font-weight: inherit;
                font-size:13px; 
              }
            }
          }
          .el-tabs__header{
            display: none;
          }
           /deep/ .global-ul-style {
             border-top: 1px solid #dcdee2;
             margin-top:10px;
            ul {
              // padding: 20px 10px;
              margin:0;
              padding: 0;
            }
            li {
              position: relative;
              padding: 20px 10px;
              border-bottom: 1px solid #dcdee2;
              vertical-align: middle;
              padding-left: 80px;
              list-style-type: none;
              cursor: pointer;
              .title {
                line-height: 30px;
                font-size: 14px;
              }
              .text {
                line-height: 24px;
                font-size: 12px;
                .text-item {
                  margin: 0 10px;
                  font-size: 12px;
                }
              }
            }
            .img {
              width: 54px;
              height: 54px;
              position: absolute;
              left: 10px;
              // left: 0;
              // top: -15px;
              width: 54px;
              height: 54px;
              line-height: 54px;
              text-align: center;
              border-radius: 50%;
              color: #fff;
              font-size: 14px;
              background: #2b85e4;
            }
            .biao {
              background: #8bc992;
              font-size: 26px;
            }
            .ye {
              background: #26346a;
              font-size: 26px;
            }
          }
        }
      }
    }
  }
  .blue-color {
    color: #2b85e4;
    cursor: pointer;
  }
  padding: 10px;
  /deep/ .el-tag {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    margin: 2px 4px 2px 0;
    padding: 0 8px;
    border-radius: 3px;
    font-size: 12px;
    vertical-align: middle;
    opacity: 1;
    overflow: hidden;
    cursor: pointer;
    margin-left: 10px;
    line-height: 20px;
  }
  // .global-content /deep/ {
  //   background: #fff;
  //   .el-card__body {
  //     padding-top: 0;
  //   }
  //   .el-card__header {
  //     padding: 10px 20px 0;
  //     border-bottom: unset;
  //   }
  //   .el-tabs__header {
  //     margin: 0;
  //     padding-right: 40%;
  //     border-bottom: 1px solid #ccc;
  //   }
  //   .text-ellipsis {
  //     overflow: hidden;
  //     white-space: nowrap;
  //     text-overflow: ellipsis;
  //   }
  // }
  // .right-tags {
    // display: inline-block;
    // height: 22px;
    // line-height: 22px;
    // margin: 2px 4px 2px 0;
    // padding: 0 8px;
    // border: 1px solid #e8eaec;
    // border-radius: 3px;
    // background: #f7f7f7;
    // font-size: 12px;
    // vertical-align: middle;
    // opacity: 1;
    // overflow: hidden;
    // cursor: pointer;
  // }
}
.el-select-dropdown__item{
  padding:0 10px;
  font-size: 13px;
  height: 25px;
  line-height: 25px;
}
</style>
