import { BrowserWindow, shell } from 'electron';
import path from 'path';

export function getMenu(mainWindow: BrowserWindow) {
  const template: Electron.MenuItemConstructorOptions[] = [
    browseBuddyMenu(mainWindow),
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
