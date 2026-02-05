// Farbschema (Pastell)
export const COLORS = {
  menstruation: '#E6B89C',
  follicular: '#B8E6D5',
  ovulation: '#F5C2C7',
  luteal: '#F9E4B7',
  background: '#FEFEFE',
  cardBg: '#FFFFFF',
  text: '#2D3748',
  textLight: '#718096'
};

// Zyklus-Phasen Definition
export const CYCLE_PHASES = {
  menstruation: {
    color: COLORS.menstruation,
    gradient: 'linear-gradient(135deg, #E6B89C 0%, #F5D5C0 100%)',
    emoji: '🌙',
    days: [1, 2, 3, 4, 5]
  },
  follicular: {
    color: COLORS.follicular,
    gradient: 'linear-gradient(135deg, #B8E6D5 0%, #D4F1E8 100%)',
    emoji: '🌱',
    days: [6, 7, 8, 9, 10, 11, 12, 13]
  },
  ovulation: {
    color: COLORS.ovulation,
    gradient: 'linear-gradient(135deg, #F5C2C7 0%, #FFE0E5 100%)',
    emoji: '🌸',
    days: [14]
  },
  luteal: {
    color: COLORS.luteal,
    gradient: 'linear-gradient(135deg, #F9E4B7 0%, #FFF4D6 100%)',
    emoji: '🍂',
    days: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
  }
};

// Bestimmt die aktuelle Zyklusphase basierend auf dem Zyklustag
export const getCurrentPhase = (cycleDay) => {
  for (const [key, phase] of Object.entries(CYCLE_PHASES)) {
    if (phase.days.includes(cycleDay)) {
      return { key, ...phase };
    }
  }
  return { key: 'menstruation', ...CYCLE_PHASES.menstruation };
};