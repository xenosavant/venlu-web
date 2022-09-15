import {
  Box, Checkbox, FormControlLabel, FormGroup, FormLabel, Radio, Slider, Typography,
} from '@mui/material';
import { useState } from 'react';
import { IFilter } from '../data/interfaces/filter';

export function Filter({ onFilterChanged }: { onFilterChanged?: (filters: IFilter[]) => void, initialFilters?: IFilter[] }) {
  // This Component should render the filters and manage their state internally
  // It should also react to filter input and update the listingState when the filter is selected
  const defaultFilters: IFilter[] = [
    {
      type: 'checkbox',
      key: 'type',
      title: 'Event type',
      options: [{ key: 'wedding', value: 'Wedding' }, { key: 'reception', value: 'Reception' },
        { key: 'bridal-shower', value: 'Bridal shower' }, { key: 'bachelorette', value: 'Bachelorette party' },
        { key: 'bachelor', value: 'Bachelor party' }],
      selected: [],
    },
    {
      type: 'checkbox',
      key: 'coverage',
      title: 'Space',
      options: [{ key: 'indoor', value: 'Indoor' }, { key: 'outdoor', value: 'Outdoor' }],
      selected: [],
    },
  ];

  /// Set the initial filters
  const [filters, setFilters] = useState<IFilter[]>(defaultFilters);

  const handleFilterUpdated = (key: string, value: string) => {
    const filter = filters.find((filter: IFilter) => filter.key === key);
    filter?.selected.includes(value) ? filter.selected = filter.selected.filter((selected: string) => selected !== value) : filter?.selected.push(value);
    // onFilterChanged ? handleFiltersAndUpdateState([...filters]) : listingProviderProps?.updateListings?.(filters);
  };

  const handleFiltersAndUpdateState = (filters: IFilter[]) => {
    (onFilterChanged != null) && onFilterChanged(filters);
    setFilters(filters);
  };

  // useEffect(() => {
  //     if (listingProviderProps?.filters?.length) {
  //         setFilters && setFilters([...listingProviderProps?.filters]);
  //     }
  // }, [listingProviderProps?.filters])

  const typeMap = {
    checkbox: <Checkbox />,
    radio: <Radio />,
    slider: <Slider />,
  };

  return (
    <form>
      {filters.map((filter: IFilter) => (filter.options.length > 0) && (
      <FormGroup className="mb-32" key={filter.key}>
        <FormLabel className="mb-16">{filter.title}</FormLabel>
        {filter.options.filter((o) => o?.count !== 0).map((option) => (
          <div key={option.key} className="flex items-center">
            <FormControlLabel
              checked={filter.selected.includes(option.key)}
              key={option.key}
              control={typeMap[filter.type]}
              label={option.value}
              onChange={(e) => {
                handleFilterUpdated(filter.key, option.key);
              }}
            />
            {option.count && (
            <Box>
              {' '}
              <Typography variant="body2">
                ({option.count}
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
