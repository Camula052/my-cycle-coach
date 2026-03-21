import React, { useState, useEffect } from 'react';
import { X, Clock, Users, ExternalLink } from 'lucide-react';
import { getRecipeDetails } from '../services/spoonacularService';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096',
  background: '#FAF5F0',
  primary: '#E8A888'
};

const RecipeDetailModal = ({ recipeId, onClose }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!recipeId) return;
      
      setLoading(true);
      try {
        const details = await getRecipeDetails(recipeId);
        setRecipe(details);
      } catch (error) {
        console.error('Error loading recipe:', error);
        alert('Fehler beim Laden des Rezepts');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [recipeId]);

  if (!recipeId) return null;

  return (
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
      zIndex: 10000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'sticky',
            top: '16px',
            right: '16px',
            float: 'right',
            background: 'rgba(0,0,0,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={24} />
        </button>

        {loading ? (
          <div style={{
            padding: '60px 24px',
            textAlign: 'center',
            color: COLORS.textLight
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: `4px solid ${COLORS.primary}`,
              borderTopColor: 'transparent',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }} />
            <p>Lade Rezept...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : recipe ? (
          <>
            {/* Recipe Image */}
            {recipe.image && (
              <img 
                src={recipe.image} 
                alt={recipe.title}
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '20px 20px 0 0'
                }}
              />
            )}

            <div style={{ padding: '24px' }}>
              {/* Title */}
              <h2 style={{
                color: COLORS.text,
                fontSize: '26px',
                fontWeight: '700',
                marginBottom: '16px',
                lineHeight: '1.3'
              }}>
                {recipe.title}
              </h2>

              {/* Meta Info */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: 'rgba(232, 168, 136, 0.1)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  color: COLORS.text
                }}>
                  <Clock size={16} />
                  {recipe.readyInMinutes} min
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: 'rgba(232, 168, 136, 0.1)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  color: COLORS.text
                }}>
                  <Users size={16} />
                  {recipe.servings} Portionen
                </div>
                {recipe.nutrition && (
                  <div style={{
                    padding: '8px 16px',
                    background: 'rgba(232, 168, 136, 0.1)',
                    borderRadius: '20px',
                    fontSize: '14px',
                    color: COLORS.text
                  }}>
                    🔥 {Math.round(recipe.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 0)} kcal
                  </div>
                )}
              </div>

              {/* Summary */}
              {recipe.summary && (
                <div style={{
                  background: 'rgba(232, 168, 136, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <div 
                    style={{
                      color: COLORS.text,
                      fontSize: '14px',
                      lineHeight: '1.6'
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: recipe.summary.replace(/<a[^>]*>/g, '').replace(/<\/a>/g, '') 
                    }}
                  />
                </div>
              )}

              {/* Ingredients */}
              {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    color: COLORS.text,
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '12px'
                  }}>
                    🥘 Zutaten
                  </h3>
                  <ul style={{
                    margin: 0,
                    paddingLeft: '20px',
                    color: COLORS.text,
                    fontSize: '14px',
                    lineHeight: '1.8'
                  }}>
                    {recipe.extendedIngredients.map((ingredient, idx) => (
                      <li key={idx}>{ingredient.original}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              {recipe.instructions && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    color: COLORS.text,
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '12px'
                  }}>
                    👨‍🍳 Zubereitung
                  </h3>
                  <div 
                    style={{
                      color: COLORS.text,
                      fontSize: '14px',
                      lineHeight: '1.8'
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: recipe.instructions 
                    }}
                  />
                </div>
              )}

              {/* Analyzed Instructions (fallback) */}
              {!recipe.instructions && recipe.analyzedInstructions && recipe.analyzedInstructions[0]?.steps && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    color: COLORS.text,
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '12px'
                  }}>
                    👨‍🍳 Zubereitung
                  </h3>
                  <ol style={{
                    margin: 0,
                    paddingLeft: '20px',
                    color: COLORS.text,
                    fontSize: '14px',
                    lineHeight: '1.8'
                  }}>
                    {recipe.analyzedInstructions[0].steps.map((step, idx) => (
                      <li key={idx} style={{ marginBottom: '12px' }}>
                        {step.step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Nutrition */}
              {recipe.nutrition && recipe.nutrition.nutrients && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    color: COLORS.text,
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '12px'
                  }}>
                    📊 Nährwerte (pro Portion)
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '12px'
                  }}>
                    {recipe.nutrition.nutrients.slice(0, 6).map((nutrient, idx) => (
                      <div key={idx} style={{
                        padding: '12px',
                        background: 'rgba(232, 168, 136, 0.05)',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          color: COLORS.textLight,
                          fontSize: '12px',
                          marginBottom: '4px'
                        }}>
                          {nutrient.name}
                        </div>
                        <div style={{
                          color: COLORS.text,
                          fontSize: '16px',
                          fontWeight: '600'
                        }}>
                          {Math.round(nutrient.amount)}{nutrient.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Link */}
              {recipe.sourceUrl && (
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '14px',
                    background: 'white',
                    border: `2px solid ${COLORS.primary}`,
                    borderRadius: '12px',
                    color: COLORS.primary,
                    fontSize: '15px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = COLORS.primary;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = COLORS.primary;
                  }}
                >
                  <ExternalLink size={18} />
                  Original-Rezept ansehen
                </a>
              )}
            </div>
          </>
        ) : (
          <div style={{
            padding: '60px 24px',
            textAlign: 'center',
            color: COLORS.textLight
          }}>
            <p>Rezept konnte nicht geladen werden</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailModal;
