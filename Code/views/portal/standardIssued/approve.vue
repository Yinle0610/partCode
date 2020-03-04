<template>
  <div class="standard-approve-container">
    <el-card class="inventory-card" shadow="hover">
       <div class="header">
        <p class="title">标准清单</p>
      </div>
      <div class="body">
          <div class="search clearfix">
              <el-input placeholder="请输入内容" v-model="keyWord" clearable size="small" @keyup.enter.native="goToSearch">
                <i slot="suffix" class=" el-icon-search" @click="goToSearch"></i>
              </el-input>
          </div>
          <div class="tableData">
            <el-table :data="tableData" border style="width: 100%" size="mini" v-loading="loading" :header-cell-style="{background:'#f8f8f9',color:'#666'}">
                <el-table-column
                    :prop="item.prop"
                    :label="item.label"
                    v-for="item in tableHeader"
                    :key="item.prop"
                    show-overflow-tooltip
                    sortable
                    :width="item.prop==='code'?'100':item.prop==='name'?'130':item.prop==='path'?null:tableHeader.length>8?'120':'140'"
                    :min-width="item.prop==='path'?'160':null"
                ></el-table-column>
                <el-table-column  label="操作" align="center" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                        <el-button  type="text" size="small" @click="goToSeeDetail(scope.$index)">
                            <svg-icon icon-class="preview" class="preview"></svg-icon>
                        </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="全链分析" placement="bottom">
                            <el-button type="text" @click="handleBlood('full',scope.$index)">
                            <svg-icon icon-class="multilink" class="multilink"></svg-icon>
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
          </div>
          <div style="text-align:center;margin-top:20px;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.current"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="page.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total"
            ></el-pagination>
          </div>
      </div>
    </el-card>
    <el-card class="mess-card" shadow="hover">
      <div class="header">
        <p class="title">受理信息</p>
      </div>
      <div class="body">
          <el-form :model="ruleForm" ref="ruleForm" label-width="80px">
              <el-form-item label="发起人：" prop="people">
                <el-tooltip placement="right">
                  <div slot="content">
                    <p>部门：{{user.group}}</p>
                    <p>工作电话：{{user.workPhone}}</p>
                    <p>邮箱:{{user.email}}</p>
                    <p>手机号:{{user.mobilePhone}}</p>
                  </div>
                  <el-tag type="info" size="small">{{user.title}}</el-tag>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="受理信息：" prop="mess"
              :rules="[{ required: true, message: '请输入受理信息', trigger: 'blur' }]">
                 <el-input type="textarea" v-model="ruleForm.mess" :autosize="{ minRows: 2, maxRows: 5}" class="textInput"></el-input>
              </el-form-item>
          </el-form>
      </div>
      <div class="footer">
          <div style="text-align:center;width:100%">
              <el-button  type="primary" size="mini" @click="handleSubmit(true)">通 过</el-button>
              <el-button size="mini" @click="handleSubmit(false)">驳 回</el-button>
          </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { get, parseAjaxResponse, post } from "@/utils/request";
