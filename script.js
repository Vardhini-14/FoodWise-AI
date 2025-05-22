document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // --- Helper function to show/hide loading overlay ---
    function showLoading() {
        if (loadingOverlay) {
            loadingOverlay.classList.add('visible');
        }
    }

    function hideLoading() {
        if (loadingOverlay) {
            loadingOverlay.classList.remove('visible');
        }
    }

    // --- Mobile Navigation Toggle ---
    if (burger && nav && navLinks) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');

            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            burger.classList.toggle('toggle');
        });

        // --- Close nav when a link is clicked ---
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(item => item.style.animation = ''); // Reset animation
            });
        });
    }


    // --- Smooth scrolling for navigation links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Hero CTA Button Scroll ---
    const heroCtaButton = document.querySelector('.hero-cta-button');
    if (heroCtaButton) {
        heroCtaButton.addEventListener('click', () => {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }


    // --- Feature Implementations ---

    // 1. BMI Calculator
    const calculateBmiButton = document.getElementById('calculateBmiButton');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const bmiResultDiv = document.getElementById('bmiResult');

    if (calculateBmiButton) {
        calculateBmiButton.addEventListener('click', () => {
            const weight = parseFloat(weightInput.value);
            const height = parseFloat(heightInput.value); // Height in cm

            bmiResultDiv.className = 'bmi-result'; // Reset class for styling

            if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
                bmiResultDiv.textContent = 'Please enter valid positive numbers for weight and height.';
                bmiResultDiv.classList.add('error');
                return;
            }

            // BMI calculation: weight (kg) / (height (m))^2
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            const roundedBmi = bmi.toFixed(2);

            let category = '';
            if (bmi < 18.5) {
                category = 'Underweight';
                bmiResultDiv.classList.add('warning');
            } else if (bmi >= 18.5 && bmi < 24.9) {
                category = 'Normal weight';
                bmiResultDiv.classList.add('success');
            } else if (bmi >= 25 && bmi < 29.9) {
                category = 'Overweight';
                bmiResultDiv.classList.add('warning');
            } else {
                category = 'Obesity';
                bmiResultDiv.classList.add('error');
            }

            bmiResultDiv.textContent = `Your BMI: ${roundedBmi} (${category})`;
        });
    }

    // 2. Recipe Finder (with dummy data and filtering)
    const recipeSearchInput = document.getElementById('recipeSearchInput');
    const dietaryFilter = document.getElementById('dietaryFilter');
    const allergenFilter = document.getElementById('allergenFilter');
    const searchRecipeButton = document.getElementById('searchRecipeButton');
    const recipeResultsGrid = document.getElementById('recipeResultsGrid');
    const loadMoreRecipesButton = document.getElementById('loadMoreRecipesButton');

    // Dummy Recipe Data (replace with API calls to your GenAI backend later)
    const allRecipes = [
        {
            id: 1,
            name: "Mediterranean Quinoa Salad",
            description: "A light and refreshing salad packed with protein and fresh vegetables.",
            image: "salad.jpg", // Placeholder
            tags: ["Vegetarian", "Gluten-Free", "Healthy", "Lunch"],
            allergens: []
        },
        {
            id: 2,
            name: "Spicy Chicken Stir-fry",
            description: "Quick, flavorful, and loaded with vibrant veggies for a balanced meal.",
            image: "https://placehold.co/400x250/FFD54F/333333?text=Chicken+Stir-fry", // Placeholder
            tags: ["Dinner", "Healthy", "High-Protein"],
            allergens: ["Soy"]
        },
        {
            id: 3,
            name: "Berry Almond Smoothie Bowl",
            description: "Start your day with this nutrient-dense and delicious breakfast bowl.",
            image: "https://placehold.co/400x250/FF6F61/ffffff?text=Smoothie+Bowl", // Placeholder
            tags: ["Breakfast", "Vegan", "Gluten-Free", "Healthy"],
            allergens: ["Tree Nuts"]
        },
        {
            id: 4,
            name: "Hearty Lentil Soup",
            description: "A comforting and protein-rich soup, perfect for any season.",
            image: "https://placehold.co/400x250/8BC34A/ffffff?text=Lentil+Soup", // Placeholder
            tags: ["Vegan", "Gluten-Free", "Soup", "Healthy"],
            allergens: []
        },
        {
            id: 5,
            name: "Baked Salmon with Asparagus",
            description: "Simple yet elegant, a healthy meal bursting with omega-3s.",
            image: "https://placehold.co/400x250/2196F3/ffffff?text=Salmon+Asparagus", // Placeholder
            tags: ["Dinner", "Healthy", "Fish"],
            allergens: ["Fish"]
        },
        {
            id: 6,
            name: "Creamy Coconut Vegetable Curry",
            description: "A flavorful and wholesome plant-based meal for the whole family.",
            image: "https://placehold.co/400x250/FF9800/ffffff?text=Veg+Curry", // Placeholder
            tags: ["Vegan", "Dinner", "Spicy"],
            allergens: []
        },
        {
            id: 7,
            name: "Healthy Breakfast Burrito",
            description: "Packed with eggs, beans, and veggies for a great start to your day.",
            image: "https://placehold.co/400x250/795548/ffffff?text=Breakfast+Burrito", // Placeholder
            tags: ["Breakfast", "Vegetarian"],
            allergens: ["Eggs"]
        },
        {
            id: 8,
            name: "Gourmet Avocado Toast",
            description: "Simple, yet satisfying and loaded with healthy fats.",
            image: "https://placehold.co/400x250/CDDC39/333333?text=Avocado+Toast", // Placeholder
            tags: ["Breakfast", "Vegetarian", "Quick"],
            allergens: ["Wheat"] // Assuming bread contains wheat
        },
        {
            id: 9,
            name: "Light Chicken Salad Wraps",
            description: "Fresh and easy for a quick lunch or dinner.",
            image: "https://placehold.co/400x250/9C27B0/ffffff?text=Chicken+Wraps", // Placeholder
            tags: ["Lunch", "High-Protein"],
            allergens: []
        },
        {
            id: 10,
            name: "Spinach and Feta Stuffed Chicken",
            description: "Juicy chicken breast stuffed with a flavorful spinach and feta mixture.",
            image: "https://placehold.co/400x250/E91E63/ffffff?text=Stuffed+Chicken", // Placeholder
            tags: ["Dinner", "High-Protein"],
            allergens: ["Dairy"]
        },
        {
            id: 11,
            name: "Vegan Chickpea & Spinach Curry",
            description: "A rich and flavorful plant-based curry that's easy to make.",
            image: "https://placehold.co/400x250/00BCD4/ffffff?text=Chickpea+Curry", // Placeholder
            tags: ["Vegan", "Dinner", "Quick"],
            allergens: []
        },
         {
            id: 12,
            name: "Grilled Portobello Mushroom Burgers",
            description: "A hearty and satisfying vegetarian burger alternative.",
            image: "https://placehold.co/400x250/4CAF50/ffffff?text=Mushroom+Burger", // Placeholder
            tags: ["Vegetarian", "Grill", "Lunch"],
            allergens: []
        },
         {
            id: 13,
            name: "Lemon Herb Roasted Chicken and Veggies",
            description: "A simple sheet pan dinner bursting with fresh flavors.",
            image: "https://placehold.co/400x250/FFEB3B/333333?text=Roasted+Chicken", // Placeholder
            tags: ["Dinner", "Healthy", "One-Pan"],
            allergens: []
        },
         {
            id: 14,
            name: "Sweet Potato and Black Bean Chili",
            description: "A warming and nutritious chili that's perfect for a crowd.",
            image: "https://placehold.co/400x250/7B1FA2/ffffff?text=Sweet+Potato+Chili", // Placeholder
            tags: ["Vegan", "Dinner", "Comfort Food"],
            allergens: []
        },
        {
            id: 15,
            name: "Quinoa Stuffed Bell Peppers",
            description: "Colorful bell peppers filled with nutritious quinoa and vegetables.",
            image: "https://placehold.co/400x250/F44336/ffffff?text=Stuffed+Peppers", // Placeholder
            tags: ["Vegetarian", "Gluten-Free", "Dinner"],
            allergens: []
        },
        {
            id: 16,
            name: "Broccoli Cheddar Soup",
            description: "A creamy and comforting soup, packed with broccoli goodness.",
            image: "https://placehold.co/400x250/FFC107/333333?text=Broccoli+Soup", // Placeholder
            tags: ["Vegetarian", "Soup"],
            allergens: ["Dairy"]
        },
        {
            id: 17,
            name: "Shrimp Scampi with Zucchini Noodles",
            description: "A light and flavorful seafood dish, low in carbs.",
            image: "https://placehold.co/400x250/009688/ffffff?text=Shrimp+Scampi", // Placeholder
            tags: ["Dinner", "Low-Carb", "Seafood"],
            allergens: ["Shellfish"]
        },
        {
            id: 18,
            name: "Overnight Oats with Chia Seeds",
            description: "Prepare this healthy breakfast the night before for a quick morning.",
            image: "https://placehold.co/400x250/9E9E9E/ffffff?text=Overnight+Oats", // Placeholder
            tags: ["Breakfast", "Vegan", "Gluten-Free", "Quick"],
            allergens: []
        }
    ];

    let currentRecipeStartIndex = 0;
    const recipesPerPage = 6; // Number of recipes to show initially and on 'Load More'
    let currentFilteredRecipes = []; // To store the currently filtered recipes

    function renderRecipes(recipesToDisplay) {
        recipeResultsGrid.innerHTML = ''; // Clear previous results
        if (recipesToDisplay.length === 0) {
            recipeResultsGrid.innerHTML = '<p class="placeholder-text">No recipes found matching your criteria.</p>';
            loadMoreRecipesButton.style.display = 'none';
            return;
        }

        // Determine which recipes to display based on currentRecipeStartIndex and recipesPerPage
        const visibleRecipes = recipesToDisplay.slice(0, currentRecipeStartIndex + recipesPerPage);

        visibleRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.name}" onerror="this.onerror=null;this.src='https://placehold.co/400x250/cccccc/333333?text=Image+Not+Found';">
                <h3>${recipe.name}</h3>
                <p>${recipe.description}</p>
                <div class="recipe-tags">
                    ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                ${recipe.allergens.length > 0 ? `<div class="allergy-alert-tag"><i class="fas fa-exclamation-triangle"></i> Allergens: ${recipe.allergens.join(', ')}</div>` : ''}
                <a href="#" class="view-recipe-button">View Recipe</a>
            `;
            recipeResultsGrid.appendChild(recipeCard);
        });

        // Show/hide Load More button
        if (currentRecipeStartIndex + recipesPerPage < recipesToDisplay.length) {
            loadMoreRecipesButton.style.display = 'block';
        } else {
            loadMoreRecipesButton.style.display = 'none';
        }
    }

    function filterAndSearchRecipes() {
        currentRecipeStartIndex = 0; // Reset index on new search/filter
        const searchTerm = recipeSearchInput.value.toLowerCase();
        const selectedDiet = dietaryFilter.value;
        const selectedAllergen = allergenFilter.value;

        currentFilteredRecipes = allRecipes.filter(recipe => {
            const matchesSearch = recipe.name.toLowerCase().includes(searchTerm) ||
                                  recipe.description.toLowerCase().includes(searchTerm) ||
                                  recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm));

            const matchesDiet = selectedDiet === "" || recipe.tags.includes(selectedDiet);

            // Check if recipe contains the selected allergen. If an allergen is selected,
            // we only want to show recipes that *do not* contain that allergen.
            const hasSelectedAllergen = selectedAllergen !== "" && recipe.allergens.includes(selectedAllergen);
            const matchesAllergen = selectedAllergen === "" || !hasSelectedAllergen;

            return matchesSearch && matchesDiet && matchesAllergen;
        });

        renderRecipes(currentFilteredRecipes);
    }

    if (searchRecipeButton) {
        searchRecipeButton.addEventListener('click', filterAndSearchRecipes);
        recipeSearchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                filterAndSearchRecipes();
            }
        });
        dietaryFilter.addEventListener('change', filterAndSearchRecipes);
        allergenFilter.addEventListener('change', filterAndSearchRecipes);
    }

    if (loadMoreRecipesButton) {
        loadMoreRecipesButton.addEventListener('click', () => {
            currentRecipeStartIndex += recipesPerPage;
            renderRecipes(currentFilteredRecipes); // Render more from the already filtered set
        });
    }

    // Initial load of recipes
    filterAndSearchRecipes(); // Call this to initially populate and set up filtering


    // 3. Meal Planning (Simulated GenAI Response)
    const generateMealPlanButton = document.querySelector('.generate-meal-plan-button');
    const mealPreferencesTextarea = document.getElementById('mealPreferences');
    const mealPlanOutputDiv = document.getElementById('mealPlanOutput');

    if (generateMealPlanButton) {
        generateMealPlanButton.addEventListener('click', async () => {
            const preferences = mealPreferencesTextarea.value.trim();
            mealPlanOutputDiv.innerHTML = '<p class="placeholder-text">Generating your personalized meal plan...</p>';
            showLoading(); // Show loading overlay

            if (!preferences) {
                mealPlanOutputDiv.innerHTML = '<p class="placeholder-text error">Please enter your meal preferences to generate a plan.</p>';
                hideLoading(); // Hide loading overlay
                return;
            }

            // Simulate API call to a GenAI backend
            // In a real application, you would send 'preferences' to your backend
            // const response = await fetch('/api/generate-meal-plan', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ preferences })
            // });
            // const data = await response.json();
            // mealPlanOutputDiv.textContent = data.mealPlan;

            // --- Dummy GenAI response ---
            setTimeout(() => {
                const dummyMealPlan = `
Based on your preference for "${preferences}", here's a sample 3-day meal plan:

**Day 1: Mediterranean Delight**
* **Breakfast:** Greek Yogurt with Berries, Almonds, and a drizzle of Honey.
* **Lunch:** Large Quinoa Salad with Cucumbers, Tomatoes, Olives, Feta (optional), and Lemon-Herb Vinaigrette.
* **Dinner:** Baked Salmon with Roasted Asparagus and Sweet Potato.

**Day 2: Asian-Inspired Freshness**
* **Breakfast:** Berry Almond Smoothie Bowl (as seen in our recipes!).
* **Lunch:** Chicken Lettuce Wraps with a light peanut sauce.
* **Dinner:** Spicy Tofu and Vegetable Stir-fry (use your preferred protein if no tofu).

**Day 3: Hearty & Wholesome**
* **Breakfast:** Scrambled Eggs with Spinach and Whole Wheat Toast.
* **Lunch:** Lentil Soup with a side of whole-grain bread.
* **Dinner:** Lean Ground Turkey Chili with Black Beans and Corn.

**Shopping List Highlights:**
* Produce: Berries, Almonds, Cucumbers, Tomatoes, Olives, Asparagus, Sweet Potatoes, Bell Peppers, Broccoli, Spinach, Lettuce, Onions, Garlic, Lemons, Herbs.
* Proteins: Greek Yogurt, Salmon, Chicken Breast/Tofu, Eggs, Lentils, Ground Turkey.
* Pantry: Quinoa, Olive Oil, Honey, Peanut Butter, Coconut Milk, Spices, Whole Wheat Bread.

Remember to adjust portion sizes to your specific calorie needs and always consult with a healthcare professional for personalized dietary advice.
                `;
                mealPlanOutputDiv.innerHTML = `<pre>${dummyMealPlan}</pre>`; // Use <pre> to preserve line breaks
                hideLoading(); // Hide loading overlay
            }, 2000); // Simulate network delay
        });
    }

    // 4. Healthy Food Swaps (Simulated GenAI Response)
    const getSwapSuggestionButton = document.getElementById('getSwapSuggestionButton');
    const swapSuggestionInput = document.getElementById('swapSuggestionInput');
    const genaiSwapOutputDiv = document.getElementById('genaiSwapOutput');

    if (getSwapSuggestionButton) {
        getSwapSuggestionButton.addEventListener('click', async () => {
            const query = swapSuggestionInput.value.trim();
            genaiSwapOutputDiv.innerHTML = '<p class="placeholder-text">Searching for healthy swap suggestions...</p>';
            showLoading(); // Show loading overlay

            if (!query) {
                genaiSwapOutputDiv.innerHTML = '<p class="placeholder-text error">Please enter an ingredient or dish to get a swap suggestion.</p>';
                hideLoading(); // Hide loading overlay
                return;
            }

            // Simulate API call to a GenAI backend
            // const response = await fetch('/api/get-food-swap', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ query })
            // });
            // const data = await response.json();
            // genaiSwapOutputDiv.textContent = data.swapSuggestion;

            // --- Dummy GenAI response ---
            setTimeout(() => {
                let swapResult = '';
                if (query.toLowerCase().includes('pasta')) {
                    swapResult = `For "pasta," consider these healthy swaps:
* **Zucchini Noodles (Zoodles):** A great low-carb, vegetable-based alternative.
* **Spaghetti Squash:** A natural, low-calorie, and fiber-rich option.
* **Whole Wheat or Lentil Pasta:** If you want to stick to pasta, these offer more fiber and protein.
* **Shirataki Noodles:** Very low in calories and carbs, often used in Asian cuisine.`;
                } else if (query.toLowerCase().includes('sugar')) {
                    swapResult = `For "sugar" in recipes, consider:
* **Stevia or Erythritol:** Natural, zero-calorie sweeteners.
* **Maple Syrup or Honey:** Natural sweeteners (use in moderation, still sugars).
* **Mashed Banana or Applesauce:** Can replace sugar and add moisture in baking.`;
                } else if (query.toLowerCase().includes('butter')) {
                    swapResult = `For "butter" in cooking/baking:
* **Avocado:** Can be mashed and used as a healthy fat replacement in baking.
* **Applesauce:** A fat replacer in baking, adds moisture.
* **Coconut Oil:** A plant-based alternative, but still high in saturated fat.
* **Olive Oil:** Great for savory dishes, but changes flavor profile in baking.`;
                } else if (query.toLowerCase().includes('soda')) {
                    swapResult = `Instead of "soda", try:
* **Sparkling Water with Lemon/Lime:** Refreshing and sugar-free.
* **Unsweetened Iced Tea:** A flavorful, low-calorie option.
* **Fruit-infused Water:** Add slices of cucumber, mint, berries for natural flavor.`;
                } else if (query.toLowerCase().includes('chips')) {
                    swapResult = `Instead of "chips", try:
* **Air-popped Popcorn:** Whole grain, high in fiber.
* **Baked Kale Chips:** Crispy, nutritious, and easy to make.
* **Sliced Cucumbers or Carrots with Hummus:** Crunchy and packed with nutrients.`;
                }
                else {
                    swapResult = `Our GenAI is thinking... For "${query}", a common healthy swap could be:
* **[Original Food]** <i class="fas fa-exchange-alt"></i> **[Healthier Alternative]**
    * **Reason:** [Brief explanation of benefits].

Please ask me for more specific items like 'soda', 'chips', 'milk chocolate', 'white bread', etc.`;
                }
                genaiSwapOutputDiv.innerHTML = `<pre>${swapResult}</pre>`;
                hideLoading(); // Hide loading overlay
            }, 1500); // Simulate network delay
        });
    }

    // --- General Nutritional Tips (already static in HTML, no JS needed for display) ---

    // --- Allergy Alerts (Integrated into Recipe Finder for this version) ---
    // The recipe cards now show allergy alerts dynamically based on the dummy data.
    // In a real system, user would input their allergies, and the AI would filter/warn.

});