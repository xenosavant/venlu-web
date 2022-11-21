import { IFilter } from '@filter/filtersReducer';
import { IRange, ISelect } from '@filter/types/filter';
import { Facets, RangeFacet } from '@listings/listingsReducer';
import { Options } from '@listings/types/listing';
import clone from '@utilities/clone';
import { useEffect, useState } from 'react';

export const useFilter = (filters: IFilter, facets: Facets[], updateFilters: (updates: IFilter) => void) => {
  const [cachedFilters, setCachedFilters] = useState<IFilter>(filters);

  const normalizeRange = (value: number, rangeMin: number, rangeMax: number): number =>
    ((value - rangeMin) / (rangeMax - rangeMin)) * 100;

  const getRangeFacet = (key: string): RangeFacet => facets.find((f) => f.key === key) as RangeFacet;

  const denormalizeRange = (value: number, filterKey: string): number => {
    const sliderRange = [getRangeFacet(filterKey).min, getRangeFacet(filterKey).max];
    return (value / 100) * (sliderRange[1] - sliderRange[0]) + sliderRange[0];
  };

  const handleSelectUpdated = (key: string, value: Options) => {
    const cloned = clone<IFilter>(cachedFilters);
    const filter = cloned.select.find((f) => f.key === key) as ISelect;
    if (filter.selected.includes(value)) {
      filter.selected = filter.selected.filter((selected: any) => selected !== value);
    } else {
      filter.selected?.push(value);
    }
    setCachedFilters(cloned);
    updateFilters(cloned);
  };

  const handleRangeUpdated = (key: string, value: number[], activeThumb: number) => {
    const cloned = clone<IFilter>(cachedFilters);
    const filter = cloned.range.find((f) => f.key === key) as IRange;
    if (activeThumb === 0) {
      const max = denormalizeRange(value[1], key) - (getRangeFacet(key).max - getRangeFacet(key).min) / 10;
      filter.min = Math.min(max, denormalizeRange(value[0], key));
      filter.max = denormalizeRange(value[1], key);
    } else {
      const min = denormalizeRange(value[0], key) + (getRangeFacet(key).max - getRangeFacet(key).min) / 10;
      filter.max = Math.max(min, denormalizeRange(value[1], key));
      filter.min = denormalizeRange(value[0], key);
    }

    setCachedFilters(cloned);
    updateFilters(cloned);
  };

  return { cachedFilters, handleSelectUpdated, handleRangeUpdated, normalizeRange, getRangeFacet } as const;
};
