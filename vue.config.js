'use strict'
const path = require('path')
const name = 'oblog-admin'

function resolve (dir) {
  /**
   * 修改别名用
   */
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  devServer: {
    proxy: {
      '/apl': {
        target: 'http://localhost:8081/api', // 域名
        changeOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/apl': ''
        }
      }
    }
  }
}
