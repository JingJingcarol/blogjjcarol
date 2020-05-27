# webpack版本进化

webpack的作用

- 打包：可以把多个Javascript文件打包成一个文件，减少服务器压力和下载带宽。
- 转换：把拓展语言转换成为普通的JavaScript，让浏览器顺利运行。
- 优化：前端变的越来越复杂后，性能也会遇到问题，而WebPack也开始肩负起了优化和提升性能的责任。

## webpack1

2015

支持CMD和AMD，同时拥有丰富的plugin和loader

## webpack2

2016.12

支持ES Module，可以直接分析ES Module之间的依赖关系，而webpack1必须将ES Module转换成CommonJS模块之后，才能使用webpack1进行下一步处理。除此之外webpack2支持tree sharking，与ES Module的设计思路高度契合。

- webpack1.x原生不支持es6模块，但是可以使用babel-loader把es6的import语法编译成commonjs和amd模块。
webpack2支持原生ES6，这意味着webpack2可以使用import和export转换为CommonJS。
- 经过webpack2打包之后，未使用的export模块会被标记为/* unused harmony export xxx */，再经过uglify，未被export的xxx定义会被删除。
- module.loaders改成了module.rules
- 在webpack1.x中的module.loaders使用!连接各个loader，在webpack2.x中的rules.use设置数组来配置不同loader。
- 如果没有为JSON文件配置loader，webpack2将自动尝试通过加载json-loader JSON文件。

## webpack3

2017.6

- webpack2处理后的每个模块均被一个函数包裹，webpack团队参考Closure Compiler和Rollup JS，将一些有联系的模块，放到一个闭包函数里面去，通过减少闭包函数数量来加快JS的执行速度。通过设置ModuleConcatenationPlugin使用这个新特性

    ```javascript
    module.exports = {
        plugin:[
            new webpack.optimize.ModuleConcatenationPlugin()
        ]
    }
    ```

- 在webpack2中引入了Code Splitting-Async的新方法import()，用于动态引入ES Module，webpack2将传入import方法的模块打包到一个单独的代码块（chunk），但是却不能像require.ensure一样，为生成的chunk指定chunkName，因此在webpack3中提出了Magic Comment用于解决该问题

    ```javascript
    import(/*webpackChunkName:"my-chunk-name"*/'module')
    ```

## webpack4

简化了整个打包配置操作。

- 支持零配置,默认入口属性为`./src`，默认输出路径为`./dist`,webpack会自动查找项目中src目录下的`index.js`文件，然后选择的模式进行相应的打包操作，最后新建dist目录并生成一个`main.js`文件。

    此外针对开发环境和线上环境提供了两种打包模式：`"production"`和`"development"`，`"production"`模式内置了项目产出时的基本配置项，`"development"`模式基本满足了快速构建和开发体验。
- webpack4废弃了CommonsChunkPlugin，引入了optimization.splitChunks和optimization.runtimeChunk，旨在优化chunk的拆分。
- 在webapck2开始支持ESModule后，webpack提出了tree-shaking进行无用模块的消除，主要依赖ES Module的静态结构。

    在webapck4之前，主要通过在.babelrc文件中设置"modules": false来开启无用的模块检测，该方法显然比较粗暴。

    webapck4灵活扩展了如何对某模块开展无用代码检测，主要通过在package.json文件中设置sideEffects: false来告诉编译器该项目或模块是pure的，可以进行无用模块删除。 

- UglifyJs无法对ES6+的代码进行压缩，需使用babel-minify获取更好的treeshaking效果。webapck4目前已经支持压缩ES6+的代码。
- webpack4支持以import和export形式加载和导出本地的WebAssembly模块
- webpack4支持json模块和tree-shaking，之前json文件的加载需要json-loader的支持，webpack4已经能够支持json模块（JSON Module），不需要额外的配置
- 当json文件用ESModule的语法import引入的时候，webpack4还能支持对json模块进行tree-shaking处理，把用不到的字段过滤掉，起到减包的作用。