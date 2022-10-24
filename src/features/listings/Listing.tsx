import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HasListing } from '@data/interfaces/props';

export default function Listing({ listing }: HasListing) {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(`/listings/${listing?.id}`)}
      sx={{ gridTemplateRows: 'min-content', lineHeight: 0 }}
      className="relative cursor-pointer m-16"
    >
      <div className="overflow-hidden rounded-lg aspect-square">
        <img alt="" src={`/${listing.images[listing.primaryImageIndex || 0]}`} className="object-cover min-w-full min-h-full" />
      </div>
      <Typography className="pt-8 inline-block" variant="h6">
        {listing.title}
      </Typography>
      <Typography className="text-zinc-500" variant="subtitle2">
        {`$${(listing.price / 100).toFixed(2)}` + '/ day'}
      </Typography>
    </Box>
  );
}
