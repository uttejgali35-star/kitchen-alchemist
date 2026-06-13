let savedIngredients = "";
let isRecipeActive = false;

document.getElementById('ingredient-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputWrapper = document.getElementById('input-wrapper');
    const ingredientsInput = document.getElementById('ingredients');
    const submitButton = document.getElementById('submit-btn');
    const resultCard = document.getElementById('result-card');
    
    if (!isRecipeActive) {
        savedIngredients = ingredientsInput.value.trim();
    }
    
    if (!savedIngredients) return;

    // Enter Loading State
    submitButton.disabled = true;
    submitButton.innerText = "Alchemizing meal...";
    submitButton.style.opacity = "0.6";

    // Clear old text out immediately
    document.getElementById('recipe-title').innerText = "Consulting the Stars...";
    document.getElementById('recipe-description').innerText = "Mixing your ingredients into a completely new variation...";
    document.getElementById('recipe-ingredients').innerHTML = '';
    document.getElementById('recipe-steps').innerHTML = '';
    
    // Smooth Loading Activation
    resultCard.classList.remove('hidden');
    resultCard.style.opacity = '0';
    resultCard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        resultCard.style.opacity = '1';
        resultCard.style.transform = 'translateY(0)';
    }, 10);

    try {
        const response = await fetch('/suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients: savedIngredients })
        });
        
        const data = await response.json();

        // Inject text
        document.getElementById('recipe-title').innerText = data.title;
        document.getElementById('recipe-description').innerText = data.description;

        // 🆕 FIXED: Cleanly loop through the schema array and append bullets properly
        const ingredientsUl = document.getElementById('recipe-ingredients');
        ingredientsUl.innerHTML = ''; // Extra clear safety sweep
        
        // Read either variations of the list incoming from the Python object data mapping
        const listToRender = data.ingredients_list || data.ingredients || [];
        listToRender.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            ingredientsUl.appendChild(li);
        });

        // Inject sequential steps
        const stepsOl = document.getElementById('recipe-steps');
        stepsOl.innerHTML = '';
        data.steps.forEach(step => {
            const li = document.createElement('li');
            li.innerText = step;
            stepsOl.appendChild(li);
        });

        inputWrapper.classList.add('hidden');
        isRecipeActive = true;

    } catch (error) {
        console.error("Error running application alchemy:", error);
        document.getElementById('recipe-title').innerText = "Alchemy Interrupted";
    } finally {
        submitButton.disabled = false;
        submitButton.style.opacity = "1";
        
        if (isRecipeActive) {
            submitButton.innerText = "Try Another Recipe";
            
            if (!document.getElementById('change-ingredients-link')) {
                const backLink = document.createElement('p');
                backLink.id = 'change-ingredients-link';
                backLink.innerHTML = `<span style="color: #ff7e5f; cursor: pointer; display: block; margin-top: 15px; font-weight: 600; text-decoration: underline; text-align: center;">← Change Ingredients</span>`;
                
                document.getElementById('ingredient-form').appendChild(backLink);
                
                backLink.addEventListener('click', () => {
                    isRecipeActive = false;
                    savedIngredients = ""; 
                    inputWrapper.classList.remove('hidden');
                    resultCard.classList.add('hidden');
                    submitButton.innerText = "Create Recipe";
                    backLink.remove(); 
                    ingredientsInput.focus();
                });
            }
        } else {
            submitButton.innerText = "Create Recipe";
        }
    }
});