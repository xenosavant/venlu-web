import {
  Box, Checkbox, debounce, FormControlLabel, FormGroup, FormLabel, Radio, Slider, Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/app';
import {
  IFilter,
  filtersUpdated, getFilters,
} from './filtersReducer';
import {
  CountFacet,
  fetchListingsCount, getFacets, IFacet, RangeFacet,
} from '@listings/listingsReducer';
import clone from '@utilities/clone';
import { IRange, ISelect } from './types/filter';
import { Options } from '@listings/types/listing';

export default function Filter({ showFacets }:
  { showFacets: boolean }) {
  const dispatch = useAppDispatch();
  // This Component should render the filters and manage their state internally
  // It should also react to filter input and update the listingState when the filter is selected

  const filters = useAppSelector<IFilter>(getFilters);
  const facets = useAppSelector<(RangeFacet & CountFacet)[]>(getFacets);

  const [cachedFilters, setCachedFilters] = useState<IFilter>({ select: [], range: [] });

  const updateFilters = useCallback(debounce((updates: IFilter) => {
    // update the store with the locally cached filters
    dispatch(filtersUpdated(updates));
    dispatch(fetchListingsCount(updates));
  }, 1000), []);

  useEffect(() => {
    setCachedFilters(clone(filters));
  }, []);

  const normalizeRange = (value: number, rangeMin: number, rangeMax: number):
    number => ((value - rangeMin) / (rangeMax - rangeMin)) * 100;

  const getRangeFacet = (key: string): RangeFacet => facets.find((f) => f.key === key) as RangeFacet;

  const denormalizeRange = (value: number, filterKey: string):
    number => {
    const sliderRange = [
      getRangeFacet(filterKey).min,
      getRangeFacet(filterKey).max,
    ];
    return ((value / 100) * (sliderRange[1] - sliderRange[0])) + sliderRange[0];
  };

  const handleSelectUpdated = (key: string, value: Options) => {
    const cloned = clone<IFilter>(cachedFilters);
    const filter = cloned.select.find((f) => f.key === key) as ISelect;
    if (filter.selected.includes(value)) {
      filter.selected = filter.selected.filter(
        (selected: any) => selected !== value,
      );
    } else {
      filter.selected?.push(value);
    }
    setCachedFilters(cloned);
    updateFilters(cloned);
  };

  const handleRangeUpdated = (key: string, value: number[], activeThumb: number) => {
    const cloned = clone<IFilter>(cachedFilters)
    const filter = cloned.range.find((f) => f.key === key) as IRange;
    if (activeThumb === 0) {
      const max = denormalizeRange(value[1], key)
        - ((getRangeFacet(key).max - (getRangeFacet(key).min)) / 10);
      filter.min = Math.min(max, denormalizeRange(value[0], key));
      filter.max = denormalizeRange(value[1], key);
    } else {
      const min = denormalizeRange(value[0], key)
        + ((getRangeFacet(key).max - (getRangeFacet(key).min)) / 10);
      filter.max = Math.max(min, denormalizeRange(value[1], key));
      filter.min = denormalizeRange(value[0], key);
    }

    setCachedFilters(cloned);
    updateFilters(cloned);
  };

  const SelectMap = {
    checkbox: <Checkbox />,
    radio: <Radio />,
  };

  return (
    <form>
      {cachedFilters && facets && facets.length !== 0 && cachedFilters.range
        .map((filter) => {
          return (
            filter.min !== undefined && filter.max !== undefined
            && (
              <FormGroup className="mb-32 mt-16" key={filter.key}>
                <FormLabel className="mb-16">{filter.title}</FormLabel>
                <Box className="mb-8">
                  {`$${filter.min < (getRangeFacet(filter.key).min)
                    ? getRangeFacet(filter.key).min?.toFixed() : filter.min.toFixed(2)} -
                    $${(filter.max)}${(filter.max)
                      < (getRangeFacet(filter.key).max) ? '' : '+'}`}
                </Box>
                <Box className="mr-32">
                  <Slider
                    value={[normalizeRange(
                      filter.min,
                      getRangeFacet(filter.key).min,
                      getRangeFacet(filter.key).max,
                    ), normalizeRange(
                      filter.max,
                      getRangeFacet(filter.key).min,
                      getRangeFacet(filter.key).max,
                    )]}
                    onChange={(e, value, activeThumb) => {
                      handleRangeUpdated(filter.key, value as number[], activeThumb);
                    }}
                    disableSwap
                  />
                </Box>
              </FormGroup>
            )
          );
        })}
      {cachedFilters && facets && facets.length !== 0 && cachedFilters.select
        .map((filter) => {
          return filter.options.some((o) => facets.find(
            (f) => f.key === o.key,
          )?.count as number > 0) && (
              <FormGroup className="mb-32 mt-16" key={filter.key}>
                <FormLabel className="mb-16">{filter.title}</FormLabel>
                {filter.options.filter((o) => (showFacets ? !facets || facets.find(
                  (f) => f.key === o.key,
                )?.count !== 0 : true))
                  .map((option) => (
                    <Box key={option.key} className="flex items-center">
                      <FormControlLabel
                        checked={filter.selected?.includes(option.key)}
                        control={SelectMap[filter.selectType]}
                        label={filters.select.find(s => s.key === filter.key)?.options.find((o) => o.key == option.key)?.value}
                        onChange={() => {
                          handleSelectUpdated(filter.key, option.key);
                        }}
                      />
                      {showFacets && facets && (
                        <Box>
                          <Typography variant="body2">
                            (
                            {facets.find(
                              (f) => f.key === option.key,
                            )?.count}
                            )
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
              </FormGroup>
            );
        })}
    </form>
  );
}
