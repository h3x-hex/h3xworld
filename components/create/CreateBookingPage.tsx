// In this refactored version of your `CreateAndBookPage`,
// we support two gig types: `meeting` and `freelance`
// and dynamically render the form accordingly.

'use client'

import { PhotoIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { storageClient } from '@/helper/storageClient'
import { Carousel } from 'react-responsive-carousel'
import { TrashIcon } from '@heroicons/react/24/solid'

interface MediaFile {
  file: File | null
  url: string
  type: string
}

export default function CreateAndBookPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [gigType, setGigType] = useState<'meeting' | 'freelance' | null>(null);

  // Common
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [media, setMedia] = useState<MediaFile[]>([])
  const [files, setFiles] = useState<File[]>([]);
  const previews = usePreviewUrls(files);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Meeting specific
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingDuration, setMeetingDuration] = useState<number>(30);
  const [meetingTimes, setMeetingTimes] = useState<string[]>([]);
  const [meetingTimeInput, setMeetingTimeInput] = useState('');
  const [meetingLocation, setMeetingLocation] = useState<'google_meet' | 'physical' | ''>('');
  const [physicalAddress, setPhysicalAddress] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).slice(0, 1);
    setFiles(selectedFiles);
  };

  const handleAddMeetingTime = () => {
    if (meetingTimeInput && !meetingTimes.includes(meetingTimeInput)) {
      setMeetingTimes(prev => [...prev, meetingTimeInput]);
      setMeetingTimeInput('');
    }
  };

  const handleRemoveMeetingTime = (index: number) => {
    setMeetingTimes((prev) => prev.filter((_, i) => i !== index));
  };

  const removeFile = useCallback((index: number) => {
    setMedia(prev => {
      const fileToRemove = prev[index]
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url)
      }
      
      const newFiles = prev.filter((_, i) => i !== index)
      
      if (currentSlide >= newFiles.length && newFiles.length > 0) {
        setCurrentSlide(newFiles.length - 1)
      } else if (newFiles.length === 0) {
        setCurrentSlide(0)
      }
      
      return newFiles
    })
  }, [currentSlide])

  const handleSubmit = async () => {
    if (!gigType || !title || !description || price <= 0) return alert('Please fill in all required fields.');

    let imageUrl = '';
    if (files.length > 0) {
      const uploaded = await storageClient.uploadFile(files[0]);
      imageUrl = uploaded.gatewayUrl;
    }

    const baseMetadata: any = { title, description, price, image: imageUrl, gigType };

    if (gigType === 'meeting') {
      if (!meetingDate || meetingTimes.length === 0 || !meetingLocation || (meetingLocation === 'physical' && !physicalAddress)) {
        return alert('Fill all required meeting info.');
      }
      baseMetadata.date = meetingDate;
      baseMetadata.duration = meetingDuration;
      baseMetadata.times = meetingTimes;
      baseMetadata.location = meetingLocation;
      if (meetingLocation === 'physical') baseMetadata.address = physicalAddress;
    }

    const { uri } = await storageClient.uploadAsJson(baseMetadata);
    console.log('Gig created at URI:', uri);
    router.push('/gigs');
  };

  return (
    <div className='px-4 pb-24 sm:w-[36rem] mx-auto bg-stone-950 min-h-screen text-white'>
      <ArrowLeftIcon width={24} className='absolute top-8 left-5 cursor-pointer' onClick={() => {gigType ? setGigType(null) : router.back()}} />
      <h1 className='text-3xl text-yellow-500 text-center pt-6'>{gigType === 'meeting' ? 'Create Meeting' : gigType === 'freelance' ? 'Create Freelance Service' : 'Create Gig'}</h1>

      {!gigType ? (
        <div className='mt-8 space-y-4'>
          <button onClick={() => setGigType('meeting')} className='btn btn-warning bg-yellow-500 w-full text-black'>Sell Calendar Meeting</button>
          <button onClick={() => setGigType('freelance')} className='btn btn-warning bg-yellow-500 w-full text-black'>Sell Freelance Service</button>
        </div>
      ) : (
        <div className='space-y-4 mt-8'>
          <fieldset>
            <label>Title</label>
            <input className='input w-full bg-stone-900 border-gray-600' value={title} onChange={e => setTitle(e.target.value)} />
          </fieldset>

          <fieldset>
            <label>Description</label>
            <textarea className='textarea w-full bg-stone-900 border-gray-600' value={description} onChange={e => setDescription(e.target.value)} />
          </fieldset>

          <fieldset>
            <label>Price (USD)</label>
            <input type='number' className='input w-full bg-stone-900 border-gray-600' value={price} onChange={e => setPrice(+e.target.value)} />
          </fieldset>

          {gigType === 'meeting' && (
            <>
              <fieldset>
                <label>Date</label>
                <input type='date' className='input w-full bg-stone-900 border-gray-600' value={meetingDate} onChange={e => setMeetingDate(e.target.value)} />
              </fieldset>

              <fieldset>
                <label>Duration (minutes)</label>
                <input type='number' className='input w-full bg-stone-900 border-gray-600' value={meetingDuration} onChange={e => setMeetingDuration(+e.target.value)} />
              </fieldset>

              <fieldset>
                <label>Available Time Slots</label>
                <div className='flex gap-2'>
                  <input type='time' value={meetingTimeInput} onChange={e => setMeetingTimeInput(e.target.value)} className='input bg-stone-900 border-gray-600 flex-1' />
                  <button onClick={handleAddMeetingTime} className='btn btn-warning bg-yellow-500 text-black'>Add</button>
                </div>
                <div className='flex gap-2 flex-wrap mt-2'>
                  {meetingTimes.map((time, idx) => (
                    <div key={idx} className='bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2'>
                      {time}
                      <button onClick={() => handleRemoveMeetingTime(idx)} className='text-red-500'>&times;</button>
                    </div>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <label>Meeting Type</label>
                <select className='select w-full bg-stone-900 border-gray-600' value={meetingLocation} onChange={e => setMeetingLocation(e.target.value as any)}>
                  <option value=''>Select</option>
                  <option value='google_meet'>Google Meet</option>
                  <option value='physical'>Physical Location</option>
                </select>
              </fieldset>

              {meetingLocation === 'physical' && (
                <fieldset>
                  <label>Address</label>
                  <input type='text' className='input w-full bg-stone-900 border-gray-600' value={physicalAddress} onChange={e => setPhysicalAddress(e.target.value)} />
                </fieldset>
              )}
            </>
          )}

          <fieldset>
            <label>Upload Image</label>
            {previews.length > 0 && (
              <Carousel showThumbs={false} showStatus={false} selectedItem={currentSlide} onChange={setCurrentSlide} className='mb-4'>
                {previews.map(({ url }, idx) => (
                  <div key={url} className='relative h-64'>
                    <img src={url} className='h-64 object-cover w-full' />
                    <button
                      onClick={() => removeFile(idx)}
                      className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-2 text-white hover:bg-opacity-90 transition-opacity"
                      aria-label="Remove media"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </Carousel>
            )}
            <div className='flex items-center gap-3'>
              <input ref={inputRef} type='file' accept='image/*' onChange={handleFileChange} className='hidden' />
              <PhotoIcon className='cursor-pointer' width={36} color='#FACC15' onClick={() => inputRef.current?.click()} />
              <span>Upload an image</span>
            </div>
          </fieldset>

          <button onClick={handleSubmit} className='btn btn-warning bg-yellow-500 text-black w-full mt-6'>Create Gig</button>
        </div>
      )}
    </div>
  )
}

function usePreviewUrls(files: File[]) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  useEffect(() => {
    const newPreviews = files.map(file => ({ file, url: URL.createObjectURL(file) }))
    setPreviews(newPreviews)

    return () => newPreviews.forEach(p => URL.revokeObjectURL(p.url))
  }, [files])

  return previews;
}
