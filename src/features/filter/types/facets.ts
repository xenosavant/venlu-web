export type FeatureFacet = {
    [key: string]: string;
}

export type FeatureFacetKeys = keyof FeatureFacet;

export const KeyFacetMap: Record<string, FeatureFacet> = {
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