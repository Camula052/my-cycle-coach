import React, { useState } from 'react';
import { RefreshCw, Share2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { buildRecipe, swapComponent, generateShareCode, saveCustomRecipe } from '../services/recipeBuilder';
import recipeComponents from '../services/recipeComponents';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096',
  background: '#FAF5F0',
  primary: '#E8A888',
  protein: '#FF6B9D',
  carb: '#FFA94D',
  veggie: '#51CF66',
  sauce: '#845EF7',
  topping: '#FFD43B'
};

// Emoji Mapping für Components
const COMPONENT_EMOJIS = {
  // Proteins
  chicken_breast: '🐔',
  salmon: '🐟',
  turkey: '🦃',
  eggs: '🥚',
  shrimp: '🦐',
  tofu: '🧊',
  tempeh: '🌾',
  chickpeas: '🫘',
  lentils: '🫘',
  black_beans: '🫘',
  
  // Carbs
  brown_rice: '🍚',
  quinoa: '🌾',
  sweet_potato: '🍠',
  whole_wheat_pasta: '🍝',
  oats: '🌾',
  
  // Vegetables
  broccoli: '🥦',
  spinach: '🥬',
  bell_pepper: '🫑',
  asparagus: '🌿',
  kale: '🥬',
  zucchini: '🥒',
  
  // Sauces (bases)
  yogurt_base: '🥛',
  oil_vinegar_base: '🫒',
  tahini_base: '🥜',
  soy_base: '🍶',
  tomato_base: '🍅',
  coconut_base: '🥥',
  butter_base: '🧈',
  nut_butter_base: '🥜',
  
  // Default fallbacks
  default_protein: '🍖',
  default_carb: '🌾',
  default_veggie: '🥗',
  default_sauce: '🥫',
  default_topping: '✨'
};

