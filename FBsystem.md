# Flipboard System - Projektdokumentation

## Projektöversikt

Ett visuellt aktivitets- och uppgiftshanteringssystem med flipboard-kort som låter användare planera och följa upp aktiviteter genom veckan. Varje aktivitet representeras av ett kort som kan växla mellan röd (ej utförd) och grön (utförd) status genom att klicka och flippa kortet.

## Nuvarande Funktionalitet

### Huvudfunktioner
- **7-dagars veckoöversikt**: En kolumn för varje veckodag (måndag-söndag)
- **Aktivitetskort**: Visuella kort med flipfunktion (röd = inte klar, grön = klar)
- **Sidebar-meny**: Lägg till nya aktiviteter med namn, beskrivning och välj dag(ar)
- **Modal popup**: Klicka på kort för att se detaljer och flippa status
- **Drag-and-drop**: Flytta kort mellan dagar
- **Återställ veckan**: Knapp för att sätta alla kort till röd status
- **Radera funktioner**: Ta bort enskilda kort eller alla kort

### Design
- **Dark mode**: Mörk tech-estetik med mjuka färger
- **Färgschema**:
  - Lila/Indigo gradienter för primära knappar (#7c3aed → #6366f1)
  - Emerald gradienter för "lägg till" (#10b981 → #059669)
  - Rose/Red gradienter för "radera" (#f43f5e → #dc2626)
  - Amber gradienter för "återställ" (#f59e0b → #d97706)
- **Typsnitt**: Google Font "Inter" för bättre läsbarhet
- **Bakgrund**: Mörkgrå (#0f1419) med subtila lila ljuseffekter

### Responsiv Design
- **Desktop (>1024px)**: Grid med alla 7 dagar synliga
- **Tablet (768-1024px)**: Grid med 4 kolumner
- **Mobil (<768px)**:
  - En dag i taget med horizontal scroll
  - Swipe-funktion (vänster/höger) mellan dagar
  - Navigation dots för snabb överblick och hopp mellan dagar
  - Touch-optimerad med större knappar och bättre spacing
  - Scroll-snap för exakt positionering

## Teknisk Stack (Nuvarande)

### Frontend
- **HTML5**: Semantisk struktur
- **CSS3**:
  - Moderna gradienter och effekter
  - Flexbox och CSS Grid
  - Media queries för responsivitet
  - Scroll-snap för mobil
  - Custom animations och transitions
- **Vanilla JavaScript**:
  - DOM-manipulation
  - Event handling (click, touch, drag)
  - Swipe-detection för mobil
  - Scroll tracking och navigation

### Datalagring (Nuvarande)
- **Local Storage**: All data lagras lokalt i webbläsaren
  - Fungerar offline
  - Ingen synk mellan enheter
  - Data försvinner om browsern rensas

## Filstruktur

```
FB System/
├── index.html          # Huvudstruktur
├── style.css           # All styling och responsivitet
├── script.js           # All funktionalitet och logik
└── FBsystem.md         # Denna fil
```

## Nästa Steg: Firebase Integration

### Varför Firebase?
Firebase valdes för att möjliggöra:
- **Cross-device synk**: Lägg till aktiviteter på datorn, bocka av på mobilen
- **Data persistence**: Data finns säkert i molnet, inte bara lokalt
- **Realtime updates**: Ändringar syns direkt på alla enheter
- **Enkel setup**: Ingen egen backend behövs
- **Gratis tier**: Passar perfekt för personal/liten användarbas
- **Offline support**: Fortsätter fungera offline och synkar när uppkoppling finns

### Planerad Implementation

#### 1. Firebase Setup
- Skapa Firebase-projekt på firebase.google.com
- Aktivera Firestore Database (för data)
- Aktivera Authentication (för användarhantering)
- Konfigurera säkerhetsregler

#### 2. Autentisering
- **Google Sign-In**: Enkel inloggning med Google-konto
- **Email/Password**: Alternativ inloggningsmetod
- Användarprofil med unikt userId

#### 3. Databasstruktur (Firestore)
```
users/
  {userId}/
    activities/
      {activityId}: {
        name: "Städa kontor",
        description: "Dammtorka och dammsuga",
        days: ["måndag", "tisdag"],
        status: {
          "2025-01-20": "green",
          "2025-01-21": "red"
        },
        createdAt: timestamp,
        updatedAt: timestamp
      }
```

#### 4. Funktioner att Uppdatera
- **Spara aktiviteter**: Skicka till Firestore istället för localStorage
- **Läsa aktiviteter**: Lyssna på realtime updates från Firestore
- **Uppdatera status**: Synka kort-flips till databasen
- **Radera aktiviteter**: Ta bort från Firestore
- **Veckoåterställning**: Uppdatera alla statuses i databasen

#### 5. Nya Features (Möjliga)
- **Historik**: Se tidigare veckors aktiviteter och completion rate
- **Statistik**: Visuell data över hur väl du följer din planering
- **Dela aktiviteter**: Möjlighet att dela vissa aktiviteter med andra användare
- **Notifikationer**: Påminnelser för aktiviteter (kräver mer arbete)
- **Recurring tasks**: Aktiviteter som automatiskt återkommer varje vecka

### Admin-kontroll (Firebase Console)
Som projektägare har du full kontroll:
- **Webgränssnitt**: firebase.google.com/console
- **Se all data**: Bläddra genom användare och deras aktiviteter
- **Radera användare**: Ta bort specifika användarkonton
- **Radera data**: Ta bort all data för en användare
- **Statistik**: Se användning, antal användare, storage, etc
- **Export/Import**: Backup och återställning av data
- **GDPR-compliant**: Inbyggda verktyg för dataskydd

### Säkerhet & Privacy
- **Security Rules**: Användare kan bara läsa/skriva sin egen data
- **Autentisering krävs**: Ingen åtkomst utan inloggning
- **Backups**: Automatiska point-in-time recovery
- **Enkelt att radera**: Användare kan radera sitt konto och all data

## Estimerad Implementationstid
- Firebase setup och konfiguration: ~30 minuter
- Autentisering (Google Sign-In): ~30 minuter
- Uppdatera CRUD-operationer: ~1-2 timmar
- Testa synk mellan enheter: ~30 minuter
- Security rules och säkerhet: ~30 minuter

**Total: 3-4 timmar arbete**

## Potential för Framtiden
- PWA (Progressive Web App) för att installera som app
- Push notifications
- Team/Family sharing
- Templates för vanliga aktiviteter
- Dark/Light mode toggle
- Olika teman och färgscheman
- Export till PDF/CSV
- Integration med kalender (Google Calendar, etc)

## Anteckningar
- All nuvarande funktionalitet behålls
- Design och UX förändras inte
- Endast backend/datalagring byts ut
- Offline-first approach: Fungerar utan internet, synkar när det finns
