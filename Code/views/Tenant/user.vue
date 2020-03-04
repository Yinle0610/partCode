<template>
  <div class="tenant-user tableNoPadding">
    <el-card class="box-card">
      <div class="btn-box">
        <el-button
          class="page-btn"
          type="primary"
          @click="goAdd"
          v-permission="'DATA_LEVEL_CREATE'"
          size="small"
        >
          <i class="add-icon"></i>新增用户
        </el-button>
        <el-form :inline="true" :model="formInline" class="demo-form-inline fr">
          <el-form-item label="用户姓名:">
            <el-input v-model="formInline.user" placeholder="请输入..."></el-input>
          </el-form-item>
          <el-form-item label="登录名:">
            <el-input v-model="formInline.user" placeholder="请输入..."></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        v-loading="bLoading"
        border
        size="small"
        style="width: 150%"
        :header-cell-style="{background:'#f8f8f9',color:'#666',textAlign:'center'}"
        :cell-style="cellStyle"
        :cell-class-name="cellClass"
      >
        <el-table-column prop="username" :show-overflow-tooltip='showToolTip' width="150" sortable label="用户姓名"></el-table-column>
        <el-table-column prop="loginName" :show-overflow-tooltip='showToolTip' width="150" sortable label="登录名"></el-table-column>
        <el-table-column label="归属分组">
          <template slot-scope="scope">
            <el-tag
              class="mr10 pointer"
              @click="clickGroupTag(item)"
              v-for="(item, index) in scope.row.tagList"
              :key="index"
            >{{item.title}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="150" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
              <el-button @click="handleEdit(scope.row)" type="text" size="small">
                <svg-icon icon-class="editor" class="editor"></svg-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button @click="deleteSome(scope.row)" type="text" size="small">
                <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageCurrent"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="iTotal"
      ></el-pagination>
    </el-card>
    <!-- 分组详情弹窗 -->
    <el-dialog
      class="group_dialog"
      :title="group.title"
      :visible.sync="showGroupDetail"
      width="50%"
      :destroy-on-close='true'
      @close="handleClose"
    >
      <div>
        <div class="label">
          <span class="line"></span>分组描述
        </div>
        <div class="group_desc">{{group.desc}}</div>
      </div>
      <div>
        <div class="label">
          <span class="line"></span>权限说明
        </div>
        <div class="group_table">
          <el-table
            :data="group.gTableData"
            size="small"
            border
            :header-cell-style="{background:'#f8f8f9',color:'#666'}"
          >
            <el-table-column min-width="30%" prop="system" :show-overflow-tooltip='showToolTip' label="系统/组件"></el-table-column>
            <el-table-column min-width="70%" prop="desc" :show-overflow-tooltip='showToolTip' label="说明"></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showGroupDetail = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增、编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      class="group_dialog"
      width="50%"
      @close="handleClose"
      :destroy-on-close='true'
    >
      <el-dialog
        width="30%"
        title="内层 Dialog"
        :visible.sync="modDialog"
        :destroy-on-close='true'
        class="group_dialog"
        append-to-body>
        <span slot="title">修改密码</span>
        <el-form
          :model='passwordForm'
          :rules="passwordFormRules"
          ref="passwordForm"
          label-width="100px"
          class="dialog-userForm">
          <el-form-item class="is-required" label="旧密码:" prop="oldPwd">
            <el-input style="width: 90%;" type="password" v-model="passwordForm.oldPwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码:" prop="newPwd">
            <el-input style="width: 90%;" type="password" v-model="passwordForm.newPwd"></el-input>
          </el-form-item>
          <el-form-item class="is-required" label="新密码:" prop="surePwd">
            <el-input style="width: 90%;" type="password" v-model="passwordForm.surePwd"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleModPwd">确 定</el-button>
          <el-button @click="modDialog = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-form
        :model="userForm"
        :rules="userFormRules"
        ref="userForm"
        label-width="100px"
        class="dialog-userForm"
      >
        <el-form-item label="登录名:" class="is-required" prop="loginName">
          <el-input style="width: 70%;" :disabled="dialogTitle==='新增'?false:true" v-model="userForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名:" prop="userName">
          <el-input style="width: 70%;" v-model="userForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input style="width: 70%;" v-model="userForm.password" :type="inputType">
            <i
              slot="suffix"
              @mousedown="changeInputType('text')"
              @mouseup="changeInputType('password')"
              class="el-input__icon el-icon-view"
            ></i>
          </el-input>
          <i v-if="dialogTitle==='编辑'" class="bt-edit" @click="modPassword">
            <svg-icon icon-class="xiugai2" class="editor"></svg-icon>
          </i>
        </el-form-item>
        <el-form-item label="归属分组:" class="is-required" prop="ownGroup">
          <el-transfer
            style="text-align: left;"
            size="mini"
            v-model="userForm.ownGroup"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="['未选择', '已选择']"
            :button-texts="['', '']"
            :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
            :data="groupData"
            @change="changeOwnGroup"
          ></el-transfer>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import { post, get } from "@/utils/request";
import { post } from "@/utils/request";

export default {
  name: "dataLevel",
  components: {},
  data() {
    // 登录名校验
    const validateLoginName = (rule, value, callback) => {
      if (this.userForm.loginName === "") {
        callback(new Error("请输入登录名!"));
      } else {
        // get('',{ :value})
        console.log(value);
        callback();
      }
    };
    // 归属分组校验
    const validateOwnGroup = (rule, value, callback) => {
      if (this.userForm.ownGroup.length > 0) {
        console.log(this.userForm.ownGroup, '归属分组');
        callback();
      } else {
        callback(new Error("请选择归属分组!"));
      }
    };
    // 旧密码校验
    const validateOldPwd = (rule, value, callback) => {
      if (this.passwordForm.oldPwd === '') {
        callback(new Error('请输入旧密码！'))
      } else {
        callback()
      }
    }
    // 两次新密码校验
    const validateSurePwd = (rule, value, callback) => {
      if (this.passwordForm.surePwd === '') {
        callback(new Error('请再次输入新密码!'))
      } else {
        if (this.passwordForm.surePwd === this.passwordForm.newPwd) {
          callback()
        } else {
          callback(new Error('两次新密码不一致!'))
        }
      }
    }
    return {
      // 新增、编辑弹窗
      dialogVisible: false,
      // 新增、编辑弹窗 标题
      dialogTitle: "",
      // 分组详情弹窗
      showGroupDetail: false,
      // 搜索内容
      formInline: {
        user: "",
        region: ""
      },
      // 入口页 表格数据
      tableData: [
        {
          username: "01",
          loginName: "01",
          tagList: [
            {
              title: "超级用户组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "xx组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "运行维护组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "应用接口组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "Lab用户组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "运行维护组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "应用接口组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "Lab用户组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            }
          ]
        },
        {
          username: "02",
          loginName: "02",
          tagList: [
            {
              title: "超级用户组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "运行维护组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "应用接口组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "Lab用户组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "运行维护组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "应用接口组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "Lab用户组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            }
          ]
        },
        {
          username: "03",
          loginName: "03",
          tagList: [
            {
              title: "超级用户组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "xx组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "运行维护组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "应用接口组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "Lab用户组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "运行维护组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "应用接口组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "Lab用户组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            }
          ]
        },
        {
          username: "04",
          loginName: "04",
          tagList: [
            {
              title: "超级用户组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "xx组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "运行维护组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "应用接口组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "Lab用户组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "运行维护组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "应用接口组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            },
            {
              title: "Lab用户组",
              desc: "分组描述分组描述分组描述分组描述分组描述分组描述",
              gTableData: [
                {
                  system: "Linux",
                  desc: "所有权限xx"
                }
              ]
            }
          ]
        }
      ],
      // 密码框的 type
      inputType: "password",
      // 新增、编辑弹窗  form的值
      userForm: {
        loginName: "",
        userName: "",
        password: "",
        ownGroup: []
      },
      // 新增、编辑弹窗  form的输入校验
      userFormRules: {
        loginName: [{ validator: validateLoginName, trigger: "blur" }],
        userName: [
          { required: true, message: "请输入用户姓名!", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码!", trigger: "blur" }],
        ownGroup: [{ validator: validateOwnGroup, trigger: "change" }]
      },
      bShowPopup: false, // 是否显示弹框
      sTitle: "新增分级", // 弹框标题
      sPreview: false, // 是否是预览
      pageCurrent: 1,
      pageSize: 10,
      iTotal: 0,
      bLoading: false,
      group: {}, // 组详情弹框数据
      groupData: [
        { label: "BI访问组", key: '1' },
        { label: "Lab访问组", key: '2' },
        { label: "超级管理组", key: '3' },
        { label: "运行维护组", key: '4' },
        { label: "应用接口组", key: '5' }
      ],
      // 密码修改弹窗
      modDialog: false,
      passwordFormRules: {
        oldPwd: [{ validator: validateOldPwd, trigger: "blur" }],
        newPwd: [{ required: true, message: "请输入新密码!", trigger: "blur" }],
        surePwd: [{ validator: validateSurePwd, trigger: "blur" }]
      },
      passwordForm: {
        oldPwd: '',
        newPwd: '',
        surePwd: ''
      },
      showToolTip: true
    };
  },
  methods: {
    // 获取table数据
    getTableData() {
      this.aTableData = [];
      this.bLoading = true;
      post("/secure/dataLevel/listDataLevel", {
        current: this.pageCurrent,
        size: this.pageSize
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          this.iTotal = res.data.total;
          res.data.records.forEach(i => {
            i.state = i.status === "1";
            this.aTableData.push(i);
          });
          this.bLoading = false;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleSizeChange(value) {
      this.pageSize = value;
      this.getTableData();
    },
    handleCurrentChange(value) {
      this.pageCurrent = value;
      this.getTableData();
    },
    // 新增
    goAdd() {
      this.resetForm();
      this.dialogTitle = "新增";
      this.dialogVisible = true;
    },
    // 编辑
    handleEdit(item) {
      this.dialogTitle = "编辑";
      this.dialogVisible = true;
    },
    // 修改密码
    modPassword() {
      this.modDialog = true
    },
    handleModPwd() {
      console.log('123')
      this.$refs["passwordForm"].validate(valid => {
        if (valid) {
          console.log(this.passwordForm)
          this.userForm.password = this.passwordForm.newPwd
        } else {
          return false
        }
      })
    },
    // 切换密码框的type
    changeInputType(val) {
      this.inputType = val;
    },
    // 归属分组 已选择数据
    changeOwnGroup(val) {
      console.log(val)
      console.log(this.userForm.ownGroup)
    },
    // 重置新增、编辑弹窗的form数据
    resetForm() {
      this.oForm = {
        dataLevel: "",
        importantLevel: "",
        divideBasis: "",
        dataFeature: "",
        status: false
      };
    },
    // 新增、编辑提交
    handleSubmit() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          console.log(this.userForm)
        } else {
          return false
        }
      })
    },
    // 搜索
    handleSearch() {},
    // 表格样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex !== 2) {
        return "text-align: center";
      } else {
        return "text-align: left;";
      }
    },
    cellClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        return "tableCellClass";
      }
    },
    // 删除用户
    deleteSome(item) {},
    // 点击分组tag
    clickGroupTag(item) {
      this.group = item;
      this.showGroupDetail = true;
    },
    // 关闭分组详情弹窗
    handleClose() {}
  },
  computed: {
    ...mapGetters(["roles"])
  },
  mounted() {},
  created() {
    this.showToolTip = true
    // this.getTableData();
  },
  deactivated() {
    this.showToolTip = true
  },
  activated() {
    this.showToolTip = false
  }
};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/variables";
// @import "../../styles/switch";
.mr10 {
  margin-right: 10px;
  margin-bottom: 5px;
}
.pointer {
  cursor: pointer;
}
// .tableCellClass /deep/ {
//   .cell {
//     white-space: nowrap !important;
//   }
// }
.tenant-user {
  width: 100%;
  padding: 10px;
  background-color: $page-bg;
  .deleteRed,
  .editor {
    width: 22px;
    height: 22px;
  }
  /deep/ .el-table--small td, .el-table--small th {
    padding: 8px 0 3px;
  }
  /deep/ .el-form-item__label {
    font-weight: unset;
    line-height: 32px;
  }
  /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  /deep/ .el-form-item__content {
    line-height: 32px;
    .el-input {
      line-height: 32px;
    }
    .el-button {
      height: 32px;
      padding: 0 15px;
    }
  }
  .box-card {
    .btn-box {
      // padding-bottom: 20px;
      margin-bottom: 20px;
      // border-bottom: 1px solid $border;
    }
  }
  // /deep/ .cell {
  //   white-space: nowrap;
  // }
  // 页面按钮
  .page-btn /deep/ {
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
        background: url("./../../assets/images/commonIcon/preview.png")
          no-repeat;
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
}
.group_dialog {
  // 修改密码图标
  .bt-edit {
    height: 32px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
    margin-top: 4px;
    cursor: pointer;
  }
  /deep/ .el-icon-view {
    line-height: 32px;
  }
  .label {
    height: 30px;
    line-height: 30px;
  }
  .group_desc {
    line-height: 30px;
    padding: 5px 10px;
  }
  .group_table {
    padding: 10px 30px;
  }
  .line {
    width: 3px;
    height: 100%;
    display: block;
    float: left;
    background: #409eff;
    margin-right: 15px;
  }
  /deep/ .el-dialog {
    border-radius: 5px;
    .el-dialog__header {
      border-bottom: 1px solid #e8ebed;
      .el-dialog__title {
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
  }
  /deep/ .el-dialog {
    .el-dialog__footer {
      border-top: 1px solid #e8ebed;
      text-align: center;
      .el-button {
        height: 32px;
        padding: 0 15px;
      }
    }
  }
  // 穿梭框
  /deep/ .el-transfer-panel__item {
    float: left;
    width: 80%;
  }
  /deep/ .el-transfer-panel {
    width: 40%;
  }
  /deep/ .el-transfer__buttons {
    width: 20%;
    padding: 0;
    position: relative;
    .el-button {
      margin: 0 auto 10px;
    }
  }
}
// .el-dialog__wrapper {

// }
.el-dialog__wrapper::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}
.el-dialog__wrapper::-webkit-scrollbar-track {
  background: none;
  border-radius: 2px;
}
.el-dialog__wrapper::-webkit-scrollbar-thumb {
  background: rgb(239, 239, 239);
  border-radius: 10px;
}
.el-dialog__wrapper::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
</style>
