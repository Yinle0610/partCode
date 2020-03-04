<template>
  <div class="hole">
    <el-container>
      <el-aside width="240px" class="rightPart">
        <el-card class="box-card right-card" style="height:100%;overflow-y: auto;">
          <div  class="left-top">
            <i class="el-icon-location-outline" style="color:#606266;font-size:22px;"></i>
            <span style="font-weight:bold;font-size:16px;color:#515a6e">归属空间</span>
          </div>
          <div
            @click="handleSpaceClick(item,index)"
            v-for="(item,index) in spaceMsg"
            :key="index"
            class="text"
            :class="{ 'clicked': item.click }"
          >
            <svg-icon icon-class="space" class="space"></svg-icon> 
            <span :class="[item.click?'visited':'']">{{item.name + `（`+item.docCount + `）` }}</span>
          </div>
        </el-card>
      </el-aside>
      <el-container>
        <el-main>
          <el-card  class="right-card" style="height:100%;padding:0px 20px 10px 20px;overflow-y: auto;" >
            <div class="right-top">
              <svg-icon icon-class="mylable"></svg-icon>
              <span style="font-size:14px;">{{labelName}}</span>
            </div>
            <div class="topsearch">
              <div class="filter" style="display:inline-block">
                <span class="orderdoc_box">
                  <svg-icon icon-class="orderdoc" class="orderdoc"></svg-icon> 
                  <span style="font-size:13px">排序</span>
                </span>
                <div :class="[type==='time'?'active':'']" @click="changeOrder('time')">
                  更新时间
                  <i
                    v-show="type ==='time'"
                    :class="[time == 'asc'?'el-icon-arrow-up':'el-icon-arrow-down']"
                  ></i>
                </div>
                <div :class="[type==='col'?'active':'']" @click="changeOrder('col')">
                  收藏次数
                  <i
                    v-show="type ==='col'"
                    :class="[col == 'asc'?'el-icon-arrow-up':'el-icon-arrow-down']"
                  ></i>
                </div>
                <div :class="[type==='view'?'active':'']" @click="changeOrder('view')">
                  浏览次数
                  <i
                    v-show="type ==='view'"
                    :class="[view == 'asc'?'el-icon-arrow-up':'el-icon-arrow-down']"
                  ></i>
                </div>
              </div>
              <div class="searchdoc">
                <el-input v-model="searchMsg" placeholder="请输入..." clearable  size="small" @keyup.enter.native="knoKeySearch()">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="knoKeySearch"></i>
                </el-input>
              </div>
            </div>
            <detail-content ref="content" @getPageChange="getPageMsg" :msg="contentMsg" v-if="hasdata" style="clear: both;"></detail-content>
            <div v-else class="nodata">
              <svg-icon icon-class="nodata"></svg-icon>
            </div>
          </el-card>
          <!-- <el-card  class="right-card" style="height:100%;padding:0px 20px 10px 20px;overflow-y: auto;" v-if="!isLabelSearch">
            <div class="topsearch2" style="border-bottom: 1px solid #e8eaec;">
              <div class="filter2" style="display:inline-block">
                <span class="orderdoc_box">
                  <svg-icon icon-class="orderdoc" class="orderdoc"></svg-icon> 
                  <span style="font-size:13px">排序</span>
                </span>
                <div :class="[type==='time'?'active':'']" @click="changeOrder('time')">
                  更新时间
                  <i
                    v-show="type ==='time'"
                    :class="[time == 'asc'?'el-icon-arrow-up':'el-icon-arrow-down']"
                  ></i>
                </div>
                <div :class="[type==='col'?'active':'']" @click="changeOrder('col')">
                  收藏次数
                  <i
                    v-show="type ==='col'"
                    :class="[col == 'asc'?'el-icon-arrow-up':'el-icon-arrow-down']"
                  ></i>
                </div>
                <div :class="[type==='view'?'active':'']" @click="changeOrder('view')">
                  浏览次数
                  <i
                    v-show="type ==='view'"
                    :class="[view == 'asc'?'el-icon-arrow-up':'el-icon-arrow-down']"
                  ></i>
                </div>
              </div>
              <div class="searchdoc2">
                <el-input v-model="searchMsg" placeholder="请输入..." size="small" clearable @keyup.enter.native="knoKeySearch()" style="width:200px;">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="knoKeySearch"></i>
                </el-input>
              </div>
            </div>
            <detail-content ref="content" @getPageChange="getPageMsg" :msg="contentMsg" v-if="hasdata" style="clear: both;margin-top:20px"></detail-content>
            <div v-else class="nodata">
              <svg-icon icon-class="nodata"></svg-icon>
            </div>
          </el-card> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { get } from "@/utils/request";
