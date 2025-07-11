## Analisi Funzionale del Progetto: Generazione PDF Orari e Rimborsi

**Obiettivo del Progetto:** Realizzare un'applicazione per generare report PDF degli orari di lavoro e dei rimborsi spese da inviare all'azienda.

**Stack Tecnologico (Full stack):**

- **Linguaggio di Programmazione:** JS
- **Framework Web:** Vue
- **Database:** MongoDB
- **Containerizzazione:** Docker + Docker Compose
- **Gestione pacchetti:** npm
- **Gestione file:** S3 (Upload Minio)
- **Grafica:** TailwindCSS

### Modulo Orari di Lavoro

Questo modulo permetterà la gestione e l'esportazione degli orari di lavoro mensili.

**Funzionalità Principali:**

1.  **Visualizzazione e Inserimento Orari:**
    - Sarà presente un'interfaccia utente che mostra un calendario mensile in formato colonnare.
    - Per ogni giorno, l'utente potrà inserire l'orario di inizio mattina, fine mattina, inizio pomeriggio e fine pomeriggio.
    - Gli orari predefiniti saranno 8:30, 13:00, 14:00, 17:30, con possibilità di modifica.
2.  **Calcolo Ore Lavorate:**
    - Calcolo automatico e visualizzazione del totale delle ore lavorate giornalmente.
    - Calcolo automatico e visualizzazione del totale delle ore lavorate mensilmente.
3.  **Gestione Giorni Speciali:**
    - Identificazione automatica e marcatura di sabati e domeniche.
    - Identificazione automatica dei giorni festivi (recuperati dall'API seguente, ma modificabili manualmente dall'utente).
    - Possibilità di indicare e gestire giorni di ferie, malattia e permessi retribuiti.
4.  **Sezione "Permessi e Malattie":**
    - Area dedicata per il caricamento e la gestione di allegati relativi a permessi e malattie (es. certificati medici, richieste di permesso).
    - I formati di file supportati includeranno PDF, immagini e documenti Word.
5.  **Esportazione PDF Orari:**
    - Funzionalità per generare un unico file PDF che includa sia la tabella degli orari di lavoro che tutti gli allegati caricati nella sezione "Permessi e Malattie".
    - Il formato del PDF dovrà rispettare il fac-simile fornito ("tabella_orari_25-06.xlsx").

### Modulo Rimborsi Spese

Questo modulo consentirà la gestione automatizzata e manuale delle spese e dei viaggi, con integrazione API e generazione PDF.

**Funzionalità Principali:**

1.  **Integrazione API Trenitalia:**
    - **Autenticazione:** Il sistema si autenticherà con le API di Trenitalia utilizzando username e password configurabili in una sezione "Impostazioni".
    - **Recupero Viaggi:** Sarà possibile recuperare automaticamente i dettagli e i PDF dei viaggi effettuati tramite Trenitalia nel mese selezionato. Questo implicherà l'utilizzo degli endpoint di Login, Elenco Viaggi e Download PDF della documentazione API fornita.
    - I viaggi recuperati saranno inseriti automaticamente nell'elenco dei rimborsi.
    - Sarà comunque possibile eliminare o modificare i dettagli dei viaggi inseriti automaticamente.
2.  **Gestione Viaggi e Spese Manuali:**
    - Possibilità di inserire e modificare manualmente altri viaggi e spese non legati a Trenitalia.
3.  **Allegati Spese:**
    - Funzionalità per allegare documenti giustificativi (immagini, PDF, documenti Word) per qualsiasi voce di spesa (automatica o manuale).
4.  **Esportazione PDF Rimborsi Spese:**
    - Funzionalità per generare un unico documento PDF che contenga la tabella riepilogativa dei rimborsi spese (con un totale complessivo).
    - Il PDF includerà anche tutti i documenti allegati per le varie spese.
    - Il formato del PDF dovrà rispettare il fac-simile fornito ("rimborso_25-06.xlsx").

### Documentazione API Calendario Festività - Esempi di chiamate

**Lista annuale**

```bash
curl -XGET https://date.nager.at/api/v3/PublicHolidays/2025/IT
```

