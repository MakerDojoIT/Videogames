// Importiamo il modulo del generatore che contiene l'intera catena OOP
import { LevelGenerator } from './levelgenerator.js';

/**
 * CONFIGURAZIONE GLOBALE DEL MOTORE DI GIOCO PHASER
 */
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container', // Vincolo obbligatorio al div dell'index.html
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700 }, // Forza di gravità
            debug: false
        }
    },
    // Avviamo la scena importata dal modulo
    scene: [LevelGenerator]
};

// Inizializzazione finale
const game = new Phaser.Game(config);