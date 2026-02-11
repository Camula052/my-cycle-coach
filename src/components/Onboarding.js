import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    birthdate: '',
    height: '',
    weight: '',
    motivations: [],
    customSymptoms: [],
    periodStartDate: '',
    periodDuration: '5',
    hideBMI: false
  });
  const [showContraceptionWarning, setShowContraceptionWarning] = useState(false);
  const [newSymptom, setNewSymptom] = useState('');
  const [showPredefinedSymptoms, setShowPredefinedSymptoms] = useState(false);

  const motivationOptions = [
    { key: 'loseWeight', label: t('onboarding.motivation.loseWeight') },
    { key: 'gainWeight', label: t('onboarding.motivation.gainWeight') },
    { key: 'getFit', label: t('onboarding.motivation.getFit') },
    { key: 'knowBody', label: t('onboarding.motivation.knowBody') },
    { key: 'contraception', label: t('onboarding.motivation.contraception') }
  ];

  const predefinedSymptoms = [
    t('tracking.symptoms.headache'),
    t('tracking.symptoms.backPain'),
    t('tracking.symptoms.shoulderPain'),
    t('tracking.symptoms.abdominalPain'),
    t('tracking.symptoms.cramps'),
    t('tracking.symptoms.cold'),
    t('tracking.symptoms.hot'),
    t('tracking.symptoms.sweaty'),
    t('tracking.symptoms.bloated'),
    t('tracking.symptoms.listless'),
    t('tracking.symptoms.cravings')
  ];

  const toggleMotivation = (key) => {
    setUserData(prev => {
      const motivations = prev.motivations.includes(key)
        ? prev.motivations.filter(m => m !== key)
        : [...prev.motivations, key];
      
      setShowContraceptionWarning(motivations.includes('contraception'));
      
      return { ...prev, motivations };
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('onboardingComplete', 'true');
      
      if (userData.customSymptoms.length > 0) {
        localStorage.setItem('customSymptoms', JSON.stringify(userData.customSymptoms));
      }
      
      onComplete(userData);
    }
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return userData.name.trim() !== '';
    if (step === 2) return userData.motivations.length > 0;
    if (step === 3) return true;
    if (step === 4) return userData.periodStartDate !== '';
    return false;
  };
  
  const addCustomSymptom = () => {
    if (newSymptom.trim() !== '') {
      setUserData(prev => ({
        ...prev,
        customSymptoms: [...prev.customSymptoms, newSymptom.trim()]
      }));
      setNewSymptom('');
    }
  };
  
  const removeCustomSymptom = (index) => {
    setUserData(prev => ({
      ...prev,
      customSymptoms: prev.customSymptoms.filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, ${COLORS.follicular} 0%, ${COLORS.ovulation} 50%, ${COLORS.luteal} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflowY: 'auto',
      zIndex: 9999
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {/* Welcome Screen */}
        {step === 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '24px',
            padding: '48px 32px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🌸</div>
            <h1 style={{
              color: COLORS.text,
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              {t('onboarding.welcome')}
            </h1>
            <p style={{
              color: COLORS.textLight,
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              {t('onboarding.intro')}
            </p>
            <button
              onClick={handleNext}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '18px',
                fontWeight: '600',
                background: COLORS.follicular,
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                color: COLORS.text,
                boxShadow: `0 0 30px ${COLORS.follicular}60`
              }}
            >
              {t('onboarding.buttons.start')}
            </button>
          </div>
        )}

        {/* Personal Data */}
        {step === 1 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '24px',
            padding: '32px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  color: COLORS.text,
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {t('onboarding.name')} *
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

              <div>
                <label style={{
                  display: 'block',
                  color: COLORS.text,
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {t('profile.birthdate')}
                </label>
                <input
                  type="date"
                  value={userData.birthdate}
                  onChange={(e) => setUserData({ ...userData, birthdate: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
          </div>
        )}

        {/* Motivations */}
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

        {/* Custom Symptoms - NEU */}
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
              marginBottom: '8px',
              textAlign: 'center'
            }}>
              {t('onboarding.customSymptoms.title')}
            </h3>
            
            {/* Info-Text */}
            <div style={{
              padding: '16px',
              backgroundColor: `${COLORS.follicular}20`,
              borderRadius: '12px',
              marginBottom: '24px',
              border: `1px solid ${COLORS.follicular}40`
            }}>
              <p style={{
                color: COLORS.text,
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0
              }}>
                💡 {t('onboarding.customSymptoms.info')}
              </p>
            </div>

            {/* Vordefinierte Symptome Toggle */}
            <button
              onClick={() => setShowPredefinedSymptoms(!showPredefinedSymptoms)}
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: '16px',
                backgroundColor: 'transparent',
                border: '1.5px solid rgba(226, 232, 240, 0.5)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                color: COLORS.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.follicular;
                e.currentTarget.style.backgroundColor = `${COLORS.follicular}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.5)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span>📋 {t('onboarding.customSymptoms.viewPredefined')}</span>
              {showPredefinedSymptoms ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {/* Liste der vordefinierten Symptome */}
            {showPredefinedSymptoms && (
              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid rgba(226, 232, 240, 0.5)'
              }}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {predefinedSymptoms.map((symptom, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'rgba(184, 230, 213, 0.3)',
                        borderRadius: '16px',
                        fontSize: '13px',
                        color: COLORS.text,
                        fontWeight: '500'
                      }}
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Eigene Symptome hinzufügen */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{
                color: COLORS.text,
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                ✏️ {t('onboarding.customSymptoms.addOwn')}
              </h4>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
                  placeholder={t('onboarding.customSymptoms.placeholder')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid rgba(226, 232, 240, 0.5)',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    color: COLORS.text
                  }}
                />
                <button
                  onClick={addCustomSymptom}
                  style={{
                    padding: '12px 20px',
                    fontSize: '16px',
                    background: COLORS.follicular,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: COLORS.text,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: `0 0 20px ${COLORS.follicular}40`
                  }}
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Custom Symptom Pills */}
              {userData.customSymptoms.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {userData.customSymptoms.map((symptom, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        backgroundColor: COLORS.follicular,
                        borderRadius: '16px',
                        fontSize: '14px',
                        color: COLORS.text,
                        fontWeight: '500'
                      }}
                    >
                      {symptom}
                      <button
                        onClick={() => removeCustomSymptom(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          color: COLORS.text
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Period Info */}
        {step === 4 && (
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

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  color: COLORS.text,
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {t('onboarding.lastPeriod.startDate')} *
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

              <div>
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
          </div>
        )}

        {/* Navigation Buttons */}
        {step > 0 && (
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  flex: 1,
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '2px solid rgba(226, 232, 240, 0.5)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: COLORS.text
                }}
              >
                {t('onboarding.buttons.skip')}
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
                background: canProceed() ? COLORS.follicular : 'rgba(226, 232, 240, 0.5)',
                border: 'none',
                borderRadius: '12px',
                cursor: canProceed() ? 'pointer' : 'not-allowed',
                color: COLORS.text,
                boxShadow: canProceed() ? `0 0 30px ${COLORS.follicular}60` : 'none',
                opacity: canProceed() ? 1 : 0.5
              }}
            >
              {step === 4 ? t('onboarding.buttons.start') : t('onboarding.buttons.next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;