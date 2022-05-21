//对于axios进行二次封装
import axios from "axios"
//引入进度条
import nprogress from 'nprogress'
import "nprogress/nprogress.css"
//利用axios对象的方法create,去创建一个axios实例
//request 就是axios,只不过稍微配置一下
const requests = axios.create({
    //基础路径，发送请求的时候，路径当中会出现api
    baseURL:'/api',
    timeout:5000,
})
//请求拦截器，再发送之前，请求拦截器可以检测到,可以在请求发出去之前做一些事情
requests.interceptors.request.use((config)=>{
    nprogress.start();
    return config
})
//响应拦截器
requests.interceptors.response.use((res)=>{
    nprogress.done()
    return res.data
},(error)=>{
    return Promise.reject(new Error('faile'))
})
export default requests