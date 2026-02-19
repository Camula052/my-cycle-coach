import React, { useState, useEffect } from 'react';
import { useTranslation } from './hooks/useTranslation';
import { getCurrentPhase, COLORS } from './utils/cycleHelpers';

// Screens
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import NutritionScreen from './screens/NutritionScreen';
import ActivityScreen from './screens/ActivityScreen';
import ProfileScreen from './screens/ProfileScreen';

// Components
import Onboarding from './components/Onboarding';
import DailyTrackingModal from './components/DailyTrackingModal';
import Navigation from './components/Navigation';

function App() {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cycleDay, setCycleDay] = useState(14);
  const [currentPhase, setCurrentPhase] = useState(getCurrentPhase(14));
  
  // Check if onboarding is complete
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    const savedUserData = localStorage.getItem('userData');
    
    if (!onboardingComplete) {
      setShowOnboarding(true);
    } else if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);
  
  // Berechne cycleDay und currentPhase wenn userData sich ändert
  useEffect(() => {
    const calculateCycleDay = () => {
      if (!userData || !userData.periodStartDate) {
        return 14; // Default fallback
      }
      
      const periodStartDate = new Date(userData.periodStartDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Checke auf markierten Eisprung
      const ovulationDatesStr = localStorage.getItem('ovulationDates');
      const ovulationDates = ovulationDatesStr ? JSON.parse(ovulationDatesStr) : {};
      const ovDates = Object.keys(ovulationDates).filter(key => ovulationDates[key]);
      
      let cycleDay;
      
      if (ovDates.length > 0) {
        // Finde den neuesten Eisprung
        const dates = ovDates.map(dateKey => {
          const [y, m, d] = dateKey.split('-').map(Number);
          return new Date(y, m - 1, d);
        }).sort((a, b) => b - a);
        
        const latestOvulation = dates[0];
        const daysSinceOvulation = Math.floor((today - latestOvulation) / (1000 * 60 * 60 * 24));
        cycleDay = 14 + daysSinceOvulation;
        
        // Handle negative days und wrap around
        if (cycleDay <= 0) {
          cycleDay = 28 + (cycleDay % 28);
        } else if (cycleDay > 28) {
          cycleDay = ((cycleDay - 1) % 28) + 1;
        }
      } else {
        // Normale Berechnung ohne Eisprung
        const daysSinceStart = Math.floor((today - periodStartDate) / (1000 * 60 * 60 * 24));
        cycleDay = daysSinceStart < 0 ? 1 : (daysSinceStart % 28) + 1;
      }
      
      return cycleDay;
    };
    
    const newCycleDay = calculateCycleDay();
    setCycleDay(newCycleDay);
    setCurrentPhase(getCurrentPhase(newCycleDay));
  }, [userData]); // Re-calculate wenn userData sich ändert
  
  // Check if onboarding is complete
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    const savedUserData = localStorage.getItem('userData');
    
    if (!onboardingComplete) {
      setShowOnboarding(true);
    } else if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);
  
  const handleOnboardingComplete = (data) => {
    setUserData(data);
    setShowOnboarding(false);
  };
  
  const handleSaveTracking = (data) => {
    console.log('Tracking gespeichert:', data);
    
    // Wenn neue Periode gestartet wurde, update periodStartDate
    if (data.isPeriodDay && data.date) {
      const updatedUserData = {
        ...userData,
        periodStartDate: data.date
      };
      setUserData(updatedUserData);
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // WICHTIG: Lösche alte Eisprung-Daten bei neuem Zyklus
      localStorage.removeItem('ovulationDates');
      
      // Force re-render
      setTimeout(() => setUserData({...updatedUserData}), 100);
    } else {
      // Force re-render auch wenn nur Eisprung oder andere Daten gespeichert wurden
      // indem wir userData "touchen"
      setUserData({...userData});
    }
    
    alert(t('dataSaved'));
  };

  const handleUpdateUserData = (newData) => {
    setUserData(newData);
  };
  
  const screens = {
    home: <HomeScreen 
            currentPhase={currentPhase} 
            cycleDay={cycleDay} 
            onOpenTracking={() => setIsTrackingModalOpen(true)}
            onNavigate={setCurrentScreen}
          />,
    calendar: <CalendarScreen 
                userData={userData}
                onUpdateUserData={handleUpdateUserData}
              />,
    nutrition: <NutritionScreen userData={userData} />,
    activity: <ActivityScreen userData={userData} />,
    profile: <ProfileScreen 
               userData={userData}
               onEditProfile={() => setShowOnboarding(true)}
             />
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Onboarding */}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      
      {/* Main Content */}
      {screens[currentScreen]}

      {/* Bottom Navigation */}
      <Navigation 
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />

      {/* Daily Tracking Modal */}
      <DailyTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        onSave={handleSaveTracking}
      />
    </div>
  );
}

export default App;