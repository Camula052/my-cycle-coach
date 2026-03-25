// Snack Recipe Templates
// Creative, diverse snacks - NO boring raw apples!

export const snackTemplates = [
  // ENERGY BALLS
  {
    id: 'date_coconut_balls',
    name: 'Dattel-Kokos Energy Balls',
    base: 'dates',
    mix: ['Kokosflocken', 'Mandeln', 'Kakao'],
    prepTime: 15,
    servings: 10,
    instructions: [
      '200g entsteinte Datteln mit 100g Mandeln in einem Mixer fein hacken.',
      '2 EL Kakao und 3 EL Kokosflocken hinzufügen.',
      'Zu einer klebrigen Masse mixen.',
      'Kleine Kugeln formen (ca. 10 Stück).',
      'In Kokosflocken wälzen und im Kühlschrank fest werden lassen.'
    ]
  },
  {
    id: 'peanut_butter_balls',
    name: 'Erdnussbutter Energy Balls',
    base: 'dates',
    mix: ['Erdnussbutter', 'Haferflocken', 'Chiasamen'],
    prepTime: 10,
    servings: 12,
    instructions: [
      '200g Datteln, 3 EL Erdnussbutter und 50g Haferflocken mixen.',
      '1 EL Chiasamen unterrühren.',
      'Optional: 1 EL Honig für mehr Süße.',
      'Zu 12 Kugeln formen.',
      'Mind. 30 Min. kühlen.'
    ]
  },
  {
    id: 'cashew_cacao_balls',
    name: 'Cashew-Kakao Bliss Balls',
    base: 'dates',
    mix: ['Cashews', 'Kakao', 'Vanille'],
    prepTime: 15,
    servings: 12,
    instructions: [
      '150g Cashews und 150g Datteln fein mixen.',
      '2 EL Kakao und 1 TL Vanille hinzufügen.',
      'Eine Prise Salz für Kontrast.',
      'Zu Kugeln formen.',
      'Optional: In Kakao wälzen.'
    ]
  },

  // NUT BUTTER VARIATIONS
  {
    id: 'apple_almond_butter',
    name: 'Apfel mit Mandelbutter',
    base: 'apple',
    spread: 'Mandelbutter',
    toppings: ['Zimt', 'Granola', 'Chiasamen'],
    prepTime: 3,
    instructions: [
      'Apfel in Spalten schneiden.',
      'Mit Mandelbutter bestreichen.',
      'Mit Zimt bestreuen.',
      'Optional: Granola oder Chiasamen drüber.'
    ]
  },
  {
    id: 'banana_peanut_butter',
    name: 'Bananen-Erdnussbutter Happen',
    base: 'banana',
    spread: 'Erdnussbutter',
    toppings: ['Dunkle Schokolade', 'Kokos'],
    prepTime: 5,
    freezeTime: 60,
    instructions: [
      'Banane in Scheiben schneiden.',
      'Erdnussbutter zwischen 2 Scheiben geben (Sandwich).',
      'In geschmolzene dunkle Schokolade tauchen.',
      'Mit Kokosraspeln bestreuen.',
      '1 Stunde einfrieren - perfekter Frozen Snack!'
    ]
  },

  // PROTEIN SNACKS
  {
    id: 'cottage_cheese_bowl',
    name: 'Hüttenkäse mit Beeren',
    base: 'cottage_cheese',
    toppings: ['Beeren', 'Honig', 'Nüsse', 'Minze'],
    prepTime: 3,
    instructions: [
      '150g Hüttenkäse in eine Schüssel geben.',
      'Mit frischen Beeren toppen.',
      'Mit Honig beträufeln.',
      'Gehackte Nüsse und frische Minze darüber.'
    ]
  },
  {
    id: 'greek_yogurt_parfait',
    name: 'Griechischer Joghurt Parfait',
    base: 'greek_yogurt',
    layers: ['Granola', 'Beeren', 'Honig'],
    prepTime: 5,
    instructions: [
      'In ein Glas schichten:',
      '- 100g griechischer Joghurt',
      '- 2 EL Granola',
      '- Beeren',
      '- Wieder Joghurt',
      '- Honig drüber.',
      'Sofort genießen!'
    ]
  },
  {
    id: 'egg_muffins',
    name: 'Mini Ei-Muffins',
    base: 'eggs',
    mix: ['Spinat', 'Tomaten', 'Käse'],
    cookTime: 20,
    servings: 6,
    instructions: [
      'Eier mit Salz, Pfeffer verquirlen.',
      'Gehackten Spinat, Tomaten, Käse unterrühren.',
      'In Muffinform füllen.',
      'Bei 180°C 15-20 Min. backen.',
      'Kalt oder warm genießen - perfekt zum Vorbereiten!'
    ]
  },

  // VEGGIE SNACKS
  {
    id: 'hummus_veggie_sticks',
    name: 'Hummus mit Gemüsesticks',
    base: 'chickpeas',
    veggies: ['Karotten', 'Gurke', 'Paprika', 'Sellerie'],
    prepTime: 10,
    instructions: [
      'Hummus: 1 Dose Kichererbsen, 2 EL Tahini, Zitrone, Knoblauch mixen.',
      'Gemüse in Sticks schneiden.',
      'Mit Hummus dippen.',
      'Optional: Hummus mit Paprika oder Kräutern würzen.'
    ]
  },
  {
    id: 'roasted_chickpeas',
    name: 'Geröstete Kichererbsen',
    base: 'chickpeas',
    spices: ['Paprika', 'Kreuzkümmel', 'Salz'],
    cookTime: 30,
    servings: 4,
    instructions: [
      'Kichererbsen aus der Dose abspülen und trocken tupfen.',
      'Mit Olivenöl, Paprika, Kreuzkümmel, Salz mischen.',
      'Auf Backblech verteilen.',
      'Bei 200°C 25-30 Min. rösten bis knusprig.',
      'Abkühlen lassen - super crunchy!'
    ]
  },

  // SWEET TREATS
  {
    id: 'nice_cream',
    name: 'Banana Nice Cream',
    base: 'banana',
    mix: ['Kakao', 'Erdnussbutter'],
    prepTime: 5,
    freezeTime: 120,
    instructions: [
      '2 reife Bananen in Scheiben schneiden und einfrieren (mind. 2h).',
      'Gefrorene Bananen mit 1 EL Kakao und 1 EL Erdnussbutter mixen.',
      'Bis zur cremigen Konsistenz mixen.',
      'Sofort servieren oder nochmal kurz einfrieren.',
      'Gesundes "Eis" ohne Zucker!'
    ]
  },
  {
    id: 'chia_pudding_cup',
    name: 'Chia Pudding Cup',
    base: 'chia_seeds',
    liquid: 'Mandelmilch',
    toppings: ['Beeren', 'Nüsse', 'Honig'],
    prepTime: 5,
    soakTime: 120,
    instructions: [
      '3 EL Chiasamen mit 150ml Mandelmilch vermischen.',
      'Mit Honig oder Vanille süßen.',
      'Mind. 2h quellen lassen.',
      'Mit frischen Beeren und Nüssen toppen.',
      'Perfekt zum Vorbereiten!'
    ]
  },

  // CRACKERS & DIPS
  {
    id: 'avocado_rice_cakes',
    name: 'Reiswaffeln mit Avocado',
    base: 'rice_cakes',
    spread: 'Avocado',
    toppings: ['Tomaten', 'Chili', 'Sesam'],
    prepTime: 5,
    instructions: [
      'Avocado zerdrücken, mit Zitrone, Salz, Pfeffer würzen.',
      'Auf Reiswaffeln streichen.',
      'Mit Kirschtomaten und Chiliflocken toppen.',
      'Sesam drüber streuen.'
    ]
  },
  {
    id: 'nut_trail_mix',
    name: 'Power Nuss-Mix',
    mix: ['Mandeln', 'Walnüsse', 'Cashews', 'Rosinen', 'Dunkle Schokolade'],
    prepTime: 2,
    servings: 6,
    instructions: [
      'Je 30g Mandeln, Walnüsse, Cashews mischen.',
      '20g Rosinen hinzufügen.',
      '20g gehackte dunkle Schokolade unterrühren.',
      'In Portionen aufteilen.',
      'Perfekt to-go!'
    ]
  }
];

