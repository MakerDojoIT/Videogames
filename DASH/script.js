const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.getElementById('mainMenu');
const preview = document.getElementById('playerPreview');
const scoreElement = document.getElementById('score');

canvas.width = 800;
canvas.height = 400;

// --- AUDIO CONFIG ---
const jumpSound = new Audio('assets/jump.wav');
const deathSound = new Audio('assets/death.ogg');
const bgMusic = new Audio('assets/bgm.ogg');

jumpSound.volume = 0.3;
deathSound.volume = 0.4;
bgMusic.volume = 0.2;
bgMusic.loop = true;

// --- COSTANTI DI BILANCIAMENTO ---
const colors = ['#0f0', '#0ff', '#f0f', '#ffff00', '#ff0055', '#ffffff'];
let currentColorIndex = 0;
let gameState = 'MENU';
let score = 0;
const gameSpeed = 6;

// Parametri fisici per calcolare la raggiungibilità
let player = {
    x: 100,
    y: 0, 
    width: 30,
    height: 30,
    color: colors[0],
    dy: 0,
    jumpForce: 15,
    gravity: 0.9,
    grounded: false
};

let platforms = [];
const floorY = 370; 
let lastPlatformX = 0; // Teniamo traccia della fine dell'ultima piattaforma
let lastPlatformY = 300;

// --- LOGICA DI GENERAZIONE (SOLUZIONE AL BUG) ---

const initLevel = () => {
    platforms = [];
    score = 0;
    if(scoreElement) scoreElement.innerText = `Score: 0`;
    
    // 1. Piattaforma di spawn sicura
    const spawnPlatform = {
        x: 0,
        y: 300,
        width: 400,
        height: 25 
    };
    
    platforms.push(spawnPlatform);
    lastPlatformX = spawnPlatform.x + spawnPlatform.width;
    lastPlatformY = spawnPlatform.y;

    player.x = 100;
    player.y = spawnPlatform.y - player.height - 10; 
    player.dy = 0;
    player.grounded = false;
};

const createPlatformChain = () => {
    // Generiamo piattaforme solo se l'ultima creata sta per entrare nello schermo
    // Questo evita la sovrapposizione infinita
    while (lastPlatformX < canvas.width + 500) {
        
        // VINCOLO ORIZZONTALE: Distanza tra piattaforme (Gap)
        // Minimo 120px per separarle visivamente, Max 190px per la raggiungibilità
        const minGap = 120; 
        const maxGap = 190; 
        const gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;

        // VINCOLO VERTICALE: Dislivello rispetto alla precedente
        const maxVerticalChange = 65; 
        let newY = lastPlatformY + (Math.random() * (maxVerticalChange * 2) - maxVerticalChange);
        
        // Limiti dello schermo per la Y
        newY = Math.max(150, Math.min(310, newY));

        const newWidth = 120 + Math.random() * 100;
        const newX = lastPlatformX + gap;

        const p = {
            x: newX,
            y: newY,
            width: newWidth,
            height: 25
        };

        platforms.push(p);
        
        // AGGIORNAMENTO RIFERIMENTI: Cruciale per evitare sovrapposizioni
        lastPlatformX = newX + newWidth;
        lastPlatformY = newY;
    }
};

const resetGame = () => {
    deathSound.currentTime = 0;
    deathSound.play().catch(() => {});
    bgMusic.pause();
    bgMusic.currentTime = 0;
    gameState = 'MENU';
    mainMenu.classList.remove('hidden');
    initLevel();
};

// --- CORE LOGIC ---

const update = () => {
    player.dy += player.gravity;
    player.y += player.dy;
    player.grounded = false;

    // Gestione collisioni precisa
    platforms.forEach(p => {
        if (player.x + player.width > p.x && player.x < p.x + p.width) {
            // Collisione piedi
            if (player.y + player.height > p.y && player.y + player.height < p.y + p.height + player.dy && player.dy >= 0) {
                player.y = p.y - player.height;
                player.dy = 0;
                player.grounded = true;
            }
            // Collisione testa
            else if (player.y < p.y + p.height && player.y > p.y + p.height + player.dy && player.dy < 0) {
                player.y = p.y + p.height;
                player.dy = 0;
            }
        }
    });

    if (gameState !== 'PLAYING') return;

    if (player.y + player.height > floorY) {
        resetGame();
        return;
    }

    // Movimento del mondo
    platforms.forEach(p => p.x -= gameSpeed);
    lastPlatformX -= gameSpeed; // Anche il riferimento deve scorrere!

    // Punteggio
    if (Math.floor(Date.now() / 100) % 10 === 0) {
        score++;
        scoreElement.innerText = `Score: ${Math.floor(score/10)}`;
    }

    createPlatformChain();
    platforms = platforms.filter(p => p.x + p.width > -100);
};

const draw = () => {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Spine
    ctx.fillStyle = '#ff0055';
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, floorY + 30);
        ctx.lineTo(i + 10, floorY);
        ctx.lineTo(i + 20, floorY + 30);
        ctx.fill();
    }

    // Piattaforme con bordo per visibilità
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00d4ff';
    ctx.fillStyle = '#00d4ff';
    platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#000';
        ctx.strokeRect(p.x, p.y, p.width, p.height);
        ctx.shadowBlur = 10;
    });

    // Player
    ctx.shadowBlur = 15;
    ctx.shadowColor = player.color;
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    ctx.shadowBlur = 0;
    update();
    requestAnimationFrame(draw);
};

// --- INPUT ---
window.addEventListener('keydown', (e) => {
    if (gameState === 'MENU') {
        if (e.code === 'ArrowRight') { currentColorIndex = (currentColorIndex + 1) % colors.length; updatePreview(); }
        if (e.code === 'ArrowLeft') { currentColorIndex = (currentColorIndex - 1 + colors.length) % colors.length; updatePreview(); }
        if (e.code === 'Space') { 
            gameState = 'PLAYING'; 
            mainMenu.classList.add('hidden'); 
            bgMusic.play().catch(() => {});
        }
    } else {
        if ((e.code === 'Space' || e.code === 'ArrowUp') && player.grounded) {
            player.dy = -player.jumpForce;
            player.grounded = false;
            jumpSound.currentTime = 0;
            jumpSound.play().catch(() => {});
        }
    }
});

const updatePreview = () => {
    player.color = colors[currentColorIndex];
    if (preview) preview.style.backgroundColor = player.color;
};

initLevel();
updatePreview();
draw();