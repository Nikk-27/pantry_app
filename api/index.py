from flask import Flask, jsonify, request
from recipe_generator import generate_recipe 
from gemini_image_analysis import analyze_image
from flask_cors import CORS
from werkzeug.utils import secure_filename
import psycopg2
import os

app = Flask(__name__)
CORS(app)

# We'll store images temporarily in a local folder (works on local dev).
# On Vercel, the file system is ephemeral:
UPLOAD_FOLDER = 'images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify({"message": "pantry tracker"})

@app.route("/api/recipe", methods=['GET'])
def get_recipe():
    items = request.args.get('items', '')
    item_list = [item.strip() for item in items.split(',') if item.strip()]
    
    if not item_list:
        return jsonify({"error": "No items provided"}), 400

    recipe = generate_recipe(item_list)
    return jsonify({"items": item_list, "recipe": recipe})

@app.route('/api/image', methods=['POST'])
def upload_image():
    """
    Steps:
      1) Receives an image file
      2) Saves it (ephemerally)
      3) Analyzes -> result dict
      4) Checks for 'Item Name'
         - If none, returns "No item detected"
         - Else, store data in Postgres & Firebase
      5) Responds with result
    """
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        # 1) Save file
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
        file.save(filepath)
        print(f"Image saved to: {filepath}")

        # 2) Analyze
        result = analyze_image(filepath)
        print(f"Analyze result: {result}")

        # 3) Remove local file
        os.remove(filepath)

        # 4) Check item name
        item_name = result.get('Item Name', '').strip()
        if not item_name:
            # Return early, skip both DB & Firebase
            return jsonify({"message": "No item detected"}), 400

        # 5) If we do have an item name, store in Postgres
        store_analysis_in_image_details(result)

        # 6) Then store in Firebase
        store_analysis_in_firebase(result)

        # 7) Return the analysis results
        return jsonify(result), 200

    except Exception as e:
        print(f"Error handling the image: {e}")
        return jsonify({"error": str(e)}), 500

def store_analysis_in_image_details(result):
    """
    Insert the data into the 'image_details' table:
      id SERIAL PRIMARY KEY,
      item_name TEXT NOT NULL,
      category TEXT,
      estimated_quantity TEXT,
      brand TEXT,
      expiration TEXT
    """
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not set in environment.")
        return

    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        # No fallback to 'Unknown' here. We'll rely on the item_name check above.
        item_name = result.get('Item Name', '').strip()
        category = result.get('Category', '')
        estimated_qty = result.get('Estimated Quantity', '')
        brand = result.get('Brand', '')
        expiration = result.get('Expiration', '')

        insert_query = """
            INSERT INTO image_details
                (item_name, category, estimated_quantity, brand, expiration)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """
        cursor.execute(
            insert_query,
            (item_name, category, estimated_qty, brand, expiration)
        )
        new_id = cursor.fetchone()[0]
        conn.commit()

        print(f"Inserted item record with ID = {new_id}")

        cursor.close()
        conn.close()
    except Exception as db_error:
        print(f"Database error: {db_error}")

def store_analysis_in_firebase(result):
    """
    OPTIONAL: Only called if we have 'Item Name'.
    Adjust with your actual Firebase logic & credentials.
    """
    item_name = result.get('Item Name', '').strip()
    if not item_name:
        # Double-check or skip entirely
        print("No item name detected, skipping Firebase upload.")
        return

    # EXAMPLE placeholder:
    # import firebase_admin
    # from firebase_admin import credentials, firestore
    #
    # if not firebase_admin._apps:
    #     cred = credentials.Certificate("path/to/serviceAccountKey.json")
    #     firebase_admin.initialize_app(cred)
    #
    # db = firestore.client()
    # doc_ref = db.collection("image_details").document()
    # doc_ref.set({
    #     "Item Name": item_name,
    #     "Category": result.get("Category", ""),
    #     "Estimated Quantity": result.get("Estimated Quantity", ""),
    #     "Brand": result.get("Brand", ""),
    #     "Expiration": result.get("Expiration", "")
    # })

if __name__=="__main__":
    app.run(debug=True, port=5328)  # Change the port to match Next.js config
