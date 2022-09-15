import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import Listing from '../components/Listing';
import { useAppDispatch, useAppSelector } from '../hooks/context';
import {
  selectListings, getListingsStatus, fetchListings, ResponseStatus, ListingData,
} from '../state/reducers/listingsReducer';

export default function Home() {
  const dispatch = useAppDispatch();
  const listingsData = useAppSelector<ListingData>(selectListings);
  const listingsStatus = useAppSelector<ResponseStatus>(getListingsStatus);

  useEffect(() => {
    dispatch(fetchListings([]));
  }, []);

  return (
    <>
      <Box />
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
        {listingsStatus === 'loading' && <div className="m-auto w-fit"><CircularProgress className="mt-24" size="24px" color="primary" /></div>}
        {listingsStatus === 'failed' && <Typography className="m-auto w-fit text-red-700"> ERROR </Typography>}
        {listingsStatus === 'success' && listingsData.listings.map((listing) => (
          <Listing key={listing.id} listing={listing} />
        ))}
      </Box>
    </>
  );
}
