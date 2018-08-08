const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ENV = process.env.npm_lifecycle_event;
const isTest = ENV === 'test' || ENV === 'test-watch';
const isProd = ENV === 'build';

module.exports = function makeWebpackConfig () {
  const config = {};
  config.entry = isTest ? 0 : {
    app: './src/app.js',
  };
  config.output = isTest ? {} : {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
  };

  if (isTest) {
    config.devtool = 'inline-source-map';
  }
  else if (isProd) {
    config.devtool = 'source-map';
  }
  else {
    config.devtool = 'eval-source-map';
  }

  config.module = {
    rules: [{
      test: /\.js$/,
      use: [
        { loader: 'ng-annotate-loader', options: { es6: true } },
        { loader: 'babel-loader', options: { presets: ['es2015'] } },
        { loader: 'eslint-loader' },
      ],
      exclude: /node_modules/,
    }, {
      test: /\.(s*)css$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: [
          { loader: 'css-loader', query: { sourceMap: true } },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      }),
    }, {

      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      loader: 'file-loader',
    }, {
      test: /\.html$/,
      loader: 'raw-loader',
    }],
  };
  config.plugins = [
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/i,
      options: {
        postcss: {
          plugins: [autoprefixer],
        },
      },
    })];

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/public/index.html',
      inject: 'body',
    }),

    new ExtractTextPlugin({ filename: 'css/[name].css', disable: !isProd, allChunks: true }),
  );

  if (isProd) {
    config.plugins.push(
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new CopyWebpackPlugin([{
        from: __dirname + '/src/public',
      }]),
    );
  }

  config.devServer = {
    contentBase: './src/public',
    stats: 'minimal',
    host: '0.0.0.0',
  };

  return config;
}();
