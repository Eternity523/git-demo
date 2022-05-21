import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
//注册成为全局组件了
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
import '@/mock/mockServe'
//在入口引入文件样式下面的轮播图也要用
import 'swiper/css/swiper.css'
Vue.component(Carousel.name,Carousel)
//第一个参数：全局组件的名字  第二个参数：哪一个组件
Vue.component(TypeNav.name,TypeNav)
Vue.component(Pagination.name,Pagination)
// import {reqCategoryList} from '@/api'
// reqCategoryList()
Vue.config.productionTip = false

new Vue({
  //引入的是残缺版本的vue,需要render来实现其功能
  render: h => h(App),
  //在vm上创建一个全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  router,
  //组件实例的身上会多一个属性$store属性
  store
}).$mount('#app')
