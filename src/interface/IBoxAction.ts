import { ActionBoxType } from '@/electron/types/ActionBoxType';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IInput } from '@/electron/interface/IInput';

export default interface IBoxAction {
  label: string;
  icons: IconDefinition[];
  category: string;
  type: ActionBoxType;
  tooltip?: string;
  inputs: IInput[];
}
