# DOCUMENTAZIONE TECNICA E SPECIFICHE DI PROGETTO: SNAKE OOP
===================================================================
Questo documento raccoglie tutte le regole di business, l'architettura dei componenti (OOP)
e le logiche algoritmiche implementate nel videogioco Snake sviluppato con Phaser 3.

-------------------------------------------------------------------
1. ARCHITETTURA DEL CODICE (PROGRAMMAZIONE ORIENTATA AGLI OGGETTI)
-------------------------------------------------------------------
Il gioco adotta una struttura a ereditarietà per garantire scalabilità e pulizia del codice:

* index.html:
  - Configura la pagina web esterna.
  - Integra il foglio di stile CSS per il posizionamento e per l'animazione loop delle nuvole di sfondo.
  - Carica la libreria Phaser 3 da CDN e i file JavaScript rispettando rigorosamente l'ordine di dipendenza.

* BaseLevel.js (Superclasse / Classe Madre):
  - Estende 'Phaser.Scene'.
  - Gestisce il core loop del gioco: input da tastiera, movimento dello snake a griglia fissa (passi da 20px).
  - Gestisce il sistema delle collisioni standard (muri esterni e morso della propria coda).
  - Disegna la texture estetica del terreno marrone e instanzia l'HUD del punteggio semi-trasparente (Alpha 0.65).
  - Dichiara i prototipi di metodo per la gestione dei livelli sovrascritti dalle sottoclassi.

* Level1.js, Level2.js, Level3.js (Sottoclassi / Classi Figlie):
  - Estendono 'BaseLevel'.
  - Invocano 'super.initLevel()' nel metodo 'create()' per iniettare i parametri di configurazione propri del livello.
  - Implementano ed estendono le logiche specifiche del livello (come gli ostacoli di pietra e le mele speciali nel Livello 3).

* main.js:
  - Contiene l'oggetto di configurazione globale di Phaser ('Phaser.Game').
  - Registra l'array di scene '[Level1, Level2, Level3]' impostando l'ordine di avvio dei livelli.

* game.js:
  - File legacy mantenuto completamente vuoto e bianco per azzerare conflitti di scope o duplicazioni di variabili.

-------------------------------------------------------------------
2. SPECIFICHE DEI LIVELLI E REGOLE DI BUSINESS
-------------------------------------------------------------------
Il gioco prevede una progressione su 3 scenari con i seguenti vincoli di bilanciamento:

* Livello 1:
  - Dimensioni mappa: 800 x 750 pixel.
  - Velocità di aggiornamento del movimento: 140 millisecondi.
  - Obiettivo di punteggio richiesto: 150 punti.
  - Ostacoli: Assenti.
  - Tipologia cibo: Solo mela rossa standard.

* Livello 2:
  - Dimensioni mappa: 600 x 600 pixel.
  - Velocità di aggiornamento del movimento: 115 millisecondi (Aumento della difficoltà).
  - Obiettivo di punteggio richiesto: 250 punti complessivi.
  - Ostacoli: Assenti.
  - Tipologia cibo: Solo mela rossa standard.

* Livello 3:
  - Dimensioni mappa: 600 x 600 pixel.
  - Velocità di aggiornamento del movimento: 115 millisecondi.
  - Obiettivo di punteggio richiesto: 350 punti complessivi (Fine del gioco).
  - Ostacoli: Presenti (4 gruppi/cluster di pietre grigie generati in modo asimmetrico e naturale).
  - Tipologia cibo: Sistema dinamico Mela Rossa + Mela d'Oro sui multipli di 3.

-------------------------------------------------------------------
3. MECCANICHE SBLOCCATE E INTERFACCIA
-------------------------------------------------------------------
* Meccanica di sblocco (R + S):
  Al raggiungimento della soglia punti di un livello, il gioco si blocca e mostra una notifica di superamento testuale.
  Il passaggio effettivo alla scena successiva avviene unicamente tramite la pressione simultanea e controllata 
  dei tasti 'R' e 'S' sulla tastiera. Il testo rispetta il formato minuscolo richiesto:
  "livello superato, secondo livello!! (premi contemporaneamente R e S)"
  "gioco finito, hai vinto tutto!! (premi R e S per reiniziare)" (per il livello 3).

* HUD semi-trasparente al 35%:
  Il testo del punteggio in alto a sinistra ha un'opacità impostata a 0.65 (Alpha) e un background scuro. 
  La parziale trasparenza previene la formazione di angoli ciechi grafici, permettendo al giocatore di accorgersi 
  della presenza di cibo o ostacoli sottostanti.

-------------------------------------------------------------------
4. LOGICHE ALGORITMICHE SPECIALI (LIVELLO 3)
-------------------------------------------------------------------
* Sistema di conteggio e spawn delle Mele (Multipli di 3):
  All'interno del Livello 3, ogni mela raccolta incrementa il contatore locale 'this.meleRaccolteNelLivello'.
  L'algoritmo calcola se il prossimo elemento da raccogliere corrisponde a un multiplo di 3 utilizzando l'operatore 
  matematico Modulo (%).
  Formula logica: ((this.meleRaccolteNelLivello + 1) % 3 === 0)
  - Se FALSO: Il gioco esegue lo spawn della sola mela rossa (Valore: 10 punti).
  - Se VERO: Il gioco esegue lo spawn simultaneo di DUE mele (Mela Rossa + Mela d'Oro).
  - Valore Mela d'Oro: 20 punti.
  - Un controllo ricorsivo impedisce la sovrapposizione geometrica della mela d'oro sulle stesse coordinate della mela rossa.

* Sistema di generazione dei Cluster di Pietre Naturali:
  Per evitare strutture rettilinee o barriere artificiali, la funzione 'generaClusterPietre(4)' adotta una logica 
  di crescita e ramificazione casuale di tipo cammino casuale (Random Walk):
  1. Individua un punto di ancoraggio iniziale (startX, startY) assicurandosi che si trovi a debita distanza 
      geometrica dallo spawn centrale iniziale dello snake.
  2. Determina una dimensione casuale della formazione rocciosa (da 3 a 4 blocchi di pietra complessivi).
  3. Per ogni blocco successivo, estrae una direzione casuale (0=Su, 1=Giù, 2=Sinistra, 3=Destra) e sposta le coordinate 
     correnti per piazzare la pietra successiva. Si creano così formazioni asimmetriche a gomito, a "L" o curve rocciose grezze.
  4. Include una protezione per evitare la fuoriuscita dei singoli blocchi rocciosi dai bordi interni marroni del livello.

-------------------------------------------------------------------
5. NOTE DI PROGRAMMAZIONE E ALLINEAMENTO ALLA GRIGLIA
-------------------------------------------------------------------
* Grid Snapping (Ancoraggio):
  Il movimento dello snake si muove a salti costanti di 20 pixel. Di conseguenza, l'intero sistema di posizionamento 
  degli elementi di gioco (testa, coda, cibo, ostacoli) deve calcolare le coordinate ancorandosi al centro della cella.
  Formula di ancoraggio: Coordinate = (Indice_Cella * 20) + 10.
  Qualsiasi deviazione da questa formula rompe il sistema di controllo millimetrico delle collisioni nel ciclo 'update()'.

* Gestione Errori Comuni (Schermata Celeste fissa):
  Se il canvas di Phaser sparisce lasciando visibile solo lo sfondo azzurro delle nuvole CSS, la causa è riconducibile 
  a un errore di sintassi (es. chiusura mancante di parentesi graffe in BaseLevel.js) o al mancato svuotamento completo 
  del file 'game.js' che entra in conflitto di ridondanza con la nuova architettura a classi.
