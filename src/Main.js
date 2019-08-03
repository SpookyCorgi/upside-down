let config = {
    type: Phaser.AUTO,
    width: 1536,
    height: 512,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        GameScene
    ]
};


let game = new Phaser.Game(config);


