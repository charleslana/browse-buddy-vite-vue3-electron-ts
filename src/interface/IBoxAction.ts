import { ActionBoxType } from '@/electron/types/ActionBoxType';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export default interface IBoxAction {
  label: string;
  icons: IconDefinition[];
  category: string;
  type: ActionBoxType;
  tooltip?: string;
}
