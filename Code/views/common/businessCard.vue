<!--名片组件：详情页面使用 （悬浮显示手机号和邮箱 ）-->
<template>
  <div class="business-card">
    <div class="confess-creator" v-for="(item, index) in cardList" :key="index">
      <svg-icon
          class="creator-icon"
          icon-class="see-user"
      ></svg-icon>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">
          <p>部门：{{item.groupname}}</p>
          <p>工作电话：{{item.workphone}}</p>
          <p>手机号：{{item.mobilephone}}</p>
          <p>邮箱：{{item.mail}}</p>
        </div>
        <el-button type="text">{{item.username}}</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
  export default {
    name: "businessCard",
    props: ['cardList', '']
  }
</script>

<style lang="scss" scoped>
  .business-card{
      .confess-creator {
        width: 150px;
        height: 50px;
        border: 1px solid rgb(48, 65, 86);
        float: left;
        margin-left: 10px;
        position: relative;
        text-align: center;
        line-height: 50px;
        padding-left: 20px;
        margin-bottom: 10px;
       .creator-icon.svg-icon {
        height: 24px;
        width: 24px;
        display: block;
        line-height: 55px;
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 20px;
      }
    }
  }
</style>