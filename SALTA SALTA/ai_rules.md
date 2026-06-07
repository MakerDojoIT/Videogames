# Regole per l'Intelligenza Artificiale

Quando generi codice per questo progetto, rispetta rigorosamente queste linee guida:

1. **Mantieni l'architettura OOP**: Ogni nuova funzionalità deve essere inserita nella classe corretta. Non scrivere funzioni isolate fuori dalle classi.
2. **Ereditarietà**: Se viene richiesto un nuovo livello, deve estendere `BaseLevel`.
3. **Commenti**: Commenta il codice in lingua Italiana.
4. **Moduli ES6**: Usa sempre `import` ed `export`. Non mescolare stili di caricamento diversi.
5. **Fisica**: Usa esclusivamente `this.physics.arcade`.
6. **Clean Code**: Quando crei nuovi oggetti, assicurati che ci sia una logica per distruggerli se escono dallo schermo (gestione memoria).