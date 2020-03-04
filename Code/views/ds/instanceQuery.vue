<!--标准详情页面-->
<template>
  <div class="standard-details dashboard-editor-container">
    <el-card shadow="hover" class="box-card">
      <div slot="header">
        <b>基本信息</b>
        <a class="sq-collect" @click="handleCollect">
          <img  class="img-collection"
                 :src="flagCollect===true?'../../../src/assets/images/collection.png':'../../../src/assets/images/collection_empty.png'">
          <span class="text-collect">{{flagCollect?'已收藏':'收藏'}}</span>
        </a>
      </div>
      <div class="card-conctent">
        <one-column-vertical-table :columnTableData="baseInfoData" :showelTable="true"></one-column-vertical-table>
      </div>
    </el-card>
    <el-card shadow="hover" class="box-card">
      <div slot="header">
        <b>基础属性</b>
      </div>
      <div class="card-conctent">
        <one-column-vertical-table :columnTableData="arrtTableData" :showelTable="true"></one-column-vertical-table>
      </div>
    </el-card>
    <el-card shadow="hover" class="box-card">
      <div slot="header">
        <b>业务属性</b>
      </div>
      <div class="card-conctent">
        <one-column-vertical-table :columnTableData="businessTableData" :showelTable="true"></one-column-vertical-table>
      </div>
    </el-card>
    <el-card shadow="hover" class="box-card">
      <div slot="header">
        <b>管理属性</b>
      </div>
      <div class="card-conctent">
        <one-column-vertical-table :columnTableData="manageTableData" :showelTable="true"></one-column-vertical-table>
      </div>
    </el-card>
    <el-card shadow="hover" class="box-card">
      <div slot="header">
        <b>技术属性</b>
      </div>
      <div class="card-conctent">
        <one-column-vertical-table :columnTableData="tecTableData" :showelTable="true"></one-column-vertical-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import oneColumnVerticalTable from "../md/components/oneColumnVerticalTable";
import { get } from "@/utils/request";
export default {
  components: { oneColumnVerticalTable },
  data() {
    return {
      flagCollect: false, // 收藏
      // 基本信息
      baseInfoData: [],
      // 基础属性
      arrtTableData: [],
      // 业务属性
      businessTableData: [],
      // 管理属性
      manageTableData: [],
      // 技术属性
      tecTableData: [],
      dsInstanceId: this.$route.params.id
    };
  },
  methods: {
    // 收藏、取消收藏
    handleCollect() {
      if (!this.flagCollect) {
        get("/ds/collectStandard", {
          standardId: this.dsInstanceId
        }).then(res => {
          if (res.code === 10000 && res.success) {
            this.$message.success(res.message);
            this.flagCollect = !this.flagCollect;
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        get("/ds/cancelCollectStandard", {
          standardId: this.dsInstanceId
        }).then(res => {
          if (res.code === 10000 && res.success) {
            this.flagCollect = !this.flagCollect;
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    // 获取基本信息
    getMsg() {
      get(`/ds/details/${this.dsInstanceId}`).then(res => {
        if (res.code === 10000 && res.success) {
          this.flagCollect = res.data.favorite;
          const data = res.data;
          this.baseInfoData = [
            { key: "元数据名称:", value: data.cnName },
            { key: "元数据代码:", value: data.code },
            { key: "元数据类型:", value: data.classifierName },
            { key: "上下文路径:", value: data.path },
            { key: "生效时间:", value: data.createTime }
          ];
          data.attributes.map(item => {
            switch (item.attrGroup) {
              case "基础属性":
                this.arrtTableData.push({ key: item.name, value: item.value });
                break;
              case "业务属性":
                this.businessTableData.push({
                  key: item.name,
                  value: item.value
                });
                break;
              case "技术属性":
                this.tecTableData.push({ key: item.name, value: item.value });
                break;
              case "管理属性":
                this.manageTableData.push({
                  key: item.name,
                  value: item.value
                });
                break;
            }
          })
        }
      });
    }
  },
  mounted() {},
  created() {
    this.getMsg();
  }
};
</script>


<style lang="scss" scoped>
//外层card容器样式
@import "./../../styles/dq/main-card-table.scss";
.standard-details {
  //收藏
  .sq-collect {
    font-size: 14px;
    color:#2D8CF0;
    position: absolute;
    right: 30px;
    top: 30px;
    height: 30px;
    text-align: right;
    display: inline-block;
    .img-collection{
      line-height:30px;
      text-align: center;
      vertical-align: middle;
      margin-right: 3px;
      width:20px;
      height:20px;
    }
    .text-collect{
      display: inline-block;
      line-height:30px;
    }
  }
 }
</style>
