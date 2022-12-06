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
}

export function isSelectFilter(filter: ISelect | IRange): filter is ISelect {
  return (filter as ISelect).selectType !== undefined;
}

export function isRangeFilter(filter: ISelect | IRange): filter is IRange {
  return (filter as IRange).min !== undefined;
}
