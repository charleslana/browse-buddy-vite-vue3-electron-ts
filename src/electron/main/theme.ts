import { getThemeModePreference, setThemeModePreference } from '../utils/storeUtils';
import { ipcMain, nativeTheme } from 'electron';
import { ThemeModeType } from '../types/ThemeModeType';

export function handleThemeMode(): void {
  ipcMain.handle('theme-mode:change', (_event, theme: ThemeModeType) => changeThemeMode(theme));
  const getThemeMode = getThemeModePreference();
  nativeTheme.themeSource = getThemeMode;
}

function changeThemeMode(theme: ThemeModeType): void {
  nativeTheme.themeSource = theme;
  setThemeModePreference(theme);
}
