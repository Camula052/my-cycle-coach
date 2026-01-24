import React, { useState } from 'react';
import { Calendar, Home, Utensils, Activity, User, MessageCircle } from 'lucide-react';

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

// Zyklus-Phasen Definition
const CYCLE_PHASES = {
  menstruation: {
    name: 'Menstruationsphase',
    color: COLORS.menstruation,
    gradient: 'linear-gradient(135deg, #E6B89C 0%, #F5D5C0 100%)',
    info: 'Die Gebärmutterschleimhaut wird abgestoßen. Niedriger Östrogen- und Progesteronspiegel führt oft zu Müdigkeit.',
    days: [1, 2, 3, 4, 5]
  },
  follicular: {
    name: 'Follikelphase',
    color: COLORS.follicular,
    gradient: 'linear-gradient(135deg, #B8E6D5 0%, #D4F1E8 100%)',
    info: 'Nach der Blutung reifen neue Eibläschen heran. Der Östrogenspiegel steigt, was Energie und Wohlbefinden steigern kann.',
    days: [6, 7, 8, 9, 10, 11, 12, 13]
  },
  ovulation: {
    name: 'Ovulationsphase',
    color: COLORS.ovulation,
    gradient: 'linear-gradient(135deg, #F5C2C7 0%, #FFE0E5 100%)',
    info: 'Ein reifer Follikel platzt, die Eizelle wandert in den Eileiter. Dies ist der Zeitpunkt maximaler Fruchtbarkeit.',
    days: [14]
  },
  luteal: {
    name: 'Lutealphase',
    color: COLORS.luteal,
    gradient: 'linear-gradient(135deg, #F9E4B7 0%, #FFF4D6 100%)',
    info: 'Der geplatzte Follikel produziert Progesteron. Die Schleimhaut verdickt sich weiter. Energie sinkt oft, PMS kann auftreten.',
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
  const [mood, setMood] = useState(3);
  const [symptoms, setSymptoms] = useState({});
  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('');

  const moodEmojis = [
    { emoji: '😢', color: '#94A3B8', label: 'Sehr schlecht' },
    { emoji: '😟', color: '#CBD5E1', label: 'Schlecht' },
    { emoji: '😐', color: '#FDE68A', label: 'Neutral' },
    { emoji: '🙂', color: '#FCD34D', label: 'Gut' },
    { emoji: '😊', color: '#FDE047', label: 'Sehr gut' }
  ];

  const symptomsList = [
    'Kopfschmerzen', 'Rückenschmerzen', 'Schulterschmerzen', 'Unterleibsschmerzen',
    'Krämpfe', 'Kalt', 'Heiß', 'Schwitzig', 'Aufgebläht', 'Antriebslos', 'Heißhunger'
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
          Erzähl mir von deinem Tag
        </h2>

        {/* Stimmung */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: COLORS.text, marginBottom: '16px', fontSize: '18px' }}>Wie fühlst du dich heute?</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            {moodEmojis.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setMood(idx + 1)}
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
          <h3 style={{ color: COLORS.text, marginBottom: '16px', fontSize: '18px' }}>Symptome</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {symptomsList.map(symptom => (
              <label
                key={symptom}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: symptoms[symptom] ? `${COLORS.follicular}40` : 'transparent',
                  border: `1.5px solid ${symptoms[symptom] ? COLORS.follicular : 'rgba(226, 232, 240, 0.5)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: COLORS.text,
                  transition: 'all 0.3s ease',
                  boxShadow: symptoms[symptom] ? `0 0 15px ${COLORS.follicular}40` : 'none'
                }}
              >
                <input
                  type="checkbox"
                  checked={symptoms[symptom] || false}
                  onChange={(e) => setSymptoms({ ...symptoms, [symptom]: e.target.checked })}
                  style={{ marginRight: '8px' }}
                />
                {symptom}
              </label>
            ))}
          </div>
        </div>

        {/* Gewicht */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: COLORS.text, marginBottom: '8px', fontSize: '18px' }}>Gewicht (optional)</h3>
          <p style={{ color: COLORS.textLight, fontSize: '12px', marginBottom: '12px', opacity: 0.7 }}>
            Hinweis: Zu regelmäßige Gewichtskontrolle kann zu einem ungesunden Verhältnis zum Körper führen.
          </p>
          <input
            type="number"
            step="0.1"
            placeholder="kg"
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
          <h3 style={{ color: COLORS.text, marginBottom: '8px', fontSize: '18px' }}>Basaltemperatur (optional)</h3>
          <p style={{ color: COLORS.textLight, fontSize: '12px', marginBottom: '12px', opacity: 0.7 }}>
            Für NFP-Verhütung
          </p>
          <input
            type="number"
            step="0.01"
            placeholder="°C"
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
            Abbrechen
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
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

// Floating Action Button with breathing animation
const FloatingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
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
const HomeScreen = ({ currentPhase, cycleDay, onOpenTracking }) => (
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
      {currentPhase.name}
    </h1>

    {/* Cycle Day */}
    <p style={{
      color: COLORS.text,
      fontSize: '16px',
      opacity: 0.8,
      marginBottom: '48px',
      textAlign: 'center'
    }}>
      Tag {cycleDay} deines Zyklus
    </p>

    {/* Phase Info - direkt auf Hintergrund */}
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
        Was geht gerade ab
      </h3>
      <p style={{
        color: COLORS.text,
        lineHeight: '1.7',
        fontSize: '16px',
        textAlign: 'center',
        opacity: 0.9
      }}>
        {currentPhase.info}
      </p>
    </div>

    {/* Floating Button */}
    <FloatingButton onClick={onOpenTracking} />
  </div>
);

const CalendarScreen = () => (
  <div style={{ padding: '20px', paddingBottom: '100px', textAlign: 'center' }}>
    <h2 style={{ color: COLORS.text, marginBottom: '16px' }}>Zykluskalender</h2>
    <p style={{ color: COLORS.textLight }}>Coming soon...</p>
  </div>
);

const NutritionScreen = () => (
  <div style={{ padding: '20px', paddingBottom: '100px', textAlign: 'center' }}>
    <h2 style={{ color: COLORS.text, marginBottom: '16px' }}>Ernährung</h2>
    <p style={{ color: COLORS.textLight }}>Coming soon...</p>
  </div>
);

const ActivityScreen = () => (
  <div style={{ padding: '20px', paddingBottom: '100px', textAlign: 'center' }}>
    <h2 style={{ color: COLORS.text, marginBottom: '16px' }}>Bewegung</h2>
    <p style={{ color: COLORS.textLight }}>Coming soon...</p>
  </div>
);

const ProfileScreen = () => (
  <div style={{ padding: '20px', paddingBottom: '100px', textAlign: 'center' }}>
    <h2 style={{ color: COLORS.text, marginBottom: '16px' }}>Profil</h2>
    <p style={{ color: COLORS.textLight }}>Coming soon...</p>
  </div>
);

// Main App Component
function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [cycleDay, setCycleDay] = useState(14);
  
  const currentPhase = getCurrentPhase(cycleDay);

  const handleSaveTracking = (data) => {
    console.log('Tracking gespeichert:', data);
    alert('Daten gespeichert! (Schau in die Console für Details)');
  };

  const screens = {
    home: <HomeScreen 
            currentPhase={currentPhase} 
            cycleDay={cycleDay} 
            onOpenTracking={() => setIsTrackingModalOpen(true)} 
          />,
    calendar: <CalendarScreen />,
    nutrition: <NutritionScreen />,
    activity: <ActivityScreen />,
    profile: <ProfileScreen />
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Kalender' },
    { id: 'nutrition', icon: Utensils, label: 'Ernährung' },
    { id: 'activity', icon: Activity, label: 'Bewegung' },
    { id: 'profile', icon: User, label: 'Profil' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
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