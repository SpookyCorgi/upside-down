let gameWidth = 1536
let gameHeight = 1024
let ratio = window.innerWidth / window.innerHeight
if (ratio < 1) {
    gameWidth = 1536
}
let config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER
    },
    scene: [
        LoadScene, GameScene, HighscoreScene
    ]
};

let game = new Phaser.Game(config);


