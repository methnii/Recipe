const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";
let currentPage = 1;
let currentSearchTerm = "";
let currentCategory = "";
let allMeals = [];
const recipesPerPage = 12;
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
let currentAlphabetIndex = 0;

async function fetchRecipesByLetter(letter) {
  const response = await fetch(`${API_BASE_URL}/search.php?f=${letter}`);
  const data = await response.json();
  return data.meals || [];
}

async function searchRecipes(newSearch = true) {
  if (newSearch) {
    currentPage = 1;
    currentSearchTerm = document.getElementById("searchInput").value;
    currentCategory = document.getElementById("categoryFilter").value;
    allMeals = [];
    currentAlphabetIndex = 0;
  }

  const loadingIndicator = document.getElementById("loadingIndicator");
  loadingIndicator.classList.remove("hidden");

  try {
    if (currentSearchTerm) {
      // If there's a search term, use the search endpoint
      const response = await fetch(
        `${API_BASE_URL}/search.php?s=${currentSearchTerm}`
      );
      const data = await response.json();
      allMeals = data.meals || [];
    } else {
      // If no search term, load recipes by letters
      while (allMeals.length < 100 && currentAlphabetIndex < alphabet.length) {
        const newMeals = await fetchRecipesByLetter(
          alphabet[currentAlphabetIndex]
        );
        allMeals = [...allMeals, ...newMeals];
        currentAlphabetIndex++;
      }
    }

    // Apply category filter if selected
    if (currentCategory) {
      allMeals = allMeals.filter((meal) =>
        meal.strCategory.toLowerCase().includes(currentCategory.toLowerCase())
      );
    }

    displayRecipes(newSearch);

    // Show/hide load more button
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (allMeals.length > currentPage * recipesPerPage) {
      loadMoreBtn.classList.remove("hidden");
    } else if (currentAlphabetIndex < alphabet.length) {
      loadMoreBtn.classList.remove("hidden");
    } else {
      loadMoreBtn.classList.add("hidden");
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
  } finally {
    loadingIndicator.classList.add("hidden");
  }
}

function displayRecipes(newSearch = true) {
  const grid = document.getElementById("recipeGrid");
  if (newSearch) {
    grid.innerHTML = "";
  }

  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = currentPage * recipesPerPage;
  const mealsToDisplay = allMeals.slice(startIndex, endIndex);

  mealsToDisplay.forEach((meal) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow";
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" 
           class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="text-xl font-semibold text-amber-900 mb-2">${meal.strMeal}</h3>
        <p class="text-gray-600 mb-4">Category: ${meal.strCategory}</p>
        <button onclick="showRecipeDetails('${meal.idMeal}')"
                class="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 w-full">
          View Recipe
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function loadMoreRecipes() {
  if (allMeals.length <= currentPage * recipesPerPage) {
    // Need to fetch more recipes
    await searchRecipes(false);
  }
  currentPage++;
  displayRecipes(false);
}

async function showRecipeDetails(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    const meal = data.meals[0];

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(`
          <li>${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>
        `);
      }
    }

    document.getElementById("modalContent").innerHTML = `
      <h2 class="text-2xl font-bold text-amber-900 mb-4">${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" 
           class="w-full h-64 object-cover rounded-lg mb-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-xl font-semibold mb-2">Ingredients</h3>
          <ul class="list-disc pl-5">
            ${ingredients.join("")}
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-2">Instructions</h3>
          <p class="text-gray-700">${meal.strInstructions}</p>
        </div>
      </div>
    `;

    document.getElementById("recipeModal").classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching recipe details:", error);
  }
}

function closeModal() {
  document.getElementById("recipeModal").classList.add("hidden");
}

// Initial search on page load
window.onload = () => {
  searchRecipes();
};


document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  console.log(`Username: ${username}, Password: ${password}`);
  
});
