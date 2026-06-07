// 1. Configurazione Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// GESTIONE AUDIO DELLA BATTAGLIA
const battagliaMusica = new Audio("assets/battaglia.mp3");
battagliaMusica.loop = false; 
battagliaMusica.volume = 0.4; 
let musicaIniziata = false;

// EFFETTI SONORI (DANNO E ATTACCO)
const dannoSuono = new Audio("assets/danno.mp3");
dannoSuono.volume = 0.6;

const attaccoSuono = new Audio("assets/attacco.mp3");
attaccoSuono.volume = 0.6; 

// Monitora il tempo della traccia e taglia il silenzio finale per un loop perfetto
battagliaMusica.addEventListener("timeupdate", function() {
    const bufferFinestra = 0.3; 
    if (this.currentTime > this.duration - bufferFinestra) {
        this.currentTime = 0;
        this.play().catch(e => console.log("Errore nel riavvio del loop audio."));
    }
});

function avviaMusica() {
    if (!musicaIniziata) {
        battagliaMusica.play().catch(e => console.log("Audio bloccato dalle policy del browser."));
        musicaIniziata = true;
    }
}

// 2. Immagine Boss e Punti Vita del Boss
const bossImage = new Image();
bossImage.src = "assets/logo.png"; 
let bossPronto = false;
bossImage.onload = function() { bossPronto = true; };

let bossHp = 300;          
let bossMaxHp = 300;
let vittoria = false;     
let mostraBossHpTimer = 0; 
let dannoVisualizzato = 0; 

// 3. Strutture di base
const arena = { x: 175, y: 180, width: 250, height: 250 };

const player = { 
    x: 290, y: 280, width: 16, height: 16, speed: 4,
    velocityY: 0, gravity: 0.25, jumpForce: -5.5, onGround: false,
    colore: "red" 
};

// 4. STATO DEL GIOCO
let statoGioco = "SCHERMATA_INIZIALE"; 
let turnoTimer = 0;      
let menuSelezione = 0;   
let numeroTurno = 1;     
let attaccoAttuale = 1; 
let testoDojo = "* Il Dojo ti osserva..."; 

let pulsazioneMenuCuore = 0;

// VARIABILI PER INVENTARIO E SOTTOMENU ITEM
let inventario = [
    { nome: "Torta Arachidi", cura: 20 },
    { nome: "Fiocco di Neve", cura: 10 },
    { nome: "Noodles Istant", cura: 5 }
];
let itemSelezioneIndice = 0; 

// VARIABILI MINIGIOCO ATTACCO (FIGHT)
const fightMinigame = {
    x: 185, y: 280, width: 230, height: 50,
    barX: 185, speed: 5, direction: 1
};
let haGiaAttaccato = false; 

// Statistiche Giocatore
let hp = 20;               
let maxHp = 20;
let gameOver = false;
let invincibile = false;   
let invincibileTimer = 0;  

// 5. Array proiettili e attacchi
let bullets = [];
let particles = []; 
let lasers = [];         
let warnings = []; 
let bouncingBullets = []; 
let groundObstacles = []; 
let platforms = [];       

// VARIABILI ATTACCHI SPECIALI
let laserRotanteAngolo = 0;
let laserRotanteVerso = 1; 
let laserRotanteAttivo = false;
let laserRotanteTimer = 0;
let microRainTimer = 0;

// VARIABILI ATTACCO 7
let pernoSX = { x: 175, y: 305 }; 
let pernoDX = { x: 425, y: 305 }; 
let laserDiagonaleSX = { angolo: -Math.PI / 3, speed: 0.009 }; 
let laserDiagonaleDX = { angolo: -Math.PI * 2 / 3, speed: -0.009 };
let fagioloTimer = 0;

let bulletTimer = 0;
let laserTimer = 0;        
let obstacleTimer = 0;

let pavimentoDannoDelay = 0;

// --- NUOVE VARIABILI PER LA LAVA CHE SALE ---
let altezzaLavaCorrente = 8; // Parte dall'altezza minima standard di 8 pixel
const altezzaLavaMassima = 75; // La lava non salirà oltre i 75 pixel per lasciare spazio di gioco

