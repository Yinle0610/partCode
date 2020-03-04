<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if='item.meta.title'>
        <span v-if='item.redirect==="noredirect"||item.redirect===undefined&&index==levelList.length-1' class="current">{{generateTitle(item.meta.title)}}</span>
        <span v-else-if='item.redirect==="noredirect"||item.redirect===undefined' class="no-redirect">{{generateTitle(item.meta.title)}}</span>
        <router-link v-else :to="item.redirect + '?_title=111'||item.path">{{generateTitle(item.meta.title)}}</router-link>
        <!-- <router-link v-if="item.meta.title==='我的桌面'&&index!==levelList.length-1" :to="item.redirect + '?_title=111'||item.path">{{generateTitle(item.meta.title)}}</router-link>
        <span v-else-if="index==levelList.length-1" class="current">{{generateTitle(item.meta.title)}}</span>
        <span v-else class="no-redirect">{{generateTitle(item.meta.title)}}</span> -->
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { generateTitle } from '@/utils/i18n'

export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    generateTitle,
    getBreadcrumb() {
      // let matched = this.$route.matched.filter(item => item.name)
      // const first = matched[0]
      // if (first && first.name !== 'DASH') {
      //   matched = [{ path: '/dashboard', meta: { title: 'dashboard' }}].concat(matched)
      // }
      this.levelList = this.$route.matched.filter(item => item.name)
      // console.log(this.levelList, 'this.levelList')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
    .current {
      color: #333;
      cursor: text;
    }
  }
</style>
