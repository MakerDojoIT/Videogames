# Regole di Sviluppo per l'AI - Progetto Platform

Questo file contiene le regole architetturali, fisiche e di gameplay che l'AI deve RISPETTARE ASSOLUTAMENTE in ogni modifica del codice.

## 1. Architettura del Codice (OOP Strict)
- Il gioco è sviluppato in **Phaser 3** (Arcade Physics).
- La struttura è rigorosamente orientata agli oggetti (**OOP**) divisa in più file.
- Per evitare problemi di caricamento nel browser, le classi devono essere collegate all'oggetto globale `window`.
- **Struttura dei File:**
  - `index.html`: Contiene il div `#game-container` ed è il punto di ingresso.
  - `baselevel.js`: Contiene la classe madre `window.BaseLevel`. Gestisce la fisica di base, input, telecamera, UI e cicli di vittoria/sconfitta.
  - `levelgenerator.js`: Contiene la classe figlia `window.LevelGenerator` che estende `BaseLevel` e si occupa SOLO della generazione procedurale degli ostacoli.
  - `game.js`: Configura il motore Phaser e avvia la scena `window.LevelGenerator`.

## 2. Regole di Gameplay e Fisica
- **Fisica del Salto:** Il giocatore deve avere un salto estremamente potenziato. La velocità verticale del salto è impostata tassativamente a `-750` (con gravità impostata a `700`).
- **Gestione degli Ostacoli (Spuntoni):** Gli ostacoli NON devono essere solidi. Non devono bloccare il cammino del giocatore come muri di mattoni. Deve essere usato il sistema di `overlap` di Phaser, non il `collider`. Il giocatore ci passa attraverso visivamente, ma muore nell'istante del contatto.
- **Progressione Livelli:** Il gioco è diviso in livelli procedurali che diventano sempre più lunghi. Non c'è un limite massimo fisso (es. dopo il livello 15 si passa al 16, 17, all'infinito).

## 3. Economia di Gioco e Stati (Vittoria/Sconfitta)
- **Monete alla Vittoria:** Ogni volta che il giocatore tocca il traguardo viola, guadagna esattamente **15 monete**, che si sommano a quelle attuali, e passa al livello successivo.
- **Sconfitta (Morte Permanente):** Se il giocatore tocca anche solo per un millisecondo uno spuntone arancione, il gioco subisce un **RESET TOTALE**. Si ritorna al Livello 1 e le monete totali vengono azzerate a 0.

## 4. Stile Grafico del Prototipo
- **Sfondo:** Cielo azzurro (`#a0e0ff`), Sole giallo fisso in alto a destra.
- **Colline:** Due strati di colline circolari verdi in effetto Parallasse (scrolling ridotto a `0.2` e `0.5`).
- **Terreno:** Marrone terra con un filo di erba verde solida.
- **Giocatore:** Un quadrato rosso (`#e74c3c`).
- **Ostacoli:** Spuntoni triangolari arancioni (`#e67e22`).