# Stato Avanzamento Progetto - Platform Game

Questo file mappa lo stato attuale del codice sorgente e le funzionalità già implementate e funzionanti con successo.

## 📋 Stato Attuale
- **Framework:** Phaser 3 (Arcade Physics via CDN).
- **Stato:** Prototipo OOP multi-file perfettamente funzionante senza schermate nere.
- **Ultima modifica:** Risolto bug del caricamento delle classi tramite il binding su `window` e l'inserimento del tag div obbligatorio per Phaser.

## 📂 Mappa dei File Attivi nel Progetto

### 1. `index.html`
- Carica Phaser da CDN Cloudflare.
- Configura lo stile CSS per centrare il gioco nello schermo e crea una cornice bianca.
- Crea il tag `<div id="game-container"></div>`.
- Carica ordinatamente: `baselevel.js` -> `levelgenerator.js` -> `game.js`.

### 2. `baselevel.js`
- Inizializza le variabili globali `window.gameCurrentLevel = 1` e `window.gameTotalCoins = 0`.
- Crea le texture dinamiche in memoria (`playerTexture`, `obstacleTexture`, `platformTexture`).
- Gestisce la telecamera che insegue il giocatore fluidamente.
- Gestisce i controlli della tastiera (Frecce Sinistra, Destra, Su).
- Contiene le funzioni globali `hitObstacle()` (reset totale a Lvl 1 e 0 monete) e `reachFinish()` (+15 monete e incremento livello).

### 3. `levelgenerator.js`
- Estende `window.BaseLevel`.
- Genera matematicamente il percorso creando ostacoli ogni 350 pixel.
- Alterna in modo casuale 3 pattern di sfida:
  1. Spuntone singolo a terra.
  2. Doppio spuntone a terra + piattaforma di salvataggio aerea.
  3. Doppia piattaforma aerea alta + spuntone a terra sotto di esse.

### 4. `game.js`
- Contiene l'oggetto `config` di Phaser.
- Collega la fisica Arcade e imposta la gravità a `700`.
- Inietta come scena principale `window.LevelGenerator`.

## 🛠️ Funzionalità Verificate (Funzionano al 100%)
- Il super salto a `-750` permette di scavalcare le sfide.
- Gli spuntoni arancioni uccidono al contatto ma non bloccano il movimento in avanti.
- Lo sfondo con le colline si muove fluidamente in parallasse.
- Il sistema di salvataggio monete/livelli funziona correttamente tra i riavvii della scena.