# Diario di Bordo - Dungeon Survivor

- **Risoluzione Freeze**: Implementato controllo di esistenza asset audio nel metodo `killEnemy` per prevenire blocchi in caso di file mancante.
- **Ottimizzazione Memoria**: Aggiunta la distruzione automatica degli emitter di particelle dopo 600ms per mantenere alte le performance durante i combattimenti intensi.
- **Sicurezza Codice**: Aggiunti controlli di validità (`active`) sugli oggetti prima di chiamare `destroy()` o `clearTint()` per evitare errori null-pointer.
- **Audio Feedback**: Ridotto leggermente il volume dell'impatto a 0.4 per migliorare la qualità del mix sonoro.