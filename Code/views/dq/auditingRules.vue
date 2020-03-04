<template>
  <div class="auditingRules dashboard-editor-container">
    <el-card shadow="hover" class="card-container" style="margin-bottom: 10px; font-size: 14px">
      <el-row>
        <el-col :span="4" class="information">
          <span class="instrumentPanel">
            <span class="instrumentPanelSpan">
              <img src="./../../assets/images/appropriateness.png" alt="">
            </span>
            <span class="instrumentPanelText" @click="toClickLists('5')">
              <span class="instrumentPanelTextSpan1">适当性</span>
              <span class="instrumentPanelTextSpan2">{{dimensionValue1}}</span>
            </span>
          </span>
        </el-col>
        <el-col :span="4" class="information">
          <span class="instrumentPanel">
            <span class="instrumentPanelSpan">
              <img src="./../../assets/images/timeliness.png" alt="">
            </span>
            <span class="instrumentPanelText" @click="toClickLists('4')">
              <span class="instrumentPanelTextSpan1">时效性</span>
              <span class="instrumentPanelTextSpan2">{{dimensionValue2}}</span>
            </span>
          </span>
        </el-col>
        <el-col :span="4" class="information">
          <span class="instrumentPanel">
            <span class="instrumentPanelSpan">
              <img src="./../../assets/images/accuracy.png" alt="">
            </span>
            <span class="instrumentPanelText" @click="toClickLists('2')">
              <span class="instrumentPanelTextSpan1">正确性</span>
              <span class="instrumentPanelTextSpan2">{{dimensionValue3}}</span>
            </span>
          </span>
        </el-col>
        <el-col :span="4" class="information">
          <span class="instrumentPanel">
            <span class="instrumentPanelSpan">
              <img src="./../../assets/images/uniformity.png" alt="">
            </span>
            <span class="instrumentPanelText" @click="toClickLists('3')">
              <span class="instrumentPanelTextSpan1">一致性</span>
              <span class="instrumentPanelTextSpan2">{{dimensionValue4}}</span>
            </span>
          </span>
        </el-col>
        <el-col :span="4" class="information">
          <span class="instrumentPanel">
            <span class="instrumentPanelSpan">
              <img src="./../../assets/images/completeness.png" alt="">
            </span>
            <span class="instrumentPanelText" @click="toClickLists('1')">
              <span class="instrumentPanelTextSpan1">完整性</span>
              <span class="instrumentPanelTextSpan2">{{dimensionValue5}}</span>
            </span>
          </span>
        </el-col>
        <el-col :span="4" class="information">
          <span class="instrumentPanel">
            <span class="instrumentPanelSpan">
              <img src="./../../assets/images/only.png" alt="">
            </span>
            <span class="instrumentPanelText" @click="toClickLists('6')">
              <span class="instrumentPanelTextSpan1">唯一性</span>
              <span class="instrumentPanelTextSpan2">{{dimensionValue6}}</span>
            </span>
          </span>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="hover" class="card-container">
      <el-row>
        <el-col :span="14">
          <el-radio-group size="small" v-model="dimension" @change="clickGroupRadio">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button :label="5">适当性</el-radio-button>
            <el-radio-button :label="4">时效性</el-radio-button>
            <el-radio-button :label="2">正确性</el-radio-button>
            <el-radio-button :label="3">一致性</el-radio-button>
            <el-radio-button :label="1">完整性</el-radio-button>
            <el-radio-button :label="6">唯一性</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="10">
          <div style="float: right; min-width:281px;">
            <el-input size="small" style="width: 220px" v-model="keyword" placeholder="请输入规则名称/规则描述"></el-input>
            <el-button type="primary" size="small" @click="toSearch">搜索</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="divider"></div>
      <el-card class="card-table">
        <el-table
            :data="tableData"
            style="width: 100%">
          <el-table-column
              prop="ruleId"
              label="规则编号"
              width="160">
          </el-table-column>
          <el-table-column
              label="规则名称"
              width="160">
            <template slot-scope="scope"><a class="a-color" @click="rulesNameClick(scope.row)"> {{scope.row.ruleName}} </a> </template>
          </el-table-column>
          <el-table-column
              prop="ruledesc"
              label="规则描述"
              width="160">
          </el-table-column>
          <el-table-column
              prop="dimension"
              label="质量维度"
              width="180">
          </el-table-column>
          <el-table-column
              prop="checkDateItem"
              label="检核数据项"
              width="160">
          </el-table-column>
          <el-table-column
              label="关联标准"
              width="160">
            <template slot-scope="scope"><a class="a-color" @click="standardClick(scope.row)"> {{scope.row.isRelStandard === 0 ? '否' : '是'}} </a> </template>
          </el-table-column>
          <el-table-column
              label="是否关联稽核方法">
            <template slot-scope="scope"><a class="a-color" @click="auditMethodsClick(scope.row)"> {{scope.row.isRelFun !== 1 ? '否' : '是'}} </a> </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div style="text-align: center; padding: 10px 0">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="oPage.pageCurrent"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="oPage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="oPage.total">
        </el-pagination>
      </div>
    </el-card>

   <!--规则名称详情-->
    <el-dialog title="详情" :visible.sync="rulesNameVisible" class="modalNoCardTable">
      <el-form ref="form" :model="form" label-width="100px" style="font-size: 12px; color: #515a6e;">
        <el-form-item label="规则名称:">
          <el-input v-model="form.ruleName" size="small" placeholder="这里是规则名称内容" readonly></el-input>
        </el-form-item>
        <el-form-item label="信息项:">
          <el-input v-model="form.infoItem" size="small" placeholder="这里是信息项内容" readonly></el-input>
        </el-form-item>
        <el-form-item label="质量维度:">
          <el-input v-model="form.dimension" size="small" placeholder="这里是质量维度内容" readonly></el-input>
        </el-form-item>
        <el-form-item label="数据质量需求:">
          <el-input type="textarea" :rows="4" v-model="form.demand" size="small" placeholder="这里是数据质量需求内容" readonly></el-input>
        </el-form-item>
        <el-form-item label="数据质量描述:" size="small">
          <el-input type="textarea" :rows="4" v-model="form.qualityDesc" placeholder="这里是数据质量描述内容" readonly></el-input>
        </el-form-item>
        <el-form-item label="影响描述:" size="small">
          <el-input type="textarea" :rows="4" v-model="form.effectDesc" placeholder="这里是影响描述内容" readonly></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>

   <!--关联标准列表-->
    <el-dialog title="关联标准列表" :visible.sync="standardModalVisible" class="modalNoCardTable">
      <el-card class="card-table">
        <el-table
            v-loading="standardModalLoading"
            :data="standardTableData"
            style="width: 100%">
          <el-table-column
              prop="standardCode"
              label="标准编号"
              width="160">
          </el-table-column>
          <el-table-column
              prop="ruleId"
              label="规则编号"
              width="160">
          </el-table-column>
          <el-table-column
              prop="context"
              label="路径">
          </el-table-column>
        </el-table>
      </el-card>
      <div style="text-align: center; padding: 10px 0">
        <el-pagination
            v-if="oStandard.total > 0"
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="oStandard.pageCurrent"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="oStandard.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="oStandard.total">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>

   <!--关联稽核方法列表-->
    <el-dialog title="关联稽核方法列表" :visible.sync="auditMethodsModalVisible" class="modalNoCardTable">
      <el-card class="card-table">
        <el-table
            :data="auditMethodsTableData"
            style="width: 100%">
          <el-table-column
              label="稽核方法编号"
              width="120">
            <template slot-scope="scope"><a class="a-color" @click="auditingFuncsDetailClick(scope.row)"> {{scope.row.functionId}} </a></template>
          </el-table-column>
          <el-table-column
              prop="functionName"
              label="稽核方法名称"
              width="140">
          </el-table-column>
          <el-table-column
              prop="functionDesc"
              label="稽核方法描述"
              width="140">
          </el-table-column>
          <el-table-column
              prop="belongSystem"
              label="系统名"
              width="140">
          </el-table-column>
          <el-table-column
              prop="tableName"
              label="表名"
              width="140">
          </el-table-column>
          <el-table-column
            label="SQL"
            align="center">
            <template slot-scope="scope">
              <el-button size="small" disabled>无</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div style="text-align: center; padding: 10px 0">
        <el-pagination
            @size-change="handleSizeChange3"
            @current-change="handleCurrentChange3"
            :current-page="oAuditMethods.pageCurrent"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="oAuditMethods.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="oAuditMethods.total">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { get, parseAjaxResponse } from '../../../src/utils/request'

  export default {
    name: 'auditingRules',
    data() {
      return {
        tableData: [
          { id: 1, ruleId: '1234', ruleName: '产品主数据', ruledesc: '产品数量不能为空', dimension: '完整性', checkDateItem: '证件号码', isRelStandard: 0, isRelFun: 0 }, { id: 2, ruleId: '12345', ruleName: '产品主数据2', ruledesc: '产品数量不能为空2', dimension: '完整性', checkDateItem: '证件号码', isRelStandard: 1, isRelFun: 1 }
        ],
        rulesNameVisible: false,
        standardModalVisible: false,
        auditMethodsModalVisible: false,
        form: {
          ruleName: '',
          infoItem: '',
          dimension: '',
          demand: '',
          qualityDesc: '',
          effectDesc: ''
        },
        standardTableData: [],
        standardModalLoading: false,
        auditMethodsTableData: [
          // { id: 11, auditCode: '102000182', auditName: '元模型相关类的描述信息检查', auditDes: '元模型相关类的描述信息不能为空', sysName: 'dmac元数据平台', tableName: '类表' },
          // { id: 22, auditCode: '1020001444', auditName: '元模型相关类的描述信息检查2', auditDes: '元模型相关类的描述信息不能为空', sysName: 'dmac元数据平台', tableName: '类表' }
        ],
        oPage: {
          pageCurrent: 1,
          pageSize: 10,
          total: 0
        },
        oStandard: {
          pageCurrent: 1,
          pageSize: 10,
          total: 0
        },
        oAuditMethods: {
          pageCurrent: 1,
          pageSize: 10,
          total: 0
        },

        ruleId: '', // 规则编号
        dimension: '', // 维度：适当性、时效性等
        keyword: '', // 搜索关键字
        dimensionValue1: '',
        dimensionValue2: '',
        dimensionValue3: '',
        dimensionValue4: '',
        dimensionValue5: '',
        dimensionValue6: ''
      }
    },
    methods: {
      // 获取稽核规则统计信息
      getAuditRuleTotalInfos() {
        get('/dqms/checkrule/getTotalInfos').then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              console.log(res)
              res.data.forEach((item, index) => {
                if (item.typeCode === '1') {
                  this.dimensionValue5 = item.count
                } else if (item.typeCode === '2') {
                  this.dimensionValue3 = item.count
                } else if (item.typeCode === '3') {
                  this.dimensionValue4 = item.count
                } else if (item.typeCode === '4') {
                  this.dimensionValue2 = item.count
                } else if (item.typeCode === '5') {
                  this.dimensionValue1 = item.count
                } else if (item.typeCode === '6') {
                  this.dimensionValue6 = item.count
                }
              })
            }
          })
        })
      },
      // 分页获取稽核规则列表信息 /dqms/checkrule/listCheckRuleInfos
      getListCheckRuleInfos() {
        get('/dqms/checkrule/listCheckRuleInfos', {
          dimension: this.dimension, // 维度()
          keyword: this.keyword, // 搜索关键字
          pageCurrent: this.oPage.pageCurrent, // 页码
          pageSize: this.oPage.pageSize // 查询分页量
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.oPage.pageCurrent = res.data.current
              this.oPage.total = res.data.total
              this.tableData = res.data.records
            }
          })
        })
      },
      // 根据规则编号获取规则详情 /dqms/checkrule/getCheckDetailInfo
      getAuditRuleCheckDetailInfo() {
        get('/dqms/checkrule/getCheckDetailInfo', {
          ruleId: this.ruleId // 规则编号
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.form = res.data
            }
          })
        })
      },
      // 根据规则编号获取关联标准列表 /dqms/checkrule/listRelStandardInfos  todo 无数据
      getListRelStandardInfos() {
        this.standardModalLoading = true
        get('/dqms/checkrule/listRelStandardInfos', {
          ruleId: this.ruleId, // 规则编号
          pageCurrent: this.oStandard.pageCurrent, // 页码
          pageSize: this.oStandard.pageSize // 查询分页量
        }).then((res) => {
          parseAjaxResponse(res, () => {
            console.log(res)
            this.standardModalLoading = false
            if (res.code === 10000 && res.success === true) {
              if (res.data) {
                this.oStandard.pageCurrent = res.data.current
                this.oStandard.total = res.data.total
                this.standardTableData = res.data.records
                // 规则编号
                this.standardTableData.forEach((res) => {
                  res.ruleId = this.ruleId
                })
              } else {
                this.standardTableData = []
                this.oStandard.total = 0
              }
            }
          })
        })
      },
      // 根据规则编号获取关联检核方法列表 /dqms/checkrule/listRelFunctionInfos
      getListRelFunctionInfos() {
        get('/dqms/checkrule/listRelFunctionInfos', {
          ruleId: this.ruleId, // 规则编号
          pageCurrent: this.oAuditMethods.pageCurrent, // 页码
          pageSize: this.oAuditMethods.pageSize // 查询分页量
        }).then((res) => {
          parseAjaxResponse(res, () => {
            if (res.code === 10000) {
              this.oAuditMethods.pageCurrent = res.data.current
              this.oAuditMethods.total = res.data.total
              this.auditMethodsTableData = res.data.records
            }
          })
        })
      },
      clickGroupRadio(val) {
        console.log(val)
        this.dimension = val // todo 值的对应关系
        this.getListCheckRuleInfos()
      },
      toClickLists(val) {
        this.dimension = val
        this.getListCheckRuleInfos()
      },
      rulesNameClick(row) {
        this.rulesNameVisible = true
        this.ruleId = row.ruleId
        this.getAuditRuleCheckDetailInfo()
      },
      standardClick(row) {
        this.standardModalVisible = true
        this.ruleId = row.ruleId
        this.getListRelStandardInfos()
      },
      auditMethodsClick(row) {
        this.auditMethodsModalVisible = true
        this.ruleId = row.ruleId
        this.getListRelFunctionInfos()
      },
      // 跳转到 -> 稽核方法详情-检核表
      auditingFuncsDetailClick(row) {
        this.$router.push({
          name: 'auditingFuncsDetail',
          params: {
            id: row.classId,
            classId: row.classId,
            functionId: row.functionId,
            tableType: row.tableType
          }
        })
      },
      // 搜索
      toSearch() {
        this.handleCurrentChange(1)
      },
      handleSizeChange(val) {
        this.oPage.pageSize = val
        this.getListCheckRuleInfos()
      },
      handleCurrentChange(val) {
        this.oPage.pageCurrent = val
        this.getListCheckRuleInfos()
      },
      handleSizeChange2(val) {
        this.oStandard.pageSize = val
        this.getListRelStandardInfos()
      },
      handleCurrentChange2(val) {
        this.oStandard.pageCurrent = val
        this.getListRelStandardInfos()
      },

      handleSizeChange3(val) {
        this.oAuditMethods.pageSize = val
        this.getListRelFunctionInfos()
      },
      handleCurrentChange3(val) {
        this.oAuditMethods.pageCurrent = val
        this.getListRelFunctionInfos()
      }
    },
    created() {
      this.getAuditRuleTotalInfos()
      this.getListCheckRuleInfos()
    },
    mounted() {

    }
  }
