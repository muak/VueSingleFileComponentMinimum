const Path = require('path');

module.exports = {  
  entry: {
    index: './src/index.js',
  },

  output: {
    filename: 'js/[name].bundle.js', // 出力ファイル名（パスも含めてOK）
    path: Path.resolve(__dirname, 'dist'), // 出力パス 要絶対パスなのでpathモジュールを使用
  },

  // 開発中はsourcemapを出力
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',

  module: {
    rules: [
      {
        // .vueファイルを読み込めるようにする
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js', //webpack使う場合はこっちを指定する https://jp.vuejs.org/v2/guide/installation.html#%E7%94%A8%E8%AA%9E
    },
  },

  devServer: {
    //webpack-dev-server document root設定
    contentBase: './dist',
  },
}
