import Store from 'electron-store';
import { ThemeModeType } from '../types/ThemeModeType';

const store = new Store();

export function setThemeModePreference(mode: ThemeModeType): void {
  store.set('darkMode', mode);
}

export function getThemeModePreference(): ThemeModeType {
  const darkMode = store.get('darkMode') as ThemeModeType;
  return darkMode || 'system';
}

export function getUrlsPreference(): string[] {
  const urls = store.get('urls') as string[];
  return urls !== undefined ? urls : [];
}

export function addUrlPreference(url: string) {
  const urls = getUrlsPreference();
  if (!urls.includes(url)) {
    urls.unshift(url);
    setUrlsPreference(urls);
  }
}

export function deleteUrlPreference(url: string) {
  const urls = getUrlsPreference();
  const index = urls.indexOf(url);
  if (index !== -1) {
    urls.splice(index, 1);
    setUrlsPreference(urls);
  }
}

function setUrlsPreference(urls: string[]) {
  store.set('urls', urls);
}
