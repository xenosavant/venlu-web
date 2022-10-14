import { featureKeys, IListing } from "./listing";

export interface IFilterBase {
  key: FilterKeys;
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
  min: number;
  max: number;
}

export type IFilter = ISelect & IRange;

export type FilterKeys = Partial<keyof IListing | featureKeys>;
