export const convertToWebP = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const reader = new FileReader()
  
      reader.onload = () => {
        if (!reader.result) return reject('No result')
        img.src = reader.result as string
      }
  
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
  
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject('Canvas context not available')
  
        ctx.drawImage(img, 0, 0)
  
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject('WebP conversion failed')
            const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now()
            })
            resolve(webpFile)
          },
          'image/webp',
          1 // Quality (0–1)
        )
      }
  
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })
  }