<template>
  <div class="industryVoc-box">
    <div class="content-box">
      <div class="top-box">
        <div class="btn-box">
          <!-- <el-button type="primary" size="mini" @click="detailDataShow()" class="yulanbt"><svg-icon icon-class="yulan" ></svg-icon> 详情</el-button> -->
          <el-button type="primary" size="mini" @click="refreshData()" class="shuaxin"><svg-icon icon-class="refresh"></svg-icon> 刷新</el-button>
          <el-button type="success" size="mini" @click="addDataShow()" class="zengjia"><svg-icon icon-class="zengjia" ></svg-icon>  新增</el-button>
          <el-button type="warning" size="mini" @click="editDataShow()" class="xiugai">
            <svg-icon icon-class="xiugai" ></svg-icon> 编辑
          </el-button>
          <el-button type="danger" size="mini" @click="deleteData()" class="shanchu"><svg-icon icon-class="shanchu" ></svg-icon> 删除</el-button>
        </div>
        <div class="topright-form">
          <el-form :model="searchForm" label-width="80" inline size="mini">
            <el-form-item label="关键字：">
              <el-input v-model.trim="searchForm.keyword" placeholder="请输入..."  @keyup.enter.native="searchTableList" clearable>
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
          style="width: 100%"
          :default-sort = "{prop: 'classifierName', order: 'descending'}"
          :header-cell-style="{background:'#f8f8f9'}" 
          :cell-style="isClass" 
          :header-cell-class-name="isClass2">
          <el-table-column
            type="selection"
            width="45">
          </el-table-column>
          <el-table-column
            label="对象分类"
            sortable
            prop="classifierName">
          </el-table-column>
          <el-table-column
            label="编码前缀"
            sortable
            prop="prefix">
          </el-table-column>
          <el-table-column
            label="样例数据"
            sortable
            prop="sample">
          </el-table-column>
          <el-table-column
            label="备注"
            sortable
            prop="remark">
          </el-table-column>
        </el-table>
      </div>
      <div id="paganation" style="text-align:center">
        <pagination  :total="total" :page.sync="icurrentPage"  :limit.sync="ipageSize" @pagination="queryTableList" />
      </div>
      <div class="dialog-box">
        <div id="addandedit-dialog">
          <el-dialog :visible.sync="isformVisible" :title="title" class="add_dialog" @close='closeDialog' width="700px">
            <div class="dialog-form">
              <el-form :model="addAndEditForm" label-width="100px" :rules="rules" ref="addandeditform" size="mini">
                <el-form-item label="对象分类：" prop="objectType">
                  <el-select v-model.trim="addAndEditForm.objectType" placeholder="请选择" size="mini" :disabled="isEdit">
                    <el-option v-for="(item,index) in objectTypeList" :key="index" :value="item.classifierId"
                    :label="item.classifierName">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="编码前缀：" prop="codedPrefix">
                  <el-input v-model.trim="addAndEditForm.codedPrefix" size="mini"/>
                </el-form-item>
                <el-form-item label="样例数据:" prop="caseNumber">
                  <el-input v-model.trim="addAndEditForm.caseNumber" size="mini"/>
                </el-form-item>
                <el-form-item label="备注:" prop="remarks">
                  <el-input type="textarea" v-model.trim="addAndEditForm.remarks" size="mini"/>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click.native="save">确定</el-button>
            </div>
          </el-dialog>
        </div>
        <div id="detail-dialog">
          <el-dialog :visible.sync="isDetailVisible" title="详情" class="detail_dialog">
            <div class="dialog-content">
              <el-row>
                <el-col :span="4"><span>对象分类：</span></el-col>
                <el-col :span="20">{{ detailData.objectType }}</el-col>
              </el-row>
              <br>
              <el-row>
                <el-col :span="4"><span>编码前缀：</span></el-col>
                <el-col :span="20">{{ detailData.codedPrefix }}</el-col>
              </el-row>
              <br>
              <el-row>
                <el-col :span="4"><span>样例数据：</span></el-col>
                <el-col :span="20">{{ detailData.caseNumber }}</el-col>
              </el-row>
              <br>
              <el-row>
                <el-col :span="4"><span>备注：</span></el-col>
                <el-col :span="20">{{ detailData.remarks }}</el-col>
              </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click.native="closeDetail">确定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { get, post } from '@/utils/request'
export default{
  components: { Pagination },
  name: 'numberingRules',
  data() {
    return {
      // 搜索
      searchForm: {
        keyword: ''
      },
      // 删除
      tableChecked: [], // 存储所选中的row
      ids: [], // 删除时存储所选中的row的id(这里的id是表的标志字段)
      tableData: [],
      // 新增和编辑
      isformVisible: false, // 是否显示新增和编辑对话框
      isEdit: false, // 是否是编辑
      objectTypeList: {},
      addAndEditForm: {
        objectType: '',
        codedPrefix: '',
        caseNumber: '',
        remarks: ''
      },
      rules: {
        objectType: [
          { required: true, message: '请填对象分类', trigger: 'blur' }
        ],
        codedPrefix: [
          { required: true, message: '请填编码前缀', trigger: 'blur' }
        ],
        caseNumber: [
          { required: true, message: '请填样例数据', trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: '备注', trigger: 'blur' }
        ]
      },
      title: "新增",
      // 详情
      isDetailVisible: false,
      detailData: {
        objectType: '',
        codedPrefix: '',
        caseNumber: '',
        remarks: ''
      },
      // paganation数据
      icurrentPage: 1,
      ipageSize: 10,
      total: 10
    }
  },
  methods: {
    // 搜索
    searchTableList() {
      this.icurrentPage = 1
      this.queryTableList()
    },
    // 详情
    detailDataShow() {
      let _this = this;
      let selectRow = _this.$refs.table.selection
      let len = selectRow.length
      if (len !== 1) {
        _this.$message.warning("请选中一条数据")
        return
      } else {
        _this.tableChecked = []
        _this.tableChecked.push(selectRow[0].classifierId)
        let classifierId = _this.tableChecked.join(',')
        post('/sysMaintain/numRule/listNumberRule', { classifierId }).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.detailData.objectType = res.data.records[0].classifierName
            this.detailData.codedPrefix = res.data.records[0].prefix
            this.detailData.caseNumber = res.data.records[0].sample
            this.detailData.remarks = res.data.records[0].remark
          } else {
            this.$message.error(res.message)
          }
        })
        this.isDetailVisible = true
      }
    },
    closeDetail() {
      this.isDetailVisible = false
    },
    // 刷新
    refreshData() {
      this.searchForm.keyword = ''
      this.queryTableList();
    },

    resetForm() {
      if (this.$refs.addandeditform !== undefined) {
        this.$refs.addandeditform.resetFields();
      }
    },
    // 打开新增对话框
    addDataShow() {
      this.resetForm()
      this.getObjectTypeList()
      this.title = "新增"
      this.isformVisible = true
    },
    // 打开编辑对话框
    editDataShow() {
      this.resetForm()
      this.getEditDetail()
      this.getObjectTypeList()
      this.isEdit = true
      this.title = "编辑"
    },
    getEditDetail() {
      let _this = this;
      let selectRow = _this.$refs.table.selection
      let len = selectRow.length
      if (len !== 1) {
        _this.$message.warning("请选中一条数据")
        return
      } else {
        _this.tableChecked = []
        _this.tableChecked.push(selectRow[0].classifierId)
        let classifierId = _this.tableChecked.join(',')
        post('/sysMaintain/numRule/listNumberRule', { classifierId }).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.addAndEditForm.objectType = res.data.records[0].classifierId
            this.addAndEditForm.codedPrefix = res.data.records[0].prefix
            this.addAndEditForm.caseNumber = res.data.records[0].sample
            this.addAndEditForm.remarks = res.data.records[0].remark
          } else {
            this.$message.error(res.message)
          }
        })
        this.isformVisible = true
      }
    },
    // 获取对象分类列表
    getObjectTypeList() {
      get('/sysMaintain/numRule/listClassifier').then(res => {
        if (res.code === 10000 && res.success === true) {
          this.objectTypeList = res.data
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
            classifierId: this.addAndEditForm.objectType,
            prefix: this.addAndEditForm.codedPrefix,
            remark: this.addAndEditForm.remarks,
            sample: this.addAndEditForm.caseNumber
          }
          if (this.isEdit) {
            post('/sysMaintain/numRule/editNumberRule', params).then(res => {
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
            post('/sysMaintain/numRule/createNumberRule', params).then(res => {
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
        _this.tableChecked.push(selectRow[i].classifierId)
      }
      this.$confirm('是否确认删除选中数据？', '删除数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = _this.tableChecked.join(',')
        post('/sysMaintain/numRule/removeNumberRule', { classifierIds: ids }).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.$message.success(res.message)
            this.queryTableList();
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    // 编号规则列表
    queryTableList() {
      post('/sysMaintain/numRule/listNumberRule', {
        pageCurrent: this.icurrentPage,
        pageSize: this.ipageSize,
        keyword: this.searchForm.keyword
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
        return 'border-right:none;'
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
        .yulanbt{
            padding:3px 9px 7px 8px;
            .svg-icon{
                width:18px;
                height:18px;                       
                top:3px;
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
      /deep/ .el-dialog__header{
        border-bottom: 1px solid #DCDFE6;
      }
      /deep/ .el-dialog__title{
        font-weight:650;
        font-size:20px;
        color:rgba(51, 51, 51, 0.647058823529412)
      }
      /deep/ .el-dialog__footer{
        border-top: 1px solid #DCDFE6;
        text-align: center
      }
      .dialog-form{
        width:500px;
        margin:0 166px 0px 100px;
        /deep/ .el-form-item__label{
          text-align:left;
          font-weight:400;
          font-size:14px;
          line-height:26px;
        }
      }
      .dialog-content{
        width:500px;
        margin:0 100px 0px 50px;
      }
    }
  }
}
</style>
