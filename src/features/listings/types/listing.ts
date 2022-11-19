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
  event: ['bachelor', 'bachelorette', 'bridalShower', 'wedding', 'reception'] as const,
  coverage: ['indoor', 'outdoor'] as const,
  amenities: ['bar', 'dancefloor', 'dj', 'catering'] as const,
  price: [0, Infinity] as const,
};

export type ListingFeatureTypes = {
  [k in keyof typeof Facets]: typeof Facets[k] extends [number, number] ? number : typeof Facets[k][number];
};

export type U<T extends keyof typeof Facets> = keyof typeof Facets[T];

export type ListingFeatureFacets = {
  [k in keyof Required<ListingFeatureTypes>]: Required<ListingFeatureTypes[k]> extends number | undefined
    ? number | undefined
    : Array<ListingFeatureTypes[k]> | undefined;
};

// Listing and feature keys
export type FeatureKeys = keyof ListingFeatureTypes;

// Filtered keys
type FilteredKeys<T extends ListingFeatureTypes, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

export type ListingFeatureNumberKeys = FilteredKeys<ListingFeatureTypes, number>;
export type ListingFeatureOptionKeys = Exclude<keyof ListingFeatureTypes, FilteredKeys<ListingFeatureTypes, number>>;

// Filtered features
export type ListingFeatureNumbers = Pick<ListingFeatureTypes, ListingFeatureNumberKeys>;
export type ListingFeatureOptions = Pick<ListingFeatureTypes, ListingFeatureOptionKeys>;

// Loose typing for filtering
export type GetFeatureType<T extends FeatureKeys> = ListingFeatureTypes[T];

export const EVENT_OPTIONS = Facets['event'];
export const COVERAGE_OPTIONS = Facets['coverage'];
export const AMENITIES_OPTIONS = Facets['amenities'];

export const OPTIONS = [...EVENT_OPTIONS, ...COVERAGE_OPTIONS, ...AMENITIES_OPTIONS] as const;
export type Options = typeof OPTIONS[number];

export const LISTING_FEATURE_OPTIONS: Array<keyof ListingFeatureOptions> = ['event', 'coverage', 'amenities'];
export const LISTING_FEATURE_NUMBERS: Array<ListingFeatureNumberKeys> = ['price'];

export const isOptionFeature = (key: string): key is ListingFeatureOptionKeys => {
  return LISTING_FEATURE_OPTIONS.includes(key as any);
};

export const isNumberFeature = (key: string): key is ListingFeatureNumberKeys => {
  return LISTING_FEATURE_NUMBERS.includes(key as any);
};
