// ==========================================================
// --- CLASSE DEL GIOCATORE (PINGUINO) ---
// ==========================================================
class Penguin {
    constructor() {
        this.width = 32;
        this.height = 36;
        this.speed = 0.6;
        this.maxSpeed = 6;
        this.friction = 0.85;
        this.gravity = 0.6;
        this.jumpForce = 14;
        this.colorBody = '#1e272e';
        this.colorFeet = '#ff7f50';
        this.morti = 0;
        this.resetLogicState();
    }

    // Ripristina le cordinate fisiche di spawn del pinguino
    resetLogicState() {
        this.x = 50;
        this.y = 200;
        this.vx = 0;
        this.vy = 0;
        this.grounded = false;
        this.direzione = 'destra';
        this.testoMorte = "";
        this.timerTestoMorte = 0;
        this.xMorteFissa = 0;
        this.yMorteFissa = 0;
    }

    // Calcolo delle forze direzionali ed attrito cinematico
    update(platforms) {
        if (keys['a'] || keys['A']) {
            if (this.vx > -this.maxSpeed) this.vx -= this.speed;
            this.direzione = 'sinistra';
        }
        if (keys['d'] || keys['D']) {
            if (this.vx < this.maxSpeed) this.vx += this.speed;
            this.direzione = 'destra';
        }

        this.vx *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        
        if (this.x < 0) this.x = 0;
        this.y += this.vy;
        this.grounded = false;

        // Algoritmo di collisione e atterraggio solido sulle piattaforme
        for (let plat of platforms) {
            if (this.x < plat.x + plat.w && this.x + this.width > plat.x &&
                this.y < plat.y + plat.h && this.y + this.height > plat.y) {
                if (this.vy > 0 && (this.y + this.height - this.vy) <= plat.y + 10) {
                    this.y = plat.y - this.height;
                    this.vy = 0;
                    this.grounded = true;
                }
            }
        }

        // Trigger del salto condizionato dallo stato di contatto a terra
        if ((keys['Space'] || keys['w'] || keys['W']) && this.grounded) {
            this.vy = -this.jumpForce;
            this.grounded = false;
        }

        if (this.timerTestoMorte > 0) {
            this.timerTestoMorte--;
            if (this.timerTestoMorte === 0) this.testoMorte = "";
        }
    }

    // Disegno della sprite procedurale in pixel art del pinguino
    draw(ctx) {
        ctx.fillStyle = this.colorBody; 
        ctx.fillRect(this.x + 2, this.y + 4, this.width - 4, this.height - 8);
        ctx.fillRect(this.x + 4, this.y + 2, this.width - 8, this.height - 4);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 8, this.y + 14, this.width - 16, this.height - 18);
        ctx.fillRect(this.x + 6, this.y + 18, this.width - 12, this.height - 24);

        ctx.fillStyle = '#000000';
        if (this.direzione === 'destra') {
            ctx.fillRect(this.x + 20, this.y + 8, 3, 4); 
            ctx.fillRect(this.x + 12, this.y + 8, 3, 4); 
        } else {
            ctx.fillRect(this.x + 10, this.y + 8, 3, 4);
            ctx.fillRect(this.x + 18, this.y + 8, 3, 4);
        }

        ctx.fillStyle = '#ffa502';
        if (this.direzione === 'destra') {
            ctx.fillRect(this.x + 22, this.y + 12, 6, 4); 
        } else {
            ctx.fillRect(this.x - 2, this.y + 12, 6, 4);
        }

        ctx.fillStyle = this.colorFeet;
        ctx.fillRect(this.x + 4, this.y + this.height - 4, 6, 4);  
        ctx.fillRect(this.x + this.width - 10, this.y + this.height - 4, 6, 4); 

        ctx.fillStyle = this.colorBody;
        if (this.direzione === 'destra') {
            ctx.fillRect(this.x - 1, this.y + 14, 3, 10); 
        } else {
            ctx.fillRect(this.x + this.width - 2, this.y + 14, 3, 10); 
        }
    }
}

