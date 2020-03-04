<!--元数据查询-->
<template>
  <div class="mateData-container tableNoPadding">
    <el-container>
      <el-aside width="20%" class="leftdiv">
        <el-card class="left_tree">
          <div class="title">
            <span>定版对象</span>
          </div>
          <div class="treeDiv" v-loading='treeLoading'>
            <el-tree
              accordion
              @node-click="handleNodeClick"
              node-key="id"
              :props="viewProps"
              ref="tree"
              :highlight-current="true"
              :render-content="renderContent"
              :load="loadNode"
              lazy
            ></el-tree>
          </div>
        </el-card>
      </el-aside>
      <el-aside
        style="background-color:#000;height: calc(100vh - 115px);width: 4px;position: relative;right:5px;opacity:0;"
        @mousedown.native.prevent="dragControllerDiv($event)"
        class="resize"
      ></el-aside>
      <el-main>
        <el-card class="card-box" shadow="hover"> 
          <div class="mb20">
            <div class="right-title"><i class="line"></i>定版范围</div>
            <div class="right-table">
              <el-table size="small" v-loading='tableLoading' :data="tableData" border :header-cell-style="{'background': '#f8f8f9', 'color': '#606266'}">
                <el-table-column prop="code" label="分支代码"></el-table-column>
                <el-table-column prop="name" label="分支名称"></el-table-column>
                <el-table-column prop="classifierId" label="分支元数据类型"></el-table-column>
                <el-table-column prop="versionRange" label="定版范围">
                  <template slot-scope="scope">
                    <el-select multiple size="mini" @change="changeSelect($event, scope)" v-model="list[`versionRange${scope.$index}`]" placeholder="请选择">
                      <el-option
                        v-for="(item, index) in scope.row.selectList"
                        :key="index"
                        :label="item.classifierName"
                        :value="item.classifierId"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                      <el-button
                        @click="deleteVersion(scope.row, scope)"
                        type="text"
                        size="small"
                        >
                        <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                      </el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="version">
            <div class="right-title">
              <i class="line"></i>版本信息
            </div>
            <div class="version-box">
              <el-form :model="versionForm" :rules="rules" ref="versionForm" label-width="100px" class="demo-versionForm">
                <!-- <el-form-item label="版本编号：" prop="number">
                  <el-input v-model="versionForm.number"></el-input>
                </el-form-item> -->
                <el-form-item label="是否基线：" prop="isBsLine">
                  <el-select v-model="versionForm.isBsLine" clearable>
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="版本描述：" prop="desc">
                  <el-input v-model="versionForm.desc"></el-input>
                </el-form-item>
                <el-form-item style="text-align: center;">
                  <el-button type="primary" :disabled="saveBtn"  @click="handleSave('versionForm')">保存</el-button> 
                </el-form-item>
              </el-form>
            </div>
          </div>

        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { get, postByJson, parseAjaxResponse } from "@/utils/request";

