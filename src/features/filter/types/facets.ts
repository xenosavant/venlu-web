import { ListingFeatureFacets, Facets } from '@listings/types/listing';

export type FacetMap = {
  [k in keyof Required<typeof Facets>]: [
    string,
    typeof Facets[k] extends Readonly<[number, number]>
      ? [typeof Facets[k][0], typeof Facets[k][1]]
      : Record<typeof Facets[k][number], string>
  ];
};

// Conrete facet map strictly typed by the listing features
export const FacetMapping: FacetMap = {
  event: [
    'Event type',
    {
      wedding: 'Wedding',
      reception: 'Reception',
      bridalShower: 'Bridal shower',
      bachelorette: 'Bachelorette party',
      bachelor: 'Bachelor party',
    },
  ],
  coverage: [
    'Space',
    {
      indoor: 'Indoor',
      outdoor: 'Outdoor',
    },
  ],
  amenities: [
    'Amenities',
    {
      bar: 'Bar',
      dancefloor: 'Dancefloor',
      dj: 'DJ',
      catering: 'Catering',
    },
  ],
  price: ['Price range', [0, 100000]],
};

export type MinNumber<T extends number> = T;