const ComponentBuilder = ({ initialRecipe, onSave, onClose }) => {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [animatingComponent, setAnimatingComponent] = useState(null);

  const handleSwap = (componentType, index, newId) => {
    setAnimatingComponent(`${componentType}_${index}`);
    
    setTimeout(() => {
      let updatedComponents = { ...recipe.components };
      
      if (Array.isArray(updatedComponents[componentType])) {
        const newArray = [...updatedComponents[componentType]];
        newArray[index] = newId;
        updatedComponents[componentType] = newArray;
      } else {
        updatedComponents[componentType] = newId;
      }

      const newRecipe = buildRecipe({
        template: recipe.template,
        ...updatedComponents,
        phase: recipe.phase
      });

      setRecipe(newRecipe);
      setAnimatingComponent(null);
    }, 300);
  };

  const handleAdd = (componentType) => {
    const updatedComponents = { ...recipe.components };
    const currentArray = updatedComponents[componentType] || [];
    const newIndex = currentArray.length;
    updatedComponents[componentType] = [...currentArray, null];

    const newRecipe = buildRecipe({
      template: recipe.template,
      ...updatedComponents,
      phase: recipe.phase
    });

    setRecipe(newRecipe);
    
    // Auto-open dropdown for new item
    setTimeout(() => {
      setExpandedSection(`${componentType}_${newIndex}`);
    }, 100);
  };

  const handleRemove = (componentType, index) => {
    const updatedComponents = { ...recipe.components };
    const newArray = [...updatedComponents[componentType]];
    newArray.splice(index, 1);
    updatedComponents[componentType] = newArray;

    const newRecipe = buildRecipe({
      template: recipe.template,
      ...updatedComponents,
      phase: recipe.phase
    });

    setRecipe(newRecipe);
  };

  const handleSave = () => {
    const name = prompt('Name für dein Rezept:', recipe.title);
    if (name) {
      saveCustomRecipe(recipe, name);
      alert('✅ Rezept gespeichert!');
      if (onSave) onSave(recipe);
    }
  };

  const handleShare = () => {
    const code = generateShareCode(recipe);
    setShowShareDialog(true);
  };

  const getComponentEmoji = (componentId) => {
    return COMPONENT_EMOJIS[componentId] || COMPONENT_EMOJIS.default_protein;
  };

  const renderComponentSlot = (componentType, componentId, index, color) => {
    const isAnimating = animatingComponent === `${componentType}_${index}`;
    const emoji = getComponentEmoji(componentId);

    return (
      <div
        key={`${componentType}_${index}`}
        style={{
          position: 'relative',
          display: 'inline-block',
          margin: '8px'
        }}
      >
        {/* Emoji Circle */}
        <div
          onClick={() => setExpandedSection(expandedSection === `${componentType}_${index}` ? null : `${componentType}_${index}`)}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${color}22, ${color}44)`,
            border: `3px solid ${color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            transform: isAnimating ? 'scale(0) rotate(360deg)' : 'scale(1) rotate(0deg)',
            boxShadow: `0 4px 20px ${color}44`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span style={{
            position: 'relative',
            zIndex: 2,
            animation: 'float 3s ease-in-out infinite',
            animationDelay: `${index * 0.2}s`
          }}>
            {emoji}
          </span>
          
          {/* Sparkle effect */}
          {!isAnimating && (
            <div style={{
              position: 'absolute',
              top: '10%',
              right: '10%',
              width: '8px',
              height: '8px',
              background: 'white',
              borderRadius: '50%',
              animation: 'sparkle 2s ease-in-out infinite',
              animationDelay: `${index * 0.5}s`
            }} />
          )}
        </div>

        {/* Remove button - can remove if at least 1 item */}
        {Array.isArray(recipe.components[componentType]) && (
          <button
            onClick={() => handleRemove(componentType, index)}
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#FF6B6B',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              zIndex: 10
            }}
          >
            ×
          </button>
        )}

        {/* Swap options */}
        {expandedSection === `${componentType}_${index}` && (
          <div style={{
            position: 'absolute',
            top: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'white',
            borderRadius: '16px',
            padding: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            zIndex: 100,
            minWidth: '200px',
            maxHeight: '300px',
            overflowY: 'auto',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <div style={{
              fontSize: '12px',
              color: COLORS.textLight,
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Austauschen:
            </div>
            {getAvailableComponents(componentType).map(comp => (
              <button
                key={comp.id}
                onClick={() => {
                  handleSwap(componentType, index, comp.id);
                  setExpandedSection(null);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  margin: '4px 0',
                  background: comp.id === componentId ? `${color}22` : 'transparent',
                  border: `1px solid ${comp.id === componentId ? color : '#E2E8F0'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  fontSize: '14px',
                  color: COLORS.text
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = `${color}22`}
                onMouseLeave={(e) => e.currentTarget.style.background = comp.id === componentId ? `${color}22` : 'transparent'}
              >
                <span style={{ fontSize: '20px' }}>{getComponentEmoji(comp.id)}</span>
                <span>{comp.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getAvailableComponents = (componentType) => {
    switch (componentType) {
      case 'proteins':
        return [...recipeComponents.proteins.animal, ...recipeComponents.proteins.plant];
      case 'carbs':
        return recipeComponents.carbs;
      case 'vegetables':
        return recipeComponents.vegetables;
      default:
        return [];
    }
  };

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
        background: 'linear-gradient(135deg, #FAF5F0 0%, #FFF5EB 100%)',
        borderRadius: '24px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'sticky',
            top: '16px',
            right: '16px',
            float: 'right',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 10
          }}
        >
          <X size={24} />
        </button>

        <div style={{ padding: '24px' }}>
          {/* Title */}
          <h2 style={{
            color: COLORS.text,
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #FF6B9D, #845EF7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🎨 Rezept Designer
          </h2>
          <p style={{
            textAlign: 'center',
            color: COLORS.textLight,
            fontSize: '14px',
            marginBottom: '24px'
          }}>
            Klick auf die Zutaten um sie auszutauschen!
          </p>

          {/* Recipe Title Preview */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: COLORS.text,
              marginBottom: '8px'
            }}>
              {recipe.title}
            </div>
            <div style={{
              fontSize: '13px',
              color: COLORS.textLight,
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <span>🔥 {recipe.calories} kcal</span>
              <span>⏱️ {recipe.readyInMinutes} min</span>
              <span>💪 {recipe.protein}g Protein</span>
            </div>
          </div>

          {/* Proteins Section */}
          <ComponentSection
            title="🍖 Proteine"
            color={COLORS.protein}
            components={recipe.components.proteins || []}
            componentType="proteins"
            renderSlot={(id, index) => renderComponentSlot('proteins', id, index, COLORS.protein)}
            onAdd={() => handleAdd('proteins')}
          />

          {/* Carbs Section */}
          <ComponentSection
            title="🌾 Kohlenhydrate"
            color={COLORS.carb}
            components={recipe.components.carbs || []}
            componentType="carbs"
            renderSlot={(id, index) => renderComponentSlot('carbs', id, index, COLORS.carb)}
            onAdd={() => handleAdd('carbs')}
          />

          {/* Vegetables Section */}
          <ComponentSection
            title="🥗 Gemüse"
            color={COLORS.veggie}
            components={recipe.components.vegetables || []}
            componentType="vegetables"
            renderSlot={(id, index) => renderComponentSlot('vegetables', id, index, COLORS.veggie)}
            onAdd={() => handleAdd('vegetables')}
          />

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '32px'
          }}>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                padding: '14px',
                background: COLORS.primary,
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: `0 4px 12px ${COLORS.primary}44`
              }}
            >
              <Save size={18} />
              Speichern
            </button>
            <button
              onClick={handleShare}
              style={{
                flex: 1,
                padding: '14px',
                background: 'white',
                border: `2px solid ${COLORS.primary}`,
                borderRadius: '12px',
                color: COLORS.primary,
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Share2 size={18} />
              Teilen
            </button>
          </div>
        </div>

        {/* Share Dialog */}
        {showShareDialog && (
          <ShareDialog
            recipe={recipe}
            onClose={() => setShowShareDialog(false)}
          />
        )}

        {/* Animations */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
          }
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

const ComponentSection = ({ title, color, components, componentType, renderSlot, onAdd }) => {
  return (
    <div style={{
      marginBottom: '24px',
      background: 'white',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        fontSize: '16px',
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>{title}</span>
        {components.length < 3 && (
          <button
            onClick={onAdd}
            style={{
              padding: '6px 12px',
              background: `${color}22`,
              border: `1px solid ${color}`,
              borderRadius: '8px',
              color: color,
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Hinzufügen
          </button>
        )}
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center'
      }}>
        {components.map((comp, index) => renderSlot(comp, index))}
      </div>
    </div>
  );
};

const ShareDialog = ({ recipe, onClose }) => {
  const shareCode = generateShareCode(recipe);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '32px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📤</div>
        <h3 style={{
          color: COLORS.text,
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '8px'
        }}>
          Rezept teilen
        </h3>
        <p style={{
          color: COLORS.textLight,
          fontSize: '14px',
          marginBottom: '24px'
        }}>
          Teile diesen Code mit Freunden!
        </p>
        <div style={{
          background: '#F7FAFC',
          border: '2px dashed',
          borderColor: COLORS.primary,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          fontFamily: 'monospace',
          fontSize: '16px',
          fontWeight: '600',
          color: COLORS.text,
          wordBreak: 'break-all'
        }}>
          {shareCode}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleCopy}
            style={{
              flex: 1,
              padding: '12px',
              background: copied ? '#51CF66' : COLORS.primary,
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {copied ? '✓ Kopiert!' : 'Code kopieren'}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '12px 20px',
              background: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              color: COLORS.text,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComponentBuilder;
