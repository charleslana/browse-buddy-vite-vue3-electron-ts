import { SelectOptionType } from '../types/SelectOptionType';

export interface IAction {
  id: string;
  action: 'wait-click' | 'click' | 'fill' | 'type';
  elementType: SelectOptionType;
  element: string;
  text?: string;
}
