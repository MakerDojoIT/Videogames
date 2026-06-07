// ==========================================
// GAME ENGINE - HELL FIRE RIDER: SUPREME INTRO AUDIO
// ==========================================

// --- AUTOMATIC RETRO 8-BIT FONT INJECTION ---
const linkFont = document.createElement('link');
linkFont.rel = 'stylesheet';
linkFont.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
document.head.appendChild(linkFont);

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- BACKGROUND IMAGES ---
const immagineSfondo = new Image();
immagineSfondo.src = 'sfondo.png'; 

const immagineIntro = new Image();
immagineIntro.src = 'schermata_iniziale.png'; 

// --- AUDIO TRACKS WITH SAFETY CONTROL ---
let audioMoneta = null;
let audioGameOver = null;
let audioVittoriaCastello = null;
let audioWarpPowerDown = null;
let audioIntroComplete = null;

try {
    audioMoneta = new Audio('moneta.ogg'); 
    audioGameOver = new Audio('gameover.mp3');
    audioVittoriaCastello = new Audio('Mario Wins! - QuickSounds.com.mp3');
    audioWarpPowerDown = new Audio('mario power down - QuickSounds.com.mp3');
    
    // --- NUOVO AUDIO: Traccia iniziale con riproduzione immediata all'avvio ---
    audioIntroComplete = new Audio('Super Mario Bros Level Complete - QuickSounds.com.mp3');
    audioIntroComplete.play().catch(() => {
        console.log("Autoplay blocked by browser. Interaction required for sound.");
    });
} catch (error) {
    console.log("Audio files not found or skipped safely.");
}

const COLORI = {
    frecciaBoost: '#ffeb3b',    // Neon Yellow
    frecciaBordo: '#ff6d00',    // Fire Orange
    moneta: '#ffd700',          // Gold
    testo: '#ff3300',           // Demonic Red
    barraInfo: 'rgba(20, 5, 5, 0.8)', 
    schermataVittoria: 'rgba(230, 80, 0, 0.45)', 
    schermataGameOver: 'rgba(40, 0, 0, 0.85)'    
};

// ==========================================
// GAME OBJECT CLASSES
// ==========================================

// --- DRAGON BOSS CLASS ---
class DragonBoss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 180;
        this.height = 160;
        this.hp = 5;
        this.maxHp = 5;
        this.speedX = 2;
        this.speedY = 1;
        this.timerMovimento = 0;
        this.timerSparo = 0;
        this.isDead = false;
    }

    aggiorna(cameraX, lavaY, playerX, projectiles) {
        if (this.isDead) return;

        this.timerMovimento++;
        if (this.timerMovimento % 80 === 0) {
            this.speedX = (Math.random() - 0.5) * 5;
            this.speedY = (Math.random() - 0.5) * 2.5;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 2250) this.x = 2250;
        if (this.x > 2850) this.x = 2850;
        if (this.y < 60) this.y = 60;
        if (this.y > 220) this.y = 220;

        this.timerSparo++;
        if (this.timerSparo >= 160) { 
            let dirX = playerX - (this.x + 20);
            let dirY = 450 - (this.y + 60); 
            let dist = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
            
            projectiles.push(new DragonFireball(
                this.x + 20, 
                this.y + 60, 
                (dirX / dist) * 2.5, 
                (dirY / dist) * 2.5
            ));
            this.timerSparo = 0;
        }
    }

    riceviDanno() {
        this.hp--;
        if (this.hp <= 0) {
            this.isDead = true;
        }
    }

    disegna(context) {
        if (this.isDead) return;

        context.save();
        let p = 4; 
        
        context.fillStyle = '#6d4c41'; 
        context.fillRect(this.x + p*15, this.y, p*4, p*20);
        context.fillStyle = '#fbc02d'; 
        context.beginPath();
        context.moveTo(this.x + p*19, this.y + p*2);
        context.lineTo(this.x + p*40, this.y + p*10);
        context.lineTo(this.x + p*25, this.y + p*28);
        context.closePath();
        context.fill();

        context.fillStyle = '#1b5e20';
        context.fillRect(this.x + p*16, this.y + p*26, p*8, p*14);
        context.fillRect(this.x + p*26, this.y + p*26, p*8, p*14);
        context.fillStyle = '#f57f17'; 
        context.fillRect(this.x + p*14, this.y + p*38, p*4, p*2);
        context.fillRect(this.x + p*24, this.y + p*38, p*4, p*2);

        context.fillStyle = '#2e7d32';
        context.fillRect(this.x + p*12, this.y + p*12, p*22, p*16);
        context.fillStyle = '#fbc02d'; 
        context.fillRect(this.x + p*10, this.y + p*14, p*5, p*12);

        context.fillStyle = '#1b5e20';
        context.fillRect(this.x + p*32, this.y + p*22, p*12, p*8);
        context.fillRect(this.x + p*40, this.y + p*14, p*4, p*10);

        context.fillStyle = '#1b5e20';
        context.fillRect(this.x + p*6, this.y + p*16, p*7, p*5);

        context.fillStyle = '#2e7d32';
        context.fillRect(this.x + p*8, this.y + p*6, p*8, p*7); 
        context.fillRect(this.x, this.y + p*2, p*12, p*6); 
        context.fillStyle = '#ffeb3b'; 
        context.fillRect(this.x + p*11, this.y, p*2, p*3);
        context.fillRect(this.x + p*9, this.y - p, p*2, p*3);

        context.fillStyle = '#ff1744';
        context.fillRect(this.x + p*3, this.y + p*3, p, p);
        context.fillStyle = '#33691e';
        context.fillRect(this.x, this.y + p*6, p*6, p*2); 

        let larghezzaBarra = 160;
        context.fillStyle = '#212121';
        context.fillRect(this.x + 10, this.y - 30, larghezzaBarra, 8);
        context.fillStyle = '#d50000'; 
        context.fillRect(this.x + 10, this.y - 30, larghezzaBarra * (this.hp / this.maxHp), 8);

        context.restore();
    }
}

// --- PROJECTILE: PLAYER LASER (AUTO-AIM) ---
class PlayerLaser {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        
        let diffX = targetX - this.x;
        let diffY = targetY - this.y;
        let distanza = Math.sqrt(diffX * diffX + diffY * diffY) || 1;
        
