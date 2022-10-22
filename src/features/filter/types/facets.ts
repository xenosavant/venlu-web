import { Features, FeatureTypes } from "../../listings/types/listing"

export type FacetMap<T extends Features> = { [k in keyof T]: Record<T[k], string> };

export const FacetMapping: FacetMap<FeatureTypes> = {
    event: {
        'wedding': 'Wedding',
        'reception': 'Reception',
        'bridalShower': 'Bridal shower',
        'bachelorette': 'Bachelorette party',
        'bachelor': 'Bachelor party'
    },
    coverage: {
        'indoor': 'Indoor',
        'outdoor': 'Outdoor'
    },
    amenities: {
        'bar': 'Bar',
        'dancefloor': 'Dancefloor',
        'dj': 'DJ',
        'catering': 'Catering'
    }
}