import detailContent from "./detailContent";
export default {
  name: "searchLabelDetail",
  components: {
    detailContent
  },
  data() {
    return {
      searchTitle: "",
      searchSpace: "",
      searchMsg: "",
      spaceMsg: [],
      titleMsg: [],
      spaceId: "",
      labelId: "",
      labelPageCurrent: 1,
      labelPageSize: 5,
      Labeltotal: 0,
      spacePageCurrent: 1,
      spacePageSize: 5,
      spaceTotal: 0,
      keyWord: "",
      time: "desc",
      col: "desc",
      view: "desc",
      // type: "",
      // orderType: "",
      // 默认传参
      type: "time",
      orderType: "desc",
      contentMsg: "",
      contentPageCurrent: 1,
      contentPageSize: 10,
      hasdata: false,
      labelName: '',
      isLabelSearch: false
    };
  },
  methods: {
    knoKeySearch () {
      this.spaceId = ''
      this.handleKeySearch()
    },
    // 清除左边选中
    clearSelect() {
      this.spaceMsg.map(item => {
        item.click = false;
      });
      this.titleMsg.map(item => {
        item.click = false;
      });
    },
    // 选择空间
    handleSpaceClick(item, index) {
      this.spaceId = item.spaceId;
      this.clearSelect();
      this.spaceMsg[index].click = true;
      this.handleKeySearch();
    },
    // 空间翻页
    changeSpaceCurrent(val) {
      this.spacePageCurrent = val;
      this.getSpaceInfos();
    },
    // 选择标签
    handleTitleClick(item, index) {
      this.labelId = item.labelId;
      this.spaceId = ''
      this.clearSelect();
      this.titleMsg[index].click = true;
      this.handleKeySearch();
    },
    // 标签翻页
    handleCurrentChange(val) {
      this.labelPageCurrent = val;
      this.getTitle();
    },
    // 搜索关键字
    handleKeySearch() {
      if (this.spaceId === '') {
        this.getSpaceInfos();
      }

      get("/kno/search/searchDocInfos", {
        keyword: this.searchMsg,
        labelId: this.$route.params.labelId ? this.$route.params.labelId : "",
        orderKey: this.type,
        orderType: this.orderType,
        pageCurrent: this.contentPageCurrent,
        pageSize: this.contentPageSize,
        spaceId: this.spaceId
      }).then(res => {
        if (res.code === 10000 && res.success) {
          if (res.data.records.length > 0) {
            this.hasdata = true
          } else {
            this.hasdata = false
          }

          this.contentMsg = JSON.stringify(res.data);
          this.$nextTick(() => {
            if (this.hasdata) {
              console.log("11111", this.hasdata)
              this.$refs.content.getMsg(JSON.stringify(res.data));
            }
          });
        } else {
          this.$message.error(res.message)
        }
      });
    },
    // 标签搜索
    handleSearchTitle() {
      this.getTitle();
    },
    // 空间搜索
    handleSearchSpace() {
      this.getSpaceInfos();
    },
    // 选择排序方式
    changeOrder(val) {
      switch (val) {
        case "time":
          this.time = this.time === "asc" ? "desc" : "asc";
          this.type = "time";
          this.orderType = this.time;
          break;
        case "col":
          this.col = this.col === "asc" ? "desc" : "asc";
          this.orderType = this.col;
          this.type = "col";
          break;
        case "view":
          this.view = this.view === "asc" ? "desc" : "asc";
          this.orderType = this.view;
          this.type = "view";
          break;
      }
      this.handleKeySearch();
    },
    // 获取标签信息分页列表
    getTitle() {
      get("/kno/search/listLabelInfos", {
        keyword: this.searchTitle,
        pageCurrent: this.labelPageCurrent,
        pageSize: this.labelPageSize
      }).then(res => {
        this.Labeltotal = res.data.total;
        const data = res.data.records.map(item => {
          item.click = false;
          return item;
        });
        this.titleMsg = data;
      });
    },
    // 获取空间信息分页列表
    getSpaceInfos() {
      get("/kno/search/listSpaceInfos", {
        // keyword: this.searchSpace,
        docKeyword: this.searchMsg,
        labelId: this.$route.params.labelId
          ? this.$route.params.labelId
          : "",
        pageCurrent: this.spacePageCurrent,
        pageSize: 500
      }).then(res => {
        if (res.code === 10000 && res.success) {
          const data = res.data.records.map(item => {
            item.click = false;
            return item;
          });
          this.spaceTotal = res.data.total
          this.spaceMsg = data;
        } else {
          this.$message.error(res.message)
        }
      });
    },
    // 知识搜索 页码 展示条数改变
    getPageMsg(val) {
      this.contentPageSize = val.ipageSize;
      this.contentPageCurrent = val.iCurrentPage;
      this.handleKeySearch();
    }
  },
  created() {
    this.getTitle();
    this.getSpaceInfos();
    this.searchMsg = this.$route.params.searchMsg
      ? this.$route.params.searchMsg
      : "";
    this.searchTitle = this.$route.params.title ? this.$route.params.title : "";
    this.labelId = this.$route.params.labelId ? this.$route.params.labelId : "";
    this.handleKeySearch();
    this.labelName = this.$route.params.labelName
    this.isLabelSearch = this.$route.params.isLabelSearch
  }
};
</script>

