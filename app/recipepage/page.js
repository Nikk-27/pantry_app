'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function RecipePage() {
  const [recipeItems, setRecipeItems] = useState('');
  const [recipeData, setRecipeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecipe = async () => {
    setIsLoading(true);
    try {
      const items = recipeItems.split(',').map(item => item.trim()).join(',');
      const response = await fetch(`http://127.0.0.1:5000/api/recipe?items=${encodeURIComponent(items)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipe');
      }
      const data = await response.json();
      setRecipeData(data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      // You might want to set an error state here and display it to the user
    } finally {
      setIsLoading(false);
    }
  };

  const renderRecipe = (recipe) => {
    const parts = recipe.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-indigo-600">{part.slice(2, -2)}</strong>;
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecipe();
  };

  const handleClear = () => {
    setRecipeItems('');
    setRecipeData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Head>
        <title>Recipe Recommender</title>
        <meta name="description" content="Recipe Recommender" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <Link href="/">
            <button className="px-6 py-2 mb-4 sm:mb-0 rounded-full text-white font-semibold bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
              Back
            </button>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800">
            Recipe Recommender
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-blue-700 text-sm font-bold mb-2" htmlFor="recipeItems">
              Enter available pantry items (separate with commas):
            </label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                id="recipeItems"
                name="recipeItems"
                className="flex-grow px-4 py-2 border border-blue-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., eggs, cheese, milk"
                value={recipeItems}
                onChange={(e) => setRecipeItems(e.target.value)}
              />
              <div className="flex space-x-2">
                <button 
                  type="submit" 
                  className="flex-grow sm:flex-grow-0 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Searching...' : 'Find Recipe'}
                </button>
                <button 
                  type="button" 
                  onClick={handleClear} 
                  className="flex-grow sm:flex-grow-0 px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  Clear
                </button>
              </div>
            </div>
          </form>
        </div>

        {recipeData && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-800">Ingredients:</h2>
            <ul className="list-disc pl-5 mb-6 text-gray-700">
              {recipeData.items.map((item, index) => (
                <li key={index} className="mb-1">{item}</li>
              ))}
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-800">Recipe:</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {renderRecipe(recipeData.recipe)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}