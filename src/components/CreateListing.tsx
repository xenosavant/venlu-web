import {
  Button,
  FormGroup, FormLabel, IconButton, InputAdornment, OutlinedInput, TextField, Typography,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { IListing } from '../data/interfaces/listing';
import { CanUpdate, HasListing } from '../data/interfaces/props';
import { createListingModalClosed } from '../state/reducers/uiReducer';
import { useAppDispatch } from '../hooks/context';

export function CreateListing({ listing }: HasListing) {
  const [listingState, setlistingState] = useState<Partial<IListing>>(listing);
  const [step, setStep] = useState(0);
  const dispatch = useAppDispatch();


  const setProperty = (prop: keyof IListing) => (e: any) => {
    setlistingState({ ...listing, [prop]: e.target.value });
  };

  const BasicInfo = <Box>
    <FormGroup className="mb-32 mt-16">
      <FormLabel className="mb-16">Name</FormLabel>
      <TextField onChange={setProperty('title')} value={listingState.title} />
    </FormGroup>
    <FormGroup className="mb-32 mt-16">
      <FormLabel className="mb-16">Description</FormLabel>
      <TextField onChange={setProperty('description')} multiline value={listingState.description} />
    </FormGroup>
    <FormGroup className="mb-32 mt-16">
      <FormLabel className="mb-16">Price</FormLabel>
      <OutlinedInput
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]?.[0-9]*' }}
        onChange={setProperty('price')}
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
        value={listingState.price}
      />
    </FormGroup>
  </Box>

  const PhotoUpload =
    <>
      photo upload
    </>

  const Attributes =
    <>
      attributes
    </>

  const steps: JSX.Element[] = [
    BasicInfo,
    PhotoUpload,
    Attributes
  ]

  const handleCancel = () => dispatch(createListingModalClosed());

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  }

  const previousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  }

  const save = () => {
    // api call to save listing
  }

  function updateStep(listing: Partial<IListing>) {
    setlistingState({ ...listingState, ...listing });
  };


  return (
    <Box className="bg-white fixed inset-0">
      <Container maxWidth="sm">
        <Box className="flex">
          <Typography className="flex-1">Title</Typography>
          <IconButton
            className="h-48"
            onClick={handleCancel}
          >
            <CloseIcon sx={{ color: 'black' }} />
          </IconButton>
        </Box>
        {step === 0 && steps[0]}
        {step === 1 && steps[1]}
        {step === 2 && steps[2]}
        <Box>
          {step !== 0 &&
            <Button variant="contained" onClick={previousStep}>
              Previous
            </Button>
          }
          {step !== steps.length - 1 &&
            <Button variant="contained" onClick={nextStep}>
              Next
            </Button>
          }
          {step === steps.length - 1 && <Button variant="contained" onClick={save}>
            Create Listing
          </Button>
          }
        </Box>
      </Container >
    </Box>
  )
}

