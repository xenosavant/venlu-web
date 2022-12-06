import { ListingFeatureNumberKeys, ListingFeatureOptionKeys, Options } from '@listings/types/listing';

export interface IFilterBase {
  order: number;
  title: string;
}

export type SelectType = 'checkbox' | 'radio';

export type SelectOption = { key: Options; value: string; count?: number };

export interface ISelect extends IFilterBase {
  key: ListingFeatureOptionKeys;
  selectType: SelectType;
  options: SelectOption[];
  selected: Options[];
}

export interface IRange extends IFilterBase {
  key: ListingFeatureNumberKeys;
  min: number;
  max: number;
  readonly range: [number, number];
}

export type IFilter = ISelect | IRange;

export function isSelectFilter(filter: IFilter): filter is ISelect {
  return (filter as ISelect).selectType !== undefined;
}

export function isRangeFilter(filter: IFilter): filter is IRange {
  return (filter as IRange).min !== undefined;
}
