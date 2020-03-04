<template>
  <div style="padding:10px;">
    <el-card class="box-card">
      <div slot="header">
        <div id="lab-form">
          <el-form :inline="true" @submit.native.prevent>
            <div id="btn-add-delete div_add" style="display:inline">
              <el-button class="btnOne" type="primary" @click="handleAdd" size="small">
                <img class="add_img" src="./../../assets/images/desktop/add.png" alt />
                新增标签
              </el-button>
              <el-button type="danger" icon="el-icon-delete" @click="openDelete" size="small">批量删除</el-button>
            </div>
            <div class="form-float" style="display:inline">
              <el-form-item label="标签名称:">
                <el-input
                 clearable 
                  v-model.trim="sLabelName"
                  placeholder="请输入标签名称"
                  size="small"
                  style="width:310px"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch" size="small">查询</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div id="add-dialog">
          <el-dialog :title="title" :visible.sync="bAddDialogVisible" style="font-size:12px">
            <el-form ref="LabelForm" :model="aForm" :rules="rules">
              <el-form-item label="标签名称:" :label-width="sFormLabelWidth" prop="sTagName">
                <el-input v-model="aForm.sTagName" placeholder="请输入空间名称" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="标签描述：" :label-width="sFormLabelWidth" prop="aLabDesc">
                <el-input type="textarea" :rows="5" placeholder="请输入空间描述" v-model="aForm.sTagDesc"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="handleSubmit('LabelForm')">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
      <div id="lab-table">
        <el-table
          border
          show-header
          :data="aTableData"
          :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
          :default-sort="{prop: 'date', order: 'descending'}"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column style="width: 60px" type="selection"></el-table-column>
          <el-table-column prop="name" label="标签名称" sortable></el-table-column>
          <el-table-column prop="docCount" label="知识统计" sortable></el-table-column>
          <el-table-column prop="creatorName" label="创建人" sortable></el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
          <el-table-column prop="lastUpdateTime" label="更新时间" sortable></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-button   @click="handleEdit(scope.$index, scope.row)" type="text" size="small" >
                  <svg-icon icon-class="editor" class="editor"></svg-icon>
                </el-button>
              </el-tooltip>
              <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
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
            :current-page="iCurrentPage4"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="ipageSize"
            layout="total, prev, pager, next,sizes,jumper"
            :total="iTotalPage"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { get } from "@/utils/request";
export default {
  name: "labelSearch",
  data() {
    return {
      bAddDialogVisible: false,
      title: "",
      aForm: {
        sTagName: "",
        sTagDesc: ""
      },
      sFormLabelWidth: "120px",
      rules: {
        sTagName: [
          { required: true, message: "请输入标签名称", trigger: "blur" }
        ]
        // aLabDesc: [{ required: true, message: "请输入标签描述" }]
      },
      sLabelName: "",
      aTableData: [],
      iCurrentPage4: 1,
      ipageSize: 10,
      iTotalPage: 0,
      labelIds: []
    };
  },
  methods: {
    // 删除警告
    openDelete() {
      this.$confirm("是否确认删除该标签？", "删除标签", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.handleDelete();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 搜索
    onSearch() {
      this.iCurrentPage4 = 1
      this.getLabelList();
    },
    // 触发新增弹窗
    handleAdd() {
      this.aForm.sTagName = "";
      this.aForm.sTagDesc = "";
      this.bAddDialogVisible = true;
      this.title = "新增标签";
    },
    // 新增标签
    addLabel() {
      const _this = this;
      get("/kno/label/createLabel", {
        name: _this.aForm.sTagName,
        desc: _this.aForm.sTagDesc
      }).then(res => {
        if (res.code === 10000 && res.success) {
          _this.$message.success(res.message);
          this.resetSearch()
          _this.getLabelList();
        } else {
          _this.$message.error(res.message);
        }
      });
      this.bAddDialogVisible = false;
    },
    // 触发编辑弹框
    handleEdit(index, row) {
      this.labelId = row.labelId;
      this.title = "编辑标签";
      this.getLabelDetail();
      this.bAddDialogVisible = true;
    },
    // 编辑标签
    editLabel() {
      const _this = this;
      get("/kno/label/editLabel", {
        name: _this.aForm.sTagName,
        desc: _this.aForm.sTagDesc,
        labelId: _this.labelId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          _this.$message.success(res.message);
          this.resetSearch()
          _this.getLabelList();
        } else {
          _this.$message.error(res.message);
        }
      });
      this.bAddDialogVisible = false;
    },
    // 获取标签详情
    getLabelDetail() {
      get("/kno/label/getLabelDetail", {
        labelId: this.labelId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.aForm.sTagName = res.data.name;
          this.aForm.sTagDesc = res.data.labelDesc;
        }
      });
    },
    // 确认编辑/新增
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.title === "编辑标签" ? this.editLabel() : this.addLabel();
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    cancel() {
      this.title === "编辑标签"
        ? this.$message("取消编辑")
        : this.$message("取消新增");
      this.bAddDialogVisible = false;
    },
    // 表头checkbox
    handleSelectionChange(val) {
      this.labelIds = [];
      val.map(item => {
        this.labelIds.push(item.labelId);
      });
    },
    // 批量删除
    handleDelete() {
      get("/kno/label/removeLabels", {
        labelIds: this.labelIds.toString()
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.resetSearch()
          this.getLabelList();
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    resetSearch() {
      this.sLabelName = ""
      this.iCurrentPage4 = 1
    },
    // 改变展示条数
    handleSizeChange(val) {
      this.ipageSize = val;
      this.getLabelList();
    },
    // 翻页
    handleCurrentChange(val) {
      this.sLabelName = ""
      this.iCurrentPage4 = val;
      this.getLabelList();
    },
    // 获取表格数据
    getLabelList() {
      const _this = this;
      get("/kno/label/listLabel", {
        pageCurrent: _this.iCurrentPage4,
        pageSize: _this.ipageSize,
        keyword: _this.sLabelName
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          _this.iTotalPage = res.data.total;
          _this.aTableData = res.data.records;
        } else {
          _this.$message.error(res.message);
        }
      });
    }
  },
  created() {
    this.getLabelList();
  }
};
</script>
<style>
.form-float {
  float: right;
}
.div-page {
  text-align: center;
  padding-top: 10px;
}
#lab-form .el-form-item__label {
  font-size: 12px;
}
#lab-form .el-input__inner {
  height: 30px;
}
#lab-table .el-table--border td {
  border-right: none;
}
#lab-table .el-table--border th {
  border-right: none;
}
#lab-table .el-table {
  font-size: 12px;
}
#lab-table .item .editor{
  width:22px;
  height:22px;
}
#add-dialog .el-form-item__label {
  font-size: 12px;
  text-align: left;
}
#add-dialog .el-dialog__title {
  font-size: 14px;
  color: #17233d;
  font-weight: 700;
}
#add-dialog .el-dialog__header {
  border-bottom: 1px solid #e8eaec;
}
#add-dialog .el-dialog__footer {
  border-top: 1px solid #e8eaec;
}
</style>
