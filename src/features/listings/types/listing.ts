export interface IListing {
  id?: string;
  title: string;
  description?: string;
  images: string[];
  capacity: number;
  parkingCapacity: number;
  primaryImageIndex: number;
  price: number;
  features: ListingFeatureFacets;
}

// type for the listing features
export type ListingFeatureTypes = {
  event: EventOptions;
  coverage: CoverageOptions;
  amenities: AmenitiesOptions;
  price: number;
};

export type EventOptions = ("bachelor"
  | "bachelorette"
  | "bridalShower"
  | "wedding"
  | "reception"
);

export type CoverageOptions = ("indoor" | "outdoor");
export type AmenitiesOptions = ("bar" | "dancefloor" | "dj" | "catering");

export type ListingFeatureFacets = {
  [k in keyof Required<ListingFeatureTypes>]: Required<ListingFeatureTypes[k]> extends number | undefined ? number | undefined : Array<ListingFeatureTypes[k]> | undefined;
};
export type Options = ListingFeatureTypes[keyof ListingFeatureTypes];

// Listing and feature keys
export type FeatureKeys = keyof ListingFeatureTypes;
export type ListingKeys = keyof IListing;

// Loose typing for filtering
export type UntypedFeatures = {
  [k in FeatureKeys]: Options;
};
