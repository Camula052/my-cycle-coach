import React from 'react';
import { Calendar, Home, Utensils, Activity, User } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const COLORS = {
  follicular: '#B8E6D5',
  textLight: '#718096'
};

const Navigation = ({ currentScreen, onNavigate }) => {
  const { t } = useTranslation();
  
  const navItems = [
    { id: 'home', icon: Home, label: t('navigation.home') },
    { id: 'calendar', icon: Calendar, label: t('navigation.calendar') },
    { id: 'nutrition', icon: Utensils, label: t('navigation.nutrition') },
    { id: 'activity', icon: Activity, label: t('navigation.activity') },
    { id: 'profile', icon: User, label: t('navigation.profile') }
  ];
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(226, 232, 240, 0.3)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
      zIndex: 50
    }}>
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: currentScreen === item.id ? COLORS.follicular : COLORS.textLight,
            transition: 'all 0.3s ease',
            filter: currentScreen === item.id ? `drop-shadow(0 0 8px ${COLORS.follicular}80)` : 'none'
          }}
        >
          <item.icon size={24} />
          <span style={{ fontSize: '11px', fontWeight: '500' }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;