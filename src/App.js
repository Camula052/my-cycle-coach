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
  const [cycleDay, setCycleDay] = useState(14);
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
    // TODO: Berechne cycleDay basierend auf periodStartDate
  };
  
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
    nutrition: <NutritionScreen />,
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