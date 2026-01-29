import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { getDaysInMonth, getFirstDayOfMonth, getMonthName } from '../utils/dateHelpers';
import { getCurrentPhase } from '../utils/cycleHelpers';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096'
};

const CalendarScreen = ({ userData }) => {
  const { t, language } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = getMonthName(month, language);
  
  // Perioden-Startdatum aus Onboarding
  const periodStartDate = userData?.periodStartDate 
    ? new Date(userData.periodStartDate) 
    : new Date();
  
  // Berechne Zyklustag für ein bestimmtes Datum
  const getCycleDayForDate = (day) => {
    const targetDate = new Date(year, month, day);
    const daysSinceStart = Math.floor((targetDate - periodStartDate) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysSinceStart % 28) + 1;
    return cycleDay;
  };
  
  // Hole Farbe für einen Tag basierend auf Zyklusphase
  const getColorForDay = (day) => {
    const cycleDay = getCycleDayForDate(day);
    const phase = getCurrentPhase(cycleDay);
    return phase.color;
  };
  
  // Erstelle Kalender-Array
  const emptyDays = Array(firstDay - 1).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarDays = [...emptyDays, ...days];
  
  return (
    <div style={{ 
      padding: '20px', 
      paddingBottom: '100px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      
      {/* Header: Monat + Jahr */}
      <h2 style={{ 
        color: COLORS.text, 
        marginBottom: '24px',
        textAlign: 'center',
        fontSize: '24px'
      }}>
        {monthName} {year}
      </h2>
      
      {/* Wochentage */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px',
        marginBottom: '8px'
      }}>
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
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
        {calendarDays.map((day, index) => (
          <div
            key={index}
            style={{
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              backgroundColor: day ? getColorForDay(day) : 'transparent',
              color: COLORS.text,
              cursor: day ? 'pointer' : 'default'
            }}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarScreen;