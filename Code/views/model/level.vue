<!--模型层次-->
<template>
  <div class="level dashboard-editor-container">
    <!--表格数据区域-->
    <el-card shadow="hover" class="card-container card-table">
      <!--box组-->
      <div class="btn-box">
        <el-button size="small" v-permission="'MODEL_LEVEL_CREATE'" type="primary" @click="addLevel"> <i class="btn-box-icon add"></i> 新增层次</el-button>
      </div>
      <el-card class="card-table">
        <el-table
            border
            :data="tableData"
            style="width: 100%">
          <el-table-column
              prop="levelCode"
              label="层次代码"
               sortable
              :show-overflow-tooltip='showToolTip'
          >
          </el-table-column>
          <el-table-column
              prop="levelName"
              label="层次名称"
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
              width="200">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
                <el-button v-permission="'MODEL_LEVEL_EDIT'"  @click="editLevel(scope.row)" type="text" size="small" >
                  <svg-icon icon-class="editor" class="editor"></svg-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-button v-permission="'MODEL_LEVEL_REMOVE'" @click='delLevel(scope.row)' type="text" size="small" >
                  <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                </el-button>
              </el-tooltip>
              <!-- <el-button type="warning" v-permission="'MODEL_LEVEL_EDIT'" size="small" class="icon-btn" @click="editLevel(scope.row)"> <i class="edit"></i>  修改</el-button> -->
              <!-- <el-button type="danger" v-permission="'MODEL_LEVEL_REMOVE'" size="small" class="icon-btn" @click="delLevel(scope.row)"> <i class="del"></i>  删除</el-button> -->
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

    <!--新增、修改层次-->
    <el-dialog :title="dialogTitle" :visible.sync="bLevelVisible">
      <el-form :model="addLevelForm" :rules="rulesLevel" ref="addLevelForm">
        <el-form-item prop="code" label="层次代码：" :label-width="dataSourceWidth">
          <el-input style="width: 388px" size="small" v-model="addLevelForm.code" autocomplete="off" placeholder="请输入层次代码"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="层次名称：" :label-width="dataSourceWidth">
          <el-input style="width: 388px" size="small" v-model="addLevelForm.name" autocomplete="off" placeholder="请输入层次名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button size="small" type="primary" @click="save" :disabled="saveBtnIsDisabled">保 存</el-button>
        <el-button size="small" @click="bLevelVisible = false">取 消</el-button>
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
        :visible.sync="delDialogIsVisible"
        width="520px" title="删除提示">
        <delete-model ref="deleteLevel" :subjectShow="isSubject"></delete-model>
        <div class="dialog-btn">
          <el-button type="primary" size="mini" @click="confirm">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { get, post } from "../../utils/request";
  import deleteModel from "@/views/model/deleteModel/deleteModel"

  export default {
    name: 'level',
    components: {
      deleteModel
    },
    data() {
      return {
        isSubject: false,
        dialogTitle: '新增层次',
        bLevelVisible: false,
        delDialogIsVisible: false,
        dataSourceWidth: '100px',
        addLevelForm: {
          code: '',
          name: ''
        },
        rulesLevel: {
          code: [
            { required: true, message: '请输入层次代码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入层次名称', trigger: 'blur' }
          ]
        },
        tableData: [],
        currentPage: 1,
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
      // 分页获取层次信息接口
      getLevelList() {
        get('/mod/level/listLevels', this.oPage).then((res) => {
          // console.log(res)
          if (res.code === 10000) {
            this.tableData = res.data.records
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 新增层次接口
      getCreateLevel() {
        post('/mod/level/createLevel', {
          levelId: this.dataId,
          levelCode: this.addLevelForm.code,
          levelName: this.addLevelForm.name
        }).then((res) => {
          if (res.code === 10000) {
            this.$message.success("新增成功")
            this.getLevelList() // 获取表格列表数据
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 修改层次接口  /mod/level/editLevel
      getEditLevel() {
        post('/mod/level/editLevel', {
          levelId: this.dataId,
          levelCode: this.addLevelForm.code,
          levelName: this.addLevelForm.name
        }).then((res) => {
          if (res.code === 10000) {
            this.$message.success(res.message)
            this.getLevelList() // 获取表格列表数据
          } else {
            this.$message.error(res.message)
          }
        })
      },
      // 删除按钮
      delLevel(row) {
        this.dataId = row.levelId
        let arr = []
        arr.push(row.levelId)
        this.delDialogIsVisible = true
        this.$nextTick(() => {
          this.$refs.deleteLevel.getAllMsg(arr.join(","));
        });
        // 为提交按钮，设置disabled状态: false非禁用
        this.saveBtnIsDisabled = false
      },
      // 删除按钮-确定
      confirm() {
        this.delDialogIsVisible = false
        // 调用删除层次接口
        this.getDelLevel()
        // 为提交按钮，设置disabled状态: true禁用
        this.saveBtnIsDisabled = true
      },
      // 删除层次接口
      getDelLevel() {
        this.$confirm('您的操作将会删除所选层次及其相关物理模型，确定继续吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = []
          arr.push(this.dataId)
          post('/mod/level/removeBatchLevels', {
            levelIds: arr.join(",")
          }).then((res) => {
            if (res.code === 10000) {
              this.$message.success(res.message)
              this.getLevelList() // 获取表格列表数据
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

      // 新增层次按钮
      addLevel() {
        // 为提交按钮，设置disabled状态: false非禁用
        this.saveBtnIsDisabled = false
        this.bLevelVisible = true // 新增对话框可见
        // 清空表单数据
        this.addLevelForm.code = ""
        this.addLevelForm.name = ""
        this.dialogTitle = '新增层次'
      },
      // 修改按钮
      editLevel(row) {
        // 为提交按钮，设置disabled状态: false非禁用
        this.saveBtnIsDisabled = false
        this.bLevelVisible = true
        this.dialogTitle = '修改层次'
        this.addLevelForm.code = row.levelCode
        this.addLevelForm.name = row.levelName
        this.dataId = row.levelId
      },
      // 保存
      save() {
        this.$refs['addLevelForm'].validate((valid) => {
          if (valid) {
            if (this.dialogTitle === '新增层次') {
              // 调用新增层次接口
              this.getCreateLevel()
              this.bLevelVisible = false
              // 为提交按钮，设置disabled状态: true禁用
              this.saveBtnIsDisabled = true
            } else if (this.dialogTitle === '修改层次') {
              console.log('test save btn number')
              // 调用修改层次接口
              this.getEditLevel()
              this.bLevelVisible = false
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
        this.oPage.pageCurrent = 1
        this.oPage.pageSize = val
        this.getLevelList()
      },
      handleCurrentChange(val) {
        this.oPage.pageCurrent = val
        this.getLevelList()
      }
    },
    created() {
      this.showToolTip = true
      this.getLevelList()
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

  .level{
    .item{
      .deleteRed,.editor{
        width:22px;
        height:22px;
      }
    }
    //删除对话框样式
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
          padding-top:10px
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
