import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { getDaysInMonth, getFirstDayOfMonth, getMonthName } from '../utils/dateHelpers';
import { getCurrentPhase, COLORS, CYCLE_PHASES } from '../utils/cycleHelpers';
import DayDetailModal from '../components/DayDetailModal';

const CalendarScreen = ({ userData, onUpdateUserData }) => {
  const { t, language } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [flowData, setFlowData] = useState({});
  const [ovulationDates, setOvulationDates] = useState({});
  
  // Lade Flow-Daten und Eisprung-Daten aus localStorage
  useEffect(() => {
    const savedFlowData = localStorage.getItem('flowData');
    if (savedFlowData) {
      setFlowData(JSON.parse(savedFlowData));
    }
    
    const savedOvulation = localStorage.getItem('ovulationDates');
    if (savedOvulation) {
      setOvulationDates(JSON.parse(savedOvulation));
    }
  }, []);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = getMonthName(month, language);
  
  const periodStartDate = userData?.periodStartDate 
    ? new Date(userData.periodStartDate) 
    : new Date();
  
  const periodDuration = parseInt(userData?.periodDuration) || 5;
  
  // Findet das neueste markierte Eisprung-Datum
  const getLatestOvulationDate = () => {
    const ovDates = Object.keys(ovulationDates).filter(key => ovulationDates[key]);
    if (ovDates.length === 0) return null;
    
    // Sortiere Daten und nimm das neueste
    const dates = ovDates.map(dateKey => {
      const [y, m, d] = dateKey.split('-').map(Number);
      return new Date(y, m - 1, d);
    }).sort((a, b) => b - a); // Neuestes zuerst
    
    return dates[0];
  };
  
  const getCycleDayForDate = (day) => {
    const targetDate = new Date(year, month, day);
    
    // Wenn ein Eisprung markiert ist, berechne relativ dazu
    // Eisprung = Zyklustag 14
    const latestOvulation = getLatestOvulationDate();
    if (latestOvulation) {
      const daysSinceOvulation = Math.floor((targetDate - latestOvulation) / (1000 * 60 * 60 * 24));
      // Eisprung ist Tag 14, also:
      const cycleDay = 14 + daysSinceOvulation;
      
      // Normalisiere auf 1-28
      if (cycleDay <= 0) {
        return 28 + (cycleDay % 28);
      } else if (cycleDay > 28) {
        return ((cycleDay - 1) % 28) + 1;
      }
      return cycleDay;
    }
    
    // Fallback: Berechnung basierend auf Periodenstart
    const daysSinceStart = Math.floor((targetDate - periodStartDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceStart < 0) {
      const cycleDay = 28 + ((daysSinceStart % 28) + 1);
      return cycleDay;
    }
    
    const cycleDay = (daysSinceStart % 28) + 1;
    return cycleDay;
  };
  
  const isPastDay = (day) => {
    if (!day) return false;
    const targetDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return targetDate < today;
  };
  
  const isFutureDay = (day) => {
    if (!day) return false;
    const targetDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return targetDate > today;
  };
  
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };
  
  const getColorForDay = (day) => {
    const cycleDay = getCycleDayForDate(day);
    const phase = getCurrentPhase(cycleDay);
    const flowInt = getFlowIntensity(day);
    
    // Perioden-Tage: Farbverlauf von hell nach tiefem Rot je nach Intensität
    if (flowInt > 0 && isPeriodDay(day)) {
      // Farbskala: 1 = hellstes Pastell, 5 = tiefes sattdes Rot
      const periodColors = [
        '#F0D0C0', // 1 - sehr leicht, fast wie base
        '#E8A888', // 2 - leichtes Warmes
        '#D67D5E', // 3 - mittleres Warmes Rot
        '#C4654A', // 4 - tiefes Warmes Rot
        '#A84832', // 5 - sattestes tiefes Rot
      ];
      return periodColors[flowInt - 1];
    }
    
    return phase.color;
  };
  
  const isOvulationDay = (day) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return ovulationDates[dateKey] === true;
  };
  
  const isFertileDay = (day) => {
    // Checke ob ein markierter Eisprung in der Nähe ist (±3 Tage)
    for (let offset = -3; offset <= 3; offset++) {
      const checkDate = new Date(year, month, day + offset);
      const dateKey = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (ovulationDates[dateKey]) {
        return true;
      }
    }
    
    // Fallback auf berechnete fruchtbare Tage wenn kein Eisprung markiert
    const hasMarkedOvulation = Object.keys(ovulationDates).length > 0;
    if (!hasMarkedOvulation) {
      const cycleDay = getCycleDayForDate(day);
      return cycleDay >= 10 && cycleDay <= 16;
    }
    
    return false;
  };
  
  const getFertilityIntensity = (day) => {
    // Checke Distanz zum markierten Eisprung
    let closestDistance = Infinity;
    
    for (const dateKey in ovulationDates) {
      if (ovulationDates[dateKey]) {
        const [y, m, d] = dateKey.split('-').map(Number);
        const ovDate = new Date(y, m - 1, d);
        const currentDate = new Date(year, month, day);
        const daysDiff = Math.abs((currentDate - ovDate) / (1000 * 60 * 60 * 24));
        closestDistance = Math.min(closestDistance, daysDiff);
      }
    }
    
    if (closestDistance === 0) return 1;
    if (closestDistance === 1) return 0.8;
    if (closestDistance === 2) return 0.6;
    if (closestDistance === 3) return 0.4;
    
    // Fallback auf berechnete Tage
    const cycleDay = getCycleDayForDate(day);
    if (cycleDay === 14) return 1;
    if (cycleDay === 13 || cycleDay === 15) return 0.8;
    if (cycleDay === 12 || cycleDay === 16) return 0.6;
    if (cycleDay === 11 || cycleDay === 17) return 0.4;
    if (cycleDay === 10 || cycleDay === 18) return 0.2;
    return 0;
  };
  
  const getFlowIntensity = (day) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return flowData[dateKey] || 0;
  };
  
  const isPeriodDay = (day) => {
    const cycleDay = getCycleDayForDate(day);
    return cycleDay >= 1 && cycleDay <= periodDuration;
  };
  
  const hasActivePeriod = () => {
    return Object.keys(flowData).length > 0;
  };
  
  const isCurrentMonth = () => {
    const today = new Date();
    return month === today.getMonth() && year === today.getFullYear();
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDay(day);
    setIsDayModalOpen(true);
  };
  
  const handleSaveTracking = (data) => {
    console.log('Tracking gespeichert:', data);
    
    if (data.flowIntensity) {
      // Verwende year/month/selectedDay statt data.date um Zeitzone-Probleme zu vermeiden
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      console.log('Saving with dateKey:', dateKey);
      const newFlowData = { ...flowData, [dateKey]: data.flowIntensity };
      setFlowData(newFlowData);
      localStorage.setItem('flowData', JSON.stringify(newFlowData));
    }
    
    alert(t('dataSaved'));
  };
  
  const handleMarkPeriodStart = (date) => {
    const newUserData = {
      ...userData,
      periodStartDate: date.toISOString().split('T')[0]
    };
    localStorage.setItem('userData', JSON.stringify(newUserData));
    if (onUpdateUserData) onUpdateUserData(newUserData);
    alert(t('calendar.periodStart') + ' markiert!');
  };
  
  const handleMarkPeriodEnd = (date) => {
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
  
  const handleMarkOvulation = (date) => {
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const newOvulationDates = { ...ovulationDates, [dateKey]: true };
    setOvulationDates(newOvulationDates);
    localStorage.setItem('ovulationDates', JSON.stringify(newOvulationDates));
    alert('🌸 ' + t('calendar.ovulationMarked'));
  };
  
  const handleRemoveOvulation = (date) => {
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const newOvulationDates = { ...ovulationDates };
    delete newOvulationDates[dateKey];
    setOvulationDates(newOvulationDates);
    localStorage.setItem('ovulationDates', JSON.stringify(newOvulationDates));
    alert(t('calendar.removeOvulation') + ' ✓');
  };
  
  const handleCancelPeriod = () => {
    if (!window.confirm('Möchtest du die aktuelle Periode wirklich abbrechen? Alle Flow-Daten werden gelöscht.')) {
      return;
    }
    
    setFlowData({});
    localStorage.removeItem('flowData');
    alert(t('calendar.periodCancelled'));
  };
  
  const emptyDays = Array(firstDay - 1).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarDays = [...emptyDays, ...days];
  
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
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px'
      }}>
        {calendarDays.map((day, index) => {
          const today = isToday(day);
          const past = isPastDay(day);
          const fertile = day ? isFertileDay(day) : false;
          const ovulation = day ? isOvulationDay(day) : false;
          const fertilityIntensity = day ? getFertilityIntensity(day) : 0;
          const isPeriod = day ? isPeriodDay(day) : false;
          const flowIntensity = day ? getFlowIntensity(day) : 0;
          
          return (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              style={{
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: today ? '700' : '500',
                backgroundColor: day ? getColorForDay(day) : 'transparent',
                color: COLORS.text,
                cursor: day ? 'pointer' : 'default',
                border: today ? `2px solid ${COLORS.text}` : 'none',
                boxShadow: today ? `0 0 0 2px ${COLORS.background}, 0 0 0 4px ${COLORS.text}40` : 
                           fertile ? `0 0 0 2px rgba(245, 194, 199, 0.4), inset 0 0 10px rgba(245, 194, 199, 0.2)` : 
                           'none',
                position: 'relative',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                opacity: past ? 0.6 : 1,
                gap: '2px',
                padding: '4px'
              }}
              onMouseEnter={(e) => {
                if (day) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = fertile ? 
                    '0 4px 12px rgba(245, 194, 199, 0.4), 0 0 0 2px rgba(245, 194, 199, 0.4)' :
                    '0 4px 12px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (day) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = today ? `0 0 0 2px ${COLORS.background}, 0 0 0 4px ${COLORS.text}40` : 
                                                     fertile ? `0 0 0 2px rgba(245, 194, 199, 0.4), inset 0 0 10px rgba(245, 194, 199, 0.2)` : 
                                                     'none';
                }
              }}
            >
              <span>{day}</span>
              
              {fertile && (
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: `${6 + fertilityIntensity * 6}px`,
                  height: `${6 + fertilityIntensity * 6}px`,
                  borderRadius: '50%',
                  backgroundColor: ovulation ? '#F5C2C7' : 'rgba(245, 194, 199, 0.8)',
                  animation: ovulation ? 'pulse-ovulation 2s ease-in-out infinite' : 'pulse-fertile 3s ease-in-out infinite'
                }}>
                  <style>
                    {`
                      @keyframes pulse-ovulation {
                        0%, 100% { 
                          transform: scale(1);
                          opacity: 1;
                        }
                        50% { 
                          transform: scale(1.3);
                          opacity: 0.8;
                        }
                      }
                      @keyframes pulse-fertile {
                        0%, 100% { 
                          transform: scale(1);
                          opacity: 0.7;
                        }
                        50% { 
                          transform: scale(1.2);
                          opacity: 1;
                        }
                      }
                    `}
                  </style>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div style={{
        marginTop: '32px',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          padding: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '12px',
          border: '1px solid rgba(226, 232, 240, 0.5)'
        }}>
          {[
            { key: 'menstruation', label: 'Menstruation', color: COLORS.menstruation },
            { key: 'follicular', label: 'Follikel', color: COLORS.follicular },
            { key: 'ovulation', label: 'Eisprung', color: COLORS.ovulation },
            { key: 'luteal', label: 'Luteal', color: COLORS.luteal }
          ].map(phase => (
            <div key={phase.key} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '11px'
            }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                borderRadius: '4px',
                backgroundColor: phase.color,
                flexShrink: 0
              }} />
              <span style={{ color: COLORS.textLight }}>{phase.label}</span>
            </div>
          ))}
        </div>
        
        <div style={{
          padding: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '12px',
          border: '1px solid rgba(226, 232, 240, 0.5)'
        }}>
          <p style={{ 
            color: COLORS.textLight, 
            fontSize: '11px', 
            margin: 0,
            textAlign: 'center'
          }}>
            💡 {t('calendar.legend')} Dunklere Farbe = stärkere Blutung
          </p>
        </div>
        
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
        onMarkOvulation={handleMarkOvulation}
        onRemoveOvulation={handleRemoveOvulation}
        isOvulationDay={selectedDay ? isOvulationDay(selectedDay) : false}
      />
    </div>
  );
};

export default CalendarScreen;