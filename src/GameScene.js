class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene"
        })
    }

    preload() {
        this.load.image('bgBase', 'assets/background/base.png');
        this.load.image('flyingSpaghetti', 'assets/flying_spaghetti.png');
        this.load.image('moon', 'assets/moon/moon.png');
        this.load.image('clownMoon', 'assets/moon/clown_moon.png');
        this.load.image('physGround', 'assets/background/physic_ground.png');
        this.load.spritesheet('bgGround', 'assets/background/spritesheet.png', { frameWidth: 128, frameHeight: 256 })
        this.load.spritesheet('corgi', 'assets/corgi/spritesheet.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('lego', 'assets/lego/spritesheet.png', { frameWidth: 128, frameHeight: 128 });
    }

    create() {
        this.cameras.main.setBackgroundColor("#ffffff")
        this.physGround = this.physics.add.staticSprite(100, this.game.config.height / 2 + 60, 'physGround')
        this.add.image(0, this.game.config.height / 2, 'bgBase').setOrigin(0, 0)
        this.groundGroup = this.add.group(
            {
                removeCallback: function (ground) {
                    ground.scene.groundPool.add(ground)
                }
            }
        )
        this.groundPool = this.add.group(
            {
                removeCallback: function (ground) {
                    ground.scene.groundGroup.add(ground)
                }
            }
        )
        for (let i = 0; i < 24; i++) {
            let pos = i * 128
            this.addGround(pos)
        }

        this.add.image(1400, 100, 'moon')
        this.add.image(1400, this.game.config.height - 100, 'clownMoon')

        this.corgi = this.physics.add.sprite(100, this.game.config.height / 2 - 68, 'corgi')

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('corgi', { start: 3, end: 0 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.corgi, this.physGround);

        this.keyObj = this.input.keyboard.addKey('SPACE');  // Get key object
        this.keyObj.on('down', function (event) {
            this.corgi.setVelocityY(-800)
        }, this);
    }


    addGround(posX) {
        let ground;
        ground = this.add.image(posX, game.config.height / 2, "bgGround", Math.floor(Math.random() * 4).toString())
        this.groundGroup.add(ground)
    }

    cycleGround() {
        let ground = Phaser.Utils.Array.GetRandom(this.groundPool.getChildren())
        ground.x = this.game.config.width + 64
        ground.active = true
        ground.visible = true
        this.groundPool.remove(ground)
    }

    update() {
        this.corgi.anims.play('run', true)
        //console.log("pool:" + this.groundPool.getLength())
        //console.log("group:" + this.groundGroup.getLength())

        this.groundGroup.getChildren().forEach(function (ground) {
            ground.x -= 2
            if (ground.x <= -64) {
                this.groundGroup.killAndHide(ground)
                this.groundGroup.remove(ground)
                if (this.groundGroup.getLength() <= 12) {
                    this.cycleGround()
                }
            }
        }, this);
    }
}

