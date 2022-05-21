module.exports = {
    //打包时不要map文件
    productionSourceMap:false,
    //关闭校验工具eslient
    lintOnSave:false,
    //代理跨域 解决跨域问题
    devServer:{
        proxy:{
            '/api':{
                target:'http://39.98.123.211',
               // pathRewrite:{'^/api':''},
            },
        },
    }
}