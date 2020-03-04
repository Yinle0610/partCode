<template>
  <div class="login-container">
    <background-item></background-item>
    <div class="loginBox center">
      <div class="login-left">
        <img class="center" src="../../assets/images/login/login.jpg" alt />
      </div>
      <div class="login-part">
        <div class="login-part_content center">
          <h3>{{title}}</h3>
          <el-form
            :model="oForm"
            :rules="rules"
            ref="ruleForm"
            label-width="0"
            class="demo-ruleForm"
          >
            <el-form-item label prop="username">
              <el-input
                size="small"
                v-model="oForm.username"
                placeholder="用户名"
                @keyup.enter.native="goLogin"
              >
                <template slot="prepend">
                  <i class="el-icon-user"></i>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label prop="password">
              <el-input
                size="small"
                v-model="oForm.password"
                type="password"
                placeholder="密码"
                @keyup.enter.native="goLogin"
              >
                <template slot="prepend">
                  <i class="el-icon-lock"></i>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <div class="checkbox-box">
            <el-checkbox v-model="bIsRemember ">记住密码</el-checkbox>
          </div>
          <div class="btn-box mt10">
            <el-button style="width: 100%;" type="primary" @click="goLogin">登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "md5";
import { get } from "@/utils/request";
import { loading } from "@/utils/layer";
import { parseAjaxResponse } from "@/utils/request";
import backgroundItem from "./backgroundItem";
export default {
  components: {
    backgroundItem
  },
  name: "login",
  data() {
    return {
      oForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ]
      },
      bIsRemember: false,
      title: "",
      url: "",
      imgUrl: '../../assets/images/login/login.jpg'
      // require('../../assets/images/login/login.jpg')
    }
  },
  methods: {
    goLogin() {
      const _this = this;
      const load = loading("正在登录，请稍候...");
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.bIsRemember) {
            let userMsg = this.oForm;
            _this.$store.dispatch("setUserMsg", userMsg);
          } else {
            _this.$store.dispatch("setUserMsg", "");
          }
          _this.$store
            .dispatch("LoginByUsername", {
              password: md5(_this.oForm.password),
              userId: _this.oForm.username
            })
            .then(res => {
              load.close();
              parseAjaxResponse(res, () => {
                // EDGS 登录成功后，进行svg的登录
                _this.$store.dispatch('svgLogin')

                _this.$router.push({ path: "/" });
              });
            })
            .catch(res => {
              load.close();
            });
        } else {
          load.close();
          _this.$message.error("请按以下规则填写用户名和密码");
        }
      });
    },
    loadData() {
      get("/sys/param/getSysParam").then(res => {
        if (res.code === 10000 && res.success) {
          this.title = res.data.v4;
          // this.url = res.data.v1;
          // this.getImg();
        }
      });
    }
    // getImg() {
    //   getExcel("/sysInfo/getPictureByUrl", {
    //     url: this.url
    //   }).then(res => {
    //     console.log(res)
    //     console.log(res.data)
    //     if (res === null || res.data === undefined) {
    //       this.imgUrl = require('../../assets/images/login/login.jpg')
    //     } else {
    //       var blob = res;
    //       this.imgUrl = URL.createObjectURL(blob);
    //       console.log(this.imgUrl)
    //     }
    //   })
    // }
  },
  mounted() {
    // console.log(this.$store.getters.userMsg, "msg");
    if (this.$store.getters.userMsg) {
      // console.log("122");
      this.oForm = JSON.parse(this.$store.getters.userMsg);
      this.bIsRemember = true;
    }
  },
  created() {
    this.loadData();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "./../../styles/variables";
.center {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.login-container {
  background: radial-gradient(ellipse at center, #114066 50%, black 100%);
  overflow: hidden;
  position: fixed;
  height: 100%;
  width: 100%;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
  .loginBox {
    background: #fff;
    height: 375px;
    width: 683px;
    overflow: hidden;
    border-radius: 6px;
    &:hover {
      box-shadow: 0 0 5px 1px #ccc;
    }
    .login-left {
      width: 50%;
      height: 100%;
      float: left;
      position: relative;
      img {
        height: 70%;
      }
    }
    .login-part {
      width: 50%;
      float: right;
      height: 100%;
      position: relative;
      .login-part_content {
        height: 100%;
        padding: 12% 20% 0 5%;
        h3 {
          text-align: center;
          color: rgba(51, 51, 51, 0.647058823529412);
          margin-block-end: 1.5rem;
        }
      }
      /deep/ .el-form-item__error {
        width: 100%;
        // text-align: center;
        padding-left: 54px;
      }
    }
  }
}
</style>
