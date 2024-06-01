import Store from 'electron-store';
import { IRunTest } from '../interface/IRunTest';
import { mainWindow } from '../main/main';
import { SupportedLanguagesType } from '../types/SupportedLanguagesType';
import { ThemeModeType } from '../types/ThemeModeType';
import { updateMenu } from '../main/menu';

const store = new Store();

const darkModeKey = 'darkMode';
const urlsKey = 'urls';
const sessionKey = 'session';
const langKey = 'lang';

export function setThemeModePreference(mode: ThemeModeType): void {
  store.set(darkModeKey, mode);
}

export function getThemeModePreference(): ThemeModeType {
  const darkMode = store.get(darkModeKey) as ThemeModeType | undefined;
  return darkMode || 'system';
}

export function getUrlsPreference(): string[] {
  const urls = store.get(urlsKey) as string[] | undefined;
  return urls !== undefined ? urls : [];
}

export function addUrlPreference(url: string): void {
  const urls = getUrlsPreference();
  if (!urls.includes(url)) {
    urls.unshift(url);
    setUrlsPreference(urls);
  }
}

export function deleteUrlPreference(url: string): void {
  const urls = getUrlsPreference();
  const index = urls.indexOf(url);
  if (index !== -1) {
    urls.splice(index, 1);
    setUrlsPreference(urls);
  }
}

function setUrlsPreference(urls: string[]) {
  store.set(urlsKey, urls);
}

export function getSessionPreference(): IRunTest | undefined {
  const session = store.get(sessionKey) as IRunTest | undefined;
  return session;
}

export function saveSessionPreference(runTestJSON: string): void {
  const runTest: IRunTest = JSON.parse(runTestJSON);
  delete runTest.repeat;
  store.set(sessionKey, runTest);
}

export function deleteSessionPreference(): void {
  store.delete(sessionKey);
}

export function setLangPreference(lang: SupportedLanguagesType): void {
  store.set(langKey, lang);
  updateMenu(mainWindow);
}

export function getLangPreference(): SupportedLanguagesType | undefined {
  const lang = store.get(langKey) as SupportedLanguagesType | undefined;
  return lang;
}
