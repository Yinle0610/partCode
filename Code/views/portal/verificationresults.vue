<template>
    <div class="verification-container">
        <el-card shadow='hover' class="essential-information-w">
          <div class="card-title">
            <p>基本信息</p>
          </div>
          <div class="card-body">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
              <el-form-item label="工单名称：" prop="orderName">
                <el-input v-model="ruleForm.orderName" placeholder="请输入工单名称..."></el-input>
              </el-form-item>
              <el-form-item label="问题描述：" prop="problemDescription">
                <el-input type="textarea" v-model="ruleForm.problemDescription" placeholder="请输入问题描述..." class="description"></el-input>
              </el-form-item>
              <el-form-item label="影响范围：" prop="scopeInfluence">
                <el-input type="textarea" v-model="ruleForm.scopeInfluence" placeholder="请输入影响范围..." class="influence"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="问题来源：" prop="problemSources">
                    <el-select v-model="ruleForm.problemSources" placeholder="请选择问题来源">
                      <el-option :label="item.dictName" :value="item.dictValue" v-for="item in wData.porSou" :key="item.dictName"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="问题等级：" prop="problemLevel">
                    <el-select v-model="ruleForm.problemLevel" placeholder="请选择问题等级" >
                      <el-option :label="item.dictName" :value="item.dictValue" v-for="item in wData.porLevel" :key="item.dictValue"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="期望解决日期：">
                    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.expectDate" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="问题发起人：" >
                <div  v-if="ifShow.initiator && wData.filterSponsorArr.length > 0" class="tree-slot" style="display:inline-block">
                  <el-tag v-for="tag in wData.filterSponsorArr" :key="tag.userId" type="info" closable @close="handleClose2(tag)" size="small" style="margin-right:6px">
                  {{tag.title}}
                  </el-tag>
                </div>
                <el-button @click="dialogVisible=true;wData.multiple=true" size="mini" icon="el-icon-plus">增加</el-button>
              </el-form-item>
              <el-form-item label="涉及系统：" prop="involvedInSystem">
                <el-tag v-for="tag in involve.sysWordArr" :key="tag.key" type="info" closable @close="handleClose5(tag)" size="small" style="margin-right:6px">
                  {{tag.label}}
                  </el-tag>
                <el-button @click="dialogVisible2=true" size="mini" icon="el-icon-plus">增加</el-button>
              </el-form-item>
              <el-form-item label="涉及表：">
                <el-tag v-for="tag in involve.tableWordArr" :key="tag.id" type="info" closable @close="handleClose4(tag)" size="small" style="margin-right:6px">
                  {{tag.code}}
                  </el-tag>
                <el-button @click="dialogVisible3=true" size="mini" icon="el-icon-plus">增加</el-button>
              </el-form-item>
              <el-form-item label="问题受理人：" prop="problemReceiver">
                <el-tag  type="info" closable @close="handleClose3" size="small" v-if="shouliName">
                  {{shouliName}}
                 </el-tag>
                <el-button @click="dialogVisible=true;wData.multiple=false" size="mini" icon="el-icon-plus" v-else>增加</el-button>
              </el-form-item>
              <el-form-item label="附加信息：">
                <a :href="api+'/kno/doc/downloadAttachFile.do?attachId='+ruleForm.accessory.attachId+'&token='+ token" v-if="ruleForm.accessory"  style="color: #2d8cf0;">{{ruleForm.accessory.attachName}}</a>
              </el-form-item>
            </el-form>
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
            <div class="form-btns">
                    <el-button type="default" ref="save" size="small" @click="handleSave('ruleForm')">保存</el-button>
                    <el-button type="primary" ref="submit" size="small" @click="handleSubmit('ruleForm')" :disabled="lock">提交</el-button>
            </div>
          </div>
        </el-card>
        <!-- 问题发起人///问题受理人 -->
        <el-dialog :title="wData.multiple?'请选择问题发起人':'请选择问题受理人'" :visible.sync="dialogVisible" width="30%" class="people-dialog">
          <div slot="" v-if="!wData.multiple && wData.filterTakerName" style="margin-bottom:10px;">
              已选择： <el-tag  type="info" size="small">
                      {{wData.filterTakerName}}
                      </el-tag>
          </div>
          <div slot="" v-if="wData.multiple && wData.filterSponsorArr.length > 0" class="tree-slot">
              已选择： <el-tag v-for="tag in wData.filterSponsorArr" :key="tag.userId" type="info" closable @close="handleClose(tag)">
                      {{tag.title}}
                      </el-tag>
          </div>
          <el-input placeholder="请输入内容" v-model="wData.wKeyword" @input="toSearch" clearable>
            <i slot="suffix" class="el-input__icon el-icon-search" ></i>
          </el-input>
          <el-tree
            class="filter-tree"
            :data="wData.problemTakerData"
            :props="wData.defaultProps"
            ref="tree" v-if="wData.treeSelect.length==0&&wData.multiple"
            node-key="userId"
            :highlight-current="true"
            @node-click="selectTreeValue"
            style="height: 200px;overflow:auto;">
          </el-tree>
          <el-tree
            class="filter-tree"
            :data="wData.problemTakerData2"
            :props="wData.defaultProps"
            :highlight-current="true"
            ref="tree" v-if="wData.treeSelect.length==0&&!wData.multiple"
            @node-click="selectTreeValue"
            style="height: 200px;overflow:auto;">
          </el-tree>
          <div class="tree-select-div people" v-if="wData.treeSelect.length>0">
              <div v-for="select in wData.treeSelect" :key="select.userId" class="item">
                  <p style="color:red;" v-if="!select.hasAuthority&&!wData.multiple">
                      {{select.title}}  （ {{ select.parent }} )
                  </p>
                  <p  v-if="wData.multiple||(select.hasAuthority&&!wData.multiple)" @click="selectTreeValue(select)">
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
        <!-- 涉及系统 -->
        <el-dialog title="添加涉及系统" :visible.sync="dialogVisible2" width="41%"  class="involve-system">
          <div style="text-align: center">
            <el-transfer
              style="text-align: left; display: inline-block"
              v-model="ruleForm.involvedInSystem"
              :data="involve.system"
              filterable
              :titles="['未选择系统', '已选择系统']"
              :button-texts="['到左边', '到右边']"
              @change="getsys">
            </el-transfer>
          </div>
        </el-dialog>
        <!-- 涉及表 -->
        <el-dialog title="添加涉及表" :visible.sync="dialogVisible3" width="550px"  class="involve-table">
          <el-form>
            <el-row :gutter="15">
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="involve.tableWord.sys" placeholder="请选择系统" size="small" @change="getSchema">
                      <el-option label="请选择" value=null ></el-option>
                      <el-option :label="item.label" :value="item.key" v-for="item in involve.system" :key="item.key" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-select v-model="involve.tableWord.table" placeholder="请选择Schema" @focus="ifData" size="small">
                      <el-option :label="item.code" :value="item.label" v-for="item in involve.table" :key="item.key" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item>
                  <el-input v-model="involve.tableWord.kWord" placeholder="请输入关键字..." size="small">
                    <i slot="suffix" class="el-icon-circle-close" v-if="involve.tableWord.kWord" @click="deleteSome"></i>
                  </el-input>
                </el-form-item>
              </el-col>
          </el-row>
          </el-form>
          <div class="table-box" v-loading="involve.bLoading">
            <div v-for="item in involve.tableList" :key="item.id" @click="goTokeyWord(item)" style="cursor: pointer">
              <p v-if="item.code===item.name">{{item.code}}</p>
              <p v-else>{{item.code+" ("+item.name+")"}}</p>
            </div>
            <p v-if="involve.tableList.length<1" style="text-align:center">暂无数据</p>
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="involve.currentpage"
              small
              layout="total, prev, pager, next"
              :total="involve.total">
            </el-pagination>

          </div>
        </el-dialog>
    </div>
