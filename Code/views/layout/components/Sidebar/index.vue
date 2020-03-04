<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
<!--      <img :src="brand"/>-->
      <!--全尺寸 logo-->
      <img
          v-if="sidebar.opened"
          style="width: 150px; height: 56px"
          :src="brand"/>
      <!--小尺寸 logo-->
      <img
          v-else
          style="width: 36px; height: 36px"
          :src="brand"/>
      <sidebar-item v-for="route in permissionRouters" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permissionRouters',
      'sidebar',
      'brand'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    // 调用全尺寸logo 真实数据
    this.$store.dispatch('getFullLogoPath')
    // 调用小尺寸logo 真实数据
    this.$store.dispatch('getSmallLogoPath')
  }
}
</script>
