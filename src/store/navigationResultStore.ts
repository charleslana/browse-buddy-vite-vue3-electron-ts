import { defineStore } from 'pinia';
import { INavigationResult } from '@/electron/interface/INavigationResult';

export const navigationResultStore = defineStore('navigationResult', {
  state: (): { navigationResult: INavigationResult[] } => ({
    navigationResult: [],
  }),
  actions: {
    save(navigationResult: INavigationResult[]): void {
      this.navigationResult = navigationResult;
    },
  },
});
