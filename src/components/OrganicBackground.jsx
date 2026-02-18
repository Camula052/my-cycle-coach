import React, { useEffect, useState } from 'react';

const OrganicBackground = ({ phase }) => {
  const [particles, setParticles] = useState([]);

  // Generiere zufällige Partikel
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const particleCount = 35; // Mehr Partikel!
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 5 + 2, // 2-7px, alle rund
          delay: Math.random() * 10,
          duration: Math.random() * 15 + 10
        });
      }
      
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Phasen-spezifische Farben (DUNKEL in Mitte, HELL an Rändern!)
  const getPhaseColors = () => {
    switch (phase.key) {
      case 'menstruation':
        return {
          center: '#8B4555', // DUNKEL Bordeaux in Mitte
          edge: '#F5B8C5', // HELL Rosa an Rändern
          glow: 'rgba(139, 69, 85, 0.6)',
          particles: '#E88BA0'
        };
      case 'follicular':
        return {
          center: '#4A8B6F', // DUNKEL Grün in Mitte
          edge: '#B8E6D5', // HELL Mint an Rändern
          glow: 'rgba(74, 139, 111, 0.6)',
          particles: '#7BC4A8'
        };
      case 'ovulation':
        return {
          center: '#A6536B', // DUNKEL Rosa in Mitte
          edge: '#F5C2C7', // HELL Rosa an Rändern
          glow: 'rgba(166, 83, 107, 0.6)',
          particles: '#D4627A'
        };
      case 'luteal':
        return {
          center: '#B8935C', // DUNKEL Gold in Mitte
          edge: '#F9E4B7', // HELL Gelb an Rändern
          glow: 'rgba(184, 147, 92, 0.6)',
          particles: '#E8C68A'
        };
      default:
        return {
          center: '#4A8B6F',
          edge: '#B8E6D5',
          glow: 'rgba(74, 139, 111, 0.6)',
          particles: '#7BC4A8'
        };
    }
  };

  const colors = getPhaseColors();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      backgroundColor: colors.edge // Base color
    }}>
      {/* Layer 1: Dunkler Kreis in der Mitte */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '150%',
        height: '150%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.center} 0%, ${colors.center} 30%, transparent 70%)`,
        animation: 'breathe 8s ease-in-out infinite'
      }} />

      {/* Layer 2: Mittlerer Übergangskreis */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120%',
        height: '120%',
        borderRadius: '50%',
        background: `radial-gradient(circle, transparent 40%, ${colors.edge}80 100%)`,
        animation: 'breathe 8s ease-in-out infinite 0.5s'
      }} />

      {/* Membran-Glow um die Ränder */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: '40px solid transparent',
        borderImage: `radial-gradient(circle at center, transparent 60%, ${colors.glow} 100%) 1`,
        filter: 'blur(20px)',
        animation: 'membranePulse 4s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      {/* Extra Glow-Layer für Tiefe */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        right: '-10%',
        bottom: '-10%',
        background: `radial-gradient(circle at center, transparent 50%, ${colors.glow} 100%)`,
        animation: 'glowPulse 6s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      {/* Dunkle schwebende Partikel */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`, // Immer rund!
            borderRadius: '50%',
            background: colors.particles,
            boxShadow: `0 0 ${particle.size * 3}px ${colors.particles}`,
            animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite, shimmer 3s ease-in-out infinite`,
            pointerEvents: 'none',
            opacity: 0.8
          }}
        />
      ))}

      {/* Größere dunkle runde Sporen */}
      {[...Array(12)].map((_, i) => {
        const size = Math.random() * 12 + 8; // 8-20px
        return (
          <div
            key={`spore-${i}`}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`, // Rund!
              borderRadius: '50%',
              background: colors.particles,
              opacity: 0.6,
              filter: 'blur(2px)',
              animation: `floatSlow ${Math.random() * 20 + 15}s ease-in-out ${Math.random() * 5}s infinite`,
              pointerEvents: 'none'
            }}
          />
        );
      })}

      {/* NEUE: Helle Glow-Punkte */}
      {[...Array(15)].map((_, i) => {
        const size = Math.random() * 6 + 3; // 3-9px
        return (
          <div
            key={`glow-${i}`}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: `0 0 ${size * 4}px rgba(255, 255, 255, 0.8), 0 0 ${size * 8}px rgba(255, 255, 255, 0.4)`,
              animation: `float ${Math.random() * 18 + 12}s ease-in-out ${Math.random() * 8}s infinite, shimmerBright 2s ease-in-out infinite`,
              pointerEvents: 'none',
              opacity: 0.7
            }}
          />
        );
      })}

      <style>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.95;
          }
        }

        @keyframes membranePulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.01);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-15px, -50px) scale(0.9);
          }
          75% {
            transform: translate(-30px, -20px) scale(1.05);
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(30px, -40px);
          }
          50% {
            transform: translate(-20px, -80px);
          }
          75% {
            transform: translate(-40px, -30px);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes shimmerBright {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
};

export default OrganicBackground;
