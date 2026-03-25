// Salad & Dessert Templates

export const saladTemplates = [
  {
    id: 'green_goddess',
    name: 'Green Goddess Salad',
    base: ['Römersalat', 'Rucola', 'Spinat'],
    toppings: ['Avocado', 'Gurke', 'Edamame', 'Kürbiskerne'],
    protein: 'Hähnchen',
    dressing: 'Green Goddess Dressing',
    prepTime: 15,
    instructions: [
      'Salat waschen und in mundgerechte Stücke zupfen.',
      'Avocado, Gurke in Würfel schneiden.',
      'Edamame blanchieren.',
      'Hähnchenbrust grillen und in Streifen schneiden.',
      'Green Goddess Dressing: Avocado, Joghurt, Kräuter (Basilikum, Petersilie), Knoblauch, Zitrone mixen.',
      'Alles mischen und mit Kürbiskernen toppen.'
    ]
  },
  {
    id: 'quinoa_power_salad',
    name: 'Quinoa Power Salad',
    base: 'Quinoa',
    veggies: ['Rote Beete', 'Feta', 'Walnüsse', 'Rucola'],
    dressing: 'Balsamico-Honig',
    prepTime: 25,
    instructions: [
      'Quinoa kochen und abkühlen lassen.',
      'Rote Beete rösten (200°C, 30 Min).',
      'Feta würfeln, Walnüsse rösten.',
      'Rucola waschen.',
      'Balsamico-Honig Dressing: Balsamico, Olivenöl, Honig, Senf.',
      'Alles mischen.'
    ]
  },
  {
    id: 'asian_crunch_salad',
    name: 'Asian Crunch Salad',
    base: ['Rotkohl', 'Chinakohl', 'Karotten'],
    toppings: ['Mandeln', 'Sesam', 'Frühlingszwiebeln'],
    protein: 'Edamame',
    dressing: 'Sesam-Ingwer',
    prepTime: 15,
    instructions: [
      'Rotkohl und Chinakohl fein hobeln.',
      'Karotten raspeln.',
      'Mandeln hacken und rösten.',
      'Edamame blanchieren.',
      'Sesam-Ingwer Dressing: Sesamöl, Reisessig, Soja, Ingwer, Honig.',
      'Alles mischen, mit Sesam und Frühlingszwiebeln garnieren.'
    ]
  }
];