```json
[
  {
    "date": "2025-01-01",
    "localName": "Capodanno",
    "name": "New Year's Day",
    "countryCode": "IT",
    "fixed": false,
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": ["Public"]
  },
  {
    "date": "2025-01-06",
    "localName": "Epifania",
    "name": "Epiphany",
    "countryCode": "IT",
    "fixed": false,
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": ["Public"]
  },
  {
    "date": "2025-04-20",
    "localName": "Pasqua",
    "name": "Easter Sunday",
    "countryCode": "IT",
    "fixed": false,
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": ["Public"]
  },
  {
    "date": "2025-04-21",
    "localName": "Lunedì dell'Angelo",
    "name": "Easter Monday",
    "countryCode": "IT",
    "fixed": false,
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": ["Public"]
  },
  {
    "date": "2025-04-25",
    "localName": "Festa della Liberazione",
    "name": "Liberation Day",
    "countryCode": "IT",
    "fixed": false,
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": ["Public"]
  },
  {
    "date": "2025-05-01",
    "localName": "Festa del Lavoro",
    "name": "International Workers Day",
    "countryCode": "IT",
    "fixed": false,
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": ["Public"]
  },
  {
    "date": "2025-06-02",
    "localName": "Festa della Repubblica",
    "name": "Republic Day",
    "countryCode": "IT",
    "fixed": false,
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": ["Public"]
  },
  {
    "date": "2025-08-15",
    "localName": "Ferragosto o Assunzione",
    "name": "Assumption Day",
    "countryCode": "IT",
    "fixed": false,
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": ["Public"]
  },
  {
    "date": "2025-11-01",
    "localName": "Tutti i santi",
    "name": "All Saints Day",
    "countryCode": "IT",
    "fixed": false,
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": ["Public"]
  },
  {
    "date": "2025-12-08",
    "localName": "Immacolata Concezione",
    "name": "Immaculate Conception",
    "countryCode": "IT",
    "fixed": false,
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": ["Public"]
  },
  {
    "date": "2025-12-25",
    "localName": "Natale",
    "name": "Christmas Day",
    "countryCode": "IT",
    "fixed": false,
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": ["Public"]
  },
  {
    "date": "2025-12-26",
    "localName": "Santo Stefano",
    "name": "St. Stephen's Day",
    "countryCode": "IT",
    "fixed": false,
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": ["Public"]
  }
]
```

### Documentazione API Trenitalia - Esempi di chiamate

**Autenticazione:**

```bash
curl -XPOST -H 'Content-Type: application/json' -d '{"userName":"username","password":"password"}' 'https://www.lefrecce.it/PicoAuth/api/auth/login'
```

```json
{
  "access_token": "eyJraWQiOiJUWW50TXlXTndtM2c3Z2FqYzMyaFhHSWUtdFo1TmF0eWtDRlJsMVpDQ19zIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJ0b2tlbl90eXBlIjoiQmVhcmVyIiwic3ViIjoibWFydGluZWxsaWx1Y2E5OCIsImxhc3ROYW1lIjoiTWFydGluZWxsaSIsImNvbXBhbnlOYW1lIjoiUElDTyBCMkMiLCJncm91cHMiOlsiY249V0VCVVNFUixvdT1Hcm91cHMsbz10cmVuaXRhbGlhLGM9aXQiXSwidXNlcklkIjoibWFydGluZWxsaWx1Y2E5OCIsImlkZW50aXR5UHJvdmlkZXIiOiJQSUNPLlRSRU5JVEFMSUEuSVQiLCJmaXJzdE5hbWUiOiJMdWNhIiwidXBuIjoidWlkPW1hcnRpbmVsbGlsdWNhOTgsb3U9UGVvcGxlLE89VFJFTklUQUxJQSxDPUlUIiwiZ3JvdXBOYW1lIjoiTHVjYSBNYXJ0aW5lbGxpIiwic2NvcGUiOlsiYXBpIl0sImVtYWlsIjoibWFydGluZWxsaWx1Y2E5OEBnbWFpbC5jb20iLCJ0aW1lc3RhbXAiOiIxNzUyMjMzMTUzNDY4IiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eVByb3ZpZGVyUGljby9vaWRjL2VuZHBvaW50L09QIiwiZXhwIjoxNzUyMjM5MTUzLCJpYXQiOjE3NTIyMzMxNTN9.Mj2Typ3N0_-aYYKwaOIhz2sLwA96VWfsTiFpI7limGHv4zBqV5kYpSjWB8VfvPvGj34lBaQXYTEbr9gH8pYJHAPJpoRnk94wxMZE2fzzDHKyr_9dDBvSHYCF6Jr91VMCcSipsv0NMTGeq9TGMuF7MyN06eFzapNGCC-qgnaJ65YpjGoZ-EUGyPU26JnZChQikT01InIqnIoQk7pV4K-XxEr9rgKF9QEiYkqy0C3zQeLaZCasdDnIfWo1XdBXmjerhYMcJQ-vKibPnP084jdTNqnsq_ncvA052zi9TCzAVsdO9bDRXtYYeQwtz0MHAklMePGIxS1gGYYyJ1C1_MKlPQ",
  "username": "martinelliluca98",
  "token_type": "Bearer",
  "expires_in": 7200,
  "scope": "api",
  "refresh_token": "nBxZZQxU19oR5SPfRzlaxFVr6z6Y49DQT2k02R9dzKmeorReI4"
}
```

**Elenco viaggi:**

