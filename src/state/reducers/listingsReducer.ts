import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IListing } from '../../data/interfaces/listing'
import { IFilter } from '../../data/interfaces/filter'

export type ResponseStatus = 'idle' | 'loading' | 'success' | 'failed'

export interface ListingState {
  listingsData: ListingData
  listingsStatus: ResponseStatus
  error: string | undefined
  filters: IFilter[]
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
  filters: [],
  filteredCount: 0
}

export const fetchListings = createAsyncThunk(
  'listings/fetchListingsStatus',
  async (filters: IFilter[]) => {
    const response = await fetch('http://localhost:3000/listings')
    const data = await response.json()
    const filtered = filterData(data, filters)
    const facets = getFacets(filters, filtered)
    return { listings: filtered, facets, count: filtered.length }
  })

// const updateListings = (filters: IFilter[]) => {
//     setLoading(true);
//     setTimeout(() => fetch(`${BASE_URL}/listings`)
//         .then((res) => res.json())
//         .then((data: IListing[]) => {
//             const filtered = filterData(data, filters);
//             const facets = getFacets(filters, filtered);
//             setFacets(facets, filters);
//             console.log(listingProps)
//             setListingProps({ ...listingProps, filters: filters, data: { listings: filtered, count: filtered.length } });
//             setLoading(false);
//         }).catch((err) => {
//             setLoading(false);
//         }), 1000);
// }

// const updateFilters = (filters: IFilter[]) => {
//     // only update the filters and the count here
//     setTimeout(() => fetch(`${BASE_URL}/listings`)
//         .then((res) => res.json())
//         .then((data: IListing[]) => {
//             const filtered = filterData(data, filters);
//             const facets = getFacets(filters, filtered);
//             setFacets(facets, filters);
//             console.log(listingProps)
//             setListingProps({ ...listingProps, tempCount: filtered.length, filters: filters });
//             setLoading(false);
//         }).catch((err) => {
//             setLoading(false);
//         }), 1000);
// }

function getFacets (filters: IFilter[], listings: IListing[]): IFacet[] {
  return filters.map((filter: IFilter) => {
    const options = filter.options.map((option) => {
      const count = listings.filter((listing: IListing) => listing.attributes[filter.key]?.includes(option.key)).length
      return { key: option.key, count }
    })
    return [...options]
  }).reduce((prev, curr) => [...prev, ...curr], [])
}

function setFacets (facets: IFacet[], filters: IFilter[]) {
  filters.forEach(
    (filter: IFilter) => {
      filter.options.forEach(
        (option) => {
          option.count = facets.find((facet) => facet.key === option.key)?.count
        }
      )
    }
  )
}

function filterData (data: IListing[], filters: IFilter[]): IListing[] {
  return data.filter((item: IListing) => {
    return filters.every((filter: IFilter) => {
      return filter.selected.every((selectedValue: string) => {
        return item.attributes[filter.key]?.includes(selectedValue)
      })
    })
  })
}

const listingSlice = createSlice({
  name: 'listing',
  initialState,
  reducers: {
    filtersUpdated: (state, action: PayloadAction<IFilter[]>) => { state.filters = action.payload },
    filterCountUpdated: (state, action: PayloadAction<number>) => { state.filteredCount = action.payload }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.listingsStatus = 'loading'
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.listingsData = action.payload
        console.log(state.listingsData)
        state.listingsStatus = 'success'
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.error = action.error.message
        state.listingsStatus = 'failed'
      })
  }
})

export const selectListings = (state: any) => state.listing.listingsData
export const getListingsStatus = (state: any) => state.listing.listingsStatus
export const getListingsError = (state: any) => state.listing.error

export const { filtersUpdated, filterCountUpdated } = listingSlice.actions
export default listingSlice.reducer
