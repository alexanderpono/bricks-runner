const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/assets/index-dev.html'
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.scss'],
        alias: {
            '@src': 'src'
        }
    },
    entry: {
        game: './src/main.tsx'
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash].js',
        assetModuleFilename: '[path][name]-[hash:8][ext]',
        sourceMapFilename: '[file].map',
        path: path.resolve(__dirname, 'temp/ui-dist'),
        clean: true
    },
    devServer: {
        open: true,
        port: 8702,
        historyApiFallback: true,
        client: {
            progress: true
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(scss)$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'css-modules-typescript-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[local]-[hash:8]'
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,

                type: 'asset/resource'
            }
        ]
    },
    devtool: 'source-map',
    target: ['web', 'es6'],
    optimization: {}
};
