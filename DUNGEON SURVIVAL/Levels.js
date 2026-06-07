function createLevel(n, fireRate, spawnDelay, speed, max) {
    return class extends BaseLevel {
        constructor() { super(`Level${n}`); }
        create() {
            this.fireRate = fireRate;
            this.spawnDelay = spawnDelay;
            this.enemySpeed = speed;
            this.maxEnemies = max;
            super.create();
        }
        nextLevelTrigger() {
            if (n >= 10) {
                this.physics.pause();
                this.add.text(400, 300, "CAMPIONE!", { fontSize: '60px', fill: '#ff0' }).setOrigin(0.5).setDepth(100);
            } else {
                this.scene.start('TransitionScene', { status: 'WIN', level: n + 1, hp: this.hp, scale: this.player.scaleX });
            }
        }
    };
}

const Level1 = createLevel(1, 450, 2000, 110, 5);
const Level2 = createLevel(2, 420, 1800, 130, 7);
const Level3 = createLevel(3, 400, 1600, 150, 9);
const Level4 = createLevel(4, 380, 1400, 170, 11);
const Level5 = createLevel(5, 350, 1200, 190, 13);
const Level6 = createLevel(6, 320, 1000, 210, 15);
const Level7 = createLevel(7, 300, 900, 230, 18);
const Level8 = createLevel(8, 270, 800, 250, 21);
const Level9 = createLevel(9, 240, 700, 270, 24);
const Level10 = createLevel(10, 200, 600, 320, 30);