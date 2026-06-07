# Regole di Sviluppo per Dungeon Survivor

1. **Stabilità Audio**: Verificare sempre l'esistenza dell'audio nella cache prima di `play()` per evitare freeze del thread principale.
2. **Gestione Memoria**: Ogni sistema di particelle (Emitter) deve essere distrutto esplicitamente dopo l'uso per evitare rallentamenti.
3. **Asset Critici**: L'immagine `blackSmoke00.png` e l'audio `impactPunch_heavy_003.ogg` devono trovarsi nella stessa cartella di `index.html`.
4. **Input Utente**: Ricordare che l'audio potrebbe non attivarsi finché l'utente non interagisce con il canvas (clic o tasto SPAZIO).