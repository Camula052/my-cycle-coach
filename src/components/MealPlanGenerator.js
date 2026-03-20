import React, { useState } from 'react';
import { RefreshCw, Save, Shuffle, Calendar, Check } from 'lucide-react';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096',
  background: '#FAF5F0',
  primary: '#E8A888'
};

const WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const MealPlanGenerator = ({ onSave, userData }) => {
  const [step, setStep] = useState('preferences'); // preferences, select-day, generated
  const [preferences, setPreferences] = useState({
    diet: '', // vegan, vegetarian, pescetarian, none
    intolerances: [], // dairy, gluten, nuts, soy, eggs
    preferences: [], // vollkorn, bio, regional, schnell
    excludeIngredients: ''
  });
  const [startDay, setStartDay] = useState(0); // 0 = Montag
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);

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
      // Claude API Call
      const prompt = `Erstelle einen 7-Tage Meal Plan mit folgenden Präferenzen:

Ernährungsweise: ${preferences.diet || 'Keine'}
Unverträglichkeiten: ${preferences.intolerances.join(', ') || 'Keine'}
Vorlieben: ${preferences.preferences.join(', ') || 'Keine'}
Ausgeschlossene Zutaten: ${preferences.excludeIngredients || 'Keine'}

Der Plan soll für jede Tag enthalten:
- Frühstück
- Mittagessen  
- Abendessen
- Ein Snack

Berücksichtige die Zyklusphase (${userData?.currentPhase || 'Follikelphase'}) und gebe phasengerechte Nährstoffempfehlungen.

Formatiere die Antwort als JSON:
{
  "days": [
    {
      "day": "Montag",
      "meals": {
        "breakfast": { "name": "...", "calories": 400, "time": "15 min" },
        "lunch": { "name": "...", "calories": 600, "time": "25 min" },
        "dinner": { "name": "...", "calories": 500, "time": "30 min" },
        "snack": { "name": "...", "calories": 150, "time": "5 min" }
      }
    }
  ]
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [
            { 
              role: "user", 
              content: prompt
            }
          ],
        })
      });

      const data = await response.json();
      const responseText = data.content.find(c => c.type === 'text')?.text || '';
      
      // Parse JSON aus Response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const plan = JSON.parse(jsonMatch[0]);
        setMealPlan(plan);
        setStep('generated');
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert('Fehler beim Erstellen des Meal Plans');
    } finally {
      setLoading(false);
    }
  };

  const swapMeal = async (dayIndex, mealType) => {
    // Einzelnes Meal neu generieren
    setLoading(true);
    
    try {
      const currentMeal = mealPlan.days[dayIndex].meals[mealType];
      const prompt = `Generiere ein alternatives ${mealType} Rezept mit ähnlichen Nährwerten wie: ${currentMeal.name} (${currentMeal.calories} kcal).

Präferenzen:
${preferences.diet ? `Ernährung: ${preferences.diet}` : ''}
${preferences.intolerances.length > 0 ? `Keine: ${preferences.intolerances.join(', ')}` : ''}

