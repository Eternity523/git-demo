<template>
  <div class="home-container">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="../assets/heima.png" alt />
          <span>三小只管理后台系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单区域 -->
          <!-- unique-opened每次只能展开一个  开启router默认开启路由模式-->
          <el-menu
            background-color="rgb(21, 104, 116)"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+'' " v-for="(item,index) in menulist" :key="item.id">
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+ subItem.path"
                v-for="(subItem,index) in item.children"
                :key="subItem.id" @click="saveNavState('/'+ subItem.path)"
              >
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
          <!-- 放路由展示区域，只是部分页面发生变化 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menulist: [],
      //可以给图标自定义数组遍历,根据id遍历
      iconsObj: {
        "125": "iconfont icon-users",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      //是否折叠
      isCollapse: false,
      activePath:''
    };
  },
  created() {
    this.getMenuList();
    this.activePath = sessionStorage.getItem('activePath')
    this.activePath = this.activePath
  },
  methods: {
    logout() {
      //退出页面登录的token
      sessionStorage.clear();
      this.$router.push("/login");
    },
    //async和await可以简化数据 异步数据
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      //console.log(res)
    },
    //点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath){
      sessionStorage.setItem('activePath',activePath)
    }
  }
};
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: rgb(21, 104, 116);
  display: flex;
  justify-content: space-between;
  //不让按钮贴边，居中对齐
  align-items: center;
  //让子节点纵向居中对齐
  > div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
    color: white;
    font-size: 28px;
    font-weight: 24px;
  }
}
.el-aside {
  background-color: rgb(54, 134, 145);
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: rgb(212, 226, 132);
}
.el-table{
  margin-top: 15px;
  font-size: 12px;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: rgb(54, 134, 145);
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.3em;
  //鼠标放上去变成小手
  cursor: pointer;
}
</style>