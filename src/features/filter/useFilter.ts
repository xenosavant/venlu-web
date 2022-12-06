import { IFilter, IRange, ISelect } from '@filter/types/filter';
import { Facet, RangeFacet } from '@listings/listingsReducer';
import { Options } from '@listings/types/listing';
import clone from '@utilities/clone';
import { useState } from 'react';

export const useFilter = (filters: IFilter[], facets: Facet[], updateFilters: (updates: IFilter[]) => void) => {
  const [cachedFilters, setCachedFilters] = useState<IFilter[]>(filters);

  const normalizeRange = (value: number, filterKey: string): number => {
    console.log(value);
    const range = ((value - getRangeMin(filterKey)) / (getRangeMax(filterKey) - getRangeMin(filterKey))) * 100;
    return range;
  };

  const getRangeFacet = (key: string): RangeFacet => facets.find((f) => f.key === key) as RangeFacet;

  const getRangeMax = (key: string): number => {
    const facet = getRangeFacet(key);
    const filter = cachedFilters.find((f) => f.key === key) as IRange;
    return Math.min(facet.max, filter.range[1]);
  };

  const getRangeMin = (key: string): number => {
    const facet = getRangeFacet(key);
    const filter = cachedFilters.find((f) => f.key === key) as IRange;
    return Math.max(facet.min, filter.range[0]);
  };

  const denormalizeRange = (value: number, filterKey: string): number => {
    const sliderRange = [getRangeMin(filterKey), getRangeMax(filterKey)];
    return (value / 100) * (sliderRange[1] - sliderRange[0]) + sliderRange[0];
  };

  const handleSelectUpdated = (key: string, value: Options) => {
    const cloned = clone<IFilter[]>(cachedFilters);
    const filter = cloned.find((f) => f.key === key) as ISelect;
    if (filter.selected.includes(value)) {
      filter.selected = filter.selected.filter((selected: any) => selected !== value);
    } else {
      filter.selected?.push(value);
    }
    setCachedFilters(cloned);
    updateFilters(cloned);
  };

  const handleRangeUpdated = (key: string, value: number[], activeThumb: number) => {
    const cloned = clone<IFilter[]>(cachedFilters);
    const filter = cloned.find((f) => f.key === key) as IRange;
    if (activeThumb === 0) {
      const max = denormalizeRange(value[1], key);
      filter.min = Math.min(max, denormalizeRange(value[0], key));
    } else {
      const min = denormalizeRange(value[0], key);
      filter.max = Math.max(min, denormalizeRange(value[1], key));
    }

    setCachedFilters(cloned);
    updateFilters(cloned);
  };

  return {
    cachedFilters,
    handleSelectUpdated,
    handleRangeUpdated,
    normalizeRange,
    getRangeMax,
    getRangeMin,
    getRangeFacet,
  } as const;
};
