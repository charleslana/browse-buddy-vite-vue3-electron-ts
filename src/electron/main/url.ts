import { addUrlPreference, deleteUrlPreference, getUrlsPreference } from '../utils/storeUtils';
import { ipcMain } from 'electron';

export function handleUrlActions(): void {
  ipcMain.handle('urls:get', () => getUrlsPreference());
  ipcMain.handle('urls:add', (_event, url: string) => addUrlPreference(url));
  ipcMain.handle('urls:delete', (_event, url: string) => deleteUrlPreference(url));
}
