const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackCommon = require('./webpack.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const env = require('./env');
//const proxyRules = require('../proxy/rules');

// webpack plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

module.exports = webpackMerge(webpackCommon, {

  devtool: 'inline-source-map',

  output: {

    path: path.resolve(__dirname, '../html'),

    filename: 'assets/js/[name].js',

    sourceMapFilename: 'assets/js/[name].map',

    chunkFilename: 'assets/js/[id]-chunk.js',

    publicPath: '/'

  },

  module: {

    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
			//fallbackLoader: 'style-loader',
			use: [
	          {
	            loader: 'css-loader',
	            options: {
	              importLoaders: 2,
	              modules: false,
	              //localIdentName: '[name]__[local]'
	            }
	          },
	          {
		          loader: 'postcss-loader'
	          },
	          {
	            loader: 'sass-loader',
	            options: {
	              outputStyle: 'expanded',
	              sourceMap: true,
	              sourceMapContents: true
	            }
	          }
	        ]
		})
      }
    ]

  },

  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: "'development'"
      }
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: 'html/templates/layout.ejs',
      filename: 'templates/layout.twig',
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: 'html/layouts/_index.ejs',
      filename: 'layouts/index.html',
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin(),
    new ExtractTextPlugin('assets/css/[name].css'),
    new LoaderOptionsPlugin({
      options: {
        context: '/',
        sassLoader: {
          includePaths: [path.resolve(__dirname, '../src')]
        },
        postcss: function () {
          return [autoprefixer];
        }
      }
    })
  ],

  devServer: {
    host: env.devServer.host || 'localhost',
    port: env.devServer.port || 3000,
    contentBase: './html',
    //public: 'turf.ots.dev:80',
    compress: true,
    open: true,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    //proxy: proxyRules
  }

});