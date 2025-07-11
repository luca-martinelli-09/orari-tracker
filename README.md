# Orari Tracker

Applicazione web per la gestione degli orari di lavoro e dei rimborsi spese con integrazione Trenitalia.

## Funzionalità

### Modulo Orari di Lavoro

- Calendario mensile per l'inserimento degli orari di lavoro
- Calcolo automatico delle ore lavorate
- Gestione giorni festivi con API italiana
- Supporto per ferie, malattie e permessi
- Caricamento allegati per permessi e malattie
- Generazione PDF report mensile

### Modulo Rimborsi Spese

- Sincronizzazione automatica viaggi Trenitalia
- Gestione manuale spese aggiuntive
- Caricamento allegati per le spese
- Generazione PDF report mensile
- Riepilogo spese per categoria

### Configurazione

- Impostazioni credenziali Trenitalia
- Orari di lavoro predefiniti
- Giorni festivi personalizzati

## Stack Tecnologico

- **Frontend**: Vue 3 + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **File Storage**: Minio (S3-compatible)
- **PDF Generation**: PDFKit
- **Containerizzazione**: Docker + Docker Compose

## Installazione

### Requisiti

- Node.js 18+
- Docker e Docker Compose
- MongoDB (se non utilizzato tramite Docker)

### Avvio con Docker

```bash
# Clona il repository
git clone <repository-url>
cd orari-tracker

# Avvia i servizi
docker-compose up -d

# L'applicazione sarà disponibile su http://localhost:5000
```

### Avvio in sviluppo

```bash
# Installa le dipendenze del server
npm install

# Installa le dipendenze del client
cd client
npm install
cd ..

# Avvia MongoDB e Minio (se non usando Docker)
docker-compose up -d mongodb minio

# Avvia l'applicazione in modalità sviluppo
npm run dev
```

## Configurazione

1. **Credenziali Trenitalia**: Accedi alla sezione "Impostazioni" e inserisci le tue credenziali Trenitalia per abilitare la sincronizzazione automatica dei viaggi.

2. **Orari Predefiniti**: Configura gli orari di lavoro standard nella sezione "Impostazioni".

3. **Giorni Festivi**: Aggiungi eventuali giorni festivi personalizzati oltre a quelli recuperati automaticamente dall'API.

## Utilizzo

### Gestione Orari di Lavoro

1. Seleziona mese e anno
2. Inserisci gli orari per ogni giorno lavorativo
3. Marca i giorni speciali (ferie, malattie, permessi)
4. Carica eventuali allegati per permessi e malattie
5. Genera il PDF mensile

### Gestione Rimborsi Spese

1. Configura le credenziali Trenitalia nelle impostazioni
2. Utilizza "Sincronizza Trenitalia" per importare i viaggi
3. Aggiungi manualmente altre spese
4. Carica gli allegati per ogni spesa
5. Genera il PDF mensile

## API Endpoints

### Orari di Lavoro

- `GET /api/work-hours` - Lista orari di lavoro
- `POST /api/work-hours` - Crea nuovo orario
- `PUT /api/work-hours/:id` - Aggiorna orario
- `DELETE /api/work-hours/:id` - Elimina orario
- `GET /api/work-hours/summary/:year/:month` - Riepilogo mensile

### Rimborsi Spese

- `GET /api/expenses` - Lista spese
- `POST /api/expenses` - Crea nuova spesa
- `PUT /api/expenses/:id` - Aggiorna spesa
- `DELETE /api/expenses/:id` - Elimina spesa
- `POST /api/expenses/sync-trenitalia` - Sincronizza con Trenitalia
- `GET /api/expenses/summary/:year/:month` - Riepilogo mensile

### PDF

- `GET /api/pdf/work-hours/:year/:month` - Genera PDF orari
- `GET /api/pdf/expenses/:year/:month` - Genera PDF spese

### File

- `POST /api/files/upload` - Carica file
- `GET /api/files/:id` - Scarica file
- `DELETE /api/files/:id` - Elimina file

### Impostazioni

- `GET /api/settings` - Ottieni impostazioni
- `PUT /api/settings` - Aggiorna impostazioni

### Giorni Festivi

- `GET /api/holidays/:year` - Lista giorni festivi per anno

## Struttura del Progetto

```
orari-tracker/
├── client/                 # Frontend Vue.js
│   ├── src/
│   │   ├── components/     # Componenti Vue
│   │   ├── views/          # Pagine principali
│   │   ├── router/         # Configurazione routing
│   │   └── services/       # Servizi API
├── models/                 # Modelli MongoDB
├── routes/                 # Route API Express
├── services/               # Servizi backend
├── uploads/                # File caricati
├── docker-compose.yml      # Configurazione Docker
├── Dockerfile             # Dockerfile per l'app
└── server.js              # Server Express principale
```

## Licenza

Questo progetto è distribuito sotto licenza MIT.
