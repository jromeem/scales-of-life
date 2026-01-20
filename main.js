const { app, BrowserWindow, ipcMain, powerSaveBlocker } = require('electron');
const path = require('path');
const fs = require('fs');

// Performance optimizations for Mac mini 2018 (Intel Core i3, UHD 630)
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('disable-frame-rate-limit');

let mainWindow;
let controlPanelWindow;
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

// Create control panel window (dev mode only)
function createControlPanel() {
  controlPanelWindow = new BrowserWindow({
    width: 500,
    height: 900,
    x: 100,
    y: 100,
    title: 'Tweaks Control Panel',
    backgroundColor: '#1a1a1a',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  controlPanelWindow.loadFile('src/control-panel.html');

  controlPanelWindow.on('closed', () => {
    controlPanelWindow = null;
  });
}

// IPC Handlers for control panel
ipcMain.handle('get-tweaks', async () => {
  // Read current tweaks from file
  const tweaksPath = path.join(__dirname, 'src', 'tweaks.jsx');
  const tweaksContent = fs.readFileSync(tweaksPath, 'utf8');

  // Extract TWEAKS object using regex
  const match = tweaksContent.match(/const TWEAKS = ({[\s\S]*?});/);
  if (match) {
    // Convert the JavaScript object literal to JSON-parseable format
    // This is a simple approach - we'll evaluate it safely
    const tweaksStr = match[1];
    // Use Function constructor to safely evaluate the object literal
    const TWEAKS = new Function(`return ${tweaksStr}`)();
    return TWEAKS;
  }

  return {};
});

ipcMain.on('update-tweaks', (event, tweaks) => {
  // Send updated tweaks to main window
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('tweaks-updated', tweaks);
  }
});

ipcMain.handle('save-tweaks', async (event, tweaks) => {
  try {
    const tweaksPath = path.join(__dirname, 'src', 'tweaks.jsx');

    // Read current file to preserve header comment
    const currentContent = fs.readFileSync(tweaksPath, 'utf8');
    const headerMatch = currentContent.match(/(\/\*\*[\s\S]*?\*\/)/);
    const header = headerMatch ? headerMatch[1] : '/**\n * TWEAKS.JSX\n */';

    // Format the tweaks object as a JavaScript file
    const formattedTweaks = formatTweaksObject(tweaks);

    const newContent = `${header}\n\nconst TWEAKS = ${formattedTweaks};\n\n// Export for use in app.jsx\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = TWEAKS;\n}\n`;

    fs.writeFileSync(tweaksPath, newContent, 'utf8');
    console.log('✅ Tweaks saved to file');

    return { success: true };
  } catch (error) {
    console.error('❌ Error saving tweaks:', error);
    throw error;
  }
});

// Helper function to format tweaks object with proper indentation
function formatTweaksObject(tweaks, indent = 0) {
  const spaces = ' '.repeat(indent);
  const innerSpaces = ' '.repeat(indent + 2);
  let result = '{\n';

  for (const [key, value] of Object.entries(tweaks)) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      result += `${innerSpaces}${key}: ${formatTweaksObject(value, indent + 2)},\n`;
    } else if (typeof value === 'string') {
      result += `${innerSpaces}${key}: '${value}',\n`;
    } else {
      result += `${innerSpaces}${key}: ${value},\n`;
    }
  }

  result += `${spaces}}`;
  return result;
}

app.whenReady().then(() => {
  createWindow();

  // Create control panel in development mode
  if (process.env.NODE_ENV === 'development') {
    createControlPanel();
    console.log('🎨 Control Panel opened for styling tweaks');
  }

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
