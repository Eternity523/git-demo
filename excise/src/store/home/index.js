import {reqCategoryList, reqGetBannerList,reqFloorList} from '@/api'
const state ={
    categoryList:[],
    bannerList:[],
    FloorList:[]
}
const mutations = {
    CATEGORYLIST(state,categoryList){
        state.categoryList = categoryList
    },
    GETBANNERLIST(state,bannerList){
        state.bannerList = bannerList
    },
    GETFLOORLIST(state,FloorList){
        state.FloorList = FloorList
    }
}
const actions = {
    //通过API里面的接口函数调用，向服务器发送请求，获取数据
    async categoryList({commit}){
        let result = await reqCategoryList()
        if(result.code == 200){
            //一般大写的是mutations里面的，小写的是actions
            commit("CATEGORYLIST",result.data)
        }
    },
    //获取首页轮播图的数据
    async getBannerList({commit}){
        let result = await reqGetBannerList()
        if(result.code==200){
            commit('GETBANNERLIST',result.data)
        }
    },
    async getFloorList({commit}){
        let result = await reqFloorList()
        if(result.code ==200){
            commit('GETFLOORLIST',result.data)
        }
    }

}
//计算属性
const getters = {}
export default{
    state,
    mutations,
    actions,
    getters
}