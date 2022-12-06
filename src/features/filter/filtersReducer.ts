import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListingFeatureNumberKeys, ListingFeatureOptionKeys, Options } from '@listings/types/listing';
import { FacetMapping } from './types/facets';
import { IFilter, IRange, ISelect, SelectType } from './types/filter';

export type FilterType = 'checkbox' | 'radio';

export interface FilterState {
  filters: IFilter[];
}

const initialState: FilterState = {
  filters: [
    createRangeFilter('price', 1),
    createSelectFilter('event', 2, 'checkbox'),
    createSelectFilter('coverage', 3, 'checkbox'),
    createSelectFilter('amenities', 4, 'checkbox'),
  ],
};

export function createSelectFilter<T extends ListingFeatureOptionKeys>(
  key: T,
  order: number,
  selectType: SelectType
): ISelect {
  return {
    selectType: selectType,
    order: order,
    key: key,
    title: FacetMapping[key][0],
    options: Object.entries(FacetMapping[key][1]).map((key) => ({
      key: key[0] as Options,
      value: key[1] as string,
    })),
    selected: [],
  };
}

export function createRangeFilter<T extends ListingFeatureNumberKeys>(key: T, order: number): IRange {
  const range = FacetMapping[key][1] as [number, number];
  return {
    order: order,
    key: key,
    title: FacetMapping[key][0],
    min: range[0],
    max: range[1],
    range: range,
  };
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    filtersUpdated: (state, action: PayloadAction<IFilter[]>) => {
      state.filters = action.payload;
    },
  },
});

export const { filtersUpdated } = filtersSlice.actions;

export const getFilters = (state: any) => state.filter.filters;

export default filtersSlice.reducer;
