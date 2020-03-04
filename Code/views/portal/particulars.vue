<template>
    <div class="container">
        <el-card shadow='hover' class="essential-information">
          <div class="card-title">
            <p>基本信息</p>
          </div>
          <div class="card-body">
            <el-form :model="ruleForm"  ref="ruleForm" label-width="110px" disabled>
              <el-form-item label="工单名称：">
                <el-input v-model="ruleForm.orderName" placeholder="请输入工单名称..." ></el-input>
              </el-form-item>
              <el-form-item label="问题描述："  >
                <el-input type="textarea" v-model="ruleForm.problemDescription" placeholder="请输入问题描述..." class="description"></el-input>
              </el-form-item>
              <el-form-item label="影响范围：" >
                <el-input type="textarea" v-model="ruleForm.scopeInfluence" placeholder="请输入影响范围..." class="influence"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="7">
                  <el-form-item label="问题来源：" >
                    <el-select v-model="ruleForm.problemSources" placeholder="请选择活动区域">
                      <el-option label="请选择" value=""></el-option>
                      <!-- <el-option label="区域二" value="beijing"></el-option> -->
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="问题等级：" prop="problemLevel">
                    <el-select v-model="ruleForm.problemLevel" placeholder="请选择活动区域">
                      <el-option label="请选择" value=""></el-option>
                      <!-- <el-option label="区域二" value="beijing"></el-option> -->
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="期望解决日期：">
                    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.expectDate" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="问题发起人：" >
                <el-button  size="mini" v-for="item in ruleForm.problemInitiator" :key="item.sysCode">{{item.sysName}}</el-button>
              </el-form-item>
              <el-form-item label="涉及系统：">
                <el-button  size="mini" v-for="item in ruleForm.involvedSystem" :key="item.sysCode">{{item.sysName}}</el-button>

              </el-form-item>
              <el-form-item label="涉及表：">
                <el-button  size="mini" v-for="item in ruleForm.inTable" :key="item.instanceId">{{item.instanceName}}</el-button>

              </el-form-item>
              <el-form-item label="问题受理人：" prop="problemReceiver">
                <el-button  size="mini" >{{ruleForm.problemReceiver.username}}</el-button>

              </el-form-item>
              <el-form-item label="附加信息：">
                  <a :href="api+'/kno/doc/downloadAttachFile.do?attachId='+ruleForm.accessory.attachId+'&token='+ token" v-if="ruleForm.accessory"  style="color: #2d8cf0;">{{ruleForm.accessory.attachName}}</a>
              </el-form-item>
            </el-form>

          </div>
        </el-card>
        <el-card shadow='hover' class="accept-information" v-if="porpsData.type!=='back'&&porpsData.type!=='detail'&&porpsData.type!=='check'">
          <div class="card-title">
            <p>受理信息</p>
          </div>
          <div class="card-body">
            <el-form :model="ruleForm"  ref="ruleForm" label-width="110px" disabled>
                <el-form-item label="问题主办人：" >
                    <el-tag type="info" size="mini">{{checkData.mainUser}}</el-tag>
                </el-form-item>
                <el-row>
                <el-col :span="7">
                    <el-form-item label="问题协办人：" >
                            <el-tag type="info" size="mini" v-if="checkData.supportUser">{{checkData.supportUser}}</el-tag>
                            <span v-else>无</span>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="问题参阅人：" >
                    <el-tag type="info" size="mini" v-if="checkData.consultUser">{{checkData.consultUser}}</el-tag>
                    <span v-else>无</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="原因分析："  >
                <el-input type="textarea" v-model="checkData.message" placeholder="请输入问题描述..." class="description"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card shadow='hover' class="problem-analysis" v-if="porpsData.type==='backHandle'||porpsData.type==='confirm'||porpsData.type==='busConfirm'||porpsData.type==='detail_continue'||porpsData.type==='已关闭'">
          <div class="card-title">
            <p>问题分析</p>
          </div>
          <div class="card-body">
            <el-form :model="ruleForm"  ref="ruleForm" label-width="110px" disabled>
              <el-form-item label="原因分析："  >
                <el-input type="textarea" v-model="proplemMess.analyze" placeholder="请输入问题描述..." class="description"></el-input>
              </el-form-item>
              <el-form-item label="规避措施：" >
                <el-input type="textarea" v-model="proplemMess.measure" placeholder="请输入影响范围..." class="influence"></el-input>
              </el-form-item>
              <el-form-item label="解决方案：" >
                <el-input type="textarea" v-model="proplemMess.precept" placeholder="请输入影响范围..." class="influence"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="7">
                    <el-form-item label="原因分类：" >
                      <el-tag  type="info" size="mini" v-for="val in proplemMess.causeClassification" :key="val.sysCode" style="margin-right:5px;">
                      {{val.sysName}}
                      </el-tag>
                            <!-- <el-tag type="info" size="mini">标签三</el-tag> -->
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="质量维度：" >
                    <el-tag  type="info" size="mini">
                      {{proplemMess.dimensionality}}
                      </el-tag>
                            <!-- <el-tag type="info" size="mini">标签三</el-tag> -->
                    </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="分析报告：">
                  <a  :href="api+'/kno/doc/downloadAttachFile.do?attachId='+proplemMess.formId.attachId+'&token='+ token" v-if="proplemMess.formId" style="color: #2d8cf0;" target="_blank">{{proplemMess.formId.attachName}}</a>
              </el-form-item>
            </el-form>

          </div>
        </el-card>
        <el-card shadow='hover' class="problem-analysis" v-if="porpsData.type==='backHandle'||porpsData.type==='back'">
          <div class="card-title">
            <p>驳回原因</p>
          </div>
          <div class="card-body">
            <el-form :model="ruleForm"  ref="ruleForm" label-width="110px" disabled>
              <el-form-item label="原因分析："  >
                <el-input type="textarea" v-model="ruleForm.problemDescription" placeholder="请输入问题描述..." class="description"></el-input>
              </el-form-item>
            </el-form>

          </div>
        </el-card>
    </div>
