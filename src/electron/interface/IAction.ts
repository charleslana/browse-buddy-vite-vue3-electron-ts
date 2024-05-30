import { ActionBoxType } from '../types/ActionBoxType';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IInput } from './IInput';

export interface IAction {
  id: string;
  title?: string;
  icons: IconDefinition[];
  type: ActionBoxType;
  inputs: IInput[];
  disabled?: boolean;
  isVisible?: boolean;
}
