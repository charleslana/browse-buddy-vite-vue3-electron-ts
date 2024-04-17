import { defineStore } from 'pinia';
import { IAction } from '@/electron/interface/IAction';
import { IRunTest } from '@/electron/interface/IRunTest';

export const runTestStore = defineStore('runTest', {
  state: (): { runTest: IRunTest } => ({
    runTest: {
      name: 'Teste de Exemplo',
      url: '',
      isSaveLastScreenshot: true,
      isSaveEveryScreenshot: true,
      isHeadless: true,
      defaultTimeout: 15000,
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
    setIsSaveHeadless(value: boolean): void {
      this.runTest.isHeadless = value;
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
    filterEnabledActions(): IRunTest {
      const enabledActions = this.runTest.actions.filter(action => action.disabled !== true);
      return { ...this.runTest, actions: enabledActions };
    },
    toggleActionStatus(actionId: string): void {
      const index = this.runTest.actions.findIndex(action => action.id === actionId);
      if (index !== -1) {
        this.runTest.actions[index].disabled = !this.runTest.actions[index].disabled;
      }
    },
    toggleActionVisible(actionId: string): void {
      const index = this.runTest.actions.findIndex(action => action.id === actionId);
      if (index !== -1) {
        const isVisible =
          this.runTest.actions[index].isVisible !== undefined
            ? this.runTest.actions[index].isVisible
            : true;
        this.runTest.actions[index].isVisible = !isVisible;
      }
    },
    setDefaultTimeout(defaultTimeout: number): void {
      this.runTest.defaultTimeout = defaultTimeout;
    },
  },
});
