class Level2 extends BaseLevel {
    constructor() {
        super('Level2');
    }

    create() {
        super.initLevel({
            larghezza: 600,
            altezza: 600,
            puntiRichiesti: 250, 
            numeroLivello: 2
        });
        super.create();
        this.velocitaGioco = 115; 
    }

    mostraSchermataVittoria() {
        this.testoLivelloSuperato = this.add.text(this.larghezzaMappa / 2, this.altezzaMappa / 2, 
            "livello superato, terzo livello!!\n\n(premi contemporaneamente R e S)", {
            fontSize: '26px', fontStyle: 'bold', fill: '#ffffff', backgroundColor: '#d35400', align: 'center', padding: { x: 20, y: 20 }
        }).setOrigin(0.5).setDepth(10);
    }

    gestisciPassaggioLivello() {
        if (this.tastoR.isDown && this.tastoS.isDown) {
            this.scene.start('Level3', { punteggio: this.punteggio });
        }
    }
}