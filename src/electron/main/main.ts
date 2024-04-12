import path from 'path';
import { app, BrowserWindow, globalShortcut, Menu } from 'electron';
import { getAppIconPath } from './icon';
import { getMenu } from './menu';
import { handleOpenTestFile, handleSaveTestToFile } from './dialog';
import { handleRunTest } from './runTest';
import { handleSession } from './session';
import { handleThemeMode } from './theme';
import { handleUrlActions } from './url';

const isDev = process.env.npm_lifecycle_event === 'app:dev' ? true : false;

function createMenu(mainWindow: BrowserWindow): void {
  const template = getMenu(mainWindow);
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.openDevTools();
  });
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: getAppIconPath(),
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload/preload.js'),
    },
  });
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
    return;
  }
  mainWindow.loadURL(`file://${path.join(__dirname, '..', '..', 'index.html')}`);
  mainWindow.maximize();
  createMenu(mainWindow);
}

app.whenReady().then(() => {
  handleThemeMode();
  handleRunTest();
  handleSaveTestToFile();
  handleOpenTestFile();
  handleUrlActions();
  handleSession();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
