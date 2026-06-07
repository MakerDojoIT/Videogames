// --- STATO GLOBALE DI GIOCO ---
let globalDeaths = 0;
let currentLevelNumber = 1;

// --- 0. SCHERMATA INIZIALE CAPOLAVORO (CYBERPUNK / GD ULTRA STYLE) ---
class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        if (!this.textures.exists('fxDot')) {
            let pDot = this.textures.createCanvas('fxDot', 6, 6);
            pDot.context.fillStyle = '#ffffff';
            pDot.context.fillRect(0, 0, 6, 6);
            pDot.refresh();
        }

        // Generazione procedurale Anello Sci-Fi Esterno (CyberDash tratteggiato)
        if (!this.textures.exists('cyberRingOuter')) {
            let pRing = this.textures.createCanvas('cyberRingOuter', 160, 160);
            pRing.context.strokeStyle = '#38bdf8';
            pRing.context.lineWidth = 4;
            pRing.context.setLineDash([12, 18]); 
            pRing.context.arc(80, 80, 70, 0, Math.PI * 2);
            pRing.context.stroke();
            pRing.refresh();
        }

        // Generazione procedurale Anello Sci-Fi Interno (Puntinato denso)
        if (!this.textures.exists('cyberRingInner')) {
            let pRingIn = this.textures.createCanvas('cyberRingInner', 160, 160);
            pRingIn.context.strokeStyle = '#f43f5e';
            pRingIn.context.lineWidth = 2;
            pRingIn.context.setLineDash([4, 6]); 
            pRingIn.context.arc(80, 80, 52, 0, Math.PI * 2);
            pRingIn.context.stroke();
            pRingIn.refresh();
        }
    }

    create() {
        this.cameras.main.setBackgroundColor('#040712');
        
        this.menuGrid = this.add.grid(400, 300, 1600, 1200, 40, 40, 0x000000, 0, 0x1e1b4b, 0.4);

        this.ambientParticles = this.add.particles('fxDot', {
            x: { min: -100, max: 900 },
            y: -10,
            gravityY: 50,
            speedX: { min: 20, max: 80 },
            scale: { start: 1.5, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 5000,
            frequency: 35,
            blendMode: 'ADD',
            tint: [0x38bdf8, 0xa855f7, 0xf43f5e]
        });

        this.titleMagenta = this.add.text(406, 147, 'CYBER PULSE', { fontFamily: 'Impact, Arial Black', fontSize: '85px', fill: '#f43f5e', fontWeight: 'bold' }).setOrigin(0.5).setAlpha(0.6).setBlendMode('ADD');
        this.titleCyan = this.add.text(394, 153, 'CYBER PULSE', { fontFamily: 'Impact, Arial Black', fontSize: '85px', fill: '#38bdf8', fontWeight: 'bold' }).setOrigin(0.5).setAlpha(0.6).setBlendMode('ADD');
        this.titleMain = this.add.text(400, 150, 'CYBER PULSE', { fontFamily: 'Impact, Arial Black', fontSize: '85px', fill: '#ffffff', fontWeight: 'bold' }).setOrigin(0.5).setStroke('#040712', 10);
        
        let gradient = this.titleMain.context.createLinearGradient(0, 0, 0, 85);
        gradient.addColorStop(0, '#ffffff'); 
        gradient.addColorStop(0.4, '#38bdf8'); 
        gradient.addColorStop(1, '#a855f7'); 
        this.titleMain.setFill(gradient);

        this.subTitle = this.add.text(400, 228, 'H A R D C O R E   E D I T I O N', { fontFamily: 'Courier New', fontSize: '16px', fill: '#10b981', fontWeight: 'bold' }).setOrigin(0.5).setShadow(0, 0, '#10b981', 12, true, true);

        this.tweens.add({
            targets: [this.titleMain, this.titleCyan, this.titleMagenta, this.subTitle],
            y: '+=10',
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.ringOuter = this.add.image(400, 410, 'cyberRingOuter').setBlendMode('ADD').setAlpha(0.9);
        this.ringInner = this.add.image(400, 410, 'cyberRingInner').setBlendMode('ADD').setAlpha(0.7);
        this.btnCore = this.add.circle(400, 410, 38, 0x10b981).setStrokeStyle(3, 0xffffff).setInteractive({ useHandCursor: true });
        this.btnIcon = this.add.triangle(404, 410, 0, -14, 0, 14, 20, 0, 0xffffff);

        this.tweens.add({
            targets: [this.btnCore, this.btnIcon],
            scale: 1.05,
            duration: 450,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.btnCore.on('pointerover', () => {
            this.btnCore.setFillStyle(0x14b8a6); 
            this.ringOuter.setScale(1.1);
            this.ringInner.setScale(0.8);
            this.ambientParticles.setFrequency(8);
        });

        this.btnCore.on('pointerout', () => {
            this.btnCore.setFillStyle(0x10b981);
            this.ringOuter.setScale(1);
            this.ringInner.setScale(1);
            this.ambientParticles.setFrequency(35);
        });

        this.btnCore.on('pointerdown', () => {
            if (this.sound.context && this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
            this.cameras.main.fadeOut(400, 4, 7, 18);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Level1');
            });
        });

        this.add.text(400, 565, '— PRESS PLAY TO ESTABLISH CONNECTION —', { fontFamily: 'Courier New', fontSize: '11px', fill: '#334155', fontWeight: 'bold' }).setOrigin(0.5);
    }

    update(time, delta) {
        this.ringOuter.angle += 0.9;
        this.ringInner.angle -= 1.6;

        this.menuGrid.y += 0.6;
        this.menuGrid.x -= 0.3;
        if (this.menuGrid.y >= 340) this.menuGrid.y = 300;
        if (this.menuGrid.x <= 360) this.menuGrid.x = 400;

        if (Phaser.Math.Between(0, 100) > 96) {
            let offset = Phaser.Math.Between(-6, 6);
            this.titleMagenta.x = 406 + offset;
            this.titleCyan.x = 394 - offset;
        } else {
            this.titleMagenta.x = 406;
            this.titleCyan.x = 394;
        }
    }
}

// --- 1. CLASSE MADRE CORE (OOP ARCHITECTURE) ---
class BaseLevel extends Phaser.Scene {
    constructor(key) {
        super(key);
        this.facesColors = [0x38bdf8, 0xa855f7, 0xf43f5e, 0x10b981, 0xf59e0b];
        this.currentColorIndex = 0;
    }

    init() {
        this.wasGrounded = true;
        this.jumpBufferTime = 0;
        this.JUMP_BUFFER_MS = 150;
        this.isTransitioning = false;
        this.isGameOverActive = false; // Flag per abilitare l'animazione glitch di sottomenu
    }

    preload() {
        if (!this.textures.exists('fxDot')) {
            let pDot = this.textures.createCanvas('fxDot', 6, 6);
            pDot.context.fillStyle = '#ffffff';
            pDot.context.fillRect(0, 0, 6, 6);
            pDot.refresh();
        }

        // CARICAMENTO AUDIO
        this.load.audio('death', 'Asset/Audio/question_001.ogg');
        this.load.audio('spike_death', 'Asset/Audio/close_002.ogg');
        this.load.audio('win', 'Asset/Audio/confirmation_003.ogg');
    }

    // Funzione nativa di sicurezza per la riproduzione audio protetta
    playSafeSound(key, config) {
        try {
            if (this.cache.audio.exists(key)) {
                this.sound.play(key, config);
            }
        } catch(e) {
            console.error(`[Audio Safe Protection] Errore riproduzione risorsa "${key}":`, e);
        }
    }

    create() {
        this.buildLevelLayout();

        this.cameras.main.setBackgroundColor(this.backgroundColor || '#080f18');
        this.physics.world.setBounds(0, 0, this.levelWidth, 600);
        this.cameras.main.setBounds(0, 0, this.levelWidth, 600);

        // Griglia vettoriale di sfondo con effetto parallasse
        this.bgGrid = this.add.grid(400, 300, 3200, 600, 40, 40, 0x000000, 0, 0x1e1b4b, 0.25).setDepth(-5);

        this.grounds = this.physics.add.staticGroup();
        this.platforms = this.physics.add.staticGroup();
        this.spikes = this.physics.add.staticGroup();

        // CONTRASTO DI COLORE: Configurazione indici alternati per il design cromatico
        let initialColor = this.facesColors[this.currentColorIndex];
        let initialPlatformColor = this.facesColors[(this.currentColorIndex + 2) % this.facesColors.length];
        
        // TEXTURE PREMIUM: Terreni con griglia Geometry Dash ad alta densità e finiture neon
        this.levelGrounds.forEach(g => {
            let gridObj = this.add.grid(g.x + g.w/2, g.y + g.h/2, g.w, g.h, 20, 20, initialPlatformColor, 0.9, 0xffffff, 0.45).setStrokeStyle(1, 0xffffff, 0.4);
            this.grounds.add(gridObj);
            this.add.rectangle(g.x + g.w/2, g.y + 1, g.w, 2, 0xffffff).setAlpha(0.6).setBlendMode('ADD');
        });
        
        // TEXTURE PREMIUM: Piattaforme avvolte da una cornice luminosa a 360 gradi
        this.levelPlatforms.forEach(p => {
            let gridObj = this.add.grid(p.x + p.w/2, p.y + p.h/2, p.w, p.h, 20, 20, initialPlatformColor, 0.9, 0xffffff, 0.5).setStrokeStyle(1, 0xffffff, 0.45);
            this.platforms.add(gridObj);
            this.add.rectangle(p.x + p.w/2, p.y + p.h/2, p.w, p.h).setStrokeStyle(2, 0xffffff, 0.85).setBlendMode('ADD');
        });
        
        // GESTIONE SPINE STATICHE
        this.levelSpikes.forEach(s => {
            let spike = this.add.triangle(s.x + 15, s.y + 20, 15, 0, 0, 40, 30, 40, 0xffffff);
            spike.setStrokeStyle(2, 0xf43f5e);
            this.spikes.add(spike);
            
            if (s.flipped) {
                spike.setAngle(180);
                spike.body.setSize(22, 30).setOffset(4, 0); 
            } else {
                spike.body.setSize(22, 30).setOffset(4, 10); 
            }
            spike.body.updateFromGameObject();
        });

        // GESTIONE SPINE MOBILI
        this.movingSpikes = this.physics.add.group({ allowGravity: false, immovable: true });
        if (this.levelMovingSpikes) {
            this.levelMovingSpikes.forEach(ms => {
                let mSpike = this.add.triangle(ms.x + 15, ms.y + 20, 15, 0, 0, 40, 30, 40, 0xffffff);
                mSpike.setStrokeStyle(2, 0xa855f7);
                this.movingSpikes.add(mSpike);
                
                if (ms.flipped) {
                    mSpike.setAngle(180);
                    mSpike.body.setSize(22, 30).setOffset(4, 0);
                } else {
                    mSpike.body.setSize(22, 30).setOffset(4, 10);
                }

                this.tweens.add({
                    targets: mSpike,
                    x: ms.targetX !== undefined ? ms.targetX : mSpike.x,
                    y: ms.targetY !== undefined ? ms.targetY : mSpike.y,
                    duration: ms.duration || 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            });
        }

        // RESTYLING PORTALE DI FINE LIVELLO (NEON GATE)
        let goalData = this.levelGoal;
        this.goal = this.physics.add.staticGroup();
        this.add.rectangle(goalData.x + goalData.w/2, goalData.y + goalData.h/2, goalData.w, goalData.h, 0x050b14).setAlpha(0.85);
        let portalFrame = this.add.rectangle(goalData.x + goalData.w/2, goalData.y + goalData.h/2, goalData.w, goalData.h).setStrokeStyle(3, 0x10b981);
        let portalInnerLine = this.add.rectangle(goalData.x + goalData.w/2, goalData.y + goalData.h/2, goalData.w - 6, goalData.h - 6).setStrokeStyle(1, 0xffffff).setAlpha(0.7);
        this.goal.add(portalFrame);

        this.tweens.add({
            targets: [portalFrame, portalInnerLine],
            alpha: 0.35,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.portalParticles = this.add.particles('fxDot', {
            x: { min: goalData.x + 4, max: goalData.x + goalData.w - 4 },
            y: { min: goalData.y + 10, max: goalData.y + goalData.h - 10 },
            speedY: { min: -50, max: -15 },
            speedX: { min: -10, max: 10 },
            scale: { start: 1.4, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 600,
            frequency: 35,
            blendMode: 'ADD',
            tint: 0x10b981
        });

        // Emettitori particellari nativi del giocatore
        this.trailParticles = this.add.particles('fxDot', {
            speed: 0,
            scale: { start: 1.3, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 220,
            frequency: 6,
            blendMode: 'ADD',
            tint: initialColor
        });

        this.burstParticles = this.add.particles('fxDot', {
            speed: { min: -140, max: 140 },
            angle: { min: 230, max: 310 },
            scale: { start: 1.8, end: 0 },
            lifespan: 280,
            gravityY: 350,
            blendMode: 'ADD',
            emitting: false,
            tint: initialColor
        });

        let playerHitbox = this.add.rectangle(100, 350, 36, 36, 0x000000, 0);
        this.player = this.physics.add.existing(playerHitbox);
        this.player.body.setCollideWorldBounds(true).setMaxVelocity(420, 1200);
        
        this.player.body.setSize(26, 26).setOffset(5, 5);

        this.playerOuter = this.add.rectangle(0, 0, 36, 36, initialColor).setStrokeStyle(2, 0xffffff);
        this.playerInner = this.add.rectangle(0, 0, 12, 12, 0x080f18).setStrokeStyle(1, 0xffffff);
        this.playerContainer = this.add.container(100, 350, [this.playerOuter, this.playerInner]);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        this.physics.add.collider(this.player, this.grounds);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.spikes, this.handlePlayerDeath, null, this);
        this.physics.add.overlap(this.player, this.movingSpikes, this.handlePlayerDeath, null, this);
        this.physics.add.overlap(this.player, this.goal, this.handleLevelComplete, null, this);

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // HUD: Progress bar e scritte
        this.progressBarBg = this.add.rectangle(400, 25, 240, 6, 0x1e293b).setScrollFactor(0).setDepth(10);
        this.progressBar = this.add.rectangle(280, 25, 0, 6, 0x10b981).setScrollFactor(0).setDepth(11).setOrigin(0, 0.5);

        this.UI_Text = this.add.text(20, 15, `LVL: ${currentLevelNumber} | ATTEMPTS: ${globalDeaths}`, {
            fontFamily: 'Courier New',
            fontSize: '16px',
            fill: '#f43f5e',
            fontWeight: 'bold'
        }).setScrollFactor(0).setDepth(10).setStroke('#000000', 4).setShadow(2, 2, '#000000', 2, true, true);
    }

    update(time, delta) {
        // Se la schermata di Game Over è attiva, aggiorna solo l'effetto glitch del testo e ignora il resto
        if (this.isGameOverActive) {
            if (Phaser.Math.Between(0, 100) > 95) {
                let offset = Phaser.Math.Between(-5, 5);
                this.goMagenta.x = 404 + offset;
                this.goCyan.x = 396 - offset;
            } else {
                this.goMagenta.x = 404;
                this.goCyan.x = 396;
            }
            return;
        }

        if (this.isTransitioning) return;

        this.playerContainer.x = this.player.x;
        this.playerContainer.y = this.player.y;

        this.trailParticles.setPosition(this.player.x, this.player.y);

        // Barra di progresso
        let currentProgress = Phaser.Math.Clamp(this.player.x / this.levelWidth, 0, 1);
        this.progressBar.width = currentProgress * 240;

        // Effetto parallasse sullo sfondo grid
        this.bgGrid.x = 400 + (this.cameras.main.scrollX * 0.35);

        if (this.player.y > 555) {
            this.handlePlayerDeath();
            return;
        }

        let speed = 420;
        let leftPressed = this.cursors.left.isDown || (this.keys.A && this.keys.A.isDown);
        let rightPressed = this.cursors.right.isDown || (this.keys.D && this.keys.D.isDown);

        if (leftPressed) {
            this.player.body.setVelocityX(-speed);
        } else if (rightPressed) {
            this.player.body.setVelocityX(speed);
        } else {
            this.player.body.setVelocityX(0);
        }

        let jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || 
                          (this.keys.W && Phaser.Input.Keyboard.JustDown(this.keys.W)) || 
                          (this.keys.SPACE && Phaser.Input.Keyboard.JustDown(this.keys.SPACE));

        if (jumpPressed) {
            this.jumpBufferTime = time;
        }

        if (this.player.body.blocked.down) {
            // FIX BUG ROTAZIONE: Gestiamo prima l'atterraggio
            if (!this.wasGrounded) {
                this.tweens.killTweensOf(this.playerContainer);

                let currentAngle = this.playerContainer.angle;
                let snappedAngle = Math.round(currentAngle / 90) * 90;
                this.playerContainer.setAngle(snappedAngle);

                // JUICE: Deformazione orizzontale elastica all'impatto con il terreno
                this.playerContainer.setScale(1.3, 0.75);
                this.tweens.add({
                    targets: this.playerContainer,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 150,
                    ease: 'Back.easeOut'
                });

                this.currentColorIndex = (this.currentColorIndex + 1) % this.facesColors.length;
                
                let newColor = this.facesColors[this.currentColorIndex];
                let newPlatformColor = this.facesColors[(this.currentColorIndex + 2) % this.facesColors.length];
                
                this.playerOuter.setFillStyle(newColor);
                this.trailParticles.tint = newColor;
                this.burstParticles.tint = newColor;
                this.burstParticles.explode(15, this.player.x, this.player.y + 18);

                // Cambio colore dinamico della proprietà interna .fillColor degli oggetti di tipo Grid
                this.grounds.getChildren().forEach(ground => ground.fillColor = newPlatformColor);
                this.platforms.getChildren().forEach(platform => platform.fillColor = newPlatformColor);
            }

            // Attiviamo la fisica e la rotazione del nuovo salto
            if (time - this.jumpBufferTime < this.JUMP_BUFFER_MS) {
                this.player.body.setVelocityY(-860);
                this.jumpBufferTime = 0;

                // JUICE: Animazione di deformazione verticale all'innesco del salto
                this.playerContainer.setScale(0.75, 1.3);
                this.tweens.add({
                    targets: this.playerContainer,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200,
                    ease: 'Quad.easeOut'
                });

                this.tweens.add({
                    targets: this.playerContainer,
                    angle: this.playerContainer.angle + 180,
                    duration: 300,
                    ease: 'Linear'
                });
            }
        }

        this.wasGrounded = this.player.body.blocked.down;
    }

    // --- EVOLUZIONE RIGIDA: SISTEMA DI COPERTURA E SCHERMATA DI GAME OVER CON GLITCH ---
    handlePlayerDeath(player, spike) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Disattivazione fisica e visibilità immediata del giocatore
        this.player.body.enable = false;
        this.playerContainer.setVisible(false);

        // Controllo della sorgente audio
        if (spike) {
            this.playSafeSound('spike_death', { volume: 0.5 });
        } else {
            this.playSafeSound('death', { volume: 0.5 });
        }

        this.cameras.main.shake(150, 0.01);
        this.burstParticles.explode(25, this.player.x, this.player.y);

        globalDeaths++;

        // Calcolo matematico deterministico della percentuale di completamento raggiunta
        let finalProgressPercent = Math.floor(Phaser.Math.Clamp(this.player.x / this.levelWidth, 0, 1) * 100);

        // Calcolo delle coordinate di rispawn basato sui checkpoint di fascia
        if (currentLevelNumber < 3) {
            currentLevelNumber = 1;
        } else if (currentLevelNumber >= 3 && currentLevelNumber < 5) {
            currentLevelNumber = 3;
        } else {
            currentLevelNumber = 5;
        }

        // INIEZIONE PROCEDURALE SCHERMATA GAME OVER NEON GLITCH
        this.isGameOverActive = true;

        // 1. Pannello scuro di oscuramento a telecamera fissa
        let overlayBg = this.add.rectangle(400, 300, 800, 600, 0x050714, 0.65).setScrollFactor(0).setDepth(100);

        // 2. Canali RGB sdoppiati per l'aberrazione cromatica del Game Over
        this.goMagenta = this.add.text(404, 238, 'GAME OVER', { fontFamily: 'Impact, Arial Black', fontSize: '75px', fill: '#f43f5e', fontWeight: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(101).setBlendMode('ADD');
        this.goCyan = this.add.text(396, 242, 'GAME OVER', { fontFamily: 'Impact, Arial Black', fontSize: '75px', fill: '#38bdf8', fontWeight: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(101).setBlendMode('ADD');
        
        // 3. Testo principale ad alta definizione con gradiente fuoco nativo Canvas
        this.goMain = this.add.text(400, 240, 'GAME OVER', { fontFamily: 'Impact, Arial Black', fontSize: '75px', fill: '#ffffff', fontWeight: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(102).setStroke('#000000', 8);
        let goGrad = this.goMain.context.createLinearGradient(0, 0, 0, 75);
        goGrad.addColorStop(0, '#ffffff');
        goGrad.addColorStop(0.5, '#f43f5e'); // Passaggio al rosa/rosso acceso
        goGrad.addColorStop(1, '#9d174d'); // Fondo scuro cremisi
        this.goMain.setFill(goGrad);

        // 4. Stampa dei progressi Geometry Dash style
        let progressText = this.add.text(400, 315, `PROGRESS: ${finalProgressPercent}%`, { fontFamily: 'Courier New', fontSize: '20px', fill: '#ffffff', fontWeight: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(102).setStroke('#000000', 4).setShadow(0,0,'#ffffff',6,true,true);
        let subRetryText = this.add.text(400, 365, 'PRESS SPACE OR CLICK TO RETRY', { fontFamily: 'Courier New', fontSize: '14px', fill: '#64748b', fontWeight: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(102);

        // Effetto di comparsa elastica ("Juice") del blocco scritte
        this.goMain.setScale(0); this.goCyan.setScale(0); this.goMagenta.setScale(0); progressText.setScale(0); subRetryText.setScale(0);
        this.tweens.add({
            targets: [this.goMain, this.goCyan, this.goMagenta, progressText, subRetryText],
            scale: 1,
            duration: 350,
            ease: 'Back.easeOut'
        });

        // FUNZIONE UNICA DI RECUPERO: Innesca il riavvio immediato ed evita doppie chiamate di scena
        let triggerRetry = () => {
            this.input.keyboard.off('keydown-SPACE');
            this.input.off('pointerdown');
            autoRetryTimer.remove(); // Cancella il timer automatico se si clicca manualmente
            this.scene.start(`Level${currentLevelNumber}`);
        };

        // Aggancio dei listener interattivi per il Fast-Rispawn manuale
        this.input.keyboard.once('keydown-SPACE', triggerRetry);
        this.input.once('pointerdown', triggerRetry);

        // Timer di sicurezza: se l'utente non preme nulla, esegue il rispawn automatico dopo 1.5 secondi
        let autoRetryTimer = this.time.delayedCall(1500, triggerRetry);
    }

    handleLevelComplete() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.player.body.enable = false;

        this.playSafeSound('win', { volume: 0.5 });

        currentLevelNumber++;
        
        this.cameras.main.fadeOut(250, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            if (currentLevelNumber <= 10) {
                this.scene.start(`Level${currentLevelNumber}`);
            } else {
                this.physics.world.pause();
                this.cameras.main.fadeIn(0);
                
                this.add.text(400, 240, '👑 DIVINITÀ DEI PLATFORM!', { fontSize: '40px', fill: '#10b981', fontWeight: 'bold' }).setOrigin(0.5).setScrollFactor(0);
                this.add.text(400, 310, `Completato in ${globalDeaths} tentativi.`, { fontSize: '20px', fill: '#ffffff' }).setOrigin(0.5).setScrollFactor(0);
                this.add.text(400, 370, 'Premi SPAZIO per rigiocare da capo', { fontSize: '16px', fill: '#64748b' }).setOrigin(0.5).setScrollFactor(0);
                
                this.input.keyboard.once('keydown-SPACE', () => {
                    globalDeaths = 0;
                    currentLevelNumber = 1;
                    this.scene.start('Level1');
                });
            }
        });
    }
}

// --- 2. IMPLEMENTAZIONE LIVELLI DIRETTAMENTE BILANCIATI ---
class Level1 extends BaseLevel { constructor() { super('Level1'); } buildLevelLayout() {
    this.levelWidth = 1600;
    this.levelGrounds = [{ x: 0, y: 550, w: 1600, h: 50 }];
    this.levelPlatforms = [{ x: 650, y: 380, w: 80, h: 20 }]; 
    this.levelSpikes = [
        { x: 330, y: 510 }, 
        { x: 675, y: 400, flipped: true }, 
        { x: 900, y: 510 },
        { x: 1130, y: 510 },
        { x: 1320, y: 510 }
    ];
    this.levelGoal = { x: 1500, y: 470, w: 40, h: 80 };
}}

class Level2 extends BaseLevel { constructor() { super('Level2'); } buildLevelLayout() {
    this.levelWidth = 1600;
    this.levelGrounds = [{ x: 0, y: 550, w: 400, h: 50 }, { x: 800, y: 550, w: 200, h: 50 }, { x: 1300, y: 550, w: 300, h: 50 }];
    this.levelPlatforms = [{ x: 480, y: 440, w: 50, h: 20 }, { x: 620, y: 360, w: 50, h: 20 }, { x: 1050, y: 420, w: 120, h: 20 }];
    this.levelSpikes = [
        { x: 230, y: 510 }, 
        { x: 880, y: 510 },
        { x: 1100, y: 380 }, 
        { x: 1400, y: 510 }
    ];
    this.levelGoal = { x: 1500, y: 470, w: 40, h: 80 };
}}

class Level3 extends BaseLevel { constructor() { super('Level3'); } buildLevelLayout() {
    this.levelWidth = 1800;
    this.levelGrounds = [{ x: 0, y: 550, w: 1800, h: 50 }];
    this.levelPlatforms = [{ x: 350, y: 320, w: 1100, h: 20 }];
    this.levelSpikes = [
        { x: 450, y: 510 },
        { x: 480, y: 510 }, 
        { x: 650, y: 340, flipped: true },
        { x: 850, y: 510 },
        { x: 950, y: 340, flipped: true },
        { x: 1150, y: 510 },
        { x: 1180, y: 510 }, 
        { x: 1350, y: 340, flipped: true }
    ];
    this.levelGoal = { x: 1700, y: 470, w: 40, h: 80 };
}}

class Level4 extends BaseLevel { constructor() { super('Level4'); } buildLevelLayout() {
    this.levelWidth = 1800;
    this.levelGrounds = [{ x: 0, y: 550, w: 200, h: 50 }, { x: 1600, y: 550, w: 200, h: 50 }];
    this.levelPlatforms = [
        { x: 300, y: 460, w: 24, h: 20 }, { x: 500, y: 380, w: 24, h: 20 }, { x: 700, y: 300, w: 24, h: 20 },
        { x: 950, y: 300, w: 24, h: 20 }, { x: 1200, y: 380, w: 24, h: 20 }, { x: 1400, y: 460, w: 24, h: 20 }
    ];
    this.levelSpikes = []; 
    this.levelMovingSpikes = [
        { x: 400, y: 500, targetY: 250, duration: 900 },
        { x: 820, y: 200, targetY: 450, duration: 800 },
        { x: 1300, y: 500, targetY: 250, duration: 900 }
    ];
    this.levelGoal = { x: 1700, y: 470, w: 40, h: 80 };
}}

class Level5 extends BaseLevel { constructor() { super('Level5'); } buildLevelLayout() {
    this.levelWidth = 2000;
    this.levelGrounds = [{ x: 0, y: 550, w: 2000, h: 50 }];
    this.levelPlatforms = [{ x: 400, y: 420, w: 100, h: 20 }, { x: 900, y: 420, w: 100, h: 20 }, { x: 1400, y: 420, w: 100, h: 20 }];
    this.levelSpikes = [
        { x: 250, y: 510 },
        { x: 425, y: 440, flipped: true }, 
        { x: 1450, y: 440, flipped: true } 
    ];
    this.levelMovingSpikes = [
        { x: 650, y: 510, targetY: 340, duration: 900 },
        { x: 750, y: 300, targetY: 510, duration: 850 },
        { x: 1150, y: 510, targetY: 300, duration: 800 },
        { x: 1250, y: 300, targetY: 510, duration: 750 }
    ];
    this.levelGoal = { x: 1900, y: 470, w: 40, h: 80 };
}}

class Level6 extends BaseLevel { constructor() { super('Level6'); } buildLevelLayout() {
    this.levelWidth = 2000;
    this.levelGrounds = [{ x: 0, y: 550, w: 300, h: 50 }, { x: 1700, y: 550, w: 300, h: 50 }];
    this.levelPlatforms = [{ x: 400, y: 450, w: 60, h: 20 }, { x: 600, y: 350, w: 60, h: 20 }, { x: 850, y: 250, w: 250, h: 20 }, { x: 1300, y: 380, w: 60, h: 20 }];
    this.levelSpikes = [
        { x: 950, y: 210 } 
    ];
    this.levelMovingSpikes = [
        { x: 720, y: 320, targetX: 800, duration: 800 },
        { x: 1200, y: 480, targetY: 300, duration: 1100 },
        { x: 1500, y: 200, targetY: 500, duration: 900 }
    ];
    this.levelGoal = { x: 1850, y: 470, w: 40, h: 80 };
}}

class Level7 extends BaseLevel { constructor() { super('Level7'); } buildLevelLayout() {
    this.levelWidth = 2200;
    this.levelGrounds = [{ x: 0, y: 550, w: 2200, h: 50 }];
    this.levelPlatforms = [{ x: 300, y: 430, w: 1400, h: 20 }];
    this.levelSpikes = [
        { x: 380, y: 510 }, { x: 450, y: 390 },
        { x: 630, y: 510 }, { x: 700, y: 390 },
        { x: 930, y: 510 }, { x: 1050, y: 390 },
        { x: 1280, y: 510 }, { x: 1350, y: 390 }
    ];
    this.levelMovingSpikes = [
        { x: 1550, y: 510, targetY: 380, duration: 600 },
        { x: 1650, y: 350, targetY: 510, duration: 600 }
    ];
    this.levelGoal = { x: 2050, y: 470, w: 40, h: 80 };
}}

class Level8 extends BaseLevel { constructor() { super('Level8'); } buildLevelLayout() {
    this.levelWidth = 2200;
    this.levelGrounds = [{ x: 0, y: 550, w: 200, h: 50 }, { x: 2000, y: 550, w: 200, h: 50 }];
    this.levelPlatforms = [
        { x: 350, y: 450, w: 24, h: 20 }, { x: 600, y: 450, w: 24, h: 20 }, { x: 850, y: 350, w: 24, h: 20 },
        { x: 1150, y: 350, w: 24, h: 20 }, { x: 1450, y: 450, w: 24, h: 20 }, { x: 1750, y: 450, w: 24, h: 20 }
    ];
    this.levelSpikes = []; 
    this.levelMovingSpikes = [
        { x: 470, y: 510, targetY: 250, duration: 1100 },
        { x: 720, y: 200, targetY: 510, duration: 900 },
        { x: 1000, y: 510, targetY: 200, duration: 1000 },
        { x: 1300, y: 200, targetY: 510, duration: 1000 },
        { x: 1600, y: 510, targetY: 250, duration: 1100 }
    ];
    this.levelGoal = { x: 2100, y: 470, w: 40, h: 80 };
}}

class Level9 extends BaseLevel { constructor() { super('Level9'); } buildLevelLayout() {
    this.levelWidth = 2400;
    this.levelGrounds = [{ x: 0, y: 550, w: 2400, h: 50 }];
    this.levelPlatforms = [{ x: 300, y: 430, w: 150, h: 20 }, { x: 700, y: 320, w: 150, h: 20 }, { x: 1100, y: 430, w: 150, h: 20 }, { x: 1550, y: 320, w: 250, h: 20 }];
    this.levelSpikes = [
        { x: 380, y: 390 },
        { x: 780, y: 280 },
        { x: 1200, y: 390 },
        { x: 1750, y: 280 },
        { x: 320, y: 510 }, { x: 360, y: 510 }, { x: 400, y: 510 },
        { x: 710, y: 510 }, { x: 750, y: 510 }, { x: 790, y: 510 },
        { x: 1120, y: 510 }, { x: 1160, y: 510 }, { x: 1200, y: 510 },
        { x: 1580, y: 510 }, { x: 1620, y: 510 }, { x: 1660, y: 510 }, { x: 1700, y: 510 }
    ];
    this.levelMovingSpikes = [
        { x: 550, y: 510, targetY: 300, duration: 850 },
        { x: 980, y: 510, targetY: 250, duration: 800 },
        { x: 1400, y: 510, targetY: 320, duration: 900 }
    ];
    this.levelGoal = { x: 2200, y: 470, w: 40, h: 80 };
}}

class Level10 extends BaseLevel { constructor() { super('Level10'); } buildLevelLayout() {
    this.levelWidth = 3200;
    this.levelGrounds = [{ x: 0, y: 550, w: 3200, h: 50 }];
    this.levelPlatforms = [
        { x: 250, y: 450, w: 24, h: 20 }, { x: 400, y: 350, w: 24, h: 20 }, { x: 550, y: 250, w: 24, h: 20 },
        { x: 800, y: 360, w: 150, h: 20 }, { x: 1250, y: 440, w: 24, h: 20 }, { x: 1450, y: 340, w: 24, h: 20 },
        { x: 1650, y: 240, w: 24, h: 20 }, { x: 1950, y: 400, w: 400, h: 20 }
    ];
    this.levelSpikes = [
        { x: 180, y: 510 },
        { x: 850, y: 320 }, { x: 930, y: 320 }, 
        { x: 2030, y: 360 }, 
        { x: 2180, y: 360 }, 
        { x: 2330, y: 360 },
        { x: 2830, y: 510 },
        { x: 250, y: 510 }, { x: 285, y: 510 }, { x: 320, y: 510 }, { x: 355, y: 510 }, { x: 390, y: 510 }, { x: 425, y: 510 }, { x: 460, y: 510 }, { x: 495, y: 510 }, { x: 530, y: 510 }, { x: 565, y: 510 }, { x: 600, y: 510 },
        { x: 1250, y: 510 }, { x: 1285, y: 510 }, { x: 1320, y: 510 }, { x: 1355, y: 510 }, { x: 1390, y: 510 }, { x: 1425, y: 510 }, { x: 1460, y: 510 }, { x: 1495, y: 510 }, { x: 1530, y: 510 }, { x: 1565, y: 510 }, { x: 1600, y: 510 }, { x: 1635, y: 510 }, { x: 1670, y: 510 }
    ];
    this.levelMovingSpikes = [
        { x: 670, y: 510, targetY: 200, duration: 1000 },
        { x: 1100, y: 510, targetY: 300, duration: 850 },
        { x: 1800, y: 510, targetY: 220, duration: 1100 },
        { x: 2550, y: 510, targetY: 320, duration: 600 },
        { x: 2650, y: 200, targetY: 510, duration: 750 }
    ];
    this.levelGoal = { x: 3050, y: 470, w: 40, h: 80 };
}}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 2200 }, debug: false }
    },
    scene: [MainMenu, Level1, Level2, Level3, Level4, Level5, Level6, Level7, Level8, Level9, Level10]
};

const game = new Phaser.Game(config);