export interface IListing {
  id?: string
  title: string
  description?: string
  images: string[]
  capacity: number
  parkingCapacity: number
  primaryImageIndex: number
  price: number
  features: ListingFeatures
}

// type for the listing features
export interface ListingFeatures {
  event: EventOptions[]
  coverage: CoverageOptions[]
  amenities: AmenitiesOptions[]
}

// mapped type of ListingFeatures to build FacetMap
export type FeatureTypes = {
  [k in keyof ListingFeatures]: GetElementType<ListingFeatures[k]>
}

// type constraint for generic facet map
export type Features = {
  [key: string]: Options
}

export type UntypedFeatures = {
  [k in FeatureKeys]: Options[]
}

export type EventOptions = 'bachelor' | 'bachelorette' | 'bridalShower' | 'wedding' | 'reception';
export type CoverageOptions = 'indoor' | 'outdoor';
export type AmenitiesOptions = 'bar' | 'dancefloor' | 'dj' | 'catering';
export type Options = EventOptions | CoverageOptions | AmenitiesOptions;

export type FeatureKeys = keyof FeatureTypes;
export type ListingKeys = keyof IListing;

export type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never;