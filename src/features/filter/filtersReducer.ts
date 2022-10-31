import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureKeys, Options } from '@listings/types/listing';
import { FacetMapping } from './types/facets';
import { IRange, ISelect, SelectType } from './types/filter';

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
      createFilter('event', 1, 'checkbox'),
      createFilter('coverage', 2, 'checkbox'),
      createFilter('amenities', 3, 'checkbox'),
    ],
  }
};

function createFilter<T extends FeatureKeys>(key: T, order: number, selectType: SelectType): ISelect {
  return {
    selectType: selectType,
    order: order,
    key: key,
    title: FacetMapping[key][0],
    options: Object.entries(FacetMapping[key][1]).map((key) =>
      ({ key: key[0] as Options, value: key[1] as string })),
    selected: [],
  }
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
