import { INavigationResult } from './electron/interface/INavigationResult';

export {};

declare global {
  import { ThemeMode } from '@/electron/type/ThemeMode';

  interface Window {
    electronAPI?: {
      changeTheme: (theme: ThemeMode) => void;
      runTest: (runTestJSON: string) => void;
      listenForResult: () => Promise<INavigationResult[]>;
    };
  }
}
