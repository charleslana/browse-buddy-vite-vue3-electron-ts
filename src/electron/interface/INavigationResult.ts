import { ActionType } from '../types/ActionType';

export interface INavigationResult {
  action: ActionType;
  title: string;
  message: string;
  screenshot?: string;
  duration?: number;
}
