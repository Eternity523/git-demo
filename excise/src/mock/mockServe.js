//引入mock
import Mock from 'mockjs'
//jSON 数据格式不需要对外暴露，但是可以引入
import banner from './banner.json'
import floor from './floor.json'
//mock数据：第一个参数请求地址      第二个参数：请求数据
Mock.mock("/mock/banner",{code:200,data:banner})
Mock.mock("/mock/floor",{code:200,data:floor})
