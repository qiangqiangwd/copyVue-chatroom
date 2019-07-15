// 公共配置

/**
 * webpack 相关配置文件
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    // 本地文件
    entry: {
        app: './src/index.js'
    },
    // 输出文件
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/', // 配置输出路径
    },
    // 插件
    plugins: [
        // 每次构建前清理 /dist 文件夹
        new CleanWebpackPlugin(),
        // 生成默认 html 文件
        new HtmlWebpackPlugin({
            title: 'chartRoom',
            // 模板
            template: 'src/index.html',
            // 压缩 去掉所有空格
            minify: {
                collapseWhitespace: true //false | true
            },
            // 添加hash
            hash: true
        }),
    ],
    // 各个模块
    module: {
        rules: [
            // 图片加载
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
};