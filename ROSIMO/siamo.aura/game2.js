const canvas = document.getElementById("schermoGioco");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("valore-punti");

let punteggio = 0;
let giocoAvviato = false; // Parte in modalità "PAUSA"

// 1. IL DRAGO (Posizione iniziale visibile subito)
const drago = {
    x: 60,
    y: 175, // Al centro dell'altezza
    larghezza: 50,
    altezza: 50,
    velocita: 8
};

// 2. IL FUOCO (Posizione iniziale visibile subito a destra)
const fuoco = {
    x: 550, // Visibile dentro lo schermo fin dall'inizio!
    y: 185,
    dimensione: 30, // Leggermente più grande per vederlo meglio
    velocita: 6
};

// Registro dei tasti premuti
const tasti = {};

// Cattura i tasti premuti
window.addEventListener("keydown", function(evento) {
    // QUALSIASI TASTO FA PARTIRE IL GIOCO SE È FERMO
    if (!giocoAvviato) {
        giocoAvviato = true;
        // Spostiamo il fuoco per la prima vera corsa casuale
        rigeneraFuoco(); 
    }
    tasti[evento.keyCode] = true;
});

window.addEventListener("keyup", function(evento) {
    tasti[evento.keyCode] = false;
});

// Sposta il fuoco in un punto casuale a destra
function rigeneraFuoco() {
    fuoco.x = canvas.width + 30;
    fuoco.y = Math.floor(Math.random() * (canvas.height - fuoco.dimensione));
}

// LOGICA (Muove gli oggetti solo se il gioco è avviato)
function aggiorna() {
    if (!giocoAvviato) return; // Blocca i movimenti se non hai premuto un tasto

    // Movimento verticale del drago (38 = Su, 40 = Giù)
    if (tasti[38] && drago.y > 0) {
        drago.y -= drago.velocita;
    }
    if (tasti[40] && drago.y < canvas.height - drago.altezza) {
        drago.y += drago.velocita;
    }

    // Muovi il fuoco verso sinistra
    fuoco.x -= fuoco.velocita;

    // Se il drago tocca il fuoco
    if (
        drago.x < fuoco.x + fuoco.dimensione &&
        drago.x + drago.larghezza > fuoco.x &&
        drago.y < fuoco.y + fuoco.dimensione &&
        drago.y + drago.altezza > fuoco.y
    ) {
        punteggio += 1;
        scoreElement.innerText = punteggio;
        rigeneraFuoco(); // Si rigenera istantaneamente a destra
    }

    // Se il fuoco esce dallo schermo a sinistra, si rigenera a destra
    if (fuoco.x + fuoco.dimensione < 0) {
        rigeneraFuoco();
    }
}

// GRAFICA (Disegna sempre, sia a gioco fermo che avviato!)
function disegna() {
    // Sfondo del canvas scuro
    ctx.fillStyle = "#1a252f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. DISEGNA SEMPRE IL DRAGO (Quadrato Verde)
    ctx.fillStyle = "#27ae60";
    ctx.fillRect(drago.x, drago.y, drago.larghezza, drago.altezza);
    
    // Occhio del drago
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(drago.x + 35, drago.y + 10, 8, 8);

    // 2. DISEGNA SEMPRE IL FUOCO (Quadrato Arancione)
    ctx.fillStyle = "#e67e22";
    ctx.fillRect(fuoco.x, fuoco.y, fuoco.dimensione, fuoco.dimensione);
    // Centro del fuoco rosso
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(fuoco.x + 6, fuoco.y + 6, fuoco.dimensione - 12, fuoco.dimensione - 12);

    // 3. SE IL GIOCO È FERMO, SCRIVI LE ISTRUZIONI SOPRA I PERSONAGGI
    if (!giocoAvviato) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Velo scuro di sfondo per la scritta
        ctx.fillRect(0, 130, canvas.width, 100);

        ctx.fillStyle = "#ffffff"; // Testo bianco
        ctx.font = "bold 26px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PREMI UN TASTO PER INIZIARE", canvas.width / 2, 190);
    }
}

// IL LOOP DI GIOCO (Gira continuamente a 60 FPS)
function loop() {
    aggiorna();
    disegna();
    requestAnimationFrame(loop);
}

// Avvia il sistema grafico
loop();