// 6. Gestione Tasti e Input
const keys = {};
window.addEventListener("keydown", (e) => { 
    if (e.repeat) return; 
    keys[e.key] = true; 
    
    if (!vittoria && !gameOver) {
        if (statoGioco === "SCHERMATA_INIZIALE") {
            if (e.key === "Enter" || e.key === "z") {
                avviaMusica(); 
                statoGioco = "MENU"; 
            }
            return;
        }

        if (statoGioco === "MENU") {
            if (e.key === "ArrowRight") menuSelezione = (menuSelezione + 1) % 4;
            if (e.key === "ArrowLeft") menuSelezione = (menuSelezione - 1 + 4) % 4;
            
            if (e.key === "Enter" || e.key === "z") {
                eseguiAzioneMenu();
            }
        } 
        else if (statoGioco === "SOTTOMENU_ITEM") {
            if (e.key === "ArrowDown" && inventario.length > 0) {
                itemSelezioneIndice = (itemSelezioneIndice + 1) % inventario.length;
            }
            if (e.key === "ArrowUp" && inventario.length > 0) {
                itemSelezioneIndice = (itemSelezioneIndice - 1 + inventario.length) % inventario.length;
            }
            if (e.key === "x") { 
                statoGioco = "MENU";
            }
            if (e.key === "Enter" || e.key === "z") {
                usaCiboDallInventario();
            }
        }
        else if (statoGioco === "MINIGIOCO_FIGHT") {
            if ((e.key === "Enter" || e.key === "z") && !haGiaAttaccato) {
                haGiaAttaccato = true; 
                keys[e.key] = false; 
                calcolaDannoAttacco();
            }
        }
        else if (statoGioco === "DIFESA" && (attaccoAttuale === 5 || attaccoAttuale === 6 || attaccoAttuale === 8)) {
            if ((e.key === "ArrowUp" || e.key === "w") && player.onGround) {
                player.velocityY = player.jumpForce;
                player.onGround = false;
            }
        }
    }
});
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

window.addEventListener("click", () => { 
    if (statoGioco !== "SCHERMATA_INIZIALE") avviaMusica(); 
});

// 7. LOGICA DELLE AZIONI DEL MENU
function eseguiAzioneMenu() {
    if (menuSelezione === 0) { // FIGHT
        haGiaAttaccato = false; 
        fightMinigame.barX = fightMinigame.x; 
        fightMinigame.direction = 1;
        fightMinigame.y = arena.y + (arena.height / 2) - 25;
        fightMinigame.speed = (bossHp < 90) ? 6.5 : 5; 
        statoGioco = "MINIGIOCO_FIGHT";
        return; 
    } 
    else if (menuSelezione === 1) { // ACT (CHECK)
        testoDojo = "* THE DOJO - ATK 5 DEF 10\n* Un'antica struttura fatta di righe di codice.\n* Sembra del tutto impassibile.";
        if (bossHp < 90) testoDojo += "\n* Il Dojo sta tremando selvaggiamente!";
        statoGioco = "DISEGNA_TESTO_MENU"; 
        setTimeout(() => { if (!vittoria) iniziaTurnoDifesa(); }, 2500); 
    } 
    else if (menuSelezione === 2) { // ITEM
        if (inventario.length > 0) {
            itemSelezioneIndice = 0;
            statoGioco = "SOTTOMENU_ITEM"; 
        } else {
            testoDojo = "* Controlli nelle tasche...\n* Ma non hai più niente da mangiare!";
            statoGioco = "DISEGNA_TESTO_MENU"; 
            setTimeout(() => { if (!vittoria) iniziaTurnoDifesa(); }, 1500);
        }
    } 
    else if (menuSelezione === 3) { // MERCY
        testoDojo = "* Non puoi ancora risparmiarlo!\n* Devi ridurre i suoi HP prima.";
        statoGioco = "DISEGNA_TESTO_MENU"; 
        setTimeout(() => { if (!vittoria) iniziaTurnoDifesa(); }, 1500); 
    }
}

function usaCiboDallInventario() {
    if (inventario.length === 0) return;

    const ciboScelto = inventario[itemSelezioneIndice];
    hp += ciboScelto.cura;
    if (hp > maxHp) hp = maxHp;

    testoDojo = "* Hai mangiato " + ciboScelto.nome + "!\n* Hai recuperato " + ciboScelto.cura + " HP.";
    
    inventario.splice(itemSelezioneIndice, 1);
    itemSelezioneIndice = 0;

    statoGioco = "DISEGNA_TESTO_MENU";
    setTimeout(() => { if (!vittoria) iniziaTurnoDifesa(); }, 2000);
}

