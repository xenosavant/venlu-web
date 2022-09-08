import { Box, Typography } from '@mui/material';
import { IListing } from '../data/interfaces/listing';
export default function Listing({ listing }: { listing: IListing }) {

    return (
        <Box sx={{ gridTemplateRows: 'min-content', lineHeight: 0 }} className="relative m-16">
            <div className="overflow-hidden rounded-lg aspect-square">
                <img src={listing.images[listing.primaryImageId || 0]} className="object-cover min-w-full min-h-full" />
            </div>
            <Typography className="pt-8 inline-block" variant="h6">
                {listing.title}
            </Typography>
            <Typography className="text-zinc-500" variant="subtitle2">
                {'$' + (listing.price / 100).toFixed(2)} / {listing.duration}
            </Typography>
        </Box>
    )
}
