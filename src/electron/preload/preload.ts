import { contextBridge, ipcRenderer } from 'electron';
import { INavigationResult } from '../interface/INavigationResult';
import { ThemeModeType } from '../types/ThemeModeType';

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:open-file'),
  saveFile: (dataJSON: string) => ipcRenderer.invoke('dialog:save-file', dataJSON),
  changeTheme: (theme: ThemeModeType) => ipcRenderer.invoke('theme-mode:change', theme),
  runTest: (runTestJSON: string) => ipcRenderer.invoke('execute-run-test', runTestJSON),
  listenForResult: (): Promise<INavigationResult[]> => {
    return new Promise((resolve, reject) => {
      ipcRenderer.on('execute-run-test-result', (_event, result: INavigationResult[]) => {
        resolve(result);
      });
      ipcRenderer.on('execute-run-test-error', (_event, error: Error) => {
        reject(error);
      });
    });
  },
});