function calcolaDannoAttacco() {
    attaccoSuono.currentTime = 0;
    attaccoSuono.play().catch(e => console.log("Audio dell'attacco bloccato dal browser."));

    const centroMinigioco = fightMinigame.x + fightMinigame.width / 2;
    const centroBarra = fightMinigame.barX;
    const distancesModificata = Math.abs(centroMinigioco - centroBarra);
    
    let danno = 0;
    if (distancesModificata < 12) { danno = 25; testoDojo = "* COLPO CRITICO! GENIALE! SUBISCE " + danno + " DANNI!"; }
    else if (distancesModificata < 45) { danno = 15; testoDojo = "* Ottimo colpo! Il Dojo subisce " + danno + " danni."; }
    else if (distancesModificata < 90) { danno = 8; testoDojo = "* Colpito di striscio. Subisce " + danno + " danni."; }
    else { danno = 2; testoDojo = "* Mancato! Quasi nessun danno (" + danno + ")."; }

    bossHp -= danno; dannoVisualizzato = danno;
    if (bossHp <= 0) bossHp = 0;

    mostraBossHpTimer = 180; 
    statoGioco = "DISEGNA_TESTO_MENU"; 

    setTimeout(() => {
        if (bossHp <= 0) {
            vittoria = true; 
            battagliaMusica.pause();
        }
        else iniziaTurnoDifesa();
    }, 3000);
}

function iniziaTurnoDifesa() {
    statoGioco = "DIFESA";
    turnoTimer = 450; 
    
    attaccoAttuale = Math.floor(Math.random() * 8) + 1;

    // Resetta l'altezza della lava all'inizio di ogni turno difensivo
    altezzaLavaCorrente = 8;

    if (attaccoAttuale === 5 || attaccoAttuale === 8) {
        player.colore = "blue"; 
        arena.y = 330;       
        arena.height = 100;  
        player.x = arena.x + arena.width / 2 - 8;
        player.y = arena.y + arena.height - player.height - 2;
        player.onGround = true;
    } else if (attaccoAttuale === 6) {
        player.colore = "blue";
        arena.y = 180;
        arena.height = 250;
        
        player.x = arena.x + arena.width / 2 - 8;
        player.y = arena.y + 90; 
        player.onGround = false;
        
        pavimentoDannoDelay = 30; 
    } else {
        player.colore = "red";  
        arena.y = 180;       
        arena.height = 250;  
        player.x = arena.x + arena.width / 2 - 8;
        player.y = arena.y + arena.height / 2 - 8;
        player.onGround = false;
    }

    player.onGround = false;
    player.velocityY = 0;
    
    bullets = []; lasers = []; warnings = []; particles = []; groundObstacles = []; platforms = []; bouncingBullets = [];
    bulletTimer = 0; laserTimer = 0; microRainTimer = 0; obstacleTimer = 0; fagioloTimer = 0;
    
    laserRotanteTimer = 0;
    laserRotanteAttivo = false;
    laserRotanteAngolo = Math.random() * Math.PI * 2; 
    laserRotanteVerso = Math.random() < 0.5 ? 1 : -1; 

    let fattoreVelocita = (bossHp < 90) ? 1.25 : 1;
    laserDiagonaleSX.angolo = -Math.PI / 3;
    laserDiagonaleSX.speed = 0.009 * fattoreVelocita; 
    laserDiagonaleDX.angolo = -Math.PI * 2 / 3;
    laserDiagonaleDX.speed = -0.009 * fattoreVelocita; 

    if (attaccoAttuale === 6) {
        platforms.push({
            x: arena.x + arena.width / 2 - 27,
            y: arena.y + 110,
            width: 55,
            height: 8,
            speedY: 0.6
        });
    }
}

function iniziaTurnoPlayer() {
    haGiaAttaccato = false;
    statoGioco = "MENU";
    numeroTurno++; 
    player.colore = "red"; 
    
    arena.y = 180;
    arena.height = 250;

    player.x = arena.x + arena.width / 2 - 8;
    player.y = arena.y + arena.height / 2 - 8;

    testoDojo = (bossHp < 90) ? "* Il Caos del Dojo si intensifica!!!" : "* Il Dojo si riorganizza...";
}

function explodeBullet(bulletX, bulletY) {
    for (let i = 0; i < 4; i++) {
        particles.push({
            x: bulletX, y: bulletY, width: 5, height: 5,
            speedX: (i === 0 || i === 1 ? -1.2 : 1.2) * (0.3 + Math.random() * 0.7),
            speedY: -3.5 - Math.random() * 2, gravity: 0.12 
        });
    }
}

function wrapText(text, x, y, maxWidth, lineHeight) {
    let righeIntere = text.split('\n');
    let currentY = y;

    for (let i = 0; i < righeIntere.length; i++) {
        let parole = righeIntere[i].split(' ');
        let lineaCorrente = '';

        for (let n = 0; n < parole.length; n++) {
            let testLinea = lineaCorrente + parole[n] + ' ';
            let metrics = ctx.measureText(testLinea);
            let testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(lineaCorrente, x, currentY);
                lineaCorrente = parole[n] + ' ';
                currentY += lineHeight;
            } else {
                lineaCorrente = testLinea;
            }
        }
        ctx.fillText(lineaCorrente, x, currentY);
        currentY += lineHeight;
    }
}

