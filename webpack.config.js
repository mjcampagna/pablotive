const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  
  module: {
    rules: [

      { 
        test: /\.jsx?$/, 
        loader: 'babel-loader',
        include: /src/,
        options: {
          presets: ['env', 'react']
        }
      },

      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
      },

      {
        test: /\.(gif|jpeg|jpg|png|svg|webp)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/images/[name].[ext]',
              include: [/images/]
            }
          }
        ]
      },

      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name].[ext]',
              include: [/fonts/]
            }
          }
        ]
      }

    ] // rules
  }, // module

  plugins: [

    new HtmlWebpackPlugin({
      title: 'Pablo',
      template: 'src/index.html',
      inject: false
    }),

    new MiniCssExtractPlugin({
      filename: 'style.css'
    })

  ] // plugins

};