// ==========================================================
// --- CLASSE DELLE PIATTAFORME TERRENE ---
// ==========================================================
class Platform {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
    }

    draw(ctx) {
        // Estensione del blocco grafico di terra solida fino al fondo dello schermo
        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(this.x, this.y + 8, this.w, CANVAS_HEIGHT - this.y - 8);
        
        ctx.fillStyle = '#4e342e';
        for (let px = this.x + 12; px < this.x + this.w; px += 32) { 
            ctx.fillRect(px, this.y + 16, 8, 6);
            ctx.fillRect(px - 16, this.y + 28, 6, 4);
        }

        // Manto erboso superficiale superiore
        ctx.fillStyle = '#2e7d32';
        ctx.fillRect(this.x, this.y, this.w, 8);

        ctx.fillStyle = '#4caf50';
        let blockSize = 4;
        for (let gx = this.x; gx < this.x + this.w; gx += blockSize * 2) {
            ctx.fillRect(gx, this.y, blockSize, blockSize);
            ctx.fillRect(gx + blockSize, this.y + 3, blockSize, blockSize * 2);
        }
    }
}

// ==========================================================
// --- CLASSE DELLE SPINE OSTACCOLO (TRIANGOLI) ---
// ==========================================================
class Spike {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
    }

    checkCollision(player) {
        let tolleranzaX = 5; 
        let tolleranzaY = 4;
        let spinaX = this.x + tolleranzaX;
        let spinaY = this.y + tolleranzaY;
        let spinaW = this.w - (tolleranzaX * 2);
        let spinaH = this.h - tolleranzaY;

        return player.x < spinaX + spinaW &&
               player.x + player.width > spinaX &&
               player.y < spinaY + spinaH &&
               player.y + player.height > spinaY;
    }

    draw(ctx) {
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.h);
        ctx.lineTo(this.x + this.w / 2, this.y);
        ctx.lineTo(this.x + this.w / 2, this.y + this.h);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.moveTo(this.x + this.w / 2, this.y);
        ctx.lineTo(this.x + this.w, this.y + this.h);
        ctx.lineTo(this.x + this.w / 2, this.y + this.h);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f39c12';
        ctx.fillRect(this.x + this.w / 2 - 2, this.y + 6, 4, 4);
        ctx.fillRect(this.x + this.w / 2 + 2, this.y + 14, 4, 6);
        ctx.fillRect(this.x + this.w / 2 - 6, this.y + 22, 4, 4);
    }
}

// ==========================================================
// --- CLASSE DELLE MONETE REATTIVE ---
// ==========================================================
class Coin {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.collected = false;
    }

    checkCollision(player) {
        if (this.collected) return false;
        return player.x < this.x + this.w &&
               player.x + player.width > this.x &&
               player.y < this.y + this.h &&
               player.y + player.height > this.y;
    }

    draw(ctx) {
        if (this.collected) return;
        ctx.fillStyle = '#d35400';
        ctx.fillRect(this.x + 4, this.y, 8, 16);
        ctx.fillRect(this.x, this.y + 4, 16, 8); 

        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(this.x + 4, this.y + 2, 8, 12);
        ctx.fillRect(this.x + 2, this.y + 4, 12, 8);

        ctx.fillStyle = '#ffffcc';
        ctx.fillRect(this.x + 6, this.y + 4, 4, 4);
    }
}

// ==========================================================
// --- CLASSE TRAPPOLA DELLA LAVA ONDULATA ---
// ==========================================================
class LavaTrap {
    constructor(x, w, floorY) {
        this.x = x; this.w = w;
        this.floorY = floorY || 415;
    }

