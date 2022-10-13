import { Box } from "@mui/system"
import { createRef, RefObject, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop"

export default function Account() {

  const [currentImage, setCurrentImage] = useState<string>();
  const [crop, setCrop] = useState<Crop>()
  const [input, setInput] = useState<RefObject<any>>(createRef());

  const clickUpload = () => {
    console.log(input.current)
    input.current.click();
  }

  const uploadPhoto = (e: any) => {
    const file = e.target.files[0];
    input.current.value = null;
    if (/(gif|jpe?g|tiff?|png|webp|bmp|heic|heif)/g.test(file.type)) {
      var img = new Image();
      img.onload = (event: any) => {
        const canvas = document.createElement("canvas");
        const image = event.target;
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
        // listingState.images?.push(dataURL);
        // setlistingState(listingState);
        setCurrentImage(dataURL);
      }
      img.src = URL.createObjectURL(file);
    }
  }


  return (<>
    <Box className="flex flex-row flex-wrap w-full h-full">
      <Box className="w-1/2 h-0 pb-[50%] sm:w-1/3 sm:pb-[33%] relative m-12 outline-dashed cursor-pointer"
        onClick={clickUpload}>
      </Box>
    </Box>
    <input id="input" type="file" className="hidden h-0" ref={input} onChange={uploadPhoto} onClick={e => { console.log(e) }} />
    <Box>
      <ReactCrop aspect={1} crop={crop} onChange={c => setCrop(c)}>
        <img src={currentImage} />
      </ReactCrop>
    </Box>
  </>)
}
