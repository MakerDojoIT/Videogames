const config = {
    type: Phaser.AUTO,
    width: 800,             
    height: 750,            
    backgroundColor: '#8b5a2b',
    parent: 'game-container', 
    scene: [Level1, Level2, Level3, Level4, Level5] 
};

const game = new Phaser.Game(config);