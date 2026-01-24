import React, { useState } from 'react';
import { Calendar, Home, Utensils, Activity, User, MessageCircle } from 'lucide-react';

// Farbschema (Pastell)
const COLORS = {
  menstruation: '#E6B89C',    // Warmes Orange/Terracotta
  follicular: '#B8E6D5',      // Helles Mint/Salbeigrün
  ovulation: '#F5C2C7',       // Zartes Rosé/Pfirsich
  luteal: '#F9E4B7',          // Weiches Gelb/Vanille
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
    info: 'Die Gebärmutterschleimhaut wird abgestoßen. Niedriger Östrogen- und Progesteronspiegel führt oft zu Müdigkeit.',
    days: [1, 2, 3, 4, 5]
  },
  follicular: {
    name: 'Follikelphase',
    color: COLORS.follicular,
    info: 'Nach der Blutung reifen neue Eibläschen heran. Der Östrogenspiegel steigt, was Energie und Wohlbefinden steigern kann.',
    days: [6, 7, 8, 9, 10, 11, 12, 13]
  },
  ovulation: {
    name: 'Ovulationsphase',
    color: COLORS.ovulation,
    info: 'Ein reifer Follikel platzt, die Eizelle wandert in den Eileiter. Dies ist der Zeitpunkt maximaler Fruchtbarkeit.',
    days: [14]
  },
  luteal: {
    name: 'Lutealphase',
    color: COLORS.luteal,
    info: 'Der geplatzte Follikel produziert Progesteron. Die Schleimhaut verdickt sich weiter. Energie sinkt oft, PMS kann auftreten.',
    days: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
  }
};

// Funktion um aktuelle Phase zu bestimmen
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
                  backgroundColor: mood === idx + 1 ? m.color : COLORS.cardBg,
                  border: `2px solid ${mood === idx + 1 ? m.color : '#E2E8F0'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
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
                  backgroundColor: symptoms[symptom] ? COLORS.follicular : COLORS.cardBg,
                  border: `2px solid ${symptoms[symptom] ? COLORS.follicular : '#E2E8F0'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: COLORS.text
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
          <p style={{ color: COLORS.textLight, fontSize: '12px', marginBottom: '12px' }}>
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
              border: '2px solid #E2E8F0',
              borderRadius: '8px',
              backgroundColor: COLORS.cardBg
            }}
          />
        </div>

        {/* Basaltemperatur */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: COLORS.text, marginBottom: '8px', fontSize: '18px' }}>Basaltemperatur (optional)</h3>
          <p style={{ color: COLORS.textLight, fontSize: '12px', marginBottom: '12px' }}>
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
              border: '2px solid #E2E8F0',
              borderRadius: '8px',
              backgroundColor: COLORS.cardBg
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
              backgroundColor: COLORS.cardBg,
              border: '2px solid #E2E8F0',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              color: COLORS.text
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
              backgroundColor: COLORS.follicular,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              color: COLORS.text
            }}
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

// Screen Components
const HomeScreen = ({ currentPhase, cycleDay, onOpenTracking }) => (
  <div style={{ padding: '20px', paddingBottom: '100px' }}>
    {/* Phase Visualisierung */}
    <div style={{
      backgroundColor: currentPhase.color,
      borderRadius: '24px',
      padding: '32px',
      marginBottom: '24px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '120px',
        height: '120px',
        margin: '0 auto 24px',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px'
      }}>
        🌸
      </div>
      <h2 style={{ color: COLORS.text, marginBottom: '8px', fontSize: '24px', fontWeight: '600' }}>
        {currentPhase.name}
      </h2>
      <p style={{ color: COLORS.text, fontSize: '14px', opacity: 0.8 }}>
        Tag {cycleDay} deines Zyklus
      </p>
    </div>

    {/* Phase Info */}
    <div style={{
      backgroundColor: COLORS.cardBg,
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ color: COLORS.text, marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>
        Was geht gerade ab
      </h3>
      <p style={{ color: COLORS.textLight, lineHeight: '1.6', fontSize: '15px' }}>
        {currentPhase.info}
      </p>
    </div>

    {/* Daily Tracking Button */}
    <button
      onClick={onOpenTracking}
      style={{
        width: '100%',
        padding: '20px',
        backgroundColor: COLORS.follicular,
        border: 'none',
        borderRadius: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontSize: '16px',
        fontWeight: '600',
        color: COLORS.text,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <MessageCircle size={24} />
      Erzähl mir von deinem Tag
    </button>
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
  const [cycleDay, setCycleDay] = useState(14); // Beispiel: Tag 14 (Ovulation)
  
  const currentPhase = getCurrentPhase(cycleDay);

  const handleSaveTracking = (data) => {
    console.log('Tracking gespeichert:', data);
    // TODO: Später in State/Storage speichern
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
        backgroundColor: COLORS.cardBg,
        borderTop: '1px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
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
              transition: 'color 0.2s'
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