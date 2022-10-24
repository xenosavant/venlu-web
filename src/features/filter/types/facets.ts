import { Features, FeatureTypes } from "../../listings/types/listing"

// Generic mapped type to type the facet map
export type FacetMap<T extends Features> = { [k in keyof T]: [string, Record<T[k], string>] };

// Conrete facet map strictly typed by the listing features
export const FacetMapping: FacetMap<FeatureTypes> = {
    event: ['Event type', {
        'wedding': 'Wedding',
        'reception': 'Reception',
        'bridalShower': 'Bridal shower',
        'bachelorette': 'Bachelorette party',
        'bachelor': 'Bachelor party'
    }],
    coverage: ['Space', {
        'indoor': 'Indoor',
        'outdoor': 'Outdoor'
    }],
    amenities: ['Amenities', {
        'bar': 'Bar',
        'dancefloor': 'Dancefloor',
        'dj': 'DJ',
        'catering': 'Catering'
    }]
}
