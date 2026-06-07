// Inizializzazione sicura delle variabili di stato globali
if (window.gameCurrentLevel === undefined) window.gameCurrentLevel = 1;
if (window.gameTotalCoins === undefined) window.gameTotalCoins = 0;
// Nuova variabile per tracciare il momento esatto in cui inizia la partita (Livello 1)
if (window.gameStartTime === undefined) window.gameStartTime = Date.now();

/**
 * CLASSE MADRE: BaseLevel
 * Gestisce la logica comune, la fisica, i controlli e le texture protette.
 */
export class BaseLevel extends Phaser.Scene {
    constructor(sceneKey) {
        super(sceneKey);
    }

    // Caricamento degli asset esterni (Audio, Sprite, ecc.)
    preload() {
        // Caricamento audio
        this.load.audio('coinSound', 'confirmation_001.ogg');
        this.load.audio('jumpSound', 'phaseJump2.ogg');
        this.load.audio('winSound', 'mission_completed.ogg');
        this.load.audio('failSound', 'mission_failed.ogg');

        // Caricamento immagini e sprite del terreno e ostacoli
        this.load.image('tileGround', 'Video/terrain_grass_block_top.png');
        this.load.image('tilePlatform', 'Video/block_red.png');
        this.load.image('tileSpike', 'Video/block_spikes.png');
        
        // Monete
        this.load.image('tileCoin', 'Video/coin_gold.png');
        this.load.image('tileCoinSide', 'Video/coin_gold_side.png');

        // Caricamento sprite del personaggio viola
        this.load.image('playerIdle', 'Video/character_purple_idle.png');
        this.load.image('playerJump', 'Video/character_purple_jump.png');
        this.load.image('playerWalkA', 'Video/character_purple_walk_a.png');
        this.load.image('playerWalkB', 'Video/character_purple_walk_b.png');
    }

    getLevelLength() {
        return 2000 + (window.gameCurrentLevel * 400);
    }

    // Generazione protetta delle texture per evitare crash da duplicazione
    initTextures() {
        if (!this.textures.exists('playerTexture')) {
            let tex = this.textures.createCanvas('playerTexture', 30, 30);
            tex.context.fillStyle = '#e74c3c';
            tex.context.fillRect(0, 0, 30, 30);
            tex.refresh();
        }
        if (!this.textures.exists('tileGround')) {
            let tex = this.textures.createCanvas('tileGround', 40, 40);
            tex.context.fillStyle = '#795548';
            tex.context.fillRect(0, 0, 40, 40);
            tex.context.fillStyle = '#2ecc71';
            tex.context.fillRect(0, 0, 40, 6);
            tex.refresh();
        }
        if (!this.textures.exists('tilePlatform')) {
            let tex = this.textures.createCanvas('tilePlatform', 40, 40);
            tex.context.fillStyle = '#d35400';
            tex.context.fillRect(0, 0, 40, 40);
            tex.refresh();
        }
        if (!this.textures.exists('tileSpike')) {
            let tex = this.textures.createCanvas('tileSpike', 40, 40);
            tex.context.fillStyle = '#e67e22';
            tex.context.beginPath();
            tex.context.moveTo(20, 0);
            tex.context.lineTo(40, 40);
            tex.context.lineTo(0, 40);
            tex.context.closePath();
            tex.context.fill();
            tex.refresh();
        }
        if (!this.textures.exists('tileCoin')) {
            let tex = this.textures.createCanvas('tileCoin', 40, 40);
            tex.context.fillStyle = '#f1c40f';
            tex.context.beginPath();
            tex.context.arc(20, 20, 12, 0, Math.PI * 2);
            tex.context.fill();
            tex.refresh();
        }
        
        // Texture per il cielo pixelata
        if (!this.textures.exists('skyPixelated')) {
            let tex = this.textures.createCanvas('skyPixelated', 16, 12);
            tex.context.fillStyle = '#a0e0ff';
            tex.context.fillRect(0, 0, 16, 12);
            tex.setFilter(Phaser.Textures.FilterMode.NEAREST);
            tex.refresh();
        }
    }