```bash
curl -XGET -H 'Authorization: Bearer eyJraWQiOiJUWW50TXlXTndtM2c3Z2FqYzMyaFhHSWUtdFo1TmF0eWtDRlJsMVpDQ19zIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJ0b2tlbl90eXBlIjoiQmVhcmVyIiwic3ViIjoibWFydGluZWxsaWx1Y2E5OCIsImxhc3ROYW1lIjoiTWFydGluZWxsaSIsImNvbXBhbnlOYW1lIjoiUElDTyBCMkMiLCJncm91cHMiOlsiY249V0VCVVNFUixvdT1Hcm91cHMsbz10cmVuaXRhbGlhLGM9aXQiXSwidXNlcklkIjoibWFydGluZWxsaWx1Y2E5OCIsImlkZW50aXR5UHJvdmlkZXIiOiJQSUNPLlRSRU5JVEFMSUEuSVQiLCJmaXJzdE5hbWUiOiJMdWNhIiwidXBuIjoidWlkPW1hcnRpbmVsbGlsdWNhOTgsb3U9UGVvcGxlLE89VFJFTklUQUxJQSxDPUlUIiwiZ3JvdXBOYW1lIjoiTHVjYSBNYXJ0aW5lbGxpIiwic2NvcGUiOlsiYXBpIl0sImVtYWlsIjoibWFydGluZWxsaWx1Y2E5OEBnbWFpbC5jb20iLCJ0aW1lc3RhbXAiOiIxNzUyMjMzMTUzNDY4IiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eVByb3ZpZGVyUGljby9vaWRjL2VuZHBvaW50L09QIiwiZXhwIjoxNzUyMjM5MTUzLCJpYXQiOjE3NTIyMzMxNTN9.Mj2Typ3N0_-aYYKwaOIhz2sLwA96VWfsTiFpI7limGHv4zBqV5kYpSjWB8VfvPvGj34lBaQXYTEbr9gH8pYJHAPJpoRnk94wxMZE2fzzDHKyr_9dDBvSHYCF6Jr91VMCcSipsv0NMTGeq9TGMuF7MyN06eFzapNGCC-qgnaJ65YpjGoZ-EUGyPU26JnZChQikT01InIqnIoQk7pV4K-XxEr9rgKF9QEiYkqy0C3zQeLaZCasdDnIfWo1XdBXmjerhYMcJQ-vKibPnP084jdTNqnsq_ncvA052zi9TCzAVsdO9bDRXtYYeQwtz0MHAklMePGIxS1gGYYyJ1C1_MKlPQ' -H "Content-type: application/json" -d '{"travelGroup":"TICKET","searchType":"DEPARTURE_DATE","fromDate":"01/06/2025","toDate":"30/06/2035","code":"","limit":100,"offset":0}' 'https://www.lefrecce.it/Channels.Website.BFF.WEB/website/travel/solutions'
```

