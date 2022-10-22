import { ListingKeys } from "../../listings/types/listing";
import { FeatureFacet, FeatureFacetKeys } from "./facets";

export interface IFilterBase {
    order: number;
    title: string;
}

export type FilterOptions = { key: string, value: string, count?: number }[];

export type SelectType = 'checkbox' | 'radio';

export interface ISelect extends IFilterBase {
    key: FeatureFacetKeys;
    selectType: SelectType;
    options: { key: OptionKey, value: string, count?: number }[],
    selected: string[];
}

type OptionKey = keyof FeatureFacet["type"] | keyof FeatureFacet["coverage"] | keyof FeatureFacet["amenities"];

export interface IRange extends IFilterBase {
    key: ListingKeys;
    min: number;
    max: number;
}
