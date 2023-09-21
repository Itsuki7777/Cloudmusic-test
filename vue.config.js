const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  //开启代理服务器
  devServer: {
    proxy: {
      "/api": {      //匹配所有以'/api'开头的请求路径
        target: "http://localhost:3000",
        changeOrigin: true,    //用于控制请求头中的host值，设置为true时服务器收到的请求头中的host为：localhost:3000
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
});
