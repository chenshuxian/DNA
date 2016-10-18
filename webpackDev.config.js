var webpack = require('webpack');
var path = require('path');
// var publicJs = './public/js';
const JSCOMMON = './public/js/commons';
// var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
  // 此插件用於提取多個共用腳本，如 Jquery...
  // 然後生成一個 common.js 方更複用。
  // plugins: [commonsPlugin],
  plugins: [
    // 將共用的 js 提到一個 common.js 中
    new webpack.optimize.CommonsChunkPlugin('vender', 'jQuery.js'),
    //   name: 'vender',
    //   // minChunks: Infinity
    //   filename: 'commons.js'
    //   // chunks: ['jquery']
    // }),
    new webpack.ProvidePlugin(
      {
        $: 'jquery',
        'jQuery': 'jquery',
        'window.jQuery': 'jquery',
        'root.jQuery': 'jquery'
      }
  )
    // new HtmlWebpackPlugin({
    //    filename: 'index.jade',
    // }),
    // 腳本壓縮，壓縮大縮7成
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // })
  ],
  entry: {
    Dna: `./public/js/commons/core/DNA.js`,
    index: './public/js/line/lineSet/index.js',
    vender: ['jquery', 'easyui', 'easyuiCN']
  },
  output: {
    // path: './public/js/dev',
    path: 'F:\\newLMS\\src\\main\\webapp\\js',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  module: {
    loaders: [{test: /\.js$/, exclude: /(node_modules|public\\js\\commons\\jquery)/, loader: 'babel-loader'},
    {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'}, // use ! to chain loaders
    {test: /\.css$/, loader: 'style-loader!css-loader'},
    {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
    // {test: /^jquery/, loader: 'imports?jQuery=jquery'}
    // {test: require.resolve('$'), loader: 'expose?jQuery'}
    ]
  },
  resolve: {
    alias: {
      // jquery: `${publicJs}/commons/jQuery.js`,
      easyui: path.join(__dirname, `${JSCOMMON}/jquery/jquery.easyui.min.js`),
      const: path.join(__dirname, `${JSCOMMON}/core/const.js`),
      easyuiCN: path.join(__dirname, `${JSCOMMON}/jquery/locale/easyui-lang-zh_CN.js`)
      // mssage: path.join(__dirname, "public/js/commons/message.js"),
      // alert: path.join(__dirname, `${JSCOMMON}/jquery/jquery.alerts.js`),
      // ui: path.join(__dirname, `${JSCOMMON}/jquery/jquery-ui.js`)
    }
  },
  devtool: '#inline-source-map'
};
