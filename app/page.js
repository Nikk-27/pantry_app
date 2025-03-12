"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import styles from "./styles/Home.module.css";
import CaptureButton from "./component/CaptureButton";
import ProductCard from "./component/ProductCard";
import SearchBar from "./component/SearchBar";
import { getProducts, deleteProduct } from "./utils/firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api"; // Use API env variable

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
    <div className={styles.container}>
      <Head>
        <title>Product Inventory</title>
        <meta name="description" content="Product inventory management" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <main className="bg-gray-100 p-8 min-h-screen w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Product Inventory
        </h1>

        <div className="max-w-3xl mx-auto mb-4">
          <SearchBar setSearchTerm={setSearchTerm} />
        </div>

        <div className="flex flex-col items-center justify-center text-center mt-4">
          <CaptureButton onCapture={fetchProducts} />
          <button
            onClick={captureAndSendImage}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Capture Image
          </button>
          <video ref={videoRef} autoPlay hidden />
          <canvas ref={canvasRef} hidden />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={() => handleDelete(product.id)}
              onUpdate={fetchProducts}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