export const dessertTemplates = [
  {
    id: 'sweet_potato_brownies',
    name: 'Süßkartoffel Brownies',
    base: 'sweet_potato',
    extras: ['Kakao', 'Ahornsirup', 'Mandeln', 'Dunkle Schokolade'],
    cookTime: 35,
    servings: 12,
    instructions: [
      '200g Süßkartoffel kochen und pürieren.',
      'Mit 100g Mandelmehl, 50g Kakao, 80ml Ahornsirup mixen.',
      '2 Eier hinzufügen.',
      '50g gehackte dunkle Schokolade unterrühren.',
      'In Form füllen, bei 180°C 25-30 Min backen.',
      'Abkühlen lassen - super fudgy!'
    ]
  },
  {
    id: 'fake_panna_cotta',
    name: 'Mandelmilch "Panna Cotta"',
    base: 'almond_milk',
    extras: ['Agar-Agar', 'Vanille', 'Ahornsirup'],
    toppings: ['Beeren-Kompott'],
    prepTime: 10,
    chillTime: 240,
    servings: 4,
    instructions: [
      '500ml Mandelmilch mit 1 TL Vanille und 2 EL Ahornsirup erhitzen.',
      '2 TL Agar-Agar Pulver einrühren und 2 Min köcheln.',
      'In Förmchen füllen.',
      'Mind. 4h im Kühlschrank fest werden lassen.',
      'Beeren-Kompott: Beeren mit etwas Zitrone und Ahornsirup köcheln.',
      'Panna Cotta stürzen und mit Kompott servieren.'
    ]
  },
  {
    id: 'banana_nice_cream_deluxe',
    name: 'Banana Nice Cream Deluxe',
    base: 'frozen_banana',
    variations: ['Schoko-Erdnuss', 'Beeren-Kokos', 'Matcha'],
    prepTime: 5,
    servings: 2,
    instructions: [
      'Basis: 3 gefrorene Bananen mixen bis cremig.',
      'SCHOKO-ERDNUSS: + 2 EL Kakao, 2 EL Erdnussbutter.',
      'BEEREN-KOKOS: + 100g gefrorene Beeren, 2 EL Kokosflocken.',
      'MATCHA: + 1 TL Matcha, 1 EL Honig.',
      'Sofort servieren oder 30 Min nachfrieren für festere Konsistenz.'
    ]
  },
  {
    id: 'chia_chocolate_pudding',
    name: 'Schoko-Chia Pudding',
    base: 'chia_seeds',
    liquid: 'Mandelmilch',
    extras: ['Kakao', 'Ahornsirup', 'Vanille'],
    toppings: ['Beeren', 'Kokos', 'Kakao-Nibs'],
    prepTime: 5,
    soakTime: 240,
    servings: 2,
    instructions: [
      '4 EL Chiasamen mit 300ml Mandelmilch mischen.',
      '3 EL Kakao, 2 EL Ahornsirup, 1 TL Vanille hinzufügen.',
      'Gut umrühren.',
      'Mind. 4h (oder über Nacht) quellen lassen.',
      'Mit Beeren, Kokosraspeln und Kakao-Nibs toppen.'
    ]
  },
  {
    id: 'avocado_chocolate_mousse',
    name: 'Avocado-Schoko Mousse',
    base: 'avocado',
    extras: ['Kakao', 'Ahornsirup', 'Vanille'],
    prepTime: 10,
    chillTime: 60,
    servings: 4,
    instructions: [
      '2 reife Avocados pürieren.',
      '4 EL Kakao, 4 EL Ahornsirup, 1 TL Vanille hinzufügen.',
      'Prise Salz für Kontrast.',
      'Bis zur cremigen Konsistenz mixen.',
      '1h kühlen.',
      'Optional: Mit Beeren oder Schlagsahne servieren.'
    ]
  },
  {
    id: 'energy_balls_dessert',
    name: 'Dessert Energy Balls',
    variations: ['Cookie Dough', 'Brownie Bites', 'Lemon Coconut'],
    prepTime: 15,
    servings: 12,
    instructions: [
      'COOKIE DOUGH: Cashews, Datteln, Vanille, Schoko-Chips.',
      'BROWNIE BITES: Walnüsse, Datteln, Kakao, Espresso.',
      'LEMON COCONUT: Cashews, Datteln, Zitrone, Kokos.',
      'Jeweils im Mixer zerkleinern, zu Kugeln formen.',
      'Im Kühlschrank aufbewahren.'
    ]
  }
];

export const generateSaladRecipe = (template, phase) => {
  const ingredients = [];
  
  if (Array.isArray(template.base)) {
    template.base.forEach(b => ingredients.push(b));
  } else {
    ingredients.push(template.base);
  }
  
  if (template.veggies) template.veggies.forEach(v => ingredients.push(v));
  if (template.toppings) template.toppings.forEach(t => ingredients.push(t));
  if (template.protein) ingredients.push(template.protein);
  if (template.dressing) ingredients.push(`Dressing: ${template.dressing}`);
  
  return {
    id: `salad_${template.id}_${Date.now()}`,
    title: template.name,
    ingredients: ingredients,
    instructions: template.instructions,
    readyInMinutes: template.prepTime || 15,
    servings: 1,
    calories: 300 + Math.floor(Math.random() * 200),
    protein: 15 + Math.floor(Math.random() * 15),
    phase: phase,
    tags: ['Salad', 'Gesund', phase + '-phase'],
    isSalad: true
  };
};

export const generateDessertRecipe = (template, phase) => {
  const ingredients = [];
  
  if (template.base) ingredients.push(template.base);
  if (template.extras) template.extras.forEach(e => ingredients.push(e));
  if (template.toppings) template.toppings.forEach(t => ingredients.push(t));
  
  return {
    id: `dessert_${template.id}_${Date.now()}`,
    title: template.name,
    ingredients: ingredients,
    instructions: template.instructions,
    readyInMinutes: (template.cookTime || template.prepTime || 15) + (template.chillTime ? 0 : 0),
    servings: template.servings || 1,
    calories: 150 + Math.floor(Math.random() * 200),
    protein: 3 + Math.floor(Math.random() * 8),
    phase: phase,
    tags: ['Dessert', 'Healthy', phase + '-phase'],
    isDessert: true
  };
};