import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IListing } from '../../data/interfaces/listing';
import { IFilter } from '../../data/interfaces/filter';

export type ResponseStatus = 'idle' | 'loading' | 'success' | 'failed';

export interface ListingState {
  listingsData: ListingData
  listingsStatus: ResponseStatus
  error: string | undefined
  filteredCount: number
}

export interface ListingData {
  listings: IListing[]
  facets: IFacet[]
  count: number
}

export interface IFacet {
  key: string
  count: number
}

const initialState: ListingState = {
  listingsStatus: 'idle',
  error: undefined,
  listingsData: { listings: [], facets: [], count: 0 },
  filteredCount: 0,
};

function filterData(data: IListing[], filters: IFilter[]): IListing[] {
  return data.filter((item: IListing) => filters.every(
    (filter: IFilter) => filter.selected.every(
      (selectedValue: string) => item.attributes[filter.key]?.includes(selectedValue),
    ),
  ));
}

function getFacets(filters: IFilter[], listings: IListing[]): IFacet[] {
  return filters.map((filter: IFilter) => {
    const options = filter.options.map((option) => {
      const count = listings.filter(
        (listing: IListing) => listing.attributes[filter.key]?.includes(option.key),
      ).length;
      return { key: option.key, count };
    });
    return [...options];
  }).reduce((prev, curr) => [...prev, ...curr], []);
}

export const fetchListings = createAsyncThunk(
  'listings/fetchListingsStatus',
  async (filters: IFilter[]) => {
    const response = await fetch('http://localhost:3000/listings');
    const data = await response.json();
    const filtered = filterData(data, filters);
    const facets = getFacets(filters, filtered);
    return { listings: filtered, facets, count: filtered.length };
  },
);

export const fetchListingCount = createAsyncThunk(
  'listings/fetchListingsCount',
  async (filters: IFilter[]) => {
    const response = await fetch('http://localhost:3000/listings');
    const data = await response.json();
    const filtered = filterData(data, filters);
    return { filteredCount: filtered.length };
  },
);

const listingSlice = createSlice({
  name: 'listing',
  initialState,
  reducers: {
    filterCountUpdated: (state, action: PayloadAction<number>) => {
      state.filteredCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.listingsStatus = 'loading';
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.listingsData = action.payload;
        state.listingsStatus = 'success';
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.error = action.error.message;
        state.listingsStatus = 'failed';
      })
      .addCase(fetchListingCount.fulfilled, (state, action) => {
        state.filteredCount = action.payload.filteredCount;
      });
  },
});

export const selectListings = (state: any) => state.listing.listingsData;
export const getListingsStatus = (state: any) => state.listing.listingsStatus;
export const getListingsError = (state: any) => state.listing.error;

export const { filterCountUpdated } = listingSlice.actions;
export default listingSlice.reducer;
