import { IAction } from './IAction';

export interface IRunTest {
  name: string;
  url: string;
  isSaveLastScreenshot: boolean;
  isSaveEveryScreenshot: boolean;
  isHeadless: boolean;
  defaultTimeout: number;
  actions: IAction[];
  repeat?: number;
}
