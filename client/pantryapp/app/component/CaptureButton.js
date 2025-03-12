'use client';
import { useState, useRef, useEffect } from 'react';
import { uploadImage, addProduct } from '../utils/firebase';
import Link from 'next/link';
export default function CaptureButton({ onCapture }) {
  const [capturing, setCapturing] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  
  useEffect(() => {
    return () => {
      closeCamera();
    };
  }, []);
  useEffect(() => {
    // Append the video element to the div when the stream is active
    if (streamActive && streamRef.current.video) {
      const container = videoRef.current;
      if (container && !container.contains(streamRef.current.video)) {
        container.appendChild(streamRef.current.video);
      }
    }
  }, [streamActive]);

  // fetch information from the image
  async function postImageFile(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
  
      const response = await fetch('http://127.0.0.1:5000/api/image', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error posting image file:', error);
      throw error;
    }
  }

  const captureImage = async () => {
    setCapturing(true);
  
    try {

      // Close any existing camera stream
      closeCamera();
     
      const stream = await navigator.mediaDevices.getUserMedia({ video:
        {
          facingMode: 'environment', // Use back camera on mobile devices
          width: { ideal: 1280 }, // Adjust resolution if needed
          height: { ideal: 720 }
        } });
      
      console.log("creating video element")
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      await video.play();

      // Store both stream and video elements
      streamRef.current = { stream, video };
      setStreamActive(true);

      // Wait a bit for the camera to adjust
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
    
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      const imageFile = dataURLtoFile(imageDataUrl, 'captured_image.jpg');

      const imageUrl = await uploadImage(imageFile);
      // console.log(imageUrl)
     
      // Post image to your API and get product details
     const productDetails = await postImageFile(imageFile);

    //Use the retrieved product details instead of hardcoded data
    const productData = {
      Brand: productDetails.Brand || "",
      Category: productDetails.Category || "",
      "Estimated Quantity": productDetails["Estimated Quantity"] || "",
      Expiration: productDetails.Expiration || "",
      "Item Name": productDetails["Item Name"] || "",
    };
      
      // const productData = {
      //   Brand: "Carbotrol",
      //   Category: "Fruit",
      //   "Estimated Quantity": "105 oz. (2.98 kg)",
      //   Expiration: "",
      //   "Item Name": "Apple"
      // };

      await addProduct(productData, imageUrl);
      onCapture();
    } catch (error) {
      console.error('Error capturing image:', error);
    } finally {
      setCapturing(false);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      const { stream, video } = streamRef.current;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (video) {
        video.srcObject = null;
      }
      streamRef.current = null;
      setStreamActive(false);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div>
      {streamActive &&(
      <div className="relative w-full max-w-md mx-auto mt-4" >
        <div
        ref={videoRef}
        className="mt-4 w-full max-w-md h-auto border rounded-lg"
      ></div>
        {capturing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 h-auto">
            <p className="text-white">Capturing...</p>
          </div>
          
        )}
      </div>
)}
    <div className="mt-4 flex justify-center translate-y-1">
      <button
        onClick={captureImage}
        disabled={capturing}
        className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300
          ${capturing ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
          ${capturing ? '' : 'shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500'}
        `}
      >
        {capturing ? 'Capturing...' : 'Capture Product'}
      </button>
      <Link href="/recipepage">
          <button className="px-6 py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 ml-8">
            Recommend Recipes
          </button>
        </Link>
      {streamActive && (
        <button
          onClick={closeCamera}
          className="ml-4 px-6 py-3 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Close Camera
        </button>
      )}
    </div>
    </div>
  );
}