# なるべく最小の Vue.js単一ファイルコンポーネント 環境構築

## フォルダ構成

* project root
	* dist
		* js
			* index.bundle.js
		* css
			* site.css
		* images
		* index.html
	* src
		* components
			* hoge.vue
		* stylus
			* site.styl
		* index.js
	* project.json
	* webpack.config.js

## 手順

* project初期化
	* ``npm init``
	* 全部enterで問題なし
	* licenseだけはちょっと気をつける
	* package.jsonが生成される
* 開発専用パッケージインストール
	* ``npm i -D webpack webpack-cli webpack-dev-server vue-loader vue-template-compiler css-loader npm-run-all``
* AltCssのパッケージインストール（ここではstylus利用）
	* ``npm i -D stylus stylus-loader autoprefixer-stylus``
* 依存パッケージインストール
	* ``npm i -S vue ress``
* webpack.config.jsを作成
* package.jsonにスクリプトを追加
* いくつかの適当なソースを用意する
	* html（index.html）
	* stylus（site.styl）
	* 単一ファイルコンポーネント（hoge.vue）
	* エントリポイントのjs（index.js）


### パッケージ1行メモ

* webpack
	* webpack本体。バンドル化 Vue単一ファイルコンポーネントに必要。
* webpack-cli
	* webpack v4から必須。
* webpack-dev-server
	* 開発用Webサーバー。なくても良いけど便利なのであった方が良い。
* vue-loader
	* webpackにvueを読み込むもの。
* vue-template-compiler
	* vueテンプレートのコンパイラ。単一ファイルコンポーネントに必要。
* css-loader
	* webpackにcssを読み込むもの。単一ファイルコンポーネントに必要。
* stylus
	* AltCssのStylus。
* stylus-loader
	* webpackでstylusを読み込むもの。
* autoprefixer-stylus
	* stylusのプラグインでベンダープレフィックスを付けてくれる。
* vue
	* Vue.js本体。
* ress
	* リセットcss。別になんでも良い。
* npm-run-all
	* npmスクリプトを並列処理したり直列処理したりするもの。

## webpack.config.js

```js
const Path = require('path');

module.exports = {  
  entry: {
    index: './src/index.js',
  },

  output: {
    filename: 'js/[name].bundle.js', // 出力ファイル名（パスも含めてOK） [name]でentryの名前が入る
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

```



## package.json スクリプト

```js
"scripts": {
    "dev:css": "stylus -w --include-css src/stylus/site.styl -o dist/css -u autoprefixer-stylus",
    "dev:js": "webpack-dev-server --hot --inline --mode development",
	"devAll": "run-p dev:*",
	"build:css": "stylus -c --include-css src/stylus/site.styl -o dist/css -u autoprefixer-stylus",
	"build:js": "NODE_ENV=production webpack --mode production",
	"buildAll": "run-s build:*"
  },
```

### 各スクリプトの意味

* dev:css
	* site.stylを監視(-w)して生cssをimport可能に(--include-css)してdist/cssに出力し(-o)、その際autoprefixerを使う(-u)ようにしてstylusを実行。
* build:css
	* dev:cssに加えてcssを圧縮(-c)するようにする。監視はしない。
* dev:js
	* webpack-dev-serverを変更即反映(--hot)するようにしてinlineで開発モード(-mode development)で起動する
* build:js
	* production環境変数を渡しつつwebpackを本番モード(-mode production)で実行する
* devAll
	* dev:で始まるスクリプトを並列実行する
* buildAll
	* build:で始まるスクリプトを順番に実行する

## いくつかの適当なソースを用意する

### index.html

```html
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/css/site.css" />
  <title>Vue.js 単一ファイルコンポーネント サンプル</title>
</head>

<body>
  <div id="app">
	<header id="header">Vue.js 単一ファイルコンポーネント サンプル</header>
	<div id="main">
		<p>メインですよ</p>
		<hoge></hoge>
	</div>
	<footer id="footer">&copy; 2018 hoge</footer>
  </div>
  <script src="/js/index.bundle.js"></script>
</body>

</html>
```

bodyはvueの要素にできないので注意。

### site.styl

```styl
@import "../../node_modules/ress/dist/ress.min.css"
@import "_pccs"
#header
  background-color: $ltg14
  height: 50px
  width: 100%
  padding: 8px
  color: $W
#main
  margin: 0 auto
  width: 1024px
  padding: 1em
  color: $Gy40
#footer
  background-color: $Gy80
  width: 100%
  padding: 1em
  text-align: center
  color: $Bk
```

※ _pccsはPCCSカラーシステムの変数を定義したファイル

### hoge.vue

```html
<template>
  <div>
    <img src="/images/color_analyzer.svg" alt="" width="30" height="30"><br>
    <button class="hoge_button" @click="onClick()">{{text}}</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: 'hoge'
    }
  },
  methods: {
    onClick(){
      this.text += 'hoge';
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/_pccs'

.hoge_button
  background-color: $lt6
  border-radius: 3px
  padding: 3px
</style>
```

外部のcssもインポート可能。

### index.js

```js
import Vue from 'vue';
import Hoge from './components/hoge'

new Vue({
  el: '#app',
  components:{'hoge':Hoge},
});
```

読み込んだコンポーネントをhogeタグとして登録する。必ず小文字を指定する。変数名とタグ名は一致する必要はない。

## スクリプト実行して開発

``npm run devAll``

を実行するとwebサーバーを起動しつつstylファイルも監視してコンパイルするようになるので、後はひたすらコードを書いていく。

## 本番用ビルド

``npm run buildAll``

これでいろいろ最適化されたものが出力される。