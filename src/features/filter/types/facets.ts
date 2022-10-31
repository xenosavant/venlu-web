import { ListingFeatureTypes } from "@listings/types/listing"

export type FacetMapType = { [k in keyof ListingFeatureTypes]: [string, Record<ListingFeatureTypes[k], string>] };

// Conrete facet map strictly typed by the listing features
export const FacetMapping: FacetMapType = {
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
