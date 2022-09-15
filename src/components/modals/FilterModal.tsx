import { Button } from '@mui/material';
import { IFilter } from '../../data/interfaces/filter';
import { Filter } from '../Filter';
import { Modal } from '../Modal';

export function FilterModal({ onClose }: { onClose: () => void }) {
  // const handleApplyFilters = () => {
  //     listingProviderProps?.updateListings && listingProviderProps.updateListings(listingProviderProps.filters || []);
  //     onClose();
  // }

  // const handleFilterChanged = (filters: IFilter[]) => {
  //     listingProviderProps?.updateFilters && listingProviderProps.updateFilters(filters);
  // }

  // const actions = <Button onClick={() => handleApplyFilters()}>Show {listingProviderProps.tempCount} listings</Button>
  // const content = <Filter onFilterChanged={handleFilterChanged} />

  return (
    <> </>
  // <Modal onClose={handleApplyFilters} actions={actions} content={content} title='Fiters' />
  );
}
