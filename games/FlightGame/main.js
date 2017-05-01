function get(what) {
    return document.getElementById(what);
}
var Main = (function () {
    function Main() {
    }
    Main.prototype.init = function () {
        Main.canvas = get('gameCanvas');
        Main.context = Main.canvas.getContext('2d');
        Main.plane = new Plane();
        Main.reset();
        Main.arrowsImage = new Image();
        Main.arrowsImage.src = "/assets/img/arrows.png";
        Main.loop();
    };
    Main.generateObstacle = function (previousX) {
        var result = new Array(3);
        result[0] = previousX + Math.floor(Math.random() * 80) + 300;
        result[1] = Math.floor(Math.random() * 100) + 85;
        result[2] = Math.floor(Math.random() * 350) + 50;
        return result;
    };
    Main.loop = function () {
        requestAnimationFrame(Main.loop);
        var blue = Math.floor(((Main.plane.yv + 15) / 30) * 200 + 50);
        Main.context.fillStyle = "rgb(59, 145, " + blue + ")";
        Main.context.fillRect(0, 0, Main.canvas.width, Main.canvas.height);
        Main.update();
        Main.render();
    };
    Main.update = function () {
        Main.plane.update();
        Camera.update();
    };
    Main.render = function () {
        Main.context.drawImage(Main.arrowsImage, Camera.xo + 150, Main.canvas.height / 2);
        Main.context.fillStyle = "#3bbbfa";
        for (var i in Main.obstacles) {
            var height = Main.obstacles[i][1];
            var pos = Main.obstacles[i][2];
            var width = 20 + -Math.abs(parseInt(i) % 30 - 15);
            Main.context.fillRect(Camera.xo + Main.obstacles[i][0], 0, width, pos);
            Main.context.fillRect(Camera.xo + Main.obstacles[i][0], pos + height, width, Main.canvas.height - (pos + height));
        }
        Main.plane.render();
    };
    Main.reset = function () {
        Main.obstacles = new Array(650);
        var px = 175;
        for (var i = 0; i < Main.obstacles.length; ++i) {
            Main.obstacles[i] = Main.generateObstacle(px);
            px = Main.obstacles[i][0];
        }
        Main.plane.reset();
        Camera.reset();
        Keyboard.reset();
    };
    Main.collides = function () {
        for (var i in this.obstacles) {
            if (Main.plane.x + 10 > this.obstacles[i][0] &&
                Main.plane.x < (this.obstacles[i][0] + 10 + parseInt(i) * 2) &&
                (Main.plane.y < this.obstacles[i][2] || Main.plane.y > this.obstacles[i][2] + this.obstacles[i][1])) {
                return true;
            }
        }
        return false;
    };
    Main.currentIndex = 0;
    return Main;
}());
var Plane = (function () {
    function Plane() {
        this.currentIndex = 0;
        this.reset();
    }
    Plane.prototype.update = function () {
        var vSpeed = 1.25;
        var maxVSpeed = 15;
        if (Keyboard.keysdown[Keyboard.KEYS.W] || Keyboard.keysdown[Keyboard.KEYS.UP]) {
            this.yv -= vSpeed;
        }
        if (Keyboard.keysdown[Keyboard.KEYS.S] || Keyboard.keysdown[Keyboard.KEYS.DOWN]) {
            this.yv += vSpeed;
        }
        this.yv = Math.max(Math.min(this.yv, maxVSpeed), -maxVSpeed);
        this.x += this.xv;
        this.y += this.yv;
        this.yv += 0.35;
        if (this.y < 0) {
            this.y = 0;
            this.yv = -this.yv * 0.8;
        }
        else if (this.y > Main.canvas.height - 10) {
            this.y = Main.canvas.height - 10;
            this.yv = -this.yv * 0.8;
        }
        if (Main.collides()) {
            Main.reset();
        }
        this.prevPoss[this.currentIndex][0] = this.x + 5;
        this.prevPoss[this.currentIndex++][1] = this.y + 5;
        this.currentIndex %= this.prevPoss.length;
    };
    Plane.prototype.render = function () {
        Main.context.strokeStyle = "rgba(148, 192, 204, 0.7)";
        Main.context.lineWidth = 5;
        Main.context.beginPath();
        for (var i = this.currentIndex; i < this.prevPoss.length; ++i) {
            Main.context.lineTo(Camera.xo + this.prevPoss[i][0], this.prevPoss[i][1]);
        }
        for (var i = 0; i < this.currentIndex; ++i) {
            Main.context.lineTo(Camera.xo + this.prevPoss[i][0], this.prevPoss[i][1]);
        }
        Main.context.stroke();
        Main.context.fillStyle = "#FFD";
        Main.context.fillRect(this.x + Camera.xo, this.y, 10, 10);
    };
    Plane.prototype.reset = function () {
        this.x = 0;
        this.y = Main.canvas.height / 2;
        this.xv = 5;
        this.yv = -12;
        this.prevPoss = new Array(75);
        for (var i = 0; i < this.prevPoss.length; ++i) {
            this.prevPoss[i] = [this.x, this.y];
        }
    };
    return Plane;
}());
var Camera = (function () {
    function Camera() {
    }
    Camera.update = function () {
        Camera.xo = Camera.leftOffset - Main.plane.x;
    };
    Camera.reset = function () {
        Camera.xo = 0;
    };
    Camera.xo = 0;
    Camera.leftOffset = 250;
    return Camera;
}());
var Keyboard = (function () {
    function Keyboard() {
    }
    Keyboard.keychange = function (event, down) {
        var keycode = event.keyCode ? event.keyCode : event.which;
        Keyboard.keysdown[keycode] = down;
    };
    Keyboard.reset = function () {
        Keyboard.keysdown = [];
    };
    Keyboard.KEYS = {
        BACKSPACE: 8, TAB: 9, RETURN: 13, ESC: 27, SPACE: 32, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, INSERT: 45, DELETE: 46, ZERO: 48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57, A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90, TILDE: 192, SHIFT: 999
    };
    Keyboard.keysdown = [];
    return Keyboard;
}());
function keydown(event) {
    Keyboard.keychange(event, true);
    if (event.keyCode === Keyboard.KEYS.SPACE)
        return false;
    if (event.keyCode === Keyboard.KEYS.UP)
        return false;
    if (event.keyCode === Keyboard.KEYS.DOWN)
        return false;
}
function keyup(event) {
    Keyboard.keychange(event, false);
}
function clickType(event) {
    if (event.which === 3 || event.button === 2)
        return "right";
    else if (event.which === 1 || event.button === 0)
        return "left";
    else if (event.which === 2 || event.button === 1)
        return "middle";
}
window.onkeydown = keydown;
window.onkeyup = keyup;
window.onload = function () {
    new Main().init();
};
