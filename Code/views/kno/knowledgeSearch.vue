
<template>
  <div class="kno-search">
    <div class="hole">
      <img src="../../assets/images/commonIcon/knoSearch.png" alt="图片" class="img"  />
      <!-- <svg-icon icon-class="konSearch" class="img"></svg-icon> -->
      <div class="key-search">
        <el-input
          placeholder="请输入您要查找的文档名称..."
          v-model="searchMsg"
          @keyup.enter.native="knoSearch"
        >
          <template slot="suffix">
            <el-button @click="knoSearch" type="primary">搜索</el-button>
          </template>
        </el-input>
        <div v-for="(item, index) in newDocList" :key="index" class="k-tips">
          <span class="new">新</span>
          <a @click="handleClick(item)" class="word">{{item.title ? item.title : ''}}&nbsp;&nbsp;[{{item.lastUpdateTime ? item.lastUpdateTime : ''}}]</a>
        </div>
      </div>
      <div class="wrapper">
        <tag-cloud ref="tagCloud" :data="tags" @click-tag="toTagResult"></tag-cloud>
      </div>
      <!-- <background-canvas></background-canvas> -->
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import backgroundCanvas from "./canvas/backgroundCanvas";
import { get, parseAjaxResponse } from "@/utils/request";
export default {
  name: "knowledgeSearch",
  components: {
    backgroundCanvas
  },
  data() {
    return {
      searchMsg: "",
      title: "",
      tags: [],
      labelId: "",
      newDocList: {},
      labelName:'',
      isLabelSearch:false,
      tagTitle:''
    };
  },
  methods: {
    knoSearch(){
      this.tagTitle=this.searchMsg
       this.isLabelSearch=false
      this.handleSearch();
    },
    
    handleSearch() {
      this.$router.push({
        name: "searchDetail",
        params: {
          searchMsg: this.searchMsg,
          title: this.title,
          labelId: this.labelId,
          labelName:this.labelName,
          isLabelSearch:this.isLabelSearch,
          _title:this.tagTitle
        }
      });
    },
    // 根据登陆用户获取标签预览列表
    getList() {
      get("/kno/search/listPreviewLabel").then(res => {
        parseAjaxResponse(res, () => {
          this.tags = [];
          this.tags = res.data.map((item, index) => {
            item.labelName = item.labelName + "(" + item.docCount + ")";
            return item;
          });
          console.log(res.data, this.tags, 222);
          this.$nextTick(() => {
            console.log(this.$refs, 333);
            if (this.$refs.tagCloud) {
              this.$refs.tagCloud._initTags();
            }
          });
        });
      })
    },
    toTagResult(val) {
      this.searchMsg=''
      this.tagTitle= this.getCaption(val.labelName,0) 
      this.labelName=this.getCaption(val.labelName,0) 
      this.labelId = val.labelId;
      this.isLabelSearch=true
      this.$router.push({
        name: "searchLabelDetail",
        params: {
          searchMsg: this.searchMsg,
          title: this.title,
          labelId: this.labelId,
          labelName:this.labelName,
          isLabelSearch:this.isLabelSearch,
          _title:this.tagTitle
        }
      });
    },
    getCaption(obj,state) {
    var index=obj.lastIndexOf("\(");
    if(state==0){
        obj=obj.substring(0,index);
    }else {
        obj=obj.substring(index+1,obj.length);
    }
    return obj;
  },
    // 查询
    firstMsg() {
      get("/kno/search/searchDocInfoInWeek").then(res => {
        parseAjaxResponse(res, () => {
          console.log(res)
          this.newDocList = res.data
          // if (res.data.length > 1) {
          //   this.newDocList.split(',')
          // }
        })
      });
    },
    handleClick(item) {
      // console.log(item)
      // let showEditBtn = true
      // if (item.spaceType === 'public') {
      //   showEditBtn = true
      // } else if (item.spaceType === 'private') {
      //   if (item.privilege === 0) {
      //     showEditBtn = false
      //   } else {
      //     showEditBtn = true
      //   }
      // }
      this.$router.push({
        name: "knoDetail",
        params: {
          docId: item.docId,
          spaceType: item.spaceType,
          privilege: item.privilege,
          isControlEdit: true
        }
      });
    }
  },
  created() {
    this.getList();
    this.firstMsg();
  }
};
</script>
<style lang="scss" scoped>
.kno-search {
  padding: 10px;
  height: calc(100vh - 84px);
  .hole {
    background: #fff;
    overflow: auto;
    height: 100%;
    position: relative;
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
  }
  .img {
    width: 100px;
    height: 100px;
    display: block;
    margin: 70px auto 30px;
  }
  .key-search {
    // position: absolute;
    // top: 15%;
    // width: 500px;
    // left: 50%;
    // margin-left: -220px;
    // z-index: 99;
    width: 500px;
    margin: 0 auto;
    z-index: 99;
  }
  .key-search /deep/ .el-input__inner {
    height: 32px;
    font-size: 12px;
  }
  .key-search /deep/ .el-input__suffix {
    right: 0;
  }
  .key-search /deep/ .el-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-size: 12px;
    height: 32px;
    padding: 0 16px;
  }
  .k-tips {
    position: relative;
    width: 100%;
    // padding: 0 20px;
    margin-top: 15px;
  }
  .new {
    display: inline-block;
    background: red;
    color: #fff;
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 4px;
    line-height: 22px;
  }
  .word {
    color: rgb(120, 120, 120);
    text-decoration: underline;
    margin-left: 8px;
    display: inline-block;
    font-size: 12px;
  }
  .wrapper {
    width: 500px;
    margin: 0 auto;
    background: #fff;
    border-radius: 5px;
    height: 200px;
    z-index: 99;
    margin-top: 120px;
    // position: absolute;
    // top: 30%;
    // width: 500px;
    // left: 0;
    // right: 0;
    // margin: 0 auto;
    // background: #fff;
    // border-radius: 5px;
    // height: 200px;
    // z-index: 99;
    // margin-top: 120px
  }
}
</style>
