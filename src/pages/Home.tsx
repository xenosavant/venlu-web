import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import Listing from "../components/Listing";
import { useListingContext } from "../context/listing-context";

export function Home() {

    const { props, loading } = useListingContext();

    useEffect(() => {

    }, [loading])

    return (
        <>
            <Box>{loading && <div className="m-auto w-fit"><CircularProgress className="mt-24" size="24px" color="primary" /></div>}</Box>
            <Box sx={{
                gridTemplateRows: 'auto',
                gridTemplateColumns: {
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                    xl: "repeat(4, 1fr)",
                }
            }
            } className="grid">
                {!loading && props?.data?.listings.map((listing) => (
                    <Listing key={listing.id} listing={listing} />
                ))}
            </Box>
        </>
    )
}