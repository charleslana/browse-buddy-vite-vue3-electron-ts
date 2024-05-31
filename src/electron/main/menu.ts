import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, Menu, shell } from 'electron';
import { createI18nInstance } from '../i18n/i18n';
import { saveSessionPreference } from '../utils/storeUtils';

let i18n = createI18nInstance();

export function getMenu(mainWindow: BrowserWindow) {
  const template: Electron.MenuItemConstructorOptions[] = [
    browseBuddyMenu(mainWindow),
    examplesMenu(mainWindow),
    helpMenu(mainWindow),
  ];
  return template;
}

export function updateMenu(mainWindow: BrowserWindow) {
  i18n = createI18nInstance();
  const menuTemplate = getMenu(mainWindow);
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

function browseBuddyMenu(mainWindow: BrowserWindow): Electron.MenuItemConstructorOptions {
  const t = i18n.global.t;
  const menu: Electron.MenuItemConstructorOptions = {
    label: 'Browse Buddy',
    submenu: [
      {
        label: t('reloadMenu'),
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          mainWindow.reload();
        },
      },
      { type: 'separator' },
      {
        label: t('closeMenu'),
        accelerator: 'CmdOrCtrl+W',
        click: () => {
          mainWindow.close();
        },
      },
    ],
  };
  return menu;
}

function examplesMenu(mainWindow: BrowserWindow): Electron.MenuItemConstructorOptions {
  const t = i18n.global.t;
  const menu: Electron.MenuItemConstructorOptions = {
    label: t('exampleMenu'),
    submenu: [
      {
        label: t('actionWaitClick'),
        click: () => {
          const jsonData = loadJsonSync('1-Wait and click.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: t('actionClick'),
        click: () => {
          const jsonData = loadJsonSync('2-Click.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: t('actionFill'),
        click: () => {
          const jsonData = loadJsonSync('3-Fill.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: t('actionType'),
        click: () => {
          const jsonData = loadJsonSync('4-Type.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: t('actionClear'),
        click: () => {
          const jsonData = loadJsonSync('5-Clear.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: t('actionWaitVisible'),
        click: () => {
          const jsonData = loadJsonSync('6-Wait visible.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: t('actionWaitHidden'),
        click: () => {
          const jsonData = loadJsonSync('7-Wait hidden.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: t('actionClickWaitResponse'),
        click: () => {
          const jsonData = loadJsonSync('8-Click wait response.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
    ],
  };
  return menu;
}

function helpMenu(mainWindow: BrowserWindow): Electron.MenuItemConstructorOptions {
  const t = i18n.global.t;
  const menu: Electron.MenuItemConstructorOptions = {
    label: t('helpMenu'),
    submenu: [
      {
        label: t('documentationMenu'),
        click: () => {
          shell.openExternal('https://github.com/charleslana/browse-buddy-vite-vue3-electron-ts');
        },
      },
      {
        label: 'GitHub',
        click: () => {
          shell.openExternal('https://github.com/charleslana/browse-buddy-vite-vue3-electron-ts');
        },
      },
      {
        label: 'Discord',
        click: () => {
          shell.openExternal('https://discord.gg/rWYTH7qNZ3');
        },
      },
      {
        label: t('issueMenu'),
        click: () => {
          shell.openExternal(
            'https://github.com/charleslana/browse-buddy-vite-vue3-electron-ts/issues'
          );
        },
      },
      { type: 'separator' },
      {
        label: t('openDevToolsMenu'),
        accelerator: 'CmdOrCtrl+Shift+I',
        click: () => {
          mainWindow.webContents.openDevTools();
        },
      },
      { type: 'separator' },
      {
        label: t('aboutMenu'),
        click: createAboutWindow,
      },
    ],
  };
  return menu;
}

function createAboutWindow(): void {
  const t = i18n.global.t;
  const aboutWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: t('aboutMenu'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
  });
  aboutWindow.loadURL(
    `file://${path.join(
      __dirname,
      '..',
      '..',
      `index.html#about?d=${t('developedBy')}&v=${t('version')}`
    )}`
  );
}

function loadJsonSync(fileName: string): string {
  const dataPath = path.join(getRootPath(), 'resources', 'examples', 'json', fileName);
  try {
    const data = fs.readFileSync(dataPath, 'utf-8');
    return data;
  } catch (err) {
    throw new Error(`Failed to load or parse JSON file: ${err}`);
  }
}

function getRootPath() {
  return app.isPackaged ? process.resourcesPath : '';
}
