class BaseLevel extends Phaser.Scene {
    constructor(key) { super(key); }

    init(data) {
        // Protezione: se data è undefined, usa un oggetto vuoto
        const config = data || {};
        this.hp = config.hp !== undefined ? config.hp : 100;
        this.playerScale = config.scale || 1;
        this.levelNumber = config.level || 1;
        this.xp = 0;
        this.isGameOver = false;
        
        // MODIFICA: L'obiettivo aumenta di 5 pallini (100 XP) per ogni livello
        this.xpGoal = this.levelNumber * 100; 
        
        this.invulnerable = false; // Stato per i-frames
    }

    preload() {
        const path = 'Assets/Sprites/';
        
        // Caricamento Immagini
        this.load.image('bg_smoke', `${path}blackSmoke00.png`); 
        
        // MODIFICA: Caricamento Suoni (Assicurati che i file siano nella cartella principale)
        this.load.audio('hit_sound', 'impactPunch_medium_003.ogg');
        this.load.audio('gem_sound', 'beltHandle1.ogg');

        const draw = (name, color, size) => {
            if (this.textures.exists(name)) return;
            let canvas = this.textures.createCanvas(name, size, size);
            canvas.context.fillStyle = color;
            canvas.context.fillRect(0, 0, size, size);
            canvas.refresh();
        };
        draw('playerTex', '#00ff00', 32);
        draw('bulletTex', '#ffff00', 12);
        draw('gemTex', '#00ffff', 10);

        // Caricamento nemici
        for (let i = 14; i <= 23; i++) {
            this.load.image(`smoke_${i}`, `${path}blackSmoke${i}.png`);
        }
    }

    create() {
        this.createEnvironment();

        this.player = this.physics.add.sprite(400, 300, 'playerTex').setScale(this.playerScale);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10); 

        this.enemies = this.physics.add.group();
        this.bullets = this.physics.add.group();
        this.gems = this.physics.add.group();

        this.hpText = this.add.text(20, 20, `HP: ${Math.floor(this.hp)}`, { fontSize: '20px', fill: '#fff' }).setDepth(100);
        
        // MODIFICA UI: Mostra il conteggio gemme attuale rispetto all'obiettivo
        this.levelText = this.add.text(20, 50, `LIVELLO: ${this.levelNumber} (Gems: ${this.xp/20}/${this.xpGoal/20})`, { 
            fontSize: '20px', 
            fill: '#fff' 
        }).setDepth(100);

        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
        this.arrowKeys = this.input.keyboard.createCursorKeys();

        this.physics.add.overlap(this.player, this.enemies, this.takeDamage, null, this);
        this.physics.add.overlap(this.bullets, this.enemies, this.killEnemy, null, this);
        this.physics.add.overlap(this.player, this.gems, this.collectGem, null, this);

        this.lastFireTime = 0;
        this.lastSpawnTime = 0;
    }

    createEnvironment() {
        if (this.textures.exists('bg_smoke')) {
            let background = this.add.image(400, 300, 'bg_smoke');
            background.setDepth(-2).setScale(3.5).setAlpha(0.15).setTint(0x555555);
        }
    }

    update(time) {
        if (this.isGameOver) return;

        this.player.setVelocity(0);
        if (this.wasd.A.isDown) this.player.setVelocityX(-220);
        if (this.wasd.D.isDown) this.player.setVelocityX(220);
        if (this.wasd.W.isDown) this.player.setVelocityY(-220);
        if (this.wasd.S.isDown) this.player.setVelocityY(220);

        if (time > this.lastFireTime + this.fireRate) {
            if (this.arrowKeys.left.isDown) this.shoot(-1, 0);
            else if (this.arrowKeys.right.isDown) this.shoot(1, 0);
            else if (this.arrowKeys.up.isDown) this.shoot(0, -1);
            else if (this.arrowKeys.down.isDown) this.shoot(0, 1);
        }

        if (time > this.lastSpawnTime + this.spawnDelay) {
            this.spawnEnemy();
            this.lastSpawnTime = time;
        }

        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active) {
                this.physics.moveToObject(enemy, this.player, this.enemySpeed);
                if (enemy.x < -150 || enemy.x > 950 || enemy.y < -150 || enemy.y > 750) enemy.destroy();
            }
        });
    }

    shoot(dirX, dirY) {
        let b = this.bullets.create(this.player.x, this.player.y, 'bulletTex');
        b.setVelocity(dirX * 550, dirY * 550);
        b.setDepth(5);
        this.lastFireTime = this.time.now;
        this.time.delayedCall(1500, () => { if(b.active) b.destroy(); });
    }

    spawnEnemy() {
        if (this.enemies.countActive() >= this.maxEnemies) return;
        let x = Phaser.Math.Between(0, 800);
        let y = Phaser.Math.Between(0, 600);
        if (Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) < 200) return;

        const n = Phaser.Math.Between(14, 23);
        let enemy = this.enemies.create(x, y, `smoke_${n}`);
        
        if (enemy) {
            enemy.setTint(0x00ffff).setScale(0.8).setAlpha(1).setDepth(2);
            const hitboxRadius = enemy.width * 0.4;
            enemy.body.setCircle(hitboxRadius, (enemy.width/2 - hitboxRadius), (enemy.height/2 - hitboxRadius));
        }
    }

    killEnemy(bullet, enemy) {
        // MODIFICA: Riproduce il suono dell'impatto medio
        if (this.cache.audio.exists('hit_sound')) {
            this.sound.play('hit_sound', { volume: 0.4 });
        }
        this.createPuff(enemy.x, enemy.y);
        bullet.destroy();
        this.gems.create(enemy.x, enemy.y, 'gemTex').setDepth(2);
        enemy.destroy();
        this.player.setScale(this.player.scaleX + 0.02);
    }

    createPuff(x, y) {
        const n = Phaser.Math.Between(14, 23);
        const emitter = this.add.particles(x, y, `smoke_${n}`, {
            speed: { min: 40, max: 80 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.7, end: 0 },
            lifespan: 500,
            stopAfter: 8
        });
        emitter.setDepth(20);
        this.time.delayedCall(600, () => emitter.destroy());
    }

    collectGem(player, gem) {
        // MODIFICA: Riproduce il suono della gemma
        if (this.cache.audio.exists('gem_sound')) {
            this.sound.play('gem_sound', { volume: 0.5 });
        }

        gem.destroy();
        this.xp += 20;
        
        // Aggiorna il testo a video
        this.levelText.setText(`LIVELLO: ${this.levelNumber} (Gems: ${this.xp/20}/${this.xpGoal/20})`);
        
        if (this.xp >= this.xpGoal) this.nextLevelTrigger();
    }

    takeDamage() {
        if (this.invulnerable || this.isGameOver) return;

        this.invulnerable = true;
        this.hp -= 10;
        this.hpText.setText(`HP: ${Math.max(0, Math.floor(this.hp))}`);
        
        this.player.setTint(0xff0000);
        
        this.tweens.add({
            targets: this.player,
            alpha: 0.2,
            duration: 100,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                if (this.player.active) {
                    this.player.alpha = 1;
                    this.player.clearTint();
                    this.invulnerable = false;
                }
            }
        });

        if (this.hp <= 0) {
            this.isGameOver = true;
            this.scene.start('TransitionScene', { status: 'GAME OVER', level: 1 });
        }
    }
}