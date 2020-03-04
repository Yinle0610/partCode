<template>
  <div>
    <el-menu class="navbar"
            mode="horizontal">
      <hamburger class="hamburger-container"
                :toggleClick="toggleSideBar"
                :isActive="sidebar.opened"></hamburger>

      <breadcrumb class="breadcrumb-container"></breadcrumb>

      <div class="right-menu">
        <div class="right-menu-item input-box">
          <svg-icon icon-class="searchIcon" class="searchIcon" @click.native.stop="changeInputView" v-show="!ifShowInput2"></svg-icon>
          <transition name="toTop">
            <div v-show="ifShowInput" style="display: inline-block;vertical-align: top;">
              <svg-icon icon-class="searchIcon" class="searchIcon" @click.native.stop="changeInputView" ></svg-icon>
              <el-input placeholder="请输入内容"
                    v-model="keyword"
                    v-permission="'GLOBAL_SEARCH'"
                    @keyup.enter.native="handleSearch"
                    class="search-input"
                    clearable>
              </el-input>
            </div>
          </transition>

        </div>


        <el-dropdown class="avatar-container right-menu-item"
                    style="margin-right: 15px;"
                    trigger="click">
          <!-- <div class="avatar-wrapper"> -->
          <span class="el-dropdown-link">
            {{name}}<i class="el-icon-caret-bottom"></i>
          </span>
          <!-- </div> -->
          <el-dropdown-menu slot="dropdown">
            <a @click="alterPassword">
              <el-dropdown-item>修改密码</el-dropdown-item>
            </a>
            <a v-if="accessToDmac" @click="forwardToDmac">
              <el-dropdown-item>元数据管理后台</el-dropdown-item>
            </a>
            <a v-if="accessToDsms" @click="forwardToDsms">
              <el-dropdown-item>数据标准管理后台</el-dropdown-item>
            </a>
            <a v-if="accessToDqms" @click="forwardToDqms">
              <el-dropdown-item>数据质量管理后台</el-dropdown-item>
            </a>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <div class="alter-password-dialog">
        <el-dialog :visible.sync="alterDialog" title="修改密码" width="400px">
          <el-form :model="alterPWForm" label-width="110px" :rules="alterPWRules" ref="alterPWForm">
            <el-form-item label="原始密码：" prop="oldPassWord">
              <el-input placeholder="请输入原始密码" v-model="alterPWForm.oldPassWord" show-password size="mini"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="oncePassWord">
              <el-input placeholder="请输入新密码" v-model="alterPWForm.oncePassWord" show-password size="mini"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码：" prop="secondthPassWord">
              <el-input placeholder="请再次输入新密码" v-model="alterPWForm.secondthPassWord" show-password size="mini"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align:center">
            <el-button type="primary" @click.native="saveAlteractionPwd" size="mini">确定</el-button>
          </div>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'

import { post } from '@/utils/request'
import md5 from 'md5'

export default {
  data () {
    return {
      dmacUrl: process.env.DMAC_URL,
      dsmsUrl: process.env.DSMS_URL,
      dqmsUrl: process.env.DQMS_URL,
      keyword: '',
      ifShowInput3: false,
      ifShowInput2: false,
      alterDialog: false,
      alterPWForm: {
        oldPassWord: '',
        oncePassWord: '',
        secondthPassWord: ''
      },
      alterPWRules: {
        oldPassWord: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        oncePassWord: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        secondthPassWord: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'ifShowInput',
      'accessToDmac',
      'accessToDsms',
      'accessToDqms'
    ])
  },
  watch: {
    ifShowInput: {
      handler(newValue, oldValue) {
        console.log(newValue, 'newValue')
        const that = this;
        if (newValue === false) {
          var t1 = setTimeout(function() {
            that.ifShowInput2 = false;
            console.log(that.ifShowInput2)
            clearTimeout(t1);
          }, 1001);
        }
      },
      deep: true // 只要当obj中的值改变就会触发这个函数且,newValue,oldValue两个参数值相同;/
    }
  },
  methods: {
    forwardToDmac() {
      post('/auth').then(res => {
        if (res.code === 10000 && res.success === true) {
          window.open(this.dmacUrl + '?token=' + this.$store.getters.token, '_blank');
        } else {
          this.$router.push({
            path: '/login'
          })
        }
      })
    },
    forwardToDsms () {
      post('/auth').then(res => {
        if (res.code === 10000 && res.success === true) {
          window.open(this.dsmsUrl + '?token=' + this.$store.getters.token, '_blank');
        } else {
          this.$router.push({
            path: '/login'
          })
        }
      })
    },
    forwardToDqms() {
      post('/auth').then(res => {
        if (res.code === 10000 && res.success === true) {
          window.open(this.dqmsUrl + '?token=' + this.$store.getters.token, '_blank');
        } else {
          this.$router.push({
            path: '/login'
          })
        }
      })
    },
    // 重置form
    resetForm() {
      if (this.$refs.alterPWForm !== undefined) {
        this.$refs.alterPWForm.resetFields();
      }
    },
    // 修改密码
    alterPassword() {
      this.resetForm()
      this.alterDialog = true
    },
    changeInputView() {
      console.log(this.$store.getters.ifShowInput)
      this.$store.dispatch('setIfShowInput', !this.$store.getters.ifShowInput)
      if (this.$store.getters.ifShowInput === true) {
        this.ifShowInput2 = true
      }
    },
    saveAlteractionPwd() {
      this.$refs.alterPWForm.validate(valid => {
        if (valid) {
          // console.log("this.alterPWForm.oncePassWord", this.alterPWForm.oncePassWord)
          if (this.alterPWForm.oncePassWord === this.alterPWForm.secondthPassWord) {
            let params = {
              newPassword: md5(this.alterPWForm.oncePassWord),
              oldPassword: md5(this.alterPWForm.oldPassWord)
            }
            post('/sys/user/modifyPassword', params).then(res => {
              if (res.code === 10000 && res.success === true) {
                this.$message.success(res.message)
                this.alterDialog = false
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            this.$message.error('两次新密码输入不一致')
          }
        } else { this.$message.error('请填写必填信息') }
      })
    },
    toggleSideBar () {
      this.$store.dispatch('toggleSideBar')
    },
    logout () {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    handleSearch() {
      this.$store.dispatch('setGlobalSearch', this.keyword)
      this.$router.push({
        name: 'globalSearch',
        params: {
          keyword: this.keyword
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "./../../../styles/dq/main-card-table.scss";
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      width: 72px;
      // margin-right: 30px;
      // .avatar-wrapper {
      cursor: pointer;
      // margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
        display: inline-block;
        position: absolute;
        width: 42px;
        top: 0;
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
      // }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.input-box{
  vertical-align: top;
  overflow: hidden;
  .searchIcon{
    font-size: 22px;
    position: relative;
    top:3px;
  }
}
.search-input {
  width: 250px;
  .el-input__inner {
    border-left-width: 0;
    border-right-width: 0;
    border-top-width: 0;
    height: 30px;
    line-height: 30px;
    border-radius: 0;
  }

}
.toTop-enter-active{
     animation: identifier 1s;
  }
  .toTop-leave-active{
     animation: identifier2 1s;
  }
  @keyframes identifier {
      from {transform: translateX(92%);}
      to {transform: translateX(0%);}
      }
  @keyframes identifier2 {
      from {transform: translateX(0%);}
      to {transform: translateX(92%);}
      }
</style>
