import * as Redux from 'react-redux';
import { expect, vi, describe, beforeEach, test } from 'vitest';
import { createRangeFilter, createSelectFilter } from './filtersReducer';
import { screen } from '@testing-library/react';
import Filter from './Filter';
import { ListingState } from '@listings/listingsReducer';
import { UiState } from '@store/reducers/uiReducer';
import { IRange, ISelect } from './types/filter';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import renderWithProviders from '@utilities/test';
import { useAppSelector } from '@store/app';
import sleep from '@utilities/sleep';
import { IListing } from '@listings/types/listing';

const priceFilter = {
  order: 1,
  key: 'price',
  title: 'Price range',
  min: 0,
  max: 10000,
} as const;

const listing = {
  id: '1',
  title: 'Listing 9',
  images: ['./src/assets/listings/listing9.jpg'],
  primaryImageIndex: 0,
  capacity: 123,
  parkingCapacity: 123,
  description: 'Listing 3 description',
  features: {
    event: ['wedding', 'reception'],
    coverage: ['outdoor'],
    amenities: [],
    price: 15000,
  },
} as IListing;

const listingState = {
  listingsStatus: 'idle',
  error: undefined,
  listingsData: {
    listings: [listing],
    count: 0,
  },
  filteredCount: 0,
  filteredCountStatus: 'idle',
  facets: [{ key: 'price', min: 100, max: 100000 } as IRange],
} as ListingState;

describe('filter tests', () => {
  test('filters load', async () => {
    const { getByTestId, store, baseElement, container } = renderWithProviders(<Filter showFacets={false} />, {
      preloadedState: {
        listing: {
          ...listingState,
          listingsData: {
            listings: [listing],
            count: 0,
          },
        },
        filter: {
          filters: {
            range: [priceFilter],
            select: [],
          },
        },
      },
    });

    const sliderLabel = await screen.getByText('Price range');
    const sliderInput = await screen.getByTestId('price');

    expect(sliderLabel).toBeTruthy();
    expect(sliderInput).toBeTruthy();
  });

  test('select filters show when there are no listings and facets are empty', async () => {
    const { getByTestId, store, baseElement, container } = renderWithProviders(<Filter showFacets={false} />, {
      preloadedState: {
        listing: {
          ...listingState,
          listingsData: {
            listings: [],
            count: 0,
          },
        },
        filter: {
          filters: {
            range: [priceFilter],
            select: [],
          },
        },
      },
    });
  });

  // TODO: make sure filters udate properly when clicked
});
