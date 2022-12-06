import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import sleep from '../../utilities/sleep';
import { IFilter, IRange, ISelect, isRangeFilter, isSelectFilter } from '../filter/types/filter';
import { IListing, Options } from './types/listing';

export type ResponseStatus = 'idle' | 'loading' | 'success' | 'failed';

export interface ListingState {
  listingsData: ListingData;
  listingsStatus: ResponseStatus;
  error: string | undefined;
  filteredCount: number;
  filteredCountStatus: ResponseStatus;
  facets: Facet[] | undefined;
}

export interface ListingData {
  listings: IListing[];
  count: number;
}

export interface FacetBase {
  key: string;
}

export interface RangeFacet extends FacetBase {
  min: number;
  max: number;
}

export interface CountFacet extends FacetBase {
  count: number;
}

export type Facet = RangeFacet | CountFacet;

const initialState: ListingState = {
  listingsStatus: 'idle',
  error: undefined,
  listingsData: { listings: [], count: 0 },
  filteredCount: 0,
  filteredCountStatus: 'idle',
  facets: undefined,
};

function filterData(data: IListing[], filters: IFilter[]): IListing[] {
  const filtered = data.filter((item: IListing) =>
    filters.every((filter) => {
      if (isSelectFilter(filter)) {
        return filter.selected?.every((selectedValue: Options) =>
          (item.features[filter.key] as Options[]).includes(selectedValue)
        );
      } else {
        const max = filter.max === filter.range[1] ? Infinity : filter.max;
        return (item.features[filter.key] as number) >= filter.min && (item.features[filter.key] as number) <= max;
      }
    })
  );
  return filtered;
}

function calculateSelectFacets(filters: ISelect[], listings: IListing[]): Facet[] {
  return filters
    .map((filter: ISelect) => {
      const options = (filter.options || []).map((option) => {
        const count = listings.filter((listing: IListing) =>
          (listing.features[filter.key] as Options[])?.includes(option.key)
        ).length;
        return { key: option.key as string, count };
      });
      return [...options];
    })
    .reduce((acc, curr) => [...acc, ...curr], []);
}

function calculateRangeFacets(filters: IRange[], listings: IListing[]): RangeFacet[] {
  return filters.map((filter: IRange) =>
    listings.reduce<RangeFacet>(
      (acc: RangeFacet, curr: IListing) => {
        const min = Math.min(acc.min, curr.features[filter.key] as number);
        const max = Math.max(acc.max, curr.features[filter.key] as number);
        return { key: filter.key, min, max };
      },
      { key: filter.key, min: Infinity, max: -Infinity }
    )
  );
}

export const fetchListings = createAsyncThunk('listings/fetchListingsStatus', async (filters: IFilter[] = []) => {
  await sleep();
  const response = await axios.get<IListing[]>(`${import.meta.env.VITE_BASE_URL}/listings`);
  const filtered = filterData(response.data, filters);
  const selectFacets = calculateSelectFacets(filters.filter((f) => isSelectFilter(f)) as ISelect[], filtered);
  const rangeFacets = calculateRangeFacets(filters.filter((f) => isRangeFilter(f)) as IRange[], response.data);
  return {
    listings: filtered,
    facets: [...rangeFacets, ...selectFacets],
    count: filtered.length,
  };
});

export const fetchListingsCount = createAsyncThunk('listings/fetchListingsCount', async (filters: IFilter[]) => {
  await sleep();
  const response = await axios.get<IListing[]>(`${import.meta.env.VITE_BASE_URL}/listings`);
  const filtered = filterData(response.data, filters);
  return { count: filtered.length };
});

const listingSlice = createSlice({
  name: 'listing',
  initialState,
  reducers: {
    filterCountUpdated: (state, action: PayloadAction<number>) => {
      state.filteredCount = action.payload;
    },
    listingsUpdated: (state, action: PayloadAction<IListing[]>) => {
      state.listingsData.listings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.listingsStatus = 'loading';
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.listingsData = { listings: action.payload.listings, count: action.payload.count };
        state.facets = action.payload.facets as Facet[];
        state.listingsStatus = 'success';
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.error = action.error.message;
        state.listingsStatus = 'failed';
      })
      .addCase(fetchListingsCount.fulfilled, (state, action) => {
        state.filteredCount = action.payload.count;
      });
  },
});

export const selectListings = (state: any) => state.listing.listingsData;
export const getListingsStatus = (state: any) => state.listing.listingsStatus;
export const getListingsError = (state: any) => state.listing.error;
export const getFilteredCount = (state: any) => state.listing.filteredCount;
export const getFacets = (state: any) => state.listing.facets;

export const { filterCountUpdated, listingsUpdated } = listingSlice.actions;
export default listingSlice.reducer;
