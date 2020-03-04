<template>
  <div class="hole p10">
    <!-- 数据源管理 -->
    <el-card shadow="hover">
      <el-form :inline="true" label-width="100px" :model="formInline" class="demo-form-inline">
        <el-form-item label="数据源类型：">
          <el-select width="100" v-model="sourceType" clearable placeholder="请选择">
            <el-option label="虚拟" value="0"></el-option>
            <el-option label="真实" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据库类型：">
          <el-select v-model="dbType" clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in DbTypeList"
              :key="index"
              :label="item.textField"
              :value="item.valueField"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="name-input" label="数据源名称：">
          <el-input v-model="keyword" placeholder="请输入关键字..." clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <!-- <el-button @click="reset">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:10px;" class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="handleAdd" class="add-btn" type="primary">
          <i class="dataTable-icon add"></i>新增
        </el-button>
      </div>
      <div class="data-table">
        <el-table
          border
          :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
          :data="tableData"
          align="center"
          :default-sort = "{prop: 'createTime', order: 'descending'}"
          style="width: 100%"
        >
          <el-table-column align="center" prop="sourceType" label="数据源类型"  sortable>
            <template slot-scope="scope">
              <span>{{scope.row.sourceType === '0' ? '虚拟' : '真实'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sourceName" label="数据源名称"  sortable></el-table-column>
          <el-table-column align="center" prop="sourceDesc" label="数据源描述"  sortable></el-table-column>
          <el-table-column align="center" prop="dbType" label="数据库类型"  sortable></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间"  sortable></el-table-column>
          <el-table-column align="center" label="操作" width="150"  sortable>
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                <el-button @click="handleEdit('detail', scope.row)" type="text" size="small" >
                  <svg-icon icon-class="preview" class="preview"></svg-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-button v-permission="'DSM_EDIT'"  @click="handleEdit('edit', scope.row)" type="text" size="small" >
                  <svg-icon icon-class="editor" class="editor"></svg-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-button v-permission="'DSM_DEL'" @click='handleDelete(scope.row)' type="text" size="small" >
                  <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                </el-button>
              </el-tooltip>
              <!-- <el-button
                class="add-btn"
                size="mini"
                type="primary"
                @click="handleEdit('detail', scope.row)"
              >
                <i class="dataTable-icon preview"></i>详情
              </el-button> -->

              <!-- <el-button
                class="add-btn"
                size="mini"
                type="warning"
                @click="handleEdit('edit', scope.row)"
              >
                <i class="dataTable-icon edit"></i>修改
              </el-button>
              <el-button
                class="add-btn"
                type="info"
                size="mini"
                disabled
                @click="handleDelete(scope.row)"
              >
                <i class="dataTable-icon del"></i>删除
              </el-button> -->
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
    <el-dialog :title="modalTitle" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="基本信息" name="first">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item style="width: 488px" label="数据源名称：" prop="sourceName">
              <el-input :disabled="isEdit" v-model="ruleForm.sourceName"></el-input>
            </el-form-item>
            <el-form-item style="width: 488px" label="数据源描述：" prop="desc">
              <el-input :disabled="isEdit" rows="3" type="textarea" v-model="ruleForm.desc"></el-input>
            </el-form-item>
            <el-form-item label="数据源类型：" prop="sourceType">
              <el-select
                :disabled="isEdit"
                @change="selectSourceType"
                clearable
                v-model="ruleForm.sourceType"
                placeholder="请选择"
              >
                <el-option label="虚拟" value="0"></el-option>
                <el-option label="真实" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据库类型：" prop="dbType">
              <el-select
              style="width:200px"
                :disabled="isEdit"
                @change="handleSelec"
                clearable
                v-model="ruleForm.dbType"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in DbTypeList"
                  :key="index"
                  :label="item.textField"
                  :value="item.valueField"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :disabled="isDisabled" class="second-tab" label="参数信息" name="second">
          <el-form
            :model="paramRuleForm"
            :rules="paramRules"
            ref="paramRuleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item style="width: 70%; float: left;" label="服务器地址：" prop="host">
              <el-input :disabled="isEdit" v-model="paramRuleForm.host" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item style="width: 30%;float: right;" label="端口：" prop="port">
              <el-input :disabled="isEdit" v-model="paramRuleForm.port" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item
              :style="{width: ruleForm.dbType === 'ORACLE'?'70%':'100%', float: 'left'}"
              label="数据库/模式："
              prop="schema"
            >
              <el-input v-model="paramRuleForm.schema" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
            <el-form-item
              v-show="ruleForm.dbType === 'ORACLE'"
              class="form-conntype"
              style="width: 30%;float: right;"
              prop="connType"
            >
              <el-select
                clearable
                :disabled="isEdit"
                v-model="paramRuleForm.connType"
                v-show="ruleForm.dbType === 'ORACLE'"
              >
                <el-option label="Service Name" value="Service Name"></el-option>
                <el-option label="SID" value="SID"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 50%; float: left;" label="用户名：" prop="username">
              <el-input :disabled="isEdit" v-model="paramRuleForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item style="width: 50%; float: right;" label="密码：" prop="password">
              <el-input :disabled="isEdit" placeholder="请输入密码" v-model="paramRuleForm.password" show-password></el-input>
            </el-form-item>
            <div style="text-align: center;">
              <el-button :disabled="isEdit" @click="handleLink" class="link-btn" type="success">
                <i class="dataTable-icon link"></i>测试连接
              </el-button>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit(activeName === 'first' ?'ruleForm':'paramRuleForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { get, postByJson } from "@/utils/request";
export default {
  name: 'dataSourceManagement',
  data() {
    return {
      formInline: {
        user: "",
        region: ""
      },
      activeName: "first",
      test: false,
      DbTypeList: [],
      dbType: "",
      tableData: [],
      keyword: "",
      pageCurrent: 1,
      pageSize: 10,
      total: 0,
      sourceType: "",
      dialogFormVisible: false,
      // 基本信息 数据和规则
      ruleForm: {
        sourceName: "",
        desc: "",
        sourceType: "",
        dbType: ""
      },
      rules: {
        sourceName: [
          { required: true, message: "请填写数据源名称", trigger: "blur" }
        ],
        sourceType: [
          { required: true, message: "请选择数据源类型", trigger: "change" }
        ],
        dbType: [
          { required: true, message: "选择数据库类型", trigger: "change" }
        ]
      },
      // 参数信息  数据和规则
      paramRuleForm: {
        host: "",
        port: "",
        schema: "",
        username: "",
        password: "",
        connType: ""
      },
      paramRules: {
        host: [{ required: true, message: "请填写地址", trigger: "blur" }],
        port: [{ required: true, message: "请填写端口", trigger: "blur" }],
        schema: [{ required: true, message: "请填写数据库", trigger: "blur" }],
        username: [
          { required: true, message: "请填写用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }],
        connType: [
          { required: true, message: "请选择数据库", trigger: "change" }
        ]
      },
      sourceId: "",
      msg: {},
      isEdit: false,
      choseType: "",
      modalTitle: "",
      selecSourceType: ""
    };
  },
  methods: {
    handleSearch() {
      this.pageSize = 10;
      this.pageCurrent = 1;
      this.getTableData();
    },
    handleSelec(val) {
      this.selecSourceType = val;

      if (val === "ORACLE") {
        this.paramRules.connType = [
          { required: true, message: "请选择数据库", trigger: "change" }
        ];
      } else {
        this.paramRules.connType = [{ required: false }];
      }
    },
    reset() {
      this.keyword = "";
      this.dbType = "";
      this.sourceType = "";
      this.handleSearch();
    },
    // 新增
    handleAdd() {
      this.modalTitle = "新增数据源";
      this.activeName = "first";
      this.choseType = "add";
      this.isEdit = false;
      this.dialogFormVisible = true;
      this.resetFormCheck();
    },
    // 编辑
    handleEdit(val, row) {
      this.activeName = "first";
      this.sourceId = row.sourceId;
      if (val === "detail") {
        this.modalTitle = "数据源详情";
        this.choseType = "detail";
        this.isEdit = true;
        this.resetFormCheck();
        this.getMsg();
      } else {
        this.modalTitle = "修改数据源";
        this.choseType = "edit";
        this.isEdit = false;
        this.resetFormCheck();
        this.getMsg();
        this.handleTabClick();
      }
    },
    // 获取数据详情
    getMsg() {
      get("/sys/datasource/getDataSourceDetail", {
        sourceId: this.sourceId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.clearInput();

          // let dialogMsg = res.data;
          this.ruleForm.sourceName = res.data.sourceName;
          this.ruleForm.desc = res.data.sourceDesc;
          this.ruleForm.sourceType = res.data.sourceType;
          this.ruleForm.dbType = res.data.dbType;
          res.data.params.map(item => {
            for (var a in this.paramRuleForm) {
              if (item.paramName === a) {
                this.paramRuleForm[a] = item.paramValue;
              }
            }
          });
          this.dialogFormVisible = true;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleLink() {
      this.text = true;
      this.handleSubmit("paramRuleForm");
    },
    selectSourceType(val) {},
    handleSubmit(formName) {
      if (this.choseType === "detail") {
        this.dialogFormVisible = false;
      } else {
        let arr = [];
        for (var a in this.paramRuleForm) {
          arr.push({
            paramName: a,
            paramValue: this.paramRuleForm[a]
          });
        }
        // console.log({
        //   dbType: this.ruleForm.dbType,
        //   params: arr,
        //   sourceDesc: this.ruleForm.desc,
        //   sourceId: this.sourceId,
        //   sourceName: this.ruleForm.sourceName,
        //   sourceType: this.ruleForm.sourceType
        // });
        this.$refs[formName].validate(valid => {
          if (valid) {
            // if(this.ruleForm.sourceType === 0)
            if (
              this.activeName === "first" &&
              this.ruleForm.sourceType === "1"
            ) {
              this.activeName = "second";

              this.$message.warning("请继续填写下列数据!");
            } else if (this.text) {
              console.log("测试");
              this.text = false;
              this.handleText();
            } else {
              console.log("提交");
              let arr = [];
              for (var a in this.paramRuleForm) {
                arr.push({
                  paramName: a,
                  paramValue: this.paramRuleForm[a]
                });
              }
              this.msg = {
                dbType: this.ruleForm.dbType,
                params: arr,
                sourceDesc: this.ruleForm.desc,
                sourceId: this.sourceId,
                sourceName: this.ruleForm.sourceName,
                sourceType: this.ruleForm.sourceType
              };
              if (this.choseType === "detail") {
                console.log("detail");
              } else if (this.choseType === "edit") {
                this.editSource();
              } else {
                this.addSource();
              }
            }
          } else {
            console.log(this.paramRules)
            console.log(this.rules)
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    // 清空输入框数据
    clearInput() {
      for (let a in this.ruleForm) {
        this.ruleForm[a] = "";
      }
      for (let a in this.paramRuleForm) {
        this.paramRuleForm[a] = "";
      }
      console.log("clear");
    },
    // 删除
    handleDelete(row) {
      console.log(row)
      this.$confirm('是否确定删除该数据源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        get('/sys/datasource/removeDataSource', { datasourceId: row.sourceId }).then(res => {
          if (res.code === 10000 && res.success) {
            this.$message.success(res.message)
            this.pageCurrent = 1
            this.getTableData()
          } else {
            this.$message.warning(res.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 判断新增 编辑是否成功
    checkCode(res) {
      if (res.code === 10000 && res.success) {
        this.$message.success(res.message);
        this.pageCurrent = 1
        this.getTableData();
        this.clearInput();
        this.dialogFormVisible = false;
      } else {
        this.$message.error(res.message);
      }
    },
    // 测试连接
    handleText() {
      get("/sys/datasource/testConnection", {
        connType: this.paramRuleForm.connType, // 连接类型
        dbType: this.ruleForm.dbType, // DB类型
        host: this.paramRuleForm.host, // 主机
        password: this.paramRuleForm.password, // 密码
        port: this.paramRuleForm.port, // 端口
        schema: this.paramRuleForm.schema, // 数据库
        username: this.paramRuleForm.username // 用户名
      }).then(res => {
        if (res.code === 10000) {
          if (res.data) {
            this.$message.success("测试连接成功");
          } else {
            this.$message.error("测试连接失败");
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 提交新增
    addSource() {
      postByJson("/sys/datasource/createDataSourceInfos", this.msg).then(
        res => {
          // console.log(res, 123);
          if (res.code === 10000 && res.success) {
            this.checkCode(res);
          } else {
            this.$message.error(res.message)
          }
        }
      );
    },
    // 提交编辑
    editSource() {
      postByJson("/sys/datasource/editDataSourceInfos", this.msg).then(res => {
        this.checkCode(res);
        console.log(res, 123);
      });
    },
    // 获取数据库类型
    getDbType() {
      get("/sys/datasource/listDataSourceTypes").then(res => {
        console.log(res);
        this.DbTypeList = res.data;
      });
    },
    // 获取表格数据
    getTableData() {
      get("/sys/datasource/listDataSourceInfos", {
        dbType: this.dbType, // 数据库类型
        keyword: this.keyword,
        pageCurrent: this.pageCurrent,
        pageSize: this.pageSize,
        sourceType: this.sourceType // 数据源类型(0:虚拟;1:真实)
      }).then(res => {
        console.log(res, 123);
        if (res.code === 10000 && res.success) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    // 切换Tab
    handleTabClick() {
      if (this.choseType === "detail") {
        // this.resetFormCheck();
      }
      // this.resetFormCheck()
      // 判断数据源类型为虚拟时 参数信息不为必填
      if (this.ruleForm.sourceType === "0") {
        this.paramRules = {};
      } else if (this.selecSourceType !== "ORACLE") {
        this.paramRules = {
          host: [{ required: true, message: "请填写地址", trigger: "blur" }],
          port: [{ required: true, message: "请填写端口", trigger: "blur" }],
          schema: [
            { required: true, message: "请填写数据库", trigger: "blur" }
          ],
          username: [
            { required: true, message: "请填写用户名", trigger: "blur" }
          ],
          password: [
            { required: true, message: "请填写密码", trigger: "blur" }
          ],
          connType: [{ required: false }]
        };
      } else {
        this.paramRules = {
          host: [{ required: true, message: "请填写地址", trigger: "blur" }],
          port: [{ required: true, message: "请填写端口", trigger: "blur" }],
          schema: [
            { required: true, message: "请填写数据库", trigger: "blur" }
          ],
          username: [
            { required: true, message: "请填写用户名", trigger: "blur" }
          ],
          password: [
            { required: true, message: "请填写密码", trigger: "blur" }
          ],
          connType: [
            { required: true, message: "请选择数据库", trigger: "change" }
          ]
        };
      }
      console.log(this.paramRules);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getTableData();
    },
    resetFormCheck() {
      if (this.$refs.ruleForm) {
        this.$nextTick(() => {
          this.$refs.paramRuleForm.resetFields();
          this.$refs.ruleForm.resetFields();
          console.log("reset");
          this.clearInput();
        });
      }
    }
  },
  watch: {
    dialogFormVisible(val) {
      console.log(val);
      if (!val) {
        this.clearInput();
        console.log(this.$refs.ruleForm);
        this.$refs.ruleForm.resetFields();
        this.$refs.paramRuleForm.resetFields();
        this.$refs.ruleForm.clearValidate();
        this.$refs.paramRuleForm.clearValidate();
      }
    }
  },
  computed: {
    isDisabled: function() {
      if (this.ruleForm.sourceType && this.ruleForm.dbType) {
        return false;
      } else {
        return true;
      }
    }
  },
  created() {
    this.getDbType();
    this.getTableData();
  }
};
</script>

<style lang='scss' scoped>
.hole /deep/ {
  .el-card__body {
    padding: 16px;
    padding-top: 26px;
  }
  .el-button {
    height: 32px;
    line-height: 32px;
    padding: 0 15px;
    position: relative;
    span {
      font-size: 12px;
    }
  }
  .add-btn {
    padding: 0 15px;
    height: 32px;
    padding-left: 35px;
    position: relative;
    float: left;
  }
  .el-form-item {
    margin-bottom: 12px;
    .el-form-item__label {
      font-size: 12px;
    }
    .el-input__inner {
      font-size: 12px;
      height: 32px;
    }
  }
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
