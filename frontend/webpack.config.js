const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'  // Memastikan postcss-loader digunakan
        ],
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /url/, // Jika menggunakan `?url`
            use: 'file-loader',
          },
          {
            use: '@svgr/webpack',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i, // Tambahkan dukungan untuk PNG, JPG, dan GIF
        type: 'asset/resource',
      },
      
      
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, 'public'),
    historyApiFallback: true,
    port: 3001,
  },
};
