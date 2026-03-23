import React, { useState } from 'react';
import { RefreshCw, Save, Calendar, Check, Heart, Info, X, Wrench } from 'lucide-react';
import { buildRecipe } from '../services/recipeBuilder';
import recipeComponents from '../services/recipeComponents';
import RecipeDetailModal from './RecipeDetailModal';
import ComponentBuilder from './ComponentBuilder';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096',
  background: '#FAF5F0',
  primary: '#E8A888'
};

const WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const MealPlanGenerator = ({ onSave, userData }) => {
  const [step, setStep] = useState('preferences');
  const [preferences, setPreferences] = useState({
    diet: '',
    intolerances: [],
    preferences: [],
    excludeIngredients: ''
  });
  const [startDay, setStartDay] = useState(0);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFavoritesOverlay, setShowFavoritesOverlay] = useState(false);
  const [showRecipeDetailModal, setShowRecipeDetailModal] = useState(false);
  const [showComponentBuilder, setShowComponentBuilder] = useState(false);
  const [selectedMealForSwap, setSelectedMealForSwap] = useState(null);
  const [selectedRecipeForInfo, setSelectedRecipeForInfo] = useState(null);

  const dietOptions = [
    { value: '', label: 'Keine Einschränkung' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarisch' },
    { value: 'pescetarian', label: 'Pescetarisch' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'keto', label: 'Keto' }
  ];

  const intoleranceOptions = [
    'Laktose', 'Gluten', 'Nüsse', 'Soja', 'Eier', 'Fisch', 'Schalentiere'
  ];

  const preferenceOptions = [
    'Nur Vollkorn', 'Bio bevorzugt', 'Regional', 'Schnell (<30min)', 'High Protein', 'Low Carb'
  ];

  const generateMealPlan = () => {
    setLoading(true);
    
    try {
      const phaseKey = userData?.currentPhase?.key || 'follicular';
      
      console.log('🎨 Generating component-based meal plan...');
      console.log('Phase:', phaseKey);
      console.log('Preferences:', preferences);

      // Get phase-appropriate components
      const allProteins = [...recipeComponents.proteins.animal, ...recipeComponents.proteins.plant];
      const allCarbs = recipeComponents.carbs;
      const allVeggies = recipeComponents.vegetables;
      const allSauces = recipeComponents.sauces.presets;

      // Filter by phase and preferences
      let phaseProteins = allProteins.filter(p => p.phase.includes(phaseKey) || p.phase.includes('all'));
      let phaseCarbs = allCarbs.filter(c => c.phase.includes(phaseKey) || c.phase.includes('all'));
      let phaseVeggies = allVeggies.filter(v => v.phase.includes(phaseKey) || v.phase.includes('all'));

      // Apply diet preferences
      if (preferences.diet === 'vegetarian') {
        phaseProteins = phaseProteins.filter(p => p.diet?.includes('vegetarian') || p.diet?.includes('vegan'));
      } else if (preferences.diet === 'vegan') {
        phaseProteins = phaseProteins.filter(p => p.diet?.includes('vegan'));
      } else if (preferences.diet === 'pescetarian') {
        phaseProteins = phaseProteins.filter(p => 
          p.diet?.includes('pescetarian') || 
          p.diet?.includes('vegetarian') || 
          p.diet?.includes('vegan')
        );
      }

      console.log(`✅ Available components: ${phaseProteins.length} proteins, ${phaseCarbs.length} carbs, ${phaseVeggies.length} veggies`);

      // Helper function to get random component
      const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

      // Meal-type specific templates
      const generateMealByType = (mealType) => {
        if (mealType === 'breakfast') {
          // Frühstück: Hauptsächlich Carbs, optional Protein, kein/wenig Gemüse
          const carb = getRandom(phaseCarbs.filter(c => 
            ['oats', 'bread', 'whole_wheat_pasta'].includes(c.id)
          )) || getRandom(phaseCarbs);
          const protein = Math.random() > 0.3 ? getRandom(phaseProteins.filter(p => 
            ['eggs', 'tofu', 'tempeh'].includes(p.id)
          )) : null;
          const sauce = getRandom(allSauces.filter(s => 
            ['tahini_dressing', 'tzatziki'].includes(s.id)
          )) || getRandom(allSauces);

          return buildRecipe({
            template: 'bowl',
            proteins: protein ? [protein.id] : [],
            carbs: [carb.id],
            vegetables: [], // Kein Gemüse beim Frühstück
            sauce: sauce.id,
            toppings: ['sesame_seeds', 'fresh_herbs'],
            cookingMethod: 'boiled',
            phase: phaseKey
          });
        } 
        
        else if (mealType === 'snack') {
          // Snack: Klein und einfach
          const snackType = Math.random();
          
          if (snackType < 0.5) {
            // Carb-basiert (z.B. Obst)
            const carb = getRandom(phaseCarbs);
            return buildRecipe({
              template: 'bowl',
              proteins: [],
              carbs: [carb.id],
              vegetables: [],
              sauce: null,
              toppings: ['nuts'],
              cookingMethod: 'raw',
              phase: phaseKey
            });
          } else {
            // Protein-basiert (z.B. Joghurt)
            const protein = getRandom(phaseProteins.filter(p => 
              ['eggs', 'tofu'].includes(p.id)
            )) || getRandom(phaseProteins);
            return buildRecipe({
              template: 'bowl',
              proteins: [protein.id],
              carbs: [],
              vegetables: [],
              sauce: null,
              toppings: ['fresh_herbs'],
              cookingMethod: 'raw',
              phase: phaseKey
            });
          }
        } 
        
        else {
          // Lunch/Dinner: Vollwertige Mahlzeit
          const protein = getRandom(phaseProteins);
          const carb = getRandom(phaseCarbs);
          const veggie1 = getRandom(phaseVeggies);
          const veggie2 = getRandom(phaseVeggies.filter(v => v.id !== veggie1.id));
          const sauce = getRandom(allSauces);

          const cookingMethods = protein.cookingMethods;
          const method = getRandom(cookingMethods);

          return buildRecipe({
            template: mealType === 'lunch' ? 'bowl' : 'plate',
            proteins: [protein.id],
            carbs: [carb.id],
            vegetables: [veggie1.id, veggie2?.id].filter(Boolean),
            sauce: sauce.id,
            toppings: ['sesame_seeds'],
            cookingMethod: method,
            phase: phaseKey
          });
        }
      };

      // Generate 7 days
      const baseDays = WEEKDAYS.map((dayName) => {
        const meals = {};

        ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
          const recipe = generateMealByType(mealType);

          meals[mealType] = {
            id: recipe.id,
            name: recipe.title,
            calories: recipe.calories,
            time: `${recipe.readyInMinutes} min`,
            ingredients: recipe.ingredients.slice(0, 5),
            image: recipe.image,
            fullRecipe: recipe // Store full recipe for customization
          };
        });

        return {
          day: dayName,
          meals
        };
      });

      // Sortiere basierend auf startDay
      const sortedDays = [
        ...baseDays.slice(startDay),
        ...baseDays.slice(0, startDay)
      ];

      setMealPlan({ days: sortedDays });
      setStep('generated');
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert('Fehler beim Erstellen des Meal Plans');
    } finally {
      setLoading(false);
    }
  };

  const swapMeal = async (dayIndex, mealType) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const alternatives = {
        breakfast: [
          { name: 'Griechischer Joghurt mit Honig', calories: 340, time: '5 min' },
          { name: 'Veganes Müsli mit Früchten', calories: 360, time: '8 min' },
          { name: 'Rührei mit Vollkorntoast', calories: 370, time: '12 min' },
          { name: 'Acai Bowl', calories: 330, time: '10 min' },
          { name: 'Bagel mit Frischkäse', calories: 380, time: '5 min' }
        ],
        lunch: [
          { name: 'Thunfisch Salat', calories: 410, time: '15 min' },
          { name: 'Gemüse Couscous', calories: 430, time: '20 min' },
          { name: 'Chicken Caesar Wrap', calories: 460, time: '18 min' },
          { name: 'Tomaten-Mozzarella Sandwich', calories: 390, time: '10 min' },
          { name: 'Linsen-Dal', calories: 440, time: '25 min' }
        ],
        dinner: [
          { name: 'Gegrillter Fisch mit Reis', calories: 490, time: '30 min' },
          { name: 'Vegetarische Lasagne', calories: 510, time: '45 min' },
          { name: 'Hähnchenbrust mit Brokkoli', calories: 480, time: '28 min' },
          { name: 'Ramen Bowl', calories: 520, time: '35 min' },
          { name: 'Shakshuka', calories: 450, time: '25 min' }
        ],
        snack: [
          { name: 'Bananen-Erdnussbutter', calories: 190, time: '2 min' },
          { name: 'Protein Riegel', calories: 180, time: '1 min' },
          { name: 'Reiswaffeln mit Avocado', calories: 150, time: '5 min' },
          { name: 'Gemüse-Sticks mit Dip', calories: 130, time: '8 min' },
          { name: 'Quark mit Beeren', calories: 170, time: '3 min' }
        ]
      };

      const options = alternatives[mealType] || alternatives.lunch;
      const randomMeal = options[Math.floor(Math.random() * options.length)];

      const updatedPlan = { ...mealPlan };
      updatedPlan.days[dayIndex].meals[mealType] = randomMeal;
      setMealPlan(updatedPlan);
    } catch (error) {
      console.error('Error swapping meal:', error);
      alert('Fehler beim Austauschen des Rezepts');
    } finally {
      setLoading(false);
    }
  };

  const swapMealFromFavorites = (favorite) => {
    if (!selectedMealForSwap) return;
    
    const { dayIndex, mealType } = selectedMealForSwap;
    const updatedPlan = { ...mealPlan };
    
    const newMeal = {
      name: favorite.title,
      calories: favorite.calories || 400,
      time: favorite.readyInMinutes ? `${favorite.readyInMinutes} min` : '30 min'
    };
    
    updatedPlan.days[dayIndex].meals[mealType] = newMeal;
    setMealPlan(updatedPlan);
    setShowFavoritesOverlay(false);
    setSelectedMealForSwap(null);
  };

  const saveMealPlan = () => {
    const planName = prompt('Name für deinen Meal Plan:', `Meal Plan ${new Date().toLocaleDateString('de-DE')}`);
    
    if (!planName) return; // Abbruch wenn Cancel gedrückt
    
    const savedPlans = JSON.parse(localStorage.getItem('mealPlans') || '[]');
    const newPlan = {
      id: Date.now(),
      name: planName,
      plan: mealPlan,
      createdAt: new Date().toISOString(),
      preferences,
      startDay: WEEKDAYS[startDay]
    };
    savedPlans.push(newPlan);
    localStorage.setItem('mealPlans', JSON.stringify(savedPlans));
    alert(`✅ "${planName}" gespeichert!`);
    if (onSave) onSave(newPlan);
  };

  const getMealTypeLabel = (type) => {
    const labels = {
      breakfast: '🌅 Frühstück',
      lunch: '☀️ Mittag',
      dinner: '🌙 Abendessen',
      snack: '🍎 Snack'
    };
    return labels[type] || type;
  };

  const getMealTypeIcon = (type) => {
    const icons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
    return icons[type] || '🍽️';
  };

  const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
  };

  // PREFERENCES STEP
  if (step === 'preferences') {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '20px',
        padding: '32px 24px',
        backdropFilter: 'blur(10px)',
        marginBottom: '20px'
      }}>
        <h3 style={{
          color: COLORS.text,
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          📅 Meal Plan Generator
        </h3>

        {/* Diet */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            color: COLORS.text,
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            display: 'block'
          }}>
            Ernährungsweise
          </label>
          <select
            value={preferences.diet}
            onChange={(e) => setPreferences({ ...preferences, diet: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.1)',
              fontSize: '14px',
              background: 'white'
            }}
          >
            {dietOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Intolerances */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            color: COLORS.text,
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            display: 'block'
          }}>
            Unverträglichkeiten
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {intoleranceOptions.map(item => (
              <button
                key={item}
                onClick={() => {
                  const newIntolerances = preferences.intolerances.includes(item)
                    ? preferences.intolerances.filter(i => i !== item)
                    : [...preferences.intolerances, item];
                  setPreferences({ ...preferences, intolerances: newIntolerances });
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: preferences.intolerances.includes(item) ? COLORS.primary : 'rgba(0,0,0,0.2)',
                  background: preferences.intolerances.includes(item) ? COLORS.primary : 'white',
                  color: preferences.intolerances.includes(item) ? 'white' : COLORS.text,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            color: COLORS.text,
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            display: 'block'
          }}>
            Vorlieben
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {preferenceOptions.map(item => (
              <button
                key={item}
                onClick={() => {
                  const newPrefs = preferences.preferences.includes(item)
                    ? preferences.preferences.filter(p => p !== item)
                    : [...preferences.preferences, item];
                  setPreferences({ ...preferences, preferences: newPrefs });
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: preferences.preferences.includes(item) ? COLORS.primary : 'rgba(0,0,0,0.2)',
                  background: preferences.preferences.includes(item) ? COLORS.primary : 'white',
                  color: preferences.preferences.includes(item) ? 'white' : COLORS.text,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setStep('select-day')}
          style={{
            width: '100%',
            padding: '16px',
            background: COLORS.primary,
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Weiter →
        </button>
      </div>
    );
  }

  // SELECT START DAY STEP
  if (step === 'select-day') {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '20px',
        padding: '32px 24px',
        backdropFilter: 'blur(10px)',
        marginBottom: '20px'
      }}>
        <h3 style={{
          color: COLORS.text,
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          🗓️ Wann möchtest du starten?
        </h3>
        <p style={{
          color: COLORS.textLight,
          fontSize: '14px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          Wähle den ersten Tag deines Meal Plans
        </p>

        <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
          {WEEKDAYS.map((day, index) => (
            <button
              key={day}
              onClick={() => setStartDay(index)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid',
                borderColor: startDay === index ? COLORS.primary : 'rgba(0,0,0,0.1)',
                background: startDay === index ? 'rgba(232, 168, 136, 0.1)' : 'white',
                color: COLORS.text,
                fontSize: '16px',
                fontWeight: startDay === index ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{day}</span>
              {startDay === index && <Check size={20} color={COLORS.primary} />}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setStep('preferences')}
            style={{
              flex: 1,
              padding: '16px',
              background: 'white',
              border: '1px solid rgba(0,0,0,0.2)',
              borderRadius: '12px',
              color: COLORS.text,
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ← Zurück
          </button>
          <button
            onClick={generateMealPlan}
            disabled={loading}
            style={{
              flex: 2,
              padding: '16px',
              background: loading ? '#ccc' : COLORS.primary,
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? '⏳ Erstelle Plan...' : '✨ Plan erstellen'}
          </button>
        </div>
      </div>
    );
  }

  // GENERATED PLAN VIEW
  if (step === 'generated' && mealPlan) {
    return (
      <div style={{ position: 'relative' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          padding: '24px',
          backdropFilter: 'blur(10px)',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{
              color: COLORS.text,
              fontSize: '22px',
              fontWeight: '700',
              marginBottom: '4px'
            }}>
              Dein 7-Tage Meal Plan
            </h3>
            <p style={{
              color: COLORS.textLight,
              fontSize: '13px',
              margin: 0
            }}>
              Start: {WEEKDAYS[startDay]}
            </p>
          </div>
          <button
            onClick={saveMealPlan}
            style={{
              padding: '12px 20px',
              background: COLORS.primary,
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Save size={16} />
            Speichern
          </button>
        </div>

        {/* Days */}
        {mealPlan.days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              marginBottom: '16px'
            }}
          >
            <h4 style={{
              color: COLORS.text,
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              Tag {dayIndex + 1}: {day.day}
            </h4>

            {/* Meals */}
            {Object.entries(day.meals).map(([mealType, meal]) => (
              <div
                key={mealType}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    color: COLORS.textLight,
                    fontSize: '12px',
                    marginBottom: '4px'
                  }}>
                    {getMealTypeLabel(mealType)}
                  </div>
                  <div style={{
                    color: COLORS.text,
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    {meal.name}
                  </div>
                  <div style={{
                    color: COLORS.textLight,
                    fontSize: '13px'
                  }}>
                    {meal.calories} kcal • {meal.time}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setSelectedRecipeForInfo(meal);
                      setShowRecipeDetailModal(true);
                    }}
                    style={{
                      padding: '8px',
                      background: 'rgba(232, 168, 136, 0.1)',
                      border: '1px solid rgba(232, 168, 136, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Rezept anzeigen"
                  >
                    <Info size={18} color={COLORS.primary} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedRecipeForInfo(meal);
                      setSelectedMealForSwap({ dayIndex, mealType, day: WEEKDAYS[dayIndex] });
                      setShowComponentBuilder(true);
                    }}
                    style={{
                      padding: '8px',
                      background: 'rgba(138, 43, 226, 0.1)',
                      border: '1px solid rgba(138, 43, 226, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Rezept anpassen"
                  >
                    <Wrench size={18} color="#8A2BE2" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedMealForSwap({ dayIndex, mealType });
                      setShowFavoritesOverlay(true);
                    }}
                    style={{
                      padding: '8px',
                      background: 'rgba(232, 168, 136, 0.1)',
                      border: '1px solid rgba(232, 168, 136, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Aus Favoriten wählen"
                  >
                    <Heart size={18} color={COLORS.primary} />
                  </button>

                  <button
                    onClick={() => swapMeal(dayIndex, mealType)}
                    disabled={loading}
                    style={{
                      padding: '8px',
                      background: 'rgba(232, 168, 136, 0.1)',
                      border: '1px solid rgba(232, 168, 136, 0.3)',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Zufällig tauschen"
                  >
                    <RefreshCw size={18} color={COLORS.primary} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* FAVORITES OVERLAY */}
        {showFavoritesOverlay && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative'
            }}>
              <button
                onClick={() => {
                  setShowFavoritesOverlay(false);
                  setSelectedMealForSwap(null);
                }}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0,0,0,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <h3 style={{
                color: COLORS.text,
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '16px'
              }}>
                💖 Aus Favoriten wählen
              </h3>

              {getFavorites().length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: COLORS.textLight
                }}>
                  <Heart size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                  <p>Noch keine Favoriten gespeichert</p>
                  <p style={{ fontSize: '13px' }}>Swipe Rezepte nach rechts um sie zu favorisieren!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {getFavorites().map((fav, index) => (
                    <button
                      key={index}
                      onClick={() => swapMealFromFavorites(fav)}
                      style={{
                        padding: '16px',
                        background: 'rgba(232, 168, 136, 0.05)',
                        border: '1px solid rgba(232, 168, 136, 0.2)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(232, 168, 136, 0.1)';
                        e.currentTarget.style.borderColor = COLORS.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(232, 168, 136, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(232, 168, 136, 0.2)';
                      }}
                    >
                      <div style={{
                        color: COLORS.text,
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}>
                        {fav.title}
                      </div>
                      <div style={{
                        color: COLORS.textLight,
                        fontSize: '13px'
                      }}>
                        {fav.readyInMinutes} min
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RECIPE DETAIL MODAL */}
        {showRecipeDetailModal && selectedRecipeForInfo && (
          <RecipeDetailModal
            recipe={selectedRecipeForInfo.fullRecipe || selectedRecipeForInfo}
            onClose={() => {
              setShowRecipeDetailModal(false);
              setSelectedRecipeForInfo(null);
            }}
          />
        )}

        {/* COMPONENT BUILDER MODAL */}
        {showComponentBuilder && selectedRecipeForInfo && (
          <ComponentBuilder
            initialRecipe={selectedRecipeForInfo.fullRecipe || selectedRecipeForInfo}
            onSave={(customizedRecipe) => {
              console.log('✅ Recipe customized:', customizedRecipe);
              // Update meal plan with customized recipe
              if (selectedMealForSwap) {
                const updatedDays = [...mealPlan.days];
                const dayIndex = updatedDays.findIndex(d => d.day === selectedMealForSwap.day);
                if (dayIndex !== -1) {
                  updatedDays[dayIndex].meals[selectedMealForSwap.mealType] = {
                    id: customizedRecipe.id,
                    name: customizedRecipe.title,
                    calories: customizedRecipe.calories,
                    time: `${customizedRecipe.readyInMinutes} min`,
                    ingredients: customizedRecipe.ingredients.slice(0, 5),
                    image: customizedRecipe.image,
                    fullRecipe: customizedRecipe
                  };
                  setMealPlan({ ...mealPlan, days: updatedDays });
                }
              }
              setShowComponentBuilder(false);
              setSelectedRecipeForInfo(null);
              setSelectedMealForSwap(null);
            }}
            onClose={() => {
              setShowComponentBuilder(false);
              setSelectedRecipeForInfo(null);
              setSelectedMealForSwap(null);
            }}
          />
        )}
      </div>
    );
  }

  return null;
};

export default MealPlanGenerator;