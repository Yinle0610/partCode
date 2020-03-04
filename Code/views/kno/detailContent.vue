<template>
  <div class="content">
    <div style="height: calc(100% - 100px);overflow-y: auto;" class="box-card">
      <div class="main" v-for="(item, index) in msgList" :key="index">
        <div @click="handleClick(item)" class="title">{{item.title}}</div>
        <div v-if="item.labelNames!==undefined&&item.labelNames!==''">
           <div class="tag" v-for="(i , index) in item.labelNames.split(',')" :key="index">{{i}}</div>
        </div>
        <div class="content" v-html="item.info"></div>
        <div class="bottom">
          <div class="editor">
            <i class="el-icon-user"></i>
            {{item.creatorName}}
          </div>
          <div class="createTime">
            <i class="el-icon-date"></i>
            {{item.lastUpdateTime}}
          </div>
          <div class="view">
            <i class="el-icon-view"></i>
            {{item.viewCount}}
          </div>
          <div class="collect">
            <i class="el-icon-star-off"></i>
            {{item.colCount}}
          </div>
        </div>
        <el-divider content-position="left"></el-divider>
      </div>
      <div class="div-page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.iCurrentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageData.ipageSize"
          layout="total, prev, pager, next,sizes,jumper"
          :total="iTotalPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import showdown from 'showdown'
export default {
  name: "detailContent",
  data() {
    return {
      test: ``,
      iTotalPage: 0,
      pageData: {
        iCurrentPage: 1,
        ipageSize: 10
      },
      msgList: []
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageData.ipageSize = val;
      this.$emit("getPageChange", this.pageData);
    },
    handleCurrentChange(val) {
      this.pageData.iCurrentPage = val;
      this.$emit("getPageChange", this.pageData);
    },
    getMsg(msg) {
      let val = JSON.parse(msg);
      this.iTotalPage = val.total;
      this.msgList = val.records;
      this.msgList.map(item => {
        if (item.type === 1 && item.info !== undefined) {
          // 创建实例
          var converter = new showdown.Converter();
          // 进行转换
          item.info = converter.makeHtml(item.info);
        }
      })
      this.msgList.map(item => {
        if (item.info.length > 300) {
          item.info = item.info.slice(0, 300) + '...'
        }
      })
    },
    handleClick(row) {
      this.$router.push({
        name: "knoDetail",
        params: { docId: row.docId, spaceType: row.spaceType, privilege: row.privilege, isControlEdit: true }
      });
    }
  },
  created() {}
};
</script>

<style scoped>
/* .infoc_div{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
} */

.main {
  color: #515a6e;
}
.main .title {
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
.main .tag {
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
.main .content {
  width: 100%;
  font-size: 14px;
  line-height: 22px;
  margin: 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}
.main .bottom {
  margin: 15px 0;
  font-size: 12px;
  margin-left: 3px;
  color: #333;
  line-height: 20px;
  overflow: hidden;
}
.editor {
  margin-right: 30px;
  float: left;
}
.createTime {
  float: left;
}
.collect,
.view {
  float: right;
}
.collect {
  margin-right: 30px;
}
.bottom /deep/ i {
  width: 20px;
  height: 20px;
  margin-right: 3px;
  text-align: center;
}
.el-icon-user:before,
.el-icon-date:before {
  font-size: 15px;
}
.div-page {
  text-align: center;
}
</style>
