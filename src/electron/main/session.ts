import { ipcMain } from 'electron';
import {
  saveSessionPreference,
  deleteSessionPreference,
  getSessionPreference,
} from '../utils/storeUtils';

export function handleSession(): void {
  ipcMain.handle('session:get', () => getSessionPreference());
  ipcMain.handle('session:save', (_event, runTestJSON: string) =>
    saveSessionPreference(runTestJSON)
  );
  ipcMain.handle('session:delete', () => deleteSessionPreference());
}
