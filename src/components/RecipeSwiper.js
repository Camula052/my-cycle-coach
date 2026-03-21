import React, { useState, useEffect } from 'react';
import { Heart, X, RefreshCw, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { getRecipesByCategory, formatRecipe } from '../services/spoonacularService';
import RecipeDetailModal from './RecipeDetailModal';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096',
  background: '#FAF5F0',
  primary: '#E8A888'
};

const RecipeSwiper = ({ 
  category = 'breakfast', // breakfast, lunch, dinner, snack
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
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [offset, setOffset] = useState(0);

  // Mock Daten für Demo (später mit Spoonacular API ersetzen)
  const mockRecipes = {
    breakfast: [
      {
        id: 1,
        title: 'Overnight Oats mit Beeren',
        image: 'https://images.unsplash.com/photo-1590137876181-8b7d4c46c5f2?w=400',
        readyInMinutes: 10,
        servings: 2,
        tags: ['süß', 'vegan', 'schnell'],
        summary: 'Gesunde Overnight Oats vollgepackt mit Antioxidantien aus frischen Beeren.'
      },
      {
        id: 2,
        title: 'Avocado Toast mit Ei',
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
        readyInMinutes: 15,
        servings: 1,
        tags: ['herzhaft', 'protein', 'vegetarisch'],
        summary: 'Klassisches Avocado Toast mit perfekt pochiertem Ei.'
      },
      {
        id: 3,
        title: 'Protein Pancakes',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
        readyInMinutes: 20,
        servings: 2,
        tags: ['süß', 'protein', 'vegetarisch'],
        summary: 'Fluffige Pancakes mit extra Protein - perfekt nach dem Sport.'
      }
    ],
    lunch: [
      {
        id: 4,
        title: 'Buddha Bowl',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        readyInMinutes: 25,
        servings: 2,
        tags: ['herzhaft', 'vegan', 'gesund'],
        summary: 'Bunte Bowl mit Quinoa, geröstetem Gemüse und Tahini-Dressing.'
      }
    ],
    dinner: [
      {
        id: 5,
        title: 'Lachs mit Spargel',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
        readyInMinutes: 30,
        servings: 2,
        tags: ['herzhaft', 'pescetarisch', 'protein'],
        summary: 'Omega-3 reicher Lachs mit grünem Spargel und Zitrone.'
      }
    ],
    snack: [
      {
        id: 6,
        title: 'Energy Balls',
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400',
        readyInMinutes: 15,
        servings: 12,
        tags: ['süß', 'vegan', 'energieboost'],
        summary: 'No-bake Energy Balls aus Datteln, Nüssen und Kakao.'
      }
    ]
  };

  // Simple Translation via Google Translate (kostenlos)
  const translateRecipe = async () => {
    if (isTranslated) {
      // Toggle zurück zu Original
      setIsTranslated(false);
      setTranslatedTitle('');
      setTranslatedSummary('');
      return;
    }

    setTranslating(true);
    try {
      const currentRecipe = recipes[currentIndex];
      
      // Nutze Google Translate API (kostenlos via MyMemory API)
      const translateText = async (text) => {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|de`
        );
        const data = await response.json();
        return data.responseData.translatedText;
      };

      const title = await translateText(currentRecipe.title);
      const summary = await translateText(currentRecipe.summary);

      setTranslatedTitle(title);
      setTranslatedSummary(summary);
      setIsTranslated(true);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Übersetzung fehlgeschlagen. Bitte später erneut versuchen.');
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

  useEffect(() => {
    setOffset(0); // Reset offset when category changes
    loadRecipes(0);
  }, [category]);

  const loadRecipes = async (refreshOffset = offset) => {
    setLoading(true);
    
    try {
      const typeMapping = {
        breakfast: 'breakfast',
        lunch: 'main course',
        dinner: 'main course',
        snack: 'snack'
      };

      console.log(`📡 Loading recipes with offset: ${refreshOffset}`);

      // Versuche echte API mit offset
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?` +
        `apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY || ''}` +
        `&type=${typeMapping[category] || ''}` +
        `&number=10` +
        `&offset=${refreshOffset}` +
        `&addRecipeInformation=true` +
        `&fillIngredients=true`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data?.results && data.results.length > 0) {
          const formatted = data.results.map(formatRecipe);
          setRecipes(formatted);
          setCurrentIndex(0);
          console.log(`✅ Loaded ${formatted.length} recipes`);
        } else {
          console.log('⚠️ No results, using mock data');
          loadMockRecipes();
        }
      } else {
        console.warn('API response not OK, using mock data');
        loadMockRecipes();
      }
    } catch (error) {
      console.warn('API nicht verfügbar, nutze Mock-Daten:', error);
      loadMockRecipes();
    } finally {
      setLoading(false);
    }
  };

  const refreshRecipes = () => {
    const newOffset = offset + 10;
    console.log(`🔄 Refreshing with new offset: ${newOffset}`);
    setOffset(newOffset);
    loadRecipes(newOffset);
  };

  const loadMockRecipes = () => {
    // Mock Daten als Fallback
    setRecipes(mockRecipes[category] || mockRecipes.breakfast);
    setCurrentIndex(0);
  };

  const currentRecipe = recipes[currentIndex];
  const isFavorited = favorites.includes(currentRecipe?.id);

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
        // Reload neue Rezepte
        loadRecipes();
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentRecipe) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: COLORS.textLight
      }}>
        <RefreshCw size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <p>Keine Rezepte verfügbar</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px'
    }}>
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
            if (currentRecipe.id) {
              setSelectedRecipeId(currentRecipe.id);
              setShowRecipeDetailModal(true);
            }
          }}
          style={{
            width: '100%',
            height: '300px',
            backgroundImage: `url(${currentRecipe.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            cursor: currentRecipe.id ? 'pointer' : 'default'
          }}
        >
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
            if (currentRecipe.id) {
              setSelectedRecipeId(currentRecipe.id);
              setShowRecipeDetailModal(true);
            }
          }}
          style={{
            background: 'white',
            padding: '24px',
            cursor: currentRecipe.id ? 'pointer' : 'default'
          }}
        >
          <h3 style={{
            color: COLORS.text,
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '12px',
            margin: 0
          }}>
            {isTranslated ? translatedTitle : currentRecipe.title}
          </h3>

          {/* Tags */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '16px',
            marginTop: '12px'
          }}>
            {currentRecipe.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  padding: '4px 12px',
                  background: 'rgba(232, 168, 136, 0.2)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: COLORS.text,
                  fontWeight: '500'
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <p style={{
            color: COLORS.textLight,
            fontSize: '14px',
            lineHeight: '1.6',
            margin: 0
          }}>
            {isTranslated ? translatedSummary : currentRecipe.summary}
          </p>

          {/* Translate Button */}
          <button
            onClick={translateRecipe}
            disabled={translating}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
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
            {translating ? '🔄 Übersetze...' : isTranslated ? '🇬🇧 Original' : '🇩🇪 Übersetzen'}
          </button>
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

        {/* Refresh */}
        <button
          onClick={refreshRecipes}
          disabled={loading}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '2px solid',
            borderColor: COLORS.primary,
            background: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            opacity: loading ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          }}
          title="Neue Rezepte laden"
        >
          <RefreshCw size={24} color={COLORS.primary} style={{
            animation: loading ? 'spin 1s linear infinite' : 'none'
          }} />
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
          onClick={() => setCurrentIndex(Math.min(currentIndex + 1, recipes.length - 1))}
          disabled={currentIndex === recipes.length - 1}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '2px solid #E0E0E0',
            background: 'white',
            cursor: currentIndex === recipes.length - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: currentIndex === recipes.length - 1 ? 0.3 : 1,
            transition: 'all 0.2s'
          }}
        >
          <ChevronRight size={24} color={COLORS.textLight} />
        </button>
      </div>

      {/* Progress */}
      <div style={{
        textAlign: 'center',
        marginTop: '16px',
        color: COLORS.textLight,
        fontSize: '14px'
      }}>
        {currentIndex + 1} / {recipes.length}
      </div>

      {/* Recipe Detail Modal */}
      {showRecipeDetailModal && selectedRecipeId && (
        <RecipeDetailModal
          recipeId={selectedRecipeId}
          onClose={() => {
            setShowRecipeDetailModal(false);
            setSelectedRecipeId(null);
          }}
        />
      )}

      {/* Spin Animation for Refresh */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RecipeSwiper;