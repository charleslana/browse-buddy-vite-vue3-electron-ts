import { defineStore } from 'pinia';
import { IAction } from '@/electron/interface/IAction';
import { IRunTest } from '@/electron/interface/IRunTest';

export const runTestStore = defineStore('runTest', {
  state: (): { runTest: IRunTest } => ({
    runTest: {
      url: '',
      isSaveLastScreenshot: true,
      isSaveEveryScreenshot: true,
      actions: [],
    },
  }),
  actions: {
    saveRunTest(runTest: IRunTest): void {
      this.runTest = runTest;
    },
    saveUrl(url: string): void {
      this.runTest.url = url;
    },
    setIsSaveLastScreenshot(value: boolean): void {
      this.runTest.isSaveLastScreenshot = value;
    },
    setIsSaveEveryScreenshot(value: boolean): void {
      this.runTest.isSaveEveryScreenshot = value;
    },
    setActions(actions: IAction[]): void {
      this.runTest.actions = actions;
    },
    addAction(newAction: IAction): void {
      this.runTest.actions.push(newAction);
    },
    removeAction(actionId: string): void {
      this.runTest.actions = this.runTest.actions.filter(action => action.id !== actionId);
    },
    updateAction(updatedAction: IAction): void {
      const index = this.runTest.actions.findIndex(action => action.id === updatedAction.id);
      if (index !== -1) {
        this.runTest.actions[index] = updatedAction;
      }
    },
  },
});
