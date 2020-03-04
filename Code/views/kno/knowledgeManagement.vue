<template>
  <div class="konManagement" style="padding:10px;">
    <el-card shadow="hover">
      <div slot="header">
        <div class="tab-filter">
          <el-form :inline="true">
            <el-form-item label="空间名称:">
              <el-select
                clearable
                v-model.trim="sFilterSpaceID"
                placeholder="请选择"
                @change="filterChangeSpace"
                style="width:148px"
              >
                <el-option
                  v-for="item in aSpaceData"
                  :key="item.spaceId"
                  :value="item.spaceId"
                  :label="item.spaceName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建人:">
              <el-select
                clearable
                v-model.trim="sCreator"
                placeholder="请选择"
                class="select-input"
                @change="handleChangeCreator"
                style="width:148px"
              >
                <el-option
                  v-for="item in aCreatorList"
                  :key="item.iUserID"
                  :label="item.userName"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题:">
              <el-input
                v-model.trim="sKeyword"
                placeholder="请输入关键字..."
                size="small" clearable
                @keyup.enter.native="getDocumentList"
                style="width:200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="标签:">
              <el-input
                v-model.trim="sLabelKey"
                placeholder="请输入关键字..."
                size="small" clearable
                @keyup.enter.native="getDocumentList"
                style="width:200px"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="getDocumentList"
                size="small"
              >查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- <div id="div_add" style="margin-bottom: 20px;padding:0 10px;">
        <el-button type="primary" @click="addDocumnet" size="small" class="btnOne">
          <img class="add_img" src="./../../assets/images/desktop/add.png" alt />
          新增文档
        </el-button>
      </div> -->
      <div id="div_table">
        <el-table
          :data="aTableData"
          border
          show-header
          :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
          style="width: 100%"
        >
          <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
          <el-table-column prop="creatorName" label="创建人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="spaceName" label="空间" show-overflow-tooltip></el-table-column>
          <el-table-column  label="标签" show-overflow-tooltip>
            <!-- <template v-if="scope.row.labelNames !== ''" slot-scope="scope">
              <el-tag v-for="(item, index) in scope.row.labelNames.split(',') " :key="index">{{item}}</el-tag>
            </template>
            <template slot-scope="scope">
              <el-tag>{{scope.row.labelNames}}</el-tag>
            </template> -->
            <template  slot-scope="scope">
              <span v-if="scope.row.labelNames !== ''&&scope.row.labelNames !==undefined">{{scope.row.labelNames}}</span>
              <span v-if="scope.row.labelNames ===undefined">无</span>
            </template>
          </el-table-column>

          <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="lastUpdateTime" label="更新时间" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center" width="180px">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                <el-button @click="toDetails(scope.row)" type="text" size="small">
                  <svg-icon icon-class="preview" class="preview"></svg-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-button  @click="handleClick(scope.row)" type="text" size="small" 
                v-if="scope.row.spaceType==='public'||scope.row.privilege===1||scope.row.privilege===2">
                  <svg-icon icon-class="editor" class="editor"></svg-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-button  @click='handleDelete(scope.row.docId)' type="text" size="small" 
                v-if="scope.row.spaceType==='public'||scope.row.privilege===2">
                  <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                </el-button>
              </el-tooltip>
              <!-- <el-button @click="handleClick(scope.row)" type="primary" size="small">编辑</el-button> -->
              <!-- <el-button @click="handleDelete(scope.row.docId)" type="primary" size="small">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div id="kno-pag">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="iCurrentPage2"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, prev, pager, next,sizes,jumper"
          :total="iTotalPage"
        ></el-pagination>
      </div>
      <div id="div_dialog">
        <el-dialog :visible.sync="bAddDialogVisible" width="35%">
          <div style="text-align: center;">
            <el-form>
              <el-form-item>
                <span style="padding:5px">选择空间:</span>
                <el-select
                  v-model="sSpaceID"
                  clearable
                  placeholder="请选择空间"
                  @change="handleChangeID"
                >
                  <el-option
                    v-for="item in aSpaceData"
                    :key="item.spaceId"
                    :value="item.spaceId"
                    :label="item.spaceName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer">
            <el-button type="text" @click="bAddDialogVisible = false">取 消</el-button>
            <!-- <router-link style="margin-left:20px;" :to="'/kno/addDocument/'+sSpaceID">              
            </router-link> -->
            <el-button type="primary" @click="goAddDocument">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import { get } from "@/utils/request";
