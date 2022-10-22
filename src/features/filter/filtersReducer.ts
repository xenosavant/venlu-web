import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureFacetKeys, FeatureFacet } from './types/facets';
import { IRange, ISelect } from './types/filter';

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
        key: 'type',
        title: 'Event type',
        options: [{ key: 'wedding', value: 'Wedding' }, { key: 'reception', value: 'Reception' },
        { key: 'bridalShower', value: 'Bridal shower' }, { key: 'bachelorette', value: 'Bachelorette party' },
        { key: 'bachelor', value: 'Bachelor party' }],
        selected: [],
      },
      {
        selectType: 'checkbox',
        order: 3,
        key: 'coverage',
        title: 'Space',
        options: [{ key: 'indoor', value: 'Indoor' }, { key: 'outdoor', value: 'Outdoor' }],
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
