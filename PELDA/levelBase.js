// ==========================================================
// --- CLASSE PADRE MOTOR FISICO (ENGINE BASE CORES) ---
// ==========================================================
class LevelBase {
    constructor() {
        this.player = new Penguin();
        this.cameraX = 0;
        this.platforms = [];
        this.pitfalls = [];
        this.obstacles = [];
        this.coins = [];
        this.goal = null;
    }

    // Cronometro asincrono di livello
    initTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            tempo++;
            lblTempo.innerText = tempo;
        }, 1000);
    }

    // Processamento logico della morte del personaggio
    processDeath() {
        this.player.morti++;
        lblMortiP1.innerText = this.player.morti;

        this.player.xMorteFissa = this.player.x + this.player.width / 2;
        this.player.yMorteFissa = this.player.y - 15;
        this.player.testoMorte = INSULTI_ARCADE[Math.floor(Math.random() * INSULTI_ARCADE.length)];
        this.player.timerTestoMorte = 50;

        if (this.player.morti >= 8) {
            lblMortiP1.classList.add('pericolo');
        }

        if (this.player.morti >= 10) {
            alert(`GAME OVER! Sei imploso troppe volte.\nSi ricomincia dal Livello 1!`);
            this.resetGameCompletely(); 
            this.loadLevel(livelloAttuale);
            return;
        }
        
        this.cameraX = 0;
        this.player.resetLogicState();
    }

    // Calcolo della fisica di scorrimento, input e collisioni ad ogni frame
    updateCoreEngine() {
        animationFrameCount++;

        // Movimento della camera orizzontale agganciato alla X del pinguino
        let targetCameraX = this.player.x - CANVAS_WIDTH / 4;
        this.cameraX = targetCameraX;
        if (this.cameraX < 0) this.cameraX = 0;
        if (this.cameraX > WORLD_WIDTH - CANVAS_WIDTH) this.cameraX = WORLD_WIDTH - CANVAS_WIDTH;

        // Regola Hardcore dello scrolling continuo: non farsi tagliare fuori a sinistra
        if (this.player.x < this.cameraX) { 
            this.processDeath();
            return;
        }

        this.player.update(this.platforms);

        // Verifica interazione con le trappole (Lava / Dinosauri Rossi)
        for (let pit of this.pitfalls) {
            if (pit.checkCollision(this.player)) {
                this.processDeath();
                return;
            }
        }

        // Verifica impatto sulle spine ad ostacolo statico
        for (let spine of this.obstacles) {
            if (spine.checkCollision(this.player)) {
                this.processDeath();
                return;
            }
        }

        // Morte per superamento dei limiti inferiori del Canvas
        if (this.player.y > CANVAS_HEIGHT) {
            this.processDeath();
            return;
        }

        // Raccolta monete d'oro poligonali
        this.coins.forEach(coin => {
            if (coin.checkCollision(this.player)) {
                coin.collected = true;
                punti += 10;
                lblPunti.innerText = punti;
            }
        });

        // Controllo e sblocco per il superamento del livello tramite traguardo
        if (this.goal.checkCollision(this.player)) {
            punti += 100;
            lblPunti.innerText = punti;
            
            if (livelloAttuale < 3) {
                livelloAttuale++;
                lblLivello.innerText = livelloAttuale;
                this.loadLevel(livelloAttuale);
            } else {
                alert(`VITTORIA ASSOLUTA! 🎉\nHai conquistato la Corona del Pinguino!\nPunti totali: ${punti}\nTempo: ${tempo}s\nMorti totali: ${this.player.morti}`);
                tempo = 0;
                this.resetGameCompletely();
                this.loadLevel(livelloAttuale);
            }
        }
    }

    // Sincronizzazione ed output grafico su Canvas 2D
    drawCoreEngine() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.save();
        ctx.translate(-this.cameraX, 0);

        this.platforms.forEach(p => p.draw(ctx));
        
        this.pitfalls.forEach(pit => {
            if (pit instanceof DinosaurTrap) {
                pit.draw(ctx, this.player.x);
            } else {
                pit.draw(ctx);
            }
        });

        this.obstacles.forEach(o => o.draw(ctx));
        this.coins.forEach(c => c.draw(ctx));
        this.goal.draw(ctx);
        this.player.draw(ctx);

        if (this.player.testoMorte !== "") {
            ctx.fillStyle = '#ff4757';
            ctx.font = 'bold 16px "Segoe UI"';
            ctx.textAlign = 'center';
            ctx.fillText(this.player.testoMorte, this.player.xMorteFissa, this.player.yMorteFissa);
        }
        
        ctx.restore();
    }
}