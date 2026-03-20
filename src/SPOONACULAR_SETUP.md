# 🍳 Spoonacular API Setup Guide

## 1. API Key holen (KOSTENLOS!)

1. Gehe zu: https://spoonacular.com/food-api/console#Dashboard
2. Klicke auf **"Get Started"** oder **"Sign Up"**
3. Erstelle einen Account (Email + Passwort)
4. Bestätige deine Email
5. Kopiere deinen **API Key** aus dem Dashboard

**Free Tier:**
- ✅ 150 requests pro Tag
- ✅ Zugriff auf 360.000+ Rezepte
- ✅ Keine Kreditkarte nötig!

---

## 2. API Key in App einbinden

### Option A: .env Datei (empfohlen)

1. Erstelle eine `.env` Datei im Root-Verzeichnis:
```bash
cp .env.example .env
```

2. Füge deinen API Key ein:
```
REACT_APP_SPOONACULAR_API_KEY=dein_api_key_hier
```

3. Starte die App neu:
```bash
npm start
```

### Option B: Direkt im Code (nur für Tests!)

In `spoonacularService.js`:
```javascript
const SPOONACULAR_API_KEY = 'dein_api_key_hier';
```

⚠️ **WICHTIG:** Committe NIEMALS deinen API Key in Git!

---

## 3. Testen

Gehe zu **Ernährung** Tab und swipe durch Rezepte:
- Wenn API funktioniert → Echte Food-Fotos von Spoonacular
- Wenn API nicht verfügbar → Mock-Daten als Fallback

**API Call Counter:**
- Öffne Browser Console (F12)
- Jeder Load = ~1 API Call
- Free Tier = 150 Calls/Tag

---

## 4. API Features nutzen

### Phasen-spezifische Rezepte
```javascript
import { getPhaseRecipes } from './services/spoonacularService';

// Eisenreiche Rezepte für Menstruation
const recipes = await getPhaseRecipes('menstruation', 'breakfast', 10);
```

### Mit Filtern suchen
```javascript
import { searchRecipes } from './services/spoonacularService';

const recipes = await searchRecipes({
  diet: 'vegan',
  intolerances: ['gluten', 'dairy'],
  type: 'breakfast',
  number: 10
});
```

### Rezept-Details
```javascript
import { getRecipeDetails } from './services/spoonacularService';

const recipe = await getRecipeDetails(recipeId);
// Enthält: Zutaten, Nährwerte, Schritte
```

---

## 5. Ohne API nutzen (Mock-Daten)

Falls du keine API nutzen möchtest:

In `.env`:
```
REACT_APP_USE_MOCK_DATA=true
```

Die App zeigt dann die Mock-Daten mit Unsplash-Bildern.

---

## 6. API Limits & Best Practices

**Free Tier Limits:**
- 150 Requests/Tag
- 1 Request/Sekunde

**Wie wir Limits sparen:**
- ✅ Caching (gleiche Rezepte nicht nochmal laden)
- ✅ Lazy Loading (nur wenn User swipet)
- ✅ Batch Requests (10 Rezepte auf einmal)

**Tipp:** Ein normaler User macht ~20-30 Swipes/Tag = ca. 3 API Calls = 5% vom Limit! 🎉

---

## Troubleshooting

### "API Error: 401"
→ API Key ist ungültig oder fehlt. Check `.env` Datei!

### "API Error: 402"
→ API Limit erreicht (150/Tag). Warte bis morgen oder upgrade.

### "API Error: 404" 
→ Rezept nicht gefunden. Das ist normal, App nutzt Fallback.

### Keine Rezepte laden
→ Check Browser Console (F12) für Fehler
→ Prüfe Internetverbindung
→ App nutzt automatisch Mock-Daten als Fallback

---

## Support

- Spoonacular Docs: https://spoonacular.com/food-api/docs
- API Console: https://spoonacular.com/food-api/console#Dashboard
- Pricing: https://spoonacular.com/food-api/pricing

**Bei Problemen:** Öffne Browser Console (F12) und check die Fehler!
