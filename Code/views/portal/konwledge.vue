<template>
  <!-- 我的知识 -->
  <div class="kno-hole">
    <el-container class="know-box">
      <el-aside class="kn-left-part" width="240px" style="background-color: rgb(238, 241, 246)margin-right:30px">
        <el-card class="left_box">
          <div class="left_top">
            <el-button type="primary" @click="toAddDoc" round class="button_lefttop">
              <svg-icon icon-class="editDoc"></svg-icon>
              <span class="btn-text">写文章</span>
            </el-button>
          </div>
          <div class="left_center">
            <div class="unpublish_div left_pub">
              <svg-icon icon-class="caogao"></svg-icon>
              <a @click="getmsgList2" :class="[isvisited===0?'':'visited']">草稿箱({{unpublishNum}})</a>
            </div>
            <div class="published_div left_pub">
              <svg-icon icon-class="duigou"></svg-icon>
              <a @click="getmsgList"   :class="[isvisited===1?'':'visited']">已发布({{publishNum}})</a>
            </div>
          </div>
          <div class="mylable">
            <svg-icon icon-class="mylable"></svg-icon>
              <span>我的标签({{labelNum}})</span>
          </div>
          <div class="left_bottom">
            <ul class="left_ul">
              <li v-for="(item, index) in showLabels" :key="index" @mouseover="overShow(index)" @mouseout="outHide" :class="{'hover':index===hoverIndex}">
                  <span>{{item.name}}</span>
                  <span class="aedit_box">
                    <el-button   
                      type="text"
                      @click="editLabel(item)"
                      size="mini"
                      class="edit_box">
                      <!-- <svg-icon icon-class="editor" class="editor"></svg-icon> -->
                       <span class="el-icon-edit-outline" style="margin-top:1px"></span>
                    </el-button>
                    <el-button   
                      type="text"
                      @click="delLabel(item)"
                      size="mini"
                      class="del_box">
                      <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                    </el-button>
                  </span>
              </li>
              <a @click="moreLabels" style="cursor:point;display:inline-block;margin-left:20px" v-if="allLabels.length>20&&allLabels.length!==showLabels.length">
                more >>>
              </a>
            </ul>
          </div>
        </el-card>
      </el-aside>

      <el-container style="height: calc(100% - 10px);" >
        <el-main class="kno-contentBox" v-if="isHasData" >
          <div class="search_div" style="margin-bottom:20px;width:100%;text-align:right">
            <el-input v-model="keyword" placeholder="请输入..." size="small" clearable @keyup.enter.native="handleSearch()" style="width:200px;">
             <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch" ></i>
            </el-input>
          </div>
          <div class="list_box" v-loading="loadList">
            <div class="kno-contentBox-item" v-for="(item, index) in msgList" :key="index">
              <div class="title">
                <span @click="clickTitle(item)">{{item.title}}</span>
                <div class="aedit_list">
                  <el-button @click="handleEdit(item)" type="text">
                    <!-- <svg-icon icon-class="editor" class="editor"></svg-icon> -->
                    <span class="el-icon-edit-outline"></span>&nbsp;<span class="editfont">编辑</span>
                  </el-button>
                  <el-button @click="handleDelete(item)" type="text">
                    <svg-icon icon-class="deleteRed" class="deleteRed"></svg-icon>
                    <span class="right_edit">删除</span>
                  </el-button>
                </div>
              </div>
              <div class="tags" v-if="item.labelNames!==undefined&&item.labelNames!==''">
                <el-tag type="info" v-for="(tag, a) in item.labelNames.split(',')" :key="a">{{tag}}</el-tag>
              </div>
              <div class="info" >{{item.info}}</div>
              <div class="k-other">
                <div class="k-data fl" style="margin-right:20px">
                  <i class="el-icon-user"></i>
                  {{item.creatorName}}
                </div>
                <div class="k-data fl">
                  <i class="el-icon-date"></i>
                  {{item.updateTime}}
                </div>
                <div class=" fr" v-if="item.isDraft===0">
                  <div class="k-delet fr">
                   <i class="el-icon-view"></i>
                    {{item.viewCount}}
                  </div>
                  <div class="k-edit fr" style="margin-right: 50px;">
                    <i class="el-icon-star-off"></i>
                    {{item.collectionCount}}
                  </div>
                </div>
              </div>
            </div>
            <div class="page-current" v-if="total>0">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageCurrent"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total,  prev, pager, next,sizes, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </el-main>
        <el-main class="kno-contentBox no-data" v-if="!isHasData">
           <div class="search_div" style="margin-bottom:20px;width:100%;text-align:right">
            <el-input v-model="keyword" placeholder="请输入..." size="small" clearable @keyup.enter.native="handleSearch()" style="width:200px;">
             <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch" ></i>
            </el-input>
          </div>
          <svg-icon icon-class="nodata" class="nodata"></svg-icon>       
        </el-main>
      </el-container>
    </el-container>
    <div class="add-dialog">
      <el-dialog title="编辑标签" :visible.sync="bAddDialogVisible" style="font-size:12px" width="40%">
        <el-form ref="LabelForm" :model="aForm" :rules="rules" label-width="110px">
          <el-form-item label="标签名称:" prop="sTagName">
            <el-input v-model="aForm.sTagName" placeholder="请输入标签名称" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="标签描述："  prop="aLabDesc">
            <el-input type="textarea" :rows="5" placeholder="请输入标签描述" v-model="aForm.sTagDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="bAddDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit('LabelForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import showdown from 'showdown'
import { get, parseAjaxResponse } from "@/utils/request";
export default {
  name: 'MY_KONWLEDGE',
  data() {
    return {
      isHasData: true,
      hoverIndex: -1,
      unpublishNum: 0, // 未发布的文章数量
      publishNum: 0, // 已经发布的文章数量
      labelCount: 1,
      labelNum: 0,
      allLabels: [],
      showLabels: [],
      // 旧数据
      spaceList: [],
      msgList: [],
      pageSize: 10,
      pageCurrent: 1,
      total: 0,
      keyword: "",
      // 空间模块数据（已废弃）
      spaceTotal: 0,
      spacePageSize: 10,
      spacePageCurrent: 1,
      spaceMsg: "",
      // 草稿块
      spaceList2: [],
      spaceMsg2: "",
      spaceId2: '',
      spacePageSize2: 10,
      spacePageCurrent2: 1,
      spaceTotal2: 10,
      loadList: false,
      // label编辑
      bAddDialogVisible: false,
      aForm: {
        sTagName: "",
        sTagDesc: ""
      },
      rules: {
        sTagName: [
          { required: true, message: "请输入标签名称", trigger: "blur" }
        ]
      },
      labelId: '',
      isvisited: 1
    };
  },
  methods: {
    // li的悬浮事件
    overShow(val) {
      this.hoverIndex = val
    },
    outHide(val) {
      this.hoverIndex = -1
    },
    // 草稿
    // 获取我创建草稿的数量
    getUnpublishNum() {
      get("/home/kno/getMyDraftNum").then(res => {
        if (res.code === 10000 && res.success) {
          this.unpublishNum = res.data
        }
      });
    },
    // 获取我创建的草稿
    getmsgList2() {
      this.isvisited = 1
      this.loadList = true
      get("/home/kno/listCreatedDrafts", {
        keyword: this.keyword,
        pageCurrent: this.pageCurrent,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.loadList = false
          this.msgList = res.data.records;
          if (res.data.records.length > 0) {
            this.isHasData = true
          } else {
            this.keyword = ''
            this.isHasData = false
          }
          this.total = res.data.total;
          this.msgList.map(item => {
            if (item.type === 1 && item.info !== undefined) {
              // 创建实例
              var converter = new showdown.Converter();
              // 进行转换
              item.info = converter.makeHtml(item.info);
            }
          })
          this.msgList.map(item => {
            if (item.info) {
              item.info = this.ToText(item.info)
            }
            item.info = item.info.replace(/&nbsp;/ig, "");
            if (item.info.length > 200) {
              item.info = item.info.slice(0, 200) + '...'
            }
          })
          // this.msgList.map(item => {
          //   if (item.info.length > 200) {
          //     item.info = item.info.slice(0, 200) + '...'
          //   }
          // })
        } else {
          this.loadList = false
          this.$message.error(res.message);
        }
      });
    },

    // 获取我发布的文档
    getmsgList() {
      this.isvisited = 0
      this.loadList = false
      get("/home/kno/listPublishedDocs", {
        keyword: this.keyword,
        pageCurrent: this.pageCurrent,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.loadList = false
          this.msgList = res.data.records;
          if (res.data.records.length > 0) {
            this.isHasData = true
          } else {
            this.keyword = ''
            this.isHasData = false
          }
          this.total = res.data.total;
          this.msgList.map(item => {
            if (item.type === 1 && item.info !== undefined) {
              // 创建实例
              var converter = new showdown.Converter();
              // 进行转换
              item.info = converter.makeHtml(item.info);
            }
          })
          this.msgList.map(item => {
            if (item.info) {
              item.info = this.ToText(item.info)
            }
            item.info = item.info.replace(/&nbsp;/ig, "");
            if (item.info.length > 200) {
              item.info = item.info.slice(0, 200) + '...'
            }
          })
          // this.msgList.map(item => {
          //   if (item.info.length > 200) {
          //     item.info = item.info.slice(0, 200) + '...'
          //   }
          // })
        } else {
          this.loadList = false
          this.$message.error(res.message);
        }
      });
    },

    // html剔除富文本标签，留下纯文本
    getSimpleText(html) {
      var re1 = new RegExp("<.+?>", "g");// 匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
      var msg = html.replace(re1, '');// 执行替换成空字符
      return msg;
    },
    ToText(HTML) {
      var input = HTML;
      return input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ');
    },
    // 获取我发布文档的数量
    getPublishedNum() {
      get("/home/kno/getMyDocNum").then(res => {
        if (res.code === 10000 && res.success) {
          this.publishNum = res.data
        }
      })
    },

    // 文章分页部分已发布的和草稿共用
    handleSizeChange(val) {
      this.pageSize = val;
      if (this.isvisited === 0) {
        this.getmsgList();
      } else {
        this.getmsgList2();
      }
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      if (this.isvisited === 0) {
        this.getmsgList();
      } else {
        this.getmsgList2();
      }
    },

    // 删除
    handleDelete(item) {
      if (item.tempId) {
        get("/home/kno/removeDraft", {
          tempId: item.tempId
        }).then(res => {
          if (res.code === 10000 && res.success) {
            this.$message.success(res.message);
            this.getUnpublishNum()
            this.getmsgList2();
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        get("/kno/doc/removeDocument", {
          docId: item.docId
        }).then(res => {
          if (res.code === 10000 && res.success) {
            this.$message.success(res.message);
            this.getPublishedNum()
            this.getmsgList();
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    // 点击标题
    clickTitle(item) {
      // isDraft = 0 非草稿
      if (item.isDraft === 0) {
        this.$router.push({
          name: "knoDetail",
          params: { docId: item.docId, comeFrom: "myknowledge" }
        });
      } else {
        this.$router.push({
          name: "editDocument",
          params: {
            docId: item.docId,
            tempId: item.tempId,
            comeFrom: "myknowledge",
            isDraft: 1
          }
        });
      }
    },
    // 跳转到编辑
    handleEdit(item) {
      console.log(11111111, item)
      this.$router.push({
        name: "editDocument",
        params: {
          docId: item.docId,
          tempId: item.tempId,
          comeFrom: "myknowledge",
          isDraft: item.isDraft
        }
      });
    },
    handleSearch() {
      if (this.isvisited === 0) {
        this.getmsgList();
      } else {
        this.getmsgList2();
      }
    },
    // 获取我创建的所有标签和标签总数
    getLabel() {
      get("/home/kno/getMyLabelInfo").then(res => {
        if (res.code === 10000 && res.success) {
          this.labelCount = 1
          this.labelNum = res.data.labelNum;
          if (res.data.allLabels) {
            this.allLabels = res.data.allLabels;
          } else {
            this.allLabels = []
          }
          if (res.data.labelNum > 0) {
            this.showLabels = this.allLabels.slice(0, this.labelCount * 20)
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 标签用户点击more
    moreLabels() {
      this.labelCount = this.labelCount + 1
      this.showLabels = this.allLabels.slice(0, this.labelCount * 20)
    },
    // 获取标签详情
    getLabelDetail(item) {
      get("/kno/label/getLabelDetail", {
        labelId: item.labelId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          this.aForm.sTagName = res.data.name;
          this.aForm.sTagDesc = res.data.labelDesc;
        }
      });
    },
    // 编辑label
    editLabel(item) {
      this.getLabelDetail(item)
      this.labelId = item.labelId
      this.bAddDialogVisible = true
    },
    // 确认编辑
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editLabelsave();
        } else {
          this.$message.error("请填写必填项")
        }
      });
    },
    // 编辑标签
    editLabelsave() {
      const _this = this;
      get("/kno/label/editLabel", {
        name: _this.aForm.sTagName,
        desc: _this.aForm.sTagDesc,
        labelId: _this.labelId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          _this.$message.success(res.message);
          this.bAddDialogVisible = false;
          this.getLabel()
          if (this.msgList.length > 0) {
            if (this.isvisited === 0) {
              this.getmsgList();
            } else {
              this.getmsgList2();
            }
          }
        } else {
          _this.$message.error(res.message);
        }
      });
    },
    // 删除标签
    delLabel(item) {
      this.$confirm("是否确认删除该标签？", "删除标签", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          get("/kno/label/removeLabels", {
            labelIds: item.labelId.toString()
          }).then(res => {
            if (res.code === 10000 && res.success) {
              this.getLabel()
              if (this.msgList.length > 0) {
                if (this.isvisited === 0) {
                  this.getmsgList();
                } else {
                  this.getmsgList2();
                }
              }
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
      this.getmsgList();
    },
    toAddDoc() {
      get('/kno/doc/listSpaceOnEditorPermission').then(res => {
        parseAjaxResponse(res, () => {
          this.spaceList = res.data
          if (res.data.length > 0) {
            this.$router.push({ name: 'addDocument' })
          } else {
            this.$message.warning('没有可用的空间!')
          }
        })
      })
    }
  },
  created() {
    if (this.$route.params.isdraft) {
      if (this.$route.params.isdraft === 'draft') {
        this.isvisited = 1
        this.getmsgList2();
      } else {
        this.isvisited = 0
        this.getmsgList();
      }
    } else {
      this.getmsgList2();
    }

    this.getPublishedNum();
    this.getUnpublishNum();
    this.getLabel()
  },
  activated() {
    if (this.$route.params.isdraft) {
      if (this.$route.params.isdraft === 'draft') {
        this.isvisited = 1
        this.getmsgList2();
      } else {
        this.isvisited = 0
        this.getmsgList();
      }
    } else {
      this.getmsgList2();
    }

    this.getPublishedNum();
    this.getUnpublishNum();
    this.getLabel()
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
@import "../../styles/variables";
@import "../../styles/treeIcon";
@import "src/styles/dq/main-card-table.scss";
.kno-hole {
  padding: 6px;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  padding: 5px;
  .el-icon-edit-outline{
     font-size:17px;
     color:#303133
  }
  .editfont{
    font-size:12px;
    color:#303133
  }
  .add-dialog{
        /deep/ .el-dialog__header {
        border-bottom: 1px solid #e8eaec;
        border-radius: 8px;
      }
      /deep/ .el-dialog__footer {
        border-top: 1px solid #e8eaec;
        border-radius: 8px;
      }
  }
  .left_box{
    .left_top{
      height:50px;
      text-align:center;
      border-bottom:1px solid rgb(238, 238, 238);
      margin-bottom:10px;
      .button_lefttop{
        width:145px;
        height:34px;
        padding: 5px 0px 4px 0px;
        .svg-icon {
              width: 24px;
              height: 24px;
              position: relative;
              left:-7px
            }
          .btn-text{
            position: relative;
            top:-5px;
            font-size:14px
          }
      }
    }
    .left_center{
      margin:20px 20px;
      .left_pub{
        margin-top:12px;
        a{
          display:inline-block;
          font-size:14px;
          position: relative;
          bottom:4px
        }
        a:hover{
          color:#2D8CF0
        }
        
        .svg-icon {
          width: 24px;
          height: 24px;
          position: relative;
          left:-5px
        }
      }
      .visited {
          color:#2D8CF0
        }      
    }
    .mylable{
      margin-top:40px ;
      padding:15px 20px;
      font-size:14px;
      border-bottom:1px solid rgb(238, 238, 238);
      .svg-icon {
        width: 24px;
        height: 24px;
        position: relative;
        top:2px
      }
    }
    .left_bottom{
      margin-top:10px;
      ul{
        padding-left:0px;
      }
      li{
        display:block;
        width:198px;
        height:40px;
        line-height:40px;
        padding-left:20px;
        font-size:14px;
        .aedit_box{
          display:none;
          position:relative;
          right:-60px;
          .svg-icon {
            width: 19px;
            height: 19px;
            position: relative;
            top:2px
          }
        }
      }
      .hover{
        border:1px solid rgb(238, 238, 238);
        box-shadow: 3px 3px 6px rgba(0, 0, 0, .3);
        .aedit_box{
          display:inline
          }
      }

    }
    .left_ul{
      height: calc(100vh - 400px);
      overflow-y: auto;
      overflow-x:hidden
    }
    .left_ul::-webkit-scrollbar {
      width: 5px;
      height: 10px;
    }
    .left_ul::-webkit-scrollbar-track {
      background: none;
      border-radius: 2px;
    }
    .left_ul::-webkit-scrollbar-thumb {
      background: rgb(239, 239, 239);
      border-radius: 10px;
    }
    .left_ul::-webkit-scrollbar-thumb:hover {
      background: #bfbfbf;
    }
  }
  .kno-contentBox::-webkit-scrollbar {
  width: 5px;
  height: 10px;
 }
  .kno-contentBox::-webkit-scrollbar-track {
    background: none;
    border-radius: 2px;
  }
  .kno-contentBox::-webkit-scrollbar-thumb {
    background: rgb(239, 239, 239);
    border-radius: 10px;
  }
  .kno-contentBox::-webkit-scrollbar-thumb:hover {
    background: #bfbfbf;
  }
  .kno-contentBox{
    padding:20px 45px;
    // /deep/ .el-icon-search{
    //   position:relative;
    //   top:10px
    // }
    .aedit_list{
      display:inline-block;
      float:right;
      height:27px;
      .svg-icon {
          width: 20px;
          height: 20px;
          position: relative;
          top:1px
        }
      /deep/ .el-button{
        padding:0px
      }
    }
    .right_edit{
      color:#303133;
      font-size:12px;
      position: relative;
      top:0px
    }
  }
  .no-data{
     .svg-icon {
          width: 200px;
          height: 200px;
          position: relative;
          top:15vh;
          left:40%
        }
  }
  .kn-left-part{
    margin-right: 4vh;
  }
  .know-box {
    margin: 13px 4vh;
    /deep/ .el-header {
      background-color: #b3c0d1;
      color: #333;
      line-height: 53px;
      height: 53px !important;
    }
    .el-aside {
      color: #333;
    }
    .kn-left-part {
      height:  calc(100% - 10px);
      margin-right:10px;
      /deep/ .el-input__icon {
        line-height: 32px;
      }
      /deep/ .el-card {
        height: 100%;
      }
      /deep/ .el-card__header {
        font-size: 16px;
        font-weight: bold;
        padding: 10px 14px;
        border-bottom: 1px solid rgb(238, 238, 238);
      }
      /deep/ .el-card__body {
        position: relative;
        margin-top: 5px;
        background: #fff;
        padding: 20px;
        height: calc(100% - 50px);
        // overflow-y: auto;
      }
    }
    .header {
      background: inherit;
      /deep/ .el-input__inner {
        height: 32px;
      }
      /deep/ .el-button {
        background: #2d8cf0 !important;
        color: #fff !important;
        height: 32px;
        position: absolute;
        padding: 0 15px;
        left: 0;
        top: 9px;
      }
    }
    .kno-contentBox {
      overflow-y: auto;
      margin-left: 30px;
      background: rgb(255, 255, 255);
      border-radius: 3px;
      .kno-contentBox-item {
        overflow: hidden;
        margin-bottom: 20px;
        padding-bottom: 10px;
        padding-left:20px;
        padding-right:20px;
        border-bottom: 1px solid rgb(238, 238, 238);
        .title {
          font-size: 18px;
          font-weight: bold;
          line-height: 1.5;
          span {
            cursor: pointer;
          }
          .caogao {
            height: 24px;
            line-height: 24px;
            margin-left: 5px;
          }
        }
        .tags {
          font-size: 10px;
          margin-top: 4px;
          /deep/ .el-tag {
            padding: 0 8px;
            height: 22px;
            line-height: 22px;
            background: #f7f7f7;
            color: #515a6e;
            margin-right: 5px;
          }
        }
        .info{
          width: 100%;
          font-size: 14px;
          line-height: 22px;
          padding: 5px 0px;
          overflow: hidden;
        }
        .desc {
          width: 100%;
          font-size: 14px;
          line-height: 22px;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          padding: 5px 0px;
          overflow: hidden;
        }
        .k-other {
          font-size: 12px;
          position: relative;
          padding: 2px 10px 6px 0px;
          overflow: hidden;
          /deep/ .el-button--text {
            padding: 0;
            font-size: 12px;
          }
          .line {
            margin-top: 1px;
          }
          div {
            display: inline-block;
            margin-right: 5px;
          }
          .fr {
            float: right;
          }
        }
      }
      .page-current {
        text-align: center;
      }
    }
  }
}
</style>
