function get(what) {
    return document.getElementById(what);
}
var Game = (function () {
    function Game() {
        Game.resourceFolder = "../games/breakout/res/";
    }
    Game.init = function () {
        Game.canvas = get('gameCanvas');
        Game.context = Game.canvas.getContext('2d');
        Game.infoContext = get('infoCanvas').getContext('2d');
        Game.canvasClientRect = Game.canvas.getBoundingClientRect();
        Game.SIZE = { w: Game.canvas.width, h: Game.canvas.height };
        Game.iSIZE = { w: Game.infoContext.canvas.width, h: Game.infoContext.canvas.height };
        Game.lastTick = Math.floor(performance.now());
        Game.lastRender = Game.lastTick;
        Game.tickLength = 17;
        Game.level = new Level();
        Game.loop(performance.now());
    };
    Game.loop = function (tFrame) {
        window.requestAnimationFrame(Game.loop);
        var nextTick = Game.lastTick + Game.tickLength;
        var numTicks = 0;
        if (tFrame > nextTick) {
            var timeSinceTick = tFrame - Game.lastTick;
            numTicks = Math.floor(timeSinceTick / Game.tickLength);
        }
        Game.queueUpdates(numTicks);
        Game.render();
        Game.lastRender = tFrame;
    };
    Game.queueUpdates = function (numTicks) {
        for (var i = 0; i < numTicks; i++) {
            Game.lastTick = Game.lastTick + Game.tickLength;
            Game.update(Game.lastTick);
        }
    };
    Game.update = function (tickCount) {
        Game.level.update();
    };
    Game.render = function () {
        Game.context.fillStyle = "#0e132e";
        Game.context.fillRect(0, 0, Game.SIZE.w, Game.SIZE.h);
        Game.infoContext.fillStyle = "#262d59";
        Game.infoContext.fillRect(0, 0, Game.iSIZE.w, Game.iSIZE.h);
        Game.infoContext.fillStyle = "#001";
        Game.infoContext.fillRect(0, Game.iSIZE.h - 2, Game.iSIZE.w, 2);
        Game.level.render();
    };
    Game.togglePause = function () {
        Game.paused = !Game.paused;
    };
    Game.canvasClientRect = { left: 0, top: 0 };
    Game.paused = false;
    return Game;
})();
var Level = (function () {
    function Level() {
        this.ballstill = true;
        this.deathcount = 0;
        this.player = new Paddle();
        this.balls = new Array(1);
        this.balls[0] = new Ball();
        this.xo = 70;
        this.yo = 25;
        this.heartImg = new Image();
        this.heartImg.src = "../games/breakout/res/heart.png";
        this.reset();
    }
    Level.prototype.update = function () {
        if (Game.paused)
            return;
        if (this.gamestate === Level.gamestates.playing) {
            this.player.update();
            for (var i = 0; i < this.balls.length; i++) {
                this.balls[i].update(this.player);
            }
            if (this.checkBoardWon()) {
                this.deathcount--;
                this.die();
                this.gamestate = Level.gamestates.won;
            }
        }
        else {
            if (Mouse.ldown) {
                this.reset();
            }
        }
    };
    Level.prototype.checkBoardWon = function () {
        for (var i in this.blocks) {
            if (this.blocks[i].colour !== 0)
                return false;
        }
        return true;
    };
    Level.prototype.die = function () {
        var i;
        this.balls = new Array(1);
        this.balls[0] = new Ball();
        this.player.reset();
        this.ballstill = true;
        this.deathcount++;
        if (this.deathcount >= 3) {
            this.gamestate = Level.gamestates.lost;
        }
    };
    Level.prototype.destroySquare = function (xp, yp, ball) {
        Sound.play(Sound.boom);
        var x = (xp - this.xo) / 100;
        var y = (yp - this.yo) / 35;
        for (var yy = Math.max(y - 1, 0); yy <= Math.min(y + 1, Level.height - 1); yy++) {
            for (var xx = Math.max(x - 1, 0); xx <= Math.min(x + 1, Level.width - 1); xx++) {
                if (this.blocks[xx + yy * Level.width].colour === 0)
                    continue;
                this.blocks[xx + yy * Level.width].destroy(ball);
            }
        }
    };
    Level.prototype.reset = function () {
        var i;
        Game.paused = false;
        this.gamestate = Level.gamestates.playing;
        this.deathcount = 0;
        this.ballstill = true;
        this.balls = new Array(1);
        this.balls[0] = new Ball();
        this.player.reset();
        this.blocks = new Array(Level.width * Level.height);
        for (i = 0; i < this.blocks.length; i++) {
            this.blocks[i] = new Block((i % Level.width) * 100 + this.xo, Math.floor(i / Level.width) * 35 + this.yo, this.getColour(i, 3));
        }
    };
    Level.prototype.getColour = function (i, pattern) {
        if (!pattern)
            pattern = 6;
        switch (pattern) {
            case 0:
                return (i % 2 - Math.floor(i / Level.width) % 2) === 0 ? 1 : 2;
            case 1:
                return i % Level.width + 2;
            case 2:
                return Math.floor(i / Level.width) + 2;
            case 3:
                return 7 - Math.floor(i / Level.width) + 2;
            case 4:
                return (Math.floor(i / Level.width) + i % Level.width) % 8 + 2;
            case 5:
                return (Math.floor(i / Level.width) + (8 - i % Level.width)) % 8 + 2;
            case 6:
                return Math.floor(Math.random() * 8) + 2;
            default:
                console.error("invalid number passed to Level.getColour: ", pattern);
                return i % Level.width + 1;
        }
    };
    Level.prototype.render = function () {
        var i;
        this.player.render();
        for (i = 0; i < this.balls.length; i++) {
            this.balls[i].render();
        }
        for (i in this.blocks) {
            if (this.blocks[i].colour === 0)
                continue;
            else
                this.blocks[i].render();
        }
        if (this.gamestate === Level.gamestates.lost || this.gamestate === Level.gamestates.won) {
            Game.context.fillStyle = "#123";
            Game.context.fillRect(Game.SIZE.w / 2 - 110, 112, 220, 100);
            Game.context.fillRect(Game.SIZE.w / 2 - 80, 252, 160, 30);
            Game.context.strokeStyle = "#EEF";
            Game.context.lineWidth = 2;
            Game.context.strokeRect(Game.SIZE.w / 2 - 110, 112, 220, 100);
            Game.context.strokeRect(Game.SIZE.w / 2 - 80, 252, 160, 30);
            Game.context.fillStyle = "white";
            Game.context.font = "36px Poiret One";
            var msg = "Game Over!";
            Game.context.fillText(msg, Game.SIZE.w / 2 - Game.context.measureText(msg).width / 2, 150);
            Game.context.font = "28px Poiret One";
            msg = "You " + (this.gamestate === Level.gamestates.won ? "Won!" : "Lost!");
            Game.context.fillText(msg, Game.SIZE.w / 2 - Game.context.measureText(msg).width / 2, 200);
            Game.context.font = "20px Poiret One";
            if (Game.lastTick % 800 > 400)
                Game.context.fillStyle = "grey";
            msg = "Click to restart";
            Game.context.fillText(msg, Game.SIZE.w / 2 - Game.context.measureText(msg).width / 2, 275);
        }
        else if (this.ballstill) {
            if (Game.lastTick % 1000 > 500)
                Game.context.fillStyle = "grey";
            else
                Game.context.fillStyle = "white";
            Game.context.font = "30px Poiret One";
            var msg = "Click to begin";
            Game.context.fillText(msg, Game.SIZE.w / 2 - Game.context.measureText(msg).width / 2, 380);
        }
        for (i = 0; i < 3 - this.deathcount; i++) {
            Game.infoContext.drawImage(this.heartImg, 25 + i * 40, Game.iSIZE.h / 2 - 16);
        }
    };
    Level.width = 6;
    Level.height = 8;
    Level.gamestates = { playing: -1, lost: 0, won: 1 };
    return Level;
})();
var Block = (function () {
    function Block(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.powerup = Math.floor(Math.random() * 24);
        if (this.powerup > Block.powerups.length - 1) {
            this.powerup = 0;
        }
    }
    Block.loadImages = function () {
        Block.block_images = new Array(10);
        Block.block_images[0] = null;
        Block.block_images[1] = new Image();
        Block.block_images[1].src = Game.resourceFolder + "blocks/grey.png";
        Block.block_images[2] = new Image();
        Block.block_images[2].src = Game.resourceFolder + "blocks/red.png";
        Block.block_images[3] = new Image();
        Block.block_images[3].src = Game.resourceFolder + "blocks/orange.png";
        Block.block_images[4] = new Image();
        Block.block_images[4].src = Game.resourceFolder + "blocks/yellow.png";
        Block.block_images[5] = new Image();
        Block.block_images[5].src = Game.resourceFolder + "blocks/green.png";
        Block.block_images[6] = new Image();
        Block.block_images[6].src = Game.resourceFolder + "blocks/blue.png";
        Block.block_images[7] = new Image();
        Block.block_images[7].src = Game.resourceFolder + "blocks/darkblue.png";
        Block.block_images[8] = new Image();
        Block.block_images[8].src = Game.resourceFolder + "blocks/purple.png";
        Block.block_images[9] = new Image();
        Block.block_images[9].src = Game.resourceFolder + "blocks/pink.png";
        Block.powerup_images[0] = null;
        Block.powerup_images[1] = new Image();
        Block.powerup_images[1].src = Game.resourceFolder + "powerups/bomb.png";
        Block.powerup_images[2] = new Image();
        Block.powerup_images[2].src = Game.resourceFolder + "powerups/longer_paddle.png";
        Block.powerup_images[3] = new Image();
        Block.powerup_images[3].src = Game.resourceFolder + "powerups/slicing_ball.png";
        Block.powerup_images[4] = new Image();
        Block.powerup_images[4].src = Game.resourceFolder + "powerups/add_ball.png";
        Block.powerup_images[5] = new Image();
        Block.powerup_images[5].src = Game.resourceFolder + "powerups/add_heart.png";
    };
    Block.prototype.destroy = function (ball) {
        if (this.colour === 0)
            return;
        this.colour = 0;
        switch (Block.powerups[this.powerup]) {
            case "":
                break;
            case "bomb":
                Game.level.destroySquare(this.x, this.y, ball);
                break;
            case "bigger_paddle":
                Game.level.player.biggerTimer = 300;
                break;
            case "slice_ball":
                ball.slices = 100;
                break;
            case "extra_ball":
                Game.level.balls.push(new Ball());
                Game.level.balls[Game.level.balls.length - 1].shoot();
                break;
            case "extra_life":
                Game.level.deathcount--;
                break;
        }
    };
    Block.prototype.render = function () {
        Game.context.drawImage(Block.block_images[this.colour], this.x, this.y);
        if (this.powerup !== 0) {
            Game.context.drawImage(Block.powerup_images[this.powerup], this.x + Block.width / 2 - 7, this.y + 3);
        }
    };
    Block.width = 80;
    Block.height = 20;
    Block.block_images = Array();
    Block.powerups = ["", "bomb", "bigger_paddle", "slice_ball", "extra_ball", "extra_life"];
    Block.powerup_images = Array();
    return Block;
})();
var Paddle = (function () {
    function Paddle() {
        this.biggerTimer = 0;
        this.reset();
        this.img = new Image();
        this.img.src = Game.resourceFolder + "player_paddle.png";
    }
    Paddle.prototype.reset = function () {
        this.x = 270;
        this.y = 450;
        this.width = 180;
        this.height = 25;
        this.maxv = 25;
        this.biggerTimer = 0;
    };
    Paddle.prototype.update = function () {
        this.biggerTimer--;
        if (this.biggerTimer > 0) {
            if (this.biggerTimer < 100) {
                this.width = 180 + this.biggerTimer;
            }
            else {
                this.width = 280;
            }
        }
        else {
            this.width = 180;
        }
        if (Game.level.ballstill && Mouse.ldown) {
            Game.level.balls[0].shoot();
            return;
        }
        if (Game.level.ballstill)
            return;
        var destx = Math.min(Math.max(Mouse.x - this.width / 2, 0), Game.SIZE.w - this.width);
        var amount = Math.min(Math.abs(this.x - destx), this.maxv);
        this.x += destx > this.x ? amount : -amount;
    };
    Paddle.prototype.render = function () {
        Game.context.drawImage(this.img, this.x, this.y, this.width, this.height);
    };
    return Paddle;
})();
var Ball = (function () {
    function Ball() {
        this.maxXv = 8;
        this.slices = 0;
        this.reset();
        this.img = new Image();
        this.img.src = Game.resourceFolder + "ball.png";
        this.img_slicing = new Image();
        this.img_slicing.src = Game.resourceFolder + "ball_slicing.png";
    }
    Ball.prototype.reset = function () {
        this.x = 360;
        this.y = 440;
        this.xv = 0;
        this.yv = 0;
        this.r = 10;
    };
    Ball.prototype.update = function (player) {
        this.x += this.xv;
        this.y += this.yv;
        this.slices--;
        if (this.x + this.r > player.x && this.x - this.r < player.x + player.width && this.y + this.r > player.y && this.y - this.r < player.y + player.height) {
            Sound.play(Sound.blip);
            this.yv = -this.yv;
            this.y = player.y - this.r;
            this.xv += ((this.x - player.x - player.width / 2) / 100) * 5;
            if (this.xv > this.maxXv)
                this.xv = this.maxXv;
            if (this.xv < -this.maxXv)
                this.xv = -this.maxXv;
            return;
        }
        if (this.x > Game.SIZE.w - this.r) {
            Sound.play(Sound.bloop);
            this.xv = -this.xv;
            this.x = Game.SIZE.w - this.r;
        }
        if (this.x < this.r) {
            Sound.play(Sound.bloop);
            this.xv = -this.xv;
            this.x = this.r;
        }
        if (this.y < this.r) {
            Sound.play(Sound.bloop);
            this.yv = -this.yv;
            this.y = this.r;
        }
        if (this.y > Game.SIZE.h) {
            if (Game.level.balls.length > 1) {
                Game.level.balls.splice(Game.level.balls.indexOf(this), 1);
                return;
            }
            Sound.play(Sound.die);
            Game.level.die();
            return;
        }
        var c = this.collides();
        if (c !== -1) {
            Sound.play(Sound.bloop);
            if (this.slices > 0) {
                return;
            }
            if (this.x > Game.level.blocks[c].x + Block.width) {
                this.xv = Math.abs(this.xv);
            }
            if (this.x < Game.level.blocks[c].x) {
                this.xv = -Math.abs(this.xv);
            }
            if (this.y > Game.level.blocks[c].y + Block.height) {
                this.yv = Math.abs(this.yv);
            }
            if (this.y < Game.level.blocks[c].y) {
                this.yv = -Math.abs(this.yv);
            }
        }
    };
    Ball.prototype.collides = function () {
        for (var i in Game.level.blocks) {
            var b = Game.level.blocks[i];
            if (b.colour === 0)
                continue;
            if (this.x + this.r > b.x && this.x - this.r < b.x + Block.width && this.y + this.r > b.y && this.y - this.r < b.y + Block.height) {
                Game.level.blocks[i].destroy(this);
                return i;
            }
        }
        return -1;
    };
    Ball.prototype.shoot = function () {
        Game.level.ballstill = false;
        this.yv = -7;
        do {
            this.xv = Math.floor(Math.random() * 10) - 5;
        } while (this.xv >= -1 && this.xv <= 1);
    };
    Ball.prototype.render = function () {
        if (this.slices < 60 && this.slices % 20 < 10) {
            Game.context.drawImage(this.img, this.x - this.r, this.y - this.r);
        }
        else {
            Game.context.drawImage(this.img_slicing, this.x - this.r, this.y - this.r);
        }
    };
    return Ball;
})();
var Mouse = (function () {
    function Mouse() {
    }
    Mouse.update = function (event) {
        Mouse.x = event.clientX - Game.canvasClientRect.left;
        Mouse.y = event.clientY - Game.canvasClientRect.top;
    };
    Mouse.down = function (event) {
        if (event.button === 1 || event.which === 1)
            Mouse.ldown = true;
        else if (event.button === 3 || event.which === 3)
            Mouse.rdown = true;
    };
    Mouse.up = function (event) {
        if (event.button === 1 || event.which === 1)
            Mouse.ldown = false;
        else if (event.button === 3 || event.which === 3)
            Mouse.rdown = false;
    };
    Mouse.x = 0;
    Mouse.y = 0;
    Mouse.ldown = false;
    Mouse.rdown = false;
    return Mouse;
})();
var Sound = (function () {
    function Sound() {
    }
    Sound.init = function () {
        Sound.blip = get('blipSound');
        Sound.bloop = get('bloopSound');
        Sound.die = get('dieSound');
        Sound.boom = get('boomSound');
        Sound.life = get('lifeSound');
        Sound.volumeSlider = get('volumeSlider');
    };
    Sound.changeVolume = function () {
        Sound.volume = Number(Sound.volumeSlider.value) / 100;
    };
    Sound.toggleMute = function () {
        Sound.muted = !Sound.muted;
    };
    Sound.play = function (sound) {
        if (Sound.muted)
            return;
        sound.volume = Sound.volume;
        sound.currentTime = 0;
        sound.play();
    };
    Sound.muted = false;
    Sound.volume = 0.5;
    return Sound;
})();
function toggleFooter(which) {
    var front = '1', back = '0', about = get('aboutFooter');
    if (which === 'about') {
        if (about.className === 'short') {
            about.style.zIndex = front;
            about.className = 'long';
        }
        else {
            about.className = 'short';
        }
    }
}
function keydown(event) {
    if (event.keyCode === 27 || event.which === 27) {
        Game.togglePause();
        if (Game.level.ballstill)
            Game.paused = false;
    }
}
window.onkeydown = keydown;
window.onload = function () {
    Game();
    Block.loadImages();
    Sound.init();
    Game.init();
};
