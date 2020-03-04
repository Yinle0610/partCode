<template>
  <div class="kon-deatil">
    <el-card class="box-card">
      <div class="clearfix detail-header">
        <div style="overflow: hidden;">
          <h3 class="detail-title">{{msg.title}}</h3>
          <div style="float: right;">
            <div class="kno-icon" @click="handleToEdit(msg)" v-if="this.$route.params.isControlEdit&&(this.$route.params.spaceType==='public'||this.$route.params.privilege===1||this.$route.params.privilege===2)">
              <i class="el-icon-edit-outline"></i>&nbsp;&nbsp;编辑
            </div>
             <div class="kno-icon" @click="handleToEdit(msg)" v-if="this.$route.params.isControlEdit===undefined">
              <i class="el-icon-edit-outline"></i>&nbsp;&nbsp;编辑
            </div>
            <div class="kno-icon" @click="handleCollect">
              <i v-show="type === 0" class="el-icon-star-off"></i>
              <i v-show="type === 1" style="color: rgb(255, 235, 59);" class="el-icon-star-on"></i>
              <span>{{type === 0?'收藏':'取消'}}</span>
            </div>
          </div>
        </div>
        <div class="detail-info">
          <div class="editor">
            <i class="el-icon-user"></i>
            {{msg.creatorName}}
          </div>
          <div class="createTime">
            <i class="el-icon-date"></i>
            {{msg.lastUpdateTime}}
          </div>
          <div class="view">
            <i class="el-icon-view"></i>
            {{msg.viewCount}}
          </div>
          <div v-if="msg.attachId">
            <i class="el-icon-link"></i>
            <el-button @click="downLoad" style="padding: 0;" type="text">点击下载</el-button>
          </div>
        </div>
        <div v-if="msg.labelNames!==undefined&&msg.labelNames!==''">
          <div v-for="(item, index) in (msg.labelNames).split(',')" :key="index" class="tag">
            {{item}}
          </div>
        </div>
      </div>
      <div class="detail-content" v-html="msg.info2"></div>
      <div class="kno-bottom">
        本文由 [{{msg.lastUpdateUserName}}] 最后更新于 [{{msg.lastUpdateTime}}]&nbsp;&nbsp;（
        <el-button @click="historyVisible = true" type="text">查看更新历史</el-button>）
      </div>
    </el-card>
    <!-- <el-card class="box-card">
      <div class="kno-bottom">
        本文由 [{{msg.lastUpdateUserName}}] 最后更新于 [{{msg.lastUpdateTime}}]&nbsp;&nbsp;（
        <el-button @click="historyVisible = true" type="text">查看更新历史</el-button>）
      </div>
    </el-card> -->

    <el-dialog class="Dialog" title="文档修改历史" :visible.sync="historyVisible">
      <el-table
        :data="historyTableList"
        style="width: 100%;border:1px solid #EBEEF5"
        show-header
        :header-cell-style="{background:'#f8f8f9',color:'#606266'}"
      >
        <el-table-column property="userName" label="用户"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div style="color:#2d8cf0;">{{scope.row.action===1?'创建':scope.row.action===2?'修改':'删除'}}</div>
          </template>
        </el-table-column>
        <el-table-column property="remark" label="备注"></el-table-column>
        <el-table-column property="logTime" label="时间"></el-table-column>
      </el-table>
      <div class="div-page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageCurrent"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, prev, pager, next,sizes,jumper"
          :total="msgTotal"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { get } from "@/utils/request";
