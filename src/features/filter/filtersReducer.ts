import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ListingFeatureNumberKeys,
  ListingFeatureOptionKeys,
  Options,
} from '@listings/types/listing';
import { FacetMapping } from './types/facets';
import { IRange, ISelect, SelectType } from './types/filter';

export type FilterType = 'checkbox' | 'radio';

export interface IFilter {
  select: ISelect[];
  range: IRange[];
}

export interface FilterState {
  filters: IFilter;
}

const initialState: FilterState = {
  filters: {
    range: [createRangeFilter('price', 1)],
    select: [
      createSelectFilter('event', 1, 'checkbox'),
      createSelectFilter('coverage', 2, 'checkbox'),
      createSelectFilter('amenities', 3, 'checkbox'),
    ],
  },
};

function createSelectFilter<T extends ListingFeatureOptionKeys>(
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

function createRangeFilter<T extends ListingFeatureNumberKeys>(key: T, order: number): IRange {
  const range = FacetMapping[key][1] as [number, number];
  return {
    order: order,
    key: key,
    title: FacetMapping[key][0],
    min: range[0],
    max: range[1],
  };
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    filtersUpdated: (state, action: PayloadAction<IFilter>) => {
      state.filters = action.payload;
    },
  },
});

export const { filtersUpdated } = filtersSlice.actions;

export const getFilters = (state: any) => state.filter.filters;

export default filtersSlice.reducer;