    checkCollision(player) {
        if (player.x + player.width > this.x && player.x < this.x + this.w) {
            let colstartX = Math.max(this.x, player.x);
            let colendX = Math.min(this.x + this.w, player.x + player.width);
            for (let fx = this.x; fx < this.x + this.w; fx += 8) {
                if (fx + 8 > colstartX && fx < colendX) {
                    let wave = Math.sin((animationFrameCount / 6) + fx) * 4; 
                    let flameHeight = 8 + wave + (fx % 2 === 0 ? 3 : 0); 
                    if (player.y + player.height > this.floorY - flameHeight) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = '#2c0d0d';
        ctx.fillRect(this.x, this.floorY, this.w, CANVAS_HEIGHT - this.floorY);
        
        ctx.fillStyle = '#3e2723'; 
        ctx.fillRect(this.x, this.floorY + 12, this.w, CANVAS_HEIGHT - this.floorY - 12);

        for (let fx = this.x; fx < this.x + this.w; fx += 8) {
            let wave = Math.sin((animationFrameCount / 6) + fx) * 4; 
            let flameHeight = 8 + wave + (fx % 2 === 0 ? 3 : 0); 
            
            ctx.fillStyle = '#ff4757';
            ctx.fillRect(fx, this.floorY - flameHeight, 4 * 2, flameHeight + 16);

            ctx.fillStyle = '#ffa502';
            ctx.fillRect(fx + 1, this.floorY - (flameHeight * 0.6), 4 * 1.5, (flameHeight * 0.6) + 16);

            ctx.fillStyle = '#eccc68';
            ctx.fillRect(fx + 2, this.floorY - (flameHeight * 0.3), 4, (flameHeight * 0.3) + 16);
        }
    }
}

// ==========================================================
// --- CLASSE TRAPPOLA DEL DINOSAURO SCATTANTE ---
// ==========================================================
class DinosaurTrap {
    constructor(x, w, floorY) {
        this.x = x; this.w = w;
        this.floorY = floorY || 415;
    }

    checkCollision(player) {
        let pinguinoSopra = (player.x + player.width > this.x && player.x < this.x + this.w);
        let offsetScatto = pinguinoSopra ? 20 : 0; 
        
        let dinoX = this.x + 8;
        let dinoY = this.floorY - 20 - offsetScatto;
        let dinoW = this.w - 16;
        let dinoH = 35; 

        return player.x < dinoX + dinoW &&
               player.x + player.width > dinoX &&
               player.y < dinoY + dinoH &&
               player.y + player.height > dinoY;
    }

    draw(ctx, playerX) {
        ctx.fillStyle = '#22120c';
        ctx.fillRect(this.x, this.floorY, this.w, CANVAS_HEIGHT - this.floorY);

        let pinguinoSopra = (playerX + 32 > this.x && playerX < this.x + this.w);
        let idleBob = Math.sin(animationFrameCount / 6) * 3;
        let offsetAttacco = pinguinoSopra ? 20 : idleBob;
        
        let baseDx = this.x + (this.w / 2) - 15;
        let baseDy = this.floorY - 15 - offsetAttacco;

        ctx.fillStyle = '#ff2e2e';
        ctx.fillRect(baseDx - 8, baseDy + 16, 12, 8); 
        ctx.fillRect(baseDx, baseDy + 24, 6, 12); 

        ctx.fillRect(baseDx, baseDy, 28, 26);
        ctx.fillStyle = '#b71c1c'; 
        ctx.fillRect(baseDx, baseDy + 6, 6, 20);
        ctx.fillRect(baseDx + 6, baseDy + 18, 16, 4);

        ctx.fillStyle = '#ff2e2e';
        ctx.fillRect(baseDx + 12, baseDy - 14, 22, 16); 

        if (pinguinoSopra) {
            ctx.fillRect(baseDx + 12, baseDy + 6, 18, 6);
            ctx.fillStyle = '#000000';
            ctx.fillRect(baseDx + 16, baseDy + 2, 16, 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(baseDx + 18, baseDy + 2, 2, 2);
            ctx.fillRect(baseDx + 24, baseDy + 2, 2, 2);
            ctx.fillRect(baseDx + 28, baseDy + 2, 2, 2);
        } else {
            ctx.fillRect(baseDx + 16, baseDy + 2, 18, 6);
            ctx.fillStyle = '#b71c1c';
            ctx.fillRect(baseDx + 16, baseDy + 2, 14, 2);
        }

        ctx.fillStyle = '#f1c40f';
        let occhioX = (playerX < baseDx) ? baseDx + 16 : baseDx + 26;
        ctx.fillRect(occhioX, baseDy - 10, 4, 4);
        ctx.fillStyle = '#000000';
        ctx.fillRect(occhioX + 1, baseDy - 10, 2, 4);

        ctx.fillStyle = '#ff2e2e';
        ctx.fillRect(baseDx + 24, baseDy + 12, 6, 4);
        ctx.fillRect(baseDx + 28, baseDy + 14, 4, 4);
    }
}

// ==========================================================
// --- CLASSE DELLA BANDIERA TRAGUARDO ---
// ==========================================================
class Flag {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
    }

    checkCollision(player) {
        return player.x < this.x + this.w &&
               player.x + player.width > this.x &&
               player.y < this.y + this.h &&
               player.y + player.height > this.y;
    }

    draw(ctx) {
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(this.x + 4, this.y - 40, 8, this.h + 40); 
        ctx.fillStyle = '#757575';
        for(let py = this.y - 40; py < this.y + this.h; py += 12) {
            ctx.fillRect(this.x + 4, py, 8, 4);
        }

        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(this.x + 12, this.y - 36, 24, 16);
        ctx.fillStyle = '#f39c12'; 
        ctx.fillRect(this.x + 12, this.y - 20, 20, 4); 
        ctx.fillRect(this.x + 28, this.y - 32, 8, 8);
    }
}

// ==========================================================
// --- CLASSE DELLA CORONA TRAGUARDO ---
// ==========================================================
class Crown {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
    }

    checkCollision(player) {
        return player.x < this.x + this.w &&
               player.x + player.width > this.x &&
               player.y < this.y + this.h &&
               player.y + player.height > this.y;
    }

    draw(ctx) {
        let bobbing = Math.sin(animationFrameCount / 10) * 4;
        let currentY = this.y + bobbing;
        let pSize = 4;

        ctx.fillStyle = '#d35400';
        ctx.fillRect(this.x, currentY + this.h - (pSize * 2), this.w, pSize * 2);

        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(this.x + pSize, currentY + this.h - (pSize * 3), this.w - (pSize * 2), pSize);
        ctx.fillRect(this.x + pSize, currentY + this.h - (pSize * 6), pSize * 2, pSize * 3);
        ctx.fillRect(this.x + (pSize * 2), currentY + this.h - (pSize * 7), pSize, pSize);
        ctx.fillRect(this.x + this.w - (pSize * 3), currentY + this.h - (pSize * 6), pSize * 2, pSize * 3);
        ctx.fillRect(this.x + this.w - (pSize * 3), currentY + this.h - (pSize * 7), pSize, pSize); 
        ctx.fillRect(this.x + (this.w / 2) - pSize, currentY + this.h - (pSize * 7), pSize * 2, pSize * 4);
        ctx.fillRect(this.x + (this.w / 2) - (pSize / 2), currentY + this.h - (pSize * 8), pSize, pSize);

        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(this.x + (this.w / 2) - (pSize / 2), currentY + this.h - (pSize * 5), pSize, pSize);
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x + (pSize * 2), currentY + this.h - (pSize * 2), pSize, pSize);
        ctx.fillRect(this.x + this.w - (pSize * 3), currentY + this.h - (pSize * 2), pSize, pSize);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + (pSize * 2), currentY + this.h - (pSize * 5), pSize / 2, pSize / 2);
        ctx.fillRect(this.x + (this.w / 2) + pSize, currentY + this.h - (pSize * 6), pSize / 2, pSize / 2); 
    }
}