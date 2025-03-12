
from groq import Groq
import os
from dotenv import load_dotenv
import re

# Load environment variables from .env file
load_dotenv()
API_KEY = os.getenv('API_KEY')
def generate_recipe(items):
    api_key=API_KEY
    client = Groq(api_key=api_key)
    prompt="""You are a creative and knowledgeable chef assistant.
 I will provide you with a list of ingredients available in my pantry. Your task is to suggest a delicious recipe that uses some or all of these ingredients. 
The recipe should be relatively simple to prepare and suitable for a home cook. 
Please format your response as follows: 
1. Recipe Name 
2. Brief description (1-2 sentences) 
3. Ingredients (list only the ones from my pantry that you're using, plus any common staples like salt, pepper, or oil) 
4. Instructions (step-by-step) 
5. Estimated preparation and cooking time 
6. Any tips or variations 
Here are the ingredients available in my pantry: {} Please suggest a recipe based on these ingredients.
"""
    message=[
        {
            "role": "user",
            "content":prompt.format(items)
        },
        {
            "role": "assistant",
            "content": ""
        }
        ]
    try:
        completion = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=message,
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
        )

        result=""
        for chunk in completion:
            result+=chunk.choices[0].delta.content or ""
    
        # result=re.sub(r'\s+', ' ', result).strip()
        return result
    except Except as e:
        return f"An error occured: {e}"