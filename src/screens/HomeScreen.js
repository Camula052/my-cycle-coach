import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import FloatingButton from '../components/FloatingButton';
import PhaseDetailsModal from '../components/PhaseDetailsModal';
import OrganicBackground from '../components/OrganicBackground';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096'
};

const HomeScreen = ({ currentPhase, cycleDay, onOpenTracking, onNavigate }) => {
  const { t } = useTranslation();
  const [isPhaseDetailsOpen, setIsPhaseDetailsOpen] = useState(false);
  
  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px 24px 100px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: 'transparent'
    }}>
      {/* Organischer Hintergrund mit Membran-Glow und Partikeln */}
      <OrganicBackground phase={currentPhase} />

      {/* Phase Name - ganz oben, prominent */}
      <h1 style={{
        color: COLORS.text,
        fontSize: '36px',
        fontWeight: '700',
        marginBottom: '8px',
        marginTop: '20px',
        textAlign: 'center',
        textShadow: '0 2px 8px rgba(255, 255, 255, 0.5)',
        position: 'relative',
        zIndex: 2
      }}>
        {t(`phases.${currentPhase.key}.name`)}
      </h1>

      {/* Cycle Day */}
      <p style={{
        color: COLORS.text,
        fontSize: '16px',
        opacity: 0.8,
        textAlign: 'center',
        marginBottom: '32px',
        fontWeight: '500',
        position: 'relative',
        zIndex: 2
      }}>
        {t('home.cycleDay', { day: cycleDay })}
      </p>

      {/* Phase Emoji - ZENTRUM (statt Uterus Animation) */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '32px',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Emoji Circle - klickbar */}
        <div
          onClick={() => setIsPhaseDetailsOpen(true)}
          style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '96px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: 'gentleFloat 6s ease-in-out infinite',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
          }}
        >
          {currentPhase.emoji}
          
          {/* Info Button - oben rechts am Emoji Circle */}
          <button
            onClick={() => {
              console.log('Info button clicked!');
              console.log('isPhaseDetailsOpen:', isPhaseDetailsOpen);
              console.log('currentPhase:', currentPhase);
              setIsPhaseDetailsOpen(true);
            }}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'all 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.background = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
            }}
          >
            <Info size={20} color={COLORS.text} />
          </button>
        </div>
      </div>

      {/* "Was geht ab" Box */}
      <div style={{
        maxWidth: '500px',
        width: '100%',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '20px',
        padding: '24px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        zIndex: 2
      }}>
        <h2 style={{
          color: COLORS.text,
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '12px',
          textAlign: 'center'
        }}>
          {t('home.whatsHappening')}
        </h2>
        <p style={{
          color: COLORS.text,
          fontSize: '15px',
          lineHeight: '1.7',
          opacity: 0.85,
          textAlign: 'center',
          margin: 0
        }}>
          {t(`phases.${currentPhase.key}.description`)}
        </p>
      </div>

      {/* Floating Action Button */}
      <FloatingButton onClick={onOpenTracking} />

      {/* Phase Details Modal */}
      <PhaseDetailsModal
        isOpen={isPhaseDetailsOpen}
        onClose={() => setIsPhaseDetailsOpen(false)}
        currentPhase={currentPhase}
        onNavigateToNutrition={() => onNavigate('nutrition')}
        onNavigateToActivity={() => onNavigate('activity')}
      />

      <style>{`
        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;