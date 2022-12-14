import {
  Button,
  Chip,
  FormGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { createRef, RefObject, useCallback, useEffect, useState } from 'react';
import { HasListing } from '@data/interfaces/props';
import { createListingModalClosed } from '@store/reducers/uiReducer';
import { useAppDispatch } from '@store/app';
import Cropper from 'react-easy-crop';
import { createImage, getCroppedImg } from '@utilities/image';
import { Web3Storage } from 'web3.storage';
import {
  IListing,
  ListingFeatureFacets,
  ListingFeatureNumberKeys,
  ListingFeatureOptionKeys,
  isOptionFeature,
  Options,
} from '../types/listing';
import { FacetMap, FacetMapping } from '@filter/types/facets';
import clone from '@utilities/clone';

const client = new Web3Storage({ token: import.meta.env.VITE_WEB3_STORAGE_API_KEY });
const IMAGE_WIDTH = 800 as const;

export function CreateListing({ listing }: HasListing) {
  const [listingState, setlistingState] = useState<IListing>(listing);
  const [input, setInput] = useState<RefObject<any>>(createRef());
  const [zoom, setZoom] = useState(1);
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
  ]);

  const setProperty = (prop: keyof IListing) => (e: any) => {
    setlistingState({ ...listing, [prop]: e.target.value });
  };

  const handleToggleFacet = (feature: ListingFeatureOptionKeys, facetKey: Options) => (e: any) => {
    let cloned = clone<ListingFeatureFacets>(listingState.features) as ListingFeatureFacets;
    let option = cloned[feature] as Options[];
    if (option !== undefined) {
      option.some((k) => k === facetKey) ? (option = option.filter((k) => k !== facetKey)) : option.push(facetKey);
      setlistingState({ ...listingState, features: cloned as ListingFeatureFacets });
    }
  };

  const handleNumericInput = (feature: ListingFeatureNumberKeys) => (e: any) => {
    let cloned = clone<ListingFeatureFacets>(listingState.features) as ListingFeatureFacets;
    cloned[feature] = e.target.value;
    setlistingState({ ...listingState, features: cloned as ListingFeatureFacets });
  };

  const uploadPhoto = async (e: any) => {
    const file = e.target.files[0];
    input.current.value = null;
    if (/(gif|jpe?g|tiff?|png|webp|bmp|heic|heif)/g.test(file.type)) {
      const imageString = URL.createObjectURL(file);
      const image = await createImage(imageString);
      const canvas = document.createElement('canvas');
      if (image.width > IMAGE_WIDTH) {
        canvas.width = IMAGE_WIDTH;
        canvas.height = image.height * (IMAGE_WIDTH / image.width);
      } else {
        canvas.width = image.width;
        canvas.height = image.height;
      }
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const scaleFactor = canvas.width / image.width;
      ctx.drawImage(image, 0, 0, image.width * scaleFactor, image.height * scaleFactor);
      const dataURL = canvas.toDataURL('image/jpg', 0.5);
      setCurrentImage(dataURL);
      setShowCropper(true);
    }
  };

  const clickUpload = () => {
    input.current.click();
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const BasicInfo = (
    <div>
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
          onChange={handleNumericInput('price')}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          value={listingState.features.price}
        />
      </FormGroup>
    </div>
  );

  const features = (
    <div className="mt-24">
      {Object.entries(FacetMapping).map(
        ([feature, value]) =>
          isOptionFeature(feature) && (
            <FormGroup className="mb-16" key={feature}>
              <FormLabel className="mb-12">{value[0]}</FormLabel>
              <div className="flex flex-wrap mb-8">
                {Object.entries(value[1]).map(
                  ([key, value]) =>
                    isOptionFeature(feature) && (
                      <Chip
                        className="mr-8"
                        key={key}
                        label={value}
                        variant={listingState.features[feature]?.some((k) => k === key) ? 'filled' : 'outlined'}
                        onClick={handleToggleFacet(feature, key as Options)}
                      />
                    )
                )}
              </div>
            </FormGroup>
          )
      )}
    </div>
  );

  const PhotoUpload = (
    <>
      <div className="flex flex-row flex-wrap w-full h-full">
        <div className="w-1/2 h-0 pb-[39%] sm:w-1/3 sm:pb-[26%] relative cursor-pointer" onClick={clickUpload}>
          <div className="m-12 outline-dashed absolute inset-0"></div>
        </div>
        {listingState.images?.map((image, index) => (
          <div key={index} className="w-1/2 h-0 pb-[39%] sm:w-1/3 sm:pb-[26%] relative">
            <div className="m-12 absolute inset-0">
              <img alt="" src={image} className="object-cover min-w-full min-h-full" />
            </div>
          </div>
        ))}
      </div>
      <input id="input" type="file" className="hidden h-0" ref={input} onChange={uploadPhoto} />
    </>
  );

  const Crop = (
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
  );

  const steps: JSX.Element[] = [BasicInfo, PhotoUpload, features];

  const handleCancel = () => dispatch(createListingModalClosed());

  const cropImage = async () => {
    const blob = await getCroppedImg(currentImage as string, croppedAreaPixels);
    const identifier = crypto.randomUUID();
    const cid = await client.put([new File([blob], `${identifier}.jpg`)]);
    listingState.images?.push(`https://${cid}.ipfs.w3s.link/${identifier}.jpg`);
    setShowCropper(false);
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const save = () => {
    // api call to save listing
  };

  return (
    <div className="bg-white fixed inset-0">
      <Container className="h-full" maxWidth="sm">
        <div className="flex flex-col min-h-full sm:min-h-[50%]">
          <div className="flex items-center">
            <Typography variant="h5" className="flex-1">
              {titleMap.get(step)}
            </Typography>
            <IconButton className="h-48 p-0" onClick={handleCancel}>
              <CloseIcon sx={{ color: 'black' }} />
            </IconButton>
          </div>
          <div className="flex-1 relative">
            {!showCropper && steps[step]}
            {showCropper && Crop}
          </div>
          <div className="pb-16">
            <>
              {!showCropper && (
                <>
                  {step !== 0 && (
                    <Button variant="contained" onClick={previousStep}>
                      Previous
                    </Button>
                  )}
                  {step !== steps.length - 1 && (
                    <Button className="float-right" variant="contained" onClick={nextStep}>
                      Next
                    </Button>
                  )}
                  {step === steps.length - 1 && (
                    <Button className="float-right" variant="contained" onClick={save}>
                      Create Listing
                    </Button>
                  )}
                </>
              )}
              {showCropper && (
                <Button className="float-right" variant="contained" onClick={cropImage}>
                  Crop
                </Button>
              )}
            </>
          </div>
        </div>
      </Container>
    </div>
  );
}
