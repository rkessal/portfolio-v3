const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const IS_DEVELOPMENT = (process.env.NODE_ENV = 'dev')

const dirApp = path.join(__dirname, 'app')
const dirStyles = path.join(__dirname, 'styles')
const dirAssets = path.join(__dirname, 'assets')
const dirViews = path.join(__dirname, 'views')
const dirConfig = path.join(__dirname, 'config')
const dirMiddlewares = path.join(__dirname, 'middlewares')
const dirPublic = path.join(__dirname, 'public')
const dirNode = 'node_modules'

module.exports = {
  entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],

  resolve: {
    modules: [dirPublic, dirApp, dirStyles, dirAssets, dirNode, dirViews, dirConfig, dirMiddlewares]
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: './assets',
          to: ''
        }
      ]
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),

    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          plugins: [
            ['gifsicle', { interlaced: true }],
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }]
          ]
        }
      }
    }),

    new CleanWebpackPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        loader: 'file-loader',
        options: {
          name (file) {
            return '[hash].[ext]'
          }
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify
              }
            }
          }
        ]
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      }
    ]
  }
}
