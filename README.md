# Pantry Tracker & Recipe Recommender

Pantry Tracker & Recipe Recommender is a web application that helps users manage their pantry inventory and get recipe recommendations based on available ingredients. It uses advanced AI technologies for product recognition and recipe generation.

## Features

### Pantry Tracking
- **Image Recognition**: Use your device's camera to capture product images.
- **AI-Powered Information Extraction**: Utilizes Gemini 1.5 Pro to extract product details from images.
- **Manual Input**: Allows users to add or edit product information not captured by AI.
- **Firebase Integration**: Stores product data and images for easy access and management.

### Inventory Management
- **Product Listing**: View all pantry items with their images and details.
- **Update and Delete**: Easily modify or remove items from your inventory.

### Recipe Recommendations
- **Ingredient-Based Suggestions**: Enter available ingredients to get recipe ideas.
- **AI-Generated Recipes**: Uses LLaMA 3 model to create custom recipe recommendations.

## Technology Stack

- Frontend: Next.js
- Backend: Flask
- Database: Firebase Firestore
- Storage: Firebase Storage
- AI Models:
  - Gemini 1.5 Pro for image analysis
  - LLaMA 3 for recipe generation
- API: RESTful API for recipe requests

## Setup and Installation

1. Clone the repository:
2. Install dependencies(follow command.txt file)
3. Setup Firebase Project



## Usage

1. **Adding Products**:
- Click the "Add Product" button
- Use your camera to capture the product image
- Review and edit the extracted information
- Save the product to your pantry

2. **Managing Inventory**:
- View all products on the main page
- Use "Update" and "Delete" buttons to manage items

3. **Getting Recipe Recommendations**:
- Navigate to the "Recipe Recommender" page
- Enter ingredients separated by commas
- Click "Get Recipes" to receive AI-generated recipe suggestions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Gemini 1.5 Pro for powering our image recognition
- LLaMA 3 model for recipe generation
- Firebase for providing robust backend services
