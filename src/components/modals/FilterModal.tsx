import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Closeable } from '../../data/interfaces/props';
import { useAppDispatch, useAppSelector } from '../../store/app';
import { IFilter, filtersUpdated, getFilters } from '../../features/filter/filtersReducer';
import { fetchListings, fetchListingsCount, getFilteredCount } from '../../features/listings/listingsReducer';
import Filter from '../../features/filter/Filter';
import { Modal } from '../Modal';

export default function FilterModal({ onClose }: Closeable) {
  const dispatch = useAppDispatch();

  const [initialFilters, setInitialFilters] = useState<IFilter>({ select: [], range: [] });

  const filters = useAppSelector<IFilter>(getFilters);

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
    <Modal onClose={handleCancel} actions={actions} content={content} title="Filters" />
  );
}
