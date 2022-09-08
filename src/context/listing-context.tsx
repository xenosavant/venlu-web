import React, { createContext, useContext, useEffect, useState } from 'react';
import { IFilter } from '../data/interfaces/filter';
import { IListing } from '../data/interfaces/listing';

export type ListingProviderProps = {
    data?: ListingData,
    updateListings?: (filters: IFilter[]) => void
}

export type IFacet = {
    key: string,
    count: number
}

export type ListingData = {
    listings: IListing[],
    facets: IFacet[];
    count: number;
}

export const ListingContext = createContext<{ props: ListingProviderProps, loading: boolean }>({ props: {}, loading: false });

export const ListingProvider = ({ children }: any) => {

    const updateListings = (filters: IFilter[]) => {
        setLoading(true);
        setTimeout(() => fetch('http://localhost:3000/listings')
            .then((res) => res.json())
            .then((data: IListing[]) => {
                const filtered = data.filter((item: IListing) => {
                    return filters.every((filter: IFilter) => {
                        return filter.selected.every((selectedValue: string) => {
                            return item.attributes[filter.key]?.includes(selectedValue)
                        });
                    });
                });
                const facets = getFacets(filters, filtered);
                setListingProps({ ...listingProps, data: { listings: filtered, facets, count: filtered.length } });
                setLoading(false);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            }), 1000);
    }

    function getFacets(filters: IFilter[], listings: IListing[]): IFacet[] {
        // ony update facets for other group
        return filters.map((filter: IFilter) => {
            const options = filter.options.map((option) => {
                const count = listings.filter((listing: IListing) => listing.attributes[filter.key]?.includes(option.key)).length;
                return { key: option.key, count }
            });
            return [...options]
        }).reduce((prev, curr) => [...prev, ...curr], []);
    }

    const [listingProps, setListingProps] = useState<ListingProviderProps>({ updateListings, data: { listings: [], facets: [], count: 0 } });
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <ListingContext.Provider value={{ props: listingProps, loading }}>
            {children}
        </ListingContext.Provider>
    );
}

export const useListingContext = () => useContext(ListingContext)