import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { COLORS } from '../utils/cycleHelpers';

const DailyTrackingModal = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const [mood, setMood] = useState(3);
  const [symptoms, setSymptoms] = useState({});
  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('');

  const moodEmojis = [
    { emoji: '😢', color: '#94A3B8', label: t('tracking.mood.veryBad') },
    { emoji: '😟', color: '#CBD5E1', label: t('tracking.mood.bad') },
    { emoji: '😐', color: '#FDE68A', label: t('tracking.mood.neutral') },
    { emoji: '🙂', color: '#FCD34D', label: t('tracking.mood.good') },
    { emoji: '😊', color: '#FDE047', label: t('tracking.mood.veryGood') }
  ];

  const symptomsList = [
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

  const handleSave = () => {
    onSave({
      mood,
      symptoms,
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
      padding: '20px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: COLORS.text, marginBottom: '24px', fontSize: '24px', fontWeight: '600' }}>
          {t('tracking.title')}
        </h2>

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {symptomsList.map(symptom => (
              <label
                key={symptom.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: symptoms[symptom.key] ? `${COLORS.follicular}40` : 'transparent',
                  border: `1.5px solid ${symptoms[symptom.key] ? COLORS.follicular : 'rgba(226, 232, 240, 0.5)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: COLORS.text,
                  transition: 'all 0.3s ease',
                  boxShadow: symptoms[symptom.key] ? `0 0 15px ${COLORS.follicular}40` : 'none'
                }}
              >
                <input
                  type="checkbox"
                  checked={symptoms[symptom.key] || false}
                  onChange={(e) => setSymptoms({ ...symptoms, [symptom.key]: e.target.checked })}
                  style={{ marginRight: '8px' }}
                />
                {symptom.label}
              </label>
            ))}
          </div>
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