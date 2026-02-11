import React, { useState, useEffect } from 'react';
import { Info, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { COLORS } from '../utils/cycleHelpers';

const ActivityScreen = ({ userData }) => {
  const { t } = useTranslation();
  const [bmi, setBMI] = useState(null);
  const [age, setAge] = useState(null);

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
      // Fallback auf altes Alter-Feld
      setAge(parseInt(userData.age));
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

  if (!userData || userData.hideBMI) {
    return (
      <div style={{ padding: '20px', paddingBottom: '100px' }}>
        <h2 style={{ color: COLORS.text, marginBottom: '24px', fontSize: '28px', fontWeight: '700' }}>
          {t('navigation.activity')}
        </h2>
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: COLORS.cardBg,
          borderRadius: '16px',
          border: '1.5px solid rgba(226, 232, 240, 0.5)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏃‍♀️</div>
          <p style={{ color: COLORS.textLight, fontSize: '16px' }}>
            {userData?.hideBMI ? t('activity.bmiHidden') : t('activity.comingSoon')}
          </p>
        </div>
      </div>
    );
  }

  const category = bmi ? getBMICategory(bmi) : null;

  return (
    <div style={{ 
      padding: '20px', 
      paddingBottom: '100px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ 
        color: COLORS.text, 
        marginBottom: '24px', 
        fontSize: '28px', 
        fontWeight: '700' 
      }}>
        {t('navigation.activity')}
      </h2>

      {/* BMI Card */}
      {bmi && (
        <>
          <div style={{
            backgroundColor: COLORS.cardBg,
            borderRadius: '20px',
            padding: '28px',
            marginBottom: '20px',
            border: '1.5px solid rgba(226, 232, 240, 0.5)',
            textAlign: 'center'
          }}>
            <h3 style={{
              color: COLORS.text,
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px'
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
        </>
      )}

      {/* Keine Daten verfügbar */}
      {!bmi && (
        <div style={{
          backgroundColor: COLORS.cardBg,
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          border: '1.5px solid rgba(226, 232, 240, 0.5)'
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
  );
};

export default ActivityScreen;