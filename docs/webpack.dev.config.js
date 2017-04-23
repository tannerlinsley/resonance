// @flow weak

const path = require('path');
const webpack = require('webpack');
const webpackBaseConfig = require('./webpackBaseConfig');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const dllManifest = require('./build/dll.manifest.json');

module.exports = Object.assign({}, webpackBaseConfig, {
  cache: true,
  devtool: 'inline-source-map',
  context: path.resolve(__dirname),
  entry: {
    main: [
      'babel-polyfill', // polyfill for lesser browsers
      'eventsource-polyfill', // hot reloading in IE
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://0.0.0.0:3000',
      'webpack/hot/only-dev-server',
      './src/index',
    ],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
      },
      {
        test: /\.(jpg|gif|png)$/,
        loader: 'file-loader!img-loader',
      },
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  resolve: {
    alias: {
      docs: path.resolve(__dirname, '../docs'),
      resonance: path.resolve(__dirname, '../src'),
    },
  },
  plugins: webpackBaseConfig.plugins.concat([
    new BundleAnalyzerPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: dllManifest,
    }),
    new webpack.NamedModulesPlugin(),
  ]),
});
