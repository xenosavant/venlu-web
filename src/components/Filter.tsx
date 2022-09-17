import {
  Box, Checkbox, FormControlLabel, FormGroup, FormLabel, Radio, Slider, Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { IFilter } from '../data/interfaces/filter';
import { useAppDispatch, useAppSelector } from '../hooks/context';
import {
  filtersUpdated, getFilters,
} from '../state/reducers/filtersReducer';
import {
  fetchListingsCount, getFacets, IFacet,
} from '../state/reducers/listingsReducer';

export default function Filter({ showFacets }: { showFacets: boolean }) {
  const dispatch = useAppDispatch();
  // This Component should render the filters and manage their state internally
  // It should also react to filter input and update the listingState when the filter is selected

  const filters = useAppSelector<IFilter[]>(getFilters);
  const facets = useAppSelector<IFacet[]>(getFacets);

  useEffect(() => {
    console.log(filters);
  }, []);

  const handleFilterUpdated = (key: string, value: string) => {
    const updatedFilters = [...filters];
    const filter = JSON.parse(JSON.stringify(updatedFilters.find((f) => f.key === key))) as IFilter;
    if (filter?.selected.includes(value)) {
      filter.selected = filter.selected.filter(
        (selected: string) => selected !== value,
      );
    } else {
      filter.selected.push(value);
    }
    const newFilterState = [...filters.filter((f) => f.key !== filter.key), filter]
      .sort((a, b) => a.order - b.order);
    dispatch(filtersUpdated(newFilterState));
    dispatch(fetchListingsCount(updatedFilters));
  };

  const typeMap = {
    checkbox: <Checkbox />,
    radio: <Radio />,
    slider: <Slider />,
  };

  return (
    <form>
      {filters && filters.map((filter: IFilter) => (
        <FormGroup className="mb-32" key={filter.key}>
          <FormLabel className="mb-16">{filter.title}</FormLabel>
          {filter.options.filter((o) => (showFacets ? !facets || facets.find(
            (f) => f.key === o.key,
          )?.count !== 0 : true))
            .map((option) => (
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
                { showFacets && facets && (
                <Box>
                  {' '}
                  <Typography variant="body2">
                    (
                    {facets.find(
                      (f) => f.key === option.key,
                    )?.count || 0}
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