function prendiDanno(quantita) {
    if (!invincibile && !gameOver && !vittoria) {
        hp -= quantita;
        
        dannoSuono.currentTime = 0;
        dannoSuono.play().catch(e => console.log("Audio del danno bloccato dal browser."));

        if (hp <= 0) { 
            hp = 0; 
            gameOver = true; 
            battagliaMusica.pause(); 
        }
        else { invincibile = true; invincibileTimer = 60; }
    }
}

// 8. UPDATE
function update() {
    if (gameOver || vittoria) return;

    if (statoGioco === "SCHERMATA_INIZIALE") {
        pulsazioneMenuCuore += 0.07;
        return;
    }

    if (statoGioco === "DISEGNA_TESTO_MENU") return;

    if (mostraBossHpTimer > 0) mostraBossHpTimer--;

    if (statoGioco === "MINIGIOCO_FIGHT" && !haGiaAttaccato) {
        fightMinigame.barX += fightMinigame.speed * fightMinigame.direction;
        if (fightMinigame.barX + 6 > fightMinigame.x + fightMinigame.width || fightMinigame.barX < fightMinigame.x) {
            fightMinigame.direction *= -1;
        }
    }

    if (statoGioco === "DIFESA") {
        turnoTimer--;
        if (turnoTimer <= 0) { iniziaTurnoPlayer(); return; }

        let spdMult = (bossHp < 90) ? 1.25 : 1; 

        if (player.colore === "red") {
            if (keys["ArrowUp"] || keys["w"]) player.y -= player.speed;
            if (keys["ArrowDown"] || keys["s"]) player.y += player.speed;
        } else {
            player.velocityY += player.gravity;
            player.y += player.velocityY;
            
            // MODIFICATO: Il pavimento solido dell'arena ora si alza dinamicamente inseguendo la lava (solo se attacco 6)
            let limitePavimento = arena.y + arena.height - player.height;
            if (attaccoAttuale === 6) {
                limitePavimento = arena.y + arena.height - altezzaLavaCorrente - player.height;
            }

            if (player.y >= limitePavimento) {
                player.y = limitePavimento;
                player.velocityY = 0;
                player.onGround = true;
            }
        }
        
        if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
        if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;

        if (player.x < arena.x) player.x = arena.x;
        if (player.x + player.width > arena.x + arena.width) player.x = arena.x + arena.width - player.width;
        if (player.y < arena.y) player.y = arena.y;
        
        // Calibra il blocco inferiore del giocatore in base all'altezza della lava corrente
        let fondoArenaDinamico = arena.y + arena.height - player.height;
        if (attaccoAttuale === 6) fondoArenaDinamico = arena.y + arena.height - altezzaLavaCorrente - player.height;
        if (player.y > fondoArenaDinamico) player.y = fondoArenaDinamico;

        if (attaccoAttuale === 1) {
            bulletTimer += spdMult;
            if (bulletTimer > 35) {
                bullets.push({ x: arena.x + Math.random() * (arena.width - 12), y: arena.y, width: 12, height: 12, speed: 3 * spdMult });
                bulletTimer = 0;
            }
        } 
        else if (attaccoAttuale === 2) {
            laserTimer += spdMult;
            if (laserTimer > 20) {
                warnings.push({ y: arena.y + Math.random() * (arena.height - 10), parteDaSinistra: Math.random() < 0.5, timer: 25 / spdMult, tipo: "normale" });
                laserTimer = 0;
            }
        } 
        else if (attaccoAttuale === 3) {
            bulletTimer += spdMult;
            if (bulletTimer > 50) {
                bouncingBullets.push({
                    x: arena.x + Math.random() * (arena.width - 14), y: arena.y,
                    width: 14, height: 14, speedX: (Math.random() < 0.5 ? 2 : -2) * spdMult, speedY: 3 * spdMult, bounces: 0
                });
                bulletTimer = 0;
            }
        } 
        else if (attaccoAttuale === 4) {
            laserRotanteTimer++;
            if (laserRotanteTimer === 1) laserRotanteAttivo = false;
            if (laserRotanteTimer === 50) laserRotanteAttivo = true;
            if (laserRotanteAttivo) laserRotanteAngolo += 0.025 * laserRotanteVerso * spdMult;

            microRainTimer += spdMult;
            if (microRainTimer > 18) { 
                particles.push({
                    x: arena.x + Math.random() * (arena.width - 5), y: arena.y,
                    width: 5, height: 5, speedX: 0, speedY: (2 + Math.random() * 2) * spdMult, gravity: 0 
                });
                microRainTimer = 0;
            }
        } 
        else if (attaccoAttuale === 5) {
            obstacleTimer += spdMult;
            if (obstacleTimer > 60) { 
                const daSinistra = Math.random() < 0.5;
                const numeroProiettiliImpilati = Math.floor(Math.random() * 3) + 1; 
                const altezzaTotale = numeroProiettiliImpilati * 12;

                groundObstacles.push({
                    x: daSinistra ? arena.x - 20 : arena.x + arena.width,
                    y: arena.y + arena.height - altezzaTotale,
                    width: 12, height: altezzaTotale,
                    speedX: (daSinistra ? 4.2 : -4.2) * spdMult,
                    conteggio: numeroProiettiliImpilati 
                });
                obstacleTimer = 0;
            }
        }
        else if (attaccoAttuale === 6) {
            if (pavimentoDannoDelay > 0) pavimentoDannoDelay--;

            // --- INSERITO: La lava sale lentamente ad ogni frame (0.13 pixel per frame) ---
            if (altezzaLavaCorrente < altezzaLavaMassima) {
                altezzaLavaCorrente += 0.13 * spdMult; // Sale leggermente più veloce se in Rage
            }

            obstacleTimer++;
            if (obstacleTimer > 30) { 
                platforms.push({
                    x: arena.x + Math.random() * (arena.width - 55), y: arena.y - 10,
                    width: 55, height: 8, speedY: 1.6 * spdMult 
                });
                obstacleTimer = 0;
            }
            
            // MODIFICATO: Controllo del danno basato sull'altezza corrente e dinamica della lava
            if (player.y >= arena.y + arena.height - altezzaLavaCorrente - player.height && pavimentoDannoDelay === 0) {
                prendiDanno(1);
            }
        }
        else if (attaccoAttuale === 7) {
            laserDiagonaleSX.angolo += laserDiagonaleSX.speed;
            laserDiagonaleDX.angolo += laserDiagonaleDX.speed;

            if (laserDiagonaleSX.angolo > Math.PI / 3 || laserDiagonaleSX.angolo < -Math.PI / 3) laserDiagonaleSX.speed *= -1;
            if (laserDiagonaleDX.angolo > -Math.PI * 2 / 3 || laserDiagonaleDX.angolo < -Math.PI * 4 / 3) laserDiagonaleDX.speed *= -1;

            fagioloTimer += spdMult;
            if (fagioloTimer > 14) {
                const daSinistra = Math.random() < 0.5;
                particles.push({
                    x: daSinistra ? arena.x - 15 : arena.x + arena.width,
                    y: arena.y + 15 + Math.random() * (arena.height - 35),
                    width: 16, height: 6,
                    speedX: (daSinistra ? 3.2 : -3.2) * spdMult,
                    speedY: 0, gravity: 0, isFagiolo: true 
                });
                fagioloTimer = 0;
            }
        }
        else if (attaccoAttuale === 8) {
            obstacleTimer++;
            if (obstacleTimer === 1 || obstacleTimer === 120 || obstacleTimer === 240) {
                const zonaPericolosa = Math.random() < 0.5 ? "sinistra" : "destra"; 
                warnings.push({ x: zonaPericolosa === "sinistra" ? arena.x : arena.x + 125, width: 125, timer: 50 / spdMult, tipo: "terremoto" });
            }
            if (obstacleTimer > 350) obstacleTimer = 0;
        }

        updateAttacchi();
    } 
    
    if (invincibile) { invincibileTimer--; if (invincibileTimer <= 0) invincibile = false; }
}

