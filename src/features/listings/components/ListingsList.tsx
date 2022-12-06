import { HasListings } from '@datainterfaces/props';
import { Box, CircularProgress, Typography } from '@mui/material';
import Listing from './Listing';

const Listings: React.FC<HasListings> = ({ listings, listingsStatus }) => {
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
          listings.listings.map((listing) => <Listing key={listing.id} listing={listing} />)}
      </Box>
    </>
  );
};

export default Listings;
