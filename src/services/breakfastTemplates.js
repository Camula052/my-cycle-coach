// Breakfast Recipe Templates
// Real, creative breakfast recipes instead of "cook banana according to package instructions" 😂

export const breakfastTemplates = [
  // PORRIDGE / BOWLS
  {
    id: 'overnight_oats_classic',
    name: 'Classic Overnight Oats',
    base: 'oats',
    liquids: ['Mandelmilch'],
    extras: ['Chiasamen', 'Zimt', 'Vanille'],
    toppings: ['Beeren', 'Banane', 'Nüsse', 'Honig'],
    prepTime: 5,
    soakTime: 480,
    instructions: [
      '50g Haferflocken mit 150ml Mandelmilch vermischen.',
      '1 EL Chiasamen hinzufügen.',
      'Prise Zimt und Vanille.',
      'Über Nacht (mind. 8h) im Kühlschrank quellen lassen.',
      'Mit frischen Beeren, Bananenscheiben, Nüssen und Honig toppen.'
    ]
  },
  {
    id: 'chocolate_overnight_oats',
    name: 'Schoko-Overnight Oats',
    base: 'oats',
    liquids: ['Milch'],
    extras: ['Kakao', 'Ahornsirup', 'Chiasamen'],
    toppings: ['Banane', 'Kakao-Nibs', 'Nussbutter'],
    prepTime: 5,
    soakTime: 480,
    instructions: [
      '50g Haferflocken, 150ml Milch, 2 EL Kakao vermischen.',
      '1 EL Chiasamen und 1 EL Ahornsirup hinzufügen.',
      'Über Nacht quellen lassen.',
      'Mit Bananenscheiben, Kakao-Nibs und einem Klecks Nussbutter toppen.'
    ]
  },
  {
    id: 'apple_cinnamon_oats',
    name: 'Apfel-Zimt Overnight Oats',
    base: 'oats',
    liquids: ['Hafermilch'],
    extras: ['Apfel', 'Zimt', 'Ahornsirup'],
    toppings: ['Geröstete Walnüsse', 'Apfelstücke'],
    prepTime: 5,
    soakTime: 480,
    instructions: [
      '50g Haferflocken mit 150ml Hafermilch.',
      '½ geriebenen Apfel unterrühren.',
      '1 TL Zimt und 1 EL Ahornsirup.',
      'Über Nacht quellen lassen.',
      'Mit frischen Apfelstücken und gerösteten Walnüssen garnieren.'
    ]
  },
  {
    id: 'berry_chia_oats',
    name: 'Beeren-Chia Overnight Oats',
    base: 'oats',
    liquids: ['Mandelmilch'],
    extras: ['Chiasamen', 'Beeren', 'Vanille'],
    toppings: ['Frische Beeren', 'Kokosflocken', 'Honig'],
    prepTime: 5,
    soakTime: 480,
    instructions: [
      '50g Haferflocken, 150ml Mandelmilch, 2 EL Chiasamen.',
      'Handvoll gemischte Beeren (leicht zerdrückt) unterrühren.',
      '½ TL Vanilleextrakt.',
      'Über Nacht quellen lassen.',
      'Mit frischen Beeren, Kokosflocken und Honig toppen.'
    ]
  },
  {
    id: 'pb_banana_oats',
    name: 'Erdnussbutter-Bananen Overnight Oats',
    base: 'oats',
    liquids: ['Hafermilch'],
    extras: ['Erdnussbutter', 'Banane', 'Chiasamen'],
    toppings: ['Bananenscheiben', 'Erdnüsse', 'Honig'],
    prepTime: 5,
    soakTime: 480,
    instructions: [
      '50g Haferflocken mit 150ml Hafermilch.',
      '2 EL Erdnussbutter einrühren.',
      '½ zerdrückte Banane und 1 EL Chiasamen.',
      'Über Nacht quellen lassen.',
      'Mit frischen Bananenscheiben, gehackten Erdnüssen und Honig garnieren.'
    ]
  },
  {
    id: 'overnight_oats',
    name: 'Overnight Oats',
    base: 'oats',
    liquids: ['Mandelmilch', 'Hafermilch', 'Kokosmilch', 'Naturjoghurt'],
    toppings: ['Beeren', 'Banane', 'Nüsse', 'Chiasamen', 'Honig', 'Zimt'],
    prepTime: 5,
    soakTime: 480, // 8 hours
    instructions: [
      'Haferflocken mit Milch/Joghurt im Verhältnis 1:2 in einem Glas vermischen.',
      'Chiasamen und Zimt unterrühren.',
      'Über Nacht (mind. 8h) im Kühlschrank quellen lassen.',
      'Am nächsten Morgen mit frischen Früchten, Nüssen und Honig toppen.'
    ]
  },
  {
    id: 'porridge_bowl',
    name: 'Warmes Porridge',
    base: 'oats',
    liquids: ['Milch', 'Wasser + Milch', 'Hafermilch'],
    toppings: ['Beeren', 'Apfel', 'Zimt', 'Nüsse', 'Ahornsirup', 'Kakao-Nibs'],
    cookTime: 10,
    instructions: [
      'Haferflocken mit Milch/Wasser in einem Topf aufkochen.',
      'Bei niedriger Hitze 5-8 Minuten köcheln lassen, dabei gelegentlich umrühren.',
      'Eine Prise Salz und Zimt hinzufügen.',
      'In eine Schüssel geben und mit Früchten, Nüssen und Süße nach Wahl garnieren.'
    ]
  },
  {
    id: 'smoothie_bowl',
    name: 'Smoothie Bowl',
    base: 'berries',
    liquids: ['Mandelmilch', 'Kokosmilch', 'Naturjoghurt'],
    extras: ['Banane (gefroren)', 'Spinat', 'Proteinpulver'],
    toppings: ['Granola', 'Beeren', 'Kokosflocken', 'Chiasamen', 'Nüsse'],
    prepTime: 10,
    instructions: [
      'Gefrorene Beeren, Banane und Flüssigkeit in einen Mixer geben.',
      'Optional: Spinat oder Proteinpulver hinzufügen.',
      'Bis zur cremigen Konsistenz mixen (dickflüssiger als normaler Smoothie).',
      'In eine Schüssel geben und mit Granola, frischen Beeren und Toppings garnieren.'
    ]
  },

  // TOAST & BREAD
  {
    id: 'avocado_toast',
    name: 'Avocado Toast',
    base: 'bread',
    protein: 'eggs',
    toppings: ['Avocado', 'Zitrone', 'Chili', 'Sesam', 'Tomaten'],
    cookTime: 10,
    instructions: [
      'Brot toasten.',
      'Avocado zerdrücken und mit Zitronensaft, Salz und Pfeffer würzen.',
      'Auf dem Toast verteilen.',
      'Optional: Ei pochieren oder braten und darauf legen.',
      'Mit Chiliflocken, Sesam und Tomaten garnieren.'
    ]
  },
  {
    id: 'nut_butter_toast',
    name: 'Nussbutter Toast',
    base: 'bread',
    spreads: ['Erdnussbutter', 'Mandelbutter', 'Cashewbutter'],
    toppings: ['Banane', 'Beeren', 'Chiasamen', 'Honig', 'Kakao-Nibs'],
    prepTime: 5,
    instructions: [
      'Brot toasten.',
      'Großzügig Nussbutter aufstreichen.',
      'Bananenscheiben darauflegen.',
      'Mit Chiasamen, Honig und optional Kakao-Nibs garnieren.'
    ]
  },
  {
    id: 'cottage_cheese_toast',
    name: 'Hüttenkäse Toast',
    base: 'bread',
    protein: 'cottage_cheese',
    toppings: ['Beeren', 'Honig', 'Nüsse', 'Zimt'],
    prepTime: 5,
    instructions: [
      'Brot toasten.',
      'Hüttenkäse großzügig aufstreichen.',
      'Mit frischen Beeren toppen.',
      'Mit Honig beträufeln und Nüsse darüberstreuen.'
    ]
  },

  // EIER-GERICHTE
  {
    id: 'scrambled_eggs',
    name: 'Rührei mit Toast',
    base: 'bread',
    protein: 'eggs',
    extras: ['Milch', 'Schnittlauch', 'Tomaten'],
    cookTime: 8,
    instructions: [
      'Eier mit etwas Milch verquirlen, mit Salz und Pfeffer würzen.',
      'In einer Pfanne mit Butter bei mittlerer Hitze stocken lassen, dabei ständig rühren.',
      'Brot toasten.',
      'Rührei auf dem Toast anrichten.',
      'Mit Schnittlauch und Kirschtomaten garnieren.'
    ]
  },
  {
    id: 'veggie_omelette',
    name: 'Gemüse-Omelette',
    base: null,
    protein: 'eggs',
    veggies: ['Paprika', 'Spinat', 'Tomaten', 'Zwiebeln', 'Pilze'],
    cookTime: 12,
    instructions: [
      'Gemüse kleinschneiden und in einer Pfanne mit Olivenöl anbraten.',
      'Eier verquirlen, würzen und über das Gemüse gießen.',
      'Bei mittlerer Hitze stocken lassen.',
      'Optional: Mit geriebenem Käse bestreuen.',
      'Zusammenklappen und servieren.'
    ]
  },

  // SPECIAL
  {
    id: 'chia_pudding',
    name: 'Chia Pudding',
    base: 'chia_seeds',
    liquids: ['Mandelmilch', 'Kokosmilch', 'Hafermilch'],
    toppings: ['Beeren', 'Mango', 'Granola', 'Nüsse', 'Honig'],
    prepTime: 5,
    soakTime: 240, // 4 hours minimum
    instructions: [
      '3 EL Chiasamen mit 200ml Milch vermischen.',
      'Süßen nach Belieben (Honig, Ahornsirup oder Vanille).',
      'Gut umrühren und mindestens 4 Stunden (oder über Nacht) quellen lassen.',
      'Mit frischen Früchten, Granola und Nüssen toppen.'
    ]
  },
  {
    id: 'greek_yogurt_bowl',
    name: 'Griechischer Joghurt Bowl',
    base: 'greek_yogurt',
    toppings: ['Granola', 'Beeren', 'Honig', 'Nüsse', 'Banane'],
    prepTime: 5,
    instructions: [
      'Griechischen Joghurt in eine Schüssel geben.',
      'Mit Granola für Crunch bestreuen.',
      'Frische Beeren und Bananenscheiben hinzufügen.',
      'Mit Honig beträufeln und gehackten Nüssen garnieren.'
    ]
  },
  {
    id: 'protein_pancakes',
    name: 'Protein Pancakes',
    base: 'oats',
    protein: 'eggs',
    extras: ['Banane', 'Proteinpulver', 'Backpulver'],
    toppings: ['Beeren', 'Ahornsirup', 'Nussbutter'],
    cookTime: 15,
    instructions: [
      'Haferflocken, Eier, Banane und Proteinpulver mixen.',
      'Eine Prise Backpulver und Zimt hinzufügen.',
      'Kleine Portionen in eine heiße Pfanne geben.',
      'Von jeder Seite 2-3 Minuten backen.',
      'Mit Beeren, Ahornsirup und Nussbutter servieren.'
    ]
  }
];