        this.speed = 10;
        this.vx = (diffX / distanza) * this.speed;
        this.vy = (diffY / Math.max(1, distanza)) * this.speed;
    }
    
    aggiorna() {
        this.x += this.vx;
        this.y += this.vy;
    }
    
    disegna(context) {
        context.save();
        context.fillStyle = '#00e5ff'; 
        context.beginPath();
        context.arc(this.x + 8, this.y + 8, 8, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#ffffff'; 
        context.beginPath();
        context.arc(this.x + 8, this.y + 8, 4, 0, Math.PI * 2);
        context.fill();
        context.restore();
    }
}

// --- PROJECTILE: DRAGON FIREBALL ---
class DragonFireball {
    constructor(x, y, vx, vy) {
        this.x = x; this.y = y; this.width = 16; this.height = 16; this.vx = vx; this.vy = vy;
    }
    aggiorna() { this.x += this.vx; this.y += this.vy; }
    disegna(context) {
        context.save();
        context.fillStyle = '#ff3d00'; context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = '#ffea00'; context.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
        context.restore();
    }
}

// --- VOLCANIC ROCK CLASS (METEORITI) ---
class VolcanicRock {
    constructor(x, lavaY) {
        this.x = x; this.y = lavaY; this.width = 30; this.height = 30;
        this.vy = -Math.random() * 3 - 6; this.gravity = 0.15; this.speedX = (Math.random() - 0.5) * 1.5;  
    }
    aggiorna() { this.vy += this.gravity; this.y += this.vy; this.x += this.speedX; }
    disegna(context) {
        context.save();
        context.fillStyle = '#261414'; context.fillRect(this.x, this.y + 5, this.width, this.height - 10); context.fillRect(this.x + 5, this.y, this.width - 10, this.height);
        context.fillStyle = this.vy < 0 ? '#ffeb3b' : '#ff3d00'; context.fillRect(this.x + 8, this.y + 8, 14, 14);
        context.restore();
    }
}

// --- PIXEL ART BIG CASTLE ---
class PixelCastle {
    constructor(x, y) {
        this.x = x;
        this.y = y - 310; 
        this.width = 320;
        this.height = 310;
    }

    disegnaMuroConTexture(context, xStart, yStart, larghezzaTotal, altezzaTotal, pixelDim) {
        let paletteMattoni = ['#cfd8dc', '#b0bec5', '#90a4ae', '#78909c']; 
        
        for (let tY = 0; tY < altezzaTotal; tY += pixelDim * 2) {
            for (let tX = 0; tX < larghezzaTotal; tX += pixelDim * 3) {
                let indiceColore = Math.abs(Math.sin((xStart + tX) * 12.5 + (yStart + tY) * 7.2));
                let coloreScelto = paletteMattoni[Math.floor(indiceColore * paletteMattoni.length)];
                
                context.fillStyle = coloreScelto;
                let wMattone = Math.min(pixelDim * 3, larghezzaTotal - tX);
                let hMattone = Math.min(pixelDim * 2, altezzaTotal - tY);
                context.fillRect(xStart + tX, yStart + tY, wMattone, hMattone);
                
                context.fillStyle = 'rgba(38, 50, 56, 0.15)';
                context.fillRect(xStart + tX, yStart + tY + hMattone - 1, wMattone, 1);
            }
        }
    }

    disegna(context) {
        context.save();
        let p = 4; 
        let base = this.y + this.height;

        context.fillStyle = '#5d4037'; 
        context.fillRect(this.x - p*2, base - p*4, this.width + p*4, p*4);
        context.fillStyle = '#ffb300'; 
        for (let i = 0; i < this.width + p*4; i += p*6) {
            context.fillRect(this.x - p*2 + i, base - p*4, p, p*4);
        }

        context.fillStyle = '#004d40'; 
        context.fillRect(this.x - p*4, base - p*10, this.width + p*8, p*6);
        
        context.fillStyle = '#00c853'; 
        for (let cx = this.x - p*4; cx < this.x + this.width + p*4; cx += p*4) {
            context.fillRect(cx, base - p*12, p*5, p*4);
            context.fillRect(cx + p, base - p*13, p*3, p*2);
        }

        context.fillStyle = '#cfd8dc'; 
        context.fillRect(this.x + this.width/2 - p*8, base - p*10, p*16, p*10);
        context.fillStyle = '#eceff1'; 
        for (let s = 0; s < 5; s++) {
            let larghezzaGradino = (p * 16) - (s * p * 2);
            let offsetGradino = s * p;
            context.fillRect(this.x + this.width/2 - p*8 + offsetGradino, base - p*2 - (s*p*2), larghezzaGradino, p*2);
        }

        context.fillStyle = '#37474f'; 
        context.fillRect(this.x + p*6, base - p*26, p*68, p*16);
        this.disegnaMuroConTexture(context, this.x + p*7, base - p*25, p*66, p*15, p);

        context.fillStyle = '#37474f'; 
        context.fillRect(this.x + this.width/2 - p*7, base - p*24, p*14, p*14);
        context.fillStyle = '#212121'; 
        context.fillRect(this.x + this.width/2 - p*5, base - p*22, p*10, p*12);
        context.fillStyle = '#ffb300'; 
        context.fillRect(this.x + this.width/2 - p*4, base - p*21, p*8, p*11);

        context.fillStyle = '#37474f';
        context.fillRect(this.x + this.width/2 - p*9, base - p*50, p*18, p*24); 
        this.disegnaMuroConTexture(context, this.x + this.width/2 - p*8, base - p*49, p*16, p*23, p);
        
        context.fillStyle = '#212121'; 
        context.fillRect(this.x + this.width/2 - p*4, base - p*40, p*3, p*6);
        context.fillRect(this.x + this.width/2 + p, base - p*40, p*3, p*6);

        context.fillStyle = '#37474f';
        context.fillRect(this.x + this.width/2 - p*6, base - p*64, p*12, p*14);
        this.disegnaMuroConTexture(context, this.x + this.width/2 - p*5, base - p*63, p*10, p*13, p);

        context.fillStyle = '#d32f2f'; 
        context.fillRect(this.x + this.width/2 - p*4, base - p*69, p*8, p*5);
        context.fillRect(this.x + this.width/2 - p*2, base - p*72, p*4, p*3);
        context.fillStyle = '#212121'; 
        context.fillRect(this.x + this.width/2 - 1, base - p*84, p/2, p*12);
        context.fillStyle = '#212121'; 
        context.fillRect(this.x + this.width/2 + 1, base - p*84, p*6, p*3);
        context.fillStyle = '#ff1744'; context.fillRect(this.x + this.width/2 + p, base - p*83, p, p); 

        context.fillStyle = '#37474f'; context.fillRect(this.x + p*12, base - p*44, p*10, p*18);
        this.disegnaMuroConTexture(context, this.x + p*13, base - p*43, p*8, p*17, p);
        context.fillStyle = '#d32f2f'; context.fillRect(this.x + p*11, base - p*48, p*12, p*4); 
        context.fillStyle = '#212121'; context.fillRect(this.x + p*16, base - p*54, p/2, p*6); context.fillRect(this.x + p*16.5, base - p*54, p*3, p*2); 
        
        context.fillStyle = '#37474f'; context.fillRect(this.x + p*58, base - p*44, p*10, p*18);
        this.disegnaMuroConTexture(context, this.x + p*59, base - p*43, p*8, p*17, p);
        context.fillStyle = '#d32f2f'; context.fillRect(this.x + p*57, base - p*48, p*12, p*4); 
        context.fillStyle = '#212121'; context.fillRect(this.x + p*62, base - p*54, p/2, p*6); context.fillRect(this.x + p*62.5, base - p*54, p*3, p*2); 

        context.fillStyle = '#37474f'; context.fillRect(this.x + p*2, base - p*32, p*8, p*16);
        this.disegnaMuroConTexture(context, this.x + p*3, base - p*31, p*6, p*15, p);
        context.fillStyle = '#d32f2f'; context.fillRect(this.x + p*1, base - p*36, p*10, p*4); context.fillRect(this.x + p*3, base - p*39, p*6, p*3);
        context.fillStyle = '#212121'; context.fillRect(this.x + p*5, base - p*44, p/2, p*5); 

        context.fillStyle = '#37474f'; context.fillRect(this.x + p*70, base - p*32, p*8, p*16);
        this.disegnaMuroConTexture(context, this.x + p*71, base - p*31, p*6, p*15, p);
        context.fillStyle = '#d32f2f'; context.fillRect(this.x + p*69, base - p*36, p*10, p*4); context.fillRect(this.x + p*71, base - p*39, p*6, p*3);
        context.fillStyle = '#212121'; context.fillRect(this.x + p*73, base - p*44, p/2, p*5); 

        context.fillStyle = '#263238';
        context.fillRect(this.x + p*6, base - p*28, p*4, p*2);
        context.fillRect(this.x + p*14, base - p*28, p*4, p*2);
        context.fillRect(this.x + p*62, base - p*28, p*4, p*2);
        context.fillRect(this.x + p*70, base - p*28, p*4, p*2);

        context.restore();
    }
}

