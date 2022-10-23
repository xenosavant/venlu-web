import { Features, FeatureTypes } from "../../listings/types/listing"

export type FacetMap<T extends Features> = { [k in keyof T]: [string, Record<T[k], string>] };

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
