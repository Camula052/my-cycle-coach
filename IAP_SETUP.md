# 💰 In-App Purchase Setup Guide

## Aktueller Status: MOCK (Testing)

Das System läuft derzeit mit **Mock-Käufen** für Testing. Für Production muss Google Play Billing integriert werden.

---

## 🎯 Premium Produkte

### **Einzelkäufe (Einmalig):**
- 🍎 **Nutrition Premium** → 4,99€
- 🏃 **Activity Premium** → 4,99€  
- 💎 **Complete Bundle** → 7,99€ (spart 20%)

### **Features:**
```javascript
// Aus premiumService.js
PRODUCTS = {
  NUTRITION: { id: 'nutrition_premium', price: '4,99€' },
  ACTIVITY: { id: 'activity_premium', price: '4,99€' },
  BUNDLE: { id: 'complete_bundle', price: '7,99€' }
}
```

---

## 🛠️ Für Production: Google Play Integration

### **1. Package installieren:**

```bash
npm install react-native-iap
```

### **2. Google Play Console Setup:**

1. Gehe zu **Google Play Console**
2. Wähle deine App
3. **Monetarisierung → In-App-Produkte**
4. Erstelle 3 Produkte:
   - `nutrition_premium` → Verwaltetes Produkt → 4,99€
   - `activity_premium` → Verwaltetes Produkt → 4,99€
   - `complete_bundle` → Verwaltetes Produkt → 7,99€

### **3. premiumService.js anpassen:**

Uncomment die `purchase()` Methode:

```javascript
// In premiumService.js

import * as RNIap from 'react-native-iap';

async purchase(productId) {
  try {
    // Initialize connection
    await RNIap.initConnection();
    
    // Get products
    const products = await RNIap.getProducts([
      'nutrition_premium',
      'activity_premium', 
      'complete_bundle'
    ]);
    
    // Request purchase
    const purchase = await RNIap.requestPurchase(productId, false);
    
    // Verify purchase (with backend)
    const verified = await this.verifyPurchase(purchase);
    
    if (verified) {
      if (productId === 'complete_bundle') {
        this.purchases.push('nutrition_premium');
        this.purchases.push('activity_premium');
      }
      this.purchases.push(productId);
      this.savePurchases();
      
      // Acknowledge purchase
      await RNIap.finishTransaction(purchase, true);
      
      return { success: true, productId };
    }
  } catch (error) {
    console.error('Purchase failed:', error);
    return { success: false, error };
  } finally {
    await RNIap.endConnection();
  }
}
```

### **4. Backend Verification (WICHTIG!):**

Erstelle ein Backend Endpoint:

```javascript
// Backend API
POST /api/verify-purchase
{
  "receipt": "...",
  "productId": "nutrition_premium",
  "userId": "..."
}

// Verify mit Google Play Developer API
// Return: { verified: true/false }
```

In `premiumService.js`:

```javascript
async verifyPurchase(purchase) {
  const response = await fetch('YOUR_BACKEND/api/verify-purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      receipt: purchase.transactionReceipt,
      productId: purchase.productId,
      userId: getCurrentUserId()
    })
  });
  
  const data = await response.json();
  return data.verified;
}
```

---

## 🧪 Testing (Aktuell)

### **Mock Purchase:**
```javascript
// Funktioniert jetzt out-of-the-box!
purchaseService.mockPurchase('nutrition_premium');
// → localStorage wird gesetzt
// → UI updated automatisch
```

### **Purchase testen:**
1. Klicke auf "Jetzt freischalten"
2. Wähle Produkt
3. Klicke "Jetzt kaufen"
4. ✅ Kauf wird simuliert (1 Sekunde)
5. Premium ist freigeschaltet!

### **Käufe zurücksetzen (Testing):**
```javascript
// Browser Console
purchaseService.clearPurchases();
location.reload();
```

---

## 📱 Google Play Testing

### **Test Accounts einrichten:**

1. **Google Play Console** → **Setup → Lizenztests**
2. Füge Test-Gmail-Accounts hinzu
3. Diese Accounts können **kostenlos** "kaufen"

### **Closed Testing Track:**
- Upload APK/AAB zur Internal/Closed Testing
- Lade Tester ein
- Teste echte Käufe (0€ für Tester!)

---

## 🔐 Security Best Practices

### **1. Receipt Verification:**
- ✅ IMMER Server-side verifizieren
- ❌ NIEMALS nur Client-side checken
- Nutze Google Play Developer API

### **2. Obfuscation:**
```gradle
// android/app/build.gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

### **3. Purchase Restore:**
```javascript
async restorePurchases() {
  await RNIap.initConnection();
  const purchases = await RNIap.getAvailablePurchases();
  
  for (const purchase of purchases) {
    if (purchase.productId === 'complete_bundle') {
      this.purchases.push('nutrition_premium');
      this.purchases.push('activity_premium');
    }
    this.purchases.push(purchase.productId);
  }
  
  this.savePurchases();
  await RNIap.endConnection();
}
```

---

## 📊 Analytics Integration

```javascript
// Track purchases
const handlePurchase = async (productId) => {
  const result = await purchaseService.purchase(productId);
  
  if (result.success) {
    // Google Analytics
    analytics.logEvent('purchase', {
      transaction_id: result.transactionId,
      value: PRODUCTS[productId].priceValue,
      currency: 'EUR',
      items: [{ item_id: productId, item_name: PRODUCTS[productId].name }]
    });
    
    // Facebook Pixel (optional)
    fbq('track', 'Purchase', {
      value: PRODUCTS[productId].priceValue,
      currency: 'EUR'
    });
  }
};
```

---

## 🚨 Troubleshooting

### Purchase failed: "Item already owned"
→ Nutze `consumePurchase()` für consumable Items (nicht nötig für managed products)

### Purchase failed: "Network error"
→ Check Google Play Services Installation
→ Test mit echtem Device (nicht Emulator)

### Purchase not showing
→ Warte bis zu 24h nach Produkt-Erstellung in Play Console
→ Check ob App signed mit Release Key

---

## ✅ Launch Checklist

- [ ] Google Play Console Produkte erstellt
- [ ] Backend Verification Endpoint implementiert
- [ ] Test Accounts getestet
- [ ] Closed Testing durchgeführt
- [ ] Analytics integriert
- [ ] Restore Purchases getestet
- [ ] Error Handling implementiert
- [ ] Datenschutzerklärung updated (IAP erwähnt)
- [ ] AGBs updated (Widerrufsrecht, Refunds)

---

## 💡 Tipps

- **Starte mit Closed Testing** vor Production
- **Nutze Test Accounts** für kostenlose Test-Käufe
- **Implementiere Analytics** von Tag 1
- **A/B teste Preise** (4,99€ vs 5,99€)
- **Bundle ist Key** - meistverkauftes Produkt!

Happy Selling! 💰🚀
