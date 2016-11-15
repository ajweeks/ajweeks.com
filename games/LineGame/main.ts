
function get(what: string): HTMLElement {
    return document.getElementById(what);
}

class Main {

    static canvas: HTMLCanvasElement;
    static context: CanvasRenderingContext2D;
    static nodes: number[];
    static currentPosition = 0;
    static currentVel = 0.0;
    static currentLevel = 0;
    static wigglingFramesLeft = -1;
    static minFrames = 10;
    static framesSinceDirChange = Main.minFrames + 1;
    static framesToWiggle = 30;

    // 1 = enemy
    // 0 = empty
    // bottom to top
    static levels = [
        // 0
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
        0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        // 1
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // 2
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0,
        0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
        // 3
        [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
    ];

    init(): void {
        Main.canvas = <HTMLCanvasElement>get('gameCanvas');
        Main.context = Main.canvas.getContext('2d');

        Main.nodes = Main.levels[Main.currentLevel].slice();

        Main.reset();

        Main.loop();
    }

    static loop(): void {
        requestAnimationFrame(Main.loop);

        Main.context.fillStyle = "#111812";
        Main.context.fillRect(0, 0, Main.canvas.width, Main.canvas.height);

        Main.update();
        Main.render();
    }

	static update() {
        var speed = -0.16;
        var maxSpeed = 5.0;
        var velBefore = Main.currentVel;
        if (Keyboard.keysdown[Keyboard.KEYS.UP]) {
            Main.currentVel -= speed;
            if (Main.currentVel <- maxSpeed) Main.currentVel = -maxSpeed;
        } else if (Keyboard.keysdown[Keyboard.KEYS.DOWN]) {
            Main.currentVel += speed;
            if (Main.currentVel > maxSpeed) Main.currentVel = maxSpeed;
        }
        Main.currentVel *= 0.85;
        Main.currentPosition += Main.currentVel;

        if (Main.currentPosition < 0) Main.currentPosition = 0;
        if (Main.currentPosition > 79)
        {
            // Winner!
            Main.currentLevel++;
            if (Main.currentLevel >= Main.levels.length) Main.currentLevel = 0;
            Main.reset();
        }

        // Check for wiggles
        if ((velBefore > 0 && Main.currentVel < 0) ||
            (velBefore < 0 && Main.currentVel > 0))
        {
            if (Main.framesSinceDirChange < Main.minFrames) {
                Main.wigglingFramesLeft = Main.framesToWiggle;
                Main.framesSinceDirChange = 0;
            } else {
                Main.framesSinceDirChange = 0;
            }
        }
        if (Main.wigglingFramesLeft != -1) {
            Main.wigglingFramesLeft--;
        }
        Main.framesSinceDirChange++;

        // Collision detection
        if (Main.nodes[Math.ceil(Main.currentPosition)] == 1) {
            if (Main.wigglingFramesLeft == -1) {
                // Game over!
                Main.reset();
            } else {
                Main.nodes[Math.ceil(Main.currentPosition)] = 0;
            }
        }
	}

    static reset() {
        Main.nodes = Main.levels[Main.currentLevel].slice();
        Main.currentPosition = 0;
        Main.currentVel = 0.0;
        Main.framesSinceDirChange = Main.minFrames + 1;
        Main.wigglingFramesLeft = -1;

        document.title = "Line Game - " + (Main.currentLevel + 1);

        Keyboard.reset();
    }

	static render() {
        var x = 0,
            y = 790;
        var squareSize = 10;
        for (var i in Main.nodes) {
            if (Main.nodes[i] == 0) Main.context.fillStyle = "#632a2a";
            else if (Main.nodes[i] == 1) Main.context.fillStyle = "#3298a2";

            Main.context.fillRect(x, y, squareSize, squareSize);
            y -= squareSize;
        }

        if (Main.wigglingFramesLeft != -1) Main.context.fillStyle = Main.wigglingFramesLeft % 4 < 2 ? "#329bb8":"#44b1c4";
        else Main.context.fillStyle = "#f5eded";

        var playerY = 790 - Main.currentPosition * squareSize;
        Main.context.fillRect(x, playerY, squareSize, squareSize);
	}
}

class Keyboard {
    static KEYS = {
        BACKSPACE: 8, TAB: 9, RETURN: 13, ESC: 27, SPACE: 32, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, INSERT: 45, DELETE: 46, ZERO: 48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57, A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90, TILDE: 192, SHIFT: 999
    };

    static keysdown = [];

    static keychange(event: KeyboardEvent, down: boolean): void {
        var keycode = event.keyCode ? event.keyCode : event.which;
        Keyboard.keysdown[keycode] = down;
    }

    static reset() {
        Keyboard.keysdown = [];
    }
}

function keydown(event: KeyboardEvent) {
    Keyboard.keychange(event, true);

    // Prevent the page from scrolling down on space press
    if (event.keyCode === Keyboard.KEYS.SPACE) return false;
    if (event.keyCode === Keyboard.KEYS.UP) return false;
    if (event.keyCode === Keyboard.KEYS.DOWN) return false;
}

function keyup(event: KeyboardEvent) {
    Keyboard.keychange(event, false);
}

function clickType(event: MouseEvent): string {
    if (event.which === 3 || event.button === 2)
        return "right";
    else if (event.which === 1 || event.button === 0)
        return "left";
    else if (event.which === 2 || event.button === 1)
        return "middle";
}

window.onkeydown = keydown;
window.onkeyup = keyup;

window.onload = function() {
    new Main().init();
}