// --- PLAYER CLASS ---
class Player {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.width = 70; this.height = 54;
        this.vx = 0; this.vy = 0;
        this.baseSpeed = 3.5; this.speed = this.baseSpeed; 
        this.gravity = 0.5; this.jumpForce = -12;
        this.grounded = false; this.direzioneDestra = true; 
        this.pixelSize = 3; this.timerAnimazione = 0; this.frame = 0; 
        this.isWarpingIn = true; this.isWarpingOut = false;  
        this.warpScale = 0.0; this.quotaMassimaY = y;      
        this.hp = 3; this.maxHp = 3; this.invulnerabilityTimer = 0; 
    }

    aggiorna(platforms) {
        if (this.invulnerabilityTimer > 0) this.invulnerabilityTimer--;

        if (this.isWarpIn || this.isWarpingIn) {
            this.vx = 0; this.vy = -1.5; this.y += this.vy;
            this.warpScale = Math.min(1.0, this.warpScale + 0.04);
            
            if (this.y <= this.quotaMassimaY) {
                this.y = this.quotaMassimaY; this.isWarpingIn = false; this.isWarpIn = false; this.vy = 0; this.warpScale = 1.0;
                this.grounded = true;
            }
            return;
        }

        if (this.isWarpingOut) {
            this.vx = 0; this.vy = 1.2; this.y += this.vy;
            this.warpScale = Math.max(0.0, this.warpScale - 0.035);
            return;
        }

        this.vy += this.gravity;
        this.x += this.vx;
        this.gestisciCollisioniOrizzontali(platforms);
        this.y += this.vy;
        this.grounded = false;
        this.gestisciCollisioniVerticali(platforms);

        if (this.x < 0) this.x = 0;
        if (this.vx > 0) this.direzioneDestra = true;
        else if (this.vx < 0) this.direzioneDestra = false;

        if (this.vx !== 0 && this.grounded) {
            this.timerAnimazione += 0.05 * this.speed; 
            this.frame = Math.floor(this.timerAnimazione) % 2;
        } else {
            this.frame = 0;
        }
    }

    riceviColpo() {
        if (this.invulnerabilityTimer <= 0) {
            this.hp--;
            this.invulnerabilityTimer = 35; 
            if (audioWarpPowerDown && typeof audioWarpPowerDown.play === 'function') {
                audioWarpPowerDown.currentTime = 0; audioWarpPowerDown.play().catch(() => {});
            }
            return true;
        }
        return false;
    }

    gestisciCollisioniOrizzontali(platforms) {
        for (let p of platforms) { if (this.controllaCollisione(this, p)) { if (this.vx > 0) this.x = p.x - this.width; else if (this.vx < 0) this.x = p.x + p.width; } }
    }

    gestisciCollisioniVerticali(platforms) {
        for (let p of platforms) { if (this.controllaCollisione(this, p)) { if (this.vy > 0) { this.y = p.y - this.height; this.vy = 0; this.grounded = true; } else if (this.vy < 0) { this.y = p.y + p.height; this.vy = 0; } } }
    }

    controllaCollisione(r1, r2) { return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y; }
    salta() { if (this.grounded && !this.isWarpingIn && !this.isWarpingOut) { this.vy = this.jumpForce; this.grounded = false; } }

    disegna(context) {
        if (this.invulnerabilityTimer > 0 && Math.floor(this.invulnerabilityTimer / 4) % 2 === 0) return;
        context.save(); context.translate(this.x + this.width / 2, this.y + this.height / 2); context.scale(this.direzioneDestra ? this.warpScale : -this.warpScale, this.warpScale);
        let p = this.pixelSize; let ox = -this.width / 2 + 5; let oy = -this.height / 2 + 3;
        context.fillStyle = '#212121';
        if (this.frame === 0) {
            context.fillRect(ox + p*4, oy + p*15, p*2, p*3); context.fillRect(ox + p*7, oy + p*14, p*2, p*4); context.fillRect(ox + p*15, oy + p*14, p*2, p*4); context.fillRect(ox + p*18, oy + p*15, p*2, p*3); 
        } else {
            context.fillRect(ox + p*5, oy + p*14, p*2, p*3); context.fillRect(ox + p*7, oy + p*14, p*2, p*2); context.fillRect(ox + p*14, oy + p*14, p*2, p*2); context.fillRect(ox + p*16, oy + p*14, p*2, p*3); 
        }
        context.fillStyle = '#7a4a2a'; context.fillRect(ox + p*4, oy + p*9, p*15, p*6); context.fillRect(ox + p*15, oy + p*5, p*5, p*5); context.fillRect(ox + p*17, oy + p*3, p*5, p*3); 
        context.fillStyle = '#ff3d00'; context.fillRect(ox + p*2, oy + p*9, p*2, p*5); context.fillRect(ox + p*14, oy + p*5, p*2, p*4); context.fillStyle = '#ffea00'; context.fillRect(ox + p*19, oy + p*3, p, p);    
        context.fillStyle = '#424242'; context.fillRect(ox + p*8, oy + p*8, p*5, p*2);
        context.fillStyle = '#37474f'; context.fillRect(ox + p*9, oy + p*7, p*3, p*2); context.fillRect(ox + p*9, oy + p*3, p*4, p*4);  
        context.fillStyle = '#4a148c'; let offsetMantello = this.frame === 1 ? p : 0; context.fillRect(ox + p*6, oy + p*3 + offsetMantello, p*3, p*3); context.fillRect(ox + p*7, oy + p + offsetMantello, p*3, p);    
        context.fillStyle = '#263238'; context.fillRect(ox + p*9, oy, p*4, p*3); context.fillStyle = '#ff1744'; context.fillRect(ox + p*11, oy + p, p*2, p);    
        context.restore(); 
    }
}

