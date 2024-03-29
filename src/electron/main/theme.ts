import { ipcMain, nativeTheme } from 'electron';
import { ThemeMode } from '../type/ThemeMode';

export function handleThemeMode(): void {
  ipcMain.handle('theme-mode:change', (_event, theme: ThemeMode) => changeThemeMode(theme));
}

function changeThemeMode(theme: ThemeMode): void {
  nativeTheme.themeSource = theme;
}
