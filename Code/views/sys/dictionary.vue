<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <div id="dict-form">
          <el-form :inline="true">
            <div id="btn-announce-delete" style="display:inline">
              <el-button type="danger" icon="el-icon-delete" @click="goBatchRemoveDict" size="mini">批量删除</el-button>
              <el-button type="primary" icon="el-icon-plus"  @click="goAddDict" size="mini">新增字典</el-button>
            </div>
            <div class="form-float" style="display:inline">
              <el-form-item label="关键字:">
                <el-input v-model.trim="query.keyword" @keyup.enter.prevent.native="onSearch" placeholder="请输入..." size="small" style="width:310px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch" size="small">查询</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div id="dict-dialog">
          <el-dialog :title="sTitle" :visible.sync="bDialogVisible" style="font-size:12px">
            <el-form :model="oForm" :rules="rules" ref="dictForm">
              <el-form-item label="字典|代码:" :label-width="sFormLabelWidth" prop="dictCode">
                <el-input v-model.trim="oForm.dictCode" :disabled="bDictCodeDisabled" placeholder="请输入" auto-complete="off" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="字段代码说明：" :label-width="sFormLabelWidth" prop="codeDesc">
                <el-input placeholder="请输入" v-model.trim="oForm.codeDesc" auto-complete="off" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="代码值：" :label-width="sFormLabelWidth" prop="dictValue">
                <el-input placeholder="请输入" :disabled="bDictValueDisabled" v-model.trim="oForm.dictValue" auto-complete="off" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="代码值说明：" :label-width="sFormLabelWidth" prop="dictName">
                <el-input placeholder="请输入" :disabled="bDictNameDisabled" v-model.trim="oForm.dictName" auto-complete="off" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="排序：" :label-width="sFormLabelWidth" prop="seq">
                <el-input placeholder="请输入" v-model.trim="oForm.seq" auto-complete="off" size="mini"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="bDialogVisible = false" size="mini">取 消</el-button>
              <el-button type="primary" :loading="bLoading" :disabled="bDisabled" @click="handDictForm" size="mini">保 存</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
      <div id="dict-table">
        <el-table
          ref="dictTable"
          border
          show-header
          v-loading="bTableLoading"
          :data="aTableData"
          stripe
          :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
          :default-sort = "{prop: 'date', order: 'descending'}"
          @row-click="handRowClick"
          style="width: 100%">
          <el-table-column
            style="width: 60px"
            type="selection">
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            :index="indexMethod"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="dictCode"
            label="字段|代码">
          </el-table-column>
          <el-table-column
            prop="codeDesc"
            label="字段代码说明">
          </el-table-column>
          <el-table-column
            prop="dictValue"
            label="字段|代码取值">
          </el-table-column>
          <el-table-column
            prop="dictName"
            label="取值说明">
          </el-table-column>
          <el-table-column
            prop="seq"
            label="排序"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click.stop="goEditDict(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" plain @click.stop="goRemoveDict(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div id="divpage" class="div-page">
        <div class="block">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="query.size"
            layout="total, prev, pager, next,sizes,jumper"
            :total="iTotal">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import { get, postByJson, parseAjaxResponse } from '@/utils/request'
  import { post } from '../../utils/request'

  export default{
    name: 'dictionary',
    data() {
      let checkSeq = (rule, value, callback) => {
        if (!value) {
          callback()
        }
        setTimeout(() => {
          if (!/^\d+$/.test(value)) {
            callback(new Error('请输入数字'))
          } else if (value < 1) {
            callback(new Error('请输入一个大于零的数字'))
          } else {
            callback()
          }
        }, 700)
      }
      return {
        bDialogVisible: false,
        oForm: {
          dictCode: '',
          codeDesc: '',
          dictValue: '',
          dictName: '',
          seq: ''
        },
        url: '',
        sTitle: '',
        bLoading: false,
        bDisabled: false,
        bDictCodeDisabled: false,
        bDictValueDisabled: false,
        bDictNameDisabled: false,
        sFormLabelWidth: '120px',
        rules: {
          dictCode: [
            { required: true, message: '请输入字段或代码' }
          ],
          dictValue: [
            { required: true, message: '请输入代码取值' }
          ],
          dictName: [
            { required: true, message: '请补充代码说明' }
          ],
          seq: [
            { validator: checkSeq, trigger: 'blur' }
          ]
        },
        aTableData: [],
        bTableLoading: false,
        aRemoveDict: [],
        query: {
          keyword: '',
          current: 1,
          size: 10
        },
        iTotal: 0
      }
    },
    methods: {
      goBatchRemoveDict() {
        let _this = this
        let selectRow = _this.$refs.dictTable.selection
        let len = selectRow.length
        if (len === 0) {
          this.$message.info("请选中要删除的字典")
          return
        }
        this.$confirm('确定删除勾选的字典吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.aRemoveDict.length = 0
          for (let i = 0; i < len; i++) {
            let row = selectRow[i]
            let dictCode = row.dictCode
            let dictValue = row.dictValue
            _this.aRemoveDict.push({
              dictCode, dictValue
            })
          }
          _this.removeDict()
        })
      },
      onSearch() {
        this.query.current = 1
        this.queryDict()
      },
      goEditDict(row) {
        this.sTitle = '编辑字典'
        this.bDialogVisible = true
        this.oForm.dictCode = row.dictCode
        this.oForm.codeDesc = row.codeDesc
        this.oForm.dictValue = row.dictValue
        this.oForm.dictName = row.dictName
        this.oForm.seq = row.seq
        this.bDictCodeDisabled = true
        this.bDictNameDisabled = true
        this.bDictValueDisabled = true
        this.url = '/sys/dict/edit'
      },
      goAddDict() {
        this.resetForm()
        this.sTitle = '新增字典'
        this.bDialogVisible = true
        this.bDictCodeDisabled = false
        this.bDictNameDisabled = false
        this.bDictValueDisabled = false
        this.url = '/sys/dict/add'
        // 重置表单
        if (this.$refs['dictForm'] !== undefined) {
          this.$refs['dictForm'].resetFields()
        }
      },
      goRemoveDict(row) {
        let dictCode = row.dictCode
        let dictValue = row.dictValue
        this.$confirm(`确定删除字典【${dictCode}】-【${dictValue}】`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 清空数组
          this.aRemoveDict.length = 0
          this.aRemoveDict.push({ dictCode, dictValue })
          this.removeDict()
        })
      },
      removeDict() {
        let _this = this
        postByJson('/sys/dict/remove', this.aRemoveDict).then(res => {
          parseAjaxResponse(res, () => {
            _this.queryDict()
          })
        })
      },
      handleSizeChange(val) {
        this.query.current = 1
        this.query.size = val
        this.queryDict()
      },
      handleCurrentChange(val) {
        this.query.current = val
        this.queryDict()
      },
      queryDict() {
        let _this = this
        _this.bTableLoading = true
        get('/sys/dict/list', _this.query).then(res => {
          _this.bTableLoading = false
          parseAjaxResponse(res, () => {
            const data = res.data
            _this.iTotal = data.total
            _this.query.current = data.current
            _this.aTableData = data.records
          })
        })
      },
      handRowClick(row) {
        // 单击一行选中checkbox
        this.$refs.dictTable.toggleRowSelection(row)
      },
      handDictForm() {
        let _this = this
        this.$refs.dictForm.validate((valid) => {
          if (valid) {
            _this.bLoading = true
            post(_this.url, _this.oForm).then(res => {
              _this.bLoading = false
              parseAjaxResponse(res, () => {
                _this.bDialogVisible = false
                _this.$message.info(res.message)
                _this.queryDict()
              })
            })
          } else {
            return false
          }
        })
      },
      indexMethod(index) {
        return index + 1
      },
      resetForm() {
        this.oForm = {
          dictCode: '',
          codeDesc: '',
          dictValue: '',
          dictName: '',
          seq: ''
        }
      }
    },
    mounted() {
      this.queryDict()
    }
  }
</script>
<style lang="scss" scoped>
  .form-float{float:right}

  .div-page{text-align: center;padding-top: 10px}

  #dict-form .el-form-item__label{
    font-size:12px;
  }
  #dict-form .el-input__inner{
    height:30px
  }
  #announce-table .el-table--border td{
    border-right:none
  }
  #announce-table .el-table--border th{
    border-right:none
  }
  #announce-table .el-table{
    font-size:12px
  }
  #dict-dialog .el-form-item__label{
    font-size:12px;
    text-align:right;
  }
  #dict-dialog .el-dialog__title{
    font-size:14px;
    color:#17233d;
    font-weight:700
  }
  #dict-dialog .el-dialog__header{
    border-bottom:1px solid #e8eaec;
  }
  #dict-dialog .el-dialog__footer{
    border-top:1px solid #e8eaec;
  }
</style>