// --- PLATFORM CLASS ---
class Platform {
    constructor(x, y, width, height) { this.x = x; this.y = y; this.width = width; this.height = height; }
    disegna(context) {
        context.save();
        let pSize = 4; let fW = this.width; let sH = Math.floor(this.height / 5);
        context.fillStyle = '#ff1744'; context.fillRect(this.x, this.y, fW, sH);                  
        context.fillStyle = '#d50000'; context.fillRect(this.x, this.y + sH, fW, sH);             
        context.fillStyle = '#b71c1c'; context.fillRect(this.x, this.y + sH*2, fW, sH);           
        context.fillStyle = '#7f0000'; context.fillRect(this.x, this.y + sH*3, fW, sH);           
        context.fillStyle = '#210000'; context.fillRect(this.x, this.y + sH*4, fW, this.height - sH*4); 
        context.fillStyle = '#ffea00'; context.fillRect(this.x, this.y, fW, 6);
        context.fillStyle = '#ff6d00'; context.fillRect(this.x, this.y + 6, fW, 6);
        context.fillStyle = '#ff3d00'; 
        for (let ix = 0; ix < fW; ix += 8) {
            let v = Math.sin(this.x + ix) * 1000; let c = v - Math.floor(v);
            if (c > 0.4) context.fillRect(this.x + ix, this.y + 12, pSize, pSize);
        }
        context.restore();
    }
}

// --- HAZARD TRIANGLE CLASS ---
class HazardTriangle {
    constructor(x, y) { this.x = x; this.y = y - 36; this.width = 36; this.height = 36; }
    disegna(context) {
        context.save(); let base = this.x; let bottom = this.y + this.height;
        for (let i = 0; i < this.height; i += 4) {
            let larghezzaFetta = this.width * (1 - (i / this.height)); let offsetCentro = (this.width - larghezzaFetta) / 2;
            if (i < 12) context.fillStyle = '#ff6d00'; else if (i < 24) context.fillStyle = '#ff3d00'; else context.fillStyle = '#ff1744';              
            context.fillRect(base + offsetCentro, bottom - i - 4, larghezzaFetta, 4);
        }
        context.restore();
    }
}

// --- WARP PIPE CLASS ---
class WarpPipe {
    constructor(x, y) { this.x = x; this.y = y - 50; this.width = 74; this.height = 50; }
    disegna(context) {
        context.save();
        context.fillStyle = '#1e272c'; context.fillRect(this.x - 4, this.y, this.width + 8, 14);
        context.fillStyle = '#ff5722'; context.fillRect(this.x - 4, this.y + 10, this.width + 8, 4); 
        context.fillStyle = '#263238'; context.fillRect(this.x, this.y + 14, this.width, this.height - 14);
        context.fillStyle = '#37474f'; context.fillRect(this.x + 6, this.y + 14, 12, this.height - 14);
        context.fillStyle = '#111619'; context.fillRect(this.x + this.width - 12, this.y + 14, 8, this.height - 14);
        context.restore();
    }
}

// --- LAVA OCEAN CLASS ---
class LavaOcean {
    constructor(y, lunghezzaTotale) { this.y = y; this.lunghezzaTotale = lunghezzaTotale; this.tempoAnimazione = 0; this.pixelSize = 6; }
    aggiorna() { this.tempoAnimazione += 0.08; }
    disegna(context) {
        context.save(); let p = this.pixelSize;
        context.fillStyle = '#ff5722'; context.fillRect(0, this.y, this.lunghezzaTotale, canvas.height - this.y);
        for (let lx = 0; lx < this.lunghezzaTotale; lx += p * 2) {
            let offsetOnda = Math.sin(lx * 0.015 + this.tempoAnimazione) * p * 1.5;
            let ySuperficie = this.y + Math.floor(offsetOnda / p) * p;
            context.fillStyle = '#ffeb3b'; context.fillRect(lx, ySuperficie, p * 2, p);
            context.fillStyle = '#ff9800'; context.fillRect(lx, ySuperficie + p, p * 2, p);
        }
        context.restore();
    }
}

