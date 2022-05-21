//改文件专门用来创建整个应用的路由器
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import GoodsList from '../components/goods/List'
import Add from '../components/goods/Add'
import Order from '../components/order/Order'
import Report from '../components/report/Report'
//创建并暴露一个路由器
const router = new VueRouter({
    //hash模式项目上线时不会出现刷新404，history会
    // mode:'hash',
    routes: [
        {
            path:'/',
            redirect:'/login'
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/home',
            component: Home,
            redirect:'/welcome',
            children:[{
                path: '/welcome',
                component: Welcome,
            },{
                path: '/users',
                component: Users,
            },
            {
                path: '/rights',
                component: Rights,
            },
            {
                path: '/roles',
                component: Roles,
            },
            {
                path: '/categories',
                component: Cate,
            },
            {
                path: '/params',
                component: Params,
            },
            {
                path: '/goods',
                component: GoodsList,
            },
            {
                path: '/goods/add',
                component: Add,
            },
            {
                path: '/orders',
                component: Order,
            },
            {
                path: '/reports',
                component: Report,
            }
        ],

        },
        
    ]
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
    if(to.path === '/login') 
    return next()
    //获取toker
    const tokenStr = sessionStorage.getItem('token')
    if(!tokenStr) return next('/login')
    next()
})
export default router