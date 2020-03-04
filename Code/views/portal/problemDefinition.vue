<template>
    <div class="verification-container">
        <el-card shadow='hover' class="essential-information">
          <div class="card-title">
            <p>基本信息</p>
          </div>
          <div class="card-body">
            <el-form :model="ruleForm"   label-width="110px" disabled>
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
        <!-- 问题确认---check -->
        <el-card shadow='hover' class="accept-information" v-if="porpsData.type==='check'">
            <div class="card-title">
                <p>受理信息</p>
            </div>
            <div class="card-body">
                <el-form  ref="formName" label-width="110px" :model="ruleForm">
                    <el-form-item label="问题主办人：" >
                      <el-tag   type="info" closable @close="handleClose('主办')" size="small" style="margin-right:6px" v-if="mainPeople.name">
                      {{mainPeople.name}}
                      </el-tag>
                        <el-button @click="changeType('请选择添加主办人')" size="mini" icon="el-icon-plus" v-else>增加</el-button>
                    </el-form-item>
                    <el-row>
                        <el-col :span='11'>
                            <el-form-item label="问题协办人：" >
                              <el-tag   type="info" closable @close="handleClose('协办')" size="small" style="margin-right:6px" v-if="supportPeople.name">
                              {{supportPeople.name}}
                              </el-tag>
                                <el-button @click="changeType('请选择添加协办人')" size="mini" icon="el-icon-plus" v-else>增加</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span='11'>
                            <el-form-item label="问题参阅人：" >
                              <el-tag   type="info" closable @close="handleClose('参阅')" size="small" style="margin-right:6px" v-if="consultPeople.name">
                              {{consultPeople.name}}
                              </el-tag>
                                <el-button @click="changeType('请选择添加参阅人')" size="mini" icon="el-icon-plus" v-else>增加</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="受理信息：" prop="problemText" :rules="[{ required: true, message: '受理信息不能为空', trigger: 'blur' }]" >
                        <el-input type="textarea" v-model="ruleForm.problemText" placeholder="请输入问题描述..." class="description"></el-input>
                    </el-form-item>
                </el-form>
                <div class="form-btns">
                    <el-button type="primary" ref="submit" size="small" @click="handle('pass')">受理</el-button>
                    <el-button type="default" ref="save" size="small" @click="handle('back')">驳回</el-button>
                </div>
            </div>

        </el-card>
        <!-- 受理信息读取 -->
        <el-card shadow='hover' class="accept-information2" v-if="porpsData.type!=='back'&&porpsData.type!=='detail'&&porpsData.type!=='check'">
          <div class="card-title">
            <p>受理信息</p>
          </div>
          <div class="card-body">
            <el-form  label-width="110px" disabled>
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
        <!-- 问题处理页---handle -->
        <el-card shadow='hover' class="essential-information" style="margin-top:10px;" v-if="porpsData.type == 'handle'">
          <div class="card-title">
            <p>问题分析</p>
          </div>
          <div class="card-body">
            <el-form :model="proplemForm"   :rules="ruless"  ref="proplemForm" label-width="110px">
              <el-form-item label="原因分析："  prop="analyze" >
                <el-input type="textarea" v-model="proplemForm.analyze" placeholder="请输入问题描述..." class="description"></el-input>
              </el-form-item>
              <el-form-item label="规避措施：" prop="measure" >
                <el-input type="textarea" v-model="proplemForm.measure" placeholder="请输入影响范围..." class="influence"></el-input>
              </el-form-item>
              <el-form-item label="解决方案：" prop="precept" >
                <el-input type="textarea" v-model="proplemForm.precept" placeholder="请输入影响范围..." class="influence"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="17">
                  <el-form-item label="原因分类：" prop="causeClassification" >
                    <el-select v-model="proplemForm.causeClassification" placeholder="请选择原因分类" multiple style="width:100%">
                      <el-option :label="val.dictName" :value="val.dictValue" v-for="val in classify" :key="val.dictValue"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="质量维度：" prop="dimensionality">
                    <el-select v-model="proplemForm.dimensionality" placeholder="请选择质量维度">
                      <el-option :label="val.dictName" :value="val.dictValue" v-for="val in dimensionality" :key="val.dictValue"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="分析报告：" class="uploadbox">
                  <a  :href="api+'/kno/doc/downloadAttachFile.do?attachId='+proplemMess.formId.attachId+'&token='+ token" v-if="proplemMess.formId" style="color: #2d8cf0;position: absolute;top: -41px;left: 115px;">{{proplemMess.formId.attachName}}</a>
                  <div class="attachedFiles">
                    <el-upload
                      class="upload"
                      drag
                      :headers="header"
                      :action="`${api}/home/matter/uploadAttach`"
                      :data='upload'
                      :on-change="handleChange"
                      :on-remove='handleRemove'
                      :limit="limit">
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">点击这里上传</div>
                    </el-upload>
                  </div>
              </el-form-item>
            </el-form>
            <div class="form-btns">
                    <el-button type="default" ref="save" size="small" @click="handleSave('proplemForm')">保存</el-button>
                    <el-button type="primary" ref="submit" size="small" @click="handleSubmit('proplemForm')">提交</el-button>
            </div>
          </div>
        </el-card>
        <!-- 结果核查页---问题分析信息读取---confirm -->
        <el-card shadow='hover' class="essential-information" style="margin-top:10px;" v-if="porpsData.type == 'confirm' || porpsData.type == 'busConfirm' || porpsData.type == 'backHandle'">
          <div class="card-title">
            <p>问题分析</p>
          </div>
          <div class="card-body">
            <el-form  label-width="110px" disabled>
              <el-form-item label="原因分析：" >
                <el-input type="textarea" v-model="proplemMess.analyze" placeholder="请输入问题描述..." class="description"></el-input>
              </el-form-item>
              <el-form-item label="规避措施：">
                <el-input type="textarea" v-model="proplemMess.measure" placeholder="请输入规避措施..." class="influence"></el-input>
              </el-form-item>
              <el-form-item label="解决方案："  >
                <el-input type="textarea" v-model="proplemMess.precept" placeholder="请输入影响范围..." class="influence"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="15">
                  <el-form-item label="原因分类：" >
                      <el-tag  type="info" size="mini" v-for="val in proplemMess.causeClassification" :key="val.sysCode" style="margin-right:5px;">
                      {{val.sysName}}
                      </el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="质量维度：">
                    <el-tag  type="info" size="mini">
                      {{proplemMess.dimensionality}}
                      </el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="分析报告：">
                  <a  :href="api+'/kno/doc/downloadAttachFile.do?attachId='+proplemMess.formId.attachId+'&token='+ token" v-if="proplemMess.formId" style="color: #2d8cf0;">{{proplemMess.formId.attachName}}</a>
              </el-form-item>
            </el-form>
            <div class="form-btns" v-if="porpsData.type==='busConfirm'">
              <el-button type="primary" ref="submit" size="small" @click="doHandle2('close')">关闭问题</el-button>
              <el-button type="default" ref="save" size="small" @click="doHandle2('redo')">继续处理</el-button>
            </div>
            <div class="form-btns" v-if="porpsData.type==='confirm'">
              <el-button type="primary" ref="submit" size="small" @click="doHandle('pass')">通过</el-button>
              <el-button type="default" ref="save" size="small" @click="doHandle('back')">驳回</el-button>
              <el-button type="default" ref="save" size="small" @click="doHandle('backto')">转发</el-button>
            </div>
          </div>
        </el-card>
        <!-- 驳回原因 -->
        <el-card shadow='hover' class="problem-analysis" v-if="porpsData.type==='backHandle'&&ruleForm.noMess2||porpsData.type==='back'">
          <div class="card-title">
            <p>驳回原因</p>
          </div>
          <div class="card-body">
            <el-form :model="ruleForm"  ref="ruleForm" label-width="110px" disabled>
              <el-form-item label="原因分析："  v-if="porpsData.type==='backHandle'">
                <el-input type="textarea" v-model="ruleForm.noMess2" placeholder="请输入问题描述..." class="description"></el-input>
              </el-form-item>
              <el-form-item label="原因分析："  v-if="porpsData.type==='back'">
                <el-input type="textarea" v-model="ruleForm.noMess" placeholder="请输入问题描述..." class="description" ></el-input>
              </el-form-item>
            </el-form>
            <div class="form-btns" v-if="porpsData.type==='backHandle'">
              <el-button type="primary" ref="submit" size="small" @click="goToHandleAgain()">继续办理</el-button>
            </div>
            <div class="form-btns" v-if="porpsData.type==='back'">
              <el-button type="primary" ref="submit" size="small" @click="goToClose()">关闭问题</el-button>
            </div>
          </div>
        </el-card>
        <!-- 问题发起人///问题受理人 -->
        <el-dialog :title="wData.multiple" :visible.sync="dialogVisible" width="30%" class="people-dialog">
          <div slot=""  style="margin-bottom:10px;" v-if="wData.filterTakerName">
              已选择： <el-tag  type="info" size="small">
                      {{wData.filterTakerName}}
                      </el-tag>
          </div>
          <el-input placeholder="请输入内容" v-model="wData.wKeyword" @input="toSearch">
            <i slot="suffix" class="el-input__icon el-icon-search" ></i>
          </el-input>
          <el-tree
            class="filter-tree"
            :data="wData.problemTakerData2"
            :props="wData.defaultProps"
            ref="tree" v-if="wData.treeSelect.length==0&&dialogVisible"
            @node-click="selectTreeValue"
            style="height: 200px;overflow:auto;">
          </el-tree>
          <div class="tree-select-div people" v-if="wData.treeSelect.length>0">
              <div v-for="select in wData.treeSelect" :key="select.userId" class="item">
                  <p style="color:red;" v-if="!select.hasAuthority">
                      {{select.title}}  （ {{ select.parent }} )
                  </p>
                  <p  v-else @click="selectTreeValue(select)">
                      {{select.title}}  （ {{ select.parent }} )
                  </p>
                  <!-- <Icon type="ios-checkmark" color="#1890ff"></Icon> -->
              </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sure">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 转发另选主办人 -->
        <el-dialog
          title="选择主办人"
          :visible.sync="dialogVisible2"
          width="30%" class="people-dialog2">
          <el-form>
            <el-form-item label="选择主办人：">
              <el-tag size="small" effect="plain" type="info" @close="handleClose('转发')" closable v-if="transmitData.mainPeople.name">
                {{transmitData.mainPeople.name}}
              </el-tag>
              <el-tag   size="small" effect="plain" type="info" style="border:1px dashed #d3d4d6;cursor: pointer;" @click="dialogVisible = true" v-else>
                +  增加
              </el-tag>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible2 = false" size="small">取 消</el-button>
            <el-button type="primary" @click="goToOthers" size="small">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 驳回重新办理-->
        <el-dialog
          title="驳回原因"
          :visible.sync="dialogVisible3"
          width="30%" class="people-dialog2">
          <el-form>
            <el-form-item>
              <el-input type="textarea" v-model="transmitData.bMess" placeholder="请输入驳回原因..." ></el-input>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible3 = false" size="small">取 消</el-button>
            <el-button type="primary" @click="goBackTo" size="small">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import { get, post } from '@/utils/request'