// --- SPEED ARROW CLASS ---
class SpeedArrow {
    constructor(x, y) { this.x = x; this.y = y - 10; this.width = 28; this.height = 24; this.presa = false; }
    disegna(context) {
        if (this.presa) return;
        context.save();
        context.fillStyle = COLORI.frecciaBordo; context.fillRect(this.x, this.y + 6, 16, 12); context.fillRect(this.x + 12, this.y, 4, 24); context.fillRect(this.x + 16, this.y + 4, 4, 16); context.fillRect(this.x + 20, this.y + 8, 4, 8);
        context.fillStyle = COLORI.frecciaBoost; context.fillRect(this.x + 2, this.y + 8, 12, 8); context.fillRect(this.x + 12, this.y + 4, 2, 16); context.fillRect(this.x + 14, this.y + 6, 2, 12);
        context.restore();
    }
}

// --- COIN CLASS ---
class Coin {
    constructor(x, y) { this.x = x; this.y = y - 6; this.radius = 11; this.width = this.radius * 2; this.height = this.radius * 2; this.presa = false; }
    disegna(context) {
        if (this.presa) return;
        context.save();
        let gradiente = context.createRadialGradient(this.x + this.radius - 3, this.y + this.radius - 3, 2, this.x + this.radius, this.y + this.radius, this.radius);
        gradiente.addColorStop(0, '#FFEAA7'); gradiente.addColorStop(0.6, '#FFD700');   
        context.fillStyle = gradiente; context.beginPath(); context.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2); context.fill();
        context.restore();
    }
}

// --- CLOUD CLASS ---
class Cloud { constructor(x, y) { this.x = x; this.y = y; this.pixelSize = 6; } disegna(context) { context.save(); let p = this.pixelSize; context.fillStyle = 'rgba(110, 100, 100, 0.75)'; context.fillRect(this.x + p*4, this.y, p*5, p); context.fillRect(this.x + p*2, this.y + p, p*8, p); context.restore(); } }

// ==========================================
// CENTRAL REGULATION ENGINE (BASELEVEL)
// ==========================================
class BaseLevel {
    constructor() {
        this.livelloCorrente = 1; 
        const TERRENO_Y = 530;
        this.startX = 42; 
        this.startY = (TERRENO_Y - 50) - 54; 
        
        this.giocoAvviato = false;

        this.player = new Player(this.startX, TERRENO_Y + 20); 
        this.player.quotaMassimaY = this.startY;               
        
        this.platforms = []; this.speedArrows = []; this.coins = []; this.spikes = []; this.clouds = []; 
        this.playerProjectiles = []; this.dragonProjectiles = []; this.fallingRocks = [];
        
        this.score = 0; this.boostCount = 0; this.tempoRimasto = 60; 
        this.gameOver = false; this.vittoria = false; this.giocoFinitoAssoluto = false; 
        this.lunghezzaLivello = 3200; this.camera = { x: 0 };
        this.keys = { ArrowLeft: false, ArrowRight: false };

        this.lavaOcean = new LavaOcean(545, this.lunghezzaLivello);
        this.tuboInizio = null; this.tuboFine = null;
        this.castello = null; this.drago = null;
        this.rockSpawnTimer = 0;

        this.initInput();
        this.caricaMappa(this.livelloCorrente); 
    }

    generaBackground() {
        this.clouds = []; 
        for (let x = 80; x < this.lunghezzaLivello; x += 350) {
            let y = 40 + Math.random() * 140; 
            this.clouds.push(new Cloud(x, y));
        }
    }

    aggiungiOggettoSicuro(tipo, x, yBase) {
        const DISTANZA_SICUREZZA = 100; let coordinataY = yBase;
        for (let s of this.spikes) { if (Math.abs(x - s.x) < DISTANZA_SICUREZZA) { coordinataY = yBase - 120; break; } }
        if (tipo === 'arrow') this.speedArrows.push(new SpeedArrow(x, coordinataY));
        else if (tipo === 'coin') this.coins.push(new Coin(x, coordinataY));
    }

