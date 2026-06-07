class BaseLevel extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    init(data) {
        this.punteggio = (data && data.punteggio) || 0;
    }

    initLevel(config) {
        this.larghezzaMappa = config.larghezza;
        this.altezzaMappa = config.altezza;
        this.puntiRichiesti = config.puntiRichiesti;
        this.numeroLivello = config.numeroLivello;

        this.dimensioneBlocco = 20;
        this.velocitaGioco = 140; 
        this.tempoUltimoMovimento = 0;
        
        this.direzione = 'SU';
        this.giocoAvviato = false;
        this.livelloSuperato = false;
        
        this.snake = [];
    }

    preload() {
        this.load.audio('suonoMelaRossa', 'click_003.ogg');
        this.load.audio('suonoMelaOro', 'confirmation_001.ogg');
        this.load.image('testaSerpente', 'snake.png');

        // --- NUOVO: Caricamento delle tre immagini PNG distinte ---
        this.load.image('melaRossa', 'rossa.png');
        this.load.image('melaOro', 'oro.png');
        this.load.image('melaDiamante', 'diamante.png');
    }

    create() {
        this.scale.resize(this.larghezzaMappa, this.altezzaMappa);

        // Generazione terreno
        for (let x = 0; x < this.larghezzaMappa; x += this.dimensioneBlocco) {
            for (let y = 0; y < this.altezzaMappa; y += this.dimensioneBlocco) {
                let n = Math.random();
                if (n < 0.65) {
                    this.add.rectangle(x + 10, y + 10, this.dimensioneBlocco, this.dimensioneBlocco, 0x8b5a2b);
                } else if (n < 0.85) {
                    this.add.rectangle(x + 10, y + 10, this.dimensioneBlocco, this.dimensioneBlocco, 0x4a2f15);
                } else {
                    this.add.rectangle(x + 10, y + 10, this.dimensioneBlocco, this.dimensioneBlocco, 0x8b5a2b);
                    let dimPietra = Math.floor(Math.random() * 6) + 4;
                    this.add.rectangle(x + 10, y + 10, dimPietra, dimPietra, 0x7f8c8d);
                }
            }
        }

        this.ostacoli = this.add.group();

        this.testoPunteggio = this.add.text(20, 20, `PUNTI: ${this.punteggio} | LIVELLO: ${this.numeroLivello}`, {
            fontSize: '22px',
            fontStyle: 'bold',
            fill: '#ffffff',
            backgroundColor: '#4a2f15',
            padding: { x: 10, y: 5 }
        }).setDepth(5).setAlpha(0.65);

        this.tastiera = this.input.keyboard.createCursorKeys();
        this.tastoR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.tastoS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        let centroX = Math.floor((this.larghezzaMappa / 2) / this.dimensioneBlocco) * this.dimensioneBlocco + 10;
        let centroY = Math.floor((this.altezzaMappa / 2) / this.dimensioneBlocco) * this.dimensioneBlocco + 10;

        // Testa serpente
        let testa = this.add.image(centroX, centroY, 'testaSerpente').setDepth(3);
        testa.setDisplaySize(24, 28); 
        this.snake.push(testa);

        // Corpo serpente impostato sul verde chiaro coordinato (0x7fdf39)
        for (let i = 1; i < 3; i++) {
            let pezzo = this.add.rectangle(centroX, centroY + (i * this.dimensioneBlocco), this.dimensioneBlocco - 2, this.dimensioneBlocco - 2, 0x7fdf39);
            this.snake.push(pezzo);
        }

        // --- AGGIORNATO: Utilizzo della chiave immagine 'melaRossa' ---
        this.cibo = this.add.image(centroX, centroY - (this.dimensioneBlocco * 5), 'melaRossa').setDepth(4);
        this.cibo.setDisplaySize(this.dimensioneBlocco - 2, this.dimensioneBlocco - 2);
        
        // --- AGGIORNATO: Utilizzo della chiave immagine 'melaOro' ---
        this.ciboOro = this.add.image(-100, -100, 'melaOro').setDepth(4);
        this.ciboOro.setDisplaySize(this.dimensioneBlocco - 2, this.dimensioneBlocco - 2);

        this.testoIniziale = this.add.text(centroX, centroY + 140, 'PREMI UNA FRECCIA PER PARTIRE', {
            fontSize: '20px',
            fontStyle: 'bold',
            fill: '#ffffff',
            backgroundColor: '#4a2f15',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setDepth(5);
    }

    update(tempoAttuale) {
        if (this.livelloSuperato) {
            this.gestisciPassaggioLivello();
            return;
        }

        if (this.tastiera.left.isDown && this.direzione !== 'DESTRA') { this.direzione = 'SINISTRA'; this.giocoAvviato = true; }
        if (this.tastiera.right.isDown && this.direzione !== 'SINISTRA') { this.direzione = 'DESTRA'; this.giocoAvviato = true; }
        if (this.tastiera.up.isDown && this.direzione !== 'GIU') { this.direzione = 'SU'; this.giocoAvviato = true; }
        if (this.tastiera.down.isDown && this.direzione !== 'SU') { this.direzione = 'GIU'; this.giocoAvviato = true; }

        if (this.giocoAvviato && this.testoIniziale) {
            this.testoIniziale.destroy();
            this.testoIniziale = null;
        }

        if (!this.giocoAvviato) return;

        if (tempoAttuale < this.tempoUltimoMovimento + this.velocitaGioco) return;
        this.tempoUltimoMovimento = tempoAttuale;

        let testaX = this.snake[0].x;
        let testaY = this.snake[0].y;

        if (this.direzione === 'DESTRA') testaX += this.dimensioneBlocco;
        if (this.direzione === 'SINISTRA') testaX -= this.dimensioneBlocco;
        if (this.direzione === 'SU') testaY -= this.dimensioneBlocco;
        if (this.direzione === 'GIU') testaY += this.dimensioneBlocco;

        if (testaX < 10 || testaX > this.larghezzaMappa - 10 || testaY < 10 || testaY > this.altezzaMappa - 10) {
            alert(`GAME OVER: Hai urtato il muro! Punti: ${this.punteggio}`);
            this.riavviaGioco(); return;
        }

        for (let i = 1; i < this.snake.length; i++) {
            if (testaX === this.snake[i].x && testaY === this.snake[i].y) {
                alert(`GAME OVER: Ti sei morso la coda! Punti: ${this.punteggio}`);
                this.riavviaGioco(); return;
            }
        }

        let arrayOstacoli = this.ostacoli.getChildren();
        for (let i = 0; i < arrayOstacoli.length; i++) {
            let bloccoPietra = arrayOstacoli[i];
            if (testaX === bloccoPietra.x && testaY === bloccoPietra.y) {
                alert(`GAME OVER: Hai preso in pieno una pietra! Punti: ${this.punteggio}`);
                this.riavviaGioco(); return;
            }
        }

        let haMangiatoRossa = Math.abs(testaX - this.cibo.x) < 10 && Math.abs(testaY - this.cibo.y) < 10;
        let haMangiatoOro = Math.abs(testaX - this.ciboOro.x) < 10 && Math.abs(testaY - this.ciboOro.y) < 10;

        let ultimaX = this.snake[this.snake.length - 1].x;
        let ultimaY = this.snake[this.snake.length - 1].y;

        for (let i = this.snake.length - 1; i > 0; i--) {
            this.snake[i].setPosition(this.snake[i-1].x, this.snake[i-1].y);
        }
        this.snake[0].setPosition(testaX, testaY);

        if (this.direzione === 'SU') this.snake[0].setAngle(0);
        if (this.direzione === 'GIU') this.snake[0].setAngle(180);
        if (this.direzione === 'SINISTRA') this.snake[0].setAngle(-90);
        if (this.direzione === 'DESTRA') this.snake[0].setAngle(90);

        if (haMangiatoRossa || haMangiatoOro) {
            try {
                this.sound.play(haMangiatoRossa ? 'suonoMelaRossa' : 'suonoMelaOro');
            } catch (e) {}

            this.punteggio += haMangiatoOro ? 20 : 10;
            this.testoPunteggio.setText(`PUNTI: ${this.punteggio} | LIVELLO: ${this.numeroLivello}`);

            // Allungamento coda con blocco verde chiaro coerente (0x7fdf39)
            let nuovoPezzo = this.add.rectangle(ultimaX, ultimaY, this.dimensioneBlocco - 2, this.dimensioneBlocco - 2, 0x7fdf39);
            this.snake.push(nuovoPezzo);

            if (this.punteggio >= this.puntiRichiesti) {
                this.giocoAvviato = false; this.livelloSuperato = true;
                this.cibo.setPosition(-100, -100); this.ciboOro.setPosition(-100, -100);
                this.mostraSchermataVittoria(); return;
            }

            this.gestisciRaccoltaMela(haMangiatoRossa, haMangiatoOro);
        }
    }

    gestisciRaccoltaMela(haMangiatoRossa, haMangiatoOro) {
        this.riposizionaMelaSingola(this.cibo);
    }

    riposizionaMelaSingola(oggettoMela) {
        let maxQuadratiniX = Math.floor(this.larghezzaMappa / this.dimensioneBlocco) - 2;
        let maxQuadratiniY = Math.floor(this.altezzaMappa / this.dimensioneBlocco) - 2;
        let tentativoX, tentativoY;
        let posizioneValida = false;
        while (!posizioneValida) {
            tentativoX = Math.floor(Math.random() * maxQuadratiniX + 1) * this.dimensioneBlocco + 10;
            tentativoY = Math.floor(Math.random() * maxQuadratiniY + 1) * this.dimensioneBlocco + 10;
            posizioneValida = true;
            let arrayOstacoli = this.ostacoli.getChildren();
            for (let i = 0; i < arrayOstacoli.length; i++) {
                if (tentativoX === arrayOstacoli[i].x && tentativoY === arrayOstacoli[i].y) { posizioneValida = false; break; }
            }
            if (posizioneValida) {
                for (let i = 0; i < this.snake.length; i++) {
                    if (tentativoX === this.snake[i].x && tentativoY === this.snake[i].y) { posizioneValida = false; break; }
                }
            }
        }
        oggettoMela.setPosition(tentativoX, tentativoY);
    }

    riavviaGioco() {
        this.giocoAvviato = false;
        this.scene.start('Level1', { punteggio: 0 });
    }

    mostraSchermataVittoria() {}
    gestisciPassaggioLivello() {}
}