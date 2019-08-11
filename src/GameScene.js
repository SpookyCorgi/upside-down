class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene"
        })
        this.highscore = 0
    }

    init() {
        this.baseSpeed = -800
        this.speed = -800
        this.speedLimit = -1600
        this.groundMargin = 4
        this.gameOver = false
        this.time = 0
        this.score = 0
        this.gravity = 4000
        this.jumpVelocity = -1500
        this.spawnDistance = 1536
        this.maxDisLimit = 1500
        this.minDisLimit = 1000
        this.disLimit = 1000
    }

    preload() {
        this.load.image('bgBase', 'assets/background/base.png');
        this.load.image('flyingSpaghetti', 'assets/flying_spaghetti.png');
        this.load.image('moon', 'assets/moon/moon.png');
        this.load.image('clownMoon', 'assets/moon/clown_moon.png');
        this.load.image('physGround', 'assets/background/physic_ground.png');
        this.load.spritesheet('bgGround', 'assets/background/spritesheet.png', { frameWidth: 128, frameHeight: 256 })
        this.load.spritesheet('corgi', 'assets/corgi/spritesheet.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('reversedCorgi', 'assets/reversed-corgi/spritesheet.png', { frameWidth: 128, frameHeight: 128 });
        this.load.atlas('lego', 'assets/lego/lego.png', 'assets/lego/lego.json')
        this.load.atlas('reversedLego', 'assets/lego/reversed_lego.png', 'assets/lego/reversed_lego.json')
    }

    create() {
        this.createBackground()
        this.createLego()
        this.createCorgi()


        //collider
        this.physics.add.collider(this.corgi, this.physGround)
        this.physics.add.overlap(this.corgi, this.legoGroup, this.touchLego, null, this)
        this.physics.add.collider(this.reversedCorgi, this.reversedPhysGround)


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
            if (this.reversedCorgi.body.touching.up) {
                this.reversedCorgi.setVelocityY(-this.jumpVelocity)
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
        this.reversedPhysGround = this.physics.add.staticImage(100, this.game.config.height / 2 + this.groundMargin, 'physGround').setOrigin(0.5, 1)
        this.reversedPhysGround.refreshBody()

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


        //creating lego pooling system
        this.reversedLegoGroup = this.add.group(
            {
                removeCallback: function (lego) {
                    lego.scene.reversedLegoPool.add(lego)
                }
            }
        )
        this.reversedLegoPool = this.add.group(
            {
                removeCallback: function (lego) {
                    lego.scene.reversedLegoGroup.add(lego)
                }
            }
        )

        this.addLego(this.spawnDistance, Phaser.Math.Between(0, 1), 'topAndBottom')
    }

    createCorgi() {
        //main character corgi
        this.corgi = this.physics.add.sprite(100, this.game.config.height / 2 - this.groundMargin, 'corgi').setOrigin(0.5, 1)
        this.corgi.setSize(115, 60)
        this.corgi.setOffset(0, 68)
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

        //main character reversed corgi
        this.reversedCorgi = this.physics.add.sprite(100, this.game.config.height / 2 + this.groundMargin, 'reversedCorgi').setOrigin(0.5, 0)
        this.reversedCorgi.setGravityY(-this.gravity)

        this.anims.create({
            key: 'reversedRun',
            frames: this.anims.generateFrameNumbers('reversedCorgi', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'reversedJump',
            frames: [{ key: 'reversedCorgi', frame: 0 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'reversedScared',
            frames: [{ key: 'reversedCorgi', frame: 4 }],
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

    addLego(posX, count, topOrBottom) {
        let layer = Phaser.Math.Between(0, 1)
        let furthestX = 0

        for (let i = 0; i <= layer; i++) {

            let type = Phaser.Math.Between(0, 2)

            let x = posX + 40 * Phaser.Math.Between(0, 2 - type)
            let y = game.config.height / 2 - this.groundMargin - 44 * i
            let reversedY = game.config.height / 2 + this.groundMargin + 44 * i

            if (topOrBottom === 'top' || topOrBottom === 'topAndBottom') {
                let lego = this.poolingLego(x, y, type, i, this.legoPool, this.legoGroup, 'lego', 1)

                lego.setVelocityX(this.speed)

                furthestX = Math.max(furthestX, (lego.x + lego.width))
            }

            if (topOrBottom === 'bottom' || topOrBottom === 'topAndBottom') {
                let lego = this.poolingLego(x, reversedY, type, i, this.reversedLegoPool, this.reversedLegoGroup, 'reversedLego', 0)

                lego.setVelocityX(this.speed)

                furthestX = Math.max(furthestX, (lego.x + lego.width))
            }

        }

        if (count) {
            this.addLego(furthestX, 0, topOrBottom)
        }

        //console.log(this.legoPool.getLength())
    }

    poolingLego(x, y, type, layer, pool, group, source, originY) {
        let lego
        let poolLength = pool.getLength()
        let existed = false
        for (let j = 0; j < poolLength; j++) {
            console.log(poolLength)
            if (pool.getChildren()[j].getData('type') === type) {
                existed = true

                lego = pool.getChildren()[j]
                lego.x = x
                lego.y = y
                lego.active = true
                lego.visible = true
                pool.remove(lego)
                lego.depth = layer
                break
            }
        }

        if (!existed) {
            lego = this.physics.add.image(x, y, source, type).setOrigin(0, originY)
            lego.setData('type', type)
            group.add(lego)
        }

        return lego
    }
    touchLego() {
        //console.log("fuck")
        this.physics.pause()
        this.gameOver = true
        this.highscore = Math.max(this.highscore, Math.floor(this.score))
    }

    update() {
        //update score
        if (!this.gameOver) {
            let deltaTime = Date.now() - this.time
            this.time = Date.now()
            this.score += deltaTime / 100000 * -this.speed
            this.scoreText.setText('Score: ' + Math.floor(this.score) + ' Highscore: ' + this.highscore);

            this.speed = Math.max(this.baseSpeed - this.score, this.speedLimit)
        }


        //corgi status
        if (this.keyObj.isDown && this.corgi.body.touching.down) {
            this.corgi.setVelocityY(this.jumpVelocity)
        }

        if (this.gameOver) {
            this.corgi.anims.play('scared', true)
        }
        else if (!this.corgi.body.touching.down) {
            //this.corgi.anims.play('jump', true)
        } else {
            this.corgi.anims.play('run', true)
        }

        //reversed corgi status
        if (this.keyObj.isDown && this.reversedCorgi.body.touching.up) {
            this.reversedCorgi.setVelocityY(-this.jumpVelocity)
        }

        if (this.gameOver) {
            this.reversedCorgi.anims.play('reversedScared', true)
        }
        else if (!this.reversedCorgi.body.touching.up) {
            //this.reversedCorgi.anims.play('reversedJump', true)
        } else {
            this.reversedCorgi.anims.play('reversedRun', true)
        }


        //testing limit
        let close = false

        //spawning lego
        let minDistance = this.spawnDistance
        //we are removing array items here so it is really important not to use foreach but use for loop backwards
        for (let i = this.legoGroup.getLength() - 1; i >= 0; i--) {
            let lego = this.legoGroup.getChildren()[i]
            lego.setVelocityX(this.speed)
            let legoDistance = this.spawnDistance - lego.x - lego.width;
            minDistance = Math.min(minDistance, legoDistance);
            if (lego.x <= -lego.width) {
                lego.setVelocityX(0)
                this.legoGroup.killAndHide(lego)
                this.legoGroup.remove(lego)
            }


            //testing limit
            let limit
            if (this.score < 300) {
                limit = 300
            } else {
                limit = 400
            }
            if (lego.x < limit) {
                close = true
            }
        }

        //reversed lego
        for (let i = this.reversedLegoGroup.getLength() - 1; i >= 0; i--) {
            let lego = this.reversedLegoGroup.getChildren()[i]
            lego.setVelocityX(this.speed)
            let legoDistance = this.spawnDistance - lego.x - lego.width;
            minDistance = Math.min(minDistance, legoDistance);
            if (lego.x <= -lego.width) {
                lego.setVelocityX(0)
                this.reversedLegoGroup.killAndHide(lego)
                this.reversedLegoGroup.remove(lego)
            }


            //testing limit
            let limit
            if (this.score < 300) {
                limit = 300
            } else {
                limit = 400
            }
            if (lego.x < limit) {
                close = true
            }
        }


        //testing limit
        /*if (close && this.corgi.body.touching.down) {
            this.corgi.setVelocityY(this.jumpVelocity)
            this.reversedCorgi.setVelocityY(-this.jumpVelocity)

        }*/


        if (minDistance > this.disLimit) {
            this.disLimit = Phaser.Math.Between(this.minDisLimit, this.maxDisLimit)
            let tob
            if (this.score < 300) {
                tob = 'topAndBottom'
            } else {
                let num = Phaser.Math.Between(0, 8)
                if (num < 3) {
                    tob = 'topAndBottom'
                } else if (num < 6) {
                    tob = 'top'
                } else {
                    tob = 'bottom'
                }
            }
            this.addLego(this.spawnDistance, Phaser.Math.Between(0, 1), tob)
        }


        //moving background
        for (let i = this.groundGroup.getLength() - 1; i >= 0; i--) {
            let ground = this.groundGroup.getChildren()[i]
            ground.setVelocityX(this.speed)
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

