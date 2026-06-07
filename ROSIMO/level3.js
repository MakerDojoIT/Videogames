class Level3 extends BaseLevel {
    constructor() {
        super('Level3');
    }

    create() {
        super.initLevel({
            larghezza: 600,
            altezza: 600,
            puntiRichiesti: 410, 
            numeroLivello: 3
        });
        super.create();
        this.velocitaGioco = 115; 
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

    gestisciRaccoltaMela(haMangiatoRossa, haMangiatoOro) {
        let probabilitaMelaOro = Math.random() < 0.35;
        if (probabilitaMelaOro) {
            super.riposizionaMelaSingola(this.cibo);
            super.riposizionaMelaSingola(this.ciboOro);
            while (this.ciboOro.x === this.cibo.x && this.ciboOro.y === this.cibo.y) { super.riposizionaMelaSingola(this.ciboOro); }
        } else {
            if (haMangiatoRossa) super.riposizionaMelaSingola(this.cibo);
            this.ciboOro.setPosition(-100, -100);
        }
    }

    mostraSchermataVittoria() {
        this.testoLivelloSuperato = this.add.text(this.larghezzaMappa / 2, this.altezzaMappa / 2, 
            "livello superato, quarto livello!!\n\n(premi contemporaneamente R e S)", {
            fontSize: '26px', fontStyle: 'bold', fill: '#ffffff', backgroundColor: '#d35400', align: 'center', padding: { x: 20, y: 20 }
        }).setOrigin(0.5).setDepth(10);
    }

    gestisciPassaggioLivello() {
        if (this.tastoR.isDown && this.tastoS.isDown) {
            this.scene.start('Level4', { punteggio: this.punteggio });
        }
    }
}