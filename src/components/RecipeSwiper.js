import React, { useState, useEffect } from 'react';
import { Heart, X, RefreshCw, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { getRecipesByCategory, formatRecipe } from '../services/spoonacularService';

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

  useEffect(() => {
    loadRecipes();
  }, [category]);

  const loadRecipes = async () => {
    setLoading(true);
    
    try {
      // Versuche echte API
      const data = await getRecipesByCategory(category, 10);
      
      if (data?.results && data.results.length > 0) {
        const formatted = data.results.map(formatRecipe);
        setRecipes(formatted);
        setCurrentIndex(0);
      } else {
        // Fallback auf Mock-Daten
        loadMockRecipes();
      }
    } catch (error) {
      console.warn('API nicht verfügbar, nutze Mock-Daten:', error);
      // Fallback auf Mock-Daten
      loadMockRecipes();
    } finally {
      setLoading(false);
    }
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
        <div style={{
          width: '100%',
          height: '300px',
          backgroundImage: `url(${currentRecipe.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
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
        <div style={{
          background: 'white',
          padding: '24px'
        }}>
          <h3 style={{
            color: COLORS.text,
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '12px',
            margin: 0
          }}>
            {currentRecipe.title}
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
            {currentRecipe.summary}
          </p>
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
    </div>
  );
};

export default RecipeSwiper;
