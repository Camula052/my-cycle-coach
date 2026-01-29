import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096'
};

const NutritionScreen = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ padding: '20px', paddingBottom: '100px', textAlign: 'center' }}>
      <h2 style={{ color: COLORS.text, marginBottom: '16px' }}>
        {t('navigation.nutrition')}
      </h2>
      <p style={{ color: COLORS.textLight }}>{t('comingSoon')}</p>
    </div>
  );
};

export default NutritionScreen;