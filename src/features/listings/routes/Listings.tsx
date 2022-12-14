import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/app';
import { getFilters } from '@filter/filtersReducer';
import { selectListings, getListingsStatus, fetchListings, ResponseStatus, ListingData } from '../listingsReducer';
import { selectUiState, UiState } from '@store/reducers/uiReducer';
import ListingsList from '@listings/components/ListingsList';
import { IFilter } from '@filter/types/filter';

export default function Listings() {
  const dispatch = useAppDispatch();
  const listingsData = useAppSelector<ListingData>(selectListings);
  const filters = useAppSelector<IFilter[]>(getFilters);
  const listingsStatus = useAppSelector<ResponseStatus>(getListingsStatus);
  const uiState = useAppSelector<UiState>(selectUiState);

  useEffect(() => {
    dispatch(fetchListings());
  }, []);

  useEffect(() => {
    if (!uiState.filterModalOpen) {
      dispatch(fetchListings(filters));
    }
  }, [filters]);

  return (
    <>
      <ListingsList listings={listingsData} listingsStatus={listingsStatus} />
    </>
  );
}
