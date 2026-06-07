// Importiamo in modo sicuro la classe madre dal suo file specifico
import { BaseLevel } from './baselevel.js';

/**
 * CLASSE FIGLIA: LevelGenerator
 * Estende BaseLevel e disegna la griglia posizionando blocchi, trappole e monete.
 */
export class LevelGenerator extends BaseLevel {
    constructor() {
        super('PlayGame');
    }

    buildTilemap() {
        let tileSize = 40;
        let maxCols = Math.floor(this.levelLength / tileSize); 
        let maxRows = 15; 

        // 1. Generazione scacchiera matematica vuota (0 = Aria)
        let grid = [];
        for (let r = 0; r < maxRows; r++) {
            grid[r] = new Array(maxCols).fill(0);
        }

        // 2. Pavimentazione totale della riga inferiore (ID 1)
        for (let c = 0; c < maxCols; c++) {
            grid[14][c] = 1;
        }

        // 3. GENERATORE PROCEDURALE A MATRICE
        for (let col = 10; col < maxCols - 6; col += 8) {
            let pattern = Phaser.Math.Between(1, 3);

            if (pattern === 1) {
                grid[13][col] = 3; // Uno spuntone
                grid[9][col] = 4;  // Una moneta d'oro sospesa
            } 
            else if (pattern === 2) {
                grid[13][col] = 3;
                grid[13][col + 1] = 3; // Doppio spuntone
                
                grid[10][col - 1] = 2; // Linea di tre piattaforme aeree (ID 2)
                grid[10][col] = 2;
                grid[10][col + 1] = 2;
                
                grid[9][col] = 4; // Moneta sopra la piattaforma
            } 
            else if (pattern === 3) {
                grid[11][col] = 2;
                grid[11][col + 1] = 2;
                grid[10][col] = 4; // Moneta sulla prima piattaforma
                
                grid[8][col + 3] = 2;
                grid[8][col + 4] = 2;
                grid[7][col + 3] = 4; // Moneta sulla seconda piattaforma alta
                
                grid[13][col + 3] = 3; // Spuntone sotto la struttura aerea
            }
        }

        // 4. GENERAZIONE GRAFICA E FISICA DEI BLOCCHI DALL'ARRAY 2D
        for (let r = 0; r < maxRows; r++) {
            for (let c = 0; c < maxCols; c++) {
                let tileId = grid[r][c];
                let posX = c * tileSize + tileSize / 2;
                let posY = r * tileSize + tileSize / 2;

                if (tileId === 1) {
                    this.groundGroup.create(posX, posY, 'tileGround');
                } 
                else if (tileId === 2) {
                    this.groundGroup.create(posX, posY, 'tilePlatform');
                } 
                else if (tileId === 3) {
                    this.hazardGroup.create(posX, posY, 'tileSpike');
                } 
                else if (tileId === 4) {
                    this.coinGroup.create(posX, posY, 'tileCoin');
                }
            }
        }
    }
}