function updateAttacchi() {
    for (let i = 0; i < warnings.length; i++) {
        warnings[i].timer--;
        if (warnings[i].timer <= 0) {
            let spdMult = (bossHp < 90) ? 1.25 : 1;
            if (warnings[i].tipo === "normale") {
                lasers.push({ x: arena.x - 60, y: warnings[i].y, width: 60, height: 10, speedX: 8 * spdMult, speedY: 0, tipo: "azzurro" });
            }
            else if (warnings[i].tipo === "terremoto") {
                lasers.push({ x: warnings[i].x, y: arena.y, width: warnings[i].width, height: arena.height, speedX: 0, speedY: 0, timerVita: 40, tipo: "sismico" });
            }
            warnings.splice(i, 1); i--;
        }
    }

    bullets.forEach((b, i) => {
        b.y += b.speed;
        if (checkCollision(b, player)) { prendiDanno(4); bullets.splice(i, 1); }
        else if (b.y > arena.y + arena.height - b.height) { explodeBullet(b.x, b.y); bullets.splice(i, 1); }
    });

    for (let i = 0; i < lasers.length; i++) {
        let l = lasers[i];
        if (l.tipo === "azzurro") {
            l.x += l.speedX;
            if (checkCollision(l, player)) { prendiDanno(5); lasers.splice(i, 1); i--; continue; }
            if (l.x > canvas.width) { lasers.splice(i, 1); i--; }
        } 
        else if (l.tipo === "sismico") {
            l.timerVita--;
            if (checkCollision(l, player)) { prendiDanno(3); } 
            if (l.timerVita <= 0) { lasers.splice(i, 1); i--; }
        }
    }

    particles.forEach((p, i) => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.gravity !== 0) p.speedY += p.gravity;
        if (checkCollision(p, player)) { prendiDanno(2); particles.splice(i, 1); }
        else if (p.y > arena.y + arena.height + 10 || p.y < arena.y - 10 || p.x < arena.x - 20 || p.x > arena.x + arena.width + 20) { 
            particles.splice(i, 1); 
        }
    });

    bouncingBullets.forEach((bb, i) => {
        bb.x += bb.speedX; bb.y += bb.speedY;
        if (bb.x <= arena.x || bb.x + bb.width >= arena.x + arena.width) { bb.speedX *= -1; bb.bounces++; }
        if (bb.y + bb.height >= arena.y + arena.height) { bb.speedY *= -1; bb.bounces++; }
        if (bb.y <= arena.y && bb.speedY < 0) { bb.speedY *= -1; bb.bounces++; }
        if (checkCollision(bb, player)) { prendiDanno(4); bouncingBullets.splice(i, 1); return; }
        if (bb.bounces > 4) bouncingBullets.splice(i, 1);
    });

    if (laserRotanteAttivo && attaccoAttuale === 4) {
        if (checkCollisionLineCircle(player, arena.x + arena.width/2, arena.y + arena.height/2, laserRotanteAngolo, 500)) { prendiDanno(4); }
    }

    if (attaccoAttuale === 7) {
        if (checkCollisionLineCircle(player, pernoSX.x, pernoSX.y, laserDiagonaleSX.angolo, 120) ||
            checkCollisionLineCircle(player, pernoDX.x, pernoDX.y, laserDiagonaleDX.angolo, 120)) {
            prendiDanno(4);
        }
    }

    groundObstacles.forEach((obs, i) => {
        obs.x += obs.speedX;
        if (checkCollision(obs, player)) { prendiDanno(4); groundObstacles.splice(i, 1); return; }
        if (obs.x < arena.x - 30 || obs.x > arena.x + arena.width + 30) { groundObstacles.splice(i, 1); }
    });

    platforms.forEach((plat, i) => {
        plat.y += plat.speedY;
        if (player.velocityY >= 0 && player.x + player.width > plat.x && player.x < plat.x + plat.width &&
            player.y + player.height >= plat.y && player.y + player.height <= plat.y + 12) {
            player.y = plat.y - player.height; player.velocityY = 0; player.onGround = true;
        }
        if (plat.y > arena.y + arena.height) { platforms.splice(i, 1); }
    });
}

