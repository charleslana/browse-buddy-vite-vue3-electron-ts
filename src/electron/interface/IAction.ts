import { ActionBoxType } from '../types/ActionBoxType';
import { SelectOptionType } from '../types/SelectOptionType';

export interface IAction {
  id: string;
  action: ActionBoxType;
  elementType: SelectOptionType;
  element: string;
  text?: string;
  disabled?: boolean;
  isVisible?: boolean;
}
