import { FeatureKeys, ListingFeatureNumberKeys, ListingFeatureOptionKeys, Options } from '@listings/types/listing';

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
