import {
  Box,
  Checkbox,
  debounce,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  Slider,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/app';
import { IFilter, filtersUpdated, getFilters } from './filtersReducer';
import { CountFacet, Facets, fetchListingsCount, getFacets } from '@listings/listingsReducer';
import { useFilter } from '@hooks/useFilter';

export default function Filter({ showFacets }: { showFacets: boolean }) {
  const dispatch = useAppDispatch();
  // This Component should render the filters and manage their state internally
  // It should also react to filter input and update the listingState when the filter is selected

  const filters = useAppSelector<IFilter>(getFilters);
  const facets = useAppSelector<Facets[]>(getFacets);

  const updateFilters = useCallback(
    debounce((updates: IFilter) => {
      // update the store with the locally cached filters
      dispatch(filtersUpdated(updates));
      dispatch(fetchListingsCount(updates));
    }, 1000),
    []
  );

  const { cachedFilters, getRangeFacet, normalizeRange, handleRangeUpdated, handleSelectUpdated } = useFilter(
    filters,
    facets,
    updateFilters
  );

  const SelectMap = {
    checkbox: <Checkbox />,
    radio: <Radio />,
  };

  return (
    <form>
      {cachedFilters &&
        facets &&
        facets.length !== 0 &&
        cachedFilters.range.map((filter) => {
          return (
            filter.min !== undefined &&
            filter.max !== undefined && (
              <FormGroup className="mb-32 mt-16" key={filter.key}>
                <FormLabel className="mb-16">{filter.title}</FormLabel>
                <div className="mb-8">
                  {`$${
                    filter.min < getRangeFacet(filter.key).min
                      ? getRangeFacet(filter.key).min?.toFixed()
                      : filter.min.toFixed(2)
                  } -
                    $${filter.max}${filter.max < getRangeFacet(filter.key).max ? '' : '+'}`}
                </div>
                <div className="mr-32">
                  <Slider
                    value={[
                      normalizeRange(filter.min, getRangeFacet(filter.key).min, getRangeFacet(filter.key).max),
                      normalizeRange(filter.max, getRangeFacet(filter.key).min, getRangeFacet(filter.key).max),
                    ]}
                    onChange={(e, value, activeThumb) => {
                      handleRangeUpdated(filter.key, value as number[], activeThumb);
                    }}
                    disableSwap
                  />
                </div>
              </FormGroup>
            )
          );
        })}
      {cachedFilters &&
        facets &&
        facets.length !== 0 &&
        cachedFilters.select.map((filter) => {
          return (
            filter.options.some((o) => (facets.find((f) => f.key === o.key)?.count as number) > 0) && (
              <FormGroup className="mb-32 mt-16" key={filter.key}>
                <FormLabel className="mb-16">{filter.title}</FormLabel>
                {filter.options
                  .filter((o) => (showFacets ? !facets || facets.find((f) => f.key === o.key)?.count !== 0 : true))
                  .map((option) => (
                    <div key={option.key} className="flex items-center">
                      <FormControlLabel
                        checked={filter.selected?.includes(option.key)}
                        control={SelectMap[filter.selectType]}
                        label={
                          filters.select.find((s) => s.key === filter.key)?.options.find((o) => o.key == option.key)
                            ?.value
                        }
                        onChange={() => {
                          handleSelectUpdated(filter.key, option.key);
                        }}
                      />
                      {showFacets && facets && (
                        <div>
                          <Typography variant="body2">({facets.find((f) => f.key === option.key)?.count})</Typography>
                        </div>
                      )}
                    </div>
                  ))}
              </FormGroup>
            )
          );
        })}
    </form>
  );
}