    create() {
        this.isSceneTransition = false;
        this.levelLength = this.getLevelLength();

        // Prepariamo i componenti grafici
        this.initTextures();

        // Confini fisici del mondo e movimento telecamera
        this.physics.world.setBounds(0, 0, this.levelLength, 600);
        this.cameras.main.setBounds(0, 0, this.levelLength, 600);

        // SFONDO FISSO (Versione Pixelata)
        let sky = this.add.image(0, 0, 'skyPixelated').setOrigin(0,0).setScrollFactor(0);
        sky.setDisplaySize(800, 600);
        
        // Sole vettoriale
        this.add.circle(700, 100, 45, 0xffde22).setScrollFactor(0);

        // EFFETTO PARALLASSE
        this.add.circle(400, 550, 300, 0x27ae60).setScrollFactor(0.2);
        this.add.circle(1200, 580, 400, 0x27ae60).setScrollFactor(0.2);
        this.add.circle(200, 560, 200, 0x2ecc71).setScrollFactor(0.5);
        this.add.circle(800, 570, 250, 0x2ecc71).setScrollFactor(0.5);

        // INIZIALIZZAZIONE GRUPPI FISICI STATICI
        this.groundGroup = this.physics.add.staticGroup();
        this.hazardGroup = this.physics.add.staticGroup();
        this.coinGroup = this.physics.add.staticGroup();

        // Chiamata alla scacchiera logica (Metodo completato dalla sottoclasse)
        this.buildTilemap();

        // Creazione dell'animazione di rotazione per la moneta (2 Frame)
        if (!this.anims.exists('spinCoin')) {
            this.anims.create({
                key: 'spinCoin',
                frames: [{ key: 'tileCoin' }, { key: 'tileCoinSide' }],
                frameRate: 6,
                repeat: -1
            });
        }

        // Creazione animazioni personaggio viola
        if (!this.anims.exists('player_idle')) {
            this.anims.create({
                key: 'player_idle',
                frames: [{ key: 'playerIdle' }],
                frameRate: 1,
                repeat: -1
            });
        }

        if (!this.anims.exists('player_walk')) {
            this.anims.create({
                key: 'player_walk',
                frames: [{ key: 'playerWalkA' }, { key: 'playerWalkB' }],
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.anims.exists('player_jump')) {
            this.anims.create({
                key: 'player_jump',
                frames: [{ key: 'playerJump' }],
                frameRate: 1,
                repeat: -1
            });
        }

        // Ridimensionamento forzato blocchi a 40x40
        this.groundGroup.getChildren().forEach(tile => {
            tile.setDisplaySize(40, 40);
            tile.refreshBody();
        });

        this.hazardGroup.getChildren().forEach(spike => {
            spike.setDisplaySize(40, 40);
            spike.refreshBody();
        });

        this.coinGroup.getChildren().forEach(coin => {
            coin.setDisplaySize(40, 40);
            coin.refreshBody();
            coin.play('spinCoin');
        });

        // TRAGUARDO (Portale Viola)
        this.finishLine = this.add.rectangle(this.levelLength - 100, 350, 30, 200, 0x9b59b6);
        this.finishLine.setOrigin(0,0);
        this.physics.add.existing(this.finishLine, true);

        // GIOCATORE (Inizializzato con dimensioni aumentate a 80x80)
        this.player = this.physics.add.sprite(100, 400, 'playerIdle');
        this.player.setCollideWorldBounds(true);
        this.player.setDisplaySize(80, 80); // Modificato da 40, 40 a 80, 80 secondo richiesta
        this.player.refreshBody();

        // IMPOSTAZIONE GESTIONE FISICA E COLLISIONI
        this.physics.add.collider(this.player, this.groundGroup);
        this.physics.add.overlap(this.player, this.hazardGroup, this.hitObstacle, null, this);
        this.physics.add.overlap(this.player, this.coinGroup, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.finishLine, this.reachFinish, null, this);

        // INSEGUIMENTO TELECAMERA
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cursors = this.input.keyboard.createCursorKeys();

        // TESTO INTERFACCIA UTENTE (UI)
        this.uiText = this.add.text(20, 20, '', { font: 'bold 18px Arial', fill: '#2c3e50' });
        this.uiText.setScrollFactor(0);
        this.updateUI();
    }

    update() {
        if (this.isSceneTransition) return;

        // GESTIONE MOVIMENTO, FLIP GRAFICO E ANIMAZIONI
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-250);
            this.player.setFlipX(true);
            if (this.player.body.touching.down) {
                this.player.play('player_walk', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(250);
            this.player.setFlipX(false);
            if (this.player.body.touching.down) {
                this.player.play('player_walk', true);
            }
        } else {
            this.player.setVelocityX(0);
            if (this.player.body.touching.down) {
                this.player.play('player_idle', true);
            }
        }

        // REGOLA DEL SUPER SALTO POTENZIATO A -750
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-750);
            this.sound.play('jumpSound');
        }

        // Se il personaggio si trova in aria, attiva l'animazione di salto
        if (!this.player.body.touching.down) {
            this.player.play('player_jump', true);
        }

        // VINCOLO CRITICO DIMENSIONI: Mantiene forzatamente la scala a 80x80 ad ogni frame
        this.player.setDisplaySize(80, 80); // Modificato da 40, 40 a 80, 80 secondo richiesta
    }

