export default async function getCroppedImg(
    imageSrc: string,
    crop: any,
    fileName = 'cropped-image.webp',
    mimeType = 'image/webp'
  ): Promise<File> {
    return new Promise((resolve) => {
      const image = new Image()
      image.src = imageSrc
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx = canvas.getContext('2d')
  
        if (ctx) {
          ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
          )
  
          canvas.toBlob((blob) => {
            if (!blob) return
            const file = new File([blob], fileName, { type: mimeType })
            resolve(file)
          }, mimeType, 0.9)
        }
      }
    })
  }
  