const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const mode =  process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
const envConfig = require(`./webpack.${mode}.config.js`);

module.exports = merge(base, envConfig , {
    entry: {
        app: './src/entry-client.js'
    },
    plugins: [
        
        new VueSSRClientPlugin()
    ],
    optimization:{
        splitChunks:{
          cacheGroups: {
              commons: {
                //   test: /[\\/]node_modules[\\/]/,
                  name: "vendor",  // 指定公共模块 bundle 的名称
                  chunks: "initial",
                  minChunks: 2
              }
            }
        },
    }
})