function checkCollisionLineCircle(p, cx, cy, angolo, lunghezzaMax = 500) {
    const px = p.x + p.width / 2; const py = p.y + p.height / 2;
    const x1 = cx; const y1 = cy;
    const x2 = cx + Math.cos(angolo) * lunghezzaMax; const y2 = cy + Math.sin(angolo) * lunghezzaMax; 
    const A = px - x1; const B = py - y1; const C = x2 - x1; const D = y2 - y1;
    const dot = A * C + B * D; const len_sq = C * C + D * D;
    let param = -1; if (len_sq !== 0) param = dot / len_sq;
    let xx, yy; 
    if (param < 0) { xx = x1; yy = y1; } 
    else if (param > 1) { xx = x2; yy = y2; } 
    else { xx = x1 + param * C; yy = y1 + param * D; }
    return Math.sqrt((px - xx) * (px - xx) + (py - yy) * (py - yy)) < 9;
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y;
}

// 9. DRAW
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (statoGioco === "SCHERMATA_INIZIALE") {
        if (bossPronto) ctx.drawImage(bossImage, 220, 30, 160, 160);

        ctx.strokeStyle = "white"; ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(210, 195); 
        ctx.lineTo(390, 195); 
        ctx.lineTo(550, 480); 
        ctx.lineTo(50, 480);  
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "bold 38px 'Courier New'";
        ctx.textAlign = "left";
        ctx.fillText("INIZIA", 245, 275);

        ctx.font = "italic 26px 'Courier New'";
        ctx.fillText("By Adam", 360, 440);

        let scaleCuore = 14 + Math.sin(pulsazioneMenuCuore) * 2;
        ctx.fillStyle = "red";
        ctx.fillRect(205 - scaleCuore/2, 261 - scaleCuore/2, scaleCuore, scaleCuore);
        return; 
    }

    if (bossPronto) ctx.drawImage(bossImage, 200, 10, 160, 160);

    if (mostraBossHpTimer > 0 && !vittoria && !gameOver) {
        ctx.fillStyle = "gray"; ctx.fillRect(200, 172, 160, 6);
        ctx.fillStyle = "lime"; ctx.fillRect(200, 172, (bossHp / bossMaxHp) * 160, 6);
        ctx.fillStyle = "red"; ctx.font = "bold 20px 'Courier New'"; ctx.textAlign = "center";
        ctx.fillText("-" + dannoVisualizzato, 280, 155);
    }

    ctx.strokeStyle = "white"; ctx.lineWidth = 4;
    ctx.strokeRect(arena.x, arena.y, arena.width, arena.height);

    if (statoGioco === "DIFESA") {
        ctx.fillStyle = "white"; bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
        
        particles.forEach(p => {
            ctx.fillStyle = "yellow";
            ctx.fillRect(p.x, p.y, p.width, p.height); 
        });
        
        lasers.forEach(l => {
            if (l.tipo === "azzurro") ctx.fillStyle = "#00ffff";
            if (l.tipo === "sismico") ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            ctx.fillRect(l.x, l.y, l.width, l.height);
        });

        ctx.fillStyle = "#3b82f6"; bouncingBullets.forEach(bb => ctx.fillRect(bb.x, bb.y, bb.width, bb.height));

        ctx.fillStyle = "white";
        groundObstacles.forEach(obs => {
            for (let k = 0; k < obs.conteggio; k++) {
                ctx.fillRect(obs.x, obs.y + (k * 12), 12, 12);
                ctx.strokeStyle = "black"; ctx.lineWidth = 1; ctx.strokeRect(obs.x, obs.y + (k * 12), 12, 12); 
            }
        });

        ctx.fillStyle = "#22c55e"; platforms.forEach(plat => ctx.fillRect(plat.x, plat.y, plat.width, plat.height));

        // MODIFICATO: Il rettangolo della lava si disegna dinamicamente usando la variabile altezzaLavaCorrente
        if (attaccoAttuale === 6) {
            if (pavimentoDannoDelay > 0) {
                ctx.fillStyle = "rgba(251, 146, 60, 0.4)"; 
            } else {
                ctx.fillStyle = "rgba(239, 68, 68, 0.65)"; // Lava solida e pericolosa
            }
            ctx.fillRect(arena.x, arena.y + arena.height - altezzaLavaCorrente, arena.width, altezzaLavaCorrente);
        }

        if (attaccoAttuale === 7) {
            ctx.strokeStyle = "red"; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(pernoSX.x, pernoSX.y);
            ctx.lineTo(pernoSX.x + Math.cos(laserDiagonaleSX.angolo) * 120, pernoSX.y + Math.sin(laserDiagonaleSX.angolo) * 120); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(pernoDX.x, pernoDX.y);
            ctx.lineTo(pernoDX.x + Math.cos(laserDiagonaleDX.angolo) * 120, pernoDX.y + Math.sin(laserDiagonaleDX.angolo) * 120); ctx.stroke();
            ctx.fillStyle = "#a1a1aa";
            ctx.beginPath(); ctx.arc(pernoSX.x, pernoSX.y, 6, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(pernoDX.x, pernoDX.y, 6, 0, Math.PI * 2); ctx.fill();
        }

        warnings.forEach(w => { 
            ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
            if (w.tipo === "terremoto") { ctx.fillRect(w.x, arena.y, w.width, arena.height); } 
            else { ctx.fillRect(arena.x, w.y, arena.width, 10); }
        });

        if (attaccoAttuale === 4) {
            const centroX = arena.x + arena.width / 2; const centroY = arena.y + arena.height / 2;
            if (!laserRotanteAttivo) {
                ctx.strokeStyle = "rgba(255, 0, 0, 0.6)"; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
                ctx.beginPath(); ctx.moveTo(centroX - Math.cos(laserRotanteAngolo) * 600, centroY - Math.sin(laserRotanteAngolo) * 600);
                ctx.lineTo(centroX + Math.cos(laserRotanteAngolo) * 600, centroY + Math.sin(laserRotanteAngolo) * 600); ctx.stroke(); ctx.setLineDash([]); 
            } else {
                ctx.strokeStyle = "white"; ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 10; ctx.lineWidth = 6;
                ctx.beginPath(); ctx.moveTo(centroX - Math.cos(laserRotanteAngolo) * 600, centroY - Math.sin(laserRotanteAngolo) * 600);
                ctx.lineTo(centroX + Math.cos(laserRotanteAngolo) * 600, centroY + Math.sin(laserRotanteAngolo) * 600); ctx.stroke(); ctx.shadowBlur = 0; 
            }
        }

        if (!invincibile || Math.floor(invincibileTimer / 4) % 2 === 0) {
            ctx.fillStyle = player.colore; ctx.fillRect(player.x, player.y, player.width, player.height);
        }
    } 
    else if (statoGioco === "MINIGIOCO_FIGHT") {
        ctx.fillStyle = "#333"; ctx.fillRect(fightMinigame.x, fightMinigame.y, fightMinigame.width, fightMinigame.height);
        ctx.strokeStyle = "white"; ctx.lineWidth = 3; ctx.strokeRect(fightMinigame.x, fightMinigame.y, fightMinigame.width, fightMinigame.height);
        ctx.strokeStyle = "red"; ctx.lineWidth = 4;
        const centro = fightMinigame.x + fightMinigame.width / 2;
        ctx.beginPath(); ctx.moveTo(centro, fightMinigame.y); ctx.lineTo(centro, fightMinigame.y + fightMinigame.height); ctx.stroke();
        ctx.fillStyle = "white"; ctx.fillRect(fightMinigame.barX, fightMinigame.y, 6, fightMinigame.height);
    } 
    else if (statoGioco === "SOTTOMENU_ITEM") {
        ctx.fillStyle = "white"; ctx.font = "18px 'Courier New'"; ctx.textAlign = "left";
        ctx.fillText("Seleziona un oggetto (X per annullare):", arena.x + 10, arena.y + 30);
        
        inventario.forEach((cibo, index) => {
            let prefisso = "  ";
            if (itemSelezioneIndice === index) {
                prefisso = "* "; 
                ctx.fillStyle = "yellow";
            } else {
                ctx.fillStyle = "white";
            }
            ctx.fillText(prefisso + cibo.nome + " (+" + cibo.cura + "HP)", arena.x + 20, arena.y + 70 + (index * 30));
        });
    }
    else {
        ctx.fillStyle = (bossHp < 90) ? "red" : "white"; 
        ctx.font = "18px 'Courier New'"; ctx.textAlign = "left";
        wrapText(testoDojo, arena.x + 15, arena.y + 35, arena.width - 25, 26);
    }

    disegnaInterfaccia();
    disegnaMenu();
}

