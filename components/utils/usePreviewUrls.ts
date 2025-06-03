import { useEffect, useState } from 'react';

export const usePreviewUrls = (files: File[]) => {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  useEffect(() => {
    const generated = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews(generated);

    return () => {
      generated.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [files]);

  return previews;
};


            