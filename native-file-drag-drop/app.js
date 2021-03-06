document.ondragover = e => e.preventDefault();
document.ondrop = e => e.preventDefault();

const drag = document.getElementById('drag');

drag.ondragover = e => e.preventDefault();
drag.ondragleave = e => e.preventDefault();
drag.ondragend = e => e.preventDefault();
drag.ondrop = e => {
  e.preventDefault();

  for (let file of e.dataTransfer.files) {
    // `ipcRenderer` はレンダラープロセスからメインプロセスに非同期通信をするモジュール
    // `ipcRenderer.send(channel[, arg1][, arg2][, ...])は
    // `channel` を介して非同期でメインプロセスにメッセージを送る。任意の引数を送ることもできる。
    // 引数は内部で JSON にシリアライズされるので、関数やプロトタイプチェーンは含まれない。
    // メインプロセスは `ipcMain` で `channel` を listen してそれを処理する。
    // 今回の場合 `ipcMain.on('ondragstart', (...) => {` みたいな処理になる。
    console.log(file);
    require('electron').ipcRenderer.send('ondrop', file.path);
  }

  // return false;がないと動かない?（よくわかっていない）
  // https://github.com/react-dropzone/react-dropzone/issues/74
  return false;
};
