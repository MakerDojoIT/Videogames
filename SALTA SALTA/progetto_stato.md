# Stato del Progetto: Game Runner Phaser 3 (OOP)

## Tecnologie Utilizzate
- **Motore**: Phaser 3 (Arcade Physics).
- **Linguaggio**: JavaScript ES6+ (Moduli).
- **Ambiente**: VS Code + Live Server.
- **Controllo Versione**: Git.

## Architettura del Codice
Il progetto segue il paradigma OOP (Programmazione a Oggetti) per la scalabilità:
1. **index.html**: Carica Phaser e il modulo d'ingresso.
2. **src/main.js**: Configurazione globale e gestione delle scene.
3. **src/BaseLevel.js**: Classe madre che contiene la logica universale (fisica, input, game over).
4. **src/Level1.js**: Estensione di BaseLevel per il primo livello specifico.

## Funzionalità Implementate
- Gravità costante e salto (Tasto Spazio/Freccia Su).
- Generatore automatico di ostacoli con riciclo della memoria (destroy).
- Sistema di collisioni AABB.
- Schermata di Game Over con riavvio della scena.