```json
{
  "solutions": [
    {
      "typeDescription": "Ticket",
      "description": "Verona Porta Nuova (06:05) - Bologna Centrale (07:39)",
      "resourceId": "w4xdw4h2p-w6z7p4m6k-e7f54785w4e7f54785_E652F242E62FF4B4830805D22A0621DF",
      "departureDate": "2025-06-04T06:05:00.000+02:00",
      "arrivalDate": "2025-06-04T07:39:00.000+02:00",
      "creationDate": "2025-06-04T05:41:47.424+02:00",
      "channel": "APP TRENITALIA",
      "expirationDate": null,
      "pnr": null,
      "travelName": "Il mio viaggio 04/06/2025 05:41",
      "addToCalendar": true,
      "downloadPdf": true,
      "saveable": true,
      "closed": false,
      "hidden": false,
      "statusDescription": null,
      "date": "2025-06-04T00:00:00.000+02:00"
    },
    {
      "typeDescription": "Ticket",
      "description": "Bologna Centrale (19:10) - Verona Porta Nuova (20:48)",
      "resourceId": "w4xdw4p2z-p6w7a4k6p-e7f54785w4e7f54785_BF7B0F8A661F5A147B411AD0DA80E04F",
      "departureDate": "2025-06-04T19:10:00.000+02:00",
      "arrivalDate": "2025-06-04T20:48:00.000+02:00",
      "creationDate": "2025-06-04T18:56:45.066+02:00",
      "channel": "APP TRENITALIA",
      "expirationDate": null,
      "pnr": null,
      "travelName": "Il mio viaggio 04/06/2025 18:56",
      "addToCalendar": true,
      "downloadPdf": true,
      "saveable": true,
      "closed": false,
      "hidden": false,
      "statusDescription": null,
      "date": "2025-06-04T00:00:00.000+02:00"
    },
    {
      "typeDescription": "Ticket",
      "description": "Bologna Centrale (19:16) - Verona Porta Nuova (20:08)",
      "resourceId": "w4xdw4p2z-a6a7b4h6w-e7f54785w4e7f54785_01250F69AF6107A38D7FFE31639FA9B5",
      "departureDate": "2025-06-04T19:16:00.000+02:00",
      "arrivalDate": "2025-06-04T20:08:00.000+02:00",
      "creationDate": "2025-06-04T18:13:38.753+02:00",
      "channel": "APP TRENITALIA",
      "expirationDate": null,
      "pnr": "U4U6P5",
      "travelName": "Il mio viaggio 04/06/2025 18:13",
      "addToCalendar": false,
      "downloadPdf": false,
      "saveable": false,
      "closed": true,
      "hidden": false,
      "statusDescription": "Changed or refunded",
      "date": "2025-06-04T00:00:00.000+02:00"
    },
    {
      "typeDescription": "Ticket",
      "description": "Verona Porta Nuova (06:05) - Bologna Centrale (07:39)",
      "resourceId": "w4xda4w2k-w6f7x4k6h-e7f54785w4e7f54785_24F49A99C3EB8FF60704148BC30E413A",
      "departureDate": "2025-06-16T06:05:00.000+02:00",
      "arrivalDate": "2025-06-16T07:39:00.000+02:00",
      "creationDate": "2025-06-16T05:46:56.701+02:00",
      "channel": "APP TRENITALIA",
      "expirationDate": null,
      "pnr": null,
      "travelName": "Il mio viaggio 16/06/2025 05:46",
      "addToCalendar": true,
      "downloadPdf": true,
      "saveable": true,
      "closed": false,
      "hidden": false,
      "statusDescription": null,
      "date": "2025-06-16T00:00:00.000+02:00"
    },
    {
      "typeDescription": "Ticket",
      "description": "Bologna Centrale (18:10) - Verona Porta Nuova (19:35)",
      "resourceId": "w4xda4a2f-k6b7x4k6f-e7f54785w4e7f54785_056CD045DDDAE755B31764FD88C5BA5E",
      "departureDate": "2025-06-16T18:10:00.000+02:00",
      "arrivalDate": "2025-06-16T19:35:00.000+02:00",
      "creationDate": "2025-06-16T17:50:17.542+02:00",
      "channel": "APP TRENITALIA",
      "expirationDate": null,
      "pnr": null,
      "travelName": "Il mio viaggio 16/06/2025 17:50",
      "addToCalendar": true,
      "downloadPdf": true,
      "saveable": true,
      "closed": false,
      "hidden": false,
      "statusDescription": null,
      "date": "2025-06-16T00:00:00.000+02:00"
    },
    {
      "typeDescription": "Ticket",
      "description": "Verona Porta Nuova (06:05) - Bologna Centrale (07:39)",
      "resourceId": "w4xda4f2m-a6b7f4w6b-e7f54785w4e7f54785_5A2CB890CA3AE3774B91E95C4ED3D297",
      "departureDate": "2025-06-19T06:05:00.000+02:00",
      "arrivalDate": "2025-06-19T07:39:00.000+02:00",
      "creationDate": "2025-06-19T05:33:13.316+02:00",
      "channel": "APP TRENITALIA",
      "expirationDate": null,
      "pnr": null,
      "travelName": "Il mio viaggio 19/06/2025 05:33",
      "addToCalendar": true,
      "downloadPdf": true,
      "saveable": true,
      "closed": false,
      "hidden": false,
      "statusDescription": null,
      "date": "2025-06-19T00:00:00.000+02:00"
    },
    {
      "typeDescription": "Ticket",
      "description": "Bologna Centrale (16:10) - Verona Porta Nuova (17:35)",
      "resourceId": "w4xda4h2w-m6k7a4k6k-e7f54785w4e7f54785_BB1908B3DE5228947C1FB16B0F71DBF1",
      "departureDate": "2025-06-19T16:10:00.000+02:00",
      "arrivalDate": "2025-06-19T17:35:00.000+02:00",
      "creationDate": "2025-06-19T15:37:19.923+02:00",
      "channel": "APP TRENITALIA",
      "expirationDate": null,
      "pnr": null,
      "travelName": "Il mio viaggio 19/06/2025 15:37",
      "addToCalendar": true,
      "downloadPdf": true,
      "saveable": true,
      "closed": false,
      "hidden": false,
      "statusDescription": null,
      "date": "2025-06-19T00:00:00.000+02:00"
    }
  ],
  "favourites": []
}
```

**Dettagli biglietto:**

```bash
curl -XGET -H 'Auhtorization: Bearer eyJraWQiOiJUWW50TXlXTndtM2c3Z2FqYzMyaFhHSWUtdFo1TmF0eWtDRlJsMVpDQ19zIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJ0b2tlbl90eXBlIjoiQmVhcmVyIiwic3ViIjoibWFydGluZWxsaWx1Y2E5OCIsImxhc3ROYW1lIjoiTWFydGluZWxsaSIsImNvbXBhbnlOYW1lIjoiUElDTyBCMkMiLCJncm91cHMiOlsiY249V0VCVVNFUixvdT1Hcm91cHMsbz10cmVuaXRhbGlhLGM9aXQiXSwidXNlcklkIjoibWFydGluZWxsaWx1Y2E5OCIsImlkZW50aXR5UHJvdmlkZXIiOiJQSUNPLlRSRU5JVEFMSUEuSVQiLCJmaXJzdE5hbWUiOiJMdWNhIiwidXBuIjoidWlkPW1hcnRpbmVsbGlsdWNhOTgsb3U9UGVvcGxlLE89VFJFTklUQUxJQSxDPUlUIiwiZ3JvdXBOYW1lIjoiTHVjYSBNYXJ0aW5lbGxpIiwic2NvcGUiOlsiYXBpIl0sImVtYWlsIjoibWFydGluZWxsaWx1Y2E5OEBnbWFpbC5jb20iLCJ0aW1lc3RhbXAiOiIxNzUyMjMzMTUzNDY4IiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eVByb3ZpZGVyUGljby9vaWRjL2VuZHBvaW50L09QIiwiZXhwIjoxNzUyMjM5MTUzLCJpYXQiOjE3NTIyMzMxNTN9.Mj2Typ3N0_-aYYKwaOIhz2sLwA96VWfsTiFpI7limGHv4zBqV5kYpSjWB8VfvPvGj34lBaQXYTEbr9gH8pYJHAPJpoRnk94wxMZE2fzzDHKyr_9dDBvSHYCF6Jr91VMCcSipsv0NMTGeq9TGMuF7MyN06eFzapNGCC-qgnaJ65YpjGoZ-EUGyPU26JnZChQikT01InIqnIoQk7pV4K-XxEr9rgKF9QEiYkqy0C3zQeLaZCasdDnIfWo1XdBXmjerhYMcJQ-vKibPnP084jdTNqnsq_ncvA052zi9TCzAVsdO9bDRXtYYeQwtz0MHAklMePGIxS1gGYYyJ1C1_MKlPQ' -H "Content-type: application/json" 'https://www.lefrecce.it/Channels.Website.BFF.WEB/website/travel/reopen?resourceId=w4xdw4h2p-w6z7p4m6k-e7f54785w4e7f54785_E652F242E62FF4B4830805D22A0621DF'
```

