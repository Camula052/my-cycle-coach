import React, { useState, useEffect } from 'react';
import { Calendar, Home, Utensils, Activity, User, MessageCircle } from 'lucide-react';
import { useTranslation } from './hooks/useTranslation';
import Onboarding from './components/Onboarding';
import { getDaysInMonth, getFirstDayOfMonth, getMonthName } from './utils/dateHelpers';

// Farbschema (Pastell)
const COLORS = {
  menstruation: '#E6B89C',
  follicular: '#B8E6D5',
  ovulation: '#F5C2C7',
  luteal: '#F9E4B7',
  background: '#FEFEFE',
  cardBg: '#FFFFFF',
  text: '#2D3748',
  textLight: '#718096'
};

// Zyklus-Phasen Definition (ohne Texte - kommen aus Translations)
const CYCLE_PHASES = {
  menstruation: {
    color: COLORS.menstruation,
    gradient: 'linear-gradient(135deg, #E6B89C 0%, #F5D5C0 100%)',
    days: [1, 2, 3, 4, 5]
  },
  follicular: {
    color: COLORS.follicular,
    gradient: 'linear-gradient(135deg, #B8E6D5 0%, #D4F1E8 100%)',
    days: [6, 7, 8, 9, 10, 11, 12, 13]
  },
  ovulation: {
    color: COLORS.ovulation,
    gradient: 'linear-gradient(135deg, #F5C2C7 0%, #FFE0E5 100%)',
    days: [14]
  },
  luteal: {
    color: COLORS.luteal,
    gradient: 'linear-gradient(135deg, #F9E4B7 0%, #FFF4D6 100%)',
    days: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
  }
};

const getCurrentPhase = (cycleDay) => {
  for (const [key, phase] of Object.entries(CYCLE_PHASES)) {
    if (phase.days.includes(cycleDay)) {
      return { key, ...phase };
    }
  }
  return { key: 'menstruation', ...CYCLE_PHASES.menstruation };
};

