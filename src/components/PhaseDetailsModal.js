import React from 'react';
import { X, Utensils, Activity } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { COLORS } from '../utils/cycleHelpers';

const PhaseDetailsModal = ({ isOpen, onClose, currentPhase, onNavigateToNutrition, onNavigateToActivity }) => {
  const { t } = useTranslation();

  if (!isOpen || !currentPhase) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: currentPhase.gradient,
        borderRadius: '24px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.text
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            🌸
          </div>
          <h2 style={{
            color: COLORS.text,
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            {t(`phases.${currentPhase.key}.name`)}
          </h2>
          <p style={{
            color: COLORS.text,
            fontSize: '16px',
            opacity: 0.8
          }}>
            {t(`phases.${currentPhase.key}.info`)}
          </p>
        </div>

        {/* Detail Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {/* Was passiert im Körper */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              color: COLORS.text,
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              🫀 Was passiert in deinem Körper?
            </h3>
            <p style={{
              color: COLORS.text,
              fontSize: '15px',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              {t(`phases.${currentPhase.key}.details.body`)}
            </p>
          </div>

          {/* Energie */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              color: COLORS.text,
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              ⚡ Deine Energie
            </h3>
            <p style={{
              color: COLORS.text,
              fontSize: '15px',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              {t(`phases.${currentPhase.key}.details.energy`)}
            </p>
          </div>

          {/* Stimmung */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              color: COLORS.text,
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              💭 Deine Stimmung
            </h3>
            <p style={{
              color: COLORS.text,
              fontSize: '15px',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              {t(`phases.${currentPhase.key}.details.mood`)}
            </p>
          </div>

          {/* Tipps */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              color: COLORS.text,
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              💡 Tipps für dich
            </h3>
            <p style={{
              color: COLORS.text,
              fontSize: '15px',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              {t(`phases.${currentPhase.key}.details.tips`)}
            </p>
          </div>
        </div>

        {/* Navigation Prompts */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <p style={{
            color: COLORS.text,
            fontSize: '16px',
            marginBottom: '8px',
            lineHeight: '1.5'
          }}>
            {t('home.nutritionPrompt')}
          </p>
          <p style={{
            color: COLORS.text,
            fontSize: '16px',
            marginBottom: '20px',
            lineHeight: '1.5'
          }}>
            {t('home.activityPrompt')}
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                onNavigateToNutrition();
                onClose();
              }}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                color: COLORS.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Utensils size={18} />
              {t('home.goToNutrition')}
            </button>

            <button
              onClick={() => {
                onNavigateToActivity();
                onClose();
              }}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                color: COLORS.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Activity size={18} />
              {t('home.goToActivity')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseDetailsModal;