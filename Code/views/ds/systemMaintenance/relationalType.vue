<template>
  <div class="industryVoc-box">
    <div class="content-box">
      <div class="top-box">
        <div class="btn-box">
          <el-button type="primary" size="mini" @click="detailDataShow()" class="yulanbt"><svg-icon icon-class="yulan" ></svg-icon> 详情</el-button>
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
              <el-input v-model.trim="searchForm.keyword" placeholder="请输入..."   @keyup.enter.native="searchTableList" clearable>
                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTableList"></i>
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
          :default-sort = "{prop: 'relationshipId', order: 'descending'}"
          :header-cell-style="{background:'#f8f8f9'}" 
          :cell-style="isClass" 
          :header-cell-class-name="isClass2">
          <el-table-column
            type="selection"
            width="45">
          </el-table-column>
          <el-table-column
            label="关系代码"
            sortable
            prop="relationshipId"
            :show-overflow-tooltip='showToolTip'
            width="300">
          </el-table-column>
          <el-table-column
            label="关系名称"
            sortable
            prop="relationshipName"
            :show-overflow-tooltip='showToolTip'
            width="300">
          </el-table-column>
          <el-table-column
            label="关系描述"
            sortable
            :show-overflow-tooltip='showToolTip'
            prop="relationshipDescription">
          </el-table-column>
          <el-table-column
            label="可用于关系维护页面"
            width="200">
            <template slot-scope="scope">
              {{scope.row.usable ==1 ? '是':'否'}}
            </template>
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
              <el-form :model="addAndEditForm" label-width="200px" :rules="rules" ref="addandeditform" size="mini">
                <el-form-item label="关系代码：" prop="relationshipId">
                  <el-input v-model.trim="addAndEditForm.relationshipId" size="mini"/>
                </el-form-item>
                <el-form-item label="关系名称：" prop="relationshipName">
                  <el-input v-model.trim="addAndEditForm.relationshipName" size="mini"/>
                </el-form-item>
                <el-form-item label="关系描述：" prop="relationshipDescription">
                  <el-input type="textarea" v-model.trim="addAndEditForm.relationshipDescription" size="mini"/>
                </el-form-item>
                <el-form-item label="涉及对象：">
                  <el-button type="primary" size="mini" @click="addAboutObjShow()" class="zengjia">
                    <svg-icon icon-class="zengjia" ></svg-icon>  新增</el-button>
                  <div class="aboutObj-table-box" style="padding-top:10px">
                    <el-form :model="addAndEditForm" :rules="aboutObjRules"  ref="aboutObjRules">
                      <el-table :data="addAndEditForm.aboutObj" style="width: 100%" size="mini" border
                        :header-cell-style="{background:'#f8f8f9'}" >
                        <el-table-column label="源标准类型" min-width="50" align="center">
                          <template slot-scope="scope" >
                            <el-form-item :prop="'aboutObj.' + scope.$index + '. fromClassifierId'">
                              <el-select v-model="scope.row.fromClassifierId" placeholder="请选择" size="mini">
                                <el-option v-for="(item,index) in srcStandardTypeList" :key="index" :label="item.classifierName" :value="item.classifierId"></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column label="目标标准类型" min-width="50" align="center">
                          <template slot-scope="scope" >
                            <el-form-item :prop="'aboutObj.' + scope.$index + '.toClassifierId'">
                              <el-select v-model="scope.row.toClassifierId" placeholder="请选择" size="mini">
                                <el-option v-for="(item,index) in srcStandardTypeList" :key="index" :label="item.classifierName" :value="item.classifierId"></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" min-width="30">
                          <template slot-scope="scope">
                            <div style="text-align: center">
                              <el-button type='text' @click="delAboutObjRow(scope.row)" class="aboutObj-shanchu">
                                <svg-icon icon-class="blackdelete" ></svg-icon> 
                              </el-button>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form>
                  </div>
                </el-form-item>
                <el-form-item label="可用于关系维护页面：" label-width="200px" prop="usable">
                  <el-select v-model="addAndEditForm.usable" size="mini">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click.native="save">确定</el-button>
            </div>
          </el-dialog>
        </div>
        <div id="detail-dialog">
          <el-dialog :visible.sync="isDetailVisible" title="详情" class="detail_dialog" width="700px">
            <div class="dialog-content">
              <el-row>
                <el-col :span="4"><span>关系代码：</span></el-col>
                <el-col :span="20">{{ detailData.relationshipId }}</el-col>
              </el-row>
              <br>
              <el-row>
                <el-col :span="4"><span>关系名称：</span></el-col>
                <el-col :span="20">{{ detailData.relationshipName }}</el-col>
              </el-row>
              <br>
              <el-row>
                <el-col :span="4"><span>关系描述：</span></el-col>
                <el-col :span="20">{{ detailData.relationshipDescription }}</el-col>
              </el-row>
              <br>
              <el-row>
                <el-col :span="4"><span>涉及对象：</span></el-col>
                <el-col :span="20">
                  <el-table :data="detailData.aboutObj" style="width: 100%" size="mini" border
                        :header-cell-style="{background:'#f8f8f9'}" >
                    <el-table-column label="源标准类型" prop="fromClassifierId" align="center">
                    </el-table-column>
                    <el-table-column label="目标标准类型" prop="toClassifierId" align="center">
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <br>
              <el-row>
                <el-col :span="7"><span>可用于关系维护页面：</span></el-col>
                <el-col :span="17">{{ detailData.usable ==1 ? '是':'否'}}</el-col>
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
import { post, get } from '@/utils/request'
export default{
  components: { Pagination },
  name: 'ralationalType',
  data() {
    return {
      // 搜索
      searchForm: {
        keyword: ''
      },
      // 详情
      isDetailVisible: false,
      detailData: {
        relationshipId: '',
        relationshipName: '',
        relationshipDescription: '',
        aboutObj: [],
        usable: ''
      },
      // 删除
      tableChecked: [], // 存储所选中的row
      tableData: [],
      // 新增和编辑
      isformVisible: false, // 是否显示新增和编辑对话框
      isEdit: false, // 是否是编辑
      oldRelationshipId: '', // 编辑时用于存储原来的RelationshipId
      addAndEditForm: {
        relationshipId: '',
        relationshipName: '',
        relationshipDescription: '',
        aboutObj: [],
        usable: ''
      },
      rules: {
        relationshipId: [
          { required: true, message: '请填关系代码', trigger: 'blur' }
        ],
        relationshipName: [
          { required: true, message: '请填关系名称', trigger: 'blur' }
        ],
        aboutObj: [
          { required: true, message: '请填关系涉及对象', trigger: 'blur' }
        ],
        usable: [
          { required: true, message: '请填选择是否可用于关系维护页面', trigger: 'blur' }
        ]
      },
      // 涉及对象
      // 新增或编辑涉及对象时对源标准类型、目标标准类型的验证
      aboutObjRules: {
        fromClassifierId: [
          { required: true, message: '请填源标准类型', trigger: 'blur' }
        ],
        toClassifierId: [
          { required: true, message: '请填目标标准类型', trigger: 'blur' }
        ]
      },
      srcStandardTypeList: [], // 涉及对象源标准类型选择列表
      // tarStandardTypeList: [], // 涉及对象目标标准类型选择列表
      title: "新增",
      // paganation数据
      icurrentPage: 1,
      ipageSize: 10,
      total: 10,
      showToolTip: true
    }
  },
  methods: {
    // 详情
    detailDataShow() {
      let _this = this;
      let selectRow = _this.$refs.table.selection
      let len = selectRow.length
      if (len !== 1) {
        _this.$message.warning("请选中一条数据")
        return
      } else {
        _this.detailData.aboutObj = []
        _this.tableChecked = []
        _this.tableChecked.push(selectRow[0].relationshipId)
        let relationshipId = _this.tableChecked.join(',')
        get('/sysMaintain/relationship/getRelationshipDetail', { relationshipId }).then(res => {
          if (res.code === 10000 && res.success === true) {
            _this.detailData.relationshipId = res.data.relationshipId
            _this.detailData.relationshipName = res.data.relationshipName
            _this.detailData.relationshipDescription = res.data.relationshipDescription
            _this.detailData.usable = res.data.usable
            for (let index = 0; index < res.data.classifiers.length; index++) {
              let obj = {
                fromClassifierId: res.data.classifiers[index][0].classifierName,
                toClassifierId: res.data.classifiers[index][1].classifierName
              }
              _this.detailData.aboutObj.push(obj)
            }
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
      this.addAndEditForm.aboutObj = []
      this.title = "新增"
      this.isformVisible = true
    },
    // 打开编辑对话框
    editDataShow() {
      let _this = this;
      let selectRow = _this.$refs.table.selection
      let len = selectRow.length
      if (len !== 1) {
        _this.$message.warning("请选中一条数据")
        return
      } else {
        _this.addAndEditForm.aboutObj = []
        _this.resetForm()
        _this.getEditDetail(selectRow)
        _this.isEdit = true
        _this.title = "编辑"
        _this.isformVisible = true
      }
    },
    getEditDetail(selectRow) {
      let _this = this;
      _this.tableChecked = []
      _this.tableChecked.push(selectRow[0].relationshipId)
      let relationshipId = _this.tableChecked.join(',')
      get('/sysMaintain/relationship/getRelationshipDetail', { relationshipId }).then(res => {
        if (res.code === 10000 && res.success === true) {
          _this.addAndEditForm.relationshipId = res.data.relationshipId
          _this.addAndEditForm.relationshipName = res.data.relationshipName
          _this.addAndEditForm.relationshipDescription = res.data.relationshipDescription
          _this.addAndEditForm.usable = res.data.usable
          _this.oldRelationshipId = res.data.relationshipId
          for (let index = 0; index < res.data.classifiers.length; index++) {
            let obj = {
              fromClassifierId: res.data.classifiers[index][0].classifierId,
              toClassifierId: res.data.classifiers[index][1].classifierId
            }
            _this.addAndEditForm.aboutObj.push(obj)
          }
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    // 新增或编辑保存
    save() {
      this.$refs.addandeditform.validate(valid => {
        if (valid) {
          let classifiers = JSON.stringify(this.addAndEditForm.aboutObj)
          let params = {
            classifiers: classifiers,
            relationshipId: this.addAndEditForm.relationshipId,
            relationshipName: this.addAndEditForm.relationshipName,
            relationshipDescription: this.addAndEditForm.relationshipDescription,
            usable: this.addAndEditForm.usable
          }
          if (this.isEdit) {
            params.oldRelationshipId = this.oldRelationshipId
            post('/sysMaintain/relationship/editRelationshipType', params).then(res => {
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
            post('/sysMaintain/relationship/createRelationshipType', params).then(res => {
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
      this.isEdit = false
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
        _this.tableChecked.push(selectRow[i].relationshipId)
      }
      this.$confirm('是否确认删除选中数据？', '删除数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = _this.tableChecked.join(',')
        post('/sysMaintain/relationship/removeRelationshipType', { relationshipIds: ids }).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.$message.success(res.message)
            this.queryTableList();
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    // 搜索
    searchTableList() {
      this.icurrentPage = 1
      this.queryTableList()
    },
    // 关系列表
    queryTableList() {
      post('/sysMaintain/relationship/listRelationshipType', {
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
    listStandardType() {
      get('/sysMaintain/relationship/listStandardType').then(res => {
        if (res.code === 10000 && res.success === true) {
          this.srcStandardTypeList = res.data
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
    },
    // 涉及对象
    // 显示新增涉及对象的table
    addAboutObjShow() {
      let obj = {
        fromClassifierId: "",
        toClassifierId: ""
      };
      this.addAndEditForm.aboutObj.push(obj);
    },
    // 根据数组对象的某个value值来移除该项
    removeByValue(arr, attr, value) { // 数组，属性，属性值
      var index = 0;
      for (var i in arr) {
        if (arr[i][attr] === value) {
          index = i;
          break;
        }
      }
      arr.splice(index, 1);
    },
    // 删除当前行（涉及对象）
    delAboutObjRow(row) {
      this.removeByValue(this.addAndEditForm.aboutObj, 'fromClassifierId', row.fromClassifierId)
    }
  },
  created() {
    this.showToolTip = true
    this.listStandardType();
    this.queryTableList();
  },
  activated() {
    this.showToolTip = true
  },
  deactivated() {
    this.showToolTip = false
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
       .yulanbt{
            padding:4px 9px 6px 8px;
            .svg-icon{
                width:18px;
                height:18px;
                top:2px;
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
            padding:2px 9px 6px 8px;
            .svg-icon{
                width:18px;
                height:20px;
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
      .dialog-box2{
        /deep/ .el-dialog__body{
          text-align: center
        }
      }
      .dialog-form{
        width:540px;
        margin-left:0px;
        /deep/ .el-form-item__label{
          font-weight:400;
          font-size:14px;
          line-height:26px;
          padding-right: 10px
        }
      }
      .aboutObj-shanchu{
        padding:5px 10px 7px 9px;
            .svg-icon{
                width:18px;
                height:18px;
                top:1px;
            }     
      }
      .dialog-content{
        width:540px;
        margin:0px;
      }
    }
  }
}
</style>
