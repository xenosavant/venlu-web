import { FilteredKeys } from '@utilities/types';

export interface IListing {
  id?: string;
  title: string;
  description?: string;
  images: string[];
  capacity: number;
  parkingCapacity: number;
  primaryImageIndex: number;
  features: ListingFeatureFacets;
}

export const Facets = {
  event: ['bridalShower', 'wedding', 'rehearsal', 'reception'] as const,
  coverage: ['indoor', 'outdoor'] as const,
  amenities: ['bar', 'dancefloor', 'dj', 'catering'] as const,
  price: [0, Infinity] as const,
};

export type ListingFeatureTypes = {
  [k in keyof typeof Facets]: typeof Facets[k] extends [number, number] ? number : typeof Facets[k][number];
};

export type ListingFeatureFacets = {
  [k in keyof Required<ListingFeatureTypes>]: Required<ListingFeatureTypes[k]> extends number
    ? number
    : Array<ListingFeatureTypes[k]> | undefined;
};

// Listing and feature keys
export type FeatureKeys = keyof ListingFeatureTypes;

export type ListingFeatureNumberKeys = FilteredKeys<ListingFeatureTypes, number>;
export type ListingFeatureOptionKeys = Exclude<keyof ListingFeatureTypes, FilteredKeys<ListingFeatureTypes, number>>;

export const LISTING_FEATURE_OPTIONS: Array<ListingFeatureOptionKeys> = ['event', 'coverage', 'amenities'];
export const LISTING_FEATURE_NUMBERS: Array<ListingFeatureNumberKeys> = ['price'];

export type EventTypes = Required<ListingFeatureTypes['event']>;

export const EVENT_OPTIONS = Facets['event'];
export const COVERAGE_OPTIONS = Facets['coverage'];
export const AMENITIES_OPTIONS = Facets['amenities'];

export const OPTIONS = [...EVENT_OPTIONS, ...COVERAGE_OPTIONS, ...AMENITIES_OPTIONS] as const;
export type Options = typeof OPTIONS[number];

export const isOptionFeature = (key: string): key is ListingFeatureOptionKeys => {
  return LISTING_FEATURE_OPTIONS.includes(key as any);
};

export const isNumberFeature = (key: string): key is ListingFeatureNumberKeys => {
  return LISTING_FEATURE_NUMBERS.includes(key as any);
};
