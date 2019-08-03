let config = {
    type: Phaser.AUTO,
    width: 1536,
    height: 1024,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2000 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        GameScene
    ]
};


let game = new Phaser.Game(config);


