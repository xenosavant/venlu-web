export type featureKeys = 'type' | 'coverage' | 'amenities';

export type FeatureFacet = {
  [key: string]: string;
}

export const keyFacetMap: Record<featureKeys, FeatureFacet> = {
  type: {
    'bachelor': 'Bachelor party',
    'bachelorette': 'Bachelorette party',
    'bridal-shower': 'Bridal shower',
    'wedding': 'Wedding',
    'reception': 'Reception',
  },
  coverage: {
    'indoor': 'Indoor',
    'outdoor': 'Outdoor',
  },
  amenities: {
    'bar': 'Bar',
    'dancefloor': 'Dancefloor',
    'dj': 'DJ',
    'catering': 'Catering',
  }
}

export interface IListing {
  id?: string;
  title: string;
  description?: string;
  images: string[];
  capacity: number;
  parkingCapacity: number;
  primaryImageIndex: number;
  price: number;
  features: Record<featureKeys, string[]>;
}

// use a key map here to map the features to the correct values
