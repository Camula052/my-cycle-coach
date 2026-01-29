import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import FloatingButton from '../components/FloatingButton';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096'
};

const HomeScreen = ({ currentPhase, cycleDay, onOpenTracking }) => {
  const { t } = useTranslation();
  
  return (
    <div style={{
      minHeight: '100vh',
      background: currentPhase.gradient,
      padding: '40px 24px 100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      {/* Phase Icon/Visual */}
      <div style={{
        width: '160px',
        height: '160px',
        marginBottom: '32px',
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '72px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        🌸
      </div>

      {/* Phase Name */}
      <h1 style={{
        color: COLORS.text,
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '8px',
        textAlign: 'center',
        textShadow: '0 2px 8px rgba(255, 255, 255, 0.5)'
      }}>
        {t(`phases.${currentPhase.key}.name`)}
      </h1>

      {/* Cycle Day */}
      <p style={{
        color: COLORS.text,
        fontSize: '16px',
        opacity: 0.8,
        marginBottom: '48px',
        textAlign: 'center'
      }}>
        {t('home.cycleDay', { day: cycleDay })}
      </p>

      {/* Phase Info */}
      <div style={{
        maxWidth: '500px',
        padding: '32px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
      }}>
        <h3 style={{
          color: COLORS.text,
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {t('home.whatIsHappening')}
        </h3>
        <p style={{
          color: COLORS.text,
          lineHeight: '1.7',
          fontSize: '16px',
          textAlign: 'center',
          opacity: 0.9
        }}>
          {t(`phases.${currentPhase.key}.info`)}
        </p>
      </div>

      {/* Floating Button */}
      <FloatingButton 
        onClick={onOpenTracking}
        label={t('home.tellMeAboutDay')}
      />
    </div>
  );
};

export default HomeScreen;