// Helper function to generate snack recipe
export const generateSnackRecipe = (template, phase) => {
  const ingredients = [];
  
  // Add base
  if (template.base) {
    const amounts = {
      'dates': '200g',
      'apple': '1',
      'banana': '1-2',
      'cottage_cheese': '150g',
      'greek_yogurt': '150g',
      'eggs': '4',
      'chickpeas': '1 Dose',
      'chia_seeds': '3 EL',
      'rice_cakes': '2'
    };
    ingredients.push(`${amounts[template.base] || ''} ${template.base}`);
  }
  
  // Add mix ingredients
  if (template.mix) {
    template.mix.forEach(item => ingredients.push(item));
  }
  
  // Add toppings
  if (template.toppings) {
    template.toppings.forEach(item => ingredients.push(item));
  }
  
  return {
    id: `snack_${template.id}_${Date.now()}`,
    title: template.name,
    ingredients: ingredients,
    instructions: template.instructions,
    readyInMinutes: template.cookTime || template.prepTime || 5,
    servings: template.servings || 1,
    calories: 150 + Math.floor(Math.random() * 200),
    protein: 5 + Math.floor(Math.random() * 10),
    phase: phase,
    tags: ['Snack', phase + '-phase'],
    isSnack: true
  };
};

export default snackTemplates;
