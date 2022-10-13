export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {

        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.src = url
    })

export const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
): Promise<string> => {
    const image: HTMLImageElement = (await createImage(imageSrc)) as HTMLImageElement;
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    canvas.width = image.width
    canvas.height = image.height

    ctx.drawImage(image, 0, 0)

    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    )

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.putImageData(data, 0, 0)

    return new Promise<string>((resolve, reject) => {
        canvas.toBlob((file) => {
            resolve(URL.createObjectURL(file as Blob));
        }, 'image/jpeg')
    })
}
