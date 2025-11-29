# Firebase Setup - Installationsguide

Följ dessa steg för att sätta upp Firebase för ditt Flipboard-projekt.

## Steg 1: Skapa ett Firebase-projekt

1. Gå till [Firebase Console](https://console.firebase.google.com/)
2. Klicka på "Add project" (Lägg till projekt)
3. Namnge ditt projekt (t.ex. "Flipboard System")
4. Följ instruktionerna och skapa projektet

## Steg 2: Aktivera Google Authentication

1. I Firebase Console, gå till **Authentication** i vänstermenyn
2. Klicka på "Get started"
3. Gå till fliken **Sign-in method**
4. Klicka på **Google** i listan över providers
5. Aktivera Google-inloggning genom att klicka på switchen
6. Välj ett support-email från dropdown-menyn
7. Klicka på **Save**

## Steg 3: Skapa en Web App

1. I Firebase Console, gå till **Project Settings** (kugghjulet uppe till vänster)
2. Scrolla ner till "Your apps"
3. Klicka på ikonen **</>** (Web)
4. Registrera din app med ett smeknamn (t.ex. "Flipboard Web")
5. Du behöver **inte** aktivera Firebase Hosting
6. Klicka på "Register app"

## Steg 4: Kopiera Firebase-konfigurationen

Du kommer nu att se en konfiguration som ser ut så här:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

**VIKTIGT:** Kopiera dessa värden!

## Steg 5: Uppdatera firebase-config.js

1. Öppna filen `firebase-config.js` i ditt projekt
2. Ersätt placeholder-värdena med dina egna värden från steg 4:

```javascript
const firebaseConfig = {
    apiKey: "DIN_API_KEY",              // Byt ut mot din apiKey
    authDomain: "DIN_PROJECT_ID.firebaseapp.com",  // Byt ut DIN_PROJECT_ID
    projectId: "DIN_PROJECT_ID",         // Byt ut mot din projectId
    storageBucket: "DIN_PROJECT_ID.appspot.com",   // Byt ut DIN_PROJECT_ID
    messagingSenderId: "DIN_SENDER_ID",  // Byt ut mot din messagingSenderId
    appId: "DIN_APP_ID"                  // Byt ut mot din appId
};
```

## Steg 6: Skapa Firestore Database

1. Gå tillbaka till Firebase Console
2. Klicka på **Firestore Database** i vänstermenyn
3. Klicka på "Create database"
4. Välj **Start in production mode** (vi sätter upp regler i nästa steg)
5. Välj en location (t.ex. "europe-west1" för Europa)
6. Klicka på "Enable"

## Steg 7: Konfigurera Firestore Security Rules

1. I Firestore Database, gå till fliken **Rules**
2. Ersätt reglerna med följande:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Användare kan endast läsa och skriva sina egna data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Användare kan läsa och skriva sina egna kort
      match /cards/{cardId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Klicka på **Publish**

## Steg 8: Testa din applikation

1. Öppna `index.html` i din webbläsare
2. Du borde se inloggningsskärmen
3. Klicka på "Logga in med Google"
4. Logga in med ditt Google-konto
5. Skapa några kort och testa funktionaliteten

## Felsökning

### Problem: "Firebase: Error (auth/unauthorized-domain)"

**Lösning:**
1. Gå till Firebase Console → Authentication → Settings → Authorized domains
2. Lägg till din domän (t.ex. `localhost` för lokal utveckling)

### Problem: "Missing or insufficient permissions"

**Lösning:**
1. Kontrollera att du har publicerat Firestore Security Rules (Steg 7)
2. Kontrollera att reglerna är korrekta

### Problem: Kort sparas inte

**Lösning:**
1. Öppna Developer Console (F12) och kolla efter felmeddelanden
2. Kontrollera att du är inloggad
3. Kontrollera att firebase-config.js har korrekta värden

## Datastruktur

Din data kommer att sparas i Firestore enligt följande struktur:

```
users (collection)
  └── {userId} (document)
      └── cards (collection)
          └── {cardId} (document)
              ├── activityName: string
              ├── description: string
              ├── day: string
              ├── status: "red" | "green"
              ├── createdAt: timestamp
              └── updatedAt: timestamp
```

## Säkerhet

- Dina Firebase-konfigurationsvärden är **inte hemliga** och kan inkluderas i din kod
- API-nyckeln är begränsad till din Firebase-projektkonfiguration
- Security Rules i Firestore säkerställer att användare endast kan läsa/skriva sin egen data
- Överväg att lägga till en `.gitignore` fil om du vill hålla konfigurationen privat ändå

## Nästa steg

- Använd din app och skapa aktiviteter!
- Testa att logga ut och in igen - dina kort ska finnas kvar
- Testa på olika enheter - dina kort synkroniseras automatiskt

Lycka till!
