<template>
  <div style="padding:13px;">
    <el-card shadow="hover" class="card-container">
      <el-row :gutter="30">
        <el-col :span="5" v-for=" item in oDataProblemSysScatter.matterCount" :key="item.name">
          <div class="card-item" >
            <img :src="item.img">
            <div class="card-item-text">
              <p>{{item.name}}</p>
              <p style="color:red;" v-if="item.name==='预警'">{{item.count}}</p>
              <p v-else>{{item.count}}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="hover" class="card-body">
      <div class="card-body-header">
        <el-radio-group size="mini"  v-model="oDataProblemSysScatter.sFilter" @change="changeview">
          <el-radio-button label="工单列表">工单列表</el-radio-button>
          <el-radio-button label="待发工单">待发工单</el-radio-button>
        </el-radio-group>
      </div>
      <div class="card-body-item">
        <div class="card-search">
          <el-form :inline="true" :model="formData" class="demo-form-inline" size="mini">
            <el-form-item label="工单类型：">
              <el-select v-model="formData.orderType" placeholder="请选择" clearable>
                <el-option :label="item.dictName" :value="item.dictValue" v-for="item in wData.orderTypeA" :key="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工单状态：" v-if="oDataProblemSysScatter.sFilter==='工单列表'">
              <el-select v-model="formData.orderStatus" placeholder="请选择" @change="changeType" >
                <el-option label="进行中" value="0"></el-option>
                <el-option label="已关闭" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="我的角色：">
              <el-select v-model="formData.myCharacter" placeholder="请选择" clearable>
                <el-option label="发起人" value="发起人"></el-option>
                <el-option label="经办人" value="经办人"></el-option>
                <el-option label="主办人" value="主办人"></el-option>
                <el-option label="协办人" value="协办人"></el-option>
                <el-option label="参阅人" value="参阅人"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  :label="oDataProblemSysScatter.sFilter==='工单列表'?'提交日期：':'保存日期：'">
              <el-date-picker v-model="formData.date"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            size="mini" clearable
                            @change="getTimeData"></el-date-picker>
            </el-form-item>
            <el-form-item class="left25" label="工单名称：">
              <el-input v-model="formData.orderName" placeholder="请输入关键字..." clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="which">查询</el-button>
            </el-form-item>
            <!-- <el-form-item class="left25">
              <el-button @click="onBackSubmit">重置</el-button>
            </el-form-item> -->
          </el-form>
        </div>
        <div class="card-body-table">
          <div v-if="oDataProblemSysScatter.sFilter==='工单列表'">
            <el-table :data="wData.tableData" style="width: 100%" :header-cell-style="{background:'#f8f8f9'}" class="table1"
                      v-loading="oDataProblemSysScatter.bLoading" key='1' size="small">
              <el-table-column prop="caseName" label="工单名称" width="180" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="taskName" label="任务名称" width="200" sortable v-if="formData.orderStatus==='0'&&!oDataProblemSysScatter.bLoading">
              </el-table-column>
              <el-table-column prop="categoryName" label="工单类型" width="160" sortable>
              </el-table-column>
              <el-table-column prop="userRole" label="我的角色"  sortable>
              </el-table-column>
              <el-table-column prop="taskTime" label="流转日期"  sortable>
                <template slot-scope="scope">{{scope.row.taskTime?scope.row.taskTime.split(' ')[0] : ''}}</template>
              </el-table-column>
              <el-table-column prop="createTime" label="提交日期"  sortable>
                <template slot-scope="scope">{{scope.row.createTime?scope.row.createTime.split(' ')[0]: ''}}</template>
              </el-table-column>
              <el-table-column prop="endTime" label="截止日期"  sortable>
              </el-table-column>
              <el-table-column  label="工单状态" align="center">
                <template slot-scope="scope">
                      <el-button type="danger" v-show="scope.row.caseStatus==='进行中'">进行中</el-button>
                      <el-button type="success" v-show="scope.row.caseStatus==='已关闭'">已关闭</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                  <div class="funKey">
                    <el-tooltip class="item" effect="dark" content="立即办理" placement="bottom">
                      <el-button   @click="goToSeeV(scope.row.noteMessage,scope.row,scope.row.categoryKey)" type="text" size="small" v-if="!scope.row.notMyTask&&scope.row.caseStatus==='进行中'">
                        <svg-icon icon-class="editor" class="editor"></svg-icon>
                      </el-button>
                      <el-button   @click="handleCommand(scope.row)" type="text" size="small" v-if="scope.row.notMyTask==='1'||scope.row.caseStatus==='已关闭'">
                        <svg-icon icon-class="noEditor" class="noEditor"></svg-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="查看流程" placement="bottom">
                      <el-button   @click="goToProcess(scope.row)" type="text" size="small" >
                        <svg-icon icon-class="flow" class="flow"></svg-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="查看明细" placement="bottom">
                      <el-button @click="goToParticulars(scope.row)" type="text" size="small" >
                        <svg-icon icon-class="preview" class="preview"></svg-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="撤回" placement="bottom" v-if="scope.row.rollBack&&scope.row.categoryKey !== 'STANDARD_RELEASE'">
                      <el-button @click="goToRevocation(scope.row)" type="text" size="small" >
                        <svg-icon icon-class="recall" class="recall"></svg-icon>
                      </el-button>
                    </el-tooltip>
                    <!-- <el-tooltip class="item" effect="dark" content="立即办理" placement="bottom">
                      <i class="immediately"  v-if="!scope.row.notMyTask&&scope.row.caseStatus==='进行中'"
                       @click="goToSeeV(scope.row.noteMessage,scope.row,scope.row.categoryKey)"
                       ></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="立即办理" placement="bottom">
                      <i class="noImmediately"  v-if="scope.row.notMyTask==='1'||scope.row.caseStatus==='已关闭'" ></i>
                    </el-tooltip> -->
                    <!-- <el-tooltip class="item" effect="dark" content="查看流程" placement="bottom">
                      <i class="flow" @click="goToProcess(scope.row)"></i>
                    </el-tooltip> -->
                    <!-- <el-tooltip class="item" effect="dark" content="查看明细" placement="bottom">
                      <i class="detail" @click="goToParticulars(scope.row)"></i>4
                    </el-tooltip> -->
                    <!-- <el-tooltip class="item" effect="dark" content="撤回" placement="bottom">
                      <i class="back" v-if="scope.row.rollBack"
                      @click="goToRevocation(scope.row)"></i>
                    </el-tooltip> -->
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="oDataProblemSysScatter.sFilter==='待发工单'">
              <el-table :data="wData.tableData"  style="width: 100%" :header-cell-style="{background:'#f8f8f9'}" class="table2"
                      v-loading="oDataProblemSysScatter.bLoading" key='11' size="small">
                <el-table-column prop="caseName" label="工单名称"  sortable>
                </el-table-column>
                <el-table-column prop="categoryName" label="工单类型"  sortable>
                </el-table-column>
                <el-table-column prop="userRole" label="我的角色"  sortable>
                </el-table-column>
                <el-table-column prop="createTime" label="保存时间"  sortable>
                  <template slot-scope="scope">{{scope.row.createTime}}</template>
                </el-table-column>
                <el-table-column  label="操作" align="center">
                  <template slot-scope="scope">
                  <div class="funKey">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                      <el-button   @click="goToSeeV(scope.row.noteMessage,scope.row,scope.row.categoryKey)" type="text" size="small">
                        <svg-icon icon-class="editor" class="editor"></svg-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="发起" placement="bottom">
                      <el-button   @click="goToStart(scope.row)" type="text" size="small">
                        <svg-icon icon-class="start" class="start"></svg-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                      <el-button   @click="goToDel(scope.row)" type="text" size="small">
                        <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                      </el-button>
                    </el-tooltip>
                   <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                      <i class="dImmediately"
                       @click="goToSeeV(scope.row.noteMessage,scope.row,scope.row.categoryKey)"
                       ></i>
                    </el-tooltip> -->
                    <!-- <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                      <i class="delete" ></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="发起" placement="bottom">
                      <i class="start"
                      @click="goToStart(scope.row)"></i>
                    </el-tooltip> -->
                  </div>
                </template>
                </el-table-column>
              </el-table>
          </div>

        </div>
        <div style="margin-top:10px;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                          :current-page="formData.currentPage" :page-sizes="[10,20,30]" :page-size="formData.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="oDataProblemSysScatter.total" style="text-align: center;">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <div class="foldButton" >
      <transition name="toTop" class="toTop">
        <div  class="eb-div" v-show="classActive.iClass" >
          <span v-for='item in getKeyAndName' :key="item.key">
            <span class="txt"  @click="goToSeeV('first','',item.key)" v-if="item.key!=='STANDARD_RELEASE'">{{item.typeName}}</span>
            <span class="txt" @click="goToRelease" v-else-if="item.key==='STANDARD_RELEASE'">{{item.typeName}}</span>
          </span>
        </div>
      </transition>
      <div class="eb-icon" @click="classActive.iClass=!classActive.iClass">
        <i :class="[classActive.iClass?'el-icon-minus':'el-icon-plus']"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { get, post } from '@/utils/request'
