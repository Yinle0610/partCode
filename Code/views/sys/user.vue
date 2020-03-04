<template>
  <div class="user-box" style="background-color:#fff">
    <div id="top-div" style="padding:10px">
      <div id="button-box" style="float:left;">
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="goBatchRemoveUser">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="goAddUser">新增用户</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" size="mini" @click="goResetPwd">重置密码</el-button>
      </div>
      <div id="topright-form" style="float:right;">
        <el-form :model="searchQuery" label-width="90" inline size="mini">
					<el-form-item prop="groupName" label="所属部门：">
						<el-input v-model.trim="searchQuery.groupName" @keyup.enter.native="onSearch" placeholder="请输入..."  style="width: 150px" clearable></el-input>
					</el-form-item>
					<el-form-item prop="userName" label="姓名：">
						<el-input v-model.trim="searchQuery.userName" @keyup.enter.native="onSearch" placeholder="请输入..."  style="width:150px" clearable></el-input>
					</el-form-item>
          <el-form-item prop="loginName" label="用户名：">
            <el-input v-model.trim="searchQuery.loginName" @keyup.enter.native="onSearch" placeholder="请输入..."  style="width:150px" clearable></el-input>
          </el-form-item>
					<el-button type="primary" icon="el-icon-search" size="mini" @click="onSearch">查询</el-button>
				</el-form>
      </div>
    </div>
    <div id="table-div" style="clear:both;padding:10px">
      <el-table
        ref="userTable"
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
          width="50">
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
          :show-overflow-tooltip='showToolTip'
          prop="userId">
        </el-table-column>
        <el-table-column
          label="姓名"
          :show-overflow-tooltip='showToolTip'
          prop="userName">
        </el-table-column>
        <el-table-column
          label="性别"
          :show-overflow-tooltip='showToolTip'
          prop="sex">
        </el-table-column>
        <el-table-column
          label="邮箱地址"
          :show-overflow-tooltip='showToolTip'
          prop="email">
        </el-table-column>
        <el-table-column
          label="手机号码"
          :show-overflow-tooltip='showToolTip'
          prop="mobilePhone">
        </el-table-column>
        <el-table-column
        :show-overflow-tooltip='showToolTip'
          label="所属部门"
          prop="groupName">
        </el-table-column>
        <el-table-column
          label="是否内置"
          :show-overflow-tooltip='showToolTip'
          prop="builtIn">
        </el-table-column>
        <el-table-column
          min-width="280"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="bottom">
              <el-button @click.stop="goUserDetail(scope.row.userId)" type="text" size="small" >
                <svg-icon icon-class="preview" class="preview"></svg-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="bottom">
              <el-button @click.stop="goRoleAssign(scope.row)" type="text" size="small" >
                <svg-icon icon-class="people3" class="people3"></svg-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
              <el-button  @click.stop="goUserEdit(scope.row.userId)" type="text" size="small" >
                <svg-icon icon-class="editor" class="editor"></svg-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button  @click.stop='goRemoveUser(scope.row)' type="text" size="small" :loading="bLoading">
                <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
              </el-button>
            </el-tooltip>
              <!-- <el-button @click.stop="goUserDetail(scope.row.userId)" type="primary" plain size="mini">查 看</el-button> -->
              <!-- <el-button @click.stop="goRoleAssign(scope.row)" type="primary" plain icon="el-icon-user" size="mini">分配角色</el-button> -->
              <!-- <el-button @click.stop="goUserEdit(scope.row.userId)" type="primary" plain size="mini">修改</el-button> -->
              <!-- <el-button @click.stop="goRemoveUser(scope.row)" type="danger" :loading="bLoading" plain size="mini">删 除</el-button> -->
            </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: center;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchQuery.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchQuery.size"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total">
      </el-pagination>
    </div>
    <div class="dialog-user">
      <div>
        <el-dialog :visible.sync="bUserDialogVisible" :title="title" width="520px">
          <el-form :model="oUserForm" label-width="100px" :rules="rules" ref="userForm">
            <el-form-item label="用户名：" prop="userId">
              <el-input v-model.trim="oUserForm.userId"  size="mini" :disabled="isEdit"/>
            </el-form-item>
            <el-form-item label="姓名：" prop="userName">
              <el-input v-model.trim="oUserForm.userName" size="mini"/>
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
              <el-radio-group v-model="oUserForm.sex">
                <el-radio :label="'1'">男</el-radio>
                <el-radio :label="'2'">女</el-radio>
                <el-radio :label="'0'">未知</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="邮箱地址:" prop="email">
              <el-input v-model.trim="oUserForm.email" size="mini"/>
            </el-form-item>
            <el-form-item label="手机号码:" prop="mobilePhone">
              <el-input v-model.trim="oUserForm.mobilePhone" size="mini"/>
            </el-form-item>
            <el-form-item label="座机号码:" prop="workPhone">
              <el-input v-model.trim="oUserForm.workPhone" size="mini"/>
            </el-form-item>
            <el-form-item label="用户描述:" prop="description">
              <el-input v-model.trim="oUserForm.description" size="medium" type="textarea" resize="none"
                    :rows="2" placeholder="用户描述"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click.native="bUserDialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click.native="handleSubmit" :loading="bLoading" size="mini">保 存</el-button>
          </div>
        </el-dialog>
      </div>
      <div id="detail-user">
        <el-dialog :visible.sync="isDetailVisible" title="详细信息" width="520px">
          <el-row>
            <el-col :span="4" class="el-col-label"><b>用户名：</b></el-col>
            <el-col :span="20">{{ userInfo.userId }}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4" class="el-col-label"><b>姓名：</b></el-col>
            <el-col :span="20">{{ userInfo.userName }}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4" class="el-col-label"><b>性别：</b></el-col>
            <el-col :span="20">{{ userInfo.sex === '1' ?  '男' : (userInfo.sex === '2' ? '女' : '未知')}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4" class="el-col-label"><b>邮箱地址：</b></el-col>
            <el-col :span="20">{{ userInfo.email }}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4" class="el-col-label"><b>手机号码：</b></el-col>
            <el-col :span="20">{{ userInfo.mobilePhone}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4" class="el-col-label"><b>座机号码：</b></el-col>
            <el-col :span="20">{{ userInfo.workPhone}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4" class="el-col-label"><b>所属角色：</b></el-col>
            <el-col :span="20">{{ userInfo.roleNames}}</el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4" class="el-col-label"><b>所属部门：</b></el-col>
            <el-col :span="20">{{ userInfo.groupName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="el-col-label"><b>用户描述：</b></el-col>
            <el-col :span="20">{{ userInfo.description}}</el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.native="isDetailVisible = false" size="mini">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div id="assign-user">
        <el-dialog :visible.sync="isAssignVisible" :title="sRoleAssignTitle" width="540px">
          <div id="transfer-user" style="text-align: center">
            <el-transfer
              style="text-align: left;"
              filterable
              :titles="['未分配角色', '已分配角色']"
              :button-texts="['撤回', '分配']"
              @change="handleChange"
              v-model="aAssignRoleIds"
              :data="aRoleData">
            </el-transfer>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click.native="isAssignVisible = false" size="mini">取消</el-button>
            <el-button type="primary" :loading="bLoading" @click.native="assignSubmit" size="mini">确定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { get, parseAjaxResponse } from '@/utils/request'
import { post } from '../../utils/request'

export default{
  name: 'user',
  data() {
    return {
      searchQuery: {
        groupName: '',
        userName: '',
        loginName: '',
        current: 1,
        size: 10
      },
      ids: [], // 存储所选中的row的id(这里的id是表的标志字段)
      // 新增
      bUserDialogVisible: false, // 是否显示新增对话框
      title: '',
      isEdit: false, // 是否是修改用户
      oUserForm: {
        userId: '',
        userName: '',
        sex: '1',
        email: '',
        mobilePhone: '',
        workPhone: '',
        description: ''
      },
      rules: {
        userId: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ]
      },
      url: '',
      bLoading: false,
      userInfo: {},
      isDetailVisible: false,
      // 分配角色
      isAssignVisible: false,
      sRoleAssignTitle: '',
      aRoleData: [],
      aAssignRoleIds: [],
      aTableData: [],
      bTableLoading: false,
      aCheckedUserIds: [],
      sCurrentUserId: '',
      total: 10,
      showToolTip: true
    }
  },
  methods: {
    onSearch() {
      this.searchQuery.current = 1
      this.queryUser()
    },
    queryUser() {
      let _this = this
      this.bTableLoading = true
      get('/sys/user/list', this.searchQuery).then((res) => {
        this.bTableLoading = false
        parseAjaxResponse(res, () => {
          let data = res.data
          _this.aTableData = data.records
          _this.searchQuery.current = data.current
          _this.total = data.total
        })
      })
    },
    // 批量删除相关函数
    handleSelectionChange(val) { // val是所选中的每一个row,包括row中的所有字段
      console.log("handleSelectionChange--", val)
      this.tableChecked = val
    },
    goBatchRemoveUser() {
      let _this = this;
      let selectRow = _this.$refs.userTable.selection
      let len = selectRow.length
      if (len === 0) {
        _this.$message.info("请选中要删除的用户")
        return
      }
      _this.aCheckedUserIds.length = 0
      for (let i = 0; i < len; i++) {
        let row = selectRow[i]
        if (row.builtIn === '是') {
          _this.$message.error("内置用户不能删除")
          return
        }
        let userId = row.userId
        _this.aCheckedUserIds.push(userId)
      }
      _this.$confirm('确实删除勾选的用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.removeUser()
      })
    },
    goAddUser() {
      this.resetUserForm()
      this.resetForm()
      this.bUserDialogVisible = true
      this.url = '/sys/user/create'
      this.title = '新增用户'
      this.isEdit = false
    },
    handleSubmit() {
      let _this = this
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          _this.bLoading = true
          post(_this.url, _this.oUserForm).then((res) => {
            _this.bLoading = false
            parseAjaxResponse(res, () => {
              _this.bUserDialogVisible = false
              _this.$message.success(res.message)
              _this.queryUser()
            })
          })
        } else {
          return false
        }
      })
    },
    goUserEdit(userId) {
      this.resetForm()
      let _this = this
      get('/sys/user/detailInfo/' + userId).then((res) => {
        parseAjaxResponse(res, () => {
          let userInfo = res.data
          _this.oUserForm.userId = userInfo.userId
          _this.oUserForm.userName = userInfo.userName
          _this.oUserForm.sex = userInfo.sex ? userInfo.sex : '0';
          _this.oUserForm.email = userInfo.email
          _this.oUserForm.mobilePhone = userInfo.mobilePhone
          _this.oUserForm.workPhone = userInfo.workPhone
          _this.oUserForm.description = userInfo.description
          this.bUserDialogVisible = true
          this.url = '/sys/user/edit'
          this.title = '修改用户'
          this.isEdit = true
        })
      })
    },
    goRemoveUser(row) {
      let userName = row.userName
      let userId = row.userId
      let _this = this
      if (row.builtIn === '是') {
        _this.$message.error("内置用户不能删除")
        return
      }
      this.$confirm(`确定删除用户【${userName}】吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清空数组
        _this.aCheckedUserIds.length = 0
        _this.aCheckedUserIds.push(userId)
        _this.removeUser()
      })
    },
    removeUser() {
      let _this = this
      _this.bLoading = true
      let userIds = _this.aCheckedUserIds.join(',')
      post('/sys/user/remove', { userIds }).then((res) => {
        _this.bLoading = false
        parseAjaxResponse(res, () => {
          _this.queryUser()
        })
      })
    },
    editSubmit() {
      this.isEditVisible = false
    },
    goUserDetail(userId) {
      // 从后端请求数据到editUserForm
      get('/sys/user/detailInfo/' + userId).then((res) => {
        parseAjaxResponse(res, () => {
          let roleNames = res.data.roleList.map((item) => item.roleName).join(',')
          this.userInfo = res.data
          this.userInfo.roleNames = roleNames
          this.isDetailVisible = true
        })
      })
    },
    // 角色分配
    goRoleAssign(row) {
      let _this = this
      let userId = row.userId
      let userName = row.userName
      get('/sys/role/listAllPlain').then((res) => {
        parseAjaxResponse(res, () => {
          _this.aRoleData = res.data.map((role) => {
            return {
              key: role.roleId,
              label: role.roleName,
              disabled: false
            }
          })
        })
      })
      get(`/sys/role/listRoleIds/${userId}`).then((res) => {
        parseAjaxResponse(res, () => {
          _this.aAssignRoleIds = res.data
        })
      })
      _this.sCurrentUserId = userId
      _this.sRoleAssignTitle = `${userName}-角色分配`
      _this.isAssignVisible = true
    },
    assignSubmit() {
      let _this = this
      _this.bLoading = true
      let userId = _this.sCurrentUserId
      let roleIds = _this.aAssignRoleIds.join(',')
      post('/sys/user/assignRoleToUser', { userId, roleIds }).then((res) => {
        _this.bLoading = false
        parseAjaxResponse(res)
      })
    },
    handleChange(val) {
      this.aAssignRoleIds = val
    },
    goResetPwd() {
      let _this = this;
      let selectRow = _this.$refs.userTable.selection
      let len = selectRow.length
      if (len === 0) {
        _this.$message.info("请选中要重置密码的用户")
        return
      }
      _this.aCheckedUserIds.length = 0
      for (let i = 0; i < len; i++) {
        let row = selectRow[i]
        let userId = row.userId
        _this.aCheckedUserIds.push(userId)
      }
      _this.$confirm('确定重置所选用户密码(默认密码888888)吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let userIds = _this.aCheckedUserIds.join(',')
        post('/sys/user/resetPwd', { userIds }).then((res) => {
          parseAjaxResponse(res)
        })
      })
    },
    indexMethod(index) {
      return index + 1
    },
    resetUserForm() {
      this.oUserForm = {
        userId: '',
        userName: '',
        sex: '1',
        email: '',
        mobilePhone: '',
        workPhone: '',
        description: ''
      }
    },
    handleRowClick(row) {
      // 单击一行选中checkbox
      this.$refs.userTable.toggleRowSelection(row)
    },
    handleSizeChange(val) {
      this.searchQuery.current = 1
      this.searchQuery.size = val
      this.queryUser()
    },
    handleCurrentChange(val) {
      this.searchQuery.current = val
      this.queryUser()
    },
    resetForm() {
      if (this.$refs.userForm !== undefined) {
        this.$refs.userForm.resetFields();
      }
    }
  },
  mounted() {
    this.queryUser()
  },
  activated() {
    this.showToolTip = true
  },
  deactivated() {
    this.showToolTip = false
  }
}
</script>
<style>
  #topright-form .el-form-item__label{
    font-size: 12px
  }
  #table-div .el-table--border td{
    border-right:none
  }
  #table-div .el-table--border th{
    border-right:none
  }
  #table-div .el-table{
    font-size:12px
  }
  #table-div .preview,#table-div .deleteRed,#table-div .editor,#table-div .people3{
    width:22px;
    height:22px;
  }
  .dialog-user .el-dialog__header{
    border-bottom: 1px solid #DCDFE6
  }
  .dialog-user .el-dialog__footer{
    border-top: 1px solid #DCDFE6
  }
  .dialog-user .el-dialog__title{
    font-size:14px;
    color:#17233d;
    line-height:20px
  }
  .dialog-user .el-form-item__label{
    font-size:12px;
    color:#515a6e;
    line-height:1;
    padding:10px 12px 10px 0
  }
  .user-box .pagination-container{
   margin-top:0px
  }
  #assign-user .el-transfer-panel{
   width:180px;
  }
  #assign-user .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label{
    font-size:12px;
  }
  #assign-user .el-transfer-panel__filter .el-input__inner{
    height:24px
  }
  #assign-user .el-checkbox__label{
    font-size:12px
  }
  #assign-user .el-checkbox-group .el-checkbox {
    display: block;
  }
  #assign-user .el-input--small .el-input__icon{
    line-height: 24px;
    margin-left: 0;
  }
</style>