Antworte NUR mit JSON:
{
  "name": "Rezeptname",
  "calories": 400,
  "time": "20 min"
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        })
      });

      const data = await response.json();
      const responseText = data.content.find(c => c.type === 'text')?.text || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const newMeal = JSON.parse(jsonMatch[0]);
        const updatedPlan = { ...mealPlan };
        updatedPlan.days[dayIndex].meals[mealType] = newMeal;
        setMealPlan(updatedPlan);
      }
    } catch (error) {
      console.error('Error swapping meal:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMealPlan = () => {
    const savedPlans = JSON.parse(localStorage.getItem('mealPlans') || '[]');
    const newPlan = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      startDay: WEEKDAYS[startDay],
      plan: mealPlan,
      preferences
    };
    savedPlans.push(newPlan);
    localStorage.setItem('mealPlans', JSON.stringify(savedPlans));
    
    if (onSave) onSave(newPlan);
    alert('Meal Plan gespeichert!');
  };

  // Step 1: Preferences
  if (step === 'preferences') {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{
          color: COLORS.text,
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '8px'
        }}>
          Meal Plan Erstellen
        </h2>
        <p style={{
          color: COLORS.textLight,
          fontSize: '14px',
          marginBottom: '32px'
        }}>
          Beantworte ein paar Fragen für personalisierte Rezepte
        </p>

        {/* Ernährungsweise */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            color: COLORS.text,
            fontSize: '16px',
            fontWeight: '600',
            display: 'block',
            marginBottom: '12px'
          }}>
            Ernährungsweise
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {dietOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setPreferences({ ...preferences, diet: option.value })}
                style={{
                  padding: '10px 16px',
                  background: preferences.diet === option.value ? COLORS.primary : 'white',
                  border: `2px solid ${preferences.diet === option.value ? COLORS.primary : '#E0E0E0'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: preferences.diet === option.value ? 'white' : COLORS.text,
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Unverträglichkeiten */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            color: COLORS.text,
            fontSize: '16px',
            fontWeight: '600',
            display: 'block',
            marginBottom: '12px'
          }}>
            Unverträglichkeiten
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {intoleranceOptions.map(intolerance => (
              <button
                key={intolerance}
                onClick={() => {
                  const updated = preferences.intolerances.includes(intolerance)
                    ? preferences.intolerances.filter(i => i !== intolerance)
                    : [...preferences.intolerances, intolerance];
                  setPreferences({ ...preferences, intolerances: updated });
                }}
                style={{
                  padding: '10px 16px',
                  background: preferences.intolerances.includes(intolerance) ? COLORS.primary : 'white',
                  border: `2px solid ${preferences.intolerances.includes(intolerance) ? COLORS.primary : '#E0E0E0'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: preferences.intolerances.includes(intolerance) ? 'white' : COLORS.text,
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                {intolerance}
              </button>
            ))}
          </div>
        </div>

        {/* Vorlieben */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            color: COLORS.text,
            fontSize: '16px',
            fontWeight: '600',
            display: 'block',
            marginBottom: '12px'
          }}>
            Vorlieben
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {preferenceOptions.map(pref => (
              <button
                key={pref}
                onClick={() => {
                  const updated = preferences.preferences.includes(pref)
                    ? preferences.preferences.filter(p => p !== pref)
                    : [...preferences.preferences, pref];
                  setPreferences({ ...preferences, preferences: updated });
                }}
                style={{
                  padding: '10px 16px',
                  background: preferences.preferences.includes(pref) ? COLORS.primary : 'white',
                  border: `2px solid ${preferences.preferences.includes(pref) ? COLORS.primary : '#E0E0E0'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: preferences.preferences.includes(pref) ? 'white' : COLORS.text,
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* Ausgeschlossene Zutaten */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            color: COLORS.text,
            fontSize: '16px',
            fontWeight: '600',
            display: 'block',
            marginBottom: '8px'
          }}>
            Zutaten ausschließen (optional)
          </label>
          <input
            type="text"
            placeholder="z.B. Tofu, Pilze, Rosenkohl"
            value={preferences.excludeIngredients}
            onChange={(e) => setPreferences({ ...preferences, excludeIngredients: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '2px solid #E0E0E0',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setPreferences({
              diet: '',
              intolerances: [],
              preferences: [],
              excludeIngredients: ''
            })}
            style={{
              flex: 1,
              padding: '14px',
              background: 'white',
              border: '2px solid #E0E0E0',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              color: COLORS.text
            }}
          >
            Überspringen
          </button>
          <button
            onClick={() => setStep('select-day')}
            style={{
              flex: 1,
              padding: '14px',
              background: COLORS.primary,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              color: 'white'
            }}
          >
            Weiter
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Select Start Day
  if (step === 'select-day') {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{
          color: COLORS.text,
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '8px'
        }}>
          Wann möchtest du starten?
        </h2>
        <p style={{
          color: COLORS.textLight,
          fontSize: '14px',
          marginBottom: '32px'
        }}>
          Wähle den ersten Tag deines Meal Plans
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '32px' }}>
          {WEEKDAYS.map((day, index) => (
            <button
              key={day}
              onClick={() => setStartDay(index)}
              style={{
                padding: '16px',
                background: startDay === index ? COLORS.primary : 'white',
                border: `2px solid ${startDay === index ? COLORS.primary : '#E0E0E0'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                color: startDay === index ? 'white' : COLORS.text,
                fontWeight: '600',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <span>{day}</span>
              {startDay === index && <Check size={20} />}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setStep('preferences')}
            style={{
              flex: 1,
              padding: '14px',
              background: 'white',
              border: '2px solid #E0E0E0',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              color: COLORS.text
            }}
          >
            Zurück
          </button>
          <button
            onClick={generateMealPlan}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              background: loading ? '#CCC' : COLORS.primary,
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={20} className="spin" />
                Erstelle...
              </>
            ) : (
              <>
                <Calendar size={20} />
                Plan erstellen
              </>
            )}
          </button>
        </div>

        <style>{`
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Step 3: Generated Plan
  if (step === 'generated' && mealPlan) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            color: COLORS.text,
            fontSize: '28px',
            fontWeight: '700',
            margin: 0
          }}>
            Dein Meal Plan
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={generateMealPlan}
              disabled={loading}
              style={{
                padding: '10px 16px',
                background: 'white',
                border: '2px solid #E0E0E0',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                color: COLORS.text
              }}
            >
              <RefreshCw size={18} />
              Neu generieren
            </button>
            <button
              onClick={saveMealPlan}
              style={{
                padding: '10px 16px',
                background: COLORS.primary,
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                color: 'white'
              }}
            >
              <Save size={18} />
              Speichern
            </button>
          </div>
        </div>

        {/* Days */}
        {mealPlan.days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <h3 style={{
              color: COLORS.text,
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              {day.day}
            </h3>

            <div style={{ display: 'grid', gap: '12px' }}>
              {Object.entries(day.meals).map(([mealType, meal]) => (
                <div
                  key={mealType}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: '#F9F9F9',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: COLORS.textLight,
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      marginBottom: '4px'
                    }}>
                      {mealType === 'breakfast' ? 'Frühstück' :
                       mealType === 'lunch' ? 'Mittagessen' :
                       mealType === 'dinner' ? 'Abendessen' : 'Snack'}
                    </div>
                    <div style={{
                      color: COLORS.text,
                      fontSize: '15px',
                      fontWeight: '600'
                    }}>
                      {meal.name}
                    </div>
                    <div style={{
                      color: COLORS.textLight,
                      fontSize: '13px',
                      marginTop: '4px'
                    }}>
                      {meal.calories} kcal • {meal.time}
                    </div>
                  </div>
                  <button
                    onClick={() => swapMeal(dayIndex, mealType)}
                    disabled={loading}
                    style={{
                      padding: '8px',
                      background: 'white',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Shuffle size={18} color={COLORS.textLight} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default MealPlanGenerator;
