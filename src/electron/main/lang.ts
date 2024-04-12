import { getLangPreference, setLangPreference } from '../utils/storeUtils';
import { ipcMain } from 'electron';
import { SupportedLanguagesType } from '../types/SupportedLanguagesType';

export function handleLang(): void {
  ipcMain.handle('lang:get', () => getLangPreference());
  ipcMain.handle('lang:set', (_event, lang: SupportedLanguagesType) => setLangPreference(lang));
}
