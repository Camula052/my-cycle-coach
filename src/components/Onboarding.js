import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const COLORS = {
  menstruation: '#E6B89C',
  follicular: '#B8E6D5',
  ovulation: '#F5C2C7',
  luteal: '#F9E4B7',
  background: '#FEFEFE',
  cardBg: '#FFFFFF',
  text: '#2D3748',
  textLight: '#718096'
};

const Onboarding = ({ onComplete }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    motivations: [],
    periodStartDate: '',
    periodDuration: '5'
  });
  const [showContraceptionWarning, setShowContraceptionWarning] = useState(false);

  const motivationOptions = [
    { key: 'loseWeight', label: t('onboarding.motivation.loseWeight') },
    { key: 'gainWeight', label: t('onboarding.motivation.gainWeight') },
    { key: 'getFit', label: t('onboarding.motivation.getFit') },
    { key: 'knowBody', label: t('onboarding.motivation.knowBody') },
    { key: 'contraception', label: t('onboarding.motivation.contraception') }
  ];

  const toggleMotivation = (key) => {
    setUserData(prev => {
      const motivations = prev.motivations.includes(key)
        ? prev.motivations.filter(m => m !== key)
        : [...prev.motivations, key];
      
      // Zeige Warning wenn Verhütung ausgewählt
      setShowContraceptionWarning(motivations.includes('contraception'));
      
      return { ...prev, motivations };
    });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Onboarding abgeschlossen - speichere Daten
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('onboardingComplete', 'true');
      onComplete(userData);
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return userData.name.trim() !== '';
    }
    if (step === 2) {
      return userData.motivations.length > 0;
    }
    if (step === 3) {
      return userData.periodStartDate !== '';
    }
    return false;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #B8E6D5 0%, #F5C2C7 100%)',
      zIndex: 2000,
      overflowY: 'auto',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        paddingTop: '40px'
      }}>
        {/* Welcome Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '16px'
          }}>
            🌸
          </div>
          <h1 style={{
            color: COLORS.text,
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            {t('onboarding.welcome')}
          </h1>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '24px'
          }}>
            {[1, 2, 3].map(s => (
              <div
                key={s}
                style={{
                  width: '40px',
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: step >= s ? COLORS.follicular : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Persönliche Daten */}
        {step === 1 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '24px',
            padding: '32px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: COLORS.text,
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                {t('onboarding.name')}
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid rgba(226, 232, 240, 0.5)',
                  borderRadius: '12px',
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: COLORS.text,
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                {t('onboarding.age')}
              </label>
              <input
                type="number"
                value={userData.age}
                onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid rgba(226, 232, 240, 0.5)',
                  borderRadius: '12px',
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{
                  display: 'block',
                  color: COLORS.text,
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {t('onboarding.height')}
                </label>
                <input
                  type="number"
                  value={userData.height}
                  onChange={(e) => setUserData({ ...userData, height: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid rgba(226, 232, 240, 0.5)',
                    borderRadius: '12px',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  color: COLORS.text,
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {t('onboarding.weight')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={userData.weight}
                  onChange={(e) => setUserData({ ...userData, weight: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid rgba(226, 232, 240, 0.5)',
                    borderRadius: '12px',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Motivation */}
        {step === 2 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '24px',
            padding: '32px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              color: COLORS.text,
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              {t('onboarding.motivation.title')}
            </h3>

            <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
              {motivationOptions.map(option => (
                <button
                  key={option.key}
                  onClick={() => toggleMotivation(option.key)}
                  style={{
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '500',
                    textAlign: 'left',
                    backgroundColor: userData.motivations.includes(option.key)
                      ? `${COLORS.follicular}60`
                      : 'transparent',
                    border: `2px solid ${
                      userData.motivations.includes(option.key)
                        ? COLORS.follicular
                        : 'rgba(226, 232, 240, 0.5)'
                    }`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: COLORS.text,
                    boxShadow: userData.motivations.includes(option.key)
                      ? `0 0 20px ${COLORS.follicular}40`
                      : 'none'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {showContraceptionWarning && (
              <div style={{
                padding: '16px',
                backgroundColor: `${COLORS.ovulation}40`,
                border: `1.5px solid ${COLORS.ovulation}`,
                borderRadius: '12px',
                fontSize: '14px',
                color: COLORS.text,
                lineHeight: '1.5'
              }}>
                ⚠️ {t('onboarding.contraceptionWarning')}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Letzte Periode */}
        {step === 3 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '24px',
            padding: '32px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              color: COLORS.text,
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              {t('onboarding.lastPeriod.title')}
            </h3>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: COLORS.text,
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                {t('onboarding.lastPeriod.startDate')}
              </label>
              <input
                type="date"
                value={userData.periodStartDate}
                onChange={(e) => setUserData({ ...userData, periodStartDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid rgba(226, 232, 240, 0.5)',
                  borderRadius: '12px',
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: COLORS.text,
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                {t('onboarding.lastPeriod.duration')}
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={userData.periodDuration}
                onChange={(e) => setUserData({ ...userData, periodDuration: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid rgba(226, 232, 240, 0.5)',
                  borderRadius: '12px',
                  backgroundColor: 'transparent'
                }}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '24px'
        }}>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                flex: 1,
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                border: '2px solid rgba(226, 232, 240, 0.5)',
                borderRadius: '12px',
                cursor: 'pointer',
                color: COLORS.text
              }}
            >
              ← Zurück
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: canProceed() ? COLORS.follicular : 'rgba(200, 200, 200, 0.5)',
              border: 'none',
              borderRadius: '12px',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              color: COLORS.text,
              boxShadow: canProceed() ? `0 0 25px ${COLORS.follicular}60` : 'none',
              opacity: canProceed() ? 1 : 0.5
            }}
          >
            {step === 3 ? t('onboarding.buttons.start') : t('onboarding.buttons.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;