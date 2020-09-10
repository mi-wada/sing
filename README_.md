# ES Editor

## 開発の方針

* Dockerを用いてローカルで実装を行い、ミニマムな開発単位でコミット・PRを行う
* 大規模なフレームワークやドメイン駆動は利用せず、シンプルかつスピーディな実装が行えるようなフレームワークやライブラリを選定する

## 開発環境

* node.js 11.14.*
* MySQL 8.0.*

## 利用するフレームワーク、ライブラリ、ツール

|名前|用途|選定理由|
|:---|:---|
|sails|nodejsのフレームワーク|socket.ioを標準搭載しており，リアルタイム通信が容易に実装できるため|
|vue.js|フロントエンドのフレームワーク|学習目的|


### ローカルの開発環境を起動する

sails liftによって1337ポートでwebサーバが起動される．

### コードを実装する

コントローラ: sails generate controller {ControllerName} によって，api/controllersにControllerName.jsが作成される.
モデル: sails generate model {ModelName} によって，api/modelsにModelName.jsが作成される.
ビュー: viewsに実装
ルーティング: config/routes.jsに記述.


## コーディング規約

* ファイルは全てUTF-8

### js

* インデントは4スペース

### HTML, CSS等

* インデントは2スペース

### 命名規約

|種類|表記|例|
|:---|:---|:---|
|オートロード対象のPHPのファイル、ディレクトリ|ロウアーケース|controller/hogesample.js|
|上記以外のファイル、ディレクトリ|スネークケース|public/css/hoge_sample.css|
|クラス|パスカルケース|SampleClass|
|プロパティ|キャメルケース|sampleProperty|
|メソッド|キャメルケース|sampleMethod()|
