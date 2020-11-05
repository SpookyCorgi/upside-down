class HighscoreScene extends Phaser.Scene {
    constructor() {
        super({
            key: "HighscoreScene"
        })
    }

    init(data) {
        this.score = data.score
    }
    create() {
        //get php echo
        this.getHighscore()

        //bg color
        this.cameras.main.setBackgroundColor('rgba(0,0,0,0.8)')

        //title
        this.add.text(550, 150, "Scoreboard", { fontSize: '64px', fill: '#ffffff' });

        //button
        this.button = this.add.sprite(768, 800, 'okButton', 0).setInteractive();

        this.button.on('pointerover', function () {
            this.setFrame(1);
        });

        this.button.on('pointerout', function () {
            this.setFrame(0);
        });

        let that = this
        this.button.on('pointerdown', function () {
            this.setFrame(2);
            that.sendHighscore()
        });


        this.button.on('pointerup', function () {

            that.scene.switch("GameScene")
        });

    }

    sendHighscore() {
        let returnXHR = new XMLHttpRequest()
        returnXHR.open("POST", "src/save_highscores.php", true)
        returnXHR.setRequestHeader("Content-type", "application/json")
        returnXHR.send("sheepy " + this.score)
        //console.log(JSON.stringify(this.obj))
    }

    getHighscore() {
        let getXHR = new XMLHttpRequest()
        let that = this
        getXHR.addEventListener("load", function () {
            that.obj = JSON.parse(this.responseText)
            for (let i = 0; i < that.obj.length; i++) {
                that.add.text(450, 230 + 40 * (i + 1), (i + 1) + ".", { fontSize: '32px', fill: '#ffffff' });
                that.add.text(520, 230 + 40 * (i + 1), 'Name : ' + that.obj[i].Name, { fontSize: '32px', fill: '#ffffff' });
                that.add.text(870, 230 + 40 * (i + 1), " Score : " + that.obj[i].Score, { fontSize: '32px', fill: '#ffffff' });
            }
        })
        getXHR.open("get", "src/fetch_highscores.php", true)
        getXHR.send()
    }

    update() {

    }
}