// Spoonacular API Service
// Get your FREE API key at: https://spoonacular.com/food-api/console#Dashboard
// 150 requests/day for free!

const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.spoonacular.com';

// Cache für API Responses (spart API Calls)
const cache = {
  recipes: {},
  searches: {}
};

/**
 * Suche nach Rezepten mit Filtern
 */
export const searchRecipes = async ({
  query = '',
  cuisine = '',
  diet = '',
  type = '', // breakfast, main course, dessert, snack
  intolerances = [],
  excludeIngredients = '',
  number = 10,
  offset = 0
}) => {
  const cacheKey = JSON.stringify({ query, cuisine, diet, type, intolerances, excludeIngredients, number, offset });
  
  if (cache.searches[cacheKey]) {
    return cache.searches[cacheKey];
  }

  try {
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      query,
      cuisine,
      diet,
      type,
      intolerances: intolerances.join(','),
      excludeIngredients,
      number,
      offset,
      addRecipeInformation: true,
      fillIngredients: true,
      instructionsRequired: true
    });

    // Entferne leere Parameter
    for (const [key, value] of [...params.entries()]) {
      if (!value || value === '') {
        params.delete(key);
      }
    }

    const response = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache speichern
    cache.searches[cacheKey] = data;
    
    return data;
  } catch (error) {
    console.error('Spoonacular API Error:', error);
    throw error;
  }
};

/**
 * Hole zufällige Rezepte
 */
export const getRandomRecipes = async ({
  tags = '',
  number = 10
}) => {
  try {
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      tags,
      number
    });

    const response = await fetch(`${BASE_URL}/recipes/random?${params}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Spoonacular API Error:', error);
    throw error;
  }
};

/**
 * Hole Details zu einem spezifischen Rezept
 */
export const getRecipeDetails = async (recipeId) => {
  if (cache.recipes[recipeId]) {
    return cache.recipes[recipeId];
  }

  try {
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      includeNutrition: true
    });

    const response = await fetch(`${BASE_URL}/recipes/${recipeId}/information?${params}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache speichern
    cache.recipes[recipeId] = data;
    
    return data;
  } catch (error) {
    console.error('Spoonacular API Error:', error);
    throw error;
  }
};

/**
 * Formatiere Spoonacular Rezept für unsere App
 */
export const formatRecipe = (spoonacularRecipe) => {
  return {
    id: spoonacularRecipe.id,
    title: spoonacularRecipe.title,
    image: spoonacularRecipe.image,
    readyInMinutes: spoonacularRecipe.readyInMinutes || 30,
    servings: spoonacularRecipe.servings || 2,
    tags: [
      spoonacularRecipe.vegan && 'vegan',
      spoonacularRecipe.vegetarian && 'vegetarisch',
      spoonacularRecipe.glutenFree && 'glutenfrei',
      spoonacularRecipe.dairyFree && 'laktosefrei',
      spoonacularRecipe.veryHealthy && 'gesund',
      spoonacularRecipe.cheap && 'günstig',
      spoonacularRecipe.readyInMinutes < 30 && 'schnell',
      spoonacularRecipe.dishTypes?.includes('breakfast') && 'frühstück',
      spoonacularRecipe.dishTypes?.includes('lunch') && 'mittagessen',
      spoonacularRecipe.dishTypes?.includes('dinner') && 'abendessen',
      spoonacularRecipe.dishTypes?.includes('snack') && 'snack'
    ].filter(Boolean),
    summary: spoonacularRecipe.summary
      ? spoonacularRecipe.summary.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
      : 'Leckeres Rezept ohne Beschreibung.',
    nutrition: spoonacularRecipe.nutrition?.nutrients || [],
    ingredients: spoonacularRecipe.extendedIngredients || [],
    instructions: spoonacularRecipe.analyzedInstructions || []
  };
};

/**
 * Hole Rezepte basierend auf Kategorie
 */
export const getRecipesByCategory = async (category, number = 10) => {
  const typeMapping = {
    breakfast: 'breakfast',
    lunch: 'main course',
    dinner: 'main course',
    snack: 'snack'
  };

  return searchRecipes({
    type: typeMapping[category] || '',
    number
  });
};

/**
 * Hole phasen-spezifische Rezepte
 */
export const getPhaseRecipes = async (phase, category, number = 10) => {
  // Phase-spezifische Nährstoffe
  const phaseNutrients = {
    menstruation: { query: 'iron rich', tags: 'iron,comfort food' },
    follicular: { query: 'energizing', tags: 'high-protein,fresh' },
    ovulation: { query: 'light fresh', tags: 'salad,vegetarian' },
    luteal: { query: 'comfort food', tags: 'complex carbs,magnesium' }
  };

  const phaseConfig = phaseNutrients[phase] || {};
  
  return searchRecipes({
    query: phaseConfig.query,
    type: category === 'breakfast' ? 'breakfast' : category === 'snack' ? 'snack' : 'main course',
    number
  });
};

export default {
  searchRecipes,
  getRandomRecipes,
  getRecipeDetails,
  formatRecipe,
  getRecipesByCategory,
  getPhaseRecipes
};