    updateUI() {
        this.uiText.setText(`LIVELLO: ${window.gameCurrentLevel} / 20\nMONETE: 🪙 ${window.gameTotalCoins}\nPremio Vittoria: 🪙 +15`);
    }

    collectCoin(player, coin) {
        coin.destroy();
        window.gameTotalCoins += 1;
        this.updateUI();
        this.sound.play('coinSound');
    }

    // GESTIONE SCONFITTA
    hitObstacle(player, hazard) {
        if (this.isSceneTransition) return;
        this.isSceneTransition = true;
        this.physics.pause();
        
        this.sound.play('failSound');
        
        if (window.gameCurrentLevel > 1) {
            alert(`GAME OVER! Hai toccato uno spuntone.\nRiprova il Livello ${window.gameCurrentLevel}!`);
            this.scene.restart();
        } else {
            alert("GAME OVER! Hai toccato uno spuntone.\nIl gioco ricomincia da capo!");
            location.reload();
        }
    }

    // VITTORIA E COMPLETARE IL GIOCO AL LIVELLO 20
    reachFinish(player, finish) {
        if (this.isSceneTransition) return;
        this.isSceneTransition = true;
        this.physics.pause();

        this.sound.play('winSound');
        window.gameTotalCoins += 15;

        if (window.gameCurrentLevel === 20) {
            this.updateUI();

            let totalTimeMs = Date.now() - window.gameStartTime;
            let totalSeconds = Math.floor(totalTimeMs / 1000);
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;
            
            let timeFormatted = minutes > 0 ? `${minutes} min e ${seconds} sec` : `${seconds} secondi`;

            let overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.85).setScrollFactor(0).setDepth(100);
            
            let winText = this.add.text(400, 240, "CONGRATULAZIONI!\nHAI COMPLETATO IL GIOCO", {
                font: "bold 34px Arial",
                fill: "#f1c40f",
                align: "center"
            }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

            let statsText = this.add.text(400, 360, `Tempo impiegato: ${timeFormatted}\nMonete finali: 🪙 ${window.gameTotalCoins}\n\n[Clicca ovunque per rigiocare dal Livello 1]`, {
                font: "22px Arial",
                fill: "#ffffff",
                align: "center"
            }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

            this.input.on('pointerdown', () => {
                window.gameCurrentLevel = 1;
                window.gameTotalCoins = 0;
                window.gameStartTime = Date.now();
                location.reload();
            });

        } else {
            alert(`Livello ${window.gameCurrentLevel} Superato!\nHai guadagnato +15 monete.\nSi passa al prossimo livello!`);
            window.gameCurrentLevel++;
            this.scene.restart();
        }
    }

    buildTilemap() {}
}