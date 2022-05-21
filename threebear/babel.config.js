module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
   
    ["@babel/preset-env",{"modules":false}],
    /* ["es2015", { "modules": false }], */
     //上面是最新的配置写法，下面时老版本的写法
  ],
  plugins: [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
