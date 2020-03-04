<!--模型主题-->
<template>
  <div class="subject dashboard-editor-container">
    <!--表格数据区域-->
    <el-card shadow="hover" class="card-container card-table">
      <!--box组-->
      <div class="btn-box">
        <el-button size="small" v-permission="'SUBJECT_CREATE'" type="primary" @click="addSubject"> <i class="btn-box-icon add"></i> 新增主题</el-button>
        <!-- <el-button size="small" v-permission="'SUBJECT_REMOVE'" type="danger" @click="delSubject"><i class="btn-box-icon del"></i> 批量删除</el-button> -->
      </div>
      
      <el-card class="card-table">
        <el-table
            border
            :data="tableData"
            ref="multipleTable"
            style="width: 100%">
          <el-table-column
              prop="subjectCode"
              label="主题代码"
              sortable
              :show-overflow-tooltip='showToolTip'
          >
          </el-table-column>
          <el-table-column
              prop="subjectName"
              label="主题名称"
               sortable
              :show-overflow-tooltip='showToolTip'
          >
          </el-table-column>
          <el-table-column
              prop="creator"
              label="创建人"
              sortable
              :show-overflow-tooltip='showToolTip'
          >
          </el-table-column>
          <el-table-column
              prop="createDate"
              label="创建时间"
              sortable
              :show-overflow-tooltip='showToolTip'
          >
          </el-table-column>
          <el-table-column
              label="操作"
              align="center"
               sortable
              :show-overflow-tooltip='showToolTip'
              width="200">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
                <el-button v-permission="'SUBJECT_EDIT'"  @click="editSubject(scope.row)" type="text" size="small" >
                  <svg-icon icon-class="editor" class="editor"></svg-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-button v-permission="'SUBJECT_REMOVE'" @click='delSubject(scope.row)' type="text" size="small" >
                  <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                </el-button>
              </el-tooltip>
              <!-- <el-button type="warning" v-permission="'SUBJECT_EDIT'" size="small" class="icon-btn" @click="editSubject(scope.row)"> <i class="edit"></i>  修改</el-button> -->
              <!-- <el-button type="danger" v-permission="'SUBJECT_REMOVE'" size="small" class="icon-btn" @click="delSubject(scope.row)"> <i class="del"></i>  删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--分页-->
      <div style="text-align: center; padding: 10px 0">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="oPage.pageCurrent"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="oPage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!--新增、修改主题-->
    <el-dialog :title="dialogTitle" :visible.sync="bThemeVisible">
      <el-form :model="addThemeForm" :rules="rulesTheme" ref="addThemeForm">
        <el-form-item prop="code" label="主题代码：" :label-width="dataSourceWidth">
          <el-input style="width: 388px" size="small" v-model="addThemeForm.code" autocomplete="off" placeholder="请输入主题代码"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="主题名称：" :label-width="dataSourceWidth">
          <el-input style="width: 388px" size="small" v-model="addThemeForm.name" autocomplete="off" placeholder="请输入主题名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button size="small" type="primary" @click="save" :disabled="saveBtnIsDisabled">保 存</el-button>
        <el-button size="small" @click="bThemeVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--删除-->
    <!-- <el-dialog class="confirm"
               :visible.sync="delDialogIsVisible"
               width="420px">
      <template slot="title">
        <div>
          <i class="el-icon-warning"></i>
          <span>提醒</span>
        </div>
      </template>
      <span>确定要删除所选内容吗?</span>
      <span class="dialog-footer" slot="footer">
          <el-button size="small"  @click="delDialogIsVisible = false">取 消</el-button>
          <el-button size="small" :disabled="saveBtnIsDisabled" @click="confirm" type="primary">确 定</el-button>
        </span>
    </el-dialog> -->
    <div class="dialog-box">
      <el-dialog 
               :visible.sync="delDialogIsVisible" title="删除提示">
       <delete-model ref="deleteSubject" :subjectShow="isSubject"></delete-model>
        <div class="dialog-btn">
          <el-button type="primary" size="mini" @click="confirm">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { get, post } from '../../../src/utils/request'
  import deleteModel from "@/views/model/deleteModel/deleteModel"

  export default {
    name: 'subject',
    components: {
      deleteModel
    },
    data() {
      return {
        isSubject: true,
        dialogTitle: '新增主题',
        bThemeVisible: false,
        delDialogIsVisible: false,
        dataSourceWidth: '100px',
        addThemeForm: {
          code: '',
          name: ''
        },
        rulesTheme: {
          code: [
            { required: true, message: '请输入主题代码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入主题名称', trigger: 'blur' }
          ]
        },
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 10,
        dataId: 0, // 表格中每一条数据的id
        oPage: {
          pageCurrent: 1,
          pageSize: 10
        },
        // 提交按钮，是否禁用
        saveBtnIsDisabled: false, // false 非禁用
        showToolTip: true
      }
    },
    methods: {
      // 分页获取主题信息接口
      getSubjectList() {
        get('/mod/subject/listSubject', this.oPage).then((res) => {
          console.log(res)
          if (res.code === 10000) {
            this.tableData = res.data.records
            this.total = res.data.total
            // this.dataId = row.subjectId
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 新增主题接口
      getCreateSubject() {
        post('/mod/subject/createSubject', {
          subjectId: null,
          subjectCode: this.addThemeForm.code,
          subjectName: this.addThemeForm.name
        }).then((res) => {
          console.log(res)
          if (res.code === 10000) {
            this.$message.success("新增成功")
            this.getSubjectList() // 获取表格列表数据
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 修改主题接口
      getEditSubject() {
        post('/mod/subject/editSubject', {
          subjectId: this.dataId,
          subjectCode: this.addThemeForm.code,
          subjectName: this.addThemeForm.name
        }).then((res) => {
          console.log(res)
          if (res.code === 10000) {
            this.$message.success("修改成功")
            this.getSubjectList() // 获取表格列表数据
          } else {
            this.$message.error(res.message)
          }
        })
      },

      // 删除按钮
      delSubject(row) {
        // let _this = this;
        // let selectRow = _this.$refs.multipleTable.selection
        // let len = selectRow.length
        // if (len === 0) {
        //   _this.$message.warning("请选中要删除的数据")
        //   return
        // }
        this.dataId = row.subjectId
        let arr = []
        arr.push(row.subjectId)
        this.delDialogIsVisible = true
        this.$nextTick(() => {
          this.$refs.deleteSubject.getAllMsg(arr.join(","));
        });
        // 为提交按钮，设置disabled状态: false非禁用
        this.saveBtnIsDisabled = false
      },
      // 删除按钮-确定
      confirm() {
        // 调用删除主题接口
        this.getDelSubject()
        // 为提交按钮，设置disabled状态: true禁用
        this.saveBtnIsDisabled = true
        this.delDialogIsVisible = false
      },
      // 删除主题接口
      getDelSubject() {
        this.$confirm('您的操作将会删除所选主题及其相关物理模型，确定继续吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = []
          arr.push(this.dataId)
          post('/mod/subject/removeBatchSubjects', {
            subjectIds: arr.join(",")
          }).then((res) => {
            if (res.code === 10000) {
              this.$message.success(res.message)
              this.getSubjectList() // 获取表格列表数据
            } else {
              this.$message.error(res.message)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      // 新增主题按钮
      addSubject() {
        // 为提交按钮，设置disabled状态: false非禁用
        this.saveBtnIsDisabled = false
        this.bThemeVisible = true // 新增对话框可见
        // 清空表单数据
        this.addThemeForm.code = ""
        this.addThemeForm.name = ""
        this.dialogTitle = '新增主题'
      },
      // 修改按钮
      editSubject(row) {
        // 为提交按钮，设置disabled状态: false非禁用
        this.saveBtnIsDisabled = false
        this.bThemeVisible = true
        this.dialogTitle = '修改主题'
        this.addThemeForm.code = row.subjectCode
        this.addThemeForm.name = row.subjectName
        this.dataId = row.subjectId
      },
      // 保存
      save() {
        this.$refs['addThemeForm'].validate((valid) => {
          if (valid) {
            if (this.dialogTitle === '新增主题') {
              // 调用新增主题接口
              this.getCreateSubject()
              this.bThemeVisible = false
              // 为提交按钮，设置disabled状态: true禁用
              this.saveBtnIsDisabled = true
            } else if (this.dialogTitle === '修改主题') {
              // 调用修改主题接口 保存修改
              this.getEditSubject()
              this.bThemeVisible = false
              // 为提交按钮，设置disabled状态: true禁用
              this.saveBtnIsDisabled = true
            }
          } else {
            this.$message.warning('请按规则填写信息')
            return false;
          }
        });
      },
  
      handleSizeChange(val) {
        this.oPage.pageSize = val
        this.getSubjectList()
      },
      handleCurrentChange(val) {
        this.oPage.pageCurrent = val
        this.getSubjectList()
      }

    },
    created() {
      this.showToolTip = true
      this.getSubjectList()
    },
    activated() {
      this.showToolTip = true
    },
    deactivated() {
      this.showToolTip = false
    },
    mounted() {

    }
  }
</script>


<style lang="scss" scoped>
  //外层card容器样式
  @import './../../styles/dq/main-card-table.scss';

  .subject{
    //删除对话框样式
    .item{
      .deleteRed,.editor{
        width:22px;
        height:22px;
      }
    }
    .dialog-box{          
      //对话框上、下分隔线
      /deep/ .el-dialog__header {
            border-bottom: 1px solid #e8ebed;
            .el-dialog__title{
              height: 20px;
              line-height: 20px;
              font-size: 14px;
              color: #17233d;
              font-weight: 700;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
         /deep/ .el-dialog__body{
           padding:0px
         } 
        .dialog-btn{
          text-align: center;
          border-top: 1px solid #e8ebed;
          padding-top:10px;
          padding-bottom:10px
        }
      }
    //box组的样式
    .btn-box {
      border-bottom: 1px solid #e8eaec;
      padding-bottom: 20px;
    }
    .btn-box button {
      position: relative;
      padding-left: 35px;
      margin-right: 8px;
    }
    .btn-box .btn-box-icon {
      position: absolute;
      display: inline-block;
      width: 20px;
      height: 20px;
      left: 10px;
      top: 6px;
    }
    .btn-box .add {
      background: url(../../../src/assets/images/commonIcon/add.png) no-repeat;
      background-size: 100%;
    }

    /*表格中操作列按钮组样式*/
    .icon-btn {
      position: relative;
      padding-left: 35px;
      padding-right: 10px;
    }
    .del, .edit {
      position: absolute;
      display: inline-block;
      width: 20px;
      height: 20px;
      left: 10px;
      top: 5px;
    }
    .edit {
      background: url(../../../src/assets/images/commonIcon/edit.png) no-repeat;
      background-size: 100%;
    }
    .del{
      background: url(../../../src/assets/images/commonIcon/del.png) no-repeat;
      background-size: 100%;
    }

    //确认框样式
    /deep/ .confirm.el-dialog__wrapper .el-dialog .el-dialog__header {
      border-bottom: none;
      //提醒图标颜色
      i.el-icon-warning{
        color: rgb(255, 153, 0);
        font-size: 20px;
        top: 2px;
        position: relative;
      }
    }
    /deep/ .confirm.el-dialog__wrapper .el-dialog .el-dialog__body{
      padding: 10px 20px;
    }
    /deep/ .confirm.el-dialog__wrapper .el-dialog .el-dialog__footer {
      border-top: none;
    }

  }


</style>
