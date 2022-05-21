//当前这个模块，API进行统一管理
import requests from './request'
import mockRequest from './mockAjax'
//三级联动接口
export const  reqCategoryList = ()=>requests({url:'/product/getBaseCategoryList',method:'get'})

//获取banner(Home首页轮播图接口)
export const reqGetBannerList = ()=>mockRequest.get('/banner')
//获取floor数据
export const reqFloorList = ()=>mockRequest.get('/floor')
export  const reqGetSearchInfo =(params)=>requests({url:'/list',method:'post',data:params})
//需不需要带参数看配置路由的时候是否有params占位
export const reqGoodsInfo = (skuId)=>requests({url:`/item/${ skuId }`,method:'get'})