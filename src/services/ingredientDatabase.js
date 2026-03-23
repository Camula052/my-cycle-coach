// Comprehensive Ingredient Database for AI Recipe Generation
// Kategorisiert nach Nährstoffen, Phasen und Eigenschaften

export const ingredientDatabase = {
  // PROTEINE
  proteins: {
    animal: [
      { name: 'Hähnchenbrust', phase: 'all', nutrients: ['Protein', 'B-Vitamine'], calories: 165 },
      { name: 'Lachs', phase: 'all', nutrients: ['Protein', 'Omega-3', 'Vitamin D'], calories: 206 },
      { name: 'Thunfisch', phase: 'ovulation', nutrients: ['Protein', 'Omega-3'], calories: 144 },
      { name: 'Eier', phase: 'all', nutrients: ['Protein', 'Cholin', 'B-Vitamine'], calories: 155 },
      { name: 'Truthahn', phase: 'luteal', nutrients: ['Protein', 'Tryptophan'], calories: 189 },
      { name: 'Magerquark', phase: 'all', nutrients: ['Protein', 'Calcium'], calories: 72 },
      { name: 'Griechischer Joghurt', phase: 'luteal', nutrients: ['Protein', 'Calcium', 'Probiotika'], calories: 97 }
    ],
    plant: [
      { name: 'Tofu', phase: 'all', nutrients: ['Protein', 'Eisen', 'Calcium'], calories: 76 },
      { name: 'Tempeh', phase: 'follicular', nutrients: ['Protein', 'Probiotika'], calories: 193 },
      { name: 'Kichererbsen', phase: 'luteal', nutrients: ['Protein', 'Ballaststoffe', 'B6'], calories: 164 },
      { name: 'Linsen (rot)', phase: 'menstruation', nutrients: ['Protein', 'Eisen', 'Folat'], calories: 116 },
      { name: 'Linsen (grün)', phase: 'menstruation', nutrients: ['Protein', 'Eisen'], calories: 116 },
      { name: 'Schwarze Bohnen', phase: 'all', nutrients: ['Protein', 'Ballaststoffe', 'Magnesium'], calories: 132 },
      { name: 'Edamame', phase: 'follicular', nutrients: ['Protein', 'Folat'], calories: 122 },
      { name: 'Quinoa', phase: 'all', nutrients: ['Protein', 'Magnesium', 'Eisen'], calories: 120 }
    ]
  },

  // KOHLENHYDRATE
  carbs: {
    whole_grains: [
      { name: 'Haferflocken', phase: 'luteal', nutrients: ['Ballaststoffe', 'Magnesium', 'B-Vitamine'], calories: 389, type: 'warm' },
      { name: 'Vollkornbrot', phase: 'luteal', nutrients: ['Ballaststoffe', 'B-Vitamine'], calories: 247, type: 'cold' },
      { name: 'Vollkorn-Pasta', phase: 'luteal', nutrients: ['Ballaststoffe', 'Magnesium'], calories: 174, type: 'warm' },
      { name: 'Brauner Reis', phase: 'all', nutrients: ['Ballaststoffe', 'Magnesium'], calories: 111, type: 'warm' },
      { name: 'Quinoa', phase: 'all', nutrients: ['Protein', 'Magnesium'], calories: 120, type: 'warm' },
      { name: 'Buchweizen', phase: 'all', nutrients: ['Magnesium', 'Mangan'], calories: 343, type: 'warm' }
    ],
    starchy: [
      { name: 'Süßkartoffel', phase: 'follicular', nutrients: ['Vitamin A', 'Ballaststoffe'], calories: 86, type: 'warm' },
      { name: 'Kartoffel', phase: 'luteal', nutrients: ['Kalium', 'Vitamin C'], calories: 77, type: 'warm' },
      { name: 'Kürbis', phase: 'menstruation', nutrients: ['Vitamin A', 'Antioxidantien'], calories: 26, type: 'warm' }
    ]
  },

  // GEMÜSE
  vegetables: {
    leafy_greens: [
      { name: 'Spinat', phase: 'menstruation', nutrients: ['Eisen', 'Folat', 'Magnesium'], calories: 23, type: 'both' },
      { name: 'Grünkohl', phase: 'menstruation', nutrients: ['Eisen', 'Vitamin K', 'Calcium'], calories: 35, type: 'both' },
      { name: 'Rucola', phase: 'ovulation', nutrients: ['Vitamin K', 'Folat'], calories: 25, type: 'cold' },
      { name: 'Mangold', phase: 'menstruation', nutrients: ['Eisen', 'Magnesium'], calories: 19, type: 'both' }
    ],
    cruciferous: [
      { name: 'Brokkoli', phase: 'ovulation', nutrients: ['Vitamin C', 'Ballaststoffe', 'Calcium'], calories: 34, type: 'warm' },
      { name: 'Blumenkohl', phase: 'ovulation', nutrients: ['Vitamin C', 'Ballaststoffe'], calories: 25, type: 'both' },
      { name: 'Rosenkohl', phase: 'ovulation', nutrients: ['Vitamin K', 'Folat'], calories: 43, type: 'warm' }
    ],
    colorful: [
      { name: 'Paprika (rot)', phase: 'ovulation', nutrients: ['Vitamin C', 'Antioxidantien'], calories: 31, type: 'both' },
      { name: 'Paprika (gelb)', phase: 'ovulation', nutrients: ['Vitamin C'], calories: 27, type: 'both' },
      { name: 'Tomaten', phase: 'all', nutrients: ['Vitamin C', 'Lycopin'], calories: 18, type: 'both' },
      { name: 'Karotten', phase: 'follicular', nutrients: ['Vitamin A', 'Beta-Carotin'], calories: 41, type: 'both' },
      { name: 'Rote Beete', phase: 'menstruation', nutrients: ['Eisen', 'Folat', 'Nitrate'], calories: 43, type: 'both' },
      { name: 'Zucchini', phase: 'all', nutrients: ['Vitamin C', 'Kalium'], calories: 17, type: 'both' },
      { name: 'Aubergine', phase: 'all', nutrients: ['Ballaststoffe', 'Antioxidantien'], calories: 25, type: 'warm' }
    ],
    other: [
      { name: 'Gurke', phase: 'all', nutrients: ['Hydration'], calories: 16, type: 'cold' },
      { name: 'Spargel', phase: 'ovulation', nutrients: ['Folat', 'Vitamin K'], calories: 20, type: 'warm' },
      { name: 'Pilze', phase: 'all', nutrients: ['Vitamin D', 'B-Vitamine'], calories: 22, type: 'warm' }
    ]
  },

  // FRÜCHTE
  fruits: {
    berries: [
      { name: 'Heidelbeeren', phase: 'ovulation', nutrients: ['Antioxidantien', 'Vitamin C'], calories: 57, type: 'cold' },
      { name: 'Erdbeeren', phase: 'ovulation', nutrients: ['Vitamin C', 'Folat'], calories: 32, type: 'cold' },
      { name: 'Himbeeren', phase: 'ovulation', nutrients: ['Ballaststoffe', 'Vitamin C'], calories: 52, type: 'cold' },
      { name: 'Brombeeren', phase: 'ovulation', nutrients: ['Vitamin C', 'Vitamin K'], calories: 43, type: 'cold' }
    ],
    citrus: [
      { name: 'Orange', phase: 'follicular', nutrients: ['Vitamin C'], calories: 47, type: 'cold' },
      { name: 'Grapefruit', phase: 'follicular', nutrients: ['Vitamin C'], calories: 42, type: 'cold' },
      { name: 'Zitrone', phase: 'all', nutrients: ['Vitamin C'], calories: 29, type: 'cold' }
    ],
    other: [
      { name: 'Banane', phase: 'luteal', nutrients: ['Kalium', 'Vitamin B6'], calories: 89, type: 'cold' },
      { name: 'Apfel', phase: 'all', nutrients: ['Ballaststoffe', 'Vitamin C'], calories: 52, type: 'cold' },
      { name: 'Birne', phase: 'all', nutrients: ['Ballaststoffe'], calories: 57, type: 'cold' },
      { name: 'Avocado', phase: 'ovulation', nutrients: ['Gesunde Fette', 'Kalium'], calories: 160, type: 'cold' },
      { name: 'Mango', phase: 'follicular', nutrients: ['Vitamin A', 'Vitamin C'], calories: 60, type: 'cold' },
      { name: 'Granatapfel', phase: 'ovulation', nutrients: ['Antioxidantien'], calories: 83, type: 'cold' }
    ]
  },

  // GESUNDE FETTE
  fats: {
    nuts: [
      { name: 'Mandeln', phase: 'luteal', nutrients: ['Vitamin E', 'Magnesium'], calories: 579 },
      { name: 'Walnüsse', phase: 'ovulation', nutrients: ['Omega-3', 'Antioxidantien'], calories: 654 },
      { name: 'Cashews', phase: 'luteal', nutrients: ['Magnesium', 'Zink'], calories: 553 },
      { name: 'Paranüsse', phase: 'all', nutrients: ['Selen'], calories: 656 }
    ],
    seeds: [
      { name: 'Chiasamen', phase: 'ovulation', nutrients: ['Omega-3', 'Ballaststoffe'], calories: 486 },
      { name: 'Leinsamen', phase: 'ovulation', nutrients: ['Omega-3', 'Lignane'], calories: 534 },
      { name: 'Kürbiskerne', phase: 'luteal', nutrients: ['Magnesium', 'Zink'], calories: 559 },
      { name: 'Sesam', phase: 'luteal', nutrients: ['Calcium', 'Magnesium'], calories: 573 },
      { name: 'Sonnenblumenkerne', phase: 'all', nutrients: ['Vitamin E'], calories: 584 }
    ],
    oils: [
      { name: 'Olivenöl', phase: 'all', nutrients: ['Gesunde Fette', 'Vitamin E'], calories: 884 },
      { name: 'Kokosöl', phase: 'all', nutrients: ['MCT'], calories: 862 },
      { name: 'Avocadoöl', phase: 'all', nutrients: ['Gesunde Fette'], calories: 884 }
    ]
  },

  // MILCHPRODUKTE & ALTERNATIVEN
  dairy: {
    regular: [
      { name: 'Griechischer Joghurt', phase: 'luteal', nutrients: ['Protein', 'Calcium', 'Probiotika'], calories: 97 },
      { name: 'Hüttenkäse', phase: 'all', nutrients: ['Protein', 'Calcium'], calories: 98 },
      { name: 'Feta', phase: 'all', nutrients: ['Calcium', 'Protein'], calories: 264 },
      { name: 'Mozzarella', phase: 'all', nutrients: ['Calcium', 'Protein'], calories: 280 },
      { name: 'Parmesan', phase: 'all', nutrients: ['Calcium', 'Protein'], calories: 431 }
    ],
    alternatives: [
      { name: 'Mandelmilch', phase: 'all', nutrients: ['Vitamin E'], calories: 17 },
      { name: 'Hafermilch', phase: 'all', nutrients: ['Ballaststoffe'], calories: 47 },
      { name: 'Kokosmilch', phase: 'all', nutrients: ['MCT'], calories: 230 },
      { name: 'Sojajoghurt', phase: 'all', nutrients: ['Protein'], calories: 94 }
    ]
  },

  // GEWÜRZE & KRÄUTER
  seasonings: {
    warming: [
      { name: 'Ingwer', phase: 'menstruation', nutrients: ['Entzündungshemmend'] },
      { name: 'Zimt', phase: 'menstruation', nutrients: ['Blutzuckerregulierung'] },
      { name: 'Kurkuma', phase: 'menstruation', nutrients: ['Entzündungshemmend', 'Antioxidantien'] },
      { name: 'Cayennepfeffer', phase: 'menstruation', nutrients: ['Durchblutungsfördernd'] },
      { name: 'Kreuzkümmel', phase: 'all', nutrients: ['Eisen'] }
    ],
    fresh_herbs: [
      { name: 'Basilikum', phase: 'all', nutrients: ['Antioxidantien'] },
      { name: 'Petersilie', phase: 'all', nutrients: ['Vitamin K', 'Vitamin C'] },
      { name: 'Koriander', phase: 'all', nutrients: ['Antioxidantien'] },
      { name: 'Dill', phase: 'all', nutrients: ['Calcium'] },
      { name: 'Minze', phase: 'all', nutrients: ['Verdauungsfördernd'] },
      { name: 'Thymian', phase: 'all', nutrients: ['Antioxidantien'] },
      { name: 'Rosmarin', phase: 'all', nutrients: ['Antioxidantien'] }
    ],
    other: [
      { name: 'Knoblauch', phase: 'all', nutrients: ['Immunsystem'] },
      { name: 'Zwiebel', phase: 'all', nutrients: ['Antioxidantien'] },
      { name: 'Zitronensaft', phase: 'all', nutrients: ['Vitamin C'] },
      { name: 'Balsamico', phase: 'all', nutrients: ['Antioxidantien'] }
    ]
  },

  // SÜSSSTOFFE & EXTRAS
  sweeteners: [
    { name: 'Honig', phase: 'all', nutrients: ['Antioxidantien'], calories: 304 },
    { name: 'Ahornsirup', phase: 'all', nutrients: ['Mangan'], calories: 260 },
    { name: 'Datteln', phase: 'menstruation', nutrients: ['Eisen', 'Magnesium'], calories: 277 },
    { name: 'Kokosblütenzucker', phase: 'all', nutrients: ['Niedriger GI'], calories: 375 }
  ],

  // SUPERFOODS
  superfoods: [
    { name: 'Spirulina', phase: 'menstruation', nutrients: ['Eisen', 'Protein'], calories: 290 },
    { name: 'Matcha', phase: 'follicular', nutrients: ['Antioxidantien', 'L-Theanin'], calories: 324 },
    { name: 'Kakaopulver', phase: 'menstruation', nutrients: ['Magnesium', 'Antioxidantien'], calories: 228 },
    { name: 'Gojibeeren', phase: 'ovulation', nutrients: ['Antioxidantien', 'Vitamin C'], calories: 349 },
    { name: 'Acai', phase: 'ovulation', nutrients: ['Antioxidantien'], calories: 70 }
  ]
};

