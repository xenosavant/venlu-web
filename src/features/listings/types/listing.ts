import { FeatureFacetKeys } from "../../filter/types/facets";

export interface IListing {
  id?: string;
  title: string;
  description?: string;
  images: string[];
  capacity: number;
  parkingCapacity: number;
  primaryImageIndex: number;
  price: number;
  features: Record<FeatureFacetKeys, string[]>;
}

export type ListingKeys = keyof IListing;
