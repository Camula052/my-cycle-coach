import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import FloatingButton from '../components/FloatingButton';
import PhaseDetailsModal from '../components/PhaseDetailsModal';
import DayDetailModal from '../components/DayDetailModal';
import OrganicBackground from '../components/OrganicBackground';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096'
};

const HomeScreen = ({ currentPhase, cycleDay, userData, onUpdateUserData, onOpenTracking, onNavigate }) => {
  const { t } = useTranslation();
  const [isPhaseDetailsOpen, setIsPhaseDetailsOpen] = useState(false);
  const [isDayDetailOpen, setIsDayDetailOpen] = useState(false);
  const [flowData, setFlowData] = useState({});
  const [forceUpdate, setForceUpdate] = useState(0);

  // Lade Flow-Daten aus localStorage
  useEffect(() => {
    const savedFlowData = localStorage.getItem('flowData');
    if (savedFlowData) {
      setFlowData(JSON.parse(savedFlowData));
    }
  }, []);

  // Re-load flowData wenn forceUpdate sich ändert ODER userData
  useEffect(() => {
    const savedFlowData = localStorage.getItem('flowData');
    if (savedFlowData) {
      setFlowData(JSON.parse(savedFlowData));
    }
  }, [forceUpdate, userData]);

  const hasActivePeriod = () => {
    // Periode ist aktiv wenn periodStartDate gesetzt UND lastPeriodEndDate NICHT gesetzt
    return userData?.periodStartDate && !userData?.lastPeriodEndDate;
  };

  const isPeriodEnded = () => {
    // Periode wurde beendet wenn lastPeriodEndDate gesetzt ist
    return userData?.lastPeriodEndDate;
  };

  const isPeriodDay = (date) => {
    // Ein Tag ist Perioden-Tag wenn:
    // 1. Periode läuft UND Tag <= heute UND innerhalb Prognose
    // 2. ODER flowData existiert (tatsächlich eingetragen)
    
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Hat flowData? Dann ist es definitiv ein Perioden-Tag
    if (flowData[dateKey] > 0) {
      return true;
    }
    
    // Sonst: Checke Prognose nur wenn Periode aktiv
    if (!hasActivePeriod()) {
      return false;
    }
    
    // Prognose: Tag innerhalb periodDuration ab periodStartDate
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const periodStart = new Date(userData.periodStartDate);
    periodStart.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((targetDate - periodStart) / (1000 * 60 * 60 * 24));
    const periodDuration = parseInt(userData?.periodDuration) || 5;
    
    console.log('isPeriodDay debug:', {
      dateKey,
      targetDate: targetDate.toISOString(),
      periodStart: periodStart.toISOString(),
      daysDiff,
      periodDuration,
      result: daysDiff >= 0 && daysDiff < periodDuration
    });
    
    return daysDiff >= 0 && daysDiff < periodDuration;
  };

  const handleMarkPeriodStart = (date) => {
    const newUserData = {
      ...userData,
      periodStartDate: date.toISOString().split('T')[0],
      lastPeriodEndDate: null // Wichtig: Lösche "Ende"-Flag
    };
    localStorage.setItem('userData', JSON.stringify(newUserData));
    localStorage.removeItem('ovulationDates');
    
    // KEIN flowData hier - das wird nur bei Intensitäts-Änderung gespeichert
    
    if (onUpdateUserData) onUpdateUserData(newUserData);
    setForceUpdate(prev => prev + 1);
  };

  const handleMarkPeriodEnd = (date) => {
    const endDate = new Date(date);
    const startDate = new Date(userData.periodStartDate);
    
    // Berechne wie viele Tage die Periode tatsächlich gedauert hat
    const actualDuration = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // Berechne nächsten Periode-Start (28 Tage nach DIESEM Start)
    const nextPeriodStart = new Date(startDate);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + 28);
    
    const newUserData = {
      ...userData,
      periodStartDate: nextPeriodStart.toISOString().split('T')[0],
      lastPeriodEndDate: date.toISOString().split('T')[0]
    };
    localStorage.setItem('userData', JSON.stringify(newUserData));
    
    // Lösche flowData für alle Tage NACH dem End-Datum
    endDate.setHours(0, 0, 0, 0);
    
    const cleanedFlowData = {};
    Object.keys(flowData).forEach(dateKey => {
      const [y, m, d] = dateKey.split('-').map(Number);
      const flowDate = new Date(y, m - 1, d);
      flowDate.setHours(0, 0, 0, 0);
      
      // Behalte nur Tage <= End-Datum
      if (flowDate <= endDate) {
        cleanedFlowData[dateKey] = flowData[dateKey];
      }
    });
    
    setFlowData(cleanedFlowData);
    localStorage.setItem('flowData', JSON.stringify(cleanedFlowData));
    
    if (onUpdateUserData) onUpdateUserData(newUserData);
    setForceUpdate(prev => prev + 1);
  };

  const handleMarkOvulation = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    
    const ovulationDatesStr = localStorage.getItem('ovulationDates');
    const ovulationDates = ovulationDatesStr ? JSON.parse(ovulationDatesStr) : {};
    
    ovulationDates[dateKey] = true;
    localStorage.setItem('ovulationDates', JSON.stringify(ovulationDates));
    
    if (onUpdateUserData) onUpdateUserData({...userData});
    setForceUpdate(prev => prev + 1);
  };

  const handleRemoveOvulation = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    
    const ovulationDatesStr = localStorage.getItem('ovulationDates');
    const ovulationDates = ovulationDatesStr ? JSON.parse(ovulationDatesStr) : {};
    
    delete ovulationDates[dateKey];
    localStorage.setItem('ovulationDates', JSON.stringify(ovulationDates));
    
    if (onUpdateUserData) onUpdateUserData({...userData});
    setForceUpdate(prev => prev + 1);
  };

  const handleSaveTracking = (data) => {
    console.log('Tracking gespeichert:', data);
    
    if (data.flowIntensity !== undefined) {
      // Nutze das Datum aus data, falls vorhanden, sonst heute
      let targetDate;
      if (data.date) {
        targetDate = new Date(data.date);
      } else {
        targetDate = new Date();
      }
      
      const dateKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
      const newFlowData = { ...flowData, [dateKey]: data.flowIntensity };
      setFlowData(newFlowData);
      localStorage.setItem('flowData', JSON.stringify(newFlowData));
      setForceUpdate(prev => prev + 1); // Trigger Re-Render
    }
    
    if (data.isOvulationDay !== undefined) {
      if (onUpdateUserData) onUpdateUserData({...userData});
    }
    
    // Modal NICHT schließen - alles ist instant-save
  };

  const isOvulationMarked = () => {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const ovulationDatesStr = localStorage.getItem('ovulationDates');
    const ovulationDates = ovulationDatesStr ? JSON.parse(ovulationDatesStr) : {};
    return ovulationDates[dateKey] === true;
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px 24px 100px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: 'transparent'
    }}>
      {/* Organischer Hintergrund mit Membran-Glow und Partikeln */}
      <OrganicBackground phase={currentPhase} />

      {/* Phase Name - ganz oben, prominent */}
      <h1 style={{
        color: COLORS.text,
        fontSize: '36px',
        fontWeight: '700',
        marginBottom: '8px',
        marginTop: '20px',
        textAlign: 'center',
        textShadow: '0 2px 8px rgba(255, 255, 255, 0.5)',
        position: 'relative',
        zIndex: 2
      }}>
        {t(`phases.${currentPhase.key}.name`)}
      </h1>

      {/* Cycle Day */}
      <p style={{
        color: COLORS.text,
        fontSize: '16px',
        opacity: 0.8,
        textAlign: 'center',
        marginBottom: '32px',
        fontWeight: '500',
        position: 'relative',
        zIndex: 2
      }}>
        {t('home.cycleDay', { day: cycleDay })}
      </p>

      {/* Phase Emoji - ZENTRUM (statt Uterus Animation) */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '32px',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Emoji Circle - klickbar */}
        <div
          onClick={() => setIsPhaseDetailsOpen(true)}
          style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '96px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: 'gentleFloat 6s ease-in-out infinite',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
          }}
        >
          {currentPhase.emoji}
          
          {/* Info Button - oben rechts am Emoji Circle */}
          <button
            onClick={() => {
              console.log('Info button clicked!');
              console.log('isPhaseDetailsOpen:', isPhaseDetailsOpen);
              console.log('currentPhase:', currentPhase);
              setIsPhaseDetailsOpen(true);
            }}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'all 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.background = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
            }}
          >
            <Info size={20} color={COLORS.text} />
          </button>
        </div>
      </div>

      {/* "Was geht ab" Box */}
      <div style={{
        maxWidth: '500px',
        width: '100%',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '20px',
        padding: '24px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        zIndex: 2
      }}>
        <h2 style={{
          color: COLORS.text,
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '12px',
          textAlign: 'center'
        }}>
          {t('home.whatsHappening')}
        </h2>
        <p style={{
          color: COLORS.text,
          fontSize: '15px',
          lineHeight: '1.7',
          opacity: 0.85,
          textAlign: 'center',
          margin: 0
        }}>
          {t(`phases.${currentPhase.key}.description`)}
        </p>
      </div>

      {/* Floating Action Button */}
      <FloatingButton onClick={() => setIsDayDetailOpen(true)} />

      {/* Phase Details Modal */}
      <PhaseDetailsModal
        isOpen={isPhaseDetailsOpen}
        onClose={() => setIsPhaseDetailsOpen(false)}
        currentPhase={currentPhase}
        onNavigateToNutrition={() => onNavigate('nutrition')}
        onNavigateToActivity={() => onNavigate('activity')}
      />

      {/* Day Detail Modal für heute */}
      <DayDetailModal
        key={`day-detail-${forceUpdate}`}
        isOpen={isDayDetailOpen}
        onClose={() => setIsDayDetailOpen(false)}
        selectedDate={new Date()}
        cycleDay={cycleDay}
        phaseName={t(`phases.${currentPhase.key}.name`)}
        isPeriodDay={isPeriodDay(new Date())}
        isFutureDay={false}
        hasActivePeriod={hasActivePeriod()}
        onSaveTracking={handleSaveTracking}
        onMarkPeriodStart={handleMarkPeriodStart}
        onMarkPeriodEnd={handleMarkPeriodEnd}
        onMarkOvulation={handleMarkOvulation}
        onRemoveOvulation={handleRemoveOvulation}
        isOvulationDay={isOvulationMarked()}
      />

      <style>{`
        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;