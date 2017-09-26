const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './app/client.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',
    },
    resolve: {
        extensions: ['*', '.js', '.css']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                use: ['react-hot-loader', 'babel-loader'],
                exclude: /(node_modules)/,
            },
            {
                test: /\.scss$/,
                loader: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                localIdentName: '[local]-[hash:base64:5]',
                                modules: true,
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [path.resolve(__dirname, 'app/styles')],
                                outputStyle: 'compressed'
                            }
                        },
                    ],
                }))
            }
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html',
            filename: 'index.html',
            inject: 'body'
        }),

        new ExtractTextPlugin({
            filename: 'css/[name].css',
            allChunks: true
        }),
    ],

    devServer: {
        historyApiFallback: true,
        port: 8080,
        stats: 'errors-only',
        inline: true,
        contentBase: 'dist',
        disableHostCheck: true
    },
}
