import React from 'react';
import { MessageCircle } from 'lucide-react';

const COLORS = {
  follicular: '#B8E6D5',
  text: '#2D3748'
};

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

export default FloatingButton;