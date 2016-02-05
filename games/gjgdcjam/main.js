var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function get(what) {
    return document.getElementById(what);
}
var Main = (function () {
    function Main() {
    }
    Main.prototype.init = function () {
        Main.canvas = get('main-canvas');
        Main.canvas.width = 720;
        Main.canvas.height = 480;
        Main.context = Main.canvas.getContext('2d');
        Main.canvasClientRect = Main.canvas.getClientRects().item(0);
        new Mouse();
        new Camera();
        DefaultLevels.init();
        Main.level = new Level(DefaultLevels.levels[0]);
        Main.loop();
    };
    Main.loop = function () {
        requestAnimationFrame(Main.loop);
        Main.context.fillStyle = "#09c6f6";
        Main.context.fillRect(0, 0, Main.canvas.width, Main.canvas.height);
        Main.update();
        Main.render();
    };
    Main.update = function () {
        Main.level.player.update();
        Main.level.update();
    };
    Main.render = function () {
        Main.level.render();
    };
    return Main;
})();
var DefaultLevels = (function () {
    function DefaultLevels() {
    }
    DefaultLevels.init = function () {
        var lvl1 = new Array();
        lvl1 = [[10, 7, 2, 6],
            0, 0, 0, 0, 3, 0, 0, 0, 2, 1,
            0, 0, 0, 0, 0, 3, 0, 0, 2, 1,
            0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
            0, 0, 0, 1, 2, 2, 2, 2, 2, 2,
            0, 0, 0, 1, 0, 0, 0, 3, 0, 0,
            0, 1, 1, 1, 0, 0, 0, 0, 3, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 3];
        DefaultLevels.levels = new Array();
        DefaultLevels.levels.push(lvl1);
    };
    return DefaultLevels;
})();
var Level = (function () {
    function Level(level) {
        this.paused = false;
        var i;
        this.tilesWide = level[0][0];
        this.tilesHigh = level[0][1];
        if (level.length !== this.tilesWide * this.tilesHigh + 1) {
            console.error("Invalid level: ", level);
        }
        this.tileSize = 80;
        this.pixelsWide = this.tilesWide * this.tileSize;
        this.pixelsHigh = this.tilesHigh * this.tileSize;
        this.tiles = new Array();
        for (i = 0; i < this.tilesWide * this.tilesHigh; ++i) {
            this.tiles.push(level[i + 1]);
        }
        this.player = new Player(level[0][2] * this.tileSize - this.tileSize / 2, level[0][3] * this.tileSize - this.tileSize / 2);
        this.itemBlocks = new Array();
        for (i = 0; i < 5; ++i) {
            var x, y;
            do {
                x = Math.floor(Math.random() * this.tilesWide);
                y = Math.floor(Math.random() * this.tilesHigh);
            } while ((this.tiles[x + y * this.tilesWide] !== 1) ||
                (this.isItemBlockAt(x * this.tileSize + this.tileSize / 2, y * this.tileSize + this.tileSize / 2)));
            this.itemBlocks.push(new ItemBlock(x * this.tileSize + this.tileSize / 2, y * this.tileSize + this.tileSize / 2, 15, 15));
        }
    }
    Level.prototype.isItemBlockAt = function (x, y) {
        for (var i in this.itemBlocks) {
            if (this.itemBlocks[i].x === x && this.itemBlocks[i].y === y) {
                return true;
            }
        }
        return false;
    };
    Level.prototype.update = function () {
        this.player.update();
        var index = this.collides();
        if (index !== -1) {
            if (this.itemBlocks[index].destroy()) {
                Sound.play(Sound.blip);
            }
        }
        Camera.followPlayer(this.player);
        for (var i in this.itemBlocks) {
            this.itemBlocks[i].update();
        }
    };
    Level.prototype.collides = function () {
        for (var i in this.itemBlocks) {
            var block = this.itemBlocks[i];
            var w = 0.3 * (block.width + this.player.width);
            var h = 0.3 * (block.height + this.player.height);
            var dx = (block.x - this.player.x);
            var dy = (block.y - this.player.y);
            if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
                return i;
            }
        }
        return -1;
    };
    Level.prototype.render = function () {
        Main.context.fillStyle = Color.offblack.toString();
        Main.context.fillRect(0, 0, Main.canvas.width, Main.canvas.height);
        for (var i in this.tiles) {
            Main.context.fillStyle = this.getTilesColor(this.tiles[i]);
            var x = (i % this.tilesWide) * this.tileSize - Camera.xo;
            var y = Math.floor(i / this.tilesWide) * this.tileSize - Camera.yo;
            Main.context.fillRect(x, y, this.tileSize, this.tileSize);
        }
        for (var i in this.itemBlocks) {
            this.itemBlocks[i].render();
        }
        this.player.render();
    };
    Level.prototype.getTilesColor = function (type) {
        switch (type) {
            case 0:
                return Color.offblack.toString();
            case 1:
                return Color.lightcyan.toString();
            case 2:
                return Color.red.toString();
            case 3:
                return Color.green.toString();
            default:
                return Color.offblack.toString();
        }
    };
    Level.prototype.togglePaused = function () {
        this.paused = !this.paused;
    };
    return Level;
})();
var ItemBlock = (function () {
    function ItemBlock(x, y, width, height) {
        this.animationLength = 30;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.animationTimer = -1;
    }
    ItemBlock.prototype.update = function () {
        if (this.animationTimer != -1) {
            this.animationTimer--;
            if (this.animationTimer < 0) {
                Main.level.itemBlocks.splice(Main.level.itemBlocks.indexOf(this), 1);
            }
        }
    };
    ItemBlock.prototype.render = function () {
        var scale = 1.0;
        if (this.animationTimer > -1 && this.animationTimer < this.animationLength) {
            var alpha = this.animationTimer / 100;
            Main.context.fillStyle = "rgba(255,255,25, " + alpha + ")";
            scale = 1 / (alpha * 2);
        }
        else {
            Main.context.fillStyle = "#ffff19";
        }
        var x = this.x - scale * (this.width / 2);
        var y = this.y - scale * (this.height / 2);
        Main.context.fillRect(x - Camera.xo, y - Camera.yo, this.width * scale, this.height * scale);
    };
    ItemBlock.prototype.destroy = function () {
        if (this.animationTimer === -1) {
            this.animationTimer = this.animationLength;
            return true;
        }
        else {
            return false;
        }
    };
    return ItemBlock;
})();
var Player = (function () {
    function Player(x, y) {
        this.x = x;
        this.y = y;
        this.xv = 0;
        this.yv = 0;
        this.dir = Math.PI / 2;
        this.width = 50;
        this.height = 50;
        this.weapon = new DarkLight();
        this.blink();
    }
    Player.prototype.update = function () {
        var vel = 0.4;
        if (Keyboard.keysdown[Keyboard.KEYS.W] || Keyboard.keysdown[Keyboard.KEYS.UP]) {
            this.xv += Math.cos(this.dir) * vel;
            this.yv += Math.sin(this.dir) * vel;
        }
        else if (Keyboard.keysdown[Keyboard.KEYS.S] || Keyboard.keysdown[Keyboard.KEYS.DOWN]) {
            this.xv += Math.cos(this.dir) * -vel;
            this.yv += Math.sin(this.dir) * -vel;
        }
        this.x += this.xv;
        this.y += this.yv;
        if (this.x < 0) {
            this.x = 0;
        }
        else if (this.x + this.width > Main.level.pixelsWide) {
            this.x = Main.level.pixelsWide - this.width;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        else if (this.y + this.height > Main.level.pixelsHigh) {
            this.y = Main.level.pixelsHigh - this.height;
        }
        this.xv *= 0.85;
        this.yv *= 0.85;
        if (Math.abs(this.xv) < 0.001) {
            this.xv = 0;
        }
        if (Math.abs(this.yv) < 0.001) {
            this.yv = 0;
        }
        if (this.usingMouseInput) {
            if (Math.abs(Mouse.x - (this.x - Camera.xo)) > 7 &&
                Math.abs(Mouse.y - (this.y - Camera.yo)) > 7) {
                this.dir = Math.atan2(Mouse.y - (this.y - Camera.yo), Mouse.x - (this.x - Camera.xo));
            }
        }
        this.eyeBlinkTimer--;
        if (this.eyeBlinkTimer < 0) {
            this.blink();
        }
    };
    Player.prototype.render = function () {
        Main.context.save();
        {
            Main.context.translate(this.x - Camera.xo, this.y - Camera.yo);
            Main.context.rotate(this.dir);
            Main.context.fillStyle = "red";
            var height = this.height - (this.xv * this.xv + this.yv * this.yv) / 2;
            Main.context.fillRect(-this.width / 2, -height / 2, this.width, height);
            if (this.eyeBlinkTimer > 10) {
                Main.context.fillStyle = "white";
                Main.context.fillRect(10, -8 - 10, 10, 10);
                Main.context.fillRect(10, 8, 10, 10);
                Main.context.fillStyle = "black";
                var xx = (Mouse.x - (this.x - Camera.xo));
                var yy = (Mouse.y - (this.y - Camera.yo));
                var mouseDist = (xx * xx) + (yy * yy);
                var pupilY = 8 + (mouseDist / 5000);
                pupilY = Math.min(Math.max(8, pupilY), 11);
                Main.context.fillRect(16, -pupilY - 5, 5, 5);
                Main.context.fillRect(16, pupilY, 5, 5);
            }
        }
        Main.context.restore();
        this.weapon.render();
    };
    Player.prototype.blink = function () {
        this.eyeBlinkTimer = Math.random() * 300 + 300;
    };
    return Player;
})();
var Weapon = (function () {
    function Weapon() {
    }
    Weapon.prototype.render = function () {
    };
    Weapon.prototype.use = function () {
    };
    return Weapon;
})();
var DarkLight = (function (_super) {
    __extends(DarkLight, _super);
    function DarkLight() {
        _super.apply(this, arguments);
    }
    DarkLight.prototype.render = function () {
    };
    DarkLight.prototype.use = function () {
    };
    return DarkLight;
})(Weapon);
var Camera = (function () {
    function Camera() {
        Camera.xo = 0;
        Camera.yo = 500;
        Camera.viewportWidth = Main.canvas.width;
        Camera.viewportHeight = Main.canvas.height;
    }
    Camera.followPlayer = function (player) {
        var targetXo = player.x - Camera.viewportWidth / 2;
        var targetYo = player.y - Camera.viewportHeight / 2;
        Camera.xo = Camera.xo + (targetXo - Camera.xo) * 0.1;
        Camera.yo = Camera.yo + (targetYo - Camera.yo) * 0.1;
        if (Math.abs(Camera.xo - targetXo) < 0.1) {
            Camera.xo = targetXo;
        }
        if (Math.abs(Camera.yo - targetYo) < 0.1) {
            Camera.yo = targetYo;
        }
        Camera.clamp();
    };
    Camera.clamp = function () {
        Camera.xo = Math.min(Math.max(0, Camera.xo), Main.canvas.width);
        Camera.yo = Math.min(Math.max(0, Camera.yo), Main.canvas.height);
    };
    return Camera;
})();
var Color = (function () {
    function Color(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    Color.prototype.toString = function () {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    };
    Color.offblack = new Color(12, 12, 12);
    Color.lightcyan = new Color(141, 255, 255);
    Color.red = new Color(179, 51, 51);
    Color.green = new Color(4, 150, 53);
    return Color;
})();
var Sound = (function () {
    function Sound() {
    }
    Sound.init = function () {
        Sound.blip = get('blipSound');
    };
    Sound.toggleMute = function () {
        Sound.muted = !Sound.muted;
    };
    Sound.changeVolume = function (volume) {
        Sound.volume = volume;
    };
    Sound.play = function (sound) {
        if (Sound.muted) {
            return;
        }
        sound.volume = Sound.volume;
        sound.currentTime = 0;
        sound.play();
    };
    Sound.muted = false;
    Sound.volume = 0.6;
    return Sound;
})();
var Keyboard = (function () {
    function Keyboard() {
    }
    Keyboard.keychange = function (event, down) {
        var keycode = event.keyCode ? event.keyCode : event.which;
        Keyboard.keysdown[keycode] = down;
        if (down && keycode === Keyboard.KEYS.ESC) {
            Main.level.togglePaused();
        }
    };
    Keyboard.KEYS = {
        BACKSPACE: 8, TAB: 9, RETURN: 13, ESC: 27, SPACE: 32, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, INSERT: 45, DELETE: 46, ZERO: 48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57, A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90, TILDE: 192, SHIFT: 999
    };
    Keyboard.keysdown = [];
    return Keyboard;
})();
var Mouse = (function () {
    function Mouse() {
        Mouse.x = -1;
        Mouse.y = -1;
        Mouse.ldown = false;
        Mouse.rdown = false;
    }
    Mouse.onmousebutton = function (event, down) {
        if (event.button === 1 || event.which === 1)
            Mouse.ldown = down;
        else if (event.button === 3 || event.which === 3)
            Mouse.rdown = down;
    };
    Mouse.onmousemove = function (event) {
        Main.level.player.usingMouseInput = true;
        var px = Mouse.x, py = Mouse.y;
        Mouse.x = event.clientX - Main.canvasClientRect.left;
        Mouse.y = event.clientY - Main.canvasClientRect.top - 14;
    };
    return Mouse;
})();
function keydown(event) {
    Keyboard.keychange(event, true);
    if (event.keyCode === Keyboard.KEYS.SPACE)
        return false;
}
function keyup(event) {
    Keyboard.keychange(event, false);
}
window.onkeydown = keydown;
window.onkeyup = keyup;
function clickType(event) {
    if (event.which === 3 || event.button === 2)
        return "right";
    else if (event.which === 1 || event.button === 0)
        return "left";
    else if (event.which === 2 || event.button === 1)
        return "middle";
}
window.onload = function () {
    Sound.init();
    new Main().init();
};
window.onmousedown = function (event) { Mouse.onmousebutton(event, true); };
window.onmouseup = function (event) { Mouse.onmousebutton(event, false); };
window.oncontextmenu = function () { return false; };
window.onmousemove = function (event) { Mouse.onmousemove(event); };
