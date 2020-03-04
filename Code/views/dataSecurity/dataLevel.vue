<template>
  <div class="data-level">
    <el-card class="box-card">
      <div class="btn-box">
        <el-button class="page-btn"
                   type="primary"
                   @click="goAdd"
                   v-permission="'DATA_LEVEL_CREATE'"
                   size="small"><i class="add-icon"></i>新增分级</el-button>
      </div>
      <el-table :data="aTableData"
                v-loading="bLoading"
                border
                size="small"
                style="width: 100%"
                header-cell-class-name="table-header"
                cell-class-name="table-center">
        <el-table-column prop="dataLevel"
                         label="数据级别"
                         width="180">
        </el-table-column>
        <el-table-column prop="importantLevel"
                         label="重要程度"
                         width="180">
        </el-table-column>
        <el-table-column prop="divideBasis"
                         label="划分依据">
        </el-table-column>
        <el-table-column prop="createData"
                         label="创建时间">
        </el-table-column>
        <el-table-column prop="createUser"
                         label="创建人">
        </el-table-column>
        <el-table-column prop="updateData"
                         label="最后更新时间">
        </el-table-column>
        <el-table-column prop=""
                         label="状态"
                         width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state"
                       :width="60"
                       active-color="#09e"
                       active-text="启用"
                       inactive-color="#ddd"
                       inactive-text="废止"
                       @change="editState($event, scope.row.levelId)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop=""
                         width="150"
                         label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="预览" placement="bottom">
              <el-button @click="edit(scope.row, 0)" type="text" size="small" >
                <svg-icon icon-class="preview" class="preview"></svg-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
              <el-button  @click="edit(scope.row, 1)" v-permission="'DATA_LEVEL_EDIT'" type="text" size="small" >
                <svg-icon icon-class="editor" class="editor"></svg-icon>
              </el-button>
            </el-tooltip>
            <!-- <el-button class="page-btn"
                       type="primary"
                       @click="edit(scope.row, 0)"
                       size="small"><i class="preview-icon"></i>预览</el-button> -->
            <!-- <el-button class="page-btn"
                       type="warning"
                       v-permission="'DATA_LEVEL_EDIT'"
                       @click="edit(scope.row, 1)"
                       size="small"><i class="edit-icon"></i>修改</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageCurrent"
                     :page-sizes="[10, 20, 30, 40]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="iTotal">
      </el-pagination>
    </el-card>
    <el-dialog :title="sTitle"
               :visible.sync="bShowPopup"
               @close="closePopup"
               width="30%">
      <el-form :model="oForm"
               :rules="rules"
               ref="oForm"
               size="mini"
               class="form-box"
               label-width="80px">
        <el-form-item label="数据级别"
                      prop="dataLevel">
          <el-input v-model="oForm.dataLevel"
                    :readonly="sPreview"></el-input>
        </el-form-item>
        <el-form-item label="重要程度"
                      prop="importantLevel">
          <el-input v-model="oForm.importantLevel"
                    :readonly="sPreview"></el-input>
        </el-form-item>
        <el-form-item label="划分依据"
                      prop="divideBasis">
          <el-input v-model="oForm.divideBasis"
                    :readonly="sPreview"></el-input>
        </el-form-item>
        <el-form-item label="数据特征"
                      prop="dataFeature">
          <el-input type="textarea"
                    v-model="oForm.dataFeature"
                    :readonly="sPreview"
                    :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="oForm.status"
                     :width="60"
                     :disabled="sPreview"
                     active-color="#09e"
                     active-text="启用"
                     inactive-color="#ddd"
                     inactive-text="废止">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   size="small"
                   @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { post } from '@/utils/request'

