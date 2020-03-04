<template>
  <div class="version-hole p10 tableNoPadding">
    <!-- 数据源管理 -->
    <el-card class="version-form" shadow="hover">
      <el-form :inline="true" :model="versionForm" class="demo-form-inline">
        <el-form-item label="定版日期：">
          <el-date-picker
            v-model="versionForm.date"
            type="daterange"
            range-separator="-"
            value-format="yyyy-MM-dd"
            size='mini'
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否基线：">
          <el-select v-model="versionForm.isBsLine" clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in bsLineList"
              :key="index"
              :label="item.textField"
              :value="item.valueField"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="name-input" label="版本编号：">
          <el-input v-model="versionForm.number" placeholder="版本编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="searchDisabled" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="version-context">
      <div slot="header" class="clearfix btn-box">
        <el-button @click="setVersion" class="add-btn" type="primary">
          <svg-icon icon-class="version"></svg-icon>
          <span class="text">定版</span>
        </el-button>
        <el-button @click="handleContrast" class="add-btn" type="primary">
          <svg-icon icon-class="contrast"></svg-icon>
          <span class="text">比对</span>
        </el-button>
      </div>
      <div class="data-table">
        <el-table
          border
          size="small"
          v-loading='tableLoading'
          :header-cell-style="headerClass"
          :data="tableData"
          style="width: 100%"
          :cell-style='isClass'
          >
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="verName" label="版本编号" sortable></el-table-column>
          <el-table-column prop="verType" label="是否基线" sortable>
            <template slot-scope="scope">
               {{scope.row.verType === '1' ? '是' : '否'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userId" label="定版人员" sortable></el-table-column>
          <el-table-column show-overflow-tooltip prop="createTime" label="定版时间" sortable></el-table-column>
          <el-table-column show-overflow-tooltip prop="verDesc" label="版本描述" sortable></el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                <el-button @click="toDetail(scope.row)" type="text" size="small" >
                  <svg-icon icon-class="preview" class="preview"></svg-icon>
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 10px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageCurrent"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { get } from "@/utils/request";
export default {
  name: 'versionManagement',
  data() {
    return {
      // 表格loading
      tableLoading: true,
      // 搜索框数据
      versionForm: {
        date: "", // 定版日期
        number: "", // 版本编号
        isBsLine: "" // 是否基线
      },
      // 0-普通版本;1-基线版本
      bsLineList: [
        {
          textField: '是',
          valueField: 1
        },
        {
          textField: '否',
          valueField: 0
        }
      ],
      tableData: [], // 表格数据
      keyword: "", // 关键字
      pageCurrent: 1,
      pageSize: 10,
      total: 0,
      searched: false, // 是否搜索了，避免未搜索带查询条件翻页查询
      searchDisabled: false // 是否禁用搜索按钮，防止多次快速点击查询
    };
  },
  methods: {
    // 表头 select 右边框
    headerClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return { 'borderRight': 'unset', 'background': '#f8f8f9', 'color': '#606266' }
      } else {
        return { 'background': '#f8f8f9', 'color': '#606266' }
      }
    },
    // 表格 select 右边框
    isClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return { 'borderRight': 'unset' }
      }
    },
    // 查询
    handleSearch() {
      // this.pageSize = 10;
      this.pageCurrent = 1;
      console.log(this.versionForm)
      this.searchDisabled = true
      this.searched = true
      this.getTableData();
    },
    // 获取表格数据
    getTableData() {
      this.tableLoading = true
      let params = {}
      if (this.searched) {
        params = {
          current: this.pageCurrent, // 当前页
          firstDate: this.versionForm.date ? this.versionForm.date[0] : '', // 日期-小
          secondDate: this.versionForm.date ? this.versionForm.date[1] : '', // 日期-大
          size: this.pageSize, // 显示条数
          userName: '', // 定版人员
          verDesc: '', // 版本描述
          verName: this.versionForm.number, // 版本编号
          verType: this.versionForm.isBsLine // 是否基线
        }
      } else {
        params = {
          current: this.pageCurrent, // 当前页
          size: this.pageSize, // 显示条数
          userName: '', // 定版人员
          verDesc: '' // 版本描述
        }
      }
      for (let i in params) {
        if (params[i] === '') {
          delete params[i];
        }
      }
      get('/mdVersion/listVersion', params).then(
        res => {
          console.log(res)
          if (res.code === 10000 && res.success) {
            this.tableData = res.data.records
            this.total = res.data.total
            this.tableLoading = false
            this.searchDisabled = false
          } else {
            this.$message.error(res.message)
          }
        }
      )
    },
    // 跳转详情
    toDetail(item) {
      console.log(item)
      this.$router.push({
        name: 'versionDetail',
        params: {
          row: item,
          id: item.verId,
          _title: item.verName
        }
      })
    },
    handleSizeChange(val) {
      this.pageCurrent = 1
      this.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pageCurrent = val
      this.getTableData()
    },
    // 定版
    setVersion() {
      this.$router.push({
        name: 'addVersion'
      })
    },
    // 对比
    handleContrast() {

    }
  },
  watch: {
    versionForm: {
      handler(newVal, oldVal) {
        console.log('change')
        this.searched = false
      },
      deep: true
    }
  },
  computed: {
  },
  created() {
    this.getTableData()
  },
  activated() {
    this.getTableData()
  }
};
</script>

