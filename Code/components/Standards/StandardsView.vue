<template>
  <el-row :gutter="30"
          v-loading="oStandardsView.bLoading"
          class="standard-box">
    <el-col :span="12"
            v-for="(item, index) in oStandardsView.aConent"
            :key="index">
      <div class="standard-item-box">
        <div class="standard-item-top-box">
          <div class="standard-item-top-text">
            <span class="text">{{item.name}}</span>
            <span class="num">{{item.nTotal}}</span>
          </div>
          <img :src="item.sImgSrc" />
        </div>
        <div class="standard-item-bottom-box">
          <p class="standard-item-bottom-left">
            <i></i>
            <span>已发布</span>
            <span class="num">{{item.nPublished}}</span>
          </p>
          <p class="standard-item-bottom-right">
            <i></i>
            <span>待发布</span>
            <span class="num">{{item.nReleased}}</span>
          </p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['oStandardsView'],
  methods: {
    //   handleRightClick () {
    //     this.$emit('right-click')
    //   }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "../../styles/variables";
.standard-box {
  .standard-item-box {
    border: 1px solid $border;
    width: 100%;
    margin-top: 15px;
    padding: 0 20px;
    cursor: pointer;
    .standard-item-top-box {
      display: flex;
      padding: 16px 0;
      flex-direction: row-reverse;
      item-align: center;
      -ms-flex-item-align: center;
      border-bottom: 1px solid $border;
      img {
        display: inline-block;
        margin-right: 20px;
      }
      .standard-item-top-text {
        width: 50%;
        padding-left: 40px;
        span {
          display: block;
        }
        .text {
          font-size: 14px;
          color: #666;
          line-height: 30px;
        }
        .num {
          font-size: 24px;
          color: #333;
          line-height: 34px;
        }
      }
    }
    .standard-item-bottom-box {
      display: flex;
      p {
        width: 50%;
        position: relative;
        text-align: center;
        font-size: 12px;
        color: #888;
        line-height: 30px;
        margin: 0;
        i {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 100%;
          margin-right: 2px;
        }
      }
      .standard-item-bottom-left {
        i {
          background: green;
        }
        .num {
          color: green;
        }
      }
      .standard-item-bottom-right {
        i {
          background: orange;
        }
        .num {
          color: orange;
        }
      }
    }
  }
}
</style>