</template>
<script>
import { get } from '@/utils/request'
import { getToken } from "@/utils/auth";
export default {
  name: 'particulars',
  data() {
    return {
      porpsData: {
        type: 'confirm',
        bid: '',
        pid: ''
      },
      ruleForm: {
        orderName: '',
        problemDescription: '',
        scopeInfluence: '',
        problemSources: '',
        problemLevel: '',
        expectDate: '',
        problemInitiator: [],
        involvedSystem: [],
        inTable: [],
        problemReceiver: [],
        accessory: '',
        noMess: '',
        noMess2: ''
      },
      proplemMess: {// 问题分析信息接收
        analyze: '',
        measure: '',
        precept: '',
        causeClassification: '',
        dimensionality: '',
        formId: null
      },
      checkData: {
        mainUser: '',
        consultUser: null,
        supportUser: null,
        message: ''
      },
      pushData: {
        analyze: '',
        measure: '',
        precept: '',
        causeClassification: '',
        dimensionality: '',
        formId: null
      },
      wData: {
        dialogVisible: false,
        wKeyword: '',
        problemInitiator: '',
        defaultProps: ''
      },
      rules: {
        problemDescription: [
          { required: true, message: '受理信息不能为空', trigger: 'blur' }
        ]
      },
      mangProblemLevel: '',
      api: '',
      token: ''
    }
  },
  methods: {
    getData(id) {
      get('/home/matter/queryProblemInfoes', {
        questionId: id
      }).then(res => {
        let data = res.data;
        console.log(data)
        this.ruleForm = {
          orderName: data.caseName,
          problemDescription: data.questionDesc,
          scopeInfluence: data.impactScope,
          problemSources: data.sourceClass,
          expectDate: data.endDate,
          problemInitiator: data.initiators,
          involvedSystem: data.systemInfos,
          inTable: data.relaTables,
          problemReceiver: data.checkUser
        }
        if (data.attachInfoes.length > 0) {
          data.attachInfoes.map(val => {
            if (val.type === '1') {
              this.ruleForm.accessory = val
            }
            console.log(val)
          })
        }
        if (this.mangProblemLevel !== '') {
          this.mangProblemLevel.map(val => {
            if (val.dictValue === data.questionLvl) {
              this.ruleForm.problemLevel = val.dictName;
            }
          })
        }
        if (this.porpsData.type === 'confirm' || this.porpsData.type === 'busConfirm' || this.porpsData.type === 'backHandle' || this.porpsData.type === '已关闭' || this.porpsData.type === 'detail_continue') {
          this.proplemMess = {
            analyze: data.causeAnalys,
            measure: data.precaution,
            precept: data.queSolution,
            causeClassification: data.causeClasses,
            formId: data.attachInfoes

          }
          if (this.dimensionality) {
            console.log(this.dimensionality, 'dim')
            this.dimensionality.map(val => {
              if (val.dictValue === data.qualityDim) {
                this.proplemMess.dimensionality = val.dictName
              }
            })
          }
          console.log(data.causeClasses, 'data.causeClasses')
          if (data.attachInfoes) {
            data.attachInfoes.map(val => {
              if (val.type === '2') {
                this.proplemMess.formId = val
              }
            })
          }
        }
        this.pushData = {
          analyze: '',
          measure: '',
          precept: '',
          causeClassification: '',
          dimensionality: '',
          formId: null
        }
        console.log(this.ruleForm)
      })
    },
    getClassify() {
      get('/sys/dict/listByCode', {
        keyword: 'CAUSECLASS'
      }).then(res => {
        if (res.code === 10000) {
          this.classify = res.data
        }
      })
      get('/sys/dict/listByCode', {
        keyword: 'QUALITY_DIM'
      }).then(res => {
        if (res.code === 10000) {
          this.dimensionality = res.data
          console.log(this.dimensionality, 'this.dimensionality')
        }
      })
    },
    getCheckData() {
      if (this.porpsData.type !== 'back' && this.porpsData.type !== 'detail' && this.porpsData.type !== 'check') {
        get('/home/matter/queryLastMsgByType', {
          processId: this.porpsData.pid, type: 'CheckMsg'
        }).then(res => {
          console.log(res)
          let data = res.data
          this.checkData = {
            mainUser: data.mainUser,
            message: data.message,
            supportUser: data.supportUser ? data.supportUser : '',
            consultUser: data.consultUser ? data.consultUser : ''
          }
          console.log(this.checkData)
        })
      }
    },
    getProblemLevel() {
      get('/sys/dict/listByCode', {
        keyword: 'QUESTION_LVL'
      }).then(res => {
        this.mangProblemLevel = res.data;
      })
    },
    getCheckMsg() {
      get('/home/matter/queryLastMsgByType', {
        processId: this.porpsData.pid,
        type: 'CheckMsg'
      }).then(res => {
        if (this.porpsData.type !== 'back') {
          this.ruleForm.noMess = res.data.message;
        }
      })
    },
    getBackMsg() {
      get('/home/matter/queryLastMsgByType', {
        processId: this.porpsData.pid,
        type: 'BackMsg'
      }).then(res => {
        console.log(res)
        this.ruleForm.noMess2 = res.data.message
      })
    }
  },
  created() {
    this.api = process.env.BASE_API;
    this.token = getToken()
    this.getProblemLevel();
    this.getData(this.$route.query.bid);
    this.porpsData.type = this.$route.query.type;
    this.porpsData.pid = this.$route.query.pid;
    this.porpsData.bid = this.$route.query.bid;
    this.getClassify();
    if (this.porpsData.type !== 'back' && this.porpsData.type !== 'detail' && this.porpsData.type !== 'check') {
      this.getCheckData()
    }
    if (this.porpsData.type === 'back') {
      this.getCheckMsg();
    }
    if (this.porpsData.type === 'backHandle') {
      this.getBackMsg();
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
 @import "../../styles/variables";
  @import "../../styles/treeIcon";
  @import '../../styles/dq/main-card-table.scss';
  .container{
      padding:10px;
      .essential-information{
        .el-card__body{
            padding:0;
            .card-title{
            padding:14px 16px;
            border-bottom:1px solid #e8eaec;
            p{
                font-size: 14px;
                color: #17233d;
                font-weight: 700;
                margin: 0;
            }
            }
            .card-body{
            padding:0 18px;
            .el-form{
                margin-top:15px;
                .el-row{
                .el-col{
                    margin-right: 25px;
                }
                }
                .el-form-item{
                .el-button:hover{
                    background-color: transparent;
                    border-color: #c6e2ff;
                }
                .el-button{
                    border: 1px solid #e8eaec;
                    border-radius: 3px;
                    background: #f7f7f7;
                    font-size: 12px;
                    color: #515a6e;
                    padding: 5px 8px;
                }
                .el-dialog__wrapper{
                    .el-dialog{
                    margin-top:8vh!important;
                    }
                }
                .description{
                    .el-textarea__inner{
                    min-height: 90px;
                    }
                }
                .influence{
                    .el-textarea__inner{
                    min-height: 65px;
                    }
                }
                .el-input.is-disabled{
                    .el-input__inner{
                        background-color:initial;
                        cursor: text;
                        color:#333;

                    }
                }
                .el-textarea.is-disabled{
                    .el-textarea__inner{
                        background-color:initial;
                        cursor: text;
                        color:#333;

                    }
                }
                }
            }
            }
            .attachedFiles{
            border-top: 1px solid #ddd;
            padding:40px;
            .upload{
                text-align: center;
                .el-upload-dragger{
                background-color: #fff;
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                box-sizing: border-box;
                width: 200px;
                height:auto;
                text-align: center;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                padding:20px;
                .el-icon-upload{
                    font-size: 52px;
                    color: rgb(51, 153, 255);
                    margin:0;
                }
                }
                .el-upload:hover{
                border-color: #409eff;
                }
            }
            }
            .form-btns{
            padding: 15px 0;
            border-top: 1px solid #ddd;
            text-align: center;
            }
        }
    }
    .problem-analysis{
        margin-top: 10px;
        .el-card__body{
            padding:0;
            .card-title{
            padding:14px 16px;
            border-bottom:1px solid #e8eaec;
            p{
                font-size: 14px;
                color: #17233d;
                font-weight: 700;
                margin: 0;
            }
            }
            .card-body{
            padding:0 18px;
            .el-form-item{
                .el-textarea.is-disabled{
                    .el-textarea__inner{
                        background-color:initial;
                        cursor: text;
                        color:#333;

                    }
                }
                }
            }
        }
    }
    .accept-information{
        margin-top: 10px;
        .el-card__body{
            padding:0;
            .card-title{
            padding:14px 16px;
            border-bottom:1px solid #e8eaec;
            p{
                font-size: 14px;
                color: #17233d;
                font-weight: 700;
                margin: 0;
            }
            }
            .card-body{
            padding:0 18px;
            .el-form{
                margin-top:15px;
                .el-row{
                .el-col{
                    margin-right: 25px;
                }
                }
                .el-form-item{
                .el-textarea.is-disabled{
                    .el-textarea__inner{
                        background-color:initial;
                        cursor: text;
                        color:#333;

                    }
                }
                }
            }
            }
        }
    }
  }

</style>
