let config = {
    type: Phaser.AUTO,
    width: 1536,
    height: 512,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload() {
    this.load.image('bgBase', 'assets/background/base.png');
    this.load.image('flyingSpaghetti', 'assets/flying_spaghetti.png');
    this.load.image('moon', 'assets/moon/moon.png');
    this.load.image('clownMoon', 'assets/moon/clown_moon.png');
    this.load.spritesheet('bgGround', 'assets/background/spritesheet.png', { frameWidth: 128, frameHeight: 256 });
    this.load.spritesheet('corgi', 'assets/corgi/spritesheet.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lego', 'assets/lego/spritesheet.png', { frameWidth: 128, frameHeight: 128 });
}

function create() {
    this.add.image(0, 0, 'bgBase').setOrigin(0, 0)
    this.add.image(1400, 100, 'moon')
    this.add.image(1400, 512 - 100, 'clownMoon')

}

function update() {

}