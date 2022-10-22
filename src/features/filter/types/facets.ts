export type FeatureFacet = {
    [T in FeatureFacetKeys]: KeyFacetMap[T];
}

export type FeatureFacetKeys = 'type' | 'coverage' | 'amenities';

export type KeyFacetMap = {
    type: {
        'bachelor': 'Bachelor party',
        'bachelorette': 'Bachelorette party',
        'bridalShower': 'Bridal shower',
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
