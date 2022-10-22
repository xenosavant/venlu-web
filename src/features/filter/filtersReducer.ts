import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CoverageOptions, EventOptions } from '../listings/types/listing';
import { FacetMapping } from './types/facets';
import { IRange, ISelect, OptionKey } from './types/filter';

export type FilterType = 'checkbox' | 'radio';

export interface IFilter {
  select: ISelect[],
  range: IRange[],
}

export interface FilterState {
  filters: IFilter
}

const initialState: FilterState = {
  filters: {
    range: [
      {
        order: 1,
        key: 'price',
        title: 'Price range',
        min: 0,
        max: 10000,
      }
    ],
    select: [
      {
        selectType: 'checkbox',
        order: 2,
        key: 'event',
        title: 'Event type',
        options: Object.entries(FacetMapping['event']).map((key) =>
          ({ key: key[0] as OptionKey, value: key[1] })),
        selected: [],
      },
      {
        selectType: 'checkbox',
        order: 3,
        key: 'coverage',
        title: 'Space',
        options: Object.entries(FacetMapping['coverage']).map((key) =>
          ({ key: key[0] as OptionKey, value: key[1] })),
        selected: [],
      },
    ],
  }
};

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
