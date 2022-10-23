import {
  Button,
  Chip,
  FormGroup, FormLabel, IconButton, InputAdornment, OutlinedInput, TextField, Typography,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { createRef, RefObject, useCallback, useEffect, useState } from 'react';
import { HasListing } from '../../../data/interfaces/props';
import { createListingModalClosed } from '../../../store/reducers/uiReducer';
import { useAppDispatch } from '../../../store/app';
import Cropper from 'react-easy-crop';
import { createImage, getCroppedImg } from '../../../utilities/image';
import { Web3Storage } from 'web3.storage';
import { guid } from '../../../utilities/rand';
import { AmenitiesOptions, CoverageOptions, EventOptions, FeatureKeys, FeatureTypes, IListing, ListingFeatures, Options } from '../types/listing';
import { FacetMap, FacetMapping } from '../../filter/types/facets';
import clone from '../../../utilities/clone';

const client = new Web3Storage({ token: import.meta.env.VITE_WEB3_STORAGE_API_KEY });

export function CreateListing({ listing }: HasListing) {
  const [listingState, setlistingState] = useState<IListing>(listing);
  const [input, setInput] = useState<RefObject<any>>(createRef());
  const [zoom, setZoom] = useState(1)
  const [currentImage, setCurrentImage] = useState<string>();
  const [step, setStep] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [showCropper, setShowCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const dispatch = useAppDispatch();

  const titleMap: Map<number, string> = new Map([
    [0, 'Tell us about your listing'],
    [1, 'Upload some photos of your listing'],
    [2, 'Tell us a bit more about your listing'],
  ])

  const setProperty = (prop: keyof IListing) => (e: any) => {
    setlistingState({ ...listing, [prop]: e.target.value });
  };

  const handleToggleFacet = (feature: FeatureKeys, facetKey: Options) => (e: any) => {
    let cloned = clone<{ [k in keyof FeatureTypes]: Options[] }>(listingState.features);
    cloned[feature].some(k => k === facetKey) ? cloned[feature] = cloned[feature].filter(k => k !== facetKey) : cloned[feature].push(facetKey);
    setlistingState({ ...listingState, features: cloned as ListingFeatures });
  }

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

  // fixthis
  const features =
    <>
      {Object.entries(FacetMapping).map(([feature, value]) => {
        return (
          <FormGroup key={feature}>
            <FormLabel className="mb-16">{value[0]}</FormLabel>
            <Box className="flex flex-wrap mb-8">
              {
                Object.entries(value[1]).map(([key, value]) =>
                  <Chip
                    className='mr-8'
                    key={key}
                    label={value}
                    variant={listingState.features[feature as keyof FeatureTypes].some(k => k === key) ? 'filled' : 'outlined'}
                    onClick={handleToggleFacet(feature as keyof FeatureTypes, key as Options)}
                  />
                )}
            </Box>
          </FormGroup>)
      })}
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
    const blob = await getCroppedImg(currentImage as string, croppedAreaPixels);
    const identifier = guid();
    const cid = await client.put([new File([blob], `${identifier}.jpg`)]);
    listingState.images?.push(`https://${cid}.ipfs.w3s.link/${identifier}.jpg`);
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