```json
{
  "solutions": [
    {
      "resourceId": "w4xdw4h2p-w6z7p4m6k-e7f54785w4e7f54785_E652F242E62FF4B4830805D22A0621DF",
      "solutionContainer": {
        "_type": "TICKET",
        "id": "xe1d12f7d-b8f5-46cc-a876-d6cdc9529d76",
        "resourceId": "w4xdw4h2p-w6z7p4m6k-e7f54785w4e7f54785_E652F242E62FF4B4830805D22A0621DF",
        "solutionSummary": {
          "id": "xe1d12f7d-b8f5-46cc-a876-d6cdc9529d76",
          "originId": 830002430,
          "origin": "Verona Porta Nuova",
          "destinationId": 830005043,
          "destination": "Bologna Centrale",
          "departureTime": "2025-06-04T06:05:00.000+02:00",
          "arrivalTime": "2025-06-04T07:39:00.000+02:00",
          "adults": 1,
          "children": 0,
          "totalPrice": {
            "currency": "€",
            "amount": 10.5,
            "originalAmount": null,
            "indicative": false
          },
          "description": null,
          "ancillaryCovidFree": null,
          "contrattoTrasporto": null,
          "co2Emission": {
            "summaryTitle": "<b> -9.41 kg</b> compared to travel by car",
            "summaryDescription": "amount based on a single passenger",
            "vehicleDetails": [
              {
                "type": "TRAIN",
                "kgEmissions": 5.55
              },
              {
                "type": "CAR",
                "kgEmissions": 14.96
              }
            ]
          },
          "roundTrip": false
        },
        "nodeSummaries": [
          {
            "nodeView": {
              "id": "x004b2442-0913-4f8f-bca4-1fb5b4b15ca8",
              "origin": "Verona Porta Nuova",
              "bdoOrigin": null,
              "destination": "Bologna Centrale",
              "departureTime": "2025-06-04T06:05:00.000+02:00",
              "arrivalTime": "2025-06-04T07:39:00.000+02:00",
              "salable": false,
              "train": {
                "description": "16027",
                "trainCategory": "Regionale",
                "acronym": "RE",
                "denomination": "Regional ",
                "name": "16027",
                "logoId": "RE",
                "urban": false
              }
            },
            "pnr": null,
            "cp": null,
            "travelId": 1614510589,
            "price": {
              "currency": "€",
              "amount": 10.5,
              "originalAmount": null,
              "indicative": false
            },
            "offerContainerSummaryViews": [
              {
                "adults": true,
                "serviceName": "2ª CLASSE",
                "offerName": "ORDINARIA",
                "regional": true,
                "offerSummaryViews": [
                  {
                    "resourceId": "w4xdw4h2p-w6z7p4m6k-e7f54785w4e7f54785w4e7f54785_683D2DD0820B75A41CCA7B554CB1CB37",
                    "traveller": {
                      "id": "x4546bcc1-eb03-4487-a856-34ddd6101229",
                      "firstName": "LUCA",
                      "lastName": "MARTINELLI",
                      "loyaltyCode": "165482137",
                      "customerKey": "119330409",
                      "parameters": [
                        {
                          "typeId": 10,
                          "name": "Name",
                          "displayName": "Name",
                          "value": "LUCA",
                          "allowedValues": [],
                          "required": false,
                          "readOnly": true,
                          "visible": false,
                          "validationPattern": "[\\u0370-\\u03ff\\u1f00-\\u1fffA-Za-z0-9 'àéèìòùäëïöüçÀÄÈËÌÏÒÖÙÜ_-]{1,}",
                          "inputPattern": "[\\u0370-\\u03ff\\u1f00-\\u1fffA-Za-z 'àéèìòùäëïöüçÀÄÈËÌÏÒÖÙÜ-]",
                          "minLength": 1,
                          "maxLength": 254,
                          "maxValue": null,
                          "minValue": null,
                          "type": "TRAVELLER",
                          "flowType": "UNDEFINED",
                          "identity": "STRING",
                          "errorMessage": null,
                          "info": null,
                          "valid": true
                        },
                        {
                          "typeId": 11,
                          "name": "Surname",
                          "displayName": "Surname",
                          "value": "MARTINELLI",
                          "allowedValues": [],
                          "required": false,
                          "readOnly": true,
                          "visible": false,
                          "validationPattern": "[\\u0370-\\u03ff\\u1f00-\\u1fffA-Za-z0-9 'àéèìòùäëïöüçÀÄÈËÌÏÒÖÙÜ_-]{1,}",
                          "inputPattern": "[\\u0370-\\u03ff\\u1f00-\\u1fffA-Za-z 'àéèìòùäëïöüçÀÄÈËÌÏÒÖÙÜ-]",
                          "minLength": 1,
                          "maxLength": 254,
                          "maxValue": null,
                          "minValue": null,
                          "type": "TRAVELLER",
                          "flowType": "UNDEFINED",
                          "identity": "STRING",
                          "errorMessage": null,
                          "info": null,
                          "valid": true
                        },
                        {
                          "typeId": 12,
                          "name": "Date of birth",
                          "displayName": "Date of birth",
                          "value": "24/09/1998",
                          "allowedValues": [],
                          "required": false,
                          "readOnly": true,
                          "visible": false,
                          "validationPattern": "[0-9]{2}[-/][0-9]{2}[-/][0-9]{4,4}",
                          "inputPattern": "[0-9]{2}[-/][0-9]{2}[-/][0-9]",
                          "minLength": 0,
                          "maxLength": 10,
                          "maxValue": null,
                          "minValue": null,
                          "type": "TRAVELLER",
                          "flowType": "UNDEFINED",
                          "identity": "DATE",
                          "errorMessage": null,
                          "info": null,
                          "valid": true
                        },
                        {
                          "typeId": 13,
                          "name": "Loyalty code",
                          "displayName": "Carta<i>FRECCIA</i>/X-GO",
                          "value": "165482137",
                          "allowedValues": [],
                          "required": false,
                          "readOnly": true,
                          "visible": false,
                          "validationPattern": "[0-9]{9,9}",
                          "inputPattern": "[0-9]",
                          "minLength": 9,
                          "maxLength": 9,
                          "maxValue": null,
                          "minValue": null,
                          "type": "TRAVELLER",
                          "flowType": "UNDEFINED",
                          "identity": "INT",
                          "errorMessage": null,
                          "info": null,
                          "valid": true
                        },
                        {
                          "typeId": 14,
                          "name": "Loyalty type",
                          "displayName": "Loyalty type",
                          "value": "CARTAFRECCIA_BASE",
                          "allowedValues": [
                            {
                              "key": "CARTAVIAGGIO_BASE",
                              "value": "CARTAVIAGGIO_BASE"
                            },
                            {
                              "key": "CARTAVIAGGIO_SMART",
                              "value": "CARTAVIAGGIO_SMART"
                            },
                            {
                              "key": "CARTAVIAGGIO_RELAX",
                              "value": "CARTAVIAGGIO_RELAX"
                            },
                            {
                              "key": "CARTAVIAGGIO_EXECUTIVE",
                              "value": "CARTAVIAGGIO_EXECUTIVE"
                            },
                            {
                              "key": "CARTAFRECCIA_BASE",
                              "value": "CARTAFRECCIA_BASE"
                            },
                            {
                              "key": "CARTAFRECCIA_ORO_PLATINO",
                              "value": "CARTAFRECCIA_ORO_PLATINO"
                            },
                            {
                              "key": "CARTAFRECCIA_PLATINO",
                              "value": "CARTAFRECCIA_PLATINO"
                            },
                            {
                              "key": "CF ORO CORTESIA",
                              "value": "CF ORO CORTESIA"
                            },
                            {
                              "key": "CF PLATINO CORTESIA",
                              "value": "CF PLATINO CORTESIA"
                            },
                            {
                              "key": "NOLOYALTY",
                              "value": "NOLOYALTY"
                            },
                            {
                              "key": "CARTAFRECCIA_ARGENTO",
                              "value": "CARTAFRECCIA_ARGENTO"
                            },
                            {
                              "key": "CARTAFRECCIA_DIAMANTE",
                              "value": "CARTAFRECCIA_DIAMANTE"
                            }
                          ],
                          "required": false,
                          "readOnly": true,
                          "visible": false,
                          "validationPattern": null,
                          "inputPattern": null,
                          "minLength": null,
                          "maxLength": null,
                          "maxValue": null,
                          "minValue": null,
                          "type": "TRAVELLER",
                          "flowType": "UNDEFINED",
                          "identity": "SELECTION",
                          "errorMessage": null,
                          "info": null,
                          "valid": true
                        },
                        {
                          "typeId": 15,
                          "name": "Traveller type",
                          "displayName": "Traveller type",
                          "value": "ADULTO",
                          "allowedValues": [
                            {
                              "key": "ADULTO",
                              "value": "ADULTO"
                            },
                            {
                              "key": "RAGAZZO",
                              "value": "RAGAZZO"
                            }
                          ],
                          "required": false,
                          "readOnly": true,
                          "visible": false,
                          "validationPattern": null,
                          "inputPattern": null,
                          "minLength": null,
                          "maxLength": null,
                          "maxValue": null,
                          "minValue": null,
                          "type": "TRAVELLER",
                          "flowType": "UNDEFINED",
                          "identity": "SELECTION",
                          "errorMessage": null,
                          "info": null,
                          "valid": true
                        },
                        {
                          "typeId": 17,
                          "name": "Contact number",
                          "displayName": "Contact number",
                          "value": "3404700123",
                          "allowedValues": [],
                          "required": false,
                          "readOnly": true,
                          "visible": false,
                          "validationPattern": "^(?:[+]?[0-9]{1,4}[\\ \\.\\-]?)?[0-9]{2,4}[\\/\\-\\.\\ ]?[0-9]{1,10}$",
                          "inputPattern": null,
                          "minLength": null,
                          "maxLength": null,
                          "maxValue": null,
                          "minValue": null,
                          "type": "TRAVELLER",
                          "flowType": "UNDEFINED",
                          "identity": "STRING",
                          "errorMessage": null,
                          "info": null,
                          "valid": true
                        },
                        {
                          "typeId": 20,
                          "name": "Email",
                          "displayName": "Email",
                          "value": "MARTINELLILUCA98@GMAIL.COM",
                          "allowedValues": [],
                          "required": false,
                          "readOnly": true,
                          "visible": false,
                          "validationPattern": "[_A-Za-z0-9-+]+(\\.[_A-Za-z0-9-+]+)*@[A-Za-z0-9]+([\\. \\-\\_][A-Za-z0-9]+)*(\\.[A-Za-z]{2,})",
                          "inputPattern": null,
                          "minLength": null,
                          "maxLength": null,
                          "maxValue": null,
                          "minValue": null,
                          "type": "TRAVELLER",
                          "flowType": "UNDEFINED",
                          "identity": "STRING",
                          "errorMessage": null,
                          "info": null,
                          "valid": true
                        },
                        {
                          "typeId": 136,
                          "name": "Regional loyalty type",
                          "displayName": "Regional loyalty type",
                          "value": "GREEN_FRIEND",
                          "allowedValues": [
                            {
                              "key": "GREEN_FRIEND",
                              "value": "GREEN_FRIEND"
                            },
                            {
                              "key": "GREEN_FAN",
                              "value": "GREEN_FAN"
                            },
                            {
                              "key": "GREEN_SUPPORTER",
                              "value": "GREEN_SUPPORTER"
                            },
                            {
                              "key": "GREEN_DEFENDER",
                              "value": "GREEN_DEFENDER"
                            },
                            {
                              "key": "GREEN_AMBASSADOR",
                              "value": "GREEN_AMBASSADOR"
                            },
                            {
                              "key": "GREEN_CHAMPION",
                              "value": "GREEN_CHAMPION"
                            }
                          ],
                          "required": false,
                          "readOnly": true,
                          "visible": false,
                          "validationPattern": null,
                          "inputPattern": null,
                          "minLength": null,
                          "maxLength": null,
                          "maxValue": null,
                          "minValue": null,
                          "type": "TRAVELLER",
                          "flowType": "UNDEFINED",
                          "identity": "SELECTION",
                          "errorMessage": null,
                          "info": null,
                          "valid": true
                        }
                      ],
                      "loyaltyPoints": 0,
                      "regionalLoyaltyPoints": 0,
                      "decimalRegionalLoyaltyPoints": 0,
                      "showCFBalanceLink": false,
                      "showREGBalanceLink": false,
                      "title": null,
                      "tags": [],
                      "adult": true,
                      "loyaltyGiftCardBeneficiary": null
                    },
                    "serviceId": 201,
                    "serviceName": "2ª CLASSE",
                    "serviceDescription": "",
                    "offerId": 69,
                    "offerName": "ORDINARIA",
                    "cpCode": null,
                    "idTravel": 1614510589,
                    "entitlementId": 2531461950,
                    "seatNotAssigned": false,
                    "price": {
                      "currency": "€",
                      "amount": 10.5,
                      "originalAmount": null,
                      "indicative": false
                    },
                    "appliedPromo": null,
                    "selfCheckIn": "NOT_ALLOWED",
                    "selfCheckInLayout": "EXPIRED",
                    "forcedSelected": false,
                    "cashback": {
                      "info": null,
                      "applied": null
                    },
                    "id": "x3d928f6a-0194-45f3-8774-e647844f4ae3",
                    "bdrTicket": true,
                    "bdrTicketToBeValidate": false,
                    "bdrTicketArrived": true,
                    "bdrTicketExpired": true,
                    "atacOffer": false,
                    "offerDescritpion": "Your ticket will be validated automatically on the scheduled departure of your train. Have you changed your mind? No problem! By 11.59 p.m. on the day before your trip, you can change the date and time, and on the day of travel you can change the departure time before the ticket is automatically validated. Once the ticket is validated, it can no longer be modified.",
                    "seatInfo": []
                  }
                ],
                "osdm": false
              }
            ],
            "messages": [null],
            "caneDbrAncillary": false,
            "canShowSeatMap": false,
            "changed": false
          }
        ],
        "otherServices": {
          "totalPrice": null,
          "ancillaries": [],
          "hiddenAncillaries": [],
          "additionalFees": []
        },
        "addToCalendar": true,
        "returnSolutionContainer": null,
        "totalPrice": {
          "currency": "€",
          "amount": 10.5,
          "originalAmount": null,
          "indicative": false
        },
        "termsAndConditions": [],
        "discounts": []
      },
      "solutionActions": [
        {
          "_action": "COMPENSATION_VERIFY",
          "action": "COMPENSATION_VERIFY",
          "resourceIds": [
            "w4xdw4h2p-w6z7p4m6k-e7f54785w4e7f54785w4e7f54785_683D2DD0820B75A41CCA7B554CB1CB37"
          ],
          "canSelectOffers": false,
          "tooltip": null,
          "groupId": null
        },
        {
          "_action": "SHOW_OTHER_EVENTS",
          "action": "SHOW_OTHER_EVENTS",
          "resourceIds": [
            "w4xdw4h2p-w6z7p4m6k-e7f54785w4e7f54785w4e7f54785_683D2DD0820B75A41CCA7B554CB1CB37"
          ],
          "canSelectOffers": true,
          "tooltip": null,
          "groupId": "show_events"
        }
      ],
      "solutionActionsForSS": [],
      "supportingActions": [],
      "returnSolution": null,
      "status": "FINALIZED",
      "statusDescription": "Purchased",
      "coupons": [],
      "consentAdEMessage": null,
      "payedWithCash": false,
      "pdfAvailable": true
    }
  ],
  "closedSolutions": [],
  "travelContact": {
    "name": "LUCA",
    "surname": "MARTINELLI",
    "email": "MARTINELLILUCA98@GMAIL.COM",
    "alternateEmail": null,
    "phoneNumber": "3404700123"
  },
  "userId": "martinelliluca98",
  "customerKey": "119330409",
  "identityProvider": "PICO.TRENITALIA.IT",
  "channel": "APP TRENITALIA ANDROID",
  "showHistory": false,
  "expirationDate": null,
  "purchaseDate": "2025-06-04T05:41:47.420+02:00",
  "wallet": {
    "googleWalletLink": null,
    "appleWallet": false
  },
  "note": null,
  "postoClick": false
}
```