// MAHLZEITEN-PRÄFERENZEN
export const mealPreferences = {
  breakfast: {
    temperature: ['warm', 'cold', 'both'],
    texture: ['flüssig', 'cremig', 'fest', 'knusprig'],
    style: ['süß', 'herzhaft', 'beides'],
    time: ['schnell (<10min)', 'mittel (10-20min)', 'aufwendig (20+min)']
  },
  lunch: {
    style: ['leicht', 'sättigend', 'to-go', 'bowl'],
    temperature: ['warm', 'kalt', 'both']
  },
  dinner: {
    style: ['comfort food', 'leicht', 'protein-reich', 'one-pot'],
    temperature: ['warm', 'kalt']
  },
  snack: {
    style: ['süß', 'herzhaft', 'energieboost', 'sättigend']
  }
};

// PHASEN-SPEZIFISCHE INGREDIENT POOLS
export const getPhaseIngredients = (phase) => {
  const allIngredients = {
    menstruation: {
      focus: ['Eisen', 'Omega-3', 'Magnesium', 'Wärmend'],
      recommended: [
        // Proteins
        ...ingredientDatabase.proteins.animal.filter(i => ['Lachs', 'Eier'].includes(i.name)),
        ...ingredientDatabase.proteins.plant.filter(i => ['Linsen (rot)', 'Linsen (grün)'].includes(i.name)),
        // Veggies
        ...ingredientDatabase.vegetables.leafy_greens,
        ...ingredientDatabase.vegetables.colorful.filter(i => i.name === 'Rote Beete'),
        // Others
        { name: 'Dunkle Schokolade', nutrients: ['Magnesium', 'Eisen'], calories: 546 }
      ]
    },
    follicular: {
      focus: ['Protein', 'Fermentiert', 'Energiereich'],
      recommended: [
        ...ingredientDatabase.proteins.animal,
        ...ingredientDatabase.proteins.plant.filter(i => ['Tempeh', 'Edamame'].includes(i.name)),
        ...ingredientDatabase.vegetables.colorful,
        ...ingredientDatabase.fruits.citrus
      ]
    },
    ovulation: {
      focus: ['Ballaststoffe', 'Antioxidantien', 'Omega-3'],
      recommended: [
        ...ingredientDatabase.proteins.animal.filter(i => ['Lachs', 'Thunfisch'].includes(i.name)),
        ...ingredientDatabase.vegetables.cruciferous,
        ...ingredientDatabase.fruits.berries,
        ...ingredientDatabase.fats.seeds.filter(i => ['Chiasamen', 'Leinsamen'].includes(i.name))
      ]
    },
    luteal: {
      focus: ['Komplexe Kohlenhydrate', 'B-Vitamine', 'Magnesium'],
      recommended: [
        ...ingredientDatabase.carbs.whole_grains,
        ...ingredientDatabase.proteins.plant.filter(i => i.name === 'Kichererbsen'),
        ...ingredientDatabase.fruits.other.filter(i => i.name === 'Banane'),
        ...ingredientDatabase.fats.nuts
      ]
    }
  };

  return allIngredients[phase] || allIngredients.follicular;
};

export default ingredientDatabase;
