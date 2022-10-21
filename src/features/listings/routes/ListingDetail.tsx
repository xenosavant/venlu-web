import { Box, Container } from '@mui/system';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useGet } from '../../../hooks/api';
import { IListing } from '../types/listing';

export default function ListingDetail() {
  const { id } = useParams();
  const { data, loading } = useGet<IListing>(`listings/${id}`);
  const listing = data;

  useEffect(() => {

  }, [data]);

  return (
    <Container maxWidth="lg" className="pt-24">
      <Typography variant="h5" className="pb-16">
        {' '}
        {listing?.title}
        {' '}
      </Typography>
      {!loading
        && (
          <Box className="overflow-hidden rounded-lg aspect-video">
            <img alt="" src={`/${listing?.images[listing?.primaryImageIndex || 0]}`} className="object-cover min-w-full min-h-full" />
          </Box>
        )}
    </Container>
  );
}
