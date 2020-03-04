<template>
  <div class="industryVoc-box">
    <div class="content-box">
      <div class="top-box">
        <div class="btn-box">
          <el-button type="primary" size="mini" @click="refreshData()" class="shuaxin"><svg-icon icon-class="refresh"></svg-icon> 刷新</el-button>
          <el-button type="success" size="mini" @click="addData()" class="zengjia"><svg-icon icon-class="zengjia" ></svg-icon>  新增</el-button>
          <el-button type="warning" size="mini" @click="editData()" class="xiugai">
            <svg-icon icon-class="xiugai" ></svg-icon> 编辑
          </el-button>
          <el-button type="danger" size="mini" @click="deleteData()" class="shanchu"><svg-icon icon-class="shanchu" ></svg-icon> 删除</el-button>
          <el-button type="primary" size="mini" @click="exportData()" class="xiazai"><svg-icon icon-class="xiazai" ></svg-icon> 导出</el-button>
          <el-button type="primary" size="mini" @click="importData()" class="shangchuan"><svg-icon icon-class="shangchuan" ></svg-icon> 导入</el-button>
        </div>
        <div class="topright-form">
          <el-form :model="searchForm" label-width="80" inline size="mini">
            <el-form-item label="关键字：">
              <el-input v-model.trim="searchForm.keyword" placeholder="请输入..."  size="mini"  clearable @keyup.enter.native="searchTableList">
                 <i slot="suffix" class="el-icon-search" @click="searchTableList"></i>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table-box">
        <el-table
          ref="table"
          :data="tableData"
          border
          show-header
          size="mini"
          style="width: 100%;"
           :default-sort = "{prop: 'vocabularyCn', order: 'descending'}"
          :header-cell-style="{background:'#f8f8f9'}"
          :cell-style="isClass"
          :header-cell-class-name="isClass2">
          <el-table-column
            type="selection"
            width="45">
          </el-table-column>
          <el-table-column
            label="中文词汇"
            align="left"
            sortable
            prop="vocabularyCn">
          </el-table-column>
          <el-table-column
            label="英文翻译"
            align="left"
            sortable
            prop="vocabularyEn">
          </el-table-column>
          <el-table-column
            label="物理名称"
            sortable
            align="left"
            prop="vocabularyPhy">
          </el-table-column>
          <el-table-column
            label="创建人"
            sortable
            align="left"
            prop="userId">
          </el-table-column>
          <el-table-column
            label="创建时间"
            sortable
            align="left"
            prop="createtime">
          </el-table-column>
          <el-table-column
            label="最后更新时间"
            sortable
            align="left"
            prop="updatetime">
          </el-table-column>
        </el-table>
      </div>
      <div id="paganation" style="text-align:center">
        <pagination  :total="total" :page.sync="icurrentPage"  :limit.sync="ipageSize" @pagination="queryTableList" />
      </div>
      <div class="dialog-box">
        <div id="addandedit-dialog">
          <el-dialog :visible.sync="isformVisible" :title="title" width="766px" class="add_dialog" @close='closeDialog'>
            <div class="dialog-form">
              <el-form :model="addAndEditForm" label-width="100px" :rules="rules" ref="addandeditform">
                <el-form-item label="中文词汇：" prop="vocabularyCh">
                  <el-input v-model.trim="addAndEditForm.vocabularyCh" size="mini"/>
                </el-form-item>
                <el-form-item label="英文翻译:" prop="vocabularyEn">
                  <el-input v-model.trim="addAndEditForm.vocabularyEn" size="mini"/>
                </el-form-item>
                <el-form-item label="物理名称:" prop="physicalName">
                  <el-input v-model.trim="addAndEditForm.physicalName" size="mini"/>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click.native="save">确定</el-button>
            </div>
          </el-dialog>
        </div>
        <div class="upload-dialog">
          <el-dialog :visible.sync="isUploadVisible" title="导入" width="600px" class="upload_dialog">
            <div class="upload-box">
              <el-upload
                :headers="headers"
                :action="`${api}/sysMaintain/industryGlossary/uploadExcleDataToDB`"
                accept="xlsx"
                :on-success="uploadSuccessHome">
                <el-button size="small"><i class="el-icon-upload el-icon--left"></i>上传文件</el-button>
                <div class="div-fontsize">支持扩展名：xlsx格式</div>
              </el-upload>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click.native="closeUpload" size="mini">关闭</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { post, get } from '@/utils/request'