**Download PDF:**

```bash
curl -XGET -H 'Auhtorization: Bearer eyJraWQiOiJUWW50TXlXTndtM2c3Z2FqYzMyaFhHSWUtdFo1TmF0eWtDRlJsMVpDQ19zIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJ0b2tlbl90eXBlIjoiQmVhcmVyIiwic3ViIjoibWFydGluZWxsaWx1Y2E5OCIsImxhc3ROYW1lIjoiTWFydGluZWxsaSIsImNvbXBhbnlOYW1lIjoiUElDTyBCMkMiLCJncm91cHMiOlsiY249V0VCVVNFUixvdT1Hcm91cHMsbz10cmVuaXRhbGlhLGM9aXQiXSwidXNlcklkIjoibWFydGluZWxsaWx1Y2E5OCIsImlkZW50aXR5UHJvdmlkZXIiOiJQSUNPLlRSRU5JVEFMSUEuSVQiLCJmaXJzdE5hbWUiOiJMdWNhIiwidXBuIjoidWlkPW1hcnRpbmVsbGlsdWNhOTgsb3U9UGVvcGxlLE89VFJFTklUQUxJQSxDPUlUIiwiZ3JvdXBOYW1lIjoiTHVjYSBNYXJ0aW5lbGxpIiwic2NvcGUiOlsiYXBpIl0sImVtYWlsIjoibWFydGluZWxsaWx1Y2E5OEBnbWFpbC5jb20iLCJ0aW1lc3RhbXAiOiIxNzUyMjMzMTUzNDY4IiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eVByb3ZpZGVyUGljby9vaWRjL2VuZHBvaW50L09QIiwiZXhwIjoxNzUyMjM5MTUzLCJpYXQiOjE3NTIyMzMxNTN9.Mj2Typ3N0_-aYYKwaOIhz2sLwA96VWfsTiFpI7limGHv4zBqV5kYpSjWB8VfvPvGj34lBaQXYTEbr9gH8pYJHAPJpoRnk94wxMZE2fzzDHKyr_9dDBvSHYCF6Jr91VMCcSipsv0NMTGeq9TGMuF7MyN06eFzapNGCC-qgnaJ65YpjGoZ-EUGyPU26JnZChQikT01InIqnIoQk7pV4K-XxEr9rgKF9QEiYkqy0C3zQeLaZCasdDnIfWo1XdBXmjerhYMcJQ-vKibPnP084jdTNqnsq_ncvA052zi9TCzAVsdO9bDRXtYYeQwtz0MHAklMePGIxS1gGYYyJ1C1_MKlPQ' 'https://www.lefrecce.it/Channels.Website.BFF.WEB/website/post/purchase/pdf?resourceId=w4xdw4p2z-p6w7a4k6p-e7f54785w4e7f54785_BF7B0F8A661F5A147B411AD0DA80E04F'
```
