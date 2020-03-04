<template>
  <div class="center-container" style="background-color:#fff">
    <div id="top-div" style="padding:10px">
      <div id="button-box" style="float:left;">
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="">新增用户</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" size="mini" @click="">重置密码</el-button>
      </div>
      <div id="topright-form" style="float:right;">
        <el-form :model="searchQuery" label-width="90" inline size="mini">
          <el-form-item prop="loginName" label="用户名：">
            <el-input v-model.trim="searchQuery.loginName" @keyup.enter.native="onSearch" placeholder="请输入..."  style="width:150px" clearable></el-input>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="onSearch">查询</el-button>
        </el-form>
      </div>
    </div>
    <div id="table-div" style="clear:both;padding:10px">
      <el-table
        ref="jobTable"
        :data="aTableData"
        v-loading="bTableLoading"
        show-header
        stripe
        size="mini"
        style="width: 100%;"
        :highlight-current-row="true"
        :header-cell-style="{background:'#f8f8f9',color:'#606266',height:'45px'}"
        @row-click="handleRowClick"
      >
        <el-table-column
          type="selection"
          width="60">
        </el-table-column>
        <el-table-column
          label="序号"
          type="index"
          align="center"
          :index="indexMethod"
          width="50">
        </el-table-column>
        <el-table-column
          label="用户名"
          prop="userId"
          width="200">
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="userName"
          width="200">
        </el-table-column>
        <el-table-column
          label="性别"
          prop="sex"
          width="50">
        </el-table-column>
        <el-table-column
          label="邮箱地址"
          prop="email"
          width="200">
        </el-table-column>
        <el-table-column
          label="手机号码"
          prop="mobilePhone"
          width="200">
        </el-table-column>
        <el-table-column
          label="所属部门"
          prop="groupName"
          width="200">
        </el-table-column>
        <el-table-column
          label="是否内置"
          prop="builtIn"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          width="380">
          <template slot-scope="scope">
            <el-button @click.stop="" type="primary" plain size="mini">查 看</el-button>
            <el-button @click.stop="" type="primary" plain size="mini">修 改</el-button>
            <el-button @click.stop="" type="danger" :loading="bLoading" plain size="mini">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="paganation" style="text-align:right">
      <pagination  :total="total" :page.sync="searchQuery.current"  :limit.sync="searchQuery.size"/>
    </div>
    <div class="dialog-user">
      <div>
        <el-dialog :visible.sync="bJobDialogVisible" :title="title" width="520px">
          <el-form :model="oJobForm" label-width="100px" :rules="rules" ref="userForm">
            <el-form-item label="用户名：" prop="userId">
              <el-input v-model.trim="oJobForm.userId"  size="mini"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click.native="bJobDialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click.native="handleSubmit" :loading="bLoading" size="mini">保 存</el-button>
          </div>
        </el-dialog>
      </div>

    </div>
  </div>
</template>
<script>
export default {
  name: 'trigger',
  data() {
    return {
      searchQuery: {
        loginName: '',
        current: '',
        size: ''
      },
      total: '',
      aTableData: [],
      bTableLoading: false,
      bLoading: false,
      bJobDialogVisible: false,
      title: '',
      oJobForm: {},
      rules: {
        userId: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSearch() {
    },
    handleRowClick(row) {
      // 单击一行选中checkbox
      this.$refs.jobTable.toggleRowSelection(row)
    },
    handleSubmit() {

    },
    indexMethod(index) {
      return index + 1
    }
  },
  mounted: {}
}
</script>
<style lang="scss">
.center-container {

}
</style>