<style scoped>
.visited{
  color:#2D8CF0
}
.nodata .svg-icon {
          width: 200px;
          height: 200px;
          position: relative;
          top:calc(50vh - 260px);
          left:50vh
        }
.right-card .el-card__body{
  height:100%
}
 .right-card::-webkit-scrollbar {
  width: 5px;
  height: 10px;
 }
  .right-card::-webkit-scrollbar-track {
    background: none;
    border-radius: 2px;
  }
  .right-card::-webkit-scrollbar-thumb {
    background: rgb(239, 239, 239);
    border-radius: 10px;
  }
  .right-card::-webkit-scrollbar-thumb:hover {
    background: #bfbfbf;
  }
.left-top{
 height:40px;
 border-bottom: 1px solid #e8eaec;
 padding:0 5px 15px 5px;
 margin-bottom:10px;
}
.left-top .el-icon-location-outline{
      font-size: 22px;
      position: relative;
      top:2px;
      margin-right: 3px;
}
.right-top{
  height:40px;
  border-bottom: 1px solid #e8eaec;
 padding:0 5px 15px 5px;
 margin-bottom:10px;
}
.right-top .svg-icon {
        width: 24px;
        height: 24px;
        position: relative;
        top:3px
      }
.orderdoc_box .svg-icon {
        width: 20px;
        height: 20px;
        position: relative;
        top:3px;
        right:5px
      }
.clicked {
  color: #2d8cf0;
}
.searchdoc{
  display:inline-block;
  float:right;
  margin-top:6px
}
.searchdoc2{
  display:inline-block;
  float:right;
}
.hole {
  padding: 18px 4vh;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
}
.text {
  cursor: pointer;
}
.text :hover {
  color: #2d8cf0;
}
.text span {
  line-height: 30px;
  font-size: 14px;
}
.text .svg-icon {
    width: 17px;
    height: 17px;
    position: relative;
    top:2px
  }
.rightPart {
  background: #fff;
  margin-right:30px
}
.rightPart /deep/ .el-card__header {
  padding: 15px 14px;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  font-weight: bold;
  color: #515a6e;
}
.rightPart /deep/ .el-card {
  border: unset;
  box-shadow: unset;
}
 /* .el-icon-search {
  cursor: pointer;
} */
.rightPart /deep/ .el-input__inner {
  height: 32px;
  margin-bottom: 10px;
}
.rightPart /deep/ .el-input__suffix {
  top: -3px;
}
.hole /deep/ .el-main {
  padding: 0px 10px 0 10px;
}
.filter {
  background: #fff;
  padding: 10px 10px;
  margin-bottom:10px;
  line-height: 20px;
  font-size: 14px;
}
.filter2 {
  background: #fff;
  padding: 0px 10px;
  margin-bottom:10px;
  line-height: 20px;
  font-size: 14px;
}
.filter .el-button {
  border: unset;
  padding: 10px 20px;
}
.filter2 .el-button {
  border: unset;
  padding: 10px 20px;
}
.filter /deep/ .el-button--primary.is-plain {
  color: #515a6e;
  /* background: #fff; */
}
.filter2 /deep/ .el-button--primary.is-plain {
  color: #515a6e;
  /* background: #fff; */
}
.active {
  background: #2d8cf0;
  color: #fff;
}
.filter div {
  margin: 0 10px;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 5px;
  cursor: pointer;
}
.filter2 div {
  margin: 0 10px;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
