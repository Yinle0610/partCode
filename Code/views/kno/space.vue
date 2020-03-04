<template>
  <div class="hole">
    <el-card class="box-card">
      <!-- 头部新增、查询 -->
      <div slot="header">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" @submit.native.prevent>
          <el-form-item>
            <el-button class="btnOne" type="primary" @click="handleAdd">
              <img src="./../../assets/images/desktop/add.png" alt class="add_img" />
              新增空间
            </el-button>
          </el-form-item>
          <el-form-item style="float:right;">
            <el-button type="primary" @click="handleSearch">
              <i class="el-icon-search"></i>
              查询
            </el-button>
          </el-form-item>
          <el-form-item  style="float:right;">
            <el-input
              clearable
              style="width: 400px;margin-top:1px;"
              v-model="formInline.search"
              placeholder="请输入空间名称、描述..."
              @keyup.enter.native="handleSearch"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 空间表格 -->
      <div id="div-table">
        <el-table
          :data="tableData"
          style="width: 100%;border:1px solid #EBEEF5"
          show-header
          :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
        >
          <el-table-column prop="name" label="名称" sortable></el-table-column>
          <el-table-column prop="description" label="描述" sortable></el-table-column>
          <el-table-column prop="visitLevel" label="访问级别" sortable></el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
          <el-table-column prop="creatorName" label="创建人" sortable></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                <el-button @click="clickTitle(scope.row)" type="text" size="small" >
                  <svg-icon icon-class="preview" class="preview"></svg-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-button  @click="handleEdit(scope.row)" type="text" size="small" v-permission="'EDIT_SPACE'">
                  <svg-icon icon-class="editor" class="editor"></svg-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="成员" placement="bottom">
                <el-button  @click="handleMember(scope.row)" type="text" size="small" v-permission="'ASIGN_SPACE'">
                  <svg-icon icon-class="people3" class="people3"></svg-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-button  @click="handleRemove(scope.row)" type="text" size="small" v-permission="'DEL_SPACE'">
                  <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                </el-button>
              </el-tooltip>
              <!-- <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="handleMember(scope.row)" type="text" size="small">成员</el-button>
              <el-button @click="handleRemove(scope.row)" type="text" size="small">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 翻页 -->
      <div class="div-page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="iCurrentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="ipageSize"
          layout="total, prev, pager, next,sizes,jumper"
          :total="iTotalPage"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 空间详情弹窗 -->
    <el-dialog class="Dialog" title="空间详情" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" label-width="128px">
        <el-form-item label="空间名称：" prop="name">
          <el-input disabled v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="空间描述：" prop="name">
          <el-input disabled v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="访问级别：" prop="name">
          <el-input disabled v-model="form.visitLevel"></el-input>
        </el-form-item>
        <el-form-item label="创建时间：" prop="name">
          <el-input disabled v-model="form.createTime"></el-input>
        </el-form-item>
        <el-form-item label="更新时间：" prop="name">
          <el-input disabled v-model="form.updateTime"></el-input>
        </el-form-item>
        <el-form-item label="创建人ID：" prop="name">
          <el-input disabled v-model="form.creatorId"></el-input>
        </el-form-item>
        <el-form-item label="创建人姓名：" prop="name">
          <el-input disabled v-model="form.creatorName"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增、编辑弹窗 -->
    <el-dialog class="Dialog Edit" :title="addOrEditTitle" :visible.sync="EditVisible">
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="空间名称：" prop="name">
          <el-input clearable v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="空间描述：" prop="description">
          <el-input type="textarea" v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="访问级别：" prop="visitLevel">
          <el-radio-group v-model="editForm.visitLevel">
            <div>
              <el-radio label="public"></el-radio>
              <div class="radio-label">*可以由任意用户访问</div>
            </div>
            <div>
              <el-radio label="private"></el-radio>
              <div class="radio-label">*只有该空间下的用户才能访问</div>
            </div>
          </el-radio-group>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('editForm')">确定</el-button>
          <el-button @click="cancle('editForm')">取消</el-button>
        </div>
    </el-dialog>
    <!-- 成员弹窗 -->
    <el-dialog class="Dialog" title="空间成员列表" :visible.sync="memberVisible">
      <el-form :inline="true" :model="memberformInline" class="demo-form-inline">
        <el-form-item label="空间权限：">
          <el-select v-model="memberformInline.privilege" placeholder="请选择">
            <el-option
              v-for="(item, index) in spaceList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="memberformInline.userId" placeholder="请选择">
            <el-option
              v-for="(item,index) in memberList"
              :key="index"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addMember">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="memberTableList"
        style="width: 100%;border:1px solid #EBEEF5"
        show-header
        :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
      >
        <el-table-column property="userId" label="用户名"></el-table-column>
        <el-table-column property="userName" label="姓名"></el-table-column>
        <el-table-column property="email" label="邮箱"></el-table-column>
        <el-table-column property="MOBILE_PHONE" label="手机"></el-table-column>
        <el-table-column label="空间权限">
          <template slot-scope="scope">
            <div>{{scope.row.privilege === 2? '管理者': scope.row.privilege === 1? '编辑者':'浏览者'}}</div>
          </template>
        </el-table-column>
        <el-table-column property="address" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleMemberRemove(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { get, post } from "@/utils/request";
export default {
  name: 'spaceSearch',
  data() {
    // 空间名称 校验
    const checkName = (rule, value, callback) => {
      let pat = new RegExp("[^a-zA-Z0-9_\u4e00-\u9fa5]", "i");
      if (!value) {
        return callback(new Error("空间名称不能为空"));
      } else if (pat.test(value) === true) {
        return callback(new Error('空间名称不能包含/:*?"<>|、等非法字符'));
      } else {
        callback();
      }
    };
    // 访问级别 校验
    const checkLevel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择访问级别"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      EditVisible: false,
      addOrEditTitle: "",
      memberVisible: false,
      formInline: {
        search: ""
      },
      memberformInline: {
        privilege: "",
        userId: ""
      },
      iCurrentPage: 1,
      ipageSize: 10,
      iTotalPage: 1,
      tableData: [],
      form: {
        createTime: "",
        creatorId: "",
        creatorName: "",
        description: "",
        name: "",
        updateTime: "",
        visitLevel: ""
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }]
      },
      editForm: {
        visitLevel: "",
        description: "",
        name: ""
      },
      editRules: {
        name: [{ validator: checkName, trigger: "blur" }],
        visitLevel: [{ validator: checkLevel, trigger: "change" }]
      },
      memberTableList: [],
      spaceList: [],
      memberList: [],
      type: "add",
      spaceId: ""
    };
  },
  methods: {
    // 弹窗提示
    message(res) {
      this.$message({
        message: res.message,
        type: "success"
      });
    },
    // 新增
    handleAdd() {
      this.type = "add";
      this.addOrEditTitle = "新增空间"
      this.EditVisible = true;
      for (let a in this.editForm) {
        this.editForm[a] = "";
      }
      this.editForm.visitLevel = "public"
    },
    // 确认新增
    add() {
      post("/kno/space/createSpace", {
        description: this.editForm.description,
        name: this.editForm.name,
        visitLevel: this.editForm.visitLevel === "public" ? 1 : 0
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.EditVisible = false;
          this.handleSearch();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 查询
    handleSearch() {
      get("/kno/space/listAllSpace", {
        keyword: this.formInline.search,
        pageCurrent: this.iCurrentPage,
        pageSize: this.ipageSize
      }).then(res => {
        this.iTotalPage = res.data.total;
        this.tableData = res.data.records;
      });
    },
    // 点击空间名称
    clickTitle(val) {
      this.form = val;
      this.dialogFormVisible = true;
    },
    // 编辑
    handleEdit(val) {
      this.type = "edit";
      this.addOrEditTitle = "编辑空间"
      this.spaceId = val.spaceId;
      for (let a in this.editForm) {
        this.editForm[a] = val[a];
      }
      this.EditVisible = true;
    },
    // 编辑、新增确认事件
    submitForm(formName) {
      // console.log(this.editForm.visitLevel)
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.type === "add") {
            this.add();
          } else {
            this.edit();
          }
        } else {
          return false;
        }
      });
    },
    // 取消编辑
    cancle() {
      this.EditVisible = false;
    },
    // 确认编辑
    edit() {
      post("/kno/space/editSpace", {
        description: this.editForm.description,
        name: this.editForm.name,
        visitLevel: this.editForm.visitLevel === "public" ? 1 : 0,
        spaceId: this.spaceId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.$message.success(res.message);
          this.EditVisible = false;
          this.handleSearch();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 成员
    handleMember(val) {
      if (val.visitLevel === "private") {
        this.spaceList = [
          {
            label: "浏览者",
            value: 0
          },
          {
            label: "编辑者",
            value: 1
          },
          {
            label: "管理者",
            value: 2
          }
        ];
        this.spaceId = val.spaceId;
        // 查询空间下所有用户权限信息
        this.getMemberTable();
        // 根据空间ID获取待添加用户的信息列表
        this.getMemberList();
        this.memberVisible = true;
      } else {
        this.$message.warning("公有空间无需添加成员")
      }
    },

    // 删除
    handleRemove(val) {
      this.$confirm(
        "警告！删除空间将同步删除该空间下所有相关知识文档，确定删除吗？",
        "删除空间",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          get("/kno/space/removeSpace", {
            spaceId: val.spaceId
          }).then(res => {
            this.handleSearch();
            this.message(res);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 改变展示条数
    handleSizeChange(val) {
      this.ipageSize = val;
      this.handleSearch();
    },
    // 翻页
    handleCurrentChange(val) {
      this.iCurrentPage = val;
      this.handleSearch();
    },
    // 获取成员表格数据
    getMemberTable() {
      get("/kno/space/listSpaceUser", {
        spaceId: this.spaceId
      }).then(res => {
        this.memberTableList = res.data;
        // 清空下拉框上次选中
        for (let val in this.memberformInline) {
          this.memberformInline[val] = "";
        }
      });
    },
    // 获取成员弹窗第二个下拉框数据
    getMemberList() {
      get("/kno/space/listToBeAddUserInfos", {
        spaceId: this.spaceId
      }).then(res => {
        this.memberList = res.data;
      });
    },
    // 添加空间成员
    addMember() {
      if (
        this.memberformInline.privilege === "" &&
        this.memberformInline.userId === ""
      ) {
        this.$message.warning("请选择空间权限和姓名!");
      } else if (this.memberformInline.privilege === "") {
        this.$message.warning("请选择空间权限!");
      } else if (this.memberformInline.userId === "") {
        this.$message.warning("请选择姓名!");
      } else {
        get("/kno/space/createSpaceUser", {
          privilege: this.memberformInline.privilege,
          spaceId: this.spaceId,
          userId: this.memberformInline.userId
        }).then(res => {
          this.getMemberTable();
          this.getMemberList();
          this.message(res);
        });
      }
    },
    // 移除空间成员
    handleMemberRemove(val) {
      get("/kno/space/removeSpaceUser", {
        spaceId: val.spaceId,
        userId: val.userId
      })
        .then(res => {
          if (res.code === 10000 && res.success) {
            this.getMemberTable();
            this.getMemberList();
            this.message(res);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.handleSearch();
  }
};
</script>
<style lang="scss" scoped>
.hole {
  padding: 10px;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-table {
    font-size: 12px;
  }
  #div-table /deep/ .cell {
    white-space: nowrap;
  }
  .preview,.deleteRed,.editor,.people3{
    width:22px;
    height:22px;
  }
  .demo-form-inline /deep/ {
    .el-button {
      height: 32px;
      padding: 5px 15px 6px;
      font-size: 12px;
    }
    .el-input__inner {
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      padding: 4px 7px;
    }
  }
  .Dialog /deep/ {
    .el-form-item__label {
      height: 32px;
      line-height: 32px;
      margin-top: 4px;
      font-size: 12px;
      font-weight: inherit;
    }
    .el-input__inner {
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      color: #606266;
    }
    .el-dialog__header {
      border-bottom: 1px solid #e8eaec;
    }
    .el-dialog__footer {
      border-top: 1px solid #e8eaec;
    }
    .el-dialog__title {
      font-size: 15px;
      color: #17233d;
      font-weight: 700;
    }
    .el-form-item {
      margin: 5px 0;
    }
    .el-dialog__body {
      padding: 16px 20px 30px 20px;
      font-size: 12px;
    }
  }
  .div-page {
    text-align: center;
    padding-top: 10px;
  }
  /deep/ .el-dialog {
    border-radius: 6px;
    width: 55%;
  }
  .Edit /deep/ {
    .el-form-item {
      margin-bottom: 25px;
    }
    .el-radio,
    .radio-label {
      float: left;
      height: 32px;
      line-height: 32px;
      margin-top: 5px;
    }
  }
  .radio-label {
    font-size: 12px;
    color: #f56c6c;
  }
}
</style>
