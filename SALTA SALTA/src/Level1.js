import { BaseLevel } from './BaseLevel.js';

export class Level1 extends BaseLevel {
    constructor() {
        super('Level1');
    }

    create() {
        this.setupLevel();

        // 1. Sfondo infinito (TileSprite)
        this.bg = this.add.tileSprite(400, 200, 800, 400, 'background').setScale(2);

        // 2. Pavimento fisico (Static Group)
        this.floorGroup = this.physics.add.staticGroup();
        // Creiamo una riga di tile per il pavimento
        for (let x = 0; x < 800; x += 32) {
            this.floorGroup.create(x, 384, 'floor');
        }

        // 3. Giocatore (Sprite invece di rettangolo)
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(1200);

        // Collisione giocatore-pavimento
        this.physics.add.collider(this.player, this.floorGroup);

        // 4. Ostacoli
        this.obstacles = this.physics.add.group();
        
        this.time.addEvent({
            delay: 1500,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });

        // Collisione giocatore-ostacoli
        this.physics.add.collider(this.player, this.obstacles, () => {
            this.triggerGameOver();
        });
    }

    spawnObstacle() {
        if (this.isGameOver) return;
        
        // Spawn dell'ostacolo sopra il livello del pavimento
        let obs = this.physics.add.sprite(850, 350, 'obstacle');
        this.obstacles.add(obs);
        
        obs.body.setAllowGravity(false);
        obs.body.setVelocityX(-400);
    }

    update() {
        if (!this.isGameOver) {
            // Effetto scorrimento sfondo
            this.bg.tilePositionX += 2;

            this.handlePlayerJump(this.player);

            // Pulizia memoria (Clean Code)
            this.obstacles.getChildren().forEach(obs => {
                if (obs.x < -50) obs.destroy();
            });
        }
    }
}