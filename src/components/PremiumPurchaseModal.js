import React, { useState } from 'react';
import { X, Check, Star, Sparkles } from 'lucide-react';
import { PRODUCTS, purchaseService } from '../services/premiumService';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096',
  primary: '#E8A888'
};

const PremiumPurchaseModal = ({ isOpen, onClose, productType = 'nutrition', onPurchaseComplete }) => {
  const [selectedProduct, setSelectedProduct] = useState('complete_bundle');
  const [purchasing, setPurchasing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setPurchasing(true);
    
    try {
      // Mock Purchase (in Production: echter Payment Flow)
      const result = await purchaseService.mockPurchase(selectedProduct);
      
      if (result.success) {
        if (onPurchaseComplete) {
          onPurchaseComplete(selectedProduct);
        }
        alert('✅ Kauf erfolgreich! Premium freigeschaltet! 🎉');
        onClose();
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('❌ Kauf fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setPurchasing(false);
    }
  };

  const products = productType === 'nutrition' 
    ? [PRODUCTS.NUTRITION, PRODUCTS.BUNDLE]
    : [PRODUCTS.ACTIVITY, PRODUCTS.BUNDLE];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 3000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} color={COLORS.text} />
        </button>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #E8A888 0%, #D67D5E 100%)',
          padding: '40px 32px 32px',
          borderRadius: '24px 24px 0 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '48px',
            opacity: 0.2
          }}>
            ✨
          </div>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            fontSize: '36px',
            opacity: 0.2
          }}>
            💎
          </div>

          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            backdropFilter: 'blur(10px)'
          }}>
            <Star size={40} color="white" fill="white" />
          </div>

          <h2 style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            Premium freischalten
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '15px'
          }}>
            Wähle das passende Paket für dich
          </p>
        </div>

        {/* Products */}
        <div style={{ padding: '24px' }}>
          {products.map(product => {
            const isBundle = product.id === 'complete_bundle';
            const isSelected = selectedProduct === product.id;

            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                style={{
                  border: `3px solid ${isSelected ? COLORS.primary : '#E0E0E0'}`,
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: isSelected ? 'rgba(232, 168, 136, 0.05)' : 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Recommended Badge */}
                {product.recommended && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(255,165,0,0.3)'
                  }}>
                    <Sparkles size={12} />
                    EMPFOHLEN
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}>
                  {/* Icon */}
                  <div style={{
                    fontSize: '48px',
                    lineHeight: 1
                  }}>
                    {product.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      color: COLORS.text,
                      fontSize: '20px',
                      fontWeight: '700',
                      marginBottom: '4px'
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      color: COLORS.textLight,
                      fontSize: '14px',
                      marginBottom: '12px'
                    }}>
                      {product.description}
                    </p>

                    {/* Features */}
                    <div style={{ marginBottom: '12px' }}>
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '6px'
                          }}
                        >
                          <Check size={16} color={COLORS.primary} />
                          <span style={{
                            color: COLORS.text,
                            fontSize: '13px'
                          }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Price */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{
                        color: COLORS.text,
                        fontSize: '28px',
                        fontWeight: '700'
                      }}>
                        {product.price}
                      </span>
                      {product.savings && (
                        <span style={{
                          background: '#4CAF50',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {product.savings}
                        </span>
                      )}
                    </div>
                    {isBundle && (
                      <p style={{
                        color: COLORS.textLight,
                        fontSize: '12px',
                        marginTop: '4px'
                      }}>
                        Statt 9,98€ einzeln
                      </p>
                    )}
                  </div>

                  {/* Radio */}
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: `3px solid ${isSelected ? COLORS.primary : '#E0E0E0'}`,
                    background: isSelected ? COLORS.primary : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isSelected && <Check size={16} color="white" strokeWidth={3} />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={purchasing}
            style={{
              width: '100%',
              padding: '18px',
              background: purchasing 
                ? '#CCC' 
                : 'linear-gradient(135deg, #E8A888 0%, #D67D5E 100%)',
              border: 'none',
              borderRadius: '14px',
              cursor: purchasing ? 'not-allowed' : 'pointer',
              fontWeight: '700',
              fontSize: '17px',
              color: 'white',
              boxShadow: '0 4px 16px rgba(232, 168, 136, 0.4)',
              marginTop: '8px',
              transition: 'all 0.2s'
            }}
          >
            {purchasing ? '⏳ Wird verarbeitet...' : `Jetzt kaufen • ${PRODUCTS[selectedProduct.toUpperCase().replace('_', '')]?.price || '7,99€'}`}
          </button>

          {/* Info */}
          <div style={{
            textAlign: 'center',
            marginTop: '16px',
            color: COLORS.textLight,
            fontSize: '12px',
            lineHeight: '1.6'
          }}>
            <p style={{ margin: '0 0 8px 0' }}>
              ✅ Einmaliger Kauf • Keine Abos • Kein Risiko
            </p>
            <p style={{ margin: 0 }}>
              🔒 Sicherer Checkout über Google Play
            </p>
          </div>

          {/* Restore Purchases */}
          <button
            onClick={async () => {
              const restored = await purchaseService.restorePurchases();
              if (restored.length > 0) {
                alert('✅ Käufe wiederhergestellt!');
                if (onPurchaseComplete) onPurchaseComplete();
                onClose();
              } else {
                alert('ℹ️ Keine früheren Käufe gefunden.');
              }
            }}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: COLORS.textLight,
              fontSize: '13px',
              marginTop: '12px',
              textDecoration: 'underline'
            }}
          >
            Käufe wiederherstellen
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPurchaseModal;
