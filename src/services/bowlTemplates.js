// Bowl & Wrap Recipe Templates
// Diverse bowls with different grains and salads

export const bowlTemplates = [
  // SALMON BOWLS
  {
    id: 'salmon_quinoa_carrot',
    name: 'Lachs-Quinoa Bowl mit Karottensalat',
    protein: 'salmon',
    grain: 'quinoa',
    salad: 'carrot_salad',
    veggies: ['Gurke', 'Edamame'],
    sauce: 'sesame_soy',
    prepTime: 25,
    instructions: [
      '150g Quinoa nach Packungsanweisung kochen.',
      '200g Lachsfilet mit Salz, Pfeffer würzen und in der Pfanne braten (5 Min/Seite).',
      'Karottensalat: 2 Karotten raspeln, mit Zitrone, Olivenöl, Honig marinieren.',
      'Gurke in Scheiben schneiden, Edamame kurz blanchieren.',
      'Sesam-Soja Sauce: 2 EL Sojasauce, 1 TL Sesamöl, 1 TL Honig, Sesam.',
      'Alles in einer Bowl anrichten und mit Sauce beträufeln.'
    ]
  },
  {
    id: 'salmon_rice_asian',
    name: 'Asia Lachs-Reis Bowl',
    protein: 'salmon',
    grain: 'brown_rice',
    veggies: ['Pak Choi', 'Shiitake', 'Frühlingszwiebeln'],
    sauce: 'teriyaki',
    prepTime: 30,
    instructions: [
      '150g braunen Reis kochen.',
      'Lachs teriyaki glasieren und im Ofen backen (180°C, 15 Min).',
      'Pak Choi und Shiitake in Sesam öl anbraten.',
      'Frühlingszwiebeln in Ringe schneiden.',
      'Alles anrichten und mit Teriyaki-Sauce garnieren.'
    ]
  },

  // CHICKEN BOWLS
  {
    id: 'chicken_sweet_potato_bowl',
    name: 'Hähnchen-Süßkartoffel Bowl',
    protein: 'chicken_breast',
    grain: 'sweet_potato',
    veggies: ['Brokkoli', 'Kichererbsen', 'Spinat'],
    sauce: 'tahini_lemon',
    prepTime: 35,
    instructions: [
      'Süßkartoffel würfeln und im Ofen rösten (200°C, 25 Min).',
      'Hähnchenbrust würzen und in der Pfanne braten.',
      'Brokkoli dämpfen, Kichererbsen rösten.',
      'Frischen Spinat als Basis.',
      'Tahini-Zitronen Sauce: Tahini, Zitrone, Knoblauch, Wasser.',
      'Bowl zusammenstellen und Sauce darüber.'
    ]
  },
  {
    id: 'mediterranean_chicken_bowl',
    name: 'Mediterrane Hähnchen Bowl',
    protein: 'chicken_breast',
    grain: 'quinoa',
    salad: 'greek_salad',
    extras: ['Feta', 'Oliven', 'Hummus'],
    sauce: 'lemon_herb',
    prepTime: 30,
    instructions: [
      'Quinoa kochen.',
      'Hähnchen mit Oregano, Knoblauch würzen und grillen.',
      'Griechischer Salat: Tomaten, Gurke, Paprika, Zwiebeln, Feta.',
      'Oliven und Hummus als Topping.',
      'Zitronen-Kräuter Dressing: Olivenöl, Zitrone, Oregano.'
    ]
  },

  // TOFU BOWLS
  {
    id: 'crispy_tofu_bowl',
    name: 'Crispy Tofu Buddha Bowl',
    protein: 'tofu',
    grain: 'brown_rice',
    veggies: ['Rotkohl', 'Karotten', 'Avocado'],
    sauce: 'peanut_sauce',
    prepTime: 30,
    instructions: [
      'Tofu würfeln, in Maisstärke wenden, knusprig braten.',
      'Braunen Reis kochen.',
      'Rotkohl fein hobeln und mit Essig marinieren.',
      'Karotten raspeln, Avocado schneiden.',
      'Erdnuss-Sauce: Erdnussbutter, Sojasauce, Limette, Ingwer, Wasser.',
      'Bowl anrichten mit allen Komponenten.'
    ]
  },
  {
    id: 'asian_tofu_quinoa',
    name: 'Asiatische Tofu-Quinoa Bowl',
    protein: 'tofu',
    grain: 'quinoa',
    veggies: ['Edamame', 'Gurke', 'Rote Paprika'],
    salad: 'wakame',
    sauce: 'sesame_ginger',
    prepTime: 25,
    instructions: [
      'Quinoa kochen.',
      'Tofu marinieren (Soja, Ingwer, Knoblauch) und braten.',
      'Edamame blanchieren.',
      'Gurke und Paprika in Streifen.',
      'Wakame Salat (Seetang) hinzufügen.',
      'Sesam-Ingwer Sauce drüber.'
    ]
  },

  // VEGGIE BOWLS
  {
    id: 'rainbow_veggie_bowl',
    name: 'Rainbow Buddha Bowl',
    grain: 'quinoa',
    veggies: ['Rote Beete', 'Karotten', 'Kichererbsen', 'Brokkoli', 'Avocado'],
    sauce: 'tahini_maple',
    prepTime: 35,
    instructions: [
      'Quinoa kochen.',
      'Rote Beete und Karotten im Ofen rösten.',
      'Kichererbsen würzen und knusprig rösten.',
      'Brokkoli dämpfen.',
      'Avocado in Scheiben.',
      'Tahini-Ahornsirup Sauce: Tahini, Ahornsirup, Zitrone.'
    ]
  },

  // WRAPS (Same fillings as bowls!)
  {
    id: 'chicken_wrap',
    name: 'Hähnchen-Hummus Wrap',
    protein: 'chicken_breast',
    spread: 'hummus',
    veggies: ['Salat', 'Tomaten', 'Gurke', 'Zwiebeln'],
    sauce: 'tzatziki',
    prepTime: 15,
    instructions: [
      'Vollkorn-Wrap kurz erwärmen.',
      'Hummus großzügig aufstreichen.',
      'Gegrilltes Hähnchen in Streifen schneiden.',
      'Salat, Tomaten, Gurke, Zwiebeln hinzufügen.',
      'Tzatziki drüber.',
      'Fest einrollen und diagonal halbieren.'
    ]
  },
  {
    id: 'falafel_wrap',
    name: 'Falafel-Tahini Wrap',
    protein: 'falafel',
    spread: 'hummus',
    veggies: ['Salat', 'Tomaten', 'Gurke', 'Rotkohl'],
    sauce: 'tahini_lemon',
    prepTime: 20,
    instructions: [
      'Falafel (aus Kichererbsen) frittieren oder backen.',
      'Wrap mit Hummus bestreichen.',
      'Gemüse kleinschneiden.',
      'Falafel, Gemüse auf Wrap legen.',
      'Tahini-Zitronen Sauce drüber.',
      'Einrollen.'
    ]
  }
];

// Generate bowl/wrap recipe
export const generateBowlRecipe = (template, phase) => {
  const ingredients = [];
  
  if (template.protein) ingredients.push(`200g ${template.protein}`);
  if (template.grain) ingredients.push(`150g ${template.grain}`);
  if (template.veggies) template.veggies.forEach(v => ingredients.push(v));
  if (template.sauce) ingredients.push(`Für die Sauce: ${template.sauce}`);
  
  return {
    id: `bowl_${template.id}_${Date.now()}`,
    title: template.name,
    ingredients: ingredients,
    instructions: template.instructions,
    readyInMinutes: template.prepTime || 30,
    servings: 1,
    calories: 450 + Math.floor(Math.random() * 200),
    protein: 25 + Math.floor(Math.random() * 15),
    phase: phase,
    tags: ['Bowl', 'Hauptgericht', phase + '-phase'],
    isBowl: true
  };
};

export default bowlTemplates;
