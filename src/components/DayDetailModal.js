import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Clock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { COLORS, getCurrentPhase } from '../utils/cycleHelpers';

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
  onMarkPeriodEnd,
  onMarkOvulation,
  onRemoveOvulation,
  isOvulationDay
}) => {
  const { t } = useTranslation();
  
  // States
  const [mood, setMood] = useState(50); // 0-100 Slider
  const [symptoms, setSymptoms] = useState({});
  const [sexTimes, setSexTimes] = useState([]); // Array von {time: "14:30"}
  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('');
  const [flowIntensity, setFlowIntensity] = useState(0); // 0-5
  const [newSexTime, setNewSexTime] = useState('');

  // Lade gespeicherte Daten für diesen Tag
  useEffect(() => {
    if (isOpen && selectedDate) {
      const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      
      // Lade Flow-Intensität
      const savedFlowData = localStorage.getItem('flowData');
      if (savedFlowData) {
        const flowData = JSON.parse(savedFlowData);
        setFlowIntensity(flowData[dateKey] || 0);
      }
      
      // TODO: Lade andere gespeicherte Daten (mood, symptoms, etc.)
    }
  }, [isOpen, selectedDate]);

  if (!isOpen || !selectedDate) return null;

  const currentPhase = getCurrentPhase(cycleDay);
  
  const dateString = selectedDate.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const symptomsList = [
    { key: 'headache', label: t('tracking.symptoms.headache') },
    { key: 'backPain', label: t('tracking.symptoms.backPain') },
    { key: 'abdominalPain', label: t('tracking.symptoms.abdominalPain') },
    { key: 'cramps', label: t('tracking.symptoms.cramps') },
    { key: 'bloated', label: t('tracking.symptoms.bloated') },
    { key: 'cravings', label: t('tracking.symptoms.cravings') }
  ];

  const getMoodEmoji = (value) => {
    if (value < 20) return '😢';
    if (value < 40) return '😟';
    if (value < 60) return '😐';
    if (value < 80) return '🙂';
    return '😊';
  };

  const getMoodColor = (value) => {
    // Farbverlauf von rot/blau (traurig) zu gelb/grün (fröhlich)
    const hue = (value / 100) * 120; // 0 (rot) bis 120 (grün)
    return `hsl(${hue}, 70%, 60%)`;
  };

  const getFlowIcon = (intensity) => {
    if (intensity === 0) return '';
    if (intensity === 1) return '💧';
    if (intensity === 2) return '🩸';
    if (intensity === 3) return '🩸🩸';
    if (intensity === 4) return '🩸🩸🩸';
    return '🩸🩸🩸🩸';
  };

  const handleFlowIntensityChange = (level) => {
    setFlowIntensity(level);
    
    // Sofort speichern
    const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const savedFlowData = localStorage.getItem('flowData');
    const flowData = savedFlowData ? JSON.parse(savedFlowData) : {};
    flowData[dateKey] = level;
    localStorage.setItem('flowData', JSON.stringify(flowData));
    
    // Trigger onSaveTracking für Updates
    onSaveTracking({ flowIntensity: level });
  };

  const handleAddSexTime = () => {
    if (newSexTime) {
      setSexTimes([...sexTimes, { time: newSexTime }]);
      setNewSexTime('');
    }
  };

  const handleRemoveSexTime = (index) => {
    setSexTimes(sexTimes.filter((_, i) => i !== index));
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
        background: currentPhase?.gradient || COLORS.background,
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
            background: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.text,
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{
            color: COLORS.text,
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '4px'
          }}>
            {dateString}
          </h2>
          <p style={{
            color: COLORS.text,
            fontSize: '14px',
            opacity: 0.7
          }}>
            {phaseName} • Tag {cycleDay}
          </p>
        </div>

        {/* Periode Start/Ende + Flow Intensität */}
        {!isFutureDay && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '16px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              color: COLORS.text,
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              🩸 Periode
            </h3>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {!hasActivePeriod && (
                <button
                  onClick={() => {
                    onMarkPeriodStart(selectedDate);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: COLORS.menstruation,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: COLORS.text,
                    fontSize: '13px'
                  }}
                >
                  Periode starten
                </button>
              )}
              
              {hasActivePeriod && (
                <button
                  onClick={() => {
                    onMarkPeriodEnd(selectedDate);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: COLORS.follicular,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: COLORS.text,
                    fontSize: '13px'
                  }}
                >
                  Periode beenden
                </button>
              )}
            </div>

            {/* Flow Intensität - nur wenn aktive Periode UND Perioden-Tag */}
            {hasActivePeriod && isPeriodDay && (
              <div>
                <p style={{
                  color: COLORS.text,
                  fontSize: '13px',
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  Intensität:
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleFlowIntensityChange(level)}
                      style={{
                        padding: '8px',
                        backgroundColor: flowIntensity === level 
                          ? 'rgba(255, 255, 255, 0.5)' 
                          : 'transparent',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {getFlowIcon(level)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Zukünftige Tage - Hinweis */}
        {isFutureDay && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <p style={{
              color: COLORS.text,
              fontSize: '16px',
              margin: 0,
              opacity: 0.8
            }}>
              ⏳ Dieser Tag liegt in der Zukunft
            </p>
            <p style={{
              color: COLORS.text,
              fontSize: '14px',
              margin: '8px 0 0 0',
              opacity: 0.6
            }}>
              Du kannst hier noch nichts eintragen
            </p>
          </div>
        )}

        {/* Eisprung */}
        {!isFutureDay && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '16px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{
                color: COLORS.text,
                fontSize: '16px',
                fontWeight: '600',
                margin: 0
              }}>
                🌸 Eisprung
              </h3>
              
              {isOvulationDay ? (
                <button
                  onClick={() => {
                    if (onRemoveOvulation) onRemoveOvulation(selectedDate);
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'rgba(245, 194, 199, 0.5)',
                    border: `2px solid ${COLORS.ovulation}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: COLORS.text,
                    fontSize: '12px'
                  }}
                >
                  ✓ Markiert
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (onMarkOvulation) onMarkOvulation(selectedDate);
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    border: `2px solid ${COLORS.ovulation}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: COLORS.text,
                    fontSize: '12px'
                  }}
                >
                  Markieren
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mood Rad/Slider */}
        {!isFutureDay && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '16px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              color: COLORS.text,
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              Wie fühlst du dich heute?
            </h3>
          
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                {getMoodEmoji(mood)}
              </div>
            </div>

            {/* Mood Slider */}
            <div style={{ position: 'relative', padding: '0 10px' }}>
              <input
                type="range"
                min="0"
                max="100"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  outline: 'none',
                  appearance: 'none',
                  background: `linear-gradient(to right, 
                    hsl(0, 70%, 60%) 0%, 
                    hsl(30, 70%, 60%) 25%, 
                    hsl(60, 70%, 60%) 50%, 
                    hsl(90, 70%, 60%) 75%, 
                    hsl(120, 70%, 60%) 100%)`,
                  cursor: 'pointer'
                }}
              />
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: ${getMoodColor(mood)};
                  cursor: pointer;
                  border: 3px solid white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
                input[type="range"]::-moz-range-thumb {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: ${getMoodColor(mood)};
                  cursor: pointer;
                  border: 3px solid white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
              `}</style>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
              fontSize: '12px',
              color: COLORS.text,
              opacity: 0.7
            }}>
              <span>😢 Sehr schlecht</span>
              <span>😊 Sehr gut</span>
            </div>
          </div>
        )}

        {/* Geschlechtsverkehr */}
        {!isFutureDay && (
          <div style={{
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '16px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            color: COLORS.text,
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            💑 Geschlechtsverkehr
          </h3>

          {/* Vorhandene Zeiten */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {sexTimes.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: COLORS.text
                }}
              >
                <Clock size={14} />
                <span>{item.time}</span>
                <button
                  onClick={() => handleRemoveSexTime(index)}
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
                  <Minus size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Neue Zeit hinzufügen */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="time"
              value={newSexTime}
              onChange={(e) => setNewSexTime(e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: COLORS.text,
                fontSize: '14px'
              }}
            />
            <button
              onClick={handleAddSexTime}
              disabled={!newSexTime}
              style={{
                padding: '8px 12px',
                backgroundColor: newSexTime ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                cursor: newSexTime ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                color: COLORS.text
              }}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
        )}

        {/* Symptome */}
        {!isFutureDay && (
          <div style={{
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '16px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            color: COLORS.text,
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            Symptome
          </h3>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {symptomsList.map((symptom) => (
              <button
                key={symptom.key}
                onClick={() => setSymptoms({
                  ...symptoms,
                  [symptom.key]: !symptoms[symptom.key]
                })}
                style={{
                  padding: '8px 12px',
                  backgroundColor: symptoms[symptom.key] 
                    ? 'rgba(255, 255, 255, 0.6)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  border: symptoms[symptom.key]
                    ? '2px solid rgba(45, 55, 72, 0.3)'
                    : '2px solid transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: COLORS.text,
                  fontWeight: symptoms[symptom.key] ? '600' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                {symptom.label}
              </button>
            ))}
          </div>
        </div>
        )}

        {/* Gewicht & Temperatur */}
        {!isFutureDay && (
          <div style={{
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '24px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{
                color: COLORS.text,
                fontSize: '13px',
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px'
              }}>
                ⚖️ Gewicht (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="z.B. 65.5"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: COLORS.text,
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{
                color: COLORS.text,
                fontSize: '13px',
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px'
              }}>
                🌡️ Temperatur (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="z.B. 36.5"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: COLORS.text,
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        </div>
        )}

        {/* Schließen Button - nur für nicht-zukünftige Tage */}
        {!isFutureDay && (
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '16px',
              color: COLORS.text,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            Fertig
          </button>
        )}
      </div>
    </div>
  );
};

export default DayDetailModal;