/**
 * game.js - LIVELLI 1, 2 e 3
 */

// --- LIVELLO 1: Neon Green (200 Punti) ---
class Level1 extends BaseLevel {
    constructor() { super('Level1'); }
    create() {
        this.targetScore = 200;
        this.worldWidth = 7000;
        this.physics.world.setBounds(0, 0, this.worldWidth, 600);
        this.cameras.main.setBackgroundColor('#4facfe');
        this.createPlayer(410, 400, 0x2ecc71);
        this.createUIProgressBar();
        this.hazardFloor = this.add.rectangle(this.worldWidth/2, 595, this.worldWidth, 20, 0xff0000, 0.6);
        this.physics.add.existing(this.hazardFloor, true);
        this.platforms = this.physics.add.staticGroup();
        this.coins = this.physics.add.group();

        for (let i = 1; i < 18; i++) {
            let px = 150 + (i * 260); let py = 480 - (i % 4 * 35);
            let p = this.add.rectangle(px, py, 150, 15, 0x2c3e50).setStrokeStyle(2, 0xff00ff, 1);
            this.platforms.add(p);
            [-35, 35].forEach(offX => {
                let c = this.add.circle(px + offX, py - 40, 8, 0xffff00, 1).setStrokeStyle(2, 0xffffff, 1);
                this.coins.add(c); this.physics.add.existing(c); c.body.setAllowGravity(false);
            });
        }
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.hazardFloor, () => this.handleFloorCollision());
        this.physics.add.overlap(this.player, this.coins, (p, coin) => {
            if (this.levelCompleted) return;
            coin.destroy(); this.score += 10; this.hasCollectedCoin = true;
            this.scoreText.setText(`PUNTEGGIO: ${this.score}/${this.targetScore}`);
            if (this.score >= this.targetScore) this.celebrate("LIVELLO 1", "Level2");
        });
        this.scoreText = this.add.text(20, 20, `PUNTEGGIO: 0/${this.targetScore}`, { fontSize: '24px', fill: '#fff', stroke: '#000', strokeThickness: 4 }).setScrollFactor(0);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }
    update() { this.updatePlayer(); this.updateUIProgressBar(this.worldWidth); }
}

// --- LIVELLO 2: Neon Purple (300 Punti) ---
class Level2 extends BaseLevel {
    constructor() { super('Level2'); }
    create() {
        this.targetScore = 300;
        this.worldWidth = 7000;
        this.physics.world.setBounds(0, 0, this.worldWidth, 600);
        this.cameras.main.setBackgroundColor('#1a1a2e');
        this.createPlayer(410, 400, 0x9b59b6);
        this.createUIProgressBar();
        this.hazardFloor = this.add.rectangle(this.worldWidth/2, 595, this.worldWidth, 20, 0xff0000, 0.6);
        this.physics.add.existing(this.hazardFloor, true);
        this.platforms = this.physics.add.staticGroup();
        this.coins = this.physics.add.group();

        // CORREZIONE: 2 monete per muretto per arrivare a 300 punti!
        for (let i = 1; i < 25; i++) {
            let px = 150 + (i * 280); let py = 450 - (i % 5 * 45);
            let p = this.add.rectangle(px, py, 130, 15, 0x00ffff).setStrokeStyle(2, 0xffffff, 1);
            this.platforms.add(p);
            
            // Due monete per piattaforma (20 punti a blocco)
            [-30, 30].forEach(offX => {
                let c = this.add.circle(px + offX, py - 40, 8, 0xffff00, 1).setStrokeStyle(2, 0xffffff, 1);
                this.coins.add(c); this.physics.add.existing(c); c.body.setAllowGravity(false);
            });
        }
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.hazardFloor, () => this.handleFloorCollision());
        this.physics.add.overlap(this.player, this.coins, (p, coin) => {
            if (this.levelCompleted) return;
            coin.destroy(); this.score += 10; this.hasCollectedCoin = true;
            this.scoreText.setText(`PUNTEGGIO: ${this.score}/${this.targetScore}`);
            if (this.score >= this.targetScore) this.celebrate("LIVELLO 2", "Level3");
        });
        this.scoreText = this.add.text(20, 20, `PUNTEGGIO: 0/${this.targetScore}`, { fontSize: '24px', fill: '#fff', stroke: '#000', strokeThickness: 4 }).setScrollFactor(0);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }
    update() { this.updatePlayer(); this.updateUIProgressBar(this.worldWidth); }
}

// --- LIVELLO 3: Neon Red (400 Punti) - FATTIBILE ---
class Level3 extends BaseLevel {
    constructor() { super('Level3'); }
    create() {
        this.targetScore = 400;
        this.worldWidth = 7000;
        this.physics.world.setBounds(0, 0, this.worldWidth, 600);
        this.cameras.main.setBackgroundColor('#a10f17');
        this.createPlayer(410, 400, 0xe74c3c); 
        this.createUIProgressBar();
        this.hazardFloor = this.add.rectangle(this.worldWidth/2, 595, this.worldWidth, 20, 0xff0000, 0.8);
        this.physics.add.existing(this.hazardFloor, true);
        this.platforms = this.physics.add.staticGroup();
        this.coins = this.physics.add.group();

        // RICALIBRATO: py abbassato (muretti a 480 invece di 430) e salti fattibili
        for (let i = 1; i < 35; i++) {
            let px = 150 + (i * 270); 
            let py = 480 - (i % 4 * 35); // Più basso e ritmato per non morire
            let p = this.add.rectangle(px, py, 110, 15, 0x27ae60).setStrokeStyle(2, 0xffffff, 1);
            this.platforms.add(p);
            
            [-25, 25].forEach(offX => {
                let c = this.add.circle(px + offX, py - 40, 8, 0xffff00, 1).setStrokeStyle(2, 0xffffff, 1);
                this.coins.add(c); this.physics.add.existing(c); c.body.setAllowGravity(false);
            });
        }
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.hazardFloor, () => this.handleFloorCollision());
        this.physics.add.overlap(this.player, this.coins, (p, coin) => {
            if (this.levelCompleted) return;
            coin.destroy(); this.score += 10; this.hasCollectedCoin = true;
            this.scoreText.setText(`PUNTEGGIO: ${this.score}/${this.targetScore}`);
            if (this.score >= this.targetScore) this.celebrate("LIVELLO FINALE", null);
        });
        this.scoreText = this.add.text(20, 20, `PUNTEGGIO: 0/${this.targetScore}`, { fontSize: '24px', fill: '#fff', stroke: '#000', strokeThickness: 4 }).setScrollFactor(0);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }
    update() { this.updatePlayer(); this.updateUIProgressBar(this.worldWidth); }
}

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 800, height: 400 },
    physics: { default: 'arcade', arcade: { gravity: { y: 1200 } } },
    scene: [Level1, Level2, Level3]
};
const game = new Phaser.Game(config);