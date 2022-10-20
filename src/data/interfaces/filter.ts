import { featureKeys, IListing } from "./listing";

export interface IFilterBase {
  order: number;
  title: string;
}

export type FilterOptions = { key: string, value: string, count?: number }[];
export type SelectType = 'checkbox' | 'radio';

export interface ISelect extends IFilterBase {
  key: featureKeys;
  selectType: SelectType;
  options: FilterOptions;
  selected: string[];
}

export interface IRange extends IFilterBase {
  key: keyof IListing;
  min: number;
  max: number;
}
