import logger from '../utils/logger';
import path from 'path';
import { app, BrowserWindow, dialog, globalShortcut, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import { getAppIconPath } from './icon';
import { getMenu } from './menu';
import { handleLang } from './lang';
import { handleOpenTestFile, handleSaveTestToFile } from './dialog';
import { handleRunTest } from './runTest';
import { handleSaveReport } from './report';
import { handleSession } from './session';
import { handleThemeMode } from './theme';
import { handleUrlActions } from './url';
import { createI18nInstance } from '../i18n/i18n';

export let mainWindow: BrowserWindow;

const isDev = process.env.npm_lifecycle_event === 'app:dev' ? true : false;

const i18n = createI18nInstance();
const t = i18n.global.t;

function createMenu(mainWindow: BrowserWindow): void {
  const template = getMenu(mainWindow);
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.openDevTools();
  });
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
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
  handleLang();
  handleSaveReport();
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
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

autoUpdater.on('update-available', () => {
  logger.info('Update available.');
  dialog.showMessageBox({
    type: 'info',
    title: t('updateAvailableTitle'),
    message: t('updateAvailableMessage'),
  });
});

autoUpdater.on('update-downloaded', () => {
  logger.info('Update downloaded; will install in 5 seconds');
  dialog
    .showMessageBox({
      type: 'info',
      title: t('updateReadyTitle'),
      message: t('updateReadyMessage'),
      buttons: [t('updateYesButton'), t('updateLaterButton')],
    })
    .then(result => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall(false, true);
      }
    });
});
