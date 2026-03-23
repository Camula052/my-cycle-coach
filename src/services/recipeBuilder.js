// Modular Recipe Builder & Sharing System
import recipeComponents from './recipeComponents';

// Translation helper - directly access translation files
// (Can't use useTranslation hook in service files)
let translationsCache = null;

const getTranslations = () => {
  if (translationsCache) return translationsCache;
  
  try {
    // Import German translations (adjust path based on your structure)
    const de = require('../translations/de.json');
    translationsCache = de;
    return de;
  } catch (e) {
    console.warn('Could not load translations:', e);
    return null;
  }
};

const t = (key) => {
  const translations = getTranslations();
  if (!translations) return key;
  
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k];
    } else {
      console.warn(`Translation missing for: ${key}`);
      return key;
    }
  }
  
  return value;
};

const translateComponent = (componentId) => {
  const translated = t(`recipe.components.${componentId}`);
  return translated !== `recipe.components.${componentId}` ? translated : componentId;
};

const translateCookingMethod = (methodKey) => {
  const translated = t(`recipe.cookingMethods.${methodKey}`);
  return translated !== `recipe.cookingMethods.${methodKey}` ? translated : methodKey;
};

const translateCookingVerb = (methodKey) => {
  const translated = t(`recipe.cookingVerbs.${methodKey}`);
  return translated !== `recipe.cookingVerbs.${methodKey}` ? translated : methodKey;
};

const getPhaseDescription = (phaseKey) => {
  return t(`recipe.phaseDescriptions.${phaseKey}`) || '';
};

/**
 * Build a complete recipe from components
 * Now supports multiple components per type!
 */
export const buildRecipe = ({
  template = 'bowl',
  proteins = [], // Changed to array
  carbs = [],    // Changed to array
  vegetables = [],
  sauce = null,  // Can be preset ID or custom sauce object
  toppings = [],
  cookingMethod,
  phase = 'follicular'
}) => {
  // Convert single values to arrays for backwards compatibility
  if (!Array.isArray(proteins)) proteins = [proteins];
  if (!Array.isArray(carbs)) carbs = [carbs];

  // Get component data
  const proteinData = proteins.map(p => findComponent('proteins', p)).filter(Boolean);
  const carbData = carbs.map(c => findComponent('carbs', c)).filter(Boolean);
  const veggieData = vegetables.map(v => findComponent('vegetables', v)).filter(Boolean);
  const sauceData = buildSauce(sauce);
  const toppingData = toppings.map(t => findComponent('toppings', t)).filter(Boolean);
  const methodData = recipeComponents.cookingMethods[cookingMethod];

  // Calculate totals
  const totalCalories = 
    proteinData.reduce((sum, p) => sum + (p?.calories || 0), 0) + 
    carbData.reduce((sum, c) => sum + (c?.calories || 0), 0) + 
    veggieData.reduce((sum, v) => sum + (v?.calories || 0), 0) +
    (sauceData?.calories || 0) +
    toppingData.reduce((sum, t) => sum + (t?.calories || 0), 0);

  const totalProtein = 
    proteinData.reduce((sum, p) => sum + (p?.protein || 0), 0) + 
    carbData.reduce((sum, c) => sum + (c?.protein || 0), 0) + 
    veggieData.reduce((sum, v) => sum + (v?.protein || 0), 0);

  const cookingTime = Math.max(
    ...proteinData.map(p => p?.cookingTime || 0),
    ...carbData.map(c => c?.cookingTime || 0),
    ...veggieData.map(v => v?.cookingTime || 0),
    0
  );

  // Generate title
  const title = generateTitle({
    proteins: proteinData,
    carbs: carbData,
    vegetables: veggieData,
    sauce: sauceData,
    method: methodData
  });

  // Generate instructions
  const instructions = generateInstructions({
    proteins: proteinData,
    carbs: carbData,
    vegetables: veggieData,
    sauce: sauceData,
    toppings: toppingData,
    method: methodData
  });

  // Generate ingredients list
  const ingredients = generateIngredientsList({
    proteins: proteinData,
    carbs: carbData,
    vegetables: veggieData,
    sauce: sauceData,
    toppings: toppingData
  });

  return {
    id: generateId(),
    title,
    template,
    components: {
      proteins: proteins,
      carbs: carbs,
      vegetables: vegetables,
      sauce: sauce,
      toppings: toppings,
      cookingMethod: cookingMethod
    },
    readyInMinutes: cookingTime + (sauceData?.prepTime || 0),
    servings: 2,
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein),
    phase,
    ingredients,
    instructions,
    summary: generateSummary({ proteins: proteinData, phase }),
    tags: generateTags({ proteins: proteinData, carbs: carbData, phase }),
    image: generateImageUrl({ proteins, carbs, template }),
    isCustom: true,
    createdAt: new Date().toISOString()
  };
};

