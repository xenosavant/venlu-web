import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilter } from '../../data/interfaces/filter';
import { IFacet } from './listingsReducer';

function setFacets(facets: IFacet[], filters: IFilter[]) {
  filters.forEach(
    (filter: IFilter) => {
      filter.options.forEach(
        (option) => {
          option.count = facets.find((facet) => facet.key === option.key)?.count;
        },
      );
    },
  );
}

export type FilterType = 'checkbox' | 'radio';

export interface FiltersState {
  filters: IFilter[];
}

const initialState: FiltersState = {
  filters: [
    {
      type: 'checkbox',
      order: 1,
      key: 'type',
      title: 'Event type',
      options: [{ key: 'wedding', value: 'Wedding' }, { key: 'reception', value: 'Reception' },
        { key: 'bridal-shower', value: 'Bridal shower' }, { key: 'bachelorette', value: 'Bachelorette party' },
        { key: 'bachelor', value: 'Bachelor party' }],
      selected: [],
    },
    {
      type: 'checkbox',
      order: 2,
      key: 'coverage',
      title: 'Space',
      options: [{ key: 'indoor', value: 'Indoor' }, { key: 'outdoor', value: 'Outdoor' }],
      selected: [],
    },
  ],
};

const filtersSlice = createSlice({
  name: 'listing',
  initialState,
  reducers: {
    filtersUpdated: (state, action: PayloadAction<IFilter[]>) => {
      state.filters = action.payload;
    },
    filterFacetsUpdated: (state, action: PayloadAction<IFacet[]>) => {
      setFacets(action.payload, state.filters);
    },
  },
});

export const { filtersUpdated, filterFacetsUpdated } = filtersSlice.actions;

export const selectFilters = (state: any) => state.filter;

export default filtersSlice.reducer;
