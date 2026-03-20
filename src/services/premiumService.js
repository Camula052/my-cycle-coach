// Premium Purchase Service
// Für Production mit react-native-iap Package ersetzen

// Premium Products
export const PRODUCTS = {
  NUTRITION: {
    id: 'nutrition_premium',
    name: 'Nutrition Premium',
    description: 'Tausende Rezepte, AI Meal Plans & Favoriten',
    price: '4,99€',
    priceValue: 4.99,
    features: [
      'Tausende phasengerechte Rezepte',
      'Tinder-Style Rezept-Browser',
      'Favoriten speichern',
      '7-Tage AI Meal Plans',
      'Angepasst an deine Vorlieben',
      'Optimiert für deine Zyklusphase'
    ],
    icon: '🍳'
  },
  ACTIVITY: {
    id: 'activity_premium',
    name: 'Activity Premium',
    description: 'Workouts, Meditation & personalisierte Pläne',
    price: '4,99€',
    priceValue: 4.99,
    features: [
      '1000+ Workout-Übungen',
      'Geführte Meditationen',
      'Favoriten-System',
      '7-Tage Workout Plans mit AI',
      'Phasengerechtes Training',
      'Zuhause & Gym Programme'
    ],
    icon: '🏃‍♀️'
  },
  BUNDLE: {
    id: 'complete_bundle',
    name: 'Complete Bundle',
    description: 'Beide Premium Features zum Sparpreis',
    price: '7,99€',
    priceValue: 7.99,
    savings: '20% sparen!',
    includes: ['nutrition_premium', 'activity_premium'],
    features: [
      'Alle Nutrition Features',
      'Alle Activity Features',
      '20% günstiger als Einzelkauf',
      'Lebenslanger Zugriff'
    ],
    icon: '💎',
    recommended: true
  }
};

// Purchase State Management
class PremiumPurchaseService {
  constructor() {
    this.purchases = this.loadPurchases();
  }

  // Load purchases from localStorage
  loadPurchases() {
    const saved = localStorage.getItem('premiumPurchases');
    return saved ? JSON.parse(saved) : [];
  }

  // Save purchases to localStorage
  savePurchases() {
    localStorage.setItem('premiumPurchases', JSON.stringify(this.purchases));
  }

  // Check if user owns a product
  hasPurchased(productId) {
    return this.purchases.includes(productId);
  }

  // Check if nutrition is unlocked
  hasNutritionPremium() {
    return this.hasPurchased('nutrition_premium') || this.hasPurchased('complete_bundle');
  }

  // Check if activity is unlocked
  hasActivityPremium() {
    return this.hasPurchased('activity_premium') || this.hasPurchased('complete_bundle');
  }

  // Mock purchase (für Testing)
  async mockPurchase(productId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.purchases.includes(productId)) {
          // Bei Bundle-Kauf beide Features freischalten
          if (productId === 'complete_bundle') {
            this.purchases.push('nutrition_premium');
            this.purchases.push('activity_premium');
          }
          this.purchases.push(productId);
          this.savePurchases();
        }
        resolve({ success: true, productId });
      }, 1000);
    });
  }

  // Production: Real In-App Purchase
  // async purchase(productId) {
  //   try {
  //     // React Native IAP Integration
  //     const product = await RNIap.requestPurchase(productId);
  //     
  //     // Verify purchase with backend
  //     const verified = await this.verifyPurchase(product);
  //     
  //     if (verified) {
  //       if (productId === 'complete_bundle') {
  //         this.purchases.push('nutrition_premium');
  //         this.purchases.push('activity_premium');
  //       }
  //       this.purchases.push(productId);
  //       this.savePurchases();
  //       return { success: true, productId };
  //     }
  //   } catch (error) {
  //     console.error('Purchase failed:', error);
  //     return { success: false, error };
  //   }
  // }

  // Restore purchases (für Device-Wechsel)
  async restorePurchases() {
    // TODO: Mit App Store / Google Play synchronisieren
    return this.purchases;
  }

  // Clear purchases (nur für Testing!)
  clearPurchases() {
    this.purchases = [];
    this.savePurchases();
  }
}

// Singleton Instance
export const purchaseService = new PremiumPurchaseService();

// Backward compatibility - alte isPremium Checks
export const checkLegacyPremium = () => {
  const legacy = localStorage.getItem('isPremium') === 'true';
  if (legacy && !purchaseService.hasNutritionPremium()) {
    // Migriere alte Premium-User
    purchaseService.mockPurchase('nutrition_premium');
  }
};

export default purchaseService;
