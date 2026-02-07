import React, { useState } from 'react';
import { X, Utensils, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { COLORS } from '../utils/cycleHelpers';

const PhaseDetailsModal = ({ isOpen, onClose, currentPhase, onNavigateToNutrition, onNavigateToActivity }) => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  if (!isOpen || !currentPhase) return null;

  const slides = [
    {
      icon: currentPhase.emoji,
      title: 'Warum dieses Symbol?',
      key: 'emoji'
    },
    {
      icon: '🫀',
      title: 'Was passiert in deinem Körper?',
      key: 'body'
    },
    {
      icon: '👁️',
      title: 'Wie verändert sich dein Körper?',
      key: 'physical'
    },
    {
      icon: '⚡',
      title: 'Deine Energie',
      key: 'energy'
    },
    {
      icon: '💭',
      title: 'Deine Stimmung',
      key: 'mood'
    },
    {
      icon: '💡',
      title: 'Tipps für dich',
      key: 'tips'
    }
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left
      handleNextSlide();
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right
      handlePrevSlide();
    }
  };

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
            color: COLORS.text,
            zIndex: 10
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
            {currentPhase.emoji}
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

        {/* Carousel Container */}
        <div style={{ 
          position: 'relative',
          marginBottom: '32px'
        }}>
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevSlide}
            style={{
              position: 'absolute',
              left: '-12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.text,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNextSlide}
            style={{
              position: 'absolute',
              right: '-12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.text,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Slide Content */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              overflow: 'hidden',
              borderRadius: '16px'
            }}
          >
            <div style={{
              display: 'flex',
              transition: 'transform 0.3s ease-out',
              transform: `translateX(-${currentSlide * 100}%)`
            }}>
              {slides.map((slide, index) => (
                <div
                  key={index}
                  style={{
                    minWidth: '100%',
                    padding: '0 4px'
                  }}
                >
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    padding: '32px 24px',
                    backdropFilter: 'blur(10px)',
                    minHeight: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      fontSize: '48px',
                      textAlign: 'center',
                      marginBottom: '16px'
                    }}>
                      {slide.icon}
                    </div>
                    <h3 style={{
                      color: COLORS.text,
                      fontSize: '20px',
                      fontWeight: '600',
                      marginBottom: '16px',
                      textAlign: 'center'
                    }}>
                      {slide.title}
                    </h3>
                    <p style={{
                      color: COLORS.text,
                      fontSize: '15px',
                      lineHeight: '1.7',
                      opacity: 0.9,
                      textAlign: 'center'
                    }}>
                      {t(`phases.${currentPhase.key}.details.${slide.key}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '20px'
          }}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: currentSlide === index ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: currentSlide === index 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0
                }}
              />
            ))}
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