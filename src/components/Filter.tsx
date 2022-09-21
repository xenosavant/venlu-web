import {
  Box, Checkbox, debounce, FormControlLabel, FormGroup, FormLabel, Radio, Slider, Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
  IFilter, SelectType, IRange, ISelect,
} from '../data/interfaces/filter';
import { useAppDispatch, useAppSelector } from '../hooks/context';
import {
  filtersUpdated, getFilters,
} from '../state/reducers/filtersReducer';
import {
  fetchListingsCount, getFacets, IFacet,
} from '../state/reducers/listingsReducer';

export default function Filter({ showFacets, onFilterUpdated }:
{ showFacets: boolean, onFilterUpdated?: (filters: IFilter[]) => void }) {
  const dispatch = useAppDispatch();
  // This Component should render the filters and manage their state internally
  // It should also react to filter input and update the listingState when the filter is selected

  const filters = useAppSelector<IFilter[]>(getFilters);
  const facets = useAppSelector<IFacet[]>(getFacets);

  const [cachedFilters, setCachedFilters] = useState<IFilter[]>([]);

  const updateFilters = useCallback(debounce((updates: IFilter[]) => {
    // update the store with the locally cached filters
    dispatch(filtersUpdated(updates));
    onFilterUpdated?.(updates);
    dispatch(fetchListingsCount(updates));
  }, 1000), []);

  useEffect(() => {
    // update the local state when the filter component is mounted
    setCachedFilters(filters.map((filter) => ({ ...filter })));
  }, []);

  const normalizeRange = (value: number, rangeMin: number, rangeMax: number):
  number => ((value - rangeMin) / (rangeMax - rangeMin)) * 100;

  const getRangeFacet = (key: string): IFacet => facets.find((f) => f.key === key) as IFacet;

  const denormalizeRange = (value: number, filterKey: string):
  number => {
    const sliderRange = [
      getRangeFacet(filterKey).min as number,
      getRangeFacet(filterKey).max as number,
    ];
    return ((value / 100) * (sliderRange[1] - sliderRange[0])) + sliderRange[0];
  };

  const handleSelectUpdated = (key: string, value: string) => {
    const clone = JSON.parse(JSON.stringify(cachedFilters)) as IFilter[];
    const filter = clone.find((f) => f.key === key) as ISelect;
    if (filter.selected.includes(value)) {
      filter.selected = filter.selected.filter(
        (selected: string) => selected !== value,
      );
    } else {
      filter.selected?.push(value);
    }
    setCachedFilters(clone);
    updateFilters(clone);
  };

  const handleRangeUpdated = (key: string, value: number[], activeThumb: number) => {
    const clone = cachedFilters.map((f) => ({ ...f }));
    const filter = clone.find((f) => f.key === key) as IRange;
    if (activeThumb === 0) {
      const max = denormalizeRange(value[1], key)
      - ((getRangeFacet(key).max as number - (getRangeFacet(key).min as number)) / 10);
      filter.min = Math.min(max, denormalizeRange(value[0], key));
      filter.max = denormalizeRange(value[1], key);
    } else {
      const min = denormalizeRange(value[0], key)
      + ((getRangeFacet(key).max as number - (getRangeFacet(key).min as number)) / 10);
      filter.max = Math.max(min, denormalizeRange(value[1], key));
      filter.min = denormalizeRange(value[0], key);
    }

    setCachedFilters(clone);
    updateFilters(clone);
  };

  const selectMap = {
    checkbox: <Checkbox />,
    radio: <Radio />,
  };

  return (
    <form>
      {cachedFilters && facets && facets.length && cachedFilters.filter((c) => c.type === 'range')
        .map((filter) => {
          const range = filter as IRange;
          return (
            range.min !== undefined && range.max !== undefined
            && (
            <FormGroup className="mb-32 mt-16" key={range.key}>
              <FormLabel className="mb-16">{range.title}</FormLabel>
              <Box className="mb-8">
                {`$${range.min < (getRangeFacet(range.key).min as number)
                  ? getRangeFacet(range.key).min?.toFixed() : range.min.toFixed(2)} -
                    $${(range.max)}${(range.max)
                    < (getRangeFacet(range.key).max as number) ? '' : '+'}`}
              </Box>
              <Box className="mr-32">
                <Slider
                  value={[normalizeRange(
                    range.min as number,
                    getRangeFacet(range.key).min as number,
                    getRangeFacet(range.key).max as number,
                  ), normalizeRange(
                    range.max as number,
                    getRangeFacet(range.key).min as number,
                    getRangeFacet(range.key).max as number,
                  )]}
                  onChange={(e, value, activeThumb) => {
                    handleRangeUpdated(range.key, value as number[], activeThumb);
                  }}
                  disableSwap
                />
              </Box>
            </FormGroup>
            )
          );
        })}
      {cachedFilters && facets && facets.length && cachedFilters.filter((c) => c.type === 'select')
        .map((filter) => {
          const select = filter as ISelect;
          return select.options.some((o) => facets.find(
            (f) => f.key === o.key,
          )?.count as number > 0) && (
            <FormGroup className="mb-32 mt-16" key={select.key}>
              <FormLabel className="mb-16">{select.title}</FormLabel>
              {select.options.filter((o) => (showFacets ? !facets || facets.find(
                (f) => f.key === o.key,
              )?.count !== 0 : true))
                .map((option) => (
                  <Box key={option.key} className="flex items-center">
                    <FormControlLabel
                      checked={select.selected?.includes(option.key)}
                      control={selectMap[select.selectType as SelectType]}
                      label={option.value}
                      onChange={() => {
                        handleSelectUpdated(select.key, option.key);
                      }}
                    />
                    { showFacets && facets && (
                    <Box>
                      <Typography variant="body2">
                        (
                        {facets.find(
                          (f) => f.key === option.key,
                        )?.count || 0}
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
