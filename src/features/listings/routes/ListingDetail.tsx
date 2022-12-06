import { Container } from '@mui/system';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { useGet } from '@hooks/useApi';
import { IListing } from '../types/listing';

export default function ListingDetail() {
  const { id } = useParams();
  const { data, loading } = useGet<IListing>(`listings/${id}`);
  const listing = data;
  const navigate = useNavigate();

  useEffect(() => {}, [data]);

  return (
    <Container maxWidth="lg" className="pt-24">
      <Typography variant="h5" className="pb-16">
        {' '}
        {listing?.title}{' '}
      </Typography>
      {!loading && (
        <>
          <div className="overflow-hidden rounded-lg aspect-video">
            <img
              alt=""
              src={`/${listing?.images[listing?.primaryImageIndex || 0]}`}
              className="object-cover min-w-full min-h-full"
            />
          </div>
          <Button onClick={() => navigate(`/book/${listing?.id}`)}>Book</Button>
        </>
      )}
    </Container>
  );
}