/**
 * Build sauce from components or use preset
 */
const buildSauce = (sauce) => {
  if (!sauce) return null;

  // If it's a string, it's a preset ID
  if (typeof sauce === 'string') {
    const preset = recipeComponents.sauces.presets.find(p => p.id === sauce);
    if (preset) {
      // Build full sauce from preset components
      return buildCustomSauce(preset.components);
    }
  }

  // If it's an object with components, build custom sauce
  if (sauce.base) {
    return buildCustomSauce(sauce);
  }

  return null;
};

/**
 * Build custom sauce from components
 */
const buildCustomSauce = ({ base, flavors = [], extras = [] }) => {
  const baseData = recipeComponents.sauces.bases.find(b => b.id === base);
  const flavorData = flavors.map(f => 
    recipeComponents.sauces.flavors.find(fl => fl.id === f)
  ).filter(Boolean);
  const extraData = extras.map(e => 
    recipeComponents.sauces.extras.find(ex => ex.id === e)
  ).filter(Boolean);

  if (!baseData) return null;

  const totalCalories = 
    (baseData.calories || 0) +
    flavorData.reduce((sum, f) => sum + (f.calories || 0), 0) +
    extraData.reduce((sum, e) => sum + (e.calories || 0), 0);

  const allIngredients = [
    ...baseData.ingredients,
    ...flavorData.map(f => f.name),
    ...extraData.map(e => e.name)
  ];

  const name = generateSauceName(baseData, flavorData, extraData);

  return {
    name,
    calories: totalCalories,
    ingredients: allIngredients,
    prepTime: 5 + (extras.length * 2)
  };
};

/**
 * Generate sauce name from components
 */
const generateSauceName = (base, flavors, extras) => {
  const parts = [];
  
  if (flavors.length > 0) {
    parts.push(flavors.map(f => f.name).join('-'));
  }
  
  parts.push(base.name);

  if (extras.length > 0) {
    parts.push(`mit ${extras.map(e => e.name).join(', ')}`);
  }

  return parts.join(' ');
};

/**
 * Generate share code for recipe
 */
export const generateShareCode = (recipe) => {
  const { protein, carb, vegetables, sauce, toppings, cookingMethod } = recipe.components;
  
  // Create short codes
  const codes = [
    'MCC', // MyCycleCoach prefix
    shortCode(protein),
    shortCode(carb),
    vegetables.map(v => shortCode(v)).join('-'),
    shortCode(sauce),
    shortCode(cookingMethod)
  ].filter(Boolean);

  return codes.join('-').toUpperCase();
};

/**
 * Decode share code to recipe
 */
export const decodeShareCode = (code) => {
  try {
    const parts = code.split('-');
    
    if (parts[0] !== 'MCC') {
      throw new Error('Invalid share code');
    }

    return {
      protein: expandCode(parts[1]),
      carb: expandCode(parts[2]),
      vegetables: parts[3].split('_').map(v => expandCode(v)),
      sauce: expandCode(parts[4]),
      cookingMethod: expandCode(parts[5])
    };
  } catch (error) {
    console.error('Failed to decode share code:', error);
    return null;
  }
};

/**
 * Generate shareable link
 */
export const generateShareLink = (recipe) => {
  const code = generateShareCode(recipe);
  const baseUrl = window.location.origin;
  return `${baseUrl}/recipe/${code}`;
};

/**
 * Save custom recipe to user collection
 */
export const saveCustomRecipe = (recipe, name) => {
  const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');
  
  const savedRecipe = {
    ...recipe,
    customName: name,
    savedAt: new Date().toISOString()
  };

  customRecipes.push(savedRecipe);
  localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
  
  return savedRecipe;
};

/**
 * Get all custom recipes
 */
