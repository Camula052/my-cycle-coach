import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const COLORS = {
  follicular: '#B8E6D5',
  cardBg: '#FFFFFF',
  text: '#2D3748',
  textLight: '#718096',
  background: '#FEFEFE'
};

const ProfileScreen = ({ userData, onEditProfile }) => {
  const { t, language, changeLanguage } = useTranslation();
  
  // Lokale States für Bearbeitung
  const [localUserData, setLocalUserData] = useState(userData || {});
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState('');
  
  // Lade custom Symptome
  useEffect(() => {
    const saved = localStorage.getItem('customSymptoms');
    if (saved) {
      setCustomSymptoms(JSON.parse(saved));
    }
  }, []);
  
  // Update wenn userData sich ändert
  useEffect(() => {
    if (userData) {
      setLocalUserData(userData);
    }
  }, [userData]);

  const motivationOptions = [
    { key: 'loseWeight', label: t('onboarding.motivation.loseWeight') },
    { key: 'gainWeight', label: t('onboarding.motivation.gainWeight') },
    { key: 'getFit', label: t('onboarding.motivation.getFit') },
    { key: 'knowBody', label: t('onboarding.motivation.knowBody') },
    { key: 'contraception', label: t('onboarding.motivation.contraception') }
  ];

  const handleStartEdit = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue || '');
  };

  const handleSaveField = (field) => {
    const updated = { ...localUserData, [field]: tempValue };
    setLocalUserData(updated);
    localStorage.setItem('userData', JSON.stringify(updated));
    setEditingField(null);
    setTempValue('');
    
    // Notify parent
    if (onEditProfile) {
      onEditProfile(updated);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const toggleMotivation = (key) => {
    const currentMotivations = localUserData.motivations || [];
    const updated = {
      ...localUserData,
      motivations: currentMotivations.includes(key)
        ? currentMotivations.filter(m => m !== key)
        : [...currentMotivations, key]
    };
    setLocalUserData(updated);
    localStorage.setItem('userData', JSON.stringify(updated));
    
    if (onEditProfile) {
      onEditProfile(updated);
    }
  };

  const handleAddSymptom = () => {
    if (!newSymptom.trim()) return;
    
    const updated = [...customSymptoms, newSymptom.trim()];
    setCustomSymptoms(updated);
    localStorage.setItem('customSymptoms', JSON.stringify(updated));
    setNewSymptom('');
  };

  const handleRemoveSymptom = (index) => {
    const updated = customSymptoms.filter((_, i) => i !== index);
    setCustomSymptoms(updated);
    localStorage.setItem('customSymptoms', JSON.stringify(updated));
  };

  const handleDebugReset = () => {
    if (window.confirm(t('profile.debugConfirm'))) {
      localStorage.clear();
      window.location.reload();
    }
  };
  
  if (!userData) {
    return (
      <div style={{ padding: '20px', paddingBottom: '100px', textAlign: 'center' }}>
        <h2 style={{ color: COLORS.text, marginBottom: '16px' }}>{t('navigation.profile')}</h2>
        <p style={{ color: COLORS.textLight }}>{t('profile.noData')}</p>
      </div>
    );
  }

  const EditableField = ({ label, field, value, type = 'text', step = undefined }) => (
    <div style={{
      padding: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '12px',
      border: '1px solid rgba(226, 232, 240, 0.5)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: editingField === field ? '12px' : '0'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            color: COLORS.textLight,
            fontSize: '13px',
            marginBottom: '4px'
          }}>
            {label}
          </div>
          {editingField === field ? (
            <input
              type={type}
              step={step}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '16px',
                border: '1.5px solid ' + COLORS.follicular,
                borderRadius: '8px',
                backgroundColor: COLORS.background,
                color: COLORS.text
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSaveField(field);
              }}
            />
          ) : (
            <div style={{
              color: COLORS.text,
              fontSize: '16px',
              fontWeight: '500'
            }}>
              {value || '-'}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
          {editingField === field ? (
            <>
              <button
                onClick={() => handleSaveField(field)}
                style={{
                  padding: '8px',
                  backgroundColor: COLORS.follicular,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: COLORS.text
                }}
              >
                <Save size={16} />
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: '1.5px solid rgba(226, 232, 240, 0.5)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: COLORS.text
                }}
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => handleStartEdit(field, value)}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: '1.5px solid rgba(226, 232, 240, 0.5)',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: COLORS.text
              }}
            >
              <Edit2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
  
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
        {t('navigation.profile')}
      </h2>
      
      {/* Persönliche Daten */}
      <div style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        border: '1.5px solid rgba(226, 232, 240, 0.5)'
      }}>
        <h3 style={{ 
          color: COLORS.text, 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '16px' 
        }}>
          👤 {t('profile.personalData')}
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <EditableField 
            label={t('onboarding.name')}
            field="name"
            value={localUserData.name}
          />
          <EditableField 
            label={t('profile.birthdate')}
            field="birthdate"
            value={localUserData.birthdate}
            type="date"
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <EditableField 
              label={t('onboarding.height') + ' (cm)'}
              field="height"
              value={localUserData.height}
              type="number"
            />
            <EditableField 
              label={t('onboarding.weight') + ' (kg)'}
              field="weight"
              value={localUserData.weight}
              type="number"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Motivationen */}
      <div style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        border: '1.5px solid rgba(226, 232, 240, 0.5)'
      }}>
        <h3 style={{ 
          color: COLORS.text, 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '16px' 
        }}>
          🎯 {t('onboarding.motivation.title')}
        </h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          {motivationOptions.map(option => (
            <button
              key={option.key}
              onClick={() => toggleMotivation(option.key)}
              style={{
                padding: '14px',
                textAlign: 'left',
                backgroundColor: (localUserData.motivations || []).includes(option.key)
                  ? `${COLORS.follicular}40`
                  : 'rgba(255, 255, 255, 0.5)',
                border: `1.5px solid ${
                  (localUserData.motivations || []).includes(option.key)
                    ? COLORS.follicular
                    : 'rgba(226, 232, 240, 0.5)'
                }`,
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                color: COLORS.text,
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Symptome */}
      <div style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        border: '1.5px solid rgba(226, 232, 240, 0.5)'
      }}>
        <h3 style={{ 
          color: COLORS.text, 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '16px' 
        }}>
          💊 {t('onboarding.customSymptoms.title')}
        </h3>
        
        {/* Liste der Custom Symptome */}
        {customSymptoms.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px',
            marginBottom: '16px'
          }}>
            {customSymptoms.map((symptom, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: `${COLORS.follicular}40`,
                  border: `1.5px solid ${COLORS.follicular}`,
                  borderRadius: '16px',
                  fontSize: '14px',
                  color: COLORS.text,
                  fontWeight: '500'
                }}
              >
                {symptom}
                <button
                  onClick={() => handleRemoveSymptom(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    color: COLORS.text,
                    opacity: 0.7
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Neues Symptom hinzufügen */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newSymptom}
            onChange={(e) => setNewSymptom(e.target.value)}
            placeholder={t('onboarding.customSymptoms.placeholder')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '14px',
              border: '1.5px solid rgba(226, 232, 240, 0.5)',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              color: COLORS.text
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAddSymptom();
            }}
          />
          <button
            onClick={handleAddSymptom}
            style={{
              padding: '12px 16px',
              backgroundColor: COLORS.follicular,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: COLORS.text,
              boxShadow: `0 0 15px ${COLORS.follicular}40`
            }}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Zyklusdaten */}
      <div style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        border: '1.5px solid rgba(226, 232, 240, 0.5)'
      }}>
        <h3 style={{ 
          color: COLORS.text, 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '16px' 
        }}>
          🩸 {t('profile.cycleData')}
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <EditableField 
            label={t('onboarding.lastPeriod.startDate')}
            field="periodStartDate"
            value={localUserData.periodStartDate}
            type="date"
          />
          <EditableField 
            label={t('onboarding.lastPeriod.duration') + ' (Tage)'}
            field="periodDuration"
            value={localUserData.periodDuration}
            type="number"
          />
        </div>
      </div>

      {/* Sprache */}
      <div style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        border: '1.5px solid rgba(226, 232, 240, 0.5)'
      }}>
        <h3 style={{ 
          color: COLORS.text, 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '16px' 
        }}>
          🌍 {t('profile.language')}
        </h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => changeLanguage('de')}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: language === 'de' ? COLORS.follicular : 'rgba(255, 255, 255, 0.5)',
              border: `1.5px solid ${language === 'de' ? COLORS.follicular : 'rgba(226, 232, 240, 0.5)'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              color: COLORS.text,
              transition: 'all 0.2s ease'
            }}
          >
            🇩🇪 Deutsch
          </button>
          <button
            onClick={() => changeLanguage('en')}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: language === 'en' ? COLORS.follicular : 'rgba(255, 255, 255, 0.5)',
              border: `1.5px solid ${language === 'en' ? COLORS.follicular : 'rgba(226, 232, 240, 0.5)'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              color: COLORS.text,
              transition: 'all 0.2s ease'
            }}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {/* BMI Einstellungen */}
      <div style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        border: '1.5px solid rgba(226, 232, 240, 0.5)'
      }}>
        <h3 style={{ 
          color: COLORS.text, 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '16px' 
        }}>
          📊 {t('profile.bmiSettings')}
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '12px',
          border: '1px solid rgba(226, 232, 240, 0.5)'
        }}>
          <div>
            <div style={{
              color: COLORS.text,
              fontSize: '15px',
              fontWeight: '500',
              marginBottom: '4px'
            }}>
              {t('profile.showBMI')}
            </div>
            <div style={{
              color: COLORS.textLight,
              fontSize: '13px'
            }}>
              {t('profile.showBMIDescription')}
            </div>
          </div>
          <button
            onClick={() => {
              const updated = { ...localUserData, hideBMI: !localUserData.hideBMI };
              setLocalUserData(updated);
              localStorage.setItem('userData', JSON.stringify(updated));
              if (onEditProfile) onEditProfile(updated);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: localUserData.hideBMI ? 'rgba(226, 232, 240, 0.5)' : COLORS.follicular,
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: COLORS.text,
              transition: 'all 0.2s ease',
              minWidth: '80px'
            }}
          >
            {localUserData.hideBMI ? 'Aus' : 'An'}
          </button>
        </div>
      </div>

      {/* Debug Reset */}
      <div style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        border: '1.5px solid rgba(239, 68, 68, 0.3)'
      }}>
        <h3 style={{ 
          color: '#DC2626', 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '12px' 
        }}>
          ⚠️ {t('profile.dangerZone')}
        </h3>
        <p style={{
          color: COLORS.textLight,
          fontSize: '14px',
          marginBottom: '16px',
          lineHeight: '1.5'
        }}>
          {t('profile.resetInfo')}
        </p>
        <button
          onClick={handleDebugReset}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#DC2626',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#B91C1C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#DC2626';
          }}
        >
          {t('profile.resetButton')}
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;