import { INavigationResult } from './electron/interface/INavigationResult';
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
    };
  }
}