import { generateLineageTitle } from "@/utils";
export default {
  name: 'approve',
  data() {
    return {
      caseId: null,
      taskId: null,
      loading: false,
      ruleForm: {
        mess: null
      },
      user: {},
      keyWord: null,
      tableHeader: [],
      tableData: [],
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      allData: [],
      nodeId: null,
      saveLocking: true
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page.current = val;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      let params = {
        id: this.nodeId,
        pageCurrent: this.page.current,
        pageSize: this.page.size,
        keyword: this.keyWord
      }
      get('/home/matter/stdrelease/listUnpublishStds', params).then(res => {
        parseAjaxResponse(res, () => {
          this.loading = false;
          if (res.code === 10000) {
            this.allData = res.data.records;
            if (this.tableData.length === 0) {
              this.noDataLoading = false;
            }
            this.tableData = [];
            this.tableHeader = [
              { prop: 'code',
                label: '标准编号' },
              {
                prop: 'name',
                label: '标准名称'
              }, {
                prop: 'path',
                label: '上下文路径'
              }
            ];
            res.data.records[0].attributes.map(item => {
              let obj2 = {
                prop: item.attrCode,
                label: item.name
              }
              this.tableHeader.push(obj2)
            })
            res.data.records.map(val => {
              let obj = {
                code: val.code,
                path: val.path,
                name: val.name
              }
              val.attributes.map(val2 => {
                obj[val2.attrCode] = val2.value;
              })
              this.tableData.push(obj)
            })
            this.page.total = res.data.total;
          }
        });
      })
    },
    goToSearch() {
      this.page.current = 1;
      this.getTableData()
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          let latestView = null
          views.map(val => {
            if (val.name === 'MY_MATTER') {
              latestView = val
            }
          })
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/portal/matter')
          }
        }
      })
    },
    handleSubmit(type) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = {
            caseId: this.caseId,
            isPass: type,
            msg: this.ruleForm.mess,
            taskId: this.taskId
          }
          console.log(params)
          if (this.saveLocking) {
            this.saveLocking = false;
            post('/home/matter/stdrelease/processApproval', params).then(res => {
              this.saveLocking = true;
              parseAjaxResponse(res, () => {
                if (res.code === 10000) {
                  this.$message.success(res.message)
                  this.closeSelectedTag(this.$route)
                } else {
                  this.$message.error(res.message)
                }
              })
            })
          }
        } else {
          return false;
        }
      });
    },
    goToSeeDetail(index) {
      let item = this.allData[index]
      this.showShadow = true;
      console.log(item)
      if (item.classifierId === 'BaseIndexInfoItem' || item.classifierId === 'RuleIndexInfoItem' || item.classifierId === 'CalculateIndexInfoItem' || item.classifierId === 'DeriveIndexInfoItem') {
        this.$router.push({// 指标详情跳转
          name: "indexManagementDetails",
          params: {
            id: item.id,
            classifierId: item.classifierId,
            _title: item.name
          }
        });
      } else if (item.classifierId === 'PublicCodeInfoItem') { // 公共代码
        this.$router.push({
          name: "commonCode",
          params: {
            id: item.id,
            classifierId: item.classifierId,
            _title: item.name,
            headerTitle: item.name
          }
        });
      } else if (item.classifierId === "RuleInfoItem") { // 规则
        this.$router.push({
          name: "ruleDetail",
          params: {
            id: item.id,
            _title: item.name,
            row: {
              instanceId: item.id,
              instanceName: item.name
            }}
        });
      } else if (item.classifierId === "DimentsionInfoItem") { // 维度
        this.$router.push({
          name: "dimensionDetails",
          params: { id: item.id,
            _title: item.name,
            detailId: item.id,
            row: {
              instanceId: item.id,
              instanceName: item.name
            }}
        });
      } else if (item.classifierId === "BizTermInfoItem") { // 业务术语
        this.$router.push({
          name: "professionalDetail",
          params: {
            id: item.id,
            _title: item.name,
            name: item.name
          }
        });
      } else if (item.classifierId === "MasterDataInfoItem") { // 主数据
        this.$router.push({
          name: "masterDataDetails",
          params: {
            id: item.id,
            classifierId: item.classifierId,
            _title: item.name,
            headerTitle: item.name
          }
        });
      }
    },
    handleBlood(command, index) {
      this.showShadow = true;
      let item = this.allData[index]
      this.$router.push({
        name: "dsLineageAnalysisCanvas",
        params: {
          dataFlowType: command,
          id: item.id,
          _title: generateLineageTitle(
            command,
            item.name
          )
        }
      });
    },
    getDetail() {
      let url = ""
      if (this.$route.params.type === 'back') {
        url = "/home/matter/stdrelease/getModCasePageInfo"
      } else {
        url = "/home/matter/stdrelease/getApprocePageInfo"
      }
      get(url, { caseId: this.caseId }).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.nodeId = res.data.stdId;
            this.getTableData();
            let user = null;
            if (this.$route.params.type === 'back') {
              user = res.data.checkUser
            } else {
              user = res.data.createUser
            }
            this.$set(this.user, 'title', user.username)
            this.$set(this.user, 'userId', user.userId)
            this.$set(this.user, 'email', user.mail)
            this.$set(this.user, 'mobilePhone', user.mobilephone)
            this.$set(this.user, 'workPhone', user.workphone)
            this.$set(this.user, 'group', user.groupname)
            this.ruleForm.mess = res.data.msg;
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    getCloseDetail() {
      get('/home/matter/stdrelease/getCloseCasePageInfo', { caseId: this.caseId }).then(res => {
        parseAjaxResponse(res, () => {
          if (res.code === 10000) {
            this.nodeId = res.data.stdId;
            this.getTableData();
            let user = res.data.checkUser;
            this.$set(this.user, 'title', user.username)
            this.$set(this.user, 'userId', user.userId)
            this.$set(this.user, 'email', user.mail)
            this.$set(this.user, 'mobilePhone', user.mobilephone)
            this.$set(this.user, 'workPhone', user.workphone)
            this.$set(this.user, 'group', user.groupname)
            this.ruleForm.mess = res.data.msg;
          } else {
            this.$message.error(res.message)
          }
        })
      })
    }
  },
  created() {
    this.caseId = this.$route.params.cid;
    this.taskId = this.$route.params.tid;
    this.getDetail()
  }
}
</script>
<style lang="scss" scoped>
$color-grey-light: #e0e0e0;
.standard-approve-container{
  padding:12px;
  .inventory-card{
      height:600px;
      /deep/ .el-card__body{
        height:100%;
      }
    .header {
      border-bottom: 1px solid $color-grey-light;
      display: flex;
      position: relative;
      .title {
       margin: 0;
       font-size: 16px;
       font-weight:600; 
       color: rgb(126, 123, 123);
       padding-bottom: 8px;
       padding-left: 10px;
      }
      .el-button {
        position: absolute;
        right: 0;
        bottom: 6px;
        padding: 3px 8px;
        /deep/ .el-icon-refresh {
           font-size: 18px !important;
        }
      }
    }
    .body{
        height: calc(100% - 10px);
    .search{
        /deep/ .el-input{
          width:220px;
          float:right;
          margin-top:10px;
        }
       /deep/ .el-input__inner{
         width:220px;
       }
       /deep/ .el-input__suffix{
        line-height: 32px;
      }
    }
    .tableData{
        overflow-y: auto;
        width: 100%;
        height: calc(100% - 130px);
        margin-top: 10px;
        .preview,.deleteRed,.editor,.multilink{
          width:22px;
          height:22px;
        }
        /deep/ .el-table__row{
          td{
              padding:0 
          }
            
        }
        .el-button+.el-button{
          margin-left: 5px;
        }
        /deep/ .tableClass {
          border-right: none !important;
        }
        /deep/ .el-table__body-wrapper::-webkit-scrollbar {
          width: 5px;
          height: 7px;
        }
        /deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
          background: none;
          border-radius: 2px;
        }
        /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
          background: rgb(239, 239, 239);
          border-radius: 10px;
        }
        /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
          background: #bfbfbf;
        }
        /deep/ .el-table__fixed-right{
          height:100%!important;
        }
    }
    .tableData::-webkit-scrollbar {
        width: 5px;
        height: 10px;
    }
    .tableData::-webkit-scrollbar-track {
        background: none;
        border-radius: 2px;
    }
    .tableData::-webkit-scrollbar-thumb {
        background: rgb(239, 239, 239);
        border-radius: 10px;
    }
    .tableData::-webkit-scrollbar-thumb:hover {
        background: #bfbfbf;
    }
    }
  }
    .mess-card{
      margin-top:10px;
      /deep/ .el-card__body{
      padding-bottom: 15px;
      padding-top: 15px;
      }
      .header {
        border-bottom: 1px solid $color-grey-light;
        display: flex;
        position: relative;
      .title {
        margin: 0;
        font-size: 16px;
        font-weight:600; 
        color: rgb(126, 123, 123);
        padding-bottom: 8px;
        padding-left: 10px;
      }
    }
    .body{
        margin-top:10px;
        height:160px;
        .el-tag{
          color:#409EFF;
        }
        .textInput{
          /deep/ .el-textarea__inner{
            max-height:90px;
          }
          }
        /deep/ .el-form-item{
          /deep/ .el-form-item__label{
            font-size: 12px;
            padding-right: 5px;
            color: #515a6e;
            font-weight: normal;
          }
        }
    }
    .footer{
      border-top: 1px solid $color-grey-light;
      padding-top: 15px;
      display: flex;
      position: relative;
    }
    }
  .clearfix {
  &:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }
}

}
</style>