import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { COLORS } from '../utils/cycleHelpers';

const DailyTrackingModal = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const [mood, setMood] = useState(3);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showSymptomDropdown, setShowSymptomDropdown] = useState(false);
  const [customSymptomInput, setCustomSymptomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('');

  // Lade custom Symptome aus localStorage
  const [customSymptoms, setCustomSymptoms] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('customSymptoms');
    if (saved) {
      setCustomSymptoms(JSON.parse(saved));
    }
  }, []);

  const moodEmojis = [
    { emoji: '😢', color: '#94A3B8', label: t('tracking.mood.veryBad') },
    { emoji: '😟', color: '#CBD5E1', label: t('tracking.mood.bad') },
    { emoji: '😐', color: '#FDE68A', label: t('tracking.mood.neutral') },
    { emoji: '🙂', color: '#FCD34D', label: t('tracking.mood.good') },
    { emoji: '😊', color: '#FDE047', label: t('tracking.mood.veryGood') }
  ];

  // Vordefinierte Symptome
  const predefinedSymptoms = [
    { key: 'headache', label: t('tracking.symptoms.headache') },
    { key: 'backPain', label: t('tracking.symptoms.backPain') },
    { key: 'shoulderPain', label: t('tracking.symptoms.shoulderPain') },
    { key: 'abdominalPain', label: t('tracking.symptoms.abdominalPain') },
    { key: 'cramps', label: t('tracking.symptoms.cramps') },
    { key: 'cold', label: t('tracking.symptoms.cold') },
    { key: 'hot', label: t('tracking.symptoms.hot') },
    { key: 'sweaty', label: t('tracking.symptoms.sweaty') },
    { key: 'bloated', label: t('tracking.symptoms.bloated') },
    { key: 'listless', label: t('tracking.symptoms.listless') },
    { key: 'cravings', label: t('tracking.symptoms.cravings') }
  ];

  // Alle verfügbaren Symptome
  const allSymptoms = [
    ...predefinedSymptoms,
    ...customSymptoms.map(s => ({ key: `custom_${s}`, label: s, isCustom: true }))
  ];

  // Verfügbare Symptome (noch nicht ausgewählt)
  const availableSymptoms = allSymptoms.filter(
    s => !selectedSymptoms.find(sel => sel.key === s.key)
  );

  const handleAddSymptom = (symptom) => {
    setSelectedSymptoms([...selectedSymptoms, symptom]);
    setShowSymptomDropdown(false);
  };

  const handleRemoveSymptom = (symptomKey) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.key !== symptomKey));
  };

  const handleAddCustomSymptom = () => {
    if (!customSymptomInput.trim()) return;
    
    const newSymptom = {
      key: `custom_${customSymptomInput}`,
      label: customSymptomInput,
      isCustom: true
    };
    
    setSelectedSymptoms([...selectedSymptoms, newSymptom]);
    
    if (!customSymptoms.includes(customSymptomInput)) {
      const updated = [...customSymptoms, customSymptomInput];
      setCustomSymptoms(updated);
      localStorage.setItem('customSymptoms', JSON.stringify(updated));
    }
    
    setCustomSymptomInput('');
    setShowCustomInput(false);
    setShowSymptomDropdown(false);
  };

  const handleSave = () => {
    onSave({
      mood,
      symptoms: selectedSymptoms.map(s => s.label),
      weight: weight ? parseFloat(weight) : null,
      temperature: temperature ? parseFloat(temperature) : null,
      date: new Date().toISOString()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: COLORS.background,
      zIndex: 1000,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: COLORS.text, fontSize: '24px', fontWeight: '600', margin: 0 }}>
            {t('tracking.title')}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: COLORS.textLight
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Stimmung */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: COLORS.text, marginBottom: '16px', fontSize: '18px' }}>
            {t('tracking.mood.title')}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            {moodEmojis.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setMood(idx + 1)}
                title={m.label}
                style={{
                  flex: 1,
                  padding: '16px',
                  fontSize: '32px',
                  backgroundColor: mood === idx + 1 ? m.color : 'transparent',
                  border: `2px solid ${mood === idx + 1 ? m.color : 'rgba(226, 232, 240, 0.5)'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: mood === idx + 1 ? `0 0 20px ${m.color}60` : 'none'
                }}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Symptome */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: COLORS.text, marginBottom: '16px', fontSize: '18px' }}>
            {t('tracking.symptoms.title')}
          </h3>
          
          {/* Ausgewählte Symptome als Pills */}
          {selectedSymptoms.length > 0 && (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px',
              marginBottom: '16px'
            }}>
              {selectedSymptoms.map(symptom => (
                <div
                  key={symptom.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    backgroundColor: `${COLORS.follicular}40`,
                    border: `1.5px solid ${COLORS.follicular}`,
                    borderRadius: '20px',
                    fontSize: '14px',
                    color: COLORS.text,
                    fontWeight: '500',
                    boxShadow: `0 0 15px ${COLORS.follicular}40`
                  }}
                >
                  {symptom.label}
                  <button
                    onClick={() => handleRemoveSymptom(symptom.key)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      color: COLORS.text,
                      opacity: 0.7,
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedSymptoms.length === 0 && (
            <p style={{ 
              color: COLORS.textLight, 
              fontSize: '14px', 
              marginBottom: '16px',
              fontStyle: 'italic',
              opacity: 0.7
            }}>
              {t('tracking.symptoms.noSymptoms')}
            </p>
          )}

          {/* Custom Input */}
          {showCustomInput && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={customSymptomInput}
                  onChange={(e) => setCustomSymptomInput(e.target.value)}
                  placeholder={t('tracking.symptoms.enterCustom')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontSize: '14px',
                    border: '1.5px solid rgba(226, 232, 240, 0.5)',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: COLORS.text
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddCustomSymptom();
                  }}
                  autoFocus
                />
                <button
                  onClick={handleAddCustomSymptom}
                  style={{
                    padding: '12px 18px',
                    backgroundColor: COLORS.follicular,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: COLORS.text,
                    fontSize: '16px',
                    boxShadow: `0 0 15px ${COLORS.follicular}40`
                  }}
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomSymptomInput('');
                  }}
                  style={{
                    padding: '12px 18px',
                    backgroundColor: 'transparent',
                    border: '1.5px solid rgba(226, 232, 240, 0.5)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: COLORS.text,
                    fontSize: '16px'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Dropdown oder Button */}
          {!showCustomInput && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSymptomDropdown(!showSymptomDropdown)}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: 'transparent',
                  border: '1.5px solid rgba(226, 232, 240, 0.5)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: COLORS.text,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
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
                <Plus size={20} />
                {t('tracking.symptoms.add')}
              </button>

              {/* Dropdown */}
              {showSymptomDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: COLORS.cardBg,
                  border: '1.5px solid rgba(226, 232, 240, 0.5)',
                  borderRadius: '12px',
                  maxHeight: '250px',
                  overflowY: 'auto',
                  zIndex: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }}>
                  {availableSymptoms.map(symptom => (
                    <button
                      key={symptom.key}
                      onClick={() => handleAddSymptom(symptom)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        textAlign: 'left',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(226, 232, 240, 0.3)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: COLORS.text,
                        transition: 'background-color 0.2s',
                        fontWeight: '500'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${COLORS.follicular}20`}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {symptom.label}
                    </button>
                  ))}
                  
                  {/* "Andere..." Option */}
                  <button
                    onClick={() => {
                      setShowCustomInput(true);
                      setShowSymptomDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      textAlign: 'left',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: COLORS.follicular,
                      fontWeight: '700',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${COLORS.follicular}20`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    + {t('tracking.symptoms.other')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Gewicht */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: COLORS.text, marginBottom: '8px', fontSize: '18px' }}>
            {t('tracking.weight.title')}
          </h3>
          <p style={{ color: COLORS.textLight, fontSize: '12px', marginBottom: '12px', opacity: 0.7 }}>
            {t('tracking.weight.warning')}
          </p>
          <input
            type="number"
            step="0.1"
            placeholder={t('tracking.weight.placeholder')}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1.5px solid rgba(226, 232, 240, 0.5)',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: COLORS.text
            }}
          />
        </div>

        {/* Basaltemperatur */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: COLORS.text, marginBottom: '8px', fontSize: '18px' }}>
            {t('tracking.temperature.title')}
          </h3>
          <p style={{ color: COLORS.textLight, fontSize: '12px', marginBottom: '12px', opacity: 0.7 }}>
            {t('tracking.temperature.info')}
          </p>
          <input
            type="number"
            step="0.01"
            placeholder={t('tracking.temperature.placeholder')}
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1.5px solid rgba(226, 232, 240, 0.5)',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: COLORS.text
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '16px',
              backgroundColor: 'transparent',
              border: '1.5px solid rgba(226, 232, 240, 0.5)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              color: COLORS.text,
              transition: 'all 0.3s ease'
            }}
          >
            {t('tracking.buttons.cancel')}
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '16px',
              background: COLORS.follicular,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              color: COLORS.text,
              boxShadow: `0 0 25px ${COLORS.follicular}60`,
              transition: 'all 0.3s ease'
            }}
          >
            {t('tracking.buttons.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyTrackingModal;