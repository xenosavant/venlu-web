import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRange, ISelect } from '../../data/interfaces/filter';

export type FilterType = 'checkbox' | 'radio';

export interface FiltersState {
  filters: (ISelect | IRange)[];
}

const initialState: FiltersState = {
  filters: [
    {
      type: 'range',
      order: 1,
      key: 'price',
      title: 'Price range',
      min: 0,
      max: 10000,
    },
    {
      type: 'select',
      selectType: 'checkbox',
      order: 2,
      key: 'type',
      title: 'Event type',
      options: [{ key: 'wedding', value: 'Wedding' }, { key: 'reception', value: 'Reception' },
        { key: 'bridal-shower', value: 'Bridal shower' }, { key: 'bachelorette', value: 'Bachelorette party' },
        { key: 'bachelor', value: 'Bachelor party' }],
      selected: [],
    },
    {
      type: 'select',
      selectType: 'checkbox',
      order: 3,
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
    filtersUpdated: (state, action: PayloadAction<(ISelect | IRange)[]>) => {
      state.filters = action.payload;
    },
  },
});

export const { filtersUpdated } = filtersSlice.actions;

export const getFilters = (state: any) => state.filter.filters;

export default filtersSlice.reducer;
