import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { COLORS } from '../utils/cycleHelpers';

const DayDetailModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  cycleDay, 
  phaseName,
  isPeriodDay,
  isFutureDay,
  hasActivePeriod,
  onSaveTracking,
  onMarkPeriodStart,
  onMarkPeriodEnd 
}) => {
  const { t } = useTranslation();
  const [mood, setMood] = useState(3);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showSymptomDropdown, setShowSymptomDropdown] = useState(false);
  const [customSymptomInput, setCustomSymptomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('');
  const [flowIntensity, setFlowIntensity] = useState(0);

  // Lade custom Symptome aus localStorage
  const [customSymptoms, setCustomSymptoms] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('customSymptoms');
    if (saved) {
      setCustomSymptoms(JSON.parse(saved));
    }
  }, []);

  if (!isOpen || !selectedDate) return null;
  
  const isPastDay = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };
  
  const isPast = isPastDay();
  const canEdit = !isPast && !isFutureDay;

  const dateString = selectedDate.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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

  // Alle verfügbaren Symptome (vordefiniert + custom)
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
    
    // Füge zu selectedSymptoms hinzu
    setSelectedSymptoms([...selectedSymptoms, newSymptom]);
    
    // Füge zu customSymptoms hinzu falls noch nicht vorhanden
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
    onSaveTracking({
      date: selectedDate.toISOString(),
      mood,
      symptoms: selectedSymptoms.map(s => s.label),
      weight: weight ? parseFloat(weight) : null,
      temperature: temperature ? parseFloat(temperature) : null,
      flowIntensity: isPeriodDay ? flowIntensity : null
    });
    onClose();
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
        backgroundColor: COLORS.background,
        borderRadius: '24px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        overflowX: 'hidden',
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
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: COLORS.textLight
          }}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h2 style={{ color: COLORS.text, marginBottom: '8px', fontSize: '24px', fontWeight: '600' }}>
          {dateString}
        </h2>
        <p style={{ color: COLORS.textLight, marginBottom: '24px', fontSize: '14px' }}>
          {phaseName} • {t('calendar.cycleDay', { day: cycleDay })}
          {isPast && ` • ${t('calendar.pastDay')}`}
          {isFutureDay && ' • Zukunft (nicht bearbeitbar)'}
        </p>

        {/* Periode Buttons */}
        {!isPast && !isFutureDay && !hasActivePeriod && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            <button
              onClick={() => {
                onMarkPeriodStart(selectedDate);
                onClose();
              }}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: COLORS.menstruation,
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                color: COLORS.text,
                fontSize: '14px'
              }}
            >
              🩸 {t('calendar.periodStart')}
            </button>
          </div>
        )}
        
        {!isPast && !isFutureDay && hasActivePeriod && (
          <div style={{ marginBottom: '32px' }}>
            <button
              onClick={() => {
                onMarkPeriodEnd(selectedDate);
                onClose();
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: COLORS.follicular,
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                color: COLORS.text,
                fontSize: '14px'
              }}
            >
              ✓ {t('calendar.periodEnd')}
            </button>
          </div>
        )}

        {/* Info für vergangene/zukünftige Tage */}
        {(isPast || isFutureDay) && (
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(184, 230, 213, 0.2)',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <p style={{ color: COLORS.textLight, fontSize: '14px', margin: 0 }}>
              📖 {isPast ? t('calendar.pastDayInfo') : 'Zukünftige Tage können nicht bearbeitet werden'}
            </p>
          </div>
        )}

        {/* Tracking Section */}
        {canEdit && (
          <>
            <h3 style={{ color: COLORS.text, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
              {t('calendar.trackingTitle')}
            </h3>

            {/* Blutstärke */}
            {isPeriodDay && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: COLORS.text, marginBottom: '12px', fontSize: '16px' }}>
                  {t('calendar.flowIntensity')}
                </h4>
                <p style={{ color: COLORS.textLight, fontSize: '13px', marginBottom: '12px' }}>
                  {t('calendar.selectFlow')}
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map((intensity) => (
                    <button
                      key={intensity}
                      onClick={() => setFlowIntensity(intensity)}
                      style={{
                        padding: '16px 12px',
                        fontSize: '20px',
                        backgroundColor: flowIntensity >= intensity ? COLORS.menstruation : 'transparent',
                        border: `2px solid ${flowIntensity >= intensity ? COLORS.menstruation : 'rgba(226, 232, 240, 0.5)'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        minWidth: '50px'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '1px' }}>
                        {Array.from({ length: intensity }).map((_, i) => (
                          <span key={i} style={{ fontSize: '12px' }}>🩸</span>
                        ))}
                      </div>
                      <span style={{ fontSize: '10px', color: COLORS.textLight }}>{intensity}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stimmung */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: COLORS.text, marginBottom: '12px', fontSize: '16px' }}>
                {t('tracking.mood.title')}
              </h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                {moodEmojis.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMood(idx + 1)}
                    title={m.label}
                    style={{
                      flex: 1,
                      padding: '12px',
                      fontSize: '24px',
                      backgroundColor: mood === idx + 1 ? m.color : 'transparent',
                      border: `2px solid ${mood === idx + 1 ? m.color : 'rgba(226, 232, 240, 0.5)'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptome - Neue Dropdown-Version */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: COLORS.text, marginBottom: '12px', fontSize: '16px' }}>
                {t('tracking.symptoms.title')}
              </h4>
              
              {/* Ausgewählte Symptome als Pills */}
              {selectedSymptoms.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  {selectedSymptoms.map(symptom => (
                    <div
                      key={symptom.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        backgroundColor: COLORS.follicular,
                        borderRadius: '20px',
                        fontSize: '14px',
                        color: COLORS.text,
                        fontWeight: '500'
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
                          color: COLORS.text
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedSymptoms.length === 0 && (
                <p style={{ 
                  color: COLORS.textLight, 
                  fontSize: '13px', 
                  marginBottom: '12px',
                  fontStyle: 'italic'
                }}>
                  {t('tracking.symptoms.noSymptoms')}
                </p>
              )}

              {/* Custom Input anzeigen */}
              {showCustomInput && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={customSymptomInput}
                      onChange={(e) => setCustomSymptomInput(e.target.value)}
                      placeholder={t('tracking.symptoms.enterCustom')}
                      style={{
                        flex: 1,
                        padding: '10px',
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
                        padding: '10px 16px',
                        backgroundColor: COLORS.follicular,
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: COLORS.text,
                        fontSize: '14px'
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
                        padding: '10px 16px',
                        backgroundColor: 'transparent',
                        border: '1.5px solid rgba(226, 232, 240, 0.5)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: COLORS.text,
                        fontSize: '14px'
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
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: '1.5px solid rgba(226, 232, 240, 0.5)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      color: COLORS.text,
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Plus size={18} />
                    {t('tracking.symptoms.add')}
                  </button>

                  {/* Dropdown */}
                  {showSymptomDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: '4px',
                      backgroundColor: COLORS.cardBg,
                      border: '1.5px solid rgba(226, 232, 240, 0.5)',
                      borderRadius: '8px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 10,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      {availableSymptoms.map(symptom => (
                        <button
                          key={symptom.key}
                          onClick={() => handleAddSymptom(symptom)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            textAlign: 'left',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid rgba(226, 232, 240, 0.3)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: COLORS.text,
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(184, 230, 213, 0.2)'}
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
                          padding: '12px',
                          textAlign: 'left',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: COLORS.follicular,
                          fontWeight: '600',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(184, 230, 213, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        + {t('tracking.symptoms.other')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Gewicht & Temperatur */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', color: COLORS.text, fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
                  {t('tracking.weight.title')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder={t('tracking.weight.placeholder')}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1.5px solid rgba(226, 232, 240, 0.5)',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: COLORS.text
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: COLORS.text, fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
                  {t('tracking.temperature.title')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder={t('tracking.temperature.placeholder')}
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1.5px solid rgba(226, 232, 240, 0.5)',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: COLORS.text
                  }}
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: COLORS.follicular,
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px',
                color: COLORS.text,
                boxShadow: `0 0 25px ${COLORS.follicular}60`
              }}
            >
              {t('tracking.buttons.save')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DayDetailModal;