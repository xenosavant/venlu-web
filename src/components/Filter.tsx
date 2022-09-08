import { UpdateOutlined } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, FormGroup, FormLabel, Radio, Slider, Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useListingContext } from "../context/listing-context";
import { IFilter } from "../data/interfaces/filter";
import { IListing } from "../data/interfaces/listing";


export function Filter() {

    const { props } = useListingContext();

    function filterItems(filters: IFilter[]) {
        props.updateListings && props.updateListings(filters);
    }

    return (
        <FilterView filterItems={filterItems} />
    )
}


export function FilterView({ filterItems }: { filterItems: (filters: IFilter[]) => void }) {
    // This Component should render the filters and manage their state internally
    // It should also react to filter input and update the listingState when the filter is selected
    const defaultFilters: IFilter[] = [
        {
            type: 'checkbox', key: 'type', title: 'Event type',
            options: [{ key: 'wedding', value: 'Wedding' }, { key: 'reception', value: 'Reception' },
            { key: 'bridal-shower', value: 'Bridal shower' }, { key: 'bachelorette', value: 'Bachelorette party' },
            { key: 'bachelor', value: 'Bachelor party' }],
            selected: []
        },
        {
            type: 'checkbox', key: 'coverage', title: 'Space',
            options: [{ key: 'indoor', value: 'Indoor' }, { key: 'outdoor', value: 'Outdoor' }],
            selected: []
        }
    ]

    const [filters, setFilters] = useState<IFilter[]>(defaultFilters);
    const { props } = useListingContext();

    // debounce this
    const handleFilterChange = (key: string, value: string) => {
        console.log('on change');
        const filter = filters.find((filter: IFilter) => filter.key === key);
        filter?.selected.includes(value) ? filter.selected = filter.selected.filter((selected: string) => selected !== value) : filter?.selected.push(value);
        filterItems(filters);
    }

    useEffect(() => {
        if (filters?.length) {
            filters.forEach(
                (filter: IFilter) => {
                    filter.options.forEach(
                        (option) => {
                            option.count = props?.data?.facets.find((facet) => facet.key === option.key)?.count;
                        }
                    )
                }
            );
            setFilters([...filters]);
        }
    }, [props?.data?.facets])

    useEffect(() => {
        filterItems && filterItems(defaultFilters);
    }, [])

    useEffect(() => {
        console.log(JSON.stringify(props?.data?.count));
    }, [props])


    const typeMap = {
        checkbox: <Checkbox />,
        radio: <Radio />,
        slider: <Slider />
    }

    return (
        <form>
            <>
                <Box className="mb-24">
                    <Typography sx={{ fontWeight: "300" }} variant="h5" component="h2" >Filters</Typography>
                </Box>
                {filters.map((filter: IFilter) => {
                    return filter.options.length && (
                        <FormGroup className="mb-32" key={filter.key}>
                            <FormLabel className="mb-16">{filter.title}</FormLabel>
                            {filter.options.filter(o => { return o?.count !== 0 }).map((option) => {
                                return (
                                    <div key={option.key} className="flex items-center">
                                        <FormControlLabel
                                            checked={filter.selected.includes(option.key)}
                                            key={option.key}
                                            control={typeMap[filter.type]}
                                            label={option.value}
                                            onChange={(e) => {
                                                handleFilterChange(filter.key, option.key)
                                            }}
                                        />
                                        {option.count && <Box> <Typography variant="body2">({option.count})</Typography></Box>}
                                    </div>
                                )
                            })}
                        </FormGroup>
                    )
                })}
            </>
        </form>
    )
}