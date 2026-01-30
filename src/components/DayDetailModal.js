import React, { useState } from 'react';
import { X } from 'lucide-react';
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
  const [symptoms, setSymptoms] = useState({});
  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('');
  const [flowIntensity, setFlowIntensity] = useState(0);

  if (!isOpen || !selectedDate) return null;
  
  // Prüfe ob Tag in der Vergangenheit liegt
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
    onSaveTracking({
      date: selectedDate.toISOString(),
      mood,
      symptoms,
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

        {/* Periode Buttons - nur für heute, nicht während aktiver Periode */}
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
        
        {/* Periode Ende Button - nur während aktiver Periode */}
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

        {/* Tracking Section - nur für heute */}
        {canEdit && (
          <>
            <h3 style={{ color: COLORS.text, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
              {t('calendar.trackingTitle')}
            </h3>

            {/* Blutstropfen - nur für Perioden-Tage */}
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

        {/* Symptome */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ color: COLORS.text, marginBottom: '12px', fontSize: '16px' }}>
            {t('tracking.symptoms.title')}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {symptomsList.map(symptom => (
              <label
                key={symptom.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  backgroundColor: symptoms[symptom.key] ? `${COLORS.follicular}40` : 'transparent',
                  border: `1.5px solid ${symptoms[symptom.key] ? COLORS.follicular : 'rgba(226, 232, 240, 0.5)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: COLORS.text,
                  transition: 'all 0.3s ease'
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