// Smoothie Recipe Templates
// Specific smoothies - NO "fruits of choice"!

export const smoothieTemplates = [
  // CLASSIC SMOOTHIES
  {
    id: 'banana_peanut_butter',
    name: 'Bananen-Erdnussbutter Smoothie',
    base: 'banana',
    liquid: 'Hafermilch',
    protein: 'Erdnussbutter',
    extras: ['Haferflocken', 'Zimt', 'Honig'],
    prepTime: 5,
    servings: 1,
    instructions: [
      '1 große Banane (am besten gefroren für cremige Konsistenz).',
      '200ml Hafermilch in den Mixer geben.',
      '2 EL Erdnussbutter hinzufügen.',
      '2 EL Haferflocken für Sättigung.',
      '1 Prise Zimt und optional 1 TL Honig.',
      'Bis zur cremigen Konsistenz mixen.',
      'Optional: Mit Eiswürfeln für extra Kälte.'
    ]
  },
  {
    id: 'strawberry_coconut',
    name: 'Erdbeer-Kokos Smoothie',
    base: 'strawberries',
    liquid: 'Kokosmilch',
    extras: ['Kokosflocken', 'Vanille', 'Banane'],
    prepTime: 5,
    servings: 1,
    instructions: [
      '150g Erdbeeren (frisch oder gefroren).',
      '150ml Kokosmilch in den Mixer.',
      '½ Banane für Cremigkeit.',
      '1 EL Kokosflocken.',
      '1 TL Vanilleextrakt.',
      'Optional: 1 TL Honig zum Süßen.',
      'Bis zur glatten Konsistenz mixen.'
    ]
  },
  {
    id: 'mango_turmeric',
    name: 'Mango-Kurkuma Smoothie',
    base: 'mango',
    liquid: 'Orangensaft',
    extras: ['Kurkuma', 'Ingwer', 'Karotte'],
    prepTime: 5,
    servings: 1,
    instructions: [
      '150g gefrorene Mango.',
      '100ml Orangensaft.',
      '1 kleine Karotte (geschält und geschnitten).',
      '½ TL Kurkuma-Pulver.',
      'Frischer Ingwer (daumengroßes Stück).',
      'Prise schwarzer Pfeffer (erhöht Kurkuma-Absorption).',
      'Alles mixen bis smooth.'
    ]
  },

  // GREEN SMOOTHIES
  {
    id: 'green_goddess',
    name: 'Green Goddess Smoothie',
    base: 'spinach',
    liquid: 'Mandelmilch',
    extras: ['Avocado', 'Banane', 'Ingwer', 'Zitrone'],
    prepTime: 5,
    servings: 1,
    instructions: [
      '2 Handvoll frischer Spinat.',
      '200ml Mandelmilch.',
      '½ Avocado für Cremigkeit.',
      '1 Banane (gefroren).',
      'Frischer Ingwer und Saft von ½ Zitrone.',
      'Optional: 1 TL Honig.',
      'Bis zur glatten grünen Konsistenz mixen.'
    ]
  },
  {
    id: 'tropical_green',
    name: 'Tropical Green Smoothie',
    base: 'kale',
    liquid: 'Kokoswasser',
    extras: ['Ananas', 'Mango', 'Minze'],
    prepTime: 5,
    servings: 1,
    instructions: [
      '1 Handvoll Grünkohl (Stiele entfernen).',
      '200ml Kokoswasser.',
      '100g Ananas (gefroren).',
      '100g Mango (gefroren).',
      'Frische Minzblätter.',
      'Bis zur cremigen Konsistenz mixen.'
    ]
  },

  // PROTEIN SMOOTHIES
  {
    id: 'berry_protein',
    name: 'Beeren-Protein Smoothie',
    base: 'mixed_berries',
    liquid: 'Milch',
    protein: 'Proteinpulver',
    extras: ['Haferflocken', 'Chiasamen'],
    prepTime: 5,
    servings: 1,
    instructions: [
      '150g gemischte Beeren (gefroren).',
      '200ml Milch (oder pflanzliche Alternative).',
      '1 Scoop Proteinpulver (Vanille oder neutral).',
      '2 EL Haferflocken.',
      '1 TL Chiasamen.',
      'Alles mixen bis smooth und cremig.'
    ]
  },
  {
    id: 'chocolate_almond',
    name: 'Schoko-Mandel Protein Smoothie',
    base: 'banana',
    liquid: 'Mandelmilch',
    protein: 'Mandelbutter',
    extras: ['Kakao', 'Haferflocken', 'Datteln'],
    prepTime: 5,
    servings: 1,
    instructions: [
      '1 Banane (gefroren).',
      '200ml Mandelmilch.',
      '2 EL Mandelbutter.',
      '2 TL Kakao-Pulver.',
      '2 EL Haferflocken.',
      '2 Datteln (entsteint) für natürliche Süße.',
      'Bis zur schokoladigen Cremigkeit mixen.'
    ]
  },

  // ENERGIZING SMOOTHIES
  {
    id: 'coffee_banana',
    name: 'Kaffee-Bananen Energy Smoothie',
    base: 'banana',
    liquid: 'Cold Brew Kaffee',
    extras: ['Haferflocken', 'Datteln', 'Zimt'],
    prepTime: 5,
    servings: 1,
    instructions: [
      '1 Banane (gefroren).',
      '150ml kalter Kaffee oder Cold Brew.',
      '50ml Hafermilch.',
      '2 EL Haferflocken.',
      '2 Datteln für Süße.',
      'Prise Zimt.',
      'Perfekt für den Morgen-Kick!'
    ]
  },
  {
    id: 'matcha_mango',
    name: 'Matcha-Mango Energy Smoothie',
    base: 'mango',
    liquid: 'Kokos-Drink',
    extras: ['Matcha', 'Spinat', 'Ingwer'],
    prepTime: 5,
    servings: 1,
    instructions: [
      '150g Mango (gefroren).',
      '200ml Kokos-Drink.',
      '1 TL Matcha-Pulver.',
      '1 Handvoll Spinat.',
      'Frischer Ingwer.',
      'Optional: Honig zum Süßen.',
      'Grüner Energy-Boost!'
    ]
  },

  // DESSERT SMOOTHIES
  {
    id: 'apple_pie',
    name: 'Apfelkuchen Smoothie',
    base: 'apple',
    liquid: 'Hafermilch',
    extras: ['Haferflocken', 'Zimt', 'Datteln', 'Vanille'],
    prepTime: 5,
    servings: 1,
    instructions: [
      '1 Apfel (geschält und gewürfelt).',
      '200ml Hafermilch.',
      '3 EL Haferflocken.',
      '1 TL Zimt.',
      '2 Datteln.',
      '½ TL Vanille.',
      'Schmeckt wie Apfelkuchen im Glas!'
    ]
  },
  {
    id: 'blueberry_cheesecake',
    name: 'Blaubeer-Cheesecake Smoothie',
    base: 'blueberries',
    liquid: 'Griechischer Joghurt',
    extras: ['Haferflocken', 'Vanille', 'Zitrone', 'Honig'],
    prepTime: 5,
    servings: 1,
    instructions: [
      '100g Blaubeeren (gefroren).',
      '150g griechischer Joghurt.',
      '50ml Milch.',
      '2 EL Haferflocken.',
      '1 TL Vanille.',
      'Saft von ½ Zitrone.',
      '1 TL Honig.',
      'Wie Cheesecake zum Trinken!'
    ]
  }
];

// Helper function to generate smoothie recipe
export const generateSmoothieRecipe = (template, phase) => {
  const ingredients = [];
  
  // Add base
  if (template.base) {
    const amounts = {
      'banana': '1 große',
      'strawberries': '150g',
      'mango': '150g',
      'spinach': '2 Handvoll',
      'kale': '1 Handvoll',
      'mixed_berries': '150g',
      'apple': '1',
      'blueberries': '100g'
    };
    ingredients.push(`${amounts[template.base] || ''} ${template.base}`);
  }
  
  // Add liquid
  if (template.liquid) {
    ingredients.push(`200ml ${template.liquid}`);
  }
  
  // Add extras
  if (template.extras) {
    template.extras.forEach(item => ingredients.push(item));
  }
  
  return {
    id: `smoothie_${template.id}_${Date.now()}`,
    title: template.name,
    ingredients: ingredients,
    instructions: template.instructions,
    readyInMinutes: template.prepTime || 5,
    servings: template.servings || 1,
    calories: 200 + Math.floor(Math.random() * 150),
    protein: 5 + Math.floor(Math.random() * 15),
    phase: phase,
    tags: ['Smoothie', 'Frühstück', phase + '-phase'],
    isSmoothie: true
  };
};

export default smoothieTemplates;
