// 生产环境配置
const merge = require('webpack-merge');
const common = require('./webpack.common');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = merge(common, {
    // devtool: 'source-map',
    // 插件
    plugins: [
        //提取css文件并进行打包
        new ExtractTextPlugin("[name].css"),
    ],
    optimization: {
        minimize: false
    },
    // 各个模块
    // 生產環境下打包的css 会合并并单独放在一个单独的css中
    module: {
        rules: [
            // 加载css
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        "less-loader",
                    ]
                })
            },
        ]
    },
});