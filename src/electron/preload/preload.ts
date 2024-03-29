import { contextBridge, ipcRenderer } from 'electron';
import { ThemeMode } from '../type/ThemeMode';

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  changeTheme: (theme: ThemeMode) => ipcRenderer.invoke('theme-mode:change', theme),
});