export default {
  name: 'dataLevel',
  components: {},
  data () {
    return {
      aTableData: [],
      bShowPopup: false, // 是否显示弹框
      sTitle: '新增分级', // 弹框标题
      sPreview: false, // 是否是预览
      pageCurrent: 1,
      pageSize: 10,
      iTotal: 0,
      bLoading: false,
      oForm: {
        dataLevel: '',
        importantLevel: '',
        divideBasis: '',
        dataFeature: '',
        status: false
      },
      rules: {
        dataLevel: [
          { required: true, message: '请填写数据级别', trigger: 'blur' }
        ],
        importantLevel: [
          { required: true, message: '请填写重要程度', trigger: 'blur' }
        ],
        divideBasis: [
          { required: true, message: '请填写划分依据', trigger: 'blur' }
        ],
        dataFeature: [
          { required: true, message: '请填写数据特征', trigger: 'blur' }
        ]
      },
      sLevelId: ''
    }
  },
  methods: {
    // 获取table数据
    getTableData () {
      this.aTableData = []
      this.bLoading = true
      post('/secure/dataLevel/listDataLevel', {
        current: this.pageCurrent,
        size: this.pageSize
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.iTotal = res.data.total
          res.data.records.forEach(i => {
            i.state = i.status === '1'
            this.aTableData.push(i)
          });
          this.bLoading = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleSizeChange (value) {
      this.pageSize = value
      this.getTableData()
    },
    handleCurrentChange (value) {
      this.pageCurrent = value
      this.getTableData()
    },
    // 保存或修改
    save () {
      this.$refs['oForm'].validate((valid) => {
        if (valid) {
          let sUrl = ''
          let params = {
            dataFeature: this.oForm.dataFeature,
            dataLevel: this.oForm.dataLevel,
            divideBasis: this.oForm.divideBasis,
            importantLevel: this.oForm.importantLevel,
            status: this.oForm.status === true ? '1' : '0'
          }
          if (this.sTitle === '新增分级') {
            sUrl = '/secure/dataLevel/createDataLevel'
          } else {
            sUrl = '/secure/dataLevel/editDataLevel'
            params.levelId = this.sLevelId
          }
          post(sUrl, params).then(res => {
            if (res.code === 10000 && res.success === true) {
              this.$message.success(res.message)
              this.bShowPopup = false
              this.getTableData()
              this.$refs['oForm'].resetFields();
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error('请按规则填写信息')
        }
      })
    },
    goAdd () {
      this.resetForm()
      this.sTitle = '新增分级'
      this.bShowPopup = true
    },
    edit (row, num) {
      if (num === 0) {
        this.sPreview = true
        this.sTitle = '分级预览'
      } else {
        this.sTitle = '分级修改'
        this.sLevelId = row.levelId
      }
      this.oForm.dataLevel = row.dataLevel
      this.oForm.importantLevel = row.importantLevel
      this.oForm.divideBasis = row.divideBasis
      this.oForm.dataFeature = row.dataFeature
      this.oForm.status = row.state
      this.bShowPopup = true
    },
    closePopup () {
      this.$refs['oForm'].resetFields();
      this.sPreview = false
      this.sLevelId = ''
    },
    // 开启或废止
    editState (value, sLevelId) {
      post('/secure/dataLevel/editDataLevelStatus', {
        levelId: sLevelId,
        status: value === true ? '1' : '0'
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.$message.success(res.message)
          this.getTableData()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    resetForm() {
      this.oForm = {
        dataLevel: '',
        importantLevel: '',
        divideBasis: '',
        dataFeature: '',
        status: false
      }
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  mounted () {

  },
  created () {
    this.getTableData()
  }
}
</script>


<style rel="stylesheet/scss" lang="scss">
@import "../../styles/variables";
@import "../../styles/switch";

.data-level {
  width: 100%;
  padding: 10px;
  background-color: $page-bg;
  .item{
      .preview,.editor{
        width:22px;
        height:22px;
      }
    }
  .box-card {
    .btn-box {
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid $border;
    }
  }

  // 页面按钮
  .page-btn {
    padding-left: 35px;
    span {
      position: relative;
      i {
        position: absolute;
        display: inline-block;
        width: 20px;
        height: 20px;
        left: -28px;
        top: -1px;
      }
      .add-icon {
        background: url("./../../assets/images/commonIcon/add.png") no-repeat;
        background-size: 100%;
      }
      .preview-icon {
        background: url("./../../assets/images/commonIcon/preview.png") no-repeat;
        background-size: 100%;
      }
      .edit-icon {
        background: url("./../../assets/images/commonIcon/edit.png") no-repeat;
        background-size: 100%;
      }
    }
  }

  // 表头样式
  .table-header {
    text-align: center;
    background-color: $table-column-bg;
  }
  .table-center {
    text-align: center;
  }

  .el-pagination {
    text-align: center;
    margin-top: 10px;
  }

  // 弹框样式
  .el-dialog__footer {
    text-align: center;
    border-top: 1px solid $border;
  }
  .el-dialog__header {
    border-bottom: 1px solid $border;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #17233d;
    font-weight: 700;
  }
  .form-box {
    .el-switch__label--left {
      left: 26px;
    }
    .el-switch__label--right {
      left: 0;
    }
    .el-form-item--mini.el-form-item {
      margin-bottom: 24px;
    }
    .el-form-item__error {
      line-height: 24px;
    }
  }
  .el-form-item.is-required:not(.is-no-asterisk)
    .el-form-item__label-wrap
    > .el-form-item__label:before,
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: "";
  }
}
</style>
