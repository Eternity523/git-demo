import {reqGetSearchInfo} from '@/api'
const state ={
    SearchList:{}
}
const mutations = {
    GETSEARCHLIST(state,SearchList){
        state.SearchList = SearchList
    }
}
const actions = {
    async getSearchList({commit},params={}){
        let result = await reqGetSearchInfo(params)
        if(result.code==200){
            commit("GETSEARCHLIST",result.data)
        }
    }
}
//getters视为了简化数据而生
const getters = {
    goodsList(state){
        return state.SearchList.goodsList||[]
    },
    trademarkList(state){
        return state.SearchList.trademarkList;
    },
    attrsList(state){
        return state.SearchList.attrsList;
    }
}
export default{
    state,
    mutations,
    actions,
    getters
}