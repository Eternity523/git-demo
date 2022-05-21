//引入路由组件
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Search from '@/pages/Search'
import Detail from '@/pages/Detail'

export default[
    {
        //要占位给params参数传参
        path:'/detail/:skuId',
        component:Detail,
        //meta是路由元信息
        meta:{show:true}
    },
    {
        path:'/home',
        component:Home,
        //meta是路由元信息
        meta:{show:true}
    },
    {
        path:'/login',
        component:Login,
        meta:{show:false}
    },
    {
        path:'/register',
        component:Register,
        meta:{show:false}
    },
    {
        path:'/search/:keyword?',
        component:Search,
        meta:{show:true},
        name:'search',
        //路由组件能不能传递props数据
        //布尔值写法:params
        //props:{a:1,b:2}
        //对象写法：额外的给路由组件传递一些props
        //props:{a:1,b:2}
        //函数写法:可以params参数、query参数，通过props传递路由组件
        props:($route)=>({keyword:$route.params.keyword,k:$route.query.k})
    },
    //重定向
    {
        path:'*',
        redirect:'/home'
    }
]