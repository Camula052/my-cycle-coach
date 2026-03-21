import React, { useState } from 'react';
import { RefreshCw, Save, Calendar, Check, Heart, Info, X } from 'lucide-react';
import { searchRecipes } from '../services/spoonacularService';
import RecipeDetailModal from './RecipeDetailModal';

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
  const [showRecipeInfoOverlay, setShowRecipeInfoOverlay] = useState(false);
  const [showRecipeDetailModal, setShowRecipeDetailModal] = useState(false);
  const [selectedMealForSwap, setSelectedMealForSwap] = useState(null);
  const [selectedRecipeForInfo, setSelectedRecipeForInfo] = useState(null);
  const [selectedRecipeIdForDetail, setSelectedRecipeIdForDetail] = useState(null);

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

  const generateMealPlan = async () => {
    setLoading(true);
    
    try {
      const phaseKey = userData?.currentPhase?.key || 'follicular';
      
      console.log('🔍 Generating meal plan for phase:', phaseKey);
      console.log('🔍 Preferences:', preferences);
      
      // Einfachere Keywords die mehr Results liefern
      const phaseKeywords = {
        menstruation: 'healthy',
        follicular: 'protein',
        ovulation: 'salad',
        luteal: 'comfort food'
      };

      const keyword = phaseKeywords[phaseKey] || '';
      
      console.log('🔍 Searching with keyword:', keyword);

      // Lade Rezepte für jeden Meal Type
      console.log('📡 Fetching breakfast recipes...');
      const breakfastRecipes = await searchRecipes({
        query: keyword,
        type: 'breakfast',
        diet: preferences.diet || '',
        number: 10
      });
      console.log('✅ Breakfast recipes:', breakfastRecipes);

      console.log('📡 Fetching lunch recipes...');
      const lunchRecipes = await searchRecipes({
        query: keyword,
        type: 'main course',
        diet: preferences.diet || '',
        number: 10
      });
      console.log('✅ Lunch recipes:', lunchRecipes);

      console.log('📡 Fetching dinner recipes...');
      const dinnerRecipes = await searchRecipes({
        query: keyword,
        type: 'main course',
        diet: preferences.diet || '',
        number: 10
      });
      console.log('✅ Dinner recipes:', dinnerRecipes);

      console.log('📡 Fetching snack recipes...');
      const snackRecipes = await searchRecipes({
        query: '',  // Keine Query für Snacks = mehr Ergebnisse
        type: 'snack',
        diet: preferences.diet || '',
        number: 10
      });
      console.log('✅ Snack recipes:', snackRecipes);

      // Mock Fallback wenn API keine Results liefert
      const mockMeals = {
        menstruation: {
          breakfast: { name: 'Haferbrei mit Zimt und Beeren', calories: 360, time: '10 min', ingredients: ['Haferflocken', 'Mandelmilch', 'Zimt', 'Beeren', 'Honig'] },
          lunch: { name: 'Linsensuppe mit Ingwer', calories: 420, time: '25 min', ingredients: ['Rote Linsen', 'Ingwer', 'Zwiebeln', 'Gemüsebrühe', 'Kokosmilch'] },
          dinner: { name: 'Lachs mit dunklem Blattgemüse', calories: 520, time: '30 min', ingredients: ['Lachs', 'Grünkohl', 'Knoblauch', 'Zitrone', 'Olivenöl'] },
          snack: { name: 'Dunkle Schokolade mit Mandeln', calories: 180, time: '1 min', ingredients: ['Dunkle Schokolade', 'Mandeln'] }
        },
        follicular: {
          breakfast: { name: 'Protein Pancakes', calories: 380, time: '15 min', ingredients: ['Proteinpulver', 'Eier', 'Banane', 'Beeren'] },
          lunch: { name: 'Buddha Bowl mit Quinoa', calories: 450, time: '25 min', ingredients: ['Quinoa', 'Kichererbsen', 'Avocado', 'Rotkohl'] },
          dinner: { name: 'Hähnchen mit Süßkartoffeln', calories: 520, time: '35 min', ingredients: ['Hähnchen', 'Süßkartoffeln', 'Brokkoli'] },
          snack: { name: 'Protein Shake', calories: 200, time: '3 min', ingredients: ['Proteinpulver', 'Banane', 'Mandelmilch'] }
        },
        ovulation: {
          breakfast: { name: 'Smoothie Bowl', calories: 340, time: '10 min', ingredients: ['Beeren', 'Banane', 'Leinsamen', 'Granola'] },
          lunch: { name: 'Salat mit Lachs', calories: 460, time: '20 min', ingredients: ['Lachs', 'Spinat', 'Walnüsse', 'Balsamico'] },
          dinner: { name: 'Lachs mit Brokkoli', calories: 510, time: '30 min', ingredients: ['Lachs', 'Brokkoli', 'Quinoa', 'Zitrone'] },
          snack: { name: 'Walnüsse mit Heidelbeeren', calories: 170, time: '1 min', ingredients: ['Walnüsse', 'Heidelbeeren'] }
        },
        luteal: {
          breakfast: { name: 'Vollkorn-Porridge', calories: 370, time: '12 min', ingredients: ['Haferflocken', 'Banane', 'Walnüsse', 'Zimt'] },
          lunch: { name: 'Vollkorn-Pasta', calories: 480, time: '25 min', ingredients: ['Pasta', 'Brokkoli', 'Tomaten', 'Parmesan'] },
          dinner: { name: 'Gefüllte Paprika', calories: 500, time: '40 min', ingredients: ['Paprika', 'Reis', 'Hackfleisch', 'Käse'] },
          snack: { name: 'Griechischer Joghurt', calories: 190, time: '2 min', ingredients: ['Joghurt', 'Mandeln', 'Honig'] }
        }
      };

      const phaseMocks = mockMeals[phaseKey] || mockMeals.follicular;

      // Konvertiere Spoonacular Rezepte zu unserem Format ODER nutze Mock
      const convertRecipe = (recipe, fallback) => {
        if (!recipe || !recipe.id) {
          console.log('⚠️ Using fallback recipe:', fallback.name);
          return fallback;
        }
        console.log('🔄 Converting recipe:', recipe.title);
        return {
          id: recipe.id,
          name: recipe.title,
          calories: Math.round(recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 400),
          time: `${recipe.readyInMinutes || 30} min`,
          ingredients: recipe.extendedIngredients?.slice(0, 6).map(ing => ing.name) || [],
          image: recipe.image,
          sourceUrl: recipe.sourceUrl
        };
      };

      console.log('🔄 Converting recipes to meal plan format...');
      const baseDays = WEEKDAYS.map((dayName, index) => ({
        day: dayName,
        meals: {
          breakfast: convertRecipe(
            breakfastRecipes.results[index % breakfastRecipes.results.length], 
            phaseMocks.breakfast
          ),
          lunch: convertRecipe(
            lunchRecipes.results[index % lunchRecipes.results.length], 
            phaseMocks.lunch
          ),
          dinner: convertRecipe(
            dinnerRecipes.results[index % dinnerRecipes.results.length], 
            phaseMocks.dinner
          ),
          snack: convertRecipe(
            snackRecipes.results[index % snackRecipes.results.length], 
            phaseMocks.snack
          )
        }
      }));
      console.log('✅ Base days created:', baseDays);

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
                      setSelectedRecipeForInfo({ ...meal, mealType });
                      setShowRecipeInfoOverlay(true);
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
                    title="Info anzeigen"
                  >
                    <Info size={18} color={COLORS.primary} />
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

        {/* RECIPE INFO OVERLAY */}
        {showRecipeInfoOverlay && selectedRecipeForInfo && (
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
                  setShowRecipeInfoOverlay(false);
                  setSelectedRecipeForInfo(null);
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

              <div style={{
                fontSize: '48px',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                {getMealTypeIcon(selectedRecipeForInfo.mealType)}
              </div>

              <h3 style={{
                color: COLORS.text,
                fontSize: '22px',
                fontWeight: '700',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                {selectedRecipeForInfo.name}
              </h3>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  padding: '8px 16px',
                  background: 'rgba(232, 168, 136, 0.1)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  color: COLORS.text
                }}>
                  🔥 {selectedRecipeForInfo.calories} kcal
                </div>
                <div style={{
                  padding: '8px 16px',
                  background: 'rgba(232, 168, 136, 0.1)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  color: COLORS.text
                }}>
                  ⏱️ {selectedRecipeForInfo.time}
                </div>
              </div>

              <div style={{
                background: 'rgba(232, 168, 136, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <h4 style={{
                  color: COLORS.text,
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  🥘 Zutaten
                </h4>
                {selectedRecipeForInfo.ingredients && selectedRecipeForInfo.ingredients.length > 0 ? (
                  <ul style={{
                    margin: 0,
                    paddingLeft: '20px',
                    color: COLORS.text,
                    fontSize: '14px',
                    lineHeight: '1.8'
                  }}>
                    {selectedRecipeForInfo.ingredients.map((ingredient, idx) => (
                      <li key={idx}>{ingredient}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{
                    color: COLORS.textLight,
                    fontSize: '14px',
                    margin: 0
                  }}>
                    Keine Zutatenliste verfügbar
                  </p>
                )}
              </div>

              <div style={{
                background: 'rgba(232, 168, 136, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <h4 style={{
                  color: COLORS.text,
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  ℹ️ Hinweis
                </h4>
                <p style={{
                  color: COLORS.textLight,
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Dies ist ein phasengerechter Vorschlag. Detaillierte Zubereitungsschritte findest du im Rezepte-Browser.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowRecipeInfoOverlay(false);
                  setSelectedRecipeForInfo(null);
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: COLORS.primary,
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: selectedRecipeForInfo.id ? '12px' : '0'
                }}
              >
                Verstanden
              </button>

              {selectedRecipeForInfo.id && (
                <button
                  onClick={() => {
                    console.log('🔗 Rezept öffnen clicked!');
                    console.log('Recipe ID:', selectedRecipeForInfo.id);
                    setShowRecipeInfoOverlay(false);
                    setSelectedRecipeIdForDetail(selectedRecipeForInfo.id);
                    setShowRecipeDetailModal(true);
                    console.log('State updated - should show modal now');
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'white',
                    border: `2px solid ${COLORS.primary}`,
                    borderRadius: '12px',
                    color: COLORS.primary,
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🔗 Rezept öffnen
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* RECIPE DETAIL MODAL */}
        {showRecipeDetailModal && selectedRecipeIdForDetail && (
          <RecipeDetailModal
            recipeId={selectedRecipeIdForDetail}
            onClose={() => {
              setShowRecipeDetailModal(false);
              setSelectedRecipeIdForDetail(null);
            }}
          />
        )}
      </div>
    );
  }

  return null;
};

export default MealPlanGenerator;