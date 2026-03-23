import React from 'react';
import { X, Clock, Users } from 'lucide-react';
import EmojiRecipeImage from './EmojiRecipeImage';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096',
  background: '#FAF5F0',
  primary: '#E8A888'
};

const RecipeDetailModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

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

        {/* Recipe Image */}
        <div style={{ width: '100%', height: '250px' }}>
          <EmojiRecipeImage recipe={recipe} size="large" />
        </div>

        <div style={{ padding: '24px' }}>
          {/* AI Badge */}
          {recipe.aiGenerated && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(138, 43, 226, 0.1)',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#8A2BE2',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              🤖 KI-generiertes Rezept
            </div>
          )}

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
            {recipe.calories && (
              <div style={{
                padding: '8px 16px',
                background: 'rgba(232, 168, 136, 0.1)',
                borderRadius: '20px',
                fontSize: '14px',
                color: COLORS.text
              }}>
                🔥 {recipe.calories} kcal
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
              <p style={{
                color: COLORS.text,
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0
              }}>
                {recipe.summary}
              </p>
            </div>
          )}

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
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
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {recipe.instructions && recipe.instructions.length > 0 && (
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
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: '12px' }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Phase Info */}
          {recipe.phase && (
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
                🌙 Phasengerecht
              </h4>
              <p style={{
                color: COLORS.textLight,
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0
              }}>
                Dieses Rezept wurde speziell für die <strong>{getPhaseName(recipe.phase)}</strong> optimiert und enthält wichtige Nährstoffe für diese Phase deines Zyklus.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getPhaseName = (phase) => {
  const names = {
    menstruation: 'Menstruationsphase',
    follicular: 'Follikelphase',
    ovulation: 'Ovulationsphase',
    luteal: 'Lutealphase'
  };
  return names[phase] || phase;
};

export default RecipeDetailModal;
