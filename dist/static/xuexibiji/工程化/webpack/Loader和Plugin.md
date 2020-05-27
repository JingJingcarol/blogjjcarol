# Loader和Plugin

## loader

用于对模块源码的转换，loader描述了webpack如何处理非javascript模块，并且在buld中引入这些依赖。loader可以将文件从不同的语言（如TypeScript）转换为JavaScript，或者将内联图像转换为data URL。

- 处理一个文件可以使用多个loader，loader的执行顺序和配置中的顺序是相反的，即最后一个loader最先执行，第一个loader最后执行
- 第一个执行的loader接收源文件内容作为参数，其它loader接收前一个执行的loader的返回值作为参数，最后执行的loader会返回此模块的JavaScript源码

### 使用方式

- webpack.config.js

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: 'raw-loader'
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
}
```

- 命令行参数

```sh
webpack --module-bind 'txt=raw-loader'
```

- 内联使用

```javascript
import txt from 'raw-loader!./file.txt';
```

- webpack常用的loader
  - 样式：style-loader、css-loader、less-loader、sass-loader等
  - 文件：raw-loader、file-loader 、url-loader等
  - 编译：babel-loader、coffee-loader 、ts-loader等
  - 校验测试：mocha-loader、jshint-loader 、eslint-loader等

## plugin

目的在于解决loader无法实现的其他事，从打包优化和压缩，到重新定义环境变量，功能强大到可以用来处理各种各样的任务。

在webpack运行的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的API改变输出结果。

- webpack内置UglifyJsPlugin，压缩和混淆代码。
- webpack内置CommonsChunkPlugin，提高打包效率，将第三方库和业务代码分开打包

### 使用

- 想要使用一个插件，你只需要 require()它，然后将它添加到plugins数组中。多数插件可以通过选项自定义。你也可以在一个配置中因为不同目的而多次使用同一个插件，这时需要通过使用new操作符来创建它的一个实例。
- webpack插件是一个具有 apply 属性的JavaScript对象。apply属性会被webpack compiler调用，并且compiler对象可在整个编译周期访问。

```javascript
// webpack.config.js文件头部引入插件
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin= require('html-webpack-plugin');

// 插件配置
plugins:[
    new uglify()，
    new htmlPlugin({
          minify:{
            removeAttributeQuotes: true
          },
          hash: true,
          template: './src/index.html'
        }),
  ],
```