</script>


<style lang="scss" scoped>
  //外层card容器样式
  @import './../../styles/dq/main-card-table.scss';

  .information {
    height: 100%;
    width: 15.66%;
    margin-left: 0.5%;
    margin-right: 0.5%;
    padding: 10px;
    border: 1px solid #e9e9e9;
  }
  .instrumentPanel {
    width: 100%;
    display: flex;
    text-align: center;
    .instrumentPanelSpan {
      width: 50%;
      padding: 2%;
      display: inline-block;
    }
  }
  .instrumentPanelSpan>img {
    width: 64px;
    height: 64px;
  }
  .instrumentPanelText {
    width: 50%;
    padding: 2%;
    display: inline-block;
    cursor: pointer;
    .instrumentPanelTextSpan1 {
      color: #d0d0d0;
      display: block;
      padding-top: 15%;
      text-align: center;
    }
    .instrumentPanelTextSpan2 {
      font-weight: 500;
      display: block;
      padding-top: 5%;
      text-align: center;
    }
  }

  // a标签颜色
  .a-color{
    color: #2d8cf0;
  }

  //分隔线
  .divider {
    margin: 10px 0;
    border-bottom: 1px solid #e8ebed;
  }

  //对话框上、下分隔线
  .auditingRules /deep/ .el-dialog__wrapper {
    .el-dialog {
      .el-dialog__header {
        border-bottom: 1px solid #e8ebed;
      }
    }
  }
  .auditingRules /deep/ .el-dialog__wrapper {
    .el-dialog {
      .el-dialog__footer {
        border-top: 1px solid #e8ebed;
      }
    }
  }

  .auditingRules /deep/ .el-dialog__wrapper
    .el-dialog {
    //对话框body的padding
      .el-dialog__body{
        padding: 16px;
      }
    //对话框header字体大小
    .el-dialog__header{
      .el-dialog__title{
        font-size: 14px;
        color: #17233d;
        font-weight: 700;
      }
    }
  }
  //对话框body字体大小和颜色
  .auditingRules .el-form-item /deep/ .el-form-item__label {
    font-size: 12px;
    color: #515a6e;
    font-weight: normal;
  }


  .modalNoCardTable /deep/ .el-dialog{
    width: 800px;
    .el-dialog__body{
      .el-card__body{
        padding: 0;
      }
    }
  }
  .auditingRules {
    .el-radio-button--small .el-radio-button__inner {
      padding: 11px 10px;
      font-size: 10px;
    }
  }

</style>
