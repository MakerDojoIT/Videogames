const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#050505',
    physics: { 
        default: 'arcade', 
        arcade: { debug: false } 
    },
    scene: [
        Level1, 
        TransitionScene, 
        Level2, 
        Level3, 
        Level4, 
        Level5, 
        Level6, 
        Level7, 
        Level8, 
        Level9, 
        Level10
    ]
};

const game = new Phaser.Game(config);