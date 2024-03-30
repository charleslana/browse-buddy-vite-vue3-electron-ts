import { contextBridge, ipcRenderer } from 'electron';
import { ThemeModeType } from '../types/ThemeModeType';
import { INavigationResult } from '../interface/INavigationResult';

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
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
