class Level1 extends BaseLevel {
    constructor() {
        super('Level1');
    }

    create() {
        super.initLevel({
            larghezza: 800,
            altezza: 750,
            puntiRichiesti: 150,
            numeroLivello: 1
        });
        super.create();
    }

    mostraSchermataVittoria() {
        this.testoLivelloSuperato = this.add.text(this.larghezzaMappa / 2, this.altezzaMappa / 2, 
            "livello superato, secondo livello!!\n\n(premi contemporaneamente R e S)", {
            fontSize: '26px', fontStyle: 'bold', fill: '#ffffff', backgroundColor: '#d35400', align: 'center', padding: { x: 20, y: 20 }
        }).setOrigin(0.5).setDepth(10);
    }

    gestisciPassaggioLivello() {
        if (this.tastoR.isDown && this.tastoS.isDown) {
            this.scene.start('Level3', { punteggio: this.punteggio });
        }
    }
}