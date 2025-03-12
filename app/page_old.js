'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from './styles/Home.module.css';
import CaptureButton from './component/CaptureButton';
import ProductCard from './component/ProductCard';
import SearchBar from './component/SearchBar';
import { getProducts, deleteProduct } from './utils/firebase';


export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProducts = products.filter(product =>
    (product.data['Item Name'] ?? '').toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex justify-center text-center mt-4">
        <CaptureButton onCapture={fetchProducts} />
        
    
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