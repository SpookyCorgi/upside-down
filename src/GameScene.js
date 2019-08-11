class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene"
        })

    }

    init() {
        this.speed = -700
        this.groundMargin = 4
        this.gameOver = false
        this.time = 0
        this.score = 0
        this.gravity = 4000
        this.jumpVelocity = -1500
        this.spawnDistance = 1536
    }

    preload() {
        this.load.image('bgBase', 'assets/background/base.png');
        this.load.image('flyingSpaghetti', 'assets/flying_spaghetti.png');
        this.load.image('moon', 'assets/moon/moon.png');
        this.load.image('clownMoon', 'assets/moon/clown_moon.png');
        this.load.image('physGround', 'assets/background/physic_ground.png');
        this.load.spritesheet('bgGround', 'assets/background/spritesheet.png', { frameWidth: 128, frameHeight: 256 })
        this.load.spritesheet('corgi', 'assets/corgi/spritesheet.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('reverseCorgi', 'assets/reversed-corgi/spritesheet.png', { frameWidth: 128, frameHeight: 128 });
        this.load.atlas('lego', 'assets/lego/lego.png', 'assets/lego/lego.json')
    }

    create() {
        this.createBackground()
        this.createLego()
        this.createCorgi()


        //collider
        this.physics.add.collider(this.corgi, this.physGround)
        this.physics.add.overlap(this.corgi, this.legoGroup, this.touchLego, null, this)
        this.physics.add.collider(this.reverseCorgi, this.reversePhysGround)


        //input
        //keyboard
        this.keyObj = this.input.keyboard.addKey('SPACE');  // Get key object
        this.keyObj.on('down', function (event) {
            if (this.gameOver) {
                this.gameOver = false
                this.scene.restart()
            }
        }, this)
        //mobile
        this.input.on('pointerdown', function (pointer) {
            if (this.gameOver) {
                this.gameOver = false
                this.scene.restart()
            }
            if (this.corgi.body.touching.down) {
                this.corgi.setVelocityY(this.jumpVelocity)
            }
            if (this.reverseCorgi.body.touching.up) {
                this.reverseCorgi.setVelocityY(-this.jumpVelocity)
            }

        }, this)

        //set time in create before update
        this.time = Date.now()
    }

    createBackground() {
        //setup background
        this.cameras.main.setBackgroundColor("#ffffff")

        this.physGround = this.physics.add.staticImage(100, this.game.config.height / 2 - this.groundMargin, 'physGround').setOrigin(0.5, 0)
        this.physGround.refreshBody()
        this.reversePhysGround = this.physics.add.staticImage(100, this.game.config.height / 2 + this.groundMargin, 'physGround').setOrigin(0.5, 1)
        this.reversePhysGround.refreshBody()

        this.add.image(0, this.game.config.height / 2, 'bgBase').setOrigin(0, 0)

        //creating ground pooling system
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

        //moons
        this.add.image(this.game.config.width, 0, 'moon').setOrigin(1, 0)
        this.add.image(this.game.config.width, this.game.config.height, 'clownMoon').setOrigin(1)


        //score text
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    }

    createLego() {
        //creating lego pooling system
        this.legoGroup = this.add.group(
            {
                removeCallback: function (lego) {
                    lego.scene.legoPool.add(lego)
                }
            }
        )
        this.legoPool = this.add.group(
            {
                removeCallback: function (lego) {
                    lego.scene.legoGroup.add(lego)
                }
            }
        )
        this.addLego(this.spawnDistance)
    }

    createCorgi() {
        //main character corgi
        this.corgi = this.physics.add.sprite(100, this.game.config.height / 2 - this.groundMargin, 'corgi').setOrigin(0.5, 1)
        this.corgi.setGravityY(this.gravity)

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('corgi', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'corgi', frame: 0 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'scared',
            frames: [{ key: 'corgi', frame: 4 }],
            frameRate: 20
        });

        //main character reverse corgi
        this.reverseCorgi = this.physics.add.sprite(100, this.game.config.height / 2 + this.groundMargin, 'reverseCorgi').setOrigin(0.5, 0)
        this.reverseCorgi.setGravityY(-this.gravity)

        this.anims.create({
            key: 'reverseRun',
            frames: this.anims.generateFrameNumbers('reverseCorgi', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'reverseJump',
            frames: [{ key: 'reverseCorgi', frame: 0 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'reverseScared',
            frames: [{ key: 'reverseCorgi', frame: 4 }],
            frameRate: 20
        });

    }

    addGround(posX) {
        let ground
        ground = this.physics.add.image(posX, game.config.height / 2, "bgGround", Phaser.Math.Between(0, 3).toString())
        ground.setVelocityX(this.speed)
        this.groundGroup.add(ground)
    }

    cycleGround(deltaX) {
        let ground = Phaser.Utils.Array.GetRandom(this.groundPool.getChildren())
        ground.x = this.game.config.width + ground.width + deltaX
        ground.active = true
        ground.visible = true
        this.groundPool.remove(ground)
    }

    addLego(posX, count) {
        let lego
        let type = Phaser.Math.Between(0, 8).toString()

        let poolLength = this.legoPool.getLength()
        let existed = false
        for (let i = 0; i < poolLength; i++) {
            //console.log(poolLength)
            if (this.legoPool.getChildren()[i].getData('type') === type) {
                existed = true

                lego = this.legoPool.getChildren()[i]
                lego.x = posX
                lego.active = true
                lego.visible = true
                this.legoPool.remove(lego)
                break
            }
        }


        if (!existed) {
            lego = this.physics.add.image(posX, game.config.height / 2 - this.groundMargin, 'lego', type).setOrigin(0, 1)
            lego.setData('type', type)
            this.legoGroup.add(lego)
        }

        lego.setVelocityX(this.speed)
        if (count) {
            this.addLego(lego.x + lego.width, 0)
        }

        //console.log(this.legoPool.getLength())
    }

    touchLego() {
        //console.log("fuck")
        this.physics.pause()
        this.gameOver = true
    }

    update() {
        //update score
        if (!this.gameOver) {
            let deltaTime = Date.now() - this.time
            this.time = Date.now()
            this.score += deltaTime / 100000 * -this.speed
            this.scoreText.setText('Score: ' + Math.floor(this.score));
        }


        //corgi status
        if (this.keyObj.isDown && this.corgi.body.touching.down) {
            this.corgi.setVelocityY(this.jumpVelocity)
        }

        if (this.gameOver) {
            this.corgi.anims.play('scared', true)
        }
        else if (!this.corgi.body.touching.down) {
            this.corgi.anims.play('jump', true)
        } else {
            this.corgi.anims.play('run', true)
        }

        //reverse corgi status
        if (this.keyObj.isDown && this.reverseCorgi.body.touching.up) {
            this.reverseCorgi.setVelocityY(-this.jumpVelocity)
        }

        if (this.gameOver) {
            this.reverseCorgi.anims.play('reverseScared', true)
        }
        else if (!this.reverseCorgi.body.touching.up) {
            this.reverseCorgi.anims.play('reverseJump', true)
        } else {
            this.reverseCorgi.anims.play('reverseRun', true)
        }




        //spawning lego
        let minDistance = this.spawnDistance
        //we are removing array items here so it is really important not to use foreach but use for loop backwards
        for (let i = this.legoGroup.getLength() - 1; i >= 0; i--) {
            let lego = this.legoGroup.getChildren()[i]
            let legoDistance = this.spawnDistance - lego.x - lego.width;
            minDistance = Math.min(minDistance, legoDistance);
            if (lego.x <= -lego.width) {
                lego.setVelocityX(0)
                this.legoGroup.killAndHide(lego)
                this.legoGroup.remove(lego)
            }
        }
        if (minDistance > 1000) {
            this.addLego(this.spawnDistance, Phaser.Math.Between(0, 1))
        }


        //moving background
        for (let i = this.groundGroup.getLength() - 1; i >= 0; i--) {
            let ground = this.groundGroup.getChildren()[i]
            if (ground.x <= -ground.width / 2) {
                this.groundGroup.killAndHide(ground)
                this.groundGroup.remove(ground)
                if (this.groundGroup.getLength() <= 12) {
                    this.cycleGround(ground.x)
                }
            }
        }
    }
}

