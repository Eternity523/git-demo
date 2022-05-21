import {reqGoodsInfo} from '@/api'
const state = {
    goodInfo:{}
}

const mutations = {
    GETGOODINFO(state,goodInfo){
        state.goodInfo = goodInfo
    }
}
const actions = {
    async getGoodInfo({commit},skuId){
        let result = await reqGoodsInfo(skuId)
        if(result.code ==200){
            commit ("GETGOODINFO",result.data)
        }
    }
}
//可以简化数据的路径
const getters = {
    categoryView(state){
        //假报错的原因是初始状态时空对象，空兑现的categoryview属性值是undefined
        //当前计算出的catregoryView属性值至少是一个空对象，假的报错就不会有了
        return state.goodInfo.categoryView || {};
    },
    skuInfo(state){
        return state.goodInfo.skuInfo||{}
    }
}

export default {
 state,
 actions,
 mutations,
 getters
}