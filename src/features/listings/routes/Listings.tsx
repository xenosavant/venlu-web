import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/app';
import { IFilter, getFilters } from '@filter/filtersReducer';
import { selectListings, getListingsStatus, fetchListings, ResponseStatus, ListingData } from '../listingsReducer';
import { selectUiState, UiState } from '@store/reducers/uiReducer';
import Listing from '@listings/Listing';

export default function Home() {
  const dispatch = useAppDispatch();
  const listingsData = useAppSelector<ListingData>(selectListings);
  const filters = useAppSelector<IFilter>(getFilters);
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
      <div>
        {listingsStatus === 'loading' && (
          <div className="m-auto w-fit">
            <CircularProgress className="mt-24" size="24px" color="primary" />
          </div>
        )}
      </div>
      <div>{listingsStatus === 'failed' && <Typography className="m-auto w-fit text-red-700"> ERROR </Typography>}</div>
      <Box
        sx={{
          gridTemplateRows: 'auto',
          gridTemplateColumns: {
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)',
          },
        }}
        className="grid"
      >
        {listingsStatus === 'success' &&
          listingsData.listings.map((listing) => <Listing key={listing.id} listing={listing} />)}
      </Box>
    </>
  );
}
