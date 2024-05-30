import fs from 'fs';
import path from 'path';
import { BrowserWindow, app, shell } from 'electron';
import { saveSessionPreference } from '../utils/storeUtils';

export function getMenu(mainWindow: BrowserWindow) {
  const template: Electron.MenuItemConstructorOptions[] = [
    browseBuddyMenu(mainWindow),
    examplesMenu(mainWindow),
    helpMenu(mainWindow),
  ];
  return template;
}

function browseBuddyMenu(mainWindow: BrowserWindow): Electron.MenuItemConstructorOptions {
  const menu: Electron.MenuItemConstructorOptions = {
    label: 'Browse Buddy',
    submenu: [
      {
        label: 'Recarregar',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          mainWindow.reload();
        },
      },
      { type: 'separator' },
      {
        label: 'Fechar',
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
  const menu: Electron.MenuItemConstructorOptions = {
    label: 'Exemplos',
    submenu: [
      {
        label: 'Wait click',
        click: () => {
          const jsonData = loadJsonSync('1-Wait and click.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: 'Click',
        click: () => {
          const jsonData = loadJsonSync('2-Click.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: 'Fill',
        click: () => {
          const jsonData = loadJsonSync('3-Fill.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: 'Type',
        click: () => {
          const jsonData = loadJsonSync('4-Type.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: 'Clear',
        click: () => {
          const jsonData = loadJsonSync('5-Clear.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: 'Wait visible',
        click: () => {
          const jsonData = loadJsonSync('6-Wait visible.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: 'Wait hidden',
        click: () => {
          const jsonData = loadJsonSync('7-Wait hidden.json');
          saveSessionPreference(jsonData);
          mainWindow.reload();
        },
      },
      {
        label: 'Click wait response',
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
  const menu: Electron.MenuItemConstructorOptions = {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Documentação',
        click: () => {
          shell.openExternal('https://example.com');
        },
      },
      {
        label: 'GitHub',
        click: () => {
          shell.openExternal('https://example.com');
        },
      },
      {
        label: 'Discord',
        click: () => {
          shell.openExternal('https://example.com');
        },
      },
      {
        label: 'Reportar um problema',
        click: () => {
          shell.openExternal('https://example.com');
        },
      },
      { type: 'separator' },
      {
        label: 'Abrir DevTools',
        accelerator: 'CmdOrCtrl+Shift+I',
        click: () => {
          mainWindow.webContents.openDevTools();
        },
      },
      { type: 'separator' },
      {
        label: 'Sobre',
        click: createAboutWindow,
      },
    ],
  };
  return menu;
}

function createAboutWindow(): void {
  const aboutWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: 'Sobre',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
  });
  aboutWindow.loadURL(`file://${path.join(__dirname, '..', '..', 'index.html#about')}`);
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
