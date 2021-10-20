const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const filename = (ext) => (isDevelopment ? `[name].${ext}` : `[name].[hash].${ext}`);

const optimization = () => {
    const config = {
        runtimeChunk: isDevelopment,
        splitChunks: {
            chunks: 'all',
        },
    };

    if (isProduction) {
        config.minimizer = [new OptimizeCssAssetWebpackPlugin(), new TerserWebpackPlugin()];
    }

    return config;
};

const getPlugins = () => {
    return [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            minify: {
                collapseWhitespace: isProduction,
            },
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        }),
        new webpack.HashedModuleIdsPlugin({
            hashFunction: 'md4',
            hashDigest: 'base64',
            hashDigestLength: 4,
        }),
    ];
};

const babelOptions = (...presets) => {
    const opts = {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties'],
    };

    if (presets) {
        for (const preset of presets) {
            opts.presets.push(preset);
        }
    }

    return opts;
};

const jsLoaders = (...presets) => {
    const loaders = [
        'cache-loader',
        'thread-loader',
        {
            loader: 'babel-loader',
            options: babelOptions(...presets),
        },
    ];

    if (isDevelopment) {
        // loaders.push('eslint-loader');
    }

    return loaders;
};

const PROXY_HOST = process.env.PROXY_HOST || 'http://84.252.141.1:8080';
const origin = PROXY_HOST.replace(/http(s)?:\/\/?/, '');

const proxyConfig = {
    target: PROXY_HOST,
    ws: true,
    logLevel: 'debug',
    secure: false,
    onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('origin', `http://${origin}`);
        proxyReq.setHeader('host', origin);
    },
};

module.exports = {
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './src/index.tsx'],
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    module: {
        rules: [
            // we use babel-loader to load our jsx and tsx files
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders(),
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: jsLoaders('@babel/preset-typescript'),
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: jsLoaders('@babel/preset-react'),
            },
            {
                test: /\.tsx$/,
                exclude: /node_modules/,
                use: jsLoaders('@babel/preset-react', '@babel/preset-typescript'),
            },
            {
                test: /\.s?css$/,
                exclude: /.m.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: 'global',
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /.m.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader'],
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader'],
            },
        ],
    },
    optimization: optimization(),
    devServer: {
        port: 8082,
        host: '0.0.0.0',
        clientLogLevel: 'warning',
        stats: 'errors-only',
        useLocalIp: true,
        hot: isDevelopment,
        inline: true,
        compress: true,
        overlay: true,
        disableHostCheck: true,
        historyApiFallback: true,
        proxy: {
            '/api': proxyConfig,
        },
    },
    devtool: isDevelopment ? 'source-map' : '',
    plugins: getPlugins(),
};
