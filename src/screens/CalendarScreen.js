import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { getDaysInMonth, getFirstDayOfMonth, getMonthName } from '../utils/dateHelpers';
import { getCurrentPhase } from '../utils/cycleHelpers';
import DayDetailModal from '../components/DayDetailModal';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096'
};

const CalendarScreen = ({ userData, onUpdateUserData }) => {
  const { t, language } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [flowData, setFlowData] = useState({}); // { "2025-01-15": 3, "2025-01-16": 4 }
  
  // Lade Flow-Daten aus localStorage
  useEffect(() => {
    const savedFlowData = localStorage.getItem('flowData');
    if (savedFlowData) {
      setFlowData(JSON.parse(savedFlowData));
    }
  }, []);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = getMonthName(month, language);
  
  // Perioden-Startdatum aus Onboarding
  const periodStartDate = userData?.periodStartDate 
    ? new Date(userData.periodStartDate) 
    : new Date();
  
  const periodDuration = parseInt(userData?.periodDuration) || 5;
  
  // Berechne Zyklustag für ein bestimmtes Datum
  const getCycleDayForDate = (day) => {
    const targetDate = new Date(year, month, day);
    const daysSinceStart = Math.floor((targetDate - periodStartDate) / (1000 * 60 * 60 * 24));
    
    // Falls negativ (Tag vor Periode-Start), berechne rückwärts vom 28-Tage-Zyklus
    if (daysSinceStart < 0) {
      const cycleDay = 28 + ((daysSinceStart % 28) + 1);
      return cycleDay;
    }
    
    const cycleDay = (daysSinceStart % 28) + 1;
    return cycleDay;
  };
  
  // Prüfe ob aktueller Monat der heutige Monat ist
  const isCurrentMonth = () => {
    const today = new Date();
    return month === today.getMonth() && year === today.getFullYear();
  };
  
  // Navigiere zu heute
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Prüfe ob Tag in der Vergangenheit liegt
  const isPastDay = (day) => {
    if (!day) return false;
    const targetDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return targetDate < today;
  };
  
  // Prüfe ob Tag in der Zukunft liegt
  const isFutureDay = (day) => {
    if (!day) return false;
    const targetDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return targetDate > today;
  };
  
  // Prüfe ob Tag heute ist
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };
  
  // Hole Farbe für einen Tag basierend auf Zyklusphase + Flow-Intensität
  const getColorForDay = (day) => {
    const cycleDay = getCycleDayForDate(day);
    const phase = getCurrentPhase(cycleDay);
    const flowInt = getFlowIntensity(day);
    
    // Wenn Flow-Intensität vorhanden, dunkle die Farbe ab
    if (flowInt > 0 && isPeriodDay(day)) {
      // Je höher die Intensität, desto dunkler
      const darkenFactor = 1 - (flowInt * 0.12); // 0.88, 0.76, 0.64, 0.52, 0.4
      return adjustColorBrightness(phase.color, darkenFactor);
    }
    
    return phase.color;
  };
  
  // Helper: Farbe abdunkeln
  const adjustColorBrightness = (hex, factor) => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Darken
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };
  
  // Prüfe ob Tag Eisprung ist (Zyklustag 14)
  const isOvulationDay = (day) => {
    const cycleDay = getCycleDayForDate(day);
    return cycleDay === 14;
  };
  
  // Prüfe ob Tag fruchtbar ist (Zyklustag 10-16)
  const isFertileDay = (day) => {
    const cycleDay = getCycleDayForDate(day);
    return cycleDay >= 10 && cycleDay <= 16;
  };
  
  // Berechne Fruchtbarkeits-Intensität (für Punkt-Größe)
  const getFertilityIntensity = (day) => {
    const cycleDay = getCycleDayForDate(day);
    if (cycleDay === 14) return 1; // Eisprung = max
    if (cycleDay === 13 || cycleDay === 15) return 0.8;
    if (cycleDay === 12 || cycleDay === 16) return 0.6;
    if (cycleDay === 11 || cycleDay === 17) return 0.4;
    if (cycleDay === 10 || cycleDay === 18) return 0.2;
    return 0;
  };
  
  // Hole Flow-Intensität für einen Tag
  const getFlowIntensity = (day) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return flowData[dateKey] || 0;
  };
  
  // Prüfe ob Tag ein Perioden-Tag ist (basierend auf Zyklustag)
  const isPeriodDay = (day) => {
    const cycleDay = getCycleDayForDate(day);
    return cycleDay >= 1 && cycleDay <= periodDuration;
  };
  
  // Prüfe ob aktuell eine aktive Periode läuft (Flow-Daten vorhanden)
  const hasActivePeriod = () => {
    return Object.keys(flowData).length > 0;
  };
  
  // Navigiere zum vorherigen Monat
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  // Navigiere zum nächsten Monat
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  // Tag wurde geklickt
  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDay(day);
    setIsDayModalOpen(true);
  };
  
  // Speichere Tracking für einen Tag
  const handleSaveTracking = (data) => {
    console.log('Tracking für Tag gespeichert:', data);
    
    // Speichere Flow-Intensität wenn vorhanden
    if (data.flowIntensity) {
      const dateKey = data.date.split('T')[0];
      const newFlowData = { ...flowData, [dateKey]: data.flowIntensity };
      setFlowData(newFlowData);
      localStorage.setItem('flowData', JSON.stringify(newFlowData));
    }
    
    // TODO: Alle anderen Daten in localStorage oder Backend speichern
    alert(t('dataSaved'));
  };
  
  // Markiere Periode Start
  const handleMarkPeriodStart = (date) => {
    const newUserData = {
      ...userData,
      periodStartDate: date.toISOString().split('T')[0]
    };
    localStorage.setItem('userData', JSON.stringify(newUserData));
    if (onUpdateUserData) onUpdateUserData(newUserData);
    alert(t('calendar.periodStart') + ' markiert!');
  };
  
  // Markiere Periode Ende
  const handleMarkPeriodEnd = (date) => {
    // Berechne Dauer basierend auf Start und Ende
    const start = new Date(userData.periodStartDate);
    const duration = Math.floor((date - start) / (1000 * 60 * 60 * 24)) + 1;
    
    const newUserData = {
      ...userData,
      periodDuration: duration.toString()
    };
    localStorage.setItem('userData', JSON.stringify(newUserData));
    if (onUpdateUserData) onUpdateUserData(newUserData);
    alert(t('calendar.periodEnd') + ` markiert! Dauer: ${duration} Tage`);
  };
  
  // Periode abbrechen
  const handleCancelPeriod = () => {
    if (!window.confirm('Möchtest du die aktuelle Periode wirklich abbrechen? Alle Flow-Daten werden gelöscht.')) {
      return;
    }
    
    // Lösche Flow-Daten
    setFlowData({});
    localStorage.removeItem('flowData');
    alert(t('calendar.periodCancelled'));
  };
  
  // Erstelle Kalender-Array
  const emptyDays = Array(firstDay - 1).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarDays = [...emptyDays, ...days];
  
  // Hole Infos für selected day
  const selectedCycleDay = selectedDay ? getCycleDayForDate(selectedDay) : null;
  const selectedPhase = selectedCycleDay ? getCurrentPhase(selectedCycleDay) : null;
  const selectedDate = selectedDay ? new Date(year, month, selectedDay) : null;
  
  return (
    <div style={{ 
      padding: '20px', 
      paddingBottom: '100px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      
      {/* Header mit Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <button
          onClick={goToPrevMonth}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: COLORS.text,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronLeft size={24} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ 
            color: COLORS.text,
            fontSize: '24px',
            fontWeight: '600',
            margin: 0
          }}>
            {monthName} {year}
          </h2>
          
          {/* "Zurück zu heute" Button - nur wenn nicht im aktuellen Monat */}
          {!isCurrentMonth() && (
            <button
              onClick={goToToday}
              style={{
                padding: '6px 12px',
                backgroundColor: 'rgba(184, 230, 213, 0.3)',
                border: '1px solid rgba(184, 230, 213, 0.5)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                color: COLORS.text,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(184, 230, 213, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(184, 230, 213, 0.3)';
              }}
            >
              • {t('calendar.today')}
            </button>
          )}
        </div>
        
        <button
          onClick={goToNextMonth}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: COLORS.text,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Wochentage */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px',
        marginBottom: '8px'
      }}>
        {[
          t('calendar.weekdayShortcuts.monday'),
          t('calendar.weekdayShortcuts.tuesday'),
          t('calendar.weekdayShortcuts.wednesday'),
          t('calendar.weekdayShortcuts.thursday'),
          t('calendar.weekdayShortcuts.friday'),
          t('calendar.weekdayShortcuts.saturday'),
          t('calendar.weekdayShortcuts.sunday')
        ].map(day => (
          <div key={day} style={{
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: '600',
            color: COLORS.textLight,
            padding: '8px'
          }}>
            {day}
          </div>
        ))}
      </div>
      
      {/* Tages-Kacheln */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px'
      }}>
        {calendarDays.map((day, index) => {
          const today = isToday(day);
          
          return (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: today ? '700' : '500',
                backgroundColor: day ? getColorForDay(day) : 'transparent',
                color: COLORS.text,
                cursor: day ? 'pointer' : 'default',
                border: today ? `2px solid ${COLORS.text}` : 'none',
                boxShadow: today ? `0 0 0 2px ${COLORS.background}, 0 0 0 4px ${COLORS.text}40` : 'none',
                position: 'relative',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (day) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (day) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
      
      {/* Legende */}
      <div style={{
        marginTop: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '12px',
          border: '1px solid rgba(226, 232, 240, 0.5)'
        }}>
          <p style={{ 
            color: COLORS.textLight, 
            fontSize: '12px', 
            margin: 0,
            textAlign: 'center'
          }}>
            💡 {t('calendar.legend')}
          </p>
        </div>
        
        {/* Periode abbrechen Button - nur wenn Flow-Daten vorhanden */}
        {Object.keys(flowData).length > 0 && (
          <button
            onClick={handleCancelPeriod}
            style={{
              padding: '12px',
              backgroundColor: 'rgba(230, 184, 156, 0.3)',
              border: '1.5px solid rgba(230, 184, 156, 0.5)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: COLORS.text,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(230, 184, 156, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(230, 184, 156, 0.3)';
            }}
          >
            ❌ {t('calendar.periodCancel')}
          </button>
        )}
      </div>
      
      {/* Day Detail Modal */}
      <DayDetailModal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        selectedDate={selectedDate}
        cycleDay={selectedCycleDay}
        phaseName={selectedPhase ? t(`phases.${selectedPhase.key}.name`) : ''}
        isPeriodDay={selectedDay ? isPeriodDay(selectedDay) : false}
        isFutureDay={selectedDay ? isFutureDay(selectedDay) : false}
        hasActivePeriod={hasActivePeriod()}
        onSaveTracking={handleSaveTracking}
        onMarkPeriodStart={handleMarkPeriodStart}
        onMarkPeriodEnd={handleMarkPeriodEnd}
      />
    </div>
  );
};

export default CalendarScreen;