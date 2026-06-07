class Level5 extends BaseLevel {
    constructor() {
        super('Level5');
    }

    create() {
        super.initLevel({
            larghezza: 600,
            altezza: 600,
            puntiRichiesti: 700, 
            numeroLivello: 5
        });
        super.create();
        this.velocitaGioco = 110; 

        this.ciboDiamante = this.add.rectangle(-100, -100, this.dimensioneBlocco - 2, this.dimensioneBlocco - 2, 0x00ffff).setDepth(4);
        this.pezziDaCrescere = 0;
        this.generaClusterPietre(4);
    }

    generaClusterPietre(numeroGruppi) {
        let centroMappaX = this.larghezzaMappa / 2;
        let centroMappaY = this.altezzaMappa / 2;
        for (let i = 0; i < numeroGruppi; i++) {
            let startX, startY;
            let coordinataValida = false;
            while (!coordinataValida) {
                startX = Math.floor(Math.random() * 24 + 3) * this.dimensioneBlocco + 10;
                startY = Math.floor(Math.random() * 24 + 3) * this.dimensioneBlocco + 10;
                if (Math.abs(startX - centroMappaX) > 80 || Math.abs(startY - centroMappaY) > 80) { coordinataValida = true; }
            }
            let blocchiDaCreare = Math.floor(Math.random() * 2) + 3;
            let bloccoCorrenteX = startX; let bloccoCorrenteY = startY;
            for (let j = 0; j < blocchiDaCreare; j++) {
                let pietra = this.add.rectangle(bloccoCorrenteX, bloccoCorrenteY, this.dimensioneBlocco - 2, this.dimensioneBlocco - 2, 0x7f8c8d);
                this.ostacoli.add(pietra);
                let direzioneCasuale = Math.floor(Math.random() * 4);
                if (direzioneCasuale === 0) bloccoCorrenteY -= this.dimensioneBlocco;
                else if (direzioneCasuale === 1) bloccoCorrenteY += this.dimensioneBlocco;
                else if (direzioneCasuale === 2) bloccoCorrenteX -= this.dimensioneBlocco;
                else if (direzioneCasuale === 3) bloccoCorrenteX += this.dimensioneBlocco;
                if (bloccoCorrenteX < 30 || bloccoCorrenteX > this.larghezzaMappa - 30 || bloccoCorrenteY < 30 || bloccoCorrenteY > this.altezzaMappa - 30) {
                    bloccoCorrenteX = startX; bloccoCorrenteY = startY;
                }
            }
        }
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
                alert(`GAME OVER: Hai urtato una pietra! Punti: ${this.punteggio}`);
                this.riavviaGioco(); return;
            }
        }

        let haMangiatoRossa = Math.abs(testaX - this.cibo.x) < 10 && Math.abs(testaY - this.cibo.y) < 10;
        let haMangiatoOro = Math.abs(testaX - this.ciboOro.x) < 10 && Math.abs(testaY - this.ciboOro.y) < 10;
        let haMangiatoDiamante = Math.abs(testaX - this.ciboDiamante.x) < 10 && Math.abs(testaY - this.ciboDiamante.y) < 10;

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

        if (haMangiatoRossa || haMangiatoOro || haMangiatoDiamante) {
            try {
                this.sound.play(haMangiatoRossa ? 'suonoMelaRossa' : 'suonoMelaOro');
            } catch (e) {}

            if (haMangiatoRossa) {
                this.punteggio += 10; this.pezziDaCrescere += 2;
            } else if (haMangiatoOro) {
                this.punteggio += 20; this.pezziDaCrescere += 3;
            } else if (haMangiatoDiamante) {
                this.punteggio += 50; this.pezziDaCrescere += 4;
            }

            this.testoPunteggio.setText(`PUNTI: ${this.punteggio} | LIVELLO: ${this.numeroLivello}`);

            if (this.punteggio >= this.puntiRichiesti) {
                this.giocoAvviato = false; this.livelloSuperato = true;
                this.cibo.setPosition(-100, -100); this.ciboOro.setPosition(-100, -100); this.ciboDiamante.setPosition(-100, -100);
                this.mostraSchermataVittoria(); return;
            }

            this.gestisciRaccoltaMela5(haMangiatoRossa, haMangiatoOro, haMangiatoDiamante);
        }

        if (this.pezziDaCrescere > 0) {
            let nuovoPezzo = this.add.rectangle(ultimaX, ultimaY, this.dimensioneBlocco - 2, this.dimensioneBlocco - 2, 0x1a531a);
            this.snake.push(nuovoPezzo);
            this.pezziDaCrescere--; 
        }
    }

    gestisciRaccoltaMela5(haMangiatoRossa, haMangiatoOro, haMangiatoDiamante) {
        super.riposizionaMelaSingola(this.cibo);
        if (Math.random() < 0.35) {
            super.riposizionaMelaSingola(this.ciboOro);
            while (this.ciboOro.x === this.cibo.x && this.ciboOro.y === this.cibo.y) { super.riposizionaMelaSingola(this.ciboOro); }
        } else { if (haMangiatoOro || haMangiatoRossa || haMangiatoDiamante) this.ciboOro.setPosition(-100, -100); }

        if (Math.random() < 0.15) {
            super.riposizionaMelaSingola(this.ciboDiamante);
            while ((this.ciboDiamante.x === this.cibo.x && this.ciboDiamante.y === this.cibo.y) || 
                   (this.ciboDiamante.x === this.ciboOro.x && this.ciboDiamante.y === this.ciboOro.y)) { super.riposizionaMelaSingola(this.ciboDiamante); }
        } else { if (haMangiatoOro || haMangiatoRossa || haMangiatoDiamante) this.ciboDiamante.setPosition(-100, -100); }
    }

    mostraSchermataVittoria() {
        this.testoLivelloSuperato = this.add.text(this.larghezzaMappa / 2, this.altezzaMappa / 2, 
            "COMPLIMENTI! HAI ABBATUTTO IL LIVELLO 5!!!\nSEI IL CAMPIONE SUPREMO DI SNAKE!\n\n(premi R e S per reiniziare da capo)", {
            fontSize: '22px', fontStyle: 'bold', fill: '#ffffff', backgroundColor: '#00ffff', align: 'center', padding: { x: 20, y: 20 }
        }).setOrigin(0.5).setDepth(10);
    }

    gestisciPassaggioLivello() {
        if (this.tastoR.isDown && this.tastoS.isDown) { this.scene.start('Level1', { punteggio: 0 }); }
    }
}