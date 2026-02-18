import React, { useState, useEffect } from 'react';
import { Info, AlertTriangle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { COLORS, getCurrentPhase } from '../utils/cycleHelpers';

const ActivityScreen = ({ userData }) => {
  const { t } = useTranslation();
  const [bmi, setBMI] = useState(null);
  const [age, setAge] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
  
  // Carousel States für Bewegungsempfehlungen
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (userData?.height && userData?.weight) {
      const heightInM = parseFloat(userData.height) / 100;
      const weightInKg = parseFloat(userData.weight);
      const calculatedBMI = weightInKg / (heightInM * heightInM);
      setBMI(calculatedBMI);
    }

    // Berechne Alter aus Geburtsdatum
    if (userData?.birthdate) {
      const birthDate = new Date(userData.birthdate);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else if (userData?.age) {
      setAge(parseInt(userData.age));
    }
    
    // Berechne aktuelle Zyklusphase für Bewegungsempfehlungen
    if (userData?.periodStartDate) {
      const periodStartDate = new Date(userData.periodStartDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Checke auf markierten Eisprung
      const ovulationDatesStr = localStorage.getItem('ovulationDates');
      const ovulationDates = ovulationDatesStr ? JSON.parse(ovulationDatesStr) : {};
      const ovDates = Object.keys(ovulationDates).filter(key => ovulationDates[key]);
      
      let cycleDay;
      if (ovDates.length > 0) {
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
    }
  }, [userData]);

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { key: 'underweight', color: '#60A5FA' };
    if (bmi < 25) return { key: 'normal', color: '#34D399' };
    if (bmi < 30) return { key: 'overweight', color: '#FBBF24' };
    return { key: 'obese', color: '#F87171' };
  };

  const getBMIPosition = (bmi) => {
    // Position auf der Skala (15-35 BMI Range)
    const minBMI = 15;
    const maxBMI = 35;
    const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi));
    return ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100;
  };

  // Carousel Handler für Bewegungsempfehlungen
  const handlePrevSlide = () => {
    if (!currentPhase) return;
    const activities = t(`activity.movement.${currentPhase.key}.activities`, { returnObjects: true });
    setCurrentSlide((prev) => (prev === 0 ? activities.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    if (!currentPhase) return;
    const activities = t(`activity.movement.${currentPhase.key}.activities`, { returnObjects: true });
    setCurrentSlide((prev) => (prev === activities.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
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

  // Bewegungsempfehlungen basierend auf Phase mit Swipe-Carousel
  const renderMovementRecommendations = () => {
    if (!currentPhase) return null;
    
    const activities = t(`activity.movement.${currentPhase.key}.activities`, { returnObjects: true });
    
    return (
      <div style={{
        background: currentPhase.gradient,
        borderRadius: '24px',
        padding: '32px 24px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ 
            fontSize: '48px',
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
          }}>
            {currentPhase.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              color: COLORS.text,
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '4px',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}>
              {t(`phases.${currentPhase.key}.name`)}
            </h3>
            <p style={{
              color: COLORS.text,
              fontSize: '14px',
              margin: 0,
              opacity: 0.8
            }}>
              {t('activity.movementForPhase')}
            </p>
          </div>
        </div>

        {/* Beschreibung */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <p style={{
            color: COLORS.text,
            fontSize: '15px',
            lineHeight: '1.7',
            margin: 0,
            fontWeight: '500'
          }}>
            {t(`activity.movement.${currentPhase.key}.description`)}
          </p>
        </div>

        {/* Aktivitäten Carousel */}
        <div>
          <h4 style={{
            color: COLORS.text,
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '16px',
            textShadow: '0 1px 2px rgba(255,255,255,0.8)'
          }}>
            💪 {t('activity.recommendedActivities')}
          </h4>

          <div style={{ position: 'relative' }}>
            {/* Carousel Container */}
            <div
              style={{
                overflow: 'hidden',
                borderRadius: '16px',
                touchAction: 'pan-y'
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div style={{
                display: 'flex',
                transition: 'transform 0.3s ease-out',
                transform: `translateX(-${currentSlide * 100}%)`
              }}>
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    style={{
                      minWidth: '100%',
                      padding: '0 4px'
                    }}
                  >
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '32px',
                      textAlign: 'center',
                      border: '2px solid rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      minHeight: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <h5 style={{
                        color: COLORS.text,
                        fontSize: '24px',
                        fontWeight: '700',
                        margin: 0,
                        lineHeight: '1.4'
                      }}>
                        {activity}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows - Desktop */}
            {activities.length > 1 && (
              <>
                <button
                  onClick={handlePrevSlide}
                  style={{
                    position: 'absolute',
                    left: '-12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  <ChevronLeft size={24} color={COLORS.text} />
                </button>

                <button
                  onClick={handleNextSlide}
                  style={{
                    position: 'absolute',
                    right: '-12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }}
                >
                  <ChevronRight size={24} color={COLORS.text} />
                </button>
              </>
            )}

            {/* Dots Navigation */}
            {activities.length > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '20px'
              }}>
                {activities.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    style={{
                      width: currentSlide === index ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: currentSlide === index 
                        ? COLORS.text 
                        : 'rgba(45, 55, 72, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: 0
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Premium CTA für Trainingspläne
  const renderPremiumCTA = () => {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
        borderRadius: '20px',
        padding: '28px 24px',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
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

        <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
        <h3 style={{
          color: COLORS.text,
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '12px'
        }}>
          {t('activity.premium.title')}
        </h3>
        <p style={{
          color: COLORS.text,
          fontSize: '15px',
          lineHeight: '1.6',
          opacity: 0.85,
          marginBottom: '20px'
        }}>
          {t('activity.premium.description')}
        </p>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '20px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🏋️</span>
            <span style={{ color: COLORS.text, fontSize: '14px' }}>{t('activity.premium.feature1')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📅</span>
            <span style={{ color: COLORS.text, fontSize: '14px' }}>{t('activity.premium.feature2')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🎯</span>
            <span style={{ color: COLORS.text, fontSize: '14px' }}>{t('activity.premium.feature3')}</span>
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
          {t('activity.premium.cta')}
        </button>
        
        <p style={{
          color: COLORS.text,
          fontSize: '12px',
          opacity: 0.6,
          marginTop: '12px'
        }}>
          {t('activity.premium.subtitle')}
        </p>
      </div>
    );
  };

  if (!userData || userData.hideBMI) {
    // Zeige trotzdem Bewegungsempfehlungen, auch wenn BMI ausgeblendet ist
    return (
      <div style={{ 
        minHeight: '100vh',
        background: currentPhase ? currentPhase.gradient : COLORS.background,
        padding: '40px 20px 120px'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <h2 style={{ 
          color: COLORS.text, 
          marginBottom: '32px', 
          fontSize: '32px', 
          fontWeight: '700',
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(255,255,255,0.8)'
        }}>
          {t('navigation.activity')}
        </h2>
        
        {userData?.hideBMI && (
          <div style={{
            padding: '12px 16px',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <p style={{ color: COLORS.text, fontSize: '13px', margin: 0, opacity: 0.8 }}>
              {t('activity.bmiHidden')}
            </p>
          </div>
        )}
        
        {/* Bewegungsempfehlungen ohne BMI */}
        {renderMovementRecommendations()}
        
        {/* Premium CTA */}
        {renderPremiumCTA()}
      </div>
      </div>
    );
  }

  const category = bmi ? getBMICategory(bmi) : null;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: currentPhase ? currentPhase.gradient : COLORS.background,
      padding: '40px 20px 120px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Header */}
        <h2 style={{ 
          color: COLORS.text, 
          marginBottom: '32px', 
          fontSize: '32px', 
          fontWeight: '700',
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(255,255,255,0.8)'
        }}>
          {t('navigation.activity')}
        </h2>

        {/* Bewegungsempfehlungen für aktuelle Phase - HAUPTFEATURE */}
        {currentPhase && renderMovementRecommendations()}
        
        {/* BMI Card - Sekundärer Inhalt in weißer Box */}
        {bmi && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: '32px 28px',
            marginBottom: '24px'
          }}>
          <div style={{
            textAlign: 'center'
          }}>
            <h3 style={{
              color: COLORS.text,
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '24px'
            }}>
              📊 {t('activity.yourBMI')}
            </h3>

            <div style={{
              fontSize: '56px',
              fontWeight: '700',
              color: category.color,
              marginBottom: '8px'
            }}>
              {bmi.toFixed(1)}
            </div>

            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: category.color,
              marginBottom: '24px'
            }}>
              {t(`activity.bmi.${category.key}`)}
            </div>

            {/* BMI Skala */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                position: 'relative',
                height: '40px',
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'linear-gradient(to right, #60A5FA 0%, #34D399 25%, #34D399 50%, #FBBF24 62.5%, #F87171 75%)',
                marginBottom: '12px'
              }}>
                {/* Marker für aktuellen BMI */}
                <div style={{
                  position: 'absolute',
                  left: `${getBMIPosition(bmi)}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '4px',
                  height: '50px',
                  backgroundColor: '#1F2937',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                }}>
                  {/* Pfeil oben */}
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '8px solid #1F2937'
                  }} />
                </div>
              </div>

              {/* Skalen-Beschriftung */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: COLORS.textLight,
                padding: '0 4px'
              }}>
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>35</span>
              </div>
            </div>

            {/* Kategorien-Legende */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginTop: '20px'
            }}>
              {[
                { key: 'underweight', color: '#60A5FA', range: '< 18.5' },
                { key: 'normal', color: '#34D399', range: '18.5-25' },
                { key: 'overweight', color: '#FBBF24', range: '25-30' },
                { key: 'obese', color: '#F87171', range: '> 30' }
              ].map((cat) => (
                <div
                  key={cat.key}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    border: `1.5px solid ${cat.key === category.key ? cat.color : 'rgba(226, 232, 240, 0.5)'}`,
                    fontSize: '12px',
                    fontWeight: cat.key === category.key ? '600' : '500',
                    opacity: cat.key === category.key ? 1 : 0.6
                  }}
                >
                  <div style={{ color: cat.color, marginBottom: '2px' }}>
                    {t(`activity.bmi.${cat.key}`)}
                  </div>
                  <div style={{ color: COLORS.textLight, fontSize: '11px' }}>
                    BMI {cat.range}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BMI Info & Warnung */}
          <div style={{
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            border: '1.5px solid rgba(251, 191, 36, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <AlertTriangle size={24} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{
                  color: COLORS.text,
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  ⚠️ {t('activity.bmiWarning.title')}
                </h4>
                <p style={{
                  color: COLORS.text,
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {t('activity.bmiWarning.text')}
                </p>
              </div>
            </div>
          </div>

          {/* Zusätzliche Infos */}
          <div style={{
            backgroundColor: COLORS.cardBg,
            borderRadius: '16px',
            padding: '20px',
            border: '1.5px solid rgba(226, 232, 240, 0.5)'
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <Info size={24} color={COLORS.follicular} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{
                  color: COLORS.text,
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  💡 {t('activity.bmiInfo.title')}
                </h4>
                <ul style={{
                  color: COLORS.text,
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: 0,
                  paddingLeft: '20px'
                }}>
                  <li>{t('activity.bmiInfo.point1')}</li>
                  <li>{t('activity.bmiInfo.point2')}</li>
                  <li>{t('activity.bmiInfo.point3')}</li>
                </ul>
              </div>
            </div>
          </div>
          </div>
        )}

      {/* Premium CTA */}
      {renderPremiumCTA()}

      {/* Keine Daten verfügbar */}
      {!bmi && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '40px 28px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚖️</div>
          <h3 style={{
            color: COLORS.text,
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            {t('activity.noData.title')}
          </h3>
          <p style={{
            color: COLORS.textLight,
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            {t('activity.noData.text')}
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default ActivityScreen;