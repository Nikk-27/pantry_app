import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 m-4">
      <Image 
        src={product.data.imageUrl}
        width={500}
        height={300}
        alt={product.data['Item Name']}
        className="w-full h-48 object-cover"
      />
      <div className="mt-4 space-y-2">
        {Object.entries(product.data)
          .filter(([key]) => key !== 'imageUrl')
          .sort()
          .map(([key, value]) => (
            <div key={key} className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm">
              <span className="text-sm font-semibold text-gray-600">
                {key}:
              </span>
              <span className="text-sm text-gray-800">
                {value}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
