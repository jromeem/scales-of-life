const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    backgroundColor: '#000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  mainWindow.loadFile('src/index.html');

  // Open DevTools in development (comment out for production)
  // mainWindow.webContents.openDevTools();

  // Press ESC to quit (useful for installations)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape') {
      app.quit();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle predator activation from hardware button
// You can extend this to listen to GPIO pins or serial port
ipcMain.on('predator-activate', (event) => {
  mainWindow.webContents.send('predator-trigger');
});
