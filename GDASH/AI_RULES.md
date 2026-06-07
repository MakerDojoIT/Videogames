# 🎮 Neon Cube Platformer (Phaser 3)

Un platform arcade minimale e dinamico in 2D sviluppato con **Phaser 3**. Il gioco sfida il giocatore a superare 10 livelli ricchi di insidie, spine mobili e piattaforme sospese, il tutto accompagnato da un comparto visivo e sonoro sincronizzato in tempo reale.

---

## ✨ Ultime Migliorie e Funzionalità

* **🎵 Audio System (Kenney Assets):** Integrazione nativa degli effetti sonori premium di Kenney per il salto (`back_001`), la morte (`back_002`) e la vittoria del livello (`back_003`). È presente un sistema di sblocco automatico dell'audio del browser al primo clic/pressione di un tasto.
* **🎨 Scenario Cromatico Sincronizzato:** Ogni volta che il cubo atterra dopo un salto, non solo cambia il proprio colore, ma aggiorna istantaneamente anche il colore di tutti i terreni, delle piattaforme e della sfumatura inferiore dello sfondo.
* **🌌 Sfondo Dinamico a Gradiente & Parallasse:** Il classico sfondo nero è stato sostituito da un gradiente procedurale (dal blu notte a una luce neon inferiore). Lo sfondo si sposta con un effetto *parallax* fluido basato sui movimenti della telecamera.
* **⚖️ Livelli Bilanciati (Anti-Frustrazione):** * La hitbox del giocatore è stata ottimizzata a `26x26` pixel (mantenendo la grafica a `36x36`) per garantire un margine di tolleranza millimetrico contro gli spigoli delle spine.
    * È stata rimossa la *permadeath*: quando si muore, si riparte istantaneamente dall'inizio del livello corrente senza perdere il progresso.
    * Il posizionamento delle spine nei livelli avanzati è stato alleggerito per rendere il gameplay più fluido.

---

## 📁 Struttura delle Cartelle del Progetto

Per fare in modo che il gioco carichi correttamente tutti gli asset senza generare errori nella console del browser, assicurati che la struttura dei file sia esattamente la seguente:

```text
📁 TuoProgetto/
│
├── 📄 index.html          # Il file HTML principale che ospita il gioco
├── 📄 game.js            # Il codice sorgente Javascript del gioco
└── 📁 assets/
    └── 📁 audio/
        ├── 🎵 back_001.ogg  # Effetto sonoro del Salto
        ├── 🎵 back_002.ogg  # Effetto sonoro della Morte
        └── 🎵 back_003.ogg  # Effetto sonoro della Vittoria (Passaggio Livello)