import pinyin from 'pinyin'
import { getToken } from "@/utils/auth";
export default {
  name: 'problemDefinition',
  data() {
    return {
      porpsData: {// 初始页接收变量
        type: '',
        questionId: '',
        key: '',
        processId: '',
        taskId: '',
        caseId: '',
        show: false
      },
      ruleForm: { // 基本信息接收变量
        orderName: '',
        problemDescription: '',
        problemText: '',
        scopeInfluence: '',
        problemSources: '',
        problemLevel: '',
        expectDate: '',
        problemInitiator: [],
        involvedSystem: [],
        inTable: [],
        problemReceiver: [],
        accessory: [],
        caseId: '',
        noMess: null,
        noMess2: null
      },
      mainPeople: {
        id: '',
        name: ''
      },
      supportPeople: {
        id: '',
        name: ''
      },
      consultPeople: {
        id: '',
        name: ''
      },
      wData: {// 受理页变量传递
        wKeyword: '',
        problemTakerData: [],
        problemTakerData2: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        multiple: '请选择添加主办人',
        treeSelect: [],
        filterTakerName: '',
        filterTakerKey: '',
        porSou: [],
        porLevel: [],
        closable: true

      },
      ruless: {
        analyze: [
          { required: true, message: '原因分析不能为空', trigger: 'blur' }
        ],
        measure: [
          { required: true, message: '规避措施不能为空', trigger: 'blur' }
        ],
        precept: [
          { required: true, message: '解决方案不能为空', trigger: 'blur' }
        ],
        causeClassification: [
          { required: true, message: '原因分类不能为空', trigger: 'blur' }
        ],
        dimensionality: [
          { required: true, message: '质量维度不能为空', trigger: 'blur' }
        ]
      },
      proplemForm: {// 问题分析标量传递
        analyze: '',
        measure: '',
        precept: '',
        causeClassification: '',
        dimensionality: '',
        formId: null
      },
      proplemMess: {// 问题分析信息接收
        analyze: '',
        measure: '',
        precept: '',
        causeClassification: '',
        dimensionality: '',
        formId: null
      },
      mangProblemLevel: '',
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      limit: 1,
      header: '',
      api: '',
      token: '',
      upload: {
        caseType: '',
        attachType: 2
      },
      transmitData: {// 经办人再确认驳回或转发信息
        mainPeople: {
          id: '',
          name: ''
        },
        bMess: ''
      },
      classify: [],
      dimensionality: [],
      checkData: {
        mainUser: '',
        consultUser: null,
        supportUser: null,
        message: ''
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val === false) {
        this.wData.filterTakerName = null;
        this.wData.filterTakerKey = null
        this.wData.treeSelect = [];
        this.wData.wKeyword = ''
      }
    }
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag(view, route) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          this.$router.push(route)
        }
      })
    },
    goToHandleAgain() {
      let a = {
        type: 'handle',
        questionId: this.porpsData.questionId,
        titlename: '问题处理',
        porpos: true,
        cid: this.porpsData.caseId,
        tid: this.porpsData.taskId,
        pid: this.porpsData.processId,
        key: this.porpsData.key,
        time: new Date().getTime()
      }
      // const params = JSON.stringify(a)
      this.closeSelectedTag(this.$route, {
        name: 'MY_MATTER',
        query: a
      })
      // this.$router.push({ name: 'MY_MATTER', replace: true })
    },
    goToOthers() {
      this.$confirm('确认转发吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          caseId: this.porpsData.caseId,
          noteMessage: this.porpsData.type,
          taskId: this.porpsData.taskId,
          processId: this.porpsData.processId,
          btnMessage: 'back',
          mainUser: this.transmitData.mainPeople.id,
          caseType: this.porpsData.key
        }
        console.log(params)
        post('/home/matter/handle', params).then(res => {
          this.$message({
            type: 'success',
            message: '转发成功!'
          });
          this.dialogVisible2 = false;
          this.closeSelectedTag(this.$route, { name: 'MY_MATTER' })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '系统繁忙，请稍后再试'
        });
      });
    },
    goBackTo() {
      if (this.transmitData.bMess) {
        let params = {
          caseId: this.porpsData.caseId,
          noteMessage: this.porpsData.type,
          taskId: this.porpsData.taskId,
          processId: this.porpsData.processId,
          btnMessage: 'back',
          caseType: this.porpsData.key,
          message: this.transmitData.bMess
        }
        post('/home/matter/handle', params).then(res => {
          this.$message({
            type: 'success',
            message: '驳回操作成功!'
          });
          this.dialogVisible3 = false;
          this.closeSelectedTag(this.$route, { name: 'MY_MATTER' })
        })
      } else {
        this.$message({
          type: 'error',
          message: '请输入驳回原因'
        });
      }
    },
    handleSubmit(data) {
      this.$refs[data].validate((valid) => {
        if (valid) {
          let params = {
            btnMessage: 'done',
            caseId: this.porpsData.caseId,
            causeAnalys: this.proplemForm.analyze,
            causeIds: this.proplemForm.causeClassification.join(','),
            queSolution: this.proplemForm.precept,
            precaution: this.proplemForm.measure,
            qualityDim: this.proplemForm.dimensionality,
            taskId: this.porpsData.taskId,
            questionId: this.porpsData.questionId,
            processId: this.porpsData.processId,
            noteMessage: this.porpsData.type
          }
          if (this.proplemForm.formId && this.proplemForm.formId.attachId != null) {
            params.folAttachId = this.proplemForm.formId.attachId
          } else {
            params.folAttachId = this.proplemForm.formId
          }
          console.log(params)
          post('/home/matter/updateProblemInfo', params).then(res => {
            this.closeSelectedTag(this.$route, { name: 'MY_MATTER' })
          })
        } else {
          return false
        }
      })
    },
    handleSave(data) {
      this.$refs[data].validate((valid) => {
        if (valid) {
          let params = {
            folAttachId: this.proplemForm.formId,
            btnMessage: null,
            caseId: this.porpsData.caseId,
            causeAnalys: this.proplemForm.analyze,
            causeIds: this.proplemForm.causeClassification.join(','),
            noteMessage: null,
            queSolution: this.proplemForm.precept,
            precaution: this.proplemForm.measure,
            qualityDim: this.proplemForm.dimensionality,
            taskId: this.porpsData.taskId,
            questionId: this.porpsData.questionId,
            processId: this.porpsData.processId
          }
          if (this.proplemForm.formId && this.proplemForm.formId.attachId != null) {
            params.folAttachId = this.proplemForm.formId.attachId
          } else {
            params.folAttachId = this.proplemForm.formId
          }
          post('/home/matter/updateProblemInfo', params).then(res => {
            // console.log(res)
          })
        } else {
          return false
        }
      })
    },
    doHandle2(type) {
      if (type === 'close') {
        this.$confirm('', '确认关闭问题吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            caseId: this.porpsData.caseId,
            noteMessage: this.porpsData.type,
            taskId: this.porpsData.taskId,
            processId: this.porpsData.processId,
            btnMessage: 'close',
            caseType: this.porpsData.key
          }
          console.log(params)
          post('/home/matter/handle', params).then(res => {
            this.$message({
              type: 'success',
              message: '关闭操作成功!'
            });
            this.closeSelectedTag(this.$route, { name: 'MY_MATTER' })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '系统繁忙，请稍后再试'
          });
        });
      } else if (type === 'redo') {
        this.$confirm('', '确认继续问题吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            caseId: this.porpsData.caseId,
            noteMessage: this.porpsData.type,
            taskId: this.porpsData.taskId,
            processId: this.porpsData.processId,
            btnMessage: 'redo',
            caseType: this.porpsData.key
          }
          console.log(params)
          post('/home/matter/handle', params).then(res => {
            this.$message({
              type: 'success',
              message: '继续处理操作成功!'
            });
            let obj = {
              type: 'detail',
              key: this.porpsData.key,
              questionId: this.porpsData.questionId,
              // type: this.porpsData.type,
              titlename: '提交问题',
              cid: this.porpsData.caseId,
              tid: this.porpsData.taskId,
              pid: this.porpsData.processId
            }
            this.closeSelectedTag(this.$route, { name: 'MY_MATTER', params: obj })
            // this.$router.push({ name: 'verificationResults', replace: true })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '系统繁忙，请稍后再试'
          });
        });
      }
    },
    doHandle(type) {
      let params = {
        caseId: this.porpsData.caseId,
        noteMessage: this.porpsData.type,
        taskId: this.porpsData.taskId,
        processId: this.porpsData.processId,
        caseType: this.porpsData.key
      }
      if (type === 'pass') {
        params.btnMessage = 'pass'
        this.$confirm('通过之后问题分析结果将反馈至问题提交人，是否继续？', '确认方案通过吗？', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          post('/home/matter/handle', params).then(res => {
            this.$message({
              type: 'success',
              message: '通过操作成功!'
            });
            this.closeSelectedTag(this.$route, { name: 'MY_MATTER' })
          })
        }).catch(() => {
        });
      } else if (type === 'back') {
        this.dialogVisible3 = true
      } else if (type === 'backto') {
        this.dialogVisible2 = true;
      }
    },
    handleChange(res, resArr) {
      if (res.status === 'success' && res.response.code === 10000) {
        this.$message({
          message: '上传成功',
          type: 'success'
        });
        this.proplemForm.formId = res.response.data.attachId;
      }
    },
    handleRemove(res, resArr) {
      this.proplemForm.formId = null;
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
    handle(type) {
      this.$refs.formName.validate((valid) => {
        if (valid) {
          if (this.mainPeople.name && type === 'pass') {
            let params = {
              btnMessage: type,
              caseId: this.porpsData.caseId,
              caseType: this.porpsData.key,
              consultUser: this.consultPeople.id,
              supportUser: this.supportPeople.id,
              mainUser: this.mainPeople.id,
              message: this.ruleForm.problemText,
              noteMessage: this.porpsData.type,
              processId: this.porpsData.processId,
              taskId: this.porpsData.taskId
            }
            // console.log(params)
            post('/home/matter/handle', params).then(res => {
              this.$message({
                type: 'success',
                message: '受理操作成功!'
              });
              this.closeSelectedTag(this.$route, { name: 'MY_MATTER' })
            })
          } else if (type === 'back') {
            let params = {
              btnMessage: type,
              caseId: this.porpsData.caseId,
              caseType: this.porpsData.key,
              message: this.ruleForm.problemText,
              noteMessage: this.porpsData.type,
              processId: this.porpsData.processId,
              taskId: this.porpsData.taskId
            }
            console.log(params)
            post('/home/matter/handle', params).then(res => {
              this.$message({
                type: 'success',
                message: '驳回操作成功!'
              });
              this.closeSelectedTag(this.$route, { name: 'MY_MATTER' })
            })
          } else {
            this.$message.error('请选择主办人');
          }
        } else {
          return false;
        }
      });
    },
    goToClose() {
      let params = {
        btnMessage: 'close',
        caseId: this.porpsData.caseId,
        caseType: this.porpsData.key,
        message: this.ruleForm.problemText,
        noteMessage: this.porpsData.type,
        processId: this.porpsData.processId,
        taskId: this.porpsData.taskId
      }
      post('/home/matter/handle', params).then(res => {
        this.$message({
          type: 'success',
          message: '关闭问题成功!'
        });
        this.closeSelectedTag(this.$route, { name: 'MY_MATTER' })
      })
    },
    sure() {
      if (this.dialogVisible2) {
        this.transmitData.mainPeople.name = this.wData.filterTakerName;
        this.transmitData.mainPeople.id = this.wData.filterTakerKey;
      } else {
        if (this.wData.multiple === '请选择添加主办人') {
          this.mainPeople.name = this.wData.filterTakerName;
          this.mainPeople.id = this.wData.filterTakerKey;
        } else if (this.wData.multiple === '请选择添加协办人') {
          this.supportPeople.name = this.wData.filterTakerName;
          this.supportPeople.id = this.wData.filterTakerKey;
        } else if (this.wData.multiple === '请选择添加参阅人') {
          this.consultPeople.name = this.wData.filterTakerName;
          this.consultPeople.id = this.wData.filterTakerKey;
        }
      }

      this.dialogVisible = false;
    },
    handleClose(type) {
      if (type === '主办') {
        this.mainPeople.name = '';
        this.mainPeople.id = '';
      } else if (type === '协办') {
        this.supportPeople.name = '';
        this.supportPeople.id = '';
      } else if (type === '参阅') {
        this.consultPeople.name = '';
        this.consultPeople.id = '';
      } else if (type === '转发') {
        this.transmitData.mainPeople.name = '';
        this.transmitData.mainPeople.id = '';
      }
    },
    changeType(type) {
      this.dialogVisible = true;
      this.wData.multiple = type;
    },
    getProblemInitiator() {
      get('/home/matter/queryUserAndAutOfCase', {
        caseType: this.porpsData.key
      }).then(res => {
        const that = this;
        if (res.code === 10000 && res.success) {
          console.log(res)
          let resData = res.data;
          that.wData.problemTakerData = resData.map(child => {
            return {
              title: child.groupName,
              expand: false,
              children: child.users.map(function (child2) {
                return {
                  title: child2.userName,
                  userId: child2.userId,
                  hasAuthority: child2.hasAuthority
                }
              })
            }
          });
          that.wData.problemTakerData2 = resData.map(function (child) {
            return {
              title: child.groupName,
              expand: false,
              children: child.users.map(function (child2) {
                if (child2.hasAuthority) {
                  return {
                    title: child2.userName,
                    userId: child2.userId,
                    hasAuthority: child2.hasAuthority
                  }
                } else if (child2.userId !== undefined) {
                  return {
                    title: child2.userName + ' (该用户没有受理权限)',
                    userId: child2.userId,
                    hasAuthority: child2.hasAuthority
                  }
                } else {
                  return {
                    title: null,
                    userId: null,
                    hasAuthority: null
                  }
                }
              })
            }
          });
          console.log(that.wData.problemTakerData)
          // that.setTreeValueMap();
        }
      })
    },
    selectTreeValue(data) {
      // const that = this;
      if (data) {
        if (data.hasOwnProperty("children")) {
          data.selected = false;
          // console.log(data, 1)
        } else {
          if (data.userId !== undefined && data.hasAuthority) {
            this.wData.filterTakerName = data['title'];
            this.wData.filterTakerKey = data['userId'];
            this.wData.wKeyword = data['title'];
          }
        }
      } else {
        this.wData.filterTakerName = '';
        this.wData.filterTakerKey = '';
        this.wData.wKeyword = '';
      }
    },
    getData() {
      get('/home/matter/queryProblemInfoes', {
        questionId: this.porpsData.questionId
      }).then(res => {
        if (this.porpsData.type !== 'detail' && this.porpsData.type !== 'check') {
          this.getCheckMsg();
        }
        if (this.porpsData.type === 'backHandle') {
          this.getBackMsg();
        }
        let data = res.data;
        console.log(data, 'data')
        this.ruleForm = {
          orderName: data.caseName,
          problemDescription: data.questionDesc,
          scopeInfluence: data.impactScope,
          problemSources: data.sourceClass,
          expectDate: data.endDate,
          problemInitiator: data.initiators,
          involvedSystem: data.systemInfos,
          inTable: data.relaTables,
          problemReceiver: data.checkUser,
          // accessory: data.attachInfoes,
          noMess: null,
          noMess2: null
        }
        if (data.attachInfoes.length > 0) {
          data.attachInfoes.map(val => {
            if (val.type === '1') {
              this.ruleForm.accessory = val
            } else if (val.type === '2') {
              this.proplemMess.formId = val
            }
            console.log(val)
          })
        }
        console.log(this.ruleForm.accessory)
        if (this.mangProblemLevel !== '') {
          this.mangProblemLevel.map(val => {
            if (val.dictValue === data.questionLvl) {
              this.ruleForm.problemLevel = val.dictName
            }
          })
        }

        this.proplemForm = {
          analyze: data.causeAnalys,
          measure: data.precaution,
          precept: data.queSolution,
          causeClassification: [],
          dimensionality: data.qualityDim,
          formId: null
        }
        console.log(data.causeClasses)
        if (data.attachInfoes) {
          data.attachInfoes.map(val => {
            if (val.type === '2') {
              this.proplemForm.formId = val
            }
          })
        }
        console.log(this.proplemForm.formId, 'this.proplemForm.formId')
        if (data.causeClasses.length > 0) {
          data.causeClasses.map(val => {
            this.proplemForm.causeClassification.push(val.sysCode)
          })
        }
        if (this.porpsData.type === 'confirm' || this.porpsData.type === 'busConfirm' || this.porpsData.type === 'backHandle' || this.porpsData.type === 'handle') {
          this.proplemMess = {
            analyze: data.causeAnalys,
            measure: data.precaution,
            precept: data.queSolution,
            causeClassification: data.causeClasses,
            formId: null
          }
          console.log(this.dimensionality, this.proplemMess, 'ppppp')
          if (this.dimensionality) {
            console.log(this.dimensionality)
            this.dimensionality.map(val => {
              if (val.dictValue === data.qualityDim) {
                this.proplemMess.dimensionality = val.dictName
              }
            })
          }

          if (data.attachInfoes && data.attachInfoes.length > 0) {
            data.attachInfoes.map(val => {
              if (val.type === '2') {
                // this.proplemMess.formId = val
                this.$set(this.proplemMess, 'formId', val)
              }
            })
          }
          console.log(this.proplemMess.formId, "this.proplemMess.formId")
        }
        // console.log(this.ruleForm)
      })
    },
    getProblemLevel() {
      get('/sys/dict/listByCode', {
        keyword: 'QUESTION_LVL'
      }).then(res => {
        this.mangProblemLevel = res.data;
      })
    },
    toSearch() {
      // console.log(this.wData.wKeyword)
      var str
      var pattern = new RegExp("[\u4E00-\u9FA5]+");
      var pattern2 = new RegExp("[A-Za-z]+");
      if (pattern.test(this.wData.wKeyword)) {
        str = '中文'
      } else if (pattern2.test(this.wData.wKeyword)) {
        str = '英文'
      }
      if (!this.wData.wKeyword) {
        this.wData.treeSelect = [];
      }
      // console.log(str)
      if (str === '英文') {
        this.eSearch()
      } else if (str === '中文') {
        this.showTree();
      }
    },
    showTree() {
      let selectArr = [];
      let res = this.wData.problemTakerData;
      // console.log(res)
      res.map(val => {
        // console.log(val.title.indexOf(this.wData.wKeyword)>-1)
        if (this.wData.wKeyword) {
          if (val.title.indexOf(this.wData.wKeyword) > -1) {
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
              if (item.title && item.title.indexOf(this.wData.wKeyword) > -1) {
                selectArr.push({
                  title: item['title'],
                  userId: item['userId'],
                  parent: val['title'],
                  hasAuthority: item.hasAuthority
                });
              }
            })
          }
        }
      })
      // console.log(selectArr);
      this.wData.treeSelect = selectArr;
      // this.problemTakerData = selectArr;
    },
    eSearch() {
      this.wData.wKeyword = this.wData.wKeyword.toLowerCase();
      let res = this.wData.problemTakerData;
      let selectArr = [];
      res.map(val => {
        let pname = pinyin(val.title, {
          style: pinyin.STYLE_NORMAL, // 设置拼音风格
          heteronym: true
        })
        let newpname = ''
        pname.map(val2 => {
          if (val2.length > 1) {
            newpname += val2[0]
          } else {
            newpname += val2
          }
        })
        val.pname = newpname;
        let spname = pinyin(val.title, {
          style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
          heteronym: true
        })
        let newspname = ''
        spname.map(val3 => {
          if (val3.length > 1) {
            newspname += val3[0]
          } else {
            newspname += val3
          }
        })
        val.spname = newspname;
        for (let i = 0; i < val.children.length; i++) {
          if (val.children[i]) {
            let pname = pinyin(val.children[i].title, {
              style: pinyin.STYLE_NORMAL, // 设置拼音风格
              heteronym: true
            })
            let newpname = ''
            pname.map(val2 => {
              if (val2.length > 1) {
                newpname += val2[0]
              } else {
                newpname += val2
              }
            })
            val.children[i].pname = newpname;
            let spname = pinyin(val.children[i].title, {
              style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
              heteronym: true
            })
            let newspname = ''
            spname.map(val3 => {
              if (val3.length > 1) {
                newspname += val3[0]
              } else {
                newspname += val3
              }
            })
            val.children[i].spname = newspname;
          }
        }
      })
      // console.log(res)
      res.map(val => {
        if (this.wData.wKeyword) {
          if (val.spname.indexOf(this.wData.wKeyword) !== -1) {
            if (val.children.length > 0 && val.children[0].title !== undefined) {
              for (let i = 0; i < val.children.length; i++) {
                let n = val.children[i];
                n.parent = val.title;
                selectArr.push(n)
              }
            }
          } else if (val.pname.indexOf(this.wData.wKeyword) !== -1) {
            let bool = false;
            for (let m = 0; m < val.spname.length; m++) {
              if (this.wData.wKeyword[0] === val.spname[m]) {
                bool = true
              }
            }
            // console.log(bool)
            if (val.children.length > 0 && val.children[0].title !== undefined && bool) {
              for (let i = 0; i < val.children.length; i++) {
                let n = val.children[i];
                n.parent = val.title;
                selectArr.push(n)
              }
            }
          } else {
            if (val.children.length > 0 && val.children[0].title !== undefined) {
              val.children.map(item => {
                if (item.pname.indexOf(this.wData.wKeyword) !== -1) {
                  let bool = false;
                  for (let m = 0; m < item.spname.length; m++) {
                    if (this.wData.wKeyword[0] === item.spname[m]) {
                      bool = true
                    }
                  }

                  if (bool) {
                    let n = item;
                    n.parent = val.title;
                    selectArr.push(n)
                  }
                } else if (item.spname.indexOf(this.wData.wKeyword) !== -1) {
                  let n = item;
                  n.parent = val.title;
                  selectArr.push(n)
                }
              })
            }
          }
        }
      })
      // console.log(selectArr)
      this.wData.treeSelect = selectArr;
    },
    getCheckMsg() {
      get('/home/matter/queryLastMsgByType', {
        processId: this.porpsData.processId,
        type: 'CheckMsg'
      }).then(res => {
        if (this.porpsData.type === 'back') {
          // this.ruleForm.noMess = res.data.message;
          this.$set(this.ruleForm, 'noMess', res.data.message)
        } else {
        // console.log(res)
          let data = res.data
          this.checkData = {
            mainUser: data.mainUser,
            message: data.message,
            supportUser: data.supportUser ? data.supportUser : null,
            consultUser: data.consultUser ? data.consultUser : null
          }
        }
        console.log(this.porpsData.type, this.ruleForm.noMess)
      })
    },
    getBackMsg() {
      get('/home/matter/queryLastMsgByType', {
        processId: this.porpsData.processId,
        type: 'BackMsg'
      }).then(res => {
        // console.log(res)
        this.ruleForm.noMess2 = res.data.message
      })
    }
  },
  created() {
    this.api = process.env.BASE_API;
    this.header = {
      "X-Token": getToken()
    };
    this.token = getToken()
    this.getProblemLevel();
    this.getProblemInitiator();

    this.porpsData = {
      type: this.$route.params.type,
      questionId: this.$route.params.questionId,
      key: this.$route.params.key,
      processId: this.$route.params.pid,
      taskId: this.$route.params.tid,
      caseId: this.$route.params.cid
    }
    this.upload.caseType = this.$route.params.key
    console.log(this.porpsData, 'porps')
    if (this.porpsData.type !== 'detail' && this.porpsData.type !== 'check') {
      this.getClassify()
    }
    this.getData();
    // if (this.porpsData.type !== 'detail' && this.porpsData.type !== 'check') {
    //   this.getClassify()
    // }
    // if (this.porpsData.type !== 'detail' && this.porpsData.type !== 'check') {
    //   this.getCheckMsg();
    // }
    // if (this.porpsData.type === 'backHandle') {
    //   this.getBackMsg();
    // }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
 @import "../../styles/variables";
  @import "../../styles/treeIcon";
  @import '../../styles/dq/main-card-table.scss';
  .verification-container{
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
              .uploadbox{
                .el-form-item__content{
                  margin-left:0;
                  margin-top:40px;
                }
                .attachedFiles{
              border-top: 1px solid #ddd;
              padding:40px;

          .upload{
            text-align: center;
            .el-upload-dragger{
              background-color: #fff;
              border: 1px dashed #d9d9d9;
              border-radius: 8px;
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
    .accept-information2{
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
    .accept-information{
        margin-top:10px;
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
                    margin-top:10px;
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
                        border:1px dashed #DCDFE6;
                    }
                    .el-dialog__wrapper{
                        .el-dialog{
                        margin-top:8vh!important;
                        }
                    }
                    .description{
                        .el-textarea__inner{
                        min-height: 90px!important;
                        }
                    }
                    .influence{
                        .el-textarea__inner{
                        min-height: 65px;
                        }
                    }
                }
            }
            }
         }
         .form-btns{
          padding: 10px 0;
          border-top: 1px solid #ddd;
          text-align: center;
        }
    }
    .people-dialog{
      .el-dialog__header{
        padding:15px 0;
        border-bottom:1px solid #e8eaec ;
        .el-dialog__title{
          margin-left:15px;
          font-size: 16px;
          font-weight: 700;
        }
      }
      .el-dialog__body{
        padding: 10px 20px;
        .tree-slot{
          margin-bottom: 8px;
          .el-tag{
            height: 24px;
            padding: 0 5px;
            line-height: 24px;
            margin-right: 4px;
            .el-tag__close.el-icon-close{
              right: -3px;
            }
          }
        }
        .el-tree.filter-tree{
          margin-top:8px;
        }
        .tree-select-div{
          position: relative;
          width:100%;
          padding:10px 0px;
          .item{
            position: relative;
            width:100%;
            // line-height: 24px;
            padding:0px 10px;
            cursor: pointer;
          }
      }
      .people{
        max-height:280px;
        font-size:14px;
        overflow-y: auto;
        .item{
          // line-height: 26px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      }

    }
    .people-dialog2{
      .el-dialog{
        border-radius: 6px;
      }
      .el-dialog__header{
        padding:15px 0;
        .el-dialog__title{
          margin-left:15px;
          font-size: 16px;
          font-weight: 700;
        }
      }
      .el-dialog__body{
        padding: 15px 20px;
        border-bottom:1px solid #e8eaec ;
        border-top:1px solid #e8eaec ;
        .el-form-item{
          margin-bottom: 0;
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
        .form-btns{
          padding: 15px 0;
          border-top: 1px solid #ddd;
          text-align: center;
        }
    }
  }
  .uploadbox{
    .el-form-item__content{
      margin-left:0!important;
      margin-top:40px;
    }
    }
</style>
