const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const {
    VueLoaderPlugin
} = require('vue-loader')

const isProd = process.env.NODE_ENV === 'production'

const assetsPath = function (_path) {
    const assetsSubDirectory = 'static'
  
    return path.posix.join(assetsSubDirectory, _path)
  }

module.exports = {
    mode: isProd ? 'production' : 'development',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: assetsPath('js/[id].[chunkhash].js')
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    }, 'postcss-loader'
                ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    // {
                    //   loader: 'file-loader',
                    // },
                    {
                        loader: "url-loader",
                        options: {
                            outputPath: 'static/images/',
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)\w*/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        outputPath: 'static/font/',
                        limit: 8192
                    }
                }]

            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        appendTsxSuffixTo: [/\.vue$/]
                    },
                }],

                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            { from: path.resolve(__dirname,'../src/assets'), to: path.resolve(__dirname,'../dist/static') }
        ]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, 'index.template.ejs'),
            inject: true,
          }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin()
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json', '.vue'],
        alias: {
            '@': path.join(__dirname, "./")
        }
    }
}