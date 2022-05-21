const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false ,//关闭语法检查
  //开启代理服务器,写需要越狱访问的端口号即可
  /* 配置代理服务器方式一，一次只能配置一个代理
    devServer:{
    proxy:'http://localhost:5000'
  } */
  //第二种代理服务器
  devServer: {
    proxy: {
      //请求的前缀
      '/atg': {
        target: 'http://localhost:5000',
        //重写路径将转发给5000端口的地址前缀置空
				pathRewrite:{'^/atg':''},
        // ws: true, //用于支持websocket
        // changeOrigin: true //用于控制请求头中的host值
      },
      '/demo': {
        target: 'http://localhost:5001',
				pathRewrite:{'^/demo':''},
        // ws: true, //用于支持websocket
        // changeOrigin: true //用于控制请求头中的host值
      }
      
    }
  }
})
