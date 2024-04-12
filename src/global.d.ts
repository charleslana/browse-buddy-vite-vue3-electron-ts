import { INavigationResult } from './electron/interface/INavigationResult';
import { IRunTest } from './electron/interface/IRunTest';
import { ThemeMode } from '@/electron/type/ThemeMode';

export {};

declare global {
  interface Window {
    electronAPI?: {
      saveFile: (dataJSON: string) => Promise<string | undefined>;
      openFile: () => Promise<string | undefined>;
      changeTheme: (theme: ThemeMode) => void;
      runTest: (runTestJSON: string) => void;
      listenForResult: () => Promise<INavigationResult[]>;
      getUrls: () => Promise<string[]>;
      addUrl: (url: string) => Promise<void>;
      deleteUrl: (url: string) => Promise<void>;
      getSession: () => Promise<IRunTest | undefined>;
      saveSession: (runTestJSON: string) => Promise<void>;
      deleteSession: () => Promise<void>;
    };
  }
}
