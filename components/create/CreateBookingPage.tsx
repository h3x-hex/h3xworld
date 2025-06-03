'use client'

import { PhotoIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { storageClient } from '@/helper/storageClient'
import { Carousel } from 'react-responsive-carousel'

export default function CreateAndBookPage() {
  
  const router = useRouter();

  // Step control
  const [serviceCreated, setServiceCreated] = useState(false);
  const [serviceData, setServiceData] = useState<any>(null);

  // Create Service Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [availableDate, setAvailableDate] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const previews = usePreviewUrls(files);

  // Booking Fields
  const [availableTimeInput, setAvailableTimeInput] = useState('');
  const [availableTimesCreated, setAvailableTimesCreated] = useState<string[]>([]);

  const handleAddAvailableTime = () => {
    if (availableTimeInput && !availableTimesCreated.includes(availableTimeInput)) {
      setAvailableTimesCreated([...availableTimesCreated, availableTimeInput]);
      setAvailableTimeInput('');
    }
  };

  const handleRemoveAvailableTime = (index: number) => {
    setAvailableTimesCreated((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).slice(0, 1);
    setFiles(selectedFiles);
  };

  const removeFile = () => setFiles([]);

  const handleServiceSubmit = async () => {
    try {
      if (!title || !description || price <= 0 || !availableDate) {
        alert("Please fill all required fields.");
        return;
      }

      let imageUrl = '';

      if (files.length > 0) {
        const uploaded = await storageClient.uploadFile(files[0]);
        imageUrl = uploaded.gatewayUrl;
      }

      const bookingMetadata = {
        title,
        description,
        price,
        duration,
        availableDate,
        availableTimes: availableTimesCreated, 
        image: imageUrl,
      };

      const { uri } = await storageClient.uploadAsJson(bookingMetadata);

      console.log("Booking Service Created:", uri);

      setServiceData({
        title,
        description,
        price,
        duration,
        availableDate,
        image: imageUrl,
      });
      setServiceCreated(true);
      console.log(serviceData)

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    
  }, []);


  return (
    <div className='px-3 h-full sm:w-[36rem] bg-stone-950 pb-64 mx-auto flex flex-col'>
      <ArrowLeftIcon width={24} color='white' onClick={() => router.back()} className='absolute sm:left-8 top-5'/>
      
      {/* Create Service */}
      {!serviceCreated && (
        <>
          <div className='h-12 border-b-2 border-gray-600 flex flex-row'>
            <h1 className='pt-2 text-3xl text-yellow-500 text-center mx-auto'>Create Booking</h1>
          </div>

          <div className='flex flex-col h-screen px-3 pt-8'>

            {/* Service Form */}
            <fieldset className="flex flex-col mb-4">
              <label className="text-white mb-2">Service Title</label>
              <input
                type="text"
                className="input bg-transparent border-2 border-gray-600 text-white rounded-lg w-full"
                placeholder="e.g. 1 Hour Business Consultation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </fieldset>

            <fieldset className="flex flex-col mb-4">
              <label className="text-white mb-2">Service Description</label>
              <textarea
                className="textarea bg-transparent border-2 border-gray-600 text-white h-48 rounded-lg w-full"
                placeholder="Describe your service in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </fieldset>

            <fieldset className="flex flex-col mb-4">
              <label className="text-white mb-2">Price (USD)</label>
              <input
                type="number"
                className="input bg-transparent border-2 border-gray-600 text-white rounded-lg w-full"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </fieldset>

            <fieldset className="flex flex-col mb-4">
              <label className="text-white mb-2">Duration (minutes)</label>
              <input
                type="number"
                className="input bg-transparent border-2 border-gray-600 text-white rounded-lg w-full"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </fieldset>

            <fieldset className="flex flex-col mb-4">
              <label className="text-white mb-2">Available From</label>
              <input
                type="date"
                className="input bg-transparent border-2 border-gray-600 text-white rounded-lg w-full"
                value={availableDate}
                onChange={(e) => setAvailableDate(e.target.value)}
              />
            </fieldset>

            <fieldset className="flex flex-col mb-4">
              <label className="text-white mb-2">Available Time Slots (click Add after each time)</label>
              <div className="flex gap-4 mb-2">
                <input
                  type="time"
                  value={availableTimeInput}
                  onChange={(e) => setAvailableTimeInput(e.target.value)}
                  className="input bg-transparent border-2 border-gray-600 text-white rounded-lg flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddAvailableTime}
                  className="btn bg-yellow-500 border-2 border-yellow-500 text-black"
                >
                  Add
                </button>
              </div>

              {/* Show list of available times */}
              {availableTimesCreated.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableTimesCreated.map((time, index) => (
                    <div key={index} className="bg-gray-700 text-white px-3 py-1 rounded-lg flex items-center gap-2">
                      {time}
                      <button
                        type="button"
                        onClick={() => handleRemoveAvailableTime(index)}
                        className="text-red-400 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </fieldset>

            <fieldset className="flex flex-col mb-4">
              <label className="text-white mb-2">Service Image (optional)</label>
              {previews.length > 0 && (
                <Carousel
                  selectedItem={currentSlide}
                  onChange={(index) => setCurrentSlide(index)}
                  showThumbs={false}
                  showStatus={false}
                  infiniteLoop
                  useKeyboardArrows
                  dynamicHeight={false}
                  className="rounded-md overflow-hidden h-64 sm:h-96 border-2 border-gray-600 border-dashed mb-4 w-full"
                >
                  {previews.map(({ url }, idx) => (
                    <div key={url} className="relative h-64 sm:h-96 w-full">
                      <img src={url} className="w-full h-64 sm:h-96 object-cover rounded-box" alt={`preview-${idx}`} />
                      <button
                        onClick={removeFile}
                        className="absolute top-2 right-6 bg-black bg-opacity-70 rounded-full p-1 text-white"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </Carousel>
              )}
              <div className="flex items-center gap-4">
                <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <PhotoIcon className="cursor-pointer" width={36} color="#F0B100" onClick={handleInputClick}/>
                <span className="text-white">Click to upload an image</span>
              </div>
            </fieldset>

            <button
              className="btn bg-yellow-500 w-full mt-8"
              onClick={handleServiceSubmit}
            >
              Create Service
            </button>

          </div>
        </>
      )}

    </div>
  )
}

function usePreviewUrls(files: File[]) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  useEffect(() => {
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [files]);

  return previews;
}
