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
  
  // Berechne den aktuellen Zyklustag basierend auf periodStartDate oder Eisprung
  const getCurrentCycleDay = () => {
    if (!userData?.periodStartDate) return 1;
    
    // Lade Eisprung-Daten
    const ovulationDatesStr = localStorage.getItem('ovulationDates');
    const ovulationDates = ovulationDatesStr ? JSON.parse(ovulationDatesStr) : {};
    
    // Finde neuesten markierten Eisprung
    const ovDates = Object.keys(ovulationDates).filter(key => ovulationDates[key]);
    if (ovDates.length > 0) {
      const dates = ovDates.map(dateKey => {
        const [y, m, d] = dateKey.split('-').map(Number);
        return new Date(y, m - 1, d);
      }).sort((a, b) => b - a);
      
      const latestOvulation = dates[0];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const daysSinceOvulation = Math.floor((today - latestOvulation) / (1000 * 60 * 60 * 24));
      const cycleDay = 14 + daysSinceOvulation;
      
      if (cycleDay <= 0) {
        return 28 + (cycleDay % 28);
      } else if (cycleDay > 28) {
        return ((cycleDay - 1) % 28) + 1;
      }
      return cycleDay;
    }
    
    // Fallback auf Periodenstart
    const periodStartDate = new Date(userData.periodStartDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const daysSinceStart = Math.floor((today - periodStartDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceStart < 0) {
      return 1;
    }
    
    const cycleDay = (daysSinceStart % 28) + 1;
    return cycleDay;
  };
  
  const cycleDay = getCurrentCycleDay();
  
  const handleSaveTracking = (data) => {
    console.log('Tracking gespeichert:', data);
    alert(t('dataSaved'));
  };
  
  const currentPhase = getCurrentPhase(cycleDay);

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
    activity: <ActivityScreen />,
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