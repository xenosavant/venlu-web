import { jsx } from '@emotion/react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useState } from 'react';
import { IListing } from '../../data/interfaces/listing';
import { CanUpdate, Closeable, HasListing } from '../../data/interfaces/props';
import { BasicInfo, PhotoUpload } from '../CreateListing';

export default function FilterModal({ onClose, listing }: Closeable & HasListing) {

  const [listingState, setlistingState] = useState<IListing>(listing);

  const steps: JSX.Element[] = [
    <BasicInfo listing={listingState} update={updateStep} />,
    <PhotoUpload listing={listingState} update={updateStep} />,
    <BasicInfo listing={listingState} update={updateStep} />,
  ]

  const [step, setStep] = useState(0);
  const [content, setContent] = useState(steps[0]);

  const handleCancel = () => onClose();

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      setContent(steps[step]);

    }
  }

  const previousStep = () => {
    if (step > 0) {
      setStep(step - 1);
      setContent(steps[step]);
    }
  }

  const save = () => {
    // api call to save listing
  }

  function updateStep(listing: Partial<IListing>) {
    setlistingState({ ...listingState, ...listing });
  };


  const actions = (
 
  );

  return (
    <Box>
      <Typography>title</Typography>
      {content}
      <Box>
        <Button variant="contained">
          Create Listing
        </Button>
      </Box>

    </Box>
  );
}
