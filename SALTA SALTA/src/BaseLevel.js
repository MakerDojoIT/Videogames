export class BaseLevel extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    preload() {
        // Audio (già presenti)
        this.load.audio('jumpSound', './Assets/Audio/back_003.ogg');
        this.load.audio('deathSound', './Assets/Audio/back_004.ogg');

        // Assets Grafici - Percorsi basati sulla tua struttura cartelle
        this.load.image('player', './Assets/Video/tile_0051.png');
        this.load.image('obstacle', './Assets/Video/tile_0052.png');
        this.load.image('floor', './Assets/Video/tile_0053.png');
        this.load.image('background', './Assets/Video/tile_0003.png');
    }

    setupLevel() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.isGameOver = false;
        this.score = 0;

        this.soundJump = this.sound.add('jumpSound');
        this.soundDeath = this.sound.add('deathSound');
    }

    handlePlayerJump(player) {
        // Salto permesso solo se il giocatore tocca terra (floor o world bounds)
        if ((this.cursors.up.isDown || this.cursors.space.isDown) && (player.body.blocked.down || player.body.touching.down)) {
            player.body.setVelocityY(-550);
            this.soundJump.play({ volume: 0.5 }); 
        }
    }

    triggerGameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.physics.pause();
        this.soundDeath.play();

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        
        this.add.text(screenCenterX, screenCenterY, 'GAME OVER', { 
            fontSize: '64px', fill: '#ff0000', fontStyle: 'bold' 
        }).setOrigin(0.5);

        this.input.on('pointerdown', () => this.scene.restart());
    }
}