export default {
  name: "metadataSearch",
  data() {
    return {
      saveBtn: false,
      tableLoading: false,
      // tree 部分的变量
      treeLoading: true,
      viewProps: {
        label: "name",
        children: "childNodes",
        isLeaf: "isLeaf"
      },
      tableData: [],
      versionForm: {
        number: '',
        isBsLine: '',
        desc: ''
      },
      rules: {
        isBsLine: [
          { required: true, message: '请选择是否是基线!', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请输入版本描述!', trigger: 'blur' }
        ]
      },
      treeNode: null,
      list: {}
    };
  },
  methods: {
    // 左边拖拽事件
    dragControllerDiv(e) {
      let width = document.getElementsByClassName("el-container")[0]
        .clientWidth;
      let remove = document.getElementsByClassName("resize");
      let c = e.clientX - remove[0].offsetLeft;
      let left = document.getElementsByClassName("leftdiv");
      let newWidth = null;
      console.log(e, remove, left, width);
      document.onmousemove = ev => {
        ev.preventDefault();
        console.log(ev);
        let ex = ev.clientX - c;
        newWidth = (ex / width) * 100;
        console.log(newWidth);
        newWidth = newWidth > 45 ? 45 : newWidth < 15 ? 15 : newWidth;
        left[0].style.width = newWidth.toFixed(2) + "%";
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
        // resize.releaseCapture && resize.releaseCapture()
      };
    },
    resetTable() {
      this.pageCurrent = 1;
      this.pageSize = 30;
      this.keyword = "";
      this.propSearch = "";
    },
    // 懒加载树
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.firstNode = node;
        this.node = node;
        this.resolve = resolve;
        get("/md/tree", {
          viewId: 0
        }).then(res => {
          if (res.code === 10000 && res.success === true) {
            this.treeLoading = false
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        if (!this.isMore) {
        // 非查看更多 flag
          this.treeCurrentPage = 1;
        }
        let params = {
          nodeType: node.data.nodeType,
          viewId: 0,
          current: this.treeCurrentPage
        };
        if (node.data.nodeType === "metaModel") {
          params.classifierId = node.data.classifierId;
          params.parentId = node.data.parentNodeId;
        } else {
          params.id = node.data.id;
        }
        get("/md/tree", params).then(res => {
          if (res.code === 10000 && res.success === true) {
            let resData = res.data;
            if (resData.length) {
            // 增加current属性
              resData.forEach((item, index) => {
                item.current = 1;
              });
              // 查看更多
              if (res.extras !== undefined) {
                if (res.extras.hasNextPage) {
                  resData.push({
                    id: null,
                    code: "查看更多",
                    name: "查看更多",
                    text: "查看更多",
                    isLeaf: true
                  });
                }
              }
            }
            console.log(res.data)
            res.data.map(val => {
              if (val.classifierId === 'Schema' && val.nodeType === 'metadata') {
                val.leaf = true
                val.isLeaf = true
                return val
              }
            })
            return resolve(res.data);
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    // 自定义tree 图标 文字
    renderContent(h, params) {
      let sText = params.data.text;
      let iconType = "";
      if (params.data.nodeType === "metadata") {
        sText = this.bShowCode === true ? params.data.code : params.data.text;
        iconType = "icon icon-" + params.data.classifierId;
      } else if (params.data.nodeType === "metaModel") {
        // console.log(params.data.classifierId, 'metaModel')
        sText = this.bShowCode === true ? params.data.classifierId ? params.data.classifierId : params.data.code : params.data.text;
        // if (params.data.classifierId === "Database" || params.data.classifierId === "Schema") {
        iconType = "icon icon-metaModel";
        // } else {
        //   iconType = "icon icon-" + params.data.classifierId;
        // }
      } else {
        iconType = "icon icon-" + params.data.nodeType;
      }
      if (params.data.nodeType === "view") {
        iconType = "icon icon-view";
      }
      if (params.data.code === "查看更多") {
        iconType = "icon icon-more";
      }
      return h(
        "span",
        {
          class: "tree-node"
        },
        [
          h(
            "span",
            {
              class: iconType,
              style: {
                marginRight: "4px",
                display: 'block',
                float: 'left'
              }
            },
            params.data.text === "查看更多" ? "<<" : ""
          ),
          h("span", sText)
        ]
      );
    },
    /**  tree  树操作    **/
    handleNodeClick(data, node, component) {
      this.treeNode = data
      console.log(data)
      if (data.classifierId === 'Schema' && data.nodeType === 'metadata') {
        let att = this.tableData.find((element) => (element.id === data.id))
        console.log(att)
        if (att === undefined) {
          this.tableLoading = true
          get('/home/subscribe/listClassifierTypesByInstanceId', {
            instanceId: data.id
          }).then(res => {
            if (res.code === 10000 && res.success) {
              data.selectList = res.data
              data.versionRange = []
            }
            this.tableData.push(data)
            this.list[`versionRange${this.tableData.length - 1}`] = []
            this.list = Object.assign({}, this.list)
            this.tableLoading = false
          })
        }
      }
    },
    // 删除操作
    deleteVersion(row, scope) {
      // console.log(row, scope)
      // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      this.tableData.splice(scope.$index, 1)
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   });
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   });
      // });
    },
    // 保存
    handleSave(formName) {
      this.saveBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          let params = {
            verDesc: this.versionForm.desc, // 版本说明
            verName: this.getNowFormatDate(), // 版本编号
            verType: this.versionForm.isBsLine, // 版本类型： 0-普通版本;1-基线版本
            versionMDs: []
          }
          this.tableData.map(item => {
            params.versionMDs.push({
              classifierId: item.versionRange.toString(),
              instanceId: item.id
            })
          })
          postByJson('/mdVersion/releaseVersion', params).then(
            res => {
              parseAjaxResponse(res)
              this.saveBtn = false
              this.tableData = []
              for (let a in this.versionForm) {
                this.versionForm[a] = ''
              }
              this.closeNavTag(this.$route);
              this.$router.push({ name: 'versionManagement' })
            }
          )
        } else {
          this.saveBtn = false
          return false;
        }
      });
    },
    // 获取本地年月日时分秒作为版本编号
    getNowFormatDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let hour = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (seconds >= 1 && seconds <= 9) {
        seconds = "0" + seconds;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = `${year}${month}${strDate}${hour}${minutes}${seconds}`;
      return currentdate;
    },
    // 关闭nav上的tag路由
    closeNavTag(view) {
      this.$store.dispatch("delVisitedViews", view).then(views => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("professionalTerms");
          }
        }
      });
    },
    // 判断是否为当前页面
    isActive(route) {
      return route.path === this.$route.path;
    },
    // 绑定select数据
    changeSelect(val, scope) {
      this.tableData[scope.$index].versionRange = val
    }
  },
  activated() {
  },
  created() {
  }
};
</script>

