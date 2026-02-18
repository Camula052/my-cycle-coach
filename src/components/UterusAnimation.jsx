import React, { useState } from 'react';
import { COLORS } from '../utils/cycleHelpers';

const UterusAnimation = ({ phase, onClick }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);

  // Touch/Mouse Interaktion
  const handleInteractionStart = () => {
    setIsPressed(true);
  };

  const handleInteractionEnd = () => {
    setIsPressed(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleMove = (clientX, clientY, rect) => {
    if (!isPressed) return;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = ((centerY - y) / centerY) * 15;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, e.clientY, rect);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      handleMove(e.touches[0].clientX, e.touches[0].clientY, rect);
    }
  };

  // Phasen-spezifische Eigenschaften
  const getPhaseProps = () => {
    switch (phase.key) {
      case 'menstruation':
        return {
          endometriumSize: '60',
          endometriumColor: '#D84848',
          bloodFlow: '#C41E3A',
          muscleColor: '#E8B4B8',
          animation: '3s',
          glow: 'rgba(216, 72, 72, 0.5)'
        };
      case 'follicular':
        return {
          endometriumSize: '75',
          endometriumColor: '#E88BA0',
          bloodFlow: '#F4A4B4',
          muscleColor: '#F5C9D3',
          animation: '2s',
          glow: 'rgba(232, 139, 160, 0.5)'
        };
      case 'ovulation':
        return {
          endometriumSize: '90',
          endometriumColor: '#D4627A',
          bloodFlow: '#E85D7B',
          muscleColor: '#F5B8C5',
          animation: '1.5s',
          glow: 'rgba(212, 98, 122, 0.6)'
        };
      case 'luteal':
        return {
          endometriumSize: '80',
          endometriumColor: '#C76B7E',
          bloodFlow: '#DC8599',
          muscleColor: '#E8B8C3',
          animation: '2.5s',
          glow: 'rgba(199, 107, 126, 0.5)'
        };
      default:
        return {
          endometriumSize: '70',
          endometriumColor: '#E88BA0',
          bloodFlow: '#F4A4B4',
          muscleColor: '#F5C9D3',
          animation: '2s',
          glow: 'rgba(232, 139, 160, 0.4)'
        };
    }
  };

  const props = getPhaseProps();

  return (
    <div
      onClick={onClick}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd}
      onMouseMove={handleMouseMove}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onTouchMove={handleTouchMove}
      style={{
        width: '100%',
        maxWidth: '400px',
        height: '400px',
        margin: '0 auto',
        perspective: '1200px',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isPressed ? 0.95 : 1})`,
          transition: isPressed ? 'transform 0.1s' : 'transform 0.5s'
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '130%',
          height: '130%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${props.glow} 0%, transparent 70%)`,
          filter: 'blur(40px)',
          animation: `pulse ${props.animation} ease-in-out infinite`,
          zIndex: 0
        }}/>

        <svg viewBox="0 0 400 400" style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1,
          filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.25))'
        }}>
          <defs>
            <linearGradient id="muscleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={props.muscleColor} stopOpacity="1"/>
              <stop offset="100%" stopColor={props.muscleColor} stopOpacity="0.7"/>
            </linearGradient>
            <linearGradient id="endoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={props.endometriumColor} stopOpacity="1"/>
              <stop offset="100%" stopColor={props.endometriumColor} stopOpacity="0.8"/>
            </linearGradient>
            <radialGradient id="bloodGrad">
              <stop offset="0%" stopColor={props.bloodFlow} stopOpacity="0.9"/>
              <stop offset="100%" stopColor={props.bloodFlow} stopOpacity="0.5"/>
            </radialGradient>
            <filter id="shadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
              <feOffset dx="0" dy="3"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Körper-Kontext (Tiefe) */}
          <ellipse cx="200" cy="200" rx="180" ry="200" fill="#2D1B1B" opacity="0.15"
            style={{animation: `breathe ${props.animation} ease-in-out infinite`}}/>

          {/* Muskelgewebe */}
          <g style={{animation: `breathe ${props.animation} ease-in-out infinite`}}>
            {/* Hauptkörper */}
            <path
              d="M 120 140 Q 100 100, 120 80 L 140 110 Q 145 85, 160 75 
                 C 180 70, 200 68, 220 70 C 240 72, 255 85, 260 110 L 280 80 
                 Q 300 100, 280 140 Q 280 200, 260 250 C 250 275, 230 290, 200 295 
                 C 170 290, 150 275, 140 250 Q 120 200, 120 140 Z"
              fill="url(#muscleGrad)"
              stroke="#B8848F"
              strokeWidth="2"
              filter="url(#shadow)"/>

            {/* Eileiter Links */}
            <g opacity="0.9">
              <path d="M 100 110 Q 60 90, 45 70 Q 35 55, 40 40 Q 48 28, 62 33"
                fill={props.muscleColor} stroke="#B8848F" strokeWidth="3"/>
              <circle cx="42" cy="42" r="12" fill={props.bloodFlow} opacity="0.7"/>
              <circle cx="38" cy="48" r="8" fill={props.bloodFlow} opacity="0.6"/>
              <circle cx="48" cy="38" r="8" fill={props.bloodFlow} opacity="0.6"/>
            </g>

            {/* Eileiter Rechts */}
            <g opacity="0.9">
              <path d="M 300 110 Q 340 90, 355 70 Q 365 55, 360 40 Q 352 28, 338 33"
                fill={props.muscleColor} stroke="#B8848F" strokeWidth="3"/>
              <circle cx="358" cy="42" r="12" fill={props.bloodFlow} opacity="0.7"/>
              <circle cx="362" cy="48" r="8" fill={props.bloodFlow} opacity="0.6"/>
              <circle cx="352" cy="38" r="8" fill={props.bloodFlow} opacity="0.6"/>
            </g>

            {/* Eierstöcke */}
            <ellipse cx="45" cy="55" rx="22" ry="28" fill={props.muscleColor} opacity="0.9"/>
            <ellipse cx="45" cy="55" rx="18" ry="24" fill={props.bloodFlow} opacity="0.5"/>
            {(phase.key === 'follicular' || phase.key === 'ovulation') && (
              <circle cx="50" cy="50" r="6" fill="#FFD700" opacity="0.8"/>
            )}
            <ellipse cx="355" cy="55" rx="22" ry="28" fill={props.muscleColor} opacity="0.9"/>
            <ellipse cx="355" cy="55" rx="18" ry="24" fill={props.bloodFlow} opacity="0.5"/>
            {(phase.key === 'follicular' || phase.key === 'ovulation') && (
              <circle cx="350" cy="50" r="6" fill="#FFD700" opacity="0.8"/>
            )}
          </g>

          {/* Endometrium */}
          <g style={{animation: `innerPulse ${props.animation} ease-in-out infinite`}}>
            <ellipse cx="200" cy="180" rx={props.endometriumSize} ry="85"
              fill="url(#endoGrad)" opacity="0.85"/>
            <ellipse cx="200" cy="180" rx="45" ry="70"
              fill="url(#bloodGrad)" opacity="0.6"/>
            <ellipse cx="200" cy="180" rx="25" ry="50"
              fill="#3D1F1F" opacity="0.3"/>
          </g>

          {/* Cervix */}
          <path d="M 175 295 L 170 315 Q 170 325, 175 330 L 185 340 
                   Q 200 345, 215 340 L 225 330 Q 230 325, 230 315 L 225 295 Z"
            fill={props.muscleColor} stroke="#B8848F" strokeWidth="2" opacity="0.95"/>
          <line x1="200" y1="295" x2="200" y2="340" stroke="#3D1F1F" strokeWidth="3" opacity="0.4"/>

          {/* 3D Highlights */}
          <ellipse cx="150" cy="160" rx="40" ry="60" fill="white" opacity="0.2"/>
          <ellipse cx="180" cy="140" rx="30" ry="45" fill="white" opacity="0.15"/>

          {/* Blutgefäße */}
          <g opacity="0.4" style={{animation: `pulse ${props.animation} ease-in-out infinite`}}>
            <path d="M 140 160 Q 145 180, 150 200" stroke={props.bloodFlow} strokeWidth="2" fill="none"/>
            <path d="M 260 160 Q 255 180, 250 200" stroke={props.bloodFlow} strokeWidth="2" fill="none"/>
            <path d="M 180 250 Q 190 260, 200 270" stroke={props.bloodFlow} strokeWidth="2" fill="none"/>
            <path d="M 220 250 Q 210 260, 200 270" stroke={props.bloodFlow} strokeWidth="2" fill="none"/>
          </g>
        </svg>

        <style>{`
          @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
            50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.9; }
          }
          @keyframes breathe {
            0%, 100% { transform: scale(1) translateY(0); }
            50% { transform: scale(1.03) translateY(-3px); }
          }
          @keyframes innerPulse {
            0%, 100% { transform: scale(1); opacity: 0.85; }
            50% { transform: scale(1.08); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default UterusAnimation;
