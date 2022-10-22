export interface IListing {
  id?: string;
  title: string;
  description?: string;
  images: string[];
  capacity: number;
  parkingCapacity: number;
  primaryImageIndex: number;
  price: number;
  features: Partial<ListingFeatures<FeatureTypes>>;
}

type ListingFeatures<T> = { [k in keyof T]: T[k][] }

export type FeatureKeys = keyof FeatureTypes;
export type ListingKeys = keyof IListing;

export type FeatureTypes = {
  event: EventOptions;
  coverage: CoverageOptions;
  amenities: AmenitiesOptions;
}

export type Features = {
  [key: string]: EventOptions | CoverageOptions | AmenitiesOptions;
}

export type EventOptions = 'bachelor' | 'bachelorette' | 'bridalShower' | 'wedding' | 'reception';
export type CoverageOptions = 'indoor' | 'outdoor';
export type AmenitiesOptions = 'bar' | 'dancefloor' | 'dj' | 'catering';