export default {
  name: 'MY_MATTER',
  data() {
    return {
      oDataProblemSysScatter: {
        sFilter: '工单列表',
        bLoading: false,
        total: 0,
        matterCount: [{ name: '预警', count: '', img: require('../../assets/images/desktop/icon-matter-willoverdue.png') },
          { name: '待办', count: '', img: require('../../assets/images/desktop/icon-matter-todo.png') },
          { name: '在办', count: '', img: require('../../assets/images/desktop/icon-matter-doing.png') },
          { name: '已办', count: '', img: require('../../assets/images/desktop/icon-matter-done.png') },
          { name: '逾期', count: '', img: require('../../assets/images/desktop/icon-matter-overdue.png') }
        ]

      },
      formData: {
        orderType: null,
        orderStatus: '0',
        myCharacter: null,
        date: '',
        orderName: null,
        locking: true,
        pageCurrent: 1,
        pageSize: 10

      },
      wData: {
        tableData: [],
        orderTypeA: ''
      },
      classActive: {
        divClass: false,
        iClass: false
      },
      getKeyAndName: [],
      dataTime: '',
      locking: true
    }
  },
  methods: {
    // 标准发布跳转
    goToRelease() {
      this.$router.push({ name: 'releaseObject' })
    },
    changeType(val) {
      console.log(val)
      this.formData.pageCurrent = 1;
      this.oDataProblemSysScatter.bLoading = true;
      this.onSubmit();
    },
    // 跳转到详情
    goToParticulars(item) {
      // console.log(1111111111111)
      console.log(item, 'item')
      if (item.categoryKey === "STANDARD_RELEASE" && item.caseStatus === '已关闭') {
        this.$router.push({ name: 'detailsInformation', params: { cid: item.caseId, Status: item.caseStatus }})
      } else if (item.categoryKey === "STANDARD_RELEASE") {
        this.$router.push({ name: 'detailsInformation', params: { cid: item.caseId, type: item.noteMessage, notMyTask: item.notMyTask ? item.notMyTask : false }})
      } else {
        this.$router.push({ name: 'particulars', query: {
          bid: item.businessId, type: item.caseStatus === '已关闭' ? '已关闭' : item.noteMessage, pid: item.processId
        }})
      }
    },
    // 跳转到流程明细
    goToProcess(item) {
      console.log(item)
      this.$router.push({ name: 'process', query: {
        id: item.processId
      }})
    },
    which() {
      this.formData.pageCurrent = 1;
      if (this.oDataProblemSysScatter.sFilter === '工单列表') {
        this.onSubmit();
      } else if (this.oDataProblemSysScatter.sFilter === '待发工单') {
        this.getData();
      }
    },
    changeview() {
      this.onBackSubmit()
      if (this.oDataProblemSysScatter.sFilter === '工单列表') {
        this.onSubmit();
      } else if (this.oDataProblemSysScatter.sFilter === '待发工单') {
        this.getData();
      }
    },
    handleCurrentChange(val) {
      this.formData.pageCurrent = val;
      if (this.oDataProblemSysScatter.sFilter === '工单列表') {
        this.onSubmit();
      } else if (this.oDataProblemSysScatter.sFilter === '待发工单') {
        this.getData();
      }
    },
    handleSizeChange(val) {
      console.log(val, this.formData.pageSize)
      this.formData.pageSize = val;
      if (this.oDataProblemSysScatter.sFilter === '工单列表') {
        this.onSubmit();
      } else if (this.oDataProblemSysScatter.sFilter === '待发工单') {
        this.getData();
      }
    },
    onSubmit() {
      // console.log(this.formData)

      if (this.formData.locking) {
        this.oDataProblemSysScatter.bLoading = true;
        this.formData.locking = false;
        if (this.formData.date && this.formData.date[0] && this.formData.date[1]) {
          this.formData.date[0] = this.formData.date[0] + ' 00:00:00'
          this.formData.date[1] = this.formData.date[1] + ' 00:00:00'
        }
        let params = {
          'caseName': this.formData.orderName,
          'caseStatus': this.formData.orderStatus,
          'category': this.formData.orderType,
          'firstTime': this.formData.date ? this.formData.date[0] : '',
          'secondTime': this.formData.date ? this.formData.date[1] : '',
          'pageCurrent': this.formData.pageCurrent,
          'pageSize': this.formData.pageSize,
          'userRole': this.formData.myCharacter
        }
        console.log(this.formData.myCharacter)
        console.log(this.formData.orderType)
        if (this.formData.myCharacter === 'null') {
          delete params['userRole'];
        }
        if (this.formData.orderType === 'null') {
          delete params['category'];
        }
        console.log(params)
        get('/home/matter/queryTaskList', params).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.wData.tableData = res.data.records;
            this.oDataProblemSysScatter.total = +res.data.total;
          }
          this.formData.locking = true;
          this.oDataProblemSysScatter.bLoading = false;
        })
      } else if (this.formData.locking === false) {
        this.oDataProblemSysScatter.bLoading = false;
        this.tips();
      }
    },
    getData() {
      if (this.formData.locking) {
        this.oDataProblemSysScatter.bLoading = true;
        this.formData.locking = false;
        if (this.formData.date && this.formData.date[0] && this.formData.date[1]) {
          this.formData.date[0] = this.formData.date[0] + ' 00:00:00'
          this.formData.date[1] = this.formData.date[1] + ' 00:00:00'
        }
        let params = {
          caseName: this.formData.orderName,
          category: this.formData.orderType,
          firstTime: this.formData.date ? this.formData.date[0] : '',
          secondTime: this.formData.date ? this.formData.date[1] : '',
          pageCurrent: this.formData.pageCurrent,
          pageSize: this.formData.pageSize,
          userRole: this.formData.myCharacter
        }
        if (this.formData.myCharacter === 'null') {
          delete params['userRole'];
        }
        if (this.formData.orderType === 'null') {
          delete params['category'];
        }
        // console.log(params)
        get('/home/matter/queryNotStartCaseDetail', params).then(res => {
          console.log(res)
          if (res.code === 10000 && res.success === true) {
            this.wData.tableData = res.data.records;
            this.oDataProblemSysScatter.total = +res.data.total;
          }
          this.formData.locking = true;
          this.oDataProblemSysScatter.bLoading = false;
        })
      } else if (this.formData.locking === false) {
        this.tips();
      }
    },
    goToSeeV(type, item = null, key = null) {
      console.log(type, item)
      if (item && type !== undefined) {
        post('/home/matter/addTaskStartTime', {
          taskId: item.taskId
        }).then(res => {})
      }

      var name
      if (type === 'first') { // 初次创建
        this.$router.push({ name: 'verificationResults', params: {
          type: type, key: key, titlename: name
        }})
      } else if (type === undefined) {
        // console.log(item.caseId, 'item.caseId')
        if (key === 'STANDARD_RELEASE') {
          this.$router.push({ name: 'releaseObject', params: {
            cid: item.caseId
          }})
        } else {
          this.$router.push({
            name: 'verificationResults',
            params: {
              type: 'again', questionId: item.businessId, key: key, cid: item.caseId
            }})
        }
      } else if (type === 'check') {
        if (key === 'STANDARD_RELEASE') {
          this.$router.push({ name: 'approve', params: { cid: item.caseId, tid: item.taskId }})
        } else {
          this.$router.push({ name: 'problemDefinition', params: {
            type: type, questionId: item.businessId, cid: item.caseId, tid: item.taskId, pid: item.processId, key: key
          }})
        }
      } else if (type === 'detail') { // 撤回后发起人修改
        this.$router.push({ name: 'verificationResults', params: {
          type: type, key: key, titlename: name, cid: item.caseId, tid: item.taskId, questionId: item.businessId, pid: item.processId
        }})
      } else if (type === 'detail_continue') {
        this.$router.push({ name: 'verificationResults', params: {
          type: type, key: key, titlename: name, tid: item.taskId, questionId: item.businessId, cid: item.caseId, pid: item.processId
        }})
      } else if (type === 'handle') {
        name = '问题处理'
        this.$router.push({ name: 'problemDefinition', params: {
          type: type, questionId: item.businessId, titlename: name, cid: item.caseId, tid: item.taskId, pid: item.processId, key: key
        }})
      } else if (type === 'confirm') {
        if (key === 'STANDARD_RELEASE') {
          this.$router.push({ name: 'detailsInformation', params: { cid: item.caseId, tid: item.taskId, type: type }})
        } else {
          name = '结果核查'
          this.$router.push({ name: 'problemDefinition', params: {
            type: type, questionId: item.businessId, titlename: name, cid: item.caseId, tid: item.taskId, pid: item.processId, key: key
          }})
        }
      } else if (type === 'backHandle') {
        name = '结果驳回'
        this.$router.push({ name: 'problemDefinition', params: {
          type: type, questionId: item.businessId, titlename: name, cid: item.caseId, tid: item.taskId, pid: item.processId, key: key
        }})
      } else if (type === 'busConfirm') {
        name = '结果反馈'
        this.$router.push({ name: 'problemDefinition', params: {
          type: type, questionId: item.businessId, titlename: name, cid: item.caseId, tid: item.taskId, pid: item.processId, key: key
        }})
      } else if (type === 'back') {
        if (key === 'STANDARD_RELEASE') {
          this.$router.push({ name: 'detailsInformation', params: { cid: item.caseId, tid: item.taskId, type: type }})
        } else {
          name = '问题驳回'
          this.$router.push({ name: 'problemDefinition', params: {
            type: type, questionId: item.businessId, titlename: name, cid: item.caseId, tid: item.taskId, pid: item.processId, key: key
          }})
        }
      }
    },
    goToRevocation(item) {
      console.log(item)
      this.$confirm('是否撤回到上一个任务节点?', '确认撤回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        post('/home/matter/rollBackQue', {
          noteMessage: item.noteMessage,
          processId: item.processId,
          taskId: item.taskId
        }).then(res => {
          if (res.message === '撤回成功') {
            this.$message({
              type: 'success',
              message: '撤回成功!'
            });
            this.onSubmit();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    goToStart(item) {
      console.log(item)
      if (item.categoryKey === 'STANDARD_RELEASE') {
        if (item.caseId) {
          if (this.locking) {
            this.locking = false
            get('/home/matter/stdrelease/quickStart', { caseId: item.caseId }).then(res => {
              if (res.success && res.code === 10000) {
                this.$message({
                  type: 'success',
                  message: '发起工单成功!'
                });
                this.getData();
                this.locking = true
              }
            })
          }
        }
      } else {
        if (item.caseId && item.businessId) {
          if (this.locking) {
            this.locking = false
            post('/home/matter/startProblemManage', {
              caseId: item.caseId,
              questionId: item.businessId
            }).then(res => {
              if (res.message === "开启问题处理流程成功") {
                this.$message({
                  type: 'success',
                  message: '发起工单成功!'
                });
                this.getData();
                this.locking = true
              }
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请完善您的工单内容!'
          });
        }
      }
    },
    goToDel(item) {
      console.log(item);
      this.$confirm('确定要删除这条工单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        post('/home/matter/deleteNotStartCaseDetail', {
          businessId: item.businessId,
          caseId: item.caseId,
          caseType: item.categoryKey
        }).then(res => {
          if (res.message === "删除待发活动成功") {
            this.$message({
              type: 'success',
              message: '工单删除成功!'
            });
            this.getData();
            this.locking = true
          }
        })
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    tips() {
      this.$message({
        showClose: true,
        message: '请勿重复提交',
        type: 'warning'
      });
    },
    getkey() {
      get('/home/matter/queryAuthorityOfCase').then(res => {
        console.log(res, 11)
        this.getKeyAndName = res.data
        console.log(this.getKeyAndName)
      })
    },
    onBackSubmit() {
      this.formData = {
        orderType: null,
        orderStatus: '0',
        myCharacter: null,
        date: '',
        orderName: null,
        locking: true,
        pageCurrent: 1,
        pageSize: 10

      }
    },
    getTimeData(val) {
      // console.log(val)
      // if (val === null) {
      //   console.log('nulla')
      this.dataTime = val
      // }
    },
    getOrderType() {
      get('/sys/dict/listByCode', { keyword: 'CATEGORY_ID' }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.wData.orderTypeA = res.data;
        }
      })
    },
    getMatterCount() {
      get('/home/matter/queryMatterCounts').then(res => {
        console.log(res, 'res')
        if (res.code === 10000 && res.success) {
          let data = res.data;
          this.oDataProblemSysScatter.matterCount.map(val => {
            if (val.name === '预警') {
              val.count = data.overdueWarnCount
            } else if (val.name === '待办') {
              val.count = data.waitTaskCount
            } else if (val.name === '在办') {
              val.count = data.doingTaskCount
            } else if (val.name === '已办') {
              val.count = data.finishTaskCount
            } else if (val.name === '逾期') {
              val.count = data.overdueCount
            }
          })
        }
      })
    }
  },
  created() {
    this.getMatterCount();
    this.getkey();
    this.getOrderType();
    this.onSubmit();
    if (this.$route.query.porpos) {
      // console.log('wwwwwwwwwww')
      // console.log(this.$route.query.type, 'type')
      let data = {
        type: this.$route.query.type,
        questionId: this.$route.query.questionId,
        titlename: '问题处理',
        cid: this.$route.query.cid,
        tid: this.$route.query.tid,
        pid: this.$route.query.pid,
        key: this.$route.query.key
      }
      console.log(this.$route.query.type, 'type')
      this.$router.push({ name: 'problemDefinition', params: data })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
 @import "../../styles/variables";
  @import "../../styles/treeIcon";
  @import './../../styles/dq/main-card-table.scss';
  .card-container{
    .el-card__body{
      padding: 16px 25px;
      .el-row{
        display: flex;
        display: -webkit-flex;
        .el-col{
        margin: 0 15px;
        border: 1px solid #f5f5f5;
        position: relative;
        padding: 10px;
        text-align: center;
        width: 17.6%;
        .card-item{
          flex: 1;
         -webkit-flex: 1;
         img{
           display: inline-block;
           width: 50px;
           height: 50px;
           border-radius: 50%;
         }
         .card-item-text{
           display: inline-block;
           margin-left: 38%;
           text-align: center;
            vertical-align: top;
            margin-top: 8px;
           p:nth-of-type(1){
             font-size: 14px;
             color: #999;
           }
           p:nth-of-type(2){
             font-size: 20px;
            color: #444;
            font-weight: bold;
           }
           p{
             margin: 0;
           }
         }
          }
      }
      }


    }
  }
  .card-body{
    margin-top:15px;
    .card-body-header{
      border-bottom:1px solid #f5f5f5;
      padding-bottom: 15px;
      .el-radio-button__orig-radio:checked+.el-radio-button__inner{
        color: #409EFF;
        background-color: #fff;
        border-color: #409EFF;
      }
    }
    .card-body-item{
      .card-search{
        display: -webkit-flex;
        display: flex;
        margin-top: 16px;
        .el-form-item{
          margin-bottom: 0;
          margin-right: -22px;
          .el-form-item__label{
            font-size: 13px;
            line-height: 32px;
            padding:0;
          }
          .el-form-item__content{
            font-size: 12px;
            line-height: 32px;
            .el-input{
              font-size: 12px;
              width: 80%;
              .el-input__inner{
                height: 32px;
                line-height: 32px;
              }
            }
            .el-date-editor--daterange{
              width:240px;
              height: 32px;
              .el-input__icon.el-range__icon.el-icon-date{
                line-height: 25px;
              }
            }
          }
        }
        .el-form-item.left25{
          margin-left: 25px;
        }
        .el-form-item.left20{
          margin-left: 20px;
        }
      }
      .card-body-table{
        margin-top: 20px;
        .el-table.table1{
          border: 1px solid #E5E5E5;
          .el-table__header-wrapper{
            .has-gutter{
              font-size: smaller;
              color: #515a6e;
            }
          }
          .el-table__body-wrapper{
            .el-table__row{
              td{
                // padding:8px 0;
                font-size:smaller;
              }
              td:nth-of-type(8)  {
               .cell{
                 .el-button.el-button--danger{
                   color: #F56C6C;
                  background-color: #fff1f0;
                  border-color: #F56C6C;
                  font-size: 12px;
                  padding: 5px 7px;
                 }
                 .el-button.el-button--success{
                   color: #67C23A;
                  background-color: #f6ffed;
                  border-color: #67C23A;
                  font-size: 12px;
                  padding: 5px 7px;
                 }
               }
              }
              td:nth-of-type(7)  {
               .cell{
                 .el-button.el-button--danger{
                   color: #F56C6C;
                  background-color: #fff1f0;
                  border-color: #F56C6C;
                  font-size: 12px;
                  padding: 5px 7px;
                 }
                 .el-button.el-button--success{
                   color: #67C23A;
                  background-color: #f6ffed;
                  border-color: #67C23A;
                  font-size: 12px;
                  padding: 5px 7px;
                 }
               }
              }
            }
          }
        }
        .el-table.table2{
          border: 1px solid #E5E5E5;
          .el-table__header-wrapper{
            .has-gutter{
              font-size: smaller;
              color: #515a6e;
              th{
                padding:5px 0;
              }
            }
          }
          .el-table__body-wrapper{
            .el-table__row{
              td{
                padding:5px 0;
                font-size:smaller;
              }
              td:nth-of-type(1){
                padding-left: 10px;
              }
              td:nth-of-type(2){
                padding-left: 6px;
              }
              td:nth-of-type(3){
                padding-left: 5px;
              }
            }
          }
        }
        .funKey{
          .flow,.recall,.editor,.noEditor,.preview,.start,.deleteRed{
            width:22px;
            height:22px;
          }
          .el-button+.el-button {
            margin-left: 6px;
          }
        }
      }

    }

  }
  .el-select-dropdown.el-popper{
    min-width: 148.4px!important;
    .el-scrollbar{
      .el-select-dropdown__item{
        padding: 0 16px;
        font-size: 13px;
        height: 32px;
        line-height: 32px;
      }
    }
  }
  .foldButton{
      position: fixed;
      right: 40px;
      bottom: 50px;
      height: 40px;
      color: #fff;
      background: #2d8cf0;
      border-radius: 20px;
      -webkit-border-radius: 20px;
      overflow: hidden;
      z-index: 9;
      .slideLeft {
        -webkit-animation-name: slideLeft;
        animation-name: slideLeft;
      }
      .toTop-enter-active {
        animation: identifier 1s;
      }
      @keyframes identifier {
      from {transform: translateX(100%);}
      to {transform: translateX(0%);}
      }


      .eb-div{
        position: relative;
        display: inline-block;
        padding: 10px 0 10px 10px;
        z-index: 1;
        .txt{
          display: inline-block;
          line-height: 20px;
          padding: 0 10px;
          border-right: 1px solid #fff;
          cursor: pointer;
          font-size: 13px;
        }
      }
      .eb-icon {
        display: inline-block;
        width: 40px;
        height: 40px;
        cursor: pointer;
        border-radius: 20px;
        -webkit-border-radius: 20px;
        padding-top: 10px;
        text-align: center;
        position: relative;
        z-index: 9;
        background: #2d8cf0;
        i{
          font-weight: 700;
        }
      }
  }
  .el-message-box__wrapper{
    .el-message-box__title{
      font-size: 16px;
      font-weight: 700;
    }
    .el-message-box__message{
      font-size: 13px;
    }
  }
</style>
