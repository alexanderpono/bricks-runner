const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackRules = require('./webpack.rules');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            types: path.resolve(__dirname, 'src/types')
        }
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'index.js'
    },
    module: {
        rules: [...webpackRules]
    },
    devServer: {
        historyApiFallback: true,
        open: false,
        port: 8888,
        contentBase: './static'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './static/index.html'
        }),
        new CopyPlugin({
            patterns: [{ from: 'static/sprite.png' }]
        })
    ]
};
