// 开发环境配置
const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');

module.exports = merge(common,{
    // 追踪错误和警告在源代码中的原始位置
    devtool: 'inline-source-map',
    // 提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)
    devServer: {
        contentBase: './src/index.html',
        watchContentBase: true, // contentBase 选项提供的文件。文件更改将触发整页重新加载
        hot: true,  // css 热加载
        // compress: true,
        // openPage: '/different/page', //指定打开浏览器时导航到的页面。
        clientLogLevel: "none", // 阻止所有这些消息显示
        port: 9000,
    },
    // 插件
    plugins: [
        // 热加载，在js配置中使用
        // new webpack.NamedChunksPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
    ],
    // 各个模块
    // 开发环境下 css是直接放在html文件中的，方便热加载渲染
    module: {
        rules: [
            // 加载css
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    "css-loader",
                    "less-loader",
                ]
            },
        ]
    },
});