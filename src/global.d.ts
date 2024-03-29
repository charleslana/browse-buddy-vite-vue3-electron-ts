export {};

declare global {
  import { ThemeMode } from '@/electron/type/ThemeMode';

  interface Window {
    electronAPI: {
      changeTheme: (theme: ThemeMode) => void;
      runTest: (runTestJSON: string) => void;
      listenForResult: (callback: (result: string) => void) => void;
    };
  }
}
