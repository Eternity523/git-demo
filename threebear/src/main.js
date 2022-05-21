//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
import VueRouter from 'vue-router'
//引入路由器
import router from './router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
//导入富文本编辑器
import  VueQuillEditor from 'vue-quill-editor'
// 对应的require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//引入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ 
    easing: 'ease',  // 动画方式    
    speed: 1000,  // 递增进度条的速度    
    showSpinner: false, // 是否显示加载ico    
    trickleSpeed: 200, // 自动递增间隔    
    minimum: 0.3 // 初始化时的最小百分比
})
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)


import TreeTable from 'vue-table-with-tree-grid'
Vue.use(VueRouter)
//引入组件库
/* import ElementUI from 'element-ui'; */
//引入全部样式
/* import 'element-ui/lib/theme-chalk/index.css'; */
//按需引入
import { Form, FormItem, Input, Button, Message, Container,Header,Aside,Main,
		Menu,Submenu,MenuItem,Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch,
		Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,Select,Option,Cascader,Alert,Tabs,TabPane,
		Steps,Step,CheckboxGroup,Checkbox,Upload,Timeline,TimelineItem
} from 'element-ui';
//关闭Vue的生产提示
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL='https://lianghj.top:8888/api/private/v1/'
//配置请求拦截器
axios.interceptors.request.use(config=>{
	NProgress.start()
	//对请求头做一下预处理  添加token验证是否含有字段Authorization
	config.headers.Authorization = sessionStorage.getItem('token')
	return config
})
//在response拦截器中，隐藏进度条
axios.interceptors.response.use(config =>{
	NProgress.done()
	return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable);
//应用ui所有
/* Vue.use(ElementUI); */
Vue.component('el-form', Form);
Vue.component('el-form-item', FormItem);
Vue.component('el-input', Input);
Vue.component('el-button', Button);
Vue.component('el-container', Container);
Vue.component('el-header', Header);
Vue.component('el-aside', Aside);
Vue.component('el-main', Main);
Vue.component('el-menu', Menu);
Vue.component('el-submenu', Submenu);
Vue.component('el-menu-item', MenuItem);
Vue.component('el-breadcrumb', Breadcrumb);
Vue.component('el-breadcrumb-item', BreadcrumbItem);
Vue.component('el-card', Card);
Vue.component('el-row', Row);
Vue.component('el-col', Col);
Vue.component('el-table',Table);
Vue.component('el-table-column',TableColumn);
Vue.component('el-switch',Switch);
Vue.component('el-tooltip',Tooltip);
Vue.component('el-pagination',Pagination);
Vue.component('el-dialog',Dialog);
Vue.component('el-tag',Tag);
Vue.component('el-tree',Tree);
Vue.component('el-select',Select);
Vue.component('el-option',Option);
Vue.component('el-cascader',Cascader);
Vue.component('el-alert',Alert);
Vue.component('el-tabs',Tabs);
Vue.component('el-tab-pane',TabPane);
Vue.component('el-steps',Steps);
Vue.component('el-step',Step);
Vue.component('el-checkbox-group',CheckboxGroup);
Vue.component('el-checkbox',Checkbox);
Vue.component('el-upload',Upload);
Vue.component('el-timeline',Timeline);
Vue.component('el-timeline-item',TimelineItem);


//消息弹框需要挂载
Vue.prototype.$message = Message
//confirm 不用注册直接挂载
Vue.prototype.$confirm = MessageBox.confirm
//定义全局的过滤器
Vue.filter('dateFormat',function(originVal){
	const dt = new Date(originVal)
	const y = dt.getFullYear()
	//月份是从0开始的所以+1并且转换成字符串,padStart是不够两位用0填充
	const m = (dt.getMonth()+1+'').padStart(2,'0')
	const d = (dt.getDate()+"").padStart(2,"0")
	const hh = (dt.getHours()+"").padStart(2,"0")
	const mm = (dt.getMinutes()+'').padStart(2,"0")
	const ss = (dt.getSeconds()+'').padStart(2,"0")
	return `${y}-${m}-${d}    ${hh}:${mm}:${ss}`
})



//创建vm
new Vue({
	el: '#app',
	render: h => h(App),
	router: router
})