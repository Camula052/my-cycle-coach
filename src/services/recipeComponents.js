// Modular Component-Based Recipe System
// Allows infinite recipe combinations through component swapping

export const recipeComponents = {
  // PROTEINE (~100 Optionen)
  proteins: {
    animal: [
      {
        id: 'chicken_breast',
        name: 'Hähnchenbrust',
        nameEn: 'Chicken Breast',
        phase: ['all'],
        cookingMethods: ['grilled', 'baked', 'sauteed', 'poached'],
        cookingTime: 20,
        calories: 165,
        protein: 31,
        carbs: 0,
        fats: 3.6,
        nutrients: ['Protein', 'B-Vitamine', 'Selen'],
        diet: ['omnivore'],
        texture: 'firm',
        flavor: 'mild'
      },
      {
        id: 'salmon',
        name: 'Lachs',
        nameEn: 'Salmon',
        phase: ['menstruation', 'ovulation'],
        cookingMethods: ['grilled', 'baked', 'pan_seared', 'poached'],
        cookingTime: 15,
        calories: 206,
        protein: 22,
        carbs: 0,
        fats: 13,
        nutrients: ['Protein', 'Omega-3', 'Vitamin D'],
        diet: ['pescetarian', 'omnivore'],
        texture: 'flaky',
        flavor: 'rich'
      },
      {
        id: 'turkey',
        name: 'Pute',
        nameEn: 'Turkey',
        phase: ['luteal'],
        cookingMethods: ['grilled', 'baked', 'sauteed'],
        cookingTime: 25,
        calories: 189,
        protein: 29,
        carbs: 0,
        fats: 7,
        nutrients: ['Protein', 'Tryptophan', 'B-Vitamine'],
        diet: ['omnivore'],
        texture: 'firm',
        flavor: 'mild'
      },
      {
        id: 'eggs',
        name: 'Eier',
        nameEn: 'Eggs',
        phase: ['all'],
        cookingMethods: ['boiled', 'fried', 'scrambled', 'poached'],
        cookingTime: 10,
        calories: 155,
        protein: 13,
        carbs: 1,
        fats: 11,
        nutrients: ['Protein', 'Cholin', 'B-Vitamine'],
        diet: ['vegetarian', 'omnivore'],
        texture: 'soft',
        flavor: 'rich'
      },
      {
        id: 'shrimp',
        name: 'Garnelen',
        nameEn: 'Shrimp',
        phase: ['ovulation', 'follicular'],
        cookingMethods: ['grilled', 'sauteed', 'boiled'],
        cookingTime: 8,
        calories: 99,
        protein: 24,
        carbs: 0,
        fats: 0.3,
        nutrients: ['Protein', 'Selen', 'Vitamin B12'],
        diet: ['pescetarian', 'omnivore'],
        texture: 'tender',
        flavor: 'mild'
      }
    ],
    plant: [
      {
        id: 'tofu',
        name: 'Tofu',
        nameEn: 'Tofu',
        phase: ['all'],
        cookingMethods: ['grilled', 'baked', 'sauteed', 'fried'],
        cookingTime: 15,
        calories: 76,
        protein: 8,
        carbs: 2,
        fats: 4.8,
        nutrients: ['Protein', 'Eisen', 'Calcium'],
        diet: ['vegan', 'vegetarian', 'omnivore'],
        texture: 'firm',
        flavor: 'neutral'
      },
      {
        id: 'tempeh',
        name: 'Tempeh',
        nameEn: 'Tempeh',
        phase: ['follicular'],
        cookingMethods: ['grilled', 'sauteed', 'steamed'],
        cookingTime: 12,
        calories: 193,
        protein: 19,
        carbs: 9,
        fats: 11,
        nutrients: ['Protein', 'Probiotika', 'Magnesium'],
        diet: ['vegan', 'vegetarian', 'omnivore'],
        texture: 'firm',
        flavor: 'nutty'
      },
      {
        id: 'chickpeas',
        name: 'Kichererbsen',
        nameEn: 'Chickpeas',
        phase: ['luteal'],
        cookingMethods: ['roasted', 'boiled', 'mashed'],
        cookingTime: 20,
        calories: 164,
        protein: 9,
        carbs: 27,
        fats: 2.6,
        nutrients: ['Protein', 'Ballaststoffe', 'B6'],
        diet: ['vegan', 'vegetarian', 'omnivore'],
        texture: 'creamy',
        flavor: 'nutty'
      },
      {
        id: 'lentils',
        name: 'Linsen',
        nameEn: 'Lentils',
        phase: ['menstruation'],
        cookingMethods: ['boiled', 'simmered'],
        cookingTime: 25,
        calories: 116,
        protein: 9,
        carbs: 20,
        fats: 0.4,
        nutrients: ['Protein', 'Eisen', 'Folat'],
        diet: ['vegan', 'vegetarian', 'omnivore'],
        texture: 'soft',
        flavor: 'earthy'
      },
      {
        id: 'black_beans',
        name: 'Schwarze Bohnen',
        nameEn: 'Black Beans',
        phase: ['all'],
        cookingMethods: ['boiled', 'mashed'],
        cookingTime: 30,
        calories: 132,
        protein: 9,
        carbs: 24,
        fats: 0.5,
        nutrients: ['Protein', 'Ballaststoffe', 'Magnesium'],
        diet: ['vegan', 'vegetarian', 'omnivore'],
        texture: 'creamy',
        flavor: 'earthy'
      }
    ]
  },

  // KOHLENHYDRATE (~60 Optionen)
  carbs: [
    {
      id: 'brown_rice',
      name: 'Brauner Reis',
      nameEn: 'Brown Rice',
      phase: ['all'],
      cookingMethods: ['boiled', 'steamed'],
      cookingTime: 40,
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fats: 0.9,
      nutrients: ['Ballaststoffe', 'Magnesium', 'B-Vitamine'],
      diet: ['all'],
      texture: 'fluffy',
      flavor: 'nutty'
    },
    {
      id: 'quinoa',
      name: 'Quinoa',
      nameEn: 'Quinoa',
      phase: ['all'],
      cookingMethods: ['boiled'],
      cookingTime: 15,
      calories: 120,
      protein: 4.4,
      carbs: 21,
      fats: 1.9,
      nutrients: ['Protein', 'Magnesium', 'Eisen'],
      diet: ['all'],
      texture: 'fluffy',
      flavor: 'mild'
    },
    {
      id: 'sweet_potato',
      name: 'Süßkartoffel',
      nameEn: 'Sweet Potato',
      phase: ['follicular', 'luteal'],
      cookingMethods: ['baked', 'roasted', 'mashed'],
      cookingTime: 45,
      calories: 86,
      protein: 1.6,
      carbs: 20,
      fats: 0.1,
      nutrients: ['Vitamin A', 'Ballaststoffe', 'Kalium'],
      diet: ['all'],
      texture: 'creamy',
      flavor: 'sweet'
    },
    {
      id: 'whole_wheat_pasta',
      name: 'Vollkorn-Pasta',
      nameEn: 'Whole Wheat Pasta',
      phase: ['luteal'],
      cookingMethods: ['boiled'],
      cookingTime: 12,
      calories: 174,
      protein: 7.5,
      carbs: 37,
      fats: 0.8,
      nutrients: ['Ballaststoffe', 'B-Vitamine', 'Magnesium'],
      diet: ['all'],
      texture: 'al_dente',
      flavor: 'mild'
    },
    {
      id: 'oats',
      name: 'Haferflocken',
      nameEn: 'Oats',
      phase: ['luteal'],
      cookingMethods: ['boiled', 'soaked'],
      cookingTime: 5,
      calories: 389,
      protein: 17,
      carbs: 66,
      fats: 7,
      nutrients: ['Ballaststoffe', 'Magnesium', 'B-Vitamine'],
      diet: ['all'],
      texture: 'creamy',
      flavor: 'mild',
      mealTypes: ['breakfast']
    },
    {
      id: 'bread',
      name: 'Vollkornbrot',
      nameEn: 'Whole Grain Bread',
      phase: ['all'],
      cookingMethods: ['toasted', 'raw'],
      cookingTime: 2,
      calories: 247,
      protein: 13,
      carbs: 41,
      fats: 3.4,
      nutrients: ['Ballaststoffe', 'B-Vitamine'],
      diet: ['all'],
      texture: 'chewy',
      flavor: 'nutty',
      mealTypes: ['breakfast']
    },
    {
      id: 'granola',
      name: 'Granola',
      nameEn: 'Granola',
      phase: ['all'],
      cookingMethods: ['raw'],
      cookingTime: 0,
      calories: 471,
      protein: 14,
      carbs: 64,
      fats: 20,
      nutrients: ['Ballaststoffe', 'Eisen'],
      diet: ['all'],
      texture: 'crunchy',
      flavor: 'sweet',
      mealTypes: ['breakfast']
    },
    {
      id: 'banana',
      name: 'Banane',
      nameEn: 'Banana',
      phase: ['all'],
      cookingMethods: ['raw'],
      cookingTime: 0,
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fats: 0.3,
      nutrients: ['Kalium', 'Vitamin B6'],
      diet: ['all'],
      texture: 'soft',
      flavor: 'sweet',
      mealTypes: ['breakfast', 'snack']
    },
    {
      id: 'berries',
      name: 'Beeren-Mix',
      nameEn: 'Mixed Berries',
      phase: ['all'],
      cookingMethods: ['raw'],
      cookingTime: 0,
      calories: 57,
      protein: 1,
      carbs: 14,
      fats: 0.3,
      nutrients: ['Antioxidantien', 'Vitamin C'],
      diet: ['all'],
      texture: 'juicy',
      flavor: 'sweet',
      mealTypes: ['breakfast', 'snack']
    }
  ],

  // GEMÜSE (~80 Optionen)
  vegetables: [
    {
      id: 'broccoli',
      name: 'Brokkoli',
      nameEn: 'Broccoli',
      phase: ['ovulation', 'all'],
      cookingMethods: ['steamed', 'roasted', 'sauteed'],
      cookingTime: 8,
      calories: 34,
      protein: 2.8,
      carbs: 7,
      fats: 0.4,
      nutrients: ['Vitamin C', 'Ballaststoffe', 'Calcium'],
      diet: ['all'],
      texture: 'crisp_tender',
      flavor: 'mild'
    },
    {
      id: 'spinach',
      name: 'Spinat',
      nameEn: 'Spinach',
      phase: ['menstruation'],
      cookingMethods: ['sauteed', 'steamed', 'raw'],
      cookingTime: 3,
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fats: 0.4,
      nutrients: ['Eisen', 'Folat', 'Magnesium'],
      diet: ['all'],
      texture: 'tender',
      flavor: 'mild'
    },
    {
      id: 'bell_pepper',
      name: 'Paprika',
      nameEn: 'Bell Pepper',
      phase: ['ovulation'],
      cookingMethods: ['roasted', 'grilled', 'sauteed', 'raw'],
      cookingTime: 10,
      calories: 31,
      protein: 1,
      carbs: 6,
      fats: 0.3,
      nutrients: ['Vitamin C', 'Antioxidantien'],
      diet: ['all'],
      texture: 'crisp',
      flavor: 'sweet'
    },
    {
      id: 'asparagus',
      name: 'Spargel',
      nameEn: 'Asparagus',
      phase: ['ovulation'],
      cookingMethods: ['roasted', 'grilled', 'steamed'],
      cookingTime: 12,
      calories: 20,
      protein: 2.2,
      carbs: 3.9,
      fats: 0.2,
      nutrients: ['Folat', 'Vitamin K'],
      diet: ['all'],
      texture: 'tender',
      flavor: 'mild'
    },
    {
      id: 'kale',
      name: 'Grünkohl',
      nameEn: 'Kale',
      phase: ['menstruation'],
      cookingMethods: ['sauteed', 'massaged_raw', 'baked'],
      cookingTime: 5,
      calories: 35,
      protein: 2.9,
      carbs: 4.4,
      fats: 1.5,
      nutrients: ['Eisen', 'Vitamin K', 'Calcium'],
      diet: ['all'],
      texture: 'hearty',
      flavor: 'earthy'
    },
    {
      id: 'zucchini',
      name: 'Zucchini',
      nameEn: 'Zucchini',
      phase: ['all'],
      cookingMethods: ['grilled', 'sauteed', 'spiralized'],
      cookingTime: 8,
      calories: 17,
      protein: 1.2,
      carbs: 3.1,
      fats: 0.3,
      nutrients: ['Vitamin C', 'Kalium'],
      diet: ['all'],
      texture: 'tender',
      flavor: 'mild'
    }
  ],

  // SAUCEN & DRESSINGS (~40 Optionen)
  // Jetzt als Baustein-System!
  sauces: {
    // BASEN
    bases: [
      {
        id: 'yogurt_base',
        name: 'Joghurt-Basis',
        nameEn: 'Yogurt Base',
        calories: 59,
        texture: 'creamy',
        flavor: 'tangy',
        ingredients: ['Griechischer Joghurt']
      },
      {
        id: 'oil_vinegar_base',
        name: 'Öl-Essig-Basis',
        nameEn: 'Oil Vinegar Base',
        calories: 120,
        texture: 'liquid',
        flavor: 'tangy',
        ingredients: ['Olivenöl', 'Essig']
      },
      {
        id: 'tahini_base',
        name: 'Tahini-Basis',
        nameEn: 'Tahini Base',
        calories: 178,
        texture: 'creamy',
        flavor: 'nutty',
        ingredients: ['Tahini', 'Wasser']
      },
      {
        id: 'soy_base',
        name: 'Soja-Basis',
        nameEn: 'Soy Base',
        calories: 53,
        texture: 'liquid',
        flavor: 'umami',
        ingredients: ['Sojasauce']
      },
      {
        id: 'tomato_base',
        name: 'Tomaten-Basis',
        nameEn: 'Tomato Base',
        calories: 32,
        texture: 'chunky',
        flavor: 'savory',
        ingredients: ['Tomaten', 'Knoblauch']
      },
      {
        id: 'coconut_base',
        name: 'Kokosmilch-Basis',
        nameEn: 'Coconut Base',
        calories: 230,
        texture: 'creamy',
        flavor: 'mild',
        ingredients: ['Kokosmilch']
      },
      {
        id: 'butter_base',
        name: 'Butter-Basis',
        nameEn: 'Butter Base',
        calories: 102,
        texture: 'rich',
        flavor: 'rich',
        ingredients: ['Butter']
      },
      {
        id: 'nut_butter_base',
        name: 'Nussbutter-Basis',
        nameEn: 'Nut Butter Base',
        calories: 188,
        texture: 'thick',
        flavor: 'nutty',
        ingredients: ['Erdnussbutter oder Mandelbutter']
      }
    ],
    
    // GEWÜRZE & AROMEN
    flavors: [
      {
        id: 'garlic',
        name: 'Knoblauch',
        nameEn: 'Garlic',
        calories: 4,
        pairsWith: ['all']
      },
      {
        id: 'ginger',
        name: 'Ingwer',
        nameEn: 'Ginger',
        calories: 2,
        pairsWith: ['soy_base', 'coconut_base', 'nut_butter_base']
      },
      {
        id: 'lemon',
        name: 'Zitrone',
        nameEn: 'Lemon',
        calories: 3,
        pairsWith: ['butter_base', 'tahini_base', 'yogurt_base', 'oil_vinegar_base']
      },
      {
        id: 'lime',
        name: 'Limette',
        nameEn: 'Lime',
        calories: 3,
        pairsWith: ['coconut_base', 'tahini_base', 'yogurt_base']
      },
      {
        id: 'honey',
        name: 'Honig',
        nameEn: 'Honey',
        calories: 64,
        pairsWith: ['soy_base', 'yogurt_base', 'oil_vinegar_base']
      },
      {
        id: 'maple_syrup',
        name: 'Ahornsirup',
        nameEn: 'Maple Syrup',
        calories: 52,
        pairsWith: ['soy_base', 'nut_butter_base']
      },
      {
        id: 'chili',
        name: 'Chili',
        nameEn: 'Chili',
        calories: 1,
        pairsWith: ['all']
      },
      {
        id: 'cumin',
        name: 'Kreuzkümmel',
        nameEn: 'Cumin',
        calories: 8,
        pairsWith: ['yogurt_base', 'tahini_base', 'tomato_base']
      },
      {
        id: 'curry',
        name: 'Curry',
        nameEn: 'Curry',
        calories: 6,
        pairsWith: ['coconut_base', 'yogurt_base', 'tomato_base']
      },
      {
        id: 'basil',
        name: 'Basilikum',
        nameEn: 'Basil',
        calories: 1,
        pairsWith: ['tomato_base', 'oil_vinegar_base']
      },
      {
        id: 'cilantro',
        name: 'Koriander',
        nameEn: 'Cilantro',
        calories: 1,
        pairsWith: ['lime', 'coconut_base', 'yogurt_base']
      },
      {
        id: 'dill',
        name: 'Dill',
        nameEn: 'Dill',
        calories: 1,
        pairsWith: ['yogurt_base', 'lemon']
      },
      {
        id: 'sesame',
        name: 'Sesam',
        nameEn: 'Sesame',
        calories: 52,
        pairsWith: ['soy_base', 'tahini_base']
      }
    ],

    // EXTRAS & TEXTUREN
    extras: [
      {
        id: 'pine_nuts',
        name: 'Pinienkerne',
        nameEn: 'Pine Nuts',
        calories: 191,
        texture: 'crunchy'
      },
      {
        id: 'parmesan',
        name: 'Parmesan',
        nameEn: 'Parmesan',
        calories: 122,
        texture: 'salty'
      },
      {
        id: 'mustard',
        name: 'Senf',
        nameEn: 'Mustard',
        calories: 15,
        texture: 'tangy'
      },
      {
        id: 'capers',
        name: 'Kapern',
        nameEn: 'Capers',
        calories: 2,
        texture: 'briny'
      },
      {
        id: 'olives',
        name: 'Oliven',
        nameEn: 'Olives',
        calories: 115,
        texture: 'briny'
      },
      {
        id: 'sun_dried_tomatoes',
        name: 'Getrocknete Tomaten',
        nameEn: 'Sun-Dried Tomatoes',
        calories: 59,
        texture: 'chewy'
      }
    ],

    // FERTIGE SOSSE-REZEPTE (Vorschläge)
    presets: [
      {
        id: 'classic_pesto',
        name: 'Klassisches Pesto',
        nameEn: 'Classic Pesto',
        components: {
          base: 'oil_vinegar_base',
          flavors: ['basil', 'garlic'],
          extras: ['pine_nuts', 'parmesan']
        },
        calories: 263,
        prepTime: 5
      },
      {
        id: 'teriyaki',
        name: 'Teriyaki',
        nameEn: 'Teriyaki',
        components: {
          base: 'soy_base',
          flavors: ['ginger', 'garlic', 'honey'],
          extras: ['sesame']
        },
        calories: 89,
        prepTime: 10
      },
      {
        id: 'lemon_butter',
        name: 'Zitronenbutter',
        nameEn: 'Lemon Butter',
        components: {
          base: 'butter_base',
          flavors: ['lemon', 'garlic'],
          extras: []
        },
        calories: 102,
        prepTime: 5
      },
      {
        id: 'tahini_dressing',
        name: 'Tahini-Dressing',
        nameEn: 'Tahini Dressing',
        components: {
          base: 'tahini_base',
          flavors: ['lemon', 'garlic'],
          extras: []
        },
        calories: 178,
        prepTime: 5
      },
      {
        id: 'curry_coconut',
        name: 'Curry-Kokos',
        nameEn: 'Curry Coconut',
        components: {
          base: 'coconut_base',
          flavors: ['curry', 'ginger', 'garlic'],
          extras: []
        },
        calories: 245,
        prepTime: 15
      },
      {
        id: 'tzatziki',
        name: 'Tzatziki',
        nameEn: 'Tzatziki',
        components: {
          base: 'yogurt_base',
          flavors: ['garlic', 'dill', 'lemon'],
          extras: []
        },
        calories: 65,
        prepTime: 10
      },
      {
        id: 'peanut_sauce',
        name: 'Erdnuss-Sauce',
        nameEn: 'Peanut Sauce',
        components: {
          base: 'nut_butter_base',
          flavors: ['ginger', 'garlic', 'lime'],
          extras: ['chili']
        },
        calories: 200,
        prepTime: 8
      }
    ]
  },

  // KOCHMETHODEN
  cookingMethods: {
    grilled: { name: 'Gegrillt', nameEn: 'Grilled', timeMultiplier: 1.0, healthScore: 9 },
    baked: { name: 'Gebacken', nameEn: 'Baked', timeMultiplier: 1.5, healthScore: 8 },
    sauteed: { name: 'Angebraten', nameEn: 'Sautéed', timeMultiplier: 0.8, healthScore: 7 },
    steamed: { name: 'Gedämpft', nameEn: 'Steamed', timeMultiplier: 0.9, healthScore: 10 },
    roasted: { name: 'Geröstet', nameEn: 'Roasted', timeMultiplier: 1.3, healthScore: 8 },
    boiled: { name: 'Gekocht', nameEn: 'Boiled', timeMultiplier: 1.0, healthScore: 7 },
    raw: { name: 'Roh', nameEn: 'Raw', timeMultiplier: 0, healthScore: 10 }
  },

  // TOPPINGS & EXTRAS (~30 Optionen)
  toppings: [
    {
      id: 'sesame_seeds',
      name: 'Sesam',
      nameEn: 'Sesame Seeds',
      calories: 52,
      nutrients: ['Calcium', 'Magnesium'],
      texture: 'crunchy'
    },
    {
      id: 'fresh_herbs',
      name: 'Frische Kräuter',
      nameEn: 'Fresh Herbs',
      calories: 1,
      nutrients: ['Antioxidantien'],
      texture: 'fresh'
    },
    {
      id: 'nuts',
      name: 'Nüsse',
      nameEn: 'Nuts',
      calories: 160,
      nutrients: ['Gesunde Fette', 'Vitamin E'],
      texture: 'crunchy'
    },
    {
      id: 'lemon_wedge',
      name: 'Zitronenspalte',
      nameEn: 'Lemon Wedge',
      calories: 3,
      nutrients: ['Vitamin C'],
      texture: 'juicy'
    }
  ]
};

// REZEPT TEMPLATES (Basis-Strukturen)
export const recipeTemplates = {
  bowl: {
    name: 'Bowl',
    structure: ['protein', 'carb', 'vegetables', 'sauce', 'toppings'],
    presentation: 'bowl'
  },
  plate: {
    name: 'Teller',
    structure: ['protein', 'carb', 'vegetables', 'sauce'],
    presentation: 'plated'
  },
  salad: {
    name: 'Salat',
    structure: ['protein', 'vegetables', 'sauce', 'toppings'],
    presentation: 'bowl'
  },
  wrap: {
    name: 'Wrap',
    structure: ['protein', 'vegetables', 'sauce'],
    base: 'tortilla',
    presentation: 'wrapped'
  },
  smoothie: {
    name: 'Smoothie',
    structure: ['fruits', 'liquid', 'protein', 'extras'],
    presentation: 'glass'
  }
};

export default recipeComponents;