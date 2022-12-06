import { ListingFeatureFacets, Facets, EventTypes } from '@listings/types/listing';

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
      rehearsal: 'Wedding Rehearsal',
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

export const EventDisplayValues = Object.entries(FacetMapping['event'][1]).map((v) => v[1]);
