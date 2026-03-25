import React from 'react';

const COMPONENT_EMOJIS = {
  // Proteins - Animal
  chicken_breast: '🍗',
  salmon: '🐟',
  turkey: '🦃',
  eggs: '🥚',
  shrimp: '🦐',
  
  // Proteins - Plant
  tofu: '🧈',
  tempeh: '🌰',
  chickpeas: '🫘',
  lentils: '🫘',
  black_beans: '🫘',
  
  // Carbs
  brown_rice: '🍚',
  quinoa: '🌾',
  sweet_potato: '🍠',
  whole_wheat_pasta: '🍝',
  oats: '🥣',
  bread: '🍞',
  granola: '🥜',
  banana: '🍌',
  berries: '🫐',
  
  // Vegetables
  broccoli: '🥦',
  spinach: '🥬',
  bell_pepper: '🫑',
  asparagus: '🥒',
  kale: '🥬',
  zucchini: '🥒',
  
  // Toppings
  sesame_seeds: '⚪',
  fresh_herbs: '🌿',
  nuts: '🥜',
  lemon_wedge: '🍋'
};

const EmojiRecipeImage = ({ recipe, size = 'medium' }) => {
  const sizes = {
    small: { container: 150, emoji: 28, center: 40, dot: 12 },
    medium: { container: 300, emoji: 48, center: 64, dot: 20 },
    large: { container: 400, emoji: 64, center: 80, dot: 26 }
  };

  const dimensions = sizes[size] || sizes.medium;

  // Extract components
  const components = recipe?.components || {};
  const proteins = Array.isArray(components.proteins) ? components.proteins : [];
  const carbs = Array.isArray(components.carbs) ? components.carbs : [];
  const vegetables = Array.isArray(components.vegetables) ? components.vegetables : [];
  const toppings = Array.isArray(components.toppings) ? components.toppings : [];

  // Collect all items with colors
  const items = [];
  
  proteins.forEach(id => {
    const emoji = COMPONENT_EMOJIS[id];
    items.push({ 
      content: emoji || '●', 
      color: '#FF6B9D',
      isEmoji: !!emoji
    });
  });
  
  carbs.forEach(id => {
    const emoji = COMPONENT_EMOJIS[id];
    items.push({ 
      content: emoji || '●', 
      color: '#FFA94D',
      isEmoji: !!emoji
    });
  });
  
  vegetables.forEach(id => {
    const emoji = COMPONENT_EMOJIS[id];
    items.push({ 
      content: emoji || '●', 
      color: '#51CF66',
      isEmoji: !!emoji
    });
  });
  
  toppings.forEach(id => {
    const emoji = COMPONENT_EMOJIS[id];
    if (emoji) {
      items.push({ 
        content: emoji, 
        color: '#FFD43B',
        isEmoji: true
      });
    }
  });

  // Fallback: colored dots if no items
  if (items.length === 0) {
    items.push(
      { content: '●', color: '#FF6B9D', isEmoji: false },
      { content: '●', color: '#FFA94D', isEmoji: false },
      { content: '●', color: '#51CF66', isEmoji: false }
    );
  }

  // FIXED positions in a circle - deterministic, no randomness!
  const getFixedPosition = (index, total) => {
    const radius = dimensions.container * 0.32;
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const x = dimensions.container / 2 + radius * Math.cos(angle);
    const y = dimensions.container / 2 + radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div style={{
      position: 'relative',
      width: `${dimensions.container}px`,
      height: `${dimensions.container}px`,
      background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE5D9 100%)',
      borderRadius: '20px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Background decoration circles */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'rgba(232, 168, 136, 0.1)',
        filter: 'blur(8px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '10%',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255, 169, 77, 0.1)',
        filter: 'blur(10px)'
      }} />

      {/* Ingredient items in fixed circle positions */}
      {items.map((item, index) => {
        const pos = getFixedPosition(index, items.length);
        const itemSize = item.isEmoji ? dimensions.emoji : dimensions.dot;
        
        return (
          <div
            key={`item-${index}`}
            style={{
              position: 'absolute',
              left: `${pos.x - itemSize / 2}px`,
              top: `${pos.y - itemSize / 2}px`,
              fontSize: item.isEmoji ? `${dimensions.emoji}px` : `${dimensions.dot}px`,
              width: item.isEmoji ? 'auto' : `${dimensions.dot}px`,
              height: item.isEmoji ? 'auto' : `${dimensions.dot}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: item.color,
              backgroundColor: !item.isEmoji ? item.color : 'transparent',
              borderRadius: !item.isEmoji ? '50%' : '0',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              animation: `float 3s ease-in-out infinite`,
              animationDelay: `${index * 0.2}s`,
              zIndex: 2
            }}
          >
            {item.isEmoji && item.content}
          </div>
        );
      })}

      {/* Center plate icon - ALWAYS 🍽️ */}
      <div style={{
        position: 'absolute',
        fontSize: `${dimensions.center}px`,
        zIndex: 1,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
        animation: 'pulse 2s ease-in-out infinite'
      }}>
        🍽️
      </div>

      {/* Sparkle decorations */}
      {[...Array(3)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          style={{
            position: 'absolute',
            left: `${20 + i * 30}%`,
            top: `${15 + i * 25}%`,
            fontSize: '16px',
            opacity: 0.4,
            animation: `sparkle ${2 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`
          }}
        >
          ✨
        </div>
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes sparkle {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default EmojiRecipeImage;
