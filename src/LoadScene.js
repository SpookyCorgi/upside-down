class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: "LoadScene"
        })


    }
    create() {
        this.scene.start('GameScene')
    }

}