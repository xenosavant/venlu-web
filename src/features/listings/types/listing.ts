export interface IListing {
  id?: string;
  title: string;
  description?: string;
  images: string[];
  capacity: number;
  parkingCapacity: number;
  primaryImageIndex: number;
  price: number;
  features: ListingFeatures;
}

export type ListingFeatures = {
  event: EventOptions[];
  coverage: CoverageOptions[];
  amenities: AmenitiesOptions[];
}

export type FeatureTypes = {
  [k in keyof ListingFeatures]: GetElementType<ListingFeatures[k]>
}

export type Features = {
  [key: string]: Options;
}

export type EventOptions = 'bachelor' | 'bachelorette' | 'bridalShower' | 'wedding' | 'reception';
export type CoverageOptions = 'indoor' | 'outdoor';
export type AmenitiesOptions = 'bar' | 'dancefloor' | 'dj' | 'catering';
export type Options = EventOptions | CoverageOptions | AmenitiesOptions;

export type FeatureKeys = keyof FeatureTypes;
export type ListingKeys = keyof IListing;

export type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never;