    caricaMappa(numeroLivello) {
        this.platforms = []; this.spikes = []; this.playerProjectiles = []; this.dragonProjectiles = []; this.fallingRocks = [];
        this.castello = null; this.drago = null; this.tuboFine = null;
        
        if (!this.gameOverResurrection) { this.speedArrows = []; this.coins = []; }
        else { if (numeroLivello === 3) this.player.hp = 3; }
        
        const TERRENO_Y = 530; const ALTEZZA_BLOCCO = 70; const PIANO_ELEMENTI_Y = TERRENO_Y - 22; 
        this.tuboInizio = new WarpPipe(40, TERRENO_Y);

        if (numeroLivello === 3) {
            this.castello = new PixelCastle(2800, TERRENO_Y); 
            this.drago = new DragonBoss(2450, 120);
        } else {
            this.tuboFine = new WarpPipe(3040, TERRENO_Y);
        }

        this.generaBackground(); 

        if (numeroLivello === 1) {
            this.platforms.push(new Platform(0, TERRENO_Y, 600, ALTEZZA_BLOCCO)); 
            this.platforms.push(new Platform(760, TERRENO_Y, 400, ALTEZZA_BLOCCO));
            this.platforms.push(new Platform(1320, TERRENO_Y, 520, ALTEZZA_BLOCCO));
            this.platforms.push(new Platform(1960, TERRENO_Y, 320, ALTEZZA_BLOCCO));
            this.platforms.push(new Platform(2440, TERRENO_Y, 800, ALTEZZA_BLOCCO)); 

            this.spikes.push(new HazardTriangle(440, TERRENO_Y)); 
            this.spikes.push(new HazardTriangle(1480, TERRENO_Y)); 
            this.spikes.push(new HazardTriangle(2600, TERRENO_Y)); 

            if (!this.gameOverResurrection) {
                this.aggiungiOggettoSicuro('arrow', 240, PIANO_ELEMENTI_Y); 
                this.aggiungiOggettoSicuro('coin', 380, PIANO_ELEMENTI_Y);  
                this.aggiungiOggettoSicuro('arrow', 900, PIANO_ELEMENTI_Y);
                this.aggiungiOggettoSicuro('coin', 1000, PIANO_ELEMENTI_Y); 
                this.aggiungiOggettoSicuro('arrow', 1480, PIANO_ELEMENTI_Y); 
                this.aggiungiOggettoSicuro('coin', 1640, PIANO_ELEMENTI_Y);
            }
        } else if (numeroLivello === 2) {
            this.platforms.push(new Platform(0, TERRENO_Y, 400, ALTEZZA_BLOCCO));
            this.platforms.push(new Platform(560, TERRENO_Y, 280, ALTEZZA_BLOCCO)); 
            this.platforms.push(new Platform(960, TERRENO_Y, 200, ALTEZZA_BLOCCO));
            this.platforms.push(new Platform(1320, TERRENO_Y, 320, ALTEZZA_BLOCCO));
            this.platforms.push(new Platform(1800, TERRENO_Y, 280, ALTEZZA_BLOCCO));
            this.platforms.push(new Platform(2240, TERRENO_Y, 1000, ALTEZZA_BLOCCO));

            this.spikes.push(new HazardTriangle(640, TERRENO_Y)); 
            this.spikes.push(new HazardTriangle(1440, TERRENO_Y));
            this.spikes.push(new HazardTriangle(2440, TERRENO_Y));

            if (!this.gameOverResurrection) {
                this.aggiungiOggettoSicuro('arrow', 200, PIANO_ELEMENTI_Y); 
                this.aggiungiOggettoSicuro('coin', 300, PIANO_ELEMENTI_Y);
                this.aggiungiOggettoSicuro('arrow', 640, PIANO_ELEMENTI_Y);  
                this.aggiungiOggettoSicuro('coin', 720, PIANO_ELEMENTI_Y);
                this.aggiungiOggettoSicuro('arrow', 1050, PIANO_ELEMENTI_Y); 
            }
        } else if (numeroLivello === 3) {
            this.platforms.push(new Platform(0, TERRENO_Y, 500, ALTEZZA_BLOCCO));
            this.platforms.push(new Platform(650, TERRENO_Y - 50, 300, ALTEZZA_BLOCCO));
            this.platforms.push(new Platform(1100, TERRENO_Y, 400, ALTEZZA_BLOCCO));
            this.platforms.push(new Platform(1650, TERRENO_Y - 80, 400, ALTEZZA_BLOCCO));
            this.platforms.push(new Platform(2200, TERRENO_Y, 1100, ALTEZZA_BLOCCO)); 

            if (!this.gameOverResurrection) {
                this.speedArrows.push(new SpeedArrow(250, TERRENO_Y - 22));
                this.coins.push(new Coin(350, TERRENO_Y - 22));
                this.speedArrows.push(new SpeedArrow(720, TERRENO_Y - 72));
                this.coins.push(new Coin(820, TERRENO_Y - 72));
                this.coins.push(new Coin(1200, TERRENO_Y - 22));
                this.speedArrows.push(new SpeedArrow(1350, TERRENO_Y - 22));
                this.coins.push(new Coin(1750, TERRENO_Y - 102));
                this.coins.push(new Coin(1850, TERRENO_Y - 102));
                this.speedArrows.push(new SpeedArrow(2300, TERRENO_Y - 22));
                this.coins.push(new Coin(2400, TERRENO_Y - 22));
            }
        }
        
        this.gameOverResurrection = false;
    }

    prossimoLivello() {
        this.livelloCorrente++;
        if (this.livelloCorrente <= 3) {
            this.vittoria = false; 
            this.tempoRimasto = (this.livelloCorrente === 3) ? 90 : 60; 
            this.boostCount = 0; 
            this.resetGiocatore(); 
            this.caricaMappa(this.livelloCorrente);
        } else {
            this.giocoFinitoAssoluto = true;
        }
    }

    attivaGameOver() { 
        if (!this.gameOver) { 
            this.gameOver = true; 
            if (audioWarpPowerDown && typeof audioWarpPowerDown.play === 'function') {
                audioWarpPowerDown.currentTime = 0; audioWarpPowerDown.play().catch(() => {});
            }
        } 
    }

