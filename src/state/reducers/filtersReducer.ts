import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilter } from '../../data/interfaces/filter';

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
  },
});

export const { filtersUpdated } = filtersSlice.actions;

export const getFilters = (state: any) => state.filter.filters;

export default filtersSlice.reducer;
