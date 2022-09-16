import {
  Box, Checkbox, FormControlLabel, FormGroup, FormLabel, Radio, Slider, Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { IFilter } from '../data/interfaces/filter';
import { useAppDispatch, useAppSelector } from '../hooks/context';
import {
  filterFacetsUpdated,
  FiltersState, filtersUpdated, selectFilters,
} from '../state/reducers/filtersReducer';
import { ListingData, selectListings } from '../state/reducers/listingsReducer';

export default function Filter() {
  const dispatch = useAppDispatch();
  // This Component should render the filters and manage their state internally
  // It should also react to filter input and update the listingState when the filter is selected

  const filterData = useAppSelector<FiltersState>(selectFilters);
  const listingsData = useAppSelector<ListingData>(selectListings);

  useEffect(() => {
    dispatch(filterFacetsUpdated(listingsData.facets));
  }, [listingsData]);

  const handleFilterUpdated = (key: string, value: string) => {
    const filters = [...filterData.filters];
    const filter = JSON.parse(JSON.stringify(filters.find((f) => f.key === key))) as IFilter;
    if (filter?.selected.includes(value)) {
      filter.selected = filter.selected.filter(
        (selected: string) => selected !== value,
      );
    } else {
      filter.selected.push(value);
    }
    dispatch(filtersUpdated([...filters.filter((f) => f.key !== filter.key), filter]
      .sort((a, b) => a.order - b.order)));
  };

  const typeMap = {
    checkbox: <Checkbox />,
    radio: <Radio />,
    slider: <Slider />,
  };

  return (
    <form>
      {filterData && filterData.filters?.map((filter: IFilter) => (filter.options.length > 0) && (
      <FormGroup className="mb-32" key={filter.key}>
        <FormLabel className="mb-16">{filter.title}</FormLabel>
        {filter.options.filter((o) => o?.count !== 0).map((option) => (
          <div key={option.key} className="flex items-center">
            <FormControlLabel
              checked={filter.selected.includes(option.key)}
              key={option.key}
              control={typeMap[filter.type]}
              label={option.value}
              onChange={() => {
                handleFilterUpdated(filter.key, option.key);
              }}
            />
            {option.count && (
            <Box>
              {' '}
              <Typography variant="body2">
                (
                {option.count}
                )
              </Typography>
            </Box>
            )}
          </div>
        ))}
      </FormGroup>
      ))}
    </form>
  );
}
