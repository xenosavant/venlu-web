import { Box, Container } from "@mui/system";
import { IListing } from "../data/interfaces/listing";

export function Listing(props: { listing: IListing }) {


    return (
        <>
            <Container maxWidth="lg">
                <Box>
                    <img />
                </Box>
            </Container>
        </>
    )
}