import showdown from 'showdown';
import { getToken } from "@/utils/auth";
export default {
  name: "knoDetail",
  data() {
    return {
      dacId: "",
      msg: {},
      historyVisible: false,
      historyTableList: [],
      pageCurrent: 1,
      pageSize: 10,
      msgTotal: 0,
      type: 0
    };
  },
  methods: {
    // 跳转编辑界面
    handleToEdit(val) {
      console.log("0000000", val)
      this.$router.push({
        name: "editDocument",
        params: {
          docId: val.docId,
          spaceId: val.spaceId,
          isDraft: 0,
          params: this.$route.params
        }
      });
    },
    // 收藏、取消收藏
    handleCollect() {
      this.type = this.type === 0 ? 1 : 0;
      get("/kno/doc/collectionOrCancelDoc.do", {
        docId: this.docId
      }).then(res => {
        this.$message.success(res.message)
      });
    },
    // 获取详情
    getKnoDetails() {
      let url = "/home/kno/getMyPublishedDocDetail"
      // if (this.$route.params.comeFrom === "mycollect" && this.$route.params.comeFrom === "myknowledge") {
      //   url = "/home/kno/getMyPublishedDocDetail"
      // } else {
      //   url = "/kno/doc/getDocumentDetailInfo"
      // }
      get(url, {
        docId: this.docId
      })
        .then(res => {
          if (res.code === 10000 && res.success) {
            this.msg = res.data;
            if (this.msg.type === 1 && this.msg.info !== undefined) {
              // 创建实例
              var converter = new showdown.Converter();
              // 进行转换
              let infotemp = converter.makeHtml(this.msg.info);
              this.$set(this.msg, 'info2', infotemp)
            }
            if (this.msg.type === 0 && this.msg.info !== undefined) {
              this.$set(this.msg, 'info2', this.msg.info)
            }
            this.type = this.msg.isCollection;
          }
        })
    },
    // 历史修改记录
    getHistoryData() {
      get("/kno/doc/listDocHisLog.do", {
        docId: this.docId,
        pageSize: this.pageSize,
        pageCurrent: this.pageCurrent
      })
        .then(res => {
          console.log(res)
          this.historyTableList = res.data.records;
          this.msgTotal = res.data.total ? res.data.total : 0;
        })
        .catch(err => {
          this.$message.error(err)
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getHistoryData();
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getHistoryData();
    },
    // 下载附件
    downLoad() {
      let api = this.api
      let attachId = this.msg.attachId
      // window.open(`${api}/kno/doc/downloadAttachFile.do?attachId=${attachId}`)
      window.location.href = `${api}/kno/doc/downloadAttachFile.do?token=${getToken()}&attachId=${attachId}`
    }
  },
  activated() {
    // this.api = process.env.BASE_API;
    // this.docId = this.$route.params.docId;
    // this.getKnoDetails();
    // this.getHistoryData();
  },
  created() {
    this.api = process.env.BASE_API;
    this.docId = this.$route.params.docId;
    this.getKnoDetails();
    this.getHistoryData();
  }
};
</script>

<style lang="scss" scoped>
.kon-deatil {
  /* color: #515a6e; */
  padding: 10px 20%;
  // width: 60%;
  margin: 0 auto;
}

.el-icon-star-on:before {
  font-size: 16px;
}
.kon-deatil /deep/ .el-card {
  color: #515a6e;
  padding: 15px 40px;
  padding-bottom: 0;
}
.kon-deatil /deep/ .el-card__body {
  overflow: hidden;
  padding-bottom: 0;
}
.detail-header {
  border-bottom: 1px solid #EBEEF5;
  padding-bottom: 1rem;
}
.detail-title {
  margin: 0;
  float: left;
  color: #7e7b7b;
}
.detail-info {
  overflow: hidden;line-height: 0;margin-top: 10px;
}
.detail-content {
  color: #7e7b7b;
  font-size: 14px;
  line-height: 23px;
}
.kon-deatil .editor,
.createTime,
.view {
  float: left;
  margin-right: 20px;
  font-size: 14px;
}
.kno-icon {
  display: inline-block;
  margin-left: 16px;
  font-size: 14px;
  cursor: pointer;
  width: 55px;
}
.tag {
  display: inline-block;
  height: 22px;
  line-height: 22px;
  margin: 10px 4px 2px 0;
  padding: 0 8px;
  border: 1px solid #e8eaec;
  border-radius: 3px;
  background: #f7f7f7;
  font-size: 12px;
  vertical-align: middle;
  opacity: 1;
  overflow: hidden;
  cursor: pointer;
}
.kno-bottom {
  font-size: 12px;
  text-align: right;
  border-top: 1px solid #EBEEF5;
}
.kno-bottom button {
  font-size: 12px;
}
.div-page {
  text-align: center;
  margin-top: 20px;
}
.Dialog /deep/ .el-dialog {
  border-radius: 6px;
}
.Dialog /deep/ .el-dialog__header {
  border-bottom: 1px solid #e8eaec;
  padding: 14px 16px;
  line-height: 1;
  font-weight: bold;
  color: #515a6e;
  font-size: 14px;
}
.Dialog /deep/ .el-dialog__title {
  font-size: inherit;
  color: inherit;
}
</style>