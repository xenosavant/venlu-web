import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HasListing } from '@data/interfaces/props';

const Listing: React.FC<HasListing> = ({ listing }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/listings/${listing?.id}`)} className="relative cursor-pointer m-16">
      <div className="overflow-hidden rounded-lg aspect-square">
        <img
          alt=""
          src={`/${listing.images[listing.primaryImageIndex || 0]}`}
          className="object-cover min-w-full min-h-full"
        />
      </div>
      <Typography className="pt-8 inline-block" variant="h6">
        {listing.title}
      </Typography>
      <Typography className="text-zinc-500" variant="subtitle2">
        {`$${listing.features.price.toFixed(2)}` + ' / hour'}
      </Typography>
    </div>
  );
};

export default Listing;
