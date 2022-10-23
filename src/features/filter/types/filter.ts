import { AmenitiesOptions, CoverageOptions, FeatureKeys, FeatureTypes, ListingKeys, EventOptions } from "../../listings/types/listing";

export interface IFilterBase {
    order: number;
    title: string;
}

export type SelectType = 'checkbox' | 'radio';

export type OptionKeys = EventOptions | CoverageOptions | AmenitiesOptions;

export type SelectOption = { key: OptionKeys, value: string, count?: number };

export interface ISelect extends IFilterBase {
    key: FeatureKeys;
    selectType: SelectType;
    options: SelectOption[];
    selected: OptionKeys[];
}

export interface IRange extends IFilterBase {
    key: ListingKeys;
    min: number;
    max: number;
}
