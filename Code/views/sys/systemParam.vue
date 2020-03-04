<template>
  <div class="system-param">
    <el-card id="top-card" class="box-card">
      <div class="topcard-head">全局设置</div>
      <el-divider></el-divider>
        <el-form ref="addParam" :model="addParam" label-width="160px">
          <!--<el-form-item label="首页Logo：">
            <el-upload
              :headers="headers"
              :action="`${api}/sys/param/upload`"
              accept="png"
              :on-success="uploadSuccessHome">
              <el-button size="small"><i class="el-icon-upload el-icon&#45;&#45;left"></i>上传文件</el-button>
              <div class="div-fontsize">支持扩展名：png格式</div>
            </el-upload>
          </el-form-item>-->
          <el-form-item label="Logo（全尺寸）：">
            <el-upload
              :headers="headers"
              :action="`${api}/sys/param/uploadFullSizeLogo`"
              accept="png"
              :on-success="uploadSuccessInside">
              <el-button size="small"><i class="el-icon-upload el-icon--left"></i>上传文件</el-button>
              <div class="div-fontsize">支持扩展名：png格式</div>
            </el-upload>
            <div class="logo-style">
              <!--显示全尺寸logo 地址-->
              <span class="logo-span" v-show="fullLogoPath!==''">
                  <a :href="fullLogoData" target="_blank" title="点击查看全尺寸logo" class="a-color" >{{fullLogoPath}}</a>
              </span>
            </div>
          </el-form-item>
          <el-form-item label="Logo（小尺寸）：">
            <el-upload
              :headers="headers"
              :action="`${api}/sys/param/uploadSmallSizeLogo`"
              accept="png"
              :on-success="uploadSuccessSmall">
              <el-button size="small"><i class="el-icon-upload el-icon--left"></i>上传文件</el-button>
              <div class="div-fontsize">支持扩展名：png格式</div>
            </el-upload>
            <div class="logo-style">
              <!--显示小尺寸logo 地址-->
              <span class="logo-span" v-show="smallLogoPath!==''">
                  <a :href="smallLogoData" target="_blank" title="点击查看小尺寸logo" class="a-color" >{{smallLogoPath}}</a>
              </span>
            </div>
          </el-form-item>
          <el-form-item label="产品信息:">
           <el-input type="text" v-model="addParam.product" size="mini"/>
          </el-form-item>
          <el-form-item label="版权信息:">
           <el-input type="text" v-model="addParam.copy" size="mini"/>
          </el-form-item>
          <el-form-item label="其他信息:">
           <el-input type="text" v-model="addParam.rest" size="mini"/>
          </el-form-item>
          <el-form-item label="系统URL:">
            <el-input type="text" v-model="addParam.sysURL" size="mini"/>
          </el-form-item>
          <el-form-item label="解析引擎:">
            <el-row>
              <el-col :span="20">
                <el-input type="text" v-model="addParam.engine" size="mini"/>
              </el-col>
              <el-col :span="3" :offset="1">
                <el-switch v-model="addParam.engineStatus"
                           @change="engineStatusChange"
                           :width="60"
                           active-color="#09e"
                           active-text="启用"
                           inactive-color="#09e"
                           inactive-text="关闭">
                </el-switch>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      <div class="topcard-body">
      </div>
    </el-card>
    <el-card id="center-card" class="box-card">
      <div class="topcard-head">数据质量模块</div>
      <el-divider></el-divider>
        <el-form ref="addParam" :model="addParam" label-width="160px">
          <el-form-item label="CSV导出限定行数：">
           <el-input type="text" v-model="addParam.CSVMaxLine" size="mini"/>
          </el-form-item>
          <el-form-item label="问题明细保存最大行数：">
           <el-input type="text" v-model="addParam.SaveMaxLine" size="mini"/>
          </el-form-item>
          <el-form-item label="逾期预警天数: ">
           <el-input type="text" v-model="addParam.OverdueNum" size="mini"/>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数据问题统计视图：">
                <el-radio-group v-model="addParam.dataProblemStatisticView" @change="changeQuesStatistics(addParam.dataProblemStatisticView)">
                  <el-radio label="0">手工提交</el-radio>
                  <el-radio label="1">自动稽核</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据问题分布视图：">
                <el-radio-group v-model="addParam.dataProblemDistributeView" @change="changeQuesDistribute(addParam.dataProblemDistributeView)">
                  <el-radio label="0">系统</el-radio>
                  <el-radio label="1">数据源</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="问题查询菜单默认视图：">
            <el-radio-group v-model="addParam.PQDefaultView" @change="changeProblemQuery(addParam.PQDefaultView)">
              <el-radio label="0">手工提交</el-radio>
              <el-radio label="1">自动稽核</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      <div class="topcard-body">
      </div>
    </el-card>
     <el-card id="center-card" class="box-card">
      <div class="topcard-head">数据资产模块</div>
      <el-divider></el-divider>
        <el-form ref="addParam" :model="addParam" label-width="160px">
          <el-form-item label="数据库信息每页数据量：">
           <el-input type="text" v-model="addParam.DataPerPage" size="mini"/>
          </el-form-item>
        </el-form>
    </el-card>
    <div style="text-align: center;margin:20px 0">
      <el-button  type="primary" @click="handleSubmit" size="small">提交</el-button>
    </div>
  </div>
