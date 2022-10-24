import { FeatureKeys, ListingKeys, Options } from "@listings/types/listing";

export interface IFilterBase {
    order: number;
    title: string;
}

export type SelectType = 'checkbox' | 'radio';

export type SelectOption = { key: Options, value: string, count?: number };

export interface ISelect extends IFilterBase {
    key: FeatureKeys;
    selectType: SelectType;
    options: SelectOption[];
    selected: Options[];
}

export interface IRange extends IFilterBase {
    key: ListingKeys;
    min: number;
    max: number;
}
