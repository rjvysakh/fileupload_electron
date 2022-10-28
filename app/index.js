const { app, BrowserWindow, ipcMain, dialog } = require("electron");
// const electronReload = require('electron-reload')

const path = require("path");
const { PythonShell } = require("python-shell");

const notification = require("./main/notification");

// require('electron-reload')(__dirname, {
//     electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
//   });

// const {getCurrentWindow, globalShortcut} = require('electron').remote;

// local dependencies
const io = require("./main/io");
// const renderer = require( './render/js/renderer' );

// open a window
const openWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  io.emptyFile(path.resolve(__dirname, "render/html/output.html"));

  // load `index.html` file
  win.loadFile(path.resolve(__dirname, "render/html/index.html"));

  /*-----*/

  return win; // return window
};

// when app is ready, open a window
app.on("ready", () => {
  const win = openWindow();

  // watch files
  io.watchFiles(win);
});

// when all windows are closed, quit the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// when app activates, open a window
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    openWindow();
  }
});

/************************/

// return list of files
ipcMain.handle("app:get-files", () => {
  return io.getFiles();
});

// listen to file(s) add event
ipcMain.handle("app:on-file-add", (event, files = []) => {
  if (files.length > 1 || io.getFileCount() > 0) {
    notification.removeFile();
  } else {
    const format = files[0].name.split(".").pop();
    if (format === "mp4" || format === "mkv" || format === "avi") {
      io.addFiles(files);
    } else {
      notification.wrongFormat();
    }
  }
});

// open filesystem dialog to choose files
ipcMain.handle("app:on-fs-dialog-open", (event) => {
  const files = dialog.showOpenDialogSync({
    properties: ["openFile", "multiSelections"],
  });

  if (files !== undefined)
    if (files.length > 1 || io.getFileCount() > 0)
      notification.removeFile(files.length);
    else {
      files.map((filepath) => {
        const format = filepath.split(".").pop();
        if (format === "mp4" || format === "mkv" || format === "avi") {
          io.addFiles([
            {
              name: path.parse(filepath).base,
              path: filepath,
            },
          ]);
        } else {
          notification.wrongFormat();
        }
      });
    }
});

/*-----*/

// listen to file delete event
ipcMain.on("app:on-file-delete", (event, file) => {
  io.deleteFile(file.filepath);
});

// listen to file open event
ipcMain.on("app:on-file-open", (event, file) => {
  io.openFile(file.filepath);
});

// listen to file copy event
ipcMain.on("app:on-file-copy", (event, file) => {
  event.sender.startDrag({
    file: file.filepath,
    icon: path.resolve(__dirname, "./resources/paper.png"),
  });
});

ipcMain.handle("app:on-run-python", (event) => {
  io.addLoader(path.resolve(__dirname, "render/html/output.html"));
  event.sender.reload();
  let pyshell = new PythonShell("./app/main/python/script.py");

  pyshell.on("message", (message) => console.log(message));

  pyshell.end((err) => {
    if (err) throw err;
    event.sender.reload();
  });
});
