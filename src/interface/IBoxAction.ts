import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export default interface IBoxAction {
  label: string;
  icons: IconDefinition[];
  category: string;
  type: 'wait-click' | 'click' | 'fill' | 'type';
  tooltip?: string;
}