    initInput() {
        window.addEventListener('keydown', (e) => {
            // --- MODIFICA APPLICATA: Il blocco audio è stato completamente rimosso. Ora si avvia sempre liberamente ---
            if (!this.giocoAvviato) {
                if (e.code === 'Space') {
                    this.giocoAvviato = true;
                    if (audioWarpPowerDown && typeof audioWarpPowerDown.play === 'function') {
                        audioWarpPowerDown.currentTime = 0; audioWarpPowerDown.play().catch(() => {});
                    }
                }
                return;
            }

            if (this.vittoria && e.code === 'Space') { this.prossimoLivello(); return; }
            if (this.gameOver && e.code === 'Space' && this.tempoRimasto > 0) { this.resetLivelloIntero(); return; }
            if (this.gameOver || this.vittoria || this.giocoFinitoAssoluto) return;
            
            if (e.code === 'ArrowLeft') this.keys.ArrowLeft = true;
            if (e.code === 'ArrowRight') this.keys.ArrowRight = true;
            if (e.code === 'Space' || e.code === 'ArrowUp') this.player.salta();

            if (e.code === 'KeyZ' && !this.player.isWarpingIn && !this.player.isWarpingOut) {
                let pX = this.player.direzioneDestra ? this.player.x + this.player.width : this.player.x - 16;
                let pY = this.player.y + 20;
                
                let tX = this.drago ? this.drago.x + (this.drago.width / 2) : pX + (this.player.direzioneDestra ? 300 : -300);
                let tY = this.drago ? this.drago.y + (this.drago.height / 2) : pY;
                
                this.playerProjectiles.push(new PlayerLaser(pX, pY, tX, tY));
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft') this.keys.ArrowLeft = false;
            if (e.code === 'ArrowRight') this.keys.ArrowRight = false;
        });

        setInterval(() => {
            if (this.giocoAvviato && !this.vittoria && !this.giocoFinitoAssoluto && this.tempoRimasto > 0) {
                this.tempoRimasto--; 
                if (this.tempoRimasto === 0) this.attivaGameOver();
            }
        }, 1000);
    }

    aggiornaFisica() {
        if (!this.giocoAvviato) return; 
        if (this.tempoRimasto <= 0) return; 
        if (this.gameOver || this.vittoria || this.giocoFinitoAssoluto) return;

        if (this.player.isWarpingOut) {
            this.player.aggiorna(this.platforms);
            if (this.player.warpScale <= 0) {
                this.vittoria = true;
                if (this.livelloCorrente === 3) {
                    if (audioVittoriaCastello && typeof audioVittoriaCastello.play === 'function') {
                        audioVittoriaCastello.currentTime = 0; audioVittoriaCastello.play().catch(() => {});
                    }
                }
            } 
            return;
        }

        if (this.player.isWarpingIn) {
            this.player.aggiorna(this.platforms);
            return; 
        }

        this.player.vx = this.keys.ArrowLeft ? -this.player.speed : (this.keys.ArrowRight ? this.player.speed : 0);
        this.player.aggiorna(this.platforms);
        this.lavaOcean.aggiorna();

        this.camera.x = Math.max(0, Math.min(this.player.x - canvas.width / 2, this.lunghezzaLivello - canvas.width));

        if (this.livelloCorrente !== 3) {
            this.rockSpawnTimer++;
            let frequenzaCaduta = Math.max(20, 50 - (this.livelloCorrente * 10)); 
            if (this.rockSpawnTimer >= frequenzaCaduta) {
                let coordinataXCasuale = this.camera.x + Math.random() * (canvas.width - 40);
                let sottoPiattaforma = this.platforms.some(p => coordinataXCasuale + 30 > p.x && coordinataXCasuale < p.x + p.width);
                if (!sottoPiattaforma) {
                    this.fallingRocks.push(new VolcanicRock(coordinataXCasuale, this.lavaOcean.y));
                }
                this.rockSpawnTimer = 0;
            }
        }

        for (let i = this.fallingRocks.length - 1; i >= 0; i--) {
            let rock = this.fallingRocks[i]; rock.aggiorna();
            if (this.player.controllaCollisione(this.player, rock)) { 
                if (this.livelloCorrente === 3) { 
                    if (this.player.riceviColpo() && this.player.hp <= 0) this.attivaGameOver(); 
                } else { this.attivaGameOver(); } 
            }
            if (rock.y > canvas.height + 40 && rock.vy > 0) this.fallingRocks.splice(i, 1);
        }

        if (this.drago) {
            this.drago.aggiorna(this.camera.x, this.lavaOcean.y, this.player.x, this.dragonProjectiles);
            if (!this.drago.isDead && this.player.controllaCollisione(this.player, this.drago)) { 
                if (this.player.riceviColpo() && this.player.hp <= 0) this.attivaGameOver(); 
            }
        }

        for (let i = this.playerProjectiles.length - 1; i >= 0; i--) {
            let laser = this.playerProjectiles[i]; laser.aggiorna();
            if (this.drago && !this.drago.isDead && this.player.controllaCollisione(laser, this.drago)) { 
                this.drago.riceviDanno(); this.playerProjectiles.splice(i, 1); continue; 
            }
            if (laser.x < this.camera.x || laser.x > this.camera.x + canvas.width || laser.y < 0 || laser.y > canvas.height) this.playerProjectiles.splice(i, 1);
        }

        for (let i = this.dragonProjectiles.length - 1; i >= 0; i--) {
            let fireball = this.dragonProjectiles[i]; fireball.aggiorna();
            if (this.player.controllaCollisione(this.player, fireball)) { 
                if (this.player.riceviColpo() && this.player.hp <= 0) this.attivaGameOver(); 
                this.dragonProjectiles.splice(i, 1); continue; 
            }
            if (fireball.y > canvas.height) this.dragonProjectiles.splice(i, 1);
        }

        for (let a of this.speedArrows) { 
            if (!a.presa && this.player.controllaCollisione(this.player, a)) { 
                a.presa = true; this.boostCount += 1; this.player.speed += 0.6; 
                if (audioMoneta && typeof audioMoneta.play === 'function') {
                    audioMoneta.currentTime = 0; audioMoneta.play().catch(() => {});
                }
            } 
        }
        
        for (let c of this.coins) { 
            if (!c.presa && this.player.controllaCollisione(this.player, c)) { 
                c.presa = true; this.score += 10; 
                if (audioMoneta && typeof audioMoneta.play === 'function') {
                    audioMoneta.currentTime = 0; audioMoneta.play().catch(() => {});
                }
            } 
        }
        
        for (let s of this.spikes) { if (this.player.controllaCollisione(this.player, s)) { if (this.livelloCorrente === 3) { if (this.player.riceviColpo() && this.player.hp <= 0) this.attivaGameOver(); } else { this.attivaGameOver(); } } }
        
        if (this.player.y + this.player.height > this.lavaOcean.y) this.attivaGameOver();

        if (this.tuboFine) {
            if (this.player.x + this.player.width > this.tuboFine.x + 12 && this.player.x < this.tuboFine.x + this.tuboFine.width - 12 &&
                this.player.y + this.player.height >= this.tuboFine.y && this.player.y + this.player.height <= this.tuboFine.y + 12) {
                
                if (!this.player.isWarpingOut) {
                    this.player.isWarpingOut = true;
                    if (audioWarpPowerDown && typeof audioWarpPowerDown.play === 'function') {
                        audioWarpPowerDown.currentTime = 0; 
                        audioWarpPowerDown.play().catch(() => {});
                    }
                }
            }
        }

        if (this.castello && this.drago && this.drago.isDead) {
            if (this.player.x + this.player.width > this.castello.x + 120 && this.player.x < this.castello.x + 180 &&
                this.player.y + this.player.height >= this.castello.y + this.castello.height - 15) {
                
                if (!this.player.isWarpingOut) {
                    this.player.isWarpingOut = true;
                    if (audioWarpPowerDown && typeof audioWarpPowerDown.play === 'function') {
                        audioWarpPowerDown.currentTime = 0; 
                        audioWarpPowerDown.play().catch(() => {});
                    }
                }
            }
        }
    }

    resetGiocatore() {
        const TERRENO_Y = 530;
        this.player.vx = 0; this.player.vy = 0; this.camera.x = 0; 
        this.player.speed = this.player.baseSpeed + (this.boostCount * 0.6); 
        this.player.isWarpingIn = true; this.player.isWarpIn = true; this.player.isWarpingOut = false; 
        this.player.warpScale = 0.0; this.player.x = 42; this.player.y = TERRENO_Y + 20; 
        this.player.quotaMassimaY = (TERRENO_Y - 50) - this.player.height; 
        if (this.livelloCorrente === 3) this.player.hp = 3; 

        if (this.giocoAvviato && audioWarpPowerDown && typeof audioWarpPowerDown.play === 'function') {
            audioWarpPowerDown.currentTime = 0; audioWarpPowerDown.play().catch(() => {});
        }
    }

    resetLivelloIntero() { 
        this.gameOver = false; this.vittoria = false; this.gameOverResurrection = true; 
        this.caricaMappa(this.livelloCorrente); this.resetGiocatore(); 
    }

    disegnaIntroScreen() {
        if (immagineIntro.complete && immagineIntro.naturalWidth !== 0) {
            ctx.drawImage(immagineIntro, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = '#1c0505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.lavaOcean.disegna(ctx);
            
            ctx.textAlign = 'center';
            ctx.font = '20px "Press Start 2P"';
            ctx.fillStyle = '#ffea00';
            ctx.fillText('LOADING INTRO IMAGE...', canvas.width / 2, canvas.height / 2);
        }
        
        ctx.textAlign = 'left'; 
    }

    start() { 
        const loop = () => { this.aggiornaFisica(); this.disegna(); requestAnimationFrame(loop); }; 
        requestAnimationFrame(loop); 
    }

    disegna() {
        if (!this.giocoAvviato) {
            this.disegnaIntroScreen();
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (this.livelloCorrente === 1) ctx.fillStyle = '#1c0505'; 
        else if (this.livelloCorrente === 2) ctx.fillStyle = '#2a0a0a'; 
        else ctx.fillStyle = '#4a0000'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save(); ctx.translate(-this.camera.x, 0);
        for (let cl of this.clouds) cl.disegna(ctx); 
        this.lavaOcean.disegna(ctx); 
        for (let p of this.platforms) p.disegna(ctx);
        
        if (this.tuboInizio) this.tuboInizio.disegna(ctx); 
        if (this.tuboFine) this.tuboFine.disegna(ctx); 
        if (this.castello) this.castello.disegna(ctx); 
        if (this.drago) this.drago.disegna(ctx);

        for (let a of this.speedArrows) a.disegna(ctx); 
        for (let c of this.coins) c.disegna(ctx); 
        for (let s of this.spikes) s.disegna(ctx); 
        for (let rock of this.fallingRocks) rock.disegna(ctx);
        for (let p of this.playerProjectiles) p.disegna(ctx); 
        for (let f of this.dragonProjectiles) f.disegna(ctx);

        if (!this.gameOver || this.tempoRimasto > 0) { this.player.disegna(ctx); }
        ctx.restore(); 

        ctx.fillStyle = COLORI.barraInfo; ctx.fillRect(0, 0, canvas.width, 50);
        ctx.fillStyle = COLORI.testo; ctx.font = '10px "Press Start 2P"'; 
        ctx.fillText(`LEVEL: ${this.livelloCorrente}`, 25, 32); 
        ctx.fillText(`GOLD: ${this.score}`, canvas.width / 2 - 140, 32); 
        ctx.fillText(`BOOST: +${this.boostCount}`, canvas.width / 2 + 30, 32); 
        ctx.fillText(`TIME: ${this.tempoRimasto}s`, canvas.width - 150, 32);

        if (this.livelloCorrente === 3 && !this.gameOver && !this.vittoria) {
            ctx.fillStyle = '#ffea00'; ctx.fillText('PRESS [Z] TO FIRE (AUTO-AIM ACTIVE)', 25, 75);
            ctx.fillStyle = '#212121'; ctx.fillRect(25, 90, 100, 10); 
            ctx.fillStyle = '#00e676'; ctx.fillRect(25, 90, 100 * (this.player.hp / this.player.maxHp), 10);
            ctx.fillStyle = '#ffffff'; ctx.font = '8px "Press Start 2P"'; ctx.fillText(`HP: ${this.player.hp}`, 135, 99);
            if(this.drago && this.drago.isDead) { 
                ctx.fillStyle = '#00e676'; ctx.font = '10px "Press Start 2P"'; 
                ctx.fillText('PORTAL OPEN! CONQUER THE CASTLE!', canvas.width / 2 - 180, 125); 
            }
        }

        if (this.vittoria && this.livelloCorrente < 3) { 
            ctx.fillStyle = COLORI.schermataVittoria; ctx.fillRect(0, 0, canvas.width, canvas.height); 
            ctx.fillStyle = '#ffea00'; ctx.font = '16px "Press Start 2P"'; ctx.textAlign = 'center'; 
            ctx.fillText('WARP COMPLETED!', canvas.width / 2, canvas.height / 2 - 30); 
            ctx.fillStyle = 'white'; ctx.font = '9px "Press Start 2P"'; 
            ctx.fillText(`press space to enter stage ${this.livelloCorrente + 1}`, canvas.width / 2, canvas.height / 2 + 30); 
            ctx.textAlign = 'left'; 
        }

        if (this.gameOver) {
            ctx.fillStyle = COLORI.schermataGameOver; ctx.fillRect(0, 0, canvas.width, canvas.height); 
            ctx.fillStyle = '#ff1744'; ctx.font = '36px "Press Start 2P"'; ctx.textAlign = 'center'; 
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10); 
            ctx.fillStyle = '#ffffff'; ctx.font = '10px "Press Start 2P"'; 
            if (this.tempoRimasto > 0) { ctx.fillText('PRESS SPACE TO RESURRECT', canvas.width / 2, canvas.height / 2 + 50); } 
            else { ctx.fillStyle = '#ff3300'; ctx.fillText('TIME EXPIRED! RESURRECTION IMPOSSIBLE', canvas.width / 2, canvas.height / 2 + 50); }
            ctx.textAlign = 'left'; 
        }

        if (this.giocoFinitoAssoluto || (this.livelloCorrente === 3 && this.vittoria)) { 
            ctx.fillStyle = 'rgba(0, 0, 0, 0.95)'; ctx.fillRect(0, 0, canvas.width, canvas.height); 
            ctx.fillStyle = '#ffea00'; ctx.font = '22px "Press Start 2P"'; ctx.textAlign = 'center'; 
            ctx.fillText('HAI VINTO!', canvas.width / 2, canvas.height / 2 - 30); 
            ctx.fillStyle = '#ff3d00'; ctx.font = '14px "Press Start 2P"'; 
            ctx.fillText('LORD OF HELL!', canvas.width / 2, canvas.height / 2 + 10); 
            ctx.fillStyle = 'white'; ctx.font = '10px "Press Start 2P"'; 
            ctx.fillText(`Score Finale: ${this.score} Gold | Boost: +${this.boostCount}`, canvas.width / 2, canvas.height / 2 + 50); 
            ctx.textAlign = 'left'; 
        }
    }
}

const gioco = new BaseLevel();
gioco.start();