<style lang="scss">
//外层card容器样式;
@import "./../../styles/dq/main-card-table.scss";
@import "../../styles/treeIcon.scss";

$color-grey-light: #e0e0e0;
$border: #ebeef5;
.el-main {
  overflow: hidden;
}
.mb20 {
  margin-bottom: 20px;
}
.mateData-container {
  padding: 15px;
  height: 100%;
  .resize:hover {
    cursor: e-resize;
  }
  .deleteRed {
    height: 22px;
    width: 22px;
  }
  /deep/ .el-table {
    font-size: 12px;
    height: 100%;
    .preview,
    .blood2,
    .anaalysis2,
    .editor {
      width: 22px;
      height: 22px;
    }
  }
  /deep/ .tree-node {
    line-height: 20px;
    overflow: hidden;
  }
  // tree 鼠标右键弹出框
  .context-menu {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
    font-size: 14px;
    // display: none;
    /deep/ .el-card {
      height: auto;
      /deep/ .el-card__body {
        padding: 0px !important;
      }
      .el-row {
        padding: 10px 15px 10px;
        font-size: 12px;
        cursor: pointer;
      }
      .el-row:hover {
        background-color: #f8f8f9;
      }
    }
  }
  .treeDiv {
    width: 100%;
    padding: 15px;
    height: calc(100% - 30px);
    overflow-y: auto;
  }
  .treeDiv::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }
  .treeDiv::-webkit-scrollbar-track {
    background: none;
    border-radius: 2px;
  }
  .treeDiv::-webkit-scrollbar-thumb {
    background: rgb(239, 239, 239);
    border-radius: 10px;
  }
  .treeDiv::-webkit-scrollbar-thumb:hover {
    background: #bfbfbf;
  }
  /deep/ .el-card__body {
    padding: 25px 10px !important;
    position: relative;
    height: 100%;
  }
  .left_tree {
    height: 100%;
    .el-card {
      height: calc(100vh - 115px);
      /deep/ .el-card__body {
        padding: 25px 10px !important;
        position: relative;
        height: 100%;
      }
    }
    // .header {
    //   border-bottom: 1px solid $color-grey-light;
    //   display: flex;
    //   position: relative;
    //   height: 35px;
    //   padding: 4px 0 8px;
    .title {
      position: relative;
      font-size: 16px;
      border-bottom: 1px solid $border;
      padding: 0 10px 10px 10px;
      font-weight: bold;
      line-height: 26px;
      color: #7e7b7b;
      .el-switch {
        position: absolute;
        right: 10px;
        top: 0px;
        .el-switch__label--left {
          left: 26px;
        }
        .el-switch__label--right {
          left: 0;
        }
      }
    }
    .el-button {
      position: absolute;
      right: 0;
      bottom: 6px;
      padding: 3px 8px;
      /deep/ .el-icon-refresh {
        font-size: 18px !important;
      }
    }
    // }
    .footer {
      position: absolute;
      // bottom: 15px;
      bottom: 3px;
      border-top: 1px solid $color-grey-light;
      display: flex;
      width: calc(100% - 20px);
      padding-top: 10px;
      background: #fff;
      .title {
        margin: 0;
        border: unset;
        font-size: 16px;
        font-weight: 700;
        color: rgb(126, 123, 123);
        padding-left: 10px;
      }
      .el-select {
        position: absolute;
        right: 10px;
        top: 6px;
      }
    }
  }
  .el-main {
    padding: 0;
    border: 1px solid #ebeef5;
    margin-left: 10px;
    background: #fff;
    height: calc(100vh - 115px);
    .card-box {
      overflow: auto;
      &::-webkit-scrollbar {
        width: 5px;
        height: 10px;
      }
      &::-webkit-scrollbar-track {
        background: none;
        border-radius: 2px;
      }
      &::-webkit-scrollbar-thumb {
        background: rgb(239, 239, 239);
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: #bfbfbf;
      }
      .version {
        margin-bottom: 80px;
        .version-box {
          padding: 0 30px;
          .demo-versionForm {
            width: 80%;
          }
        }
      }
    }
    // .card-box::-webkit-scrollbar {
    //   width: 5px;
    //   height: 10px;
    // }
    // .card-box::-webkit-scrollbar-track {
    //   background: none;
    //   border-radius: 2px;
    // }
    // .card-box::-webkit-scrollbar-thumb {
    //   background: rgb(239, 239, 239);
    //   border-radius: 10px;
    // }
    // .card-box::-webkit-scrollbar-thumb:hover {
    //   background: #bfbfbf;
    // }
    .right-title {
      font-family: "PingFangSC-Regular", "PingFang SC";
      font-weight: 400;
      height: 30px;
      line-height: 30px;
      font-style: normal;
      font-size: 16px;
      color: #666666;
      border-bottom: unset;
      margin-bottom: 20px;
      padding: 0 20px;
      .line {
      height: 100%;
      width: 4px;
      float: left;
      display: block;
      background: #579ef3;
      margin-right: 15px;
      }
    }
    .right-table {
      padding: 0 10px;
    }
  }
  .el-card {
    height: calc(100vh - 115px);
    .el-card__body {
      .card-header {
        display: flex;
        border-bottom: 1px solid $color-grey-light;
        padding: 4px 0 8px;
        padding-right: 35px;
        position: relative;
        .definition-list {
          width: 35px;
          height: 25px;
          position: absolute;
          right: 0;
          cursor: pointer;
        }
        .el-icon-location-outline {
          font-size: 22px;
          position: relative;
          bottom: 3px;
          margin-right: 6px;
        }
        .el-breadcrumb {
          font-size: 16px;
          /deep/ .el-breadcrumb__inner {
            color: #409eff;
            cursor: pointer;
          }
        }
        // .dimensionality-form{
        //     .el-form-item{
        //         margin-right:8px;
        //         margin-bottom:0;
        //         /deep/ .el-form-item__label{
        //             padding-right:5px;
        //         }
        //     }
        // }
      }
      .no-data {
        background: url("./../../assets/images/commonIcon/no-data.png")
          no-repeat;
        background-size: 500px 457px;
        margin: 30px auto;
        width: 100%;
        height: 100%;
        background-position: center;
      }
      .card-button {
        // margin-left: 20px;
        // margin-top: 15px;
        /deep/ .el-form-item__label {
          line-height: 30px;
        }
        /deep/ .el-form-item__content {
          line-height: 30px;
        }
        .el-dropdown {
          margin: 0 10px;
          // bottom: 3px;
        }
        .el-button--mini {
          font-size: 13px;
          // padding: 4px 8px;
          padding: 0px 8px;
          height: 30px;
          .svg-icon,
          .text {
            position: relative;
          }
          .text {
            margin-left: 3px;
            bottom: 3px;
          }
        }
        .yulan {
          .svg-icon {
            width: 18px;
            height: 18px;
          }
        }
        .zengjia {
          // padding: 6px 7px 5px;
          .svg-icon {
            width: 16px;
            height: 16px;
          }
          .text {
            bottom: 1px;
          }
        }
        .xiugai {
          // padding: 2.5px 6px 5.5px;
          .svg-icon:nth-of-type(1) {
            width: 20px;
            height: 20px;
            top: 1px;
          }
          .svg-icon:nth-of-type(2) {
            width: 12px;
            height: 16px;
          }
          .text {
            bottom: 2px;
            margin-left: 0;
          }
        }
        .shanchu {
          .svg-icon {
            width: 18px;
            height: 18px;
          }
          .text {
            margin-top: 6px;
            float: right;
          }
        }
        .shuaxin {
          .svg-icon {
            width: 18px;
            height: 18px;
          }
          .text {
            margin-top: 6px;
            float: right;
          }
        }
        .xiazai {
          .svg-icon {
            width: 18px;
            height: 18px;
          }
        }
        .shangchuan {
          .svg-icon {
            width: 18px;
            height: 18px;
          }
        }
      }
      .card-table {
        overflow-y: auto;
        width: 100%;
        height: calc(100% - 90px);
        margin-top: 20px;
        /deep/ .tableClass {
          border-right: none !important;
        }
        /deep/ .preview {
          width: 22px;
          height: 22px;
        }
      }
      .card-table::-webkit-scrollbar {
        width: 5px;
        height: 10px;
      }
      .card-table::-webkit-scrollbar-track {
        background: none;
        border-radius: 2px;
      }
      .card-table::-webkit-scrollbar-thumb {
        background: rgb(239, 239, 239);
        border-radius: 10px;
      }
      .card-table::-webkit-scrollbar-thumb:hover {
        background: #bfbfbf;
      }
    }
  }
  .picker-date {
    width: 180px;
  }
}
.tree-box {
  margin-top: 5px;
}
.tag-box {
  line-height: 32px;
}
.delete-dialog {
  /deep/ .el-dialog__body {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
}
.dialog-btn {
  text-align: center;
  border-top: 1px solid #e8ebed;
  padding: 10px;
}
.el-dropdown-menu {
  padding: 0;
}
/deep/ .el-dialog__wrapper .el-dialog {
  width: 50%;
}

</style>