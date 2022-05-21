<template>
  <div>
    <Header></Header>
    <!-- 路由组件出口的地方 -->
    <router-view></router-view>
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>

import Header from './components/Header'
import Footer from './components/Footer'
export default {
  name: '',
  components: {
    Header,
    Footer
  },
  mounted(){
     //通知Vuex发送请求，获取数据存储于仓库中,因为多个组件都需要重新派发更新，
     //因此直接写到父组件app中，减少请求数据的频次
    this.$store.dispatch("categoryList");
  }
}
</script>

<style>

</style>