function disegnaMenu() {
    const pulsanti = ["FIGHT", "ACT", "ITEM", "MERCY"];
    const btnWidth = 110; const btnHeight = 45; const startX = 65; const btnY = 515; 

    pulsanti.forEach((testo, i) => {
        const x = startX + i * (btnWidth + 20);
        ctx.lineWidth = 3;
        if (menuSelezione === i && (statoGioco === "MENU" || statoGioco === "SOTTOMENU_ITEM")) {
            ctx.strokeStyle = "white"; ctx.fillStyle = "red"; ctx.fillRect(x + 15, btnY + 16, 12, 12);
        } else {
            ctx.strokeStyle = "#ffaa00"; 
        }
        ctx.strokeRect(x, btnY, btnWidth, btnHeight);
        ctx.fillStyle = (menuSelezione === i && statoGioco === "MENU") ? "yellow" : "orange";
        ctx.font = "18px 'Courier New'"; ctx.textAlign = "left"; 
        ctx.fillText(testo, x + 35, btnY + 28);
    });
}

function disegnaInterfaccia() {
    const hpY = 465; 
    ctx.fillStyle = "white"; ctx.font = "16px 'Courier New'"; ctx.textAlign = "left";
    ctx.fillText("PLAYER  LV 1", arena.x, hpY + 15); ctx.fillText("HP", arena.x + 130, hpY + 15);
    ctx.fillStyle = "red"; ctx.fillRect(arena.x + 160, hpY, maxHp * 2.5, 18);
    ctx.fillStyle = "yellow"; ctx.fillRect(arena.x + 160, hpY, hp * 2.5, 18);
    ctx.fillStyle = "white"; ctx.fillText(hp + " / " + maxHp, arena.x + 170 + (maxHp * 2.5), hpY + 15);

    if (statoGioco === "DIFESA") {
        ctx.font = "14px 'Courier New'"; ctx.fillStyle = (bossHp < 90) ? "red" : "gray";
        ctx.fillText("TURNO GIOCO: " + numeroTurno + " | ATTACCO BOSS: " + attaccoAttuale, 20, 30);
    }

    if (gameOver) {
        ctx.fillStyle = "black"; ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = "red"; ctx.font = "40px 'Courier New'"; ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
    }
    if (vittoria) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "yellow"; ctx.font = "40px 'Courier New'"; ctx.textAlign = "center";
        ctx.fillText("VICTORY!", canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = "white"; ctx.font = "18px 'Courier New'";
        ctx.fillText("Complimenti! Il Dojo capitola davanti al Caos Random!", canvas.width / 2, canvas.height / 2 + 50);
    }
}

function loop() { update(); draw(); requestAnimationFrame(loop); }
loop();