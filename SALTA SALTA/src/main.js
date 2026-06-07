import { Level1 } from './Level1.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    },
    // Qui elencherai tutti i tuoi livelli: [Level1, Level2, Level3...]
    scene: [Level1] 
};

// Inizializza il gioco
new Phaser.Game(config);