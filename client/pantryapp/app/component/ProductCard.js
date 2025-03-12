import { useState } from 'react';
import { updateProduct } from '../utils/firebase';
import Image from 'next/image';

export default function ProductCard({ product, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(product.data);

  const handleUpdate = async () => {
    await updateProduct(product.id, editedData);
    setIsEditing(false);
    onUpdate();
  };

  const handleInputChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 m-4">
      <Image src={product.data.imageUrl} 
      width={500} 
      height={300} 
      alt={product.data['Item Name']} 
      className="w-full h-48 object-cover" />
      {isEditing ? (
        <div className="mt-4 space-y-4">
          {Object.entries(editedData).filter(([key, value]) => key !== "imageUrl").sort().map(([key, value]) => (
            <input
              key={key}
              type="text"
              name={key}
              value={value}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
          <div className="flex space-x-4">
            <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {Object.entries(product.data).filter(([key, value]) => key !== "imageUrl").sort().map(([key, value]) => (

          <div key={key} className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm">
          <span className="text-sm font-semibold text-gray-600">{key}:</span>
          <span className="text-sm text-gray-800">{value}</span>
          </div>
            // <p key={key} className="text-gray-700">{`${key}: ${value}`}</p>
          ))}
          <div className="flex space-x-4 mt-4">
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
              Update
            </button>
            <button onClick={onDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