export const getCustomRecipes = () => {
  return JSON.parse(localStorage.getItem('customRecipes') || '[]');
};

/**
 * Import recipe from share code
 */
export const importRecipe = (shareCode) => {
  const components = decodeShareCode(shareCode);
  
  if (!components) {
    throw new Error('Invalid share code');
  }

  const recipe = buildRecipe({
    ...components,
    phase: 'follicular' // Default phase
  });

  // Ask user to save
  const name = prompt('Name für das importierte Rezept:', recipe.title);
  
  if (name) {
    return saveCustomRecipe(recipe, name);
  }

  return recipe;
};

/**
 * Swap a single component
 */
export const swapComponent = (recipe, componentType, newComponentId) => {
  const updatedComponents = {
    ...recipe.components,
    [componentType]: newComponentId
  };

  return buildRecipe({
    template: recipe.template,
    ...updatedComponents,
    phase: recipe.phase
  });
};

/**
 * Get compatible components for swapping
 */
export const getCompatibleComponents = (recipe, componentType, phase = null) => {
  const currentComponent = recipe.components[componentType];
  
  switch (componentType) {
    case 'protein':
      return getAllProteins(phase);
    case 'carb':
      return getAllCarbs(phase);
    case 'vegetables':
      return getAllVegetables(phase);
    case 'sauce':
      return getAllSauces();
    default:
      return [];
  }
};

// ============ HELPER FUNCTIONS ============

function findComponent(category, id) {
  if (category === 'proteins') {
    const animal = recipeComponents.proteins.animal.find(p => p.id === id);
    const plant = recipeComponents.proteins.plant.find(p => p.id === id);
    return animal || plant;
  }
  
  if (Array.isArray(recipeComponents[category])) {
    return recipeComponents[category].find(c => c.id === id);
  }
  
  return null;
}

