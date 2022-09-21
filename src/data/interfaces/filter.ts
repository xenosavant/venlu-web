export interface IFilterBase {
  key: string;
  order: number;
  title: string;
  type: FilterType;
}

export type FilterOptions = { key: string, value: string, count?: number }[];
export type FilterType = 'select' | 'range';
export type SelectType = 'checkbox' | 'radio';

export interface ISelect extends IFilterBase {
  selectType: SelectType;
  options: FilterOptions;
  selected: string[];
}

export interface IRange extends IFilterBase {
  min: number | undefined;
  max: number | undefined;
}

export type IFilter = ISelect & IRange;
