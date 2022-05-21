import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
//引入小仓库
import home from "./home"
import search from './search'
import detail from './detail'
// //仓库存储数据的地方
// const state = {};
// //修改state的唯一手段
// const mutations = {}
// //action书写自己的业务逻辑，也可以处理异步
// const actions = {}
// //getters 计算属性简化仓库数据
// const getters={}

//对外暴露store的一个实例
export default new Vuex.Store({
  modules:{
      home,
      search,
      detail
  }
})
