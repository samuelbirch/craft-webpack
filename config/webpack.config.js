// webpack plugins
const path = require('path');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {

  entry: {
    app: './src/js/app.js'
  },

  resolve: {

    extensions: ['.js', '.scss'],

    modules: ['node_modules']

  },

  module: {

    rules: [

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', {loader:'eslint-loader', options:{configFile:'config/.eslintrc.js'}}]
      },

      {
        test: /\.json$/,
        loader: 'json'
      },

      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'file',
      },

      {
        test: /\.(mp4|webm)$/,
        loader: 'url?limit=10000'
      }

    ]

  },

  plugins: [
    new CommonsChunkPlugin({
      name: ['app'],
      minChunks: Infinity
    })
  ]

};