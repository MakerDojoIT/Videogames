/**
 * baselevels.js - MOTORE LOGICO AGGIORNATO
 * Include la gestione dei blocchi mobili (Verticali e Orizzontali)
 */
class BaseLevel extends Phaser.Scene {
    constructor(key, config) {
        super(key);
        this.cfg = config;
    }

    init() {
        this.score = 0;
        this.hasCollectedCoin = false;
        this.canTakeDamage = true;
        this.isGameOver = false;
    }

    // Metodo per creare lo slime e i tasti
    createPlayer(color) {
        this.player = this.add.rectangle(200, 300, 40, 40, color).setStrokeStyle(3, 0xffffff, 1);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.setOrigin(0.5, 1);

        // Input: Frecce + WASD
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    }

    // Metodo per gestire il movimento dei muretti mobili
    updateMovingPlatforms() {
        if (!this.platforms) return;

        this.platforms.children.iterate(plat => {
            // Se è un blocco verticale (v)
            if (plat.getData('type') === 'v') {
                const startY = plat.getData('start');
                // Se supera i 60 pixel di distanza dal punto iniziale, inverte il senso
                if (Math.abs(plat.y - startY) > 60) {
                    plat.body.setVelocityY(plat.body.velocity.y * -1);
                }
            } 
            // Se è un blocco orizzontale (h)
            else if (plat.getData('type') === 'h') {
                const startX = plat.getData('start');
                // Se supera i 50 pixel di distanza, inverte
                if (Math.abs(plat.x - startX) > 50) {
                    plat.body.setVelocityX(plat.body.velocity.x * -1);
                }
            }
        });
    }

    // Logica di movimento dello Slime
    handlePlayerMovement() {
        if (this.isGameOver || this.levelCompleted) return;

        // Movimento Orizzontale
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.body.setVelocityX(-320);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.body.setVelocityX(320);
        } else {
            this.player.body.setVelocityX(0);
        }

        // Salto (Funziona solo se tocca una piattaforma)
        if ((this.cursors.space.isDown || this.cursors.up.isDown || this.wasd.W.isDown) && this.player.body.touching.down) {
            this.player.body.setVelocityY(-600);
        }

        // Animazione "movenza" (Squash & Stretch)
        if (!this.player.body.touching.down) {
            this.player.scaleX = 0.8; this.player.scaleY = 1.2;
        } else {
            this.player.scaleX = 1; this.player.scaleY = 1;
        }
    }

    handleHazard() {
        if (!this.hasCollectedCoin || !this.canTakeDamage || this.isGameOver) return;
        
        this.score -= this.cfg.damage;
        this.updateUI();

        if (this.score < 0) {
            this.isGameOver = true;
            this.physics.pause();
            this.add.text(400, 200, 'GAME OVER', { fontSize: '64px', fill: '#ff0000', fontFamily: 'Arial Black' }).setOrigin(0.5).setScrollFactor(0);
            this.time.delayedCall(2000, () => this.scene.start('MainMenu'));
        } else {
            this.canTakeDamage = false;
            this.player.setAlpha(0.5);
            // Flash rosso della camera
            this.cameras.main.flash(200, 255, 0, 0);
            this.time.delayedCall(1000, () => {
                if (!this.isGameOver) {
                    this.canTakeDamage = true;
                    this.player.setAlpha(1);
                }
            });
        }
    }

    updateUI() {
        if (scoreElement) {
            scoreElement.innerText = `Lvl ${this.cfg.index} - SCORE: ${this.score}/${this.cfg.target} (DANNO: -${this.cfg.damage})`;
        }
    }

    win() {
        this.levelCompleted = true;
        this.physics.pause();
        this.add.text(400, 150, 'LIVELLO COMPLETATO!', { fontSize: '40px', fill: '#39FF14', fontFamily: 'Arial Black' }).setOrigin(0.5).setScrollFactor(0);
        
        let btn = this.add.rectangle(400, 250, 200, 50, 0x00ffff).setInteractive({ useHandCursor: true }).setScrollFactor(0);
        this.add.text(400, 250, this.cfg.next ? 'CONTINUA' : 'MENU', { fontSize: '20px', color: '#000', fontFamily: 'Arial Black' }).setOrigin(0.5).setScrollFactor(0);
        
        btn.on('pointerdown', () => {
            this.scene.start(this.cfg.next || 'MainMenu');
        });
    }

    // Questo metodo update viene chiamato automaticamente da Phaser ogni frame
    update() {
        this.handlePlayerMovement();
        this.updateMovingPlatforms();
    }
}