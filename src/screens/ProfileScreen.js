import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const COLORS = {
  follicular: '#B8E6D5',
  cardBg: '#FFFFFF',
  text: '#2D3748',
  textLight: '#718096'
};

const ProfileScreen = ({ userData, onEditProfile }) => {
  const { t, language, changeLanguage } = useTranslation();
  
  if (!userData) {
    return (
      <div style={{ padding: '20px', paddingBottom: '100px', textAlign: 'center' }}>
        <h2 style={{ color: COLORS.text, marginBottom: '16px' }}>{t('navigation.profile')}</h2>
        <p style={{ color: COLORS.textLight }}>{t('profile.noData')}</p>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>
      <h2 style={{ color: COLORS.text, marginBottom: '24px', fontSize: '24px', fontWeight: '600' }}>
        {t('navigation.profile')}
      </h2>
      
      {/* User Info */}
      <div style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
        border: '1.5px solid rgba(226, 232, 240, 0.5)'
      }}>
        <h3 style={{ color: COLORS.text, fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          {t('profile.personalData')}
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <span style={{ color: COLORS.textLight, fontSize: '14px' }}>{t('profile.name')}:</span>
            <p style={{ color: COLORS.text, fontSize: '16px', fontWeight: '500' }}>{userData.name}</p>
          </div>
          {userData.age && (
            <div>
              <span style={{ color: COLORS.textLight, fontSize: '14px' }}>{t('profile.age')}:</span>
              <p style={{ color: COLORS.text, fontSize: '16px', fontWeight: '500' }}>{userData.age}</p>
            </div>
          )}
          {userData.height && (
            <div>
              <span style={{ color: COLORS.textLight, fontSize: '14px' }}>{t('profile.height')}:</span>
              <p style={{ color: COLORS.text, fontSize: '16px', fontWeight: '500' }}>{userData.height} cm</p>
            </div>
          )}
          {userData.weight && (
            <div>
              <span style={{ color: COLORS.textLight, fontSize: '14px' }}>{t('profile.weight')}:</span>
              <p style={{ color: COLORS.text, fontSize: '16px', fontWeight: '500' }}>{userData.weight} kg</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Language Switcher */}
      <div style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
        border: '1.5px solid rgba(226, 232, 240, 0.5)'
      }}>
        <h3 style={{ color: COLORS.text, fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          {t('profile.language')}
        </h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => changeLanguage('de')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: language === 'de' ? COLORS.follicular : 'transparent',
              border: `2px solid ${language === 'de' ? COLORS.follicular : 'rgba(226, 232, 240, 0.5)'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              color: COLORS.text
            }}
          >
            🇩🇪 Deutsch
          </button>
          <button
            onClick={() => changeLanguage('en')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: language === 'en' ? COLORS.follicular : 'transparent',
              border: `2px solid ${language === 'en' ? COLORS.follicular : 'rgba(226, 232, 240, 0.5)'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              color: COLORS.text
            }}
          >
            🇬🇧 English
          </button>
        </div>
      </div>
      
      {/* Edit Button */}
      <button
        onClick={onEditProfile}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: COLORS.follicular,
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '16px',
          color: COLORS.text,
          boxShadow: `0 0 25px ${COLORS.follicular}60`
        }}
      >
        {t('profile.editProfile')}
      </button>
    </div>
  );
};

export default ProfileScreen;