const path = require('path')
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
module.exports = {
    // cheap-module-eval-source-map is faster for development
  devtool: 'cheap-module-eval-source-map',

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    // historyApiFallback: {
    //   rewrites: [
    //     { from: /.*/, to: path.posix.join('/', 'index.html') },
    //   ],
    // },
    historyApiFallback:true,
    hot: true,
    // contentBase: false, // since we use CopyWebpackPlugin.
    contentBase: path.join(__dirname, "../dist"),
    compress: true,
    host: HOST ,
    port: PORT,
    open: false,
    overlay: { warnings: false, errors: true },
    publicPath: '/',
    proxy: {},
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    }
  },
}