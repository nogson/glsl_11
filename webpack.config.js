// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');

const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// [定数] webpack の出力オプションを指定します
// 'production' か 'development' を指定
const MODE = 'development';

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = (MODE === 'development');

module.exports = {
    context: __dirname + '/src',
    mode: MODE,
    // エントリーポイントの設定
    entry: {
        'app': './app.js'
    },
    // 出力の設定
    output: {
        // 出力するファイル名
        filename: '[name].js',
        // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
        //path: path.join(__dirname, 'dist'),
        path: path.resolve(__dirname, 'dist')

    },
    
    // ローダーの設定
    module: {
        rules: [
            {
                // babelローダーの処理対象ファイル
                test: /\.js$/,
                // ローダーの処理対象から外すディレクトリ
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    // ローダーのオプション
                    options: {
                        // env を指定することで、ES2018 を ES5 に変換。
                        // {modules: false}にしないと import 文が Babel によって CommonJS に変換され、
                        // webpack の Tree Shaking 機能が使えない
                        presets: [
                            ['env', {
                                modules: false
                            }]
                        ]
                    }
                }]
            },
            {
                test: /\.(glsl|frag|vert)$/,
                loader: 'webpack-glsl-loader'
            },
            {
                // htmlローダーの処理対象ファイル
                //htmlファイル出力用
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }]
            },
            // Sassファイルの読み込みとコンパイル
            {
                test: /\.scss/, // 対象となるファイルの拡張子
                use: ExtractTextPlugin.extract({
                    use: [{
                            loader: 'css-loader',
                            options: {
                                url: false,
                                sourceMap: enabledSourceMap,
                                importLoaders: 2
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                // ソースマップの利用有無
                                sourceMap: enabledSourceMap,
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(svg|png|jpg|gif|mov|mp4|icon)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin(),
        //htmlファイルを出力
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new ExtractTextPlugin('styles.css')

    ],
    devServer: {
        open: true
    }
};