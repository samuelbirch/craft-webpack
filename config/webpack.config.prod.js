const path = require('path');
const webpackMerge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const webpackCommon = require('./webpack.config');
const Indexer = require('../src/js/modules/indexer');

// webpack plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
//const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = webpackMerge(webpackCommon, {

  bail: true,

  devtool: 'source-map',

  output: {

    path: path.resolve(__dirname, '../html'),

    filename: 'assets/js/[name]-[chunkhash].js',

    sourceMapFilename: 'assets/js/[name]-[chunkhash].map',

    chunkFilename: 'assets/js/[name]-[chunkhash].jss',
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
	  
    new HtmlWebpackPlugin({
      inject: false,
      template: 'html/templates/layout.ejs',
      filename: 'templates/layout.twig',
      /*minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }*/
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: 'html/layouts/_index.ejs',
      filename: 'layouts/index.html',
    }),
    new Indexer(),
    //new DedupePlugin(),
    new CleanWebpackPlugin(['html/assets/js', 'html/assets/css'], {
      root: path.resolve(__dirname, '..'),
      exclude: '.gitignore'
    }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new ExtractTextPlugin('assets/css/[name]-[chunkhash].css'),
    new UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      },
      sourceMap: true
    }),
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
    }),
    new ManifestPlugin()
  ]

});