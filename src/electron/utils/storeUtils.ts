import Store from 'electron-store';
import { ThemeModeType } from '../types/ThemeModeType';

const store = new Store();

export function setThemeModePreference(mode: ThemeModeType) {
  store.set('darkMode', mode);
}

export function getThemeModePreference(): ThemeModeType {
  const darkMode = store.get('darkMode') as ThemeModeType;
  return darkMode || 'system';
}
