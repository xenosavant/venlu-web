import {
  Button,
  FormGroup, FormLabel, IconButton, InputAdornment, OutlinedInput, TextField, Typography,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { createRef, RefObject, useCallback, useEffect, useState } from 'react';
import { IListing } from '../data/interfaces/listing';
import { HasListing } from '../data/interfaces/props';
import { createListingModalClosed } from '../state/reducers/uiReducer';
import { useAppDispatch } from '../hooks/context';
import Cropper from 'react-easy-crop';
import { createImage, getCroppedImg } from '../utilities/image';

export function CreateListing({ listing }: HasListing) {
  const [listingState, setlistingState] = useState<Partial<IListing>>(listing);
  const [input, setInput] = useState<RefObject<any>>(createRef());
  const [zoom, setZoom] = useState(1)
  const [currentImage, setCurrentImage] = useState<string>();
  const [step, setStep] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [showCropper, setShowCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const dispatch = useAppDispatch();

  const titleMap: Map<number, string> = new Map([
    [0, 'Tell us about your listing'],
    [1, 'Upload some photos of your listing'],
    [2, 'Tell us a bit more about your listing'],
  ])

  const setProperty = (prop: keyof IListing) => (e: any) => {
    setlistingState({ ...listing, [prop]: e.target.value });
  };

  const uploadPhoto = async (e: any) => {
    const file = e.target.files[0];
    input.current.value = null;
    if (/(gif|jpe?g|tiff?|png|webp|bmp|heic|heif)/g.test(file.type)) {
      const imageString = URL.createObjectURL(file);
      const image = await createImage(imageString);
      const canvas = document.createElement("canvas");
      if (image.width > 800) {
        canvas.width = 800;
        canvas.height = image.height * (800 / image.width);
      } else {
        canvas.width = image.width;
        canvas.height = image.height;
      }
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      const scaleFactor = canvas.width / image.width;
      ctx.drawImage(image, 0, 0, image.width * scaleFactor, image.height * scaleFactor);
      const dataURL = canvas.toDataURL('image/jpg', 0.5);
      setCurrentImage(dataURL);
      setShowCropper(true);
    }
  }


  const clickUpload = () => {
    input.current.click();
  }

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, [])

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

  const features =
    <>
      features
    </>

  const PhotoUpload =
    <>
      <Box className="flex flex-row flex-wrap w-full h-full">
        <Box className="w-1/2 h-0 pb-[39%] sm:w-1/3 sm:pb-[26%] relative cursor-pointer"
          onClick={clickUpload}>
          <Box className="m-12 outline-dashed absolute inset-0"></Box>
        </Box>
        {listingState.images?.map((image, index) =>
          <Box key={index} className="w-1/2 h-0 pb-[39%] sm:w-1/3 sm:pb-[26%] relative">
            <Box className="m-12 absolute inset-0">
              <img alt="" src={image} className="object-cover min-w-full min-h-full" />
            </Box>
          </Box>)}
      </Box>
      <input id="input" type="file" className="hidden h-0" ref={input} onChange={uploadPhoto} />
    </>

  const Crop =
    <>
      <Cropper
        image={currentImage}
        crop={crop}
        aspect={4 / 3}
        onCropComplete={onCropComplete}
        onCropChange={setCrop}
        zoom={zoom}
        onZoomChange={setZoom}
      />
    </>


  const steps: JSX.Element[] = [
    BasicInfo,
    PhotoUpload,
    features,
  ]

  const handleCancel = () => dispatch(createListingModalClosed());

  const cropImage = async () => {
    const image = await getCroppedImg(currentImage as string, croppedAreaPixels);
    listingState.images?.push(image);
    setShowCropper(false);
  }


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
      <Container className="h-full" maxWidth="sm">
        <Box className="flex flex-col min-h-full sm:min-h-[50%]">
          <Box className="flex items-center">
            <Typography variant="h5" className="flex-1">{titleMap.get(step)}</Typography>
            <IconButton
              className="h-48 p-0"
              onClick={handleCancel}
            >
              <CloseIcon sx={{ color: 'black' }} />
            </IconButton>
          </Box>
          <Box className="flex-1 relative">
            {!showCropper && steps[step]}
            {showCropper && Crop}
          </Box>
          <Box className="pb-16">
            <>
              {!showCropper && (
                <>
                  {step !== 0 &&
                    <Button variant="contained" onClick={previousStep}>
                      Previous
                    </Button>
                  }
                  {step !== steps.length - 1 &&
                    <Button className="float-right" variant="contained" onClick={nextStep}>
                      Next
                    </Button>
                  }
                  {step === steps.length - 1 &&
                    <Button className="float-right" variant="contained" onClick={save}>
                      Create Listing
                    </Button>
                  }
                </>
              )
              }
              {showCropper && <Button className="float-right" variant="contained" onClick={cropImage}>
                Crop
              </Button>}
            </>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

