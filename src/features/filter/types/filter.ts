import { AmenitiesOptions, CoverageOptions, FeatureKeys, FeatureTypes, ListingKeys, EventOptions } from "../../listings/types/listing";

export interface IFilterBase {
    order: number;
    title: string;
}

export type SelectType = 'checkbox' | 'radio';

export interface ISelect extends IFilterBase {
    key: FeatureKeys;
    selectType: SelectType;
    options: { key: OptionKey, value: string, count?: number }[],
    selected: OptionKey[];
}

export type OptionKey = EventOptions | CoverageOptions | AmenitiesOptions;

export interface IRange extends IFilterBase {
    key: ListingKeys;
    min: number;
    max: number;
}
