import { ListingKeys } from "../../listings/types/listing";

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
    key: ListingKeys;
    min: number;
    max: number;
}

export type featureKeys = 'type' | 'coverage' | 'amenities';