import { getToken } from "@/utils/auth";
export default{
  components: { Pagination },
  name: 'industryVocabulary',
  data() {
    return {
      // 搜索
      searchForm: {
        keyword: ''
      },
      // 删除
      tableChecked: [], // 存储所选中的row
      tableData: [],
      // 新增和编辑
      isformVisible: false, // 是否显示新增和编辑对话框
      isEdit: false, // 是否是编辑
      vocabularyIdOld: '',
      addAndEditForm: {
        vocabularyCh: '',
        vocabularyEn: '',
        physicalName: ''
      },
      rules: {
        vocabularyCh: [
          { required: true, message: '请填词汇中文名', trigger: 'blur' }
        ],
        vocabularyEn: [
          { required: true, message: '请填词汇英文名', trigger: 'blur' }
        ],
        physicalName: [
          { required: true, message: '请填词汇物理名称', trigger: 'blur' }
        ]
      },
      title: "新增",
      // 导入导出
      isUploadVisible: false,
      headers: {},
      api: "",
      // paganation数据
      icurrentPage: 1,
      ipageSize: 10,
      total: 10
    }
  },
  methods: {
    // 刷新
    refreshData() {
      this.icurrentPage = 1
      this.searchForm.keyword = ''
      this.queryTableList()
    },
    // 搜索单独调用方法（解决页码问题）
    searchTableList() {
      this.icurrentPage = 1
      this.queryTableList()
    },
    // 重置form
    resetForm() {
      if (this.$refs.addandeditform !== undefined) {
        this.$refs.addandeditform.resetFields();
      }
    },
    // 打开新增对话框
    addData() {
      this.resetForm()
      this.title = "新增"
      this.isformVisible = true
    },
    // 打开编辑对话框
    editData() {
      let _this = this;
      let selectRow = _this.$refs.table.selection
      let len = selectRow.length
      if (len !== 1) {
        _this.$message.warning("请选中一条数据")
        return
      } else {
        this.resetForm()
        this.title = "编辑"
        this.getEditDetail(selectRow)
        this.isformVisible = true
        this.isEdit = true
      }
    },
    getEditDetail(selectRow) {
      let _this = this;
      _this.tableChecked = []
      _this.tableChecked.push(selectRow[0].vocabularyId)
      let vocabularyIdChecked = _this.tableChecked[0]
      get('sysMaintain/industryGlossary/listVocabulary', {
        vocabularyId: vocabularyIdChecked
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.addAndEditForm.vocabularyCh = res.data.records[0].vocabularyCn
          this.vocabularyIdOld = res.data.records[0].vocabularyId
          this.addAndEditForm.vocabularyEn = res.data.records[0].vocabularyEn
          this.addAndEditForm.physicalName = res.data.records[0].vocabularyPhy
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 新增或编辑保存
    save() {
      this.$refs.addandeditform.validate(valid => {
        if (valid) {
          let params = {
            vocabularyCn: this.addAndEditForm.vocabularyCh,
            vocabularyEn: this.addAndEditForm.vocabularyEn,
            vocabularyPhy: this.addAndEditForm.physicalName
          }
          if (this.isEdit) {
            params.vocabularyId = this.vocabularyIdOld
            post('/sysMaintain/industryGlossary/editVocabulary', params).then(res => {
              if (res.code === 10000 && res.success === true) {
                this.isEdit = false
                this.isformVisible = false
                this.queryTableList()
                this.$message.success(res.message)
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            post('/sysMaintain/industryGlossary/createVocabulary', params).then(res => {
              if (res.code === 10000 && res.success === true) {
                this.isformVisible = false
                this.queryTableList()
                this.$message.success(res.message)
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
    // 删除
    deleteData() {
      let _this = this;
      let selectRow = _this.$refs.table.selection
      let len = selectRow.length
      if (len === 0) {
        _this.$message.warning("请选中要删除的数据")
        return
      }
      _this.tableChecked = []
      for (let i = 0; i < len; i++) {
        _this.tableChecked.push(selectRow[i].vocabularyId)
      }
      this.$confirm('是否确认删除选中数据？', '删除数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = _this.tableChecked.join(',')
        post('/sysMaintain/industryGlossary/removeVocabulary', { vocabularyIds: ids }).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.$message.success(res.message)
            this.queryTableList();
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },

    // 导出
    exportData() {
      this.exportMethod()
    },
    exportMethod() {
      window.location.href = `${this.api}/sysMaintain/industryGlossary/downloadDBDataToExcle?token=${getToken()}`
    },
    // 导入
    importData() {
      this.isUploadVisible = true
    },
    uploadSuccessHome(res, file, fileList) {
      if (res.code === 10000 && res.success) {
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.message);
      }
    },
    closeUpload() {
      this.isUploadVisible = false
    },
    // 词汇列表
    queryTableList() {
      get('/sysMaintain/industryGlossary/listVocabulary', {
        keyword: this.searchForm.keyword,
        pageCurrent: this.icurrentPage,
        pageSize: this.ipageSize
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    isClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'text-align:left;border-right:none;'
      } else {
        return 'text-align:left;'
      }
    },
    isClass2({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'tableClass'
      }
    },
    closeDialog() {
      this.isEdit = false
      this.isformVisible = false
    }
  },
  created() {
    this.queryTableList();
    this.headers = {
      "X-Token": getToken()
    };
    this.api = process.env.BASE_API;
  }
}
</script>

<style lang="scss" scoped>
.industryVoc-box{
  background-color:#fff;
  margin:10px;
  //content的样式
  .content-box{
    padding:40px;
     .top-box{
      width:100%;
      padding-bottom:30px;
       .btn-box {
        display: inline-block;
        .el-button--mini{
            font-size: 13px;
            .svg-icon{
                position:relative;
            }
        }
        .shuaxin{
             padding:3px 9px 7px 8px;
            .svg-icon{
                width:18px;
                height:18px;
                top:3px;
            }
        }
        .zengjia{
            padding:5px 10px 7px 9px;
            .svg-icon{
                width:16px;
                height:16px;
                top:2px;
            }
        }
        .xiugai{
            padding:3px 9px 7px 8px;
            .svg-icon{
                width:18px;
                height:18px;
                top:3px;
            }
        }
        .shanchu{
            padding:5px 10px 7px 9px;
            .svg-icon{
                width:16px;
                height:16px;
                top:1px;
            }
          }
        .xiazai{
            padding:3px 8px 7px 8px;
            .svg-icon{
                width:18px;
                height:18px;
                top:3px;
            }
          }
        .shangchuan{
            padding:3px 9px 7px 8px;
            .svg-icon{
                width:18px;
                height:18px;
                top:3px;
            }
          }
        }
      .topright-form{
        position: absolute;
        right:45px;
        display: inline-block;
        /deep/ .el-form-item__label{
          font-size: 12px
        }
      }
    }
    .table-box{
       /deep/ .tableClass{
          border-right:none!important;
      }
    }
    .dialog-box{
      .add_dialog /deep/ .el-dialog__header{
        border-bottom: 1px solid #DCDFE6;
        text-align: left
      }
      .upload-dialog /deep/ .el-dialog__header{
        border-bottom: 1px solid #DCDFE6;
        text-align: left
      }
      .upload-dialog /deep/ .el-dialog__body  {
        text-align: center
      }
      .add_dialog /deep/ .el-dialog__title{
        font-weight:650;
        font-size:20px;
        color:rgba(51, 51, 51, 0.647058823529412);
      }
      .add_dialog /deep/ .el-dialog__footer{
        border-top: 1px solid #DCDFE6;
        text-align: center
      }
      .upload-dialog /deep/ .el-dialog__footer{
        border-top: 1px solid #DCDFE6;
        text-align: center
      }
      .dialog-form{
        margin:0 180px 0px 80px;
        /deep/ .el-form-item__label{
          text-align:left;
          font-weight:400;
          font-size:14px;
          line-height:38px;
        }
      }
      .upload-dialog .div-fontsize{
        margin-top:10px;
        font-size:12px
      }
    }
  }
}
</style>
