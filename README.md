# Kitchen Alchemist

A simple Flask-powered web app that turns random kitchen ingredients into a custom recipe idea with a light green / sunset nature aesthetic.

## Run locally

1. Install dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   ```

2. Start the app:
   ```powershell
   python app.py
   ```

3. Open `http://127.0.0.1:5000` in your browser.

## How it works

- `app.py` serves the frontend and exposes `/suggest` for ingredient-based recipe generation.
- `templates/index.html` is the landing page.
- `static/css/styles.css` contains the organic, light-green sunset styling.
- `static/js/app.js` sends the ingredients to the backend and renders the recipe.

## Next step

Replace `generate_recipe()` in `app.py` with a real AI integration when you are ready. For the hackathon, this starter app gives you a clean local prototype.