function generateId() {
  return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateTitle({ proteins, carbs, vegetables, sauce, method }) {
  const proteinNames = proteins.map(p => translateComponent(p?.id)).filter(Boolean);
  const carbNames = carbs.map(c => translateComponent(c?.id)).filter(Boolean);
  const veggieNames = vegetables.map(v => translateComponent(v?.id)).filter(Boolean);

  const parts = [];
  
  if (method?.name) parts.push(translateCookingMethod(method.name));
  if (proteinNames.length > 0) parts.push(proteinNames.join(' & '));
  if (veggieNames.length > 0) parts.push(`mit ${veggieNames.join(', ')}`);
  if (carbNames.length > 0) parts.push(`und ${carbNames.join(' & ')}`);
  if (sauce?.name) parts.push(`(${sauce.name})`);

  return parts.filter(Boolean).join(' ');
}

function generateSummary({ proteins, phase }) {
  const description = getPhaseDescription(phase);
  
  const nutrients = proteins
    .flatMap(p => p?.nutrients || [])
    .filter((v, i, a) => a.indexOf(v) === i) // unique
    .slice(0, 3);

  return `${description}. ${nutrients.join(', ')}.`;
}

function generateTags({ proteins, carbs, phase }) {
  const tags = [];
  
  // Check if all proteins are vegan
  const allVegan = proteins.every(p => p?.diet?.includes('vegan'));
  const allVegetarian = proteins.every(p => p?.diet?.includes('vegetarian'));
  
  if (allVegan) tags.push('vegan');
  else if (allVegetarian) tags.push('vegetarisch');
  
  if (carbs.some(c => c?.nutrients?.includes('Ballaststoffe'))) tags.push('ballaststoffreich');
  if (proteins.some(p => p?.nutrients?.includes('Protein'))) tags.push('proteinreich');
  
  tags.push(`${phase}-phase`);
  
  return tags;
}

function generateImageUrl({ proteins, carbs, template }) {
  const keywords = [...proteins, ...carbs, template].filter(Boolean).join(',');
  const seed = keywords.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `https://source.unsplash.com/400x300/?${keywords}&sig=${seed}`;
}

function generateIngredientsList({ proteins, carbs, vegetables, sauce, toppings }) {
  const ingredients = [];
  
  proteins.forEach(p => ingredients.push(`200g ${translateComponent(p?.id)}`));
  carbs.forEach(c => ingredients.push(`150g ${translateComponent(c?.id)}`));
  vegetables.forEach(v => ingredients.push(`100g ${translateComponent(v?.id)}`));
  
  if (sauce) {
    ingredients.push(`Für die Sauce: ${sauce.ingredients?.join(', ')}`);
  }
  
  toppings.forEach(t => ingredients.push(`Zum Topping: ${translateComponent(t?.id)}`));
  
  return ingredients;
}

function generateInstructions({ proteins, carbs, vegetables, sauce, toppings, method }) {
  const instructions = [];
  
  // Prep
  instructions.push('Alle Zutaten vorbereiten und waschen.');
  
  // Carbs - mit korrekter Methode
  if (carbs.length > 0) {
    carbs.forEach(carb => {
      const carbName = translateComponent(carb.id);
      if (carb.cookingMethods.includes('boiled')) {
        instructions.push(`${carbName} in Wasser kochen bis sie gar sind.`);
      } else if (carb.cookingMethods.includes('baked')) {
        instructions.push(`${carbName} im Ofen backen bis sie goldbraun sind.`);
      } else if (carb.cookingMethods.includes('steamed')) {
        instructions.push(`${carbName} dämpfen bis sie weich sind.`);
      } else {
        instructions.push(`${carbName} nach Packungsanweisung zubereiten.`);
      }
    });
  }
  
  // Proteins - mit korrekter Methode
  if (proteins.length > 0 && method) {
    const proteinNames = proteins.map(p => translateComponent(p?.id)).join(' und ');
    const avgTime = Math.round(proteins.reduce((sum, p) => sum + (p?.cookingTime || 0), 0) / proteins.length);
    const verb = translateCookingVerb(method.name);
    
    if (method.name !== 'raw') {
      instructions.push(`${proteinNames} ${verb} für ca. ${avgTime} Minuten.`);
    }
  }
  
  // Vegetables - mit korrekter Methode
  if (vegetables.length > 0 && method) {
    const veggieNames = vegetables.map(v => translateComponent(v?.id)).join(', ');
    
    const veggieMethodVerbs = {
      grilled: 'grillen',
      baked: 'im Ofen rösten',
      sauteed: 'in der Pfanne anbraten',
      steamed: 'dämpfen',
      roasted: 'im Ofen rösten',
      boiled: 'blanchieren',
      raw: 'roh verwenden'
    };
    
    const verb = veggieMethodVerbs[method.name] || 'zubereiten';
    
    if (method.name === 'raw') {
      instructions.push(`${veggieNames} waschen und roh servieren.`);
    } else {
      instructions.push(`${veggieNames} ${verb}.`);
    }
  }
  
  // Sauce
  if (sauce) {
    instructions.push(`Sauce anrühren: ${sauce.ingredients?.slice(0, 3).join(', ')} vermischen.`);
  }
  
  // Assembly
  instructions.push('Alle Komponenten auf einem Teller anrichten.');
  
  // Toppings
  if (toppings.length > 0) {
    const toppingNames = toppings.map(t => translateComponent(t?.id)).join(', ');
    instructions.push(`Mit ${toppingNames} garnieren und servieren.`);
  }
  
  return instructions;
}

function shortCode(id) {
  if (!id) return '';
  return id.split('_').map(part => part.substring(0, 3)).join('').toUpperCase();
}

function expandCode(code) {
  // This would need a reverse mapping table
  // For now, simplified version
  return code.toLowerCase();
}

function getAllProteins(phase = null) {
  const all = [
    ...recipeComponents.proteins.animal,
    ...recipeComponents.proteins.plant
  ];
  
  if (!phase) return all;
  return all.filter(p => p.phase.includes(phase) || p.phase.includes('all'));
}

function getAllCarbs(phase = null) {
  if (!phase) return recipeComponents.carbs;
  return recipeComponents.carbs.filter(c => c.phase.includes(phase) || c.phase.includes('all'));
}

function getAllVegetables(phase = null) {
  if (!phase) return recipeComponents.vegetables;
  return recipeComponents.vegetables.filter(v => v.phase.includes(phase) || v.phase.includes('all'));
}

function getAllSauces() {
  return recipeComponents.sauces;
}

export default {
  buildRecipe,
  swapComponent,
  generateShareCode,
  decodeShareCode,
  generateShareLink,
  saveCustomRecipe,
  getCustomRecipes,
  importRecipe,
  getCompatibleComponents
};