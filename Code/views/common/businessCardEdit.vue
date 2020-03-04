<!--名片组件：编辑页面使用， 包括删除和增加-->
<template>
  <div class="business-card-edit">
    <div class="confess-creator" v-for="(item, index) in cardList" :key="index">
      <svg-icon class="creator-icon" icon-class="see-user"></svg-icon>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">
          <p>部门：{{item.groupname}}</p>
          <p>工作电话：{{item.workphone}}</p>
          <p>手机号：{{item.mobilephone}}</p>
          <p>邮箱：{{item.mail}}</p>
        </div>
        <el-button type="text">{{item.username}}</el-button>
      </el-tooltip>
      <svg-icon icon-class="no" class="close" @click.native="toDelCard(item)"></svg-icon>
    </div>
    <el-button class="add-btn" @click="toAddCard" v-if="oneOrMore==='more'">
      <svg-icon icon-class="add2" class="add"></svg-icon>
      <span style="color:#333;bottom:4px;">增加</span>
    </el-button>
    <el-button class="add-btn" @click="toAddCard" v-if="oneOrMore==='one'&&cardList.length===0&&isParentNode">
      <svg-icon icon-class="add2" class="add"></svg-icon>
      <span style="color:#333;bottom:4px;">增加</span>
    </el-button>
  </div>
</template>

<script>
  export default {
    name: "businessCardEdit",
    props: ['cardList', 'oneOrMore', 'isParentNode'],
    // cardList 数据如下格式：
    /* dutyList: [
      {
        name: "wang老师",
        tele: "1222233",
        email: "100@2222.com"
      }
    ],*/
    data() {
      return {

      }
    },
    methods: {
      toDelCard(item) {
        this.$emit('toDelCard', item, this.oneOrMore)
      },
      toAddCard() {
        this.$emit('toAddCard')
      }
    },
    created() {
      console.log(this.oneOrMore, 'oneOrMore')
    }

  }
</script>

<style lang="scss" scoped>
  .business-card-edit{
    /deep/ .confess-creator {
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

      button{
        width: 60px;
        span{
          width: 60px;
          padding-top: 5px;
          display: inline-block;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
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
      .close{
        width: 12px;
        height: 12px;
        position: relative;
        bottom: 4px;
        left: 14px;
        cursor: pointer;
      }
    }
    //增加名片按钮
    .add-btn{
      padding: 8px 22px 8px 20px;
      width: 150px;
      height: 50px;
      margin-left: 10px;
      border: 1px solid #304156;
      span{
        .add{
          position: relative;
          left: -24px;
          width: 22px;
          height: 22px;
          top: 4px;
        }
        span{
          display: inline-block;
          line-height: 34px;
        }
      }
    }
  }
</style>