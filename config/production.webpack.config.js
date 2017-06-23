var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var cleanWebpackPlugin = require('clean-webpack-plugin');
// 压缩css
var optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function (env) {
  return {
    entry: {
      main: path.resolve(__dirname, '..', 'app', "index.js"),
    },
    output: {
      path: path.join(__dirname, '..', 'build-prod'),
      filename: '[name].[chunkhash].bundle.js', // main.bundle.js | tweets.bundle.js
    },
    module: {
      rules: [
        {
          test: /\.ya?ml$/,
          use: ['json-loader', 'yaml-loader'],
          // loader: 'json-loader!yaml-loader',
          include: path.resolve(__dirname, '..', 'app', 'config'),
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['react', ["es2015", { modules: false }]],
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
          // loader: 'style-loader!css-loader'
        },
        {
          test: /\.scss$/,
          // loaders: ['style-loader', 'css-loader', 'sass-loader']
          // loader: 'style-loader!css-loader!sass-loader'
          // use: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader') WEBPACK 1
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            // ?sourceMap是为了debug时有original code
            use: "css-loader?sourceMap!sass-loader?sourceMap",
          }),
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
          use: 'url-loader?limit=100000',
        },
      ],
    },
    plugins: [
      new ExtractTextPlugin('[name].[chunkhash].css'),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.[chunkhash].bundle.js',
        chunks: ['vendor'],
      }),
      new htmlWebpackPlugin({
        template: path.resolve(__dirname, '..', 'app', 'index.html'),
        hash: true,
        chunks: ['vendor', 'main'],
        minify: {
          collapseWhitespace: true,
        },
      }),
      // new cleanWebpackPlugin(['build-prod'], {
      //   root: path.resolve(__dirname, '..'),
      //   verbose: true,
      // }),
      // 压缩css文件设置
      new optimizeCssAssetsWebpackPlugin({
        cssProcessorOptions: { discardComments: { removeAll: true } },
      }),
      // 压缩js文件设置
      new webpack.optimize.UglifyJsPlugin({
        output: {
          comments: false,
        },
        // 变量名字不修改
        mangle: false,
        // 和debuge有关,因为损耗性能,所以默认是关的
        sourceMap: true,
      }),
      // 和生产环境的react有关;
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
        env: JSON.stringify(env),
      }),
    ],
    devServer: {
      contentBase: path.resolve(__dirname, '..', 'build-prod'),
      inline: true,
      port: 3000,
      open: true,
    },
    devtool: 'source-map',
  };
};
