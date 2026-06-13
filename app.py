import os  # 🆕 Built-in Python module to read environment variables
import json
from flask import Flask, render_template, request, jsonify
from google import genai
from pydantic import BaseModel
from dotenv import load_dotenv  # 🆕 Import the dotenv loader

# 🆕 Load the variables from your hidden .env file
load_dotenv()

app = Flask(__name__)

# 🆕 Securely grab the key out of thin air! No more hardcoding.
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

# ... (The rest of your RecipeSchema, generate_recipe, and routes stay exactly the same!) ...

# 🆕 Renamed the field to ingredients_list to keep it completely unique
class RecipeSchema(BaseModel):
    title: str
    description: str
    ingredients_list: list[str]
    steps: list[str]

def generate_recipe(ingredients_text):
    ingredients = [item.strip() for item in ingredients_text.split(",") if item.strip()]
    if not ingredients:
        return {
            "title": "Kitchen Alchemist Needs Ingredients",
            "description": "Please add at least one ingredient so the magic can begin.",
            "ingredients_list": [],
            "steps": []
        }

    prompt = (
        "You are a soulful kitchen alchemist. "
        "Create a beautiful, premium, nature-inspired recipe based on the provided ingredients. "
        "Match a warm, organic sunset vibe."
        f"Ingredients available: {', '.join(ingredients)}."
    )

    # 🆕 Direct, transparent call. No hidden loops!
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": RecipeSchema,
                "temperature": 0.7
            }
        )
        
        # Parse the JSON clean and straight
        return json.loads(response.text)
        
    except Exception as e:
        # 🆕 This will print the EXACT error directly into your VS Code terminal text space!
        print("\n❌ !!! GEMINI API ERROR REVEALED !!! ❌")
        print(e)
        print("❌ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ❌\n")
        
        return {
            "title": "Alchemy Interrupted",
            "description": f"Error visible in your terminal: {str(e)}",
            "ingredients_list": [],
            "steps": []
        }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/suggest", methods=["POST"])
def suggest():
    data = request.get_json() or {}
    ingredients = data.get("ingredients", "")
    
    # Send it out to our clean generator function
    recipe_data = generate_recipe(ingredients)
    return jsonify(recipe_data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)