const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 1000
  })

  win.loadFile('public/index.html');
  win.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
});