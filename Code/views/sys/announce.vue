<template>
  <div class="announce-div">
    <el-card class="box-card">
      <div slot="header">
        <div class="top-box">
          <div  class="btn-box">
            <el-button type="danger" @click="announceDelete" size="small" class="buttoncss"><i class="btn-box-icon del"></i>批量删除</el-button>
            <el-button type="primary"  @click="showAddDiolog" size="small" class="buttoncss"><i class="btn-box-icon add"></i>新增公告 </el-button>     
          </div>
          <div class="topright-form" style="float:right;">
            <el-form :inline="true">
              <el-form-item label="关键字:">
                <el-input v-model.trim="sKeyword" placeholder="请输入..." size="small" style="width:310px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getAnnounceList" size="small">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>                     
      </div>
      <div class="dialogs">
        <div id="add-dialog">
          <el-dialog :title="title" :visible.sync="bAddDialogVisible" style="font-size:12px">
            <el-form :model="aForm" :rules="rules" ref="addAnnounceform">
              <el-form-item label="公告标题:" :label-width="sFormLabelWidth" prop="sAnnounceName">
                <el-input v-model="aForm.sAnnounceName" placeholder="请输入" auto-complete="off" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="公告内容：" :label-width="sFormLabelWidth" prop="sAnnounceContent">
                <el-input placeholder="请输入" v-model="aForm.sAnnounceContent" auto-complete="off" size="mini"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="bAddDialogVisible = false" size="mini">取 消</el-button>
              <el-button type="primary" @click="addSave" size="mini">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <div id="detail">
          <el-dialog :visible.sync="isDetailVisible" title="详细信息" width="520px">
            <el-row>
              <el-col :span="4"><span>公告标题:</span></el-col>
              <el-col :span="20">{{ detailData.sAnnounceName }}</el-col>
            </el-row>
            <br>
            <el-row>
              <el-col :span="4"><span>公告内容:</span></el-col>
              <el-col :span="20">{{ detailData.sAnnounceContent }}</el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click.native="isDetailVisible = false" size="mini">确定</el-button>
            </div>
          </el-dialog>
        </div>   
      </div>
      <div class="table-div">
        <el-table
          border 
          show-header
          :data="aTableData"
          @selection-change="handleSelectionChange"
          :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
          :default-sort = "{prop: 'date', order: 'descending'}"
          style="width: 100%">
          <el-table-column
            width="60px"
            type="selection">
          </el-table-column>
          <el-table-column
            prop="announceTitle"
            label="标题"
            sortable>
          </el-table-column>
          <el-table-column
            prop="announceContent"
            label="内容"
            sortable>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="发布人"
            sortable>
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="发布时间"
            sortable>
          </el-table-column>      
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="bottom">
                <el-button @click="showDetail(scope.row)" type="text" size="small" >
                  <svg-icon icon-class="preview" class="preview"></svg-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
                <el-button   @click="showEdit(scope.row)" type="text" size="small" >
                  <svg-icon icon-class="editor" class="editor"></svg-icon>
                </el-button>
              </el-tooltip>
              <!-- <el-button
                size="mini"
                type="primary"
                @click="showDetail(scope.row)" class="table-btcss"><i class="view-info"></i>查看</el-button> -->
                <!-- <el-button
                size="mini"
                type="warning" 
                @click="showEdit(scope.row)" class="table-btcss"><i class="bt-edit"></i>修改</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div id="paganation" style="text-align:right">
        <pagination  :total="total"  :page.sync="icurrentPage"  :limit.sync="ipageSize" @pagination="getAnnounceList" />
      </div>
    </el-card>
