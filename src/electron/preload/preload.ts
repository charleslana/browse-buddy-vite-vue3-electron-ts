import { contextBridge, ipcRenderer } from 'electron';
import { INavigationResult } from '../interface/INavigationResult';
import { IRunTest } from '../interface/IRunTest';
import { ThemeModeType } from '../types/ThemeModeType';

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:open-file'),
  saveFile: (dataJSON: string) => ipcRenderer.invoke('dialog:save-file', dataJSON),
  changeTheme: (theme: ThemeModeType) => ipcRenderer.invoke('theme-mode:change', theme),
  runTest: (runTestJSON: string) => ipcRenderer.invoke('execute-run-test', runTestJSON),
  listenForResult: listenForResult,
  getUrls: (): Promise<string[]> => ipcRenderer.invoke('urls:get'),
  addUrl: (url: string): Promise<void> => ipcRenderer.invoke('urls:add', url),
  deleteUrl: (url: string): Promise<void> => ipcRenderer.invoke('urls:delete', url),
  getSession: (): Promise<IRunTest> => ipcRenderer.invoke('session:get'),
  saveSession: (runTestJSON: string): Promise<void> =>
    ipcRenderer.invoke('session:save', runTestJSON),
  deleteSession: (): Promise<void> => ipcRenderer.invoke('session:delete'),
});

function listenForResult(): Promise<INavigationResult[]> {
  return new Promise((resolve, reject) => {
    ipcRenderer.on('execute-run-test-result', (_event, result: INavigationResult[]) => {
      resolve(result);
    });
    ipcRenderer.on('execute-run-test-error', (_event, error: Error) => {
      reject(error);
    });
  });
}
