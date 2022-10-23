import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FacetMapping } from './types/facets';
import { IRange, ISelect, OptionKeys } from './types/filter';

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
        max: 1000000,
      }
    ],
    select: [
      {
        selectType: 'checkbox',
        order: 2,
        key: 'event',
        title: FacetMapping['event'][0],
        options: Object.entries(FacetMapping['event'][1]).map((key) =>
          ({ key: key[0] as OptionKeys, value: key[1] })),
        selected: [],
      },
      {
        selectType: 'checkbox',
        order: 3,
        key: 'coverage',
        title: FacetMapping['coverage'][0],
        options: Object.entries(FacetMapping['coverage'][1]).map((key) =>
          ({ key: key[0] as OptionKeys, value: key[1] })),
        selected: [],
      },
    ],
  }
};

const a = FacetMapping['event'][0];

// factory to build the facet option arrays
/// getOptions<> = (key: keyof FeatureTypes) => {



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
