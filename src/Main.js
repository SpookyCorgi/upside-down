let gameWidth = 1536
let gameHeight = 1024
let ratio = window.innerWidth / window.innerHeight
if (ratio < 1) {
    gameWidth = 768
}
let config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2000 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    scene: [
        LoadScene, GameScene
    ]
};

let game = new Phaser.Game(config);


