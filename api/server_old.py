from flask import Flask,jsonify,request
from recipe_generator import generate_recipe 
from gemini_image_analysis import analyze_image
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

#flask app instance
app=Flask(__name__)
CORS(app)
@app.route("/api/home",methods=['GET'])
def return_home():
    return jsonify({
        'message':"pantry tracker"
    })
@app.route("/api/recipe", methods=['GET'])
def get_recipe():
    # Get the items from the query parameter
    items = request.args.get('items', '')
    
    # Split the items into a list
    item_list = [item.strip() for item in items.split(',') if item.strip()]
    
    if not item_list:
        return jsonify({"error": "No items provided"}), 400

    # Here you would typically call your recipe generation function
    # For this example, we'll just return a simple response
    recipe = generate_recipe(item_list)

    return jsonify({
        "items": item_list,
        "recipe": recipe
    })
UPLOAD_FOLDER = 'images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
@app.route('/api/image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        try:
            os.makedirs(UPLOAD_FOLDER, exist_ok=True) 
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            print(f"Image saved successfully to: {filepath}")
            # Process the image
            result = analyze_image(filepath)
            os.remove(filepath)
            
            print(f"product details: {result}")
            return result
        except Exception as e:
            print(f"Error saving image: {e}")
            return jsonify({"error": "Error saving image file"}), 500

if __name__=="__main__":
    app.run()