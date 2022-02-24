/**
 * @name 移动端H5应用打包配置文件
 */

const path = require('path');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
];


module.exports = {
  devServer: {
    static: { 
      directory: path.resolve(__dirname, './assets'), 
      publicPath: '/assets'
    }
  },
  watch: true,
  devtool: 'source-map',
  name: 'bbb',
  mode: isProduction ? 'production' : 'development',
  stats: {
    children: false, chunks: false, assets: false, modules: false,
  },
  context: path.resolve(''),
  entry: {
    app: [
      path.resolve('index.js')
      // isProduction ? null : 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
      // 'babel-polyfill',
    ].filter(v => v),
  },
  output: {
    path: path.resolve('dist'),
    filename: isProduction ? '[name]-[chunkhash].js' : '[name].js',
    // chunkFilename: isProduction ? '[name]-[chunkhash].js' : '[name].js',
    publicPath: '',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          chunks: 'all',
          name: 'common',
          // 仅将node_modules中的代码独立打包成一份common.js
          // 并且不包含common的css
          // 为什么仅包含node_modules ?  https://webpack.js.org/guides/caching/
          test: /[\\/]node_modules[\\/].+\.(js|jsx)$/,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
    template: path.resolve('index.cshtml'),
    }),
    // new HardSourceWebpackPlugin(),
    new webpack.ProgressPlugin(),
  ].concat(isProduction ? proPlugins : devPlugins),
  module: {
    rules: [
      {
        // jsx 以及js
        test: /\.(js|jsx)$/,
        // include: [
        //   /score/,
        //   /scorePlay/,
        //   /src/,
        // ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          },
        ],
      },
      {
        // 图片类型模块资源访问
        test: /\.(png|jpg|jpeg|gif|webp|bmp|ico|jpeg|musicxml)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './images/[hash].[ext]',
            },
          },
        ].filter(v => !!v),
      },
 
      {
        test: /\.(css|scss)$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
       
      },
      // {
      //   // url类型模块资源访问
      //   test: new RegExp(`\\${[
      //     '.psd', // Image formats
      //     '.m4v', '.mov', '.mp4', '.mpeg', '.mpg', '.webm', // Video formats
      //     '.aac', '.aiff', '.caf', '.m4a', '.mp3', '.wav', // Audio formats
      //     '.html', '.pdf', // Document formats
      //     '.woff', '.woff2', '.woff', '.woff2', '.eot', '.ttf', //icon font
      //     '.svg',
      //   ].join('$|\\')}$`),
      //   loader: 'url-loader',
      //   query: {
      //     name: '[hash].[ext]',
      //     limit: 10000,
      //   },
      // },
    ],
  },
};
