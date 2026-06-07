// --- CLASSE FIGLIA GENERATRICE ED ISTANZIATRICE DEI LIVELLI ---
class LevelGenerator extends LevelBase {
    constructor() {
        super(); // Inizializza i componenti ereditati dalla classe madre LevelBase
        this.loadLevel(livelloAttuale);
        this.initTimer();
    }

    // Override: Prende i dati statici e li mappa istanziando gli oggetti corretti via OOP
    loadLevel(id) {
        const dati = livelliDatiStatici[id];
        
        this.platforms = dati.platforms.map(p => new Platform(p.x, p.y, p.w, p.h));
        this.obstacles = dati.obstacles.map(o => new Spike(o.x, o.y, o.w, o.h));
        this.coins = dati.coins.map(c => new Coin(c.x, c.y, c.w, c.h));
        
        this.pitfalls = dati.pitfalls.map(p => {
            if (p.type === 'dino') {
                return new DinosaurTrap(p.x, p.w, p.floorY);
            } else {
                return new LavaTrap(p.x, p.w, p.floorY);
            }
        });

        if (id === 3) {
            this.goal = new Crown(dati.goal.x, dati.goal.y - 12, dati.goal.w, dati.goal.h);
        } else {
            this.goal = new Flag(dati.goal.x, dati.goal.y, dati.goal.w, dati.goal.h);
        }

        this.cameraX = 0;
        this.player.resetLogicState();
    }

    // Svuotamento e reset totale delle monete e dei punti accumulati
    resetGameCompletely() {
        livelloAttuale = 1;
        punti = 0;
        this.player.morti = 0;
        
        lblLivello.innerText = livelloAttuale;
        lblPunti.innerText = punti;
        lblMortiP1.innerText = 0;
        lblMortiP1.classList.remove('pericolo');
        
        for (let lvlId in livelliDatiStatici) {
            livelliDatiStatici[lvlId].coins.forEach(c => c.collected = false);
        }
    }
}

// --- AVVIO REALE DEL MOTORE DI GIOCO ---
const game = new LevelGenerator();

// Loop principale ciclico sincronizzato alle prestazioni del monitor
function loopSincrono() {
    game.updateCoreEngine();
    game.drawCoreEngine();
    requestAnimationFrame(loopSincrono);
}

// Start ufficiale del processo continuo
loopSincrono();