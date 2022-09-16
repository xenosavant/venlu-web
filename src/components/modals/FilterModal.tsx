import { Button } from '@mui/material';
import Filter from '../Filter';
import { Modal } from '../Modal';

export default function FilterModal({ onClose }: { onClose: () => void }) {
  const handleApplyFilters = () => {
    onClose();
  };

  const actions = (
    <Button onClick={() => handleApplyFilters()}>
      Show
      listings
    </Button>
  );
  const content = <Filter />;

  return (
    <Modal onClose={handleApplyFilters} actions={actions} content={content} title="Fiters" />
  );
}
