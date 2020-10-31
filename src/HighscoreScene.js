class HighscoreScene extends Phaser.Scene {
    constructor() {
        super({
            key: "HighscoreScene"
        })
    }

    preload() {
        //this.load.spritesheet('button', 'assets/button.png', { frameWidth: 128, frameHeight: 256 })
    }
    create() {
        this.cameras.main.setBackgroundColor('rgba(0,0,0,0.8)')

        //input
        this.keyObj = this.input.keyboard.addKey('SPACE');
        this.keyObj.on('down', function (event) {
            this.scene.switch("GameScene")
        }, this)        //mobile
        this.input.on('pointerdown', function (pointer) {
            this.scene.switch("GameScene")
        }, this)

        this.getHighscore()

    }

    getHighscore() {
        let oReq = new XMLHttpRequest();
        let that = this
        oReq.addEventListener("load", function () {
            let obj = JSON.parse(this.responseText);
            for (let i = 0; i < obj.length; i++) {
                that.add.text(450, 160 + 40 * (i + 1), (i + 1) + ".", { fontSize: '32px', fill: '#ffffff' });
                that.add.text(525, 160 + 40 * (i + 1), 'Name : ' + obj[i].Name, { fontSize: '32px', fill: '#ffffff' });
                that.add.text(825, 160 + 40 * (i + 1), " Score : " + obj[i].Score, { fontSize: '32px', fill: '#ffffff' });
            }
        });
        oReq.open("get", "src/fetch_highscores.php", true);
        oReq.send();
    }

    update() {

    }
}