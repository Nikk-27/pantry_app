import os
import google.generativeai as genai
from PIL import Image
import json

# Configure the API key
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

def analyze_image(image_path):
    # Open the image
    img = Image.open(image_path)

    # Initialize the Gemini model
    model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest")

    # Generate content based on the image
    prompt="""You are an advanced AI assistant with expertise in image analysis and nutritional information. 
I will provide you with an image of a pantry item. Your task is to analyze the image and provide detailed information about the item. 
Please format your response as follows: 
1. Item Name: [Identify the specific item in the image]
2. Category: [e.g., Grain, Vegetable, Fruit, Protein, Dairy, Condiment, Snack, etc.] 
3. Estimated Quantity: [Provide an estimate of the quantity visible, e.g., "About 500g package" or "1 liter bottle"] 
4.. Brand: [If visible, identify the brand name]
5. Expiration: [If visible, note the expiration date. If not, provide general guidance on shelf life] 

Ensure the JSON is properly formatted and does not include any extra commentary. If any of the above information is not found, leave blank.
"""
    response = model.generate_content([prompt, img])

    # Example response parsing (adjust based on actual response structure)
    # Store the first response
    first_response = response.text
    jsonString="".join(response.text.split("\n")[1:-1])
   

    # Parse the JSON string
    try:
        print("first response")
        print(jsonString)
        json_object = json.loads(jsonString)
       
        return json_object
    except json.JSONDecodeError:
        # Inform the model that the response is not in JSON format
        error_prompt = f"""The response provided is not in JSON format. Please ensure the response is formatted as JSON. This is the first response: {jsonString}"""
       
        secondresponse = model.generate_content([error_prompt, img])
        jsonString="".join(response.text.split("\n")[1:-1])
        try:
            print("second response")
            print(jsonString)
            json_object = json.loads(jsonString)
            return json_object
        except json.JSONDecodeError:
            return "Error parsing JSON"

