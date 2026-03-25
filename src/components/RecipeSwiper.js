import React, { useState, useEffect } from 'react';
import { Heart, X, RefreshCw, Clock, Users, ChevronLeft, ChevronRight, Wrench } from 'lucide-react';
import { buildRecipe, getCustomRecipes } from '../services/recipeBuilder';
import RecipeDetailModal from './RecipeDetailModal';
import ComponentBuilder from './ComponentBuilder';
import EmojiRecipeImage from './EmojiRecipeImage';
import recipeComponents from '../services/recipeComponents';
import breakfastTemplates, { generateBreakfastRecipe } from '../services/breakfastTemplates';
import snackTemplates, { generateSnackRecipe } from '../services/snackTemplates';
import smoothieTemplates, { generateSmoothieRecipe } from '../services/smoothieTemplates';
import bowlTemplates, { generateBowlRecipe } from '../services/bowlTemplates';
import { saladTemplates, dessertTemplates, generateSaladRecipe, generateDessertRecipe } from '../services/saladDessertTemplates';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096',
  background: '#FAF5F0',
  primary: '#E8A888'
};

const RecipeSwiper = ({ 
  category = 'breakfast',
  currentPhase = { key: 'follicular' },
  preferences = {},
  onFavorite,
  favorites = []
}) => {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedSummary, setTranslatedSummary] = useState('');
  const [translating, setTranslating] = useState(false);
  const [showRecipeDetailModal, setShowRecipeDetailModal] = useState(false);
  const [showComponentBuilder, setShowComponentBuilder] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Translation via MyMemory API
  const translateRecipe = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      setTranslatedTitle('');
      setTranslatedSummary('');
      return;
    }

    setTranslating(true);
    
    try {
      const titleResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(currentRecipe.title)}&langpair=en|de`
      );
      const titleData = await titleResponse.json();
      
      const summaryResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(currentRecipe.summary)}&langpair=en|de`
      );
      const summaryData = await summaryResponse.json();
      
      setTranslatedTitle(titleData.responseData.translatedText);
      setTranslatedSummary(summaryData.responseData.translatedText);
      setIsTranslated(true);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Übersetzung fehlgeschlagen');
    } finally {
      setTranslating(false);
    }
  };

  // Reset translation when recipe changes
  useEffect(() => {
    setIsTranslated(false);
    setTranslatedTitle('');
    setTranslatedSummary('');
  }, [currentIndex]);

  // Load recipes when category or phase changes
  useEffect(() => {
    loadRecipes();
  }, [category, currentPhase.key, isCustomMode]);

  const loadRecipes = () => {
    setLoading(true);
    
    try {
      console.log('🔄 Loading recipes...');
      console.log('Category:', category);
      console.log('Phase:', currentPhase.key);
      console.log('Custom Mode:', isCustomMode);

      let generated = [];

      if (isCustomMode) {
        // Load custom recipes
        const customRecipes = getCustomRecipes();
        generated = customRecipes.filter(r => 
          r.template === category || 
          (category === 'breakfast' && r.template === 'bowl') ||
          (category === 'lunch' && ['bowl', 'salad', 'wrap'].includes(r.template)) ||
          (category === 'dinner' && ['bowl', 'plate'].includes(r.template))
        );
        console.log(`✅ Loaded ${generated.length} custom recipes`);
      } else {
        // Generate from components
        generated = generateRecipesFromComponents(category, currentPhase.key, 10);
        console.log(`✅ Generated ${generated.length} component recipes`);
      }

      setRecipes(generated);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Recipe loading error:', error);
      alert('Fehler beim Laden der Rezepte');
    } finally {
      setLoading(false);
    }
  };

  const generateRecipesFromComponents = (mealType, phase, count) => {
    const recipes = [];
    const allProteins = [...recipeComponents.proteins.animal, ...recipeComponents.proteins.plant];
    const allCarbs = recipeComponents.carbs;
    const allVeggies = recipeComponents.vegetables;
    const allSauces = recipeComponents.sauces.presets;

    // Filter by phase
    const phaseProteins = allProteins.filter(p => p.phase.includes(phase) || p.phase.includes('all'));
    const phaseCarbs = allCarbs.filter(c => c.phase.includes(phase) || c.phase.includes('all'));
    const phaseVeggies = allVeggies.filter(v => v.phase.includes(phase) || v.phase.includes('all'));

    for (let i = 0; i < count; i++) {
      let recipe;

      if (mealType === 'breakfast') {
        // FRÜHSTÜCK: 50% klassisch, 50% Smoothie
        const useSmoothie = Math.random() > 0.5;
        
        if (useSmoothie) {
          // SMOOTHIE
          const template = smoothieTemplates[Math.floor(Math.random() * smoothieTemplates.length)];
          const smoothieRecipe = generateSmoothieRecipe(template, phase);
          
          recipe = {
            ...smoothieRecipe,
            summary: `Frischer Smoothie für einen energiereichen Start`,
            image: null,
            components: {
              proteins: [],
              carbs: [],
              vegetables: [],
              sauce: null,
              toppings: [],
              cookingMethod: 'raw'
            }
          };
        } else {
          // KLASSISCHES FRÜHSTÜCK
          const template = breakfastTemplates[Math.floor(Math.random() * breakfastTemplates.length)];
          const breakfastRecipe = generateBreakfastRecipe(template, phase);
          
          recipe = {
            ...breakfastRecipe,
            summary: `Leckeres Frühstück für die ${phase}phase`,
            image: null,
            components: {
              proteins: [],
              carbs: template.base ? [template.base] : [],
              vegetables: [],
              sauce: null,
              toppings: [],
              cookingMethod: 'raw'
            }
          };
        }
      } 
      
      else if (mealType === 'snack') {
        // SNACK: Nutze echte Snack-Templates!
        const template = snackTemplates[Math.floor(Math.random() * snackTemplates.length)];
        const snackRecipe = generateSnackRecipe(template, phase);
        
        // Konvertiere zu unserem Recipe Format
        recipe = {
          ...snackRecipe,
          summary: `Leckerer Snack für zwischendurch`,
          image: null,
          components: {
            proteins: [],
            carbs: [],
            vegetables: [],
            sauce: null,
            toppings: [],
            cookingMethod: 'raw'
          }
        };
      } 
      
      else {
        // LUNCH/DINNER: Mix aus Bowls, Salads und vollwertigen Mahlzeiten
        const mealStyle = Math.random();
        
        if (mealStyle < 0.4) {
          // BOWL
          const template = bowlTemplates[Math.floor(Math.random() * bowlTemplates.length)];
          const bowlRecipe = generateBowlRecipe(template, phase);
          
          recipe = {
            ...bowlRecipe,
            summary: `Nährstoffreiche Bowl für ${mealType}`,
            image: null,
            components: {
              proteins: template.protein ? [template.protein] : [],
              carbs: template.grain ? [template.grain] : [],
              vegetables: [],
              sauce: template.sauce || null,
              toppings: [],
              cookingMethod: 'mixed'
            }
          };
        } else if (mealStyle < 0.6) {
          // SALAD
          const template = saladTemplates[Math.floor(Math.random() * saladTemplates.length)];
          const saladRecipe = generateSaladRecipe(template, phase);
          
          recipe = {
            ...saladRecipe,
            summary: `Frischer Salat perfekt für ${mealType}`,
            image: null,
            components: {
              proteins: [],
              carbs: [],
              vegetables: [],
              sauce: null,
              toppings: [],
              cookingMethod: 'raw'
            }
          };
        } else {
          // CLASSIC BUILD
          const randomProtein = phaseProteins[Math.floor(Math.random() * phaseProteins.length)];
          const randomCarb = phaseCarbs[Math.floor(Math.random() * phaseCarbs.length)];
          const randomVeggie1 = phaseVeggies[Math.floor(Math.random() * phaseVeggies.length)];
          const randomVeggie2 = phaseVeggies[Math.floor(Math.random() * phaseVeggies.length)];
          const randomSauce = allSauces[Math.floor(Math.random() * allSauces.length)];

          const cookingMethods = randomProtein.cookingMethods;
          const randomMethod = cookingMethods[Math.floor(Math.random() * cookingMethods.length)];

          recipe = buildRecipe({
            template: mealType === 'lunch' ? 'bowl' : 'plate',
            proteins: [randomProtein.id],
            carbs: [randomCarb.id],
            vegetables: [randomVeggie1.id, randomVeggie2.id],
            sauce: randomSauce.id,
            toppings: ['sesame_seeds'],
            cookingMethod: randomMethod,
            phase: phase
          });
        }
      }

      recipes.push(recipe);
    }

    return recipes;
  };

  const loadMoreRecipes = () => {
    console.log('🔄 Loading more recipes...');
    const newRecipes = generateRecipesFromComponents(category, currentPhase.key, 10);
    setRecipes([...recipes, ...newRecipes]);
    console.log(`✅ Added ${newRecipes.length} more recipes`);
  };

  const currentRecipe = recipes[currentIndex];
  const isFavorited = favorites.some(fav => fav.id === currentRecipe?.id);

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    
    if (direction === 'right' && onFavorite && currentRecipe) {
      onFavorite(currentRecipe);
    }

    setTimeout(() => {
      setSwipeDirection(null);
      if (currentIndex < recipes.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Endless: Load more recipes and continue
        loadMoreRecipes();
        setCurrentIndex(currentIndex + 1);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < recipes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Load more if at end
      loadMoreRecipes();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleCustomize = () => {
    setSelectedRecipe(currentRecipe);
    setShowComponentBuilder(true);
  };

  if (loading && recipes.length === 0) {
    return (
      <div style={{
        padding: '60px 40px',
        textAlign: 'center',
        color: COLORS.textLight
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: `4px solid ${COLORS.primary}`,
          borderTopColor: 'transparent',
          borderRadius: '50%',
          margin: '0 auto 20px',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontSize: '16px', marginBottom: '8px' }}>🎨 Erstelle Rezepte...</p>
        <p style={{ fontSize: '13px', opacity: 0.7 }}>Phasengerechte Kombinationen werden zusammengestellt</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!currentRecipe) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: COLORS.textLight
      }}>
        <RefreshCw size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <p>Keine Rezepte verfügbar</p>
        <button
          onClick={loadRecipes}
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            background: COLORS.primary,
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Neue Rezepte laden
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Custom/Generated Toggle */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        background: 'rgba(255,255,255,0.5)',
        padding: '4px',
        borderRadius: '12px'
      }}>
        <button
          onClick={() => setIsCustomMode(false)}
          style={{
            flex: 1,
            padding: '10px',
            background: !isCustomMode ? 'white' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: COLORS.text,
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: !isCustomMode ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          🎲 Zufällige Rezepte
        </button>
        <button
          onClick={() => setIsCustomMode(true)}
          style={{
            flex: 1,
            padding: '10px',
            background: isCustomMode ? 'white' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: COLORS.text,
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: isCustomMode ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          ✨ Meine Rezepte ({getCustomRecipes().length})
        </button>
      </div>

      {/* Recipe Card */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        transform: swipeDirection === 'left' ? 'translateX(-100px) rotate(-10deg)' :
                   swipeDirection === 'right' ? 'translateX(100px) rotate(10deg)' : 'none',
        opacity: swipeDirection ? 0.5 : 1,
        transition: 'all 0.3s ease'
      }}>
        {/* Image */}
        <div 
          onClick={() => {
            setSelectedRecipe(currentRecipe);
            setShowRecipeDetailModal(true);
          }}
          style={{
            width: '100%',
            height: '300px',
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          <EmojiRecipeImage recipe={currentRecipe} size="large" />

          {/* Custom Recipe Badge */}
          {currentRecipe.isCustom && (
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'rgba(138, 43, 226, 0.9)',
              backdropFilter: 'blur(10px)',
              padding: '6px 12px',
              borderRadius: '12px',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ✨ Custom Rezept
            </div>
          )}

          {/* Favorite Badge */}
          {isFavorited && (
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Heart size={24} fill="#E8A888" color="#E8A888" />
            </div>
          )}

          {/* Time & Servings */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            display: 'flex',
            gap: '12px'
          }}>
            <div style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              padding: '6px 12px',
              borderRadius: '12px',
              color: 'white',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Clock size={16} />
              {currentRecipe.readyInMinutes} min
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              padding: '6px 12px',
              borderRadius: '12px',
              color: 'white',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Users size={16} />
              {currentRecipe.servings}
            </div>
          </div>
        </div>

        {/* Content */}
        <div 
          onClick={() => {
            setSelectedRecipe(currentRecipe);
            setShowRecipeDetailModal(true);
          }}
          style={{
            background: 'white',
            padding: '24px',
            cursor: 'pointer'
          }}
        >
          {/* Title */}
          <h3 style={{
            color: COLORS.text,
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '8px',
            lineHeight: '1.3'
          }}>
            {isTranslated ? translatedTitle : currentRecipe.title}
          </h3>

          {/* Tags */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
            flexWrap: 'wrap'
          }}>
            {currentRecipe.tags?.map((tag, index) => (
              <span
                key={index}
                style={{
                  padding: '4px 12px',
                  background: 'rgba(232, 168, 136, 0.1)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: COLORS.primary,
                  fontWeight: '500'
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Summary */}
          <p style={{
            color: COLORS.textLight,
            fontSize: '14px',
            lineHeight: '1.6',
            marginBottom: '16px'
          }}>
            {isTranslated ? translatedSummary : currentRecipe.summary}
          </p>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Customize Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCustomize();
              }}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #FF6B9D, #845EF7)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Wrench size={16} />
              Anpassen
            </button>

            {/* Translate Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                translateRecipe();
              }}
              disabled={translating}
              style={{
                padding: '10px 16px',
                background: isTranslated ? '#4CAF50' : 'rgba(232, 168, 136, 0.1)',
                border: '1px solid',
                borderColor: isTranslated ? '#4CAF50' : COLORS.primary,
                borderRadius: '8px',
                color: isTranslated ? 'white' : COLORS.primary,
                fontSize: '13px',
                fontWeight: '600',
                cursor: translating ? 'not-allowed' : 'pointer',
                opacity: translating ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {translating ? '🔄' : isTranslated ? '🇬🇧' : '🇩🇪'}
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '24px',
        alignItems: 'center'
      }}>
        {/* Previous */}
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '2px solid #E0E0E0',
            background: 'white',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: currentIndex === 0 ? 0.3 : 1,
            transition: 'all 0.2s'
          }}
        >
          <ChevronLeft size={24} color={COLORS.textLight} />
        </button>

        {/* Dislike */}
        <button
          onClick={() => handleSwipe('left')}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '3px solid #FF6B6B',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(255,107,107,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = '#FF6B6B';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'white';
          }}
        >
          <X size={32} color="#FF6B6B" />
        </button>

        {/* Like */}
        <button
          onClick={() => handleSwipe('right')}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '3px solid #4ECDC4',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(78,205,196,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = '#4ECDC4';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'white';
          }}
        >
          <Heart size={32} color="#4ECDC4" />
        </button>

        {/* Next */}
        <button
          onClick={handleNext}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '2px solid #E0E0E0',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          <ChevronRight size={24} color={COLORS.textLight} />
        </button>
      </div>

      {/* Recipe Detail Modal */}
      {showRecipeDetailModal && selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => {
            setShowRecipeDetailModal(false);
            setSelectedRecipe(null);
          }}
        />
      )}

      {/* Component Builder Modal */}
      {showComponentBuilder && selectedRecipe && (
        <ComponentBuilder
          initialRecipe={selectedRecipe}
          onSave={(recipe) => {
            console.log('✅ Recipe saved:', recipe);
            setShowComponentBuilder(false);
            // Refresh if in custom mode
            if (isCustomMode) {
              loadRecipes();
            }
          }}
          onClose={() => {
            setShowComponentBuilder(false);
            setSelectedRecipe(null);
          }}
        />
      )}

      {/* Spin Animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RecipeSwiper;