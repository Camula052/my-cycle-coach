import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { getCurrentPhase, COLORS } from '../utils/cycleHelpers';

const NutritionScreen = ({ userData }) => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(null);

  // Berechne aktuelle Phase mit Eisprung-Berücksichtigung
  useEffect(() => {
    if (!userData?.periodStartDate) {
      setCurrentPhase(getCurrentPhase(1));
      return;
    }
    
    const periodStartDate = new Date(userData.periodStartDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Checke auf markierten Eisprung
    const ovulationDatesStr = localStorage.getItem('ovulationDates');
    const ovulationDates = ovulationDatesStr ? JSON.parse(ovulationDatesStr) : {};
    const ovDates = Object.keys(ovulationDates).filter(key => ovulationDates[key]);
    
    let cycleDay;
    
    if (ovDates.length > 0) {
      // Finde den neuesten Eisprung
      const dates = ovDates.map(dateKey => {
        const [y, m, d] = dateKey.split('-').map(Number);
        return new Date(y, m - 1, d);
      }).sort((a, b) => b - a);
      
      const latestOvulation = dates[0];
      const daysSinceOvulation = Math.floor((today - latestOvulation) / (1000 * 60 * 60 * 24));
      cycleDay = 14 + daysSinceOvulation;
      
      if (cycleDay <= 0) {
        cycleDay = 28 + (cycleDay % 28);
      } else if (cycleDay > 28) {
        cycleDay = ((cycleDay - 1) % 28) + 1;
      }
    } else {
      const daysSinceStart = Math.floor((today - periodStartDate) / (1000 * 60 * 60 * 24));
      cycleDay = daysSinceStart < 0 ? 1 : (daysSinceStart % 28) + 1;
    }
    
    setCurrentPhase(getCurrentPhase(cycleDay));
  }, [userData]);

  if (!currentPhase) {
    return (
      <div style={{ padding: '20px', paddingBottom: '100px', textAlign: 'center' }}>
        <p style={{ color: COLORS.textLight }}>Lade Daten...</p>
      </div>
    );
  }

  const handlePrevSlide = () => {
    const nutrients = t(`nutrition.${currentPhase.key}.nutrients`, { returnObjects: true });
    setCurrentSlide((prev) => (prev === 0 ? nutrients.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    const nutrients = t(`nutrition.${currentPhase.key}.nutrients`, { returnObjects: true });
    setCurrentSlide((prev) => (prev === nutrients.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
    // Verhindere horizontales Scrollen während Swipe
    const touchDiff = touchStart - e.targetTouches[0].clientX;
    if (Math.abs(touchDiff) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNextSlide();
    }
    if (touchStart - touchEnd < -75) {
      handlePrevSlide();
    }
  };

  const nutrients = t(`nutrition.${currentPhase.key}.nutrients`, { returnObjects: true });

  return (
    <div style={{ 
      minHeight: '100vh',
      background: currentPhase.gradient,
      padding: '40px 20px 120px',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {currentPhase.emoji}
          </div>
          <h1 style={{
            color: COLORS.text,
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '12px'
          }}>
            {t('nutrition.title')}
          </h1>
          <p style={{
            color: COLORS.text,
            fontSize: '16px',
            opacity: 0.8,
            lineHeight: '1.6'
          }}>
            {t(`nutrition.${currentPhase.key}.intro`)}
          </p>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '32px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            color: COLORS.text,
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            🥗 {t('nutrition.whatYourBodyNeeds')}
          </h3>
          <p style={{
            color: COLORS.text,
            fontSize: '15px',
            lineHeight: '1.6',
            opacity: 0.9
          }}>
            {t(`nutrition.${currentPhase.key}.description`)}
          </p>
        </div>

        {/* Carousel Container */}
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <h2 style={{
            color: COLORS.text,
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            💊 {t('nutrition.importantNutrients')}
          </h2>

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
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
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
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
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
              borderRadius: '16px',
              touchAction: 'pan-y'
            }}
          >
            <div style={{
              display: 'flex',
              transition: 'transform 0.3s ease-out',
              transform: `translateX(-${currentSlide * 100}%)`
            }}>
              {nutrients.map((nutrient, index) => (
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
                    minHeight: '320px'
                  }}>
                    <div style={{
                      fontSize: '48px',
                      textAlign: 'center',
                      marginBottom: '16px'
                    }}>
                      {nutrient.icon}
                    </div>
                    <h3 style={{
                      color: COLORS.text,
                      fontSize: '22px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      textAlign: 'center'
                    }}>
                      {nutrient.name}
                    </h3>
                    <p style={{
                      color: COLORS.text,
                      fontSize: '14px',
                      lineHeight: '1.6',
                      opacity: 0.85,
                      textAlign: 'center',
                      marginBottom: '20px',
                      fontStyle: 'italic'
                    }}>
                      {nutrient.why}
                    </p>
                    
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.4)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginTop: '16px'
                    }}>
                      <h4 style={{
                        color: COLORS.text,
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        textAlign: 'center'
                      }}>
                        🍽️ Enthalten in:
                      </h4>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        justifyContent: 'center'
                      }}>
                        {nutrient.foods.map((food, i) => (
                          <span
                            key={i}
                            style={{
                              background: 'rgba(255, 255, 255, 0.6)',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              color: COLORS.text,
                              fontWeight: '500'
                            }}
                          >
                            {food}
                          </span>
                        ))}
                      </div>
                    </div>
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
            {nutrients.map((_, index) => (
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

        {/* Premium CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
          borderRadius: '20px',
          padding: '28px 24px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Sparkle Decoration */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            color: 'rgba(255, 215, 0, 0.6)',
            animation: 'sparkle 2s ease-in-out infinite'
          }}>
            <Sparkles size={24} />
          </div>
          
          <style>
            {`
              @keyframes sparkle {
                0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
                50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
              }
            `}
          </style>

          <div style={{
            fontSize: '32px',
            marginBottom: '12px'
          }}>
            ✨
          </div>
          <h3 style={{
            color: COLORS.text,
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '12px'
          }}>
            {t('nutrition.premium.title')}
          </h3>
          <p style={{
            color: COLORS.text,
            fontSize: '15px',
            lineHeight: '1.6',
            opacity: 0.85,
            marginBottom: '20px'
          }}>
            {t('nutrition.premium.description')}
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '20px',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🍳</span>
              <span style={{ color: COLORS.text, fontSize: '14px' }}>{t('nutrition.premium.feature1')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📅</span>
              <span style={{ color: COLORS.text, fontSize: '14px' }}>{t('nutrition.premium.feature2')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🛒</span>
              <span style={{ color: COLORS.text, fontSize: '14px' }}>{t('nutrition.premium.feature3')}</span>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '16px',
              color: COLORS.text,
              boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 215, 0, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 215, 0, 0.4)';
            }}
            onClick={() => alert('Premium-Feature kommt bald! 🚀')}
          >
            <Sparkles size={18} />
            {t('nutrition.premium.cta')}
          </button>
          
          <p style={{
            color: COLORS.text,
            fontSize: '12px',
            opacity: 0.6,
            marginTop: '12px'
          }}>
            {t('nutrition.premium.subtitle')}
          </p>
        </div>

      </div>
    </div>
  );
};

export default NutritionScreen;