const { app, BrowserWindow, ipcMain, powerSaveBlocker } = require('electron');
const path = require('path');

// Performance optimizations for Mac mini 2018 (Intel Core i3, UHD 630)
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('disable-frame-rate-limit');

let mainWindow;
let powerSaveBlockerId;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: false,
    frame: true,
    backgroundColor: '#000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      // Performance optimizations for Mac mini (Intel UHD 630)
      hardwareAcceleration: true,
      backgroundThrottling: false,
      // Optimize for video playback
      offscreen: false
    },
    // Optimize window performance
    show: false
  });

  // Show window when ready to prevent white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadFile('src/index.html');

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
    console.log('🔥 Development mode - DevTools opened');

    // Watch for file changes and reload
    const fs = require('fs');
    const srcPath = path.join(__dirname, 'src');

    fs.watch(srcPath, { recursive: true }, (eventType, filename) => {
      if (filename && (filename.endsWith('.jsx') || filename.endsWith('.html') || filename.endsWith('.css'))) {
        console.log(`📝 File changed: ${filename} - reloading...`);
        mainWindow.reload();
      }
    });
  }

  // Press ESC to quit (useful for installations)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape') {
      app.quit();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    // Stop preventing sleep when window closes
    if (powerSaveBlockerId && powerSaveBlocker.isStarted(powerSaveBlockerId)) {
      powerSaveBlocker.stop(powerSaveBlockerId);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Prevent system from going to sleep during installation
  powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep');
  console.log('💤 Sleep prevention enabled for installation');
});

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
