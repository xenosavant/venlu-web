import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { IFilter } from '../../data/interfaces/filter';
import { useAppDispatch, useAppSelector } from '../../hooks/context';
import { filtersUpdated, getFilters } from '../../state/reducers/filtersReducer';
import { fetchListings, fetchListingsCount, getFilteredCount } from '../../state/reducers/listingsReducer';
import Filter from '../Filter';
import { Modal } from '../Modal';

export default function FilterModal({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();

  const [initialFilters, setInitialFilters] = useState<IFilter[]>([]);

  const filters = useAppSelector<IFilter[]>(getFilters);

  const handleApplyFilters = () => {
    dispatch(fetchListings(filters));
    onClose();
  };

  const handleCancel = () => {
    dispatch(filtersUpdated(initialFilters));
    onClose();
  };

  const filteredCount = useAppSelector<number>(getFilteredCount);

  useEffect(() => {
    dispatch(fetchListingsCount(filters));
  }, [filters]);

  useEffect(() => {
    setInitialFilters(filters);
  }, []);

  const actions = (
    <Button variant="contained" onClick={() => handleApplyFilters()}>
      {filteredCount > 0
      && (
      <>
        Show
        {filteredCount && ` ${filteredCount} `}
        listings
      </>
      )}
      {filteredCount === 0 && 'No listings match'}
    </Button>
  );
  const content = <Filter showFacets={false} />;

  return (
    <Modal onClose={handleCancel} actions={actions} content={content} title="Fiters" />
  );
}