// Daily Tracking Modal Component
const DailyTrackingModal = ({ isOpen, onClose, onSave }) => {
  const { t, language } = useTranslation();  
  console.log('Current language:', language);
  
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

// Floating Action Button
const FloatingButton = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: COLORS.follicular,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 8px 32px ${COLORS.follicular}60`,
        zIndex: 100,
        animation: 'breathe 3s ease-in-out infinite',
        transition: 'transform 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <MessageCircle size={28} color={COLORS.text} />
      <style>
        {`
          @keyframes breathe {
            0%, 100% { 
              transform: scale(1);
              box-shadow: 0 8px 32px ${COLORS.follicular}60;
            }
            50% { 
              transform: scale(1.05);
              box-shadow: 0 12px 40px ${COLORS.follicular}80;
            }
          }
        `}
      </style>
    </button>
  );
};

// Screen Components
const HomeScreen = ({ currentPhase, cycleDay, onOpenTracking }) => {
  const { t } = useTranslation();
  
  return (
    <div style={{
      minHeight: '100vh',
      background: currentPhase.gradient,
      padding: '40px 24px 100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      {/* Phase Icon/Visual */}
      <div style={{
        width: '160px',
        height: '160px',
        marginBottom: '32px',
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '72px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        🌸
      </div>

      {/* Phase Name */}
      <h1 style={{
        color: COLORS.text,
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '8px',
        textAlign: 'center',
        textShadow: '0 2px 8px rgba(255, 255, 255, 0.5)'
      }}>
        {t(`phases.${currentPhase.key}.name`)}
      </h1>

      {/* Cycle Day */}
      <p style={{
        color: COLORS.text,
        fontSize: '16px',
        opacity: 0.8,
        marginBottom: '48px',
        textAlign: 'center'
      }}>
        {t('home.cycleDay', { day: cycleDay })}
      </p>

      {/* Phase Info */}
      <div style={{
        maxWidth: '500px',
        padding: '32px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
      }}>
        <h3 style={{
          color: COLORS.text,
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {t('home.whatIsHappening')}
        </h3>
        <p style={{
          color: COLORS.text,
          lineHeight: '1.7',
          fontSize: '16px',
          textAlign: 'center',
          opacity: 0.9
        }}>
          {t(`phases.${currentPhase.key}.info`)}
        </p>
      </div>

      {/* Floating Button */}
      <FloatingButton 
        onClick={onOpenTracking}
        label={t('home.tellMeAboutDay')}
      />
    </div>
  );
};

const CalendarScreen = ({userData}) => {
  const { t } = useTranslation();
  const[currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = getMonthName(month, t.language);
  
  const emptyDays = Array(firstDay - 1).fill(null);
  const days = Array.from({length: daysInMonth}, (_,i ) => i+1);
  const calendarDays = [...emptyDays, ...days];
  
  const periodStartDate = userData?.periodStartDate 
    ? new Date(userData.periodStartDate) 
    : new Date();

  const getCycleDayForDate = (day) => {
    const targetDate = new Date(year, month, day);
    const daysSinceStart = Math.floor((targetDate - periodStartDate) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysSinceStart % 28) + 1;
    return cycleDay;
  };

  const getColorForDay = (day) => {
    const cycleDay = getCycleDayForDate(day);
    const phase = getCurrentPhase(cycleDay);
    return phase.color;
  }

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
              aspectRatio: '1', // Macht Quadrate
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              // TODO: Farbe nur wenn day nicht null ist
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

const NutritionScreen = () => {
  const { t } = useTranslation();
  return (
    <div style={{ padding: '20px', paddingBottom: '100px', maxWidth: '600px', margin: '0 auto'}}>
      <h2 style={{ color: COLORS.text, marginBottom: '16px' }}>{t('navigation.nutrition')}</h2>
      <p style={{ color: COLORS.textLight }}>{t('comingSoon')}</p>
    </div>
  );
};

const ActivityScreen = () => {
  const { t } = useTranslation();
  return (
    <div style={{ padding: '20px', paddingBottom: '100px', textAlign: 'center' }}>
      <h2 style={{ color: COLORS.text, marginBottom: '16px' }}>{t('navigation.activity')}</h2>
      <p style={{ color: COLORS.textLight }}>{t('comingSoon')}</p>
    </div>
  );
};

const ProfileScreen = ({ userData, onEditProfile }) => {
  const { t, language, changeLanguage } = useTranslation();
  
  if (!userData) {
    return (
      <div style={{ padding: '20px', paddingBottom: '100px', textAlign: 'center' }}>
        <h2 style={{ color: COLORS.text, marginBottom: '16px' }}>{t('navigation.profile')}</h2>
        <p style={{ color: COLORS.textLight }}>{t('profile.noData')}</p>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>
      <h2 style={{ color: COLORS.text, marginBottom: '24px', fontSize: '24px', fontWeight: '600' }}>
        {t('navigation.profile')}
      </h2>
      
      {/* User Info */}
      <div style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
        border: '1.5px solid rgba(226, 232, 240, 0.5)'
      }}>
        <h3 style={{ color: COLORS.text, fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          {t('profile.personalData')}
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <span style={{ color: COLORS.textLight, fontSize: '14px' }}>{t('profile.name')}:</span>
            <p style={{ color: COLORS.text, fontSize: '16px', fontWeight: '500' }}>{userData.name}</p>
          </div>
          {userData.age && (
            <div>
              <span style={{ color: COLORS.textLight, fontSize: '14px' }}>{t('profile.age')}:</span>
              <p style={{ color: COLORS.text, fontSize: '16px', fontWeight: '500' }}>{userData.age}</p>
            </div>
          )}
          {userData.height && (
            <div>
              <span style={{ color: COLORS.textLight, fontSize: '14px' }}>{t('profile.height')}:</span>
              <p style={{ color: COLORS.text, fontSize: '16px', fontWeight: '500' }}>{userData.height} cm</p>
            </div>
          )}
          {userData.weight && (
            <div>
              <span style={{ color: COLORS.textLight, fontSize: '14px' }}>{t('profile.weight')}:</span>
              <p style={{ color: COLORS.text, fontSize: '16px', fontWeight: '500' }}>{userData.weight} kg</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Language Switcher */}
      <div style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
        border: '1.5px solid rgba(226, 232, 240, 0.5)'
      }}>
        <h3 style={{ color: COLORS.text, fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          {t('profile.language')}
        </h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => changeLanguage('de')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: language === 'de' ? COLORS.follicular : 'transparent',
              border: `2px solid ${language === 'de' ? COLORS.follicular : 'rgba(226, 232, 240, 0.5)'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              color: COLORS.text
            }}
          >
            🇩🇪 Deutsch
          </button>
          <button
            onClick={() => changeLanguage('en')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: language === 'en' ? COLORS.follicular : 'transparent',
              border: `2px solid ${language === 'en' ? COLORS.follicular : 'rgba(226, 232, 240, 0.5)'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              color: COLORS.text
            }}
          >
            🇬🇧 English
          </button>
        </div>
      </div>
      
      {/* Edit Button */}
      <button
        onClick={onEditProfile}
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
        {t('profile.editProfile')}
      </button>
    </div>
  );
};

// Main App Component
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
  
  const currentPhase = getCurrentPhase(cycleDay);

  const handleSaveTracking = (data) => {
    console.log('Tracking gespeichert:', data);
    alert(t('dataSaved'));
  };

  // Navigation Items - muss hier sein damit t() bei Sprachwechsel aktualisiert wird
  const navItems = [
    { id: 'home', icon: Home, label: t('navigation.home') },
    { id: 'calendar', icon: Calendar, label: t('navigation.calendar') },
    { id: 'nutrition', icon: Utensils, label: t('navigation.nutrition') },
    { id: 'activity', icon: Activity, label: t('navigation.activity') },
    { id: 'profile', icon: User, label: t('navigation.profile') }
  ];

const screens = {
  home: <HomeScreen 
          currentPhase={currentPhase} 
          cycleDay={cycleDay} 
          onOpenTracking={() => setIsTrackingModalOpen(true)} 
        />,
  calendar: <CalendarScreen userData={userData} />,
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
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(226, 232, 240, 0.3)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
        zIndex: 50
      }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: currentScreen === item.id ? COLORS.follicular : COLORS.textLight,
              transition: 'all 0.3s ease',
              filter: currentScreen === item.id ? `drop-shadow(0 0 8px ${COLORS.follicular}80)` : 'none'
            }}
          >
            <item.icon size={24} />
            <span style={{ fontSize: '11px', fontWeight: '500' }}>{item.label}</span>
          </button>
        ))}
      </div>

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