// Helper function to generate breakfast recipe
export const generateBreakfastRecipe = (template, phase) => {
  const baseIngredients = [];
  const instructions = [...template.instructions];
  
  // Translation map for common ingredients
  const translations = {
    'oats': 'Haferflocken',
    'bread': 'Vollkornbrot',
    'granola': 'Granola',
    'banana': 'Banane',
    'berries': 'Beeren',
    'eggs': 'Eier',
    'cottage_cheese': 'Hüttenkäse',
    'greek_yogurt': 'Griechischer Joghurt',
    'chia_seeds': 'Chiasamen',
    'rice_cakes': 'Reiswaffeln'
  };
  
  // Add base ingredient
  if (template.base) {
    const amounts = {
      'oats': '50g',
      'bread': '2 Scheiben',
      'berries': '150g',
      'chia_seeds': '3 EL',
      'greek_yogurt': '200g'
    };
    const name = translations[template.base] || template.base;
    baseIngredients.push(`${amounts[template.base]} ${name}`);
  }
  
  // Add liquid if present
  if (template.liquids) {
    const liquid = template.liquids[Math.floor(Math.random() * template.liquids.length)];
    baseIngredients.push(`150-200ml ${liquid}`);
  }
  
  // Add protein if present
  if (template.protein) {
    const amounts = {
      'eggs': '2',
      'cottage_cheese': '100g'
    };
    const name = translations[template.protein] || template.protein;
    baseIngredients.push(`${amounts[template.protein]} ${name}`);
  }
  
  // Add extras if present
  if (template.extras) {
    template.extras.forEach(extra => {
      baseIngredients.push(extra); // Already in German
    });
  }
  
  // Add random toppings (2-3)
  if (template.toppings) {
    const numToppings = 2 + Math.floor(Math.random() * 2);
    const selectedToppings = [];
    for (let i = 0; i < numToppings && i < template.toppings.length; i++) {
      const topping = template.toppings[Math.floor(Math.random() * template.toppings.length)];
      if (!selectedToppings.includes(topping)) {
        selectedToppings.push(topping);
        baseIngredients.push(topping); // Already in German
      }
    }
  }
  
  return {
    id: `breakfast_${template.id}_${Date.now()}`,
    title: template.name,
    ingredients: baseIngredients,
    instructions: instructions,
    readyInMinutes: (template.cookTime || template.prepTime || 10),
    servings: 1,
    calories: 350 + Math.floor(Math.random() * 200),
    protein: 12 + Math.floor(Math.random() * 15),
    phase: phase,
    tags: ['Frühstück', phase + '-phase'],
    isBreakfast: true
  };
};

export default breakfastTemplates;