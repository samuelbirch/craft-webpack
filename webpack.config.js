const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
import WebpackCleanupPlugin from 'webpack-cleanup-plugin';

module.exports = {
	
	entry: {
		app: './src/js/app.js'
	},
	
	output: {
		//filename: '[name].js',
		filename: 'assets/js/[name].[chunkhash:8].js',
		path: path.join(__dirname, 'html/'),
		publicPath: '/'
	},
	
	module: {
		rules: [{
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				use: 'css-loader'
			})
		},{
	        test: /\.js$/,
	        use: [{
	          loader: 'babel-loader',
	          options: { presets: ['es2015'] }
	          exclude: [/node_modules/],
	        }],
      }]
	},
	
	plugins: [
		//new ExtractTextPlugin('../css/[name].css'),
		new ExtractTextPlugin('assets/css/[name].[chunkhash:8].css'),
		new ManifestPlugin(),
		new HtmlWebpackPlugin({
			inject: false,
			filename: 'templates/layout.twig',
			template: 'html/templates/layout.ejs'
		})
	]
	
};