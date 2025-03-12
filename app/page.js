"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import styles from "./styles/Home.module.css";
import CaptureButton from "./component/CaptureButton";
import ProductCard from "./component/ProductCard";
import SearchBar from "./component/SearchBar";
import { getProducts, deleteProduct } from "./utils/firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/python/api"; // Dynamically select API

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts();
  };

  const captureAndSendImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert("Failed to capture image, please try again.");
        return;
      }

      const formData = new FormData();
      formData.append("image", blob, `captured_${Date.now()}.jpg`);

      try {
        const response = await fetch(`${API_BASE_URL}/image`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        await fetchProducts();
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload image: " + error.message);
      }
    });
  };

  const filteredProducts = products.filter((product) =>
    (product.data["Item Name"] ?? "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <Head>
        <title>Product Inventory</title>
        <meta name="description" content="Product inventory management" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Product Inventory
      </h1>

      <div className="w-full max-w-3xl">
        <SearchBar setSearchTerm={setSearchTerm} />
      </div>

      {/* Capture Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6 flex flex-col items-center w-80">
        <video
          ref={videoRef}
          autoPlay
          className="w-48 h-48 rounded-md border border-gray-300 mb-4"
        />
        <canvas ref={canvasRef} hidden />

        <div className="flex flex-col items-center space-y-3">
          <CaptureButton onCapture={fetchProducts} />
          <button
            onClick={captureAndSendImage}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Capture Image
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={() => handleDelete(product.id)}
            onUpdate={fetchProducts}
          />
        ))}
      </div>
    </div>
  );
}