</template>
<script>
import { get, post } from '@/utils/request'
import pinyin from 'pinyin'
import { getToken } from "@/utils/auth";

export default {
  name: 'verificationResults',
  components: { pinyin },
  data() {
    return {
      processId: null,
      questionId: null,
      caseId: null,
      taskId: null,
      // 提交请求传参接收
      ruleForm: {
        orderName: '',
        problemDescription: '',
        scopeInfluence: '',
        problemSources: '',
        problemLevel: '',
        expectDate: '',
        fileId: null,
        proInitiator: [],
        problemReceiver: ''
      },
      shouliName: '',

      // 控制不能为空
      rules: {
        orderName: [
          { required: true, message: '请输入工单名称', trigger: 'blur' }
        ],
        problemDescription: [
          { required: true, message: '问题描述不能为空', trigger: 'blur' }
        ],
        scopeInfluence: [
          { required: true, message: '影响范围不能为空', trigger: 'blur' }
        ],
        problemSources: [
          { required: true, message: '请选择问题来源', trigger: 'blur' }
        ],
        problemLevel: [
          { required: true, message: '请选择问题等级', trigger: 'blur' }
        ],
        involvedInSystem: [
          { required: true, message: '请选择涉及系统', trigger: 'blur' }
        ],
        problemReceiver: [
          { required: true, message: '请选择问题受理人', trigger: 'blur' }
        ]

      },
      // 跳转接收传参
      porpsData: {
        key: '',
        type: ''
      },
      // 问题发起人数据
      wData: {
        wKeyword: '',
        problemTakerData: [],
        problemTakerData2: [],
        treeSelect: [],
        multiple: true,
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        filterSponsorArr: [],
        pfilterSponsorArr: [],
        filterTakerName: '',
        filterTakerKey: '',
        porSou: [],
        porLevel: [],
        closable: true
      },
      // 涉及系统，表数据
      involve: {
        system: [],
        tableList: [],
        table: [],
        iftable: false,
        tableWord: {
          sys: '',
          table: '',
          kWord: ''
        },
        tableWordArr: [],
        sysWordArr: [],
        bLoading: false,
        currentpage: 1,
        total: ''
      },

      ifShow: {
        initiator: false
      },
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      limit: 1,
      api: '',
      upload: {
        caseType: '',
        attachType: 1
      },
      header: '',
      token: '',
      ischeck: false,
      lock: false// 防止提交按钮反复触发
    }
  },
  watch: {
    dialogVisible(val) {
      if (val === false) {
        // this.wData.filterSponsorArr = [];
        // this.wData.pfilterSponsorArr = [];
        this.wData.treeSelect = [];
        this.wData.wKeyword = '';
      }
    },
    ruleForm(val) {
      console.log(val)
    }
  },
  methods: {
    deleteSome() {
      this.involve.tableWord.kWord = '';
      this.involve.tableWordArr = []
    },
    goTokeyWord(val) {
      if (this.involve.tableWordArr.indexOf(val) === -1) {
        this.involve.tableWordArr.push(val);
        if (this.involve.tableWord.kWord) {
          this.involve.tableWord.kWord += ',' + val.code;
        } else {
          this.involve.tableWord.kWord = val.code
        }
      }
    },
    // 涉及表翻页
    handleCurrentChange(val) {
      this.involve.bLoading = true
      if (this.involve.tableWord.sys) {
        get('/md/queryRelaTables', {
          pageCurrent: this.involve.currentpage, pageSize: 10, instanceId: this.involve.tableWord.sys
        }).then(res => {
          console.log(res)
          this.involve.tableList = res.data.records;
          this.involve.bLoading = false;
          this.involve.total = res.data.total;
        })
        get('/md/getSystemOrSchema', { 'instanceId': this.involve.tableWord.sys }).then(res => {
          if (res.code === 10000 & res.success) {
            console.log(res, 'sch')
            this.involve.iftable = true
            this.involve.table = res.data;
          }
        })
      } else {
        get('/md/queryRelaTables', {
          pageCurrent: this.involve.currentpage, pageSize: 10
        }).then(res => {
          console.log(res)
          this.involve.tableList = res.data.records;
          this.involve.bLoading = false;
          this.involve.total = res.data.total;
        })
      }
    },
    // 获取问题来源下拉选项接口
    getProSou() {
      get('/sys/dict/listByCode', { keyword: 'SOURCE_CLASS' }).then(res => {
        if (res.code === 10000 && res.success) {
          this.wData.porSou = res.data;
        }
      })
      get('/sys/dict/listByCode', { keyword: 'QUESTION_LVL' }).then(res => {
        if (res.code === 10000 && res.success) {
          this.wData.porLevel = res.data;
        }
      })
    },
    // 树节点点击事件
    selectTreeValue(data) {
      // console.log(data, this.wData.pfilterSponsorArr)
      // data[0]['expand'] = true;
      const that = this;
      if (data) {
        if (data.hasOwnProperty("children")) {
          data.selected = false;
          console.log(data)
        } else {
          if (that.wData.multiple && data.userId !== undefined) { // 多选
            // 问题发起人
            if (that.wData.pfilterSponsorArr.indexOf(data.userId) === -1) {
              that.wData.filterSponsorArr.push(data);
              that.wData.pfilterSponsorArr.push(data.userId);
            }
          } else { // 单选
            // 问题受理人
            if (data.hasAuthority) {
              this.wData.filterTakerName = data['title'];
              this.wData.filterTakerKey = data['userId'];
              this.wData.wKeyword = data['title'];
            }
          }
        }
        // this.$refs.tree.setCurrentKey(that.wData.pfilterSponsorArr)
        // console.log(that.wData.filterSponsorArr)
      } else {
        this.wData.filterTakerName = '';
        this.wData.filterTakerKey = '';
        this.wData.wKeyword = '';

        // this.filterSponsorNames = '';
        // this.filterSponsorKeys = '';
        // this.filterSponsorArr = [];
      }
    },
    // 关闭标签事件
    handleClose(tag) {
      console.log(tag)
      this.wData.filterSponsorArr.splice(this.wData.filterSponsorArr.indexOf(tag), 1);
      this.wData.pfilterSponsorArr.splice(this.wData.pfilterSponsorArr.indexOf(tag.userId), 1);
    },
    handleClose2(tag) {
      console.log(this.wData.filterSponsorArr, this.wData.pfilterSponsorArr, this.ruleForm.proInitiator, tag)
      this.wData.filterSponsorArr.splice(this.wData.filterSponsorArr.indexOf(tag), 1);
      this.wData.pfilterSponsorArr.splice(this.wData.pfilterSponsorArr.indexOf(tag.userId), 1);
      this.ruleForm.proInitiator.splice(this.ruleForm.proInitiator.indexOf(tag), 1);
      console.log(this.wData.filterSponsorArr, this.ruleForm.proInitiator, tag)
    },
    handleClose3() {
      this.wData.filterTakerName = null;
      this.wData.filterTakerKey = null
      this.shouliName = null;
      console.log(this.wData.filterTakerName, this.shouliName)
    },
    handleClose4(tag) {
      this.involve.tableWordArr.splice(this.involve.tableWordArr.indexOf(tag), 1);
      this.involve.tableWord.kWord = null;
      this.involve.tableWordArr.map(val => {
        if (this.involve.tableWord.kWord) {
          this.involve.tableWord.kWord += ',' + val.code;
        } else {
          this.involve.tableWord.kWord = val.code
        }
      })
    },
    handleClose5(tag) {
      this.involve.sysWordArr.splice(this.involve.sysWordArr.indexOf(tag), 1);
      this.ruleForm.involvedInSystem.splice(this.ruleForm.involvedInSystem.indexOf(tag.key), 1);
    },
    getTable() {
      this.involve.bLoading = true
      get('/md/queryRelaTables', {
        pageCurrent: this.involve.currentpage, pageSize: 10
      }).then(res => {
        console.log(res)
        this.involve.tableList = res.data.records;
        this.involve.bLoading = false;
        this.involve.total = res.data.total;
      })
    },
    getSchema() {
      this.involve.bLoading = true
      console.log(this.involve.tableWord.sys)
      if (this.involve.tableWord.sys) {
        get('/md/queryRelaTables', {
          pageCurrent: this.involve.currentpage, pageSize: 10, instanceId: this.involve.tableWord.sys
        }).then(res => {
          console.log(res)
          this.involve.tableList = res.data.records;
          this.involve.bLoading = false;
          this.involve.total = res.data.total;
        })
        get('/md/getSystemOrSchema', { 'instanceId': this.involve.tableWord.sys }).then(res => {
          if (res.code === 10000 & res.success) {
            console.log(res, 'sch')
            this.involve.iftable = true
            this.involve.table = res.data;
          }
        })
      }
    },
    getInvolve() {
      get('/md/getSystemOrSchema', { 'instanceId': null }).then(res => {
        if (res.code === 10000 & res.success) {
          let data = res.data;
          data.map((val, key) => {
            this.involve.system.push({
              key: val.id,
              label: val.name
            })
          })
          // this.involve.system = res.data;
        }
      })
    },
    getsys() {
      this.involve.sysWordArr = []
      this.involve.system.map(res => {
        if (this.ruleForm.involvedInSystem.indexOf(res.key) > -1) {
          this.involve.sysWordArr.push(res)
        }
      })
      console.log(this.ruleForm.involvedInSystem)
    },
    ifData() {
      if (this.involve.table.length < 1 && this.involve.iftable === false) {
        this.$message({
          message: '请先选择系统',
          type: 'warning'
        });
      }
    },
    handleChange(res, resArr) {
      if (res.status === 'success' && res.response.code === 10000) {
        this.$message({
          message: '上传成功',
          type: 'success'
        });
        this.ruleForm.fileId = res.response.data.attachId;
      }
    },
    handleRemove(res, resArr) {
      this.ruleForm.fileId = null;
    },
    handleSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let proInitiator = [];
          let sys = [];
          let table = [];
          console.log(this.ruleForm.proInitiator, 'this.ruleForm.proInitiator')
          this.ruleForm.proInitiator.map(res => {
            proInitiator.push(res.userId)
          })
          this.ruleForm.involvedInSystem.map(val => {
            sys.push(val)
          })
          this.involve.tableWordArr.map(val => {
            table.push(val.id)
          })
          let params = {
            regAttachId: this.ruleForm.fileId,
            caseName: this.ruleForm.orderName,
            categoryId: this.porpsData.key,
            checkUserId: this.ruleForm.problemReceiver,
            endDate: this.ruleForm.expectDate,
            noteMessage: null,
            systemIds: sys.join(','),
            userIds: proInitiator.join(','),
            sourceClass: this.ruleForm.problemSources,
            questionDesc: this.ruleForm.problemDescription,
            questionLvl: this.ruleForm.problemLevel,
            impactScope: this.ruleForm.scopeInfluence,
            relaTableIds: table.join(','),
            questionId: this.questionId
          }
          console.log(params)
          if (this.$route.params.type === 'again') {
            post('/home/matter/updateProblemInfo', params).then(res => {
              console.log(res, 'yyy')
              if (res.code === 10000) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.closeSelectedTag(this.$route)
              } else {
                this.$message.error(res.message);
              }
            })
          } else {
            post('/home/matter/addProblemCase', params).then(res => {
              console.log(res, 'yyy')
              if (res.code === 10000) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.closeSelectedTag(this.$route)
              } else {
                this.$message.error(res.message);
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let proInitiator = [];
          let sys = [];
          let table = [];
          this.ruleForm.proInitiator.map(res => {
            proInitiator.push(res.userId)
          })
          this.ruleForm.involvedInSystem.map(val => {
            sys.push(val)
          })
          this.involve.tableWordArr.map(val => {
            table.push(val.id)
          })
          let params = {
            regAttachId: this.ruleForm.fileId,
            caseName: this.ruleForm.orderName,
            categoryId: this.porpsData.key,
            checkUserId: this.ruleForm.problemReceiver,
            endDate: this.ruleForm.expectDate,
            noteMessage: 'check',
            systemIds: sys.join(','),
            userIds: proInitiator.join(','),
            sourceClass: this.ruleForm.problemSources,
            questionDesc: this.ruleForm.problemDescription,
            questionLvl: this.ruleForm.problemLevel,
            impactScope: this.ruleForm.scopeInfluence,
            relaTableIds: table.join(','),
            questionId: this.questionId,
            taskId: this.taskId,
            caseId: this.caseId,
            processId: this.processId
          }
          if (this.$route.params.type === 'again' || this.$route.params.type === 'detail_continue' || this.$route.params.type === 'detail') {
            if (this.$route.params.type === 'detail_continue') {
              params.noteMessage = this.$route.params.type;
            }
            if (this.$route.params.type === 'detail') {
              params.noteMessage = this.$route.params.type;
            }
            this.lock = true;
            post('/home/matter/updateProblemInfo', params).then(res => {
              console.log(res, 'yyy')
              if (res.code === 10000) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
              } else {
                this.$message.error(res.message);
              }
              this.closeSelectedTag(this.$route)

              this.lock = false;
            })
          } else {
            this.lock = true;
            post('/home/matter/addProblemCase', params).then(res => {
              console.log(res, 'yyy')
              if (res.code === 10000) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
              } else {
                this.$message.error(res.message);
              }
              this.closeSelectedTag(this.$route)

              this.lock = false;
            })
          }
        } else {
          return false;
        }
      });
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          console.log(views)
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/ds/applicationStandard/dimensionality')
          }
        }
      })
    },
    // 获取受理人等数据列表
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
          console.log(that.wData.problemTakerData2)
          console.log(that.wData.problemTakerData)
          // that.setTreeValueMap();
        }
      })
    },
    sure() {
      if (this.wData.multiple) {
        this.ifShow.initiator = true;
        this.ruleForm.proInitiator = JSON.parse(JSON.stringify(this.wData.filterSponsorArr));
      } else if (!this.wData.multiple) {
        this.ruleForm.problemReceiver = this.wData.filterTakerKey;
        this.shouliName = this.wData.filterTakerName;
      }

      this.dialogVisible = false;
    },
    toSearch() {
      console.log(this.wData.wKeyword)
      var str
      var pattern = new RegExp("[\u4E00-\u9FA5]+");
      var pattern2 = new RegExp("[A-Za-z]+");
      if (!this.wData.wKeyword) {
        this.wData.treeSelect = [];
      }
      if (pattern.test(this.wData.wKeyword)) {
        str = '中文'
      } else if (pattern2.test(this.wData.wKeyword)) {
        str = '英文'
      }
      console.log(str)
      if (str === '英文') {
        this.eSearch()
      } else if (str === '中文') {
        this.showTree();
      } else {
        this.wData.treeSelect = [];
      }
    },
    showTree() {
      let selectArr = [];
      let res = this.wData.problemTakerData;
      console.log(res)
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
      console.log(selectArr);
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
      console.log(res)
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
      console.log(selectArr)
      this.wData.treeSelect = selectArr;
    }
  },
  created() {
    console.log(this.$route.params)
    if (this.$route.params.type === 'again') {
      get('/home/matter/queryProblemInfoes', {
        questionId: this.$route.params.questionId
      }).then(res => {
        let data = res.data;
        this.ruleForm = {
          orderName: data.caseName,
          problemDescription: data.questionDesc,
          scopeInfluence: data.impactScope,
          problemSources: data.sourceClass,
          expectDate: data.endDate,
          problemReceiver: data.checkUser,
          accessory: data.attachInfoes,
          problemLevel: data.questionLvl
        }
        // 涉及表回显
        this.involve.tableWordArr = [];
        this.involve.tableWord.kWord = null;
        if (data.relaTables && data.relaTables.length > 0) {
          data.relaTables.map(val => {
            let obj = {
              code: val.instanceCode,
              id: val.instanceId,
              name: val.instanceName
            }
            this.involve.tableWordArr.push(obj);
            if (this.involve.tableWord.kWord) {
              this.involve.tableWord.kWord += ',' + val.instanceCode;
            } else {
              this.involve.tableWord.kWord = val.instanceCode
            }
          })
        }

        // 涉及系统回显
        this.involve.sysWordArr = [];
        this.ruleForm.involvedInSystem = [];
        data.systemInfos.map(val => {
          let obj = {
            key: val.sysCode,
            label: val.sysName
          }
          this.involve.sysWordArr.push(obj);
          this.ruleForm.involvedInSystem.push(val.sysCode)
        })
        // 发起人
        if (data.initiators.length > 0) {
          let arr = []
          data.initiators.map(val => {
            let a = {
              title: val.sysName,
              userId: val.sysCode
            }
            arr.push(a)
            this.wData.filterSponsorArr = arr;
            this.ruleForm.proInitiator = arr;
          })
          this.ifShow.initiator = true;
        }
        this.wData.filterTakerKey = data['checkUser']['userId'];
        this.wData.filterTakerName = data['checkUser']['username'];
        this.wData.multiple = false;
        this.sure();
        this.wData.multiple = true;
        if (data.attachInfoes.length > 0) {
          data.attachInfoes.map(val => {
            if (val.type === '1') {
              this.ruleForm.accessory = val
            }
          })
        }
      })
    } else {
      this.porpsData.type = this.$route.params.type;
    }

    if (this.porpsData.type === 'detail' || this.porpsData.type === 'detail_continue') {
      get('/home/matter/queryProblemInfoes', {
        questionId: this.$route.params.questionId
      }).then(res => {
        let data = res.data;
        this.ruleForm = {
          orderName: data.caseName,
          problemDescription: data.questionDesc,
          scopeInfluence: data.impactScope,
          problemSources: data.sourceClass,
          expectDate: data.endDate,
          // problemInitiator: data.initiators,
          involvedSystem: data.systemInfos,
          inTable: data.relaTables,
          problemReceiver: data.checkUser,
          accessory: data.attachInfoes,
          problemLevel: data.questionLvl
        }
        // 涉及表回显
        this.involve.tableWordArr = [];
        this.involve.tableWord.kWord = null;
        if (data.relaTables && data.relaTables.length > 0) {
          data.relaTables.map(val => {
            let obj = {
              code: val.instanceCode,
              id: val.instanceId,
              name: val.instanceName
            }
            this.involve.tableWordArr.push(obj);
            if (this.involve.tableWord.kWord) {
              this.involve.tableWord.kWord += ',' + val.instanceCode;
            } else {
              this.involve.tableWord.kWord = val.instanceCode
            }
          })
        }
        // 涉及系统回显
        this.involve.sysWordArr = [];
        this.ruleForm.involvedInSystem = [];
        data.systemInfos.map(val => {
          let obj = {
            key: val.sysCode,
            label: val.sysName
          }
          this.involve.sysWordArr.push(obj);
          this.ruleForm.involvedInSystem.push(val.sysCode)
        })
        if (data.initiators.length > 0) {
          let arr = []
          data.initiators.map(val => {
            let a = {
              title: val.sysName,
              userId: val.sysCode
            }
            arr.push(a)
            this.ruleForm.proInitiator = arr;
            this.wData.filterSponsorArr = arr
          })
          this.ifShow.initiator = true;
        }
        this.wData.filterTakerKey = data['checkUser']['userId'];
        this.wData.filterTakerName = data['checkUser']['username'];
        this.wData.multiple = false;
        this.sure();
        this.wData.multiple = true;
        if (data.attachInfoes.length > 0) {
          data.attachInfoes.map(val => {
            if (val.type === '1') {
              this.ruleForm.accessory = val
            }
          })
        }
      })
    }
    this.porpsData.key = this.$route.params.key;
    this.upload.caseType = this.$route.params.key;
    this.caseId = this.$route.params.cid ? this.$route.params.cid : null;
    this.taskId = this.$route.params.tid ? this.$route.params.tid : null;
    this.questionId = this.$route.params.questionId ? this.$route.params.questionId : null;
    this.processId = this.$route.params.pid ? this.$route.params.pid : null;
    this.getProSou();
    this.getProblemInitiator();
    this.getInvolve();
    this.getTable();
    this.api = process.env.BASE_API;
    this.header = {
      "X-Token": getToken()
    };
    this.token = getToken()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
 @import "../../styles/variables";
  @import "../../styles/treeIcon";
  @import './../../styles/dq/main-card-table.scss';
  .verification-container{
    padding:10px;
    .essential-information-w{
      .el-card__body{
        padding:0;
        border-bottom:1px solid #e8eaec;
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
                  min-height: 90px;
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
        .form-btns{
          padding: 10px 0;
          border-top: 1px solid #ddd;
          text-align: center;
        }
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
            p{
              margin:5px 0;
            }
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
    .involve-system{
      .el-dialog{
        border-radius: 5px;
      }
      .el-dialog__header{
        padding:12px 0;
        border-bottom:1px solid #e8eaec;
        .el-dialog__title{
          font-size: 16px;
          font-weight: 700;
          margin-left:30px;
        }
      }
    }
    .involve-table{
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
        padding:15px 20px;
        .el-form-item{
          margin-bottom:8px;
        }
        .table-box{
          padding-left:5px;
          .el-pagination.el-pagination--small{
            text-align: center;
          }
        }
      }
    }
  }
  </style>
