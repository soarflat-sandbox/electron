const { app, BrowserWindow, ipcMain } = require('electron');
const { optimize } = require('./imagemin');

// windowオブジェクトの参照を保持しておくため、ここで定義しておく
let win;

function createWindow() {
  // ブラウウィンドウを定義
  win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // アプリのindex.htmlを読み込む
  win.loadFile('index.html');

  // DevToolsを開く
  win.webContents.openDevTools();

  // ウィンドウが閉じられた時に発火
  win.on('closed', () => {
    // ウインドウオブジェクトの参照を外す。
    // 通常、マルチウインドウをサポートするときは、
    // 配列にウインドウを格納する。
    // ここは該当する要素を削除するタイミング。
    win = null;
  });

  ipcMain.on('ondrop', (event, filePath) => {
    optimize(filePath);
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // macOSでは、ユーザが Cmd + Q で明示的に終了するまで、
  // アプリケーションとそのメニューバーは有効なままにするのが一般的。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // macOSでは、ユーザがドックアイコンをクリックしたとき、
  // そのアプリのウインドウが無かったら再作成するのが一般的。
  if (win === null) {
    createWindow();
  }
});