</template>
<script>
import { get, post } from "@/utils/request";
import { getToken } from "@/utils/auth";
import { mapGetters } from 'vuex'

export default{
  name: 'systemParam',
  data() {
    return {
      addParam: {
        product: '', // 产品信息
        copy: '', // 版权信息
        rest: '', // 其他信息
        sysURL: '', // 系统URL
        engine: '', // 解析引擎
        engineStatus: true, // 解析引擎 状态 （ 0-关闭，1-启用）
        // 数据质量模块参数
        CSVMaxLine: '', // CSV导出限定行数
        SaveMaxLine: '', // 问题明细保存最大行数：
        OverdueNum: '', // 逾期预警天数
        dataProblemStatisticView: '', // 数据问题统计视图：
        dataProblemDistributeView: '', // 数据问题分布视图：
        PQDefaultView: '', // 问题查询菜单默认视图：
        // 数据资产模块参数
        DataPerPage: '' // 数据库信息每页数据量：
      },
      emptyHome: '', // 首页Logo
      emptyInsides: '', // 内页Logo
      emptySmall: '', // 小页Logo
      urlHome: '', // 首页Logo
      urlInsides: '', // 内页Logo
      urlSmall: '', // 小页Logo
      headers: {},
      api: ""
    }
  },
  computed: {
    ...mapGetters([
      'fullLogoPath',
      'smallLogoPath',
      'fullLogoData',
      'smallLogoData'
    ])
  },
  methods: {
    // 解析引擎 状态改变
    engineStatusChange(val) {
      // 在启用之前，对解析引擎内容做校验，若没配置地址，则切换开关为禁用状态
      if (val && this.addParam.engine === "") {
        this.addParam.engineStatus = false
        this.$message.warning("在启用之前，请配置'解析引擎'地址")
      }
    },
    // upload相关函数
    uploadSuccessHome(res, file, fileList) {
      if (res.code === 10000 && res.success) {
        this.urlHome = res.data
        this.$message.success("主页上传成功");
      } else {
        this.$message.error(res.message);
      }
    },
    uploadSuccessInside(res, file, fileList) {
      if (res.code === 10000 && res.success) {
        this.urlInsides = res.data
        this.$message.success("Logo（全尺寸）上传成功");
        // 调用全尺寸logo地址接口
        this.$store.dispatch('getFullLogoPath')
      } else {
        this.$message.error(res.message);
      }
    },
    uploadSuccessSmall(res, file, fileList) {
      if (res.code === 10000 && res.success) {
        this.urlSmall = res.data
        this.$message.success("Logo（小尺寸）上传成功");
        // 调用小尺寸logo地址接口
        this.$store.dispatch('getSmallLogoPath')
      } else {
        this.$message.error(res.message);
      }
    },
    // 仪表板问题统计默认视图radio切换触发函数
    changeQuesStatistics(value) {
      // console.log(value);
      this.addParam.dataProblemStatisticView = value;
    },
    // 仪表板问题分布默认视图radio切换触发函数
    changeQuesDistribute(value) {
      // console.log(value);
      this.addParam.dataProblemDistributeView = value;
    },
    // 问题查询菜单默认视图radio切换触发函数
    changeProblemQuery(value) {
      // console.log(value);
      this.addParam.PQDefaultView = value;
    },
    // 提交函数
    handleSubmit() {
      let params = {
        v1: this.urlHome,
        v2: this.urlInsides,
        v3: this.addParam.copy,
        v4: this.addParam.product,
        v5: this.addParam.rest,
        v6: this.addParam.CSVMaxLine,
        v7: this.addParam.dataProblemStatisticView,
        v8: this.addParam.dataProblemDistributeView,
        v9: this.addParam.SaveMaxLine,
        v10: this.urlSmall,
        v11: this.addParam.PQDefaultView,
        v12: this.addParam.OverdueNum,
        v13: this.addParam.DataPerPage,
        v14: this.addParam.sysURL,
        v15: this.addParam.engine,
        v16: this.addParam.engineStatus ? "1" : "0"
      }
      if (params.v1 === '' || params.v1 === undefined) {
        params.v1 = this.emptyHome
      }
      if (params.v2 === '' || params.v2 === undefined) {
        params.v2 = this.emptyInsides
      }
      if (params.v10 === '' || params.v10 === undefined) {
        params.v10 = this.emptySmall
      }
      post("/sys/param/editSysParam", params).then(res => {
        if (res.code === 10000 && res.success) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      })
    },
    // 页面加载时加载数据
    loadData: function() {
      get("/sys/param/getSysParam").then(res => {
        if (res.code === 10000 && res.success) {
          this.addParam.product = res.data.v4
          this.addParam.copy = res.data.v3
          this.addParam.rest = res.data.v5
          this.addParam.CSVMaxLine = res.data.v6
          this.addParam.SaveMaxLine = res.data.v9
          this.addParam.OverdueNum = res.data.v12
          this.addParam.dataProblemStatisticView = res.data.v7
          this.addParam.dataProblemDistributeView = res.data.v8
          this.addParam.PQDefaultView = res.data.v11
          this.addParam.DataPerPage = res.data.v13
          this.addParam.sysURL = res.data.v14
          this.addParam.engine = res.data.v15
          if (res.data.v16 === "1") {
            this.addParam.engineStatus = true
          } else {
            this.addParam.engineStatus = false
          }
          this.emptyInsides = res.data.v2
          this.emptySmall = res.data.v10
          this.emptyHome = res.data.v1
        } else {
          this.$message.error(res.message);
        }
      });
    }
  },
  created: function() {
    // 调用全尺寸logo地址接口
    this.$store.dispatch('getFullLogoPath')
    // 调用小尺寸logo地址接口
    this.$store.dispatch('getSmallLogoPath')

    this.loadData();
    this.headers = {
      "X-Token": getToken()
    };
    this.api = process.env.BASE_API;
  }
}
</script>
<style lang="scss">
  @import "../../styles/switch";

.system-param{
 .box-card{
   margin:10px 10px 0 10px
 }
 .topcard-head{
    font-weight: bold;
    font-size:16px
 }
 .el-form-item__label{
   font-size:12px
 }
 label{
   font-weight: 500
 }
 .div-fontsize{
   text-align: left;
   font-size:12px;
   font-weight: 500
 }
 .el-radio__label{
   font-size:12px;
 }

  .logo-style{
    position: absolute;
    top: 0px;
    left: 120px;
    span.logo-span{
      .a-color{
        color: #2d8cf0;
      }
    }
  }

  .el-switch__label--left {left: 26px;}
  .el-switch__label--right {left: 0;}

}
</style>
