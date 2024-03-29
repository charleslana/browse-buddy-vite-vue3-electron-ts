export {};

declare global {
  import { ThemeMode } from '@/electron/type/ThemeMode';

  interface Window {
    electronAPI: {
      changeTheme: (theme: ThemeMode) => void;
    };
  }
}
