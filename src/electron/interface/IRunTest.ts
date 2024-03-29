import { IAction } from './IAction';

export interface IRunTest {
  url: string;
  isSaveLastScreenshot: boolean;
  isSaveEveryScreenshot: boolean;
  actions: IAction[];
}
