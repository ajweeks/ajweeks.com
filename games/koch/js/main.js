// Copyright AJ Weeks 2015
/*
*
*   A simple Koch Snowflake rendering made with pure HTML5 / JS
*   Offers two modes currently:
*       0 - renders the current iteration of the snowflake (click to cycle through iterations)
*       1 - renders the first 8 iteraions of the snowflake at once in different colours (press 'm' to cycle through modes)
*
*/

var Game = {};

function render(index, all) {
    var context = Game.canvas.getContext('2d');
    context.fillStyle = "#2a2a4d";
    context.fillRect(0, 0, 650, 400);

    if (all) {
        renderAll(context);
    } else {
        renderDepth(context, index);
    }

    context.fillStyle = "#fff";
    context.font = "16px Verdana";
    if (!all) {
        context.fillText("iteration " + Game.iteration, 555, 25);
    } else {
        context.fillText("iterations 0-" + Game.MAX_ITERATION, 528, 25);
    }
    var len = Game.coords[index].length;
    if (Game.mode === 1) {
        len = 0;
        for (var point in Game.coords) {
            len += Game.coords[point].length;
        }
    }
    var slen = len.toString();
    if (len >= 1000) slen = (len / 1000).toString().split('.')[0] + '.' + (len / 1000).toString().split('.')[1].substr(0, 1) + 'k';
    context.fillText("# of coordinates: " + slen, 493 - (slen.length * 9.5), 50);
    context.fillText("Click to change the current iteration", 10, 25);
    context.fillText("'m' cycles through modes", 10, 50);
    context.fillText("'space' toggles wireframe", 10, 75);
    context.fillText("current mode: " + Game.mode, 507, 75);
}

/* Renders a koch snowflake with the given number of iterations */
function renderDepth(context, index) {
    context.fillStyle = "rgb(" + (150 - index * 50) + ", " + (index * 25) + ", " + (index * 60 + 50) + ")";
    context.strokeStyle = "rgb(" + (150 - index * 50) + ", " + (index * 25) + ", " + (index * 60 + 50) + ")";
    context.lineWidth = (Game.MAX_ITERATION - index) * 0.3;
    context.beginPath();
    for (var point in Game.coords[index]) {
        context.lineTo(Game.coords[index][point].x * 110 + 165, Game.coords[index][point].y * 110 + 295);
    }
    // draw final line, back to first point
    context.lineTo(Game.coords[index][0].x * 110 + 165, Game.coords[index][0].y * 110 + 295);
    context.closePath();
    if (Game.shift) context.stroke();
    else context.fill();
}

/* Renders the first 8 iterations of Koch snowflakes */
function renderAll(context) {
    for (var coord = 0; coord <= Game.MAX_ITERATION; coord++) {
        var c = Game.MAX_ITERATION - coord;
        generateCoords(c); // ensure all coords are generated (doesn't generate coords that have already been generated)

        context.fillStyle = "rgb(" + (c * c * 20 + 50) + ", " + (c * 35 + 65) + ", " + (65 + c * 64) + ")";
        context.strokeStyle = "rgb(" + (c * c * 20 + 50) + ", " + (c * 35 + 65) + ", " + (65 + c * 64) + ")";
        context.lineWidth = coord * 0.1;
        context.beginPath();
        for (var point in Game.coords[c]) {
            context.lineTo(Game.coords[c][point].x * 110 + 165, Game.coords[c][point].y * 110 + 295);
        }
        // draw final line, back to first point
        context.lineTo(Game.coords[0][0].x * 110 + 165, Game.coords[0][0].y * 110 + 295);
        context.closePath();
        if (Game.shift) context.stroke();
        else context.fill();
    }
}

/* Generates coordinates for a given depth, unless that depth has already been generated */
function generateCoords(depth) {
    if (typeof Game.coords[depth] !== "undefined") {
        return;
    }
    Game.coords[depth] = [];
    Game.coords[depth].push(new Game.Point(0, 0));
    // Three original lines (which make just a triangle with depth=0)
    nextLevel(depth, depth, 3.0, -Math.PI / 3); // -60
    nextLevel(depth, depth, 3.0, Math.PI / 3);  // +60
    nextLevel(depth, depth, 3.0, Math.PI);      // 180
    Game.coords[depth].pop(); // Remove the last point, which is the same as the first
}

function nextLevel(index, depth, size, heading) {
    if (depth === 0) {
        var lastPoint = Game.coords[index][Game.coords[index].length-1];
        Game.coords[index].push(new Game.Point(lastPoint.x + Math.cos(heading) * size, lastPoint.y + Math.sin(heading) * size));
        return;
    } else {
        // Split the line into four smaller lines (i.e.  ____  ->  _/\_ )
        nextLevel(index, depth - 1, size / 3, heading);
        nextLevel(index, depth - 1, size / 3, heading - Math.PI / 3); // -60
        nextLevel(index, depth - 1, size / 3, heading + Math.PI / 3); // +60
        nextLevel(index, depth - 1, size / 3, heading);
    }
}

Game.click = function(event) {
    Game.mode = 0;

    if (clickType(event) === 'left') {
        Game.iteration++;
        if (Game.iteration > Game.MAX_ITERATION) Game.iteration = 0;
    } else if (clickType(event) === 'right') {
        Game.iteration--;
        if (Game.iteration < 0) Game.iteration = Game.MAX_ITERATION;
    }

    generateCoords(Game.iteration);
    render(Game.iteration, false);
};

window.addEventListener("onmousewheel", onscroll, false);
window.addEventListener("mousewheel", onscroll, false);
window.addEventListener("DOMMouseScroll", onscroll, false);

function onscroll (event) {
    Game.mode = 0;

    Game.iteration += (event.wheelDelta || -event.detail) > 0 ? 1 : -1;
    if (Game.iteration > Game.MAX_ITERATION) Game.iteration = 0;
    if (Game.iteration < 0) Game.iteration = Game.MAX_ITERATION;

    generateCoords(Game.iteration);
    render(Game.iteration, false);
}

window.onkeypress = function (event) {
    if (event.keyCode === 109 || event.key === 'm') {
        Game.mode++;
        Game.mode &= 1;

        render(Game.iteration, Game.mode === 1);
    } else if (event.keyCode=== 32 || event.key === ' ') {
        Game.shift += 1;
        Game.shift &= 1;

        render(Game.iteration, Game.mode === 1);
    }
};

function clickType(event) {
    if (event.which === 3 || event.button === 2) return "right";
    else if (event.which === 1 || event.button === 0) return "left";
    else if (event.which === 2 || event.button === 1) return "middle";
}

Game.Point = function(x, y) {
    this.x = x;
    this.y = y;
};

window.onload = function (event) {
    Game.canvas = document.getElementById('canvas');
    Game.mouseX = 0;
    Game.mouseY = 0;
    Game.iteration = 0;
    Game.MAX_ITERATION = 8;
    Game.mode = 0; // mode 0 = render one snowflake, mode 1 = render all mode (press 'm' to cycle through modes)
    Game.shift = 0;
    Game.coords = [];

    generateCoords(Game.iteration);

    render(Game.iteration, false);
};
