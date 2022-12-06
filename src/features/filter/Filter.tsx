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
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/app';
import { filtersUpdated, getFilters } from './filtersReducer';
import { CountFacet, Facet, fetchListingsCount, getFacets, RangeFacet } from '@listings/listingsReducer';
import { useFilter } from '@filter/useFilter';
import { IFilter, ISelect, isRangeFilter, isSelectFilter } from './types/filter';
import clone from '@utilities/clone';

export default function Filter({ showFacets }: { showFacets: boolean }) {
  const dispatch = useAppDispatch();
  // This Component should render the filters and manage their state internally
  // It should also react to filter input and update the listingState when the filter is selected

  const filters = useAppSelector<IFilter[]>(getFilters);
  const facets = useAppSelector<Facet[]>(getFacets);

  const updateFilters = useCallback(
    debounce((updates: IFilter[]) => {
      // update the store with the locally cached filters
      dispatch(filtersUpdated(updates));
      dispatch(fetchListingsCount(updates));
    }, 1000),
    []
  );

  useEffect(() => {
    if (filters.length) {
    }
  }, filters);

  const {
    cachedFilters,
    getRangeMin,
    getRangeMax,
    getRangeFacet,
    normalizeRange,
    handleRangeUpdated,
    handleSelectUpdated,
  } = useFilter(filters, facets, updateFilters);

  const SelectMap = {
    checkbox: <Checkbox />,
    radio: <Radio />,
  };

  return (
    <form>
      {cachedFilters &&
        facets &&
        facets.length !== 0 &&
        clone<IFilter[]>(cachedFilters)
          .sort((a, b) => (a.order > b.order ? 1 : -1))
          .map((filter) => {
            if (isRangeFilter(filter)) {
              return (
                <FormGroup className="mb-32 mt-16" key={filter.key}>
                  <FormLabel htmlFor={`${filter.key}_slider`} id={filter.key} className="mb-16">
                    {filter.title}
                  </FormLabel>
                  <div className="mb-8">
                    {`$${Math.max(filter.min, getRangeMin(filter.key)).toFixed(2)} -
                    $${filter.max.toFixed(2)}${
                      filter.max === getRangeMax(filter.key) && filter.range[1] < getRangeFacet(filter.key).max
                        ? '+'
                        : ''
                    }`}
                  </div>
                  <div className="mr-32">
                    <Slider
                      id={`${filter.key}_slider`}
                      data-testid={`${filter.key}`}
                      name={filter.key}
                      value={[
                        normalizeRange(Math.max(filter.min, getRangeMin(filter.key)), filter.key),
                        normalizeRange(filter.max, filter.key),
                      ]}
                      onChange={(e, value, activeThumb) => {
                        handleRangeUpdated(filter.key, value as number[], activeThumb);
                      }}
                      disableSwap
                    />
                  </div>
                </FormGroup>
              );
            } else
              return (
                filter.options.some(
                  (o) => ((facets.find((f) => f.key === o.key) as CountFacet)?.count as number) > 0
                ) && (
                  <FormGroup className="mb-32 mt-16" key={filter.key}>
                    <FormLabel htmlFor={`${filter.key}_select`} className="mb-16">
                      {filter.title}
                    </FormLabel>
                    {filter.options
                      .filter((o) =>
                        showFacets ? !facets || (facets.find((f) => f.key === o.key) as CountFacet)?.count !== 0 : true
                      )
                      .map((option) => (
                        <div key={option.key} className="flex items-center">
                          <FormControlLabel
                            id={`${filter.key}_select`}
                            checked={filter.selected?.includes(option.key)}
                            control={SelectMap[filter.selectType]}
                            label={
                              (filters.find((f) => f.key === filter.key) as ISelect).options.find(
                                (o) => o.key == option.key
                              )?.value
                            }
                            onChange={() => {
                              handleSelectUpdated(filter.key, option.key);
                            }}
                          />
                          {showFacets && facets && (
                            <Typography variant="body2">
                              ({(facets.find((f) => f.key === option.key) as CountFacet)?.count})
                            </Typography>
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
