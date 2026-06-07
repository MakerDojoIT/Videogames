# 🌌 CYBER PULSE: HARDCORE EDITION

Benvenuto in **Cyber Pulse: Hardcore**, un platform arcade frenetico e ad alto impatto visivo ispirato alle meccaniche di *Geometry Dash* e arricchito con un'estetica *Cyberpunk/Synthwave*. Il gioco è sviluppato interamente in **Phaser 3 (Arcade Physics)** utilizzando una logica procedurale ad oggetti (OOP) altamente ottimizzata.

---

## 🎨 Caratteristiche Principali

### 🧠 Logica di Contrasto Cromatico Dinamico
Il gioco implementa un sistema di offset circolare basato sulla palette di colori di gioco. A ogni atterraggio riuscito, il cubo cambia tonalità, mentre le piattaforme e i terreni scalano automaticamente di due posizioni nella palette. Questo garantisce un contrasto neon dinamico perpetuo, assicurando che l'azione sia sempre leggibile e visivamente sbalorditiva.

### 🚀 Effetto "Juice" (Squash & Stretch)
Per massimizzare il feedback dei comandi, il cubo reagisce fisicamente alle forze del motore:
* **In salto:** Si allunga verticalmente sull'innesco della rotazione.
* **In atterraggio:** Si schiaccia elasticamente prima di tornare alle proporzioni originali.
* *Nota tecnica:* L'effetto è puramente estetico (applicato al container grafico) e non influisce sulla hitbox fisica $26\times26$, garantendo una precisione al millimetro nei calcoli di collisione.

### 💎 Texture Premium & Grafica Procedurale
* **Bordi Neon a 360°:** Tutte le piattaforme e i terreni sono tassellati a quadratini $20\times20$ con una griglia interna ad alta definizione e una cornice perimetrale neon totale in modalità additiva (`ADD`).
* **Menu Glitch Cromatico:** La schermata iniziale genera a runtime un gradiente lineare nativo sul titolo (White to Cyan to Purple) accoppiato a un effetto di sdoppiamento dei canali RGB e micro-glitch casuali.
* **Anelli High-Tech Interattivi:** Il tasto Play è circondato da due cerchi vettoriali che ruotano in direzioni opposte a velocità asincrone.

### 💾 Sistema di Checkpoint Strategico
Il gioco adotta una progressione punitiva divisa in tre fasce di spawn:
* **Livelli 1-2:** Qualsiasi morte ti riporta all'inizio del **Livello 1**.
* **Livelli 3-4:** Raggiunto il primo checkpoint! Rispawn all'inizio del **Livello 3**.
* **Livelli 5-10:** Raggiunto il checkpoint Hardcore definitivo! Rispawn all'inizio del **Livello 5**.

---

## 🕹️ Comandi di Gioco

| Tasto | Azione |
| :--- | :--- |
| `A` / `Freccia Sinistra` | Muoviti a Sinistra |
| `D` / `Freccia Destra` | Muoviti a Destra |
| `W` / `SPACE` / `Freccia Su` | Salta / Salto con rotazione deterministica |
| `MOUSE CLICK` (Nel Menu) | Seleziona ed esegui il tasto PLAY (Sblocca anche l'audio del browser) |

---

## ⚙️ Struttura delle Risorse Audio

I file audio devono essere posizionati obbligatoriamente all'interno del percorso locale `Asset/Audio/`:

* `question_001.ogg` (Chiave: `death`) — Attivato in caso di caduta nel vuoto.
* `close_002.ogg` (Chiave: `spike_death`) — Attivato all'impatto distruttivo con spine statiche o mobili.
* `confirmation_003.ogg` (Chiave: `win`) — Traccia synth ascendente riprodotta al completamento del livello.

---

## 🛠️ Architettura del Codice

Il codice si sviluppa secondo un'architettura rigorosamente orientata agli oggetti:
1. **`BaseLevel` (Classe Madre Core):** Gestisce il ciclo vitale fondamentale di Phaser (`init`, `preload`, `create`, `update`), i sistemi particellari, la riproduzione protetta dell'audio (`playSafeSound`) e la logica globale di morte e vittoria.
2. **Classi Figlie (`Level1` to `Level10`):** Dichiarano esclusivamente l'array geometrico del layout (`levelGrounds`, `levelPlatforms`, `levelSpikes`, `levelMovingSpikes` e `levelGoal`) tramite il metodo `buildLevelLayout()`, ereditando in modo trasparente tutte le migliorie visive.