</div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { get, post } from '@/utils/request'
export default{
  name: 'announce',
  components: { Pagination },
  data() {
    return {
      bAddDialogVisible: false,
      aForm: {
        sAnnounceName: '',
        sAnnounceContent: ''
      },
      sFormLabelWidth: '120px',
      rules: {
        sAnnounceName: [
          { required: true, message: '请输入公告标题' }
        ],
        sAnnounceContent: [
          { required: true, message: '请输入公告内容' }
        ]
      },
      title: '新增公告', // 动态定义dialog标题
      // 删除
      tableChecked: [],
      ids: [],
      // 编辑
      isEditDialog: false, // 是否是编辑
      editAnnounceId: '', // 编辑时用来暂存AnnounceId
      // 查看详情
      isDetailVisible: false, // 详情dialog是否可见
      detailData: {
        sAnnounceName: '',
        sAnnounceContent: ''
      },
      sKeyword: '',
      aTableData: [],
      icurrentPage: 1,
      ipageSize: 10,
      total: 10
    }
  },

  methods: {
    // 批量删除
    // 批量删除相关函数
    handleSelectionChange(val) { // val是所选中的每一个row,包括row中的所有字段
      // console.log("handleSelectionChange--", val)
      this.tableChecked = val
    },
    announceDelete() {
      this.$confirm('是否确认删除选中公告?', '删除公告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableChecked.forEach(element => {
          this.ids.push(element.announceId)
        })
        this.ids = this.ids.join(",")
        // console.log("handleSelectionChange--", this.ids)
        let params = {
          announce_ids: this.ids
        }
        this.ids = []
        get('/sys/announce/delete', params).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.$message.success(res.message)
            this.getAnnounceList();
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '您取消了该操作'
        });
      });
    },
    // 详细信息
    showDetail(row) {
      get('/sys/announce/get', {
        announce_id: row.announceId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.detailData.sAnnounceName = res.data.announceContent
          this.detailData.sAnnounceContent = res.data.announceTitle
        } else {
          this.$message.error(res.message)
        }
      })
      this.isDetailVisible = true
    },
    // 编辑公告
    showEdit(row) {
      this.resetForm()
      this.title = "修改公告"
      this.aForm = {
        sAnnounceName: '',
        sAnnounceContent: ''
      }
      get('/sys/announce/get', {
        announce_id: row.announceId
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.aForm.sAnnounceName = res.data.announceContent
          this.aForm.sAnnounceContent = res.data.announceTitle
        } else {
          this.$message.error(res.message)
        }
      })
      this.editAnnounceId = row.announceId
      this.isEditDialog = true
      this.bAddDialogVisible = true
    },
    resetForm() {
      if (this.$refs.addAnnounceform !== undefined) {
        this.$refs.addAnnounceform.resetFields();
      }
    },
    // 新增公告
    showAddDiolog() {
      this.resetForm()
      this.title = "新增公告"
      this.aForm = {
        sAnnounceName: '',
        sAnnounceContent: ''
      }
      this.bAddDialogVisible = true
    },
    // 保存编辑或新增
    addSave() {
      this.$refs.addAnnounceform.validate(valid => {
        if (valid) {
          let addparams = {
            announce_content: this.aForm.sAnnounceContent,
            announce_title: this.aForm.sAnnounceName
          }
          let editparams = {
            announce_content: this.aForm.sAnnounceContent,
            announce_title: this.aForm.sAnnounceName,
            announce_id: this.editAnnounceId
          }
          if (this.isEditDialog) {
            post('/sys/announce/edit', editparams).then(res => {
              if (res.code === 10000 && res.success === true) {
                this.$message.success(res.message)
                this.getAnnounceList();
                this.bAddDialogVisible = false
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            post('/sys/announce/add', addparams).then(res => {
              if (res.code === 10000 && res.success === true) {
                this.$message.success(res.message)
                this.getAnnounceList();
                this.bAddDialogVisible = false
              } else {
                this.$message.error(res.message)
              }
            })
          }
        } else {
          this.$message.error('请按以下规则填写信息')
        }
      })
    },

    getAnnounceList() {
      get('/sys/announce/list', {
        keyword: this.sKeyword,
        pageCurrent: this.icurrentPage,
        pageSize: this.ipageSize
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.aTableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  created() {
    this.getAnnounceList();
  }
}
</script>
<style lang="scss" scoped>
    //box的样式
  .top-box{
      display: inline-block;  
      width:100%;
    .btn-box {      
      padding-bottom: 10px;
      display: inline-block;       
    }
    .btn-box .buttoncss {
      position: relative;
      padding-left: 32px;
      margin-right: 8px;
    }
    .btn-box .btn-box-icon {
      position: absolute;
      display: inline-block;
      width: 15px;
      height: 15px;
      left: 10px;
      top: 7px;
    }
    .btn-box .add {
      background: url(../../../src/assets/images/commonIcon/add.png) no-repeat;
      background-size: 100%;
    }
    .btn-box .del {
      background: url(../../../src/assets/images/commonIcon/del.png) no-repeat;
      background-size: 100%;
    }
    .topright-form{
      position: absolute;
      right:15px;
      padding-bottom: 10px;
      display: inline-block;  
    }
  }
  // table内button的样式
  .table-div{
    .preview,.editor{
      width:22px;
      height:22px;
    }
    .table-btcss{
      position: relative;
      padding-left: 25px;
      margin-right: 10px;
    }
    .view-info, .bt-edit{
      position: absolute;
      display: inline-block;
      width: 15px;
      height: 15px;
      left: 5px;
      top: 5px;
    }
    .view-info {
      background: url(../../../src/assets/images/commonIcon/preview.png) no-repeat;
      background-size: 100%;
    }
    .bt-edit {
      background: url(../../../src/assets/images/commonIcon/edit.png) no-repeat;
      background-size: 100%;
    }
  } 
</style>
// element样式修改
<style>
  .top-box .el-form-item__label{
   font-size:12px;
 }
  .top-box .el-input__inner{
    height:30px
 }
 .table-div .el-table--border td{
   border-right:none
 }
.table-div .el-table--border th{
   border-right:none
 }
 .table-div .el-table{
   font-size:12px
 }
 .dialogs .el-form-item__label{
   font-size:12px;
   text-align:left;
 }
 .dialogs .el-dialog__title{
   font-size:14px;
   color:#17233d;
   font-weight:700
 }
 .dialogs .el-dialog__header{
   border-bottom:1px solid #e8eaec;
 }
 .dialogs .el-dialog__footer{
   border-top:1px solid #e8eaec;
 }
 .announce-div .pagination-container{
   margin-top:0px
 }
</style>