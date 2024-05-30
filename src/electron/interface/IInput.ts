import { SelectOptionType } from '../types/SelectOptionType';

export interface IInput {
  label: string;
  placeholder?: string;
  value?: string;
  select?: SelectOptionType;
}
