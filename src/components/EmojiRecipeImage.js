import React from 'react';

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
  bread: '🍞',
  
  // Vegetables
  broccoli: '🥦',
  spinach: '🥬',
  bell_pepper: '🫑',
  asparagus: '🌿',
  kale: '🥬',
  zucchini: '🥒',
  carrots: '🥕',
  tomatoes: '🍅',
  
  // Sauces (simplified)
  sauce: '🥫',
  
  // Toppings
  sesame_seeds: '🌰',
  fresh_herbs: '🌿',
  nuts: '🥜',
  lemon_wedge: '🍋'
};

const EmojiRecipeImage = ({ recipe, size = 'medium' }) => {
  const sizes = {
    small: { container: 150, emoji: 30 },
    medium: { container: 300, emoji: 50 },
    large: { container: 400, emoji: 60 }
  };

  const { container, emoji: emojiSize } = sizes[size];

  // Collect all emojis from recipe components
  const emojis = [];
  
  if (recipe.components) {
    // Proteins
    if (recipe.components.proteins) {
      recipe.components.proteins.forEach(p => {
        if (COMPONENT_EMOJIS[p]) emojis.push(COMPONENT_EMOJIS[p]);
      });
    }
    
    // Carbs
    if (recipe.components.carbs) {
      recipe.components.carbs.forEach(c => {
        if (COMPONENT_EMOJIS[c]) emojis.push(COMPONENT_EMOJIS[c]);
      });
    }
    
    // Vegetables
    if (recipe.components.vegetables) {
      recipe.components.vegetables.forEach(v => {
        if (COMPONENT_EMOJIS[v]) emojis.push(COMPONENT_EMOJIS[v]);
      });
    }
    
    // Sauce
    if (recipe.components.sauce) {
      emojis.push(COMPONENT_EMOJIS.sauce);
    }
    
    // Toppings
    if (recipe.components.toppings) {
      recipe.components.toppings.forEach(t => {
        if (COMPONENT_EMOJIS[t]) emojis.push(COMPONENT_EMOJIS[t]);
      });
    }
  }

  // If no components found, use default emojis
  if (emojis.length === 0) {
    emojis.push('🍽️', '🥗', '🍴');
  }

  // Generate positions for emojis (scattered pattern)
  const positions = emojis.map((emoji, index) => {
    const angle = (index / emojis.length) * Math.PI * 2;
    const radius = container * 0.25;
    const x = 50 + Math.cos(angle) * (radius / container * 100);
    const y = 50 + Math.sin(angle) * (radius / container * 100);
    
    return {
      emoji,
      x,
      y,
      delay: index * 0.1,
      scale: 0.8 + Math.random() * 0.4
    };
  });

  return (
    <div style={{
      width: '100%',
      height: `${container}px`,
      background: 'linear-gradient(135deg, #FAF5F0 0%, #FFF5EB 50%, #FFE8D6 100%)',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: size === 'small' ? '12px' : '24px'
    }}>
      {/* Decorative circles in background */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '60%',
        height: '60%',
        borderRadius: '50%',
        background: 'rgba(232, 168, 136, 0.1)',
        animation: 'pulse 4s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '50%',
        height: '50%',
        borderRadius: '50%',
        background: 'rgba(255, 107, 157, 0.08)',
        animation: 'pulse 5s ease-in-out infinite'
      }} />

      {/* Emoji Cloud */}
      {positions.map((pos, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `translate(-50%, -50%) scale(${pos.scale})`,
            fontSize: `${emojiSize}px`,
            animation: `float 3s ease-in-out infinite`,
            animationDelay: `${pos.delay}s`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
        >
          {pos.emoji}
        </div>
      ))}

      {/* Center Icon */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: `${emojiSize * 1.5}px`,
        animation: 'pulse 2s ease-in-out infinite',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
      }}>
        🍽️
      </div>

      {/* Sparkles */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          style={{
            position: 'absolute',
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgba(255, 215, 0, 0.6)',
            animation: `sparkle 2s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`
          }}
        />
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(var(--scale)); }
          50% { transform: translate(-50%, -50%) translateY(-10px) scale(var(--scale)); }
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.9; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default EmojiRecipeImage;
