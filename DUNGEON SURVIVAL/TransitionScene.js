class TransitionScene extends Phaser.Scene {
    constructor() { super('TransitionScene'); }

    init(data) { 
        this.passed = data || { status: 'START', level: 1, hp: 100, scale: 1 };
    }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 1).setDepth(0);
        
        let msg = this.passed.status === 'GAME OVER' ? 'HAI PERSO!' : `LIVELLO ${this.passed.level - 1} COMPLETATO`;
        this.add.text(400, 200, msg, { fontSize: '40px', fill: '#0f0', fontWeight: 'bold' }).setOrigin(0.5).setDepth(100);

        let buttonLabel = this.passed.status === 'GAME OVER' ? 'RICOMINCIA PARTITA' : 'VAI AL LIVELLO ' + this.passed.level;
        
        let nextButton = this.add.text(400, 350, buttonLabel, { 
            fontSize: '28px', fill: '#000', backgroundColor: '#0f0', padding: { x: 20, y: 10 }, fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(100).setInteractive({ useHandCursor: true });

        const proceed = () => {
            this.input.keyboard.off('keydown-SPACE'); // Pulizia specifica
            nextButton.disableInteractive();
            
            if (this.passed.status === 'GAME OVER') {
                window.location.reload();
            } else {
                this.scene.start(`Level${this.passed.level}`, {
                    hp: this.passed.hp, scale: this.passed.scale, level: this.passed.level 
                });
            }
        };

        nextButton.on('pointerdown', () => proceed());
        this.input.keyboard.once('keydown-SPACE', () => proceed());

        this.add.text(400, 450, "(Premi SPAZIO per continuare)", { fontSize: '16px', fill: '#888' }).setOrigin(0.5).setDepth(100);
    }
}