<style lang='scss' scoped>
.el-select-dropdown__item {
  padding: 0;
  text-align: center;
}
.version-hole /deep/ {
  .version-form {
    .el-card__body {
      // padding: 16px;
      padding: 20px 30px;
      // padding-top: 26px;
    }
    .el-form-item {
        margin-bottom: 0;
        margin-right: 20px;
        .el-form-item__label {
          font-size: 12px;
          padding: 0 5px 0 0;
        }
        .el-input__inner {
          font-size: 12px;
          height: 32px;
        }
        .el-select {
          width: 100px;
        }
        .el-input__icon {
          height: 32px;
          line-height: 32px;
        }
      }
      .el-date-editor {
        width: 240px;
        // bottom: 2px;
      }
  }
  .version-context {
    padding: 20px 40px;
    margin-top: 10px;
    .btn-box {
      .svg-icon {
        width: 17px;
        height: 17px;

      }
    }
    .el-card__body {
      padding: 0;
      // padding-top: 26px;
      
    }
    .el-card__header {
      border-bottom: unset;
      padding: 0;
      margin-bottom: 20px;
    }
  }
  .el-button {
    height: 32px;
    line-height: 32px;
    padding: 0 15px;
    position: relative;
    span {
      font-size: 13px;
    }
  }
  .add-btn {
    // width: 85px;
    font-size: 13px;
    padding: 0px 8px;
    // height: 30px;
    .text {
      margin-left: 3px;
    }
  }
  // .el-form-item {
  //   margin-bottom: 12px;
  //   .el-form-item__label {
  //     font-size: 12px;
  //   }
  //   .el-input__inner {
  //     font-size: 12px;
  //     height: 32px;
  //   }
  // }
  .dataTable-icon {
    position: absolute;
    display: inline-block;
    width: 20px;
    height: 20px;
    left: 10px;
    top: 6px;
  }
  .add {
    background: url(../../../src/assets/images/commonIcon/add.png) no-repeat;
    background-size: 100%;
  }
  // .preview {
  //   background: url(../../../src/assets/images/commonIcon/preview.png) no-repeat;
  //   background-size: 100%;
  // }
  // .edit {
  //   background: url(../../../src/assets/images/commonIcon/edit.png) no-repeat;
  //   background-size: 100%;
  // }
  // .del {
  //   background: url(../../../src/assets/images/commonIcon/del.png) no-repeat;
  //   background-size: 100%;
  // }
  .link {
    background: url(../../../src/assets/images/commonIcon/link-test.png)
      no-repeat;
    background-size: 100%;
  }
  // .el-select {
  //   width: 100px;
  // }
  .name-input {
    .el-input {
      width: 180px;
    }
  }
  // 弹窗样式
  .el-dialog__header {
    border-bottom: 1px solid #e8eaec;
    padding: 14px 16px 10px;
    line-height: 1;
    color: #515a6e;
    font-size: 12px;
    span {
      display: inline-block;
      width: 100%;
      line-height: 30px;
      font-size: 14px;
      color: #17233d;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .el-dialog__body {
    padding: 10px 14px;
    .el-form-item {
      margin-bottom: 25px;
    }
  }
  .el-dialog__footer {
    text-align: center;
    border-top: 1px solid #e8eaec;
  }
  .second-tab {
    .link-btn {
      padding-left: 35px;
      margin: 40px 0 10px;
    }
    .el-form {
      overflow: hidden;
    }
  }
  .form-conntype {
    .el-form-item__content {
      margin-left: 50px !important;
      .el-select {
        width: 100%;
      }
    }
  }
  .data-table{
    .el-button{
      padding:0;
    }
    .preview,.deleteRed,.editor{
      width:22px;
      height:22px;
    }
  }
}
</style>