export default {
  name: "knowledgeManagement",
  data() {
    return {
      sFilterSpaceID: "",
      aSpaceData: [],
      sCreator: "",
      aCreatorList: [],
      // 搜索关键字
      sKeyword: "",
      sLabelKey: "",
      bAddDialogVisible: false,
      aTableData: [],
      iCurrentPage2: 1,
      iTotalPage: 0,
      pageSize: 10,
      sSpaceID: "",
      aSpaceDataFilter: [],
      spaceId: "",
      // 创建人ID
      createUserId: ""
    };
  },

  methods: {
    // 空间名称
    filterChangeSpace(val) {
      this.spaceId = val;
    },
    // 创建人
    handleChangeCreator(val) {
      this.sCreator = val;
    },
    // 查询
    getDocumentList() {
      this.getTableList();
    },
    // 跳转编辑页
    handleClick(row) {
      console.log(2222222, row)
      this.aSpaceData.map(item => {
        item.spaceName === row.spaceName ? (this.spaceId = item.spaceId) : "";
      });
      this.$router.push({
        name: "editDocument",
        params: {
          docId: row.docId,
          spaceId: this.spaceId,
          isDraft: 0
        }
      });
    },
    // 删除操作
    handleDelete(val) {
      this.$confirm("", "确定删除该文档吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          get("/kno/doc/removeDocument", {
            docId: val
          }).then(res => {
            if (res.code === 10000 && res.success) {
              this.getTableList();
              this.$message.success(res.message);
            } else {
              this.$message.error(res.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.iCurrentPage2 = val;
      this.getTableList();
    },
    // 新增弹窗 选择空间
    handleChangeID(id) {
      this.sSpaceID = id;
    },
    // 跳详情页
    toDetails(row) {
      this.$router.push({
        name: "knoDetail",
        params: { docId: row.docId, spaceType: row.spaceType, privilege: row.privilege, isControlEdit: true }
      });
    },
    // 获取创建人
    getListCreator() {
      get("/kno/doc/listCreators").then(res => {
        this.aCreatorList = res.data;
      });
    },
    addDocumnet() {
      this.bAddDialogVisible = true
      this.getSpaceList()
    },
    // 获取空间下拉数据
    getSpaceList() {
      get("/kno/doc/listSpaceOnEditorPermission").then(res => {
        this.aSpaceData = res.data;
      });
    },
    goAddDocument() {
      if (this.aSpaceData.length > 0) {
        this.$router.push({ name: 'addDocument' })
      } else {
        this.$message.warning('没有可用的空间!')
      }
      this.bAddDialogVisible = false
    },
    // 获取表格数据
    getTableList() {
      get("/kno/doc/listDocument", {
        createUserId: this.sCreator ? this.sCreator : "",
        labelKeyword: this.sLabelKey ? this.sLabelKey : "",
        pageCurrent: this.iCurrentPage2,
        pageSize: this.pageSize,
        spaceId: this.spaceId ? this.spaceId : null,
        titleKeyword: this.sKeyword ? this.sKeyword : ""
      }).then(res => {
        if (res.code === 10000 && res.success === true) {
          console.log(res)
          this.aTableData = res.data.records;
          this.iTotalPage = res.data.total;
        } else {
          this.$message.error(res.message);
        }
      });
    }
  },
  activated() {
    this.spaceId = ''
    this.getTableList();
    this.getSpaceList();
    this.getListCreator();
  },
  created() {
    this.getListCreator();
    this.getSpaceList();
    this.getTableList();
  }
};
</script>
<style lang="scss" scoped>
.konManagement{
  /deep/ .el-card__header{
    padding:5px 20px
  }
  .tab-filter{
    margin-top:20px
  }
 /deep/ .el-table--border td {
    border-right: none;
  }
  /deep/ .el-table--border th {
    border-right: none;
  }
  /deep/ .el-form-item__label {
    font-size: 13px;
    color: #333;
  }
  /deep/ .el-table {
    font-size: 12px;
  }
  #div_table {
      .item 
        {
            .preview,.deleteRed,.editor{
              width:22px;
              height:22px;
          }
    }
  }
  #div_table /deep/ .el-tag{
    border: 1px solid #e8eaec;
    border-radius: 3px;
    background: #f7f7f7;
    margin: 2px 4px 2px 0;
    padding: 0 8px;
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    color: #515a6e;
  }
  /deep/ .el-input__inner {
    height: 30px;
    line-height: 32px;
  }
  #kno-pag {
    text-align: center;
    padding-top: 10px;
  }
  #div_dialog /deep/ .el-dialog__footer {
    border-top: 1px solid #e8eaec;
  }
  #div_dialog /deep/ .el-dialog__body {
    padding: 10px 10px;
  }
  #div_add /deep/ .el-button--small {
    line-height: 20px;
    padding: 5px 15px;
  }
}
</style>
