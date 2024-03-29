import { contextBridge, ipcRenderer } from 'electron';
import { ThemeModeType } from '../types/ThemeModeType';

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  changeTheme: (theme: ThemeModeType) => ipcRenderer.invoke('theme-mode:change', theme),
  runTest: (runTestJSON: string) => ipcRenderer.invoke('execute-run-test', runTestJSON),
  listenForResult: (callback: (result: string) => void) => {
    ipcRenderer.on('execute-run-test-result', (_event, result: string) => {
      callback(result);
    });
  },
});
