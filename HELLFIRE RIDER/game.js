// ==========================================
// GAME MANAGER CON COORDINATE MONETE TONDE
// ==========================================

class GameManager {
    constructor() {
        this.livelloCorrente = 1;
        this.livelloAttivo = null;
        this.caricaLivello(this.livelloCorrente);
        
        setInterval(() => {
            if (this.livelloAttivo) this.livelloAttivo.riduciTempo();
        }, 1000);
    }

    caricaLivello(numero) {
        this.livelloAttivo = new BaseLevel(numero);

        if (numero === 1) {
            this.livelloAttivo.platforms.push(new Platform(0, 450, 600, 150));
            this.livelloAttivo.platforms.push(new Platform(750, 380, 400, 40));
            this.livelloAttivo.platforms.push(new Platform(1300, 450, 500, 150));
            this.livelloAttivo.platforms.push(new Platform(1950, 350, 300, 40));
            this.livelloAttivo.platforms.push(new Platform(2400, 450, 800, 150)); 

            // Monete rotonde
            this.livelloAttivo.coins.push(new Coin(300, 410));
            this.livelloAttivo.coins.push(new Coin(900, 330));
            this.livelloAttivo.coins.push(new Coin(950, 330));
            this.livelloAttivo.coins.push(new Coin(1500, 410));
            this.livelloAttivo.coins.push(new Coin(2100, 300));

            this.livelloAttivo.spikes.push(new Spike(450, 420));
            this.livelloAttivo.spikes.push(new Spike(1450, 420));
            this.livelloAttivo.spikes.push(new Spike(2550, 420));

        } else if (numero === 2) {
            this.livelloAttivo.platforms.push(new Platform(0, 450, 400, 150));
            this.livelloAttivo.platforms.push(new Platform(550, 350, 250, 40));
            this.livelloAttivo.platforms.push(new Platform(950, 280, 200, 40));
            this.livelloAttivo.platforms.push(new Platform(1300, 400, 300, 40));
            this.livelloAttivo.platforms.push(new Platform(1750, 300, 300, 40));
            this.livelloAttivo.platforms.push(new Platform(2200, 450, 1000, 150));

            this.livelloAttivo.coins.push(new Coin(650, 300));
            this.livelloAttivo.coins.push(new Coin(1050, 230));
            this.livelloAttivo.coins.push(new Coin(1450, 350));
            this.livelloAttivo.coins.push(new Coin(1900, 250));

            this.livelloAttivo.spikes.push(new Spike(600, 320));
            this.livelloAttivo.spikes.push(new Spike(1400, 370));
            this.livelloAttivo.spikes.push(new Spike(1850, 270));
            this.livelloAttivo.spikes.push(new Spike(2400, 420));

        } else if (numero === 3) {
            this.livelloAttivo.platforms.push(new Platform(0, 450, 300, 150));
            this.livelloAttivo.platforms.push(new Platform(400, 360, 150, 40));
            this.livelloAttivo.platforms.push(new Platform(700, 280, 150, 40));
            this.livelloAttivo.platforms.push(new Platform(1000, 200, 150, 40));
            this.livelloAttivo.platforms.push(new Platform(1300, 300, 200, 40));
            this.livelloAttivo.platforms.push(new Platform(1650, 400, 400, 40));
            this.livelloAttivo.platforms.push(new Platform(2200, 300, 200, 40));
            this.livelloAttivo.platforms.push(new Platform(2550, 450, 700, 150));

            this.livelloAttivo.coins.push(new Coin(450, 310));
            this.livelloAttivo.coins.push(new Coin(750, 230));
            this.livelloAttivo.coins.push(new Coin(1050, 150));
            this.livelloAttivo.coins.push(new Coin(1800, 350));

            this.livelloAttivo.spikes.push(new Spike(430, 330));
            this.livelloAttivo.spikes.push(new Spike(1750, 370));
            this.livelloAttivo.spikes.push(new Spike(1800, 370)); 
            this.livelloAttivo.spikes.push(new Spike(2700, 420));
        }
    }

    prossimoLivello() {
        this.livelloCorrente++;
        if (this.livelloCorrente <= 3) {
            this.caricaLivello(this.livelloCorrente);
        } else {
            alert("ECCEZIONALE! Hai completato l'avventura e superato tutti i livelli!");
            this.livelloCorrente = 1; 
            this.caricaLivello(this.livelloCorrente);
        }
    }

    esegui() {
        const loop = () => {
            if (this.livelloAttivo) {
                this.livelloAttivo.aggiornaFisica();
                this.livelloAttivo.disegna();

                if (this.livelloAttivo.vinto) {
                    this.prossimoLivello();
                }
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}

const gioco = new GameManager();
gioco.esegui();