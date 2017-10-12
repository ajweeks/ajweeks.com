function get(what) {
    return document.getElementById(what);
}
var MODE;
(function (MODE) {
    MODE[MODE["AI"] = 0] = "AI";
    MODE[MODE["LOCAL"] = 1] = "LOCAL";
    MODE[MODE["MULTIPLAYER"] = 2] = "MULTIPLAYER";
})(MODE || (MODE = {}));
var Game = (function () {
    function Game() {
    }
    Game.init = function () {
        Game.canvas = get('gameCanvas');
        Game.canvasSize = { w: Game.canvas.width, h: Game.canvas.height };
        Game.context = Game.canvas.getContext('2d');
        Game.board = new Board();
        Game.render();
    };
    Game.render = function () {
        Game.context.fillStyle = "white";
        Game.context.fillRect(0, 0, Game.canvasSize.w, Game.canvasSize.h);
        Board.render();
    };
    Game.mode = MODE.AI;
    Game.over = false;
    return Game;
})();
var Board = (function () {
    function Board() {
        Board.clear(Game.mode);
    }
    Board.clear = function (mode) {
        var i, j;
        Board.winStates = new Array(9);
        for (i = 0; i < Board.winStates.length; ++i) {
            Board.winStates[i] = '';
        }
        Board.tiles = new Array(9);
        for (i = 0; i < Board.tiles.length; ++i) {
            Board.tiles[i] = new Array(9);
            for (j = 0; j < Board.tiles[i].length; ++j) {
                Board.tiles[i][j] = '';
            }
        }
        Board.playableArea = 10;
        Game.over = false;
        Board.playerTurn = 'X';
        Game.mode = mode;
        Board.hoverTile.x = null;
        Board.hoverTile.y = null;
        Board.hoverTile.bx = null;
        Board.hoverTile.by = null;
    };
    Board.prototype.hover = function (xx, yy) {
        if (Game.over)
            return;
        var bx = Math.floor((xx - 10) / (Board.tileSize * 3 + 10)), by = Math.floor((yy - 10) / (Board.tileSize * 3 + 10));
        bx = Board.clamp(bx, 0, 2);
        by = Board.clamp(by, 0, 2);
        var x = Math.floor((xx - 10 - (Board.tileSize * 3 + 10) * bx) / (Board.tileSize)), y = Math.floor((yy - 10 - (Board.tileSize * 3 + 10) * by) / (Board.tileSize));
        x = Board.clamp(x, 0, 2);
        y = Board.clamp(y, 0, 2);
        if (Board.tiles[bx + by * 3][x + y * 3] === '' && !Board.winStates[bx + by * 3]) {
            Board.hoverTile.bx = bx;
            Board.hoverTile.by = by;
            Board.hoverTile.x = x;
            Board.hoverTile.y = y;
        }
        else {
            Board.hoverTile.x = null;
            Board.hoverTile.y = null;
            Board.hoverTile.bx = null;
            Board.hoverTile.by = null;
        }
    };
    Board.clamp = function (n, min, max) {
        return n >= min && n <= max ? n : null;
    };
    Board.click = function (event, xx, yy) {
        if (Game.mode !== MODE.LOCAL && Board.playerTurn === 'O')
            return;
        var type = clickType(event);
        if ((type === "right" || type === "left") && Board.hoverTile.x !== null && Board.hoverTile.y !== null) {
            var bxy = Board.hoverTile.bx + Board.hoverTile.by * 3, xy = Board.hoverTile.x + Board.hoverTile.y * 3;
            if (bxy == Board.playableArea || Board.playableArea === 10) {
                Board.setTile(bxy, xy, Board.playerTurn);
                Board.playableArea = xy;
                Board.checkForBoardWinners();
                if (Board.winStates[Board.playableArea] && Board.winStates[Board.playableArea] !== '')
                    Board.playableArea = 10;
                Board.hoverTile.x = null;
                Board.hoverTile.y = null;
                Board.hoverTile.bx = null;
                Board.hoverTile.by = null;
                if (Game.mode === MODE.AI) {
                    AI.makeMove(Board.playableArea);
                }
                else if (Game.mode === MODE.LOCAL) {
                    Board.toggleTurns();
                }
                else if (Game.mode === MODE.MULTIPLAYER) {
                }
                else {
                    console.error("Unhandled game mode: " + Game.mode);
                }
            }
        }
    };
    Board.checkForBoardWinners = function () {
        for (var b = 0; b < Board.tiles.length; b++) {
            Board.winStates[b] = Board.getBoardWinState(Board.tiles[b]);
        }
        Board.checkForGameWinners();
    };
    Board.checkForGameWinners = function () {
        var gamewinner = Board.getBoardWinState(Board.winStates);
        if (gamewinner && gamewinner !== '') {
            Game.over = true;
            Board.playableArea = -1;
            createPopup('gameover');
        }
    };
    Board.getBoardWinState = function (tiles) {
        if (tiles[0] && tiles[0] === tiles[1] && tiles[1] === tiles[2])
            return tiles[0];
        if (tiles[3] && tiles[3] === tiles[4] && tiles[4] === tiles[5])
            return tiles[3];
        if (tiles[6] && tiles[6] === tiles[7] && tiles[7] === tiles[8])
            return tiles[6];
        if (tiles[0] && tiles[0] === tiles[3] && tiles[3] === tiles[6])
            return tiles[0];
        if (tiles[1] && tiles[1] === tiles[4] && tiles[4] === tiles[7])
            return tiles[1];
        if (tiles[2] && tiles[2] === tiles[5] && tiles[5] === tiles[8])
            return tiles[2];
        if (tiles[0] && tiles[0] === tiles[4] && tiles[4] === tiles[8])
            return tiles[0];
        if (tiles[2] && tiles[2] === tiles[4] && tiles[4] === tiles[6])
            return tiles[2];
        if (tiles[0] && tiles[1] && tiles[2] && tiles[3] && tiles[4]
            && tiles[5] && tiles[6] && tiles[7] && tiles[8])
            return 't';
        return '';
    };
    Board.render = function () {
        Game.context.strokeStyle = "#222";
        Game.context.lineWidth = 3;
        Board.drawGrid(5, 5, Board.tileSize * 3 + 10);
        if (Board.playableArea === -1)
            ;
        else if (Board.playableArea === 10) {
            Game.context.strokeStyle = "#6D7";
            Game.context.lineWidth = 20;
            Game.context.lineJoin = 'round';
            Game.context.strokeRect(0, 0, (Board.tileSize * 3 + 10) * 3 + 10, (Board.tileSize * 3 + 10) * 3 + 10);
        }
        else {
            Game.context.strokeStyle = "#6D7";
            Game.context.lineWidth = 10;
            Game.context.lineJoin = 'round';
            Game.context.strokeRect((Board.playableArea % 3) * (Board.tileSize * 3 + 10) + 5, Math.floor(Board.playableArea / 3) * (Board.tileSize * 3 + 10) + 5, (Board.tileSize * 3 + 10), (Board.tileSize * 3 + 10));
        }
        for (var b = 0; b < Board.tiles.length; b++) {
            var boardOffset = {
                x: (b % 3) * (3 * Board.tileSize + 10) + 10,
                y: Math.floor(b / 3) * (3 * Board.tileSize + 10) + 10
            };
            if (Board.winStates[b] && Board.winStates[b] !== '') {
                Game.context.fillStyle = Board.winStates[b] === 'X' ? '#6C6' : '#E56';
                Game.context.fillRect(boardOffset.x, boardOffset.y, Board.tileSize * 3, Board.tileSize * 3);
                Game.context.font = '210px SourceSansPro-Regular';
                Game.context.fillStyle = Board.winStates[b] === 'X' ? '#7F7' : '#F67';
                Game.context.fillText(Board.winStates[b], boardOffset.x + (Board.winStates[b] === 'X' ? 30 : 16), boardOffset.y + 153);
            }
            Game.context.fillStyle = "black";
            Game.context.font = '60px SourceSansPro-ExtraLight';
            for (var x = 0; x < Board.tiles[b].length; x++) {
                var innerOffset = {
                    x: (x % 3) * Board.tileSize + boardOffset.x + (Board.tiles[b][x] === 'X' ? 15 : 9),
                    y: Math.floor(x / 3) * Board.tileSize + boardOffset.y
                };
                Game.context.fillText(Board.tiles[b][x], innerOffset.x - 1, innerOffset.y + 49);
            }
        }
        Game.context.strokeStyle = "#777";
        Game.context.lineWidth = 2;
        for (var i = 0; i < 9; i++) {
            var offset = {
                x: (i % 3) * (3 * Board.tileSize + 10) + 10,
                y: Math.floor(i / 3) * (3 * Board.tileSize + 10) + 10
            };
            Board.drawGrid(offset.x, offset.y, Board.tileSize);
        }
        if (Board.hoverTile.x !== null && Board.hoverTile.y !== null) {
            Game.context.fillStyle = "rgba(130, 100, 160, 0.2)";
            Game.context.fillRect(Board.hoverTile.x * Board.tileSize + 10 + (Board.tileSize * 3 + 10) * Board.hoverTile.bx, Board.hoverTile.y * Board.tileSize + 10 + (Board.tileSize * 3 + 10) * Board.hoverTile.by, Board.tileSize, Board.tileSize);
            Game.context.fillStyle = 'white';
            Game.context.fillText(Board.playerTurn, Board.hoverTile.x * Board.tileSize + 10 + (Board.tileSize * 3 + 10) * Board.hoverTile.bx + (Board.playerTurn === 'X' ? 15 : 9), Board.hoverTile.y * Board.tileSize + 10 + (Board.tileSize * 3 + 10) * Board.hoverTile.by + 49);
        }
    };
    Board.drawGrid = function (x, y, colw) {
        Game.context.beginPath();
        Game.context.moveTo(x, y + colw);
        Game.context.lineTo(x + 3 * colw, y + colw);
        Game.context.stroke();
        Game.context.moveTo(x, y + 2 * colw);
        Game.context.lineTo(x + 3 * colw, y + 2 * colw);
        Game.context.stroke();
        Game.context.moveTo(x + colw, y);
        Game.context.lineTo(x + colw, y + 3 * colw);
        Game.context.stroke();
        Game.context.moveTo(x + 2 * colw, y);
        Game.context.lineTo(x + 2 * colw, y + 3 * colw);
        Game.context.stroke();
        Game.context.closePath();
    };
    Board.setTile = function (board, position, player) {
        var tile = Board.tiles[board][position];
        if (Board.winStates[board] === '' && tile !== 'X' && tile !== 'O') {
            Board.tiles[board][position] = player;
            return true;
        }
        return false;
    };
    Board.toggleTurns = function () {
        Board.playerTurn = (Board.playerTurn === 'X' ? 'O' : 'X');
    };
    Board.isFull = function () {
        for (var i = 0; i < Board.tiles.length; i++) {
            for (var j = 0; j < Board.tiles[i].length; j++) {
                if (Board.tiles[i][j] === '')
                    return false;
            }
        }
        return true;
    };
    Board.isBoardFull = function (board) {
        for (var i = 0; i < Board.tiles[board].length; ++i) {
            if (Board.tiles[board][i] === '')
                return false;
        }
        return true;
    };
    Board.tileSize = 56;
    Board.hoverTile = { x: null, y: null, bx: null, by: null };
    Board.playerTurn = 'X';
    Board.playableArea = 10;
    return Board;
})();
var AI = (function () {
    function AI() {
    }
    AI.makeMove = function (playableArea) {
        Board.playerTurn = 'O';
        window.setTimeout(AI.move, 500, playableArea);
    };
    AI.move = function (playableArea) {
        if (Board.isFull())
            Game.over = true;
        if (Game.over)
            return;
        var nextPlay = AI.getMove(playableArea);
        Board.tiles[nextPlay.board][nextPlay.pos] = Board.playerTurn;
        Board.toggleTurns();
        Board.checkForBoardWinners();
        if (Board.winStates[nextPlay.pos])
            Board.playableArea = 10;
        else
            Board.playableArea = nextPlay.pos;
        Game.render();
    };
    AI.getMove = function (playableArea) {
        var board = -1, pos = -1;
        if (playableArea === 10) {
            for (var i in Board.tiles) {
                var canWin = AI.canWinBoard(i);
                if (Board.winStates[i] === '' && canWin.index !== -1 && canWin.player == 'O') {
                    board = i;
                    pos = canWin.index;
                    return { board: board, pos: pos };
                }
            }
            do {
                board = Math.floor(Math.random() * 9);
                pos = Math.floor(Math.random() * 9);
            } while (!Board.setTile(board, pos, Board.playerTurn));
            return { board: board, pos: pos };
        }
        else if (playableArea >= 0 && playableArea <= 8) {
            board = playableArea;
            var canWin = AI.canWinBoard(playableArea);
            if (canWin.index !== -1) {
                if (canWin.player !== Board.playerTurn) {
                    if (!Board.isBoardFull(canWin.index) && Board.winStates[canWin.index] === '') {
                        pos = canWin.index;
                        return { board: board, pos: pos };
                    }
                    else {
                        do {
                            pos = Math.floor(Math.random() * 9);
                        } while (!Board.setTile(board, pos, Board.playerTurn));
                    }
                }
                else {
                    pos = canWin.index;
                    return { board: board, pos: pos };
                }
            }
            else {
                for (var i in Board.tiles[playableArea]) {
                    var canWin = AI.canWinBoard(i);
                    if (Board.tiles[playableArea][i] === '' && !Board.isBoardFull(i) && Board.winStates[i] === '' && canWin.index === -1) {
                        pos = i;
                        return { board: board, pos: pos };
                    }
                }
                for (var i in Board.tiles[playableArea]) {
                    if (Board.tiles[playableArea][i] === '' && Board.winStates[i] === '' && !Board.isBoardFull(i)) {
                        pos = i;
                        return { board: board, pos: pos };
                    }
                }
                do {
                    pos = Math.floor(Math.random() * 9);
                } while (!Board.setTile(board, pos, Board.playerTurn));
            }
        }
        else {
            console.error("Invalid playableArea: " + playableArea);
            return { board: -1, pos: -1 };
        }
        return { board: board, pos: pos };
    };
    AI.canWinBoard = function (board) {
        if (Board.winStates[board] !== '')
            return { player: null, index: -1 };
        var tiles = Board.tiles[board];
        if (tiles[1] && tiles[1] === tiles[2] && tiles[0] === '')
            return { player: tiles[1], index: 0 };
        if (tiles[0] && tiles[0] === tiles[2] && tiles[1] === '')
            return { player: tiles[0], index: 1 };
        if (tiles[0] && tiles[0] === tiles[1] && tiles[2] === '')
            return { player: tiles[0], index: 2 };
        if (tiles[4] && tiles[4] === tiles[5] && tiles[3] === '')
            return { player: tiles[4], index: 3 };
        if (tiles[3] && tiles[3] === tiles[5] && tiles[4] === '')
            return { player: tiles[3], index: 4 };
        if (tiles[3] && tiles[3] === tiles[4] && tiles[5] === '')
            return { player: tiles[3], index: 5 };
        if (tiles[7] && tiles[7] === tiles[8] && tiles[6] === '')
            return { player: tiles[7], index: 6 };
        if (tiles[6] && tiles[6] === tiles[8] && tiles[7] === '')
            return { player: tiles[6], index: 7 };
        if (tiles[6] && tiles[6] === tiles[7] && tiles[8] === '')
            return { player: tiles[6], index: 8 };
        if (tiles[3] && tiles[3] === tiles[6] && tiles[0] === '')
            return { player: tiles[3], index: 0 };
        if (tiles[0] && tiles[0] === tiles[6] && tiles[3] === '')
            return { player: tiles[0], index: 3 };
        if (tiles[0] && tiles[0] === tiles[3] && tiles[6] === '')
            return { player: tiles[0], index: 6 };
        if (tiles[4] && tiles[4] === tiles[7] && tiles[1] === '')
            return { player: tiles[4], index: 1 };
        if (tiles[1] && tiles[1] === tiles[7] && tiles[4] === '')
            return { player: tiles[1], index: 4 };
        if (tiles[1] && tiles[1] === tiles[4] && tiles[7] === '')
            return { player: tiles[1], index: 7 };
        if (tiles[5] && tiles[5] === tiles[8] && tiles[2] === '')
            return { player: tiles[5], index: 2 };
        if (tiles[2] && tiles[2] === tiles[8] && tiles[5] === '')
            return { player: tiles[2], index: 5 };
        if (tiles[2] && tiles[2] === tiles[5] && tiles[8] === '')
            return { player: tiles[2], index: 8 };
        if (tiles[4] && tiles[4] === tiles[8] && tiles[0] === '')
            return { player: tiles[4], index: 0 };
        if (tiles[0] && tiles[0] === tiles[8] && tiles[4] === '')
            return { player: tiles[0], index: 4 };
        if (tiles[0] && tiles[0] === tiles[4] && tiles[8] === '')
            return { player: tiles[0], index: 8 };
        if (tiles[4] && tiles[4] === tiles[6] && tiles[2] === '')
            return { player: tiles[4], index: 2 };
        if (tiles[2] && tiles[2] === tiles[6] && tiles[4] === '')
            return { player: tiles[2], index: 4 };
        if (tiles[2] && tiles[2] === tiles[4] && tiles[6] === '')
            return { player: tiles[2], index: 6 };
        return { player: null, index: -1 };
    };
    return AI;
})();
function createPopup(type) {
    switch (type) {
        case 'newgame':
            var str = '<h2>New Game</h2>' +
                '<h4 style="margin-bottom: 5px; margin-top: 0">VS:</h4>' +
                '<div class="button" onclick="Board.clear(MODE.AI); clearPopup(); Game.render();">Computer  </div>' +
                '<div class="button" onclick="Board.clear(MODE.LOCAL); clearPopup(); Game.render();">Local</div>' +
                '<div class="button" onclick="Board.clear(MODE.MULTIPLAYER); clearPopup(); Game.render();">Multiplayer</div>';
            showPopup(str);
            break;
        case 'rules':
            var str = '<h2>Rules</h2>' +
                '<span style="font-size: 24px">' +
                '<p>Same rules as Tic Tac Toe, except there are 9 <span style="color: #EAA">boards</span> instead of one ' +
                '(and therefore 27 <span style="color: #AAE">squares</span>). You can not play on just any ' +
                '<span style="color: #EAA">board</span>, whichever <em style="color: #AAE">square</em>  ' +
                'your opponent picked last turn determines ' +
                'which <em style="color: #EAA">board</em> you must play in this turn.</p>' +
                '<img src="../games/tictactoe/res/large_board.png" style="margin-right: 20px"></img>' +
                '<img src="../games/tictactoe/res/arrow.png" style="margin-bottom: 35px;"></img>' +
                '<img src="../games/tictactoe/res/small_board.png" style="margin-left: 20px"></img>' +
                '<p>For example: Playing in the top-right <em style="color: #AAE">square</em> of a small ' +
                '<span style="color: #EAA">board</span>, forces your opponent to play in the ' +
                'top-right <em style="color: #EAA">board</em> on their turn.</p>' +
                '<div class="button" onclick="clearPopup();">Got it</div>';
            showPopup(str, 'width: 750px; margin-left: 50%; margin-top: -60px; left: -390px; top: 12%;');
            break;
        case 'gameover':
            var str = '<h2>Game Over!</h2>' +
                '<h4>Winner: ' + Board.playerTurn + '</h4>' +
                '<div class="button" onclick="clearPopup(); createPopup(\'newgame\');">New Game</div>' +
                '<div class="button" onclick="clearPopup();">Close</div>';
            showPopup(str);
            break;
    }
}
function showPopup(html, css) {
    if (css === void 0) { css = ''; }
    get('darken').style.display = 'initial';
    get('popup').style.cssText = css;
    get('popup').innerHTML = html + '<a class="popupClose" onclick="clearPopup();">X</a>';
    get('popup').style.display = 'initial';
}
function clearPopup() {
    get('darken').style.display = 'none';
    get('popup').innerHTML = '';
    get('popup').style.display = 'none';
}
function clickType(event) {
    if (event.which === 3 || event.button === 2)
        return "right";
    else if (event.which === 1 || event.button === 0)
        return "left";
    else if (event.which === 2 || event.button === 1)
        return "middle";
}
function boardHover(event) {
    if (Game.board) {
        Game.board.hover(event.offsetX, event.offsetY);
        Game.render();
    }
}
function mouseExit() {
    Board.hoverTile = { x: null, y: null, bx: null, by: null };
    Board.render();
}
function boardClick(event) {
    Board.click(event, event.offsetX, event.offsetY);
    Game.render();
}
window.onkeydown = function (event) {
    if (event.keyCode === 27) {
        clearPopup();
    }
};
window.onload = function (event) {
    Game.init();
};
