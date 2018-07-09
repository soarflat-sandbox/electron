# electron

## ボイラプレートと CLI

- [Electron Forge](https://electronforge.io/)
- [electron-builder](https://github.com/electron-userland/electron-builder)

## Electron アプリケーションアーキテクチャ

Electron で以下の重要な 2 つのプロセスタイプについて理解する。

- メインプロセス
- レンダラープロセス

### メインプロセス

`package.json` の `main` で指定されたスクリプトを実行するプロセス。

Electron アプリには常に 1 つのメインプロセスがあり、必ず 1 つしか存在しない。

### レンダラープロセス

Electron における各ウェブページはそれぞれの動作しているプロセス。

Electron はウェブページを表示するために Chromium を利用しているため、Chromium のマルチプロセスアーキテクチャも利用される。

### メインプロセスとレンダラープロセスの違い

メインプロセスは`BrowserWindow`インスタンスを作成してウェブページを作成する。

各`BrowserWindow`インスタンスは、独自のレンダラープロセスでウェブページを実行する。`BrowserWindow`インスタンスが破棄されると、対応するレンダラープロセスも終了する。

メインプロセスは、すべてのウェブページとそれに対応するレンダラープロセスを管理する。各レンダラープロセスは独立しており、その中で実行されているウェブページのみに注力する。

ウェブページでは、ネイティブ GUI 関連の API を呼び出すことは許可されてない。これは、**ウェブページがネイティブ GUI リソースを管理することは非常に危険であり、リソースをリークさせるのは容易いから**である。

ウェブページで GUI 操作を実行する場合、ウェブページのレンダラープロセスはメインプロセスと通信して、メインプロセスがそれらの操作を実行するよう要求する必要がある。

### Electron API を利用する

Electron は、メインプロセスとレンダラープロセスの両方でデスクトップアプリケーションの開発をサポートするいくつかの API を提供している。

両方のプロセスで Electron の API にアクセスするには、それが含まれているモジュールが必要。

```js
const electron = require('electron');
```

すべての Electron API にはプロセスタイプが割り当てられている。

それらの多くはメインプロセスからのみ利用できる。また、レンダラープロセスからのものや、両方から利用できる API もある。

個々の API のドキュメントには、どのプロセスから利用できるかが記述されている。

たとえば、Electron のウィンドウは`BrowserWindow`クラスを利用して作成されます。これはメインプロセスでのみ利用可能。

```js
// これはメインプロセスでは動作するが
// レンダラプロセスでは `undefined` になる
const { BrowserWindow } = require('electron');

const win = new BrowserWindow();
```

プロセス間の通信が可能であるため、レンダラープロセスはメインプロセスを呼び出してタスクを実行できる。

Electron には`remote`というモジュールがあり、通常はメインプロセスでのみ利用可能な API を公開している。レンダラープロセスから`BrowserWindow`を作成するには、`remote`を仲介者として利用する。

```js
// これはレンダラープロセスでは動作するが
// メインプロセスでは `undefined` になる
const { remote } = require('electron');
const { BrowserWindow } = remote;

const win = new BrowserWindow();
```

### Node.js API を利用する

Electron は、メインプロセスとレンダラープロセスの両方で Node.js へのフルアクセスを公開している。これには 2 つの重要な意味がある。

1.  Node.js で利用できるすべての API は Electron で利用できる。Electron アプリから以下のコードを呼ぶと動作する。

```js
const fs = require('fs');

const root = fs.readdirSync('/');

// これで、ディスクのルートレベル ( '/' か 'C:\')
// のすべてのファイルが出力されます。
console.log(root);
```

リモートコンテンツをロードにはセキュリティに大きな影響を与える可能性があるため、[セキュリティドキュメント](https://github.com/electron/i18n/blob/master/content/ja-JP/docs/tutorial/security.md)（リモートコンテンツの読み込みに関する詳細とガイダンス）を一読する。

2.  アプリケーションで npm モジュールを利用できる。

たとえば、アプリケーションで公式の AWS SDK を利用するには、まずそれを依存関係としてインストールする。

```bash
npm install --save aws-sdk
```

次に、Electron アプリケーションで、モジュールを要求して利用します。

```js
// S3 クライアントの準備
const S3 = require('aws-sdk/clients/s3');
```

ネイティブな Node.js モジュール (ネイティブコードのコンパイルが必要なモジュール) は、Electron と一緒に使用するためにコンパイルする必要があるため、注意。

Node.js モジュールの大部分はネイティブではなく、650.000 のモジュールのうち 400 個だけがネイティブである。

ただし、ネイティブモジュールが必要な場合は、「[ネイティブの Node モジュールを使用する](https://github.com/electron/i18n/blob/master/content/ja-JP/docs/tutorial/using-native-node-modules.md)」を参照する。
